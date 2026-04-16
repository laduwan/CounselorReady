/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// reseedFromMarkdown_v3.js — Uses updateOne/$set (proven to work) instead of save()
// Run: node src/scripts/reseedFromMarkdown_v3.js

import mongoose from 'mongoose';
// Run validator first: node src/scripts/validateSeed.js src/scripts/reseedFromMarkdown_v3.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { compareWordCounts } from '../utils/contentValidator.js';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

function markdownToHtml(md) {
  if (!md) return '';
  const lines = md.split('\n');
  const result = [];
  let inTable = false;
  let tableRows = [];
  let inList = false;
  let listType = null; // 'ul' or 'ol'
  let listItems = [];

  function flushList() {
    if (inList && listItems.length > 0) {
      const tag = listType || 'ul';
      result.push(`<${tag}>${listItems.join('')}</${tag}>`);
      listItems = [];
      inList = false;
      listType = null;
    }
  }

  function flushTable() {
    if (inTable && tableRows.length > 0) {
      let tableHtml = '<table style="width:100%;border-collapse:collapse;margin:12px 0;">';
      tableRows.forEach((row, idx) => {
        const cells = row.split('|').filter(c => c.trim());
        if (idx === 0) {
          tableHtml += '<thead><tr>' + cells.map(c => `<th>${applyInline(c.trim())}</th>`).join('') + '</tr></thead><tbody>';
        } else {
          tableHtml += '<tr>' + cells.map(c => `<td>${applyInline(c.trim())}</td>`).join('') + '</tr>';
        }
      });
      tableHtml += '</tbody></table>';
      result.push(tableHtml);
      tableRows = [];
      inTable = false;
    }
  }

  function applyInline(text) {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/(?<![a-zA-Z:\/])\*([^*\n]+)\*(?![a-zA-Z])/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
  }

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trim();

    // Preserve empty lines as paragraph breaks (don't skip them)
    if (!line) {
      flushList();
      flushTable();
      continue;
    }

    // Horizontal rules — preserve as visual separator
    if (/^---+$/.test(line)) {
      flushList();
      flushTable();
      result.push('<hr/>');
      continue;
    }

    // Table rows
    if (/^\|/.test(line)) {
      flushList();
      // Skip separator rows (|---|---|)
      if (/^\|[-\s|:]+\|$/.test(line)) {
        continue;
      }
      inTable = true;
      tableRows.push(line);
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Headings
    if (line.startsWith('#### ')) {
      flushList();
      result.push(`<h4>${applyInline(line.substring(5))}</h4>`);
    } else if (line.startsWith('### ')) {
      flushList();
      result.push(`<h3>${applyInline(line.substring(4))}</h3>`);
    } else if (line.startsWith('## ')) {
      flushList();
      result.push(`<h2>${applyInline(line.substring(3))}</h2>`);
    } else if (line.startsWith('# ')) {
      flushList();
      result.push(`<h2>${applyInline(line.substring(2))}</h2>`);
    }
    // Bullet lists — collect into proper <ul>
    else if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList || listType !== 'ul') { flushList(); inList = true; listType = 'ul'; }
      listItems.push(`<li>${applyInline(line.substring(2))}</li>`);
    }
    // Numbered lists — collect into proper <ol>
    else if (/^\d+\.\s/.test(line)) {
      if (!inList || listType !== 'ol') { flushList(); inList = true; listType = 'ol'; }
      const content = line.replace(/^\d+\.\s+/, '');
      listItems.push(`<li>${applyInline(content)}</li>`);
    }
    // Blockquotes
    else if (line.startsWith('> ')) {
      flushList();
      result.push(`<blockquote><p>${applyInline(line.substring(2))}</p></blockquote>`);
    }
    // APA reference entries — preserve with cr-reference class
    else if (/^[A-Z][a-z]+,\s+[A-Z]/.test(line) && /\(\d{4}\)/.test(line)) {
      flushList();
      result.push(`<p class="cr-reference">${applyInline(line)}</p>`);
    }
    // Regular paragraph
    else {
      flushList();
      result.push(`<p>${applyInline(line)}</p>`);
    }
  }

  flushList();
  flushTable();
  return result.join('\n');
}

function countWords(html) {
  return (html || '').replace(/<[^>]*>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim().split(/\s+/).filter(w => w).length;
}

function parseFullCourse(content) {
  const modulePattern = /^# MODULE\s+(\d+)[:\s]+(.+)$/gim;
  const matches = [...content.matchAll(modulePattern)];

  if (matches.length === 0) {
    // No MODULE headers — use ## as boundaries
    const h2Pattern = /^## (.+)$/gm;
    const h2Matches = [...content.matchAll(h2Pattern)];
    const skipH2 = ['NBCC', 'Course Description', 'Course Information', 'Learning Objectives', 'Course Outline', 'CounselorReady', 'COURSE INFORMATION', 'Table of Contents'];
    const realH2s = h2Matches.filter(m => !skipH2.some(s => m[1].toUpperCase().startsWith(s.toUpperCase())));
    
    if (realH2s.length >= 2) {
      const modules = [];
      const introContent = content.substring(0, realH2s[0].index);
      if (introContent.split(/\s+/).length > 100) {
        modules.push({ title: 'Course Introduction', order: 0, html: markdownToHtml(introContent) });
      }
      for (let i = 0; i < realH2s.length; i++) {
        const start = realH2s[i].index;
        const end = i + 1 < realH2s.length ? realH2s[i + 1].index : content.length;
        modules.push({
          title: realH2s[i][1].replace(/\*\*/g, '').trim(),
          order: modules.length + 1,
          html: markdownToHtml(content.substring(start, end))
        });
      }
      return modules;
    }
    return [{ title: 'Course Content', order: 1, html: markdownToHtml(content) }];
  }

  const modules = [];

  // Intro before first module
  const introContent = content.substring(0, matches[0].index);
  if (introContent.split(/\s+/).length > 100) {
    modules.push({ title: 'Course Introduction & Overview', order: 0, html: markdownToHtml(introContent) });
  }

  // Each module — go to NEXT module header, not to end markers
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index;
    let end;
    
    if (i + 1 < matches.length) {
      end = matches[i + 1].index;
    } else {
      // Last module — check for conclusion/exam sections
      const restOfContent = content.substring(start);
      const conclusionMatch = restOfContent.match(/\n# (CONCLUSION|FINAL ASSESSMENT|COMPREHENSIVE FINAL|POST-TEST)/i);
      if (conclusionMatch) {
        end = start + conclusionMatch.index;
        // Add conclusion+exam as separate module
        const examContent = content.substring(end);
        if (examContent.split(/\s+/).length > 50) {
          modules.push({
            title: '_EXAM_PLACEHOLDER_',
            order: 999,
            html: markdownToHtml(examContent)
          });
        }
      } else {
        end = content.length;
      }
    }

    modules.push({
      title: matches[i][2].trim().replace(/\*\*/g, ''),
      order: parseInt(matches[i][1]),
      html: markdownToHtml(content.substring(start, end))
    });
  }

  // Fix exam module order
  const examIdx = modules.findIndex(m => m.title === '_EXAM_PLACEHOLDER_');
  if (examIdx !== -1) {
    const maxOrder = Math.max(...modules.filter(m => m.title !== '_EXAM_PLACEHOLDER_').map(m => m.order));
    modules[examIdx].title = 'Conclusion & Final Assessment';
    modules[examIdx].order = maxOrder + 1;
  }

  // Sort by order
  modules.sort((a, b) => a.order - b.order);
  return modules;
}

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
  console.log('  RE-SEED v3: updateOne/$set (proven method)');
  console.log('═'.repeat(60));

  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db;
  console.log('\n  ✅ Connected\n');

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

    // Find in DB using raw driver
    const existing = await db.collection('courses').findOne({ title: course.search });
    if (!existing) {
      console.log(`  ⚠️  NOT IN DB: pattern ${course.search}`);
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

    // Build new modules in lessons format
    const newModules = modules.map((m, i) => ({
      title: m.title,
      order: m.order,
      lessons: [{
        title: m.title,
        type: 'text',
        order: 1,
        content: m.html
      }]
    }));

    let afterWords = 0;
    for (const m of newModules) {
      for (const l of m.lessons) afterWords += countWords(l.content);
    }
    totalAfter += afterWords;

    // Content preservation check — refuse to save if significant content loss
    const comparison = compareWordCounts(fileWords, afterWords, existing.title);
    if (!comparison.ok) {
      console.log(`  ⚠️  ${comparison.message}`);
      console.log(`  ⚠️  SKIPPING DB UPDATE — pipeline would strip content. Review markdownToHtml.`);
      console.log('');
      continue;
    }

    // Use updateOne with $set — this is what works
    const result = await db.collection('courses').updateOne(
      { _id: existing._id },
      { $set: { modules: newModules, ceHours: course.ce } }
    );

    const pct = Math.round(afterWords * 100 / (course.ce * 6000));
    const delta = afterWords - beforeWords;
    console.log(`  ✅ ${existing.title.substring(0, 50)}`);
    console.log(`     ${beforeWords.toLocaleString()} → ${afterWords.toLocaleString()} words (+${delta.toLocaleString()}) | ${pct}% | ${modules.length} modules`);
    console.log(`     DB result: matched=${result.matchedCount} modified=${result.modifiedCount}`);
    console.log('');
  }

  console.log('  ────────────────────────────────────────');
  console.log(`  Total: ${totalBefore.toLocaleString()} → ${totalAfter.toLocaleString()} words (+${(totalAfter - totalBefore).toLocaleString()})`);

  await mongoose.disconnect();
  console.log('\n✅ Done\n');
}

run().catch(err => { console.error('❌', err.message); process.exit(1); });
