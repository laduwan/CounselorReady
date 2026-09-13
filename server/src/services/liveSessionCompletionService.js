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
 *
 * SERIES (multi-part courses, e.g. The Ethics Table Talk Part 1 + Part 2):
 * a session with a seriesId never issues its own per-part certificate.
 * issueLiveSessionCertificates() hands it to issueSeriesCertificates(), which
 * issues ONE certificate (series CE hours) to each registrant who has completed
 * every part under the series' completionRule (see seriesEligibility.js).
 * Clicking "Issue Certs" on an earlier part simply records it and reports who is
 * still waiting on later parts — nobody gets a partial certificate.
 */
import { Readable } from 'stream';
import { v2 as cloudinary } from 'cloudinary';
import User from '../models/User.js';
import Certificate from '../models/Certificate.js';
import UserCredential from '../models/UserCredential.js';
import LiveSession from '../models/LiveSession.js';
import SessionSeries from '../models/SessionSeries.js';
import { evaluateSeries, partOf, ruleOf, describeRule } from './seriesEligibility.js';
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
  if (session.seriesId) return issueSeriesCertificates(session);

  const issued = [];
  const skipped = [];
  const failed = [];

  for (const registrant of session.registrants) {
    const userId = registrant.user;
    try {
      if (!session.meetsAttendanceThreshold(userId)) {
        // Must report the same pair meetsAttendanceThreshold() judged on —
        // adjusted minutes over instructional minutes — or the skip reason
        // contradicts the decision. Matches the multi-part path below.
        skipped.push({
          userId,
          reason: 'attendance-below-threshold',
          attendedMin: session.attendedMinutesAdjusted(userId),
          requiredMin: Math.ceil(session.instructionalMinutes() * session.attendanceThresholdPct / 100)
        });
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

      const certificate = await createLiveCertificate({
        user,
        title: session.title,
        completionDate: session.scheduledEnd,
        ceHours: session.ceuHours,
        category: session.category,
        contentArea: session.nbccContentAreas?.[0],
        liveSessionId: session._id,
        creditDescription: `${session.title} - CounselorReady Live Webinar`
      });
      const certificateNumber = certificate.certificateNumber;
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

/**
 * Build the PDF, upload it, save the Certificate, and auto-apply CE to the
 * user's active credentials. Shared by per-session and series issuance.
 */
async function createLiveCertificate({ user, title, completionDate, ceHours, category, contentArea, liveSessionId, seriesId, seriesSessionIds, creditDescription }) {
  const certificateNumber = await generateCertificateNumber(seriesId || liveSessionId, user._id);

  const userName =
    (user.profile?.certificateName?.trim()) ||
    `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim() ||
    user.email;

  const pdfBuffer = await generateCertificate({
    holderName: userName,
    courseName: title,
    completionDate,
    ceHours,
    certificateNumber,
    acepNumber: 'ACEP #7760',
    ceCategory: contentArea || 'Counseling Theory/Practice and the Counseling Relationship',
    objectives: [],
    // NBCC fallback row, stamped as a live webinar so the certificate
    // shows the synchronous delivery format (LPCA-GA taxonomy)
    approvals: buildApprovalBlock(null, 'NBCC', ceHours).map(a => ({
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
    liveSessionId,
    ...(seriesId ? { seriesId, seriesSessionIds } : {}),
    title,
    provider: 'Ga Integrated Therapeutic Perspectives, LLC',
    completionDate,
    ceHours,
    category: category || 'Other',
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
      userId: user._id,
      status: { $in: ['active', 'expiring_soon'] }
    });
    for (const credential of credentials) {
      try {
        await credential.addCEU({
          certificateId: certificate._id,
          hours: certificate.ceHours,
          category: certificate.category || 'Other',
          description: creditDescription || `${title} - CounselorReady Live Webinar`,
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

  return certificate;
}

/**
 * Series issuance, triggered from any part. Evaluates every registrant of the
 * triggering session against the whole series and issues ONE certificate to
 * those who have completed it. Idempotent per user per series.
 *
 * @param {object} sessionDoc  hydrated LiveSession with a seriesId
 * @returns {{issued, skipped, failed, series}}
 */
export async function issueSeriesCertificates(sessionDoc) {
  const session = sessionDoc;
  const series = await SessionSeries.findById(session.seriesId).lean();
  if (!series) throw new Error('This session is linked to a series that no longer exists. Fix the series link before issuing certificates.');

  // Issuing closes THIS session (saved at the end); mark it now so it counts as a
  // completed part. Other parts count only once they are completed themselves.
  session.status = 'completed';
  const all = await LiveSession.find({ seriesId: session.seriesId });
  const members = all.map(s => (String(s._id) === String(session._id) ? session : s));
  const rule = ruleOf(series, members);
  const title = (series.certificateTitle || series.title || session.title).trim();
  const part = partOf(session);

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
          detail: `below the attendance threshold for Part ${part || '?'}`,
          attendedMin: session.attendedMinutesAdjusted(userId),
          requiredMin: Math.ceil(session.instructionalMinutes() * session.attendanceThresholdPct / 100)
        });
        continue;
      }

      const existing = await Certificate.findOne({ userId, seriesId: session.seriesId, isRevoked: { $ne: true } });
      if (existing) {
        skipped.push({ userId, reason: 'already-issued', certificateNumber: existing.certificateNumber });
        continue;
      }

      const ev = evaluateSeries(series, members, userId, (s, uid) => s.meetsAttendanceThreshold(uid));
      if (!ev.eligible) {
        skipped.push({
          userId,
          reason: ev.outOfWindow ? 'series-out-of-window' : 'series-incomplete',
          detail: ev.outOfWindow
            ? `parts completed are not within ${rule.withinDays} day(s) of each other`
            : `still needs Part ${ev.missingParts.join(', Part ')}`
        });
        continue;
      }

      const user = await User.findById(userId);
      if (!user) { skipped.push({ userId, reason: 'user-not-found' }); continue; }

      const last = ev.counted.reduce((a, b) => (new Date(b.scheduledEnd) > new Date(a.scheduledEnd) ? b : a));
      const certificate = await createLiveCertificate({
        user,
        title,
        completionDate: ev.completionDate,
        ceHours: ev.ceHours,
        category: series.category || last.category,
        contentArea: last.nbccContentAreas?.[0],
        liveSessionId: last._id,
        seriesId: session.seriesId,
        seriesSessionIds: ev.counted.map(s => s._id),
        creditDescription: `${title} - CounselorReady Live Webinar (${ev.counted.length}-part series)`
      });

      issued.push({ userId, certificateNumber: certificate.certificateNumber, certificateId: certificate._id, ceHours: ev.ceHours });
      console.log(`${LOG} issued SERIES ${certificate.certificateNumber} (${ev.ceHours} CE) to ${user.email} for "${title}"`);
    } catch (err) {
      console.error(`${LOG} series cert failed for user ${userId}:`, err.message);
      failed.push({ userId, error: err.message });
    }
  }

  session.status = 'completed';
  session.certificatesIssuedAt = new Date();
  await session.save();

  return {
    issued, skipped, failed,
    series: { id: series._id, title, part, rule: describeRule(rule), ceHours: Number(series.totalCeuHours) || null }
  };
}

export default { issueLiveSessionCertificates, issueSeriesCertificates };
