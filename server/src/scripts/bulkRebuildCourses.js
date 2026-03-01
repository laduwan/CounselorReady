#!/usr/bin/env node
/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  CounselorReady — Bulk Course Rebuilder v2                         ║
 * ║  RESTRUCTURES existing content into ACEP-compliant format          ║
 * ║  Preserves existing clinical narrative, adds missing elements      ║
 * ║                                                                     ║
 * ║  Usage:  node src/scripts/bulkRebuildCourses.js                    ║
 * ║  Test:   node src/scripts/bulkRebuildCourses.js --slug=therapeutic-rapport  ║
 * ║  Resume: node src/scripts/bulkRebuildCourses.js --resume           ║
 * ║  Dry:    node src/scripts/bulkRebuildCourses.js --dry-run          ║
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

const SKIP_SLUGS = [
  'the-elephant-in-the-room-navigating-difficult-conversations-in-therapy'
];

const API_DELAY = 2000;
const WORDS_PER_CE_HOUR = 6000;

const PRESENTER = {
  name: "Kejuiana Johnson",
  credentials: "MA, LPC, NCC, CPCS, BC-TMH",
  degree: "MA",
  licenseNumber: "LPC009587",
  licenseState: "Georgia",
  qualificationStatement: "Licensed Professional Counselor with extensive experience in clinical practice, supervision, and continuing education development.",
  category: "category1"
};

// ═══════════════════════════════════════════════════════════════════
// SYSTEM PROMPT
// ═══════════════════════════════════════════════════════════════════

const SYSTEM_PROMPT = `You are a CE course restructuring assistant for CounselorReady (NBCC ACEP #7760).

Your job: take EXISTING course content and restructure it into the correct interactive format.
PRESERVE the existing clinical narrative — do NOT rewrite it. ADD only what is missing.

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

RULES:
1. Do NOT start with a sectionDivider block. The player shows section.title already.
2. PRESERVE all existing text — put it into text blocks, don't summarize or shorten.
3. Knowledge check options: exactly 4, one correct. Format: [{ text, isCorrect }]
4. When expanding content, add clinical vignettes, case examples, DSM-5-TR references, practical applications.
5. Clinical tone: warm but authoritative — respected colleague at a conference.`;

// ═══════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function stripHtml(html) { return (html || '').replace(/<[^>]+>/g, ' ').replace(/&\w+;/g, ' ').replace(/\s+/g, ' ').trim(); }
function countWords(text) { const p = stripHtml(text); return p ? p.split(/\s+/).filter(w => w.length > 0).length : 0; }

function countSectionWords(section) {
  let total = 0;
  (section.contentBlocks || []).forEach(b => {
    if (b.textContent) total += countWords(b.textContent);
    if (b.content) total += countWords(b.content);
    if (b.accordionItems) b.accordionItems.forEach(ai => { total += countWords(ai.content); });
  });
  return total;
}

function countCourseWords(sections) {
  return (sections || []).reduce((sum, s) => sum + countSectionWords(s), 0);
}

function serializeSectionForPrompt(section) {
  const blocks = section.contentBlocks || [];
  let output = '';
  
  blocks.forEach(b => {
    if (b.type === 'sectionDivider') return;
    if (b.type === 'text' && b.textContent) {
      output += `[TEXT BLOCK — PRESERVE THIS]\n${b.textContent}\n[/TEXT BLOCK]\n\n`;
    }
    if (b.type === 'accordion' && b.accordionItems?.length) {
      output += `[ACCORDION — PRESERVE]\n`;
      b.accordionItems.forEach(ai => { output += `  Title: ${ai.title}\n  Content: ${ai.content}\n`; });
      output += `[/ACCORDION]\n\n`;
    }
    if (b.type === 'imageText' && b.content) {
      output += `[IMAGE-TEXT — PRESERVE]\nTitle: ${b.title || ''}\n${b.content}\n[/IMAGE-TEXT]\n\n`;
    }
    if ((b.type === 'multipleChoice' || b.type === 'multiSelect') && b.question) {
      output += `[EXISTING KC — PRESERVE]\nQ: ${b.question}\n`;
      (b.options || []).forEach(o => {
        const t = typeof o === 'string' ? o : o.text;
        const c = typeof o === 'object' ? o.isCorrect : false;
        output += `  ${c ? '✓' : '○'} ${t}\n`;
      });
      if (b.explanation) output += `Explanation: ${b.explanation}\n`;
      output += `[/KC]\n\n`;
    }
    if (b.type === 'reflection') {
      output += `[EXISTING REFLECTION — PRESERVE]\n${b.question || b.textContent || ''}\n[/REFLECTION]\n\n`;
    }
    if (b.type === 'matching' && b.matchingPairs?.length) {
      output += `[EXISTING MATCHING — PRESERVE]\n`;
      b.matchingPairs.forEach(p => output += `  ${p.term} → ${p.definition}\n`);
      output += `[/MATCHING]\n\n`;
    }
    if (b.type === 'resources' && b.resources?.length) {
      output += `[EXISTING RESOURCES — PRESERVE]\n`;
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
      if (err.status === 429) { console.log(`    ⏳ Rate limited, waiting 60s...`); await sleep(60000); }
      else if (err instanceof SyntaxError) { console.log(`    ⚠️  JSON parse (${attempts}/3)`); if (attempts >= 3) throw err; await sleep(API_DELAY); }
      else { console.log(`    ⚠️  ${err.message} (${attempts}/3)`); if (attempts >= 3) throw err; await sleep(API_DELAY * 2); }
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
// RESTRUCTURE SECTION — the core logic
// ═══════════════════════════════════════════════════════════════════

async function restructureSection(course, section, sectionIndex, totalSections) {
  const existingContent = serializeSectionForPrompt(section);
  const existingWords = countSectionWords(section);
  const blocks = section.contentBlocks || [];
  const isLast = sectionIndex === totalSections - 1;
  
  // Inventory what exists
  const kcCount = blocks.filter(b => b.type === 'multipleChoice' || b.type === 'multiSelect').length;
  const hasReflection = blocks.some(b => b.type === 'reflection');
  const hasMatching = blocks.some(b => b.type === 'matching');
  const hasAccordion = blocks.some(b => b.type === 'accordion');
  const hasResources = blocks.some(b => b.type === 'resources' && b.resources?.length > 0);
  
  // What needs adding
  const needs = [];
  if (kcCount < 2) needs.push(`ADD ${2 - kcCount} multipleChoice knowledge check(s) testing clinical APPLICATION`);
  if (!hasReflection) needs.push('ADD 1 reflection block for clinical self-examination');
  if (!hasMatching) needs.push('ADD 1 matching exercise (5-6 pairs of key terms/definitions from this section)');
  if (!hasAccordion && existingWords > 1500) needs.push('CONVERT one dense text area into an accordion (4-5 expandable items)');
  if (isLast && !hasResources) needs.push('ADD 1 resources block at end: 5-6 real professional resources (APA, SAMHSA, NIMH, etc. with real URLs)');
  
  const targetWords = Math.ceil((course.ceHours * WORDS_PER_CE_HOUR * 1.1) / totalSections);
  const deficit = targetWords - existingWords;
  if (deficit > 500) needs.push(`EXPAND text by ~${deficit} words — add clinical vignettes, case examples, research, practical applications. Weave new content into existing text blocks or add new text blocks.`);
  
  if (needs.length === 0) {
    console.log(`  ✅ S${sectionIndex + 1}: "${section.title}" — complete (${existingWords}w)`);
    return cleanSection(section, sectionIndex);
  }
  
  const prompt = `Restructure this section. PRESERVE all existing text. ADD only what's listed below.

COURSE: "${course.title}" (${course.ceHours} CE)
SECTION ${sectionIndex + 1}/${totalSections}: "${section.title}"
WORDS: ${existingWords} now, target ${targetWords}

EXISTING CONTENT (KEEP ALL OF THIS — do not rewrite, summarize, or shorten):
${existingContent}

WHAT TO ADD:
${needs.map((n, i) => `${i + 1}. ${n}`).join('\n')}

Do NOT include a sectionDivider block.
Place new interactive elements BETWEEN existing text blocks for natural flow.
Block flow: text → accordion → KC → text → reflection → matching → KC → text${isLast ? ' → resources' : ''}

Return JSON:
{
  "title": "${section.title}",
  "description": "${section.description || ''}",
  "order": ${sectionIndex + 1},
  "estimatedTime": ${Math.ceil((course.ceHours * 60) / totalSections)},
  "hasQuiz": false,
  "quizQuestions": [],
  "contentBlocks": [ /* all blocks with sequential order starting at 1 */ ]
}`;

  console.log(`  📝 S${sectionIndex + 1}: "${section.title}" (${existingWords}w→${targetWords}w, +${needs.length} elements)...`);
  const rebuilt = await callClaude(prompt, 16000);
  await sleep(API_DELAY);
  
  if (rebuilt) {
    const newWords = countSectionWords(rebuilt);
    console.log(`     → ${newWords}w (was ${existingWords}w)`);
    return postProcess(rebuilt, section.title);
  }
  
  console.log(`     ⚠️  Failed, keeping original`);
  return cleanSection(section, sectionIndex);
}

// ═══════════════════════════════════════════════════════════════════
// ASSESSMENT
// ═══════════════════════════════════════════════════════════════════

async function fixAssessment(course, sectionTitles) {
  const existing = course.assessment?.questions || [];
  const needed = Math.max(15, course.ceHours * 5);
  
  if (existing.length >= needed) {
    console.log(`  ✅ Assessment: ${existing.length}q (need ${needed})`);
    return fixOptions(course.assessment);
  }
  
  const prompt = `${existing.length > 0 ? `Add questions to` : `Generate`} final assessment for "${course.title}" (${course.ceHours} CE).
Sections: ${sectionTitles.join(', ')}
${existing.length > 0 ? `\nEXISTING (${existing.length}q — keep + add ${needed - existing.length}):\n${existing.map(q => `- ${q.question}`).join('\n')}` : ''}

Return JSON:
{ "title": "Final Assessment", "timeLimit": ${course.ceHours * 10}, "passThreshold": 0.8, "attemptsAllowed": 3, "shuffleQuestions": true, "shuffleOptions": true,
  "questions": [ { "question": "?", "type": "multipleChoice", "options": [{ "text": "A", "isCorrect": false }, { "text": "B", "isCorrect": true }, { "text": "C", "isCorrect": false }, { "text": "D", "isCorrect": false }], "explanation": "..." } ] }

Exactly ${needed} questions. Test clinical application. Cover all sections. 2+ ethics, 2+ cultural questions. 4 options each, 1 correct.`;

  console.log(`  📝 Assessment: ${existing.length}→${needed}q...`);
  const a = await callClaude(prompt, 8000);
  await sleep(API_DELAY);
  console.log(`     → ${a?.questions?.length || 0}q`);
  return fixOptions(a);
}

// ═══════════════════════════════════════════════════════════════════
// METADATA (objectives + references)
// ═══════════════════════════════════════════════════════════════════

async function fixMetadata(course) {
  const obj = course.objectives || [];
  const refs = course.references || [];
  if (obj.length >= 4 && refs.length >= 5) {
    console.log(`  ✅ Metadata: ${obj.length} obj, ${refs.length} refs`);
    return { objectives: obj, references: refs };
  }
  
  const prompt = `Generate metadata for "${course.title}" (${course.ceHours} CE).
Sections: ${(course.sections || []).map(s => s.title).join(', ')}

Return JSON:
{
  "objectives": ["5-8 Bloom's taxonomy objectives — Analyze, Apply, Evaluate, etc."],
  "references": [{ "title": "Real text", "author": "Author, A.", "year": 2020, "source": "Publisher" }]
}
${obj.length < 4 ? 'Need 5+ objectives.' : ''} ${refs.length < 5 ? 'Need 6+ REAL references (clinical texts, DSM-5-TR, journals).' : ''}`;

  console.log(`  📝 Metadata...`);
  const m = await callClaude(prompt, 3000);
  await sleep(API_DELAY);
  return { objectives: m?.objectives || obj, references: m?.references || refs };
}

// ═══════════════════════════════════════════════════════════════════
// POST-PROCESSING
// ═══════════════════════════════════════════════════════════════════

function cleanSection(section, idx) {
  const s = { ...section, order: idx + 1, hasQuiz: false, quizQuestions: section.quizQuestions || [] };
  if (s.contentBlocks) {
    s.contentBlocks = s.contentBlocks.filter(b => {
      if (b.type !== 'sectionDivider') return true;
      const dt = (b.title || '').toLowerCase().replace(/module \d+[:\s]*/i, '').trim();
      const st = (section.title || '').toLowerCase().replace(/module \d+[:\s]*/i, '').trim();
      return dt !== st && !dt.includes(st) && !st.includes(dt);
    });
    s.contentBlocks.forEach((b, i) => { b.order = i + 1; });
  }
  return s;
}

function postProcess(section, originalTitle) {
  if (!section) return section;
  if (section.contentBlocks) {
    section.contentBlocks = section.contentBlocks.filter(b => {
      if (b.type !== 'sectionDivider') return true;
      const dt = (b.title || '').toLowerCase().replace(/module \d+[:\s]*/i, '').trim();
      const st = (originalTitle || section.title || '').toLowerCase().replace(/module \d+[:\s]*/i, '').trim();
      return dt !== st && !dt.includes(st) && !st.includes(dt);
    });
    section.contentBlocks.forEach(b => {
      if ((b.type === 'multipleChoice' || b.type === 'multiSelect') && b.options) {
        b.options = b.options.map((o, i) => typeof o === 'string' ? { text: o, isCorrect: i === (b.correctAnswer || 0) } : o);
        delete b.correctAnswer;
      }
    });
    section.contentBlocks.forEach((b, i) => { b.order = i + 1; });
  }
  section.hasQuiz = false;
  section.quizQuestions = section.quizQuestions || [];
  return section;
}

function fixOptions(obj) {
  if (!obj?.questions) return obj;
  obj.questions.forEach(q => {
    if (q.options) {
      q.options = q.options.map((o, i) => typeof o === 'string' ? { text: o, isCorrect: i === (q.correctAnswer || 0) } : o);
      delete q.correctAnswer;
    }
    if (!q.type) q.type = 'multipleChoice';
  });
  return obj;
}

// ═══════════════════════════════════════════════════════════════════
// PROGRESS
// ═══════════════════════════════════════════════════════════════════

function loadProgress() { try { return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8')); } catch(e) { return { completed: [], failed: [] }; } }
function saveProgress(p) { fs.writeFileSync(PROGRESS_FILE, JSON.stringify(p, null, 2)); }

// ═══════════════════════════════════════════════════════════════════
// VALIDATION
// ═══════════════════════════════════════════════════════════════════

function validate(data, ceHours) {
  const issues = [];
  const sections = data.sections || [];
  const w = countCourseWords(sections);
  const req = ceHours * WORDS_PER_CE_HOUR;
  if (w < req) issues.push(`WORDS:${w}/${req}`);
  if ((data.objectives?.length || 0) < 4) issues.push(`OBJ:${data.objectives?.length || 0}`);
  if ((data.references?.length || 0) < 5) issues.push(`REFS:${data.references?.length || 0}`);
  if ((data.assessment?.questions?.length || 0) < 15) issues.push(`EXAM:${data.assessment?.questions?.length || 0}`);
  sections.forEach((s, i) => {
    const kc = (s.contentBlocks || []).filter(b => b.type === 'multipleChoice' || b.type === 'multiSelect').length;
    if (kc < 2) issues.push(`S${i+1}KC:${kc}`);
  });
  const lastBlocks = sections[sections.length - 1]?.contentBlocks || [];
  if (!lastBlocks.some(b => b.type === 'resources' && b.resources?.length)) issues.push('NO_RESOURCES');
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
  
  // Restructure sections
  const rebuilt = [];
  for (let i = 0; i < sections.length; i++) {
    try {
      rebuilt.push(await restructureSection(course, sections[i], i, sections.length));
    } catch (e) {
      console.log(`  ❌ S${i+1} failed: ${e.message}`);
      rebuilt.push(cleanSection(sections[i], i));
    }
  }
  
  // Assessment
  let assessment;
  try { assessment = await fixAssessment(course, rebuilt.map(s => s.title)); }
  catch (e) { console.log(`  ❌ Assessment: ${e.message}`); assessment = fixOptions(course.assessment); }
  
  // Metadata
  let meta;
  try { meta = await fixMetadata({ ...course, sections: rebuilt }); }
  catch (e) { console.log(`  ❌ Metadata: ${e.message}`); meta = { objectives: course.objectives || [], references: course.references || [] }; }
  
  const refs = (meta.references || []).map(r => typeof r === 'string' ? r : `${r.author} (${r.year}). ${r.title}. ${r.source}.`);
  
  const doc = {
    title: course.title,
    slug: course.slug,
    description: course.description,
    ceHours: ce,
    ceProvider: 'NBCC ACEP #7760',
    acepNumber: '7760',
    objectives: meta.objectives,
    targetAudience: course.targetAudience || ["Licensed Professional Counselors (LPC/LPCC)", "Licensed Mental Health Counselors (LMHC)", "Licensed Clinical Social Workers (LCSW)", "Licensed Marriage and Family Therapists (LMFT)"],
    categories: course.categories || [],
    tags: course.tags || [],
    sections: rebuilt,
    assessment,
    presenter: PRESENTER,
    references: refs,
    author: "GA Integrated Therapeutic Perspectives LLC",
    status: 'draft',
    updatedAt: new Date()
  };
  
  // Fix CBT slug
  if (course.slug === 'aca-ethics-section-a-counseling-relationship' && course.title.includes('CBT')) {
    doc.slug = 'cbt-toolbox-core-techniques';
    console.log(`  🔧 Slug fix → cbt-toolbox-core-techniques`);
  }
  
  const newWords = countCourseWords(rebuilt);
  const issues = validate(doc, ce);
  
  console.log(`\n  📊 ${oldWords}w→${newWords}w | ${assessment?.questions?.length || 0}q | ${meta.objectives?.length || 0} obj | ${refs.length} refs`);
  if (issues.length) console.log(`     ⚠️  ${issues.join(' | ')}`);
  else console.log(`     ✅ ACEP compliant`);
  
  if (!DRY_RUN) {
    await db.collection('interactivecourses').updateOne({ _id: course._id }, { $set: doc });
    console.log(`  💾 Saved (draft)`);
  }
  
  return { slug: doc.slug, title: doc.title, before: oldWords, after: newWords, issues, exam: assessment?.questions?.length || 0 };
}

// ═══════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════

async function main() {
  console.log(`\n╔══════════════════════════════════════════════════════════════════════╗`);
  console.log(`║  CounselorReady — Bulk Course Rebuilder v2                         ║`);
  console.log(`║  Restructure existing content + add missing ACEP elements          ║`);
  if (DRY_RUN) console.log(`║  ⚠️  DRY RUN                                                       ║`);
  if (RESUME) console.log(`║  ♻️  RESUME MODE                                                    ║`);
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
  
  courses.sort((a, b) => (a.ceHours || 1) - (b.ceHours || 1));
  
  console.log(`📋 ${courses.length} courses to rebuild:`);
  courses.forEach((c, i) => {
    const w = countCourseWords(c.sections || []);
    const pct = Math.round(w / ((c.ceHours || 1) * WORDS_PER_CE_HOUR) * 100);
    console.log(`   ${i+1}. [${c.ceHours || 1}CE] ${c.title} (${pct}%)`);
  });
  
  const results = [];
  let ok = 0, fail = 0;
  
  for (let i = 0; i < courses.length; i++) {
    try {
      const r = await rebuildCourse(courses[i], db);
      results.push(r);
      progress.completed.push(courses[i].slug);
      saveProgress(progress);
      ok++;
      console.log(`  ⏱️  ${i+1}/${courses.length} done\n`);
    } catch (e) {
      console.log(`  ❌ FAILED: ${e.message}\n`);
      results.push({ slug: courses[i].slug, title: courses[i].title, error: e.message });
      progress.failed.push({ slug: courses[i].slug, error: e.message });
      saveProgress(progress);
      fail++;
    }
  }
  
  console.log(`\n${'═'.repeat(70)}`);
  console.log(`COMPLETE — ${ok} rebuilt, ${fail} failed, ${SKIP_SLUGS.length} skipped`);
  console.log(`${'═'.repeat(70)}\n`);
  
  results.forEach(r => {
    if (r.error) console.log(`  ❌ ${r.title}: ${r.error}`);
    else console.log(`  ${r.issues?.length ? '⚠️' : '✅'} ${r.title}: ${r.before}w→${r.after}w | ${r.exam}q${r.issues?.length ? ' | ' + r.issues.join(', ') : ''}`);
  });
  
  if (!DRY_RUN) console.log(`\n📋 All saved as DRAFT — review before publishing.`);
  if (!fail && !SLUG_ARG) try { fs.unlinkSync(PROGRESS_FILE); } catch(e) {}
  await mongoose.disconnect();
  console.log('\n✅ Done!');
}

main().catch(e => { console.error('💥', e.message); process.exit(1); });
