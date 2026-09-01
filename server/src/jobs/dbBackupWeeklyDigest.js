/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * Weekly DB Backup Digest Job
 *
 * Zips the per-course JSON files from the most recent nightly dump into one
 * archive under S3 db-backups/weekly/<date>/, and emails a 7-day signed
 * download link. Unlike the nightly folders, weekly zips are never pruned —
 * they are the long-lived hard copy.
 *
 * READ-ONLY against MongoDB — this job never connects to Mongo directly, it
 * only re-packages objects the nightly job already wrote to S3.
 *
 * Where it goes:
 *   s3://<bucket>/db-backups/weekly/<YYYY-MM-DD>/courses-<sourceNightlyDate>.zip
 *
 * Scheduled via node-cron — see server/src/index.js.
 * Schedule: Mondays 6:30 AM ET (30 6 * * 1, America/New_York)
 * Manual run: node src/scripts/runDbBackupDigest.js   (from ~/project/src/server on Render)
 */

import {
  s3Enabled,
  BACKUP_BUCKET,
  BACKUP_PREFIX,
  dateFolder,
  latestNightlyFolder,
  buildWeeklyDigest,
  emailWeeklyDigestNotice,
  fmtBytes,
} from '../services/dbBackupService.js';

const LOG = '[DbBackupWeeklyDigest]';

export async function runDbBackupWeeklyDigest({ notify = true } = {}) {
  const started = Date.now();
  const weeklyFolder = dateFolder();
  const report = {
    ok: false, weeklyFolder, sourceFolder: null, count: 0, bytes: 0,
    s3Key: null, s3Uri: null, downloadUrl: null, error: null, ms: 0,
  };

  console.log(`${LOG} Weekly digest starting → s3://${BACKUP_BUCKET}/${BACKUP_PREFIX}/weekly/${weeklyFolder}/`);

  if (!s3Enabled()) {
    report.error = 'S3 not configured — set DB_BACKUP_S3_BUCKET (or AWS_S3_RECORDINGS_BUCKET) plus AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY';
    console.error(`${LOG} ✗ ${report.error}`);
    report.ms = Date.now() - started;
    if (notify) await emailWeeklyDigestNotice(report);
    return report;
  }

  try {
    const sourceFolder = await latestNightlyFolder();
    if (!sourceFolder) throw new Error('No nightly backup folders found to digest');
    report.sourceFolder = sourceFolder;

    const digest = await buildWeeklyDigest(weeklyFolder, sourceFolder);
    report.count = digest.count;
    report.bytes = digest.bytes;
    report.s3Key = digest.s3Key;
    report.s3Uri = digest.s3Uri;
    report.downloadUrl = digest.downloadUrl;

    console.log(`${LOG} ✓ ${digest.count} course file(s) zipped from ${sourceFolder} → ${digest.s3Uri} (${fmtBytes(digest.bytes)})`);
    report.ok = true;
  } catch (err) {
    report.error = err.message;
    console.error(`${LOG} ✗ Weekly digest failed:`, err.message);
  }

  report.ms = Date.now() - started;
  console.log(`${LOG} ${report.ok ? 'Done' : 'FAILED'} in ${(report.ms / 1000).toFixed(1)}s`);

  if (notify) {
    try { await emailWeeklyDigestNotice(report); } catch (e) { console.error(`${LOG} notice email failed:`, e.message); }
  }
  return report;
}
