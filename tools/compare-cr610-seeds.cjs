#!/usr/bin/env node
/**
 * compare-cr610-seeds.cjs — static comparison of both CR-610 seed files
 *
 * Reads each seed file as text, extracts the `const CR610 = { ... }` object
 * literal by tracking brace depth (string- and template-literal aware),
 * evaluates the literal in a clean vm sandbox, then walks modules and
 * computes per-block word counts using the same logic as the
 * InteractiveCourse pre-save hook.
 *
 * Compares results against the known DB state (recorded inline below from
 * `tools/inspect-course.cjs` output on 2026-05-18).
 *
 * Read-only. No DB. No edits to any seed.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SEEDS = [
  'server/src/scripts/seedCR610-Unretiring_the_Self_Retirement_Identity_Depression_and_Reinvention-23574words.js',
  'server/src/scripts/seedGeriatricSeries-AllFive-CR610-CR614-89027words.js',
];

// Frozen snapshot of what's currently in the `interactivecourses` collection
// for slug `unretiring-the-self-identity-purpose-depression-older-adults`.
const DB_STATE = {
  totalWords: 7225,
  storedWordCount: 7274,
  modules: [
    { title_starts: 'Module 1: The Closed Library',
      blockTypes: ['sectionDivider', 'text', 'knowledgeCheck', 'text'],
      blockWords: [0, 1994, 0, 1013],
      total: 3007 },
    { title_starts: 'Module 2: Reopening the Doors',
      blockTypes: ['sectionDivider', 'text', 'knowledgeCheck', 'text'],
      blockWords: [0, 1918, 0, 523],
      total: 2441 },
    { title_starts: 'Module 3: New Hours, New Catalog',
      blockTypes: ['sectionDivider', 'text', 'knowledgeCheck', 'text', 'quiz'],
      blockWords: [0, 1624, 0, 153, 0],
      total: 1777 },
  ],
};

function wcOf(s) {
  if (typeof s !== 'string' || !s) return 0;
  const plain = s.replace(/]+>/g, ' ').replace(/&\w+;/g, ' ').trim();
  return plain ? plain.split(/\s+/).filter(w => w.length > 0).length : 0;
}

function extractCR610(source) {
  const marker = source.indexOf('const CR610');
  if (marker < 0) return null;
  let i = source.indexOf('{', marker);
  if (i < 0) return null;
  const start = i;
  let depth = 0, inStr = null, inTpl = false, esc = false;
  for (; i < source.length; i++) {
    const c = source[i];
    if (esc) { esc = false; continue; }
    if (c === '\\') { esc = true; continue; }
    if (inStr) { if (c === inStr) inStr = null; continue; }
    if (inTpl) { if (c === '`') inTpl = false; continue; }
    if (c === '"' || c === "'") { inStr = c; continue; }
    if (c === '`') { inTpl = true; continue; }
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) return source.slice(start, i + 1); }
  }
  return null;
}

function analyzeSeed(seedPath) {
  const absPath = path.join(process.cwd(), seedPath);
  if (!fs.existsSync(absPath)) return { error: `not found: ${seedPath}` };
  const src = fs.readFileSync(absPath, 'utf8');
  const objText = extractCR610(src);
  if (!objText) return { error: 'CR610 object literal not found' };

  let obj;
  try {
    obj = vm.runInNewContext('(' + objText + ')', {}, { timeout: 2000 });
  } catch (e) {
    return { error: `eval failed: ${e.message}` };
  }

  const modules = Array.isArray(obj.modules) ? obj.modules : [];
  const out = { title: obj.title, ceHours: obj.ceHours, modules: [], total: 0 };
  for (const m of modules) {
    const blocks = Array.isArray(m.contentBlocks) ? m.contentBlocks : [];
    const mInfo = { title: m.title || '', blockCount: blocks.length, blocks: [], total: 0 };
    for (const b of blocks) {
      const text = b.textContent || b.content || b.html || b.body || '';
      const wc = wcOf(text);
      mInfo.blocks.push({ type: b.type || '(no-type)', wc });
      mInfo.total += wc;
    }
    out.modules.push(mInfo);
    out.total += mInfo.total;
  }
  return out;
}

function pad(s, n) { s = String(s); return s.length >= n ? s : s + ' '.repeat(n - s.length); }

console.log('=== DB state (frozen snapshot) ===');
console.log(`stored wordCount: ${DB_STATE.storedWordCount}`);
console.log(`canonical total: ${DB_STATE.totalWords}`);
for (let i = 0; i < DB_STATE.modules.length; i++) {
  const m = DB_STATE.modules[i];
  console.log(`  module ${i}: ${m.title_starts}  total=${m.total}  blocks=${m.blockTypes.join(',')} wc=${m.blockWords.join(',')}`);
}

for (const seedPath of SEEDS) {
  console.log(`\n=== Seed: ${seedPath} ===`);
  const r = analyzeSeed(seedPath);
  if (r.error) { console.log(`  ERROR: ${r.error}`); continue; }
  console.log(`title: ${r.title}`);
  console.log(`ceHours: ${r.ceHours}`);
  console.log(`modules: ${r.modules.length}`);
  console.log(`canonical total words: ${r.total}`);
  for (let mi = 0; mi < r.modules.length; mi++) {
    const m = r.modules[mi];
    console.log(`  module[${mi}] "${m.title.slice(0, 70)}"`);
    console.log(`    blocks: ${m.blockCount}    canonical total: ${m.total}`);
    for (let bi = 0; bi < m.blocks.length; bi++) {
      const b = m.blocks[bi];
      console.log(`      [${bi}] ${pad(b.type, 18)} wc=${b.wc}`);
    }
  }
}

console.log('\n=== Verdict ===');
console.log('Whichever seed total ≈ 7225 is the seed that matches the live DB.');
console.log('The other seed contains the missing content.');
console.log('Compare module-by-module block totals to confirm.');
