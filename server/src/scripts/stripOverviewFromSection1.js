/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('No MONGODB_URI'); process.exit(1); }

// ═══════════════════════════════════════════════════════════════════
// STRIP OVERVIEW FROM SECTION 1
// Removes course metadata duplicated in Section 1 text blocks:
//   - Course title repeated as text
//   - "Course Information" / "Course Overview" headings
//   - Target audience paragraph
//   - Learning objectives list
//   - Course outline list
//   - Course level line
//   - "Upon successful completion..." preamble
//
// The overview card in the player now renders this from course-level
// fields, so the text block duplicates cause double-display.
//
// Usage:
//   DRY RUN:  node src/scripts/stripOverviewFromSection1.js
//   APPLY:    node src/scripts/stripOverviewFromSection1.js --apply
//   ONE:      node src/scripts/stripOverviewFromSection1.js --slug=walking-on-eggshells-high-conflict-clients
//
// Does NOT touch: instructional content, interactive blocks, sections
//   other than section 0, or any non-text blocks
// ═══════════════════════════════════════════════════════════════════

const DRY_RUN = !process.argv.includes('--apply');
const SLUG_FILTER = process.argv.find(a => a.startsWith('--slug='))?.split('=')[1];

// Patterns that indicate overview metadata (not instructional content)
// These match the full line/paragraph containing the pattern
const OVERVIEW_PATTERNS = [
  // Course title repeated as plain text (first line, often matches course.title)
  // We handle this specially — compare against course.title

  // "Course Information" / "Course Overview" headings
  /^<h[23][^>]*>\s*Course (?:Information|Overview|Details)\s*<\/h[23]>$/gim,
  /<h[23][^>]*>\s*Course (?:Information|Overview|Details)\s*<\/h[23]>/gi,

  // "Course Level:" line
  /^.*Course Level:\s*.+$/gim,
  /<p[^>]*>\s*<strong>Course Level:<\/strong>\s*.+?<\/p>/gi,
  /<p[^>]*>\s*Course Level:\s*.+?<\/p>/gi,

  // "Upon successful completion" preamble
  /^.*Upon successful completion of this course.*$/gim,
  /<p[^>]*>\s*Upon successful completion of this course[^<]*<\/p>/gi,

  // "Course Outline" heading
  /^<h[23][^>]*>\s*Course Outline\s*<\/h[23]>$/gim,
  /<h[23][^>]*>\s*Course Outline\s*<\/h[23]>/gi,

  // "Learning Objectives" heading (the card renders these from course.objectives)
  /^<h[23][^>]*>\s*Learning Objectives?\s*<\/h[23]>$/gim,
  /<h[23][^>]*>\s*Learning Objectives?\s*<\/h[23]>/gi,

  // "Target Audience" heading (already stripped by metadata cleanup, but catch remnants)
  /^<h[23][^>]*>\s*Target Audience\s*<\/h[23]>$/gim,
  /<h[23][^>]*>\s*Target Audience\s*<\/h[23]>/gi,
];

// Patterns for the outline list items (module/section bullets)
const OUTLINE_ITEM_PATTERNS = [
  // • Module 1: ... (30 minutes)  or  • Introduction: ... (15 minutes)
  /<li>\s*(?:Module\s+\d+|Introduction|Conclusion)[^<]*\(\d+\s*minutes?\)\s*<\/li>/gi,
  /^[•\-]\s*(?:Module\s+\d+|Introduction|Conclusion).+\(\d+\s*minutes?\)\s*$/gim,
  /<p[^>]*>\s*[•\-]\s*(?:Module\s+\d+|Introduction|Conclusion)[^<]*\(\d+\s*minutes?\)\s*<\/p>/gi,
];

// If an entire <ul> or <ol> is composed only of outline items, remove the whole list
function stripOutlineLists(content) {
  // Match <ul>...</ul> blocks
  return content.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (match, inner) => {
    // Check if ALL <li> items match outline patterns
    const items = inner.match(/<li>[\s\S]*?<\/li>/gi) || [];
    if (items.length === 0) return match;

    const allOutline = items.every(item =>
      /(?:Module\s+\d+|Introduction|Conclusion)[^<]*\(\d+\s*minutes?\)/i.test(item)
    );
    return allOutline ? '' : match;
  });
}

// Strip numbered objective lines that duplicate course.objectives
function stripObjectivesList(content, objectives) {
  if (!objectives || objectives.length === 0) return content;

  // Match <ol>...</ol> that contains objective text
  return content.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (match, inner) => {
    const items = inner.match(/<li>[\s\S]*?<\/li>/gi) || [];
    if (items.length < 3) return match; // Too few to be objectives list

    // Check if items overlap with course.objectives
    let matchCount = 0;
    for (const item of items) {
      const itemText = item.replace(/<[^>]+>/g, '').trim().toLowerCase();
      for (const obj of objectives) {
        // Fuzzy match: first 30 chars
        if (itemText.substring(0, 30) === obj.toLowerCase().substring(0, 30)) {
          matchCount++;
          break;
        }
      }
    }
    // If most items match objectives, it's a duplicate list
    return matchCount >= objectives.length * 0.5 ? '' : match;
  });

  return content;
}

// Strip standalone numbered objectives (not in <ol>)
function stripNumberedObjectives(content, objectives) {
  if (!objectives || objectives.length === 0) return content;

  for (const obj of objectives) {
    // Match "N. <objective text>" as a paragraph or line
    const escaped = obj.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').substring(0, 50);
    const re = new RegExp(`^\\s*\\d+\\.\\s*${escaped.substring(0, 30)}.*$`, 'gim');
    content = content.replace(re, '');

    // HTML wrapped
    const reHtml = new RegExp(`<p[^>]*>\\s*\\d+\\.\\s*${escaped.substring(0, 30)}[^<]*<\\/p>`, 'gi');
    content = content.replace(reHtml, '');
  }
  return content;
}

// Strip course title if it appears as the first meaningful line
function stripLeadingTitle(content, courseTitle) {
  if (!courseTitle) return content;
  const titleEsc = courseTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Plain text title as first line
  content = content.replace(new RegExp(`^\\s*${titleEsc}\\s*\\n`, 'i'), '');
  // <p> wrapped
  content = content.replace(new RegExp(`^\\s*<p[^>]*>\\s*${titleEsc}\\s*<\\/p>`, 'i'), '');
  // <h2>/<h3> wrapped
  content = content.replace(new RegExp(`^\\s*<h[23][^>]*>\\s*${titleEsc}\\s*<\\/h[23]>`, 'i'), '');

  return content;
}

// Strip target audience paragraph (long list of license types)
function stripAudienceParagraph(content) {
  // Match paragraphs that list multiple license types
  const audienceRe = /<p[^>]*>[^<]*(?:Licensed Professional Counselors|LPCs|LMHCs|LCSWs|Licensed Marriage)[^<]*(?:Licensed|Counselors|Therapists|Psychologists|Nurse Practitioners)[^<]*<\/p>/gi;
  content = content.replace(audienceRe, '');

  // Plain text version
  const plainRe = /^.*(?:Licensed Professional Counselors|LPCs).+(?:Licensed|Psychologists|Nurse Practitioners).*$/gim;
  content = content.replace(plainRe, '');

  return content;
}

async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;
  const collection = db.collection('interactivecourses');

  const query = SLUG_FILTER ? { slug: SLUG_FILTER } : {};
  const courses = await collection.find(query).toArray();

  console.log('='.repeat(90));
  console.log(`STRIP OVERVIEW FROM SECTION 1 — ${DRY_RUN ? '🔍 DRY RUN' : '⚡ APPLYING'}`);
  console.log(`Date: ${new Date().toISOString().split('T')[0]} | Courses: ${courses.length}`);
  if (DRY_RUN) console.log('Run with --apply to execute');
  console.log('='.repeat(90) + '\n');

  let totalModified = 0;
  let totalWordsRemoved = 0;

  for (const course of courses) {
    const sections = course.sections || [];
    if (sections.length === 0) continue;

    const section0 = sections[0];
    const blocks = section0.contentBlocks || [];
    const sTitle = section0.title || 'Section 1';

    let courseModified = false;
    let courseWordsRemoved = 0;
    const changes = [];

    for (let bi = 0; bi < blocks.length; bi++) {
      const block = blocks[bi];
      if (block.type !== 'text') continue;

      const fields = ['content', 'textContent'].filter(f => block[f] && block[f].trim().length > 0);

      for (const field of fields) {
        let original = block[field];
        let cleaned = original;

        // 1. Strip course title at top
        cleaned = stripLeadingTitle(cleaned, course.title);

        // 2. Strip overview heading patterns
        for (const pat of OVERVIEW_PATTERNS) {
          cleaned = cleaned.replace(pat, '');
        }

        // 3. Strip audience paragraph
        cleaned = stripAudienceParagraph(cleaned);

        // 4. Strip objectives list
        cleaned = stripObjectivesList(cleaned, course.objectives);
        cleaned = stripNumberedObjectives(cleaned, course.objectives);

        // 5. Strip outline list items
        for (const pat of OUTLINE_ITEM_PATTERNS) {
          cleaned = cleaned.replace(pat, '');
        }
        cleaned = stripOutlineLists(cleaned);

        // 6. Clean up whitespace
        cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
        cleaned = cleaned.replace(/(<br\s*\/?>\s*){3,}/gi, '<br><br>');
        cleaned = cleaned.replace(/^[\s\n]+/, '');

        if (cleaned !== original) {
          const origWords = original.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(w => w).length;
          const cleanWords = cleaned.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(w => w).length;
          const wordsLost = origWords - cleanWords;

          courseModified = true;
          courseWordsRemoved += wordsLost;
          changes.push({ block: bi, field, wordsRemoved: wordsLost });

          if (!DRY_RUN) {
            block[field] = cleaned;
          }
        }
      }
    }

    if (courseModified) {
      totalModified++;
      totalWordsRemoved += courseWordsRemoved;

      console.log(`🧹 ${course.title}`);
      console.log(`   Slug: ${course.slug} | Section: "${section0.title || 'Section 1'}"`);
      console.log(`   Overview words stripped: ${courseWordsRemoved}`);
      for (const c of changes) {
        console.log(`   → block ${c.block} [${c.field}]: -${c.wordsRemoved} words`);
      }

      if (!DRY_RUN) {
        await collection.updateOne(
          { _id: course._id },
          { $set: { sections: course.sections } }
        );
        console.log(`   ✅ Saved`);
      }
      console.log('');
    }
  }

  console.log('='.repeat(90));
  console.log('SUMMARY');
  console.log('='.repeat(90));
  console.log(`Courses modified: ${totalModified}`);
  console.log(`Total overview words stripped: ${totalWordsRemoved}`);
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'APPLIED'}`);
  if (DRY_RUN && totalModified > 0) {
    console.log(`\n👉 Test one: node src/scripts/stripOverviewFromSection1.js --slug=walking-on-eggshells-high-conflict-clients`);
    console.log(`👉 Apply all: node src/scripts/stripOverviewFromSection1.js --apply`);
  }

  await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
