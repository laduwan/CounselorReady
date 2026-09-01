/**
 * convertInlineKCs_CR-307.js
 * GAITP LLC · NBCC ACEP #7760
 *
 * Converts the 15 static, inline knowledge checks that are currently embedded as
 * raw HTML inside CR-307's three BODY section text blocks into native
 * `multipleChoice` content blocks.
 *
 * ── WHY ──
 * Today those 15 KCs are dead prose. The stem, the lettered options, the
 * "Correct Answer: X" line and the rationale all sit visible in the text block,
 * so the learner reads the answer before they can think about the question.
 * There is no self-check.
 *
 * The viewer's native `multipleChoice` renderer (renderMultipleChoice,
 * client/public/interactive-course.html ~line 7287) renders the options as
 * clickable rows, SHUFFLES their display order, exposes a "Check Answer"
 * button, and only then reveals the rationale in the `cr-kc-explanation` div.
 * Converting gives learners the interaction the rest of the course already has.
 *
 * ── THIS IS A LOSSLESS RELOCATION, NOT A REWRITE ──
 * Question stem, option text, correct answer, and rationale all move VERBATIM
 * out of the HTML and into the schema fields. Nothing is reworded, shortened,
 * clarified, or "improved". The only strings that disappear are the presentation
 * scaffolding that the native block replaces:
 *     "✅ Knowledge Check"   (the div's header — the block renderer is the header)
 *     "Question N:"          (the label — the block renderer numbers nothing)
 *     "Correct Answer: X"    (now encoded as options[i].isCorrect + correctAnswer)
 *     the "—" separating that label from the rationale
 * plus the `<div style="background:#F5EEF5;…">` wrapper and the
 * `<ol type="A" style="margin:8px 0 8px 24px;">` inline styles. Losing those
 * inline styles is a bonus: CLAUDE_COURSE_STRUCTURE.md §11/§13 ban inline styles
 * in content HTML.
 *
 * ── LIVE DOCUMENT AS READ (read-only MongoDB, at write time of this script) ──
 *   _id        699766ce2b436278fb309c9c
 *   title      Motivational Interviewing: From Ambivalence to Action
 *   slug       motivational-interviewing-from-ambivalence-to-action
 *   courseCode CR-307 · ceHours 3 · status published · isPublished true
 *   accessType subscription · price 29 · wordCount 24,095
 *   sections   5 — patchACEPCompliance_CR-307.js has ALREADY been applied:
 *                0. Introduction: The Client Who Already Knows        (10 blocks)
 *                1. Foundations and Spirit of Motivational Interviewing (11 blocks)
 *                2. MI Micro-Skills and Clinical Application           (12 blocks)
 *                3. Advanced MI — Integration, Diversity, and Fidelity (12 blocks)
 *                4. Conclusion: From Ambivalence to Action in Your Practice (9 blocks)
 *
 *   All 15 inline KCs live in ONE place per body section: contentBlocks[1], the
 *   original condensed-prose `text` block. In each of those three blocks the KCs
 *   are wrapped in a single trailing
 *       <div style="background:#F5EEF5;border-left:4px solid #6B1D34;…">
 *   containing <p><strong>✅ Knowledge Check</strong></p> followed by five
 *   Question/<ol type="A">/Correct-Answer triplets. That wrapper is the LAST
 *   element of each block and contains no nested <div>. Verified: exactly one
 *   `background:#F5EEF5` marker per block, div tags balanced in all three.
 *
 * ── SEQUENCING CONSTRAINT (enforced) ──
 * patchACEPCompliance_CR-307.js inserts blocks into these same sections and MUST
 * run first. assertACEPPatchApplied() below refuses to run until the intro and
 * conclusion sections that patch adds are present.
 *
 * ── WHAT THIS SCRIPT DOES NOT DO ──
 *   · Does not touch status, isPublished, accessType, price, slug, or courseCode.
 *     assertImmutable() hard-aborts if any of them would change. This course is
 *     PUBLISHED and live to paying learners; content only.
 *   · Does not touch the intro (0) or conclusion (4) sections at all.
 *   · Does not touch course.assessment, course.references, or course.resources.
 *   · Does not reword a single character of any stem, option, or rationale.
 *   · Does not re-balance where the new blocks land. Each KC is inserted at the
 *     position it occupied — i.e. immediately after the text block it was the
 *     tail of — so reading order is preserved exactly. That does put the five
 *     new blocks back-to-back, which trips CLAUDE_COURSE_STRUCTURE.md §14's
 *     "never 5+ interactive blocks in a row" WARNING (a warning, not a gate).
 *     Spreading them through the section would move content the learner reads
 *     in a fixed order, which is a different, editorial task. FLAGGED FOR KE.
 *
 * IDEMPOTENT: a section is converted only if its source text block still carries
 * the KC wrapper. Once converted the wrapper is gone and the section reports
 * SKIP. If the wrapper is gone but the expected multipleChoice blocks are NOT
 * present, the script reports a LOUD WARNING and still refuses to guess.
 *
 * DRY RUN by default:
 *   node src/scripts/convertInlineKCs_CR-307.js
 * Write:
 *   node src/scripts/convertInlineKCs_CR-307.js --execute
 *
 * WRITE PATH: pre-write snapshot via snapshotCourse() (CLAUDE.md "Database
 * Backups — Snapshot Before Every Course Write"); refuses to write unless a
 * local OR an S3 copy lands. Then a RAW-DRIVER updateOne/$set — NOT doc.save().
 * CR-307 carries legacy data and the writing skill forbids .save() on it; the
 * pre-save rollups this bypasses (wordCount, totalContentBlocks) are recomputed
 * here with the same canonical counter the hook uses and set explicitly. The
 * write is followed by a READ-BACK VERIFY that re-runs every marker assertion
 * against the document as it actually landed.
 *
 * This script was NOT run with --execute as part of authoring it.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { pathToFileURL } from 'url';
import { Course } from '../models/InteractiveCourse.js';
import { countCourseWords, requiredWordsFor } from '../utils/courseWordCount.js';
import { snapshotCourse } from '../services/dbBackupService.js';

dotenv.config();

const EXECUTE = process.argv.includes('--execute');

// ─────────────────────────────────────────────────────────────────────────────
// IDENTITY
// ─────────────────────────────────────────────────────────────────────────────
const SLUG = 'motivational-interviewing-from-ambivalence-to-action';
const CODE = 'CR-307';
const EXPECTED_ID = '699766ce2b436278fb309c9c';

/** Fields that may NEVER change — this course is published and sold. */
const IMMUTABLE = ['status', 'isPublished', 'accessType', 'price', 'slug', 'courseCode'];

/** Section titles inserted by patchACEPCompliance_CR-307.js (its own constants). */
const INTRO_TITLE = 'Introduction: The Client Who Already Knows';
const CONCLUSION_TITLE = 'Conclusion: From Ambivalence to Action in Your Practice';

/** Unique inline style that marks the KC wrapper div in the live content. */
const KC_MARKER = 'background:#F5EEF5';

/** Hard floor: 3 CE × 6,000 words. Never write below this. */
const MIN_WORDS = 18000;

/** Expected shape, asserted rather than assumed. */
const EXPECTED_KCS_PER_SECTION = 5;
const EXPECTED_TOTAL_KCS = 15;

// ─────────────────────────────────────────────────────────────────────────────
// HTML PRIMITIVES
//
// Deliberately small and explicit. No HTML parser dependency (CLAUDE.md: do not
// add dependencies), and no clever normalisation — anything this cannot parse
// with certainty raises and aborts rather than producing a lossy guess.
// ─────────────────────────────────────────────────────────────────────────────

const NAMED_ENTITIES = {
  '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"',
  '&apos;': "'", '&#39;': "'", '&nbsp;': ' ',
  '&mdash;': '—', '&ndash;': '–', '&hellip;': '…',
  '&lsquo;': '‘', '&rsquo;': '’',
  '&ldquo;': '“', '&rdquo;': '”',
};

/** Entities we could not decode — surfaced, never silently mangled. */
const unknownEntities = new Set();

function decodeEntities(s) {
  if (typeof s !== 'string') return '';
  let out = s.replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
             .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)));
  out = out.replace(/&[a-z]+\d*;/gi, (m) => {
    const hit = NAMED_ENTITIES[m.toLowerCase()];
    if (hit !== undefined) return hit;
    unknownEntities.add(m);
    return m;
  });
  return out;
}

/**
 * HTML -> plain text, for fields the viewer passes through esc()
 * (block.question and every options[].text — see renderMultipleChoice).
 * Tags are stripped BEFORE entities are decoded so a literal "&lt;b&gt;" in the
 * source can never turn into a live tag.
 */
function toPlainText(html) {
  return decodeEntities(String(html || '').replace(/<[^>]+>/g, ''))
    .replace(/\s+/g, ' ')
    .trim();
}

/** Count of a literal substring. */
function countOf(haystack, needle) {
  return String(haystack || '').split(needle).length - 1;
}

/**
 * Locate the KC wrapper div by depth-matching from the <div that carries
 * KC_MARKER. Returns {start, end} character offsets, or null.
 */
function findKcDivRange(html) {
  const markerAt = html.indexOf(KC_MARKER);
  if (markerAt === -1) return null;
  const start = html.lastIndexOf('<div', markerAt);
  if (start === -1) return null;

  const re = /<\s*(\/?)div\b[^>]*>/gi;
  re.lastIndex = start;
  let depth = 0;
  let m;
  while ((m = re.exec(html)) !== null) {
    depth += m[1] ? -1 : 1;
    if (depth === 0) return { start, end: m.index + m[0].length };
    if (depth < 0) return null;
  }
  return null;
}

/**
 * One inline KC: <p><strong>Question N:</strong> stem</p>
 *                <ol type="A" …> <li>…</li> × n </ol>
 *                <p><strong>Correct Answer: X</strong> — <em>rationale</em></p>
 */
const KC_RE = new RegExp(
  '<p>\\s*<strong>\\s*Question\\s+(\\d+)\\s*:\\s*</strong>([\\s\\S]*?)</p>' +
  '\\s*(<ol\\b[^>]*>)([\\s\\S]*?)</ol>' +
  '\\s*<p>\\s*<strong>\\s*Correct\\s+Answer\\s*:\\s*([A-Za-z])\\s*</strong>([\\s\\S]*?)</p>',
  'gi'
);

const LI_RE = /<li\b[^>]*>([\s\S]*?)<\/li>/gi;

/** `<strong>` that wraps the WHOLE list item — the live "this is correct" marker. */
const FULL_STRONG_RE = /^\s*<strong>([\s\S]*)<\/strong>\s*$/i;

/** Rationale is wrapped in <em>…</em>; the wrapper is presentation, the text is content. */
const FULL_EM_RE = /^\s*<em>([\s\S]*)<\/em>\s*$/i;

/**
 * Parse every KC out of the wrapper's inner HTML.
 * Every ambiguity is fatal — this never guesses an answer.
 */
function parseKCs(innerHtml, label) {
  const out = [];
  KC_RE.lastIndex = 0;
  let m;

  while ((m = KC_RE.exec(innerHtml)) !== null) {
    const [, num, stemHtml, olTag, olInner, letterRaw, tailHtml] = m;
    const where = `${label} Question ${num}`;

    // The letter->index mapping is only valid for an A-lettered list.
    if (!/type\s*=\s*["']?A["']?/i.test(olTag)) {
      throw new Error(`${where}: option list is not <ol type="A"> (${olTag.trim()}) — letter-to-index mapping cannot be trusted. Refusing to guess.`);
    }

    const question = toPlainText(stemHtml);
    if (!question) throw new Error(`${where}: empty question stem after parsing.`);

    // ── options ──
    const options = [];
    LI_RE.lastIndex = 0;
    let li;
    while ((li = LI_RE.exec(olInner)) !== null) {
      const raw = li[1];
      const wrapped = FULL_STRONG_RE.exec(raw);
      const text = toPlainText(wrapped ? wrapped[1] : raw);
      if (!text) throw new Error(`${where}: option ${options.length + 1} is empty after parsing.`);
      options.push({ text, isCorrect: !!wrapped });
    }
    if (options.length < 2) {
      throw new Error(`${where}: found ${options.length} option(s); expected at least 2.`);
    }

    // ── correct answer: letter and <strong> marker must AGREE ──
    const letterIdx = letterRaw.toUpperCase().charCodeAt(0) - 65;
    if (letterIdx < 0 || letterIdx >= options.length) {
      throw new Error(`${where}: "Correct Answer: ${letterRaw}" is out of range for ${options.length} options.`);
    }
    const strongIdxs = options.map((o, i) => (o.isCorrect ? i : -1)).filter((i) => i >= 0);
    if (strongIdxs.length !== 1) {
      throw new Error(`${where}: ${strongIdxs.length} option(s) are bold-marked as correct; expected exactly 1. Refusing to guess.`);
    }
    if (strongIdxs[0] !== letterIdx) {
      throw new Error(
        `${where}: the bold-marked option is index ${strongIdxs[0]} (${String.fromCharCode(65 + strongIdxs[0])}) ` +
        `but the text says "Correct Answer: ${letterRaw.toUpperCase()}". These disagree — refusing to guess.`
      );
    }

    // ── rationale: drop only the "— " separator and a whole-string <em> wrapper ──
    let explanation = tailHtml.replace(/^\s*(?:—|–|&mdash;|&ndash;|-{1,2})?\s*/, '');
    const em = FULL_EM_RE.exec(explanation);
    if (em) explanation = em[1];
    explanation = explanation.trim();
    if (!explanation) throw new Error(`${where}: empty rationale after parsing.`);

    out.push({
      sourceNumber: Number(num),
      question,
      options,
      correctAnswer: letterIdx,
      correctLetter: String.fromCharCode(65 + letterIdx),
      explanation,
    });
  }

  return out;
}

/**
 * Excise [start,end) and heal the seam only. Deliberately local: no global
 * "tidy" pass that could touch prose elsewhere in the block.
 */
function exciseRange(html, start, end) {
  let head = html.slice(0, start).replace(/(?:\s*<p>\s*(?:&nbsp;|\s)*<\/p>)*\s*$/gi, '');
  let tail = html.slice(end).replace(/^\s*(?:<p>\s*(?:&nbsp;|\s)*<\/p>\s*)*/gi, '');
  head = head.replace(/\s+$/, '');
  tail = tail.replace(/^\s+/, '');
  if (head && tail) return `${head}\n${tail}`;
  return head || tail;
}

/** Tag-balance check on the surviving prose. Unbalanced == aborted. */
const BALANCE_TAGS = ['div', 'p', 'ol', 'ul', 'li', 'strong', 'em', 'blockquote', 'table', 'tr', 'td', 'th', 'h2', 'h3', 'h4'];

function assertWellFormed(html, label) {
  const problems = [];
  for (const tag of BALANCE_TAGS) {
    const open = (html.match(new RegExp(`<${tag}\\b[^>]*>`, 'gi')) || []).length;
    const close = (html.match(new RegExp(`</${tag}\\s*>`, 'gi')) || []).length;
    if (open !== close) problems.push(`<${tag}> ${open} open vs ${close} close`);
  }
  if (/<p>\s*(?:&nbsp;|\s)*<\/p>/i.test(html)) problems.push('contains an empty <p></p>');
  if (/\n{3,}/.test(html)) problems.push('contains 3+ consecutive newlines');
  if (problems.length) {
    throw new Error(`${label}: content is not well-formed after excision — ${problems.join('; ')}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GUARDS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Sequencing gate. patchACEPCompliance_CR-307.js inserts blocks into these same
 * sections and MUST have run first; converting before it would leave this script
 * splicing into a section layout the patch is about to change underneath it.
 */
function assertACEPPatchApplied(raw) {
  const sections = raw.sections || [];
  const titles = sections.map((s) => (s && s.title) || '');
  const hasIntro = titles.includes(INTRO_TITLE);
  const hasConclusion = titles.includes(CONCLUSION_TITLE);
  if (hasIntro && hasConclusion) return;

  throw new Error(
    'ABORT — patchACEPCompliance_CR-307.js has NOT been applied to this document yet.\n' +
    `        expected a section titled "${INTRO_TITLE}"        : ${hasIntro ? 'found' : 'MISSING'}\n` +
    `        expected a section titled "${CONCLUSION_TITLE}" : ${hasConclusion ? 'found' : 'MISSING'}\n` +
    '        That patch inserts blocks into the same body sections this script edits,\n' +
    '        so it must run FIRST:\n' +
    '            node src/scripts/patchACEPCompliance_CR-307.js --execute\n' +
    '        Then re-run this script.'
  );
}

/**
 * Hard guard: section _ids must survive byte-for-byte AND type-for-type.
 * UserCourseProgress.sectionId is `{ type: ObjectId, required: true }` and
 * points at sections[]._id. A section _id silently demoted from ObjectId to
 * String (the classic JSON-round-trip bug) orphans every enrolled learner's
 * per-section progress on a published course.
 */
function assertSectionIdsIntact(beforeSections, afterSections, label) {
  if (beforeSections.length !== afterSections.length) {
    throw new Error(`ABORT (${label}) — section count changed ${beforeSections.length} -> ${afterSections.length}. This script must never add or remove a section.`);
  }
  beforeSections.forEach((b, i) => {
    const a = afterSections[i];
    const bid = b && b._id;
    const aid = a && a._id;
    if (!bid && !aid) return;
    if (String(bid) !== String(aid)) {
      throw new Error(`ABORT (${label}) — section ${i} _id changed ${String(bid)} -> ${String(aid)}.`);
    }
    if (typeof bid !== typeof aid || (bid && aid && bid.constructor?.name !== aid.constructor?.name)) {
      throw new Error(
        `ABORT (${label}) — section ${i} _id changed BSON type ` +
        `${bid && bid.constructor ? bid.constructor.name : typeof bid} -> ` +
        `${aid && aid.constructor ? aid.constructor.name : typeof aid}. ` +
        'UserCourseProgress.sectionId requires ObjectId; a string here orphans learner progress.'
      );
    }
  });
}

/** Hard guard: this course is PUBLISHED. Content only. */
function assertImmutable(before, after) {
  const violations = IMMUTABLE.filter((f) =>
    Object.prototype.hasOwnProperty.call(after, f) &&
    JSON.stringify(after[f]) !== JSON.stringify(before[f])
  );
  if (violations.length) {
    throw new Error(
      `ABORT — this conversion would change immutable published-course field(s): ${violations.join(', ')}. ` +
      'CR-307 is live to paying learners; only content may change.'
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PLAN
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build the converted sections array.
 *
 * ⚠ MUTATES `workingDoc.sections` IN PLACE, and that is deliberate.
 * `sections[]._id` is a real BSON ObjectId (SectionSchema keeps _id; only
 * ContentBlockSchema sets `_id: false`). A JSON.parse(JSON.stringify(...))
 * deep clone would flatten those ObjectIds into plain strings, and writing
 * string _ids back would break UserCourseProgress.sectionId — which is
 * `{ type: ObjectId, required: true }` — for every learner already enrolled in
 * this PUBLISHED course. So: no clone. The caller passes a SECOND, independent
 * read of the document as the working copy and keeps the first read pristine
 * for the pre-write snapshot, the before-metrics, and assertImmutable().
 */
function planConversion(workingDoc) {
  const raw = workingDoc;
  const sections = raw.sections || [];
  const actions = [];
  const parsed = [];   // flat list of every KC converted, for the report
  const warnings = [];
  let converted = 0;

  sections.forEach((section, si) => {
    const title = section.title || `(untitled section ${si})`;
    const blocks = section.contentBlocks || [];

    // Body sections only — never the intro or the conclusion.
    if (title === INTRO_TITLE || title === CONCLUSION_TITLE) {
      actions.push(`section ${si} "${title}": SKIP (intro/conclusion — not touched)`);
      return;
    }

    // Which block still carries the KC wrapper?
    const hostIdxs = blocks
      .map((b, i) => ((b && typeof b.content === 'string' && b.content.includes(KC_MARKER)) ? i : -1))
      .filter((i) => i >= 0);

    if (hostIdxs.length === 0) {
      // Already converted, or never had one. Distinguish the two.
      const mcCount = blocks.filter((b) => b && b.type === 'multipleChoice').length;
      const stillLeaks = blocks.some((b) => b && typeof b.content === 'string' && /Correct\s+Answer\s*:/i.test(b.content));
      if (stillLeaks) {
        warnings.push(`section ${si} "${title}": no KC wrapper found, but a text block still contains "Correct Answer:". Unrecognised layout — NOT touched. Inspect by hand.`);
        actions.push(`section ${si} "${title}": SKIP (unrecognised inline-answer layout — see WARNING)`);
      } else {
        actions.push(`section ${si} "${title}": SKIP (already converted — ${mcCount} multipleChoice block(s) present)`);
      }
      return;
    }
    if (hostIdxs.length > 1) {
      throw new Error(`section ${si} "${title}": ${hostIdxs.length} blocks carry the KC wrapper; expected exactly 1. Refusing to guess.`);
    }

    const hostIdx = hostIdxs[0];
    const host = blocks[hostIdx];
    const label = `section ${si} block ${hostIdx}`;

    if (host.type !== 'text') {
      throw new Error(`${label}: KC wrapper lives in a "${host.type}" block, expected "text". Refusing to guess.`);
    }
    if (countOf(host.content, KC_MARKER) !== 1) {
      throw new Error(`${label}: ${countOf(host.content, KC_MARKER)} KC wrappers in one block; expected exactly 1.`);
    }

    const range = findKcDivRange(host.content);
    if (!range) throw new Error(`${label}: could not depth-match the KC wrapper <div>. Refusing to guess.`);

    const inner = host.content.slice(range.start, range.end);
    const kcs = parseKCs(inner, label);

    if (kcs.length !== EXPECTED_KCS_PER_SECTION) {
      throw new Error(`${label}: parsed ${kcs.length} knowledge check(s); expected ${EXPECTED_KCS_PER_SECTION}. Refusing to write a partial extraction.`);
    }
    // Every "Correct Answer:" in the wrapper must have been consumed by a parse.
    const answersInWrapper = countOf(inner, 'Correct Answer');
    if (answersInWrapper !== kcs.length) {
      throw new Error(`${label}: wrapper holds ${answersInWrapper} "Correct Answer" marker(s) but only ${kcs.length} parsed. Refusing to drop content.`);
    }

    // ── remove ──
    const cleaned = exciseRange(host.content, range.start, range.end);
    if (/Correct\s+Answer\s*:/i.test(cleaned)) {
      throw new Error(`${label}: "Correct Answer:" still present after excision. Refusing to write.`);
    }
    if (cleaned.includes(KC_MARKER)) {
      throw new Error(`${label}: KC wrapper still present after excision. Refusing to write.`);
    }
    if (!cleaned.trim()) {
      throw new Error(`${label}: excision emptied the text block. That means the block was nothing but knowledge checks — a structural change, not a relocation. Refusing to write.`);
    }
    assertWellFormed(cleaned, label);
    host.content = cleaned;

    // ── build native blocks ──
    const newBlocks = kcs.map((kc) => ({
      type: 'multipleChoice',
      question: kc.question,
      options: kc.options.map((o) => ({ text: o.text, isCorrect: o.isCorrect })),
      correctAnswer: kc.correctAnswer,   // Number — viewer reads this first
      explanation: kc.explanation,
    }));

    // ── insert at the position the KCs occupied: immediately after their host ──
    blocks.splice(hostIdx + 1, 0, ...newBlocks);

    kcs.forEach((kc, i) => parsed.push({
      sectionIndex: si,
      sectionTitle: title,
      blockIndex: hostIdx + 1 + i,
      ...kc,
    }));

    converted += kcs.length;
    actions.push(
      `section ${si} "${title}": CONVERT ${kcs.length} inline KC(s) from block ${hostIdx} ` +
      `-> multipleChoice blocks at ${hostIdx + 1}..${hostIdx + kcs.length} ` +
      `(answers ${kcs.map((k) => k.correctLetter).join('')}); ` +
      `block content ${host.content.length + (range.end - range.start)} -> ${host.content.length} chars`
    );
  });

  // ── every block gets a coherent order; section order untouched ────────────
  sections.forEach((s) => {
    (s.contentBlocks || []).forEach((b, j) => { if (b) b.order = j + 1; });
  });

  return { sections, actions, parsed, warnings, converted };
}

// ─────────────────────────────────────────────────────────────────────────────
// MARKER VERIFICATION — run in memory AND again on the read-back
// ─────────────────────────────────────────────────────────────────────────────

function verifyMarkers(sections, expectedNewMC, label) {
  const failures = [];
  const bodySections = sections.filter((s) => s.title !== INTRO_TITLE && s.title !== CONCLUSION_TITLE);

  // 1. No text-block content anywhere still reveals an answer inline.
  let leaks = 0;
  let wrappers = 0;
  sections.forEach((s, si) => {
    (s.contentBlocks || []).forEach((b, bi) => {
      if (!b || typeof b.content !== 'string') return;
      if (/Correct\s+Answer\s*:/i.test(b.content)) { leaks += 1; failures.push(`${label}: section ${si} block ${bi} still contains "Correct Answer:"`); }
      if (b.content.includes(KC_MARKER)) { wrappers += 1; failures.push(`${label}: section ${si} block ${bi} still contains the KC wrapper`); }
    });
  });

  // 2. Every block has an order.
  sections.forEach((s, si) => {
    (s.contentBlocks || []).forEach((b, bi) => {
      if (!b || typeof b.order !== 'number') failures.push(`${label}: section ${si} block ${bi} has no numeric order`);
    });
  });

  // 3. Every multipleChoice block is correctly shaped.
  let mcTotal = 0;
  sections.forEach((s, si) => {
    (s.contentBlocks || []).forEach((b, bi) => {
      if (!b || b.type !== 'multipleChoice') return;
      mcTotal += 1;
      const at = `${label}: section ${si} block ${bi} (multipleChoice)`;
      if (!b.question) failures.push(`${at} has no question`);
      if (!Array.isArray(b.options) || b.options.length < 2) failures.push(`${at} has fewer than 2 options`);
      else {
        if (b.options.some((o) => typeof o === 'string')) failures.push(`${at} has flat [String] options — must be [{text,isCorrect}]`);
        if (b.options.filter((o) => o && o.isCorrect).length !== 1) failures.push(`${at} does not have exactly one isCorrect option`);
      }
      if (typeof b.correctAnswer !== 'number') failures.push(`${at} has no numeric correctAnswer`);
      else if (Array.isArray(b.options)) {
        const flagged = b.options.findIndex((o) => o && o.isCorrect);
        if (flagged !== b.correctAnswer) failures.push(`${at} correctAnswer ${b.correctAnswer} disagrees with isCorrect index ${flagged}`);
      }
      if (!b.explanation) failures.push(`${at} has no explanation`);
    });
  });

  // 4. The body sections gained exactly the expected number of blocks.
  const bodyMC = bodySections.reduce((n, s) => n + (s.contentBlocks || []).filter((b) => b && b.type === 'multipleChoice').length, 0);

  return {
    ok: failures.length === 0,
    failures,
    stats: { leaks, wrappers, mcTotal, bodyMC, expectedNewMC },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  if (!process.env.MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('interactivecourses');

  const line = '='.repeat(78);
  console.log('\n' + line);
  console.log(`convertInlineKCs_CR-307 — ${EXECUTE ? 'EXECUTING WRITES' : 'DRY RUN (pass --execute to write)'}`);
  console.log(line);

  const raw = (await col.findOne({ slug: SLUG })) || (await col.findOne({ courseCode: CODE }));
  if (!raw) {
    console.log(`NOT FOUND — slug "${SLUG}" / courseCode "${CODE}"`);
    await mongoose.disconnect();
    return;
  }

  console.log(`  "${(raw.title || '').slice(0, 70)}"`);
  console.log(`  _id=${raw._id} · courseCode=${raw.courseCode} · status=${raw.status} · isPublished=${raw.isPublished} · accessType=${raw.accessType} · price=${raw.price}`);
  console.log(`  ceHours=${raw.ceHours} · sections=${(raw.sections || []).length} · wordCount=${raw.wordCount ?? 'n/a'}`);
  if (String(raw._id) !== EXPECTED_ID) {
    console.log(`\n  WARNING: _id ${raw._id} is not the expected ${EXPECTED_ID}. Verify identity before proceeding.\n`);
  }
  if (raw.status === 'published') {
    console.log('\n  ⚠ PUBLISHED COURSE — live to enrolled learners. Content-only conversion.\n');
  }

  // ── sequencing gate ──
  assertACEPPatchApplied(raw);
  console.log('sequencing gate: PASS (patchACEPCompliance_CR-307 intro + conclusion sections present)');

  // ── before ──
  const beforeWords = countCourseWords(raw);
  const beforeBlocks = (raw.sections || []).map((s) => (s.contentBlocks || []).length);
  const beforeMC = (raw.sections || []).map((s) => (s.contentBlocks || []).filter((b) => b && b.type === 'multipleChoice').length);

  // ── plan ──
  // A SECOND, independent read is the working copy. planConversion() mutates it
  // in place so that sections[]._id stays a real ObjectId (see its doc comment);
  // `raw` above stays pristine for the snapshot, the before-metrics, and the
  // immutable-field guard.
  const working = await col.findOne({ _id: raw._id });
  if (!working) {
    console.log('ABORT — document disappeared between reads.');
    await mongoose.disconnect();
    process.exit(1);
  }
  const { sections, actions, parsed, warnings, converted } = planConversion(working);
  console.log('');
  actions.forEach((a) => console.log(`   ${a}`));
  warnings.forEach((w) => console.log(`   !! WARNING — ${w}`));
  if (unknownEntities.size) {
    console.log(`   !! WARNING — undecoded HTML entities left verbatim: ${[...unknownEntities].join(', ')}`);
  }

  if (converted === 0) {
    console.log('\nnothing to convert — every body section is already native (or has no recognisable inline KC).');
    console.log(line + '\n');
    await mongoose.disconnect();
    return;
  }
  if (converted !== EXPECTED_TOTAL_KCS) {
    console.log(`\nNOTE: converted ${converted} knowledge check(s); the documented total for CR-307 is ${EXPECTED_TOTAL_KCS}.`);
    console.log('      (Expected on a partial re-run after some sections were already converted.)');
  }

  // ── the 15 parsed KCs, for spot-checking ──
  console.log('\nparsed knowledge checks:');
  parsed.forEach((kc, i) => {
    console.log(`  ${String(i + 1).padStart(2)}. [s${kc.sectionIndex} b${kc.blockIndex}] answer ${kc.correctLetter} (index ${kc.correctAnswer}) · ${kc.options.length} options`);
    console.log(`      Q: ${kc.question}`);
    console.log(`      A: ${kc.options[kc.correctAnswer].text}`);
  });

  const patched = { ...raw, sections };
  assertImmutable(raw, patched);
  console.log(`\nimmutable-field guard: PASS (${IMMUTABLE.join(', ')} unchanged)`);

  // ── section _id identity guard ──
  // UserCourseProgress.sectionId is a required ObjectId that points at these.
  // If a section _id changed value OR BSON type, enrolled learners lose progress.
  assertSectionIdsIntact(raw.sections || [], sections, 'pre-write');
  console.log(`section _id guard: PASS (${sections.length} section _id(s) unchanged, still ObjectId)`);

  // ── after ──
  const afterWords = countCourseWords(patched);
  const afterBlocks = sections.map((s) => (s.contentBlocks || []).length);
  const afterMC = sections.map((s) => (s.contentBlocks || []).filter((b) => b && b.type === 'multipleChoice').length);
  const ceTarget = requiredWordsFor(raw.ceHours || 0);
  const delta = afterWords - beforeWords;

  console.log('\nblocks per section (before -> after):');
  sections.forEach((s, i) => {
    console.log(`  ${i}. ${(s.title || '').slice(0, 52).padEnd(54)} ${String(beforeBlocks[i] ?? 0).padStart(3)} -> ${String(afterBlocks[i]).padStart(3)}   (multipleChoice ${beforeMC[i] ?? 0} -> ${afterMC[i]})`);
  });
  console.log(`  sections: ${(raw.sections || []).length} -> ${sections.length} (unchanged)`);
  console.log(`  total blocks: ${beforeBlocks.reduce((a, b) => a + b, 0)} -> ${afterBlocks.reduce((a, b) => a + b, 0)}`);

  console.log(`\nwords (canonical countCourseWords): ${beforeWords.toLocaleString()} -> ${afterWords.toLocaleString()} (${delta >= 0 ? '+' : ''}${delta.toLocaleString()})`);
  console.log(`  stored wordCount before: ${raw.wordCount ?? 'n/a'}${raw.wordCount !== beforeWords ? `  (NOTE: differs from the recomputed ${beforeWords.toLocaleString()})` : ''}`);
  console.log(`  CE target (${raw.ceHours} hr × 6,000 = ${ceTarget.toLocaleString()}): ${afterWords >= ceTarget ? 'PASS' : `SHORT by ${(ceTarget - afterWords).toLocaleString()}`}`);
  console.log(`  hard floor ${MIN_WORDS.toLocaleString()}: ${afterWords >= MIN_WORDS ? 'PASS' : 'FAIL'}`);

  if (afterWords < MIN_WORDS) {
    console.log(`\nABORT — post-conversion word count ${afterWords.toLocaleString()} is below the ${MIN_WORDS.toLocaleString()} floor (3 CE × 6,000). Refusing to write.`);
    await mongoose.disconnect();
    process.exit(1);
  }

  // ── in-memory marker verification ──
  const memCheck = verifyMarkers(sections, converted, 'in-memory');
  console.log(`\nmarker verification (in-memory): ${memCheck.ok ? 'PASS' : 'FAIL'}`);
  console.log(`  "Correct Answer:" left in text-block content : ${memCheck.stats.leaks}  (must be 0)`);
  console.log(`  KC wrapper divs left in content              : ${memCheck.stats.wrappers}  (must be 0)`);
  console.log(`  multipleChoice blocks in body sections       : ${memCheck.stats.bodyMC}`);
  console.log(`  multipleChoice blocks course-wide            : ${memCheck.stats.mcTotal}`);
  if (!memCheck.ok) {
    memCheck.failures.slice(0, 30).forEach((f) => console.log(`   ${f}`));
    console.log('\nABORT — marker verification failed. Refusing to write.');
    await mongoose.disconnect();
    process.exit(1);
  }

  // ── schema validation, no DB required ──
  const vErr = new Course(patched).validateSync();
  if (vErr) {
    console.log('\nvalidateSync FAILED on the converted document:');
    Object.entries(vErr.errors || {}).slice(0, 20).forEach(([p, e]) => console.log(`   ${p}: ${e.message}`));
    console.log('\nABORT — fix validation before writing.');
    await mongoose.disconnect();
    process.exit(1);
  }
  console.log('validateSync: PASS');

  if (!EXECUTE) {
    console.log('\nDRY RUN — no writes, no snapshot taken. Re-run with --execute to write.');
    console.log(line + '\n');
    await mongoose.disconnect();
    return;
  }

  // ── pre-write snapshot (CLAUDE.md: "Snapshot Before Every Course Write") ──
  // `raw` came from the raw driver, so it is already a plain object — no
  // toObject() needed, and no __parentArray cycle to break EJSON.
  console.log('\ntaking pre-write snapshot...');
  const snap = await snapshotCourse(raw, {
    reason: 'convertInlineKCs_CR-307: relocate 15 inline HTML knowledge checks out of body text blocks into native multipleChoice blocks',
  });
  console.log(`  local: ${snap.localPath || 'n/a'}${snap.localEphemeral ? ' (ephemeral on Render)' : ''}`);
  console.log(`  s3:    ${snap.s3Uri || snap.s3Error || 'n/a'}`);
  if (!snap.localPath && !snap.s3Uri) {
    console.log('\nABORT — snapshot produced neither a local nor an S3 copy. Refusing to write without a backup.');
    await mongoose.disconnect();
    process.exit(1);
  }

  // ── write: raw driver $set. NOT doc.save() — CR-307 carries legacy data. ──
  // Bypassing the model bypasses its pre-save rollups, so the two that this
  // change actually moves are recomputed here with the same canonical counter.
  const totalContentBlocks = sections.reduce((n, s) => n + (s.contentBlocks || []).length, 0);
  const res = await col.updateOne(
    { _id: raw._id },
    { $set: { sections, wordCount: afterWords, totalContentBlocks, updatedAt: new Date() } }
  );
  console.log(`\nupdateOne: matched=${res.matchedCount} modified=${res.modifiedCount}`);

  // ── READ-BACK VERIFY ──
  console.log('\nreading the document back...');
  const back = await col.findOne({ _id: raw._id });
  if (!back) {
    console.log('READ-BACK FAILED — document not found after write.');
    await mongoose.disconnect();
    process.exit(1);
  }

  const backCheck = verifyMarkers(back.sections || [], converted, 'read-back');
  const backWords = countCourseWords(back);
  const backBlocks = (back.sections || []).map((s) => (s.contentBlocks || []).length);

  console.log(`  courseCode=${back.courseCode} · status=${back.status} · isPublished=${back.isPublished} · accessType=${back.accessType} · price=${back.price} · slug=${back.slug}`);
  console.log(`  sections=${(back.sections || []).length} · blocks per section=[${backBlocks.join(', ')}] · totalContentBlocks=${back.totalContentBlocks}`);
  console.log(`  stored wordCount=${back.wordCount} · recomputed=${backWords}`);
  console.log(`  "Correct Answer:" left in content : ${backCheck.stats.leaks}  (must be 0)`);
  console.log(`  KC wrapper divs left in content   : ${backCheck.stats.wrappers}  (must be 0)`);
  console.log(`  multipleChoice blocks course-wide : ${backCheck.stats.mcTotal}`);

  const drifts = [];
  if (!backCheck.ok) drifts.push(...backCheck.failures.slice(0, 30));
  try {
    assertSectionIdsIntact(raw.sections || [], back.sections || [], 'read-back');
    console.log(`  section _id guard                 : PASS (unchanged, still ObjectId)`);
  } catch (e) { drifts.push(e.message); }
  if (backWords !== afterWords) drifts.push(`recomputed word count ${backWords} !== planned ${afterWords}`);
  if (back.wordCount !== afterWords) drifts.push(`stored wordCount ${back.wordCount} !== planned ${afterWords}`);
  if (JSON.stringify(backBlocks) !== JSON.stringify(afterBlocks)) drifts.push(`blocks per section [${backBlocks.join(', ')}] !== planned [${afterBlocks.join(', ')}]`);
  for (const f of IMMUTABLE) {
    if (JSON.stringify(back[f]) !== JSON.stringify(raw[f])) drifts.push(`IMMUTABLE FIELD CHANGED: ${f} ${JSON.stringify(raw[f])} -> ${JSON.stringify(back[f])}`);
  }

  if (drifts.length) {
    console.log('\nREAD-BACK VERIFY: FAIL');
    drifts.forEach((d) => console.log(`   ${d}`));
    console.log(`\nThe pre-write snapshot is at: ${snap.s3Uri || snap.localPath}`);
    console.log('Restore with: node src/scripts/restoreCourse.js --key=<S3 key> --apply');
    await mongoose.disconnect();
    process.exit(1);
  }

  console.log('\nREAD-BACK VERIFY: PASS');
  console.log(line + '\n');
  await mongoose.disconnect();
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => { console.error('ERROR:', e.message || e); process.exit(1); });
}

export { parseKCs, findKcDivRange, exciseRange, planConversion, verifyMarkers, assertACEPPatchApplied, assertImmutable, assertSectionIdsIntact };
