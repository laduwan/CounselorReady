/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * StorageUsage Model
 * 
 * Tracks file uploads per provider for storage billing
 */

import mongoose from 'mongoose';

const storageUsageSchema = new mongoose.Schema({
  // Provider identification
  providerId: {
    type: String,
    required: true,
    index: true,
  },
  
  // File information
  key: {
    type: String,
    required: true,
    unique: true, // Each file path is unique
  },
  originalName: {
    type: String,
  },
  size: {
    type: Number,
    required: true, // Size in bytes
  },
  type: {
    type: String,
    enum: ['video', 'resource', 'image', 'other'],
    default: 'other',
  },
  contentType: {
    type: String, // MIME type
  },
  
  // URL (R2 public or signed URL)
  url: {
    type: String,
  },

  // Association
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  
  // Metadata
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  
  // For billing
  billingMonth: {
    type: String, // Format: "2026-01"
    default: () => {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    },
  },
  
}, {
  timestamps: true,
});

// Indexes for efficient queries
storageUsageSchema.index({ providerId: 1, type: 1 });
storageUsageSchema.index({ providerId: 1, billingMonth: 1 });
storageUsageSchema.index({ courseId: 1 });

// Static: Get total storage used by provider
storageUsageSchema.statics.getProviderUsage = async function(providerId) {
  const result = await this.aggregate([
    { $match: { providerId: providerId.toString() } },
    { $group: { _id: null, totalBytes: { $sum: '$size' }, fileCount: { $sum: 1 } } }
  ]);
  
  return {
    totalBytes: result[0]?.totalBytes || 0,
    fileCount: result[0]?.fileCount || 0,
  };
};

// Static: Get storage breakdown by type
storageUsageSchema.statics.getProviderUsageByType = async function(providerId) {
  const result = await this.aggregate([
    { $match: { providerId: providerId.toString() } },
    { 
      $group: { 
        _id: '$type', 
        totalBytes: { $sum: '$size' }, 
        fileCount: { $sum: 1 } 
      } 
    }
  ]);
  
  return result.reduce((acc, item) => {
    acc[item._id] = { totalBytes: item.totalBytes, fileCount: item.fileCount };
    return acc;
  }, {});
};

// Static: Get files for a course
storageUsageSchema.statics.getCourseFiles = async function(courseId) {
  return this.find({ courseId }).sort({ createdAt: -1 });
};

// Static: Get monthly usage for billing
storageUsageSchema.statics.getMonthlyUsage = async function(providerId, month) {
  // For storage billing, we need peak usage during the month
  // This simplified version just returns current total
  const result = await this.aggregate([
    { 
      $match: { 
        providerId: providerId.toString(),
        createdAt: { $lte: new Date(`${month}-31`) } // Files existing by end of month
      } 
    },
    { $group: { _id: null, totalBytes: { $sum: '$size' } } }
  ]);
  
  return result[0]?.totalBytes || 0;
};

// Instance method: Format size
storageUsageSchema.methods.getFormattedSize = function() {
  const bytes = this.size;
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const StorageUsage = mongoose.model('StorageUsage', storageUsageSchema);

export default StorageUsage;
