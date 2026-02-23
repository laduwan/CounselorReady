/**
 * diagnoseEmpty.js - Check what's actually stored for DBT, Mandated Reporter, Narrative Therapy
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);
const c = mongoose.connection.db.collection('interactivecourses');

const slugs = [
  'dbt-skills-training-comprehensive',
  'mandated-reporter-duty',
  'narrative-therapy-techniques'
];

for (const slug of slugs) {
  const course = await c.findOne({ slug });
  if (!course) { console.log(`\n❌ ${slug}: NOT FOUND`); continue; }
  
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`📋 ${course.title}`);
  console.log(`   slug: ${slug}`);
  console.log(`   ceHours: ${course.ceHours}`);
  
  // Check sections
  const secs = course.sections || [];
  console.log(`\n   sections[]: ${secs.length} items`);
  for (let i = 0; i < Math.min(secs.length, 3); i++) {
    const s = secs[i];
    console.log(`     [${i}] title: "${s.title || 'none'}"`);
    console.log(`         contentBlocks: ${(s.contentBlocks || []).length}`);
    if (s.contentBlocks?.length > 0) {
      for (let j = 0; j < Math.min(s.contentBlocks.length, 3); j++) {
        const b = s.contentBlocks[j];
        const keys = Object.keys(b).filter(k => k !== '_id');
        const contentLen = (b.content || '').length;
        const textContentLen = (b.textContent || '').length;
        console.log(`         block[${j}]: type=${b.type}, keys=[${keys.join(',')}], content=${contentLen}ch, textContent=${textContentLen}ch`);
      }
      if (s.contentBlocks.length > 3) console.log(`         ... +${s.contentBlocks.length - 3} more blocks`);
    }
  }
  if (secs.length > 3) console.log(`     ... +${secs.length - 3} more sections`);
  
  // Check modules
  const mods = course.modules || [];
  console.log(`\n   modules[]: ${mods.length} items`);
  for (let i = 0; i < Math.min(mods.length, 3); i++) {
    const m = mods[i];
    console.log(`     [${i}] title: "${m.title || 'none'}"`);
    const blocks = m.contentBlocks || m.lessons || [];
    console.log(`         contentBlocks/lessons: ${blocks.length}`);
    if (blocks.length > 0) {
      for (let j = 0; j < Math.min(blocks.length, 3); j++) {
        const b = blocks[j];
        const keys = Object.keys(b).filter(k => k !== '_id');
        const contentLen = (b.content || '').length;
        const textContentLen = (b.textContent || '').length;
        console.log(`         block[${j}]: type=${b.type}, keys=[${keys.join(',')}], content=${contentLen}ch, textContent=${textContentLen}ch`);
      }
      if (blocks.length > 3) console.log(`         ... +${blocks.length - 3} more blocks`);
    }
  }
  if (mods.length > 3) console.log(`     ... +${mods.length - 3} more modules`);
  
  // Check ALL top-level keys
  const topKeys = Object.keys(course).filter(k => !['_id', '__v'].includes(k));
  console.log(`\n   Top-level keys: ${topKeys.join(', ')}`);
  
  // Check assessment
  const aq = course.assessment?.questions?.length || 0;
  console.log(`   Assessment questions: ${aq}`);
  console.log(`   References: ${(course.references || []).length}`);
}

await mongoose.disconnect();
