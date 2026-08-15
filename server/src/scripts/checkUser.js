/**
 * Read-only diagnostic: inspect one or more users' account state.
 * Usage: node src/scripts/checkUser.js sarabolton@gmail.com
 * No writes. Safe to run anytime.
 */
import mongoose from 'mongoose';
import User from '../models/User.js';
import Certificate from '../models/Certificate.js';
import UserCourseProgress from '../models/UserCourseProgress.js';
import UserCredential from '../models/UserCredential.js';

const emails = process.argv.slice(2).map((e) => e.toLowerCase());

if (emails.length === 0) {
  console.error('Usage: node src/scripts/checkUser.js <email> [email2 ...]');
  process.exit(1);
}

async function checkOneUser(email) {
  const user = await User.findOne({ email }).select(
    '+passwordHash +passwordResetToken +passwordResetExpires'
  );

  if (!user) {
    console.log(`No user found for ${email}`);
    return;
  }

  console.log('--- User found ---');
  console.log('_id:', user._id.toString());
  console.log('email:', user.email);
  console.log('createdAt:', user.createdAt);
  console.log('updatedAt:', user.updatedAt);
  console.log('emailVerified:', user.emailVerified);
  console.log('has passwordHash:', !!user.passwordHash);
  console.log('passwordHash length:', user.passwordHash ? user.passwordHash.length : 0);
  console.log('partnerId:', user.partnerId || null);
  console.log('subscription.status:', user.subscription?.status);
  console.log('subscription.plan:', user.subscription?.plan);
  console.log('subscription.stripeCustomerId:', user.subscription?.stripeCustomerId || null);
  console.log('subscription.stripeSubscriptionId:', user.subscription?.stripeSubscriptionId || null);
  console.log('passwordResetToken set:', !!user.passwordResetToken);
  console.log('passwordResetExpires:', user.passwordResetExpires || null);
  console.log(
    'passwordResetExpires valid (future):',
    user.passwordResetExpires ? user.passwordResetExpires > Date.now() : null
  );
  console.log('twoFactorEnabled:', user.twoFactorEnabled);
  console.log('lastLoginAt:', user.lastLoginAt || null);

  const [certCount, progressCount, credentialCount] = await Promise.all([
    Certificate.countDocuments({ userId: user._id }),
    UserCourseProgress.countDocuments({ userId: user._id }),
    UserCredential.countDocuments({ userId: user._id })
  ]);
  console.log('--- Related records ---');
  console.log('certificates:', certCount);
  console.log('course progress records:', progressCount);
  console.log('tracked credentials:', credentialCount);
  console.log('SAFE TO DELETE (no history):', certCount === 0 && progressCount === 0 && credentialCount === 0);
}

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);

  for (const email of emails) {
    console.log(`\n=== ${email} ===`);
    await checkOneUser(email);
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Diagnostic error:', err);
  process.exit(1);
});
