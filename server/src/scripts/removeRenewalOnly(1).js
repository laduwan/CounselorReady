// Script to remove "(Renewal Only)" from all courses except telehealth

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

    // Step 1: Remove "(Renewal Only)" from ALL courses
    const removeResult = await coursesCollection.updateMany(
      {},
      [
        {
          $set: {
            targetAudience: {
              $replaceAll: {
                input: "$targetAudience",
                find: " (Renewal Only)",
                replacement: ""
              }
            }
          }
        }
      ]
    );

    console.log(`✅ Removed "(Renewal Only)" from ${removeResult.modifiedCount} courses\n`);

    // Step 2: Add "(Renewal Only)" ONLY to telehealth courses
    const telehealthCourses = await coursesCollection.find({
      $or: [
        { title: { $regex: /telehealth/i } },
        { description: { $regex: /telehealth/i } },
        { slug: { $regex: /telehealth/i } }
      ]
    }).toArray();

    console.log(`📡 Found ${telehealthCourses.length} telehealth courses:\n`);

    for (const course of telehealthCourses) {
      await coursesCollection.updateOne(
        { _id: course._id },
        {
          $set: {
            targetAudience: course.targetAudience + ' (Renewal Only)',
            updatedAt: new Date()
          }
        }
      );
      console.log(`   ✅ ${course.code} - ${course.title}`);
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
