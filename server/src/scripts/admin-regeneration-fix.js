/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// ============================================================
// ADMIN.JS REGENERATION BUG FIX
// ============================================================
// 
// PROBLEM: Lesson regeneration fails with "Course validation failed"
// Two issues hit on every course.save() at ~line 2996:
//
//   1. description: Path `description` is required. (value: '')
//   2. assessment.questions.*.type: `multiple-choice` is not a valid enum
//
// ROOT CAUSES:
//   - Course was created with empty description field
//   - The seed script (seedNewCourses.js) writes questions with 
//     type: 'multiple-choice' (hyphenated), but the Course model 
//     enum expects 'multipleChoice' (camelCase)
//
// ============================================================
// 
// INSTRUCTIONS: Find the regeneration save block in admin.js 
// around line ~2990-2996. It probably looks like:
//
//     await course.save();
//
// Add this sanitization block BEFORE that save:
//
// ============================================================

// --- PASTE THIS BLOCK before `await course.save()` in the regeneration handler ---

// Fix 1: Ensure description is not empty (required by schema)
if (!course.description || course.description.trim() === '') {
  course.description = `This continuing education course provides an in-depth exploration of ${course.title}. Designed for licensed mental health professionals, this ${course.ceHours || 3}-hour course meets NBCC ACEP standards and covers evidence-based approaches, clinical applications, and ethical considerations.`;
}

// Fix 2: Sanitize assessment question types (multiple-choice → multipleChoice)
if (course.assessment && course.assessment.questions) {
  course.assessment.questions.forEach(q => {
    if (q.type === 'multiple-choice') {
      q.type = 'multipleChoice';
    }
    if (q.type === 'multiple-select' || q.type === 'multi-select') {
      q.type = 'multiSelect';
    }
    if (q.type === 'true-false' || q.type === 'true_false') {
      q.type = 'trueFalse';
    }
  });
}

// --- END OF FIX BLOCK ---
// Now the existing `await course.save();` will succeed.


// ============================================================
// ALTERNATIVE: ONE-TIME DATABASE FIX
// ============================================================
// If you also want to fix ALL existing courses in the database 
// that have these bad values, run this script via:
//   node fix-course-validation.js
//
// Save as: server/src/scripts/fix-course-validation.js
// ============================================================

/*
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function fixCourses() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const Course = mongoose.connection.models.Course || 
    mongoose.model('Course', new mongoose.Schema({}, { strict: false }));

  // Fix 1: Empty descriptions
  const emptyDesc = await Course.updateMany(
    { $or: [{ description: '' }, { description: null }, { description: { $exists: false } }] },
    [{ $set: { 
      description: { 
        $concat: [
          'This continuing education course provides an in-depth exploration of ',
          { $ifNull: ['$title', 'clinical practice'] },
          '. Designed for licensed mental health professionals seeking NBCC-approved CE credits.'
        ]
      }
    }}]
  );
  console.log(`Fixed ${emptyDesc.modifiedCount} courses with empty descriptions`);

  // Fix 2: multiple-choice → multipleChoice in assessment questions
  const badEnum = await Course.updateMany(
    { 'assessment.questions.type': 'multiple-choice' },
    { $set: { 'assessment.questions.$[q].type': 'multipleChoice' } },
    { arrayFilters: [{ 'q.type': 'multiple-choice' }] }
  );
  console.log(`Fixed ${badEnum.modifiedCount} courses with bad question type enum`);

  await mongoose.disconnect();
  console.log('Done!');
}

fixCourses().catch(console.error);
*/
