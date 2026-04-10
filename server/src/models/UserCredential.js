/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';

const ceuLogSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  hours: { type: Number, required: true },
  category: { type: String, required: true },
  source: {
    type: String,
    enum: ['internal', 'external'],
    default: 'external'
  },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  certificateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Certificate' },
  description: { type: String, required: true },
  provider: { type: String }
});

const requirementProgressSchema = new mongoose.Schema({
  category: { type: String, required: true },
  hoursRequired: { type: Number, required: true },
  hoursCompleted: { type: Number, default: 0 }
}, { _id: false });

const userCredentialSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Credential info
  credentialType: {
    type: String,
    enum: ['state_license', 'national_cert', 'specialty_cert', 'training', 'custom', 'other'],
    required: true
  },
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CredentialTemplate'
  },
  
  // Basic info (can override template)
  name: { type: String, required: true }, // "Georgia LPC"
  code: { type: String }, // "LPC"
  issuingBody: { type: String, required: true },
  licenseNumber: { type: String },
  state: { type: String, uppercase: true },
  
  // Dates
  issueDate: { type: Date },
  expirationDate: { type: Date, required: true },
  renewalCycle: { type: Number, required: true }, // Months
  
  // Document upload
  documentUrl: { type: String },
  documentName: { type: String },
  
  // Requirements
  totalCEUsRequired: { type: Number, required: true },
  requirements: [requirementProgressSchema],
  
  // CEU tracking
  ceuLogs: [ceuLogSchema],
  
  // Computed fields (updated on CEU log changes)
  totalCEUsCompleted: { type: Number, default: 0 },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'expiring_soon', 'expired', 'renewed'],
    default: 'active'
  },
  
  // Reminder settings (can override user defaults)
  remindersEnabled: { type: Boolean, default: true },
  customReminders: [{
    monthsBefore: { type: Number },
    sent: { type: Boolean, default: false },
    sentAt: { type: Date }
  }],
  reminderSent_90d: { type: Boolean, default: false },
  reminderSent_60d: { type: Boolean, default: false },
  reminderSent_30d: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Indexes
userCredentialSchema.index({ userId: 1 });
userCredentialSchema.index({ userId: 1, expirationDate: 1 });
userCredentialSchema.index({ status: 1, expirationDate: 1 });

// Virtual for days until expiration
userCredentialSchema.virtual('daysUntilExpiration').get(function() {
  if (!this.expirationDate) return null;
  const now = new Date();
  const diffTime = this.expirationDate - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for percent complete
userCredentialSchema.virtual('percentComplete').get(function() {
  if (!this.totalCEUsRequired) return 0;
  return Math.min(100, Math.round((this.totalCEUsCompleted / this.totalCEUsRequired) * 100));
});

// Update status based on expiration date
userCredentialSchema.methods.updateStatus = function() {
  const daysLeft = this.daysUntilExpiration;
  
  if (daysLeft < 0) {
    this.status = 'expired';
  } else if (daysLeft <= 90) {
    this.status = 'expiring_soon';
  } else {
    this.status = 'active';
  }
  
  return this;
};

// Add CEU hours
userCredentialSchema.methods.addCEU = async function(ceuData) {
  const { hours, category, source, courseId, certificateId, description, provider, date } = ceuData;
  
  // Normalize category for consistency
  const normalizedCategory = category || 'General';
  
  // Check if this certificate is already logged (prevent duplicates)
  if (certificateId) {
    const alreadyLogged = this.ceuLogs.some(log => 
      log.certificateId && log.certificateId.toString() === certificateId.toString()
    );
    if (alreadyLogged) {
      console.log(`Certificate ${certificateId} already logged to credential ${this._id}`);
      return this; // Return without saving duplicate
    }
  }
  
  // Add to log
  this.ceuLogs.push({
    date: date || new Date(),
    hours,
    category: normalizedCategory,
    source: source || 'external',
    courseId,
    certificateId,
    description: description || 'CE Hours',
    provider
  });
  
  // Update category progress - CASE INSENSITIVE matching
  const categoryLower = normalizedCategory.toLowerCase();
  const requirement = this.requirements.find(r => 
    r.category?.toLowerCase() === categoryLower
  );
  
  if (requirement) {
    requirement.hoursCompleted = Math.min(
      requirement.hoursRequired,
      requirement.hoursCompleted + hours
    );
  }
  
  // Also add to "General" if it exists and category wasn't general
  // This handles overflow from specific categories into general requirements
  if (categoryLower !== 'general') {
    const generalReq = this.requirements.find(r => 
      r.category?.toLowerCase() === 'general'
    );
    if (generalReq && generalReq.hoursCompleted < generalReq.hoursRequired) {
      // Check if the specific category is now full
      const catReq = this.requirements.find(r => 
        r.category?.toLowerCase() === categoryLower
      );
      if (catReq && catReq.hoursCompleted >= catReq.hoursRequired) {
        // Calculate excess hours that can go to general
        const excess = (catReq.hoursCompleted + hours) - catReq.hoursRequired;
        if (excess > 0) {
          generalReq.hoursCompleted = Math.min(
            generalReq.hoursRequired,
            generalReq.hoursCompleted + excess
          );
        }
      } else if (!catReq) {
        // No specific requirement for this category, add to general
        generalReq.hoursCompleted = Math.min(
          generalReq.hoursRequired,
          generalReq.hoursCompleted + hours
        );
      }
    }
  }
  
  // Update total
  this.totalCEUsCompleted = this.ceuLogs.reduce((sum, log) => sum + (log.hours || 0), 0);
  
  return this.save();
};

// Get remaining hours by category
userCredentialSchema.methods.getRemainingHours = function() {
  return this.requirements.map(req => ({
    category: req.category,
    required: req.hoursRequired,
    completed: req.hoursCompleted,
    remaining: Math.max(0, req.hoursRequired - req.hoursCompleted)
  }));
};

// Recalculate all progress from ceuLogs (useful for data repair)
userCredentialSchema.methods.recalculateProgress = function() {
  // Reset all requirement progress
  for (const req of this.requirements) {
    req.hoursCompleted = 0;
  }
  
  // Recalculate from ceuLogs
  for (const log of this.ceuLogs) {
    const categoryLower = (log.category || 'general').toLowerCase();
    
    // Find matching requirement (case-insensitive)
    const requirement = this.requirements.find(r => 
      r.category?.toLowerCase() === categoryLower
    );
    
    if (requirement) {
      requirement.hoursCompleted = Math.min(
        requirement.hoursRequired,
        requirement.hoursCompleted + (log.hours || 0)
      );
    }
  }
  
  // Handle categories that don't match specific requirements - add to General
  const generalReq = this.requirements.find(r => r.category?.toLowerCase() === 'general');
  if (generalReq) {
    const specificCategories = this.requirements
      .filter(r => r.category?.toLowerCase() !== 'general')
      .map(r => r.category?.toLowerCase());
    
    // Add hours from non-matching categories to General
    for (const log of this.ceuLogs) {
      const categoryLower = (log.category || 'general').toLowerCase();
      if (!specificCategories.includes(categoryLower) && categoryLower !== 'general') {
        generalReq.hoursCompleted = Math.min(
          generalReq.hoursRequired,
          generalReq.hoursCompleted + (log.hours || 0)
        );
      }
    }
    
    // Also add overflow from maxed-out categories
    for (const req of this.requirements) {
      if (req.category?.toLowerCase() !== 'general') {
        const catLogs = this.ceuLogs.filter(log => 
          (log.category || 'general').toLowerCase() === req.category?.toLowerCase()
        );
        const catTotal = catLogs.reduce((sum, log) => sum + (log.hours || 0), 0);
        if (catTotal > req.hoursRequired) {
          generalReq.hoursCompleted = Math.min(
            generalReq.hoursRequired,
            generalReq.hoursCompleted + (catTotal - req.hoursRequired)
          );
        }
      }
    }
  }
  
  // Update total
  this.totalCEUsCompleted = this.ceuLogs.reduce((sum, log) => sum + (log.hours || 0), 0);
  
  return this;
};

// Ensure virtuals in JSON
userCredentialSchema.set('toJSON', { virtuals: true });
userCredentialSchema.set('toObject', { virtuals: true });

const UserCredential = mongoose.model('UserCredential', userCredentialSchema);

export default UserCredential;
