// ─── Course Builder Validator ─────────────────────────────────────────────
// DROP INTO: /client/src/components/CourseBuilder/courseBuilderValidator.js
//
// Pure function: validateCourse(state) → { errors: [], warnings: [] }
// Each item: { code, severity, message, tab?, section?, fix? }

import {
  countCourseWords,
  countKCsInSection,
  countSectionWords,
  countWords,
} from "./utils.js";

import {
  ACEP_RULES,
  VALIDATION_CODES,
  KC_BLOCK_TYPES,
} from "./constants.js";

/**
 * Validate a CourseBuilder state object against ACEP compliance rules.
 * @param {object} state - Full CourseBuilder state
 * @returns {{ errors: Array, warnings: Array }}
 */
export function validateCourse(state) {
  const errors = [];
  const warnings = [];

  const err = (code, message, extra = {}) =>
    errors.push({ code, severity: "error", message, ...extra });

  const warn = (code, message, extra = {}) =>
    warnings.push({ code, severity: "warning", message, ...extra });

  // ── ERRORS ──────────────────────────────────────────────────────────────

  if (!state.title?.trim()) {
    err(VALIDATION_CODES.MISSING_TITLE, "Course title is required.", {
      tab: 0,
      fix: { tab: 0 },
    });
  }

  if (!state.ceHours || state.ceHours <= 0) {
    err(VALIDATION_CODES.MISSING_CE_HOURS, "CE hours must be greater than 0.", {
      tab: 0,
      fix: { tab: 0 },
    });
  }

  if ((state.objectives || []).length === 0) {
    err(
      VALIDATION_CODES.NO_OBJECTIVES,
      "At least one learning objective is required.",
      { tab: 0, fix: { tab: 0 } }
    );
  }

  if ((state.targetAudience || []).length === 0) {
    err(
      VALIDATION_CODES.NO_TARGET_AUDIENCE,
      "Target audience must be specified.",
      { tab: 0, fix: { tab: 0 } }
    );
  }

  // Word count (10% tolerance)
  const totalWords = countCourseWords(state);
  const minWords = (state.ceHours || 0) * ACEP_RULES.MIN_WORDS_PER_CE_HOUR * 0.9;
  if (totalWords < minWords) {
    err(
      VALIDATION_CODES.WORD_COUNT_LOW,
      `Word count (${totalWords.toLocaleString()}) is below the minimum ` +
        `(${Math.round(minWords).toLocaleString()} words for ${state.ceHours} CE hour${state.ceHours !== 1 ? "s" : ""}). ` +
        `Need ${(Math.round(minWords) - totalWords).toLocaleString()} more words.`,
      { tab: 1, fix: { tab: 1 } }
    );
  }

  // Assessment question count
  const questions = state.assessment?.questions || [];
  if (questions.length < ACEP_RULES.MIN_ASSESSMENT_QUESTIONS) {
    err(
      VALIDATION_CODES.ASSESSMENT_TOO_FEW,
      `Final exam has ${questions.length} question${questions.length !== 1 ? "s" : ""}; ` +
        `minimum is ${ACEP_RULES.MIN_ASSESSMENT_QUESTIONS}.`,
      { tab: 2, fix: { tab: 2 } }
    );
  }

  // Unset correct answers
  const badQuestions = questions.filter(q => {
    const ca = q.correctAnswer;
    const opts = q.options || [];
    return (
      ca === undefined ||
      ca === null ||
      ca < 0 ||
      ca >= opts.length ||
      opts.every(o => !(typeof o === "string" ? o : o?.text || "").trim())
    );
  });
  if (badQuestions.length > 0) {
    err(
      VALIDATION_CODES.CORRECT_ANSWER_UNSET,
      `${badQuestions.length} question${badQuestions.length !== 1 ? "s" : ""} ` +
        `have no correct answer set or have empty options.`,
      { tab: 2, fix: { tab: 2 } }
    );
  }

  // References
  if ((state.references || []).length === 0) {
    err(VALIDATION_CODES.NO_REFERENCES, "At least one reference is required.", {
      tab: 3,
      fix: { tab: 3 },
    });
  }

  // Section divider check
  const sections = state.modules || state.sections || [];
  const hasDivider = sections.some(s =>
    (s.blocks || s.contentBlocks || []).some(b => b.type === "sectionDivider")
  );
  if (sections.length === 0 || !hasDivider) {
    err(
      VALIDATION_CODES.NO_SECTION_DIVIDER,
      "Course must have at least one section with a Section Divider block.",
      { tab: 1, fix: { tab: 1 } }
    );
  }

  // ── WARNINGS ────────────────────────────────────────────────────────────

  sections.forEach((section, i) => {
    const label = section.title ? `"${section.title}"` : `#${i + 1}`;

    // KC count per section
    const kcCount = countKCsInSection(section);
    if (kcCount < ACEP_RULES.KC_PER_SECTION.MIN) {
      warn(
        VALIDATION_CODES.KC_COUNT_LOW,
        `Section ${i + 1} ${label} has ${kcCount} knowledge check${kcCount !== 1 ? "s" : ""}; ` +
          `minimum is ${ACEP_RULES.KC_PER_SECTION.MIN}.`,
        { tab: 1, section: i, fix: { tab: 1, section: i } }
      );
    }
    if (kcCount > ACEP_RULES.KC_PER_SECTION.MAX) {
      warn(
        VALIDATION_CODES.KC_COUNT_HIGH,
        `Section ${i + 1} ${label} has ${kcCount} knowledge checks; ` +
          `maximum is ${ACEP_RULES.KC_PER_SECTION.MAX}.`,
        { tab: 1, section: i, fix: { tab: 1, section: i } }
      );
    }

    // Text block word length
    (section.blocks || section.contentBlocks || []).forEach((b, bi) => {
      if (b.type === "text" && b.content) {
        const wc = countWords(b.content);
        if (wc > ACEP_RULES.MAX_TEXT_BLOCK_WORDS) {
          warn(
            VALIDATION_CODES.TEXT_BLOCK_TOO_LONG,
            `Section ${i + 1} ${label}, block ${bi + 1}: text block is ` +
              `${wc.toLocaleString()} words (max ${ACEP_RULES.MAX_TEXT_BLOCK_WORDS.toLocaleString()}). ` +
              `Split into smaller blocks.`,
            { tab: 1, section: i, fix: { tab: 1, section: i } }
          );
        }
      }
    });
  });

  // Answer distribution skew (only meaningful once we have enough questions)
  if (questions.length >= ACEP_RULES.MIN_ASSESSMENT_QUESTIONS) {
    const dist = [0, 0, 0, 0];
    questions.forEach(q => {
      const ca = Number(q.correctAnswer);
      if (ca >= 0 && ca < 4) dist[ca]++;
    });
    dist.forEach((count, idx) => {
      const pct = count / questions.length;
      if (pct > ACEP_RULES.MAX_ANSWER_DIST_PCT) {
        warn(
          VALIDATION_CODES.ANSWER_DIST_SKEWED,
          `Answer option ${String.fromCharCode(65 + idx)} is correct ` +
            `${Math.round(pct * 100)}% of the time (max ${ACEP_RULES.MAX_ANSWER_DIST_PCT * 100}%). ` +
            `Redistribute correct answers across options.`,
          { tab: 2, fix: { tab: 2 } }
        );
      }
    });
  }

  return { errors, warnings };
}
