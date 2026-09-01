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
- **Audit before running:** `node src/scripts/auditCourse.js --file <path>`

---

> **Note (added during the docs-only replacement task, 2026-09-01):** The source text supplied for this v2.0 document ended mid-sentence at the end of §0 above — no further sections (block-type shapes, intro/conclusion structure, callout/keyTakeaway mandate, references/resources drawer, glossary auto-generation, validation gates, engagement rules) were provided. Rather than invent that content, only the verified §0 material was written here. Ke: please send the remaining sections and they'll be appended in a follow-up commit.
