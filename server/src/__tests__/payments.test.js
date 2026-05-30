/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

// Ensure Stripe initializes inside the route module (otherwise every route 503s).
process.env.STRIPE_SECRET_KEY = 'sk_test_fake';

// Shared Stripe instance mock — hoisted so vi.mock('stripe') can reference it.
const h = vi.hoisted(() => {
  const stripeInstance = {
    customers: { create: vi.fn(), retrieve: vi.fn(), update: vi.fn() },
    subscriptions: { create: vi.fn(), retrieve: vi.fn(), update: vi.fn() },
    checkout: { sessions: { create: vi.fn() } },
    billingPortal: { sessions: { create: vi.fn() } },
    webhooks: { constructEvent: vi.fn() },
    promotionCodes: { list: vi.fn() },
    coupons: { list: vi.fn(), retrieve: vi.fn() },
    invoices: { list: vi.fn() },
  };
  return { stripeInstance };
});

// `new Stripe(key)` returns our shared instance (a constructor returning an object
// causes `new` to yield that object). Must be a real function, not an arrow, so it
// is usable with `new`.
vi.mock('stripe', () => ({ default: vi.fn(function () { return h.stripeInstance; }) }));

vi.mock('../models/User.js', () => ({
  default: { findById: vi.fn(), findByIdAndUpdate: vi.fn(), findOne: vi.fn(), create: vi.fn() },
}));
vi.mock('../models/Course.js', () => ({ default: { findById: vi.fn() } }));
vi.mock('../models/Partner.js', () => ({
  default: { findById: vi.fn(), findByIdAndUpdate: vi.fn() },
}));

// protect: 401 without an Authorization header, otherwise attach a test user.
vi.mock('../middleware/auth.js', () => ({
  protect: (req, res, next) => {
    if (!req.headers.authorization) {
      return res.status(401).json({ error: 'Not authorized, no token' });
    }
    req.user = { _id: 'user123', email: 'test@example.com', role: 'user' };
    next();
  },
}));

vi.mock('../services/activityTrackingService.js', () => ({
  logActivity: vi.fn().mockResolvedValue(undefined),
  ACTIVITY_TYPES: {},
}));
vi.mock('../services/hardshipEmailService.js', () => ({
  sendPaymentFailedEmail: vi.fn().mockResolvedValue(undefined),
  sendPaymentRecoveredEmail: vi.fn().mockResolvedValue(undefined),
}));
vi.mock('../services/rewardsService.js', () => ({
  processReferralPaidConversion: vi.fn().mockResolvedValue({ referrerAwarded: false }),
}));
vi.mock('../utils/logger.js', () => ({
  default: { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() },
}));

// Import the router and mocked models AFTER the mocks are declared.
const paymentsRouter = (await import('../routes/payments.js')).default;
const User = (await import('../models/User.js')).default;
const Partner = (await import('../models/Partner.js')).default;

const TEST_USER = {
  _id: 'user123',
  email: 'test@example.com',
  role: 'user',
  subscription: { plan: 'free', status: 'trial' },
  stripeCustomerId: null,
  purchasedCourses: [],
  profile: { firstName: 'Test' },
};

// A query-like object: awaitable (`await User.findById(id)`) AND chainable
// (`User.findById(id).select(...)`), matching how payments.js uses it.
function userQuery(value) {
  return {
    select: vi.fn().mockResolvedValue(value),
    then: (resolve) => resolve(value),
  };
}

// Mirror the body-parser order from server/src/index.js: raw for the webhook,
// JSON for everything else.
function makeApp() {
  const app = express();
  app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));
  app.use(express.json());
  app.use('/api/payments', paymentsRouter);
  return app;
}
const app = makeApp();

beforeEach(() => {
  vi.clearAllMocks();
  User.findById.mockImplementation(() => userQuery(TEST_USER));
  User.findByIdAndUpdate.mockResolvedValue(TEST_USER);
  Partner.findByIdAndUpdate.mockResolvedValue({});
  h.stripeInstance.webhooks.constructEvent.mockReset();
});

describe('GET /api/payments/subscription', () => {
  it('returns subscription status for an authenticated user', async () => {
    const res = await request(app)
      .get('/api/payments/subscription')
      .set('authorization', 'Bearer token');
    expect(res.status).toBe(200);
    expect(res.body.subscription).toEqual({ plan: 'free', status: 'trial' });
    expect(res.body.paymentMethod).toBeNull();
  });

  it('returns 401 when no token is provided', async () => {
    const res = await request(app).get('/api/payments/subscription');
    expect(res.status).toBe(401);
  });
});

describe('POST /api/payments/webhook', () => {
  it('rejects an invalid Stripe signature with 400', async () => {
    h.stripeInstance.webhooks.constructEvent.mockImplementation(() => {
      throw new Error('Invalid signature');
    });
    const res = await request(app)
      .post('/api/payments/webhook')
      .set('stripe-signature', 'bad-sig')
      .send({ id: 'evt_1' });
    expect(res.status).toBe(400);
    expect(h.stripeInstance.webhooks.constructEvent).toHaveBeenCalled();
  });

  it('handles a checkout.session.completed event', async () => {
    h.stripeInstance.webhooks.constructEvent.mockReturnValue({
      type: 'checkout.session.completed',
      data: {
        object: {
          subscription: 'sub_123',
          amount_total: 2999,
          metadata: { userId: 'user123', plan: 'professional' },
        },
      },
    });
    const res = await request(app)
      .post('/api/payments/webhook')
      .set('stripe-signature', 'good-sig')
      .send({ id: 'evt_2' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ received: true });
    expect(User.findByIdAndUpdate).toHaveBeenCalled();
  });
});

describe('POST /api/payments/create-checkout-session', () => {
  it('returns 400 when no plan/priceId is provided', async () => {
    const res = await request(app)
      .post('/api/payments/create-checkout-session')
      .set('authorization', 'Bearer token')
      .send({});
    expect(res.status).toBe(400);
  });
});

describe('GET /api/payments/purchased-courses', () => {
  it('returns an empty array for a user with no purchases', async () => {
    const res = await request(app)
      .get('/api/payments/purchased-courses')
      .set('authorization', 'Bearer token');
    expect(res.status).toBe(200);
    expect(res.body.purchased).toEqual([]);
  });
});

describe('POST /api/payments/apply-promo', () => {
  it('returns 400 when no code is provided', async () => {
    const res = await request(app)
      .post('/api/payments/apply-promo')
      .set('authorization', 'Bearer token')
      .send({});
    expect(res.status).toBe(400);
  });
});
