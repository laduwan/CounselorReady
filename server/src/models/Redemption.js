// server/src/models/Redemption.js
//
// Tracks Mastery Mark Point (MMP) redemptions.
// Separate collection from User for efficient admin queue queries.
//
// Types:
//   - 'stripe_credit_10' — 500 MMP → $10 Stripe credit (auto-fulfilled via Stripe customer balance)
//   - 'stripe_credit_25' — 1000 MMP → $25 Stripe credit (auto-fulfilled)
//   - 'giftcard_25'      — 1500 MMP → $25 gift card (manually fulfilled by admin)
//
// Status flow:
//   pending  → fulfilled    (Stripe credit: immediately; Gift card: when admin marks)
//            → cancelled    (refund issued; reason recorded)

import mongoose from 'mongoose';

const redemptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },

  type: {
    type: String,
    enum: ['stripe_credit_10', 'stripe_credit_25', 'giftcard_25'],
    required: true,
  },

  pointsCost: {
    type: Number,
    required: true,
  },

  dollarValue: {
    type: Number,
    required: true,
  },

  // Vendor (gift cards only). Null for Stripe credit.
  vendor: {
    type: String,
    enum: [
      'amazon',
      'doordash',
      'celestial_spa_atlanta',
      'wellness_spot_college_park',
      'noir_pearl_smyrna',
      'healing_oasis_augusta',
      'blessed_hands_augusta',
      'hetep_retreat_columbus',
      'honey_pot_macon',
      'culler_massage_macon',
      'odomi_medical_savannah',
    ],
    default: null,
  },

  status: {
    type: String,
    enum: ['pending', 'fulfilled', 'cancelled'],
    default: 'pending',
    index: true,
  },

  // Stripe credit specifics
  stripeBalanceTransactionId: { type: String, default: null },
  stripeCustomerId: { type: String, default: null },

  // Gift card specifics (filled when admin fulfills)
  giftcardCode: { type: String, default: null },
  giftcardCodeNotes: { type: String, default: null }, // expiry, vendor instructions, etc.

  // Fulfillment tracking
  fulfilledAt: { type: Date, default: null },
  fulfilledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },

  // Cancellation tracking
  cancelledAt: { type: Date, default: null },
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  cancelReason: { type: String, default: null },

  // Admin notes (free-form)
  adminNotes: { type: String, default: '' },

  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

// Compound index for admin queue (status + sort by oldest first)
redemptionSchema.index({ status: 1, createdAt: 1 });

// Compound index for user history (userId + sort by newest first)
redemptionSchema.index({ userId: 1, createdAt: -1 });

const Redemption = mongoose.model('Redemption', redemptionSchema);

export default Redemption;
