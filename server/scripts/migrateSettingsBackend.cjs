/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 *
 * migrateSettingsBackend.cjs
 *
 * Idempotent migration for the expanded Settings page.
 *
 * Operations (all guarded with $exists: false where applicable):
 *   1. Normalize legacy "prelicensed" license numbers to canonical 'PRELICENSED'
 *      and set isPrelicensed = true on those credentials.
 *   2. Backfill isPrelicensed = false on any credential missing the field
 *      (excluding the canonical PRELICENSED rows already set in step 1).
 *   3. Initialize new profile defaults (pronouns, npi, specializations) on
 *      users that don't yet have them.
 *   4. Initialize new top-level user defaults (recoveryEmail, twoFactorEnabled,
 *      twoFactorBackupCodes) on users that don't yet have them.
 *
 * This script does NOT touch hardshipPause, notifications, referralCode, or
 * careCredits — those are owned by other systems.
 *
 * Usage:
 *   node server/scripts/migrateSettingsBackend.cjs
 *
 * Requires MONGODB_URI in env.
 */

const mongoose = require('mongoose');

async function run() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    console.error('ERROR: MONGODB_URI (or MONGO_URI) must be set in env.');
    process.exit(1);
  }

  console.log('[migrateSettingsBackend] connecting to MongoDB...');
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  console.log('[migrateSettingsBackend] connected.');

  const results = {};

  // ── 1. Canonicalize "prelicensed" license numbers ─────────────────────────
  {
    const r = await db.collection('usercredentials').updateMany(
      { licenseNumber: /^prelicensed$/i },
      { $set: { licenseNumber: 'PRELICENSED', isPrelicensed: true } }
    );
    results.prelicensedCanonical = { matched: r.matchedCount, modified: r.modifiedCount };
    console.log('[1] prelicensed canonicalized:', results.prelicensedCanonical);
  }

  // ── 2. Backfill isPrelicensed=false on remaining credentials ──────────────
  {
    const r = await db.collection('usercredentials').updateMany(
      { isPrelicensed: { $exists: false }, licenseNumber: { $ne: 'PRELICENSED' } },
      { $set: { isPrelicensed: false } }
    );
    results.isPrelicensedBackfill = { matched: r.matchedCount, modified: r.modifiedCount };
    console.log('[2] isPrelicensed=false backfilled:', results.isPrelicensedBackfill);
  }

  // ── 3. Initialize new profile defaults ────────────────────────────────────
  {
    const pronouns = await db.collection('users').updateMany(
      { 'profile.pronouns': { $exists: false } },
      { $set: { 'profile.pronouns': '' } }
    );
    const npi = await db.collection('users').updateMany(
      { 'profile.npi': { $exists: false } },
      { $set: { 'profile.npi': '' } }
    );
    const specializations = await db.collection('users').updateMany(
      { 'profile.specializations': { $exists: false } },
      { $set: { 'profile.specializations': [] } }
    );
    results.profileDefaults = {
      pronouns:        { matched: pronouns.matchedCount, modified: pronouns.modifiedCount },
      npi:             { matched: npi.matchedCount, modified: npi.modifiedCount },
      specializations: { matched: specializations.matchedCount, modified: specializations.modifiedCount }
    };
    console.log('[3] profile defaults initialized:', results.profileDefaults);
  }

  // ── 4. Initialize new top-level user defaults ─────────────────────────────
  {
    const recoveryEmail = await db.collection('users').updateMany(
      { recoveryEmail: { $exists: false } },
      { $set: { recoveryEmail: '' } }
    );
    const twoFactorEnabled = await db.collection('users').updateMany(
      { twoFactorEnabled: { $exists: false } },
      { $set: { twoFactorEnabled: false } }
    );
    const twoFactorBackupCodes = await db.collection('users').updateMany(
      { twoFactorBackupCodes: { $exists: false } },
      { $set: { twoFactorBackupCodes: [] } }
    );
    results.topLevelDefaults = {
      recoveryEmail:        { matched: recoveryEmail.matchedCount, modified: recoveryEmail.modifiedCount },
      twoFactorEnabled:     { matched: twoFactorEnabled.matchedCount, modified: twoFactorEnabled.modifiedCount },
      twoFactorBackupCodes: { matched: twoFactorBackupCodes.matchedCount, modified: twoFactorBackupCodes.modifiedCount }
    };
    console.log('[4] top-level defaults initialized:', results.topLevelDefaults);
  }

  console.log('[migrateSettingsBackend] DONE.');
  console.log(JSON.stringify(results, null, 2));

  await mongoose.disconnect();
}

run().catch(err => {
  console.error('[migrateSettingsBackend] FAILED:', err);
  process.exit(1);
});
