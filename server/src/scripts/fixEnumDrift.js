/**
 * Fix legacy enum-value drift on a course (default: "A Beautiful Mind",
 * _id 6998ae892b436278fb309ca6) so course.save() passes.
 *
 * Two known remaps, both naming-format drift from an older seed:
 *   • assessment.questions[].type : "multiple-choice"  ->  "multipleChoice"
 *   • contentBlocks[].type        : "flashcards"        ->  "flashcardDeck"
 *
 * Safety:
 *   - Only remaps the exact bad values above; touches nothing else.
 *   - For the flashcards->flashcardDeck remap, it requires the block to already
 *     carry data in the `flashcards[]` field (the shape renderFlashcardDeck reads),
 *     so the block renders correctly after the rename. If the data isn't in that
 *     shape, it reports and skips that block rather than guessing.
 *   - The model's pre('save') hook backfills any missing `order`.
 *   - Re-validates after remap; refuses to save if anything is still invalid.
 *   - --dry shows what it would do without writing.
 *
 * Run on the Render shell (working dir ~/project/src/server):
 *     node src/scripts/fixEnumDrift.js --dry
 *     node src/scripts/fixEnumDrift.js
 *     node src/scripts/fixEnumDrift.js <mongoId|courseCode> [--dry]
 */
import mongoose from 'mongoose';
import { Course } from '../models/InteractiveCourse.js';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('❌ No MONGODB_URI environment variable set'); process.exit(1); }

const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const target = args.find(a => !a.startsWith('--')) || '6998ae892b436278fb309ca6';

const QUESTION_TYPE_MAP = { 'multiple-choice': 'multipleChoice', 'multi-select': 'multiSelect', 'true-false': 'trueFalse' };
const BLOCK_TYPE_MAP    = { 'flashcards': 'flashcardDeck' };

function errs(c) { const e = c.validateSync(); return e ? Object.entries(e.errors).map(([p, x]) => `${p} (${x.kind}: ${JSON.stringify(x.value)})`) : []; }

(async () => {
  await mongoose.connect(MONGODB_URI);
  console.log(DRY ? 'Connected (DRY RUN — no writes).\n' : 'Connected.\n');

  const q = mongoose.isValidObjectId(target) ? { _id: target } : { courseCode: target };
  const c = await Course.findOne(q);
  if (!c) { console.log('No course matched', target); await mongoose.disconnect(); return; }
  console.log(`Course: "${(c.title || '').slice(0, 60)}" [${c._id}]`);
  console.log(`Validation errors before: ${errs(c).length}\n`);

  let changes = 0, skipped = [];

  // 1) assessment.questions[].type
  (c.assessment?.questions || []).forEach((q2, i) => {
    if (QUESTION_TYPE_MAP[q2.type]) {
      console.log(`  assessment.questions[${i}].type: "${q2.type}" -> "${QUESTION_TYPE_MAP[q2.type]}"`);
      q2.type = QUESTION_TYPE_MAP[q2.type]; changes++;
    }
  });

  // 2) contentBlocks[].type  (only if data is in a renderable shape)
  (c.sections || []).forEach((sec, si) => {
    (sec.contentBlocks || []).forEach((blk, bi) => {
      const mapped = BLOCK_TYPE_MAP[blk.type];
      if (!mapped) return;
      if (mapped === 'flashcardDeck' && !(Array.isArray(blk.flashcards) && blk.flashcards.length)) {
        skipped.push(`sections[${si}].contentBlocks[${bi}] type="${blk.type}" but no flashcards[] data — SKIPPED (would render empty). Keys: ${Object.keys(blk.toObject ? blk.toObject() : blk).join(',')}`);
        return;
      }
      console.log(`  sections[${si}].contentBlocks[${bi}].type: "${blk.type}" -> "${mapped}" (flashcards[]=${(blk.flashcards||[]).length})`);
      blk.type = mapped; changes++;
    });
  });

  if (skipped.length) { console.log('\n  ⚠ Skipped (need a look):'); skipped.forEach(s => console.log('    - ' + s)); }

  const after = errs(c);
  console.log(`\n  remaps applied: ${changes} · validation errors after: ${after.length}`);

  if (after.length) {
    console.log('  ⚠ STILL INVALID — NOT saving. Remaining:');
    after.slice(0, 25).forEach(e => console.log('      - ' + e));
    if (after.length > 25) console.log(`      ...and ${after.length - 25} more`);
    await mongoose.disconnect(); return;
  }

  if (DRY) { console.log('\n  (dry run) would save — course is now valid.'); await mongoose.disconnect(); return; }
  c.updatedAt = new Date();
  await c.save();
  console.log('\n  ✓ saved — course is now valid.');
  await mongoose.disconnect();
})().catch(async (e) => { console.error('Fatal:', e); try { await mongoose.disconnect(); } catch {} process.exit(1); });
