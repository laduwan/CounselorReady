/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// migrateMarkdownHeadings.js
// Fixes broken HTML produced by markdownToHtml() in seedNewCourses.js:
//   1. <p>#### Heading</p>  → <h4>Heading</h4>
//   2. <p><details></p>     → <details>   (unwrap block elements from <p>)
//   3. <p><summary></p>     → <summary>
//   4. <p></details></p>    → </details>
//   5. <p></summary></p>    → </summary>
//   6. Bare #### at line start → <h4>
//
// This does NOT change word count — only fixes tag structure.
//
// Run: node src/scripts/migrateMarkdownHeadings.js
// Add --dry-run to preview changes without writing to DB
// ================================================================

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const DRY_RUN = process.argv.includes('--dry-run');

/**
 * Fix all broken HTML patterns from markdownToHtml()
 */
function fixBrokenHtml(text) {
  return text
    // Fix 1: <p>-wrapped markdown headings → proper heading tags
    .replace(/<p>\s*####\s+(.+?)\s*<\/p>/gm, '<h4>$1</h4>')
    .replace(/<p>\s*###\s+(.+?)\s*<\/p>/gm, '<h3>$1</h3>')
    .replace(/<p>\s*##\s+(.+?)\s*<\/p>/gm, '<h2>$1</h2>')
    // Fix 2: Bare markdown headings at start of line
    .replace(/^####\s+(.+)$/gm, '<h4>$1</h4>')
    .replace(/^###\s+(.+)$/gm, '<h3>$1</h3>')
    .replace(/^##\s+(.+)$/gm, '<h2>$1</h2>')
    // Fix 3: Unwrap <details>/<summary> from invalid <p> wrappers
    .replace(/<p>\s*(<details[^>]*>)\s*<\/p>/gim, '$1')
    .replace(/<p>\s*(<\/details>)\s*<\/p>/gim, '$1')
    .replace(/<p>\s*(<summary[^>]*>)/gim, '$1')
    .replace(/(<\/summary>)\s*<\/p>/gim, '$1')
    // Fix 4: Clean up empty <p></p> tags left behind
    .replace(/<p>\s*<\/p>/gm, '');
}

function needsFix(text) {
  // Check for <p>-wrapped markdown headings
  if (/(?:<p>\s*)#{2,4}\s+.+/m.test(text)) return true;
  // Check for bare markdown headings
  if (/^#{2,4}\s+.+$/m.test(text)) return true;
  // Check for <p>-wrapped <details>/<summary>
  if (/<p>\s*<\/?(?:details|summary)/im.test(text)) return true;
  return false;
}

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
    if (DRY_RUN) console.log('🔍 DRY RUN — no changes will be saved\n');

    const db = mongoose.connection.db;
    const collections = ['interactivecourses', 'courses'];
    let totalFixed = 0;
    let totalHeadings = 0;
    let totalDetails = 0;

    for (const collName of collections) {
      const coll = db.collection(collName);
      const courses = await coll.find({}).toArray();
      console.log(`\n📚 ${collName}: ${courses.length} courses found`);

      for (const course of courses) {
        let courseModified = false;
        const updates = {};
        const fixes = { headings: 0, details: 0 };

        // Interactive courses: sections[].contentBlocks[]
        if (course.sections && Array.isArray(course.sections)) {
          const newSections = course.sections.map((section, si) => {
            if (!section.contentBlocks || !Array.isArray(section.contentBlocks)) return section;

            const newBlocks = section.contentBlocks.map((block, bi) => {
              if (block.type !== 'text') return block;

              const fields = ['content', 'textContent'];
              let blockModified = false;
              const newBlock = { ...block };

              for (const field of fields) {
                if (newBlock[field] && typeof newBlock[field] === 'string' && needsFix(newBlock[field])) {
                  const original = newBlock[field];
                  newBlock[field] = fixBrokenHtml(original);
                  if (newBlock[field] !== original) {
                    blockModified = true;

                    if (DRY_RUN) {
                      // Count heading fixes
                      const hMatches = original.match(/(?:<p>\s*|^)#{2,4}\s+.+/gm);
                      if (hMatches) {
                        fixes.headings += hMatches.length;
                        hMatches.forEach(m => {
                          const clean = m.replace(/<\/?p>/g, '').trim();
                          const level = clean.match(/^(#{2,4})/)?.[1]?.length || '?';
                          const text = clean.replace(/^#{2,4}\s+/, '');
                          console.log(`  → S${si + 1} B${bi + 1}: ####→h${level} "${text.substring(0, 55)}"`);
                        });
                      }
                      // Count details fixes
                      const dMatches = original.match(/<p>\s*<\/?(?:details|summary)/gim);
                      if (dMatches) {
                        fixes.details += dMatches.length;
                      }
                    }
                  }
                }
              }

              if (blockModified) courseModified = true;
              return newBlock;
            });

            return { ...section, contentBlocks: newBlocks };
          });

          if (courseModified) {
            updates.sections = newSections;
          }
        }

        // Standard courses: modules[].lessons[].content
        if (course.modules && Array.isArray(course.modules)) {
          const newModules = course.modules.map((mod, mi) => {
            if (!mod.lessons || !Array.isArray(mod.lessons)) return mod;

            const newLessons = mod.lessons.map((lesson, li) => {
              if (!lesson.content || typeof lesson.content !== 'string' || !needsFix(lesson.content)) {
                return lesson;
              }

              const original = lesson.content;
              const updated = fixBrokenHtml(original);
              if (updated !== original) {
                courseModified = true;

                if (DRY_RUN) {
                  const hMatches = original.match(/(?:<p>\s*|^)#{2,4}\s+.+/gm);
                  if (hMatches) {
                    fixes.headings += hMatches.length;
                    hMatches.forEach(m => {
                      const clean = m.replace(/<\/?p>/g, '').trim();
                      const level = clean.match(/^(#{2,4})/)?.[1]?.length || '?';
                      const text = clean.replace(/^#{2,4}\s+/, '');
                      console.log(`  → M${mi + 1} L${li + 1}: ####→h${level} "${text.substring(0, 55)}"`);
                    });
                  }
                  const dMatches = original.match(/<p>\s*<\/?(?:details|summary)/gim);
                  if (dMatches) {
                    fixes.details += dMatches.length;
                  }
                }

                return { ...lesson, content: updated };
              }
              return lesson;
            });

            return { ...mod, lessons: newLessons };
          });

          if (courseModified) {
            updates.modules = newModules;
          }
        }

        if (courseModified) {
          totalFixed++;
          totalHeadings += fixes.headings;
          totalDetails += fixes.details;
          const fixDesc = [];
          if (fixes.headings) fixDesc.push(`${fixes.headings} headings`);
          if (fixes.details) fixDesc.push(`${fixes.details} details/summary tags`);
          console.log(`  ✏️  ${course.title || course.slug} — fixed ${fixDesc.join(', ')}`);

          if (!DRY_RUN) {
            await coll.updateOne({ _id: course._id }, { $set: updates });
          }
        }
      }
    }

    console.log(`\n${'='.repeat(50)}`);
    console.log(`${DRY_RUN ? '🔍 Would fix' : '✅ Fixed'}: ${totalFixed} courses`);
    console.log(`  Headings: ${totalHeadings} markdown→HTML conversions`);
    console.log(`  Details/Summary: ${totalDetails} unwrapped from <p> tags`);
    if (DRY_RUN) console.log('\nRun without --dry-run to apply changes.');

  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

migrate();
