export const PRICING_TIERS = {
  free:         { name: 'free',         price: 0,    accessType: 'free',         minPlan: null,           maxWordCount: 6150 },
  starter:      { name: 'starter',      price: 29,   accessType: 'subscription', minPlan: 'starter',      maxWordCount: 12200 },
  professional: { name: 'professional', price: 39,   accessType: 'subscription', minPlan: 'professional', maxWordCount: 18100 },
  vip:          { name: 'vip',          price: 59,   accessType: 'subscription', minPlan: 'vip',          maxWordCount: 21100 },
  premium:      { name: 'premium',      price: null, accessType: 'paid',         minPlan: null,           maxWordCount: Infinity },
};

export const PLAN_RANK = { free: 0, starter: 1, professional: 2, vip: 3 };

export function resolvePricingFromWordCount(wordCount, customPremiumPrice = null) {
  let tier;
  if      (wordCount <= 6150)  tier = PRICING_TIERS.free;
  else if (wordCount <= 12200) tier = PRICING_TIERS.starter;
  else if (wordCount <= 18100) tier = PRICING_TIERS.professional;
  else if (wordCount <= 21100) tier = PRICING_TIERS.vip;
  else                          tier = PRICING_TIERS.premium;
  return {
    pricingTier: tier.name,
    accessTier:  tier.name,
    accessType:  tier.accessType,
    price:       tier.name === 'premium' ? (customPremiumPrice ?? 0) : tier.price,
  };
}

export function resolvePricingFromCEHours(ceHours, customPremiumPrice = null) {
  return resolvePricingFromWordCount(ceHours * 6000, customPremiumPrice);
}

export function canAccessCourse(userPlan, courseTier, hasPurchased = false) {
  const tier = PRICING_TIERS[courseTier];
  if (!tier) return { allowed: false, reason: `Unknown tier: ${courseTier}` };
  if (tier.name === 'free') return { allowed: true, reason: 'free_course' };
  if (tier.name === 'premium') {
    return hasPurchased
      ? { allowed: true, reason: 'purchased' }
      : { allowed: false, reason: 'premium_purchase_required' };
  }
  if (hasPurchased) return { allowed: true, reason: 'purchased' };
  const userRank = PLAN_RANK[userPlan] ?? -1;
  const tierRank = PLAN_RANK[tier.minPlan] ?? 99;
  if (userRank >= tierRank) return { allowed: true, reason: 'subscription_covers' };
  return { allowed: false, reason: 'upgrade_required', requiredPlan: tier.minPlan, individualPrice: tier.price };
}
