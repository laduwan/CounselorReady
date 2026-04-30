/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import User from '../models/User.js';

/**
 * Auto-resume hardship pauses whose pauseEndDate has passed.
 * Scheduled via node-cron at 8 AM ET daily.
 */
export async function runHardshipPauseResume() {
  console.log('[HardshipResume] Starting hardship pause auto-resume check...');
  const stats = { checked: 0, resumed: 0, stripeFailures: 0, errors: 0 };

  try {
    const now = new Date();
    const expiredPauses = await User.find({
      'hardshipPause.isActive': true,
      'hardshipPause.pauseEndDate': { $lte: now },
    }).select('_id email hardshipPause subscription profile');

    stats.checked = expiredPauses.length;
    console.log(`[HardshipResume] Found ${stats.checked} expired pauses to resume`);

    for (const user of expiredPauses) {
      try {
        // 1. Resume Stripe billing (same pattern as users.js manual resume)
        if (user.subscription?.stripeSubscriptionId) {
          try {
            const Stripe = (await import('stripe')).default;
            const stripe = process.env.STRIPE_SECRET_KEY
              ? new Stripe(process.env.STRIPE_SECRET_KEY)
              : null;
            if (stripe) {
              await stripe.subscriptions.update(user.subscription.stripeSubscriptionId, {
                pause_collection: ''
              });
              console.log(`[HardshipResume] Resumed Stripe sub ${user.subscription.stripeSubscriptionId} for user ${user._id}`);
            }
          } catch (stripeErr) {
            console.error(`[HardshipResume] Stripe resume failed for user ${user._id}:`, stripeErr.message);
            stats.stripeFailures++;
            // Continue anyway — flip the DB flag so manual resume can retry Stripe
          }
        }

        // 2. Flip the DB pause flags via existing instance method
        await user.endHardshipPause();
        stats.resumed++;
        console.log(`[HardshipResume] Resumed user ${user._id} (${user.email})`);
      } catch (userErr) {
        console.error(`[HardshipResume] Failed to resume user ${user._id}:`, userErr.message);
        stats.errors++;
      }
    }
  } catch (err) {
    console.error('[HardshipResume] Top-level error:', err);
    stats.errors++;
  }

  console.log('[HardshipResume] Complete:', stats);
  return stats;
}
