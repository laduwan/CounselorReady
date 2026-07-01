/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from "mongoose";
import { countCourseWords, requiredWordsFor } from "../utils/courseWordCount.js";

/**
 * CounselorReady Course Validator
 * ================================
 * Run after any seed operation to catch problems before learners do.
 * 
 * Usage:
 *   node src/scripts/validateCourses.js
 * 
 * What it checks:
 *   - Every module has at least one lesson
 *   - Last module has a final exam (isExam: true) with 15+ questions
 *   - All question options are string arrays (not objects)
 *   - Word count meets CE hour requirement
 *   - References have required title field
 *   - Assessment mirrors exam lesson
 */

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error("No MONGODB_URI"); process.exit(1); }

const WORDS_PER_CE_HOUR = 6000;
const MIN_EXAM_QUESTIONS = 15;
const PASSING_SCORE = 80;

function countWords(text) {
  if (!text) return 0;
  return text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().split(" ").filter(w => w.length > 0).length;
}

function checkOptionsFormat(questions, location) {
  const issues = [];
  (questions || []).forEach((q, i) => {
    if (!Array.isArray(q.options)) {
      issues.push(`${location} Q${i+1}: options is not an array`);
    } else if (q.options.length > 0 && typeof q.options[0] === "object") {
      issues.push(`${location} Q${i+1}: options uses {text,isCorrect} format — must be string array with correctAnswer index`);
    } else if (q.options.length !== 4) {
      issues.push(`${location} Q${i+1}: has ${q.options.length} options, expected 4`);
    }
    if (q.correctAnswer === undefined || q.correctAnswer === null) {
      issues.push(`${location} Q${i+1}: missing correctAnswer`);
    }
  });
  return issues;
}

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log("\n═══════════════════════════════════════════════");
  console.log("  CounselorReady Course Validation Report");
  console.log("═══════════════════════════════════════════════\n");

  const C = mongoose.connection.collection("courses");
  const courses = await C.find({ status: "published" }).toArray();
  
  console.log(`Checking ${courses.length} published courses...\n`);

  let totalIssues = 0;
  const report = [];

  for (const course of courses) {
    const issues = [];
    const warnings = [];

    // Word count check via canonical counter (single source of truth).
    // Fixes a long-standing bug: this script previously walked course.modules,
    // but live interactive courses use course.sections — so every interactive
    // course counted 0 words and false-failed. countCourseWords reads sections,
    // assessment, and all interactive blocks, matching the DB and publish gate.
    const wordCount = countCourseWords(course);
    const requiredWords = requiredWordsFor(course.ceHours || course.ceuHours || 1);
    if (wordCount < requiredWords) {
      issues.push(`Word count: ${wordCount.toLocaleString()} / ${requiredWords.toLocaleString()} required (${Math.round(wordCount/requiredWords*100)}%)`);
    }

    // Module/lesson structure check
    const modules = course.modules || [];
    if (modules.length === 0) {
      issues.push("No modules found");
    } else {
      modules.forEach((m, i) => {
        if (!m.lessons || m.lessons.length === 0) {
          issues.push(`Module ${i+1} "${m.title}" has no lessons`);
        }
      });

      // Final exam check — must be in last module
      const lastModule = modules[modules.length - 1];
      const examLesson = (lastModule.lessons || []).find(l => l.isExam === true);
      
      if (!examLesson) {
        issues.push(`No final exam lesson (isExam: true) found in last module "${lastModule.title}"`);
      } else {
        const examQCount = (examLesson.questions || []).length;
        if (examQCount < MIN_EXAM_QUESTIONS) {
          issues.push(`Final exam has ${examQCount} questions — minimum is ${MIN_EXAM_QUESTIONS}`);
        }
        if (examLesson.passingScore !== PASSING_SCORE) {
          warnings.push(`Final exam passingScore is ${examLesson.passingScore}, expected ${PASSING_SCORE}`);
        }
        if (examLesson.showExplanations === true) {
          warnings.push("Final exam showExplanations is true — answers will be shown during exam");
        }
        // Check options format
        const optIssues = checkOptionsFormat(examLesson.questions, "Exam");
        issues.push(...optIssues);
      }

      // Check knowledge check questions in other modules
      modules.slice(0, -1).forEach((m, i) => {
        (m.lessons || []).filter(l => l.type === "quiz").forEach(l => {
          const optIssues = checkOptionsFormat(l.questions, `Module ${i+1} quiz`);
          issues.push(...optIssues);
        });
      });
    }

    // References check
    (course.references || []).forEach((r, i) => {
      if (!r.title) issues.push(`Reference ${i+1} missing title field`);
      if (!r.author) warnings.push(`Reference ${i+1} missing author`);
      if (!r.year) warnings.push(`Reference ${i+1} missing year`);
    });
    if (!course.references || course.references.length < 3) {
      warnings.push(`Only ${(course.references||[]).length} references — minimum 3 recommended`);
    }

    // Assessment check
    const assessQCount = (course.assessment?.questions || []).length;
    if (assessQCount < MIN_EXAM_QUESTIONS) {
      warnings.push(`course.assessment has ${assessQCount} questions — should mirror final exam (15+)`);
    }

    totalIssues += issues.length;

    report.push({ title: course.title, slug: course.slug, ceHours: course.ceHours || course.ceuHours, wordCount, requiredWords, issues, warnings });
  }

  // Print report
  report.forEach(r => {
    const status = r.issues.length === 0 ? "✅" : "❌";
    const warnStr = r.warnings.length > 0 ? ` (${r.warnings.length} warning${r.warnings.length>1?"s":""})` : "";
    console.log(`${status} ${r.title}${warnStr}`);
    console.log(`   CE: ${r.ceHours}hrs | Words: ${r.wordCount.toLocaleString()}/${r.requiredWords.toLocaleString()} | Slug: ${r.slug}`);
    r.issues.forEach(issue => console.log(`   ❌ ${issue}`));
    r.warnings.forEach(warn => console.log(`   ⚠️  ${warn}`));
    console.log();
  });

  console.log("═══════════════════════════════════════════════");
  if (totalIssues === 0) {
    console.log(`✅ All ${courses.length} published courses passed validation`);
  } else {
    console.log(`❌ ${totalIssues} issue(s) found across ${courses.length} published courses`);
    console.log("   Fix issues before courses go live to learners");
  }
  console.log("═══════════════════════════════════════════════\n");

  await mongoose.disconnect();
  process.exit(totalIssues > 0 ? 1 : 0);
}

main().catch(err => { console.error("Validator error:", err.message); process.exit(1); });
