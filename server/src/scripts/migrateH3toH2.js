/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// migrateH3toH2.js
// Fixes heading hierarchy in existing course content:
//   <h3> → <h2> for major topic headings (per Gold Standard Spec §18.4)
//
// Run: node src/scripts/migrateH3toH2.js
// Add --dry-run to preview changes without writing to DB
// ================================================================

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const DRY_RUN = process.argv.includes('--dry-run');

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
    if (DRY_RUN) console.log('🔍 DRY RUN — no changes will be saved\n');

    const db = mongoose.connection.db;

    // Process both collections
    const collections = ['interactivecourses', 'courses'];
    let totalFixed = 0;

    for (const collName of collections) {
      const coll = db.collection(collName);
      const courses = await coll.find({}).toArray();
      console.log(`\n📚 ${collName}: ${courses.length} courses found`);

      for (const course of courses) {
        let courseModified = false;
        const updates = {};

        // Interactive courses use sections[].contentBlocks[]
        if (course.sections && Array.isArray(course.sections)) {
          const newSections = course.sections.map((section, si) => {
            if (!section.contentBlocks || !Array.isArray(section.contentBlocks)) return section;

            const newBlocks = section.contentBlocks.map((block, bi) => {
              if (block.type !== 'text') return block;

              const fields = ['content', 'textContent'];
              let blockModified = false;
              const newBlock = { ...block };

              for (const field of fields) {
                if (newBlock[field] && typeof newBlock[field] === 'string' && newBlock[field].includes('<h3>')) {
                  const original = newBlock[field];
                  newBlock[field] = original.replace(/<h3>/g, '<h2>').replace(/<\/h3>/g, '</h2>');
                  blockModified = true;

                  if (DRY_RUN) {
                    // Show first heading change as preview
                    const match = original.match(/<h3>([^<]+)<\/h3>/);
                    if (match) {
                      console.log(`  → S${si + 1} B${bi + 1}: "${match[1]}" h3→h2`);
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

        // Standard courses use modules[].lessons[].content
        if (course.modules && Array.isArray(course.modules)) {
          const newModules = course.modules.map((mod, mi) => {
            if (!mod.lessons || !Array.isArray(mod.lessons)) return mod;

            const newLessons = mod.lessons.map((lesson, li) => {
              if (!lesson.content || typeof lesson.content !== 'string' || !lesson.content.includes('<h3>')) {
                return lesson;
              }

              const original = lesson.content;
              const updated = original.replace(/<h3>/g, '<h2>').replace(/<\/h3>/g, '</h2>');
              courseModified = true;

              if (DRY_RUN) {
                const match = original.match(/<h3>([^<]+)<\/h3>/);
                if (match) {
                  console.log(`  → M${mi + 1} L${li + 1}: "${match[1]}" h3→h2`);
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
          console.log(`  ✏️  ${course.title || course.slug} — headings fixed`);

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
