// fixModulesToSections.js
// For courses in the CR-630–634 range: renames modules[] to sections[] via raw
// collection update, then re-saves through the Mongoose model to recompute wordCount.
// Run: node fixModulesToSections.js
// Requires: MONGODB_URI environment variable

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import InteractiveCourseModels from '../models/InteractiveCourse.js';
const { Course } = InteractiveCourseModels;

const TARGET_CODES = ['CR-630', 'CR-631', 'CR-632', 'CR-633', 'CR-634'];

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.collection('interactivecourses');

  console.log('');

  for (const code of TARGET_CODES) {
    const raw = await col.findOne({ courseCode: code });

    if (!raw) {
      console.log(`  NOT FOUND: ${code}`);
      continue;
    }

    const title = (raw.title || '').slice(0, 60);
    const hasModules  = Array.isArray(raw.modules) && raw.modules.length > 0;
    const hasSections = Array.isArray(raw.sections) && raw.sections.length > 0;

    if (!hasModules) {
      console.log(`  SKIP ${code} — no modules[] array: "${title}"`);
      continue;
    }

    if (hasSections) {
      console.log(`  SKIP ${code} — already has sections[] (${raw.sections.length}): "${title}"`);
      continue;
    }

    // Rename modules → sections via raw update (no pre-save hook)
    await col.updateOne(
      { _id: raw._id },
      { $set: { sections: raw.modules }, $unset: { modules: '' } }
    );
    console.log(`  RENAMED modules[${raw.modules.length}] → sections[] on ${code}: "${title}"`);

    // Re-save through Mongoose model to trigger pre-save word count hook
    const doc = await Course.findById(raw._id);
    const oldWc = doc.wordCount ?? 0;
    await doc.save();
    console.log(`  WORD COUNT ${code}: ${oldWc} → ${doc.wordCount ?? 0}`);
    console.log('');
  }

  await mongoose.disconnect();
}

run().catch(e => { console.error(e); process.exit(1); });
