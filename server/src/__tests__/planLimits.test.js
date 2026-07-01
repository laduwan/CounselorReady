/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { describe, it, expect } from 'vitest';
import { PLAN_LIMITS, PARTNER_PLANS, getPlanLimits } from '../utils/planLimits.js';

describe('planLimits shared utility', () => {
  it('PLAN_LIMITS and PARTNER_PLANS have consistent maxCourses', () => {
    expect(PARTNER_PLANS.starter.maxCourses).toBe(PLAN_LIMITS.starter.maxCourses);
    expect(PARTNER_PLANS.growth.maxCourses).toBe(PLAN_LIMITS.growth.maxCourses);
    expect(PARTNER_PLANS.professional.maxCourses).toBe(PLAN_LIMITS.professional.maxCourses);
    expect(PARTNER_PLANS.enterprise.maxCourses).toBe(PLAN_LIMITS.enterprise.maxCourses);
  });

  it('PLAN_LIMITS and PARTNER_PLANS have consistent maxUsers', () => {
    expect(PARTNER_PLANS.starter.maxUsers).toBe(PLAN_LIMITS.starter.maxUsers);
    expect(PARTNER_PLANS.growth.maxUsers).toBe(PLAN_LIMITS.growth.maxUsers);
    expect(PARTNER_PLANS.professional.maxUsers).toBe(PLAN_LIMITS.professional.maxUsers);
    expect(PARTNER_PLANS.enterprise.maxUsers).toBe(PLAN_LIMITS.enterprise.maxUsers);
  });

  it('PARTNER_PLANS have pricing info', () => {
    expect(PARTNER_PLANS.starter.price).toBe(99);
    expect(PARTNER_PLANS.starter.introPrice).toBe(49);
    expect(PARTNER_PLANS.growth.price).toBe(199);
    expect(PARTNER_PLANS.professional.price).toBe(399);
    expect(PARTNER_PLANS.enterprise.price).toBe(799);
  });

  it('getPlanLimits returns correct limits from shared source', () => {
    expect(getPlanLimits('starter')).toEqual(PLAN_LIMITS.starter);
    expect(getPlanLimits('enterprise')).toEqual(PLAN_LIMITS.enterprise);
  });

  it('getPlanLimits falls back to free for unknown plans', () => {
    expect(getPlanLimits('nonexistent')).toEqual(PLAN_LIMITS.free);
    expect(getPlanLimits(undefined)).toEqual(PLAN_LIMITS.free);
  });

  it('feature gates are consistent across plans', () => {
    expect(PLAN_LIMITS.free.bulkUpload).toBe(false);
    expect(PLAN_LIMITS.starter.bulkUpload).toBe(false);
    expect(PLAN_LIMITS.growth.bulkUpload).toBe(true);
    expect(PLAN_LIMITS.professional.customDomain).toBe(true);
    expect(PLAN_LIMITS.enterprise.customDomain).toBe(true);
    expect(PLAN_LIMITS.starter.customDomain).toBe(false);
  });
});
