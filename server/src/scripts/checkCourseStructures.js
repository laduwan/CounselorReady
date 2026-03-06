/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// checkCourseStructures.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);
console.log('Connected\n');

const db = mongoose.connection.db;
const courses = await db.collection('interactivecourses').find({}).toArray();

console.log('COURSE STRUCTURES:');
console.log('==================\n');

courses.forEach(c => {
  const hasModules = c.modules && c.modules.length > 0;
  const hasSections = c.sections && c.sections.length > 0;
  
  console.log(`${c.title}`);
  console.log(`  slug: ${c.slug}`);
  console.log(`  modules: ${c.modules?.length || 0}`);
  console.log(`  sections: ${c.sections?.length || 0}`);
  console.log(`  format: ${hasModules ? 'modules/lessons ✓' : hasSections ? 'sections/contentBlocks ✗' : 'EMPTY'}`);
  console.log('');
});

await mongoose.connection.close();
console.log('Done!');
