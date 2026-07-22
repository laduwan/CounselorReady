/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */

/**
 * Run-of-Show Parser
 * ─────────────────────────────────────────────────────────────────
 * Parses a facilitator guide (markdown text OR mammoth-extracted docx
 * markdown) into the LiveSession schema shape landed in Stage 1.
 *
 * Structural conventions expected:
 *   # Hour N           → hour boundary (segments below belong to this hour)
 *   ## Segment Title   → agenda[] entry
 *   ### Sub-heading    → grouped into activityInstructions
 *   Segment durations  → parsed from "(N min)" in the heading OR a
 *                        run-of-show table at the top of the doc
 *   ⚠ / **Caution:**   → facilitatorCautions for the current segment
 *   Poll / question    → polls[] entry (options follow as list items)
 *   Breakout           → breakoutPrompts[] for segments typed 'breakout'
 *   Pre-flight         → any section titled "Pre-flight" / "Prep" →
 *                        preFlightChecklist
 *   Global cautions    → any section titled "Facilitator cautions" /
 *                        "Discipline" at the doc level (not under an hour)
 *                        → globalFacilitatorCautions
 *
 * The parser is defensive: unrecognized structure becomes speakerNotes for
 * the current segment rather than being dropped. Callers get warnings[] in
 * the result so they can flag anything the parser had to guess about.
 */

import mammoth from 'mammoth';

const HOUR_HEADING_RE = /^#\s+Hour\s+(\d+)/i;
const SEGMENT_HEADING_RE = /^##\s+(.+?)(?:\s*\((\d+)\s*min\))?\s*$/i;
const SUB_HEADING_RE = /^###\s+(.+?)(?:\s*\((\d+)\s*min\))?\s*$/i;
const CAUTION_INLINE_RE = /^\s*(?:⚠|\*\*Caution:?\*\*|\*\*Warning:?\*\*|>\s*)/i;
const CRITICAL_MARKERS = /(?:DO NOT|MUST NOT|never|critical|hard rule)/i;
const POLL_MARKER_RE = /^(?:###|####)\s*(?:Poll|Question):?\s*(.+)/i;
const BREAKOUT_MARKER_RE = /^(?:###|####)\s*(?:Breakout|Small group):?\s*(.+)/i;
const EXERCISE_MARKER_RE = /^(?:###|####)\s*(?:Exercise|Writing exercise|Individual exercise):?\s*(.+)/i;
const PREFLIGHT_HEADING_RE = /^#{1,2}\s+(?:Pre[- ]?flight|Prep|Facilitator prep|Before you start)/i;
const GLOBAL_CAUTIONS_HEADING_RE = /^#{1,2}\s+(?:Facilitator cautions|Reveal discipline|Discipline|Global cautions|Guardrails)/i;
const RUN_OF_SHOW_TABLE_RE = /^#{1,2}\s+(?:Run of Show|Agenda|Schedule)/i;

/**
 * Guess a segment type from its heading text.
 */
function guessSegmentType(title) {
  const t = title.toLowerCase();
  if (/\bbreak(?!out|down)\b/.test(t)) return 'break';
  if (/breakout|small group/.test(t)) return 'breakout';
  if (/discuss|q&a|questions/.test(t)) return 'discussion';
  if (/clip|video|watch/.test(t)) return 'clip';
  return 'lecture';
}

/**
 * Extract a "critical" flag from a caution's text.
 */
function isCritical(text) {
  return CRITICAL_MARKERS.test(text);
}

/**
 * Clean a text line — strip leading bullet markers, caution prefixes, etc.
 */
function cleanLine(line) {
  return line
    .replace(/^\s*(?:[-*+]|\d+\.)\s+/, '')      // bullets/numbers
    .replace(/^\s*(?:⚠️?|⚠|>\s*|\*\*Caution:?\*\*|\*\*Warning:?\*\*)\s*/i, '')
    .trim();
}

/**
 * Try to pull a run-of-show table from the doc. Returns
 * { segmentTitle → durationMin } if found, else null. The table shape we
 * support has a "Segment" (or similar) column and a "Min" (or "Duration")
 * column — order is inferred from the header row.
 */
function extractRunOfShowTable(markdown) {
  const lines = markdown.split(/\r?\n/);
  // Find the ToC heading, then the first pipe-table beneath it.
  let inSection = false;
  const rows = [];
  let header = null;
  for (const line of lines) {
    if (RUN_OF_SHOW_TABLE_RE.test(line)) { inSection = true; continue; }
    if (inSection && /^#{1,2}\s+/.test(line)) break; // next section
    if (!inSection) continue;
    if (!line.trim().startsWith('|')) continue;
    const cells = line.split('|').map(c => c.trim()).filter(Boolean);
    if (cells.every(c => /^:?-+:?$/.test(c))) continue; // separator row
    if (!header) { header = cells.map(c => c.toLowerCase()); continue; }
    rows.push(cells);
  }
  if (!header || !rows.length) return null;

  const titleIdx = header.findIndex(h => /segment|title|topic/.test(h));
  const minIdx = header.findIndex(h => /min|duration/.test(h));
  if (titleIdx < 0 || minIdx < 0) return null;

  const map = {};
  for (const row of rows) {
    const title = row[titleIdx];
    const min = parseInt(row[minIdx], 10);
    if (title && Number.isFinite(min)) map[title.toLowerCase()] = min;
  }
  return Object.keys(map).length ? map : null;
}

/**
 * Core parser: takes markdown text (from paste or from mammoth), returns
 * { agenda, preFlightChecklist, globalFacilitatorCautions, warnings }.
 */
export function parseRunOfShowMarkdown(markdown) {
  const warnings = [];
  const lines = markdown.split(/\r?\n/);

  const preFlightChecklist = [];
  const globalFacilitatorCautions = [];
  const agenda = [];

  const rosTable = extractRunOfShowTable(markdown);

  let currentHour = null;
  let currentSegment = null;
  let currentSubHeading = null; // string
  let bucket = null; // { kind: 'preflight' | 'global-cautions' | 'segment' | 'poll' | 'breakout' | 'exercise', ref: ... }
  let currentPoll = null; // reference into segment.polls last entry
  let order = 0;

  const startSegment = (title, durationMin) => {
    if (rosTable && !durationMin) {
      const fromTable = rosTable[title.toLowerCase()];
      if (fromTable) durationMin = fromTable;
    }
    const seg = {
      order: order++,
      type: guessSegmentType(title),
      title: title.trim(),
      durationMin: durationMin || undefined,
      prompt: '',
      speakerNotes: '',
      activityInstructions: '',
      facilitatorCautions: [],
      polls: [],
      breakoutPrompts: []
      // exercise omitted until we see one
    };
    agenda.push(seg);
    currentSegment = seg;
    currentSubHeading = null;
    currentPoll = null;
    bucket = { kind: 'segment', ref: seg };
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const raw = line;
    const trimmed = line.trim();

    // Hour heading
    if (HOUR_HEADING_RE.test(trimmed)) {
      currentHour = parseInt(trimmed.match(HOUR_HEADING_RE)[1], 10);
      continue;
    }

    // Pre-flight section
    if (PREFLIGHT_HEADING_RE.test(trimmed)) {
      bucket = { kind: 'preflight', ref: preFlightChecklist };
      currentSegment = null;
      currentSubHeading = null;
      continue;
    }

    // Global cautions section
    if (GLOBAL_CAUTIONS_HEADING_RE.test(trimmed)) {
      bucket = { kind: 'global-cautions', ref: globalFacilitatorCautions };
      currentSegment = null;
      currentSubHeading = null;
      continue;
    }

    // Segment heading (H2)
    const segMatch = trimmed.match(SEGMENT_HEADING_RE);
    if (segMatch && !RUN_OF_SHOW_TABLE_RE.test(trimmed) && !PREFLIGHT_HEADING_RE.test(trimmed) && !GLOBAL_CAUTIONS_HEADING_RE.test(trimmed)) {
      const [, title, minStr] = segMatch;
      startSegment(title, minStr ? parseInt(minStr, 10) : null);
      continue;
    }

    // Sub-headings within a segment (H3)
    const subMatch = trimmed.match(SUB_HEADING_RE);
    if (subMatch && currentSegment) {
      const subTitle = subMatch[1];

      const pollMatch = trimmed.match(POLL_MARKER_RE);
      const breakoutMatch = trimmed.match(BREAKOUT_MARKER_RE);
      const exerciseMatch = trimmed.match(EXERCISE_MARKER_RE);

      if (pollMatch) {
        const poll = {
          question: pollMatch[1].trim(),
          options: [],
          revealAfter: /after|end|close/i.test(subTitle) ? 'after-segment' : 'immediately'
        };
        currentSegment.polls.push(poll);
        currentPoll = poll;
        bucket = { kind: 'poll', ref: poll };
        continue;
      }
      if (breakoutMatch) {
        bucket = { kind: 'breakout', ref: currentSegment };
        continue;
      }
      if (exerciseMatch) {
        currentSegment.exercise = {
          instructions: '',
          timeboxMin: subMatch[2] ? parseInt(subMatch[2], 10) : undefined,
          deliverable: '',
          debriefFormat: ''
        };
        bucket = { kind: 'exercise', ref: currentSegment.exercise };
        continue;
      }

      // Generic sub-heading → collected into activityInstructions
      currentSubHeading = subTitle;
      bucket = { kind: 'segment', ref: currentSegment };
      currentSegment.activityInstructions += (currentSegment.activityInstructions ? '\n\n' : '') + `**${subTitle}**\n`;
      continue;
    }

    if (!trimmed) continue; // blank

    // Content line — route by current bucket
    switch (bucket?.kind) {
      case 'preflight': {
        const cleaned = cleanLine(trimmed);
        if (cleaned) preFlightChecklist.push({ text: cleaned, critical: isCritical(trimmed) });
        break;
      }
      case 'global-cautions': {
        const cleaned = cleanLine(trimmed);
        if (cleaned) globalFacilitatorCautions.push({ text: cleaned });
        break;
      }
      case 'poll': {
        // Poll options: bullet list under the poll heading
        const listMatch = trimmed.match(/^\s*(?:[-*+]|\d+\.)\s+(.+)/);
        if (listMatch) {
          currentPoll.options.push({ text: listMatch[1].trim() });
        } else {
          // continuation of question text
          currentPoll.question = (currentPoll.question + ' ' + trimmed).trim();
        }
        break;
      }
      case 'breakout': {
        const cleaned = cleanLine(trimmed);
        if (cleaned && currentSegment) {
          currentSegment.breakoutPrompts.push({ text: cleaned });
        }
        break;
      }
      case 'exercise': {
        const cleaned = cleanLine(trimmed);
        if (!cleaned || !bucket.ref) break;
        // Try to route to the right sub-field by leading keyword
        if (/^(?:they|participants?|attendees?)\b/i.test(cleaned) || !bucket.ref.instructions) {
          bucket.ref.instructions = (bucket.ref.instructions ? bucket.ref.instructions + ' ' : '') + cleaned;
        } else if (/deliverable|produce|create|write/i.test(cleaned) && !bucket.ref.deliverable) {
          bucket.ref.deliverable = cleaned;
        } else if (/debrief|share|read|discuss/i.test(cleaned) && !bucket.ref.debriefFormat) {
          bucket.ref.debriefFormat = cleaned;
        } else {
          bucket.ref.instructions = (bucket.ref.instructions ? bucket.ref.instructions + ' ' : '') + cleaned;
        }
        break;
      }
      case 'segment':
      default: {
        if (!currentSegment) {
          // Content before any segment heading → toss into preFlight if
          // we've seen an intro-like context, else warn.
          if (trimmed.length > 3) warnings.push(`Ignored content before first segment: "${trimmed.slice(0, 60)}${trimmed.length > 60 ? '…' : ''}"`);
          break;
        }
        // Caution?
        if (CAUTION_INLINE_RE.test(raw)) {
          const cleaned = cleanLine(raw);
          if (cleaned) currentSegment.facilitatorCautions.push({ text: cleaned, critical: isCritical(cleaned) });
          break;
        }
        // Otherwise: activity content
        currentSegment.activityInstructions += (currentSegment.activityInstructions ? '\n' : '') + trimmed;
      }
    }
  }

  // Post-processing: exercise cleanup — if empty, remove the object entirely
  for (const seg of agenda) {
    if (seg.exercise && !seg.exercise.instructions && !seg.exercise.deliverable && !seg.exercise.debriefFormat) {
      delete seg.exercise;
    }
  }

  return { agenda, preFlightChecklist, globalFacilitatorCautions, warnings };
}

/**
 * Convenience wrapper for docx input. Uses mammoth to extract markdown-ish
 * text and then delegates to parseRunOfShowMarkdown.
 */
export async function parseRunOfShowDocx(buffer) {
  // mammoth's convertToMarkdown gives us headings, lists, and tables as
  // markdown — good enough for the walker.
  const result = await mammoth.convertToMarkdown({ buffer });
  const markdown = result.value || '';
  const parsed = parseRunOfShowMarkdown(markdown);
  // Attach mammoth's own messages (e.g. unmapped styles) to our warnings
  if (result.messages?.length) {
    for (const m of result.messages) parsed.warnings.push(`docx: ${m.message}`);
  }
  return parsed;
}
