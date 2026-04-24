/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';

const userActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'user_registered',
      'user_login',
      'user_enrolled',
      'payment_succeeded',
      'payment_failed',
      'subscription_started',
      'subscription_canceled',
      'course_started',
      'lesson_completed',
      'quiz_passed',
      'quiz_failed',
      'course_completed',
      'course_failed',
      'certificate_generated'
    ],
    index: true
  },
  userName: { type: String },
  userEmail: { type: String },

  // Contextual data
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InteractiveCourse',
    index: true
  },
  courseName: { type: String },
  data: { type: mongoose.Schema.Types.Mixed },

  // Timestamps
  timestamp: { type: Date, default: Date.now }
}, {
  timestamps: false
});

// Compound indexes for common queries
userActivitySchema.index({ userId: 1, type: 1, timestamp: -1 });
userActivitySchema.index({ type: 1, timestamp: -1 });
userActivitySchema.index({ userId: 1, timestamp: -1 });

// TTL index — keep activities for 2 years
userActivitySchema.index({ timestamp: 1 }, { expireAfterSeconds: 63072000 });

const UserActivity = mongoose.model('UserActivity', userActivitySchema);

export default UserActivity;
