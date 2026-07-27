/**
 * Read-only diagnostic: inspect a single user's account state.
 * Usage: node src/scripts/checkUser.js sarabolton@gmail.com
 * No writes. Safe to run anytime.
 */
import mongoose from 'mongoose';
import User from '../models/User.js';

const email = (process.argv[2] || '').toLowerCase();

if (!email) {
  console.error('Usage: node src/scripts/checkUser.js <email>');
  process.exit(1);
}

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);

  const user = await User.findOne({ email }).select(
    '+passwordHash +passwordResetToken +passwordResetExpires'
  );

  if (!user) {
    console.log(`No user found for ${email}`);
    await mongoose.disconnect();
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
  console.log('passwordResetToken set:', !!user.passwordResetToken);
  console.log('passwordResetExpires:', user.passwordResetExpires || null);
  console.log(
    'passwordResetExpires valid (future):',
    user.passwordResetExpires ? user.passwordResetExpires > Date.now() : null
  );
  console.log('twoFactorEnabled:', user.twoFactorEnabled);
  console.log('lastLoginAt:', user.lastLoginAt || null);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Diagnostic error:', err);
  process.exit(1);
});
