// diag-block-structure.js — compare TMH602 (rendering) vs CR-614 (not rendering)
// Run: node src/scripts/diag-block-structure.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

async function diag() {
  try {
    await mongoose.connect(MONGODB_URI);
    const ic = mongoose.connection.collection('interactivecourses');

    for (const code of ['CR-TMH602', 'CR-614']) {
      const doc = await ic.findOne({ courseCode: code });
      console.log('\n' + '='.repeat(60));
      console.log(`COURSE: ${code}`);
      console.log('='.repeat(60));
      
      if (!doc) {
        console.log('NOT FOUND');
        continue;
      }

      console.log('_id:', doc._id);
      console.log('sections:', doc.sections?.length);
      
      // Look at first multipleChoice and first flashcardDeck in first 2 sections
      for (let si = 0; si < Math.min(2, doc.sections?.length || 0); si++) {
        const section = doc.sections[si];
        console.log(`\n--- Section ${si+1}: ${section.title?.substring(0, 60)}`);
        
        const mcBlock = section.contentBlocks?.find(b => b.type === 'multipleChoice');
        if (mcBlock) {
          console.log('  First multipleChoice block:');
          console.log('    keys:', Object.keys(mcBlock).join(', '));
          console.log('    question:', mcBlock.question?.substring(0, 50));
          console.log('    options type:', Array.isArray(mcBlock.options) ? 'Array' : typeof mcBlock.options);
          console.log('    options length:', mcBlock.options?.length);
          if (mcBlock.options?.[0]) {
            console.log('    options[0] type:', typeof mcBlock.options[0]);
            console.log('    options[0] value:', JSON.stringify(mcBlock.options[0]));
          }
          console.log('    correctAnswer:', mcBlock.correctAnswer);
        }
        
        const fcBlock = section.contentBlocks?.find(b => b.type === 'flashcardDeck');
        if (fcBlock) {
          console.log('  First flashcardDeck block:');
          console.log('    keys:', Object.keys(fcBlock).join(', '));
          console.log('    cards length:', fcBlock.cards?.length, '(field: "cards")');
          console.log('    flashcards length:', fcBlock.flashcards?.length, '(field: "flashcards")');
          if (fcBlock.cards?.[0]) {
            console.log('    cards[0]:', JSON.stringify(fcBlock.cards[0]));
          }
          if (fcBlock.flashcards?.[0]) {
            console.log('    flashcards[0]:', JSON.stringify(fcBlock.flashcards[0]));
          }
        }

        const mtBlock = section.contentBlocks?.find(b => b.type === 'matching');
        if (mtBlock) {
          console.log('  First matching block:');
          console.log('    keys:', Object.keys(mtBlock).join(', '));
          console.log('    pairs length:', mtBlock.pairs?.length, '(field: "pairs")');
          console.log('    matchingPairs length:', mtBlock.matchingPairs?.length, '(field: "matchingPairs")');
          if (mtBlock.pairs?.[0]) {
            console.log('    pairs[0]:', JSON.stringify(mtBlock.pairs[0]));
          }
        }
      }
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('FAILED:', err);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
}

diag();
