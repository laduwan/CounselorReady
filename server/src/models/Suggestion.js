/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';

const suggestionSchema = new mongoose.Schema({
  message: { type: String, required: true, trim: true, maxlength: 4000 },

  category: {
    type: String,
    enum: ['bug', 'feature-request', 'content', 'billing', 'other'],
    default: 'other'
  },

  // Which product the box was submitted from
  platform: {
    type: String,
    enum: ['counselorready', 'passreadyprep', 'gaitp'],
    required: true,
    default: 'counselorready'
  },

  // Set if a logged-in user submitted it; null for anonymous visitors
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  name: { type: String, trim: true },
  email: { type: String, trim: true },

  // Context captured automatically, not shown to the submitter
  pageUrl: { type: String },
  userAgent: { type: String },

  status: {
    type: String,
    enum: ['new', 'reviewed', 'in-progress', 'done', 'dismissed'],
    default: 'new'
  },
  adminNote: { type: String, trim: true },

  emailSent: { type: Boolean, default: false }
}, {
  timestamps: true
});

suggestionSchema.index({ platform: 1, status: 1, createdAt: -1 });

const Suggestion = mongoose.model('Suggestion', suggestionSchema);

export default Suggestion;
