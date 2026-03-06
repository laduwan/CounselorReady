/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// fixVideoLessons.js
// Run with: node src/data/fixVideoLessons.js
// Place in: server/src/data/fixVideoLessons.js
//
// This script converts broken video lessons to text lessons while preserving
// the original video URL for later restoration.

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../models/Course.js';

dotenv.config();

// ===========================================
// CONVERT VIDEO LESSONS TO TEXT
// ===========================================

const convertVideosToText = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');
    
    const courses = await Course.find({});
    let totalConverted = 0;
    let totalSkipped = 0;
    
    for (const course of courses) {
      let courseModified = false;
      
      for (const module of course.modules) {
        for (const lesson of module.lessons) {
          // Skip if not a video lesson
          if (lesson.type !== 'video') {
            continue;
          }
          
          // Skip if video URL is working (you can add known working URLs here)
          const workingVideoIds = [
            // Add YouTube video IDs that are confirmed working
            // Example: 'dQw4w9WgXcQ'
          ];
          
          const videoId = lesson.videoUrl?.match(/(?:v=|\/)([\w-]{11})(?:\?|&|$)/)?.[1];
          if (videoId && workingVideoIds.includes(videoId)) {
            totalSkipped++;
            continue;
          }
          
          // Convert to text lesson
          // Store original video info in content for reference
          const originalVideoUrl = lesson.videoUrl || '';
          const originalContent = lesson.content || '';
          
          lesson.type = 'text';
          lesson.content = `${originalContent}\n\n---\n[Video placeholder - Original URL: ${originalVideoUrl}]`;
          lesson.originalVideoUrl = originalVideoUrl; // Preserve for later
          
          courseModified = true;
          totalConverted++;
          console.log(`  📝 Converted: ${course.title} > ${module.title} > ${lesson.title}`);
        }
      }
      
      if (courseModified) {
        await course.save();
        console.log(`✅ Saved: ${course.title}\n`);
      }
    }
    
    console.log('\n✨ Conversion complete!');
    console.log(`   Converted: ${totalConverted} lessons`);
    console.log(`   Skipped: ${totalSkipped} lessons (working videos)`);
    
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

// ===========================================
// RESTORE VIDEO TO A SPECIFIC LESSON
// ===========================================

const restoreVideo = async (courseSlug, moduleIndex, lessonIndex, newVideoUrl) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');
    
    const course = await Course.findOne({ slug: courseSlug });
    
    if (!course) {
      console.log(`❌ Course not found: ${courseSlug}`);
      await mongoose.connection.close();
      return;
    }
    
    const module = course.modules[moduleIndex];
    if (!module) {
      console.log(`❌ Module ${moduleIndex} not found`);
      await mongoose.connection.close();
      return;
    }
    
    const lesson = module.lessons[lessonIndex];
    if (!lesson) {
      console.log(`❌ Lesson ${lessonIndex} not found`);
      await mongoose.connection.close();
      return;
    }
    
    // Restore as video
    lesson.type = 'video';
    lesson.videoUrl = newVideoUrl;
    
    // Clean up content (remove placeholder text)
    if (lesson.content) {
      lesson.content = lesson.content.replace(/\n\n---\n\[Video placeholder.*\]/, '').trim();
    }
    
    await course.save();
    
    console.log(`✅ Restored video for: ${lesson.title}`);
    console.log(`   URL: ${newVideoUrl}`);
    
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

// ===========================================
// LIST ALL LESSONS WITH VIDEO PLACEHOLDERS
// ===========================================

const listPlaceholders = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');
    console.log('='.repeat(80));
    console.log('LESSONS WITH VIDEO PLACEHOLDERS');
    console.log('='.repeat(80));
    
    const courses = await Course.find({});
    let count = 0;
    
    for (const course of courses) {
      let courseHasPlaceholders = false;
      
      for (let mi = 0; mi < course.modules.length; mi++) {
        const module = course.modules[mi];
        
        for (let li = 0; li < module.lessons.length; li++) {
          const lesson = module.lessons[li];
          
          // Check if it's a converted placeholder
          if (lesson.type === 'text' && lesson.content?.includes('[Video placeholder')) {
            if (!courseHasPlaceholders) {
              console.log(`\n📚 ${course.title} (${course.slug})`);
              courseHasPlaceholders = true;
            }
            
            const originalUrl = lesson.originalVideoUrl || 
              lesson.content.match(/Original URL: (https:\/\/[^\]]+)/)?.[1] || 'N/A';
            
            console.log(`   [${mi},${li}] ${lesson.title}`);
            console.log(`          Original: ${originalUrl}`);
            count++;
          }
        }
      }
    }
    
    console.log('\n' + '='.repeat(80));
    console.log(`Total placeholders: ${count}`);
    console.log('\nTo restore a video, run:');
    console.log('  node src/data/fixVideoLessons.js restore <course-slug> <moduleIndex> <lessonIndex> <youtubeUrl>');
    console.log('\nExample:');
    console.log('  node src/data/fixVideoLessons.js restore self-care-clinicians 0 0 "https://www.youtube.com/watch?v=abc123"');
    
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

// ===========================================
// BULK RESTORE FROM JSON FILE
// ===========================================

const bulkRestore = async (jsonFilePath) => {
  try {
    const fs = await import('fs');
    const data = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');
    
    let restored = 0;
    
    for (const item of data) {
      const { courseSlug, moduleIndex, lessonIndex, videoUrl } = item;
      
      const course = await Course.findOne({ slug: courseSlug });
      if (!course) continue;
      
      const lesson = course.modules[moduleIndex]?.lessons[lessonIndex];
      if (!lesson) continue;
      
      lesson.type = 'video';
      lesson.videoUrl = videoUrl;
      
      if (lesson.content) {
        lesson.content = lesson.content.replace(/\n\n---\n\[Video placeholder.*\]/, '').trim();
      }
      
      await course.save();
      console.log(`✅ ${courseSlug} [${moduleIndex},${lessonIndex}]: ${lesson.title}`);
      restored++;
    }
    
    console.log(`\n✨ Restored ${restored} videos`);
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

// ===========================================
// CLI HANDLER
// ===========================================

const command = process.argv[2];

switch (command) {
  case 'convert':
    convertVideosToText();
    break;
    
  case 'list':
    listPlaceholders();
    break;
    
  case 'restore':
    const courseSlug = process.argv[3];
    const moduleIndex = parseInt(process.argv[4]);
    const lessonIndex = parseInt(process.argv[5]);
    const videoUrl = process.argv[6];
    
    if (!courseSlug || isNaN(moduleIndex) || isNaN(lessonIndex) || !videoUrl) {
      console.log('Usage: node fixVideoLessons.js restore <course-slug> <moduleIndex> <lessonIndex> <videoUrl>');
      process.exit(1);
    }
    
    restoreVideo(courseSlug, moduleIndex, lessonIndex, videoUrl);
    break;
    
  case 'bulk':
    const jsonPath = process.argv[3];
    if (!jsonPath) {
      console.log('Usage: node fixVideoLessons.js bulk <path-to-json>');
      console.log('\nJSON format:');
      console.log('[');
      console.log('  { "courseSlug": "...", "moduleIndex": 0, "lessonIndex": 0, "videoUrl": "..." },');
      console.log('  ...');
      console.log(']');
      process.exit(1);
    }
    bulkRestore(jsonPath);
    break;
    
  default:
    console.log('Video Lesson Management Tool');
    console.log('============================\n');
    console.log('Commands:');
    console.log('  convert  - Convert all video lessons to text (run this first)');
    console.log('  list     - Show all lessons with video placeholders');
    console.log('  restore  - Restore a single lesson to video');
    console.log('  bulk     - Restore multiple videos from JSON file\n');
    console.log('Usage:');
    console.log('  node src/data/fixVideoLessons.js convert');
    console.log('  node src/data/fixVideoLessons.js list');
    console.log('  node src/data/fixVideoLessons.js restore <slug> <module> <lesson> <url>');
    console.log('  node src/data/fixVideoLessons.js bulk <json-file>');
}
