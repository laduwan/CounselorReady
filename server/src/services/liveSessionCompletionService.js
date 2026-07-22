/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 */

/**
 * liveSessionCompletionService — issues certificates to live-session attendees
 * who meet the verified attendance threshold (Whereby webhook join/leave data).
 *
 * Mirrors the canonical certificateSelfHeal pipeline:
 *   generateCertificateNumber + generateCertificate (utils/certificate.js)
 *   → Cloudinary upload_stream → Certificate doc → CE auto-apply to credentials.
 *
 * Supervision sessions never issue certificates here — supervision hours are
 * logged via SupervisionLog, not the CE certificate pipeline.
 */
import { Readable } from 'stream';
import { v2 as cloudinary } from 'cloudinary';
import User from '../models/User.js';
import Certificate from '../models/Certificate.js';
import UserCredential from '../models/UserCredential.js';
import LiveSession from '../models/LiveSession.js';
import {
  generateCertificate,
  generateCertificateNumber,
  buildApprovalBlock
} from '../utils/certificate.js';

const LOG = '[LiveCert]';

/**
 * Issue certificates for all qualifying registrants of a completed live course.
 * Idempotent: skips users who already hold a non-revoked certificate for this session.
 *
 * @param {string} liveSessionId
 * @returns {{issued: Array, skipped: Array, failed: Array}}
 */
export async function issueLiveSessionCertificates(liveSessionId) {
  const session = await LiveSession.findById(liveSessionId);
  if (!session) throw new Error('Live session not found');
  if (session.sessionType !== 'live-course') {
    throw new Error('Certificates are only issued for live-course sessions, not supervision.');
  }
  if (!['completed', 'live'].includes(session.status)) {
    throw new Error(`Session status is '${session.status}' — must be live or completed before issuing certificates.`);
  }

  const issued = [];
  const skipped = [];
  const failed = [];

  for (const registrant of session.registrants) {
    const userId = registrant.user;
    try {
      if (!session.meetsAttendanceThreshold(userId)) {
        skipped.push({
          userId,
          reason: 'attendance-below-threshold',
          attendedMin: session.attendedMinutes(userId),
          requiredMin: Math.round(session.scheduledDurationMin() * session.attendanceThresholdPct / 100)
        });
        continue;
      }

      const attRecord = session.attendance.find(
        a => a.user && a.user.toString() === userId.toString()
      );
      if (!attRecord?.evaluationCompleted) {
        skipped.push({ userId, reason: 'evaluation-not-completed' });
        continue;
      }

      // Idempotency: title + user + platform source (no courseId for live sessions;
      // liveSessionId field added to CertificateSchema — see WIRING.md)
      const existing = await Certificate.findOne({
        userId,
        liveSessionId: session._id,
        isRevoked: { $ne: true }
      });
      if (existing) {
        skipped.push({ userId, reason: 'already-issued', certificateNumber: existing.certificateNumber });
        continue;
      }

      const user = await User.findById(userId);
      if (!user) { skipped.push({ userId, reason: 'user-not-found' }); continue; }

      const certificateNumber = await generateCertificateNumber(session._id, user._id);

      const userName =
        (user.profile?.certificateName?.trim()) ||
        `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim() ||
        user.email;

      const pdfBuffer = await generateCertificate({
        holderName: userName,
        courseName: session.title,
        completionDate: session.scheduledEnd,
        ceHours: session.ceuHours,
        certificateNumber,
        acepNumber: 'ACEP #7760',
        ceCategory:
          session.nbccContentAreas?.[0] ||
          'Counseling Theory/Practice and the Counseling Relationship',
        objectives: [],
        // NBCC fallback row, stamped as a live webinar so the certificate
        // shows the synchronous delivery format (LPCA-GA taxonomy)
        approvals: buildApprovalBlock(null, 'NBCC', session.ceuHours).map(a => ({
          ...a,
          deliveryFormat: 'live-webinar'
        }))
      });

      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'raw',
            folder: 'certificates',
            public_id: `cert_${certificateNumber}_live_${Date.now()}`,
            format: 'pdf'
          },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        const readable = new Readable();
        readable.push(pdfBuffer);
        readable.push(null);
        readable.pipe(uploadStream);
      });

      const certificate = new Certificate({
        userId: user._id,
        liveSessionId: session._id,
        title: session.title,
        provider: 'Ga Integrated Therapeutic Perspectives, LLC',
        completionDate: session.scheduledEnd,
        ceHours: session.ceuHours,
        category: session.category || 'Other',
        nbccApproved: true,
        acepNumber: '7760',
        approvingBody: 'NBCC',
        approvalNumber: '#7760',
        certificateNumber,
        source: 'platform',
        fileUrl: uploadResult.secure_url
      });
      await certificate.save();

      // CE auto-apply to active credentials (same pattern as self-heal)
      try {
        const credentials = await UserCredential.find({
          userId,
          status: { $in: ['active', 'expiring_soon'] }
        });
        for (const credential of credentials) {
          try {
            await credential.addCEU({
              certificateId: certificate._id,
              hours: certificate.ceHours,
              category: certificate.category || 'Other',
              description: `${session.title} - CounselorReady Live Webinar`,
              provider: 'CounselorReady',
              date: certificate.completionDate,
              source: 'internal'
            });
          } catch (credErr) {
            console.error(`${LOG} addCEU failed for credential ${credential._id}:`, credErr.message);
          }
        }
      } catch (credLookupErr) {
        console.error(`${LOG} credential lookup failed:`, credLookupErr.message);
      }

      issued.push({ userId, certificateNumber, certificateId: certificate._id });
      console.log(`${LOG} issued ${certificateNumber} to ${user.email} for "${session.title}"`);
    } catch (err) {
      console.error(`${LOG} failed for user ${userId}:`, err.message);
      failed.push({ userId, error: err.message });
    }
  }

  session.status = 'completed';
  session.certificatesIssuedAt = new Date();
  await session.save();

  return { issued, skipped, failed };
}

export default { issueLiveSessionCertificates };
