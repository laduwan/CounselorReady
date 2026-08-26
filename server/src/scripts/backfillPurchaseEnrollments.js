/**
 * backfillPurchaseEnrollments.js
 *
 * For every user who has purchasedCourses entries but no matching
 * InteractiveCourseProgress record, create the enrollment.
 *
 * Dry-run by default. Pass --apply to write.
 *
 * Usage (from ~/project/src/server):
 *   node src/scripts/backfillPurchaseEnrollments.js
 *   node src/scripts/backfillPurchaseEnrollments.js --apply
 *   node src/scripts/backfillPurchaseEnrollments.js --apply --email mightymraz@yahoo.com
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// Use Mongoose models — same collection names the app uses
import User from '../models/User.js';
import { CourseProgress as InteractiveCourseProgress } from '../models/InteractiveCourse.js';

const APPLY = process.argv.includes('--apply');
const EMAIL = (() => {
  const i = process.argv.indexOf('--email');
  return i !== -1 ? process.argv[i + 1] : null;
})();

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!MONGO_URI) { console.error('❌ No MONGO URI'); process.exit(1); }

await mongoose.connect(MONGO_URI);
console.log('✅ Connected to MongoDB');
console.log('   Collection:', InteractiveCourseProgress.collection.collectionName);

const filter = EMAIL ? { email: EMAIL } : {};
const users = await User.find(
  { ...filter, 'purchasedCourses.0': { $exists: true } },
  { email: 1, purchasedCourses: 1 }
).lean();

let checked = 0, created = 0, already = 0, errors = 0;

for (const user of users) {
  for (const pc of (user.purchasedCourses || [])) {
    if (!pc.courseId) continue;
    checked++;

    const exists = await InteractiveCourseProgress.findOne({
      userId:   user._id,
      courseId: pc.courseId
    }).lean();

    if (exists) {
      already++;
      console.log(`  ✓ ${user.email} → ${pc.slug || pc.courseId} already enrolled`);
      continue;
    }

    console.log(`  ○ ${user.email} → ${pc.slug || pc.courseId} — MISSING`);

    if (!APPLY) continue;

    try {
      await InteractiveCourseProgress.findOneAndUpdate(
        { userId: user._id, courseId: pc.courseId },
        {
          $setOnInsert: {
            userId:              user._id,
            courseId:            pc.courseId,
            status:              'not_started',
            overallProgress:     0,
            enrolledAt:          pc.purchasedAt || new Date(),
            lastAccessedAt:      new Date(),
            sectionProgress:     [],
            assessmentPassed:    false,
            evaluationSubmitted: false,
            attestationAgreed:   false,
            totalTimeSpent:      0
          }
        },
        { upsert: true, new: false }
      );
      console.log(`    ✅ Created`);
      created++;
    } catch (e) {
      if (e.code === 11000) {
        already++;
        console.log(`    ✓ Already exists (race)`);
      } else {
        console.error(`    ❌`, e.message);
        errors++;
      }
    }
  }
}

console.log('\n──────────────────────────────');
console.log(`Users scanned:  ${users.length}`);
console.log(`Entries checked:${checked}`);
console.log(`Already existed:${already}`);
if (APPLY) {
  console.log(`Created:        ${created}`);
} else {
  console.log(`Would create:   ${checked - already}`);
  console.log('\n⚠️  DRY RUN — rerun with --apply to write');
}
if (errors) console.log(`Errors:         ${errors}`);

await mongoose.disconnect();
