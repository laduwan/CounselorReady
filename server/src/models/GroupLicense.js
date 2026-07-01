/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  email: { type: String, required: true, lowercase: true },
  invitedAt: { type: Date, default: Date.now },
  acceptedAt: { type: Date },
  status: {
    type: String,
    enum: ['invited', 'active', 'revoked'],
    default: 'invited'
  }
}, { _id: true });

const groupLicenseSchema = new mongoose.Schema({
  // Organization info
  organizationName: { type: String, required: true, trim: true },
  adminUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  contactEmail: { type: String, required: true, lowercase: true },

  // License details
  plan: {
    type: String,
    enum: ['team', 'enterprise'],
    default: 'team'
  },
  totalSeats: { type: Number, required: true, min: 5 },
  seats: [seatSchema],

  // Billing
  stripeCustomerId: String,
  stripeSubscriptionId: String,
  pricePerSeat: { type: Number, default: 15.99 },
  billingCycle: { type: String, enum: ['monthly', 'annual'], default: 'annual' },
  currentPeriodStart: Date,
  currentPeriodEnd: Date,

  // Course assignments
  assignedCourses: [{
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    assignedAt: { type: Date, default: Date.now },
    dueDate: Date,
    mandatory: { type: Boolean, default: false }
  }],

  // Compliance tracking
  complianceRequirements: [{
    title: String,
    description: String,
    requiredHours: Number,
    category: String,
    deadline: Date
  }],

  // Status
  status: {
    type: String,
    enum: ['active', 'suspended', 'canceled'],
    default: 'active'
  }
}, {
  timestamps: true
});

groupLicenseSchema.index({ adminUserId: 1 });
groupLicenseSchema.index({ 'seats.userId': 1 });
groupLicenseSchema.index({ 'seats.email': 1 });

// Virtual for used seats count
groupLicenseSchema.virtual('usedSeats').get(function () {
  return this.seats.filter(s => s.status !== 'revoked').length;
});

groupLicenseSchema.virtual('availableSeats').get(function () {
  return this.totalSeats - this.seats.filter(s => s.status !== 'revoked').length;
});

groupLicenseSchema.set('toJSON', { virtuals: true });
groupLicenseSchema.set('toObject', { virtuals: true });

const GroupLicense = mongoose.model('GroupLicense', groupLicenseSchema);
export default GroupLicense;
