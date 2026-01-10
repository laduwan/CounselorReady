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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  
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
  
  // Subscription
  subscription: {
    status: {
      type: String,
      enum: ['free', 'trial', 'active', 'canceled', 'expired', 'lifetime'],
      default: 'free'
    },
    plan: {
      type: String,
      enum: ['free', 'professional', 'vip', 'annual_vip', 'lifetime'],
      default: 'free'
    },
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String },
    currentPeriodStart: { type: Date },
    currentPeriodEnd: { type: Date },
    cancelAtPeriodEnd: { type: Boolean, default: false },
    trialEndsAt: { type: Date }
  },
  
  // Notification preferences
  notifications: {
    emailReminders: { type: Boolean, default: true },
    calendarSync: { type: Boolean, default: false },
    marketingEmails: { type: Boolean, default: true },
    reminderFrequency: {
      type: String,
      enum: ['6months', '3months', '1month', '1week'],
      default: '3months'
    }
  },
  
  // Metadata
  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  lastLoginAt: { type: Date }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ 'subscription.status': 1 });
userSchema.index({ 'profile.state': 1 });

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
  const activeStatuses = ['active', 'trial', 'lifetime'];
  return activeStatuses.includes(this.subscription.status);
};

// Check subscription tier level (higher number = more access)
userSchema.methods.getSubscriptionTier = function() {
  const tierLevels = {
    'free': 0,
    'professional': 1,
    'vip': 2,
    'annual_vip': 2,
    'lifetime': 3
  };
  if (!this.hasActiveSubscription()) return 0;
  return tierLevels[this.subscription.plan] || 0;
};

// Check if user can access a course based on subscription
userSchema.methods.canAccessCourse = function(course) {
  // Free courses are always accessible
  if (course.accessTier === 'free' || !course.accessTier) return true;
  
  // Check if user has purchased this specific course
  if (course.price && this.purchasedCourses?.includes(course._id)) return true;
  
  // Check subscription tier
  const tierLevels = { 'free': 0, 'professional': 1, 'vip': 2 };
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
  return 1; // Free and Professional
};

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

// Check if user can book a consultation (VIP perk - 1 per quarter, must be active at time of request)
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
  return user;
};

const User = mongoose.model('User', userSchema);

export default User;
