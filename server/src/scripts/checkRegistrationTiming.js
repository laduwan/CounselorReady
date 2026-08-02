/**
 * Read-only diagnostic: for a given user email, list every LiveSession
 * they're registered for and show whether registeredAt landed before or
 * after that session's registrationDeadline() — to catch registrations
 * that slipped in through the session-series enroll paths (which don't
 * enforce the per-session cutoff).
 *
 * Usage: node src/scripts/checkRegistrationTiming.js kennyetta.watkins@gmail.com
 * No writes. Safe to run anytime.
 */
import mongoose from 'mongoose';
import User from '../models/User.js';
import LiveSession from '../models/LiveSession.js';

const email = (process.argv[2] || '').toLowerCase();

if (!email) {
  console.error('Usage: node src/scripts/checkRegistrationTiming.js <email>');
  process.exit(1);
}

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);

  const user = await User.findOne({ email });
  if (!user) {
    console.log(`No user found for ${email}`);
    await mongoose.disconnect();
    return;
  }

  console.log('--- User ---');
  console.log('_id:', user._id.toString());
  console.log('email:', user.email);
  console.log('subscription.plan / status:', user.subscription?.plan, '/', user.subscription?.status);

  const sessions = await LiveSession.find({ 'registrants.user': user._id })
    .select('title slug status isPublished scheduledStart registrationCutoffHours seriesId capacity registrants producer.rosterEmailSentAt')
    .sort({ scheduledStart: 1 });

  if (!sessions.length) {
    console.log(`\nNo LiveSession registrations found for ${email}`);
    await mongoose.disconnect();
    return;
  }

  console.log(`\n--- ${sessions.length} session registration(s) ---`);
  for (const s of sessions) {
    const reg = s.registrants.find(r => r.user && r.user.toString() === user._id.toString());
    const deadline = s.registrationDeadline();
    const lateBySec = deadline ? Math.round((reg.registeredAt.getTime() - deadline.getTime()) / 1000) : null;

    console.log(`\nSession: "${s.title}" (${s._id})`);
    console.log('  seriesId:', s.seriesId || null);
    console.log('  status / isPublished:', s.status, '/', s.isPublished);
    console.log('  scheduledStart:', s.scheduledStart);
    console.log('  registrationCutoffHours:', s.registrationCutoffHours);
    console.log('  registrationDeadline():', deadline);
    console.log('  registeredAt:', reg.registeredAt);
    console.log('  paid / stripeCheckoutSessionId:', reg.paid, '/', reg.stripeCheckoutSessionId || null);
    console.log('  capacity / registrant count:', s.capacity, '/', s.registrants.length);
    if (deadline) {
      console.log(
        lateBySec > 0
          ? `  ⚠️  Registered ${lateBySec}s (${(lateBySec / 60).toFixed(1)} min) AFTER the cutoff.`
          : `  OK — registered ${Math.abs(lateBySec)}s before the cutoff.`
      );
    } else {
      console.log('  (no cutoff configured for this session — registrationCutoffHours: 0)');
    }
    console.log('  rosterEmailSentAt:', s.producer?.rosterEmailSentAt || null);
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Diagnostic error:', err);
  process.exit(1);
});
