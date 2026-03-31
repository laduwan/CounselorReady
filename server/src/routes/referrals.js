/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 *
 * "Pass the Key" Referral Program API
 */
import express from 'express';
import rateLimit from 'express-rate-limit';
import Referral from '../models/Referral.js';
import User from '../models/User.js';
import { protect, requireAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// ── Constants ──
const TRACK1_REWARD = 5;          // $5 per paid conversion
const REG_CREDIT = 0.50;          // $0.50 per registration (pending)
const REG_CE_THRESHOLD = 10;      // CE hours before reg credit qualifies
const TRACK2_THRESHOLD = 5;       // paid referrals to unlock course
const TRACK3_THRESHOLD = 50;      // paid referrals to unlock rev share
const TRACK3_CASH_BONUS = 100;    // one-time cash bonus
const TRACK3_REV_SHARE_PCT = 0.10; // 10% monthly rev share

const clickLimiter = rateLimit({
  windowMs: 60 * 1000, max: 60,
  standardHeaders: true, legacyHeaders: false,
  message: { error: 'Too many requests' }
});

// ════════════════════════════════════════════
// USER ENDPOINTS
// ════════════════════════════════════════════

// ── Get or create my referral profile ──
router.get('/my', protect, async (req, res) => {
  try {
    let ref = await Referral.findOne({ referrerId: req.user._id });
    if (!ref) {
      ref = await Referral.create({ referrerId: req.user._id });
    }

    const paidCount = ref.getPaidReferralCount();
    const clientUrl = process.env.CLIENT_URL || 'https://counselorready.com';

    res.json({
      referralCode: ref.referralCode,
      referralLink: `${clientUrl}/register?ref=${ref.referralCode}`,
      activeTrack: ref.activeTrack,
      isFoundingMember: ref.isFoundingMember,
      stats: {
        totalClicks: ref.totalClicks,
        totalSignups: ref.totalSignups,
        totalPaidConversions: ref.totalPaidConversions,
        creditsBalance: ref.creditsBalance,
        totalRewardsEarned: ref.totalRewardsEarned,
        pendingRegistrationCredits: ref.pendingRegistrationCredits
      },
      milestones: {
        track2: {
          threshold: TRACK2_THRESHOLD,
          progress: Math.min(paidCount, TRACK2_THRESHOLD),
          unlocked: ref.rewards.track2.unlocked,
          courseChoice: ref.rewards.track2.courseChoice,
          supervisionAddon: ref.rewards.track2.supervisionAddon,
          redeemed: ref.rewards.track2.redeemed
        },
        track3: {
          threshold: TRACK3_THRESHOLD,
          progress: Math.min(paidCount, TRACK3_THRESHOLD),
          unlocked: ref.rewards.track3.unlocked,
          cashBonusPaid: ref.rewards.track3.cashBonusPaid,
          revenueShareActive: ref.rewards.track3.revenueShareActive,
          totalRevenueShared: ref.rewards.track3.totalRevenueShared
        }
      },
      referrals: ref.referrals.map(r => ({
        id: r._id,
        email: r.referredEmail ? r.referredEmail.replace(/(.{2}).*(@.*)/, '$1***$2') : 'Unknown',
        status: r.status,
        ceHoursCompleted: r.ceHoursCompleted,
        registrationCreditStatus: r.registrationCreditStatus,
        registeredAt: r.registeredAt,
        subscribedAt: r.subscribedAt,
        rewardedAt: r.rewardedAt
      })),
      isActive: ref.isActive
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Select active track ──
router.put('/track', protect, validate({
  body: { track: 'positiveInt' }
}), async (req, res) => {
  try {
    const { track } = req.body;
    if (![1, 2, 3].includes(track)) {
      return res.status(400).json({ error: 'Track must be 1, 2, or 3' });
    }

    const ref = await Referral.findOne({ referrerId: req.user._id });
    if (!ref) return res.status(404).json({ error: 'Referral profile not found' });

    ref.activeTrack = track;
    await ref.save();

    res.json({ activeTrack: ref.activeTrack, message: `Switched to Track ${track}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Redeem Track 2 course reward ──
router.post('/redeem-course', protect, validate({
  body: { courseChoice: 'string' }
}), async (req, res) => {
  try {
    const { courseChoice, supervisionAddon } = req.body;
    const validChoices = ['intake-to-remit', 'telemental-health'];
    if (!validChoices.includes(courseChoice)) {
      return res.status(400).json({ error: 'Invalid course choice' });
    }

    const ref = await Referral.findOne({ referrerId: req.user._id });
    if (!ref) return res.status(404).json({ error: 'Referral profile not found' });

    if (!ref.rewards.track2.unlocked) {
      return res.status(400).json({
        error: `Need ${TRACK2_THRESHOLD} paid referrals to unlock. You have ${ref.getPaidReferralCount()}.`
      });
    }

    if (ref.rewards.track2.redeemed) {
      return res.status(400).json({ error: 'Course reward already redeemed' });
    }

    ref.rewards.track2.courseChoice = courseChoice;
    ref.rewards.track2.supervisionAddon = !!supervisionAddon;
    ref.rewards.track2.redeemed = true;
    ref.rewards.track2.redeemedAt = new Date();
    await ref.save();

    // TODO: Grant course access to user (add to purchasedCourses or create enrollment)

    res.json({
      message: 'Course reward redeemed!',
      courseChoice,
      supervisionAddon: !!supervisionAddon
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Apply credits to subscription ──
router.post('/apply-credits', protect, validate({
  body: { amount: 'number' }
}), async (req, res) => {
  try {
    const { amount } = req.body;
    const ref = await Referral.findOne({ referrerId: req.user._id });
    if (!ref) return res.status(404).json({ error: 'Referral profile not found' });

    if (amount <= 0 || amount > ref.creditsBalance) {
      return res.status(400).json({
        error: `Invalid amount. Available balance: $${ref.creditsBalance}`
      });
    }

    ref.creditsBalance -= amount;
    await ref.save();

    // TODO: Apply as Stripe coupon/credit to user's next invoice

    res.json({
      message: `$${amount} credit applied`,
      remainingBalance: ref.creditsBalance
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ════════════════════════════════════════════
// PUBLIC / REGISTRATION ENDPOINTS
// ════════════════════════════════════════════

// ── Track a referral link click ──
router.post('/track/:code', clickLimiter, async (req, res) => {
  try {
    const ref = await Referral.findOne({ referralCode: req.params.code, isActive: true });
    if (!ref) return res.status(404).json({ error: 'Invalid referral code' });

    ref.totalClicks += 1;
    await ref.save();

    res.json({ valid: true, code: ref.referralCode });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Record signup from referral (called during registration) ──
router.post('/register', validate({
  body: { referralCode: 'string', email: 'email' }
}), async (req, res) => {
  try {
    const { referralCode, email, userId } = req.body;

    const ref = await Referral.findOne({ referralCode, isActive: true });
    if (!ref) return res.status(404).json({ error: 'Invalid referral code' });

    // Prevent self-referral
    const referrer = await User.findById(ref.referrerId);
    if (referrer?.email?.toLowerCase() === email.toLowerCase()) {
      return res.status(400).json({ error: 'Cannot refer yourself' });
    }

    // Check duplicate
    const existing = ref.referrals.find(r => r.referredEmail === email.toLowerCase());
    if (existing) return res.json({ message: 'Already tracked' });

    // Add referral entry
    ref.referrals.push({
      referredEmail: email.toLowerCase(),
      referredUserId: userId || null,
      status: 'registered',
      registrationCreditStatus: 'pending',
      registeredAt: new Date()
    });
    ref.totalSignups += 1;
    ref.pendingRegistrationCredits += 1;
    await ref.save();

    res.json({ message: 'Referral recorded', registrationCredit: REG_CREDIT });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ════════════════════════════════════════════
// WEBHOOK / INTERNAL ENDPOINTS
// ════════════════════════════════════════════

// ── Process paid conversion (called by Stripe webhook or admin) ──
router.post('/convert', protect, requireAdmin, validate({
  body: { userId: 'string' }
}), async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Find referral containing this user
    const ref = await Referral.findOne({
      'referrals.referredUserId': userId,
      'referrals.status': { $in: ['registered', 'trialing'] }
    });
    if (!ref) return res.json({ message: 'No pending referral for this user' });

    const entry = ref.referrals.find(r =>
      r.referredUserId?.toString() === userId &&
      ['registered', 'trialing'].includes(r.status)
    );
    if (!entry) return res.json({ message: 'Already processed' });

    // Update entry
    entry.status = 'subscribed';
    entry.subscribedAt = new Date();
    ref.totalPaidConversions += 1;

    // Track 1 reward: $5 credit
    ref.subscriptionCredits += TRACK1_REWARD;
    ref.creditsBalance += TRACK1_REWARD;
    ref.totalRewardsEarned += TRACK1_REWARD;

    // Check milestones
    const milestoneChanges = ref.checkMilestones();

    // Mark as rewarded
    entry.status = 'rewarded';
    entry.rewardedAt = new Date();

    await ref.save();

    const result = {
      message: `$${TRACK1_REWARD} credit awarded`,
      referrerId: ref.referrerId,
      creditsBalance: ref.creditsBalance,
      totalPaidConversions: ref.totalPaidConversions,
      milestoneChanges
    };

    // Track 3: auto-pay cash bonus if just unlocked
    if (milestoneChanges.includes('track3_unlocked') && !ref.rewards.track3.cashBonusPaid) {
      ref.rewards.track3.cashBonusPaid = true;
      ref.rewards.track3.cashBonusPaidAt = new Date();
      ref.totalRewardsEarned += TRACK3_CASH_BONUS;
      await ref.save();
      result.track3CashBonus = TRACK3_CASH_BONUS;
      // TODO: Trigger Stripe payout of $100 to referrer
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Update referred user's CE hours (called after course completion) ──
router.post('/update-ce', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const { ceHoursEarned } = req.body;

    if (!ceHoursEarned || ceHoursEarned <= 0) {
      return res.status(400).json({ error: 'ceHoursEarned required' });
    }

    // Find if this user was referred by someone
    const ref = await Referral.findOne({
      'referrals.referredUserId': userId
    });
    if (!ref) return res.json({ message: 'User was not referred' });

    const entry = ref.referrals.find(r =>
      r.referredUserId?.toString() === userId.toString()
    );
    if (!entry) return res.json({ message: 'Entry not found' });

    // Update CE hours
    entry.ceHoursCompleted = (entry.ceHoursCompleted || 0) + ceHoursEarned;

    // Check if registration credit qualifies (10 CE hours threshold)
    if (entry.ceHoursCompleted >= REG_CE_THRESHOLD &&
        entry.registrationCreditStatus === 'pending') {
      entry.registrationCreditStatus = 'qualified';

      // Auto-convert: every qualified credit reduces pending, adds to converted
      ref.convertRegistrationCredit(entry._id);
    }

    await ref.save();

    res.json({
      message: 'CE hours updated',
      ceHoursCompleted: entry.ceHoursCompleted,
      registrationCreditStatus: entry.registrationCreditStatus
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ════════════════════════════════════════════
// ADMIN ENDPOINTS
// ════════════════════════════════════════════

// ── List all referral programs ──
router.get('/admin/all', protect, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 25, search, track } = req.query;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));

    const query = {};
    if (track) query.activeTrack = Number(track);

    let referrals = Referral.find(query)
      .populate('referrerId', 'email profile.firstName profile.lastName')
      .sort({ totalPaidConversions: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    const [results, total] = await Promise.all([
      referrals,
      Referral.countDocuments(query)
    ]);

    let filtered = results;
    if (search) {
      const s = search.toLowerCase();
      filtered = results.filter(r => {
        const ref = r.referrerId;
        if (!ref) return false;
        return (ref.email?.toLowerCase().includes(s) ||
          ref.profile?.firstName?.toLowerCase().includes(s) ||
          ref.profile?.lastName?.toLowerCase().includes(s) ||
          r.referralCode?.toLowerCase().includes(s));
      });
    }

    res.json({
      referrals: filtered,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Admin: get program stats summary ──
router.get('/admin/stats', protect, requireAdmin, async (req, res) => {
  try {
    const [total, active, track2Unlocked, track3Unlocked] = await Promise.all([
      Referral.countDocuments(),
      Referral.countDocuments({ isActive: true }),
      Referral.countDocuments({ 'rewards.track2.unlocked': true }),
      Referral.countDocuments({ 'rewards.track3.unlocked': true })
    ]);

    const agg = await Referral.aggregate([
      {
        $group: {
          _id: null,
          totalClicks: { $sum: '$totalClicks' },
          totalSignups: { $sum: '$totalSignups' },
          totalConversions: { $sum: '$totalPaidConversions' },
          totalCreditsIssued: { $sum: '$totalRewardsEarned' },
          totalCreditsBalance: { $sum: '$creditsBalance' }
        }
      }
    ]);

    const stats = agg[0] || {};
    res.json({
      programs: { total, active },
      milestones: { track2Unlocked, track3Unlocked },
      totals: {
        clicks: stats.totalClicks || 0,
        signups: stats.totalSignups || 0,
        conversions: stats.totalConversions || 0,
        creditsIssued: stats.totalCreditsIssued || 0,
        creditsOutstanding: stats.totalCreditsBalance || 0
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Admin: toggle revenue share for Track 3 ──
router.post('/admin/revenue-share', protect, requireAdmin, validate({
  body: { referrerId: 'string' }
}), async (req, res) => {
  try {
    const { referrerId, stripeConnectAccountId, activate } = req.body;

    const ref = await Referral.findOne({ referrerId });
    if (!ref) return res.status(404).json({ error: 'Referral profile not found' });

    if (!ref.rewards.track3.unlocked) {
      return res.status(400).json({ error: 'Track 3 not unlocked yet' });
    }

    if (activate) {
      if (!stripeConnectAccountId) {
        return res.status(400).json({ error: 'Stripe Connect account ID required' });
      }
      ref.rewards.track3.stripeConnectAccountId = stripeConnectAccountId;
      ref.rewards.track3.revenueShareActive = true;
      ref.rewards.track3.revenueShareStartedAt = new Date();
    } else {
      ref.rewards.track3.revenueShareActive = false;
    }

    await ref.save();
    res.json({ message: activate ? 'Revenue share activated' : 'Revenue share deactivated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Admin: manually convert a referral ──
router.post('/admin/manual-convert', protect, requireAdmin, validate({
  body: { referralCode: 'string', email: 'email' }
}), async (req, res) => {
  try {
    const { referralCode, email } = req.body;
    const ref = await Referral.findOne({ referralCode });
    if (!ref) return res.status(404).json({ error: 'Referral code not found' });

    const entry = ref.referrals.find(r => r.referredEmail === email.toLowerCase());
    if (!entry) return res.status(404).json({ error: 'Referred email not found in this program' });

    if (entry.status === 'rewarded') {
      return res.json({ message: 'Already rewarded' });
    }

    entry.status = 'rewarded';
    entry.subscribedAt = entry.subscribedAt || new Date();
    entry.rewardedAt = new Date();
    ref.totalPaidConversions += 1;
    ref.subscriptionCredits += TRACK1_REWARD;
    ref.creditsBalance += TRACK1_REWARD;
    ref.totalRewardsEarned += TRACK1_REWARD;
    ref.checkMilestones();
    await ref.save();

    res.json({
      message: `Manually converted. $${TRACK1_REWARD} credited.`,
      creditsBalance: ref.creditsBalance,
      totalPaidConversions: ref.totalPaidConversions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
