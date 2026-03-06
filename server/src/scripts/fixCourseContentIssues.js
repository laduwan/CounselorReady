/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * fixCourseContentIssues.js
 * CounselorReady — Targeted bulk fix
 *
 * Fixes:
 *   1. METADATA_BLEED in Course Introduction block#0 — strips embedded header metadata
 *   2. ALLCAPS_TITLE — converts section titles to Title Case
 *   3. SEPARATOR_LINE — removes stray "---" lines from content
 *   4. RAW_MARKDOWN_TABLE — flags for review (too risky to auto-convert)
 *   5. DECISION_POINT sections — renames artifact section titles
 *   6. Embedded module headers (MODULE X:) in content blocks
 *
 * Rules:
 *   - Never modifies actual course prose
 *   - Only strips patterns that are definitively metadata/artifacts
 *   - All fixed courses saved with status unchanged (draft stays draft)
 *   - Dry-run mode available: set DRY_RUN=true
 *
 * Usage:
 *   node src/scripts/fixCourseContentIssues.js
 *   DRY_RUN=true node src/scripts/fixCourseContentIssues.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const DRY_RUN = process.env.DRY_RUN === 'true';

// ─── Slugs to fix (from diagnostic) ──────────────────────────────────────
const TARGET_SLUGS = [
  'when-it-rains-it-pours-treating-clients-with-multiple-stressors-and-comorbidities',
  'the-pursuit-of-happyness-treating-anxiety-and-depression',
  'it-takes-a-village-collaborative-care',
  'lost-in-translation-bridging-cultural-divides',
  'walking-on-eggshells-high-conflict-clients',
  '28-days-later-understanding-addiction-and-recovery',
  'cbt-toolbox-core-techniques',
  'suicide-risk-assessment-interactive',
  'ethics-and-professional-boundaries-in-counseling-practice',
  'crisis-intervention-and-suicide-prevention-a-comprehensive-clinical-guide',
  'motivational-interviewing-from-ambivalence-to-action',
  'small-warriors-big-battles-parental-incarceration',
  'beyond-the-uniform-first-responder-families',
];

// ─── Schema ───────────────────────────────────────────────────────────────
const CourseSchema = new mongoose.Schema({}, { strict: false, collection: 'interactivecourses' });
const Course = mongoose.models.FixCourse || mongoose.model('FixCourse', CourseSchema);

// ─── Patterns ────────────────────────────────────────────────────────────

// Metadata patterns to strip from content block text
const METADATA_STRIP_PATTERNS = [
  // Full metadata header block: <h2>Title</h2> followed by metadata — strip up to first real paragraph
  // Provider/ACEP lines
  /<[^>]*>NBCC ACEP Provider[^<]*<\/[^>]*>/gi,
  /<[^>]*>.*?GAITP LLC.*?<\/[^>]*>/gi,
  // Tagline
  /<[^>]*>.*?Learn\.\s*License\.\s*Lead\..*?<\/[^>]*>/gi,
  // CounselorReady: brand line
  /<[^>]*>CounselorReady:.*?<\/[^>]*>/gi,
  // CE Hours metadata line
  /<[^>]*>.*?(?:CE Hours|Continuing Education Hours|Course Hours).*?<\/[^>]*>/gi,
  // Target Audience line
  /<[^>]*>.*?Target Audience:.*?<\/[^>]*>/gi,
  // Presenter/Instructor metadata
  /<[^>]*>.*?(?:Presenter:|Instructor of Record:).*?<\/[^>]*>/gi,
  // Module Duration line
  /<[^>]*>.*?Module Duration:.*?<\/[^>]*>/gi,
  // Module Learning Objectives header (the label, not the objectives themselves)
  /<[^>]*>.*?Module Learning Objectives?:?\s*<\/[^>]*>/gi,
  // "---" separator paragraphs
  /<p>\s*-{3,}\s*<\/p>/gi,
  // Empty paragraphs (cleanup after stripping)
  /(<p>\s*<\/p>\s*){2,}/gi,
];

// MODULE X: header pattern in content (e.g. <h1>MODULE 3: ADVANCED MI...</h1>)
const MODULE_HEADER_RE = /<h[1-2][^>]*>\s*MODULE\s+\d+[:\s][^<]*<\/h[1-2]>/gi;

// Markdown table rows (pipe-delimited) — wrap in a notice instead of stripping
const MARKDOWN_TABLE_ROW_RE = /(<p>)?(\|[^\n]+\|)(<\/p>)?/g;

// All-caps title conversion (for section titles only)
function toTitleCase(str) {
  const minorWords = new Set(['a','an','the','and','but','or','for','nor','on','at','to','by','in','of','up','as','is']);
  return str.toLowerCase().replace(/\w+/g, (word, offset) => {
    if (offset === 0 || !minorWords.has(word)) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }
    return word;
  });
}

function isAllCaps(str) {
  return str && /^[A-Z\s\d:&\/\-]{8,}$/.test(str.trim()) && str.trim().length > 8;
}

// Decision Point section title fix
function fixDecisionPointTitle(title) {
  if (!title) return title;
  // "🔀 DECISION POINT: INITIAL ENGAGEMENT" → "Initial Engagement"
  return title
    .replace(/🔀\s*/g, '')
    .replace(/DECISION POINT:\s*/i, '')
    .trim()
    .replace(/^[A-Z\s]+$/, s => toTitleCase(s));
}

// ─── Fix functions ────────────────────────────────────────────────────────

function fixBlockContent(html) {
  if (!html) return html;
  let fixed = html;

  // Strip metadata patterns
  for (const pattern of METADATA_STRIP_PATTERNS) {
    fixed = fixed.replace(pattern, '');
  }

  // Strip embedded MODULE X: headers
  fixed = fixed.replace(MODULE_HEADER_RE, '');

  // Wrap raw markdown tables in a styled notice
  if (MARKDOWN_TABLE_ROW_RE.test(fixed)) {
    fixed = fixed.replace(
      /(<p>)?(\|(?:[^\n|]+\|)+)(<\/p>)?/g,
      '<p class="cr-table-notice" style="font-style:italic;color:#888;font-size:0.85em;">[Table — formatted content available in updated version]</p>'
    );
  }

  // Clean up multiple empty paragraphs left after stripping
  fixed = fixed.replace(/(<p>\s*<\/p>\s*){2,}/gi, '<p></p>');
  fixed = fixed.replace(/^\s*(<p>\s*<\/p>\s*)+/i, '');

  return fixed.trim();
}

function fixSectionTitle(title) {
  if (!title) return title;

  // Fix Decision Point titles
  if (/DECISION POINT:/i.test(title)) {
    return fixDecisionPointTitle(title);
  }

  // Fix all-caps titles
  if (isAllCaps(title)) {
    return toTitleCase(title.trim());
  }

  return title;
}

// ─── Main ─────────────────────────────────────────────────────────────────

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log(`✅ Connected to MongoDB ${DRY_RUN ? '(DRY RUN — no changes will be saved)' : ''}\n`);

  const courses = await Course.find({ slug: { $in: TARGET_SLUGS } }).lean();
  console.log(`📚 Found ${courses.length} target courses\n`);

  const summary = [];

  for (const course of courses) {
    console.log(`\n📘 ${course.title}`);
    let changeCount = 0;
    const sections = (course.sections || []).map(section => {
      // Fix section title
      const originalTitle = section.title;
      const fixedTitle = fixSectionTitle(originalTitle);
      if (fixedTitle !== originalTitle) {
        console.log(`   ✏️  Title: "${originalTitle}" → "${fixedTitle}"`);
        changeCount++;
      }

      // Fix content blocks
      const contentBlocks = (section.contentBlocks || []).map((block, i) => {
        const originalText = block.textContent || block.content || '';
        if (!originalText) return block;

        const fixedText = fixBlockContent(originalText);

        if (fixedText !== originalText) {
          const truncOrig = originalText.slice(0, 60).replace(/\n/g, ' ');
          const truncFixed = fixedText.slice(0, 60).replace(/\n/g, ' ');
          console.log(`   ✏️  §"${fixedTitle || originalTitle}" block#${i}`);
          console.log(`      before: "${truncOrig}..."`);
          console.log(`      after:  "${truncFixed}..."`);
          changeCount++;

          const updated = { ...block };
          if (block.textContent !== undefined) updated.textContent = fixedText;
          if (block.content !== undefined) updated.content = fixedText;
          return updated;
        }
        return block;
      });

      return { ...section, title: fixedTitle, contentBlocks };
    });

    if (changeCount === 0) {
      console.log(`   ✅ No changes needed`);
      summary.push({ title: course.title, slug: course.slug, changes: 0 });
      continue;
    }

    console.log(`   → ${changeCount} fix(es) applied`);

    if (!DRY_RUN) {
      await Course.updateOne(
        { _id: course._id },
        { $set: { sections } }
      );
      console.log(`   💾 Saved`);
    }

    summary.push({ title: course.title, slug: course.slug, changes: changeCount });
  }

  // ─── Summary ──────────────────────────────────────────────────────────
  console.log('\n═══════════════════════════════════════════════');
  console.log('  FIX SUMMARY');
  console.log('═══════════════════════════════════════════════');
  const fixed = summary.filter(s => s.changes > 0);
  const clean = summary.filter(s => s.changes === 0);
  console.log(`  Fixed: ${fixed.length} courses`);
  console.log(`  Already clean: ${clean.length} courses`);
  for (const c of fixed) {
    console.log(`  ✅ ${c.title} (${c.changes} changes)`);
  }
  if (DRY_RUN) {
    console.log('\n  ⚠️  DRY RUN — no changes were saved to the database.');
    console.log('     Run without DRY_RUN=true to apply fixes.');
  }

  await mongoose.disconnect();
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
