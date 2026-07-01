/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// diagnoseParser.js — Find EXACTLY what the parser drops
// Run: node src/scripts/diagnoseParser.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const mdDir = path.join(__dirname, 'courseMarkdown');

const files = [
  'Elephant_in_the_Room_EXPANDED.md',
  'Walking_on_Eggshells_EXPANDED.md',
  'It_Takes_a_Village_EXPANDED.md',
  'When_It_Rains_It_Pours_EXPANDED.md',
  'Lost_in_Translation_Cultural_Competency_3CE(1).md',
  'Pursuit_of_Happyness_Anxiety_Depression_3CE(1).md',
  'Beyond_the_Surface_Multicultural_Competence_3CE.md',
];

for (const file of files) {
  const filepath = path.join(mdDir, file);
  if (!fs.existsSync(filepath)) { console.log(`NOT FOUND: ${file}`); continue; }
  
  const content = fs.readFileSync(filepath, 'utf-8');
  const totalWords = content.split(/\s+/).length;
  
  // Find module boundaries
  const modulePattern = /^# MODULE\s+(\d+)[:\s]+(.+)$/gim;
  const matches = [...content.matchAll(modulePattern)];
  
  // End markers used by parser
  const endMarkers = ['# CONCLUSION', '# POST-TEST', '# BIBLIOGRAPHY', '# FINAL ASSESSMENT', '# REFERENCES', '# COURSE COMPLETION', '# COMPREHENSIVE FINAL'];
  
  // Words BEFORE first module
  const firstModStart = matches.length > 0 ? matches[0].index : content.length;
  const beforeContent = content.substring(0, firstModStart);
  const beforeWords = beforeContent.split(/\s+/).filter(w => w).length;
  
  // Words in each module (as parser sees them)
  let parsedModuleWords = 0;
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index;
    let end = i + 1 < matches.length ? matches[i + 1].index : content.length;
    
    for (const marker of endMarkers) {
      const idx = content.indexOf(marker, start + 10);
      if (idx > start && idx < end) end = idx;
    }
    
    const chunk = content.substring(start, end);
    parsedModuleWords += chunk.split(/\s+/).filter(w => w).length;
  }
  
  // Words AFTER last module's end
  let lastEnd = 0;
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index;
    let end = i + 1 < matches.length ? matches[i + 1].index : content.length;
    for (const marker of endMarkers) {
      const idx = content.indexOf(marker, start + 10);
      if (idx > start && idx < end) end = idx;
    }
    lastEnd = Math.max(lastEnd, end);
  }
  const afterContent = content.substring(lastEnd);
  const afterWords = afterContent.split(/\s+/).filter(w => w).length;
  
  // Check what's in the "after" section
  const hasExam = /FINAL ASSESSMENT|POST-TEST|COMPREHENSIVE FINAL/i.test(afterContent);
  const hasReferences = /REFERENCES|BIBLIOGRAPHY/i.test(afterContent);
  const questionCount = (afterContent.match(/^\d+\.\s+/gm) || []).length;
  
  // Check what headings exist that parser's markdownToHtml DELETES (^# .+$)
  const moduleChunks = [];
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index;
    let end = i + 1 < matches.length ? matches[i + 1].index : content.length;
    for (const marker of endMarkers) {
      const idx = content.indexOf(marker, start + 10);
      if (idx > start && idx < end) end = idx;
    }
    moduleChunks.push(content.substring(start, end));
  }
  
  let h1DeletedLines = 0;
  let h1DeletedWords = 0;
  for (const chunk of moduleChunks) {
    const h1Lines = chunk.match(/^# .+$/gm) || [];
    h1DeletedLines += h1Lines.length;
    h1DeletedWords += h1Lines.join(' ').split(/\s+/).length;
  }
  
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  ${file}`);
  console.log(`${'═'.repeat(60)}`);
  console.log(`  Total words in file:     ${totalWords.toLocaleString()}`);
  console.log(`  Modules found:           ${matches.length}`);
  console.log(`  `);
  console.log(`  ❌ BEFORE Module 1:       ${beforeWords.toLocaleString()} words DROPPED`);
  console.log(`     (intro, description, objectives)`);
  console.log(`  ❌ AFTER last module:      ${afterWords.toLocaleString()} words DROPPED`);
  console.log(`     Has exam?              ${hasExam ? 'YES — EXAM IS BEING THROWN AWAY' : 'no'}`);
  console.log(`     Has references?        ${hasReferences ? 'YES' : 'no'}`);
  console.log(`     Question count:        ${questionCount}`);
  console.log(`  ❌ H1 headings deleted:    ${h1DeletedLines} lines (${h1DeletedWords} words)`);
  console.log(`  `);
  console.log(`  Parser captures:          ${parsedModuleWords.toLocaleString()} words`);
  console.log(`  Total dropped:            ${(totalWords - parsedModuleWords).toLocaleString()} words (${Math.round((totalWords - parsedModuleWords) * 100 / totalWords)}%)`);
  
  // Show first 3 lines of dropped "after" content
  const afterLines = afterContent.split('\n').filter(l => l.trim()).slice(0, 5);
  if (afterLines.length > 0) {
    console.log(`  `);
    console.log(`  First lines of dropped content:`);
    for (const l of afterLines) {
      console.log(`     > ${l.substring(0, 70)}`);
    }
  }
}
