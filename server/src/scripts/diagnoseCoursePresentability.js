/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('❌ No MONGODB_URI set'); process.exit(1); }

// ═══════════════════════════════════════════════════════════════════
// DIAGNOSE COURSE PRESENTABILITY
// Read-only audit of all courses in interactivecourses collection.
// Checks for:
//   1. Unanswerable knowledge checks (all answers default to index 0)
//   2. Knowledge checks with bad format ({text, isCorrect} vs string[])
//   3. Embedded quiz text in text blocks (not extracted)
//   4. Destroyed tables (placeholders like [TABLE] or empty <table>)
//   5. Embedded metadata in content blocks
//   6. Empty/missing content blocks
//   7. Word count vs ACEP minimum
//   8. Missing assessment / final exam
//   9. Inconsistent section structure
//  10. Overview text duplicated in Section 1
//
// Usage:
//   node src/scripts/diagnoseCoursePresentability.js
//   node src/scripts/diagnoseCoursePresentability.js --slug=walking-on-eggshells
//   node src/scripts/diagnoseCoursePresentability.js --unpresentable-only
//
// Does NOT modify any data. Safe to run anytime.
// ═══════════════════════════════════════════════════════════════════

const SLUG_FILTER = process.argv.find(a => a.startsWith('--slug='))?.split('=')[1];
const UNPRESENTABLE_ONLY = process.argv.includes('--unpresentable-only');

const InteractiveCourseSchema = new mongoose.Schema({}, { strict: false, collection: 'interactivecourses' });
const InteractiveCourse = mongoose.model('InteractiveCourse', InteractiveCourseSchema);

// ── Helpers ──

function countWords(html) {
  if (!html) return 0;
  return html.replace(/<[^>]*>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim().split(/\s+/).filter(w => w.length > 0).length;
}

function isAllAnswerA(block) {
  // Check if correctAnswer is always 0 (default / never set)
  if (block.correctAnswer !== undefined) return block.correctAnswer === 0;
  // Check options array for {text, isCorrect} format
  if (block.options && Array.isArray(block.options)) {
    const correctIndices = block.options.map((o, i) => (o.isCorrect ? i : -1)).filter(i => i >= 0);
    if (correctIndices.length === 0) return true; // no correct answer set
    if (correctIndices.length === 1 && correctIndices[0] === 0) return true; // only first is correct
  }
  return false;
}

function hasEmbeddedQuizText(content) {
  if (!content) return false;
  const patterns = [
    /(?:Question|Q)\s*\d+[.:]/i,
    /(?:^|\n)\s*[A-D]\)\s/m,
    /(?:^|\n)\s*[a-d]\.\s/m,
    /Correct Answer:\s*[A-D]/i,
    /\*\*Knowledge Check\*\*/i,
    /\*\*Quiz\*\*/i,
    /\*\*Post-?Test\*\*/i,
  ];
  let matches = 0;
  for (const p of patterns) {
    if (p.test(content)) matches++;
  }
  return matches >= 2; // need at least 2 quiz-like patterns
}

function hasDestroyedTable(content) {
  if (!content) return false;
  return /\[TABLE\]/i.test(content) ||
    /\[table placeholder\]/i.test(content) ||
    /<table[^>]*>\s*<\/table>/i.test(content) ||
    /\|\s*---\s*\|/.test(content); // raw markdown pipe tables not converted
}

function hasEmbeddedMetadata(content) {
  if (!content) return false;
  const patterns = [
    /GAITP LLC/i,
    /GA Integrated Therapeutic/i,
    /ACEP Provider/i,
    /NBCC Approved/i,
    /Provider #7760/i,
    /Learn\.\s*License\.\s*Lead/i,
    /Course Hours:\s*\d/i,
    /Estimated Time:\s*\d/i,
    /DECISION POINT:/i,
  ];
  return patterns.some(p => p.test(content));
}

function hasOverviewDuplication(content, courseTitle) {
  if (!content) return false;
  const patterns = [
    /Course (?:Information|Overview|Details)/i,
    /Course Level:/i,
    /Upon successful completion of this course/i,
    /Target Audience/i,
    /Learning Objectives?/i,
  ];
  let matches = 0;
  for (const p of patterns) if (p.test(content)) matches++;
  // Also check if course title appears as a heading in content
  if (courseTitle && content.includes(courseTitle)) matches++;
  return matches >= 2;
}

// ── Main Audit ──

async function audit() {
  await mongoose.connect(MONGODB_URI);
  console.log('═══════════════════════════════════════════════════════');
  console.log('  COUNSELORREADY COURSE PRESENTABILITY AUDIT');
  console.log('═══════════════════════════════════════════════════════\n');

  const query = SLUG_FILTER ? { slug: { $regex: SLUG_FILTER, $options: 'i' } } : {};
  const courses = await InteractiveCourse.find(query).lean();
  console.log(`Found ${courses.length} courses\n`);

  const results = [];

  for (const course of courses) {
    const issues = [];
    const sections = course.sections || [];
    let totalWords = 0;
    let totalKCs = 0;
    let unanswerableKCs = 0;
    let badFormatKCs = 0;
    let embeddedQuizBlocks = 0;
    let destroyedTables = 0;
    let metadataBlocks = 0;
    let emptyBlocks = 0;
    let overviewDupes = 0;

    sections.forEach((section, sIdx) => {
      const blocks = section.contentBlocks || [];

      blocks.forEach((block, bIdx) => {
        const loc = `S${sIdx + 1}/B${bIdx + 1}`;

        // Text blocks
        if (block.type === 'text') {
          const content = block.content || block.textContent || '';
          const words = countWords(content);
          totalWords += words;

          if (words === 0) {
            emptyBlocks++;
            issues.push({ severity: 'HIGH', loc, issue: 'Empty text block (0 words)' });
          }

          if (hasEmbeddedQuizText(content)) {
            embeddedQuizBlocks++;
            issues.push({ severity: 'HIGH', loc, issue: `Embedded quiz text in text block (${words}w) — not interactive` });
          }

          if (hasDestroyedTable(content)) {
            destroyedTables++;
            issues.push({ severity: 'HIGH', loc, issue: 'Destroyed/placeholder table' });
          }

          if (hasEmbeddedMetadata(content)) {
            metadataBlocks++;
            issues.push({ severity: 'MED', loc, issue: 'Embedded ACEP/GAITP metadata in content' });
          }

          if (sIdx === 0 && hasOverviewDuplication(content, course.title)) {
            overviewDupes++;
            issues.push({ severity: 'MED', loc, issue: 'Overview/metadata duplicated in Section 1' });
          }
        }

        // Knowledge checks (multipleChoice, multiSelect)
        if (block.type === 'multipleChoice' || block.type === 'multiSelect') {
          totalKCs++;

          // Check for options
          if (!block.options || block.options.length === 0) {
            unanswerableKCs++;
            issues.push({ severity: 'HIGH', loc, issue: `KC has no options: "${(block.question || '').substring(0, 60)}..."` });
            return;
          }

          // Check answer format — {text, isCorrect} object format
          if (block.options[0] && typeof block.options[0] === 'object' && block.options[0].text !== undefined) {
            // Object format — check if any isCorrect is set
            const hasCorrect = block.options.some(o => o.isCorrect === true);
            if (!hasCorrect) {
              unanswerableKCs++;
              issues.push({ severity: 'HIGH', loc, issue: `KC has NO correct answer flagged: "${(block.question || '').substring(0, 60)}..."` });
            } else if (isAllAnswerA(block)) {
              // Only first option marked correct — suspicious
              unanswerableKCs++;
              issues.push({ severity: 'HIGH', loc, issue: `KC answer defaults to A (suspicious): "${(block.question || '').substring(0, 60)}..."` });
            }
          }

          // Check string array format with correctAnswer index
          if (block.options[0] && typeof block.options[0] === 'string') {
            if (block.correctAnswer === undefined || block.correctAnswer === null) {
              unanswerableKCs++;
              issues.push({ severity: 'HIGH', loc, issue: `KC has no correctAnswer index: "${(block.question || '').substring(0, 60)}..."` });
            } else if (block.correctAnswer === 0) {
              // Index 0 = answer A — might be default
              unanswerableKCs++;
              issues.push({ severity: 'WARN', loc, issue: `KC correctAnswer=0 (may be default A): "${(block.question || '').substring(0, 60)}..."` });
            }
          }

          // Check for empty question text
          if (!block.question || block.question.trim().length < 10) {
            issues.push({ severity: 'HIGH', loc, issue: `KC has empty/short question text: "${block.question || ''}"` });
          }
        }

        // Count words in other block types
        if (block.type === 'accordion') {
          (block.accordionItems || []).forEach(item => {
            totalWords += countWords(item.content);
          });
        }
        if (block.type === 'imageText') {
          totalWords += countWords(block.content);
        }
      });
    });

    // ── Course-level checks ──

    // ACEP word count
    const ceHours = course.ceHours || 1;
    const requiredWords = ceHours * 6000;
    const wordPct = Math.round((totalWords / requiredWords) * 100);
    if (totalWords < requiredWords) {
      issues.push({ severity: totalWords < requiredWords * 0.7 ? 'HIGH' : 'MED', loc: 'COURSE', issue: `Under ACEP word minimum: ${totalWords.toLocaleString()}/${requiredWords.toLocaleString()} (${wordPct}%)` });
    }

    // Assessment / Final Exam
    const assessment = course.assessment;
    if (!assessment || !assessment.questions || assessment.questions.length === 0) {
      issues.push({ severity: 'HIGH', loc: 'COURSE', issue: 'No final exam / assessment questions' });
    } else if (assessment.questions.length < 15) {
      issues.push({ severity: 'MED', loc: 'COURSE', issue: `Final exam has only ${assessment.questions.length}/15 required questions` });
    }

    // Missing objectives
    const objectives = course.objectives || course.learningObjectives || [];
    if (objectives.length < 4) {
      issues.push({ severity: 'MED', loc: 'COURSE', issue: `Only ${objectives.length}/4 required learning objectives` });
    }

    // Section count
    if (sections.length < 2) {
      issues.push({ severity: 'HIGH', loc: 'COURSE', issue: `Only ${sections.length} section(s) — expected multiple` });
    }

    // ── Scoring ──
    const highCount = issues.filter(i => i.severity === 'HIGH').length;
    const medCount = issues.filter(i => i.severity === 'MED').length;
    const warnCount = issues.filter(i => i.severity === 'WARN').length;

    let verdict = '✅ PRESENTABLE';
    if (highCount >= 3) verdict = '🔴 SCRAP & RE-SEED';
    else if (highCount >= 1) verdict = '🟡 NEEDS FIXES';
    else if (medCount >= 3) verdict = '🟡 NEEDS FIXES';

    const result = {
      title: course.title,
      slug: course.slug,
      status: course.status,
      ceHours,
      totalWords,
      wordPct,
      sections: sections.length,
      totalKCs,
      unanswerableKCs,
      embeddedQuizBlocks,
      destroyedTables,
      metadataBlocks,
      highCount,
      medCount,
      warnCount,
      verdict,
      issues,
    };
    results.push(result);
  }

  // ── Sort by severity ──
  results.sort((a, b) => b.highCount - a.highCount || b.medCount - a.medCount);

  // ── Summary Table ──
  console.log('┌─────────────────────────────────────────────────┬────────┬────────┬─────┬───────┬──────────────────┐');
  console.log('│ Course                                          │ Status │ Words  │ KCs │ Bad   │ Verdict          │');
  console.log('├─────────────────────────────────────────────────┼────────┼────────┼─────┼───────┼──────────────────┤');

  for (const r of results) {
    if (UNPRESENTABLE_ONLY && r.verdict === '✅ PRESENTABLE') continue;
    const title = r.title.length > 47 ? r.title.substring(0, 44) + '...' : r.title;
    const status = (r.status || 'draft').substring(0, 6).padEnd(6);
    const words = `${Math.round(r.totalWords / 1000)}k/${r.ceHours * 6}k`.padStart(6);
    const kcs = String(r.totalKCs).padStart(3);
    const bad = String(r.unanswerableKCs).padStart(3);
    console.log(`│ ${title.padEnd(47)} │ ${status} │ ${words} │ ${kcs} │  ${bad}  │ ${r.verdict.padEnd(16)} │`);
  }
  console.log('└─────────────────────────────────────────────────┴────────┴────────┴─────┴───────┴──────────────────┘');

  // ── Totals ──
  const scrapCount = results.filter(r => r.verdict === '🔴 SCRAP & RE-SEED').length;
  const fixCount = results.filter(r => r.verdict === '🟡 NEEDS FIXES').length;
  const okCount = results.filter(r => r.verdict === '✅ PRESENTABLE').length;
  const totalBadKCs = results.reduce((sum, r) => sum + r.unanswerableKCs, 0);
  const totalEmbedded = results.reduce((sum, r) => sum + r.embeddedQuizBlocks, 0);

  console.log(`\n═══ SUMMARY ═══`);
  console.log(`Total courses: ${results.length}`);
  console.log(`  🔴 Scrap & Re-seed: ${scrapCount}`);
  console.log(`  🟡 Needs Fixes: ${fixCount}`);
  console.log(`  ✅ Presentable: ${okCount}`);
  console.log(`  Unanswerable KCs: ${totalBadKCs}`);
  console.log(`  Embedded quiz text blocks: ${totalEmbedded}`);

  // ── Detailed Issues (for non-presentable) ──
  console.log('\n\n═══════════════════════════════════════════════════════');
  console.log('  DETAILED ISSUES BY COURSE');
  console.log('═══════════════════════════════════════════════════════\n');

  for (const r of results) {
    if (r.verdict === '✅ PRESENTABLE' && !SLUG_FILTER) continue;

    console.log(`\n${'─'.repeat(60)}`);
    console.log(`${r.verdict}  ${r.title}`);
    console.log(`  Slug: ${r.slug}`);
    console.log(`  Status: ${r.status} | ${r.ceHours} CE hrs | ${r.totalWords.toLocaleString()} words (${r.wordPct}%) | ${r.sections} sections`);
    console.log(`  KCs: ${r.totalKCs} total, ${r.unanswerableKCs} unanswerable`);
    if (r.embeddedQuizBlocks) console.log(`  ⚠ ${r.embeddedQuizBlocks} text blocks with embedded quiz text`);
    if (r.destroyedTables) console.log(`  ⚠ ${r.destroyedTables} destroyed/placeholder tables`);
    if (r.metadataBlocks) console.log(`  ⚠ ${r.metadataBlocks} blocks with embedded metadata`);

    if (r.issues.length > 0) {
      console.log(`\n  Issues (${r.issues.length}):`);
      // Group by severity
      for (const sev of ['HIGH', 'MED', 'WARN']) {
        const sevIssues = r.issues.filter(i => i.severity === sev);
        if (sevIssues.length === 0) continue;
        for (const issue of sevIssues) {
          const icon = sev === 'HIGH' ? '🔴' : sev === 'MED' ? '🟡' : '⚪';
          console.log(`    ${icon} [${issue.loc}] ${issue.issue}`);
        }
      }
    }
  }

  // ── Scrap List (copy-pasteable) ──
  const scrapList = results.filter(r => r.verdict === '🔴 SCRAP & RE-SEED');
  if (scrapList.length > 0) {
    console.log('\n\n═══ SCRAP & RE-SEED LIST ═══');
    console.log('These courses have 3+ HIGH severity issues and should be re-seeded from source:\n');
    scrapList.forEach(r => {
      console.log(`  • ${r.title} (${r.slug})`);
      console.log(`    ${r.highCount} HIGH, ${r.medCount} MED issues | ${r.unanswerableKCs} bad KCs | ${r.totalWords.toLocaleString()} words`);
    });
  }

  await mongoose.disconnect();
  console.log('\n\n✅ Audit complete. No data was modified.');
}

audit().catch(err => { console.error('Fatal:', err); process.exit(1); });
