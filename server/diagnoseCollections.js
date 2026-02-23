/**
 * diagnoseCollections.js - Check BOTH collections for the 3 empty courses
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);
const ic = mongoose.connection.db.collection('interactivecourses');
const sc = mongoose.connection.db.collection('courses');

const slugs = [
  'dbt-skills-training-comprehensive',
  'mandated-reporter-duty', 
  'narrative-therapy-techniques'
];

function countBlocksAndWords(containers) {
  let blocks = 0, words = 0, types = {};
  for (const c of (containers || [])) {
    for (const b of (c.contentBlocks || c.lessons || [])) {
      blocks++;
      types[b.type] = (types[b.type] || 0) + 1;
      const txt = (b.content || '') + (b.textContent || '');
      words += txt.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(w => w).length;
      if (b.accordionItems) {
        for (const a of b.accordionItems) {
          words += ((a.content || '') + (a.textContent || '')).replace(/<[^>]+>/g, ' ').split(/\s+/).filter(w => w).length;
        }
      }
    }
  }
  return { blocks, words, types };
}

for (const slug of slugs) {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`🔍 ${slug}`);
  
  // Check interactivecourses
  const icDoc = await ic.findOne({ slug });
  if (icDoc) {
    const secStats = countBlocksAndWords(icDoc.sections);
    const modStats = countBlocksAndWords(icDoc.modules);
    console.log(`\n  interactivecourses: ✅ FOUND`);
    console.log(`    sections: ${(icDoc.sections||[]).length} | ${secStats.blocks} blocks | ${secStats.words} words | types: ${JSON.stringify(secStats.types)}`);
    console.log(`    modules:  ${(icDoc.modules||[]).length} | ${modStats.blocks} blocks | ${modStats.words} words | types: ${JSON.stringify(modStats.types)}`);
  } else {
    console.log(`  interactivecourses: ❌ NOT FOUND`);
  }
  
  // Check courses collection
  const scDoc = await sc.findOne({ slug });
  if (scDoc) {
    const secStats = countBlocksAndWords(scDoc.sections);
    const modStats = countBlocksAndWords(scDoc.modules);
    console.log(`\n  courses: ✅ FOUND`);
    console.log(`    sections: ${(scDoc.sections||[]).length} | ${secStats.blocks} blocks | ${secStats.words} words | types: ${JSON.stringify(secStats.types)}`);
    console.log(`    modules:  ${(scDoc.modules||[]).length} | ${modStats.blocks} blocks | ${modStats.words} words | types: ${JSON.stringify(modStats.types)}`);
  } else {
    console.log(`\n  courses: ❌ NOT FOUND`);
  }
  
  // Also check by partial title match in both collections
  const title = icDoc?.title || slug;
  const titleWord = title.split(':')[0].trim().split(' ').slice(0,3).join(' ');
  
  const icAlt = await ic.find({ title: { $regex: titleWord, $options: 'i' } }).toArray();
  const scAlt = await sc.find({ title: { $regex: titleWord, $options: 'i' } }).toArray();
  
  if (icAlt.length > 1 || scAlt.length > 1) {
    console.log(`\n  ⚠️  Multiple matches for "${titleWord}":`);
    for (const d of icAlt) {
      const stats = countBlocksAndWords(d.modules);
      console.log(`    IC: ${d.slug} — ${stats.blocks} module blocks, ${stats.words} words`);
    }
    for (const d of scAlt) {
      const stats = countBlocksAndWords(d.modules);
      console.log(`    SC: ${d.slug} — ${stats.blocks} module blocks, ${stats.words} words`);
    }
  }
}

await mongoose.disconnect();
