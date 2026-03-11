/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';

// ── Vault Document ──
// Securely stored professional documents (licenses, wills, insurance, etc.)
const vaultDocumentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: [
      'license',
      'insurance',
      'will',
      'practice-agreement',
      'business-entity',
      'tax-document',
      'malpractice',
      'emergency-plan',
      'client-records-plan',
      'power-of-attorney',
      'lease-agreement',
      'ehr-credentials',
      'other'
    ],
    default: 'other'
  },
  description: {
    type: String,
    trim: true
  },
  // Cloudinary file storage
  fileUrl: { type: String },
  fileKey: { type: String },
  fileName: { type: String },
  fileType: { type: String },
  fileSize: { type: Number },
  // Metadata
  expirationDate: { type: Date },
  reminderDays: { type: Number, default: 30 },
  tags: [{ type: String, trim: true }],
  isConfidential: { type: Boolean, default: false },
  notes: { type: String, trim: true }
}, {
  timestamps: true
});

vaultDocumentSchema.index({ userId: 1, category: 1 });
vaultDocumentSchema.index({ userId: 1, expirationDate: 1 });

// ── Succession Contact ──
// Trusted individuals who can access practice info if counselor is incapacitated
const successionContactSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: [
      'clinical-executor',     // Takes over clinical responsibilities
      'business-executor',     // Handles business/financial matters
      'emergency-contact',     // First person notified
      'attorney',              // Legal representative
      'accountant',            // Financial/tax matters
      'ehr-administrator',     // EHR system access
      'supervisor',            // Clinical supervisor
      'colleague',             // Trusted colleague
      'other'
    ],
    default: 'colleague'
  },
  email: { type: String, trim: true },
  phone: { type: String, trim: true },
  organization: { type: String, trim: true },
  licenseNumber: { type: String, trim: true },
  relationship: { type: String, trim: true },
  // What this contact is authorized to do
  accessLevel: {
    type: String,
    enum: ['full', 'limited', 'notify-only'],
    default: 'notify-only'
  },
  responsibilities: { type: String, trim: true },
  hasAgreed: { type: Boolean, default: false },
  agreedDate: { type: Date },
  notes: { type: String, trim: true },
  isPrimary: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

successionContactSchema.index({ userId: 1, role: 1 });

// ── Succession Plan ──
// The overall practice continuity plan
const successionPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['not-started', 'in-progress', 'complete'],
    default: 'not-started'
  },
  // Practice details
  practiceName: { type: String, trim: true },
  practiceType: {
    type: String,
    enum: ['solo', 'group', 'agency', 'other'],
    default: 'solo'
  },
  estimatedActiveClients: { type: Number },
  ehrSystem: { type: String, trim: true },
  // Instructions
  clientNotificationPlan: { type: String, trim: true },
  recordsTransferPlan: { type: String, trim: true },
  financialInstructions: { type: String, trim: true },
  additionalInstructions: { type: String, trim: true },
  // Status tracking
  lastReviewedAt: { type: Date },
  reviewReminderMonths: { type: Number, default: 12 }
}, {
  timestamps: true
});

// ── Vault Check-In (Dead Man's Switch) ──
// Periodic check-in to confirm counselor is active; triggers alerts if missed
const vaultCheckInSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  lastCheckIn: { type: Date, default: Date.now },
  checkInIntervalDays: { type: Number, default: 30 },
  isActive: { type: Boolean, default: false },
  missedCheckIns: { type: Number, default: 0 },
  nextCheckInDue: { type: Date }
}, {
  timestamps: true
});

vaultCheckInSchema.pre('save', function (next) {
  if (this.isModified('lastCheckIn') || this.isModified('checkInIntervalDays')) {
    const interval = this.checkInIntervalDays || 30;
    const base = this.lastCheckIn || new Date();
    this.nextCheckInDue = new Date(base.getTime() + interval * 24 * 60 * 60 * 1000);
  }
  next();
});

// ── Recovery Token ──
// Encrypted backup of user's vault access credentials
const recoveryTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  encryptedToken: { type: String, required: true },
  tokenHash: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

recoveryTokenSchema.index({ userId: 1, isActive: 1 });

export const VaultDocument = mongoose.model('VaultDocument', vaultDocumentSchema);
export const SuccessionContact = mongoose.model('SuccessionContact', successionContactSchema);
export const SuccessionPlan = mongoose.model('SuccessionPlan', successionPlanSchema);
export const VaultCheckIn = mongoose.model('VaultCheckIn', vaultCheckInSchema);
export const RecoveryToken = mongoose.model('RecoveryToken', recoveryTokenSchema);
