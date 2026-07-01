/**
 * pricingRules.js
 * CounselorReady — Single source of truth for course pricing tiers
 * Drop in: server/src/utils/pricingRules.js
 *
 * Tier matrix (word count drives everything):
 *   ≤ 6,150  → free       · $0    · all plans
 *   ≤ 12,200 → starter    · $29   · starter, professional, vip
 *   ≤ 18,100 → professional· $39  · professional, vip
 *   ≤ 21,100 → vip        · $59   · vip only
 *   > 21,100 → premium    · $98   · individual purchase only (no sub included)
 *
 * Plan hierarchy (lowest → highest access):
 *   free < starter < professional < vip
 */

// ─── Tier Definitions ────────────────────────────────────────────────────────

export const PRICING_TIERS = {
  free: {
    name: 'free',
    price: 0,
    accessType: 'free',
    minPlan: null,           // no plan required
    maxWordCount: 6150,
    label: 'Free',
  },
  starter: {
    name: 'starter',
    price: 29,
    accessType: 'subscription',
    minPlan: 'starter',
    maxWordCount: 12200,
    label: 'Starter',
  },
  professional: {
    name: 'professional',
    price: 39,
    accessType: 'subscription',
    minPlan: 'professional',
    maxWordCount: 18100,
    label: 'Professional',
  },
  vip: {
    name: 'vip',
    price: 59,
    accessType: 'subscription',
    minPlan: 'vip',
    maxWordCount: 21100,
    label: 'VIP',
  },
  premium: {
    name: 'premium',
    price: 98,               // one-time purchase price for courses > 4 CE hours
    accessType: 'paid',
    minPlan: null,           // no subscription includes premium
    maxWordCount: Infinity,
    label: 'Premium',
  },
};

// Plan rank — higher number = higher access
export const PLAN_RANK = {
  free: 0,
  starter: 1,
  professional: 2,
  vip: 3,
};

// ─── Core Resolver ───────────────────────────────────────────────────────────

/**
 * Resolve pricing fields from word count.
 * Use this in seed scripts and admin routes to auto-assign tiers.
 *
 * @param {number} wordCount  - total content word count
 * @param {number} [customPremiumPrice] - required only for premium tier
 * @returns {{ pricingTier, accessType, accessTier, price }}
 */
export function resolvePricingFromWordCount(wordCount, customPremiumPrice = null) {
  let tier;

  if (wordCount <= PRICING_TIERS.free.maxWordCount) {
    tier = PRICING_TIERS.free;
  } else if (wordCount <= PRICING_TIERS.starter.maxWordCount) {
    tier = PRICING_TIERS.starter;
  } else if (wordCount <= PRICING_TIERS.professional.maxWordCount) {
    tier = PRICING_TIERS.professional;
  } else if (wordCount <= PRICING_TIERS.vip.maxWordCount) {
    tier = PRICING_TIERS.vip;
  } else {
    tier = PRICING_TIERS.premium;
  }

  return {
    pricingTier:  tier.name,
    accessTier:   tier.name,
    accessType:   tier.accessType,
    price:        tier.name === 'premium' ? (customPremiumPrice ?? tier.price) : tier.price,
  };
}

/**
 * Resolve pricing fields from CE hours.
 * Convenience wrapper — uses 6,000 words/CE hr as the ACEP standard.
 *
 * @param {number} ceHours
 * @param {number} [customPremiumPrice]
 */
export function resolvePricingFromCEHours(ceHours, customPremiumPrice = null) {
  return resolvePricingFromWordCount(ceHours * 6000, customPremiumPrice);
}

// ─── Access Check ─────────────────────────────────────────────────────────────

/**
 * Check whether a user's plan grants access to a course tier.
 * Also returns true if the user has a one-time purchase record for the course.
 *
 * @param {string} userPlan       - 'free' | 'starter' | 'professional' | 'vip'
 * @param {string} courseTier     - pricingTier on the course document
 * @param {boolean} hasPurchased  - true if user has a purchase record for this course
 * @returns {{ allowed: boolean, reason: string }}
 */
export function canAccessCourse(userPlan, courseTier, hasPurchased = false) {
  const tier = PRICING_TIERS[courseTier];

  if (!tier) {
    return { allowed: false, reason: `Unknown pricing tier: ${courseTier}` };
  }

  // Free courses — everyone in
  if (tier.name === 'free') {
    return { allowed: true, reason: 'free_course' };
  }

  // Premium — subscription never covers it; must be individually purchased
  if (tier.name === 'premium') {
    if (hasPurchased) return { allowed: true, reason: 'purchased' };
    return { allowed: false, reason: 'premium_purchase_required' };
  }

  // Subscription tiers — individual purchase always works
  if (hasPurchased) return { allowed: true, reason: 'purchased' };

  const userRank   = PLAN_RANK[userPlan]  ?? -1;
  const tierRank   = PLAN_RANK[tier.minPlan] ?? 99;

  if (userRank >= tierRank) {
    return { allowed: true, reason: 'subscription_covers' };
  }

  return {
    allowed: false,
    reason: 'upgrade_required',
    requiredPlan: tier.minPlan,
    individualPrice: tier.price,
  };
}
