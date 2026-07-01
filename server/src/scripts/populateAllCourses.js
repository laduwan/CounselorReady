/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
#!/usr/bin/env node
/**
 * populateAllCourses.js
 * 
 * Reads .md course files from ./courseMarkdown/ folder,
 * parses them, and upserts into MongoDB courses collection.
 * 
 * Place in: server/src/scripts/populateAllCourses.js
 * Place .md files in: server/src/scripts/courseMarkdown/
 * 
 * Run: node src/scripts/populateAllCourses.js
 */

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

const __script_filename = fileURLToPath(import.meta.url);
const __script_dirname = path.dirname(__script_filename);

// ─── Markdown Parser ───

function parseMarkdownCourse(content, filename) {
  const course = {
    title: '',
    description: '',
    ceHours: 0,
    credits: 0,
    targetAudience: [],
    objectives: [],
    level: 'Intermediate',
    contentArea: 'Clinical Practice',
    deliveryMethod: 'online',
    modules: [],
    assessment: { questions: [], passThreshold: 0.80 },
    references: [],
    isPublished: false,
    status: 'draft',
    acepProvider: {
      name: 'GA Integrated Therapeutic Perspectives LLC',
      number: '7760'
    },
    presenter: {
      name: 'CounselorReady',
      credentials: 'NBCC ACEP #7760',
      qualificationStatement: 'Content developed by licensed mental health professionals.'
    }
  };

  const lines = content.split('\n');

  // ── Extract title ──
  const titleLine = lines.find(l => l.startsWith('# '));
  if (titleLine) {
    course.title = titleLine.replace(/^#\s*/, '').replace(/^Course:\s*/i, '').trim();
  }

  // ── Extract CE hours ──
  // Priority 1: Explicit metadata fields
  const metadataPatterns = [
    /\*\*(?:Course Hours|Credit Hours|Credits?):\*\*\s*(\d+(?:\.\d+)?)/i,
    /Course Hours:\*?\*?\s*(\d+(?:\.\d+)?)/i,
    /Credit Hours:\*?\*?\s*(\d+(?:\.\d+)?)/i,
  ];
  for (const p of metadataPatterns) {
    const m = content.match(p);
    if (m) {
      course.ceHours = parseFloat(m[1]);
      course.credits = course.ceHours;
      break;
    }
  }
  // Priority 2: "X CE Hours" pattern in header area (first 500 chars)
  if (course.ceHours === 0) {
    const header = content.substring(0, 500);
    const headerMatch = header.match(/(\d+(?:\.\d+)?)\s*(?:CE\s*)?Hours?/i);
    if (headerMatch) {
      course.ceHours = parseFloat(headerMatch[1]);
      course.credits = course.ceHours;
    }
  }
  // Priority 3: "X Continuing Education Hours" anywhere
  if (course.ceHours === 0) {
    const ceMatch = content.match(/(\d+(?:\.\d+)?)\s*Continuing\s*Education\s*Hours?/i);
    if (ceMatch) {
      course.ceHours = parseFloat(ceMatch[1]);
      course.credits = course.ceHours;
    }
  }
  // Priority 4: Semester hours (for CACREP courses)
  if (course.ceHours === 0) {
    const semMatch = content.match(/(\d+)\s*Semester\s*Hours?/i);
    if (semMatch) {
      course.ceHours = parseFloat(semMatch[1]);
      course.credits = course.ceHours;
    }
  }

  // ── Extract description ──
  const descMatch = content.match(/\*\*Course Description:\*\*\s*([\s\S]*?)(?=\n\n|\n\*\*)/);
  if (descMatch) {
    course.description = descMatch[1].trim();
  } else {
    const descSection = extractSection(content, 'Course Description');
    if (descSection) course.description = cleanText(descSection).substring(0, 2000);
  }

  // ── Extract target audience ──
  const audMatch = content.match(/\*\*Target Audience:\*\*\s*(.*)/i);
  if (audMatch) {
    course.targetAudience = audMatch[1].split(/,|;/).map(s => s.trim()).filter(Boolean);
  }

  // ── Extract learning objectives ──
  const objSection = extractSection(content, 'LEARNING OBJECTIVES|Learning Objectives');
  if (objSection) {
    const objLines = objSection.match(/^\d+\.\s+.+$/gm) || [];
    course.objectives = objLines.map(l => l.replace(/^\d+\.\s+/, '').replace(/\*\*/g, '').trim());
  }

  // ── Extract level ──
  const levelMatch = content.match(/Course Level:\*?\*?\s*(.+)/i) || content.match(/Instructional Level:\*?\*?\s*(.+)/i);
  if (levelMatch) course.level = levelMatch[1].trim();

  // ── Extract content area ──
  const areaMatch = content.match(/Content Area:\*?\*?\s*(.+)/i);
  if (areaMatch) course.contentArea = areaMatch[1].trim();

  // ── Parse modules ──
  // Look for MODULE headings: ### MODULE 1:, # MODULE 1:, ## MODULE 1:
  const moduleRegex = /^#{1,3}\s*(?:MODULE\s*(\d+):?\s*)(.*?)$/gim;
  const moduleHeaders = [];
  let mm;
  while ((mm = moduleRegex.exec(content)) !== null) {
    moduleHeaders.push({
      num: parseInt(mm[1]),
      title: mm[2].trim().replace(/\(.*?\)\s*$/, '').trim(),
      index: mm.index
    });
  }

  // If no MODULE headers, try ### sections as modules
  if (moduleHeaders.length === 0) {
    const sectionRegex = /^###\s+(?:SECTION\s*(\d+):?\s*)?(.*?)$/gim;
    let sIdx = 1;
    while ((mm = sectionRegex.exec(content)) !== null) {
      const title = mm[2].trim();
      // Skip non-content sections
      if (/POST-TEST|ANSWER KEY|BIBLIOGRAPHY|REFERENCES|EVALUATION|SUPPLEMENTAL|COURSE INFORMATION|LEARNING OBJ/i.test(title)) continue;
      moduleHeaders.push({
        num: mm[1] ? parseInt(mm[1]) : sIdx++,
        title: title.replace(/\(.*?\)\s*$/, '').trim(),
        index: mm.index
      });
    }
  }

  // Extract content for each module
  moduleHeaders.forEach((mod, i) => {
    const nextMod = moduleHeaders[i + 1];
    // Find end boundary: next module, or POST-TEST, or BIBLIOGRAPHY
    let endIdx = content.length;
    if (nextMod) endIdx = nextMod.index;
    
    // Also check for POST-TEST or BIBLIOGRAPHY before next module
    const postTestIdx = content.indexOf('POST-TEST', mod.index + 10);
    const biblioIdx = content.indexOf('BIBLIOGRAPHY', mod.index + 10);
    const refsIdx = content.indexOf('## REFERENCES', mod.index + 10);
    const evalIdx = content.indexOf('COURSE EVALUATION', mod.index + 10);
    
    [postTestIdx, biblioIdx, refsIdx, evalIdx].forEach(idx => {
      if (idx > mod.index && idx < endIdx) endIdx = idx;
    });

    const moduleContent = content.substring(mod.index, endIdx);
    
    // Split module into sub-sections for lessons
    const subSections = splitIntoLessons(moduleContent, mod.title);
    
    // Extract knowledge checks from this module
    const quizQuestions = extractKnowledgeChecks(moduleContent);

    course.modules.push({
      title: mod.title || `Module ${mod.num}`,
      order: mod.num,
      lessons: subSections.map((lesson, lIdx) => ({
        title: lesson.title,
        content: markdownToHtml(lesson.content),
        textContent: cleanText(lesson.content),
        order: lIdx + 1,
        type: 'text'
      })),
      quiz: {
        title: `Module ${mod.num} Knowledge Check`,
        questions: quizQuestions,
        passingScore: 0.80
      }
    });
  });

  // ── Extract post-test / final assessment ──
  const postTestSection = extractSection(content, 'POST-TEST QUESTIONS|POST-TEST|FINAL ASSESSMENT|Final Comprehensive Assessment');
  if (postTestSection) {
    course.assessment.questions = parseMultipleChoiceQuestions(postTestSection, content);
    course.assessment.passThreshold = 0.80;
  }

  // ── Extract answer key ──
  const answerKeySection = extractSection(content, 'POST-TEST ANSWER KEY|ANSWER KEY');
  if (answerKeySection && course.assessment.questions.length > 0) {
    applyAnswerKey(course.assessment.questions, answerKeySection);
  }

  // ── Extract references ──
  const refSection = extractSection(content, 'BIBLIOGRAPHY|REFERENCES|References');
  if (refSection) {
    course.references = refSection
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 20 && !l.startsWith('#') && !l.startsWith('---'));
  }

  // ── Calculate word count ──
  const totalWords = countCourseWords(course);
  course._wordCount = totalWords;
  course._requiredWords = course.ceHours * 6000;
  course._meetsWordCount = totalWords >= (course.ceHours * 6000);

  return course;
}

// ─── Helper Functions ───

function extractSection(content, headerPattern) {
  const regex = new RegExp(`^#{1,3}\\s*(?:${headerPattern}).*$`, 'im');
  const match = regex.exec(content);
  if (!match) return null;

  const startIdx = match.index + match[0].length;
  // Find next heading of same or higher level
  const headingLevel = (match[0].match(/^#+/) || ['##'])[0].length;
  const nextHeading = new RegExp(`^#{1,${headingLevel}}\\s+`, 'm');
  const remaining = content.substring(startIdx);
  const endMatch = nextHeading.exec(remaining);
  const endIdx = endMatch ? startIdx + endMatch.index : content.length;

  return content.substring(startIdx, endIdx).trim();
}

function splitIntoLessons(moduleContent, moduleTitle) {
  const lessons = [];
  // Split by ### or #### sub-headings
  const subRegex = /^#{3,4}\s+(.+)$/gm;
  const subHeaders = [];
  let sm;
  while ((sm = subRegex.exec(moduleContent)) !== null) {
    const title = sm[1].trim();
    if (/Knowledge Check|Quiz|Post-Test/i.test(title)) continue;
    subHeaders.push({ title, index: sm.index, length: sm[0].length });
  }

  if (subHeaders.length > 0) {
    subHeaders.forEach((sub, i) => {
      const start = sub.index + sub.length;
      const end = subHeaders[i + 1] ? subHeaders[i + 1].index : moduleContent.length;
      const lessonContent = moduleContent.substring(start, end).trim();
      if (lessonContent.length > 50) {
        lessons.push({ title: sub.title.replace(/\(.*?\)\s*$/, '').trim(), content: lessonContent });
      }
    });
  }

  // If no sub-sections found, make the whole module one lesson
  if (lessons.length === 0) {
    // Remove the module heading line
    const contentWithoutHeading = moduleContent.replace(/^#{1,3}\s+.+\n/, '').trim();
    if (contentWithoutHeading.length > 50) {
      lessons.push({ title: moduleTitle, content: contentWithoutHeading });
    }
  }

  return lessons;
}

function extractKnowledgeChecks(moduleContent) {
  const questions = [];
  
  // Look for knowledge check section
  const kcMatch = moduleContent.match(/#{2,4}\s*(?:Knowledge Check|Module.*Knowledge Check|🧪.*Knowledge Check|Quiz)/i);
  if (!kcMatch) return questions;
  
  const kcContent = moduleContent.substring(kcMatch.index);
  
  // Try to parse numbered questions with options
  const qRegex = /\*?\*?(\d+)\.\s*\*?\*?\s*(.*?\?)\*?\*?\s*\n((?:\s*[a-d]\)\s*.+\n?)+)/gi;
  let qm;
  while ((qm = qRegex.exec(kcContent)) !== null) {
    const questionText = qm[2].replace(/\*\*/g, '').trim();
    const optionsRaw = qm[3];
    const options = [];
    const optRegex = /([a-d])\)\s*(.+)/gi;
    let om;
    while ((om = optRegex.exec(optionsRaw)) !== null) {
      options.push({ text: om[2].trim(), isCorrect: false });
    }
    questions.push({ question: questionText, options, explanation: '' });
  }

  // Also try open-ended knowledge check questions
  if (questions.length === 0) {
    const openRegex = /^\d+\.\s+(.+\?)\s*$/gm;
    let om;
    while ((om = openRegex.exec(kcContent)) !== null) {
      if (questions.length >= 5) break;
      questions.push({
        question: om[1].replace(/\*\*/g, '').trim(),
        options: [],
        explanation: ''
      });
    }
  }

  return questions;
}

function parseMultipleChoiceQuestions(section, fullContent) {
  const questions = [];
  
  // Match: **1. Question text**\n a) option\n b) option...
  const qRegex = /\*?\*?(\d+)\.\s*(.*?\?)\*?\*?\s*\n((?:\s*[a-d]\)\s*.+\n?)+)/gi;
  let qm;
  while ((qm = qRegex.exec(section)) !== null) {
    const questionText = qm[2].replace(/\*\*/g, '').trim();
    const optionsRaw = qm[3];
    const options = [];
    const optRegex = /([a-d])\)\s*(.+)/gi;
    let om;
    while ((om = optRegex.exec(optionsRaw)) !== null) {
      options.push({
        text: om[2].trim(),
        isCorrect: false,
        letter: om[1].toUpperCase()
      });
    }
    questions.push({
      question: questionText,
      options,
      explanation: '',
      _num: parseInt(qm[1])
    });
  }

  return questions;
}

function applyAnswerKey(questions, answerKeyContent) {
  // Parse answer key: 1. **B** - explanation
  const akRegex = /(\d+)\.\s*\*?\*?([A-D])\*?\*?\s*[-–—]\s*(.*)/gi;
  let am;
  while ((am = akRegex.exec(answerKeyContent)) !== null) {
    const qNum = parseInt(am[1]);
    const correctLetter = am[2].toUpperCase();
    const explanation = am[3].trim();
    
    const question = questions.find(q => q._num === qNum);
    if (question) {
      question.explanation = explanation;
      question.options.forEach(opt => {
        if (opt.letter === correctLetter) opt.isCorrect = true;
      });
    }
  }

  // Clean up temp fields
  questions.forEach(q => {
    delete q._num;
    q.options.forEach(o => delete o.letter);
  });
}

function markdownToHtml(md) {
  if (!md) return '';
  return md
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Headers (within lesson content)
    .replace(/^####\s+(.+)$/gm, '<h4>$1</h4>')
    .replace(/^###\s+(.+)$/gm, '<h3>$1</h3>')
    // Bullet lists
    .replace(/^[-*]\s+(.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    // Numbered lists
    .replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
    // Paragraphs (double newline)
    .replace(/\n\n+/g, '</p><p>')
    // Single newlines within paragraphs
    .replace(/\n/g, ' ')
    // Wrap in paragraph
    .replace(/^/, '<p>')
    .replace(/$/, '</p>')
    // Clean up empty paragraphs
    .replace(/<p>\s*<\/p>/g, '')
    .replace(/<p>\s*<(h[34])/g, '<$1')
    .replace(/<\/h[34]>\s*<\/p>/g, match => match.replace('</p>', ''))
    .trim();
}

function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/#{1,4}\s*/g, '')
    .replace(/\[.*?\]\(.*?\)/g, '')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function countCourseWords(course) {
  let total = 0;
  total += countWords(course.description);
  (course.modules || []).forEach(m => {
    (m.lessons || []).forEach(l => {
      total += countWords(l.textContent || l.content);
    });
    if (m.quiz) {
      (m.quiz.questions || []).forEach(q => {
        total += countWords(q.question);
        (q.options || []).forEach(o => total += countWords(o.text));
        total += countWords(q.explanation);
      });
    }
  });
  if (course.assessment) {
    (course.assessment.questions || []).forEach(q => {
      total += countWords(q.question);
      (q.options || []).forEach(o => total += countWords(o.text));
      total += countWords(q.explanation);
    });
  }
  return total;
}

function countWords(text) {
  if (!text || typeof text !== 'string') return 0;
  const clean = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return clean ? clean.split(/\s+/).length : 0;
}

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}

// ─── Database Operations ───

async function upsertCourse(db, courseData) {
  const collection = db.collection('courses');
  
  // Try to find existing course by exact or fuzzy title match
  let existing = await collection.findOne({ title: courseData.title });
  
  // Try partial match if exact not found
  if (!existing) {
    // Extract core title words for matching
    const coreWords = courseData.title
      .replace(/[^a-zA-Z\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3)
      .slice(0, 4);
    
    if (coreWords.length >= 2) {
      const regex = new RegExp(coreWords.join('.*'), 'i');
      existing = await collection.findOne({ title: { $regex: regex } });
    }
  }

  if (existing) {
    // Update existing course with content
    const updateData = {};
    
    // Always update content
    if (courseData.modules.length > 0) updateData.modules = courseData.modules;
    if (courseData.assessment.questions.length > 0) updateData.assessment = courseData.assessment;
    if (courseData.references.length > 0) updateData.references = courseData.references;
    
    // Update metadata only if currently empty
    if (!existing.description && courseData.description) updateData.description = courseData.description;
    if (!existing.ceHours && courseData.ceHours) {
      updateData.ceHours = courseData.ceHours;
      updateData.credits = courseData.ceHours;
    }
    if ((!existing.objectives || existing.objectives.length === 0) && courseData.objectives.length > 0) {
      updateData.objectives = courseData.objectives;
    }
    if ((!existing.targetAudience || existing.targetAudience.length === 0) && courseData.targetAudience.length > 0) {
      updateData.targetAudience = courseData.targetAudience;
    }
    
    updateData.updatedAt = new Date();
    updateData.lastContentUpdate = new Date();

    await collection.updateOne(
      { _id: existing._id },
      { $set: updateData }
    );

    return { action: 'updated', title: courseData.title, id: existing._id };
  } else {
    // Create new course
    const newCourse = {
      ...courseData,
      slug: slugify(courseData.title),
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublished: false,
      status: 'draft',
      enrollmentCount: 0,
      analytics: { views: 0, completions: 0 },
    };
    
    // Remove internal fields
    delete newCourse._wordCount;
    delete newCourse._requiredWords;
    delete newCourse._meetsWordCount;

    const result = await collection.insertOne(newCourse);
    return { action: 'created', title: courseData.title, id: result.insertedId };
  }
}

// ─── Main ───

async function main() {
  const mdDir = path.join(__script_dirname, 'courseMarkdown');
  
  if (!fs.existsSync(mdDir)) {
    console.error(`\n  ❌ Directory not found: ${mdDir}`);
    console.error(`  Create it and add .md course files.\n`);
    process.exit(1);
  }

  const files = fs.readdirSync(mdDir).filter(f => f.endsWith('.md'));
  
  if (files.length === 0) {
    console.error(`\n  ❌ No .md files found in ${mdDir}\n`);
    process.exit(1);
  }

  console.log(`\n  📚 Found ${files.length} course file(s) in ${mdDir}`);

  // Connect to MongoDB
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('  ✅ Connected to MongoDB\n');
  const db = mongoose.connection.db;

  const results = [];

  for (const file of files) {
    const filepath = path.join(mdDir, file);
    const content = fs.readFileSync(filepath, 'utf-8');
    
    console.log(`  📄 Processing: ${file}`);
    
    try {
      const courseData = parseMarkdownCourse(content, file);
      
      console.log(`     Title:    ${courseData.title}`);
      console.log(`     CE Hours: ${courseData.ceHours}`);
      console.log(`     Modules:  ${courseData.modules.length}`);
      console.log(`     Quiz Qs:  ${courseData.assessment.questions.length}`);
      console.log(`     Words:    ${courseData._wordCount.toLocaleString()} / ${courseData._requiredWords.toLocaleString()} ${courseData._meetsWordCount ? '✅' : '⚠️'}`);
      
      const result = await upsertCourse(db, courseData);
      results.push(result);
      
      console.log(`     ➡️  ${result.action.toUpperCase()} (${result.id})\n`);
    } catch (err) {
      console.log(`     ❌ ERROR: ${err.message}`);
      results.push({ action: 'error', title: file, id: null });
      console.log('');
    }
  }

  // Summary
  console.log('  ' + '='.repeat(60));
  console.log('  SUMMARY');
  console.log('  ' + '='.repeat(60));
  const created = results.filter(r => r.action === 'created').length;
  const updated = results.filter(r => r.action === 'updated').length;
  console.log(`  Created: ${created} | Updated: ${updated} | Total: ${results.length}`);
  
  results.forEach(r => {
    console.log(`  ${r.action === 'created' ? '🆕' : '📝'} ${r.action}: ${r.title}`);
  });

  console.log('\n  ✅ Done! Courses are saved as drafts.');
  console.log('  → Set ceHours and publish via admin dashboard.\n');

  await mongoose.disconnect();
}

main().catch(e => {
  console.error('💥 Error:', e.message);
  console.error(e.stack);
  process.exit(1);
});
