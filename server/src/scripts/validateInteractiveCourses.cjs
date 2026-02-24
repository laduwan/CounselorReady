#!/usr/bin/env node
/**
 * validateInteractiveCourses.js
 * ═══════════════════════════════════════════════════════════════
 * Comprehensive validator for the `interactivecourses` collection.
 * 
 * WHAT THIS FIXES:
 *   The old validateCourses.js targeted the wrong collection (`courses`)
 *   and only counted words from text blocks and accordion content,
 *   completely missing questions, options, explanations, matching
 *   pairs, reflections, and resource titles. This caused word counts
 *   to appear 20-40% lower than actual content.
 *
 * WHAT THIS COUNTS (everything):
 *   ✅ text block .content (HTML stripped)
 *   ✅ accordion .accordionItems[].content
 *   ✅ multipleChoice .question + .options[].text + .explanation
 *   ✅ multiSelect .question + .options[].text + .explanation
 *   ✅ matching .matchingInstructions + .matchingPairs[].term + .definition
 *   ✅ reflection .question
 *   ✅ resources .resources[].title
 *   ✅ sectionDivider .title + .subtitle
 *   ✅ imageText .textContent
 *   ✅ lessons[].content
 *   ✅ assessment.questions (same depth as above)
 *
 * WHAT THIS VALIDATES:
 *   ✅ Word count vs. ACEP target (6,000 words/CE hour)
 *   ✅ Module structure (title, contentBlocks exist)
 *   ✅ Lessons array present on each module (admin UI requirement)
 *   ✅ Knowledge checks per module (ACEP: 3-5 per module)
 *   ✅ Assessment exists with 15+ questions, 80% pass, ≤3 attempts
 *   ✅ Assessment question format ({text, isCorrect} objects)
 *   ✅ Accessibility props on blocks
 *   ✅ References present
 *   ✅ Interactive block diversity (not just walls of text)
 *
 * Run:      node src/scripts/validateInteractiveCourses.js
 * Requires: MONGODB_URI in environment
 * ═══════════════════════════════════════════════════════════════
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('❌ MONGODB_URI not found'); process.exit(1); }

// ─── Configuration ───────────────────────────────────────────
const WORDS_PER_CE_HOUR = 6000;
const MIN_ASSESSMENT_QUESTIONS = 15;
const REQUIRED_PASS_SCORE = 80;
const MAX_ATTEMPTS = 3;
const MIN_KNOWLEDGE_CHECKS_PER_MODULE = 3;
const PASSING_WORD_PCT = 70; // 70% of target = minimum threshold

// ─── Word Counting ───────────────────────────────────────────
// Strips HTML tags and counts all remaining words
function stripAndCount(text) {
  if (!text) return 0;
  return text
    .replace(/<[^>]*>/g, ' ')      // strip HTML
    .replace(/&[a-z]+;/gi, ' ')    // strip HTML entities
    .replace(/\s+/g, ' ')          // normalize whitespace
    .trim()
    .split(' ')
    .filter(w => w.length > 0)
    .length;
}

// Count ALL words in a single content block — misses nothing
function countBlockWords(block) {
  let words = 0;

  // Type label (not counted — metadata)

  // Text content (text, imageText blocks)
  words += stripAndCount(block.content);
  words += stripAndCount(block.textContent);

  // Section divider title/subtitle
  if (block.type === 'sectionDivider') {
    words += stripAndCount(block.title);
    words += stripAndCount(block.subtitle);
  }

  // Accordion items
  if (block.accordionItems) {
    for (const item of block.accordionItems) {
      words += stripAndCount(item.title);
      words += stripAndCount(item.content);
    }
  }

  // Questions (multipleChoice, multiSelect)
  words += stripAndCount(block.question);
  words += stripAndCount(block.explanation);
  if (block.options) {
    for (const opt of block.options) {
      words += stripAndCount(typeof opt === 'string' ? opt : opt.text);
    }
  }

  // Matching pairs
  words += stripAndCount(block.matchingInstructions);
  if (block.matchingPairs) {
    for (const pair of block.matchingPairs) {
      words += stripAndCount(pair.term);
      words += stripAndCount(pair.definition);
    }
  }

  // Resources
  if (block.resources) {
    for (const r of block.resources) {
      words += stripAndCount(r.title);
    }
  }

  return words;
}

// Count words in assessment questions (same structure as block questions)
function countAssessmentWords(assessment) {
  if (!assessment || !assessment.questions) return 0;
  let words = 0;
  for (const q of assessment.questions) {
    words += stripAndCount(q.question);
    words += stripAndCount(q.explanation);
    if (q.options) {
      for (const opt of q.options) {
        words += stripAndCount(typeof opt === 'string' ? opt : opt.text);
      }
    }
  }
  return words;
}

// Count words in a module
function countModuleWords(mod) {
  let words = 0;

  // Content blocks
  for (const block of (mod.contentBlocks || [])) {
    words += countBlockWords(block);
  }

  // Lessons (for admin UI compatibility — may have content too)
  for (const lesson of (mod.lessons || [])) {
    words += stripAndCount(lesson.content);
    words += stripAndCount(lesson.textContent);
  }

  return words;
}


// ─── Validation Logic ────────────────────────────────────────

function validateCourse(course) {
  const issues = [];    // ❌ must fix
  const warnings = [];  // ⚠️ should fix
  const info = [];      // ℹ️ informational

  const modules = course.modules || course.sections || [];
  const ceHours = course.ceHours || course.credits || 1;
  const targetWords = ceHours * WORDS_PER_CE_HOUR;

  // ─── Word Count ──────────────────────────────────────────
  let totalWords = 0;
  const moduleBreakdown = [];

  for (const mod of modules) {
    const modWords = countModuleWords(mod);
    totalWords += modWords;

    const blocks = (mod.contentBlocks || []);
    const blockTypes = {};
    for (const b of blocks) {
      blockTypes[b.type] = (blockTypes[b.type] || 0) + 1;
    }

    const knowledgeChecks = (blockTypes.multipleChoice || 0) + (blockTypes.multiSelect || 0);
    const hasAccessibility = blocks.some(b => b.accessibility);

    moduleBreakdown.push({
      title: mod.title,
      words: modWords,
      blocks: blocks.length,
      blockTypes,
      knowledgeChecks,
      hasLessons: (mod.lessons || []).length > 0,
      hasAccessibility
    });
  }

  // Assessment words (counted separately, not toward ACEP target)
  const assessmentWords = countAssessmentWords(course.assessment);

  const wordPct = Math.round((totalWords / targetWords) * 100);
  if (wordPct < PASSING_WORD_PCT) {
    issues.push(`Word count FAIL: ${totalWords.toLocaleString()} / ${targetWords.toLocaleString()} (${wordPct}%) — need ${PASSING_WORD_PCT}%+`);
  } else if (wordPct < 100) {
    warnings.push(`Word count below target: ${totalWords.toLocaleString()} / ${targetWords.toLocaleString()} (${wordPct}%)`);
  }

  // ─── Module Structure ────────────────────────────────────
  if (modules.length === 0) {
    issues.push('No modules found');
  }

  for (const mb of moduleBreakdown) {
    // Lessons array (admin UI needs this)
    if (!mb.hasLessons) {
      warnings.push(`Module "${mb.title}" has no lessons[] array — admin UI won't show content`);
    }

    // Knowledge checks
    if (mb.knowledgeChecks < MIN_KNOWLEDGE_CHECKS_PER_MODULE) {
      warnings.push(`Module "${mb.title}" has ${mb.knowledgeChecks} knowledge check(s) — ACEP recommends ${MIN_KNOWLEDGE_CHECKS_PER_MODULE}-5`);
    }

    // Block diversity
    const types = Object.keys(mb.blockTypes);
    if (types.length <= 2) {
      warnings.push(`Module "${mb.title}" only uses ${types.join(', ')} — consider adding interactive elements`);
    }

    // Accessibility
    if (!mb.hasAccessibility) {
      info.push(`Module "${mb.title}" has no accessibility props on blocks`);
    }

    // Minimum content
    if (mb.words < 500) {
      issues.push(`Module "${mb.title}" has only ${mb.words} words — likely a stub`);
    }
  }

  // ─── Assessment ──────────────────────────────────────────
  const assessment = course.assessment;
  if (!assessment) {
    issues.push('No assessment found');
  } else {
    const qCount = (assessment.questions || []).length;
    if (qCount < MIN_ASSESSMENT_QUESTIONS) {
      issues.push(`Assessment has ${qCount} questions — need ${MIN_ASSESSMENT_QUESTIONS}+`);
    }
    if (assessment.passingScore !== REQUIRED_PASS_SCORE) {
      warnings.push(`Assessment passingScore is ${assessment.passingScore}, expected ${REQUIRED_PASS_SCORE}`);
    }
    if (assessment.maxAttempts > MAX_ATTEMPTS) {
      warnings.push(`Assessment maxAttempts is ${assessment.maxAttempts}, expected ≤${MAX_ATTEMPTS}`);
    }

    // Validate question format
    for (const [i, q] of (assessment.questions || []).entries()) {
      if (!q.question) issues.push(`Assessment Q${i + 1}: missing question text`);
      if (!q.options || q.options.length < 2) issues.push(`Assessment Q${i + 1}: needs ≥2 options`);
      if (q.options) {
        const hasCorrect = q.options.some(o => o.isCorrect === true);
        if (!hasCorrect) issues.push(`Assessment Q${i + 1}: no correct answer marked`);
        const correctCount = q.options.filter(o => o.isCorrect === true).length;
        if (correctCount > 1) warnings.push(`Assessment Q${i + 1}: has ${correctCount} correct answers`);
      }
      if (!q.explanation) info.push(`Assessment Q${i + 1}: no explanation provided`);
    }
  }

  // ─── References ──────────────────────────────────────────
  const refs = course.references || [];
  if (refs.length < 3) {
    warnings.push(`Only ${refs.length} references — recommend 10+ for ACEP compliance`);
  }

  // ─── Metadata ────────────────────────────────────────────
  if (!course.objectives || course.objectives.length < 3) {
    warnings.push(`Only ${(course.objectives || []).length} learning objectives — ACEP requires 3+`);
  }
  if (!course.targetAudience || course.targetAudience.length === 0) {
    warnings.push('No target audience specified');
  }

  return {
    title: course.title,
    slug: course.slug,
    code: course.code,
    ceHours,
    status: course.status,
    isPublished: course.isPublished,
    totalWords,
    assessmentWords,
    targetWords,
    wordPct,
    moduleCount: modules.length,
    moduleBreakdown,
    assessmentQuestions: (assessment?.questions || []).length,
    referenceCount: refs.length,
    issues,
    warnings,
    info
  };
}


// ─── Main ────────────────────────────────────────────────────

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB\n');

  const collection = mongoose.connection.db.collection('interactivecourses');
  const courses = await collection.find({}).sort({ ceHours: -1, title: 1 }).toArray();

  console.log('═══════════════════════════════════════════════════════');
  console.log('  CounselorReady Interactive Course Validation Report');
  console.log('  Collection: interactivecourses');
  console.log(`  Courses found: ${courses.length}`);
  console.log(`  Date: ${new Date().toISOString().split('T')[0]}`);
  console.log('═══════════════════════════════════════════════════════\n');

  let totalIssues = 0;
  let totalWarnings = 0;
  let passCount = 0;
  let failCount = 0;

  for (const course of courses) {
    const r = validateCourse(course);

    const status = r.issues.length === 0 ? '✅ PASS' : '❌ FAIL';
    if (r.issues.length === 0) passCount++; else failCount++;
    totalIssues += r.issues.length;
    totalWarnings += r.warnings.length;

    console.log(`${status}  ${r.title}`);
    console.log(`  Code: ${r.code || 'n/a'} | CE: ${r.ceHours}hrs | Status: ${r.status} | Published: ${r.isPublished}`);
    console.log(`  Words: ${r.totalWords.toLocaleString()} / ${r.targetWords.toLocaleString()} (${r.wordPct}%) + ${r.assessmentWords.toLocaleString()} assessment`);
    console.log(`  Modules: ${r.moduleCount} | Assessment: ${r.assessmentQuestions} questions | Refs: ${r.referenceCount}`);

    // Per-module breakdown
    const perModuleTarget = Math.round(r.targetWords / Math.max(r.moduleCount, 1));
    for (const mb of r.moduleBreakdown) {
      const modPct = Math.round((mb.words / perModuleTarget) * 100);
      const modStatus = mb.words >= 500 ? (modPct >= PASSING_WORD_PCT ? '✅' : '🟡') : '🔴';
      const types = Object.entries(mb.blockTypes).map(([k, v]) => `${k}:${v}`).join(', ');
      console.log(`    ${modStatus} ${mb.title}`);
      console.log(`       ${mb.words.toLocaleString()} words | ${mb.blocks} blocks (${types})${!mb.hasLessons ? ' | ⚠️ NO LESSONS' : ''}`);
    }

    // Issues
    if (r.issues.length > 0) {
      for (const issue of r.issues) console.log(`  ❌ ${issue}`);
    }
    if (r.warnings.length > 0) {
      for (const warn of r.warnings) console.log(`  ⚠️  ${warn}`);
    }

    console.log('');
  }

  // Summary
  console.log('═══════════════════════════════════════════════════════');
  console.log(`  SUMMARY: ${passCount} passed, ${failCount} failed`);
  console.log(`  Total issues: ${totalIssues} | Total warnings: ${totalWarnings}`);
  console.log('═══════════════════════════════════════════════════════\n');

  await mongoose.disconnect();
  process.exit(failCount > 0 ? 1 : 0);
}

main().catch(err => { console.error('Validator error:', err.message); process.exit(1); });
