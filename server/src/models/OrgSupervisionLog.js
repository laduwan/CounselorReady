/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */

/**
 * OrgSupervisionLog — org-scoped supervision session with dual sign-off.
 *
 * NEW additive collection. Intentionally distinct from the existing personal,
 * user-scoped `SupervisionLog` (that working model is NOT modified). This one
 * binds a supervisee membership to a supervisor membership for org/ASO quality
 * reviews, and supports the GA CADC-T documentation form (Manual Appendix D).
 *
 * Running totals are computed on read (aggregate), not stored.
 */
import mongoose from 'mongoose';

const orgSupervisionLogSchema = new mongoose.Schema({
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },

  superviseeSeatId: { type: mongoose.Schema.Types.ObjectId },
  superviseeUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  supervisorSeatId: { type: mongoose.Schema.Types.ObjectId },
  supervisorUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  supervisorName: { type: String, trim: true },

  date: { type: Date, required: true },
  hours: { type: Number, required: true, min: 0 },
  format: { type: String, enum: ['individual', 'group', 'triadic'], default: 'individual' },
  modality: { type: String, enum: ['in_person', 'telehealth'], default: 'in_person' },

  // GA DBHDD §II.7–8: CADC-T form (Manual Appendix D) for CADC-trainees.
  formType: { type: String, enum: ['standard', 'CADC-T'], default: 'standard' },

  notes: { type: String },
  superviseeSignedAt: { type: Date },
  supervisorSignedAt: { type: Date }
}, {
  timestamps: true
});

orgSupervisionLogSchema.index({ orgId: 1, superviseeUserId: 1 });

const OrgSupervisionLog = mongoose.model('OrgSupervisionLog', orgSupervisionLogSchema);
export default OrgSupervisionLog;
