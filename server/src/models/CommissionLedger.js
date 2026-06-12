/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 *
 * Records the revenue split for a syndicated course sale (the "marketing additive"
 * reciprocal program). The DISTRIBUTOR keeps `distributorRate` (default 15%); the course
 * OWNER keeps the rest. This is an accounting record only — it does NOT move money.
 * Payouts are settled separately (Stripe Connect transfers or periodic manual payout),
 * which is the one piece that still needs a rail.
 */
import mongoose from 'mongoose';

const commissionLedgerSchema = new mongoose.Schema({
  saleId: { type: String, index: true },            // Stripe session/payment intent id
  paymentIntentId: { type: String, index: true },   // Stripe payment_intent — used to match refunds
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'InteractiveCourse' },
  courseTitle: String,

  grossAmount: { type: Number, required: true },    // amount the buyer paid (USD)
  currency: { type: String, default: 'usd' },

  // Who owns the course vs. who distributed (sold) it
  ownerType: { type: String, enum: ['platform', 'partner'], required: true },
  ownerPartnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Partner', default: null },
  distributorType: { type: String, enum: ['platform', 'partner'], required: true },
  distributorPartnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Partner', default: null },

  distributorRate: { type: Number, default: 0.15 },
  distributorAmount: { type: Number, required: true }, // gross * rate (kept by distributor)
  ownerAmount: { type: Number, required: true },       // gross - distributorAmount (kept by owner)

  buyerUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  status: { type: String, enum: ['pending', 'paid', 'void'], default: 'pending', index: true },
  paidAt: { type: Date },
  payoutRef: { type: String }, // Stripe transfer id or manual payout reference, when settled
  settlementMethod: { type: String, enum: ['credit', 'cash', 'external', 'connect'], default: null },

  // Refund handling
  voidedAt: { type: Date },
  refundedAmount: { type: Number, default: 0 },  // cumulative refunded gross (USD)
  // true when the entry was already 'paid' (partner already settled) at the time it was voided
  // or partially refunded — i.e. the platform needs to claw the amount back from the partner.
  clawbackRequired: { type: Boolean, default: false },
  clawbackAmount: { type: Number, default: 0 },   // partner-share amount to recover (USD)

  // Platform accounting treatment of the money that leaves the platform on this sale:
  //  - 'advertising' : we own the course, a partner sold it → the 15% we pay the partner is
  //                    a marketing/distribution (advertising) expense.
  //  - 'cogs'        : a partner owns the course, we sold it → the 85% we pass to the partner
  //                    is cost of goods (their content); our 15% is platform revenue.
  accountingCategory: { type: String, enum: ['advertising', 'cogs'], required: true }
}, { timestamps: true });

commissionLedgerSchema.index({ ownerPartnerId: 1, status: 1 });
commissionLedgerSchema.index({ distributorPartnerId: 1, status: 1 });

const CommissionLedger = mongoose.model('CommissionLedger', commissionLedgerSchema);
export default CommissionLedger;
