/**
 * verifyStripeSignature.js
 *
 * Verify a Stripe webhook signature against ONE OR MORE signing secrets.
 *
 * Why this exists:
 *   Several Stripe "event destinations" point at the same CounselorReady webhook
 *   URL (api.counselorready.com/api/payments/webhook) — the account's own sales
 *   ("Your account") and connected-account/marketplace events ("Connected
 *   accounts"). Each destination signs with its OWN whsec_ secret, but Stripe's
 *   constructEvent only checks one secret at a time. With a single configured
 *   secret, events from every OTHER destination fail signature verification (400)
 *   even though the payload is genuine.
 *
 *   This lets STRIPE_WEBHOOK_SECRET hold a comma-separated list of secrets. We try
 *   each in turn and accept the event as soon as one verifies. Any real Stripe
 *   payload will match exactly one of the destination secrets; a forged payload
 *   matches none and still throws, so security is unchanged.
 *
 * Backwards compatible:
 *   A single secret (no comma) behaves EXACTLY like stripe.webhooks.constructEvent.
 *
 * Usage (routes/payments.js):
 *   import { constructStripeEvent } from '../utils/verifyStripeSignature.js';
 *   ...
 *   event = constructStripeEvent(stripe, req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
 *
 * Config:
 *   STRIPE_WEBHOOK_SECRET=whsec_aaa                 # one destination (unchanged behavior)
 *   STRIPE_WEBHOOK_SECRET=whsec_aaa,whsec_bbb       # your-account + connected-account
 *   (surrounding whitespace and empty entries are ignored)
 */

/**
 * @param {import('stripe').Stripe} stripe  An initialized Stripe client.
 * @param {Buffer|string} payload           The RAW request body (from express.raw()).
 * @param {string} signature                The 'stripe-signature' header.
 * @param {string} secretConfig             One secret, or a comma-separated list.
 * @returns {import('stripe').Stripe.Event} The verified event.
 * @throws  The verification error from the last secret tried (so the 400 message
 *          stays meaningful), or a clear error if no secret is configured.
 */
export function constructStripeEvent(stripe, payload, signature, secretConfig) {
  const secrets = String(secretConfig || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (secrets.length === 0) {
    throw new Error('No Stripe webhook secret configured (STRIPE_WEBHOOK_SECRET is empty).');
  }

  let lastErr;
  for (const secret of secrets) {
    try {
      // Throws if this secret doesn't match; returns the event if it does.
      return stripe.webhooks.constructEvent(payload, signature, secret);
    } catch (err) {
      lastErr = err;
    }
  }

  // None of the configured secrets verified this payload.
  throw lastErr;
}

export default constructStripeEvent;
