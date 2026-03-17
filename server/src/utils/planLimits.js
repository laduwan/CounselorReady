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
  free:         { maxCourses: 0,   maxUsers: 0,    customDomain: false, bulkUpload: false },
  starter:      { maxCourses: 10,  maxUsers: 100,  customDomain: false, bulkUpload: false },
  growth:       { maxCourses: 50,  maxUsers: 500,  customDomain: false, bulkUpload: true },
  professional: { maxCourses: 200, maxUsers: 5000, customDomain: true,  bulkUpload: true },
  enterprise:   { maxCourses: -1,  maxUsers: -1,   customDomain: true,  bulkUpload: true },
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
