// backfill-word-count.js
// Loads every course with wordCount=0 or missing, calls .save() so the
// pre-save hook fires and recomputes wordCount + totalContentBlocks.
//
// Safe to re-run — skips courses that already have wordCount > 0.
// Use --force to recompute all courses regardless.
//
// Run: node src/scripts/backfill-word-count.js
// Run: node src/scripts/backfill-word-count.js --force

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
const FORCE = process.argv.includes('--force');

if (!MONGODB_URI) { console.error('ERROR: MONGODB_URI not set'); process.exit(1); }

await mongoose.connect(MONGODB_URI);
console.log('✓ Connected to MongoDB\n');

// Import the real model so the pre-save hook fires
const { default: InteractiveCourse } = await import('../models/InteractiveCourse.js');

const query = FORCE ? {} : {
  $or: [
    { wordCount: { $exists: false } },
    { wordCount: 0 },
    { wordCount: null }
  ]
};

const courses = await InteractiveCourse.find(query).select('_id title slug courseCode wordCount ceHours sections').lean();
console.log(`Found ${courses.length} course(s) to backfill${FORCE ? ' (--force)' : ''}\n`);

const stats = { updated: 0, skipped: 0, errors: 0 };

for (const c of courses) {
  try {
    const doc = await InteractiveCourse.findById(c._id);
    if (!doc) { stats.skipped++; continue; }

    const before = doc.wordCount || 0;
    await doc.save(); // fires pre-save hook → recomputes wordCount
    const after = doc.wordCount || 0;

    const ceHours = doc.ceHours || 0;
    const floor = ceHours * 6000;
    const status = after >= floor ? '✓' : after === 0 ? '⚠ still 0' : '⚠ below floor';

    console.log(`  ${status}  ${(doc.courseCode || doc.slug || doc._id.toString()).padEnd(30)} ${before.toString().padStart(6)} → ${after.toString().padStart(6)} wc  (${ceHours}CE, needs ${floor})`);
    stats.updated++;
  } catch (err) {
    console.error(`  ERR  ${c.slug || c._id} — ${err.message}`);
    stats.errors++;
  }
}

console.log('\n=== Backfill Complete ===');
console.log(`  Updated: ${stats.updated}`);
console.log(`  Skipped: ${stats.skipped}`);
console.log(`  Errors:  ${stats.errors}`);
console.log('\nRe-run audit in admin-analytics to verify.');

await mongoose.disconnect();
