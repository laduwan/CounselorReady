import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);
const c = mongoose.connection.db.collection('interactivecourses');

const slug = 'neurobiology-of-trauma';

// Test: replicate what updateNeurobiologyCourse does
console.log('Test A: $set sections with new content...');
const r = await c.findOneAndUpdate(
  { slug },
  { $set: { 
    sections: [
      {
        title: 'TEST SECTION ONE',
        order: 0,
        contentBlocks: [
          { type: 'text', order: 0, textContent: '<p>Test content with many words to verify persistence.</p>' }
        ]
      }
    ],
    wordCount: 8888
  }},
  { returnDocument: 'after' }
);
console.log('  returned sections:', r.sections?.length);
console.log('  returned wordCount:', r.wordCount);
console.log('  returned sec0 title:', r.sections?.[0]?.title);

// Now read it back fresh
console.log('\nTest B: Fresh read...');
const fresh = await c.findOne({ slug });
console.log('  sections:', fresh.sections?.length);
console.log('  wordCount:', fresh.wordCount);
console.log('  sec0 title:', fresh.sections?.[0]?.title);
console.log('  sec0 blocks:', fresh.sections?.[0]?.contentBlocks?.length);

if (fresh.wordCount === 8888 && fresh.sections?.[0]?.title === 'TEST SECTION ONE') {
  console.log('\n✅ Direct $set WORKS. Problem is in the update script itself.');
} else {
  console.log('\n❌ Direct $set FAILED. MongoDB or middleware is blocking writes.');
}

// Restore
console.log('\nRestoring original (re-run backfillWordCount.js after)...');
// Don't restore - let me see if it actually persisted
// We'll fix it after

await mongoose.disconnect();
