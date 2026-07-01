// recalcAllWordCounts.js
// Re-saves every InteractiveCourse document to trigger the pre-save word count hook.
// Run: node recalcAllWordCounts.js
// Requires: MONGODB_URI environment variable

import mongoose from 'mongoose';
import { Course as InteractiveCourse } from '../models/InteractiveCourse.js';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ No MONGODB_URI environment variable set');
  process.exit(1);
}

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB\n');

  const courses = await InteractiveCourse.find({}).lean();
  console.log(`Found ${courses.length} courses\n`);

  let increased = 0, decreased = 0, unchanged = 0, skipped = 0;

  for (const raw of courses) {
    const oldWc = raw.wordCount ?? 0;
    const slug = (raw.slug || String(raw._id)).padEnd(30).slice(0, 30);

    try {
      const doc = await InteractiveCourse.findById(raw._id);
      await doc.save();
      const newWc = doc.wordCount ?? 0;

      const title = (raw.title || '(untitled)').slice(0, 50);
      const arrow = oldWc === newWc ? '==' : oldWc < newWc ? '->' : '->';
      console.log(`${slug} | ${String(oldWc).padStart(6)} ${arrow} ${String(newWc).padEnd(6)} | ${title}`);

      if (newWc > oldWc) increased++;
      else if (newWc < oldWc) decreased++;
      else unchanged++;
    } catch (err) {
      skipped++;
      console.log(`✗ SKIPPED ${(raw.slug || String(raw._id))}: ${err.message}`);
    }
  }

  console.log('\n── Summary ────────────────────────────────────────────');
  console.log(`  Total recalculated : ${courses.length}`);
  console.log(`  Increased          : ${increased}`);
  console.log(`  Decreased          : ${decreased}`);
  console.log(`  Unchanged          : ${unchanged}`);
  console.log(`  Skipped            : ${skipped}`);

  await mongoose.disconnect();
}

run().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
