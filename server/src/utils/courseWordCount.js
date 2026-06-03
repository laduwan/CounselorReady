/**
 * courseWordCount.js — CANONICAL interactive-course word counter
 * CounselorReady · GAITP LLC · NBCC ACEP #7760
 *
 * SINGLE SOURCE OF TRUTH for InteractiveCourse word counts.
 *
 * This is a verbatim extraction of the counting logic that has lived inline in
 * the InteractiveCourse pre-save hook (server/src/models/InteractiveCourse.js).
 * It produces the EXACT same number the DB has been storing — extracting it
 * changes no existing course's count. The point is that every consumer
 * (model hook, validators, publish gate, recompute scripts, diagnostics) now
 * imports THIS function instead of re-implementing its own divergent counter.
 *
 * Locked word-count policy:
 *   COUNT  — learner-visible instructional content: block prose, titles,
 *            headers, all interactive-block content, Q&A (question + options +
 *            explanation), instructions, callouts, captions/alt text, video
 *            markers, section titles, and final-assessment questions.
 *   EXCLUDE — resources/deliverables/files bodies (titles only are counted),
 *            references/bibliography, course.objectives[], and catalog
 *            metadata (description, tags, targetAudience, instructor).
 *
 * Block field names follow the canonical InteractiveCourse schema, NOT the
 * Gold Standard spec where they differ:
 *   flashcards[{front,back}] · matchingPairs[{term,definition}] ·
 *   scenarioTree => scenarioTitle + nodes{} · cardSort => cards[{text}] +
 *   categories[] · options [{text,isCorrect}] OR [String].
 */

// ── primitives ────────────────────────────────────────────────────────────
const wcOf = (s) => {
  if (typeof s !== 'string' || !s) return 0;
  const plain = s.replace(/<[^>]+>/g, ' ').replace(/&\w+;/g, ' ').trim();
  return plain ? plain.split(/\s+/).filter(w => w.length > 0).length : 0;
};

const wcStrings = (arr) =>
  Array.isArray(arr) ? arr.reduce((n, s) => n + wcOf(s), 0) : 0;

const wcFields = (arr, fields) => {
  if (!Array.isArray(arr)) return 0;
  let n = 0;
  for (const item of arr) {
    if (!item || typeof item !== 'object') continue;
    for (const f of fields) n += wcOf(item[f]);
  }
  return n;
};

// Recursive walk: count every string at any depth (Mixed fields:
// scenarioTree.nodes, block.callouts callout-library override).
const wcMixed = (val) => {
  if (val == null) return 0;
  if (typeof val === 'string') return wcOf(val);
  if (typeof val !== 'object') return 0;
  if (Array.isArray(val)) return val.reduce((n, x) => n + wcMixed(x), 0);
  let n = 0;
  for (const k of Object.keys(val)) n += wcMixed(val[k]);
  return n;
};

// Options accept BOTH shapes renderMultipleChoice handles:
//   string:  ["A","B","C","D"]
//   object:  [{text:"A", isCorrect:false}, ...]
const wcOptions = (opts) => {
  if (!Array.isArray(opts)) return 0;
  let n = 0;
  for (const o of opts) {
    if (typeof o === 'string') n += wcOf(o);
    else if (o && typeof o === 'object') n += wcOf(o.text);
  }
  return n;
};

const wcQuestion = (q) => {
  if (!q || typeof q !== 'object') return 0;
  let n = wcOf(q.question || q.prompt || '');
  n += wcOptions(q.options);
  n += wcOf(q.explanation || q.rationale || '');
  return n;
};

// ── per-block field map (viewer-aligned) ────────────────────────────────────
export const countBlockWords = (b) => {
  if (!b) return 0;
  let n = 0;

  // Prose: max(textContent, content) avoids double-counting when seeds
  // populate both with the plain/HTML versions of the same prose.
  n += Math.max(wcOf(b.textContent), wcOf(b.content));
  n += wcOf(b.html);
  n += wcOf(b.body);

  // Per-block Q&A (multipleChoice, multiSelect, reflection prompt, etc.)
  n += wcOf(b.question);
  n += wcOf(b.prompt);
  n += wcOf(b.explanation);
  n += wcOf(b.rationale);
  n += wcOptions(b.options);

  // KC wrapper blocks (viewer renders these even though spec marks deprecated)
  if (Array.isArray(b.questions)) {
    for (const q of b.questions) n += wcQuestion(q);
  }

  // Learner-facing instruction text shown above interactive elements
  n += wcOf(b.instructions);
  n += wcOf(b.matchingInstructions);

  // Callout library override (Mixed) — feeds parseCalloutSyntax for inline pills
  n += wcMixed(b.callouts);

  // accordion
  n += wcFields(b.accordionItems, ['title', 'content']);

  // matching
  n += wcFields(b.matchingPairs, ['term', 'definition']);

  // flashcardDeck
  n += wcFields(b.flashcards, ['front', 'back']);

  // scenarioTree
  n += wcOf(b.scenarioTitle);
  n += wcMixed(b.nodes);

  // cardSort
  n += wcStrings(b.categories);
  n += wcFields(b.cards, ['text']);

  // sequencing
  n += wcFields(b.steps, ['text']);

  // timeline
  n += wcFields(b.events, ['year', 'text']);

  // hotspot
  n += wcOf(b.imageDescription);
  n += wcFields(b.hotspots, ['label', 'info', 'description']);

  // callout — viewer accepts calloutItems[] or items[]
  n += wcStrings(b.calloutItems);
  n += wcStrings(b.items);  // also serves keyTakeaway

  // fillInBlank
  n += wcFields(b.blanks, ['prompt', 'answer']);

  // keyTakeaway — viewer accepts takeaways[] or items[] (counted above)
  n += wcStrings(b.takeaways);

  // video / videoEmbed
  n += wcOf(b.videoTitle);
  n += wcFields(b.markers, ['label', 'prompt']);

  // image (standalone) — accessibility text shown to learner
  n += wcOf(b.imageCaption);
  n += wcOf(b.imageAltText);
  n += wcOf(b.imageAlt);

  // resources / deliverables — viewer side-tab aggregates these (TITLES only)
  n += wcFields(b.resources, ['title']);
  n += wcFields(b.deliverables, ['title']);
  n += wcFields(b.files, ['title']);

  // INCLUDED per locked policy: titles, headers count toward CE
  n += wcOf(b.title);
  n += wcOf(b.subtitle);
  // EXCLUDED: b.references[] (not rendered; refs don't count toward CE)

  return n;
};

/**
 * Canonical course word count.
 * Accepts a plain object OR a Mongoose document (works on `course.sections`,
 * `course.assessment`). Returns an integer.
 *
 * @param {object} course - InteractiveCourse doc or plain object
 * @returns {number} learner-visible instructional word count
 */
export const countCourseWords = (course) => {
  if (!course || typeof course !== 'object') return 0;
  let wc = 0;

  // (1) Walk every block in every section
  (course.sections || []).forEach(s => {
    (s.contentBlocks || []).forEach(b => { wc += countBlockWords(b); });
    // (2) Section-level quizQuestions (legacy schema location)
    (s.quizQuestions || []).forEach(q => { wc += wcQuestion(q); });
    // INCLUDED per locked policy: section titles count toward CE
    wc += wcOf(s.title);
  });

  // (3) Final-assessment questions — viewer renders these to the learner
  if (course.assessment && Array.isArray(course.assessment.questions)) {
    course.assessment.questions.forEach(q => { wc += wcQuestion(q); });
  }

  // EXCLUDED: course.references[], course.objectives[], description, tags, etc.
  return wc;
};

/** Required words for a CE-hour target (NBCC ACEP: 6,000 words / CE hour). */
export const WORDS_PER_CE_HOUR = 6000;
export const requiredWordsFor = (ceHours) => (Number(ceHours) || 0) * WORDS_PER_CE_HOUR;

export default countCourseWords;
