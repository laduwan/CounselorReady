/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 */
// server/src/scripts/diagnoseCertEligibility.js
// ---------------------------------------------------------------------------
// Per-user certificate eligibility diagnostic.
// Mirrors the EXACT gate logic in routes/interactiveCourseRoutes.js
//   POST /:id/certificate  and  GET /:id/certificate/check
// so the output maps 1:1 to why a learner can or cannot pull a certificate.
//
// Gates (all three must be true): assessmentPassed, evaluation status==='submitted',
// attestationAgreed. Profile completeness is NOT a gate — it only fills the name
// on the PDF (certificateName -> firstName lastName -> email).
//
// Usage (from the same dir you run other scripts in this folder):
//   node src/scripts/diagnoseCertEligibility.js learner@email.com
//   node src/scripts/diagnoseCertEligibility.js learner@email.com <courseSlugOrId>
// ---------------------------------------------------------------------------

import dotenv from 'dotenv';
import mongoose from 'mongoose';

import User from '../models/User.js';
import { Course, CourseProgress } from '../models/InteractiveCourse.js';
import Evaluation from '../models/Evaluation.js';
import Certificate from '../models/Certificate.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set');
  process.exit(1);
}

const email = process.argv[2];
const courseArg = process.argv[3]; // optional: slug or _id to narrow to one course

if (!email) {
  console.error('Usage: node src/scripts/diagnoseCertEligibility.js <email> [courseSlugOrId]');
  process.exit(1);
}

const yn = (b) => (b ? '✅ yes' : '❌ NO');

async function findCourse(arg) {
  if (!arg) return null;
  if (mongoose.Types.ObjectId.isValid(arg)) {
    const byId = await Course.findById(arg);
    if (byId) return byId;
  }
  return Course.findOne({ slug: arg });
}

async function main() {
  await mongoose.connect(MONGODB_URI);

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    console.error(`❌ No user found for email: ${email}`);
    await mongoose.disconnect();
    process.exit(1);
  }

  // --- Profile snapshot (informational only — does NOT block certs) ---
  const p = user.profile || {};
  const resolvedName =
    (p.certificateName?.trim()) ||
    `${p.firstName || ''} ${p.lastName || ''}`.trim() ||
    user.email;

  console.log('\n================ CERT ELIGIBILITY DIAGNOSTIC ================');
  console.log(`User:        ${user.email}  (_id ${user._id})`);
  console.log(`Name on PDF: "${resolvedName}"`);
  console.log(`Profile —> firstName: ${p.firstName || '(empty)'} | lastName: ${p.lastName || '(empty)'} | certificateName: ${p.certificateName || '(empty)'} | preferredApprovalBody: ${p.preferredApprovalBody || '(default NBCC)'}`);
  console.log('NOTE: profile completeness is NOT a certificate gate. It only sets the name/approval body on the PDF.');

  // --- Which progress records to check ---
  const query = { userId: user._id };
  let onlyCourse = null;
  if (courseArg) {
    onlyCourse = await findCourse(courseArg);
    if (!onlyCourse) {
      console.error(`\n❌ Course not found for "${courseArg}"`);
      await mongoose.disconnect();
      process.exit(1);
    }
    query.courseId = onlyCourse._id;
  }

  const progressList = await CourseProgress.find(query).sort({ updatedAt: -1 });
  if (!progressList.length) {
    console.log('\n❌ No CourseProgress records for this user' + (onlyCourse ? ' on that course.' : '. They are not enrolled in anything.'));
    await mongoose.disconnect();
    return;
  }

  for (const progress of progressList) {
    const course =
      (onlyCourse && onlyCourse._id.equals(progress.courseId))
        ? onlyCourse
        : await Course.findById(progress.courseId);

    const courseTitle = course?.title || `(unknown course ${progress.courseId})`;

    // Mirror the route's exact Evaluation lookup: by user + course
    const evaluation = await Evaluation.findOne({
      user: user._id,
      course: progress.courseId,
    });

    // Mirror the route's exact Certificate lookup: userId + courseId + source platform
    const existingCert = await Certificate.findOne({
      userId: user._id,
      courseId: progress.courseId,
      source: 'platform',
    });

    const sectionsCompleted =
      Array.isArray(progress.sectionProgress) &&
      progress.sectionProgress.length > 0 &&
      progress.sectionProgress.every((s) => s.status === 'completed');

    const assessmentPassed = !!progress.assessmentPassed;
    const evaluationSubmitted = evaluation?.status === 'submitted';
    const attestationAgreed = !!progress.attestationAgreed;

    // This is the EXACT eligibility expression from GET /:id/certificate/check
    const eligible = attestationAgreed && assessmentPassed && evaluationSubmitted;

    console.log('\n------------------------------------------------------------');
    console.log(`Course:   ${courseTitle}`);
    console.log(`courseId: ${progress.courseId}  | progress.status: ${progress.status}`);
    console.log(`  sectionsCompleted .... ${yn(sectionsCompleted)}  (${(progress.sectionProgress || []).filter(s => s.status === 'completed').length}/${(progress.sectionProgress || []).length} sections)`);
    console.log(`  assessmentPassed ..... ${yn(assessmentPassed)}  (attempts: ${(progress.assessmentAttempts || []).length})`);
    console.log(`  evaluationSubmitted .. ${yn(evaluationSubmitted)}  ${evaluation ? `(eval _id ${evaluation._id}, status="${evaluation.status}")` : '(NO evaluation doc exists)'}`);
    console.log(`  attestationAgreed .... ${yn(attestationAgreed)}  ${progress.attestationAgreedAt ? `(at ${progress.attestationAgreedAt.toISOString()})` : ''}`);
    console.log(`  ----`);
    console.log(`  ELIGIBLE FOR CERT .... ${eligible ? '✅ YES' : '❌ NO'}`);
    console.log(`  Cert already issued .. ${existingCert ? `✅ ${existingCert.certificateNumber} (issued ${existingCert.createdAt?.toISOString?.() || existingCert.createdAt})` : '— none'}`);

    if (!eligible) {
      const blockers = [];
      if (!assessmentPassed) blockers.push('assessment not passed (sections done ≠ assessment passed)');
      if (!evaluationSubmitted) blockers.push(evaluation ? `evaluation exists but status="${evaluation.status}" (not "submitted")` : 'no evaluation submitted (this ALSO blocks attestation)');
      if (!attestationAgreed) blockers.push('attestation not agreed');
      console.log(`  >>> BLOCKED BY: ${blockers.join('; ')}`);
    }
  }

  console.log('\n============================================================\n');
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error('Diagnostic failed:', err);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});
