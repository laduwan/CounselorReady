/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */

/**
 * PolicyDoc — an org policy document requiring acknowledgement / e-signature.
 *
 * NEW additive collection. A new `version` re-opens the attestation requirement
 * for everyone in scope automatically (see Attestation unique index).
 */
import mongoose from 'mongoose';

const policyDocSchema = new mongoose.Schema({
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
  title: { type: String, required: true, trim: true },
  version: { type: Number, default: 1 },
  fileUrl: { type: String },
  fileKey: { type: String },
  fileName: { type: String },
  requiresSignature: { type: Boolean, default: true },
  appliesToRoles: [{ type: String }],
  active: { type: Boolean, default: true }
}, {
  timestamps: true
});

policyDocSchema.index({ orgId: 1, active: 1 });

const PolicyDoc = mongoose.model('PolicyDoc', policyDocSchema);
export default PolicyDoc;
