/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('No MONGODB_URI'); process.exit(1); }

async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;

  console.log('\n' + '='.repeat(80));
  console.log('CBT COURSE CHECK — All CBT-related courses in both collections');
  console.log('='.repeat(80) + '\n');

  // Search interactivecourses
  console.log('INTERACTIVECOURSES COLLECTION:');
  console.log('-'.repeat(40));
  const icCBT = await db.collection('interactivecourses').find({
    $or: [
      { title: { $regex: /cbt|cognitive.behav/i } },
      { slug: { $regex: /cbt|cognitive|aca-ethics/i } }
    ]
  }).toArray();

  if (icCBT.length === 0) {
    console.log('  No CBT courses found');
  } else {
    for (const c of icCBT) {
      const sections = c.sections || [];
      let words = 0;
      sections.forEach(s => {
        (s.contentBlocks || []).forEach(b => {
          const txt = b.textContent || b.content || '';
          const plain = txt.replace(/<[^>]+>/g, ' ').trim();
          if (plain) words += plain.split(/\s+/).filter(w => w.length > 0).length;
        });
      });
      console.log(`  Title: ${c.title}`);
      console.log(`  Slug:  ${c.slug}`);
      console.log(`  CE:    ${c.ceHours}hr | Words: ${words} | Sections: ${sections.length}`);
      console.log(`  Status: ${c.status} | ID: ${c._id}`);
      console.log('');
    }
  }

  // Search legacy courses
  console.log('\nLEGACY COURSES COLLECTION:');
  console.log('-'.repeat(40));
  const legCBT = await db.collection('courses').find({
    $or: [
      { title: { $regex: /cbt|cognitive.behav/i } },
      { slug: { $regex: /cbt|cognitive|aca-ethics/i } }
    ]
  }).toArray();

  if (legCBT.length === 0) {
    console.log('  No CBT courses found');
  } else {
    for (const c of legCBT) {
      const modules = c.modules || c.sections || [];
      let words = 0;
      modules.forEach(m => {
        (m.lessons || []).forEach(l => {
          const txt = l.content || '';
          const plain = txt.replace(/<[^>]+>/g, ' ').trim();
          if (plain) words += plain.split(/\s+/).filter(w => w.length > 0).length;
        });
        (m.contentBlocks || []).forEach(b => {
          const txt = b.textContent || b.content || '';
          const plain = txt.replace(/<[^>]+>/g, ' ').trim();
          if (plain) words += plain.split(/\s+/).filter(w => w.length > 0).length;
        });
      });
      console.log(`  Title: ${c.title}`);
      console.log(`  Slug:  ${c.slug}`);
      console.log(`  CE:    ${c.ceHours || c.ceuHours || '?'}hr | Words: ${words} | Modules: ${modules.length}`);
      console.log(`  Status: ${c.status} | ID: ${c._id}`);
      console.log('');
    }
  }

  // Also check for the aca-ethics slug specifically
  console.log('\nACA-ETHICS SLUG CHECK:');
  console.log('-'.repeat(40));
  const acaIC = await db.collection('interactivecourses').findOne({ slug: 'aca-ethics-section-a-counseling-relationship' });
  const acaLeg = await db.collection('courses').findOne({ slug: 'aca-ethics-section-a-counseling-relationship' });
  console.log(`  interactivecourses: ${acaIC ? acaIC.title + ' (' + acaIC.ceHours + 'hr)' : 'NOT FOUND'}`);
  console.log(`  legacy courses:     ${acaLeg ? acaLeg.title + ' (' + (acaLeg.ceHours || acaLeg.ceuHours || '?') + 'hr)' : 'NOT FOUND'}`);

  await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
