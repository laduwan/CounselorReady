/**
 * verifyWordCounts.js — READ-ONLY. Explains every wordCount drop across all courses.
 * CounselorReady · GAITP LLC · NBCC ACEP #7760
 *
 * For each course it computes:
 *   stored    — wordCount currently in the DB (∅ if never set)
 *   canonical — the real learner-visible count (utils/courseWordCount.js — the
 *               same function the pre-save hook and publish gate use)
 *   dupCopy   — words counted TWICE by the legacy bulkRebuild counter, i.e. one
 *               extra copy of every block where content === textContent both exist
 *               (bulkRebuildCourses.js lines 138-141 summed both; canonical takes max)
 *
 * Verdict per drop:
 *   EXPLAINED — the drop (stored − canonical) is covered by dupCopy: the old
 *               number was inflated by double-counting, content is unchanged
 *   REVIEW    — drop exceeds the duplication; look at this one manually
 *
 * Also flags ACEP status against ceHours × 6000 so you can see, before --apply,
 * exactly which courses (if any) land under target on their REAL count.
 *
 * USAGE (from ~/project/src/server):  node src/scripts/verifyWordCounts.js
 * No writes. No flags.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { countCourseWords } from '../utils/courseWordCount.js';

dotenv.config();

const wc = (s) => {
  if (typeof s !== 'string' || !s) return 0;
  const t = s.replace(/<[^>]+>/g, ' ').replace(/&\w+;/g, ' ').trim();
  return t ? t.split(/\s+/).filter(Boolean).length : 0;
};

// The extra copy the legacy counter added: for every block carrying BOTH
// content and textContent, it counted both; canonical counts max(). The
// inflation per block is therefore min(content, textContent).
function duplicatedCopy(course) {
  let dup = 0, blocks = 0;
  for (const sec of course.sections || []) {
    for (const b of sec.contentBlocks || []) {
      const a = wc(b.content), t = wc(b.textContent);
      if (a && t) { dup += Math.min(a, t); blocks++; }
    }
  }
  return { dup, blocks };
}

async function main() {
  if (!process.env.MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('interactivecourses');
  const courses = await col.find({}).toArray();
  console.log(`verifyWordCounts — READ-ONLY — ${courses.length} course(s)\n`);

  const drops = [], under = [], rises = [];

  for (const c of courses) {
    const stored = c.wordCount ?? null;
    const canonical = countCourseWords(c);
    const { dup, blocks } = duplicatedCopy(c);
    const target = (c.ceHours || 0) * 6000;
    const code = c.courseCode || c.slug || String(c._id);

    if (target && canonical < target) {
      under.push({ code, ce: c.ceHours, canonical, target, short: target - canonical, status: c.status });
    }
    if (stored !== null && stored > canonical) {
      const delta = stored - canonical;
      const verdict = dup >= delta * 0.9 ? 'EXPLAINED (double-count)' : 'REVIEW';
      drops.push({ code, stored, canonical, delta, dup, dupBlocks: blocks, verdict });
    } else if (stored !== null && canonical > stored) {
      rises.push({ code, stored, canonical });
    }
  }

  console.log(`── DROPS (stored > canonical): ${drops.length} ──`);
  for (const d of drops.sort((a, b) => b.delta - a.delta)) {
    console.log(`  ${d.code.padEnd(14)} stored=${String(d.stored).padStart(6)}  canonical=${String(d.canonical).padStart(6)}  drop=${String(d.delta).padStart(6)}  dupCopy=${String(d.dup).padStart(6)} (${d.dupBlocks} dbl-field blocks)  → ${d.verdict}`);
  }

  console.log(`\n── RISES (canonical counts more field types than legacy counters): ${rises.length} — expected, no action ──`);

  console.log(`\n── ACEP TARGET CHECK (canonical vs ceHours × 6000) ──`);
  if (!under.length) console.log('  ✅ every course meets its ACEP word target on the real count.');
  for (const u of under.sort((a, b) => b.short - a.short)) {
    console.log(`  ⚠ ${u.code.padEnd(14)} ${u.ce} CE  canonical=${u.canonical}  target=${u.target}  SHORT BY ${u.short}  (status: ${u.status || '∅'})`);
  }

  const review = drops.filter(d => d.verdict === 'REVIEW');
  console.log(`\nSummary: ${drops.length} drop(s) — ${drops.length - review.length} explained by double-counting, ${review.length} need review. ${under.length} course(s) under ACEP target.`);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(e => { console.error('VERIFY ERROR:', e.message); process.exit(1); });
