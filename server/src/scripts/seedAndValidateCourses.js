/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */

/**
 * seedAndValidateCourses.js
 *
 * Comprehensive script that:
 * 1. Connects to MongoDB
 * 2. Imports all course definitions from seedCourses.js and seedStandardCourses.js
 * 3. Checks which courses exist in the database
 * 4. Seeds any that are missing
 * 5. Validates ALL courses for data integrity issues
 *
 * Run with: node src/scripts/seedAndValidateCourses.js
 * Dry run:  node src/scripts/seedAndValidateCourses.js --dry-run
 * Validate: node src/scripts/seedAndValidateCourses.js --validate-only
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import Course from '../models/Course.js';
import { freeCourses } from '../data/seedCourses.js';
import { standardCourses } from '../data/seedStandardCourses.js';

// ============================================
// CONFIG
// ============================================

const DRY_RUN = process.argv.includes('--dry-run');
const VALIDATE_ONLY = process.argv.includes('--validate-only');
const FIX = process.argv.includes('--fix');

// All courses that should exist from the two canonical seed files
const ALL_SEED_COURSES = [
  ...freeCourses.map(c => ({ ...c, _source: 'seedCourses.js (free)' })),
  ...standardCourses.map(c => ({ ...c, _source: 'seedStandardCourses.js (standard)' })),
];

// ============================================
// WORD COUNT UTILITIES
// ============================================

const WORDS_PER_CE_HOUR = 6000; // ACEP requirement

/**
 * Strip HTML tags and count words in a string
 */
function countWords(text) {
  if (!text || typeof text !== 'string') return 0;
  // Strip HTML tags
  const stripped = text.replace(/<[^>]*>/g, ' ');
  // Split on whitespace and count non-empty tokens
  return stripped.split(/\s+/).filter(w => w.length > 0).length;
}

/**
 * Count total words across all course content (modules/lessons)
 */
function countCourseWords(course) {
  let total = 0;

  // Description words
  total += countWords(course.description);

  // Module and lesson content
  if (course.modules && Array.isArray(course.modules)) {
    for (const mod of course.modules) {
      total += countWords(mod.description);
      if (mod.lessons && Array.isArray(mod.lessons)) {
        for (const lesson of mod.lessons) {
          total += countWords(lesson.content);
          total += countWords(lesson.transcript);

          // Quiz question text also counts
          if (lesson.questions && Array.isArray(lesson.questions)) {
            for (const q of lesson.questions) {
              total += countWords(q.question);
              total += countWords(q.explanation);
              if (q.options && Array.isArray(q.options)) {
                for (const opt of q.options) {
                  total += countWords(typeof opt === 'string' ? opt : opt.text);
                }
              }
            }
          }

          // Accordion items
          if (lesson.accordionItems && Array.isArray(lesson.accordionItems)) {
            for (const item of lesson.accordionItems) {
              total += countWords(item.title);
              total += countWords(item.content);
            }
          }

          // Matching pairs
          if (lesson.matchingPairs && Array.isArray(lesson.matchingPairs)) {
            for (const pair of lesson.matchingPairs) {
              total += countWords(pair.term);
              total += countWords(pair.definition);
            }
          }
        }
      }

      // Module-level quiz questions
      if (mod.quizQuestions && Array.isArray(mod.quizQuestions)) {
        for (const q of mod.quizQuestions) {
          total += countWords(q.question);
          total += countWords(q.explanation);
        }
      }
    }
  }

  // Assessment questions
  if (course.assessment?.questions && Array.isArray(course.assessment.questions)) {
    for (const q of course.assessment.questions) {
      total += countWords(q.question);
      total += countWords(q.explanation);
      if (q.options && Array.isArray(q.options)) {
        for (const opt of q.options) {
          total += countWords(typeof opt === 'string' ? opt : opt.text);
        }
      }
    }
  }

  return total;
}

// ============================================
// VALIDATION RULES
// ============================================

function validateCourse(course) {
  const issues = [];
  const warnings = [];
  const slug = course.slug;

  // Required fields
  if (!course.title || course.title.trim() === '') {
    issues.push('Missing title');
  }
  if (!course.description || course.description.trim() === '') {
    issues.push('Missing description');
  }
  if (!course.slug || course.slug.trim() === '') {
    issues.push('Missing slug');
  }

  // Status
  if (!course.status || course.status === 'draft') {
    warnings.push(`Status is "${course.status || 'undefined'}" (not published)`);
  }

  // CEU validation
  if (course.ceuEligible) {
    if (!course.ceuHours || course.ceuHours <= 0) {
      issues.push('CEU eligible but ceuHours is missing or zero');
    }
    if (!course.ceuCategories || course.ceuCategories.length === 0) {
      warnings.push('CEU eligible but no ceuCategories defined');
    }
    if (!course.approvalNumber && (!course.approvals || course.approvals.length === 0)) {
      issues.push('CEU eligible but no approval number or approvals array');
    }

    // Word count check (ACEP: 6,000 words per CE hour)
    const wordCount = countCourseWords(course);
    const requiredWords = (course.ceuHours || 0) * WORDS_PER_CE_HOUR;
    if (requiredWords > 0) {
      const pct = Math.round((wordCount / requiredWords) * 100);
      if (wordCount < requiredWords * 0.5) {
        issues.push(`Word count CRITICAL: ${wordCount.toLocaleString()} words (need ${requiredWords.toLocaleString()}, at ${pct}% of ACEP requirement)`);
      } else if (wordCount < requiredWords) {
        warnings.push(`Word count LOW: ${wordCount.toLocaleString()} words (need ${requiredWords.toLocaleString()}, at ${pct}% of ACEP requirement)`);
      }
    }
  }

  // Modules and lessons
  if (!course.modules || course.modules.length === 0) {
    issues.push('No modules defined');
  } else {
    let totalLessons = 0;
    let hasQuiz = false;
    let totalQuizQuestions = 0;
    let moduleOrders = [];

    for (const mod of course.modules) {
      if (!mod.title) {
        issues.push(`Module at order ${mod.order} has no title`);
      }
      if (mod.order === undefined || mod.order === null) {
        issues.push(`Module "${mod.title || '?'}" has no order`);
      } else {
        moduleOrders.push(mod.order);
      }

      if (!mod.lessons || mod.lessons.length === 0) {
        warnings.push(`Module "${mod.title || '?'}" has no lessons`);
      } else {
        let lessonOrders = [];
        for (const lesson of mod.lessons) {
          totalLessons++;
          if (!lesson.title) {
            issues.push(`Lesson at order ${lesson.order} in module "${mod.title}" has no title`);
          }
          if (lesson.order === undefined || lesson.order === null) {
            issues.push(`Lesson "${lesson.title || '?'}" has no order`);
          } else {
            lessonOrders.push(lesson.order);
          }

          // Check quiz lessons
          if (lesson.type === 'quiz') {
            hasQuiz = true;
            if (!lesson.questions || lesson.questions.length === 0) {
              issues.push(`Quiz lesson "${lesson.title}" has no questions`);
            } else {
              totalQuizQuestions += lesson.questions.length;

              // Validate each question
              for (let i = 0; i < lesson.questions.length; i++) {
                const q = lesson.questions[i];
                if (!q.question || q.question.trim() === '') {
                  issues.push(`Quiz "${lesson.title}" question ${i + 1} has no text`);
                }
                if (!q.options || q.options.length < 2) {
                  issues.push(`Quiz "${lesson.title}" question ${i + 1} has fewer than 2 options`);
                }
                // Check correct answer exists
                if (q.correctAnswer === undefined && q.correctAnswer === null) {
                  const hasCorrectOption = q.options?.some(o => o.isCorrect);
                  if (!hasCorrectOption) {
                    issues.push(`Quiz "${lesson.title}" question ${i + 1} has no correct answer`);
                  }
                }
              }
            }
          }

          // Video lessons should have a URL
          if (lesson.type === 'video' && !lesson.videoUrl) {
            warnings.push(`Video lesson "${lesson.title}" has no videoUrl`);
          }
        }

        // Check for duplicate lesson orders
        const dupLessonOrders = lessonOrders.filter((o, i) => lessonOrders.indexOf(o) !== i);
        if (dupLessonOrders.length > 0) {
          warnings.push(`Module "${mod.title}" has duplicate lesson orders: ${dupLessonOrders.join(', ')}`);
        }
      }
    }

    // Check for duplicate module orders
    const dupModOrders = moduleOrders.filter((o, i) => moduleOrders.indexOf(o) !== i);
    if (dupModOrders.length > 0) {
      warnings.push(`Duplicate module orders: ${dupModOrders.join(', ')}`);
    }

    if (totalLessons === 0) {
      issues.push('No lessons across all modules');
    }

    if (!hasQuiz && course.ceuEligible) {
      warnings.push('CEU-eligible course has no quiz assessment');
    }

    if (hasQuiz && totalQuizQuestions < 5 && course.ceuEligible) {
      warnings.push(`Only ${totalQuizQuestions} quiz questions (recommend 10+ for CEU courses)`);
    }
  }

  // Objectives
  if (!course.objectives || course.objectives.length === 0) {
    warnings.push('No learning objectives defined');
  } else if (course.objectives.length < 3) {
    warnings.push(`Only ${course.objectives.length} objectives (recommend 3+)`);
  }

  // References (important for NBCC compliance)
  if (course.ceuEligible && (!course.references || course.references.length === 0)) {
    warnings.push('CEU-eligible course has no references (NBCC requires references)');
  }

  // Presenter info
  if (course.ceuEligible && !course.presenter?.name) {
    warnings.push('CEU-eligible course has no presenter info');
  }

  // Price validation
  if (course.accessType === 'paid' && (!course.price || course.price <= 0)) {
    issues.push('Paid course but price is missing or zero');
  }
  if (course.accessType === 'free' && course.price > 0) {
    warnings.push('Free course but price > 0');
  }

  return { slug, issues, warnings };
}

// ============================================
// FIXABLE ISSUES
// ============================================

async function fixCourseIssues(dbCourse) {
  const fixes = [];

  // Fix empty descriptions
  if (!dbCourse.description || dbCourse.description.trim() === '') {
    const desc = `This continuing education course provides an in-depth exploration of ${dbCourse.title}. Designed for licensed mental health professionals, this ${dbCourse.ceuHours || 3}-hour course meets NBCC ACEP standards and covers evidence-based approaches, clinical applications, and ethical considerations.`;
    await Course.updateOne({ _id: dbCourse._id }, { $set: { description: desc } });
    fixes.push('Fixed empty description');
  }

  // Fix bad quiz question types
  const typeFixMap = {
    'multiple-choice': 'multiple_choice',
    'multiple-select': 'multiple_select',
    'multi-select': 'multiple_select',
  };

  for (const [badType, goodType] of Object.entries(typeFixMap)) {
    const result = await Course.updateMany(
      { _id: dbCourse._id, 'modules.lessons.questions.type': badType },
      { $set: { 'modules.$[].lessons.$[].questions.$[q].type': goodType } },
      { arrayFilters: [{ 'q.type': badType }] }
    );
    if (result.modifiedCount > 0) {
      fixes.push(`Fixed question type: '${badType}' -> '${goodType}'`);
    }
  }

  // Fix missing status (set to published)
  if (!dbCourse.status) {
    await Course.updateOne({ _id: dbCourse._id }, { $set: { status: 'published', publishedAt: new Date() } });
    fixes.push('Set status to published');
  }

  return fixes;
}

// ============================================
// MAIN
// ============================================

async function main() {
  console.log('='.repeat(60));
  console.log('  CounselorReady - Course Seed & Validation');
  console.log('='.repeat(60));

  if (DRY_RUN) console.log('  MODE: Dry Run (no changes will be made)\n');
  else if (VALIDATE_ONLY) console.log('  MODE: Validate Only\n');
  else if (FIX) console.log('  MODE: Seed + Validate + Fix\n');
  else console.log('  MODE: Seed + Validate\n');

  // Connect
  if (!process.env.MONGODB_URI) {
    console.error('ERROR: MONGODB_URI not found in environment. Check your .env file.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB\n');

  // ---- PHASE 1: SEED MISSING COURSES ----
  if (!VALIDATE_ONLY) {
    console.log('-'.repeat(60));
    console.log('PHASE 1: Seeding Missing Courses');
    console.log('-'.repeat(60));

    let seeded = 0;
    let skipped = 0;
    let errors = 0;

    for (const courseData of ALL_SEED_COURSES) {
      const { _source, ...data } = courseData;

      try {
        const existing = await Course.findOne({ slug: data.slug });

        if (existing) {
          console.log(`  SKIP  ${data.slug} (already exists)`);
          skipped++;
          continue;
        }

        if (DRY_RUN) {
          console.log(`  WOULD SEED  ${data.slug} [${_source}]`);
          seeded++;
          continue;
        }

        await Course.create(data);
        console.log(`  SEEDED  ${data.slug} [${_source}]`);
        seeded++;
      } catch (err) {
        console.error(`  ERROR  ${data.slug}: ${err.message}`);
        errors++;
      }
    }

    console.log(`\n  Results: ${seeded} seeded, ${skipped} skipped, ${errors} errors\n`);
  }

  // ---- PHASE 2: VALIDATE ALL COURSES IN DATABASE ----
  console.log('-'.repeat(60));
  console.log('PHASE 2: Validating All Courses in Database');
  console.log('-'.repeat(60));

  const allDbCourses = await Course.find({}).lean();
  console.log(`\n  Total courses in database: ${allDbCourses.length}\n`);

  // Track which seed slugs exist in DB
  const seedSlugs = ALL_SEED_COURSES.map(c => c.slug);
  const dbSlugs = allDbCourses.map(c => c.slug);

  // Check for seed courses NOT in DB
  const missingSeedCourses = seedSlugs.filter(s => !dbSlugs.includes(s));
  if (missingSeedCourses.length > 0) {
    console.log('  MISSING from database (defined in seed files but not found):');
    for (const slug of missingSeedCourses) {
      console.log(`    - ${slug}`);
    }
    console.log();
  }

  // Validate each course
  let totalIssues = 0;
  let totalWarnings = 0;
  let coursesWithIssues = 0;
  let coursesClean = 0;

  const results = [];

  for (const course of allDbCourses) {
    const result = validateCourse(course);
    results.push(result);

    if (result.issues.length > 0 || result.warnings.length > 0) {
      coursesWithIssues++;
      totalIssues += result.issues.length;
      totalWarnings += result.warnings.length;
    } else {
      coursesClean++;
    }
  }

  // Print results grouped by severity
  const coursesWithErrors = results.filter(r => r.issues.length > 0);
  const coursesWithWarningsOnly = results.filter(r => r.issues.length === 0 && r.warnings.length > 0);

  if (coursesWithErrors.length > 0) {
    console.log('  COURSES WITH ERRORS (must fix):');
    for (const r of coursesWithErrors) {
      console.log(`\n    ${r.slug}`);
      for (const issue of r.issues) {
        console.log(`      [ERROR] ${issue}`);
      }
      for (const warn of r.warnings) {
        console.log(`      [WARN]  ${warn}`);
      }
    }
    console.log();
  }

  if (coursesWithWarningsOnly.length > 0) {
    console.log('  COURSES WITH WARNINGS (recommended to fix):');
    for (const r of coursesWithWarningsOnly) {
      console.log(`\n    ${r.slug}`);
      for (const warn of r.warnings) {
        console.log(`      [WARN]  ${warn}`);
      }
    }
    console.log();
  }

  // ---- PHASE 3: AUTO-FIX (if --fix flag) ----
  if (FIX && !DRY_RUN) {
    console.log('-'.repeat(60));
    console.log('PHASE 3: Auto-Fixing Fixable Issues');
    console.log('-'.repeat(60));

    let totalFixes = 0;
    for (const course of allDbCourses) {
      const fixes = await fixCourseIssues(course);
      if (fixes.length > 0) {
        console.log(`\n  ${course.slug}:`);
        for (const fix of fixes) {
          console.log(`    FIXED: ${fix}`);
          totalFixes++;
        }
      }
    }
    console.log(`\n  Total fixes applied: ${totalFixes}\n`);
  }

  // ---- WORD COUNT REPORT ----
  console.log('-'.repeat(60));
  console.log('WORD COUNT REPORT (ACEP: 6,000 words per CE hour)');
  console.log('-'.repeat(60));

  const ceuCoursesForWC = allDbCourses.filter(c => c.ceuEligible && c.ceuHours > 0);
  if (ceuCoursesForWC.length > 0) {
    console.log();
    console.log('  ' + 'Course'.padEnd(50) + 'CE Hrs'.padEnd(8) + 'Words'.padEnd(10) + 'Required'.padEnd(10) + 'Status');
    console.log('  ' + '-'.repeat(88));

    for (const course of ceuCoursesForWC) {
      const wc = countCourseWords(course);
      const required = course.ceuHours * WORDS_PER_CE_HOUR;
      const pct = Math.round((wc / required) * 100);
      const status = wc >= required ? 'OK' : wc >= required * 0.5 ? `LOW (${pct}%)` : `CRITICAL (${pct}%)`;
      const title = (course.title || course.slug).substring(0, 48);
      console.log(`  ${title.padEnd(50)}${String(course.ceuHours).padEnd(8)}${wc.toLocaleString().padEnd(10)}${required.toLocaleString().padEnd(10)}${status}`);
    }
    console.log();
  }

  // ---- SUMMARY ----
  console.log('='.repeat(60));
  console.log('  SUMMARY');
  console.log('='.repeat(60));
  console.log(`  Total courses in database:   ${allDbCourses.length}`);
  console.log(`  Seed courses expected:       ${seedSlugs.length}`);
  console.log(`  Missing from seed files:     ${missingSeedCourses.length}`);
  console.log(`  Courses passing validation:  ${coursesClean}`);
  console.log(`  Courses with errors:         ${coursesWithErrors.length}`);
  console.log(`  Courses with warnings only:  ${coursesWithWarningsOnly.length}`);
  console.log(`  Total errors:                ${totalIssues}`);
  console.log(`  Total warnings:              ${totalWarnings}`);

  // CEU summary
  const ceuCourses = allDbCourses.filter(c => c.ceuEligible);
  const totalCeuHours = ceuCourses.reduce((sum, c) => sum + (c.ceuHours || 0), 0);
  const publishedCourses = allDbCourses.filter(c => c.status === 'published');
  const freeCourseCount = allDbCourses.filter(c => c.accessType === 'free').length;
  const paidCourseCount = allDbCourses.filter(c => c.accessType === 'paid').length;
  const subCourseCount = allDbCourses.filter(c => c.accessType === 'subscription').length;

  // Word count totals
  const totalWordCount = allDbCourses.reduce((sum, c) => sum + countCourseWords(c), 0);
  const totalRequiredWords = ceuCourses.reduce((sum, c) => sum + ((c.ceuHours || 0) * WORDS_PER_CE_HOUR), 0);

  console.log();
  console.log(`  Published courses:           ${publishedCourses.length}`);
  console.log(`  CEU-eligible courses:        ${ceuCourses.length}`);
  console.log(`  Total CE hours available:    ${totalCeuHours}`);
  console.log(`  Free / Paid / Subscription:  ${freeCourseCount} / ${paidCourseCount} / ${subCourseCount}`);
  console.log(`  Total word count:            ${totalWordCount.toLocaleString()}`);
  console.log(`  Total words required (ACEP): ${totalRequiredWords.toLocaleString()}`);
  console.log('='.repeat(60));

  await mongoose.connection.close();
  console.log('\nDone. Database connection closed.');

  // Exit with error code if there are issues
  if (coursesWithErrors.length > 0 || missingSeedCourses.length > 0) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
