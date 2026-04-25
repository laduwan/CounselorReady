[CLAUDE_MD_APPEND(2).md](https://github.com/user-attachments/files/27072869/CLAUDE_MD_APPEND.2.md)
# ═══════════════════════════════════════════════════════════════
# APPEND THIS BLOCK TO THE END OF CLAUDE.md
# ═══════════════════════════════════════════════════════════════

## Seed Script Rendering Contract (NON-NEGOTIABLE)

**READ THIS BEFORE WRITING OR MODIFYING ANY SEED SCRIPT.**

The course player is `client/public/interactive-course.html` (the live, single-file CReady Viewer). It renders content from `modules[].contentBlocks[]` in the `interactivecourses` collection. Seed scripts MUST write data that the player can render without transformation. No migration scripts. No post-processing. The seed is the single source of truth. Do NOT reference `cready-viewer.html`, `cready-viewer.css`, `cready-viewer.js`, or `cr-course-viewer.html` — those filenames appear in stale docs but the files do not exist in this repo.

### Collection

```javascript
// ✅ CORRECT
const courseSchema = new mongoose.Schema({}, { strict: false, collection: 'interactivecourses' });

// ❌ WRONG — deprecated collection, player doesn't read it
const courseSchema = new mongoose.Schema({}, { strict: false, collection: 'courses' });
```

### Structure: modules[].contentBlocks[]

```javascript
// ✅ CORRECT — what the viewer reads
modules: [
  {
    title: "Module 1: ...",
    order: 1,
    contentBlocks: [
      { type: "sectionDivider", ... },
      { type: "text", content: "..." },
      { type: "multipleChoice", question: "...", options: [...], correctAnswer: 1 },
      ...
    ]
  }
]

// ❌ WRONG — old schema, requires viewer fallback logic
modules: [
  {
    title: "Module 1: ...",
    lessons: [
      { type: "text", content: "..." },
      { type: "quiz", isExam: false, questions: [...] }
    ]
  }
]
```

Do NOT use `lessons[]`. Do NOT use `sections[]` at the top level (the viewers normalize `modules[]` → `sections[]` at load time).

### The 17 Valid Block Types

These are the ONLY values allowed for `contentBlock.type`:

**Content:** `sectionDivider`, `text`, `imageText`, `image`, `accordion`, `resources`, `videoEmbed`
**Knowledge Check:** `multipleChoice`, `multiSelect`, `matching`, `cardSort`, `sequencing`, `timeline`
**Engagement:** `reflection`, `scenarioTree`, `flashcardDeck`, `hotspot`

Any other `type` value will render as "Unknown content type" in CourseViewer.jsx. The CReady viewer is more forgiving but DO NOT rely on that.

### Banned Block Types

```javascript
// ❌ NEVER use these as contentBlock types:
{ type: "knowledgeCheck", questions: [...] }  // wrapper — expand into individual multipleChoice blocks
{ type: "quiz", isExam: true, questions: [...] }  // exam — extract to top-level assessment object
{ type: "quiz", isExam: false, questions: [...] }  // non-exam quiz — expand into individual multipleChoice blocks
{ type: "knowledge_check" }  // wrong casing
{ type: "multiple-choice" }  // wrong casing (hyphenated)
{ type: "multiple_choice" }  // wrong casing (underscored) — this is valid INSIDE question objects, not as a block type
```

### Knowledge Checks: Individual multipleChoice Blocks

```javascript
// ✅ CORRECT — each question is its own contentBlock
contentBlocks: [
  { type: "text", content: "<h2>Section content...</h2><p>...</p>" },
  {
    type: "multipleChoice",
    question: "Which of the following best describes...?",
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: 2,
    explanation: "Option C is correct because..."
  },
  { type: "text", content: "<p>More content...</p>" },
  {
    type: "multipleChoice",
    question: "A client presents with...?",
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: 0,
    explanation: "Option A is correct because..."
  }
]

// ❌ WRONG — wrapper block, viewer can't render this
contentBlocks: [
  {
    type: "knowledgeCheck",
    title: "Knowledge Check — Module 1",
    questions: [
      { question: "...", options: [...], correctAnswer: 1 },
      { question: "...", options: [...], correctAnswer: 3 }
    ]
  }
]
```

### Final Exam: Top-Level assessment Object

```javascript
// ✅ CORRECT — exam lives at document root, not inside contentBlocks
{
  modules: [...],
  assessment: {
    questions: [
      {
        question: "Which of the following...?",
        type: "multiple_choice",
        options: ["A", "B", "C", "D"],
        correctAnswer: 2,
        explanation: "..."
      }
      // ... minimum 15 questions
    ],
    passingScore: 80,
    maxAttempts: 3
  }
}

// ❌ WRONG — exam buried inside a module's contentBlocks
modules: [
  {
    contentBlocks: [
      { type: "quiz", isExam: true, passingScore: 80, questions: [...] }
    ]
  }
]
```

### Options Format (THE MOST COMMON BUG)

```javascript
// ✅ CORRECT — string array + integer index
options: ["Option A", "Option B", "Option C", "Option D"],
correctAnswer: 2    // 0-based index

// ❌ WRONG — object array with isCorrect flags
options: [
  { text: "Option A", isCorrect: false },
  { text: "Option B", isCorrect: false },
  { text: "Option C", isCorrect: true },
  { text: "Option D", isCorrect: false }
]
```

This applies to BOTH knowledge check blocks AND assessment questions. No exceptions.

### Migration Scripts Are Banned

Do not write migration scripts to fix seed data. If the data is wrong, fix the seed script and re-run it. Migration scripts have repeatedly caused data loss, partial updates, and broken courses. The seed script must produce correct data on first run.

### Self-Validation Checklist (Run Before Upsert)

Every seed script should validate before writing to DB:
1. Collection is `interactivecourses`
2. All `contentBlock.type` values are in the 17 valid types
3. No `knowledgeCheck` or `quiz` wrapper blocks exist in any `contentBlocks[]`
4. All `options` arrays contain strings (not objects)
5. All `correctAnswer` values are numbers (not booleans, not objects)
6. `assessment.questions` has ≥ 15 items
7. Word count ≥ `ceHours × 6000`
8. References ≥ 15 with `title`, `author`, `year`, `source`
9. No deprecated hex values (`#34495E`, `#40634A`, `#34503D`)
