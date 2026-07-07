/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * findDuplicateCourseCodes.js — Read-only audit for duplicate `courseCode` values
 * (e.g. two different courses both stamped "CR-301").
 *
 * courseCode has no unique index (see InteractiveCourse.js), and it has historically
 * been hand-assigned by title-prefix match (assignCourseCodes.js, patchCourseCodes.mjs,
 * reconcileDuplicates.js) — a process with no duplicate check of its own. This script
 * finds every code currently shared by 2+ documents so you can decide which doc keeps
 * the code before anything downstream (references, certificates, syllabi) is patched.
 *
 * Read-only. Makes no writes. Uses the courseCode field only — NOT slug (a separate,
 * already-unique field) and NOT title-similarity (see findCourseDuplicates.js for that).
 *
 * Usage:
 *   node src/scripts/findDuplicateCourseCodes.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('❌ MONGODB_URI not set'); process.exit(1); }

function fmt(course) {
  const slug = course.slug || '(no slug)';
  const status = course.status || 'unknown';
  const wc = course.wordCount != null ? course.wordCount : '?';
  const pct = course.contentCompletionPct != null ? `${course.contentCompletionPct}%` : '?%';
  return `${slug} | ${status} | ${wc}w (${pct}) | ${course.title}`;
}

async function run() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;

  const courses = await db.collection('interactivecourses').find(
    { courseCode: { $nin: [null, ''] } },
    {
      projection: {
        _id: 1,
        slug: 1,
        title: 1,
        status: 1,
        courseCode: 1,
        wordCount: 1,
        contentCompletionPct: 1,
      }
    }
  ).toArray();

  console.log(`\nLoaded ${courses.length} courses with a non-empty courseCode.\n`);

  // ── group by exact courseCode ──────────────────────────────────────────
  const buckets = new Map(); // code → [course, ...]
  for (const c of courses) {
    const key = c.courseCode;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(c);
  }

  const dupCodes = [...buckets.entries()]
    .filter(([, group]) => group.length > 1)
    .sort((a, b) => a[0].localeCompare(b[0]));

  console.log('═'.repeat(80));
  console.log(`DUPLICATE COURSE CODES (${dupCodes.length} code(s) shared by 2+ courses)`);
  console.log('═'.repeat(80));

  if (dupCodes.length === 0) {
    console.log('  (none found — every courseCode is unique)\n');
  } else {
    for (const [code, group] of dupCodes) {
      console.log(`\nCODE "${code}" — ${group.length} courses:`);
      // most-complete/published first, so the likely "keeper" sorts to the top
      const ranked = [...group].sort((a, b) => {
        const statusRank = s => (s === 'published' ? 0 : s === 'draft' ? 1 : 2);
        const rankDiff = statusRank(a.status) - statusRank(b.status);
        if (rankDiff !== 0) return rankDiff;
        return (b.contentCompletionPct ?? 0) - (a.contentCompletionPct ?? 0);
      });
      for (const c of ranked) console.log(`  ${fmt(c)}  [_id: ${c._id}]`);
    }
    console.log();
  }

  // ── also flag codeless published courses, since those will collide with ──
  // ── this list's assignments the moment someone runs assignCourseCodes.js ──
  const codelessPublished = await db.collection('interactivecourses').find(
    { status: 'published', courseCode: { $in: [null, ''] } },
    { projection: { _id: 1, slug: 1, title: 1 } }
  ).toArray();

  console.log('═'.repeat(80));
  console.log(`PUBLISHED WITH NO courseCode (${codelessPublished.length}) — candidates for accidental future collision`);
  console.log('═'.repeat(80));
  if (codelessPublished.length === 0) {
    console.log('  (none)\n');
  } else {
    for (const c of codelessPublished) console.log(`  ${c.slug || '(no slug)'} | ${c.title}`);
    console.log();
  }

  await mongoose.disconnect();
}

run().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
