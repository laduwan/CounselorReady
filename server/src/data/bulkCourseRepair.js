/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// bulkCourseRepair.js
// Run with: node src/data/bulkCourseRepair.js [command]
// Commands: diagnose, fix-pricing, fix-empty-modules, convert-videos, report

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../models/Course.js';

dotenv.config();

// ===========================================
// DIAGNOSE - Show all course issues
// ===========================================
const diagnose = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');
    console.log('='.repeat(80));
    console.log('COURSE DIAGNOSTIC REPORT');
    console.log('='.repeat(80));
    
    const courses = await Course.find({}).sort({ title: 1 });
    
    const issues = {
      noModules: [],
      noPrice: [],
      brokenVideos: [],
      noCEU: [],
      draft: []
    };
    
    for (const course of courses) {
      const moduleCount = course.modules?.length || 0;
      const lessonCount = course.modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0;
      
      // Check for empty modules
      if (moduleCount === 0) {
        issues.noModules.push({
          title: course.title,
          slug: course.slug,
          status: course.status,
          ceuHours: course.ceuHours
        });
      }
      
      // Check for no price
      if (!course.price && course.accessType !== 'free') {
        issues.noPrice.push({
          title: course.title,
          slug: course.slug,
          accessType: course.accessType,
          pricingTier: course.pricingTier
        });
      }
      
      // Check for broken videos
      for (const module of course.modules || []) {
        for (const lesson of module.lessons || []) {
          if (lesson.type === 'video' && lesson.videoUrl) {
            // Check if URL looks valid
            if (!lesson.videoUrl.includes('youtube.com') && !lesson.videoUrl.includes('youtu.be') && !lesson.videoUrl.includes('vimeo.com')) {
              issues.brokenVideos.push({
                course: course.title,
                module: module.title,
                lesson: lesson.title,
                url: lesson.videoUrl
              });
            }
          }
          // Also check for placeholder content
          if (lesson.content?.includes('[Video placeholder')) {
            issues.brokenVideos.push({
              course: course.title,
              module: module.title,
              lesson: lesson.title,
              url: 'PLACEHOLDER'
            });
          }
        }
      }
      
      // Check for missing CEU
      if (!course.ceuHours && course.ceuEligible) {
        issues.noCEU.push({
          title: course.title,
          slug: course.slug
        });
      }
      
      // Draft courses
      if (course.status === 'draft') {
        issues.draft.push({
          title: course.title,
          slug: course.slug,
          modules: moduleCount,
          lessons: lessonCount
        });
      }
    }
    
    // Print report
    console.log(`\nTotal Courses: ${courses.length}`);
    console.log(`Published: ${courses.filter(c => c.status === 'published').length}`);
    console.log(`Draft: ${courses.filter(c => c.status === 'draft').length}`);
    
    console.log('\n' + '-'.repeat(80));
    console.log(`❌ COURSES WITH 0 MODULES: ${issues.noModules.length}`);
    console.log('-'.repeat(80));
    issues.noModules.forEach(c => {
      console.log(`  • ${c.title} (${c.slug}) - ${c.status} - ${c.ceuHours || 0} CE hrs`);
    });
    
    console.log('\n' + '-'.repeat(80));
    console.log(`💰 COURSES WITH NO PRICE: ${issues.noPrice.length}`);
    console.log('-'.repeat(80));
    issues.noPrice.forEach(c => {
      console.log(`  • ${c.title} - ${c.accessType} - ${c.pricingTier}`);
    });
    
    console.log('\n' + '-'.repeat(80));
    console.log(`🎬 BROKEN/PLACEHOLDER VIDEOS: ${issues.brokenVideos.length}`);
    console.log('-'.repeat(80));
    issues.brokenVideos.slice(0, 20).forEach(v => {
      console.log(`  • ${v.course} > ${v.lesson}`);
      console.log(`    URL: ${v.url.substring(0, 60)}...`);
    });
    if (issues.brokenVideos.length > 20) {
      console.log(`  ... and ${issues.brokenVideos.length - 20} more`);
    }
    
    console.log('\n' + '='.repeat(80));
    console.log('RECOMMENDED FIXES:');
    console.log('='.repeat(80));
    console.log('1. Run: node src/data/bulkCourseRepair.js fix-pricing');
    console.log('2. Run: node src/data/bulkCourseRepair.js fix-empty-modules');
    console.log('3. Run: node src/data/bulkCourseRepair.js convert-videos');
    
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

// ===========================================
// FIX PRICING - Set default prices
// ===========================================
const fixPricing = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');
    
    // Pricing strategy based on CE hours and tier
    const getPriceForCourse = (course) => {
      const hours = course.ceuHours || 1;
      const isPremium = course.pricingTier === 'premium';
      
      // Base: $15/hour for standard, $20/hour for premium
      const baseRate = isPremium ? 20 : 15;
      let price = hours * baseRate;
      
      // Round to nearest $5
      price = Math.round(price / 5) * 5;
      
      // Minimum $25, maximum $149
      return Math.max(25, Math.min(149, price));
    };
    
    const courses = await Course.find({
      $or: [
        { price: null },
        { price: { $exists: false } },
        { price: 0 }
      ],
      accessType: { $ne: 'free' }
    });
    
    console.log(`Found ${courses.length} courses needing pricing\n`);
    
    for (const course of courses) {
      const newPrice = getPriceForCourse(course);
      
      await Course.updateOne(
        { _id: course._id },
        { 
          $set: { 
            price: newPrice,
            accessType: 'paid'
          } 
        }
      );
      
      console.log(`✅ ${course.title}: $${newPrice} (${course.ceuHours || 1} CE hrs, ${course.pricingTier})`);
    }
    
    console.log(`\n✨ Updated ${courses.length} course prices`);
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

// ===========================================
// FIX EMPTY MODULES - Create placeholder structure
// ===========================================
const fixEmptyModules = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');
    
    const courses = await Course.find({
      $or: [
        { modules: { $size: 0 } },
        { modules: null },
        { modules: { $exists: false } }
      ],
      status: 'published'
    });
    
    console.log(`Found ${courses.length} published courses with 0 modules\n`);
    
    for (const course of courses) {
      // Create a single module with course content as text lesson
      const defaultModule = {
        title: 'Course Content',
        description: course.description?.substring(0, 200) || '',
        order: 0,
        objectives: course.objectives || [],
        lessons: [
          {
            title: 'Introduction',
            type: 'text',
            content: `<h2>${course.title}</h2>
<p>${course.description || 'Course content pending.'}</p>
<h3>Learning Objectives</h3>
<ul>
${(course.objectives || ['Complete this course']).map(obj => `<li>${obj}</li>`).join('\n')}
</ul>
<p><em>Additional course content is being prepared. Please check back soon.</em></p>`,
            duration: (course.ceuHours || 1) * 60, // Convert CE hours to minutes
            order: 0,
            isFree: false
          }
        ]
      };
      
      // Add a quiz if course has CE hours
      if (course.ceuHours) {
        defaultModule.lessons.push({
          title: 'Knowledge Check',
          type: 'quiz',
          order: 1,
          questions: [
            {
              question: 'I have completed all required course materials.',
              type: 'true_false',
              correctAnswer: true,
              explanation: 'Thank you for confirming completion.',
              points: 1
            }
          ],
          showExplanations: true
        });
      }
      
      await Course.updateOne(
        { _id: course._id },
        { 
          $set: { 
            modules: [defaultModule],
            'settings.certificateEnabled': true,
            'settings.requireAttestation': true
          } 
        }
      );
      
      console.log(`✅ ${course.title}: Created placeholder module`);
    }
    
    console.log(`\n✨ Fixed ${courses.length} courses with placeholder content`);
    console.log('\n⚠️  NOTE: These courses now have placeholder content.');
    console.log('   You should update them with real content via the admin panel.');
    
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

// ===========================================
// CONVERT VIDEOS - Change video lessons to text
// ===========================================
const convertVideos = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');
    
    const courses = await Course.find({});
    let totalConverted = 0;
    
    for (const course of courses) {
      let modified = false;
      
      for (const module of course.modules || []) {
        for (const lesson of module.lessons || []) {
          if (lesson.type === 'video') {
            const originalUrl = lesson.videoUrl || '';
            
            lesson.type = 'text';
            lesson.content = `<div class="video-placeholder" style="background: #f5f5f5; padding: 40px; text-align: center; border-radius: 8px; margin: 20px 0;">
  <p style="font-size: 48px; margin: 0;">🎬</p>
  <h3>Video Content</h3>
  <p>This lesson contains video content that is being updated.</p>
  <p><small>Original: ${originalUrl}</small></p>
</div>

${lesson.content || ''}`;
            lesson.originalVideoUrl = originalUrl;
            
            modified = true;
            totalConverted++;
            console.log(`  📝 ${course.title} > ${module.title} > ${lesson.title}`);
          }
        }
      }
      
      if (modified) {
        await course.save();
      }
    }
    
    console.log(`\n✨ Converted ${totalConverted} video lessons to text`);
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

// ===========================================
// FULL REPORT - Export detailed CSV
// ===========================================
const exportReport = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');
    
    const courses = await Course.find({}).sort({ status: 1, title: 1 });
    
    // CSV header
    console.log('Title,Slug,Status,Modules,Lessons,CE Hours,Price,Tier,Access Type');
    
    for (const course of courses) {
      const moduleCount = course.modules?.length || 0;
      const lessonCount = course.modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0;
      
      // Escape commas in title
      const title = `"${course.title.replace(/"/g, '""')}"`;
      
      console.log([
        title,
        course.slug,
        course.status,
        moduleCount,
        lessonCount,
        course.ceuHours || 0,
        course.price || 0,
        course.pricingTier || 'standard',
        course.accessType || 'paid'
      ].join(','));
    }
    
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

// ===========================================
// RUN ALL FIXES
// ===========================================
const fixAll = async () => {
  console.log('🔧 RUNNING ALL FIXES\n');
  console.log('Step 1: Fixing pricing...');
  await fixPricing();
  
  console.log('\nStep 2: Fixing empty modules...');
  await fixEmptyModules();
  
  console.log('\nStep 3: Converting broken videos...');
  await convertVideos();
  
  console.log('\n' + '='.repeat(80));
  console.log('✅ ALL FIXES COMPLETE');
  console.log('='.repeat(80));
};

// ===========================================
// CLI HANDLER
// ===========================================
const command = process.argv[2];

switch (command) {
  case 'diagnose':
    diagnose();
    break;
  case 'fix-pricing':
    fixPricing();
    break;
  case 'fix-empty-modules':
    fixEmptyModules();
    break;
  case 'convert-videos':
    convertVideos();
    break;
  case 'report':
    exportReport();
    break;
  case 'fix-all':
    fixAll();
    break;
  default:
    console.log('Course Bulk Repair Tool');
    console.log('=======================\n');
    console.log('Commands:');
    console.log('  diagnose         - Show all course issues');
    console.log('  fix-pricing      - Set default prices ($15-20/CE hr)');
    console.log('  fix-empty-modules - Add placeholder content to empty courses');
    console.log('  convert-videos   - Convert video lessons to text placeholders');
    console.log('  report           - Export CSV report of all courses');
    console.log('  fix-all          - Run all fixes in sequence\n');
    console.log('Usage:');
    console.log('  node src/data/bulkCourseRepair.js diagnose');
    console.log('  node src/data/bulkCourseRepair.js fix-all');
}
