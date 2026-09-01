/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * backupCourse.js — pre-write snapshot for interactivecourses
 *
 * RUN THIS BEFORE ANY $set / MCP WRITE TO A COURSE.
 *
 * Usage (Render shell, from ~/project/src/server):
 *   node src/scripts/backupCourse.js CR-301
 *   node src/scripts/backupCourse.js CR-301 CR-302 CR-TMH601
 *   node src/scripts/backupCourse.js --slug=mastering-telemental-health-abc123
 *   node src/scripts/backupCourse.js --all
 *   node src/scripts/backupCourse.js CR-301 --reason="expand intro before $set"
 *
 * Flags:
 *   --reason="..."   recorded in the notice (what you're about to change)
 *   --no-email       skip the Resend notice (console notice always prints)
 *   --no-local       S3 only
 *   --no-s3          local only
 *
 * Where copies go (printed at the end of every run):
 *   Local: <server>/backups/courses/<CODE>/<timestamp>__<slug>.json
 *          (on Render this is ephemeral — the S3 copy is the durable one)
 *   S3:    s3://<bucket>/db-backups/courses/<CODE>/<timestamp>__<slug>.json
 *
 * Read-only against MongoDB.
 */

import mongoose from 'mongoose';
import {
  findCourses,
  snapshotCourse,
  printSnapshotNotice,
  emailSnapshotNotice,
  s3Enabled,
  BACKUP_BUCKET,
  BACKUP_PREFIX,
  LOCAL_BACKUP_DIR,
} from '../services/dbBackupService.js';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('No MONGODB_URI'); process.exit(1); }

const args = process.argv.slice(2);
const flags = Object.fromEntries(
  args.filter(a => a.startsWith('--')).map(a => {
    const [k, ...v] = a.slice(2).split('=');
    return [k, v.length ? v.join('=') : true];
  })
);
const codes = args.filter(a => !a.startsWith('--'));
const slugs = flags.slug ? String(flags.slug).split(',') : [];
const all = flags.all === true;

if (!all && !codes.length && !slugs.length) {
  console.error('Usage: node src/scripts/backupCourse.js <CODE> [<CODE> ...] | --slug=<slug> | --all  [--reason="..."] [--no-email] [--no-local] [--no-s3]');
  process.exit(1);
}

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log(`[backupCourse] connected · S3 ${s3Enabled() ? `→ s3://${BACKUP_BUCKET}/${BACKUP_PREFIX}/courses/` : 'NOT configured'} · local → ${LOCAL_BACKUP_DIR}/courses/`);

  const { found, missing } = await findCourses({ codes, slugs, all });
  console.log(`[backupCourse] ${found.length} course(s) found${missing.length ? `, ${missing.length} missing` : ''}`);

  const records = [];
  for (const course of found) {
    const rec = await snapshotCourse(course, {
      local: !flags['no-local'],
      remote: !flags['no-s3'],
      reason: typeof flags.reason === 'string' ? flags.reason : '',
    });
    records.push(rec);
    console.log(`  ✓ ${rec.courseCode || rec.slug}${rec.s3Uri ? ' → S3' : ''}${rec.localPath ? ' → local' : ''}${rec.s3Error ? ' (S3 failed)' : ''}`);
  }

  printSnapshotNotice(records, missing);

  if (!flags['no-email'] && records.length) {
    const sent = await emailSnapshotNotice(records, missing, {
      reason: typeof flags.reason === 'string' ? flags.reason : '',
      invokedBy: `backupCourse.js (${process.env.RENDER ? 'Render shell' : 'local'})`,
    });
    console.log(sent ? '[backupCourse] notice emailed to ADMIN_ALERT_EMAIL' : '[backupCourse] RESEND_API_KEY not set — no email sent');
  }

  await mongoose.disconnect();
  if (missing.length || records.some(r => r.s3Error && !r.localPath)) process.exit(2);
}

main().catch(err => { console.error('[backupCourse] ✗', err.message); process.exit(1); });
