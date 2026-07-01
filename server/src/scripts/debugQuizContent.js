/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * Debug script: dump sample quiz-like content from the DB
 * to understand the actual format stored in MongoDB.
 *
 * Usage: node src/scripts/debugQuizContent.js
 */
const mongoose = require('mongoose');
require('dotenv').config();

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const db = mongoose.connection.db;
  const courses = await db.collection('interactivecourses').find({}).toArray();
  console.log('Total courses:', courses.length);

  // First, show the schema shape of a single course
  if (courses.length > 0) {
    const sample = courses[0];
    console.log('\n=== SCHEMA SHAPE (first course) ===');
    console.log('Top-level keys:', Object.keys(sample));
    console.log('Title:', sample.title);

    // Check if modules exists and what it looks like
    if (sample.modules) {
      console.log('modules type:', typeof sample.modules, Array.isArray(sample.modules) ? '(array, len=' + sample.modules.length + ')' : '');
      if (Array.isArray(sample.modules) && sample.modules.length > 0) {
        console.log('First module keys:', Object.keys(sample.modules[0]));
        const firstMod = sample.modules[0];
        if (firstMod.sections && Array.isArray(firstMod.sections) && firstMod.sections.length > 0) {
          console.log('First section keys:', Object.keys(firstMod.sections[0]));
          console.log('First section type:', firstMod.sections[0].type);
          console.log('First section title:', firstMod.sections[0].title);
        }
      }
    } else {
      console.log('No "modules" key. Checking other structures...');
      // Maybe it uses a different field name
      for (const key of Object.keys(sample)) {
        const val = sample[key];
        if (Array.isArray(val) && val.length > 0 && typeof val[0] === 'object') {
          console.log('Array field:', key, 'length:', val.length, 'first item keys:', Object.keys(val[0]));
        }
      }
    }
  }

  // Now search for quiz-like content across all courses
  let found = 0;
  const quizPatterns = [/[A-Da-d]\)/, /Option\s+[A-D]/i, /Question\s+\d/i, /✓/, /Knowledge Check/i, /Decision Point/i, /quiz/i];

  for (const course of courses) {
    const modules = course.modules;
    if (!modules || !Array.isArray(modules)) continue;

    for (const mod of modules) {
      const sections = mod.sections;
      if (!sections || !Array.isArray(sections)) continue;

      for (const sec of sections) {
        const content = sec.content || '';
        if (content.length < 20) continue;

        const matchedPatterns = quizPatterns.filter(p => p.test(content));
        if (matchedPatterns.length > 0 && found < 8) {
          found++;
          console.log('\n=== MATCH #' + found + ' ===');
          console.log('Course:', course.title);
          console.log('Module:', mod.title);
          console.log('Section:', sec.title, '| Type:', sec.type);
          console.log('Matched patterns:', matchedPatterns.map(p => p.toString()));
          console.log('Content length:', content.length);
          console.log('Content (first 1000 chars):');
          console.log(content.substring(0, 1000));
          console.log('--- END ---');
        }
      }
    }
  }

  if (found === 0) {
    console.log('\n*** NO QUIZ-LIKE CONTENT FOUND ***');
    console.log('Dumping 3 random sections to understand content format:\n');
    let dumped = 0;
    for (const course of courses) {
      const modules = course.modules;
      if (!modules || !Array.isArray(modules)) continue;
      for (const mod of modules) {
        const sections = mod.sections;
        if (!sections || !Array.isArray(sections)) continue;
        for (const sec of sections) {
          if (sec.content && sec.content.length > 100 && dumped < 3) {
            dumped++;
            console.log('=== SAMPLE #' + dumped + ' ===');
            console.log('Course:', course.title);
            console.log('Module:', mod.title);
            console.log('Section:', sec.title, '| Type:', sec.type);
            console.log('Content (first 600 chars):');
            console.log(sec.content.substring(0, 600));
            console.log('---');
          }
        }
      }
    }

    // Also check if quizzes are stored at module level instead of section level
    console.log('\n=== Checking for quiz data at module level ===');
    for (const course of courses) {
      const modules = course.modules;
      if (!modules || !Array.isArray(modules)) continue;
      for (const mod of modules) {
        const keys = Object.keys(mod);
        const quizKeys = keys.filter(k => /quiz|question|check|test/i.test(k));
        if (quizKeys.length > 0) {
          console.log('Course:', course.title, '| Module:', mod.title, '| Quiz-related keys:', quizKeys);
        }
      }
    }
  }

  console.log('\nTotal quiz-like sections found:', found);
  await mongoose.disconnect();
  console.log('Disconnected');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
