/**
 * backfillPurchaseEnrollments.js
 *
 * One-time script: for every user who has entries in purchasedCourses but
 * NO matching InteractiveCourseProgress record, create the enrollment.
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

const APPLY  = process.argv.includes('--apply');
const EMAIL  = (() => { const i = process.argv.indexOf('--email'); return i !== -1 ? process.argv[i + 1] : null; })();

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!MONGO_URI) { console.error('❌ No MONGO URI'); process.exit(1); }

await mongoose.connect(MONGO_URI);
console.log('✅ Connected to MongoDB');

const db    = mongoose.connection.db;
const users = db.collection('users');
const progs = db.collection('interactivecourseprogreses'); // Mongoose pluralises this way

const filter = EMAIL ? { email: EMAIL } : {};
const cursor = users.find(
  { ...filter, 'purchasedCourses.0': { $exists: true } },
  { projection: { email: 1, purchasedCourses: 1 } }
);

let checked = 0, created = 0, already = 0, errors = 0;

for await (const user of cursor) {
  for (const pc of (user.purchasedCourses || [])) {
    if (!pc.courseId) continue;
    checked++;

    const exists = await progs.findOne({
      userId:   user._id,
      courseId: pc.courseId
    });

    if (exists) {
      already++;
      continue;
    }

    console.log(`  ○ ${user.email} → courseId ${pc.courseId} (${pc.slug || 'no slug'}) — no progress record`);

    if (!APPLY) continue;

    try {
      await progs.insertOne({
        userId:             user._id,
        courseId:           pc.courseId,
        status:             'not_started',
        overallProgress:    0,
        enrolledAt:         pc.purchasedAt || new Date(),
        lastAccessedAt:     new Date(),
        sectionProgress:    [],
        assessmentPassed:   false,
        evaluationSubmitted:false,
        attestationAgreed:  false,
        totalTimeSpent:     0,
        createdAt:          new Date(),
        updatedAt:          new Date()
      });
      console.log(`    ✅ Created enrollment`);
      created++;
    } catch (e) {
      if (e.code === 11000) {
        already++;
      } else {
        console.error(`    ❌ Error:`, e.message);
        errors++;
      }
    }
  }
}

console.log('\n──────────────────────────────');
console.log(`Checked:        ${checked}`);
console.log(`Already exists: ${already}`);
console.log(`${APPLY ? 'Created' : 'Would create'}: ${created || (checked - already)}`);
if (errors) console.log(`Errors:         ${errors}`);
if (!APPLY) console.log('\n⚠️  DRY RUN — pass --apply to write');

await mongoose.disconnect();
