/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import express from 'express';
import Stripe from 'stripe';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Partner from '../models/Partner.js';
import { protect } from '../middleware/auth.js';
import { logActivity, ACTIVITY_TYPES } from '../services/activityTrackingService.js';
import { sendPaymentFailedEmail, sendPaymentRecoveredEmail } from '../services/hardshipEmailService.js';

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
    if (user.stripeCustomerId && stripe) {
      try {
        const customer = await stripe.customers.retrieve(user.stripeCustomerId);
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
        console.log('Could not fetch payment method:', e.message);
      }
    }
    
    res.json({ 
      subscription: user.subscription,
      paymentMethod
    });
  } catch (error) {
    console.error('Get subscription error:', error);
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
    
    if (!user.stripeCustomerId) {
      return res.json({ invoices: [] });
    }
    
    // Get invoices from Stripe
    const invoices = await stripe.invoices.list({
      customer: user.stripeCustomerId,
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
    console.error('Get invoices error:', error);
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
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        metadata: {
          userId: user._id.toString()
        }
      });
      customerId = customer.id;
      await User.findByIdAndUpdate(user._id, { stripeCustomerId: customerId });
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
    console.error('Create checkout session error:', error);
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
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim() || user.email,
        metadata: {
          userId: user._id.toString()
        }
      });
      customerId = customer.id;
      await User.findByIdAndUpdate(user._id, { stripeCustomerId: customerId });
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
        console.log('Coupon lookup error:', couponErr.message);
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
        stripeSubscriptionId: subscription.id,
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
    console.error('Create subscription error:', error);
    
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
    
    if (!user.stripeCustomerId) {
      return res.status(400).json({ error: 'No subscription found' });
    }
    
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.CLIENT_URL || 'https://counselorready.com'}/subscription.html`
    });
    
    res.json({ url: session.url });
  } catch (error) {
    console.error('Create portal session error:', error);
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
    
    if (!user.stripeSubscriptionId) {
      return res.status(400).json({ error: 'No active subscription to change' });
    }
    
    if (!PRICE_IDS[plan]) {
      return res.status(400).json({ error: 'Invalid plan selected' });
    }
    
    // Get current subscription
    const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
    
    // Update subscription with new price
    const updatedSubscription = await stripe.subscriptions.update(user.stripeSubscriptionId, {
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
    console.error('Change plan error:', error);
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
    
    if (!user.stripeSubscriptionId) {
      return res.status(400).json({ error: 'No active subscription to cancel' });
    }
    
    // Cancel at period end (user keeps access until billing period ends)
    const subscription = await stripe.subscriptions.update(user.stripeSubscriptionId, {
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
    console.error('Cancel subscription error:', error);
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
    
    if (!user.stripeSubscriptionId) {
      return res.status(400).json({ error: 'No active subscription to cancel' });
    }
    
    // Cancel at period end (user keeps access until billing period ends)
    const subscription = await stripe.subscriptions.update(user.stripeSubscriptionId, {
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
    console.error('Cancel subscription error:', error);
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
    
    if (!user.stripeSubscriptionId) {
      return res.status(400).json({ error: 'No subscription to reactivate' });
    }
    
    // Remove cancellation
    await stripe.subscriptions.update(user.stripeSubscriptionId, {
      cancel_at_period_end: false
    });
    
    await User.findByIdAndUpdate(user._id, {
      'subscription.cancelAtPeriodEnd': false
    });
    
    res.json({ message: 'Subscription reactivated successfully' });
  } catch (error) {
    console.error('Reactivate subscription error:', error);
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
    
    if (!user.stripeCustomerId) {
      return res.json({ invoices: [] });
    }
    
    const invoices = await stripe.invoices.list({
      customer: user.stripeCustomerId,
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
    console.error('Get billing history error:', error);
    res.status(500).json({ error: 'Failed to get billing history' });
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
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
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

        // Handle partner subscription checkout
        if (partnerId && plan) {
          await Partner.findByIdAndUpdate(partnerId, {
            'billing.stripeSubscriptionId': session.subscription,
            'billing.plan': plan,
            'billing.status': 'active',
            'billing.currentPeriodEnd': new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          });
          console.log(`Partner subscription activated for ${partnerId}: ${plan}`);
          break;
        }

        // Handle individual course purchase
        if (purchaseType === 'course_purchase') {
          const courseId = session.metadata?.courseId;
          if (userId && courseId) {
            await User.findByIdAndUpdate(userId, {
              $addToSet: { purchasedCourses: courseId }
            });
            const buyer = await User.findById(userId).select('email profile.firstName');
            logActivity(ACTIVITY_TYPES.PAYMENT_SUCCEEDED, {
              courseId,
              amount: session.amount_total,
              type: 'course_purchase'
            }, {
              userId,
              userName: buyer?.profile?.firstName || '',
              userEmail: buyer?.email || ''
            }).catch(() => {});
            console.log(`Course ${courseId} purchased by user ${userId}`);
          }
          break;
        }

        // Handle subscription purchase
        if (userId && plan) {
          await User.findByIdAndUpdate(userId, {
            stripeSubscriptionId: session.subscription,
            'subscription.plan': plan,
            'subscription.status': 'active',
            'subscription.currentPeriodStart': new Date(),
            'subscription.currentPeriodEnd': new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          });
          const subscriber = await User.findById(userId).select('email profile.firstName');
          logActivity(ACTIVITY_TYPES.PAYMENT_SUCCEEDED, {
            plan,
            amount: session.amount_total,
            type: 'subscription'
          }, {
            userId,
            userName: subscriber?.profile?.firstName || '',
            userEmail: subscriber?.email || ''
          }).catch(() => {});
          console.log(`Subscription activated for user ${userId}: ${plan}`);
        }
        break;
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const userId = subscription.metadata?.userId;
        const partnerId = subscription.metadata?.partnerId;

        // Partner subscription update
        if (partnerId) {
          await Partner.findByIdAndUpdate(partnerId, {
            'billing.status': subscription.status === 'active' ? 'active' : subscription.status,
            'billing.currentPeriodEnd': new Date(subscription.current_period_end * 1000)
          });
          console.log(`Partner subscription updated for ${partnerId}: ${subscription.status}`);
        }

        // User subscription update
        if (userId) {
          await User.findByIdAndUpdate(userId, {
            'subscription.status': subscription.status,
            'subscription.cancelAtPeriodEnd': subscription.cancel_at_period_end,
            'subscription.currentPeriodEnd': new Date(subscription.current_period_end * 1000)
          });
          console.log(`Subscription updated for user ${userId}: ${subscription.status}`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const userId = subscription.metadata?.userId;
        const partnerId = subscription.metadata?.partnerId;

        // Partner subscription canceled
        if (partnerId) {
          await Partner.findByIdAndUpdate(partnerId, {
            'billing.plan': 'free',
            'billing.status': 'canceled',
            'billing.stripeSubscriptionId': null
          });
          console.log(`Partner subscription canceled for ${partnerId}`);
        }

        // User subscription canceled
        if (userId) {
          await User.findByIdAndUpdate(userId, {
            'subscription.plan': 'free',
            'subscription.status': 'canceled',
            stripeSubscriptionId: null
          });
          console.log(`Subscription canceled for user ${userId}`);
        }
        break;
      }
      
      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const customerId = invoice.customer;
        
        const user = await User.findOne({ stripeCustomerId: customerId });
        if (user) {
          await User.findByIdAndUpdate(user._id, {
            'subscription.status': 'past_due',
            'subscription.paymentFailedAt': new Date(),
            $inc: { 'subscription.paymentFailureCount': 1 }
          });
          console.log(`Payment failed for user ${user._id}`);
          // Send email notification about failed payment
          try {
            await sendPaymentFailedEmail(user._id);
          } catch (emailErr) {
            console.error('Failed to send payment failure email:', emailErr.message);
          }
        }
        break;
      }
      
      case 'invoice.paid': {
        const invoice = event.data.object;
        const customerId = invoice.customer;

        const user = await User.findOne({ stripeCustomerId: customerId });
        if (user) {
          const wasRecovery = user.subscription?.status === 'past_due';
          const updateFields = {
            'subscription.status': 'active',
            'subscription.currentPeriodEnd': new Date(invoice.lines.data[0]?.period?.end * 1000 || Date.now() + 30 * 24 * 60 * 60 * 1000)
          };

          if (wasRecovery) {
            updateFields['subscription.paymentRecoveredAt'] = new Date();
            updateFields['subscription.paymentFailedAt'] = null;
            updateFields['subscription.paymentFailureCount'] = 0;
          }

          await User.findByIdAndUpdate(user._id, updateFields);
          console.log(`Invoice paid for user ${user._id}${wasRecovery ? ' (recovered from past_due)' : ''}`);

          if (wasRecovery) {
            await sendPaymentRecoveredEmail(user._id);
          }
        }
        break;
      }
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
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
    console.error('Apply promo code error:', error);
    res.status(500).json({ error: 'Failed to apply promo code' });
  }
});

// ============================================
// INDIVIDUAL COURSE PURCHASE ROUTES
// ============================================

// @route   POST /api/payments/purchase-course
// @desc    Create Stripe checkout session for individual course purchase
// @access  Private
router.post('/purchase-course', protect, async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Payment system not configured' });
  }
  
  try {
    const { courseId } = req.body;
    
    if (!courseId) {
      return res.status(400).json({ error: 'Course ID is required' });
    }
    
    // Get the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    if (!course.price || course.price <= 0) {
      return res.status(400).json({ error: 'This course is not available for individual purchase' });
    }
    
    const user = await User.findById(req.user._id);
    
    // Check if user already purchased this course
    if (user.purchasedCourses && user.purchasedCourses.includes(courseId)) {
      return res.status(400).json({ error: 'You have already purchased this course' });
    }
    
    // Create or get Stripe customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        metadata: {
          userId: user._id.toString()
        }
      });
      customerId = customer.id;
      await User.findByIdAndUpdate(user._id, { stripeCustomerId: customerId });
    }
    
    // Determine URLs based on environment
    const baseUrl = process.env.FRONTEND_URL || 'https://counselorready.com';
    
    // Create checkout session for one-time payment
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: course.title,
              description: `${course.ceuHours || 0} CE Hours - ${course.ceuCategories?.[0]?.category || 'Continuing Education'}`,
              images: course.thumbnail ? [course.thumbnail] : [],
            },
            unit_amount: Math.round(course.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: user._id.toString(),
        courseId: course._id.toString(),
        type: 'course_purchase'
      },
      success_url: `${baseUrl}/course-player.html?slug=${course.slug}&purchased=true`,
      cancel_url: `${baseUrl}/course-details.html?slug=${course.slug}&canceled=true`,
    });
    
    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Purchase course error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// @route   GET /api/payments/purchased-courses
// @desc    Get list of courses user has purchased individually
// @access  Private
router.get('/purchased-courses', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('purchasedCourses', 'title slug thumbnail ceuHours');
    
    res.json({
      purchasedCourses: user.purchasedCourses || []
    });
  } catch (error) {
    console.error('Get purchased courses error:', error);
    res.status(500).json({ error: 'Failed to get purchased courses' });
  }
});

// Handle course purchase webhook (add to your existing webhook handler)
// This should be called from your webhook route when event.type === 'checkout.session.completed'
export async function handleCoursePurchase(session) {
  if (session.metadata?.type !== 'course_purchase') {
    return false;
  }
  
  const userId = session.metadata.userId;
  const courseId = session.metadata.courseId;
  
  if (!userId || !courseId) {
    console.error('Missing userId or courseId in session metadata');
    return false;
  }
  
  try {
    // Add course to user's purchased courses
    await User.findByIdAndUpdate(userId, {
      $addToSet: { purchasedCourses: courseId }
    });
    
    console.log(`Course ${courseId} purchased by user ${userId}`);
    return true;
  } catch (error) {
    console.error('Error processing course purchase:', error);
    return false;
  }
}

export default router;
