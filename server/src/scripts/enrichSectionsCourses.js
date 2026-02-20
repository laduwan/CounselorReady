/**
 * enrichSectionsCourses.js
 * 
 * Fixes courses that have sections[] with only sectionDivider + text blocks.
 * Parses textContent HTML to:
 * 1. Extract embedded quiz questions → multipleChoice contentBlocks
 * 2. Build assessment from extracted questions
 * 3. Remove static quiz text from original text blocks
 * 
 * Run: node src/scripts/enrichSectionsCourses.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/counselorready';

// ── Quiz Extraction Patterns ──────────────────────────────────────

function extractQuizzesFromHTML(html) {
  if (!html || typeof html !== 'string') return { cleanedHTML: html, questions: [] };
  
  const questions = [];
  let cleanedHTML = html;

  // Pattern 1: Numbered questions with lettered options and "Correct Answer:" line
  // e.g., "1. What is CBT?\nA) Therapy\nB) Medicine\nCorrect Answer: A"
  const numberedPattern = /(?:<[^>]*>)*\s*(\d+)\.\s*(.*?)(?:<[^>]*>)*\s*(?:<[^>]*>)*\s*[Aa]\)?\.?\s*(.*?)(?:<[^>]*>)*\s*(?:<[^>]*>)*\s*[Bb]\)?\.?\s*(.*?)(?:<[^>]*>)*\s*(?:<[^>]*>)*\s*[Cc]\)?\.?\s*(.*?)(?:<[^>]*>)*\s*(?:<[^>]*>)*\s*[Dd]\)?\.?\s*(.*?)(?:<[^>]*>)*\s*(?:<[^>]*>)*\s*(?:Correct\s*Answer|Answer):\s*([A-Da-d])(?:\s*[).]?\s*[—–-]?\s*(.*?))?(?=(?:<[^>]*>)*\s*(?:\d+\.|<h[23]|Comprehensive\s*Final|$))/gis;
  
  let match;
  const matchedTexts = [];
  
  while ((match = numberedPattern.exec(html)) !== null) {
    const questionText = stripTags(match[2]).trim();
    const optA = stripTags(match[3]).trim();
    const optB = stripTags(match[4]).trim();
    const optC = stripTags(match[5]).trim();
    const optD = stripTags(match[6]).trim();
    const correctLetter = match[7].toUpperCase();
    const explanation = match[8] ? stripTags(match[8]).trim() : '';
    
    if (questionText.length > 10 && optA && optB && optC && optD) {
      const correctIdx = 'ABCD'.indexOf(correctLetter);
      questions.push({
        question: questionText,
        options: [optA, optB, optC, optD].map((text, idx) => ({
          text,
          isCorrect: idx === correctIdx
        })),
        explanation: explanation || `The correct answer is ${correctLetter}.`,
        type: 'multipleChoice'
      });
      matchedTexts.push(match[0]);
    }
  }

  // Pattern 2: <strong>Question N.</strong> or <b>Question N.</b> format
  const strongPattern = /<(?:strong|b)>\s*Question\s*(\d+)\.?\s*<\/(?:strong|b)>\s*(.*?)(?:<[^>]*>)*\s*[Aa]\)?\.?\s*(.*?)(?:<[^>]*>)*\s*[Bb]\)?\.?\s*(.*?)(?:<[^>]*>)*\s*[Cc]\)?\.?\s*(.*?)(?:<[^>]*>)*\s*[Dd]\)?\.?\s*(.*?)(?:<[^>]*>)*\s*(?:Correct\s*Answer|Answer):\s*([A-Da-d])(?:\s*[).]?\s*[—–-]?\s*(.*?))?(?=(?:<[^>]*>)*\s*(?:<(?:strong|b)>|Question|Comprehensive|$))/gis;
  
  while ((match = strongPattern.exec(html)) !== null) {
    const questionText = stripTags(match[2]).trim();
    const optA = stripTags(match[3]).trim();
    const optB = stripTags(match[4]).trim();
    const optC = stripTags(match[5]).trim();
    const optD = stripTags(match[6]).trim();
    const correctLetter = match[7].toUpperCase();
    const explanation = match[8] ? stripTags(match[8]).trim() : '';
    
    if (questionText.length > 10 && optA && optB && optC && optD) {
      // Check for duplicate
      const isDupe = questions.some(q => q.question === questionText);
      if (!isDupe) {
        const correctIdx = 'ABCD'.indexOf(correctLetter);
        questions.push({
          question: questionText,
          options: [optA, optB, optC, optD].map((text, idx) => ({
            text,
            isCorrect: idx === correctIdx
          })),
          explanation: explanation || `The correct answer is ${correctLetter}.`,
          type: 'multipleChoice'
        });
        matchedTexts.push(match[0]);
      }
    }
  }

  // Pattern 3: Simple "Knowledge Check" header followed by questions
  const kcHeaderPattern = /<h[23][^>]*>\s*(?:Knowledge\s*Check|Module\s*(?:Quiz|Assessment)|Check\s*Your\s*(?:Understanding|Knowledge))\s*<\/h[23]>/gi;
  
  // Remove matched quiz text from HTML
  for (const txt of matchedTexts) {
    cleanedHTML = cleanedHTML.replace(txt, '');
  }
  
  // Also remove "Comprehensive Final Examination" header + intro text
  cleanedHTML = cleanedHTML.replace(/<h[23][^>]*>\s*Comprehensive\s*Final\s*Exam(?:ination)?\s*<\/h[23]>[\s\S]*?(?=<h[23]|$)/gi, '');
  
  // Remove "Knowledge Check" headers that are now orphaned
  cleanedHTML = cleanedHTML.replace(kcHeaderPattern, '');
  
  // Clean up empty paragraphs
  cleanedHTML = cleanedHTML.replace(/<p>\s*<\/p>/g, '');
  cleanedHTML = cleanedHTML.replace(/\n{3,}/g, '\n\n');
  
  return { cleanedHTML, questions };
}

function stripTags(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
}

// ── Main Enrichment ───────────────────────────────────────────────

async function enrichCourses() {
  console.log('══════════════════════════════════════════════════════════════');
  console.log('  ENRICH SECTIONS-BASED COURSES');
  console.log('  Extract static quizzes → interactive blocks + assessments');
  console.log('══════════════════════════════════════════════════════════════\n');
  
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB\n');
  
  const db = mongoose.connection.db;
  const collection = db.collection('interactivecourses');
  const allCourses = await collection.find({}).toArray();
  
  let coursesFixed = 0;
  let totalQuestionsExtracted = 0;
  let totalAssessmentsBuilt = 0;
  
  for (const course of allCourses) {
    if (!course.sections || course.sections.length === 0) continue;
    
    // Check if this course needs enrichment
    const blockTypes = {};
    let totalBlocks = 0;
    course.sections.forEach(s => (s.contentBlocks || []).forEach(b => {
      blockTypes[b.type] = (blockTypes[b.type] || 0) + 1;
      totalBlocks++;
    }));
    
    // Skip courses that already have interactive elements (trauma, neuro, suicide-risk)
    const hasInteractive = blockTypes.multipleChoice || blockTypes.multiSelect || 
                           blockTypes.matching || blockTypes.accordion || blockTypes.imageText;
    if (hasInteractive) {
      continue;
    }
    
    // This course only has sectionDivider + text — needs enrichment
    let courseQuestionsExtracted = 0;
    const allExtractedQuestions = [];
    
    for (let si = 0; si < course.sections.length; si++) {
      const section = course.sections[si];
      if (!section.contentBlocks) continue;
      
      const newBlocks = [];
      
      for (let bi = 0; bi < section.contentBlocks.length; bi++) {
        const block = section.contentBlocks[bi];
        
        if (block.type === 'text' && block.textContent) {
          const { cleanedHTML, questions } = extractQuizzesFromHTML(block.textContent);
          
          // Update the text block with cleaned content
          block.textContent = cleanedHTML;
          newBlocks.push(block);
          
          // Add extracted questions as interactive blocks
          for (const q of questions) {
            newBlocks.push({
              type: 'multipleChoice',
              order: newBlocks.length,
              question: q.question,
              options: q.options,
              explanation: q.explanation,
              feedbackCorrect: 'Correct! ' + q.explanation,
              feedbackIncorrect: 'Not quite. ' + q.explanation
            });
            courseQuestionsExtracted++;
            allExtractedQuestions.push(q);
          }
        } else {
          newBlocks.push(block);
        }
      }
      
      // Reorder blocks
      newBlocks.forEach((b, i) => b.order = i);
      course.sections[si].contentBlocks = newBlocks;
    }
    
    // Build/supplement assessment from extracted questions
    const currentAssessmentQs = course.assessment?.questions?.length || 0;
    
    if (allExtractedQuestions.length > 0 || currentAssessmentQs < 15) {
      if (!course.assessment) {
        course.assessment = { questions: [], passThreshold: 0.8, maxAttempts: 3 };
      }
      
      // Use extracted questions for assessment (pick up to 15, spread across sections)
      const availableForAssessment = allExtractedQuestions.filter(q => 
        !course.assessment.questions.some(existing => 
          existing.question === q.question || existing.text === q.question
        )
      );
      
      const needed = Math.max(0, 15 - currentAssessmentQs);
      const toAdd = availableForAssessment.slice(0, needed);
      
      for (const q of toAdd) {
        course.assessment.questions.push({
          text: q.question,
          question: q.question,
          type: 'multipleChoice',
          options: q.options,
          explanation: q.explanation,
          correctAnswer: q.options.findIndex(o => o.isCorrect)
        });
        totalAssessmentsBuilt++;
      }
    }
    
    if (courseQuestionsExtracted > 0 || totalAssessmentsBuilt > 0) {
      // Save to database
      const updateOp = {};
      updateOp["$set"] = {
        sections: course.sections,
        assessment: course.assessment,
        updatedAt: new Date()
      };
      
      await collection.updateOne({ _id: course._id }, updateOp);
      
      const newAssessmentTotal = course.assessment?.questions?.length || 0;
      console.log(`  ✅ ${course.slug}`);
      console.log(`     Extracted ${courseQuestionsExtracted} quiz Qs → interactive blocks`);
      console.log(`     Assessment: ${currentAssessmentQs} → ${newAssessmentTotal} questions`);
      coursesFixed++;
      totalQuestionsExtracted += courseQuestionsExtracted;
    } else {
      // No quizzes found in text, but course still needs assessment
      // Check if textContent has any content at all
      let hasContent = false;
      course.sections.forEach(s => (s.contentBlocks || []).forEach(b => {
        if (b.textContent && b.textContent.length > 100) hasContent = true;
      }));
      
      if (hasContent) {
        console.log(`  ⚠️  ${course.slug}: has content but no extractable quizzes`);
      }
    }
  }
  
  console.log('\n══════════════════════════════════════════════════════════════');
  console.log('  ENRICHMENT SUMMARY');
  console.log('══════════════════════════════════════════════════════════════');
  console.log(`  Courses enriched:     ${coursesFixed}`);
  console.log(`  Quizzes extracted:    ${totalQuestionsExtracted}`);
  console.log(`  Assessment Qs added:  ${totalAssessmentsBuilt}`);
  console.log('══════════════════════════════════════════════════════════════\n');
  
  await mongoose.disconnect();
}

enrichCourses().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
