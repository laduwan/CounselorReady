/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// addDBTVideo.js
// Adds a video lesson to DBT course Module 3 (Distress Tolerance)
// Run: node src/scripts/addDBTVideo.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function addVideo() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');
  
  const db = mongoose.connection.db;
  
  // The new video lesson to add
  const newLesson = {
    title: 'Distress Tolerance Introduction',  // <-- Change this title as needed
    type: 'video',
    content: 'Introduction to distress tolerance skills in DBT.',  // <-- Change description
    videoUrl: 'https://www.youtube.com/watch?v=JcwIIMfbgA0',  // Your video
    duration: 10,  // <-- Adjust duration in minutes
    order: 0  // Will be inserted at the beginning
  };
  
  // Find the DBT course
  const course = await db.collection('courses').findOne({ slug: 'dbt-skills-in-action' });
  
  if (!course) {
    console.log('❌ DBT course not found!');
    process.exit(1);
  }
  
  console.log('Found course:', course.title);
  console.log('Modules:', course.modules?.length);
  
  // Find Module 3 (Distress Tolerance - order: 3)
  const moduleIndex = course.modules.findIndex(m => m.order === 3 || m.title === 'Distress Tolerance Skills');
  
  if (moduleIndex === -1) {
    console.log('❌ Module 3 (Distress Tolerance) not found!');
    console.log('Available modules:', course.modules.map(m => `${m.order}: ${m.title}`));
    process.exit(1);
  }
  
  console.log(`\nFound Module 3: "${course.modules[moduleIndex].title}"`);
  console.log('Current lessons:', course.modules[moduleIndex].lessons?.map(l => `  - ${l.order}: ${l.title}`).join('\n'));
  
  // Shift existing lessons order by 1
  const updatedLessons = course.modules[moduleIndex].lessons.map(lesson => ({
    ...lesson,
    order: lesson.order + 1
  }));
  
  // Add new lesson at the beginning
  newLesson.order = 1;
  updatedLessons.unshift(newLesson);
  
  // Update the course
  const result = await db.collection('courses').updateOne(
    { slug: 'dbt-skills-in-action' },
    { 
      $set: { 
        [`modules.${moduleIndex}.lessons`]: updatedLessons,
        updatedAt: new Date()
      } 
    }
  );
  
  console.log('\n✅ Video added successfully!');
  console.log('Modified:', result.modifiedCount);
  console.log('\nNew lesson order:');
  updatedLessons.forEach(l => console.log(`  ${l.order}: ${l.title}`));
  
  await mongoose.disconnect();
  console.log('\nDone!');
}

addVideo().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
