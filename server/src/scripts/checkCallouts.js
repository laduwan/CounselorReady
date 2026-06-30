// checkCallouts.js
// ---------------------------------------------------------------------------
// Audits LIVE courses in the `interactivecourses` collection for callout
// presence: how many `calloutType` blocks each course has, how that compares
// to the expected "1 per non-conclusion section" rule, and prints a sample of
// each course's first callout's content so you can eyeball whether it reads
// as topic-specific or generic boilerplate (that part isn't automatable —
// this script flags WHERE to look, not whether the prose is good).
//
// Read-only. Makes no changes.
//
//   node src/scripts/checkCallouts.js          (last 20, most recently updated)
//   node src/scripts/checkCallouts.js 50       (last 50)
//   node src/scripts/checkCallouts.js --all    (every course)
//
// Requires: MONGODB_URI environment variable. Deploy to server/src/scripts/.
// ---------------------------------------------------------------------------

import mongoose from 'mongoose';
import { Course as InteractiveCourse } from '../models/InteractiveCourse.js';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ No MONGODB_URI environment variable set');
  process.exit(1);
}

const ALL = process.argv.includes('--all');
const limitArg = process.argv.find(a => /^\d+$/.test(a));
const LIMIT = ALL ? 0 : (limitArg ? parseInt(limitArg, 10) : 20);

const stripTags = (s) => String(s || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

function analyzeCourse(course) {
  const sections = course.sections || [];
  let callouts = [];
  // "Non-conclusion" heuristic: every section except a final one whose title
  // contains "conclusion"/"summary" (matches the convention used elsewhere
  // in the course-generation docs). Adjust here if that convention changes.
  const contentSections = sections.filter((s, i) => {
    const isLast = i === sections.length - 1;
    const looksLikeConclusion = /conclusion|summary/i.test(s.title || '');
    return !(isLast && looksLikeConclusion) && i > 0 || (sections.length <= 1 && i === 0);
  });

  sections.forEach((sec) => {
    (sec.contentBlocks || []).forEach((b) => {
      if (b.type === 'callout') {
        callouts.push({
          section: sec.title || '(untitled)',
          calloutType: b.calloutType || 'info',
          title: b.title || '',
          contentPreview: stripTags(b.content || '').slice(0, 140),
        });
      }
    });
  });

  return {
    totalCallouts: callouts.length,
    expectedMin: contentSections.length, // 1 per non-conclusion section, roughly
    callouts,
  };
}

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log(`Connected.\n`);

  let query = InteractiveCourse.find({})
    .select('slug courseCode title status updatedAt sections')
    .sort({ updatedAt: -1 })
    .lean();
  if (LIMIT) query = query.limit(LIMIT);

  const courses = await query;
  console.log(`Auditing ${courses.length} course(s)${LIMIT ? ' (most recently updated)' : ' (all)'}...\n`);

  const rows = courses.map(c => ({ slug: c.slug, code: c.courseCode || '', status: c.status, ...analyzeCourse(c) }));

  const pad = (s, n) => String(s ?? '').slice(0, n).padEnd(n);
  console.log(pad('CODE', 14) + pad('STATUS', 8) + pad('CALLOUTS', 9) + pad('EXPECTED~', 10) + 'SLUG');
  console.log('-'.repeat(80));
  rows.forEach(r => {
    const flag = r.totalCallouts === 0 ? '  ⚠️ ZERO' : (r.totalCallouts < r.expectedMin ? '  ⚠️ thin' : '');
    console.log(pad(r.code, 14) + pad(r.status, 8) + pad(r.totalCallouts, 9) + pad(r.expectedMin, 10) + r.slug + flag);
  });

  const zero = rows.filter(r => r.totalCallouts === 0);
  const thin = rows.filter(r => r.totalCallouts > 0 && r.totalCallouts < r.expectedMin);

  console.log(`\n--- Summary ---`);
  console.log(`Total audited: ${rows.length}`);
  console.log(`Zero callouts (likely predates the per-section requirement, or skipped it): ${zero.length}`);
  console.log(`Thin (some callouts, fewer than ~1/section): ${thin.length}`);
  console.log(`Meets or exceeds expected count: ${rows.length - zero.length - thin.length}`);

  if (zero.length) {
    console.log(`\nCourses with ZERO callouts — highest priority for content retrofit:`);
    zero.forEach(r => console.log(`  ${r.code || r.slug}`));
  }

  // Print a content sample from a few non-zero courses so you can spot-check
  // specificity (generic vs. topic-specific) without opening each course.
  const samples = rows.filter(r => r.totalCallouts > 0).slice(0, 5);
  if (samples.length) {
    console.log(`\n--- Content samples (spot-check for topic-specificity — does this read generic or specific to the course?) ---`);
    samples.forEach(r => {
      const first = r.callouts[0];
      console.log(`\n${r.code || r.slug} — [${first.section}] (${first.calloutType})${first.title ? ': ' + first.title : ''}`);
      console.log(`  "${first.contentPreview}${first.contentPreview.length >= 140 ? '…' : ''}"`);
    });
  }

  console.log(`\nNote: this script can only tell you WHERE callouts are missing or thin — it cannot judge whether existing callout prose is actually topic-specific vs. generic. Read the samples above yourself, and see docs/BATCH_COURSE_GENERATION.md's callout topic-specificity rule for the standard to check against.`);

  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
