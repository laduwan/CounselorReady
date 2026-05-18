#!/usr/bin/env node
/**
 * inspect-course.cjs — CR-610 word-count diagnostic
 *
 * Read-only inspection of a single course in `interactivecourses`.
 * Surfaces blocks whose text lives in fields the pre-save hook does
 * not read (canonical: textContent | content | html | body).
 *
 * Usage:   node tools/inspect-course.cjs <slug>
 * Default slug: unretiring-the-self-identity-purpose-depression-older-adults
 * Env:     MONGODB_URI (required), AUDIT_COLLECTION (optional)
 * Exit:    0 ok, 2 bad invocation or DB error
 */

const DEFAULT_SLUG = 'unretiring-the-self-identity-purpose-depression-older-adults';
const slug = process.argv[2] || DEFAULT_SLUG;
const MONGODB_URI      = process.env.MONGODB_URI;
const AUDIT_COLLECTION = process.env.AUDIT_COLLECTION || 'interactivecourses';

if (!MONGODB_URI) {
  console.error('inspect-course: MONGODB_URI is not set. Aborting.');
  process.exit(2);
}

let MongoClient;
try { ({ MongoClient } = require('mongodb')); }
catch {
  try { ({ MongoClient } = require('mongoose/node_modules/mongodb')); }
  catch { console.error('inspect-course: cannot load mongodb driver.'); process.exit(2); }
}

const CANONICAL_FIELDS = ['textContent', 'content', 'html', 'body'];

function wcOf(s) {
  if (typeof s !== 'string' || !s) return 0;
  const plain = s.replace(/<[^>]+>/g, ' ').replace(/&\w+;/g, ' ').trim();
  return plain ? plain.split(/\s+/).filter(w => w.length > 0).length : 0;
}
function truncate(s, n) {
  const flat = String(s).replace(/\s+/g, ' ').trim();
  return flat.length <= n ? flat : flat.slice(0, n) + '…';
}
function stringFields(b) {
  return Object.keys(b || {}).filter(k => typeof b[k] === 'string' && b[k].length > 0);
}
function canonicalWc(b) {
  for (const f of CANONICAL_FIELDS) if (typeof b[f] === 'string' && b[f]) return wcOf(b[f]);
  return 0;
}
function fullWc(b) {
  return stringFields(b).reduce((t, k) => t + wcOf(b[k]), 0);
}
function longestField(b) {
  let best = null, bestLen = -1;
  for (const k of stringFields(b)) if (b[k].length > bestLen) { best = k; bestLen = b[k].length; }
  return best;
}

function printContainers(containers, label) {
  let cTotal = 0, fTotal = 0;
  const suspects = [];
  containers.forEach((c, ci) => {
    console.log('');
    console.log(`${label} [${ci}]: ${c.title || '(untitled)'}`);
    if (c.subtitle) console.log(`  subtitle: ${c.subtitle}`);
    const blocks = Array.isArray(c.contentBlocks) ? c.contentBlocks : [];
    console.log(`  contentBlocks: ${blocks.length}`);
    let sc = 0, sf = 0;
    blocks.forEach((b, bi) => {
      const cw = canonicalWc(b), fw = fullWc(b);
      sc += cw; sf += fw;
      const fields = stringFields(b);
      const longest = longestField(b);
      console.log(`    [${bi}] type=${b.type || '(none)'}  canonical=${cw}  full=${fw}`);
      console.log(`         fields: ${fields.join(', ') || '(none)'}`);
      if (longest) console.log(`         longest(${longest}): ${truncate(b[longest], 80)}`);
      if (cw === 0 && fw > 0) suspects.push({ container: ci, block: bi, type: b.type, fields, fullWc: fw });
    });
    console.log(`  subtotal canonical=${sc}  full=${sf}`);
    cTotal += sc; fTotal += sf;
  });
  return { cTotal, fTotal, suspects };
}

async function main() {
  const client = new MongoClient(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000, connectTimeoutMS: 10000,
  });
  try {
    await client.connect();
    const course = await client.db().collection(AUDIT_COLLECTION).findOne({ slug });
    if (!course) {
      console.error(`inspect-course: no document with slug=${slug} in ${AUDIT_COLLECTION}`);
      process.exit(2);
    }
    const ce = Number(course.ceHours || 0);
    const wc = Number(course.wordCount || 0);
    const floor = Math.floor(ce * 6000);

    console.log('=== Course header ===');
    console.log(`title:       ${course.title || '(untitled)'}`);
    console.log(`slug:        ${course.slug || ''}`);
    console.log(`courseCode:  ${course.courseCode || ''}`);
    console.log(`status:      ${course.status || '(unset)'}`);
    console.log(`ceHours:     ${ce}`);
    console.log(`wordCount:   ${wc}`);
    console.log(`acepFloor:   ${floor}  (ceHours x 6000)`);
    console.log(`shortfall:   ${floor - wc}`);

    console.log('');
    console.log('=== Top-level shape ===');
    const sections = Array.isArray(course.sections) ? course.sections : null;
    const modules  = Array.isArray(course.modules)  ? course.modules  : null;
    const refs     = Array.isArray(course.references) ? course.references : null;
    const aqs      = course.assessment && Array.isArray(course.assessment.questions) ? course.assessment.questions : null;
    console.log(`sections:              ${sections ? `present, length=${sections.length}` : 'absent'}`);
    console.log(`modules:               ${modules  ? `present, length=${modules.length}`  : 'absent'}`);
    console.log(`references:            ${refs     ? `present, length=${refs.length}`     : 'absent'}`);
    console.log(`assessment.questions:  ${aqs      ? `present, length=${aqs.length}`      : 'absent'}`);

    let canonicalTotal = 0, fullTotal = 0;
    const allSuspects = [];
    if (sections && sections.length) {
      console.log('');
      console.log('=== Per-container breakdown: sections ===');
      const r = printContainers(sections, 'section');
      canonicalTotal += r.cTotal; fullTotal += r.fTotal; allSuspects.push(...r.suspects);
    }
    if (modules && modules.length) {
      console.log('');
      console.log('=== Per-container breakdown: modules ===');
      const r = printContainers(modules, 'module');
      canonicalTotal += r.cTotal; fullTotal += r.fTotal; allSuspects.push(...r.suspects);
    }

    console.log('');
    console.log('=== Word-count reconciliation ===');
    console.log(`canonical (textContent|content|html|body):  ${canonicalTotal}`);
    console.log(`all string fields:                          ${fullTotal}`);
    console.log(`stored wordCount:                           ${wc}`);
    console.log(`acep floor:                                 ${floor}`);
    console.log(`diff (full - canonical):                    ${fullTotal - canonicalTotal}`);

    console.log('');
    console.log('=== Suspect blocks (canonical=0, full>0) ===');
    if (allSuspects.length === 0) console.log('(none)');
    else allSuspects.forEach(s =>
      console.log(`  container=${s.container} block=${s.block} type=${s.type} fullWc=${s.fullWc} fields=${s.fields.join(',')}`));

    process.exit(0);
  } catch (err) {
    console.error(`inspect-course: ${err.message}`);
    process.exit(2);
  } finally {
    await client.close().catch(() => {});
  }
}

main();
