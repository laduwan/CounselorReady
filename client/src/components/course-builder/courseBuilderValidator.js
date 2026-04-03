// ─────────────────────────────────────────────────────────────────────────────
// CounselorReady CourseBuilder — courseBuilderValidator.js
// Pure validation function. No side effects.
// Returns { errors: [], warnings: [] } for ACEP compliance gating.
// ─────────────────────────────────────────────────────────────────────────────

import { ACEP_RULES, VALIDATION_CODES as V, KC_BLOCK_TYPES } from "./constants.js";
import { countCourseWords, countSectionWords, countBlockWords, countKCsInSection } from "./utils.js";

/**
 * validateCourse(state) → { errors: [...], warnings: [...] }
 *
 * Each item: { code, severity, message, tab?, section?, fix? }
 *   code     — VALIDATION_CODES key
 *   severity — "error" | "warning"
 *   message  — human-readable description
 *   tab      — tab index to navigate to for fix (0=Info, 1=Content, 2=Assessment, 3=References, 4=ACEP)
 *   section  — optional section index (for per-section checks)
 *   fix      — { tab, section? } for jump-to-fix buttons
 */
export function validateCourse(state) {
  const errors = [];
  const warnings = [];

  // ── Metadata checks (tab 0) ──────────────────────────────────────────────

  if (!state.title?.trim()) {
    errors.push({
      code: V.MISSING_TITLE,
      severity: "error",
      message: "Course title is required.",
      tab: 0,
      fix: { tab: 0 },
    });
  }

  if (!state.ceHours || state.ceHours <= 0) {
    errors.push({
      code: V.MISSING_CE_HOURS,
      severity: "error",
      message: "CE hours must be greater than zero.",
      tab: 0,
      fix: { tab: 0 },
    });
  }

  if (!state.objectives || state.objectives.length === 0) {
    errors.push({
      code: V.NO_OBJECTIVES,
      severity: "error",
      message: "At least one learning objective is required (ACEP).",
      tab: 0,
      fix: { tab: 0 },
    });
  }

  if (!state.targetAudience || state.targetAudience.length === 0) {
    errors.push({
      code: V.NO_TARGET_AUDIENCE,
      severity: "error",
      message: "At least one target audience is required (ACEP).",
      tab: 0,
      fix: { tab: 0 },
    });
  }

  // ── Content checks (tab 1) ───────────────────────────────────────────────

  if (!state.sections || state.sections.length === 0) {
    errors.push({
      code: V.NO_SECTION_DIVIDER,
      severity: "error",
      message: "Course must have at least one section.",
      tab: 1,
      fix: { tab: 1 },
    });
  }

  const totalWords = countCourseWords(state.sections);
  const targetWords = (state.ceHours || 0) * ACEP_RULES.WORDS_PER_CE_HOUR;
  // Allow 10% tolerance
  if (targetWords > 0 && totalWords < targetWords * 0.9) {
    errors.push({
      code: V.WORD_COUNT_LOW,
      severity: "error",
      message: `Word count (${totalWords.toLocaleString()}) is below 90% of the ${targetWords.toLocaleString()} required for ${state.ceHours} CE hours.`,
      tab: 1,
      fix: { tab: 1 },
    });
  }

  // Per-section checks
  (state.sections || []).forEach((section, si) => {
    const kcCount = countKCsInSection(section);

    if (kcCount < ACEP_RULES.MIN_KC_PER_SECTION) {
      warnings.push({
        code: V.KC_COUNT_LOW,
        severity: "warning",
        message: `Section ${si + 1} "${section.title}" has ${kcCount} knowledge check(s) — minimum is ${ACEP_RULES.MIN_KC_PER_SECTION}.`,
        tab: 1,
        section: si,
        fix: { tab: 1, section: si },
      });
    }

    if (kcCount > ACEP_RULES.MAX_KC_PER_SECTION) {
      warnings.push({
        code: V.KC_COUNT_HIGH,
        severity: "warning",
        message: `Section ${si + 1} "${section.title}" has ${kcCount} knowledge checks — maximum is ${ACEP_RULES.MAX_KC_PER_SECTION}.`,
        tab: 1,
        section: si,
        fix: { tab: 1, section: si },
      });
    }

    // Text block word limits
    (section.contentBlocks || []).forEach((block) => {
      if (block.type === "text") {
        const bw = countBlockWords(block);
        if (bw > ACEP_RULES.MAX_WORDS_PER_TEXT_BLOCK) {
          warnings.push({
            code: V.TEXT_BLOCK_TOO_LONG,
            severity: "warning",
            message: `A text block in Section ${si + 1} "${section.title}" has ${bw.toLocaleString()} words — max is ${ACEP_RULES.MAX_WORDS_PER_TEXT_BLOCK}.`,
            tab: 1,
            section: si,
            fix: { tab: 1, section: si },
          });
        }
      }
    });
  });

  // ── Assessment checks (tab 2) ────────────────────────────────────────────

  const questions = state.assessment?.questions || [];

  if (questions.length < ACEP_RULES.MIN_ASSESSMENT_QUESTIONS) {
    errors.push({
      code: V.ASSESSMENT_TOO_FEW,
      severity: "error",
      message: `Assessment has ${questions.length} question(s) — minimum is ${ACEP_RULES.MIN_ASSESSMENT_QUESTIONS}.`,
      tab: 2,
      fix: { tab: 2 },
    });
  }

  // Check for unset correct answers
  questions.forEach((q, qi) => {
    const opts = q.options || [];
    const allEmpty = opts.every((o) => !o?.trim());
    if (allEmpty || q.correctAnswer == null || q.correctAnswer < 0 || q.correctAnswer >= opts.length) {
      errors.push({
        code: V.CORRECT_ANSWER_UNSET,
        severity: "error",
        message: `Question ${qi + 1}: correct answer is not set or options are empty.`,
        tab: 2,
        fix: { tab: 2 },
      });
    }
  });

  // Answer distribution skew check
  if (questions.length >= ACEP_RULES.MIN_ASSESSMENT_QUESTIONS) {
    const dist = [0, 0, 0, 0]; // A, B, C, D
    questions.forEach((q) => {
      const idx = q.correctAnswer ?? 0;
      if (idx >= 0 && idx < 4) dist[idx]++;
    });
    const maxFreq = ACEP_RULES.MAX_ANSWER_OPTION_FREQUENCY;
    dist.forEach((count, i) => {
      if (questions.length > 0 && count / questions.length > maxFreq) {
        warnings.push({
          code: V.ANSWER_DIST_SKEWED,
          severity: "warning",
          message: `Answer option ${["A", "B", "C", "D"][i]} is correct ${count} times (${Math.round((count / questions.length) * 100)}%) — max recommended is ${Math.round(maxFreq * 100)}%.`,
          tab: 2,
          fix: { tab: 2 },
        });
      }
    });
  }

  // ── References checks (tab 3) ────────────────────────────────────────────

  if (!state.references || state.references.length === 0) {
    errors.push({
      code: V.NO_REFERENCES,
      severity: "error",
      message: "At least one reference is required (ACEP).",
      tab: 3,
      fix: { tab: 3 },
    });
  }

  return { errors, warnings };
}
