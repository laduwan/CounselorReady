/**
 * fixBulletHeavyCourses.js
 *
 * Converts <ul><li> bullet patterns to flowing prose paragraphs in text blocks
 * for the three bullet-heavy courses flagged by auditIntrosConclusions.js:
 *
 *   neurobiology-of-trauma         (CR-418, 55% bullets, 478li/387p)
 *   trauma-informed-care           (CR-419, 60% bullets, 498li/332p)
 *   active-listening-skills        (CR-406, 59% bullets, 70li/48p)
 *
 * Conversion rules (applied in order):
 *   1. <p><strong>Label:</strong></p> + <ul>...</ul>
 *      → <p><strong>Label:</strong> item1, item2, and item3.</p>
 *   2. <p>Sentence ending in colon:</p> + <ul>...</ul>
 *      → <p>Sentence ending in colon: item1, item2, and item3.</p>
 *   3. Remaining <ul>...</ul>
 *      → series of <p>item.</p> paragraphs
 *
 * Ordered lists (<ol>) and single <li> items in structured exercises
 * are preserved — the goal is to convert informational bullet lists,
 * not destroy intentional enumeration.
 *
 * Uses raw updateOne/$set — never .save()
 *
 * Usage:
 *   node src/scripts/fixBulletHeavyCourses.js          # dry-run
 *   node src/scripts/fixBulletHeavyCourses.js --apply  # write
 */

import 'dotenv/config';
import mongoose from 'mongoose';

const APPLY = process.argv.includes('--apply');
const DRY   = !APPLY;
if (!process.env.MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }

const TARGETS = [
  'neurobiology-of-trauma',
  'trauma-informed-care',
  'active-listening-skills',
];

// ── Conversion engine ────────────────────────────────────────────────────────

function getLiItems(ulHtml) {
  const items = [];
  const re = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let m;
  while ((m = re.exec(ulHtml)) !== null) {
    const text = m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (text) items.push(text);
  }
  return items;
}

function joinItems(items) {
  const cleaned = items.map(i => i.replace(/\.$/, ''));
  if (!cleaned.length) return '';
  if (cleaned.length === 1) return cleaned[0];
  if (cleaned.length === 2) return `${cleaned[0]} and ${cleaned[1]}`;
  return cleaned.slice(0, -1).join(', ') + `, and ${cleaned[cleaned.length - 1]}`;
}

function convertBulletsToP(html) {
  // Only convert <ul> — preserve <ol> (ordered/numbered lists are intentional)
  let result = html;

  // Pattern 1: <p><strong>Label:?</strong></p>\n<ul>...</ul>
  result = result.replace(
    /<p>\s*(<strong>[^<]+:?\s*<\/strong>)\s*<\/p>\s*<ul>([\s\S]*?)<\/ul>/gi,
    (_, label, ulContent) => {
      const items = getLiItems(ulContent);
      if (!items.length) return _;
      return `<p>${label} ${joinItems(items)}.</p>`;
    }
  );

  // Pattern 2: <p>Text ending in colon:</p>\n<ul>...</ul>
  result = result.replace(
    /<p>([^<]{12,}?:)\s*<\/p>\s*<ul>([\s\S]*?)<\/ul>/gi,
    (_, intro, ulContent) => {
      const items = getLiItems(ulContent);
      if (!items.length) return _;
      const cleanIntro = intro.replace(/:$/, '');
      return `<p>${cleanIntro}: ${joinItems(items)}.</p>`;
    }
  );

  // Pattern 3: orphaned <ul>...</ul> → series of <p> items
  result = result.replace(
    /<ul>([\s\S]*?)<\/ul>/gi,
    (_, ulContent) => {
      const items = getLiItems(ulContent);
      if (!items.length) return '';
      if (items.length === 1) return `<p>${items[0]}.</p>`;
      return items.map(i => `<p>${i}.</p>`).join('\n');
    }
  );

  return result;
}

function countLi(html) {
  return ((html || '').match(/<li\b/gi) || []).length;
}

function countP(html) {
  return ((html || '').match(/<p\b/gi) || []).length;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('interactivecourses');

  console.log('\n' + '='.repeat(72));
  console.log('fixBulletHeavyCourses — ' + (DRY ? 'DRY RUN' : 'APPLYING WRITES'));
  console.log('='.repeat(72) + '\n');

  for (const slug of TARGETS) {
    const course = await col.findOne({ slug });
    if (!course) { console.log(`NOT FOUND: ${slug}`); continue; }

    const sections = course.sections || [];
    let totalLiBefore = 0, totalLiAfter = 0;
    let totalPBefore  = 0, totalPAfter  = 0;
    let blocksChanged = 0;

    const patchedSections = sections.map(sec => {
      const patchedBlocks = (sec.contentBlocks || []).map(block => {
        if (block.type !== 'text' && block.type !== 'imageText') return block;
        const content = block.content || block.textContent || '';
        if (!countLi(content)) return block; // nothing to convert

        totalLiBefore += countLi(content);
        totalPBefore  += countP(content);

        const converted = convertBulletsToP(content);

        totalLiAfter += countLi(converted);
        totalPAfter  += countP(converted);

        if (converted !== content) {
          blocksChanged++;
          // Patch whichever field has the content
          if (block.content !== undefined) return { ...block, content: converted };
          return { ...block, textContent: converted };
        }
        return block;
      });
      return { ...sec, contentBlocks: patchedBlocks };
    });

    const liPctBefore = totalPBefore + totalLiBefore > 0
      ? Math.round(totalLiBefore / (totalPBefore + totalLiBefore) * 100) : 0;
    const liPctAfter = totalPAfter + totalLiAfter > 0
      ? Math.round(totalLiAfter / (totalPAfter + totalLiAfter) * 100) : 0;

    console.log(`${course.courseCode || '?'} — ${course.title}`);
    console.log(`  Before: ${totalLiBefore} li / ${totalPBefore} p = ${liPctBefore}% bullets`);
    console.log(`  After:  ${totalLiAfter} li / ${totalPAfter} p = ${liPctAfter}% bullets`);
    console.log(`  Blocks modified: ${blocksChanged}`);

    if (blocksChanged === 0) {
      console.log('  Nothing to convert.\n');
      continue;
    }

    if (!DRY) {
      const result = await col.updateOne(
        { _id: course._id },
        { $set: { sections: patchedSections, updatedAt: new Date() } }
      );
      if (result.modifiedCount === 1) {
        // Read-back verify
        const rb = await col.findOne({ _id: course._id }, { projection: { sections: 1 } });
        let rbLi = 0, rbP = 0;
        (rb.sections || []).forEach(s =>
          (s.contentBlocks || []).forEach(b => {
            const c = b.content || b.textContent || '';
            rbLi += countLi(c); rbP += countP(c);
          })
        );
        const rbPct = rbP + rbLi > 0 ? Math.round(rbLi / (rbP + rbLi) * 100) : 0;
        console.log(`  ✅ WRITTEN — read-back: ${rbLi} li / ${rbP} p = ${rbPct}% bullets`);
      } else {
        console.error(`  ❌ WRITE FAILED`);
      }
    }
    console.log();
  }

  console.log('='.repeat(72));
  if (DRY) console.log('Re-run with --apply to write.');
  console.log('='.repeat(72) + '\n');

  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
