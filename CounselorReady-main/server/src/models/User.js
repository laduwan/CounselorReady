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
  
  // Subscription
  subscription: {
    status: {
      type: String,
      enum: ['free', 'trial', 'active', 'canceled', 'expired', 'lifetime'],
      default: 'free'
    },
    plan: {
      type: String,
      enum: ['free', 'pro_monthly', 'pro_annual', 'lifetime'],
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
