/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */

/**
 * TrainingTrack — reusable bundle of required trainings per role.
 *
 * NEW additive collection. `orgId: null` denotes a CR global template
 * (e.g. "Annual Compliance Core", "GA Agency — First 60 Days"). Items reference
 * compliance courses by their CR-PC code (and, when authored, by courseRef).
 */
import mongoose from 'mongoose';

const trackItemSchema = new mongoose.Schema({
  courseCode: { type: String, trim: true, uppercase: true }, // 'CR-PC101', or 'CR-PC102-{STATE}' placeholder
  courseRef: { type: mongoose.Schema.Types.ObjectId, ref: 'InteractiveCourse', default: null },
  label: { type: String, trim: true },
  required: { type: Boolean, default: true },
  dueDays: { type: Number, default: 30 },   // days from assignment to due
  recurrence: { type: String, enum: ['none', 'annual', 'biennial'], default: 'none' },

  // GA DBHDD agency hour accounting (§3 STR, §2c annual 16-hr)
  subjectArea: { type: String, default: null },
  hours: { type: Number, default: 0 },

  deliveryMode: {
    type: String,
    enum: ['cr_delivered', 'provider_based', 'relias_online', 'external'],
    default: 'cr_delivered'
  },
  // true = tracked-as-credential, CR does not deliver (Relias online, CPR/FA, Deaf Crisis)
  external: { type: Boolean, default: false }
}, { _id: true });

const trainingTrackSchema = new mongoose.Schema({
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', default: null, index: true },
  name: { type: String, required: true, trim: true },

  segment: {
    type: String,
    enum: ['private_practice', 'dbhdd_agency'],
    default: 'private_practice'
  },

  appliesToRoles: [{ type: String }],
  items: [trackItemSchema],

  // GA DBHDD quarterly manual versioning, e.g. 'FY27-Q1'
  manualVersion: { type: String, default: null, trim: true },

  // §2c GA annual 16-hr target / §3 STR 46-hr target — drives the hour counter
  annualHoursTarget: { type: Number, default: 0 },
  strHoursTarget: { type: Number, default: 0 },

  active: { type: Boolean, default: true }
}, {
  timestamps: true
});

trainingTrackSchema.index({ orgId: 1, active: 1 });
trainingTrackSchema.index({ segment: 1, orgId: 1 });

// Convenience flag — global CR template vs org-owned track.
trainingTrackSchema.virtual('isGlobalTemplate').get(function () {
  return this.orgId == null;
});

trainingTrackSchema.set('toJSON', { virtuals: true });
trainingTrackSchema.set('toObject', { virtuals: true });

const TrainingTrack = mongoose.model('TrainingTrack', trainingTrackSchema);
export default TrainingTrack;
