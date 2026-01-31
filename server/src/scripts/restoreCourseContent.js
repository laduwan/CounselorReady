/**
 * Course Content Restoration Script
 * 
 * This script UPDATES existing courses with full content from seed data.
 * Unlike the original seed scripts that skip existing courses, this one
 * will upsert (update or insert) to restore missing content.
 * 
 * Run: node src/scripts/restoreCourseContent.js
 * 
 * Options:
 *   --force    Update ALL courses, even those with existing content
 *   --dry-run  Show what would be updated without making changes
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

// Import course data from seed files dynamically
async function loadSeedData() {
  const seedCourses = [];
  
  try {
    // Try to import freeCourses
    const { freeCourses } = await import('../data/seedCourses.js');
    if (freeCourses && freeCourses.length) {
      seedCourses.push(...freeCourses);
      console.log(`  Loaded ${freeCourses.length} free courses`);
    }
  } catch (e) {
    console.log('  Could not load seedCourses.js:', e.message);
  }
  
  try {
    // Try to import standardCourses
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
  console.log('🔧 Course Content Restoration Script');
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
    
    // Load seed data
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
    let skipped = 0;
    
    for (const courseData of allSeedCourses) {
      const existing = await Course.findOne({ slug: courseData.slug });
      
      if (existing) {
        // Check if existing course is empty (no modules or empty modules)
        const hasContent = existing.modules && 
                          existing.modules.length > 0 && 
                          existing.modules.some(m => m.lessons && m.lessons.length > 0);
        
        if (!hasContent || FORCE_UPDATE) {
          if (DRY_RUN) {
            console.log(`📝 Would UPDATE: ${courseData.title}`);
            console.log(`   Modules: ${courseData.modules?.length || 0}`);
            updated++;
          } else {
            // Update with full content - preserve _id and certain fields
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
        // Create new course
        if (DRY_RUN) {
          console.log(`🆕 Would CREATE: ${courseData.title}`);
          created++;
        } else {
          await Course.create(courseData);
          console.log(`🆕 CREATED: ${courseData.title}`);
          created++;
        }
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
    console.log(`   ${DRY_RUN ? 'Would update' : 'Updated'} (restored content): ${updated}`);
    console.log(`   ${DRY_RUN ? 'Would create' : 'Created'} (new): ${created}`);
    console.log(`   Unchanged (already had content): ${unchanged}`);
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
