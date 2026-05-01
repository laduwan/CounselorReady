/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';

const partnerSchema = new mongoose.Schema({
  // Partner identity
  name: {
    type: String,
    required: [true, 'Partner name is required'],
    trim: true
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9-]+$/, 'Slug must only contain lowercase letters, numbers, and hyphens']
  },

  // Branding
  branding: {
    logoUrl: { type: String },
    primaryColor: { type: String, default: '#6B1D34' },
    companyName: { type: String },
    tagline: { type: String },
    customDomain: { type: String, lowercase: true, trim: true },
    colorScheme: { type: String, default: 'burgundy' },
    accentColor: { type: String, default: '#D4A855' }
  },

  // Contact
  contact: {
    email: { type: String },
    website: { type: String },
    phone: { type: String }
  },

  // Configuration
  active: { type: Boolean, default: true },

  // Subscription defaults for partner users
  defaultPlan: {
    type: String,
    enum: ['free', 'starter', 'professional', 'vip', 'annual_vip'],
    default: 'free'
  },

  // Domain verification
  domainVerification: {
    verificationToken: { type: String },
    verified: { type: Boolean, default: false },
    verifiedAt: { type: Date },
    lastCheckAt: { type: Date }
  },

  // Billing
  billing: {
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String },
    plan: {
      type: String,
      enum: ['free', 'starter', 'growth', 'professional', 'enterprise'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'trial', 'past_due', 'canceled', 'inactive'],
      default: 'trial'
    },
    trialEndsAt: { type: Date },
    currentPeriodEnd: { type: Date }
  },

  // Email template customization
  emailTemplates: {
    welcome: {
      subject: { type: String },
      heading: { type: String },
      body: { type: String },
      buttonText: { type: String },
      footerText: { type: String }
    },
    invitation: {
      subject: { type: String },
      heading: { type: String },
      body: { type: String },
      buttonText: { type: String },
      footerText: { type: String }
    }
  },

  // Admin who created this partner
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // Internal admin notes (not visible to partner admins)
  adminNotes: [{
    text: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

partnerSchema.index({ active: 1 });
partnerSchema.index({ 'branding.customDomain': 1 });

const Partner = mongoose.model('Partner', partnerSchema);

export default Partner;
