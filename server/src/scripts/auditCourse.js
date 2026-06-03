/**
 * auditCourse.js — pre-publish QUALITY GATE for CounselorReady courses
 * GAITP LLC · NBCC ACEP #7760
 *
 * One gate, one counter. Uses the canonical counter
 * (server/src/utils/courseWordCount.js) — the same function the DB pre-save
 * hook, the publish gate, and the validators use — so "passes the audit" means
 * the exact same thing everywhere. Nothing should reach `published` without
 * clearing this.
 *
 * MODES
 *   Audit a seed file BEFORE running it (no DB connection):
 *     node src/scripts/auditCourse.js --file src/scripts/seedCR-XXX.js
 *
 *   Audit a course already in the DB:
 *     node src/scripts/auditCourse.js --slug cultural-humility-in-counseling-practice
 *     node src/scripts/auditCourse.js --code CR-CC-101
 *
 *   Audit EVERY course in interactivecourses (the "what's actually broken" sweep):
 *     node src/scripts/auditCourse.js --all
 *     node src/scripts/auditCourse.js --all --published     (published only)
 *
 * EXIT CODE: 0 if everything passes, 1 if any course fails — so it can gate a
 * deploy step or a pre-seed check.
 *
 * File mode requires the seed to expose its course object as `export default`
 * or `export const COURSE` (the corrected seed template does this). It imports
 * the seed, so the seed MUST guard its DB-insert behind
 * `if (import.meta.url === ...)` (template does this) or importing it would run
 * the insert.
 */

import path from 'path';
import { pathToFileURL } from 'url';
import { countCourseWords, countBlockWords, requiredWordsFor } from '../utils/courseWordCount.js';

// mongoose + dotenv are loaded lazily, only for DB modes (--slug/--code/--all),
// so the pre-seed file check (--file) runs with zero external dependencies.

const VALID_ACCESS = new Set(['free', 'subscription', 'purchase']);
const VALID_STATUS = new Set(['draft', 'published', 'archived']);

// ── the audit ───────────────────────────────────────────────────────────────
export async function auditCourse(course) {
  const issues = [];   // hard failures (block publish)
  const warnings = []; // soft (worth a look)

  const ce = Number(course.ceHours || course.ceuHours || course.credits || 0);
  const wordCount = countCourseWords(course);
  const target = requiredWordsFor(ce);

  // 1) Word count vs CE target (the ACEP 6,000-words/hour floor)
  if (!ce) {
    issues.push('ceHours not set — cannot compute CE word target');
  } else if (wordCount < target) {
    issues.push(
      `WORD COUNT SHORT: ${wordCount.toLocaleString()} words vs ${target.toLocaleString()} ` +
      `required for ${ce} CE (${Math.round((wordCount / target) * 100)}%). ` +
      `Needs ${(target - wordCount).toLocaleString()} more.`
    );
  }

  // 2) Sellability / enum integrity
  if (!VALID_STATUS.has(course.status)) {
    issues.push(`status '${course.status}' invalid (draft|published|archived)`);
  }
  if (!VALID_ACCESS.has(course.accessType)) {
    issues.push(`accessType '${course.accessType}' invalid (free|subscription|purchase) — 'paid' is the usual culprit`);
  }
  if (course.accessType === 'purchase' && !(Number(course.price) > 0)) {
    issues.push(`accessType 'purchase' but no positive price set — not sellable`);
  }

  // 3) Schema-shape gotchas (the ones that seed fine but render/count wrong)
  let flatOpts = 0, kcWrap = 0, quizInSec = 0, cardsField = 0, pairsField = 0,
      scenarioChoices = 0, mcNoAnswer = 0, emptyText = 0, totalBlocks = 0;

  for (const s of (course.sections || [])) {
    if (Array.isArray(s.quizQuestions) && s.quizQuestions.length) quizInSec += s.quizQuestions.length;
    for (const b of (s.contentBlocks || [])) {
      totalBlocks++;
      const t = b.type || '';
      if (t === 'knowledgeCheck' || Array.isArray(b.questions)) kcWrap++;
      if (t === 'quiz') quizInSec++;
      if (Array.isArray(b.options) && b.options.some(o => typeof o === 'string')) flatOpts++;
      if ((t === 'flashcards' || t === 'flashcardDeck') && b.cards && !b.flashcards) cardsField++;
      if (t === 'matching' && b.pairs && !b.matchingPairs) pairsField++;
      if (t === 'scenarioTree' && b.scenario && b.scenario.choices) scenarioChoices++;
      if ((t === 'multipleChoice' || t === 'multiSelect')) {
        const hasFlag = (b.options || []).some(o => o && typeof o === 'object' && o.isCorrect);
        if (typeof b.correctAnswer !== 'number' && !hasFlag) mcNoAnswer++;
      }
      if (t === 'text' && countBlockWords(b) === 0) emptyText++;
    }
  }

  if (flatOpts)       issues.push(`${flatOpts} block(s) use FLAT STRING options — use [{text,isCorrect}] (flat strings cause Mongoose char-explosion)`);
  if (cardsField)     issues.push(`${cardsField} flashcard block(s) use 'cards' — canonical is 'flashcards:[{id,front,back}]'`);
  if (pairsField)     issues.push(`${pairsField} matching block(s) use 'pairs' — canonical is 'matchingPairs:[{term,definition}]'`);
  if (scenarioChoices)issues.push(`${scenarioChoices} scenario block(s) use 'scenario.choices' — canonical is 'scenarioTitle + nodes:{}'`);
  if (mcNoAnswer)     issues.push(`${mcNoAnswer} MC/multiSelect block(s) missing correctAnswer/isCorrect`);
  if (kcWrap)         warnings.push(`${kcWrap} knowledgeCheck/questions[] wrapper(s) — expand to individual multipleChoice blocks`);
  if (quizInSec)      warnings.push(`${quizInSec} quiz/quizQuestions inside sections — exam belongs in top-level assessment`);
  if (emptyText)      warnings.push(`${emptyText} text block(s) count as 0 words (empty/placeholder?)`);
  if (!course.assessment || !Array.isArray(course.assessment.questions) || !course.assessment.questions.length)
    warnings.push('no top-level assessment.questions — final exam missing?');

  // Model validation — the InteractiveCourse schema is the ultimate authority on
  // shapes. Running its own validateSync catches anything the lint above misses
  // (e.g. block-level 'references' must be objects, not strings; bad enums; missing
  // required fields). Skipped gracefully if mongoose/model can't be imported
  // (e.g. a dependency-free local run), in which case the lint above still applies.
  try {
    const { Course } = await import('../models/InteractiveCourse.js');
    const verr = new Course(course).validateSync();
    if (verr && verr.errors) {
      for (const k of Object.keys(verr.errors)) {
        issues.push(`MODEL: ${k}: ${verr.errors[k].message}`);
      }
    }
  } catch { /* model/mongoose unavailable — lint-only mode */ }

  return {
    code: course.courseCode || course.slug || '(unknown)',
    title: course.title || '(untitled)',
    ce, wordCount, target,
    sections: (course.sections || []).length,
    blocks: totalBlocks,
    pass: issues.length === 0,
    issues, warnings,
  };
}

// ── reporting ────────────────────────────────────────────────────────────────
function printReport(r) {
  const head = r.pass ? 'PASS ✓' : 'FAIL ✗';
  console.log(`\n[${head}] ${r.code} — "${r.title}"`);
  console.log(`  ${r.ce} CE · ${r.wordCount.toLocaleString()}/${r.target.toLocaleString()} words · ${r.sections} sections · ${r.blocks} blocks`);
  for (const i of r.issues)   console.log(`   ✗ ${i}`);
  for (const w of r.warnings) console.log(`   ⚠ ${w}`);
}

// ── loaders ──────────────────────────────────────────────────────────────────
async function loadFromFile(file) {
  const abs = path.resolve(process.cwd(), file);
  const mod = await import(pathToFileURL(abs).href);
  const course = mod.default || mod.COURSE;
  if (!course || !course.title) {
    throw new Error(
      `Could not read a course object from ${file}. ` +
      `The seed must 'export default COURSE' (or 'export const COURSE'). ` +
      `See _seedTemplate.js.`
    );
  }
  return [course];
}

async function loadFromDb(filter) {
  const { default: dotenv } = await import('dotenv');
  dotenv.config();
  const { default: mongoose } = await import('mongoose');
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI not set');
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('interactivecourses');
  const docs = await col.find(filter).toArray();
  await mongoose.disconnect();
  return docs;
}

// ── cli ──────────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const getVal = (flag) => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : null; };

  let courses, usedDb = false;
  if (args.includes('--file')) {
    courses = await loadFromFile(getVal('--file'));
  } else if (args.includes('--slug')) {
    usedDb = true; courses = await loadFromDb({ slug: getVal('--slug') });
  } else if (args.includes('--code')) {
    usedDb = true; courses = await loadFromDb({ courseCode: getVal('--code') });
  } else if (args.includes('--all')) {
    usedDb = true;
    const filter = args.includes('--published') ? { status: 'published' } : {};
    courses = await loadFromDb(filter);
  } else {
    console.log('Usage: node src/scripts/auditCourse.js --file <path> | --slug <slug> | --code <CR-XXX> | --all [--published]');
    process.exit(2);
  }

  if (!courses.length) { console.log('No matching course(s) found.'); process.exit(1); }

  const results = (await Promise.all(courses.map(auditCourse))).sort((a, b) => Number(a.pass) - Number(b.pass));
  results.forEach(printReport);

  const failed = results.filter(r => !r.pass);
  console.log(`\n──────────────────────────────────────────────`);
  console.log(`${results.length} audited · ${results.length - failed.length} passed · ${failed.length} FAILED`);
  if (failed.length) console.log(`Failed: ${failed.map(r => r.code).join(', ')}`);

  process.exit(failed.length ? 1 : 0);
}

// Only run when executed directly, not when imported.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(e => { console.error('AUDIT ERROR:', e.message); process.exit(2); });
}
