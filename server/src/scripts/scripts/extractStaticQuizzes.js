/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
#!/usr/bin/env node
/**
 * extractStaticQuizzes.js
 * 
 * Scans ALL courses in the interactivecourses collection.
 * Finds static quiz/knowledge check/exam content embedded as plain HTML text
 * inside text-type contentBlocks or lessons.
 * 
 * Extracts them and converts to:
 *   - multipleChoice contentBlocks (for knowledge checks)
 *   - assessment.questions array (for final exam questions)
 * 
 * Patterns detected:
 *   1. <h3>Knowledge Check</h3> + <p><strong>Question N.</strong>...</p> + <p>a)...</p>
 *   2. <h3>Final Exam</h3> or <h3>Final Assessment</h3> + numbered questions
 *   3. Numbered questions (1. What is...) + lettered options (a) b) c) d))
 *   4. <p>Question: ...</p> + <p>A. ...</p> patterns
 *   5. **Question N:** + option patterns
 * 
 * Also cleans the extracted quiz text OUT of the original text block
 * so it doesn't render as both static text AND interactive widget.
 * 
 * Run on Render: node src/scripts/extractStaticQuizzes.js
 * Safe to run multiple times (idempotent).
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('❌ MONGODB_URI not found'); process.exit(1); }

// ============================================================
// QUIZ EXTRACTION PATTERNS
// ============================================================

/**
 * Extract quiz questions from HTML content.
 * Returns { questions: [...], cleanedContent: "..." }
 */
function extractQuizFromHtml(html) {
  if (!html) return { questions: [], cleanedContent: html };
  
  const questions = [];
  let cleaned = html;
  
  // ── PATTERN 1: <h3>Knowledge Check</h3> blocks ──
  // Matches entire knowledge check sections with their questions
  const kcSectionRegex = /<h[23][^>]*>\s*(?:Knowledge Check|Quiz|Module \d+ (?:Knowledge )?Check|Check Your (?:Understanding|Knowledge)|Review Questions?|Self-Assessment)[^<]*<\/h[23]>[\s\S]*?(?=<h[23][^>]*>(?!.*(?:Question|knowledge check|quiz))|$)/gi;
  
  const kcSections = html.match(kcSectionRegex) || [];
  
  for (const section of kcSections) {
    const extracted = extractQuestionsFromBlock(section);
    questions.push(...extracted);
    // Remove the entire section from content
    cleaned = cleaned.replace(section, '');
  }
  
  // ── PATTERN 2: Standalone question blocks not inside a KC header ──
  // <p><strong>Question N.</strong> or <p><strong>N.</strong>
  // Followed by <p>a) ... or <p>A. ... or <p>A) ...
  const standaloneQRegex = /<p>\s*<strong>\s*(?:Question\s+)?\d+[\.\)]\s*<\/strong>\s*.+?<\/p>(?:\s*<p>\s*[a-dA-D][\.\)]\s*.+?<\/p>){2,5}/gi;
  
  const standaloneQs = html.match(standaloneQRegex) || [];
  for (const qBlock of standaloneQs) {
    if (cleaned.includes(qBlock)) { // Only if not already removed
      const extracted = extractQuestionsFromBlock(qBlock);
      questions.push(...extracted);
      cleaned = cleaned.replace(qBlock, '');
    }
  }
  
  // ── PATTERN 3: Final Exam / Final Assessment sections ──
  const examRegex = /<h[23][^>]*>\s*(?:Final (?:Exam|Assessment|Evaluation)|Comprehensive (?:Exam|Assessment)|Course (?:Exam|Assessment))[^<]*<\/h[23]>[\s\S]*$/gi;
  
  const examSections = html.match(examRegex) || [];
  for (const section of examSections) {
    const extracted = extractQuestionsFromBlock(section);
    questions.push(...extracted);
    if (cleaned.includes(section)) {
      cleaned = cleaned.replace(section, '');
    }
  }
  
  // ── PATTERN 4: Numbered questions with lettered options (no bold/strong) ──
  // "1. What is the primary..." + "a) Option A" + "b) Option B"
  const numberedQRegex = /<p>\s*\d+\.\s*(?:What|Which|How|When|According|The |A |An |In |Identify|Describe|Explain|True|False)[^<]{20,}<\/p>(?:\s*<p>\s*[a-dA-D][\.\)]\s*[^<]+<\/p>){2,5}/gi;
  
  const numberedQs = html.match(numberedQRegex) || [];
  for (const qBlock of numberedQs) {
    if (cleaned.includes(qBlock)) {
      const extracted = extractQuestionsFromBlock(qBlock);
      questions.push(...extracted);
      cleaned = cleaned.replace(qBlock, '');
    }
  }
  
  // Clean up leftover empty paragraphs and excessive whitespace
  cleaned = cleaned
    .replace(/<p>\s*<\/p>/g, '')
    .replace(/(<br\s*\/?>){3,}/g, '<br/>')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  
  return { questions, cleanedContent: cleaned };
}

/**
 * Extract individual questions from a block of HTML containing quiz content
 */
function extractQuestionsFromBlock(html) {
  const questions = [];
  const text = html;
  
  // Find question + options groups
  // Pattern: question text followed by 2-5 options starting with a) b) c) d) or A. B. C. D.
  
  // First, try to split on question boundaries
  const qSplitRegex = /(?=<p>\s*(?:<strong>\s*)?(?:Question\s+)?\d+[\.\):]?\s*(?:<\/strong>)?)/gi;
  const qParts = text.split(qSplitRegex).filter(p => p.trim());
  
  for (const part of qParts) {
    // Extract question text
    const qTextMatch = part.match(/<p>\s*(?:<strong>\s*)?(?:Question\s+)?\d+[\.\):]?\s*(?:<\/strong>\s*)?(.+?)<\/p>/i);
    if (!qTextMatch) continue;
    
    let questionText = qTextMatch[1].trim();
    // Clean up any remaining HTML/bold tags in question
    questionText = questionText.replace(/<\/?(?:strong|em|b|i)>/g, '').trim();
    
    if (questionText.length < 15) continue; // Too short to be a real question
    
    // Extract options
    const optionMatches = part.match(/<p>\s*[a-dA-D][\.\)]\s*(.+?)<\/p>/gi) || [];
    const options = [];
    
    for (const opt of optionMatches) {
      const optText = opt.replace(/<\/?p>/g, '').replace(/^\s*[a-dA-D][\.\)]\s*/, '').trim();
      if (optText.length > 0) {
        options.push(optText);
      }
    }
    
    if (options.length < 2) continue; // Need at least 2 options
    
    // Try to determine correct answer
    let correctIndex = 0; // Default to first option
    
    // Check for "Correct answer:" or "Answer:" indicators
    const correctMatch = part.match(/(?:correct|answer)[:\s]*(?:<[^>]*>)*\s*([a-dA-D])/i);
    if (correctMatch) {
      correctIndex = correctMatch[1].toLowerCase().charCodeAt(0) - 97;
    }
    
    // Check for bolded correct option
    const boldOptMatch = part.match(/<p>\s*<strong>\s*([a-dA-D])[\.\)]/i);
    if (boldOptMatch && !correctMatch) {
      correctIndex = boldOptMatch[1].toLowerCase().charCodeAt(0) - 97;
    }
    
    // Check for "✓" or "correct" marker near an option
    for (let i = 0; i < options.length; i++) {
      if (/✓|✔|correct|\(correct\)/i.test(optionMatches[i] || '')) {
        correctIndex = i;
        // Clean the marker from the option text
        options[i] = options[i].replace(/\s*[✓✔]\s*/g, '').replace(/\s*\(correct\)\s*/gi, '').trim();
        break;
      }
    }
    
    // Clamp correctIndex
    correctIndex = Math.max(0, Math.min(correctIndex, options.length - 1));
    
    // Check for explanation
    const explainMatch = part.match(/(?:explanation|rationale|feedback)[:\s]*(?:<[^>]*>)*\s*(.+?)(?:<\/p>|$)/i);
    
    questions.push({
      question: questionText,
      options: options.map((text, idx) => ({
        text: text.replace(/<\/?[^>]+>/g, '').trim(),
        isCorrect: idx === correctIndex
      })),
      explanation: explainMatch?.[1]?.replace(/<\/?[^>]+>/g, '').trim() || 'Review the course content for more details on this topic.',
      source: 'extracted_from_static_html'
    });
  }
  
  return questions;
}

/**
 * Check if a text block contains static quiz content
 */
function hasStaticQuizContent(content) {
  if (!content) return false;
  
  const patterns = [
    /<h[23][^>]*>\s*(?:Knowledge Check|Quiz|Review Questions?|Self-Assessment|Check Your|Final (?:Exam|Assessment))/i,
    /<p>\s*<strong>\s*(?:Question\s+)?\d+[\.\)]\s*<\/strong>/i,
    /<p>\s*[a-dA-D][\.\)]\s*[A-Z]/,  // Option line starting with a) A) etc
    /<p>\s*\d+\.\s*(?:What|Which|How|When|According|The primary|A counselor|An important|In the|Identify|True or false)/i
  ];
  
  let matchCount = 0;
  for (const pattern of patterns) {
    if (pattern.test(content)) matchCount++;
  }
  
  // Need at least 2 pattern matches to be confident
  return matchCount >= 2;
}

// ============================================================
// MAIN
// ============================================================

async function main() {
  console.log('\n' + '═'.repeat(70));
  console.log('  EXTRACT STATIC QUIZZES → INTERACTIVE BLOCKS');
  console.log('  Scanning interactivecourses for embedded quiz content');
  console.log('═'.repeat(70));

  await mongoose.connect(MONGODB_URI);
  console.log('\n✅ Connected to MongoDB\n');

  const db = mongoose.connection.db;
  const collection = db.collection('interactivecourses');
  const courses = await collection.find({}).toArray();
  
  console.log(`📊 Found ${courses.length} courses to scan\n`);

  let coursesFixed = 0;
  let totalExtracted = 0;
  let totalAssessmentAdded = 0;

  for (const course of courses) {
    const slug = course.slug || '';
    const modules = course.modules || [];
    let courseModified = false;
    let courseExtracted = 0;

    for (let mi = 0; mi < modules.length; mi++) {
      const mod = modules[mi];
      const blocks = mod.contentBlocks || mod.lessons || [];
      const newBlocks = [];
      
      for (let bi = 0; bi < blocks.length; bi++) {
        const block = blocks[bi];
        const content = block.content || block.textContent || '';
        
        // Check if this text block has embedded quiz content
        if ((block.type === 'text' || !block.type) && hasStaticQuizContent(content)) {
          const { questions, cleanedContent } = extractQuizFromHtml(content);
          
          if (questions.length > 0) {
            // Add the cleaned text block (without quiz content)
            if (cleanedContent && cleanedContent.replace(/<[^>]*>/g, '').trim().length > 50) {
              newBlocks.push({
                ...block,
                content: cleanedContent
              });
            }
            
            // Add extracted questions as interactive multipleChoice blocks
            for (const q of questions) {
              newBlocks.push({
                type: 'multipleChoice',
                question: q.question,
                options: q.options,
                explanation: q.explanation,
                accessibility: { ariaLabel: 'Knowledge check', announceCorrect: true }
              });
              courseExtracted++;
            }
            
            courseModified = true;
          } else {
            // No questions extracted, keep original
            newBlocks.push(block);
          }
        } else {
          // Not a text block with quizzes, keep as-is
          newBlocks.push(block);
        }
      }
      
      // Update the blocks
      if (mod.contentBlocks) {
        modules[mi].contentBlocks = newBlocks;
      } else if (mod.lessons) {
        modules[mi].lessons = newBlocks;
      }
    }

    // Also check for static quiz content in lesson.content fields (old format still in interactivecourses)
    for (let mi = 0; mi < modules.length; mi++) {
      const mod = modules[mi];
      if (mod.lessons) {
        for (let li = 0; li < mod.lessons.length; li++) {
          const lesson = mod.lessons[li];
          if (lesson.type === 'text' && lesson.content && hasStaticQuizContent(lesson.content)) {
            const { questions, cleanedContent } = extractQuizFromHtml(lesson.content);
            if (questions.length > 0) {
              mod.lessons[li].content = cleanedContent;
              
              // Add as contentBlocks if they exist, otherwise note it
              if (!mod.contentBlocks) mod.contentBlocks = [];
              for (const q of questions) {
                mod.contentBlocks.push({
                  type: 'multipleChoice',
                  question: q.question,
                  options: q.options,
                  explanation: q.explanation,
                  accessibility: { ariaLabel: 'Knowledge check', announceCorrect: true }
                });
                courseExtracted++;
              }
              courseModified = true;
            }
          }
        }
      }
    }

    // Build/supplement assessment from extracted questions
    if (courseExtracted > 0) {
      const existingAssessment = course.assessment?.questions || [];
      const existingQTexts = new Set(existingAssessment.map(q => q.question));
      
      // Gather all extracted questions across modules
      const allExtracted = [];
      for (const mod of modules) {
        for (const block of (mod.contentBlocks || [])) {
          if (block.type === 'multipleChoice' && block.source === 'extracted_from_static_html') {
            if (!existingQTexts.has(block.question)) {
              allExtracted.push({
                question: block.question,
                type: 'multiple_choice',
                options: block.options.map(o => typeof o === 'string' ? o : o.text),
                correctAnswer: block.options.findIndex(o => o.isCorrect),
                explanation: block.explanation
              });
            }
            // Remove the source marker
            delete block.source;
          }
        }
      }
      
      // Add to assessment if it needs more questions
      if (existingAssessment.length < 15 && allExtracted.length > 0) {
        const combined = [...existingAssessment, ...allExtracted];
        course.assessment = {
          questions: combined.slice(0, 25),
          passingScore: course.assessment?.passingScore || 80,
          maxAttempts: course.assessment?.maxAttempts || 3
        };
        totalAssessmentAdded += allExtracted.length;
      }
    }

    // Save if modified
    if (courseModified) {
      await collection.updateOne(
        { _id: course._id },
        { 
          $set: { 
            modules,
            assessment: course.assessment,
            updatedAt: new Date(),
            quizzesExtracted: true
          } 
        }
      );
      
      const assessQs = course.assessment?.questions?.length || 0;
      console.log(`  ✅ ${slug}: extracted ${courseExtracted} static quizzes → interactive blocks (${assessQs} assessment Qs total)`);
      coursesFixed++;
      totalExtracted += courseExtracted;
    }
  }

  // Also scan the old courses collection
  console.log('\n' + '─'.repeat(70));
  console.log('  Scanning old courses collection...\n');
  
  const oldCollection = db.collection('courses');
  const oldCourses = await oldCollection.find({}).toArray();
  let oldFixed = 0;
  
  for (const course of oldCourses) {
    const slug = course.slug || '';
    const modules = course.modules || [];
    let modified = false;
    let extracted = 0;
    
    for (const mod of modules) {
      for (const lesson of (mod.lessons || [])) {
        if (lesson.content && hasStaticQuizContent(lesson.content)) {
          const { questions, cleanedContent } = extractQuizFromHtml(lesson.content);
          if (questions.length > 0) {
            lesson.content = cleanedContent;
            // Store extracted questions in a separate field
            if (!lesson.extractedQuestions) lesson.extractedQuestions = [];
            lesson.extractedQuestions.push(...questions);
            modified = true;
            extracted += questions.length;
          }
        }
      }
    }
    
    if (modified) {
      await oldCollection.updateOne(
        { _id: course._id },
        { $set: { modules, quizzesExtracted: true, updatedAt: new Date() } }
      );
      console.log(`  ✅ [old] ${slug}: cleaned ${extracted} static quizzes from text`);
      oldFixed++;
      totalExtracted += extracted;
    }
  }

  // Summary
  console.log('\n' + '═'.repeat(70));
  console.log('  EXTRACTION SUMMARY');
  console.log('═'.repeat(70));
  console.log(`  Courses fixed (interactive): ${coursesFixed}`);
  console.log(`  Courses fixed (old):         ${oldFixed}`);
  console.log(`  Total quizzes extracted:      ${totalExtracted}`);
  console.log(`  Assessment questions added:   ${totalAssessmentAdded}`);
  console.log('═'.repeat(70) + '\n');

  await mongoose.disconnect();
}

main().catch(err => {
  console.error('❌ Fatal:', err.message);
  process.exit(1);
});
