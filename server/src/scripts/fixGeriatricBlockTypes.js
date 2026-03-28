/**
 * fixGeriatricBlockTypes.js
 *
 * One-time migration for CR-610 through CR-614.
 * Converts legacy block types to valid CourseViewer types:
 *   knowledgeCheck { questions[] } → N individual multipleChoice blocks
 *   quiz { isExam, questions[] }   → document.assessment field
 *
 * Option format: string[] + correctAnswer index → [{ text, isCorrect }]
 *
 * Run: node src/scripts/fixGeriatricBlockTypes.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const SLUGS = [
  'unretiring-the-self-identity-purpose-depression-older-adults',
  'the-long-goodbye-dementia-grief-family-systems',
  'still-standing-geriatric-suicide-risk-assessment-safety-planning',
  'seasoned-and-struggling-substance-use-disorders-older-adults',
  'the-final-chapter-end-of-life-counseling-death-anxiety-meaning-making',
];

function convertOptions(options, correctAnswer) {
  return options.map((opt, i) => ({
    text: typeof opt === 'string' ? opt : opt.text,
    isCorrect: i === correctAnswer,
  }));
}

function expandBlock(block, baseOrder) {
  if (block.type === 'knowledgeCheck') {
    return (block.questions || []).map((q, i) => ({
      type: 'multipleChoice',
      order: baseOrder + i,
      question: q.question,
      options: convertOptions(q.options, q.correctAnswer),
      explanation: q.explanation || '',
    }));
  }
  // Not a legacy type — pass through unchanged
  return [block];
}

function buildAssessment(quizBlock) {
  return {
    title: quizBlock.title || 'Final Assessment',
    timeLimit: 30,
    passThreshold: (quizBlock.passingScore || 80) / 100,
    attemptsAllowed: quizBlock.maxAttempts || 3,
    shuffleQuestions: quizBlock.shuffleQuestions !== false,
    shuffleOptions: true,
    questions: (quizBlock.questions || []).map(q => ({
      question: q.question,
      type: 'multipleChoice',
      options: convertOptions(q.options, q.correctAnswer),
      explanation: q.explanation || '',
    })),
  };
}

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('interactivecourses');

  for (const slug of SLUGS) {
    const doc = await col.findOne({ slug });
    if (!doc) { console.log(`⚠️  Not found: ${slug}`); continue; }

    let examBlock = null;
    const newSections = (doc.sections || []).map(section => {
      let order = 0;
      const newBlocks = [];

      for (const block of (section.contentBlocks || [])) {
        if (block.type === 'quiz' && block.isExam) {
          examBlock = block;
          // Don't add to contentBlocks — goes to assessment field
          continue;
        }
        const expanded = expandBlock(block, order);
        for (const b of expanded) {
          b.order = order++;
          newBlocks.push(b);
        }
      }

      return { ...section, contentBlocks: newBlocks };
    });

    const update = { $set: { sections: newSections, updatedAt: new Date() } };
    if (examBlock) {
      update.$set.assessment = buildAssessment(examBlock);
    }

    await col.updateOne({ slug }, update);

    const kcFixed = doc.sections?.reduce((n, s) =>
      n + (s.contentBlocks || []).filter(b => b.type === 'knowledgeCheck').length, 0);
    const mcNew = newSections.reduce((n, s) =>
      n + (s.contentBlocks || []).filter(b => b.type === 'multipleChoice').length, 0);

    console.log(`✅ ${doc.title}`);
    console.log(`   knowledgeCheck blocks expanded: ${kcFixed} → ${mcNew} multipleChoice blocks`);
    console.log(`   assessment: ${examBlock ? `${examBlock.questions?.length}q moved to assessment field` : 'already set'}`);
  }

  await mongoose.disconnect();
  console.log('\nDone.');
}

main().catch(err => { console.error('❌', err); process.exit(1); });
