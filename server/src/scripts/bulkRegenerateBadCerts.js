// server/src/scripts/bulkRegenerateBadCerts.js
// Finds certificates where userName looks like an email and regenerates them.
// Run: node src/scripts/bulkRegenerateBadCerts.js [--dry-run]

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Import models and services — adjust paths if needed
import Certificate from '../models/Certificate.js';
import User from '../models/User.js';
import certificateService from '../services/certificateService.js';

const DRY_RUN = process.argv.includes('--dry-run');

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // 1. Get ALL certificates (non-revoked)
  const allCerts = await Certificate.find({ isRevoked: { $ne: true } })
    .populate('userId', 'firstName lastName email')
    .lean();

  console.log(`Total certificates found: ${allCerts.length}`);

  // 2. Filter to ones where we can detect the problem
  // The PDF was generated with email instead of name, but we can't read the PDF.
  // Strategy: regenerate any cert where the user HAS a real name (firstName exists).
  // This is safe because regeneration is idempotent — correct certs just get re-rendered.
  // If you only want to target known-bad ones, filter by date range or specific users.
  const needsRegen = allCerts.filter(cert => {
    const user = cert.userId;
    if (!user) return false;
    // User has a real name we can use
    const hasName = (user.firstName || '').trim().length > 0;
    return hasName;
  });

  console.log(`Certificates eligible for regeneration: ${needsRegen.length}`);

  if (DRY_RUN) {
    console.log('\n--- DRY RUN MODE ---');
    needsRegen.forEach(cert => {
      const u = cert.userId;
      const name = `${u.firstName || ''} ${u.lastName || ''}`.trim();
      console.log(`  ${cert.certificateNumber} | user: ${u.email} → "${name}"`);
    });
    console.log('\nRun without --dry-run to execute.');
    await mongoose.disconnect();
    return;
  }

  // 3. Regenerate in batches of 5 to avoid Cloudinary rate limits
  const BATCH_SIZE = 5;
  let success = 0;
  let failed = 0;
  const failures = [];

  for (let i = 0; i < needsRegen.length; i += BATCH_SIZE) {
    const batch = needsRegen.slice(i, i + BATCH_SIZE);

    await Promise.all(batch.map(async (cert) => {
      const user = cert.userId;
      const userName = `${(user.firstName || '')} ${(user.lastName || '')}`.trim() || user.email;

      try {
        // Look up course info
        const courseDoc = await mongoose.model('InteractiveCourse').findById(cert.courseId)
          .select('title ceHours nbccProgramNumber')
          .lean();

        if (!courseDoc) {
          // Try the courses collection as fallback
          const legacyCourse = await mongoose.model('Course').findById(cert.courseId)
            .select('title ceHours nbccProgramNumber')
            .lean();
          if (!legacyCourse) {
            console.log(`  SKIP ${cert.certificateNumber} — course not found`);
            failed++;
            failures.push({ certNumber: cert.certificateNumber, reason: 'course not found' });
            return;
          }
          Object.assign(courseDoc || {}, legacyCourse);
        }

        const course = courseDoc;

        // Generate new PDF
        const result = await certificateService.generatePDF({
          certificateNumber: cert.certificateNumber,
          userName,
          courseTitle: course.title,
          completionDate: cert.completionDate,
          ceHours: cert.ceHours,
          nbccNumber: course.nbccProgramNumber,
          providerNumber: '7760'
        });

        // result might be a URL string or an object — handle both
        const newFileUrl = typeof result === 'string' ? result : result?.fileUrl || result?.secure_url;
        const newFileKey = typeof result === 'object' ? result?.fileKey || result?.public_id : null;

        // Update the certificate document
        const updateFields = { fileUrl: newFileUrl };
        if (newFileKey) updateFields.fileKey = newFileKey;

        await Certificate.updateOne({ _id: cert._id }, { $set: updateFields });

        // Best-effort delete old PDF
        if (cert.fileKey && typeof certificateService.deletePDF === 'function') {
          try {
            await certificateService.deletePDF(cert.fileKey);
          } catch (e) {
            // Non-fatal
          }
        }

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
