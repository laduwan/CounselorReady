// repairStripeLinkage.js
// One-off idempotent script: reads real Stripe customer/subscription data
// and writes it to the nested subscription.stripeCustomerId / stripeSubscriptionId
// fields for users who have subscription.status set but no stripeCustomerId linked.
//
// APPLY gate — must pass --apply to write anything; default is dry-run.
//
// Usage:
//   node src/scripts/repairStripeLinkage.js
//   node src/scripts/repairStripeLinkage.js --apply
//   node src/scripts/repairStripeLinkage.js --apply --emails="a@x.com,b@x.com,c@x.com"
//
// If --emails is given, only those users are targeted.
// If omitted, all users whose subscription.status is set but subscription.stripeCustomerId
// is missing are candidates (matched by email against Stripe customers list).

import mongoose from 'mongoose';
import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET;
const APPLY = process.argv.includes('--apply');
const emailsArg = process.argv.find(a => a.startsWith('--emails='));
const TARGET_EMAILS = emailsArg
  ? emailsArg.replace('--emails=', '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean)
  : [];

if (!MONGODB_URI) { console.error('ERROR: MONGODB_URI not set'); process.exit(1); }
if (!STRIPE_SECRET) { console.error('ERROR: STRIPE_SECRET_KEY not set'); process.exit(1); }

const stripe = new Stripe(STRIPE_SECRET, { apiVersion: '2023-10-16' });

await mongoose.connect(MONGODB_URI);
console.log('✓ Connected to MongoDB');

// Use schemaless model so we can read/write any field without import issues
const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }), 'users');

// Build candidate query
const baseQuery = {
  $or: [
    { 'subscription.stripeCustomerId': { $exists: false } },
    { 'subscription.stripeCustomerId': null },
    { 'subscription.stripeCustomerId': '' }
  ],
  'subscription.status': { $exists: true, $ne: null }
};

if (TARGET_EMAILS.length > 0) {
  baseQuery.email = { $in: TARGET_EMAILS };
} else {
  // Only target users who appear to have subscribed (not free/null status)
  baseQuery['subscription.status'] = { $in: ['active', 'past_due', 'canceled'] };
}

const candidates = await User.find(baseQuery)
  .select('email subscription.stripeCustomerId subscription.stripeSubscriptionId subscription.status subscription.plan subscription.monthlyAmountCents')
  .lean();

console.log(`\nCandidates (missing stripeCustomerId): ${candidates.length}`);
if (!APPLY) console.log('DRY RUN — pass --apply to write changes\n');
console.log('');

const stats = { updated: 0, skipped: 0, notInStripe: 0, errors: 0 };

for (const user of candidates) {
  try {
    // Search Stripe for customer by email
    const stripeCustomers = await stripe.customers.list({ email: user.email, limit: 5 });

    if (!stripeCustomers.data.length) {
      console.log(`  NOT_FOUND  ${user.email} — no Stripe customer with this email`);
      stats.notInStripe++;
      continue;
    }

    // Pick the most recent customer if multiple
    const stripeCustomer = stripeCustomers.data[0];
    const customerId = stripeCustomer.id;

    // Find active/latest subscription for this customer
    let subscriptionId = null;
    let amountCents = user.subscription?.monthlyAmountCents || 0;

    const stripeSubs = await stripe.subscriptions.list({
      customer: customerId,
      limit: 5,
      status: 'all'
    });

    if (stripeSubs.data.length > 0) {
      // Prefer active, then past_due, then canceled
      const preferred = stripeSubs.data.find(s => s.status === 'active')
        || stripeSubs.data.find(s => s.status === 'past_due')
        || stripeSubs.data[0];
      subscriptionId = preferred.id;

      // Get amount from latest invoice if not already set
      if (!amountCents) {
        try {
          const invoices = await stripe.invoices.list({ customer: customerId, status: 'paid', limit: 1 });
          if (invoices.data.length) amountCents = invoices.data[0].amount_paid || 0;
        } catch (_) {}
      }
    }

    const before = {
      stripeCustomerId: user.subscription?.stripeCustomerId || null,
      stripeSubscriptionId: user.subscription?.stripeSubscriptionId || null,
      monthlyAmountCents: user.subscription?.monthlyAmountCents || 0
    };

    const after = {
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      monthlyAmountCents: amountCents
    };

    console.log(`  ${APPLY ? 'APPLY' : 'WOULD'}  ${user.email}`);
    console.log(`    stripeCustomerId:      ${before.stripeCustomerId || '(null)'} → ${after.stripeCustomerId}`);
    console.log(`    stripeSubscriptionId:  ${before.stripeSubscriptionId || '(null)'} → ${after.stripeSubscriptionId || '(none found)'}`);
    console.log(`    monthlyAmountCents:    ${before.monthlyAmountCents} → ${after.monthlyAmountCents}`);

    if (APPLY) {
      const update = { 'subscription.stripeCustomerId': customerId };
      if (subscriptionId) update['subscription.stripeSubscriptionId'] = subscriptionId;
      if (amountCents && !user.subscription?.monthlyAmountCents) {
        update['subscription.monthlyAmountCents'] = amountCents;
      }

      await User.updateOne({ _id: user._id }, { $set: update });
      console.log(`    ✓ written`);
    }

    stats.updated++;
  } catch (err) {
    console.error(`  ERR  ${user.email} — ${err.message}`);
    stats.errors++;
  }

  // Polite Stripe rate limiting
  await new Promise(r => setTimeout(r, 100));
}

console.log('\n=== Repair Complete ===');
console.log(`  Candidates:   ${candidates.length}`);
console.log(`  ${APPLY ? 'Updated' : 'Would update'}:    ${stats.updated}`);
console.log(`  Not in Stripe: ${stats.notInStripe} (manual/comp grants — untouched)`);
console.log(`  Errors:       ${stats.errors}`);
if (!APPLY) console.log('\nRe-run with --apply to write these changes.');

await mongoose.disconnect();
