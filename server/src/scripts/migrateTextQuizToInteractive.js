/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// migrateTextQuizToInteractive.js
//
// Scans interactivecourses for text blocks containing quiz patterns
// (Knowledge Checks and Decision Points stored as plain HTML text)
// and converts them to proper multipleChoice content blocks.
//
// This makes quiz questions clickable with radio buttons and "Check Answer"
// instead of static text with A) B) C) D) options.
//
// Does NOT change word count — quiz question text and explanations are preserved.
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
    .trim();
}

/**
 * Parse a text block's content to find Knowledge Check questions.
 * Pattern: "Question N:" followed by A) B) C) D) options
 * Answer key in <details> block: "N. X) answer — explanation"
 */
function parseKnowledgeCheckQuestions(htmlContent) {
  const text = stripHtml(htmlContent);

  // Must contain "Question" and option letters
  if (!/Question\s+\d+/i.test(text) || !/[A-D]\)/m.test(text)) {
    return null;
  }

  // Extract answer key from <details> section FIRST
  const answerMap = {};
  const detailsMatch = htmlContent.match(/<details[\s\S]*?<\/details>/i);
  if (detailsMatch) {
    const detailsText = stripHtml(detailsMatch[0]);
    // Pattern: "1. C) Prefrontal cortex — explanation"
    // Also handles: "1. C) Prefrontal cortex - explanation" (single dash)
    // Use multiline: each answer starts with "N." at beginning of line
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

  // Remove <details> section from HTML before parsing questions/options
  // This prevents answer-key text (which also has A) B) etc.) from inflating option counts
  const htmlWithoutDetails = htmlContent.replace(/<details[\s\S]*?<\/details>/gi, '');
  const cleanText = stripHtml(htmlWithoutDetails);

  // Extract individual questions
  const questions = [];
  // Split on "Question N:" pattern
  const parts = cleanText.split(/(?=Question\s+\d+\s*:)/i);

  for (const part of parts) {
    const qMatch = part.match(/Question\s+(\d+)\s*:\s*([\s\S]*?)(?=\n\s*[A-D]\))/i);
    if (!qMatch) continue;

    const qNum = parseInt(qMatch[1]);
    const questionText = qMatch[2].trim();

    // Extract options A) through D) — only 4 max per question
    const options = [];
    const optRegex = /([A-D])\)\s*([^\n]+)/g;
    let optMatch;
    while ((optMatch = optRegex.exec(part)) !== null) {
      // Deduplicate — only take first occurrence of each letter
      if (!options.find(o => o.letter === optMatch[1])) {
        options.push({
          letter: optMatch[1],
          text: optMatch[2].trim()
        });
      }
    }

    if (options.length < 2) continue;

    // Determine correct answer from answer key
    const answer = answerMap[qNum];
    const correctLetter = answer?.letter || null;

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

/**
 * Parse Decision Point blocks.
 * Pattern: "Option A:" through "Option D:" with <details> for correct answer
 */
function parseDecisionPoint(htmlContent) {
  // Strip <details> from HTML before parsing to avoid matching answer-key text as options
  const htmlWithoutDetails = htmlContent.replace(/<details[\s\S]*?<\/details>/gi, '');
  const text = stripHtml(htmlWithoutDetails);

  // Must have "Option A:" through at least "Option B:"
  if (!/Option\s+[A-D]\s*:/i.test(text)) return null;
  // Should have at least 2 options
  const optionCount = (text.match(/Option\s+[A-D]\s*:/gi) || []).length;
  if (optionCount < 2) return null;

  // Extract the question text (everything before "Option A:")
  const questionMatch = text.match(/([\s\S]*?)(?=\s*Option\s+A\s*:)/i);
  let questionText = questionMatch ? questionMatch[1].trim() : '';
  // Remove section headers and instructions
  questionText = questionText
    .replace(/^.*DECISION POINT[:\s]*/im, '')
    .replace(/^\s*---\s*$/gm, '')
    .trim();
  // Take the last meaningful paragraph as the question
  const paragraphs = questionText.split(/\n\n+/).filter(p => p.trim().length > 10);
  questionText = paragraphs.length > 0 ? paragraphs[paragraphs.length - 1].trim() : questionText;

  // Extract options from text WITHOUT answer key
  const options = [];
  const optRegex = /Option\s+([A-D])\s*:\s*([\s\S]*?)(?=Option\s+[A-D]\s*:|$)/gi;
  let om;
  while ((om = optRegex.exec(text)) !== null) {
    let optText = om[2].trim();
    // Clean up trailing separators
    optText = optText.replace(/\s*---\s*$/, '').trim();
    if (optText.length > 0) {
      options.push({
        letter: om[1].toUpperCase(),
        text: optText
      });
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
    }
    // Get the explanation text (everything after "Optimal Response: Option X")
    if (optimalMatch) {
      const expStart = detailsText.indexOf(optimalMatch[0]) + optimalMatch[0].length;
      explanation = detailsText.substring(expStart).trim();
      // Truncate to a reasonable length
      if (explanation.length > 500) {
        explanation = explanation.substring(0, 497) + '...';
      }
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

/**
 * Check if a text block contains quiz content that should be converted
 */
function containsQuizContent(content) {
  if (!content) return false;
  const text = stripHtml(content);
  // Knowledge check pattern
  if (/Question\s+\d+\s*:/i.test(text) && /[A-D]\)/m.test(text)) return true;
  // Decision point pattern
  if (/Option\s+[A-D]\s*:/i.test(text) && (text.match(/Option\s+[A-D]\s*:/gi) || []).length >= 2) return true;
  return false;
}

/**
 * Extract the non-quiz text content from a block (text before/after quiz patterns)
 */
function extractNonQuizText(htmlContent) {
  // Remove the knowledge check section (from "KNOWLEDGE CHECK" header to end or next section)
  let cleaned = htmlContent;

  // Remove Knowledge Check title and instructions
  cleaned = cleaned.replace(/<h[23][^>]*>.*?KNOWLEDGE CHECK.*?<\/h[23]>/gi, '');
  cleaned = cleaned.replace(/<p[^>]*>.*?Complete all \d+ questions.*?<\/p>/gi, '');
  cleaned = cleaned.replace(/<p[^>]*>.*?must answer at least.*?<\/p>/gi, '');

  // Remove Question N: blocks with their options
  cleaned = cleaned.replace(/<p[^>]*>\s*<strong>Question\s+\d+.*?<\/p>/gi, '');
  cleaned = cleaned.replace(/<p[^>]*>\s*[A-D]\)\s+.*?<\/p>/gi, '');

  // Remove Decision Point title
  cleaned = cleaned.replace(/<h[23][^>]*>.*?DECISION POINT.*?<\/h[23]>/gi, '');

  // Remove Option A:/B:/C:/D: blocks
  cleaned = cleaned.replace(/<p[^>]*>\s*<strong>Option\s+[A-D]\s*:.*?<\/p>/gi, '');

  // Remove <details> sections entirely (including </p><p></details> variants from markdownToHtml)
  cleaned = cleaned.replace(/<details[\s\S]*?<\/details>/gi, '');
  cleaned = cleaned.replace(/<p>\s*<details[\s\S]*?<\/details>\s*<\/p>/gi, '');
  cleaned = cleaned.replace(/<p>\s*<\/details>\s*<\/p>/gi, '');

  // Remove POST-MODULE PULSE CHECK sections
  cleaned = cleaned.replace(/<h[23][^>]*>.*?PULSE CHECK.*?<\/h[23]>/gi, '');

  // Clean up empty paragraphs, separators, and whitespace
  cleaned = cleaned.replace(/<p>\s*---\s*<\/p>/g, '');
  cleaned = cleaned.replace(/<p>\s*<\/p>/g, '');
  cleaned = cleaned.replace(/(<hr\s*\/?>)+/g, '');
  cleaned = cleaned.replace(/^\s+|\s+$/g, '');

  // If only whitespace/empty tags remain, return empty
  if (stripHtml(cleaned).trim().length < 20) return '';
  return cleaned;
}

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

          // Only process text blocks that contain quiz content
          if (block.type !== 'text' || !containsQuizContent(block.content || block.textContent || '')) {
            newBlocks.push(block);
            continue;
          }

          const htmlContent = block.content || block.textContent || '';
          sectionModified = true;

          // Try to extract non-quiz text to preserve
          const remainingText = extractNonQuizText(htmlContent);
          if (remainingText) {
            newBlocks.push({
              ...block,
              content: remainingText,
              textContent: stripHtml(remainingText)
            });
          }

          // Parse Knowledge Check questions
          const kcQuestions = parseKnowledgeCheckQuestions(htmlContent);
          if (kcQuestions) {
            for (const q of kcQuestions) {
              const mcBlock = {
                type: 'multipleChoice',
                order: newBlocks.length + 1,
                question: q.question,
                options: q.options,
                explanation: q.explanation || 'Review the module content for the detailed explanation.'
              };
              newBlocks.push(mcBlock);
              totalQuestionsCreated++;

              if (DRY_RUN) {
                const correct = q.options.find(o => o.isCorrect);
                console.log(`  → S${si + 1} B${bi + 1}: KC Q${q.questionNum} "${q.question.substring(0, 55)}..."`);
                console.log(`    Correct: ${correct ? correct.text.substring(0, 40) : '(unknown)'} | Options: ${q.options.length}`);
              }
            }
          }

          // Parse Decision Point
          const dp = parseDecisionPoint(htmlContent);
          if (dp && !kcQuestions) {  // Don't double-parse if already got KC questions
            const mcBlock = {
              type: 'multipleChoice',
              order: newBlocks.length + 1,
              question: dp.question,
              options: dp.options,
              explanation: dp.explanation || 'Review the clinical rationale in the module content.'
            };
            newBlocks.push(mcBlock);
            totalDecisionPointsCreated++;

            if (DRY_RUN) {
              const correct = dp.options.find(o => o.isCorrect);
              console.log(`  → S${si + 1} B${bi + 1}: DP "${dp.question.substring(0, 55)}..."`);
              console.log(`    Correct: ${correct ? correct.text.substring(0, 40) : '(unknown)'} | Options: ${dp.options.length}`);
            }
          }
        }

        // Re-number block orders
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
    console.log(`  Knowledge Check questions: ${totalQuestionsCreated}`);
    console.log(`  Decision Points: ${totalDecisionPointsCreated}`);
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
