#!/usr/bin/env node
/**
 * auditSeedCollection.js
 *
 * Read-only audit utility. Connects to MongoDB and compares the
 * legacy `courses` collection against the live `interactivecourses`
 * collection (which is what the course player actually reads).
 *
 * Reports:
 *   - Document counts for both collections
 *   - courseCodes present in `courses` but NOT in `interactivecourses`
 *     (invisible to the player — the real problem)
 *   - courseCodes present in `interactivecourses` but NOT in `courses`
 *
 * No writes are performed.
 *
 * Usage:
 *   node src/scripts/auditSeedCollection.js
 */

import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('❌ MONGODB_URI is not set in the environment.');
  process.exit(2);
}

// Dynamic import pattern — required for Render shell.
const mongoose = (await import('mongoose')).default;

function truncate(str, max = 60) {
  if (!str) return '';
  return str.length > max ? str.slice(0, max - 1) + '…' : str;
}

function printTable(headers, rows) {
  const widths = headers.map((h, i) =>
    Math.max(h.length, ...rows.map((r) => String(r[i] ?? '').length))
  );
  const sep = widths.map((w) => '-'.repeat(w)).join('-+-');
  const fmt = (cells) =>
    cells.map((c, i) => String(c ?? '').padEnd(widths[i])).join(' | ');
  console.log(fmt(headers));
  console.log(sep);
  for (const row of rows) console.log(fmt(row));
}

try {
  console.log('Connecting to MongoDB…');
  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  const coursesCol = db.collection('courses');
  const interactiveCol = db.collection('interactivecourses');

  const [coursesCount, interactiveCount] = await Promise.all([
    coursesCol.countDocuments({}),
    interactiveCol.countDocuments({}),
  ]);

  console.log('');
  console.log('Collection counts');
  console.log('=================');
  printTable(
    ['Collection', 'Document count'],
    [
      ['courses', coursesCount],
      ['interactivecourses', interactiveCount],
    ]
  );

  const [coursesDocs, interactiveDocs] = await Promise.all([
    coursesCol
      .find({}, { projection: { courseCode: 1, title: 1, slug: 1 } })
      .toArray(),
    interactiveCol
      .find({}, { projection: { courseCode: 1, title: 1, slug: 1 } })
      .toArray(),
  ]);

  const codeOf = (doc) => doc.courseCode || doc.slug || String(doc._id);

  const coursesMap = new Map();
  for (const d of coursesDocs) coursesMap.set(codeOf(d), d);
  const interactiveMap = new Map();
  for (const d of interactiveDocs) interactiveMap.set(codeOf(d), d);

  const missingFromInteractive = [];
  for (const [code, d] of coursesMap) {
    if (!interactiveMap.has(code)) missingFromInteractive.push([code, truncate(d.title)]);
  }

  const missingFromCourses = [];
  for (const [code, d] of interactiveMap) {
    if (!coursesMap.has(code)) missingFromCourses.push([code, truncate(d.title)]);
  }

  missingFromInteractive.sort((a, b) => String(a[0]).localeCompare(String(b[0])));
  missingFromCourses.sort((a, b) => String(a[0]).localeCompare(String(b[0])));

  console.log('');
  console.log(`In 'courses' but NOT in 'interactivecourses' (invisible to player): ${missingFromInteractive.length}`);
  console.log('-'.repeat(72));
  if (missingFromInteractive.length === 0) {
    console.log('(none)');
  } else {
    printTable(['courseCode', 'title'], missingFromInteractive);
  }

  console.log('');
  console.log(`In 'interactivecourses' but NOT in 'courses': ${missingFromCourses.length}`);
  console.log('-'.repeat(72));
  if (missingFromCourses.length === 0) {
    console.log('(none)');
  } else {
    printTable(['courseCode', 'title'], missingFromCourses);
  }

  console.log('');
  console.log('Audit complete. No writes performed.');
  await mongoose.disconnect();
  process.exit(0);
} catch (err) {
  console.error('❌ Audit failed:', err.message);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
}
