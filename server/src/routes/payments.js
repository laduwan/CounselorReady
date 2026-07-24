/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import express from 'express';
import mongoose from 'mongoose';
import Stripe from 'stripe';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Partner from '../models/Partner.js';
import { protect, requirePartnerAdmin } from '../middleware/auth.js';
import { PREMIUM_ADDONS, PREMIUM_BUNDLE_PRICE_CENTS } from '../utils/planLimits.js';
import { bustAddonCache } from '../middleware/partnerFeatureGate.js';
import { logActivity, ACTIVITY_TYPES } from '../services/activityTrackingService.js';
import { sendPaymentFailedEmail, sendPaymentRecoveredEmail } from '../services/hardshipEmailService.js';
import { processReferralPaidConversion } from '../services/rewardsService.js';
import { recordSyndicationCommission, applyRefundToCommission, voidSyndicationCommissionByPaymentIntent } from '../utils/syndicationCommission.js';
import { constructStripeEvent } from '../utils/verifyStripeSignature.js';
import { Course as InteractiveCourse } from '../models/InteractiveCourse.js';
import twilio from 'twilio';
import logger from '../utils/logger.js';

const twilioClient = process.env.TWILIO_ACCOUNT_SID
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

const router = express.Router();

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY) 
  : null;

// Price IDs from Stripe Dashboard (set in environment)
const PRICE_IDS = {
  starter: process.env.STRIPE_PRICE_STARTER || 'price_starter_monthly',
  professional: process.env.STRIPE_PRICE_PROFESSIONAL || 'price_professional_monthly',
  vip: process.env.STRIPE_PRICE_VIP || 'price_vip_monthly'
};

const PLAN_DETAILS = {
  free: { name: 'Free', price: 0, maxCEHours: 4, maxStates: 1 },
  starter: { name: 'Starter', price: 1999, maxCEHours: 999, maxStates: 1 },
  professional: { name: 'Professional', price: 2999, maxCEHours: 999, maxStates: 1 },
  vip: { name: 'VIP', price: 4999, maxCEHours: 999, maxStates: 999 }
};

// ============================================
// SUBSCRIPTION ROUTES
// ============================================

// @route   GET /api/payments/subscription
// @desc    Get current subscription status
// @access  Private
router.get('/subscription', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    let paymentMethod = null;
    if (user.subscription?.stripeCustomerId && stripe) {
      try {
        const customer = await stripe.customers.retrieve(user.subscription.stripeCustomerId);
        if (customer.invoice_settings?.default_payment_method) {
          const pm = await stripe.paymentMethods.retrieve(
            customer.invoice_settings.default_payment_method
          );
          paymentMethod = {
            brand: pm.card?.brand,
            last4: pm.card?.last4,
            expMonth: pm.card?.exp_month,
            expYear: pm.card?.exp_year
          };
        }
      } catch (e) {
        logger.info({ err: e, userId: req.user?._id, requestId: req.requestId }, 'Could not fetch payment method');
      }
    }
    
    res.json({ 
      subscription: user.subscription,
      paymentMethod
    });
  } catch (error) {
    logger.error({ err: error, userId: req.user?._id, requestId: req.requestId }, 'Get subscription error');
    res.status(500).json({ error: 'Failed to get subscription' });
  }
});

// @route   GET /api/payments/invoices
// @desc    Get user's billing history / invoices from Stripe
// @access  Private
router.get('/invoices', protect, async (req, res) => {
  if (!stripe) {
    return res.json({ invoices: [] });
  }
  
  try {
    const user = await User.findById(req.user._id);
    
    if (!user.subscription?.stripeCustomerId) {
      return res.json({ invoices: [] });
    }

    // Get invoices from Stripe
    const invoices = await stripe.invoices.list({
      customer: user.subscription.stripeCustomerId,
      status: 'paid',
      limit: 20
    });

    const formattedInvoices = invoices.data.map(inv => ({
      id: inv.id,
      date: new Date(inv.created * 1000),
      description: inv.lines.data[0]?.description || 'Subscription',
      amount: inv.amount_paid,
      status: inv.status,
      invoiceUrl: inv.hosted_invoice_url,
      invoicePdf: inv.invoice_pdf
    }));
    
    res.json({ invoices: formattedInvoices });
  } catch (error) {
    logger.error({ err: error, userId: req.user?._id, requestId: req.requestId }, 'Get invoices error');
    res.status(500).json({ error: 'Failed to get invoices' });
  }
});

// @route   POST /api/payments/create-checkout-session
// @desc    Create Stripe checkout session for new subscription
// @access  Private
router.post('/create-checkout-session', protect, async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Payment system not configured' });
  }
  
  try {
    const { plan } = req.body;
    
    if (!PRICE_IDS[plan]) {
      return res.status(400).json({ error: 'Invalid plan selected' });
    }
    
    const user = await User.findById(req.user._id);
    
    // Create or get Stripe customer
    let customerId = user.subscription?.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        metadata: {
          userId: user._id.toString()
        }
      });
      customerId = customer.id;
      await User.findByIdAndUpdate(user._id, { 'subscription.stripeCustomerId': customerId });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{
        price: PRICE_IDS[plan],
        quantity: 1
      }],
      mode: 'subscription',
      success_url: `${process.env.CLIENT_URL || 'https://counselorready.com'}/subscription.html?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || 'https://counselorready.com'}/subscription.html?canceled=true`,
      metadata: {
        userId: user._id.toString(),
        plan
      },
      subscription_data: {
        metadata: {
          userId: user._id.toString(),
          plan
        }
      }
    });
    
    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    logger.error({ err: error, userId: req.user?._id, requestId: req.requestId }, 'Create checkout session error');
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// @route   POST /api/payments/create-subscription
// @desc    Create subscription with inline card payment (supports coupons)
// @access  Private
router.post('/create-subscription', protect, async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Payment system not configured' });
  }
  
  try {
    const { paymentMethodId, priceId, couponCode } = req.body;
    
    if (!paymentMethodId || !priceId) {
      return res.status(400).json({ error: 'Payment method and price ID required' });
    }
    
    const user = await User.findById(req.user._id);
    
    // Determine plan from priceId
    let plan = null;
    for (const [key, value] of Object.entries(PRICE_IDS)) {
      if (value === priceId) {
        plan = key;
        break;
      }
    }
    
    if (!plan) {
      return res.status(400).json({ error: 'Invalid price ID' });
    }
    
    // Create or get Stripe customer
    let customerId = user.subscription?.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim() || user.email,
        metadata: {
          userId: user._id.toString()
        }
      });
      customerId = customer.id;
      await User.findByIdAndUpdate(user._id, { 'subscription.stripeCustomerId': customerId });
    }
    
    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId
    });
    
    // Set as default payment method
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId
      }
    });
    
    // Build subscription options
    const subscriptionOptions = {
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: {
        payment_method_types: ['card'],
        save_default_payment_method: 'on_subscription'
      },
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        userId: user._id.toString(),
        plan
      }
    };
    
    // Add coupon if provided
    if (couponCode) {
      // Try to find the coupon in Stripe
      try {
        const coupons = await stripe.coupons.list({ limit: 100 });
        const coupon = coupons.data.find(c => 
          c.name?.toUpperCase() === couponCode.toUpperCase() || 
          c.id.toUpperCase() === couponCode.toUpperCase()
        );
        
        if (coupon) {
          subscriptionOptions.coupon = coupon.id;
        } else {
          // Try as promotion code
          const promoCodes = await stripe.promotionCodes.list({
            code: couponCode.toUpperCase(),
            active: true,
            limit: 1
          });
          
          if (promoCodes.data.length > 0) {
            subscriptionOptions.promotion_code = promoCodes.data[0].id;
          }
        }
      } catch (couponErr) {
        logger.info({ err: couponErr, userId: req.user?._id, requestId: req.requestId }, 'Coupon lookup error');
        // Continue without coupon
      }
    }
    
    // Create the subscription
    const subscription = await stripe.subscriptions.create(subscriptionOptions);
    
    // Check if payment needs confirmation
    const invoice = subscription.latest_invoice;
    const paymentIntent = invoice.payment_intent;
    
    if (paymentIntent.status === 'requires_action') {
      return res.json({
        requiresAction: true,
        clientSecret: paymentIntent.client_secret,
        subscriptionId: subscription.id
      });
    }
    
    if (paymentIntent.status === 'succeeded') {
      // Update user subscription
      await User.findByIdAndUpdate(user._id, {
        'subscription.stripeSubscriptionId': subscription.id,
        'subscription.plan': plan,
        'subscription.status': 'active',
        'subscription.priceId': priceId,
        'subscription.currentPeriodStart': new Date(subscription.current_period_start * 1000),
        'subscription.currentPeriodEnd': new Date(subscription.current_period_end * 1000)
      });
      
      return res.json({
        success: true,
        subscription: {
          id: subscription.id,
          plan,
          status: subscription.status
        }
      });
    }
    
    return res.status(400).json({ error: 'Payment failed. Please try again.' });
    
  } catch (error) {
    logger.error({ err: error, userId: req.user?._id, requestId: req.requestId }, 'Create subscription error');
    
    // Handle specific Stripe errors
    if (error.type === 'StripeCardError') {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Failed to create subscription' });
  }
});

// @route   POST /api/payments/create-portal-session
// @desc    Create Stripe customer portal session for managing subscription
// @access  Private
router.post('/create-portal-session', protect, async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Payment system not configured' });
  }
  
  try {
    const user = await User.findById(req.user._id);
    
    if (!user.subscription?.stripeCustomerId) {
      return res.status(400).json({ error: 'No subscription found' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.subscription.stripeCustomerId,
      return_url: `${process.env.CLIENT_URL || 'https://counselorready.com'}/subscription.html`
    });
    
    res.json({ url: session.url });
  } catch (error) {
    logger.error({ err: error, userId: req.user?._id, requestId: req.requestId }, 'Create portal session error');
    res.status(500).json({ error: 'Failed to create portal session' });
  }
});

// @route   POST /api/payments/change-plan
// @desc    Change subscription plan (upgrade/downgrade)
// @access  Private
router.post('/change-plan', protect, async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Payment system not configured' });
  }
  
  try {
    const { plan } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user.subscription?.stripeSubscriptionId) {
      return res.status(400).json({ error: 'No active subscription to change' });
    }

    if (!PRICE_IDS[plan]) {
      return res.status(400).json({ error: 'Invalid plan selected' });
    }

    // Get current subscription
    const subscription = await stripe.subscriptions.retrieve(user.subscription.stripeSubscriptionId);

    // Update subscription with new price
    const updatedSubscription = await stripe.subscriptions.update(user.subscription.stripeSubscriptionId, {
      items: [{
        id: subscription.items.data[0].id,
        price: PRICE_IDS[plan]
      }],
      proration_behavior: 'create_prorations',
      metadata: {
        plan
      }
    });
    
    // Update user record
    await User.findByIdAndUpdate(user._id, {
      'subscription.plan': plan,
      'subscription.priceId': PRICE_IDS[plan]
    });
    
    res.json({ 
      message: `Successfully changed to ${PLAN_DETAILS[plan].name} plan`,
      subscription: {
        plan,
        status: updatedSubscription.status
      }
    });
  } catch (error) {
    logger.error({ err: error, userId: req.user?._id, requestId: req.requestId }, 'Change plan error');
    res.status(500).json({ error: 'Failed to change plan' });
  }
});

// @route   POST /api/payments/cancel-subscription
// @desc    Cancel subscription
// @access  Private
router.post('/cancel-subscription', protect, async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Payment system not configured' });
  }
  
  try {
    const user = await User.findById(req.user._id);
    
    if (!user.subscription?.stripeSubscriptionId) {
      return res.status(400).json({ error: 'No active subscription to cancel' });
    }

    // Cancel at period end (user keeps access until billing period ends)
    const subscription = await stripe.subscriptions.update(user.subscription.stripeSubscriptionId, {
      cancel_at_period_end: true
    });

    await User.findByIdAndUpdate(user._id, {
      'subscription.cancelAtPeriodEnd': true
    });

    res.json({
      message: 'Subscription will be canceled at the end of the billing period',
      cancelAt: new Date(subscription.current_period_end * 1000)
    });
  } catch (error) {
    logger.error({ err: error, userId: req.user?._id, requestId: req.requestId }, 'Cancel subscription error');
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

// @route   POST /api/payments/cancel
// @desc    Cancel subscription (alias)
// @access  Private
router.post('/cancel', protect, async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Payment system not configured' });
  }

  try {
    const user = await User.findById(req.user._id);

    if (!user.subscription?.stripeSubscriptionId) {
      return res.status(400).json({ error: 'No active subscription to cancel' });
    }

    // Cancel at period end (user keeps access until billing period ends)
    const subscription = await stripe.subscriptions.update(user.subscription.stripeSubscriptionId, {
      cancel_at_period_end: true
    });
    
    await User.findByIdAndUpdate(user._id, {
      'subscription.cancelAtPeriodEnd': true
    });
    
    res.json({ 
      message: 'Subscription will be canceled at the end of the billing period',
      cancelAt: new Date(subscription.current_period_end * 1000)
    });
  } catch (error) {
    logger.error({ err: error, userId: req.user?._id, requestId: req.requestId }, 'Cancel subscription error');
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

// @route   POST /api/payments/reactivate
// @desc    Reactivate a canceled subscription
// @access  Private
router.post('/reactivate', protect, async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Payment system not configured' });
  }
  
  try {
    const user = await User.findById(req.user._id);
    
    if (!user.subscription?.stripeSubscriptionId) {
      return res.status(400).json({ error: 'No subscription to reactivate' });
    }

    // Remove cancellation
    await stripe.subscriptions.update(user.subscription.stripeSubscriptionId, {
      cancel_at_period_end: false
    });
    
    await User.findByIdAndUpdate(user._id, {
      'subscription.cancelAtPeriodEnd': false
    });
    
    res.json({ message: 'Subscription reactivated successfully' });
  } catch (error) {
    logger.error({ err: error, userId: req.user?._id, requestId: req.requestId }, 'Reactivate subscription error');
    res.status(500).json({ error: 'Failed to reactivate subscription' });
  }
});

// @route   GET /api/payments/billing-history
// @desc    Get billing history (invoices)
// @access  Private
router.get('/billing-history', protect, async (req, res) => {
  if (!stripe) {
    return res.json({ invoices: [] });
  }
  
  try {
    const user = await User.findById(req.user._id);
    
    if (!user.subscription?.stripeCustomerId) {
      return res.json({ invoices: [] });
    }

    const invoices = await stripe.invoices.list({
      customer: user.subscription.stripeCustomerId,
      status: 'paid',
      limit: 20
    });

    const formattedInvoices = invoices.data.map(inv => ({
      id: inv.id,
      number: inv.number,
      amount: inv.amount_paid / 100,
      currency: inv.currency,
      status: inv.status,
      date: new Date(inv.created * 1000),
      pdfUrl: inv.invoice_pdf,
      hostedUrl: inv.hosted_invoice_url,
      description: inv.lines.data[0]?.description || 'Subscription'
    }));
    
    res.json({ invoices: formattedInvoices });
  } catch (error) {
    logger.error({ err: error, userId: req.user?._id, requestId: req.requestId }, 'Get billing history error');
    res.status(500).json({ error: 'Failed to get billing history' });
  }
});

// ============================================
// COURSE CHECKOUT (one-time purchase)
// ============================================

// @route   POST /api/payments/create-course-checkout
// @desc    Create a one-time Stripe checkout for a paid course
// @access  Private
router.post('/create-course-checkout', protect, async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Payment system not configured' });
  }

  try {
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ error: 'courseId is required' });
    }

    const course = await mongoose.connection.db
      .collection('interactivecourses')
      .findOne({ _id: new mongoose.Types.ObjectId(courseId) });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.accessType === 'free') {
      return res.status(400).json({ error: 'Course is free' });
    }

    // ── If partner-owned course: route through Connect destination charge ──
    const isPartnerCourse = !!course.partnerId;
    let connectAccountId = null;
    let applicationFeeAmount = null;

    if (isPartnerCourse) {
      const coursePartner = await Partner.findById(course.partnerId)
        .select('billing.connectAccountId billing.connectOnboardingComplete').lean();
      if (!coursePartner?.billing?.connectAccountId || !coursePartner?.billing?.connectOnboardingComplete) {
        return res.status(402).json({
          error: 'This course is not yet available for purchase — provider has not completed payment setup.',
          code: 'CONNECT_NOT_READY'
        });
      }
      connectAccountId = coursePartner.billing.connectAccountId;
      applicationFeeAmount = Math.round(course.price * 100 * 0.15); // CR's 15%
    }

    const user = await User.findById(req.user._id);

    // Create or get Stripe customer
    let customerId = user.subscription?.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        metadata: {
          userId: user._id.toString()
        }
      });
      customerId = customer.id;
      await User.findByIdAndUpdate(user._id, { 'subscription.stripeCustomerId': customerId });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(course.price * 100),
          product_data: {
            name: course.title,
            description: course.ceHours + ' CE Hours'
          }
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL || 'https://counselorready.com'}/checkout-success.html?session_id={CHECKOUT_SESSION_ID}&slug=${course.slug || ''}&name=${encodeURIComponent(course.title || '')}`,
      cancel_url: `${process.env.CLIENT_URL || 'https://counselorready.com'}/course-details.html?slug=${course.slug || ''}&cancelled=true`,
      metadata: {
        type: 'course_purchase',
        courseId: course._id.toString(),
        userId: req.user._id.toString(),
        slug: course.slug || '',
        partnerId: course.partnerId?.toString() || ''
      },
      ...(connectAccountId ? {
        payment_intent_data: {
          application_fee_amount: applicationFeeAmount,
          transfer_data: { destination: connectAccountId }
        }
      } : {})
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    logger.error({ err: error, userId: req.user?._id, requestId: req.requestId }, 'Create course checkout error');
    res.status(500).json({ error: 'Failed to create course checkout session' });
  }
});

// ============================================
// STRIPE WEBHOOK
// ============================================

// @route   POST /api/payments/webhook
// @desc    Handle Stripe webhooks
// @access  Public (verified by Stripe signature)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Payment system not configured' });
  }
  
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  let event;
  
  try {
    event = constructStripeEvent(stripe, req.body, sig, webhookSecret);
  } catch (err) {
    logger.error({ err, requestId: req.requestId }, 'Webhook signature verification failed');
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan;
        const purchaseType = session.metadata?.type;
        const partnerId = session.metadata?.partnerId;

        // Handle partner add-on purchase (must precede partner-plan block)
        if (purchaseType === 'addon_purchase' && partnerId) {
          const ak = session.metadata?.addonKey;
          if (ak) {
            const keys = ak === 'bundle'
              ? ['certTracking', 'credentialManagement', 'complianceTracking', 'clinicalTools']
              : [ak];
            const addonUpdate = {};
            for (const k of keys) {
              addonUpdate[`premiumAddons.${k}.enabled`] = true;
              addonUpdate[`premiumAddons.${k}.enabledAt`] = new Date();
            }
            await Partner.findByIdAndUpdate(partnerId, addonUpdate);
            bustAddonCache(partnerId);
            logger.info({ partnerId, addonKey: ak, requestId: req.requestId }, 'Partner addon enabled via checkout');
          }
          break;
        }

        // Handle partner subscription checkout
        if (partnerId && plan) {
          await Partner.findByIdAndUpdate(partnerId, {
            'billing.stripeSubscriptionId': session.subscription,
            'billing.plan': plan,
            'billing.status': 'active',
            'billing.currentPeriodEnd': new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          });
          logger.info({ partnerId, plan, requestId: req.requestId }, 'Partner subscription activated');
          break;
        }

        // Handle individual course purchases
        if (session.metadata?.type === 'course_purchase') {
          const { courseId, userId: purchaseUserId, slug } = session.metadata;

          await User.findByIdAndUpdate(purchaseUserId, {
            $addToSet: {
              purchasedCourses: {
                courseId: new mongoose.Types.ObjectId(courseId),
                slug: slug,
                purchasedAt: new Date(),
                amount: session.amount_total / 100,
                stripeSessionId: session.id
              }
            }
          });

          logger.info({ userId: purchaseUserId, slug, requestId: req.requestId, action: 'course_purchase_recorded' }, 'Course purchase recorded');

          // [MARKETPLACE] Record syndication commission (15/85 split) if this sale qualifies.
          // Fire-and-forget; the helper never throws, but we guard anyway so it can never
          // affect the purchase outcome.
          (async () => {
            try {
              const [synCourse, synBuyer] = await Promise.all([
                mongoose.connection.db.collection('interactivecourses')
                  .findOne({ _id: new mongoose.Types.ObjectId(courseId) }),
                User.findById(purchaseUserId).select('_id partnerId').lean()
              ]);
              const entry = await recordSyndicationCommission({
                course: synCourse,
                buyer: synBuyer,
                grossAmount: (session.amount_total || 0) / 100,
                saleId: session.id,
                paymentIntentId: session.payment_intent
              });
              if (entry) {
                logger.info({ userId: purchaseUserId, slug, ledgerId: entry._id?.toString(), category: entry.accountingCategory, requestId: req.requestId, action: 'syndication_commission_recorded' }, '[MARKETPLACE] syndication commission recorded');
              }
            } catch (err) {
              logger.error({ err, userId: purchaseUserId, requestId: req.requestId }, '[MARKETPLACE] syndication commission record failed');
            }
          })();

          const buyer = await User.findById(purchaseUserId).select('email profile.firstName');
          logActivity(ACTIVITY_TYPES.PAYMENT_SUCCEEDED, {
            courseId,
            amount: session.amount_total,
            type: 'course_purchase'
          }, {
            userId: purchaseUserId,
            userName: buyer?.profile?.firstName || '',
            userEmail: buyer?.email || ''
          }).catch(() => {});

          // [REWARDS] Referral paid conversion — fire-and-forget, dedup'd server-side
          processReferralPaidConversion(purchaseUserId)
            .then(r => {
              if (r.referrerAwarded) {
                logger.info({ userId: purchaseUserId, points: r.points, action: 'referral_paid_conversion' }, '[REWARDS] referrer awarded paid conversion');
              }
            })
            .catch(err => logger.error({ err, userId: purchaseUserId, requestId: req.requestId }, '[REWARDS] referral paid conversion failed'));

          // SMS notification (fire-and-forget)
          if (twilioClient && process.env.ADMIN_PHONE) {
            twilioClient.messages.create({
              body: `CounselorReady: Payment\n${buyer?.email} paid for "${slug}"`,
              from: process.env.TWILIO_PHONE_NUMBER,
              to: process.env.ADMIN_PHONE
            }).catch(e => logger.error({ err: e, userId: purchaseUserId, requestId: req.requestId }, 'SMS course purchase notification error'));
          }
          break;
        }

        // AI credit pack purchase
        if (session.metadata?.type === 'ai_credits') {
          const aiPartnerId = session.metadata.partnerId;
          const aiHours = Number(session.metadata.hours);
          if (aiPartnerId && aiHours > 0) {
            const aiPartner = await Partner.findById(aiPartnerId);
            if (aiPartner) {
              // Guard against double-credit on Stripe retries
              const alreadyCredited = aiPartner.aiUsage?.creditedSessions?.includes(session.id);
              if (!alreadyCredited) {
                const { addPurchasedHours } = await import('../utils/aiBudget.js');
                addPurchasedHours(aiPartner, aiHours);
                if (!aiPartner.aiUsage) aiPartner.aiUsage = {};
                if (!aiPartner.aiUsage.creditedSessions) aiPartner.aiUsage.creditedSessions = [];
                aiPartner.aiUsage.creditedSessions.push(session.id);
                await aiPartner.save();
                logger.info({ partnerId: aiPartnerId, hours: aiHours, sessionId: session.id, requestId: req.requestId }, 'AI credits added to partner');
              }
            }
          }
          break;
        }

        // Partner course ACEP review fee payment
        if (session.metadata?.type === 'course_review') {
          const reviewCourseId = session.metadata.courseId;
          if (reviewCourseId) {
            const reviewCourse = await InteractiveCourse.findById(reviewCourseId);
            if (reviewCourse && reviewCourse.reviewStatus === 'none') {
              reviewCourse.reviewStatus      = 'requested';
              reviewCourse.reviewPaidAt      = new Date();
              reviewCourse.reviewRequestedAt = new Date();
              reviewCourse.reviewFeeCents    = session.amount_total ?? reviewCourse.reviewFeeCents;
              await reviewCourse.save();
              logger.info({ courseId: reviewCourseId, sessionId: session.id, requestId: req.requestId }, 'Course review fee paid');
            }
          }
          break;
        }

        // Live session seat purchase
        if (session.metadata?.type === 'live-session') {
          const { liveSessionId, userId: liveUserId } = session.metadata;
          const LiveSession = (await import('../models/LiveSession.js')).default;
          const live = await LiveSession.findById(liveSessionId);
          if (live && !live.isRegistered(liveUserId)) {
            live.registrants.push({
              user: liveUserId,
              paid: true,
              stripeCheckoutSessionId: session.id
            });
            await live.save();
            logger.info({ liveSessionId, userId: liveUserId, requestId: req.requestId }, 'Live session seat purchased');
          }
          break;
        }

        // Session series seat purchase — mirrors the live-session branch, but
        // fulfills across every member session per the series' autoEnroll policy
        // (set when the checkout was created in routes/sessionSeries.js). The
        // already-registered guard makes this idempotent on Stripe retries.
        if (session.metadata?.type === 'session-series') {
          const { seriesId, userId: seriesUserId } = session.metadata;
          const SessionSeries = (await import('../models/SessionSeries.js')).default;
          const LiveSession = (await import('../models/LiveSession.js')).default;
          const series = await SessionSeries.findById(seriesId);
          if (series) {
            // Same member resolution as sessionSeries.js register:
            //  'all'          → every member session
            //  'all-required' → members where seriesMembership.required !== false
            //  'manual'       → never reaches Stripe (register returns 400)
            const memberSessions = series.autoEnroll === 'all'
              ? await LiveSession.find({ seriesId: series._id })
              : await LiveSession.find({
                  seriesId: series._id,
                  'seriesMembership.required': { $ne: false }
                });

            let enrolledCount = 0;
            for (const sess of memberSessions) {
              const already = sess.registrants.some(
                r => r.user && r.user.toString() === seriesUserId.toString()
              );
              if (already) continue;
              sess.registrants.push({ user: seriesUserId, registeredAt: new Date(), paid: true });
              await sess.save();
              enrolledCount++;
            }
            logger.info({ seriesId, userId: seriesUserId, enrolledCount, requestId: req.requestId }, 'Session series purchased — member sessions enrolled');

            const seriesBuyer = await User.findById(seriesUserId).select('email profile.firstName');
            logActivity(ACTIVITY_TYPES.PAYMENT_SUCCEEDED, {
              seriesId,
              amount: session.amount_total,
              type: 'session-series'
            }, {
              userId: seriesUserId,
              userName: seriesBuyer?.profile?.firstName || '',
              userEmail: seriesBuyer?.email || ''
            }).catch(() => {});
          }
          break;
        }

        // Handle subscription purchase
        // Resolve plan from metadata; fall back to price ID lookup so sessions
        // created before subscription_data.metadata was wired still activate correctly.
        let resolvedPlan = plan;
        if (!resolvedPlan && session.subscription) {
          try {
            const sub = await stripe.subscriptions.retrieve(session.subscription);
            const priceId = sub.items?.data?.[0]?.price?.id;
            if (priceId) {
              for (const [key, val] of Object.entries(PRICE_IDS)) {
                if (val === priceId) { resolvedPlan = key; break; }
              }
            }
          } catch (e) {
            logger.warn({ err: e, userId, requestId: req.requestId }, 'checkout.session.completed: price-ID plan fallback failed');
          }
        }

        if (userId && resolvedPlan) {
          await User.findByIdAndUpdate(userId, {
            'subscription.stripeSubscriptionId': session.subscription,
            'subscription.plan': resolvedPlan,
            'subscription.status': 'active',
            'subscription.currentPeriodStart': new Date(),
            'subscription.currentPeriodEnd': new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            'subscription.monthlyAmountCents': session.amount_total || 0
          });
          const subscriber = await User.findById(userId).select('email profile.firstName');
          logActivity(ACTIVITY_TYPES.PAYMENT_SUCCEEDED, {
            plan: resolvedPlan,
            amount: session.amount_total,
            type: 'subscription'
          }, {
            userId,
            userName: subscriber?.profile?.firstName || '',
            userEmail: subscriber?.email || ''
          }).catch(() => {});
          logger.info({ userId, plan: resolvedPlan, requestId: req.requestId, action: 'subscription_activated' }, 'Subscription activated');

          // SMS: new subscription
          if (twilioClient && process.env.ADMIN_PHONE) {
            const amount = session.amount_total ? `$${(session.amount_total / 100).toFixed(2)}` : 'discounted';
            twilioClient.messages.create({
              body: `CounselorReady: New Subscription\n${subscriber?.email}\nPlan: ${resolvedPlan} · ${amount}/mo`,
              from: process.env.TWILIO_PHONE_NUMBER,
              to: process.env.ADMIN_PHONE
            }).catch(e => logger.error({ err: e, userId, requestId: req.requestId }, 'SMS subscription notification error'));
          }

          // [REWARDS] Referral paid conversion (subscription) — fire-and-forget, dedup'd
          processReferralPaidConversion(userId)
            .then(r => {
              if (r.referrerAwarded) {
                logger.info({ userId, points: r.points, action: 'referral_subscription_conversion' }, '[REWARDS] referrer awarded subscription conversion');
              }
            })
            .catch(err => logger.error({ err, userId, requestId: req.requestId }, '[REWARDS] referral paid (sub) failed'));
        }
        break;
      }
      
      case 'charge.refunded': {
        // [MARKETPLACE] Reduce/void the matching commission on refund (partial-aware);
        // flag clawback if already paid out.
        const charge = event.data.object;
        const pi = typeof charge.payment_intent === 'string' ? charge.payment_intent : charge.payment_intent?.id;
        if (pi) {
          try {
            const adj = await applyRefundToCommission(pi, (charge.amount_refunded || 0) / 100, (charge.amount || 0) / 100);
            if (adj) {
              logger.info({ paymentIntent: pi, ledgerId: adj._id?.toString(), status: adj.status, clawbackRequired: adj.clawbackRequired, clawbackAmount: adj.clawbackAmount, requestId: req.requestId, action: 'syndication_commission_refunded' }, '[MARKETPLACE] syndication commission adjusted on refund');
            }
          } catch (err) {
            logger.error({ err, paymentIntent: pi, requestId: req.requestId }, '[MARKETPLACE] syndication commission refund-adjust failed');
          }
        }
        break;
      }
      
      case 'charge.dispute.created': {
        // [MARKETPLACE] A chargeback reverses the full charge — void the commission and flag
        // clawback if it was already paid out.
        const dispute = event.data.object;
        const pi = typeof dispute.payment_intent === 'string' ? dispute.payment_intent : dispute.payment_intent?.id;
        if (pi) {
          try {
            const voided = await voidSyndicationCommissionByPaymentIntent(pi);
            if (voided) {
              logger.info({ paymentIntent: pi, ledgerId: voided._id?.toString(), clawbackRequired: voided.clawbackRequired, clawbackAmount: voided.clawbackAmount, requestId: req.requestId, action: 'syndication_commission_disputed' }, '[MARKETPLACE] syndication commission voided on dispute/chargeback');
            }
          } catch (err) {
            logger.error({ err, paymentIntent: pi, requestId: req.requestId }, '[MARKETPLACE] syndication commission dispute-void failed');
          }
        }
        break;
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const userId = subscription.metadata?.userId;
        const partnerId = subscription.metadata?.partnerId;

        // Stripe API 2025-12-15+ moved current_period_* from the subscription object
        // to the subscription ITEM. Read item-level first; fall back to the legacy
        // top-level field so this is correct across API versions.
        const item = subscription.items?.data?.[0];
        const rawStart = item?.current_period_start ?? subscription.current_period_start;
        const rawEnd   = item?.current_period_end   ?? subscription.current_period_end;

        // Partner subscription update
        if (partnerId) {
          const partnerUpdate = {
            'billing.status': subscription.status === 'active' ? 'active' : subscription.status
          };
          if (Number.isFinite(rawEnd)) {
            partnerUpdate['billing.currentPeriodEnd'] = new Date(rawEnd * 1000);
          }
          await Partner.findByIdAndUpdate(partnerId, partnerUpdate);
          logger.info({ partnerId, status: subscription.status, requestId: req.requestId }, 'Partner subscription updated');
        }

        // Resolve the user: prefer metadata.userId, fall back to stripeCustomerId.
        let resolvedUser = null;
        if (userId) {
          resolvedUser = await User.findById(userId).select('_id email profile.firstName subscription.plan').catch(() => null);
        }
        if (!resolvedUser) {
          resolvedUser = await User.findOne({ 'subscription.stripeCustomerId': subscription.customer }).select('_id email profile.firstName subscription.plan');
        }

        if (resolvedUser) {
          const userUpdate = {
            'subscription.status': subscription.status,
            'subscription.cancelAtPeriodEnd': subscription.cancel_at_period_end
          };
          if (Number.isFinite(rawStart)) {
            userUpdate['subscription.currentPeriodStart'] = new Date(rawStart * 1000);
          }
          if (Number.isFinite(rawEnd)) {
            userUpdate['subscription.currentPeriodEnd'] = new Date(rawEnd * 1000);
          }
          await User.findByIdAndUpdate(resolvedUser._id, userUpdate);
          // Notify admin when a new subscription becomes active
          if (subscription.status === 'active') {
            logActivity(ACTIVITY_TYPES.SUBSCRIPTION_STARTED, {
              plan: subscription.metadata?.plan || 'unknown',
              status: subscription.status
            }, {
              userId: resolvedUser._id,
              userName: resolvedUser?.profile?.firstName || '',
              userEmail: resolvedUser?.email || ''
            }).catch(() => {});
          }
          try {
            if (global.posthog) {
              global.posthog.capture({
                distinctId: resolvedUser._id.toString(),
                event: 'subscription_activated',
                properties: {
                  plan: subscription.metadata?.plan || 'unknown',
                  status: subscription.status,
                  stripeSubscriptionId: subscription.id
                }
              });
            }
          } catch (phErr) { logger.error({ err: phErr, userId: resolvedUser._id, requestId: req.requestId }, 'PostHog subscription_activated failed'); }
          logger.info({ userId: resolvedUser._id, status: subscription.status, requestId: req.requestId, action: 'subscription_updated' }, 'Subscription updated');
        } else {
          logger.warn({ customerId: subscription.customer, userId, requestId: req.requestId }, 'subscription.updated: no user found; acknowledging 200 to stop retries');
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const userId = subscription.metadata?.userId;
        const partnerId = subscription.metadata?.partnerId;

        // Partner add-on subscription canceled (must precede plan-cancel block)
        if (subscription.metadata?.type === 'addon' && partnerId) {
          const ak = subscription.metadata?.addonKey;
          if (ak) {
            const keys = ak === 'bundle'
              ? ['certTracking', 'credentialManagement', 'complianceTracking', 'clinicalTools']
              : [ak];
            const addonUpdate = {};
            for (const k of keys) {
              addonUpdate[`premiumAddons.${k}.enabled`] = false;
            }
            await Partner.findByIdAndUpdate(partnerId, addonUpdate);
            bustAddonCache(partnerId);
            logger.info({ partnerId, addonKey: ak, requestId: req.requestId }, 'Partner addon disabled via subscription cancellation');
          }
          break;
        }

        // Partner subscription canceled
        if (partnerId) {
          await Partner.findByIdAndUpdate(partnerId, {
            'billing.plan': 'free',
            'billing.status': 'canceled',
            'billing.stripeSubscriptionId': null
          });
          logger.info({ partnerId, requestId: req.requestId }, 'Partner subscription canceled');
        }

        // User subscription canceled
        if (userId) {
          const canceledUser = await User.findById(userId).select('email profile.firstName subscription.plan');
          const canceledPlan = canceledUser?.subscription?.plan || 'unknown';
          await User.findByIdAndUpdate(userId, {
            'subscription.plan': 'free',
            'subscription.status': 'canceled',
            'subscription.stripeSubscriptionId': null
          });
          logActivity(ACTIVITY_TYPES.SUBSCRIPTION_CANCELED, {
            plan: canceledPlan
          }, {
            userId,
            userName: canceledUser?.profile?.firstName || '',
            userEmail: canceledUser?.email || ''
          }).catch(() => {});
          try {
            if (global.posthog) {
              global.posthog.capture({
                distinctId: userId.toString(),
                event: 'subscription_canceled',
                properties: {
                  plan: canceledPlan,
                  stripeSubscriptionId: subscription.id
                }
              });
            }
          } catch (phErr) { logger.error({ err: phErr, userId, requestId: req.requestId }, 'PostHog subscription_canceled failed'); }
          logger.info({ userId, requestId: req.requestId, action: 'subscription_canceled' }, 'Subscription canceled');
        }
        break;
      }
      
      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const customerId = invoice.customer;
        
        const user = await User.findOne({ 'subscription.stripeCustomerId': customerId });
        if (user) {
          await User.findByIdAndUpdate(user._id, {
            'subscription.status': 'past_due',
            'subscription.paymentFailedAt': new Date(),
            $inc: { 'subscription.paymentFailureCount': 1 }
          });
          logger.info({ userId: user._id, requestId: req.requestId, action: 'payment_failed' }, 'Payment failed');
          // Notify admin of payment failure
          logActivity(ACTIVITY_TYPES.PAYMENT_FAILED, {
            plan: user.subscription?.plan || 'unknown'
          }, {
            userId: user._id,
            userName: user.profile?.firstName || '',
            userEmail: user.email || ''
          }).catch(() => {});
          // Send email notification about failed payment to user
          try {
            await sendPaymentFailedEmail(user._id);
          } catch (emailErr) {
            logger.error({ err: emailErr, userId: user._id, requestId: req.requestId }, 'Failed to send payment failure email');
          }
        } else {
          // [PARTNER] Partner subscription invoice failed → mark the partner past_due
          const partner = await Partner.findOne({ 'billing.stripeCustomerId': customerId });
          if (partner) {
            await Partner.findByIdAndUpdate(partner._id, { 'billing.status': 'past_due' });
            logger.info({ partnerId: partner._id, requestId: req.requestId, action: 'partner_payment_failed' }, 'Partner subscription payment failed');
          }
        }
        break;
      }
      
      case 'invoice.paid': {
        const invoice = event.data.object;
        const customerId = invoice.customer;

        const user = await User.findOne({ 'subscription.stripeCustomerId': customerId });
        if (user) {
          const wasRecovery = user.subscription?.status === 'past_due';
          const updateFields = {
            'subscription.status': 'active',
            'subscription.currentPeriodEnd': new Date(invoice.lines.data[0]?.period?.end * 1000 || Date.now() + 30 * 24 * 60 * 60 * 1000),
            'subscription.monthlyAmountCents': invoice.amount_paid || 0
          };

          if (wasRecovery) {
            updateFields['subscription.paymentRecoveredAt'] = new Date();
            updateFields['subscription.paymentFailedAt'] = null;
            updateFields['subscription.paymentFailureCount'] = 0;
          }

          await User.findByIdAndUpdate(user._id, updateFields);
          logger.info({ userId: user._id, wasRecovery, requestId: req.requestId, action: 'invoice_paid' }, 'Invoice paid');

          if (wasRecovery) {
            await sendPaymentRecoveredEmail(user._id);
          }
        } else {
          // [PARTNER] Partner subscription renewed/recovered → keep active + refresh period end
          const partner = await Partner.findOne({ 'billing.stripeCustomerId': customerId });
          if (partner) {
            await Partner.findByIdAndUpdate(partner._id, {
              'billing.status': 'active',
              'billing.currentPeriodEnd': new Date((invoice.lines.data[0]?.period?.end || 0) * 1000 || Date.now() + 30 * 24 * 60 * 60 * 1000)
            });
            logger.info({ partnerId: partner._id, requestId: req.requestId, action: 'partner_invoice_paid' }, 'Partner subscription invoice paid');
          }
        }
        break;
      }
      
      case 'account.updated': {
        const account = event.data.object;
        const partnerId = account.metadata?.partnerId;
        if (!partnerId) break;
        if (account.charges_enabled) {
          await Partner.findByIdAndUpdate(partnerId, {
            'billing.connectOnboardingComplete': true,
            'billing.connectAccountId': account.id
          });
          logger.info({ partnerId, accountId: account.id, requestId: req.requestId }, 'Connect account charges enabled');
        }
        break;
      }

      default:
        logger.info({ eventType: event.type, requestId: req.requestId }, 'Unhandled Stripe event type');
    }
    
    res.json({ received: true });
  } catch (error) {
    logger.error({ err: error, requestId: req.requestId }, 'Webhook handler error');
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

// ============================================
// PROMO CODES
// ============================================

// @route   POST /api/payments/apply-promo
// @desc    Apply a promo code to checkout
// @access  Private
router.post('/apply-promo', protect, async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Payment system not configured' });
  }
  
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Promo code required' });
    }
    
    // Look up promotion code in Stripe
    const promoCodes = await stripe.promotionCodes.list({
      code: code.toUpperCase(),
      active: true,
      limit: 1
    });
    
    if (promoCodes.data.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired promo code' });
    }
    
    const promoCode = promoCodes.data[0];
    const coupon = await stripe.coupons.retrieve(promoCode.coupon.id);
    
    res.json({
      valid: true,
      promoCodeId: promoCode.id,
      discount: {
        type: coupon.percent_off ? 'percent' : 'fixed',
        value: coupon.percent_off || coupon.amount_off / 100,
        name: coupon.name || code.toUpperCase()
      }
    });
  } catch (error) {
    logger.error({ err: error, userId: req.user?._id, requestId: req.requestId }, 'Apply promo code error');
    res.status(500).json({ error: 'Failed to apply promo code' });
  }
});

// ============================================
// INDIVIDUAL COURSE PURCHASE ROUTES
// ============================================

// @route   POST /api/payments/validate-coupon
// @desc    Validate a coupon/promo code and return discount info for course purchase
// @access  Private
router.post('/validate-coupon', protect, async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ valid: false, error: 'Payment system not configured' });
  }

  try {
    const { code, courseId, price } = req.body;

    if (!code) {
      return res.status(400).json({ valid: false, error: 'No code provided' });
    }

    // Look up promotion code in Stripe
    const promotionCodes = await stripe.promotionCodes.list({
      code: code.toUpperCase(),
      active: true,
      limit: 1
    });

    if (!promotionCodes.data.length) {
      return res.status(400).json({ valid: false, error: 'Invalid or expired code' });
    }

    const promo = promotionCodes.data[0];
    const coupon = promo.coupon;

    // Calculate discount
    let discountDescription = '';
    let finalPrice = price || 0;

    if (coupon.percent_off) {
      discountDescription = `${coupon.percent_off}% off`;
      finalPrice = price * (1 - coupon.percent_off / 100);
    } else if (coupon.amount_off) {
      const amountOff = coupon.amount_off / 100; // Stripe stores in cents
      discountDescription = `$${amountOff} off`;
      finalPrice = Math.max(0, price - amountOff);
    }

    res.json({
      valid: true,
      message: 'Discount code applied!',
      discountDescription,
      finalPrice: Math.round(finalPrice * 100) / 100,
      couponId: coupon.id
    });
  } catch (error) {
    logger.error({ err: error, userId: req.user?._id, requestId: req.requestId }, 'Validate coupon error');
    res.status(500).json({ valid: false, error: 'Failed to validate code' });
  }
});

// POST /purchase-course — Stripe Checkout for one-time course purchase
router.post('/purchase-course', protect, async (req, res) => {
  try {
    const { courseId, couponCode } = req.body;
    if (!courseId) {
      return res.status(400).json({ error: 'courseId is required' });
    }

    const course = await mongoose.connection.db
      .collection('interactivecourses')
      .findOne({ _id: new mongoose.Types.ObjectId(courseId) });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (!course.price || course.price <= 0) {
      return res.status(400).json({ error: 'This course is free — no purchase needed' });
    }

    const user = await User.findById(req.user._id);
    const alreadyPurchased = (user.purchasedCourses || []).some(
      pc => pc.courseId?.toString() === courseId
    );
    if (alreadyPurchased) {
      return res.status(400).json({ error: 'You already own this course' });
    }

    let customerId = user.subscription?.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        metadata: { userId: user._id.toString() }
      });
      customerId = customer.id;
      user.subscription.stripeCustomerId = customerId;
      await user.save();
    }

    const sessionParams = {
      customer: customerId,
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(course.price * 100),
          product_data: {
            name: course.title,
            description: course.description || `${course.ceHours || 0} CE Hours`,
            metadata: { courseId: courseId, slug: course.slug }
          }
        },
        quantity: 1
      }],
      metadata: {
        type: 'course_purchase',
        courseId: courseId,
        userId: user._id.toString(),
        slug: course.slug
      },
      success_url: req.body.successUrl || `${process.env.CLIENT_URL || 'https://counselorready.com'}/purchase-success.html?session_id={CHECKOUT_SESSION_ID}&slug=${course.slug}`,
      cancel_url: `${process.env.CLIENT_URL || 'https://counselorready.com'}/course-details.html?slug=${course.slug}&cancelled=true`
    };

    // Add discount if coupon code provided
    if (couponCode) {
      try {
        const promotionCodes = await stripe.promotionCodes.list({
          code: couponCode.toUpperCase(),
          active: true,
          limit: 1
        });
        if (promotionCodes.data.length) {
          sessionParams.discounts = [{ promotion_code: promotionCodes.data[0].id }];
        }
      } catch (err) {
        logger.error({ err, userId: req.user?._id, requestId: req.requestId }, 'Coupon lookup error');
        // Continue without discount rather than failing the purchase
      }
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    logger.error({ err: error, userId: req.user?._id, requestId: req.requestId }, 'Purchase course error');
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

router.get('/purchased-courses', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const purchased = (user.purchasedCourses || []).map(pc => ({
      courseId: pc.courseId,
      purchasedAt: pc.purchasedAt,
      amount: pc.amount
    }));
    res.json({ purchased });
  } catch (error) {
    logger.error({ err: error, userId: req.user?._id, requestId: req.requestId }, 'Get purchased courses error');
    res.status(500).json({ error: 'Failed to fetch purchased courses' });
  }
});

// ============================================
// PARTNER ADD-ON PURCHASE
// ============================================

// @route   POST /api/payments/addon-checkout
// @desc    Create Stripe Checkout session for a partner premium add-on
// @access  Partner admin only
const VALID_ADDON_KEYS = ['certTracking', 'credentialManagement', 'complianceTracking', 'clinicalTools', 'bundle'];

router.post('/addon-checkout', protect, requirePartnerAdmin, async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Payment system not configured' });
  }
  try {
    const { addonKey } = req.body;
    if (!VALID_ADDON_KEYS.includes(addonKey)) {
      return res.status(400).json({ error: 'Invalid addonKey' });
    }

    const partner = await Partner.findById(req.user.partnerId);
    if (!partner) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    // Ensure Stripe customer
    let customerId = partner.billing?.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: partner.contact?.email || req.user.email,
        name: partner.name,
        metadata: { partnerId: partner._id.toString() }
      });
      customerId = customer.id;
      partner.billing = partner.billing || {};
      partner.billing.stripeCustomerId = customerId;
      await partner.save();
    }

    const unitAmount = addonKey === 'bundle'
      ? PREMIUM_BUNDLE_PRICE_CENTS
      : PREMIUM_ADDONS[addonKey].monthlyPriceCents;

    const addonName = addonKey === 'bundle'
      ? 'Premium Add-Ons Bundle (All 4)'
      : PREMIUM_ADDONS[addonKey].name;

    const sessionMeta = {
      type: 'addon_purchase',
      partnerId: partner._id.toString(),
      addonKey
    };

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          unit_amount: unitAmount,
          recurring: { interval: 'month' },
          product_data: { name: addonName }
        },
        quantity: 1
      }],
      metadata: sessionMeta,
      subscription_data: { metadata: sessionMeta },
      success_url: `${process.env.CLIENT_URL || 'https://counselorready.com'}/partner-billing.html?addon=${addonKey}&status=success`,
      cancel_url: `${process.env.CLIENT_URL || 'https://counselorready.com'}/partner-billing.html#addons`
    });

    logger.info({ partnerId: partner._id, addonKey, requestId: req.requestId }, 'Addon checkout session created');
    res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    logger.error({ err: error, userId: req.user?._id, requestId: req.requestId }, 'Addon checkout error');
    res.status(500).json({ error: 'Failed to create addon checkout session' });
  }
});

export default router;
