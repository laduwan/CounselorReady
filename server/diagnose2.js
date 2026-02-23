import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);
const c = mongoose.connection.db.collection('interactivecourses');

const course = await c.findOne({ slug: 'neurobiology-of-trauma' });

console.log('Title:', course.title);
console.log('Sections:', course.sections?.length);
console.log('Modules:', course.modules?.length);
console.log('');

// Show first section details
if (course.sections?.[0]) {
  const sec = course.sections[0];
  console.log('Section 0 title:', sec.title);
  console.log('Section 0 blocks:', sec.contentBlocks?.length);
  (sec.contentBlocks || []).forEach((b, i) => {
    const txt = b.textContent || b.content || '';
    const words = txt.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(x => x).length;
    console.log(`  Block ${i}: type=${b.type}, words=${words}, has textContent=${!!b.textContent}, has content=${!!b.content}`);
    if (b.type === 'text' && words > 0) {
      console.log(`    Preview: ${txt.replace(/<[^>]+>/g, '').substring(0, 80)}...`);
    }
  });
}

// Check if there's a second document with same slug
const dupes = await c.find({ slug: 'neurobiology-of-trauma' }).project({ _id: 1, title: 1, wordCount: 1 }).toArray();
console.log('\nAll docs with this slug:', dupes);

await mongoose.disconnect();
