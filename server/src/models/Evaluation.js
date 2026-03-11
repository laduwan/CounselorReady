/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// models/Evaluation.js
// Course evaluation/feedback model
// Tracks user feedback submitted after completing courses

import mongoose from 'mongoose';

const evaluationSchema = new mongoose.Schema({
  // User who submitted the evaluation
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Course being evaluated
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
    index: true
  },
  
  // Related completion record
  completion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CELog'
  },
  
  // Status tracking
  status: {
    type: String,
    enum: ['pending', 'submitted', 'completed', 'reviewed'],
    default: 'pending',
    index: true
  },
  
  // Rating (1-5 scale)
  overallRating: {
    type: Number,
    min: 1,
    max: 5
  },
  
  // Detailed ratings
  ratings: {
    contentQuality: { type: Number, min: 1, max: 5 },
    relevance: { type: Number, min: 1, max: 5 },
    presentation: { type: Number, min: 1, max: 5 },
    engagement: { type: Number, min: 1, max: 5 },
    learningObjectives: { type: Number, min: 1, max: 5 }
  },
  
  // Written feedback
  feedback: {
    whatWorkedWell: String,
    suggestions: String,
    additionalComments: String
  },
  
  // Would recommend
  wouldRecommend: {
    type: Boolean
  },
  
  // Learning objectives met
  objectivesMet: {
    type: String,
    enum: ['fully', 'mostly', 'partially', 'not_at_all']
  },
  
  // Timestamps
  submittedAt: Date,
  reviewedAt: Date,
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Admin notes
  adminNotes: String,
  
  // Soft delete
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Compound indexes
evaluationSchema.index({ user: 1, course: 1 }, { unique: true }); // One eval per user per course
evaluationSchema.index({ course: 1, status: 1 });
evaluationSchema.index({ submittedAt: -1 });

// Virtual for average rating
evaluationSchema.virtual('averageRating').get(function() {
  if (!this.ratings) return this.overallRating;
  const ratings = Object.values(this.ratings).filter(r => r != null);
  if (ratings.length === 0) return this.overallRating;
  return ratings.reduce((a, b) => a + b, 0) / ratings.length;
});

// Static method to get course evaluation summary
evaluationSchema.statics.getCourseStats = async function(courseId) {
  const stats = await this.aggregate([
    { $match: { course: new mongoose.Types.ObjectId(courseId), status: { $in: ['submitted', 'completed', 'reviewed'] } } },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
        avgOverall: { $avg: '$overallRating' },
        avgContent: { $avg: '$ratings.contentQuality' },
        avgRelevance: { $avg: '$ratings.relevance' },
        avgPresentation: { $avg: '$ratings.presentation' },
        avgEngagement: { $avg: '$ratings.engagement' },
        recommendCount: { $sum: { $cond: ['$wouldRecommend', 1, 0] } }
      }
    }
  ]);
  
  return stats[0] || { count: 0 };
};

// Instance method to mark as submitted
evaluationSchema.methods.submit = function() {
  this.status = 'submitted';
  this.submittedAt = new Date();
  return this.save();
};

const Evaluation = mongoose.model('Evaluation', evaluationSchema);

export default Evaluation;
