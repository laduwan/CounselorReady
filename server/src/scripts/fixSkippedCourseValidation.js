/**
 * fixSkippedCourseValidation.js
 *
 * Repairs the InteractiveCourse docs that recalcAllWordCounts.js SKIPPED on
 * validation, so their wordCount can be recomputed. Two root causes:
 *   (1) sections[].order / contentBlocks[].order missing (both schema-required).
 *   (2) calloutType values like 'document'/'reference' that aren't in the enum
 *       (InteractiveCourse.js:131 — info,warning,ethics,clinical,tip,key,donot,protocol).
 *
 * The viewer (interactive-course.html) already renders any unknown calloutType
 * as 'info', so remapping invalid values to 'info' is a visual no-op.
 *
 * This script ONLY sets `order` indices and remaps the calloutType string. It
 * never deletes or moves block content. It re-validates before saving and
 * refuses to write a still-broken doc. Idempotent: re-running changes nothing
 * once a course is fixed. Saving recomputes wordCount via the pre-save hook.
 *
 * NAMED import below: the default export of InteractiveCourse.js is a plain
 * object with no .find — importing the default is the exact bug that made
 * recalcAllWordCounts.js skip these docs.
 *
 * Run on the Render shell (working dir ~/project/src/server):
 *     node src/scripts/fixSkippedCourseValidation.js CR-501          # one course by code
 *     node src/scripts/fixSkippedCourseValidation.js <mongoId>       # one course by _id
 *     node src/scripts/fixSkippedCourseValidation.js --all           # every course
 *     node src/scripts/fixSkippedCourseValidation.js --all --dry     # report only, no writes
 */
import mongoose from 'mongoose';
import { Course } from '../models/InteractiveCourse.js';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('❌ No MONGODB_URI environment variable set'); process.exit(1); }

const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const ALL = args.includes('--all');
const target = args.find(a => !a.startsWith('--'));

const VALID_CALLOUTS = new Set(['info', 'warning', 'ethics', 'clinical', 'tip', 'key', 'donot', 'protocol']);
const CALLOUT_REMAP = { document: 'info', reference: 'info' }; // any other invalid value also → 'info'

// Mutates `course` in place. Returns per-course counts. Only touches `order`
// and `calloutType` — never block content.
function repairCourse(course) {
  let orderFixed = 0, calloutRemapped = 0;
  const slug = course.slug || String(course._id);

  (course.sections || []).forEach((sec, si) => {
    if (sec.order === undefined || sec.order === null) { sec.order = si; orderFixed++; }

    (sec.contentBlocks || []).forEach((blk, bi) => {
      if (blk.order === undefined || blk.order === null) { blk.order = bi; orderFixed++; }

      if (blk.calloutType && !VALID_CALLOUTS.has(blk.calloutType)) {
        const oldVal = blk.calloutType;
        const newVal = CALLOUT_REMAP[oldVal] || 'info';
        blk.calloutType = newVal;
        calloutRemapped++;
        console.log(`remap ${slug} s${si}.b${bi}: '${oldVal}' -> '${newVal}'`);
      }
    });
  });

  return { orderFixed, calloutRemapped };
}

function validationPaths(course) {
  const err = course.validateSync();
  if (!err) return [];
  return Object.keys(err.errors);
}

(async () => {
  await mongoose.connect(MONGODB_URI);
  console.log(DRY ? 'Connected to MongoDB (DRY RUN — no writes).\n' : 'Connected to MongoDB.\n');

  let query = {};
  if (target) query = mongoose.isValidObjectId(target) ? { _id: target } : { courseCode: target };
  else if (!ALL) { console.error('Specify a course code/_id, or --all.'); await mongoose.disconnect(); process.exit(1); }

  const courses = await Course.find(query);
  console.log(`Found ${courses.length} course(s)\n`);

  let scanned = 0, orderFieldsFixed = 0, calloutTypesRemapped = 0, saved = 0, stillInvalid = 0;

  for (const course of courses) {
    scanned++;
    const slug = course.slug || String(course._id);
    const oldWc = course.wordCount ?? 0;

    const { orderFixed, calloutRemapped } = repairCourse(course);
    orderFieldsFixed += orderFixed;
    calloutTypesRemapped += calloutRemapped;

    const remaining = validationPaths(course);
    if (remaining.length) {
      stillInvalid++;
      console.log(`✗ STILL INVALID ${slug}: ${remaining.join(', ')}`);
      continue; // never write a broken doc
    }

    if (DRY) {
      console.log(`${slug} | ${oldWc} -> (dry run, not saved)`);
      continue;
    }

    await course.save(); // recomputes wordCount via pre-save hook
    saved++;
    console.log(`${slug} | ${oldWc} -> ${course.wordCount ?? 0}`);
  }

  console.log('\n── Summary ────────────────────────────────────────────');
  console.log(`  Total scanned        : ${scanned}`);
  console.log(`  Order fields fixed   : ${orderFieldsFixed}`);
  console.log(`  calloutTypes remapped: ${calloutTypesRemapped}`);
  console.log(`  Saved                : ${saved}${DRY ? ' (dry run)' : ''}`);
  console.log(`  Still invalid        : ${stillInvalid}`);

  await mongoose.disconnect();
})().catch(async (e) => { console.error('❌ Fatal:', e); try { await mongoose.disconnect(); } catch {} process.exit(1); });
