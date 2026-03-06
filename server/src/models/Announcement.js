/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  // Basic info
  title: { type: String, required: true },
  message: { type: String, required: true },
  
  // Type of announcement
  type: {
    type: String,
    enum: ['info', 'update', 'maintenance', 'promotion', 'urgent', 'ce_change', 'new_course'],
    default: 'info'
  },
  
  // Visual styling
  icon: { type: String }, // FontAwesome icon class
  color: { type: String }, // Tailwind color class
  
  // Targeting
  audience: {
    type: String,
    enum: ['all', 'free', 'professional', 'vip', 'specific', 'by_credential'],
    default: 'all'
  },
  specificUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  targetStates: [{ type: String }], // For CE change announcements - target specific states
  targetCredentials: [{ type: String }], // For CE change - target specific credentials (e.g., "LPC", "LMHC")
  
  // Scheduling
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  
  // Display options
  isPinned: { type: Boolean, default: false },
  showOnDashboard: { type: Boolean, default: true },
  dismissible: { type: Boolean, default: true },
  
  // Email options
  sendEmail: { type: Boolean, default: false },
  emailSent: { type: Boolean, default: false },
  
  // Tracking
  readBy: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    readAt: { type: Date, default: Date.now }
  }],
  dismissedBy: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    dismissedAt: { type: Date, default: Date.now }
  }],
  
  // Metadata
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true },
  
  // CE Change specific fields
  ceChangeDetails: {
    credentialCode: { type: String },
    state: { type: String },
    previousRequirements: { type: String },
    newRequirements: { type: String },
    effectiveDate: { type: Date },
    sourceUrl: { type: String }
  }
}, {
  timestamps: true
});

// Indexes
announcementSchema.index({ isActive: 1, startDate: 1, endDate: 1 });
announcementSchema.index({ audience: 1 });
announcementSchema.index({ type: 1 });
announcementSchema.index({ targetStates: 1 });
announcementSchema.index({ targetCredentials: 1 });

// Static method to get announcements for a user
announcementSchema.statics.getForUser = async function(user) {
  const now = new Date();
  
  // Build query for active announcements
  const query = {
    isActive: true,
    startDate: { $lte: now },
    $or: [
      { endDate: null },
      { endDate: { $gte: now } }
    ]
  };
  
  // Get user's credentials for targeting
  const UserCredential = mongoose.model('UserCredential');
  const userCredentials = await UserCredential.find({ userId: user._id });
  const userStates = [...new Set(userCredentials.map(c => c.state).filter(Boolean))];
  const userCredCodes = [...new Set(userCredentials.map(c => c.credentialCode).filter(Boolean))];
  
  // Map subscription plan
  const planMap = {
    'free': 'free',
    'professional': 'professional',
    'monthly': 'professional',
    'vip': 'vip',
    'annual_vip': 'vip',
    'lifetime': 'vip'
  };
  const userPlan = planMap[user.subscription?.plan] || 'free';
  
  const announcements = await this.find(query)
    .sort({ isPinned: -1, createdAt: -1 });
  
  // Filter by targeting
  return announcements.filter(ann => {
    // Check if dismissed
    if (ann.dismissedBy.some(d => d.userId.toString() === user._id.toString())) {
      return false;
    }
    
    // Check audience
    if (ann.audience === 'all') return true;
    if (ann.audience === 'specific') {
      return ann.specificUsers.some(id => id.toString() === user._id.toString());
    }
    if (ann.audience === 'by_credential') {
      // Check if user has matching state or credential
      const hasMatchingState = ann.targetStates.length === 0 || 
        ann.targetStates.some(s => userStates.includes(s));
      const hasMatchingCred = ann.targetCredentials.length === 0 || 
        ann.targetCredentials.some(c => userCredCodes.includes(c));
      return hasMatchingState && hasMatchingCred;
    }
    // Check plan-based audience
    return ann.audience === userPlan;
  });
};

// Method to mark as dismissed for a user
announcementSchema.methods.dismissForUser = function(userId) {
  if (!this.dismissedBy.some(d => d.userId.toString() === userId.toString())) {
    this.dismissedBy.push({ userId });
    return this.save();
  }
  return Promise.resolve(this);
};

const Announcement = mongoose.model('Announcement', announcementSchema);

export default Announcement;
