/**
 * fixMigratedUserFields.js
 * ─────────────────────────
 * Patches TalentLMS-migrated user documents that were inserted via raw
 * `insertOne()` with incorrect field names:
 *
 *   BUG 1: `password` (root) → should be `passwordHash`
 *   BUG 2: `firstName`/`lastName` (root) → should be `profile.firstName`/`profile.lastName`
 *
 * Because the originals are already bcrypt-hashed temp passwords that were never
 * communicated to users, we do NOT copy them to `passwordHash`. Instead we:
 *   • Move firstName/lastName → profile.firstName/profile.lastName
 *   • Remove stale root-level `password`, `firstName`, `lastName`
 *   • Remove `migration.tempPassword` (security cleanup)
 *
 * After running, migrated users can use Forgot Password → reset link → set their
 * own password. The reset handler will correctly populate `passwordHash` via Mongoose
 * pre-save hook.
 *
 * Usage (from Render shell, inside server/):
 *   node src/scripts/fixMigratedUserFields.js          # dry-run
 *   APPLY=1 node src/scripts/fixMigratedUserFields.js  # write to DB
 *
 * Requires: MONGODB_URI environment variable
 */

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌  MONGODB_URI not set');
  process.exit(1);
}

const DRY_RUN = process.env.APPLY !== '1';

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('✅  Connected to MongoDB');
  console.log(DRY_RUN ? '🔍  DRY RUN — no writes\n' : '🔥  APPLY MODE — writing to DB\n');

  const db = mongoose.connection.db;
  const usersCol = db.collection('users');

  // Find all TalentLMS-migrated users
  const migrated = await usersCol.find({ 'migration.source': 'talentlms' }).toArray();
  console.log(`Found ${migrated.length} TalentLMS-migrated user(s)\n`);

  if (migrated.length === 0) {
    console.log('Nothing to fix.');
    await mongoose.disconnect();
    return;
  }

  let fixed = 0;
  let alreadyOk = 0;
  let errors = 0;

  for (const user of migrated) {
    const email = user.email;
    const issues = [];

    // ── Detect issues ──
    const hasRootFirstName = !!user.firstName;
    const hasRootLastName = !!user.lastName;
    const hasRootPassword = !!user.password;
    const hasTempPassword = !!user.migration?.tempPassword;
    const missingProfileFirstName = !user.profile?.firstName;

    if (hasRootFirstName && missingProfileFirstName) issues.push('firstName at root, missing in profile');
    if (hasRootLastName && !user.profile?.lastName) issues.push('lastName at root, missing in profile');
    if (hasRootPassword) issues.push('password field at root (not passwordHash)');
    if (hasTempPassword) issues.push('migration.tempPassword still stored');

    // Also check: passwordHash missing entirely
    const missingPasswordHash = !user.passwordHash;
    if (missingPasswordHash) issues.push('passwordHash missing (needs password reset)');

    if (issues.length === 0) {
      alreadyOk++;
      console.log(`  ✓ ${email} — already correct`);
      continue;
    }

    console.log(`  ✏️  ${email}`);
    issues.forEach(i => console.log(`      → ${i}`));

    if (!DRY_RUN) {
      try {
        const $set = {};
        const $unset = {};

        // Move firstName → profile.firstName (only if profile.firstName is missing)
        if (hasRootFirstName && missingProfileFirstName) {
          $set['profile.firstName'] = user.firstName;
        }
        // Move lastName → profile.lastName (only if profile.lastName is missing)
        if (hasRootLastName && !user.profile?.lastName) {
          $set['profile.lastName'] = user.lastName;
        }

        // Clean up stale root fields
        if (hasRootFirstName) $unset['firstName'] = '';
        if (hasRootLastName) $unset['lastName'] = '';
        if (hasRootPassword) $unset['password'] = '';
        if (hasTempPassword) $unset['migration.tempPassword'] = '';

        const update = {};
        if (Object.keys($set).length) update.$set = $set;
        if (Object.keys($unset).length) update.$unset = $unset;

        if (Object.keys(update).length) {
          await usersCol.updateOne({ _id: user._id }, update);
          console.log(`      ✅ patched`);
          fixed++;
        }
      } catch (err) {
        console.error(`      ❌ error: ${err.message}`);
        errors++;
      }
    } else {
      fixed++;
    }
  }

  console.log(`\n── Summary ──`);
  console.log(`  Total migrated users: ${migrated.length}`);
  console.log(`  Already correct:      ${alreadyOk}`);
  console.log(`  ${DRY_RUN ? 'Would fix' : 'Fixed'}:          ${fixed}`);
  if (errors) console.log(`  Errors:               ${errors}`);

  if (DRY_RUN && fixed > 0) {
    console.log(`\n⚡ Run with APPLY=1 to write changes.`);
  }

  if (!DRY_RUN && fixed > 0) {
    console.log(`\n📧 Next step: These users still have NO passwordHash.`);
    console.log(`   They must use Forgot Password → reset link to set their password.`);
    console.log(`   Consider sending a welcome/onboarding email with the reset link.`);
  }

  await mongoose.disconnect();
}

run().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
