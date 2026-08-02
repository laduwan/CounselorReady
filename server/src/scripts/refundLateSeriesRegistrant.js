/**
 * Remove a registrant's seat(s) from specific LiveSessions whose
 * registration was already closed when a session-series purchase enrolled
 * them (the sessionSeries/payments.js gap — see findLateRegistrants.js /
 * checkRegistrationTiming.js for how these get detected).
 *
 * Also issues a FULL refund on the ORIGINAL series Stripe checkout session.
 * This is a full refund, not proportional — the series purchase is a single
 * charge, and this script is for the case where the whole thing is being
 * unwound (e.g. every occurrence hits the same scheduling conflict), not a
 * partial removal of some sessions while keeping others.
 * The series checkout is located by searching recent Stripe Checkout Sessions
 * for metadata.type === 'session-series' + metadata.seriesId + metadata.userId
 * (registrants pushed via that path never get a per-session
 * stripeCheckoutSessionId stamped — see payments.js session-series branch —
 * so this is the only way back to the original payment).
 *
 * DRY RUN BY DEFAULT — prints the plan (sessions to pull, refund amount) and
 * makes NO changes. Set APPLY=1 to actually remove the registrant entries
 * and issue the Stripe refund.
 *
 * On APPLY, a single cancellation/refund email is sent to the registrant
 * listing every cancelled occurrence against the one total refund — no email
 * is sent in dry-run mode, and none is sent to admin (Ke already knows).
 *
 * Usage:
 *   node src/scripts/refundLateSeriesRegistrant.js <email> <seriesId> <sessionId1,sessionId2,...>
 *   APPLY=1 node src/scripts/refundLateSeriesRegistrant.js <email> <seriesId> <sessionId1,sessionId2,...>
 *
 * Example (Kennyetta / Ethics Table Talk, all 4 weekly occurrences from the screenshot):
 *   node src/scripts/refundLateSeriesRegistrant.js kwatkins@relentlesscounseling.com \
 *     6a636c29131f5f1d3ed63a5d \
 *     6a6356087387430dedf9acff,6a63581aba8d107dd241d75d,<part1-id>,<part2-id>
 */
import mongoose from 'mongoose';
import Stripe from 'stripe';
import User from '../models/User.js';
import LiveSession from '../models/LiveSession.js';
import SessionSeries from '../models/SessionSeries.js';
import { sendLiveSessionCancellationRefundEmail } from '../services/emailService.js';

const APPLY = process.env.APPLY === '1';
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

const [emailArg, seriesIdArg, sessionIdsArg] = process.argv.slice(2);

if (!emailArg || !seriesIdArg || !sessionIdsArg) {
  console.error('Usage: node src/scripts/refundLateSeriesRegistrant.js <email> <seriesId> <sessionId1,sessionId2,...>');
  process.exit(1);
}

const email = emailArg.toLowerCase();
const targetSessionIds = sessionIdsArg.split(',').map(s => s.trim()).filter(Boolean);

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);

  const user = await User.findOne({ email });
  if (!user) {
    console.log(`No user found for ${email}`);
    return mongoose.disconnect();
  }

  const series = await SessionSeries.findById(seriesIdArg);
  if (!series) {
    console.log(`No SessionSeries found for ${seriesIdArg}`);
    return mongoose.disconnect();
  }

  // Same member-session resolution as payments.js session-series webhook
  // branch and sessionSeries.js register route — used only to validate the
  // given IDs actually belong to this series before touching anything.
  const memberSessions = series.autoEnroll === 'all'
    ? await LiveSession.find({ seriesId: series._id })
    : await LiveSession.find({ seriesId: series._id, 'seriesMembership.required': { $ne: false } });

  const targetSessions = memberSessions.filter(s => targetSessionIds.includes(s._id.toString()));

  if (targetSessions.length !== targetSessionIds.length) {
    console.warn(`⚠️  Only matched ${targetSessions.length} of ${targetSessionIds.length} given session IDs against this series' member sessions. Double-check the IDs before proceeding.`);
  }

  console.log('--- Plan ---');
  console.log('user:', user.email, `(${user._id})`);
  console.log('series:', series.title, `(${series._id})`);
  console.log(`removing seat from ${targetSessions.length} occurrence(s):`);
  for (const s of targetSessions) {
    console.log(`  - ${s.title} (${s._id})  scheduledStart: ${s.scheduledStart}`);
  }

  // ── Locate the original Stripe checkout session for this purchase ──
  // Registrants pushed via the session-series path never get a per-registrant
  // stripeCheckoutSessionId, so we search Checkout Sessions by metadata
  // instead. Widen/narrow the `created` window below if this comes up empty —
  // it defaults to the 24h before the earliest target registeredAt timestamp.
  let checkoutSession = null;
  if (stripe) {
    const earliestRegisteredAt = targetSessions
      .map(s => s.registrants.find(r => r.user && r.user.toString() === user._id.toString())?.registeredAt)
      .filter(Boolean)
      .sort((a, b) => a - b)[0];
    const windowStart = earliestRegisteredAt
      ? Math.floor(earliestRegisteredAt.getTime() / 1000) - 24 * 3600
      : Math.floor(Date.now() / 1000) - 7 * 24 * 3600;

    const list = await stripe.checkout.sessions.list({
      created: { gte: windowStart },
      limit: 100
    });
    checkoutSession = list.data.find(cs =>
      cs.metadata?.type === 'session-series' &&
      cs.metadata?.seriesId === series._id.toString() &&
      cs.metadata?.userId === user._id.toString()
    );
  }

  if (checkoutSession) {
    console.log('\n--- Refund (full — single charge covers the whole purchase) ---');
    console.log('checkout session:', checkoutSession.id);
    console.log('payment_intent:', checkoutSession.payment_intent);
    console.log('amount_total paid (cents):', checkoutSession.amount_total, checkoutSession.currency);
    console.log('refund amount (full):', checkoutSession.amount_total, checkoutSession.currency);
  } else {
    console.log('\n--- Refund ---');
    console.log('Could not locate the original Stripe checkout session for this purchase — no refund will be issued.');
    console.log('Widen the search window in this script, or issue the refund manually from the Stripe Dashboard.');
  }

  if (!APPLY) {
    console.log('\nDRY RUN — no seats removed, no refund issued, no email sent. Re-run with APPLY=1 to execute.');
    return mongoose.disconnect();
  }

  // ── Apply: remove the registrant entry from each target session ──
  for (const s of targetSessions) {
    s.registrants = s.registrants.filter(r => !(r.user && r.user.toString() === user._id.toString()));
    await s.save();
    console.log(`Removed seat: "${s.title}" (${s._id})`);
  }

  // ── Apply: issue the full Stripe refund ──
  if (checkoutSession) {
    const refund = await stripe.refunds.create({
      payment_intent: checkoutSession.payment_intent,
      amount: checkoutSession.amount_total,
      reason: 'requested_by_customer'
    });
    console.log('Refund issued:', refund.id, refund.amount, refund.currency, refund.status);

    // ── Notify the registrant: one email, listing every cancelled
    //    occurrence against the single total refund. ──
    try {
      const emailResult = await sendLiveSessionCancellationRefundEmail(user, targetSessions[0], {
        sessions: targetSessions,
        refundAmountCents: refund.amount
      });
      console.log('Cancellation/refund email:', emailResult.success ? 'sent' : `FAILED (${emailResult.error})`);
    } catch (err) {
      console.error('Cancellation/refund email error:', err.message);
    }
  } else {
    console.log('No refund issued (checkout session not found) — handle manually in Stripe if needed.');
    console.log('No cancellation email sent, since no refund was confirmed.');
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Script error:', err);
  process.exit(1);
});
