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
const QUIZ_HEADER_RE = /(?:#{1,3}\s*)?(?:Knowledge Check|Post-?Test|Assessment|Quiz)(?:\s*:?\s*(?:Module|Section)?\s*\d*)?/i;

// Matches a numbered question like "1. What is..." or "1) What is..."
const QUESTION_START_RE = /^\s*(\d+)[.)]\s+(.+)/;

// Matches a lettered option like "a) text" or "a. text" or "A) text"
const OPTION_RE = /^\s*([a-dA-D])[.)]\s+(.+)/;

// Matches correct answer markers
const CORRECT_ANSWER_RE = /(?:Correct Answer|Answer|Correct)[:\s]*([A-Da-d])/i;

function parseQuizFromText(text) {
  // Strip HTML tags for parsing
  const plain = text.replace(/<[^>]+>/g, '\n').replace(/&nbsp;/g, ' ');
  const lines = plain.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  const quizzes = []; // Array of { headerLine, questions[], startIdx, endIdx }
  let currentQuiz = null;
  let currentQuestion = null;
  let quizStartLine = -1;
  let quizEndLine = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect quiz header
    if (QUIZ_HEADER_RE.test(line) && !QUESTION_START_RE.test(line)) {
      // Save previous quiz if exists
      if (currentQuiz && currentQuiz.questions.length > 0) {
        currentQuiz.endIdx = i - 1;
        quizzes.push(currentQuiz);
      }
      if (currentQuestion && currentQuiz) {
        currentQuiz.questions.push(currentQuestion);
      }
      currentQuiz = { header: line, questions: [], startIdx: i, endIdx: -1 };
      currentQuestion = null;
      quizStartLine = i;
      continue;
    }

    // Detect question start
    const qMatch = line.match(QUESTION_START_RE);
    if (qMatch) {
      // If we found a question but no quiz header yet, create implicit quiz
      if (!currentQuiz) {
        // Only if this looks like a real quiz (has options following)
        const nextFewLines = lines.slice(i + 1, i + 6).join('\n');
        if (OPTION_RE.test(nextFewLines)) {
          currentQuiz = { header: 'Knowledge Check', questions: [], startIdx: i, endIdx: -1 };
        } else {
          continue;
        }
      }

      // Save previous question
      if (currentQuestion) {
        currentQuiz.questions.push(currentQuestion);
      }

      currentQuestion = {
        questionNum: parseInt(qMatch[1]),
        questionText: qMatch[2],
        options: [],
        correctAnswer: -1,
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

    // Detect correct answer marker
    const aMatch = line.match(CORRECT_ANSWER_RE);
    if (aMatch && currentQuestion) {
      const correctLetter = aMatch[1].toLowerCase();
      currentQuestion.correctAnswer = correctLetter.charCodeAt(0) - 'a'.charCodeAt(0);
      currentQuestion.lineEnd = i;
      continue;
    }

    // If we're past a quiz and hit non-quiz content, close the quiz
    if (currentQuiz && currentQuestion && currentQuestion.options.length >= 2) {
      // Check if this line is explanatory text after the question
      if (line.length > 10 && !QUESTION_START_RE.test(line) && !OPTION_RE.test(line)) {
        // Could be explanation text or next content paragraph
        // If next line is also not a question/option, we've left the quiz
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
  if (currentQuestion && currentQuiz) {
    currentQuiz.questions.push(currentQuestion);
  }
  if (currentQuiz && currentQuiz.questions.length > 0) {
    currentQuiz.endIdx = lines.length - 1;
    quizzes.push(currentQuiz);
  }

  return quizzes;
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
      explanation: q.correctAnswer >= 0 ? '' : '⚠️ NEEDS REVIEW: correct answer not auto-detected',
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

          if (needsReview) courseNeedsReview += mcBlocks.length;
          courseQuizzes++;
          courseModified = true;

          console.log(`   ✅ "${sTitle}" block ${bi}: extracted "${quiz.header}" → ${mcBlocks.length} questions${needsReview ? ' ⚠️ NEEDS ANSWER REVIEW' : ''}`);
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
