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
    // Partner-set certificate footer (license disclaimer / address / contact /
    // board-approval statement). Rendered above the verify line on partner certs.
    certFooter: { type: String },
    primaryColor: { type: String, default: '#6B1D34' },
    companyName: { type: String },
    tagline: { type: String },
    customDomain: { type: String, lowercase: true, trim: true },
    // Personalized vanity host on the primary domain, e.g. "acme" -> acme.counselorready.com.
    // Distinct from `slug` (the stable internal handle) so partners can change their public
    // address without breaking internal references. Falls back to `slug` when unset.
    subdomain: { type: String, lowercase: true, trim: true, match: [/^[a-z0-9-]+$/, 'Subdomain may only contain lowercase letters, numbers, and hyphens'] },
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
    connectAccountId: { type: String },           // Stripe Express account id (acct_...)
    connectOnboardingComplete: { type: Boolean, default: false }, // charges_enabled confirmed
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

  // AI Course Builder usage (metered against actual Anthropic cost)
  aiUsage: {
    freeUsedCents: { type: Number, default: 0 },      // spent against the monthly tier budget this period
    purchasedHours: { type: Number, default: 0 },    // course-hours from purchased credit packs (rolls over)
    periodResetAt: { type: Date },                    // when freeUsedCents resets to 0
    lifetimeCents: { type: Number, default: 0 },      // total ever generated (reporting)
    creditedSessions: [{ type: String }]              // Stripe checkout session IDs already credited (dedup)
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

  // Course syndication / marketplace ("marketing additive" — opt-in during setup)
  syndication: {
    // Partner opts to add CounselorReady's published catalog to their branded library.
    // On those sales the partner (distributor) keeps `distributorRate`, CR keeps the rest.
    // DEPRECATED — import program removed June 2026. Field retained for historical data only.
    importPlatformCourses: { type: Boolean, default: false },
    // Partner opts to list their own published courses in the CounselorReady marketplace.
    // On those sales CounselorReady (distributor) keeps `distributorRate`, the partner keeps the rest.
    listInMarketplace: { type: Boolean, default: false },
    // Distributor's share of a syndicated sale (0.15 = 15%). Owner keeps 1 - rate.
    distributorRate: { type: Number, default: 0.15, min: 0, max: 1 },
    agreedAt: { type: Date },
    agreedByUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // Version of the Partner Marketplace Agreement currently accepted (matches
    // server/src/config/marketplaceAgreement.js). Cleared/superseded on re-acceptance.
    agreedVersion: { type: String },
    // Append-only clickwrap audit trail — one entry per acceptance event.
    acceptances: [{
      version: { type: String, required: true },
      at: { type: Date, default: Date.now },
      byUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      byEmail: { type: String },
      ip: { type: String },
      userAgent: { type: String },
      programs: {
        importPlatformCourses: { type: Boolean },
        listInMarketplace: { type: Boolean }
      }
    }]
  },

  // Premium feature add-ons (paid separately, always branded "Powered by CounselorReady™")
  premiumAddons: {
    certTracking: {
      enabled: { type: Boolean, default: false },
      enabledAt: { type: Date },
      stripeItemId: { type: String }
    },
    credentialManagement: {
      enabled: { type: Boolean, default: false },
      enabledAt: { type: Date },
      stripeItemId: { type: String }
    },
    complianceTracking: {
      enabled: { type: Boolean, default: false },
      enabledAt: { type: Date },
      stripeItemId: { type: String }
    },
    clinicalTools: {
      enabled: { type: Boolean, default: false },
      enabledAt: { type: Date },
      stripeItemId: { type: String }
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
partnerSchema.index({ 'branding.subdomain': 1 });

const Partner = mongoose.model('Partner', partnerSchema);

export default Partner;
