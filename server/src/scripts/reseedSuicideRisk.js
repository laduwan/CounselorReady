/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// reseedSuicideRisk.js — Re-load Suicide Risk Assessment from markdown
// Run: node src/scripts/reseedSuicideRisk.js

import mongoose from 'mongoose';
// Run validator first: node src/scripts/validateSeed.js src/scripts/reseedSuicideRisk.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

function markdownToHtml(md) {
  return md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hp])/gm, '<p>')
    .replace(/(?<![>])$/gm, '</p>');
}

async function run() {
  console.log('\\n' + '═'.repeat(60));
  console.log('  RE-SEED SUICIDE RISK ASSESSMENT (4CE)');
  console.log('═'.repeat(60));

  // Read markdown
  const mdPath = path.join(__dirname, 'courseMarkdown', 'Suicide_Risk_Assessment_4CE.md');
  if (!fs.existsSync(mdPath)) {
    console.log('❌ File not found:', mdPath);
    console.log('   Make sure Suicide_Risk_Assessment_4CE.md is in src/scripts/courseMarkdown/');
    process.exit(1);
  }

  const content = fs.readFileSync(mdPath, 'utf-8');
  const totalWords = content.split(/\s+/).length;
  console.log(`\\n  📄 Read ${totalWords.toLocaleString()} words from markdown`);

  // Parse modules
  const moduleRegex = /^# MODULE\s*(\d+)[:\s]*(.+)$/gim;
  const moduleHeaders = [];
  let mm;
  while ((mm = moduleRegex.exec(content)) !== null) {
    moduleHeaders.push({ num: parseInt(mm[1]), title: mm[2].trim(), index: mm.index });
  }

  // Find boundaries
  const boundaries = ['# CONCLUSION', '# POST-TEST', '# BIBLIOGRAPHY', '# FINAL ASSESSMENT', '# REFERENCES'];

  const modules = [];
  moduleHeaders.forEach((mod, i) => {
    const nextMod = moduleHeaders[i + 1];
    let endIdx = nextMod ? nextMod.index : content.length;
    
    boundaries.forEach(b => {
      const idx = content.indexOf(b, mod.index + 10);
      if (idx > mod.index && idx < endIdx) endIdx = idx;
    });

    const moduleContent = content.substring(mod.index, endIdx);
    const moduleHtml = markdownToHtml(moduleContent);
    const moduleWords = moduleContent.split(/\s+/).length;

    modules.push({
      title: mod.title.replace(/^\*\*|\*\*$/g, '').replace(/[–—]/g, '-').trim(),
      order: mod.num,
      lessons: [{
        title: mod.title.replace(/^\*\*|\*\*$/g, '').trim(),
        content: moduleHtml,
        order: 1,
        type: 'text'
      }]
    });

    console.log(`  M${mod.num}: ${moduleWords.toLocaleString()} words — ${mod.title.substring(0, 50)}`);
  });

  // Parse assessment questions
  const assessSection = content.substring(content.indexOf('# FINAL ASSESSMENT') || content.length);
  const questions = [];
  const qRegex = /(\d+)\.\s+(.+?)(?=\n\s*[a-d]\))/gs;
  let qm;
  while ((qm = qRegex.exec(assessSection)) !== null) {
    questions.push({
      questionText: qm[2].trim(),
      options: [],
      order: parseInt(qm[1])
    });
  }

  console.log(`\\n  📝 Parsed ${modules.length} modules, ${questions.length} assessment questions`);

  // Connect and update
  await mongoose.connect(MONGO_URI);
  console.log('  ✅ Connected to MongoDB');

  const Course = mongoose.connection.models.Course ||
    mongoose.model('Course', new mongoose.Schema({}, { strict: false, collection: 'courses' }));

  // Find the existing course
  const existing = await Course.findOne({
    title: /suicide risk assessment/i
  });

  if (!existing) {
    console.log('  ❌ Course not found in database!');
    await mongoose.disconnect();
    return;
  }

  console.log(`  📌 Found: "${existing.title}" (ID: ${existing._id})`);
  
  // Count current words
  let beforeWords = 0;
  for (const m of (existing.modules || [])) {
    for (const l of (m.lessons || [])) {
      beforeWords += (l.content || '').replace(/<[^>]*>/g, ' ').split(/\s+/).filter(w => w).length;
    }
  }
  console.log(`  📊 Before: ${beforeWords} words`);

  // Update with full content
  existing.modules = modules;
  existing.ceHours = 4;
  existing.ceuHours = 4;
  existing.credits = 4;
  existing.status = 'published';
  existing.markModified('modules');
  await existing.save();

  // Verify
  let afterWords = 0;
  for (const m of modules) {
    for (const l of (m.lessons || [])) {
      afterWords += (l.content || '').replace(/<[^>]*>/g, ' ').split(/\s+/).filter(w => w).length;
    }
  }

  console.log(`  📊 After: ${afterWords} words`);
  console.log(`  ✅ SAVED — ${modules.length} modules, ${afterWords} words, published`);

  await mongoose.disconnect();
  console.log('\\n✅ Done\\n');
}

run().catch(err => { console.error('❌', err.message); process.exit(1); });
