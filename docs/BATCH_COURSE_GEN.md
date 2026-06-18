# Batch Course Generation — Autonomous Pipeline

> **Trigger:** User says anything like "generate courses", "batch courses", "new course batch",
> "write courses", or gives a topic + CE hours + count.
>
> **CC reads this file, asks 3 questions, then runs the entire pipeline without stopping.**

---

## Step 1 — Ask exactly 3 questions (then stop asking)

```
1. Subject area or topic? (e.g. "trauma-informed care", "ethics in telehealth", "grief counseling")
2. CE hours per course? (1, 2, 3, or 6)
3. How many courses in this batch? (1-5)
```

If the user already provided any of these in their message, skip that question.
Once you have all 3 answers, say "Generating [N] courses — I'll write each seed file, validate it, and move on. No further input needed until all are done."

Then execute Steps 2-5 for each course **without pausing for confirmation**.

---

## Step 2 — Generate course metadata

For each course in the batch, auto-generate:
- **Title:** Professional, specific, CE-worthy (not generic). Example: "Somatic Approaches to Complex Trauma Processing" not "Trauma Course"
- **Course code:** `CR-[ABBREV]-[3-digit]` (e.g. CR-TIC-301, CR-ETH-405, CR-GRF-201)
- **Slug:** kebab-case from title
- **4-6 learning objectives** starting with action verbs (Identify, Apply, Evaluate, Demonstrate, Analyze, Compare)
- **Category:** ethics | clinical | multicultural | supervision | professional_development
- **Description:** 2-3 sentences describing clinical relevance

Each course in a batch should cover a **different angle** of the subject area — not the same content repackaged.

Example: Subject "grief counseling", 3 courses:
1. "Complicated Grief: Assessment, Diagnosis, and Evidence-Based Treatment" (clinical focus)
2. "Cultural Dimensions of Death, Dying, and Bereavement in Counseling" (multicultural focus)
3. "Ethical Boundaries in Grief Work: Dual Relationships and Self-Disclosure" (ethics focus)

---

## Step 3 — Write the seed script

Read these files first (every time, even if you think you know the shapes):
```
server/src/models/InteractiveCourse.js
docs/SEED_AUTHORING_AND_VIEWER_GUIDE.md
```

Generate one complete seed file per course. File goes in `server/src/scripts/`.

### Filename convention
```
seed[CODE]-[Title_Slug]-[wordcount]words.js
```

### Course-level structure

```js
const COURSE = {
  title: "...",
  slug: "...",
  courseCode: "...",
  description: "...",
  ceHours: N,
  ceuHours: N,
  category: "...",
  difficulty: "intermediate",
  targetAudience: "Licensed mental health professionals (LPCs, LCSWs, LMFTs, NCCs)",
  learningObjectives: [...],
  presenter: {
    name: "Kejuiana Johnson",
    credentials: "MA, LPC, NCC, CPCS, BC-TMH",
    licenseNumber: "LPC009587",
    licenseState: "Georgia",
    licenseType: "LPC"
  },
  provider: {
    name: "GA Integrated Therapeutic Perspectives LLC",
    shortName: "GAITP LLC",
    acepNumber: "7760",
    approvalBody: "NBCC"
  },
  approvals: [{
    body: "NBCC",
    number: "#7760",
    hourBreakdown: [{ label: "core", hours: N }]
  }],
  isPublished: false,
  status: "draft",
  sections: [...],
  assessment: {...},
  references: [...],
  wordCount: 0 // computed by validation
};
```

### Section count by CE hours

| CE Hours | Content Sections | Words Target |
|----------|-----------------|--------------|
| 1        | 3               | 6,000+       |
| 2        | 4-5             | 12,000+      |
| 3        | 5-6             | 18,000+      |
| 6        | 10-13           | 36,000+      |

---

## Step 4 — Block variety requirements (MANDATORY)

### Per section — every content section MUST have ALL of these:

| Requirement | Block type(s) | Details |
|-------------|--------------|---------|
| Divider | `sectionDivider` | `title` + `subtitle` required |
| Prose | `text` × 2-4 | 500-800 words each, HTML |
| Expandable | `accordion` | 3-5 items with clinical depth |
| Highlight | `callout` | Rotate: ethics, clinical, warning, tip, protocol, donot |
| KC blocks | 2-3 per section | **Different types per section** — see rotation below |
| Activity | 1 per section | **Different type per section** — see rotation below |
| Reflection | `reflection` | Clinically specific prompt |
| Summary | `keyTakeaway` | 3-5 bullet items |

### KC type rotation (cycle through sections)

| Section | KC Type 1 | KC Type 2 | KC Type 3 (optional) |
|---------|-----------|-----------|----------------------|
| 1 | multipleChoice | matching | — |
| 2 | multiSelect | fillInBlank | — |
| 3 | matching | multipleChoice | multiSelect |
| 4 | fillInBlank | multiSelect | — |
| 5 | multipleChoice | matching | fillInBlank |
| 6+ | Continue rotating, never repeat the same pair twice in a row |

### Activity rotation (cycle through sections)

| Section | Activity Type |
|---------|--------------|
| 1 | flashcardDeck |
| 2 | scenarioTree |
| 3 | cardSort |
| 4 | sequencing |
| 5 | flashcardDeck |
| 6+ | Continue rotating |

### Media (per course, not per section)

| Media Type | Minimum | Placement |
|-----------|---------|-----------|
| `videoEmbed` | 2 | Sections 1 and middle section |
| `imageText` | 2 | Sections 2 and second-to-last |
| `resources` | 1 | Last content section (before conclusion) |

### Block ordering within each section

```
sectionDivider
text (intro)
callout
text (deeper content)
accordion
videoEmbed or imageText (if this section has one)
KC block 1
text (case material / clinical application)
activity (flashcardDeck / scenarioTree / cardSort / sequencing)
KC block 2
reflection
keyTakeaway
```

---

## Block shapes — EXACT fields (verified against viewer)

```js
// ── sectionDivider ──
{ type: "sectionDivider", title: "...", subtitle: "...", sectionNumber: N }

// ── text ──
{ type: "text", content: "<p>HTML prose</p>" }

// ── imageText ──
{ type: "imageText", content: "<p>HTML prose</p>",
  image: "", // empty = text-only render (no broken img). TODO comment for Cloudinary upload
  imageAlt: "...", imagePosition: "left" | "right", highlight: false }

// ── accordion ──
{ type: "accordion", accordionItems: [{ title: "...", content: "<p>HTML</p>" }] }

// ── multipleChoice ──
{ type: "multipleChoice", question: "...",
  options: [{ text: "A...", isCorrect: false }, { text: "B...", isCorrect: true },
            { text: "C...", isCorrect: false }, { text: "D...", isCorrect: false }],
  correctAnswer: 1, explanation: "..." }

// ── multiSelect ──
{ type: "multiSelect", question: "... (Select all that apply)",
  options: [{ text: "...", isCorrect: true }, { text: "...", isCorrect: false },
            { text: "...", isCorrect: true }, { text: "...", isCorrect: false }],
  explanation: "..." }

// ── matching ──
{ type: "matching", matchingInstructions: "Match each ... to its ...",
  matchingPairs: [{ term: "...", definition: "..." }, ...] }

// ── fillInBlank ──
{ type: "fillInBlank", title: "...",
  blanks: [{ prompt: "...", answer: "...", acceptAlternates: ["..."] }] }

// ── flashcardDeck ──
{ type: "flashcardDeck", title: "...",
  cards: [{ front: "...", back: "..." }],  // 6-10 cards
  accessibility: { ariaLabel: "...", role: "application" } }

// ── scenarioTree ──
{ type: "scenarioTree", title: "...", description: "Clinical vignette...",
  nodes: [
    { id: "start", text: "Scenario prompt...",
      choices: [{ text: "Option A", nextId: "a1" }, { text: "Option B", nextId: "b1" }] },
    { id: "a1", text: "Feedback for A...", choices: [{ text: "Continue", nextId: "end1" }] },
    { id: "b1", text: "Feedback for B...", choices: [{ text: "Continue", nextId: "end1" }] },
    { id: "end1", text: "Conclusion...", isEnd: true }
  ],
  accessibility: { ariaLabel: "...", role: "application" } }

// ── cardSort ──
{ type: "cardSort", instructions: "Sort each item into...",
  categories: ["Category A", "Category B", "Category C"],
  items: [{ text: "...", category: "Category A" }, ...],  // 8-12 items
  accessibility: { ariaLabel: "...", role: "application" } }

// ── sequencing ──
{ type: "sequencing", instructions: "Arrange in correct order...",
  steps: [{ text: "First step", order: 1 }, { text: "Second step", order: 2 }, ...],
  explanation: "The correct sequence is..." }

// ── videoEmbed ──
{ type: "videoEmbed", title: "...",
  videoUrl: "https://www.youtube.com/embed/PLACEHOLDER_[KEYWORD]",
  // TODO: Replace with verified YouTube URL for [topic]
  description: "...",
  accessibility: { ariaLabel: "Video: ...", role: "complementary" } }

// ── resources ──
{ type: "resources", title: "Professional Resources",
  resources: [
    { name: "Organization Name", description: "What it offers", url: "https://real-url.org" }
  ],  // 6-10 entries with REAL URLs (APA, ACA, SAMHSA, NIMH, NBCC, etc.)
  accessibility: { ariaLabel: "...", role: "complementary" } }

// ── reflection ──
{ type: "reflection", prompt: "Specific clinical reflection question..." }

// ── callout ──
{ type: "callout", title: "...",
  calloutType: "info" | "warning" | "ethics" | "clinical" | "tip" | "key" | "donot" | "protocol",
  content: "<p>HTML body</p>",
  calloutItems: ["bullet 1", "bullet 2"] }

// ── keyTakeaway ──
{ type: "keyTakeaway", title: "Key Takeaways",
  takeaways: ["Point 1", "Point 2", "Point 3", "Point 4"] }
```

---

## Step 5 — Self-validation (built into every seed file)

Every seed file includes this validation. If CRITICAL checks fail, the script refuses to save.

```js
function stripHTML(html) { return (html||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim(); }

function countWords(course) {
  let total = 0;
  for (const sec of course.sections || []) {
    for (const b of sec.contentBlocks || []) {
      if (b.content) total += stripHTML(b.content).split(/\s+/).filter(Boolean).length;
      if (b.question) total += stripHTML(b.question).split(/\s+/).filter(Boolean).length;
      if (b.explanation) total += stripHTML(b.explanation).split(/\s+/).filter(Boolean).length;
      if (b.accordionItems) b.accordionItems.forEach(a => {
        total += stripHTML(a.title).split(/\s+/).filter(Boolean).length;
        total += stripHTML(a.content).split(/\s+/).filter(Boolean).length;
      });
      if (b.options) b.options.forEach(o => {
        total += stripHTML(typeof o === 'string' ? o : o.text || '').split(/\s+/).filter(Boolean).length;
      });
      if (b.cards || b.flashcards) (b.cards || b.flashcards || []).forEach(c => {
        total += stripHTML(c.front).split(/\s+/).filter(Boolean).length;
        total += stripHTML(c.back).split(/\s+/).filter(Boolean).length;
      });
      if (b.nodes) b.nodes.forEach(n => {
        total += stripHTML(n.text).split(/\s+/).filter(Boolean).length;
        if (n.choices) n.choices.forEach(ch => total += stripHTML(ch.text).split(/\s+/).filter(Boolean).length);
      });
      if (b.matchingPairs) b.matchingPairs.forEach(p => {
        total += stripHTML(p.term).split(/\s+/).filter(Boolean).length;
        total += stripHTML(p.definition).split(/\s+/).filter(Boolean).length;
      });
      if (b.steps) b.steps.forEach(s => total += stripHTML(s.text).split(/\s+/).filter(Boolean).length);
      if (b.takeaways) b.takeaways.forEach(t => total += stripHTML(t).split(/\s+/).filter(Boolean).length);
      if (b.blanks) b.blanks.forEach(bl => {
        total += stripHTML(bl.prompt).split(/\s+/).filter(Boolean).length;
        total += stripHTML(bl.answer).split(/\s+/).filter(Boolean).length;
      });
      if (b.resources) b.resources.forEach(r => {
        total += stripHTML(r.name || '').split(/\s+/).filter(Boolean).length;
        total += stripHTML(r.description || '').split(/\s+/).filter(Boolean).length;
      });
    }
  }
  return total;
}

function validate(course) {
  const errors = [];
  const warnings = [];
  const wc = countWords(course);
  const required = course.ceHours * 6000;

  // CRITICAL checks
  if (wc < required) errors.push(`Word count ${wc} < required ${required}`);
  if (!course.assessment?.questions?.length || course.assessment.questions.length < 15)
    errors.push(`Assessment: ${course.assessment?.questions?.length || 0} questions (need 15+)`);
  if (!course.references?.length || course.references.length < 15)
    errors.push(`References: ${course.references?.length || 0} (need 15+)`);

  // Per-section checks
  const KC_TYPES = ['multipleChoice', 'multiSelect', 'matching', 'fillInBlank'];
  const ACT_TYPES = ['flashcardDeck', 'scenarioTree', 'cardSort', 'sequencing'];
  const allKC = new Set();
  const allAct = new Set();
  let videoCount = 0, imageTextCount = 0, resourcesCount = 0;

  for (const [i, sec] of (course.sections || []).entries()) {
    const blocks = sec.contentBlocks || [];
    const types = blocks.map(b => b.type);

    if (!types.includes('sectionDivider')) errors.push(`Section ${i+1}: missing sectionDivider`);

    const kcTypes = types.filter(t => KC_TYPES.includes(t));
    if (kcTypes.length < 2) warnings.push(`Section ${i+1}: ${kcTypes.length} KC blocks (want 2-3)`);
    kcTypes.forEach(t => allKC.add(t));

    const actTypes = types.filter(t => ACT_TYPES.includes(t));
    if (i > 0 && i < course.sections.length - 1 && actTypes.length < 1)
      warnings.push(`Section ${i+1}: no interactive activity`);
    actTypes.forEach(t => allAct.add(t));

    if (!types.includes('reflection')) warnings.push(`Section ${i+1}: no reflection`);
    if (!types.includes('keyTakeaway')) warnings.push(`Section ${i+1}: no keyTakeaway`);

    videoCount += types.filter(t => t === 'videoEmbed' || t === 'video').length;
    imageTextCount += types.filter(t => t === 'imageText').length;
    resourcesCount += types.filter(t => t === 'resources').length;

    // Wrong type detection
    const WRONG = ['multiple_choice', 'quiz', 'knowledgeCheck', 'text_block'];
    const wrong = types.filter(t => WRONG.includes(t));
    if (wrong.length) errors.push(`Section ${i+1}: wrong type names: ${wrong.join(', ')}`);

    // Flat string options detection
    for (const b of blocks) {
      if (b.options?.length && typeof b.options[0] === 'string')
        errors.push(`Section ${i+1}: flat string options in ${b.type} (need [{text,isCorrect}])`);
    }
  }

  if (allKC.size < 3) warnings.push(`Course uses only ${allKC.size} KC types (want 3+): ${[...allKC].join(', ')}`);
  if (allAct.size < 2) warnings.push(`Course uses only ${allAct.size} activity types (want 2+): ${[...allAct].join(', ')}`);
  if (videoCount < 2) warnings.push(`Only ${videoCount} videoEmbed blocks (want 2+)`);
  if (imageTextCount < 2) warnings.push(`Only ${imageTextCount} imageText blocks (want 2+)`);
  if (resourcesCount < 1) warnings.push(`No resources block found (want 1+)`);

  // Assessment answer distribution
  if (course.assessment?.questions?.length) {
    const dist = [0, 0, 0, 0];
    for (const q of course.assessment.questions) {
      const ca = q.correctAnswer ?? -1;
      if (ca >= 0 && ca < 4) dist[ca]++;
    }
    const total = course.assessment.questions.length;
    const maxPct = Math.max(...dist) / total;
    if (maxPct > 0.4) warnings.push(`Assessment answer distribution skewed: ${dist.join('/')} (max ${Math.round(maxPct*100)}%)`);
  }

  return { wc, errors, warnings };
}
```

### Seed wrapper template

```js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }

const SLUG = 'course-slug-here';
const COURSE = { /* ... full course object ... */ };

// ... paste stripHTML, countWords, validate functions above ...

async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;
  const col = db.collection('interactivecourses');

  const { wc, errors, warnings } = validate(COURSE);
  COURSE.wordCount = wc;

  console.log(`\n📊 ${COURSE.courseCode}: ${COURSE.title}`);
  console.log(`   Words: ${wc} / ${COURSE.ceHours * 6000} required`);
  console.log(`   Sections: ${COURSE.sections.length} | Assessment: ${COURSE.assessment?.questions?.length} | References: ${COURSE.references?.length}`);

  if (errors.length) {
    console.error('\n❌ CRITICAL — refusing to save:');
    errors.forEach(e => console.error('   ' + e));
    await mongoose.disconnect();
    process.exit(1);
  }
  if (warnings.length) {
    console.warn('\n⚠️  Warnings:');
    warnings.forEach(w => console.warn('   ' + w));
  }

  const existing = await col.findOne({ slug: SLUG });
  if (existing) {
    await col.updateOne({ slug: SLUG }, { $set: { ...COURSE, updatedAt: new Date() } });
    console.log('\n✅ Updated existing course');
  } else {
    await col.insertOne({ ...COURSE, createdAt: new Date(), updatedAt: new Date() });
    console.log('\n✅ Inserted new course');
  }
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(e => { console.error(e.message); process.exit(1); });
```

---

## Assessment format

```js
assessment: {
  title: "Final Assessment — [CODE]: [Short Title]",
  passingScore: 80,
  maxAttempts: 3,
  shuffleQuestions: true,
  questions: [
    {
      question: "...",
      type: "multipleChoice",
      options: [
        { text: "...", isCorrect: false },
        { text: "...", isCorrect: true },
        { text: "...", isCorrect: false },
        { text: "...", isCorrect: false }
      ],
      correctAnswer: 1,
      explanation: "..."
    },
    // Include 2-3 multiSelect questions in the exam
    {
      question: "... (Select all that apply)",
      type: "multiSelect",
      options: [
        { text: "...", isCorrect: true },
        { text: "...", isCorrect: false },
        { text: "...", isCorrect: true },
        { text: "...", isCorrect: false }
      ],
      explanation: "..."
    }
    // 15-20 total, answer distribution: no single correctAnswer index > 40%
  ]
}
```

---

## References format

```js
references: [
  { title: "Author, A. A. (Year). Title. Journal, Vol(Issue), pp-pp.", url: "https://doi.org/..." },
  // 15-20 entries, APA 7th edition, real DOIs/URLs when possible
  // Include: seminal works, recent research (2020+), clinical guidelines, APA/ACA standards
]
```

---

## CRITICAL RULES — violation = broken course

1. **Options shape:** ALWAYS `[{text: String, isCorrect: Boolean}]` — NEVER flat `["string"]`
2. **Type names:** camelCase exactly: `multipleChoice`, `multiSelect`, `flashcardDeck`, `cardSort`, `scenarioTree`, `videoEmbed`, `imageText`, `sectionDivider`, `keyTakeaway`, `fillInBlank`
3. **NEVER use:** `multiple_choice`, `quiz`, `knowledgeCheck` (as wrapper type), `text_block`
4. **Navy hex:** `#284157` — NEVER `#34495E`
5. **No ACEP metadata in content blocks** — no "GAITP LLC", "Provider #7760", "Learn. License. Lead." inside course prose
6. **No `via.placeholder.com`** — dead service. Use empty string for images with TODO comment
7. **ES module syntax** — `import`, not `require`
8. **`process.env.MONGODB_URI`** — no hardcoded connection strings
9. **Ship as draft** — `isPublished: false`, `status: "draft"`
10. **All content as string literals** — no `fs.readFileSync()`, no API calls at runtime
11. **Prose is never fabricated** — activities are derived from the prose content, not invented
12. **scenarioTree only for real clinical decisions** — don't invent branching where none exists

---

## After generating all courses

Print a summary table:

```
═══ BATCH COMPLETE ═══

# | Code        | Title                                    | CE | Words  | Sections | KCs | Activities | Media | Assessment | Status
1 | CR-TIC-301  | Somatic Approaches to Complex Trauma     | 3  | 19,241 | 6        | 14  | 5          | 5     | 18         | ✅ VALID
2 | CR-TIC-302  | Cultural Dimensions of Trauma Response   | 2  | 12,887 | 5        | 11  | 4          | 5     | 16         | ✅ VALID
3 | CR-TIC-303  | Ethical Considerations in Trauma Work    | 2  | 13,102 | 4        | 9   | 4          | 5     | 15         | ✅ VALID

Files created:
  server/src/scripts/seedCR-TIC-301-Somatic_Approaches_Complex_Trauma-19241words.js
  server/src/scripts/seedCR-TIC-302-Cultural_Dimensions_Trauma_Response-12887words.js
  server/src/scripts/seedCR-TIC-303-Ethical_Considerations_Trauma_Work-13102words.js

Next: merge to main → manual Render deploy → run each script
```
