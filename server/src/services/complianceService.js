/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */

/**
 * complianceService — Practice Compliance nightly job + assignment helpers.
 *
 * NEW additive service. Does NOT touch the locked certificate issuance
 * pipeline. Cert → Assignment linking is done here by RECONCILIATION: each
 * night we match newly-issued Certificates against open Assignments and close
 * them out (the chosen approach — no edits to interactiveCourseRoutes.js or
 * courseCompletionService.js).
 *
 * Nightly stages (each independently guarded — one failure never aborts the rest):
 *   1. reconcileCertCompletions  — close assignments completed via the cert pipeline
 *   2. flipOverdueAssignments    — assigned/in_progress → overdue past dueDate; STR recoupment flag
 *   3. sendAssignmentDueAlerts   — due in 14 / 7 / 1 days (dedupe via alertsSent)
 *   4. sendCredentialExpiryAlerts— credentials expiring 90 / 60 / 30 / 7 days (dedupe)
 *   5. sendRecoupmentAlerts      — GA STR overdue ⇒ "billing at risk" to owner + alertEmails
 */
import { Resend } from 'resend';
import Organization from '../models/Organization.js';
import Assignment from '../models/Assignment.js';
import OrgCredential from '../models/OrgCredential.js';
import Certificate from '../models/Certificate.js';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM = 'CounselorReady <noreply@counselorready.com>';

const DAY_MS = 1000 * 60 * 60 * 24;

// Best-effort email — never throws, never blocks the job.
async function sendEmail(to, subject, html) {
  try {
    if (!resend || !to || (Array.isArray(to) && to.length === 0)) return;
    await resend.emails.send({ from: FROM, to, subject, html });
  } catch (err) {
    console.error('[complianceService] email failed:', err.message);
  }
}

/**
 * Resolve a {STATE} placeholder in a course code from the org's primary state.
 * 'CR-PC102-{STATE}' + org GA  ->  'CR-PC102-GA'
 */
export function resolveCourseCode(code, org) {
  if (!code || !code.includes('{STATE}')) return code;
  const state = (org?.settings?.statesOfOperation || [])[0] || (org?.address?.state) || 'GA';
  return code.replace('{STATE}', String(state).toUpperCase());
}

/**
 * Build Assignment payloads for one track applied to a set of seats.
 * Returns an array of plain objects (caller does the insert). Idempotency is the
 * caller's responsibility (skip seats with an open assignment for the same code).
 */
export function buildAssignmentsForTrack(org, track, seats) {
  const now = Date.now();
  const out = [];
  for (const seat of seats) {
    for (const item of (track.items || [])) {
      const code = resolveCourseCode(item.courseCode, org);
      out.push({
        orgId: org._id,
        seatId: seat._id,
        userId: seat.userId || null,
        courseCode: code,
        courseRef: item.courseRef || null,
        label: item.label || code,
        trackId: track._id || null,
        dueDate: new Date(now + (item.dueDays ?? 30) * DAY_MS),
        status: 'assigned',
        recurrence: item.recurrence || 'none',
        subjectArea: item.subjectArea || null,
        hours: item.hours || 0,
        manualVersion: track.manualVersion || null,
        deliveryMode: item.deliveryMode || 'cr_delivered',
        external: !!item.external,
        alertsSent: []
      });
    }
  }
  return out;
}

// ── Stage 1: reconcile cert completions ──────────────────────────────────────
async function reconcileCertCompletions() {
  const open = await Assignment.find({
    status: { $in: ['assigned', 'in_progress', 'overdue'] },
    external: { $ne: true } // external items (Relias/CPR) are closed via credential vault, not certs
  }).lean();
  if (open.length === 0) return { linked: 0, recurred: 0 };

  let linked = 0;
  let recurred = 0;

  for (const a of open) {
    if (!a.userId) continue;
    // Find a matching certificate issued at/after this assignment was created.
    const certs = await Certificate.find({
      userId: a.userId,
      isRevoked: { $ne: true },
      completionDate: { $gte: a.createdAt || new Date(0) }
    }).select('courseId title ceHours completionDate').lean();

    const match = certs.find(c =>
      (a.courseRef && c.courseId && String(c.courseId) === String(a.courseRef)) ||
      (a.courseTitle && c.title && c.title.trim().toLowerCase() === a.courseTitle.trim().toLowerCase()) ||
      (a.courseCode && c.title && c.title.toUpperCase().includes(a.courseCode))
    );
    if (!match) continue;

    await Assignment.updateOne(
      { _id: a._id, status: { $ne: 'completed' } },
      {
        $set: {
          status: 'completed',
          completedAt: match.completionDate || new Date(),
          certificateId: match._id,
          creditedHours: match.ceHours || a.hours || 0,
          recoupmentRisk: false
        }
      }
    );
    linked++;

    // Annual / biennial recurrence — create the next cycle immediately (idempotent).
    if (a.recurrence === 'annual' || a.recurrence === 'biennial') {
      const exists = await Assignment.exists({ recurrenceParentId: a._id });
      if (!exists) {
        const years = a.recurrence === 'biennial' ? 2 : 1;
        const base = match.completionDate || new Date();
        const nextDue = new Date(base.getTime());
        nextDue.setFullYear(nextDue.getFullYear() + years);
        await Assignment.create({
          orgId: a.orgId,
          seatId: a.seatId,
          userId: a.userId,
          courseCode: a.courseCode,
          courseRef: a.courseRef,
          courseTitle: a.courseTitle,
          label: a.label,
          trackId: a.trackId,
          dueDate: nextDue,
          status: 'assigned',
          recurrence: a.recurrence,
          recurrenceParentId: a._id,
          subjectArea: a.subjectArea,
          hours: a.hours,
          manualVersion: a.manualVersion,
          deliveryMode: a.deliveryMode,
          external: a.external,
          alertsSent: []
        });
        recurred++;
      }
    }
  }
  return { linked, recurred };
}

// ── Stage 2: flip overdue + STR recoupment flag ──────────────────────────────
async function flipOverdueAssignments() {
  const now = new Date();
  const res = await Assignment.updateMany(
    { status: { $in: ['assigned', 'in_progress'] }, dueDate: { $lt: now } },
    { $set: { status: 'overdue' } }
  );
  // GA STR exposure: overdue dbhdd-agency items (esp. STR) ⇒ recoupment risk.
  await Assignment.updateMany(
    { status: 'overdue', $or: [{ subjectArea: { $ne: null } }, { deliveryMode: { $in: ['relias_online', 'provider_based', 'external'] } }], manualVersion: { $ne: null } },
    { $set: { recoupmentRisk: true } }
  );
  return { flipped: res.modifiedCount || 0 };
}

// ── Stage 3: assignment due-soon alerts ──────────────────────────────────────
async function sendAssignmentDueAlerts() {
  const now = Date.now();
  const windows = [{ days: 14, tag: '14d' }, { days: 7, tag: '7d' }, { days: 1, tag: '1d' }];
  let sent = 0;
  for (const w of windows) {
    const lo = new Date(now);
    const hi = new Date(now + w.days * DAY_MS);
    const due = await Assignment.find({
      status: { $in: ['assigned', 'in_progress'] },
      dueDate: { $gte: lo, $lte: hi },
      alertsSent: { $ne: w.tag }
    }).populate('userId', 'email profile').lean();
    for (const a of due) {
      const email = a.userId?.email;
      if (email) {
        await sendEmail(email, `Training due soon: ${a.label || a.courseCode}`,
          `<p>Your assigned training <strong>${a.label || a.courseCode}</strong> is due ${a.dueDate ? new Date(a.dueDate).toLocaleDateString() : 'soon'}.</p>`);
      }
      await Assignment.updateOne({ _id: a._id }, { $addToSet: { alertsSent: w.tag } });
      sent++;
    }
  }
  return { sent };
}

// ── Stage 4: credential expiry alerts ────────────────────────────────────────
async function sendCredentialExpiryAlerts() {
  const now = Date.now();
  const windows = [{ days: 90, tag: '90d' }, { days: 60, tag: '60d' }, { days: 30, tag: '30d' }, { days: 7, tag: '7d' }];
  let sent = 0;
  for (const w of windows) {
    const hi = new Date(now + w.days * DAY_MS);
    const lo = new Date(now);
    const creds = await OrgCredential.find({
      expiresAt: { $gte: lo, $lte: hi },
      alertsSent: { $ne: w.tag }
    }).populate('userId', 'email profile').lean();
    for (const c of creds) {
      const org = await Organization.findById(c.orgId).select('settings alertEmails name').lean();
      const recipients = [c.userId?.email, ...(org?.settings?.alertEmails || [])].filter(Boolean);
      await sendEmail(recipients, `Credential expiring: ${c.label || c.type}`,
        `<p>The credential <strong>${c.label || c.type}</strong> expires on ${c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : 'soon'} (${w.days} days).</p>`);
      await OrgCredential.updateOne({ _id: c._id }, { $addToSet: { alertsSent: w.tag } });
      sent++;
    }
  }
  return { sent };
}

// ── Stage 5: GA STR recoupment "billing at risk" alerts ──────────────────────
async function sendRecoupmentAlerts() {
  const atRisk = await Assignment.find({ status: 'overdue', recoupmentRisk: true, alertsSent: { $ne: 'recoupment' } })
    .populate('userId', 'email profile').lean();
  let sent = 0;
  for (const a of atRisk) {
    const org = await Organization.findById(a.orgId).select('ownerId settings name billingEmail').lean();
    if (!org) continue;
    const owner = await Organization.db.model('User').findById(org.ownerId).select('email').lean().catch(() => null);
    const recipients = [owner?.email, org.billingEmail, ...(org?.settings?.alertEmails || [])].filter(Boolean);
    const who = a.userId?.profile ? `${a.userId.profile.firstName || ''} ${a.userId.profile.lastName || ''}`.trim() : 'A staff member';
    await sendEmail(recipients, `⚠️ BILLING AT RISK — recoupment exposure (${org.name})`,
      `<p><strong>${who}</strong> has an overdue Standard Training Requirement item (<strong>${a.label || a.courseCode}</strong>) past its deadline.</p>
       <p>Per the DBHDD Provider Manual, services billed outside the grace period are subject to <strong>recoupment</strong>. Resolve this training to restore billing eligibility.</p>`);
    await Assignment.updateOne({ _id: a._id }, { $addToSet: { alertsSent: 'recoupment' } });
    sent++;
  }
  return { sent };
}

/**
 * Nightly entry point. Wired from index.js cron. Each stage is independently
 * guarded so a failure in one never aborts the others.
 */
export async function runComplianceDailyJob() {
  const results = {};
  const stages = [
    ['reconcile', reconcileCertCompletions],
    ['overdue', flipOverdueAssignments],
    ['dueAlerts', sendAssignmentDueAlerts],
    ['credentialAlerts', sendCredentialExpiryAlerts],
    ['recoupmentAlerts', sendRecoupmentAlerts]
  ];
  for (const [name, fn] of stages) {
    try {
      results[name] = await fn();
    } catch (err) {
      console.error(`[complianceService] stage ${name} failed:`, err.message);
      results[name] = { error: err.message };
    }
  }
  console.log('[complianceService] daily job complete:', JSON.stringify(results));
  return results;
}

export default { runComplianceDailyJob, resolveCourseCode, buildAssignmentsForTrack };
