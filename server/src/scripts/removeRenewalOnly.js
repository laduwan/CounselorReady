// Fixed script to remove "(Renewal Only)" from all courses except telehealth

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function fixRenewalLabels() {
  try {
    console.log('🔌 Connecting to MongoDB...\n');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;
    const coursesCollection = db.collection('courses');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔄 FIXING RENEWAL LABELS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Get all courses
    const allCourses = await coursesCollection.find({}).toArray();
    console.log(`📊 Found ${allCourses.length} total courses\n`);

    // Step 1: Remove "(Renewal Only)" from ALL courses
    let removedCount = 0;
    for (const course of allCourses) {
      let targetAudience = course.targetAudience;
      
      // Handle array
      if (Array.isArray(targetAudience)) {
        targetAudience = targetAudience.join(', ');
      }
      
      // Handle null/undefined
      if (!targetAudience) {
        targetAudience = 'LPCs, LCSWs, LMFTs, LMHCs';
      }
      
      // Remove "(Renewal Only)" if present
      if (targetAudience.includes('(Renewal Only)')) {
        targetAudience = targetAudience.replace(' (Renewal Only)', '');
        
        await coursesCollection.updateOne(
          { _id: course._id },
          { $set: { targetAudience: targetAudience } }
        );
        removedCount++;
      } else if (Array.isArray(course.targetAudience)) {
        // Still update arrays to strings
        await coursesCollection.updateOne(
          { _id: course._id },
          { $set: { targetAudience: targetAudience } }
        );
      }
    }

    console.log(`✅ Cleaned ${removedCount} courses with "(Renewal Only)" label\n`);

    // Step 2: Add "(Renewal Only)" ONLY to telehealth courses
    const telehealthCourses = await coursesCollection.find({
      $or: [
        { title: { $regex: /telehealth/i } },
        { description: { $regex: /telehealth/i } },
        { slug: { $regex: /telehealth/i } },
        { code: 'CR-505' } // Explicitly include the telehealth ethics course
      ]
    }).toArray();

    console.log(`📡 Found ${telehealthCourses.length} telehealth courses:\n`);

    for (const course of telehealthCourses) {
      let targetAudience = course.targetAudience;
      
      // Handle array
      if (Array.isArray(targetAudience)) {
        targetAudience = targetAudience.join(', ');
      }
      
      // Add "(Renewal Only)" if not already present
      if (!targetAudience.includes('(Renewal Only)')) {
        await coursesCollection.updateOne(
          { _id: course._id },
          {
            $set: {
              targetAudience: targetAudience + ' (Renewal Only)',
              updatedAt: new Date()
            }
          }
        );
        console.log(`   ✅ ${course.code} - ${course.title}`);
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ RENEWAL LABELS FIXED');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('Only telehealth courses have "(Renewal Only)" label');
    console.log('All other courses have clean target audience labels\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('✅ Database connection closed\n');
  }
}

fixRenewalLabels();
