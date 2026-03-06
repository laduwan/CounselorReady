/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';

const ltiConsumerSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  secret: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  contactEmail: {
    type: String,
    default: ''
  },
  active: {
    type: Boolean,
    default: true
  },
  // Track usage
  launchCount: {
    type: Number,
    default: 0
  },
  lastLaunchAt: {
    type: Date
  },
  // Restrict to specific courses (empty = all courses)
  allowedCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Static method to get consumer by key
ltiConsumerSchema.statics.getByKey = async function(key) {
  return this.findOne({ key, active: true });
};

// Instance method to record launch
ltiConsumerSchema.methods.recordLaunch = async function() {
  this.launchCount += 1;
  this.lastLaunchAt = new Date();
  return this.save();
};

export default mongoose.model('LtiConsumer', ltiConsumerSchema);
