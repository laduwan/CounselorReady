#!/usr/bin/env node

/**
 * ============================================================
 *  CounselorReady — ACEP Word Count Audit Tool
 *  NBCC ACEP #7760 Compliance Checker
 * ============================================================
 * 
 *  Requirement: 6,000 words per CE credit hour
 * 
 *  USAGE:
 *    Mode 1 — Live MongoDB audit (recommended):
 *      MONGODB_URI="mongodb+srv://..." node auditCourseWordCount.js
 * 
 *    Mode 2 — Dry-run against local update scripts:
 *      node auditCourseWordCount.js --local /path/to/server/src/scripts
 * 
 *    Options:
 *      --verbose       Show per-section word counts
 *      --json          Output as JSON (for CI/CD pipelines)
 *      --fix-report    Generate a remediation plan with word targets
 * 
 *  Place in: /server/src/scripts/auditCourseWordCount.js
 * ============================================================
 */

const WORDS_PER_CE_HOUR = 6000;
const MIN_KNOWLEDGE_CHECKS_PER_MODULE = 3;
const MIN_FINAL_ASSESSMENT_QUESTIONS = 15;
const PASS_THRESHOLD = 0.80;

// ────────────────────────────────────────
// HTML / Text Stripping
// ────────────────────────────────────────

function stripHtml(html) {
  if (!html || typeof html !== 'string') return '';
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&[a-zA-Z]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function countWords(text) {
  const clean = stripHtml(text);
  if (!clean) return 0;
  return clean.split(/\s+/).filter(w => w.length > 0).length;
}

// ────────────────────────────────────────
// Content Block Text Extraction
// ────────────────────────────────────────

function extractBlockText(block) {
  if (!block || !block.type) return { words: 0, text: '', detail: {} };

  const parts = [];
  const detail = { type: block.type };

  switch (block.type) {
    case 'sectionDivider':
      if (block.title) parts.push(block.title);
      if (block.subtitle) parts.push(block.subtitle);
      break;

    case 'text':
      if (block.content) parts.push(block.content);
      if (block.textContent) parts.push(block.textContent);
      break;

    case 'imageText':
      if (block.title) parts.push(block.title);
      if (block.content) parts.push(block.content);
      break;

    case 'accordion':
      if (Array.isArray(block.accordionItems)) {
        block.accordionItems.forEach(item => {
          if (item.title) parts.push(item.title);
          if (item.content) parts.push(item.content);
        });
        detail.panelCount = block.accordionItems.length;
      }
      break;

    case 'multipleChoice':
      if (block.question) parts.push(block.question);
      if (Array.isArray(block.options)) {
        block.options.forEach(opt => {
          if (opt.text) parts.push(opt.text);
        });
      }
      if (block.explanation) parts.push(block.explanation);
      detail.isQuiz = true;
      break;

    case 'multiSelect':
      if (block.question) parts.push(block.question);
      if (Array.isArray(block.options)) {
        block.options.forEach(opt => {
          if (opt.text) parts.push(opt.text);
        });
      }
      if (block.explanation) parts.push(block.explanation);
      detail.isQuiz = true;
      break;

    case 'matching':
      if (block.matchingInstructions) parts.push(block.matchingInstructions);
      if (Array.isArray(block.matchingPairs)) {
        block.matchingPairs.forEach(pair => {
          if (pair.term) parts.push(pair.term);
          if (pair.definition) parts.push(pair.definition);
        });
      }
      detail.isQuiz = true;
      break;

    case 'reflection':
      if (block.question) parts.push(block.question);
      break;

    case 'resources':
      if (Array.isArray(block.resources)) {
        block.resources.forEach(r => {
          if (r.title) parts.push(r.title);
          if (r.description) parts.push(r.description);
        });
      }
      break;

    default:
      // Fallback: try common text fields
      if (block.content) parts.push(block.content);
      if (block.textContent) parts.push(block.textContent);
      if (block.text) parts.push(block.text);
      if (block.question) parts.push(block.question);
      break;
  }

  const combinedText = parts.join(' ');
  const words = countWords(combinedText);
  detail.words = words;

  return { words, text: combinedText, detail };
}

// ────────────────────────────────────────
// Course-Level Audit
// ────────────────────────────────────────

function auditCourse(course) {
  const result = {
    title: course.title || 'Untitled',
    courseId: course._id?.toString() || 'N/A',
    ceHours: course.ceHours || course.credits || 0,
    status: course.status || course.isPublished ? 'published' : 'draft',
    totalWords: 0,
    requiredWords: 0,
    sections: [],
    quizQuestions: { perSection: {}, total: 0 },
    assessmentQuestions: 0,
    passThreshold: null,
    compliance: {},
  };

  result.requiredWords = result.ceHours * WORDS_PER_CE_HOUR;

  // ── Count content words by section ──
  const sections = course.sections || [];
  let totalContentWords = 0;
  let totalQuizWords = 0;

  sections.forEach((section, sIdx) => {
    const sectionResult = {
      title: section.title || `Section ${sIdx + 1}`,
      contentWords: 0,
      quizWords: 0,
      quizCount: 0,
      blockBreakdown: [],
    };

    const blocks = section.contentBlocks || section.blocks || [];
    blocks.forEach((block, bIdx) => {
      const { words, detail } = extractBlockText(block);

      if (detail.isQuiz) {
        sectionResult.quizWords += words;
        sectionResult.quizCount++;
      } else {
        sectionResult.contentWords += words;
      }

      sectionResult.blockBreakdown.push({
        index: bIdx,
        type: block.type || 'unknown',
        words,
        isQuiz: !!detail.isQuiz,
      });
    });

    totalContentWords += sectionResult.contentWords;
    totalQuizWords += sectionResult.quizWords;
    result.quizQuestions.perSection[sectionResult.title] = sectionResult.quizCount;
    result.quizQuestions.total += sectionResult.quizCount;
    result.sections.push(sectionResult);
  });

  // ── Assessment questions ──
  const assessment = course.assessment || {};
  if (Array.isArray(assessment.questions)) {
    result.assessmentQuestions = assessment.questions.length;
    // Count assessment question words too
    assessment.questions.forEach(q => {
      if (q.question) totalQuizWords += countWords(q.question);
      if (Array.isArray(q.options)) {
        q.options.forEach(opt => {
          totalQuizWords += countWords(typeof opt === 'string' ? opt : opt.text || '');
        });
      }
      if (q.explanation) totalQuizWords += countWords(q.explanation);
    });
  }
  result.passThreshold = assessment.passThreshold || null;

  // NBCC counts ALL text including quiz content toward word count
  result.totalWords = totalContentWords + totalQuizWords;
  result.contentWords = totalContentWords;
  result.quizWords = totalQuizWords;

  // ── Compliance checks ──
  const wordsMet = result.totalWords >= result.requiredWords;
  const wordPct = result.requiredWords > 0
    ? ((result.totalWords / result.requiredWords) * 100).toFixed(1)
    : 'N/A';
  const shortfall = result.requiredWords - result.totalWords;

  // Check knowledge checks per section (min 3)
  const sectionsWithFewQuestions = [];
  Object.entries(result.quizQuestions.perSection).forEach(([title, count]) => {
    if (count < MIN_KNOWLEDGE_CHECKS_PER_MODULE) {
      sectionsWithFewQuestions.push({ title, count, needed: MIN_KNOWLEDGE_CHECKS_PER_MODULE - count });
    }
  });

  const assessmentMet = result.assessmentQuestions >= MIN_FINAL_ASSESSMENT_QUESTIONS;
  const thresholdMet = result.passThreshold ? result.passThreshold >= PASS_THRESHOLD : null;

  result.compliance = {
    wordCount: {
      met: wordsMet,
      found: result.totalWords,
      required: result.requiredWords,
      percentage: wordPct,
      shortfall: wordsMet ? 0 : shortfall,
    },
    knowledgeChecks: {
      met: sectionsWithFewQuestions.length === 0,
      totalQuestions: result.quizQuestions.total,
      sectionsBelow: sectionsWithFewQuestions,
    },
    finalAssessment: {
      met: assessmentMet,
      found: result.assessmentQuestions,
      required: MIN_FINAL_ASSESSMENT_QUESTIONS,
      shortfall: assessmentMet ? 0 : MIN_FINAL_ASSESSMENT_QUESTIONS - result.assessmentQuestions,
    },
    passThreshold: {
      met: thresholdMet,
      found: result.passThreshold,
      required: PASS_THRESHOLD,
    },
    overallPass: wordsMet && assessmentMet && (thresholdMet !== false),
  };

  return result;
}

// ────────────────────────────────────────
// Pretty Print Report
// ────────────────────────────────────────

function printReport(results, verbose = false, fixReport = false) {
  const DIVIDER = '═'.repeat(72);
  const THIN = '─'.repeat(72);
  
  console.log('');
  console.log(DIVIDER);
  console.log('  🎓 COUNSELORREADY — ACEP WORD COUNT AUDIT');
  console.log('  NBCC ACEP Provider #7760 Compliance Report');
  console.log(`  Generated: ${new Date().toISOString()}`);
  console.log(`  Standard: ${WORDS_PER_CE_HOUR.toLocaleString()} words per CE hour`);
  console.log(DIVIDER);

  let totalCourses = results.length;
  let passingCourses = 0;
  let failingCourses = 0;

  results.forEach((r, i) => {
    const c = r.compliance;
    const pass = c.overallPass;
    if (pass) passingCourses++;
    else failingCourses++;

    console.log('');
    console.log(THIN);
    console.log(`  ${pass ? '✅' : '❌'}  ${r.title}`);
    console.log(`      ID: ${r.courseId}  |  Status: ${r.status}  |  CE Hours: ${r.ceHours}`);
    console.log(THIN);

    // Word count
    const wcIcon = c.wordCount.met ? '✅' : '❌';
    console.log(`  ${wcIcon} Word Count:     ${r.totalWords.toLocaleString()} / ${r.requiredWords.toLocaleString()} (${c.wordCount.percentage}%)`);
    if (!c.wordCount.met) {
      console.log(`     ⚠️  SHORT by ${c.wordCount.shortfall.toLocaleString()} words`);
      console.log(`     📝 Content: ${r.contentWords.toLocaleString()} words  |  Quiz/Assessment: ${r.quizWords.toLocaleString()} words`);
    }

    // Knowledge checks
    const kcIcon = c.knowledgeChecks.met ? '✅' : '❌';
    console.log(`  ${kcIcon} Knowledge Checks: ${c.knowledgeChecks.totalQuestions} total across ${r.sections.length} sections`);
    if (!c.knowledgeChecks.met) {
      c.knowledgeChecks.sectionsBelow.forEach(s => {
        console.log(`     ⚠️  "${s.title}" has ${s.count} questions (need ${MIN_KNOWLEDGE_CHECKS_PER_MODULE}+, add ${s.needed})`);
      });
    }

    // Final assessment
    const faIcon = c.finalAssessment.met ? '✅' : '❌';
    console.log(`  ${faIcon} Final Assessment: ${c.finalAssessment.found} questions (min ${MIN_FINAL_ASSESSMENT_QUESTIONS})`);
    if (!c.finalAssessment.met) {
      console.log(`     ⚠️  Need ${c.finalAssessment.shortfall} more assessment questions`);
    }

    // Pass threshold
    if (c.passThreshold.found !== null) {
      const ptIcon = c.passThreshold.met ? '✅' : '❌';
      console.log(`  ${ptIcon} Pass Threshold:  ${(c.passThreshold.found * 100).toFixed(0)}% (min ${(PASS_THRESHOLD * 100).toFixed(0)}%)`);
    } else {
      console.log(`  ⚠️  Pass Threshold:  Not set`);
    }

    // Verbose: per-section breakdown
    if (verbose) {
      console.log('');
      console.log('  Section Breakdown:');
      r.sections.forEach((s, sIdx) => {
        const total = s.contentWords + s.quizWords;
        console.log(`    ${sIdx + 1}. ${s.title}`);
        console.log(`       Content: ${s.contentWords.toLocaleString()} words  |  Quiz: ${s.quizWords.toLocaleString()} words (${s.quizCount} Qs)  |  Total: ${total.toLocaleString()}`);
        
        if (verbose === 'deep') {
          s.blockBreakdown.forEach(b => {
            const tag = b.isQuiz ? '🧪' : '📄';
            console.log(`         ${tag} [${b.type}] ${b.words} words`);
          });
        }
      });
    }
  });

  // ── Summary ──
  console.log('');
  console.log(DIVIDER);
  console.log('  SUMMARY');
  console.log(DIVIDER);
  console.log(`  Total Courses Audited: ${totalCourses}`);
  console.log(`  ✅ Passing:  ${passingCourses}`);
  console.log(`  ❌ Failing:  ${failingCourses}`);
  console.log('');

  // ── Fix Report ──
  if (fixReport) {
    const failing = results.filter(r => !r.compliance.overallPass);
    if (failing.length > 0) {
      console.log(DIVIDER);
      console.log('  📋 REMEDIATION PLAN');
      console.log(DIVIDER);

      failing.forEach(r => {
        console.log('');
        console.log(`  📘 ${r.title} (${r.ceHours} CE hrs)`);

        if (!r.compliance.wordCount.met) {
          const shortfall = r.compliance.wordCount.shortfall;
          const perSection = Math.ceil(shortfall / Math.max(r.sections.length, 1));
          console.log(`     🔴 Add ~${shortfall.toLocaleString()} words total`);
          console.log(`        → ~${perSection.toLocaleString()} words per section (${r.sections.length} sections)`);
          console.log(`        → That's roughly ${Math.ceil(shortfall / 250)} additional paragraphs (avg 250 words each)`);
          
          // Show which sections have the least content
          const sorted = [...r.sections].sort((a, b) => a.contentWords - b.contentWords);
          console.log('        → Sections with least content (expand these first):');
          sorted.slice(0, 3).forEach(s => {
            console.log(`          • "${s.title}" — ${s.contentWords.toLocaleString()} words`);
          });
        }

        if (!r.compliance.knowledgeChecks.met) {
          r.compliance.knowledgeChecks.sectionsBelow.forEach(s => {
            console.log(`     🔴 Add ${s.needed} knowledge check(s) to "${s.title}"`);
          });
        }

        if (!r.compliance.finalAssessment.met) {
          console.log(`     🔴 Add ${r.compliance.finalAssessment.shortfall} final assessment questions`);
        }
      });
    }
  }

  console.log('');
  console.log(DIVIDER);
  console.log('  ⚠️  NOTES:');
  console.log('  • NBCC ACEP requires 6,000 words per CE credit hour');
  console.log('  • Word count includes all readable text: content, quiz Qs, explanations');
  console.log('  • Knowledge checks: 3-5 per section/module minimum');
  console.log('  • Final assessment: 15+ questions, 80% pass threshold');
  console.log('  • Run with --verbose for per-section breakdown');
  console.log('  • Run with --fix-report for remediation plan');
  console.log(DIVIDER);
  console.log('');
}

// ────────────────────────────────────────
// MODE 1: MongoDB Live Audit
// ────────────────────────────────────────

async function runMongoAudit(uri, options) {
  let mongoose;
  try {
    mongoose = require('mongoose');
  } catch {
    console.error('❌ mongoose not found. Install with: npm install mongoose');
    console.error('   Or use --local mode to audit files directly.');
    process.exit(1);
  }

  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(uri);
  console.log('✅ Connected.');

  const db = mongoose.connection.db;

  // ── Fetch interactive courses ──
  console.log('📚 Fetching interactive courses...');
  const interactiveCourses = await db.collection('interactivecourses').find({}).toArray();
  console.log(`   Found ${interactiveCourses.length} interactive course(s).`);

  // ── Fetch traditional courses ──
  console.log('📚 Fetching traditional courses...');
  const traditionalCourses = await db.collection('courses').find({}).toArray();
  console.log(`   Found ${traditionalCourses.length} traditional course(s).`);

  const allResults = [];

  // Audit interactive courses
  for (const course of interactiveCourses) {
    allResults.push(auditCourse(course));
  }

  // Audit traditional courses (modules/lessons structure)
  for (const course of traditionalCourses) {
    // Convert traditional structure to sections/contentBlocks for auditing
    const converted = convertTraditionalCourse(course);
    allResults.push(auditCourse(converted));
  }

  if (options.json) {
    console.log(JSON.stringify(allResults, null, 2));
  } else {
    printReport(allResults, options.verbose, options.fixReport);
  }

  await mongoose.disconnect();
  console.log('🔌 Disconnected from MongoDB.');
}

/**
 * Convert traditional Course.js structure (modules/lessons) 
 * into the sections/contentBlocks shape for unified auditing.
 */
function convertTraditionalCourse(course) {
  const sections = [];
  const modules = course.modules || [];

  modules.forEach(mod => {
    const blocks = [];
    const lessons = mod.lessons || [];

    lessons.forEach(lesson => {
      // Text content
      if (lesson.content) {
        blocks.push({ type: 'text', content: lesson.content });
      }
      if (lesson.textContent) {
        blocks.push({ type: 'text', content: lesson.textContent });
      }
      // Accordion items
      if (Array.isArray(lesson.accordionItems) && lesson.accordionItems.length > 0) {
        blocks.push({ type: 'accordion', accordionItems: lesson.accordionItems });
      }
      // Quiz questions embedded in lessons
      if (Array.isArray(lesson.quizQuestions)) {
        lesson.quizQuestions.forEach(q => {
          blocks.push({
            type: 'multipleChoice',
            question: q.question || q.text,
            options: q.options || q.answers || [],
            explanation: q.explanation || q.feedback || '',
          });
        });
      }
    });

    // Module-level quiz
    if (mod.quiz && Array.isArray(mod.quiz.questions)) {
      mod.quiz.questions.forEach(q => {
        blocks.push({
          type: 'multipleChoice',
          question: q.question || q.text,
          options: q.options || q.answers || [],
          explanation: q.explanation || q.feedback || '',
        });
      });
    }

    sections.push({
      title: mod.title || `Module ${mod.order || '?'}`,
      contentBlocks: blocks,
    });
  });

  return {
    _id: course._id,
    title: course.title || 'Untitled Traditional Course',
    ceHours: course.ceHours || course.credits || 0,
    status: course.isPublished ? 'published' : 'draft',
    sections,
    assessment: course.assessment || course.finalAssessment || {},
  };
}

// ────────────────────────────────────────
// MODE 2: Local File Audit
// ────────────────────────────────────────

function runLocalAudit(scriptsDir, options) {
  const fs = require('fs');
  const path = require('path');

  console.log(`📂 Scanning directory: ${scriptsDir}`);

  // Find course content JS files (multiple naming conventions)
  const files = fs.readdirSync(scriptsDir).filter(f => {
    if (!f.endsWith('.js')) return false;
    const lower = f.toLowerCase();
    return (
      lower.startsWith('update') ||
      lower.startsWith('populate') ||
      (lower.startsWith('seed') && lower.includes('course')) ||
      lower.includes('-course-content') ||
      lower.includes('_course_content') ||
      lower.includes('coursecontent')
    );
  });

  if (files.length === 0) {
    console.log('⚠️  No course update scripts found.');
    console.log('   Looking for files matching: update*, populate*, seed*Course*, *-course-content.js');
    console.log(`   in: ${scriptsDir}`);
    process.exit(1);
  }

  console.log(`   Found ${files.length} course script(s): ${files.join(', ')}`);

  const results = [];

  files.forEach(filename => {
    const filepath = path.join(scriptsDir, filename);
    const content = fs.readFileSync(filepath, 'utf-8');
    const fileSize = fs.statSync(filepath).size;

    console.log(`\n   📄 Analyzing: ${filename} (${(fileSize / 1024).toFixed(1)}KB)`);

    const parsed = parseUpdateScript(content, filename);
    results.push(auditCourse(parsed));
  });

  // Also check for standalone content files (like the .txt files)
  const textFiles = fs.readdirSync(scriptsDir).filter(f => f.endsWith('.txt'));
  textFiles.forEach(filename => {
    const filepath = path.join(scriptsDir, filename);
    const content = fs.readFileSync(filepath, 'utf-8');
    const parsed = parseTextCourseFile(content, filename);
    if (parsed.ceHours > 0) {
      results.push(auditCourse(parsed));
    }
  });

  if (options.json) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    printReport(results, options.verbose, options.fixReport);
  }
}

/**
 * Parse an updateXxxCourse.js script to extract the course content structure.
 * These scripts typically contain MongoDB update operations with sections/contentBlocks,
 * OR they may be DOCX-generator scripts using the 'docx' library.
 */
function parseUpdateScript(content, filename) {
  const course = {
    _id: filename,
    title: extractTitle(content, filename),
    ceHours: extractCeHours(content),
    status: 'script',
    sections: [],
    assessment: { questions: [], passThreshold: null },
  };

  // Detect if this is a DOCX export script (uses docx library)
  const isDocxScript = content.includes('require(\'docx\')') || 
                       content.includes('require("docx")') ||
                       content.includes('from \'docx\'') ||
                       content.includes('new Document(');

  if (isDocxScript) {
    const parsed = parseDocxGeneratorScript(content, filename);
    course.title = parsed.title || course.title;
    course.ceHours = parsed.ceHours || course.ceHours;
    course.sections = parsed.sections;
    course.assessment = parsed.assessment;
    return course;
  }

  // Strategy 1: Look for sections array with contentBlocks (interactive course format)
  const sectionsMatch = content.match(/sections\s*:\s*\[/);
  if (sectionsMatch) {
    course.sections = extractSectionsFromScript(content);
  }

  // Strategy 2: Look for modules/lessons structure (traditional course format)
  if (course.sections.length === 0) {
    const modulesMatch = content.match(/modules\s*:\s*\[/);
    if (modulesMatch) {
      course.sections = extractModulesFromScript(content);
    }
  }

  // Strategy 3: Fall back to extracting ALL string literals as text
  if (course.sections.length === 0) {
    course.sections = extractAllTextFromScript(content);
  }

  // Extract assessment questions
  course.assessment = extractAssessmentFromScript(content);
  
  // Extract pass threshold
  const thresholdMatch = content.match(/passThreshold\s*:\s*([\d.]+)/);
  if (thresholdMatch) {
    course.assessment.passThreshold = parseFloat(thresholdMatch[1]);
  }

  return course;
}

/**
 * Parse a DOCX-generator script (uses the 'docx' npm library).
 * Extracts all TextRun content and organizes by HEADING_1 sections.
 */
function parseDocxGeneratorScript(content, filename) {
  const result = {
    title: '',
    ceHours: 0,
    sections: [],
    assessment: { questions: [], passThreshold: null },
  };

  // Extract all TextRun text content
  // Pattern 1: new TextRun("text")
  const textRun1 = [];
  const regex1 = /new TextRun\("([^"]*(?:\\.[^"]*)*)"\)/g;
  let m;
  while ((m = regex1.exec(content)) !== null) {
    textRun1.push({ text: m[1].replace(/\\"/g, '"').replace(/\\n/g, '\n'), index: m.index });
  }

  // Pattern 2: new TextRun({ text: "text", ... })
  const regex2 = /new TextRun\(\{[^}]*text:\s*"([^"]*(?:\\.[^"]*)*)"[^}]*\}\)/g;
  while ((m = regex2.exec(content)) !== null) {
    textRun1.push({ text: m[1].replace(/\\"/g, '"').replace(/\\n/g, '\n'), index: m.index });
  }

  // Sort by position in file
  textRun1.sort((a, b) => a.index - b.index);

  // Try to detect course title
  const titleCandidates = textRun1.filter(t => 
    !t.text.includes('EXTRACTION') && 
    !t.text.includes('CounselorReady') &&
    t.text.length > 10 && t.text.length < 100
  );
  if (titleCandidates.length > 0) {
    result.title = titleCandidates[0].text;
  }

  // Detect CE hours - check multiple patterns
  const hoursEntry = textRun1.find(t => /^\d+\s*(CE\s*)?Hours?$/i.test(t.text.trim()));
  if (hoursEntry) {
    const hm = hoursEntry.text.match(/(\d+)/);
    if (hm) result.ceHours = parseInt(hm[1]);
  }
  // Fallback: look for "X Hours" anywhere in TextRuns
  if (result.ceHours === 0) {
    const hoursEntry2 = textRun1.find(t => /\b(\d+)\s*(?:CE\s*)?Hours?\b/i.test(t.text));
    if (hoursEntry2) {
      const hm = hoursEntry2.text.match(/(\d+)\s*(?:CE\s*)?Hours?/i);
      if (hm) result.ceHours = parseInt(hm[1]);
    }
  }
  // Fallback: search raw content for ceHours: N or credits: N
  if (result.ceHours === 0) {
    const rawMatch = content.match(/ceHours\s*:\s*(\d+)/) || content.match(/credits\s*:\s*(\d+)/);
    if (rawMatch) result.ceHours = parseInt(rawMatch[1]);
  }

  // Find HEADING_1 markers to split into sections
  const headingRegex = /HeadingLevel\.HEADING_1[\s\S]{0,200}?TextRun\(?(?:\{[^}]*text:\s*)?["']([^"']+)["']/g;
  const headings = [];
  while ((m = headingRegex.exec(content)) !== null) {
    headings.push({ title: m[1], index: m.index });
  }

  // Organize text into sections based on headings
  if (headings.length > 0) {
    headings.forEach((heading, i) => {
      const nextHeading = headings[i + 1];
      const sectionTexts = textRun1.filter(t => {
        if (t.index <= heading.index) return false;
        if (nextHeading && t.index >= nextHeading.index) return false;
        return true;
      });

      const sectionContent = sectionTexts.map(t => t.text).join(' ');
      
      // Detect quiz questions in this section
      const quizTexts = sectionTexts.filter(t => 
        t.text.includes('?') && t.text.length > 20
      );

      const blocks = [{ type: 'text', content: sectionContent }];
      quizTexts.forEach(q => {
        blocks.push({ type: 'multipleChoice', question: q.text, options: [], explanation: '' });
      });

      result.sections.push({
        title: heading.title,
        contentBlocks: blocks,
      });
    });
  } else {
    // No headings found; dump all text into one section
    const allText = textRun1.map(t => t.text).join(' ');
    result.sections.push({
      title: 'Full Content',
      contentBlocks: [{ type: 'text', content: allText }],
    });
  }

  // Count quiz-like patterns for assessment
  const quizQuestionPatterns = content.match(/Quiz\s*Questions?/gi) || [];
  const questionMarkers = content.match(/(?:Question|Q)\s*\d+/gi) || [];
  
  // Check for "Pass Threshold"
  const thresholdEntry = textRun1.find(t => /80%/.test(t.text));
  if (thresholdEntry) {
    result.assessment.passThreshold = 0.80;
  }

  return result;
}

function extractTitle(content, filename) {
  // Try to find title in script
  const titleMatch = content.match(/title\s*:\s*['"`]([^'"`]+)['"`]/);
  if (titleMatch) return titleMatch[1];

  // Derive from filename
  return filename
    .replace(/^(update|populate|seed)/, '')
    .replace(/Course.*\.js$/, '')
    .replace(/([A-Z])/g, ' $1')
    .trim();
}

function extractCeHours(content) {
  // Try multiple patterns
  const patterns = [
    /ceHours\s*:\s*(\d+)/,
    /credits\s*:\s*(\d+)/,
    /ce_hours\s*:\s*(\d+)/,
    /(\d+)\s*CE\s*Hours?/i,
    /(\d+)\s*credit\s*hours?/i,
  ];
  for (const p of patterns) {
    const m = content.match(p);
    if (m) return parseInt(m[1]);
  }
  return 0;
}

function extractSectionsFromScript(content) {
  const sections = [];
  
  // Find all section-like objects with title and contentBlocks
  const sectionRegex = /\{\s*title\s*:\s*['"`]([^'"`]+)['"`][\s\S]*?contentBlocks\s*:\s*\[/g;
  let match;
  
  while ((match = sectionRegex.exec(content)) !== null) {
    const sectionTitle = match[1];
    const startIdx = match.index;
    
    // Find the contentBlocks array content
    const blocks = extractContentBlocksAt(content, match.index + match[0].length);
    
    sections.push({
      title: sectionTitle,
      contentBlocks: blocks,
    });
  }

  return sections;
}

function extractContentBlocksAt(content, startPos) {
  const blocks = [];
  
  // Simple approach: find all block objects after this position
  // Look for type: 'text', type: 'accordion', etc.
  const blockRegex = /type\s*:\s*['"`](text|accordion|multipleChoice|multiSelect|matching|reflection|imageText|sectionDivider|resources)['"`]/g;
  blockRegex.lastIndex = startPos;
  
  let blockMatch;
  while ((blockMatch = blockRegex.exec(content)) !== null) {
    const blockType = blockMatch[1];
    const blockStart = blockMatch.index;
    
    // Don't go past the next section
    const nextSection = content.indexOf("title:", blockStart + 50);
    
    // Extract text content around this block
    const blockArea = content.substring(blockStart, blockStart + 5000);
    
    const block = { type: blockType };
    
    // Extract content/text fields
    const contentMatch = blockArea.match(/content\s*:\s*['"`]([\s\S]*?)['"`]\s*[,}]/);
    if (contentMatch) block.content = contentMatch[1];
    
    const textContentMatch = blockArea.match(/textContent\s*:\s*['"`]([\s\S]*?)['"`]\s*[,}]/);
    if (textContentMatch) block.textContent = textContentMatch[1];
    
    const questionMatch = blockArea.match(/question\s*:\s*['"`]([\s\S]*?)['"`]\s*[,}]/);
    if (questionMatch) block.question = questionMatch[1];
    
    const explanationMatch = blockArea.match(/explanation\s*:\s*['"`]([\s\S]*?)['"`]\s*[,}]/);
    if (explanationMatch) block.explanation = explanationMatch[1];
    
    blocks.push(block);
  }
  
  return blocks;
}

function extractModulesFromScript(content) {
  // Similar to sections but using modules/lessons structure
  const sections = [];
  const moduleRegex = /title\s*:\s*['"`]([^'"`]*(?:Module|Lesson|Unit)[^'"`]*)['"`]/gi;
  let match;
  
  while ((match = moduleRegex.exec(content)) !== null) {
    sections.push({
      title: match[1],
      contentBlocks: [{ type: 'text', content: '' }],
    });
  }
  
  return sections;
}

function extractAllTextFromScript(content) {
  // Last resort: extract all meaningful string content
  const allStrings = [];
  
  // Match string literals (single, double, backtick)
  const stringRegex = /['"`]([\s\S]{20,})['"`]/g;
  let match;
  
  while ((match = stringRegex.exec(content)) !== null) {
    const str = match[1];
    // Filter out code-like strings
    if (str.includes('function') || str.includes('require') || str.includes('mongoose')) continue;
    if (str.startsWith('http') || str.startsWith('/api')) continue;
    allStrings.push(str);
  }
  
  return [{
    title: 'All Extracted Content',
    contentBlocks: [{ type: 'text', content: allStrings.join(' ') }],
  }];
}

function extractAssessmentFromScript(content) {
  const assessment = { questions: [], passThreshold: null };
  
  // Count assessment questions by looking for question patterns
  const questionPatterns = [
    /question\s*:\s*['"`]/g,
    /questionText\s*:\s*['"`]/g,
  ];
  
  let questionCount = 0;
  questionPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) questionCount += matches.length;
  });
  
  // Create placeholder questions for counting
  for (let i = 0; i < questionCount; i++) {
    assessment.questions.push({ question: 'placeholder' });
  }
  
  const thresholdMatch = content.match(/passThreshold\s*:\s*([\d.]+)/);
  if (thresholdMatch) {
    assessment.passThreshold = parseFloat(thresholdMatch[1]);
  }
  
  return assessment;
}

/**
 * Parse a plain text course file (like Career Counseling .txt)
 */
function parseTextCourseFile(content, filename) {
  const ceMatch = content.match(/(\d+)\s*CE\s*Hours?/i) || content.match(/Credits?\s*:\s*(\d+)/i);
  const ceHours = ceMatch ? parseInt(ceMatch[1]) : 0;
  
  const titleMatch = content.match(/^#\s*(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : filename;

  // Split by headings to create sections
  const sectionRegex = /^##\s+(.+)$/gm;
  const sectionHeaders = [];
  let match;
  while ((match = sectionRegex.exec(content)) !== null) {
    sectionHeaders.push({ title: match[1], index: match.index });
  }

  const sections = sectionHeaders.map((header, i) => {
    const nextIndex = sectionHeaders[i + 1]?.index || content.length;
    const sectionContent = content.substring(header.index, nextIndex);
    return {
      title: header.title,
      contentBlocks: [{ type: 'text', content: sectionContent }],
    };
  });

  // Count quiz questions
  const questionCount = (content.match(/^\d+\.\s+\*\*.*\?\*\*/gm) || []).length
    + (content.match(/^>\s*\d+\./gm) || []).length
    + (content.match(/Question\s+\d+/gi) || []).length;

  return {
    _id: filename,
    title,
    ceHours,
    status: 'file',
    sections: sections.length > 0 ? sections : [{ 
      title: 'Full Document', 
      contentBlocks: [{ type: 'text', content }] 
    }],
    assessment: {
      questions: Array(Math.max(questionCount, 0)).fill({ question: 'from file' }),
      passThreshold: null,
    },
  };
}

// ────────────────────────────────────────
// CLI Entry Point
// ────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  
  const options = {
    verbose: args.includes('--verbose') ? (args.includes('--deep') ? 'deep' : true) : false,
    json: args.includes('--json'),
    fixReport: args.includes('--fix-report'),
  };

  const localIdx = args.indexOf('--local');

  if (localIdx !== -1) {
    // Local file mode
    const dir = args[localIdx + 1];
    if (!dir) {
      console.error('Usage: node auditCourseWordCount.js --local /path/to/scripts');
      process.exit(1);
    }
    runLocalAudit(dir, options);
  } else {
    // MongoDB mode
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error('');
      console.error('  ❌ MONGODB_URI environment variable not set.');
      console.error('');
      console.error('  Usage:');
      console.error('    MONGODB_URI="mongodb+srv://..." node auditCourseWordCount.js');
      console.error('');
      console.error('  Or use local file mode:');
      console.error('    node auditCourseWordCount.js --local /path/to/server/src/scripts');
      console.error('');
      process.exit(1);
    }
    await runMongoAudit(uri, options);
  }
}

main().catch(err => {
  console.error('💥 Fatal error:', err.message);
  process.exit(1);
});
