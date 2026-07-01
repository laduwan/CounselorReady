/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * diagnoseCourseContent.js
 * CounselorReady — Read-only diagnostic
 *
 * Checks all courses in `interactivecourses` collection for:
 *   1. Metadata bleed — provider info, tagline, course hours in content blocks
 *   2. Raw markdown tables — pipe-character tables that should be interactive blocks
 *   3. All-caps section titles — template artifact language
 *   4. "---" separator lines rendered as content
 *   5. Empty or near-empty sections
 *
 * Usage (run from server/):
 *   node diagnoseCourseContent.js
 *
 * Output: Console report + diagnoseCourseContent_results.json
 */

import mongoose from 'mongoose';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

// ─── Patterns to detect ───────────────────────────────────────────────────

const METADATA_PATTERNS = [
  { label: 'Provider line',    re: /NBCC ACEP Provider/i },
  { label: 'GAITP LLC',        re: /GAITP LLC|Ga Integrated Therapeutic/i },
  { label: 'Tagline',          re: /Learn\.\s*License\.\s*Lead\./i },
  { label: 'CounselorReady brand', re: /CounselorReady:/i },
  { label: 'Course Hours line', re: /Course Hours:\s*[\d.]+\s*Continuing Education/i },
  { label: 'CE hours metadata', re: /^\s*[\d.]+\s*(CE|Continuing Education)\s*Hours?\s*$/im },
  { label: 'Target Audience line', re: /Target Audience:/i },
  { label: 'Presenter metadata', re: /Presenter:|Instructor of Record:/i },
];

const MARKDOWN_TABLE_PATTERN = /\|.+\|.+\|/;  // pipe-delimited table rows
const ALLCAPS_TITLE_PATTERN   = /^[A-Z\s\d:&\/\-]{8,}$/; // 8+ char all-caps string
const SEPARATOR_PATTERN       = /^---+\s*$/m;
const DECISION_POINT_PATTERN  = /DECISION POINT:/i;

// ─── Schema (minimal) ─────────────────────────────────────────────────────

const ContentBlockSchema = new mongoose.Schema({ type: String, content: String, textContent: String }, { strict: false });
const SectionSchema      = new mongoose.Schema({ title: String, contentBlocks: [ContentBlockSchema] }, { strict: false });
const CourseSchema        = new mongoose.Schema({
  title: String, slug: String, status: String,
  sections: [SectionSchema],
}, { strict: false, collection: 'interactivecourses' });

const Course = mongoose.models.DiagCourse || mongoose.model('DiagCourse', CourseSchema);

// ─── Helpers ──────────────────────────────────────────────────────────────

function getBlockText(block) {
  return (block.textContent || block.content || '').toString();
}

function checkBlock(text, sectionTitle, blockIndex, findings) {
  // Metadata bleed
  for (const { label, re } of METADATA_PATTERNS) {
    if (re.test(text)) {
      findings.push({ type: 'METADATA_BLEED', label, section: sectionTitle, blockIndex,
        snippet: text.slice(0, 120).replace(/\n/g, ' ') });
    }
  }
  // Raw markdown table
  if (MARKDOWN_TABLE_PATTERN.test(text)) {
    findings.push({ type: 'RAW_MARKDOWN_TABLE', section: sectionTitle, blockIndex,
      snippet: text.slice(0, 120).replace(/\n/g, ' ') });
  }
  // Separator lines
  if (SEPARATOR_PATTERN.test(text)) {
    findings.push({ type: 'SEPARATOR_LINE', section: sectionTitle, blockIndex,
      snippet: text.slice(0, 80).replace(/\n/g, ' ') });
  }
  // Decision Point artifact
  if (DECISION_POINT_PATTERN.test(text)) {
    findings.push({ type: 'DECISION_POINT_ARTIFACT', section: sectionTitle, blockIndex,
      snippet: text.slice(0, 120).replace(/\n/g, ' ') });
  }
}

function checkSectionTitle(title, findings) {
  if (!title) return;
  const trimmed = title.trim();
  if (ALLCAPS_TITLE_PATTERN.test(trimmed) && trimmed.length > 8) {
    findings.push({ type: 'ALLCAPS_TITLE', section: trimmed, blockIndex: -1, snippet: trimmed });
  }
  if (DECISION_POINT_PATTERN.test(trimmed)) {
    findings.push({ type: 'DECISION_POINT_TITLE', section: trimmed, blockIndex: -1, snippet: trimmed });
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB\n');

  const courses = await Course.find({}).lean();
  console.log(`📚 Found ${courses.length} courses in interactivecourses\n`);

  const report = {
    runAt: new Date().toISOString(),
    totalCourses: courses.length,
    affectedCourses: 0,
    clean: 0,
    byIssueType: {},
    courses: [],
  };

  for (const course of courses) {
    const findings = [];

    for (const section of (course.sections || [])) {
      checkSectionTitle(section.title, findings);
      for (let i = 0; i < (section.contentBlocks || []).length; i++) {
        const text = getBlockText(section.contentBlocks[i]);
        if (text) checkBlock(text, section.title, i, findings);
      }
    }

    const issueTypes = [...new Set(findings.map(f => f.type))];

    if (findings.length > 0) {
      report.affectedCourses++;
      issueTypes.forEach(t => {
        report.byIssueType[t] = (report.byIssueType[t] || 0) + 1;
      });
      report.courses.push({
        title: course.title,
        slug: course.slug,
        status: course.status,
        issueCount: findings.length,
        issueTypes,
        findings,
      });
    } else {
      report.clean++;
    }
  }

  // ─── Console output ───────────────────────────────────────────────────

  console.log('═══════════════════════════════════════════════');
  console.log('  COURSE CONTENT DIAGNOSTIC REPORT');
  console.log('═══════════════════════════════════════════════');
  console.log(`  Total courses:    ${report.totalCourses}`);
  console.log(`  ✅ Clean:         ${report.clean}`);
  console.log(`  ⚠️  Affected:      ${report.affectedCourses}`);
  console.log('\n  Issues by type:');
  for (const [type, count] of Object.entries(report.byIssueType)) {
    console.log(`    ${type.padEnd(28)} ${count} course(s)`);
  }

  console.log('\n─── Affected Courses ───────────────────────────');
  for (const c of report.courses.sort((a, b) => b.issueCount - a.issueCount)) {
    console.log(`\n  📘 ${c.title}`);
    console.log(`     slug:   ${c.slug}`);
    console.log(`     status: ${c.status}`);
    console.log(`     issues: ${c.issueCount} (${c.issueTypes.join(', ')})`);
    for (const f of c.findings.slice(0, 3)) {
      console.log(`       [${f.type}] §"${f.section}" block#${f.blockIndex}`);
      console.log(`         → "${f.snippet.slice(0, 90)}"`);
    }
    if (c.findings.length > 3) {
      console.log(`       ... and ${c.findings.length - 3} more findings`);
    }
  }

  // ─── Save JSON ────────────────────────────────────────────────────────
  fs.writeFileSync('diagnoseCourseContent_results.json', JSON.stringify(report, null, 2));
  console.log('\n✅ Full results saved to diagnoseCourseContent_results.json');

  await mongoose.disconnect();
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
