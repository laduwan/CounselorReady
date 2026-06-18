# CC Task: Batch Course Generation (Autonomous)

**Location:** `docs/BATCH_COURSE_GENERATION.md`
**Queue:** `docs/COURSE_PRODUCTION_QUEUE.md`

---

## Trigger

Any phrasing like "generate courses", "next batch", "run week X", "next 10", "go".

---

## Step 1 — Determine What to Generate

**Option A — Queue mode (default):**
Read `docs/COURSE_PRODUCTION_QUEUE.md`. Find the first week with `[ ]` courses. Generate ALL courses in that week (10 courses). No confirmation needed.

**Option B — Custom request:**
If Ke specifies a topic, CE hours, and count instead of "next batch", generate those. Ask for any of the three that are missing — in one message, not three.

**Option C — "run week N":**
Jump to week N in the queue regardless of earlier weeks' status.

After determining the course list, proceed to Step 2. Do NOT ask for confirmation.

---

## Step 2 — Read Required Files (silent)

```bash
cat server/src/models/InteractiveCourse.js
grep -A2 "case '" client/public/interactive-course.html | head -60
cat docs/SEED_AUTHORING_AND_VIEWER_GUIDE.md 2>/dev/null || true
```

---

## Step 3 — Generate All Seed Scripts (no pausing between courses)

For each course in the batch, create a complete seed script in `server/src/scripts/`.

### File naming
```
seed[CODE]-[Title_Slug]-[wordcount]words.js
```

### Course metadata (same for all courses)
```js
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
  hourBreakdown: [{ label: "core", hours: X }] }],
isPublished: false, status: "draft",
difficulty: "intermediate",
targetAudience: "Licensed mental health professionals (LPCs, LCSWs, LMFTs, NCCs)",
```

### Section count
`ceHours + 1` sections (1 intro + 1 per CE hour)

### Per-section block requirements (MANDATORY)

Every content section gets ALL of:

| Block | Count | Rotation Rule |
|-------|-------|--------------|
| `sectionDivider` | 1 | title + subtitle + sectionNumber |
| `text` | 2-4 | HTML prose, 500-800 words each |
| `accordion` | 1 | 3-5 items derived from prose |
| `callout` | 1 | Rotate type: ethics → clinical → warning → tip → protocol → donot |
| KC blocks | 2-3 | **Different types per section.** Rotate: multipleChoice → multiSelect → matching → fillInBlank |
| Interactive activity | 1 | **Different per section.** Rotate: flashcardDeck → scenarioTree → cardSort → sequencing |
| `reflection` | 1 | Clinically specific prompt |
| `keyTakeaway` | 1 | 3-5 bullet points |

### Media (per course)

| Block | Count | Notes |
|-------|-------|-------|
| `videoEmbed` | 2+ | Real YouTube embed URLs or `PLACEHOLDER_[keyword]` with TODO |
| `imageText` | 2+ | `image: ""` with TODO comment (renders text-only) |
| `resources` | 1 | Final content section. 6-10 real URLs (APA, ACA, SAMHSA, NIMH, etc.) |

### Block shapes reference

```js
{ type: "sectionDivider", title: "...", subtitle: "...", sectionNumber: N }
{ type: "text", content: "<p>HTML</p>" }
{ type: "imageText", content: "<p>HTML</p>", image: "", imageAlt: "...", imagePosition: "left"|"right" }
{ type: "accordion", accordionItems: [{ title: "...", content: "<p>HTML</p>" }] }
{ type: "multipleChoice", question: "...", options: [{ text: "...", isCorrect: false },...], correctAnswer: N, explanation: "..." }
{ type: "multiSelect", question: "...", options: [{ text: "...", isCorrect: true|false },...], explanation: "..." }
{ type: "matching", matchingInstructions: "...", matchingPairs: [{ term: "...", definition: "..." }] }
{ type: "fillInBlank", title: "...", blanks: [{ prompt: "...", answer: "...", acceptAlternates: [] }] }
{ type: "flashcardDeck", title: "...", cards: [{ front: "...", back: "..." }], accessibility: { ariaLabel: "...", role: "application" } }
{ type: "scenarioTree", title: "...", description: "...", nodes: [{ id: "start", text: "...", choices: [{ text: "...", nextId: "..." }] }, { id: "...", text: "...", isEnd: true }], accessibility: { ariaLabel: "...", role: "application" } }
{ type: "cardSort", instructions: "...", categories: [...], items: [{ text: "...", category: "..." }], accessibility: { ariaLabel: "...", role: "application" } }
{ type: "sequencing", instructions: "...", steps: [{ text: "...", order: N }], explanation: "..." }
{ type: "videoEmbed", title: "...", videoUrl: "https://www.youtube.com/embed/...", description: "...", accessibility: { ariaLabel: "...", role: "complementary" } }
{ type: "resources", title: "...", resources: [{ name: "...", description: "...", url: "..." }], accessibility: { ariaLabel: "...", role: "complementary" } }
{ type: "reflection", prompt: "..." }
{ type: "callout", title: "...", calloutType: "ethics"|"clinical"|"warning"|"tip"|"protocol"|"donot", content: "<p>HTML</p>" }
{ type: "keyTakeaway", title: "Key Takeaways", takeaways: ["...", "..."] }
```

### Section rhythm
```
sectionDivider → text → callout → text → accordion → imageText(if slot) →
KC-type-A → text → interactive-activity → KC-type-B → reflection → keyTakeaway
```

### Assessment
```js
assessment: {
  title: "Final Assessment — [CODE]: [SHORT TITLE]",
  passingScore: 80, maxAttempts: 3, shuffleQuestions: true,
  questions: [ /* 15-20 Qs, mix MC + multiSelect, no index >40% */ ]
}
```

### References
```js
references: [ /* 15-20 APA 7th, real DOIs/URLs */ ]
```

### Self-validation + seed wrapper (include in EVERY file)

```js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }
const SLUG = '[slug]';

// ... COURSE definition ...

function stripHTML(h){return(h||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();}
function countWords(c){let t=0;for(const s of c.sections||[])for(const b of s.contentBlocks||[]){
  if(b.content)t+=stripHTML(b.content).split(/\s+/).filter(Boolean).length;
  if(b.question)t+=stripHTML(b.question).split(/\s+/).filter(Boolean).length;
  if(b.explanation)t+=stripHTML(b.explanation).split(/\s+/).filter(Boolean).length;
  if(b.accordionItems)b.accordionItems.forEach(a=>{t+=stripHTML(a.title).split(/\s+/).filter(Boolean).length;t+=stripHTML(a.content).split(/\s+/).filter(Boolean).length;});
  if(b.options)b.options.forEach(o=>t+=stripHTML(typeof o==='string'?o:o.text||'').split(/\s+/).filter(Boolean).length);
  if(b.cards||b.flashcards)(b.cards||b.flashcards||[]).forEach(c=>{t+=stripHTML(c.front).split(/\s+/).filter(Boolean).length;t+=stripHTML(c.back).split(/\s+/).filter(Boolean).length;});
  if(b.nodes)b.nodes.forEach(n=>{t+=stripHTML(n.text).split(/\s+/).filter(Boolean).length;if(n.choices)n.choices.forEach(ch=>t+=stripHTML(ch.text).split(/\s+/).filter(Boolean).length);});
  if(b.matchingPairs)b.matchingPairs.forEach(p=>{t+=stripHTML(p.term).split(/\s+/).filter(Boolean).length;t+=stripHTML(p.definition).split(/\s+/).filter(Boolean).length;});
  if(b.steps)b.steps.forEach(s=>t+=stripHTML(s.text).split(/\s+/).filter(Boolean).length);
  if(b.takeaways)b.takeaways.forEach(tk=>t+=stripHTML(tk).split(/\s+/).filter(Boolean).length);
  if(b.blanks)b.blanks.forEach(bl=>{t+=stripHTML(bl.prompt).split(/\s+/).filter(Boolean).length;t+=stripHTML(bl.answer).split(/\s+/).filter(Boolean).length;});
  if(b.resources)b.resources.forEach(r=>{t+=stripHTML(r.name||'').split(/\s+/).filter(Boolean).length;t+=stripHTML(r.description||'').split(/\s+/).filter(Boolean).length;});
}return t;}

function validate(c){const e=[];const wc=countWords(c);if(wc<c.ceHours*6000)e.push('CRITICAL:words');
for(const[i,s]of(c.sections||[]).entries()){const t=(s.contentBlocks||[]).map(b=>b.type);
if(!t.includes('sectionDivider'))e.push(`S${i+1}:divider`);
if(t.filter(x=>['multipleChoice','multiSelect','matching','fillInBlank'].includes(x)).length<2)e.push(`S${i+1}:KC<2`);
if(t.filter(x=>['flashcardDeck','scenarioTree','cardSort','sequencing'].includes(x)).length<1&&i>0&&i<c.sections.length-1)e.push(`S${i+1}:activity`);
for(const b of s.contentBlocks||[])if(b.options?.length&&typeof b.options[0]==='string')e.push('CRITICAL:flat_options');}
if((c.assessment?.questions?.length||0)<15)e.push('CRITICAL:exam<15');
if((c.references?.length||0)<15)e.push('CRITICAL:refs<15');return{wc,e};}

async function main(){
  await mongoose.connect(MONGODB_URI);const db=mongoose.connection.db;const col=db.collection('interactivecourses');
  const{wc,e}=validate(COURSE);COURSE.wordCount=wc;
  console.log(`${COURSE.courseCode}|${wc}w/${COURSE.ceHours*6000}req|${COURSE.sections.length}sec|${COURSE.assessment?.questions?.length}exam|${COURSE.references?.length}refs`);
  const crit=e.filter(x=>x.startsWith('CRITICAL'));
  if(crit.length){console.error('❌',crit.join('; '));await mongoose.disconnect();process.exit(1);}
  if(e.length)e.forEach(x=>console.warn('⚠️',x));
  const ex=await col.findOne({slug:SLUG});
  if(ex){await col.updateOne({slug:SLUG},{$set:{...COURSE,updatedAt:new Date()}});console.log('✅ Updated');}
  else{await col.insertOne({...COURSE,createdAt:new Date(),updatedAt:new Date()});console.log('✅ Inserted');}
  await mongoose.disconnect();
}
main().catch(e=>{console.error(e);process.exit(1);});
```

---

## Step 4 — Validate Each (automatic, inline)

After writing each seed file, run:
```bash
grep -c "multiple_choice\|knowledgeCheck\|quiz" server/src/scripts/seed[FILE].js  # must be 0
grep -c 'options: \["' server/src/scripts/seed[FILE].js                           # must be 0
grep 'type:' server/src/scripts/seed[FILE].js | sed 's/.*type: *"\([^"]*\)".*/\1/' | sort -u | wc -l  # must be 8+
```
Fix any failures inline. Do NOT pause.

---

## Step 5 — Commit Batch

```bash
git checkout -b batch/week-N-[date]
git add server/src/scripts/seed*.js
git commit -m "feat: week N batch — 10 courses ([total]CE)

[list all 10 codes + titles]

All draft. Rich block variety. Self-validation passed."
```

---

## Step 6 — Update Queue

Edit `docs/COURSE_PRODUCTION_QUEUE.md`: change `[ ]` → `[G]` for all generated courses.

```bash
git add docs/COURSE_PRODUCTION_QUEUE.md
git commit -m "docs: mark week N as generated"
```

---

## Step 7 — Print Summary

```
═══ Week N Complete ═══
#   Code         Title                                              CE  Words   Types  Status
1   CR-XXX-NNN   Title Here                                         2   12840   12     ✅
2   CR-XXX-NNN   Another Title                                      3   19200   11     ✅
...
Branch: batch/week-N-20260618
Next: Ke merges → manual Render deploy → run each seed script on Render shell
```

---

## Hard Rules

1. `[{text, isCorrect}]` — NEVER flat strings
2. Exact camelCase types — never `multiple_choice`, `quiz`, `knowledgeCheck`
3. Navy `#284157` — never `#34495E`
4. ES modules, `process.env.MONGODB_URI`, all content as string literals
5. Draft only (`isPublished: false`)
6. 6,000 words per CE hour minimum — script refuses to save if under
7. No ACEP metadata in content blocks
8. Prose must be clinically grounded — no fabricated claims
9. After the batch, update the queue file

---

## CLAUDE.md Addition

```markdown
## Batch Course Generation
When Ke says "generate courses", "next batch", "run week N", or "next 10":
1. Read `docs/BATCH_COURSE_GENERATION.md` — follow end-to-end
2. Read `docs/COURSE_PRODUCTION_QUEUE.md` — find next pending week
3. Generate all 10 courses autonomously. No pausing. No confirmation between courses.
4. Update queue status. Commit to feature branch.
```
