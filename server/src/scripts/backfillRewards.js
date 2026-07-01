// server/src/scripts/backfillRewards.js
// v3 — schema-corrected; filters scanner-imported certs (no courseId)
//
// Retroactively credits Mastery Mark Points based on:
//   1. PLATFORM-EARNED Certificates (have courseId — implies completion + cert earned on platform)
//   2. Completed CourseProgress docs (sweep for edge cases without cert)
//
// EXCLUDES: scanner-imported certs (no courseId) — those represent external
// CE evidence the user uploaded, not platform completions, and should not
// award MMP.
//
// SAFE TO RUN MULTIPLE TIMES — uses service-level dedup via earnedKeys[].
//
// Usage (from ~/project/src/server in Render shell):
//   node src/scripts/backfillRewards.js --inspect
//   node src/scripts/backfillRewards.js --dry-run --user-id=USER_ID
//   node src/scripts/backfillRewards.js --user-id=USER_ID
//   node src/scripts/backfillRewards.js --dry-run
//   node src/scripts/backfillRewards.js
//
// Skips: reflections, evaluations, reviews, referrals (out of scope for v1)

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import User from '../models/User.js';
import { Course as InteractiveCourse, CourseProgress } from '../models/InteractiveCourse.js';
import {
  awardCourseCompletion,
  awardCertificate,
} from '../services/rewardsService.js';

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
// Inspect mode
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

  const userCount = await User.countDocuments();
  const completedProgressCount = await CourseProgress.countDocuments({
    $or: [
      { completed: true },
      { completedAt: { $exists: true, $ne: null } },
      { status: 'completed' },
      { assessmentPassed: true },
    ],
  });
  const certCount = await Certificate.countDocuments();
  const platformCertCount = await Certificate.countDocuments({
    courseId: { $exists: true, $ne: null },
  });
  const importedCertCount = certCount - platformCertCount;

  console.log('--- Collection Sizes ---');
  console.log(`Users:                          ${userCount}`);
  console.log(`Completed CourseProgress docs:  ${completedProgressCount}`);
  console.log(`Certificate docs (total):       ${certCount}`);
  console.log(`  Platform-earned (has courseId): ${platformCertCount}  ← will award MMP`);
  console.log(`  Imported/scanner (no courseId): ${importedCertCount}  ← will be skipped`);
  console.log('\n');

  console.log('Inspect complete. If field names look right, run --dry-run next.');
}

// ─────────────────────────────────────────────────────────────────
// Find completed CourseProgress for a user
// ─────────────────────────────────────────────────────────────────
async function findCompletedCourses(userId) {
  return CourseProgress.find({
    userId: userId,
    $or: [
      { completed: true },
      { completedAt: { $exists: true, $ne: null } },
      { status: 'completed' },
      { assessmentPassed: true },
    ],
  }, { courseId: 1, completed: 1, completedAt: 1, status: 1, assessmentPassed: 1 }).lean();
}

// ─────────────────────────────────────────────────────────────────
// Find certificates for a user (production schema: userId + courseId)
// ─────────────────────────────────────────────────────────────────
async function findCertificates(userId) {
  // Only platform-earned certs (have courseId linking to interactivecourses).
  // Scanner-imported certs (NBCC uploads etc.) lack courseId — those are
  // external CE evidence, not platform completions, and should NOT award MMP.
  return Certificate.find(
    {
      userId: userId,
      courseId: { $exists: true, $ne: null },
    },
    { userId: 1, courseId: 1, title: 1, ceHours: 1 }
  ).lean();
}

// ─────────────────────────────────────────────────────────────────
// Build a course-shaped object from cert (avoids extra DB hit)
// ─────────────────────────────────────────────────────────────────
function courseFromCert(cert) {
  return {
    _id: cert.courseId,
    title: cert.title || '',
    ceHours: cert.ceHours || 0,
  };
}

// ─────────────────────────────────────────────────────────────────
// Project points for a course completion (mirrors service logic for dry-run)
// ─────────────────────────────────────────────────────────────────
function projectCompletionPoints(course, user) {
  const ceHours = parseFloat(course?.ceHours || course?.ceuHours) || 0;
  if (ceHours > 4) return { points: 100, tier: 'long_course' };
  const subStatus = user?.subscription?.status;
  if (subStatus === 'active' || subStatus === 'trial') return { points: 75, tier: 'subscription' };
  const cidStr = course?._id?.toString();
  const purchased = cidStr && Array.isArray(user?.purchasedCourses) &&
    user.purchasedCourses.some(p => p?.courseId?.toString() === cidStr);
  if (purchased) return { points: 50, tier: 'individual' };
  return { points: 25, tier: 'free' };
}

// ─────────────────────────────────────────────────────────────────
// Process one user
// ─────────────────────────────────────────────────────────────────
async function processUser(user, summary) {
  const result = {
    userId: user._id.toString(),
    email: user.email,
    completionsAwarded: 0,
    completionsSkipped: 0,
    certsAwarded: 0,
    certsSkipped: 0,
    pointsAwarded: 0,
    errors: [],
  };

  // Track which courseIds got a completion award via this run, so we don't
  // double-process when the CourseProgress sweep runs after Cert processing
  const completionCoursesAwarded = new Set();

  // ─── 1. CERTIFICATES (primary driver) ───
  const certs = await findCertificates(user._id);

  for (const cert of certs) {
    if (!cert.courseId) continue;

    const courseIdStr = cert.courseId.toString();
    const completionDedupKey = `course_completion:${courseIdStr}`;
    const certDedupKey = `certificate_earned:${courseIdStr}`;

    const completionAlreadyAwarded = (user.earnedKeys || []).some(
      k => (k?.toString ? k.toString() : k) === completionDedupKey
    );
    const certAlreadyAwarded = (user.earnedKeys || []).some(
      k => (k?.toString ? k.toString() : k) === certDedupKey
    );

    const courseLike = courseFromCert(cert);

    // Award completion (if not already)
    if (completionAlreadyAwarded) {
      result.completionsSkipped++;
    } else if (DRY_RUN) {
      const { points } = projectCompletionPoints(courseLike, user);
      result.pointsAwarded += points;
      result.completionsAwarded++;
      completionCoursesAwarded.add(courseIdStr);
    } else {
      const r = await awardCourseCompletion(user._id, courseLike, user);
      if (r.earned) {
        result.pointsAwarded += r.points;
        result.completionsAwarded++;
        completionCoursesAwarded.add(courseIdStr);
        if (!user.earnedKeys) user.earnedKeys = [];
        user.earnedKeys.push(completionDedupKey);
      } else if (r.reason === 'already_awarded') {
        result.completionsSkipped++;
      } else {
        result.errors.push(`Completion award failed for course ${courseIdStr}: ${r.error || r.reason || 'unknown'}`);
      }
    }

    // Award certificate (if not already)
    if (certAlreadyAwarded) {
      result.certsSkipped++;
    } else if (DRY_RUN) {
      result.pointsAwarded += 25;
      result.certsAwarded++;
    } else {
      const r = await awardCertificate(user._id, cert.courseId, cert.title || '');
      if (r.earned) {
        result.pointsAwarded += r.points;
        result.certsAwarded++;
        if (!user.earnedKeys) user.earnedKeys = [];
        user.earnedKeys.push(certDedupKey);
      } else if (r.reason === 'already_awarded') {
        result.certsSkipped++;
      } else {
        result.errors.push(`Cert award failed for course ${courseIdStr}: ${r.error || r.reason || 'unknown'}`);
      }
    }
  }

  // ─── 2. COURSE PROGRESS SWEEP (fallback for completions without certs) ───
  const completions = await findCompletedCourses(user._id);

  for (const cp of completions) {
    if (!cp.courseId) continue;
    const courseIdStr = cp.courseId.toString();

    // Already processed via cert in this run? Skip.
    if (completionCoursesAwarded.has(courseIdStr)) continue;

    const dedupKey = `course_completion:${courseIdStr}`;
    const alreadyAwarded = (user.earnedKeys || []).some(
      k => (k?.toString ? k.toString() : k) === dedupKey
    );

    if (alreadyAwarded) {
      result.completionsSkipped++;
      continue;
    }

    const course = await InteractiveCourse.findById(cp.courseId, {
      title: 1, ceHours: 1, ceuHours: 1, _id: 1,
    });
    if (!course) {
      result.errors.push(`Course ${courseIdStr} not found in interactivecourses`);
      continue;
    }

    if (DRY_RUN) {
      const { points } = projectCompletionPoints(course, user);
      result.pointsAwarded += points;
      result.completionsAwarded++;
    } else {
      const r = await awardCourseCompletion(user._id, course, user);
      if (r.earned) {
        result.pointsAwarded += r.points;
        result.completionsAwarded++;
      } else if (r.reason === 'already_awarded') {
        result.completionsSkipped++;
      } else {
        result.errors.push(`Completion award failed for course ${courseIdStr}: ${r.error || r.reason || 'unknown'}`);
      }
    }
  }

  // ─── Tally summary ───
  summary.totalUsers++;
  if (result.completionsAwarded || result.certsAwarded) summary.usersWithAwards++;
  summary.totalCompletionsAwarded += result.completionsAwarded;
  summary.totalCompletionsSkipped += result.completionsSkipped;
  summary.totalCertsAwarded += result.certsAwarded;
  summary.totalCertsSkipped += result.certsSkipped;
  summary.totalPointsAwarded += result.pointsAwarded;
  summary.totalErrors += result.errors.length;

  if (result.completionsAwarded > 0 || result.certsAwarded > 0 || result.errors.length > 0) {
    console.log(JSON.stringify({
      email: result.email,
      completions: `${result.completionsAwarded}+/${result.completionsSkipped}=`,
      certs: `${result.certsAwarded}+/${result.certsSkipped}=`,
      points: result.pointsAwarded,
      errors: result.errors.length > 0 ? result.errors : undefined,
    }));
  }
}

// ─────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────
async function main() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI env var not set.');
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
  console.log('Format: {email, completions: awarded+/skipped=, certs: awarded+/skipped=, points}\n');

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
      console.error(`Error processing ${user.email}: ${err.message}`);
    }
  }

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('SUMMARY');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`Mode:                          ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`);
  console.log(`Users processed:               ${summary.totalUsers}`);
  console.log(`Users with awards:             ${summary.usersWithAwards}`);
  console.log(`Course completions awarded:    ${summary.totalCompletionsAwarded}`);
  console.log(`Course completions skipped:    ${summary.totalCompletionsSkipped}`);
  console.log(`Certificates awarded:          ${summary.totalCertsAwarded}`);
  console.log(`Certificates skipped:          ${summary.totalCertsSkipped}`);
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
