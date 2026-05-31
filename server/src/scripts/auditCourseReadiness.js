/**
 * auditCourseReadiness.js
 *
 * Read-only audit of all interactivecourses documents.
 * Reports CE-hour readiness, assessment completeness, and publish status.
 *
 * Usage:
 *   node server/src/scripts/auditCourseReadiness.js
 *
 * Requires MONGODB_URI in environment (or .env at repo root).
 */

import 'dotenv/config';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URI is not set.');
  process.exit(1);
}

// Minimal projection — only fields we need
const PROJECTION = {
  courseCode: 1,
  title: 1,
  status: 1,
  ceHours: 1,
  wordCount: 1,
  sections: 1,
  assessment: 1,
};

function truncate(str, len) {
  if (!str) return '(no title)';
  return str.length <= len ? str : str.slice(0, len - 1) + '…';
}

function classify(wordCount, target, status, questionCount) {
  const pct = target > 0 ? wordCount / target : 0;
  if (pct >= 1 && status === 'published' && questionCount >= 15) return 'PASS';
  if (pct >= 0.9) return 'WARN';
  if (pct < 0.9) return 'FAIL';
  return 'WARN';
}

async function main() {
  await mongoose.connect(MONGODB_URI);

  const db = mongoose.connection.db;
  const courses = await db
    .collection('interactivecourses')
    .find({}, { projection: PROJECTION })
    .toArray();

  // Build rows
  const rows = courses.map((c) => {
    const ceHours = Number(c.ceHours) || 0;
    const wordCount = Number(c.wordCount) || 0;
    const target = ceHours * 6000;
    const percentage = target > 0 ? Math.round((wordCount / target) * 100) : 0;
    const sectionCount = Array.isArray(c.sections) ? c.sections.length : 0;
    const questionCount =
      c.assessment && Array.isArray(c.assessment.questions)
        ? c.assessment.questions.length
        : 0;
    const indicator = classify(wordCount, target, c.status, questionCount);

    return {
      courseCode: c.courseCode || '(none)',
      title: truncate(c.title, 50),
      status: c.status || 'unknown',
      ceHours,
      wordCount,
      target,
      percentage,
      sectionCount,
      questionCount,
      indicator,
    };
  });

  // Sort ascending by percentage (worst first)
  rows.sort((a, b) => a.percentage - b.percentage);

  // ── Header ───────────────────────────────────────────────────────────────
  const COL = {
    code: 14,
    title: 52,
    status: 11,
    ce: 5,
    wc: 9,
    tgt: 9,
    pct: 7,
    sec: 5,
    q: 5,
    ind: 6,
  };

  const header = [
    'COURSE CODE'.padEnd(COL.code),
    'TITLE'.padEnd(COL.title),
    'STATUS'.padEnd(COL.status),
    'CE'.padStart(COL.ce),
    'WORDS'.padStart(COL.wc),
    'TARGET'.padStart(COL.tgt),
    'PCT%'.padStart(COL.pct),
    'SECS'.padStart(COL.sec),
    'QS'.padStart(COL.q),
    'RESULT'.padEnd(COL.ind),
  ].join('  ');

  const divider = '─'.repeat(header.length);

  console.log('\n' + divider);
  console.log(header);
  console.log(divider);

  for (const r of rows) {
    const line = [
      r.courseCode.padEnd(COL.code),
      r.title.padEnd(COL.title),
      r.status.padEnd(COL.status),
      String(r.ceHours).padStart(COL.ce),
      String(r.wordCount).padStart(COL.wc),
      String(r.target).padStart(COL.tgt),
      (String(r.percentage) + '%').padStart(COL.pct),
      String(r.sectionCount).padStart(COL.sec),
      String(r.questionCount).padStart(COL.q),
      r.indicator.padEnd(COL.ind),
    ].join('  ');
    console.log(line);
  }

  console.log(divider);

  // ── Summary ──────────────────────────────────────────────────────────────
  const total = rows.length;
  const byStatus = { published: 0, draft: 0, archived: 0, other: 0 };
  const byResult = { PASS: 0, WARN: 0, FAIL: 0 };
  const failList = [];

  for (const r of rows) {
    const s = ['published', 'draft', 'archived'].includes(r.status)
      ? r.status
      : 'other';
    byStatus[s]++;
    byResult[r.indicator]++;
    if (r.indicator === 'FAIL') {
      failList.push({ code: r.courseCode, pct: r.percentage });
    }
  }

  console.log('\nSUMMARY');
  console.log('─'.repeat(40));
  console.log(`Total courses  : ${total}`);
  console.log(`  Published    : ${byStatus.published}`);
  console.log(`  Draft        : ${byStatus.draft}`);
  console.log(`  Archived     : ${byStatus.archived}`);
  if (byStatus.other > 0) console.log(`  Other        : ${byStatus.other}`);
  console.log('');
  console.log(`  PASS         : ${byResult.PASS}`);
  console.log(`  WARN         : ${byResult.WARN}`);
  console.log(`  FAIL         : ${byResult.FAIL}`);

  if (failList.length > 0) {
    console.log('\nFAILING COURSES (< 90% word-count target):');
    for (const f of failList) {
      console.log(`  ${f.code.padEnd(16)} ${f.pct}%`);
    }
  }

  console.log('─'.repeat(40) + '\n');

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
