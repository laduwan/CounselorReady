/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 */

/**
 * multiPartPolicy — the ALL-SALES-FINAL policy for multi-part (series) live courses.
 * Single source of truth: the public catalog shows it (GET /upcoming), registration
 * requires the learner to accept THIS version (POST /:id/register → policyAck),
 * Stripe Checkout repeats it above the Pay button, and the accepted version +
 * timestamp are stored on the registrant / Stripe metadata as dispute evidence.
 *
 * Changing the wording? Bump POLICY_VERSION so every future acceptance records
 * which text the learner agreed to. Keep refund-policy.html in sync.
 */

export const POLICY_VERSION = '2026-09-11';

const fmt = (d, tz = 'America/New_York') => new Date(d).toLocaleString('en-US', {
  timeZone: tz, weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
}) + ' ET';

/**
 * @param {object} p { part, partsRequired, ceHours, thresholdPct, run: [{part, scheduledStart}] }
 * @returns {{ version, heading, summary, points: string[], exception, checkbox, runDates: string[], stripeText }}
 */
export function buildMultiPartPolicy({ part, partsRequired, ceHours, thresholdPct = 90, run = [] }) {
  const runDates = [...run]
    .sort((a, b) => (a.part || 0) - (b.part || 0))
    .map(r => `Part ${r.part}: ${fmt(r.scheduledStart)}`);
  const n = partsRequired || 2;
  return {
    version: POLICY_VERSION,
    heading: 'Multi-part course — all sales final',
    summary: `This is Part ${part || '?'} of a ${n}-part course. The certificate${ceHours ? ` (${ceHours} CE hours)` : ''} is issued only after you attend EVERY part of the same run, at ${thresholdPct}% or more of each part.`,
    points: [
      'NO REFUNDS. NO RESCHEDULES. Attendance and CE credit are tracked across all parts together, so every registration for a multi-part course is final.',
      'We cannot refund, credit, or move you to a different date or time slot for any reason — including missed parts, schedule conflicts, late arrival, illness, or internet or device problems on your end.',
      'Missing any part, or attending less than the required time in any part, means no certificate and no partial CE credit for this run.',
      'You are responsible for registering for, and attending, every part listed for this run.'
    ],
    exception: 'The only exception: if CounselorReady cancels or reschedules a part, you will be offered a seat in another run or a full refund for that part.',
    checkbox: 'I have read and agree: all sales are final — no refunds, no reschedules — and I must attend every part of this run to earn the certificate.',
    runDates,
    // Shown by Stripe above the Pay button (limit 1200 chars)
    stripeText: `ALL SALES FINAL — multi-part course (Part ${part || '?'} of ${n}). No refunds, credits, or reschedules for any reason, including missed parts or technical problems on your end. The certificate requires attending every part of this run. You accepted this policy (version ${POLICY_VERSION}) before checkout.`
  };
}
