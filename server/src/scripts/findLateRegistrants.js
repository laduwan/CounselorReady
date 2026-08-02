/**
 * Read-only diagnostic: scan every LiveSession and flag registrants whose
 * registeredAt is AFTER that session's own registrationDeadline() — i.e.
 * people who got seated after registration should have been closed.
 *
 * For each hit, reports how they got in:
 *   - paid:true, registeredAt exact webhook time  → likely the series-purchase
 *     webhook path (payments.js session-series branch) or single-session
 *     Stripe fulfillment, neither of which re-checks the cutoff at write time.
 *   - paid:false                                   → likely the free/member
 *     series-enroll loop (sessionSeries.js), which never checks the cutoff.
 *   - Also flags whether the session belongs to a series, since both known
 *     gaps are series-shaped.
 *
 * Usage: node src/scripts/findLateRegistrants.js
 * No writes. Safe to run anytime.
 */
import mongoose from 'mongoose';
import LiveSession from '../models/LiveSession.js';
import User from '../models/User.js';

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);

  const sessions = await LiveSession.find({}).populate('registrants.user', 'email profile.firstName profile.lastName');

  let hits = 0;

  for (const session of sessions) {
    const deadline = session.registrationDeadline();
    if (!deadline) continue; // no cutoff configured for this session

    for (const r of session.registrants) {
      if (!r.registeredAt || r.registeredAt.getTime() <= deadline.getTime()) continue;

      hits++;
      const u = r.user;
      const name = u ? `${u.profile?.firstName || ''} ${u.profile?.lastName || ''}`.trim() : '(user not found)';
      const email = u ? u.email : '(unknown)';
      const lateByMin = Math.round((r.registeredAt.getTime() - deadline.getTime()) / 60000);

      console.log('--- Late registrant ---');
      console.log('session:', session.title, `(${session._id})`);
      console.log('seriesId:', session.seriesId || null);
      console.log('registrant:', name, `<${email}>`);
      console.log('registeredAt:', r.registeredAt.toISOString());
      console.log('registrationDeadline:', deadline.toISOString());
      console.log('late by (min):', lateByMin);
      console.log('paid:', r.paid);
      console.log('stripeCheckoutSessionId:', r.stripeCheckoutSessionId || null);
      console.log('');
    }
  }

  console.log(`Scanned ${sessions.length} sessions. Found ${hits} late registration(s).`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Diagnostic error:', err);
  process.exit(1);
});
