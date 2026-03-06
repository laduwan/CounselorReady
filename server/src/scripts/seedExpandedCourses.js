/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
#!/usr/bin/env node
/**
 * seedExpandedCourses.js
 * 
 * Seeds the 4 expanded movie-themed courses into the database:
 * 1. Elephant in the Room (Difficult Conversations) - 3 CE
 * 2. Walking on Eggshells (High-Conflict Clients) - 3 CE
 * 3. When It Rains, It Pours (Complex Presentations) - 3 CE
 * 4. It Takes a Village (Collaborative Care) - 3 CE
 * 
 * Place in: server/src/scripts/seedExpandedCourses.js
 * Place .md files in: server/src/scripts/courseMarkdown/
 * 
 * Run: node src/scripts/seedExpandedCourses.js
 */

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Course metadata - edit these if needed
const COURSE_METADATA = {
  'Elephant_in_the_Room_EXPANDED.md': {
    title: 'The Elephant in the Room: Navigating Difficult Conversations in Therapy',
    ceHours: 3,
    category: 'Clinical Practice',
    level: 'Intermediate',
    targetAudience: ['Licensed Professional Counselors', 'Licensed Mental Health Counselors', 'Licensed Clinical Social Workers', 'Psychologists', 'Marriage and Family Therapists'],
    contentArea: 'Clinical Skills'
  },
  'Walking_on_Eggshells_EXPANDED.md': {
    title: 'Walking on Eggshells: Working with High-Conflict and Emotionally Dysregulated Clients',
    ceHours: 3,
    category: 'Clinical Practice',
    level: 'Intermediate',
    targetAudience: ['Licensed Professional Counselors', 'Licensed Mental Health Counselors', 'Licensed Clinical Social Workers', 'Psychologists', 'Marriage and Family Therapists'],
    contentArea: 'Clinical Skills'
  },
  'When_It_Rains_It_Pours_EXPANDED.md': {
    title: 'When It Rains, It Pours: Treating Clients with Multiple Stressors and Comorbidities',
    ceHours: 3,
    category: 'Clinical Practice',
    level: 'Intermediate',
    targetAudience: ['Licensed Professional Counselors', 'Licensed Mental Health Counselors', 'Licensed Clinical Social Workers', 'Psychologists', 'Marriage and Family Therapists'],
    contentArea: 'Clinical Skills'
  },
  'It_Takes_a_Village_EXPANDED.md': {
    title: 'It Takes a Village: Consultation, Referral, and Collaborative Care',
    ceHours: 3,
    category: 'Ethics',
    level: 'Intermediate',
    targetAudience: ['Licensed Professional Counselors', 'Licensed Mental Health Counselors', 'Licensed Clinical Social Workers', 'Psychologists', 'Marriage and Family Therapists'],
    contentArea: 'Professional Practice'
  }
};

// ─── Markdown Parser ───

function parseMarkdownCourse(content, filename) {
  const metadata = COURSE_METADATA[filename] || {};
  
  const course = {
    title: metadata.title || extractTitle(content),
    description: '',
    ceHours: metadata.ceHours || 3,
    credits: metadata.ceHours || 3,
    targetAudience: metadata.targetAudience || [],
    objectives: [],
    level: metadata.level || 'Intermediate',
    contentArea: metadata.contentArea || 'Clinical Practice',
    category: metadata.category || 'Clinical Practice',
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
      qualificationStatement: 'Content developed by licensed mental health professionals with expertise in clinical practice.'
    }
  };

  // Extract description
  const descMatch = content.match(/\*\*Course Description:\*\*\s*([\s\S]*?)(?=\n\n|\n\*\*)/);
  if (descMatch) {
    course.description = descMatch[1].trim();
  } else {
    // Try to get first substantial paragraph after title
    const introMatch = content.match(/^#[^#].*\n\n([\s\S]{100,500}?)(?=\n\n)/);
    if (introMatch) course.description = cleanText(introMatch[1]).substring(0, 1000);
  }

  // Extract learning objectives
  const objSection = extractSection(content, 'COURSE LEARNING OBJECTIVES|LEARNING OBJECTIVES|Learning Objectives');
  if (objSection) {
    const objLines = objSection.match(/^\d+\.\s+.+$/gm) || [];
    course.objectives = objLines.map(l => l.replace(/^\d+\.\s+/, '').replace(/\*\*/g, '').trim());
  }

  // Parse modules (look for # MODULE X: or ## MODULE X:)
  const moduleRegex = /^#{1,2}\s*MODULE\s*(\d+):\s*(.+)$/gim;
  const moduleHeaders = [];
  let mm;
  while ((mm = moduleRegex.exec(content)) !== null) {
    moduleHeaders.push({
      num: parseInt(mm[1]),
      title: mm[2].trim(),
      index: mm.index
    });
  }

  // Extract content for each module
  moduleHeaders.forEach((mod, i) => {
    const nextMod = moduleHeaders[i + 1];
    let endIdx = content.length;
    
    // Find boundaries
    if (nextMod) endIdx = nextMod.index;
    
    // Also check for CONCLUSION, POST-TEST, or BIBLIOGRAPHY before next module
    const boundaries = ['# CONCLUSION', '# POST-TEST', '# BIBLIOGRAPHY', '# SUPPLEMENTAL'];
    boundaries.forEach(boundary => {
      const idx = content.indexOf(boundary, mod.index + 10);
      if (idx > mod.index && idx < endIdx) endIdx = idx;
    });

    const moduleContent = content.substring(mod.index, endIdx);
    
    // Extract knowledge check questions from this module
    const quizQuestions = extractKnowledgeCheckQuestions(moduleContent);
    
    // Split into lessons (by ## or ### headings)
    const lessons = splitModuleIntoLessons(moduleContent, mod.title);

    course.modules.push({
      title: mod.title,
      order: mod.num,
      lessons: lessons.map((lesson, lIdx) => ({
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

  // Extract post-test questions
  const postTestSection = extractSection(content, 'POST-TEST QUESTIONS');
  if (postTestSection) {
    course.assessment.questions = parsePostTestQuestions(postTestSection);
    course.assessment.passThreshold = 0.80;
  }

  // Extract answer key and apply to questions
  const answerKeySection = extractSection(content, 'POST-TEST ANSWER KEY|ANSWER KEY');
  if (answerKeySection && course.assessment.questions.length > 0) {
    applyAnswerKey(course.assessment.questions, answerKeySection);
  }

  // Extract references/bibliography
  const refSection = extractSection(content, 'BIBLIOGRAPHY|REFERENCES');
  if (refSection) {
    course.references = refSection
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 20 && !l.startsWith('#') && !l.startsWith('---'));
  }

  // Calculate word count
  const totalWords = countCourseWords(course);
  course._wordCount = totalWords;
  course._requiredWords = course.ceHours * 6000;
  course._meetsWordCount = totalWords >= (course.ceHours * 5000); // 5000 threshold with tolerance

  return course;
}

// ─── Helper Functions ───

function extractTitle(content) {
  const titleLine = content.split('\n').find(l => l.startsWith('# '));
  if (titleLine) {
    return titleLine.replace(/^#\s*/, '').replace(/^Course:\s*/i, '').trim();
  }
  return 'Untitled Course';
}

function extractSection(content, headerPattern) {
  const regex = new RegExp(`^#{1,3}\\s*(?:${headerPattern}).*$`, 'im');
  const match = regex.exec(content);
  if (!match) return null;

  const startIdx = match.index + match[0].length;
  const headingLevel = (match[0].match(/^#+/) || ['##'])[0].length;
  const nextHeading = new RegExp(`^#{1,${headingLevel}}\\s+[A-Z]`, 'm');
  const remaining = content.substring(startIdx);
  const endMatch = nextHeading.exec(remaining);
  const endIdx = endMatch ? startIdx + endMatch.index : content.length;

  return content.substring(startIdx, endIdx).trim();
}

function splitModuleIntoLessons(moduleContent, moduleTitle) {
  const lessons = [];
  
  // Find all ## and ### headings that are not special sections
  const subRegex = /^#{2,3}\s+(?!🎯|📋|🛠️|✅|💡|🎭)(.+)$/gm;
  const subHeaders = [];
  let sm;
  
  while ((sm = subRegex.exec(moduleContent)) !== null) {
    const title = sm[1].trim();
    // Skip quiz/check sections
    if (/Knowledge Check|Quiz|Post-Test|Pulse Check/i.test(title)) continue;
    // Skip emoji-prefixed interactive elements
    if (/^[🎯📋🛠️✅💡🎭]/.test(title)) continue;
    
    subHeaders.push({ 
      title: title.replace(/\*\*/g, '').trim(), 
      index: sm.index, 
      length: sm[0].length 
    });
  }

  if (subHeaders.length > 0) {
    subHeaders.forEach((sub, i) => {
      const start = sub.index + sub.length;
      const end = subHeaders[i + 1] ? subHeaders[i + 1].index : moduleContent.length;
      let lessonContent = moduleContent.substring(start, end).trim();
      
      // Remove knowledge check sections from lesson content
      lessonContent = lessonContent.replace(/### ✅ Knowledge Check[\s\S]*?(?=###|$)/gi, '').trim();
      
      if (lessonContent.length > 100) {
        lessons.push({ title: sub.title, content: lessonContent });
      }
    });
  }

  // If no sub-sections found, make the whole module one lesson
  if (lessons.length === 0) {
    let contentWithoutHeading = moduleContent.replace(/^#{1,2}\s+MODULE.*\n/, '').trim();
    // Remove knowledge checks
    contentWithoutHeading = contentWithoutHeading.replace(/### ✅ Knowledge Check[\s\S]*?(?=###|## |$)/gi, '').trim();
    
    if (contentWithoutHeading.length > 100) {
      lessons.push({ title: moduleTitle, content: contentWithoutHeading });
    }
  }

  return lessons;
}

function extractKnowledgeCheckQuestions(moduleContent) {
  const questions = [];
  
  // Find knowledge check section
  const kcMatch = moduleContent.match(/#{2,4}\s*(?:✅\s*)?Knowledge Check[:\s]*Module\s*\d*/i);
  if (!kcMatch) return questions;
  
  // Get content after the knowledge check heading
  const startIdx = kcMatch.index + kcMatch[0].length;
  
  // Find end (next major heading or end of module content)
  let endIdx = moduleContent.length;
  const nextHeading = moduleContent.substring(startIdx).match(/\n#{1,2}\s+[A-Z]/);
  if (nextHeading) endIdx = startIdx + nextHeading.index;
  
  const kcContent = moduleContent.substring(startIdx, endIdx);
  
  // Parse numbered questions with a-d options
  const qRegex = /(\d+)\.\s*(.*?\?)\s*\n((?:\s*[a-d]\)\s*.+\n?)+)/gi;
  let qm;
  
  while ((qm = qRegex.exec(kcContent)) !== null) {
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

function parsePostTestQuestions(section) {
  const questions = [];
  
  // Match numbered questions with options
  const qRegex = /(\d+)\.\s*(.*?\?)\s*\n((?:\s*[a-d]\)\s*.+\n?)+)/gi;
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
  // Parse answer key table: | 1 | C | Rationale... |
  const tableRegex = /\|\s*(\d+)\s*\|\s*([A-D])\s*\|\s*(.+?)\s*\|/gi;
  let tm;
  
  while ((tm = tableRegex.exec(answerKeyContent)) !== null) {
    const qNum = parseInt(tm[1]);
    const correctLetter = tm[2].toUpperCase();
    const explanation = tm[3].trim();
    
    const question = questions.find(q => q._num === qNum);
    if (question) {
      question.explanation = explanation;
      question.options.forEach(opt => {
        if (opt.letter === correctLetter) opt.isCorrect = true;
      });
    }
  }

  // Also try line format: 1 | C | Explanation
  const lineRegex = /^(\d+)\s*\|\s*([A-D])\s*\|\s*(.+)$/gm;
  let lm;
  
  while ((lm = lineRegex.exec(answerKeyContent)) !== null) {
    const qNum = parseInt(lm[1]);
    const correctLetter = lm[2].toUpperCase();
    const explanation = lm[3].trim();
    
    const question = questions.find(q => q._num === qNum);
    if (question && !question.options.some(o => o.isCorrect)) {
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
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^####\s+(.+)$/gm, '<h4>$1</h4>')
    .replace(/^###\s+(.+)$/gm, '<h2>$1</h2>')
    .replace(/^##\s+(.+)$/gm, '<h2>$1</h2>')
    .replace(/^[-*]\s+(.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    .replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
    .replace(/\n\n+/g, '</p><p>')
    .replace(/^(.+)$/gm, (m) => m.startsWith('<') ? m : `<p>${m}</p>`)
    .replace(/<p><\/p>/g, '')
    .replace(/<p>\s*<(h[34]|ul|ol|li)/g, '<$1')
    .replace(/<\/(h[34]|ul|ol|li)>\s*<\/p>/g, '</$1>');
}

function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/#{1,6}\s*/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function countCourseWords(course) {
  let total = 0;
  
  // Count description
  total += countWords(course.description);
  
  // Count objectives
  course.objectives.forEach(obj => { total += countWords(obj); });
  
  // Count modules
  course.modules.forEach(mod => {
    total += countWords(mod.title);
    mod.lessons.forEach(lesson => {
      total += countWords(lesson.textContent);
    });
    // Count quiz questions
    mod.quiz.questions.forEach(q => {
      total += countWords(q.question);
      q.options.forEach(o => { total += countWords(o.text); });
    });
  });
  
  // Count assessment questions
  course.assessment.questions.forEach(q => {
    total += countWords(q.question);
    q.options.forEach(o => { total += countWords(o.text); });
    total += countWords(q.explanation);
  });
  
  // Count references
  course.references.forEach(r => { total += countWords(r); });
  
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
  
  // Try exact title match first
  let existing = await collection.findOne({ title: courseData.title });
  
  // Try partial match if exact not found
  if (!existing) {
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
    // Update existing course
    const updateData = {
      modules: courseData.modules,
      assessment: courseData.assessment,
      references: courseData.references,
      description: courseData.description || existing.description,
      objectives: courseData.objectives.length > 0 ? courseData.objectives : existing.objectives,
      targetAudience: courseData.targetAudience,
      ceHours: courseData.ceHours,
      credits: courseData.ceHours,
      contentArea: courseData.contentArea,
      category: courseData.category,
      acepProvider: courseData.acepProvider,
      presenter: courseData.presenter,
      updatedAt: new Date(),
      lastContentUpdate: new Date()
    };

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
      analytics: { views: 0, completions: 0 }
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
  console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   🎬 CounselorReady Course Seeder                       ║
║   4 Movie-Themed Courses (3 CE Each)                    ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
`);

  const mdDir = path.join(__dirname, 'courseMarkdown');
  
  if (!fs.existsSync(mdDir)) {
    console.error(`  ❌ Directory not found: ${mdDir}`);
    console.error(`  Create it and add .md course files.\n`);
    process.exit(1);
  }

  // Look for the specific expanded course files
  const expectedFiles = Object.keys(COURSE_METADATA);
  const availableFiles = fs.readdirSync(mdDir).filter(f => f.endsWith('.md'));
  const files = expectedFiles.filter(f => availableFiles.includes(f));
  
  if (files.length === 0) {
    console.error(`  ❌ No expanded course files found in ${mdDir}`);
    console.error(`  Expected files: ${expectedFiles.join(', ')}\n`);
    process.exit(1);
  }

  console.log(`  📚 Found ${files.length} course file(s)\n`);

  // Connect to MongoDB
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('  ❌ MONGODB_URI not set in environment\n');
    process.exit(1);
  }
  
  await mongoose.connect(mongoUri);
  console.log('  ✅ Connected to MongoDB\n');
  const db = mongoose.connection.db;

  const results = [];

  for (const file of files) {
    const filepath = path.join(mdDir, file);
    const content = fs.readFileSync(filepath, 'utf-8');
    
    console.log(`  📄 Processing: ${file}`);
    
    try {
      const courseData = parseMarkdownCourse(content, file);
      
      console.log(`     Title:     ${courseData.title}`);
      console.log(`     CE Hours:  ${courseData.ceHours}`);
      console.log(`     Modules:   ${courseData.modules.length}`);
      console.log(`     Lessons:   ${courseData.modules.reduce((a, m) => a + m.lessons.length, 0)}`);
      console.log(`     Quiz Qs:   ${courseData.assessment.questions.length}`);
      console.log(`     Words:     ${courseData._wordCount.toLocaleString()} / ${courseData._requiredWords.toLocaleString()} ${courseData._meetsWordCount ? '✅' : '⚠️'}`);
      
      const result = await upsertCourse(db, courseData);
      results.push(result);
      
      console.log(`     ➡️  ${result.action.toUpperCase()} (${result.id})\n`);
    } catch (err) {
      console.error(`     ❌ ERROR: ${err.message}`);
      console.error(err.stack);
      results.push({ action: 'error', title: file, error: err.message });
      console.log('');
    }
  }

  // Summary
  console.log('  ' + '═'.repeat(60));
  console.log('  SUMMARY');
  console.log('  ' + '═'.repeat(60));
  
  const created = results.filter(r => r.action === 'created').length;
  const updated = results.filter(r => r.action === 'updated').length;
  const errors = results.filter(r => r.action === 'error').length;
  
  console.log(`  Created: ${created} | Updated: ${updated} | Errors: ${errors} | Total: ${results.length}`);
  console.log('');
  
  results.forEach(r => {
    const icon = r.action === 'created' ? '🆕' : r.action === 'updated' ? '📝' : '❌';
    console.log(`  ${icon} ${r.action}: ${r.title}`);
  });

  console.log(`
  ✅ Done! Courses are saved as drafts.
  
  Next steps:
  1. Review courses in admin dashboard
  2. Set CE hours if not auto-detected
  3. Verify quiz questions have correct answers
  4. Publish when ready
`);

  await mongoose.disconnect();
}

main().catch(e => {
  console.error('💥 Fatal Error:', e.message);
  console.error(e.stack);
  process.exit(1);
});
