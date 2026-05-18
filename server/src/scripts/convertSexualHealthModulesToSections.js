#!/usr/bin/env node
/**
 * convertSexualHealthModulesToSections.js
 *
 * The 5 sexual-health course seeds (CR-303 through CR-307) wrote their content
 * to a `modules[]` field on the course document using a strict:false shadow
 * schema. The canonical InteractiveCourse schema (and the CR viewer) read
 * `sections[]` only, so all 18,000+ words of content per course is invisible
 * to the viewer and uncounted by the wordCount hook.
 *
 * This script:
 *   1. Reads the raw doc (bypassing schema to access modules[])
 *   2. Builds a proper sections[] array from modules[].contentBlocks[]
 *   3. Adds required `order` fields to sections and blocks
 *   4. Saves via the canonical model → triggers the new pre-save hook
 *      which counts the full content correctly
 *
 *   node src/scripts/convertSexualHealthModulesToSections.js
 *
 * Safe to re-run. Skips courses that already have content in sections[].
 */

import mongoose from 'mongoose';
import { Course as InteractiveCourse } from '../models/InteractiveCourse.js';
import 'dotenv/config';

const TARGET_SLUGS = [
  'sexual-health-across-the-lifespan',
  'sexuality-identity-mental-health-lgbtq',
  'sexual-trauma-assessment-treatment',
  'sex-therapy-foundations',
  'compulsive-sexual-behavior-intimacy-disorders',
];

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }

await mongoose.connect(MONGODB_URI);

// Use raw collection access ONLY to read modules[] (which the canonical
// schema doesn't expose). All writes go through the canonical model.
const rawCollection = mongoose.connection.db.collection('interactivecourses');

// Normalize a block so it passes the canonical schema:
//   • options as string array → [{text, isCorrect}] using correctAnswer index
//   • nested questions[].options same transform
//   • hyphen/underscore question types → camelCase
//   • applied recursively for KC wrapper blocks
function normalizeOptions(options, correctAnswerIdx) {
  if (!Array.isArray(options)) return options;
  return options.map((o, i) => {
    if (typeof o === 'string') {
      return { text: o, isCorrect: (typeof correctAnswerIdx === 'number') && i === correctAnswerIdx };
    }
    if (o && typeof o === 'object') {
      // Already in object shape — ensure text + isCorrect are present
      return {
        text: o.text || '',
        isCorrect: typeof o.isCorrect === 'boolean'
          ? o.isCorrect
          : (typeof correctAnswerIdx === 'number') && i === correctAnswerIdx,
      };
    }
    return o;
  });
}

const TYPE_REMAP = {
  'multiple-choice': 'multipleChoice', 'multiple_choice': 'multipleChoice',
  'multi-select':    'multiSelect',    'multi_select':    'multiSelect',
  'true-false':      'trueFalse',      'true_false':      'trueFalse',
};

function normalizeQuestion(q) {
  if (!q || typeof q !== 'object') return;
  if (q.type && TYPE_REMAP[q.type]) q.type = TYPE_REMAP[q.type];
  if (Array.isArray(q.options)) {
    q.options = normalizeOptions(q.options, q.correctAnswer);
  }
}

function normalizeBlock(block) {
  if (!block || typeof block !== 'object') return;
  if (block.type && TYPE_REMAP[block.type]) block.type = TYPE_REMAP[block.type];
  // Block-level options + correctAnswer (inline MC blocks)
  if (Array.isArray(block.options)) {
    block.options = normalizeOptions(block.options, block.correctAnswer);
  }
  // KC wrapper questions
  if (Array.isArray(block.questions)) {
    block.questions.forEach(normalizeQuestion);
  }
}

console.log('═'.repeat(72));
console.log('  Sexual-health series: modules[] → sections[] migration');
console.log('═'.repeat(72));
console.log();

let converted = 0, skipped = 0, notFound = 0;

for (const slug of TARGET_SLUGS) {
  // Read raw doc first to access modules[]
  const raw = await rawCollection.findOne({ slug });
  if (!raw) {
    console.log(`✗ ${slug}  NOT FOUND in DB`);
    notFound++;
    continue;
  }

  // If sections already has real content, skip
  const sectionsHaveContent = Array.isArray(raw.sections) &&
    raw.sections.some(s => Array.isArray(s.contentBlocks) && s.contentBlocks.length > 0);
  if (sectionsHaveContent) {
    console.log(`· ${slug}  already has sections[] content — skipped`);
    skipped++;
    continue;
  }

  const modules = Array.isArray(raw.modules) ? raw.modules : [];
  if (modules.length === 0) {
    console.log(`✗ ${slug}  no modules[] to convert — skipped`);
    skipped++;
    continue;
  }

  // Build sections[] from modules[]
  const sections = modules.map((mod, si) => {
    const blocks = Array.isArray(mod.contentBlocks) ? mod.contentBlocks : [];
    const contentBlocks = blocks.map((b, bi) => {
      // Strip any old _id from subdoc to avoid collisions; preserve all other fields
      const { _id, ...rest } = b || {};
      const block = { ...rest, order: bi + 1 };
      normalizeBlock(block);
      return block;
    });
    return {
      title: mod.title || `Module ${si + 1}`,
      order: si + 1,
      contentBlocks,
      estimatedTime: mod.estimatedTime || 15,
    };
  });

  // Load via canonical model, replace sections, save
  const course = await InteractiveCourse.findOne({ slug });
  if (!course) {
    console.log(`✗ ${slug}  canonical-model fetch failed`);
    notFound++;
    continue;
  }

  const before = { wordCount: course.wordCount, blocks: course.totalContentBlocks };
  course.sections = sections;
  course.markModified('sections');

  try {
    await course.save();
    const after = { wordCount: course.wordCount, blocks: course.totalContentBlocks };
    console.log(`✓ ${slug}`);
    console.log(`    ${modules.length} modules → ${sections.length} sections`);
    console.log(`    wordCount: ${before.wordCount} → ${after.wordCount}  (+${after.wordCount - before.wordCount})`);
    console.log(`    blocks:    ${before.blocks} → ${after.blocks}`);
    converted++;
  } catch (err) {
    console.log(`✗ ${slug}  SAVE FAILED`);
    console.log(`    ${err.message.slice(0, 200)}`);
  }
}

console.log();
console.log('─'.repeat(72));
console.log(`Converted: ${converted} of ${TARGET_SLUGS.length}`);
console.log(`Skipped:   ${skipped}`);
console.log(`Not found: ${notFound}`);

await mongoose.disconnect();
