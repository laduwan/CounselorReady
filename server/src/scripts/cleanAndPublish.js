/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// cleanAndPublish.js
// Step 1: Delete 14 empty courses (0 words, 0 modules)
// Step 2: Publish 5 complete courses still in draft
// Run: node src/scripts/cleanAndPublish.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

// Schema (minimal, just need title + status)
const courseSchema = new mongoose.Schema({}, { strict: false, collection: 'courses' });
const Course = mongoose.model('Course', courseSchema);

// ════════════════════════════════════════════════════════
// EMPTY COURSES TO DELETE (0 words, 0 modules)
// ════════════════════════════════════════════════════════
const EMPTY_TITLES = [
  'Mandated Reporting',
  'Active Listening: The Foundation of Effective Therapy',
  'YOUR COURSE TITLE HERE',
  'The Sixth Sense: Clinical Intuition and Assessment in Counseling',
  'Ordinary People: Family Systems and Grief in Clinical Practice',
  'Black Swan: Perfectionism and Anxiety Disorders in Clinical Practice',
  'A Beautiful Mind: Understanding and Treating Serious Mental Illness',
  'polyvagal theory: Evidence-Based Approaches for Mental Health Professionals',
  'See Something? Say Something: Your Duty as a Mandated Reporter',
  'Foundations of Cultural Competence, Ethics, and Risk Reduction',
  'Plot Twist: Narrative Therapy Techniques That Actually Work in Session',
  'Trauma-Informed Care: Foundations for Clinical Practice',
  'The Neurobiology of Trauma',
  'Dialectical Behavior Therapy: Foundations, Clinical Applications, and Evidence-Based Integration',
];

// ════════════════════════════════════════════════════════
// COMPLETE COURSES TO PUBLISH (currently draft, 90%+ words)
// ════════════════════════════════════════════════════════
const PUBLISH_TITLES = [
  'Motivational Interviewing: From Ambivalence to Action',
  '28 Days Later: Understanding Addiction and Recovery',
  'Ethics and Professional Boundaries in Counseling Practice',
  'Crisis Intervention and Suicide Prevention',
  'Suicide Risk Assessment: Evidence-Based Approaches for Mental Health Professionals',
];

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // ── STEP 1: DELETE EMPTIES ──
    console.log('═══════════════════════════════════════');
    console.log('STEP 1: DELETING EMPTY COURSES');
    console.log('═══════════════════════════════════════\n');

    let deleted = 0;
    let notFound = 0;

    for (const title of EMPTY_TITLES) {
      // Use regex for flexible matching (case-insensitive, partial)
      const course = await Course.findOne({ 
        title: { $regex: new RegExp(title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') }
      });

      if (course) {
        const modules = course.modules || [];
        const wordCount = course.totalWordCount || 0;
        
        // Safety check: only delete if truly empty
        if (modules.length === 0 || wordCount === 0) {
          await Course.deleteOne({ _id: course._id });
          console.log(`  🗑️  DELETED: "${course.title}" (${course.ceuHours || 0} CE, ${wordCount} words)`);
          deleted++;
        } else {
          console.log(`  ⚠️  SKIPPED (has content): "${course.title}" (${modules.length} modules, ${wordCount} words)`);
        }
      } else {
        console.log(`  ❌ NOT FOUND: "${title}"`);
        notFound++;
      }
    }

    console.log(`\n  Summary: ${deleted} deleted, ${notFound} not found\n`);

    // ── STEP 2: PUBLISH COMPLETE COURSES ──
    console.log('═══════════════════════════════════════');
    console.log('STEP 2: PUBLISHING COMPLETE COURSES');
    console.log('═══════════════════════════════════════\n');

    let published = 0;

    for (const title of PUBLISH_TITLES) {
      const course = await Course.findOne({
        title: { $regex: new RegExp(title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') }
      });

      if (course) {
        if (course.status === 'published') {
          console.log(`  ✅ ALREADY PUBLISHED: "${course.title}"`);
        } else {
          await Course.updateOne(
            { _id: course._id },
            { $set: { status: 'published' } }
          );
          console.log(`  📢 PUBLISHED: "${course.title}" (${course.ceuHours || 0} CE, ${course.totalWordCount || 0} words)`);
          published++;
        }
      } else {
        console.log(`  ❌ NOT FOUND: "${title}"`);
      }
    }

    console.log(`\n  Summary: ${published} newly published\n`);

    // ── FINAL STATUS ──
    console.log('═══════════════════════════════════════');
    console.log('FINAL CATALOG STATUS');
    console.log('═══════════════════════════════════════\n');

    const remaining = await Course.find({}).select('title status ceuHours totalWordCount').sort({ status: 1, title: 1 });
    
    let totalCE = 0;
    let pubCount = 0;
    let draftCount = 0;

    for (const c of remaining) {
      const ce = c.ceuHours || 0;
      const words = c.totalWordCount || 0;
      const icon = c.status === 'published' ? '📢' : '📝';
      console.log(`  ${icon} [${c.status}] ${c.title} — ${ce} CE, ${words} words`);
      totalCE += ce;
      if (c.status === 'published') pubCount++;
      else draftCount++;
    }

    console.log(`\n  TOTAL: ${remaining.length} courses | ${pubCount} published, ${draftCount} draft | ${totalCE} CE hours`);

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected');
  }
}

run();
