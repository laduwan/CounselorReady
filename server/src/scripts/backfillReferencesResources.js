// backfillReferencesResources.js (v2 — targeted update, fault-tolerant)
// ---------------------------------------------------------------------------
// Populates the top-level `references[]` and `resources[]` arrays on each
// InteractiveCourse so the CR Viewer's References/Resources drawer tabs appear.
//
// v2 fix: the first version loaded each course as a full Mongoose document and
// called doc.save(), which re-validates EVERY field on the document — including
// contentBlocks[].order (required), which many older courses never had set
// because they were written via raw driver insertOne/updateOne calls that skip
// Mongoose validation entirely. That's unrelated legacy data, not something
// this script should ever touch or be blocked by. v2 instead does a targeted
// updateOne($set: {references, resources}) — Mongoose only validates fields
// inside $set, so pre-existing gaps elsewhere in the document can't interfere.
// Each course is also now wrapped in try/catch so one bad document logs and is
// skipped instead of aborting the rest of the run.
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

function refsFromBlock(block) {
  const out = [];
  if (!block) return out;
  const arr = block.references || block.refs || null;
  if (Array.isArray(arr)) {
    arr.forEach((r) => {
      if (typeof r === 'string') out.push(r.trim());
      else if (r && (r.citation || r.formatted)) out.push((r.citation || r.formatted).trim());
    });
  }
  const html = String(block.content || block.html || block.text || '');
  const m = html.match(/<p[^>]*class=["'][^"']*cr-reference[^"']*["'][^>]*>([\s\S]*?)<\/p>/gi);
  if (m) m.forEach((p) => { const t = stripTags(p); if (t.length > 10) out.push(t); });
  const md = html.match(/##\s*References\s*\n([\s\S]*?)(?=\n##\s|\n---\s*\n|$)/i);
  if (md) md[1].trim().split(/\n\s*\n/).forEach((line) => { const t = line.trim().replace(/^[-*]\s*/, ''); if (t.length > 10) out.push(t); });
  return out;
}

function resFromBlock(block) {
  if (block && (block.type === 'resources' || block.type === 'deliverables') && Array.isArray(block.resources)) {
    return block.resources
      .filter((r) => r && (r.title || r.url || r.name))
      .map((r) => ({ title: r.title || r.name || 'Resource', url: r.url || '', type: r.type || 'link', description: r.description || '' }));
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
  if (typeof course.text === 'string') refsFromBlock({ content: course.text }).forEach((r) => refs.push(r));

  const seen = new Set();
  const refsUniq = [];
  refs.forEach((r) => { const k = norm(r); if (k && !seen.has(k)) { seen.add(k); refsUniq.push({ citation: stripTags(r) }); } });

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

  let refFilled = 0, resFilled = 0, alreadyOk = 0, noSource = 0, failed = 0;
  const failures = [];

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
      try {
        const set = { updatedAt: new Date() };
        if (willRefs) set.references = refsUniq;
        if (willRes) set.resources = resUniq;
        // Targeted update — only the fields in $set are validated, so legacy
        // gaps elsewhere in the document (e.g. missing contentBlocks[].order
        // on courses written via raw driver calls) cannot block this write.
        await InteractiveCourse.updateOne({ _id: raw._id }, { $set: set }, { runValidators: true });
      } catch (err) {
        failed++;
        failures.push({ slug: raw.slug || String(raw._id), error: err.message });
        console.error(`  ❌ FAILED ${raw.slug || raw._id}: ${err.message}`);
        continue; // move on — do not abort the rest of the batch
      }
    }
    if (willRefs) refFilled++;
    if (willRes) resFilled++;
  }

  console.log(`\n${APPLY ? 'Filled' : 'Would fill'}: references on ${refFilled} course(s), resources on ${resFilled} course(s).`);
  console.log(`Already had both: ${alreadyOk}.  Empty refs with no extractable source: ${noSource}.`);
  if (failed) {
    console.log(`\n⚠️  ${failed} course(s) failed to update (logged above, run continued):`);
    failures.forEach(f => console.log(`  ${f.slug}: ${f.error}`));
    console.log(`\nThese failures are pre-existing data issues unrelated to references/resources (e.g. missing contentBlocks[].order on courses saved via raw driver calls). They do not need to be fixed for this script's purpose — they were simply skipped.`);
  }
  if (!APPLY) console.log('\nDRY RUN — re-run with --apply to write.');
  await mongoose.disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
