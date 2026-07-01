// Create test partner account directly in MongoDB
// Run from ~/project/src/server:
//   node --input-type=module < src/scripts/createTestPartner.js
//
// Deletes any existing account with the same email/slug first — safe to re-run.
// Login after: https://counselorready.com/login.html
//   email:    test-partner@counselorready.com
//   password: TestPartner2026!

import mongoose from 'mongoose';
import User from './src/models/User.js';
import Partner from './src/models/Partner.js';

const EMAIL    = 'test-partner@counselorready.com';
const PASSWORD = 'TestPartner2026!';
const SLUG     = 'cr-test';
const COMPANY  = 'CounselorReady Test Partner';

await mongoose.connect(process.env.MONGODB_URI);

// ── Clean up any prior test account ──────────────────────────────────────────
const existing = await User.findOne({ email: EMAIL });
if (existing) {
  await Partner.deleteOne({ _id: existing.partnerId });
  await User.deleteOne({ _id: existing._id });
  console.log('Removed prior test account.');
}
await Partner.deleteOne({ slug: SLUG }); // orphan guard

// ── Create Partner ────────────────────────────────────────────────────────────
const trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

const partner = await Partner.create({
  name: COMPANY,
  slug: SLUG,
  branding: {
    companyName: COMPANY,
    subdomain: SLUG,
    primaryColor: '#6B1D34',
    accentColor: '#D4A855'
  },
  contact: { email: EMAIL },
  billing: { plan: 'free', status: 'trial', trialEndsAt },
  active: true
});

// ── Create User (password hashed by pre-save hook) ───────────────────────────
const user = await User.create({
  email: EMAIL,
  passwordHash: PASSWORD,       // pre-save hook hashes this
  profile: { firstName: 'Test', lastName: 'Partner' },
  role: 'partner_admin',
  partnerId: partner._id,
  emailVerified: true,
  subscription: { status: 'trial', plan: 'free', trialEndsAt }
});

console.log('\n✓ Test partner account created');
console.log('  Partner ID :', partner._id.toString());
console.log('  User ID    :', user._id.toString());
console.log('  Subdomain  :', `${SLUG}.counselorready.com`);
console.log('\nLogin at https://counselorready.com/login.html');
console.log('  email   :', EMAIL);
console.log('  password:', PASSWORD);
console.log('\nDashboard: https://counselorready.com/partner-dashboard.html');
console.log('\nTo DELETE this account later, re-run this script (it cleans up first)');
console.log('or run: await User.deleteOne({ email: "' + EMAIL + '" }) + Partner.deleteOne({ slug: "' + SLUG + '" })');

await mongoose.disconnect();
