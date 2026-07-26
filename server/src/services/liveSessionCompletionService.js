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
import SessionSeries from '../models/SessionSeries.js';
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
  // Series-linked sessions issue via issueSeriesCertificates — never per-session,
  // to prevent an attendee ending up with both a per-session cert AND a series cert.
  if (session.seriesId) {
    throw new Error(`Session belongs to series ${session.seriesId} — use issueSeriesCertificates for the series instead.`);
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

      // Assessment gate — ONLY when enabled. Requires a passing attempt on top of
      // attendance + evaluation. When disabled, this block is skipped entirely and
      // eligibility is attendance + evaluation exactly as before.
      if (session.assessment?.enabled) {
        const passedAttempt = (session.assessmentAttempts || []).some(
          a => a.userId && a.userId.toString() === userId.toString() && a.passed
        );
        if (!passedAttempt) {
          skipped.push({ userId, reason: 'assessment-not-passed' });
          continue;
        }
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
        objectives: session.objectives || [],
        instructorName: session.presenter?.name || undefined,
        // NBCC fallback row, stamped 'synchronous' per GA Board Rule
        // 135-9-.01(4)(c) — the certificate must say "Synchronous," not
        // "Live Webinar" (LPCA-GA taxonomy)
        approvals: buildApprovalBlock(null, 'NBCC', session.ceuHours).map(a => ({
          ...a,
          deliveryFormat: 'synchronous'
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

      // Non-blocking — gamification failure must never affect certificate issuance.
      // Pattern replicated locally from interactiveCourseRoutes.js recordGamification
      // (fire-and-forget; do NOT import from that route file).
      (async () => {
        try {
          const Gamification = (await import('../models/Gamification.js')).default;
          let profile = await Gamification.findOne({ userId: user._id });
          if (!profile) profile = await Gamification.create({ userId: user._id });

          profile.recordActivity();

          // Fires for both live_session_complete (with ceHours) and certificate_earned
          const XP = { live_session_complete: 100, certificate_earned: 75 };
          profile.xp += XP.live_session_complete + XP.certificate_earned;
          profile.level = profile.calculateLevel();

          profile.totalLiveSessionsCompleted += 1;
          const ceHours = session.ceuHours || 0;
          if (ceHours) {
            profile.totalCEHoursEarned += ceHours;
            profile.weeklyHoursCompleted += ceHours;
          }

          const BADGES = {
            first_live_session: { check: () => profile.totalLiveSessionsCompleted >= 1, name: 'Showed Up Live', description: 'Attended your first live session', icon: 'video' },
            live_five: { check: () => profile.totalLiveSessionsCompleted >= 5, name: 'Live Regular', description: 'Attended 5 live sessions', icon: 'radio' },
            first_cert: { check: () => true, name: 'Certified', description: 'Earned your first certificate', icon: 'award' },
            ten_hours: { check: () => profile.totalCEHoursEarned >= 10, name: '10 Hour Club', description: 'Earned 10+ CE hours', icon: 'clock' },
            fifty_hours: { check: () => profile.totalCEHoursEarned >= 50, name: 'Half Century', description: 'Earned 50+ CE hours', icon: 'zap' }
          };
          for (const [key, def] of Object.entries(BADGES)) {
            if (def.check() && !profile.badges.some(b => b.key === key)) {
              profile.badges.push({ key, name: def.name, description: def.description, icon: def.icon });
            }
          }

          await profile.save();
        } catch (err) {
          console.error('[liveSession] gamification non-blocking error:', err.message);
        }
      })();
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
 * Issue certificates for all qualifying series attendees.
 * A user qualifies when they met the attendance threshold on every required
 * session in the series AND completed evaluations on every required session.
 * Idempotent: skips users who already hold a non-revoked series certificate.
 *
 * Returns immediately with `notReady` reason if any required session hasn't
 * completed yet (rather than issuing partial certs).
 *
 * @param {string} seriesId
 * @returns {{issued: Array, skipped: Array, failed: Array}}
 */
export async function issueSeriesCertificates(seriesId) {
  const series = await SessionSeries.findById(seriesId);
  if (!series) throw new Error('Session series not found');

  const memberSessions = await LiveSession.find({ seriesId })
    .sort({ 'seriesMembership.order': 1 });

  if (!memberSessions.length) {
    throw new Error(`Series ${seriesId} has no member sessions.`);
  }

  const required = memberSessions.filter(s => s.seriesMembership?.required !== false);
  if (!required.length) {
    throw new Error(`Series ${seriesId} has no required member sessions — nothing to certify.`);
  }

  // Refuse to issue until every required session is completed.
  const notCompleted = required.filter(s => s.status !== 'completed');
  if (notCompleted.length) {
    return {
      issued: [],
      skipped: [],
      failed: [],
      notReady: true,
      pendingSessions: notCompleted.map(s => ({ id: s._id, title: s.title, status: s.status }))
    };
  }

  // Build the union of registrants across required sessions — a user needs to
  // have registered for at least one to be considered; qualification checks
  // ALL required sessions.
  const registrantIds = new Set();
  for (const s of required) {
    for (const r of s.registrants) {
      if (r.user) registrantIds.add(r.user.toString());
    }
  }

  const issued = [];
  const skipped = [];
  const failed = [];

  for (const userIdStr of registrantIds) {
    try {
      // Check every required session's threshold AND evaluation for this user.
      let disqualified = null;
      for (const s of required) {
        if (!s.meetsAttendanceThreshold(userIdStr)) {
          disqualified = { reason: 'attendance-below-threshold', sessionId: s._id, sessionTitle: s.title };
          break;
        }
        const attRec = s.attendance.find(a => a.user && a.user.toString() === userIdStr);
        if (!attRec?.evaluationCompleted) {
          disqualified = { reason: 'evaluation-not-completed', sessionId: s._id, sessionTitle: s.title };
          break;
        }
      }
      if (disqualified) {
        skipped.push({ userId: userIdStr, ...disqualified });
        continue;
      }

      const existing = await Certificate.findOne({
        userId: userIdStr,
        sessionSeriesId: series._id,
        isRevoked: { $ne: true }
      });
      if (existing) {
        skipped.push({ userId: userIdStr, reason: 'already-issued', certificateNumber: existing.certificateNumber });
        continue;
      }

      const user = await User.findById(userIdStr);
      if (!user) { skipped.push({ userId: userIdStr, reason: 'user-not-found' }); continue; }

      // Certificate number keyed off the series (not any single session).
      const certificateNumber = await generateCertificateNumber(series._id, user._id);

      const userName =
        (user.profile?.certificateName?.trim()) ||
        `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim() ||
        user.email;

      // Latest required session's end date = the overall completion date.
      const completionDate = required.reduce((latest, s) => {
        return (!latest || s.scheduledEnd > latest) ? s.scheduledEnd : latest;
      }, null);

      const sessionDates = required.map(s => ({
        title: s.title,
        date: s.scheduledEnd
      }));

      const category =
        required[0]?.nbccContentAreas?.[0] ||
        series.category ||
        'Counseling Theory/Practice and the Counseling Relationship';

      const pdfBuffer = await generateCertificate({
        holderName: userName,
        courseName: series.title,
        completionDate,
        ceHours: series.totalCeuHours,
        certificateNumber,
        acepNumber: 'ACEP #7760',
        ceCategory: category,
        objectives: required.flatMap(s => s.objectives || []),
        instructorName: series.presenter?.name || required[0]?.presenter?.name || undefined,
        // Multi-session series lists every session date on the cert body.
        // utils/certificate.js renders this when present.
        sessionDates,
        approvals: buildApprovalBlock(null, 'NBCC', series.totalCeuHours).map(a => ({
          ...a,
          deliveryFormat: 'synchronous'
        }))
      });

      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'raw',
            folder: 'certificates',
            public_id: `cert_${certificateNumber}_series_${Date.now()}`,
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
        sessionSeriesId: series._id,
        title: series.title,
        provider: 'Ga Integrated Therapeutic Perspectives, LLC',
        completionDate,
        ceHours: series.totalCeuHours,
        category: series.category || 'Other',
        nbccApproved: true,
        acepNumber: '7760',
        approvingBody: 'NBCC',
        approvalNumber: '#7760',
        certificateNumber,
        source: 'platform',
        fileUrl: uploadResult.secure_url
      });
      await certificate.save();

      // CE auto-apply to active credentials (mirrors the per-session path)
      try {
        const credentials = await UserCredential.find({
          userId: userIdStr,
          status: { $in: ['active', 'expiring_soon'] }
        });
        for (const credential of credentials) {
          try {
            await credential.addCEU({
              certificateId: certificate._id,
              hours: certificate.ceHours,
              category: certificate.category || 'Other',
              description: `${series.title} - CounselorReady Live Webinar Series`,
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

      issued.push({ userId: userIdStr, certificateNumber, certificateId: certificate._id, fileUrl: uploadResult.secure_url });
      console.log(`${LOG} issued series cert ${certificateNumber} to ${user.email} for "${series.title}"`);
    } catch (err) {
      console.error(`${LOG} Series cert failed for user ${userIdStr}:`, err.message);
      failed.push({ userId: userIdStr, error: err.message });
    }
  }

  return { issued, skipped, failed };
}

export default { issueLiveSessionCertificates, issueSeriesCertificates };
