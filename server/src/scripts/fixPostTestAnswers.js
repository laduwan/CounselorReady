/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('No MONGODB_URI'); process.exit(1); }

// ═══════════════════════════════════════════════════════════════════
// FIX POST-TEST ANSWERS — Walking on Eggshells
// 
// Sets correct answers + explanations for the 20 post-test questions
// extracted from the embedded quiz. Answer key from source markdown.
//
// Usage:
//   DRY RUN:  node src/scripts/fixPostTestAnswers.js
//   APPLY:    node src/scripts/fixPostTestAnswers.js --apply
// ═══════════════════════════════════════════════════════════════════

const DRY_RUN = !process.argv.includes('--apply');

// Answer key from Walking_on_Eggshells_EXPANDED.md POST-TEST ANSWER KEY
// Format: { questionNum: { correct: letterIndex (0=a,1=b,2=c,3=d), explanation: string } }
const ANSWER_KEY = {
  1:  { correct: 1, explanation: 'High-conflict is a behavioral description, not a diagnosis.' },
  2:  { correct: 2, explanation: 'Consistent insight is NOT typical; blame externalization is.' },
  3:  { correct: 2, explanation: 'Biological vulnerability combined with invalidating environments.' },
  4:  { correct: 1, explanation: 'Splitting is viewing people as all good or all bad.' },
  5:  { correct: 1, explanation: 'The therapist may feel and act consistent with projections.' },
  6:  { correct: 1, explanation: 'Testing often checks if therapist will abandon or handle intensity.' },
  7:  { correct: 1, explanation: 'Radical genuineness treats the client as capable, not fragile.' },
  8:  { correct: 1, explanation: 'Validation acknowledges emotion without necessarily agreeing.' },
  9:  { correct: 1, explanation: '"And" connects validation to behavioral guidance.' },
  10: { correct: 1, explanation: 'JADE = Justify, Argue, Defend, Explain (avoid overdoing).' },
  11: { correct: 1, explanation: 'Limit-setting maintains structure; punishment is retaliatory.' },
  12: { correct: 1, explanation: 'Dreading sessions and relief at cancellation indicates countertransference.' },
  13: { correct: 2, explanation: 'Life-threatening behaviors are the top priority.' },
  14: { correct: 1, explanation: 'Balance caseload so not every client is high-conflict.' },
  15: { correct: 1, explanation: 'High-conflict patterns typically developed as survival strategies.' },
  16: { correct: 1, explanation: 'Acknowledge underlying need while maintaining boundary.' },
  17: { correct: 1, explanation: 'Self-care is essential, not optional.' },
  18: { correct: 2, explanation: 'Consultation should be ongoing, not just crisis-driven.' },
  19: { correct: 1, explanation: 'The eggshell experience is hypervigilance and fear of triggering.' },
  20: { correct: 1, explanation: 'Referral may be appropriate care in certain circumstances.' },
};

async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;
  const collection = db.collection('interactivecourses');

  const course = await collection.findOne({ slug: 'walking-on-eggshells-high-conflict-clients' });
  if (!course) { console.error('Course not found'); await mongoose.disconnect(); return; }

  console.log(`${DRY_RUN ? '🔍 DRY RUN' : '⚡ APPLYING'} — Fix Post-Test Answers`);
  console.log(`Course: ${course.title}\n`);

  const sections = course.sections || [];
  
  // Find the Conclusion section (last content section, has the post-test)
  let fixed = 0;

  for (const section of sections) {
    if (section.title !== 'Conclusion & Final Assessment') continue;
    
    const blocks = section.contentBlocks || [];
    let postTestQNum = 0;
    
    for (const block of blocks) {
      if (block.type !== 'multipleChoice') continue;
      
      postTestQNum++;
      const ak = ANSWER_KEY[postTestQNum];
      if (!ak) continue;

      // Fix the correct answer
      if (!DRY_RUN) {
        block.options.forEach((opt, i) => {
          opt.isCorrect = (i === ak.correct);
        });
        block.explanation = ak.explanation;
      }

      const correctOpt = block.options[ak.correct]?.text?.substring(0, 50) || '?';
      console.log(`   Q${postTestQNum}: "${block.question.substring(0, 60)}..." → ${String.fromCharCode(65 + ak.correct)}) ${correctOpt}`);
      fixed++;
    }
  }

  if (fixed > 0 && !DRY_RUN) {
    await collection.updateOne(
      { _id: course._id },
      { $set: { sections: course.sections } }
    );
    console.log(`\n✅ Fixed ${fixed} post-test answers and saved.`);
  } else if (fixed > 0) {
    console.log(`\n${fixed} answers to fix. Run with --apply to save.`);
  } else {
    console.log('No post-test questions found needing review. Was extractEmbeddedQuizzes applied?');
  }

  await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
