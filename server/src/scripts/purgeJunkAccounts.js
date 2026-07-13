/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * purgeJunkAccounts.js — Delete bot/junk registrations that have never been used.
 *
 * Matches accounts where ALL of the following are true:
 *   - emailVerified: false
 *   - lastLoginAt: null/undefined (never logged in)
 *   - createdAt older than --days N (default 7)
 *   - role: 'user' (never admins)
 *   - purchasedCourses: empty array
 *   - stripeCustomerId: absent/empty (no Stripe customer)
 *   - subscription.plan: 'free'
 *   - NO records in any known progress collection (usercourseprogresses,
 *     interactivecourseprogresses, articleprogresses)
 *
 * ⚠️  Course/article progress is tracked across multiple collections, one per
 *     content type. All are checked. Do NOT remove any from the list.
 *
 * Usage:
 *   node src/scripts/purgeJunkAccounts.js               # dry run (default)
 *   node src/scripts/purgeJunkAccounts.js --days 14     # change age threshold
 *   node src/scripts/purgeJunkAccounts.js --execute     # actually delete
 *   node src/scripts/purgeJunkAccounts.js --days 0 --execute  # sweep all, incl. today
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('❌ MONGODB_URI not set'); process.exit(1); }

const HARD_CAP = 200;

// Collections backed by an actual Mongoose model (verified against
// server/src/models/) that track course/article progress.
const PROGRESS_COLLECTIONS = [
  'usercourseprogresses',        // UserCourseProgress model
  'interactivecourseprogresses', // InteractiveCourseProgress model (InteractiveCourse.js)
  'articleprogresses',           // ArticleProgress model (ScholarlyArticle.js)
];

const args = process.argv.slice(2);
const execute = args.includes('--execute');
const daysIdx = args.indexOf('--days');
const days = daysIdx !== -1 ? parseInt(args[daysIdx + 1], 10) : 7;
if (isNaN(days) || days < 0) {
  console.error('❌ --days must be a non-negative integer');
  process.exit(1);
}

async function run() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;
  const users = db.collection('users');

  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const safeQuery = {
    $and: [
      { emailVerified: false },
      { $or: [{ lastLoginAt: null }, { lastLoginAt: { $exists: false } }] },
      { createdAt: { $lt: cutoff } },
      { role: 'user' },
      { $or: [{ purchasedCourses: { $exists: false } }, { purchasedCourses: { $size: 0 } }] },
      { $or: [{ stripeCustomerId: null }, { stripeCustomerId: { $exists: false } }, { stripeCustomerId: '' }] },
      { 'subscription.plan': 'free' },
    ],
  };

  const candidates = await users
    .find(safeQuery, {
      projection: { email: 1, 'profile.firstName': 1, 'profile.lastName': 1, createdAt: 1 },
    })
    .sort({ createdAt: -1 })
    .toArray();

  // Cross-check ALL progress collections — a user with records in any of them is kept.
  const candidateIds = candidates.map(u => u._id);
  const hasActivitySet = new Set();

  if (candidateIds.length > 0) {
    for (const colName of PROGRESS_COLLECTIONS) {
      const ids = await db.collection(colName).distinct('userId', { userId: { $in: candidateIds } });
      ids.forEach(id => hasActivitySet.add(id.toString()));
    }
  }

  const matches = candidates.filter(u => !hasActivitySet.has(u._id.toString()));
  const excluded = candidates.length - matches.length;

  console.log(`\n${'─'.repeat(60)}`);
  console.log(`  purgeJunkAccounts — ${execute ? '⚠️  EXECUTE MODE' : 'DRY RUN (pass --execute to delete)'}`);
  console.log(`  Age threshold : ${days} day(s) (older than ${cutoff.toISOString()})`);
  console.log(`  Candidates    : ${candidates.length} account(s)`);
  console.log(`  Excluded      : ${excluded} (have course/article progress — kept)`);
  console.log(`  To delete     : ${matches.length} account(s)`);
  console.log(`${'─'.repeat(60)}\n`);

  if (matches.length === 0) {
    console.log('✅ Nothing to purge.');
    await mongoose.disconnect();
    return;
  }

  matches.forEach((u, i) => {
    const name = `${u.profile?.firstName || ''} ${u.profile?.lastName || ''}`.trim() || '(no name)';
    console.log(`  ${String(i + 1).padStart(3)}. ${name.padEnd(30)} ${u.email}  (joined ${u.createdAt?.toISOString().slice(0, 10)})`);
  });

  console.log('');

  if (matches.length > HARD_CAP) {
    console.error(`\n❌ ABORTED — matched ${matches.length} accounts, exceeds hard cap of ${HARD_CAP}.`);
    console.error('   Review the criteria and run again.');
    await mongoose.disconnect();
    process.exit(1);
  }

  if (!execute) {
    console.log(`ℹ️  Dry run complete — ${matches.length} account(s) would be deleted.`);
    console.log('   Review the list above, then re-run with --execute to delete.\n');
    await mongoose.disconnect();
    return;
  }

  const ids = matches.map(u => u._id);
  const result = await users.deleteMany({ _id: { $in: ids } });
  console.log(`✅ Deleted ${result.deletedCount} account(s).\n`);

  await mongoose.disconnect();
}

run().catch(err => {
  console.error('❌ Script error:', err);
  mongoose.disconnect();
  process.exit(1);
});
