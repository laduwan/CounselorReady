/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  email: { type: String, required: true, lowercase: true },
  role: { type: String, enum: ['member', 'manager', 'owner'], default: 'member' },
  invitedAt: { type: Date, default: Date.now },
  joinedAt: { type: Date },
  status: { type: String, enum: ['invited', 'active', 'removed'], default: 'invited' }
}, { _id: true });

const organizationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, lowercase: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Business info
  type: {
    type: String,
    enum: ['group_practice', 'agency', 'clinic', 'hospital', 'university', 'other'],
    default: 'group_practice'
  },
  address: {
    street: String,
    city: String,
    state: { type: String, uppercase: true },
    zip: String
  },
  phone: String,
  website: String,
  npiNumber: String,
  taxId: String,

  // Subscription
  plan: {
    type: String,
    enum: ['team_starter', 'team_professional', 'team_enterprise'],
    default: 'team_starter'
  },
  maxSeats: { type: Number, default: 5 },
  stripeCustomerId: String,
  stripeSubscriptionId: String,
  billingEmail: String,

  // Seats
  seats: [seatSchema],

  // Settings
  settings: {
    requireCourseApproval: { type: Boolean, default: false },
    sharedCredentialTracking: { type: Boolean, default: true },
    complianceAlerts: { type: Boolean, default: true },
    allowSelfEnroll: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

// Generate slug from name
organizationSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

organizationSchema.index({ ownerId: 1 });
organizationSchema.index({ 'seats.userId': 1 });
organizationSchema.index({ 'seats.email': 1 });

// Get active seat count
organizationSchema.methods.getActiveSeatCount = function() {
  return this.seats.filter(s => s.status === 'active' || s.status === 'invited').length;
};

// Check if org can add more seats
organizationSchema.methods.canAddSeat = function() {
  return this.getActiveSeatCount() < this.maxSeats;
};

const Organization = mongoose.model('Organization', organizationSchema);
export default Organization;
