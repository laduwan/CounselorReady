[CounselorReady_Gold_Standard_Course_Spec.md](https://github.com/user-attachments/files/25776224/CounselorReady_Gold_Standard_Course_Spec.md)
# CounselorReady Gold Standard Course Template Spec
## Version 1.0 — March 5, 2026

**Target course:** Ethics and Professional Boundaries in Counseling Practice (3CE)
**Purpose:** Define the exact layout, block placement, activity distribution, and visual treatment for every course on CounselorReady. Once this course is built, all others follow this pattern.

---

## 1. Course Architecture

### 1.1 Section Count Formula
- **1 CE hour = 2 sections** (content split into digestible 30-minute segments)
- 3 CE course = 6 content sections + 1 conclusion/assessment section = **7 sections total**
- 4 CE course = 8 content sections + 1 conclusion section = 9 sections
- 1 CE course = 2 content sections + 1 conclusion section = 3 sections

### 1.2 Word Count Per Section
- Target: **3,000 words per content section** (for 3CE = 18,000+ total)
- Words come from text blocks, accordion content, scenario feedback, flashcard backs — all count
- Never put all content in a single giant text block — break into 3-5 text blocks per section

### 1.3 Section Structure Template
Every content section follows this rhythm:

```
┌─────────────────────────────────────────────────┐
│  1. SECTION DIVIDER (title + subtitle + number)  │
│  2. TEXT BLOCK — Introduction (300-500 words)     │
│  3. ACCORDION — Key Concepts (3-5 expandable)    │
│  4. TEXT BLOCK — Deep Dive (800-1200 words)       │
│  5. CLINICAL VIGNETTE (blockquote in text block) │
│  6. INTERACTIVE ACTIVITY (varies by section)      │
│  7. TEXT BLOCK — Application (400-600 words)      │
│  8. KNOWLEDGE CHECK — 2-3 questions               │
│  9. REFLECTION — Prompt for personal application  │
└─────────────────────────────────────────────────┘
```

This is a **rhythm**, not a rigid template. Some sections emphasize the vignette, others the activity. But every section MUST have:
- At least 1 section divider
- At least 2 text blocks
- At least 1 interactive activity (not a KC)
- 2-3 knowledge checks
- At least 1 reflection or clinical application prompt

---

## 2. Section Divider Spec

Every section starts with a `sectionDivider` block.

```json
{
  "type": "sectionDivider",
  "title": "Foundations of Counseling Ethics",
  "subtitle": "Historical context, core principles, and the ACA Code of Ethics",
  "sectionNumber": "1",
  "order": 1
}
```

**Rules:**
- `title`: Module-level heading. Short, professional. No "Module 1:" prefix — the sectionNumber handles numbering.
- `subtitle`: 1-line description of what this section covers. Always included. Never omitted.
- `sectionNumber`: String, matches section order ("1", "2", etc.)

---

## 3. Text Block Spec

### 3.1 Text Content Rules
- All content is HTML — no raw markdown
- Wrap in semantic elements: `<h2>`, `<h3>`, `<h4>`, `<p>`, `<blockquote>`, `<table>`, `<ul>`, `<ol>`
- No inline styles — the `.cr-content` wrapper and design-tokens.css handle everything
- No `<h1>` — reserved for the player's section title
- No `<div>` without a `cr-*` class
- Every clinical claim has an in-text citation: `(Author, Year)`

### 3.2 Text Block Sizing
- **Introduction text block**: 300-500 words. Sets the stage for the section. Mentions what the learner will explore.
- **Deep dive text block**: 800-1,200 words. The meat of the content. Includes subheadings (H3, H4), evidence-based content, clinical examples.
- **Application text block**: 400-600 words. Bridges theory to practice. Often follows an activity.
- **Never exceed 1,500 words in a single text block.** Split into multiple blocks with activities between them.

### 3.3 Clinical Vignettes
Use `<blockquote>` inside text blocks for clinical vignettes/case examples:

```html
<blockquote>
<p><strong>Case Example:</strong> Dr. Martinez, a licensed counselor in a rural community, discovers that her new client is also the parent volunteer coordinator at her child's school. She must navigate this unavoidable dual relationship while maintaining professional boundaries and protecting the therapeutic alliance.</p>
</blockquote>
```

Vignettes should:
- Feature diverse client populations (vary age, race, gender, setting, SES)
- Present realistic clinical complexity — not textbook-clean scenarios
- Use continuing characters where possible (a client who appears in multiple sections)
- Include enough detail for the learner to think clinically

### 3.4 Tables
Use HTML tables for comparison data, frameworks, decision matrices:

```html
<table>
  <thead>
    <tr><th>Boundary Crossing</th><th>Boundary Violation</th></tr>
  </thead>
  <tbody>
    <tr><td>May benefit the client</td><td>Exploits or harms the client</td></tr>
    <tr><td>Context-dependent</td><td>Always unethical</td></tr>
    <tr><td>Documented and supervised</td><td>Hidden or denied</td></tr>
  </tbody>
</table>
```

Tables get styled automatically by the player's CSS (green headers, alternating rows).

---

## 4. Interactive Activity Distribution

### 4.1 Activity Types Available
| Type | Best For | Engagement Level |
|---|---|---|
| `accordion` | Key concepts, definitions, "did you know" | Low (expandable reading) |
| `flashcardDeck` | Terminology, DSM criteria, frameworks | Medium (review/memorize) |
| `matching` | Term-to-definition, concept-to-example | Medium (drag-and-drop) |
| `cardSort` | Categorization (ethical vs. unethical, symptoms to disorder) | Medium-High |
| `scenarioTree` | Clinical decision-making, branching vignettes | High (branching choices) |
| `reflection` | Personal application, self-assessment | Medium (open-ended) |
| `multipleChoice` | Knowledge checks (graded comprehension) | Medium |
| `multiSelect` | "Select all that apply" questions | Medium |

### 4.2 Distribution Rules
**Per section (2-3 activities minimum, not counting KCs):**
- Every section gets at least 1 "engagement" activity (accordion, flashcard, matching, cardSort, scenarioTree, or reflection)
- No two identical activity types in a row
- No more than 3 multipleChoice blocks in a row (breaks up quiz fatigue)
- ScenarioTrees go in sections with clinical vignettes — they extend the case
- Reflections go near the end of sections — after the learner has absorbed content

**Across the full course, ensure variety:**
| Activity Type | Min Per Course (3CE) | Placement |
|---|---|---|
| accordion | 3-4 | Sections 1-3 (front-loaded for foundational concepts) |
| flashcardDeck | 2-3 | Mid-course sections (terminology consolidation) |
| matching | 2-3 | Distributed evenly |
| cardSort | 1-2 | Sections where categorization is natural |
| scenarioTree | 3-4 | After clinical vignettes — never in Section 1 |
| reflection | 4-6 | End of each content section |
| multipleChoice (KC) | 14-21 | 2-3 per section |

### 4.3 Activity Placement Pattern
```
Section 1: accordion → KC → KC → reflection
Section 2: matching → scenarioTree → KC → KC → reflection
Section 3: accordion → flashcardDeck → KC → KC → KC → reflection
Section 4: scenarioTree → cardSort → KC → KC → reflection
Section 5: matching → flashcardDeck → scenarioTree → KC → KC → reflection
Section 6: accordion → scenarioTree → KC → KC → KC → reflection
Section 7: (Conclusion — summary accordion + final reflection + resources)
```

**Anti-patterns to avoid:**
- ❌ 6 matching exercises in one section
- ❌ 5 multipleChoice blocks back-to-back
- ❌ ScenarioTree as the first block after section divider (need context first)
- ❌ Accordion → Accordion → Accordion (monotonous)
- ❌ All activities bunched at the end of the section
- ❌ Reflection before any content has been presented

---

## 5. Knowledge Check Spec

### 5.1 Format
```json
{
  "type": "multipleChoice",
  "question": "According to the ACA Code of Ethics, which principle requires counselors to avoid actions that could cause harm?",
  "options": [
    "Autonomy",
    "Nonmaleficence",
    "Beneficence",
    "Fidelity"
  ],
  "correctAnswer": 1,
  "explanation": "Nonmaleficence (Standard A.4.a) requires counselors to avoid actions that risk harming clients. While beneficence also involves client welfare, nonmaleficence specifically addresses the obligation to do no harm.",
  "order": 8
}
```

### 5.2 Rules
- **Options**: Always string array with `correctAnswer` index (0-based). NEVER `{text, isCorrect}` format.
- **Correct answer**: Distribute across A, B, C, D roughly equally across the course. Never default all to 0.
- **Explanation**: Always included. Explains WHY the correct answer is right AND why the most tempting wrong answer is wrong.
- **Question quality**: Test clinical reasoning and application, not rote recall. "According to..." and "Which of the following best describes..." are fine. "What year was the ACA Code published?" is not.
- **Placement**: After content that teaches the concept being tested. Never test content from a different section.
- **Count**: 2-3 per section. Exactly 2 for shorter sections, 3 for longer ones.

---

## 6. Scenario Tree Spec

### 6.1 Structure
```json
{
  "type": "scenarioTree",
  "title": "The Rural Dual Relationship",
  "instructions": "You discover your new client is also a parent at your child's school. Navigate this ethical challenge.",
  "nodes": {
    "start": {
      "text": "During intake, you recognize your new client as the parent volunteer coordinator at your child's elementary school. She hasn't recognized you yet. What do you do?",
      "options": [
        { "text": "Proceed with the session without mentioning the connection", "next": "no_disclose" },
        { "text": "Immediately disclose the potential dual relationship", "next": "disclose" },
        { "text": "End the session and refer to another counselor", "next": "refer" }
      ]
    },
    "disclose": {
      "text": "You disclose the connection. The client says she's comfortable continuing and has been on a waitlist for 3 months. How do you proceed?",
      "feedback": { "message": "Good clinical judgment. Transparency is essential when potential dual relationships are identified.", "type": "positive" },
      "options": [
        { "text": "Agree to continue with documented boundaries", "next": "continue_boundaries" },
        { "text": "Insist on referring despite client preference", "next": "insist_refer" }
      ]
    },
    "no_disclose": {
      "text": "Two sessions later, she recognizes you at a school event. She feels betrayed that you didn't mention knowing her. The therapeutic alliance is damaged.",
      "feedback": { "message": "Failing to disclose a known dual relationship violates the principle of honesty (ACA Code A.4.b) and can damage trust irreparably.", "type": "negative" }
    },
    "refer": {
      "text": "You explain the ethical concern and offer a referral. She's frustrated — she waited months and finally found a counselor accepting her insurance.",
      "feedback": { "message": "While referral protects boundaries, immediate termination without exploring alternatives may constitute abandonment, especially in areas with limited providers.", "type": "neutral" }
    },
    "continue_boundaries": {
      "text": "You document the dual relationship, establish clear boundaries about school interactions, and plan for ongoing consultation. The therapeutic relationship develops successfully.",
      "feedback": { "message": "This approach follows ACA Standard A.6.b — when dual relationships are unavoidable, counselors take reasonable steps to manage them, including documentation, informed consent, and consultation.", "type": "positive" }
    },
    "insist_refer": {
      "text": "The client reluctantly accepts the referral but is placed on another 2-month waitlist. Her presenting symptoms of anxiety worsen during the gap in care.",
      "feedback": { "message": "Rigid application of boundary rules without considering client welfare can itself cause harm. Ethical decision-making requires balancing multiple principles.", "type": "neutral" }
    }
  }
}
```

### 6.2 Rules
- Minimum 3 nodes, maximum 8
- Every branch must end with feedback (positive, negative, or neutral)
- Feedback must cite specific ethical standards or clinical evidence
- Scenarios must feature diverse populations and settings
- Avoid obvious "right answers" — ethical dilemmas should have genuine tension
- The "best" path should demonstrate nuanced clinical reasoning, not just following rules

---

## 7. Accordion Spec

```json
{
  "type": "accordion",
  "title": "Core Ethical Principles",
  "accordionItems": [
    {
      "title": "Autonomy",
      "content": "<p>The right of clients to make their own decisions and govern their own lives. Counselors respect client autonomy by providing informed consent, supporting self-determination, and avoiding imposing personal values (ACA Code A.4.a).</p><p><strong>Clinical application:</strong> When a client chooses a path you disagree with clinically, autonomy requires you to explore their reasoning, ensure informed decision-making, and respect their choice unless it involves imminent harm.</p>"
    },
    {
      "title": "Nonmaleficence",
      "content": "<p>The obligation to avoid causing harm — often summarized as 'first, do no harm.' This includes avoiding actions, inactions, and dual relationships that could foreseeably harm clients (Beauchamp & Childress, 2019).</p>"
    },
    {
      "title": "Beneficence",
      "content": "<p>The active commitment to promoting client welfare and working in the client's best interest. Goes beyond avoiding harm to actively contributing to the client's wellbeing and growth.</p>"
    },
    {
      "title": "Justice",
      "content": "<p>Fair and equitable treatment of all clients, including equal access to services and nondiscrimination. Requires counselors to examine their own biases and work toward equitable practice (ACA Code C.5).</p>"
    },
    {
      "title": "Fidelity",
      "content": "<p>Honoring commitments, maintaining trust, and being loyal to the therapeutic relationship. Includes keeping promises, maintaining confidentiality, and following through on professional obligations.</p>"
    }
  ]
}
```

**Rules:**
- 3-5 items per accordion (never more than 7)
- Each item: 50-150 words
- Content includes clinical application when possible
- Used for foundational concepts, definitions, "types of" lists — NOT for primary instructional content

---

## 8. Flashcard Deck Spec

```json
{
  "type": "flashcardDeck",
  "title": "Ethical Decision-Making Terminology",
  "instructions": "Review these key terms from this section. Flip each card to see the definition.",
  "cards": [
    { "front": "Ethical Dilemma", "back": "A situation where two or more ethical principles conflict, requiring the counselor to choose between competing obligations (e.g., client confidentiality vs. duty to warn)." },
    { "front": "Boundary Crossing", "back": "A departure from standard clinical practice that may benefit the client and does not constitute exploitation. Context-dependent and should be documented." },
    { "front": "Tarasoff Duty", "back": "The legal obligation to warn identifiable potential victims when a client makes a credible threat of violence. Established by Tarasoff v. Regents (1976)." }
  ]
}
```

**Rules:**
- 5-8 cards per deck (enough to be useful, not overwhelming)
- Front: term or concept name (short)
- Back: definition + clinical relevance (2-3 sentences max)
- Place in mid-to-late sections for terminology consolidation

---

## 9. Matching Exercise Spec

```json
{
  "type": "matching",
  "title": "Match the Ethical Principle to Its Application",
  "instructions": "Drag each principle to its corresponding clinical application.",
  "pairs": [
    { "term": "Autonomy", "definition": "Supporting a client's decision to discontinue medication against your clinical recommendation" },
    { "term": "Nonmaleficence", "definition": "Declining to provide a service outside your scope of competence" },
    { "term": "Beneficence", "definition": "Advocating for a client's access to community resources" },
    { "term": "Fidelity", "definition": "Maintaining confidentiality even when pressured by a client's family" }
  ]
}
```

**Rules:**
- 4-6 pairs per exercise
- Terms are short (1-3 words)
- Definitions are application-level, not textbook definitions (that's what flashcards are for)

---

## 10. Reflection Spec

```json
{
  "type": "reflection",
  "title": "Personal Ethical Inventory",
  "prompt": "Consider your own clinical practice over the past year. Identify one situation where you navigated a boundary decision. What ethical principles guided your response? What would you do differently with the knowledge from this section?",
  "guidelines": "Take 2-3 minutes to reflect. There are no right or wrong answers — this is for your professional development."
}
```

**Rules:**
- Prompt is specific, not generic ("reflect on what you learned" is lazy)
- Connects to the section's content directly
- Asks the learner to apply concepts to their own practice
- 1 per section, placed near the end (after content + activity + KCs)

---

## 11. Conclusion Section (Final Section)

The last section is structured differently:

```
┌─────────────────────────────────────────────────┐
│  1. SECTION DIVIDER — "Course Summary & Review"  │
│  2. TEXT BLOCK — Key Takeaways (500-700 words)    │
│  3. ACCORDION — "Module Highlights" (1 per module)│
│  4. TEXT BLOCK — Ethical Practice Plan (300-400w)  │
│  5. REFLECTION — Course-level reflection prompt   │
│  6. RESOURCES BLOCK — Downloadable/external links │
│  7. REFERENCES — APA 7th Edition reference list   │
└─────────────────────────────────────────────────┘
```

No knowledge checks in the conclusion — those are in the Final Exam.

---

## 12. Final Assessment (Post-Test)

Stored in `course.assessment`:

```json
{
  "questions": [ /* 15-20 questions */ ],
  "passingScore": 80,
  "maxAttempts": 3
}
```

**Rules:**
- Minimum 15 questions for courses 1-3 CE hours. Add 3-5 per additional CE hour.
- Questions sample from ALL sections — not just the last one
- Distribute correct answers: roughly 25% A, 25% B, 25% C, 25% D
- Every question has an `explanation`
- Questions test application and synthesis, not recall
- Never duplicate knowledge check questions verbatim — rephrase or test at a higher Bloom's level

---

## 13. Resources Block Spec

```json
{
  "type": "resources",
  "title": "Additional Resources",
  "resources": [
    { "title": "ACA Code of Ethics (2014)", "url": "https://www.counseling.org/resources/aca-code-of-ethics.pdf", "description": "Complete text of the current ACA ethical standards" },
    { "title": "Ethics Decision-Making Worksheet", "url": "/downloads/ethics-worksheet.pdf", "description": "Printable worksheet for applying the Forester-Miller & Davis model" }
  ]
}
```

---

## 14. References

Stored both in the `references[]` array on the course document AND as a text block in the conclusion section with `.cr-references` formatting:

```html
<div class="cr-references">
  <h2>References</h2>
  <p class="cr-reference">American Counseling Association. (2014). <em>ACA code of ethics</em>. https://www.counseling.org/resources/aca-code-of-ethics.pdf</p>
  <p class="cr-reference">Barnett, J. E. (2017). <em>Ethical and legal issues in counseling</em>. In D. Capuzzi & D. R. Gross (Eds.), Introduction to the counseling profession (7th ed.). Routledge.</p>
</div>
```

---

## 15. Visual Treatment Consistency Checklist

Every course must have:
- [ ] Section dividers with title AND subtitle on every section
- [ ] No section starts with a bare text block — always a divider first
- [ ] Clinical vignettes wrapped in `<blockquote>` (gold left border)
- [ ] Tables used for comparison/framework data (not for layout)
- [ ] H2 headings for major topics within text blocks
- [ ] H3 headings for subtopics
- [ ] At least 1 table per course
- [ ] At least 3 different interactive activity types per course
- [ ] No more than 3 KCs in a row without a different block type between them
- [ ] Reflection at the end of every content section
- [ ] Resources block in the conclusion
- [ ] References in APA 7th with `.cr-reference` hanging indent

---

## 16. Ethics & Boundaries Course Outline (Gold Standard Build)

**Section 1: Foundations of Counseling Ethics**
- Subtitle: "Historical context, core principles, and the ACA Code of Ethics"
- Text: Evolution of ethical codes, 2014 ACA Code structure
- Accordion: 5 core ethical principles (autonomy, nonmaleficence, beneficence, justice, fidelity)
- Text: Applying principles in practice, intersections and conflicts
- Vignette: Autonomy vs. beneficence — client refuses treatment
- KC ×2
- Reflection: Identify which principle you rely on most in your practice

**Section 2: Ethical Decision-Making Models**
- Subtitle: "Frameworks for navigating complex ethical dilemmas"
- Text: Why intuition isn't enough, structured decision-making
- Accordion: 3 models (Kitchener, Forester-Miller & Davis, Wheeler & Bertram)
- Text: Comparative analysis of models, when to use which
- ScenarioTree: Client discloses DUI with children — apply two models
- Matching: Match model steps to real clinical actions
- KC ×3
- Reflection: Which model resonates with your practice style?

**Section 3: Professional Boundaries**
- Subtitle: "Crossings, violations, and the slippery slope"
- Text: Defining boundaries, therapeutic frame
- Table: Boundary crossings vs. violations (comparison matrix)
- Text: Risk factors, slippery slope research, warning signs
- FlashcardDeck: Boundary terminology (8 cards)
- Vignette: Social media friend request from a client
- ScenarioTree: Rural dual relationship navigation
- KC ×3
- Reflection: Personal boundaries self-assessment

**Section 4: Confidentiality and Its Limits**
- Subtitle: "Privacy, privilege, and the exceptions that keep clients safe"
- Text: Foundation of confidentiality, therapeutic necessity
- Accordion: Exceptions (duty to warn, mandated reporting, court orders, client waiver)
- Text: HIPAA minimum necessary standard, state-specific variations
- Table: Confidentiality exceptions by situation
- CardSort: Categorize scenarios as "must disclose" vs. "maintain confidentiality"
- ScenarioTree: Tarasoff-style threat assessment
- KC ×2
- Reflection: Your most challenging confidentiality decision

**Section 5: Dual Relationships and Multiple Roles**
- Subtitle: "Navigating the gray areas of professional relationships"
- Text: ACA standards on dual relationships, unavoidable situations
- Matching: Match relationship types to ethical responses
- Text: Cultural considerations, rural/military/small community contexts
- FlashcardDeck: Types of dual relationships (6 cards)
- ScenarioTree: Bartering for therapy services — navigate the ethical terrain
- KC ×3
- Reflection: Dual relationship risk inventory

**Section 6: Building an Ethical Practice**
- Subtitle: "Proactive strategies for ethical maintenance and professional growth"
- Text: Ethical practice plans, supervision, consultation
- Accordion: Components of an ethical practice plan (5 items)
- Text: Self-care as ethical obligation, recognizing impairment
- Table: Warning signs of ethical drift
- Matching: Match strategies to ethical risk factors
- KC ×2
- Reflection: Draft your personal ethical practice plan (3 commitments)

**Section 7: Course Summary & Assessment**
- Subtitle: "Review, reflect, and prepare for the final exam"
- Text: Key takeaways across all modules
- Accordion: Module highlights (6 panels, one per content section)
- Text: Ethical practice as ongoing commitment
- Reflection: Course-level — What is the single most important insight from this course?
- Resources: ACA Code PDF, ethics worksheet, state licensing board links
- References: APA 7th edition reference list (15-20 references)

---

## 17. Seed Script Expectations

When building the seed script for this course:

1. **Self-contained** — all content embedded directly, no external file reads
2. **ES module** — use `import mongoose from 'mongoose'` and `import dotenv from 'dotenv'`
3. **Saves as draft** — `status: 'draft'`, `isPublished: false`
4. **Deletes existing** — `deleteOne({ slug: '...' })` before inserting
5. **Correct schema** — `sections[].contentBlocks[]` for `interactivecourses` collection
6. **Word count computed** — strip HTML, count words, store in `wordCount` field
7. **Assessment included** — 15-20 questions with correct answers distributed across A/B/C/D
8. **References structured** — both in `references[]` array AND as HTML in conclusion section
9. **Naming convention** — `seedCR-ETH301-Ethics_Professional_Boundaries-{wordcount}words.js`
10. **Console output** — section count, word count, KC count, assessment question count

---

---

## 18. Pipeline Safeguards — Lessons From Every Failure

These rules exist because every one of them was violated at least once, destroying course content.

### 18.1 Content Stripping Prevention

**Problem:** Passing existing course content through the AI API for "restructuring" causes 50%+ word loss. The API summarizes instead of restructuring.

**Rules:**
- NEVER send existing course text to any API endpoint for restructuring, reformatting, or "improvement"
- The seed script contains ALL content directly as string literals — no API generation calls
- If content needs restructuring, do it in the seed script's source code, not at runtime
- Every text block has its word count verified in the seed script before insertion
- The script logs `TOTAL WORDS: X / REQUIRED: Y` at the end — if under minimum, the script REFUSES to save

### 18.2 Content Block Integrity

**Problem:** Previous pipelines flattened rich content into a single text block, destroyed table HTML, embedded quiz text as plain paragraphs, and dumped metadata into instructional content.

**Rules:**
- Each `contentBlock` is a discrete, typed object — never concatenate multiple blocks into one
- Tables are full HTML (`<table><thead>...<tbody>...`) — never markdown pipe format, never `[TABLE]` placeholders
- Knowledge checks are always `multipleChoice` blocks with `options[]` string arrays and `correctAnswer` index — never embedded as text in a text block
- Quiz questions never appear inside text block HTML — they are separate `multipleChoice` contentBlocks
- No ACEP metadata in content blocks — no "GAITP LLC", no "Provider #7760", no "Learn. License. Lead.", no "Course Hours:", no "Target Audience:" in any text block's HTML
- The overview card in the player renders objectives, audience, and CE hours from course-level fields — this data does NOT go into Section 1 text blocks
- Section 1 starts with instructional content, not a repeat of the course title or overview

### 18.3 Reference Placement

**Problem:** References ended up in random sections, duplicated across modules, embedded inside instructional text blocks, or dropped entirely.

**Rules:**
- References appear in EXACTLY TWO places:
  1. The `course.references[]` array (structured objects with author, year, title, source) — this feeds the player's References tab
  2. A single text block in the FINAL section (conclusion) using `.cr-references` and `.cr-reference` CSS classes — this is the learner-visible reference list
- References NEVER appear in content sections (Sections 1-6 for a 3CE course)
- In-text citations (`Author, Year`) appear naturally in content blocks — but the full reference entry is ONLY in the conclusion
- The seed script validates: `references.length >= 15` for 3CE courses. If under, script warns.
- Reference HTML uses APA 7th hanging indent format:
  ```html
  <p class="cr-reference">Author, A. B. (Year). <em>Title of work</em>. Publisher.</p>
  ```
- NO raw reference dumps — every reference is a separate `<p class="cr-reference">` element
- References are alphabetized by first author last name

### 18.4 Color Hierarchy Enforcement

**Problem:** Inconsistent heading colors, deprecated hex values (#34495E instead of #284157), inline styles overriding the design system.

**Rules:**
- **NO inline styles in ANY content block HTML.** Zero. None. The design system handles everything.
- Content blocks use semantic HTML only: `<h2>`, `<h3>`, `<h4>`, `<p>`, `<blockquote>`, `<table>`, `<strong>`, `<em>`, `<ul>`, `<ol>`, `<li>`
- The player's CSS applies the correct colors automatically:
  - `<h2>` → Navy #284157, Cormorant Garamond, 1.75rem
  - `<h3>` → Hunter Green #4A7C59, Lato, 1.25rem
  - `<h4>` → Navy #284157, Lato, 1.1rem
  - `<p>` → #2C2C2C, Lato, 1rem
  - `<blockquote>` → Gold left border, eggshell background
  - `<table> <th>` → Green header background, navy text
- If a seed script contains ANY of these hex values in content HTML, it's wrong:
  - ❌ `#34495E` (deprecated navy — use #284157)
  - ❌ `#FAFAF8` or `#FAFAF9` (deprecated eggshell — use #F5F5DC)
  - ❌ `#40634A` (deprecated green — use #4A7C59)
  - ❌ ANY `style="color:..."` or `style="background:..."` in content block HTML
- The seed script includes a validation step that scans all content HTML for inline styles and deprecated colors. If found, it logs a warning with the block location.

### 18.5 Assessment Answer Distribution

**Problem:** All KC answers defaulting to index 0 (answer A) because correctAnswer was never set or was set by a broken extractor.

**Rules:**
- Every `multipleChoice` block MUST have `correctAnswer` set to the actual correct index (0-3)
- The seed script tracks answer distribution and logs it:
  ```
  Answer distribution: A=4, B=5, C=4, D=5 (18 total)
  ```
- If any single answer letter exceeds 40% of total, the script warns: "Answer distribution skewed"
- Final assessment questions follow the same rule — no more than 5 consecutive questions with the same correct answer
- Explanations reference specific ethical standards or clinical evidence — never generic "Correct!" or empty string

### 18.6 Section Consistency Enforcement

**Problem:** Some sections had subtitles, some didn't. Some had section dividers, some started with bare text. Activity placement was random.

**Rules:**
- EVERY section starts with a `sectionDivider` block that has BOTH `title` AND `subtitle`. No exceptions.
- EVERY content section (not conclusion) has at minimum:
  - 1 sectionDivider
  - 2+ text blocks
  - 1+ interactive activity (accordion, flashcard, matching, cardSort, scenarioTree)
  - 2-3 multipleChoice knowledge checks
  - 1 reflection
- The seed script validates this per-section and logs failures:
  ```
  ❌ Section 3 missing: reflection
  ❌ Section 5 missing: interactive activity
  ```
- Block `order` values are sequential within each section (1, 2, 3...) — no gaps, no duplicates
- ContentBlocks are ordered intentionally: divider → text → activity → text → KC → reflection. Not randomly shuffled.

### 18.7 Seed Script Self-Validation

The seed script runs these checks BEFORE saving to the database. If any CRITICAL check fails, it refuses to save.

```
CRITICAL (blocks save):
  □ Total words >= ceHours × 6,000
  □ Every section has a sectionDivider with title + subtitle
  □ Every multipleChoice has correctAnswer set (not undefined/null)
  □ No inline styles in content HTML
  □ No deprecated hex values in content HTML
  □ Assessment has >= 15 questions
  □ Assessment passingScore = 80, maxAttempts = 3
  □ References array has >= 15 entries
  □ References appear ONLY in conclusion section

WARNING (logs but saves):
  □ Any section under 2,500 words
  □ Any section missing an interactive activity
  □ Answer distribution skewed (>40% one letter)
  □ Fewer than 4 learning objectives
  □ Missing targetAudience field
```

### 18.8 Render Deployment Constraints

**Problem:** Scripts fail on Render due to module format issues, paste limits, or missing dependencies.

**Rules:**
- Seed scripts use ES module syntax (`import` not `require`) because server/package.json has `"type": "module"`
- Scripts are pushed to GitHub and run from file — never pasted into Render shell
- All content is embedded in the script — no `fs.readFileSync()` calls to external files that may not exist on Render
- Script connects using `process.env.MONGODB_URI` — no hardcoded connection strings
- Script disconnects from MongoDB before exiting
- Script uses `process.exit(0)` on success, `process.exit(1)` on failure

---

*This spec is the binding authority for all course builds. If a course doesn't match this spec, it's not ready for production.*
