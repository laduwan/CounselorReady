[CLAUDE(3).md](https://github.com/user-attachments/files/26322791/CLAUDE.3.md)
# CounselorReady — Claude Code Instructions
## GA Integrated Therapeutic Perspectives LLC · NBCC ACEP #7760
---
## Prime Directive
**Only touch files explicitly named in the task prompt.**
If a file is not listed in the task, do not open it, do not edit it, do not refactor it, do not "improve" it, do not add imports to it. If completing the task seems to require touching an unlisted file, stop and ask.
---
## The Golden Rule
> **Fix what is broken. Nothing else.**
Do not change colors, fonts, components, emojis, sizing, layout, variable names, or file structure unless explicitly asked. Do not refactor working code. Do not rename things for consistency. Do not reorganize imports. Do not upgrade patterns. If it works, leave it alone.
---
## Hard Off-Limits Files
These files are complete and stable. Do NOT open, read, or modify them unless the task prompt explicitly names them:
### Backend services — locked
- `server/src/services/openAlex.js` — RNR CE OpenAlex integration, complete
- `server/src/services/currencyCheck.js` — RNR CE currency check, complete
- `server/src/services/ceBuild.js` — RNR CE CE build, complete
- `server/src/services/syllabusGenerator.js` — RNR CE syllabus DOCX, complete
- `server/src/services/courseCompletionService.js` — do not touch
- `server/src/services/emailTemplates.js` — do not touch
- `server/src/services/narrationService.js` — do not touch
### Backend routes — locked
- `server/src/routes/auth.js` — authentication, do not touch
- `server/src/routes/payments.js` — Stripe billing, do not touch
- `server/src/routes/courses.js` — core course delivery, do not touch
- `server/src/routes/courseRoutes.js` — do not touch
- `server/src/routes/certificates.js` — do not touch unless task names it
- `server/src/routes/adminStripe.js` — do not touch
### Backend models — locked
- `server/src/models/User.js` — do not add, remove, or rename fields unless task names it
- `server/src/models/Course.js` — do not touch
- `server/src/models/Certificate.js` — do not touch unless task names it
- `server/src/models/UserCourseProgress.js` — do not touch
### Frontend components — locked (fully)
- `client/src/components/CourseViewer.jsx` — NEVER TOUCH. This is the core course player.
- `client/src/components/CourseBuilder.jsx` — NEVER TOUCH.
- `client/src/components/Layout.jsx` — do not touch unless task names it
- `client/src/components/AccessibilityProvider.jsx` — do not touch
### Frontend config — locked
- `client/tailwind.config.cjs` — color palette and font families are locked
- `client/src/index.css` — base layer and component layer styles are locked
- `client/vite.config.js` — do not touch
- `client/src/main.jsx` — do not touch
---
## Locked Visual Design
### Platform-wide brand (all existing pages)
- Buttons: `burgundy-700` / `burgundy-800` — do NOT change to any other color
- Logo gradient: `linear-gradient(135deg, #8B2542, #6B1D34)` — do NOT flatten
- Colors: the existing burgundy/forest/stone brand scheme — do NOT introduce new palettes on existing pages
- Navy = `#284157` — **never** `#34495E` (deprecated, will appear in autocomplete — reject it)
- Fonts: display/sans/body font families in tailwind.config — do NOT change
### Course Catalog Page — FULLY LOCKED
`client/src/pages/InteractiveCourseCatalog.jsx`
- Header banner: teal-600 to emerald-600 gradient — locked
- Filter bar: white bg, rounded-xl, gray-300 borders — locked
- Grid layout: 1/2/3-column responsive with gap-6 — locked
- CourseCard: gradient thumbnail, gray-100 border — locked
- Functional/data changes only. Zero visual changes.
### RNR CE Components — separate design system
RNR CE components (`client/src/components/researchReady/*` and `client/src/pages/ResearchReadyCE.jsx`) use a DIFFERENT design system from the rest of the platform. This is intentional:
- Palette: eggnog `#FAF5EC`, buttercream `#FDF8EE`, honey `#8B5E2E`, burgundy `#7B2D3E`, pewter `#DDD9D3`
- Font: Georgia serif throughout
- Reference: `RNR_CE_UI.js` in repo root
- Do NOT apply the platform's Tailwind burgundy/forest palette to RNR CE components
- Do NOT apply the RNR CE palette to any other platform page
---
## Locked Code Markers
Sections marked with these comments are protected — do not modify:
```js
// @lock-start: <reason>
... protected code ...
// @lock-end

const VALUE = 'x'; // @lock
```
---
## CE Hour Calculation — never change this formula
```js
// 1 CE hr = 6,000 words. Always round DOWN to nearest 0.5.
Math.floor((wordCount / 6000) * 2) / 2
```
This formula is used in `openAlex.js` and `RNR_CE_UI.js`. Do not alter the formula, the divisor, or the rounding direction anywhere in the codebase.
---
## Task Scope Rules
1. **Read the task file list first.** Every Claude Code prompt for this repo names the exact files to touch. Start there.
2. **Do not add files not requested.** If a task says "edit X", do not create Y as a bonus.
3. **Do not add dependencies.** Do not run `npm install` for new packages unless the task explicitly requests it.
4. **Do not run database migrations** or seed scripts unless the task explicitly says to.
5. **Do not change API response shapes** on existing routes — consumers depend on them.
6. **Ask before touching shared utilities.** Files in `server/src/utils/` affect many features. Confirm before editing.
7. **Before removing, replacing, or re-routing any import, route, component, or service:** grep for every place it is referenced across the entire codebase. List all dependents. Do not touch it until you have confirmed nothing else breaks.
8. **Before adding a new import to any file:** confirm the source file actually exists. A missing file breaks the entire build silently.
---
## Collections & Routes
- User-facing course content reads from `interactivecourses` only. **Never wire a frontend component to `GET /api/courses`.**
- Always verify a route file is imported AND mounted in `server/src/index.js` before calling it from the frontend — a route file that exists but is not registered is completely unreachable.
- Route order matters in Express — specific paths (e.g. `/user/my-courses`) must be registered before wildcard paths (e.g. `/:id`).
- Always add a timeout + AbortController to frontend fetch calls — never leave a fetch with no timeout.
---
## Branch Policy
Every task should be on its own branch:
```
git checkout -b task/<short-description>
```
Show a diff summary before committing. If you touched a file not in the task list, revert it before committing.
---
## When In Doubt
Stop. Ask. Do not guess, do not approximate, do not "make it work" by changing something adjacent. The cost of asking is zero. The cost of unwiring a stable feature is high.
---
## Active Feature Status (as of March 2026)
⚠️ This table is manually maintained. Do not treat it as authoritative — verify actual file state before assuming status.

| Feature | Backend | Frontend | Prompt |
|---|---|---|---|
| RNR CE (Researched-N-Ready) | ✅ Complete | 🔧 Gap-fill (10 tasks) | v2 prompt |
| Extend Trial +3 days | 🔧 Needs route | 🔧 Needs button | Prompt ready |
| Certificate tile (article CE) | 🔧 Needs rnrMeta | 🔧 Needs tile variant | In RNR v2 |
| CE Planner RNR block | ✅ Route exists | 🔧 Needs UI block | In RNR v2 |
| CourseViewer | ✅ Locked | ✅ Locked | Do not touch |
| Auth / Payments / Courses | ✅ Locked | ✅ Locked | Do not touch |

---

## Seed Script Rendering Contract (NON-NEGOTIABLE)

**READ THIS BEFORE WRITING OR MODIFYING ANY SEED SCRIPT.**

The course player (`interactive-course.html`, `cready-viewer.html`, `cr-course-viewer.html`) renders content from `modules[].contentBlocks[]` in the `interactivecourses` collection. Seed scripts MUST write data that the player can render without transformation. No migration scripts. No post-processing. The seed is the single source of truth.

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
