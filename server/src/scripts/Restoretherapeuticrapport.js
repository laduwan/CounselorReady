/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
#!/usr/bin/env node
/**
 * Restore therapeutic-rapport from legacy `courses` collection
 * to `interactivecourses` format (sections/contentBlocks)
 * 
 * Run: node src/scripts/restoreTherapeuticRapport.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function restore() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  // Pull from legacy
  const legacy = await db.collection('courses').findOne({ title: /therapeutic rapport/i });
  if (!legacy) { console.log('❌ Not found in courses collection'); process.exit(1); }

  console.log(`Found: "${legacy.title}"`);
  console.log(`Modules: ${legacy.modules?.length || 0}`);

  // Convert modules/lessons → sections/contentBlocks
  const sections = (legacy.modules || []).map((mod, mi) => {
    const contentBlocks = (mod.lessons || []).map((lesson, li) => {
      return {
        type: 'text',
        order: li + 1,
        textContent: lesson.content || lesson.textContent || ''
      };
    }).filter(b => b.textContent.length > 0);

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

  // Count words
  let totalWords = 0;
  sections.forEach(s => {
    s.contentBlocks.forEach(b => {
      totalWords += (b.textContent || '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(w => w).length;
    });
  });

  console.log(`Sections: ${sections.length}`);
  console.log(`Total words: ${totalWords}`);

  // Get existing interactive course to preserve assessment/metadata
  const existing = await db.collection('interactivecourses').findOne({ slug: 'therapeutic-rapport' });

  const update = {
    sections,
    status: 'draft',
    updatedAt: new Date()
  };

  // Only overwrite sections — keep assessment, objectives, etc. if they exist
  await db.collection('interactivecourses').updateOne(
    { slug: 'therapeutic-rapport' },
    { $set: update }
  );

  // Verify
  const verify = await db.collection('interactivecourses').findOne({ slug: 'therapeutic-rapport' });
  let verifyWords = 0;
  (verify.sections || []).forEach(s => {
    (s.contentBlocks || []).forEach(b => {
      verifyWords += (b.textContent || '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(w => w).length;
    });
  });

  console.log(`\n✅ Restored: ${verifyWords} words in ${verify.sections?.length} sections`);
  console.log(`Assessment: ${verify.assessment?.questions?.length || 0} questions`);

  await mongoose.disconnect();
}

restore().catch(e => { console.error('❌', e.message); process.exit(1); });
