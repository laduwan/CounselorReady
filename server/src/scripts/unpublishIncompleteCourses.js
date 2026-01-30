/**
 * Unpublish Incomplete Standard Courses
 * 
 * Keeps published:
 * - Mastering TeleMental Health (Georgia)
 * - Ethical Uses of AI in Mental Health Counseling
 * 
 * Unpublishes all other standard courses in the courses collection
 * 
 * Run with: node src/scripts/unpublishIncompleteCourses.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('../models/Course');

// Courses to KEEP published (complete courses)
const KEEP_PUBLISHED = [
  'mastering-telemental-health-georgia',
  'ethical-uses-of-ai-in-mental-health-counseling',
  // Add slug variations in case they differ
  'telemental-health-georgia',
  'ai-ethics-mental-health',
  'ethical-ai-mental-health'
];

async function unpublishIncompleteCourses() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!\n');

    // First, let's see what we have
    const allCourses = await Course.find({}, 'title slug isPublished status');
    console.log('=== ALL STANDARD COURSES ===');
    allCourses.forEach(c => {
      console.log(`- ${c.title}`);
      console.log(`  Slug: ${c.slug}`);
      console.log(`  Published: ${c.isPublished ?? c.status ?? 'unknown'}`);
    });
    console.log('');

    // Find courses to unpublish (not in keep list)
    const coursesToUnpublish = allCourses.filter(c => 
      !KEEP_PUBLISHED.some(slug => 
        c.slug?.toLowerCase().includes(slug.toLowerCase()) ||
        slug.toLowerCase().includes(c.slug?.toLowerCase())
      )
    );

    const coursesToKeep = allCourses.filter(c =>
      KEEP_PUBLISHED.some(slug =>
        c.slug?.toLowerCase().includes(slug.toLowerCase()) ||
        slug.toLowerCase().includes(c.slug?.toLowerCase())
      )
    );

    console.log('=== WILL KEEP PUBLISHED ===');
    coursesToKeep.forEach(c => console.log(`✓ ${c.title}`));
    console.log('');

    console.log('=== WILL UNPUBLISH ===');
    coursesToUnpublish.forEach(c => console.log(`✗ ${c.title}`));
    console.log('');

    if (coursesToUnpublish.length === 0) {
      console.log('No courses to unpublish.');
      await mongoose.disconnect();
      return;
    }

    // Unpublish them
    const slugsToUnpublish = coursesToUnpublish.map(c => c.slug);
    
    const result = await Course.updateMany(
      { slug: { $in: slugsToUnpublish } },
      { 
        $set: { 
          isPublished: false,
          status: 'draft'
        } 
      }
    );

    console.log(`✅ Unpublished ${result.modifiedCount} courses`);

    // Verify
    console.log('\n=== VERIFICATION ===');
    const publishedNow = await Course.find({ 
      $or: [
        { isPublished: true },
        { status: 'published' }
      ]
    }, 'title slug');
    
    console.log('Currently published standard courses:');
    publishedNow.forEach(c => console.log(`✓ ${c.title}`));

    await mongoose.disconnect();
    console.log('\nDone!');

  } catch (error) {
    console.error('Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

unpublishIncompleteCourses();
