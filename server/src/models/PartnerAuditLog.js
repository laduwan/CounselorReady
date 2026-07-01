/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';

const partnerAuditLogSchema = new mongoose.Schema({
  partnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Partner',
    required: true,
    index: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'branding_updated', 'domain_updated', 'domain_verified', 'domain_reset',
      'course_created', 'course_updated', 'course_deleted', 'courses_bulk_uploaded',
      'user_invited', 'user_removed', 'admin_set',
      'billing_plan_changed', 'billing_status_changed',
      'email_template_updated', 'partner_activated', 'partner_deactivated',
      'welcome_email_resent', 'admin_note_added', 'notification_sent',
      'partner_created', 'partner_updated'
    ]
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  performedByRole: {
    type: String,
    enum: ['admin', 'partner_admin']
  },
  details: {
    type: String
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

partnerAuditLogSchema.index({ partnerId: 1, createdAt: -1 });

const PartnerAuditLog = mongoose.model('PartnerAuditLog', partnerAuditLogSchema);

export default PartnerAuditLog;
