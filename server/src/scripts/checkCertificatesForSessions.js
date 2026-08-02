/**
 * Read-only diagnostic: check whether a Certificate record exists for a
 * given user against specific LiveSession IDs — used after
 * refundLateSeriesRegistrant.js to confirm no certificate was auto-issued
 * for a session that was later unwound (registrant removed + refunded).
 *
 * Usage:
 *   node src/scripts/checkCertificatesForSessions.js <email> <sessionId1,sessionId2,...>
 * No writes. Safe to run anytime.
 */
import mongoose from 'mongoose';
import User from '../models/User.js';
import Certificate from '../models/Certificate.js';

const [emailArg, sessionIdsArg] = process.argv.slice(2);

if (!emailArg || !sessionIdsArg) {
  console.error('Usage: node src/scripts/checkCertificatesForSessions.js <email> <sessionId1,sessionId2,...>');
  process.exit(1);
}

const email = emailArg.toLowerCase();
const sessionIds = sessionIdsArg.split(',').map(s => s.trim()).filter(Boolean);

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);

  const user = await User.findOne({ email });
  if (!user) {
    console.log(`No user found for ${email}`);
    return mongoose.disconnect();
  }

  console.log('--- User ---');
  console.log('email:', user.email, `(${user._id})`);

  for (const sessionId of sessionIds) {
    const cert = await Certificate.findOne({ userId: user._id, liveSessionId: sessionId });
    console.log(`\nsession ${sessionId}:`);
    if (cert) {
      console.log('  ⚠️  CERTIFICATE FOUND — id:', cert._id.toString());
      console.log('  title:', cert.title);
      console.log('  completionDate:', cert.completionDate);
      console.log('  This session was removed/refunded — review whether this certificate should be revoked.');
    } else {
      console.log('  OK — no certificate on file for this user/session.');
    }
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Diagnostic error:', err);
  process.exit(1);
});
