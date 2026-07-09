/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 */
// populateAllCourseBanners.js
// ───────────────────────────
// Bulk driver for populateCourseImages.js across the ENTIRE catalog.
// ADDITIVE ONLY — does not modify populateCourseImages.js; spawns it as a
// child process per course so the tested per-course logic runs verbatim.
//
// Default mode is a read-only AUDIT: lists every course in
// `interactivecourses` with at least one sectionDivider missing bannerImage,
// with per-course missing counts. No writes, no Pexels calls.
//
// Usage (run from /server, same as all scripts):
//   node src/scripts/populateAllCourseBanners.js                  # audit only
//   node src/scripts/populateAllCourseBanners.js --run --dry-run  # simulate the batch
//   node src/scripts/populateAllCourseBanners.js --run            # live batch
//   node src/scripts/populateAllCourseBanners.js --run --limit 10 # cap courses this pass
//
// RATE BUDGET (why you may need to run this more than once):
// Pexels free tier allows ~200 requests/hour. Each missing-banner section
// costs one Pexels search. This runner estimates the Pexels cost of each
// course BEFORE spawning it and stops the pass when the budget
// (PEXELS_BUDGET, default 180) would be exceeded. Because the child script
// skips sections that already have banners, re-running this command after
// the hour resets simply resumes where the last pass stopped. For ~90
// courses expect roughly 4–6 passes an hour apart, or leave --limit unset
// and just re-run until the audit shows zero missing.
//
// Requires the same env vars as the child script when using --run:
//   MONGODB_URI, CLOUDINARY_*, PEXELS_API_KEY. Audit mode needs MONGODB_URI only.

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const args = process.argv.slice(2);
const RUN = args.includes('--run');
const DRY = args.includes('--dry-run');
const limitIdx = args.indexOf('--limit');
const LIMIT = limitIdx !== -1 ? parseInt(args[limitIdx + 1], 10) : Infinity;
const PEXELS_BUDGET = parseInt(process.env.PEXELS_BUDGET || '180', 10);

if (!process.env.MONGODB_URI) {
  console.error('❌ Missing env var: MONGODB_URI');
  process.exit(1);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CHILD = path.join(__dirname, 'populateCourseImages.js');

function analyzeCourse(course) {
  const sections = Array.isArray(course.sections) ? course.sections : [];
  let dividers = 0;
  let missing = 0;
  for (const s of sections) {
    const blocks = Array.isArray(s?.contentBlocks) ? s.contentBlocks : [];
    const d = blocks.find(b => b && b.type === 'sectionDivider');
    if (!d) continue;
    dividers++;
    if (!d.bannerImage) missing++;
  }
  return { sections: sections.length, dividers, missing };
}

function runChild(courseCode) {
  return new Promise(resolve => {
    const childArgs = [CHILD, courseCode];
    if (DRY) childArgs.push('--dry-run');
    const p = spawn('node', childArgs, { stdio: 'inherit' });
    p.on('close', code => resolve(code));
    p.on('error', err => {
      console.error(`   ✖ spawn error for ${courseCode}: ${err.message}`);
      resolve(1);
    });
  });
}

async function main() {
  console.log('\n🖼️  CounselorReady — Bulk Section Banner Runner');
  console.log(`   Mode          : ${RUN ? (DRY ? 'RUN (dry-run passthrough)' : 'RUN (live)') : 'AUDIT ONLY (read-only)'}`);
  if (RUN) {
    console.log(`   Course limit  : ${Number.isFinite(LIMIT) ? LIMIT : 'none'}`);
    console.log(`   Pexels budget : ${PEXELS_BUDGET} searches this pass`);
  }
  console.log('');

  await mongoose.connect(process.env.MONGODB_URI);
  const collection = mongoose.connection.db.collection('interactivecourses');

  const courses = await collection
    .find({}, { projection: { courseCode: 1, title: 1, isPublished: 1, status: 1, 'sections.title': 1, 'sections.contentBlocks.type': 1, 'sections.contentBlocks.bannerImage': 1 } })
    .toArray();

  const rows = [];
  for (const c of courses) {
    const a = analyzeCourse(c);
    rows.push({
      courseCode: c.courseCode || '(none)',
      title: c.title || '(untitled)',
      published: c.isPublished === true,
      ...a,
    });
  }

  const needy = rows
    .filter(r => r.missing > 0 && r.courseCode !== '(none)')
    // published courses first, then largest gaps first
    .sort((x, y) => (y.published - x.published) || (y.missing - x.missing));

  const noCode = rows.filter(r => r.missing > 0 && r.courseCode === '(none)');
  const complete = rows.length - needy.length - noCode.length;

  const pad = (s, n) => String(s).padEnd(n);
  console.log(`   ${pad('Course', 18)}${pad('Pub', 5)}${pad('Divs', 6)}${pad('Missing', 9)}Title`);
  console.log(`   ${'-'.repeat(100)}`);
  for (const r of needy) {
    console.log(`   ${pad(r.courseCode, 18)}${pad(r.published ? 'yes' : 'no', 5)}${pad(r.dividers, 6)}${pad(r.missing, 9)}${r.title.slice(0, 55)}`);
  }
  console.log('');
  console.log(`   Courses total            : ${rows.length}`);
  console.log(`   Fully bannered / no gaps : ${complete}`);
  console.log(`   Missing banners          : ${needy.length}`);
  if (noCode.length) console.log(`   ⚠ Missing banners but NO courseCode (cannot target): ${noCode.length}`);
  console.log('');

  if (!RUN) {
    await mongoose.disconnect();
    console.log('   Audit only. Re-run with --run (optionally --dry-run first) to populate.\n');
    return;
  }

  await mongoose.disconnect(); // child owns its own connection

  let budgetLeft = PEXELS_BUDGET;
  let ran = 0;
  const deferred = [];

  for (const r of needy) {
    if (ran >= LIMIT) { deferred.push(r); continue; }
    if (r.missing > budgetLeft) { deferred.push(r); continue; }
    console.log(`\n──────────────────────────────────────────────────────────`);
    console.log(`▶ ${r.courseCode} — ${r.missing} missing (budget left: ${budgetLeft})`);
    const code = await runChild(r.courseCode);
    if (code !== 0) console.log(`   ⚠ child exited ${code} for ${r.courseCode} — continuing`);
    budgetLeft -= r.missing; // estimate; child may use slightly fewer (no-divider skips)
    ran++;
  }

  console.log(`\n   ───── Pass complete ─────`);
  console.log(`   Courses run this pass : ${ran}${DRY ? ' (dry-run, nothing written)' : ''}`);
  console.log(`   Deferred (budget/limit): ${deferred.length}`);
  if (deferred.length) {
    console.log(`   Next pass will pick up: ${deferred.slice(0, 8).map(d => d.courseCode).join(', ')}${deferred.length > 8 ? ', …' : ''}`);
    console.log(`   Re-run the same command after ~1 hour (Pexels quota reset). Skip-existing`);
    console.log(`   in the child script makes every pass safely resumable.`);
  }
  console.log('');
}

main().catch(async err => {
  console.error('\nFatal:', err);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});
