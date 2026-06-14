/**
 * createStripePrices.js — one-time setup. Creates the CounselorReady products + prices
 * IN your Stripe account, then prints the exact env-var lines to paste into Render.
 *
 * Uses the SAME STRIPE_SECRET_KEY the app already uses, so it hits the same Stripe account.
 * Idempotent-ish: it looks for an existing product by name before creating, so re-running
 * does not pile up duplicates (it will reuse the product and add a price only if none matches).
 *
 * Run from ~/project/src/server :  node src/scripts/createStripePrices.js
 * Then copy the printed STRIPE_PRICE_* lines into Render → Environment, and the test
 * price_id into subscription.html line 339.
 */
import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.STRIPE_SECRET_KEY) { console.error('STRIPE_SECRET_KEY not set'); process.exit(1); }
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// name, env var the backend reads, amount in CENTS, recurring interval
const PLANS = [
  { key: 'starter',      name: 'CounselorReady Starter',      env: 'STRIPE_PRICE_STARTER',      cents: 1999, interval: 'month' },
  { key: 'professional', name: 'CounselorReady Professional', env: 'STRIPE_PRICE_PROFESSIONAL', cents: 2999, interval: 'month' },
  { key: 'vip',          name: 'CounselorReady VIP',          env: 'STRIPE_PRICE_VIP',          cents: 4999, interval: 'month' },
  { key: 'test1',        name: 'CounselorReady Test $1',      env: 'STRIPE_PRICE_TEST1',        cents: 100,  interval: 'month' },
];

async function findOrCreateProduct(name) {
  // search existing active products by exact name
  const existing = await stripe.products.list({ active: true, limit: 100 });
  const match = existing.data.find(p => p.name === name);
  if (match) return match;
  return stripe.products.create({ name });
}

async function findOrCreatePrice(productId, cents, interval) {
  const prices = await stripe.prices.list({ product: productId, active: true, limit: 100 });
  const match = prices.data.find(p =>
    p.unit_amount === cents &&
    p.currency === 'usd' &&
    p.recurring && p.recurring.interval === interval
  );
  if (match) return match;
  return stripe.prices.create({
    product: productId,
    unit_amount: cents,
    currency: 'usd',
    recurring: { interval },
  });
}

async function main() {
  console.log('\nCreating/verifying CounselorReady products + prices in Stripe...\n');
  const results = [];
  for (const plan of PLANS) {
    const product = await findOrCreateProduct(plan.name);
    const price = await findOrCreatePrice(product.id, plan.cents, plan.interval);
    results.push({ ...plan, productId: product.id, priceId: price.id });
    console.log(`  ✓ ${plan.name.padEnd(34)} $${(plan.cents/100).toFixed(2)}/${plan.interval}  →  ${price.id}`);
  }

  console.log('\n════════ PASTE THESE INTO RENDER → ENVIRONMENT ════════\n');
  results.filter(r => r.key !== 'test1').forEach(r => console.log(`${r.env}=${r.priceId}`));
  console.log('\n════════ AND PUT THIS ONE IN subscription.html LINE 339 ════════');
  const test = results.find(r => r.key === 'test1');
  console.log(`  replace  price_REPLACE_ME  with  ${test.priceId}\n`);
  console.log('(After setting the Render vars, redeploy so the backend picks them up.)\n');
}

main().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
