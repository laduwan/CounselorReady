/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * List all courses with CE hours
 * Run with: node src/scripts/listCourseHours.js
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import Course from '../models/Course.js';

async function listCourseHours() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const courses = await Course.find({}, 'title slug ceHours credits hours isPublished status').sort({ ceHours: -1 });
    
    console.log('='.repeat(80));
    console.log('ALL STANDARD COURSES - CE HOURS');
    console.log('='.repeat(80));
    console.log('');
    
    console.log('PREMIUM (4+ CE) - Need videos:');
    console.log('-'.repeat(40));
    courses.filter(c => (c.ceHours || c.credits || c.hours || 0) >= 4).forEach(c => {
      const hours = c.ceHours || c.credits || c.hours || 'N/A';
      const status = c.isPublished ? '✅ Published' : '📝 Draft';
      console.log(`${hours} CE | ${c.title}`);
      console.log(`       ${status} | ${c.slug}`);
    });
    
    console.log('');
    console.log('STANDARD (<4 CE) - Can be text-based:');
    console.log('-'.repeat(40));
    courses.filter(c => (c.ceHours || c.credits || c.hours || 0) < 4 && (c.ceHours || c.credits || c.hours || 0) > 0).forEach(c => {
      const hours = c.ceHours || c.credits || c.hours || 'N/A';
      const status = c.isPublished ? '✅ Published' : '📝 Draft';
      console.log(`${hours} CE | ${c.title}`);
      console.log(`       ${status} | ${c.slug}`);
    });
    
    console.log('');
    console.log('NO CE HOURS SET:');
    console.log('-'.repeat(40));
    courses.filter(c => !c.ceHours && !c.credits && !c.hours).forEach(c => {
      const status = c.isPublished ? '✅ Published' : '📝 Draft';
      console.log(`??? CE | ${c.title}`);
      console.log(`       ${status} | ${c.slug}`);
    });

    console.log('');
    console.log('='.repeat(80));
    console.log('SUMMARY');
    console.log('='.repeat(80));
    const premium = courses.filter(c => (c.ceHours || c.credits || c.hours || 0) >= 4).length;
    const standard = courses.filter(c => (c.ceHours || c.credits || c.hours || 0) < 4 && (c.ceHours || c.credits || c.hours || 0) > 0).length;
    const noHours = courses.filter(c => !c.ceHours && !c.credits && !c.hours).length;
    console.log(`Premium (4+ CE): ${premium}`);
    console.log(`Standard (<4 CE): ${standard}`);
    console.log(`No hours set: ${noHours}`);
    console.log(`Total: ${courses.length}`);

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

listCourseHours();
