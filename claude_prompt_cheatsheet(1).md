# CounselorReady — Claude Prompt Cheat Sheet

## Before Any Code Changes
"Read the actual files before writing anything. Show me what you found, then propose changes."

## Before Route/Wiring Work
"Check the repo first — read index.js and the route files before touching anything."

## Before Replacing Files
"Diff against what exists — compare your output to current code before replacing."

## When Something Seems Off
"Don't assume, grep — search the actual codebase instead of working from memory."

## Before Generating Anything
"Show me your findings before generating."

## After Uploading Files
"I uploaded [file]. Read it first, summarize what you see, then we'll decide what to do."

## For Audit Script Changes
"Test your endpoint paths against the actual route files before adding them to the script."

## Before Writing Any Seed Script
"Seed scripts write to `interactivecourses` — never `courses`. Use `modules[].contentBlocks[]` — never `lessons[]`. Only the 17 valid block types. No `knowledgeCheck` wrappers — expand into individual `multipleChoice` blocks. No `quiz` blocks with `isExam: true` — put the exam in the top-level `assessment` object. Options are always string arrays with integer `correctAnswer` — never `{ text, isCorrect }` objects. No migration scripts — fix the seed and re-run it."

## Before Writing Any Migration Script
"Stop. Don't write a migration script. Fix the seed script instead and re-run it. Migration scripts have broken courses every time they've been used."

## Before Proposing Option Format Changes
"Options format is `options: ['A', 'B', 'C', 'D']` with `correctAnswer: 2` (integer). Never convert to `{ text, isCorrect }` objects. This is in COURSE_SCHEMA_SPEC Section 4, bolded as THE MOST COMMON BUG."
