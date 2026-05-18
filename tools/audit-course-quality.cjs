#!/usr/bin/env node
/**
 * audit-course-quality.cjs — CounselorReady live DB audit
 *
 * Connects to MongoDB Atlas and fails the build if any course in the
 * `interactivecourses` collection violates Phase 1 quality rules:
 *
 *   R1  wordCount must be set and > 0
 *   R2  wordCount >= ceHours * MIN_WORDS_PER_CE_HOUR   (ACEP floor)
 *   R3  the course must have content: either sections.length > 0
 *       OR modules.length > 0 (schema fork is acknowledged here;
 *       Phase 2 will unify the fields)
 *   R4  ceHours must be set and > 0  (sanity floor)
 *
 * Environment:
 *   MONGODB_URI       (required) — connection string to MongoDB Atlas
 *   MIN_WPCE          (optional) — ACEP minimum words per CE hour, defaults to 6000
 *   ALLOW_DRAFT       (optional) — if truthy, skip courses with status === 'draft'
 *   AUDIT_COLLECTION  (optional) — collection name, defaults to 'interactivecourses'
 *
 * Flags:
 *   --verbose         print every course's pass/fail, not just failures
 *   --json            machine-readable output
 *   --allow-draft     ignore courses with status === 'draft' (same as ALLOW_DRAFT=1)
 *
 * Exit codes:
 *   0  every course in scope passes every rule
 *   1  one or more failures
 *   2  cannot connect / bad invocation
 *
 * Uses the native mongodb driver (already a transitive dep of mongoose@8)
 * to keep the script lean and side-effect free.
 */

const args = {
  verbose:  process.argv.includes('--verbose'),
  json:     process.argv.includes('--json'),
  allowDraft: process.argv.includes('--allow-draft') || !!process.env.ALLOW_DRAFT,
};

const MONGODB_URI       = process.env.MONGODB_URI;
const MIN_WPCE          = Number(process.env.MIN_WPCE || 6000);
const AUDIT_COLLECTION  = process.env.AUDIT_COLLECTION || 'interactivecourses';

if (!MONGODB_URI) {
  console.error('audit-course-quality: MONGODB_URI is not set. Aborting.');
  process.exit(2);
}

let MongoClient;
try {
  ({ MongoClient } = require('mongodb'));
} catch {
  try {
    // mongoose ships mongodb as a dep; fall back to its copy
    ({ MongoClient } = require('mongoose/node_modules/mongodb'));
  } catch (err) {
    console.error('audit-course-quality: cannot load mongodb driver. ' +
                  'Run `npm install` in the server/ workspace.');
    process.exit(2);
  }
}

function ruleResults(course) {
  const sectionsLen = Array.isArray(course.sections) ? course.sections.length : 0;
  const modulesLen  = Array.isArray(course.modules)  ? course.modules.length  : 0;
  const wc          = Number(course.wordCount || 0);
  const ce          = Number(course.ceHours   || 0);
  const floor       = Math.floor(ce * MIN_WPCE);

  const fails = [];
  if (!ce || ce <= 0)           fails.push({ rule: 'R4-ceHours',  detail: `ceHours=${course.ceHours}` });
  if (!wc || wc <= 0)           fails.push({ rule: 'R1-wordCount-missing', detail: `wordCount=${course.wordCount}` });
  if (ce > 0 && wc < floor)     fails.push({ rule: 'R2-wordCount-below-acep-floor', detail: `wordCount=${wc} < ${ce}×${MIN_WPCE}=${floor}` });
  if (sectionsLen + modulesLen === 0) fails.push({ rule: 'R3-no-content', detail: 'sections.length=0 AND modules.length=0' });

  return {
    slug:          course.slug || `(no-slug:${course._id})`,
    title:         course.title || '(untitled)',
    courseCode:    course.courseCode || '',
    status:        course.status || '(unset)',
    ceHours:       ce,
    wordCount:     wc,
    floor,
    sectionsLen,
    modulesLen,
    fails,
    passed:        fails.length === 0,
  };
}

async function main() {
  const client = new MongoClient(MONGODB_URI, {
    // short, fail-fast timeouts — this script lives in CI
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS:         10000,
  });

  try {
    await client.connect();
  } catch (err) {
    console.error('audit-course-quality: connection failed:', err.message);
    process.exit(2);
  }

  const db = client.db();
  const coll = db.collection(AUDIT_COLLECTION);

  const filter = args.allowDraft ? { status: { $ne: 'draft' } } : {};
  const courses = await coll
    .find(filter, { projection: { sections: 1, modules: 1, wordCount: 1, ceHours: 1,
                                  title: 1, slug: 1, status: 1, courseCode: 1 } })
    .toArray();

  await client.close();

  const results = courses.map(ruleResults);
  const failed  = results.filter(r => !r.passed);
  const passed  = results.filter(r =>  r.passed);

  if (args.json) {
    console.log(JSON.stringify({
      collection: AUDIT_COLLECTION,
      minWordsPerCeHour: MIN_WPCE,
      counts: { total: results.length, passed: passed.length, failed: failed.length },
      failures: failed,
    }, null, 2));
    process.exit(failed.length ? 1 : 0);
  }

  // human-readable
  console.log(`\naudit-course-quality: scanned ${results.length} course(s) in '${AUDIT_COLLECTION}'`);
  console.log(`  passed: ${passed.length}    failed: ${failed.length}    floor: ${MIN_WPCE} words / CE hour`);

  if (args.verbose) {
    for (const r of passed) {
      console.log(`  ✓ ${pad(r.courseCode || '', 12)} ${pad(r.slug, 50)} ` +
                  `wc=${r.wordCount} ceHours=${r.ceHours} secs=${r.sectionsLen} mods=${r.modulesLen}`);
    }
  }

  if (failed.length) {
    console.log(`\nFailures:`);
    for (const r of failed) {
      console.log(`\n  ✗ ${r.courseCode ? r.courseCode + '  ' : ''}${r.title}`);
      console.log(`     slug=${r.slug}    status=${r.status}    ceHours=${r.ceHours}    wordCount=${r.wordCount}`);
      console.log(`     sections=${r.sectionsLen}    modules=${r.modulesLen}    acep-floor=${r.floor}`);
      for (const f of r.fails) {
        console.log(`     × [${f.rule}] ${f.detail}`);
      }
    }
    console.log(`
Likely root causes:
  R1 (wordCount missing)       → seed bypassed Mongoose pre-save hook.
                                  Fix the seed or run server/backfillWordCount.js.
  R2 (below ACEP floor)        → real content shortfall OR backfill is reading
                                  the wrong field. Verify the docx wordcount and
                                  re-run the seed via the canonical model.
  R3 (no content)              → seed wrote metadata but not sections/modules,
                                  or seed write to a different collection.
  R4 (ceHours missing)         → required field unset. Edit the seed and reseed.
`);
    process.exit(1);
  }

  console.log(`\naudit-course-quality: PASS\n`);
  process.exit(0);
}

function pad(s, n) { s = String(s); return s.length >= n ? s : s + ' '.repeat(n - s.length); }

main().catch(err => {
  console.error('audit-course-quality: unexpected error:', err);
  process.exit(2);
});
