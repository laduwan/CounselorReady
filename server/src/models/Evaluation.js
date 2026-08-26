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
  
  // Detailed ratings (1-5 scale; N/A responses stored as null/omitted)
  ratings: {
    // NBCC-compliant 10-item form (Aug 2026+)
    objectivesMet:       { type: Number, min: 1, max: 5 },
    relevance:           { type: Number, min: 1, max: 5 },
    currentInfo:         { type: Number, min: 1, max: 5 },
    applicableSkills:    { type: Number, min: 1, max: 5 },
    instructorExpertise: { type: Number, min: 1, max: 5 },
    instructorClarity:   { type: Number, min: 1, max: 5 },
    organization:        { type: Number, min: 1, max: 5 },
    courseValue:         { type: Number, min: 1, max: 5 },
    confidence:          { type: Number, min: 1, max: 5 },
    overallSatisfaction: { type: Number, min: 1, max: 5 },
    // Legacy fields (pre-Aug 2026 evaluations)
    contentQuality:      { type: Number, min: 1, max: 5 },
    presentation:        { type: Number, min: 1, max: 5 },
    engagement:          { type: Number, min: 1, max: 5 },
    learningObjectives:  { type: Number, min: 1, max: 5 }
  },

  // Support resolution (required, Aug 2026+)
  supportResolution: {
    type: String,
    enum: ['yes_resolved', 'no_unresolved', 'no_contact']
  },

  // Fee rating (optional)
  courseFee: {
    type: String,
    enum: ['much_too_high', 'somewhat_too_high', 'about_right', 'somewhat_low', 'much_too_low', 'not_sure']
  },

  // Written feedback
  feedback: {
    mostValuable:       String,
    improvements:       String,
    additionalComments: String,
    // Legacy
    whatWorkedWell: String,
    suggestions:    String
  },

  // Would recommend (required Aug 2026+; string to support yes/no/maybe)
  wouldRecommend: {
    type: String,
    enum: ['yes', 'no', 'maybe']
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
        avgObjectivesMet:       { $avg: '$ratings.objectivesMet' },
        avgRelevance:           { $avg: '$ratings.relevance' },
        avgCurrentInfo:         { $avg: '$ratings.currentInfo' },
        avgApplicableSkills:    { $avg: '$ratings.applicableSkills' },
        avgInstructorExpertise: { $avg: '$ratings.instructorExpertise' },
        avgInstructorClarity:   { $avg: '$ratings.instructorClarity' },
        avgOrganization:        { $avg: '$ratings.organization' },
        avgCourseValue:         { $avg: '$ratings.courseValue' },
        avgConfidence:          { $avg: '$ratings.confidence' },
        avgOverallSatisfaction: { $avg: '$ratings.overallSatisfaction' },
        // Legacy field averages
        avgContentQuality:      { $avg: '$ratings.contentQuality' },
        avgPresentation:        { $avg: '$ratings.presentation' },
        avgEngagement:          { $avg: '$ratings.engagement' },
        recommendYes:   { $sum: { $cond: [{ $eq: ['$wouldRecommend', 'yes'] }, 1, 0] } },
        recommendNo:    { $sum: { $cond: [{ $eq: ['$wouldRecommend', 'no'] }, 1, 0] } },
        recommendMaybe: { $sum: { $cond: [{ $eq: ['$wouldRecommend', 'maybe'] }, 1, 0] } },
        supportResolved:   { $sum: { $cond: [{ $eq: ['$supportResolution', 'yes_resolved'] }, 1, 0] } },
        supportUnresolved: { $sum: { $cond: [{ $eq: ['$supportResolution', 'no_unresolved'] }, 1, 0] } },
        supportNoContact:  { $sum: { $cond: [{ $eq: ['$supportResolution', 'no_contact'] }, 1, 0] } }
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
