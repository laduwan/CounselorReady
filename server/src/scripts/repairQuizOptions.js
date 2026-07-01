/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * Repair Corrupted Quiz Options
 * 
 * This script fixes quiz options that were corrupted into character-indexed objects:
 * {0: "B", 1: "e", 2: "c"...} → "Bec..."
 * 
 * Run with: node repairQuizOptions.js
 * 
 * Make sure MONGODB_URI is set in your environment
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URI environment variable not set');
  process.exit(1);
}

/**
 * Check if an object is a corrupted string (character-indexed)
 */
function isCorruptedString(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return false;
  
  const keys = Object.keys(obj);
  const numericKeys = keys.filter(k => /^\d+$/.test(k));
  
  // If most keys are numeric and there are several, it's likely corrupted
  return numericKeys.length > 3 && numericKeys.length >= keys.length - 2;
}

/**
 * Reconstruct a string from character-indexed object
 */
function reconstructString(obj) {
  const numericKeys = Object.keys(obj)
    .filter(k => /^\d+$/.test(k))
    .sort((a, b) => parseInt(a) - parseInt(b));
  
  return numericKeys.map(k => obj[k]).join('');
}

/**
 * Fix a single option - returns fixed option or original if not corrupted
 */
function fixOption(option) {
  if (typeof option === 'string') {
    return { changed: false, value: option };
  }
  
  if (option && typeof option === 'object') {
    // Check if the whole option is a corrupted string
    if (isCorruptedString(option)) {
      const reconstructed = reconstructString(option);
      
      // Check if there's an isCorrect property to preserve
      const hasIsCorrect = 'isCorrect' in option;
      
      if (hasIsCorrect) {
        return {
          changed: true,
          value: { text: reconstructed, isCorrect: option.isCorrect },
          preview: reconstructed.substring(0, 60)
        };
      } else {
        return {
          changed: true,
          value: reconstructed,
          preview: reconstructed.substring(0, 60)
        };
      }
    }
    
    // Check if it has a text property that's corrupted
    if (option.text && isCorruptedString(option.text)) {
      const reconstructed = reconstructString(option.text);
      return {
        changed: true,
        value: { ...option, text: reconstructed },
        preview: reconstructed.substring(0, 60)
      };
    }
  }
  
  return { changed: false, value: option };
}

async function repairCourses() {
  console.log('🔧 Quiz Options Repair Script');
  console.log('='.repeat(50));
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected!\n');
  
  const db = mongoose.connection.db;
  
  // Get the courses collection
  const coursesCollection = db.collection('courses');
  
  // Find all courses
  const courses = await coursesCollection.find({}).toArray();
  console.log(`Found ${courses.length} courses to check\n`);
  
  let totalCoursesFixed = 0;
  let totalOptionsFixed = 0;
  
  for (const course of courses) {
    console.log(`\n📚 ${course.title || course.slug || course._id}`);
    let courseModified = false;
    let optionsFixedInCourse = 0;
    
    // Check modules -> lessons -> questions
    if (course.modules && Array.isArray(course.modules)) {
      for (let mIndex = 0; mIndex < course.modules.length; mIndex++) {
        const module = course.modules[mIndex];
        
        if (module.lessons && Array.isArray(module.lessons)) {
          for (let lIndex = 0; lIndex < module.lessons.length; lIndex++) {
            const lesson = module.lessons[lIndex];
            
            // Check lesson.questions (quiz lessons)
            if (lesson.questions && Array.isArray(lesson.questions)) {
              for (let qIndex = 0; qIndex < lesson.questions.length; qIndex++) {
                const question = lesson.questions[qIndex];
                
                if (question.options && Array.isArray(question.options)) {
                  for (let oIndex = 0; oIndex < question.options.length; oIndex++) {
                    const result = fixOption(question.options[oIndex]);
                    if (result.changed) {
                      console.log(`   ✓ M${mIndex+1}/L${lIndex+1}/Q${qIndex+1}/O${oIndex+1}: "${result.preview}..."`);
                      course.modules[mIndex].lessons[lIndex].questions[qIndex].options[oIndex] = result.value;
                      courseModified = true;
                      optionsFixedInCourse++;
                    }
                  }
                }
              }
            }
            
            // Check lesson.options (standalone multipleChoice/multiSelect lessons)
            if (lesson.options && Array.isArray(lesson.options)) {
              for (let oIndex = 0; oIndex < lesson.options.length; oIndex++) {
                const result = fixOption(lesson.options[oIndex]);
                if (result.changed) {
                  console.log(`   ✓ M${mIndex+1}/L${lIndex+1}/O${oIndex+1}: "${result.preview}..."`);
                  course.modules[mIndex].lessons[lIndex].options[oIndex] = result.value;
                  courseModified = true;
                  optionsFixedInCourse++;
                }
              }
            }
          }
        }
        
        // Check module-level quiz questions
        if (module.quizQuestions && Array.isArray(module.quizQuestions)) {
          for (let qIndex = 0; qIndex < module.quizQuestions.length; qIndex++) {
            const question = module.quizQuestions[qIndex];
            
            if (question.options && Array.isArray(question.options)) {
              for (let oIndex = 0; oIndex < question.options.length; oIndex++) {
                const result = fixOption(question.options[oIndex]);
                if (result.changed) {
                  console.log(`   ✓ M${mIndex+1}/Quiz/Q${qIndex+1}/O${oIndex+1}: "${result.preview}..."`);
                  course.modules[mIndex].quizQuestions[qIndex].options[oIndex] = result.value;
                  courseModified = true;
                  optionsFixedInCourse++;
                }
              }
            }
          }
        }
      }
    }
    
    // Check course.assessment.questions
    if (course.assessment && course.assessment.questions && Array.isArray(course.assessment.questions)) {
      for (let qIndex = 0; qIndex < course.assessment.questions.length; qIndex++) {
        const question = course.assessment.questions[qIndex];
        
        if (question.options && Array.isArray(question.options)) {
          for (let oIndex = 0; oIndex < question.options.length; oIndex++) {
            const result = fixOption(question.options[oIndex]);
            if (result.changed) {
              console.log(`   ✓ Assessment/Q${qIndex+1}/O${oIndex+1}: "${result.preview}..."`);
              course.assessment.questions[qIndex].options[oIndex] = result.value;
              courseModified = true;
              optionsFixedInCourse++;
            }
          }
        }
      }
    }
    
    // Save if modified
    if (courseModified) {
      await coursesCollection.updateOne(
        { _id: course._id },
        { 
          $set: { 
            modules: course.modules,
            assessment: course.assessment 
          } 
        }
      );
      console.log(`   💾 Saved (${optionsFixedInCourse} options fixed)`);
      totalCoursesFixed++;
      totalOptionsFixed += optionsFixedInCourse;
    } else {
      console.log(`   ✅ No issues`);
    }
  }
  
  console.log(`\n${'='.repeat(50)}`);
  console.log('📊 SUMMARY');
  console.log(`   Courses checked: ${courses.length}`);
  console.log(`   Courses repaired: ${totalCoursesFixed}`);
  console.log(`   Total options fixed: ${totalOptionsFixed}`);
  console.log('='.repeat(50));
  
  await mongoose.disconnect();
  console.log('\nDisconnected from MongoDB. Done!');
}

// Run the repair
repairCourses().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
