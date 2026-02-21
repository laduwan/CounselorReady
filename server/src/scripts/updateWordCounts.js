/**
 * updateWordCounts.js
 * 
 * Computes and stores wordCount + sectionCount on each course
 * so the admin dashboard can display accurate info without
 * needing to download full course content.
 * 
 * Run: node src/scripts/updateWordCounts.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);
console.log('Connected to MongoDB\n');

const db = mongoose.connection.db;
const c = db.collection('interactivecourses');
const all = await c.find({}).toArray();

let updated = 0;

for (const course of all) {
  let words = 0;
  let sectionCount = 0;
  let moduleCount = 0;
  let assessmentCount = course.assessment?.questions?.length || 0;

  // Count from sections
  if (course.sections) {
    sectionCount = course.sections.length;
    for (const sec of course.sections) {
      for (const block of (sec.contentBlocks || [])) {
        const text = block.textContent || block.content || block.body || '';
        const plain = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        if (plain) words += plain.split(' ').length;
      }
    }
  }

  // Count from modules (old format, if present)
  if (course.modules) {
    moduleCount = course.modules.length;
    for (const mod of course.modules) {
      for (const block of (mod.contentBlocks || [])) {
        const text = block.textContent || block.content || '';
        const plain = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        if (plain) words += plain.split(' ').length;
      }
      for (const lesson of (mod.lessons || [])) {
        const text = lesson.content || '';
        const plain = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        if (plain) words += plain.split(' ').length;
      }
    }
  }

  const op = {};
  op["$set"] = {
    wordCount: words,
    sectionCount: sectionCount,
    moduleCount: moduleCount || sectionCount,
    assessmentQuestionCount: assessmentCount
  };

  await c.updateOne({ _id: course._id }, op);
  console.log(`  ${course.slug} | ${words} words | ${sectionCount} sections | ${assessmentCount} aQs`);
  updated++;
}

console.log(`\nUpdated ${updated} courses`);
await mongoose.disconnect();
