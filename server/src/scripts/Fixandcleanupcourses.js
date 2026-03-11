/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Course codes to KEEP and convert to 1 CE hour
const COURSES_TO_KEEP = [
  'CR-505',  // Telehealth Ethics
  'CR-702',  // Adolescent Depression & Suicide Prevention
  'CR-803',  // Crisis Intervention & De-escalation
  'CR-1002', // Mindfulness-Based Interventions
  'CR-1004'  // Acceptance and Commitment Therapy
];

// All course codes that were created (36 total)
const ALL_CREATED_COURSES = [
  'CR-301', 'CR-302', 'CR-303', 'CR-304', 'CR-305',
  'CR-401', 'CR-402', 'CR-403', 'CR-404', 'CR-405',
  'CR-501', 'CR-502', 'CR-503', 'CR-504', 'CR-505',
  'CR-602', 'CR-603', 'CR-604', 'CR-605',
  'CR-701', 'CR-702', 'CR-703', 'CR-704',
  'CR-801', 'CR-802', 'CR-803',
  'CR-901', 'CR-902', 'CR-903', 'CR-904',
  'CR-1001', 'CR-1002', 'CR-1003', 'CR-1004', 'CR-1005', 'CR-1006'
];

async function fixCourses() {
  try {
    console.log('🔌 Connecting to MongoDB...\n');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;
    const coursesCollection = db.collection('courses');

    // Step 1: Update the 5 courses we're keeping
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📝 UPDATING 5 COURSES TO 1 CE HOUR');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    for (const courseCode of COURSES_TO_KEEP) {
      const course = await coursesCollection.findOne({ code: courseCode });
      
      if (!course) {
        console.log(`⚠️  ${courseCode} not found, skipping...`);
        continue;
      }

      // Reduce to 2 modules (1 CE = 2 modules at our standard)
      const updatedModules = course.modules.slice(0, 2);

      // Reduce assessment to 10 questions
      const updatedAssessment = course.assessment 
        ? {
            ...course.assessment,
            questions: course.assessment.questions.slice(0, 10),
            totalQuestions: 10,
            passingScore: 80
          }
        : null;

      // Update the course
      await coursesCollection.updateOne(
        { code: courseCode },
        {
          $set: {
            ceHours: 1,
            modules: updatedModules,
            assessment: updatedAssessment,
            updatedAt: new Date()
          }
        }
      );

      console.log(`✅ ${courseCode} - ${course.title}`);
      console.log(`   📊 CE Hours: 3 → 1`);
      console.log(`   📑 Modules: ${course.modules.length} → 2`);
      console.log(`   ❓ Questions: 15 → 10\n`);
    }

    // Step 2: Delete the 31 courses we're NOT keeping
    const coursesToDelete = ALL_CREATED_COURSES.filter(
      code => !COURSES_TO_KEEP.includes(code)
    );

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🗑️  DELETING 31 NON-COMPLIANT COURSES');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const deleteResult = await coursesCollection.deleteMany({
      code: { $in: coursesToDelete }
    });

    console.log(`✅ Deleted ${deleteResult.deletedCount} courses\n`);

    // Step 3: Verify results
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 FINAL SUMMARY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const remainingCourses = await coursesCollection
      .find({ code: { $in: COURSES_TO_KEEP } })
      .toArray();

    console.log(`✅ Courses Kept: ${remainingCourses.length}`);
    console.log(`🎯 Total CE Hours: ${remainingCourses.length * 1} hours\n`);

    remainingCourses.forEach(course => {
      console.log(`   📚 ${course.code} - ${course.title}`);
      console.log(`      CE: ${course.ceHours} | Modules: ${course.modules.length} | Questions: ${course.assessment?.questions?.length || 0}`);
    });

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ CLEANUP COMPLETE!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('Next Steps:');
    console.log('1. ✅ Review the 5 courses in admin panel');
    console.log('2. ✅ Enhance content if needed (aim for 6,000 words per CE)');
    console.log('3. ✅ Publish when ready');
    console.log('4. ✅ Create additional ACEP-compliant courses\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('✅ Database connection closed\n');
  }
}

fixCourses();
