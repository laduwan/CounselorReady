/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * restoreCourse.js — put a single course back from a snapshot
 *
 * DRY-RUN BY DEFAULT. Nothing is written without --apply.
 *
 * Usage (Render shell, from ~/project/src/server):
 *   node src/scripts/restoreCourse.js --key=db-backups/courses/CR-301/2026-08-31T14-05-22Z__slug.json
 *   node src/scripts/restoreCourse.js --key=db-backups/nightly/2026-08-30/courses/CR-301__slug.json --apply
 *   node src/scripts/restoreCourse.js --file=backups/courses/CR-301/2026-08-31T14-05-22Z__slug.json --apply
 *
 * What it does:
 *   1. Loads the snapshot (Extended JSON → real ObjectIds/Dates)
 *   2. Snapshots the CURRENT live document first (so the restore itself is reversible)
 *   3. replaceOne({ _id }) with upsert — whole-document restore, raw driver, no Mongoose validators
 *   4. Reads back and verifies section/block counts
 *
 * This is a whole-document overwrite of ONE course by _id. It is the only
 * script allowed to do that, and only with --apply.
 */

import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import {
  getObjectText,
  parseDoc,
  courseSummary,
  snapshotCourse,
  printSnapshotNotice,
  s3Enabled,
  BACKUP_BUCKET,
} from '../services/dbBackupService.js';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('No MONGODB_URI'); process.exit(1); }

const flags = Object.fromEntries(
  process.argv.slice(2).filter(a => a.startsWith('--')).map(a => {
    const [k, ...v] = a.slice(2).split('=');
    return [k, v.length ? v.join('=') : true];
  })
);

if (!flags.key && !flags.file) {
  console.error('Usage: node src/scripts/restoreCourse.js --key=<S3 key> | --file=<local path>  [--apply]');
  process.exit(1);
}
const APPLY = flags.apply === true;

async function loadSnapshot() {
  if (flags.file) {
    const p = path.resolve(process.cwd(), String(flags.file));
    console.log(`[restoreCourse] reading local ${p}`);
    return parseDoc(fs.readFileSync(p, 'utf8'));
  }
  if (!s3Enabled()) throw new Error('S3 not configured — cannot read --key');
  console.log(`[restoreCourse] reading s3://${BACKUP_BUCKET}/${flags.key}`);
  return parseDoc(await getObjectText(String(flags.key)));
}

async function main() {
  const snap = await loadSnapshot();
  if (!snap || !snap._id) throw new Error('Snapshot has no _id — not a course document');
  const target = courseSummary(snap);

  await mongoose.connect(MONGODB_URI);
  const col = mongoose.connection.db.collection('interactivecourses');
  const live = await col.findOne({ _id: snap._id });

  console.log('\n[restoreCourse] SNAPSHOT →');
  console.table(target);
  if (live) {
    console.log('[restoreCourse] LIVE (will be replaced) →');
    console.table(courseSummary(live));
  } else {
    console.log('[restoreCourse] LIVE: document not found — restore will INSERT it (upsert).');
  }

  if (!APPLY) {
    console.log('\n[restoreCourse] DRY RUN — nothing written. Re-run with --apply to restore.\n');
    await mongoose.disconnect();
    return;
  }

  if (live) {
    console.log('\n[restoreCourse] snapshotting current live doc before overwrite…');
    const rec = await snapshotCourse(live, { reason: `pre-restore safety copy (restoring from ${flags.key || flags.file})` });
    printSnapshotNotice([rec]);
  }

  const res = await col.replaceOne({ _id: snap._id }, snap, { upsert: true });
  console.log(`[restoreCourse] replaceOne → matched ${res.matchedCount}, modified ${res.modifiedCount}, upserted ${res.upsertedCount}`);

  const after = await col.findOne({ _id: snap._id });
  const verify = courseSummary(after);
  const ok = verify.sections === target.sections && verify.contentBlocks === target.contentBlocks && verify.assessmentQuestions === target.assessmentQuestions;
  console.log('[restoreCourse] READ-BACK →');
  console.table(verify);
  console.log(ok ? '\n✅ Restore verified.\n' : '\n⚠ Read-back counts differ from snapshot — inspect before trusting.\n');

  await mongoose.disconnect();
  process.exit(ok ? 0 : 2);
}

main().catch(err => { console.error('[restoreCourse] ✗', err.message); process.exit(1); });
