/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';

const requirementSchema = new mongoose.Schema({
  category: { type: String, required: true },
  hoursRequired: { type: Number, required: true },
  description: { type: String },
  notes: { type: String }
}, { _id: false });

const credentialTemplateSchema = new mongoose.Schema({
  // Identification
  type: {
    type: String,
    enum: ['state_license', 'national_cert', 'specialty_cert'],
    required: true
  },
  code: { type: String, required: true }, // "LPC", "NCC", "CCTP"
  name: { type: String, required: true }, // "Licensed Professional Counselor"
  state: { type: String, uppercase: true }, // "GA" for state licenses
  issuingBody: { type: String, required: true },
  
  // Requirements
  renewalCycle: { type: Number, required: true }, // Months
  totalCEUsRequired: { type: Number, required: true },
  requirements: [requirementSchema],
  
  // Additional info
  renewalFee: { type: Number },
  renewalUrl: { type: String },
  notes: { type: String },
  firstRenewalNotes: { type: String }, // Special rules for first renewal
  
  // Metadata
  lastVerified: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Indexes
credentialTemplateSchema.index({ type: 1, state: 1 });
credentialTemplateSchema.index({ code: 1, state: 1 });
credentialTemplateSchema.index({ isActive: 1 });

const CredentialTemplate = mongoose.model('CredentialTemplate', credentialTemplateSchema);

export default CredentialTemplate;
