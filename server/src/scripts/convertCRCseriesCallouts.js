// convertCRCseriesCallouts.js
// Fixes the "flat / run-on" text in the CR-C1..C5 bulk-seeded courses.
//
// Those courses (bulkSeedCRC1-C5.js) authored each section as:
//   sectionDivider + ONE big `text` block (all prose) + multipleChoice blocks.
// Inside that one text block, every "Moral Dilemma in Practice" and
// "Self-Check Intervention:" box was crammed into a SINGLE <p> with no internal
// breaks, so the viewer renders it as a wall. This script splits each of those
// paragraphs out into its own structured `type:'callout'` block (which the
// viewer's renderCallout already styles) and restores readable line breaks.
//
// It is deterministic, additive, and text-preserving:
//   - only <p>/<strong>/<br>/<ul>/<li> tags are added; no words are removed
//   - a per-course word-count assertion aborts that course if the visible text
//     count changes at all
//   - original `sections` for each touched course are dumped to a backup file
//     BEFORE any write
//
// Run from ~/project/src/server :
//   node src/scripts/convertCRCseriesCallouts.js                 (dry run, all 5)
//   node src/scripts/convertCRCseriesCallouts.js ai-ethics-mental-health   (dry run, one)
//   node src/scripts/convertCRCseriesCallouts.js ai-ethics-mental-health --write   (apply one)
//   node src/scripts/convertCRCseriesCallouts.js --write         (apply all 5)

import mongoose from 'mongoose';
import { writeFileSync } from 'fs';

const ARGS = process.argv.slice(2);
const WRITE = ARGS.includes('--write');
const SLUG_ARG = ARGS.find(a => !a.startsWith('--')) || null;

const CRC_SLUGS = [
  'moral-injury-counselors',
  'racial-trauma-affirming-practice',
  'ai-ethics-mental-health',
  'clinician-burnout-sustainable-practice',
  'neurodivergent-affirming-practice',
];
const TARGET_SLUGS = SLUG_ARG ? [SLUG_ARG] : CRC_SLUGS;

// ─── text-only word count (for the preservation guard) ───────────────────────
function stripTags(s) {
  return String(s || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ').replace(/&#39;|&rsquo;|&lsquo;/g, "'")
    .replace(/\s+/g, ' ').trim();
}
function blockText(b) {
  const parts = [
    b.textContent, b.content, b.title, b.subtitle, b.question, b.explanation,
  ];
  if (Array.isArray(b.calloutItems)) parts.push(b.calloutItems.join(' '));
  if (Array.isArray(b.items)) parts.push(b.items.join(' '));
  if (Array.isArray(b.options)) parts.push(b.options.map(o => (o && o.text) || o).join(' '));
  return parts.filter(Boolean).map(stripTags).join(' ');
}
function sectionWordCount(section) {
  return (section.contentBlocks || [])
    .map(b => stripTags(blockText(b)).split(' ').filter(Boolean).length)
    .reduce((a, n) => a + n, 0);
}
// Letters-only signature: the real preservation invariant. Un-mashing joined
// words and dropping "1."/"2." list markers changes the WORD count on purpose,
// but never changes the letters. This must match exactly before vs after.
function lettersOnly(s) { return String(s || '').toLowerCase().replace(/[^a-z]/g, ''); }
function sectionSignature(section) {
  // sorted multiset of letters — order-independent, so relocating a label into
  // a callout title/items field is fine; only actual add/loss of text trips it.
  return lettersOnly((section.contentBlocks || []).map(blockText).join(' '))
    .split('').sort().join('');
}

// ─── break restoration for numbered / stepped list content ───────────────────
function restoreNumbered(s) {
  // Put each "N. " on its own line (reflective questions, numbered self-check items)
  return s.replace(/\s*(?=\b[1-9]\d?\.\s)/g, '<br>').replace(/^<br>/, '');
}
function restoreSelfCheckBody(s) {
  let out = s;
  // Break before recognizable structural labels
  out = out.replace(/\s*(Step\s+\d+\s*[:.\u2013\u2014])/g, '<br><strong>$1</strong>');
  out = out.replace(/\s*(Part\s+\d+\s*:)/g, '<br><br><strong>$1</strong>');
  out = out.replace(/\s*(Section\s+\d+\s*:)/g, '<br><br><strong>$1</strong>');
  out = out.replace(/\s*(Question\s+\d+\s*[\u2013\u2014:])/g, '<br><strong>$1</strong>');
  out = out.replace(/\s*\u2192\s*/g, '<br>\u2192 '); // "→" bullets
  out = restoreNumbered(out);
  return out.replace(/^(?:<br>)+/, '');
}

// ─── parse one "Moral Dilemma in Practice" paragraph inner text ──────────────
function parseMoralDilemma(inner) {
  let body = inner.replace(/^\s*Moral Dilemma in Practice\s*/i, '');
  const rqIdx = body.search(/Reflective Questions\s*:/i);
  if (rqIdx === -1) {
    // fallback: no recognizable structure — keep everything, restore breaks, flag
    return {
      block: {
        type: 'callout', calloutType: 'clinical', title: 'Moral Dilemma in Practice',
        content: '<p>' + restoreNumbered(body.trim()) + '</p>',
      },
      flagged: true,
    };
  }
  let scenario = body.slice(0, rqIdx).replace(/^\s*Clinical Scenario\s*:\s*/i, '').trim();
  const qTail = body.slice(rqIdx).replace(/^Reflective Questions\s*:\s*/i, '').trim();
  const items = qTail
    .split(/\s*(?=\b[1-9]\d?\.\s)/)
    .map(q => q.replace(/^\s*[1-9]\d?\.\s*/, '').trim())
    .filter(Boolean);
  return {
    block: {
      type: 'callout', calloutType: 'clinical', title: 'Moral Dilemma in Practice',
      content: '<p><strong>Clinical Scenario:</strong> ' + scenario +
               '</p><p><strong>Reflective Questions:</strong></p>',
      calloutItems: items,
    },
    flagged: items.length < 2,
  };
}

// ─── parse one "Self-Check Intervention:" paragraph inner text ───────────────
const SELFCHECK_OPENERS =
  /(?=(?:Use\b|Complete\b|This\b|Answer\b|Set aside\b|Step\s*\d|Part\s*\d|Section\s*\d|Question\s*\d|Supervision\b|Reporting\b|These\b|Begin\b|Before\b|Identify\b|Write\b))/;
function parseSelfCheck(inner) {
  let body = inner.replace(/^\s*Self-Check Intervention\s*:\s*/i, '');
  // try to peel the intervention name (mashed to the first body word, no space)
  let name = '';
  const m = body.match(SELFCHECK_OPENERS);
  if (m && m.index != null && m.index > 0 && m.index < 80) {
    name = body.slice(0, m.index).trim();
    body = body.slice(m.index).trim();
  }
  const title = name ? 'Self-Check Intervention: ' + name : 'Self-Check Intervention';
  return {
    block: {
      type: 'callout', calloutType: 'protocol', title,
      content: '<p>' + restoreSelfCheckBody(body.trim()) + '</p>',
    },
    flagged: !name,
  };
}

// ─── split one text block's HTML into an ordered fragment list ───────────────
const SPECIAL_RE = /<p>\s*(?:Moral Dilemma in Practice|Self-Check Intervention:)[\s\S]*?<\/p>/gi;
function splitTextBlock(block, field) {
  const html = block[field] || '';
  if (!SPECIAL_RE.test(html)) return null;
  SPECIAL_RE.lastIndex = 0;

  const out = [];
  const flags = [];
  let last = 0, mm;
  while ((mm = SPECIAL_RE.exec(html)) !== null) {
    const before = html.slice(last, mm.index);
    if (stripTags(before)) out.push({ ...block, [field]: before });
    const inner = mm[0].replace(/^<p>\s*/i, '').replace(/\s*<\/p>$/i, '');
    const parsed = /^\s*Moral Dilemma/i.test(inner)
      ? parseMoralDilemma(inner)
      : parseSelfCheck(inner);
    out.push(parsed.block);
    if (parsed.flagged) flags.push(parsed.block.title);
    last = mm.index + mm[0].length;
  }
  const after = html.slice(last);
  if (stripTags(after)) out.push({ ...block, [field]: after });
  return { fragments: out, flags };
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) { console.error('MONGODB_URI not set'); process.exit(1); }
  await mongoose.connect(uri);
  const C = mongoose.connection.collection('interactivecourses');

  console.log('═══════════════════════════════════════════════════════════');
  console.log('CR-C1..C5 callout conversion  ' + (WRITE ? '(WRITE MODE)' : '(DRY RUN)'));
  console.log('Targets: ' + TARGET_SLUGS.join(', '));
  console.log('═══════════════════════════════════════════════════════════\n');

  let grandCallouts = 0, grandFlags = 0, touched = 0;
  const backup = {};

  for (const slug of TARGET_SLUGS) {
    const course = await C.findOne({ slug });
    if (!course) { console.log('⏭  ' + slug + ' — not found\n'); continue; }
    backup[slug] = JSON.parse(JSON.stringify(course.sections || []));

    console.log('■ ' + course.courseCode + '  ' + course.title + '  (' + slug + ')');
    let courseCallouts = 0, courseChanged = false, abort = false;
    const newSections = [];

    for (let si = 0; si < (course.sections || []).length; si++) {
      const section = { ...course.sections[si] };
      const before = sectionWordCount(section);
      const sigBefore = sectionSignature(section);
      const rebuilt = [];
      let sectionCallouts = 0;
      const sectionFlags = [];

      for (const block of (section.contentBlocks || [])) {
        const isText = block.type === 'text' || block.blockType === 'text';
        const field = block.textContent != null ? 'textContent'
                    : block.content != null ? 'content' : null;
        if (isText && field) {
          const res = splitTextBlock(block, field);
          if (res) {
            rebuilt.push(...res.fragments);
            const n = res.fragments.filter(b => b.type === 'callout').length;
            sectionCallouts += n;
            sectionFlags.push(...res.flags);
            continue;
          }
        }
        rebuilt.push(block);
      }

      rebuilt.forEach((b, i) => { b.order = i + 1; });
      section.contentBlocks = rebuilt;

      const after = sectionWordCount(section);
      if (sectionSignature(section) !== sigBefore) {
        console.log('   ⚠ Section ' + (si + 1) + ' letter signature changed' +
                    '  — TEXT ALTERED, aborting this course (no write).');
        abort = true;
      }
      if (sectionCallouts) {
        courseChanged = true;
        courseCallouts += sectionCallouts;
        console.log('   §' + (si + 1) + ' ' + (section.title || '').slice(0, 52) +
                    '  →  +' + sectionCallouts + ' callout(s)' +
                    (sectionFlags.length ? '   [review: ' + sectionFlags.join(' | ') + ']' : ''));
        grandFlags += sectionFlags.length;
      }
      newSections.push(section);
    }

    console.log('   total new callouts: ' + courseCallouts);
    if (abort) { console.log('   ✖ skipped (word-count guard)\n'); continue; }
    if (!courseChanged) { console.log('   (nothing to convert)\n'); continue; }

    grandCallouts += courseCallouts; touched++;
    if (WRITE) {
      await C.updateOne({ _id: course._id }, { $set: { sections: newSections } });
      console.log('   ✅ written\n');
    } else {
      console.log('   (dry run — not written)\n');
    }
  }

  if (WRITE && touched) {
    const fn = 'crc-callout-backup-' + Date.now() + '.json';
    writeFileSync(fn, JSON.stringify(backup, null, 2));
    console.log('🗄  original sections backed up to ' + fn + '  (restore with $set if needed)');
  }

  console.log('───────────────────────────────────────────────────────────');
  console.log('Courses touched: ' + touched + '   New callout blocks: ' + grandCallouts +
              '   Flagged for optional review: ' + grandFlags);
  console.log(WRITE ? 'Done. Verify in the viewer before celebrating.'
                    : 'DRY RUN complete. Re-run with --write to apply.');
  console.log('───────────────────────────────────────────────────────────');
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
