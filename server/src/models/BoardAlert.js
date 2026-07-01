/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';

const boardAlertSchema = new mongoose.Schema({
  // Which state/board this applies to
  state: { type: String, required: true, uppercase: true },
  boardName: { type: String, required: true },
  credentialTypes: [{ type: String }], // e.g., ['LPC', 'LCSW', 'LMFT']

  // Alert content
  title: { type: String, required: true },
  summary: { type: String, required: true },
  details: { type: String },
  sourceUrl: String,

  // Classification
  category: {
    type: String,
    enum: ['ce_requirement_change', 'renewal_process', 'fee_change', 'scope_of_practice', 'new_regulation', 'deadline', 'supervision', 'other'],
    required: true
  },
  severity: {
    type: String,
    enum: ['info', 'important', 'urgent'],
    default: 'info'
  },

  // Effective dates
  effectiveDate: Date,
  announcedDate: { type: Date, default: Date.now },

  // Admin management
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isPublished: { type: Boolean, default: true },

  // Change tracking — stores previous versions when a rule is amended
  changeHistory: [{
    amendedAt: { type: Date, required: true },
    amendedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    changeNote: String,
    previousValues: {
      title: String,
      summary: String,
      details: String,
      category: String,
      severity: String,
      effectiveDate: Date,
      sourceUrl: String,
      credentialTypes: [String]
    }
  }],

  // User engagement
  acknowledgedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, {
  timestamps: true
});

boardAlertSchema.index({ state: 1, isPublished: 1, createdAt: -1 });
boardAlertSchema.index({ credentialTypes: 1 });

const BoardAlert = mongoose.model('BoardAlert', boardAlertSchema);
export default BoardAlert;
