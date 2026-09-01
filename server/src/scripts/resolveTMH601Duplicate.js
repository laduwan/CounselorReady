/**
 * resolveTMH601Duplicate.js
 * GAITP LLC · NBCC ACEP #7760
 *
 * Two live, published documents in interactivecourses share
 * courseCode: "CR-TMH601" (same createdAt timestamp to the millisecond,
 * same 59,319 word count — a genuine duplicate pair, not yet in
 * reconcileDuplicates.js). Per Ke's explicit reconciliation:
 *
 *   - "Mastering TeleMental Health: Compliant Virtual Practice in Georgia"
 *     (slug mastering-telemental-health-an-essential-guide-to-a-compliant-
 *     virtual-healthcare-practice-in-georgia-mkkycoyo) -> CR-601
 *   - "TeleMental Health Supervision" (already CR-602, slug
 *     telemental-health-supervision-georgia-rule-135-11) -> unchanged,
 *     verified only
 *   - "Mastering TeleMental Health" (short slug mastering-telemental-health)
 *     -> CR-603
 *
 * Verified CR-601 and CR-603 are unused by any other course before writing.
 * This does NOT touch content, sections, or anything else — courseCode
 * only. Per CLAUDE.md's "Database Backups — Snapshot Before Every Course
 * Write" rule, each course gets a pre-write snapshot via
 * dbBackupService.snapshotCourse() before its courseCode is changed.
 *
 * DRY RUN by default:
 *   node src/scripts/resolveTMH601Duplicate.js
 * Write:
 *   node src/scripts/resolveTMH601Duplicate.js --execute
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { pathToFileURL } from 'url';
import { Course } from '../models/InteractiveCourse.js';
import { snapshotCourse } from '../services/dbBackupService.js';

dotenv.config();

const EXECUTE = process.argv.includes('--execute');

const PLAN = [
  {
    _id: '699766ce2b436278fb309c8b',
    expectedSlug: 'mastering-telemental-health-an-essential-guide-to-a-compliant-virtual-healthcare-practice-in-georgia-mkkycoyo',
    fromCode: 'CR-TMH601',
    toCode: 'CR-601',
  },
  {
    _id: '69b8e3349bd83faed3a9ecfd',
    expectedSlug: 'mastering-telemental-health',
    fromCode: 'CR-TMH601',
    toCode: 'CR-603',
  },
];

const VERIFY_ONLY = {
  _id: '69ea00be88b3a5ee642dbc1f',
  expectedSlug: 'telemental-health-supervision-georgia-rule-135-11',
  expectedCode: 'CR-602',
};

async function main() {
  if (!process.env.MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }
  await mongoose.connect(process.env.MONGODB_URI);

  console.log('\n==============================================================================');
  console.log(`resolveTMH601Duplicate — ${EXECUTE ? 'EXECUTING WRITE' : 'DRY RUN (pass --execute to write)'}`);
  console.log('==============================================================================');

  // Collision check: CR-601 / CR-603 must not already belong to a different course.
  for (const { toCode } of PLAN) {
    const clash = await Course.findOne({ courseCode: toCode });
    if (clash && !PLAN.some(p => String(clash._id) === p._id)) {
      console.log(`ABORT: ${toCode} is already used by "${clash.title}" [${clash._id}] — not touching anything.`);
      await mongoose.disconnect();
      process.exit(1);
    }
  }

  const supervision = await Course.findById(VERIFY_ONLY._id);
  if (!supervision) {
    console.log(`⚠ Supervision course not found at ${VERIFY_ONLY._id} — expected slug ${VERIFY_ONLY.expectedSlug}`);
  } else if (supervision.slug !== VERIFY_ONLY.expectedSlug || supervision.courseCode !== VERIFY_ONLY.expectedCode) {
    console.log(`⚠ Supervision course doesn't match expectations — slug="${supervision.slug}" courseCode="${supervision.courseCode}". Not changing it, but verify this is still the right course.`);
  } else {
    console.log(`✓ "${supervision.title}" — already ${VERIFY_ONLY.expectedCode}, unchanged.`);
  }

  for (const { _id, expectedSlug, fromCode, toCode } of PLAN) {
    const doc = await Course.findById(_id);
    if (!doc) { console.log(`✗ NOT FOUND: ${_id} (expected -> ${toCode})`); continue; }

    if (doc.slug !== expectedSlug || doc.courseCode !== fromCode) {
      console.log(`⚠ SKIP ${_id}: expected slug="${expectedSlug}" courseCode="${fromCode}", found slug="${doc.slug}" courseCode="${doc.courseCode}". Content may have changed — not touching.`);
      continue;
    }

    console.log(`• "${doc.title}" [${_id}]: courseCode ${doc.courseCode} -> ${toCode}`);

    if (EXECUTE) {
      // snapshotCourse() EJSON-serializes its input; a live Mongoose document's
      // subdocument arrays (e.g. assessment.questions) carry an internal
      // __parentArray circular back-reference that breaks that serialization.
      // toObject() strips Mongoose's internal bookkeeping first.
      const backup = await snapshotCourse(doc.toObject(), { reason: `resolveTMH601Duplicate.js — recode ${fromCode} -> ${toCode}` });
      console.log(`    backup: ${backup.s3Uri || backup.localPath || '(none — check S3/local config)'}`);
      doc.courseCode = toCode;
      await doc.save();
      console.log(`    ✓ saved — courseCode is now ${toCode}`);
    } else {
      console.log(`    (dry run) would back up, then save`);
    }
  }

  console.log('==============================================================================\n');
  await mongoose.disconnect();
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(e => { console.error('ERROR:', e.message); process.exit(2); });
}
