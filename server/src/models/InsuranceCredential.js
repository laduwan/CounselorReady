/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';

const statusHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  date: { type: Date, default: Date.now },
  notes: String
}, { _id: false });

const insuranceCredentialSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  // Insurance panel info
  insuranceCompany: { type: String, required: true, trim: true },
  panelType: {
    type: String,
    enum: ['in_network', 'out_of_network', 'both'],
    default: 'in_network'
  },

  // Application tracking
  applicationDate: { type: Date },
  applicationStatus: {
    type: String,
    enum: ['not_started', 'gathering_docs', 'submitted', 'under_review', 'approved', 'denied', 'recredentialing'],
    default: 'not_started'
  },
  providerNumber: String,
  effectiveDate: Date,
  recredentialingDate: Date,

  // CAQH
  caqhId: String,
  caqhAttestationDate: Date,

  // Documents needed
  documentsChecklist: [{
    name: { type: String, required: true },
    required: { type: Boolean, default: true },
    uploaded: { type: Boolean, default: false },
    uploadedAt: Date,
    fileUrl: String,
    notes: String
  }],

  // Contact info for the panel
  contactName: String,
  contactPhone: String,
  contactEmail: String,
  portalUrl: String,

  // Timeline tracking
  statusHistory: [statusHistorySchema],

  // Reminders
  nextFollowUpDate: Date,
  notes: String
}, {
  timestamps: true
});

insuranceCredentialSchema.index({ userId: 1, applicationStatus: 1 });

// Virtual for days since application
insuranceCredentialSchema.virtual('daysSinceApplication').get(function() {
  if (!this.applicationDate) return null;
  return Math.floor((Date.now() - this.applicationDate) / (1000 * 60 * 60 * 24));
});

// Virtual for days until recredentialing
insuranceCredentialSchema.virtual('daysUntilRecredentialing').get(function() {
  if (!this.recredentialingDate) return null;
  return Math.ceil((this.recredentialingDate - Date.now()) / (1000 * 60 * 60 * 24));
});

insuranceCredentialSchema.set('toJSON', { virtuals: true });
insuranceCredentialSchema.set('toObject', { virtuals: true });

const InsuranceCredential = mongoose.model('InsuranceCredential', insuranceCredentialSchema);
export default InsuranceCredential;
