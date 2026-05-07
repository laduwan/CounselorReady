// server/src/scripts/backfillRewards.js
//
// Retroactively credit Mastery Mark Points for course completions and
// certificates earned before the rewards system shipped.
//
// SAFE TO RUN MULTIPLE TIMES — uses service-level dedup via earnedKeys[].
//
// Usage (from ~/project/src/server in Render shell):
//   node src/scripts/backfillRewards.js --inspect           # show sample docs, no awards
//   node src/scripts/backfillRewards.js --dry-run           # count what would be awarded
//   node src/scripts/backfillRewards.js --dry-run --user-id=USER_ID  # one user
//   node src/scripts/backfillRewards.js --user-id=USER_ID   # live, one user
//   node src/scripts/backfillRewards.js                     # live, all users
//   node src/scripts/backfillRewards.js --limit=10          # live, first 10 users
//
// Skips: reflections, evaluations, reviews, referrals (intentional — out of scope for v1)

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import User from '../models/User.js';
import { Course as InteractiveCourse, CourseProgress } from '../models/InteractiveCourse.js';
import {
  awardCourseCompletion,
  awardCertificate,
} from '../services/rewardsService.js';

// Certificate may be CJS or ESM — handle both
import certModule from '../models/Certificate.js';
const Certificate = certModule.default || certModule;

// ─────────────────────────────────────────────────────────────────
// CLI args
// ─────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const INSPECT = args.includes('--inspect');
const DRY_RUN = args.includes('--dry-run');
const SPECIFIC_USER = args.find(a => a.startsWith('--user-id='))?.split('=')[1];
const LIMIT = parseInt(args.find(a => a.startsWith('--limit='))?.split('=')[1]) || 0;

// ─────────────────────────────────────────────────────────────────
// Inspect mode — show sample docs so we can verify field names
// ─────────────────────────────────────────────────────────────────
async function runInspect() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('INSPECT MODE — printing sample documents (no writes)');
  console.log('═══════════════════════════════════════════════════════════\n');

  const sampleUser = await User.findOne({}, { email: 1, careCredits: 1, earnedKeys: 1, subscription: 1, purchasedCourses: 1 }).lean();
  console.log('--- Sample User ---');
  console.log(JSON.stringify(sampleUser, null, 2).slice(0, 500));
  console.log('\n');

  const sampleProgress = await CourseProgress.findOne({}).lean();
  console.log('--- Sample CourseProgress ---');
  if (sampleProgress) {
    console.log('Top-level keys:', Object.keys(sampleProgress));
    console.log('Sample doc (first 600 chars):');
    console.log(JSON.stringify(sampleProgress, null, 2).slice(0, 600));
  } else {
    console.log('(no CourseProgress documents found)');
  }
  console.log('\n');

  const sampleCert = await Certificate.findOne({}).lean();
  console.log('--- Sample Certificate ---');
  if (sampleCert) {
    console.log('Top-level keys:', Object.keys(sampleCert));
    console.log('Sample doc (first 600 chars):');
    console.log(JSON.stringify(sampleCert, null, 2).slice(0, 600));
  } else {
    console.log('(no Certificate documents found)');
  }
  console.log('\n');

  // Counts for sizing
  const userCount = await User.countDocuments();
  const completedProgressCount = await CourseProgress.countDocuments({
    $or: [{ completed: true }, { completedAt: { $exists: true, $ne: null } }],
  });
  const certCount = await Certificate.countDocuments();

  console.log('--- Collection Sizes ---');
  console.log(`Users:                          ${userCount}`);
  console.log(`Completed CourseProgress docs:  ${completedProgressCount}`);
  console.log(`Certificate docs:               ${certCount}`);
  console.log('\n');

  console.log('Inspect complete. If field names look right, run --dry-run next.');
}

// ─────────────────────────────────────────────────────────────────
// Find completed courses for a user (defensive — handles either field)
// ─────────────────────────────────────────────────────────────────
async function findCompletedCourses(userId) {
  return CourseProgress.find({
    userId: userId,
    $or: [
      { completed: true },
      { completedAt: { $exists: true, $ne: null } },
    ],
  }, { courseId: 1, completed: 1, completedAt: 1 }).lean();
}

// ─────────────────────────────────────────────────────────────────
// Find certificates for a user
// Certificate uses `user` (not `userId`) and `course` (not `courseId`)
// ─────────────────────────────────────────────────────────────────
async function findCertificates(userId) {
  return Certificate.find(
    { user: userId },
    { user: 1, course: 1, courseTitle: 1 }
  ).lean();
}

// ─────────────────────────────────────────────────────────────────
// Process one user
// ─────────────────────────────────────────────────────────────────
async function processUser(user, summary) {
  const userResult = {
    userId: user._id.toString(),
    email: user.email,
    completionsAwarded: 0,
    completionsSkipped: 0,
    certsAwarded: 0,
    certsSkipped: 0,
    pointsAwarded: 0,
    errors: [],
  };

  // 1. Course completions
  const completions = await findCompletedCourses(user._id);

  for (const cp of completions) {
    if (!cp.courseId) continue;

    const dedupKey = `course_completion:${cp.courseId.toString()}`;
    const alreadyAwarded = (user.earnedKeys || []).some(
      k => k === dedupKey || k?.toString() === dedupKey
    );

    if (alreadyAwarded) {
      userResult.completionsSkipped++;
      continue;
    }

    const course = await InteractiveCourse.findById(cp.courseId, {
      title: 1, ceHours: 1, ceuHours: 1, _id: 1,
    });
    if (!course) {
      userResult.errors.push(`Course ${cp.courseId} not found`);
      continue;
    }

    if (DRY_RUN) {
      // Replicate computeCompletionPoints inline for dry-run estimation
      const ceHours = parseFloat(course.ceHours || course.ceuHours) || 0;
      let projectedPoints;
      if (ceHours > 4) projectedPoints = 100;
      else if (user.subscription?.status === 'active' || user.subscription?.status === 'trial') projectedPoints = 75;
      else if ((user.purchasedCourses || []).some(p => p.courseId?.toString() === cp.courseId.toString())) projectedPoints = 50;
      else projectedPoints = 25;

      userResult.pointsAwarded += projectedPoints;
      userResult.completionsAwarded++;
    } else {
      const result = await awardCourseCompletion(user._id, course, user);
      if (result.earned) {
        userResult.pointsAwarded += result.points;
        userResult.completionsAwarded++;
      } else if (result.reason === 'already_awarded') {
        userResult.completionsSkipped++;
      } else {
        userResult.errors.push(`Completion award failed for course ${cp.courseId}: ${result.error || result.reason || 'unknown'}`);
      }
    }
  }

  // 2. Certificates
  const certs = await findCertificates(user._id);

  for (const cert of certs) {
    if (!cert.course) continue;

    const dedupKey = `certificate_earned:${cert.course.toString()}`;
    const alreadyAwarded = (user.earnedKeys || []).some(
      k => k === dedupKey || k?.toString() === dedupKey
    );

    if (alreadyAwarded) {
      userResult.certsSkipped++;
      continue;
    }

    if (DRY_RUN) {
      userResult.pointsAwarded += 25; // POINTS.CERTIFICATE
      userResult.certsAwarded++;
    } else {
      const result = await awardCertificate(user._id, cert.course, cert.courseTitle || '');
      if (result.earned) {
        userResult.pointsAwarded += result.points;
        userResult.certsAwarded++;
      } else if (result.reason === 'already_awarded') {
        userResult.certsSkipped++;
      } else {
        userResult.errors.push(`Cert award failed for course ${cert.course}: ${result.error || result.reason || 'unknown'}`);
      }
    }
  }

  // Track summary
  summary.totalUsers++;
  if (userResult.completionsAwarded || userResult.certsAwarded) {
    summary.usersWithAwards++;
  }
  summary.totalCompletionsAwarded += userResult.completionsAwarded;
  summary.totalCompletionsSkipped += userResult.completionsSkipped;
  summary.totalCertsAwarded += userResult.certsAwarded;
  summary.totalCertsSkipped += userResult.certsSkipped;
  summary.totalPointsAwarded += userResult.pointsAwarded;
  summary.totalErrors += userResult.errors.length;

  // Print only users who got something or had errors
  if (userResult.completionsAwarded > 0 || userResult.certsAwarded > 0 || userResult.errors.length > 0) {
    console.log(JSON.stringify({
      email: userResult.email,
      completions: `${userResult.completionsAwarded} awarded / ${userResult.completionsSkipped} skipped`,
      certs: `${userResult.certsAwarded} awarded / ${userResult.certsSkipped} skipped`,
      points: userResult.pointsAwarded,
      errors: userResult.errors.length > 0 ? userResult.errors : undefined,
    }));
  }
}

// ─────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────
async function main() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI env var not set. Run from server directory with .env loaded.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✓ Connected to MongoDB\n');

  if (INSPECT) {
    await runInspect();
    await mongoose.disconnect();
    return;
  }

  console.log('═══════════════════════════════════════════════════════════');
  console.log(`MODE: ${DRY_RUN ? 'DRY RUN (no writes)' : 'LIVE (writes MMP credits)'}`);
  if (SPECIFIC_USER) console.log(`USER FILTER: ${SPECIFIC_USER}`);
  if (LIMIT) console.log(`LIMIT: ${LIMIT} users`);
  console.log('═══════════════════════════════════════════════════════════\n');

  const userQuery = SPECIFIC_USER ? { _id: SPECIFIC_USER } : {};
  let userCursor = User.find(userQuery, {
    _id: 1, email: 1, careCredits: 1, earnedKeys: 1,
    subscription: 1, purchasedCourses: 1,
  });
  if (LIMIT) userCursor = userCursor.limit(LIMIT);

  const users = await userCursor.lean();
  console.log(`Processing ${users.length} user(s)...\n`);

  const summary = {
    totalUsers: 0,
    usersWithAwards: 0,
    totalCompletionsAwarded: 0,
    totalCompletionsSkipped: 0,
    totalCertsAwarded: 0,
    totalCertsSkipped: 0,
    totalPointsAwarded: 0,
    totalErrors: 0,
  };

  for (const user of users) {
    try {
      await processUser(user, summary);
    } catch (err) {
      summary.totalErrors++;
      console.error(`Error processing user ${user._id} (${user.email}): ${err.message}`);
    }
  }

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('SUMMARY');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`Mode:                          ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`);
  console.log(`Users processed:               ${summary.totalUsers}`);
  console.log(`Users with awards:             ${summary.usersWithAwards}`);
  console.log(`Course completions awarded:    ${summary.totalCompletionsAwarded}`);
  console.log(`Course completions skipped:    ${summary.totalCompletionsSkipped} (already earned)`);
  console.log(`Certificates awarded:          ${summary.totalCertsAwarded}`);
  console.log(`Certificates skipped:          ${summary.totalCertsSkipped} (already earned)`);
  console.log(`TOTAL MMP ${DRY_RUN ? 'PROJECTED' : 'AWARDED'}:           ${summary.totalPointsAwarded}`);
  console.log(`Errors:                        ${summary.totalErrors}`);
  console.log('═══════════════════════════════════════════════════════════');

  if (DRY_RUN) {
    console.log('\nThis was a dry run. No data changed.');
    console.log('To execute live: re-run without --dry-run');
  } else {
    console.log('\n✓ Backfill complete. Users will see new transactions on /achievements.html');
  }

  await mongoose.disconnect();
}

main().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});
