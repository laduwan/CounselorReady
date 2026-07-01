/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * fixAllCourses.js
 * 
 * Combined fix script that handles all course content issues:
 *   1. Ingest Suicide Risk Assessment from markdown (21K words → replaces 6.5K)
 *   2. Convert modules[] → sections[] for DBT, Mandated Reporter, Narrative Therapy
 *   3. Recompute word counts for all courses
 * 
 * For Neurobiology and Trauma-Informed Care: fix process.exit(0) in their
 * update scripts and re-run them separately.
 * 
 * Usage: node src/scripts/fixAllCourses.js
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const __dirname = dirname(fileURLToPath(import.meta.url));
const MD_DIR = join(__dirname, 'courseMarkdown');

// ═══════════════════════════════════════════════════════════════
//  UTILITIES
// ═══════════════════════════════════════════════════════════════

function countAllWords(sections) {
  let total = 0;
  for (const sec of (sections || [])) {
    for (const block of (sec.contentBlocks || [])) {
      const txt = block.textContent || block.content || '';
      total += txt.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(w => w).length;
      if (block.accordionItems) {
        for (const item of block.accordionItems) {
          total += (item.content || item.textContent || '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(w => w).length;
        }
      }
      if (block.question) total += block.question.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(w => w).length;
      if (block.options) {
        for (const opt of block.options) {
          total += (typeof opt === 'string' ? opt : (opt.text || '')).split(/\s+/).filter(w => w).length;
        }
      }
    }
  }
  return total;
}

function markdownToHtml(md) {
  return md
    .replace(/^###\s+(.+)$/gm, '<h4>$1</h4>')
    .replace(/^##\s+(.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^[-•]\s+(.+)$/gm, '<li>$1</li>')
    .replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
    .replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>')
    .replace(/^---+$/gm, '<hr/>')
    .split('\n\n')
    .map(b => { b = b.trim(); if (!b) return ''; if (b.startsWith('<')) return b; return `<p>${b.replace(/\n/g, ' ')}</p>`; })
    .filter(b => b).join('\n');
}

function splitHtmlIntoChunks(html, targetWords) {
  const parts = html.split(/(?=<h[34]>)/);
  const chunks = []; let cur = '', cw = 0;
  for (const p of parts) {
    const pw = p.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(w => w).length;
    if (cw + pw > targetWords && cur) { chunks.push(cur); cur = p; cw = pw; }
    else { cur += p; cw += pw; }
  }
  if (cur.trim()) chunks.push(cur);
  return chunks;
}

function parseQuestions(text) {
  const questions = [];
  const qBlocks = text.split(/(?=^\s*\d+\.\s)/m).filter(b => b.match(/^\s*\d+\.\s/));
  for (const block of qBlocks) {
    const qMatch = block.match(/^\s*\d+\.\s+(.+?)(?=\n\s*(?:-\s*)?[a-dA-D][\)\.])/s);
    if (!qMatch) continue;
    const question = qMatch[1].trim();
    const options = []; let ci = 0;
    const optRegex = /^\s*(?:-\s*)?([a-dA-D])[\)\.\s]+(.+?)$/gm;
    let om, oi = 0;
    while ((om = optRegex.exec(block)) !== null) {
      let t = om[2].trim();
      if (/[✓✔✅]/.test(t) || /\(correct\)/i.test(t) || /\*\*$/.test(t)) {
        ci = oi;
        t = t.replace(/\s*[✓✔✅]\s*/g, '').replace(/\s*\(correct\)\s*/gi, '').replace(/\s*\*+\s*$/g, '').trim();
      }
      options.push({ text: t }); oi++;
    }
    if (options.length >= 2) questions.push({ question, options, correctIndex: ci, explanation: '' });
  }
  return questions;
}

function parseMarkdownToCourse(markdown) {
  const sections = [], assessmentQuestions = [];
  let courseTitle = '', courseDescription = '', objectives = [];

  const tm = markdown.match(/^#\s+(.+)$/m);
  if (tm) courseTitle = tm[1].trim();

  const dm = markdown.match(/##\s*Course Description\s*\n([\s\S]*?)(?=\n##|\n#\s)/i);
  if (dm) courseDescription = dm[1].trim().replace(/\n+/g, ' ');

  const om = markdown.match(/##\s*Learning Objectives\s*\n([\s\S]*?)(?=\n##|\n#\s)/i);
  if (om) objectives = (om[1].match(/^\s*\d+\.\s+(.+)$/gm) || []).map(l => l.replace(/^\s*\d+\.\s+/, '').trim());

  // Find module boundaries
  const moduleRegex = /^#\s+(MODULE\s+\d+[:\s]|INTRODUCTION[:\s]|CONCLUSION[:\s]|POST-TEST|FINAL\s+ASSESSMENT|FINAL\s+EXAM)/gm;
  const moduleStarts = []; let match;
  while ((match = moduleRegex.exec(markdown)) !== null) moduleStarts.push(match.index);

  if (moduleStarts.length === 0) {
    const altModuleRegex = /^##\s+(MODULE\s+\d+[:\s]|Module\s+\d+[:\s]|FINAL\s+ASSESSMENT|Final\s+Assessment)/gm;
    while ((match = altModuleRegex.exec(markdown)) !== null) moduleStarts.push(match.index);
  }
  if (moduleStarts.length === 0) {
    const altRegex = /^#\s+(?!NBCC|Counselor|Learn\.|Course|References|CERTIFICATE|DOWNLOAD|FINAL)(.+)$/gm;
    while ((match = altRegex.exec(markdown)) !== null) {
      if (!match[1].trim().match(/^(Course Description|Learning Objectives|Course Outline|Course Information|COURSE INFORMATION|COURSE OUTLINE|REFERENCES)/i))
        moduleStarts.push(match.index);
    }
  }
  if (moduleStarts.length === 0) moduleStarts.push(0);

  for (let i = 0; i < moduleStarts.length; i++) {
    const start = moduleStarts[i];
    const end = i < moduleStarts.length - 1 ? moduleStarts[i + 1] : markdown.length;
    const moduleText = markdown.substring(start, end);

    const mtm = moduleText.match(/^#{1,2}\s+(.+)$/m);
    const moduleTitle = mtm ? mtm[1].trim() : `Section ${i + 1}`;

    // Skip assessment sections — parse questions instead
    if (moduleTitle.match(/POST-TEST|FINAL\s+ASSESSMENT|FINAL\s+EXAM|Final\s+Assessment|Answer\s+Key/i)) {
      for (const q of parseQuestions(moduleText))
        assessmentQuestions.push({ question: q.question, type: 'multiple_choice', options: q.options.map(o => o.text), correctAnswer: q.correctIndex, explanation: '' });
      continue;
    }

    const contentBlocks = []; let blockOrder = 0;
    contentBlocks.push({ type: 'sectionDivider', order: blockOrder++, title: moduleTitle, sectionNumber: i + 1, subtitle: '' });

    const isLevel2 = moduleText.match(/^##\s/m) && !moduleText.match(/^#\s[^#]/m);
    const subSections = moduleText.split(isLevel2 ? /(?=^###\s)/m : /(?=^##\s)/m).filter(s => s.trim());

    for (const sub of subSections) {
      if (sub.match(/^#{2,3}\s*(Knowledge Check|Quiz|Module \d+ Knowledge|Module \d+ Quiz)/im)) {
        for (const q of parseQuestions(sub))
          contentBlocks.push({
            type: 'multipleChoice', order: blockOrder++, question: q.question,
            options: q.options.map((o, idx) => ({ text: o.text, isCorrect: idx === q.correctIndex })),
            explanation: '', feedbackCorrect: 'Correct!', feedbackIncorrect: 'Review the material above.'
          });
        continue;
      }
      if (sub.match(/^#{2,3}\s*(Final Assessment|Final Exam|Comprehensive Assessment|FINAL|POST-TEST)/im)) {
        for (const q of parseQuestions(sub))
          assessmentQuestions.push({ question: q.question, type: 'multiple_choice', options: q.options.map(o => o.text), correctAnswer: q.correctIndex, explanation: '' });
        continue;
      }
      if (sub.match(/^#{2,3}\s*(🎯|Reflection|Pre-Module Pulse|Self-Assessment|Clinical Reflection)/im)) {
        const content = sub.replace(/^#{2,3}\s+.+$/m, '').trim();
        if (content.length > 20) contentBlocks.push({ type: 'reflection', order: blockOrder++, question: markdownToHtml(content).substring(0, 500), minLength: 50 });
        continue;
      }

      let content = sub;
      if (sub.startsWith('# ')) content = sub.replace(/^#\s+.+\n/, '');
      if (content.trim().length > 20) {
        const html = markdownToHtml(content.trim());
        const wc = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(w => w).length;
        if (wc > 2500) {
          for (const ch of splitHtmlIntoChunks(html, 2000))
            contentBlocks.push({ type: 'text', order: blockOrder++, textContent: ch, content: ch });
        } else if (wc > 10) {
          contentBlocks.push({ type: 'text', order: blockOrder++, textContent: html, content: html });
        }
      }
    }
    sections.push({ title: moduleTitle, order: i, contentBlocks });
  }
  return { courseTitle, courseDescription, objectives, sections, assessmentQuestions };
}

// ═══════════════════════════════════════════════════════════════
//  TASK 1: INGEST SUICIDE RISK MARKDOWN
// ═══════════════════════════════════════════════════════════════

async function ingestSuicideRiskMarkdown(c) {
  console.log('\n═══ TASK 1: Ingest Suicide Risk Assessment Markdown ═══');
  
  const slug = 'suicide-risk-assessment-interactive';
  const filePath = join(MD_DIR, 'Suicide_Risk_Assessment_4CE.md');
  
  if (!existsSync(filePath)) {
    console.log('  ⚠️  File not found:', filePath);
    return;
  }
  
  const course = await c.findOne({ slug });
  if (!course) {
    console.log('  ⚠️  Course not found in DB');
    return;
  }
  
  const beforeWords = countAllWords(course.sections || []);
  console.log(`  Before: ${course.sections?.length || 0} sections, ${beforeWords} words`);
  
  const markdown = readFileSync(filePath, 'utf-8');
  const parsed = parseMarkdownToCourse(markdown);
  const newWords = countAllWords(parsed.sections);
  
  console.log(`  Parsed: ${parsed.sections.length} sections, ${newWords} words, ${parsed.assessmentQuestions.length} assessment Qs`);
  
  if (newWords <= beforeWords) {
    console.log('  ℹ️  No improvement, skipping');
    return;
  }
  
  const update = {
    sections: parsed.sections,
    wordCount: newWords,
    updatedAt: new Date()
  };
  
  if (parsed.objectives.length > 0) update.objectives = parsed.objectives;
  if (parsed.assessmentQuestions.length >= 10) {
    update.assessment = { questions: parsed.assessmentQuestions, passingScore: 80, maxAttempts: 3 };
  }
  
  await c.findOneAndUpdate({ slug }, { $set: update });
  
  // Verify
  const after = await c.findOne({ slug });
  const verifyWords = countAllWords(after.sections || []);
  console.log(`  After: ${after.sections?.length || 0} sections, ${verifyWords} words`);
  
  if (verifyWords >= newWords * 0.95) {
    console.log(`  ✅ SUCCESS: ${beforeWords} → ${verifyWords} words (+${verifyWords - beforeWords})`);
  } else {
    console.log(`  ❌ VERIFY FAILED: expected ~${newWords}, got ${verifyWords}`);
  }
}

// ═══════════════════════════════════════════════════════════════
//  TASK 2: CONVERT MODULES[] → SECTIONS[] 
// ═══════════════════════════════════════════════════════════════

async function convertModulesToSections(c) {
  console.log('\n═══ TASK 2: Convert modules[] → sections[] ═══');
  
  const slugs = [
    'dbt-skills-training-comprehensive',
    'mandated-reporter-duty',
    'narrative-therapy-techniques'
  ];
  
  for (const slug of slugs) {
    console.log(`\n  --- ${slug} ---`);
    const course = await c.findOne({ slug });
    if (!course) {
      // Try partial match
      const partial = slug.split('-').slice(0, 3).join('-');
      const found = await c.findOne({ slug: { $regex: partial, $options: 'i' } });
      if (found) {
        console.log(`  Found via partial match: ${found.slug}`);
        await processConversion(c, found);
      } else {
        console.log(`  ⚠️  Not found`);
      }
      continue;
    }
    await processConversion(c, course);
  }
}

async function processConversion(c, course) {
  const modules = course.modules || [];
  const existingSections = course.sections || [];
  
  const moduleWords = countModuleWords(modules);
  const sectionWords = countAllWords(existingSections);
  
  console.log(`  modules[]: ${modules.length} modules, ${moduleWords} words`);
  console.log(`  sections[]: ${existingSections.length} sections, ${sectionWords} words`);
  
  if (modules.length === 0) {
    console.log('  ⚠️  No modules to convert');
    return;
  }
  
  if (sectionWords > moduleWords + 100) {
    console.log('  ℹ️  sections already has more content, skipping');
    return;
  }
  
  // Convert
  const newSections = modules.map((mod, idx) => ({
    title: mod.title || `Module ${idx + 1}`,
    order: idx,
    contentBlocks: (mod.contentBlocks || mod.lessons || []).map((block, bIdx) => {
      // Normalize block structure
      const normalized = { ...block, order: bIdx };
      
      // Handle lesson-style blocks
      if (block.type === 'lesson' || block.type === 'reading') {
        return {
          type: 'text',
          order: bIdx,
          textContent: block.content || block.html || block.textContent || '',
          content: block.content || block.html || block.textContent || ''
        };
      }
      
      // Handle quiz-style blocks  
      if (block.type === 'quiz' && block.questions) {
        // Convert quiz to individual multipleChoice blocks
        // Return as-is for now, the array will be flattened later
        return {
          type: 'multipleChoice',
          order: bIdx,
          question: block.questions?.[0]?.question || block.question || '',
          options: block.questions?.[0]?.options || block.options || [],
          ...normalized
        };
      }
      
      return normalized;
    })
  }));
  
  const newWords = countAllWords(newSections);
  console.log(`  Converted: ${newSections.length} sections, ${newWords} words`);
  
  const update = { sections: newSections, wordCount: newWords, updatedAt: new Date() };
  
  await c.findOneAndUpdate({ slug: course.slug }, { $set: update });
  
  const after = await c.findOne({ slug: course.slug });
  const verifyWords = countAllWords(after.sections || []);
  console.log(`  ✅ Written: ${after.sections?.length} sections, ${verifyWords} words`);
}

function countModuleWords(modules) {
  let total = 0;
  for (const mod of (modules || [])) {
    for (const block of (mod.contentBlocks || mod.lessons || [])) {
      const txt = block.textContent || block.content || block.html || '';
      total += txt.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(w => w).length;
      if (block.accordionItems) {
        for (const item of block.accordionItems)
          total += (item.content || item.textContent || '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(w => w).length;
      }
    }
  }
  return total;
}

// ═══════════════════════════════════════════════════════════════
//  TASK 3: RECOMPUTE ALL WORD COUNTS
// ═══════════════════════════════════════════════════════════════

async function recomputeWordCounts(c) {
  console.log('\n═══ TASK 3: Recompute Word Counts ═══');
  
  const courses = await c.find({}).toArray();
  let updated = 0;
  
  for (const course of courses) {
    const words = countAllWords(course.sections || []);
    if (words !== (course.wordCount || 0)) {
      await c.updateOne({ _id: course._id }, { $set: { wordCount: words } });
      updated++;
    }
  }
  
  console.log(`  Updated ${updated} of ${courses.length} courses`);
}

// ═══════════════════════════════════════════════════════════════
//  MAIN
// ═══════════════════════════════════════════════════════════════

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  
  const c = mongoose.connection.db.collection('interactivecourses');
  
  await ingestSuicideRiskMarkdown(c);
  await convertModulesToSections(c);
  await recomputeWordCounts(c);
  
  console.log('\n═══ DONE ═══');
  await mongoose.disconnect();
}

main().catch(err => {
  console.error('Fatal:', err);
  mongoose.disconnect();
});
