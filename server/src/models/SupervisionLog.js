/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  hours: { type: Number, required: true, min: 0.25, max: 8 },
  type: {
    type: String,
    enum: ['individual', 'group', 'live_observation', 'review_of_recordings', 'triadic'],
    required: true
  },
  modality: {
    type: String,
    enum: ['in_person', 'telehealth', 'hybrid'],
    default: 'in_person'
  },
  topics: [String],
  notes: String,
  supervisorSignedOff: { type: Boolean, default: false }
}, { _id: true, timestamps: true });

const supervisionLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Supervisor info
  supervisor: {
    name: { type: String, required: true },
    credentials: String, // e.g., "LPC-S, NCC"
    licenseNumber: String,
    email: String,
    phone: String,
    state: { type: String, uppercase: true }
  },

  // Supervision plan
  licenseType: { type: String, required: true }, // e.g., "LPC", "LMHC"
  state: { type: String, required: true, uppercase: true },
  totalHoursRequired: { type: Number, required: true },
  startDate: { type: Date, required: true },
  targetCompletionDate: Date,

  // Hours breakdown requirements (vary by state)
  requirements: {
    totalDirect: { type: Number, default: 0 },     // direct client hours needed
    totalIndividual: { type: Number, default: 0 },  // individual supervision hours needed
    totalGroup: { type: Number, default: 0 },       // group supervision hours allowed/needed
    maxGroupPercent: { type: Number, default: 50 }   // max % that can be group
  },

  // Sessions
  sessions: [sessionSchema],

  // Status
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'on_hold'],
    default: 'in_progress'
  },
  completedAt: Date,
  boardSubmittedAt: Date
}, {
  timestamps: true
});

supervisionLogSchema.index({ userId: 1, status: 1 });

// Virtual: total logged hours
supervisionLogSchema.virtual('totalLoggedHours').get(function () {
  return this.sessions.reduce((sum, s) => sum + s.hours, 0);
});

supervisionLogSchema.virtual('individualHours').get(function () {
  return this.sessions.filter(s => s.type === 'individual').reduce((sum, s) => sum + s.hours, 0);
});

supervisionLogSchema.virtual('groupHours').get(function () {
  return this.sessions.filter(s => s.type === 'group').reduce((sum, s) => sum + s.hours, 0);
});

supervisionLogSchema.virtual('progressPercent').get(function () {
  const total = this.sessions.reduce((sum, s) => sum + s.hours, 0);
  return Math.min(100, Math.round((total / this.totalHoursRequired) * 100));
});

supervisionLogSchema.set('toJSON', { virtuals: true });
supervisionLogSchema.set('toObject', { virtuals: true });

const SupervisionLog = mongoose.model('SupervisionLog', supervisionLogSchema);
export default SupervisionLog;
