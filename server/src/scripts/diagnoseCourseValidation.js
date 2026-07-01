/**
 * Diagnose course.save() validation failures.
 *
 * The admin editor saves via course.save(), which runs FULL-document Mongoose
 * validation. Any single field anywhere in the document that violates the schema
 * (a drifted enum, a missing required subfield, etc.) makes the entire save throw
 * a generic 500. This script finds those offenders precisely, so "save failed"
 * becomes "courseX.assessment.questions[3].type = 'multiple_choice' is not a valid enum".
 *
 * Run on the Render shell (working dir ~/project/src/server):
 *     node src/scripts/diagnoseCourseValidation.js                 # all courses
 *     node src/scripts/diagnoseCourseValidation.js CR-501          # one course by code
 *     node src/scripts/diagnoseCourseValidation.js <mongoId>       # one course by _id
 *
 * Read-only. It does NOT modify anything.
 */
import mongoose from 'mongoose';
import { Course } from '../models/InteractiveCourse.js';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('❌ No MONGODB_URI environment variable set'); process.exit(1); }

const arg = process.argv[2];

function describe(err) {
  // err is a Mongoose ValidationError; err.errors is keyed by path
  const rows = [];
  for (const [path, e] of Object.entries(err.errors || {})) {
    rows.push({
      path,
      kind: e.kind,                                  // 'enum' | 'required' | 'Number' | ...
      value: e.value === undefined ? '(undefined)' : JSON.stringify(e.value),
      message: e.message,
    });
  }
  return rows;
}

(async () => {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected.\n');

  let query = {};
  if (arg) {
    query = mongoose.isValidObjectId(arg) ? { _id: arg } : { courseCode: arg };
  }

  const courses = await Course.find(query).lean(false); // hydrated docs so validateSync works
  if (!courses.length) { console.log('No courses matched', arg || '(all)'); await mongoose.disconnect(); return; }

  console.log(`Validating ${courses.length} course(s)...\n`);
  let badCount = 0;

  for (const c of courses) {
    const err = c.validateSync();
    const label = `${c.courseCode || '(no code)'} — "${c.title || ''}" [${c._id}]`;
    if (!err) {
      console.log(`✓ ${label}`);
      continue;
    }
    badCount++;
    const rows = describe(err);
    console.log(`✗ ${label}`);
    console.log(`  ${rows.length} invalid field(s) — course.save() would 500 here:`);
    for (const r of rows) {
      console.log(`    • ${r.path}`);
      console.log(`        rule: ${r.kind}   value: ${r.value}`);
      console.log(`        ${r.message}`);
    }
    console.log('');
  }

  console.log('────────────────────────────────────────');
  console.log(`${courses.length} checked · ${badCount} would fail save · ${courses.length - badCount} OK`);
  if (badCount) {
    console.log('\nThese are exactly the fields to fix (or that the editor must sanitize) before save() succeeds.');
  }
  await mongoose.disconnect();
})().catch(async (e) => { console.error('Fatal:', e); try { await mongoose.disconnect(); } catch {} process.exit(1); });
