/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */

/**
 * bulkImportParser — turns raw extracted document text into an InteractiveCourse-
 * shaped draft, for routes/bulkUpload.js. Replaces the legacy courseParser.js
 * (deterministic, modules/lessons-shaped, expects a specific CounselorReady
 * template — courseParser.js is left in place, unused, not deleted).
 *
 * AI structures the document (section boundaries, subtitles, knowledge-check
 * and assessment questions); it NEVER rewrites the author's prose. Section
 * boundaries come back from the model as line numbers into the ORIGINAL text,
 * and the body of every section is sliced verbatim from that original text —
 * the model's own restatement of the prose is never used as content.
 */
import Anthropic from '@anthropic-ai/sdk';
import { countCourseWords, requiredWordsFor } from './courseWordCount.js';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = 'claude-sonnet-4-20250514';

const MIN_ASSESSMENT_QUESTIONS = 15;
const MIN_REFERENCES = 15;

// COURSE_SCHEMA_SPEC_v2 §8.6 — same list used by diagnoseEnforcement.js.
const DEPRECATED_HEX = [
  '#40634A', '#34495E', '#4B5D4B', '#7D4E57',
  '#FAFAF9', '#F8F7F4', '#FAFAF8', '#F5F5F4',
];

function slugify(title) {
  return (title || '')
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100) || 'imported-course';
}

function extractJson(raw) {
  const match = raw.match(/\{[\s\S]*\}/);
  return JSON.parse(match ? match[0] : raw);
}

function paragraphsToHtml(lines) {
  const paragraphs = [];
  let current = [];
  for (const line of lines) {
    if (!line.trim()) {
      if (current.length) { paragraphs.push(current.join(' ')); current = []; }
    } else {
      current.push(line.trim());
    }
  }
  if (current.length) paragraphs.push(current.join(' '));
  return paragraphs.map(p => `<p>${p}</p>`).join('\n');
}

function optionsFromChoices(choices, correctIndex) {
  return (choices || []).map((text, i) => ({ text, isCorrect: i === correctIndex }));
}

// ── Best-effort references extraction — deterministic, no AI, so entries
// stay verbatim exactly like section prose does.
function extractReferences(lines) {
  const startIdx = lines.findIndex(l => /^(references|bibliography|works\s*cited)\s*:?\s*$/i.test(l.trim()));
  if (startIdx === -1) return [];
  const refs = [];
  for (let i = startIdx + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    // Stop at the next short ALL-CAPS heading-looking line.
    if (line.length < 60 && line === line.toUpperCase() && /[A-Z]/.test(line)) break;
    refs.push(line);
  }
  return refs;
}

async function requestStructure(lines) {
  const numbered = lines.map((l, i) => `${i + 1}: ${l}`).join('\n');
  const prompt = `You are structuring a continuing-education course document into sections. You must NEVER rewrite, paraphrase, or alter the author's original prose in your output — only identify structure and generate short supporting metadata around it.

Below is the document text with each line numbered.

"""
${numbered}
"""

Return ONLY valid JSON with exactly this structure:
{
  "title": "course title, verbatim from the document if a title line is present, otherwise a concise title reflecting the content",
  "description": "1-2 sentence course description, written by you",
  "objectives": ["3-5 learning objectives, written by you"],
  "sections": [
    {
      "headingLine": <line number from the numbered text above where this section begins>,
      "subtitle": "a one-sentence subtitle for this section, written by you",
      "knowledgeChecks": [
        {
          "question": "a comprehension question about this section's content, written by you",
          "options": ["option A", "option B", "option C", "option D"],
          "correctIndex": 0,
          "explanation": "why the correct answer is correct, written by you"
        }
      ]
    }
  ]
}

Rules:
- headingLine must point to an actual line number from the numbered text above — do not invent one.
- Cover every natural section break in the document. If there is no clear heading structure, return exactly one section with headingLine: 1.
- Generate 1-2 knowledgeChecks per section.
- Return ONLY valid JSON, no markdown, no commentary.`;

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  });
  return extractJson(response.content[0].text);
}

async function requestAssessment(fullText) {
  const prompt = `Generate a final assessment for this continuing-education course. Base every question on the material below; do not invent facts the text doesn't support.

"""
${fullText}
"""

Return ONLY valid JSON with exactly this structure:
{
  "questions": [
    { "question": "...", "options": ["A", "B", "C", "D"], "correctIndex": 0, "explanation": "..." }
  ]
}

Generate at least ${MIN_ASSESSMENT_QUESTIONS} questions, drawn evenly from across the whole document. Return ONLY valid JSON, no markdown, no commentary.`;

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  });
  return extractJson(response.content[0].text);
}

/**
 * @param {string} text - raw extracted document text (from bulkUpload.js's
 *   own extractTextFromBuffer — unchanged, this function never touches extraction)
 * @param {object} defaults - accessType, price, pricingTier, category, ceHours,
 *   approvalBody, acepNumber, instructor
 * @returns {object} unsaved InteractiveCourse-shaped course object
 */
export async function parseDocumentToInteractiveCourse(text, defaults = {}) {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const nonEmptyLines = lines.filter(l => l.trim());
  if (nonEmptyLines.length === 0) {
    throw new Error('Document has no extractable text');
  }

  const structure = await requestStructure(lines);
  if (!structure.title) {
    throw new Error('Could not determine a course title from the document');
  }

  const rawSections = Array.isArray(structure.sections) && structure.sections.length
    ? [...structure.sections].sort((a, b) => a.headingLine - b.headingLine)
    : [{ headingLine: 1, subtitle: '', knowledgeChecks: [] }];

  const sections = rawSections.map((sec, i) => {
    const headingIdx = Math.max(0, Math.min(lines.length - 1, (sec.headingLine || 1) - 1));
    const nextHeadingIdx = i < rawSections.length - 1
      ? Math.max(headingIdx + 1, (rawSections[i + 1].headingLine || lines.length) - 1)
      : lines.length;

    const titleLine = (lines[headingIdx] || '').trim() || `Section ${i + 1}`;
    // Body is everything between this heading and the next, taken VERBATIM
    // from the original lines — never from the model's own restatement.
    const bodyLines = lines.slice(headingIdx + 1, nextHeadingIdx);
    const bodyHtml = paragraphsToHtml(bodyLines);

    const contentBlocks = [
      { type: 'sectionDivider', title: titleLine, subtitle: sec.subtitle || '' },
    ];
    if (bodyHtml) {
      contentBlocks.push({ type: 'text', content: bodyHtml });
    }
    (sec.knowledgeChecks || []).forEach(kc => {
      if (!kc.question || !Array.isArray(kc.options) || kc.options.length < 2) return;
      contentBlocks.push({
        type: 'multipleChoice',
        question: kc.question,
        options: optionsFromChoices(kc.options, kc.correctIndex),
        explanation: kc.explanation || '',
      });
    });

    return { title: titleLine, order: i + 1, contentBlocks };
  });

  let assessmentQuestions = [];
  try {
    const assessmentResult = await requestAssessment(nonEmptyLines.join('\n'));
    assessmentQuestions = (assessmentResult.questions || [])
      .filter(q => q.question && Array.isArray(q.options) && q.options.length >= 2)
      .map(q => ({
        question: q.question,
        type: 'multipleChoice',
        options: optionsFromChoices(q.options, q.correctIndex),
        explanation: q.explanation || '',
      }));
  } catch (err) {
    // Assessment generation failing shouldn't sink the whole import — the
    // validation report below will flag the resulting question-count gap,
    // and CourseBuilder is where Ke fixes it before publishing anyway.
    console.error('bulkImportParser: assessment generation failed:', err.message);
  }

  const references = extractReferences(lines);
  const ceHours = Number(defaults.ceHours) || 3;
  const slug = slugify(structure.title) + '-' + Date.now().toString(36);

  return {
    title: structure.title,
    slug,
    description: structure.description || `Imported course: ${structure.title}`,
    ceHours,
    ceuHours: ceHours,
    categories: [defaults.category || 'Clinical Practice'],
    objectives: structure.objectives || [],
    sections,
    assessment: {
      title: 'Final Assessment',
      timeLimit: 30,
      passThreshold: 0.8,
      questions: assessmentQuestions,
      attemptsAllowed: 3,
      shuffleQuestions: true,
      shuffleOptions: true,
    },
    references,
    accessType: ['free', 'subscription', 'purchase'].includes(defaults.accessType)
      ? defaults.accessType
      : 'subscription',
    price: defaults.price ?? null,
    pricingTier: defaults.pricingTier || 'standard',
    approvalBody: defaults.approvalBody || 'NBCC',
    acepNumber: defaults.acepNumber || '7760',
    approvals: [{
      body: defaults.approvalBody || 'NBCC',
      providerNumber: defaults.acepNumber || '7760',
      status: 'approved',
      deliveryFormat: 'asynchronous',
    }],
    instructor: defaults.instructor || 'GA Integrated Therapeutic Perspectives LLC',
    deliveryMethod: 'online',
    status: 'draft',
    isPublished: false,
  };
}

/**
 * Post-parse validation report — words vs ceHours×6000 target, sectionDivider
 * coverage, assessment question count vs the ≥15 target, references count vs
 * the ≥15 target, and inline styles / deprecated hex found in body content.
 * Never blocks the import — a failing check just tells Ke what CourseBuilder
 * touch-up is still needed before publishing.
 */
export function buildValidationReport(course) {
  const wordCount = countCourseWords(course);
  const requiredWords = requiredWordsFor(course.ceHours || 0);

  const sections = course.sections || [];
  const sectionsWithDivider = sections.filter(
    s => s.contentBlocks?.[0]?.type === 'sectionDivider'
  ).length;

  const assessmentQuestionCount = (course.assessment?.questions || []).length;
  const referencesCount = (course.references || []).length;

  const styleIssues = [];
  sections.forEach((s, si) => {
    (s.contentBlocks || []).forEach(b => {
      const html = b.content || b.textContent || '';
      if (!html) return;
      const loc = `Section ${si + 1} "${b.type}"`;
      if (/style\s*=\s*["'][^"']*["']/i.test(html)) styleIssues.push(`${loc}: inline style= attribute`);
      if (/<h1[\s>]/i.test(html)) styleIssues.push(`${loc}: <h1> in content`);
      if (/<font[\s>]/i.test(html)) styleIssues.push(`${loc}: deprecated <font> tag`);
      for (const hex of DEPRECATED_HEX) {
        if (html.toLowerCase().includes(hex.toLowerCase())) {
          styleIssues.push(`${loc}: deprecated color ${hex}`);
        }
      }
    });
  });

  return {
    wordCount,
    requiredWords,
    wordCountOk: wordCount >= requiredWords,
    sectionCount: sections.length,
    sectionsWithDivider,
    sectionDividerCoverageOk: sections.length > 0 && sectionsWithDivider === sections.length,
    assessmentQuestionCount,
    assessmentOk: assessmentQuestionCount >= MIN_ASSESSMENT_QUESTIONS,
    referencesCount,
    referencesOk: referencesCount >= MIN_REFERENCES,
    styleIssues,
  };
}

export default { parseDocumentToInteractiveCourse, buildValidationReport };
