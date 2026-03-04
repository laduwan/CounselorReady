From 1d18701704b261c66a4a0f9cce8bec2c45ea2aa4 Mon Sep 17 00:00:00 2001
From: CounselorReady <ke@counselorready.com>
Date: Wed, 4 Mar 2026 05:07:27 +0000
Subject: [PATCH] design system: unified tokens, shared Tailwind config,
 deprecated color migration
MIME-Version: 1.0
Content-Type: text/plain; charset=UTF-8
Content-Transfer-Encoding: 8bit

- Added css/design-tokens.css: single CSS variable authority (Color_Spec_v1)
- Added css/typography.css: heading hierarchy (Cormorant Garamond + Lato)
- Added css/course-content.css: .cr-content wrapper + APA reference styles
- Added js/cr-tailwind-config.js: shared Tailwind CDN config for all HTML pages
- Updated COURSE_SCHEMA_SPEC.md to v2.0 (Sections 8-9: visual hierarchy + content style guide)
- Replaced 38 inline Tailwind configs with shared config import
- Fixed all deprecated hex values: #34495E→#284157, #40634A→#4A7C59, #FAFAF9/#FAFAF8→#F5F5DC
- Fixed React: tailwind.config.cjs stone→eggshell, index.css heading hierarchy
- Fixed server: certificates.js, ai.js, rebuildElephant.js deprecated colors
---
 COURSE_SCHEMA_SPEC.md                         | 508 ++++++++++++++++++
 client/public/404.html                        |   2 +-
 client/public/about.html                      |  56 +-
 client/public/admin-analytics.html            |  17 +-
 client/public/admin-bulk-upload.html          |  19 +-
 client/public/admin-coupons.html              |  19 +-
 client/public/admin-course-edit-1.html        |  24 +-
 client/public/admin-courses.html              |  18 +-
 client/public/admin-credentials.html          |   5 +
 client/public/admin-hardship.html             |  25 +-
 client/public/admin-help-articles.html        |  18 +-
 client/public/admin-help.html                 |  18 +-
 client/public/admin-import.html               |  20 +-
 client/public/admin-integrations.html         |  19 +-
 client/public/admin-messages.html             |  25 +-
 client/public/admin-migration.html            |  21 +-
 client/public/admin-users.html                |  19 +-
 client/public/admin-video-upload.html         |   5 +
 client/public/audit.html                      |  25 +-
 client/public/certificates.html               |  29 +-
 client/public/course-details.html             |  31 +-
 client/public/courses.html                    |  29 +-
 client/public/credentials.html                |  14 +-
 client/public/css                             | 135 -----
 client/public/css/course-content.css          | 329 ++++++++++++
 client/public/css/design-tokens.css           | 199 +++++++
 client/public/css/typography.css              | 196 +++++++
 client/public/dashboard.html                  |  35 +-
 client/public/forgot-password.html            |  52 +-
 client/public/help.html                       |  18 +-
 client/public/interactive-course.html         | 105 ++--
 client/public/js/cr-tailwind-config.js        | 135 +++++
 client/public/landing.html                    |  71 +--
 client/public/login.html                      |  52 +-
 client/public/messages.html                   |  24 +-
 client/public/privacy.html                    |  29 +-
 client/public/refund-policy.html              |  29 +-
 client/public/register.html                   |  29 +-
 client/public/reset-password.html             |  52 +-
 client/public/settings.html                   |  10 +-
 client/public/subscription.html               |  35 +-
 client/public/terms.html                      |  29 +-
 client/public/update-content.html             |  25 +-
 client/public/verify-email.html               |  27 +-
 client/public/verify.html                     |  21 +-
 client/public/welcome.html                    |  33 +-
 client/src/components/CloudinaryUploader.jsx  |   6 +-
 client/src/components/CourseBuilder.jsx       |   4 +-
 client/src/components/CourseViewer.jsx        |   8 +-
 .../InteractiveCourseComponents.jsx           |   2 +-
 client/src/components/NarrationPanel.jsx      |   4 +-
 .../src/components/interactive-course-14.html |  66 +--
 client/src/index.css                          |  48 +-
 client/src/pages/Landing.jsx                  |   2 +-
 client/tailwind.config.cjs                    |  11 +-
 server/src/routes/ai.js                       |   2 +-
 server/src/routes/certificates.js             |   2 +-
 server/src/scripts/rebuildElephant.js         |  10 +-
 58 files changed, 1664 insertions(+), 1137 deletions(-)
 create mode 100644 COURSE_SCHEMA_SPEC.md
 delete mode 100644 client/public/css
 create mode 100644 client/public/css/course-content.css
 create mode 100644 client/public/css/design-tokens.css
 create mode 100644 client/public/css/typography.css
 create mode 100644 client/public/js/cr-tailwind-config.js

diff --git a/COURSE_SCHEMA_SPEC.md b/COURSE_SCHEMA_SPEC.md
new file mode 100644
index 0000000..103e76b
--- /dev/null
+++ b/COURSE_SCHEMA_SPEC.md
@@ -0,0 +1,508 @@
+# CounselorReady Course Schema Specification
+**Version 2.0 — Source of Truth for All Course Development**
+**Read this document at the start of every session before writing any course, seed script, or database operation.**
+
+---
+
+## 1. Brand & Identity
+
+| Element | Value |
+|---|---|
+| Platform | CounselorReady |
+| Tagline | Learn. License. Lead. |
+| NBCC Provider | #7760 |
+| Legal Entity | GA Integrated Therapeutic Perspectives LLC (GAITP LLC) |
+| Burgundy | #6B1D34 |
+| Hunter Green | #4A7C59 |
+| Honey/Gold | #D4A855 |
+| Navy | #284157 |
+| Eggshell | #F5F5DC |
+
+**Color authority:** `CounselorReady_Color_Spec_v1.docx`
+**Code authority:** `client/public/css/design-tokens.css`
+When any file conflicts with the Color Spec or design tokens, the Color Spec wins.
+
+---
+
+## 2. ACEP Compliance Requirements
+
+Every published course MUST meet ALL of these:
+
+| Requirement | Standard |
+|---|---|
+| Word count | 6,000 words minimum per CE hour |
+| Knowledge checks | 2–3 per module (inline, not graded) |
+| Final exam | Minimum 15 questions |
+| Passing score | 80% |
+| Max attempts | 3 |
+| Learning objectives | Minimum 4, specific and measurable |
+| Target audience | Explicitly stated |
+| References | Minimum 3 peer-reviewed, each with title, author, year, source |
+
+---
+
+## 3. MongoDB Course Document Schema
+
+This is the EXACT structure every course must use. Field names, types, and nesting must match precisely.
+
+```javascript
+{
+  // —— IDENTITY ——————————————————————————————————
+  slug: String,           // kebab-case, unique, e.g. "cbt-core-techniques"
+  title: String,          // required
+  subtitle: String,       // optional tagline
+  description: String,    // 2–4 sentences, required
+  courseCode: String,     // e.g. "CR-101"
+  instructor: String,     // "GA Integrated Therapeutic Perspectives LLC"
+
+  // —— CE METADATA ———————————————————————————————
+  ceHours: Number,        // e.g. 3
+  ceCategory: String,     // "Ethics" | "Clinical" | "Cultural" | "General"
+  ceuHours: Number,       // same as ceHours
+  ceuEligible: Boolean,   // true
+  approvingBody: String,  // "NBCC"
+  approvalNumber: String, // "#7760"
+
+  // —— ACCESS & PRICING ——————————————————————————
+  accessType: String,     // "free" | "paid" | "subscription"
+  price: Number,          // e.g. 39.99 (omit or 0 if free)
+  pricingTier: String,    // "standard" | "premium" | "free"
+
+  // —— STATUS ————————————————————————————————————
+  status: String,         // "draft" | "published"
+  isPublished: Boolean,
+
+  // —— LEARNING OBJECTIVES ———————————————————————
+  objectives: [String],   // minimum 4 strings
+
+  // —— MODULES ———————————————————————————————————
+  modules: [
+    {
+      title: String,      // required
+      order: Number,      // 1-based
+      lessons: [
+        {
+          title: String,  // required
+          type: String,   // "text" | "quiz"
+          order: Number,  // 1-based within module
+          content: String, // HTML string (for type: "text")
+          
+          // —— QUIZ LESSON FIELDS (type: "quiz") ————————
+          isExam: Boolean,        // true only for final exam lesson
+          passingScore: Number,   // 80 (final exam only)
+          maxAttempts: Number,    // 3 (final exam only)
+          shuffleQuestions: Boolean,
+          showExplanations: Boolean, // FALSE for exams, true for knowledge checks
+          questions: [
+            {
+              question: String,   // required
+              type: String,       // "multiple_choice"
+              
+              // —— CRITICAL: OPTIONS FORMAT ——————————————
+              // ALWAYS use plain string array + correctAnswer index
+              // NEVER use {text, isCorrect} object format
+              options: [String],  // exactly 4 strings, no objects
+              correctAnswer: Number, // 0-based index of correct option
+              explanation: String // shown after answering
+            }
+          ]
+        }
+      ],
+      
+      // contentBlocks — only used for interactive/movie courses
+      // Standard courses use lessons[], not contentBlocks[]
+      contentBlocks: []   // leave empty for standard courses
+    }
+  ],
+
+  // —— FINAL ASSESSMENT (mirrors last module exam lesson) —
+  assessment: {
+    questions: [],        // same array as exam lesson questions
+    passingScore: 80,
+    maxAttempts: 3
+  },
+
+  // —— REFERENCES —————————————————————————————————
+  references: [
+    {
+      title: String,      // required — validation fails without this
+      author: String,     // required
+      year: Number,       // required
+      source: String      // journal, publisher, etc.
+    }
+  ],
+
+  // —— SETTINGS ——————————————————————————————————
+  settings: {
+    passingScore: 80,
+    certificateEnabled: true,
+    requireEvaluation: true,
+    requireAttestation: true
+  }
+}
+```
+
+---
+
+## 4. The Single Most Important Rule: Question Format
+
+**THIS HAS CAUSED MOST BUGS. READ CAREFULLY.**
+
+```javascript
+// ✅ CORRECT — always use this format
+{
+  question: "Which of the following is an example of X?",
+  type: "multiple_choice",
+  options: ["Option A", "Option B", "Option C", "Option D"],
+  correctAnswer: 2,   // 0-based index — Option C is correct
+  explanation: "Option C is correct because..."
+}
+
+// ❌ WRONG — never use this format (causes schema validation errors)
+{
+  question: "Which of the following is an example of X?",
+  type: "multiple_choice",
+  options: [
+    { text: "Option A", isCorrect: false },
+    { text: "Option B", isCorrect: false },
+    { text: "Option C", isCorrect: true },
+    { text: "Option D", isCorrect: false }
+  ]
+}
+```
+
+---
+
+## 5. Module & Lesson Structure Rules
+
+- Standard courses: each module has 1 content lesson (type: "text") + 1 quiz lesson (type: "quiz", isExam: false)
+- The LAST module gets the final exam lesson (type: "quiz", isExam: true) INSTEAD of a regular knowledge check
+- Final exam: minimum 15 questions, passingScore: 80, maxAttempts: 3, showExplanations: false
+- Knowledge checks: 2–5 questions, showExplanations: true, isExam: undefined/false
+- Do NOT add knowledge check AND final exam to the same module
+
+**Correct structure for a 3-module course:**
+```
+Module 1: [text lesson] [quiz lesson - knowledge check]
+Module 2: [text lesson] [quiz lesson - knowledge check]  
+Module 3: [text lesson] [quiz lesson - FINAL EXAM, isExam: true]
+```
+
+---
+
+## 6. References Format (Validation-Critical)
+
+References MUST include `title` or Mongoose will throw a validation error and the seed will fail silently.
+
+```javascript
+// ✅ CORRECT
+references: [
+  { title: "The body keeps the score", author: "van der Kolk, B. A.", year: 2014, source: "Viking" }
+]
+
+// ❌ WRONG — missing title causes validation failure
+references: [
+  { author: "van der Kolk, B. A.", year: 2014 }
+]
+```
+
+---
+
+## 7. Seed Script Requirements
+
+Every seed script must:
+
+1. Use ES module imports: `import mongoose from "mongoose"`
+2. Embed all content directly — no `require()` or file path references
+3. Connect via `process.env.MONGODB_URI`
+4. Be idempotent: check if course exists first, update if found, create if not
+5. Log CE statistics after creation including word count vs requirement
+6. Include minimum 3 references with all required fields
+
+Template opener:
+```javascript
+import mongoose from "mongoose";
+const MONGODB_URI = process.env.MONGODB_URI;
+if (!MONGODB_URI) { console.error("No MONGODB_URI"); process.exit(1); }
+
+const COURSE_DATA = { ... };
+
+async function main() {
+  await mongoose.connect(MONGODB_URI);
+  const Course = mongoose.connection.collection("courses");
+  
+  // Idempotent: update or create
+  const existing = await Course.findOne({ slug: COURSE_DATA.slug });
+  if (existing) {
+    await Course.updateOne({ slug: COURSE_DATA.slug }, { $set: COURSE_DATA });
+    console.log("Updated:", COURSE_DATA.title);
+  } else {
+    await Course.insertOne(COURSE_DATA);
+    console.log("Created:", COURSE_DATA.title);
+  }
+  await mongoose.disconnect();
+}
+main().catch(err => { console.error(err.message); process.exit(1); });
+```
+
+---
+
+## 8. Visual Hierarchy & Design System
+
+**THIS SECTION GOVERNS HOW EVERY COURSE LOOKS. READ BEFORE TOUCHING ANY RENDERING CODE.**
+
+### 8.1 Authority Chain
+
+1. **`CounselorReady_Color_Spec_v1.docx`** — Human-readable authority. All decisions trace here.
+2. **`client/public/css/design-tokens.css`** — Code authority. CSS custom properties consumed by all pages.
+3. **`client/public/css/typography.css`** — Font rules consuming the tokens.
+4. **`client/public/css/course-content.css`** — Content block rendering styles + APA reference formatting.
+5. **This section** — Session-to-session reference so every Claude/developer session enforces the same rules.
+
+If any file disagrees with the Color Spec or design-tokens.css, the Color Spec wins.
+
+### 8.2 Heading Hierarchy
+
+| Level | Font | Weight | Size | Color | Usage |
+|---|---|---|---|---|---|
+| H1 | Cormorant Garamond | 700 | 2.5rem / 40px | `#6B1D34` (Burgundy) | Course title, section dividers in player ONLY |
+| H2 | Cormorant Garamond | 600 | 1.75rem / 28px | `#284157` (Navy) | Module/topic headings inside content |
+| H3 | Lato | 700 | 1.25rem / 20px | `#4A7C59` (Hunter Green) | Sub-topic headings, panel titles |
+| H4 | Lato | 600 | 1.1rem / 17.6px | `#284157` (Navy) | List headers, small section titles |
+| Body | Lato | 400 | 1rem / 16px | `#2C2C2C` | All body content |
+| Small | Lato | 400 | 0.875rem / 14px | `#6B7280` | Captions, metadata, helper text |
+| Label | Lato | 600 | 0.75rem / 12px | `#284157` (Navy) | Form labels, badge text, tags |
+
+### 8.3 Block-Type Color Assignments
+
+| Category | Accent Color | Block Types |
+|---|---|---|
+| Content | Navy `#284157` | sectionDivider, text, imageText, image, accordion, resources, videoEmbed |
+| Knowledge Check | Burgundy `#6B1D34` | multipleChoice, multiSelect, matching, cardSort, sequencing, timeline |
+| Engagement | Hunter Green `#4A7C59` | reflection, scenarioTree, flashcardDeck, hotspot |
+| Progress / Awards | Honey `#D4A855` | Progress bars, completion badges, certificate elements |
+| Backgrounds | Eggshell `#F5F5DC` | Content area canvas; cards use white `#FFFFFF` |
+
+### 8.4 How to Import (Every Rendering Page)
+
+```html
+<!-- Add to <head> of every HTML page that renders course content -->
+<link rel="stylesheet" href="/css/design-tokens.css">
+<link rel="stylesheet" href="/css/typography.css">
+<link rel="stylesheet" href="/css/course-content.css">
+```
+
+For React components, import in `App.jsx` or `index.css`:
+```css
+@import url('/css/design-tokens.css');
+@import url('/css/typography.css');
+@import url('/css/course-content.css');
+```
+
+### 8.5 Rendering Content Blocks
+
+Wrap all rendered course HTML in `<div class="cr-content">`:
+
+```html
+<!-- Course player rendering a text content block -->
+<div class="cr-content">
+  <!-- innerHTML from lesson.content or contentBlock.textContent -->
+</div>
+```
+
+The `.cr-content` wrapper scopes the heading, paragraph, list, table, and blockquote styles so they apply only to course content — not to the player chrome, nav, or footer.
+
+### 8.6 Deprecated Colors — DO NOT USE
+
+| Old Hex | Name | Replace With |
+|---|---|---|
+| ~~`#40634A`~~ | Forest Green 600 | `var(--cr-green-500)` / `#4A7C59` |
+| ~~`#34495E`~~ | Old Navy | `var(--cr-navy-500)` / `#284157` |
+| ~~`#4B5D4B`~~ | Moss 600 | `var(--cr-green-500)` / `#4A7C59` |
+| ~~`#7D4E57`~~ | Dusty Rose 600 | `var(--cr-burgundy-700)` / `#8B2542` |
+| ~~`#FAFAF9`~~ | Stone 50 | `var(--cr-bg)` / `#F5F5DC` |
+| ~~`#F8F7F4`~~ | Settings bg | `var(--cr-bg)` / `#F5F5DC` |
+| ~~`#FAFAF8`~~ | React bg | `var(--cr-bg)` / `#F5F5DC` |
+| ~~`#F5F5F4`~~ | Stone 100 | `var(--cr-bg-alt)` / `#EDEDD0` |
+
+### 8.7 Inline Style Override
+
+`course-content.css` includes a safety net that neutralizes inline `style="color:..."` and `style="font-..."` on headings inside `.cr-content`. This catches legacy content blocks that have hardcoded colors. The correct fix is to strip inline styles from the database content, but the override prevents visual inconsistency in the meantime.
+
+---
+
+## 9. Content Style Guide
+
+**THIS SECTION GOVERNS HOW COURSE CONTENT IS WRITTEN AND FORMATTED.**
+
+### 9.1 Citation & Reference Format: APA 7th Edition
+
+All CounselorReady courses follow **APA 7th Edition** for:
+- In-text citations: `(Author, Year)` or `Author (Year)`
+- Reference lists: Full APA 7th format with hanging indent
+- Heading hierarchy: Adapted to the platform's design system (see Section 8.2)
+
+### 9.2 APA Heading Mapping
+
+APA defines 5 heading levels. CounselorReady maps them to the platform's visual hierarchy:
+
+| APA Level | APA Style | CounselorReady Mapping |
+|---|---|---|
+| Level 1 | Centered, Bold, Title Case | `<h2>` — Navy, Cormorant Garamond (H1 is reserved for course title) |
+| Level 2 | Left-Aligned, Bold, Title Case | `<h3>` — Hunter Green, Lato Bold |
+| Level 3 | Left-Aligned, Bold Italic, Title Case | `<h4>` — Navy, Lato Semibold |
+| Level 4 | Indented, Bold, Title Case, Period. | `<h4>` with `.cr-label` class or `<strong>` inline |
+| Level 5 | Indented, Bold Italic, Title Case, Period. | `<strong><em>` inline — rarely needed |
+
+### 9.3 In-Text Citations in Content Blocks
+
+Course HTML content must include parenthetical or narrative citations:
+
+```html
+<!-- ✅ CORRECT — in-text citation present -->
+<p>Cognitive behavioral therapy has demonstrated strong efficacy for treating
+depression and anxiety disorders (Beck, 2021). Linehan (2015) extended these
+principles to address emotion dysregulation through dialectical approaches.</p>
+
+<!-- ❌ WRONG — unsourced clinical claims -->
+<p>CBT is the best treatment for depression. DBT helps with emotion regulation.</p>
+```
+
+### 9.4 Semantic HTML Rules for Content Blocks
+
+Content stored in the database must use ONLY semantic HTML. The course player's CSS handles all visual treatment.
+
+```html
+<!-- ✅ CORRECT — semantic, no inline styles -->
+<h2>Cognitive Behavioral Therapy: Core Principles</h2>
+<p>Beck's cognitive model posits that dysfunctional thinking patterns
+influence emotions and behavior (Beck, 2021).</p>
+
+<h3>Automatic Thoughts</h3>
+<p>Automatic thoughts are spontaneous cognitions that arise in response
+to situations and are often distorted or unhelpful.</p>
+
+<blockquote>
+<p>Case Example: Maria, a 34-year-old Latina woman, presents with
+persistent negative automatic thoughts following a job loss...</p>
+</blockquote>
+
+<!-- ❌ WRONG — inline styles override the design system -->
+<h2 style="color: #284157; font-family: Georgia; font-size: 24px;">
+Cognitive Behavioral Therapy: Core Principles</h2>
+<p style="font-size: 14px; color: #333;">Beck's cognitive model...</p>
+```
+
+### 9.5 Allowed HTML Elements in Content Blocks
+
+| Element | Use For |
+|---|---|
+| `<h2>` | Module-level topic headings (APA Level 1) |
+| `<h3>` | Sub-topic headings (APA Level 2) |
+| `<h4>` | Minor sub-sections (APA Level 3) |
+| `<p>` | All body paragraphs |
+| `<ul>`, `<ol>`, `<li>` | Lists |
+| `<blockquote>` | Clinical vignettes, case examples, client quotes |
+| `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>` | Data tables, comparison charts |
+| `<strong>`, `<em>` | Inline emphasis |
+| `<figure>`, `<figcaption>` | Images with captions |
+| `<hr>` | Thematic section breaks |
+| `<div class="cr-callout-*">` | Callout boxes (clinical, ethics, info, tip) |
+
+### 9.6 Prohibited in Content Blocks
+
+| Prohibited | Why |
+|---|---|
+| `<h1>` | Reserved for course title rendered by the player |
+| `style="..."` on any element | Overrides the design system; use semantic tags instead |
+| `<font>` | Deprecated HTML; use CSS classes |
+| `<br><br>` for spacing | Use proper `<p>` tags with CSS margin |
+| Hardcoded hex colors | Use the design token CSS variables |
+| `<div>` without a `cr-*` class | Unstyled containers add no semantic value |
+
+### 9.7 Reference List Rendering
+
+References render using the `.cr-references` and `.cr-reference` CSS classes:
+
+```html
+<div class="cr-references">
+  <h2>References</h2>
+  <p class="cr-reference">American Counseling Association. (2014). <em>ACA code of ethics</em>. https://www.counseling.org/resources/aca-code-of-ethics.pdf</p>
+  <p class="cr-reference">Beck, J. S. (2021). <em>Cognitive behavior therapy: Basics and beyond</em> (3rd ed.). Guilford Press.</p>
+  <p class="cr-reference">van der Kolk, B. A. (2014). <em>The body keeps the score: Brain, mind, and body in the healing of trauma</em>. Viking.</p>
+</div>
+```
+
+The `.cr-reference` class applies APA hanging indent (2.25rem padding-left, -2.25rem text-indent).
+
+### 9.8 Writing Tone
+
+- Professional, academic tone appropriate for licensed clinicians
+- Prose paragraphs — minimize bullet lists except for specific enumerations
+- Clinical examples and case vignettes using `<blockquote>`
+- Practical application focus with evidence-based content
+- Balance theory with clinical skills
+- Every clinical claim must include an in-text citation
+
+### 9.9 Audit Flags
+
+The audit system should flag these content violations:
+
+| Flag | Severity | Description |
+|---|---|---|
+| `INLINE_STYLE` | Warning | Content block contains `style=` attribute |
+| `H1_IN_CONTENT` | Warning | Content block contains `<h1>` tag |
+| `NO_CITATIONS` | Error | Text lesson >500 words with zero `(Author, Year)` patterns |
+| `DEPRECATED_COLOR` | Warning | Content contains a deprecated hex value from Section 8.6 |
+| `FONT_TAG` | Warning | Content uses `<font>` element |
+
+---
+
+## 10. Deployment Workflow
+
+```
+1. Write/edit seed script locally
+2. Push to GitHub (src/scripts/)
+3. Wait for Render auto-deploy (check Render's Deploys tab)
+4. Run: node src/scripts/yourScript.js
+5. Run: node src/scripts/validateCourses.js
+6. Check admin panel to confirm
+```
+
+**Never run scripts via heredoc in the shell** — single quotes in content break heredoc parsing. Always push to GitHub and run from file.
+
+---
+
+## 11. Known Course Slugs (as of Feb 2026)
+
+| Slug | Title | CE Hours |
+|---|---|---|
+| aca-ethics-section-a-counseling-relationship | The CBT Toolbox | 3 |
+| dbt-skills-in-action | DBT Skills in Action | 3 |
+| motivational-interviewing-from-ambivalence-to-action | Motivational Interviewing | 3 |
+| suicide-risk-assessment-interactive | Suicide Risk Assessment (Interactive) | 3 |
+| crisis-intervention-and-suicide-prevention-a-comprehensive-clinical-guide | Crisis Intervention & Suicide Prevention | 3 |
+| 28-days-later-understanding-addiction-and-recovery | 28 Days Later: Addiction & Recovery | 3 |
+| it-takes-a-village-collaborative-care | It Takes a Village | 3 |
+| the-pursuit-of-happyness-treating-anxiety-and-depression | The Pursuit of Happyness | 3 |
+| narrative-therapy-techniques | Plot Twist: Narrative Therapy | 2 |
+| cultural-competence-ethics-risk-reduction-cr601 | Foundations of Cultural Competence | 3 |
+| small-warriors-big-battles-parental-incarceration | Small Warriors, Big Battles | 2 |
+| beyond-the-uniform-first-responder-families | Beyond the Uniform | 2 |
+| ethics-and-professional-bounds-in-counseling-practice | Ethics and Professional Boundaries | 3 |
+
+---
+
+## 12. Common Errors & Fixes
+
+| Error | Cause | Fix |
+|---|---|---|
+| `references.N.title is required` | Reference object missing title field | Add title to every reference object |
+| `options validation failed` | Used `{text, isCorrect}` object format | Use string array + correctAnswer index |
+| Course seeds but exam missing | Assessment had < 15 questions or wrong structure | Run fix script, add 15-question exam lesson to last module |
+| `MODULE_NOT_FOUND` on Render | Script not deployed yet | Push to GitHub, wait for deploy, then run |
+| Heredoc breaks mid-paste | Apostrophes in content terminate heredoc | Always use file-based approach, never heredoc |
+| Admin shows "No lessons yet" | Content in contentBlocks not lessons | Standard courses must use lessons[], not contentBlocks[] |
+| Inconsistent heading colors | Inline `style=` in content blocks | Strip inline styles; wrap content in `.cr-content` |
+| References not hanging indent | Missing `.cr-reference` class | Use `<p class="cr-reference">` in reference rendering |
+| Deprecated color in UI | Using `#34495E` or `#40634A` etc. | Replace with token — see Section 8.6 |
diff --git a/client/public/404.html b/client/public/404.html
index e361113..72f2bcb 100644
--- a/client/public/404.html
+++ b/client/public/404.html
@@ -8,7 +8,7 @@
     body { margin:0; font-family:'Lato',system-ui,sans-serif; background:#fafaf9; color:#2d0a14; display:flex; align-items:center; justify-content:center; min-height:100vh; }
     .box { text-align:center; padding:3rem; }
     .code { font-size:5rem; font-weight:700; color:#6B1D34; margin:0; }
-    .msg { font-size:1.25rem; color:#34495E; margin:1rem 0 2rem; }
+    .msg { font-size:1.25rem; color:#284157; margin:1rem 0 2rem; }
     a { display:inline-block; padding:0.75rem 2rem; background:linear-gradient(to right,#355E3B,#4A7C59); color:#fff; text-decoration:none; border-radius:0.5rem; font-weight:600; }
     a:hover { opacity:0.9; }
   </style>
diff --git a/client/public/about.html b/client/public/about.html
index 8e16700..06f1040 100644
--- a/client/public/about.html
+++ b/client/public/about.html
@@ -6,58 +6,10 @@
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>About - CounselorReady</title>
   <script src="https://cdn.tailwindcss.com"></script>
-  <script>
-    tailwind.config = {
-      theme: {
-        extend: {
-          colors: {
-            burgundy: {
-              50: '#fdf5f6',
-              100: '#fae8eb',
-              200: '#f5d0d6',
-              300: '#eba9b5',
-              400: '#dd768a',
-              500: '#c94d65',
-              600: '#a83350',
-              700: '#8b2542',
-              800: '#6b1d34',
-              900: '#4a1524',
-              950: '#2d0a14'
-            },
-            hunter: {
-              50: '#f5f8f5',
-              100: '#eaf0eb',
-              200: '#d5e1d7',
-              300: '#b5ccb9',
-              400: '#8fb096',
-              500: '#6a9472',
-              600: '#4A7C59',
-              700: '#355E3B',
-              800: '#2D4F33',
-              900: '#1F3825',
-              950: '#121f15'
-            },
-            honey: {
-              50: '#fdf9f0',
-              100: '#f9f0db',
-              200: '#f3e0b5',
-              300: '#eacd86',
-              400: '#D4A855',
-              500: '#c49545',
-              600: '#a67936',
-              700: '#865e2c',
-              800: '#6b4a25',
-              900: '#4d351b'
-            }
-          },
-          fontFamily: {
-            'display': ['Cormorant Garamond', 'Georgia', 'serif'],
-            'body': ['Lato', 'system-ui', 'sans-serif']
-          }
-        }
-      }
-    }
-  </script>
+    <script src="/js/cr-tailwind-config.js"></script>
+  <!-- CounselorReady Design System -->
+  <link rel="stylesheet" href="/css/design-tokens.css">
+  <link rel="stylesheet" href="/css/typography.css">
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Source+Serif+Pro:ital,wght@0,400;0,600;0,700;1,400&family=Source+Sans+Pro:wght@300;400;500;600;700&display=swap" rel="stylesheet">
diff --git a/client/public/admin-analytics.html b/client/public/admin-analytics.html
index e97337c..0d0ac4b 100644
--- a/client/public/admin-analytics.html
+++ b/client/public/admin-analytics.html
@@ -7,19 +7,10 @@
   <title>Analytics Dashboard - CounselorReady Admin</title>
   <script src="https://cdn.tailwindcss.com"></script>
   <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
-  <script>
-    tailwind.config = {
-      theme: {
-        extend: {
-          colors: {
-            burgundy: { 50: '#fdf5f6', 100: '#fae8eb', 200: '#f5d0d6', 700: '#8b2542', 800: '#6b1d34', 900: '#4a1524' },
-            forest: { 50: '#f3f6f4', 100: '#e3ebe5', 500: '#547c5f', 600: '#40634a', 700: '#34503d', 800: '#2b4133' },
-            gold: { 50: '#fefce8', 100: '#fef9c3', 400: '#facc15', 500: '#d4a012' }
-          }
-        }
-      }
-    }
-  </script>
+    <script src="/js/cr-tailwind-config.js"></script>
+  <!-- CounselorReady Design System -->
+  <link rel="stylesheet" href="/css/design-tokens.css">
+  <link rel="stylesheet" href="/css/typography.css">
   <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Lato:wght@300;400;500;600;700&display=swap" rel="stylesheet">
   <style>
     body { font-family: 'Lato', system-ui, sans-serif; }
diff --git a/client/public/admin-bulk-upload.html b/client/public/admin-bulk-upload.html
index a696175..16fdd38 100644
--- a/client/public/admin-bulk-upload.html
+++ b/client/public/admin-bulk-upload.html
@@ -5,20 +5,11 @@
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Bulk Course Upload - CounselorReady Admin</title>
   <script src="https://cdn.tailwindcss.com"></script>
-  <script>
-    tailwind.config = {
-      theme: {
-        extend: {
-          colors: {
-            burgundy: { 50: '#fdf5f6', 100: '#f5e6e8', 200: '#e8c4c9', 500: '#8b3a3a', 600: '#7a3333', 700: '#662929', 800: '#722F37', 900: '#5c2628' },
-            forest: { 50: '#f6f7f6', 100: '#e8ebe8', 200: '#d1d7d1', 600: '#4a5d4a', 700: '#3d4d3d', 800: '#2d3d2d' },
-            hunter: { 600: '#355E3B', 700: '#2d4f32' },
-            gold: { 100: '#fef9e7', 200: '#fcf3cf', 500: '#d4a84b', 800: '#9a7b4f' }
-          }
-        }
-      }
-    }
-  </script>
+    <script src="/js/cr-tailwind-config.js"></script>
+  <!-- CounselorReady Design System -->
+  <link rel="stylesheet" href="/css/design-tokens.css">
+  <link rel="stylesheet" href="/css/typography.css">
+  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Lato:wght@300;400;500;600;700&display=swap" rel="stylesheet">
 </head>
 <body class="bg-forest-50 min-h-screen">
   <div class="max-w-5xl mx-auto p-6">
diff --git a/client/public/admin-coupons.html b/client/public/admin-coupons.html
index ff0ae30..eb018e4 100644
--- a/client/public/admin-coupons.html
+++ b/client/public/admin-coupons.html
@@ -6,21 +6,10 @@
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Coupon Management - CounselorReady Admin</title>
   <script src="https://cdn.tailwindcss.com"></script>
-  <script>
-    tailwind.config = {
-      theme: {
-        extend: {
-          colors: {
-            burgundy: { 50: '#fdf5f6', 100: '#fae8eb', 200: '#f5d0d6', 700: '#8b2542', 800: '#6b1d34', 900: '#4a1524' },
-            forest: { 50: '#f3f6f4', 100: '#e3ebe5', 500: '#547c5f', 600: '#40634a', 700: '#34503d', 800: '#2b4133' },
-            hunter: { 100: '#e8f0ea', 200: '#d1e1d5', 500: '#4A7C59', 600: '#3d6649', 700: '#34503d' },
-            honey: { 100: '#fef3d1', 200: '#fde7a3', 400: '#D4A855', 500: '#c99a4a', 600: '#b8893f' },
-            gold: { 50: '#fefce8', 100: '#fef9c3', 400: '#facc15', 500: '#d4a012' }
-          }
-        }
-      }
-    }
-  </script>
+    <script src="/js/cr-tailwind-config.js"></script>
+  <!-- CounselorReady Design System -->
+  <link rel="stylesheet" href="/css/design-tokens.css">
+  <link rel="stylesheet" href="/css/typography.css">
   <link href="https://fonts.googleapis.com/css2?family=Source+Serif+Pro:wght@400;600;700&family=Source+Sans+Pro:wght@300;400;500;600;700&display=swap" rel="stylesheet">
   <link rel="stylesheet" href="/lib/fontawesome/css/all.min.css">
   <style>
diff --git a/client/public/admin-course-edit-1.html b/client/public/admin-course-edit-1.html
index 273728e..69c0c71 100644
--- a/client/public/admin-course-edit-1.html
+++ b/client/public/admin-course-edit-1.html
@@ -8,26 +8,16 @@
   <script src="https://cdn.tailwindcss.com"></script>
   <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700;800&family=Lato:wght@300;400;500;600;700&display=swap" rel="stylesheet">
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
-  <script>
-    tailwind.config = {
-      theme: { extend: {
-        colors: {
-          burgundy: { 50:'#FDF5F7',100:'#FAE8EB',200:'#F5D0D6',500:'#C94D65',700:'#8B2542',800:'#6B1D34',900:'#4A1524' },
-          navy: { 50:'#F0F4F7',100:'#D9E2EA',200:'#B3C5D4',300:'#7A98AE',400:'#4A6B82',500:'#284157',600:'#1F3345',700:'#172736' },
-          hunter: { 50:'#F2F7F4',100:'#E4EBE6',200:'#C9D7CD',300:'#A3BDA9',400:'#7A9E84',500:'#4A7C59',600:'#3D6A4A' },
-          honey: { 50:'#FDF9F0',100:'#F9F0DB',200:'#F3E0B5',300:'#EACD86',400:'#D4A855',500:'#C49545' },
-          forest: { 50:'#F2F7F4',100:'#E4EBE6',200:'#C9D7CD',300:'#A3BDA9',400:'#7A9E84',500:'#4A7C59',600:'#3D6A4A',700:'#305538' },
-        },
-        fontFamily: { display: ['Cormorant Garamond','Georgia','serif'], body: ['Lato','system-ui','sans-serif'] }
-      }}
-    }
-  </script>
+    <script src="/js/cr-tailwind-config.js"></script>
+  <!-- CounselorReady Design System -->
+  <link rel="stylesheet" href="/css/design-tokens.css">
+  <link rel="stylesheet" href="/css/typography.css">
   <style>
-    body { font-family: 'Lato', system-ui, sans-serif; background: #FAFAF9; }
+    body { font-family: 'Lato', system-ui, sans-serif; background: #F5F5DC; }
     .font-display { font-family: 'Cormorant Garamond', Georgia, serif; }
     .section-card { background: #fff; border: 1px solid #D1D5DB; border-radius: 12px; overflow: hidden; }
     .section-header { padding: 12px 20px; border-bottom: 1px solid #E5E7EB; display: flex; align-items: center; gap: 10px; cursor: pointer; user-select: none; }
-    .section-header:hover { background: #FAFAF9; }
+    .section-header:hover { background: #F5F5DC; }
     .section-body { padding: 20px; }
     .field-label { display: block; font-size: 12px; font-weight: 600; color: #284157; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
     .field-input { width: 100%; padding: 8px 12px; border: 1px solid #D1D5DB; border-radius: 8px; font-size: 14px; font-family: 'Lato', sans-serif; transition: border-color 0.15s; }
@@ -54,7 +44,7 @@
 <body class="min-h-screen">
 
   <!-- NAV -->
-  <nav class="bg-[#FAFAF9] border-b border-gray-300 px-6 h-14 flex items-center justify-between" style="box-shadow: 0 1px 3px rgba(0,0,0,0.06);">
+  <nav class="bg-[#F5F5DC] border-b border-gray-300 px-6 h-14 flex items-center justify-between" style="box-shadow: 0 1px 3px rgba(0,0,0,0.06);">
     <div class="flex items-center gap-2.5">
       <div class="w-9 h-9 rounded-lg bg-burgundy-800 relative overflow-hidden flex-shrink-0">
         <span class="absolute font-display font-extrabold text-honey-400" style="font-size:18px;top:5px;left:9px;">C</span>
diff --git a/client/public/admin-courses.html b/client/public/admin-courses.html
index 869f538..bc9f6eb 100644
--- a/client/public/admin-courses.html
+++ b/client/public/admin-courses.html
@@ -6,20 +6,10 @@
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Admin Courses - CounselorReady</title>
   <script src="https://cdn.tailwindcss.com"></script>
-  <script>
-    tailwind.config = {
-      theme: {
-        extend: {
-          colors: {
-            burgundy: { 50:'#fdf2f5',100:'#fce7ed',200:'#f8cfdb',300:'#f2a8be',700:'#8b2542',800:'#6b1d34',900:'#4a1524',950:'#2d0a14' },
-            forest: { 50:'#f2f7f4',100:'#e0ede5',200:'#c3dccc',300:'#98c3a9',400:'#6ba881',500:'#4a7c59',600:'#3d6549',700:'#33523d',800:'#2b4233' },
-            gold: { 50:'#fdf9ef',100:'#faf0d5',400:'#e4b54e',500:'#d4a855',600:'#b8893a',700:'#996b2e' },
-            navy: { 500:'#284157',600:'#1F3345',700:'#172736' }
-          }
-        }
-      }
-    }
-  </script>
+    <script src="/js/cr-tailwind-config.js"></script>
+  <!-- CounselorReady Design System -->
+  <link rel="stylesheet" href="/css/design-tokens.css">
+  <link rel="stylesheet" href="/css/typography.css">
   <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Lato:wght@300;400;500;600;700&display=swap" rel="stylesheet">
   <link rel="stylesheet" href="/lib/fontawesome/css/all.min.css">
   <style>
diff --git a/client/public/admin-credentials.html b/client/public/admin-credentials.html
index 27de808..8cdf235 100644
--- a/client/public/admin-credentials.html
+++ b/client/public/admin-credentials.html
@@ -6,6 +6,10 @@
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Credential Monitoring - CounselorReady Admin</title>
   <script src="https://cdn.tailwindcss.com"></script>
+  <script src="/js/cr-tailwind-config.js"></script>
+  <!-- CounselorReady Design System -->
+  <link rel="stylesheet" href="/css/design-tokens.css">
+  <link rel="stylesheet" href="/css/typography.css">
   <link rel="stylesheet" href="/lib/fontawesome/css/all.min.css">
   <style>
     .sidebar { width: 264px; }
@@ -15,6 +19,7 @@
       .main-content { margin-left: 0; }
     }
   </style>
+  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Lato:wght@300;400;500;600;700&display=swap" rel="stylesheet">
 </head>
 <body class="bg-gray-50">
   <!-- Admin Header -->
diff --git a/client/public/admin-hardship.html b/client/public/admin-hardship.html
index d62592d..14e3157 100644
--- a/client/public/admin-hardship.html
+++ b/client/public/admin-hardship.html
@@ -6,27 +6,10 @@
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Hardship Pause Admin - CounselorReady</title>
   <script src="https://cdn.tailwindcss.com"></script>
-  <script>
-    tailwind.config = {
-      theme: {
-        extend: {
-          colors: {
-            burgundy: {
-              50: '#fdf5f6', 100: '#fae8eb', 200: '#f5d0d6', 300: '#eba9b5',
-              400: '#dd768a', 500: '#c94d65', 600: '#a83350', 700: '#8b2542',
-              800: '#6b1d34', 900: '#4a1524', 950: '#2d0a14'
-            },
-            forest: {
-              50: '#f3f6f4', 100: '#e3ebe5', 200: '#c8d7cc', 300: '#a1bba8',
-              400: '#759a7f', 500: '#547c5f', 600: '#40634a', 700: '#34503d',
-              800: '#2b4133', 900: '#1f3025', 950: '#121c16'
-            },
-            gold: { 50: '#fefce8', 100: '#fef9c3', 200: '#fef08a', 300: '#fde047', 400: '#facc15', 500: '#d4a012' }
-          }
-        }
-      }
-    }
-  </script>
+    <script src="/js/cr-tailwind-config.js"></script>
+  <!-- CounselorReady Design System -->
+  <link rel="stylesheet" href="/css/design-tokens.css">
+  <link rel="stylesheet" href="/css/typography.css">
   <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Lato:wght@300;400;500;600;700&display=swap" rel="stylesheet">
   <style>
     body { font-family: 'Lato', system-ui, sans-serif; }
diff --git a/client/public/admin-help-articles.html b/client/public/admin-help-articles.html
index 66a89bc..bcaabd0 100644
--- a/client/public/admin-help-articles.html
+++ b/client/public/admin-help-articles.html
@@ -6,20 +6,10 @@
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Help Articles - CounselorReady Admin</title>
   <script src="https://cdn.tailwindcss.com"></script>
-  <script>
-    tailwind.config = {
-      theme: {
-        extend: {
-          colors: {
-            burgundy: { 50: '#fdf5f6', 100: '#fae8eb', 200: '#f5d0d6', 700: '#8b2542', 800: '#6b1d34', 900: '#4a1524' },
-            forest: { 50: '#f3f6f4', 100: '#e3ebe5', 500: '#547c5f', 600: '#40634a', 700: '#34503d', 800: '#2b4133' },
-            hunter: { 100: '#e8f0ea', 200: '#d1e1d5', 500: '#4A7C59', 600: '#3d6649', 700: '#34503d' },
-            honey: { 100: '#fef3d1', 200: '#fde7a3', 400: '#D4A855', 500: '#c99a4a', 600: '#b8893f' }
-          }
-        }
-      }
-    }
-  </script>
+    <script src="/js/cr-tailwind-config.js"></script>
+  <!-- CounselorReady Design System -->
+  <link rel="stylesheet" href="/css/design-tokens.css">
+  <link rel="stylesheet" href="/css/typography.css">
   <link href="https://fonts.googleapis.com/css2?family=Source+Serif+Pro:wght@400;600;700&family=Source+Sans+Pro:wght@300;400;500;600;700&display=swap" rel="stylesheet">
   <link rel="stylesheet" href="/lib/fontawesome/css/all.min.css">
   <!-- Markdown Editor -->
diff --git a/client/public/admin-help.html b/client/public/admin-help.html
index ab0b04c..29d6f8b 100644
--- a/client/public/admin-help.html
+++ b/client/public/admin-help.html
@@ -6,20 +6,10 @@
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Help Center - CounselorReady Admin</title>
   <script src="https://cdn.tailwindcss.com"></script>
-  <script>
-    tailwind.config = {
-      theme: {
-        extend: {
-          colors: {
-            burgundy: { 50: '#fdf5f6', 100: '#fae8eb', 200: '#f5d0d6', 700: '#8b2542', 800: '#6b1d34', 900: '#4a1524' },
-            forest: { 50: '#f3f6f4', 100: '#e3ebe5', 500: '#547c5f', 600: '#40634a', 700: '#34503d', 800: '#2b4133' },
-            hunter: { 100: '#e8f0ea', 200: '#d1e1d5', 500: '#4A7C59', 600: '#3d6649', 700: '#34503d' },
-            honey: { 100: '#fef3d1', 200: '#fde7a3', 400: '#D4A855', 500: '#c99a4a', 600: '#b8893f' }
-          }
-        }
-      }
-    }
-  </script>
+    <script src="/js/cr-tailwind-config.js"></script>
+  <!-- CounselorReady Design System -->
+  <link rel="stylesheet" href="/css/design-tokens.css">
+  <link rel="stylesheet" href="/css/typography.css">
   <link href="https://fonts.googleapis.com/css2?family=Source+Serif+Pro:wght@400;600;700&family=Source+Sans+Pro:wght@300;400;500;600;700&display=swap" rel="stylesheet">
   <link rel="stylesheet" href="/lib/fontawesome/css/all.min.css">
   <style>
diff --git a/client/public/admin-import.html b/client/public/admin-import.html
index 3a0ec2a..3e87243 100644
--- a/client/public/admin-import.html
+++ b/client/public/admin-import.html
@@ -5,21 +5,11 @@
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Course Content Importer - CounselorReady Admin</title>
   <script src="https://cdn.tailwindcss.com"></script>
-  <script>
-    tailwind.config = {
-      theme: {
-        extend: {
-          colors: {
-            burgundy: { 100: '#f5e6e8', 500: '#8b3a3a', 800: '#722F37', 900: '#5c2628' },
-            forest: { 50: '#f6f7f6', 100: '#e8ebe8', 200: '#d1d7d1', 600: '#4a5d4a', 700: '#3d4d3d' },
-            hunter: { 600: '#355E3B', 700: '#2d4f32' },
-            gold: { 100: '#fef9e7', 200: '#fcf3cf', 500: '#d4a84b', 800: '#9a7b4f' },
-            purple: { 50: '#f5f3ff', 100: '#ede9fe', 200: '#ddd6fe', 500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9' }
-          }
-        }
-      }
-    }
-  </script>
+    <script src="/js/cr-tailwind-config.js"></script>
+  <!-- CounselorReady Design System -->
+  <link rel="stylesheet" href="/css/design-tokens.css">
+  <link rel="stylesheet" href="/css/typography.css">
+  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Lato:wght@300;400;500;600;700&display=swap" rel="stylesheet">
 </head>
 <body class="bg-forest-50 min-h-screen">
   <div class="max-w-5xl mx-auto p-6">
diff --git a/client/public/admin-integrations.html b/client/public/admin-integrations.html
index b0aabb9..d347a4a 100644
--- a/client/public/admin-integrations.html
+++ b/client/public/admin-integrations.html
@@ -6,21 +6,10 @@
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Integrations - CounselorReady Admin</title>
   <script src="https://cdn.tailwindcss.com"></script>
-  <script>
-    tailwind.config = {
-      theme: {
-        extend: {
-          colors: {
-            burgundy: { 50: '#fdf5f6', 100: '#fae8eb', 200: '#f5d0d6', 700: '#8b2542', 800: '#6b1d34', 900: '#4a1524' },
-            forest: { 50: '#f3f6f4', 100: '#e3ebe5', 500: '#547c5f', 600: '#40634a', 700: '#34503d', 800: '#2b4133' },
-            hunter: { 100: '#e8f0ea', 200: '#d1e1d5', 500: '#4A7C59', 600: '#3d6649', 700: '#34503d' },
-            honey: { 100: '#fef3d1', 200: '#fde7a3', 400: '#D4A855', 500: '#c99a4a', 600: '#b8893f' },
-            gold: { 50: '#fefce8', 100: '#fef9c3', 400: '#facc15', 500: '#d4a012' }
-          }
-        }
-      }
-    }
-  </script>
+    <script src="/js/cr-tailwind-config.js"></script>
+  <!-- CounselorReady Design System -->
+  <link rel="stylesheet" href="/css/design-tokens.css">
+  <link rel="stylesheet" href="/css/typography.css">
   <link href="https://fonts.googleapis.com/css2?family=Source+Serif+Pro:wght@400;600;700&family=Source+Sans+Pro:wght@300;400;500;600;700&display=swap" rel="stylesheet">
   <link rel="stylesheet" href="/lib/fontawesome/css/all.min.css">
   <style>
diff --git a/client/public/admin-messages.html b/client/public/admin-messages.html
index c59f4d8..4d05b31 100644
--- a/client/public/admin-messages.html
+++ b/client/public/admin-messages.html
@@ -6,27 +6,10 @@
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Admin Messages - CounselorReady</title>
   <script src="https://cdn.tailwindcss.com"></script>
-  <script>
-    tailwind.config = {
-      theme: {
-        extend: {
-          colors: {
-            burgundy: {
-              50: '#fdf5f6', 100: '#fae8eb', 200: '#f5d0d6', 300: '#eba9b5',
-              400: '#dd768a', 500: '#c94d65', 600: '#a83350', 700: '#8b2542',
-              800: '#6b1d34', 900: '#4a1524', 950: '#2d0a14'
-            },
-            forest: {
-              50: '#f3f6f4', 100: '#e3ebe5', 200: '#c8d7cc', 300: '#a1bba8',
-              400: '#759a7f', 500: '#547c5f', 600: '#40634a', 700: '#34503d',
-              800: '#2b4133', 900: '#1f3025', 950: '#121c16'
-            },
-            gold: { 50: '#fefce8', 100: '#fef9c3', 200: '#fef08a', 300: '#fde047', 400: '#facc15', 500: '#d4a012' }
-          }
-        }
-      }
-    }
-  </script>
+    <script src="/js/cr-tailwind-config.js"></script>
+  <!-- CounselorReady Design System -->
+  <link rel="stylesheet" href="/css/design-tokens.css">
+  <link rel="stylesheet" href="/css/typography.css">
   <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Lato:wght@300;400;500;600;700&display=swap" rel="stylesheet">
   <style>
     body { font-family: 'Lato', sans-serif; }
diff --git a/client/public/admin-migration.html b/client/public/admin-migration.html
index 42e4ce2..0eb52a6 100644
--- a/client/public/admin-migration.html
+++ b/client/public/admin-migration.html
@@ -6,23 +6,10 @@
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Course Migration - CounselorReady Admin</title>
   <script src="https://cdn.tailwindcss.com"></script>
-  <script>
-    tailwind.config = {
-      theme: {
-        extend: {
-          colors: {
-            burgundy: { 50: '#fdf5f6', 100: '#fae8eb', 200: '#f5d0d6', 700: '#8b2542', 800: '#6b1d34', 900: '#4a1524' },
-            forest: { 50: '#f3f6f4', 100: '#e3ebe5', 500: '#547c5f', 600: '#40634a', 700: '#34503d', 800: '#2b4133' },
-            gold: { 50: '#fefce8', 100: '#fef9c3', 400: '#facc15', 500: '#d4a012' }
-          },
-          fontFamily: {
-            'display': ['Cormorant Garamond', 'Georgia', 'serif'],
-            'body': ['Lato', 'system-ui', 'sans-serif']
-          }
-        }
-      }
-    }
-  </script>
+    <script src="/js/cr-tailwind-config.js"></script>
+  <!-- CounselorReady Design System -->
+  <link rel="stylesheet" href="/css/design-tokens.css">
+  <link rel="stylesheet" href="/css/typography.css">
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Lato:wght@400;600;700&display=swap" rel="stylesheet">
diff --git a/client/public/admin-users.html b/client/public/admin-users.html
index 6f3d71b..98ab861 100644
--- a/client/public/admin-users.html
+++ b/client/public/admin-users.html
@@ -6,21 +6,10 @@
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>User Management - CounselorReady Admin</title>
   <script src="https://cdn.tailwindcss.com"></script>
-  <script>
-    tailwind.config = {
-      theme: {
-        extend: {
-          colors: {
-            burgundy: { 50: '#fdf5f6', 100: '#fae8eb', 200: '#f5d0d6', 700: '#8b2542', 800: '#6b1d34', 900: '#4a1524' },
-            forest: { 50: '#f3f6f4', 100: '#e3ebe5', 500: '#547c5f', 600: '#40634a', 700: '#34503d', 800: '#2b4133' },
-            hunter: { 100: '#e8f0ea', 200: '#d1e1d5', 500: '#4A7C59', 600: '#3d6649', 700: '#34503d' },
-            honey: { 100: '#fef3d1', 200: '#fde7a3', 400: '#D4A855', 500: '#c99a4a', 600: '#b8893f' },
-            gold: { 50: '#fefce8', 100: '#fef9c3', 400: '#facc15', 500: '#d4a012' }
-          }
-        }
-      }
-    }
-  </script>
+    <script src="/js/cr-tailwind-config.js"></script>
+  <!-- CounselorReady Design System -->
+  <link rel="stylesheet" href="/css/design-tokens.css">
+  <link rel="stylesheet" href="/css/typography.css">
   <link href="https://fonts.googleapis.com/css2?family=Source+Serif+Pro:wght@400;600;700&family=Source+Sans+Pro:wght@300;400;500;600;700&display=swap" rel="stylesheet">
   <link rel="stylesheet" href="/lib/fontawesome/css/all.min.css">
   <style>
diff --git a/client/public/admin-video-upload.html b/client/public/admin-video-upload.html
index f372018..d52342a 100644
--- a/client/public/admin-video-upload.html
+++ b/client/public/admin-video-upload.html
@@ -5,6 +5,10 @@
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>Video Upload - CounselorReady Admin</title>
     <script src="https://cdn.tailwindcss.com"></script>
+  <script src="/js/cr-tailwind-config.js"></script>
+  <!-- CounselorReady Design System -->
+  <link rel="stylesheet" href="/css/design-tokens.css">
+  <link rel="stylesheet" href="/css/typography.css">
     <link rel="stylesheet" href="/lib/fontawesome/css/all.min.css">
     <style>
         .upload-zone {
@@ -22,6 +26,7 @@
             transition: width 0.3s ease;
         }
     </style>
+  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Lato:wght@300;400;500;600;700&display=swap" rel="stylesheet">
 </head>
 <body class="bg-gray-50">
     <div class="max-w-4xl mx-auto p-6">
diff --git a/client/public/audit.html b/client/public/audit.html
index f8fd79c..bcf274d 100644
--- a/client/public/audit.html
+++ b/client/public/audit.html
@@ -6,27 +6,10 @@
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>CE Audit Report - CounselorReady</title>
   <script src="https://cdn.tailwindcss.com"></script>
-  <script>
-    tailwind.config = {
-      theme: {
-        extend: {
-          colors: {
-            burgundy: {
-              50: '#fdf5f6', 100: '#fae8eb', 200: '#f5d0d6', 300: '#eba9b5',
-              400: '#dd768a', 500: '#c94d65', 600: '#a83350', 700: '#8b2542',
-              800: '#6b1d34', 900: '#4a1524', 950: '#2d0a14'
-            },
-            forest: {
-              50: '#f3f6f4', 100: '#e3ebe5', 200: '#c8d7cc', 300: '#a1bba8',
-              400: '#759a7f', 500: '#547c5f', 600: '#40634a', 700: '#34503d',
-              800: '#2b4133', 900: '#1f3025', 950: '#121c16'
-            },
-            gold: { 50: '#fefce8', 100: '#fef9c3', 200: '#fef08a', 300: '#fde047', 400: '#facc15', 500: '#d4a012' }
-          }
-        }
-      }
-    }
-  </script>
+    <script src="/js/cr-tailwind-config.js"></script>
+  <!-- CounselorReady Design System -->
+  <link rel="stylesheet" href="/css/design-tokens.css">
+  <link rel="stylesheet" href="/css/typography.css">
   <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Lato:wght@300;400;500;600;700&display=swap" rel="stylesheet">
   <style>
     body { font-family: 'Lato', system-ui, sans-serif; }
diff --git a/client/public/certificates.html b/client/public/certificates.html
index 092b3dd..896161f 100644
--- a/client/public/certificates.html
+++ b/client/public/certificates.html
@@ -6,31 +6,10 @@
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Certificates - CounselorReady</title>
   <script src="https://cdn.tailwindcss.com"></script>
-  <script>
-    tailwind.config = {
-      theme: {
-        extend: {
-          colors: {
-            burgundy: {
-              50: '#fdf5f6', 100: '#fae8eb', 200: '#f5d0d6', 300: '#eba9b5',
-              400: '#dd768a', 500: '#c94d65', 600: '#a83350', 700: '#8b2542',
-              800: '#6b1d34', 900: '#4a1524', 950: '#2d0a14'
-            },
-            forest: {
-              50: '#f3f6f4', 100: '#e3ebe5', 200: '#c8d7cc', 300: '#a1bba8',
-              400: '#759a7f', 500: '#547c5f', 600: '#40634a', 700: '#34503d',
-              800: '#2b4133', 900: '#1f3025', 950: '#121c16'
-            },
-            gold: { 50: '#fefce8', 100: '#fef9c3', 200: '#fef08a', 300: '#fde047', 400: '#facc15', 500: '#d4a012' }
-          },
-          fontFamily: {
-            'display': ['Cormorant Garamond', 'Georgia', 'serif'],
-            'body': ['Lato', 'system-ui', 'sans-serif']
-          }
-        }
-      }
-    }
-  </script>
+    <script src="/js/cr-tailwind-config.js"></script>
+  <!-- CounselorReady Design System -->
+  <link rel="stylesheet" href="/css/design-tokens.css">
+  <link rel="stylesheet" href="/css/typography.css">
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Lato:wght@300;400;500;600;700&display=swap" rel="stylesheet">
diff --git a/client/public/course-details.html b/client/public/course-details.html
index cd68541..f926650 100644
--- a/client/public/course-details.html
+++ b/client/public/course-details.html
@@ -1,5 +1,4 @@
 <!DOCTYPE html>
-<html lang="en"><!DOCTYPE html>
 <html lang="en">
 <head>
   <link rel="icon" type="image/svg+xml" href="./favicon.svg">
@@ -7,31 +6,11 @@
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Course Details - CounselorReady</title>
   <script src="https://cdn.tailwindcss.com"></script>
-  <script>
-    tailwind.config = {
-      theme: {
-        extend: {
-          colors: {
-            burgundy: {
-              50: '#fdf5f6', 100: '#fae8eb', 200: '#f5d0d6', 300: '#eba9b5',
-              400: '#dd768a', 500: '#c94d65', 600: '#a83350', 700: '#8b2542',
-              800: '#6b1d34', 900: '#4a1524', 950: '#2d0a14'
-            },
-            forest: {
-              50: '#f3f6f4', 100: '#e3ebe5', 200: '#c8d7cc', 300: '#a1bba8',
-              400: '#759a7f', 500: '#547c5f', 600: '#40634a', 700: '#34503d',
-              800: '#2b4133', 900: '#1f3025', 950: '#121c16'
-            },
-            gold: { 50: '#fefce8', 100: '#fef9c3', 200: '#fef08a', 300: '#fde047', 400: '#facc15', 500: '#d4a012' }
-          },
-          fontFamily: {
-            'display': ['Cormorant Garamond', 'Georgia', 'serif'],
-            'body': ['Lato', 'system-ui', 'sans-serif']
-          }
-        }
-      }
-    }
-  </script>
+    <script src="/js/cr-tailwind-config.js"></script>
+  <!-- CounselorReady Design System -->
+  <link rel="stylesheet" href="/css/design-tokens.css">
+  <link rel="stylesheet" href="/css/typography.css">
+  <link rel="stylesheet" href="/css/course-content.css">
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Lato:wght@300;400;500;600;700&display=swap" rel="stylesheet">
diff --git a/client/public/courses.html b/client/public/courses.html
index 3a4d42f..84e3277 100644
--- a/client/public/courses.html
+++ b/client/public/courses.html
@@ -6,31 +6,10 @@
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Courses - CounselorReady</title>
   <script src="https://cdn.tailwindcss.com"></script>
-  <script>
-    tailwind.config = {
-      theme: {
-        extend: {
-          colors: {
-            burgundy: {
-              50: '#fdf5f6', 100: '#fae8eb', 200: '#f5d0d6', 300: '#eba9b5',
-              400: '#dd768a', 500: '#c94d65', 600: '#a83350', 700: '#8b2542',
-              800: '#6b1d34', 900: '#4a1524', 950: '#2d0a14'
-            },
-            forest: {
-              50: '#f3f6f4', 100: '#e3ebe5', 200: '#c8d7cc', 300: '#a1bba8',
-              400: '#759a7f', 500: '#547c5f', 600: '#40634a', 700: '#34503d',
-              800: '#2b4133', 900: '#1f3025', 950: '#121c16'
-            },
-            gold: { 50: '#fefce8', 100: '#fef9c3', 200: '#fef08a', 300: '#fde047', 400: '#facc15', 500: '#d4a012' }
-          },
-          fontFamily: {
-            'display': ['Cormorant Garamond', 'Georgia', 'serif'],
-            'body': ['Lato', 'system-ui', 'sans-serif']
-          }
-        }
-      }
-    }
-  </script>
+    <script src="/js/cr-tailwind-config.js"></script>
+  <!-- CounselorReady Design System -->
+  <link rel="stylesheet" href="/css/design-tokens.css">
+  <link rel="stylesheet" href="/css/typography.css">
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Lato:wght@300;400;500;600;700&display=swap" rel="stylesheet">
diff --git a/client/public/credentials.html b/client/public/credentials.html
index 11165b5..8b470e6 100644
--- a/client/public/credentials.html
+++ b/client/public/credentials.html
@@ -6,6 +6,10 @@
   <title>Credentials & CE Tracking | CounselorReady</title>
   <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 36 36'><rect width='36' height='36' rx='6' fill='%236B1D34'/><text x='9' y='16' font-family='Georgia' font-size='14' font-weight='800' fill='%23D4A855'>C</text><text x='14' y='22' font-family='Georgia' font-size='14' font-weight='800' fill='%237A9E84'>R</text></svg>">
   <script src="https://cdn.tailwindcss.com"></script>
+  <script src="/js/cr-tailwind-config.js"></script>
+  <!-- CounselorReady Design System -->
+  <link rel="stylesheet" href="/css/design-tokens.css">
+  <link rel="stylesheet" href="/css/typography.css">
   <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700;800&family=Lato:wght@300;400;500;600;700&display=swap" rel="stylesheet">
   <script>
 // import Credentials from './pages/Credentials';
@@ -27,7 +31,7 @@
     }
   </script>
   <style>
-    body { font-family: 'Lato', system-ui, sans-serif; background: #FAFAF9; }
+    body { font-family: 'Lato', system-ui, sans-serif; background: #F5F5DC; }
     .font-display { font-family: 'Cormorant Garamond', Georgia, serif; }
 
     /* Progress Ring Animation */
@@ -57,7 +61,7 @@
 <body class="min-h-screen">
 
   <!-- ═══ NAV ═══ -->
-  <nav class="bg-[#FAFAF9] border-b border-gray-300 px-6 h-14 flex items-center justify-between" style="box-shadow: 0 1px 3px rgba(0,0,0,0.06);">
+  <nav class="bg-[#F5F5DC] border-b border-gray-300 px-6 h-14 flex items-center justify-between" style="box-shadow: 0 1px 3px rgba(0,0,0,0.06);">
     <div class="flex items-center gap-2.5">
       <!-- Monogram Logo -->
       <div class="w-9 h-9 rounded-lg bg-burgundy-800 relative overflow-hidden flex-shrink-0">
@@ -372,7 +376,7 @@
       const offset = circ - (Math.min(percent, 100) / 100) * circ;
       return `
         <svg width="${size}" height="${size}" style="transform:rotate(-90deg)">
-          <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="#F5F5F4" stroke-width="${sw}"/>
+          <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="#EDEDD0" stroke-width="${sw}"/>
           <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-dasharray="${circ}" stroke-dashoffset="${offset}" stroke-linecap="round" class="ring-progress"/>
         </svg>
         <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;">
@@ -469,7 +473,7 @@
 
             <!-- Expanded Detail -->
             <div class="cred-detail ${isOpen ? 'open' : ''}" id="detail-${cred._id}">
-              <div class="border-t border-gray-200 px-5 py-4 bg-[#FAFAF9]">
+              <div class="border-t border-gray-200 px-5 py-4 bg-[#F5F5DC]">
                 <p class="text-[11px] font-bold text-navy-500 uppercase tracking-wider mb-2.5">Category Breakdown</p>
                 <div class="space-y-2 mb-4">${catHTML || '<p class="text-xs text-gray-400">No categories defined</p>'}</div>
                 <div class="flex gap-3 flex-wrap">
@@ -564,7 +568,7 @@
         const relatedCerts = certificates.filter(c => (c.credentials || []).includes(cred._id));
 
         return `
-          <div class="mb-4 p-4 rounded-lg border border-gray-200 bg-[#FAFAF9]">
+          <div class="mb-4 p-4 rounded-lg border border-gray-200 bg-[#F5F5DC]">
             <div class="flex justify-between items-center mb-3">
               <div class="flex items-center gap-2">
                 <span class="text-base font-bold text-gray-800">${cred.name || cred.code}</span>
diff --git a/client/public/css b/client/public/css
deleted file mode 100644
index 73cc899..0000000
--- a/client/public/css
+++ /dev/null
@@ -1,135 +0,0 @@
-/* ═══════════════════════════════════════════════════════════════
-   CounselorReady Unified Theme — cr-theme.css
-   Single source of truth for all color and typography tokens.
-   Reference: CounselorReady_Color_Spec_v1.docx
-   
-   USAGE: Add to any HTML page:
-   <link rel="stylesheet" href="/css/cr-theme.css">
-   
-   Then use: color: var(--cr-h1); background: var(--cr-bg);
-   ═══════════════════════════════════════════════════════════════ */
-
-:root {
-  /* ── Burgundy Scale ── */
-  --cr-burgundy-50:  #FDF5F7;
-  --cr-burgundy-100: #FAE8EB;
-  --cr-burgundy-200: #F5D0D6;
-  --cr-burgundy-300: #E8A4B2;
-  --cr-burgundy-400: #D4708A;
-  --cr-burgundy-500: #C94D65;
-  --cr-burgundy-600: #A83350;
-  --cr-burgundy-700: #8B2542;
-  --cr-burgundy-800: #6B1D34;  /* ★ PRIMARY */
-  --cr-burgundy-900: #4A1524;
-
-  /* ── Navy Scale ── */
-  --cr-navy-50:  #F0F4F7;
-  --cr-navy-100: #D9E2EA;
-  --cr-navy-200: #B3C5D4;
-  --cr-navy-300: #7A98AE;
-  --cr-navy-400: #4A6B82;
-  --cr-navy-500: #284157;  /* ★ PRIMARY */
-  --cr-navy-600: #1F3345;
-  --cr-navy-700: #172736;
-  --cr-navy-800: #101C27;
-
-  /* ── Hunter Green Scale ── */
-  --cr-green-50:  #F2F7F4;
-  --cr-green-100: #E4EBE6;
-  --cr-green-200: #C9D7CD;
-  --cr-green-300: #A3BDA9;
-  --cr-green-400: #7A9E84;
-  --cr-green-500: #4A7C59;  /* ★ PRIMARY */
-  --cr-green-600: #3D6A4A;
-  --cr-green-700: #305538;
-  --cr-green-800: #234027;
-
-  /* ── Honey / Gold Scale ── */
-  --cr-honey-50:  #FDF9F0;
-  --cr-honey-100: #F9F0DB;
-  --cr-honey-200: #F3E0B5;
-  --cr-honey-300: #EACD86;
-  --cr-honey-400: #D4A855;  /* ★ PRIMARY */
-  --cr-honey-500: #C49545;
-  --cr-honey-600: #A67936;
-  --cr-honey-700: #865E2C;
-  --cr-honey-800: #6B4A25;
-
-  /* ── Eggshell Scale ── */
-  --cr-eggshell-50:  #F5F5DC;  /* ★ PRIMARY */
-  --cr-eggshell-100: #EDEDD0;
-  --cr-eggshell-200: #E2E2BE;
-  --cr-eggshell-300: #D4D4A4;
-
-  /* ── Semantic Tokens ── */
-  /* Backgrounds */
-  --cr-bg:           #FAFAF9;                  /* Stone (kept per preference) */
-  --cr-card:         #FFFFFF;
-  --cr-border:       #D1D5DB;                  /* Gray 300 */
-  --cr-border-light: #F5F5F4;                  /* Stone 100 */
-
-  /* Text */
-  --cr-text:         #2C2C2C;
-  --cr-text-muted:   #6B7280;
-  --cr-text-light:   #9CA3AF;
-
-  /* Headings */
-  --cr-h1:           var(--cr-burgundy-800);   /* #6B1D34 */
-  --cr-h2:           var(--cr-navy-500);       /* #284157 */
-  --cr-h3:           var(--cr-green-500);      /* #4A7C59 */
-
-  /* Buttons */
-  --cr-btn-primary:       var(--cr-green-500);     /* #4A7C59 */
-  --cr-btn-primary-hover: var(--cr-green-600);     /* #3D6A4A */
-  --cr-btn-cta:           var(--cr-burgundy-800);  /* #6B1D34 */
-  --cr-btn-cta-hover:     var(--cr-burgundy-700);  /* #8B2542 */
-
-  /* Accent / Feedback */
-  --cr-accent:       var(--cr-honey-400);      /* #D4A855 */
-  --cr-success:      #059669;
-  --cr-error:        #DC2626;
-  --cr-warning:      var(--cr-honey-400);      /* #D4A855 */
-
-  /* Links */
-  --cr-link:         var(--cr-navy-500);       /* #284157 */
-  --cr-link-hover:   var(--cr-burgundy-800);   /* #6B1D34 */
-
-  /* Layout */
-  --cr-nav-bg:       var(--cr-burgundy-800);   /* #6B1D34 */
-  --cr-footer-bg:    var(--cr-navy-500);       /* #284157 */
-  --cr-intervention: var(--cr-green-500);      /* #4A7C59 */
-
-  /* ── Typography ── */
-  --cr-font-display: 'Cormorant Garamond', Georgia, serif;
-  --cr-font-body:    'Lato', system-ui, sans-serif;
-}
-
-/* ── Base Resets ── */
-body {
-  font-family: var(--cr-font-body);
-  background: var(--cr-bg);
-  color: var(--cr-text);
-}
-
-h1, .cr-h1 {
-  font-family: var(--cr-font-display);
-  color: var(--cr-h1);
-}
-
-h2, .cr-h2 {
-  font-family: var(--cr-font-display);
-  color: var(--cr-h2);
-}
-
-h3, .cr-h3 {
-  font-family: var(--cr-font-body);
-  color: var(--cr-h3);
-  font-weight: 700;
-}
-
-a {
-  color: var(--cr-link);
-}
-a:hover {
-  color: var(--cr-link-hover);
-}
diff --git a/client/public/css/course-content.css b/client/public/css/course-content.css
new file mode 100644
index 0000000..9ef5d09
--- /dev/null
+++ b/client/public/css/course-content.css
@@ -0,0 +1,329 @@
+/* ═══════════════════════════════════════════════════════════════════
+   CounselorReady Course Content Styles v1.0
+   Depends on: design-tokens.css, typography.css
+   
+   Deploy to: client/public/css/course-content.css
+   
+   PURPOSE: Styles semantic HTML rendered inside course content blocks.
+   This ensures that every <h2>, <h3>, <p>, <blockquote>, <table> etc.
+   inside a content block looks identical whether rendered in:
+     - interactive-course.html  (public player)
+     - admin-course-preview.html (admin preview)
+     - CourseBuilder.jsx content preview pane
+     - course-details.html references section
+   
+   RULE: Course content stored in the database must use ONLY semantic
+   HTML tags (<h2>, <h3>, <p>, <ul>, <ol>, <blockquote>, <table>).
+   NEVER inline style= attributes. This stylesheet handles all visuals.
+   ═══════════════════════════════════════════════════════════════════ */
+
+
+/* ── Content Container ────────────────────────────────────────────
+   Wrap all rendered course content in .cr-content to scope styles.
+   This prevents leaking into nav, footer, or admin chrome.
+   ──────────────────────────────────────────────────────────────── */
+.cr-content {
+  max-width: 800px;
+  margin: 0 auto;
+  padding: var(--cr-space-lg);
+  background: var(--cr-bg-card);
+  color: var(--cr-text);
+  font-family: var(--cr-font-body);
+  font-size: var(--cr-text-body);
+  line-height: var(--cr-leading-relaxed);
+}
+
+
+/* ── Headings inside content ──────────────────────────────────────
+   H1 is NEVER used inside content blocks.
+   The course player renders the course title as H1.
+   Content starts at H2.
+   ──────────────────────────────────────────────────────────────── */
+.cr-content h1 {
+  /* Override — H1 should not appear inside content blocks.
+     If it does (legacy data), downgrade visually to H2. */
+  font-family: var(--cr-font-display);
+  font-size: var(--cr-text-h2);
+  font-weight: var(--cr-weight-h2);
+  color: var(--cr-h2);
+  line-height: var(--cr-leading-tight);
+  margin: var(--cr-space-xl) 0 var(--cr-space-md);
+  border-bottom: 2px solid var(--cr-burgundy-100);
+  padding-bottom: var(--cr-space-sm);
+}
+
+.cr-content h2 {
+  font-family: var(--cr-font-display);
+  font-size: var(--cr-text-h2);
+  font-weight: var(--cr-weight-h2);
+  color: var(--cr-h2);
+  line-height: var(--cr-leading-tight);
+  margin: var(--cr-space-xl) 0 var(--cr-space-md);
+  border-bottom: 2px solid var(--cr-navy-100);
+  padding-bottom: var(--cr-space-sm);
+}
+
+.cr-content h3 {
+  font-family: var(--cr-font-body);
+  font-size: var(--cr-text-h3);
+  font-weight: var(--cr-weight-h3);
+  color: var(--cr-h3);
+  line-height: var(--cr-leading-tight);
+  margin: var(--cr-space-lg) 0 var(--cr-space-sm);
+}
+
+.cr-content h4 {
+  font-family: var(--cr-font-body);
+  font-size: var(--cr-text-h4);
+  font-weight: var(--cr-weight-h4);
+  color: var(--cr-h4);
+  margin: var(--cr-space-lg) 0 var(--cr-space-sm);
+}
+
+
+/* ── Body Text ────────────────────────────────────────────────────── */
+.cr-content p {
+  margin-bottom: var(--cr-space-md);
+  line-height: var(--cr-leading-relaxed);
+}
+
+
+/* ── Lists ────────────────────────────────────────────────────────── */
+.cr-content ul,
+.cr-content ol {
+  margin: var(--cr-space-sm) 0 var(--cr-space-md);
+  padding-left: var(--cr-space-xl);
+}
+
+.cr-content li {
+  margin-bottom: var(--cr-space-xs);
+  line-height: var(--cr-leading-relaxed);
+}
+
+.cr-content li::marker {
+  color: var(--cr-green-500);
+}
+
+.cr-content ol li::marker {
+  color: var(--cr-navy-500);
+  font-weight: 600;
+}
+
+
+/* ── Clinical Vignettes / Case Examples ───────────────────────────── */
+.cr-content blockquote {
+  border-left: 4px solid var(--cr-honey-400);
+  background: var(--cr-honey-50);
+  padding: var(--cr-space-md) var(--cr-space-lg);
+  margin: var(--cr-space-lg) 0;
+  border-radius: 0 var(--cr-radius-sm) var(--cr-radius-sm) 0;
+  font-style: italic;
+  color: var(--cr-navy-600);
+}
+
+
+/* ── Tables ───────────────────────────────────────────────────────── */
+.cr-content table {
+  width: 100%;
+  border-collapse: collapse;
+  margin: var(--cr-space-lg) 0;
+  font-size: var(--cr-text-small);
+  border: 1px solid var(--cr-border);
+  border-radius: var(--cr-radius-sm);
+  overflow: hidden;
+}
+
+.cr-content thead th {
+  background: var(--cr-navy-50);
+  color: var(--cr-navy-500);
+  font-weight: var(--cr-weight-label);
+  text-align: left;
+  padding: var(--cr-space-sm) var(--cr-space-md);
+  border-bottom: 2px solid var(--cr-navy-200);
+  font-size: var(--cr-text-label);
+  text-transform: uppercase;
+  letter-spacing: 0.04em;
+}
+
+.cr-content tbody td {
+  padding: var(--cr-space-sm) var(--cr-space-md);
+  border-bottom: 1px solid var(--cr-border-light);
+  vertical-align: top;
+}
+
+.cr-content tbody tr:last-child td {
+  border-bottom: none;
+}
+
+
+/* ── Emphasis Boxes (wrap in <div class="cr-callout-*">) ──────────── */
+.cr-content .cr-callout-clinical {
+  background: var(--cr-green-50);
+  border-left: 4px solid var(--cr-green-500);
+  padding: var(--cr-space-md) var(--cr-space-lg);
+  margin: var(--cr-space-lg) 0;
+  border-radius: 0 var(--cr-radius-sm) var(--cr-radius-sm) 0;
+}
+
+.cr-content .cr-callout-ethics {
+  background: var(--cr-burgundy-50);
+  border-left: 4px solid var(--cr-burgundy-800);
+  padding: var(--cr-space-md) var(--cr-space-lg);
+  margin: var(--cr-space-lg) 0;
+  border-radius: 0 var(--cr-radius-sm) var(--cr-radius-sm) 0;
+}
+
+.cr-content .cr-callout-info {
+  background: var(--cr-navy-50);
+  border-left: 4px solid var(--cr-navy-500);
+  padding: var(--cr-space-md) var(--cr-space-lg);
+  margin: var(--cr-space-lg) 0;
+  border-radius: 0 var(--cr-radius-sm) var(--cr-radius-sm) 0;
+}
+
+.cr-content .cr-callout-tip {
+  background: var(--cr-honey-50);
+  border-left: 4px solid var(--cr-honey-400);
+  padding: var(--cr-space-md) var(--cr-space-lg);
+  margin: var(--cr-space-lg) 0;
+  border-radius: 0 var(--cr-radius-sm) var(--cr-radius-sm) 0;
+}
+
+
+/* ── Images inside content ────────────────────────────────────────── */
+.cr-content img {
+  max-width: 100%;
+  height: auto;
+  border-radius: var(--cr-radius-sm);
+  margin: var(--cr-space-md) 0;
+}
+
+.cr-content figure {
+  margin: var(--cr-space-lg) 0;
+  text-align: center;
+}
+
+.cr-content figcaption {
+  font-size: var(--cr-text-small);
+  color: var(--cr-text-muted);
+  margin-top: var(--cr-space-xs);
+  font-style: italic;
+}
+
+
+/* ── Horizontal Rules (section breaks within content) ─────────────── */
+.cr-content hr {
+  border: none;
+  height: 1px;
+  background: var(--cr-border);
+  margin: var(--cr-space-xl) 0;
+}
+
+
+/* ═══════════════════════════════════════════════════════════════════
+   APA REFERENCES
+   Applied to the references section in course-details.html,
+   the course player, and CourseBuilder references module.
+   ═══════════════════════════════════════════════════════════════════ */
+
+.cr-references {
+  font-family: var(--cr-font-body);
+  font-size: var(--cr-text-small);
+  color: var(--cr-text);
+  line-height: var(--cr-leading-relaxed);
+}
+
+.cr-references h2 {
+  font-family: var(--cr-font-display);
+  font-size: var(--cr-text-h2);
+  font-weight: var(--cr-weight-h2);
+  color: var(--cr-h2);
+  margin-bottom: var(--cr-space-lg);
+  border-bottom: 2px solid var(--cr-navy-100);
+  padding-bottom: var(--cr-space-sm);
+}
+
+/* APA hanging indent: first line flush, subsequent lines indented */
+.cr-reference {
+  padding-left: 2.25rem;
+  text-indent: -2.25rem;
+  margin-bottom: var(--cr-space-md);
+  line-height: var(--cr-leading-relaxed);
+}
+
+/* Italicize source titles (journal names, book titles) */
+.cr-reference em,
+.cr-reference .cr-ref-source {
+  font-style: italic;
+}
+
+/* DOI / URL links in references */
+.cr-reference a {
+  color: var(--cr-link);
+  text-decoration: none;
+  word-break: break-all;
+}
+
+.cr-reference a:hover {
+  color: var(--cr-link-hover);
+  text-decoration: underline;
+}
+
+
+/* ═══════════════════════════════════════════════════════════════════
+   SECTION DIVIDERS (course player module/section headers)
+   ═══════════════════════════════════════════════════════════════════ */
+
+.cr-section-header {
+  background: linear-gradient(135deg, var(--cr-navy-500), var(--cr-navy-600));
+  color: var(--cr-text-inverse);
+  padding: var(--cr-space-xl) var(--cr-space-lg);
+  border-radius: var(--cr-radius-md);
+  margin: var(--cr-space-xl) 0 var(--cr-space-lg);
+}
+
+.cr-section-header h2 {
+  font-family: var(--cr-font-display);
+  font-size: var(--cr-text-h1);
+  font-weight: var(--cr-weight-h1);
+  color: var(--cr-text-inverse);
+  border: none;
+  margin: 0 0 var(--cr-space-xs);
+  padding: 0;
+}
+
+.cr-section-header .cr-section-subtitle {
+  font-family: var(--cr-font-body);
+  font-size: var(--cr-text-body);
+  color: var(--cr-navy-200);
+  font-weight: 300;
+}
+
+
+/* ═══════════════════════════════════════════════════════════════════
+   INLINE STYLE OVERRIDE
+   Neutralizes inline style= attributes in legacy content blocks.
+   This is a safety net — the real fix is to strip inline styles
+   from seed scripts and database content.
+   ═══════════════════════════════════════════════════════════════════ */
+
+.cr-content [style*="color"] {
+  color: inherit !important;
+}
+
+.cr-content [style*="font-family"] {
+  font-family: inherit !important;
+}
+
+.cr-content [style*="font-size"] {
+  font-size: inherit !important;
+}
+
+.cr-content h2[style],
+.cr-content h3[style],
+.cr-content h4[style] {
+  color: inherit !important;
+  font-family: inherit !important;
+  font-size: inherit !important;
+  font-weight: inherit !important;
+}
diff --git a/client/public/css/design-tokens.css b/client/public/css/design-tokens.css
new file mode 100644
index 0000000..96a2455
--- /dev/null
+++ b/client/public/css/design-tokens.css
@@ -0,0 +1,199 @@
+/* ═══════════════════════════════════════════════════════════════════
+   CounselorReady Design Tokens v1.0
+   Source of truth: CounselorReady_Color_Spec_v1.docx
+   
+   Deploy to: client/public/css/design-tokens.css
+   Import in: Every HTML page and React entry point
+   
+   RULE: If this file and any other file disagree, THIS FILE WINS.
+   ═══════════════════════════════════════════════════════════════════ */
+
+:root {
+
+  /* ── BURGUNDY SCALE ─────────────────────────────────────────────
+     Role: Primary brand · H1 headings · CTAs · Alerts · Logo
+     Primary: 800 ★                                                */
+  --cr-burgundy-50:  #FDF5F7;
+  --cr-burgundy-100: #FAE8EB;
+  --cr-burgundy-200: #F5D0D6;
+  --cr-burgundy-300: #E8A4B2;
+  --cr-burgundy-400: #D4708A;
+  --cr-burgundy-500: #C94D65;
+  --cr-burgundy-600: #A83350;
+  --cr-burgundy-700: #8B2542;
+  --cr-burgundy-800: #6B1D34;  /* ★ PRIMARY */
+  --cr-burgundy-900: #4A1524;
+
+  /* ── NAVY SCALE ─────────────────────────────────────────────────
+     Role: H2 headings · Body emphasis · Footers · Secondary text
+     Primary: 500 ★                                                */
+  --cr-navy-50:  #F0F4F7;
+  --cr-navy-100: #D9E2EA;
+  --cr-navy-200: #B3C5D4;
+  --cr-navy-300: #7A98AE;
+  --cr-navy-400: #4A6B82;
+  --cr-navy-500: #284157;  /* ★ PRIMARY */
+  --cr-navy-600: #1F3345;
+  --cr-navy-700: #172736;
+  --cr-navy-800: #101C27;
+
+  /* ── HUNTER GREEN SCALE ─────────────────────────────────────────
+     Role: Primary buttons · Navigation · Success · Intervention
+     Primary: 500 ★                                                */
+  --cr-green-50:  #F2F7F4;
+  --cr-green-100: #E4EBE6;
+  --cr-green-200: #C9D7CD;
+  --cr-green-300: #A3BDA9;
+  --cr-green-400: #7A9E84;
+  --cr-green-500: #4A7C59;  /* ★ PRIMARY */
+  --cr-green-600: #3D6A4A;
+  --cr-green-700: #305538;
+  --cr-green-800: #234027;
+
+  /* ── HONEY / GOLD SCALE ─────────────────────────────────────────
+     Role: Highlights · Badges · Awards · Progress bars · Accents
+     Primary: 400 ★                                                */
+  --cr-honey-50:  #FDF9F0;
+  --cr-honey-100: #F9F0DB;
+  --cr-honey-200: #F3E0B5;
+  --cr-honey-300: #EACD86;
+  --cr-honey-400: #D4A855;  /* ★ PRIMARY */
+  --cr-honey-500: #C49545;
+  --cr-honey-600: #A67936;
+  --cr-honey-700: #865E2C;
+  --cr-honey-800: #6B4A25;
+
+  /* ── EGGSHELL SCALE ─────────────────────────────────────────────
+     Role: Page backgrounds · Content areas · Canvas
+     Primary: 50 ★                                                 */
+  --cr-eggshell-50:  #F5F5DC;  /* ★ PRIMARY */
+  --cr-eggshell-100: #EDEDD0;
+  --cr-eggshell-200: #E2E2BE;
+  --cr-eggshell-300: #D4D4A4;
+
+
+  /* ═══════════════════════════════════════════════════════════════
+     SEMANTIC TOKENS
+     Use THESE in components — never raw scale values.
+     ═══════════════════════════════════════════════════════════════ */
+
+  /* ── Backgrounds ──────────────────────────────────────────────── */
+  --cr-bg:             var(--cr-eggshell-50);     /* Page background */
+  --cr-bg-card:        #FFFFFF;                    /* Card / panel */
+  --cr-bg-alt:         var(--cr-eggshell-100);     /* Alternate rows */
+  --cr-bg-nav:         var(--cr-burgundy-800);     /* Navigation bar */
+  --cr-bg-footer:      var(--cr-navy-500);         /* Footer */
+
+  /* ── Borders ──────────────────────────────────────────────────── */
+  --cr-border:         var(--cr-eggshell-200);     /* Default border */
+  --cr-border-light:   var(--cr-eggshell-100);     /* Light divider */
+  --cr-border-accent:  var(--cr-burgundy-100);     /* Accent border */
+
+  /* ── Text ─────────────────────────────────────────────────────── */
+  --cr-text:           #2C2C2C;                    /* Primary body */
+  --cr-text-muted:     #6B7280;                    /* Secondary */
+  --cr-text-light:     #9CA3AF;                    /* Placeholder */
+  --cr-text-inverse:   #FFFFFF;                    /* On dark bg */
+
+  /* ── Headings ─────────────────────────────────────────────────── */
+  --cr-h1:             var(--cr-burgundy-800);     /* #6B1D34 */
+  --cr-h2:             var(--cr-navy-500);          /* #284157 */
+  --cr-h3:             var(--cr-green-500);         /* #4A7C59 */
+  --cr-h4:             var(--cr-navy-500);          /* #284157 */
+
+  /* ── Buttons ──────────────────────────────────────────────────── */
+  --cr-btn-primary-bg:    var(--cr-green-500);
+  --cr-btn-primary-hover: var(--cr-green-600);
+  --cr-btn-primary-active:var(--cr-green-700);
+  --cr-btn-cta-bg:        var(--cr-burgundy-800);
+  --cr-btn-cta-hover:     var(--cr-burgundy-700);
+
+  /* ── Interactive / Accent ──────────────────────────────────────── */
+  --cr-accent:         var(--cr-honey-400);        /* Highlights */
+  --cr-intervention:   var(--cr-green-500);         /* Clinical mode */
+  --cr-progress:       var(--cr-honey-400);        /* Progress bars */
+  --cr-progress-track: var(--cr-honey-200);        /* Progress track */
+  --cr-focus:          var(--cr-burgundy-500);      /* Focus rings */
+
+  /* ── Links ────────────────────────────────────────────────────── */
+  --cr-link:           var(--cr-navy-500);
+  --cr-link-hover:     var(--cr-burgundy-800);
+
+  /* ── Feedback ─────────────────────────────────────────────────── */
+  --cr-success:        #059669;
+  --cr-error:          #DC2626;
+  --cr-warning:        var(--cr-honey-400);
+
+  /* ── Block-Type Categories (course player) ────────────────────── */
+  --cr-block-content:    var(--cr-navy-500);        /* text, accordion, resources */
+  --cr-block-knowledge:  var(--cr-burgundy-800);    /* quiz, matching, cardSort */
+  --cr-block-engagement: var(--cr-green-500);       /* reflection, scenario, flashcard */
+  --cr-block-progress:   var(--cr-honey-400);       /* progress, badges, certificates */
+
+
+  /* ═══════════════════════════════════════════════════════════════
+     TYPOGRAPHY TOKENS
+     ═══════════════════════════════════════════════════════════════ */
+
+  /* ── Font Families ────────────────────────────────────────────── */
+  --cr-font-display:  'Cormorant Garamond', 'Georgia', serif;
+  --cr-font-body:     'Lato', 'Helvetica Neue', 'Arial', sans-serif;
+
+  /* ── Font Sizes ───────────────────────────────────────────────── */
+  --cr-text-h1:       2.5rem;    /* 40px */
+  --cr-text-h2:       1.75rem;   /* 28px */
+  --cr-text-h3:       1.25rem;   /* 20px */
+  --cr-text-h4:       1.1rem;    /* 17.6px */
+  --cr-text-body:     1rem;      /* 16px */
+  --cr-text-small:    0.875rem;  /* 14px */
+  --cr-text-label:    0.75rem;   /* 12px */
+
+  /* ── Font Weights ─────────────────────────────────────────────── */
+  --cr-weight-h1:     700;
+  --cr-weight-h2:     600;
+  --cr-weight-h3:     700;
+  --cr-weight-h4:     600;
+  --cr-weight-body:   400;
+  --cr-weight-label:  600;
+
+  /* ── Line Heights ─────────────────────────────────────────────── */
+  --cr-leading-tight:   1.3;
+  --cr-leading-normal:  1.6;
+  --cr-leading-relaxed: 1.8;
+
+  /* ── Spacing Scale ────────────────────────────────────────────── */
+  --cr-space-xs:   0.25rem;   /* 4px */
+  --cr-space-sm:   0.5rem;    /* 8px */
+  --cr-space-md:   1rem;      /* 16px */
+  --cr-space-lg:   1.5rem;    /* 24px */
+  --cr-space-xl:   2rem;      /* 32px */
+  --cr-space-2xl:  3rem;      /* 48px */
+
+  /* ── Border Radius ────────────────────────────────────────────── */
+  --cr-radius-sm:  0.375rem;  /* 6px */
+  --cr-radius-md:  0.75rem;   /* 12px */
+  --cr-radius-lg:  1rem;      /* 16px */
+  --cr-radius-xl:  1.5rem;    /* 24px */
+
+  /* ── Shadows ──────────────────────────────────────────────────── */
+  --cr-shadow-sm:  0 1px 2px rgba(107, 29, 52, 0.05);
+  --cr-shadow-md:  0 4px 6px rgba(107, 29, 52, 0.07);
+  --cr-shadow-lg:  0 10px 15px rgba(107, 29, 52, 0.10);
+}
+
+
+/* ═══════════════════════════════════════════════════════════════════
+   DEPRECATED COLOR MIGRATION
+   
+   These values exist in legacy code. Find-and-replace with the
+   token equivalents listed. Do NOT add new uses.
+   
+   ~~#40634A~~ (Forest Green 600)  → var(--cr-green-500)
+   ~~#34495E~~ (Old Navy)          → var(--cr-navy-500)
+   ~~#4B5D4B~~ (Moss 600)         → var(--cr-green-500)
+   ~~#7D4E57~~ (Dusty Rose 600)   → var(--cr-burgundy-700)
+   ~~#FAFAF9~~ (Stone 50)         → var(--cr-bg)
+   ~~#F8F7F4~~ (Settings bg)      → var(--cr-bg)
+   ~~#FAFAF8~~ (React bg)         → var(--cr-bg)
+   ~~#F5F5F4~~ (Stone 100)        → var(--cr-bg-alt)
+   ═══════════════════════════════════════════════════════════════════ */
diff --git a/client/public/css/typography.css b/client/public/css/typography.css
new file mode 100644
index 0000000..db6771f
--- /dev/null
+++ b/client/public/css/typography.css
@@ -0,0 +1,196 @@
+/* ═══════════════════════════════════════════════════════════════════
+   CounselorReady Typography v1.0
+   Depends on: design-tokens.css (must be loaded first)
+   
+   Deploy to: client/public/css/typography.css
+   
+   This file applies the typographic hierarchy defined in
+   CounselorReady_Color_Spec_v1.docx Section 5.
+   ═══════════════════════════════════════════════════════════════════ */
+
+
+/* ── Google Fonts Import ──────────────────────────────────────────── */
+@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Lato:wght@300;400;600;700&display=swap');
+
+
+/* ── Base ─────────────────────────────────────────────────────────── */
+body {
+  font-family: var(--cr-font-body);
+  font-size: var(--cr-text-body);
+  font-weight: var(--cr-weight-body);
+  line-height: var(--cr-leading-normal);
+  color: var(--cr-text);
+  background-color: var(--cr-bg);
+  -webkit-font-smoothing: antialiased;
+  -moz-osx-font-smoothing: grayscale;
+}
+
+
+/* ── Headings ─────────────────────────────────────────────────────── */
+h1, .cr-h1 {
+  font-family: var(--cr-font-display);
+  font-size: var(--cr-text-h1);
+  font-weight: var(--cr-weight-h1);
+  color: var(--cr-h1);
+  line-height: var(--cr-leading-tight);
+  margin-top: var(--cr-space-2xl);
+  margin-bottom: var(--cr-space-lg);
+  letter-spacing: -0.01em;
+}
+
+h2, .cr-h2 {
+  font-family: var(--cr-font-display);
+  font-size: var(--cr-text-h2);
+  font-weight: var(--cr-weight-h2);
+  color: var(--cr-h2);
+  line-height: var(--cr-leading-tight);
+  margin-top: var(--cr-space-xl);
+  margin-bottom: var(--cr-space-md);
+}
+
+h3, .cr-h3 {
+  font-family: var(--cr-font-body);
+  font-size: var(--cr-text-h3);
+  font-weight: var(--cr-weight-h3);
+  color: var(--cr-h3);
+  line-height: var(--cr-leading-tight);
+  margin-top: var(--cr-space-lg);
+  margin-bottom: var(--cr-space-sm);
+}
+
+h4, .cr-h4 {
+  font-family: var(--cr-font-body);
+  font-size: var(--cr-text-h4);
+  font-weight: var(--cr-weight-h4);
+  color: var(--cr-h4);
+  line-height: var(--cr-leading-tight);
+  margin-top: var(--cr-space-lg);
+  margin-bottom: var(--cr-space-sm);
+}
+
+/* Remove top margin when heading is first child (inside cards, panels) */
+h1:first-child, h2:first-child, h3:first-child, h4:first-child {
+  margin-top: 0;
+}
+
+
+/* ── Body Text ────────────────────────────────────────────────────── */
+p {
+  margin-bottom: var(--cr-space-md);
+  line-height: var(--cr-leading-relaxed);
+}
+
+p:last-child {
+  margin-bottom: 0;
+}
+
+strong, b {
+  font-weight: 700;
+}
+
+em, i {
+  font-style: italic;
+}
+
+
+/* ── Small / Caption ──────────────────────────────────────────────── */
+small, .cr-small, .cr-caption {
+  font-size: var(--cr-text-small);
+  color: var(--cr-text-muted);
+  line-height: var(--cr-leading-normal);
+}
+
+
+/* ── Labels ───────────────────────────────────────────────────────── */
+.cr-label {
+  font-family: var(--cr-font-body);
+  font-size: var(--cr-text-label);
+  font-weight: var(--cr-weight-label);
+  color: var(--cr-navy-500);
+  text-transform: uppercase;
+  letter-spacing: 0.05em;
+}
+
+
+/* ── Links ────────────────────────────────────────────────────────── */
+a {
+  color: var(--cr-link);
+  text-decoration: underline;
+  text-decoration-color: var(--cr-navy-200);
+  text-underline-offset: 2px;
+  transition: color 0.2s ease, text-decoration-color 0.2s ease;
+}
+
+a:hover {
+  color: var(--cr-link-hover);
+  text-decoration-color: var(--cr-burgundy-800);
+}
+
+a:focus-visible {
+  outline: 2px solid var(--cr-focus);
+  outline-offset: 2px;
+  border-radius: 2px;
+}
+
+
+/* ── Lists ────────────────────────────────────────────────────────── */
+ul, ol {
+  margin-bottom: var(--cr-space-md);
+  padding-left: var(--cr-space-lg);
+}
+
+li {
+  margin-bottom: var(--cr-space-xs);
+  line-height: var(--cr-leading-relaxed);
+}
+
+li::marker {
+  color: var(--cr-green-500);
+}
+
+
+/* ── Blockquotes (clinical vignettes, case examples) ──────────────── */
+blockquote {
+  border-left: 4px solid var(--cr-honey-400);
+  background: var(--cr-honey-50);
+  padding: var(--cr-space-md) var(--cr-space-lg);
+  margin: var(--cr-space-lg) 0;
+  border-radius: 0 var(--cr-radius-sm) var(--cr-radius-sm) 0;
+  font-style: italic;
+  color: var(--cr-navy-600);
+}
+
+blockquote p:last-child {
+  margin-bottom: 0;
+}
+
+
+/* ── Tables ───────────────────────────────────────────────────────── */
+table {
+  width: 100%;
+  border-collapse: collapse;
+  margin: var(--cr-space-lg) 0;
+  font-size: var(--cr-text-small);
+}
+
+thead th {
+  background: var(--cr-navy-50);
+  color: var(--cr-navy-500);
+  font-weight: var(--cr-weight-label);
+  text-align: left;
+  padding: var(--cr-space-sm) var(--cr-space-md);
+  border-bottom: 2px solid var(--cr-navy-200);
+  font-size: var(--cr-text-label);
+  text-transform: uppercase;
+  letter-spacing: 0.04em;
+}
+
+tbody td {
+  padding: var(--cr-space-sm) var(--cr-space-md);
+  border-bottom: 1px solid var(--cr-border-light);
+  vertical-align: top;
+}
+
+tbody tr:hover {
+  background: var(--cr-eggshell-50);
+}
diff --git a/client/public/dashboard.html b/client/public/dashboard.html
index da31e3e..fd7b118 100644
--- a/client/public/dashboard.html
+++ b/client/public/dashboard.html
@@ -6,35 +6,10 @@
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Dashboard - CounselorReady</title>
   <script src="https://cdn.tailwindcss.com"></script>
-  <script>
-    tailwind.config = {
-      theme: {
-        extend: {
-          colors: {
-            burgundy: {
-              50: '#fdf5f6', 100: '#fae8eb', 200: '#f5d0d6', 300: '#eba9b5',
-              400: '#dd768a', 500: '#c94d65', 600: '#a83350', 700: '#8B2635',
-              800: '#6b1d34', 900: '#4a1524', 950: '#2d0a14'
-            },
-            forest: {
-              50: '#f3f6f4', 100: '#e3ebe5', 200: '#c8d7cc', 300: '#a1bba8',
-              400: '#759a7f', 500: '#547c5f', 600: '#40634a', 700: '#34503d',
-              800: '#2b4133', 900: '#1f3025', 950: '#121c16'
-            },
-            gold: {
-              50: '#fdf9f0', 100: '#f9f0db', 200: '#f3e0b5', 300: '#eacd86',
-              400: '#D4A855', 500: '#c49545', 600: '#a67936', 700: '#865e2c',
-              800: '#6b4a25', 900: '#4d351b'
-            }
-          },
-          fontFamily: {
-            'display': ['Cormorant Garamond', 'Georgia', 'serif'],
-            'body': ['Lato', 'system-ui', 'sans-serif']
-          }
-        }
-      }
-    }
-  </script>
+    <script src="/js/cr-tailwind-config.js"></script>
+  <!-- CounselorReady Design System -->
+  <link rel="stylesheet" href="/css/design-tokens.css">
+  <link rel="stylesheet" href="/css/typography.css">
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Lato:wght@300;400;500;600;700&display=swap" rel="stylesheet">
@@ -61,7 +36,7 @@
     }
     .announcement-update {
       background: linear-gradient(135deg, #f3f6f4 0%, #e3ebe5 100%);
-      border-color: #40634a;
+      border-color: #4A7C59;
     }
     .announcement-info {
       background: linear-gradient(135deg, #fdf9f0 0%, #f9f0db 100%);
diff --git a/client/public/forgot-password.html b/client/public/forgot-password.html
index 6013343..7111687 100644
--- a/client/public/forgot-password.html
+++ b/client/public/forgot-password.html
@@ -6,54 +6,10 @@
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Forgot Password - CounselorReady</title>
   <script src="https://cdn.tailwindcss.com"></script>
-  <script>
-    tailwind.config = {
-      theme: {
-        extend: {
-          colors: {
-            burgundy: {
-              50: '#fdf5f6',
-              100: '#fae8eb',
-              200: '#f5d0d6',
-              300: '#eba9b5',
-              400: '#dd768a',
-              500: '#c94d65',
-              600: '#a83350',
-              700: '#8b2542',
-              800: '#6b1d34',
-              900: '#4a1524',
-              950: '#2d0a14'
-            },
-            forest: {
-              50: '#f3f6f4',
-              100: '#e3ebe5',
-              200: '#c8d7cc',
-              300: '#a1bba8',
-              400: '#759a7f',
-              500: '#547c5f',
-              600: '#40634a',
-              700: '#34503d',
-              800: '#2b4133',
-              900: '#1f3025',
-              950: '#121c16'
-            },
-            gold: {
-              50: '#fefce8',
-              100: '#fef9c3',
-              200: '#fef08a',
-              300: '#fde047',
-              400: '#facc15',
-              500: '#d4a012',
-            }
-          },
-          fontFamily: {
-            'display': ['Cormorant Garamond', 'Georgia', 'serif'],
-            'body': ['Lato', 'system-ui', 'sans-serif']
-          }
-        }
-      }
-    }
-  </script>
+    <script src="/js/cr-tailwind-config.js"></script>
+  <!-- CounselorReady Design System -->
+  <link rel="stylesheet" href="/css/design-tokens.css">
+  <link rel="stylesheet" href="/css/typography.css">
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Lato:wght@300;400;500;600;700&display=swap" rel="stylesheet">
diff --git a/client/public/help.html b/client/public/help.html
index d19ff57..5206c62 100644
--- a/client/public/help.html
+++ b/client/public/help.html
@@ -6,20 +6,10 @@
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Help Center - CounselorReady</title>
   <script src="https://cdn.tailwindcss.com"></script>
-  <script>
-    tailwind.config = {
-      theme: {
-        extend: {
-          colors: {
-            burgundy: { 50: '#fdf5f6', 100: '#fae8eb', 200: '#f5d0d6', 700: '#8b2542', 800: '#6b1d34', 900: '#4a1524' },
-            forest: { 50: '#f3f6f4', 100: '#e3ebe5', 500: '#547c5f', 600: '#40634a', 700: '#34503d', 800: '#2b4133' },
-            hunter: { 100: '#e8f0ea', 200: '#d1e1d5', 500: '#4A7C59', 600: '#3d6649', 700: '#34503d' },
-            honey: { 100: '#fef3d1', 200: '#fde7a3', 400: '#D4A855', 500: '#c99a4a', 600: '#b8893f' }
-          }
-        }
-      }
-    }
-  </script>
+    <script src="/js/cr-tailwind-config.js"></script>
+  <!-- CounselorReady Design System -->
+  <link rel="stylesheet" href="/css/design-tokens.css">
+  <link rel="stylesheet" href="/css/typography.css">
   <link href="https://fonts.googleapis.com/css2?family=Source+Serif+Pro:wght@400;600;700&family=Source+Sans+Pro:wght@300;400;500;600;700&display=swap" rel="stylesheet">
   <link rel="stylesheet" href="/lib/fontawesome/css/all.min.css">
   <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
diff --git a/client/public/interactive-course.html b/client/public/interactive-course.html
index 273d857..030eae9 100644
--- a/client/public/interactive-course.html
+++ b/client/public/interactive-course.html
@@ -7,44 +7,11 @@
   <link rel="icon" type="image/svg+xml" href="/favicon.svg">
   <script src="https://cdn.tailwindcss.com"></script>
   <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Lato:wght@300;400;500;600;700&display=swap" rel="stylesheet">
-  <script>
-    tailwind.config = {
-      theme: {
-        extend: {
-          colors: {
-            burgundy: {
-              50: '#FDF2F4', 100: '#FAE8EB', 200: '#F5D0D6', 300: '#E9A3B0',
-              400: '#D87389', 500: '#C94D65', 600: '#A83350', 700: '#8B2542',
-              800: '#6B1D34', 900: '#4A1524'
-            },
-            forest: {
-              50: '#f3f6f4', 100: '#E3EBE5', 200: '#C8D7CC', 300: '#a3baab',
-              400: '#759A7F', 500: '#547C5F', 600: '#40634A', 700: '#34503D',
-              800: '#2f4036', 900: '#28352e'
-            },
-            hunter: {
-              50: '#F2F7F3', 100: '#E4EBE6', 200: '#C9D7CD', 300: '#A4BDA9',
-              400: '#7F9E87', 500: '#5F8268', 600: '#4A7C59', 700: '#395F45',
-              800: '#2D4C37'
-            },
-            honey: {
-              50: '#FFFDF5', 100: '#FFF9E6', 200: '#FFF0C2', 300: '#E0C87A',
-              400: '#D4A855', 500: '#C69840', 600: '#B8872C', 700: '#9A6F1A'
-            },
-            navy: {
-              300: '#7D9AB2', 400: '#5A7A94', 500: '#456177', 600: '#284157',
-              700: '#2C3E50', 800: '#1A252F', 900: '#111820'
-            },
-            gold: { 50: '#fefce8', 100: '#fef9c3', 200: '#fef08a', 300: '#fde047', 400: '#facc15', 500: '#d4a012' }
-          },
-          fontFamily: {
-            'display': ['Cormorant Garamond', 'serif'],
-            'sans': ['Lato', 'sans-serif']
-          }
-        }
-      }
-    }
-  </script>
+    <script src="/js/cr-tailwind-config.js"></script>
+  <!-- CounselorReady Design System -->
+  <link rel="stylesheet" href="/css/design-tokens.css">
+  <link rel="stylesheet" href="/css/typography.css">
+  <link rel="stylesheet" href="/css/course-content.css">
   <style>
     body { font-family: 'Lato', sans-serif; }
     .font-display { font-family: 'Cormorant Garamond', serif; }
@@ -825,7 +792,7 @@
               <div style="padding:24px">
                 <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px">
                   <div>
-                    <h4 style="font-weight:600;color:#34495E;margin-bottom:12px;font-size:14px">Terms</h4>
+                    <h4 style="font-weight:600;color:#284157;margin-bottom:12px;font-size:14px">Terms</h4>
                     <div id="${matchId}-terms" style="display:flex;flex-direction:column;gap:8px">
                       ${shuffledTerms.map(t => `
                         <div class="match-term" draggable="true" data-term="${t.term}" id="${t._tid}"
@@ -837,7 +804,7 @@
                     </div>
                   </div>
                   <div>
-                    <h4 style="font-weight:600;color:#34495E;margin-bottom:12px;font-size:14px">Definitions</h4>
+                    <h4 style="font-weight:600;color:#284157;margin-bottom:12px;font-size:14px">Definitions</h4>
                     <div style="display:flex;flex-direction:column;gap:8px">
                       ${shuffledDefs.map(d => `
                         <div class="match-def-zone" data-correct-term="${d.term}" id="${d._did}"
@@ -874,19 +841,19 @@
               </div>
               <div style="padding:24px">
                 <div id="${fcId}-card" onclick="flashcardFlip('${fcId}')" 
-                  style="min-height:220px;border-radius:12px;border:2px solid #E8E4DF;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:32px;background:#FAFAF8;transition:background 0.3s;position:relative">
+                  style="min-height:220px;border-radius:12px;border:2px solid #E8E4DF;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:32px;background:#F5F5DC;transition:background 0.3s;position:relative">
                   <div style="text-align:center">
                     <p id="${fcId}-label" style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;color:#9CA3AF">Term · Card 1 of ${flashcards.length}</p>
-                    <p id="${fcId}-text" style="font-size:18px;font-weight:600;color:#34495E;line-height:1.5">${flashcards[0]?.front || ''}</p>
+                    <p id="${fcId}-text" style="font-size:18px;font-weight:600;color:#284157;line-height:1.5">${flashcards[0]?.front || ''}</p>
                     <p style="font-size:12px;color:#9CA3AF;margin-top:16px">Click to reveal answer</p>
                   </div>
                 </div>
                 <div style="display:flex;align-items:center;justify-content:space-between;margin-top:16px">
-                  <button onclick="flashcardNav('${fcId}', -1)" style="padding:8px 16px;color:#34495E;font-weight:500;background:none;border:none;cursor:pointer">← Previous</button>
+                  <button onclick="flashcardNav('${fcId}', -1)" style="padding:8px 16px;color:#284157;font-weight:500;background:none;border:none;cursor:pointer">← Previous</button>
                   <div id="${fcId}-dots" style="display:flex;gap:4px">
                     ${flashcards.map((_, i) => `<button onclick="flashcardGo('${fcId}', ${i})" style="width:10px;height:10px;border-radius:50%;padding:0;border:none;cursor:pointer;background:${i === 0 ? '#6B1D34' : '#E8E4DF'}"></button>`).join('')}
                   </div>
-                  <button onclick="flashcardNav('${fcId}', 1)" style="padding:8px 16px;color:#34495E;font-weight:500;background:none;border:none;cursor:pointer">Next →</button>
+                  <button onclick="flashcardNav('${fcId}', 1)" style="padding:8px 16px;color:#284157;font-weight:500;background:none;border:none;cursor:pointer">Next →</button>
                 </div>
                 <div id="${fcId}-done" style="display:none;margin-top:16px;background:rgba(5,150,105,0.08);border:1px solid rgba(5,150,105,0.2);border-radius:12px;padding:12px;align-items:center;gap:8px">
                   <span style="color:#059669;font-size:14px;font-weight:600">✓ All cards reviewed! Activity complete.</span>
@@ -933,12 +900,12 @@
               </div>
               <div style="padding:24px">
                 <div id="${csId}-unplaced" style="margin-bottom:20px">
-                  <h4 style="font-weight:700;color:#34495E;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">Cards to Sort</h4>
+                  <h4 style="font-weight:700;color:#284157;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">Cards to Sort</h4>
                   <div style="display:flex;flex-wrap:wrap;gap:8px">
                     ${csShuffled.map(c => `
                       <div class="cs-card" draggable="true" data-card-id="${c.id}" data-correct-cat="${c.correctCategory}"
                         ondragstart="csDragStart(event)"
-                        style="padding:10px 16px;background:rgba(52,73,94,0.06);border:2px solid #E8E4DF;border-radius:10px;cursor:grab;font-weight:500;font-size:13px;color:#34495E;user-select:none">
+                        style="padding:10px 16px;background:rgba(52,73,94,0.06);border:2px solid #E8E4DF;border-radius:10px;cursor:grab;font-weight:500;font-size:13px;color:#284157;user-select:none">
                         ${c.text}
                       </div>
                     `).join('')}
@@ -946,14 +913,14 @@
                 </div>
                 <div style="display:grid;grid-template-columns:repeat(${Math.min(csCategories.length, 3)}, 1fr);gap:16px">
                   ${csCategories.map((cat, i) => {
-                    const colors = ['#4A7C59','#6B1D34','#D4A855','#34495E'];
+                    const colors = ['#4A7C59','#6B1D34','#D4A855','#284157'];
                     return `
                       <div class="cs-zone" data-category="${cat}"
                         ondragover="event.preventDefault();this.style.borderColor='#D4A855'"
                         ondragleave="this.style.borderColor='rgba(74,124,89,0.4)'"
                         ondrop="csDrop(event, this, '${csId}')"
-                        style="min-height:120px;border-radius:12px;border:2px dashed rgba(74,124,89,0.4);padding:16px;background:#FAFAF8">
-                        <h4 style="font-weight:700;font-size:13px;color:#34495E;margin-bottom:12px;display:flex;align-items:center;gap:8px">
+                        style="min-height:120px;border-radius:12px;border:2px dashed rgba(74,124,89,0.4);padding:16px;background:#F5F5DC">
+                        <h4 style="font-weight:700;font-size:13px;color:#284157;margin-bottom:12px;display:flex;align-items:center;gap:8px">
                           <span style="width:10px;height:10px;border-radius:50%;background:${colors[i % colors.length]}"></span>${cat}
                         </h4>
                         <div class="cs-placed" style="display:flex;flex-direction:column;gap:6px"></div>
@@ -977,7 +944,7 @@
           const sqShuffled = [...sqSteps].sort(() => Math.random() - 0.5);
           div.innerHTML = `
             <div class="bg-white rounded-xl border-2 border-slate-200 overflow-hidden" id="${sqId}">
-              <div style="background:#34495E;padding:16px 24px">
+              <div style="background:#284157;padding:16px 24px">
                 <h3 style="color:#fff;font-weight:700;font-size:17px;margin:0">📋 Sequencing Activity</h3>
                 <p style="color:rgba(255,255,255,0.5);font-size:13px;margin-top:4px">${block.instructions || 'Arrange the steps in the correct order'}</p>
               </div>
@@ -986,8 +953,8 @@
                   ${sqShuffled.map((s, i) => `
                     <div class="sq-item" draggable="true" data-order="${s.order}" data-item-id="${s.id}"
                       ondragstart="sqDragStart(event, ${i})" ondragover="sqDragOver(event, this)" ondragleave="sqDragLeave(this)" ondrop="sqDrop(event, this, '${sqId}')" ondragend="sqDragEnd(this)"
-                      style="display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:12px;user-select:none;border:2px solid #E8E4DF;background:#FAFAF8;cursor:grab">
-                      <div class="sq-num" style="width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#34495E;color:#fff;font-weight:800;font-size:14px;flex-shrink:0">${i + 1}</div>
+                      style="display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:12px;user-select:none;border:2px solid #E8E4DF;background:#F5F5DC;cursor:grab">
+                      <div class="sq-num" style="width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#284157;color:#fff;font-weight:800;font-size:14px;flex-shrink:0">${i + 1}</div>
                       <span style="width:14px;color:#9CA3AF;flex-shrink:0;font-size:16px">⋮⋮</span>
                       <span style="flex:1;font-size:14px;font-weight:500;color:#2C2C2C">${s.text}</span>
                       <div style="display:flex;flex-direction:column;gap:2px">
@@ -1047,7 +1014,7 @@
         case 'hotspot':
           const hsId = `hs-${currentSectionIndex}-${blockIndex}`;
           const hotspots = block.hotspots || [];
-          const hsCols = ['#6B1D34','#4A7C59','#D4A855','#34495E','#6366F1','#8B5CF6'];
+          const hsCols = ['#6B1D34','#4A7C59','#D4A855','#284157','#6366F1','#8B5CF6'];
           div.innerHTML = `
             <div class="bg-white rounded-xl border-2 border-slate-200 overflow-hidden" id="${hsId}">
               <div style="background:#6B1D34;padding:16px 24px">
@@ -1074,7 +1041,7 @@
                   </div>
                 </div>
                 <div id="${hsId}-info" style="display:none;margin-top:16px;border-radius:12px;padding:16px;background:rgba(52,73,94,0.06);border:1px solid #E8E4DF">
-                  <h4 id="${hsId}-info-title" style="font-weight:700;color:#34495E;margin-bottom:4px"></h4>
+                  <h4 id="${hsId}-info-title" style="font-weight:700;color:#284157;margin-bottom:4px"></h4>
                   <p id="${hsId}-info-text" style="font-size:14px;color:#6B7280;line-height:1.6;margin:0"></p>
                 </div>
                 <div id="${hsId}-done" style="display:none;margin-top:16px;background:rgba(5,150,105,0.08);border:1px solid rgba(5,150,105,0.2);border-radius:12px;padding:12px;align-items:center;gap:8px">
@@ -1089,7 +1056,7 @@
         case 'videoEmbed':
           div.innerHTML = `
             <div class="bg-white rounded-xl border-2 border-slate-200 overflow-hidden">
-              <div style="background:#34495E;padding:16px 24px">
+              <div style="background:#284157;padding:16px 24px">
                 <h3 style="color:#fff;font-weight:700;font-size:17px;margin:0;display:flex;align-items:center;gap:8px">▶ ${block.videoTitle || 'Video Content'}</h3>
                 ${block.videoDuration ? `<p style="color:rgba(255,255,255,0.5);font-size:13px;margin-top:4px">Duration: ${block.videoDuration}</p>` : ''}
               </div>
@@ -1466,7 +1433,7 @@
         <div style="display:flex;align-items:center;gap:10px;padding:8px 16px;border-radius:10px;background:${correct === total ? 'rgba(5,150,105,0.08)' : 'rgba(212,168,85,0.12)'}">
           <span style="font-weight:700">${correct}/${total} (${Math.round(correct/total*100)}%)</span>
         </div>
-        <button onclick="location.reload()" style="display:flex;align-items:center;gap:6px;padding:8px 16px;background:rgba(52,73,94,0.06);border-radius:10px;font-weight:600;color:#34495E;border:none;cursor:pointer">↺ Try Again</button>
+        <button onclick="location.reload()" style="display:flex;align-items:center;gap:6px;padding:8px 16px;background:rgba(52,73,94,0.06);border-radius:10px;font-weight:600;color:#284157;border:none;cursor:pointer">↺ Try Again</button>
       `;
     }
 
@@ -1504,8 +1471,8 @@
         labelEl.textContent = `Answer · Card ${fc.idx + 1} of ${fc.cards.length}`;
         textEl.textContent = card.back;
       } else {
-        cardEl.style.background = '#FAFAF8';
-        textEl.style.color = '#34495E';
+        cardEl.style.background = '#F5F5DC';
+        textEl.style.color = '#284157';
         labelEl.style.color = '#9CA3AF';
         labelEl.textContent = `Term · Card ${fc.idx + 1} of ${fc.cards.length}`;
         textEl.textContent = card.front;
@@ -1528,8 +1495,8 @@
       document.getElementById(fcId + '-text').textContent = card.front;
       document.getElementById(fcId + '-label').textContent = `Term · Card ${fc.idx + 1} of ${fc.cards.length}`;
       document.getElementById(fcId + '-label').style.color = '#9CA3AF';
-      document.getElementById(fcId + '-text').style.color = '#34495E';
-      document.getElementById(fcId + '-card').style.background = '#FAFAF8';
+      document.getElementById(fcId + '-text').style.color = '#284157';
+      document.getElementById(fcId + '-card').style.background = '#F5F5DC';
       flashcardUpdateDots(fcId);
     }
 
@@ -1574,19 +1541,19 @@
           <p style="font-size:14px;color:#2C2C2C;margin:0;line-height:1.6">${node.feedback.message}</p>
         </div>`;
       }
-      html += `<p style="color:#34495E;line-height:1.7;margin-bottom:24px;font-size:15px">${node.text}</p>`;
+      html += `<p style="color:#284157;line-height:1.7;margin-bottom:24px;font-size:15px">${node.text}</p>`;
       
       if (node.isEnd) {
         html += `<div style="padding:24px;border-radius:12px;text-align:center;background:${node.feedback?.type === 'positive' ? 'rgba(5,150,105,0.08)' : 'rgba(212,168,85,0.12)'}">
           <div style="font-size:40px;margin-bottom:8px">🏆</div>
-          <p style="font-weight:700;color:#34495E;margin-bottom:4px">Scenario Complete</p>
+          <p style="font-weight:700;color:#284157;margin-bottom:4px">Scenario Complete</p>
           <p style="font-size:13px;color:#6B7280">You've completed this clinical scenario.</p>
-          <button onclick="scenarioRestart('${stId}')" style="margin-top:16px;display:inline-flex;align-items:center;gap:6px;padding:8px 20px;background:#fff;border:1px solid #E8E4DF;border-radius:10px;font-weight:600;color:#34495E;cursor:pointer">↺ Try a Different Path</button>
+          <button onclick="scenarioRestart('${stId}')" style="margin-top:16px;display:inline-flex;align-items:center;gap:6px;padding:8px 20px;background:#fff;border:1px solid #E8E4DF;border-radius:10px;font-weight:600;color:#284157;cursor:pointer">↺ Try a Different Path</button>
         </div>`;
       } else {
         html += `<p style="font-size:12px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px">Choose your response:</p>`;
         (node.choices || []).forEach((ch, i) => {
-          html += `<button onclick="scenarioChoose('${stId}', '${ch.next}')" style="width:100%;text-align:left;padding:16px 20px;border-radius:12px;border:2px solid #E8E4DF;background:#FAFAF8;display:flex;align-items:center;gap:12px;cursor:pointer;margin-bottom:10px;font-family:inherit">
+          html += `<button onclick="scenarioChoose('${stId}', '${ch.next}')" style="width:100%;text-align:left;padding:16px 20px;border-radius:12px;border:2px solid #E8E4DF;background:#F5F5DC;display:flex;align-items:center;gap:12px;cursor:pointer;margin-bottom:10px;font-family:inherit">
             <div style="width:32px;height:32px;border-radius:50%;background:rgba(74,124,89,0.08);color:#4A7C59;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-weight:700;font-size:14px">${String.fromCharCode(65 + i)}</div>
             <span style="flex:1;font-weight:500;color:#2C2C2C">${ch.text}</span>
             <span style="color:#9CA3AF">→</span>
@@ -1668,7 +1635,7 @@
         card.dataset.cardId = cardId;
         card.dataset.correctCat = correctCat;
         card.setAttribute('ondragstart', 'csDragStart(event)');
-        card.style.cssText = 'padding:10px 16px;background:rgba(52,73,94,0.06);border:2px solid #E8E4DF;border-radius:10px;cursor:grab;font-weight:500;font-size:13px;color:#34495E;user-select:none';
+        card.style.cssText = 'padding:10px 16px;background:rgba(52,73,94,0.06);border:2px solid #E8E4DF;border-radius:10px;cursor:grab;font-weight:500;font-size:13px;color:#284157;user-select:none';
         card.textContent = text;
         unplaced.appendChild(card);
       }
@@ -1704,7 +1671,7 @@
           <div style="display:flex;align-items:center;gap:10px;padding:8px 16px;border-radius:10px;background:${correct === total ? 'rgba(5,150,105,0.08)' : 'rgba(212,168,85,0.12)'}">
             <span style="font-weight:700">${correct}/${total} (${Math.round(correct/total*100)}%)</span>
           </div>
-          <button onclick="location.reload()" style="display:flex;align-items:center;gap:6px;padding:8px 16px;background:rgba(52,73,94,0.06);border-radius:10px;font-weight:600;color:#34495E;border:none;cursor:pointer">↺ Try Again</button>
+          <button onclick="location.reload()" style="display:flex;align-items:center;gap:6px;padding:8px 16px;background:rgba(52,73,94,0.06);border-radius:10px;font-weight:600;color:#284157;border:none;cursor:pointer">↺ Try Again</button>
         `;
       }
     }
@@ -1728,13 +1695,13 @@
 
     function sqDragLeave(el) {
       el.style.borderColor = '#E8E4DF';
-      el.style.background = '#FAFAF8';
+      el.style.background = '#F5F5DC';
     }
 
     function sqDrop(e, targetEl, containerId) {
       e.preventDefault();
       targetEl.style.borderColor = '#E8E4DF';
-      targetEl.style.background = '#FAFAF8';
+      targetEl.style.background = '#F5F5DC';
       if (_sqDragIdx === null) return;
       
       const itemsContainer = document.getElementById(containerId + '-items');
@@ -1832,7 +1799,7 @@
           <div style="display:flex;align-items:center;gap:10px;padding:8px 16px;border-radius:10px;background:${correct === items.length ? 'rgba(5,150,105,0.08)' : 'rgba(212,168,85,0.12)'}">
             <span style="font-weight:700">${correct}/${items.length} (${Math.round(correct/items.length*100)}%)</span>
           </div>
-          <button onclick="location.reload()" style="display:flex;align-items:center;gap:6px;padding:8px 16px;background:rgba(52,73,94,0.06);border-radius:10px;font-weight:600;color:#34495E;border:none;cursor:pointer">↺ Try Again</button>
+          <button onclick="location.reload()" style="display:flex;align-items:center;gap:6px;padding:8px 16px;background:rgba(52,73,94,0.06);border-radius:10px;font-weight:600;color:#284157;border:none;cursor:pointer">↺ Try Again</button>
         `;
       }
     }
diff --git a/client/public/js/cr-tailwind-config.js b/client/public/js/cr-tailwind-config.js
new file mode 100644
index 0000000..e484a2f
--- /dev/null
+++ b/client/public/js/cr-tailwind-config.js
@@ -0,0 +1,135 @@
+/**
+ * CounselorReady Shared Tailwind CDN Config v1.0
+ * Source of truth: CounselorReady_Color_Spec_v1.docx
+ * 
+ * Usage in HTML pages (REPLACES inline tailwind.config blocks):
+ *   <script src="https://cdn.tailwindcss.com"></script>
+ *   <script src="/js/cr-tailwind-config.js"></script>
+ * 
+ * This file MUST match the values in /css/design-tokens.css.
+ * When Color Spec and this file disagree, the Color Spec wins.
+ */
+
+tailwind.config = {
+  theme: {
+    extend: {
+      colors: {
+        // ═══════════════════════════════════════════════
+        // PRIMARY PALETTE — Color_Spec_v1 Section 1
+        // ═══════════════════════════════════════════════
+
+        burgundy: {
+          50:  '#FDF5F7',
+          100: '#FAE8EB',
+          200: '#F5D0D6',
+          300: '#E8A4B2',
+          400: '#D4708A',
+          500: '#C94D65',
+          600: '#A83350',
+          700: '#8B2542',
+          800: '#6B1D34',   // ★ PRIMARY
+          900: '#4A1524',
+        },
+
+        navy: {
+          50:  '#F0F4F7',
+          100: '#D9E2EA',
+          200: '#B3C5D4',
+          300: '#7A98AE',
+          400: '#4A6B82',
+          500: '#284157',   // ★ PRIMARY
+          600: '#1F3345',
+          700: '#172736',
+          800: '#101C27',
+        },
+
+        hunter: {
+          50:  '#F2F7F4',
+          100: '#E4EBE6',
+          200: '#C9D7CD',
+          300: '#A3BDA9',
+          400: '#7A9E84',
+          500: '#4A7C59',   // ★ PRIMARY
+          600: '#3D6A4A',
+          700: '#305538',
+          800: '#234027',
+        },
+
+        honey: {
+          50:  '#FDF9F0',
+          100: '#F9F0DB',
+          200: '#F3E0B5',
+          300: '#EACD86',
+          400: '#D4A855',   // ★ PRIMARY
+          500: '#C49545',
+          600: '#A67936',
+          700: '#865E2C',
+          800: '#6B4A25',
+        },
+
+        eggshell: {
+          50:  '#F5F5DC',   // ★ PRIMARY
+          100: '#EDEDD0',
+          200: '#E2E2BE',
+          300: '#D4D4A4',
+        },
+
+        // ═══════════════════════════════════════════════
+        // ALIASES — backward compatibility
+        // These map old class names to correct new values
+        // so existing code doesn't break during migration.
+        // ═══════════════════════════════════════════════
+
+        // "forest-*" classes → hunter green values
+        forest: {
+          50:  '#F2F7F4',
+          100: '#E4EBE6',
+          200: '#C9D7CD',
+          300: '#A3BDA9',
+          400: '#7A9E84',
+          500: '#4A7C59',
+          600: '#3D6A4A',
+          700: '#305538',
+          800: '#234027',
+        },
+
+        // "moss-*" classes → hunter green values
+        moss: {
+          50:  '#F2F7F4',
+          100: '#E4EBE6',
+          200: '#C9D7CD',
+          300: '#A3BDA9',
+          400: '#7A9E84',
+          500: '#4A7C59',
+          600: '#3D6A4A',
+          700: '#305538',
+          800: '#234027',
+        },
+
+        // "gold-*" classes → honey values
+        gold: {
+          50:  '#FDF9F0',
+          100: '#F9F0DB',
+          200: '#F3E0B5',
+          300: '#EACD86',
+          400: '#D4A855',
+          500: '#C49545',
+        },
+
+        // "stone-*" classes → eggshell values
+        stone: {
+          50:  '#F5F5DC',
+          100: '#EDEDD0',
+          200: '#E2E2BE',
+          300: '#D4D4A4',
+        },
+      },
+
+      fontFamily: {
+        'display': ['Cormorant Garamond', 'Georgia', 'serif'],
+        'sans':    ['Lato', 'system-ui', 'sans-serif'],
+        'body':    ['Lato', 'system-ui', 'sans-serif'],
+      },
+    },
+  },
+};
diff --git a/client/public/landing.html b/client/public/landing.html
index 7a2cb98..f54ba35 100644
--- a/client/public/landing.html
+++ b/client/public/landing.html
@@ -6,73 +6,10 @@
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>CounselorReady - Professional CE Management</title>
   <script src="https://cdn.tailwindcss.com"></script>
-  <script>
-    tailwind.config = {
-      theme: {
-        extend: {
-          colors: {
-            burgundy: {
-              50: '#fdf5f6',
-              100: '#fae8eb',
-              200: '#f5d0d6',
-              300: '#eba9b5',
-              400: '#dd768a',
-              500: '#c94d65',
-              600: '#a83350',
-              700: '#8b2542',
-              800: '#6b1d34',
-              900: '#4a1524',
-              950: '#2d0a14'
-            },
-            hunter: {
-              50: '#f5f8f5',
-              100: '#eaf0eb',
-              200: '#d5e1d7',
-              300: '#b5ccb9',
-              400: '#8fb096',
-              500: '#6a9472',
-              600: '#4A7C59',
-              700: '#355E3B',
-              800: '#2D4F33',
-              900: '#1F3825',
-              950: '#121f15'
-            },
-            honey: {
-              50: '#fdf9f0',
-              100: '#f9f0db',
-              200: '#f3e0b5',
-              300: '#eacd86',
-              400: '#D4A855',
-              500: '#c49545',
-              600: '#a67936',
-              700: '#865e2c',
-              800: '#6b4a25',
-              900: '#4d351b'
-            },
-            azure: {
-              50: '#f0f7ff',
-              100: '#e0effe',
-              200: '#bae0fd',
-              300: '#7dc8fb',
-              400: '#38aaf6',
-              500: '#0e8fe7',
-              600: '#0270c5',
-              700: '#0359a0',
-              800: '#074b84',
-              900: '#0c406e'
-            },
-            navy: {
-              700: '#34495E',
-            }
-          },
-          fontFamily: {
-            'display': ['Cormorant Garamond', 'Georgia', 'serif'],
-            'body': ['Lato', 'system-ui', 'sans-serif']
-          }
-        }
-      }
-    }
-  </script>
+    <script src="/js/cr-tailwind-config.js"></script>
+  <!-- CounselorReady Design System -->
+  <link rel="stylesheet" href="/css/design-tokens.css">
+  <link rel="stylesheet" href="/css/typography.css">
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700&family=Lato:wght@300;400;500;600;700&display=swap" rel="stylesheet">
diff --git a/client/public/login.html b/client/public/login.html
index 9c0125b..3769162 100644
--- a/client/public/login.html
+++ b/client/public/login.html
@@ -6,54 +6,10 @@
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Sign In - CounselorReady</title>
   <script src="https://cdn.tailwindcss.com"></script>
-  <script>
-    tailwind.config = {
-      theme: {
-        extend: {
-          colors: {
-            burgundy: {
-              50: '#fdf5f6',
-              100: '#fae8eb',
-              200: '#f5d0d6',
-              300: '#eba9b5',
-              400: '#dd768a',
-              500: '#c94d65',
-              600: '#a83350',
-              700: '#8b2542',
-              800: '#6b1d34',
-              900: '#4a1524',
-              950: '#2d0a14'
-            },
-            forest: {
-              50: '#f3f6f4',
-              100: '#e3ebe5',
-              200: '#c8d7cc',
-              300: '#a1bba8',
-              400: '#759a7f',
-              500: '#547c5f',
-              600: '#40634a',
-              700: '#34503d',
-              800: '#2b4133',
-              900: '#1f3025',
-              950: '#121c16'
-            },
-            gold: {
-              50: '#fefce8',
-              100: '#fef9c3',
-              200: '#fef08a',
-              300: '#fde047',
-              400: '#facc15',
-              500: '#d4a012',
-            }
-          },
-          fontFamily: {
-            'display': ['Cormorant Garamond', 'Georgia', 'serif'],
-            'body': ['Lato', 'system-ui', 'sans-serif']
-          }
-        }
-      }
-    }
-  </script>
+    <script src="/js/cr-tailwind-config.js"></script>
+  <!-- CounselorReady Design System -->
+  <link rel="stylesheet" href="/css/design-tokens.css">
+  <link rel="stylesheet" href="/css/typography.css">
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Lato:wght@300;400;500;600;700&display=swap" rel="stylesheet">
diff --git a/client/public/messages.html b/client/public/messages.html
index 9c67226..50d6ce3 100644
--- a/client/public/messages.html
+++ b/client/public/messages.html
@@ -6,26 +6,10 @@
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Messages - CounselorReady</title>
   <script src="https://cdn.tailwindcss.com"></script>
-  <script>
-    tailwind.config = {
-      theme: {
-        extend: {
-          colors: {
-            burgundy: {
-              50: '#fdf2f4', 100: '#fce7ea', 200: '#f9d0d7', 300: '#f4a9b6',
-              400: '#ec7a8e', 500: '#e04d6a', 600: '#cb2d52', 700: '#ab2145',
-              800: '#8f1e3d', 900: '#6b1d34', 950: '#440c1c'
-            },
-            forest: {
-              50: '#f3f6f4', 100: '#e3eae5', 200: '#c8d5cc', 300: '#a3b8a9',
-              400: '#7a9682', 500: '#5a7962', 600: '#47614e', 700: '#3a4f40',
-              800: '#314136', 900: '#34503d', 950: '#171f19'
-            }
-          }
-        }
-      }
-    }
-  </script>
+    <script src="/js/cr-tailwind-config.js"></script>
+  <!-- CounselorReady Design System -->
+  <link rel="stylesheet" href="/css/design-tokens.css">
+  <link rel="stylesheet" href="/css/typography.css">
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Lato:wght@300;400;500;600;700&display=swap" rel="stylesheet">
   <style>
diff --git a/client/public/privacy.html b/client/public/privacy.html
index 6b72e7f..a2e4a7d 100644
--- a/client/public/privacy.html
+++ b/client/public/privacy.html
@@ -6,31 +6,10 @@
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Privacy Policy - CounselorReady</title>
   <script src="https://cdn.tailwindcss.com"></script>
-  <script>
-    tailwind.config = {
-      theme: {
-        extend: {
-          colors: {
-            burgundy: {
-              50: '#fdf5f6', 100: '#fae8eb', 200: '#f5d0d6', 300: '#eba9b5',
-              400: '#dd768a', 500: '#c94d65', 600: '#a83350', 700: '#8b2542',
-              800: '#6b1d34', 900: '#4a1524',
-            },
-            forest: {
-              50: '#f3f6f4', 100: '#e3ebe5', 200: '#c8d7cc', 300: '#a1bba8',
-              400: '#759a7f', 500: '#547c5f', 600: '#40634a', 700: '#34503d',
-              800: '#2b4133', 900: '#1f3025',
-            },
-            gold: { 300: '#fde047', 400: '#facc15', 500: '#d4a012' }
-          },
-          fontFamily: {
-            'display': ['Cormorant Garamond', 'Georgia', 'serif'],
-            'body': ['Lato', 'system-ui', 'sans-serif']
-          }
-        }
-      }
-    }
-  </script>
+    <script src="/js/cr-tailwind-config.js"></script>
+  <!-- CounselorReady Design System -->
+  <link rel="stylesheet" href="/css/design-tokens.css">
+  <link rel="stylesheet" href="/css/typography.css">
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Lato:wght@300;400;500;600;700&display=swap" rel="stylesheet">
diff --git a/client/public/refund-policy.html b/client/public/refund-policy.html
index 895e479..38b7ceb 100644
--- a/client/public/refund-policy.html
+++ b/client/public/refund-policy.html
@@ -6,31 +6,10 @@
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Refund Policy - CounselorReady</title>
   <script src="https://cdn.tailwindcss.com"></script>
-  <script>
-    tailwind.config = {
-      theme: {
-        extend: {
-          colors: {
-            burgundy: {
-              50: '#fdf5f6', 100: '#fae8eb', 200: '#f5d0d6', 300: '#eba9b5',
-              400: '#dd768a', 500: '#c94d65', 600: '#a83350', 700: '#8b2542',
-              800: '#6b1d34', 900: '#4a1524',
-            },
-            forest: {
-              50: '#f3f6f4', 100: '#e3ebe5', 200: '#c8d7cc', 300: '#a1bba8',
-              400: '#759a7f', 500: '#547c5f', 600: '#40634a', 700: '#34503d',
-              800: '#2b4133', 900: '#1f3025',
-            },
-            gold: { 300: '#fde047', 400: '#facc15', 500: '#d4a012' }
-          },
-          fontFamily: {
-            'display': ['Cormorant Garamond', 'Georgia', 'serif'],
-            'body': ['Lato', 'system-ui', 'sans-serif']
-          }
-        }
-      }
-    }
-  </script>
+    <script src="/js/cr-tailwind-config.js"></script>
+  <!-- CounselorReady Design System -->
+  <link rel="stylesheet" href="/css/design-tokens.css">
+  <link rel="stylesheet" href="/css/typography.css">
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Lato:wght@300;400;500;600;700&display=swap" rel="stylesheet">
diff --git a/client/public/register.html b/client/public/register.html
index 6b00241..5ccef95 100644
--- a/client/public/register.html
+++ b/client/public/register.html
@@ -6,31 +6,10 @@
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Create Account - CounselorReady</title>
   <script src="https://cdn.tailwindcss.com"></script>
-  <script>
-    tailwind.config = {
-      theme: {
-        extend: {
-          colors: {
-            burgundy: {
-              50: '#fdf5f6', 100: '#fae8eb', 200: '#f5d0d6', 300: '#eba9b5',
-              400: '#dd768a', 500: '#c94d65', 600: '#a83350', 700: '#8b2542',
-              800: '#6b1d34', 900: '#4a1524',
-            },
-            forest: {
-              50: '#f3f6f4', 100: '#e3ebe5', 200: '#c8d7cc', 300: '#a1bba8',
-              400: '#759a7f', 500: '#547c5f', 600: '#40634a', 700: '#34503d',
-              800: '#2b4133', 900: '#1f3025',
-            },
-            gold: { 300: '#fde047', 400: '#facc15', 500: '#d4a012' }
-          },
-          fontFamily: {
-            'display': ['Cormorant Garamond', 'Georgia', 'serif'],
-            'body': ['Lato', 'system-ui', 'sans-serif']
-          }
-        }
-      }
-    }
-  </script>
+    <script src="/js/cr-tailwind-config.js"></script>
+  <!-- CounselorReady Design System -->
+  <link rel="stylesheet" href="/css/design-tokens.css">
+  <link rel="stylesheet" href="/css/typography.css">
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Lato:wght@300;400;500;600;700&display=swap" rel="stylesheet">
diff --git a/client/public/reset-password.html b/client/public/reset-password.html
index 9284f01..ade9118 100644
--- a/client/public/reset-password.html
+++ b/client/public/reset-password.html
@@ -6,54 +6,10 @@
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Reset Password - CounselorReady</title>
   <script src="https://cdn.tailwindcss.com"></script>
-  <script>
-    tailwind.config = {
-      theme: {
-        extend: {
-          colors: {
-            burgundy: {
-              50: '#fdf5f6',
-              100: '#fae8eb',
-              200: '#f5d0d6',
-              300: '#eba9b5',
-              400: '#dd768a',
-              500: '#c94d65',
-              600: '#a83350',
-              700: '#8b2542',
-              800: '#6b1d34',
-              900: '#4a1524',
-              950: '#2d0a14'
-            },
-            forest: {
-              50: '#f3f6f4',
-              100: '#e3ebe5',
-              200: '#c8d7cc',
-              300: '#a1bba8',
-              400: '#759a7f',
-              500: '#547c5f',
-              600: '#40634a',
-              700: '#34503d',
-              800: '#2b4133',
-              900: '#1f3025',
-              950: '#121c16'
-            },
-            gold: {
-              50: '#fefce8',
-              100: '#fef9c3',
-              200: '#fef08a',
-              300: '#fde047',
-              400: '#facc15',
-              500: '#d4a012',
-            }
-          },
-          fontFamily: {
-            'display': ['Cormorant Garamond', 'Georgia', 'serif'],
-            'body': ['Lato', 'system-ui', 'sans-serif']
-          }
-        }
-      }
-    }
-  </script>
+    <script src="/js/cr-tailwind-config.js"></script>
+  <!-- CounselorReady Design System -->
+  <link rel="stylesheet" href="/css/design-tokens.css">
+  <link rel="stylesheet" href="/css/typography.css">
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Lato:wght@300;400;500;600;700&display=swap" rel="stylesheet">
diff --git a/client/public/settings.html b/client/public/settings.html
index 1539e43..794019f 100644
--- a/client/public/settings.html
+++ b/client/public/settings.html
@@ -4,6 +4,8 @@
   <meta charset="UTF-8" />
   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
   <title>Settings | CounselorReady</title>
+  <!-- CounselorReady Design System -->
+  <link rel="stylesheet" href="/css/design-tokens.css">
   <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Source+Sans+3:wght@400;500;600;700&display=swap" rel="stylesheet" />
   <style>
     :root {
@@ -13,13 +15,13 @@
       --hunter-light: #5A9A6E;
       --honey: #D4A855;
       --honey-light: #E4C475;
-      --navy: #34495E;
+      --navy: #284157;
       --navy-light: #4A6580;
       --moss-600: #4A7C59;
       --moss-700: #3D6A4A;
       --dustyrose-600: #8B2542;
       --dustyrose-700: #6B1D34;
-      --bg: #F8F7F4;
+      --bg: #F5F5DC;
       --card-bg: #FFFFFF;
       --border: #E5E2DC;
       --text-primary: #2C2C2C;
@@ -181,7 +183,7 @@
     }
     .toggle-row:hover {
       border-color: #C5C0B8;
-      background: #FAFAF8;
+      background: #F5F5DC;
     }
     .toggle-row.active {
       border-color: var(--hunter);
@@ -332,7 +334,7 @@
       align-items: center;
       gap: 0.6rem;
       padding: 0.65rem 0.85rem;
-      background: #FAFAF8;
+      background: #F5F5DC;
       border-radius: 8px;
       font-size: 0.85rem;
       color: var(--text-secondary);
diff --git a/client/public/subscription.html b/client/public/subscription.html
index 1fff33d..07f99a3 100644
--- a/client/public/subscription.html
+++ b/client/public/subscription.html
@@ -6,37 +6,10 @@
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Subscription - CounselorReady</title>
   <script src="https://cdn.tailwindcss.com"></script>
-  <script>
-    tailwind.config = {
-      theme: {
-        extend: {
-          colors: {
-            burgundy: {
-              50: '#fdf5f6', 100: '#fae8eb', 200: '#f5d0d6', 300: '#eba9b5',
-              400: '#dd768a', 500: '#c94d65', 600: '#a83350', 700: '#8b2542',
-              800: '#6b1d34', 900: '#4a1524', 950: '#2d0a14'
-            },
-            hunter: {
-              50: '#f5f8f5', 100: '#e8f0e9', 200: '#d1e1d4', 300: '#a8c7ae',
-              400: '#7ba882', 500: '#4A7C59', 600: '#3d6a4a', 700: '#355E3B',
-              800: '#2a4a2f', 900: '#1f3522', 950: '#121f14'
-            },
-            honey: {
-              50: '#fdf9f0', 100: '#f9f0db', 200: '#f3e0b8', 300: '#ebcb8b',
-              400: '#D4A855', 500: '#c9973d', 600: '#b07f2a', 700: '#936624',
-              800: '#7a5221', 900: '#654420', 950: '#3a250f'
-            },
-            forest: {
-              50: '#f3f6f4', 100: '#e3ebe5', 200: '#c8d7cc', 300: '#a1bba8',
-              400: '#759a7f', 500: '#547c5f', 600: '#40634a', 700: '#34503d',
-              800: '#2b4133', 900: '#1f3025', 950: '#121c16'
-            },
-            gold: { 50: '#fefce8', 100: '#fef9c3', 200: '#fef08a', 300: '#fde047', 400: '#facc15', 500: '#d4a012' }
-          }
-        }
-      }
-    }
-  </script>
+    <script src="/js/cr-tailwind-config.js"></script>
+  <!-- CounselorReady Design System -->
+  <link rel="stylesheet" href="/css/design-tokens.css">
+  <link rel="stylesheet" href="/css/typography.css">
   <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Lato:wght@300;400;500;600;700&display=swap" rel="stylesheet">
   <style>
     body { font-family: 'Lato', system-ui, sans-serif; }
diff --git a/client/public/terms.html b/client/public/terms.html
index 4efad24..34aae22 100644
--- a/client/public/terms.html
+++ b/client/public/terms.html
@@ -6,31 +6,10 @@
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Terms of Service - CounselorReady</title>
   <script src="https://cdn.tailwindcss.com"></script>
-  <script>
-    tailwind.config = {
-      theme: {
-        extend: {
-          colors: {
-            burgundy: {
-              50: '#fdf5f6', 100: '#fae8eb', 200: '#f5d0d6', 300: '#eba9b5',
-              400: '#dd768a', 500: '#c94d65', 600: '#a83350', 700: '#8b2542',
-              800: '#6b1d34', 900: '#4a1524',
-            },
-            forest: {
-              50: '#f3f6f4', 100: '#e3ebe5', 200: '#c8d7cc', 300: '#a1bba8',
-              400: '#759a7f', 500: '#547c5f', 600: '#40634a', 700: '#34503d',
-              800: '#2b4133', 900: '#1f3025',
-            },
-            gold: { 300: '#fde047', 400: '#facc15', 500: '#d4a012' }
-          },
-          fontFamily: {
-            'display': ['Cormorant Garamond', 'Georgia', 'serif'],
-            'body': ['Lato', 'system-ui', 'sans-serif']
-          }
-        }
-      }
-    }
-  </script>
+    <script src="/js/cr-tailwind-config.js"></script>
+  <!-- CounselorReady Design System -->
+  <link rel="stylesheet" href="/css/design-tokens.css">
+  <link rel="stylesheet" href="/css/typography.css">
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Lato:wght@300;400;500;600;700&display=swap" rel="stylesheet">
diff --git a/client/public/update-content.html b/client/public/update-content.html
index 14f93c1..e56d7d8 100644
--- a/client/public/update-content.html
+++ b/client/public/update-content.html
@@ -6,26 +6,11 @@
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Update Course Content - CounselorReady</title>
   <script src="https://cdn.tailwindcss.com"></script>
-  <script>
-    tailwind.config = {
-      theme: {
-        extend: {
-          colors: {
-            burgundy: {
-              50: '#fdf5f6', 100: '#fae8eb', 200: '#f5d0d6', 300: '#eba9b5',
-              400: '#dd768a', 500: '#c94d65', 600: '#a83350', 700: '#8b2542',
-              800: '#6b1d34', 900: '#4a1524', 950: '#2d0a14'
-            },
-            forest: {
-              50: '#f3f6f4', 100: '#e3ebe5', 200: '#c8d7cc', 300: '#a1bba8',
-              400: '#759a7f', 500: '#547c5f', 600: '#40634a', 700: '#34503d',
-              800: '#2b4133', 900: '#1f3025', 950: '#121c16'
-            }
-          }
-        }
-      }
-    }
-  </script>
+    <script src="/js/cr-tailwind-config.js"></script>
+  <!-- CounselorReady Design System -->
+  <link rel="stylesheet" href="/css/design-tokens.css">
+  <link rel="stylesheet" href="/css/typography.css">
+  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Lato:wght@300;400;500;600;700&display=swap" rel="stylesheet">
 </head>
 <body class="bg-stone-50 min-h-screen flex items-center justify-center p-6">
   
diff --git a/client/public/verify-email.html b/client/public/verify-email.html
index 43892e9..e87d11b 100644
--- a/client/public/verify-email.html
+++ b/client/public/verify-email.html
@@ -7,29 +7,10 @@
   <link rel="icon" type="image/svg+xml" href="/favicon.svg">
   <script src="https://cdn.tailwindcss.com"></script>
   <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
-  <script>
-    tailwind.config = {
-      theme: {
-        extend: {
-          colors: {
-            burgundy: {
-              50: '#FDF2F4', 100: '#FAE8EB', 200: '#F5D0D6', 700: '#8B2542',
-              800: '#6B1D34', 900: '#4A1524'
-            },
-            hunter: {
-              50: '#F2F7F3', 100: '#E4EBE6', 600: '#4A7C59', 700: '#395F45'
-            },
-            honey: { 100: '#FFF9E6', 400: '#D4A855', 600: '#B8872C' },
-            navy: { 500: '#456177', 600: '#34495E', 700: '#2C3E50' }
-          },
-          fontFamily: {
-            'display': ['Cormorant Garamond', 'serif'],
-            'sans': ['Lato', 'sans-serif']
-          }
-        }
-      }
-    }
-  </script>
+    <script src="/js/cr-tailwind-config.js"></script>
+  <!-- CounselorReady Design System -->
+  <link rel="stylesheet" href="/css/design-tokens.css">
+  <link rel="stylesheet" href="/css/typography.css">
 </head>
 <body class="min-h-screen bg-stone-50 flex items-center justify-center p-4">
   <div class="max-w-md w-full">
diff --git a/client/public/verify.html b/client/public/verify.html
index 9916b10..d452687 100644
--- a/client/public/verify.html
+++ b/client/public/verify.html
@@ -6,23 +6,10 @@
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Verify Certificate - CounselorReady</title>
   <script src="https://cdn.tailwindcss.com"></script>
-  <script>
-    tailwind.config = {
-      theme: {
-        extend: {
-          colors: {
-            burgundy: { 50: '#fdf5f6', 100: '#fae8eb', 700: '#8b2542', 800: '#6b1d34', 900: '#4a1524' },
-            forest: { 50: '#f3f6f4', 100: '#e3ebe5', 500: '#547c5f', 600: '#40634a', 700: '#34503d', 800: '#2b4133' },
-            gold: { 50: '#fefce8', 100: '#fef9c3', 400: '#facc15', 500: '#d4a012' }
-          },
-          fontFamily: {
-            'display': ['Cormorant Garamond', 'Georgia', 'serif'],
-            'body': ['Lato', 'system-ui', 'sans-serif']
-          }
-        }
-      }
-    }
-  </script>
+    <script src="/js/cr-tailwind-config.js"></script>
+  <!-- CounselorReady Design System -->
+  <link rel="stylesheet" href="/css/design-tokens.css">
+  <link rel="stylesheet" href="/css/typography.css">
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Lato:wght@400;600;700&display=swap" rel="stylesheet">
diff --git a/client/public/welcome.html b/client/public/welcome.html
index e37a6c5..b2bb954 100644
--- a/client/public/welcome.html
+++ b/client/public/welcome.html
@@ -6,35 +6,10 @@
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Welcome to CounselorReady - Getting Started</title>
   <script src="https://cdn.tailwindcss.com"></script>
-  <script>
-    tailwind.config = {
-      theme: {
-        extend: {
-          colors: {
-            burgundy: {
-              50: '#fdf5f6', 100: '#fae8eb', 200: '#f5d0d6', 300: '#eba9b5',
-              400: '#dd768a', 500: '#c94d65', 600: '#a83350', 700: '#8b2542',
-              800: '#6b1d34', 900: '#4a1524', 950: '#2d0a14'
-            },
-            forest: {
-              50: '#f3f6f4', 100: '#e3ebe5', 200: '#c8d7cc', 300: '#a1bba8',
-              400: '#759a7f', 500: '#547c5f', 600: '#40634a', 700: '#34503d',
-              800: '#2b4133', 900: '#1f3025', 950: '#121c16'
-            },
-            gold: {
-              50: '#fefce8', 100: '#fef9c3', 200: '#fef08a', 300: '#fde047',
-              400: '#facc15', 500: '#d4a012', 600: '#a16207', 700: '#854d0e',
-              800: '#713f12', 900: '#5c3210'
-            }
-          },
-          fontFamily: {
-            'display': ['Cormorant Garamond', 'Georgia', 'serif'],
-            'body': ['Lato', 'system-ui', 'sans-serif']
-          }
-        }
-      }
-    }
-  </script>
+    <script src="/js/cr-tailwind-config.js"></script>
+  <!-- CounselorReady Design System -->
+  <link rel="stylesheet" href="/css/design-tokens.css">
+  <link rel="stylesheet" href="/css/typography.css">
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Lato:wght@300;400;500;600;700&display=swap" rel="stylesheet">
diff --git a/client/src/components/CloudinaryUploader.jsx b/client/src/components/CloudinaryUploader.jsx
index f8c9e56..f54e572 100644
--- a/client/src/components/CloudinaryUploader.jsx
+++ b/client/src/components/CloudinaryUploader.jsx
@@ -85,7 +85,7 @@ export default function CloudinaryUploader({
           if (file) { const dt = new DataTransfer(); dt.items.add(file); fileRef.current.files = dt.files; handleFileSelect({ target: { files: dt.files } }); }
         }}
         style={{ border: '2px dashed #E8E4DF', borderRadius: 10, padding: preview ? 8 : 32,
-          textAlign: 'center', cursor: 'pointer', background: preview ? '#FAFAF8' : '#fff', position: 'relative' }}>
+          textAlign: 'center', cursor: 'pointer', background: preview ? '#F5F5DC' : '#fff', position: 'relative' }}>
         {preview ? (
           <div style={{ position: 'relative' }}>
             <img src={preview} alt={alt} style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8, display: 'block', margin: '0 auto' }} />
@@ -94,7 +94,7 @@ export default function CloudinaryUploader({
         ) : (
           <div>
             <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
-            <div style={{ fontWeight: 600, color: '#34495E', fontSize: 14 }}>{label}</div>
+            <div style={{ fontWeight: 600, color: '#284157', fontSize: 14 }}>{label}</div>
             <div style={{ color: '#9CA3AF', fontSize: 12, marginTop: 4 }}>Drag & drop or click · Max 10MB</div>
           </div>
         )}
@@ -102,7 +102,7 @@ export default function CloudinaryUploader({
       <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
         <input type="text" value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Alt text for accessibility"
           style={{ flex: 1, padding: '8px 12px', borderRadius: 6, border: '1px solid #E8E4DF', fontSize: 13, outline: 'none' }} />
-        <button onClick={handleBrowse} style={{ background: 'none', border: '1px solid #E8E4DF', borderRadius: 6, padding: '8px 14px', fontSize: 12, cursor: 'pointer', fontWeight: 600, color: '#34495E' }}>📁 Browse</button>
+        <button onClick={handleBrowse} style={{ background: 'none', border: '1px solid #E8E4DF', borderRadius: 6, padding: '8px 14px', fontSize: 12, cursor: 'pointer', fontWeight: 600, color: '#284157' }}>📁 Browse</button>
       </div>
       {error && <p style={{ color: '#DC2626', fontSize: 12, marginTop: 6 }}>⚠ {error}</p>}
       {showBrowser && (
diff --git a/client/src/components/CourseBuilder.jsx b/client/src/components/CourseBuilder.jsx
index 557fa30..9b02ceb 100644
--- a/client/src/components/CourseBuilder.jsx
+++ b/client/src/components/CourseBuilder.jsx
@@ -16,8 +16,8 @@ const C = {
   burgundy: "#6B1D34", burgundyLight: "#8B2D4A", burgundyFaded: "rgba(107,29,52,0.08)",
   green: "#4A7C59", greenLight: "#5A9469", greenFaded: "rgba(74,124,89,0.08)",
   gold: "#D4A855", goldLight: "#E0BC72", goldFaded: "rgba(212,168,85,0.12)",
-  navy: "#34495E", navyLight: "#4A6278",
-  bg: "#FAFAF8", card: "#FFFFFF",
+  navy: "#284157", navyLight: "#4A6278",
+  bg: "#F5F5DC", card: "#FFFFFF",
   border: "#E8E4DF", borderLight: "#F0EDE8",
   text: "#2C2C2C", textMuted: "#6B7280", textLight: "#9CA3AF",
   danger: "#DC2626", dangerFaded: "rgba(220,38,38,0.08)",
diff --git a/client/src/components/CourseViewer.jsx b/client/src/components/CourseViewer.jsx
index 0421683..274acdf 100644
--- a/client/src/components/CourseViewer.jsx
+++ b/client/src/components/CourseViewer.jsx
@@ -424,9 +424,9 @@ function ContentBlockRenderer({
         <div style={{ background: '#F2F7F3', borderRadius: 16, padding: 24, border: '1px solid rgba(74,124,89,0.15)' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
             <span style={{ fontSize: 20 }}>💭</span>
-            <h3 style={{ fontWeight: 700, color: '#34495E', margin: 0 }}>Reflection</h3>
+            <h3 style={{ fontWeight: 700, color: '#284157', margin: 0 }}>Reflection</h3>
           </div>
-          <p style={{ color: '#34495E', fontWeight: 600, marginBottom: 12 }}>{block.question}</p>
+          <p style={{ color: '#284157', fontWeight: 600, marginBottom: 12 }}>{block.question}</p>
           <textarea
             placeholder="Take a moment to reflect and write your thoughts here..."
             aria-label={`Reflection: ${block.question}`}
@@ -446,11 +446,11 @@ function ContentBlockRenderer({
     case 'resources':
       return (
         <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #E8E4DF' }}>
-          <h3 style={{ fontWeight: 700, color: '#34495E', marginBottom: 16 }}>📎 Resources</h3>
+          <h3 style={{ fontWeight: 700, color: '#284157', marginBottom: 16 }}>📎 Resources</h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
             {(block.resources || []).map((r, i) => (
               <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
-                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 10, background: '#F7F5F2', textDecoration: 'none', color: '#34495E', border: '1px solid #E8E4DF' }}>
+                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 10, background: '#F7F5F2', textDecoration: 'none', color: '#284157', border: '1px solid #E8E4DF' }}>
                 <span>{r.type === 'pdf' ? '📄' : r.type === 'video' ? '🎬' : '🔗'}</span>
                 <span style={{ fontWeight: 600 }}>{r.title}</span>
               </a>
diff --git a/client/src/components/InteractiveCourseComponents.jsx b/client/src/components/InteractiveCourseComponents.jsx
index ee32eb4..f6cd9c8 100644
--- a/client/src/components/InteractiveCourseComponents.jsx
+++ b/client/src/components/InteractiveCourseComponents.jsx
@@ -1,5 +1,5 @@
 // DROP INTO: /client/src/components/InteractiveCourseComponents.jsx
-// CounselorReady Brand: Burgundy #6B1D34 | Green #4A7C59 | Gold #D4A855 | Navy #34495E
+// CounselorReady Brand: Burgundy #6B1D34 | Green #4A7C59 | Gold #D4A855 | Navy #284157
 // ALL 16 LEARNER BLOCK TYPES
 
 import React, { useState, useEffect, useCallback, useRef } from 'react';
diff --git a/client/src/components/NarrationPanel.jsx b/client/src/components/NarrationPanel.jsx
index 0e6b91a..eb40e9d 100644
--- a/client/src/components/NarrationPanel.jsx
+++ b/client/src/components/NarrationPanel.jsx
@@ -6,8 +6,8 @@ import { useState, useRef, useEffect } from "react";
 
 const C = {
   burgundy: "#6B1D34", green: "#4A7C59", gold: "#D4A855",
-  navy: "#34495E", text: "#2C2C2C", textMuted: "#6B7280",
-  border: "#E8E4DF", card: "#FFFFFF", bg: "#FAFAF8",
+  navy: "#284157", text: "#2C2C2C", textMuted: "#6B7280",
+  border: "#E8E4DF", card: "#FFFFFF", bg: "#F5F5DC",
   danger: "#DC2626",
 };
 
diff --git a/client/src/components/interactive-course-14.html b/client/src/components/interactive-course-14.html
index 3a41f21..26979c9 100644
--- a/client/src/components/interactive-course-14.html
+++ b/client/src/components/interactive-course-14.html
@@ -19,7 +19,7 @@
             },
             forest: {
               50: '#f3f6f4', 100: '#E3EBE5', 200: '#C8D7CC', 300: '#a3baab',
-              400: '#759A7F', 500: '#547C5F', 600: '#40634A', 700: '#34503D',
+              400: '#759A7F', 500: '#547C5F', 600: '#4A7C59', 700: '#34503D',
               800: '#2f4036', 900: '#28352e'
             },
             hunter: {
@@ -32,7 +32,7 @@
               400: '#D4A855', 500: '#C69840', 600: '#B8872C', 700: '#9A6F1A'
             },
             navy: {
-              300: '#7D9AB2', 400: '#5A7A94', 500: '#456177', 600: '#34495E',
+              300: '#7D9AB2', 400: '#5A7A94', 500: '#456177', 600: '#284157',
               700: '#2C3E50', 800: '#1A252F', 900: '#111820'
             },
             gold: { 50: '#fefce8', 100: '#fef9c3', 200: '#fef08a', 300: '#fde047', 400: '#facc15', 500: '#d4a012' }
@@ -820,7 +820,7 @@
               <div style="padding:24px">
                 <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px">
                   <div>
-                    <h4 style="font-weight:600;color:#34495E;margin-bottom:12px;font-size:14px">Terms</h4>
+                    <h4 style="font-weight:600;color:#284157;margin-bottom:12px;font-size:14px">Terms</h4>
                     <div id="${matchId}-terms" style="display:flex;flex-direction:column;gap:8px">
                       ${shuffledTerms.map(t => `
                         <div class="match-term" draggable="true" data-term="${t.term}" id="${t._tid}"
@@ -832,7 +832,7 @@
                     </div>
                   </div>
                   <div>
-                    <h4 style="font-weight:600;color:#34495E;margin-bottom:12px;font-size:14px">Definitions</h4>
+                    <h4 style="font-weight:600;color:#284157;margin-bottom:12px;font-size:14px">Definitions</h4>
                     <div style="display:flex;flex-direction:column;gap:8px">
                       ${shuffledDefs.map(d => `
                         <div class="match-def-zone" data-correct-term="${d.term}" id="${d._did}"
@@ -869,19 +869,19 @@
               </div>
               <div style="padding:24px">
                 <div id="${fcId}-card" onclick="flashcardFlip('${fcId}')" 
-                  style="min-height:220px;border-radius:12px;border:2px solid #E8E4DF;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:32px;background:#FAFAF8;transition:background 0.3s;position:relative">
+                  style="min-height:220px;border-radius:12px;border:2px solid #E8E4DF;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:32px;background:#F5F5DC;transition:background 0.3s;position:relative">
                   <div style="text-align:center">
                     <p id="${fcId}-label" style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;color:#9CA3AF">Term · Card 1 of ${flashcards.length}</p>
-                    <p id="${fcId}-text" style="font-size:18px;font-weight:600;color:#34495E;line-height:1.5">${flashcards[0]?.front || ''}</p>
+                    <p id="${fcId}-text" style="font-size:18px;font-weight:600;color:#284157;line-height:1.5">${flashcards[0]?.front || ''}</p>
                     <p style="font-size:12px;color:#9CA3AF;margin-top:16px">Click to reveal answer</p>
                   </div>
                 </div>
                 <div style="display:flex;align-items:center;justify-content:space-between;margin-top:16px">
-                  <button onclick="flashcardNav('${fcId}', -1)" style="padding:8px 16px;color:#34495E;font-weight:500;background:none;border:none;cursor:pointer">← Previous</button>
+                  <button onclick="flashcardNav('${fcId}', -1)" style="padding:8px 16px;color:#284157;font-weight:500;background:none;border:none;cursor:pointer">← Previous</button>
                   <div id="${fcId}-dots" style="display:flex;gap:4px">
                     ${flashcards.map((_, i) => `<button onclick="flashcardGo('${fcId}', ${i})" style="width:10px;height:10px;border-radius:50%;padding:0;border:none;cursor:pointer;background:${i === 0 ? '#6B1D34' : '#E8E4DF'}"></button>`).join('')}
                   </div>
-                  <button onclick="flashcardNav('${fcId}', 1)" style="padding:8px 16px;color:#34495E;font-weight:500;background:none;border:none;cursor:pointer">Next →</button>
+                  <button onclick="flashcardNav('${fcId}', 1)" style="padding:8px 16px;color:#284157;font-weight:500;background:none;border:none;cursor:pointer">Next →</button>
                 </div>
                 <div id="${fcId}-done" style="display:none;margin-top:16px;background:rgba(5,150,105,0.08);border:1px solid rgba(5,150,105,0.2);border-radius:12px;padding:12px;align-items:center;gap:8px">
                   <span style="color:#059669;font-size:14px;font-weight:600">✓ All cards reviewed! Activity complete.</span>
@@ -928,12 +928,12 @@
               </div>
               <div style="padding:24px">
                 <div id="${csId}-unplaced" style="margin-bottom:20px">
-                  <h4 style="font-weight:700;color:#34495E;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">Cards to Sort</h4>
+                  <h4 style="font-weight:700;color:#284157;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">Cards to Sort</h4>
                   <div style="display:flex;flex-wrap:wrap;gap:8px">
                     ${csShuffled.map(c => `
                       <div class="cs-card" draggable="true" data-card-id="${c.id}" data-correct-cat="${c.correctCategory}"
                         ondragstart="csDragStart(event)"
-                        style="padding:10px 16px;background:rgba(52,73,94,0.06);border:2px solid #E8E4DF;border-radius:10px;cursor:grab;font-weight:500;font-size:13px;color:#34495E;user-select:none">
+                        style="padding:10px 16px;background:rgba(52,73,94,0.06);border:2px solid #E8E4DF;border-radius:10px;cursor:grab;font-weight:500;font-size:13px;color:#284157;user-select:none">
                         ${c.text}
                       </div>
                     `).join('')}
@@ -941,14 +941,14 @@
                 </div>
                 <div style="display:grid;grid-template-columns:repeat(${Math.min(csCategories.length, 3)}, 1fr);gap:16px">
                   ${csCategories.map((cat, i) => {
-                    const colors = ['#4A7C59','#6B1D34','#D4A855','#34495E'];
+                    const colors = ['#4A7C59','#6B1D34','#D4A855','#284157'];
                     return `
                       <div class="cs-zone" data-category="${cat}"
                         ondragover="event.preventDefault();this.style.borderColor='#D4A855'"
                         ondragleave="this.style.borderColor='rgba(74,124,89,0.4)'"
                         ondrop="csDrop(event, this, '${csId}')"
-                        style="min-height:120px;border-radius:12px;border:2px dashed rgba(74,124,89,0.4);padding:16px;background:#FAFAF8">
-                        <h4 style="font-weight:700;font-size:13px;color:#34495E;margin-bottom:12px;display:flex;align-items:center;gap:8px">
+                        style="min-height:120px;border-radius:12px;border:2px dashed rgba(74,124,89,0.4);padding:16px;background:#F5F5DC">
+                        <h4 style="font-weight:700;font-size:13px;color:#284157;margin-bottom:12px;display:flex;align-items:center;gap:8px">
                           <span style="width:10px;height:10px;border-radius:50%;background:${colors[i % colors.length]}"></span>${cat}
                         </h4>
                         <div class="cs-placed" style="display:flex;flex-direction:column;gap:6px"></div>
@@ -972,7 +972,7 @@
           const sqShuffled = [...sqSteps].sort(() => Math.random() - 0.5);
           div.innerHTML = `
             <div class="bg-white rounded-xl border-2 border-slate-200 overflow-hidden" id="${sqId}">
-              <div style="background:#34495E;padding:16px 24px">
+              <div style="background:#284157;padding:16px 24px">
                 <h3 style="color:#fff;font-weight:700;font-size:17px;margin:0">📋 Sequencing Activity</h3>
                 <p style="color:rgba(255,255,255,0.5);font-size:13px;margin-top:4px">${block.instructions || 'Arrange the steps in the correct order'}</p>
               </div>
@@ -981,8 +981,8 @@
                   ${sqShuffled.map((s, i) => `
                     <div class="sq-item" draggable="true" data-order="${s.order}" data-item-id="${s.id}"
                       ondragstart="sqDragStart(event, ${i})" ondragover="sqDragOver(event, this)" ondragleave="sqDragLeave(this)" ondrop="sqDrop(event, this, '${sqId}')" ondragend="sqDragEnd(this)"
-                      style="display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:12px;user-select:none;border:2px solid #E8E4DF;background:#FAFAF8;cursor:grab">
-                      <div class="sq-num" style="width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#34495E;color:#fff;font-weight:800;font-size:14px;flex-shrink:0">${i + 1}</div>
+                      style="display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:12px;user-select:none;border:2px solid #E8E4DF;background:#F5F5DC;cursor:grab">
+                      <div class="sq-num" style="width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#284157;color:#fff;font-weight:800;font-size:14px;flex-shrink:0">${i + 1}</div>
                       <span style="width:14px;color:#9CA3AF;flex-shrink:0;font-size:16px">⋮⋮</span>
                       <span style="flex:1;font-size:14px;font-weight:500;color:#2C2C2C">${s.text}</span>
                       <div style="display:flex;flex-direction:column;gap:2px">
@@ -1042,7 +1042,7 @@
         case 'hotspot':
           const hsId = `hs-${currentSectionIndex}-${blockIndex}`;
           const hotspots = block.hotspots || [];
-          const hsCols = ['#6B1D34','#4A7C59','#D4A855','#34495E','#6366F1','#8B5CF6'];
+          const hsCols = ['#6B1D34','#4A7C59','#D4A855','#284157','#6366F1','#8B5CF6'];
           div.innerHTML = `
             <div class="bg-white rounded-xl border-2 border-slate-200 overflow-hidden" id="${hsId}">
               <div style="background:#6B1D34;padding:16px 24px">
@@ -1069,7 +1069,7 @@
                   </div>
                 </div>
                 <div id="${hsId}-info" style="display:none;margin-top:16px;border-radius:12px;padding:16px;background:rgba(52,73,94,0.06);border:1px solid #E8E4DF">
-                  <h4 id="${hsId}-info-title" style="font-weight:700;color:#34495E;margin-bottom:4px"></h4>
+                  <h4 id="${hsId}-info-title" style="font-weight:700;color:#284157;margin-bottom:4px"></h4>
                   <p id="${hsId}-info-text" style="font-size:14px;color:#6B7280;line-height:1.6;margin:0"></p>
                 </div>
                 <div id="${hsId}-done" style="display:none;margin-top:16px;background:rgba(5,150,105,0.08);border:1px solid rgba(5,150,105,0.2);border-radius:12px;padding:12px;align-items:center;gap:8px">
@@ -1084,7 +1084,7 @@
         case 'videoEmbed':
           div.innerHTML = `
             <div class="bg-white rounded-xl border-2 border-slate-200 overflow-hidden">
-              <div style="background:#34495E;padding:16px 24px">
+              <div style="background:#284157;padding:16px 24px">
                 <h3 style="color:#fff;font-weight:700;font-size:17px;margin:0;display:flex;align-items:center;gap:8px">▶ ${block.videoTitle || 'Video Content'}</h3>
                 ${block.videoDuration ? `<p style="color:rgba(255,255,255,0.5);font-size:13px;margin-top:4px">Duration: ${block.videoDuration}</p>` : ''}
               </div>
@@ -1461,7 +1461,7 @@
         <div style="display:flex;align-items:center;gap:10px;padding:8px 16px;border-radius:10px;background:${correct === total ? 'rgba(5,150,105,0.08)' : 'rgba(212,168,85,0.12)'}">
           <span style="font-weight:700">${correct}/${total} (${Math.round(correct/total*100)}%)</span>
         </div>
-        <button onclick="location.reload()" style="display:flex;align-items:center;gap:6px;padding:8px 16px;background:rgba(52,73,94,0.06);border-radius:10px;font-weight:600;color:#34495E;border:none;cursor:pointer">↺ Try Again</button>
+        <button onclick="location.reload()" style="display:flex;align-items:center;gap:6px;padding:8px 16px;background:rgba(52,73,94,0.06);border-radius:10px;font-weight:600;color:#284157;border:none;cursor:pointer">↺ Try Again</button>
       `;
     }
 
@@ -1499,8 +1499,8 @@
         labelEl.textContent = `Answer · Card ${fc.idx + 1} of ${fc.cards.length}`;
         textEl.textContent = card.back;
       } else {
-        cardEl.style.background = '#FAFAF8';
-        textEl.style.color = '#34495E';
+        cardEl.style.background = '#F5F5DC';
+        textEl.style.color = '#284157';
         labelEl.style.color = '#9CA3AF';
         labelEl.textContent = `Term · Card ${fc.idx + 1} of ${fc.cards.length}`;
         textEl.textContent = card.front;
@@ -1523,8 +1523,8 @@
       document.getElementById(fcId + '-text').textContent = card.front;
       document.getElementById(fcId + '-label').textContent = `Term · Card ${fc.idx + 1} of ${fc.cards.length}`;
       document.getElementById(fcId + '-label').style.color = '#9CA3AF';
-      document.getElementById(fcId + '-text').style.color = '#34495E';
-      document.getElementById(fcId + '-card').style.background = '#FAFAF8';
+      document.getElementById(fcId + '-text').style.color = '#284157';
+      document.getElementById(fcId + '-card').style.background = '#F5F5DC';
       flashcardUpdateDots(fcId);
     }
 
@@ -1569,19 +1569,19 @@
           <p style="font-size:14px;color:#2C2C2C;margin:0;line-height:1.6">${node.feedback.message}</p>
         </div>`;
       }
-      html += `<p style="color:#34495E;line-height:1.7;margin-bottom:24px;font-size:15px">${node.text}</p>`;
+      html += `<p style="color:#284157;line-height:1.7;margin-bottom:24px;font-size:15px">${node.text}</p>`;
       
       if (node.isEnd) {
         html += `<div style="padding:24px;border-radius:12px;text-align:center;background:${node.feedback?.type === 'positive' ? 'rgba(5,150,105,0.08)' : 'rgba(212,168,85,0.12)'}">
           <div style="font-size:40px;margin-bottom:8px">🏆</div>
-          <p style="font-weight:700;color:#34495E;margin-bottom:4px">Scenario Complete</p>
+          <p style="font-weight:700;color:#284157;margin-bottom:4px">Scenario Complete</p>
           <p style="font-size:13px;color:#6B7280">You've completed this clinical scenario.</p>
-          <button onclick="scenarioRestart('${stId}')" style="margin-top:16px;display:inline-flex;align-items:center;gap:6px;padding:8px 20px;background:#fff;border:1px solid #E8E4DF;border-radius:10px;font-weight:600;color:#34495E;cursor:pointer">↺ Try a Different Path</button>
+          <button onclick="scenarioRestart('${stId}')" style="margin-top:16px;display:inline-flex;align-items:center;gap:6px;padding:8px 20px;background:#fff;border:1px solid #E8E4DF;border-radius:10px;font-weight:600;color:#284157;cursor:pointer">↺ Try a Different Path</button>
         </div>`;
       } else {
         html += `<p style="font-size:12px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px">Choose your response:</p>`;
         (node.choices || []).forEach((ch, i) => {
-          html += `<button onclick="scenarioChoose('${stId}', '${ch.next}')" style="width:100%;text-align:left;padding:16px 20px;border-radius:12px;border:2px solid #E8E4DF;background:#FAFAF8;display:flex;align-items:center;gap:12px;cursor:pointer;margin-bottom:10px;font-family:inherit">
+          html += `<button onclick="scenarioChoose('${stId}', '${ch.next}')" style="width:100%;text-align:left;padding:16px 20px;border-radius:12px;border:2px solid #E8E4DF;background:#F5F5DC;display:flex;align-items:center;gap:12px;cursor:pointer;margin-bottom:10px;font-family:inherit">
             <div style="width:32px;height:32px;border-radius:50%;background:rgba(74,124,89,0.08);color:#4A7C59;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-weight:700;font-size:14px">${String.fromCharCode(65 + i)}</div>
             <span style="flex:1;font-weight:500;color:#2C2C2C">${ch.text}</span>
             <span style="color:#9CA3AF">→</span>
@@ -1663,7 +1663,7 @@
         card.dataset.cardId = cardId;
         card.dataset.correctCat = correctCat;
         card.setAttribute('ondragstart', 'csDragStart(event)');
-        card.style.cssText = 'padding:10px 16px;background:rgba(52,73,94,0.06);border:2px solid #E8E4DF;border-radius:10px;cursor:grab;font-weight:500;font-size:13px;color:#34495E;user-select:none';
+        card.style.cssText = 'padding:10px 16px;background:rgba(52,73,94,0.06);border:2px solid #E8E4DF;border-radius:10px;cursor:grab;font-weight:500;font-size:13px;color:#284157;user-select:none';
         card.textContent = text;
         unplaced.appendChild(card);
       }
@@ -1699,7 +1699,7 @@
           <div style="display:flex;align-items:center;gap:10px;padding:8px 16px;border-radius:10px;background:${correct === total ? 'rgba(5,150,105,0.08)' : 'rgba(212,168,85,0.12)'}">
             <span style="font-weight:700">${correct}/${total} (${Math.round(correct/total*100)}%)</span>
           </div>
-          <button onclick="location.reload()" style="display:flex;align-items:center;gap:6px;padding:8px 16px;background:rgba(52,73,94,0.06);border-radius:10px;font-weight:600;color:#34495E;border:none;cursor:pointer">↺ Try Again</button>
+          <button onclick="location.reload()" style="display:flex;align-items:center;gap:6px;padding:8px 16px;background:rgba(52,73,94,0.06);border-radius:10px;font-weight:600;color:#284157;border:none;cursor:pointer">↺ Try Again</button>
         `;
       }
     }
@@ -1723,13 +1723,13 @@
 
     function sqDragLeave(el) {
       el.style.borderColor = '#E8E4DF';
-      el.style.background = '#FAFAF8';
+      el.style.background = '#F5F5DC';
     }
 
     function sqDrop(e, targetEl, containerId) {
       e.preventDefault();
       targetEl.style.borderColor = '#E8E4DF';
-      targetEl.style.background = '#FAFAF8';
+      targetEl.style.background = '#F5F5DC';
       if (_sqDragIdx === null) return;
       
       const itemsContainer = document.getElementById(containerId + '-items');
@@ -1827,7 +1827,7 @@
           <div style="display:flex;align-items:center;gap:10px;padding:8px 16px;border-radius:10px;background:${correct === items.length ? 'rgba(5,150,105,0.08)' : 'rgba(212,168,85,0.12)'}">
             <span style="font-weight:700">${correct}/${items.length} (${Math.round(correct/items.length*100)}%)</span>
           </div>
-          <button onclick="location.reload()" style="display:flex;align-items:center;gap:6px;padding:8px 16px;background:rgba(52,73,94,0.06);border-radius:10px;font-weight:600;color:#34495E;border:none;cursor:pointer">↺ Try Again</button>
+          <button onclick="location.reload()" style="display:flex;align-items:center;gap:6px;padding:8px 16px;background:rgba(52,73,94,0.06);border-radius:10px;font-weight:600;color:#284157;border:none;cursor:pointer">↺ Try Again</button>
         `;
       }
     }
diff --git a/client/src/index.css b/client/src/index.css
index d718a1c..dfd1dea 100644
--- a/client/src/index.css
+++ b/client/src/index.css
@@ -1,6 +1,8 @@
 @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&display=swap');
 @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap');
-@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
+
+/* CounselorReady Design System Tokens */
+@import url('/css/design-tokens.css');
 
 @tailwind base;
 @tailwind components;
@@ -8,23 +10,39 @@
 
 @layer base {
   body {
-    @apply font-body text-forest-700 bg-stone-50;
+    @apply font-body text-[#2C2C2C] bg-eggshell-50;
   }
   
   h1, h2, h3, h4, h5, h6 {
-    @apply font-display text-burgundy-800;
+    @apply font-display;
+  }
+
+  h1 {
+    @apply text-burgundy-800;
+  }
+
+  h2 {
+    @apply text-navy-500;
+  }
+
+  h3 {
+    @apply font-body font-bold text-hunter-500;
+  }
+
+  h4 {
+    @apply font-body font-semibold text-navy-500;
   }
 }
 
 @layer components {
   /* Primary Button */
   .btn-primary {
-    @apply bg-moss-600 hover:bg-moss-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200;
+    @apply bg-hunter-500 hover:bg-hunter-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200;
   }
   
   /* Secondary Button */
   .btn-secondary {
-    @apply bg-white hover:bg-gray-50 text-moss-600 border border-moss-600 font-medium py-2 px-4 rounded-lg transition-colors duration-200;
+    @apply bg-white hover:bg-gray-50 text-hunter-500 border border-hunter-500 font-medium py-2 px-4 rounded-lg transition-colors duration-200;
   }
   
   /* Tertiary Button */
@@ -34,17 +52,17 @@
   
   /* Card Container */
   .card {
-    @apply bg-white rounded-xl shadow-sm border border-forest-200 p-6;
+    @apply bg-white rounded-xl shadow-sm border border-hunter-200 p-6;
   }
   
   /* Input Field */
   .input-field {
-    @apply w-full px-4 py-2 border border-forest-200 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 outline-none transition-all duration-200;
+    @apply w-full px-4 py-2 border border-hunter-200 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 outline-none transition-all duration-200;
   }
   
   /* Label */
   .label {
-    @apply block text-sm font-medium text-forest-700 mb-2;
+    @apply block text-sm font-medium text-hunter-600 mb-2;
   }
   
   /* Badge */
@@ -53,7 +71,7 @@
   }
   
   .badge-success {
-    @apply bg-forest-100 text-forest-700;
+    @apply bg-hunter-100 text-hunter-600;
   }
   
   .badge-warning {
@@ -71,7 +89,7 @@
   
   /* Page Container */
   .page-container {
-    @apply min-h-screen bg-stone-50;
+    @apply min-h-screen bg-eggshell-50;
   }
   
   /* Content Wrapper */
@@ -91,7 +109,7 @@
   
   /* Link Styles */
   .link-primary {
-    @apply text-forest-600 hover:text-forest-700 font-medium underline-offset-4 hover:underline transition-colors duration-200;
+    @apply text-hunter-500 hover:text-hunter-600 font-medium underline-offset-4 hover:underline transition-colors duration-200;
   }
   
   .link-secondary {
@@ -100,11 +118,11 @@
   
   /* Progress Bar */
   .progress-bar {
-    @apply w-full bg-forest-100 rounded-full h-2 overflow-hidden;
+    @apply w-full bg-hunter-100 rounded-full h-2 overflow-hidden;
   }
   
   .progress-fill {
-    @apply bg-forest-600 h-full transition-all duration-300 ease-out;
+    @apply bg-hunter-500 h-full transition-all duration-300 ease-out;
   }
   
   /* Alert/Notice */
@@ -113,7 +131,7 @@
   }
   
   .alert-success {
-    @apply bg-forest-100 border-forest-200 text-forest-700;
+    @apply bg-hunter-100 border-hunter-200 text-hunter-600;
   }
   
   .alert-warning {
@@ -125,7 +143,7 @@
   }
   
   .alert-info {
-    @apply bg-stone-100 border-stone-200 text-forest-700;
+    @apply bg-eggshell-100 border-eggshell-200 text-hunter-600;
   }
 }
 
diff --git a/client/src/pages/Landing.jsx b/client/src/pages/Landing.jsx
index 95368e4..038bb77 100644
--- a/client/src/pages/Landing.jsx
+++ b/client/src/pages/Landing.jsx
@@ -102,7 +102,7 @@ export default function Landing() {
             {[
               { label: 'Courses', sub: 'ACEP #7760', bg: 'linear-gradient(135deg, #8b2542, #6b1d34)', textColor: '#fae8eb', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /> },
               { label: 'Tracker', sub: 'Multi-state tracking', bg: 'linear-gradient(135deg, #355E3B, #2D4F33)', textColor: '#d5e1d7', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /> },
-              { label: 'Storage', sub: 'Certificate vault', bg: 'linear-gradient(135deg, #34495E, #2c3e50)', textColor: '#cbd5e1', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /> },
+              { label: 'Storage', sub: 'Certificate vault', bg: 'linear-gradient(135deg, #284157, #2c3e50)', textColor: '#cbd5e1', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /> },
               { label: 'Audit Ready', sub: 'One-click packages', bg: 'linear-gradient(135deg, #c49545, #D4A855)', textColor: '#4a1524', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /> },
             ].map((item) => (
               <div key={item.label} className="card-hover" style={{ background: item.bg, borderRadius: '1rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', aspectRatio: '1', cursor: 'pointer' }}>
diff --git a/client/tailwind.config.cjs b/client/tailwind.config.cjs
index 81fcb45..6a8b1f4 100644
--- a/client/tailwind.config.cjs
+++ b/client/tailwind.config.cjs
@@ -104,13 +104,12 @@ module.exports = {
           700: '#8B2542',
           800: '#6B1D34',
         },
+        // "stone-*" classes → eggshell values
         stone: {
-          50:  '#FAFAF9',
-          100: '#F5F5F4',
-          200: '#E7E5E4',
-          300: '#D6D3D1',
-          400: '#A8A29E',
-          500: '#78716C',
+          50:  '#F5F5DC',
+          100: '#EDEDD0',
+          200: '#E2E2BE',
+          300: '#D4D4A4',
         },
       },
       fontFamily: {
diff --git a/server/src/routes/ai.js b/server/src/routes/ai.js
index e97548b..f5ae298 100644
--- a/server/src/routes/ai.js
+++ b/server/src/routes/ai.js
@@ -89,7 +89,7 @@ COURSE STRUCTURE:
 }
 
 BRAND: CounselorReady — "Learn. License. Lead."
-Colors: Burgundy #6B1D34, Hunter Green #4A7C59, Gold #D4A855, Navy #34495E
+Colors: Burgundy #6B1D34, Hunter Green #4A7C59, Gold #D4A855, Navy #284157
 
 When generating content, use HTML formatting in text blocks (<p>, <h2>, <h3>, <strong>, <em>, <ul>, <li>).
 Always include proper clinical terminology and evidence-based frameworks.
diff --git a/server/src/routes/certificates.js b/server/src/routes/certificates.js
index b34a3ef..a3dd487 100644
--- a/server/src/routes/certificates.js
+++ b/server/src/routes/certificates.js
@@ -425,7 +425,7 @@ router.get('/transcript', protect, async (req, res) => {
     // === COLORS ===
     const burgundy = '#6B1D34';
     const forest = '#4A7C59';
-    const navy = '#34495E';
+    const navy = '#284157';
     const gold = '#D4A855';
     const lightGray = '#f5f5f5';
 
diff --git a/server/src/scripts/rebuildElephant.js b/server/src/scripts/rebuildElephant.js
index c269d44..031b6de 100644
--- a/server/src/scripts/rebuildElephant.js
+++ b/server/src/scripts/rebuildElephant.js
@@ -190,7 +190,7 @@ BRAND COLORS for HTML styling:
 - Burgundy: #6B1D34 — section dividers, alerts, warnings
 - Hunter Green: #4A7C59 — key concept callouts, buttons
 - Honey/Gold: #D4A855 — heading underlines, clinical example boxes, blockquote borders
-- Navy: #34495E — subheadings, tables, body emphasis
+- Navy: #284157 — subheadings, tables, body emphasis
 
 CONTENT BLOCK TYPES:
 1. "sectionDivider" - { type: "sectionDivider", title: "Section Title", sectionNumber: N }
@@ -202,13 +202,13 @@ CONTENT BLOCK TYPES:
 7. "reflection" - { type: "reflection", reflectionPrompt: "...", reflectionPlaceholder: "Type your response..." }
 
 HTML FORMATTING for text blocks:
-- Headings: <h2 style="color:#34495E; border-bottom-width:2px; border-bottom-style:solid; border-bottom-color:#D4A855; padding-bottom:8px; margin-top:40px; margin-bottom:18px; font-size:1.5rem; font-weight:700;">
+- Headings: <h2 style="color:#284157; border-bottom-width:2px; border-bottom-style:solid; border-bottom-color:#D4A855; padding-bottom:8px; margin-top:40px; margin-bottom:18px; font-size:1.5rem; font-weight:700;">
 - Subheadings: <h3 style="color:#6B1D34; margin-top: 28px; font-weight: 700;">
 - Key concept box: <div style="background: linear-gradient(135deg, rgba(74,124,89,0.08), rgba(74,124,89,0.03)); border-left: 4px solid #4A7C59; padding: 20px 24px; border-radius: 8px; margin: 24px 0;"><span style="font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.6px; color:#4A7C59; display:block; margin-bottom:8px;">💡 Key Concept</span>...</div>
 - Clinical warning: <div style="background: rgba(107,29,52,0.06); border-left: 4px solid #6B1D34; padding: 20px 24px; border-radius: 8px; margin: 24px 0;"><span style="font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.6px; color:#6B1D34; display:block; margin-bottom:8px;">⚠️ Watch for This</span>...</div>
 - Clinical example: <div style="background: rgba(212,168,85,0.08); border-left: 4px solid #D4A855; padding: 20px 24px; border-radius: 8px; margin: 24px 0;"><span style="font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.6px; color:#96782E; display:block; margin-bottom:8px;">📋 Clinical Example</span>...</div>
-- Blockquotes: <blockquote style="border-left: 3px solid #D4A855; padding: 14px 20px; margin: 24px 0; font-style: italic; color: #34495E; background: rgba(212,168,85,0.04); border-radius: 0 8px 8px 0;">
-- Tables: <table style="width:100%; border-collapse:collapse; margin:24px 0; border-radius:8px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.06);"><thead style="background:#34495E; color:#fff;">
+- Blockquotes: <blockquote style="border-left: 3px solid #D4A855; padding: 14px 20px; margin: 24px 0; font-style: italic; color: #284157; background: rgba(212,168,85,0.04); border-radius: 0 8px 8px 0;">
+- Tables: <table style="width:100%; border-collapse:collapse; margin:24px 0; border-radius:8px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.06);"><thead style="background:#284157; color:#fff;">
 - Paragraphs: substantive (4-6 sentences), flowing, with <strong> on key terms at first use
 
 CRITICAL: Return ONLY the JSON array. No markdown fences. No preamble. Start with [ and end with ].`;
@@ -371,7 +371,7 @@ async function main() {
   console.log(`${"═".repeat(60)}\n`);
 
   // Append APA references to last content section
-  const refsHTML = `<h2 style="color:#34495E; border-bottom-width:2px; border-bottom-style:solid; border-bottom-color:#D4A855; padding-bottom:8px; margin-top:40px; font-size:1.5rem; font-weight:700;">References</h2><ol style="line-height:2; color:#475569; font-size:14px; padding-left:20px;">${REFERENCES.map(r => `<li>${r.author} (${r.year}). ${r.title}. <em>${r.source}</em>.</li>`).join("")}</ol>`;
+  const refsHTML = `<h2 style="color:#284157; border-bottom-width:2px; border-bottom-style:solid; border-bottom-color:#D4A855; padding-bottom:8px; margin-top:40px; font-size:1.5rem; font-weight:700;">References</h2><ol style="line-height:2; color:#475569; font-size:14px; padding-left:20px;">${REFERENCES.map(r => `<li>${r.author} (${r.year}). ${r.title}. <em>${r.source}</em>.</li>`).join("")}</ol>`;
   sections[sections.length - 1].contentBlocks.push({ type: "text", textContent: refsHTML });
 
   // ── ASSEMBLE COURSE DOCUMENT ────────────────────────────────────
-- 
2.43.0

