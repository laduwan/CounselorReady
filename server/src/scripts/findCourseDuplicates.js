/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
#!/usr/bin/env node
/**
 * findCourseDuplicates.js — Read-only duplicate/status audit
 *
 * Groups courses by first-25-char title similarity, prints side-by-side pairs,
 * lists unique courses, and flags dangerous/ready-to-publish outliers.
 *
 * Usage:
 *   node src/scripts/findCourseDuplicates.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('❌ MONGODB_URI not set'); process.exit(1); }

// ── helpers ─────────────────────────────────────────────────────────────

function normalizeTitle(title) {
  return (title || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')  // strip punctuation
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 25);
}

function fmt(course) {
  const code  = course.slug || '(none)';
  const stat  = course.status || 'unknown';
  const ce    = course.ceHours != null ? course.ceHours : '?';
  const wc    = course.wordCount != null ? course.wordCount : '?';
  const pct   = course.contentCompletionPct != null
    ? `${course.contentCompletionPct}%`
    : '?%';
  return `${code} | ${stat} | ${ce} CE | ${wc} words (${pct}) | ${course.title}`;
}

// ── main ─────────────────────────────────────────────────────────────────

async function run() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;

  const courses = await db.collection('interactivecourses').find(
    {},
    {
      projection: {
        _id: 1,
        slug: 1,
        title: 1,
        status: 1,
        ceHours: 1,
        wordCount: 1,
        contentCompletionPct: 1,
        'assessment.questions': 1,
      }
    }
  ).toArray();

  console.log(`\nLoaded ${courses.length} courses from interactivecourses.\n`);

  // ── group by normalized-title key ──────────────────────────────────────
  const buckets = new Map(); // key → [course, ...]
  for (const c of courses) {
    const key = normalizeTitle(c.title);
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(c);
  }

  const pairs   = [];
  const unique  = [];

  for (const [, group] of buckets) {
    if (group.length === 1) {
      unique.push(group[0]);
    } else {
      // emit every pair combination within the group
      for (let i = 0; i < group.length; i++) {
        for (let j = i + 1; j < group.length; j++) {
          pairs.push([group[i], group[j]]);
        }
      }
    }
  }

  // sort pairs: lowest word-count % first (most dangerous at top)
  pairs.sort((pa, pb) => {
    const minA = Math.min(
      pa[0].contentCompletionPct ?? 100,
      pa[1].contentCompletionPct ?? 100
    );
    const minB = Math.min(
      pb[0].contentCompletionPct ?? 100,
      pb[1].contentCompletionPct ?? 100
    );
    return minA - minB;
  });

  // ── print pairs ────────────────────────────────────────────────────────
  console.log('═'.repeat(80));
  console.log(`POTENTIAL DUPLICATE PAIRS (${pairs.length})`);
  console.log('═'.repeat(80));

  if (pairs.length === 0) {
    console.log('  (none found)\n');
  } else {
    for (const [a, b] of pairs) {
      const sameHours = a.ceHours != null && b.ceHours != null
        ? (a.ceHours === b.ceHours ? 'yes' : 'no')
        : 'unknown';
      console.log('\nPOTENTIAL PAIR:');
      console.log(`  A: ${fmt(a)}`);
      console.log(`  B: ${fmt(b)}`);
      console.log(`  SAME HOURS: ${sameHours}`);
    }
    console.log();
  }

  // ── print unique courses ───────────────────────────────────────────────
  console.log('═'.repeat(80));
  console.log(`UNIQUE COURSES — NO POTENTIAL MATCH (${unique.length})`);
  console.log('═'.repeat(80));

  if (unique.length === 0) {
    console.log('  (none)\n');
  } else {
    for (const c of unique) {
      console.log(`  ${fmt(c)}`);
    }
    console.log();
  }

  // ── flag published with < 50% word count ──────────────────────────────
  const dangerouslyThin = courses.filter(
    c => c.status === 'published' &&
         c.contentCompletionPct != null &&
         c.contentCompletionPct < 50
  ).sort((a, b) => (a.contentCompletionPct ?? 0) - (b.contentCompletionPct ?? 0));

  console.log('═'.repeat(80));
  console.log(`⚠  PUBLISHED WITH < 50% WORD COUNT — DANGEROUS (${dangerouslyThin.length})`);
  console.log('═'.repeat(80));

  if (dangerouslyThin.length === 0) {
    console.log('  (none)\n');
  } else {
    for (const c of dangerouslyThin) {
      console.log(`  ${fmt(c)}`);
    }
    console.log();
  }

  // ── flag drafts ready to publish ──────────────────────────────────────
  const readyToPublish = courses.filter(c => {
    const qCount = c.assessment?.questions?.length ?? 0;
    return c.status === 'draft' &&
           c.contentCompletionPct != null &&
           c.contentCompletionPct >= 90 &&
           qCount >= 15;
  }).sort((a, b) => (b.contentCompletionPct ?? 0) - (a.contentCompletionPct ?? 0));

  console.log('═'.repeat(80));
  console.log(`✅  DRAFT >= 90% WORDS + >= 15 ASSESSMENT QUESTIONS — READY TO PUBLISH (${readyToPublish.length})`);
  console.log('═'.repeat(80));

  if (readyToPublish.length === 0) {
    console.log('  (none)\n');
  } else {
    for (const c of readyToPublish) {
      const qCount = c.assessment?.questions?.length ?? 0;
      console.log(`  [${qCount} questions] ${fmt(c)}`);
    }
    console.log();
  }

  await mongoose.disconnect();
}

run().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
