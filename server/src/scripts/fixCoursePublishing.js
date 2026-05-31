/**
 * fixCoursePublishing.js
 *
 * Two-step course publish-state fixer.
 *
 * STEP 1 — Unpublish empty shells:
 *   published courses with wordCount < 50% of CE-hour target → set to draft.
 *
 * STEP 2 — Promote publish-ready drafts:
 *   draft courses with wordCount >= 90% of target AND >= 15 assessment questions
 *   → publish, unless a published course with a similar title already exists.
 *
 * Usage:
 *   node server/src/scripts/fixCoursePublishing.js            # dry run (read-only)
 *   node server/src/scripts/fixCoursePublishing.js --execute  # apply changes
 *
 * Requires MONGODB_URI in environment (or .env at repo root).
 * Safe to run multiple times — idempotent.
 */

import 'dotenv/config';
import mongoose from 'mongoose';

const EXECUTE = process.argv.includes('--execute');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URI is not set.');
  process.exit(1);
}

function pct(wordCount, target) {
  if (!target) return 0;
  return Math.round((wordCount / target) * 100);
}

function titleKey(title) {
  return (title || '').toLowerCase().trim().slice(0, 30);
}

async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;
  const col = db.collection('interactivecourses');

  const courses = await col
    .find(
      {},
      {
        projection: {
          _id: 1,
          courseCode: 1,
          title: 1,
          status: 1,
          ceHours: 1,
          wordCount: 1,
          assessment: 1,
        },
      }
    )
    .toArray();

  const mode = EXECUTE ? 'EXECUTE' : 'DRY RUN';
  console.log(`\n── fixCoursePublishing.js  [${mode}] ──────────────────────────`);
  if (!EXECUTE) {
    console.log('  No changes will be made. Pass --execute to apply.\n');
  } else {
    console.log('  Changes WILL be written to MongoDB.\n');
  }

  // ── Pre-build a lookup of currently-published title keys ────────────────
  // We snapshot this BEFORE step 1 so the duplicate check in step 2 reflects
  // the state after unpublishing shells (avoids false "duplicate" matches).
  const publishedAfterStep1 = new Map(); // titleKey → { courseCode, title, pct }

  // ── STEP 1 — Unpublish empty shells ─────────────────────────────────────
  console.log('STEP 1 — UNPUBLISH EMPTY SHELLS (published, < 50% words)\n');

  let unpublishCount = 0;
  const unpublishIds = [];

  for (const c of courses) {
    const target = (Number(c.ceHours) || 0) * 6000;
    const wc = Number(c.wordCount) || 0;
    const p = pct(wc, target);

    if (c.status === 'published' && target > 0 && wc < target * 0.5) {
      console.log(
        `  UNPUBLISH: ${c.title || '(no title)'}  ` +
        `(${wc}/${target} = ${p}%)  [${c.courseCode || '—'}]`
      );
      unpublishCount++;
      unpublishIds.push(c._id);
      // Do NOT add to publishedAfterStep1 — it's being demoted
    } else if (c.status === 'published') {
      // Still published after step 1 — register for duplicate detection
      const key = titleKey(c.title);
      if (!publishedAfterStep1.has(key)) {
        publishedAfterStep1.set(key, {
          courseCode: c.courseCode || '—',
          title: c.title || '(no title)',
          pct: p,
        });
      }
    }
  }

  if (unpublishCount === 0) {
    console.log('  (none found)');
  }

  if (EXECUTE && unpublishIds.length > 0) {
    await col.updateMany(
      { _id: { $in: unpublishIds } },
      { $set: { status: 'draft' } }
    );
  }

  // ── STEP 2 — Promote publish-ready drafts ────────────────────────────────
  console.log('\nSTEP 2 — PUBLISH-READY DRAFTS (draft, >= 90% words, >= 15 Qs)\n');

  let publishCount = 0;
  let duplicateCount = 0;
  const duplicates = [];
  const publishIds = [];

  for (const c of courses) {
    // After step 1, demoted shells are now draft in our in-memory view too
    const effectiveStatus = unpublishIds.some((id) => id.equals(c._id))
      ? 'draft'
      : c.status;

    if (effectiveStatus !== 'draft') continue;

    const target = (Number(c.ceHours) || 0) * 6000;
    const wc = Number(c.wordCount) || 0;
    const p = pct(wc, target);
    const questionCount =
      c.assessment && Array.isArray(c.assessment.questions)
        ? c.assessment.questions.length
        : 0;

    if (target === 0 || wc < target * 0.9 || questionCount < 15) continue;

    const key = titleKey(c.title);
    const dup = publishedAfterStep1.get(key);

    if (!dup) {
      console.log(
        `  READY TO PUBLISH: ${c.courseCode || '—'}  ` +
        `${c.title || '(no title)'}  (${p}%)`
      );
      publishCount++;
      publishIds.push(c._id);
      // Register it so later iterations don't also try to publish the same key
      publishedAfterStep1.set(key, {
        courseCode: c.courseCode || '—',
        title: c.title || '(no title)',
        pct: p,
      });
    } else {
      console.log(
        `  HAS DUPLICATE — SKIPPING: ${c.courseCode || '—'}  ` +
        `${c.title || '(no title)'}  (${p}%)` +
        `\n    → duplicate of published: ${dup.title}  (${dup.pct}%)`
      );
      duplicateCount++;
      duplicates.push({
        courseCode: c.courseCode || '—',
        title: c.title || '(no title)',
        dupTitle: dup.title,
      });
    }
  }

  if (publishCount === 0 && duplicateCount === 0) {
    console.log('  (none found)');
  }

  if (EXECUTE && publishIds.length > 0) {
    await col.updateMany(
      { _id: { $in: publishIds } },
      { $set: { status: 'published' } }
    );
  }

  // ── Summary ──────────────────────────────────────────────────────────────
  console.log('\n── SUMMARY ──────────────────────────────────────────────────');
  console.log(`  Mode                      : ${mode}`);
  console.log(`  Courses unpublished       : ${unpublishCount}`);
  console.log(`  Courses published         : ${publishCount}`);
  console.log(`  Duplicates (manual review): ${duplicateCount}`);

  if (duplicates.length > 0) {
    console.log('\n  Duplicates needing manual review:');
    for (const d of duplicates) {
      console.log(`    [${d.courseCode}] "${d.title}"`);
      console.log(`      → clashes with published: "${d.dupTitle}"`);
    }
  }

  if (!EXECUTE && (unpublishCount > 0 || publishCount > 0)) {
    console.log(
      '\n  Re-run with --execute to apply the changes above.'
    );
  }

  console.log('─'.repeat(60) + '\n');

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
