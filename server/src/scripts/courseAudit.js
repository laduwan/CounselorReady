/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * CounselorReady Course Catalog Audit
 * 
 * Run on Render with: node courseAudit.js
 * 
 * This script audits ALL courses and outputs:
 * 1. Console summary table
 * 2. JSON file with full details
 * 3. CSV file you can open in Excel/Sheets
 */

import mongoose from 'mongoose';
import fs from 'fs';

// Connection string from environment
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URI environment variable not set');
  process.exit(1);
}

// Minimal Course schema for reading
const courseSchema = new mongoose.Schema({}, { strict: false });
const Course = mongoose.model('Course', courseSchema);

// Word count helper - counts actual content words
function countWords(text) {
  if (!text) return 0;
  // Strip HTML tags
  const stripped = text.replace(/<[^>]*>/g, ' ');
  // Count words
  const words = stripped.trim().split(/\s+/).filter(w => w.length > 0);
  return words.length;
}

// Analyze a single course
function analyzeCourse(course) {
  const result = {
    // Identity
    _id: course._id?.toString() || 'NO_ID',
    title: course.title || 'UNTITLED',
    slug: course.slug || 'NO_SLUG',
    
    // Visibility
    status: course.status || 'NO_STATUS',
    visibleToLearners: course.status === 'published',
    
    // CE Info
    ceuHours: course.ceuHours || course.ceCredits || 0,
    targetWordCount: (course.ceuHours || course.ceCredits || 0) * 6000,
    
    // Content counts
    moduleCount: 0,
    lessonCount: 0,
    textLessonCount: 0,
    videoLessonCount: 0,
    quizLessonCount: 0,
    interactiveLessonCount: 0,
    
    // Word counts
    totalWords: 0,
    wordsByModule: [],
    
    // Quiz/Assessment
    hasModuleQuizzes: false,
    moduleQuizQuestionCount: 0,
    hasFinalAssessment: false,
    finalAssessmentQuestionCount: 0,
    totalQuizQuestions: 0,
    
    // ACEP Compliance checks
    hasObjectives: false,
    objectiveCount: 0,
    hasTargetAudience: false,
    hasPresenter: false,
    hasReferences: false,
    referenceCount: 0,
    
    // Issues found
    issues: [],
    
    // Timestamps
    createdAt: course.createdAt,
    updatedAt: course.updatedAt
  };
  
  // Analyze modules
  if (course.modules && Array.isArray(course.modules)) {
    result.moduleCount = course.modules.length;
    
    course.modules.forEach((mod, modIndex) => {
      let moduleWords = 0;
      const moduleLessons = mod.lessons || [];
      
      moduleLessons.forEach(lesson => {
        result.lessonCount++;
        
        // Count by type
        const lessonType = lesson.type || 'text';
        if (lessonType === 'text') result.textLessonCount++;
        else if (lessonType === 'video') result.videoLessonCount++;
        else if (lessonType === 'quiz') result.quizLessonCount++;
        else result.interactiveLessonCount++;
        
        // Count words from content
        if (lesson.content) {
          moduleWords += countWords(lesson.content);
        }
        
        // Count words from accordion items
        if (lesson.accordionItems && Array.isArray(lesson.accordionItems)) {
          lesson.accordionItems.forEach(item => {
            moduleWords += countWords(item.title);
            moduleWords += countWords(item.content);
          });
        }
        
        // Count quiz questions in lessons
        if (lesson.questions && Array.isArray(lesson.questions)) {
          result.moduleQuizQuestionCount += lesson.questions.length;
        }
      });
      
      // Module-level quiz
      if (mod.quizQuestions && Array.isArray(mod.quizQuestions) && mod.quizQuestions.length > 0) {
        result.hasModuleQuizzes = true;
        result.moduleQuizQuestionCount += mod.quizQuestions.length;
      }
      
      result.wordsByModule.push({
        title: mod.title || `Module ${modIndex + 1}`,
        words: moduleWords,
        lessons: moduleLessons.length
      });
      
      result.totalWords += moduleWords;
    });
  }
  
  // Final assessment
  if (course.assessment && course.assessment.questions && course.assessment.questions.length > 0) {
    result.hasFinalAssessment = true;
    result.finalAssessmentQuestionCount = course.assessment.questions.length;
  }
  
  result.totalQuizQuestions = result.moduleQuizQuestionCount + result.finalAssessmentQuestionCount;
  
  // Learning objectives
  if (course.objectives && Array.isArray(course.objectives) && course.objectives.length > 0) {
    result.hasObjectives = true;
    result.objectiveCount = course.objectives.length;
  }
  
  // Target audience
  if (course.targetAudience && Array.isArray(course.targetAudience) && course.targetAudience.length > 0) {
    result.hasTargetAudience = true;
  }
  
  // Presenter info
  if (course.presenter && course.presenter.name) {
    result.hasPresenter = true;
  }
  
  // References
  if (course.references && Array.isArray(course.references) && course.references.length > 0) {
    result.hasReferences = true;
    result.referenceCount = course.references.length;
  }
  
  // Calculate percentages and identify issues
  const wordPercent = result.targetWordCount > 0 
    ? Math.round((result.totalWords / result.targetWordCount) * 100) 
    : 0;
  result.wordCountPercent = wordPercent;
  
  // Issue detection
  if (result.status !== 'published' && result.status !== 'draft' && result.status !== 'archived') {
    result.issues.push('INVALID_STATUS');
  }
  
  if (result.moduleCount === 0) {
    result.issues.push('NO_MODULES');
  }
  
  if (result.lessonCount === 0) {
    result.issues.push('NO_LESSONS');
  }
  
  if (result.totalWords < 100) {
    result.issues.push('NO_CONTENT');
  } else if (result.targetWordCount > 0 && wordPercent < 50) {
    result.issues.push('LOW_WORD_COUNT');
  } else if (result.targetWordCount > 0 && wordPercent < 80) {
    result.issues.push('WORD_COUNT_SHORT');
  }
  
  if (result.ceuHours > 0 && result.totalQuizQuestions === 0) {
    result.issues.push('NO_QUIZ');
  } else if (result.ceuHours > 0 && result.totalQuizQuestions < 15) {
    result.issues.push('QUIZ_TOO_SHORT');
  }
  
  if (result.ceuHours > 0 && !result.hasObjectives) {
    result.issues.push('NO_OBJECTIVES');
  }
  
  if (result.ceuHours > 0 && !result.hasTargetAudience) {
    result.issues.push('NO_TARGET_AUDIENCE');
  }
  
  // Determine bucket
  if (result.issues.includes('NO_MODULES') || result.issues.includes('NO_LESSONS') || result.issues.includes('NO_CONTENT')) {
    result.bucket = 'SHELL_ONLY';
  } else if (result.issues.length === 0) {
    result.bucket = 'READY';
  } else if (result.issues.some(i => ['NO_QUIZ', 'QUIZ_TOO_SHORT', 'NO_OBJECTIVES'].includes(i))) {
    result.bucket = 'NEEDS_FIXES';
  } else if (result.issues.some(i => ['LOW_WORD_COUNT', 'WORD_COUNT_SHORT'].includes(i))) {
    result.bucket = 'NEEDS_CONTENT';
  } else {
    result.bucket = 'NEEDS_REVIEW';
  }
  
  return result;
}

async function runAudit() {
  console.log('\n🔍 CounselorReady Course Catalog Audit');
  console.log('=' .repeat(60));
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');
    
    const courses = await Course.find({}).lean();
    console.log(`Found ${courses.length} courses in database\n`);
    
    // Analyze all courses
    const results = courses.map(analyzeCourse);
    
    // Sort by bucket priority, then by title
    const bucketOrder = ['READY', 'NEEDS_REVIEW', 'NEEDS_CONTENT', 'NEEDS_FIXES', 'SHELL_ONLY'];
    results.sort((a, b) => {
      const bucketDiff = bucketOrder.indexOf(a.bucket) - bucketOrder.indexOf(b.bucket);
      if (bucketDiff !== 0) return bucketDiff;
      return a.title.localeCompare(b.title);
    });
    
    // Summary stats
    const summary = {
      total: results.length,
      published: results.filter(r => r.status === 'published').length,
      draft: results.filter(r => r.status === 'draft').length,
      archived: results.filter(r => r.status === 'archived').length,
      other: results.filter(r => !['published', 'draft', 'archived'].includes(r.status)).length,
      
      byBucket: {
        READY: results.filter(r => r.bucket === 'READY').length,
        NEEDS_REVIEW: results.filter(r => r.bucket === 'NEEDS_REVIEW').length,
        NEEDS_CONTENT: results.filter(r => r.bucket === 'NEEDS_CONTENT').length,
        NEEDS_FIXES: results.filter(r => r.bucket === 'NEEDS_FIXES').length,
        SHELL_ONLY: results.filter(r => r.bucket === 'SHELL_ONLY').length
      }
    };
    
    // Print summary
    console.log('📊 SUMMARY');
    console.log('-'.repeat(60));
    console.log(`Total courses:     ${summary.total}`);
    console.log(`  Published:       ${summary.published} (visible to learners)`);
    console.log(`  Draft:           ${summary.draft} (admin only)`);
    console.log(`  Archived:        ${summary.archived}`);
    if (summary.other > 0) console.log(`  Invalid status:  ${summary.other} ⚠️`);
    console.log();
    console.log('By readiness:');
    console.log(`  ✅ READY:         ${summary.byBucket.READY}`);
    console.log(`  🔍 NEEDS_REVIEW:  ${summary.byBucket.NEEDS_REVIEW}`);
    console.log(`  📝 NEEDS_CONTENT: ${summary.byBucket.NEEDS_CONTENT}`);
    console.log(`  🔧 NEEDS_FIXES:   ${summary.byBucket.NEEDS_FIXES}`);
    console.log(`  💀 SHELL_ONLY:    ${summary.byBucket.SHELL_ONLY}`);
    console.log();
    
    // Print detailed table
    console.log('📋 DETAILED COURSE LIST');
    console.log('-'.repeat(120));
    console.log(
      'Status'.padEnd(10) +
      'Bucket'.padEnd(15) +
      'CE'.padEnd(4) +
      'Words'.padEnd(8) +
      'Target'.padEnd(8) +
      '%'.padEnd(5) +
      'Mod'.padEnd(4) +
      'Lsn'.padEnd(4) +
      'Quiz'.padEnd(5) +
      'Title'.padEnd(50)
    );
    console.log('-'.repeat(120));
    
    results.forEach(r => {
      const statusIcon = r.status === 'published' ? '🟢' : r.status === 'draft' ? '🟡' : '⚫';
      console.log(
        `${statusIcon} ${r.status}`.padEnd(12) +
        r.bucket.padEnd(15) +
        String(r.ceuHours || '-').padEnd(4) +
        String(r.totalWords).padEnd(8) +
        String(r.targetWordCount || '-').padEnd(8) +
        `${r.wordCountPercent}%`.padEnd(5) +
        String(r.moduleCount).padEnd(4) +
        String(r.lessonCount).padEnd(4) +
        String(r.totalQuizQuestions).padEnd(5) +
        r.title.substring(0, 48)
      );
    });
    
    // Show issues
    console.log('\n⚠️  ISSUES BY COURSE');
    console.log('-'.repeat(60));
    results.filter(r => r.issues.length > 0).forEach(r => {
      console.log(`${r.title.substring(0, 40).padEnd(42)} ${r.issues.join(', ')}`);
    });
    
    // Generate CSV
    const csvHeader = [
      'ID', 'Title', 'Slug', 'Status', 'Visible', 'Bucket',
      'CE Hours', 'Words', 'Target Words', 'Word %',
      'Modules', 'Lessons', 'Text', 'Video', 'Quiz', 'Interactive',
      'Quiz Questions', 'Has Final Assessment', 'Final Assessment Qs',
      'Has Objectives', 'Objective Count', 'Has Target Audience',
      'Has Presenter', 'Has References', 'Reference Count',
      'Issues', 'Created', 'Updated'
    ].join(',');
    
    const csvRows = results.map(r => [
      r._id,
      `"${(r.title || '').replace(/"/g, '""')}"`,
      r.slug,
      r.status,
      r.visibleToLearners ? 'YES' : 'NO',
      r.bucket,
      r.ceuHours,
      r.totalWords,
      r.targetWordCount,
      r.wordCountPercent,
      r.moduleCount,
      r.lessonCount,
      r.textLessonCount,
      r.videoLessonCount,
      r.quizLessonCount,
      r.interactiveLessonCount,
      r.totalQuizQuestions,
      r.hasFinalAssessment ? 'YES' : 'NO',
      r.finalAssessmentQuestionCount,
      r.hasObjectives ? 'YES' : 'NO',
      r.objectiveCount,
      r.hasTargetAudience ? 'YES' : 'NO',
      r.hasPresenter ? 'YES' : 'NO',
      r.hasReferences ? 'YES' : 'NO',
      r.referenceCount,
      `"${r.issues.join('; ')}"`,
      r.createdAt ? new Date(r.createdAt).toISOString().split('T')[0] : '',
      r.updatedAt ? new Date(r.updatedAt).toISOString().split('T')[0] : ''
    ].join(','));
    
    const csvContent = [csvHeader, ...csvRows].join('\n');
    fs.writeFileSync('course_audit.csv', csvContent);
    console.log('\n✓ Saved: course_audit.csv');
    
    // Save JSON for detailed analysis
    const jsonOutput = {
      generatedAt: new Date().toISOString(),
      summary,
      courses: results
    };
    fs.writeFileSync('course_audit.json', JSON.stringify(jsonOutput, null, 2));
    console.log('✓ Saved: course_audit.json');
    
    // Quick action list
    console.log('\n🎯 RECOMMENDED ACTIONS');
    console.log('-'.repeat(60));
    
    if (summary.byBucket.SHELL_ONLY > 0) {
      console.log(`\n1. DELETE OR REBUILD (${summary.byBucket.SHELL_ONLY} courses):`);
      results.filter(r => r.bucket === 'SHELL_ONLY').forEach(r => {
        console.log(`   - ${r.title}`);
      });
    }
    
    if (summary.byBucket.NEEDS_FIXES > 0) {
      console.log(`\n2. FIX THESE (${summary.byBucket.NEEDS_FIXES} courses) - structure exists, needs quiz/objectives:`);
      results.filter(r => r.bucket === 'NEEDS_FIXES').slice(0, 10).forEach(r => {
        console.log(`   - ${r.title} [${r.issues.join(', ')}]`);
      });
      if (summary.byBucket.NEEDS_FIXES > 10) console.log(`   ... and ${summary.byBucket.NEEDS_FIXES - 10} more`);
    }
    
    if (summary.byBucket.NEEDS_CONTENT > 0) {
      console.log(`\n3. ADD CONTENT (${summary.byBucket.NEEDS_CONTENT} courses) - need more words:`);
      results.filter(r => r.bucket === 'NEEDS_CONTENT').slice(0, 10).forEach(r => {
        console.log(`   - ${r.title} (${r.totalWords}/${r.targetWordCount} words = ${r.wordCountPercent}%)`);
      });
    }
    
    if (summary.byBucket.READY > 0) {
      console.log(`\n4. READY TO GO (${summary.byBucket.READY} courses):`);
      results.filter(r => r.bucket === 'READY').forEach(r => {
        const pubStatus = r.status === 'published' ? '✅ LIVE' : '📝 Draft';
        console.log(`   ${pubStatus} - ${r.title}`);
      });
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('Audit complete!');
    
  } catch (error) {
    console.error('Audit failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

runAudit();
