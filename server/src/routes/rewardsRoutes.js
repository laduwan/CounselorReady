// server/src/routes/rewardsRoutes.js
//
// CounselorReady Self-Care Rewards Program — API routes
// v1.1 — May 4, 2026
//
// Day 1 scope: earn-reflection (the v1.1 addition), balance, referral-link.
// Day 2 will add: redeem endpoints, redeem-giftcard, admin queue.
//
// Auth: all routes except internal earn hooks require a valid JWT.
// Mounted at /api/rewards in app.js.

import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';

const router = express.Router();

// ─────────────────────────────────────────────────────────────────
// Auth middleware — copy from your existing pattern.
// If the project already exports a `requireAuth` middleware, import that
// instead of redefining here. Replace the require below if so.
// ─────────────────────────────────────────────────────────────────
import { requireAuth } from '../middleware/auth.js';   // ← adjust path if needed

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
router.post('/earn-reflection', requireAuth, async (req, res) => {
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
router.get('/balance', requireAuth, async (req, res) => {
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
router.get('/referral-link', requireAuth, async (req, res) => {
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
router.get('/referrals', requireAuth, async (req, res) => {
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
// Tier calculation — keep in sync with v1.0 §3.1
// ─────────────────────────────────────────────────────────────────
function tierFromLifetime(lifetime) {
  if (lifetime >= 1500) return { name: 'Flourishing', color: 'gold', multiplier: 2.0, nextThreshold: null };
  if (lifetime >= 750)  return { name: 'Rooted',      color: 'navy', multiplier: 1.5, nextThreshold: 1500 };
  if (lifetime >= 250)  return { name: 'Grounded',    color: 'hunter', multiplier: 1.25, nextThreshold: 750 };
  return                       { name: 'Seedling',    color: 'green', multiplier: 1.0, nextThreshold: 250 };
}

// ─────────────────────────────────────────────────────────────────
// Day 2 stubs — fill in next deploy
// ─────────────────────────────────────────────────────────────────
router.post('/redeem', requireAuth, (req, res) => {
  return res.status(501).json({ error: 'not_implemented_yet', day: 2 });
});

router.post('/redeem-giftcard', requireAuth, (req, res) => {
  return res.status(501).json({ error: 'not_implemented_yet', day: 2 });
});

export default router;

// ─────────────────────────────────────────────────────────────────
// REGISTER THIS ROUTE
// In server/src/app.js (or wherever routes are mounted), add:
//
//   import rewardsRoutes from './routes/rewardsRoutes.js';
//   app.use('/api/rewards', rewardsRoutes);
//
// Add to routeManifest.js so the route protection layer recognizes it:
//
//   { path: '/api/rewards', router: 'rewardsRoutes', requiresAuth: true },
// ─────────────────────────────────────────────────────────────────
