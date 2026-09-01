# CounselorReady™ — Seed Script Structure Reference

**v2.0 — Verified Against Live Code — August 31, 2026**

- Schema: `server/src/models/InteractiveCourse.js`
- Viewer: `client/public/interactive-course.html`
- Word Counter: `server/src/utils/courseWordCount.js`
- Audit Gate: `server/src/scripts/auditCourse.js`
- Canonical Template: `server/src/scripts/_seedTemplate.js`

GAITP LLC · NBCC ACEP Provider #7760 · *Learn. License. Lead.®*

---

## §0 — Non-Negotiables

- **Collection:** `interactivecourses` (not `courses` — that is legacy).
- **Structure:** `sections[].contentBlocks[]` — never `modules[]`. The viewer renders sections only; a `modules[]` array is dead weight.
- **Run from:** Render shell, `~/project/src/server` → `node src/scripts/<file>.js`
- **Canonical template:** `server/src/scripts/_seedTemplate.js`
- **Seed method:** Mongoose model `doc.save()` — fires pre-save hook (computes `wordCount`). Raw `insertOne` is deprecated (bypasses hook → wordCount: 0 → validators fail).
- **Ship as draft:** `status: "draft"`, `isPublished: false`. Flip to published after viewer review.
- **Audit before running:** `node src/scripts/auditCourse.js --file src/scripts/<file>.js`
- **ContentBlockSchema is `strict: false`** — undeclared fields on content blocks persist. CourseSchema is `strict: true` at the course level — undeclared course-level fields are silently dropped on `doc.save()`.

---

## §1 — Course-Level Shape

```js
const COURSE = {
  title: "Course Title",
  slug: "course-title",
  courseCode: "CR-XXX",
  subtitle: "...",
  description: "...",

  // CE + accreditation
  ceHours: 3, ceuHours: 3, credits: 3,
  level: "Intermediate",     // Beginner | Intermediate | Advanced
  approvingBody: "NBCC",
  approvalNumber: "7760", acepNumber: "7760",
  instructor: "GA Integrated Therapeutic Perspectives LLC",

  // Sellability — accessType enum: free | subscription | purchase
  accessType: "purchase", price: 39.99, pricingTier: "standard",

  status: "draft", isPublished: false, isActive: true,
  passingScore: 80, maxAttempts: 3,
  settings: { passingScore: 80, certificateEnabled: true,
              requireEvaluation: true, requireAttestation: true },

  objectives: ["..."],
  targetAudience: ["Licensed mental health professionals..."],

  sections: [ /* §2 */ ],
  assessment: { /* §6 */ },
  references: [ /* §7 */ ],
  resources: [ /* §7 */ ],
};
```

> ⚠ `ceuEligible` is NOT in the CourseSchema. It was in older docs but is silently dropped on `doc.save()`. Do not include it.

> ⚠ `maxAttempts` is at COURSE top level (schema line 450), not inside assessment. The viewer currently ignores it (unlimited attempts), but include it for schema consistency.

### Optional Course-Level Fields (Schema-Declared)

These fields are in the schema and persist on `doc.save()`. Include them when the course needs them.

| Field | Type / Default | Purpose |
|---|---|---|
| `approvals[]` | `{body, providerNumber, status, hourBreakdown[{label,hours}], deliveryFormat}` | Multi-board approval tracking. Feeds certificate rendering per board. |
| `presenter` | `{name, credentials, degree, licenseNumber, licenseState, qualificationStatement, category}` | ACEP required presenter/author info. |
| `nbccContentAreas[]` | Enum of 9 NBCC areas (e.g. "Counseling Theory/Practice") | Content area tags for catalog/search. |
| `acaCodeSections[]` | Regex `/^[A-I]\.\d+$/` (e.g. "A.1", "B.6") | ACA Code subsection-level ethics tagging. |
| `headerImage` | String (URL) | Viewer hero banner image. |
| `headerImageAlt` | String | Alt text for hero banner. |
| `headerTitle` | String | Override title in hero banner. |
| `headerSubtitle` | String | Subtitle in hero banner. |
| `narrationEnabled` | Boolean (default false) | Enables TTS read-aloud in viewer. |
| `minimumTimeMinutes` | Number (default 0) | Minimum time before course can be completed. |
| `enforceSectionOrder` | Boolean (default true) | Whether learner must go in order. |
| `dripEnabled` | Boolean (default false) | Time-gate sections. |
| `deliveryFormat` | "async" \| "live" \| "hybrid" (default "async") | Course delivery method. |

---

## §2 — Section Shape

```js
{
  title: "Section Title",
  order: 1,                   // 1-based, sequential
  description: "...",         // optional
  estimatedTime: 15,          // minutes; feeds totalEstimatedTime
  contentBlocks: [
    // FIRST block is ALWAYS sectionDivider
    { type: "sectionDivider", title: "...", subtitle: "...", order: 1 },
    // then content blocks, order sequential within section
  ]
}
```

### Per Content Section Minimum

- `sectionDivider` (with BOTH `title` AND `subtitle`)
- 2+ text blocks
- 1+ **`callout`** block (rotating `calloutType`: info, warning, ethics, clinical, tip, key, donot, protocol)
- 1+ **`keyTakeaway`** block
- 1+ interactive activity (accordion, flashcardDeck, matching, cardSort, scenarioTree, sequencing)
- 2–3 `multipleChoice` knowledge checks
- 1 `reflection`

> 🛑 **Every content section MUST have BOTH a `callout` block AND a `keyTakeaway` block.** These are different block types with different renderers — `callout` uses colored border + icon per calloutType, `keyTakeaway` uses gold background + 🔑 icon. Using only one is incomplete.

### Block Ordering Rhythm

divider → text → callout → text → activity → keyTakeaway → text → KC → reflection — not randomly shuffled. Never 5+ interactive blocks back-to-back.

---

## §3 — Introduction Section Structure (No Exceptions)

The first section of every course is the introduction. It sets the clinical context, establishes relevance, and orients the learner. It is NOT a thin "welcome" placeholder — it is a substantive opening that should run 2,500–4,000 words depending on CE hours.

### Required Block Order

1. **sectionDivider** — "Introduction" or course-specific opening title. Must have both title and subtitle.
2. **text** — Opening Hook (300–500 words). Start with a composite clinical vignette, a striking statistic, or a real-world scenario that grounds the course topic. Never start with "Welcome to this course" or "In this course, you will learn." Start with the problem the course solves.
3. **callout** — "Why This Matters" callout (type: `"clinical"` or `"info"`). 3–5 bullet points establishing clinical relevance, prevalence data, or practice gaps.
4. **text** — Course Roadmap (200–400 words). Narrative preview of what each section covers and how they build on each other. Written as flowing prose, not a bullet list of learning objectives.
5. **imageText** — Foundational Framework. Introduce the primary theoretical or clinical framework the course is built on. Use `imagePosition: "right"` for visual balance.
6. **accordion** — "Key Concepts Preview" (4–6 items). One item per major concept the course will develop. Each item gives a 2–3 sentence preview, not a full definition.
7. **keyTakeaway** — "What You Will Take Away" (4–6 items). Concrete, practice-level outcomes — what the learner will be able to DO differently after the course. Not learning objectives (those are in `course.objectives[]`). These are practitioner-facing takeaways.
8. **multipleChoice** — Baseline knowledge check (1–2 questions). Test the learner's current understanding before instruction begins. Explanation should say "We'll explore this in Section X."
9. **reflection** — Opening reflection. "Think about a recent case where [topic] was relevant. What did you do? What would you want to do differently?"

> 🛑 The introduction MUST have BOTH a `callout` AND a `keyTakeaway`. The callout establishes why the topic matters (clinical relevance). The keyTakeaway previews what the learner will gain (practice outcomes). These serve different pedagogical purposes and are not interchangeable.

> ⚠ Never front-load ACEP metadata in the introduction — no "GAITP LLC", "Provider #7760", "Course Hours:", or "Target Audience:" in text blocks. That metadata lives in the course-level fields and the catalog UI.

---

## §4 — Complete Block Type Reference (Verified Against Code)

The viewer's `renderBlock` dispatch has 24 explicit switch cases plus a convention-based default that resolves `render<Type>` functions dynamically. Types are grouped by rendering path below.

### A. Explicit Switch Cases (24 types)

**Structure & Prose**

| Type | Required Fields | Notes |
|---|---|---|
| `sectionDivider` | `title`, `subtitle` | Optional: `sectionNumber`, `bannerImage`, `bannerAlt`. Banner variant renders hero image with overlay. |
| `text` | `content` (HTML) | Supports `{{callout:id}}` inline syntax; fallback reads `textContent`. Bold `**Term** — definition` patterns auto-populate the glossary drawer. |
| `imageText` | `content` (HTML) | `image` optional; `imageAlt`, `imagePosition`: `"left"` \| `"right"`, `highlight` |
| `image` | `imageUrl` | `imageAltText`, `imageCaption`, `imageSize` (`small`\|`medium`\|`full`), `imageAlignment` (`left`\|`center`\|`right`) |
| `accordion` | `accordionItems: [{title, content}]` | `content` is HTML |

**Knowledge Checks**

| Type | Required Fields | Notes |
|---|---|---|
| `multipleChoice` | `question`, `options: [{text, isCorrect}]`, `explanation` | Optional `correctAnswer` (0-based index). NEVER flat `[String]` options. |
| `multiSelect` | `question`, `options: [{text, isCorrect}]`, `explanation` | Multiple `isCorrect: true` allowed |
| `matching` | `matchingInstructions`, `matchingPairs: [{term, definition}]` | |
| `knowledgeCheck` | (wrapper type) | Renders via `renderKnowledgeCheck` — avoid; expand to individual `multipleChoice` blocks |

**Interactive Activities**

| Type | Required Fields | Notes |
|---|---|---|
| `flashcardDeck` | `flashcards: [{id, front, back}]` | Optional `instructions`. Front/back pairs auto-populate glossary drawer. |
| `scenarioTree` | `scenarioTitle`, `startNode`, `nodes: {Mixed}` | Only if real decision content exists |
| `cardSort` | `categories: [String]`, `cards: [{id, text, correctCategory}]` | `correctCategory` must match `categories` exactly |
| `sequencing` | `steps: [{id, text, order}]` | Optional `instructions`, `explanation` |
| `timeline` | `events: [{year, text}]` | |
| `hotspot` | `hotspotImage`, `hotspots: [{x, y, label, info}]` | Optional `imageDescription` |
| `reflection` | `question` | Optional `minLength` (default 50) |
| `fillInBlank` | `blanks: [{prompt, answer, acceptAlternates?}]` | |

**Callouts & Emphasis — BOTH Required Per Section**

| Type | Required Fields | Notes |
|---|---|---|
| `callout` | `calloutType` + `content` (HTML) and/or `calloutItems: [String]` | Types: `info`, `warning`, `ethics`, `clinical`, `tip`, `key`, `donot`, `protocol`. Aliases: `variant` → `calloutType`, `items` → `calloutItems`. Canonical field: `calloutItems`. |
| `keyTakeaway` | `content` (HTML) and/or `takeaways: [String]` | Optional `title`. Alias: `items` → `takeaways` (viewer reads both). Canonical field: `takeaways`. |

> 🛑 `callout` and `keyTakeaway` are DIFFERENT block types. `callout` renders with a colored left border + type-specific icon (⚠️, ⚖️, 🩺, etc.) per `calloutType`. `keyTakeaway` renders with a gold background + 🔑 icon. Every content section MUST have at least one of each. Rotate `calloutType` across sections.

**Media & Resources**

| Type | Required Fields | Notes |
|---|---|---|
| `videoEmbed` | `videoUrl` | Optional `videoTitle`, `markers: [{time, label, prompt}]` |
| `video` | (same as `videoEmbed`) | Routes to same renderer |
| `resources` / `deliverables` | `resources: [{title, url, type, description?}]` | `type` drives icon; both aliases route to `renderResources` |
| `quiz` | (quiz block) | Renders via `renderQuizBlock` — prefer assessment for final exam |

### B. Convention-Dispatched Types (4 types)

The viewer's default case constructs `render<Type>` from the block type and calls it if the function exists on `window`. These four have global renderer functions:

| Type | Required Fields | Notes |
|---|---|---|
| `statCard` | `stats: [{value, label, description?}]` | Optional `title` |
| `caseStudy` | `caseTitle` | Optional: `caseClient`, `casePresentingConcerns`, `caseBackground`, `caseClinicianNotes`, `caseDiscussion` |
| `pullQuote` | `quote` | Optional `attribution` |
| `tableBlock` | `tableHeaders: [String]`, `tableRows: [[String]]` | Optional `title`, `tableCaption` |

All four are in the schema enum and render correctly. Production-ready.

### C. In Schema Enum But NO Renderer (Will Show "Unsupported")

| Type | Status |
|---|---|
| `clinicalVignette` | In schema enum — NO renderer function exists. Shows "Unsupported block type" card. Use text blocks with `<blockquote>` instead. |
| `references` | In schema enum — NO `renderReferences` function. Shows "Unsupported block type". References go in `course.references[]` array + conclusion text block only. |

---

## §5 — Options Shape (The #1 Killer)

**CORRECT — always use this (schema lines 89–92, template lines 97–106):**

```js
options: [
  { text: "Answer A", isCorrect: false },
  { text: "Answer B", isCorrect: true },
  { text: "Answer C", isCorrect: false },
  { text: "Answer D", isCorrect: false }
]
```

> 🛑 NEVER use flat `[String]` options — they cause Mongoose char-explosion and break the option UI.

This applies to `multipleChoice`, `multiSelect`, AND `assessment.questions[]`. The viewer grading logic reads `correctAnswer` (number) first, then falls back to `options.findIndex(o => o.isCorrect)`. Include both for safety.

> ⚠ `correctAnswer` is not a declared field in the assessment question sub-schema, but it persists because Mongoose does not strip it from embedded sub-docs. The viewer reads it first (line 8979). Always include it alongside `isCorrect` flags.

---

## §6 — Assessment (Final Exam)

```js
assessment: {
  passingScore: 80,
  passThreshold: 0.8,
  questions: [
    {
      question: "...",
      options: [{ text: "...", isCorrect: false }, ...],
      correctAnswer: 1,      // 0-based index
      explanation: "...",
      sectionIndex: 0        // optional — powers per-section miss breakdown
    }
  ],
  attemptsAllowed: 3,
  shuffleQuestions: true,
  shuffleOptions: true
}
```

- ≥15 questions for 1–3 CE. Add 3–5 per additional CE hour.
- Distribute correct answers ~25% per position (A/B/C/D).
- Sample from ALL sections, not just the last. Use `sectionIndex` to enable per-section miss breakdown on failed attempts.
- Every question needs an `explanation`.
- Test application and synthesis, not recall. Never duplicate KC questions verbatim.
- `maxAttempts: 3` lives at COURSE top level, NOT inside assessment.

---

## §7 — References & Resources (Drawer System)

### Viewer Architecture: Slide-Out Panels

The reading page has one tab in the header row: **Lesson** (default). References and Supplemental are accessed via slide-out panels. The `setReaderTab` function handles `"references"` and `"supplemental"` as tab values, toggling the `crRefsPanel` and `crSuppDrawer` elements. Access is through the floating edge-tab widget (self-contained section near EOF) and internal `setReaderTab` calls (e.g., from the completion band's "Save them" button).

> ⚠ The floating edge tabs (`.crd-tab`) have `display: none` in CSS (without `!important`). They exist in the DOM but are hidden by default. The References button (`#crRefsBtn`) and accessibility button (`#crA11yBtn`) are separately hidden with `display: none !important`.

### "References" Panel

Populated by `buildReferences()` which reads `course.references[]`. The panel shows each reference as a styled APA 7th paragraph.

**Data Source: `course.references[]`** — Schema type is Mixed. Accepts three formats:

```js
references: [
  // Format 1: plain string
  "Author, A. B. (Year). Title. Publisher.",
  // Format 2: pre-formatted citation
  { citation: "Author, A. B. (Year). Title of work. Publisher." },
  // Format 3: structured (viewer builds APA string from fields)
  { author: "Smith, J.", year: 2024, title: "Title of Work", source: "Publisher" }
]
```

**Also: Conclusion Text Block** — A text block in the conclusion section provides the learner-visible inline reference list using `.cr-references` and `.cr-reference` CSS classes:

```js
{ type: "text", content: '<div class="cr-references"><h2>References</h2>
  <p class="cr-reference">Author, A. (Year). <em>Title</em>. Publisher.</p>
  ...</div>' }
```

> ⚠ There is NO `renderReferences` function. Do NOT use `type: "references"` as a content block — it shows "Unsupported block type". References go in the `course.references[]` array (feeds drawer) + conclusion text block (inline display) only.

### "Supplemental" Drawer

Contains handouts, worksheets, PDFs, and links. Drawer header reads "SUPPLEMENTAL" with subtitle "Take these into session". Has two filter tabs inside: "This section" and "Whole course".

**Two Data Feeds:**
- **Inline resources/deliverables blocks** in section contentBlocks — scanned by `crSupplementalPool()`. "This section" filter shows current section's items.
- **`course.resources[]` array** — added to pool when scope is "course" ("Whole course" filter). Items get `sectionIdx = -1`.

### Resource Type Enum (Schema Line 127)

Valid types: `pdf`, `video`, `link`, `article`, `website`, `book`, `xlsx`, `xls`, `csv`, `docx`, `doc`, `pptx`, `ppt`, `zip`, `worksheet`, `toolkit`, `template`, `guide`, `guidelines`, `research`, `organization`, `standards`.

### Where Data Goes — Summary

| Data | Where It Lives | What It Feeds |
|---|---|---|
| `course.references[]` | Course-level array | References panel (`buildReferences`) |
| Conclusion text block | `.cr-references` CSS in final section | Inline reference list in lesson flow |
| `course.resources[]` | Course-level array | Supplemental drawer → "Whole course" filter |
| `resources`/`deliverables` blocks | Inside section contentBlocks | Supplemental drawer → "This section" filter + inline in lesson flow |

- ≥15 references for 3 CE courses. APA 7th, alphabetized by first author.
- References NEVER appear in content sections — only in conclusion + `course.references[]`.
- In-text citations (Author, Year) appear naturally in prose — full entries only in conclusion.

---

## §8 — Conclusion Section Structure (No Exceptions)

The final section is the conclusion. It synthesizes, consolidates, and sends the learner out with a concrete action plan. It is NOT a perfunctory "thank you for completing" — it is a substantive closing that should run 2,000–3,500 words depending on CE hours.

### Required Block Order

1. **sectionDivider** — "Course Summary & Review". Both title and subtitle required.
2. **text** — Synthesis Narrative (500–700 words). DO NOT simply repeat earlier content. Weave the course's themes together: how concepts from different sections connect, what the overall clinical picture looks like, and what has changed in the learner's understanding. Start with something like "Throughout this course, we've examined..." and build toward application.
3. **callout** — Clinical Integration callout (type: `"clinical"` or `"key"`). 4–6 points of "When you return to practice on Monday, remember..." — concrete, specific, actionable. Not abstract principles. This is the clinical callout for the conclusion.
4. **accordion** — Section Highlights (1 item per content section). Each item title = section title, content = 2–3 sentence summary of that section's key contribution.
5. **keyTakeaway** — Course-Level Key Takeaways (5–8 items). The definitive list of what the learner should walk away knowing and being able to do. More specific than the intro's "What You Will Take Away" — these reference actual content covered. This is the keyTakeaway for the conclusion.
6. **text** — Ethical Practice Plan (300–400 words). Prompt the learner to think about how this content integrates with their existing ethical obligations. Reference specific ACA Code sections or NBCC standards where relevant.
7. **reflection** — Course-level reflection prompt. "Based on everything you've learned in this course, identify one specific change you will make in your clinical practice within the next 30 days."
8. **resources block** — Downloadable/external links for post-course use.
9. **text** — References (APA 7th, `.cr-references` CSS class). This is the inline reference list that appears in the lesson flow.

> 🛑 The conclusion MUST have BOTH a `callout` block AND a `keyTakeaway` block, just like every content section. The callout is for clinical integration points. The keyTakeaway is for the definitive takeaway list. Omitting either makes the conclusion feel thin.

> ⚠ No knowledge checks in conclusion. Those go in the final exam assessment.

---

## §9 — Glossary System (Auto-Generated)

The viewer has a glossary/Key Terms drawer that auto-generates from course content. No manual glossary array is needed — the `buildGlossary()` function extracts terms from two sources:

1. **Bold-definition patterns in text blocks:** Write prose with `**Term** — definition sentence.` or `**Term**: definition sentence.` or `**Term** is/refers to/means definition sentence.` patterns. Terms must start with a capital letter, be 3–50 characters, and the definition must be 15+ characters.
2. **Flashcard front/back pairs:** Every `flashcardDeck` block's `flashcards[]` automatically feed the glossary. The front becomes the term, the back becomes the definition.

When the glossary has entries, the "Key terms" button appears in the reader header tools. The glossary drawer includes a search box and alphabetized list.

**Writing for the glossary:** When introducing key terms in your prose, use the bold-dash pattern consistently: `**Cognitive Behavioral Therapy (CBT)** — a structured, time-limited psychotherapy that focuses on the relationship between thoughts, feelings, and behaviors.` This gives you good prose AND a glossary entry for free.

---

## §10 — Inline Callout System

### Block-Level Callouts

Use `type: "callout"` or `type: "keyTakeaway"` as standalone content blocks (see §4).

### Inline Callouts (Inside text/imageText Blocks)

Embed `{{callout:id}}` in any text or imageText block's `content` field for styled tooltip pills:

```js
{ type: "text",
  content: "Always document {{callout:informedConsent}} before the first session.",
  callouts: { informedConsent: {
    label: "Informed Consent",
    body: "Client's voluntary agreement after disclosure...",
    type: "definition"
  }}}
```

### Built-In Callout IDs (No Setup Required)

| ID | Label | Pill Style |
|---|---|---|
| `hipaa` | HIPAA | green |
| `aca-code` | ACA Code of Ethics | sand |
| `duty-to-warn` | Duty to Warn | gold |
| `informed-consent` | Informed Consent | green |
| `telehealth-rule` | GA Rule 135 | sand |
| `mandatory-report` | Mandatory Reporting | red |
| `lpc-a-note` | LPC-A Note | navy |
| `nbcc-standard` | NBCC Standard | sand |
| `phi` | PHI | green |
| `gcscw` | GCSCW | sand |

Inline alerts: `{{alert:type}}` — for heavier-weight inline badges (e.g. `{{alert:ethics}}`, `{{alert:mandatory}}`).

---

## §11 — Validation Gates

These checks mirror `auditCourse.js`. The audit script is the authoritative gate — run it before every seed.

### Critical (Blocks Save / Publish)

- Total prose words ≥ `ceHours × 6,000` (6 CE = 36,000 minimum)
- Every section has a `sectionDivider` with `title` + `subtitle`
- Every section has at least one **`callout`** block AND one **`keyTakeaway`** block
- Introduction section follows §3 structure (opening hook, not "welcome" boilerplate)
- Conclusion section follows §8 structure (synthesis, not "thank you" boilerplate)
- Every `multipleChoice` has `correctAnswer` set (not undefined/null) AND at least one option with `isCorrect: true`
- No inline styles in content HTML
- No deprecated hex values (`#34495E`) in content HTML
- Assessment has ≥15 questions
- Assessment `passingScore` = 80
- References array has ≥15 entries
- References appear ONLY in conclusion section
- All options use `[{text, isCorrect}]` — never flat `[String]`
- `flashcardDeck` blocks use `flashcards` field, not `cards`
- `matching` blocks use `matchingPairs` field, not `pairs`
- `scenarioTree` blocks use `scenarioTitle + nodes:{}` pattern, not `scenario.choices`
- No unsupported block types (`clinicalVignette`, `references` as block type)
- Structure is `sections[]` (no `modules[]`)
- Model `validateSync()` passes (Mongoose schema validation)

### Warnings (Logs But Saves)

- Any section under 2,500 prose words
- Any section missing an interactive activity
- Any section missing a `callout` or `keyTakeaway`
- Answer distribution skewed (>40% one letter)
- Fewer than 4 learning objectives
- Missing `targetAudience` field
- More than 5 interactive blocks in a row (bunching)
- Any `#34495E` or `via.placeholder.com` string
- `knowledgeCheck`/`questions[]` wrappers present (should be expanded)
- `quiz`/`quizQuestions` inside sections (should be in top-level assessment)
- Empty text blocks (0 words)

---

## §12 — Seed Script Boilerplate

```js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { pathToFileURL } from 'url';
import { Course } from '../models/InteractiveCourse.js';

dotenv.config();

export const COURSE = { /* ... full course object ... */ };
export default COURSE;

async function seed() {
  if (!process.env.MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }
  await mongoose.connect(process.env.MONGODB_URI);

  let doc = await Course.findOne({ slug: COURSE.slug });
  if (doc) {
    doc.set(COURSE);
    console.log('Updating existing:', COURSE.slug);
  } else {
    doc = new Course(COURSE);
    console.log('Inserting new:', COURSE.slug);
  }
  await doc.save();   // pre-save hook computes wordCount
  console.log(`Saved ${doc.courseCode} — wordCount=${doc.wordCount}`);
  await mongoose.disconnect();
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  seed().catch(e => { console.error(e.message); process.exit(1); });
}
```

### Key Rules

- ES modules only (`import`, not `require`) — `server/package.json` has `"type": "module"`
- Self-contained — all content embedded as string literals, no `fs.readFileSync()`
- Uses `doc.save()` through Mongoose model — fires pre-save hook for wordCount
- `findOne` + `set` + `save` pattern (upsert) — not `deleteOne` + `insertOne`
- Connects with `process.env.MONGODB_URI` — no hardcoded connection strings
- Pushed to GitHub, run from Render shell — never pasted into Render shell
- Audit before running: `node src/scripts/auditCourse.js --file src/scripts/<file>.js`
- Naming convention: `seedCR-XXX-Title-{wordcount}words.js`

---

## §13 — Critical Don'ts

- 🛑 No `modules[]` — dead weight. Viewer renders `sections[]` only.
- 🛑 No flat `[String]` options — causes Mongoose char-explosion.
- 🛑 No `#34495E` for navy — use `#284157`.
- 🛑 No inline styles in content HTML — design system handles everything.
- 🛑 No ACEP metadata in content blocks — no "GAITP LLC", "Provider #7760", "Learn. License. Lead.", "Course Hours:", or "Target Audience:" in text blocks.
- 🛑 No `via.placeholder.com` image URLs — service is dead.
- 🛑 No `type: "references"` content blocks — no renderer exists; shows "Unsupported".
- 🛑 No `type: "clinicalVignette"` — no renderer; use text blocks with `<blockquote>`.
- 🛑 No `fs.readFileSync()` — all content embedded in the script.
- 🛑 Never pass existing prose through API for "restructuring" — strips 40–76% of content.
- 🛑 Never use raw `db.collection().insertOne` — use Mongoose model `doc.save()`.
- 🛑 No `knowledgeCheck` wrappers — expand to individual `multipleChoice` blocks.
- 🛑 No `quiz` blocks in sections — final exam lives in top-level `assessment`.
- 🛑 No sections without BOTH a `callout` AND a `keyTakeaway` — both block types are required in every section.
- 🛑 No weak introductions — opening section must have a clinical hook, not "Welcome to this course."
- 🛑 No weak conclusions — closing section must synthesize, not just say "Congratulations."
- 🛑 `flashcardDeck` field is `flashcards` not `cards`. `matching` field is `matchingPairs` not `pairs`. `scenarioTree` uses `nodes:{}` not `scenario.choices`.

---

## §14 — Course Richness Requirements

### Per Content Section (Including Intro and Conclusion)

- 1 accordion
- 1 **`callout`** block (rotating `calloutType` across sections: info, warning, ethics, clinical, tip, key, donot, protocol)
- 1 **`keyTakeaway`** block
- 1 reflection
- 2–3 varied knowledge check types (`multipleChoice`, `multiSelect`, `matching`) — exception: conclusion has 0 KCs
- 1 interactive activity — rotate through ALL FIVE: `scenarioTree`, `flashcardDeck`, `matching`, `cardSort`, `sequencing`

### Introduction Section Additions

- Opening hook text (300–500 words) — clinical vignette or striking statistic, never "welcome"
- Course roadmap text (200–400 words) — narrative preview of section flow
- 1 `imageText` (foundational framework)
- 1–2 baseline `multipleChoice` knowledge checks

### Conclusion Section Additions

- Synthesis narrative text (500–700 words) — not recap, synthesis
- Ethical practice plan text (300–400 words)
- 1 `resources` block (downloadable/external links)
- 1 references text block (`.cr-references` CSS)
- 0 knowledge checks (those go in assessment)

### Course-Level Totals

- ≥2 `videoEmbed` blocks
- ≥2 `imageText` blocks
- 1 `resources` block (in conclusion)
- ≥3 different interactive activity types total
- ≥1 table (HTML `<table>` in text blocks or `tableBlock`)
- 4–6 reflections total (not one per section)
- `callout` blocks in EVERY section (rotating types — never all "info")
- `keyTakeaway` blocks in EVERY section

> ⚠ Claude defaults to only `scenarioTree` + `flashcardDeck` + `matching`. Claude Code prompts must explicitly assign `cardSort` and `sequencing` to specific named sections.

> ⚠ Claude defaults to only using `callout` blocks. Claude Code prompts must explicitly require `keyTakeaway` blocks in every section and verify both are present.

---

*CounselorReady™ · GAITP LLC · NBCC ACEP #7760*
*Verified against laduwan/CounselorReady main branch — August 31, 2026*
