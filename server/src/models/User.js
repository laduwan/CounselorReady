/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8,
    select: false // Don't return password by default
  },
  
  // Profile
  profile: {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, trim: true, default: '' },
    certificateName: { type: String, trim: true, maxLength: 200 },
    avatar: { type: String },
    state: { type: String, uppercase: true }, // For CE requirements
    timezone: { type: String, default: 'America/New_York' },
    phone: { type: String },
    pronouns: { type: String, default: '', maxlength: 50 },
    npi: {
      type: String,
      default: '',
      validate: {
        validator: v => !v || /^\d{10}$/.test(v),
        message: 'NPI must be exactly 10 digits'
      }
    },
    specializations: { type: [String], default: [] },
    supervisor: {
      name:        { type: String, default: '', maxlength: 200 },
      license:     { type: String, default: '', maxlength: 50 },
      credentials: { type: String, default: '', maxlength: 100 },
      startDate:   { type: Date,   default: null }
    }
  },
  
  // Individual course purchases (for à la carte buying)
  purchasedCourses: [{
    courseId: { type: mongoose.Schema.Types.ObjectId },
    slug: String,
    purchasedAt: { type: Date, default: Date.now },
    amount: Number,
    stripeSessionId: String
  }],

  unlockedTools: [
    {
      toolKey: { type: String, required: true },
      unlockedAt: { type: Date, default: Date.now },
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
      expiresAt: { type: Date }
    }
  ],

  // Primary state for Free/Professional users (VIP can track any)
  primaryState: {
    type: String,
    uppercase: true
  },
  
  // Consultation tracking (VIP perk - 1 per quarter)
  consultations: [{
    requestedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    topic: { type: String },
    notes: { type: String },
    quarter: { type: String } // e.g., "2026-Q1"
  }],
  
  // Free tier tracking
  freeHoursUsed: { type: Number, default: 0, min: 0 }, // deprecated — kept for backward compat
  freeCoursesThisMonth: { type: Number, default: 0, min: 0 },
  freeCoursesResetMonth: { type: String, default: '' }, // format: "2026-04"
  freeCoursesUsedThisMonth: { type: Number, default: 0 },
  trialCoursesUsed: { type: Number, default: 0 }, // lifetime no-card trial courses used (cap 2)
  freeLimitEmailSentThisMonth: { type: Boolean, default: false },

  // Subscription
  subscription: {
    status: {
      type: String,
      enum: ['free', 'trial', 'active', 'canceled', 'expired', 'past_due', 'paused', 'lifetime'],
      default: 'free'
    },
    plan: {
      type: String,
      // 'monthly'/'annual' are the new membership plans; legacy values retained
      // (removing enum values invalidates existing subscriber documents).
      enum: ['free', 'starter', 'professional', 'vip', 'annual_vip', 'lifetime', 'monthly', 'annual'],
      default: 'free'
    },
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String },
    currentPeriodStart: { type: Date },
    currentPeriodEnd: { type: Date },
    cancelAtPeriodEnd: { type: Boolean, default: false },
    trialEndsAt: { type: Date },
    
    // Payment failure tracking
    paymentFailedAt: { type: Date },
    paymentFailureCount: { type: Number, default: 0 },
    paymentRecoveredAt: { type: Date },

    // Actual monthly amount charged after discounts (in cents). Updated on every invoice.paid.
    // Used for real MRR calculation — never estimate from plan name.
    monthlyAmountCents: { type: Number, default: 0 },

    // Trial conversion email tracking — prevents double-sending
    trialEmailsSent: {
      type: [String],
      default: []
      // Possible values: 'ending_soon', 'ending_tomorrow', 'ended'
    },

    // Set once notifyCredentialTrackingSunset.js emails a Free-tier user
    // with tracked credentials — prevents re-sending on subsequent runs.
    credentialSunsetNoticeSentAt: { type: Date }
  },
  
  // Hardship Pause System (VIP perk)
  hardshipPause: {
    // Current year's available month (resets each year)
    available: { type: Number, default: 1 },
    
    // Months rolled over from previous years
    banked: { type: Number, default: 0 },
    
    // Lifetime usage count
    usedTotal: { type: Number, default: 0 },
    
    // Usage history
    history: [{
      usedDate: { type: Date, default: Date.now },
      reason: { type: String }, // Optional: why they needed the pause
      yearBanked: { type: Number } // Which year this month came from
    }],
    
    // When we last rolled over unused months
    lastRolloverDate: { type: Date },
    
    // Year tracking for rollover logic
    lastRolloverYear: { type: Number },
    
    // Currently in a hardship pause?
    isActive: { type: Boolean, default: false },
    pauseStartDate: { type: Date },
    pauseEndDate: { type: Date }
  },
  
  // Liability Insurance Tracking
  liabilityInsurance: {
    provider: { type: String }, // e.g., "HPSO", "CPH & Associates"
    policyNumber: { type: String },
    coverageAmount: { type: Number }, // e.g., 1000000 for $1M
    aggregateCoverage: { type: Number }, // e.g., 3000000 for $3M aggregate
    annualPremium: { type: Number }, // Cost per year
    effectiveDate: { type: Date },
    expirationDate: { type: Date },
    autoRenew: { type: Boolean, default: false },
    coverageType: { 
      type: String, 
      enum: ['occurrence', 'claims-made'],
      default: 'occurrence'
    },
    tailCoverage: { type: Boolean, default: false }, // For claims-made policies
    lastComparisonDate: { type: Date }, // When they last ran cost comparison
    notes: { type: String }
  },
  
  // Insurance reminder preferences
  insuranceReminders: {
    enabled: { type: Boolean, default: true },
    reminderDays: { type: Number, default: 30 }, // Days before expiration
    lastReminderSent: { type: Date }
  },
  
  // Phone & SMS verification
  phone: { type: String },
  smsVerified: { type: Boolean, default: false },
  smsRemindersEnabled: { type: Boolean, default: false },

  // Google Calendar Integration
  googleCalendar: {
    connected: { type: Boolean, default: false },
    email: { type: String, default: null },
    accessToken: { type: String, default: null },
    refreshToken: { type: String, default: null },
    tokenExpiry: { type: Date, default: null },
    calendarId: { type: String, default: 'primary' },
    syncEnabled: { type: Boolean, default: false },
    lastSyncAt: { type: Date, default: null },
    eventIds: [{
      credentialId: { type: mongoose.Schema.Types.ObjectId },
      googleEventId: { type: String },
      type: { type: String, enum: ['credential', 'insurance'] }
    }]
  },

  // Notification preferences
  notifications: {
    email: {
      courseCompleted: { type: Boolean, default: true },
      certificateReady: { type: Boolean, default: true },
      courseReminder: { type: Boolean, default: true },
      ceRenewalReminders: { type: Boolean, default: true },
      ceMilestones: { type: Boolean, default: true },
      lowHoursAlert: { type: Boolean, default: true },
      credentialExpiring: { type: Boolean, default: true },
      insuranceExpiring: { type: Boolean, default: true },
      newCourseAnnouncements: { type: Boolean, default: true },
      promotions: { type: Boolean, default: false },
      platformUpdates: { type: Boolean, default: false },
      weeklyDigest: { type: Boolean, default: false },
    },
    sms: {
      enabled: { type: Boolean, default: false },
      ceRenewalReminders: { type: Boolean, default: true },
      lowHoursAlert: { type: Boolean, default: true },
      credentialExpiring: { type: Boolean, default: true },
      insuranceExpiring: { type: Boolean, default: true },
      courseCompleted: { type: Boolean, default: false },
      ceMilestones: { type: Boolean, default: false },
    },
    timing: {
      reminderDays: { type: [Number], default: [90, 30, 7] },
      lowHoursThreshold: { type: Number, default: 60 },
      insuranceReminderDays: { type: [Number], default: [30, 14] },
      quietHoursStart: { type: String, default: null },
      quietHoursEnd: { type: String, default: null },
    },
    inApp: {
      showBannerAnnouncements: { type: Boolean, default: true },
      showCourseProgress: { type: Boolean, default: true },
      showCeTracker: { type: Boolean, default: true },
    },
    unsubscribeAll: { type: Boolean, default: false },
    lastUpdated: { type: Date, default: Date.now }
  },
  
  // Saved RNR CE articles
  savedRNRArticles: { type: [mongoose.Schema.Types.ObjectId], ref: 'ScholarlyArticle', default: [] },

  // Whitelabel partner association
  partnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Partner'
  },

  // Metadata
  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String },
  emailVerificationExpires: { type: Date },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
  role: {
    type: String,
    enum: ['user', 'admin', 'partner_admin', 'support'],
    default: 'user'
  },
  lastLoginAt: { type: Date },
  
  // Account status
  disabled: { type: Boolean, default: false },
  disabledAt: { type: Date },
  disabledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Password reset
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },

  // Recovery email (separate from primary login email)
  recoveryEmail:         { type: String, default: '', lowercase: true, trim: true },
  recoveryEmailVerified: { type: Boolean, default: false },
  recoveryEmailToken:    { type: String, default: null, select: false },
  recoveryEmailExpires:  { type: Date,   default: null, select: false },

  // Two-factor authentication
  twoFactorEnabled:     { type: Boolean, default: false },
  twoFactorSecret:      { type: String, default: null, select: false },
  twoFactorBackupCodes: { type: [String], default: [], select: false },
  twoFactorEnabledAt:   { type: Date, default: null },

  // GDPR / data-export tracking
  lastDataExportAt: { type: Date, default: null },

  // Track membership tenure for loyalty benefits
  memberSince: { type: Date },
  voluntaryCancelDate: { type: Date }, // Track if they voluntarily canceled

  // ── New membership live-CE allowances ──
  // Monthly plan: 1 live session per calendar month (≤2 CE hrs).
  liveSessionUsedThisMonth: { type: Boolean, default: false },
  liveSessionMonthResetAt: { type: Date },   // first day of next calendar month
  // Annual / VIP plan: 15 live CE hours per membership year.
  liveHoursUsedThisYear: { type: Number, default: 0 },
  liveHoursYearResetAt: { type: Date },      // memberSince + 1 year, renews annually
  
  // Admin notification preferences (only used for admin users)
  adminNotifPrefs: {
    notifyRegistration:       { type: Boolean, default: true },
    notifyEnrollment:         { type: Boolean, default: true },
    notifyCompletion:         { type: Boolean, default: true },
    notifyQuizPass:           { type: Boolean, default: false },
    notifyQuizFail:           { type: Boolean, default: true },
    notifySubscriptionStart:  { type: Boolean, default: true },
    notifySubscriptionCancel: { type: Boolean, default: true },
    notifyPayment:            { type: Boolean, default: true },
    notifyPaymentFail:        { type: Boolean, default: true },
    notifyCertificate:        { type: Boolean, default: false },
  },

  // Admin activity feed (only used for admin users)
  adminActivityFeed: [{
    type: { type: String },
    data: { type: mongoose.Schema.Types.Mixed },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String },
    userEmail: { type: String },
    timestamp: { type: Date, default: Date.now }
  }],

  // ─── REWARDS: REFERRAL ───
  referralCode: { type: String, unique: true, sparse: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

  // ─── REWARDS: CARECREDITS ───
  careCredits: {
    balance:  { type: Number, default: 0, min: 0 },
    lifetime: { type: Number, default: 0, min: 0 },
    transactions: [{
      amount: { type: Number, required: true },
      type: {
        type: String,
        enum: [
          'referral_signup','referral_paid','referral_retention_bonus',
          'course_completion','certificate_earned','course_review',
          'course_evaluation','social_share','reflection_submitted',
          'streak_7day','streak_30day',
          'redemption_stripe_credit','redemption_giftcard',
          'admin_adjustment',
        ],
        required: true,
      },
      description: String,
      relatedCourseId: { type: mongoose.Schema.Types.ObjectId, ref: 'InteractiveCourse', default: null },
      relatedRedemptionId: String,
      createdAt: { type: Date, default: Date.now },
    }],
    redemptions: [{
      redemptionId: { type: String, required: true },
      type: { type: String, enum: ['stripe_credit','gift_card'], required: true },
      points: { type: Number, required: true },
      vendor: String,
      vendorLabel: String,
      cashValue: { type: Number, required: true },
      deliveryEmail: String,
      status: { type: String, enum: ['queued','fulfilled','cancelled'], default: 'queued' },
      stripeCouponId: String,
      giftCardCode: String,
      createdAt: { type: Date, default: Date.now },
      fulfilledAt: Date,
      cancelledAt: Date,
      adminNotes: String,
    }],
  },

  // ─── REWARDS: REFERRAL TRACKING ───
  referrals: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['signed_up','paid','retained_3mo'], default: 'signed_up' },
    earnedCredits: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  }],

  // ─── REWARDS: REFLECTION DEDUP (v1.1) ───
  reflectionsEarned: { type: [String], default: [], index: true },

  // ─── REWARDS: UNIVERSAL EARN DEDUP (v2 — Day 2) ───
  // Tracks dedup keys for course completion, certificate, course
  // review, referral signup, referral paid. Format: '{type}:{id}'.
  // Reflection earns live in `reflectionsEarned[]` (Day 1) — kept
  // separate because reflection is 1:many per course.
  earnedKeys: {
    type: [String],
    default: [],
    index: true,
  },
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Index for faster queries
userSchema.index({ 'subscription.status': 1 });
userSchema.index({ 'profile.state': 1 });
userSchema.index({ 'subscription.paymentFailedAt': 1 });

// Hash password before saving + generate referralCode if missing
userSchema.pre('save', async function(next) {
  try {
    if (this.isModified('passwordHash')) {
      const salt = await bcrypt.genSalt(12);
      this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    }

    if (!this.referralCode) {
      const generateCode = () => {
        const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = '';
        for (let i = 0; i < 8; i++) code += alphabet[Math.floor(Math.random() * alphabet.length)];
        return code;
      };
      let assigned = false;
      for (let attempt = 0; attempt < 5; attempt++) {
        const candidate = generateCode();
        const existing = await this.constructor.findOne({ referralCode: candidate }).lean();
        if (!existing) { this.referralCode = candidate; assigned = true; break; }
      }
      if (!assigned) return next(new Error('Failed to generate unique referralCode after 5 attempts'));
    }

    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Check if subscription is active
userSchema.methods.hasActiveSubscription = function() {
  const activeStatuses = ['active', 'trial', 'lifetime', 'paused'];
  return activeStatuses.includes(this.subscription.status);
};

// Check subscription tier level (higher number = more access)
userSchema.methods.getSubscriptionTier = function() {
  const tierLevels = {
    'free': 0,
    'starter': 1,
    'professional': 2,
    'vip': 3,
    'annual_vip': 3,
    'lifetime': 4
  };
  if (!this.hasActiveSubscription()) return 0;
  return tierLevels[this.subscription.plan] || 0;
};

// Check if user can access a course based on subscription
userSchema.methods.canAccessCourse = function(course) {
  // Free courses are always accessible
  if (course.accessTier === 'free' || !course.accessTier) return true;
  
  // Check if user has purchased this specific course
  if (course.price && this.purchasedCourses?.some(pc => pc.courseId?.toString() === course._id?.toString())) return true;
  
  // Check subscription tier
  const tierLevels = { 'free': 0, 'starter': 1, 'professional': 2, 'vip': 3 };
  const userTier = this.getSubscriptionTier();
  const requiredTier = tierLevels[course.accessTier] || 0;
  
  return userTier >= requiredTier;
};

// Check if user can track credentials in a specific state
userSchema.methods.canTrackState = function(state) {
  // VIP and Annual VIP can track any state
  if (['vip', 'annual_vip', 'lifetime'].includes(this.subscription.plan)) {
    return true;
  }
  
  // Free and Professional can only track their primary state
  if (!this.primaryState) {
    // No primary state set yet - they can set this one
    return true;
  }
  
  return this.primaryState.toUpperCase() === state.toUpperCase();
};

// Get max states allowed for subscription
userSchema.methods.getMaxStates = function() {
  if (['vip', 'annual_vip', 'lifetime'].includes(this.subscription.plan)) {
    return 999; // Unlimited
  }
  return 1; // Free, Basic, and Professional
};

// ============================================
// HARDSHIP PAUSE METHODS
// ============================================

// Get total available hardship months (current year + banked)
userSchema.methods.getTotalHardshipMonths = function() {
  return (this.hardshipPause.available || 0) + (this.hardshipPause.banked || 0);
};

// Check if user can use hardship pause
userSchema.methods.canUseHardshipPause = function() {
  // Must be VIP
  if (!this.isVip()) {
    return { allowed: false, reason: 'VIP subscription required' };
  }
  
  // Must have active subscription
  if (this.subscription.status !== 'active') {
    return { allowed: false, reason: 'Active subscription required' };
  }
  
  // Must have months available
  const totalAvailable = this.getTotalHardshipMonths();
  if (totalAvailable < 1) {
    return { allowed: false, reason: 'No hardship months available' };
  }
  
  // Can't already be paused
  if (this.hardshipPause.isActive) {
    return { allowed: false, reason: 'Already in a hardship pause' };
  }
  
  return { 
    allowed: true, 
    monthsAvailable: totalAvailable,
    bankedMonths: this.hardshipPause.banked || 0
  };
};

// Use a hardship pause month
userSchema.methods.useHardshipPause = function(reason = '') {
  const canUse = this.canUseHardshipPause();
  if (!canUse.allowed) {
    throw new Error(canUse.reason);
  }
  
  // Use banked months first, then current year's
  let yearBanked;
  if (this.hardshipPause.banked > 0) {
    this.hardshipPause.banked -= 1;
    yearBanked = this.hardshipPause.lastRolloverYear || new Date().getFullYear() - 1;
  } else {
    this.hardshipPause.available -= 1;
    yearBanked = new Date().getFullYear();
  }
  
  // Record usage
  this.hardshipPause.usedTotal += 1;
  this.hardshipPause.history.push({
    usedDate: new Date(),
    reason,
    yearBanked
  });
  
  // Set pause status
  this.hardshipPause.isActive = true;
  this.hardshipPause.pauseStartDate = new Date();
  this.hardshipPause.pauseEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  this.subscription.status = 'paused';
  
  return this.save();
};

// End hardship pause (called when pause period ends)
userSchema.methods.endHardshipPause = function() {
  this.hardshipPause.isActive = false;
  this.hardshipPause.pauseStartDate = null;
  this.hardshipPause.pauseEndDate = null;
  this.subscription.status = 'active';
  
  return this.save();
};

// Annual rollover - call this on subscription anniversary or Jan 1
userSchema.methods.rolloverHardshipMonth = function() {
  const currentYear = new Date().getFullYear();
  
  // Don't rollover if already done this year
  if (this.hardshipPause.lastRolloverYear === currentYear) {
    return false;
  }
  
  // If they didn't use their month, bank it
  if (this.hardshipPause.available > 0) {
    this.hardshipPause.banked += this.hardshipPause.available;
  }
  
  // Reset available to 1 for new year
  this.hardshipPause.available = 1;
  this.hardshipPause.lastRolloverDate = new Date();
  this.hardshipPause.lastRolloverYear = currentYear;
  
  return this.save();
};

// Get grace period based on banked months (loyalty reward)
userSchema.methods.getGracePeriodDays = function() {
  const banked = this.hardshipPause.banked || 0;
  
  if (banked >= 3) return 30;  // 3+ years loyalty = 30 days
  if (banked >= 1) return 14;  // 1-2 years loyalty = 14 days
  return 7;                     // New member = 7 days
};

// Check if still within grace period for failed payment
userSchema.methods.isWithinGracePeriod = function() {
  if (!this.subscription.paymentFailedAt) return true;
  
  const graceDays = this.getGracePeriodDays();
  const failedAt = new Date(this.subscription.paymentFailedAt);
  const graceEnds = new Date(failedAt.getTime() + graceDays * 24 * 60 * 60 * 1000);
  
  return new Date() <= graceEnds;
};

// Get days remaining in grace period
userSchema.methods.getGracePeriodRemaining = function() {
  if (!this.subscription.paymentFailedAt) return null;
  
  const graceDays = this.getGracePeriodDays();
  const failedAt = new Date(this.subscription.paymentFailedAt);
  const graceEnds = new Date(failedAt.getTime() + graceDays * 24 * 60 * 60 * 1000);
  const remaining = Math.ceil((graceEnds - new Date()) / (1000 * 60 * 60 * 24));
  
  return Math.max(0, remaining);
};

// Handle payment failure
userSchema.methods.handlePaymentFailure = function() {
  if (!this.subscription.paymentFailedAt) {
    this.subscription.paymentFailedAt = new Date();
  }
  this.subscription.paymentFailureCount += 1;
  this.subscription.status = 'past_due';
  
  return this.save();
};

// Handle payment recovered within grace period
userSchema.methods.handlePaymentRecovered = function() {
  this.subscription.paymentFailedAt = null;
  this.subscription.paymentFailureCount = 0;
  this.subscription.status = 'active';
  
  return this.save();
};

// Handle grace period expired (reset banked months)
userSchema.methods.handleGracePeriodExpired = function() {
  // Lost their banked months due to lapsed payment
  this.hardshipPause.banked = 0;
  this.hardshipPause.available = 0;
  this.subscription.status = 'expired';
  this.subscription.paymentFailedAt = null;
  
  return this.save();
};

// Handle voluntary cancellation (immediate reset)
userSchema.methods.handleVoluntaryCancel = function() {
  this.hardshipPause.banked = 0;
  this.hardshipPause.available = 0;
  this.subscription.status = 'canceled';
  this.voluntaryCancelDate = new Date();
  
  return this.save();
};

// Rejoin after cancellation (start fresh)
userSchema.methods.handleRejoin = function(plan) {
  this.subscription.plan = plan;
  this.subscription.status = 'active';
  this.hardshipPause.available = 1;
  this.hardshipPause.banked = 0;
  this.hardshipPause.lastRolloverYear = new Date().getFullYear();
  this.voluntaryCancelDate = null;
  
  if (!this.memberSince) {
    this.memberSince = new Date();
  }
  
  return this.save();
};

// ============================================
// CONSULTATION METHODS
// ============================================

// Get current quarter string (e.g., "2026-Q1")
userSchema.methods.getCurrentQuarter = function() {
  const now = new Date();
  const quarter = Math.ceil((now.getMonth() + 1) / 3);
  return `${now.getFullYear()}-Q${quarter}`;
};

// Check if user has used their quarterly consult
userSchema.methods.hasUsedQuarterlyConsult = function() {
  const currentQuarter = this.getCurrentQuarter();
  return this.consultations?.some(c => c.quarter === currentQuarter);
};

// Check if user can book a consultation
userSchema.methods.canBookConsultation = function() {
  // Must be active VIP
  if (!['vip', 'annual_vip', 'lifetime'].includes(this.subscription.plan)) {
    return { allowed: false, reason: 'VIP subscription required' };
  }
  
  if (this.subscription.status !== 'active' && this.subscription.status !== 'lifetime') {
    return { allowed: false, reason: 'Active subscription required' };
  }
  
  // Check if already used this quarter
  if (this.hasUsedQuarterlyConsult()) {
    return { allowed: false, reason: 'Quarterly consult already used', nextQuarter: this.getNextQuarter() };
  }
  
  return { allowed: true };
};

// Get next quarter string
userSchema.methods.getNextQuarter = function() {
  const now = new Date();
  const currentQuarter = Math.ceil((now.getMonth() + 1) / 3);
  if (currentQuarter === 4) {
    return `${now.getFullYear() + 1}-Q1`;
  }
  return `${now.getFullYear()}-Q${currentQuarter + 1}`;
};

// Book a consultation
userSchema.methods.bookConsultation = function(topic) {
  const canBook = this.canBookConsultation();
  if (!canBook.allowed) {
    throw new Error(canBook.reason);
  }
  
  this.consultations.push({
    requestedAt: new Date(),
    topic,
    quarter: this.getCurrentQuarter()
  });
  
  return this.save();
};

// Check if user is VIP tier
userSchema.methods.isVip = function() {
  return ['vip', 'annual_vip', 'lifetime'].includes(this.subscription.plan);
};

// ── New membership plan helpers ──
userSchema.methods.isMonthly = function() {
  return this.subscription?.plan === 'monthly' && this.subscription?.status === 'active';
};
userSchema.methods.isAnnual = function() {
  return this.subscription?.plan === 'annual' && this.subscription?.status === 'active';
};
/**
 * Any paying subscriber — used for the member discount on priced live
 * sessions. Deliberately broader than isMonthly(): legacy starter and
 * professional subscribers are paying members too, and excluding them would
 * quietly charge long-standing subscribers the walk-up rate.
 *
 * VIP and Annual appear here for completeness but never reach the price path
 * — canAccessLiveSession() seats them free before pricing is evaluated.
 * 'free' is not a paying plan no matter how many courses were bought à la carte.
 */
userSchema.methods.isPayingMember = function() {
  const plan = this.subscription?.plan;
  const status = this.subscription?.status;
  if (!plan || plan === 'free') return false;
  return ['active', 'lifetime'].includes(status);
};

/** Fraction of list price a paying member pays on a priced live session. */
userSchema.statics.MEMBER_DISCOUNT_RATE = 0.15;

userSchema.methods.isStarter = function() {
  return this.subscription?.plan === 'starter' && this.subscription?.status === 'active';
};
userSchema.methods.isProfessional = function() {
  return this.subscription?.plan === 'professional' && this.subscription?.status === 'active';
};

// True when this user is the single grandfathered legacy Starter subscriber
// (env-driven; never hardcode an email address).
userSchema.methods.isGrandfatheredStarter = function() {
  const target = process.env.GRANDFATHERED_STARTER_EMAIL;
  return !!target
    && this.subscription?.plan === 'starter'
    && (this.email || '').toLowerCase() === target.toLowerCase();
};

// Live-session access decision under the new membership model.
// Returns { allowed, plan, reason, windowElapsed }. `plan` is null for
// non-members, who fall through to the existing per-session/paid flow.
// Annual/VIP: 15 live CE hrs/yr. Monthly: 1 session/month, ≤2 CE hrs.
// Counters lazy-reset when their window has elapsed (no cron required).
userSchema.methods.canAccessLiveSession = function(session) {
  const hours = (session && session.ceuHours) || 0;
  const now = Date.now();
  const status = this.subscription?.status;
  const activeVip = this.isVip() && ['active', 'lifetime'].includes(status);

  if (activeVip || this.isAnnual()) {
    const windowElapsed = !!this.liveHoursYearResetAt && now >= new Date(this.liveHoursYearResetAt).getTime();
    const usedHours = windowElapsed ? 0 : (this.liveHoursUsedThisYear || 0);
    const plan = activeVip ? 'vip' : 'annual';
    if (usedHours + hours > 15) {
      return { allowed: false, plan,
        reason: `You've used ${usedHours} of your 15 annual live CE hours. Register per-session or upgrade to VIP.` };
    }
    return { allowed: true, plan, windowElapsed };
  }

  if (this.isMonthly()) {
    const windowElapsed = !!this.liveSessionMonthResetAt && now >= new Date(this.liveSessionMonthResetAt).getTime();
    const usedThisMonth = windowElapsed ? false : !!this.liveSessionUsedThisMonth;
    if (hours > 2) {
      return { allowed: false, plan: 'monthly',
        reason: `This session is ${hours} hours. Monthly members can attend sessions up to 2 CE hours. Upgrade to Annual for $249/year to access this session.` };
    }
    if (usedThisMonth) {
      const when = this.liveSessionMonthResetAt ? new Date(this.liveSessionMonthResetAt).toLocaleDateString() : 'next month';
      return { allowed: false, plan: 'monthly',
        reason: `You've used your live session for this month. Your next session unlocks on ${when}.` };
    }
    return { allowed: true, plan: 'monthly', windowElapsed };
  }

  if (this.isStarter()) {
    const windowElapsed = !!this.liveSessionMonthResetAt && now >= new Date(this.liveSessionMonthResetAt).getTime();
    const usedThisMonth = windowElapsed ? false : !!this.liveSessionUsedThisMonth;
    if (hours > 2) {
      return { allowed: false, plan: 'starter',
        reason: `This session is ${hours} hours. Starter members can attend sessions up to 2 CE hours. Upgrade to Professional or higher to access this session.` };
    }
    if (usedThisMonth) {
      const when = this.liveSessionMonthResetAt ? new Date(this.liveSessionMonthResetAt).toLocaleDateString() : 'next month';
      return { allowed: false, plan: 'starter',
        reason: `You've used your live session for this month. Your next session unlocks on ${when}.` };
    }
    return { allowed: true, plan: 'starter', windowElapsed };
  }

  if (this.isProfessional()) {
    const windowElapsed = !!this.liveSessionMonthResetAt && now >= new Date(this.liveSessionMonthResetAt).getTime();
    const usedThisMonth = windowElapsed ? false : !!this.liveSessionUsedThisMonth;
    if (hours > 4) {
      return { allowed: false, plan: 'professional',
        reason: `This session is ${hours} hours. Professional members can attend sessions up to 4 CE hours. Upgrade to VIP or Annual to access this session.` };
    }
    if (usedThisMonth) {
      const when = this.liveSessionMonthResetAt ? new Date(this.liveSessionMonthResetAt).toLocaleDateString() : 'next month';
      return { allowed: false, plan: 'professional',
        reason: `You've used your live session for this month. Your next session unlocks on ${when}.` };
    }
    return { allowed: true, plan: 'professional', windowElapsed };
  }

  return { allowed: false, plan: null,
    reason: 'Live sessions require an active membership or per-session purchase.' };
};

// Async (self-paced) course access under the new membership model.
// VIP/Annual: full catalog. Monthly & grandfathered Starter: courses ≤4 CE hrs.
// Everyone else: false (they route through the existing free/paid/purchase gate).
userSchema.methods.canAccessAsyncCourse = function(course) {
  const hrs = (course && (course.ceHours ?? course.ceuHours)) || 0;
  if (this.isVip() || this.isAnnual()) return true;
  if (this.isMonthly()) return hrs <= 4;
  if (this.isGrandfatheredStarter()) return hrs <= 4;
  if (this.isStarter()) return hrs <= 4;
  if (this.isProfessional()) return hrs <= 5;
  return false;
};

// Check if trial expired
userSchema.methods.isTrialExpired = function() {
  if (this.subscription.status !== 'trial') return false;
  if (!this.subscription.trialEndsAt) return false;
  return new Date() > this.subscription.trialEndsAt;
};

// Return user without sensitive data
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.passwordHash;
  delete user.emailVerificationToken;
  delete user.passwordResetToken;
  delete user.passwordResetExpires;
  delete user.__v;
  // Strip Google Calendar tokens from API responses
  if (user.googleCalendar) {
    delete user.googleCalendar.accessToken;
    delete user.googleCalendar.refreshToken;
  }
  return user;
};

const User = mongoose.model('User', userSchema);

export default User;
