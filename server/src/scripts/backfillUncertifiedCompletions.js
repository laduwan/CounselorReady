/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 */
// server/src/scripts/backfillUncertifiedCompletions.js
// ---------------------------------------------------------------------------
// Issues certificates for EVERY learner who is fully eligible
// (attestationAgreed -> implies assessment passed + evaluation submitted) but
// has no platform certificate. Replicates the exact generation flow from
// routes/interactiveCourseRoutes.js (POST /:id/certificate).
//
// Safe:
//   • Skips anyone who already has a platform cert.
//   • Refuses anyone whose three gates don't all pass.
//   • Each learner is wrapped in try/catch — one failure never aborts the run,
//     and the real error prints next to that learner (so a genuine PDF/Cloudinary
//     problem is visible per-person, not hidden behind a generic 500).
//   • DRY by default: lists who WOULD be issued, no generation, no writes.
//   • --commit performs the full generation + save per learner.
//
// Usage:
//   node src/scripts/backfillUncertifiedCompletions.js            # dry preview
//   node src/scripts/backfillUncertifiedCompletions.js --commit   # issue them
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

const COMMIT = process.argv.includes('--commit');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function issueFor(pr) {
  // Already certified?
  const existing = await Certificate.findOne({ userId: pr.userId, courseId: pr.courseId, source: 'platform' });
  if (existing) return { status: 'skip', reason: `already issued ${existing.certificateNumber}` };

  const [user, course, evaluation] = await Promise.all([
    User.findById(pr.userId),
    Course.findById(pr.courseId),
    Evaluation.findOne({ user: pr.userId, course: pr.courseId, status: 'submitted' }),
  ]);
  if (!user) return { status: 'skip', reason: 'user not found' };
  if (!course) return { status: 'skip', reason: 'course not found' };

  const email = user.email;
  const title = course.title;

  // Re-verify all three gates
  if (!pr.assessmentPassed || !evaluation || !pr.attestationAgreed) {
    return { status: 'skip', email, title,
      reason: `gates fail (assessment=${!!pr.assessmentPassed} eval=${!!evaluation} attestation=${!!pr.attestationAgreed})` };
  }

  // Inputs — identical to the live route
  const selectedApprovalBody = user.profile?.preferredApprovalBody || 'NBCC';
  const approvalBlock = buildApprovalBlock(course.approvals, selectedApprovalBody, course.ceHours || 1);
  const selectedApprovalEntry = Array.isArray(course.approvals)
    ? course.approvals.find(a => a.body === selectedApprovalBody) : null;
  const approvalProviderNumber = selectedApprovalEntry?.providerNumber || '#7760';
  const creditedHourTypes = Array.isArray(selectedApprovalEntry?.hourBreakdown) && selectedApprovalEntry.hourBreakdown.length
    ? selectedApprovalEntry.hourBreakdown.map(({ label, hours }) => ({ label, hours }))
    : [{ label: 'core', hours: course.ceHours || 1 }];
  const holderName =
    (user.profile?.certificateName?.trim()) ||
    `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim() || user.email;
  const certificateNumber = await generateCertificateNumber(course._id, user._id);

  if (!COMMIT) {
    return { status: 'would', email, title, certNo: certificateNumber, name: holderName };
  }

  // Render
  const pdfBuffer = await generateCertificate({
    holderName,
    courseName: course.title,
    completionDate: pr.completedAt || new Date(),
    ceHours: course.ceHours || 1,
    certificateNumber,
    acepNumber: 'ACEP #7760',
    ceCategory: course.ceCategory || course.contentArea || course.categories?.[0] || 'Counseling Theory/Practice and the Counseling Relationship',
    objectives: course.learningObjectives || course.objectives || [],
    approvals: approvalBlock,
  });

  // Upload
  const uploadResult = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'raw', folder: 'certificates', public_id: `cert_${certificateNumber}_${Date.now()}`, format: 'pdf' },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    const readable = new Readable();
    readable.push(pdfBuffer);
    readable.push(null);
    readable.pipe(stream);
  });

  // Save + link
  const certificate = new Certificate({
    userId: user._id, courseId: course._id, title: course.title,
    provider: 'Ga Integrated Therapeutic Perspectives, LLC',
    completionDate: pr.completedAt || new Date(),
    ceHours: course.ceHours || 1,
    category: course.categories?.[0] || 'Core',
    nbccApproved: true, acepNumber: course.acepNumber || '7760',
    approvingBody: selectedApprovalBody, approvalNumber: approvalProviderNumber,
    selectedApprovalBody, approvalProviderNumber, creditedHourTypes,
    certificateNumber, source: 'platform', fileUrl: uploadResult.secure_url,
  });
  await certificate.save();

  const fresh = await CourseProgress.findById(pr._id);
  fresh.certificateId = certificate._id;
  fresh.certificateIssuedAt = new Date();
  fresh.status = 'certified';
  await fresh.save();

  return { status: 'issued', email, title, certNo: certificate.certificateNumber, url: uploadResult.secure_url };
}

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log(`\n${COMMIT ? '🔧 COMMIT — issuing certificates' : '🔍 DRY RUN — preview only, no writes'}\n`);

  const candidates = await CourseProgress.find({ attestationAgreed: true, status: { $ne: 'certified' } });
  console.log(`Eligible-but-uncertified candidates: ${candidates.length}\n`);

  const tally = { issued: 0, would: 0, skip: 0, failed: 0 };
  for (const pr of candidates) {
    let r;
    try { r = await issueFor(pr); }
    catch (err) { r = { status: 'failed', email: `(progress …${pr._id.toString().slice(-8)})`, error: err.message }; }

    tally[r.status] = (tally[r.status] || 0) + 1;
    if (r.status === 'issued') console.log(`  ✅ ISSUED   ${r.email} — "${r.title}" — ${r.certNo}`);
    else if (r.status === 'would') console.log(`  • WOULD     ${r.email} — "${r.title}" — ${r.certNo} (name: ${r.name})`);
    else if (r.status === 'skip') console.log(`  ⏭  SKIP     ${r.email || ''} ${r.title ? `— "${r.title}" ` : ''}(${r.reason})`);
    else if (r.status === 'failed') console.log(`  ❌ FAILED   ${r.email} — ${r.error}`);
  }

  console.log(`\n================ SUMMARY ================`);
  console.log(`  issued: ${tally.issued || 0}  |  would-issue: ${tally.would || 0}  |  skipped: ${tally.skip || 0}  |  FAILED: ${tally.failed || 0}`);
  if (!COMMIT) console.log('  Re-run with --commit to issue the "WOULD" set.');
  if (tally.failed) console.log('  ❌ See FAILED lines above — those are genuine non-enum errors to investigate.');
  console.log('========================================\n');

  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error('Backfill failed:', err);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});
