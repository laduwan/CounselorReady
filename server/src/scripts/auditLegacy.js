#!/usr/bin/env node
/**
 * auditLegacy.js — READ ONLY. Writes nothing.
 * CounselorReady · GAITP LLC
 * ─────────────────────────────────────────────────────────────────────────
 * Answers: "Are any courses still in legacy form?" — in both senses:
 *   (1) Records that exist only in the old `courses` collection (no twin in
 *       `interactivecourses`) — i.e. fully legacy courses.
 *   (2) `interactivecourses` docs still carrying leftover `modules[]` data
 *       alongside `sections[]` — i.e. partial legacy residue.
 *
 * Run from the Render shell (~/project/src/server):
 *   node src/scripts/auditLegacy.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.MONGODB_URI) { console.error('❌  MONGODB_URI not set'); process.exit(1); }
await mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection.db;

const legacy = await db.collection('courses').find(
  {}, { projection: { slug: 1, title: 1, status: 1, isPublished: 1 } }
).toArray();
const inter = await db.collection('interactivecourses').find(
  {}, { projection: { slug: 1, modules: 1, sections: 1 } }
).toArray();

const interSlugs = new Set(inter.map(c => c.slug));
const legacyOnly = legacy.filter(c => !interSlugs.has(c.slug));   // fully legacy
const legacyTwin = legacy.filter(c =>  interSlugs.has(c.slug));   // stale duplicate of a real course
const residueModules = inter.filter(c => Array.isArray(c.modules) && c.modules.length > 0);
const emptySections  = inter.filter(c => !Array.isArray(c.sections) || c.sections.length === 0);

const line = '─'.repeat(74);
console.log('\n' + '═'.repeat(74));
console.log('  LEGACY AUDIT (read-only)');
console.log('═'.repeat(74));
console.log(`  interactivecourses (canonical): ${inter.length}`);
console.log(`  courses (legacy collection):    ${legacy.length}`);
console.log(line);

console.log(`\n  (1) FULLY LEGACY — exist only in old 'courses', no canonical twin: ${legacyOnly.length}`);
legacyOnly.forEach(c => console.log(
  `      • ${(c.slug || '(no slug)').padEnd(55).slice(0,55)} [${c.isPublished ? 'published' : 'draft'}]  ${c.title || ''}`.slice(0, 120)
));

console.log(`\n  (·) Legacy duplicates — old 'courses' copy of a course that ALSO exists canonically: ${legacyTwin.length}`);
legacyTwin.forEach(c => console.log(`      • ${c.slug}`));

console.log(`\n  (2) PARTIAL LEGACY — canonical docs still carrying leftover modules[]: ${residueModules.length}`);
residueModules.forEach(c => console.log(`      • ${c.slug}  (modules: ${c.modules.length}, sections: ${(c.sections||[]).length})`));

console.log(`\n  (!) Canonical docs with EMPTY sections[] (would render blank): ${emptySections.length}`);
emptySections.forEach(c => console.log(`      • ${c.slug}`));

console.log('\n' + line);
const allClear = legacyOnly.length === 0 && residueModules.length === 0 && legacyTwin.length === 0;
console.log(allClear
  ? '  ✅ Legacy is clear — every course is canonical, no modules[] residue.'
  : '  ⚠️  Legacy is NOT fully retired — see sections above.');
console.log('═'.repeat(74) + '\n');

await mongoose.disconnect();
