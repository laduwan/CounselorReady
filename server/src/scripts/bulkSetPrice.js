/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */

/**
 * BULK SET PRICE on live sessions matching a slug pattern.
 *
 * Setting a dozen prices one modal at a time is slow and error-prone — and the
 * admin table currently clips its action buttons, which makes it worse. This
 * writes `price` to every session whose slug CONTAINS the given pattern.
 *
 * Only `price` is touched. Nothing else on the record is read or written, so
 * this cannot disturb registrants, status, publish state, or cohort keys.
 *
 * DRY RUN BY DEFAULT — prints exactly which sessions would change, with their
 * current and new price. Set APPLY=1 to write.
 *
 * Usage:
 *   node src/scripts/bulkSetPrice.js <slug-pattern> <price>
 *   APPLY=1 node src/scripts/bulkSetPrice.js <slug-pattern> <price>
 *
 * Examples:
 *   node src/scripts/bulkSetPrice.js wk4-6pm 115      # both halves of one cohort
 *   node src/scripts/bulkSetPrice.js -6pm 115         # every evening session
 *   node src/scripts/bulkSetPrice.js ethics-table 115 # everything Table Talk
 *
 * Pattern is a plain substring match, not a regex — no escaping needed.
 */
import mongoose from 'mongoose';

const APPLY = process.env.APPLY === '1';
const [patternArg, priceArg] = process.argv.slice(2);

if (!patternArg || priceArg === undefined) {
  console.error('Usage: node src/scripts/bulkSetPrice.js <slug-pattern> <price>');
  process.exit(1);
}

const price = Number(priceArg);
if (!Number.isFinite(price) || price < 0) {
  console.error('Price must be a number >= 0. Got: ' + priceArg);
  process.exit(1);
}

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  const all = await db.collection('livesessions')
    .find({}).sort({ scheduledStart: 1 }).toArray();

  const matched = all.filter(s => s.slug && s.slug.includes(patternArg));

  console.log('='.repeat(90));
  console.log('BULK SET PRICE');
  console.log('Pattern: "' + patternArg + '"   New price: ' + price);
  console.log('Matched: ' + matched.length + ' of ' + all.length +
    (APPLY ? '   MODE: APPLY' : '   MODE: DRY RUN'));
  console.log('='.repeat(90) + '\n');

  if (matched.length === 0) {
    console.log('Nothing matched that pattern. Check the slug spelling.');
    return mongoose.disconnect();
  }

  const changing = matched.filter(s => s.price !== price);

  matched.forEach(s => {
    const mark = s.price === price ? '  (already)' : '  ' + s.price + ' -> ' + price;
    console.log('   ' + s.slug.padEnd(36) + mark);
    console.log('      ' + s.scheduledStart + '   status=' + s.status +
      '   published=' + s.isPublished +
      '   seats=' + ((s.registrants || []).length));
  });

  console.log('\n' + '-'.repeat(90));
  console.log('WOULD CHANGE: ' + changing.length + '   (unchanged: ' +
    (matched.length - changing.length) + ')');

  // Sessions that already have people in them are worth a second look — the
  // price they registered under is not retroactively adjusted by this.
  const withSeats = changing.filter(s => (s.registrants || []).length > 0);
  if (withSeats.length) {
    console.log('\nNOTE — these already have registrants. Changing the price does');
    console.log('NOT alter what anyone already paid, and issues no refunds:');
    withSeats.forEach(s => console.log('   ' + s.slug +
      '  (' + s.registrants.length + ' seated)'));
  }

  if (!APPLY) {
    console.log('\nDRY RUN — nothing written. Re-run with APPLY=1 to execute.');
    return mongoose.disconnect();
  }

  for (const s of changing) {
    await db.collection('livesessions').updateOne(
      { _id: s._id },
      { $set: { price } }
    );
    console.log('Set ' + s.slug + ' -> ' + price);
  }

  console.log('\nDone. ' + changing.length + ' session(s) updated.');
  await mongoose.disconnect();
}

main().catch(err => { console.error('Script error:', err.message); process.exit(1); });
