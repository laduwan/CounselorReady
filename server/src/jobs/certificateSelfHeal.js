/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */

/**
 * Certificate Self-Heal Cron Job
 *
 * Finds UserCourseProgress records that are fully complete (assessmentPassed,
 * evaluationCompleted, attestationCompleted, status === 'completed') but have
 * no certificateId — meaning the certificate generation step silently failed
 * at some earlier point (e.g. Cloudinary timeout, process crash).
 *
 * For each gap it re-runs the full certificate generation pipeline:
 *   1. Validate all requirements are genuinely met
 *   2. Generate PDF via utils/certificate.js
 *   3. Upload to Cloudinary
 *   4. Create Certificate document
 *   5. Update progress.certificateId + status → 'certified'
 *   6. CE auto-allocation to UserCredentials
 *   7. (Optional) send notification email via Resend
 *
 * Scheduled via node-cron every 6 hours. Mirrors hardshipPauseResume.js pattern.
 */

import mongoose from 'mongoose';
import { Readable } from 'stream';
import { v2 as cloudinary } from 'cloudinary';
import { Course, CourseProgress } from '../models/InteractiveCourse.js';
import Certificate from '../models/Certificate.js';
import Evaluation from '../models/Evaluation.js';
import User from '../models/User.js';
import UserCredential from '../models/UserCredential.js';
import {
  generateCertificate,
  generateCertificateNumber,
  buildApprovalBlock
} from '../utils/certificate.js';
import { logActivity, ACTIVITY_TYPES } from '../services/activityTrackingService.js';

const LOG = '[CertSelfHeal]';

/**
 * Main self-heal runner. Called by the cron schedule.
 * Returns stats object for logging.
 */
export async function runCertificateSelfHeal() {
  console.log(`${LOG} Starting certificate self-heal scan...`);

  const stats = {
    scanned: 0,
    healed: 0,
    skipped: 0,  // Requirements not fully met on re-check
    errors:  0
  };

  try {
    // Find all progress records that look complete but have no certificate
    const gaps = await CourseProgress.find({
      status: 'completed',
      assessmentPassed: true,
      evaluationCompleted: true,
      attestationCompleted: true,
      certificateId: { $exists: false }
    })
      .select('_id userId courseId completedAt attestationCompleted evaluationCompleted assessmentPassed')
      .lean();

    stats.scanned = gaps.length;
    console.log(`${LOG} Found ${stats.scanned} progress records missing certificates`);

    if (stats.scanned === 0) {
      console.log(`${LOG} Nothing to heal.`);
      return stats;
    }

    for (const gap of gaps) {
      try {
        await healOne(gap, stats);
      } catch (err) {
        console.error(`${LOG} Unhandled error healing progress ${gap._id}:`, err.message);
        stats.errors++;
      }
    }
  } catch (err) {
    console.error(`${LOG} Top-level scan error:`, err.message);
    stats.errors++;
  }

  console.log(`${LOG} Complete:`, stats);
  return stats;
}

/**
 * Heal a single gap record.
 * @param {Object} gap  - lean UserCourseProgress document
 * @param {Object} stats - shared stats counter (mutated)
 */
async function healOne(gap, stats) {
  const progressId = gap._id;

  // --- 1. Re-fetch live documents (lean() results may be stale) ---
  const [progress, course, user] = await Promise.all([
    CourseProgress.findById(progressId),
    Course.findById(gap.courseId),
    User.findById(gap.userId)
  ]);

  if (!progress || !course || !user) {
    console.warn(`${LOG} Skipping ${progressId} — missing progress/course/user`);
    stats.skipped++;
    return;
  }

  // --- 2. Guard: skip if cert was issued between our query and now ---
  if (progress.certificateId) {
    stats.skipped++;
    return;
  }

  // --- 3. Re-validate all ACEP requirements ---
  if (!progress.assessmentPassed) {
    console.warn(`${LOG} ${progressId} — assessmentPassed=false on re-check, skipping`);
    stats.skipped++;
    return;
  }

  if (!progress.attestationCompleted) {
    console.warn(`${LOG} ${progressId} — attestation not completed on re-check, skipping`);
    stats.skipped++;
    return;
  }

  const evaluation = await Evaluation.findOne({
    user: gap.userId,
    course: gap.courseId,
    status: 'submitted'
  });

  if (!evaluation) {
    console.warn(`${LOG} ${progressId} — no submitted evaluation found, skipping`);
    stats.skipped++;
    return;
  }

  // --- 4. Idempotency: check if certificate already exists in DB ---
  const existing = await Certificate.findOne({
    userId: gap.userId,
    courseId: gap.courseId,
    source: 'platform'
  });

  if (existing) {
    // Cert exists but progress wasn't linked — fix the link only
    console.log(`${LOG} ${progressId} — cert ${existing._id} exists, re-linking to progress`);
    progress.certificateId = existing._id;
    progress.status = 'certified';
    await progress.save();
    stats.healed++;
    return;
  }

  // --- 5. Generate certificate number ---
  const certificateNumber = await generateCertificateNumber(course._id, user._id);

  // --- 6. Resolve approval body ---
  const selectedApprovalBody = user.profile?.preferredApprovalBody || 'NBCC';
  const approvalBlock = buildApprovalBlock(course.approvals, selectedApprovalBody, course.ceHours || 1);
  const selectedApprovalEntry = Array.isArray(course.approvals)
    ? course.approvals.find(a => a.body === selectedApprovalBody)
    : null;
  const approvalProviderNumber = selectedApprovalEntry?.providerNumber || '#7760';
  const creditedHourTypes =
    Array.isArray(selectedApprovalEntry?.hourBreakdown) && selectedApprovalEntry.hourBreakdown.length
      ? selectedApprovalEntry.hourBreakdown.map(({ label, hours }) => ({ label, hours }))
      : [{ label: 'core', hours: course.ceHours || 1 }];

  // --- 7. Generate PDF ---
  const userName =
    (user.profile?.certificateName?.trim()) ||
    `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim() ||
    user.email;

  const pdfBuffer = await generateCertificate({
    holderName: userName,
    courseName: course.title,
    completionDate: progress.completedAt || new Date(),
    ceHours: course.ceHours || 1,
    certificateNumber,
    acepNumber: 'ACEP #7760',
    ceCategory:
      course.ceCategory ||
      course.contentArea ||
      course.categories?.[0] ||
      'Counseling Theory/Practice and the Counseling Relationship',
    objectives: course.learningObjectives || course.objectives || [],
    approvals: approvalBlock
  });

  // --- 8. Upload PDF to Cloudinary ---
  const uploadResult = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        folder: 'certificates',
        public_id: `cert_${certificateNumber}_selfheal_${Date.now()}`,
        format: 'pdf'
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    const readable = new Readable();
    readable.push(pdfBuffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });

  const pdfUrl = uploadResult.secure_url;

  // --- 9. Create Certificate document ---
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
    fileUrl: pdfUrl
  });

  await certificate.save();

  // --- 10. Link certificate back to progress ---
  progress.certificateId = certificate._id;
  progress.certificateIssuedAt = new Date();
  progress.status = 'certified';
  await progress.save();

  // --- 11. CE auto-allocation to UserCredentials ---
  try {
    const userCredentials = await UserCredential.find({ userId: user._id });
    for (const cred of userCredentials) {
      const alreadyLogged = cred.ceuLogs.some(
        log => log.certificateId && log.certificateId.toString() === certificate._id.toString()
      );
      if (alreadyLogged) continue;

      cred.ceuLogs.push({
        date: certificate.completionDate || new Date(),
        hours: certificate.ceHours || 0,
        category: certificate.category || 'General',
        source: 'internal',
        certificateId: certificate._id,
        courseId: course._id,
        description: certificate.title,
        provider: 'CounselorReady'
      });

      cred.totalCEUsCompleted = cred.ceuLogs.reduce((sum, log) => sum + (log.hours || 0), 0);
      for (const req of cred.requirements) {
        const catLogs = cred.ceuLogs.filter(
          log => log.category?.toLowerCase() === req.category?.toLowerCase()
        );
        req.hoursCompleted = Math.min(
          req.hoursRequired,
          catLogs.reduce((sum, log) => sum + (log.hours || 0), 0)
        );
      }
      await cred.save();
    }
  } catch (syncErr) {
    console.error(`${LOG} CE auto-allocation error (non-fatal) for cert ${certificate._id}:`, syncErr.message);
  }

  // --- 12. Activity log ---
  logActivity(
    ACTIVITY_TYPES.CERTIFICATE_GENERATED,
    {
      courseId: course._id,
      courseName: course.title,
      ceHours: course.ceHours || course.ceuHours,
      certificateNumber,
      selfHealed: true
    },
    {
      userId: user._id,
      userName: user.profile?.firstName
        ? `${user.profile.firstName} ${user.profile.lastName || ''}`.trim()
        : user.email,
      userEmail: user.email
    }
  ).catch(() => {});

  console.log(
    `${LOG} Healed: user=${user.email} course="${course.title}" cert=${certificateNumber}`
  );
  stats.healed++;
}
