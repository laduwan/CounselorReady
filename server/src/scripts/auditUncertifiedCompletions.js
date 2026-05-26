/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 */
// server/src/scripts/auditUncertifiedCompletions.js
// ---------------------------------------------------------------------------
// READ-ONLY. Finds learners who finished a course (attestation agreed -> which
// implies assessment passed + evaluation submitted) but have NO platform
// certificate. These are people stuck exactly where Blake was.
//
// For each, it reports the course's categories[0] — the value the cert route
// feeds into Certificate.category — so we can see how many are blocked
// specifically by the enum-validation bug ('Crisis' et al.) versus some other
// cause. The category breakdown at the end tells you whether the model fix
// clears the whole backlog.
//
// Usage:
//   node src/scripts/auditUncertifiedCompletions.js
// ---------------------------------------------------------------------------

import dotenv from 'dotenv';
import mongoose from 'mongoose';

import User from '../models/User.js';
import { Course, CourseProgress } from '../models/InteractiveCourse.js';
import Evaluation from '../models/Evaluation.js';
import Certificate from '../models/Certificate.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('❌ MONGODB_URI not set'); process.exit(1); }

// The current valid set, read live from the model so this stays in sync.
const VALID_CATEGORIES = (Certificate.schema.path('category').enumValues) || [];

async function main() {
  await mongoose.connect(MONGODB_URI);

  // Candidates: attestation agreed (final gate) but not yet certified.
  const candidates = await CourseProgress.find({
    attestationAgreed: true,
    status: { $ne: 'certified' },
  }).lean();

  console.log('\n================ UNCERTIFIED COMPLETIONS AUDIT ================');
  console.log(`Candidates (attestationAgreed=true, status != certified): ${candidates.length}`);

  const stuck = [];
  const byCategory = {};       // categories[0] value -> count
  const wouldFailEnum = [];    // subset blocked specifically by the enum bug

  for (const pr of candidates) {
    // Confirm there is genuinely no platform certificate.
    const cert = await Certificate.findOne({
      userId: pr.userId, courseId: pr.courseId, source: 'platform',
    }).select('_id').lean();
    if (cert) continue; // already has a cert; status just never synced — not stuck

    const [user, course, evaluation] = await Promise.all([
      User.findById(pr.userId).select('email profile.firstName profile.lastName').lean(),
      Course.findById(pr.courseId).select('title categories').lean(),
      Evaluation.findOne({ user: pr.userId, course: pr.courseId, status: 'submitted' }).select('_id').lean(),
    ]);

    const cat = course?.categories?.[0] || '(none)';
    byCategory[cat] = (byCategory[cat] || 0) + 1;

    const enumBlocked = cat !== '(none)' && !VALID_CATEGORIES.includes(cat);
    if (enumBlocked) wouldFailEnum.push(cat);

    stuck.push({
      email: user?.email || `(user …${pr.userId?.toString().slice(-8)})`,
      course: course?.title || `(course …${pr.courseId?.toString().slice(-8)})`,
      category: cat,
      enumBlocked,
      evalOk: !!evaluation,
      completedAt: pr.completedAt ? pr.completedAt.toISOString().slice(0, 10) : '—',
    });
  }

  console.log(`Genuinely stuck (eligible, no platform cert): ${stuck.length}\n`);

  for (const s of stuck) {
    console.log(
      `  ${s.completedAt}  ${s.email}\n` +
      `      "${s.course}"\n` +
      `      category="${s.category}"  ${s.enumBlocked ? '⛔ NOT in Certificate enum (this is the bug)' : '✓ valid category'}` +
      `${s.evalOk ? '' : '  ⚠ evaluation MISSING (data anomaly)'}`
    );
  }

  console.log('\n================ CATEGORY BREAKDOWN ================');
  Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, n]) => {
      const blocked = cat !== '(none)' && !VALID_CATEGORIES.includes(cat);
      console.log(`  ${String(n).padStart(4)}  "${cat}"  ${blocked ? '⛔ blocked by enum' : '✓ valid'}`);
    });

  const enumBlockedCount = stuck.filter(s => s.enumBlocked).length;
  console.log('\n================ READ ================');
  console.log(`  ${enumBlockedCount} of ${stuck.length} stuck completions are blocked specifically by the`);
  console.log('  Certificate.category enum. Deploying the model fix (Crisis added + coercion)');
  console.log('  unblocks those; re-issue each with issueMissingCertificate.js --commit.');
  if (stuck.length - enumBlockedCount > 0) {
    console.log(`  The other ${stuck.length - enumBlockedCount} have a VALID category, so a different cause`);
    console.log('  (e.g. PDF/Cloudinary at the time) — those need a closer look per learner.');
  }
  console.log('=====================================\n');

  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error('Audit failed:', err);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});
