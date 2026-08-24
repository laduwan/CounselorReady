/**
 * fixSkippedCourseValidation.js
 *
 * Fixes the 12 courses that recalcAllWordCounts skipped due to Mongoose
 * validation failures. Uses raw updateOne/$set — never .save() — so
 * Mongoose validators do not block the repair writes.
 *
 * Problems fixed:
 *   1. accessType: 'paid'              → 'subscription'
 *   2. deliveryFormat: 'online'        → 'async'
 *   3. nbccContentAreas: invalid value → remove invalid entries
 *   4. assessment.questions[*].type: 'multiple_choice' → 'multipleChoice'
 *   5. sections[*].order missing       → assign 1, 2, 3 …
 *   6. sections[*].contentBlocks[*].order missing → assign 1, 2, 3 …
 *   7. description missing/empty       → set to subtitle or courseCode
 *
 * After this script, re-run: node src/scripts/recalcAllWordCounts.js
 *
 * Usage:
 *   node src/scripts/fixSkippedCourseValidation.js          # dry-run
 *   node src/scripts/fixSkippedCourseValidation.js --apply  # write
 */

import 'dotenv/config';
import mongoose from 'mongoose';

const APPLY = process.argv.includes('--apply');
const DRY   = !APPLY;

if (!process.env.MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }

const VALID_ACCESS_TYPES      = new Set(['free', 'subscription', 'purchase']);
const VALID_DELIVERY_FORMATS  = new Set(['async', 'live', 'hybrid']);
const VALID_NBCC_AREAS        = new Set([
  'Counseling Theory/Practice','Human Growth and Development','Social and Cultural Foundations',
  'Group Dynamics','Career Development','Assessment','Research/Program Evaluation',
  'Professional Identity','Wellness and Prevention',
]);
const VALID_QUESTION_TYPES    = new Set(['multipleChoice', 'multiSelect', 'trueFalse']);

const ACCESS_TYPE_REMAP   = { paid: 'subscription', premium: 'subscription' };
const DELIVERY_FMT_REMAP  = { online: 'async', asynchronous: 'async', 'on-demand': 'async' };
const QUESTION_TYPE_REMAP = { multiple_choice: 'multipleChoice', multi_select: 'multiSelect', true_false: 'trueFalse' };

function fixOrder(arr) {
  if (!Array.isArray(arr)) return arr;
  return arr.map((item, i) => {
    if (item && (item.order === undefined || item.order === null || item.order === '')) {
      return { ...item, order: i + 1 };
    }
    return item;
  });
}

function fixSections(sections) {
  if (!Array.isArray(sections)) return sections;
  return fixOrder(sections).map(sec => ({
    ...sec,
    contentBlocks: fixOrder(sec.contentBlocks || []),
  }));
}

function fixAssessmentQuestions(questions) {
  if (!Array.isArray(questions)) return questions;
  return questions.map(q => {
    const t = q.type;
    if (t && !VALID_QUESTION_TYPES.has(t)) {
      return { ...q, type: QUESTION_TYPE_REMAP[t] || 'multipleChoice' };
    }
    return q;
  });
}

function inspect(course) {
  const issues = [];
  const setPayload = {};

  const at = course.accessType;
  if (at && !VALID_ACCESS_TYPES.has(at)) {
    const fixed = ACCESS_TYPE_REMAP[at] || 'subscription';
    issues.push(`accessType '${at}' → '${fixed}'`);
    setPayload.accessType = fixed;
  }

  const df = course.deliveryFormat;
  if (df && !VALID_DELIVERY_FORMATS.has(df)) {
    const fixed = DELIVERY_FMT_REMAP[(df || '').toLowerCase()] || 'async';
    issues.push(`deliveryFormat '${df}' → '${fixed}'`);
    setPayload.deliveryFormat = fixed;
  }

  if (Array.isArray(course.nbccContentAreas)) {
    const valid = course.nbccContentAreas.filter(a => VALID_NBCC_AREAS.has(a));
    if (valid.length !== course.nbccContentAreas.length) {
      const invalid = course.nbccContentAreas.filter(a => !VALID_NBCC_AREAS.has(a));
      issues.push(`nbccContentAreas removed invalid: ${invalid.join(', ')}`);
      setPayload.nbccContentAreas = valid;
    }
  }

  const qs = course.assessment && course.assessment.questions;
  if (Array.isArray(qs)) {
    const fixedQs = fixAssessmentQuestions(qs);
    const changed = fixedQs.some((q, i) => q.type !== qs[i].type);
    if (changed) {
      const badTypes = qs.filter(q => !VALID_QUESTION_TYPES.has(q.type)).map(q => q.type);
      issues.push(`assessment question types: ${[...new Set(badTypes)].join(', ')} → multipleChoice`);
      setPayload['assessment.questions'] = fixedQs;
    }
  }

  if (Array.isArray(course.sections)) {
    let sectionOrderMissing = 0;
    let blockOrderMissing = 0;
    for (const sec of course.sections) {
      if (sec.order === undefined || sec.order === null || sec.order === '') sectionOrderMissing++;
      if (Array.isArray(sec.contentBlocks)) {
        for (const b of sec.contentBlocks) {
          if (b.order === undefined || b.order === null || b.order === '') blockOrderMissing++;
        }
      }
    }
    if (sectionOrderMissing > 0 || blockOrderMissing > 0) {
      if (sectionOrderMissing > 0) issues.push(`${sectionOrderMissing} section(s) missing order`);
      if (blockOrderMissing > 0)  issues.push(`${blockOrderMissing} contentBlock(s) missing order`);
      setPayload.sections = fixSections(course.sections);
    }
  }

  if (!course.description || course.description.trim() === '') {
    const fallback = course.subtitle || (course.courseCode + ' CE course');
    issues.push(`description missing → set from subtitle/courseCode`);
    setPayload.description = fallback || 'CE course';
  }

  return { issues, setPayload };
}

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('interactivecourses');
  const courses = await col.find({}).toArray();

  console.log('\n' + '='.repeat(72));
  console.log('fixSkippedCourseValidation — ' + (DRY ? 'DRY RUN (no writes)' : 'APPLYING WRITES'));
  console.log('Scanning ' + courses.length + ' courses...');
  console.log('='.repeat(72) + '\n');

  let needsFix = 0, written = 0, clean = 0;

  for (const course of courses) {
    const { issues, setPayload } = inspect(course);
    if (issues.length === 0) { clean++; continue; }

    needsFix++;
    const label = (course.courseCode || '(none)').padEnd(16) + ' ' + (course.slug || String(course._id));
    console.log('NEEDS FIX: ' + label);
    issues.forEach(i => console.log('  • ' + i));

    if (!DRY) {
      setPayload.updatedAt = new Date();
      const result = await col.updateOne({ _id: course._id }, { $set: setPayload });
      if (result.modifiedCount === 1) {
        const rb = await col.findOne({ _id: course._id }, {
          projection: { accessType: 1, deliveryFormat: 1, nbccContentAreas: 1, description: 1, 'assessment.questions': 1, sections: 1 }
        });
        const stillBad = [
          (rb.accessType && !VALID_ACCESS_TYPES.has(rb.accessType))     && 'accessType',
          (rb.deliveryFormat && !VALID_DELIVERY_FORMATS.has(rb.deliveryFormat)) && 'deliveryFormat',
          ((rb.assessment && rb.assessment.questions) || []).some(q => q.type && !VALID_QUESTION_TYPES.has(q.type)) && 'questionType',
          (rb.nbccContentAreas || []).some(a => !VALID_NBCC_AREAS.has(a)) && 'nbccContentAreas',
          (rb.sections || []).some(s => s.order == null || (s.contentBlocks || []).some(b => b.order == null)) && 'order',
        ].filter(Boolean);
        if (stillBad.length === 0) { console.log('  WRITTEN & verified'); written++; }
        else console.error('  WRITTEN but still bad: ' + stillBad.join(', '));
      } else {
        console.error('  WRITE FAILED (modifiedCount=0)');
      }
    }
  }

  console.log('\n' + '='.repeat(72));
  console.log('SUMMARY');
  console.log('  Scanned:  ' + courses.length);
  console.log('  Clean:    ' + clean);
  console.log('  Needs fix:' + needsFix);
  if (!DRY) console.log('  Written:  ' + written);
  if (DRY) console.log('\n  Re-run with --apply, then re-run recalcAllWordCounts.js');
  else     console.log('\n  Now re-run: node src/scripts/recalcAllWordCounts.js');
  console.log('='.repeat(72) + '\n');

  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
