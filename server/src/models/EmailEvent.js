/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 */

/**
 * EmailEvent
 * Stores delivery/engagement events received from Resend webhooks
 * (sent, delivered, opened, clicked, bounced, complained, delivery_delayed).
 * Used to compute open/click rates and feed engagement analytics.
 */
import mongoose from 'mongoose';

const emailEventSchema = new mongoose.Schema(
  {
    messageId: { type: String, index: true },
    type: { type: String, required: true },
    email: { type: String, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    subject: { type: String, default: null },
    clickUrl: { type: String, default: null },
    eventAt: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

emailEventSchema.index({ type: 1, eventAt: -1 });
emailEventSchema.index({ email: 1, type: 1 });

const EmailEvent = mongoose.model('EmailEvent', emailEventSchema);

export default EmailEvent;
