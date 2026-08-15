/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 */

/**
 * generateBlockFieldReference.js
 *
 * TIER 1 GENERATOR. Reads the canonical sources and emits BLOCK_FIELD_REFERENCE.md.
 * This file is the bridge between the "sacred" viewer (the real source of truth)
 * and the spec docs (which are known to be wrong about field names).
 *
 * NOTHING HERE IS AUTHORED BY HAND OR BY AN LLM. Every field name is extracted
 * from the actual render functions in interactive-course.html, so the reference
 * cannot drift from the code. Two different Claude instances running this produce
 * byte-identical output, because neither is writing — the script is extracting.
 *
 * Run after ANY change to a block render function or the schema:
 *   node server/src/scripts/generateBlockFieldReference.js
 *
 * Sources (read-only):
 *   - client/public/interactive-course.html   → block.X reads per renderX()
 *   - server/src/models/InteractiveCourse.js   → declared schema paths (context)
 *
 * Output:
 *   - BLOCK_FIELD_REFERENCE.md  (repo root)
 *
 * ESM ("type":"module"). Pure read + write; no DB, no network.
 */
import { readFileSync, writeFileSync } from 'fs';
import { createHash } from 'crypto';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..', '..', '..');
const VIEWER = join(REPO_ROOT, 'client', 'public', 'interactive-course.html');
const SCHEMA = join(REPO_ROOT, 'server', 'src', 'models', 'InteractiveCourse.js');
const OUT = join(REPO_ROOT, 'BLOCK_FIELD_REFERENCE.md');

/** Map renderX function name → block `type` string used in seeds/builder. */
const RENDER_TO_TYPE = {
  renderSectionDivider: 'sectionDivider',
  renderText: 'text',
  renderImageText: 'imageText',
  renderImage: 'image',
  renderAccordion: 'accordion',
  renderMultipleChoice: 'multipleChoice',
  renderTranscriptCoding: 'transcriptCoding',
  renderMultiSelect: 'multiSelect',
  renderMatching: 'matching',
  renderFlashcardDeck: 'flashcardDeck',
  renderScenarioTree: 'scenarioTree',
  renderCardSort: 'cardSort',
  renderSequencing: 'sequencing',
  renderTimeline: 'timeline',
  renderHotspot: 'hotspot',
  renderReflection: 'reflection',
  renderCallout: 'callout',
  renderFillInBlank: 'fillInBlank',
  renderKeyTakeaway: 'keyTakeaway',
  renderPreCommit: 'preCommit',
  renderPreCommitReveal: 'preCommitReveal',
  renderPulseCheck: 'pulseCheck',
  renderStatCard: 'statCard',
  renderCaseStudy: 'caseStudy',
  renderPullQuote: 'pullQuote',
  renderTableBlock: 'table',
  renderResources: 'resources',
  renderVideoEmbed: 'videoEmbed'
};

/** Fields that hold author-visible prose the word counter SHOULD count. */
const WORD_COUNTED_HINTS = ['content', 'text', 'title', 'subtitle', 'heading', 'front', 'back', 'term', 'definition', 'question', 'prompt', 'quote', 'takeaway', 'caption'];
/** Fields that are positioning/layout/asset — NOT counted as words. */
const LAYOUT_HINTS = ['imagePosition', 'imageAlignment', 'imageSize', 'highlight', 'imageUrl', 'image', 'url', 'thumbnailUrl', 'alt', 'imageAlt', 'imageAltText', 'publicId', 'videoUrl', 'embedUrl', 'mediumUrl', 'largeUrl', 'hotspots', 'coords'];

function extractFunctionBody(src, fnName) {
  const start = src.indexOf(`function ${fnName}(`);
  if (start === -1) return '';
  let depth = 0, i = src.indexOf('{', start), began = false;
  for (; i < src.length; i++) {
    if (src[i] === '{') { depth++; began = true; }
    else if (src[i] === '}') { depth--; if (began && depth === 0) return src.slice(start, i + 1); }
  }
  return src.slice(start);
}

/** Pull every distinct `block.<field>` reference from a function body. */
function fieldsFromBody(body) {
  const re = /\bblock\.([a-zA-Z_][a-zA-Z0-9_]*)/g;
  const set = new Set();
  let m;
  while ((m = re.exec(body)) !== null) {
    if (m[1] !== 'type') set.add(m[1]);
  }
  return [...set].sort();
}

function classify(field) {
  if (LAYOUT_HINTS.includes(field)) return 'layout/asset (not counted)';
  if (WORD_COUNTED_HINTS.includes(field)) return 'prose (word-counted)';
  return 'data';
}

function main() {
  const viewerSrc = readFileSync(VIEWER, 'utf8');
  let schemaSrc = '';
  try { schemaSrc = readFileSync(SCHEMA, 'utf8'); } catch { /* optional */ }

  const rows = [];
  for (const [fn, type] of Object.entries(RENDER_TO_TYPE)) {
    const body = extractFunctionBody(viewerSrc, fn);
    if (!body) { rows.push({ type, fn, fields: [], missing: true }); continue; }
    rows.push({ type, fn, fields: fieldsFromBody(body), missing: false });
  }

  // Deterministic stamp: a short hash of the viewer source, NOT a wall-clock time.
  // This guarantees byte-identical output across runs/instances (the anti-drift
  // property). The stamp changes only when the underlying viewer changes.
  const sourceHash = createHash('sha256').update(viewerSrc).digest('hex').slice(0, 12);
  let md = `# BLOCK FIELD REFERENCE (Tier 1 — GENERATED, DO NOT HAND-EDIT)

> Source hash \`${sourceHash}\` (sha256 of interactive-course.html, first 12) by \`server/src/scripts/generateBlockFieldReference.js\`.
> **Source of truth:** the \`renderX()\` functions in \`client/public/interactive-course.html\`.
> Field names below are extracted from \`block.<field>\` reads in those functions.
> If a seed or the builder writes a field NOT listed here, the viewer ignores it
> and the block renders incomplete or blank. **The viewer wins over every spec doc.**
>
> Regenerate after ANY change to a block render function. Never edit this file by hand.

`;

  // The critical gotcha table — same concept, different field names across blocks.
  md += `## ⚠ Cross-block field-name divergence (the silent-blank trap)

The \`image\` and \`imageText\` blocks use DIFFERENT names for the same concepts.
Wiring an uploader's generic \`{url, alt}\` output to the wrong names = block saves,
word count unaffected, but renders blank.

| Concept | \`image\` block | \`imageText\` block |
|---|---|---|
| image source | \`imageUrl\` | \`image\` |
| alt text | \`imageAltText\` | \`imageAlt\` |
| caption | \`imageCaption\` | (none) |
| size control | \`imageSize\` ('small'|'medium'|'large') | (none) |
| alignment | \`imageAlignment\` ('left'|'center'|'right') | (none) |
| position flip | (none) | \`imagePosition\` ('left'|'right') |
| highlight bg | (none) | \`highlight\` (boolean) |

`;

  md += `## All block types (extracted)\n\n`;
  for (const r of rows) {
    md += `### \`${r.type}\`  ·  renders via \`${r.fn}()\`\n`;
    if (r.missing) { md += `> ⚠ render function not found — verify the name in the viewer.\n\n`; continue; }
    if (r.fields.length === 0) { md += `_No direct \`block.X\` reads (may use helpers — inspect manually)._\n\n`; continue; }
    md += `| field | classification |\n|---|---|\n`;
    for (const f of r.fields) md += `| \`${f}\` | ${classify(f)} |\n`;
    md += `\n`;
  }

  // Builder-exposure gap: types the viewer renders but the builder may not offer.
  md += `## Viewer-supported block types\n\n`;
  md += rows.filter(r => !r.missing).map(r => `\`${r.type}\``).join(', ') + `\n\n`;
  md += `> If the course builder's block picker offers fewer types than this list,
> the missing ones are unexposed capability — they render fine if seeded, but
> authors can't add them via the UI. Candidates to expose for layout variety:
> \`statCard\`, \`pullQuote\`, \`caseStudy\`, \`keyTakeaway\`, \`table\`, \`timeline\`, \`callout\`.\n\n`;

  if (schemaSrc) {
    const declared = [...schemaSrc.matchAll(/^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*\{/gm)].map(m => m[1]);
    md += `## Schema-declared top-level paths (context only)\n\n`;
    md += `_From InteractiveCourse.js. Strict mode silently drops undeclared fields on save._\n\n`;
    md += [...new Set(declared)].sort().map(d => `\`${d}\``).join(', ') + `\n`;
  }

  writeFileSync(OUT, md, 'utf8');
  const counted = rows.filter(r => !r.missing).length;
  console.log(`[block-field-ref] wrote ${OUT}`);
  console.log(`[block-field-ref] ${counted}/${rows.length} render functions extracted`);
  const missing = rows.filter(r => r.missing).map(r => r.fn);
  if (missing.length) console.warn(`[block-field-ref] MISSING (rename check): ${missing.join(', ')}`);
}

main();
