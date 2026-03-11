/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('No MONGODB_URI'); process.exit(1); }

// ═══════════════════════════════════════════════════════════════════
// CONTENT HEALTH DIAGNOSTIC
// Read-only — does NOT modify any data
// Identifies: placeholder text, raw markdown, metadata in content,
//             word count shortfalls, and rendering issues
// ═══════════════════════════════════════════════════════════════════

const PLACEHOLDER_PATTERNS = [
  { re: /\[Table\s*[—–-]\s*formatted content available in updated version\]/gi, label: 'Table placeholder' },
  { re: /\[Image\s*[—–-]\s*.*?available in updated version\]/gi, label: 'Image placeholder' },
  { re: /\[Figure\s*[—–-]\s*.*?available in updated version\]/gi, label: 'Figure placeholder' },
  { re: /\[Content\s*[—–-]\s*.*?available in updated version\]/gi, label: 'Content placeholder' },
  { re: /\[.*?not available.*?\]/gi, label: 'Generic unavailable placeholder' },
];

const RAW_MARKDOWN_PATTERNS = [
  { re: /^\|.+\|.+\|/m, label: 'Pipe table (markdown)' },
  { re: /^\|[-:]+\|[-:]+\|/m, label: 'Table separator row' },
  { re: /^#{1,4}\s+\w/m, label: 'Markdown heading (#)' },
  { re: /\*\*[^*]{3,}\*\*/m, label: 'Bold markdown (**text**)' },
  { re: /^\s*[-*]\s+\w/m, label: 'Markdown list item' },
  { re: /^\s*\d+\.\s+\w/m, label: 'Markdown numbered list' },
  { re: /^>\s+\w/m, label: 'Markdown blockquote' },
  { re: /^---+$/m, label: 'Markdown horizontal rule' },
];

const METADATA_IN_CONTENT = [
  { re: /NBCC ACEP Provider #7760/i, label: 'ACEP provider info' },
  { re: /Ga Integrated Therapeutic Perspectives/i, label: 'GAITP LLC name' },
  { re: /GAITP LLC/i, label: 'GAITP LLC abbreviation' },
  { re: /CounselorReady:\s*Learn\.\s*License\.\s*Lead\./i, label: 'Tagline in content' },
  { re: /Course Hours?:\s*\d/i, label: 'CE hours in content' },
  { re: /Target Audience:/i, label: 'Target audience header in content' },
  { re: /Estimated Time:\s*\d+\s*minutes/i, label: 'Estimated time metadata' },
  { re: /Competency Area\s*\|/i, label: 'Raw competency table' },
  { re: /DECISION POINT:/i, label: 'Section title as content text' },
];

const DESTROYED_CONTENT_SIGNALS = [
  { re: /\[Table[^]]*\]/g, label: 'Destroyed table' },
  { re: /\[Figure[^]]*\]/g, label: 'Destroyed figure' },
  { re: /\[Chart[^]]*\]/g, label: 'Destroyed chart' },
  { re: /\[Diagram[^]]*\]/g, label: 'Destroyed diagram' },
];

async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;

  const courses = await db.collection('interactivecourses').find({}).toArray();
  console.log('='.repeat(110));
  console.log('COUNSELORREADY CONTENT HEALTH DIAGNOSTIC');
  console.log(`Date: ${new Date().toISOString().split('T')[0]} | Courses scanned: ${courses.length}`);
  console.log('READ-ONLY — no data modified');
  console.log('='.repeat(110) + '\n');

  const allResults = [];

  for (const course of courses) {
    const r = diagnoseCourse(course);
    allResults.push(r);
  }

  // ── SORT: worst first ──
  allResults.sort((a, b) => {
    const scoreA = a.placeholderCount * 10 + a.rawMarkdownBlocks * 3 + a.metadataInContent * 5 + (a.wordDeficit > 0 ? 5 : 0);
    const scoreB = b.placeholderCount * 10 + b.rawMarkdownBlocks * 3 + b.metadataInContent * 5 + (b.wordDeficit > 0 ? 5 : 0);
    return scoreB - scoreA;
  });

  // ── PER-COURSE OUTPUT ──
  let needsRestoration = 0;
  let needsMarkdown = 0;
  let needsMetadataClean = 0;
  let healthy = 0;

  for (const r of allResults) {
    const hasIssues = r.placeholderCount > 0 || r.rawMarkdownBlocks > 0 || r.metadataInContent > 0 || r.wordDeficit > 0;
    
    if (!hasIssues) {
      healthy++;
      continue;
    }

    const icon = r.placeholderCount > 0 ? '🔴' : r.wordDeficit > 0 ? '🟡' : '🔵';
    console.log(`${icon} ${r.title}`);
    console.log(`   Slug: ${r.slug} | Status: ${r.status} | CE: ${r.ceHours}hr`);
    console.log(`   Words: ${r.wordCount} / ${r.requiredWords} required${r.wordDeficit > 0 ? ` (SHORT by ${r.wordDeficit})` : ' ✓'}`);
    console.log(`   Sections: ${r.sectionCount} | Text blocks: ${r.textBlockCount}`);

    if (r.placeholderCount > 0) {
      needsRestoration++;
      console.log(`   ❌ PLACEHOLDERS: ${r.placeholderCount} destroyed content placeholders`);
      for (const p of r.placeholders) {
        console.log(`      Section "${p.section}" block ${p.blockIndex}: ${p.label} — "${p.sample}"`);
      }
    }

    if (r.rawMarkdownBlocks > 0) {
      needsMarkdown++;
      console.log(`   📝 RAW MARKDOWN: ${r.rawMarkdownBlocks} text blocks contain unrendered markdown`);
      for (const m of r.markdownIssues.slice(0, 5)) {
        console.log(`      Section "${m.section}" block ${m.blockIndex}: ${m.labels.join(', ')}`);
      }
      if (r.markdownIssues.length > 5) {
        console.log(`      ... and ${r.markdownIssues.length - 5} more`);
      }
    }

    if (r.metadataInContent > 0) {
      needsMetadataClean++;
      console.log(`   🏷️  METADATA IN CONTENT: ${r.metadataInContent} blocks have embedded metadata`);
      for (const m of r.metadataIssues.slice(0, 3)) {
        console.log(`      Section "${m.section}" block ${m.blockIndex}: ${m.labels.join(', ')}`);
      }
    }

    if (r.hasOnlyMarkdown) {
      console.log(`   ⚡ ALL content is raw markdown (no HTML) — marked.js fix will handle this`);
    }

    console.log('');
  }

  // ── SUMMARY ──
  console.log('='.repeat(110));
  console.log('SUMMARY');
  console.log('='.repeat(110));
  console.log(`🟢 Healthy (no rendering issues): ${healthy}`);
  console.log(`🔴 Need content RESTORATION (destroyed by pipeline): ${needsRestoration}`);
  console.log(`📝 Need markdown rendering (marked.js fix helps): ${needsMarkdown}`);
  console.log(`🏷️  Need metadata cleanup (baked-in ACEP/title text): ${needsMetadataClean}`);
  console.log(`Total: ${allResults.length} courses\n`);

  // ── WORD COUNT RANKING ──
  const shortCourses = allResults
    .filter(r => r.wordDeficit > 0 && r.status === 'published')
    .sort((a, b) => b.wordDeficit - a.wordDeficit);
  
  if (shortCourses.length > 0) {
    console.log('PUBLISHED COURSES UNDER ACEP WORD MINIMUM:');
    for (const r of shortCourses) {
      const pct = Math.round((r.wordCount / r.requiredWords) * 100);
      console.log(`  ${r.title} — ${r.wordCount}/${r.requiredWords} words (${pct}%) — SHORT by ${r.wordDeficit}`);
    }
    console.log('');
  }

  // ── ACTION PLAN ──
  console.log('RECOMMENDED ACTION PLAN:');
  console.log('─'.repeat(60));
  console.log('1. IMMEDIATE — Add marked.js to interactive-course.html');
  console.log('   Impact: Fixes raw markdown rendering for all courses');
  console.log('   Risk: Zero — only affects text blocks with no HTML\n');
  
  if (needsRestoration > 0) {
    console.log(`2. HIGH — Restore ${needsRestoration} courses with destroyed content`);
    console.log('   These have placeholder strings where tables/figures were');
    console.log('   Source: original docx/md files in project\n');
  }
  
  if (needsMetadataClean > 0) {
    console.log(`3. MEDIUM — Clean metadata from ${needsMetadataClean} courses`);
    console.log('   ACEP info, taglines, CE hours baked into text blocks');
    console.log('   Fix: targeted DB script to strip metadata text blocks\n');
  }

  if (shortCourses.length > 0) {
    console.log(`4. ONGOING — ${shortCourses.length} published courses under ACEP word minimum`);
    console.log('   These need content expansion, not just rendering fixes\n');
  }

  await mongoose.disconnect();
}

function diagnoseCourse(course) {
  const sections = course.sections || [];
  const r = {
    title: course.title || 'UNTITLED',
    slug: course.slug || 'NO-SLUG',
    status: course.status || (course.isPublished ? 'published' : 'draft'),
    ceHours: course.ceHours || course.creditHours || 0,
    sectionCount: sections.length,
    textBlockCount: 0,
    wordCount: 0,
    requiredWords: 0,
    wordDeficit: 0,
    placeholderCount: 0,
    placeholders: [],
    rawMarkdownBlocks: 0,
    markdownIssues: [],
    metadataInContent: 0,
    metadataIssues: [],
    hasOnlyMarkdown: true,
  };

  r.requiredWords = r.ceHours * 6000;
  let totalWords = 0;
  let htmlBlockCount = 0;
  let mdBlockCount = 0;

  for (const section of sections) {
    const sTitle = section.title || 'Untitled Section';
    const blocks = section.contentBlocks || [];

    for (let bi = 0; bi < blocks.length; bi++) {
      const block = blocks[bi];
      if (block.type !== 'text') continue;

      r.textBlockCount++;
      const raw = block.content || block.textContent || '';
      const plainText = raw.replace(/<[^>]+>/g, ' ').trim();
      const words = plainText.split(/\s+/).filter(w => w.length > 0).length;
      totalWords += words;

      // Is this HTML or markdown?
      const hasHtml = /<[a-z][\s\S]*?>/i.test(raw);
      if (hasHtml) htmlBlockCount++;
      else mdBlockCount++;

      // Check for placeholders (destroyed content)
      for (const pat of PLACEHOLDER_PATTERNS) {
        const matches = raw.match(pat.re);
        if (matches) {
          r.placeholderCount += matches.length;
          r.placeholders.push({
            section: sTitle,
            blockIndex: bi,
            label: pat.label,
            count: matches.length,
            sample: matches[0].substring(0, 80),
          });
        }
      }

      // Check for raw markdown (only if block has no HTML)
      if (!hasHtml && raw.trim().length > 0) {
        const foundLabels = [];
        for (const pat of RAW_MARKDOWN_PATTERNS) {
          if (pat.re.test(raw)) {
            foundLabels.push(pat.label);
          }
        }
        if (foundLabels.length > 0) {
          r.rawMarkdownBlocks++;
          r.markdownIssues.push({
            section: sTitle,
            blockIndex: bi,
            labels: foundLabels,
          });
        }
      }

      // Check for metadata baked into content
      const foundMeta = [];
      for (const pat of METADATA_IN_CONTENT) {
        if (pat.re.test(raw)) {
          foundMeta.push(pat.label);
        }
      }
      if (foundMeta.length > 0) {
        r.metadataInContent++;
        r.metadataIssues.push({
          section: sTitle,
          blockIndex: bi,
          labels: foundMeta,
        });
      }
    }
  }

  r.wordCount = totalWords;
  r.wordDeficit = Math.max(0, r.requiredWords - totalWords);
  r.hasOnlyMarkdown = (htmlBlockCount === 0 && mdBlockCount > 0);

  return r;
}

main().catch(err => { console.error(err); process.exit(1); });
