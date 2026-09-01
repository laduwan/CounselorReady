/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * runDbBackup.js — run the nightly backup job on demand
 *
 * Usage (Render shell, from ~/project/src/server):
 *   node src/scripts/runDbBackup.js            # dumps + prunes + emails notice
 *   node src/scripts/runDbBackup.js --no-email
 *
 * Read-only against MongoDB. Writes only to S3.
 */
import mongoose from 'mongoose';
import { runDbBackup } from '../jobs/dbBackup.js';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('No MONGODB_URI'); process.exit(1); }

const notify = !process.argv.includes('--no-email');

mongoose.connect(MONGODB_URI)
  .then(() => runDbBackup({ notify }))
  .then(async (report) => {
    console.log('\n[runDbBackup] WHERE IT WENT:');
    console.log(`  ${report.ok ? '✅' : '❌'} s3://${process.env.DB_BACKUP_S3_BUCKET || process.env.AWS_S3_RECORDINGS_BUCKET || '(no bucket)'}/${(process.env.DB_BACKUP_S3_PREFIX || 'db-backups')}/nightly/${report.folder}/`);
    for (const d of report.dumps) console.log(`  • ${d.collection}: ${d.docs} docs → ${d.s3Uri}`);
    if (report.perCourse) console.log(`  • ${report.perCourse.count} per-course files under …/courses/`);
    if (report.manifestKey) console.log(`  • manifest → ${report.manifestKey}`);
    if (report.error) console.log(`  ✗ ${report.error}`);
    console.log(`  notice email: ${notify ? (process.env.RESEND_API_KEY ? 'sent to ADMIN_ALERT_EMAIL' : 'skipped (no RESEND_API_KEY)') : 'skipped (--no-email)'}\n`);
    await mongoose.disconnect();
    process.exit(report.ok ? 0 : 1);
  })
  .catch(err => { console.error('[runDbBackup] ✗', err.message); process.exit(1); });
