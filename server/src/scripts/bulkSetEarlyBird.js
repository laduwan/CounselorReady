/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */

/**
 * BULK SET EARLY-BIRD PRICE + DEADLINE on live sessions matching a slug pattern.
 *
 * Mirrors bulkSetPrice.js. Writes only `earlyBirdPrice` and
 * `earlyBirdDeadline` — nothing else on the record is read or written, so this
 * cannot disturb registrants, status, publish state, price, or cohort keys.
 *
 * Checkout resolves early bird first, then applies the 15% paying-member
 * discount on top (see routes/liveSessions.js). So an early-bird price of 98
 * charges $98.00 to a non-member and $83.30 to a paying member, while the
 * window is open. After the deadline both fall back to `price`.
 *
 * The deadline is interpreted as END of that day in America/New_York, not
 * midnight at its start — "through August 15" should include August 15.
 *
 * DRY RUN BY DEFAULT. Set APPLY=1 to write.
 *
 * Usage:
 *   node src/scripts/bulkSetEarlyBird.js <slug-pattern> <price> <YYYY-MM-DD>
 *   APPLY=1 node src/scripts/bulkSetEarlyBird.js <slug-pattern> <price> <YYYY-MM-DD>
 *
 * Example:
 *   node src/scripts/bulkSetEarlyBird.js ethics-table 98 2026-08-15
 *
 * To CLEAR an early bird, pass price 0 — the fields are unset rather than
 * written as zero, so checkout falls straight through to `price`.
 */
import mongoose from 'mongoose';

const APPLY = process.env.APPLY === '1';
const [patternArg, priceArg, dateArg] = process.argv.slice(2);

if (!patternArg || priceArg === undefined) {
  console.error('Usage: node src/scripts/bulkSetEarlyBird.js <slug-pattern> <price> <YYYY-MM-DD>');
  process.exit(1);
}

const price = Number(priceArg);
if (!Number.isFinite(price) || price < 0) {
  console.error('Price must be a number >= 0. Got: ' + priceArg);
  process.exit(1);
}

const CLEARING = price === 0;
let deadline = null;

if (!CLEARING) {
  if (!dateArg || !/^\d{4}-\d{2}-\d{2}$/.test(dateArg)) {
    console.error('Deadline required as YYYY-MM-DD when price > 0. Got: ' + dateArg);
    process.exit(1);
  }
  // 23:59:59 Eastern. EDT is UTC-4 in August; using 03:59:59Z the NEXT day.
  // Deliberately explicit rather than relying on server timezone.
  const next = new Date(dateArg + 'T00:00:00Z');
  next.setUTCDate(next.getUTCDate() + 1);
  deadline = new Date(next.toISOString().slice(0, 10) + 'T03:59:59Z');

  if (deadline.getTime() < Date.now()) {
    console.error('That deadline is already in the past: ' + deadline.toISOString());
    console.error('An expired early bird has no effect — checkout would use `price`.');
    process.exit(1);
  }
}

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  const all = await db.collection('livesessions')
    .find({}).sort({ scheduledStart: 1 }).toArray();
  const matched = all.filter(s => s.slug && s.slug.includes(patternArg));

  console.log('='.repeat(90));
  console.log('BULK SET EARLY BIRD');
  console.log('Pattern: "' + patternArg + '"');
  if (CLEARING) {
    console.log('Action: CLEAR early-bird pricing');
  } else {
    console.log('Early-bird price: ' + price + '   Deadline: ' + deadline.toISOString() +
      '   (11:59 PM ET ' + dateArg + ')');
    console.log('Member rate while open: ' + (Math.round(price * 0.85 * 100) / 100).toFixed(2));
  }
  console.log('Matched: ' + matched.length + ' of ' + all.length +
    (APPLY ? '   MODE: APPLY' : '   MODE: DRY RUN'));
  console.log('='.repeat(90) + '\n');

  if (matched.length === 0) {
    console.log('Nothing matched that pattern. Check the slug spelling.');
    return mongoose.disconnect();
  }

  matched.forEach(s => {
    const cur = s.earlyBirdPrice != null
      ? s.earlyBirdPrice + ' until ' + s.earlyBirdDeadline
      : '(none)';
    console.log('   ' + s.slug.padEnd(36) + '  price=' + s.price);
    console.log('      current early bird: ' + cur);
    // A session starting before the deadline would sell at the early-bird
    // rate right up to its own start — worth seeing before writing.
    if (!CLEARING && s.scheduledStart && new Date(s.scheduledStart) < deadline) {
      console.log('      NOTE: starts ' + s.scheduledStart +
        ' — BEFORE the deadline, so it is early-bird priced for its whole sale window.');
    }
  });

  if (!APPLY) {
    console.log('\nDRY RUN — nothing written. Re-run with APPLY=1 to execute.');
    return mongoose.disconnect();
  }

  for (const s of matched) {
    const update = CLEARING
      ? { $unset: { earlyBirdPrice: '', earlyBirdDeadline: '' } }
      : { $set: { earlyBirdPrice: price, earlyBirdDeadline: deadline } };
    await db.collection('livesessions').updateOne({ _id: s._id }, update);
    console.log((CLEARING ? 'Cleared ' : 'Set ') + s.slug);
  }

  console.log('\nDone. ' + matched.length + ' session(s) updated.');
  await mongoose.disconnect();
}

main().catch(err => { console.error('Script error:', err.message); process.exit(1); });
