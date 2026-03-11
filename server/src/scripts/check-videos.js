/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// Run with: node check-videos.js
// This checks all video URLs in your courses to see which are broken

const mongoose = require('mongoose');
require('dotenv').config();

async function checkYouTubeUrl(url) {
  try {
    // Extract video ID
    let videoId;
    if (url.includes('v=')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    }
    
    if (!videoId) return { valid: false, reason: 'Could not extract video ID' };
    
    // Check using YouTube's oembed endpoint (no API key needed)
    const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
    
    if (response.ok) {
      const data = await response.json();
      return { valid: true, title: data.title };
    } else {
      return { valid: false, reason: 'Video not available' };
    }
  } catch (error) {
    return { valid: false, reason: error.message };
  }
}

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB\n');
  
  const courses = await mongoose.connection.db.collection('courses').find({}).toArray();
  
  let totalVideos = 0;
  let brokenVideos = 0;
  let workingVideos = 0;
  const broken = [];
  
  for (const course of courses) {
    console.log(`\n📚 Checking: ${course.title}`);
    console.log('─'.repeat(50));
    
    if (!course.modules) continue;
    
    for (const module of course.modules) {
      if (!module.lessons) continue;
      
      for (const lesson of module.lessons) {
        if (lesson.type === 'video' && lesson.videoUrl) {
          totalVideos++;
          process.stdout.write(`  Checking "${lesson.title}"... `);
          
          const result = await checkYouTubeUrl(lesson.videoUrl);
          
          if (result.valid) {
            console.log('✅ Working');
            workingVideos++;
          } else {
            console.log(`❌ BROKEN - ${result.reason}`);
            brokenVideos++;
            broken.push({
              course: course.title,
              courseSlug: course.slug,
              module: module.title,
              lesson: lesson.title,
              url: lesson.videoUrl,
              reason: result.reason
            });
          }
          
          // Small delay to avoid rate limiting
          await new Promise(r => setTimeout(r, 500));
        }
      }
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('SUMMARY');
  console.log('='.repeat(50));
  console.log(`Total video lessons: ${totalVideos}`);
  console.log(`Working: ${workingVideos} ✅`);
  console.log(`Broken: ${brokenVideos} ❌`);
  
  if (broken.length > 0) {
    console.log('\n\nBROKEN VIDEOS LIST:');
    console.log('─'.repeat(50));
    broken.forEach((v, i) => {
      console.log(`\n${i + 1}. ${v.lesson}`);
      console.log(`   Course: ${v.course}`);
      console.log(`   Module: ${v.module}`);
      console.log(`   URL: ${v.url}`);
    });
  }
  
  await mongoose.connection.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
