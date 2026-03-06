/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// migrateTextQuizToInteractive.js
//
// Scans interactivecourses for text blocks containing quiz patterns
// (Knowledge Checks, Decision Points, Post-Tests stored as plain HTML text)
// and converts them to proper multipleChoice content blocks.
//
// Handles 5 quiz formats found across all course markdown sources:
//   1. "Question N:" + uppercase A) B) C) D) + <details> answer key
//   2. "Question N." + lowercase a) b) c) d) + inline "Correct Answer: x)"
//   3. Numbered N. + lowercase a) b) c) d) (no answer key)
//   4. Bold "**N.**" + lowercase a) b) c) d) + separate POST-TEST ANSWER KEY
//   5. Decision Points: "Option A:" through "Option D:" + <details> optimal response
//
// Run: node src/scripts/migrateTextQuizToInteractive.js --dry-run
//      node src/scripts/migrateTextQuizToInteractive.js
// ================================================================

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const DRY_RUN = process.argv.includes('--dry-run');

function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\u00e2\u20ac\u201c/g, '—')  // UTF-8 mojibake for em-dash
    .trim();
}

// ============================================================
// DETECTION: Does a text block contain quiz content?
// ============================================================

function containsQuizContent(content) {
  if (!content) return false;
  const text = stripHtml(content);

  // Format 1: "Question N:" + uppercase A) B) C) D)
  if (/Question\s+\d+[\s.:]/i.test(text) && /[A-D]\)/m.test(text)) return true;

  // Format 2/3/4: Numbered questions + lowercase a) b) c) d)
  if (/\d+\.\s+\S/.test(text) && /[a-d]\)\s+\S/m.test(text)) return true;

  // Format 6: Numbered questions + uppercase "- A)" through "- D)" with ✓ checkmarks
  if (/\d+\.\s+\S/.test(text) && /[A-D]\)/m.test(text) && /✓/.test(text)) return true;

  // Format 5: Decision point with Option A:/B:/C:/D:
  if (/Option\s+[A-D]\s*:/i.test(text) && (text.match(/Option\s+[A-D]\s*:/gi) || []).length >= 2) return true;

  // POST-TEST QUESTIONS section
  if (/POST-TEST\s+QUESTIONS/i.test(text) && /[a-d]\)\s+\S/m.test(text)) return true;

  return false;
}

// ============================================================
// FORMAT 1: "Question N:" + uppercase A)-D) + <details> answer key
// Used by: 28 Days Later, Crisis Intervention, Motivational Interviewing
// ============================================================

function parseFormat1(htmlContent) {
  const text = stripHtml(htmlContent);
  if (!/Question\s+\d+\s*:/i.test(text) || !/[A-D]\)/m.test(text)) return null;

  // Extract answer key from <details> section
  const answerMap = {};
  const detailsMatch = htmlContent.match(/<details[\s\S]*?<\/details>/i);
  if (detailsMatch) {
    const detailsText = stripHtml(detailsMatch[0]);
    const answerRegex = /(\d+)\.\s*([A-D])\)\s*([^—–\-\n]+?)\s*(?:—|–|-)\s*([\s\S]*?)(?=\n\s*\d+\.\s*[A-D]\)|$)/g;
    let am;
    while ((am = answerRegex.exec(detailsText)) !== null) {
      answerMap[parseInt(am[1])] = {
        letter: am[2],
        text: am[3].trim(),
        explanation: am[4].trim()
      };
    }
  }

  // Remove <details> before parsing questions to avoid inflating option counts
  const cleanText = stripHtml(htmlContent.replace(/<details[\s\S]*?<\/details>/gi, ''));

  const questions = [];
  const parts = cleanText.split(/(?=Question\s+\d+\s*:)/i);

  for (const part of parts) {
    const qMatch = part.match(/Question\s+(\d+)\s*:\s*([\s\S]*?)(?=\n\s*[A-D]\))/i);
    if (!qMatch) continue;

    const qNum = parseInt(qMatch[1]);
    const questionText = qMatch[2].trim();
    const options = [];
    const optRegex = /([A-D])\)\s*([^\n]+)/g;
    let optMatch;
    while ((optMatch = optRegex.exec(part)) !== null) {
      if (!options.find(o => o.letter === optMatch[1])) {
        options.push({ letter: optMatch[1], text: optMatch[2].trim() });
      }
    }
    if (options.length < 2) continue;

    const answer = answerMap[qNum];
    questions.push({
      questionNum: qNum,
      question: questionText,
      options: options.map(opt => ({
        text: opt.text,
        isCorrect: answer ? opt.letter === answer.letter : false
      })),
      explanation: answer?.explanation || ''
    });
  }

  return questions.length > 0 ? questions : null;
}

// ============================================================
// FORMAT 2: "Question N." + lowercase a)-d) + inline "Correct Answer: x)"
// Used by: CR-601, Lost in Translation, Pursuit of Happyness, Suicide Crisis
// ============================================================

function parseFormat2(htmlContent) {
  const text = stripHtml(htmlContent);
  // Must have "Question N." and lowercase options and "Correct Answer:"
  if (!/Question\s+\d+[.:]/i.test(text) && !/\d+\.\s/m.test(text)) return null;
  if (!/[a-d]\)\s/m.test(text)) return null;
  if (!/Correct Answer/i.test(text)) return null;

  const questions = [];
  // Split on question boundaries: "Question N." or bold numbered "N."
  const parts = text.split(/(?=(?:^|\n)(?:Question\s+)?\d+\.\s+[A-Z])/m);

  for (const part of parts) {
    // Match "Question N. text" or "N. text" (where text starts with uppercase = a question)
    const qMatch = part.match(/(?:Question\s+)?(\d+)\.\s+([\s\S]*?)(?=\n\s*[a-d]\))/i);
    if (!qMatch) continue;

    const qNum = parseInt(qMatch[1]);
    const questionText = qMatch[2].trim();

    // Extract lowercase options
    const options = [];
    const optRegex = /([a-d])\)\s*([^\n]+)/g;
    let optMatch;
    while ((optMatch = optRegex.exec(part)) !== null) {
      if (!options.find(o => o.letter === optMatch[1])) {
        options.push({ letter: optMatch[1], text: optMatch[2].trim() });
      }
    }
    if (options.length < 2) continue;

    // Extract inline correct answer: "Correct Answer: b) text" or "Correct Answer: B"
    let correctLetter = null;
    let explanation = '';
    const correctMatch = part.match(/Correct Answer:\s*([a-dA-D])\)?/i);
    if (correctMatch) {
      correctLetter = correctMatch[1].toLowerCase();
    }

    // Extract explanation/rationale
    const ratMatch = part.match(/(?:Explanation|Rationale):\s*([\s\S]*?)(?=\n\s*(?:Question\s+)?\d+\.|$)/i);
    if (ratMatch) {
      explanation = ratMatch[1].trim();
    }

    questions.push({
      questionNum: qNum,
      question: questionText,
      options: options.map(opt => ({
        text: opt.text,
        isCorrect: correctLetter ? opt.letter === correctLetter : false
      })),
      explanation
    });
  }

  return questions.length > 0 ? questions : null;
}

// ============================================================
// FORMAT 3: Numbered N. + lowercase a)-d) (NO answer key)
// Used by: Elephant, Suicide Risk Assessment, When It Rains,
//          It Takes a Village, Walking on Eggshells, Career Counseling
// ============================================================

function parseFormat3(htmlContent) {
  const text = stripHtml(htmlContent);
  // Must have numbered items and lowercase options, but NOT "Correct Answer" (that's Format 2)
  if (!/\d+\.\s+\S/.test(text) || !/[a-d]\)\s/m.test(text)) return null;
  if (/Correct Answer/i.test(text)) return null;
  // Should NOT have uppercase A) B) C) D) — that's Format 1
  if (/[A-D]\)\s+\S/.test(text) && /Question\s+\d+\s*:/i.test(text)) return null;

  const questions = [];
  // Split on numbered question boundaries (N. followed by text starting with uppercase)
  const parts = text.split(/(?=(?:^|\n)\d+\.\s+[A-Z"W])/m);

  for (const part of parts) {
    const qMatch = part.match(/(\d+)\.\s+([\s\S]*?)(?=\n\s*[a-d]\))/);
    if (!qMatch) continue;

    const qNum = parseInt(qMatch[1]);
    const questionText = qMatch[2].trim();
    if (questionText.length < 10) continue; // Skip non-question numbered items

    const options = [];
    const optRegex = /([a-d])\)\s*([^\n]+)/g;
    let optMatch;
    while ((optMatch = optRegex.exec(part)) !== null) {
      if (!options.find(o => o.letter === optMatch[1])) {
        options.push({ letter: optMatch[1], text: optMatch[2].trim() });
      }
    }
    if (options.length < 2) continue;

    questions.push({
      questionNum: qNum,
      question: questionText,
      options: options.map(opt => ({ text: opt.text, isCorrect: false })),
      explanation: ''
    });
  }

  return questions.length > 0 ? questions : null;
}

// ============================================================
// FORMAT 4: Bold "**N.**" + lowercase a)-d) + separate POST-TEST ANSWER KEY
// Used by: 3Hour_CE courses
// ============================================================

function parseFormat4(htmlContent) {
  const text = stripHtml(htmlContent);
  if (!/POST-TEST\s+QUESTIONS/i.test(text) && !/\d+\.\s+\S/.test(text)) return null;
  if (!/[a-d]\)\s/m.test(text)) return null;

  // Look for answer key section in the SAME block or later blocks
  // The answer key may be "POST-TEST ANSWER KEY" with "N. **X** - explanation"
  const answerMap = {};
  const akMatch = text.match(/(?:POST-TEST\s+)?ANSWER\s+KEY[\s\S]*/i);
  if (akMatch) {
    const akText = akMatch[0];
    // Pattern: "1. B - explanation" or "1. **B** - explanation"
    const akRegex = /(\d+)\.\s*\*{0,2}([A-D])\*{0,2}\s*[-–—]\s*([^\n]+)/gi;
    let am;
    while ((am = akRegex.exec(akText)) !== null) {
      answerMap[parseInt(am[1])] = {
        letter: am[2].toUpperCase(),
        explanation: am[3].trim()
      };
    }
  }

  // Extract questions from before the answer key
  const questionsText = akMatch ? text.substring(0, text.indexOf(akMatch[0])) : text;
  const questions = [];
  const parts = questionsText.split(/(?=(?:^|\n)\d+\.\s+[A-Z"W])/m);

  for (const part of parts) {
    const qMatch = part.match(/(\d+)\.\s+([\s\S]*?)(?=\n\s*[a-d]\))/);
    if (!qMatch) continue;

    const qNum = parseInt(qMatch[1]);
    const questionText = qMatch[2].trim();
    if (questionText.length < 10) continue;

    const options = [];
    const optRegex = /([a-d])\)\s*([^\n]+)/g;
    let optMatch;
    while ((optMatch = optRegex.exec(part)) !== null) {
      if (!options.find(o => o.letter === optMatch[1])) {
        options.push({ letter: optMatch[1], text: optMatch[2].trim() });
      }
    }
    if (options.length < 2) continue;

    const answer = answerMap[qNum];
    // Map answer key letter (uppercase) to lowercase option letter
    const correctLetter = answer ? answer.letter.toLowerCase() : null;

    questions.push({
      questionNum: qNum,
      question: questionText,
      options: options.map(opt => ({
        text: opt.text,
        isCorrect: correctLetter ? opt.letter === correctLetter : false
      })),
      explanation: answer?.explanation || ''
    });
  }

  return questions.length > 0 ? questions : null;
}

// ============================================================
// FORMAT 6: Numbered N. + uppercase "- A)" with ✓ checkmark on correct answer
// Used by: Career Counseling Across the Lifespan
// ============================================================

function parseFormat6(htmlContent) {
  const text = stripHtml(htmlContent);
  if (!/\d+\.\s+\S/.test(text) || !/[A-D]\)/m.test(text) || !/✓/.test(text)) return null;

  const questions = [];
  const parts = text.split(/(?=(?:^|\n)\d+\.\s+[A-Z"W])/m);

  for (const part of parts) {
    const qMatch = part.match(/(\d+)\.\s+([\s\S]*?)(?=\n\s*-?\s*[A-D]\))/);
    if (!qMatch) continue;

    const qNum = parseInt(qMatch[1]);
    const questionText = qMatch[2].trim();
    if (questionText.length < 10) continue;

    const options = [];
    const optRegex = /([A-D])\)\s*([^\n]+)/g;
    let optMatch;
    while ((optMatch = optRegex.exec(part)) !== null) {
      if (!options.find(o => o.letter === optMatch[1])) {
        const rawText = optMatch[2].trim();
        const hasCheck = rawText.includes('✓');
        options.push({
          letter: optMatch[1],
          text: rawText.replace(/\s*✓\s*/, '').trim(),
          isCorrect: hasCheck
        });
      }
    }
    if (options.length < 2) continue;

    questions.push({
      questionNum: qNum,
      question: questionText,
      options: options.map(opt => ({ text: opt.text, isCorrect: opt.isCorrect })),
      explanation: ''
    });
  }

  return questions.length > 0 ? questions : null;
}

// ============================================================
// FORMAT 5: Decision Points — "Option A:" through "Option D:"
// Used by: 28 Days Later, It Takes a Village, Walking on Eggshells
// ============================================================

function parseDecisionPoint(htmlContent) {
  const htmlWithoutDetails = htmlContent.replace(/<details[\s\S]*?<\/details>/gi, '');
  const text = stripHtml(htmlWithoutDetails);

  if (!/Option\s+[A-D]\s*:/i.test(text)) return null;
  const optionCount = (text.match(/Option\s+[A-D]\s*:/gi) || []).length;
  if (optionCount < 2) return null;

  // Extract the question text (everything before "Option A:")
  const questionMatch = text.match(/([\s\S]*?)(?=\s*Option\s+A\s*:)/i);
  let questionText = questionMatch ? questionMatch[1].trim() : '';
  questionText = questionText
    .replace(/^.*DECISION POINT[:\s]*/im, '')
    .replace(/^\s*---\s*$/gm, '')
    .trim();
  const paragraphs = questionText.split(/\n\n+/).filter(p => p.trim().length > 10);
  questionText = paragraphs.length > 0 ? paragraphs[paragraphs.length - 1].trim() : questionText;

  const options = [];
  const optRegex = /Option\s+([A-D])\s*:\s*([\s\S]*?)(?=Option\s+[A-D]\s*:|$)/gi;
  let om;
  while ((om = optRegex.exec(text)) !== null) {
    let optText = om[2].trim().replace(/\s*---\s*$/, '').trim();
    if (optText.length > 0) {
      options.push({ letter: om[1].toUpperCase(), text: optText });
    }
  }
  if (options.length < 2) return null;

  // Extract correct answer from <details>
  let correctLetter = null;
  let explanation = '';
  const detailsMatch = htmlContent.match(/<details[\s\S]*?<\/details>/i);
  if (detailsMatch) {
    const detailsText = stripHtml(detailsMatch[0]);
    const optimalMatch = detailsText.match(/Optimal\s+Response:\s*Option\s+([A-D])/i);
    if (optimalMatch) {
      correctLetter = optimalMatch[1].toUpperCase();
      const expStart = detailsText.indexOf(optimalMatch[0]) + optimalMatch[0].length;
      explanation = detailsText.substring(expStart).trim();
      if (explanation.length > 500) explanation = explanation.substring(0, 497) + '...';
    }
  }

  return {
    question: questionText,
    options: options.map(opt => ({
      text: opt.text,
      isCorrect: correctLetter ? opt.letter === correctLetter : false
    })),
    explanation
  };
}

// ============================================================
// UNIFIED PARSER: Try all formats in order
// ============================================================

function parseQuizContent(htmlContent) {
  const text = stripHtml(htmlContent);

  // Try Decision Points first (most specific pattern)
  if (/Option\s+[A-D]\s*:/i.test(text)) {
    const dp = parseDecisionPoint(htmlContent);
    if (dp) return { type: 'decisionPoint', questions: [dp] };
  }

  // Try Format 1: "Question N:" + uppercase A)-D) + <details>
  if (/Question\s+\d+\s*:/i.test(text) && /[A-D]\)/m.test(text)) {
    const q = parseFormat1(htmlContent);
    if (q) return { type: 'knowledgeCheck', questions: q };
  }

  // Try Format 6: checkmark ✓ answers with uppercase A)-D)
  if (/✓/.test(text) && /[A-D]\)/m.test(text)) {
    const q = parseFormat6(htmlContent);
    if (q) return { type: 'knowledgeCheck', questions: q };
  }

  // Try Format 2: questions + lowercase a)-d) + "Correct Answer:" inline
  if (/Correct Answer/i.test(text) && /[a-d]\)/m.test(text)) {
    const q = parseFormat2(htmlContent);
    if (q) return { type: 'knowledgeCheck', questions: q };
  }

  // Try Format 4: POST-TEST with separate answer key
  if (/ANSWER\s+KEY/i.test(text) && /[a-d]\)/m.test(text)) {
    const q = parseFormat4(htmlContent);
    if (q) return { type: 'postTest', questions: q };
  }

  // Try Format 3: numbered + lowercase a)-d) (no answer key) — least specific, try last
  if (/[a-d]\)\s+\S/m.test(text)) {
    const q = parseFormat3(htmlContent);
    if (q) return { type: 'knowledgeCheck', questions: q };
  }

  return null;
}

// ============================================================
// NON-QUIZ TEXT EXTRACTION
// ============================================================

function extractNonQuizText(htmlContent) {
  let cleaned = htmlContent;

  // Remove Knowledge Check / Post-Test titles
  cleaned = cleaned.replace(/<h[23][^>]*>.*?(?:KNOWLEDGE CHECK|Knowledge Check|POST-TEST).*?<\/h[23]>/gi, '');
  cleaned = cleaned.replace(/<p[^>]*>.*?(?:Complete all \d+ questions|must answer at least|Instructions:.*?Select the best|score of \d+%).*?<\/p>/gi, '');

  // Remove "Question N:" / "Question N." blocks with options
  cleaned = cleaned.replace(/<p[^>]*>\s*<strong>Question\s+\d+.*?<\/p>/gi, '');

  // Remove numbered question lines: "<p>N. question text</p>"
  cleaned = cleaned.replace(/<p[^>]*>\s*<strong>\d+\.\s+.*?<\/strong>.*?<\/p>/gi, '');
  cleaned = cleaned.replace(/<p[^>]*>\s*\d+\.\s+[A-Z][\s\S]*?<\/p>/gi, '');

  // Remove option lines: uppercase A)-D), lowercase a)-d), and "- A)" bullet variants
  cleaned = cleaned.replace(/<p[^>]*>\s*-?\s*[A-Da-d]\)\s+.*?<\/p>/gi, '');

  // Remove "Correct Answer:" lines
  cleaned = cleaned.replace(/<p[^>]*>\s*<strong>Correct Answer.*?<\/p>/gi, '');
  // Remove Explanation/Rationale lines
  cleaned = cleaned.replace(/<p[^>]*>\s*<em>(?:Rationale|Explanation).*?<\/em>.*?<\/p>/gi, '');

  // Remove Decision Point title and Option blocks
  cleaned = cleaned.replace(/<h[23][^>]*>.*?DECISION POINT.*?<\/h[23]>/gi, '');
  cleaned = cleaned.replace(/<p[^>]*>\s*<strong>Option\s+[A-D]\s*:.*?<\/p>/gi, '');

  // Remove POST-TEST ANSWER KEY section and everything after it
  cleaned = cleaned.replace(/<h[23][^>]*>.*?ANSWER\s+KEY.*?<\/h[23]>[\s\S]*/gi, '');
  cleaned = cleaned.replace(/<p[^>]*>.*?ANSWER\s+KEY.*?<\/p>[\s\S]*/gi, '');

  // Remove <details> sections
  cleaned = cleaned.replace(/<details[\s\S]*?<\/details>/gi, '');
  cleaned = cleaned.replace(/<p>\s*<\/details>\s*<\/p>/gi, '');

  // Remove PULSE CHECK sections
  cleaned = cleaned.replace(/<h[23][^>]*>.*?PULSE CHECK.*?<\/h[23]>/gi, '');

  // Clean up
  cleaned = cleaned.replace(/<p>\s*---\s*<\/p>/g, '');
  cleaned = cleaned.replace(/<p>\s*<\/p>/g, '');
  cleaned = cleaned.replace(/(<hr\s*\/?>)+/g, '');
  cleaned = cleaned.replace(/^\s+|\s+$/g, '');

  if (stripHtml(cleaned).trim().length < 20) return '';
  return cleaned;
}

// ============================================================
// MAIN MIGRATION
// ============================================================

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
    if (DRY_RUN) console.log('🔍 DRY RUN — no changes will be saved\n');

    const db = mongoose.connection.db;
    const ic = db.collection('interactivecourses');
    const courses = await ic.find({}).toArray();
    console.log(`📚 interactivecourses: ${courses.length} courses found\n`);

    let totalCoursesFixed = 0;
    let totalQuestionsCreated = 0;
    let totalDecisionPointsCreated = 0;
    let totalNoAnswer = 0;

    for (const course of courses) {
      if (!course.sections || !Array.isArray(course.sections)) continue;

      let courseModified = false;
      const newSections = [];

      for (let si = 0; si < course.sections.length; si++) {
        const section = course.sections[si];
        if (!section.contentBlocks || !Array.isArray(section.contentBlocks)) {
          newSections.push(section);
          continue;
        }

        const newBlocks = [];
        let sectionModified = false;

        for (let bi = 0; bi < section.contentBlocks.length; bi++) {
          const block = section.contentBlocks[bi];

          if (block.type !== 'text' || !containsQuizContent(block.content || block.textContent || '')) {
            newBlocks.push(block);
            continue;
          }

          const htmlContent = block.content || block.textContent || '';
          sectionModified = true;

          // Preserve non-quiz text
          const remainingText = extractNonQuizText(htmlContent);
          if (remainingText) {
            newBlocks.push({ ...block, content: remainingText, textContent: stripHtml(remainingText) });
          }

          // Parse quiz content using unified parser
          const parsed = parseQuizContent(htmlContent);
          if (parsed) {
            for (const q of parsed.questions) {
              const mcBlock = {
                type: 'multipleChoice',
                order: newBlocks.length + 1,
                question: q.question || q.questionText,
                options: q.options,
                explanation: q.explanation || 'Review the module content for the detailed explanation.'
              };
              newBlocks.push(mcBlock);

              if (parsed.type === 'decisionPoint') {
                totalDecisionPointsCreated++;
              } else {
                totalQuestionsCreated++;
              }

              const correct = q.options.find(o => o.isCorrect);
              if (!correct) totalNoAnswer++;

              if (DRY_RUN) {
                const qText = (q.question || q.questionText || '').substring(0, 55);
                const tag = parsed.type === 'decisionPoint' ? 'DP' : `KC Q${q.questionNum || '?'}`;
                console.log(`  → S${si + 1} B${bi + 1}: ${tag} "${qText}..."`);
                console.log(`    Correct: ${correct ? correct.text.substring(0, 40) : '(no answer key)'} | Options: ${q.options.length}`);
              }
            }
          }
        }

        newBlocks.forEach((b, i) => { b.order = i + 1; });

        if (sectionModified) {
          courseModified = true;
          newSections.push({ ...section, contentBlocks: newBlocks });
        } else {
          newSections.push(section);
        }
      }

      if (courseModified) {
        totalCoursesFixed++;
        console.log(`  ✏️  ${course.title || course.slug} — quiz blocks created\n`);

        if (!DRY_RUN) {
          await ic.updateOne({ _id: course._id }, { $set: { sections: newSections } });
        }
      }
    }

    console.log(`\n${'='.repeat(50)}`);
    console.log(`${DRY_RUN ? '🔍 Would fix' : '✅ Fixed'}: ${totalCoursesFixed} courses`);
    console.log(`  Knowledge Check / Post-Test questions: ${totalQuestionsCreated}`);
    console.log(`  Decision Points: ${totalDecisionPointsCreated}`);
    console.log(`  Questions without answer key: ${totalNoAnswer}`);
    if (DRY_RUN) console.log('\nRun without --dry-run to apply changes.');

  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

migrate();
