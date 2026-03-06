/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// migrateMarkdownHeadings.js
// Converts raw markdown heading syntax (####, ###, ##) to proper HTML tags
// in course content blocks that contain mixed HTML and markdown.
//
// This does NOT change word count — only converts tag syntax.
//
// Run: node src/scripts/migrateMarkdownHeadings.js
// Add --dry-run to preview changes without writing to DB
// ================================================================

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const DRY_RUN = process.argv.includes('--dry-run');

/**
 * Convert markdown heading lines to HTML heading tags.
 * #### Heading → <h4>Heading</h4>
 * ### Heading  → <h3>Heading</h3>  (note: h3→h2 migration handles these separately)
 * ## Heading   → <h2>Heading</h2>
 */
function convertMarkdownHeadings(text) {
  // Order matters: longest prefix first to avoid partial matches
  return text
    .replace(/^####\s+(.+)$/gm, '<h4>$1</h4>')
    .replace(/^###\s+(.+)$/gm, '<h3>$1</h3>')
    .replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
}

function hasMarkdownHeadings(text) {
  return /^#{2,4}\s+.+$/m.test(text);
}

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
    if (DRY_RUN) console.log('🔍 DRY RUN — no changes will be saved\n');

    const db = mongoose.connection.db;
    const collections = ['interactivecourses', 'courses'];
    let totalFixed = 0;

    for (const collName of collections) {
      const coll = db.collection(collName);
      const courses = await coll.find({}).toArray();
      console.log(`\n📚 ${collName}: ${courses.length} courses found`);

      for (const course of courses) {
        let courseModified = false;
        const updates = {};

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
                if (newBlock[field] && typeof newBlock[field] === 'string' && hasMarkdownHeadings(newBlock[field])) {
                  const original = newBlock[field];
                  newBlock[field] = convertMarkdownHeadings(original);
                  blockModified = true;

                  if (DRY_RUN) {
                    const matches = original.match(/^#{2,4}\s+(.+)$/gm);
                    if (matches) {
                      matches.forEach(m => {
                        const level = m.match(/^(#{2,4})/)[1].length;
                        const text = m.replace(/^#{2,4}\s+/, '');
                        console.log(`  → S${si + 1} B${bi + 1}: "#{level}→h${level}" "${text.substring(0, 60)}"`);
                      });
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
              if (!lesson.content || typeof lesson.content !== 'string' || !hasMarkdownHeadings(lesson.content)) {
                return lesson;
              }

              const original = lesson.content;
              const updated = convertMarkdownHeadings(original);
              courseModified = true;

              if (DRY_RUN) {
                const matches = original.match(/^#{2,4}\s+(.+)$/gm);
                if (matches) {
                  matches.forEach(m => {
                    const level = m.match(/^(#{2,4})/)[1].length;
                    const text = m.replace(/^#{2,4}\s+/, '');
                    console.log(`  → M${mi + 1} L${li + 1}: "#{level}→h${level}" "${text.substring(0, 60)}"`);
                  });
                }
              }

              return { ...lesson, content: updated };
            });

            return { ...mod, lessons: newLessons };
          });

          if (courseModified) {
            updates.modules = newModules;
          }
        }

        if (courseModified) {
          totalFixed++;
          console.log(`  ✏️  ${course.title || course.slug} — markdown headings converted`);

          if (!DRY_RUN) {
            await coll.updateOne({ _id: course._id }, { $set: updates });
          }
        }
      }
    }

    console.log(`\n${'='.repeat(50)}`);
    console.log(`${DRY_RUN ? '🔍 Would fix' : '✅ Fixed'}: ${totalFixed} courses`);
    if (DRY_RUN) console.log('Run without --dry-run to apply changes.');

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
