/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */

import mongoose from 'mongoose';

/**
 * SessionSeries
 * ─────────────────────────────────────────────────────────────────
 * Groups multiple LiveSession documents into a single offering.
 * Attendees register for the series (not each individual session),
 * receive one combined certificate for the full CE total once all
 * required member sessions are attended.
 *
 * Backward compatible: LiveSessions with no `seriesId` behave exactly
 * as they always have — standalone, per-session registration, per-
 * session certificate.
 */
const SessionSeriesSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
  description: { type: String, default: '' },

  // Total CE hours across all REQUIRED sessions in the series.
  // Certificate rendering uses this; not summed at query time so
  // it stays stable if optional sessions are added/removed later.
  totalCeuHours: { type: Number, required: true, min: 0 },

  category: { type: String, default: '' }, // "Ethics", "Telehealth", etc.

  // Auto-enroll behavior when someone registers for the series:
  //  - 'all-required'  → register user in every required session
  //  - 'all'           → register in every session (required + optional)
  //  - 'manual'        → user picks which sessions individually (Stage 3 UI)
  autoEnroll: {
    type: String,
    //  - 'select'        → buyer picks occurrences summing to totalCeuHours
    enum: ['all-required', 'all', 'manual', 'select'],
    default: 'all-required'
  },

  // Cover image for catalog display (optional; falls back to first
  // session's presenter photo or a series-level default in Stage 3).
  coverImageUrl: { type: String, default: '' },

  // Presenter info at the series level (individual sessions can override).
  // Kept here so a series card can render without loading every member.
  presenter: {
    name: { type: String, default: 'Kejuiana Johnson, MA, LPC, NCC, CPCS, BC-TMH' },
    photoUrl: { type: String, default: '' }
  },

  // Series-level pricing (USD). price = standard price; earlyBirdPrice applies
  // until earlyBirdDeadline. 0 / unset = free (VIP & Annual members always free).
  price: { type: Number, default: 0, min: 0 },
  earlyBirdPrice: { type: Number, min: 0 },
  earlyBirdDeadline: { type: Date },

  isPublished: { type: Boolean, default: false, index: true },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },
  accessCode: { type: String, trim: true, uppercase: true }, // same shape as LiveSession

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

SessionSeriesSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Helpful when Stage 2 needs to fetch all sessions in a series
SessionSeriesSchema.index({ slug: 1 });

export default mongoose.model('SessionSeries', SessionSeriesSchema);
