// server/src/services/rewardsService.js
//
// CounselorReady Self-Care Rewards Program — Universal Earn Service
// v2.1 — May 5, 2026 (Day 2.5)
//
// Changes from v2.0:
//   - Course completion is now TIERED (25/50/75/100) based on user's
//     payment relationship to the course, with long-course override
//   - Added awardCourseEvaluation (5pt token for mandatory NBCC eval)
//   - Added computeCompletionPoints helper (testable, pure logic)
//   - Renamed POINTS.COURSE_COMPLETION → POINTS.COMPLETION_TIERS (object)
//   - awardCourseReview preserved for future standalone review system
//
// Design principles unchanged from v2.0:
//   1. Idempotent — every earn type has a dedupKey; double-award is no-op
//   2. Atomic — findOneAndUpdate with $ne dedup check; no race conditions
//   3. Fire-and-forget safe — caller never needs to wrap in try/catch
//   4. No throwing — failures log to console.error but never propagate

import mongoose from 'mongoose';
import User from '../models/User.js';

// ─────────────────────────────────────────────────────────────────
// Point values
// ─────────────────────────────────────────────────────────────────
export const POINTS = {
  REFLECTION: 5,
  EVALUATION: 5,           // mandatory NBCC eval — token acknowledgment
  COMPLETION_FREE: 25,     // course consumed via free tier (no payment)
  COMPLETION_INDIVIDUAL: 50, // user individually purchased this course
  COMPLETION_SUBSCRIPTION: 75, // user has active subscription/trial
  COMPLETION_LONG: 100,    // course.ceHours > 4, overrides all others
  CERTIFICATE: 25,
  COURSE_REVIEW: 25,        // reserved for future standalone review system
  REFERRAL_SIGNUP: 50,
  REFERRAL_PAID: 200,
  REFERRAL_RETENTION: 100,
};

// ─────────────────────────────────────────────────────────────────
// Transaction type → User schema enum mapping
// ─────────────────────────────────────────────────────────────────
const TX_TYPE = {
  reflection: 'reflection_submitted',
  courseCompletion: 'course_completion',
  certificate: 'certificate_earned',
  review: 'course_review',
  evaluation: 'course_evaluation',
  referralSignup: 'referral_signup',
  referralPaid: 'referral_paid',
  referralRetention: 'referral_retention_bonus',
  adminAdjustment: 'admin_adjustment',
};

// ─────────────────────────────────────────────────────────────────
// PUBLIC: compute course completion points based on tiered rules
//
// Pure function — no DB access. Caller passes course doc and user doc.
// Tiered rules (highest applicable wins):
//   1. course.ceHours > 4              → 100 (long-course override)
//   2. user has active subscription/trial → 75
//   3. user individually purchased this course → 50
//   4. else (free tier consumption)    → 25
//
// "Active subscription" = user.subscription.status in ['active', 'trial']
// "Individually purchased" = user.purchasedCourses[] contains this courseId
//
// Args:
//   course — Mongoose course doc (needs at least: ceHours, _id)
//   user   — Mongoose user doc (needs at least: subscription, purchasedCourses)
//
// Returns: { points: number, tier: string }
// ─────────────────────────────────────────────────────────────────
export function computeCompletionPoints(course, user) {
  const ceHours = parseFloat(course?.ceHours) || 0;

  // Long-course override
  if (ceHours > 4) {
    return { points: POINTS.COMPLETION_LONG, tier: 'long_course' };
  }

  // Subscription/trial check
  const subStatus = user?.subscription?.status;
  if (subStatus === 'active' || subStatus === 'trial') {
    return { points: POINTS.COMPLETION_SUBSCRIPTION, tier: 'subscription' };
  }

  // Individual purchase check
  const courseIdStr = course?._id?.toString();
  const hasPurchased = courseIdStr && Array.isArray(user?.purchasedCourses) &&
    user.purchasedCourses.some(p => {
      const pid = p?.courseId?.toString();
      return pid === courseIdStr;
    });

  if (hasPurchased) {
    return { points: POINTS.COMPLETION_INDIVIDUAL, tier: 'individual' };
  }

  // Default: free tier consumption
  return { points: POINTS.COMPLETION_FREE, tier: 'free' };
}

// ─────────────────────────────────────────────────────────────────
// Internal: low-level credit award. Atomic.
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
// Internal: atomic dedup claim
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
// PUBLIC: course completion earn (TIERED — 25/50/75/100)
//
// Call after assessment is passed and saved. Idempotent per user × course.
//
// Args:
//   userId — Mongoose ObjectId or string
//   course — Mongoose course doc (needs ceHours, _id, optionally title)
//   user   — Mongoose user doc (needs subscription, purchasedCourses).
//            Caller passes req.user IF it's the full doc, OR loads via
//            User.findById if req.user is thinned.
//
// Returns: { earned: bool, points?: number, tier?: string, newBalance?: number, error?: string }
// Never throws.
// ─────────────────────────────────────────────────────────────────
export async function awardCourseCompletion(userId, course, user) {
  try {
    if (!userId || !course?._id) return { earned: false, error: 'invalid_input' };

    const cidStr = course._id.toString();
    const dedupKey = `course_completion:${cidStr}`;

    const claimed = await _claimDedupKey(userId, dedupKey);
    if (!claimed) return { earned: false, reason: 'already_awarded' };

    // If user wasn't passed in (or is thinned), load it for tier calc
    let userDoc = user;
    if (!userDoc?.subscription) {
      userDoc = await User.findById(userId, {
        subscription: 1,
        purchasedCourses: 1,
      });
    }

    const { points, tier } = computeCompletionPoints(course, userDoc);

    const desc = course.title
      ? `Completed: ${course.title} (${tier} tier, ${points}pt)`
      : `Course completion (${cidStr}, ${tier} tier)`;

    const updated = await _awardCreditsRaw(
      userId,
      points,
      TX_TYPE.courseCompletion,
      desc,
      cidStr
    );

    return {
      earned: true,
      points,
      tier,
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
// Call after certificate PDF is generated successfully.
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

    const updated = await _awardCreditsRaw(
      userId,
      POINTS.CERTIFICATE,
      TX_TYPE.certificate,
      desc,
      cidStr
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
// PUBLIC: course evaluation earn (5 pts — TOKEN)
//
// Call after the NBCC-required course evaluation is submitted.
// Low value (5pt) because evaluation is mandatory for cert generation —
// users would do it anyway. This is acknowledgment, not behavior change.
//
// Idempotent per user × course.
// ─────────────────────────────────────────────────────────────────
export async function awardCourseEvaluation(userId, courseId, courseTitle = '') {
  try {
    if (!userId || !courseId) return { earned: false, error: 'invalid_input' };

    const cidStr = courseId.toString();
    const dedupKey = `course_evaluation:${cidStr}`;

    const claimed = await _claimDedupKey(userId, dedupKey);
    if (!claimed) return { earned: false, reason: 'already_awarded' };

    const desc = courseTitle
      ? `Evaluation submitted: ${courseTitle}`
      : `Course evaluation (${cidStr})`;

    const updated = await _awardCreditsRaw(
      userId,
      POINTS.EVALUATION,
      TX_TYPE.evaluation,
      desc,
      cidStr
    );

    return {
      earned: true,
      points: POINTS.EVALUATION,
      newBalance: updated?.careCredits?.balance ?? null,
    };
  } catch (err) {
    console.error('[REWARDS] awardCourseEvaluation failed:', err.message);
    return { earned: false, error: 'server_error' };
  }
}

// ─────────────────────────────────────────────────────────────────
// PUBLIC: course review earn (25 pts) — RESERVED, not currently wired
//
// Reserved for a future standalone review system (separate from NBCC
// evaluation). When/if Ke builds public course reviews, wire this from
// that endpoint. Different dedup key from evaluation, so both can earn.
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

    const updated = await _awardCreditsRaw(
      userId,
      POINTS.COURSE_REVIEW,
      TX_TYPE.review,
      desc,
      cidStr
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
// (unchanged from v2.0)
// ─────────────────────────────────────────────────────────────────
export async function processReferralSignup(newUserId, referralCode) {
  try {
    if (!newUserId || !referralCode) return { processed: false, reason: 'no_referral_code' };

    const code = referralCode.trim().toUpperCase();
    if (!/^[A-Z0-9]{8}$/.test(code)) return { processed: false, reason: 'invalid_code_format' };

    const referrer = await User.findOne({ referralCode: code }, { _id: 1 });
    if (!referrer) return { processed: false, reason: 'referrer_not_found' };

    if (referrer._id.toString() === newUserId.toString()) {
      return { processed: false, reason: 'self_referral_blocked' };
    }

    await User.updateOne(
      { _id: newUserId, referredBy: { $exists: false } },
      { $set: { referredBy: referrer._id } }
    );

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
      return { processed: true, referrerAwarded: false, reason: 'already_recorded' };
    }

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
// (unchanged from v2.0)
// ─────────────────────────────────────────────────────────────────
export async function processReferralPaidConversion(payingUserId) {
  try {
    if (!payingUserId) return { processed: false, reason: 'invalid_input' };

    const payer = await User.findById(payingUserId, { referredBy: 1 });
    if (!payer || !payer.referredBy) {
      return { processed: false, reason: 'no_referrer' };
    }

    const referrerId = payer.referredBy;

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
// PUBLIC: tier helper
// ─────────────────────────────────────────────────────────────────
export function tierFromLifetime(lifetime) {
  if (lifetime >= 1500) return { name: 'Flourishing', color: 'gold',   multiplier: 2.0,  nextThreshold: null };
  if (lifetime >= 750)  return { name: 'Rooted',      color: 'navy',   multiplier: 1.5,  nextThreshold: 1500 };
  if (lifetime >= 250)  return { name: 'Grounded',    color: 'hunter', multiplier: 1.25, nextThreshold: 750 };
  return                       { name: 'Seedling',    color: 'green',  multiplier: 1.0,  nextThreshold: 250 };
}
