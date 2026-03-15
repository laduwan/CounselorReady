/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { describe, it, expect, vi } from 'vitest';

function mockReqRes(overrides = {}) {
  const req = { headers: {}, user: null, ...overrides };
  const res = {
    statusCode: null,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(data) { this.body = data; return this; },
  };
  const next = vi.fn();
  return { req, res, next };
}

describe('requireAdmin', () => {
  it('blocks non-admin users', async () => {
    // Import the middleware directly since it doesn't depend on DB for role check
    const { requireAdmin } = await import('../middleware/auth.js');
    const { req, res, next } = mockReqRes({ user: { role: 'user' } });
    await requireAdmin(req, res, next);
    expect(res.statusCode).toBe(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('allows admin users', async () => {
    const { requireAdmin } = await import('../middleware/auth.js');
    const { req, res, next } = mockReqRes({ user: { role: 'admin' } });
    await requireAdmin(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});

describe('requirePartnerAdmin', () => {
  it('allows platform admins', async () => {
    const { requirePartnerAdmin } = await import('../middleware/auth.js');
    const { req, res, next } = mockReqRes({ user: { role: 'admin' } });
    await requirePartnerAdmin(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('allows partner_admin with partnerId', async () => {
    const { requirePartnerAdmin } = await import('../middleware/auth.js');
    const { req, res, next } = mockReqRes({
      user: { role: 'partner_admin', partnerId: 'p123' }
    });
    await requirePartnerAdmin(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.partnerId).toBe('p123');
  });

  it('blocks regular users', async () => {
    const { requirePartnerAdmin } = await import('../middleware/auth.js');
    const { req, res, next } = mockReqRes({ user: { role: 'user' } });
    await requirePartnerAdmin(req, res, next);
    expect(res.statusCode).toBe(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('blocks partner_admin without partnerId', async () => {
    const { requirePartnerAdmin } = await import('../middleware/auth.js');
    const { req, res, next } = mockReqRes({
      user: { role: 'partner_admin', partnerId: null }
    });
    await requirePartnerAdmin(req, res, next);
    expect(res.statusCode).toBe(403);
  });
});

describe('requireSubscription', () => {
  it('blocks users without active subscription', async () => {
    const { requireSubscription } = await import('../middleware/auth.js');
    const { req, res, next } = mockReqRes({
      user: { hasActiveSubscription: () => false }
    });
    await requireSubscription(req, res, next);
    expect(res.statusCode).toBe(403);
    expect(res.body.code).toBe('SUBSCRIPTION_REQUIRED');
  });

  it('allows users with active subscription', async () => {
    const { requireSubscription } = await import('../middleware/auth.js');
    const { req, res, next } = mockReqRes({
      user: { hasActiveSubscription: () => true }
    });
    await requireSubscription(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
