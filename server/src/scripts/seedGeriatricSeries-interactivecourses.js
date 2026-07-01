/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * seedGeriatricSeries-interactivecourses.js
 *
 * Migration seed: converts CR-610 through CR-614 from the 'courses' collection
 * format (modules[]) into the 'interactivecourses' collection format (sections[]).
 *
 * Source file: seedGeriatricSeries-AllFive-CR610-CR614-89027words.js
 *
 * Transformations applied:
 *   1. modules[]  →  sections[]
 *   2. contentBlock type "knowledgeCheck" → individual "multipleChoice" contentBlocks
 *      (options as [String], correctAnswer as integer index)
 *   3. contentBlock type "quiz" with isExam:true → assessment.questions[]
 *      (removed from sections; captured as final exam questions)
 *   4. type "text" and type "sectionDivider" are preserved as-is
 *   5. assessment.passingScore = 80, assessment.attemptsAllowed = 999 (unlimited)
 *   6. maxAttempts: 999 at course level (unlimited, per admin-editor dropdown)
 *   7. estimatedTime per section = Math.round(ceHours * 60 / numSections) minutes
 *   8. minimumTimeMinutes = ceHours * 60 at course level (ACEP seat-time enforcement)
 *   9. status: "draft" for safety
 *   7. Upsert by slug (delete existing + insert)
 *
 * Uses native MongoDB driver via mongoose.connection.db
 * Target collection: interactivecourses
 *
 * Run: node src/scripts/seedGeriatricSeries-interactivecourses.js
 *
 * Courses:
 *   CR-610  Unretiring the Self (3 CE) — 23,574 words
 *   CR-611  The Long Goodbye (3 CE)    — 22,650 words
 *   CR-612  Still Standing (2 CE)      — 12,797 words
 *   CR-613  Seasoned & Struggling (2 CE) — 12,000 words
 *   CR-614  The Final Chapter (3 CE)   — 18,037 words
 */

import mongoose from 'mongoose';
// Run validator first: node src/scripts/validateSeed.js src/scripts/seedGeriatricSeries-interactivecourses.js
import { createRequire } from 'module';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import vm from 'vm';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('❌ MONGODB_URI not found'); process.exit(1); }

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 1 — Load course data from the original seed file
//
// We extract only the five const CRxxx = {...} definitions (lines 28–1580),
// which are pure data objects with no external dependencies. The import
// statements and seedAll() execution are excluded.
// ═══════════════════════════════════════════════════════════════════════════════

function loadOriginalCourses() {
  const sourcePath = join(__dirname, 'seedGeriatricSeries-AllFive-CR610-CR614-89027words.js');
  const src = readFileSync(sourcePath, 'utf8');

  // Lines 28–1580 (1-indexed) = indices 27–1579 (0-indexed).
  // This slice contains exactly the five const CR6xx = { ... }; definitions
  // and nothing else — no imports, no mongoose, no seedAll().
  const lines = src.split('\n');
  const courseDataSrc = lines.slice(27, 1580).join('\n');

  // Evaluate the course data in an isolated VM context.
  // Template literals and all standard JS syntax are supported.
  const context = vm.createContext({});
  const script = new vm.Script(
    courseDataSrc + '\n__courses__ = { CR610, CR611, CR612, CR613, CR614 };'
  );
  script.runInContext(context);

  return context.__courses__;
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 2 — Transform course structure
//
// modules[]  →  sections[]
// knowledgeCheck questions → individual multipleChoice contentBlocks
// quiz (isExam:true) questions → assessment.questions[]
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Processes a single module's contentBlocks array.
 *
 * - "text" blocks: preserved with {type, content} (order added)
 * - "sectionDivider" blocks: preserved with {type, sectionNumber, title, subtitle} (order added)
 * - "knowledgeCheck" blocks: each question inside becomes a separate "multipleChoice"
 *   contentBlock with options as [String] and correctAnswer as integer index
 * - "quiz" blocks with isExam:true: questions are pushed into assessmentQuestions[];
 *   the quiz block itself is NOT added to the section contentBlocks
 *
 * @param {Object[]} contentBlocks   Original contentBlocks from the source module
 * @param {Object[]} assessmentQuestions  Accumulator for final exam questions (mutated)
 * @returns {Object[]} Transformed contentBlocks for the section
 */
function processContentBlocks(contentBlocks, assessmentQuestions) {
  const result = [];
  let order = 0;

  for (const block of contentBlocks) {
    if (block.type === 'knowledgeCheck') {
      // Expand each question into its own multipleChoice contentBlock
      for (const q of (block.questions || [])) {
        result.push({
          type: 'multipleChoice',
          order: order++,
          question: q.question,
          options: q.options,          // already [String] array in source
          correctAnswer: q.correctAnswer, // already integer index in source
          explanation: q.explanation || ''
        });
      }
    } else if (block.type === 'quiz' && block.isExam) {
      // Extract final exam questions into assessment; do not add block to section
      for (const q of (block.questions || [])) {
        assessmentQuestions.push({
          question: q.question,
          options: q.options,            // [String] array
          correctAnswer: q.correctAnswer, // integer index
          explanation: q.explanation || ''
        });
      }
    } else {
      // Preserve text, sectionDivider, and any other block types
      result.push({ ...block, order: order++ });
    }
  }

  return result;
}

/**
 * Converts one course object from modules[] format to sections[] format.
 *
 * @param {Object} course  Original course object (with modules[])
 * @returns {Object} Transformed course document ready for interactivecourses
 */
function transformCourse(course) {
  const assessmentQuestions = [];
  const modules = course.modules || [];

  // Compute per-section seat time: total CE minutes divided evenly across sections.
  // 1 CE hour = 60 minutes. Round up to nearest whole minute.
  const totalMinutes = (course.ceHours || 1) * 60;
  const minutesPerSection = Math.round(totalMinutes / (modules.length || 1));

  const sections = modules.map((module, idx) => ({
    title: module.title,
    order: module.order ?? (idx + 1),
    estimatedTime: minutesPerSection,   // ACEP-required seat time per section
    contentBlocks: processContentBlocks(module.contentBlocks || [], assessmentQuestions)
  }));

  // Destructure out modules and the old assessment shape; spread everything else
  const { modules: _modules, assessment: originalAssessment, ...rest } = course;

  return {
    ...rest,
    sections,
    // Course-level delivery rules
    minimumTimeMinutes: totalMinutes,   // total seat-time enforcement (ceHours × 60)
    maxAttempts: 999,                   // unlimited exam retries (matches admin-editor "Unlimited")
    assessment: {
      passingScore:    originalAssessment?.passingScore ?? 80,
      passThreshold:   0.8,
      attemptsAllowed: 999,             // unlimited (route reads this field)
      maxAttempts:     999,             // belt-and-suspenders for any legacy reader
      shuffleQuestions: true,
      questions:       assessmentQuestions
    },
    status: 'draft'   // Safety: review before publishing
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 3 — Upsert into interactivecourses using native MongoDB driver
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Delete-then-insert upsert keyed on slug.
 */
async function upsert(collection, doc) {
  await collection.deleteOne({ slug: doc.slug });
  await collection.insertOne(doc);
}

async function seedAll() {
  const originalCourses = loadOriginalCourses();
  const { CR610, CR611, CR612, CR613, CR614 } = originalCourses;
  const courses = [CR610, CR611, CR612, CR613, CR614];

  await mongoose.connect(MONGODB_URI);
  console.log('✔ Connected to MongoDB\n');

  // Use native MongoDB driver via mongoose.connection.db
  const db = mongoose.connection.db;
  const collection = db.collection('interactivecourses');

  console.log('═'.repeat(65));
  console.log('  GERIATRIC SERIES → interactivecourses (migration)');
  console.log('  CR-610 through CR-614 | NBCC ACEP Provider #7760');
  console.log('  GA Integrated Therapeutic Perspectives LLC');
  console.log('═'.repeat(65) + '\n');

  let passed = 0;

  for (const course of courses) {
    try {
      const transformed = transformCourse(course);
      await upsert(collection, transformed);

      const sectionCount   = transformed.sections.length;
      const examQCount     = transformed.assessment.questions.length;
      const kcCount        = transformed.sections.reduce((n, s) =>
        n + s.contentBlocks.filter(b => b.type === 'multipleChoice').length, 0);

      console.log(`✅ ${course.courseCode}  UPSERTED  |  ${course.title}`);
      console.log(`   ${course.ceHours} CE hrs  |  ${sectionCount} sections (${transformed.minimumTimeMinutes} min total)  |  ${kcCount} KC Qs  |  ${examQCount} exam Qs  |  attempts: unlimited  |  status: draft`);
      passed++;
    } catch (err) {
      console.error(`❌ ${course.courseCode} FAILED:`, err.message);
    }
  }

  await mongoose.disconnect();

  console.log('\n' + '═'.repeat(65));
  console.log(`  ${passed}/5 courses seeded successfully into interactivecourses`);
  console.log('  All saved as status: draft — review before publishing');
  console.log('═'.repeat(65) + '\n');

  if (passed < 5) process.exit(1);
}

seedAll().catch(err => { console.error('❌ Fatal error:', err); process.exit(1); });
