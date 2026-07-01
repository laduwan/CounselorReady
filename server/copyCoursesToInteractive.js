/**
 * copyCoursesToInteractive.js
 * 
 * Copies modules[] from `courses` collection → sections[] in `interactivecourses`
 * for DBT, Mandated Reporter, and Narrative Therapy.
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

function countWords(containers) {
  let words = 0;
  for (const c of (containers || [])) {
    for (const b of (c.contentBlocks || [])) {
      words += ((b.content || '') + ' ' + (b.textContent || '')).replace(/<[^>]+>/g, ' ').split(/\s+/).filter(w => w).length;
      if (b.accordionItems) {
        for (const a of b.accordionItems)
          words += ((a.content || '') + ' ' + (a.textContent || '')).replace(/<[^>]+>/g, ' ').split(/\s+/).filter(w => w).length;
      }
      if (b.question) words += b.question.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(w => w).length;
      if (b.options) for (const o of b.options) words += (typeof o === 'string' ? o : (o.text || '')).split(/\s+/).filter(w => w).length;
      if (b.pairs) for (const p of b.pairs) words += ((p.term || '') + ' ' + (p.definition || '')).split(/\s+/).filter(w => w).length;
    }
  }
  return words;
}

for (const slug of slugs) {
  console.log(`\n${'═'.repeat(60)}`);
  
  // Get full content from courses collection
  const source = await sc.findOne({ slug });
  if (!source || !source.modules?.length) {
    console.log(`❌ ${slug}: no modules in courses collection`);
    continue;
  }
  
  console.log(`📋 ${source.title}`);
  
  // Convert modules → sections (just rename, keep all content blocks intact)
  const sections = source.modules.map((mod, idx) => ({
    title: mod.title || `Module ${idx + 1}`,
    order: idx,
    contentBlocks: (mod.contentBlocks || []).map((block, bIdx) => ({
      ...block,
      order: bIdx
    }))
  }));
  
  const words = countWords(sections);
  let totalBlocks = 0;
  sections.forEach(s => totalBlocks += s.contentBlocks.length);
  
  console.log(`   Source (courses.modules): ${source.modules.length} modules, ${totalBlocks} blocks`);
  console.log(`   Words: ${words}`);
  
  // Write to interactivecourses
  const update = {
    sections,
    modules: source.modules,  // keep modules too for reference
    wordCount: words,
    updatedAt: new Date()
  };
  
  // Also copy references if target is missing them
  const target = await ic.findOne({ slug });
  if (source.references?.length > 0 && (!target?.references?.length)) {
    update.references = source.references;
    console.log(`   Copying ${source.references.length} references`);
  }
  
  await ic.findOneAndUpdate({ slug }, { $set: update });
  
  // Verify
  const verify = await ic.findOne({ slug });
  const verifyBlocks = verify.sections.reduce((s, sec) => s + sec.contentBlocks.length, 0);
  const verifyWords = countWords(verify.sections);
  
  console.log(`   ✅ Written to interactivecourses: ${verify.sections.length} sections, ${verifyBlocks} blocks, ${verifyWords} words`);
}

await mongoose.disconnect();
console.log('\nDone!');
