/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 *
 * Nightly DB Backup Job
 *
 * Dumps `interactivecourses` (plus any collections in DB_BACKUP_COLLECTIONS)
 * to S3 as gzipped Extended-JSON NDJSON, writes each course as its own JSON
 * file for one-course restores, writes a manifest, prunes nightly folders older
 * than DB_BACKUP_RETENTION_DAYS (default 30), and emails Ke a notice saying
 * exactly where everything went.
 *
 * READ-ONLY against MongoDB. Never writes to the database.
 *
 * Where it goes:
 *   s3://<bucket>/db-backups/nightly/<YYYY-MM-DD>/<collection>.ndjson.gz
 *   s3://<bucket>/db-backups/nightly/<YYYY-MM-DD>/courses/<CODE>__<slug>.json
 *   s3://<bucket>/db-backups/nightly/<YYYY-MM-DD>/manifest.json
 *
 * Scheduled via node-cron — see server/src/index.js.
 * Schedule: nightly 2 AM ET (0 2 * * *, America/New_York)
 * Manual run: node src/scripts/runDbBackup.js   (from ~/project/src/server on Render)
 *
 * Atlas Cloud Backup (M10) remains the disaster-recovery layer; this job is the
 * per-course hard-copy layer that survives a bad $set or a deleted document.
 */

import {
  s3Enabled,
  BACKUP_BUCKET,
  BACKUP_PREFIX,
  RETENTION_DAYS,
  dateFolder,
  dumpCollectionToS3,
  dumpCoursesIndividuallyToS3,
  pruneNightly,
  putObject,
  emailNightlyNotice,
  fmtBytes,
} from '../services/dbBackupService.js';

const LOG = '[DbBackup]';

function collectionsToDump() {
  return (process.env.DB_BACKUP_COLLECTIONS || 'interactivecourses')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
}

export async function runDbBackup({ notify = true } = {}) {
  const started = Date.now();
  const folder = dateFolder();
  const report = { ok: false, folder, dumps: [], perCourse: null, prune: null, manifestKey: null, error: null, ms: 0 };

  console.log(`${LOG} Nightly backup starting → s3://${BACKUP_BUCKET}/${BACKUP_PREFIX}/nightly/${folder}/`);

  if (!s3Enabled()) {
    report.error = 'S3 not configured — set DB_BACKUP_S3_BUCKET (or AWS_S3_RECORDINGS_BUCKET) plus AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY';
    console.error(`${LOG} ✗ ${report.error}`);
    report.ms = Date.now() - started;
    if (notify) await emailNightlyNotice(report);
    return report;
  }

  try {
    for (const name of collectionsToDump()) {
      const d = await dumpCollectionToS3(name, folder);
      report.dumps.push(d);
      console.log(`${LOG} ✓ ${name}: ${d.docs} docs → ${d.s3Uri} (${fmtBytes(d.bytes)} gz)`);
    }

    if (collectionsToDump().includes('interactivecourses')) {
      report.perCourse = await dumpCoursesIndividuallyToS3(folder);
      console.log(`${LOG} ✓ per-course files: ${report.perCourse.count} → …/nightly/${folder}/courses/ (${fmtBytes(report.perCourse.bytes)})`);
    }

    const manifest = {
      generatedAt: new Date().toISOString(),
      bucket: BACKUP_BUCKET,
      prefix: `${BACKUP_PREFIX}/nightly/${folder}/`,
      dumps: report.dumps,
      courses: report.perCourse ? report.perCourse.files : [],
    };
    const manifestKey = `${BACKUP_PREFIX}/nightly/${folder}/manifest.json`;
    await putObject(manifestKey, JSON.stringify(manifest, null, 2));
    report.manifestKey = manifestKey;

    report.prune = await pruneNightly(RETENTION_DAYS);
    if (report.prune.prunedFolders.length) {
      console.log(`${LOG} ✓ pruned ${report.prune.prunedFolders.length} folder(s) older than ${RETENTION_DAYS}d: ${report.prune.prunedFolders.join(', ')}`);
    } else {
      console.log(`${LOG} ✓ retention: nothing older than ${RETENTION_DAYS}d to prune (${report.prune.kept.length} nightly folder(s) kept)`);
    }

    report.ok = true;
  } catch (err) {
    report.error = err.message;
    console.error(`${LOG} ✗ Backup failed:`, err.message);
  }

  report.ms = Date.now() - started;
  console.log(`${LOG} ${report.ok ? 'Done' : 'FAILED'} in ${(report.ms / 1000).toFixed(1)}s`);

  if (notify) {
    try { await emailNightlyNotice(report); } catch (e) { console.error(`${LOG} notice email failed:`, e.message); }
  }
  return report;
}
