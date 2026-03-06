/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import express from 'express';
import Referral from '../models/Referral.js';
import User from '../models/User.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

const REWARD_AMOUNT = 10; // $10 credit per successful referral

// ── Get or create my referral profile ──
router.get('/my', protect, async (req, res) => {
  try {
    let referral = await Referral.findOne({ referrerId: req.user._id });
    if (!referral) {
      referral = await Referral.create({ referrerId: req.user._id });
    }

    res.json({
      referralCode: referral.referralCode,
      referralLink: `${process.env.CLIENT_URL || 'https://counselorready.com'}/register?ref=${referral.referralCode}`,
      stats: {
        totalClicks: referral.totalClicks,
        totalSignups: referral.totalSignups,
        totalConversions: referral.totalConversions,
        totalRewardsEarned: referral.totalRewardsEarned,
        creditsBalance: referral.creditsBalance
      },
      referrals: referral.referrals.map(r => ({
        email: r.referredEmail ? r.referredEmail.replace(/(.{2}).*(@.*)/, '$1***$2') : 'Unknown',
        status: r.status,
        registeredAt: r.registeredAt,
        rewardedAt: r.rewardedAt
      })),
      isActive: referral.isActive
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Track a referral link click ──
router.post('/track/:code', async (req, res) => {
  try {
    const referral = await Referral.findOne({ referralCode: req.params.code, isActive: true });
    if (!referral) return res.status(404).json({ error: 'Invalid referral code' });

    referral.totalClicks += 1;
    await referral.save();

    res.json({ valid: true, code: referral.referralCode });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Record a signup from referral (called during registration) ──
router.post('/register', async (req, res) => {
  try {
    const { referralCode, email, userId } = req.body;
    if (!referralCode || !email) {
      return res.status(400).json({ error: 'Referral code and email required' });
    }

    const referral = await Referral.findOne({ referralCode, isActive: true });
    if (!referral) return res.status(404).json({ error: 'Invalid referral code' });

    // Prevent self-referral
    const referrer = await User.findById(referral.referrerId);
    if (referrer?.email === email.toLowerCase()) {
      return res.status(400).json({ error: 'Cannot refer yourself' });
    }

    // Check for duplicate
    const alreadyReferred = referral.referrals.find(
      r => r.referredEmail === email.toLowerCase()
    );
    if (alreadyReferred) {
      return res.json({ message: 'Already tracked' });
    }

    referral.referrals.push({
      referredEmail: email.toLowerCase(),
      referredUserId: userId,
      status: 'registered',
      registeredAt: new Date()
    });
    referral.totalSignups += 1;
    await referral.save();

    res.json({ message: 'Referral recorded' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Process referral reward when referred user subscribes ──
router.post('/convert', protect, requireAdmin, async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Find which referral includes this user
    const referral = await Referral.findOne({
      'referrals.referredUserId': userId,
      'referrals.status': 'registered'
    });
    if (!referral) return res.json({ message: 'No pending referral for this user' });

    const entry = referral.referrals.find(
      r => r.referredUserId?.toString() === userId && r.status === 'registered'
    );
    if (!entry) return res.json({ message: 'Already processed' });

    entry.status = 'rewarded';
    entry.subscribedAt = new Date();
    entry.rewardedAt = new Date();
    referral.totalConversions += 1;
    referral.totalRewardsEarned += REWARD_AMOUNT;
    referral.creditsBalance += REWARD_AMOUNT;
    await referral.save();

    res.json({
      message: `Referral reward of $${REWARD_AMOUNT} credited`,
      referrerId: referral.referrerId,
      creditsBalance: referral.creditsBalance
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Admin: list all referral programs ──
router.get('/admin/all', protect, requireAdmin, async (req, res) => {
  try {
    const referrals = await Referral.find()
      .populate('referrerId', 'email profile.firstName profile.lastName')
      .sort({ totalConversions: -1 });
    res.json(referrals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
