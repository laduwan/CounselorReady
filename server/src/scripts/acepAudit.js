/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('No MONGODB_URI'); process.exit(1); }

// ═══════════════════════════════════════════════════════════════════
// ACEP COMPLIANCE AUDIT — Per-Course Scoring
// Checks every published course against ACEP requirements
// ═══════════════════════════════════════════════════════════════════

async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;

  // Check both collections
  const icCourses = await db.collection('interactivecourses').find({}).toArray();
  const legCourses = await db.collection('courses').find({}).toArray();

  console.log('='.repeat(100));
  console.log('COUNSELORREADY ACEP COMPLIANCE AUDIT');
  console.log(`Date: ${new Date().toISOString().split('T')[0]}`);
  console.log(`Interactive courses: ${icCourses.length} | Legacy courses: ${legCourses.length}`);
  console.log('='.repeat(100) + '\n');

  const allResults = [];

  // ── INTERACTIVE COURSES (sections/contentBlocks) ──
  for (const course of icCourses) {
    const result = auditInteractiveCourse(course);
    allResults.push(result);
  }

  // ── LEGACY COURSES (modules/lessons) ──
  for (const course of legCourses) {
    // Skip if same slug exists in interactive (it's a duplicate)
    if (icCourses.some(ic => ic.slug === course.slug)) continue;
    const result = auditLegacyCourse(course);
    allResults.push(result);
  }

  // Sort by severity (most issues first)
  allResults.sort((a, b) => b.issues.length - a.issues.length);

  // ── DETAILED REPORT ──
  let critical = 0, warning = 0, passed = 0;

  for (const r of allResults) {
    const criticalIssues = r.issues.filter(i => i.severity === 'CRITICAL');
    const warningIssues = r.issues.filter(i => i.severity === 'WARNING');

    if (criticalIssues.length > 0) critical++;
    else if (warningIssues.length > 0) warning++;
    else passed++;

    const statusIcon = criticalIssues.length > 0 ? '🔴' : warningIssues.length > 0 ? '🟡' : '🟢';

    console.log(`${statusIcon} ${r.title}`);
    console.log(`   Slug: ${r.slug} | Collection: ${r.collection} | Status: ${r.status}`);
    console.log(`   CE Hours: ${r.ceHours} | Words: ${r.wordCount} | Required: ${r.requiredWords}`);
    console.log(`   Sections/Modules: ${r.sectionCount} | KCs: ${r.kcCount} | Final Exam Qs: ${r.examQuestionCount}`);
    console.log(`   References: ${r.refCount} | Has resources block: ${r.hasResourcesBlock}`);

    if (r.issues.length > 0) {
      for (const issue of r.issues) {
        const icon = issue.severity === 'CRITICAL' ? '  ❌' : '  ⚠️';
        console.log(`${icon} ${issue.message}`);
      }
    }
    console.log('');
  }

  // ── SUMMARY ──
  console.log('='.repeat(100));
  console.log('SUMMARY');
  console.log('='.repeat(100));
  console.log(`🟢 PASSED: ${passed}`);
  console.log(`🟡 WARNINGS: ${warning}`);
  console.log(`🔴 CRITICAL: ${critical}`);
  console.log(`Total courses audited: ${allResults.length}\n`);

  // ── ISSUE FREQUENCY ──
  const issueCounts = {};
  for (const r of allResults) {
    for (const issue of r.issues) {
      const key = issue.type;
      issueCounts[key] = (issueCounts[key] || 0) + 1;
    }
  }
  console.log('ISSUE FREQUENCY:');
  Object.entries(issueCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([type, count]) => {
      console.log(`  ${count}x  ${type}`);
    });

  // ── PRIORITY FIX ORDER ──
  console.log('\nPRIORITY FIX ORDER (most critical first):');
  const criticalCourses = allResults
    .filter(r => r.issues.some(i => i.severity === 'CRITICAL') && r.status === 'published')
    .sort((a, b) => b.issues.filter(i => i.severity === 'CRITICAL').length - a.issues.filter(i => i.severity === 'CRITICAL').length);
  
  criticalCourses.forEach((r, i) => {
    const critCount = r.issues.filter(i => i.severity === 'CRITICAL').length;
    console.log(`  ${i + 1}. ${r.title} (${critCount} critical issues)`);
    r.issues.filter(i => i.severity === 'CRITICAL').forEach(issue => {
      console.log(`     - ${issue.type}: ${issue.message}`);
    });
  });

  await mongoose.disconnect();
}

function auditInteractiveCourse(course) {
  const result = {
    title: course.title || 'UNTITLED',
    slug: course.slug || 'NO-SLUG',
    collection: 'interactivecourses',
    status: course.status || 'unknown',
    ceHours: course.ceHours || course.creditHours || 0,
    sectionCount: 0,
    kcCount: 0,
    examQuestionCount: 0,
    refCount: 0,
    hasResourcesBlock: false,
    wordCount: 0,
    requiredWords: 0,
    issues: []
  };

  const sections = course.sections || [];
  result.sectionCount = sections.length;
  result.ceHours = result.ceHours || 0;
  result.requiredWords = result.ceHours * 6000;

  // Count words across all text blocks
  let totalWords = 0;
  let embeddedQuizCount = 0;
  let moduleMetadataCount = 0;
  let blocksWithAnswerKeys = 0;
  let sectionsWithNoKC = [];

  for (let si = 0; si < sections.length; si++) {
    const section = sections[si];
    const blocks = section.contentBlocks || [];
    
    let sectionHasKC = false;
    let sectionKCCount = 0;

    for (const block of blocks) {
      // Word count
      if (block.type === 'text') {
        const text = (block.content || block.textContent || '')
          .replace(/<[^>]+>/g, ' ')
          .trim();
        const words = text.split(/\s+/).filter(w => w.length > 0).length;
        totalWords += words;

        // Check for embedded quiz patterns
        if (/Correct Answer:\s*[A-Da-d]/i.test(text) || 
            /^[A-D]\)\s/m.test(text) ||
            /Rationale:/i.test(text)) {
          embeddedQuizCount++;
        }
        // Check for answer keys exposed
        if (/Correct Answer:\s*[A-Da-d]/i.test(text)) {
          blocksWithAnswerKeys++;
        }
        // Check for module metadata in content
        if (/Module Duration:/i.test(text) || /Module Learning Objectives:/i.test(text)) {
          moduleMetadataCount++;
        }
      }

      // Knowledge checks
      if (block.type === 'multipleChoice' || block.type === 'multiSelect' || block.type === 'matching') {
        sectionHasKC = true;
        sectionKCCount++;
      }

      // Resources block
      if (block.type === 'resources') {
        result.hasResourcesBlock = true;
      }
    }

    result.kcCount += sectionKCCount;

    // Skip first section (often intro) and last section (often exam/conclusion)
    if (si > 0 && si < sections.length - 1 && !sectionHasKC) {
      sectionsWithNoKC.push(section.title || `Section ${si + 1}`);
    }
  }

  result.wordCount = totalWords;

  // Check for final exam
  const lastSection = sections[sections.length - 1];
  if (lastSection) {
    const examBlocks = (lastSection.contentBlocks || []).filter(b => 
      b.type === 'multipleChoice' || b.type === 'multiSelect'
    );
    result.examQuestionCount = examBlocks.length;
  }

  // Also check assessment field
  if (course.assessment?.questions?.length) {
    result.examQuestionCount = Math.max(result.examQuestionCount, course.assessment.questions.length);
  }
  if (course.finalExam?.questions?.length) {
    result.examQuestionCount = Math.max(result.examQuestionCount, course.finalExam.questions.length);
  }

  // Check references
  result.refCount = (course.references || []).length;

  // ── ISSUE DETECTION ──
  
  // Word count
  if (result.wordCount < result.requiredWords * 0.5) {
    result.issues.push({ severity: 'CRITICAL', type: 'WORD_COUNT_SEVERE', 
      message: `${result.wordCount} words (need ${result.requiredWords}, at ${Math.round(result.wordCount/result.requiredWords*100)}%)` });
  } else if (result.wordCount < result.requiredWords) {
    result.issues.push({ severity: 'WARNING', type: 'WORD_COUNT_LOW',
      message: `${result.wordCount} words (need ${result.requiredWords}, at ${Math.round(result.wordCount/result.requiredWords*100)}%)` });
  }

  // Knowledge checks
  if (result.kcCount === 0 && result.sectionCount > 1) {
    result.issues.push({ severity: 'CRITICAL', type: 'NO_KNOWLEDGE_CHECKS',
      message: 'Zero interactive knowledge checks found' });
  } else if (sectionsWithNoKC.length > 0) {
    result.issues.push({ severity: 'WARNING', type: 'SECTIONS_MISSING_KC',
      message: `${sectionsWithNoKC.length} content sections without KC: ${sectionsWithNoKC.join(', ')}` });
  }

  // Final exam
  if (result.examQuestionCount === 0) {
    result.issues.push({ severity: 'CRITICAL', type: 'NO_FINAL_EXAM',
      message: 'No final exam questions found' });
  } else if (result.examQuestionCount < 15) {
    result.issues.push({ severity: 'CRITICAL', type: 'EXAM_TOO_SHORT',
      message: `Final exam has ${result.examQuestionCount} questions (need 15+)` });
  }

  // References
  if (result.refCount === 0) {
    result.issues.push({ severity: 'CRITICAL', type: 'NO_REFERENCES',
      message: 'No references found in course document' });
  } else if (result.refCount < 3) {
    result.issues.push({ severity: 'WARNING', type: 'FEW_REFERENCES',
      message: `Only ${result.refCount} references (need 3+)` });
  }

  // Resources block
  if (!result.hasResourcesBlock && result.refCount === 0) {
    result.issues.push({ severity: 'WARNING', type: 'NO_RESOURCES_BLOCK',
      message: 'No resources contentBlock found' });
  }

  // Embedded quizzes in text
  if (embeddedQuizCount > 0) {
    result.issues.push({ severity: 'WARNING', type: 'EMBEDDED_QUIZ_TEXT',
      message: `${embeddedQuizCount} text blocks contain embedded quiz Q&A patterns` });
  }

  // Exposed answer keys
  if (blocksWithAnswerKeys > 0) {
    result.issues.push({ severity: 'CRITICAL', type: 'ANSWER_KEYS_EXPOSED',
      message: `${blocksWithAnswerKeys} text blocks expose answer keys ("Correct Answer: X")` });
  }

  // Module metadata in content
  if (moduleMetadataCount > 0) {
    result.issues.push({ severity: 'WARNING', type: 'MODULE_METADATA_IN_CONTENT',
      message: `${moduleMetadataCount} text blocks contain module metadata (Duration, Learning Objectives)` });
  }

  // Learning objectives
  if (!course.objectives || course.objectives.length < 4) {
    result.issues.push({ severity: 'WARNING', type: 'FEW_OBJECTIVES',
      message: `${(course.objectives || []).length} learning objectives (need 4+)` });
  }

  // CE hours
  if (!result.ceHours || result.ceHours === 0) {
    result.issues.push({ severity: 'CRITICAL', type: 'NO_CE_HOURS',
      message: 'CE hours not set' });
  }

  return result;
}

function auditLegacyCourse(course) {
  const result = {
    title: course.title || 'UNTITLED',
    slug: course.slug || 'NO-SLUG',
    collection: 'courses (legacy)',
    status: course.status || course.isPublished ? 'published' : 'unknown',
    ceHours: course.ceHours || course.creditHours || 0,
    sectionCount: 0,
    kcCount: 0,
    examQuestionCount: 0,
    refCount: 0,
    hasResourcesBlock: false,
    wordCount: 0,
    requiredWords: 0,
    issues: []
  };

  const modules = course.modules || [];
  result.sectionCount = modules.length;
  result.requiredWords = result.ceHours * 6000;

  let totalWords = 0;

  for (const mod of modules) {
    for (const lesson of (mod.lessons || [])) {
      if (lesson.type === 'text') {
        const text = (lesson.content || '').replace(/<[^>]+>/g, ' ').trim();
        totalWords += text.split(/\s+/).filter(w => w.length > 0).length;
      }
      if (lesson.type === 'quiz') {
        if (lesson.isExam) {
          result.examQuestionCount = (lesson.questions || []).length;
        } else {
          result.kcCount += (lesson.questions || []).length;
        }
      }
    }
  }

  result.wordCount = totalWords;
  result.refCount = (course.references || []).length;

  // Also check assessment
  if (course.assessment?.questions?.length) {
    result.examQuestionCount = Math.max(result.examQuestionCount, course.assessment.questions.length);
  }

  // Same issue checks
  if (result.wordCount < result.requiredWords * 0.5) {
    result.issues.push({ severity: 'CRITICAL', type: 'WORD_COUNT_SEVERE',
      message: `${result.wordCount} words (need ${result.requiredWords}, at ${Math.round(result.wordCount/result.requiredWords*100)}%)` });
  } else if (result.wordCount < result.requiredWords) {
    result.issues.push({ severity: 'WARNING', type: 'WORD_COUNT_LOW',
      message: `${result.wordCount} words (need ${result.requiredWords}, at ${Math.round(result.wordCount/result.requiredWords*100)}%)` });
  }

  if (result.kcCount === 0 && result.sectionCount > 1) {
    result.issues.push({ severity: 'CRITICAL', type: 'NO_KNOWLEDGE_CHECKS',
      message: 'Zero knowledge check questions found' });
  }

  if (result.examQuestionCount === 0) {
    result.issues.push({ severity: 'CRITICAL', type: 'NO_FINAL_EXAM',
      message: 'No final exam questions found' });
  } else if (result.examQuestionCount < 15) {
    result.issues.push({ severity: 'CRITICAL', type: 'EXAM_TOO_SHORT',
      message: `Final exam has ${result.examQuestionCount} questions (need 15+)` });
  }

  if (result.refCount === 0) {
    result.issues.push({ severity: 'CRITICAL', type: 'NO_REFERENCES',
      message: 'No references found' });
  }

  if (!result.ceHours || result.ceHours === 0) {
    result.issues.push({ severity: 'CRITICAL', type: 'NO_CE_HOURS',
      message: 'CE hours not set' });
  }

  return result;
}

main().catch(err => { console.error(err); process.exit(1); });
