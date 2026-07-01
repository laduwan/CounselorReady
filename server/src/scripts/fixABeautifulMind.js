/**
 * One-off: make "A Beautiful Mind" [6998ae892b436278fb309ca6] valid so it can save.
 * Fixes exactly three legacy-drift issues confirmed by diagnoseCourseValidation.js:
 *   1. 15 × assessment.questions[].type "multiple-choice" -> "multipleChoice"
 *   2. sections[2].contentBlocks[2]: flashcard data is in cards[] (front/back) but
 *      type is "flashcards" with empty flashcards[]. Migrate cards[] -> flashcards[]
 *      and set type "flashcardDeck" (the value the viewer's renderFlashcardDeck reads).
 *   3. Stamp any missing positional `order` on sections/blocks.
 * Re-validates; refuses to save unless fully clean. --dry to preview.
 *   node src/scripts/fixABeautifulMind.js --dry
 *   node src/scripts/fixABeautifulMind.js
 */
import mongoose from 'mongoose';
import { Course } from '../models/InteractiveCourse.js';

const URI = process.env.MONGODB_URI;
if (!URI) { console.error('No MONGODB_URI'); process.exit(1); }
const DRY = process.argv.includes('--dry');
const ID = '6998ae892b436278fb309ca6';
const QMAP = { 'multiple-choice':'multipleChoice', 'multi-select':'multiSelect', 'true-false':'trueFalse' };

function errs(c){ const e=c.validateSync(); return e?Object.entries(e.errors).map(([p,x])=>`${p} (${x.kind}: ${JSON.stringify(x.value)})`):[]; }

(async () => {
  await mongoose.connect(URI);
  console.log(DRY ? 'DRY RUN\n' : '');
  const c = await Course.findById(ID);
  if (!c) { console.log('not found'); await mongoose.disconnect(); return; }
  console.log(`Course: "${(c.title||'').slice(0,50)}" [${c._id}]`);

  let n = 0;
  // 1. question types
  (c.assessment?.questions||[]).forEach((q,i)=>{ if(QMAP[q.type]){ q.type=QMAP[q.type]; n++; } });
  // 2. flashcards block
  (c.sections||[]).forEach((sec,si)=>{
    (sec.contentBlocks||[]).forEach((b,bi)=>{
      if (b.type==='flashcards') {
        const hasFc = Array.isArray(b.flashcards)&&b.flashcards.length;
        const cardsOk = Array.isArray(b.cards)&&b.cards.length&&b.cards.every(x=>x&&(x.front!==undefined||x.back!==undefined));
        if (!hasFc && cardsOk) {
          b.flashcards = b.cards.map(x=>({id:x.id,front:x.front||'',back:x.back||''}));
          b.cards = undefined;
          console.log(`  migrated ${b.flashcards.length} cards[] -> flashcards[] at sections[${si}].contentBlocks[${bi}]`);
        }
        b.type = 'flashcardDeck'; n++;
        console.log(`  sections[${si}].contentBlocks[${bi}].type -> flashcardDeck`);
      }
    });
  });
  // 3. order
  (c.sections||[]).forEach((sec,si)=>{ if(sec.order==null)sec.order=si; (sec.contentBlocks||[]).forEach((b,bi)=>{ if(b&&b.order==null)b.order=bi; }); });

  console.log(`\nquestion remaps: ${(c.assessment?.questions||[]).filter(q=>q.type==='multipleChoice').length} now multipleChoice · total changes: ${n}`);
  const after = errs(c);
  console.log(`validation errors after: ${after.length}`);
  if (after.length){ console.log('STILL INVALID — not saving:'); after.slice(0,25).forEach(e=>console.log('  - '+e)); await mongoose.disconnect(); return; }
  if (DRY){ console.log('(dry run) would save — now valid.'); await mongoose.disconnect(); return; }
  c.updatedAt = new Date();
  await c.save();
  console.log('✓ saved — course is now valid.');
  await mongoose.disconnect();
})().catch(async e=>{ console.error('Fatal:',e); try{await mongoose.disconnect();}catch{} process.exit(1); });
