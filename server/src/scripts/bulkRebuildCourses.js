/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
#!/usr/bin/env node
/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  CounselorReady — Bulk Course Rebuilder v5                         ║
 * ║  Complete rebuild pipeline with APA 7 structure enforcement        ║
 * ║                                                                     ║
 * ║  Phase 0: Pre-process (split single-section courses, strip metadata)║
 * ║  Phase 1: Local quality enforcement (headings, preamble, format)   ║
 * ║  Phase 2: API generates missing interactive blocks only            ║
 * ║  Phase 3: API word expansion (only if under target)                ║
 * ║  Phase 4: Final enforcement + APA 7 heading rewrite               ║
 * ║                                                                     ║
 * ║  node src/scripts/bulkRebuildCourses.js --slug=beautiful-mind      ║
 * ║  node src/scripts/bulkRebuildCourses.js --dry-run                  ║
 * ║  node src/scripts/bulkRebuildCourses.js --resume                   ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

import mongoose from 'mongoose';
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

// ════════════════════════════════════════════════════════════════════════
// QUARANTINE GUARD (added May 2026 after block-type incident review)
// ────────────────────────────────────────────────────────────────────────
// This script overwrites course content via the Anthropic API and writes
// the result back to MongoDB via $set on `interactivecourses`. It filters
// AI-generated blocks against VALID_BLOCK_TYPES below — any block type
// missing from that Set is silently dropped. The Set has been corrected
// to match the schema enum, but accidental drift is a recurring failure
// mode, so the script refuses to run without an explicit ack flag.
//
// Before running:
//   1. Re-verify VALID_BLOCK_TYPES below matches the schema enum in
//      server/src/models/InteractiveCourse.js
//   2. Back up the interactivecourses collection (Atlas snapshot)
//   3. Confirm no users are mid-lesson
//
// Then run with:  --i-acknowledge-data-risk
// ════════════════════════════════════════════════════════════════════════
const ACKNOWLEDGED = process.argv.includes('--i-acknowledge-data-risk');
if (!ACKNOWLEDGED) {
  console.error('');
  console.error('  ⛔ bulkRebuildCourses.js is QUARANTINED.');
  console.error('');
  console.error('  This script overwrites course content and has dropped block');
  console.error('  types in past runs. Verify VALID_BLOCK_TYPES is current,');
  console.error('  back up the collection, then re-run with:');
  console.error('');
  console.error('    --i-acknowledge-data-risk');
  console.error('');
  process.exit(1);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROGRESS_FILE = path.join(__dirname, '.rebuild_progress.json');

const MONGODB_URI = process.env.MONGODB_URI;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const DRY_RUN = process.argv.includes('--dry-run');
const RESUME = process.argv.includes('--resume');
const SLUG_ARG = process.argv.find(a => a.startsWith('--slug='))?.split('=')[1];

if (!MONGODB_URI) { console.error('❌ MONGODB_URI not set'); process.exit(1); }
if (!ANTHROPIC_API_KEY) { console.error('❌ ANTHROPIC_API_KEY not set'); process.exit(1); }

const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
const SKIP_SLUGS = ['the-elephant-in-the-room-navigating-difficult-conversations-in-therapy'];
const API_DELAY = 3000;
const WORDS_PER_CE_HOUR = 6000;

const PRESENTER = {
  name: "Kejuiana Johnson", credentials: "MA, LPC, NCC, CPCS, BC-TMH",
  degree: "MA", licenseNumber: "LPC009587", licenseState: "Georgia",
  qualificationStatement: "Licensed Professional Counselor with extensive experience in clinical practice, supervision, and continuing education development.",
  category: "category1"
};

// ═══════════════════════════════════════════════════════════════════
// CONSTANTS: Quality patterns
// ═══════════════════════════════════════════════════════════════════

const BANNED_HEADINGS = new Set([
  'introduction', 'theoretical foundation', 'theoretical framework',
  'key concepts', 'key concepts and definitions', 'practical application',
  'practical applications', 'practical guidelines', 'overview', 'summary',
  'summary and key takeaways', 'conclusion', 'learning objectives',
  'course overview', 'module overview', 'section overview',
  'background', 'literature review', 'discussion',
  'clinical implications', 'clinical applications',
  'evidence base and research', 'evidence base',
  'case study', 'case studies', 'case example', 'case examples',
  'ethical considerations', 'cultural considerations',
  'review', 'review questions', 'key terms', 'key takeaways',
  'objectives', 'what you will learn', "what you'll learn"
]);

const PREAMBLE_PATTERNS = [
  /in this (?:lesson|section|module),?\s+you will (?:learn|explore|discover|examine|understand|gain)/i,
  /this (?:lesson|section|module) (?:will|provides|covers|explores|examines|focuses)/i,
  /by the end of this (?:lesson|section|module)/i,
  /welcome to (?:this|the) (?:lesson|section|module)/i,
  /let(?:'s| us) begin (?:by|with|our)/i,
  /the purpose of this (?:lesson|section|module)/i,
  /this (?:lesson|section|module) is designed to/i,
  /upon completion of this/i,
  /the concepts explored here/i,
  /the strategies presented here/i,
  /the knowledge (?:gained|presented|explored) (?:here|in this)/i,
  /these skills are fundamental to your clinical practice/i,
];

// Metadata patterns — course title, provider info, CE lines, numbered objectives
const METADATA_PATTERNS = {
  providerLine: /(?:CounselorReady|NBCC|ACEP|Provider\s*#?\s*7760|GA Integrated|GAITP)/i,
  ceLine: /\d+\s*CE\s*(?:Hour|Credit|Unit)/i,
  objectiveList: /^\s*\d+\.\s+(?:Differentiate|Identify|Describe|Analyze|Evaluate|Apply|Demonstrate|Explain|Recognize|Compare|Examine|Assess|Develop|Implement|Integrate|Articulate|Formulate|Synthesize)/im,
  deliveryFormat: /(?:Delivery Format|Asynchronous|Online|Self-Paced)/i,
  contentArea: /(?:Content Area|NBCC Content|Professional Ethics|Clinical|Cultural)/i,
};

// ═══════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function stripHtml(html) { return (html || '').replace(/<[^>]+>/g, ' ').replace(/&\w+;/g, ' ').replace(/\s+/g, ' ').trim(); }
function countWords(text) { const p = stripHtml(text); return p ? p.split(/\s+/).filter(w => w.length > 0).length : 0; }
function countBlockWords(b) {
  let w = 0;
  if (b.textContent) w += countWords(b.textContent);
  if (b.content) w += countWords(b.content);
  if (b.accordionItems) b.accordionItems.forEach(ai => { w += countWords(ai.content); });
  return w;
}
function countSectionWords(s) { return (s.contentBlocks || []).reduce((sum, b) => sum + countBlockWords(b), 0); }
function countCourseWords(ss) { return (ss || []).reduce((sum, s) => sum + countSectionWords(s), 0); }
function loadProgress() { try { return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8')); } catch(e) { return { completed: [], failed: [] }; } }
function saveProgress(p) { fs.writeFileSync(PROGRESS_FILE, JSON.stringify(p, null, 2)); }
function getBlockHtml(b) { return b.content || b.textContent || ''; }
function setBlockHtml(b, html) { b.content = html; b.textContent = html; }

// Normalize text fields: ensure content and textContent are synced (player prefers content)
function normalizeTextFields(course) {
  let fixed = 0;
  for (const s of (course.sections || [])) {
    for (const b of (s.contentBlocks || [])) {
      if (b.type !== 'text') continue;
      const html = b.content || b.textContent || '';
      if (html) {
        b.content = html;
        b.textContent = html;
        fixed++;
      }
    }
  }
  return fixed;
}

// Valid block types the course player can render
const VALID_BLOCK_TYPES = new Set([
  // Canonical schema enum — kept in sync with server/src/models/InteractiveCourse.js.
  // If the schema enum changes, update this Set in the same PR.
  'accordion','callout','cardSort','clinicalVignette','deliverables',
  'fillInBlank','flashcardDeck','hotspot','image','imageText',
  'keyTakeaway','knowledgeCheck','matching','multiSelect','multipleChoice',
  'quiz','references','reflection','resources','scenarioTree',
  'sectionDivider','sequencing','text','timeline','video','videoEmbed',
  // Legacy aliases — Tech Manual §10.2 documents these as forgiven by the
  // viewer. Kept here so the AI filter doesn't strip pre-existing data
  // that happens to use them.
  'flashcards','categorization','imageBlock'
]);

function targetSectionCount(ceHours) {
  if (ceHours <= 1) return 3;
  if (ceHours <= 2) return 5;
  if (ceHours <= 3) return 6;
  if (ceHours <= 4) return 7;
  if (ceHours <= 5) return 8;
  if (ceHours <= 6) return 9;
  if (ceHours <= 7) return 11;
  return 12;
}

// ═══════════════════════════════════════════════════════════════════
// PHASE 0: PRE-PROCESSING — section splitting + metadata stripping
// ═══════════════════════════════════════════════════════════════════

/**
 * Strip embedded metadata from the first text block of a course.
 * This is landing page data (title, provider, CE, objectives) that
 * got baked into the course content. Returns count of paragraphs removed.
 */
function stripEmbeddedMetadata(course) {
  const sections = course.sections || [];
  if (!sections.length) return 0;
  const firstSection = sections[0];
  const firstText = (firstSection.contentBlocks || []).find(b => b.type === 'text' && (b.textContent || b.content));
  if (!firstText) return 0;

  let html = getBlockHtml(firstText);
  let removed = 0;
  const courseTitle = (course.title || '').toLowerCase();

  // Remove paragraphs that match metadata patterns
  html = html.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (match, inner) => {
    const plain = stripHtml(inner).trim();
    const plainLower = plain.toLowerCase();

    // Course title or close match
    if (plainLower === courseTitle || (courseTitle.length > 20 && plainLower.includes(courseTitle.substring(0, 20)))) {
      removed++; return '';
    }
    // "CounselorReady Continuing Education Course" or similar
    if (METADATA_PATTERNS.providerLine.test(plain) && plain.length < 200) {
      removed++; return '';
    }
    // "1 CE Hour | NBCC Approved Provider #7760"
    if (METADATA_PATTERNS.ceLine.test(plain) && plain.length < 150) {
      removed++; return '';
    }
    // "Delivery Format: Asynchronous Online"
    if (METADATA_PATTERNS.deliveryFormat.test(plain) && plain.length < 100) {
      removed++; return '';
    }
    // "Content Area: Clinical"
    if (METADATA_PATTERNS.contentArea.test(plain) && plain.length < 100) {
      removed++; return '';
    }
    return match;
  });

  // Remove numbered objective lists (often <ol> or consecutive numbered <p> tags)
  html = html.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (match, inner) => {
    if (METADATA_PATTERNS.objectiveList.test(stripHtml(inner))) {
      removed++; return '';
    }
    return match;
  });

  // Also catch objectives as consecutive <p>1. Differentiate...</p> patterns
  // Look for a run of 3+ consecutive <p> tags starting with numbered Bloom's verbs
  const pTags = [];
  html.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (match, inner, offset) => {
    pTags.push({ match, inner: stripHtml(inner), offset });
  });

  let objectiveRun = [];
  for (const p of pTags) {
    if (/^\s*\d+\.\s+(?:Differentiate|Identify|Describe|Analyze|Evaluate|Apply|Demonstrate|Explain|Recognize|Compare|Examine|Assess|Develop|Implement)/i.test(p.inner)) {
      objectiveRun.push(p);
    } else {
      if (objectiveRun.length >= 3) {
        objectiveRun.forEach(op => { html = html.replace(op.match, ''); removed++; });
      }
      objectiveRun = [];
    }
  }
  if (objectiveRun.length >= 3) {
    objectiveRun.forEach(op => { html = html.replace(op.match, ''); removed++; });
  }

  if (removed > 0) {
    html = html.replace(/^\s*(<br\s*\/?>|\s)*/, '').trim();
    setBlockHtml(firstText, html);
  }
  return removed;
}

/**
 * Split a single-section course into multiple sections at heading boundaries.
 * Only operates if section count is below target. Returns new section count.
 */
function splitSections(course) {
  const sections = course.sections || [];
  const target = targetSectionCount(course.ceHours || 1);

  if (sections.length >= target) return sections.length;

  // Collect ALL text content across all existing sections
  const allBlocks = [];
  sections.forEach(s => {
    (s.contentBlocks || []).forEach(b => allBlocks.push(b));
  });

  // Find heading split points in text blocks
  const splitPoints = []; // indices into allBlocks where new sections should start
  splitPoints.push(0); // first section always starts at 0

  allBlocks.forEach((b, i) => {
    if (b.type !== 'text') return;
    const html = getBlockHtml(b);
    // Look for h2 or h3 that could be section boundaries
    if (/<h[23][^>]*>/i.test(html) && i > 0) {
      // Only split if we haven't just split
      const lastSplit = splitPoints[splitPoints.length - 1];
      if (i - lastSplit >= 2) { // at least 2 blocks between splits
        splitPoints.push(i);
      }
    }
  });

  // If we don't have enough split points, try splitting large text blocks
  if (splitPoints.length < target) {
    // Find the largest text blocks and split them at h3/h4 boundaries
    for (let i = 0; i < allBlocks.length && splitPoints.length < target; i++) {
      if (allBlocks[i].type !== 'text') continue;
      const html = getBlockHtml(allBlocks[i]);
      const words = countWords(html);
      if (words > 2000 && !splitPoints.includes(i)) {
        // Split this block at the first h3/h4
        const h3Match = html.match(/(<h[34][^>]*>)/i);
        if (h3Match) {
          const splitIdx = html.indexOf(h3Match[0]);
          if (splitIdx > 200) { // ensure first half has substance
            const part1 = html.substring(0, splitIdx);
            const part2 = html.substring(splitIdx);
            
            // Replace the block with part1
            setBlockHtml(allBlocks[i], part1);
            
            // Insert new block for part2
            const newBlock = { type: 'text', order: 0 };
            if (allBlocks[i].textContent !== undefined) newBlock.textContent = part2;
            else newBlock.content = part2;
            allBlocks.splice(i + 1, 0, newBlock);
            
            splitPoints.push(i + 1);
            splitPoints.sort((a, b) => a - b);
          }
        }
      }
    }
  }

  // Limit to target count
  while (splitPoints.length > target) splitPoints.pop();

  if (splitPoints.length <= 1) return sections.length; // couldn't split

  // Extract section titles from first heading in each split
  const newSections = [];
  for (let si = 0; si < splitPoints.length; si++) {
    const start = splitPoints[si];
    const end = si + 1 < splitPoints.length ? splitPoints[si + 1] : allBlocks.length;
    const sectionBlocks = allBlocks.slice(start, end);

    // Try to extract title from first h2/h3
    let title = `Section ${si + 1}`;
    const firstTextBlock = sectionBlocks.find(b => b.type === 'text');
    if (firstTextBlock) {
      const html = getBlockHtml(firstTextBlock);
      const titleMatch = html.match(/<h[23][^>]*>(.*?)<\/h[23]>/i);
      if (titleMatch) {
        title = stripHtml(titleMatch[1]).trim();
        // Remove the heading from the content since it becomes section.title
        const cleaned = html.replace(titleMatch[0], '');
        setBlockHtml(firstTextBlock, cleaned);
      }
    }

    // Renumber blocks
    sectionBlocks.forEach((b, i) => { b.order = i + 1; });

    newSections.push({
      title,
      description: '',
      order: si + 1,
      estimatedTime: Math.ceil((course.ceHours * 60) / splitPoints.length),
      hasQuiz: false,
      quizQuestions: [],
      contentBlocks: sectionBlocks
    });
  }

  course.sections = newSections;
  return newSections.length;
}

// ═══════════════════════════════════════════════════════════════════
// PHASE 1: LOCAL QUALITY ENFORCEMENT
// ═══════════════════════════════════════════════════════════════════

function enforceLocalQuality(section, sectionIndex) {
  const fixes = [];
  if (!section.contentBlocks) section.contentBlocks = [];

  // 1. Remove redundant sectionDividers
  const before = section.contentBlocks.length;
  section.contentBlocks = section.contentBlocks.filter(b => {
    if (b.type !== 'sectionDivider') return true;
    const dt = (b.title || '').toLowerCase().replace(/module \d+[:\s]*/i, '').trim();
    const st = (section.title || '').toLowerCase().replace(/module \d+[:\s]*/i, '').trim();
    return dt !== st && !dt.includes(st) && !st.includes(dt) && dt.length >= 3;
  });
  if (section.contentBlocks.length < before) fixes.push(`-${before - section.contentBlocks.length} divider`);

  // 2. Remove banned generic headings from text blocks
  section.contentBlocks.forEach(b => {
    if (b.type !== 'text') return;
    let html = getBlockHtml(b);
    if (!html) return;
    let changed = false;

    html = html.replace(/<(h[2-4])([^>]*)>(.*?)<\/\1>/gi, (match, tag, attrs, content) => {
      const clean = content.replace(/<[^>]+>/g, '').trim().toLowerCase();
      if (BANNED_HEADINGS.has(clean)) { changed = true; return ''; }
      // Remove "Module X:" prefix
      if (/^module\s+\d+\s*[:\-–—]/i.test(clean)) {
        changed = true;
        return `<${tag}${attrs}>${content.replace(/^module\s+\d+\s*[:\-–—]\s*/i, '')}</${tag}>`;
      }
      return match;
    });

    // Fix ALL CAPS headings → title case
    html = html.replace(/<(h[2-4])([^>]*)>([A-Z\s:,&;]{10,})<\/\1>/g, (match, tag, attrs, content) => {
      const tc = content.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
        .replace(/\b(And|Of|The|In|For|To|A|An|By|With|Or|At|On)\b/g, m => m.toLowerCase())
        .replace(/^./, c => c.toUpperCase());
      changed = true;
      return `<${tag}${attrs}>${tc}</${tag}>`;
    });

    if (changed) { setBlockHtml(b, html); fixes.push('fixed headings'); }
  });

  // 3. Remove preamble paragraphs from first text block
  const firstText = section.contentBlocks.find(b => b.type === 'text' && (b.textContent || b.content));
  if (firstText) {
    let html = getBlockHtml(firstText);
    let changed = false;
    PREAMBLE_PATTERNS.forEach(pattern => {
      const pRe = new RegExp(`<p[^>]*>[^<]*?${pattern.source}[^<]*?</p>`, 'gi');
      const newHtml = html.replace(pRe, '');
      if (newHtml !== html) { html = newHtml; changed = true; }
    });
    if (changed) { setBlockHtml(firstText, html.replace(/^\s*(<br\s*\/?>|\s)*/, '').trim()); fixes.push('removed preamble'); }
  }

  // 4. Fix quiz options: string[] → {text, isCorrect}[]
  section.contentBlocks.forEach(b => {
    if ((b.type === 'multipleChoice' || b.type === 'multiSelect') && b.options) {
      if (b.options.some(o => typeof o === 'string')) {
        b.options = b.options.map((o, i) => typeof o === 'string' ? { text: o, isCorrect: i === (b.correctAnswer || 0) } : o);
        delete b.correctAnswer;
        fixes.push('fixed options');
      }
      if (b.type === 'multipleChoice') {
        const cc = b.options.filter(o => o.isCorrect).length;
        if (cc === 0 && b.options.length) { b.options[0].isCorrect = true; }
        if (cc > 1) { let f = false; b.options.forEach(o => { if (o.isCorrect && f) o.isCorrect = false; if (o.isCorrect) f = true; }); }
      }
    }
  });

  // 5. Remove truly empty text blocks (check BOTH fields)
  section.contentBlocks = section.contentBlocks.filter(b => {
    if (b.type === 'text') {
      const t = (b.textContent && stripHtml(b.textContent).length >= 10) ||
                (b.content && stripHtml(b.content).length >= 10);
      return t;
    }
    return true;
  });

  // 6. Renumber + ensure fields
  section.contentBlocks.forEach((b, i) => { b.order = i + 1; });
  section.order = sectionIndex + 1;
  section.hasQuiz = section.hasQuiz || false;
  section.quizQuestions = section.quizQuestions || [];

  return fixes;
}

// ═══════════════════════════════════════════════════════════════════
// PHASE 4: APA 7 HEADING REWRITE — uses API only for this
// ═══════════════════════════════════════════════════════════════════

/**
 * Detect duplicate headings across sections and generate unique replacements.
 * This is the ONLY place where existing text goes to the API, and only the
 * headings — not the body content.
 */
async function rewriteDuplicateHeadings(course) {
  const sections = course.sections || [];
  
  // Collect all headings with location info
  const headingMap = {}; // heading text → [{sectionIndex, blockIndex, tag, fullMatch}]
  sections.forEach((s, si) => {
    (s.contentBlocks || []).filter(b => b.type === 'text').forEach((b, bi) => {
      const html = getBlockHtml(b);
      if (!html) return;
      const re = /<(h[2-4])([^>]*)>(.*?)<\/\1>/gi;
      let m;
      while ((m = re.exec(html)) !== null) {
        const key = stripHtml(m[3]).trim().toLowerCase();
        if (key.length < 4) continue;
        if (!headingMap[key]) headingMap[key] = [];
        headingMap[key].push({ si, bi, tag: m[1], attrs: m[2], content: m[3], fullMatch: m[0] });
      }
    });
  });

  // Find duplicates
  const duplicates = Object.entries(headingMap).filter(([k, v]) => v.length > 1);
  if (duplicates.length === 0) return 0;

  // Build a prompt asking for unique replacements
  const dupList = duplicates.map(([heading, locs]) => {
    return locs.map(l => `  Section "${sections[l.si].title}": "${heading}"`).join('\n');
  }).join('\n');

  const prompt = `These course section headings are duplicated across multiple sections. Generate a unique, topic-specific replacement for each one. Each replacement must be specific to that section's topic.

COURSE: "${course.title}"

DUPLICATED HEADINGS:
${dupList}

Return a JSON object mapping old headings to an array of replacements (one per section, in order):
{
  "old heading text": ["Replacement for Section 1", "Replacement for Section 2", ...]
}

Rules:
- Each replacement must be unique and specific to that section's content
- Use APA 7 title case (capitalize major words, lowercase minor words like and, of, the, in, for)
- No generic headings (Introduction, Overview, Summary, Key Concepts, etc.)
- Keep replacements concise (3-8 words)
- Make them sound like chapter subsections in a graduate textbook`;

  try {
    const replacements = await callClaude(prompt, 2000);
    let replaced = 0;

    for (const [oldHeading, newHeadings] of Object.entries(replacements || {})) {
      const locs = headingMap[oldHeading.toLowerCase()];
      if (!locs || !Array.isArray(newHeadings)) continue;

      locs.forEach((loc, i) => {
        if (i >= newHeadings.length) return;
        const block = sections[loc.si].contentBlocks.filter(b => b.type === 'text')[loc.bi];
        if (!block) return;
        let html = getBlockHtml(block);
        html = html.replace(loc.fullMatch, `<${loc.tag}${loc.attrs}>${newHeadings[i]}</${loc.tag}>`);
        setBlockHtml(block, html);
        replaced++;
      });
    }
    await sleep(API_DELAY);
    return replaced;
  } catch (e) {
    console.log(`     ⚠️ Heading rewrite failed: ${e.message}`);
    return 0;
  }
}

// ═══════════════════════════════════════════════════════════════════
// API
// ═══════════════════════════════════════════════════════════════════

const GEN_SYSTEM = `You generate interactive course elements for NBCC ACEP-approved graduate-level mental health CE courses. 

APA 7 formatting rules for all generated content:
- Headings use title case: capitalize major words, lowercase articles/prepositions (and, of, the, in, for, to, a, an, by, with, or, at, on)
- Never use ALL CAPS headings
- Never use generic headings (Introduction, Overview, Summary, Key Concepts)
- Clinical vignettes use diverse named clients
- Reference DSM-5-TR criteria by number where applicable
- Cite evidence-based practices with author names and years
- Use <p>, <h3>, <h4>, <ul>, <li>, <strong>, <em>, <blockquote> tags

Output ONLY valid JSON. No markdown, no backticks, no explanation.`;

async function callClaude(prompt, maxTokens = 4000) {
  let attempts = 0;
  let text = '';
  while (attempts < 3) {
    try {
      const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: maxTokens,
        system: GEN_SYSTEM,
        messages: [{ role: 'user', content: prompt }]
      });
      text = response.content.filter(c => c.type === 'text').map(c => c.text).join('');
      let cleaned = text.trim();
      if (cleaned.startsWith('```')) cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
      const parsed = JSON.parse(cleaned);
      // Filter invalid block types from API-generated arrays
      if (Array.isArray(parsed)) return parsed.filter(b => !b.type || VALID_BLOCK_TYPES.has(b.type));
      return parsed;
    } catch (err) {
      attempts++;
      if (err.status === 429) { console.log(`    ⏳ Rate limit, 60s...`); await sleep(60000); }
      else if (err instanceof SyntaxError) {
        console.log(`    ⚠️ JSON parse (${attempts}/3) — raw response: ${(text || '').substring(0, 300)}...`);
        if (attempts >= 3) throw err; await sleep(API_DELAY);
      }
      else { console.log(`    ⚠️ ${err.message} (${attempts}/3)`); if (attempts >= 3) throw err; await sleep(API_DELAY * 2); }
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
// PHASE 2: Generate missing interactive blocks
// ═══════════════════════════════════════════════════════════════════

// Knowledge check types (graded, count for ACEP compliance)
const KC_TYPES = new Set(['multipleChoice', 'multiSelect', 'matching', 'cardSort', 'sequencing', 'timeline']);
// Engagement types (interactive but not graded)
const ENGAGE_TYPES = new Set(['accordion', 'scenarioTree', 'flashcardDeck', 'reflection']);

// Rotation patterns — KC first for ACEP, then engagement variety
const KC_ROTATION = ['multipleChoice', 'multiSelect', 'matching', 'cardSort', 'sequencing'];
const ENGAGE_ROTATION = ['accordion', 'scenarioTree', 'flashcardDeck', 'reflection'];

async function generateMissingBlocks(course, section, sectionIndex, totalSections) {
  const blocks = section.contentBlocks || [];
  const isLast = sectionIndex === totalSections - 1;

  // Count existing interactive elements
  const existingKC = blocks.filter(b => KC_TYPES.has(b.type)).length;
  const existingEngage = blocks.filter(b => ENGAGE_TYPES.has(b.type)).length;
  const existingTypes = new Set(blocks.map(b => b.type));
  const hasResources = blocks.some(b => b.type === 'resources' && b.resources?.length > 0);

  // Build request list: 2-3 KC for ACEP + 1-2 engagement for variety
  const requests = [];
  const blocksToGenerate = [];

  // KC priority: need at least 2 per section for ACEP
  const kcNeeded = Math.max(0, 2 - existingKC);
  let kcIdx = 0;
  for (let i = 0; i < kcNeeded; i++) {
    // Pick KC type not already present, cycling through rotation
    let type = KC_ROTATION[kcIdx % KC_ROTATION.length];
    let tries = 0;
    while (existingTypes.has(type) && tries < KC_ROTATION.length) { kcIdx++; type = KC_ROTATION[kcIdx % KC_ROTATION.length]; tries++; }
    kcIdx++;
    blocksToGenerate.push(type);
    existingTypes.add(type);
  }

  // Engagement: add 1-2 if section lacks variety
  const engageNeeded = Math.max(0, 1 - existingEngage);
  let engIdx = (sectionIndex * 2) % ENGAGE_ROTATION.length; // offset per section for variety across course
  for (let i = 0; i < engageNeeded + 1; i++) {
    let type = ENGAGE_ROTATION[engIdx % ENGAGE_ROTATION.length];
    let tries = 0;
    while (existingTypes.has(type) && tries < ENGAGE_ROTATION.length) { engIdx++; type = ENGAGE_ROTATION[engIdx % ENGAGE_ROTATION.length]; tries++; }
    if (tries < ENGAGE_ROTATION.length) {
      engIdx++;
      blocksToGenerate.push(type);
      existingTypes.add(type);
    }
  }

  // Resources on last section only
  if (isLast && !hasResources) blocksToGenerate.push('resources');

  if (!blocksToGenerate.length) return [];

  // Build generation requests with type-specific instructions
  const typeInstructions = {
    multipleChoice: 'a multipleChoice block testing clinical APPLICATION. 4 options, 1 correct, with clinical scenario and rationale.',
    multiSelect: 'a multiSelect block where 2+ answers are correct. Clinical scenario, 4-5 options, clear rationale for each correct answer.',
    matching: 'a matching exercise with 5-6 term/definition pairs from the section content.',
    cardSort: 'a cardSort exercise with 2-3 categories and 6-8 cards that learners sort into the correct category.',
    sequencing: 'a sequencing exercise with 5-6 steps of a clinical process that must be ordered correctly.',
    timeline: 'a timeline exercise with 5-6 events related to the topic that must be ordered chronologically.',
    accordion: 'an accordion with 4-5 expandable panels, each exploring a sub-topic in depth (2-3 paragraphs per panel).',
    scenarioTree: 'a scenarioTree with a clinical scenario (3-4 decision points, 2-3 choices each, leading to different outcomes with clinical feedback).',
    flashcardDeck: 'a flashcardDeck with 8-10 cards testing key terms and concepts (front=term/question, back=definition/answer).',
    reflection: 'a reflection block prompting clinical self-examination with context paragraph.',
    resources: `a resources block with 5-6 real professional resources (use real URLs: APA.org, SAMHSA.gov, NIMH.nih.gov, NBCC.org, etc.) related to ${course.title}.`,
  };

  blocksToGenerate.forEach((type, i) => {
    requests.push(`${i + 1}. Generate ${typeInstructions[type]}`);
  });

  const topicSummary = stripHtml(
    blocks.filter(b => b.type === 'text').map(b => getBlockHtml(b)).join(' ')
  ).substring(0, 1500);

  const prompt = `Generate interactive elements for a CE course section.

COURSE: "${course.title}" (${course.ceHours} CE)
SECTION: "${section.title}"
TOPIC: ${topicSummary}

GENERATE (return JSON array):
${requests.join('\n')}

Block JSON formats (use EXACTLY these structures):

- multipleChoice: {"type":"multipleChoice","order":1,"question":"Clinical scenario?","options":[{"text":"A","isCorrect":false},{"text":"B","isCorrect":true},{"text":"C","isCorrect":false},{"text":"D","isCorrect":false}],"explanation":"Rationale..."}

- multiSelect: {"type":"multiSelect","order":1,"question":"Which of the following apply?","options":[{"text":"A","isCorrect":true},{"text":"B","isCorrect":false},{"text":"C","isCorrect":true},{"text":"D","isCorrect":false}],"explanation":"Rationale..."}

- matching: {"type":"matching","order":1,"matchingInstructions":"Match each term...","matchingPairs":[{"term":"Term","definition":"Definition"}]}

- cardSort: {"type":"cardSort","order":1,"instructions":"Sort these into the correct category.","categories":["Category 1","Category 2"],"cards":[{"id":"c1","text":"Item text","correctCategory":"Category 1"},{"id":"c2","text":"Item text","correctCategory":"Category 2"}],"explanation":"Rationale..."}

- sequencing: {"type":"sequencing","order":1,"instructions":"Put these steps in the correct order.","steps":[{"id":"s1","text":"First step","order":1},{"id":"s2","text":"Second step","order":2}],"explanation":"Rationale..."}

- timeline: {"type":"timeline","order":1,"instructions":"Order these events chronologically.","events":[{"id":"t1","text":"Event description","year":"1950","order":1},{"id":"t2","text":"Event description","year":"1970","order":2}],"explanation":"Rationale..."}

- accordion: {"type":"accordion","order":1,"accordionItems":[{"title":"Panel Title","content":"<p>Rich HTML content with 2-3 paragraphs...</p>"}]}

- scenarioTree: {"type":"scenarioTree","order":1,"scenarioTitle":"Clinical Scenario Title","startNode":"start","nodes":{"start":{"text":"<p>Client presents with...</p>","choices":[{"text":"Option A","next":"nodeA"},{"text":"Option B","next":"nodeB"}]},"nodeA":{"text":"<p>Result of choice A...</p>","feedback":"<p>Clinical rationale...</p>"},"nodeB":{"text":"<p>Result of choice B...</p>","feedback":"<p>Clinical rationale...</p>"}}}

- flashcardDeck: {"type":"flashcardDeck","order":1,"instructions":"Review these key concepts.","flashcards":[{"id":"f1","front":"Term or Question","back":"Definition or Answer"}]}

- reflection: {"type":"reflection","order":1,"question":"Reflective prompt?","textContent":"<p>Context paragraph</p>","minLength":50}

- resources: {"type":"resources","order":1,"resources":[{"title":"Resource Name","url":"https://real-url.org","type":"website"}]}

Return ONLY: [ {block1}, {block2}, ... ]`;

  const newBlocks = await callClaude(prompt, 6000);
  await sleep(API_DELAY);
  
  const result = Array.isArray(newBlocks) ? newBlocks : [];
  // Fix option formats for MC/MS blocks
  result.forEach(b => {
    if ((b.type === 'multipleChoice' || b.type === 'multiSelect') && b.options) {
      b.options = b.options.map((o, j) => typeof o === 'string' ? { text: o, isCorrect: j === (b.correctAnswer || 0) } : o);
      delete b.correctAnswer;
    }
    // Ensure cardSort cards have IDs
    if (b.type === 'cardSort' && b.cards) {
      b.cards = b.cards.map((c, i) => ({ ...c, id: c.id || `c${i+1}` }));
    }
    // Ensure sequencing steps have IDs and order
    if (b.type === 'sequencing' && b.steps) {
      b.steps = b.steps.map((s, i) => ({ ...s, id: s.id || `s${i+1}`, order: s.order || i+1 }));
    }
    // Ensure timeline events have IDs and order
    if (b.type === 'timeline' && b.events) {
      b.events = b.events.map((e, i) => ({ ...e, id: e.id || `t${i+1}`, order: e.order || i+1 }));
    }
    // Ensure flashcards have IDs
    if (b.type === 'flashcardDeck' && b.flashcards) {
      b.flashcards = b.flashcards.map((f, i) => ({ ...f, id: f.id || `f${i+1}` }));
    }
    // Ensure scenarioTree has startNode
    if (b.type === 'scenarioTree' && b.nodes && !b.startNode) {
      b.startNode = Object.keys(b.nodes)[0] || 'start';
    }
  });
  return result;
}

// ═══════════════════════════════════════════════════════════════════
// PHASE 3: Word expansion
// ═══════════════════════════════════════════════════════════════════

async function generateExpansionText(course, section, deficit) {
  const topicSummary = stripHtml(
    (section.contentBlocks || []).filter(b => b.type === 'text').map(b => getBlockHtml(b)).join(' ')
  ).substring(0, 2000);

  const prompt = `Generate additional clinical content for a CE course section. Return ONE JSON text block object.

COURSE: "${course.title}"
SECTION: "${section.title}"
TOPIC SUMMARY: ${topicSummary}
WORDS NEEDED: ~${deficit}

Write rich clinical content that DEEPENS the existing material:
- Clinical vignette with named client (diverse background)
- Evidence-based research citations (author, year)
- Practical techniques clinicians can implement immediately
- DSM-5-TR diagnostic criteria where relevant
- APA 7 heading format (title case, topic-specific, NOT generic)

Return: {"type":"text","order":1,"textContent":"<p>Rich HTML...</p>"}`;

  const block = await callClaude(prompt, 7500);
  await sleep(API_DELAY);
  return block;
}

/**
 * Splice new blocks between existing text blocks at natural points
 */
function spliceBlocks(section, newBlocks) {
  if (!newBlocks.length) return;
  const existing = section.contentBlocks;
  const textIndices = existing.map((b, i) => b.type === 'text' ? i : -1).filter(i => i >= 0);

  if (!textIndices.length) {
    existing.push(...newBlocks);
  } else {
    const step = Math.max(1, Math.floor(textIndices.length / (newBlocks.length + 1)));
    const inserts = newBlocks.map((block, i) => ({
      afterIndex: textIndices[Math.min((i + 1) * step, textIndices.length - 1)],
      block
    }));
    inserts.sort((a, b) => b.afterIndex - a.afterIndex);
    inserts.forEach(({ afterIndex, block }) => { existing.splice(afterIndex + 1, 0, block); });
  }
  existing.forEach((b, i) => { b.order = i + 1; });
}

// ═══════════════════════════════════════════════════════════════════
// ASSESSMENT + METADATA
// ═══════════════════════════════════════════════════════════════════

async function fixAssessment(course, sectionTitles) {
  const existing = course.assessment?.questions || [];
  const needed = Math.max(15, course.ceHours * 5);

  existing.forEach(q => {
    if (q.options) { q.options = q.options.map((o, i) => typeof o === 'string' ? { text: o, isCorrect: i === (q.correctAnswer || 0) } : o); delete q.correctAnswer; }
    if (!q.type) q.type = 'multipleChoice';
  });

  if (existing.length >= needed) {
    console.log(`  ✅ Assessment: ${existing.length}q`);
    return course.assessment;
  }

  const deficit = needed - existing.length;
  const prompt = `Generate ${deficit} assessment questions for "${course.title}" (${course.ceHours} CE).
Sections: ${sectionTitles.join(', ')}
${existing.length ? `Already have ${existing.length}q — generate ${deficit} MORE.` : ''}

Return JSON array:
[{"question":"Clinical scenario?","type":"multipleChoice","options":[{"text":"A","isCorrect":false},{"text":"B","isCorrect":true},{"text":"C","isCorrect":false},{"text":"D","isCorrect":false}],"explanation":"Rationale..."}]

Clinical application focus. Cover all sections. 2+ ethics, 2+ cultural. 4 options, 1 correct.`;

  console.log(`  📝 Assessment: +${deficit}q...`);
  const newQs = await callClaude(prompt, 8000);
  await sleep(API_DELAY);

  const allQs = [...existing, ...(Array.isArray(newQs) ? newQs : [])];
  allQs.forEach(q => {
    if (q.options) { q.options = q.options.map((o, i) => typeof o === 'string' ? { text: o, isCorrect: i === (q.correctAnswer || 0) } : o); delete q.correctAnswer; }
    if (!q.type) q.type = 'multipleChoice';
  });

  console.log(`     → ${allQs.length}q`);
  return {
    title: course.assessment?.title || "Final Assessment",
    timeLimit: course.assessment?.timeLimit || course.ceHours * 10,
    passThreshold: 0.8, attemptsAllowed: 3, shuffleQuestions: true, shuffleOptions: true,
    questions: allQs
  };
}

async function fixMetadata(course) {
  const obj = course.objectives || [];
  const refs = course.references || [];
  if (obj.length >= 4 && refs.length >= 5) {
    console.log(`  ✅ Metadata: ${obj.length} obj, ${refs.length} refs`);
    return { objectives: obj, references: refs };
  }

  const prompt = `Generate metadata for CE course "${course.title}" (${course.ceHours} CE).
Sections: ${(course.sections||[]).map(s=>s.title).join(', ')}

Return JSON:
{"objectives":["Bloom's taxonomy: Analyze, Apply, Evaluate, Demonstrate..."],"references":[{"title":"Real text","author":"Author, A. B.","year":2020,"source":"Publisher or Journal. https://doi.org/..."}]}
${obj.length<4?'Need 5+ measurable objectives.':''} ${refs.length<5?'Need 6+ REAL references in APA 7 format.':''}`;

  console.log(`  📝 Metadata...`);
  const m = await callClaude(prompt, 3000);
  await sleep(API_DELAY);
  return { objectives: m?.objectives || obj, references: m?.references || refs };
}

// ═══════════════════════════════════════════════════════════════════
// VALIDATION
// ═══════════════════════════════════════════════════════════════════

function validate(data, ceHours) {
  const issues = [];
  const ss = data.sections || [];
  const w = countCourseWords(ss);
  const req = ceHours * WORDS_PER_CE_HOUR;
  if (w < req) issues.push(`WORDS:${w}/${req}`);
  if ((data.objectives?.length||0) < 4) issues.push(`OBJ:${data.objectives?.length||0}`);
  if ((data.references?.length||0) < 5) issues.push(`REFS:${data.references?.length||0}`);
  if ((data.assessment?.questions?.length||0) < 15) issues.push(`EXAM:${data.assessment?.questions?.length||0}`);

  ss.forEach((s, i) => {
    const kc = (s.contentBlocks||[]).filter(b => KC_TYPES.has(b.type)).length;
    if (kc < 2) issues.push(`S${i+1}KC:${kc}`);
  });

  const last = ss[ss.length-1]?.contentBlocks||[];
  if (!last.some(b => b.type==='resources'&&b.resources?.length)) issues.push('NO_RESOURCES');

  // Quality: banned headings remaining
  ss.forEach((s, i) => {
    (s.contentBlocks||[]).filter(b=>b.type==='text').forEach(b => {
      const html = getBlockHtml(b);
      if (!html) return;
      html.replace(/<h[2-4][^>]*>(.*?)<\/h[2-4]>/gi, (m, c) => {
        const clean = stripHtml(c).trim().toLowerCase();
        if (BANNED_HEADINGS.has(clean)) issues.push(`S${i+1}:HEADING:"${clean}"`);
      });
    });
  });

  // Quality: duplicate headings
  const allH = [];
  ss.forEach(s => {
    (s.contentBlocks||[]).filter(b=>b.type==='text').forEach(b => {
      (getBlockHtml(b)||'').replace(/<h[2-4][^>]*>(.*?)<\/h[2-4]>/gi, (m, c) => {
        const clean = stripHtml(c).trim().toLowerCase();
        if (clean.length > 3) allH.push(clean);
      });
    });
  });
  const hCounts = {};
  allH.forEach(h => { hCounts[h] = (hCounts[h]||0) + 1; });
  Object.entries(hCounts).forEach(([h, c]) => { if (c > 1) issues.push(`DUP:"${h}"×${c}`); });

  return issues;
}

// ═══════════════════════════════════════════════════════════════════
// REBUILD ONE COURSE
// ═══════════════════════════════════════════════════════════════════

async function rebuildCourse(course, db) {
  const ce = course.ceHours || 1;
  const sections = course.sections || [];
  const oldWords = countCourseWords(sections);
  const oldSectionCount = sections.length;

  console.log(`\n${'═'.repeat(70)}`);
  console.log(`🔨 ${course.title}`);
  console.log(`   ${course.slug} | ${ce}CE | ${oldWords}w/${ce*WORDS_PER_CE_HOUR}w (${Math.round(oldWords/(ce*WORDS_PER_CE_HOUR)*100)}%) | ${sections.length} sections`);
  console.log(`${'═'.repeat(70)}`);

  // ── Phase 0: Pre-processing ──
  console.log(`\n  🔧 Phase 0: Pre-processing...`);
  const normalized = normalizeTextFields(course);
  if (normalized) console.log(`     Normalized ${normalized} text blocks (content/textContent sync)`);

  const metaStripped = stripEmbeddedMetadata(course);
  if (metaStripped) console.log(`     Stripped ${metaStripped} embedded metadata paragraphs`);

  const newSectionCount = splitSections(course);
  if (newSectionCount !== oldSectionCount) {
    console.log(`     Split: ${oldSectionCount}→${newSectionCount} sections`);
  }

  // ── Phase 1: Local quality enforcement ──
  console.log(`\n  🔍 Phase 1: Local quality enforcement...`);
  course.sections.forEach((s, i) => {
    const wordsBefore = countSectionWords(s);
    const backup = JSON.parse(JSON.stringify(s));
    const fixes = enforceLocalQuality(s, i);
    const wordsAfter = countSectionWords(s);

    if (wordsBefore > 0 && wordsAfter < wordsBefore * 0.9) {
      console.log(`     ⛔ S${i+1}: ${wordsBefore}→${wordsAfter}w — ROLLED BACK`);
      Object.assign(s, backup);
      // Safe-only: strip dividers
      s.contentBlocks = (s.contentBlocks || []).filter(b => {
        if (b.type !== 'sectionDivider') return true;
        const dt = (b.title||'').toLowerCase().trim();
        const st = (s.title||'').toLowerCase().trim();
        return !dt.includes(st) && !st.includes(dt);
      });
      s.contentBlocks.forEach((b, j) => { b.order = j + 1; });
    } else if (fixes.length) {
      console.log(`     S${i+1} "${s.title}": ${fixes.join('; ')}${wordsAfter !== wordsBefore ? ` (${wordsBefore}→${wordsAfter}w)` : ''}`);
    }
  });

  // ── Phase 2: Generate missing elements ──
  console.log(`\n  🤖 Phase 2: Generate missing elements...`);
  for (let i = 0; i < course.sections.length; i++) {
    const s = course.sections[i];
    try {
      const newBlocks = await generateMissingBlocks(course, s, i, course.sections.length);
      if (newBlocks.length) {
        spliceBlocks(s, newBlocks);
        console.log(`     S${i+1}: +${newBlocks.length} (${newBlocks.map(b=>b.type).join(', ')})`);
      } else {
        console.log(`     S${i+1}: ✅`);
      }
    } catch (e) { console.log(`     S${i+1}: ⚠️ ${e.message}`); }
  }

  // ── Phase 3: Word expansion ──
  const midWords = countCourseWords(course.sections);
  const targetWords = ce * WORDS_PER_CE_HOUR;
  if (midWords < targetWords) {
    console.log(`\n  📝 Phase 3: Word expansion (${midWords}/${targetWords})...`);
    const perSection = Math.ceil(targetWords * 1.1 / course.sections.length);
    for (let i = 0; i < course.sections.length; i++) {
      const sw = countSectionWords(course.sections[i]);
      const deficit = perSection - sw;
      if (deficit > 500) {
        try {
          const expansion = await generateExpansionText(course, course.sections[i], deficit);
          if (expansion?.textContent || expansion?.content) {
            course.sections[i].contentBlocks.push(expansion);
            course.sections[i].contentBlocks.forEach((b, j) => { b.order = j + 1; });
            console.log(`     S${i+1}: +${countBlockWords(expansion)}w`);
          }
        } catch (e) { console.log(`     S${i+1}: ⚠️ ${e.message}`); }
      }
    }
  } else {
    console.log(`\n  ✅ Phase 3: Words OK (${midWords}/${targetWords})`);
  }

  // ── Phase 4: Final enforcement + heading rewrite ──
  console.log(`\n  🔍 Phase 4: Final enforcement + APA 7 headings...`);
  course.sections.forEach((s, i) => {
    const wb = countSectionWords(s);
    const bk = JSON.parse(JSON.stringify(s));
    enforceLocalQuality(s, i);
    if (wb > 0 && countSectionWords(s) < wb * 0.9) Object.assign(s, bk);
  });

  const replaced = await rewriteDuplicateHeadings(course);
  if (replaced > 0) console.log(`     Rewrote ${replaced} duplicate headings`);
  else console.log(`     ✅ No duplicate headings`);

  // Assessment
  let assessment;
  try { assessment = await fixAssessment(course, course.sections.map(s=>s.title)); }
  catch (e) { console.log(`  ❌ Assessment: ${e.message}`); assessment = course.assessment; }

  // Metadata
  let meta;
  try { meta = await fixMetadata({...course, sections: course.sections}); }
  catch (e) { meta = { objectives: course.objectives||[], references: course.references||[] }; }

  const refs = (meta.references||[]).map(r => {
    if (typeof r === 'string') return { formatted: r };
    return { ...r, formatted: `${r.author} (${r.year}). ${r.title}. ${r.source}.` };
  });

  const doc = {
    title: course.title, slug: course.slug, description: course.description,
    ceHours: ce, ceProvider: 'NBCC ACEP #7760', acepNumber: '7760',
    objectives: meta.objectives,
    targetAudience: course.targetAudience || ["Licensed Professional Counselors (LPC/LPCC)","Licensed Mental Health Counselors (LMHC)","Licensed Clinical Social Workers (LCSW)","Licensed Marriage and Family Therapists (LMFT)"],
    categories: course.categories||[], tags: course.tags||[],
    sections: course.sections, assessment, presenter: PRESENTER, references: refs,
    author: "GA Integrated Therapeutic Perspectives LLC",
    status: 'draft', updatedAt: new Date()
  };

  // Computed fields for admin dashboard display
  doc.wordCount = countCourseWords(course.sections);
  doc.sectionCount = course.sections.length;
  doc.moduleCount = course.sections.length;
  doc.assessmentQuestionCount = assessment?.questions?.length || 0;
  doc.totalEstimatedTime = course.sections.reduce(
    (sum, s) => sum + (s.estimatedTime || 20), 0);

  if (course.slug === 'aca-ethics-section-a-counseling-relationship' && course.title.includes('CBT')) {
    doc.slug = 'cbt-toolbox-core-techniques';
  }

  const finalWords = countCourseWords(course.sections);
  const issues = validate(doc, ce);

  console.log(`\n  📊 ${oldWords}w→${finalWords}w | ${oldSectionCount}→${course.sections.length} sections | ${assessment?.questions?.length||0}q | ${meta.objectives?.length||0} obj | ${refs.length} refs`);
  if (issues.length) console.log(`     ⚠️  ${issues.join(' | ')}`);
  else console.log(`     ✅ ACEP + APA 7 compliant`);

  if (!DRY_RUN) {
    await db.collection('interactivecourses').updateOne({_id: course._id}, {$set: doc});
    console.log(`  💾 Saved (draft)`);
  }

  return { slug: doc.slug, title: doc.title, before: oldWords, after: finalWords, sections: course.sections.length, issues, exam: assessment?.questions?.length||0 };
}

// ═══════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════

async function main() {
  console.log(`\n╔══════════════════════════════════════════════════════════════════════╗`);
  console.log(`║  CounselorReady — Bulk Course Rebuilder v5                         ║`);
  console.log(`║  Pre-process + Local QA + API elements + APA 7 headings            ║`);
  if (DRY_RUN) console.log(`║  ⚠️  DRY RUN                                                       ║`);
  if (RESUME) console.log(`║  ♻️  RESUME                                                         ║`);
  console.log(`╚══════════════════════════════════════════════════════════════════════╝\n`);

  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;
  console.log('✅ MongoDB connected\n');

  const progress = RESUME ? loadProgress() : { completed: [], failed: [] };
  let courses = await db.collection('interactivecourses').find({}).toArray();
  courses = courses.filter(c => !SKIP_SLUGS.includes(c.slug));
  courses = courses.filter(c => {
    if (!c.ceHours || c.ceHours <= 0) { console.log(`   SKIP: ${c.slug} (0 CE hours — empty shell)`); return false; }
    if (!c.sections || c.sections.length === 0) { console.log(`   SKIP: ${c.slug} (no sections)`); return false; }
    return true;
  });

  if (SLUG_ARG) {
    courses = courses.filter(c => c.slug.includes(SLUG_ARG));
    if (!courses.length) { console.log(`❌ No match: "${SLUG_ARG}"`); process.exit(1); }
  }
  if (RESUME) {
    courses = courses.filter(c => !progress.completed.includes(c.slug));
    console.log(`♻️  ${progress.completed.length} done, ${courses.length} remaining\n`);
  }

  courses.sort((a, b) => (a.ceHours||1) - (b.ceHours||1));

  console.log(`📋 ${courses.length} courses:`);
  courses.forEach((c, i) => {
    const w = countCourseWords(c.sections||[]);
    console.log(`   ${i+1}. [${c.ceHours||1}CE] ${c.title} (${Math.round(w/((c.ceHours||1)*WORDS_PER_CE_HOUR)*100)}% | ${c.sections?.length||0} sections)`);
  });

  const results = [];
  let ok = 0, fail = 0;

  for (let i = 0; i < courses.length; i++) {
    try {
      const r = await rebuildCourse(courses[i], db);
      results.push(r); progress.completed.push(courses[i].slug);
      saveProgress(progress); ok++;
      console.log(`  ⏱️  ${i+1}/${courses.length}\n`);
    } catch (e) {
      console.log(`  ❌ FAILED: ${e.message}\n`);
      results.push({slug:courses[i].slug,title:courses[i].title,error:e.message});
      progress.failed.push({slug:courses[i].slug,error:e.message});
      saveProgress(progress); fail++;
    }
  }

  console.log(`\n${'═'.repeat(70)}`);
  console.log(`COMPLETE — ${ok} rebuilt, ${fail} failed, ${SKIP_SLUGS.length} skipped`);
  console.log(`${'═'.repeat(70)}\n`);
  results.forEach(r => {
    if (r.error) console.log(`  ❌ ${r.title}: ${r.error}`);
    else console.log(`  ${r.issues?.length?'⚠️':'✅'} ${r.title}: ${r.before}w→${r.after}w | ${r.sections}s | ${r.exam}q${r.issues?.length?' | '+r.issues.join(', '):''}`);
  });

  if (!DRY_RUN) console.log(`\n📋 All saved as DRAFT.`);
  if (!fail&&!SLUG_ARG) try{fs.unlinkSync(PROGRESS_FILE);}catch(e){}
  await mongoose.disconnect();
  console.log('\n✅ Done!');
}

main().catch(e => { console.error('💥', e.message); process.exit(1); });
