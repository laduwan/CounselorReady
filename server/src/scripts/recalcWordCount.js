/**
 * recalcWordCount.js
 * ──────────────────
 * Force-saves all courses with wordCount = 0 or missing,
 * triggering the pre-save hook to recalculate from sections[].
 *
 * Run from Render shell (~/project/src/server):
 *   node src/scripts/recalcWordCount.js
 */

import mongoose from 'mongoose';
import { Course as InteractiveCourse } from '../models/InteractiveCourse.js';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }
await mongoose.connect(process.env.MONGODB_URI);

const courses = await InteractiveCourse.find({
  $or: [{ wordCount: { $lte: 0 } }, { wordCount: { $exists: false } }]
}).select('title courseCode slug wordCount sections');

console.log(`Found ${courses.length} courses with wordCount = 0 or missing\n`);

let fixed = 0;
for (const course of courses) {
  const before = course.wordCount || 0;
  course.markModified('sections');
  try {
    await course.save();
    const after = course.wordCount || 0;
    const status = after > 0 ? '✓' : '⚠';
    console.log(`${status} ${course.courseCode || '(no code)'} — "${course.title?.slice(0,50)}" | ${before} → ${after}`);
    if (after > 0) fixed++;
  } catch(err) {
    console.log(`✗ ${course.courseCode} — SAVE FAILED: ${err.message.slice(0,100)}`);
  }
}

console.log(`\n${fixed}/${courses.length} recalculated successfully`);
await mongoose.disconnect();
