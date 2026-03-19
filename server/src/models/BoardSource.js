/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';

const boardSourceSchema = new mongoose.Schema({
  // Which state/board this source tracks
  state: { type: String, required: true, uppercase: true },
  boardName: { type: String, required: true },
  credentialTypes: [{ type: String }], // e.g., ['LPC', 'LCSW']

  // Source configuration
  url: { type: String, required: true },
  feedType: {
    type: String,
    enum: ['rss', 'webpage', 'email'],
    required: true
  },

  // For webpage monitoring — CSS selector to target specific content area
  contentSelector: String,

  // Monitoring state
  isActive: { type: Boolean, default: true },
  lastCheckedAt: Date,
  lastContentHash: String, // SHA-256 hash of last seen content
  lastContent: String,     // Raw text of last seen content (for AI diffing)
  checkFrequencyHours: { type: Number, default: 24 },
  consecutiveFailures: { type: Number, default: 0 },

  // Admin management
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: String
}, {
  timestamps: true
});

boardSourceSchema.index({ state: 1, isActive: 1 });
boardSourceSchema.index({ lastCheckedAt: 1 });

const BoardSource = mongoose.model('BoardSource', boardSourceSchema);
export default BoardSource;
