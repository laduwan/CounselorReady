/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 */

/**
 * deleteLegacyGeriatricDuplicates.js
 *
 * Removes the 5 stale geriatric duplicates (CR-610..CR-614) from the legacy
 * `courses` collection. Each has a confirmed canonical twin in
 * `interactivecourses`, and no live runtime code reads the legacy copies.
 *
 * SAFETY:
 *   - Only targets the 5 geriatric courseCodes (CR-610..CR-614).
 *   - Hard-skips any record whose title matches the protected intentional
 *     duplicates (TeleMental Health / Neurobiology) even if mis-coded.
 *   - Requires a canonical twin in `interactivecourses` before deleting.
 *   - Snapshots every matched record to a timestamped backup collection first.
 *   - DRY-RUN by default. Pass --confirm to actually back up and delete.
 *
 * Run (from ~/project/src/server):
 *   node src/scripts/deleteLegacyGeriatricDuplicates.js            # dry run
 *   node src/scripts/deleteLegacyGeriatricDuplicates.js --confirm  # back up + delete
 */
import mongoose from 'mongoose';

const CONFIRM = process.argv.includes('--confirm');
const TARGET_CODES = ['CR-610', 'CR-611', 'CR-612', 'CR-613', 'CR-614'];
const PROTECTED_TITLE = /telemental|neurobiology/i;

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const courses = db.collection('courses');
  const interactive = db.collection('interactivecourses');

  const candidates = await courses
    .find({ courseCode: { $in: TARGET_CODES } })
    .toArray();

  const toDelete = [];
  for (const c of candidates) {
    if (PROTECTED_TITLE.test(c.title || '')) {
      console.log('SKIP (protected title):', c.courseCode, '|', c.title);
      continue;
    }
    const twin = await interactive.findOne(
      { $or: [{ title: c.title }, { courseCode: c.courseCode }] },
      { projection: { _id: 1 } }
    );
    if (!twin) {
      console.log('SKIP (no canonical twin):', c.courseCode, '|', c.title);
      continue;
    }
    toDelete.push(c);
  }

  console.log(`\nMatched ${toDelete.length} legacy duplicate(s) safe to delete:`);
  toDelete.forEach((c) =>
    console.log('  ', c.courseCode, '|', c.title, '| _id:', c._id.toString())
  );

  if (toDelete.length === 0) {
    console.log('\nNothing to do.');
    await mongoose.disconnect();
    return;
  }

  if (!CONFIRM) {
    console.log('\nDRY RUN — nothing deleted. Re-run with --confirm to back up and delete.');
    await mongoose.disconnect();
    return;
  }

  const backupName = `course_backups_legacy_geriatric_${Date.now()}`;
  await db.collection(backupName).insertMany(toDelete);
  console.log(`\nBacked up ${toDelete.length} doc(s) to collection: ${backupName}`);

  const ids = toDelete.map((c) => c._id);
  const res = await courses.deleteMany({ _id: { $in: ids } });
  console.log(`Deleted ${res.deletedCount} doc(s) from 'courses'.`);
  console.log(`Restore if needed: copy docs from '${backupName}' back into 'courses'.`);

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
