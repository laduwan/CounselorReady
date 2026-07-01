/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * fixBeyondTheSurface.js
 * 
 * Targeted fix for "Beyond the Surface: Multicultural Competence in Clinical Practice"
 * 
 * Problem: 15 sections — but 11 are syllabus boilerplate (policies, grading, 
 * accommodations, etc.). The actual teaching content is crammed into Section 4 
 * "COURSE MODULES" at ~19,600 words. The rest is administrative filler.
 * 
 * Fix: Extract S4's teaching content, split into 6 proper sections for 3CE,
 * preserve learning objectives and conclusion, discard boilerplate, then let
 * the rebuild script add interactive elements on the next pass.
 * 
 * Usage:
 *   DRY_RUN=true node fixBeyondTheSurface.js   (preview changes)
 *   node fixBeyondTheSurface.js                 (apply to database)
 */

import { MongoClient } from 'mongodb';

const DRY_RUN = process.env.DRY_RUN === 'true';
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
const SLUG = 'beyond-the-surface-multicultural-competence-in-clinical-practice';

function stripHtml(html) {
  return (html || '').replace(/<[^>]+>/g, ' ').replace(/&\w+;/g, ' ').replace(/\s+/g, ' ').trim();
}
function countWords(text) {
  const p = stripHtml(text);
  return p ? p.split(/\s+/).filter(w => w.length > 0).length : 0;
}
function getHtml(b) { return b.content || b.textContent || ''; }

// Boilerplate section titles that should be removed
const BOILERPLATE = new Set([
  'course learning objectives',
  'assignments and assessment',
  'required readings and resources',
  'course policies and procedures',
  'assessment and grading',
  'accommodations and support',
  'instructor qualifications and support',
  'professional development opportunities',
  'course evaluation and improvement',
  'appendices',
  'comprehensive supplemental resources',
]);

async function main() {
  console.log(`\n${'═'.repeat(70)}`);
  console.log(`  Fix: Beyond the Surface — Restructure from Syllabus to Course`);
  console.log(`  Mode: ${DRY_RUN ? '🔍 DRY RUN (no changes)' : '💾 LIVE (writing to DB)'}`);
  console.log(`${'═'.repeat(70)}\n`);

  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db();
  
  const course = await db.collection('interactivecourses').findOne({ slug: SLUG });
  if (!course) { console.log('❌ Course not found'); process.exit(1); }

  const sections = course.sections || [];
  console.log(`Found: ${course.title}`);
  console.log(`Current: ${sections.length} sections, ${course.ceHours}CE\n`);

  // ── Step 1: Classify sections ──
  console.log('── Step 1: Classify sections ──');
  const teaching = [];
  const boilerplate = [];
  const objectives = [];
  let conclusionContent = '';

  for (let i = 0; i < sections.length; i++) {
    const s = sections[i];
    const titleLower = (s.title || '').toLowerCase().replace(/^(section|module)\s*\d+[:\s]*/i, '').trim();
    const textBlocks = (s.contentBlocks || []).filter(b => b.type === 'text');
    const totalWords = textBlocks.reduce((sum, b) => sum + countWords(getHtml(b)), 0);
    const interactiveBlocks = (s.contentBlocks || []).filter(b => b.type !== 'text' && b.type !== 'sectionDivider');

    if (BOILERPLATE.has(titleLower)) {
      console.log(`   [DISCARD] S${i+1}: "${s.title}" (${totalWords}w, ${interactiveBlocks.length} interactive)`);
      boilerplate.push(s);
    } else if (titleLower === 'course introduction') {
      // Keep intro but it's thin — will merge with first teaching section
      console.log(`   [INTRO]   S${i+1}: "${s.title}" (${totalWords}w)`);
      teaching.push({ ...s, role: 'intro' });
    } else if (titleLower.includes('theoretical foundation')) {
      console.log(`   [THEORY]  S${i+1}: "${s.title}" (${totalWords}w)`);
      teaching.push({ ...s, role: 'theory' });
    } else if (titleLower === 'course modules' || totalWords > 5000) {
      console.log(`   [CONTENT] S${i+1}: "${s.title}" (${totalWords}w) ← MAIN CONTENT`);
      teaching.push({ ...s, role: 'main' });
    } else if (titleLower === 'conclusion') {
      console.log(`   [CONCL]   S${i+1}: "${s.title}" (${totalWords}w)`);
      conclusionContent = textBlocks.map(b => getHtml(b)).join('');
    } else {
      console.log(`   [KEEP?]   S${i+1}: "${s.title}" (${totalWords}w, ${interactiveBlocks.length} interactive)`);
      teaching.push({ ...s, role: 'other' });
    }
  }

  console.log(`\n   Teaching sections: ${teaching.length}`);
  console.log(`   Boilerplate sections: ${boilerplate.length}`);
  console.log(`   Total boilerplate words discarded: ${boilerplate.reduce((s, sec) => s + (sec.contentBlocks||[]).filter(b=>b.type==='text').reduce((w,b)=>w+countWords(getHtml(b)),0), 0)}w`);

  // ── Step 2: Extract and split main content ──
  console.log('\n── Step 2: Split main teaching content ──');
  
  const mainSection = teaching.find(s => s.role === 'main');
  if (!mainSection) { console.log('❌ No main content section found'); process.exit(1); }

  // Get all text content from main section
  const mainHtml = (mainSection.contentBlocks || [])
    .filter(b => b.type === 'text')
    .map(b => getHtml(b))
    .join('\n');
  
  // Split by h2/h3 headings (module boundaries in the original content)
  const headingPattern = /<h[23][^>]*>(.*?)<\/h[23]>/gi;
  const parts = [];
  let lastIndex = 0;
  let match;
  const headings = [];
  
  while ((match = headingPattern.exec(mainHtml)) !== null) {
    headings.push({ title: stripHtml(match[1]), index: match.index, fullMatch: match[0] });
  }

  // Group content by heading
  if (headings.length > 0) {
    // Content before first heading
    const preContent = mainHtml.substring(0, headings[0].index).trim();
    if (preContent && countWords(preContent) > 100) {
      parts.push({ title: 'Introduction to Multicultural Competence', html: preContent });
    }
    
    for (let i = 0; i < headings.length; i++) {
      const start = headings[i].index;
      const end = i + 1 < headings.length ? headings[i+1].index : mainHtml.length;
      const html = mainHtml.substring(start, end).trim();
      const words = countWords(html);
      if (words > 200) { // Skip tiny fragments
        parts.push({ title: headings[i].title, html, words });
      }
    }
  }

  console.log(`   Found ${parts.length} content segments from headings`);
  parts.forEach((p, i) => console.log(`     ${i+1}. "${p.title}" (${countWords(p.html)}w)`));

  // ── Step 3: Merge small segments into 6 target sections ──
  console.log('\n── Step 3: Merge into 6 sections (target for 3CE) ──');
  
  const TARGET_SECTIONS = 6;
  const totalTeachingWords = parts.reduce((s, p) => s + countWords(p.html), 0);
  const targetWordsPerSection = Math.ceil(totalTeachingWords / TARGET_SECTIONS);
  
  console.log(`   Total teaching words: ${totalTeachingWords}`);
  console.log(`   Target per section: ~${targetWordsPerSection}w`);

  const newSections = [];
  let currentParts = [];
  let currentWords = 0;

  for (let pi = 0; pi < parts.length; pi++) {
    const part = parts[pi];
    const partWords = countWords(part.html);
    currentParts.push(part);
    currentWords += partWords;
    
    const remainingParts = parts.length - pi - 1;
    const sectionsStillNeeded = TARGET_SECTIONS - newSections.length;
    
    // Split when: we've hit target words OR we need to split now to have 
    // enough sections (1 part per remaining section minimum)
    const hitTarget = currentWords >= targetWordsPerSection && sectionsStillNeeded > 1;
    const mustSplitToDistribute = remainingParts > 0 && remainingParts < sectionsStillNeeded && sectionsStillNeeded > 1;
    const isLastPart = pi === parts.length - 1;
    
    if (hitTarget || mustSplitToDistribute || isLastPart) {
      newSections.push({
        title: currentParts[0].title,
        html: currentParts.map(p => p.html).join('\n'),
        words: currentWords
      });
      currentParts = [];
      currentWords = 0;
    }
  }

  // If conclusion exists, append to last section or add as final
  if (conclusionContent && countWords(conclusionContent) > 50) {
    newSections[newSections.length - 1].html += `\n<h3>Conclusion</h3>\n${conclusionContent}`;
    newSections[newSections.length - 1].words += countWords(conclusionContent);
    console.log(`   Appended conclusion (${countWords(conclusionContent)}w) to final section`);
  }

  console.log(`\n   New section structure:`);
  newSections.forEach((s, i) => console.log(`     S${i+1}: "${s.title}" (${s.words}w)`));

  // ── Step 4: Build proper section documents ──
  console.log('\n── Step 4: Build section documents ──');

  const builtSections = newSections.map((s, i) => ({
    title: s.title,
    sectionNumber: i + 1,
    order: i + 1,
    estimatedTime: Math.max(10, Math.round(s.words / 200)),
    contentBlocks: [
      {
        type: 'sectionDivider',
        order: 1,
        title: s.title,
        sectionNumber: i + 1,
      },
      {
        type: 'text',
        order: 2,
        content: s.html,
        textContent: s.html,
      }
    ]
  }));

  const totalNewWords = newSections.reduce((s, sec) => s + sec.words, 0);
  console.log(`   Built ${builtSections.length} sections, ${totalNewWords} total words`);

  // ── Step 5: Preserve existing interactive blocks ──
  // Gather all non-text, non-divider blocks from old teaching sections
  const preservedBlocks = [];
  for (const s of teaching) {
    for (const b of (s.contentBlocks || [])) {
      if (b.type !== 'text' && b.type !== 'sectionDivider') {
        preservedBlocks.push(b);
      }
    }
  }
  console.log(`   Preserved ${preservedBlocks.length} interactive blocks from old sections`);

  // Distribute preserved blocks across new sections (round-robin)
  if (preservedBlocks.length > 0) {
    preservedBlocks.forEach((b, i) => {
      const targetIdx = i % builtSections.length;
      const blocks = builtSections[targetIdx].contentBlocks;
      b.order = blocks.length + 1;
      blocks.push(b);
    });
    console.log(`   Distributed to new sections`);
  }

  // ── Step 6: Write ──
  console.log(`\n── Step 5: ${DRY_RUN ? 'Preview' : 'Save'} ──`);
  
  const update = {
    sections: builtSections,
    sectionCount: builtSections.length,
    moduleCount: builtSections.length,
    wordCount: totalNewWords,
    status: 'draft',
    updatedAt: new Date(),
  };

  console.log(`\n   BEFORE: ${sections.length} sections, ~${sections.reduce((s, sec) => s + (sec.contentBlocks||[]).filter(b=>b.type==='text').reduce((w,b)=>w+countWords(getHtml(b)),0), 0)}w`);
  console.log(`   AFTER:  ${builtSections.length} sections, ${totalNewWords}w, ${preservedBlocks.length} interactive blocks preserved`);

  if (!DRY_RUN) {
    await db.collection('interactivecourses').updateOne(
      { _id: course._id },
      { $set: update }
    );
    console.log(`   💾 Saved as draft`);
    console.log(`\n   Next: re-run bulkRebuildCourses.js --slug=${SLUG}`);
    console.log(`   That will add interactive blocks, fix metadata, and run compliance checks.`);
  } else {
    console.log(`   🔍 Dry run — no changes saved`);
  }

  await client.close();
  console.log(`\n${'═'.repeat(70)}`);
  console.log(`  Done!`);
  console.log(`${'═'.repeat(70)}\n`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
