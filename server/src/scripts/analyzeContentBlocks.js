/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// analyzeContentBlocks.js
// Run on Render: node src/scripts/analyzeContentBlocks.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);
console.log('Connected\n');

const db = mongoose.connection.db;
const courses = await db.collection('interactivecourses').find({}).toArray();

console.log('=== CONTENT BLOCK TYPES ANALYSIS ===\n');

const allTypes = new Set();
const typeExamples = {};

courses.forEach(course => {
  console.log(`📚 ${course.title}`);
  console.log(`   Slug: ${course.slug}`);
  console.log(`   Sections: ${course.sections?.length || 0}`);
  
  course.sections?.forEach((section, sIdx) => {
    console.log(`\n   Section ${sIdx + 1}: ${section.title || 'Untitled'}`);
    
    section.contentBlocks?.forEach((block, bIdx) => {
      const type = block.type || 'unknown';
      allTypes.add(type);
      
      // Store first example of each type
      if (!typeExamples[type]) {
        typeExamples[type] = {
          course: course.title,
          section: section.title,
          block: block
        };
      }
      
      console.log(`      [${bIdx + 1}] ${type}`);
    });
  });
  console.log('\n' + '─'.repeat(50) + '\n');
});

console.log('\n=== SUMMARY ===\n');
console.log('All content block types found:');
allTypes.forEach(type => console.log(`  • ${type}`));

console.log('\n=== EXAMPLE OF EACH TYPE ===\n');
Object.entries(typeExamples).forEach(([type, example]) => {
  console.log(`\n📦 ${type.toUpperCase()}`);
  console.log(`   From: ${example.course} > ${example.section}`);
  console.log('   Structure:');
  console.log(JSON.stringify(example.block, null, 2).split('\n').map(l => '   ' + l).join('\n'));
});

await mongoose.connection.close();
console.log('\nDone!');
