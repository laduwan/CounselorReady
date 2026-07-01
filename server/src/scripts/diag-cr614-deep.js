// diag-cr614-deep.js — inspect exactly what's in CR-614 now vs what should be
// Run: node src/scripts/diag-cr614-deep.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

async function diag() {
  try {
    await mongoose.connect(MONGODB_URI);
    const ic = mongoose.connection.collection('interactivecourses');
    const doc = await ic.findOne({ courseCode: 'CR-614' });

    if (!doc) {
      console.log('CR-614 not found!');
      process.exit(1);
    }

    console.log('CR-614 top-level:');
    console.log('  _id:', doc._id);
    console.log('  title:', doc.title);
    console.log('  sections length:', doc.sections?.length);
    console.log('');

    // Look at first section
    const s1 = doc.sections?.[0];
    if (!s1) {
      console.log('NO SECTIONS FOUND');
      process.exit(1);
    }
    console.log('Section 1:');
    console.log('  title:', s1.title);
    console.log('  contentBlocks length:', s1.contentBlocks?.length);
    console.log('');

    // Look at each content block's schema
    if (s1.contentBlocks) {
      console.log('Section 1 content blocks:');
      s1.contentBlocks.forEach((b, i) => {
        console.log(`  Block ${i}: type="${b.type}"`);
        console.log(`    keys: ${Object.keys(b).join(', ')}`);
        // For multipleChoice, check if options array is real
        if (b.type === 'multipleChoice') {
          console.log(`    options:`, b.options);
          console.log(`    options[0]:`, b.options?.[0]);
          console.log(`    options type:`, typeof b.options, Array.isArray(b.options));
          console.log(`    correctAnswer:`, b.correctAnswer);
        }
        // For flashcardDeck, check cards
        if (b.type === 'flashcardDeck') {
          console.log(`    cards:`, b.cards);
          console.log(`    cards length:`, b.cards?.length);
          if (b.cards?.[0]) {
            console.log(`    card[0]:`, b.cards[0]);
          }
        }
      });
    }

    // Check section 6 (the "Section 6 in progress" from the screenshot)
    console.log('\n\nSection 6:');
    const s6 = doc.sections?.[5];
    if (s6) {
      console.log('  title:', s6.title);
      console.log('  contentBlocks length:', s6.contentBlocks?.length);
      s6.contentBlocks?.forEach((b, i) => {
        console.log(`  Block ${i}: type="${b.type}"`);
        if (b.type === 'multipleChoice') {
          console.log(`    question: "${b.question?.substring(0, 60)}..."`);
          console.log(`    options count: ${b.options?.length}`);
          console.log(`    options[0]: "${b.options?.[0]}"`);
        }
        if (b.type === 'flashcardDeck') {
          console.log(`    cards count: ${b.cards?.length}`);
        }
      });
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
