/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */

/**
 * patchTMH601_RestructureSections_CleanOnly.js
 * ───────────────────────────────────────────
 * Stage 4 — single-slug variant. Runs the section restructure (§9 → §6) and
 * §2/§11 dedup against the clean slug ONLY. The mkkycoyo slug is a different
 * course with a different section structure; it gets handled separately via
 * the sync script.
 *
 *   cd ~/project/src/server
 *   node src/scripts/patchTMH601_RestructureSections_CleanOnly.js              # dry
 *   APPLY=1 node src/scripts/patchTMH601_RestructureSections_CleanOnly.js      # write
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in env');
  process.exit(1);
}
const APPLY = process.env.APPLY === '1';

// Single slug only — mkkycoyo is handled by syncTMH601_CleanToMkkycoyo.js
const TARGET_SLUGS = ['mastering-telemental-health'];

function findSpecialPopulationsIndex(sections) {
  return sections.findIndex(s =>
    typeof s.title === 'string' && /special\s+populations/i.test(s.title)
  );
}

function renumberSections(sections) {
  let updates = 0;
  sections.forEach((section, i) => {
    const newNumber = i + 1;
    if ('order' in section && section.order !== newNumber) {
      section.order = newNumber;
      updates++;
    }
    const divider = (section.contentBlocks || []).find(b => b.type === 'sectionDivider');
    if (divider) {
      if (divider.sectionNumber !== newNumber) {
        divider.sectionNumber = newNumber;
        updates++;
      }
      const newTitle = `Section ${newNumber}`;
      if (divider.title !== newTitle) {
        divider.title = newTitle;
        updates++;
      }
    }
  });
  return updates;
}

function reorderSections(course) {
  const sections = [...(course.sections || [])];
  const popsIdx = findSpecialPopulationsIndex(sections);
  if (popsIdx === 5) return { changed: false, popsFrom: 5, popsTo: 5 };
  if (popsIdx < 0) return { changed: false, error: 'Special Populations section not found' };
  const [popsSection] = sections.splice(popsIdx, 1);
  sections.splice(5, 0, popsSection);
  const renumberCount = renumberSections(sections);
  course.sections = sections;
  return { changed: true, popsFrom: popsIdx + 1, popsTo: 6, renumberOps: renumberCount };
}

const DEDUP_MARKER = 'cr-marker-s2-s11-interstate-dedup';

function dedupS2InterstateContent(s2Section) {
  if (!s2Section || !Array.isArray(s2Section.contentBlocks)) return { changed: false };
  let changedBlocks = 0;
  s2Section.contentBlocks.forEach(block => {
    const field = block.content !== undefined ? 'content' : (block.textContent !== undefined ? 'textContent' : null);
    if (!field) return;
    const html = block[field] || '';
    if (html.includes(DEDUP_MARKER)) return;
    let modified = html;
    let didModify = false;
    const pA = /\s*<p>\s*Regarding telehealth practice specifically[\s\S]*?the state where the counselor maintains a license or physical office\.\s*<\/p>/;
    if (pA.test(modified)) {
      modified = modified.replace(
        pA,
        `\n<p><!--${DEDUP_MARKER}-->Regarding telehealth practice specifically, the Georgia Board has adopted regulations that largely align with the prevailing national framework. Georgia-licensed counselors may provide telehealth services to clients located within the state of Georgia without additional authorization beyond their existing LPC license. <strong>The jurisdictional question of which state's law governs when clients are physically located outside Georgia — including the client-location rule, the Counseling Compact, PSYPACT, and the full interstate framework — is covered in detail in §11 (Interstate Practice, Compacts, and Jurisdictional Navigation).</strong></p>`
      );
      didModify = true;
    }
    const pB = /\s*<p>\s*This client-location principle has profound implications[\s\S]*?disciplinary action by either or both state boards involved\.\s*<\/p>/;
    if (pB.test(modified)) {
      modified = modified.replace(pB, '');
      didModify = true;
    }
    if (didModify) {
      block[field] = modified;
      changedBlocks++;
    }
  });
  return { changed: changedBlocks > 0, blockEdits: changedBlocks };
}

async function main() {
  console.log('═'.repeat(64));
  console.log('  CR-TMH601 Stage 4 (CLEAN SLUG ONLY) — Restructure + §2/§11 Dedup');
  console.log('  Mode:', APPLY ? 'APPLY' : 'DRY RUN');
  console.log('═'.repeat(64));

  await mongoose.connect(MONGODB_URI);
  console.log('✓ Connected to MongoDB');
  const db = mongoose.connection.db;
  const collection = db.collection('interactivecourses');

  for (const slug of TARGET_SLUGS) {
    console.log(`\n── slug: ${slug}`);
    const course = await collection.findOne({ slug });
    if (!course) {
      console.log('  (not found — skipping)');
      continue;
    }
    console.log(`  Found: "${course.title}" (${course.sections?.length || 0} sections)`);

    const reorderResult = reorderSections(course);
    const s2Idx = (course.sections || []).findIndex(s =>
      typeof s.title === 'string' && /Regulatory Landscape/i.test(s.title)
    );
    const dedupResult = s2Idx >= 0 ? dedupS2InterstateContent(course.sections[s2Idx]) : { changed: false };

    if (reorderResult.changed) {
      console.log(`  [reorder] Special Populations: §${reorderResult.popsFrom} → §${reorderResult.popsTo}`);
      console.log(`  [reorder] sectionDivider/order updates: ${reorderResult.renumberOps}`);
    } else if (reorderResult.error) {
      console.log(`  [reorder] skipped: ${reorderResult.error}`);
    } else {
      console.log(`  [reorder] no-op — already in target order`);
    }

    if (dedupResult.changed) {
      console.log(`  [dedup]   §2 interstate paragraphs replaced (${dedupResult.blockEdits} block edited)`);
    } else {
      console.log(`  [dedup]   no-op`);
    }

    if (reorderResult.changed) {
      console.log('  New order:');
      course.sections.forEach((s, i) => console.log(`    ${i + 1}. ${s.title}`));
    }

    if (!reorderResult.changed && !dedupResult.changed) {
      console.log('  ✓ Nothing to do.');
      continue;
    }

    if (!APPLY) {
      console.log('  (dry run)');
      continue;
    }

    const result = await collection.updateOne(
      { slug },
      { $set: { sections: course.sections, updatedAt: new Date() } }
    );
    console.log(`  ✓ Written. matched=${result.matchedCount} modified=${result.modifiedCount}`);
  }

  await mongoose.disconnect();
  console.log('\n✓ Done.');
}

main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
