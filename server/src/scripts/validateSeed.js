#!/usr/bin/env node
/**
 * validateSeed.js
 *
 * Pre-run static validator for CounselorReady seed scripts.
 * Reads the target file as text and checks for known failure patterns
 * BEFORE anything touches the database.
 *
 * Usage:
 *   node src/scripts/validateSeed.js src/scripts/mySeedFile.js
 *
 * Exit codes:
 *   0  — all checks passed (or warnings only)
 *   1  — at least one critical check failed
 *   2  — usage / IO error
 */

import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);

if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
  console.log('Usage: node src/scripts/validateSeed.js <path-to-seed-script.js>');
  console.log('');
  console.log('Runs ten static checks against a seed script to catch known');
  console.log('failure patterns (wrong model, bypassed hooks, malformed options,');
  console.log('missing answers, short exams, legacy fields, etc.) before the');
  console.log('script is executed against the database.');
  process.exit(args.length === 0 ? 2 : 0);
}

const targetPath = path.resolve(process.cwd(), args[0]);

if (!fs.existsSync(targetPath)) {
  console.error(`❌ File not found: ${targetPath}`);
  process.exit(2);
}

let src;
try {
  src = fs.readFileSync(targetPath, 'utf8');
} catch (err) {
  console.error(`❌ Could not read ${targetPath}: ${err.message}`);
  process.exit(2);
}

const results = [];

function record(status, id, title, message) {
  results.push({ status, id, title, message });
}

function pass(id, title) {
  record('PASS', id, title, '');
}

function fail(id, title, message) {
  record('FAIL', id, title, message);
}

function warn(id, title, message) {
  record('WARN', id, title, message);
}

// --------------------------------------------------------------------------
// Helper: find the balanced closing brace for the object that encloses idx.
// Returns [start, end] indices of the enclosing `{ ... }` block, or null.
// --------------------------------------------------------------------------
function enclosingObject(text, idx) {
  let depth = 0;
  let start = -1;
  for (let i = idx; i >= 0; i--) {
    const ch = text[i];
    if (ch === '}') depth++;
    else if (ch === '{') {
      if (depth === 0) { start = i; break; }
      depth--;
    }
  }
  if (start === -1) return null;
  depth = 0;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return [start, i];
    }
  }
  return null;
}

// --------------------------------------------------------------------------
// Helper: find the balanced region following a key declaration.
// Given a regex that matches `keyname:` returns all balanced blocks / arrays
// that follow each occurrence. openChar can be '{' or '['.
// --------------------------------------------------------------------------
function balancedRegionAfter(text, startIdx, openChar) {
  const closeChar = openChar === '{' ? '}' : ']';
  let i = startIdx;
  while (i < text.length && text[i] !== openChar) i++;
  if (i >= text.length) return null;
  const start = i;
  let depth = 0;
  for (; i < text.length; i++) {
    const ch = text[i];
    if (ch === openChar) depth++;
    else if (ch === closeChar) {
      depth--;
      if (depth === 0) return [start, i];
    }
  }
  return null;
}

// --------------------------------------------------------------------------
// CHECK 1 — Wrong model (CRITICAL)
// --------------------------------------------------------------------------
{
  const re = /\bnew\s+Course\s*\(|\bCourse\.create\s*\(|\bCourse\.insertMany\s*\(/;
  if (re.test(src)) {
    fail(
      1,
      'Wrong model',
      "Uses Course model → writes to 'courses' collection. Player reads 'interactivecourses'. Use InteractiveCourse model."
    );
  } else {
    pass(1, 'Wrong model');
  }
}

// --------------------------------------------------------------------------
// CHECK 2 — Raw insertOne bypass (CRITICAL)
// --------------------------------------------------------------------------
{
  const re = /collection\.insertOne|db\.collection|insertOne\s*\(/;
  if (re.test(src)) {
    fail(
      2,
      'Raw insertOne bypass',
      'Raw insertOne bypasses Mongoose pre-save hooks. wordCount and totalContentBlocks will not be set. Use .save() instead.'
    );
  } else {
    pass(2, 'Raw insertOne bypass');
  }
}

// --------------------------------------------------------------------------
// CHECK 3 — Wrong options format (CRITICAL)
// --------------------------------------------------------------------------
{
  // Look only within `options: [ ... ]` blocks so we don't flag unrelated hits.
  const optionsRe = /options\s*:\s*\[/g;
  let found = false;
  let m;
  while ((m = optionsRe.exec(src)) !== null) {
    const region = balancedRegionAfter(src, m.index + m[0].length - 1, '[');
    if (!region) continue;
    const slice = src.slice(region[0], region[1] + 1);
    if (/isCorrect\s*:/.test(slice) || /\{\s*text\s*:/.test(slice)) {
      found = true;
      break;
    }
  }
  if (found) {
    fail(
      3,
      'Wrong options format',
      'Options use {text, isCorrect} format. Schema requires [String] array + correctAnswer: Number (0-based index).'
    );
  } else {
    pass(3, 'Wrong options format');
  }
}

// --------------------------------------------------------------------------
// CHECK 4 — Missing correctAnswer (CRITICAL)
// Find every object that declares type: "multiple_choice" or "knowledge_check"
// and verify a correctAnswer field exists within the same object.
// --------------------------------------------------------------------------
{
  const typeRe = /type\s*:\s*["'](multiple_choice|knowledge_check)["']/g;
  let missing = 0;
  let m;
  while ((m = typeRe.exec(src)) !== null) {
    const obj = enclosingObject(src, m.index);
    if (!obj) continue;
    const slice = src.slice(obj[0], obj[1] + 1);
    if (!/correctAnswer\s*:/.test(slice)) missing++;
  }
  if (missing > 0) {
    fail(
      4,
      'Missing correctAnswer',
      `KC/exam question missing correctAnswer field. (${missing} question${missing === 1 ? '' : 's'} affected)`
    );
  } else {
    pass(4, 'Missing correctAnswer');
  }
}

// --------------------------------------------------------------------------
// CHECK 5 — Assessment question count (CRITICAL)
// --------------------------------------------------------------------------
{
  const asmtKey = /assessment\s*:\s*[\{\[]/.exec(src);
  if (!asmtKey) {
    warn(5, 'Assessment question count', 'No assessment block found — cannot verify question count.');
  } else {
    const openIdx = asmtKey.index + asmtKey[0].length - 1;
    const openChar = src[openIdx];
    const region = balancedRegionAfter(src, openIdx, openChar);
    if (!region) {
      warn(5, 'Assessment question count', 'Assessment block found but could not parse — check syntax.');
    } else {
      const slice = src.slice(region[0], region[1] + 1);
      const count = (slice.match(/question\s*:/g) || []).length;
      if (count < 15) {
        fail(
          5,
          'Assessment question count',
          `Final exam has ${count} question${count === 1 ? '' : 's'} — fewer than 15 questions. NBCC requires minimum 15.`
        );
      } else {
        pass(5, 'Assessment question count');
      }
    }
  }
}

// --------------------------------------------------------------------------
// CHECK 6 — Missing sectionDivider title (WARNING)
// --------------------------------------------------------------------------
{
  const divRe = /type\s*:\s*["']sectionDivider["']/g;
  let missing = 0;
  let m;
  while ((m = divRe.exec(src)) !== null) {
    const obj = enclosingObject(src, m.index);
    if (!obj) continue;
    const slice = src.slice(obj[0], obj[1] + 1);
    if (!/title\s*:/.test(slice)) missing++;
  }
  if (missing > 0) {
    warn(6, 'sectionDivider title', `sectionDivider missing title field. (${missing} divider${missing === 1 ? '' : 's'} affected)`);
  } else {
    pass(6, 'sectionDivider title');
  }
}

// --------------------------------------------------------------------------
// CHECK 7 — References minimum (WARNING)
// --------------------------------------------------------------------------
{
  const refRe = /references\s*:\s*\[/g;
  let total = 0;
  let foundAny = false;
  let m;
  while ((m = refRe.exec(src)) !== null) {
    const region = balancedRegionAfter(src, m.index + m[0].length - 1, '[');
    if (!region) continue;
    foundAny = true;
    const slice = src.slice(region[0], region[1] + 1);
    total += (slice.match(/title\s*:/g) || []).length;
  }
  if (!foundAny) {
    warn(7, 'References minimum', 'No references array found.');
  } else if (total < 15) {
    warn(7, 'References minimum', `Only ${total} reference${total === 1 ? '' : 's'} found. NBCC recommends 15+.`);
  } else {
    pass(7, 'References minimum');
  }
}

// --------------------------------------------------------------------------
// CHECK 8 — Wrong accessType value (CRITICAL)
// --------------------------------------------------------------------------
{
  const re = /accessType\s*:\s*["']paid["']/;
  if (re.test(src)) {
    fail(
      8,
      'accessType value',
      "accessType 'paid' is invalid. Use 'purchase' | 'subscription' | 'free'."
    );
  } else {
    pass(8, 'accessType value');
  }
}

// --------------------------------------------------------------------------
// CHECK 9 — Deprecated hex colors (WARNING)
// --------------------------------------------------------------------------
{
  const deprecated = ['#34495E', '#40634A', '#4B5D4B', '#7D4E57', '#FAFAF9', '#F8F7F4'];
  const hits = [];
  for (const hex of deprecated) {
    const re = new RegExp(hex, 'i');
    if (re.test(src)) hits.push(hex);
  }
  if (hits.length > 0) {
    warn(9, 'Deprecated hex colors', `Deprecated hex color found: ${hits.join(', ')}. See Color_Spec_v1.docx.`);
  } else {
    pass(9, 'Deprecated hex colors');
  }
}

// --------------------------------------------------------------------------
// CHECK 10 — modules[] instead of sections[] (CRITICAL)
// Only flag `modules:` that looks like a top-level course field (an array
// literal), not arbitrary uses of the word "modules".
// --------------------------------------------------------------------------
{
  const re = /(^|[\{\,\n\s])modules\s*:\s*\[/;
  if (re.test(src)) {
    fail(
      10,
      'modules[] vs sections[]',
      'Uses modules[] structure. Schema requires sections[]. Run migrateModulesToSections.js first.'
    );
  } else {
    pass(10, 'modules[] vs sections[]');
  }
}

// --------------------------------------------------------------------------
// Report
// --------------------------------------------------------------------------
console.log('');
console.log(`Seed script validator — ${path.relative(process.cwd(), targetPath)}`);
console.log('='.repeat(72));

for (const r of results) {
  const icon = r.status === 'PASS' ? '✅ PASS' : r.status === 'FAIL' ? '❌ FAIL' : '⚠️  WARN';
  console.log(`${icon}  [Check ${r.id}] ${r.title}`);
  if (r.message) console.log(`          ${r.message}`);
}

const fails = results.filter((r) => r.status === 'FAIL').length;
const warns = results.filter((r) => r.status === 'WARN').length;

console.log('='.repeat(72));
console.log(`Summary: ${results.length - fails - warns} passed, ${fails} failed, ${warns} warnings`);

if (fails > 0) {
  console.log('');
  console.log('❌ Seed script has critical issues. Do NOT run against the database.');
  process.exit(1);
}

if (warns > 0) {
  console.log('');
  console.log('WARNINGS — review before seeding');
  process.exit(0);
}

console.log('');
console.log('✅ All checks passed. Safe to seed.');
process.exit(0);
