// models/ToolAccess.js
// Stores license verifications and usage logs for gated clinical tools
// (Hold Guide, Superbill Generator, Safety Plan Builder, etc.)

import mongoose from 'mongoose';

// ─── License Verification ────────────────────────────────────────────────────
const toolLicenseSchema = new mongoose.Schema({
  // Tool identity
  tool: {
    type: String,
    required: true,
    enum: ['hold-guide', 'superbill-generator', 'safety-plan-builder', 'sliding-scale-calculator'],
    index: true
  },

  // Clinician info
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true
  },

  // License details
  licenseNumber: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  licenseState: {
    type: String,
    required: true,
    trim: true
  },
  credentialType: {
    type: String,
    required: true,
    enum: ['LPC', 'LMHC', 'LCSW', 'LMFT', 'NCC', 'PsyD', 'PMHNP', 'Other']
  },
  licenseType: {
    type: String,
    required: true,
    enum: ['independent', 'supervisor'],
    default: 'independent'
  },

  // Supervisor info (only when licenseType === 'supervisor')
  supervisorName: {
    type: String,
    trim: true
  },
  superviseeName: {
    type: String,
    trim: true
  },

  // Access window
  verifiedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true
  },

  // Status
  status: {
    type: String,
    enum: ['active', 'expired', 'revoked'],
    default: 'active',
    index: true
  },

  // Linked CounselorReady user (if they have an account)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    sparse: true,
    index: true
  },

  // Renewal tracking
  renewalCount: {
    type: Number,
    default: 0
  },
  lastRenewalAt: Date,
  renewalReminderSentAt: Date
}, {
  timestamps: true
});

// Compound indexes
toolLicenseSchema.index({ tool: 1, email: 1 });
toolLicenseSchema.index({ tool: 1, licenseNumber: 1 });
toolLicenseSchema.index({ expiresAt: 1, status: 1 }); // for expiration cron

// Check if access is currently valid
toolLicenseSchema.methods.isValid = function () {
  return this.status === 'active' && this.expiresAt > new Date();
};

// ─── Usage Log ───────────────────────────────────────────────────────────────
const toolUsageLogSchema = new mongoose.Schema({
  tool: {
    type: String,
    required: true,
    enum: ['hold-guide', 'superbill-generator', 'safety-plan-builder', 'sliding-scale-calculator'],
    index: true
  },
  event: {
    type: String,
    required: true,
    index: true
    // hold-guide events: 'reference_tab_opened', 'quiz_tab_opened',
    //   'state_viewed', 'quiz_started', 'quiz_completed'
  },

  // Who
  licenseNumber: String,
  email: String,

  // Event-specific data
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
    // state_viewed: { state: "Georgia" }
    // quiz_started: { count: 15, focus: "all" }
    // quiz_completed: { score: 87, correct: 13, total: 15, weakAreas: ["forms"] }
  },

  // Timestamp from client (may differ from server createdAt)
  clientTimestamp: Date,

  // IP / user agent for analytics (not PII — just for abuse detection)
  ip: String,
  userAgent: String
}, {
  timestamps: true
});

// Indexes for analytics queries
toolUsageLogSchema.index({ tool: 1, event: 1, createdAt: -1 });
toolUsageLogSchema.index({ email: 1, createdAt: -1 });
toolUsageLogSchema.index({ createdAt: -1 }); // time-series queries

export const ToolLicense = mongoose.model('ToolLicense', toolLicenseSchema);
export const ToolUsageLog = mongoose.model('ToolUsageLog', toolUsageLogSchema);
