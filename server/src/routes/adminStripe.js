/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import express from 'express';
import Stripe from 'stripe';
import User from '../models/User.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

// @route   GET /api/admin/stripe/overview
// @desc    Get Stripe overview stats (subscriptions, revenue, MRR)
// @access  Admin
router.get('/overview', protect, requireAdmin, async (req, res) => {
  try {
    // Get subscription stats from local DB
    const [
      totalSubscribers,
      activeSubscribers,
      pastDueSubscribers,
      canceledSubscribers,
      planCounts,
      mrrAggregate
    ] = await Promise.all([
      User.countDocuments({ 'subscription.plan': { $ne: 'free' } }),
      User.countDocuments({ 'subscription.status': 'active', 'subscription.plan': { $ne: 'free' } }),
      User.countDocuments({ 'subscription.status': 'past_due' }),
      User.countDocuments({ 'subscription.status': 'canceled', 'subscription.plan': { $ne: 'free' } }),
      User.aggregate([
        { $match: { 'subscription.plan': { $ne: 'free' }, 'subscription.status': 'active' } },
        { $group: { _id: '$subscription.plan', count: { $sum: 1 } } }
      ]),
      // Real MRR from actual charged amounts (post-discount)
      User.aggregate([
        { $match: { 'subscription.status': 'active', 'subscription.monthlyAmountCents': { $gt: 0 } } },
        { $group: { _id: null, totalCents: { $sum: '$subscription.monthlyAmountCents' } } }
      ])
    ]);

    // Real MRR from actual charged amounts
    const realMRRCents = mrrAggregate[0]?.totalCents || 0;
    const realMRR = Math.round(realMRRCents) / 100;

    // Gross estimate (for comparison) from plan counts — includes $0 discount subs
    const planPrices = { starter: 19.99, professional: 29.99, vip: 49.99 };
    let grossMRR = 0;
    const planBreakdown = {};
    planCounts.forEach(p => {
      planBreakdown[p._id] = p.count;
      grossMRR += (planPrices[p._id] || 0) * p.count;
    });

    // Get Stripe balance if available
    let stripeBalance = null;
    if (stripe) {
      try {
        const balance = await stripe.balance.retrieve();
        stripeBalance = {
          available: balance.available.reduce((sum, b) => sum + b.amount, 0) / 100,
          pending: balance.pending.reduce((sum, b) => sum + b.amount, 0) / 100,
          currency: balance.available[0]?.currency || 'usd'
        };
      } catch (e) {
        console.log('Could not fetch Stripe balance:', e.message);
      }
    }

    res.json({
      success: true,
      data: {
        subscribers: {
          total: totalSubscribers,
          active: activeSubscribers,
          pastDue: pastDueSubscribers,
          canceled: canceledSubscribers
        },
        plans: planBreakdown,
        estimatedMRR: realMRR,          // actual charged (post-discount) — use this
        grossMRR: Math.round(grossMRR * 100) / 100, // pre-discount estimate — for reference only
        stripeBalance
      }
    });
  } catch (error) {
    console.error('Admin Stripe overview error:', error);
    res.status(500).json({ error: 'Failed to load Stripe overview' });
  }
});

// @route   GET /api/admin/stripe/subscribers
// @desc    Get paginated list of subscribers with Stripe data
// @access  Admin
router.get('/subscribers', protect, requireAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 25,
      status = 'all',
      plan = 'all',
      search = ''
    } = req.query;

    const query = {};

    // Filter by subscription status
    if (status === 'active') {
      query['subscription.status'] = 'active';
      query['subscription.plan'] = { $ne: 'free' };
    } else if (status === 'past_due') {
      query['subscription.status'] = 'past_due';
    } else if (status === 'canceled') {
      query['subscription.status'] = 'canceled';
    } else if (status === 'free') {
      query['subscription.plan'] = 'free';
    } else {
      // 'all' - show everyone who has ever had a subscription or has stripeCustomerId
      query.$or = [
        { 'subscription.plan': { $ne: 'free' } },
        { stripeCustomerId: { $exists: true, $ne: null } }
      ];
    }

    // Filter by plan
    if (plan !== 'all') {
      query['subscription.plan'] = plan;
    }

    // Search by email or name
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { email: searchRegex },
          { 'profile.firstName': searchRegex },
          { 'profile.lastName': searchRegex },
          { stripeCustomerId: search }
        ]
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [subscribers, total] = await Promise.all([
      User.find(query)
        .select('email profile.firstName profile.lastName subscription stripeCustomerId stripeSubscriptionId createdAt')
        .sort({ 'subscription.currentPeriodEnd': -1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      User.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        subscribers: subscribers.map(u => ({
          _id: u._id,
          email: u.email,
          name: `${u.profile?.firstName || ''} ${u.profile?.lastName || ''}`.trim() || u.email,
          plan: u.subscription?.plan || 'free',
          status: u.subscription?.status || 'inactive',
          currentPeriodEnd: u.subscription?.currentPeriodEnd,
          cancelAtPeriodEnd: u.subscription?.cancelAtPeriodEnd,
          paymentFailedAt: u.subscription?.paymentFailedAt,
          stripeCustomerId: u.stripeCustomerId,
          stripeSubscriptionId: u.stripeSubscriptionId,
          createdAt: u.createdAt
        })),
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Admin Stripe subscribers error:', error);
    res.status(500).json({ error: 'Failed to load subscribers' });
  }
});

// @route   GET /api/admin/stripe/recent-payments
// @desc    Get recent payments/charges from Stripe
// @access  Admin
router.get('/recent-payments', protect, requireAdmin, async (req, res) => {
  if (!stripe) {
    return res.json({ success: true, data: { payments: [], message: 'Stripe not configured' } });
  }

  try {
    const { limit = 20 } = req.query;

    const charges = await stripe.charges.list({
      limit: parseInt(limit),
      expand: ['data.customer']
    });

    const payments = charges.data.map(charge => ({
      id: charge.id,
      amount: charge.amount / 100,
      currency: charge.currency,
      status: charge.status,
      description: charge.description || 'Subscription payment',
      customerEmail: charge.customer?.email || charge.billing_details?.email || 'Unknown',
      customerName: charge.customer?.name || charge.billing_details?.name || '',
      created: new Date(charge.created * 1000),
      receiptUrl: charge.receipt_url,
      refunded: charge.refunded,
      amountRefunded: charge.amount_refunded / 100
    }));

    res.json({ success: true, data: { payments } });
  } catch (error) {
    console.error('Admin Stripe recent payments error:', error);
    res.status(500).json({ error: 'Failed to load recent payments' });
  }
});

// @route   GET /api/admin/stripe/customer/:customerId
// @desc    Get detailed Stripe customer info
// @access  Admin
router.get('/customer/:customerId', protect, requireAdmin, async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Stripe not configured' });
  }

  try {
    const { customerId } = req.params;

    const [customer, invoices, subscriptions] = await Promise.all([
      stripe.customers.retrieve(customerId),
      stripe.invoices.list({ customer: customerId, limit: 10 }),
      stripe.subscriptions.list({ customer: customerId, limit: 5, status: 'all' })
    ]);

    res.json({
      success: true,
      data: {
        customer: {
          id: customer.id,
          email: customer.email,
          name: customer.name,
          created: new Date(customer.created * 1000),
          balance: customer.balance / 100,
          defaultPaymentMethod: customer.invoice_settings?.default_payment_method
        },
        invoices: invoices.data.map(inv => ({
          id: inv.id,
          number: inv.number,
          amount: inv.amount_paid / 100,
          status: inv.status,
          date: new Date(inv.created * 1000),
          pdfUrl: inv.invoice_pdf,
          hostedUrl: inv.hosted_invoice_url
        })),
        subscriptions: subscriptions.data.map(sub => ({
          id: sub.id,
          status: sub.status,
          plan: sub.metadata?.plan || 'unknown',
          currentPeriodEnd: new Date(sub.current_period_end * 1000),
          cancelAtPeriodEnd: sub.cancel_at_period_end,
          created: new Date(sub.created * 1000)
        }))
      }
    });
  } catch (error) {
    console.error('Admin Stripe customer error:', error);
    res.status(500).json({ error: 'Failed to load customer details' });
  }
});

export default router;
