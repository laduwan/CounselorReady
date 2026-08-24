/**
 * fixAnswerKeysExposed.js
 *
 * Strips embedded quiz Q&A (with visible "Correct Answer: X") from text blocks
 * in 4 published courses flagged by the ACEP compliance audit.
 *
 * Courses handled:
 *   CR-101  suicide-risk-assessment-crisis-intervention        (0 in-section KCs → parse + create)
 *   CR-102  crisis-intervention-and-suicide-prevention-...     (57 KCs → strip quiz-only text blocks)
 *   CR-302  motivational-interviewing-from-ambivalence-to-action  (23 KCs → strip)
 *   CR-TMH602  telemental-health-supervision-georgia-rule-135-11  (18 KCs → strip mixed blocks)
 *
 * Approach:
 *   - text blocks that are PURE quiz (start with a Knowledge Check header) → deleted
 *     (for CR-101: questions are also parsed into proper multipleChoice blocks first)
 *   - text blocks MIXED (prose before quiz section) → truncated at first quiz marker,
 *     prose kept, quiz section removed
 *
 * Usage:
 *   node src/scripts/fixAnswerKeysExposed.js              # dry-run (safe, no writes)
 *   node src/scripts/fixAnswerKeysExposed.js --apply      # write to DB
 *
 * Run from: ~/project/src/server (Render shell)
 */

import 'dotenv/config';
import mongoose from 'mongoose';

const APPLY = process.argv.includes('--apply');
const DRY = !APPLY;

if (!process.env.MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }

// ─────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────

/** Strip HTML tags for preview logging */
function stripHtml(html) {
  return (html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 120);
}

/** True if a text block's content contains an exposed answer key */
function hasAnswerKey(content) {
  return /Correct Answer:/i.test(content || '');
}

/**
 * Find the character index of the first "quiz section" marker in the content.
 * Returns -1 if no marker found.
 */
function findQuizStart(content) {
  // Look for any of these patterns that start a quiz section
  const patterns = [
    /<h[2-4][^>]*>\s*(?:module\s+\d+\s+)?knowledge\s+check/i,  // <h2>Module 1 Knowledge Check</h2>
    /<h[2-4][^>]*>\s*\d+\.\d+\s+knowledge\s+check/i,           // <h2>1.6 Knowledge Check — Module 1</h2>
    /<h[2-4][^>]*>\s*knowledge\s+check\s*[\d—-]/i,             // <h4>Knowledge Check 1</h4>
  ];
  let earliest = -1;
  for (const pat of patterns) {
    const m = content.match(pat);
    if (m) {
      const idx = content.indexOf(m[0]);
      if (earliest === -1 || idx < earliest) earliest = idx;
    }
  }
  return earliest;
}

/**
 * Parse embedded quiz Q&A from HTML into structured multipleChoice block data.
 * Format expected (CR-101 / CR-302):
 *   <p><strong>Question N:</strong> question text</p>
 *   <p>A) opt B) opt C) opt D) opt</p>
 *   <p><strong>Correct Answer: X</strong> <em>Rationale: explanation</em></p>
 */
function parseEmbeddedQuestions(html) {
  const questions = [];

  // Match each question triplet
  // Group 1: question text, Group 2: options line, Group 3: answer letter, Group 4: explanation
  const re = /<p><strong>Question\s+\d+:?<\/strong>\s*([\s\S]*?)<\/p>\s*<p>(A\)[\s\S]*?)<\/p>\s*<p><strong>Correct Answer:\s*([A-D])<\/strong>\s*<em>(?:Rationale:\s*)?([\s\S]*?)<\/em><\/p>/gi;

  let m;
  while ((m = re.exec(html)) !== null) {
    const questionText = m[1].replace(/<[^>]+>/g, '').trim();
    const optionsRaw   = m[2].replace(/<[^>]+>/g, '').trim();
    const correctLetter = m[3].trim().toUpperCase();
    const explanation   = m[4].replace(/<[^>]+>/g, '').trim();

    // Split "A) text B) text C) text D) text" on boundaries before option letters
    const parts = optionsRaw.split(/\s+(?=[A-D]\))/);
    const optionTexts = parts
      .filter(p => /^[A-D]\)/.test(p.trim()))
      .map(p => p.replace(/^[A-D]\)\s*/, '').trim());

    if (optionTexts.length < 2) continue; // skip if malformed

    const letters = ['A', 'B', 'C', 'D'];
    const correctIndex = letters.indexOf(correctLetter);

    questions.push({
      questionText,
      options: optionTexts.map((text, i) => ({ text, isCorrect: i === correctIndex })),
      correctAnswer: Math.max(0, correctIndex),
      explanation,
    });
  }

  return questions;
}

/**
 * Build a multipleChoice content block from a parsed question.
 * Uses the order value provided and a generated stable id.
 */
function buildMultipleChoiceBlock(q, order, sectionIdx, blockIdx, questionIdx) {
  return {
    type: 'multipleChoice',
    order,
    id: `mc-fix-${sectionIdx}-${blockIdx}-${questionIdx}`,
    question: q.questionText,
    options: q.options,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
  };
}

// ─────────────────────────────────────────────────────────
// COURSE HANDLERS
// ─────────────────────────────────────────────────────────

/**
 * Process sections for a course.
 * @param {Array}  sections  - course.sections array from DB
 * @param {boolean} parseQuiz - if true, extract embedded questions → multipleChoice blocks
 * @returns {{ updatedSections, removedBlocks, addedBlocks, truncatedBlocks }}
 */
function processSections(sections, parseQuiz) {
  let removedBlocks = 0;
  let addedBlocks = 0;
  let truncatedBlocks = 0;

  const updatedSections = sections.map((section, sIdx) => {
    const updatedBlocks = [];
    const contentBlocks = section.contentBlocks || [];

    for (let bIdx = 0; bIdx < contentBlocks.length; bIdx++) {
      const block = contentBlocks[bIdx];

      // Only process text blocks with answer keys
      if (block.type !== 'text' || !hasAnswerKey(block.content)) {
        updatedBlocks.push(block);
        continue;
      }

      const content = block.content || '';
      const quizStart = findQuizStart(content);

      if (quizStart === -1) {
        // Has "Correct Answer:" but no section header — probably just answer keys inline.
        // Safe strategy: remove paragraphs containing "Correct Answer:" only.
        const cleaned = content
          .replace(/<p[^>]*>[\s\S]*?Correct Answer:[\s\S]*?<\/p>/gi, '')
          .trim();
        if (cleaned !== content) {
          console.log(`  [TRUNCATE-INLINE] s${sIdx} b${bIdx}: stripped inline answer-key paras`);
          truncatedBlocks++;
          if (cleaned.length > 0) {
            updatedBlocks.push({ ...block, content: cleaned });
          } else {
            removedBlocks++;
          }
        } else {
          updatedBlocks.push(block);
        }
        continue;
      }

      // Prose before the quiz section
      const proseContent = content.slice(0, quizStart).trim();
      // Quiz section
      const quizContent  = content.slice(quizStart);

      if (parseQuiz) {
        // Parse quiz into proper multipleChoice blocks
        const questions = parseEmbeddedQuestions(quizContent);
        if (questions.length > 0) {
          console.log(`  [PARSE] s${sIdx} b${bIdx}: extracted ${questions.length} question(s)`);
          // Insert prose block (if any prose) then KC blocks
          const orderBase = block.order || (bIdx + 1);
          if (proseContent.length > 20) {
            updatedBlocks.push({ ...block, content: proseContent });
          } else {
            removedBlocks++;
          }
          questions.forEach((q, qIdx) => {
            const mcBlock = buildMultipleChoiceBlock(q, orderBase + 0.1 + qIdx * 0.01, sIdx, bIdx, qIdx);
            updatedBlocks.push(mcBlock);
            addedBlocks++;
          });
        } else {
          // Couldn't parse — just strip the quiz section
          console.warn(`  [WARN] s${sIdx} b${bIdx}: no questions parsed — stripping quiz section`);
          if (proseContent.length > 20) {
            updatedBlocks.push({ ...block, content: proseContent });
            truncatedBlocks++;
          } else {
            removedBlocks++;
          }
        }
      } else {
        // Course already has proper KCs — just strip the quiz section
        if (proseContent.length > 20) {
          console.log(`  [TRUNCATE] s${sIdx} b${bIdx}: kept ${proseContent.length} chars of prose, stripped quiz section`);
          updatedBlocks.push({ ...block, content: proseContent });
          truncatedBlocks++;
        } else {
          console.log(`  [DELETE] s${sIdx} b${bIdx}: pure quiz block (${stripHtml(content)}...)`);
          removedBlocks++;
        }
      }
    }

    // Re-number orders sequentially (preserve original relative order)
    updatedBlocks
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .forEach((b, i) => { b.order = i + 1; });

    return { ...section, contentBlocks: updatedBlocks };
  });

  return { updatedSections, removedBlocks, addedBlocks, truncatedBlocks };
}

// ─────────────────────────────────────────────────────────
// TARGET COURSES
// ─────────────────────────────────────────────────────────

const TARGETS = [
  {
    slug: 'suicide-risk-assessment-crisis-intervention',
    label: 'CR-101 Suicide Risk Assessment',
    parseQuiz: true,    // 0 in-section KCs → extract embedded questions
  },
  {
    slug: 'crisis-intervention-and-suicide-prevention-a-comprehensive-clinical-guide',
    label: 'CR-102 Crisis Intervention',
    parseQuiz: false,   // 57 proper KCs → strip quiz text only
  },
  {
    slug: 'motivational-interviewing-from-ambivalence-to-action',
    label: 'CR-302 Motivational Interviewing',
    parseQuiz: false,   // 23 proper KCs → strip
  },
  {
    slug: 'motivational-interviewing-ambivalence-to-action',
    label: 'CR-302 MI (alt slug)',
    parseQuiz: false,
  },
  {
    slug: 'telemental-health-supervision-georgia-rule-135-11',
    label: 'CR-TMH602 TeleMental Health Supervision',
    parseQuiz: false,   // 18 proper KCs → strip mixed blocks
  },
];

// ─────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('interactivecourses');

  console.log(`\n${'═'.repeat(70)}`);
  console.log(`fixAnswerKeysExposed — ${DRY ? 'DRY RUN (no writes)' : '⚠️  APPLYING WRITES'}`);
  console.log('═'.repeat(70) + '\n');

  let totalRemoved = 0;
  let totalAdded = 0;
  let totalTruncated = 0;

  for (const target of TARGETS) {
    const course = await col.findOne({ slug: target.slug });
    if (!course) {
      console.log(`⚠️  NOT FOUND: ${target.label} (slug: ${target.slug})`);
      continue;
    }

    // Quick check: does this course actually have exposed answer keys?
    const allBlocks = (course.sections || []).flatMap(s => s.contentBlocks || []);
    const affectedBlocks = allBlocks.filter(b => b.type === 'text' && hasAnswerKey(b.content));

    if (affectedBlocks.length === 0) {
      console.log(`✅ CLEAN: ${target.label} — no exposed answer keys found`);
      continue;
    }

    console.log(`\n📋 ${target.label}`);
    console.log(`   Sections: ${(course.sections || []).length} | Affected text blocks: ${affectedBlocks.length}`);

    const { updatedSections, removedBlocks, addedBlocks, truncatedBlocks } =
      processSections(course.sections || [], target.parseQuiz);

    totalRemoved += removedBlocks;
    totalAdded += addedBlocks;
    totalTruncated += truncatedBlocks;

    console.log(`   → Removed: ${removedBlocks} | Added KC blocks: ${addedBlocks} | Truncated: ${truncatedBlocks}`);

    // Verify no answer keys remain
    const remaining = updatedSections
      .flatMap(s => s.contentBlocks || [])
      .filter(b => b.type === 'text' && hasAnswerKey(b.content));
    if (remaining.length > 0) {
      console.warn(`   ⚠️  ${remaining.length} block(s) still contain "Correct Answer:" — manual review needed`);
      remaining.forEach(b => console.warn(`      → ${stripHtml(b.content)}...`));
    } else {
      console.log(`   ✅ Verification: 0 remaining answer-key blocks`);
    }

    if (!DRY) {
      const result = await col.updateOne(
        { _id: course._id },
        { $set: { sections: updatedSections, updatedAt: new Date() } }
      );
      if (result.modifiedCount === 1) {
        console.log(`   ✅ WRITTEN to DB`);
      } else {
        console.error(`   ❌ Write failed (modifiedCount=${result.modifiedCount})`);
      }

      // Read-back verify
      const readBack = await col.findOne({ _id: course._id }, { projection: { sections: 1 } });
      const rbBlocks = (readBack.sections || []).flatMap(s => s.contentBlocks || []);
      const rbExposed = rbBlocks.filter(b => b.type === 'text' && hasAnswerKey(b.content));
      console.log(`   ✅ Read-back: ${rbBlocks.length} blocks, ${rbExposed.length} exposed answer-key blocks remaining`);
    }
  }

  console.log('\n' + '═'.repeat(70));
  console.log('TOTALS');
  console.log(`  Blocks removed:   ${totalRemoved}`);
  console.log(`  KC blocks added:  ${totalAdded}`);
  console.log(`  Blocks truncated: ${totalTruncated}`);
  if (DRY) console.log('\n  → Re-run with --apply to write changes to DB');
  console.log('═'.repeat(70) + '\n');

  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
