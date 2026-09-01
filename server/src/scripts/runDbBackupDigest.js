/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * runDbBackupDigest.js — run the weekly backup digest job on demand
 *
 * Usage (Render shell, from ~/project/src/server):
 *   node src/scripts/runDbBackupDigest.js            # zips + emails 7-day signed link
 *   node src/scripts/runDbBackupDigest.js --no-email
 *
 * Read-only against MongoDB (does not connect to Mongo — re-packages the
 * latest nightly per-course files already in S3). Writes only to S3.
 */
import { runDbBackupWeeklyDigest } from '../jobs/dbBackupWeeklyDigest.js';

const notify = !process.argv.includes('--no-email');

runDbBackupWeeklyDigest({ notify })
  .then((report) => {
    console.log('\n[runDbBackupDigest] WHERE IT WENT:');
    console.log(`  ${report.ok ? '✅' : '❌'} ${report.s3Uri || '(not written)'}`);
    if (report.sourceFolder) console.log(`  • source nightly folder: ${report.sourceFolder}`);
    if (report.count) console.log(`  • ${report.count} course file(s) zipped (${report.bytes} bytes)`);
    if (report.downloadUrl) console.log(`  • 7-day signed link: ${report.downloadUrl}`);
    if (report.error) console.log(`  ✗ ${report.error}`);
    console.log(`  notice email: ${notify ? (process.env.RESEND_API_KEY ? 'sent to ADMIN_ALERT_EMAIL' : 'skipped (no RESEND_API_KEY)') : 'skipped (--no-email)'}\n`);
    process.exit(report.ok ? 0 : 1);
  })
  .catch(err => { console.error('[runDbBackupDigest] ✗', err.message); process.exit(1); });
