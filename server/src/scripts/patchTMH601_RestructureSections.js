/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */

/**
 * patchTMH601_RestructureSections.js
 * ──────────────────────────────────
 * Stage 4 of the Mastering TeleMental Health (CR-TMH601) cleanup.
 * Structural restructure — moves §9 forward to between §5 and §6, and
 * deduplicates interstate-practice content between §2 and §11.
 *
 * WHAT THIS CHANGES
 * ─────────────────
 * 1. SECTION REORDER — Special Populations moves up
 *    Old order:                          New order:
 *      §5  Informed Consent                §5  Informed Consent
 *      §6  Clinical Assessment             §6  Special Populations & Cultural Considerations
 *      §7  Evidence-Based Treatment        §7  Clinical Assessment
 *      §8  Crisis Intervention             §8  Evidence-Based Treatment
 *      §9  Special Populations             §9  Crisis Intervention
 *      §10 Ethical Decision-Making         §10 Ethical Decision-Making  (unchanged)
 *      …                                   …                           (unchanged)
 *
 *    Rationale: a clinician needs to know WHO will be on the screen before
 *    designing assessment, treatment, and crisis protocols. Population
 *    considerations are foundational — they should frame the clinical
 *    sections that follow, not trail them.
 *
 *    Side effects handled in this patch:
 *      • Each section's `sectionDivider` block has its sectionNumber and
 *        title ("Section N") updated to the new position
 *      • Each section's `order` field (if present) is rewritten to the new
 *        1-based position
 *
 * 2. §2 / §11 INTERSTATE DEDUP
 *    §2 currently re-explains the client-location rule, the Counseling
 *    Compact concept, and the cross-state-vacation-client scenario — all
 *    of which §11 covers in depth. We replace those §2 paragraphs with
 *    one consolidated paragraph that points to §11 for the deep dive.
 *
 *    Removes approximately 1.3KB of redundant prose without losing any
 *    substantive content; §11's coverage is the canonical source.
 *
 * SAFETY: USER PROGRESS
 * ─────────────────────
 * Section progress is tracked by numeric sectionIndex in the
 * `interactivecourseprogresses` collection. Reordering corrupts that
 * mapping for any in-progress user. This patch:
 *   (a) Counts in-progress users for this course BEFORE applying.
 *   (b) If any are found, refuses to apply unless FORCE_REORDER=1.
 *   (c) Once applied, the new section order is the canonical order;
 *       new enrollments after this patch will be aligned correctly.
 *
 * RUN
 * ───
 *   cd ~/project/src/server
 *   node src/scripts/patchTMH601_RestructureSections.js              # dry run
 *   APPLY=1 node src/scripts/patchTMH601_RestructureSections.js      # write
 *   FORCE_REORDER=1 APPLY=1 node ...                                 # override active-users check
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
const FORCE_REORDER = process.env.FORCE_REORDER === '1';

const TARGET_SLUGS = [
  'mastering-telemental-health-an-essential-guide-to-a-compliant-virtual-healthcare-practice-in-georgia-mkkycoyo',
  'mastering-telemental-health',
];

// ════════════════════════════════════════════════════════════════════
// PART 1 — Section reorder helpers
// ════════════════════════════════════════════════════════════════════

// Find the index of the Special Populations section by title match (robust to
// minor wording variation, but case-insensitive).
function findSpecialPopulationsIndex(sections) {
  return sections.findIndex(s =>
    typeof s.title === 'string' && /special\s+populations/i.test(s.title)
  );
}

// After reorder, walk every section and rewrite the sectionDivider block to
// reflect its new 1-based position. Returns count of updates.
function renumberSections(sections) {
  let updates = 0;
  sections.forEach((section, i) => {
    const newNumber = i + 1;
    // Update section.order if present
    if ('order' in section && section.order !== newNumber) {
      section.order = newNumber;
      updates++;
    }
    // Update sectionDivider block
    const divider = (section.contentBlocks || []).find(b => b.type === 'sectionDivider');
    if (divider) {
      if (divider.sectionNumber !== newNumber) {
        divider.sectionNumber = newNumber;
        updates++;
      }
      // title is typically "Section N"
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

  // Already reordered?
  if (popsIdx === 5) {
    return { changed: false, popsFrom: 5, popsTo: 5 };
  }
  if (popsIdx < 0) {
    return { changed: false, error: 'Special Populations section not found' };
  }

  // Remove from current position, insert at new index 5 (between Informed
  // Consent at idx 4 and the rest of the clinical block).
  const [popsSection] = sections.splice(popsIdx, 1);
  sections.splice(5, 0, popsSection);

  const renumberCount = renumberSections(sections);

  course.sections = sections;
  return {
    changed: true,
    popsFrom: popsIdx + 1,
    popsTo: 6,
    renumberOps: renumberCount,
  };
}

// ════════════════════════════════════════════════════════════════════
// PART 2 — §2 / §11 dedup
// ════════════════════════════════════════════════════════════════════

// The two paragraphs in §2 that duplicate §11. Match by distinctive
// substrings so the find-and-replace is precise.
const DEDUP_MARKER = 'cr-marker-s2-s11-interstate-dedup';

// Reconstructed: §2 currently contains a 4-paragraph stretch covering
// Georgia's framework + the client-location rule + the traveling-client
// implication. We replace the part that overlaps §11 with a pointer.
function dedupS2InterstateContent(s2Section) {
  if (!s2Section || !Array.isArray(s2Section.contentBlocks)) {
    return { changed: false };
  }

  // Find the text block that contains "client-location principle" — that's
  // the duplicative stretch. (The first paragraph of §11 also references
  // this principle by name; in §2 it leads into the traveling-client
  // example.)
  let changedBlocks = 0;
  s2Section.contentBlocks.forEach(block => {
    const field = block.content !== undefined ? 'content' : (block.textContent !== undefined ? 'textContent' : null);
    if (!field) return;
    const html = block[field] || '';

    // Already deduped?
    if (html.includes(DEDUP_MARKER)) return;

    // The two specific paragraphs to replace:
    //   (a) the "...critical regulatory principle... client-location..." paragraph
    //   (b) the "...Florida vacation... profound implications..." paragraph
    // Match each independently in case they were further edited by a prior pass.

    let modified = html;
    let didModify = false;

    // Paragraph (a): "The critical regulatory principle governing interstate
    // practice is that a counselor must be licensed or otherwise authorized
    // to practice in the state where the client is physically located..."
    const pA = /\s*<p>\s*Regarding telehealth practice specifically[\s\S]*?the state where the counselor maintains a license or physical office\.\s*<\/p>/;
    if (pA.test(modified)) {
      modified = modified.replace(
        pA,
        `\n<p><!--${DEDUP_MARKER}-->Regarding telehealth practice specifically, the Georgia Board has adopted regulations that largely align with the prevailing national framework. Georgia-licensed counselors may provide telehealth services to clients located within the state of Georgia without additional authorization beyond their existing LPC license. <strong>The jurisdictional question of which state's law governs when clients are physically located outside Georgia — including the client-location rule, the Counseling Compact, PSYPACT, and the full interstate framework — is covered in detail in §11 (Interstate Practice, Compacts, and Jurisdictional Navigation).</strong></p>`
      );
      didModify = true;
    }

    // Paragraph (b): "This client-location principle has profound implications
    // for Georgia counselors who serve military families..." — duplicates §11's
    // traveling-client coverage. Strip this paragraph entirely.
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

// ════════════════════════════════════════════════════════════════════
// PART 3 — in-progress user safety check
// ════════════════════════════════════════════════════════════════════
async function countActiveProgress(db, courseId) {
  // CourseProgress is in 'interactivecourseprogresses' collection per
  // mongoose.model('InteractiveCourseProgress', ...).
  return db.collection('interactivecourseprogresses').countDocuments({
    courseId: courseId,
    'sectionProgress.status': 'in_progress',
  });
}

// ════════════════════════════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════════════════════════════
async function main() {
  console.log('═'.repeat(64));
  console.log('  CR-TMH601 Stage 4 — SECTION RESTRUCTURE + §2/§11 DEDUP');
  console.log('  Mode:', APPLY ? 'APPLY' : 'DRY RUN');
  if (FORCE_REORDER) console.log('  FORCE_REORDER=1 (will reorder even if in-progress users exist)');
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

    // ── Safety check ──
    const activeCount = await countActiveProgress(db, course._id);
    if (activeCount > 0) {
      console.log(`  ⚠ Active in-progress user records for this course: ${activeCount}`);
      if (!FORCE_REORDER) {
        console.log('  Refusing to reorder. Use FORCE_REORDER=1 to override (will misalign existing progress).');
        console.log('  Doing the dedup-only edit instead (safe regardless).');
      }
    } else {
      console.log(`  ✓ No in-progress user records — reorder is safe.`);
    }

    const willReorder = activeCount === 0 || FORCE_REORDER;

    // Snapshot pre-state for the report
    const titlesBefore = (course.sections || []).map((s, i) => `${i + 1}. ${s.title}`);

    // ── PART 1: reorder ──
    let reorderResult = { changed: false, popsFrom: null, popsTo: null };
    if (willReorder) {
      reorderResult = reorderSections(course);
    }

    // ── PART 2: §2 dedup ──
    const s2Idx = (course.sections || []).findIndex(s =>
      typeof s.title === 'string' && /Regulatory Landscape/i.test(s.title)
    );
    let dedupResult = { changed: false, blockEdits: 0 };
    if (s2Idx >= 0) {
      dedupResult = dedupS2InterstateContent(course.sections[s2Idx]);
    }

    // ── Report ──
    if (reorderResult.changed) {
      console.log(`  [reorder] Special Populations: §${reorderResult.popsFrom} → §${reorderResult.popsTo}`);
      console.log(`  [reorder] sectionDivider/order field updates: ${reorderResult.renumberOps}`);
    } else if (reorderResult.error) {
      console.log(`  [reorder] skipped: ${reorderResult.error}`);
    } else if (!willReorder) {
      console.log(`  [reorder] skipped (active-users guard)`);
    } else {
      console.log(`  [reorder] no-op — sections already in target order`);
    }

    if (dedupResult.changed) {
      console.log(`  [dedup]   §2 interstate paragraphs replaced (${dedupResult.blockEdits} block edited)`);
    } else {
      console.log(`  [dedup]   no-op — §2 already deduped or expected paragraphs not found`);
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
      console.log('  (dry run — no write performed)');
      continue;
    }

    const result = await collection.updateOne(
      { slug },
      { $set: { sections: course.sections, updatedAt: new Date() } }
    );
    console.log(`  ✓ Written. matched=${result.matchedCount} modified=${result.modifiedCount}`);

    // Verify
    const verify = await collection.findOne({ slug }, { projection: { sections: 1 } });
    const popsNew = findSpecialPopulationsIndex(verify.sections);
    const s2 = verify.sections.find(s => /Regulatory Landscape/i.test(s.title));
    const s2Text = (s2?.contentBlocks || []).map(b => b.content || b.textContent || '').join('');
    console.log(`  Verification: Special Populations at index ${popsNew} (=position ${popsNew + 1})`);
    console.log(`  Verification: §2 dedup marker present: ${s2Text.includes(DEDUP_MARKER)}`);
  }

  await mongoose.disconnect();
  console.log('\n✓ Done.');
}

main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
