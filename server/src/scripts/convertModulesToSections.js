/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * convertModulesToSections.js
 * 
 * Converts courses that have modules[].lessons[] format
 * into sections[].contentBlocks[] format so the interactive
 * course player can render them.
 * 
 * Run: node src/scripts/convertModulesToSections.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);
console.log('Connected to MongoDB\n');

const db = mongoose.connection.db;
const c = db.collection('interactivecourses');
const all = await c.find({}).toArray();

let converted = 0;
let skipped = 0;

for (const course of all) {
  const hasSections = course.sections && course.sections.length > 0;
  const hasModules = course.modules && course.modules.length > 0;

  // Skip if already has sections with content
  if (hasSections) {
    // Check if sections actually have content
    const hasContent = course.sections.some(s => 
      (s.contentBlocks || []).some(b => b.type === 'text' && (b.textContent || b.content))
    );
    if (hasContent) {
      skipped++;
      continue;
    }
  }

  if (!hasModules) {
    skipped++;
    continue;
  }

  console.log(`  🔄 ${course.slug} | ${course.modules.length} modules -> sections`);

  const sections = [];
  let sectionOrder = 0;

  for (const mod of course.modules) {
    const contentBlocks = [];
    let blockOrder = 0;

    // Section divider
    contentBlocks.push({
      type: 'sectionDivider',
      order: blockOrder++,
      title: mod.title || `Module ${sectionOrder + 1}`,
      sectionNumber: sectionOrder + 1,
      subtitle: mod.subtitle || mod.description || ''
    });

    // Convert lessons to content blocks
    for (const lesson of (mod.lessons || [])) {
      if (lesson.type === 'quiz' || lesson.type === 'assessment') {
        // Convert quiz lessons to multipleChoice blocks
        for (const q of (lesson.questions || [])) {
          contentBlocks.push({
            type: 'multipleChoice',
            order: blockOrder++,
            question: q.question || q.text || '',
            options: (q.options || []).map(o => {
              if (typeof o === 'string') {
                return { text: o, isCorrect: false };
              }
              return { text: o.text || o, isCorrect: !!o.isCorrect };
            }),
            explanation: q.explanation || q.rationale || '',
            feedbackCorrect: 'Correct! ' + (q.explanation || q.rationale || ''),
            feedbackIncorrect: 'Not quite. ' + (q.explanation || q.rationale || '')
          });
        }
      } else {
        // Text/content lesson
        const content = lesson.content || lesson.textContent || lesson.body || '';
        if (content.trim()) {
          contentBlocks.push({
            type: 'text',
            order: blockOrder++,
            textContent: content,
            content: content
          });
        }
      }
    }

    // Also check for contentBlocks directly on the module (hybrid format)
    for (const block of (mod.contentBlocks || [])) {
      contentBlocks.push({
        ...block,
        order: blockOrder++
      });
    }

    sections.push({
      title: mod.title || `Module ${sectionOrder + 1}`,
      order: sectionOrder,
      contentBlocks: contentBlocks
    });
    sectionOrder++;
  }

  // Recompute word count from new sections
  let words = 0;
  for (const sec of sections) {
    for (const block of sec.contentBlocks) {
      const text = block.textContent || block.content || '';
      const plain = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      if (plain) words += plain.split(' ').length;
    }
  }

  await c.updateOne({ _id: course._id }, { $set: {
    sections: sections,
    sectionCount: sections.length,
    moduleCount: sections.length,
    wordCount: words,
    updatedAt: new Date()
  }});

  console.log(`     ✅ ${sections.length} sections | ${words} words`);
  converted++;
}

console.log(`\nConverted: ${converted} | Skipped: ${skipped}`);
await mongoose.disconnect();
