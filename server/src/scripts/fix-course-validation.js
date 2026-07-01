/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// fix-course-validation.js
// Run with: node fix-course-validation.js
// Location: server/src/scripts/fix-course-validation.js
//
// Fixes two bugs that prevent lesson regeneration from saving:
// 1. Empty description field (required by Course schema)
// 2. 'multiple-choice' enum value (should be 'multipleChoice')

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function fixCourses() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB\n');

  const Course = mongoose.connection.models.Course || 
    mongoose.model('Course', new mongoose.Schema({}, { strict: false }));

  // --- Fix 1: Empty descriptions ---
  const coursesNoDesc = await Course.find({ 
    $or: [
      { description: '' }, 
      { description: null }, 
      { description: { $exists: false } }
    ] 
  }).select('title ceHours');

  console.log(`Found ${coursesNoDesc.length} courses with empty descriptions:`);
  
  for (const c of coursesNoDesc) {
    const desc = `This continuing education course provides an in-depth exploration of ${c.title}. Designed for licensed mental health professionals, this ${c.ceHours || 3}-hour course meets NBCC ACEP standards and covers evidence-based approaches, clinical applications, and ethical considerations.`;
    await Course.updateOne({ _id: c._id }, { $set: { description: desc } });
    console.log(`  ✅ Fixed: ${c.title}`);
  }

  // --- Fix 2: Bad enum values in assessment questions ---
  const typeFixMap = {
    'multiple-choice': 'multipleChoice',
    'multiple-select': 'multiSelect',
    'multi-select': 'multiSelect',
    'true-false': 'trueFalse',
    'true_false': 'trueFalse',
  };

  for (const [badType, goodType] of Object.entries(typeFixMap)) {
    const result = await Course.updateMany(
      { 'assessment.questions.type': badType },
      { $set: { 'assessment.questions.$[q].type': goodType } },
      { arrayFilters: [{ 'q.type': badType }] }
    );
    if (result.modifiedCount > 0) {
      console.log(`\n  ✅ Fixed ${result.modifiedCount} courses: '${badType}' → '${goodType}'`);
    }
  }

  // --- Summary ---
  const totalCourses = await Course.countDocuments();
  console.log(`\n══════════════════════════════════════`);
  console.log(`Total courses in database: ${totalCourses}`);
  console.log(`Descriptions fixed: ${coursesNoDesc.length}`);
  console.log(`══════════════════════════════════════\n`);

  await mongoose.disconnect();
  console.log('Done! You can now retry lesson regeneration.');
}

fixCourses().catch(console.error);
