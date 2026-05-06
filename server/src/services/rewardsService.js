// server/src/services/rewardsService.js
//
// CounselorReady Mastery Mark Points (MMP) Earn Service
// v2.2 — Day 3 (May 5, 2026)
//
// Changes from v2.1:
//   - Tier names: Seedling/Grounded/Rooted/Flourishing → Capable/Proficient/Skilled/Seasoned
//   - Thresholds and colors unchanged (250/750/1500, green/hunter/navy/gold)
//   - Added 'redemption_stripe_credit' and 'redemption_giftcard' to internal TX_TYPE map
//
// Design principles unchanged:
//   1. Idempotent — every earn type has a dedupKey
//   2. Atomic — findOneAndUpdate with $ne dedup check
//   3. Fire-and-forget safe — caller never wraps in try/catch
//   4. No throwing — failures log but never propagate

import mongoose from 'mongoose';
import User from '../models/User.js';

// ─────────────────────────────────────────────────────────────────
// Point values (display name: Mastery Mark Points / MMPs)
// ─────────────────────────────────────────────────────────────────
export const POINTS = {
  REFLECTION: 5,
  EVALUATION: 5,
  COMPLETION_FREE: 25,
  COMPLETION_INDIVIDUAL: 50,
  COMPLETION_SUBSCRIPTION: 75,
  COMPLETION_LONG: 100,
  CERTIFICATE: 25,
  COURSE_REVIEW: 25,
  REFERRAL_SIGNUP: 50,
  REFERRAL_PAID: 200,
  REFERRAL_RETENTION: 100,
};

// Transaction types (internal — schema enum)
const TX_TYPE = {
  reflection: 'reflection_submitted',
  courseCompletion: 'course_completion',
  certificate: 'certificate_earned',
  review: 'course_review',
  evaluation: 'course_evaluation',
  referralSignup: 'referral_signup',
  referralPaid: 'referral_paid',
  referralRetention: 'referral_retention_bonus',
  redemptionStripeCredit: 'redemption_stripe_credit',
  redemptionGiftcard: 'redemption_giftcard',
  adminAdjustment: 'admin_adjustment',
};

// ─────────────────────────────────────────────────────────────────
// Compute course completion points (tiered)
// ─────────────────────────────────────────────────────────────────
export function computeCompletionPoints(course, user) {
  const ceHours = parseFloat(course?.ceHours || course?.ceuHours) || 0;

  if (ceHours > 4) {
    return { points: POINTS.COMPLETION_LONG, tier: 'long_course' };
  }

  const subStatus = user?.subscription?.status;
  if (subStatus === 'active' || subStatus === 'trial') {
    return { points: POINTS.COMPLETION_SUBSCRIPTION, tier: 'subscription' };
  }

  const courseIdStr = course?._id?.toString();
  const hasPurchased = courseIdStr && Array.isArray(user?.purchasedCourses) &&
    user.purchasedCourses.some(p => {
      const pid = p?.courseId?.toString();
      return pid === courseIdStr;
    });

  if (hasPurchased) {
    return { points: POINTS.COMPLETION_INDIVIDUAL, tier: 'individual' };
  }

  return { points: POINTS.COMPLETION_FREE, tier: 'free' };
}

// ─────────────────────────────────────────────────────────────────
// Internal: low-level credit award
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
// PUBLIC: course completion earn (TIERED)
// ─────────────────────────────────────────────────────────────────
export async function awardCourseCompletion(userId, course, user) {
  try {
    if (!userId || !course?._id) return { earned: false, error: 'invalid_input' };

    const cidStr = course._id.toString();
    const dedupKey = `course_completion:${cidStr}`;

    const claimed = await _claimDedupKey(userId, dedupKey);
    if (!claimed) return { earned: false, reason: 'already_awarded' };

    let userDoc = user;
    if (!userDoc?.subscription) {
      userDoc = await User.findById(userId, { subscription: 1, purchasedCourses: 1 });
    }

    const { points, tier } = computeCompletionPoints(course, userDoc);

    const desc = course.title
      ? `Completed: ${course.title} (${tier} tier, ${points} MMP)`
      : `Course completion (${cidStr}, ${tier} tier)`;

    const updated = await _awardCreditsRaw(
      userId, points, TX_TYPE.courseCompletion, desc, cidStr
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
// PUBLIC: certificate earn (25 MMP)
// ─────────────────────────────────────────────────────────────────
export async function awardCertificate(userId, courseId, courseTitle = '') {
  try {
    if (!userId || !courseId) return { earned: false, error: 'invalid_input' };

    const cidStr = courseId.toString();
    const dedupKey = `certificate_earned:${cidStr}`;

    const claimed = await _claimDedupKey(userId, dedupKey);
    if (!claimed) return { earned: false, reason: 'already_awarded' };

    const desc = courseTitle ? `Certificate earned: ${courseTitle}` : `Certificate (${cidStr})`;

    const updated = await _awardCreditsRaw(
      userId, POINTS.CERTIFICATE, TX_TYPE.certificate, desc, cidStr
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
// PUBLIC: course evaluation earn (5 MMP token)
// ─────────────────────────────────────────────────────────────────
export async function awardCourseEvaluation(userId, courseId, courseTitle = '') {
  try {
    if (!userId || !courseId) return { earned: false, error: 'invalid_input' };

    const cidStr = courseId.toString();
    const dedupKey = `course_evaluation:${cidStr}`;

    const claimed = await _claimDedupKey(userId, dedupKey);
    if (!claimed) return { earned: false, reason: 'already_awarded' };

    const desc = courseTitle ? `Evaluation submitted: ${courseTitle}` : `Course evaluation (${cidStr})`;

    const updated = await _awardCreditsRaw(
      userId, POINTS.EVALUATION, TX_TYPE.evaluation, desc, cidStr
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
// PUBLIC: course review earn (25 MMP) — RESERVED for future
// ─────────────────────────────────────────────────────────────────
export async function awardCourseReview(userId, courseId, courseTitle = '') {
  try {
    if (!userId || !courseId) return { earned: false, error: 'invalid_input' };

    const cidStr = courseId.toString();
    const dedupKey = `course_review:${cidStr}`;

    const claimed = await _claimDedupKey(userId, dedupKey);
    if (!claimed) return { earned: false, reason: 'already_awarded' };

    const desc = courseTitle ? `Reviewed: ${courseTitle}` : `Course review (${cidStr})`;

    const updated = await _awardCreditsRaw(
      userId, POINTS.COURSE_REVIEW, TX_TYPE.review, desc, cidStr
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
      { _id: referrer._id, 'referrals.userId': { $ne: newUserId } },
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
// PUBLIC: tier helper — Capable / Proficient / Skilled / Seasoned
// ─────────────────────────────────────────────────────────────────
export function tierFromLifetime(lifetime) {
  if (lifetime >= 1500) return { name: 'Seasoned',   color: 'gold',   multiplier: 2.0,  nextThreshold: null };
  if (lifetime >= 750)  return { name: 'Skilled',    color: 'navy',   multiplier: 1.5,  nextThreshold: 1500 };
  if (lifetime >= 250)  return { name: 'Proficient', color: 'hunter', multiplier: 1.25, nextThreshold: 750 };
  return                       { name: 'Capable',    color: 'green',  multiplier: 1.0,  nextThreshold: 250 };
}
