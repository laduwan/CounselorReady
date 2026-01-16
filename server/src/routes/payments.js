import express from 'express';
import Stripe from 'stripe';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

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
  professional: { name: 'Professional', price: 2999, maxCEHours: 999, maxStates: 3 },
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

// @route   POST /api/payments/cancel
// @desc    Cancel subscription
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
        
        if (userId && plan) {
          await User.findByIdAndUpdate(userId, {
            stripeSubscriptionId: session.subscription,
            'subscription.plan': plan,
            'subscription.status': 'active',
            'subscription.currentPeriodStart': new Date(),
            'subscription.currentPeriodEnd': new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          });
          console.log(`Subscription activated for user ${userId}: ${plan}`);
        }
        break;
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const userId = subscription.metadata?.userId;
        
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
            'subscription.status': 'past_due'
          });
          console.log(`Payment failed for user ${user._id}`);
          // TODO: Send email notification about failed payment
        }
        break;
      }
      
      case 'invoice.paid': {
        const invoice = event.data.object;
        const customerId = invoice.customer;
        
        const user = await User.findOne({ stripeCustomerId: customerId });
        if (user) {
          await User.findByIdAndUpdate(user._id, {
            'subscription.status': 'active',
            'subscription.currentPeriodEnd': new Date(invoice.lines.data[0]?.period?.end * 1000 || Date.now() + 30 * 24 * 60 * 60 * 1000)
          });
          console.log(`Invoice paid for user ${user._id}`);
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

export default router;
