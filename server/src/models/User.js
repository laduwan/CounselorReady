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
    avatar: { type: String },
    state: { type: String, uppercase: true }, // For CE requirements
    timezone: { type: String, default: 'America/New_York' },
    phone: { type: String }
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
      enum: ['free', 'starter', 'professional', 'vip', 'annual_vip', 'lifetime'],
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
    paymentRecoveredAt: { type: Date }
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
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
  role: {
    type: String,
    enum: ['user', 'admin', 'partner_admin'],
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
  
  // Track membership tenure for loyalty benefits
  memberSince: { type: Date },
  voluntaryCancelDate: { type: Date }, // Track if they voluntarily canceled
  
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
  }]
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Index for faster queries
userSchema.index({ 'subscription.status': 1 });
userSchema.index({ 'profile.state': 1 });
userSchema.index({ 'subscription.paymentFailedAt': 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return next();
  
  const salt = await bcrypt.genSalt(12);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
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
