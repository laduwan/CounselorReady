// fixWordCounts.js — Calculate and store wordCount + moduleCount on all courses
// The admin list page reads course.wordCount and course.moduleCount
// but the API strips lesson content from the list response.
// This script pre-calculates those fields from the actual content.
// Run: node src/scripts/fixWordCounts.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

function countWords(html) {
  return (html || '').replace(/<[^>]*>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim().split(/\s+/).filter(w => w).length;
}

async function run() {
  console.log('\n' + '═'.repeat(60));
  console.log('  FIX WORD COUNTS — Pre-calculate for admin display');
  console.log('═'.repeat(60));

  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db;
  console.log('\n  ✅ Connected\n');

  const courses = await db.collection('courses').find({}).toArray();
  
  let updated = 0;
  for (const course of courses) {
    let totalWords = 0;
    let moduleCount = 0;
    let lessonCount = 0;

    for (const m of (course.modules || [])) {
      moduleCount++;
      for (const l of (m.lessons || [])) {
        lessonCount++;
        totalWords += countWords(l.content);
        // Also count contentBlocks if present
        if (l.contentBlocks && Array.isArray(l.contentBlocks)) {
          for (const block of l.contentBlocks) {
            totalWords += countWords(block.content);
            totalWords += countWords(block.text);
            totalWords += countWords(block.question);
            totalWords += countWords(block.explanation);
          }
        }
      }
    }

    const result = await db.collection('courses').updateOne(
      { _id: course._id },
      { $set: { wordCount: totalWords, moduleCount: moduleCount, lessonCount: lessonCount } }
    );

    const ce = course.ceHours || course.ceuHours || 0;
    const target = ce * 6000;
    const pct = target > 0 ? Math.round(totalWords * 100 / target) : 0;
    const status = pct >= 90 ? '✅' : pct >= 50 ? '🟡' : totalWords > 0 ? '🔧' : '❌';
    
    console.log(`  ${status} ${(course.title || 'Untitled').substring(0, 50)}`);
    console.log(`     ${totalWords.toLocaleString()} words | ${moduleCount}M ${lessonCount}L | ${ce}CE | ${pct}%`);
    updated++;
  }

  console.log(`\n  ────────────────────────────────────────`);
  console.log(`  Updated ${updated} courses with wordCount/moduleCount fields`);

  await mongoose.disconnect();
  console.log('\n✅ Done\n');
}

run().catch(err => { console.error('❌', err.message); process.exit(1); });
