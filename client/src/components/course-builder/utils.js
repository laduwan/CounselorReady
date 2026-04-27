// ─────────────────────────────────────────────────────────────────────────────
// CounselorReady CourseBuilder — utils.js
// Pure utility functions. No imports from the codebase.
// ─────────────────────────────────────────────────────────────────────────────

import { KC_BLOCK_TYPES } from "./constants.js";

// ─── ID generation ───────────────────────────────────────────────────────────

/** Client-side temp ID for React keys. Stripped before saving to DB. */
export function uid() {
  return `_t${Math.random().toString(36).slice(2, 9)}`;
}

// ─── Slug ────────────────────────────────────────────────────────────────────

export function slugify(title) {
  return (title || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    || "untitled-course";
}

// ─── Word counting ───────────────────────────────────────────────────────────

/** Strip HTML tags and count words in a string. */
export function countWords(str) {
  if (!str) return 0;
  return str
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .length;
}

/**
 * Count learner-visible words in a single content block.
 * Only counts prose that a learner reads — not labels, metadata, or structural fields.
 */
export function countBlockWords(block) {
  if (!block) return 0;

  switch (block.type) {
    case "text":
      return countWords(block.content) + countWords(block.heading);

    case "accordion":
      return (block.items || []).reduce(
        (sum, item) => sum + countWords(item.title) + countWords(item.content),
        0
      );

    case "imageText":
      return countWords(block.content) + countWords(block.imageCaption);

    case "image":
      return countWords(block.caption);

    case "multipleChoice":
    case "multiSelect":
      return (
        countWords(block.question) +
        (block.options || []).reduce((s, o) => s + countWords(o), 0) +
        countWords(block.explanation)
      );

    case "matching":
      return (block.pairs || []).reduce(
        (sum, p) => sum + countWords(p.term) + countWords(p.definition),
        0
      );

    case "reflection":
      return countWords(block.prompt);

    case "flashcardDeck":
      return (block.cards || []).reduce(
        (sum, c) => sum + countWords(c.front) + countWords(c.back),
        0
      );

    case "cardSort":
      return (
        countWords(block.instructions) +
        (block.cards || []).reduce((sum, c) => sum + countWords(c.text), 0)
      );

    case "sequencing":
      return (
        countWords(block.instructions) +
        (block.steps || []).reduce((sum, s) => sum + countWords(s.text), 0)
      );

    case "scenarioTree":
      return (block.nodes || []).reduce(
        (sum, n) =>
          sum +
          countWords(n.text) +
          (n.choices || []).reduce((s, c) => s + countWords(c.label) + countWords(c.feedback), 0),
        0
      );

    case "hotspot":
      return (block.pins || []).reduce(
        (sum, p) => sum + countWords(p.title) + countWords(p.content),
        0
      );

    case "timeline":
      return (block.events || []).reduce(
        (sum, e) => sum + countWords(e.title) + countWords(e.description),
        0
      );

    case "videoEmbed":
      return countWords(block.title) + countWords(block.description);

    case "resources":
      return (block.links || []).reduce((sum, l) => sum + countWords(l.label), 0);

    case "sectionDivider":
      return 0; // structural, not counted

    default:
      return 0;
  }
}

/**
 * Count total words across all content blocks in a section.
 */
export function countSectionWords(section) {
  return (section.blocks || section.contentBlocks || []).reduce(
    (sum, block) => sum + countBlockWords(block),
    0
  );
}

/**
 * Count total words across the entire course.
 * Accepts either a sections array or a full state object.
 */
export function countCourseWords(stateOrSections) {
  const sections = Array.isArray(stateOrSections)
    ? stateOrSections
    : (stateOrSections?.modules || stateOrSections?.sections || []);
  return (sections || []).reduce(
    (sum, section) => sum + countSectionWords(section),
    0
  );
}

// ─── KC counting ─────────────────────────────────────────────────────────────

/** Count knowledge check blocks in a section. */
export function countKCsInSection(section) {
  return (section.blocks || section.contentBlocks || []).filter(b => KC_BLOCK_TYPES.includes(b.type)).length;
}

// ─── Strip temp IDs before save ──────────────────────────────────────────────

/**
 * Recursively remove all _tempId fields from a course payload.
 * Called by courseBuilderApi.js before POSTing to the backend.
 */
export function stripTempIds(obj) {
  if (Array.isArray(obj)) {
    return obj.map(stripTempIds);
  }
  if (obj && typeof obj === "object") {
    const out = {};
    for (const [key, val] of Object.entries(obj)) {
      if (key === "_tempId") continue;
      out[key] = stripTempIds(val);
    }
    return out;
  }
  return obj;
}

// ─── Build save payload ──────────────────────────────────────────────────────

/**
 * Transform builder state into a clean MongoDB document.
 * - Strips _tempId fields
 * - Computes wordCount
 * - Sets ceuHours = ceHours
 * - Ensures correct collection fields
 */
export function buildSavePayload(state, publish = false) {
  const payload = stripTempIds({ ...state });

  // Ensure canonical fields
  payload.status      = publish ? "published" : "draft";
  payload.isPublished = publish;
  payload.slug        = state.slug || slugify(state.title);
  payload.ceuHours    = state.ceHours;
  payload.ceuEligible = true;
  payload.deliveryMethod = "online";

  // Hardcoded ACEP provider
  payload.instructor    = "GA Integrated Therapeutic Perspectives LLC";
  payload.approvingBody = "NBCC";
  payload.approvalNumber = "#7760";

  // Compute word count from sections
  payload.wordCount = countCourseWords(state.sections);

  // Normalize section block order fields
  payload.sections = (state.sections || []).map((section, si) => ({
    ...section,
    order: si + 1,
    contentBlocks: (section.contentBlocks || []).map((block, bi) => ({
      ...block,
      order: bi + 1,
    })),
  }));

  return payload;
}
