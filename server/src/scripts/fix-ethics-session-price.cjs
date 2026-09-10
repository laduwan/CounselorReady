/**
 * fix-ethics-session-price.cjs
 *
 * Finds all Ethics Table Talk LiveSession documents sorted by scheduledStart,
 * prints them for review, then — with --apply — sets price=0 on every session
 * after the first (session 1 stays at its original price, all others become free).
 *
 * Usage (Render shell, from ~/project/src/server):
 *   DRY RUN:  node src/scripts/fix-ethics-session-price.cjs
 *   APPLY:    node src/scripts/fix-ethics-session-price.cjs --apply
 */

const mongoose = require('mongoose');

const APPLY = process.argv.includes('--apply');
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

async function main() {
  if (!MONGO_URI) throw new Error('MONGODB_URI not set');
  await mongoose.connect(MONGO_URI);
  console.log('Connected.\n');

  const col = mongoose.connection.db.collection('livesessions');

  // Find all Ethics Table Talk sessions, sorted by scheduled start
  const sessions = await col
    .find({ title: /ethics.*table.*talk/i })
    .sort({ scheduledStart: 1 })
    .toArray();

  if (sessions.length === 0) {
    console.log('No Ethics Table Talk sessions found. Check the title pattern.');
    await mongoose.disconnect();
    return;
  }

  console.log(`Found ${sessions.length} session(s):\n`);
  sessions.forEach((s, i) => {
    const date = s.scheduledStart
      ? new Date(s.scheduledStart).toLocaleString('en-US', { timeZone: 'America/New_York' }) + ' ET'
      : 'no date';
    console.log(`  [${i}] ${s.title}`);
    console.log(`      id: ${s._id}`);
    console.log(`      date: ${date}`);
    console.log(`      price: $${s.price ?? 0}`);
    console.log(`      registrants: ${s.registrants?.length ?? 0}`);
    console.log();
  });

  // Session 0 (earliest) keeps its price. All others → $0.
  const toZero = sessions.slice(1);

  if (toZero.length === 0) {
    console.log('Only one session found — nothing to update.');
    await mongoose.disconnect();
    return;
  }

  console.log(`Session [0] "${sessions[0].title}" — price UNCHANGED ($${sessions[0].price ?? 0})`);
  toZero.forEach((s, i) => {
    console.log(`Session [${i + 1}] "${s.title}" — price will be set to $0 (was $${s.price ?? 0})`);
  });

  if (!APPLY) {
    console.log('\nDRY RUN — no changes made. Re-run with --apply to write.');
    await mongoose.disconnect();
    return;
  }

  const ids = toZero.map(s => s._id);
  const result = await col.updateMany(
    { _id: { $in: ids } },
    { $set: { price: 0 } }
  );

  console.log(`\nAPPLIED: ${result.modifiedCount} session(s) set to $0.`);

  // Read back to verify
  const updated = await col
    .find({ _id: { $in: ids } })
    .project({ title: 1, price: 1 })
    .toArray();
  updated.forEach(s => console.log(`  ✓ "${s.title}" price=${s.price}`));

  await mongoose.disconnect();
  console.log('\nDone.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
