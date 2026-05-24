/**
 * Fix legacy enum-value drift on a course (default: "A Beautiful Mind",
 * _id 6998ae892b436278fb309ca6) so course.save() passes.
 *
 * Remaps (naming-format drift from an older seed):
 *   • assessment.questions[].type : "multiple-choice" -> "multipleChoice" (etc.)
 *   • contentBlocks[].type        : "flashcards"       -> "flashcardDeck"
 *
 * Safety:
 *   - Stamps any missing positional `order` first (validateSync does NOT run the
 *     model's pre-save hook, so we must do it here to get an accurate picture).
 *   - For flashcards->flashcardDeck, requires renderable data in `flashcards[]`;
 *     otherwise it DUMPS the block's flashcard-ish fields and SKIPS, so a human
 *     can decide (e.g. move data from `cards` to `flashcards`).
 *   - Re-validates; refuses to save unless fully clean.
 *   - --dry shows what it would do without writing.
 *   - --inspect only dumps the problem block(s); makes no changes.
 *
 * Run on the Render shell (working dir ~/project/src/server):
 *     node src/scripts/fixEnumDrift.js --inspect
 *     node src/scripts/fixEnumDrift.js --dry
 *     node src/scripts/fixEnumDrift.js
 *     node src/scripts/fixEnumDrift.js <mongoId|courseCode> [--dry|--inspect]
 */
import mongoose from 'mongoose';
import { Course } from '../models/InteractiveCourse.js';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('❌ No MONGODB_URI environment variable set'); process.exit(1); }

const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const INSPECT = args.includes('--inspect');
const target = args.find(a => !a.startsWith('--')) || '6998ae892b436278fb309ca6';

const QUESTION_TYPE_MAP = { 'multiple-choice': 'multipleChoice', 'multi-select': 'multiSelect', 'true-false': 'trueFalse' };
const BLOCK_TYPE_MAP    = { 'flashcards': 'flashcardDeck' };

function errs(c) { const e = c.validateSync(); return e ? Object.entries(e.errors).map(([p, x]) => `${p} (${x.kind}: ${JSON.stringify(x.value)})`) : []; }
function stampOrder(c) {
  (c.sections || []).forEach((sec, si) => {
    if (sec.order == null) sec.order = si;
    (sec.contentBlocks || []).forEach((blk, bi) => { if (blk && blk.order == null) blk.order = bi; });
  });
}

(async () => {
  await mongoose.connect(MONGODB_URI);
  console.log(DRY ? 'Connected (DRY RUN).\n' : INSPECT ? 'Connected (INSPECT ONLY).\n' : 'Connected.\n');

  const q = mongoose.isValidObjectId(target) ? { _id: target } : { courseCode: target };
  const c = await Course.findOne(q);
  if (!c) { console.log('No course matched', target); await mongoose.disconnect(); return; }
  console.log(`Course: "${(c.title || '').slice(0, 60)}" [${c._id}]\n`);

  // Dump any block whose type maps (e.g. 'flashcards') so we can see its real data.
  (c.sections || []).forEach((sec, si) => {
    (sec.contentBlocks || []).forEach((blk, bi) => {
      if (!BLOCK_TYPE_MAP[blk.type]) return;
      const o = blk.toObject ? blk.toObject() : blk;
      console.log(`INSPECT sections[${si}].contentBlocks[${bi}] type="${blk.type}":`);
      console.log('   flashcards:', JSON.stringify(o.flashcards || []));
      console.log('   cards:     ', JSON.stringify(o.cards || []));
      console.log('   textContent (first 120):', String(o.textContent || o.content || '').slice(0, 120));
      const nonEmpty = Object.entries(o).filter(([k, v]) => Array.isArray(v) ? v.length : (v != null && v !== '' && k !== 'type' && k !== '_id' && k !== 'order'));
      console.log('   non-empty fields:', nonEmpty.map(([k]) => k).join(', ') || '(none)');
      console.log('');
    });
  });

  if (INSPECT) { await mongoose.disconnect(); return; }

  stampOrder(c);
  console.log(`After stamping order — validation errors: ${errs(c).length}\n`);

  let changes = 0; const skipped = [];
  (c.assessment?.questions || []).forEach((qq, i) => {
    if (QUESTION_TYPE_MAP[qq.type]) { console.log(`  questions[${i}].type "${qq.type}" -> "${QUESTION_TYPE_MAP[qq.type]}"`); qq.type = QUESTION_TYPE_MAP[qq.type]; changes++; }
  });
  (c.sections || []).forEach((sec, si) => {
    (sec.contentBlocks || []).forEach((blk, bi) => {
      const mapped = BLOCK_TYPE_MAP[blk.type]; if (!mapped) return;
      if (mapped === 'flashcardDeck' && !(Array.isArray(blk.flashcards) && blk.flashcards.length)) {
        skipped.push(`sections[${si}].contentBlocks[${bi}] type="${blk.type}" has no flashcards[] data — SKIPPED (see INSPECT dump above).`);
        return;
      }
      console.log(`  sections[${si}].contentBlocks[${bi}].type "${blk.type}" -> "${mapped}"`); blk.type = mapped; changes++;
    });
  });
  if (skipped.length) { console.log('\n  ⚠ Skipped:'); skipped.forEach(s => console.log('    - ' + s)); }

  const after = errs(c);
  console.log(`\n  remaps: ${changes} · errors after: ${after.length}`);
  if (after.length) {
    console.log('  ⚠ STILL INVALID — NOT saving. Remaining:');
    after.slice(0, 25).forEach(e => console.log('      - ' + e));
    if (after.length > 25) console.log(`      ...and ${after.length - 25} more`);
    await mongoose.disconnect(); return;
  }
  if (DRY) { console.log('\n  (dry run) would save — now valid.'); await mongoose.disconnect(); return; }
  c.updatedAt = new Date();
  await c.save();
  console.log('\n  ✓ saved — course is now valid.');
  await mongoose.disconnect();
})().catch(async (e) => { console.error('Fatal:', e); try { await mongoose.disconnect(); } catch {} process.exit(1); });
