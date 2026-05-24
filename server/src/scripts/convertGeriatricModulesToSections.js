/**
 * convertGeriatricModulesToSections.js
 * ─────────────────────────────────────
 * Migrates CR-610 through CR-614 from modules[] → sections[].
 * Mirrors convertSexualHealthModulesToSections.js exactly.
 *
 * Run from Render shell (~/project/src/server):
 *   node src/scripts/convertGeriatricModulesToSections.js
 *
 * Safe to re-run — skips courses already having sections[] content.
 */

import mongoose from 'mongoose';
import { Course as InteractiveCourse } from '../models/InteractiveCourse.js';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }
await mongoose.connect(process.env.MONGODB_URI);

const rawCollection = mongoose.connection.db.collection('interactivecourses');

const TARGET_SLUGS = [
  'unretiring-the-self-identity-purpose-depression-older-adults',
  'the-long-goodbye-dementia-grief-family-systems',
  'still-standing-geriatric-suicide-risk-assessment-safety-planning',
  'seasoned-and-struggling-substance-use-disorders-older-adults',
  'the-final-chapter-end-of-life-counseling-death-anxiety-meaning-making',
];

const TYPE_REMAP = {
  'multiple-choice': 'multipleChoice', 'multiple_choice': 'multipleChoice',
  'multi-select':    'multiSelect',    'multi_select':    'multiSelect',
};

function normalizeOptions(options, correctAnswerIdx) {
  if (!Array.isArray(options)) return options;
  return options.map((o, i) => {
    if (typeof o === 'string') {
      return { text: o, isCorrect: typeof correctAnswerIdx === 'number' && i === correctAnswerIdx };
    }
    if (o && typeof o === 'object') {
      return {
        text: o.text || '',
        isCorrect: typeof o.isCorrect === 'boolean'
          ? o.isCorrect
          : typeof correctAnswerIdx === 'number' && i === correctAnswerIdx,
      };
    }
    return o;
  });
}

function normalizeBlock(block) {
  if (!block || typeof block !== 'object') return;
  if (block.type && TYPE_REMAP[block.type]) block.type = TYPE_REMAP[block.type];
  if (Array.isArray(block.options)) {
    block.options = normalizeOptions(block.options, block.correctAnswer);
  }
  if (Array.isArray(block.questions)) {
    block.questions.forEach(q => {
      if (!q) return;
      if (q.type && TYPE_REMAP[q.type]) q.type = TYPE_REMAP[q.type];
      if (Array.isArray(q.options)) q.options = normalizeOptions(q.options, q.correctAnswer);
    });
  }
}

console.log('═'.repeat(72));
console.log('  Geriatric series: modules[] → sections[] migration');
console.log('═'.repeat(72));
console.log();

let converted = 0, skipped = 0, notFound = 0;

for (const slug of TARGET_SLUGS) {
  const raw = await rawCollection.findOne({ slug });
  if (!raw) {
    console.log(`✗ ${slug}  NOT FOUND`);
    notFound++;
    continue;
  }

  const sectionsHaveContent = Array.isArray(raw.sections) &&
    raw.sections.some(s => Array.isArray(s.contentBlocks) && s.contentBlocks.length > 0);
  if (sectionsHaveContent) {
    console.log(`· ${slug}  already has sections[] — skipped`);
    skipped++;
    continue;
  }

  const modules = Array.isArray(raw.modules) ? raw.modules : [];
  if (modules.length === 0) {
    console.log(`✗ ${slug}  no modules[] to convert`);
    skipped++;
    continue;
  }

  const sections = modules.map((mod, si) => {
    const blocks = Array.isArray(mod.contentBlocks) ? mod.contentBlocks : [];
    const contentBlocks = blocks.map((b, bi) => {
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
    console.log(`    wordCount: ${before.wordCount} → ${after.wordCount}`);
    console.log(`    blocks:    ${before.blocks} → ${after.blocks}`);
    converted++;
  } catch (err) {
    console.log(`✗ ${slug}  SAVE FAILED: ${err.message.slice(0, 200)}`);
  }
}

console.log();
console.log('─'.repeat(72));
console.log(`Converted: ${converted}  Skipped: ${skipped}  Not found: ${notFound}`);
await mongoose.disconnect();
