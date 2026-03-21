/**
 * RNR CE Request Model
 * Learner-driven: learner selects articles → admin approves → AI builds test → learner takes test
 */

import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  authors: { type: String, default: '' },
  journal: { type: String, default: '' },
  year: { type: Number },
  abstract: { type: String, default: '' },
  doi: { type: String, default: '' },
  oaUrl: { type: String, default: '' },
  wordCount: { type: Number, default: 0 }
}, { _id: false });

const questionSchema = new mongoose.Schema({
  tag: { type: String, required: true },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correct: { type: Number, required: true },
  rationale: { type: String, required: true }
}, { _id: false });

const rnrRequestSchema = new mongoose.Schema({
  // Who requested
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  userName: { type: String },
  userEmail: { type: String },

  // What they chose
  contentArea: { type: String, required: true },
  desiredHours: { type: Number, required: true },
  articles: [articleSchema],

  // Calculated CE
  totalWordCount: { type: Number, default: 0 },
  ceHours: { type: Number, default: 0 },
  researchHours: { type: Number, default: 0 },

  // Status flow: pending → approved → test_ready → completed / expired
  status: {
    type: String,
    enum: ['pending', 'approved', 'test_ready', 'in_progress', 'completed', 'rejected', 'expired'],
    default: 'pending',
    index: true
  },

  // Admin review
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: { type: Date },
  rejectionNote: { type: String, default: '' },

  // AI-generated test (populated after approval)
  objectives: [{ type: String }],
  questions: [questionSchema],
  testGeneratedAt: { type: Date },

  // Posttest results
  attempts: [{
    answers: { type: mongoose.Schema.Types.Mixed },
    score: { type: Number },
    passed: { type: Boolean },
    attemptedAt: { type: Date, default: Date.now }
  }],
  bestScore: { type: Number, default: 0 },
  passed: { type: Boolean, default: false },
  completedAt: { type: Date },

  // Certificate
  certificateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Certificate' },
  certificateNumber: { type: String },
  syllabusUrl: { type: String, default: '' }
}, {
  timestamps: true
});

rnrRequestSchema.index({ userId: 1, status: 1 });
rnrRequestSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('RNRRequest', rnrRequestSchema);
