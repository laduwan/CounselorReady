#!/usr/bin/env node
/**
 * check-seed.cjs — CounselorReady seed-script static guard
 *
 * Refuses to let a seed script land if it bypasses the Mongoose pre-save hook
 * that computes wordCount / totalContentBlocks on InteractiveCourse documents.
 *
 * Three forbidden patterns:
 *   (1) `strict: false`                                  — schemaless model trick
 *   (2) `db.collection(...).insertOne|insertMany(`       — native driver write
 *   (3) `mongoose.model('InteractiveCourse', new ... )`  — defines a shadow model
 *
 * One required pattern:
 *       must require/import the real `models/InteractiveCourse`
 *
 * Scope:
 *   By default scans every seed*.{js,cjs,mjs} under server/src/scripts/.
 *   With --staged, only scans files staged for the current commit
 *     (intended for use as a pre-commit hook).
 *   With --files a.js b.js, only scans the given paths
 *     (intended for CI on changed-files lists).
 *
 * Exit codes:
 *   0  clean
 *   1  one or more violations
 *   2  bad invocation / runtime error
 *
 * No runtime dependencies. Pure Node stdlib. Safe to run anywhere.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPO_ROOT = (() => {
  try {
    return execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim();
  } catch {
    return process.cwd();
  }
})();

const SEED_GLOB_DIR = path.join(REPO_ROOT, 'server', 'src', 'scripts');
const SEED_NAME_RX  = /^seed.*\.(?:js|cjs|mjs)$/i;

// ---------- rules ----------

// Line-level rules: match per line, report line number on every hit.
const FORBIDDEN_LINE = [
  {
    id: 'strict-false',
    rx:  /strict\s*:\s*false/,
    msg: 'Uses `strict: false` to bypass schema validation. ' +
         'This disables the pre-save hook that computes wordCount. ' +
         'Import the real model instead: ' +
         "const InteractiveCourse = require('../models/InteractiveCourse');",
  },
  {
    id: 'shadow-model',
    rx:  /mongoose\.model\s*\(\s*['"`](?:InteractiveCourse|Course)['"`]\s*,\s*new\s+mongoose\.Schema/,
    msg: 'Defines a shadow Course/InteractiveCourse model inline. ' +
         'The canonical model lives at server/src/models/InteractiveCourse.js ' +
         'and owns the pre-save hook. Import it; do not redefine it.',
  },
];

// File-level rules: scan the whole file. Catches multi-line bypass patterns
// like  `const c = db.collection("interactivecourses"); ... c.insertOne(...)`.
const FORBIDDEN_FILE = [
  {
    id: 'raw-insert',
    test: (src) => {
      const hasCollectionHandle = /\.\s*collection\s*\(\s*['"`][^'"`]+['"`]\s*\)/.test(src);
      const hasNativeWrite      = /\.\s*(?:insertOne|insertMany|bulkWrite|replaceOne|updateOne|updateMany)\s*\(/.test(src);
      return hasCollectionHandle && hasNativeWrite;
    },
    msg: 'Uses native driver collection write (insertOne/insertMany/bulkWrite/replaceOne/updateOne/updateMany). ' +
         'This bypasses Mongoose entirely — wordCount and totalContentBlocks will never be set. ' +
         'Use InteractiveCourse.create(...) or new InteractiveCourse(...).save() ' +
         'so the pre-save hook fires.',
  },
];

const REQUIRED_ANY = [
  {
    id: 'real-model-import',
    // Accept an optional .js/.cjs/.mjs extension: ES-module ("type":"module")
    // seeds MUST include the extension on relative imports, so the extensionless
    // form alone produced false negatives for every ESM seed (including the
    // canonical _seedTemplate.js, which imports '../models/InteractiveCourse.js').
    rxs: [
      /require\s*\(\s*['"`][^'"`]*\/models\/InteractiveCourse(?:\.(?:js|cjs|mjs))?['"`]\s*\)/,
      /from\s+['"`][^'"`]*\/models\/InteractiveCourse(?:\.(?:js|cjs|mjs))?['"`]/,
    ],
    msg: 'Seed file does not import the real InteractiveCourse model. ' +
         "Add: const InteractiveCourse = require('../models/InteractiveCourse'); " +
         'and write courses with InteractiveCourse.create(data) ' +
         'or new InteractiveCourse(data).save().',
  },
];

// ---------- file discovery ----------

function listAllSeedFiles() {
  if (!fs.existsSync(SEED_GLOB_DIR)) return [];
  const out = [];
  (function walk(dir) {
    for (const name of fs.readdirSync(dir)) {
      const full = path.join(dir, name);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) walk(full);
      else if (SEED_NAME_RX.test(name)) out.push(full);
    }
  })(SEED_GLOB_DIR);
  return out;
}

function listStagedSeedFiles() {
  let staged = '';
  try {
    staged = execSync(
      'git diff --cached --name-only --diff-filter=ACMR',
      { encoding: 'utf8' }
    );
  } catch (err) {
    console.error('check-seed: failed to read git index:', err.message);
    process.exit(2);
  }
  return staged
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean)
    .filter(rel => {
      // only seed*.{js,cjs,mjs} under server/src/scripts/
      const norm = rel.replace(/\\/g, '/');
      if (!norm.startsWith('server/src/scripts/')) return false;
      return SEED_NAME_RX.test(path.basename(norm));
    })
    .map(rel => path.join(REPO_ROOT, rel))
    .filter(fs.existsSync);
}

function parseArgs(argv) {
  const args = { mode: 'all', explicitFiles: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--staged') args.mode = 'staged';
    else if (a === '--files') { args.mode = 'files'; args.explicitFiles = argv.slice(i + 1); break; }
    else if (a === '--help' || a === '-h') { args.mode = 'help'; }
    else if (a.startsWith('--')) { console.error(`check-seed: unknown flag: ${a}`); process.exit(2); }
  }
  return args;
}

function help() {
  console.log(`Usage:
  node tools/check-seed.cjs               scan every seed*.{js,cjs,mjs} under server/src/scripts/
  node tools/check-seed.cjs --staged      scan only files staged for commit (pre-commit hook)
  node tools/check-seed.cjs --files a b   scan only the listed files (CI changed-files)
  node tools/check-seed.cjs --help        this message

Exits 0 clean, 1 on violations, 2 on bad invocation.`);
}

// ---------- scanning ----------

function scanFile(absPath) {
  const rel = path.relative(REPO_ROOT, absPath);
  const src = fs.readFileSync(absPath, 'utf8');
  const lines = src.split('\n');
  const violations = [];

  // line-level forbidden patterns: report every match with line number
  for (const rule of FORBIDDEN_LINE) {
    lines.forEach((ln, i) => {
      if (rule.rx.test(ln)) {
        violations.push({ file: rel, line: i + 1, rule: rule.id, msg: rule.msg, code: ln.trim() });
      }
    });
  }

  // file-level forbidden patterns: single hit per file, no line number
  for (const rule of FORBIDDEN_FILE) {
    if (rule.test(src)) {
      violations.push({ file: rel, line: 0, rule: rule.id, msg: rule.msg, code: null });
    }
  }

  // required-any: at least one of the alternative patterns must appear anywhere in the file
  for (const rule of REQUIRED_ANY) {
    const found = rule.rxs.some(rx => rx.test(src));
    if (!found) violations.push({ file: rel, line: 0, rule: rule.id, msg: rule.msg, code: null });
  }

  return violations;
}

function printReport(violations) {
  if (!violations.length) return;
  // group by file
  const byFile = new Map();
  for (const v of violations) {
    if (!byFile.has(v.file)) byFile.set(v.file, []);
    byFile.get(v.file).push(v);
  }
  for (const [file, vs] of byFile) {
    console.log(`\n  ${file}`);
    for (const v of vs) {
      const loc = v.line ? `line ${v.line}` : 'file';
      console.log(`    × [${v.rule}] ${loc}`);
      if (v.code) console.log(`        ${v.code}`);
      console.log(`        ${v.msg}`);
    }
  }
}

// ---------- doc cross-validation ----------
//
// The authoring doc and the Gold Standard spec drifted from this checker once
// already (the doc taught raw db.collection() writes that this hook rejects,
// and both taught block field names the viewer renders as EMPTY). These checks
// scan the fenced code blocks in both files on every run so the docs, the
// template, and this guard can never silently drift apart again.

const DOC_TARGETS = [
  { rel: 'docs/CC_Batch_Course_Prompts.md',
    mustContain: ['_seedTemplate.js'],
    mustContainMsg: 'Authoring doc must direct authors to copy server/src/scripts/_seedTemplate.js as the wrapper.' },
  { rel: path.join('server', 'src', 'scripts', 'GOLD_STANDARD_SPEC.md'),
    mustContain: ['_seedTemplate.js'],
    mustContainMsg: 'Spec must carry the corrected-shapes banner pointing at _seedTemplate.js / the schema.' },
];

function extractFences(md) {
  const fences = [];
  const rx = /```[a-zA-Z]*\n([\s\S]*?)```/g;
  let m, i = 0;
  while ((m = rx.exec(md)) !== null) fences.push({ n: ++i, text: m[1] });
  return fences;
}

const DOC_FENCE_RULES = [
  {
    id: 'doc-raw-write',
    test: (f) =>
      /(?:const|let|var)\s+[\w$]+\s*=\s*[\w$.]+\.collection\s*\(/.test(f) ||
      /await\s+[\w$]+\.(?:insertOne|insertMany|bulkWrite|replaceOne|updateOne|updateMany)\s*\(/.test(f),
    msg: 'Doc teaches a raw driver collection write. Seeds must copy _seedTemplate.js and write via doc.save() so the pre-save hook fires.',
  },
  {
    id: 'doc-strict-false',
    test: (f) => /strict\s*:\s*false/.test(f) && !/ContentBlockSchema/.test(f),
    msg: 'Doc teaches `strict: false`. Seeds must import the real model.',
  },
  {
    id: 'doc-flashcard-wrong-field',
    test: (f) => f.includes('flashcardDeck') && /(?<![A-Za-z])cards["']?\s*:\s*\[[\s\S]{0,60}?["']?front["']?\s*:/.test(f),
    msg: 'flashcardDeck example uses `cards:[{front,back}]`. The viewer renders ONLY `flashcards:[{id,front,back}]` — this shape displays "No flashcards available."',
  },
  {
    id: 'doc-cardsort-wrong-field',
    test: (f) => f.includes('cardSort') && /\bitems\s*:\s*\[/.test(f),
    msg: 'cardSort example uses `items:[...]`. The viewer renders ONLY `cards:[{id,text,correctCategory}]` — `items` displays an empty activity.',
  },
  {
    id: 'doc-matching-wrong-field',
    test: (f) => /["']?pairs["']?\s*:\s*\[/.test(f),
    msg: 'matching example uses `pairs`. The viewer and schema use `matchingPairs:[{term,definition}]` (+ matchingInstructions).',
  },
  {
    id: 'doc-scenariotree-wrong-shape',
    test: (f) => f.includes('scenarioTree') &&
      (/nodes\s*:\s*\[/.test(f) || /["']?nextId["']?\s*:/.test(f) ||
       /["']?feedback["']?\s*:\s*\{/.test(f)),
    msg: 'scenarioTree example uses an array of nodes, `nextId`, or object `feedback`. The viewer needs nodes as an OBJECT MAP keyed by id, choices:[{text,next}], and STRING feedback.',
  },
  {
    id: 'doc-flat-options',
    test: (f) => /options["']?\s*:\s*\[\s*["'][^{]/.test(f),
    msg: 'Example uses flat string options. Options are ALWAYS [{text, isCorrect}] — flat arrays cause Mongoose char-explosion and break grading.',
  },
];

function scanDocs() {
  const violations = [];
  for (const t of DOC_TARGETS) {
    const abs = path.join(REPO_ROOT, t.rel);
    if (!fs.existsSync(abs)) continue;
    const md = fs.readFileSync(abs, 'utf8');
    for (const needle of (t.mustContain || [])) {
      if (!md.includes(needle)) {
        violations.push({ file: t.rel, line: 0, rule: 'doc-missing-reference', msg: t.mustContainMsg, code: null });
      }
    }
    for (const fence of extractFences(md)) {
      for (const rule of DOC_FENCE_RULES) {
        if (rule.test(fence.text)) {
          violations.push({ file: t.rel, line: 0, rule: rule.id, msg: `[code fence #${fence.n}] ${rule.msg}`, code: null });
        }
      }
    }
  }
  return violations;
}

// ---------- main ----------

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.mode === 'help') { help(); process.exit(0); }

  let files;
  if (args.mode === 'staged')      files = listStagedSeedFiles();
  else if (args.mode === 'files')  files = args.explicitFiles
                                            .map(p => path.isAbsolute(p) ? p : path.join(REPO_ROOT, p))
                                            .filter(p => SEED_NAME_RX.test(path.basename(p)))
                                            .filter(fs.existsSync);
  else                             files = listAllSeedFiles();

  if (!files.length) {
    const docViolations = scanDocs();
    if (docViolations.length) {
      console.log(`\ncheck-seed: FAIL — ${docViolations.length} doc violation(s):`);
      printReport(docViolations);
      process.exit(1);
    }
    console.log('check-seed: no seed files to scan; authoring docs clean.');
    process.exit(0);
  }

  console.log(`check-seed: scanning ${files.length} seed file(s) + authoring docs...`);

  let allViolations = [];
  for (const f of files) {
    allViolations = allViolations.concat(scanFile(f));
  }
  // Doc cross-validation runs in every mode — cheap, and it is the only thing
  // standing between the authoring docs and silent drift from this guard.
  allViolations = allViolations.concat(scanDocs());

  if (!allViolations.length) {
    console.log(`check-seed: PASS — ${files.length} file(s) clean.`);
    process.exit(0);
  }

  console.log(`\ncheck-seed: FAIL — ${allViolations.length} violation(s) across ${new Set(allViolations.map(v => v.file)).size} file(s):`);
  printReport(allViolations);
  console.log(`
Fix: every seed must import the canonical model and write via Mongoose.

  // at the top of the seed file:
  const mongoose         = require('mongoose');
  const InteractiveCourse = require('../models/InteractiveCourse');

  // inside the seeder:
  await mongoose.connect(process.env.MONGODB_URI);
  const existing = await InteractiveCourse.findOne({ slug: COURSE.slug });
  if (existing) {
    Object.assign(existing, COURSE);
    await existing.save();          // triggers pre-save hook → wordCount, totalContentBlocks
  } else {
    await InteractiveCourse.create(COURSE);
  }
`);
  process.exit(1);
}

main();
