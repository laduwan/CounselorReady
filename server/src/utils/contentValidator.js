/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * Content Preservation Validator
 *
 * Validates that pipeline processing does not strip or lose content.
 * Implements checks from GOLD_STANDARD_SPEC §18 (Pipeline Safeguards).
 *
 * Use before saving to DB to ensure ACEP compliance and content integrity.
 */

import { countCourseWords, countBlockWords } from './courseWordCount.js';

/**
 * Strip HTML tags and return plain text word count
 */
function countWords(html) {
  if (!html) return 0;
  const text = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text.split(/\s+/).filter(w => w.length > 0).length;
}

/**
 * Deprecated hex values that should never appear in content HTML
 * Per GOLD_STANDARD_SPEC §18.4
 */
const DEPRECATED_COLORS = ['#34495E', '#FAFAF8', '#FAFAF9', '#40634A'];

/**
 * Validate a course before saving to the database.
 * Returns { valid: boolean, critical: string[], warnings: string[] }
 *
 * @param {object} course - Course data object (interactivecourses format)
 * @param {object} options - { ceHours, isInteractive }
 */
export function validateCourseContent(course, options = {}) {
  const ceHours = options.ceHours || course.ceHours || course.credits || 3;
  const isInteractive = options.isInteractive !== false;
  const critical = [];
  const warnings = [];

  const requiredWords = ceHours * 6000;

  // ── WORD COUNT VALIDATION (§18.1) ──
  let totalWords = 0;
  const sectionWordCounts = [];

  if (isInteractive && course.sections) {
    for (const section of course.sections) {
      let sectionWords = 0;
      for (const block of (section.contentBlocks || [])) {
        // Per-section subtotal uses the same per-block counter as the canonical
        // total, so section warnings agree with the course total.
        sectionWords += countBlockWords(block);
      }
      sectionWordCounts.push({ title: section.title, words: sectionWords });
    }
    // Course total via canonical counter — includes section titles, final
    // assessment, and every interactive block type. Single source of truth,
    // identical to the DB pre-save hook and the publish gate.
    totalWords = countCourseWords(course);
  } else if (course.modules) {
    for (const mod of course.modules) {
      let modWords = 0;
      for (const lesson of (mod.lessons || [])) {
        if (lesson.type === 'text') {
          modWords += countWords(lesson.content || lesson.textContent || '');
        }
      }
      // Also check contentBlocks if present (hybrid format)
      for (const block of (mod.contentBlocks || [])) {
        modWords += countWords(block.textContent || block.content || '');
        if (block.accordionItems) {
          for (const item of block.accordionItems) {
            modWords += countWords(item.content);
          }
        }
      }
      sectionWordCounts.push({ title: mod.title, words: modWords });
      totalWords += modWords;
    }
  }

  if (totalWords < requiredWords) {
    critical.push(`WORD_COUNT: ${totalWords.toLocaleString()} words (need ${requiredWords.toLocaleString()}, at ${Math.round(totalWords / requiredWords * 100)}%)`);
  }

  for (const sw of sectionWordCounts) {
    if (sw.words < 2500 && sw.words > 0) {
      warnings.push(`SECTION_LOW: "${sw.title}" has ${sw.words} words (target 3,000)`);
    }
  }

  // ── INLINE STYLE VALIDATION (§18.4) ──
  const allContentHtml = collectAllContentHtml(course, isInteractive);
  if (/style\s*=\s*["']/.test(allContentHtml)) {
    // Check for color/background inline styles (layout styles from tables are OK)
    if (/style\s*=\s*["'][^"']*(?:color|background)[^"']*["']/i.test(allContentHtml)) {
      warnings.push('INLINE_STYLES: Content HTML contains inline color/background styles. Use semantic HTML — the design system handles colors.');
    }
  }

  // ── DEPRECATED COLOR VALIDATION (§18.4) ──
  for (const hex of DEPRECATED_COLORS) {
    if (allContentHtml.includes(hex)) {
      warnings.push(`DEPRECATED_COLOR: Content HTML contains deprecated color ${hex}`);
    }
  }

  // ── SECTION DIVIDER VALIDATION (§18.6) ──
  if (isInteractive && course.sections) {
    for (let i = 0; i < course.sections.length; i++) {
      const section = course.sections[i];
      const blocks = section.contentBlocks || [];
      const hasDivider = blocks.some(b => b.type === 'sectionDivider');
      if (!hasDivider) {
        warnings.push(`MISSING_DIVIDER: Section ${i + 1} ("${section.title}") has no sectionDivider block`);
      }
      const divider = blocks.find(b => b.type === 'sectionDivider');
      if (divider && !divider.subtitle) {
        warnings.push(`MISSING_SUBTITLE: Section ${i + 1} divider has no subtitle`);
      }
    }
  }

  // ── KNOWLEDGE CHECK VALIDATION (§18.5) ──
  let kcCount = 0;
  let answerDistribution = { 0: 0, 1: 0, 2: 0, 3: 0 };

  if (isInteractive && course.sections) {
    for (const section of course.sections) {
      for (const block of (section.contentBlocks || [])) {
        if (block.type === 'multipleChoice' || block.type === 'multiSelect') {
          kcCount++;
          if (block.options) {
            const correctIdx = block.options.findIndex(o => o.isCorrect);
            if (correctIdx >= 0 && correctIdx <= 3) {
              answerDistribution[correctIdx]++;
            }
            if (block.correctAnswer !== undefined && block.correctAnswer >= 0 && block.correctAnswer <= 3) {
              answerDistribution[block.correctAnswer]++;
            }
          }
        }
      }
    }
  }

  if (kcCount > 0) {
    const total = Object.values(answerDistribution).reduce((a, b) => a + b, 0);
    if (total > 0) {
      for (const [idx, count] of Object.entries(answerDistribution)) {
        if (count / total > 0.4) {
          const letter = String.fromCharCode(65 + parseInt(idx));
          warnings.push(`ANSWER_SKEW: ${Math.round(count / total * 100)}% of KC answers are "${letter}" (target ≤40%)`);
        }
      }
    }
  }

  // ── ASSESSMENT VALIDATION (§18.5, §12) ──
  const examQuestions = course.assessment?.questions?.length || 0;
  if (examQuestions === 0) {
    critical.push('NO_ASSESSMENT: No final assessment questions found');
  } else if (examQuestions < 15) {
    critical.push(`ASSESSMENT_SHORT: Final assessment has ${examQuestions} questions (need 15+)`);
  }

  // ── REFERENCE VALIDATION (§18.3) ──
  const refCount = (course.references || []).length;
  if (refCount === 0) {
    critical.push('NO_REFERENCES: No references found');
  } else if (refCount < 15 && ceHours >= 3) {
    warnings.push(`FEW_REFERENCES: ${refCount} references (recommended 15+ for ${ceHours}CE course)`);
  }

  // ── OBJECTIVES VALIDATION ──
  if (!course.objectives || course.objectives.length < 4) {
    warnings.push(`FEW_OBJECTIVES: ${(course.objectives || []).length} learning objectives (need 4+)`);
  }

  // ── EMBEDDED QUIZ TEXT DETECTION (§18.2) ──
  if (/Correct Answer:\s*[A-Da-d]/i.test(allContentHtml)) {
    critical.push('ANSWER_KEY_EXPOSED: Text content contains visible answer keys ("Correct Answer: X")');
  }

  // ── ACEP METADATA IN CONTENT (§18.2) ──
  const acepPatterns = [
    /Provider\s*#?\s*7760/i,
    /GAITP\s*LLC/i,
    /Learn\.\s*License\.\s*Lead\./i,
    /Course\s*Hours?\s*:/i,
    /Target\s*Audience\s*:/i
  ];
  for (const pattern of acepPatterns) {
    if (pattern.test(allContentHtml)) {
      warnings.push(`ACEP_METADATA_IN_CONTENT: Content blocks contain ACEP metadata that belongs in course-level fields, not in instructional text`);
      break;
    }
  }

  return {
    valid: critical.length === 0,
    critical,
    warnings,
    stats: {
      totalWords,
      requiredWords,
      wordPercent: Math.round(totalWords / requiredWords * 100),
      sectionCount: sectionWordCounts.length,
      kcCount,
      examQuestions: examQuestions,
      refCount,
      sectionWordCounts
    }
  };
}

/**
 * Collect all HTML content from a course for scanning
 */
function collectAllContentHtml(course, isInteractive) {
  let html = '';

  if (isInteractive && course.sections) {
    for (const section of course.sections) {
      for (const block of (section.contentBlocks || [])) {
        html += ' ' + (block.content || block.textContent || '');
        if (block.accordionItems) {
          for (const item of block.accordionItems) {
            html += ' ' + (item.content || '');
          }
        }
      }
    }
  } else if (course.modules) {
    for (const mod of course.modules) {
      for (const lesson of (mod.lessons || [])) {
        html += ' ' + (lesson.content || lesson.textContent || '');
      }
      for (const block of (mod.contentBlocks || [])) {
        html += ' ' + (block.content || block.textContent || '');
        if (block.accordionItems) {
          for (const item of block.accordionItems) {
            html += ' ' + (item.content || '');
          }
        }
      }
    }
  }

  return html;
}

/**
 * Compare word counts before and after pipeline processing.
 * Use this to detect content loss during reseed/migration operations.
 *
 * @param {number} beforeWords - Word count before processing
 * @param {number} afterWords - Word count after processing
 * @param {string} courseName - Course name for logging
 * @returns {{ ok: boolean, delta: number, percent: number, message: string }}
 */
export function compareWordCounts(beforeWords, afterWords, courseName = '') {
  const delta = afterWords - beforeWords;
  const percent = beforeWords > 0 ? Math.round((afterWords / beforeWords) * 100) : 0;

  if (afterWords < beforeWords * 0.9) {
    return {
      ok: false,
      delta,
      percent,
      message: `CONTENT LOSS DETECTED${courseName ? ` in "${courseName}"` : ''}: ${beforeWords.toLocaleString()} → ${afterWords.toLocaleString()} words (${delta.toLocaleString()}, ${percent}% of original). Pipeline is stripping content.`
    };
  }

  return {
    ok: true,
    delta,
    percent,
    message: `${courseName ? `"${courseName}": ` : ''}${beforeWords.toLocaleString()} → ${afterWords.toLocaleString()} words (${delta >= 0 ? '+' : ''}${delta.toLocaleString()}, ${percent}%)`
  };
}

/**
 * Log validation results to console in a structured format
 */
export function logValidationResults(result, courseName = '') {
  const header = courseName ? `VALIDATION: ${courseName}` : 'CONTENT VALIDATION';
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  ${header}`);
  console.log(`${'═'.repeat(60)}`);
  console.log(`  Words: ${result.stats.totalWords.toLocaleString()} / ${result.stats.requiredWords.toLocaleString()} (${result.stats.wordPercent}%)`);
  console.log(`  Sections: ${result.stats.sectionCount} | KCs: ${result.stats.kcCount} | Exam Qs: ${result.stats.examQuestions} | Refs: ${result.stats.refCount}`);

  if (result.critical.length > 0) {
    console.log(`\n  CRITICAL (${result.critical.length}):`);
    result.critical.forEach(c => console.log(`    ❌ ${c}`));
  }

  if (result.warnings.length > 0) {
    console.log(`\n  WARNINGS (${result.warnings.length}):`);
    result.warnings.forEach(w => console.log(`    ⚠️  ${w}`));
  }

  if (result.valid) {
    console.log('\n  ✅ PASSED — Content meets ACEP requirements');
  } else {
    console.log('\n  🔴 FAILED — Critical issues must be resolved before saving');
  }
  console.log('');
}

export default {
  validateCourseContent,
  compareWordCounts,
  logValidationResults
};
