# CounselorReady — CC Batch Course Generation Prompts

**Purpose:** Copy-paste prompts for Claude Code to generate deployment-ready seed scripts with rich interactive content — not text-heavy walls.

**Problem these solve:** Every existing seed script except TMH601/602 is 90%+ `text` + `multipleChoice`. Courses need videos, images, supplemental resources, varied KC types (matching, cardSort, scenarioTree, flashcardDeck, sequencing, fillInBlank, multiSelect), callouts, keyTakeaways, and reflections.

---

## Prompt 1 — Single Rich Course Seed

> **When to use:** Generating one course at a time with full block variety.

```
Read these files before writing anything:
- server/src/models/InteractiveCourse.js (schema — authoritative)
- client/public/interactive-course.html (viewer — grep for renderBlock switch)
- SEED_AUTHORING_AND_VIEWER_GUIDE.md (if present)
- GOLD_STANDARD_SPEC.md (if present)

Generate a COMPLETE, deployment-ready seed script for:

Title: [TITLE]
Course Code: [CODE]
CE Hours: [X]
Category: [ethics | clinical | multicultural | supervision | professional_development]
Topic: [TOPIC DESCRIPTION — 2-3 sentences of what the course covers]

═══ BLOCK VARIETY REQUIREMENTS (non-negotiable) ═══

Every content section (not intro/conclusion) MUST contain ALL of these:
1. sectionDivider (with title AND subtitle)
2. 2-4 text blocks (HTML prose, 500-800 words each)
3. 1 accordion (3-5 items with clinical depth)
4. 1 callout (rotate types: ethics, clinical, warning, tip, protocol, donot)
5. 2-3 knowledge checks using DIFFERENT types per section — rotate through:
   - multipleChoice (options: [{text, isCorrect}], correctAnswer: index)
   - multiSelect (options: [{text, isCorrect}] — multiple isCorrect:true)
   - matching (matchingInstructions, matchingPairs: [{term, definition}])
   - fillInBlank (blanks: [{prompt, answer, acceptAlternates:[]}])
6. 1 interactive activity — rotate through sections:
   - flashcardDeck (cards: [{front, back}] — 6-10 cards)
   - scenarioTree (nodes: [{id, text, choices:[{text, nextId}]}] — real clinical decisions, 4-6 nodes with isEnd:true on terminal nodes)
   - cardSort (categories:[], items:[{text, category}] — 8-12 items)
   - sequencing (steps:[{text, order}], instructions, explanation — 5-8 steps)
7. 1 reflection (prompt: clinically specific question)
8. 1 keyTakeaway (title, takeaways:["item1","item2"...] — 3-5 items)

MEDIA REQUIREMENTS (per course, not per section):
- At least 2 videoEmbed blocks across the course:
  { type: "videoEmbed", title: "...", videoUrl: "https://www.youtube.com/embed/VIDEO_ID",
    description: "...", accessibility: { ariaLabel: "Video: ...", role: "complementary" } }
  Use REAL YouTube embed URLs relevant to the topic. Search YouTube for:
  "[topic] counseling" OR "[topic] mental health professional" OR "[topic] clinical training"
  Prefer: APA, SAMHSA, NIMH, university lectures, professional conference recordings.
  If you cannot find a real URL, use a PLACEHOLDER format:
  "https://www.youtube.com/embed/PLACEHOLDER_[TOPIC_KEYWORD]"
  and add a comment: // TODO: Replace with verified YouTube URL

- At least 2 imageText blocks across the course:
  { type: "imageText", content: "<p>HTML prose...</p>",
    image: "https://res.cloudinary.com/dzfscjhdx/image/upload/v1/counselorready/[descriptive-name]",
    imageAlt: "...", imagePosition: "left" or "right", highlight: true/false }
  For images: use descriptive Cloudinary paths. If the image doesn't exist yet, use:
  image: "" (empty string — renders text-only, no broken image)
  and add comment: // TODO: Upload to Cloudinary and add URL

- 1 resources block in the final content section (before conclusion):
  { type: "resources", title: "Professional Resources",
    resources: [
      { name: "...", description: "...", url: "https://..." },
      ...
    ],
    accessibility: { ariaLabel: "...", role: "complementary" } }
  Include 6-10 REAL URLs: professional orgs, gov sites, research databases.
  Good sources: APA, ACA, SAMHSA, NIMH, NBCC, state licensing boards,
  peer-reviewed journal landing pages, NICE guidelines, WHO resources.

═══ COURSE-LEVEL STRUCTURE ═══

const COURSE = {
  title, slug (kebab-case from title), courseCode: "[CODE]",
  description: "...", // 2-3 sentences
  ceHours: [X], ceuHours: [X],
  category: "[category]",
  difficulty: "intermediate",
  targetAudience: "Licensed mental health professionals (LPCs, LCSWs, LMFTs, NCCs)",
  learningObjectives: ["...", "...", "...", "..."], // 4-6 objectives starting with action verbs
  presenter: {
    name: "Kejuiana Johnson",
    credentials: "MA, LPC, NCC, CPCS, BC-TMH",
    licenseNumber: "LPC009587", licenseState: "Georgia", licenseType: "LPC"
  },
  provider: {
    name: "GA Integrated Therapeutic Perspectives LLC",
    shortName: "GAITP LLC", acepNumber: "7760", approvalBody: "NBCC"
  },
  approvals: [{ body: "NBCC", number: "#7760",
    hourBreakdown: [{ label: "core", hours: [X] }] }],
  isPublished: false, status: "draft",
  sections: [...],           // content sections
  assessment: { ... },       // final exam
  references: [{ ... }],     // APA 7th edition
  wordCount: COMPUTED         // stripped HTML word count
};

═══ ASSESSMENT ═══

assessment: {
  title: "Final Assessment — [CODE]: [SHORT TITLE]",
  passingScore: 80, maxAttempts: 3, shuffleQuestions: true,
  questions: [
    { question: "...", type: "multipleChoice",
      options: [{text:"A",isCorrect:false},{text:"B",isCorrect:true},
               {text:"C",isCorrect:false},{text:"D",isCorrect:false}],
      correctAnswer: 1, explanation: "..." },
    // 15-20 questions, answer distribution: no single index > 40%
    // Include 2-3 multiSelect questions in the exam too
  ]
}

═══ REFERENCES ═══

references: [
  { title: "Author, A. A. (Year). Article title. Journal, Vol(Issue), pp-pp.",
    url: "https://doi.org/..." },
  // 15-20 APA 7th edition references, real DOIs/URLs when possible
]

═══ SEED WRAPPER ═══

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }

const SLUG = '[slug]';

// ... COURSE definition with all sections ...

// ═══ SELF-VALIDATION ═══
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
        const t = typeof o === 'string' ? o : o.text || '';
        total += stripHTML(t).split(/\s+/).filter(Boolean).length;
      });
      if (b.cards || b.flashcards) (b.cards || b.flashcards || []).forEach(c => {
        total += stripHTML(c.front).split(/\s+/).filter(Boolean).length;
        total += stripHTML(c.back).split(/\s+/).filter(Boolean).length;
      });
      // scenarioTree nodes
      if (b.nodes) b.nodes.forEach(n => {
        total += stripHTML(n.text).split(/\s+/).filter(Boolean).length;
        if (n.choices) n.choices.forEach(ch => total += stripHTML(ch.text).split(/\s+/).filter(Boolean).length);
      });
    }
  }
  return total;
}

function validate(course) {
  const errors = [];
  const wc = countWords(course);
  const required = course.ceHours * 6000;
  if (wc < required) errors.push(`CRITICAL: Word count ${wc} < required ${required}`);

  for (const [i, sec] of (course.sections||[]).entries()) {
    const blocks = sec.contentBlocks || [];
    const types = blocks.map(b => b.type);
    if (!types.includes('sectionDivider')) errors.push(`Section ${i+1}: missing sectionDivider`);
    const kcTypes = types.filter(t => ['multipleChoice','multiSelect','matching','fillInBlank'].includes(t));
    if (kcTypes.length < 2) errors.push(`Section ${i+1}: only ${kcTypes.length} KC blocks (need 2-3)`);
    const actTypes = types.filter(t => ['flashcardDeck','scenarioTree','cardSort','sequencing'].includes(t));
    if (i > 0 && i < (course.sections.length - 1) && actTypes.length < 1)
      errors.push(`Section ${i+1}: missing interactive activity`);
  }

  if (!course.assessment?.questions?.length || course.assessment.questions.length < 15)
    errors.push(`CRITICAL: Assessment has ${course.assessment?.questions?.length || 0} questions (need 15+)`);
  if (!course.references?.length || course.references.length < 15)
    errors.push(`CRITICAL: Only ${course.references?.length || 0} references (need 15+)`);

  return { wc, errors };
}

async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;
  const col = db.collection('interactivecourses');

  const { wc, errors } = validate(COURSE);
  console.log(`Word count: ${wc} / ${COURSE.ceHours * 6000} required`);
  console.log(`Sections: ${COURSE.sections.length}`);
  console.log(`Assessment: ${COURSE.assessment?.questions?.length || 0} questions`);
  console.log(`References: ${COURSE.references?.length || 0}`);

  if (errors.filter(e => e.startsWith('CRITICAL')).length > 0) {
    console.error('\\n❌ CRITICAL ERRORS — refusing to save:');
    errors.forEach(e => console.error('  ' + e));
    await mongoose.disconnect();
    process.exit(1);
  }
  if (errors.length) {
    console.warn('\\n⚠️  Warnings:');
    errors.forEach(e => console.warn('  ' + e));
  }

  COURSE.wordCount = wc;
  const existing = await col.findOne({ slug: SLUG });
  if (existing) {
    await col.updateOne({ slug: SLUG }, { $set: { ...COURSE, updatedAt: new Date() } });
    console.log('\\n✅ Updated existing course');
  } else {
    await col.insertOne({ ...COURSE, createdAt: new Date(), updatedAt: new Date() });
    console.log('\\n✅ Inserted new course');
  }
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(e => { console.error(e.message); process.exit(1); });

═══ FILENAME ═══
seed[CODE]-[Title_Words]-[wordcount]words.js

═══ CRITICAL RULES ═══
1. Options are ALWAYS [{text, isCorrect}] — NEVER flat strings
2. Type names are camelCase exactly: multipleChoice, multiSelect, flashcardDeck, cardSort, scenarioTree, videoEmbed, imageText, sectionDivider, keyTakeaway, fillInBlank
3. NEVER: multiple_choice, quiz, knowledgeCheck (wrapper), text_block
4. No ACEP metadata inside content blocks
5. No via.placeholder.com URLs
6. Navy is #284157 — NEVER #34495E
7. All content embedded as string literals — no fs.readFileSync, no API calls
8. ES module syntax (import, not require)
9. Ship as draft (isPublished: false, status: "draft")
10. Script uses process.env.MONGODB_URI — no hardcoded connection strings
```

---

## Prompt 2 — Batch of 3-5 Courses (Sequential)

> **When to use:** Generating a themed series or filling catalog gaps. Give CC a list and it writes them one file at a time.

```
Read these files first:
- server/src/models/InteractiveCourse.js
- client/public/interactive-course.html (grep for the renderBlock switch to confirm supported types)
- SEED_AUTHORING_AND_VIEWER_GUIDE.md
- GOLD_STANDARD_SPEC.md

I need seed scripts for the following courses. Generate each as a SEPARATE file.
Follow the block variety requirements below for EVERY course.

═══ COURSE LIST ═══

1. [CODE] | [TITLE] | [X] CE | [category]
2. [CODE] | [TITLE] | [X] CE | [category]
3. [CODE] | [TITLE] | [X] CE | [category]
4. [CODE] | [TITLE] | [X] CE | [category]
5. [CODE] | [TITLE] | [X] CE | [category]

═══ BLOCK VARIETY MATRIX (per section) ═══

Each content section must have:
- 1 sectionDivider (title + subtitle)
- 2-4 text blocks (500-800 words each, HTML)
- 1 accordion (3-5 items)
- 1 callout (rotate: ethics, clinical, warning, tip, protocol, donot)
- 2-3 KC blocks — use DIFFERENT types per section, rotating:
  • multipleChoice: { question, options:[{text,isCorrect}], correctAnswer:N, explanation }
  • multiSelect: { question, options:[{text,isCorrect}], explanation } (2+ correct)
  • matching: { matchingInstructions, matchingPairs:[{term,definition}] }
  • fillInBlank: { title, blanks:[{prompt,answer,acceptAlternates:[]}] }
- 1 interactive activity — rotate across sections:
  • flashcardDeck: { title, cards:[{front,back}] } (6-10 cards)
  • scenarioTree: { title, description, nodes:[{id,text,choices:[{text,nextId}],isEnd?}] }
  • cardSort: { instructions, categories:[], items:[{text,category}] } (8-12 items)
  • sequencing: { instructions, steps:[{text,order:N}], explanation } (5-8 steps)
- 1 reflection (prompt: specific clinical question)
- 1 keyTakeaway (title, takeaways:["...", "..."] 3-5 items)

═══ MEDIA PER COURSE ═══

- 2+ videoEmbed blocks (real YouTube embed URLs for clinical/CE content, or PLACEHOLDER with TODO)
- 2+ imageText blocks (Cloudinary URL or empty string with TODO comment)
- 1 resources block with 6-10 real professional URLs (APA, ACA, SAMHSA, etc.)

═══ PER-COURSE OUTPUT ═══

For each course, create file: server/src/scripts/seed[CODE]-[Title]-[wordcount]words.js

Include the self-validation function (countWords + validate) in every file.
Set isPublished: false, status: "draft".
Include presenter and provider metadata.
Include 15-20 assessment questions (with 2-3 multiSelect in the exam).
Include 15-20 APA 7th edition references with real DOIs/URLs.

Generate Course 1 first. After I confirm, generate Course 2. Continue until all done.

═══ CRITICAL RULES ═══
- Options: ALWAYS [{text, isCorrect}] objects — NEVER flat strings
- Type names: camelCase exactly (multipleChoice, NOT multiple_choice)
- Never use: quiz, knowledgeCheck (as wrapper), multiple_choice
- Navy: #284157 — NEVER #34495E
- ES module syntax, process.env.MONGODB_URI, process.exit
- All content as string literals — no API calls or file reads
- Section blocks ordered: divider → text → activity → text → KC → reflection → keyTakeaway
- No ACEP metadata inside content blocks
```

---

## Prompt 3 — Enrich Existing Thin Course

> **When to use:** An existing seed script is text-heavy and needs block variety added without rewriting prose.

```
Read this seed script: server/src/scripts/[FILENAME]

This course is text-heavy — it needs interactive block variety added WITHOUT
rewriting or removing existing prose. The prose is authoritative; never shorten it.

For EACH content section, ADD the following blocks interleaved with existing text
(don't stack them at the end):

1. 1 accordion — derived from a taxonomy, list, or multi-point concept already in the text
2. 1 callout — extract a critical clinical point, ethical mandate, or warning from the text
3. 1-2 additional KC blocks beyond what exists. Use types NOT already in the section:
   - If section has multipleChoice → add matching or fillInBlank or multiSelect
   - matching: { matchingInstructions, matchingPairs:[{term,definition}] }
   - fillInBlank: { title, blanks:[{prompt,answer,acceptAlternates:[]}] }
   - multiSelect: { question, options:[{text,isCorrect}], explanation }
4. 1 interactive activity derived from the prose:
   - Categories in the text → cardSort
   - Clinical terminology → flashcardDeck
   - Decision points → scenarioTree (only if real clinical decisions exist)
   - Ordered processes/protocols → sequencing
5. 1 keyTakeaway (takeaways:["...", "..."] — summarize the section's key points)
6. 1 reflection (clinically specific prompt)

ALSO add across the whole course:
- 2 videoEmbed blocks (real YouTube URLs or PLACEHOLDER with TODO)
- 2 imageText blocks (empty image string + TODO, with meaningful prose)
- 1 resources block in the last content section

Fix any wrong type names:
- multiple_choice → multipleChoice
- quiz → move questions into course.assessment
- knowledgeCheck (wrapper) → expand into individual multipleChoice blocks
- Flat string options → [{text, isCorrect}] objects

Show me the enrichment plan section-by-section before writing the updated file.
Run the self-validation checks at the end.
```

---

## Prompt 4 — Batch Enrichment (Fix All Thin Courses)

> **When to use:** Auditing and enriching all courses in the DB that lack block variety.

```
Read server/src/models/InteractiveCourse.js first.

Write a diagnostic script (server/src/scripts/auditBlockVariety.js) that:

1. Connects to MongoDB via process.env.MONGODB_URI
2. Reads every document in interactivecourses
3. For each course, counts block types per section:
   - text, accordion, callout, keyTakeaway, reflection
   - KC types: multipleChoice, multiSelect, matching, fillInBlank
   - Activities: flashcardDeck, scenarioTree, cardSort, sequencing
   - Media: videoEmbed, video, imageText, image, resources
4. Flags courses as:
   - 🔴 THIN: any section with 0 interactive activities AND 0 varied KC types (only multipleChoice)
   - 🟡 PARTIAL: has some variety but missing media (no videoEmbed, no resources)
   - 🟢 RICH: meets all variety requirements
5. Also flags wrong type names: multiple_choice, quiz, knowledgeCheck
6. Outputs a table:

   Course Code | Status | Sections | text% | KC variety | Activities | Media | Wrong Types
   CR-ETH301   | 🔴 THIN | 6       | 92%   | MC only    | 0          | 0     | —
   CR-TMH601   | 🟢 RICH | 13      | 45%   | 5 types    | 8          | 4     | —

7. At the end, prints the list of 🔴 THIN courses that need enrichment, sorted by
   fewest block types first (worst → best).

ES module syntax. Read-only (no writes). Run with: node src/scripts/auditBlockVariety.js
```

---

## Block Shape Quick Reference (Verified Against Viewer)

These are the EXACT field shapes the CReady Viewer renders. Using anything else = "Unsupported block type" card.

```js
// ── sectionDivider ──
{ type: "sectionDivider", title: "...", subtitle: "...", sectionNumber: N }

// ── text ──
{ type: "text", content: "<p>HTML prose here</p>" }

// ── imageText ──
{ type: "imageText", content: "<p>HTML prose</p>",
  image: "https://...", imageAlt: "...", imagePosition: "left"|"right", highlight: true|false }

// ── image ──
{ type: "image", imageUrl: "https://...", imageAltText: "...", imageCaption: "...",
  imageSize: "small"|"medium"|"full", imageAlignment: "left"|"center"|"right" }

// ── accordion ──
{ type: "accordion", accordionItems: [{ title: "...", content: "<p>HTML</p>" }] }

// ── multipleChoice ──
{ type: "multipleChoice", question: "...",
  options: [{ text: "...", isCorrect: false }, { text: "...", isCorrect: true }, ...],
  correctAnswer: 1, // 0-based index of correct option
  explanation: "..." }

// ── multiSelect ──
{ type: "multiSelect", question: "... (Select all that apply)",
  options: [{ text: "...", isCorrect: true }, { text: "...", isCorrect: false }, ...],
  explanation: "..." }  // 2+ options have isCorrect:true

// ── matching ──
{ type: "matching", matchingInstructions: "...",
  matchingPairs: [{ term: "...", definition: "..." }, ...] }

// ── fillInBlank ──
{ type: "fillInBlank", title: "...",
  blanks: [{ prompt: "...", answer: "...", acceptAlternates: ["...", "..."] }] }

// ── flashcardDeck ──
{ type: "flashcardDeck", title: "...",
  cards: [{ front: "...", back: "..." }, ...],  // 6-10 cards
  accessibility: { ariaLabel: "...", role: "application" } }

// ── scenarioTree ──
{ type: "scenarioTree", title: "...", description: "...",
  nodes: [
    { id: "start", text: "...", choices: [{ text: "...", nextId: "node2" }, ...] },
    { id: "node2", text: "...", choices: [...] },
    { id: "end1", text: "...", isEnd: true }
  ],
  accessibility: { ariaLabel: "...", role: "application" } }

// ── cardSort ──
{ type: "cardSort", instructions: "...",
  categories: ["Cat A", "Cat B", "Cat C"],
  items: [{ text: "...", category: "Cat A" }, ...],  // 8-12 items
  accessibility: { ariaLabel: "...", role: "application" } }

// ── sequencing ──
{ type: "sequencing", instructions: "...",
  steps: [{ text: "Step description", order: 1 }, { text: "...", order: 2 }, ...],  // 5-8 steps
  explanation: "Correct order explanation" }

// ── timeline ──
{ type: "timeline", title: "...",
  events: [{ year: "1990", text: "<p>HTML description</p>" }, ...] }

// ── hotspot ──  (needs a real image URL)
{ type: "hotspot", instructions: "...",
  hotspotImage: "https://...", imageDescription: "...",
  hotspots: [{ label: "...", x: 25, y: 30, description: "..." }, ...] }

// ── videoEmbed / video ──
{ type: "videoEmbed", title: "...",
  videoUrl: "https://www.youtube.com/embed/VIDEO_ID",
  description: "...",
  accessibility: { ariaLabel: "Video: ...", role: "complementary" } }

// ── resources ──
{ type: "resources", title: "Professional Resources",
  resources: [{ name: "...", description: "...", url: "https://..." }, ...],
  accessibility: { ariaLabel: "...", role: "complementary" } }

// ── reflection ──
{ type: "reflection", prompt: "Clinically specific reflection question..." }

// ── callout ──
{ type: "callout", title: "...", calloutType: "info"|"warning"|"ethics"|"clinical"|"tip"|"key"|"donot"|"protocol",
  content: "<p>HTML body</p>",
  calloutItems: ["bullet 1", "bullet 2"] }  // optional list items

// ── keyTakeaway ──
{ type: "keyTakeaway", title: "Key Takeaways",
  takeaways: ["Point 1", "Point 2", "Point 3"] }

// ── preCommit / preCommitReveal (respond-before-you-read pair) ──
{ type: "preCommit", preCommitId: "shared-key-1", question: "Before reading on, what would YOU say to this client?" }
// ... teaching content in between ...
{ type: "preCommitReveal", preCommitId: "shared-key-1",
  modelResponse: "<p>HTML — the expert's answer, shown beside the learner's own response.</p>" }

// ── transcriptCoding ── (scored like multipleChoice — reuses options/correctAnswer/explanation)
{ type: "transcriptCoding",
  transcript: [
    { speaker: "client", text: "..." },
    { speaker: "counselor", text: "..." }
  ],
  codingQuestion: "Which skill is the counselor using?",
  options: [{ text: "...", isCorrect: false }, { text: "...", isCorrect: true }, ...],
  correctAnswer: 1,
  explanation: "..." }
```

**preCommit authoring rule:** a `preCommit` / `preCommitReveal` pair MUST share the same
`preCommitId`. The `preCommitReveal` must appear in the SAME section as its `preCommit`,
after the teaching content it precedes, and before that section's final knowledge check.
Max 1 preCommit/preCommitReveal pair per section.

**transcriptCoding authoring rule:** transcripts are 2–5 turns of verbatim-plausible
clinical dialogue (`speaker` is `"client"` or `"counselor"`). Exactly one `codingQuestion`
per block. Options ALWAYS use `{text, isCorrect}` — never a flat array of strings.

---

## Section Rhythm Template

Each content section should follow this rhythm (not rigid, but the general flow):

```
sectionDivider
text (intro prose ~500 words)
callout (highlight a critical point from the intro)
text (deeper clinical content ~600 words)
accordion (expand on a framework/taxonomy from the text)
imageText (visual + prose — or text-only if no image yet)
multipleChoice or multiSelect (test comprehension of prose above)
text (case material, research, clinical application ~500 words)
flashcardDeck | cardSort | scenarioTree | sequencing (rotate per section)
matching or fillInBlank (second KC type, different from above)
reflection
keyTakeaway
```

---

## Pre-Built Course Topics for Batch Generation

Ready-to-paste course lists for Prompt 2:

### Batch A — Ethics & Law (10 CE)
```
1. CR-ETH-401 | Dual Relationships and Boundary Crossings in Rural Practice | 3 CE | ethics
2. CR-ETH-402 | Informed Consent in the Digital Age | 2 CE | ethics
3. CR-ETH-403 | Ethical Practice with LGBTQ+ Clients | 3 CE | ethics
4. CR-ETH-404 | Documentation and Record-Keeping for Legal Protection | 2 CE | ethics
```

### Batch B — Clinical Skills (10 CE)
```
1. CR-CLI-501 | Attachment Theory in Adult Psychotherapy | 3 CE | clinical
2. CR-CLI-502 | Somatic Approaches to Trauma Processing | 2 CE | clinical
3. CR-CLI-503 | Working with Grief and Complicated Bereavement | 3 CE | clinical
4. CR-CLI-504 | Motivational Interviewing for Substance Use Disorders | 2 CE | clinical
```

### Batch C — Specialty Populations (8 CE)
```
1. CR-POP-601 | Counseling Military Veterans and First Responders | 3 CE | clinical
2. CR-POP-602 | Adolescent Mental Health in the Social Media Era | 2 CE | clinical
3. CR-POP-603 | Perinatal Mental Health for Non-Specialists | 3 CE | clinical
```

### Batch D — Supervision & Professional Development (6 CE)
```
1. CR-SUP-701 | Clinical Supervision Models and Best Practices | 3 CE | supervision
2. CR-SUP-702 | Developing Your Private Practice Business Plan | 3 CE | professional_development
```

---

## Validation Checklist (Run After Every Seed)

Before committing any seed script, verify:

```bash
# 1. Check for wrong type names
grep -c "multiple_choice\|knowledgeCheck\|quiz" server/src/scripts/seed[NEW].js
# Should return 0

# 2. Check for flat string options
grep -c "options: \[\"" server/src/scripts/seed[NEW].js
# Should return 0

# 3. Count block type variety
grep "type:" server/src/scripts/seed[NEW].js | sed 's/.*type: *"\([^"]*\)".*/\1/' | sort | uniq -c | sort -rn
# Should show 8+ different types

# 4. Check media blocks exist
grep -c "videoEmbed\|imageText\|resources" server/src/scripts/seed[NEW].js
# Should be 5+

# 5. Run the script in dry mode (will validate before saving)
node server/src/scripts/seed[NEW].js
# Should print word count, section count, assessment count, reference count
# Should NOT show CRITICAL errors
```

---

## Course-Level changeLog (Renewal-Cycle Content Revisions)

**Admin rule:** every substantive content revision to a published course MUST append a
`changeLog` entry to that course document:

```js
changeLog: [{
  date: Date,               // when the revision was made
  summary: String,          // one-line, learner-facing — e.g. "FL telehealth rule amended — §3 revised"
  sectionIndexes: [Number]  // affected sections, 0-based, in authored (pre-overview) order
}]
```

This drives the viewer's "Updated since your last completion" banner and section-nav
`Updated` pills for learners retaking the course on a renewal cycle. Do not backfill
`changeLog` for the course's initial publish — only for revisions made AFTER a course
has learners who may have already completed it.

---

*CounselorReady · GAITP LLC · NBCC ACEP #7760 · counselorready.com*
