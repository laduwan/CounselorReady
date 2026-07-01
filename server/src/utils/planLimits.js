/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */

/**
 * Single source of truth for partner plan definitions.
 * Used by quota enforcement middleware, billing routes, and reports.
 */

export const PLAN_LIMITS = {
  free:         { maxCourses: 0,   maxUsers: 0,    customDomain: false, bulkUpload: false, aiBudgetCents: 0 },
  starter:      { maxCourses: 10,  maxUsers: 100,  customDomain: false, bulkUpload: false, aiBudgetCents: 1000 },   // $10/mo
  growth:       { maxCourses: 50,  maxUsers: 500,  customDomain: false, bulkUpload: true,  aiBudgetCents: 2000 },   // $20/mo
  professional: { maxCourses: 200, maxUsers: 5000, customDomain: true,  bulkUpload: true,  aiBudgetCents: 7500 },   // $75/mo
  enterprise:   { maxCourses: -1,  maxUsers: -1,   customDomain: true,  bulkUpload: true,  aiBudgetCents: 15000 },  // $150/mo
};

export const PARTNER_PLANS = {
  starter:      { name: 'Starter',      price: 99,  introPrice: 49,   introMonths: 2, ...PLAN_LIMITS.starter },
  growth:       { name: 'Growth',       price: 199, introPrice: 99,   introMonths: 2, ...PLAN_LIMITS.growth },
  professional: { name: 'Professional', price: 399, introPrice: null, introMonths: 0, ...PLAN_LIMITS.professional },
  enterprise:   { name: 'Enterprise',   price: 799, introPrice: null, introMonths: 0, ...PLAN_LIMITS.enterprise },
};

/**
 * Get plan limits for a given plan name. Returns free limits for unknown plans.
 */
export function getPlanLimits(plan) {
  return PLAN_LIMITS[plan] || PLAN_LIMITS.free;
}

/**
 * Monthly complimentary AI-generation budget (in cents) for a plan. This is a hard ceiling on the
 * Anthropic API cost we absorb per partner per period; metered against ACTUAL generation cost.
 */
export function getAiBudgetCents(plan) {
  return getPlanLimits(plan).aiBudgetCents || 0;
}

/**
 * Premium add-on definitions. These are CR-proprietary features
 * that partners can unlock for an additional monthly fee.
 * Every enabled add-on displays a "Powered by CounselorReady™" badge.
 */
export const PREMIUM_ADDONS = {
  certTracking: {
    name: 'Certificate Tracking',
    description: 'Issue and track CE certificates for your users',
    monthlyPriceCents: 2500,  // $25/mo
    poweredBy: true
  },
  credentialManagement: {
    name: 'Credential Management',
    description: 'License and credential tracking for your team',
    monthlyPriceCents: 2000,  // $20/mo
    poweredBy: true
  },
  complianceTracking: {
    name: 'Compliance Tracking',
    description: 'State and board compliance tracking and reporting',
    monthlyPriceCents: 2500,  // $25/mo
    poweredBy: true
  },
  clinicalTools: {
    name: 'Clinical Tools Suite',
    description: 'Treatment plans, safety plans, note writer, and more',
    monthlyPriceCents: 3000,  // $30/mo
    poweredBy: true
  }
};

export const PREMIUM_BUNDLE_PRICE_CENTS = 10000; // $100/mo for all 4 (no discount)
