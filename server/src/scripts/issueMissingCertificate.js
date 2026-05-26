/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 */
// server/src/scripts/issueMissingCertificate.js
// ---------------------------------------------------------------------------
// Re-runs the EXACT certificate-generation flow from
// routes/interactiveCourseRoutes.js  (POST /:id/certificate) for a learner who
// is fully eligible (assessmentPassed + evaluation submitted + attestation)
// but has no certificate. The live route swallows any failure into a generic
// 500; THIS script prints the real error/stack so we can see what broke.
//
// Safe by default:
//   • Refuses unless all three gates pass.
//   • Skips if a platform certificate already exists.
//   • DRY by default: renders the PDF + uploads to Cloudinary and reports the
//     URL, but does NOT write the Certificate record or touch progress.
//   • Pass --commit to persist the Certificate and mark progress 'certified'.
//
// Usage:
//   node src/scripts/issueMissingCertificate.js blakewingo1@gmail.com "suicide risk"
//   node src/scripts/issueMissingCertificate.js blakewingo1@gmail.com "suicide risk" --commit
// ---------------------------------------------------------------------------

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Readable } from 'stream';
import { v2 as cloudinary } from 'cloudinary';

import User from '../models/User.js';
import { Course, CourseProgress } from '../models/InteractiveCourse.js';
import Evaluation from '../models/Evaluation.js';
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
  console.error('Usage: node src/scripts/issueMissingCertificate.js <email> <courseSlugOrIdOrTitleFragment> [--commit]');
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
  const matches = await Course.find({ title: rx }).select('title slug ceHours');
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

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) throw new Error(`No user for ${email}`);

  const course = await resolveCourse(courseFrag);
  if (!course) throw new Error(`Could not resolve a single course for "${courseFrag}"`);

  const progress = await CourseProgress.findOne({ userId: user._id, courseId: course._id });
  if (!progress) throw new Error(`No CourseProgress for ${email} on "${course.title}"`);

  // --- Re-verify the three gates the route enforces -----------------------
  const evaluation = await Evaluation.findOne({ user: user._id, course: course._id, status: 'submitted' });
  const gates = {
    assessmentPassed: !!progress.assessmentPassed,
    evaluationSubmitted: !!evaluation,
    attestationAgreed: !!progress.attestationAgreed,
  };
  console.log(`Course:  "${course.title}"  (…${course._id.toString().slice(-8)})`);
  console.log(`Learner: ${user.email}  (…${user._id.toString().slice(-8)})`);
  console.log(`Gates:   assessmentPassed=${gates.assessmentPassed}  evaluationSubmitted=${gates.evaluationSubmitted}  attestationAgreed=${gates.attestationAgreed}`);

  if (!gates.assessmentPassed || !gates.evaluationSubmitted || !gates.attestationAgreed) {
    throw new Error('Not eligible — one or more gates fail. Refusing to issue.');
  }

  // --- Already issued? ----------------------------------------------------
  let existing = await Certificate.findOne({ userId: user._id, courseId: course._id, source: 'platform' });
  if (existing) {
    console.log(`\n✅ A platform certificate already exists: ${existing.certificateNumber}`);
    console.log(`   fileUrl: ${existing.fileUrl || '(none)'}`);
    console.log('   Nothing to do.');
    await mongoose.disconnect();
    return;
  }

  // --- Replicate the route's generation inputs ----------------------------
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

  const certificateNumber = await generateCertificateNumber(course._id, user._id);
  console.log(`\nName on cert: "${holderName}"  | approvalBody: ${selectedApprovalBody}  | certNo: ${certificateNumber}`);

  // --- STEP 1: PDF render (a common failure point) ------------------------
  console.log('\n[1/3] Rendering PDF …');
  const pdfBuffer = await generateCertificate({
    holderName,
    courseName: course.title,
    completionDate: progress.completedAt || new Date(),
    ceHours: course.ceHours || 1,
    certificateNumber,
    acepNumber: 'ACEP #7760',
    ceCategory: course.ceCategory || course.contentArea || course.categories?.[0] || 'Counseling Theory/Practice and the Counseling Relationship',
    objectives: course.learningObjectives || course.objectives || [],
    approvals: approvalBlock,
  });
  console.log(`      ✅ PDF rendered (${pdfBuffer?.length || 0} bytes)`);

  // --- STEP 2: Cloudinary upload (the other common failure point) ---------
  console.log('[2/3] Uploading to Cloudinary …');
  const uploadResult = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'raw', folder: 'certificates', public_id: `cert_${certificateNumber}_${Date.now()}`, format: 'pdf' },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    const readable = new Readable();
    readable.push(pdfBuffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
  const pdfUrl = uploadResult.secure_url;
  console.log(`      ✅ Uploaded: ${pdfUrl}`);

  // --- STEP 3: Persist (only with --commit) -------------------------------
  if (!COMMIT) {
    console.log('\n[3/3] DRY RUN — skipping DB writes.');
    console.log('Generation works end-to-end. Re-run with --commit to issue the certificate.');
    await mongoose.disconnect();
    return;
  }

  console.log('[3/3] Saving Certificate + linking progress …');
  const certificate = new Certificate({
    userId: user._id,
    courseId: course._id,
    title: course.title,
    provider: 'Ga Integrated Therapeutic Perspectives, LLC',
    completionDate: progress.completedAt || new Date(),
    ceHours: course.ceHours || 1,
    category: course.categories?.[0] || 'Core',
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
  });
  await certificate.save();

  progress.certificateId = certificate._id;
  progress.certificateIssuedAt = new Date();
  progress.status = 'certified';
  await progress.save();

  console.log(`\n✅ ISSUED  ${certificate.certificateNumber}`);
  console.log(`   certId:  ${certificate._id}`);
  console.log(`   fileUrl: ${pdfUrl}`);
  console.log('   progress.status -> certified');
  console.log('\nNOTE: CE-hour auto-allocation to credentials and gamification/rewards');
  console.log('side effects from the live route are NOT replicated here. Say the word');
  console.log('if Blake has tracked credentials that should receive these hours.');

  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error('\n❌ FAILURE — this is the error the live route was hiding:\n');
  console.error(err);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});
