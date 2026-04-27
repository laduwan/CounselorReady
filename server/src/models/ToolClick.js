/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';

const toolClickSchema = new mongoose.Schema({
  toolSlug: {
    type: String,
    required: true,
    index: true
  },
  event: {
    type: String,
    required: true,
    enum: ['click', 'conversion'],
    index: true
  },
  sessionId: {
    type: String,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    sparse: true
  },
  referrer: { type: String },
  ip: { type: String },
  userAgent: { type: String },
  timestamp: { type: Date, default: Date.now, index: true }
}, {
  timestamps: false
});

// Compound index for aggregation queries
toolClickSchema.index({ toolSlug: 1, event: 1, timestamp: -1 });

// TTL index — keep records for 2 years (matches UserActivity)
toolClickSchema.index({ timestamp: 1 }, { expireAfterSeconds: 63072000 });

const ToolClick = mongoose.model('ToolClick', toolClickSchema);

export default ToolClick;
