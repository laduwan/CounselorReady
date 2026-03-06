/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
#!/usr/bin/env node
/**
 * extractInlineQuizzes.js
 * ============================================================
 * Finds quiz Q&As written directly into text blocks and converts
 * them to proper multipleChoice content blocks.
 *
 * Handles patterns like:
 *   Question 5: Which statement about firearms...
 *   A) Firearms account for 25%...
 *   B) Firearms have a case fatality...
 *   C) Firearms account for 54%...
 *   D) Firearms are the most common...
 *   Correct Answer: C
 *   Rationale: Firearms account for approximately 54%...
 *
 * Also handles:
 *   **Question 1:** ...         (bold markdown style)
 *   1. Which of the following... (numbered style)
 *   A. Option text              (period instead of paren)
 *
 * USAGE:
 *   node extractInlineQuizzes.js --dry-run          # scan all, no writes
 *   node extractInlineQuizzes.js --slug=crisis-intervention-and-suicide-prevention-a-comprehensive-clinical-guide
 *   node extractInlineQuizzes.js                    # fix all affected courses
 * ============================================================
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const DRY_RUN = process.argv.includes('--dry-run');
const SLUG_ARG = process.argv.find(a => a.startsWith('--slug='))?.split('=')[1];

if (!MONGODB_URI) { console.error('❌ MONGODB_URI not set'); process.exit(1); }

// ─── HTML → plain text ───────────────────────────────────────────────────────
function stripHtml(html = '') {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

// ─── CORE EXTRACTOR ──────────────────────────────────────────────────────────
/**
 * Given plain text, find all inline quiz blocks.
 * Returns array of { startIdx, endIdx, question, options, correctAnswer, explanation }
 */
function findInlineQuizzes(text) {
  const results = [];

  // Match full question blocks:
  // Question N: ... [options A-D] Correct Answer: X [Rationale: ...]
  // Supports both "A)" and "A." formats, bold/plain, numbered or labeled
  const QUESTION_BLOCK = /(?:(?:\*{0,2}(?:Question\s+\d+\s*:|Q\s*\d+[:.])|\d+\.\s+(?=which|what|how|when|where|who|identify|select|according|a\s+client|an?\s+\w+\s+who|which\s+of))\*{0,2})\s*([\s\S]*?)(?=\n\s*(?:[A-D][).])|$)/gi;

  const OPTION_LINE = /^\s*([A-D])[).]\s+(.+)/;
  const CORRECT_LINE = /correct\s+answer[:\s]+([A-D])/i;
  const RATIONALE_LINE = /rationale[:\s]+(.+)/i;

  // Split text into lines for line-by-line parsing
  const lines = text.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    // Detect question start
    const isQuestion =
      /^(?:\*{0,2})?(?:Question\s+\d+\s*:|\bQ\s*\d+[:.:])/i.test(line) ||
      /^(?:\*{0,2})?\d+\.\s+(?:Which|What|How|When|Where|Who|Identify|Select|According|A\s+client|An?\s+\w+\s+who)/i.test(line);

    if (!isQuestion) { i++; continue; }

    const startLine = i;
    // Collect question text (may span multiple lines before first option)
    let questionLines = [line.replace(/^(?:\*{0,2})?(?:Question\s+\d+\s*:|\bQ\s*\d+[:.:]|\d+\.)\s*\*{0,2}\s*/i, '').trim()];
    i++;

    // Collect until we hit the first option line A) or A.
    while (i < lines.length && !OPTION_LINE.test(lines[i])) {
      const l = lines[i].trim();
      if (l) questionLines.push(l);
      i++;
      if (i - startLine > 8) break; // safety — question shouldn't be > 8 lines
    }

    const question = questionLines.join(' ').trim();
    if (!question) continue;

    // Collect options A–D
    const options = {};
    let lastOption = null;
    while (i < lines.length) {
      const l = lines[i].trim();
      const optMatch = OPTION_LINE.exec(l);
      if (optMatch) {
        const letter = optMatch[1].toUpperCase();
        options[letter] = optMatch[2].trim();
        lastOption = letter;
        i++;
      } else if (lastOption && l && !CORRECT_LINE.test(l) && !RATIONALE_LINE.test(l) && !l.match(/^[A-D][).]/) && !l.match(/^(?:Question|\d+\.)/) && Object.keys(options).length < 4) {
        // continuation of last option
        options[lastOption] += ' ' + l;
        i++;
      } else {
        break;
      }
    }

    if (Object.keys(options).length < 2) continue; // not a real quiz block

    // Find Correct Answer line
    let correctLetter = null;
    let explanation = '';
    const endSearchFrom = i;

    while (i < lines.length) {
      const l = lines[i].trim();
      const correctMatch = CORRECT_LINE.exec(l);
      const rationaleMatch = RATIONALE_LINE.exec(l);

      if (correctMatch) {
        correctLetter = correctMatch[1].toUpperCase();
        i++;
      } else if (rationaleMatch) {
        explanation = rationaleMatch[1].trim();
        i++;
        // Rationale may continue on next lines
        while (i < lines.length) {
          const next = lines[i].trim();
          if (!next || /^(?:Question\s+\d+|Q\s*\d+|\d+\.)/.test(next) || CORRECT_LINE.test(next) || OPTION_LINE.test(next)) break;
          explanation += ' ' + next;
          i++;
        }
      } else {
        break;
      }
    }

    if (!correctLetter || !options[correctLetter]) continue;

    const optionLetters = ['A', 'B', 'C', 'D'].filter(l => options[l]);
    const correctIndex = optionLetters.indexOf(correctLetter);
    const optionStrings = optionLetters.map(l => `${l}) ${options[l]}`);

    results.push({
      startLine,
      endLine: i - 1,
      question: question.replace(/\*\*/g, ''),
      options: optionStrings,
      correctAnswer: correctIndex,
      explanation: explanation.replace(/\*\*/g, '').trim() || `Option ${correctLetter} is correct.`,
    });
  }

  return results;
}

// ─── PROCESS ONE CONTENT BLOCK ───────────────────────────────────────────────
function extractFromBlock(block) {
  const rawHtml = block.textContent || block.content || '';
  if (!rawHtml) return null;

  const plainText = stripHtml(rawHtml);
  const found = findInlineQuizzes(plainText);

  if (!found.length) return null;
  return { found, rawHtml, plainText };
}

/**
 * Removes the matched quiz text from the HTML block.
 * Uses string matching on the plain text positions to locate and remove.
 */
function removeQuizTextFromHtml(html, quizzes) {
  let text = stripHtml(html);

  // Build a combined regex for all quiz segments to remove
  // We'll do it by reconstructing the HTML without the quiz paragraphs
  // Strategy: split the HTML into paragraphs and remove those containing quiz content
  const quizSignatures = new Set();

  for (const q of quizzes) {
    // Add question text signature
    const qSig = q.question.substring(0, 40).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    quizSignatures.add(qSig);

    // Add correct answer signature
    quizSignatures.add(`Correct Answer`);
    quizSignatures.add(`Correct answer`);
    quizSignatures.add(`correct answer`);

    // Add rationale signature
    quizSignatures.add(`Rationale`);
    quizSignatures.add(`rationale`);

    // Add option signatures
    for (const opt of q.options) {
      const sig = opt.substring(0, 20).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      quizSignatures.add(sig);
    }
  }

  // Split HTML into paragraph-level chunks and filter
  // Handle both <p> tags and <br> separated lines
  let cleaned = html;

  // Remove paragraphs/lines containing quiz content
  cleaned = cleaned.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (match, inner) => {
    const innerText = stripHtml(inner);
    for (const sig of quizSignatures) {
      if (innerText.toLowerCase().includes(sig.toLowerCase())) return '';
    }
    return match;
  });

  // Remove loose lines (for content not wrapped in <p>)
  cleaned = cleaned.replace(/([^\n]*(?:Question\s+\d+|Correct Answer|Rationale)[^\n]*(\n|$))/gi, '');
  cleaned = cleaned.replace(/([^\n]*^[A-D][).]\s+[^\n]+(\n|$))/gm, '');

  // Clean up leftover empty tags and excess whitespace
  cleaned = cleaned
    .replace(/<p[^>]*>\s*<\/p>/gi, '')
    .replace(/<p[^>]*>(\s|&nbsp;)*<\/p>/gi, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return cleaned;
}

// ─── PROCESS ONE COURSE ──────────────────────────────────────────────────────
function processCourse(course) {
  const sections = course.sections || [];
  let totalExtracted = 0;
  let totalSectionsAffected = 0;
  const report = [];

  for (const section of sections) {
    const blocks = section.contentBlocks || [];
    const newBlocks = [];
    let sectionChanged = false;

    for (let bi = 0; bi < blocks.length; bi++) {
      const block = blocks[bi];

      if (block.type !== 'text' && block.type !== 'sectionDivider') {
        newBlocks.push(block);
        continue;
      }

      const result = extractFromBlock(block);
      if (!result || !result.found.length) {
        newBlocks.push(block);
        continue;
      }

      // Clean the text block — remove quiz content from HTML
      const cleanedHtml = removeQuizTextFromHtml(result.rawHtml, result.found);

      // Only keep the text block if it still has meaningful content
      const remainingWords = stripHtml(cleanedHtml).split(/\s+/).filter(Boolean).length;
      if (remainingWords > 20) {
        const cleanedBlock = { ...block };
        if (cleanedBlock.textContent !== undefined) cleanedBlock.textContent = cleanedHtml;
        else cleanedBlock.content = cleanedHtml;
        newBlocks.push(cleanedBlock);
      }

      // Create proper multipleChoice blocks for each extracted quiz
      for (let qi = 0; qi < result.found.length; qi++) {
        const q = result.found[qi];
        const mcBlock = {
          type: 'multipleChoice',
          order: block.order + 0.1 + (qi * 0.01), // will be re-ordered
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          showExplanation: true,
        };
        newBlocks.push(mcBlock);
        totalExtracted++;
        report.push(`  ✅ Extracted Q: "${q.question.substring(0, 60)}..." → correctAnswer: ${q.correctAnswer}`);
      }

      sectionChanged = true;
    }

    if (sectionChanged) {
      // Re-assign order values sequentially
      newBlocks.forEach((b, idx) => { b.order = idx + 1; });
      section.contentBlocks = newBlocks;
      totalSectionsAffected++;
    }
  }

  return { sections, totalExtracted, totalSectionsAffected, report };
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;
  console.log('✅ Connected\n');

  if (DRY_RUN) console.log('🔍 DRY RUN — no writes\n');

  let query = {};
  if (SLUG_ARG) query = { slug: SLUG_ARG };

  const courses = await db.collection('interactivecourses').find(query).toArray();
  console.log(`📋 Scanning ${courses.length} course(s)...\n`);

  let totalFixed = 0;
  const affected = [];

  for (const course of courses) {
    const result = processCourse(course);

    if (result.totalExtracted === 0) continue;

    console.log(`${'─'.repeat(60)}`);
    console.log(`📖 ${course.title}`);
    console.log(`   ${result.totalExtracted} quiz(zes) extracted from ${result.totalSectionsAffected} section(s)`);
    result.report.forEach(r => console.log(r));

    affected.push({ slug: course.slug, title: course.title, count: result.totalExtracted });

    if (!DRY_RUN) {
      await db.collection('interactivecourses').updateOne(
        { _id: course._id },
        { $set: { sections: result.sections, updatedAt: new Date() } }
      );
      console.log(`   💾 Saved`);
    }

    totalFixed += result.totalExtracted;
  }

  console.log(`\n${'═'.repeat(60)}`);
  if (affected.length === 0) {
    console.log('✅ No inline quiz patterns found — all courses clean.');
  } else {
    console.log(`SUMMARY — ${totalFixed} inline quizzes extracted from ${affected.length} course(s):`);
    affected.forEach(a => console.log(`  • ${a.title} (${a.count} questions)`));
    if (DRY_RUN) console.log('\n🔍 DRY RUN — run without --dry-run to apply fixes.');
  }

  await mongoose.disconnect();
  console.log('\n✅ Done!');
}

main().catch(e => { console.error('💥', e.message); process.exit(1); });
