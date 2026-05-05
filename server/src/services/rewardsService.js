// server/src/services/rewardsService.js
//
// CounselorReady Self-Care Rewards Program — Universal Earn Service
// v2.0 — May 4, 2026 (Day 2)
//
// One module, all earn triggers. Called from:
//   - routes/auth.js          → processReferralSignup() on registration
//   - routes/courseRoutes.js  → awardCourseCompletion() on assessment pass
//   - routes/certificates.js  → awardCertificate() after PDF generation
//   - routes/credentials.js   → awardCourseReview() on review submit
//   - routes/payments.js      → processReferralPaidConversion() in Stripe webhook
//   - routes/rewards.js       → earn-reflection (already wired in Day 1)
//
// Design principles:
//   1. Idempotent — every earn type has a dedupKey; awarding the same key twice is a silent no-op
//   2. Atomic — findOneAndUpdate with $ne dedup check; no race conditions
//   3. Fire-and-forget safe — every public function catches its own errors and returns
//      structured results. Callers never need to wrap in try/catch.
//   4. No throwing — failures log to console.error but never propagate. Reward awarding
//      should NEVER cause a primary user action (course completion, payment, etc.) to fail.
//
// Mixed module reality: this file is ESM. User.js is also ESM (Day 1 confirmed).
// emailService.js, Certificate.js are CommonJS — we don't import them here.

import mongoose from 'mongoose';
import User from '../models/User.js';

// ─────────────────────────────────────────────────────────────────
// Point values — single source of truth, mirrored in routes/rewards.js
// ─────────────────────────────────────────────────────────────────
export const POINTS = {
  REFLECTION: 5,
  COURSE_COMPLETION: 75,
  CERTIFICATE: 25,
  COURSE_REVIEW: 25,
  REFERRAL_SIGNUP: 50,
  REFERRAL_PAID: 200,
  REFERRAL_RETENTION: 100,
};

// ─────────────────────────────────────────────────────────────────
// Transaction type → audit log enum mapping
// Must match the User schema's careCredits.transactions[].type enum
// ─────────────────────────────────────────────────────────────────
const TX_TYPE = {
  reflection: 'reflection_submitted',
  courseCompletion: 'course_completion',
  certificate: 'certificate_earned',
  review: 'course_review',
  referralSignup: 'referral_signup',
  referralPaid: 'referral_paid',
  referralRetention: 'referral_retention_bonus',
  adminAdjustment: 'admin_adjustment',
};

// ─────────────────────────────────────────────────────────────────
// Internal: low-level credit award. Atomic. Always called by a
// public helper that has already done dedup.
// ─────────────────────────────────────────────────────────────────
async function _awardCreditsRaw(userId, amount, txType, description, relatedCourseId = null, relatedRedemptionId = null) {
  const update = {
    $inc: {
      'careCredits.balance': amount,
      'careCredits.lifetime': amount > 0 ? amount : 0,
    },
    $push: {
      'careCredits.transactions': {
        amount,
        type: txType,
        description,
        relatedCourseId,
        relatedRedemptionId,
        createdAt: new Date(),
      },
    },
  };
  const updated = await User.findByIdAndUpdate(userId, update, {
    new: true,
    select: 'careCredits.balance careCredits.lifetime',
  });
  return updated;
}

// ─────────────────────────────────────────────────────────────────
// Internal: atomic dedup. Returns true if dedupKey was new (caller
// should award), false if already present (caller should skip).
//
// Uses earnedKeys[] array on User doc — see schema patch v2.
// ─────────────────────────────────────────────────────────────────
async function _claimDedupKey(userId, dedupKey) {
  const result = await User.findOneAndUpdate(
    { _id: userId, earnedKeys: { $ne: dedupKey } },
    { $addToSet: { earnedKeys: dedupKey } },
    { select: '_id' }
  );
  return result !== null;
}

// ─────────────────────────────────────────────────────────────────
// PUBLIC: course completion earn (75 pts)
//
// Call after assessment is passed and saved. Idempotent per user × course.
//
// Args:
//   userId   — Mongoose ObjectId or string
//   courseId — Mongoose ObjectId or string (the course being completed)
//   courseTitle — optional, used in transaction description
//
// Returns: { earned: bool, points?: number, newBalance?: number, error?: string }
// Never throws.
// ─────────────────────────────────────────────────────────────────
export async function awardCourseCompletion(userId, courseId, courseTitle = '') {
  try {
    if (!userId || !courseId) return { earned: false, error: 'invalid_input' };

    const cidStr = courseId.toString();
    const dedupKey = `course_completion:${cidStr}`;

    const claimed = await _claimDedupKey(userId, dedupKey);
    if (!claimed) return { earned: false, reason: 'already_awarded' };

    const desc = courseTitle
      ? `Completed: ${courseTitle}`
      : `Course completion (${cidStr})`;

    const courseObjectId = mongoose.Types.ObjectId.isValid(cidStr)
      ? cidStr : null;

    const updated = await _awardCreditsRaw(
      userId,
      POINTS.COURSE_COMPLETION,
      TX_TYPE.courseCompletion,
      desc,
      courseObjectId
    );

    return {
      earned: true,
      points: POINTS.COURSE_COMPLETION,
      newBalance: updated?.careCredits?.balance ?? null,
    };
  } catch (err) {
    console.error('[REWARDS] awardCourseCompletion failed:', err.message);
    return { earned: false, error: 'server_error' };
  }
}

// ─────────────────────────────────────────────────────────────────
// PUBLIC: certificate earn (25 pts)
//
// Call after certificate PDF is generated and saved. Idempotent per user × course.
// ─────────────────────────────────────────────────────────────────
export async function awardCertificate(userId, courseId, courseTitle = '') {
  try {
    if (!userId || !courseId) return { earned: false, error: 'invalid_input' };

    const cidStr = courseId.toString();
    const dedupKey = `certificate_earned:${cidStr}`;

    const claimed = await _claimDedupKey(userId, dedupKey);
    if (!claimed) return { earned: false, reason: 'already_awarded' };

    const desc = courseTitle
      ? `Certificate earned: ${courseTitle}`
      : `Certificate (${cidStr})`;

    const courseObjectId = mongoose.Types.ObjectId.isValid(cidStr)
      ? cidStr : null;

    const updated = await _awardCreditsRaw(
      userId,
      POINTS.CERTIFICATE,
      TX_TYPE.certificate,
      desc,
      courseObjectId
    );

    return {
      earned: true,
      points: POINTS.CERTIFICATE,
      newBalance: updated?.careCredits?.balance ?? null,
    };
  } catch (err) {
    console.error('[REWARDS] awardCertificate failed:', err.message);
    return { earned: false, error: 'server_error' };
  }
}

// ─────────────────────────────────────────────────────────────────
// PUBLIC: course review earn (25 pts)
//
// Call after a user submits a review. Idempotent per user × course.
// ─────────────────────────────────────────────────────────────────
export async function awardCourseReview(userId, courseId, courseTitle = '') {
  try {
    if (!userId || !courseId) return { earned: false, error: 'invalid_input' };

    const cidStr = courseId.toString();
    const dedupKey = `course_review:${cidStr}`;

    const claimed = await _claimDedupKey(userId, dedupKey);
    if (!claimed) return { earned: false, reason: 'already_awarded' };

    const desc = courseTitle
      ? `Reviewed: ${courseTitle}`
      : `Course review (${cidStr})`;

    const courseObjectId = mongoose.Types.ObjectId.isValid(cidStr)
      ? cidStr : null;

    const updated = await _awardCreditsRaw(
      userId,
      POINTS.COURSE_REVIEW,
      TX_TYPE.review,
      desc,
      courseObjectId
    );

    return {
      earned: true,
      points: POINTS.COURSE_REVIEW,
      newBalance: updated?.careCredits?.balance ?? null,
    };
  } catch (err) {
    console.error('[REWARDS] awardCourseReview failed:', err.message);
    return { earned: false, error: 'server_error' };
  }
}

// ─────────────────────────────────────────────────────────────────
// PUBLIC: referral signup
//
// Call from /auth/register AFTER the new user is saved. If `referralCode`
// is present (came from ?ref=CODE on the registration), this:
//   1. Finds the referrer user by referralCode
//   2. Sets newUser.referredBy = referrer._id
//   3. Adds entry to referrer.referrals[]
//   4. Awards 50 CareCredits to the REFERRER (not the new user)
//
// Idempotent per (referrer, newUser) pair via dedupKey.
//
// Args:
//   newUserId    — the just-created user's _id
//   referralCode — the code from ?ref=ABC12345 query string (any case, will normalize)
//
// Returns: { processed: bool, referrerAwarded?: bool, points?: number, error?: string }
// Never throws.
// ─────────────────────────────────────────────────────────────────
export async function processReferralSignup(newUserId, referralCode) {
  try {
    if (!newUserId || !referralCode) return { processed: false, reason: 'no_referral_code' };

    const code = referralCode.trim().toUpperCase();
    if (!/^[A-Z0-9]{8}$/.test(code)) return { processed: false, reason: 'invalid_code_format' };

    // Find referrer
    const referrer = await User.findOne({ referralCode: code }, { _id: 1 });
    if (!referrer) return { processed: false, reason: 'referrer_not_found' };

    // Don't allow self-referral (defensive — backend check on top of frontend block)
    if (referrer._id.toString() === newUserId.toString()) {
      return { processed: false, reason: 'self_referral_blocked' };
    }

    // Set referredBy on the new user (one-shot — only sets if not already set)
    await User.updateOne(
      { _id: newUserId, referredBy: { $exists: false } },
      { $set: { referredBy: referrer._id } }
    );
    // (Also handles the case where referredBy was set to null — uses $exists:false to allow first-time set only)

    // Add to referrer's referrals[] array (atomic — only if not already there)
    const referralPushed = await User.findOneAndUpdate(
      {
        _id: referrer._id,
        'referrals.userId': { $ne: newUserId },
      },
      {
        $push: {
          referrals: {
            userId: newUserId,
            status: 'signed_up',
            earnedCredits: POINTS.REFERRAL_SIGNUP,
            createdAt: new Date(),
          },
        },
      },
      { select: '_id' }
    );

    if (!referralPushed) {
      // referral already recorded — idempotent skip
      return { processed: true, referrerAwarded: false, reason: 'already_recorded' };
    }

    // Award 50 pts to the referrer with dedup key
    const dedupKey = `referral_signup:${newUserId.toString()}`;
    const claimed = await _claimDedupKey(referrer._id, dedupKey);
    if (!claimed) {
      return { processed: true, referrerAwarded: false, reason: 'already_awarded' };
    }

    const updated = await _awardCreditsRaw(
      referrer._id,
      POINTS.REFERRAL_SIGNUP,
      TX_TYPE.referralSignup,
      `Referral signup bonus (new user joined via your code)`,
      null
    );

    return {
      processed: true,
      referrerAwarded: true,
      points: POINTS.REFERRAL_SIGNUP,
      referrerBalance: updated?.careCredits?.balance ?? null,
    };
  } catch (err) {
    console.error('[REWARDS] processReferralSignup failed:', err.message);
    return { processed: false, error: 'server_error' };
  }
}

// ─────────────────────────────────────────────────────────────────
// PUBLIC: referral paid conversion
//
// Call from the Stripe webhook handler when a user's FIRST paid invoice clears.
//
// 1. Look up the user — if they have a referredBy, the referrer gets 200 pts
// 2. Update the referrer's referrals[] entry status from 'signed_up' → 'paid'
// 3. Award 200 to the referrer (idempotent per referee)
//
// Args:
//   payingUserId — the user whose invoice just cleared
//
// Returns: { processed: bool, referrerAwarded?: bool, points?: number, error?: string }
// Never throws.
// ─────────────────────────────────────────────────────────────────
export async function processReferralPaidConversion(payingUserId) {
  try {
    if (!payingUserId) return { processed: false, reason: 'invalid_input' };

    const payer = await User.findById(payingUserId, { referredBy: 1 });
    if (!payer || !payer.referredBy) {
      return { processed: false, reason: 'no_referrer' };
    }

    const referrerId = payer.referredBy;

    // Update the referrals[] entry status (idempotent — only updates if status is 'signed_up')
    await User.updateOne(
      {
        _id: referrerId,
        'referrals.userId': payingUserId,
        'referrals.status': 'signed_up',
      },
      {
        $set: { 'referrals.$.status': 'paid' },
        $inc: { 'referrals.$.earnedCredits': POINTS.REFERRAL_PAID },
      }
    );

    // Award 200 pts to referrer with dedup
    const dedupKey = `referral_paid:${payingUserId.toString()}`;
    const claimed = await _claimDedupKey(referrerId, dedupKey);
    if (!claimed) {
      return { processed: true, referrerAwarded: false, reason: 'already_awarded' };
    }

    const updated = await _awardCreditsRaw(
      referrerId,
      POINTS.REFERRAL_PAID,
      TX_TYPE.referralPaid,
      `Referral conversion bonus (your referral subscribed)`,
      null
    );

    return {
      processed: true,
      referrerAwarded: true,
      points: POINTS.REFERRAL_PAID,
      referrerBalance: updated?.careCredits?.balance ?? null,
    };
  } catch (err) {
    console.error('[REWARDS] processReferralPaidConversion failed:', err.message);
    return { processed: false, error: 'server_error' };
  }
}

// ─────────────────────────────────────────────────────────────────
// PUBLIC: tier helper — kept here as well for routes that need it
// without importing from rewards.js
// ─────────────────────────────────────────────────────────────────
export function tierFromLifetime(lifetime) {
  if (lifetime >= 1500) return { name: 'Flourishing', color: 'gold',   multiplier: 2.0,  nextThreshold: null };
  if (lifetime >= 750)  return { name: 'Rooted',      color: 'navy',   multiplier: 1.5,  nextThreshold: 1500 };
  if (lifetime >= 250)  return { name: 'Grounded',    color: 'hunter', multiplier: 1.25, nextThreshold: 750 };
  return                       { name: 'Seedling',    color: 'green',  multiplier: 1.0,  nextThreshold: 250 };
}
