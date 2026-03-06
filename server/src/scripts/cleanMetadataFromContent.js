/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('No MONGODB_URI'); process.exit(1); }

// ═══════════════════════════════════════════════════════════════════
// METADATA CLEANUP — Strips embedded metadata from text blocks
// 
// Usage:
//   DRY RUN (default):  node src/scripts/cleanMetadataFromContent.js
//   APPLY CHANGES:      node src/scripts/cleanMetadataFromContent.js --apply
//
// What it strips:
//   - ACEP provider lines (NBCC ACEP Provider #7760...)
//   - GAITP LLC name/abbreviation lines
//   - CounselorReady tagline lines
//   - "Course Hours: X" lines
//   - "Estimated Time: X minutes" lines
//   - "Target Audience:" header lines (the data is stored at course level)
//   - Standalone course title repeated as first line of content
//   - "DECISION POINT:" prefix from section headings in content
//
// Does NOT touch: actual instructional content, HTML structure,
//   interactive blocks, assessments, or any non-text blocks
// ═══════════════════════════════════════════════════════════════════

const DRY_RUN = !process.argv.includes('--apply');

// Each pattern matches a FULL LINE (or paragraph) to remove
// We strip the entire line containing the match, not just the match
const LINE_STRIP_PATTERNS = [
  // ACEP / provider metadata
  /^.*NBCC ACEP Provider #7760.*$/gim,
  /^.*GAITP LLC.*$/gim,
  /^.*Ga Integrated Therapeutic Perspectives LLC.*$/gim,
  /^.*GA Integrated Therapeutic Perspectives LLC.*$/gim,
  /^.*CounselorReady:\s*Learn\.\s*License\.\s*Lead\..*$/gim,
  /^.*CounselorReady\s*Learn\.\s*License\.\s*Lead\..*$/gim,

  // Course metadata lines
  /^.*Course Hours?:\s*\d.*$/gim,
  /^.*Continuing Education Hours?.*$/gim,
  /^.*Estimated Time:\s*\d+\s*minutes.*$/gim,
  /^.*Estimated Time:\s*\d+\s*minutes?\s*\|\s*[\d,]+\+?\s*words.*$/gim,
  /^.*Target Audience:.*$/gim,
  /^.*Content Area:.*$/gim,
  /^.*Delivery Method:\s*Asynchronous.*$/gim,
  /^.*Instructional Level:.*$/gim,

  // "---" decorative separators that come with metadata blocks
  /^---+\s*$/gm,
];

// HTML-wrapped versions of the same patterns (content stored as HTML)
const HTML_STRIP_PATTERNS = [
  // <p> wrapped metadata
  /<p[^>]*>\s*NBCC ACEP Provider #7760[^<]*<\/p>/gi,
  /<p[^>]*>\s*(?:GA|Ga) Integrated Therapeutic Perspectives LLC[^<]*<\/p>/gi,
  /<p[^>]*>\s*GAITP LLC[^<]*<\/p>/gi,
  /<p[^>]*>\s*CounselorReady:?\s*Learn\.\s*License\.\s*Lead\.[^<]*<\/p>/gi,
  /<p[^>]*>\s*Course Hours?:\s*\d[^<]*<\/p>/gi,
  /<p[^>]*>\s*Estimated Time:\s*\d[^<]*<\/p>/gi,
  /<p[^>]*>\s*Target Audience:[^<]*<\/p>/gi,
  /<p[^>]*>\s*Content Area:[^<]*<\/p>/gi,
  /<p[^>]*>\s*Delivery Method:\s*Asynchronous[^<]*<\/p>/gi,
  /<p[^>]*>\s*Instructional Level:[^<]*<\/p>/gi,
  /<p[^>]*>\s*---+\s*<\/p>/gi,

  // <h2>/<h3> wrapped metadata
  /<h[23][^>]*>\s*NBCC ACEP Provider #7760[^<]*<\/h[23]>/gi,
  /<h[23][^>]*>\s*(?:GA|Ga) Integrated Therapeutic Perspectives[^<]*<\/h[23]>/gi,
  /<h[23][^>]*>\s*CounselorReady:?\s*Learn\.\s*License\.\s*Lead\.[^<]*<\/h[23]>/gi,

  // Competency self-assessment tables (raw markdown pipes in HTML)
  /<p[^>]*>\s*\|\s*Competency Area\s*\|[^<]*<\/p>/gi,
  /<p[^>]*>\s*\|[-\s|:]+\|[^<]*<\/p>/gi,
];

// "DECISION POINT:" prefix — don't remove the whole line, just the prefix
const PREFIX_STRIP = [
  { find: /DECISION POINT:\s*/gi, replace: '' },
];

async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;
  const collection = db.collection('interactivecourses');
  const courses = await collection.find({}).toArray();

  console.log('='.repeat(90));
  console.log(`METADATA CLEANUP — ${DRY_RUN ? '🔍 DRY RUN (no changes)' : '⚡ APPLYING CHANGES'}`);
  console.log(`Date: ${new Date().toISOString().split('T')[0]} | Courses: ${courses.length}`);
  if (DRY_RUN) console.log('Run with --apply to execute changes');
  console.log('='.repeat(90) + '\n');

  let totalCoursesModified = 0;
  let totalBlocksModified = 0;
  let totalLinesRemoved = 0;
  let totalWordsRemoved = 0;

  for (const course of courses) {
    const sections = course.sections || [];
    let courseModified = false;
    let courseBlocksModified = 0;
    let courseLinesRemoved = 0;
    let courseWordsRemoved = 0;
    const changes = [];

    for (let si = 0; si < sections.length; si++) {
      const section = sections[si];
      const blocks = section.contentBlocks || [];

      for (let bi = 0; bi < blocks.length; bi++) {
        const block = blocks[bi];
        if (block.type !== 'text') continue;

        // Work on both content and textContent fields
        const fields = ['content', 'textContent'].filter(f => block[f] && block[f].trim().length > 0);
        
        for (const field of fields) {
          let original = block[field];
          let cleaned = original;
          const isHtml = /<[a-z][\s\S]*?>/i.test(cleaned);

          if (isHtml) {
            // Apply HTML-aware patterns
            for (const pat of HTML_STRIP_PATTERNS) {
              cleaned = cleaned.replace(pat, '');
            }
          }

          // Apply line-level patterns (works on both HTML and plain text)
          for (const pat of LINE_STRIP_PATTERNS) {
            cleaned = cleaned.replace(pat, '');
          }

          // Apply prefix strips
          for (const ps of PREFIX_STRIP) {
            cleaned = cleaned.replace(ps.find, ps.replace);
          }

          // Clean up resulting empty lines / double breaks
          cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
          cleaned = cleaned.replace(/(<br\s*\/?>\s*){3,}/gi, '<br><br>');
          cleaned = cleaned.replace(/^[\s\n]+/, ''); // trim leading whitespace

          if (cleaned !== original) {
            const origWords = original.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(w => w.length > 0).length;
            const cleanWords = cleaned.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(w => w.length > 0).length;
            const wordsLost = origWords - cleanWords;
            const linesLost = original.split('\n').length - cleaned.split('\n').length;

            courseModified = true;
            courseBlocksModified++;
            courseLinesRemoved += Math.max(0, linesLost);
            courseWordsRemoved += Math.max(0, wordsLost);

            changes.push({
              section: section.title || `Section ${si + 1}`,
              block: bi,
              field,
              wordsRemoved: wordsLost,
            });

            if (!DRY_RUN) {
              block[field] = cleaned;
            }
          }
        }
      }
    }

    if (courseModified) {
      totalCoursesModified++;
      totalBlocksModified += courseBlocksModified;
      totalLinesRemoved += courseLinesRemoved;
      totalWordsRemoved += courseWordsRemoved;

      console.log(`🧹 ${course.title}`);
      console.log(`   Slug: ${course.slug}`);
      console.log(`   Blocks modified: ${courseBlocksModified} | Words removed: ${courseWordsRemoved}`);
      for (const c of changes) {
        console.log(`   → "${c.section}" block ${c.block} [${c.field}]: -${c.wordsRemoved} words`);
      }

      if (!DRY_RUN) {
        await collection.updateOne(
          { _id: course._id },
          { $set: { sections: course.sections } }
        );
        console.log(`   ✅ Saved to database`);
      }
      console.log('');
    }
  }

  // ── SUMMARY ──
  console.log('='.repeat(90));
  console.log('SUMMARY');
  console.log('='.repeat(90));
  console.log(`Courses modified: ${totalCoursesModified}`);
  console.log(`Text blocks modified: ${totalBlocksModified}`);
  console.log(`Total metadata words removed: ${totalWordsRemoved}`);
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN — nothing changed' : 'APPLIED — changes saved to database'}`);

  if (DRY_RUN && totalCoursesModified > 0) {
    console.log(`\n👉 Run with --apply to execute: node src/scripts/cleanMetadataFromContent.js --apply`);
  }

  await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
