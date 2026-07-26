/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { describe, it, expect } from 'vitest';
import { getPlanLimits } from '../middleware/quotaEnforcement.js';

describe('getPlanLimits', () => {
  it('returns free limits for unknown plans', () => {
    const limits = getPlanLimits('nonexistent');
    expect(limits).toEqual({
      maxCourses: 0,
      maxUsers: 0,
      customDomain: false,
      bulkUpload: false,
      aiBudgetCents: 0,
    });
  });

  it('returns correct starter limits', () => {
    const limits = getPlanLimits('starter');
    expect(limits.maxCourses).toBe(10);
    expect(limits.maxUsers).toBe(100);
    expect(limits.customDomain).toBe(false);
    expect(limits.bulkUpload).toBe(false);
    expect(limits.aiBudgetCents).toBe(1000);
  });

  it('returns correct growth limits', () => {
    const limits = getPlanLimits('growth');
    expect(limits.maxCourses).toBe(50);
    expect(limits.maxUsers).toBe(500);
    expect(limits.customDomain).toBe(false);
    expect(limits.bulkUpload).toBe(true);
    expect(limits.aiBudgetCents).toBe(2000);
  });

  it('returns correct professional limits', () => {
    const limits = getPlanLimits('professional');
    expect(limits.maxCourses).toBe(200);
    expect(limits.maxUsers).toBe(5000);
    expect(limits.customDomain).toBe(true);
    expect(limits.bulkUpload).toBe(true);
    expect(limits.aiBudgetCents).toBe(7500);
  });

  it('returns unlimited for enterprise', () => {
    const limits = getPlanLimits('enterprise');
    expect(limits.maxCourses).toBe(-1);
    expect(limits.maxUsers).toBe(-1);
    expect(limits.customDomain).toBe(true);
    expect(limits.bulkUpload).toBe(true);
    expect(limits.aiBudgetCents).toBe(15000);
  });

  it('returns free limits for undefined input', () => {
    const limits = getPlanLimits(undefined);
    expect(limits.maxCourses).toBe(0);
  });
});
