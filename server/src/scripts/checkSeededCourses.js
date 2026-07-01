/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * checkSeededCourses.js
 *
 * Safe migration script that:
 *   1. SCANS both `courses` and `interactivecourses` collections for schema mismatches
 *   2. BACKS UP every affected document to `_migration_backups` before touching it
 *   3. VALIDATES each document against InteractiveCourse schema requirements
 *   4. REPORTS all issues (missing fields, format mismatches, data concerns)
 *   5. MIGRATES only after validation — converts modules[] → sections[] and
 *      moves documents from `courses` → `interactivecourses` where needed
 *
 * Modes:
 *   --dry-run   (default) Scan and report only — no writes
 *   --migrate            Actually perform the migration
 *
 * Run:
 *   node src/scripts/checkSeededCourses.js              # dry-run
 *   node src/scripts/checkSeededCourses.js --migrate    # live migration
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('❌ MONGODB_URI not set'); process.exit(1); }

const DRY_RUN = !process.argv.includes('--migrate');
const BACKUP_COLLECTION = '_migration_backups';

// ═══════════════════════════════════════════════════════════════
// InteractiveCourse schema requirements (from InteractiveCourse.js)
// ═══════════════════════════════════════════════════════════════
const VALID_BLOCK_TYPES = [
  'accordion', 'matching', 'multipleChoice', 'multiSelect',
  'imageText', 'sectionDivider', 'text', 'video', 'reflection', 'resources'
];

const VALID_ASSESSMENT_TYPES = ['multipleChoice', 'multiSelect', 'trueFalse'];

// Map legacy assessment question type strings to valid enum values
const ASSESSMENT_TYPE_MAP = {
  'multiple-choice': 'multipleChoice',
  'multiplechoice': 'multipleChoice',
  'multi-select': 'multiSelect',
  'multiselect': 'multiSelect',
  'true-false': 'trueFalse',
  'truefalse': 'trueFalse',
  'true/false': 'trueFalse',
};

// ═══════════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════════

function countWords(html) {
  if (!html) return 0;
  const plain = html.replace(/<[^>]+>/g, ' ').replace(/&\w+;/g, ' ').trim();
  return plain ? plain.split(/\s+/).filter(w => w.length > 0).length : 0;
}

function computeWordCount(sections) {
  let wc = 0;
  for (const s of sections) {
    for (const b of (s.contentBlocks || [])) {
      wc += countWords(b.textContent || b.content || b.html || b.body || '');
      // Count accordion content too
      if (b.accordionItems) {
        for (const item of b.accordionItems) {
          wc += countWords(item.content || '');
        }
      }
    }
  }
  return wc;
}

/** Validate a single document against InteractiveCourse schema requirements */
function validateDocument(doc, sections) {
  const warnings = [];
  const errors = [];

  // Required top-level fields
  if (!doc.title) errors.push('Missing required field: title');
  if (!doc.slug) errors.push('Missing required field: slug');
  if (!doc.description) warnings.push('Missing field: description');
  if (!doc.ceHours && doc.ceHours !== 0) warnings.push('Missing field: ceHours');

  // Sections validation
  if (!sections || sections.length === 0) {
    errors.push('No sections found (and no modules to convert)');
  } else {
    for (let i = 0; i < sections.length; i++) {
      const sec = sections[i];
      if (!sec.title) warnings.push(`Section ${i}: missing title`);
      if (sec.order === undefined && sec.order !== 0) warnings.push(`Section ${i}: missing order`);

      for (let j = 0; j < (sec.contentBlocks || []).length; j++) {
        const block = sec.contentBlocks[j];
        if (!block.type) {
          errors.push(`Section ${i}, block ${j}: missing type`);
        } else if (!VALID_BLOCK_TYPES.includes(block.type)) {
          errors.push(`Section ${i}, block ${j}: invalid type "${block.type}"`);
        }
        if (block.order === undefined && block.order !== 0) {
          warnings.push(`Section ${i}, block ${j}: missing order (will auto-assign)`);
        }

        // Knowledge check validation
        if (block.type === 'multipleChoice') {
          if (!block.question) warnings.push(`Section ${i}, block ${j}: multipleChoice missing question`);
          if (!block.options || block.options.length === 0) {
            errors.push(`Section ${i}, block ${j}: multipleChoice has no options`);
          } else {
            const correctCount = block.options.filter(o => o.isCorrect).length;
            if (correctCount === 0) errors.push(`Section ${i}, block ${j}: multipleChoice has no correct answer`);
            if (correctCount > 1) warnings.push(`Section ${i}, block ${j}: multipleChoice has ${correctCount} correct answers (expected 1)`);
          }
        }

        if (block.type === 'multiSelect') {
          if (!block.options || block.options.length === 0) {
            errors.push(`Section ${i}, block ${j}: multiSelect has no options`);
          } else {
            const correctCount = block.options.filter(o => o.isCorrect).length;
            if (correctCount === 0) errors.push(`Section ${i}, block ${j}: multiSelect has no correct answers`);
          }
        }
      }
    }
  }

  // Assessment validation
  if (doc.assessment && doc.assessment.questions) {
    for (let q = 0; q < doc.assessment.questions.length; q++) {
      const question = doc.assessment.questions[q];
      if (!question.question) warnings.push(`Assessment Q${q + 1}: missing question text`);
      if (question.type) {
        const normalizedType = ASSESSMENT_TYPE_MAP[question.type.toLowerCase()] || question.type;
        if (!VALID_ASSESSMENT_TYPES.includes(normalizedType)) {
          warnings.push(`Assessment Q${q + 1}: type "${question.type}" will be normalized to "${normalizedType || 'multipleChoice'}"`);
        }
      }
      if (!question.options || question.options.length === 0) {
        errors.push(`Assessment Q${q + 1}: no options`);
      } else {
        const correctCount = question.options.filter(o => o.isCorrect).length;
        if (correctCount === 0) errors.push(`Assessment Q${q + 1}: no correct answer`);
      }
    }
  }

  return { warnings, errors };
}

/** Convert modules[] → sections[] format */
function convertModulesToSections(modules) {
  const sections = [];

  for (let i = 0; i < modules.length; i++) {
    const mod = modules[i];
    const contentBlocks = [];
    let blockOrder = 0;

    if (mod.contentBlocks && mod.contentBlocks.length > 0) {
      // Template format: modules[].contentBlocks[]
      // Just copy blocks, ensuring order is set
      for (const block of mod.contentBlocks) {
        contentBlocks.push({
          ...block,
          order: block.order !== undefined ? block.order : blockOrder
        });
        blockOrder++;
      }
    } else if (mod.lessons && mod.lessons.length > 0) {
      // Legacy format: modules[].lessons[]
      // Add a section divider first
      contentBlocks.push({
        type: 'sectionDivider',
        order: blockOrder++,
        title: mod.title || `Module ${i + 1}`,
        sectionNumber: i + 1,
        subtitle: mod.description || ''
      });

      for (const lesson of mod.lessons) {
        if (lesson.type === 'quiz' || lesson.type === 'assessment' || lesson.type === 'timedAssessment') {
          // Convert quiz lessons to multipleChoice blocks
          for (const q of (lesson.questions || [])) {
            contentBlocks.push({
              type: 'multipleChoice',
              order: blockOrder++,
              question: q.question || q.text || '',
              options: (q.options || []).map(o => {
                if (typeof o === 'string') return { text: o, isCorrect: false };
                return { text: o.text || String(o), isCorrect: !!o.isCorrect };
              }),
              explanation: q.explanation || q.rationale || ''
            });
          }
          // Also handle standalone question on lesson
          if (lesson.question && !lesson.questions?.length) {
            contentBlocks.push({
              type: 'multipleChoice',
              order: blockOrder++,
              question: lesson.question,
              options: (lesson.options || []).map(o => {
                if (typeof o === 'string') return { text: o, isCorrect: false };
                return { text: o.text || String(o), isCorrect: !!o.isCorrect };
              }),
              explanation: lesson.explanation || ''
            });
          }
        } else if (['accordion', 'matching', 'multipleChoice', 'multiSelect',
                     'imageText', 'sectionDivider', 'reflection', 'resources'].includes(lesson.type)) {
          // Interactive block types stored as lessons — pass through
          contentBlocks.push({
            ...lesson,
            order: blockOrder++
          });
        } else {
          // Text/content lesson
          const content = lesson.content || lesson.textContent || lesson.body || '';
          if (content.trim()) {
            contentBlocks.push({
              type: 'text',
              order: blockOrder++,
              textContent: content,
              content: content
            });
          }
        }
      }
    }

    sections.push({
      title: mod.title || `Section ${i + 1}`,
      description: mod.description || '',
      order: mod.order !== undefined ? mod.order : i + 1,
      contentBlocks: contentBlocks,
      estimatedTime: mod.estimatedTime || 15
    });
  }

  return sections;
}

/** Normalize assessment question types */
function normalizeAssessment(assessment) {
  if (!assessment || !assessment.questions) return assessment;

  const normalized = { ...assessment };
  normalized.questions = assessment.questions.map(q => {
    const newQ = { ...q };
    if (newQ.type) {
      const mapped = ASSESSMENT_TYPE_MAP[newQ.type.toLowerCase()];
      if (mapped) {
        newQ.type = mapped;
      }
    } else {
      // Default to multipleChoice if no type specified
      newQ.type = 'multipleChoice';
    }
    return newQ;
  });

  // Map legacy top-level assessment fields to InteractiveCourse format
  if (assessment.passingScore !== undefined && !normalized.passThreshold) {
    normalized.passThreshold = assessment.passingScore / 100;
  }
  if (!normalized.timeLimit) normalized.timeLimit = 30;
  if (!normalized.attemptsAllowed) normalized.attemptsAllowed = 3;

  return normalized;
}

// ═══════════════════════════════════════════════════════════════
// Main
// ═══════════════════════════════════════════════════════════════

async function main() {
  console.log('\n' + '═'.repeat(70));
  console.log('  CHECK SEEDED COURSES — modules[] → sections[] Migration');
  console.log('  Mode: ' + (DRY_RUN ? '🔍 DRY RUN (no writes)' : '🚀 LIVE MIGRATION'));
  console.log('═'.repeat(70) + '\n');

  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB\n');

  const db = mongoose.connection.db;
  const coursesCol = db.collection('courses');
  const interactiveCol = db.collection('interactivecourses');
  const backupCol = db.collection(BACKUP_COLLECTION);

  // ─── Phase 1: Scan ─────────────────────────────────────────
  console.log('─'.repeat(70));
  console.log('  PHASE 1: SCAN — Finding affected documents');
  console.log('─'.repeat(70) + '\n');

  // Find documents in `courses` that have modules[] (potential interactive courses seeded to wrong collection)
  const coursesWithModules = await coursesCol.find({
    modules: { $exists: true, $not: { $size: 0 } }
  }).toArray();

  // Find documents in `interactivecourses` that have modules[] instead of sections[]
  const interactiveWithModules = await interactiveCol.find({
    $and: [
      { modules: { $exists: true, $not: { $size: 0 } } },
      { $or: [
        { sections: { $exists: false } },
        { sections: { $size: 0 } },
        // Also catch docs where sections exist but have no content blocks
        { 'sections.contentBlocks': { $exists: false } }
      ]}
    ]
  }).toArray();

  // Also find interactivecourses that have BOTH modules and sections (hybrid)
  const hybridDocs = await interactiveCol.find({
    modules: { $exists: true, $not: { $size: 0 } },
    sections: { $exists: true, $not: { $size: 0 } },
    'sections.0.contentBlocks.0': { $exists: true }
  }).toArray();

  console.log(`  📦 courses collection: ${coursesWithModules.length} documents with modules[]`);
  console.log(`  📦 interactivecourses collection: ${interactiveWithModules.length} documents with modules[] (no valid sections)`);
  console.log(`  📦 interactivecourses hybrid: ${hybridDocs.length} documents with BOTH modules[] and sections[] (already converted, will skip)`);
  console.log();

  const report = {
    scanned: 0,
    backed_up: 0,
    validated: 0,
    validation_errors: 0,
    validation_warnings: 0,
    migrated_from_courses: 0,
    migrated_in_place: 0,
    skipped: 0,
    details: []
  };

  // ─── Phase 2: Backup ───────────────────────────────────────
  console.log('─'.repeat(70));
  console.log('  PHASE 2: BACKUP — Saving originals to ' + BACKUP_COLLECTION);
  console.log('─'.repeat(70) + '\n');

  const allAffected = [
    ...coursesWithModules.map(d => ({ doc: d, source: 'courses' })),
    ...interactiveWithModules.map(d => ({ doc: d, source: 'interactivecourses' }))
  ];

  if (allAffected.length === 0) {
    console.log('  ✅ No affected documents found. Nothing to migrate.\n');
    await mongoose.disconnect();
    return;
  }

  for (const { doc, source } of allAffected) {
    report.scanned++;
    const backupEntry = {
      originalId: doc._id,
      sourceCollection: source,
      slug: doc.slug || doc.title || 'unknown',
      backedUpAt: new Date(),
      migrationScript: 'checkSeededCourses.js',
      originalDocument: doc
    };

    if (!DRY_RUN) {
      await backupCol.insertOne(backupEntry);
    }
    report.backed_up++;
    console.log(`  💾 Backed up: ${doc.slug || doc.title} (from ${source})`);
  }
  console.log(`\n  Total backed up: ${report.backed_up}\n`);

  // ─── Phase 3: Validate & Report ────────────────────────────
  console.log('─'.repeat(70));
  console.log('  PHASE 3: VALIDATE — Checking each document');
  console.log('─'.repeat(70) + '\n');

  const migrationPlan = [];

  for (const { doc, source } of allAffected) {
    const slug = doc.slug || doc.title || 'unknown';
    console.log(`  📋 ${slug} (${source})`);

    // Determine what format the modules are in
    const modules = doc.modules || [];
    const hasLessons = modules.some(m => m.lessons && m.lessons.length > 0);
    const hasContentBlocks = modules.some(m => m.contentBlocks && m.contentBlocks.length > 0);

    console.log(`     Format: ${hasLessons ? 'modules[].lessons[]' : hasContentBlocks ? 'modules[].contentBlocks[]' : 'empty modules'}`);
    console.log(`     Modules: ${modules.length}`);

    // Convert modules → sections
    const sections = convertModulesToSections(modules);
    const wordCount = computeWordCount(sections);
    const totalBlocks = sections.reduce((sum, s) => sum + (s.contentBlocks?.length || 0), 0);
    const kcCount = sections.reduce((sum, s) =>
      sum + (s.contentBlocks?.filter(b => b.type === 'multipleChoice').length || 0), 0);

    console.log(`     → ${sections.length} sections, ${totalBlocks} blocks, ${kcCount} KCs, ~${wordCount.toLocaleString()} words`);

    // Normalize assessment
    const assessment = normalizeAssessment(doc.assessment);
    const assessmentQCount = assessment?.questions?.length || 0;
    console.log(`     Assessment: ${assessmentQCount} questions`);

    // Validate
    const { warnings, errors } = validateDocument(doc, sections);
    report.validated++;

    if (errors.length > 0) {
      report.validation_errors += errors.length;
      console.log(`     ❌ ERRORS (${errors.length}):`);
      for (const e of errors) console.log(`        - ${e}`);
    }
    if (warnings.length > 0) {
      report.validation_warnings += warnings.length;
      console.log(`     ⚠️  WARNINGS (${warnings.length}):`);
      for (const w of warnings) console.log(`        - ${w}`);
    }
    if (errors.length === 0 && warnings.length === 0) {
      console.log(`     ✅ Validation passed`);
    }

    // Only block migration on errors, not warnings
    if (errors.length > 0) {
      console.log(`     ⛔ SKIPPED — has validation errors\n`);
      report.skipped++;
      report.details.push({ slug, source, status: 'skipped', errors, warnings });
      continue;
    }

    migrationPlan.push({
      doc,
      source,
      slug,
      sections,
      assessment,
      wordCount,
      warnings
    });
    report.details.push({ slug, source, status: 'ready', errors: [], warnings });
    console.log(`     ✅ Ready for migration\n`);
  }

  // ─── Phase 4: Migrate ──────────────────────────────────────
  console.log('─'.repeat(70));
  console.log('  PHASE 4: MIGRATE' + (DRY_RUN ? ' (DRY RUN — no writes)' : ''));
  console.log('─'.repeat(70) + '\n');

  if (migrationPlan.length === 0) {
    console.log('  ⚠️  No documents ready for migration.\n');
  }

  for (const { doc, source, slug, sections, assessment, wordCount } of migrationPlan) {

    // Build the update payload
    const updateFields = {
      sections,
      wordCount,
      totalContentBlocks: sections.reduce((sum, s) => sum + (s.contentBlocks?.length || 0), 0),
      totalEstimatedTime: sections.reduce((sum, s) => sum + (s.estimatedTime || 15), 0),
      updatedAt: new Date()
    };

    if (assessment) {
      updateFields.assessment = assessment;
    }

    // Ensure required InteractiveCourse fields have values
    if (!doc.status) updateFields.status = 'draft';
    if (!doc.description && doc.shortDescription) updateFields.description = doc.shortDescription;

    if (source === 'courses') {
      // Document is in wrong collection — insert into interactivecourses, remove modules key
      console.log(`  🚚 Moving: ${slug} (courses → interactivecourses)`);

      if (!DRY_RUN) {
        // Check if slug already exists in interactivecourses
        const existing = await interactiveCol.findOne({ slug: doc.slug });
        if (existing) {
          console.log(`     ⚠️  Slug "${doc.slug}" already exists in interactivecourses — updating in place`);
          await interactiveCol.updateOne({ _id: existing._id }, {
            $set: updateFields,
            $unset: { modules: '' }
          });
        } else {
          // Build new document for interactivecourses
          const newDoc = { ...doc };
          delete newDoc._id;  // Let MongoDB assign new ID
          delete newDoc.modules;
          delete newDoc.__v;
          Object.assign(newDoc, updateFields);

          await interactiveCol.insertOne(newDoc);
        }

        // Mark original in courses collection as migrated (don't delete — safer)
        await coursesCol.updateOne({ _id: doc._id }, {
          $set: { _migratedToInteractiveCourses: true, _migratedAt: new Date() }
        });
      }

      report.migrated_from_courses++;
      console.log(`     ✅ ${DRY_RUN ? 'Would move' : 'Moved'} to interactivecourses\n`);

    } else {
      // Document is already in interactivecourses — just rename modules → sections
      console.log(`  🔄 Converting: ${slug} (modules → sections in interactivecourses)`);

      if (!DRY_RUN) {
        await interactiveCol.updateOne({ _id: doc._id }, {
          $set: updateFields,
          $unset: { modules: '' }
        });
      }

      report.migrated_in_place++;
      console.log(`     ✅ ${DRY_RUN ? 'Would convert' : 'Converted'} modules → sections\n`);
    }
  }

  // ─── Phase 5: Summary Report ───────────────────────────────
  console.log('═'.repeat(70));
  console.log('  MIGRATION REPORT');
  console.log('═'.repeat(70));
  console.log(`  Mode:                ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`);
  console.log(`  Documents scanned:   ${report.scanned}`);
  console.log(`  Documents backed up: ${report.backed_up}`);
  console.log(`  Validation passed:   ${report.validated - report.skipped}`);
  console.log(`  Validation errors:   ${report.validation_errors}`);
  console.log(`  Validation warnings: ${report.validation_warnings}`);
  console.log(`  Moved (courses → interactivecourses): ${report.migrated_from_courses}`);
  console.log(`  Converted in place:  ${report.migrated_in_place}`);
  console.log(`  Skipped (errors):    ${report.skipped}`);
  console.log('─'.repeat(70));

  if (report.skipped > 0) {
    console.log('\n  ⚠️  SKIPPED DOCUMENTS (need manual review):');
    for (const d of report.details.filter(d => d.status === 'skipped')) {
      console.log(`     - ${d.slug} (${d.source}): ${d.errors.join('; ')}`);
    }
  }

  if (DRY_RUN && migrationPlan.length > 0) {
    console.log(`\n  ℹ️  This was a dry run. To perform the actual migration, run:`);
    console.log(`     node src/scripts/checkSeededCourses.js --migrate\n`);
  }

  if (!DRY_RUN && report.backed_up > 0) {
    console.log(`\n  💾 Backups saved to "${BACKUP_COLLECTION}" collection.`);
    console.log(`     To restore a document: db._migration_backups.findOne({ slug: "..." }).originalDocument\n`);
  }

  console.log('═'.repeat(70) + '\n');

  await mongoose.disconnect();
  console.log('✅ Disconnected.\n');
}

main().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
