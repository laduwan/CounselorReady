#!/usr/bin/env node
/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  CounselorReady — Bulk Course Rebuilder v3                         ║
 * ║  Restructures + enforces graduate-level academic quality locally   ║
 * ║                                                                     ║
 * ║  node src/scripts/bulkRebuildCourses.js --slug=therapeutic-rapport ║
 * ║  node src/scripts/bulkRebuildCourses.js --resume                   ║
 * ║  node src/scripts/bulkRebuildCourses.js --dry-run                  ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

import mongoose from 'mongoose';
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

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
const API_DELAY = 2000;
const WORDS_PER_CE_HOUR = 6000;

const PRESENTER = {
  name: "Kejuiana Johnson", credentials: "MA, LPC, NCC, CPCS, BC-TMH",
  degree: "MA", licenseNumber: "LPC009587", licenseState: "Georgia",
  qualificationStatement: "Licensed Professional Counselor with extensive experience in clinical practice, supervision, and continuing education development.",
  category: "category1"
};

// ═══════════════════════════════════════════════════════════════════
// QUALITY ENFORCEMENT — runs locally, no API tokens
// ═══════════════════════════════════════════════════════════════════

// Headings that should NEVER appear inside section text content
// because they are generic template artifacts, not topic-specific
const BANNED_GENERIC_HEADINGS = [
  'introduction', 'theoretical foundation', 'theoretical framework',
  'key concepts', 'practical application', 'practical applications',
  'overview', 'summary', 'conclusion', 'learning objectives',
  'course overview', 'module overview', 'section overview',
  'background', 'literature review', 'discussion',
  'clinical implications', 'clinical applications',
  'case study', 'case studies', 'case example', 'case examples',
  'ethical considerations', 'cultural considerations',
  'review', 'review questions', 'key terms', 'key takeaways',
  'objectives', 'what you will learn', 'what you\'ll learn'
];

// Preamble phrases that indicate template language, not real teaching
const BANNED_PREAMBLE_PATTERNS = [
  /in this (?:lesson|section|module),?\s+you will (?:learn|explore|discover|examine|understand|gain)/i,
  /this (?:lesson|section|module) (?:will|provides|covers|explores|examines|focuses)/i,
  /by the end of this (?:lesson|section|module)/i,
  /the following (?:lesson|section|module) (?:will|is designed to)/i,
  /welcome to (?:this|the) (?:lesson|section|module)/i,
  /let(?:'s| us) begin (?:by|with|our)/i,
  /the purpose of this (?:lesson|section|module)/i,
  /this (?:lesson|section|module) is designed to/i,
  /upon completion of this/i,
  /the concepts explored here/i,
  /the strategies presented here/i,
  /the knowledge (?:gained|presented|explored) (?:here|in this)/i,
  /these skills are fundamental to your clinical practice/i,
  /these (?:concepts|strategies|skills|techniques) (?:will|can) (?:be|enhance|improve|support)/i,
];

/**
 * Enforce quality on a single section's content blocks.
 * Modifies in place. Returns array of issues found and fixed.
 */
function enforceQuality(section, sectionIndex, totalSections) {
  const fixes = [];
  if (!section.contentBlocks) return fixes;

  // 1. Remove redundant sectionDividers
  const before = section.contentBlocks.length;
  section.contentBlocks = section.contentBlocks.filter(b => {
    if (b.type !== 'sectionDivider') return true;
    const dt = (b.title || '').toLowerCase().replace(/module \d+[:\s]*/i, '').trim();
    const st = (section.title || '').toLowerCase().replace(/module \d+[:\s]*/i, '').trim();
    if (dt === st || dt.includes(st) || st.includes(dt) || dt.length < 3) return false;
    return true;
  });
  if (section.contentBlocks.length < before) {
    fixes.push(`Removed ${before - section.contentBlocks.length} redundant sectionDivider(s)`);
  }

  // 2. Fix generic headings inside HTML text content
  section.contentBlocks.forEach(b => {
    if (b.type !== 'text' || !b.textContent) return;
    let html = b.textContent;
    let changed = false;

    // Match h2, h3, h4 tags
    html = html.replace(/<(h[2-4])([^>]*)>(.*?)<\/\1>/gi, (match, tag, attrs, content) => {
      const clean = content.replace(/<[^>]+>/g, '').trim().toLowerCase();
      // Check against banned list
      if (BANNED_GENERIC_HEADINGS.includes(clean)) {
        changed = true;
        return ''; // Remove the generic heading entirely
      }
      // Check for "Module X:" prefix
      if (/^module\s+\d+\s*[:\-–—]/i.test(clean)) {
        const fixed = content.replace(/^module\s+\d+\s*[:\-–—]\s*/i, '');
        changed = true;
        return `<${tag}${attrs}>${fixed}</${tag}>`;
      }
      return match;
    });

    // Remove ALL CAPS headings (convert to title case)
    html = html.replace(/<(h[2-4])([^>]*)>([A-Z\s:,&;]{10,})<\/\1>/g, (match, tag, attrs, content) => {
      const titleCase = content.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
        .replace(/\bAnd\b/g, 'and').replace(/\bOf\b/g, 'of').replace(/\bThe\b/g, 'the')
        .replace(/\bIn\b/g, 'in').replace(/\bFor\b/g, 'for').replace(/\bTo\b/g, 'to')
        .replace(/^./, c => c.toUpperCase()); // Always cap first word
      changed = true;
      return `<${tag}${attrs}>${titleCase}</${tag}>`;
    });

    if (changed) {
      b.textContent = html;
      fixes.push(`Fixed generic/ALL-CAPS headings in text block`);
    }
  });

  // 3. Remove template preamble from first text block
  const firstText = section.contentBlocks.find(b => b.type === 'text' && b.textContent);
  if (firstText) {
    let html = firstText.textContent;
    let changed = false;

    // Remove preamble paragraphs
    BANNED_PREAMBLE_PATTERNS.forEach(pattern => {
      // Match <p> tags containing the pattern
      const pPattern = new RegExp(`<p[^>]*>[^<]*${pattern.source}[^<]*<\\/p>`, 'gi');
      const newHtml = html.replace(pPattern, '');
      if (newHtml !== html) {
        html = newHtml;
        changed = true;
      }
    });

    // Also check for standalone sentences (not in <p> tags) at the start
    BANNED_PREAMBLE_PATTERNS.forEach(pattern => {
      if (pattern.test(stripHtml(html).substring(0, 500))) {
        // Only flag, don't blindly remove — the paragraph removal above handles most cases
      }
    });

    if (changed) {
      firstText.textContent = html.replace(/^\s*(<br\s*\/?>|\s)*/, '').trim();
      fixes.push(`Removed template preamble language`);
    }
  }

  // 4. Fix quiz option format: string[] → {text, isCorrect}[]
  section.contentBlocks.forEach(b => {
    if ((b.type === 'multipleChoice' || b.type === 'multiSelect') && b.options) {
      const needsFix = b.options.some(o => typeof o === 'string');
      if (needsFix) {
        b.options = b.options.map((o, i) => {
          if (typeof o === 'string') return { text: o, isCorrect: i === (b.correctAnswer || 0) };
          return o;
        });
        delete b.correctAnswer;
        fixes.push(`Fixed option format in ${b.type} block`);
      }
      // Ensure exactly 1 correct answer
      const correctCount = b.options.filter(o => o.isCorrect).length;
      if (correctCount === 0 && b.options.length > 0) {
        b.options[0].isCorrect = true;
        fixes.push(`Fixed missing correct answer in ${b.type}`);
      }
      if (correctCount > 1 && b.type === 'multipleChoice') {
        let found = false;
        b.options.forEach(o => {
          if (o.isCorrect && found) o.isCorrect = false;
          if (o.isCorrect) found = true;
        });
        fixes.push(`Fixed multiple correct answers in multipleChoice`);
      }
    }
  });

  // 5. Re-number order fields sequentially
  section.contentBlocks.forEach((b, i) => { b.order = i + 1; });

  // 6. Ensure section has required fields
  section.hasQuiz = section.hasQuiz || false;
  section.quizQuestions = section.quizQuestions || [];
  section.order = sectionIndex + 1;

  // 7. Remove empty text blocks
  const beforeEmpty = section.contentBlocks.length;
  section.contentBlocks = section.contentBlocks.filter(b => {
    if (b.type === 'text' && (!b.textContent || stripHtml(b.textContent).length < 10)) return false;
    return true;
  });
  if (section.contentBlocks.length < beforeEmpty) {
    fixes.push(`Removed ${beforeEmpty - section.contentBlocks.length} empty text block(s)`);
    section.contentBlocks.forEach((b, i) => { b.order = i + 1; });
  }

  // 8. Check for duplicate consecutive headings across sections (logged, not auto-fixed)
  // This catches when multiple sections use identical heading patterns

  return fixes;
}

/**
 * Run quality enforcement across ALL sections and detect cross-section issues
 */
function enforceQualityCourse(sections) {
  const allFixes = [];

  // Per-section enforcement
  sections.forEach((s, i) => {
    const fixes = enforceQuality(s, i, sections.length);
    if (fixes.length) {
      allFixes.push({ section: i + 1, title: s.title, fixes });
    }
  });

  // Cross-section checks: detect identical heading patterns
  const headingPatterns = sections.map(s => {
    const blocks = s.contentBlocks || [];
    return blocks.filter(b => b.type === 'text').map(b => {
      const headings = [];
      (b.textContent || '').replace(/<h[2-4][^>]*>(.*?)<\/h[2-4]>/gi, (m, content) => {
        headings.push(content.replace(/<[^>]+>/g, '').trim().toLowerCase());
      });
      return headings;
    }).flat();
  });

  // Find headings that appear in 2+ sections
  const allHeadings = headingPatterns.flat();
  const headingCounts = {};
  allHeadings.forEach(h => { headingCounts[h] = (headingCounts[h] || 0) + 1; });
  const duplicateHeadings = Object.entries(headingCounts).filter(([h, c]) => c > 1 && h.length > 3);
  if (duplicateHeadings.length) {
    allFixes.push({
      section: 'CROSS-SECTION',
      title: 'Duplicate headings across sections',
      fixes: duplicateHeadings.map(([h, c]) => `"${h}" appears in ${c} sections — needs unique headings`)
    });
  }

  return allFixes;
}

/**
 * Fix assessment options format
 */
function fixAssessmentQuality(assessment) {
  if (!assessment?.questions) return assessment;
  assessment.questions.forEach(q => {
    if (q.options) {
      q.options = q.options.map((o, i) => typeof o === 'string' ? { text: o, isCorrect: i === (q.correctAnswer || 0) } : o);
      delete q.correctAnswer;
    }
    if (!q.type) q.type = 'multipleChoice';
    // Ensure exactly 1 correct for multipleChoice
    if (q.type === 'multipleChoice') {
      const cc = (q.options || []).filter(o => o.isCorrect).length;
      if (cc === 0 && q.options?.length) q.options[0].isCorrect = true;
      if (cc > 1) {
        let found = false;
        q.options.forEach(o => { if (o.isCorrect && found) o.isCorrect = false; if (o.isCorrect) found = true; });
      }
    }
  });
  return assessment;
}

// ═══════════════════════════════════════════════════════════════════
// SYSTEM PROMPT
// ═══════════════════════════════════════════════════════════════════

const SYSTEM_PROMPT = `You are a CE course restructuring assistant for CounselorReady (NBCC ACEP #7760).

Your job: take EXISTING course content and restructure it into correct interactive format for graduate-level mental health professionals.

CRITICAL: Output ONLY valid JSON. No markdown, no backticks, no explanation.

contentBlocks[] types:
- "text": { type: "text", order: N, textContent: "<p>HTML</p>" }
- "accordion": { type: "accordion", order: N, title: "Title", accordionItems: [{ title: "Item", content: "HTML" }] }
- "multipleChoice": { type: "multipleChoice", order: N, question: "?", options: [{ text: "...", isCorrect: true/false }], explanation: "..." }
- "multiSelect": { type: "multiSelect", order: N, question: "?", options: [{ text: "...", isCorrect: true/false }], explanation: "..." }
- "reflection": { type: "reflection", order: N, question: "Prompt", textContent: "<p>context</p>", minLength: 50 }
- "matching": { type: "matching", order: N, matchingInstructions: "...", matchingPairs: [{ term: "...", definition: "..." }] }
- "imageText": { type: "imageText", order: N, title: "...", content: "<p>HTML</p>", imagePosition: "left", highlight: false }
- "resources": { type: "resources", order: N, resources: [{ title: "...", url: "https://...", type: "article"|"tool"|"website"|"book" }] }

ACADEMIC DESIGN RULES:
1. No sectionDivider blocks. The player renders section.title in the header.
2. NEVER use generic headings like "Introduction", "Theoretical Foundation", "Key Concepts", "Practical Application", "Overview", "Summary", "Conclusion" inside text blocks. Every <h3>/<h4> must be SPECIFIC to the section topic.
3. NEVER start with preamble like "In this lesson you will learn..." — dive directly into the content.
4. Each section must feel like a distinct chapter, not a copy of a template.
5. Preserve existing clinical substance. Add missing interactive elements.
6. Knowledge checks: 4 options, 1 correct, format: [{ text, isCorrect }]. Test clinical APPLICATION.
7. When expanding, add clinical vignettes with named clients (diverse backgrounds), DSM-5-TR references, evidence-based citations.
8. Tone: warm, authoritative. Like a respected colleague presenting at a professional conference.
9. No ALL CAPS headings. Use APA-style title case.`;

// ═══════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function stripHtml(html) { return (html || '').replace(/<[^>]+>/g, ' ').replace(/&\w+;/g, ' ').replace(/\s+/g, ' ').trim(); }
function countWords(text) { const p = stripHtml(text); return p ? p.split(/\s+/).filter(w => w.length > 0).length : 0; }
function countSectionWords(s) {
  let t = 0;
  (s.contentBlocks || []).forEach(b => {
    if (b.textContent) t += countWords(b.textContent);
    if (b.content) t += countWords(b.content);
    if (b.accordionItems) b.accordionItems.forEach(ai => { t += countWords(ai.content); });
  });
  return t;
}
function countCourseWords(ss) { return (ss || []).reduce((sum, s) => sum + countSectionWords(s), 0); }

function serializeSectionForPrompt(section) {
  const blocks = section.contentBlocks || [];
  let output = '';
  blocks.forEach(b => {
    if (b.type === 'sectionDivider') return;
    if (b.type === 'text' && b.textContent) output += `[TEXT BLOCK]\n${b.textContent}\n[/TEXT BLOCK]\n\n`;
    if (b.type === 'accordion' && b.accordionItems?.length) {
      output += `[ACCORDION]\n`;
      b.accordionItems.forEach(ai => { output += `  ${ai.title}: ${ai.content}\n`; });
      output += `[/ACCORDION]\n\n`;
    }
    if (b.type === 'imageText' && b.content) output += `[IMAGE-TEXT]\n${b.title || ''}\n${b.content}\n[/IMAGE-TEXT]\n\n`;
    if ((b.type === 'multipleChoice' || b.type === 'multiSelect') && b.question) {
      output += `[KC]\nQ: ${b.question}\n`;
      (b.options || []).forEach(o => { output += `  ${(o.isCorrect) ? '✓' : '○'} ${typeof o === 'string' ? o : o.text}\n`; });
      if (b.explanation) output += `Explanation: ${b.explanation}\n`;
      output += `[/KC]\n\n`;
    }
    if (b.type === 'reflection') output += `[REFLECTION]\n${b.question || b.textContent || ''}\n[/REFLECTION]\n\n`;
    if (b.type === 'matching' && b.matchingPairs?.length) {
      output += `[MATCHING]\n`;
      b.matchingPairs.forEach(p => output += `  ${p.term} → ${p.definition}\n`);
      output += `[/MATCHING]\n\n`;
    }
    if (b.type === 'resources' && b.resources?.length) {
      output += `[RESOURCES]\n`;
      b.resources.forEach(r => output += `  ${r.title}: ${r.url}\n`);
      output += `[/RESOURCES]\n\n`;
    }
  });
  return output;
}

// ═══════════════════════════════════════════════════════════════════
// API
// ═══════════════════════════════════════════════════════════════════

async function callClaude(userPrompt, maxTokens = 12000) {
  let attempts = 0;
  while (attempts < 3) {
    try {
      const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: maxTokens,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }]
      });
      const text = response.content.filter(c => c.type === 'text').map(c => c.text).join('');
      let cleaned = text.trim();
      if (cleaned.startsWith('```')) cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
      return JSON.parse(cleaned);
    } catch (err) {
      attempts++;
      if (err.status === 429) { console.log(`    ⏳ Rate limit, 60s...`); await sleep(60000); }
      else if (err instanceof SyntaxError) { console.log(`    ⚠️  JSON parse (${attempts}/3)`); if (attempts >= 3) throw err; await sleep(API_DELAY); }
      else { console.log(`    ⚠️  ${err.message} (${attempts}/3)`); if (attempts >= 3) throw err; await sleep(API_DELAY * 2); }
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
// RESTRUCTURE SECTION
// ═══════════════════════════════════════════════════════════════════

async function restructureSection(course, section, sectionIndex, totalSections) {
  const existingContent = serializeSectionForPrompt(section);
  const existingWords = countSectionWords(section);
  const blocks = section.contentBlocks || [];
  const isLast = sectionIndex === totalSections - 1;

  // Inventory
  const kcCount = blocks.filter(b => b.type === 'multipleChoice' || b.type === 'multiSelect').length;
  const hasReflection = blocks.some(b => b.type === 'reflection');
  const hasMatching = blocks.some(b => b.type === 'matching');
  const hasAccordion = blocks.some(b => b.type === 'accordion');
  const hasResources = blocks.some(b => b.type === 'resources' && b.resources?.length > 0);

  const needs = [];
  if (kcCount < 2) needs.push(`ADD ${2 - kcCount} multipleChoice knowledge check(s) — clinical application, not recall`);
  if (!hasReflection) needs.push('ADD 1 reflection block for clinical self-examination');
  if (!hasMatching) needs.push('ADD 1 matching exercise (5-6 pairs relevant to this section)');
  if (!hasAccordion && existingWords > 1500) needs.push('CONVERT one dense area into accordion (4-5 expandable items)');
  if (isLast && !hasResources) needs.push('ADD 1 resources block: 5-6 real professional resources with real URLs');

  const targetWords = Math.ceil((course.ceHours * WORDS_PER_CE_HOUR * 1.1) / totalSections);
  const deficit = targetWords - existingWords;
  if (deficit > 500) needs.push(`EXPAND text by ~${deficit} words with clinical vignettes, case examples, research citations`);

  // Run local quality enforcement first (catches everything we can fix without API)
  const preFixes = enforceQuality(section, sectionIndex, totalSections);
  if (preFixes.length) console.log(`     🔧 Pre-fixed: ${preFixes.join('; ')}`);

  // Check if cross-section duplicate headings need API help
  const textHtml = blocks.filter(b => b.type === 'text').map(b => b.textContent || '').join('');
  const hasGenericHeadings = BANNED_GENERIC_HEADINGS.some(h => {
    const re = new RegExp(`<h[2-4][^>]*>\\s*${h}\\s*</h[2-4]>`, 'i');
    return re.test(textHtml);
  });
  if (hasGenericHeadings) needs.push('REPLACE any remaining generic headings with topic-specific headings for this section');

  // Check for preamble the local fix might have missed (inline, not in separate <p>)
  const firstTextContent = stripHtml((section.contentBlocks.find(b => b.type === 'text')?.textContent || '').substring(0, 500));
  const hasPreamble = BANNED_PREAMBLE_PATTERNS.some(p => p.test(firstTextContent));
  if (hasPreamble) needs.push('REWRITE the opening paragraph — dive directly into the topic, no "In this lesson" preamble');

  if (needs.length === 0) {
    console.log(`  ✅ S${sectionIndex + 1}: "${section.title}" — complete (${existingWords}w)`);
    return section;
  }

  const prompt = `Restructure this section. Keep clinical substance, fix structure and headings.

COURSE: "${course.title}" (${course.ceHours} CE)
SECTION ${sectionIndex + 1}/${totalSections}: "${section.title}"
WORDS: ${existingWords} → target ${targetWords}

EXISTING CONTENT:
${existingContent}

REQUIRED CHANGES:
${needs.map((n, i) => `${i + 1}. ${n}`).join('\n')}

HEADING RULES:
- NO generic headings: Introduction, Theoretical Foundation, Key Concepts, Overview, Summary, Conclusion, etc.
- Every <h3>/<h4> must be SPECIFIC to "${section.title}" — e.g. for a section on alliance ruptures: "Recognizing the Rupture Pattern", "The Six-Step Repair Model", not "Introduction", "Key Concepts"
- NO ALL CAPS headings. Use title case.
- NO "Module X:" prefixes.

OPENING RULE: Start teaching immediately. No "In this lesson you will..." — begin with a compelling clinical statement or scenario.

Return JSON:
{
  "title": "${section.title}",
  "description": "${section.description || ''}",
  "order": ${sectionIndex + 1},
  "estimatedTime": ${Math.ceil((course.ceHours * 60) / totalSections)},
  "hasQuiz": false,
  "quizQuestions": [],
  "contentBlocks": [/* sequential order starting at 1 */]
}`;

  console.log(`  📝 S${sectionIndex + 1}: "${section.title}" (${existingWords}w→${targetWords}w, ${needs.length} changes)...`);
  const rebuilt = await callClaude(prompt, 16000);
  await sleep(API_DELAY);

  if (rebuilt) {
    // Run quality enforcement on API output too
    const postFixes = enforceQuality(rebuilt, sectionIndex, totalSections);
    const newWords = countSectionWords(rebuilt);
    console.log(`     → ${newWords}w${postFixes.length ? ` (post-fixed: ${postFixes.length})` : ''}`);
    return rebuilt;
  }

  console.log(`     ⚠️  API failed, using locally-fixed original`);
  return section;
}

// ═══════════════════════════════════════════════════════════════════
// ASSESSMENT
// ═══════════════════════════════════════════════════════════════════

async function fixAssessment(course, sectionTitles) {
  const existing = course.assessment?.questions || [];
  const needed = Math.max(15, course.ceHours * 5);

  if (existing.length >= needed) {
    console.log(`  ✅ Assessment: ${existing.length}q`);
    return fixAssessmentQuality(course.assessment);
  }

  const prompt = `${existing.length ? `Add questions to` : `Generate`} final assessment for "${course.title}" (${course.ceHours} CE).
Sections: ${sectionTitles.join(', ')}
${existing.length ? `\nExisting (${existing.length}q — keep + add ${needed - existing.length}):\n${existing.map(q => `- ${q.question}`).join('\n')}` : ''}

Return JSON:
{"title":"Final Assessment","timeLimit":${course.ceHours*10},"passThreshold":0.8,"attemptsAllowed":3,"shuffleQuestions":true,"shuffleOptions":true,
"questions":[{"question":"?","type":"multipleChoice","options":[{"text":"A","isCorrect":false},{"text":"B","isCorrect":true},{"text":"C","isCorrect":false},{"text":"D","isCorrect":false}],"explanation":"..."}]}

${needed} questions. Clinical application focus. All sections covered. 2+ ethics, 2+ cultural. 4 options, 1 correct.`;

  console.log(`  📝 Assessment: ${existing.length}→${needed}q...`);
  const a = await callClaude(prompt, 8000);
  await sleep(API_DELAY);
  console.log(`     → ${a?.questions?.length || 0}q`);
  return fixAssessmentQuality(a);
}

// ═══════════════════════════════════════════════════════════════════
// METADATA
// ═══════════════════════════════════════════════════════════════════

async function fixMetadata(course) {
  const obj = course.objectives || [];
  const refs = course.references || [];
  if (obj.length >= 4 && refs.length >= 5) {
    console.log(`  ✅ Metadata: ${obj.length} obj, ${refs.length} refs`);
    return { objectives: obj, references: refs };
  }

  const prompt = `Generate metadata for "${course.title}" (${course.ceHours} CE).
Sections: ${(course.sections||[]).map(s=>s.title).join(', ')}

Return JSON:
{"objectives":["Bloom's taxonomy verbs"],"references":[{"title":"Real text","author":"Author, A.","year":2020,"source":"Publisher"}]}
${obj.length<4?'Need 5+ objectives.':''} ${refs.length<5?'Need 6+ REAL references.':''}`;

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
    const kc = (s.contentBlocks||[]).filter(b => b.type==='multipleChoice'||b.type==='multiSelect').length;
    if (kc < 2) issues.push(`S${i+1}KC:${kc}`);
  });
  const last = ss[ss.length-1]?.contentBlocks||[];
  if (!last.some(b => b.type==='resources'&&b.resources?.length)) issues.push('NO_RESOURCES');

  // Quality checks
  ss.forEach((s, i) => {
    const html = (s.contentBlocks||[]).filter(b=>b.type==='text').map(b=>b.textContent||'').join('');
    BANNED_GENERIC_HEADINGS.forEach(h => {
      if (new RegExp(`<h[2-4][^>]*>\\s*${h}\\s*</h[2-4]>`, 'i').test(html)) {
        issues.push(`S${i+1}:GENERIC_HEADING:"${h}"`);
      }
    });
    const firstText = stripHtml((s.contentBlocks?.find(b=>b.type==='text')?.textContent||'').substring(0,300));
    if (BANNED_PREAMBLE_PATTERNS.some(p=>p.test(firstText))) issues.push(`S${i+1}:PREAMBLE`);
  });

  return issues;
}

// ═══════════════════════════════════════════════════════════════════
// PROGRESS
// ═══════════════════════════════════════════════════════════════════

function loadProgress() { try { return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8')); } catch(e) { return { completed: [], failed: [] }; } }
function saveProgress(p) { fs.writeFileSync(PROGRESS_FILE, JSON.stringify(p, null, 2)); }

// ═══════════════════════════════════════════════════════════════════
// REBUILD ONE COURSE
// ═══════════════════════════════════════════════════════════════════

async function rebuildCourse(course, db) {
  const ce = course.ceHours || 1;
  const sections = course.sections || [];
  const oldWords = countCourseWords(sections);

  console.log(`\n${'═'.repeat(70)}`);
  console.log(`🔨 ${course.title}`);
  console.log(`   ${course.slug} | ${ce}CE | ${oldWords}w/${ce*WORDS_PER_CE_HOUR}w (${Math.round(oldWords/(ce*WORDS_PER_CE_HOUR)*100)}%) | ${sections.length} sections`);
  console.log(`${'═'.repeat(70)}`);

  // Phase 1: Local quality enforcement (free, no API)
  console.log(`\n  🔍 Phase 1: Local quality enforcement...`);
  const qualityFixes = enforceQualityCourse(sections);
  qualityFixes.forEach(f => {
    console.log(`     S${f.section}: ${f.fixes.join('; ')}`);
  });

  // Phase 2: API-assisted restructuring (only for missing elements + word expansion)
  console.log(`\n  🤖 Phase 2: API restructuring...`);
  const rebuilt = [];
  for (let i = 0; i < sections.length; i++) {
    try { rebuilt.push(await restructureSection(course, sections[i], i, sections.length)); }
    catch (e) { console.log(`  ❌ S${i+1}: ${e.message}`); rebuilt.push(sections[i]); }
  }

  // Phase 3: Final quality enforcement on all rebuilt sections (free)
  console.log(`\n  🔍 Phase 3: Final quality enforcement...`);
  const finalFixes = enforceQualityCourse(rebuilt);
  if (finalFixes.length) {
    finalFixes.forEach(f => console.log(`     ${typeof f.section === 'number' ? 'S' + f.section : f.section}: ${f.fixes.join('; ')}`));
  } else {
    console.log(`     ✅ Clean`);
  }

  // Assessment
  let assessment;
  try { assessment = await fixAssessment(course, rebuilt.map(s=>s.title)); }
  catch (e) { console.log(`  ❌ Assessment: ${e.message}`); assessment = fixAssessmentQuality(course.assessment); }

  // Metadata
  let meta;
  try { meta = await fixMetadata({...course, sections: rebuilt}); }
  catch (e) { meta = { objectives: course.objectives||[], references: course.references||[] }; }

  const refs = (meta.references||[]).map(r => typeof r==='string'?r:`${r.author} (${r.year}). ${r.title}. ${r.source}.`);

  const doc = {
    title: course.title, slug: course.slug, description: course.description,
    ceHours: ce, ceProvider: 'NBCC ACEP #7760', acepNumber: '7760',
    objectives: meta.objectives,
    targetAudience: course.targetAudience || ["Licensed Professional Counselors (LPC/LPCC)","Licensed Mental Health Counselors (LMHC)","Licensed Clinical Social Workers (LCSW)","Licensed Marriage and Family Therapists (LMFT)"],
    categories: course.categories||[], tags: course.tags||[],
    sections: rebuilt, assessment, presenter: PRESENTER, references: refs,
    author: "GA Integrated Therapeutic Perspectives LLC",
    status: 'draft', updatedAt: new Date()
  };

  if (course.slug === 'aca-ethics-section-a-counseling-relationship' && course.title.includes('CBT')) {
    doc.slug = 'cbt-toolbox-core-techniques';
    console.log(`  🔧 Slug fix → cbt-toolbox-core-techniques`);
  }

  const newWords = countCourseWords(rebuilt);
  const issues = validate(doc, ce);

  console.log(`\n  📊 ${oldWords}w→${newWords}w | ${assessment?.questions?.length||0}q | ${meta.objectives?.length||0} obj | ${refs.length} refs`);
  if (issues.length) console.log(`     ⚠️  ${issues.join(' | ')}`);
  else console.log(`     ✅ ACEP + quality compliant`);

  if (!DRY_RUN) {
    await db.collection('interactivecourses').updateOne({_id: course._id}, {$set: doc});
    console.log(`  💾 Saved (draft)`);
  }

  return { slug: doc.slug, title: doc.title, before: oldWords, after: newWords, issues, exam: assessment?.questions?.length||0 };
}

// ═══════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════

async function main() {
  console.log(`\n╔══════════════════════════════════════════════════════════════════════╗`);
  console.log(`║  CounselorReady — Bulk Course Rebuilder v3                         ║`);
  console.log(`║  Local quality enforcement + API restructuring                     ║`);
  if (DRY_RUN) console.log(`║  ⚠️  DRY RUN                                                       ║`);
  if (RESUME) console.log(`║  ♻️  RESUME                                                         ║`);
  console.log(`╚══════════════════════════════════════════════════════════════════════╝\n`);

  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;
  console.log('✅ MongoDB connected\n');

  const progress = RESUME ? loadProgress() : { completed: [], failed: [] };
  let courses = await db.collection('interactivecourses').find({}).toArray();
  courses = courses.filter(c => !SKIP_SLUGS.includes(c.slug));

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
    console.log(`   ${i+1}. [${c.ceHours||1}CE] ${c.title} (${Math.round(w/((c.ceHours||1)*WORDS_PER_CE_HOUR)*100)}%)`);
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
    else console.log(`  ${r.issues?.length?'⚠️':'✅'} ${r.title}: ${r.before}w→${r.after}w | ${r.exam}q${r.issues?.length?' | '+r.issues.join(', '):''}`);
  });

  if (!DRY_RUN) console.log(`\n📋 All saved as DRAFT.`);
  if (!fail&&!SLUG_ARG) try{fs.unlinkSync(PROGRESS_FILE);}catch(e){}
  await mongoose.disconnect();
  console.log('\n✅ Done!');
}

main().catch(e => { console.error('💥', e.message); process.exit(1); });
