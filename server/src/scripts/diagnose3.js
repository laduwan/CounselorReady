import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);
const c = mongoose.connection.db.collection('interactivecourses');

// Test 1: Can we write a simple field?
console.log('Test 1: Simple field update...');
const r1 = await c.updateOne(
  { slug: 'neurobiology-of-trauma' },
  { $set: { testField: 'hello' } }
);
console.log('  matchedCount:', r1.matchedCount, 'modifiedCount:', r1.modifiedCount);

// Verify
const check1 = await c.findOne({ slug: 'neurobiology-of-trauma' }, { projection: { testField: 1 } });
console.log('  testField:', check1.testField);

// Test 2: Can we write to sections[0].contentBlocks?
console.log('\nTest 2: Push a test block to sections[0]...');
const r2 = await c.updateOne(
  { slug: 'neurobiology-of-trauma' },
  { $push: { 'sections.0.contentBlocks': { type: 'text', textContent: 'TEST BLOCK', order: 99 } } }
);
console.log('  matchedCount:', r2.matchedCount, 'modifiedCount:', r2.modifiedCount);

// Verify
const check2 = await c.findOne({ slug: 'neurobiology-of-trauma' }, { projection: { 'sections.0.contentBlocks': 1 } });
console.log('  blocks now:', check2.sections[0].contentBlocks.length);
const lastBlock = check2.sections[0].contentBlocks.slice(-1)[0];
console.log('  last block:', lastBlock.type, lastBlock.textContent);

// Test 3: Check document size
const full = await c.findOne({ slug: 'neurobiology-of-trauma' });
const size = JSON.stringify(full).length;
console.log('\nTest 3: Document size:', (size / 1024).toFixed(1), 'KB');

// Test 4: Try what the update script does - $set the whole object
console.log('\nTest 4: $set with findOneAndUpdate (like the real script)...');
const testSections = [
  {
    title: 'Test Section',
    order: 0,
    contentBlocks: [
      { type: 'text', textContent: '<p>This is a test with lots of words to verify the write actually works and persists.</p>', order: 0 }
    ]
  }
];
const r4 = await c.findOneAndUpdate(
  { slug: 'neurobiology-of-trauma' },
  { $set: { sections: testSections, wordCount: 999 } },
  { returnDocument: 'after' }
);
console.log('  sections after:', r4.sections?.length);
console.log('  wordCount after:', r4.wordCount);
console.log('  block text:', r4.sections?.[0]?.contentBlocks?.[0]?.textContent?.substring(0, 50));

// RESTORE - put old sections back
console.log('\nRestoring original...');
await c.findOneAndUpdate(
  { slug: 'neurobiology-of-trauma' },
  { $set: { sections: full.sections, wordCount: full.wordCount } }
);

// Cleanup test field
await c.updateOne({ slug: 'neurobiology-of-trauma' }, { $unset: { testField: 1 } });

console.log('Done.');
await mongoose.disconnect();
