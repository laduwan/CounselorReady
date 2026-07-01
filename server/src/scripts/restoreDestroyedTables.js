/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('No MONGODB_URI'); process.exit(1); }

// ═══════════════════════════════════════════════════════════════════
// CONTENT RESTORATION — Replaces table placeholders with actual
// HTML tables extracted from original source markdown files.
//
// Usage:
//   DRY RUN:   node src/scripts/restoreDestroyedTables.js
//   APPLY:     node src/scripts/restoreDestroyedTables.js --apply
//   ONE COURSE: node src/scripts/restoreDestroyedTables.js --slug=28-days-later-understanding-addiction-and-recovery
//
// What it does:
//   1. Reads original markdown source file for each course
//   2. Extracts all markdown tables → converts to HTML <table>
//   3. Finds placeholder strings in DB text blocks
//   4. Groups consecutive placeholders (= one original table)
//   5. Replaces each group with the corresponding HTML table
//
// Does NOT touch: interactive blocks, section structure, assessments,
//   course metadata, or any non-placeholder content
// ═══════════════════════════════════════════════════════════════════

const DRY_RUN = !process.argv.includes('--apply');
const SLUG_FILTER = process.argv.find(a => a.startsWith('--slug='))?.split('=')[1];

// Map: DB slug → source markdown filename
const SLUG_TO_SOURCE = {
  '28-days-later-understanding-addiction-and-recovery':
    'Course_6_28_Days_Later_Addiction_Counseling_3CE.md',
  'the-pursuit-of-happyness-treating-anxiety-and-depression':
    'Pursuit_of_Happyness_Anxiety_Depression_3CE(1).md',
  'lost-in-translation-bridging-cultural-divides':
    'Lost_in_Translation_Cultural_Competency_3CE(1).md',
  'it-takes-a-village-collaborative-care':
    'It_Takes_a_Village_EXPANDED.md',
  'when-it-rains-it-pours-treating-clients-with-multiple-stressors-and-comorbidities':
    'When_It_Rains_It_Pours_EXPANDED.md',
  'motivational-interviewing-from-ambivalence-to-action':
    'course3_motivational_interviewing.md',
  'walking-on-eggshells-high-conflict-clients':
    'Walking_on_Eggshells_EXPANDED.md',
};

const PLACEHOLDER_RE = /\[Table\s*[—–-]\s*formatted content available in updated version\]/gi;

// ── MARKDOWN TABLE → HTML CONVERTER ──
function markdownTableToHtml(tableLines) {
  if (tableLines.length < 2) return '';

  // Find separator row to identify header
  let sepIdx = tableLines.findIndex(l => /^\|[\s\-:|]+\|$/.test(l.trim()));
  if (sepIdx === -1) sepIdx = 1; // fallback: assume row 1 is separator

  const parseRow = (line) => {
    return line.trim()
      .replace(/^\|/, '').replace(/\|$/, '')
      .split('|')
      .map(cell => cell.trim());
  };

  // Parse alignment from separator
  const sepCells = sepIdx < tableLines.length ? parseRow(tableLines[sepIdx]) : [];
  const alignments = sepCells.map(cell => {
    if (/^:-+:$/.test(cell)) return 'center';
    if (/^-+:$/.test(cell)) return 'right';
    return 'left';
  });

  const headerRows = tableLines.slice(0, sepIdx);
  const bodyRows = tableLines.slice(sepIdx + 1);

  let html = '<table>\n';

  // Thead
  if (headerRows.length > 0) {
    html += '  <thead>\n';
    for (const row of headerRows) {
      const cells = parseRow(row);
      html += '    <tr>\n';
      cells.forEach((cell, i) => {
        const align = alignments[i] ? ` style="text-align:${alignments[i]}"` : '';
        // Convert bold markdown in cells
        const content = cell.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        html += `      <th${align}>${content}</th>\n`;
      });
      html += '    </tr>\n';
    }
    html += '  </thead>\n';
  }

  // Tbody
  if (bodyRows.length > 0) {
    html += '  <tbody>\n';
    for (const row of bodyRows) {
      if (!row.trim() || /^\|[\s\-:|]+\|$/.test(row.trim())) continue;
      const cells = parseRow(row);
      html += '    <tr>\n';
      cells.forEach((cell, i) => {
        const align = alignments[i] ? ` style="text-align:${alignments[i]}"` : '';
        const content = cell
          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.+?)\*/g, '<em>$1</em>');
        html += `      <td${align}>${content}</td>\n`;
      });
      html += '    </tr>\n';
    }
    html += '  </tbody>\n';
  }

  html += '</table>';
  return html;
}

// ── EXTRACT ALL TABLES FROM MARKDOWN ──
function extractTables(markdown) {
  const lines = markdown.split('\n');
  const tables = [];
  let currentTable = [];
  let inTable = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isTableRow = /^\|.+\|/.test(line.trim());

    if (isTableRow) {
      if (!inTable) inTable = true;
      currentTable.push(line);
    } else {
      if (inTable && currentTable.length > 0) {
        // Filter out separator-only "tables" (just one separator line)
        const hasContent = currentTable.some(l => !/^\|[\s\-:|]+\|$/.test(l.trim()));
        if (hasContent) {
          tables.push({
            lines: [...currentTable],
            html: markdownTableToHtml(currentTable),
            rowCount: currentTable.length,
            // Grab context: 3 lines before table for matching verification
            context: lines.slice(Math.max(0, i - currentTable.length - 3), i - currentTable.length).join(' ').substring(0, 120),
          });
        }
        currentTable = [];
        inTable = false;
      }
    }
  }
  // Handle table at end of file
  if (inTable && currentTable.length > 0) {
    const hasContent = currentTable.some(l => !/^\|[\s\-:|]+\|$/.test(l.trim()));
    if (hasContent) {
      tables.push({
        lines: [...currentTable],
        html: markdownTableToHtml(currentTable),
        rowCount: currentTable.length,
        context: '',
      });
    }
  }

  return tables;
}

// ── REPLACE PLACEHOLDER GROUPS WITH TABLES ──
function restoreTablesInContent(content, tables) {
  // Strategy: find groups of consecutive placeholder lines and replace
  // each group with the next table in sequence.
  //
  // A "group" is one or more placeholder strings separated only by
  // whitespace/newlines (representing rows of one original table).

  let tableIdx = 0;
  let replacements = 0;
  let result = content;

  // Match groups of consecutive placeholders (with optional whitespace between)
  const groupPattern = /(\[Table\s*[—–-]\s*formatted content available in updated version\][\s\n]*){1,}/gi;

  result = result.replace(groupPattern, (match) => {
    if (tableIdx < tables.length) {
      const table = tables[tableIdx];
      tableIdx++;
      replacements++;
      return '\n' + table.html + '\n';
    }
    // No more tables available — leave placeholder
    return match;
  });

  return { result, replacements, tablesUsed: tableIdx, tablesAvailable: tables.length };
}

async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;
  const collection = db.collection('interactivecourses');

  console.log('='.repeat(100));
  console.log(`TABLE RESTORATION — ${DRY_RUN ? '🔍 DRY RUN' : '⚡ APPLYING CHANGES'}`);
  console.log(`Date: ${new Date().toISOString().split('T')[0]}`);
  if (DRY_RUN) console.log('Run with --apply to execute changes');
  if (SLUG_FILTER) console.log(`Filtering to: ${SLUG_FILTER}`);
  console.log('='.repeat(100) + '\n');

  const mdDir = path.join(__dirname, 'courseMarkdown');
  if (!fs.existsSync(mdDir)) {
    console.error(`❌ courseMarkdown directory not found at: ${mdDir}`);
    console.error('   Expected: server/src/scripts/courseMarkdown/');
    await mongoose.disconnect();
    process.exit(1);
  }

  const slugs = SLUG_FILTER ? [SLUG_FILTER] : Object.keys(SLUG_TO_SOURCE);
  let totalCoursesFixed = 0;
  let totalTablesRestored = 0;

  for (const slug of slugs) {
    const sourceFile = SLUG_TO_SOURCE[slug];
    if (!sourceFile) {
      console.log(`⚠️  No source file mapped for: ${slug}\n`);
      continue;
    }

    const sourcePath = path.join(mdDir, sourceFile);
    if (!fs.existsSync(sourcePath)) {
      console.log(`⚠️  Source file not found: ${sourcePath}\n`);
      continue;
    }

    // Read source and extract tables
    const markdown = fs.readFileSync(sourcePath, 'utf-8');
    const tables = extractTables(markdown);
    console.log(`📄 Source: ${sourceFile} — ${tables.length} tables extracted`);

    // Read DB course
    const course = await collection.findOne({ slug });
    if (!course) {
      console.log(`⚠️  Course not found in DB: ${slug}\n`);
      continue;
    }

    console.log(`🔧 ${course.title}`);
    console.log(`   Slug: ${slug} | Status: ${course.status}`);

    const sections = course.sections || [];
    let courseTablesRestored = 0;
    let globalTableIdx = 0; // Track table index across all sections

    for (let si = 0; si < sections.length; si++) {
      const section = sections[si];
      const blocks = section.contentBlocks || [];
      const sTitle = section.title || `Section ${si + 1}`;

      for (let bi = 0; bi < blocks.length; bi++) {
        const block = blocks[bi];
        if (block.type !== 'text') continue;

        const fields = ['content', 'textContent'].filter(f => block[f]);

        for (const field of fields) {
          const original = block[field];
          const placeholderCount = (original.match(PLACEHOLDER_RE) || []).length;
          if (placeholderCount === 0) continue;

          // Get the tables for this block (sequential from global index)
          const remainingTables = tables.slice(globalTableIdx);
          const { result, replacements, tablesUsed } = restoreTablesInContent(original, remainingTables);

          if (replacements > 0) {
            globalTableIdx += tablesUsed;
            courseTablesRestored += replacements;

            const origWords = original.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(w => w).length;
            const newWords = result.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(w => w).length;

            console.log(`   ✅ "${sTitle}" block ${bi} [${field}]: ${placeholderCount} placeholders → ${replacements} tables restored (+${newWords - origWords} words)`);

            if (!DRY_RUN) {
              block[field] = result;
            }
          }
        }
      }
    }

    if (courseTablesRestored > 0) {
      totalCoursesFixed++;
      totalTablesRestored += courseTablesRestored;

      if (!DRY_RUN) {
        await collection.updateOne(
          { _id: course._id },
          { $set: { sections: course.sections } }
        );
        console.log(`   💾 Saved to database`);
      }

      // Word count after
      let postWords = 0;
      for (const s of sections) {
        for (const b of (s.contentBlocks || [])) {
          if (b.type === 'text') {
            const text = (b.content || b.textContent || '').replace(/<[^>]+>/g, ' ');
            postWords += text.split(/\s+/).filter(w => w).length;
          }
        }
      }
      const required = (course.ceHours || 0) * 6000;
      console.log(`   📊 Estimated word count after: ~${postWords} / ${required} required`);
    } else {
      console.log(`   ℹ️  No placeholders found in DB (may already be restored)`);
    }

    console.log('');
  }

  // ── SUMMARY ──
  console.log('='.repeat(100));
  console.log('SUMMARY');
  console.log('='.repeat(100));
  console.log(`Courses fixed: ${totalCoursesFixed}`);
  console.log(`Tables restored: ${totalTablesRestored}`);
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN — nothing changed' : 'APPLIED — changes saved'}`);

  if (DRY_RUN && totalTablesRestored > 0) {
    console.log(`\n👉 Run with --apply: node src/scripts/restoreDestroyedTables.js --apply`);
    console.log(`👉 Test one course first: node src/scripts/restoreDestroyedTables.js --slug=walking-on-eggshells-high-conflict-clients --apply`);
  }

  await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
