/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */

/**
 * patchTMH601_Stage5d_BlockSizeVariety.js
 * ───────────────────────────────────────
 * Stage 5d — Block-size variety pass.
 *
 * Inserts 18 short standalone text blocks across the course to break up the
 * monotony of uniform-density text blocks. Two block "shapes":
 *
 *   PUNCHLINE — a 1-sentence declaration that frames what's coming.
 *     Visual: centered, Cormorant Garamond italic, burgundy, larger.
 *     Inserted BEFORE a substantive deep-dive block.
 *
 *   PULL-QUOTE — a 1-sentence resonant statement that closes a thread.
 *     Visual: left-bordered blockquote, Cormorant Garamond italic, navy.
 *     Inserted AFTER a substantive deep-dive block.
 *
 * Per section (count = 18 total):
 *   §1   1 punchline + 1 pull-quote
 *   §2   1 punchline + 1 pull-quote
 *   §3   1 punchline + 1 pull-quote
 *   §4   1 punchline
 *   §5   1 pull-quote
 *   §6   1 punchline + 1 pull-quote
 *   §7   1 punchline
 *   §8   1 pull-quote
 *   §9   1 punchline + 1 pull-quote
 *   §10  1 pull-quote
 *   §11  1 punchline
 *   §12  1 punchline + 1 pull-quote
 *   §13  1 pull-quote
 *
 * Idempotency: HTML-comment markers (<!--cr-marker-5d-…-->) on every inserted
 * block. Skipped if the marker is already present in any block of that section.
 * Anchor not found = warning + skip (never insert in the wrong place).
 *
 * Operates on BOTH slugs.
 *
 *   DRY RUN:  node src/scripts/patchTMH601_Stage5d_BlockSizeVariety.js
 *   APPLY:    APPLY=1 node src/scripts/patchTMH601_Stage5d_BlockSizeVariety.js
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
// BRAND-STYLED BLOCK BUILDERS
// Inline styles guarantee visual distinction regardless of viewer CSS.
// Brand palette: burgundy #6B1D34, navy #284157, gold #D4A855.
// Typography: Cormorant Garamond (display).
// ══════════════════════════════════════════════════════════════════════════

function buildPunchline(marker, text) {
  return {
    type: 'text',
    content:
      `<!--cr-marker-5d-${marker}-->\n` +
      `<p style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 1.45em; font-style: italic; ` +
      `color: #6B1D34; text-align: center; margin: 2em 1em; line-height: 1.4; letter-spacing: 0.01em;">` +
      `${text}</p>`,
  };
}

function buildPullquote(marker, text) {
  return {
    type: 'text',
    content:
      `<!--cr-marker-5d-${marker}-->\n` +
      `<blockquote style="border-left: 4px solid #D4A855; padding: 0.5em 0 0.5em 1.5em; ` +
      `margin: 2em 0.5em; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 1.28em; ` +
      `font-style: italic; color: #284157; line-height: 1.5;">${text}</blockquote>`,
  };
}

// ══════════════════════════════════════════════════════════════════════════
// VARIETY BLOCK INSERTIONS
// Each entry: section title regex, anchor content regex, position, kind, text.
// ══════════════════════════════════════════════════════════════════════════

const VARIETY_BLOCKS = [
  // §1 Foundations
  {
    section: /Foundations of Telemental Health/i,
    anchor: /Historical Arc of Distance-Based|delivery of mental health services through electronic/i,
    position: 'before',
    marker: 's1-not-new',
    kind: 'punchline',
    text: "Telemental health is not new. It started in 1959 — six decades before COVID forced everyone's hand.",
  },
  {
    section: /Foundations of Telemental Health/i,
    anchor: /Evidence Base for Telemental Health|meta-analyses|equivalent (?:to|in) outcomes/i,
    position: 'after',
    marker: 's1-90-days',
    kind: 'pullquote',
    text: 'What we built in 90 days during 2020 represents 60 years of accumulated possibility.',
  },

  // §2 Regulatory
  {
    section: /Regulatory Landscape|Regulatory Framework/i,
    anchor: /telemental health practice in the United States|interconnected federal|federal regulatory framework/i,
    position: 'before',
    marker: 's2-50-laws',
    kind: 'punchline',
    text: 'There is no single national telehealth law. There are 50.',
  },
  {
    section: /Regulatory Landscape|Regulatory Framework/i,
    anchor: /Counseling Compact|interstate compact|reciprocity/i,
    position: 'after',
    marker: 's2-driver-license',
    kind: 'pullquote',
    text: 'The Counseling Compact does for counselors what driver licenses do for drivers — recognize one license across many borders.',
  },

  // §3 HIPAA
  {
    section: /HIPAA Compliance/i,
    anchor: /Privacy Rule|Security Rule|covered entit|HIPAA framework/i,
    position: 'before',
    marker: 's3-encryption-baa',
    kind: 'punchline',
    text: 'Encryption is not the same as a BAA. You need both.',
  },
  {
    section: /HIPAA Compliance/i,
    anchor: /breach notification|risk assessment|HIPAA documentation/i,
    position: 'after',
    marker: 's3-paperwork',
    kind: 'pullquote',
    text: 'Most HIPAA violations in private practice are not breaches. They are missing paperwork.',
  },

  // §4 Platforms
  {
    section: /Platform Selection|Digital Security|Technology Selection/i,
    anchor: /selecting a telehealth platform|platform selection criteria|telehealth platform/i,
    position: 'before',
    marker: 's4-consequential',
    kind: 'punchline',
    text: 'The platform decision is the most consequential operational choice in your virtual practice.',
  },

  // §5 Consent
  {
    section: /Informed Consent|Clinical Documentation/i,
    anchor: /signed consent|consent form|documentation standard/i,
    position: 'after',
    marker: 's5-paperwork-not-consent',
    kind: 'pullquote',
    text: 'A consent document the client cannot reach again is not consent. It is paperwork.',
  },

  // §6 Special Populations (moved from old §9 in Stage 4)
  {
    section: /Special Populations|Cultural Considerations/i,
    anchor: /digital divide|technology access|underserved|disparit/i,
    position: 'before',
    marker: 's6-clinical-issue',
    kind: 'punchline',
    text: 'The digital divide is a clinical issue, not an IT one.',
  },
  {
    section: /Special Populations|Cultural Considerations/i,
    anchor: /cultural humility|culturally responsive|cultural competence/i,
    position: 'after',
    marker: 's6-humility-practice',
    kind: 'pullquote',
    text: 'Cultural humility is a practice, not a credential.',
  },

  // §7 Assessment
  {
    section: /Clinical Assessment Adaptations|Assessment.*Telehealth/i,
    anchor: /mental status examination|risk assessment|standardized screening|adapt/i,
    position: 'before',
    marker: 's7-judgment',
    kind: 'punchline',
    text: 'The C-SSRS works through a screen. Your judgment is what makes it work.',
  },

  // §8 Treatment
  {
    section: /Evidence-Based Treatment|Treatment Modifications/i,
    anchor: /exposure|prolonged exposure|PE protocol|in vivo/i,
    position: 'after',
    marker: 's8-exposure-rcts',
    kind: 'pullquote',
    text: 'Exposure therapy was supposed to fail on telehealth. The RCTs say otherwise.',
  },

  // §9 Crisis
  {
    section: /Crisis Intervention/i,
    anchor: /Unique Challenge of Remote Crisis|Crisis intervention in the telehealth environment/i,
    position: 'before',
    marker: 's9-routing',
    kind: 'punchline',
    text: 'Crisis hotlines route to the caller location, not the emergency. Memorize this.',
  },
  {
    section: /Crisis Intervention/i,
    anchor: /maintain calm|therapeutic presence|steady, unhurried/i,
    position: 'after',
    marker: 's9-steady-presence',
    kind: 'pullquote',
    text: 'Your steady presence is the intervention. Until the client is safe — you stay.',
  },

  // §10 Ethics
  {
    section: /Ethical Decision-Making|Ethics in Digital/i,
    anchor: /ACA Code of Ethics|ethical decision|decision-making framework/i,
    position: 'after',
    marker: 's10-floor-ceiling',
    kind: 'pullquote',
    text: 'The ACA Code is your floor, not your ceiling. Cultural humility raises the ceiling.',
  },

  // §11 Interstate
  {
    section: /Interstate Practice|Jurisdictional/i,
    anchor: /Counseling Compact|PSYPACT|jurisdiction|state lines/i,
    position: 'before',
    marker: 's11-where-client-sits',
    kind: 'punchline',
    text: 'The state where the client sits is the state whose law applies. Always.',
  },

  // §12 Building Sustainable Practice
  {
    section: /Building.*Telehealth Practice|Sustaining|Sustainable/i,
    anchor: /burnout|self-care|sustain/i,
    position: 'before',
    marker: 's12-burnout-competence',
    kind: 'punchline',
    text: 'Sustainability is a clinical issue. Burnout breaks competence.',
  },
  {
    section: /Building.*Telehealth Practice|Sustaining|Sustainable/i,
    anchor: /business plan|practice growth|long-term|professional development/i,
    position: 'after',
    marker: 's12-2035',
    kind: 'pullquote',
    text: 'Build the practice you can still be running in 2035.',
  },

  // §13 Conclusion
  {
    section: /Conclusion|Integrating Competent Virtual/i,
    anchor: /integrat|sustain|conclusion|final|going forward/i,
    position: 'after',
    marker: 's13-discipline',
    kind: 'pullquote',
    text: 'Competence in telehealth is not a destination. It is a discipline.',
  },
];

// ══════════════════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════════════════

async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;
  const courses = db.collection('interactivecourses');

  console.log('═'.repeat(78));
  console.log(`  Stage 5d — Block-Size Variety (Punchlines + Pull-Quotes)`);
  console.log(`  Mode: ${APPLY ? 'APPLY (writing changes)' : 'DRY RUN (no writes)'}`);
  console.log('═'.repeat(78));

  for (const slug of SLUGS) {
    console.log(`\n── ${slug.slice(0, 70)}${slug.length > 70 ? '…' : ''}`);
    const course = await courses.findOne({ slug });
    if (!course) { console.log('   ❌ not found'); continue; }
    console.log(`   ${course.sections?.length || 0} sections`);

    let inserted = 0, skippedIdempotent = 0, skippedNoAnchor = 0, skippedNoSection = 0;
    const insertedList = [];
    const warnings = [];

    for (const entry of VARIETY_BLOCKS) {
      // Find section
      const sectionIdx = (course.sections || []).findIndex(s => entry.section.test(s.title || ''));
      if (sectionIdx === -1) {
        skippedNoSection++;
        warnings.push(`§? ${entry.marker}: section title did not match /${entry.section.source}/`);
        continue;
      }
      const section = course.sections[sectionIdx];

      // Idempotency: skip if marker already present anywhere in section
      const markerStr = `cr-marker-5d-${entry.marker}`;
      const alreadyPresent = (section.contentBlocks || []).some(b =>
        typeof b.content === 'string' && b.content.includes(markerStr)
      );
      if (alreadyPresent) {
        skippedIdempotent++;
        continue;
      }

      // Find anchor block
      const anchorIdx = (section.contentBlocks || []).findIndex(b =>
        b.type === 'text' && b.content && entry.anchor.test(b.content)
      );
      if (anchorIdx === -1) {
        skippedNoAnchor++;
        warnings.push(`§${sectionIdx + 1} ${entry.marker}: anchor not found in section "${section.title}"`);
        continue;
      }

      // Build the new block
      const newBlock = entry.kind === 'punchline'
        ? buildPunchline(entry.marker, entry.text)
        : buildPullquote(entry.marker, entry.text);

      // Insert before or after the anchor
      const insertAt = entry.position === 'before' ? anchorIdx : anchorIdx + 1;
      section.contentBlocks.splice(insertAt, 0, newBlock);
      inserted++;
      insertedList.push(`§${sectionIdx + 1} ${entry.kind} ${entry.marker} (at block ${insertAt})`);
    }

    console.log(`   Inserted:           ${inserted}`);
    console.log(`   Skipped (already done): ${skippedIdempotent}`);
    console.log(`   Skipped (no anchor):    ${skippedNoAnchor}`);
    console.log(`   Skipped (no section):   ${skippedNoSection}`);

    if (insertedList.length) {
      console.log('   Inserted blocks:');
      for (const it of insertedList) console.log(`     • ${it}`);
    }
    if (warnings.length) {
      console.log('   Warnings:');
      for (const w of warnings) console.log(`     • ${w}`);
    }

    // Sanity check: count 5d markers post-pass
    let markersPresent = 0;
    for (const s of (course.sections || [])) {
      for (const b of (s.contentBlocks || [])) {
        if (typeof b.content === 'string') {
          markersPresent += (b.content.match(/cr-marker-5d-/g) || []).length;
        }
      }
    }
    console.log(`   POST-PASS: ${markersPresent} Stage-5d markers present in course`);

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
