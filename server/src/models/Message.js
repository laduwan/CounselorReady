/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  // Conversation thread
  conversationId: {
    type: String,
    index: true
  },
  fromAdmin: {
    type: Boolean,
    default: false
  },
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  toAdmin: {
    type: Boolean,
    default: false
  },
  subject: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  // File attachments
  attachments: [{
    filename: String,
    originalName: String,
    mimeType: String,
    size: Number,
    url: String,
    cloudinaryId: String
  }],
  type: {
    type: String,
    enum: ['general', 'support', 'billing', 'credential', 'course', 'reminder', 'question'],
    default: 'general'
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high'],
    default: 'normal'
  },
  status: {
    type: String,
    enum: ['open', 'replied', 'resolved', 'closed'],
    default: 'open'
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  archived: {
    type: Boolean,
    default: false
  },
  // For threading
  parentMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  // Metadata for context
  relatedCredential: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserCredential'
  },
  relatedCourse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  // Email tracking
  emailSent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
messageSchema.index({ toUser: 1, read: 1, createdAt: -1 });
messageSchema.index({ toAdmin: 1, read: 1, createdAt: -1 });
messageSchema.index({ conversationId: 1, createdAt: 1 });

// Get unread count for user
messageSchema.statics.getUnreadCount = async function(userId) {
  return this.countDocuments({ toUser: userId, read: false, archived: false });
};

// Get unread count for admin
messageSchema.statics.getAdminUnreadCount = async function() {
  return this.countDocuments({ toAdmin: true, read: false, archived: false });
};

// Mark as read
messageSchema.methods.markAsRead = async function() {
  if (!this.read) {
    this.read = true;
    this.readAt = new Date();
    await this.save();
  }
  return this;
};

// Generate conversation ID
messageSchema.statics.generateConversationId = function(userId) {
  return `conv_${userId}_${Date.now()}`;
};

const Message = mongoose.model('Message', messageSchema);

export default Message;
