/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * diagnoseEnforcement.js — v2
 * CounselorReady | READ-ONLY diagnostic
 *
 * Simulates all enforcement steps on a deep clone of each course WITHOUT
 * writing anything to MongoDB. Run before any bulk rebuild operation.
 *
 * New in v2:
 *   • APA in-text citation check (text blocks > 500 words)
 *   • Inline style / <h1> / <font> tag detection
 *   • Deprecated hex color detection (COURSE_SCHEMA_SPEC §8.6)
 *   • Required-field validation for all 17 complex block types
 *   • Section-completion gate audit (cardSort/sequencing/timeline gap)
 *   • Phase 2 readiness flag per section
 *   • Assessment question format check (string array vs object)
 *   • Embedded metadata detection
 *   • Publish-state consistency check
 *
 * Usage:
 *   node src/scripts/diagnoseEnforcement.js
 *   node src/scripts/diagnoseEnforcement.js --slug some-course-slug
 *   node src/scripts/diagnoseEnforcement.js --fix-report
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// ─── Config ───────────────────────────────────────────────────────────────────

const MONGODB_URI = process.env.MONGODB_URI;
const SKIP_SLUGS  = ['the-elephant-in-the-room'];

const WORDS_PER_CE_HOUR   = 6000;
const MIN_FINAL_QUESTIONS = 15;
const MIN_OBJECTIVES      = 4;
const MIN_REFERENCES      = 3;
const CITATION_WORD_FLOOR = 500;
const CITATION_PATTERN    = /\([A-Z][A-Za-z\-]+(?:\s+et\s+al\.?)?,\s*\d{4}(?:[a-z])?\)/;

// Block types CourseViewer counts for allInteractiveComplete gate
const GATE_BLOCK_TYPES = ['multipleChoice', 'multiSelect', 'matching'];
// Knowledge-check types NOT in the gate (users can skip without section gating)
const UNGATED_KC_TYPES = ['cardSort', 'sequencing', 'timeline'];
const ALL_KC_TYPES     = [...GATE_BLOCK_TYPES, ...UNGATED_KC_TYPES];

// Required fields per block type (CourseViewer will silently break without these)
const REQUIRED_FIELDS = {
  accordion:      ['accordionItems'],
  matching:       ['matchingPairs'],
  multipleChoice: ['question', 'options'],
  multiSelect:    ['question', 'options'],
  cardSort:       ['cards'],
  sequencing:     ['items'],
  timeline:       ['events'],
  scenarioTree:   ['startNode', 'nodes'],
  flashcardDeck:  ['flashcards'],
  hotspot:        ['hotspotImage', 'hotspotPoints'],
  videoEmbed:     ['videoUrl'],
  imageText:      ['image', 'imageAlt'],
  image:          ['imageUrl'],
  resources:      ['resourceItems'],
  reflection:     ['question'],
};

// Deprecated hex values — COURSE_SCHEMA_SPEC_v2 §8.6
const DEPRECATED_HEX = [
  '#40634A', '#34495E', '#4B5D4B', '#7D4E57',
  '#FAFAF9', '#F8F7F4', '#FAFAF8', '#F5F5F4',
];

const SEV = { ERROR: '❌', WARN: '⚠️ ', INFO: 'ℹ️ ', OK: '✅' };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function flag(severity, code, message, context = '') {
  return { severity, code, message, context };
}

function wordCount(html = '') {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    .split(' ').filter(Boolean).length;
}

function courseWordCount(course) {
  let total = 0;
  for (const section of (course.sections || [])) {
    for (const block of (section.contentBlocks || [])) {
      const html = block.textContent || block.content || '';
      if (html) total += wordCount(html);
    }
  }
  return total;
}

// ─── Check: ACEP word count ───────────────────────────────────────────────────

function checkWordCount(course, flags) {
  const words  = courseWordCount(course);
  const hours  = course.ceHours || 1;
  const needed = hours * WORDS_PER_CE_HOUR;
  if (words < needed) {
    flags.push(flag(SEV.ERROR, 'WORD_COUNT',
      `${words.toLocaleString()} words — need ${needed.toLocaleString()} for ${hours} CE hrs`,
      `gap: ${(needed - words).toLocaleString()} words`));
  } else {
    flags.push(flag(SEV.OK, 'WORD_COUNT',
      `${words.toLocaleString()} words (${Math.round(words / hours / 100) / 10}k/hr)`));
  }
}

// ─── Check: Final assessment ──────────────────────────────────────────────────

function checkAssessment(course, flags) {
  const qs = course.assessment?.questions || [];

  if (qs.length < MIN_FINAL_QUESTIONS) {
    flags.push(flag(SEV.ERROR, 'FINAL_EXAM',
      `Final exam: ${qs.length} questions (need ${MIN_FINAL_QUESTIONS})`));
  } else {
    flags.push(flag(SEV.OK, 'FINAL_EXAM', `Final exam: ${qs.length} questions`));
  }

  // Must be string array + correctAnswer index — NOT {text, isCorrect} objects
  const malformed = qs.filter(q =>
    !Array.isArray(q.options) || q.options.some(o => typeof o !== 'string')
  );
  if (malformed.length > 0) {
    flags.push(flag(SEV.ERROR, 'QUESTION_FORMAT',
      `${malformed.length} question(s) use {text,isCorrect} object format — must be string arrays`,
      malformed.slice(0, 3).map(q => `"${(q.question || '').substring(0, 40)}"`).join(' | ')));
  }

  const ps     = course.assessment?.passingScore ?? course.assessment?.passThreshold;
  const passPct = ps > 1 ? ps : (ps || 0) * 100;
  if (passPct < 80) {
    flags.push(flag(SEV.ERROR, 'PASS_THRESHOLD',
      `Passing score ${passPct}% — ACEP requires 80%`));
  }

  if (!course.assessment?.isExam) {
    flags.push(flag(SEV.WARN, 'IS_EXAM_FLAG',
      'assessment.isExam not true — may not register as final exam'));
  }
}

// ─── Check: Objectives & references ──────────────────────────────────────────

function checkMetadata(course, flags) {
  const objs = course.objectives || [];
  const refs  = course.references || [];

  objs.length < MIN_OBJECTIVES
    ? flags.push(flag(SEV.ERROR, 'OBJECTIVES', `${objs.length} objectives (need ${MIN_OBJECTIVES})`))
    : flags.push(flag(SEV.OK,    'OBJECTIVES', `${objs.length} learning objectives`));

  refs.length < MIN_REFERENCES
    ? flags.push(flag(SEV.WARN, 'REFERENCES', `${refs.length} reference(s) (ACEP recommends ${MIN_REFERENCES}+)`))
    : flags.push(flag(SEV.OK,   'REFERENCES', `${refs.length} references`));

  if (!course.targetAudience?.length)
    flags.push(flag(SEV.WARN, 'TARGET_AUDIENCE', 'targetAudience missing or empty'));

  if (!course.presenter?.name)
    flags.push(flag(SEV.WARN, 'PRESENTER', 'presenter.name missing'));
}

// ─── Check: Section-level interactive blocks & gate gap ───────────────────────

function checkSections(course, flags) {
  for (let si = 0; si < (course.sections || []).length; si++) {
    const section = course.sections[si];
    const blocks  = section.contentBlocks || [];
    const label   = `S${si + 1} "${(section.title || '').substring(0, 40)}"`;

    const kcBlocks   = blocks.filter(b => ALL_KC_TYPES.includes(b.type));
    const gatedKC    = blocks.filter(b => GATE_BLOCK_TYPES.includes(b.type));
    const ungatedOnly = kcBlocks.length > 0 && gatedKC.length === 0;

    if (kcBlocks.length === 0) {
      flags.push(flag(SEV.ERROR, 'NO_KC',
        `${label}: 0 knowledge check blocks`,
        'Phase 2 needed — section saves incomplete if API unavailable'));
    } else if (kcBlocks.length < 2) {
      flags.push(flag(SEV.WARN, 'LOW_KC',
        `${label}: only ${kcBlocks.length} knowledge check (ACEP wants 2–3)`));
    }

    if (ungatedOnly) {
      flags.push(flag(SEV.WARN, 'GATE_GAP',
        `${label}: KC blocks [${kcBlocks.map(b => b.type).join(', ')}] are NOT counted by CourseViewer completion gate`,
        'Add multipleChoice/multiSelect/matching or users bypass section without gating'));
    }

    // Phase 2 readiness
    const missing = [
      !blocks.some(b => b.type === 'reflection') && 'reflection',
      !blocks.some(b => b.type === 'resources')  && 'resources',
    ].filter(Boolean);
    if (missing.length) {
      flags.push(flag(SEV.INFO, 'PHASE2_NEEDED',
        `${label}: missing [${missing.join(', ')}] — Phase 2 would generate these`));
    }
  }
}

// ─── Check: APA in-text citations ────────────────────────────────────────────

function checkCitations(course, flags) {
  let uncited = 0;
  for (let si = 0; si < (course.sections || []).length; si++) {
    for (let bi = 0; bi < (course.sections[si].contentBlocks || []).length; bi++) {
      const block = course.sections[si].contentBlocks[bi];
      if (block.type !== 'text' && block.type !== 'imageText') continue;
      const html  = block.textContent || block.content || '';
      const words = wordCount(html);
      if (words < CITATION_WORD_FLOOR) continue;
      if (!CITATION_PATTERN.test(html)) {
        uncited++;
        flags.push(flag(SEV.ERROR, 'NO_CITATIONS',
          `S${si + 1} block ${bi}: ${words}w text block has no (Author, Year) citation`,
          'APA 7 requires in-text citations for all clinical claims'));
      }
    }
  }
  if (uncited === 0)
    flags.push(flag(SEV.OK, 'CITATIONS', 'All substantial text blocks contain citations'));
}

// ─── Check: Inline styles, <h1>, <font>, deprecated colors ───────────────────

function checkInlineStyles(course, flags) {
  let styleHits = 0, h1Hits = 0, fontHits = 0, colorHits = 0;

  for (let si = 0; si < (course.sections || []).length; si++) {
    for (const block of (course.sections[si].contentBlocks || [])) {
      const html = block.textContent || block.content || '';
      if (!html) continue;
      const loc = `S${si + 1} "${block.type}"`;

      if (/style\s*=\s*["'][^"']*["']/i.test(html)) {
        styleHits++;
        flags.push(flag(SEV.WARN, 'INLINE_STYLE',
          `${loc}: contains style= attribute`,
          'Overrides design system — strip from DB content'));
      }
      if (/<h1[\s>]/i.test(html)) {
        h1Hits++;
        flags.push(flag(SEV.WARN, 'H1_IN_CONTENT',
          `${loc}: contains <h1> — reserved for course player chrome only`));
      }
      if (/<font[\s>]/i.test(html)) {
        fontHits++;
        flags.push(flag(SEV.WARN, 'FONT_TAG',
          `${loc}: uses deprecated <font> element`));
      }
      for (const hex of DEPRECATED_HEX) {
        if (html.toLowerCase().includes(hex.toLowerCase())) {
          colorHits++;
          flags.push(flag(SEV.WARN, 'DEPRECATED_COLOR',
            `${loc}: contains deprecated color ${hex}`,
            'Replace per COURSE_SCHEMA_SPEC_v2 §8.6'));
        }
      }
    }
  }

  if (!styleHits && !h1Hits && !fontHits && !colorHits)
    flags.push(flag(SEV.OK, 'HTML_QUALITY', 'No inline styles, <h1>, <font>, or deprecated colors'));
}

// ─── Check: Required fields on complex block types ────────────────────────────

function checkBlockFields(course, flags) {
  let broken = 0;
  for (let si = 0; si < (course.sections || []).length; si++) {
    for (let bi = 0; bi < (course.sections[si].contentBlocks || []).length; bi++) {
      const block    = course.sections[si].contentBlocks[bi];
      const required = REQUIRED_FIELDS[block.type];
      if (!required) continue;

      const missing = required.filter(field => {
        const val = block[field];
        return val === undefined || val === null || val === '' ||
               (Array.isArray(val) && val.length === 0);
      });

      if (missing.length > 0) {
        broken++;
        flags.push(flag(SEV.ERROR, 'BROKEN_BLOCK',
          `S${si + 1} block ${bi} (${block.type}): missing required field(s) [${missing.join(', ')}]`,
          'CourseViewer will silently break or render blank for this block'));
      }
    }
  }
  if (broken === 0)
    flags.push(flag(SEV.OK, 'BLOCK_FIELDS', 'All complex block types have required fields'));
}

// ─── Check: Duplicate headings ────────────────────────────────────────────────

function checkDuplicateHeadings(course, flags) {
  const headingRe = /<h[2-4][^>]*>(.*?)<\/h[2-4]>/gi;
  const seen = new Set();
  const dupes = [];

  for (const section of (course.sections || [])) {
    for (const block of (section.contentBlocks || [])) {
      const html = block.textContent || block.content || '';
      let m;
      while ((m = headingRe.exec(html)) !== null) {
        const text = m[1].replace(/<[^>]*>/g, '').trim().toLowerCase();
        if (seen.has(text)) dupes.push(text);
        seen.add(text);
      }
    }
  }

  dupes.length > 0
    ? flags.push(flag(SEV.WARN, 'DUPLICATE_HEADINGS',
        `${dupes.length} duplicate heading(s)`,
        dupes.slice(0, 5).map(d => `"${d}"`).join(', ')))
    : flags.push(flag(SEV.OK, 'DUPLICATE_HEADINGS', 'No duplicate headings'));
}

// ─── Check: Embedded metadata in content ─────────────────────────────────────

function checkEmbeddedMetadata(course, flags) {
  const patterns = [
    /CE Hours?:\s*\d/i,
    /Course (Code|Title|Description):/i,
    /Target Audience:/i,
    /Learning Objectives?:/i,
    /ACEP\s*#?\s*7760/i,
    /GAITP/i,
    /Presenter:/i,
  ];

  for (let si = 0; si < (course.sections || []).length; si++) {
    for (const block of (course.sections[si].contentBlocks || [])) {
      const html = block.textContent || block.content || '';
      for (const pat of patterns) {
        if (pat.test(html)) {
          flags.push(flag(SEV.WARN, 'EMBEDDED_METADATA',
            `S${si + 1} "${block.type}": contains metadata-like text`,
            `Pattern matched: ${pat} — strip before publishing`));
          break;
        }
      }
    }
  }
}

// ─── Check: Publish state consistency ────────────────────────────────────────

function checkPublishState(course, flags) {
  const pub   = course.status === 'published';
  const isPub = course.isPublished === true;
  if (pub !== isPub) {
    flags.push(flag(SEV.WARN, 'PUBLISH_STATE',
      `Inconsistent: status="${course.status}" but isPublished=${course.isPublished}`,
      'Both must be set together — use the publish endpoint, not direct DB edits'));
  }
}

// ─── Run all checks on one course ────────────────────────────────────────────

function diagnoseCourse(course) {
  const clone = JSON.parse(JSON.stringify(course)); // deep clone — NEVER mutate
  const flags = [];
  checkWordCount(clone, flags);
  checkAssessment(clone, flags);
  checkMetadata(clone, flags);
  checkSections(clone, flags);
  checkCitations(clone, flags);
  checkInlineStyles(clone, flags);
  checkBlockFields(clone, flags);
  checkDuplicateHeadings(clone, flags);
  checkEmbeddedMetadata(clone, flags);
  checkPublishState(clone, flags);
  return flags;
}

// ─── Print results ────────────────────────────────────────────────────────────

function printResults(allResults, fixOnly) {
  const D = '═'.repeat(70);
  for (const { course, flags } of allResults) {
    const errors = flags.filter(f => f.severity === SEV.ERROR).length;
    const warns  = flags.filter(f => f.severity === SEV.WARN).length;
    const badge  = errors > 0 ? '🔴' : warns > 0 ? '🟡' : '🟢';

    console.log(`\n${D}`);
    console.log(`${badge} ${course.title}`);
    console.log(`   ${course.slug} | ${course.ceHours}CE | ${(course.sections || []).length} sections | status: ${course.status}`);
    console.log(D);

    const output = fixOnly
      ? flags.filter(f => f.severity === SEV.ERROR || f.severity === SEV.WARN)
      : flags;

    for (const f of output) {
      console.log(`  ${f.severity} [${f.code}] ${f.message}`);
      if (f.context) console.log(`       → ${f.context}`);
    }
    if (output.length === 0) console.log('  ✅ No issues');
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args    = process.argv.slice(2);
  const slugArg = args.includes('--slug') ? args[args.indexOf('--slug') + 1] : null;
  const fixOnly = args.includes('--fix-report');

  console.log('\n' + '═'.repeat(70));
  console.log('  diagnoseEnforcement.js v2 — READ ONLY, NO WRITES');
  console.log('═'.repeat(70));
  if (fixOnly) console.log('  Mode: --fix-report (errors + warnings only)\n');

  if (!MONGODB_URI) { console.error('❌ MONGODB_URI not set'); process.exit(1); }

  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB\n');

  const InteractiveCourse = mongoose.connection.models.InteractiveCourse ||
    mongoose.model('InteractiveCourse',
      new mongoose.Schema({}, { strict: false, collection: 'interactivecourses' }));

  const query   = slugArg ? { slug: slugArg } : {};
  const courses = await InteractiveCourse.find(query).lean();
  console.log(`📚 ${courses.length} course(s) loaded${slugArg ? ` (slug: "${slugArg}")` : ''}\n`);

  const skipped    = [];
  const allResults = [];

  for (const course of courses) {
    if (SKIP_SLUGS.includes(course.slug)) { skipped.push(course.slug); continue; }
    allResults.push({ course, flags: diagnoseCourse(course) });
  }

  printResults(allResults, fixOnly);

  // ── Summary ──
  let errors = 0, warns = 0, ok = 0, info = 0;
  for (const { flags } of allResults) {
    for (const f of flags) {
      if      (f.severity === SEV.ERROR) errors++;
      else if (f.severity === SEV.WARN)  warns++;
      else if (f.severity === SEV.OK)    ok++;
      else                               info++;
    }
  }

  console.log('\n' + '═'.repeat(70));
  console.log('  SUMMARY');
  console.log('═'.repeat(70));
  console.log(`  Courses diagnosed : ${allResults.length}`);
  console.log(`  Skipped (gold)    : ${skipped.join(', ') || 'none'}`);
  console.log(`  ❌ Errors         : ${errors}`);
  console.log(`  ⚠️  Warnings       : ${warns}`);
  console.log(`  ✅ OK checks      : ${ok}`);
  console.log(`  ℹ️  Info           : ${info}`);
  console.log('═'.repeat(70));

  if (errors > 0)     console.log('\n  🛑 Fix errors before running bulkRebuildCourses.js\n');
  else if (warns > 0) console.log('\n  🟡 Warnings present — review before publishing\n');
  else                console.log('\n  🟢 All courses pass enforcement checks\n');

  await mongoose.disconnect();
}

main().catch(err => { console.error('❌ Fatal:', err.message); process.exit(1); });
