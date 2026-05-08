// server/src/routes/rewards.js
//
// CounselorReady Self-Care Rewards Program — API routes
// v1.1 — May 4, 2026
//
// Mounted at /api/rewards in server/src/index.js (alongside auth.js, courses.js, etc.)
//
// Day 1 scope: earn-reflection (the v1.1 addition), balance, referral-link, referrals.
// Day 2 will add: redeem endpoints, redeem-giftcard, admin queue.

import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Redemption from '../models/Redemption.js';
import Stripe from 'stripe';

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

import emailService from '../services/emailService.js';
const { sendRedemptionConfirmation, sendRedemptionAdminAlert } = emailService;

import { tierFromLifetime } from '../services/rewardsService.js';

const router = express.Router();

// ─────────────────────────────────────────────────────────────────
// AUTH MIDDLEWARE
//
// Confirmed against the repo (May 4, 2026):
//   - File:   server/src/middleware/auth.js
//   - Export: protect  (named export, defined at line 10)
//   - Used by: server/src/routes/auth.js (/me, /change-password, etc.)
//
// The middleware verifies the Authorization: Bearer {token} JWT, attaches
// req.user, then calls next() on success or returns 401 on failure.
// ─────────────────────────────────────────────────────────────────
import { protect } from '../middleware/auth.js';

// ─────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────
const POINTS = {
  REFLECTION: 5,
  COURSE_COMPLETION: 75,
  CERTIFICATE: 25,
  COURSE_REVIEW: 25,
  REFERRAL_SIGNUP: 50,
  REFERRAL_PAID: 200,
  REFERRAL_RETENTION: 100,
};

// ─── Day 3: Redemption catalog ───
const REDEMPTION_OPTIONS = {
  stripe_credit_10: { pointsCost: 500,  dollarValue: 10, kind: 'stripe' },
  stripe_credit_25: { pointsCost: 1000, dollarValue: 25, kind: 'stripe' },
  giftcard_25:      { pointsCost: 1500, dollarValue: 25, kind: 'giftcard' },
};

const VALID_VENDORS = [
  'amazon',
  'doordash',
  'celestial_spa_atlanta',
  'wellness_spot_college_park',
  'noir_pearl_smyrna',
  'healing_oasis_augusta',
  'blessed_hands_augusta',
  'hetep_retreat_columbus',
  'honey_pot_macon',
  'culler_massage_macon',
  'odomi_medical_savannah',
];

// ─────────────────────────────────────────────────────────────────
// Helper: build the dedup key for a reflection block
// Format: `${courseId}:${sectionIndex}:${blockIndex}`
// ─────────────────────────────────────────────────────────────────
function reflectionDedupKey(courseId, sectionIndex, blockIndex) {
  return `${courseId}:${sectionIndex}:${blockIndex}`;
}

// ─────────────────────────────────────────────────────────────────
// Helper: append a transaction + adjust balances atomically.
// Use $inc + $push in one update to avoid race conditions.
// ─────────────────────────────────────────────────────────────────
async function awardCredits(userId, amount, type, description, relatedCourseId = null) {
  const update = {
    $inc: {
      'careCredits.balance': amount,
      'careCredits.lifetime': amount > 0 ? amount : 0,   // lifetime never decreases
    },
    $push: {
      'careCredits.transactions': {
        amount,
        type,
        description,
        relatedCourseId,
        createdAt: new Date(),
      },
    },
  };
  return User.findByIdAndUpdate(userId, update, { new: true, select: 'careCredits' });
}

// ─────────────────────────────────────────────────────────────────
// POST /api/rewards/earn-reflection
//
// Fired by the viewer's refCount() function when a reflection textarea
// hits its minLength threshold for the first time on a given block.
//
// Body: { courseId: string, sectionIndex: number, blockIndex: number }
// Returns: { earned: true, points: 5, newBalance: number }   on first-time award
//          { earned: false, reason: 'already_awarded' }      otherwise
//          { earned: false, reason: 'invalid_input' }        on bad body
//
// Idempotent — safe to call repeatedly; only awards once per user × block.
// ─────────────────────────────────────────────────────────────────
router.post('/earn-reflection', protect, async (req, res) => {
  try {
    const { courseId, sectionIndex, blockIndex } = req.body || {};

    // Validate input
    if (
      !courseId ||
      typeof sectionIndex !== 'number' || sectionIndex < 0 ||
      typeof blockIndex !== 'number' || blockIndex < 0
    ) {
      return res.status(400).json({ earned: false, reason: 'invalid_input' });
    }

    // Validate courseId is either a Mongo ObjectId or a slug — accept both.
    // Don't try to look up the course here (extra DB hit not justified for MVP).
    const isValidId = mongoose.Types.ObjectId.isValid(courseId);
    const isPlausibleSlug = /^[a-z0-9][a-z0-9-_]{2,80}$/i.test(courseId);
    if (!isValidId && !isPlausibleSlug) {
      return res.status(400).json({ earned: false, reason: 'invalid_input' });
    }

    const userId = req.user._id || req.user.id;
    const dedupKey = reflectionDedupKey(courseId, sectionIndex, blockIndex);

    // Atomic: only push to reflectionsEarned and award credits if the dedup key isn't there.
    // $addToSet returns the doc with the field updated only if the key wasn't already present.
    // Use a two-step approach because Mongoose can't tell us "did $addToSet actually add anything"
    // in a single round-trip without an aggregate.
    const userBefore = await User.findOneAndUpdate(
      { _id: userId, reflectionsEarned: { $ne: dedupKey } },   // only match if NOT earned yet
      { $addToSet: { reflectionsEarned: dedupKey } },
      { select: 'careCredits.balance' }
    );

    if (!userBefore) {
      // Either user doesn't exist, or reflection was already awarded.
      return res.json({ earned: false, reason: 'already_awarded' });
    }

    // First-time award — credit the points + log transaction
    const updatedUser = await awardCredits(
      userId,
      POINTS.REFLECTION,
      'reflection_submitted',
      `Reflection submitted on ${courseId} §${sectionIndex} block ${blockIndex}`,
      isValidId ? courseId : null
    );

    return res.json({
      earned: true,
      points: POINTS.REFLECTION,
      newBalance: updatedUser?.careCredits?.balance ?? null,
    });
  } catch (err) {
    console.error('[REWARDS] earn-reflection error:', err);
    return res.status(500).json({ earned: false, reason: 'server_error' });
  }
});

// ─────────────────────────────────────────────────────────────────
// GET /api/rewards/balance
//
// Returns the user's current CareCredits balance + lifetime + last 10 transactions.
// Powers the dashboard widget.
// ─────────────────────────────────────────────────────────────────
router.get('/balance', protect, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const user = await User.findById(userId).select('careCredits referralCode').lean();
    if (!user) return res.status(404).json({ error: 'user_not_found' });

    const cc = user.careCredits || { balance: 0, lifetime: 0, transactions: [], redemptions: [] };
    const recentTx = (cc.transactions || [])
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

    return res.json({
      balance: cc.balance || 0,
      lifetime: cc.lifetime || 0,
      tier: tierFromLifetime(cc.lifetime || 0),
      recentTransactions: recentTx,
      referralCode: user.referralCode || null,
    });
  } catch (err) {
    console.error('[REWARDS] balance error:', err);
    return res.status(500).json({ error: 'server_error' });
  }
});

// ─────────────────────────────────────────────────────────────────
// GET /api/rewards/referral-link
//
// Returns the user's referral URL (for copy-to-clipboard on dashboard).
// Generates referralCode if missing (shouldn't happen post-pre-save-hook,
// but defensive).
// ─────────────────────────────────────────────────────────────────
router.get('/referral-link', protect, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const user = await User.findById(userId).select('referralCode');
    if (!user) return res.status(404).json({ error: 'user_not_found' });

    if (!user.referralCode) {
      // Force pre-save to fire to generate one
      await user.save();
    }

    const baseUrl = process.env.PUBLIC_APP_URL || 'https://counselorready.com';
    return res.json({
      referralCode: user.referralCode,
      referralUrl: `${baseUrl}/register?ref=${user.referralCode}`,
    });
  } catch (err) {
    console.error('[REWARDS] referral-link error:', err);
    return res.status(500).json({ error: 'server_error' });
  }
});

// ─────────────────────────────────────────────────────────────────
// GET /api/rewards/referrals
//
// Returns the user's referral history (signed-up / paid / retained).
// ─────────────────────────────────────────────────────────────────
router.get('/referrals', protect, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const user = await User.findById(userId)
      .select('referrals')
      .populate('referrals.userId', 'firstName lastName email createdAt')
      .lean();
    if (!user) return res.status(404).json({ error: 'user_not_found' });

    return res.json({
      referrals: (user.referrals || []).map(r => ({
        userId: r.userId?._id || r.userId,
        userName: r.userId ? `${r.userId.firstName || ''} ${r.userId.lastName || ''}`.trim() : null,
        userEmail: r.userId?.email,
        status: r.status,
        earnedCredits: r.earnedCredits,
        createdAt: r.createdAt,
      })),
    });
  } catch (err) {
    console.error('[REWARDS] referrals error:', err);
    return res.status(500).json({ error: 'server_error' });
  }
});

// ─────────────────────────────────────────────────────────────────
// POST /api/rewards/redeem
// Body: { type: 'stripe_credit_10' | 'stripe_credit_25' | 'giftcard_25', vendor?: string }
// ─────────────────────────────────────────────────────────────────
router.post('/redeem', protect, async (req, res) => {
  try {
    const { type, vendor } = req.body || {};

    // Validate type
    const option = REDEMPTION_OPTIONS[type];
    if (!option) {
      return res.status(400).json({ error: 'Invalid redemption type' });
    }

    // Validate vendor for gift card
    if (option.kind === 'giftcard') {
      if (!vendor || !VALID_VENDORS.includes(vendor)) {
        return res.status(400).json({ error: 'Invalid or missing vendor for gift card' });
      }
    }

    const txType = option.kind === 'giftcard' ? 'redemption_giftcard' : 'redemption_stripe_credit';
    const description = option.kind === 'giftcard'
      ? `Redeemed ${option.pointsCost} MMP for $${option.dollarValue} gift card (${vendor})`
      : `Redeemed ${option.pointsCost} MMP for $${option.dollarValue} subscription credit`;

    // Atomic balance check + deduction
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id, 'careCredits.balance': { $gte: option.pointsCost } },
      {
        $inc: { 'careCredits.balance': -option.pointsCost },
        $push: {
          'careCredits.transactions': {
            amount: -option.pointsCost,
            type: txType,
            description,
            createdAt: new Date(),
          },
        },
      },
      { new: true, select: 'careCredits.balance email profile stripeCustomerId' }
    );

    if (!updatedUser) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Create Redemption record (pending)
    const redemption = await Redemption.create({
      userId: req.user._id,
      type,
      pointsCost: option.pointsCost,
      dollarValue: option.dollarValue,
      vendor: vendor || null,
      stripeCustomerId: updatedUser.stripeCustomerId || null,
      status: 'pending',
    });

    // For Stripe credit: process immediately
    if (option.kind === 'stripe') {
      // Refund helper (used multiple times below)
      const refund = async (reason) => {
        await User.findByIdAndUpdate(req.user._id, {
          $inc: { 'careCredits.balance': option.pointsCost },
          $push: {
            'careCredits.transactions': {
              amount: option.pointsCost,
              type: 'admin_adjustment',
              description: `Refund: ${reason}`,
              relatedRedemptionId: redemption._id,
              createdAt: new Date(),
            },
          },
        });
        await Redemption.findByIdAndUpdate(redemption._id, {
          status: 'cancelled',
          cancelledAt: new Date(),
          cancelReason: reason,
        });
      };

      if (!stripe) {
        await refund('Stripe not configured');
        return res.status(503).json({ error: 'Payment system unavailable. Points refunded.' });
      }

      if (!updatedUser.stripeCustomerId) {
        await refund('No Stripe customer ID');
        return res.status(400).json({
          error: 'No active billing account found. Make a purchase first or subscribe to redeem credit. Points refunded.',
        });
      }

      try {
        const txn = await stripe.customers.createBalanceTransaction(
          updatedUser.stripeCustomerId,
          {
            amount: -option.dollarValue * 100, // negative = credit to customer
            currency: 'usd',
            description: `CounselorReady MMP redemption (${option.pointsCost} MMP)`,
            metadata: {
              redemptionId: redemption._id.toString(),
              userId: req.user._id.toString(),
              pointsCost: option.pointsCost.toString(),
            },
          }
        );

        await Redemption.findByIdAndUpdate(redemption._id, {
          status: 'fulfilled',
          fulfilledAt: new Date(),
          stripeBalanceTransactionId: txn.id,
        });

        // Send confirmation email (fire-and-forget)
        sendRedemptionConfirmation(updatedUser, {
          ...redemption.toObject(),
          status: 'fulfilled',
          stripeBalanceTransactionId: txn.id,
        }).catch(err => console.error('[REWARDS] confirmation email failed:', err.message));

        return res.json({
          success: true,
          redemption: {
            id: redemption._id,
            type,
            pointsCost: option.pointsCost,
            dollarValue: option.dollarValue,
            status: 'fulfilled',
          },
          newBalance: updatedUser.careCredits.balance,
          message: `$${option.dollarValue} credit applied to your account. It will discount your next invoice.`,
        });
      } catch (stripeErr) {
        console.error('[REWARDS] Stripe credit redemption failed:', stripeErr.message);
        await refund('Stripe API error: ' + stripeErr.message);
        return res.status(500).json({ error: 'Failed to apply credit. Points refunded.' });
      }
    }

    // For gift card: fire emails, leave pending for admin
    sendRedemptionConfirmation(updatedUser, redemption.toObject())
      .catch(err => console.error('[REWARDS] user confirmation email failed:', err.message));

    sendRedemptionAdminAlert(redemption.toObject(), updatedUser)
      .catch(err => console.error('[REWARDS] admin alert email failed:', err.message));

    return res.json({
      success: true,
      redemption: {
        id: redemption._id,
        type,
        vendor,
        pointsCost: option.pointsCost,
        dollarValue: option.dollarValue,
        status: 'pending',
      },
      newBalance: updatedUser.careCredits.balance,
      message: `Gift card request received. You'll receive your code via email within 1-2 business days.`,
    });
  } catch (err) {
    console.error('[REWARDS] redemption failed:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────────
// GET /api/rewards/my-redemptions
// Returns the user's redemption history (most recent first, last 50)
// ─────────────────────────────────────────────────────────────────
router.get('/my-redemptions', protect, async (req, res) => {
  try {
    const redemptions = await Redemption.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .select('-stripeCustomerId -fulfilledBy -cancelledBy -adminNotes')
      .lean();
    res.json({ redemptions });
  } catch (err) {
    console.error('[REWARDS] my-redemptions failed:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

// ─────────────────────────────────────────────────────────────────
// REGISTER THIS ROUTE
//
// In server/src/index.js, find the import block at lines ~12–30:
//   import authRoutes from './routes/auth.js';
//   import coursesRoutes from './routes/courses.js';
//   ...
//
// Add:
//   import rewardsRoutes from './routes/rewards.js';
//
// Then in the route mount block at lines ~130–148:
//   app.use('/api/auth', authRoutes);
//   app.use('/api/interactive-courses', interactiveCourseRoutes);
//   ...
//
// Add:
//   app.use('/api/rewards', rewardsRoutes);
//
// Note on routeManifest.js: confirmed orphaned (May 4, 2026). Two stale
// copies exist (./routeManifest.js and ./server/src/routeManifest.js,
// identical, May 1) but neither is imported anywhere. server/src/index.js
// does not reference it. Do NOT add the rewards route to it; the index.js
// mount alone is sufficient.
// ─────────────────────────────────────────────────────────────────
