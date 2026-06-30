// backfillReferencesResources.js
// ---------------------------------------------------------------------------
// Populates the top-level `references[]` and `resources[]` arrays on each
// InteractiveCourse so the CR Viewer's References/Resources drawer tabs appear.
//
// WHY: client/public/interactive-course.html reveals the References drawer tab
// only when `course.references.length > 0` (and fills the Resources panel from
// `course.resources` / inline `resources` blocks). Batch-written courses put
// citations in the conclusion content (rendered fine in the body) but leave the
// persisted top-level `references[]`/`resources[]` arrays EMPTY — so the drawer
// reads nothing and the tabs stay hidden. This backfills those arrays from the
// content already in each course.
//
// SAFE: idempotent. Only fills an array that is currently empty; never
// overwrites existing references/resources. Dry-run by default.
//
//   node src/scripts/backfillReferencesResources.js           (dry run — report only)
//   node src/scripts/backfillReferencesResources.js --apply    (write changes)
//
// Requires: MONGODB_URI environment variable. Deploy to server/src/scripts/.
// ---------------------------------------------------------------------------

import mongoose from 'mongoose';
import { Course as InteractiveCourse } from '../models/InteractiveCourse.js';

const APPLY = process.argv.includes('--apply');
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ No MONGODB_URI environment variable set');
  process.exit(1);
}

// ── helpers ────────────────────────────────────────────────────────────────

const stripTags = (s) => String(s || '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').trim();
const norm = (s) => stripTags(s).toLowerCase().replace(/\s+/g, ' ').trim();

// Pull citation strings out of one block's content/fields.
function refsFromBlock(block) {
  const out = [];
  if (!block) return out;

  // 1. An explicit references array on the block (strings or objects).
  const arr = block.references || block.refs || null;
  if (Array.isArray(arr)) {
    arr.forEach((r) => {
      if (typeof r === 'string') out.push(r.trim());
      else if (r && (r.citation || r.formatted)) out.push((r.citation || r.formatted).trim());
    });
  }

  const html = String(block.content || block.html || block.text || '');

  // 2. <p class="cr-reference">…</p> paragraphs (the viewer's canonical HTML).
  const m = html.match(/<p[^>]*class=["'][^"']*cr-reference[^"']*["'][^>]*>([\s\S]*?)<\/p>/gi);
  if (m) m.forEach((p) => { const t = stripTags(p); if (t.length > 10) out.push(t); });

  // 3. A markdown "## References" section.
  const md = html.match(/##\s*References\s*\n([\s\S]*?)(?=\n##\s|\n---\s*\n|$)/i);
  if (md) md[1].trim().split(/\n\s*\n/).forEach((line) => { const t = line.trim().replace(/^[-*]\s*/, ''); if (t.length > 10) out.push(t); });

  return out;
}

// Pull resource objects out of one block.
function resFromBlock(block) {
  if (block && (block.type === 'resources' || block.type === 'deliverables') && Array.isArray(block.resources)) {
    return block.resources
      .filter((r) => r && (r.title || r.url))
      .map((r) => ({ title: r.title || 'Resource', url: r.url || '', type: r.type || 'link', description: r.description || '' }));
  }
  return [];
}

function collectFromCourse(course) {
  const refs = [];
  const res = [];
  const sections = course.sections || [];
  sections.forEach((sec) => {
    (sec.contentBlocks || []).forEach((b) => {
      refsFromBlock(b).forEach((r) => refs.push(r));
      resFromBlock(b).forEach((r) => res.push(r));
    });
  });
  // Some markdown-imported courses keep raw text on the doc.
  if (typeof course.text === 'string') refsFromBlock({ content: course.text }).forEach((r) => refs.push(r));

  // de-dupe references by normalized text
  const seen = new Set();
  const refsUniq = [];
  refs.forEach((r) => { const k = norm(r); if (k && !seen.has(k)) { seen.add(k); refsUniq.push({ citation: stripTags(r) }); } });

  // de-dupe resources by url+title
  const seenR = new Set();
  const resUniq = [];
  res.forEach((r) => { const k = (r.url || '') + '|' + (r.title || ''); if (!seenR.has(k)) { seenR.add(k); resUniq.push(r); } });

  return { refsUniq, resUniq };
}

// ── main ─────────────────────────────────────────────────────────────────

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log(`Connected. Mode: ${APPLY ? 'APPLY (writing)' : 'DRY RUN (no writes)'}\n`);

  const raws = await InteractiveCourse.find({}).select('_id slug title references resources sections text').lean();
  console.log(`Scanning ${raws.length} courses...\n`);

  let refFilled = 0, resFilled = 0, alreadyOk = 0, noSource = 0;

  for (const raw of raws) {
    const hasRefs = Array.isArray(raw.references) && raw.references.length > 0;
    const hasRes = Array.isArray(raw.resources) && raw.resources.length > 0;
    if (hasRefs && hasRes) { alreadyOk++; continue; }

    const { refsUniq, resUniq } = collectFromCourse(raw);
    const willRefs = !hasRefs && refsUniq.length > 0;
    const willRes = !hasRes && resUniq.length > 0;

    if (!willRefs && !willRes) {
      if (!hasRefs) { noSource++; console.log(`  ⚠️  ${raw.slug || raw._id} — references[] empty and no citations found in content`); }
      continue;
    }

    console.log(`  ${APPLY ? 'FILL' : 'would fill'} ${raw.slug || raw._id}: ` +
      (willRefs ? `+${refsUniq.length} references ` : '') +
      (willRes ? `+${resUniq.length} resources` : ''));

    if (APPLY) {
      const doc = await InteractiveCourse.findById(raw._id);
      if (!doc) continue;
      if (willRefs) doc.references = refsUniq;
      if (willRes) doc.resources = resUniq;
      await doc.save(); // through Mongoose so pre-save hooks fire
    }
    if (willRefs) refFilled++;
    if (willRes) resFilled++;
  }

  console.log(`\n${APPLY ? 'Filled' : 'Would fill'}: references on ${refFilled} course(s), resources on ${resFilled} course(s).`);
  console.log(`Already had both: ${alreadyOk}.  Empty refs with no extractable source: ${noSource}.`);
  if (!APPLY) console.log('\nDRY RUN — re-run with --apply to write.');
  await mongoose.disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
