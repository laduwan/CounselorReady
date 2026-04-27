/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// reseedFromMarkdown_v2.js — FIXED: Captures ALL content including intro, exams, references
// Run: node src/scripts/reseedFromMarkdown_v2.js

import mongoose from 'mongoose';
// Run validator first: node src/scripts/validateSeed.js src/scripts/reseedFromMarkdown_v2.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

function markdownToHtml(md) {
  const lines = md.split('\n');
  const result = [];
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (line === '---') continue;

    // Convert headings to HTML (keep ALL of them, don't delete)
    if (line.startsWith('#### ')) {
      result.push(`<h4>${line.substring(5)}</h4>`);
    } else if (line.startsWith('### ')) {
      result.push(`<h3>${line.substring(4)}</h3>`);
    } else if (line.startsWith('## ')) {
      result.push(`<h3>${line.substring(3)}</h3>`);
    } else if (line.startsWith('# ')) {
      result.push(`<h2>${line.substring(2)}</h2>`);
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      let item = line.substring(2);
      item = item.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      item = item.replace(/\*(.+?)\*/g, '<em>$1</em>');
      result.push(`<p>• ${item}</p>`);
    } else if (line.startsWith('> ')) {
      let quote = line.substring(2);
      quote = quote.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      quote = quote.replace(/\*(.+?)\*/g, '<em>$1</em>');
      result.push(`<blockquote><p>${quote}</p></blockquote>`);
    } else if (/^\|/.test(line)) {
      // Table rows — keep as-is in a <p>
      if (!/^\|[-\s|:]+\|$/.test(line)) { // skip separator rows
        const cells = line.split('|').filter(c => c.trim()).map(c => c.trim()).join(' | ');
        result.push(`<p>${cells}</p>`);
      }
    } else if (/^\d+\./.test(line)) {
      let item = line;
      item = item.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      item = item.replace(/\*(.+?)\*/g, '<em>$1</em>');
      result.push(`<p>${item}</p>`);
    } else {
      let p = line;
      p = p.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      p = p.replace(/\*(.+?)\*/g, '<em>$1</em>');
      result.push(`<p>${p}</p>`);
    }
  }
  return result.join('\n');
}

function countWords(html) {
  return (html || '').replace(/<[^>]*>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim().split(/\s+/).filter(w => w).length;
}

function parseFullCourse(content) {
  // Try to find MODULE headers (# MODULE N: ...)
  const modulePattern = /^# MODULE\s+(\d+)[:\s]+(.+)$/gim;
  const matches = [...content.matchAll(modulePattern)];

  // If no MODULE headers found, try ## headers as module boundaries
  let useH2 = false;
  if (matches.length === 0) {
    const h2Pattern = /^## (.+)$/gm;
    const h2Matches = [...content.matchAll(h2Pattern)];
    // Skip metadata h2s
    const skipH2 = ['NBCC', 'Course Description', 'Course Information', 'Learning Objectives', 'Course Outline', 'CounselorReady', 'COURSE INFORMATION', 'Table of Contents'];
    const realH2s = h2Matches.filter(m => !skipH2.some(s => m[1].toUpperCase().startsWith(s.toUpperCase())));
    
    if (realH2s.length >= 2) {
      useH2 = true;
      // Use these as module boundaries
      const modules = [];
      
      // Include everything before first real H2 as "Introduction" module
      const introContent = content.substring(0, realH2s[0].index);
      const introWords = introContent.split(/\s+/).filter(w => w).length;
      if (introWords > 100) {
        modules.push({
          title: 'Course Introduction',
          order: 0,
          html: markdownToHtml(introContent)
        });
      }
      
      for (let i = 0; i < realH2s.length; i++) {
        const start = realH2s[i].index;
        const end = i + 1 < realH2s.length ? realH2s[i + 1].index : content.length;
        const chunk = content.substring(start, end);
        modules.push({
          title: realH2s[i][1].replace(/\*\*/g, '').trim(),
          order: modules.length + 1,
          html: markdownToHtml(chunk)
        });
      }
      return modules;
    }
    
    // Still nothing? Load as single module
    return [{
      title: 'Course Content',
      order: 1,
      html: markdownToHtml(content)
    }];
  }

  // We have MODULE headers — include EVERYTHING
  const modules = [];

  // 1. INTRO MODULE: Everything before first MODULE header
  const introContent = content.substring(0, matches[0].index);
  const introWords = introContent.split(/\s+/).filter(w => w).length;
  if (introWords > 100) {
    modules.push({
      title: 'Course Introduction & Overview',
      order: 0,
      html: markdownToHtml(introContent)
    });
  }

  // 2. EACH MODULE: From header to next header (no end marker truncation!)
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index;
    const end = i + 1 < matches.length ? matches[i + 1].index : content.length;
    
    // DON'T truncate at end markers — just go to next module
    let chunk = content.substring(start, end);
    
    // But DO check if this is the last module — capture everything including exam
    // Actually, for last module, the "end" is content.length which includes everything
    
    const title = matches[i][2].trim().replace(/\*\*/g, '');
    modules.push({
      title: title,
      order: parseInt(matches[i][1]),
      html: markdownToHtml(chunk)
    });
  }

  // 3. Check if there's content AFTER the last module that got included
  //    (It should be, since we go to content.length for the last module)
  //    BUT: if there's a CONCLUSION or FINAL ASSESSMENT that's NOT a module,
  //    it's inside the last module's content. That's fine — it's captured.

  // Let's verify: find the conclusion/exam section
  const lastModuleEnd = matches.length > 0 ? 
    (matches.length > 1 ? matches[matches.length - 1].index : matches[0].index) : 0;
  
  // Check if conclusion/exam is a separate H1 section after the last module START
  const postSections = content.substring(lastModuleEnd);
  const conclusionMatch = postSections.match(/^# (CONCLUSION|FINAL ASSESSMENT|COMPREHENSIVE FINAL|POST-TEST)/im);
  
  if (conclusionMatch) {
    // The conclusion/exam is within the last module's captured content — good!
    // But let's split it out as a separate module for cleanliness
    const conclusionIdx = content.indexOf(`# ${conclusionMatch[1]}`, lastModuleEnd);
    if (conclusionIdx > lastModuleEnd) {
      // Trim last module to end before conclusion
      const lastModule = modules[modules.length - 1];
      const lastModuleStart = matches[matches.length - 1].index;
      const trimmedChunk = content.substring(lastModuleStart, conclusionIdx);
      lastModule.html = markdownToHtml(trimmedChunk);
      
      // Add conclusion + exam as final module
      const examContent = content.substring(conclusionIdx);
      const examWords = examContent.split(/\s+/).filter(w => w).length;
      if (examWords > 50) {
        modules.push({
          title: 'Conclusion & Final Assessment',
          order: modules[modules.length - 1].order + 1,
          html: markdownToHtml(examContent)
        });
      }
    }
  }

  return modules;
}

// Courses to re-seed
const COURSES = [
  { file: 'Elephant_in_the_Room_EXPANDED.md', search: /elephant in the room/i, ce: 3 },
  { file: 'Walking_on_Eggshells_EXPANDED.md', search: /walking on eggshells/i, ce: 3 },
  { file: 'It_Takes_a_Village_EXPANDED.md', search: /it takes a village/i, ce: 3 },
  { file: 'When_It_Rains_It_Pours_EXPANDED.md', search: /when it rains/i, ce: 3 },
  { file: 'Lost_in_Translation_Cultural_Competency_3CE(1).md', search: /lost in translation/i, ce: 3 },
  { file: 'Pursuit_of_Happyness_Anxiety_Depression_3CE(1).md', search: /pursuit of happyness/i, ce: 3 },
  { file: 'Beyond_the_Surface_Multicultural_Competence_3CE.md', search: /beyond the surface/i, ce: 3 },
];

async function run() {
  console.log('\n' + '═'.repeat(60));
  console.log('  RE-SEED v2: FULL CONTENT (intro + exam + references)');
  console.log('═'.repeat(60));

  await mongoose.connect(MONGO_URI);
  console.log('\n  ✅ Connected\n');

  const Course = mongoose.connection.models.Course ||
    mongoose.model('Course', new mongoose.Schema({}, { strict: false, collection: 'courses' }));

  const mdDir = path.join(__dirname, 'courseMarkdown');
  let totalBefore = 0, totalAfter = 0;

  for (const course of COURSES) {
    const filepath = path.join(mdDir, course.file);
    if (!fs.existsSync(filepath)) {
      console.log(`  ❌ NOT FOUND: ${course.file}`);
      continue;
    }

    const content = fs.readFileSync(filepath, 'utf-8');
    const fileWords = content.split(/\s+/).length;
    const modules = parseFullCourse(content);

    // Find in DB
    const existing = await Course.findOne({ title: course.search });
    if (!existing) {
      console.log(`  ⚠️  NOT IN DB: ${course.search} — creating new`);
      // Extract title from file
      const titleMatch = content.match(/^# (.+)$/m);
      const title = titleMatch ? titleMatch[1].trim() : course.file.replace('.md', '');
      
      const newModules = modules.map((m, i) => ({
        title: m.title,
        order: m.order || i + 1,
        lessons: [{ title: m.title, type: 'text', order: 1, content: m.html }]
      }));

      let totalWords = 0;
      for (const m of newModules) {
        for (const l of m.lessons) totalWords += countWords(l.content);
      }

      await Course.create({
        title: title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 80),
        ceHours: course.ce,
        credits: course.ce,
        category: 'Clinical Practice',
        status: 'draft',
        deliveryMethod: 'online',
        targetAudience: ['LPCs', 'LMHCs', 'LCSWs', 'LMFTs', 'NCCs'],
        acepProvider: { name: 'GA Integrated Therapeutic Perspectives LLC', number: '7760' },
        modules: newModules
      });

      const pct = Math.round(totalWords * 100 / (course.ce * 6000));
      console.log(`  ✅ CREATED: ${title.substring(0, 50)}`);
      console.log(`     0 → ${totalWords.toLocaleString()} words | ${pct}% of target | ${modules.length} modules\n`);
      totalAfter += totalWords;
      continue;
    }

    // Count before
    let beforeWords = 0;
    for (const m of (existing.modules || [])) {
      for (const l of (m.lessons || [])) {
        beforeWords += countWords(l.content);
      }
    }
    totalBefore += beforeWords;

    // Build new modules
    const newModules = modules.map((m, i) => ({
      title: m.title,
      order: m.order || i + 1,
      lessons: [{ title: m.title, type: 'text', order: 1, content: m.html }]
    }));

    let afterWords = 0;
    for (const m of newModules) {
      for (const l of m.lessons) afterWords += countWords(l.content);
    }
    totalAfter += afterWords;

    // Update
    existing.modules = newModules;
    existing.ceHours = course.ce;
    existing.markModified('modules');
    await existing.save();

    const pct = Math.round(afterWords * 100 / (course.ce * 6000));
    const delta = afterWords - beforeWords;
    const sign = delta >= 0 ? '+' : '';
    console.log(`  ✅ ${existing.title.substring(0, 50)}`);
    console.log(`     ${beforeWords.toLocaleString()} → ${afterWords.toLocaleString()} words (${sign}${delta.toLocaleString()}) | ${pct}% | ${modules.length} modules`);
    
    // Show module breakdown
    for (const m of modules) {
      const mw = countWords(m.html);
      console.log(`       M${m.order}: ${mw.toLocaleString()} words — ${m.title.substring(0, 40)}`);
    }
    console.log('');
  }

  console.log('  ────────────────────────────────────────');
  console.log(`  Total: ${totalBefore.toLocaleString()} → ${totalAfter.toLocaleString()} words (+${(totalAfter - totalBefore).toLocaleString()})`);

  await mongoose.disconnect();
  console.log('\n✅ Done\n');
}

run().catch(err => { console.error('❌', err.message); process.exit(1); });
