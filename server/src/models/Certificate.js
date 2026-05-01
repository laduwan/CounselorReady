/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  provider: {
    type: String,
    required: true,
    trim: true
  },
  completionDate: {
    type: Date,
    required: true
  },
  ceHours: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    enum: [
      'General', 
      'Ethics', 
      'Supervision', 
      'Telehealth', 
      'Cultural Diversity', 
      'Trauma', 
      'Substance Abuse', 
      'Other',
      'Core',  // Capital version used as fallback
      // Course categories (lowercase from courses)
      'core',
      'ethics',
      'supervision',
      'telehealth',
      'cultural-diversity',
      'trauma',
      'substance-abuse',
      'clinical',
      'assessment',
      'treatment',
      'professional-development'
    ],
    default: 'General'
  },
  nbccApproved: {
    type: Boolean,
    default: false
  },
  acepNumber: {
    type: String,
    trim: true
  },
  // Approving Body & Applicability
  approvingBody: {
    type: String,
    enum: ['NBCC', 'ACEP', 'LPCAGA', 'GSCSW', 'ACA', 'NASW', 'APA', 'ASWB', 'AAMFT', 'State Board', 'Other', null],
    default: null
  },
  approvalNumber: {
    type: String,
    trim: true
  },
  applicability: {
    type: String,
    enum: ['national', 'state-specific', null],
    default: null
  },
  applicableStates: [{
    type: String // State codes: "GA", "FL", etc. Empty = all states (national)
  }],
  certificateNumber: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  },
  credentials: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserCredential'
  }],
  fileUrl: {
    type: String
  },
  fileKey: {
    type: String
  },
  fileName: {
    type: String
  },
  fileType: {
    type: String
  },
  notes: {
    type: String,
    trim: true
  },
  source: {
    type: String,
    enum: ['upload', 'platform', 'import'],
    default: 'upload'
  },
  // CE Broker integration
  ceBrokerStatus: {
    type: String,
    enum: ['not_reported', 'pending', 'reported', 'failed'],
    default: 'not_reported'
  },
  ceBrokerConfirmation: {
    type: String
  },
  ceBrokerReportedAt: {
    type: Date
  },
  
  // Verification
  verificationCode: {
    type: String,
    unique: true,
    sparse: true
  },
  verificationUrl: {
    type: String
  },
  isRevoked: {
    type: Boolean,
    default: false
  },
  revokedAt: {
    type: Date
  },
  revokedReason: {
    type: String
  }
}, {
  timestamps: true
});

// Generate verification code before saving
certificateSchema.pre('save', function(next) {
  if (!this.verificationCode) {
    // Generate unique verification code: CR-XXXXXX-XXXX
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No confusing chars
    let code = 'CR-';
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
    code += '-';
    for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
    this.verificationCode = code;
    this.verificationUrl = `https://counselorready.com/verify/${code}`;
  }
  next();
});

certificateSchema.index({ userId: 1, completionDate: -1 });
certificateSchema.index({ userId: 1, courseId: 1 });

export default mongoose.model('Certificate', certificateSchema);
