/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
#!/usr/bin/env node
/**
 * Restore courses from legacy `courses` collection
 * back to `interactivecourses` format (sections/contentBlocks)
 * 
 * Run: node src/scripts/restoreFromLegacy.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const RESTORE_SLUGS = ['therapeutic-rapport', 'beautiful-mind'];

async function restore() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  for (const slug of RESTORE_SLUGS) {
    const legacy = await db.collection('courses').findOne({
      $or: [
        { slug },
        { title: new RegExp(slug.replace(/-/g, '.*'), 'i') }
      ]
    });

    if (!legacy) { console.log(`❌ ${slug}: not found in legacy courses`); continue; }

    const sections = (legacy.modules || []).map((mod, mi) => {
      const contentBlocks = (mod.lessons || []).map((lesson, li) => ({
        type: 'text',
        order: li + 1,
        textContent: lesson.content || lesson.textContent || ''
      })).filter(b => b.textContent.length > 0);

      return {
        title: mod.title || `Section ${mi + 1}`,
        description: mod.description || '',
        order: mi + 1,
        estimatedTime: 20,
        hasQuiz: false,
        quizQuestions: [],
        contentBlocks
      };
    });

    let totalWords = 0;
    sections.forEach(s => s.contentBlocks.forEach(b => {
      totalWords += (b.textContent || '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(w => w).length;
    }));

    await db.collection('interactivecourses').updateOne(
      { slug },
      { $set: { sections, status: 'draft', updatedAt: new Date() } }
    );

    console.log(`✅ ${slug}: restored ${totalWords}w in ${sections.length} sections`);
  }

  await mongoose.disconnect();
  console.log('\nDone!');
}

restore().catch(e => { console.error('❌', e.message); process.exit(1); });
