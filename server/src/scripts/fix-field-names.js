// fix-field-names.js
// Renames non-canonical block field names to match the viewer's expectations.
// Safe, idempotent, can be run multiple times.
//
// Changes applied to every contentBlock in interactivecourses:
//   flashcardDeck:  cards   -> flashcards
//   matching:       pairs[{left,right}] -> matchingPairs[{term,definition}]
//   matching:       instructions -> matchingInstructions
//   scenarioTree:   scenario.{prompt,choices} -> scenarioTitle + nodes{} + startNode
//   cardSort:       items[{text,category}] -> cards[{id,text,correctCategory}]
//
// Run: node src/scripts/fix-field-names.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URI not found');
  process.exit(1);
}

// Targets — courses known to have non-canonical field names
const TARGET_COURSE_CODES = ['CR-TMH602', 'CR-614'];

function migrateBlock(block) {
  let changed = false;
  const changes = [];

  // ── flashcardDeck: cards -> flashcards ──
  if (block.type === 'flashcardDeck' && block.cards && !block.flashcards) {
    block.flashcards = block.cards.map((c, i) => ({
      id: c.id || `card-${i}`,
      front: c.front,
      back: c.back,
    }));
    delete block.cards;
    changed = true;
    changes.push('flashcardDeck: cards→flashcards');
  }

  // ── matching: pairs[{left,right}] -> matchingPairs[{term,definition}] ──
  if (block.type === 'matching') {
    if (block.pairs && !block.matchingPairs) {
      block.matchingPairs = block.pairs.map(p => ({
        term: p.term || p.left,
        definition: p.definition || p.right,
      }));
      delete block.pairs;
      changed = true;
      changes.push('matching: pairs→matchingPairs');
    }
    if (block.instructions && !block.matchingInstructions) {
      block.matchingInstructions = block.instructions;
      delete block.instructions;
      changed = true;
      changes.push('matching: instructions→matchingInstructions');
    }
  }

  // ── scenarioTree: scenario{prompt,choices} -> scenarioTitle+nodes{}+startNode ──
  if (block.type === 'scenarioTree' && block.scenario && !block.nodes) {
    const nodes = {};
    nodes.start = {
      text: block.scenario.prompt || '',
      options: (block.scenario.choices || []).map((c, i) => ({
        text: c.text,
        next: `outcome_${i}`,
      })),
    };
    (block.scenario.choices || []).forEach((c, i) => {
      nodes[`outcome_${i}`] = {
        text: c.feedback || '',
        feedback: {
          message: c.feedback || '',
          type: c.correct ? 'positive' : 'negative',
        },
      };
    });
    block.nodes = nodes;
    block.startNode = 'start';
    if (block.title && !block.scenarioTitle) {
      block.scenarioTitle = block.title;
    }
    if (block.description && !block.instructions) {
      block.instructions = block.description;
    }
    delete block.scenario;
    changed = true;
    changes.push('scenarioTree: scenario→nodes+startNode+scenarioTitle');
  }

  // ── cardSort: items[{text,category}] -> cards[{id,text,correctCategory}] ──
  if (block.type === 'cardSort' && block.items && !block.cards) {
    block.cards = block.items.map((item, i) => ({
      id: `card-${i}`,
      text: item.text,
      correctCategory: item.category,
    }));
    delete block.items;
    changed = true;
    changes.push('cardSort: items→cards');
  }

  return { changed, changes };
}

async function migrate() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    const ic = mongoose.connection.collection('interactivecourses');

    let totalChanged = 0;
    const changeLog = {};

    for (const code of TARGET_COURSE_CODES) {
      const doc = await ic.findOne({ courseCode: code });
      if (!doc) {
        console.log(`⚠  ${code}: not found, skipping`);
        continue;
      }

      console.log(`Processing ${code}...`);
      let blocksChanged = 0;
      const courseChanges = {};

      for (const section of doc.sections || []) {
        for (const block of section.contentBlocks || []) {
          const { changed, changes } = migrateBlock(block);
          if (changed) {
            blocksChanged++;
            for (const c of changes) {
              courseChanges[c] = (courseChanges[c] || 0) + 1;
            }
          }
        }
      }

      if (blocksChanged === 0) {
        console.log(`  ✓ Already canonical — no changes needed\n`);
        continue;
      }

      // Also check top-level assessment - no migrations needed there
      // (multipleChoice-style questions inside assessment.questions use options+correctAnswer)

      // Save the modified doc via replaceOne (bypasses Mongoose schema casting)
      await ic.replaceOne({ _id: doc._id }, doc);
      console.log(`  ✓ Migrated ${blocksChanged} block(s):`);
      for (const [change, count] of Object.entries(courseChanges)) {
        console.log(`      ${count}x  ${change}`);
      }
      console.log('');

      totalChanged += blocksChanged;
      changeLog[code] = courseChanges;
    }

    console.log('─'.repeat(50));
    console.log(`TOTAL blocks migrated: ${totalChanged}`);
    console.log('─'.repeat(50));

    // Verification: re-query and confirm canonical fields present
    console.log('\nVerification pass:');
    for (const code of TARGET_COURSE_CODES) {
      const doc = await ic.findOne({ courseCode: code });
      if (!doc) continue;
      const firstFlashcard = doc.sections?.flatMap(s => s.contentBlocks || []).find(b => b.type === 'flashcardDeck');
      const firstMatching = doc.sections?.flatMap(s => s.contentBlocks || []).find(b => b.type === 'matching');
      console.log(`\n  ${code}:`);
      if (firstFlashcard) {
        console.log(`    flashcardDeck has 'flashcards' field: ${!!firstFlashcard.flashcards} (${firstFlashcard.flashcards?.length || 0} items)`);
        console.log(`    flashcardDeck has 'cards' field (should be false): ${!!firstFlashcard.cards}`);
      }
      if (firstMatching) {
        console.log(`    matching has 'matchingPairs' field: ${!!firstMatching.matchingPairs} (${firstMatching.matchingPairs?.length || 0} items)`);
        console.log(`    matching has 'pairs' field (should be false): ${!!firstMatching.pairs}`);
      }
    }

    await mongoose.disconnect();
    console.log('\n✓ Disconnected cleanly');
    process.exit(0);
  } catch (err) {
    console.error('✗ MIGRATION FAILED:', err);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
}

migrate();
