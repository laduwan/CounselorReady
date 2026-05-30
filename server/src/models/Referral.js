/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 *
 * "Pass the Key" Referral Program — 3-track reward system
 * Track 1: Steady Savings — $5 credit per confirmed paying referral
 * Track 2: Course Unlock — 5 paying referrals → free premium course
 * Track 3: Revenue Share — 50 paying subs → $100 cash + 10% monthly rev share
 *
 * Registration credits: $0.50 pending per signup, converts to $5 discount
 * only after referred members accumulate 10 CE hours total
 */
import mongoose from 'mongoose';
import crypto from 'crypto';

const referredUserSchema = new mongoose.Schema({
  referredEmail: { type: String, lowercase: true, required: true },
  referredUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: {
    type: String,
    enum: [
      'clicked',        // clicked the link
      'registered',     // created account
      'trialing',       // in 7-day free trial
      'subscribed',     // converted to paid
      'churned',        // subscribed then cancelled
      'rewarded'        // referrer credited for this referral
    ],
    default: 'clicked'
  },
  // CE hours the referred user has completed (for registration credit conversion)
  ceHoursCompleted: { type: Number, default: 0 },
  // Registration credit: $0.50 pending until referred user hits 10 CE hours
  registrationCreditStatus: {
    type: String,
    enum: ['pending', 'qualified', 'converted', 'expired'],
    default: 'pending'
  },
  clickedAt: Date,
  registeredAt: Date,
  subscribedAt: Date,
  rewardedAt: Date,
  churnedAt: Date
}, { _id: true });

const trackRewardSchema = new mongoose.Schema({
  // Track 2 course reward
  track2: {
    unlocked: { type: Boolean, default: false },
    unlockedAt: Date,
    courseChoice: {
      type: String,
      enum: ['intake-to-remit', 'telemental-health', null],
      default: null
    },
    supervisionAddon: { type: Boolean, default: false },
    redeemed: { type: Boolean, default: false },
    redeemedAt: Date
  },
  // Track 3 revenue share
  track3: {
    unlocked: { type: Boolean, default: false },
    unlockedAt: Date,
    cashBonusPaid: { type: Boolean, default: false },
    cashBonusPaidAt: Date,
    stripeConnectAccountId: String,
    revenueShareActive: { type: Boolean, default: false },
    revenueShareStartedAt: Date,
    totalRevenueShared: { type: Number, default: 0 } // lifetime $ paid out
  }
}, { _id: false });

const referralSchema = new mongoose.Schema({
  // Referrer
  referrerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  referralCode: {
    type: String,
    unique: true,
    required: true,
    default: () => 'CR-' + crypto.randomBytes(4).toString('hex').toUpperCase()
  },

  // Active track (user picks one, can upgrade)
  activeTrack: {
    type: Number,
    enum: [1, 2, 3],
    default: 1
  },

  // All referred users
  referrals: [referredUserSchema],

  // Track rewards state
  rewards: { type: trackRewardSchema, default: () => ({}) },

  // ── Credits & Payouts ──

  // Track 1: $5 per confirmed paying referral
  subscriptionCredits: { type: Number, default: 0 }, // total $ earned from Track 1

  // Registration credits: $0.50 each, pending until referred user hits 10 CE hrs
  pendingRegistrationCredits: { type: Number, default: 0 }, // count of $0.50 pending
  convertedRegistrationCredits: { type: Number, default: 0 }, // converted to $5 discounts

  // Spendable balance (subscription credits + converted reg credits)
  creditsBalance: { type: Number, default: 0 },

  // ── Lifetime Stats ──
  totalClicks: { type: Number, default: 0 },
  totalSignups: { type: Number, default: 0 },
  totalPaidConversions: { type: Number, default: 0 },
  totalRewardsEarned: { type: Number, default: 0 }, // all-time $ value

  // Settings
  isActive: { type: Boolean, default: true },
  isFoundingMember: { type: Boolean, default: false }
}, {
  timestamps: true
});

// ── Computed helpers ──

referralSchema.methods.getPaidReferralCount = function () {
  return this.referrals.filter(r =>
    r.status === 'subscribed' || r.status === 'rewarded'
  ).length;
};

referralSchema.methods.getRegisteredCount = function () {
  return this.referrals.filter(r =>
    r.status !== 'clicked'
  ).length;
};

// Check and unlock track milestones
referralSchema.methods.checkMilestones = function () {
  const paidCount = this.getPaidReferralCount();
  const changes = [];

  // Track 2: 5 paying referrals → unlock course choice
  if (paidCount >= 5 && !this.rewards.track2.unlocked) {
    this.rewards.track2.unlocked = true;
    this.rewards.track2.unlockedAt = new Date();
    changes.push('track2_unlocked');
  }

  // Track 3: 50 paying referrals → unlock cash bonus + rev share
  if (paidCount >= 50 && !this.rewards.track3.unlocked) {
    this.rewards.track3.unlocked = true;
    this.rewards.track3.unlockedAt = new Date();
    changes.push('track3_unlocked');
  }

  return changes;
};

// Process a registration credit conversion when referred user hits 10 CE hours
referralSchema.methods.convertRegistrationCredit = function (referralEntryId) {
  const entry = this.referrals.id(referralEntryId);
  if (!entry || entry.registrationCreditStatus !== 'qualified') return false;

  entry.registrationCreditStatus = 'converted';
  this.pendingRegistrationCredits = Math.max(0, this.pendingRegistrationCredits - 1);
  this.convertedRegistrationCredits += 1;

  // Every 10 converted registration credits = $5 discount
  if (this.convertedRegistrationCredits % 10 === 0) {
    this.creditsBalance += 5;
    this.totalRewardsEarned += 5;
  }

  return true;
};

referralSchema.index({ referrerId: 1 }, { unique: true });
referralSchema.index({ 'referrals.referredEmail': 1 });
referralSchema.index({ 'referrals.referredUserId': 1 });

const Referral = mongoose.model('Referral', referralSchema);
export default Referral;
