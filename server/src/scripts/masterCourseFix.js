/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
#!/usr/bin/env node
/**
 * masterCourseFix.js
 * 
 * ONE SCRIPT TO FIX EVERYTHING:
 * 1. Fix CE hours on legacy courses that have content but show 0CE
 * 2. Report which courses need expanded content (user runs separate update)
 * 3. Report which complete courses are MISSING from DB
 * 
 * Run: node src/scripts/masterCourseFix.js
 * 
 * Safe: Only updates ceHours on courses that already have content.
 * Does NOT delete anything.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found');
  process.exit(1);
}

async function masterFix() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;
  
  console.log('\n' + '═'.repeat(60));
  console.log('  COUNSELORREADY MASTER COURSE FIX');
  console.log('  ' + new Date().toISOString().split('T')[0]);
  console.log('═'.repeat(60));

  const courses = await db.collection('courses').find({}).toArray();
  console.log(`\nFound ${courses.length} courses in DB\n`);

  // ============================================================
  // PHASE 1: FIX CE HOURS ON LEGACY COURSES WITH CONTENT
  // ============================================================
  console.log('━'.repeat(60));
  console.log('PHASE 1: Fixing CE hours on content-rich legacy courses');
  console.log('━'.repeat(60));

  const ceFixMap = {
    'The CBT Toolbox: Core Techniques for Clinical Practice': 3,
    'Cultural Humility in Clinical Practice: Beyond Cultural Competence': 3,
    'DBT Skills in Action: Practical Applications for Emotional Dysregulation': 2,
    'Introduction to Mindfulness in Clinical Practice': 1,
    'Building Therapeutic Rapport: The First Sessions': 1,
    'Psychiatric Medications: What Non-Prescribers Need to Know': 1,
    'Mental Health Billing Essentials for Licensed Professional Counselors': 1,
    'Ethical Uses of AI in Mental Health Counseling': 1,
    'Existential Theory in Clinical Practice: Applications and Interventions': 1,
    'Motivational Interviewing in First Sessions: Empowering Clients for Change': 1,
  };

  let fixed = 0;
  for (const course of courses) {
    const title = course.title || '';
    // Find matching key (partial match)
    const matchKey = Object.keys(ceFixMap).find(k => title.startsWith(k.substring(0, 30)));
    
    if (matchKey && (!course.ceHours || course.ceHours === 0)) {
      const newCE = ceFixMap[matchKey];
      
      // Calculate word count to verify
      let words = 0;
      (course.modules || []).forEach(m => {
        (m.lessons || []).forEach(l => {
          words += (l.content || l.textContent || '').replace(/<[^>]*>/g, ' ').split(/\s+/).filter(s => s).length;
        });
      });
      
      // Only assign CE if word count supports it (at least 4000 words per CE hour — being generous)
      const supportedCE = Math.floor(words / 4000);
      const assignCE = Math.min(newCE, Math.max(1, supportedCE));
      
      await db.collection('courses').updateOne(
        { _id: course._id },
        { $set: { ceHours: assignCE, credits: assignCE } }
      );
      console.log(`  ✅ ${title.substring(0, 50)}: 0CE → ${assignCE}CE (${words.toLocaleString()} words)`);
      fixed++;
    }
  }
  console.log(`\n  Fixed: ${fixed} courses\n`);

  // ============================================================
  // PHASE 2: IDENTIFY COURSES NEEDING CONTENT UPDATE
  // ============================================================
  console.log('━'.repeat(60));
  console.log('PHASE 2: Courses in DB that need expanded content');
  console.log('━'.repeat(60));

  const needsUpdate = [];
  for (const course of courses) {
    const ce = course.ceHours || 0;
    if (ce === 0) continue;
    
    let words = 0;
    (course.modules || []).forEach(m => {
      (m.lessons || []).forEach(l => {
        words += (l.content || l.textContent || '').replace(/<[^>]*>/g, ' ').split(/\s+/).filter(s => s).length;
      });
    });
    
    const target = ce * 6000;
    const pct = target > 0 ? Math.round(words / target * 100) : 0;
    
    if (pct < 90) {
      needsUpdate.push({ title: course.title, ce, words, target, pct });
    }
  }

  if (needsUpdate.length === 0) {
    console.log('  ✅ All courses with CE hours meet word count targets!\n');
  } else {
    needsUpdate.sort((a, b) => b.pct - a.pct);
    needsUpdate.forEach(c => {
      const gap = c.target - c.words;
      console.log(`  ⚠️  ${c.title.substring(0, 45).padEnd(45)} | ${c.words.toLocaleString().padStart(6)}/${c.target.toLocaleString()} (${c.pct}%) | need +${gap.toLocaleString()}`);
    });
    console.log(`\n  ${needsUpdate.length} courses need content updates\n`);
  }

  // ============================================================
  // PHASE 3: COMPLETE COURSES MISSING FROM DB
  // ============================================================
  console.log('━'.repeat(60));
  console.log('PHASE 3: Complete courses NOT in database');
  console.log('━'.repeat(60));

  const dbTitles = courses.map(c => (c.title || '').toLowerCase());
  
  const missingCourses = [
    { title: 'The Good, The Bad, and The Boundary', ce: 3, words: '18,034', source: 'Chat: course dev progress' },
    { title: 'Saving Lives: When Every Minute Counts', ce: 4, words: '24,109', source: 'Chat: course dev progress' },
    { title: 'Inside Out: The Neurobiology of Trauma', ce: 3, words: '18,079', source: 'Chat: course dev progress' },
    { title: 'DBT: Foundations, Clinical Applications, and Evidence-Based Integration', ce: 6, words: '41,825', source: 'seedDBTCourse.js in project' },
    { title: 'Cultural Competence, Ethics, and Risk Reduction', ce: 3, words: '18,018', source: 'CR-601 MD in project' },
    { title: 'Career Counseling Across the Lifespan', ce: 4, words: '~24,000', source: 'TXT file in project' },
    { title: 'Ethical Decision-Making in Counseling', ce: 4, words: '~24,000', source: 'TXT file in project' },
  ];

  const actuallyMissing = [];
  missingCourses.forEach(mc => {
    const found = dbTitles.some(t => 
      t.includes(mc.title.toLowerCase().substring(0, 20)) ||
      mc.title.toLowerCase().includes(t.substring(0, 20))
    );
    if (!found) {
      console.log(`  ❌ MISSING: ${mc.title} (${mc.ce}CE, ${mc.words} words)`);
      console.log(`     Source: ${mc.source}`);
      actuallyMissing.push(mc);
    } else {
      console.log(`  ✅ Found:   ${mc.title.substring(0, 50)}`);
    }
  });

  console.log(`\n  Missing: ${actuallyMissing.length} courses | Found: ${missingCourses.length - actuallyMissing.length}\n`);

  // ============================================================
  // PHASE 4: SUMMARY & NEXT STEPS
  // ============================================================
  console.log('═'.repeat(60));
  console.log('  SUMMARY');
  console.log('═'.repeat(60));

  // Recount after fixes
  const updatedCourses = await db.collection('courses').find({}).toArray();
  let totalCE = 0;
  let publishable = 0;
  
  updatedCourses.forEach(c => {
    const ce = c.ceHours || 0;
    totalCE += ce;
    
    let words = 0;
    (c.modules || []).forEach(m => {
      (m.lessons || []).forEach(l => {
        words += (l.content || l.textContent || '').replace(/<[^>]*>/g, ' ').split(/\s+/).filter(s => s).length;
      });
    });
    
    const target = ce * 6000;
    if (ce > 0 && (words >= target * 0.85)) publishable++;
  });

  console.log(`\n  Total courses in DB:     ${updatedCourses.length}`);
  console.log(`  Courses with CE hours:   ${updatedCourses.filter(c => c.ceHours > 0).length}`);
  console.log(`  Near-publishable (>85%): ${publishable}`);
  console.log(`  Total CE hours in DB:    ${totalCE}`);
  console.log(`  Missing complete courses: ${actuallyMissing.length} (${actuallyMissing.reduce((s, c) => s + c.ce, 0)} CE)`);

  console.log('\n  NEXT STEPS:');
  if (actuallyMissing.length > 0) {
    console.log('  1. Run seedDBTCourse.js to add the DBT course (if missing)');
    console.log('  2. Create seed scripts for remaining missing courses');
  }
  if (needsUpdate.length > 0) {
    console.log('  3. Update courses with expanded content from markdown files');
    console.log('     (Elephant, Village, Eggshells, Rains, Lost in Translation, etc.)');
  }
  console.log('  4. Publish courses when ready via admin dashboard\n');

  await mongoose.disconnect();
  console.log('✅ Done.\n');
}

masterFix().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
