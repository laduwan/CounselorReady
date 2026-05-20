// backfill-monthly-amount-cents.js
// Populates subscription.monthlyAmountCents on all active/past_due users
// by fetching their most recent paid invoice from Stripe.
//
// Safe to re-run — only updates users with stripeCustomerId.
// Skips users who already have monthlyAmountCents > 0 (use --force to override).
//
// Run: node src/scripts/backfill-monthly-amount-cents.js
// Run: node src/scripts/backfill-monthly-amount-cents.js --force

import mongoose from 'mongoose';
import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET;
const FORCE = process.argv.includes('--force');

if (!MONGODB_URI) { console.error('ERROR: MONGODB_URI not set'); process.exit(1); }
if (!STRIPE_SECRET) { console.error('ERROR: STRIPE_SECRET_KEY not set'); process.exit(1); }

const stripe = new Stripe(STRIPE_SECRET, { apiVersion: '2023-10-16' });

await mongoose.connect(MONGODB_URI);
console.log('✓ Connected to MongoDB');

const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }), 'users');

// Fetch all active/past_due users with a Stripe customer ID
const query = {
  stripeCustomerId: { $exists: true, $ne: null },
  'subscription.status': { $in: ['active', 'past_due'] },
  'subscription.plan': { $ne: 'free' }
};

if (!FORCE) {
  query['$or'] = [
    { 'subscription.monthlyAmountCents': { $exists: false } },
    { 'subscription.monthlyAmountCents': 0 }
  ];
}

const users = await User.find(query).select('email stripeCustomerId subscription.plan subscription.monthlyAmountCents').lean();
console.log(`Found ${users.length} user(s) to backfill${FORCE ? ' (--force mode)' : ''}\n`);

const stats = { updated: 0, skipped: 0, errors: 0, zeroDollar: 0 };

for (const user of users) {
  try {
    // Get most recent paid invoice
    const invoices = await stripe.invoices.list({
      customer: user.stripeCustomerId,
      status: 'paid',
      limit: 1
    });

    if (!invoices.data.length) {
      console.log(`  SKIP  ${user.email} — no paid invoices found`);
      stats.skipped++;
      continue;
    }

    const latestInvoice = invoices.data[0];
    const amountCents = latestInvoice.amount_paid;

    if (amountCents === 0) {
      console.log(`  $0    ${user.email} — last invoice was $0 (discount/free), setting 0`);
      stats.zeroDollar++;
    } else {
      console.log(`  OK    ${user.email} — $${(amountCents / 100).toFixed(2)} (plan: ${user.subscription?.plan})`);
    }

    await User.updateOne(
      { _id: user._id },
      { $set: { 'subscription.monthlyAmountCents': amountCents } }
    );
    stats.updated++;

  } catch (err) {
    console.error(`  ERR   ${user.email} — ${err.message}`);
    stats.errors++;
  }

  // Polite rate limiting — Stripe allows 100 req/s
  await new Promise(r => setTimeout(r, 50));
}

console.log('\n=== Backfill Complete ===');
console.log(`  Updated:    ${stats.updated}`);
console.log(`  $0 subs:    ${stats.zeroDollar} (discount/free users — correct)`);
console.log(`  Skipped:    ${stats.skipped} (no paid invoices)`);
console.log(`  Errors:     ${stats.errors}`);
console.log('\nNet MRR in admin-analytics should now reflect actual charged amounts.');

await mongoose.disconnect();
