/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('No MONGODB_URI'); process.exit(1); }

// ═══════════════════════════════════════════════════════════════════
// EXTRACT EMBEDDED QUIZZES FROM TEXT BLOCKS
//
// The import pipeline flattened knowledge checks and quiz questions
// into plain text inside text blocks. This script:
//   1. Finds text blocks containing quiz patterns
//   2. Extracts questions + options into multipleChoice blocks
//   3. Strips the quiz text from the original text block
//   4. Inserts new multipleChoice blocks after the text block
//
// Usage:
//   DRY RUN:  node src/scripts/extractEmbeddedQuizzes.js
//   APPLY:    node src/scripts/extractEmbeddedQuizzes.js --apply
//   ONE:      node src/scripts/extractEmbeddedQuizzes.js --slug=walking-on-eggshells-high-conflict-clients
//
// NOTE: Correct answers may need manual review. The script tries to
// detect marked answers but defaults to flagging when uncertain.
// ═══════════════════════════════════════════════════════════════════

const DRY_RUN = !process.argv.includes('--apply');
const SLUG_FILTER = process.argv.find(a => a.startsWith('--slug='))?.split('=')[1];

// ── QUIZ DETECTION ──
// Matches "Knowledge Check" headers followed by numbered questions with lettered options
const QUIZ_HEADER_RE = /^(?:#{1,3}\s*)?(?:Knowledge Check|Post-?Test(?:\s+Questions)?|Final Assessment|Quiz)(?:\s*:?\s*(?:Module|Section)?\s*\d*)?$/i;

// Matches a numbered question like "1. What is..." or "1) What is..."
const QUESTION_START_RE = /^\s*(\d+)[.)]\s+(.+)/;

// Matches a lettered option like "a) text" or "a. text" or "A) text"
const OPTION_RE = /^\s*([a-dA-D])[.)]\s+(.+)/;

// Matches correct answer markers
const CORRECT_ANSWER_RE = /(?:Correct Answer|Answer|Correct)[:\s]*([A-Da-d])/i;

// Matches answer key entries: "1. **B** - explanation" OR "1. B - explanation" (after HTML strip)
const ANSWER_KEY_ENTRY_RE = /^\s*(\d+)[.)]\s*(?:\*\*)?([A-Da-d])(?:\*\*)?\s*[-–—]\s*(.*)/i;

function parseQuizFromText(text) {
  // Strip HTML tags for parsing
  const plain = text.replace(/<[^>]+>/g, '\n').replace(/&nbsp;/g, ' ');
  const lines = plain.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  // First pass: extract answer keys
  const answerKeys = {}; // { questionNum: correctLetterIndex }
  let inAnswerKey = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/(?:POST-?TEST\s+)?ANSWER KEY/i.test(line)) {
      inAnswerKey = true;
      continue;
    }
    if (inAnswerKey) {
      const akMatch = line.match(ANSWER_KEY_ENTRY_RE);
      if (akMatch) {
        const qNum = parseInt(akMatch[1]);
        const letter = akMatch[2].toLowerCase();
        const explanation = akMatch[3].trim();
        answerKeys[qNum] = {
          correctIndex: letter.charCodeAt(0) - 'a'.charCodeAt(0),
          explanation,
        };
      } else if (line.length > 5 && !ANSWER_KEY_ENTRY_RE.test(line) && !/^\d/.test(line)) {
        // Left the answer key section
        inAnswerKey = false;
      }
    }
  }

  // Second pass: extract quizzes
  const quizzes = [];
  let currentQuiz = null;
  let currentQuestion = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip answer key sections entirely
    if (/(?:POST-?TEST\s+)?ANSWER KEY/i.test(line)) {
      // Save current quiz
      if (currentQuestion && currentQuiz) currentQuiz.questions.push(currentQuestion);
      if (currentQuiz && currentQuiz.questions.length > 0) quizzes.push(currentQuiz);
      currentQuiz = null;
      currentQuestion = null;
      // Skip until we leave the answer key
      while (i < lines.length - 1) {
        i++;
        if (!ANSWER_KEY_ENTRY_RE.test(lines[i]) && lines[i].length > 5 && !/^\d/.test(lines[i])) break;
      }
      continue;
    }

    // Detect quiz header — must be a standalone line matching exactly
    if (QUIZ_HEADER_RE.test(line)) {
      if (currentQuestion && currentQuiz) currentQuiz.questions.push(currentQuestion);
      if (currentQuiz && currentQuiz.questions.length > 0) quizzes.push(currentQuiz);
      currentQuiz = { header: line.replace(/^#+\s*/, ''), questions: [], startIdx: i, endIdx: -1 };
      currentQuestion = null;
      continue;
    }

    // Detect question start
    const qMatch = line.match(QUESTION_START_RE);
    if (qMatch) {
      // Verify this is actually a quiz question by checking for options ahead
      if (!currentQuiz) {
        const nextLines = lines.slice(i + 1, i + 8).join('\n');
        if (OPTION_RE.test(nextLines)) {
          currentQuiz = { header: 'Knowledge Check', questions: [], startIdx: i, endIdx: -1 };
        } else {
          continue; // Not a quiz, just a numbered list
        }
      }

      if (currentQuestion) currentQuiz.questions.push(currentQuestion);

      currentQuestion = {
        questionNum: parseInt(qMatch[1]),
        questionText: qMatch[2],
        options: [],
        correctAnswer: -1,
        explanation: '',
        lineStart: i,
        lineEnd: i,
      };
      continue;
    }

    // Detect option
    const oMatch = line.match(OPTION_RE);
    if (oMatch && currentQuestion) {
      const optLetter = oMatch[1].toLowerCase();
      const optIdx = optLetter.charCodeAt(0) - 'a'.charCodeAt(0);
      currentQuestion.options.push({
        letter: optLetter,
        index: optIdx,
        text: oMatch[2],
      });
      currentQuestion.lineEnd = i;
      continue;
    }

    // Detect correct answer marker inline
    const aMatch = line.match(CORRECT_ANSWER_RE);
    if (aMatch && currentQuestion) {
      const correctLetter = aMatch[1].toLowerCase();
      currentQuestion.correctAnswer = correctLetter.charCodeAt(0) - 'a'.charCodeAt(0);
      currentQuestion.lineEnd = i;
      continue;
    }

    // If we have a complete question (4 options) and hit non-quiz content
    if (currentQuiz && currentQuestion && currentQuestion.options.length >= 2) {
      if (line.length > 10 && !QUESTION_START_RE.test(line) && !OPTION_RE.test(line)) {
        const nextLine = lines[i + 1] || '';
        if (!QUESTION_START_RE.test(nextLine) && !OPTION_RE.test(nextLine) && !CORRECT_ANSWER_RE.test(nextLine)) {
          currentQuiz.questions.push(currentQuestion);
          currentQuiz.endIdx = currentQuestion.lineEnd;
          quizzes.push(currentQuiz);
          currentQuiz = null;
          currentQuestion = null;
        }
      }
    }
  }

  // Save last quiz
  if (currentQuestion && currentQuiz) currentQuiz.questions.push(currentQuestion);
  if (currentQuiz && currentQuiz.questions.length > 0) quizzes.push(currentQuiz);

  // Apply answer keys to questions
  // Answer keys correspond to post-test questions (numbered 1-20)
  const hasAnswerKeys = Object.keys(answerKeys).length > 0;
  if (hasAnswerKeys) {
    // Find the post-test quiz
    for (const quiz of quizzes) {
      if (/post-?test/i.test(quiz.header)) {
        for (const q of quiz.questions) {
          const ak = answerKeys[q.questionNum];
          if (ak) {
            q.correctAnswer = ak.correctIndex;
            q.explanation = ak.explanation;
          }
        }
      }
    }
  }

  // Filter out quizzes with 0 valid questions
  return quizzes.filter(q => q.questions.length > 0 && q.questions.some(qq => qq.options.length >= 2));
}

// Build text patterns to strip from the original content
function buildStripPatterns(quiz, originalText) {
  const patterns = [];
  const isHtml = /<[a-z][\s\S]*?>/i.test(originalText);

  // Strip quiz header
  const headerEsc = quiz.header.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (isHtml) {
    patterns.push(new RegExp(`<(?:h[23]|p|strong)[^>]*>[^<]*${headerEsc}[^<]*</(?:h[23]|p|strong)>`, 'gi'));
    patterns.push(new RegExp(`<strong>${headerEsc}</strong>`, 'gi'));
  }
  patterns.push(new RegExp(`^.*${headerEsc}.*$`, 'gim'));

  // Strip each question + its options
  for (const q of quiz.questions) {
    // Strip "N. question text"
    const qEsc = q.questionText.substring(0, 40).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    patterns.push(new RegExp(`^\\s*${q.questionNum}[.)\\s]+${qEsc}.*$`, 'gim'));
    if (isHtml) {
      patterns.push(new RegExp(`<p[^>]*>\\s*${q.questionNum}[.)\\s]+${qEsc}[^<]*</p>`, 'gi'));
    }

    // Strip each option
    for (const opt of q.options) {
      const optEsc = opt.text.substring(0, 30).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      patterns.push(new RegExp(`^\\s*${opt.letter}[.)\\s]+${optEsc}.*$`, 'gim'));
      if (isHtml) {
        patterns.push(new RegExp(`<p[^>]*>\\s*${opt.letter}[.)\\s]+${optEsc}[^<]*</p>`, 'gi'));
      }
    }

    // Strip "Correct Answer: X" if present
    patterns.push(new RegExp(`^.*Correct Answer[:\\s]*[A-Da-d].*$`, 'gim'));
  }

  return patterns;
}

// Also strip answer key sections entirely
function buildAnswerKeyStripPatterns(originalText) {
  const patterns = [];
  const isHtml = /<[a-z][\s\S]*?>/i.test(originalText);

  // "POST-TEST ANSWER KEY" header
  patterns.push(/^.*(?:POST-?TEST\s+)?ANSWER KEY.*$/gim);
  if (isHtml) {
    patterns.push(/<(?:h[123]|p|strong)[^>]*>[^<]*(?:POST-?TEST\s+)?ANSWER KEY[^<]*<\/(?:h[123]|p|strong)>/gi);
  }

  // Answer key entries: "1. **B** - explanation"
  patterns.push(/^\s*\d+[.)]\s*\*\*[A-Da-d]\*\*\s*[-–—].+$/gim);
  if (isHtml) {
    patterns.push(/<p[^>]*>\s*\d+[.)]\s*(?:<strong>)?[A-Da-d](?:<\/strong>)?\s*[-–—][^<]*<\/p>/gi);
  }

  return patterns;
}

// Convert extracted quiz to multipleChoice content blocks
function quizToBlocks(quiz) {
  const blocks = [];
  let needsReview = false;

  for (const q of quiz.questions) {
    if (q.options.length < 2) continue; // Skip malformed

    const options = q.options.map(opt => ({
      text: opt.text,
      isCorrect: opt.index === q.correctAnswer,
    }));

    // If no correct answer was detected, flag it
    if (q.correctAnswer === -1) {
      needsReview = true;
      // Default: mark first option as correct (will need manual fix)
      if (options.length > 0) options[0].isCorrect = true;
    }

    blocks.push({
      type: 'multipleChoice',
      question: q.questionText,
      options,
      explanation: q.explanation || (q.correctAnswer === -1 ? '⚠️ NEEDS REVIEW: correct answer not auto-detected' : ''),
      order: 0, // Will be set during insertion
    });
  }

  return { blocks, needsReview };
}

async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;
  const collection = db.collection('interactivecourses');

  const query = SLUG_FILTER ? { slug: SLUG_FILTER } : {};
  const courses = await collection.find(query).toArray();

  console.log('='.repeat(100));
  console.log(`EXTRACT EMBEDDED QUIZZES — ${DRY_RUN ? '🔍 DRY RUN' : '⚡ APPLYING'}`);
  console.log(`Date: ${new Date().toISOString().split('T')[0]} | Courses: ${courses.length}`);
  if (DRY_RUN) console.log('Run with --apply to execute');
  console.log('='.repeat(100) + '\n');

  let totalCourses = 0;
  let totalQuizzes = 0;
  let totalQuestions = 0;
  let totalNeedsReview = 0;

  for (const course of courses) {
    const sections = course.sections || [];
    let courseModified = false;
    let courseQuizzes = 0;
    let courseQuestions = 0;
    let courseNeedsReview = 0;

    for (let si = 0; si < sections.length; si++) {
      const section = sections[si];
      const blocks = section.contentBlocks || [];
      const sTitle = section.title || `Section ${si + 1}`;
      const newBlocks = []; // Rebuilt block array

      for (let bi = 0; bi < blocks.length; bi++) {
        const block = blocks[bi];

        if (block.type !== 'text') {
          newBlocks.push(block);
          continue;
        }

        const rawContent = block.content || block.textContent || '';
        const quizzes = parseQuizFromText(rawContent);

        if (quizzes.length === 0 || quizzes.every(q => q.questions.length === 0)) {
          newBlocks.push(block);
          continue;
        }

        // Strip quiz text from the text block
        let cleanedContent = rawContent;
        let cleanedTextContent = block.textContent || rawContent;

        for (const quiz of quizzes) {
          const patterns = buildStripPatterns(quiz, rawContent);
          for (const pat of patterns) {
            cleanedContent = cleanedContent.replace(pat, '');
            cleanedTextContent = cleanedTextContent.replace(pat, '');
          }
        }

        // Also strip answer key sections
        const akPatterns = buildAnswerKeyStripPatterns(rawContent);
        for (const pat of akPatterns) {
          cleanedContent = cleanedContent.replace(pat, '');
          cleanedTextContent = cleanedTextContent.replace(pat, '');
        }

        // Clean up whitespace
        cleanedContent = cleanedContent.replace(/\n{3,}/g, '\n\n').replace(/(<br\s*\/?>\s*){3,}/gi, '<br><br>').trim();
        cleanedTextContent = cleanedTextContent.replace(/\n{3,}/g, '\n\n').trim();

        const origWords = rawContent.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(w => w).length;
        const cleanWords = cleanedContent.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(w => w).length;

        // Keep the text block (now without quiz text)
        if (cleanedContent.replace(/<[^>]+>/g, '').trim().length > 20) {
          if (!DRY_RUN) {
            block.content = cleanedContent;
            block.textContent = cleanedTextContent;
          }
          newBlocks.push(block);
        }

        // Add extracted multipleChoice blocks
        for (const quiz of quizzes) {
          const { blocks: mcBlocks, needsReview } = quizToBlocks(quiz);

          for (const mcBlock of mcBlocks) {
            mcBlock.order = newBlocks.length;
            newBlocks.push(mcBlock);
            courseQuestions++;
          }

          if (needsReview) courseNeedsReview += mcBlocks.filter(b => b.explanation.includes('NEEDS REVIEW')).length;
          courseQuizzes++;
          courseModified = true;

          const answeredCount = mcBlocks.filter(b => !b.explanation.includes('NEEDS REVIEW')).length;
          const reviewCount = mcBlocks.filter(b => b.explanation.includes('NEEDS REVIEW')).length;
          const statusMsg = reviewCount > 0 
            ? `⚠️ ${reviewCount} need answer review` 
            : `✓ all answers from answer key`;

          console.log(`   ✅ "${sTitle}" block ${bi}: extracted "${quiz.header}" → ${mcBlocks.length} questions (${statusMsg})`);
        }

        console.log(`      Text block: ${origWords} → ${cleanWords} words (-${origWords - cleanWords} quiz words removed)`);
      }

      // Replace blocks array
      if (courseModified && !DRY_RUN) {
        section.contentBlocks = newBlocks;
      }
    }

    if (courseModified) {
      totalCourses++;
      totalQuizzes += courseQuizzes;
      totalQuestions += courseQuestions;
      totalNeedsReview += courseNeedsReview;

      console.log(`\n🔧 ${course.title}`);
      console.log(`   Slug: ${course.slug}`);
      console.log(`   Quizzes extracted: ${courseQuizzes} | Questions: ${courseQuestions}${courseNeedsReview > 0 ? ` | ⚠️ ${courseNeedsReview} need answer review` : ''}`);

      if (!DRY_RUN) {
        await collection.updateOne(
          { _id: course._id },
          { $set: { sections: course.sections } }
        );
        console.log(`   💾 Saved`);
      }
      console.log('');
    }
  }

  console.log('='.repeat(100));
  console.log('SUMMARY');
  console.log('='.repeat(100));
  console.log(`Courses with embedded quizzes: ${totalCourses}`);
  console.log(`Quiz sections extracted: ${totalQuizzes}`);
  console.log(`Total questions created: ${totalQuestions}`);
  if (totalNeedsReview > 0) {
    console.log(`⚠️  Questions needing answer review: ${totalNeedsReview}`);
    console.log(`   These have explanation: "⚠️ NEEDS REVIEW: correct answer not auto-detected"`);
    console.log(`   Fix in admin or with a targeted script after reviewing`);
  }
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'APPLIED'}`);

  if (DRY_RUN && totalQuestions > 0) {
    console.log(`\n👉 Test one: node src/scripts/extractEmbeddedQuizzes.js --slug=walking-on-eggshells-high-conflict-clients`);
    console.log(`👉 Apply all: node src/scripts/extractEmbeddedQuizzes.js --apply`);
  }

  await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
