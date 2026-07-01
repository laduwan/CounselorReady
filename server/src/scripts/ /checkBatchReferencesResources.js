// checkBatchReferencesResources.js
// ---------------------------------------------------------------------------
// Spot-check: reports references[]/resources[] counts on courses, most
// recently updated first, so you can see exactly which courses are missing
// the drawer-feeding arrays BEFORE running backfillReferencesResources.js.
//
// Read-only. Makes no changes.
//
//   node src/scripts/checkBatchReferencesResources.js          (last 20)
//   node src/scripts/checkBatchReferencesResources.js 50       (last 50)
//   node src/scripts/checkBatchReferencesResources.js --all    (every course)
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

// Count inline `resources`-type blocks (the fallback path) so we can tell
// "empty top-level AND empty fallback" apart from "empty top-level but the
// drawer would still populate via the fallback scan".
function inlineResourceCount(course) {
  let n = 0;
  for (const sec of course.sections || []) {
    for (const b of sec.contentBlocks || []) {
      if ((b.type === 'resources' || b.type === 'deliverables') && Array.isArray(b.resources)) {
        n += b.resources.filter(r => r && (r.title || r.url || r.name)).length;
      }
    }
  }
  return n;
}

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log(`Connected.\n`);

  let query = InteractiveCourse.find({})
    .select('slug title courseCode status updatedAt references resources sections')
    .sort({ updatedAt: -1 })
    .lean();
  if (LIMIT) query = query.limit(LIMIT);

  const courses = await query;
  console.log(`Checking ${courses.length} course(s)${LIMIT ? ` (most recently updated)` : ' (all)'}...\n`);

  const rows = courses.map(c => {
    const refCount = Array.isArray(c.references) ? c.references.length : 0;
    const resCount = Array.isArray(c.resources) ? c.resources.length : 0;
    const inlineRes = inlineResourceCount(c);
    const refsOk = refCount >= 15;
    const resOk = resCount > 0 || inlineRes > 0; // would the drawer show anything at all
    return { slug: c.slug, code: c.courseCode || '', status: c.status, refCount, resCount, inlineRes, refsOk, resOk };
  });

  const pad = (s, n) => String(s ?? '').slice(0, n).padEnd(n);
  console.log(pad('CODE', 14) + pad('STATUS', 8) + pad('REFS', 6) + pad('RES(top)', 10) + pad('RES(inline)', 12) + 'SLUG');
  console.log('-'.repeat(90));
  rows.forEach(r => {
    const flag = (!r.refsOk || !r.resOk) ? '  ⚠️' : '';
    console.log(pad(r.code, 14) + pad(r.status, 8) + pad(r.refCount, 6) + pad(r.resCount, 10) + pad(r.inlineRes, 12) + r.slug + flag);
  });

  const missingRefs = rows.filter(r => !r.refsOk);
  const missingResEntirely = rows.filter(r => !r.resOk);
  const topLevelResMissingButFallbackWorks = rows.filter(r => r.resCount === 0 && r.inlineRes > 0);

  console.log(`\n--- Summary ---`);
  console.log(`Total checked: ${rows.length}`);
  console.log(`References < 15 (drawer tab likely missing or thin): ${missingRefs.length}`);
  console.log(`Resources completely empty (top-level AND inline — drawer panel will be empty): ${missingResEntirely.length}`);
  console.log(`Resources top-level empty but inline fallback has data (drawer still works, but fragile): ${topLevelResMissingButFallbackWorks.length}`);

  if (missingRefs.length) {
    console.log(`\nCourses with references < 15:`);
    missingRefs.forEach(r => console.log(`  ${r.code || r.slug} — ${r.refCount} references`));
  }
  if (missingResEntirely.length) {
    console.log(`\nCourses with NO resources anywhere (top-level or inline):`);
    missingResEntirely.forEach(r => console.log(`  ${r.code || r.slug}`));
  }

  console.log(`\nNext step: run backfillReferencesResources.js (dry run first) to fix what can be recovered from existing content.`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
