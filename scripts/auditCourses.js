/**
 * Course Audit Script
 * 
 * Shows the status of all courses in the database:
 * - Which have content
 * - Which are empty shells
 * - Module/lesson counts
 * - Quiz question counts
 * 
 * Run: node src/scripts/auditCourses.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URI not set');
  process.exit(1);
}

async function auditCourses() {
  console.log('📊 Course Audit Report');
  console.log('='.repeat(70));
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');
    
    const db = mongoose.connection.db;
    
    // Check regular courses collection
    const coursesCollection = db.collection('courses');
    const courses = await coursesCollection.find({}).toArray();
    
    console.log(`📚 COURSES COLLECTION: ${courses.length} courses\n`);
    console.log('Status | Modules | Lessons | Quizzes | Title');
    console.log('-'.repeat(70));
    
    let withContent = 0;
    let empty = 0;
    
    for (const course of courses) {
      const moduleCount = course.modules?.length || 0;
      let lessonCount = 0;
      let quizCount = 0;
      
      if (course.modules) {
        course.modules.forEach(m => {
          if (m.lessons) {
            lessonCount += m.lessons.length;
            m.lessons.forEach(l => {
              if (l.type === 'quiz' && l.questions) {
                quizCount += l.questions.length;
              }
            });
          }
        });
      }
      
      const hasContent = moduleCount > 0 && lessonCount > 0;
      const status = hasContent ? '  ✓  ' : '  ✗  ';
      
      if (hasContent) withContent++;
      else empty++;
      
      const title = (course.title || course.slug || 'Untitled').substring(0, 40);
      console.log(`${status} | ${String(moduleCount).padStart(7)} | ${String(lessonCount).padStart(7)} | ${String(quizCount).padStart(7)} | ${title}`);
    }
    
    console.log('-'.repeat(70));
    console.log(`With content: ${withContent} | Empty: ${empty}\n`);
    
    // Check interactive courses collection
    const interactiveCollection = db.collection('interactivecourses');
    const interactiveCourses = await interactiveCollection.find({}).toArray();
    
    if (interactiveCourses.length > 0) {
      console.log(`\n📱 INTERACTIVECOURSES COLLECTION: ${interactiveCourses.length} courses\n`);
      console.log('Status | Sections | Blocks | Quiz Qs | Title');
      console.log('-'.repeat(70));
      
      let intWithContent = 0;
      let intEmpty = 0;
      
      for (const course of interactiveCourses) {
        const sectionCount = course.sections?.length || 0;
        let blockCount = 0;
        let assessmentQs = course.assessment?.questions?.length || 0;
        
        if (course.sections) {
          course.sections.forEach(s => {
            if (s.contentBlocks) {
              blockCount += s.contentBlocks.length;
            }
          });
        }
        
        const hasContent = sectionCount > 0 && blockCount > 0;
        const status = hasContent ? '  ✓  ' : '  ✗  ';
        
        if (hasContent) intWithContent++;
        else intEmpty++;
        
        const title = (course.title || course.slug || 'Untitled').substring(0, 40);
        console.log(`${status} | ${String(sectionCount).padStart(8)} | ${String(blockCount).padStart(6)} | ${String(assessmentQs).padStart(7)} | ${title}`);
      }
      
      console.log('-'.repeat(70));
      console.log(`With content: ${intWithContent} | Empty: ${intEmpty}`);
    }
    
    // Summary
    console.log('\n' + '='.repeat(70));
    console.log('SUMMARY');
    console.log('='.repeat(70));
    console.log(`Regular courses: ${courses.length} (${withContent} with content, ${empty} empty)`);
    console.log(`Interactive courses: ${interactiveCourses.length}`);
    console.log('='.repeat(70));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

auditCourses();
