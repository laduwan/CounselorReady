/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */

/**
 * Attestation — a member's signed acknowledgement of a specific PolicyDoc version.
 *
 * NEW additive collection. The unique index on (userId, policyDocId, policyVersion)
 * means a NEW policy version re-opens the attestation requirement automatically.
 */
import mongoose from 'mongoose';

const attestationSchema = new mongoose.Schema({
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
  seatId: { type: mongoose.Schema.Types.ObjectId }, // Organization.seats[]._id (the membership)
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },

  policyDocId: { type: mongoose.Schema.Types.ObjectId, ref: 'PolicyDoc', required: true },
  policyVersion: { type: Number, required: true },

  signedAt: { type: Date, default: Date.now },
  signatureName: { type: String, trim: true },
  ip: { type: String },
  userAgent: { type: String }
}, {
  timestamps: true
});

// One attestation per member per policy version. New version ⇒ new requirement.
attestationSchema.index({ userId: 1, policyDocId: 1, policyVersion: 1 }, { unique: true });

const Attestation = mongoose.model('Attestation', attestationSchema);
export default Attestation;
