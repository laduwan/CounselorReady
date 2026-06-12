/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */

/**
 * OrgCredential — org-managed license / insurance / cert vault per member.
 *
 * NEW additive collection. Intentionally distinct from the personal
 * `UserCredential` vault (which is the clinician's own, B2C). This record is
 * owned and tracked by the ORGANIZATION (verifiedBy, alert ledger, evidence
 * file), so solo B2C users are completely unaffected.
 */
import mongoose from 'mongoose';

const orgCredentialSchema = new mongoose.Schema({
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
  seatId: { type: mongoose.Schema.Types.ObjectId }, // Organization.seats[]._id (the membership)
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },

  type: {
    type: String,
    enum: [
      'license', 'liability_insurance', 'cpr', 'first_aid', 'caqh', 'npi',
      'background_check', 'drivers_license', 'deaf_crisis', 'relias_str', 'other'
    ],
    default: 'other'
  },
  label: { type: String, trim: true }, // "GA LPC", "FL Telehealth Registration"
  state: { type: String, default: null, uppercase: true },
  identifier: { type: String, trim: true }, // license #, policy #, NPI

  // GA DBHDD CPR/AED level field (§2b item 13): accepted bodies AHA / HSI / Red Cross.
  level: {
    type: String,
    enum: ['professional_rescuer_bls', 'lay_rescuer', 'bls_cla', 'first_aid', null],
    default: null
  },
  issuingBody: { type: String, default: null }, // 'AHA' | 'HSI' | 'Red Cross' | other

  // GA Relias STR external completion tracking (§3): per-subject-area hours.
  subjectArea: { type: String, default: null },
  hours: { type: Number, default: 0 },
  manualVersion: { type: String, default: null, trim: true },

  issuedAt: { type: Date },
  expiresAt: { type: Date, default: null, index: true },

  fileUrl: { type: String },   // uploaded evidence
  fileKey: { type: String },
  fileName: { type: String },

  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  verifiedAt: { type: Date },

  // Expiry alert dedupe ledger: '90d','60d','30d','7d'
  alertsSent: [{ type: String }]
}, {
  timestamps: true
});

orgCredentialSchema.index({ orgId: 1, seatId: 1 });
orgCredentialSchema.index({ orgId: 1, type: 1 });

// Days until expiration (null when no expiry set).
orgCredentialSchema.virtual('daysUntilExpiration').get(function () {
  if (!this.expiresAt) return null;
  return Math.ceil((this.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
});

orgCredentialSchema.set('toJSON', { virtuals: true });
orgCredentialSchema.set('toObject', { virtuals: true });

const OrgCredential = mongoose.model('OrgCredential', orgCredentialSchema);
export default OrgCredential;
