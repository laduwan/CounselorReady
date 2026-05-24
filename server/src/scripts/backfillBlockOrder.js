/**
 * Backfill the required `order` field on content blocks (and sections, if missing)
 * so course.save() passes validation.
 *
 * Root cause: the InteractiveCourse schema marks `contentBlocks[].order` (and
 * `sections[].order`) as required, but several seed scripts never set them. The
 * admin editor's Save All Changes calls course.save(), which validates the whole
 * document and fails on every block missing `order` — surfacing as a 500.
 *
 * This sets each block's `order` to its index within its section (and each
 * section's `order` to its index) ONLY where missing. Idempotent: re-running
 * changes nothing once fixed. It re-validates before saving and refuses to save
 * if anything is still invalid (so it can never write a still-broken doc).
 *
 * Run on the Render shell (working dir ~/project/src/server):
 *     node src/scripts/backfillBlockOrder.js CR-501          # one course by code
 *     node src/scripts/backfillBlockOrder.js <mongoId>       # one course by _id
 *     node src/scripts/backfillBlockOrder.js --all           # every course missing order
 *     node src/scripts/backfillBlockOrder.js --all --dry     # report only, no writes
 */
import mongoose from 'mongoose';
import { Course } from '../models/InteractiveCourse.js';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('❌ No MONGODB_URI environment variable set'); process.exit(1); }

const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const ALL = args.includes('--all');
const target = args.find(a => !a.startsWith('--'));

function backfillOrders(course) {
  let changed = 0;
  (course.sections || []).forEach((sec, si) => {
    if (sec.order === undefined || sec.order === null) { sec.order = si; changed++; }
    (sec.contentBlocks || []).forEach((blk, bi) => {
      if (blk.order === undefined || blk.order === null) { blk.order = bi; changed++; }
    });
  });
  return changed;
}

function remainingErrors(course) {
  const err = course.validateSync();
  if (!err) return [];
  return Object.entries(err.errors).map(([p, e]) => `${p} (${e.kind})`);
}

(async () => {
  await mongoose.connect(MONGODB_URI);
  console.log(DRY ? 'Connected (DRY RUN — no writes).\n' : 'Connected.\n');

  let query = {};
  if (target) query = mongoose.isValidObjectId(target) ? { _id: target } : { courseCode: target };
  else if (!ALL) { console.error('Specify a course code/_id, or --all.'); await mongoose.disconnect(); process.exit(1); }

  const courses = await Course.find(query);
  if (!courses.length) { console.log('No courses matched.'); await mongoose.disconnect(); return; }

  let fixed = 0, stillBad = 0;
  for (const c of courses) {
    const label = `${c.courseCode || '(no code)'} — "${(c.title || '').slice(0, 60)}" [${c._id}]`;
    const before = remainingErrors(c).length;
    const changed = backfillOrders(c);
    const after = remainingErrors(c);

    if (changed === 0 && before === 0) { console.log(`✓ ${label} — already valid, nothing to do`); continue; }

    console.log(`• ${label}`);
    console.log(`    set ${changed} missing order field(s); validation errors ${before} -> ${after.length}`);

    if (after.length) {
      stillBad++;
      console.log(`    ⚠ STILL INVALID after backfill — NOT saving. Remaining:`);
      after.slice(0, 20).forEach(e => console.log(`        - ${e}`));
      if (after.length > 20) console.log(`        ...and ${after.length - 20} more`);
      console.log(`      (Some other required/enum field is wrong — run diagnoseCourseValidation.js for detail.)`);
      continue;
    }

    if (DRY) { console.log(`    (dry run) would save — now valid`); fixed++; continue; }
    c.updatedAt = new Date();
    await c.save();          // passes validation now
    console.log(`    ✓ saved — course is now valid`);
    fixed++;
  }

  console.log('\n────────────────────────────────────────');
  console.log(`${courses.length} checked · ${fixed} ${DRY ? 'would be fixed' : 'fixed'} · ${stillBad} still invalid (other fields)`);
  await mongoose.disconnect();
})().catch(async (e) => { console.error('Fatal:', e); try { await mongoose.disconnect(); } catch {} process.exit(1); });
