/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';

const BookOrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
    index: true
  },
  // Denormalized snapshot
  bookTitle: {
    type: String
  },
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'usd'
  },
  stripeSessionId: {
    type: String,
    unique: true,
    sparse: true,
    index: true
  },
  source: {
    type: String,
    enum: ['stripe', 'member_free', 'admin_grant'],
    default: 'stripe'
  },
  status: {
    type: String,
    enum: ['paid', 'refunded', 'revoked'],
    default: 'paid',
    index: true
  },
  downloads: [{
    at: { type: Date },
    ip: { type: String },
    userAgent: { type: String }
  }],
  downloadCount: {
    type: Number,
    default: 0
  },
  // Buyer name frozen at purchase time
  watermarkName: {
    type: String
  },
  watermarkEmail: {
    type: String
  }
}, {
  timestamps: true
});

BookOrderSchema.index({ userId: 1, bookId: 1 });

// Returns 'BK-' + 6 uppercase alphanumeric chars.
// Matches the style of generateCertificateNumber in server/src/utils/certificate.js.
export function generateOrderNumber() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let suffix = '';
  for (let i = 0; i < 6; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `BK-${suffix}`;
}

export default mongoose.model('BookOrder', BookOrderSchema);
