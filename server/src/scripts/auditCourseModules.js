/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// auditCourseModules.js - Show word count per module for the 4 "Nearly There" courses
// Run: node src/scripts/auditCourseModules.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
const courseSchema = new mongoose.Schema({}, { strict: false, collection: 'courses' });
const Course = mongoose.model('Course', courseSchema);

const TARGETS = [
  'Elephant in the Room',
  'Walking on Eggshells',
  'When It Rains',
  'It Takes a Village',
  'Lost in Translation',
  'Beyond the Surface',
  'Pursuit of Happyness',
];

function stripHtml(html) {
  return (html || '').replace(/<[^>]*>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();
}

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected\n');

  for (const search of TARGETS) {
    const course = await Course.findOne({ title: { $regex: new RegExp(search, 'i') } });
    if (!course) { console.log(`❌ NOT FOUND: ${search}\n`); continue; }

    const modules = course.modules || [];
    let totalWords = 0;
    const ceHrs = course.ceHours || course.ceuHours || 0;
    const target = ceHrs * 6000;

    console.log(`═══════════════════════════════════════════════`);
    console.log(`📖 ${course.title}`);
    console.log(`   CE: ${ceHrs} | Target: ${target} words | Modules: ${modules.length}`);
    console.log(`───────────────────────────────────────────────`);

    for (let i = 0; i < modules.length; i++) {
      const m = modules[i];
      const lessons = m.lessons || [];
      let modWords = 0;

      for (const l of lessons) {
        const text = stripHtml(l.content);
        modWords += text.split(/\s+/).filter(w => w).length;
      }

      totalWords += modWords;
      const bar = '█'.repeat(Math.min(20, Math.round(modWords / 500)));
      console.log(`   M${i+1}: ${m.title?.substring(0, 45).padEnd(45)} | ${String(modWords).padStart(5)} words | ${lessons.length} lessons ${bar}`);
    }

    const pct = target > 0 ? Math.round(totalWords * 100 / target) : 0;
    const gap = Math.max(0, target - totalWords);
    console.log(`───────────────────────────────────────────────`);
    console.log(`   TOTAL: ${totalWords} words (${pct}%) | GAP: ${gap} words needed`);
    console.log('');
  }

  await mongoose.disconnect();
}

run();
