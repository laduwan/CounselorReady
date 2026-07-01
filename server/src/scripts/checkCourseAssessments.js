/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// checkCourseAssessments.js
// Run: node src/scripts/checkCourseAssessments.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);
console.log('Connected\n');

const db = mongoose.connection.db;
const courses = await db.collection('interactivecourses').find({}).toArray();

console.log('=== CHECKING FOR ASSESSMENTS ===\n');

courses.forEach(course => {
  console.log(`📚 ${course.title}`);
  console.log(`   Slug: ${course.slug}`);
  
  // Check for assessment-related fields
  const fields = Object.keys(course);
  console.log(`   Fields: ${fields.join(', ')}`);
  
  // Look for assessment data
  if (course.assessment) console.log('   ✅ Has "assessment" field');
  if (course.finalExam) console.log('   ✅ Has "finalExam" field');
  if (course.exam) console.log('   ✅ Has "exam" field');
  if (course.questions) console.log('   ✅ Has "questions" field');
  if (course.evaluation) console.log('   ✅ Has "evaluation" field');
  
  // Check if any section has assessment content
  let hasQuizBlocks = false;
  course.sections?.forEach(section => {
    section.contentBlocks?.forEach(block => {
      if (block.type === 'multipleChoice' || block.type === 'multiSelect') {
        hasQuizBlocks = true;
      }
    });
  });
  
  if (hasQuizBlocks) console.log('   📝 Has quiz blocks in sections');
  
  console.log('');
});

// Show full structure of first course
console.log('\n=== FULL STRUCTURE OF FIRST COURSE ===\n');
const firstCourse = courses[0];
if (firstCourse) {
  // Remove large content for readability
  const summary = {
    _id: firstCourse._id,
    title: firstCourse.title,
    slug: firstCourse.slug,
    fields: Object.keys(firstCourse),
    sectionCount: firstCourse.sections?.length,
    assessment: firstCourse.assessment || 'NOT FOUND',
    finalExam: firstCourse.finalExam || 'NOT FOUND',
    evaluation: firstCourse.evaluation || 'NOT FOUND'
  };
  console.log(JSON.stringify(summary, null, 2));
}

await mongoose.connection.close();
console.log('\nDone!');
