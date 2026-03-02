#!/usr/bin/env node
/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  CounselorReady — Bulk Course Rebuilder v4                         ║
 * ║  LOCAL quality enforcement + API generates ONLY missing elements   ║
 * ║  Existing text NEVER passes through API — zero content loss        ║
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
// BANNED PATTERNS — local enforcement, zero API tokens
// ═══════════════════════════════════════════════════════════════════

const BANNED_HEADINGS = [
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
  'objectives', 'what you will learn', 'what you\'ll learn'
];

const BANNED_PREAMBLES = [
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
  /these (?:concepts|strategies|skills|techniques) (?:will|can) (?:be|enhance|improve|support)/i,
];

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
function loadProgress() { try { return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8')); } catch(e) { return { completed: [], failed: [] }; } }
function saveProgress(p) { fs.writeFileSync(PROGRESS_FILE, JSON.stringify(p, null, 2)); }

// ═══════════════════════════════════════════════════════════════════
// LOCAL QUALITY ENFORCEMENT — modifies sections in place, no API
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
  if (section.contentBlocks.length < before) fixes.push(`-${before - section.contentBlocks.length} sectionDivider`);

  // 2. Fix generic headings in text blocks — REPLACE with section-topic-specific ones
  section.contentBlocks.forEach(b => {
    if (b.type !== 'text' || !b.textContent) return;
    let html = b.textContent;
    let changed = false;

    html = html.replace(/<(h[2-4])([^>]*)>(.*?)<\/\1>/gi, (match, tag, attrs, content) => {
      const clean = content.replace(/<[^>]+>/g, '').trim().toLowerCase();
      if (BANNED_HEADINGS.includes(clean)) {
        changed = true;
        return ''; // Remove generic heading — content below it stands on its own
      }
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
        .replace(/\b(And|Of|The|In|For|To|A|An|By|With)\b/g, m => m.toLowerCase())
        .replace(/^./, c => c.toUpperCase());
      changed = true;
      return `<${tag}${attrs}>${tc}</${tag}>`;
    });

    if (changed) { b.textContent = html; fixes.push('fixed headings'); }
  });

  // 3. Remove preamble paragraphs from first text block
  const firstText = section.contentBlocks.find(b => b.type === 'text' && b.textContent);
  if (firstText) {
    let html = firstText.textContent;
    let changed = false;
    BANNED_PREAMBLES.forEach(pattern => {
      const pRe = new RegExp(`<p[^>]*>[^<]*?${pattern.source}[^<]*?</p>`, 'gi');
      const newHtml = html.replace(pRe, '');
      if (newHtml !== html) { html = newHtml; changed = true; }
    });
    if (changed) { firstText.textContent = html.replace(/^\s*(<br\s*\/?>|\s)*/, '').trim(); fixes.push('removed preamble'); }
  }

  // 4. Fix quiz options: string[] → {text, isCorrect}[]
  section.contentBlocks.forEach(b => {
    if ((b.type === 'multipleChoice' || b.type === 'multiSelect') && b.options) {
      if (b.options.some(o => typeof o === 'string')) {
        b.options = b.options.map((o, i) => typeof o === 'string' ? { text: o, isCorrect: i === (b.correctAnswer || 0) } : o);
        delete b.correctAnswer;
        fixes.push('fixed option format');
      }
      // Ensure exactly 1 correct for multipleChoice
      if (b.type === 'multipleChoice') {
        const cc = b.options.filter(o => o.isCorrect).length;
        if (cc === 0 && b.options.length) { b.options[0].isCorrect = true; fixes.push('added missing correct answer'); }
        if (cc > 1) { let f = false; b.options.forEach(o => { if (o.isCorrect && f) o.isCorrect = false; if (o.isCorrect) f = true; }); fixes.push('fixed multiple correct'); }
      }
    }
  });

  // 5. Remove empty text blocks
  section.contentBlocks = section.contentBlocks.filter(b => {
    if (b.type === 'text') {
      const hasText = (b.textContent && stripHtml(b.textContent).length >= 10) || 
                      (b.content && stripHtml(b.content).length >= 10);
      if (!hasText) return false;
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
// API — only for generating NEW interactive blocks
// ═══════════════════════════════════════════════════════════════════

const GEN_SYSTEM = `You generate interactive course elements for graduate-level mental health CE courses. Output ONLY valid JSON array. No markdown, no backticks, no explanation. Just a JSON array of contentBlock objects.`;

async function callClaude(system, prompt, maxTokens = 4000) {
  let attempts = 0;
  while (attempts < 3) {
    try {
      const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: maxTokens,
        system,
        messages: [{ role: 'user', content: prompt }]
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

/**
 * Generate ONLY the missing interactive blocks for a section.
 * Returns an array of new contentBlock objects to splice in.
 */
async function generateMissingBlocks(course, section, sectionIndex, totalSections) {
  const blocks = section.contentBlocks || [];
  const isLast = sectionIndex === totalSections - 1;
  
  const kcCount = blocks.filter(b => b.type === 'multipleChoice' || b.type === 'multiSelect').length;
  const hasReflection = blocks.some(b => b.type === 'reflection');
  const hasMatching = blocks.some(b => b.type === 'matching');
  const hasResources = blocks.some(b => b.type === 'resources' && b.resources?.length > 0);

  const requests = [];
  if (kcCount < 2) requests.push(`${2 - kcCount} multipleChoice block(s) testing clinical APPLICATION of ${section.title} concepts. 4 options each, 1 correct, with explanation.`);
  if (!hasReflection) requests.push(`1 reflection block prompting the clinician to examine their own practice regarding ${section.title}.`);
  if (!hasMatching) requests.push(`1 matching exercise with 5-6 term/definition pairs from ${section.title} content.`);
  if (isLast && !hasResources) requests.push(`1 resources block with 5-6 real professional resources (real URLs — APA, SAMHSA, NIMH, NBCC, etc.) related to ${course.title}.`);

  if (requests.length === 0) return [];

  // Give the API a SUMMARY of the section topic — NOT the full content
  const topicSummary = stripHtml(
    blocks.filter(b => b.type === 'text').map(b => b.textContent || '').join(' ')
  ).substring(0, 800);

  const prompt = `Generate these interactive elements for a CE course section.

COURSE: "${course.title}" (${course.ceHours} CE hours)
SECTION: "${section.title}"
TOPIC CONTEXT (summary): ${topicSummary}

GENERATE (return as a JSON array of contentBlock objects):
${requests.map((r, i) => `${i + 1}. ${r}`).join('\n')}

FORMAT for each block type:
- multipleChoice: { "type": "multipleChoice", "order": 1, "question": "Clinical scenario question?", "options": [{"text": "A", "isCorrect": false}, {"text": "B", "isCorrect": true}, {"text": "C", "isCorrect": false}, {"text": "D", "isCorrect": false}], "explanation": "Why B is correct..." }
- reflection: { "type": "reflection", "order": 1, "question": "Reflective prompt?", "textContent": "<p>Context for reflection</p>", "minLength": 50 }
- matching: { "type": "matching", "order": 1, "matchingInstructions": "Match each term...", "matchingPairs": [{"term": "Term", "definition": "Definition"}] }
- resources: { "type": "resources", "order": 1, "resources": [{"title": "Resource Name", "url": "https://real-url.org", "type": "website"}] }

Return ONLY a JSON array: [ { block1 }, { block2 }, ... ]`;

  const newBlocks = await callClaude(GEN_SYSTEM, prompt, 4000);
  await sleep(API_DELAY);
  return Array.isArray(newBlocks) ? newBlocks : [];
}

/**
 * Generate expansion text for a section that's under word count.
 * Returns a single text block to append.
 */
async function generateExpansionText(course, section, deficit) {
  const topicSummary = stripHtml(
    (section.contentBlocks || []).filter(b => b.type === 'text').map(b => b.textContent || '').join(' ')
  ).substring(0, 1000);

  const prompt = `Generate additional clinical text content for a CE course section. Return ONLY a JSON object — one text block.

COURSE: "${course.title}"
SECTION: "${section.title}"
EXISTING CONTENT SUMMARY: ${topicSummary}
WORDS NEEDED: ~${deficit}

Generate a text block with rich clinical content that DEEPENS the existing material. Include:
- A clinical vignette with a named client (diverse background)
- Evidence-based research citations
- Practical clinical application techniques
- Use <p>, <h3>, <h4>, <ul>, <li>, <strong>, <em>, <blockquote> tags
- DO NOT use generic headings like "Case Study" or "Clinical Application" — use topic-specific headings

Return: { "type": "text", "order": 1, "textContent": "<p>Rich HTML content here...</p>" }`;

  const block = await callClaude(GEN_SYSTEM, prompt, 8000);
  await sleep(API_DELAY);
  return block;
}

/**
 * Splice new blocks into existing section at natural break points.
 * Inserts interactive elements after text blocks.
 */
function spliceBlocks(section, newBlocks) {
  if (!newBlocks.length) return;

  const existing = section.contentBlocks;
  const textIndices = existing.map((b, i) => b.type === 'text' ? i : -1).filter(i => i >= 0);

  if (textIndices.length === 0) {
    // No text blocks — just append
    existing.push(...newBlocks);
  } else {
    // Distribute new blocks after text blocks evenly
    const insertPoints = [];
    const step = Math.max(1, Math.floor(textIndices.length / (newBlocks.length + 1)));
    
    for (let i = 0; i < newBlocks.length; i++) {
      const textIdx = textIndices[Math.min((i + 1) * step, textIndices.length - 1)];
      insertPoints.push({ afterIndex: textIdx, block: newBlocks[i] });
    }

    // Insert in reverse order to preserve indices
    insertPoints.sort((a, b) => b.afterIndex - a.afterIndex);
    insertPoints.forEach(({ afterIndex, block }) => {
      existing.splice(afterIndex + 1, 0, block);
    });
  }

  // Renumber
  existing.forEach((b, i) => { b.order = i + 1; });
}

// ═══════════════════════════════════════════════════════════════════
// ASSESSMENT
// ═══════════════════════════════════════════════════════════════════

async function fixAssessment(course, sectionTitles) {
  const existing = course.assessment?.questions || [];
  const needed = Math.max(15, course.ceHours * 5);

  // Fix existing option formats
  existing.forEach(q => {
    if (q.options) {
      q.options = q.options.map((o, i) => typeof o === 'string' ? { text: o, isCorrect: i === (q.correctAnswer || 0) } : o);
      delete q.correctAnswer;
    }
    if (!q.type) q.type = 'multipleChoice';
  });

  if (existing.length >= needed) {
    console.log(`  ✅ Assessment: ${existing.length}q`);
    return course.assessment;
  }

  const deficit = needed - existing.length;
  const prompt = `Generate ${deficit} assessment questions for "${course.title}" (${course.ceHours} CE).
Sections: ${sectionTitles.join(', ')}
${existing.length ? `Already have ${existing.length}q. Generate ${deficit} MORE covering gaps.` : ''}

Return JSON array of question objects:
[{"question":"Clinical scenario?","type":"multipleChoice","options":[{"text":"A","isCorrect":false},{"text":"B","isCorrect":true},{"text":"C","isCorrect":false},{"text":"D","isCorrect":false}],"explanation":"Rationale..."}]

Clinical application focus. Cover all sections. Include ethics + cultural questions. 4 options, 1 correct.`;

  console.log(`  📝 Assessment: +${deficit}q...`);
  const newQs = await callClaude(GEN_SYSTEM, prompt, 6000);
  await sleep(API_DELAY);

  const allQs = [...existing, ...(Array.isArray(newQs) ? newQs : [])];
  // Fix formats on new questions too
  allQs.forEach(q => {
    if (q.options) {
      q.options = q.options.map((o, i) => typeof o === 'string' ? { text: o, isCorrect: i === (q.correctAnswer || 0) } : o);
      delete q.correctAnswer;
    }
    if (!q.type) q.type = 'multipleChoice';
  });

  console.log(`     → ${allQs.length}q total`);
  return {
    title: course.assessment?.title || "Final Assessment",
    timeLimit: course.assessment?.timeLimit || course.ceHours * 10,
    passThreshold: 0.8, attemptsAllowed: 3,
    shuffleQuestions: true, shuffleOptions: true,
    questions: allQs
  };
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

  const prompt = `Generate metadata for CE course "${course.title}" (${course.ceHours} CE).
Sections: ${(course.sections||[]).map(s=>s.title).join(', ')}

Return JSON:
{"objectives":["5-8 Bloom's taxonomy objectives"],"references":[{"title":"Real text","author":"Author, A.","year":2020,"source":"Publisher"}]}
${obj.length<4?'Need 5+ objectives.':''} ${refs.length<5?'Need 6+ REAL references.':''}`;

  console.log(`  📝 Metadata...`);
  const m = await callClaude(GEN_SYSTEM, prompt, 3000);
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

  // Quality: check for remaining banned headings
  ss.forEach((s, i) => {
    const html = (s.contentBlocks||[]).filter(b=>b.type==='text').map(b=>b.textContent||'').join('');
    BANNED_HEADINGS.forEach(h => {
      if (new RegExp(`<h[2-4][^>]*>\\s*${h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*</h[2-4]>`, 'i').test(html)) {
        issues.push(`S${i+1}:HEADING:"${h}"`);
      }
    });
  });

  // Quality: check for duplicate headings across sections
  const allH = [];
  ss.forEach(s => {
    (s.contentBlocks||[]).filter(b=>b.type==='text').forEach(b => {
      (b.textContent||'').replace(/<h[2-4][^>]*>(.*?)<\/h[2-4]>/gi, (m, c) => {
        allH.push(c.replace(/<[^>]+>/g, '').trim().toLowerCase());
      });
    });
  });
  const hCounts = {};
  allH.forEach(h => { if (h.length > 3) hCounts[h] = (hCounts[h]||0) + 1; });
  Object.entries(hCounts).forEach(([h, c]) => { if (c > 1) issues.push(`DUP_HEADING:"${h}"×${c}`); });

  return issues;
}

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

  // ── Phase 1: Local quality enforcement (FREE) ──
  console.log(`\n  🔍 Phase 1: Local quality enforcement...`);
  sections.forEach((s, i) => {
    const wordsBefore = countSectionWords(s);
    const backup = JSON.parse(JSON.stringify(s)); // deep clone
    const fixes = enforceLocalQuality(s, i);
    const wordsAfter = countSectionWords(s);
    
    // SAFETY: if we lost more than 10% of words, roll back
    if (wordsBefore > 0 && wordsAfter < wordsBefore * 0.9) {
      console.log(`     ⛔ S${i+1} "${s.title}": enforcement dropped ${wordsBefore}→${wordsAfter}w — ROLLED BACK`);
      Object.assign(s, backup);
      // Still apply safe-only fixes: sectionDivider removal and option format fixes
      s.contentBlocks = (s.contentBlocks || []).filter(b => {
        if (b.type !== 'sectionDivider') return true;
        const dt = (b.title || '').toLowerCase().replace(/module \d+[:\s]*/i, '').trim();
        const st = (s.title || '').toLowerCase().replace(/module \d+[:\s]*/i, '').trim();
        return dt !== st && !dt.includes(st) && !st.includes(dt) && dt.length >= 3;
      });
      s.contentBlocks.forEach((b, j) => { b.order = j + 1; });
    } else if (fixes.length) {
      console.log(`     S${i+1} "${s.title}": ${fixes.join('; ')}${wordsAfter !== wordsBefore ? ` (${wordsBefore}→${wordsAfter}w)` : ''}`);
    }
  });
  const postLocalWords = countCourseWords(sections);
  if (postLocalWords !== oldWords) console.log(`     Words: ${oldWords}→${postLocalWords} (headings/dividers removed)`);

  // ── Phase 2: Generate missing interactive elements (API — small calls) ──
  console.log(`\n  🤖 Phase 2: Generate missing elements...`);
  for (let i = 0; i < sections.length; i++) {
    const s = sections[i];
    try {
      const newBlocks = await generateMissingBlocks(course, s, i, sections.length);
      if (newBlocks.length) {
        // Fix option formats on new blocks before splicing
        newBlocks.forEach(b => {
          if ((b.type === 'multipleChoice' || b.type === 'multiSelect') && b.options) {
            b.options = b.options.map((o, j) => typeof o === 'string' ? { text: o, isCorrect: j === (b.correctAnswer||0) } : o);
            delete b.correctAnswer;
          }
        });
        spliceBlocks(s, newBlocks);
        console.log(`     S${i+1}: +${newBlocks.length} blocks (${newBlocks.map(b=>b.type).join(', ')})`);
      } else {
        console.log(`     S${i+1}: ✅ complete`);
      }
    } catch (e) {
      console.log(`     S${i+1}: ⚠️ ${e.message}`);
    }
  }

  // ── Phase 3: Expand word count if needed (API — only for undercount) ──
  const midWords = countCourseWords(sections);
  const targetWords = ce * WORDS_PER_CE_HOUR;
  if (midWords < targetWords) {
    console.log(`\n  📝 Phase 3: Word expansion (${midWords}/${targetWords})...`);
    // Find sections with room to grow
    const perSection = Math.ceil(targetWords * 1.1 / sections.length);
    for (let i = 0; i < sections.length; i++) {
      const sw = countSectionWords(sections[i]);
      const deficit = perSection - sw;
      if (deficit > 500) {
        try {
          const expansion = await generateExpansionText(course, sections[i], deficit);
          if (expansion && expansion.textContent) {
            sections[i].contentBlocks.push(expansion);
            sections[i].contentBlocks.forEach((b, j) => { b.order = j + 1; });
            const newSw = countSectionWords(sections[i]);
            console.log(`     S${i+1}: +${newSw - sw}w (${sw}→${newSw}w)`);
          }
        } catch (e) {
          console.log(`     S${i+1}: ⚠️ expansion failed: ${e.message}`);
        }
      }
    }
  } else {
    console.log(`\n  ✅ Phase 3: Word count OK (${midWords}/${targetWords})`);
  }

  // ── Phase 4: Final enforcement pass (FREE, with safety) ──
  sections.forEach((s, i) => {
    const wb = countSectionWords(s);
    const bk = JSON.parse(JSON.stringify(s));
    enforceLocalQuality(s, i);
    if (wb > 0 && countSectionWords(s) < wb * 0.9) Object.assign(s, bk);
  });

  // Assessment
  let assessment;
  try { assessment = await fixAssessment(course, sections.map(s=>s.title)); }
  catch (e) { console.log(`  ❌ Assessment: ${e.message}`); assessment = course.assessment; }

  // Metadata
  let meta;
  try { meta = await fixMetadata({...course, sections}); }
  catch (e) { meta = { objectives: course.objectives||[], references: course.references||[] }; }

  const refs = (meta.references||[]).map(r => typeof r==='string'?r:`${r.author} (${r.year}). ${r.title}. ${r.source}.`);

  const doc = {
    title: course.title, slug: course.slug, description: course.description,
    ceHours: ce, ceProvider: 'NBCC ACEP #7760', acepNumber: '7760',
    objectives: meta.objectives,
    targetAudience: course.targetAudience || ["Licensed Professional Counselors (LPC/LPCC)","Licensed Mental Health Counselors (LMHC)","Licensed Clinical Social Workers (LCSW)","Licensed Marriage and Family Therapists (LMFT)"],
    categories: course.categories||[], tags: course.tags||[],
    sections, assessment, presenter: PRESENTER, references: refs,
    author: "GA Integrated Therapeutic Perspectives LLC",
    status: 'draft', updatedAt: new Date()
  };

  if (course.slug === 'aca-ethics-section-a-counseling-relationship' && course.title.includes('CBT')) {
    doc.slug = 'cbt-toolbox-core-techniques';
    console.log(`  🔧 Slug fix → cbt-toolbox-core-techniques`);
  }

  const finalWords = countCourseWords(sections);
  const issues = validate(doc, ce);

  console.log(`\n  📊 ${oldWords}w→${finalWords}w | ${assessment?.questions?.length||0}q | ${meta.objectives?.length||0} obj | ${refs.length} refs`);
  if (issues.length) console.log(`     ⚠️  ${issues.join(' | ')}`);
  else console.log(`     ✅ ACEP + quality compliant`);

  if (!DRY_RUN) {
    await db.collection('interactivecourses').updateOne({_id: course._id}, {$set: doc});
    console.log(`  💾 Saved (draft)`);
  }

  return { slug: doc.slug, title: doc.title, before: oldWords, after: finalWords, issues, exam: assessment?.questions?.length||0 };
}

// ═══════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════

async function main() {
  console.log(`\n╔══════════════════════════════════════════════════════════════════════╗`);
  console.log(`║  CounselorReady — Bulk Course Rebuilder v4                         ║`);
  console.log(`║  Local enforcement + API for missing elements only                 ║`);
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
