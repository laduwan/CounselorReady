import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);
const c = mongoose.connection.db.collection('interactivecourses');

const slug = 'neurobiology-of-trauma';

// Read the before state
const before = await c.findOne({ slug });
console.log('BEFORE:');
console.log('  _id:', before._id);
console.log('  sections:', before.sections?.length);
console.log('  wordCount:', before.wordCount);

// Now do EXACTLY what the update script does
// Import and run updateNeurobiologyCourse inline
console.log('\nRunning update...');
try {
  const result = await c.findOneAndUpdate(
    { slug },
    { $set: { 
      title: 'The Neurobiology of Trauma',
      slug: 'neurobiology-of-trauma',
      sections: [
        {
          title: 'Test Real Section',
          order: 0,
          estimatedTime: 45,
          contentBlocks: [
            { type: 'sectionDivider', order: 0, title: 'Test Real Section', sectionNumber: 1 },
            { type: 'text', order: 1, textContent: '<p>Real content test with actual words that should persist in the database and be verifiable.</p>' },
          ]
        }
      ],
      wordCount: 12345
    }},
    { upsert: true, returnDocument: 'after' }
  );
  
  console.log('findOneAndUpdate returned:');
  console.log('  _id:', result._id);
  console.log('  title:', result.title);
  console.log('  sections:', result.sections?.length);
  console.log('  wordCount:', result.wordCount);
  console.log('  sec0 title:', result.sections?.[0]?.title);
  console.log('  sec0 blocks:', result.sections?.[0]?.contentBlocks?.length);
  
  // Same _id?
  console.log('  same _id?', result._id.toString() === before._id.toString());
  
} catch (err) {
  console.log('ERROR:', err.message);
  console.log('CODE:', err.code);
  console.log('FULL:', JSON.stringify(err, null, 2));
}

// Fresh read
console.log('\nAFTER (fresh read):');
const after = await c.findOne({ slug });
console.log('  _id:', after._id);
console.log('  sections:', after.sections?.length);
console.log('  wordCount:', after.wordCount);
console.log('  sec0 title:', after.sections?.[0]?.title);

// Check for duplicates
const dupes = await c.find({ slug }).project({ _id: 1, wordCount: 1 }).toArray();
console.log('\nAll docs with slug:', dupes.length);
dupes.forEach(d => console.log('  ', d._id, 'wordCount:', d.wordCount));

await mongoose.disconnect();
