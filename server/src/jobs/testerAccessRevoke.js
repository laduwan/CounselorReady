/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import User from '../models/User.js';

/**
 * Revoke admin-granted tester access once subscription.trialEndsAt has passed.
 *
 * Testers are provisioned by POST /api/admin/users/create with a paid plan and
 * status 'active', because status 'trial' is capped at TRIAL_COURSES_TOTAL
 * one-CE-hour courses by interactiveCourseRoutes.js and would not give a tester
 * a real evaluation. Status 'active' never expires on its own, so this job is
 * what actually ends the window.
 *
 * Safety: only accounts with NO Stripe subscription are eligible, so a paying
 * subscriber can never be revoked here.
 *
 * Scheduled via node-cron at 7 AM ET daily.
 */
export async function runTesterAccessRevoke() {
  console.log('[TesterRevoke] Starting tester access revoke check...');
  const stats = { checked: 0, revoked: 0, errors: 0 };

  try {
    const now = new Date();
    const expired = await User.find({
      'subscription.status': 'active',
      'subscription.trialEndsAt': { $lte: now },
      // Belt and braces: a real subscriber always has BOTH of these. Excluding
      // either one alone would still revoke a payer if a webhook race left the
      // other unset, so require both to be absent. Worst case a tester who
      // added a card is missed and revoked by hand — never a paying customer.
      'subscription.stripeSubscriptionId': { $in: [null, ''] },
      'subscription.stripeCustomerId': { $in: [null, ''] }
    }).select('_id email subscription');

    stats.checked = expired.length;
    console.log(`[TesterRevoke] Found ${stats.checked} expired tester grants`);

    for (const user of expired) {
      try {
        await User.updateOne(
          { _id: user._id },
          { $set: { 'subscription.status': 'expired', 'subscription.plan': 'free' } }
        );
        stats.revoked++;
        const ended = new Date(user.subscription.trialEndsAt).toISOString().slice(0, 10);
        console.log(`[TesterRevoke] Revoked ${user.email} (access ended ${ended})`);
      } catch (userErr) {
        console.error(`[TesterRevoke] Failed to revoke user ${user._id}:`, userErr.message);
        stats.errors++;
      }
    }
  } catch (err) {
    console.error('[TesterRevoke] Top-level error:', err);
    stats.errors++;
  }

  console.log(`[TesterRevoke] Done — checked ${stats.checked}, revoked ${stats.revoked}, errors ${stats.errors}`);
  return stats;
}
