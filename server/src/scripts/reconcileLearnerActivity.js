/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 */
// server/src/scripts/reconcileLearnerActivity.js
// ---------------------------------------------------------------------------
// Reconciles the admin "Live Activity Feed" against actual CourseProgress.
// Answers: is a reported completion (a) on the SAME account that has no
// progress  -> persistence/sync bug, or (b) on a DIFFERENT account (duplicate)?
//
// It pulls, for a name/email fragment:
//   1. UserActivity events (each stamps userId + userEmail at log time)
//   2. All matching User accounts (reveals duplicates)
//   3. Matching course record(s) by title (reveals reseed duplicates)
//   4. CourseProgress per matching account (where the completion really lives)
//
// Usage:
//   node src/scripts/reconcileLearnerActivity.js wingo
//   node src/scripts/reconcileLearnerActivity.js wingo "suicide risk"
// ---------------------------------------------------------------------------

import dotenv from 'dotenv';
import mongoose from 'mongoose';

import User from '../models/User.js';
import { Course, CourseProgress } from '../models/InteractiveCourse.js';
import Certificate from '../models/Certificate.js';
import UserActivity from '../models/UserActivity.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set');
  process.exit(1);
}

const who = process.argv[2] || 'wingo';                 // name/email fragment
const courseFrag = process.argv[3] || null;             // optional course-title fragment
const rx = new RegExp(who.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

const short = (id) => id ? id.toString().slice(-8) : '—';

async function main() {
  await mongoose.connect(MONGODB_URI);

  // 1) Matching accounts -------------------------------------------------
  const users = await User.find({
    $or: [
      { email: rx },
      { 'profile.firstName': rx },
      { 'profile.lastName': rx },
    ],
  }).select('email profile.firstName profile.lastName createdAt').lean();

  console.log('\n================ ACCOUNTS matching /' + who + '/i ================');
  if (!users.length) console.log('  (none)');
  for (const u of users) {
    const name = `${u.profile?.firstName || ''} ${u.profile?.lastName || ''}`.trim() || '(no name)';
    console.log(`  _id …${short(u._id)}  ${u.email}  | name: "${name}"  | created: ${u.createdAt?.toISOString?.().slice(0,10) || '?'}`);
  }
  const userById = new Map(users.map(u => [u._id.toString(), u]));

  // 2) Recent activity events for this person ----------------------------
  const acts = await UserActivity.find({
    $or: [{ userName: rx }, { userEmail: rx }],
  }).sort({ timestamp: -1 }).limit(40).lean();

  console.log('\n================ ACTIVITY EVENTS (most recent 40) ================');
  if (!acts.length) console.log('  (none)');
  for (const a of acts) {
    const score = a.data?.score ?? a.data?.percentage ?? a.data?.passingScore;
    console.log(
      `  ${a.timestamp?.toISOString?.().slice(0,19) || '?'}  ${(a.type || '').padEnd(22)} ` +
      `uid…${short(a.userId)}  <${a.userEmail || '?'}>  ${a.courseName || ''}` +
      (score != null ? `  [score ${score}]` : '')
    );
  }

  // Distinct userIds the feed actually logged under
  const feedUserIds = [...new Set(acts.map(a => a.userId?.toString()).filter(Boolean))];
  console.log('\n  Distinct userIds in the feed: ' + (feedUserIds.map(id => '…' + id.slice(-8)).join(', ') || 'none'));

  // 3) Course record(s) by title ----------------------------------------
  const courseFilter = courseFrag
    ? { title: new RegExp(courseFrag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') }
    : null;
  let courses = [];
  if (courseFilter) {
    courses = await Course.find(courseFilter).select('title slug ceHours isPublished').lean();
    console.log('\n================ COURSE RECORDS matching /' + courseFrag + '/i ================');
    if (!courses.length) console.log('  (none)');
    for (const c of courses) {
      console.log(`  _id …${short(c._id)}  "${c.title}"  slug: ${c.slug}  ceHours: ${c.ceHours}  published: ${c.isPublished}`);
    }
  }

  // 4) CourseProgress for each matching account --------------------------
  console.log('\n================ COURSE PROGRESS per account ================');
  const candidateIds = new Set([...users.map(u => u._id.toString()), ...feedUserIds]);
  for (const uid of candidateIds) {
    const u = userById.get(uid);
    const label = u ? `${u.email}` : `(userId not in account list) …${uid.slice(-8)}`;
    const progs = await CourseProgress.find({ userId: uid })
      .sort({ updatedAt: -1 })
      .populate('courseId', 'title')
      .lean();

    console.log(`\n  ── ${label}  (_id …${short(uid)}) ──`);
    if (!progs.length) { console.log('     no CourseProgress records'); continue; }
    for (const pr of progs) {
      const title = pr.courseId?.title || `(course ${short(pr.courseId)})`;
      const done = (pr.sectionProgress || []).filter(s => s.status === 'completed').length;
      const tot = (pr.sectionProgress || []).length;
      const cert = await Certificate.findOne({ userId: uid, courseId: pr.courseId?._id || pr.courseId, source: 'platform' }).select('certificateNumber').lean();
      console.log(
        `     ${title}\n        status=${pr.status} sections=${done}/${tot} ` +
        `assessmentPassed=${!!pr.assessmentPassed} attempts=${(pr.assessmentAttempts||[]).length} ` +
        `attestation=${!!pr.attestationAgreed} completedAt=${pr.completedAt ? pr.completedAt.toISOString().slice(0,10) : '—'} ` +
        `cert=${cert ? cert.certificateNumber : 'none'}`
      );
    }
  }

  // 5) Verdict hint ------------------------------------------------------
  console.log('\n================ READ ===============');
  console.log('  • If a feed userId is NOT in the account list above, or maps to a different');
  console.log('    email than the one you support-looked-up -> DUPLICATE ACCOUNT.');
  console.log('  • If the feed userId == the empty account AND its progress is still zero ->');
  console.log('    activity logged but CourseProgress never persisted (a real sync bug).');
  console.log('====================================\n');

  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error('Reconcile failed:', err);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});
