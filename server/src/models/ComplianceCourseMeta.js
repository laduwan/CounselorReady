/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */

/**
 * ComplianceCourseMeta — Practice Compliance catalog metadata (CR-PC### series).
 *
 * NEW additive collection. Intentionally separate from Course.js (hard-locked)
 * and InteractiveCourse (primary content schema). This holds ONLY the catalog /
 * compliance metadata for the Practice Compliance module; `courseRef` links to
 * the actual InteractiveCourse content document once it is authored.
 *
 * Nothing here delivers course content — it describes and classifies it.
 */
import mongoose from 'mongoose';

const complianceCourseMetaSchema = new mongoose.Schema({
  // CR-PC### catalog code, e.g. 'CR-PC101', 'CR-PC102-GA', 'CR-PC410'
  code: { type: String, required: true, unique: true, trim: true, uppercase: true },
  title: { type: String, required: true, trim: true },

  // CE framing — `ceEligible` only flips true after owner CE sign-off.
  isComplianceCourse: { type: Boolean, default: true },
  ceEligible: { type: Boolean, default: false },
  ceHours: { type: Number, default: 0, min: 0 },        // NBCC CE clock hours (0 if compliance-only)
  complianceHours: { type: Number, default: 0, min: 0 }, // seat-time for the audit binder

  recurrence: { type: String, enum: ['once', 'annual', 'biennial'], default: 'annual' },

  // 'clinician' | 'associate' | 'admin' | 'staff' | 'supervisor' | 'all'
  roleTargets: [{ type: String }],

  // State-variant relationship (e.g. CR-PC102-GA is a variant of CR-PC102)
  stateVariantOf: { type: String, default: null, trim: true, uppercase: true },
  state: { type: String, default: null, uppercase: true }, // 'GA' | 'TX' | 'FL' | 'ID'

  tier: { type: Number, default: 1 }, // catalog priority 1 | 2 | 3

  // Which compliance layer this course belongs to.
  segment: {
    type: String,
    enum: ['private_practice', 'dbhdd_agency', 'all'],
    default: 'all'
  },

  // GA DBHDD agency layer fields (Standard Training Requirement / hour accounting)
  subjectArea: { type: String, default: null }, // STR subject area, e.g. 'Documentation'

  // CR delivery boundary honesty (GA doc §6.6): CR delivers provider-based hours;
  // Relias online, CPR/FA, and Deaf Crisis training are TRACKED, never delivered.
  deliveryMode: {
    type: String,
    enum: ['cr_delivered', 'provider_based', 'relias_online', 'external'],
    default: 'cr_delivered'
  },
  crDelivered: { type: Boolean, default: true },

  // Link to the actual content document once authored (null until built).
  courseRef: { type: mongoose.Schema.Types.ObjectId, ref: 'InteractiveCourse', default: null },

  // Quarterly DBHDD manual versioning, e.g. 'FY27-Q1'. null for board-CE layer.
  manualVersion: { type: String, default: null, trim: true },

  active: { type: Boolean, default: true }
}, {
  timestamps: true
});

complianceCourseMetaSchema.index({ segment: 1, tier: 1 });
complianceCourseMetaSchema.index({ stateVariantOf: 1, state: 1 });

const ComplianceCourseMeta = mongoose.model('ComplianceCourseMeta', complianceCourseMetaSchema);
export default ComplianceCourseMeta;
