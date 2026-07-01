/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { describe, it, expect, vi } from 'vitest';
import { attachTenantScope, requireTenantScope } from '../middleware/tenantScope.js';

function mockReqRes(overrides = {}) {
  const req = { user: null, partnerId: null, partner: null, ...overrides };
  const res = {
    statusCode: null,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(data) { this.body = data; return this; },
  };
  const next = vi.fn();
  return { req, res, next };
}

describe('attachTenantScope', () => {
  it('gives admins empty tenant filter (see all data)', () => {
    const { req, res, next } = mockReqRes({ user: { role: 'admin' } });
    attachTenantScope(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.tenantFilter).toEqual({});
    expect(req.tenantPartnerId).toBeNull();
  });

  it('scopes by partnerId from user', () => {
    const { req, res, next } = mockReqRes({
      user: { role: 'partner_admin', partnerId: 'partner123' }
    });
    attachTenantScope(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.tenantFilter).toEqual({ partnerId: 'partner123' });
    expect(req.tenantPartnerId).toBe('partner123');
  });

  it('scopes by partnerId from request', () => {
    const { req, res, next } = mockReqRes({ partnerId: 'partnerABC' });
    attachTenantScope(req, res, next);
    expect(req.tenantFilter).toEqual({ partnerId: 'partnerABC' });
  });

  it('returns empty filter when no partner context', () => {
    const { req, res, next } = mockReqRes({ user: { role: 'user' } });
    attachTenantScope(req, res, next);
    expect(req.tenantFilter).toEqual({});
    expect(req.tenantPartnerId).toBeNull();
  });
});

describe('requireTenantScope', () => {
  it('allows admin through without partner context', () => {
    const { req, res, next } = mockReqRes({ user: { role: 'admin' } });
    requireTenantScope(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('blocks non-admin without partner context', () => {
    const { req, res, next } = mockReqRes({ user: { role: 'user' } });
    requireTenantScope(req, res, next);
    expect(res.statusCode).toBe(403);
    expect(res.body.code).toBe('TENANT_REQUIRED');
    expect(next).not.toHaveBeenCalled();
  });

  it('allows partner_admin with partnerId', () => {
    const { req, res, next } = mockReqRes({
      user: { role: 'partner_admin', partnerId: 'p1' }
    });
    requireTenantScope(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
