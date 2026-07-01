/**
 * fixMissingCorrectAnswers.js
 * Sets correctAnswer: 1 on all multipleChoice blocks missing it.
 * Run: node src/scripts/fixMissingCorrectAnswers.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const CODES = ['CR-303', 'CR-401', 'CR-402', 'CR-NEU', 'CR-PHY', 'CR-TIC'];

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('interactivecourses');

  const courses = await col.find({ courseCode: { $in: CODES } }).toArray();
  console.log(`Found ${courses.length} courses to check\n`);

  let totalFixed = 0;

  for (const course of courses) {
    let fixed = 0;
    const sections = course.sections || [];

    for (const section of sections) {
      for (const block of (section.contentBlocks || [])) {
        if (block.type === 'multipleChoice' &&
            (block.correctAnswer === undefined || block.correctAnswer === null)) {
          block.correctAnswer = 1;
          fixed++;
        }
      }
    }

    if (fixed > 0) {
      await col.updateOne({ _id: course._id }, { $set: { sections } });
      console.log(`✓ ${course.courseCode} — ${course.title.slice(0, 50)}`);
      console.log(`  Fixed ${fixed} KCs (correctAnswer set to 1)\n`);
      totalFixed += fixed;
    } else {
      console.log(`✓ ${course.courseCode} — no missing correctAnswers\n`);
    }
  }

  console.log('────────────────────────────────');
  console.log(`Total KCs fixed: ${totalFixed}`);
  console.log('\nNote: correctAnswer defaulted to index 1. Verify in CourseBuilder before publishing.');
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
