/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * Course Content Restoration Script v2
 * 
 * Transforms seed data to match current Course schema,
 * specifically converting quiz options from string arrays to object arrays.
 * 
 * Run: node src/scripts/restoreCourseContent.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../models/Course.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const FORCE_UPDATE = process.argv.includes('--force');
const DRY_RUN = process.argv.includes('--dry-run');

if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URI not set');
  process.exit(1);
}

/**
 * Transform quiz questions from old format to new schema format
 * Old: { options: ['A', 'B', 'C'], correctAnswer: 1 }
 * New: { options: [{ text: 'A', isCorrect: false }, { text: 'B', isCorrect: true }, ...] }
 */
function transformQuizQuestion(question) {
  if (!question) return question;
  
  // If options are already objects with 'text' property, return as-is
  if (question.options && question.options[0] && typeof question.options[0] === 'object' && question.options[0].text) {
    return question;
  }
  
  // Transform string options to object format
  if (question.options && Array.isArray(question.options)) {
    const correctIndex = question.correctAnswer ?? -1;
    
    question.options = question.options.map((opt, idx) => {
      if (typeof opt === 'string') {
        return {
          text: opt,
          isCorrect: idx === correctIndex
        };
      }
      return opt;
    });
    
    // Remove old correctAnswer field since isCorrect is now on each option
    delete question.correctAnswer;
  }
  
  return question;
}

/**
 * Transform all modules to match current schema
 */
function transformCourseData(courseData) {
  if (!courseData.modules) return courseData;
  
  courseData.modules = courseData.modules.map(module => {
    if (!module.lessons) return module;
    
    module.lessons = module.lessons.map(lesson => {
      // Transform quiz lessons
      if (lesson.type === 'quiz' && lesson.questions) {
        lesson.questions = lesson.questions.map(transformQuizQuestion);
      }
      return lesson;
    });
    
    return module;
  });
  
  return courseData;
}

// Import course data from seed files dynamically
async function loadSeedData() {
  const seedCourses = [];
  
  try {
    const { freeCourses } = await import('../data/seedCourses.js');
    if (freeCourses && freeCourses.length) {
      seedCourses.push(...freeCourses);
      console.log(`  Loaded ${freeCourses.length} free courses`);
    }
  } catch (e) {
    console.log('  Could not load seedCourses.js:', e.message);
  }
  
  try {
    const { standardCourses } = await import('../data/seedStandardCourses.js');
    if (standardCourses && standardCourses.length) {
      seedCourses.push(...standardCourses);
      console.log(`  Loaded ${standardCourses.length} standard courses`);
    }
  } catch (e) {
    console.log('  Could not load seedStandardCourses.js:', e.message);
  }
  
  return seedCourses;
}

async function restoreCourses() {
  console.log('🔧 Course Content Restoration Script v2');
  console.log('='.repeat(50));
  
  if (DRY_RUN) {
    console.log('🔍 DRY RUN MODE - No changes will be made\n');
  }
  if (FORCE_UPDATE) {
    console.log('⚠️  FORCE MODE - Will update ALL courses\n');
  }
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');
    
    console.log('Loading seed data...');
    const allSeedCourses = await loadSeedData();
    console.log(`\nTotal: ${allSeedCourses.length} courses in seed data\n`);
    
    if (allSeedCourses.length === 0) {
      console.log('No seed courses found. Check that seed files exist.');
      return;
    }
    
    let updated = 0;
    let created = 0;
    let unchanged = 0;
    let errors = 0;
    
    for (const rawCourseData of allSeedCourses) {
      try {
        // Transform the data to match current schema
        const courseData = transformCourseData(JSON.parse(JSON.stringify(rawCourseData)));
        
        const existing = await Course.findOne({ slug: courseData.slug });
        
        if (existing) {
          const hasContent = existing.modules && 
                            existing.modules.length > 0 && 
                            existing.modules.some(m => m.lessons && m.lessons.length > 0);
          
          if (!hasContent || FORCE_UPDATE) {
            if (DRY_RUN) {
              console.log(`📝 Would UPDATE: ${courseData.title}`);
              console.log(`   Modules: ${courseData.modules?.length || 0}`);
              updated++;
            } else {
              await Course.findOneAndUpdate(
                { slug: courseData.slug },
                { 
                  $set: {
                    modules: courseData.modules,
                    objectives: courseData.objectives,
                    references: courseData.references,
                    presenter: courseData.presenter,
                    settings: courseData.settings,
                    description: courseData.description,
                    subtitle: courseData.subtitle,
                    ceuHours: courseData.ceuHours,
                    ceuCategories: courseData.ceuCategories,
                    approvals: courseData.approvals
                  }
                }
              );
              console.log(`✅ UPDATED: ${courseData.title}`);
              console.log(`   Added ${courseData.modules?.length || 0} modules`);
              updated++;
            }
          } else {
            console.log(`⏭️  Has content: ${courseData.title}`);
            unchanged++;
          }
        } else {
          if (DRY_RUN) {
            console.log(`🆕 Would CREATE: ${courseData.title}`);
            created++;
          } else {
            await Course.create(courseData);
            console.log(`🆕 CREATED: ${courseData.title}`);
            created++;
          }
        }
      } catch (err) {
        console.error(`❌ ERROR processing ${rawCourseData.title}:`, err.message);
        errors++;
      }
    }
    
    // Show courses in DB that weren't in seed files
    const dbCourses = await Course.find({}, 'slug title modules').lean();
    const seedSlugs = allSeedCourses.map(c => c.slug);
    const notInSeed = dbCourses.filter(c => !seedSlugs.includes(c.slug));
    
    if (notInSeed.length > 0) {
      console.log('\n' + '='.repeat(50));
      console.log(`⚠️  ${notInSeed.length} courses in DB not in seed files:`);
      notInSeed.forEach(c => {
        const hasContent = c.modules?.some(m => m.lessons?.length > 0);
        console.log(`   - ${c.title || c.slug} ${hasContent ? '✓' : '(empty)'}`);
      });
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('📊 SUMMARY:');
    console.log(`   ${DRY_RUN ? 'Would update' : 'Updated'}: ${updated}`);
    console.log(`   ${DRY_RUN ? 'Would create' : 'Created'}: ${created}`);
    console.log(`   Unchanged: ${unchanged}`);
    console.log(`   Errors: ${errors}`);
    console.log(`   Not in seed files: ${notInSeed.length}`);
    console.log('='.repeat(50));
    
    if (DRY_RUN) {
      console.log('\n💡 Run without --dry-run to apply changes');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

restoreCourses();
