/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';

// ============================================
// SCHOLARLY ARTICLE SCHEMA
// Cached CrossRef article metadata + AI-generated quiz
// ============================================

const quizQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  type: {
    type: String,
    enum: ['multipleChoice', 'trueFalse'],
    default: 'multipleChoice'
  },
  options: [{
    text: { type: String, required: true },
    isCorrect: { type: Boolean, default: false }
  }],
  explanation: { type: String }
}, { _id: true });

const scholarlyArticleSchema = new mongoose.Schema({
  doi: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  authors: [{
    given: { type: String },
    family: { type: String },
    affiliation: { type: String }
  }],
  abstract: { type: String },
  publishedDate: { type: Date },
  journal: { type: String, trim: true },
  volume: { type: String },
  issue: { type: String },
  pages: { type: String },
  url: { type: String },
  subjects: [{ type: String }],
  nbccContentArea: {
    type: String,
    enum: [
      'counseling-theory-practice',
      'human-growth-development',
      'social-cultural-foundations',
      'group-dynamics-counseling',
      'career-development-counseling',
      'assessment',
      'research-program-evaluation',
      'professional-identity-practice',
      'wellness-prevention'
    ],
    default: 'research-program-evaluation'
  },
  ceHoursValue: {
    type: Number,
    default: 0.5,
    min: 0
  },
  quizQuestions: [quizQuestionSchema],
  quizGenerated: { type: Boolean, default: false },
  quizGeneratedAt: { type: Date }
}, {
  timestamps: true
});

scholarlyArticleSchema.index({ title: 'text', journal: 'text' });

// ============================================
// ARTICLE PROGRESS SCHEMA (per-user tracking)
// ============================================

const articleProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ScholarlyArticle',
    required: true
  },
  doi: { type: String },
  status: {
    type: String,
    enum: ['saved', 'reading', 'read', 'quiz_passed'],
    default: 'saved'
  },
  savedAt: { type: Date, default: Date.now },
  readAt: { type: Date },
  notes: { type: String, maxlength: 5000 },
  quizAttempts: [{
    attemptedAt: { type: Date, default: Date.now },
    score: { type: Number },
    totalQuestions: { type: Number },
    passed: { type: Boolean },
    timeSpent: { type: Number } // seconds
  }],
  quizPassed: { type: Boolean, default: false },
  bestQuizScore: { type: Number, default: 0 },
  ceHoursEarned: { type: Number, default: 0 },
  certificateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Certificate'
  },
  certificateIssuedAt: { type: Date },
  nbccContentArea: { type: String }
}, {
  timestamps: true
});

articleProgressSchema.index({ userId: 1, articleId: 1 }, { unique: true });
articleProgressSchema.index({ userId: 1, status: 1 });

const ScholarlyArticle = mongoose.model('ScholarlyArticle', scholarlyArticleSchema);
const ArticleProgress = mongoose.model('ArticleProgress', articleProgressSchema);

export { ScholarlyArticle, ArticleProgress };
export default ScholarlyArticle;
