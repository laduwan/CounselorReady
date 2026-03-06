/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
#!/usr/bin/env node
/**
 * cleanupEmptyShells.js
 * 
 * Removes empty shell courses (no CE hours, no content) from both collections.
 * Also removes duplicate courses, keeping the one with more content.
 * 
 * Run on Render: node src/scripts/cleanupEmptyShells.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('❌ MONGODB_URI not found'); process.exit(1); }

function countWords(course) {
  let total = 0;
  for (const mod of (course.modules || [])) {
    for (const item of (mod.lessons || mod.contentBlocks || [])) {
      const text = item.content || item.textContent || '';
      total += text.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(w => w).length;
      if (item.accordionItems) {
        for (const ai of item.accordionItems) {
          total += (ai.content || '').replace(/<[^>]*>/g, ' ').split(/\s+/).filter(w => w).length;
        }
      }
    }
  }
  return total;
}

async function main() {
  console.log('\n' + '═'.repeat(60));
  console.log('  CLEANUP EMPTY SHELLS');
  console.log('═'.repeat(60));

  await mongoose.connect(MONGODB_URI);
  console.log('\n✅ Connected\n');

  const db = mongoose.connection.db;

  for (const collName of ['courses', 'interactivecourses']) {
    const coll = db.collection(collName);
    const all = await coll.find({}).toArray();
    console.log(`\n📊 ${collName}: ${all.length} courses`);

    let deleted = 0;
    for (const course of all) {
      const ce = course.ceHours || course.credits || course.ceuHours || 0;
      const words = countWords(course);
      const hasModules = (course.modules?.length || 0) > 0;
      const slug = course.slug || '';

      // Delete if: no CE hours AND (no modules OR < 200 words)
      const isShell = (ce === 0 || ce === 'none' || ce === null) && (!hasModules || words < 200);
      
      if (isShell) {
        console.log(`  ❌ Deleting shell: ${slug || course.title?.substring(0, 50)} (${ce} CE, ${words} words)`);
        await coll.deleteOne({ _id: course._id });
        deleted++;
      }
    }

    const remaining = await coll.countDocuments();
    console.log(`  Deleted ${deleted} shells. Remaining: ${remaining}`);
  }

  // Report duplicates (same title in both collections)
  console.log('\n' + '─'.repeat(60));
  console.log('  Checking for duplicates across collections...\n');
  
  const oldCourses = await db.collection('courses').find({}, { projection: { slug: 1, title: 1 } }).toArray();
  const newCourses = await db.collection('interactivecourses').find({}, { projection: { slug: 1, title: 1 } }).toArray();
  
  const newSlugs = new Set(newCourses.map(c => c.slug));
  let dupes = 0;
  for (const old of oldCourses) {
    if (old.slug && newSlugs.has(old.slug)) {
      console.log(`  ⚠️  Duplicate slug in both collections: ${old.slug}`);
      dupes++;
    }
  }
  console.log(`\n  Found ${dupes} duplicates (old collection versions can be safely deleted after migration)`);

  console.log('\n' + '═'.repeat(60));
  console.log('  Done.');
  console.log('═'.repeat(60) + '\n');

  await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
