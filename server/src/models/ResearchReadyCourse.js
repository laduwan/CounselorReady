/**
 * Research Ready CE Course Model
 * Stores AI-generated CE content from scholarly articles.
 */

import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  tag: { type: String, required: true },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correct: { type: Number, required: true },
  rationale: { type: String, required: true }
}, { _id: false });

const researchReadyCourseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  courseTitle: { type: String, default: '' },
  authors: { type: String, required: true },
  journal: { type: String, required: true },
  year: { type: Number, required: true },
  abstract: { type: String, default: '' },
  doi: { type: String, default: '' },
  oaUrl: { type: String, default: '' },

  wordCount: { type: Number, required: true },
  ceHours: { type: Number, required: true },
  researchHours: { type: Number, required: true },

  contentAreas: [{ type: String }],
  objectives: [{ type: String }],
  questions: [questionSchema],

  format: {
    type: String,
    enum: ['standalone', 'comparative', 'integrative'],
    default: 'standalone'
  },
  pairedArticle: { type: mongoose.Schema.Types.Mixed, default: null },

  status: {
    type: String,
    enum: ['pending_review', 'approved', 'live', 'rejected'],
    default: 'pending_review',
    index: true
  },
  rejectionNote: { type: String, default: '' },

  currencyVerdict: { type: mongoose.Schema.Types.Mixed, default: null },

  certificateIdPrefix: { type: String, default: '' },

  // Full-text fields (P1-T5)
  fullTextSource: { type: String },           // 'pdf' | 'landing_page' | 'pmc' | 'abstract_only'
  fullTextUrl: { type: String },              // source URL for audit trail
  abstractOnlyFlag: { type: Boolean, default: false },
  instructionalWordCount: { type: Number },   // ceWordCount() result
  rawWordCount: { type: Number },             // raw token count
  ceCalcFormula: { type: String },            // e.g. "11,234 ÷ 6,000 = 1.872 → 1.5 hrs"
  researchHours: { type: Number },            // always = ceHours (peer-reviewed = research hours)
  engagementConfirmed: { type: Boolean, default: false }, // true when Read view accessed before posttest
  savedBy: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] },

  approvedAt: { type: Date, default: null },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, {
  timestamps: true
});

researchReadyCourseSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('ResearchReadyCourse', researchReadyCourseSchema);
