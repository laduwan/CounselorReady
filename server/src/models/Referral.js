/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';
import crypto from 'crypto';

const referralSchema = new mongoose.Schema({
  // Referrer (the person sharing)
  referrerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  referralCode: {
    type: String,
    unique: true,
    required: true,
    default: () => crypto.randomBytes(5).toString('hex').toUpperCase()
  },

  // Tracking
  referrals: [{
    referredEmail: { type: String, lowercase: true },
    referredUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      enum: ['pending', 'registered', 'subscribed', 'rewarded'],
      default: 'pending'
    },
    registeredAt: Date,
    subscribedAt: Date,
    rewardedAt: Date
  }],

  // Rewards earned
  totalRewardsEarned: { type: Number, default: 0 }, // in dollars
  pendingRewards: { type: Number, default: 0 },
  creditsBalance: { type: Number, default: 0 }, // account credit in dollars

  // Lifetime stats
  totalClicks: { type: Number, default: 0 },
  totalSignups: { type: Number, default: 0 },
  totalConversions: { type: Number, default: 0 },

  // Settings
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

referralSchema.index({ referrerId: 1 }, { unique: true });
referralSchema.index({ referralCode: 1 }, { unique: true });
referralSchema.index({ 'referrals.referredEmail': 1 });

const Referral = mongoose.model('Referral', referralSchema);
export default Referral;
