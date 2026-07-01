/**
 * repairBrokenCert.js
 * 
 * Repairs a Certificate record that exists but has incomplete data:
 * missing title, fileUrl (no PDF), wrong category, no courseId link.
 * Regenerates the PDF, uploads to Cloudinary, and patches the record.
 * Also creates/fixes CourseProgress if needed.
 *
 * USAGE:
 *   node src/scripts/repairBrokenCert.js <email> <courseSlugOrTitleFragment>
 *   node src/scripts/repairBrokenCert.js <email> <courseSlugOrTitleFragment> --commit
 *
 * EXAMPLES:
 *   node src/scripts/repairBrokenCert.js sarahoverton@example.com "telemental"
 *   node src/scripts/repairBrokenCert.js sarahoverton@example.com "telemental" --commit
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Readable } from 'stream';
import { v2 as cloudinary } from 'cloudinary';

import User from '../models/User.js';
import { Course, CourseProgress } from '../models/InteractiveCourse.js';
import Certificate from '../models/Certificate.js';
import {
  generateCertificate,
  generateCertificateNumber,
  buildApprovalBlock,
} from '../utils/certificate.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('❌ MONGODB_URI not set'); process.exit(1); }

const email = process.argv[2];
const courseFrag = process.argv[3];
const COMMIT = process.argv.includes('--commit');

if (!email || !courseFrag) {
  console.error('Usage: node src/scripts/repairBrokenCert.js <email> <courseSlugOrTitleFragment> [--commit]');
  process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function resolveCourse(frag) {
  if (mongoose.Types.ObjectId.isValid(frag)) {
    const byId = await Course.findById(frag);
    if (byId) return byId;
  }
  const bySlug = await Course.findOne({ slug: frag });
  if (bySlug) return bySlug;
  const rx = new RegExp(frag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  const matches = await Course.find({ title: rx }).select('title slug ceHours categories acepNumber approvals ceCategory contentArea learningObjectives objectives presenter settings');
  if (matches.length === 1) return matches[0];
  if (matches.length > 1) {
    console.error(`⚠️  ${matches.length} courses match "${frag}":`);
    matches.forEach(c => console.error(`   …${c._id.toString().slice(-8)}  "${c.title}"  (slug ${c.slug})`));
    console.error('Re-run with the exact slug or _id.');
    return null;
  }
  return null;
}

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log(`\n${COMMIT ? '🔧 COMMIT MODE — will persist' : '🔍 DRY RUN — no DB writes'}\n`);

  // ── Find user ──
  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) throw new Error(`No user for ${email}`);
  console.log(`User:    ${user.email}  (${user.profile?.firstName || ''} ${user.profile?.lastName || ''})`);

  // ── Find course ──
  const course = await resolveCourse(courseFrag);
  if (!course) throw new Error(`Could not resolve a single course for "${courseFrag}"`);
  console.log(`Course:  "${course.title}"  (…${course._id.toString().slice(-8)})`);

  // ── Find existing broken cert ──
  // Look for any cert matching this user that might be the broken one
  const existingCerts = await Certificate.find({ userId: user._id }).lean();
  console.log(`\nFound ${existingCerts.length} existing cert(s) for this user:`);

  let brokenCert = null;
  for (const c of existingCerts) {
    const hasFile = !!c.fileUrl;
    const hasTitle = c.title && c.title !== 'Certificate';
    const hasCourseId = !!c.courseId;
    console.log(`  • ${c._id} | title="${c.title || '(none)'}" | category=${c.category || '(none)'} | fileUrl=${hasFile ? 'YES' : 'MISSING'} | courseId=${hasCourseId ? c.courseId : 'MISSING'} | ceHours=${c.ceHours}`);

    // Match broken cert: same CE hours as course, or missing title, or matching courseId
    if (!hasFile || !hasTitle) {
      if (c.ceHours === (course.ceHours || 0) || c.courseId?.toString() === course._id.toString()) {
        brokenCert = c;
      }
    }
  }

  if (!brokenCert && existingCerts.length === 1 && !existingCerts[0].fileUrl) {
    brokenCert = existingCerts[0]; // Only one cert and it has no file — assume it's the one
  }

  if (!brokenCert) {
    console.log('\n⚠️  No broken cert found to repair. If a platform cert already exists with a PDF, nothing to fix.');
    console.log('    Use issueMissingCertificate.js to issue a new cert if none exists.');
    await mongoose.disconnect();
    return;
  }

  console.log(`\n▸ Repairing cert ${brokenCert._id} (title="${brokenCert.title}", category=${brokenCert.category})`);

  // ── Check CourseProgress ──
  let progress = await CourseProgress.findOne({ userId: user._id, courseId: course._id });
  console.log(`Progress: ${progress ? `exists (status=${progress.status})` : 'MISSING'}`);

  // ── Generate certificate data ──
  const selectedApprovalBody = user.profile?.preferredApprovalBody || 'NBCC';
  const approvalBlock = buildApprovalBlock(course.approvals, selectedApprovalBody, course.ceHours || 1);
  const selectedApprovalEntry = Array.isArray(course.approvals)
    ? course.approvals.find(a => a.body === selectedApprovalBody)
    : null;
  const approvalProviderNumber = selectedApprovalEntry?.providerNumber || '#7760';
  const creditedHourTypes = Array.isArray(selectedApprovalEntry?.hourBreakdown) && selectedApprovalEntry.hourBreakdown.length
    ? selectedApprovalEntry.hourBreakdown.map(({ label, hours }) => ({ label, hours }))
    : [{ label: 'core', hours: course.ceHours || 1 }];

  const holderName =
    (user.profile?.certificateName?.trim()) ||
    `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim() ||
    user.email;

  // Reuse existing cert number or generate new one
  const certificateNumber = brokenCert.certificateNumber || await generateCertificateNumber(course._id, user._id);

  console.log(`\nHolder:  "${holderName}"`);
  console.log(`CertNo:  ${certificateNumber}`);
  console.log(`Body:    ${selectedApprovalBody}`);

  // ── STEP 1: Generate PDF ──
  console.log('\n[1/3] Rendering PDF …');
  const pdfBuffer = await generateCertificate({
    holderName,
    courseName: course.title,
    completionDate: brokenCert.completionDate || progress?.completedAt || new Date(),
    ceHours: course.ceHours || 1,
    certificateNumber,
    acepNumber: 'ACEP #7760',
    ceCategory: course.ceCategory || course.contentArea || course.categories?.[0] || 'Counseling Theory/Practice',
    objectives: course.learningObjectives || course.objectives || [],
    approvals: approvalBlock,
  });
  console.log(`      ✅ PDF rendered (${pdfBuffer?.length || 0} bytes)`);

  // ── STEP 2: Upload to Cloudinary ──
  console.log('[2/3] Uploading to Cloudinary …');
  const uploadResult = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        folder: `certificates/${user._id}`,
        public_id: `cert_${certificateNumber.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}`,
        format: 'pdf'
      },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    const readable = new Readable();
    readable.push(pdfBuffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
  const pdfUrl = uploadResult.secure_url;
  console.log(`      ✅ Uploaded: ${pdfUrl}`);

  // ── STEP 3: Update cert record + progress ──
  if (!COMMIT) {
    console.log('\n[3/3] DRY RUN — would apply these updates:');
    console.log(`  cert.title          = "${course.title}"`);
    console.log(`  cert.courseId        = ${course._id}`);
    console.log(`  cert.category       = ${course.categories?.[0] || 'Core'}`);
    console.log(`  cert.fileUrl        = ${pdfUrl}`);
    console.log(`  cert.nbccApproved   = true`);
    console.log(`  cert.acepNumber     = ${course.acepNumber || '7760'}`);
    console.log(`  cert.approvingBody  = ${selectedApprovalBody}`);
    console.log(`  cert.source         = platform`);
    if (!progress) {
      console.log(`  + CREATE CourseProgress (status=certified)`);
    } else if (progress.status !== 'certified') {
      console.log(`  + UPDATE progress.status ${progress.status} → certified`);
    }
    console.log('\nRe-run with --commit to apply.');
    await mongoose.disconnect();
    return;
  }

  console.log('[3/3] Applying updates …');

  await Certificate.updateOne({ _id: brokenCert._id }, {
    $set: {
      title: course.title,
      courseId: course._id,
      category: course.categories?.[0] || 'Core',
      ceHours: course.ceHours || brokenCert.ceHours || 1,
      nbccApproved: true,
      acepNumber: course.acepNumber || '7760',
      approvingBody: selectedApprovalBody,
      approvalNumber: approvalProviderNumber,
      selectedApprovalBody,
      approvalProviderNumber,
      creditedHourTypes,
      certificateNumber,
      source: 'platform',
      fileUrl: pdfUrl,
      fileKey: uploadResult.public_id,
      cloudinaryPublicId: uploadResult.public_id,
    }
  });
  console.log('  ✅ Certificate record updated');

  // Fix or create CourseProgress
  if (!progress) {
    progress = await CourseProgress.create({
      userId: user._id,
      courseId: course._id,
      status: 'certified',
      certificateId: brokenCert._id,
      certificateIssuedAt: new Date(),
      completedAt: brokenCert.completionDate || new Date(),
      assessmentPassed: true,
      evaluationCompleted: true,
      attestationCompleted: true,
      sectionProgress: [],
    });
    console.log('  ✅ CourseProgress created (status=certified)');
  } else if (progress.status !== 'certified') {
    progress.status = 'certified';
    progress.certificateId = brokenCert._id;
    progress.certificateIssuedAt = new Date();
    await progress.save();
    console.log(`  ✅ CourseProgress updated (${progress.status} → certified)`);
  } else {
    console.log('  ✓ CourseProgress already certified');
  }

  console.log(`\n✅ REPAIRED  ${certificateNumber}`);
  console.log(`   certId:  ${brokenCert._id}`);
  console.log(`   title:   ${course.title}`);
  console.log(`   fileUrl: ${pdfUrl}`);
  console.log(`   progress.status → certified`);

  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error('\n❌ FAILURE:\n');
  console.error(err);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});
