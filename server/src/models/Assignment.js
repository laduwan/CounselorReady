/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */

/**
 * Assignment — one person, one training, one due date.
 *
 * NEW additive collection. The membership reference is the Organization seat
 * subdocument (`seatId`) — per the chosen "extend Organization.seats[]" model —
 * plus `userId` for convenient joins with Certificate/CourseProgress.
 *
 * Completion is wired via the NIGHTLY CRON reconciliation in
 * services/complianceService.js — NOT by editing the locked certificate
 * issuance pipeline.
 */
import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
  seatId: { type: mongoose.Schema.Types.ObjectId }, // Organization.seats[]._id (the membership)
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },

  courseCode: { type: String, trim: true, uppercase: true },
  courseRef: { type: mongoose.Schema.Types.ObjectId, ref: 'InteractiveCourse', default: null },
  // Snapshot title for robust cert-matching when courseRef is not yet linked.
  courseTitle: { type: String, trim: true },
  label: { type: String, trim: true },

  trackId: { type: mongoose.Schema.Types.ObjectId, ref: 'TrainingTrack', default: null },

  dueDate: { type: Date },
  status: {
    type: String,
    enum: ['assigned', 'in_progress', 'completed', 'overdue', 'waived'],
    default: 'assigned'
  },
  completedAt: { type: Date },
  certificateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Certificate', default: null },

  recurrence: { type: String, enum: ['none', 'annual', 'biennial'], default: 'none' },
  recurrenceParentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', default: null },

  // GA DBHDD agency hour accounting (§2c 16-hr annual, §3 STR 46-hr)
  subjectArea: { type: String, default: null },
  hours: { type: Number, default: 0 },          // target/seat-time hours for this item
  creditedHours: { type: Number, default: 0 },  // hours actually credited on completion
  manualVersion: { type: String, default: null, trim: true },

  deliveryMode: {
    type: String,
    enum: ['cr_delivered', 'provider_based', 'relias_online', 'external'],
    default: 'cr_delivered'
  },
  external: { type: Boolean, default: false }, // tracked-not-delivered (Relias/CPR/etc.)

  // GA STR recoupment exposure (§3): overdue STR item past the 90-day grace ⇒
  // services billed are subject to recoupment. Set by complianceService.
  recoupmentRisk: { type: Boolean, default: false },

  waivedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  waivedReason: { type: String, trim: true },

  // Dedupe ledger for due/overdue notifications: '14d','7d','1d','overdue'
  alertsSent: [{ type: String }]
}, {
  timestamps: true
});

assignmentSchema.index({ orgId: 1, status: 1 });
assignmentSchema.index({ userId: 1, status: 1 });
assignmentSchema.index({ orgId: 1, seatId: 1 });

const Assignment = mongoose.model('Assignment', assignmentSchema);
export default Assignment;
