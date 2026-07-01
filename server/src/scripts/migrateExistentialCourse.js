/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * migrateExistentialCourse.js
 *
 * Finds the Existential Theory course in the legacy `courses` collection
 * and transforms it into the `interactivecourses` schema:
 *   modules[].lessons[]  ->  sections[].contentBlocks[]
 *   options: [{text,isCorrect}]  ->  options: [String] + correctAnswer: Number
 *
 * Sets courseCode: 'CR-C3', status: 'draft'.
 * Preserves existing title/description/ceHours/objectives/references.
 * Does NOT delete from the old collection.
 *
 * Run from Render shell:
 *   node src/scripts/migrateExistentialCourse.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.MONGODB_URI) {
  console.error('ERROR: MONGODB_URI is not set.');
  process.exit(1);
}

await mongoose.connect(process.env.MONGODB_URI);
console.log('Connected to MongoDB\n');

const db = mongoose.connection.db;
const coursesCol = db.collection('courses');
const interactiveCol = db.collection('interactivecourses');

const SLUG_NEEDLE = 'existential-theory-in-clinical-practice';

const source = await coursesCol.findOne({ slug: { $regex: SLUG_NEEDLE, $options: 'i' } });

if (!source) {
  console.error(`ERROR: No course found in "courses" with slug containing "${SLUG_NEEDLE}".`);
  await mongoose.disconnect();
  process.exit(1);
}

console.log(`Found source course: ${source.slug}`);
console.log(`  title: ${source.title}`);
console.log(`  modules: ${(source.modules || []).length}`);

// --- helpers -----------------------------------------------------------------

function stripHtml(s) {
  return String(s || '').replace(/<[^>]+>/g, ' ').replace(/&\w+;/g, ' ').replace(/\s+/g, ' ').trim();
}

function normalizeOptionsToStrings(rawOptions) {
  // Returns { options: [String], correctAnswer: Number (zero-indexed) }
  const opts = Array.isArray(rawOptions) ? rawOptions : [];
  const optionStrings = [];
  let correctIndex = -1;

  opts.forEach((o, idx) => {
    if (typeof o === 'string') {
      optionStrings.push(o);
    } else if (o && typeof o === 'object') {
      optionStrings.push(String(o.text ?? o.label ?? o.value ?? ''));
      if (o.isCorrect === true && correctIndex === -1) correctIndex = idx;
    } else {
      optionStrings.push(String(o ?? ''));
    }
  });

  return { options: optionStrings, correctAnswer: correctIndex === -1 ? 0 : correctIndex };
}

function resolveCorrectAnswer(question, normalized) {
  // If the source already had a correctAnswer field (number or string), honor it.
  if (typeof question.correctAnswer === 'number') return question.correctAnswer;
  if (typeof question.correctAnswer === 'string') {
    // Could be an option text — try to match
    const i = normalized.options.findIndex(o => o === question.correctAnswer);
    if (i !== -1) return i;
    // Or a numeric string
    const n = parseInt(question.correctAnswer, 10);
    if (!Number.isNaN(n)) return n;
  }
  return normalized.correctAnswer;
}

// --- transform ---------------------------------------------------------------

const sections = [];
let sectionOrder = 0;

for (const mod of (source.modules || [])) {
  const contentBlocks = [];
  let blockOrder = 0;

  // Section divider for this module
  contentBlocks.push({
    type: 'sectionDivider',
    order: blockOrder++,
    title: mod.title || `Module ${sectionOrder + 1}`,
    sectionNumber: sectionOrder + 1,
    subtitle: mod.subtitle || mod.description || ''
  });

  for (const lesson of (mod.lessons || [])) {
    const lessonType = lesson.type || 'text';

    if (lessonType === 'quiz' || lessonType === 'assessment' || lessonType === 'timedAssessment') {
      for (const q of (lesson.questions || [])) {
        const normalized = normalizeOptionsToStrings(q.options);
        const correctAnswer = resolveCorrectAnswer(q, normalized);
        contentBlocks.push({
          type: 'multipleChoice',
          order: blockOrder++,
          question: q.question || q.text || '',
          options: normalized.options,      // [String]
          correctAnswer: correctAnswer,     // Number (zero-indexed)
          explanation: q.explanation || q.rationale || ''
        });
      }
      continue;
    }

    if (lessonType === 'multipleChoice' || lessonType === 'multiSelect') {
      const normalized = normalizeOptionsToStrings(lesson.options);
      const correctAnswer = resolveCorrectAnswer(lesson, normalized);
      contentBlocks.push({
        type: 'multipleChoice',
        order: blockOrder++,
        question: lesson.question || lesson.title || '',
        options: normalized.options,
        correctAnswer: correctAnswer,
        explanation: lesson.explanation || ''
      });
      continue;
    }

    if (lessonType === 'accordion') {
      contentBlocks.push({
        type: 'accordion',
        order: blockOrder++,
        title: lesson.title || '',
        accordionItems: (lesson.accordionItems || []).map(i => ({
          title: i.title || '',
          content: i.content || ''
        }))
      });
      continue;
    }

    if (lessonType === 'matching') {
      contentBlocks.push({
        type: 'matching',
        order: blockOrder++,
        title: lesson.title || '',
        matchingPairs: (lesson.matchingPairs || []).map(p => ({
          term: p.term || '',
          definition: p.definition || ''
        }))
      });
      continue;
    }

    if (lessonType === 'imageText') {
      contentBlocks.push({
        type: 'imageText',
        order: blockOrder++,
        image: lesson.image || lesson.imageUrl || '',
        imageAlt: lesson.imageAlt || '',
        title: lesson.title || '',
        content: lesson.content || ''
      });
      continue;
    }

    if (lessonType === 'video') {
      contentBlocks.push({
        type: 'video',
        order: blockOrder++,
        videoUrl: lesson.videoUrl || lesson.content || '',
        videoTitle: lesson.title || '',
        videoDuration: lesson.duration ? lesson.duration * 60 : undefined
      });
      continue;
    }

    // Default: text / download / anything else -> text block
    const content = lesson.content || lesson.textContent || lesson.body || '';
    if (String(content).trim()) {
      contentBlocks.push({
        type: 'text',
        order: blockOrder++,
        title: lesson.title || '',
        textContent: content,
        content: content
      });
    }
  }

  sections.push({
    title: mod.title || `Module ${sectionOrder + 1}`,
    description: mod.description || '',
    order: sectionOrder,
    contentBlocks,
    estimatedTime: mod.estimatedTime || 15
  });
  sectionOrder++;
}

// Word count (from text blocks only)
let wordCount = 0;
for (const sec of sections) {
  for (const block of sec.contentBlocks) {
    const txt = block.textContent || block.content || '';
    const plain = stripHtml(txt);
    if (plain) wordCount += plain.split(/\s+/).filter(Boolean).length;
  }
}

// Build a unique slug for interactivecourses
const baseSlug = source.slug;
let newSlug = baseSlug;
let suffix = 0;
while (await interactiveCol.findOne({ slug: newSlug })) {
  suffix += 1;
  newSlug = `${baseSlug}-v${suffix}`;
}
if (newSlug !== baseSlug) {
  console.log(`  slug "${baseSlug}" already exists in interactivecourses, using "${newSlug}"`);
}

const now = new Date();
const doc = {
  title: source.title,
  slug: newSlug,
  description: source.description,
  courseCode: 'CR-C3',
  ceHours: source.ceHours,
  ceProvider: source.ceProvider || 'NBCC ACEP #7760',
  acepNumber: source.acepNumber || '7760',
  objectives: source.objectives || [],
  references: source.references || [],
  sections,
  status: 'draft',
  wordCount,
  sectionCount: sections.length,
  moduleCount: sections.length,
  totalContentBlocks: sections.reduce((n, s) => n + s.contentBlocks.length, 0),
  createdAt: now,
  updatedAt: now
};

const result = await interactiveCol.insertOne(doc);

console.log('\n✅ Migration complete.');
console.log(`   new _id : ${result.insertedId}`);
console.log(`   slug    : ${newSlug}`);
console.log(`   code    : CR-C3`);
console.log(`   status  : draft`);
console.log(`   sections: ${sections.length}`);
console.log(`   blocks  : ${doc.totalContentBlocks}`);
console.log(`   words   : ${wordCount}`);
console.log(`\nOld course in "courses" collection was NOT deleted.`);

await mongoose.disconnect();
process.exit(0);
