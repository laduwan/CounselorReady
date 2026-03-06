/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * Check Video URLs in Courses
 * 
 * Pulls all video URLs from courses and checks if they're accessible
 * 
 * Run with: node src/scripts/checkVideoUrls.js
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import Course from '../models/Course.js';

async function checkVideoUrls() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!\n');

    // Get all courses (including unpublished)
    const allCourses = await Course.find({});
    
    console.log(`Found ${allCourses.length} courses in database\n`);
    console.log('='.repeat(80));

    for (const course of allCourses) {
      const videoLessons = [];
      
      // Extract video lessons from modules
      if (course.modules && course.modules.length > 0) {
        course.modules.forEach((module, mIndex) => {
          if (module.lessons && module.lessons.length > 0) {
            module.lessons.forEach((lesson, lIndex) => {
              if (lesson.type === 'video' || lesson.videoUrl) {
                videoLessons.push({
                  module: module.title || `Module ${mIndex + 1}`,
                  lesson: lesson.title || `Lesson ${lIndex + 1}`,
                  url: lesson.videoUrl || lesson.url || 'NO URL',
                  type: lesson.type
                });
              }
            });
          }
        });
      }

      if (videoLessons.length > 0) {
        console.log(`\n📚 ${course.title}`);
        console.log(`   Slug: ${course.slug}`);
        console.log(`   Published: ${course.isPublished ?? course.status ?? 'unknown'}`);
        console.log(`   Videos: ${videoLessons.length}`);
        console.log('');
        
        for (const video of videoLessons) {
          const urlStatus = await checkUrl(video.url);
          const statusIcon = urlStatus.valid ? '✅' : '❌';
          console.log(`   ${statusIcon} ${video.lesson}`);
          console.log(`      URL: ${video.url}`);
          if (!urlStatus.valid) {
            console.log(`      Error: ${urlStatus.error}`);
          }
        }
        console.log('-'.repeat(80));
      }
    }

    // Summary
    console.log('\n' + '='.repeat(80));
    console.log('SUMMARY');
    console.log('='.repeat(80));
    
    let totalVideos = 0;
    let brokenVideos = 0;
    let workingVideos = 0;
    
    for (const course of allCourses) {
      if (course.modules) {
        for (const module of course.modules) {
          if (module.lessons) {
            for (const lesson of module.lessons) {
              if (lesson.type === 'video' || lesson.videoUrl) {
                totalVideos++;
                const status = await checkUrl(lesson.videoUrl || lesson.url);
                if (status.valid) {
                  workingVideos++;
                } else {
                  brokenVideos++;
                }
              }
            }
          }
        }
      }
    }
    
    console.log(`Total video lessons: ${totalVideos}`);
    console.log(`Working: ${workingVideos}`);
    console.log(`Broken: ${brokenVideos}`);

    await mongoose.disconnect();
    console.log('\nDone!');

  } catch (error) {
    console.error('Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

async function checkUrl(url) {
  if (!url || url === 'NO URL' || url === '') {
    return { valid: false, error: 'No URL provided' };
  }

  // Check for YouTube URLs
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = extractYouTubeId(url);
    if (!videoId) {
      return { valid: false, error: 'Invalid YouTube URL format' };
    }
    
    try {
      // Check if YouTube video exists via oEmbed
      const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
      if (response.ok) {
        return { valid: true };
      } else if (response.status === 404) {
        return { valid: false, error: 'YouTube video not found or private' };
      } else {
        return { valid: false, error: `YouTube returned status ${response.status}` };
      }
    } catch (e) {
      return { valid: false, error: `Network error: ${e.message}` };
    }
  }

  // Check for Vimeo URLs
  if (url.includes('vimeo.com')) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return { valid: response.ok, error: response.ok ? null : `Status ${response.status}` };
    } catch (e) {
      return { valid: false, error: `Network error: ${e.message}` };
    }
  }

  // Generic URL check
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return { valid: response.ok, error: response.ok ? null : `Status ${response.status}` };
  } catch (e) {
    return { valid: false, error: `Network error: ${e.message}` };
  }
}

function extractYouTubeId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

checkVideoUrls();
