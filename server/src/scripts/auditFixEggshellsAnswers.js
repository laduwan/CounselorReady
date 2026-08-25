/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('No MONGODB_URI'); process.exit(1); }

// ═══════════════════════════════════════════════════════════════════
// AUDIT + FIX — Walking on Eggshells Quiz Answers
//
// Problem: All KC and assessment answers defaulting to A (index 0).
// Root cause: isCorrect flags and/or correctAnswer stripped by
//             a bulk fix script after original seed.
//
// This script re-applies the correct isCorrect flags from the
// original seed's answer key for EVERY multipleChoice block in
// both section contentBlocks and the final assessment.
//
// Usage:
//   AUDIT ONLY:  node src/scripts/auditFixEggshellsAnswers.js
//   APPLY FIX:   node src/scripts/auditFixEggshellsAnswers.js --apply
// ═══════════════════════════════════════════════════════════════════

const DRY_RUN = !process.argv.includes('--apply');

// ── ANSWER KEY FROM SEED (seedCR402_Walking_on_Eggshells) ──
// Verified against source content. Index: 0=A, 1=B, 2=C, 3=D.

// Section KCs — keyed by section index, then KC order within that section
// Verified against parsed seed (seedCR402_Walking_on_Eggshells)
const SECTION_KC_ANSWERS = {
  // Section 0: Module 1: Understanding High-Conflict Presentations (4 KCs)
  0: [1, 2, 1, 1],
  // Section 1: Module 2: Patterns in High-Conflict Interactions (3 KCs)
  1: [1, 2, 1],
  // Section 2: Module 3: Validation That Works (4 KCs)
  2: [1, 1, 2, 1],
  // Section 3: Module 4: Boundaries with Compassion (2 KCs)
  3: [1, 2],
  // Section 4: Module 5: Managing Your Reactions (3 KCs)
  4: [1, 2, 1],
  // Section 5: Module 6: Treatment Structure and Sustainability (4 KCs)
  5: [2, 1, 1, 1],
};

// Assessment questions (25 total)
const ASSESSMENT_ANSWERS = [
  1, 2, 1, 1, 1,   // Q1-Q5
  1, 1, 1, 1, 1,   // Q6-Q10
  1, 1, 2, 1, 1,   // Q11-Q15
  1, 1, 2, 1, 1,   // Q16-Q20
  0, 1, 0, 0, 0,   // Q21-Q25
];

async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;
  const col = db.collection('interactivecourses');

  const course = await col.findOne({ slug: 'walking-on-eggshells-high-conflict-clients' });
  if (!course) {
    // Try partial match
    const alt = await col.findOne({ title: { $regex: /eggshell/i } });
    if (!alt) { console.error('❌ Course not found'); await mongoose.disconnect(); return; }
    console.log(`Found by title regex: ${alt.title}`);
    Object.assign(course || {}, alt);
  }

  const c = course;
  console.log(`\n${DRY_RUN ? '🔍 AUDIT ONLY' : '⚡ APPLYING FIXES'}`);
  console.log(`Course: ${c.title}`);
  console.log(`Slug: ${c.slug}`);
  console.log(`ID: ${c._id}\n`);

  let totalFixed = 0;
  let totalCorrect = 0;
  let totalQuestions = 0;

  // ── AUDIT + FIX SECTION KCs ──
  console.log('═══════════════════════════════════════');
  console.log('SECTION KNOWLEDGE CHECKS');
  console.log('═══════════════════════════════════════\n');

  const sections = c.sections || [];
  for (let si = 0; si < sections.length; si++) {
    const sec = sections[si];
    const blocks = sec.contentBlocks || [];
    const mcs = [];
    
    // Collect multipleChoice blocks in order
    blocks.forEach((b, bi) => {
      if (b.type === 'multipleChoice') mcs.push({ block: b, blockIdx: bi });
    });
    
    if (mcs.length === 0) continue;
    
    const answers = SECTION_KC_ANSWERS[si];
    if (!answers) {
      console.log(`  ⚠️  Section ${si} "${(sec.title||'').substring(0,40)}": ${mcs.length} KCs but NO answer key — skipping`);
      continue;
    }
    
    console.log(`  Section ${si} "${(sec.title||'').substring(0,40)}" (${mcs.length} KCs)`);
    
    mcs.forEach(({ block, blockIdx }, kcIdx) => {
      totalQuestions++;
      const expectedCorrect = answers[kcIdx];
      if (expectedCorrect === undefined) {
        console.log(`    ⚠️  KC ${kcIdx}: no answer key entry`);
        return;
      }
      
      // Current state
      const currentCorrectByIsCorrect = (block.options || []).findIndex(o => 
        typeof o === 'object' && o.isCorrect === true
      );
      const currentCorrectAnswer = block.correctAnswer;
      const currentEffective = typeof currentCorrectAnswer === 'number' 
        ? currentCorrectAnswer 
        : (currentCorrectByIsCorrect >= 0 ? currentCorrectByIsCorrect : 0);
      
      const isWrong = currentEffective !== expectedCorrect;
      const letter = idx => idx >= 0 ? String.fromCharCode(65 + idx) : '?';
      
      if (isWrong) {
        totalFixed++;
        console.log(`    ❌ KC ${kcIdx} (B${blockIdx}): was ${letter(currentEffective)} → should be ${letter(expectedCorrect)} | "${(block.question||'').substring(0,50)}..."`);
        console.log(`       isCorrect@${currentCorrectByIsCorrect} correctAnswer=${currentCorrectAnswer ?? 'undefined'}`);
      } else {
        totalCorrect++;
        console.log(`    ✅ KC ${kcIdx} (B${blockIdx}): ${letter(currentEffective)} correct`);
      }
      
      // Apply fix
      if (!DRY_RUN && block.options) {
        block.options.forEach((opt, oi) => {
          if (typeof opt === 'object') {
            opt.isCorrect = (oi === expectedCorrect);
          }
        });
        block.correctAnswer = expectedCorrect;
      }
    });
    console.log('');
  }

  // ── AUDIT + FIX ASSESSMENT ──
  console.log('═══════════════════════════════════════');
  console.log('FINAL ASSESSMENT');
  console.log('═══════════════════════════════════════\n');

  const assessQs = c.assessment?.questions || [];
  console.log(`  ${assessQs.length} questions (expected 25)\n`);

  assessQs.forEach((q, qi) => {
    totalQuestions++;
    const expectedCorrect = ASSESSMENT_ANSWERS[qi];
    if (expectedCorrect === undefined) {
      console.log(`    ⚠️  Q${qi+1}: no answer key entry`);
      return;
    }

    const currentCorrectByIsCorrect = (q.options || []).findIndex(o => 
      typeof o === 'object' && o.isCorrect === true
    );
    const currentEffective = currentCorrectByIsCorrect >= 0 ? currentCorrectByIsCorrect : 0;
    const letter = idx => idx >= 0 ? String.fromCharCode(65 + idx) : '?';
    
    const isWrong = currentEffective !== expectedCorrect;
    
    if (isWrong) {
      totalFixed++;
      console.log(`    ❌ Q${qi+1}: was ${letter(currentEffective)} → should be ${letter(expectedCorrect)} | "${(q.question||'').substring(0,50)}..."`);
    } else {
      totalCorrect++;
      console.log(`    ✅ Q${qi+1}: ${letter(currentEffective)} correct`);
    }
    
    // Apply fix
    if (!DRY_RUN && q.options) {
      q.options.forEach((opt, oi) => {
        if (typeof opt === 'object') {
          opt.isCorrect = (oi === expectedCorrect);
        }
      });
    }
  });

  // ── SUMMARY ──
  console.log('\n═══════════════════════════════════════');
  console.log('SUMMARY');
  console.log('═══════════════════════════════════════');
  console.log(`Total questions audited: ${totalQuestions}`);
  console.log(`Already correct: ${totalCorrect}`);
  console.log(`Wrong (need fix): ${totalFixed}`);
  
  if (totalFixed > 0 && !DRY_RUN) {
    // Write back using updateOne/$set — never .save()
    await col.updateOne(
      { _id: c._id },
      { $set: { sections: c.sections, assessment: c.assessment } }
    );
    
    // Read-back verify
    const verify = await col.findOne({ _id: c._id });
    let verifyOK = true;
    
    // Spot-check first KC in section 0
    const s0mcs = (verify.sections[0]?.contentBlocks || []).filter(b => b.type === 'multipleChoice');
    if (s0mcs.length > 0) {
      const ci = s0mcs[0].options?.findIndex(o => o.isCorrect === true);
      if (ci !== SECTION_KC_ANSWERS[0][0]) {
        verifyOK = false;
        console.log(`\n❌ VERIFY FAILED: Section 0 KC 0 expected ${SECTION_KC_ANSWERS[0][0]} got ${ci}`);
      }
    }
    
    // Spot-check first assessment question
    const aq0ci = verify.assessment?.questions?.[0]?.options?.findIndex(o => o.isCorrect === true);
    if (aq0ci !== ASSESSMENT_ANSWERS[0]) {
      verifyOK = false;
      console.log(`\n❌ VERIFY FAILED: Assessment Q1 expected ${ASSESSMENT_ANSWERS[0]} got ${aq0ci}`);
    }
    
    if (verifyOK) {
      console.log(`\n✅ Fixed ${totalFixed} answers and verified. Course is ready.`);
    }
  } else if (totalFixed > 0) {
    console.log(`\n👉 Run with --apply to fix: node src/scripts/auditFixEggshellsAnswers.js --apply`);
  } else {
    console.log('\n✅ All answers are already correct — no fix needed.');
  }

  await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
