// fix-mc-options.js
// Fixes multipleChoice option format: converts string-options OR char-exploded objects
// into canonical {text: String, isCorrect: Boolean} shape that Mongoose expects.
//
// Runs across ALL interactivecourses documents (not just CR-614/TMH602) because
// any seed that wrote options:[String] + correctAnswer:N will have been silently
// corrupted by Mongoose schema casting on read.
//
// Also fixes assessment.questions[].options the same way.
//
// Safe, idempotent. Uses replaceOne to bypass schema casting on write.
//
// Run: node src/scripts/fix-mc-options.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URI not found');
  process.exit(1);
}

/**
 * Reconstruct a string from Mongoose-cast char-exploded object or pass through string.
 * Example: {"0":"A","1":"n","2":"x"} -> "Anx"
 *          "Already a string"         -> "Already a string"
 *          {text:"x", isCorrect:true} -> "x"  (already canonical)
 */
function extractString(opt) {
  if (opt == null) return '';
  if (typeof opt === 'string') return opt;
  // Already canonical — pass through
  if (typeof opt.text === 'string' && opt.text.length > 0) {
    return opt.text;
  }
  // Char-exploded object: keys are "0","1","2",..."N"
  const keys = Object.keys(opt).filter(k => /^\d+$/.test(k));
  if (keys.length > 0) {
    keys.sort((a, b) => parseInt(a) - parseInt(b));
    return keys.map(k => opt[k]).join('');
  }
  // Unknown shape - try toString
  return String(opt);
}

function migrateOptions(options, correctAnswerIdx) {
  if (!Array.isArray(options)) return { options, changed: false };

  // Check if already canonical — all entries are {text,isCorrect} with non-empty text
  const allCanonical = options.every(o =>
    o && typeof o === 'object' && typeof o.text === 'string' && o.text.length > 0 && typeof o.isCorrect === 'boolean'
  );
  if (allCanonical) return { options, changed: false };

  // Convert each option to canonical shape
  const migrated = options.map((opt, idx) => ({
    text: extractString(opt),
    isCorrect: idx === correctAnswerIdx,
  }));

  return { options: migrated, changed: true };
}

async function migrate() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    const ic = mongoose.connection.collection('interactivecourses');
    const allDocs = await ic.find({}).toArray();
    console.log(`Found ${allDocs.length} courses in interactivecourses\n`);

    let coursesChanged = 0;
    let totalMcFixed = 0;
    let totalAssessmentQFixed = 0;

    for (const doc of allDocs) {
      const code = doc.courseCode || doc.slug || doc._id.toString();
      let docChanged = false;
      let mcInThisDoc = 0;
      let qInThisDoc = 0;

      // Fix multipleChoice blocks in sections
      for (const section of doc.sections || []) {
        for (const block of section.contentBlocks || []) {
          if (block.type === 'multipleChoice' || block.type === 'multiSelect') {
            const { options: newOpts, changed } = migrateOptions(
              block.options,
              typeof block.correctAnswer === 'number' ? block.correctAnswer : -1
            );
            if (changed) {
              block.options = newOpts;
              docChanged = true;
              mcInThisDoc++;
            }
          }
        }
      }

      // Fix assessment.questions[].options
      if (doc.assessment?.questions) {
        for (const q of doc.assessment.questions) {
          const { options: newOpts, changed } = migrateOptions(
            q.options,
            typeof q.correctAnswer === 'number' ? q.correctAnswer : -1
          );
          if (changed) {
            q.options = newOpts;
            docChanged = true;
            qInThisDoc++;
          }
        }
      }

      if (docChanged) {
        await ic.replaceOne({ _id: doc._id }, doc);
        console.log(`  ${code}: ${mcInThisDoc} MC block(s) + ${qInThisDoc} assessment question(s) fixed`);
        coursesChanged++;
        totalMcFixed += mcInThisDoc;
        totalAssessmentQFixed += qInThisDoc;
      }
    }

    console.log('');
    console.log('─'.repeat(50));
    console.log(`Courses modified: ${coursesChanged}/${allDocs.length}`);
    console.log(`Total MC blocks fixed: ${totalMcFixed}`);
    console.log(`Total assessment questions fixed: ${totalAssessmentQFixed}`);
    console.log('─'.repeat(50));

    // Verification on CR-614
    console.log('\nVerification (CR-614 Section 1, first multipleChoice):');
    const cr614 = await ic.findOne({ courseCode: 'CR-614' });
    if (cr614) {
      const s1 = cr614.sections?.[0];
      const mc = s1?.contentBlocks?.find(b => b.type === 'multipleChoice');
      if (mc) {
        console.log(`  question: "${mc.question?.substring(0, 60)}..."`);
        console.log(`  options[0]: ${JSON.stringify(mc.options?.[0])}`);
        console.log(`  correctAnswer: ${mc.correctAnswer}`);
      } else {
        console.log('  No multipleChoice block in Section 1');
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
