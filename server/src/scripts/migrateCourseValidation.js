// migrateCourseValidation.js
// One-time fix for courses that fail validation on publish (May 2026).
// Run: node src/scripts/migrateCourseValidation.js --dry   (preview only)
//      node src/scripts/migrateCourseValidation.js          (writes)
//
// Fixes:
//   1. accessType: 'paid' -> 'purchase'
//   2. nbccContentAreas: maps legacy long-form names to schema enum
//   3. contentBlocks[].order: backfills missing order field with index+1
//   4. question.type: 'multiple_choice' -> 'multipleChoice'
//      (in both contentBlocks and assessment.questions)

import mongoose from 'mongoose';

const DRY = process.argv.includes('--dry') || process.argv.includes('--dry-run');

const NBCC_MAP = {
  'Counseling Theory and Practice': 'Counseling Theory/Practice',
  'Counselor Professional Identity and Practice Issues': 'Professional Identity',
  'Research and Program Evaluation': 'Research/Program Evaluation',
  'Group Dynamics and Counseling': 'Group Dynamics',
  'Career Development and Counseling': 'Career Development',
  'Wellness Promotion and Prevention': 'Wellness and Prevention'
};

const QTYPE_MAP = {
  'multiple_choice': 'multipleChoice',
  'multi_select': 'multiSelect',
  'true_false': 'trueFalse'
};

const ACCESS_MAP = {
  'paid': 'purchase'
};

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) { console.error('MONGODB_URI not set'); process.exit(1); }
  await mongoose.connect(uri);

  const C = mongoose.connection.collection('interactivecourses');
  const docs = await C.find({}).toArray();
  console.log('Scanned', docs.length, 'courses\n');

  let fixed = 0;

  for (const d of docs) {
    const updates = {};
    const log = [];

    if (d.accessType && ACCESS_MAP[d.accessType]) {
      updates.accessType = ACCESS_MAP[d.accessType];
      log.push('  accessType: ' + d.accessType + ' -> ' + ACCESS_MAP[d.accessType]);
    }

    if (Array.isArray(d.nbccContentAreas)) {
      const mapped = d.nbccContentAreas.map(v => NBCC_MAP[v] || v);
      if (JSON.stringify(mapped) !== JSON.stringify(d.nbccContentAreas)) {
        updates.nbccContentAreas = mapped;
        log.push('  nbccContentAreas: ' + d.nbccContentAreas.length + ' values normalized');
      }
    }

    if (Array.isArray(d.sections)) {
      let orderFixed = 0, typeFixed = 0;
      const newSections = d.sections.map(s => {
        const newBlocks = (s.contentBlocks || []).map((b, i) => {
          const nb = { ...b };
          if (nb.order === undefined || nb.order === null) {
            nb.order = i + 1;
            orderFixed++;
          }
          if (nb.question && QTYPE_MAP[nb.question.type]) {
            nb.question = { ...nb.question, type: QTYPE_MAP[nb.question.type] };
            typeFixed++;
          }
          if (Array.isArray(nb.questions)) {
            nb.questions = nb.questions.map(q => {
              if (QTYPE_MAP[q.type]) {
                typeFixed++;
                return { ...q, type: QTYPE_MAP[q.type] };
              }
              return q;
            });
          }
          return nb;
        });
        return { ...s, contentBlocks: newBlocks };
      });
      if (orderFixed > 0 || typeFixed > 0) {
        updates.sections = newSections;
        if (orderFixed) log.push('  sections: backfilled order on ' + orderFixed + ' blocks');
        if (typeFixed) log.push('  sections: normalized question.type on ' + typeFixed + ' blocks');
      }
    }

    if (d.assessment && Array.isArray(d.assessment.questions)) {
      let qFixed = 0;
      const newQs = d.assessment.questions.map(q => {
        if (QTYPE_MAP[q.type]) {
          qFixed++;
          return { ...q, type: QTYPE_MAP[q.type] };
        }
        return q;
      });
      if (qFixed > 0) {
        updates['assessment.questions'] = newQs;
        log.push('  assessment.questions: normalized type on ' + qFixed + ' questions');
      }
    }

    if (Object.keys(updates).length > 0) {
      console.log('FIX: ' + d.title);
      log.forEach(l => console.log(l));
      if (!DRY) {
        await C.updateOne({ _id: d._id }, { $set: updates });
      }
      fixed++;
    }
  }

  console.log('\n===============================');
  console.log('Fixed: ' + fixed + ' courses');
  if (DRY) console.log('(DRY RUN - nothing was written)');
  console.log('===============================\n');

  await mongoose.disconnect();
}

main().catch(e => {
  console.error('FATAL:', e.message);
  process.exit(1);
});
