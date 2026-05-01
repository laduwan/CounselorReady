// models/Certificate.js
// Stores generated CE certificates

const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  // Unique certificate number (e.g., "CR-2026-0001")
  certificateNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  // User who earned the certificate
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  // Course completed
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InteractiveCourse',
    required: true,
    index: true
  },

  // CE Log reference (the completion record)
  ceLog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CELog',
    index: true
  },

  // Certificate details
  completionDate: {
    type: Date,
    required: true
  },
  ceHours: {
    type: Number,
    required: true
  },

  // ── Approval body selection (set at issuance time) ──────────────────────────
  // Which approval body the user selected when requesting the certificate.
  // Must match one of the `body` values in course.approvals[].
  selectedApprovalBody: {
    type: String,
    default: 'NBCC'
  },

  // Provider/approval number for the selected body
  // e.g. "#7760" for NBCC, "#092425" for GSCSW, "A-0426-564" for LPCAGA
  approvalProviderNumber: {
    type: String,
    default: '7760'
  },

  // Hour breakdown credited under the selected approval body.
  // Copied from course.approvals[selectedBody].hourBreakdown at issuance time.
  // Stored here so the certificate PDF is self-contained and doesn't depend
  // on the course record remaining unchanged.
  // e.g. [{ label: "ethics", hours: 3 }, { label: "core", hours: 3 }]
  creditedHourTypes: [{
    label: { type: String, required: true },
    hours: { type: Number, required: true }
  }],

  // ── Legacy NBCC fields (kept for backward compat) ──────────────────────────
  nbccProgramNumber: String,
  providerNumber: {
    type: String,
    default: '7760'
  },

  // PDF storage
  pdfUrl: {
    type: String
  },
  cloudinaryPublicId: String,

  // Template used
  template: {
    type: String,
    default: 'standard'
  },

  // Generation batch reference
  batchId: {
    type: String,
    index: true
  },

  // Email delivery status
  emailDelivery: {
    sent: { type: Boolean, default: false },
    sentAt: Date,
    messageId: String,
    error: String
  },

  // Verification
  verificationCode: {
    type: String,
    index: true
  },
  verifiedAt: Date,
  verificationCount: {
    type: Number,
    default: 0
  },

  // Soft delete / revocation
  isRevoked: {
    type: Boolean,
    default: false,
    index: true
  },
  revokedAt: Date,
  revokedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  revocationReason: String

}, {
  timestamps: true
});

// Compound indexes
certificateSchema.index({ user: 1, course: 1 });
certificateSchema.index({ user: 1, completionDate: -1 });

// Generate next certificate number
certificateSchema.statics.getNextCertificateNumber = async function() {
  const year = new Date().getFullYear();
  const prefix = `CR-${year}-`;

  const lastCert = await this.findOne({
    certificateNumber: { $regex: `^${prefix}` }
  })
  .sort({ certificateNumber: -1 })
  .lean();

  let nextNum = 1;
  if (lastCert) {
    const currentNum = parseInt(lastCert.certificateNumber.split('-')[2]);
    nextNum = currentNum + 1;
  }

  return `${prefix}${String(nextNum).padStart(4, '0')}`;
};

// Generate verification code
certificateSchema.pre('save', function(next) {
  if (!this.verificationCode) {
    this.verificationCode = require('crypto')
      .randomBytes(8)
      .toString('hex')
      .toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Certificate', certificateSchema);
