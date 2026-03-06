/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * enrichSectionsCourses.js - v2 (fixed regex backtracking)
 * 
 * Parses textContent in sections-based courses to extract
 * embedded quiz questions into interactive multipleChoice blocks.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/counselorready';

function stripTags(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
}

function extractQuizzesFromText(textContent) {
  if (!textContent || typeof textContent !== 'string') return { cleaned: textContent, questions: [] };
  
  const questions = [];
  const lines = textContent.split('\n');
  const outputLines = [];
  let i = 0;
  
  while (i < lines.length) {
    const line = stripTags(lines[i]).trim();
    
    // Check for numbered question: "1. question text" or "Question 1. text"
    const qMatch = line.match(/^(?:Question\s+)?(\d+)[\.\)]\s+(.{15,})/i);
    
    if (qMatch) {
      const qText = qMatch[2];
      
      // Look ahead for A) B) C) D) options
      let optA = '', optB = '', optC = '', optD = '';
      let correctLetter = '';
      let explanation = '';
      let linesConsumed = 0;
      
      // Scan next lines for options and answer
      for (let j = i + 1; j < Math.min(i + 12, lines.length); j++) {
        const l = stripTags(lines[j]).trim();
        if (l.match(/^[Aa][\)\.]?\s/)) optA = l.replace(/^[Aa][\)\.]?\s*/, '');
        else if (l.match(/^[Bb][\)\.]?\s/)) optB = l.replace(/^[Bb][\)\.]?\s*/, '');
        else if (l.match(/^[Cc][\)\.]?\s/)) optC = l.replace(/^[Cc][\)\.]?\s*/, '');
        else if (l.match(/^[Dd][\)\.]?\s/)) optD = l.replace(/^[Dd][\)\.]?\s*/, '');
        else if (l.match(/^Correct\s*Answer/i)) {
          const aMatch = l.match(/(?:Correct\s*Answer)\s*:?\s*([A-Da-d])/i);
          if (aMatch) correctLetter = aMatch[1].toUpperCase();
          const expMatch = l.match(/[—–-]\s*(.+)/);
          if (expMatch) explanation = expMatch[1].trim();
          linesConsumed = j - i;
          // Check if next line is also explanation
          if (j + 1 < lines.length) {
            const nextL = stripTags(lines[j + 1]).trim();
            if (nextL.match(/^Explanation:/i)) {
              explanation = nextL.replace(/^Explanation:\s*/i, '');
              linesConsumed = j + 1 - i;
            }
          }
          break;
        }
        linesConsumed = j - i;
      }
      
      if (optA && optB && optC && optD && correctLetter) {
        const correctIdx = 'ABCD'.indexOf(correctLetter);
        questions.push({
          question: qText,
          options: [optA, optB, optC, optD].map((text, idx) => ({
            text,
            isCorrect: idx === correctIdx
          })),
          explanation: explanation || 'The correct answer is ' + correctLetter + '.'
        });
        i += linesConsumed + 1;
        continue;
      }
    }
    
    // Check for inline format: "1. question A) opt B) opt C) opt D) opt Correct Answer: X"
    const inlineMatch = line.match(/^(\d+)[\.\)]\s+(.+?)\s+[Aa]\)\s+(.+?)\s+[Bb]\)\s+(.+?)\s+[Cc]\)\s+(.+?)\s+[Dd]\)\s+(.+?)(?:\s+Correct\s*Answer:\s*([A-Da-d]))?/i);
    if (inlineMatch && inlineMatch[7]) {
      const correctIdx = 'ABCD'.indexOf(inlineMatch[7].toUpperCase());
      questions.push({
        question: inlineMatch[2],
        options: [inlineMatch[3], inlineMatch[4], inlineMatch[5], inlineMatch[6]].map((text, idx) => ({
          text: text.trim(),
          isCorrect: idx === correctIdx
        })),
        explanation: 'The correct answer is ' + inlineMatch[7].toUpperCase() + '.'
      });
      i++;
      continue;
    }
    
    // Skip "Comprehensive Final Examination" headers and intro
    if (line.match(/^Comprehensive\s*Final\s*Exam/i)) {
      i++;
      // Skip the intro line too
      if (i < lines.length && stripTags(lines[i]).match(/Complete the following/i)) i++;
      continue;
    }
    
    // Skip "Knowledge Check" headers
    if (line.match(/^Knowledge\s*Check/i) || line.match(/^Module\s*(?:Quiz|Assessment)/i)) {
      i++;
      continue;
    }
    
    outputLines.push(lines[i]);
    i++;
  }
  
  return { cleaned: outputLines.join('\n'), questions };
}

async function enrichCourses() {
  console.log('══════════════════════════════════════════════════════════════');
  console.log('  ENRICH SECTIONS-BASED COURSES v2');
  console.log('══════════════════════════════════════════════════════════════\n');
  
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB\n');
  
  const db = mongoose.connection.db;
  const collection = db.collection('interactivecourses');
  const allCourses = await collection.find({}).toArray();
  
  let coursesFixed = 0;
  let totalQsExtracted = 0;
  let totalAssessmentAdded = 0;
  
  for (const course of allCourses) {
    if (!course.sections || course.sections.length === 0) continue;
    
    // Skip courses that already have interactive elements
    let hasInteractive = false;
    course.sections.forEach(s => (s.contentBlocks || []).forEach(b => {
      if (['multipleChoice', 'multiSelect', 'matching', 'imageText', 'accordion'].includes(b.type)) {
        hasInteractive = true;
      }
    }));
    if (hasInteractive) continue;
    
    let courseQs = 0;
    const allQuestions = [];
    
    for (let si = 0; si < course.sections.length; si++) {
      const section = course.sections[si];
      if (!section.contentBlocks) continue;
      
      const newBlocks = [];
      for (const block of section.contentBlocks) {
        if (block.type === 'text' && block.textContent && block.textContent.length > 100) {
          const { cleaned, questions } = extractQuizzesFromText(block.textContent);
          block.textContent = cleaned;
          newBlocks.push(block);
          
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
            courseQs++;
            allQuestions.push(q);
          }
        } else {
          newBlocks.push(block);
        }
      }
      newBlocks.forEach((b, idx) => b.order = idx);
      course.sections[si].contentBlocks = newBlocks;
    }
    
    // Build assessment
    const currentAQs = course.assessment?.questions?.length || 0;
    if (!course.assessment) {
      course.assessment = { questions: [], passThreshold: 0.8, maxAttempts: 3 };
    }
    
    const needed = Math.max(0, 15 - currentAQs);
    const toAdd = allQuestions.slice(0, needed);
    for (const q of toAdd) {
      course.assessment.questions.push({
        text: q.question,
        question: q.question,
        type: 'multipleChoice',
        options: q.options,
        explanation: q.explanation,
        correctAnswer: q.options.findIndex(o => o.isCorrect)
      });
      totalAssessmentAdded++;
    }
    
    if (courseQs > 0) {
      const op = {};
      op["$set"] = { sections: course.sections, assessment: course.assessment, updatedAt: new Date() };
      await collection.updateOne({ _id: course._id }, op);
      console.log('  ✅', course.slug, '|', courseQs, 'quizzes extracted |', 'assessment:', currentAQs, '->', course.assessment.questions.length);
      coursesFixed++;
      totalQsExtracted += courseQs;
    } else {
      console.log('  ⚠️ ', course.slug, '| no extractable quizzes found | assessment:', currentAQs);
    }
  }
  
  console.log('\n══════════════════════════════════════════════════════════════');
  console.log('  Courses fixed:', coursesFixed);
  console.log('  Quizzes extracted:', totalQsExtracted);
  console.log('  Assessment Qs added:', totalAssessmentAdded);
  console.log('══════════════════════════════════════════════════════════════\n');
  
  await mongoose.disconnect();
}

enrichCourses().catch(err => { console.error('Error:', err.message); process.exit(1); });
