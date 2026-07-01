// server/src/scripts/fixInvalidPhones.js
//
// One-time cleanup: clear phone values that are NOT valid phone numbers.
//
// WHY: before phone validation was added to PUT /api/users/profile, junk could
// be stored in the phone fields (e.g. an email address typed into the phone box).
// smsService prepends +1 to stripped digits, so a non-numeric value becomes the
// invalid recipient "+1" and every SMS to that user fails. This nulls out any
// stored phone that isn't a plausible number, in BOTH user.phone and
// user.profile.phone, so the user can simply re-enter a real number.
//
// "Valid" = 10–15 digits after stripping formatting (matches the route validator
// and Twilio/E.164 expectations). Empty/absent values are left untouched.
//
// SAFE: only clears values that fail validation. Never alters a valid number.
// Idempotent. Defaults to DRY-RUN; pass --commit to actually write.
//
// Usage (from ~/project/src/server in the Render shell):
//   node src/scripts/fixInvalidPhones.js            # dry-run, shows what would be cleared
//   node src/scripts/fixInvalidPhones.js --commit    # performs the cleanup
//
// After running successfully, this file can be deleted from the repo.

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URI not found in environment');
  process.exit(1);
}

const COMMIT = process.argv.includes('--commit');

// Same rule as the PUT /profile validator: a non-empty value must be 10–15 digits.
const hasValue = (v) => v !== undefined && v !== null && String(v).trim() !== '';
const isValidPhone = (v) => {
  const digits = String(v).replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
};

async function run() {
  await mongoose.connect(MONGODB_URI);
  const users = mongoose.connection.collection('users');

  // Pull anyone with a non-empty value in either phone field, then filter to
  // those where at least one of those non-empty values is invalid.
  const docs = await users.find({
    $or: [
      { phone: { $exists: true, $nin: [null, ''] } },
      { 'profile.phone': { $exists: true, $nin: [null, ''] } },
    ],
  }).project({ email: 1, phone: 1, 'profile.phone': 1 }).toArray();

  const bad = docs.filter((u) => {
    const topBad = hasValue(u.phone) && !isValidPhone(u.phone);
    const profBad = hasValue(u.profile?.phone) && !isValidPhone(u.profile.phone);
    return topBad || profBad;
  });

  console.log(`\n=== Invalid phone cleanup ${COMMIT ? '(COMMIT)' : '(DRY-RUN)'} ===`);
  console.log(`Found ${bad.length} record(s) with an invalid phone value.\n`);

  if (bad.length === 0) {
    console.log('Nothing to clean. Exiting.');
    await mongoose.connection.close();
    return;
  }

  for (const u of bad) {
    const top = hasValue(u.phone) ? `"${String(u.phone).trim()}"` : '(empty)';
    const prof = hasValue(u.profile?.phone) ? `"${String(u.profile.phone).trim()}"` : '(empty)';
    console.log(`  ${u.email || u._id}  ->  phone=${top}  profile.phone=${prof}  => will clear invalid field(s)`);
  }
  console.log('');

  if (!COMMIT) {
    console.log('DRY-RUN only — no changes written. Re-run with --commit to apply.');
    await mongoose.connection.close();
    return;
  }

  let updated = 0;
  for (const u of bad) {
    const unset = {};
    if (hasValue(u.phone) && !isValidPhone(u.phone)) unset.phone = '';
    if (hasValue(u.profile?.phone) && !isValidPhone(u.profile.phone)) unset['profile.phone'] = '';
    if (Object.keys(unset).length === 0) continue;
    const result = await users.updateOne({ _id: u._id }, { $unset: unset });
    if (result.modifiedCount === 1) updated++;
  }

  console.log(`Done. Cleaned ${updated} of ${bad.length} record(s). Affected users can re-enter a valid number.`);
  await mongoose.connection.close();
}

run().catch(async (err) => {
  console.error('Cleanup error:', err);
  try { await mongoose.connection.close(); } catch (_) {}
  process.exit(1);
});
