// server/src/services/remediationInference.js
// =========================================================================
// Adaptive Remediation — AI Inference Service
// =========================================================================
// For each KC block (multipleChoice/multiSelect/matching) in a course,
// asks Claude Haiku which text/imageText/accordion block in the SAME section
// most directly teaches the concept being tested, and writes the result to
// block.remediation.
//
// Respects manual overrides: KCs with remediation.source === 'manual' are
// never modified. KCs with remediation.source === 'ai' are re-inferred only
// when opts.overwriteAI === true.
//
// Ensures all content blocks in processed sections have stable string IDs
// before inference (idempotent: existing IDs preserved).
//
// Returns a stats object with per-course summary + per-KC change log.
// =========================================================================

import Anthropic from '@anthropic-ai/sdk';
import { Course } from '../models/InteractiveCourse.js';

const MODEL = 'claude-haiku-4-5-20251001';
const MAX_PREVIEW_CHARS = 800;
const CANDIDATE_TYPES = new Set(['text', 'imageText', 'accordion']);
const KC_TYPES = new Set(['multipleChoice', 'multiSelect', 'matching']);

// ──────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────

function stripHtml(html) {
  if (!html) return '';
  return String(html)
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function shortId() {
  return 'crblk_' + Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-3);
}

// Ensure every block in a section has a stable string `id`. Mutates in place.
function assignBlockIds(section) {
  const existingIds = new Set();
  (section.contentBlocks || []).forEach(b => {
    if (b.id && typeof b.id === 'string') existingIds.add(b.id);
  });
  let assigned = 0;
  (section.contentBlocks || []).forEach(b => {
    if (!b.id || typeof b.id !== 'string' || b.id.trim() === '') {
      let newId;
      do { newId = shortId(); } while (existingIds.has(newId));
      existingIds.add(newId);
      b.id = newId;
      assigned++;
    }
  });
  return assigned;
}

// Extract plain-text preview of a candidate block for the AI prompt.
function blockPreview(block) {
  if (block.type === 'text' || block.type === 'imageText') {
    const body = stripHtml(block.content || block.textContent || '');
    const title = block.title ? `[${block.title}] ` : '';
    return (title + body).slice(0, MAX_PREVIEW_CHARS);
  }
  if (block.type === 'accordion') {
    const items = (block.accordionItems || []).map(it =>
      `${it.title || ''}: ${stripHtml(it.content || '')}`
    ).join(' | ');
    return items.slice(0, MAX_PREVIEW_CHARS);
  }
  return '';
}

// Build a compact text representation of a KC for the AI prompt.
function kcSummary(kc) {
  const parts = [`Type: ${kc.type}`, `Question: ${kc.question || '(no question)'}`];

  if (kc.type === 'multipleChoice' || kc.type === 'multiSelect') {
    const opts = (kc.options || []).map(o => typeof o === 'string' ? o : (o.text || '')).filter(Boolean);
    const correctIdxs = [];
    if (typeof kc.correctAnswer === 'number') correctIdxs.push(kc.correctAnswer);
    else if (Array.isArray(kc.correctAnswers)) correctIdxs.push(...kc.correctAnswers);
    else if (Array.isArray(kc.options)) {
      kc.options.forEach((o, i) => {
        if (o && typeof o === 'object' && o.isCorrect) correctIdxs.push(i);
      });
    }
    opts.forEach((text, i) => {
      const marker = correctIdxs.includes(i) ? '✓' : ' ';
      parts.push(`  ${marker} ${String.fromCharCode(65 + i)}. ${text}`);
    });
  } else if (kc.type === 'matching') {
    (kc.matchingPairs || []).forEach(p => {
      parts.push(`  • ${p.term} → ${p.definition}`);
    });
  }

  if (kc.explanation) parts.push(`Explanation: ${stripHtml(kc.explanation).slice(0, 400)}`);
  return parts.join('\n');
}

// ──────────────────────────────────────────────────────────────────────────
// Anthropic call
// ──────────────────────────────────────────────────────────────────────────

function buildPrompt(kc, candidates) {
  const candidateList = candidates.map(c =>
    `  { "blockId": "${c.id}", "type": "${c.type}", "preview": ${JSON.stringify(c.preview)} }`
  ).join(',\n');

  return `You are analyzing a continuing education course for licensed mental health counselors.
Your job: for the knowledge-check below, identify which earlier content block in the SAME section most directly teaches the concept needed to answer correctly.

KNOWLEDGE CHECK:
${kcSummary(kc)}

CANDIDATE BLOCKS (same section, in order):
[
${candidateList}
]

Scoring rubric:
- "high"   = block explicitly teaches the exact concept being tested
- "medium" = block covers the topic but does not directly answer the question
- "low"    = weak match; block is only tangentially related
- null     = no block in this section meaningfully teaches this concept

Return ONLY a JSON object. No prose. No markdown fences. No explanation outside JSON.

{
  "blockId": "<chosen block id, or null>",
  "confidence": "high" | "medium" | "low",
  "reasoning": "<one sentence, max 120 chars>"
}`;
}

async function callClaude(client, kc, candidates) {
  const prompt = buildPrompt(kc, candidates);
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 300,
    messages: [{ role: 'user', content: prompt }],
  });

  // Extract text content from response
  const textBlock = response.content.find(c => c.type === 'text');
  if (!textBlock) throw new Error('No text in Claude response');
  const raw = textBlock.text.trim();

  // Strip accidental markdown fences
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (e) {
    throw new Error(`Invalid JSON from Claude: ${cleaned.slice(0, 200)}`);
  }

  // Validate shape
  const validConfidence = ['high', 'medium', 'low'];
  if (parsed.blockId !== null && typeof parsed.blockId !== 'string') {
    throw new Error(`Invalid blockId type: ${typeof parsed.blockId}`);
  }
  if (parsed.blockId !== null && !candidates.find(c => c.id === parsed.blockId)) {
    throw new Error(`Claude returned unknown blockId: ${parsed.blockId}`);
  }
  if (parsed.blockId !== null && !validConfidence.includes(parsed.confidence)) {
    throw new Error(`Invalid confidence: ${parsed.confidence}`);
  }

  return {
    blockId: parsed.blockId,
    confidence: parsed.blockId ? parsed.confidence : '',
    reasoning: (parsed.reasoning || '').slice(0, 120),
  };
}

// ──────────────────────────────────────────────────────────────────────────
// Main entry point
// ──────────────────────────────────────────────────────────────────────────

/**
 * Run AI remediation inference over a single course.
 *
 * @param {string|ObjectId} courseId - MongoDB _id of the course
 * @param {object} opts
 * @param {boolean} [opts.overwriteAI=false] - re-infer KCs where source==='ai'
 * @param {boolean} [opts.dryRun=false] - compute changes but don't save
 * @param {boolean} [opts.verbose=false] - console.log per-KC progress
 * @returns {Promise<object>} stats + updates array
 */
export async function inferRemediationForCourse(courseId, opts = {}) {
  const { overwriteAI = false, dryRun = false, verbose = false } = opts;

  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not set in environment');
  }

  const startTime = Date.now();
  const client = new Anthropic();

  const course = await Course.findById(courseId);
  if (!course) throw new Error(`Course not found: ${courseId}`);

  const stats = {
    courseId: String(course._id),
    courseTitle: course.title,
    totalKCs: 0,
    manualSkipped: 0,
    aiSkipped: 0,
    inferredHigh: 0,
    inferredMedium: 0,
    inferredLow: 0,
    noMatch: 0,
    errors: 0,
    sectionsProcessed: 0,
    blocksTaggedWithIds: 0,
    durationMs: 0,
  };
  const updates = [];
  const errorLog = [];

  const sections = course.sections || [];

  for (let si = 0; si < sections.length; si++) {
    const section = sections[si];

    // Ensure all blocks in this section have IDs (required for remediation targeting)
    stats.blocksTaggedWithIds += assignBlockIds(section);

    const blocks = section.contentBlocks || [];
    const candidates = blocks
      .filter(b => CANDIDATE_TYPES.has(b.type))
      .map(b => ({ id: b.id, type: b.type, preview: blockPreview(b) }))
      .filter(c => c.preview && c.preview.length > 40);

    const kcs = blocks.filter(b => KC_TYPES.has(b.type));
    if (kcs.length === 0) continue;
    stats.sectionsProcessed++;

    if (candidates.length === 0) {
      // No candidate blocks — can't infer anything
      kcs.forEach(kc => {
        stats.totalKCs++;
        stats.noMatch++;
        errorLog.push({ sectionIndex: si, kcId: kc.id, reason: 'No candidate text blocks in section' });
      });
      continue;
    }

    for (const kc of kcs) {
      stats.totalKCs++;
      const existing = kc.remediation;

      // Respect manual edits ALWAYS
      if (existing && existing.source === 'manual' && existing.blockId) {
        stats.manualSkipped++;
        if (verbose) console.log(`  [skip-manual] ${section.title || 'Section ' + (si + 1)} / ${kc.id}`);
        continue;
      }

      // Skip existing AI unless overwriteAI is set
      if (existing && existing.source === 'ai' && existing.blockId && !overwriteAI) {
        stats.aiSkipped++;
        if (verbose) console.log(`  [skip-ai] ${section.title || 'Section ' + (si + 1)} / ${kc.id}`);
        continue;
      }

      try {
        const result = await callClaude(client, kc, candidates);
        const prev = existing ? { ...existing.toObject?.() || existing } : null;

        if (!result.blockId) {
          stats.noMatch++;
          if (verbose) console.log(`  [no-match] ${section.title || 'Section ' + (si + 1)} / ${kc.id} — ${result.reasoning}`);
          updates.push({
            sectionIndex: si, sectionTitle: section.title, kcId: kc.id,
            action: 'no-match', reasoning: result.reasoning, previous: prev,
          });
          continue;
        }

        const newRem = {
          blockId: result.blockId,
          message: existing?.message || '',
          confidence: result.confidence,
          source: 'ai',
        };

        if (!dryRun) kc.remediation = newRem;

        if (result.confidence === 'high') stats.inferredHigh++;
        else if (result.confidence === 'medium') stats.inferredMedium++;
        else stats.inferredLow++;

        if (verbose) console.log(`  [${result.confidence}] ${section.title || 'Section ' + (si + 1)} / ${kc.id} → ${result.blockId} — ${result.reasoning}`);
        updates.push({
          sectionIndex: si, sectionTitle: section.title, kcId: kc.id,
          action: 'inferred', ...newRem, reasoning: result.reasoning, previous: prev,
        });
      } catch (err) {
        stats.errors++;
        errorLog.push({ sectionIndex: si, kcId: kc.id, error: err.message });
        if (verbose) console.log(`  [error] ${section.title || 'Section ' + (si + 1)} / ${kc.id} — ${err.message}`);
      }
    }
  }

  if (!dryRun && (updates.length > 0 || stats.blocksTaggedWithIds > 0)) {
    // Mark sections as modified (Mongoose may not detect deep mutations on Mixed/Array)
    course.markModified('sections');
    await course.save();
  }

  stats.durationMs = Date.now() - startTime;

  return { stats, updates, errorLog };
}

// Convenience: look up by slug for Render shell use
export async function inferRemediationBySlug(slug, opts = {}) {
  const course = await Course.findOne({ slug });
  if (!course) throw new Error(`Course not found with slug: ${slug}`);
  return inferRemediationForCourse(course._id, opts);
}
