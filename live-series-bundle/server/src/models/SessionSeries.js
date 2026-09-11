/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 */

/**
 * SessionSeries — a multi-part live course that earns ONE certificate.
 * Maps onto the existing `sessionseries` collection (created Jul 24 for the
 * Ethics Table Talk). strict:false keeps any legacy fields on those documents.
 *
 * Member sessions point here with LiveSession.seriesId + LiveSession.seriesPart
 * (1..partsRequired). Certificates: services/liveSessionCompletionService.js →
 * issueSeriesCertificates().
 *
 * completionRule
 *   partsRequired  how many parts earn the certificate (default 2)
 *   withinDays     null  → flexible: parts can be taken any time, any order
 *                  N     → all counted parts must fall within N days of each
 *                          other (Ethics Table Talk: 3 → the same Mon+Tue pair)
 */
import mongoose from 'mongoose';

const sessionSeriesSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, trim: true, lowercase: true },
  description: { type: String, default: '' },
  certificateTitle: { type: String, trim: true, default: '' }, // falls back to title
  totalCeuHours: { type: Number, min: 0, default: 0 },          // 0 → sum of the parts counted
  category: { type: String, default: '' },
  price: { type: Number, min: 0, default: 0 },
  isPublished: { type: Boolean, default: false },
  completionRule: {
    partsRequired: { type: Number, min: 1, max: 20, default: 2 },
    withinDays: { type: Number, min: 0, max: 365, default: null }
  }
}, { timestamps: true, strict: false, collection: 'sessionseries' });

export default mongoose.models.SessionSeries || mongoose.model('SessionSeries', sessionSeriesSchema);
