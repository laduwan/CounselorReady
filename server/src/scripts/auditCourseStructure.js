/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// auditCourseStructure.js
// ============================================================
// HONEST AUDIT: What does every course ACTUALLY look like?
// Run on Render shell: node src/scripts/auditCourseStructure.js
// ============================================================

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('❌ MONGODB_URI not set'); process.exit(1); }

// ACEP minimum requirements
const ACEP = {
  WORDS_PER_CE_HOUR: 6000,
  KNOWLEDGE_CHECKS_PER_SECTION: 3,  // 3 per section, spread throughout
  MIN_FINAL_EXAM_1CE: 10,           // 10 questions for 1 CE hour
  MIN_FINAL_EXAM_2CE_PLUS: 15,      // 15+ for 2+ CE hours
  PASS_THRESHOLD: 0.8
};

// Block types that count as "interactive" (not just text/dividers)
const INTERACTIVE_TYPES = new Set([
  'multipleChoice', 'multiSelect', 'matching', 'accordion',
  'cardSort', 'sequencing', 'timeline', 'hotspot',
  'scenarioTree', 'flashcardDeck', 'reflection',
  'imageText', 'video', 'videoEmbed'
]);

const PASSIVE_TYPES = new Set(['text', 'sectionDivider', 'resources', 'image']);

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB\n');

  const db = mongoose.connection.db;
  
  // Check both collections
  const interactiveCourses = await db.collection('interactivecourses').find({}).toArray();
  const legacyCourses = await db.collection('courses').find({}).toArray();

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  COUNSELORREADY COURSE STRUCTURE AUDIT');
  console.log(`  Date: ${new Date().toISOString()}`);
  console.log(`  Interactive courses: ${interactiveCourses.length}`);
  console.log(`  Legacy courses: ${legacyCourses.length}`);
  console.log('═══════════════════════════════════════════════════════════════\n');

  const results = [];

  // Audit interactive courses
  for (const course of interactiveCourses) {
    const r = auditCourse(course, 'interactivecourses');
    results.push(r);
  }

  // Audit legacy courses too
  for (const course of legacyCourses) {
    const r = auditCourse(course, 'courses');
    results.push(r);
  }

  // ─── SUMMARY TABLES ───

  // Sort by severity: worst first
  results.sort((a, b) => a.score - b.score);

  console.log('\n\n═══════════════════════════════════════════════════════════════');
  console.log('  COURSE-BY-COURSE RESULTS');
  console.log('═══════════════════════════════════════════════════════════════\n');

  for (const r of results) {
    const grade = r.score >= 80 ? '✅' : r.score >= 50 ? '⚠️' : '🔴';
    console.log(`${grade} [${r.score}/100] ${r.title}`);
    console.log(`   Collection: ${r.collection} | Status: ${r.status} | CE Hours: ${r.ceHours}`);
    console.log(`   Sections: ${r.sectionCount} | Total blocks: ${r.totalBlocks}`);
    console.log(`   Block types: ${JSON.stringify(r.blockTypeCounts)}`);
    console.log(`   Interactive blocks: ${r.interactiveBlocks} | Text-only blocks: ${r.textOnlyBlocks}`);
    console.log(`   Knowledge checks (MC/MS in sections): ${r.knowledgeChecks}${r.backToBackKC > 0 ? ` ⚡ ${r.backToBackKC} stacked back-to-back` : ''}`);
    console.log(`   Section quizzes: ${r.sectionQuizzes} (${r.sectionQuizQuestions} questions)`);
    console.log(`   Final exam: ${r.hasFinalExam ? 'YES' : '❌ NO'} (${r.finalExamQuestions} questions, need ${r.ceHours <= 1 ? '10' : '15'}+ for ${r.ceHours} CE)`);
    console.log(`   Word count: ${r.wordCount.toLocaleString()} (need ${(r.ceHours * ACEP.WORDS_PER_CE_HOUR).toLocaleString()})`);
    console.log(`   Has narration: ${r.narratedBlocks > 0 ? `YES (${r.narratedBlocks} blocks)` : 'No'}`);
    
    if (r.issues.length > 0) {
      console.log(`   ISSUES:`);
      r.issues.forEach(i => console.log(`     ⚡ ${i}`));
    }
    console.log('');
  }

  // ─── AGGREGATE STATS ───
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  AGGREGATE SUMMARY');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const total = results.length;
  const passing = results.filter(r => r.score >= 80).length;
  const warning = results.filter(r => r.score >= 50 && r.score < 80).length;
  const failing = results.filter(r => r.score < 50).length;
  const noExam = results.filter(r => !r.hasFinalExam).length;
  const textWalls = results.filter(r => r.interactiveBlocks === 0).length;
  const lowWords = results.filter(r => r.wordCount < r.ceHours * ACEP.WORDS_PER_CE_HOUR).length;
  const noKnowledgeChecks = results.filter(r => r.knowledgeChecks === 0).length;
  const oneSectionOnly = results.filter(r => r.sectionCount <= 1).length;

  console.log(`  Total courses: ${total}`);
  console.log(`  ✅ Passing (80+): ${passing}`);
  console.log(`  ⚠️  Warning (50-79): ${warning}`);
  console.log(`  🔴 Failing (<50): ${failing}`);
  console.log('');
  console.log(`  ❌ No final exam: ${noExam} courses`);
  console.log(`  ❌ Zero interactive blocks (text walls): ${textWalls} courses`);
  console.log(`  ❌ No knowledge checks: ${noKnowledgeChecks} courses`);
  console.log(`  ❌ Below ACEP word count: ${lowWords} courses`);
  console.log(`  ❌ Single section or less: ${oneSectionOnly} courses`);

  // ─── COURSES NEEDING IMMEDIATE ATTENTION ───
  const urgent = results.filter(r => r.score < 50 && r.status === 'published');
  if (urgent.length > 0) {
    console.log('\n\n🚨 PUBLISHED COURSES NEEDING IMMEDIATE ATTENTION:');
    urgent.forEach(r => {
      console.log(`  - ${r.title} (score: ${r.score}, slug: ${r.slug})`);
      r.issues.forEach(i => console.log(`      ⚡ ${i}`));
    });
  }

  // ─── TEXT WALL COURSES (need interactive rebuild) ───
  if (textWalls > 0) {
    console.log('\n\n📄 TEXT WALL COURSES (zero interactive elements):');
    results.filter(r => r.interactiveBlocks === 0).forEach(r => {
      console.log(`  - ${r.title} (${r.totalBlocks} text blocks, ${r.sectionCount} sections, slug: ${r.slug})`);
    });
  }

  // ─── COURSES WITH NO FINAL EXAM ───
  if (noExam > 0) {
    console.log('\n\n📝 COURSES MISSING FINAL EXAM:');
    results.filter(r => !r.hasFinalExam).forEach(r => {
      console.log(`  - ${r.title} (slug: ${r.slug})`);
    });
  }

  await mongoose.disconnect();
  console.log('\n\n✅ Audit complete.');
}

function auditCourse(course, collection) {
  const title = course.title || 'Untitled';
  const slug = course.slug || 'no-slug';
  const status = course.status || 'unknown';
  const ceHours = course.ceHours || 0;
  const sections = course.sections || course.modules || [];
  
  let totalBlocks = 0;
  let interactiveBlocks = 0;
  let textOnlyBlocks = 0;
  let knowledgeChecks = 0;
  let sectionQuizzes = 0;
  let sectionQuizQuestions = 0;
  let narratedBlocks = 0;
  let wordCount = 0;
  const blockTypeCounts = {};
  const issues = [];

  for (const section of sections) {
    const blocks = section.contentBlocks || section.blocks || [];
    
    // Section-level quizzes
    if (section.hasQuiz && section.quizQuestions?.length > 0) {
      sectionQuizzes++;
      sectionQuizQuestions += section.quizQuestions.length;
    }

    for (const block of blocks) {
      totalBlocks++;
      const t = block.type || 'unknown';
      blockTypeCounts[t] = (blockTypeCounts[t] || 0) + 1;

      if (INTERACTIVE_TYPES.has(t)) {
        interactiveBlocks++;
      } else if (PASSIVE_TYPES.has(t)) {
        textOnlyBlocks++;
      }

      // Count knowledge checks (MC/MS questions embedded in sections)
      if (t === 'multipleChoice' || t === 'multiSelect') {
        knowledgeChecks++;
      }

      // Check narration
      if (block.narrationUrl) narratedBlocks++;

      // Word count
      const text = [
        block.textContent, block.content, block.question,
        block.explanation, block.matchingInstructions,
        ...(block.accordionItems || []).map(a => `${a.title} ${a.content}`),
        ...(block.options || []).map(o => o.text),
        ...(block.matchingPairs || []).map(p => `${p.term} ${p.definition}`)
      ].filter(Boolean).join(' ');
      
      const plain = text.replace(/<[^>]+>/g, ' ').replace(/&\w+;/g, ' ').trim();
      if (plain) {
        wordCount += plain.split(/\s+/).filter(w => w.length > 0).length;
      }
    }
  }

  // Final exam check
  const assessment = course.assessment || {};
  const finalExamQuestions = assessment.questions?.length || 0;
  const hasFinalExam = finalExamQuestions >= 5; // at least 5 questions to count

  // Also check stored wordCount if our calculation seems low
  if (course.wordCount && course.wordCount > wordCount) {
    wordCount = course.wordCount; // use the higher value
  }

  // ─── Check for back-to-back knowledge checks (bad UX) ───
  let backToBackKC = 0;
  for (const section of sections) {
    const blocks = section.contentBlocks || section.blocks || [];
    for (let i = 1; i < blocks.length; i++) {
      const prev = blocks[i-1]?.type;
      const curr = blocks[i]?.type;
      if ((prev === 'multipleChoice' || prev === 'multiSelect') &&
          (curr === 'multipleChoice' || curr === 'multiSelect')) {
        backToBackKC++;
      }
    }
  }

  // ─── SCORING ───
  let score = 100;

  // Structure (25 pts)
  if (sections.length === 0) { score -= 25; issues.push('NO SECTIONS AT ALL'); }
  else if (sections.length === 1) { score -= 15; issues.push('Only 1 section — needs proper sectioning'); }

  // Interactive elements (25 pts)
  if (interactiveBlocks === 0) { score -= 25; issues.push('ZERO interactive blocks — pure text wall'); }
  else if (interactiveBlocks < 3) { score -= 15; issues.push(`Only ${interactiveBlocks} interactive blocks — needs more`); }
  else if (interactiveBlocks < 5) { score -= 5; }

  // Knowledge checks (15 pts) — 3 per section target
  const totalKC = knowledgeChecks + sectionQuizQuestions;
  const expectedKC = sections.length * ACEP.KNOWLEDGE_CHECKS_PER_SECTION;
  if (totalKC === 0) { score -= 15; issues.push('NO knowledge checks anywhere'); }
  else if (totalKC < expectedKC) { score -= 8; issues.push(`Only ${totalKC} knowledge checks (want ~${expectedKC} for ${sections.length} sections)`); }

  // Penalize back-to-back stacking
  if (backToBackKC > 0) { score -= Math.min(5, backToBackKC * 2); issues.push(`${backToBackKC} back-to-back knowledge checks — should be spread through content`); }

  // Final exam (20 pts) — scale by CE hours
  const minExamQ = ceHours <= 1 ? ACEP.MIN_FINAL_EXAM_1CE : ACEP.MIN_FINAL_EXAM_2CE_PLUS;
  if (finalExamQuestions === 0) { score -= 20; issues.push('NO FINAL EXAM'); }
  else if (finalExamQuestions < minExamQ) { 
    score -= 10; issues.push(`Final exam has ${finalExamQuestions} questions (need ${minExamQ}+ for ${ceHours} CE)`); 
  }

  // Word count (15 pts)
  const requiredWords = ceHours * ACEP.WORDS_PER_CE_HOUR;
  if (requiredWords > 0) {
    const wordPct = wordCount / requiredWords;
    if (wordPct < 0.5) { score -= 15; issues.push(`Word count ${wordCount.toLocaleString()} is < 50% of required ${requiredWords.toLocaleString()}`); }
    else if (wordPct < 0.8) { score -= 8; issues.push(`Word count ${wordCount.toLocaleString()} is below required ${requiredWords.toLocaleString()}`); }
    else if (wordPct < 1.0) { score -= 3; issues.push(`Word count ${wordCount.toLocaleString()} slightly below ${requiredWords.toLocaleString()}`); }
  }

  score = Math.max(0, score);

  return {
    title, slug, collection, status, ceHours,
    sectionCount: sections.length,
    totalBlocks, interactiveBlocks, textOnlyBlocks,
    knowledgeChecks, sectionQuizzes, sectionQuizQuestions,
    backToBackKC,
    hasFinalExam, finalExamQuestions,
    wordCount, narratedBlocks,
    blockTypeCounts,
    issues,
    score
  };
}

run().catch(err => { console.error('Fatal:', err); process.exit(1); });
