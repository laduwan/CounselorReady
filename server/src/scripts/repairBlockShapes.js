/**
 * repairBlockShapes.js — one-time repair for courses seeded with legacy/spec-drifted shapes
 * CounselorReady · GAITP LLC · NBCC ACEP #7760
 *
 * WHAT IT FIXES (all render as EMPTY in the viewer until repaired):
 *   1. flashcardDeck  cards:[{front,back}]        → flashcards:[{id,front,back}]
 *   2. cardSort       items:[{text,category}]     → cards:[{id,text,correctCategory}]
 *                     cards[].category            → cards[].correctCategory
 *   3. matching       pairs:[{term,definition}]   → matchingPairs:[...]  (+ matchingInstructions)
 *   4. scenarioTree   nodes ARRAY                 → nodes OBJECT MAP keyed by id
 *                     node.options                → node.choices
 *                     choice.nextId               → choice.next
 *                     feedback:{message,type}     → feedback:"message"   (+ startNode default)
 *   5. flat string options → [{text,isCorrect}] via correctAnswer (skipped + warned if unknown)
 *   6. assessment     passingScore → passThreshold (÷100) · maxAttempts → attemptsAllowed
 *   7. Backfills totalContentBlocks and recomputes wordCount via the CANONICAL counter
 *      (server/src/utils/courseWordCount.js) — raw collection writes never set either.
 *
 * WRITE PATH: Course.updateOne({_id}, {$set:{...}}) ONLY — never .save() on legacy
 * records (full-document validation would reject them). ContentBlockSchema is
 * strict:false, so nested block fields persist exactly as transformed.
 *
 * USAGE (from ~/project/src/server):
 *   node src/scripts/repairBlockShapes.js           ← DRY RUN (default, no writes)
 *   node src/scripts/repairBlockShapes.js --apply   ← writes the repairs
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Course } from '../models/InteractiveCourse.js';
import { countCourseWords } from '../utils/courseWordCount.js';

dotenv.config();

const APPLY = process.argv.includes('--apply');

// ── per-block transforms ─────────────────────────────────────────────────────

function repairFlashcardDeck(b, log) {
  const legacy = Array.isArray(b.cards) && b.cards.length &&
    b.cards.some(c => c && (c.front !== undefined || c.back !== undefined));
  if (!legacy) return b;
  if (Array.isArray(b.flashcards) && b.flashcards.length) {
    delete b.cards; // both present — flashcards already canonical, drop the ghost
    log.push('flashcardDeck: dropped legacy cards (flashcards already present)');
    return b;
  }
  b.flashcards = b.cards.map((c, i) => ({
    id: c.id || `fc${i + 1}`,
    front: c.front || '',
    back: c.back || ''
  }));
  delete b.cards;
  log.push(`flashcardDeck: cards→flashcards (${b.flashcards.length})`);
  return b;
}

function repairCardSort(b, log) {
  if (Array.isArray(b.items) && b.items.length && !(Array.isArray(b.cards) && b.cards.length)) {
    b.cards = b.items.map((it, i) => (typeof it === 'string'
      ? { id: `cs${i + 1}`, text: it, correctCategory: '' }
      : { id: it.id || `cs${i + 1}`, text: it.text || '', correctCategory: it.correctCategory || it.category || '' }));
    delete b.items;
    log.push(`cardSort: items→cards (${b.cards.length})`);
  }
  if (Array.isArray(b.cards)) {
    let renamed = 0;
    b.cards = b.cards.map((c, i) => {
      if (c && c.category !== undefined && c.correctCategory === undefined) {
        renamed++;
        const { category, ...rest } = c;
        return { id: c.id || `cs${i + 1}`, ...rest, correctCategory: category };
      }
      return c;
    });
    if (renamed) log.push(`cardSort: category→correctCategory (${renamed})`);
  }
  return b;
}

function repairMatching(b, log) {
  if (Array.isArray(b.pairs) && b.pairs.length && !(Array.isArray(b.matchingPairs) && b.matchingPairs.length)) {
    b.matchingPairs = b.pairs.map(p => ({ term: p.term || '', definition: p.definition || '' }));
    delete b.pairs;
    log.push(`matching: pairs→matchingPairs (${b.matchingPairs.length})`);
  }
  if (!b.matchingInstructions && b.instructions) {
    b.matchingInstructions = b.instructions;
    log.push('matching: instructions→matchingInstructions');
  }
  return b;
}

function repairScenarioTree(b, log) {
  // nodes ARRAY → OBJECT MAP keyed by id
  if (Array.isArray(b.nodes)) {
    const map = {};
    for (const [i, n] of b.nodes.entries()) {
      const key = n.id || (i === 0 ? 'start' : `node${i + 1}`);
      const { id, ...rest } = n;
      map[key] = rest;
    }
    b.nodes = map;
    log.push('scenarioTree: nodes array→object map');
  }
  if (b.nodes && typeof b.nodes === 'object' && !Array.isArray(b.nodes)) {
    let fixed = 0;
    for (const key of Object.keys(b.nodes)) {
      const n = b.nodes[key];
      if (!n || typeof n !== 'object') continue;
      if (Array.isArray(n.options) && !Array.isArray(n.choices)) { n.choices = n.options; delete n.options; fixed++; }
      if (Array.isArray(n.choices)) {
        n.choices = n.choices.map(ch => {
          if (ch && ch.nextId !== undefined && ch.next === undefined) { const { nextId, ...r } = ch; fixed++; return { ...r, next: nextId }; }
          return ch;
        });
      }
      if (n.feedback && typeof n.feedback === 'object' && n.feedback.message) { n.feedback = n.feedback.message; fixed++; }
    }
    if (fixed) log.push(`scenarioTree: node fields normalized (${fixed})`);
    if (!b.startNode) {
      b.startNode = b.nodes.start ? 'start' : Object.keys(b.nodes)[0];
      if (b.startNode !== 'start' || !b.nodes.start) log.push(`scenarioTree: startNode set → ${b.startNode}`);
    }
  }
  return b;
}

function repairFlatOptions(holder, label, log, warns) {
  if (!Array.isArray(holder.options) || !holder.options.length) return;
  if (typeof holder.options[0] !== 'string') return;
  if (holder.correctAnswer === undefined || holder.correctAnswer === null) {
    warns.push(`${label}: flat string options but no correctAnswer — SKIPPED, fix manually`);
    return;
  }
  holder.options = holder.options.map((t, i) => ({ text: t, isCorrect: i === Number(holder.correctAnswer) }));
  log.push(`${label}: flat options→[{text,isCorrect}] (${holder.options.length})`);
}

// ── per-course transform ─────────────────────────────────────────────────────

function repairCourse(c) {
  const log = [];
  const warns = [];

  for (const [si, sec] of (c.sections || []).entries()) {
    for (const [bi, b] of (sec.contentBlocks || []).entries()) {
      if (!b || !b.type) continue;
      const label = `s${si + 1}b${bi + 1}:${b.type}`;
      if (b.type === 'flashcardDeck') repairFlashcardDeck(b, log);
      if (b.type === 'cardSort') repairCardSort(b, log);
      if (b.type === 'matching') repairMatching(b, log);
      if (b.type === 'scenarioTree') repairScenarioTree(b, log);
      repairFlatOptions(b, label, log, warns);
    }
  }

  const a = c.assessment;
  if (a) {
    if ((a.passThreshold === undefined || a.passThreshold === null) && a.passingScore != null) {
      a.passThreshold = a.passingScore > 1 ? a.passingScore / 100 : a.passingScore;
      log.push(`assessment: passingScore→passThreshold (${a.passThreshold})`);
    }
    if ((a.attemptsAllowed === undefined || a.attemptsAllowed === null) && a.maxAttempts != null) {
      a.attemptsAllowed = a.maxAttempts;
      log.push('assessment: maxAttempts→attemptsAllowed');
    }
    for (const [qi, q] of (a.questions || []).entries()) {
      repairFlatOptions(q, `exam q${qi + 1}`, log, warns);
    }
  }

  const totalContentBlocks = (c.sections || []).reduce((n, s) => n + ((s.contentBlocks || []).length), 0);
  const wordCount = countCourseWords(c);
  const totalsChanged = c.totalContentBlocks !== totalContentBlocks || c.wordCount !== wordCount;
  if (totalsChanged) log.push(`totals: wordCount ${c.wordCount ?? '∅'}→${wordCount}, blocks ${c.totalContentBlocks ?? '∅'}→${totalContentBlocks}`);

  return { log, warns, wordCount, totalContentBlocks, changed: log.length > 0 };
}

// ── main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!process.env.MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }
  await mongoose.connect(process.env.MONGODB_URI);

  console.log(`repairBlockShapes — ${APPLY ? '⚠ APPLY MODE (writing)' : 'DRY RUN (no writes; add --apply to write)'}\n`);

  const courses = await Course.find({}).lean();
  console.log(`Loaded ${courses.length} course(s) from interactivecourses.\n`);

  let touched = 0, warned = 0;
  for (const c of courses) {
    const { log, warns, wordCount, totalContentBlocks, changed } = repairCourse(c);
    if (!changed && !warns.length) continue;

    console.log(`── ${c.courseCode || c.slug || c._id}`);
    for (const l of log) console.log(`   • ${l}`);
    for (const w of warns) { console.log(`   ⚠ ${w}`); warned++; }

    if (changed && APPLY) {
      await Course.updateOne(
        { _id: c._id },
        { $set: {
            sections: c.sections,
            assessment: c.assessment,
            wordCount,
            totalContentBlocks,
            updatedAt: new Date()
        } }
      );
      // read-back: prove the write landed
      const saved = await Course.findOne({ _id: c._id }).lean();
      const ok = saved && saved.wordCount === wordCount && saved.totalContentBlocks === totalContentBlocks;
      console.log(ok
        ? `   ✅ written & verified — wordCount=${saved.wordCount}, totalContentBlocks=${saved.totalContentBlocks}`
        : `   ❌ WRITE VERIFY FAILED — inspect ${c._id} manually`);
    }
    if (changed) touched++;
    console.log('');
  }

  console.log(`Done. ${touched} course(s) need${APPLY ? 'ed' : ''} repair, ${warned} manual-fix warning(s).`);
  if (!APPLY && touched) console.log('Re-run with --apply to write.');
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(e => { console.error('REPAIR ERROR:', e.message); process.exit(1); });
