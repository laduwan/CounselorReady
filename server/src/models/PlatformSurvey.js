/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';

// Platform-wide satisfaction and NPS tracking
const platformSurveySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  surveyType: {
    type: String,
    enum: ['nps', 'satisfaction', 'exit', 'feature_request', 'post_course'],
    required: true
  },
  
  // NPS Score (0-10): How likely to recommend?
  npsScore: { 
    type: Number, 
    min: 0, 
    max: 10 
  },
  
  // General satisfaction (1-5)
  satisfactionScore: { 
    type: Number, 
    min: 1, 
    max: 5 
  },
  
  // Specific ratings
  ratings: {
    courseQuality: { type: Number, min: 1, max: 5 },
    easeOfUse: { type: Number, min: 1, max: 5 },
    valueForMoney: { type: Number, min: 1, max: 5 },
    customerSupport: { type: Number, min: 1, max: 5 },
    ceTracking: { type: Number, min: 1, max: 5 },
    certificateProcess: { type: Number, min: 1, max: 5 }
  },
  
  // Open-ended responses
  responses: {
    whatDoYouLove: { type: String },
    whatCouldImprove: { type: String },
    featureRequests: { type: String },
    additionalComments: { type: String }
  },
  
  // Context
  context: {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    subscriptionPlan: { type: String },
    monthsSubscribed: { type: Number },
    coursesCompleted: { type: Number },
    trigger: { type: String } // 'milestone', 'random', 'post_course', 'cancellation', 'manual'
  },
  
  // Metadata
  completedAt: { type: Date, default: Date.now },
  ipAddress: { type: String },
  userAgent: { type: String }
}, {
  timestamps: true
});

// Indexes
platformSurveySchema.index({ userId: 1, surveyType: 1 });
platformSurveySchema.index({ surveyType: 1, createdAt: -1 });
platformSurveySchema.index({ npsScore: 1 });

// Static method to calculate NPS
platformSurveySchema.statics.calculateNPS = async function(startDate, endDate) {
  const match = { 
    surveyType: 'nps',
    npsScore: { $exists: true }
  };
  
  if (startDate || endDate) {
    match.createdAt = {};
    if (startDate) match.createdAt.$gte = startDate;
    if (endDate) match.createdAt.$lte = endDate;
  }
  
  const results = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        promoters: { 
          $sum: { $cond: [{ $gte: ['$npsScore', 9] }, 1, 0] }
        },
        passives: { 
          $sum: { $cond: [{ $and: [{ $gte: ['$npsScore', 7] }, { $lte: ['$npsScore', 8] }] }, 1, 0] }
        },
        detractors: { 
          $sum: { $cond: [{ $lte: ['$npsScore', 6] }, 1, 0] }
        },
        avgScore: { $avg: '$npsScore' }
      }
    }
  ]);
  
  if (results.length === 0) {
    return { nps: 0, total: 0, promoters: 0, passives: 0, detractors: 0, avgScore: 0 };
  }
  
  const { total, promoters, passives, detractors, avgScore } = results[0];
  const nps = Math.round(((promoters - detractors) / total) * 100);
  
  return { nps, total, promoters, passives, detractors, avgScore: Math.round(avgScore * 10) / 10 };
};

// Static method to get satisfaction averages
platformSurveySchema.statics.getSatisfactionAverages = async function(startDate, endDate) {
  const match = { 
    surveyType: 'satisfaction',
    satisfactionScore: { $exists: true }
  };
  
  if (startDate || endDate) {
    match.createdAt = {};
    if (startDate) match.createdAt.$gte = startDate;
    if (endDate) match.createdAt.$lte = endDate;
  }
  
  const results = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        avgSatisfaction: { $avg: '$satisfactionScore' },
        avgCourseQuality: { $avg: '$ratings.courseQuality' },
        avgEaseOfUse: { $avg: '$ratings.easeOfUse' },
        avgValueForMoney: { $avg: '$ratings.valueForMoney' },
        avgCustomerSupport: { $avg: '$ratings.customerSupport' },
        avgCeTracking: { $avg: '$ratings.ceTracking' },
        avgCertificateProcess: { $avg: '$ratings.certificateProcess' }
      }
    }
  ]);
  
  if (results.length === 0) {
    return { total: 0, avgSatisfaction: 0, avgCourseQuality: 0, avgEaseOfUse: 0, avgValueForMoney: 0, avgCustomerSupport: 0, avgCeTracking: 0, avgCertificateProcess: 0 };
  }
  
  const data = results[0];
  // Round all averages to 1 decimal
  Object.keys(data).forEach(key => {
    if (key !== '_id' && key !== 'total' && data[key]) {
      data[key] = Math.round(data[key] * 10) / 10;
    }
  });
  
  return data;
};

const PlatformSurvey = mongoose.model('PlatformSurvey', platformSurveySchema);

export default PlatformSurvey;
