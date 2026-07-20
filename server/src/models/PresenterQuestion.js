/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';

// Content-intelligence loop for "Ask the Presenter": logs the QUESTION only
// (never the generated answer) so course authors can see what learners are
// actually asking and revise content accordingly.
const PresenterQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  slug: { type: String, required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  answeredFromSection: String
}, { timestamps: true });

PresenterQuestionSchema.index({ slug: 1, createdAt: -1 });

export default mongoose.model('PresenterQuestion', PresenterQuestionSchema);
