/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// reseedFromMarkdown.js — Re-load 7 courses from expanded markdown files on Render
// Reads directly from src/scripts/courseMarkdown/ — no embedded content needed
// Run: node src/scripts/reseedFromMarkdown.js

import mongoose from 'mongoose';
// Run validator first: node src/scripts/validateSeed.js src/scripts/reseedFromMarkdown.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

function markdownToHtml(md) {
  let html = md;
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^# MODULE.+$/gm, '');
  html = html.replace(/^# .+$/gm, '');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  
  const lines = html.split('\n');
  const result = [];
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line === '---') continue;
    if (line.startsWith('<h3>')) { result.push(line); continue; }
    if (line.startsWith('- ') || line.startsWith('* ')) {
      result.push(`<p>• ${line.substring(2)}</p>`);
    } else if (/^\d+\./.test(line)) {
      result.push(`<p>${line}</p>`);
    } else if (!line.startsWith('<')) {
      result.push(`<p>${line}</p>`);
    } else {
      result.push(line);
    }
  }
  return result.join('\n');
}

function parseModules(content) {
  const modulePattern = /^# MODULE\s+(\d+)[:\s]+(.+)$/gim;
  const matches = [...content.matchAll(modulePattern)];
  const endMarkers = ['# CONCLUSION', '# POST-TEST', '# BIBLIOGRAPHY', '# FINAL ASSESSMENT', '# REFERENCES', '# COURSE COMPLETION', '# COMPREHENSIVE FINAL'];

  if (matches.length === 0) {
    // No modules found — return as single module
    return [{ title: 'Course Content', order: 1, html: markdownToHtml(content) }];
  }

  const modules = [];
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index + matches[i][0].length;
    let end = i + 1 < matches.length ? matches[i + 1].index : content.length;
    
    for (const marker of endMarkers) {
      const idx = content.indexOf(marker, start);
      if (idx > start && idx < end) end = idx;
    }

    const modContent = content.substring(start, end);
    const title = matches[i][2].trim().replace(/\*\*/g, '');
    const html = markdownToHtml(modContent);

    modules.push({ title, order: parseInt(matches[i][1]), html });
  }
  return modules;
}

function countWords(html) {
  return (html || '').replace(/<[^>]*>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim().split(/\s+/).filter(w => w).length;
}

// Courses to re-seed: markdown filename → DB title search pattern
const COURSES = [
  {
    file: 'Lost_in_Translation_Cultural_Competency_3CE(1).md',
    search: /lost in translation/i,
    ce: 3
  },
  {
    file: 'Pursuit_of_Happyness_Anxiety_Depression_3CE(1).md',
    search: /pursuit of happyness/i,
    ce: 3
  },
  {
    file: 'Elephant_in_the_Room_EXPANDED.md',
    search: /elephant in the room/i,
    ce: 3
  },
  {
    file: 'Walking_on_Eggshells_EXPANDED.md',
    search: /walking on eggshells/i,
    ce: 3
  },
  {
    file: 'It_Takes_a_Village_EXPANDED.md',
    search: /it takes a village/i,
    ce: 3
  },
  {
    file: 'When_It_Rains_It_Pours_EXPANDED.md',
    search: /when it rains/i,
    ce: 3
  },
  {
    file: 'Beyond_the_Surface_Multicultural_Competence_3CE.md',
    search: /beyond the surface/i,
    ce: 3
  },
];

async function run() {
  console.log('\n' + '═'.repeat(60));
  console.log('  RE-SEED 7 COURSES FROM EXPANDED MARKDOWN');
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
    const modules = parseModules(content);

    // Find in DB
    const existing = await Course.findOne({ title: course.search });

    if (!existing) {
      console.log(`  ⚠️  NOT IN DB: ${course.file} — skipping`);
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

    // Build new modules array
    const newModules = modules.map(m => ({
      title: m.title,
      order: m.order,
      lessons: [{
        title: m.title,
        type: 'text',
        order: 1,
        content: m.html
      }]
    }));

    // Count after
    let afterWords = 0;
    for (const m of newModules) {
      for (const l of m.lessons) {
        afterWords += countWords(l.content);
      }
    }
    totalAfter += afterWords;

    // Update
    existing.modules = newModules;
    existing.ceHours = course.ce;
    existing.markModified('modules');
    await existing.save();

    const pct = Math.round(afterWords * 100 / (course.ce * 6000));
    const delta = afterWords - beforeWords;
    console.log(`  ✅ ${existing.title.substring(0, 50)}`);
    console.log(`     ${beforeWords.toLocaleString()} → ${afterWords.toLocaleString()} words (+${delta.toLocaleString()}) | ${pct}% | ${modules.length} modules`);
    console.log('');
  }

  console.log('  ────────────────────────────────────────');
  console.log(`  Total: ${totalBefore.toLocaleString()} → ${totalAfter.toLocaleString()} words (+${(totalAfter - totalBefore).toLocaleString()})`);

  await mongoose.disconnect();
  console.log('\n✅ Done\n');
}

run().catch(err => { console.error('❌', err.message); process.exit(1); });
