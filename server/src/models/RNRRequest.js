/**
 * RNRRequest.js — Research Ready CE Request Model
 * CounselorReady · GAITP LLC · NBCC ACEP #7760
 *
 * Learner-driven flow:
 *   1. Learner searches OpenAlex, selects 2–5 articles
 *   2. Submits request → admin notified
 *   3. Admin approves (quick verification, not content creation)
 *   4. AI generates 6,200+ word article + posttest from selected articles
 *   5. Learner reads generated content, takes posttest, passes at 75%
 *   6. Certificate + NBCC syllabus DOCX auto-generated
 */

import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  openAlexId: { type: String, required: true },
  title: { type: String, required: true },
  authors: { type: String, required: true },
  journal: { type: String },
  year: { type: Number, required: true },
  abstract: { type: String },
  doi: { type: String },
  oaUrl: { type: String },
  topic: { type: String },
  wordCount: { type: Number, required: true },
  ceHours: { type: Number, required: true },
  researchHours: { type: Number, default: 0 },
  citedByCount: { type: Number, default: 0 },
  wcStatus: {
    type: String,
    enum: ['sufficient', 'borderline', 'thin'],
    default: 'sufficient'
  },
  fullTextSource: {
    type: String,
    enum: ['pdf', 'landing_page', 'pmc', 'abstract_only'],
    default: 'abstract_only'
  },
  abstractOnly: { type: Boolean, default: true },
  instructionalWordCount: { type: Number, default: 0 },
  rawWordCount: { type: Number, default: 0 }
}, { _id: false });

const posttestQuestionSchema = new mongoose.Schema({
  tag: { type: String },
  question: { type: String, required: true },
  options: [{ type: String }],
  correct: { type: Number, required: true },
  rationale: { type: String }
}, { _id: false });

const posttestAttemptSchema = new mongoose.Schema({
  attemptNumber: { type: Number, required: true },
  answers: [{ type: Number }],
  score: { type: Number, required: true },
  passed: { type: Boolean, required: true },
  timeSpent: { type: Number, default: 0 }, // seconds
  attemptedAt: { type: Date, default: Date.now }
}, { _id: false });

const rnrRequestSchema = new mongoose.Schema({
  // ── Who ──
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  userName: { type: String, default: '' },
  userEmail: { type: String, default: '' },

  // ── What ──
  contentArea: { type: String, required: true },
  desiredHours: { type: Number, required: true },
  selectedArticles: {
    type: [articleSchema],
    validate: {
      validator: v => v.length >= 1 && v.length <= 5,
      message: 'Select between 1 and 5 articles'
    }
  },

  // ── Computed totals ──
  totalWordCount: { type: Number, default: 0 },
  totalCeHours: { type: Number, default: 0 },
  totalResearchHours: { type: Number, default: 0 },
  contentAreas: [{ type: String }],

  // ── AI-generated article content (6,200+ words) ──
  generatedContent: { type: String, default: '' },
  generatedWordCount: { type: Number, default: 0 },
  contentSections: { type: Number, default: 0 },
  contentGeneratedAt: { type: Date },

  // ── Approval ──
  status: {
    type: String,
    enum: [
      'pending',       // learner submitted, awaiting admin
      'approved',      // admin approved, content + posttest generating
      'generating',    // AI content generation in progress
      'posttest_ready',// AI generated questions
      'test_ready',    // alias — route uses this after AI build
      'in_progress',   // learner started but hasn't passed yet
      'completed',     // learner passed posttest
      'failed',        // exhausted attempts
      'rejected',      // admin rejected
      'error'          // AI generation failed — admin can retry
    ],
    default: 'pending',
    index: true
  },
  adminNote: { type: String },
  rejectionNote: { type: String },
  approvedAt: { type: Date },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // ── AI-generated posttest ──
  courseTitle: { type: String, default: '' },
  objectives: [{ type: String }],
  questions: [posttestQuestionSchema],
  format: {
    type: String,
    enum: ['standalone', 'comparative', 'integrative', 'then_and_now', 'bridging'],
    default: 'standalone'
  },

  // ── AI build timestamp ──
  testGeneratedAt: { type: Date },

  // ── Learner attempts ──
  posttestAttempts: [posttestAttemptSchema],
  maxAttempts: { type: Number, default: 3 },
  passingScore: { type: Number, default: 75 },
  bestScore: { type: Number, default: 0 },
  passed: { type: Boolean, default: false },

  // ── Engagement ──
  engagementConfirmed: { type: Boolean, default: false },

  // ── Completion ──
  completedAt: { type: Date },
  finalScore: { type: Number },
  certificateId: { type: String },
  certificateNumber: { type: String },
  syllabusUrl: { type: String },
  certificate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Certificate'
  }
}, {
  timestamps: true
});

// ── Indexes ──
rnrRequestSchema.index({ user: 1, status: 1 });
rnrRequestSchema.index({ status: 1, createdAt: -1 });

// ── Virtual: attempts remaining ──
rnrRequestSchema.virtual('attemptsRemaining').get(function () {
  return this.maxAttempts - (this.posttestAttempts?.length || 0);
});

// ── Pre-save: compute totals ──
// If generatedWordCount exists, use that for CE calculation (post-approval).
// Otherwise fall back to article abstract word counts (pre-approval estimate).
rnrRequestSchema.pre('save', function (next) {
  if (this.generatedWordCount > 0) {
    // Use generated content word count for CE calculations
    this.totalWordCount = this.generatedWordCount;
    this.totalCeHours = Math.floor((this.generatedWordCount / 6000) * 2) / 2;
    this.totalResearchHours = Math.max(0.5, Math.floor((this.totalCeHours * 0.5) * 2) / 2);
  } else if (this.selectedArticles?.length) {
    // Pre-approval: estimate from abstract word counts
    this.totalWordCount = this.selectedArticles.reduce((s, a) => s + (a.wordCount || 0), 0);
    this.totalCeHours = Math.floor((this.totalWordCount / 6000) * 2) / 2;
    this.totalResearchHours = Math.max(0.5, Math.floor((this.totalCeHours * 0.5) * 2) / 2);
  }
  next();
});

rnrRequestSchema.set('toJSON', { virtuals: true });
rnrRequestSchema.set('toObject', { virtuals: true });

export default mongoose.model('RNRRequest', rnrRequestSchema);
