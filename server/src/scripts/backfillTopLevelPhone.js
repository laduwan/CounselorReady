// server/src/scripts/backfillTopLevelPhone.js
//
// One-time backfill: copy profile.phone -> top-level user.phone where the
// top-level phone is missing/empty.
//
// WHY: the Settings page historically saved the phone number only to
// profile.phone, but every SMS/Twilio path (smsService.js, calendarSmsService.js,
// notification cron triggers) reads the TOP-LEVEL user.phone. As of the
// "Sync user phone" fix, new saves write both fields — this repairs records
// saved before that fix.
//
// SAFE: only writes where top-level phone is empty AND profile.phone has a value.
// It never overwrites an existing top-level phone. Idempotent — safe to re-run.
// Defaults to DRY-RUN; pass --commit to actually write.
//
// Usage (from ~/project/src/server in the Render shell):
//   node src/scripts/backfillTopLevelPhone.js              # dry-run, shows count + samples
//   node src/scripts/backfillTopLevelPhone.js --commit     # performs the update
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

// A value counts as "missing" if it's absent, null, empty, or whitespace-only.
const isBlank = (v) => v === undefined || v === null || String(v).trim() === '';

async function run() {
  await mongoose.connect(MONGODB_URI);
  const users = mongoose.connection.collection('users');

  // Candidates: profile.phone has a real value AND top-level phone is blank/absent.
  const candidates = await users.find({
    'profile.phone': { $exists: true, $nin: [null, ''] },
    $or: [
      { phone: { $exists: false } },
      { phone: null },
      { phone: '' },
    ],
  }).project({ email: 1, phone: 1, 'profile.phone': 1 }).toArray();

  // Guard against whitespace-only profile.phone slipping through the query.
  const toFix = candidates.filter((u) => !isBlank(u.profile?.phone) && isBlank(u.phone));

  console.log(`\n=== Top-level phone backfill ${COMMIT ? '(COMMIT)' : '(DRY-RUN)'} ===`);
  console.log(`Matched ${toFix.length} record(s) with profile.phone set but top-level phone empty.\n`);

  if (toFix.length === 0) {
    console.log('Nothing to backfill. Exiting.');
    await mongoose.connection.close();
    return;
  }

  // Show up to 10 samples (email + the number that would be copied) for review.
  const sample = toFix.slice(0, 10);
  for (const u of sample) {
    console.log(`  ${u.email || u._id}  ->  phone = "${String(u.profile.phone).trim()}"`);
  }
  if (toFix.length > sample.length) {
    console.log(`  ... and ${toFix.length - sample.length} more`);
  }
  console.log('');

  if (!COMMIT) {
    console.log('DRY-RUN only — no changes written. Re-run with --commit to apply.');
    await mongoose.connection.close();
    return;
  }

  let updated = 0;
  for (const u of toFix) {
    const value = String(u.profile.phone).trim();
    const result = await users.updateOne(
      { _id: u._id, $or: [{ phone: { $exists: false } }, { phone: null }, { phone: '' }] },
      { $set: { phone: value } }
    );
    if (result.modifiedCount === 1) updated++;
  }

  console.log(`Done. Updated ${updated} of ${toFix.length} record(s).`);
  await mongoose.connection.close();
}

run().catch(async (err) => {
  console.error('Backfill error:', err);
  try { await mongoose.connection.close(); } catch (_) {}
  process.exit(1);
});
