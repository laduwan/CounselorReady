/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['credential_expiring', 'ce_reminder', 'course_completed', 'system', 'welcome', 'info', 'badge_earned', 'referral', 'supervision', 'trial'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  urgency: {
    type: String,
    enum: ['info', 'warning', 'urgent'],
    default: 'info'
  },
  read: {
    type: Boolean,
    default: false
  },
  dismissed: {
    type: Boolean,
    default: false
  },
  credentialId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserCredential'
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  actionUrl: {
    type: String
  },
  link: {
    type: String
  },
  readAt: {
    type: Date
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Index for efficient queries
notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, dismissed: 1 });

// Get unread count for a user
notificationSchema.statics.getUnreadCount = async function(userId) {
  return this.countDocuments({ userId, read: false, dismissed: false });
};

// Mark all as read for a user
notificationSchema.statics.markAllRead = async function(userId) {
  return this.updateMany({ userId, read: false }, { read: true });
};

// Get recent notifications for a user
notificationSchema.statics.getRecent = async function(userId, limit = 10) {
  return this.find({ userId, dismissed: false })
    .sort({ createdAt: -1 })
    .limit(limit);
};

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
