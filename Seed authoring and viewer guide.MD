# CounselorReady — Seed Authoring & Viewer Integration Guide

A practical reference for **Ke and Claude/Claude Code** when building or editing interactive-course seed scripts so they render correctly in the live viewer the first time.

This document is grounded in the actual code, not the spec. When anything here disagrees with `GOLD_STANDARD_SPEC.md` or `COURSE_SCHEMA_SPEC_v2.md`, **the code wins.** The two authorities are:

- **Schema:** `server/src/models/InteractiveCourse.js`
- **Viewer (renderers):** `client/public/interactive-course.html` (the live CReady Viewer — read it, never rewrite it)

---

## 0. The non-negotiables (read first)

1. **Seed into the `interactivecourses` collection.** Not `courses` (legacy). Run on the Render shell from `~/project/src/server` with `node src/scripts/<file>.js`.
2. **Use `sections[]`, never `modules[]`.** The schema has no `modules` field — the raw driver won't error, but the viewer renders `sections[]` and a `modules[]` array is dead weight. Every course that ever shipped with `modules[]` had its content invisible.
3. **Every content block's `type` must be one the viewer renders** (table in §2). Any other type renders an ugly *"Unsupported block type"* card inline. Notably, **`references` is NOT a block type** — references go in `course.references[]` (§4).
4. **Options are always `[{text, isCorrect}]`** — never flat `[String]`. Flat strings cause Mongoose char-explosion and break the option UI.
5. **Ship as a draft.** `isPublished: false`, `status: "draft"`. Flip to published in admin after reviewing in the viewer.
6. **Prose is never rewritten.** Activities are *derived from* existing prose. Never invent clinical claims to pad word count or fake engagement.
7. **Colors:** Navy `#284157` (NEVER `#34495E`). No `via.placeholder.com` image URLs (the service is dead — omit the image or use a real Cloudinary asset).

---

## 1. Section shape

```js
{
  title: "Core Skill Module: Mindfulness",   // required
  order: 4,                                   // required (1-based, sequential)
  description: "...",                         // optional
  contentBlocks: [ /* see §2 */ ]
}
```

Every section's **first block** is a `sectionDivider` with both `title` and `subtitle`.

---

## 2. Supported content-block types & exact field shapes

These are the types the viewer's `renderBlock` dispatch handles. Shapes below are verified against the renderers.

### Structure & prose

| Type | Required fields | Notes |
|---|---|---|
| `sectionDivider` | `title`, `subtitle` | optional `sectionNumber`, `bannerImage`, `bannerAlt` |
| `text` | `content` (HTML) | supports inline callout syntax (§5); optional `callouts` dict |
| `imageText` | `content` (HTML) | `image` is **optional** — omit it and it renders text-only (no broken slot). `imageAlt`, `imagePosition: "left"\|"right"`, `highlight` |
| `image` | `imageUrl` | `imageAltText`, `imageCaption` |
| `accordion` | `accordionItems: [{title, content}]` | `content` is HTML |

### Questions / knowledge checks

| Type | Required fields | Notes |
|---|---|---|
| `multipleChoice` | `question`, `options: [{text, isCorrect}]`, `explanation` | optional `correctAnswer` (index). Use the object option shape. |
| `multiSelect` | `question`, `options: [{text, isCorrect}]`, `explanation` | multiple correct allowed |
| `matching` | `matchingInstructions`, `matchingPairs: [{term, definition}]` | |

### Interactive activities

| Type | Required fields | Notes |
|---|---|---|
| `flashcardDeck` | `flashcards: [{front, back}]` | optional `instructions`; `id` per card optional |
| `cardSort` | `categories: [String]`, `cards: [{id, text, correctCategory}]` | `correctCategory` must match a `categories` string exactly; optional `instructions`, `explanation` |
| `reflection` | `question` | optional `minLength` (default 50 words) |

### Callouts & emphasis

| Type | Required fields | Notes |
|---|---|---|
| `callout` | `calloutType` + (`content` and/or `items`) | `calloutType` ∈ `info, warning, ethics, clinical, tip, key, donot, protocol`. `content` is **raw HTML** (not escaped); `items`/`calloutItems` is a string list (escaped). Optional `title`. |
| `keyTakeaway` | `content` (HTML) and/or `takeaways: [String]` | optional `title` (defaults to "Key Takeaways") |

### Resources (special — see §4)

| Type | Required fields | Notes |
|---|---|---|
| `resources` / `deliverables` | `resources: [{title, url, type, description?}]` | renders inline **and** feeds the Resources drawer. Prefer `course.resources[]` for drawer-only. `type` drives the icon (pdf, video, link, website, book, worksheet, document). |

### Also supported (verify the renderer before authoring)

`scenarioTree`, `sequencing`, `timeline`, `hotspot`, `fillInBlank`, `video`, `videoEmbed`, `knowledgeCheck`, `quiz`. These render, but their field shapes vary — open the matching `renderX` function in the viewer and match it before using. **Do not author `scenarioTree` branching unless real decision content exists** — inventing branches is fabrication.

> **Anything not in these lists → "Unsupported block type" card.** When in doubt, grep `interactive-course.html` for `case '<type>'`.

---

## 3. Course-level shape

```js
const COURSE = {
  title, slug, courseCode,
  subtitle, description,
  ceHours: 6, ceuHours: 6, ceuEligible: true, credits: 6,
  ceCategory, category, contentArea, level,
  deliveryMethod: "Asynchronous Online",
  approvingBody: "NBCC", approvalNumber: "7760", acepNumber: "7760",
  instructor: "GA Integrated Therapeutic Perspectives LLC",
  accessType: "subscription",
  status: "draft", isPublished: false,
  maxAttempts: 3,                 // top-level, NOT inside assessment
  objectives: [ ... ],
  targetAudience: [ ... ],
  sections: [ ... ],              // §1–§2
  assessment: { ... },            // §6
  references: [ ... ],            // §4 — feeds the References drawer
  resources: [ ... ],             // §4 — feeds the Resources drawer
};
```

---

## 4. References & Resources = floating drawers, not blocks

The viewer builds two floating edge tabs ("References" / "Resources"). A tab only appears if its array is non-empty.

- **References drawer** reads `course.references[]`. Each entry may be:
  - a plain string (an APA citation), **or**
  - `{ formatted: "..." }` / `{ citation: "..." }`, **or**
  - `{ author, year, title, source }`.
  - **Do NOT create a `references` content block** — there is no renderer for it.
- **Resources drawer** reads `course.resources[]` first, then falls back to scanning inline `resources` blocks. Each item: `{ title, url, type, description? }`.
  - For drawer-only resources, put them in `course.resources[]` and don't add an inline `resources` block (the inline block also renders in the section flow).

The drawer fetches `/api/interactive-courses/slug/<slug>` with the slug from the URL and the auth token. **On a draft, you must be viewing authenticated** for the drawers to populate.

Validation: a 6 CE course should carry **≥15 references** in `course.references[]`.

---

## 5. Callouts: two ways

1. **Block-level** `callout` / `keyTakeaway` (§2) — a full-width boxed callout.
2. **Inline, inside any `text`/`imageText` `content`:**
   - `{{callout:id}}` → inline pill with tooltip. `id` comes from the global library (e.g. `hipaa`, `phi`) or a per-block dictionary:
     ```js
     { type: "text",
       content: "Always document {{callout:informedConsent}} before the first session.",
       callouts: { informedConsent: { label: "Informed Consent", body: "Client's voluntary agreement after disclosure of risks/benefits.", type: "definition" } } }
     ```
   - `{{alert:type}}` → inline alert badge (e.g. `{{alert:ethics}}`).

Use inline pills/alerts to add density to a 6-hour course without breaking prose flow.

---

## 6. Assessment shape

```js
assessment: {
  passThreshold: 0.8,     // schema field
  passingScore: 80,       // viewer-facing duplicate — include both
  questions: [
    { question: "...",
      options: [ {text:"...", isCorrect:false}, {text:"...", isCorrect:true} ],
      explanation: "..." }
  ]
}
```

- Final exam lives **here**, at the top level — not as a `quiz` block or an `isExam` content block.
- ≥15 questions; object option shape; `maxAttempts: 3` at the course level.

---

## 7. Validation gates (a seed should pass all of these before it runs)

**Blocking:**
- Learner-visible **prose words ≥ ceHours × 6,000** (6 CE = 36,000). Count `content/text/title/subtitle/question/explanation/term/definition/front/back/instructions`. **Exclude** `references[]` and `resources[]` — they don't count toward CE.
- Structure is `sections[]` (no `modules[]`); each section has a `sectionDivider` with `title` + `subtitle`.
- No unsupported block types.
- All `options` use `[{text, isCorrect}]`; every MC/KC has a correct answer marked.
- `assessment.questions` ≥ 15; `passingScore: 80`; `maxAttempts: 3`.
- `course.references[]` ≥ 15.

**Warnings:**
- A section under ~2,500 prose words.
- More than ~5 interactive blocks in a row (bunching) — see §8.
- Answer skew (one option position correct >40% of the time).
- Any `#34495E` or `via.placeholder.com` string.

---

## 8. Engagement design for longer courses

A 6 CE course can't be mostly reading — sustained interactivity is part of what justifies the seat time. Targets:

- **Per skill/concept module:** a `flashcardDeck` + a `cardSort` + a `callout`/`keyTakeaway`.
- **Across the course:** roughly 1 deck and 1 sort per major module, callouts/key-takeaways on the non-skill sections, plus the existing MC/matching/multi-select and 4–6 reflections (not one per section).
- **No bunching:** never 5+ interactive blocks back-to-back. Place new activities **between prose blocks**, not stacked onto the existing end-of-section question cluster.

**Derive, don't fabricate.** Good sources of derived activities:
- Acronym-structured content → flashcards (front = acronym/term, back = its meaning from the text).
- Taxonomies/categories already in the prose → `cardSort`.
- Key definitions / decision rules → `callout` or `keyTakeaway`.
If the prose doesn't contain it, don't add it.

---

## 9. Seed wrapper template

```js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }

const SLUG = '<course-slug>';
const COURSE = { /* §3 */ };

async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;
  const existing = await db.collection('interactivecourses').findOne({ slug: SLUG });
  if (existing) {
    // $set preserves _id (keeps enrollments/progress linked) but does NOT remove
    // stale fields — if migrating off modules[], $unset it (see §10).
    await db.collection('interactivecourses').updateOne(
      { slug: SLUG }, { $set: { ...COURSE, updatedAt: new Date() } });
  } else {
    await db.collection('interactivecourses').insertOne(
      { ...COURSE, createdAt: new Date(), updatedAt: new Date() });
  }
  const saved = await db.collection('interactivecourses').findOne({ slug: SLUG });
  const blocks = (saved.sections||[]).reduce((s,x)=>s+(x.contentBlocks?.length||0),0);
  console.log('Sections:', saved.sections?.length, '| Blocks:', blocks,
    '| Assessment:', saved.assessment?.questions?.length,
    '| References:', saved.references?.length, '| isPublished:', saved.isPublished);
  await mongoose.disconnect();
}
main().catch(e => { console.error(e.message); process.exit(1); });
```

Filename convention: `seed<Code>-<Title>-<WordCount>words.js`.

---

## 10. Pre-flight verification without a live DB

Before pushing/running, validate the assembled document by stubbing `mongoose` to capture the write payload, then measuring it. This catches word-count, unsupported-block, options-shape, and bunching problems offline:

1. Create a fake `mongoose` module whose `db.collection().updateOne/insertOne` writes the passed document to a JSON file.
2. Run the seed against the stub.
3. Walk the captured doc and assert every gate in §7.

(Reusable in `server/src/scripts/` as a `validateSeed`-style helper.)

If a course already shipped with `modules[]`, clear it after migrating:
```
node --input-type=module -e "import m from 'mongoose'; await m.connect(process.env.MONGODB_URI); await m.connection.db.collection('interactivecourses').updateOne({slug:'<slug>'},{\$unset:{modules:''}}); process.exit()"
```

---

## 11. Process discipline

- **Verify against the code, not memory or the spec.** The Gold Standard / Schema Spec docs have known errors; `InteractiveCourse.js` and `interactive-course.html` are authoritative.
- **Clone and read before editing.** Grep for every reference before removing anything.
- **Respect CLAUDE.md.** Locked files (`courseRoutes.js`, `interactiveCourseRoutes.js`, `interactive-course.html`, `CourseViewer.jsx`, the models, etc.) are never touched without an explicit task that names them — even if they appear dead.
- **Branch policy:** feature branch + PR by default; direct-to-main only when all five exception conditions hold.
- **Claude Code lies about completion** — verify with raw `grep`/`wc`/`cat`, not CC summaries.
