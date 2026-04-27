/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// adminCoupons.js — Admin coupon/promo code management via Stripe

import express from 'express';
import Stripe from 'stripe';
import { protect, requireAdmin } from '../middleware/auth.js';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

const router = express.Router();
const adminOnly = requireAdmin;

// @route   GET /api/admin/coupons
// @desc    List all coupons and promotion codes from Stripe
// @access  Admin
router.get('/', protect, adminOnly, async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Payment system not configured' });
  }

  try {
    // Fetch all promotion codes from Stripe (includes linked coupon data)
    const promoCodes = await stripe.promotionCodes.list({ limit: 100, expand: ['data.coupon'] });

    let totalRedemptions = 0;
    let totalSavings = 0;

    const coupons = promoCodes.data.map(pc => {
      const c = pc.coupon;
      totalRedemptions += c.times_redeemed || 0;

      // Estimate savings (rough: redemptions * discount value)
      if (c.percent_off) {
        // Can't calculate exact dollar savings for percentage coupons without invoice data
      } else if (c.amount_off) {
        totalSavings += (c.amount_off / 100) * (c.times_redeemed || 0);
      }

      return {
        promoCodeId: pc.id,
        couponId: c.id,
        code: pc.code,
        name: c.name || '',
        active: pc.active,
        percentOff: c.percent_off || null,
        amountOff: c.amount_off || null,
        currency: c.currency || 'usd',
        duration: c.duration,
        durationMonths: c.duration_in_months || null,
        timesRedeemed: c.times_redeemed || 0,
        maxRedemptions: pc.max_redemptions || null,
        expiresAt: pc.expires_at || null,
        created: pc.created
      };
    });

    const active = coupons.filter(c => c.active).length;

    res.json({
      coupons,
      stats: {
        total: coupons.length,
        active,
        totalRedemptions,
        totalSavings
      }
    });
  } catch (error) {
    console.error('Load coupons error:', error);
    res.status(500).json({ error: 'Failed to load coupons' });
  }
});

// @route   POST /api/admin/coupons
// @desc    Create a new coupon + promotion code in Stripe
// @access  Admin
router.post('/', protect, adminOnly, async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Payment system not configured' });
  }

  try {
    const {
      code,
      name,
      discountType,
      discountValue,
      duration,
      durationMonths,
      maxRedemptions,
      expiresAt,
      firstTimeOnly,
      appliesTo
    } = req.body;

    if (!code || !discountType || !discountValue) {
      return res.status(400).json({ error: 'Code, discount type, and discount value are required' });
    }

    // Build the Stripe coupon params
    const couponParams = {
      duration: duration || 'once'
    };

    if (name) couponParams.name = name;

    if (discountType === 'percent') {
      if (discountValue < 1 || discountValue > 100) {
        return res.status(400).json({ error: 'Percentage must be between 1 and 100' });
      }
      couponParams.percent_off = discountValue;
    } else {
      // Fixed amount — Stripe expects cents
      couponParams.amount_off = Math.round(discountValue * 100);
      couponParams.currency = 'usd';
    }

    if (duration === 'repeating') {
      couponParams.duration_in_months = durationMonths || 3;
    }

    // Create the coupon in Stripe
    const coupon = await stripe.coupons.create(couponParams);

    // Build promotion code params (the user-facing code)
    const promoParams = {
      coupon: coupon.id,
      code: code.toUpperCase()
    };

    if (maxRedemptions) promoParams.max_redemptions = maxRedemptions;
    if (expiresAt) promoParams.expires_at = Math.floor(new Date(expiresAt).getTime() / 1000);
    if (firstTimeOnly) promoParams.restrictions = { first_time_transaction: true };

    // Metadata for appliesTo (used for filtering on our side)
    promoParams.metadata = { applies_to: appliesTo || 'all' };

    const promoCode = await stripe.promotionCodes.create(promoParams);

    res.json({
      success: true,
      coupon: {
        promoCodeId: promoCode.id,
        couponId: coupon.id,
        code: promoCode.code,
        name: coupon.name || '',
        active: promoCode.active
      }
    });
  } catch (error) {
    console.error('Create coupon error:', error);

    // Stripe-specific error messages
    if (error.type === 'StripeInvalidRequestError') {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: 'Failed to create coupon' });
  }
});

// @route   PATCH /api/admin/coupons/:promoCodeId
// @desc    Activate or deactivate a promotion code
// @access  Admin
router.patch('/:promoCodeId', protect, adminOnly, async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Payment system not configured' });
  }

  try {
    const { promoCodeId } = req.params;
    const { active } = req.body;

    const promoCode = await stripe.promotionCodes.update(promoCodeId, {
      active: !!active
    });

    res.json({
      success: true,
      promoCodeId: promoCode.id,
      active: promoCode.active
    });
  } catch (error) {
    console.error('Toggle coupon error:', error);
    res.status(500).json({ error: 'Failed to update coupon' });
  }
});

export default router;
