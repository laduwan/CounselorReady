/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */

/**
 * patchTMH601_Stage5g_HeadingRescue.js
 * ────────────────────────────────────
 * Stage 5g — Surgical heading hierarchy cleanup.
 *
 * PASS 1 — Promote 3 specific <h3> → <h2> for headings that peer with H2 siblings
 *          (Stage 1's bold-to-h3 conversion landed them at the wrong level)
 *            • §1: "The Pandemic Catalyst: COVID-19 and the Transformation of Mental Health Delivery"
 *            • §1: "Competency Standards for Telemental Health Practitioners"
 *            • §2: "Georgia Rule 135-11: TeleMental Health --- The Complete Regulatory Framework"
 *
 * PASS 2 — Strip 4 redundant <h3>Section N: ...</h3> openers inside first text blocks
 *          (they duplicate the sectionDivider that appears immediately above)
 *            Matches: <h3>Section \d+: [anything]</h3>
 *
 * PASS 3 — Strip 2 specific docx stubs Stage 1's strip-list missed
 *            • §12 first block: <p>for Long-Term Virtual Practice*</p>
 *            • §13 first block: <p>Continued Growth*</p>
 *
 * Operates on BOTH slugs. Every pass is idempotent (string-replace on known patterns).
 *
 *   DRY RUN:  node src/scripts/patchTMH601_Stage5g_HeadingRescue.js
 *   APPLY:    APPLY=1 node src/scripts/patchTMH601_Stage5g_HeadingRescue.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const APPLY = process.env.APPLY === '1';
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('❌ MONGODB_URI not set'); process.exit(1); }

const SLUGS = [
  'mastering-telemental-health',
  'mastering-telemental-health-an-essential-guide-to-a-compliant-virtual-healthcare-practice-in-georgia-mkkycoyo',
];

// ══════════════════════════════════════════════════════════════════════════
// PASS 1 — Specific <h3> → <h2> promotions
// Defensive: also catches the markdown-bold pre-Stage-1 form, in case any
// instance escaped Stage 1's regex due to whitespace/escape edge cases.
// ══════════════════════════════════════════════════════════════════════════
const H3_TO_H2_PROMOTIONS = [
  {
    text: 'The Pandemic Catalyst: COVID-19 and the Transformation of Mental Health Delivery',
    label: '§1 Pandemic Catalyst',
  },
  {
    text: 'Competency Standards for Telemental Health Practitioners',
    label: '§1 Competency Standards',
  },
  {
    text: 'Georgia Rule 135-11: TeleMental Health --- The Complete Regulatory Framework',
    label: '§2 GA Rule 135-11',
  },
];

// ══════════════════════════════════════════════════════════════════════════
// PASS 2 — Strip redundant <h3>Section N: ...</h3>
// Pattern matches any "Section <digits>: <anything except </>" in an h3.
// Idempotency: just a no-op replace if nothing matches.
// ══════════════════════════════════════════════════════════════════════════
const REDUNDANT_SECTION_HEADER = /<h3>Section \d+:[^<]+<\/h3>\s*/g;
// Also handle the pre-Stage-1 markdown form as defensive cleanup
const REDUNDANT_SECTION_HEADER_MD = /<p>\s*\*\*Section \d+:[^*]+\*\*\s*<\/p>\s*/g;

// ══════════════════════════════════════════════════════════════════════════
// PASS 3 — Strip specific docx stubs Stage 1 missed
// Exact string match — safer than a generic <p>...*</p> regex
// (which could catch legitimate footnote markers).
// ══════════════════════════════════════════════════════════════════════════
const DOCX_STUBS_TO_STRIP = [
  '<p>for Long-Term Virtual Practice*</p>',
  '<p>Continued Growth*</p>',
];

// ══════════════════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════════════════

function escRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Apply all Pass 1 promotions to an HTML string. Returns { html, count }.
 * Handles BOTH:
 *   <h3>Text</h3>             →  <h2>Text</h2>
 *   <p>**Text**</p>            →  <h2>Text</h2>   (defensive — pre-Stage-1 form)
 */
function applyH3toH2(html) {
  if (!html || typeof html !== 'string') return { html, count: 0 };
  let count = 0;
  let out = html;
  for (const { text } of H3_TO_H2_PROMOTIONS) {
    const escTxt = escRe(text);
    // <h3>...</h3> form
    const h3Re = new RegExp(`<h3>${escTxt}</h3>`, 'g');
    out = out.replace(h3Re, () => { count++; return `<h2>${text}</h2>`; });
    // Defensive: <p>**...**</p> form
    const mdRe = new RegExp(`<p>\\s*\\*\\*${escTxt}\\*\\*\\s*</p>`, 'g');
    out = out.replace(mdRe, () => { count++; return `<h2>${text}</h2>`; });
  }
  return { html: out, count };
}

/**
 * Strip redundant <h3>Section N:...</h3> openers. Returns { html, count }.
 */
function stripRedundantSectionHeaders(html) {
  if (!html || typeof html !== 'string') return { html, count: 0 };
  let count = 0;
  let out = html.replace(REDUNDANT_SECTION_HEADER, () => {
    count++;
    return '';
  });
  out = out.replace(REDUNDANT_SECTION_HEADER_MD, () => {
    count++;
    return '';
  });
  return { html: out, count };
}

/**
 * Strip specific docx stubs from an HTML string. Returns { html, count }.
 */
function stripDocxStubs(html) {
  if (!html || typeof html !== 'string') return { html, count: 0 };
  let count = 0;
  let out = html;
  for (const stub of DOCX_STUBS_TO_STRIP) {
    const re = new RegExp(escRe(stub) + '\\s*', 'g');
    out = out.replace(re, () => { count++; return ''; });
  }
  return { html: out, count };
}

// ══════════════════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════════════════

async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;
  const courses = db.collection('interactivecourses');

  console.log('═'.repeat(78));
  console.log(`  Stage 5g — Heading Hierarchy Rescue`);
  console.log(`  Mode: ${APPLY ? 'APPLY (writing changes)' : 'DRY RUN (no writes)'}`);
  console.log('═'.repeat(78));

  for (const slug of SLUGS) {
    console.log(`\n── ${slug.slice(0, 70)}${slug.length > 70 ? '…' : ''}`);
    const course = await courses.findOne({ slug });
    if (!course) { console.log('   ❌ not found'); continue; }
    console.log(`   ${course.sections?.length || 0} sections`);

    let pass1 = 0, pass2 = 0, pass3 = 0;
    const blocksTouched = new Set();

    for (let sIdx = 0; sIdx < (course.sections || []).length; sIdx++) {
      const section = course.sections[sIdx];
      for (let bIdx = 0; bIdx < (section.contentBlocks || []).length; bIdx++) {
        const block = section.contentBlocks[bIdx];
        if (block.type !== 'text' || !block.content) continue;

        let workingHtml = block.content;
        let touchedThisBlock = false;

        // Pass 1
        const r1 = applyH3toH2(workingHtml);
        if (r1.count > 0) {
          workingHtml = r1.html;
          pass1 += r1.count;
          touchedThisBlock = true;
        }

        // Pass 2
        const r2 = stripRedundantSectionHeaders(workingHtml);
        if (r2.count > 0) {
          workingHtml = r2.html;
          pass2 += r2.count;
          touchedThisBlock = true;
        }

        // Pass 3
        const r3 = stripDocxStubs(workingHtml);
        if (r3.count > 0) {
          workingHtml = r3.html;
          pass3 += r3.count;
          touchedThisBlock = true;
        }

        if (touchedThisBlock) {
          block.content = workingHtml;
          blocksTouched.add(`§${sIdx + 1}-b${bIdx}`);
        }
      }
    }

    console.log(`   PASS 1 (h3→h2):              +${pass1} promotions`);
    console.log(`   PASS 2 (redundant Section N): +${pass2} stripped`);
    console.log(`   PASS 3 (docx stubs):          +${pass3} stripped`);
    console.log(`   Blocks touched:               ${blocksTouched.size}`);

    if (blocksTouched.size > 0) {
      console.log(`   Touched: ${[...blocksTouched].join(', ')}`);
    }

    // Sanity check post-pass
    let h2Count = 0, h3Count = 0, remainingStubs = 0, remainingSectionH3 = 0;
    for (const s of (course.sections || [])) {
      for (const b of (s.contentBlocks || [])) {
        if (typeof b.content === 'string') {
          h2Count += (b.content.match(/<h2>/g) || []).length;
          h3Count += (b.content.match(/<h3>/g) || []).length;
          remainingSectionH3 += (b.content.match(/<h3>Section \d+:/g) || []).length;
          for (const stub of DOCX_STUBS_TO_STRIP) {
            if (b.content.includes(stub)) remainingStubs++;
          }
        }
      }
    }
    console.log(`   POST-PASS: ${h2Count} <h2>, ${h3Count} <h3>, ${remainingSectionH3} redundant section-headers remaining, ${remainingStubs} docx stubs remaining`);

    if (APPLY) {
      const res = await courses.updateOne({ slug }, { $set: { sections: course.sections } });
      console.log(`   ✓ ${res.modifiedCount > 0 ? 'WROTE' : 'no-op'} (matched ${res.matchedCount}, modified ${res.modifiedCount})`);
    } else {
      console.log('   DRY RUN — not writing');
    }
  }

  await mongoose.disconnect();
  console.log('\n✓ Done.');
}

main().catch(err => { console.error('❌ Error:', err); process.exit(1); });
