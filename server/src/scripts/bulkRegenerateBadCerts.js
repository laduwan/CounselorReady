// ⚠️  DO NOT RUN — PRODUCES NON-COMPLIANT CERTIFICATES.
//
// This script regenerates certificates via certificateService.generatePDF(), which
// omits the synchronous/asynchronous delivery designation required by GA Board Rule
// 135-9-.01(4)(c), along with approval blocks and learning objectives.
//
// Any certificate this script rewrites is downgraded and would fail a CE audit.
//
// It must be ported to utils/certificate.js (with buildApprovalBlock) before use.
// Until then, treat it as quarantined.
// server/src/scripts/bulkRegenerateBadCerts.js
// Regenerates all certificates with the user's current firstName/lastName.
// Run from Render shell: node src/scripts/bulkRegenerateBadCerts.js --dry-run
// Then:                   node src/scripts/bulkRegenerateBadCerts.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Import models directly — standalone scripts don't auto-register
import Certificate from '../models/Certificate.js';
import User from '../models/User.js';
import { Course as InteractiveCourse } from '../models/InteractiveCourse.js';
import certificateService from '../services/certificateService.js';

// Also import Course.js for legacy certs
let Course;
try {
  const mod = await import('../models/Course.js');
  Course = mod.default;
} catch (e) {
  console.log('Course.js model not found — legacy fallback disabled');
}

const DRY_RUN = process.argv.includes('--dry-run');

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // 1. Get all non-revoked certificates
  const allCerts = await Certificate.find({ isRevoked: { $ne: true } }).lean();
  console.log(`Total certificates: ${allCerts.length}`);

  // 2. Look up each cert's user
  const userIds = [...new Set(allCerts.map(c => c.userId?.toString()).filter(Boolean))];
  const users = await User.find({ _id: { $in: userIds } }).select('profile.firstName profile.lastName email').lean();
  const userMap = {};
  users.forEach(u => { userMap[u._id.toString()] = u; });

  // 3. Filter to certs where user has a real name
  const needsRegen = allCerts.filter(cert => {
    const user = userMap[cert.userId?.toString()];
    if (!user) return false;
    return (user.profile?.firstName || '').trim().length > 0;
  });

  console.log(`Eligible for regeneration: ${needsRegen.length}`);

  if (DRY_RUN) {
    console.log('\n--- DRY RUN ---');
    for (const cert of needsRegen) {
      const u = userMap[cert.userId.toString()];
      const name = `${u.profile?.firstName || ''} ${u.profile?.lastName || ''}`.trim();
      const hasUrl = cert.fileUrl ? 'has URL' : 'NO URL';
      console.log(`  ${cert.certificateNumber} | ${u.email} → "${name}" | ${hasUrl}`);
    }
    console.log(`\n${needsRegen.length} certs would be regenerated. Run without --dry-run to execute.`);
    await mongoose.disconnect();
    return;
  }

  // 4. Look up all courses we'll need
  const courseIds = [...new Set(needsRegen.map(c => c.courseId?.toString()).filter(Boolean))];
  
  const icCourses = await InteractiveCourse.find({ _id: { $in: courseIds } })
    .select('title ceHours nbccProgramNumber').lean();
  const courseMap = {};
  icCourses.forEach(c => { courseMap[c._id.toString()] = c; });

  // Fallback to legacy Course collection for any missing
  if (Course) {
    const missingIds = courseIds.filter(id => !courseMap[id]);
    if (missingIds.length > 0) {
      const legacyCourses = await Course.find({ _id: { $in: missingIds } })
        .select('title ceHours nbccProgramNumber').lean();
      legacyCourses.forEach(c => { courseMap[c._id.toString()] = c; });
    }
  }

  // 5. Regenerate in batches
  const BATCH_SIZE = 5;
  let success = 0;
  let failed = 0;
  let skipped = 0;
  const failures = [];

  for (let i = 0; i < needsRegen.length; i += BATCH_SIZE) {
    const batch = needsRegen.slice(i, i + BATCH_SIZE);
    console.log(`\nBatch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(needsRegen.length / BATCH_SIZE)}`);

    await Promise.all(batch.map(async (cert) => {
      const user = userMap[cert.userId.toString()];
      const course = courseMap[cert.courseId?.toString()];
      const userName = `${(user.profile?.firstName || '')} ${(user.profile?.lastName || '')}`.trim() || user.email;

      if (!course) {
        console.log(`  SKIP ${cert.certificateNumber} — course not found`);
        skipped++;
        return;
      }

      try {
        const newUrl = await certificateService.generatePDF({
          certificateNumber: cert.certificateNumber,
          userName,
          courseTitle: course.title,
          completionDate: cert.completionDate,
          ceHours: cert.ceHours,
          nbccNumber: course.nbccProgramNumber || '',
          providerNumber: '7760'
        });

        // newUrl is a string (Cloudinary secure_url)
        const updateFields = { fileUrl: newUrl };

        // Best-effort delete old PDF
        if (cert.fileKey && typeof certificateService.deletePDF === 'function') {
          try { await certificateService.deletePDF(cert.fileKey); } catch (e) { /* non-fatal */ }
        }

        await Certificate.updateOne({ _id: cert._id }, { $set: updateFields });

        console.log(`  ✓ ${cert.certificateNumber} → "${userName}"`);
        success++;
      } catch (err) {
        console.log(`  ✗ ${cert.certificateNumber} — ${err.message}`);
        failed++;
        failures.push({ certNumber: cert.certificateNumber, reason: err.message });
      }
    }));

    // Pause between batches
    if (i + BATCH_SIZE < needsRegen.length) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  console.log(`\n=== DONE ===`);
  console.log(`Regenerated: ${success}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed: ${failed}`);
  if (failures.length > 0) {
    console.log('\nFailures:');
    failures.forEach(f => console.log(`  ${f.certNumber}: ${f.reason}`));
  }

  await mongoose.disconnect();
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
