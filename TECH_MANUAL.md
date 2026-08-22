# CounselorReady Technical Manual

> **This manual has three tiers with different ownership and edit rules.**
> The structure exists because earlier hand-maintained manuals degraded: no
> single chat session held all corrections, so different Claude instances filled
> gaps with different guesses. The fix is structural — generated facts can't drift,
> human rulings are walled off, and discoveries only append.

---

## TIER 1 — GENERATED FACTS (never hand-edited)

These are extracted from code by scripts. Do not edit by hand. Do not let any
LLM rewrite them. Regenerate after the relevant code changes.

| Reference | Generator | Regenerate when |
|---|---|---|
| `BLOCK_FIELD_REFERENCE.md` | `server/src/scripts/generateBlockFieldReference.js` | any block render fn or schema change |

**Why generated:** field names, block types, and enums are the facts that bite
hardest and drift fastest. A script reading `interactive-course.html` produces
identical output regardless of which Claude runs it, because none of them author —
they extract. This is the layer that ended the "one Claude would Rembrandt, another
wouldn't" problem for factual content.

---

## TIER 2 — HUMAN-OWNED GOVERNANCE (Claude: DO NOT MODIFY)

> **Claude / CC instruction:** This section is authored by Ke. Do not rewrite,
> summarize, condense, "improve," or reorder it. Do not move rulings into Tier 3.
> If a ruling here appears contradicted by code, FLAG it to Ke — do not silently
> "fix" the manual to match. These are decisions, not observations.

### Architecture rulings
- **Static-HTML-first.** Reject any change that adds React routes/providers
  overriding static `.html`, uses `<Link>` where `<a href>` works, or introduces
  SPA behavior where static HTML suffices.
- **CR Viewer (`client/public/interactive-course.html`) is SACRED.** Never rewrite.
  It is the source of truth for block rendering and field names. Surgical edits only.
- **`interactiveCourseRoutes.js` is PROTECTED.** Min length enforced. Never rewrite;
  no inline model declarations.
- **Canonical collection is `interactivecourses`** (model `InteractiveCourse.js`).
  Legacy `courses` collection is read-only via the old CourseViewer on `/learn/:slug`
  and is otherwise dead. The new course builder writes ONLY to `interactivecourses`
  via `/api/course-builder/save` → `InteractiveCourse.save()` (fires the word-count
  pre-save hook). No raw `insertOne`; always `.save()` or `recalcAllWordCounts.js`.
- **Legacy builder is retired.** `CourseViewer.jsx`'s `CourseBuilderV2` export is
  dead — nothing routes to it. Do not extend it. The live builder is
  `client/src/components/course-builder/` at route `/admin/course-builder`.
- **`InteractiveCourse.js` schema wins over GOLD_STANDARD_SPEC.md** wherever they
  conflict on field names or options shape. The spec is known wrong on media and
  several block fields; the schema + viewer are truth.

### Compliance rulings
- **ACEP word floor: 6,000 words per CE hour** (home study / async only). Non-negotiable.
- **Live CE has NO word floor** — live courses need objectives, run-of-show, slides,
  prompts, handouts; CE credit = verified instructional minutes, not word count.
- **References are excluded from word count** (locked policy). Counter walks prose
  fields only; layout/asset fields (image URLs, positions, alt text) add no words.
- **Live sessions: PHI never touches CounselorReady infrastructure.** Only PHI surface
  is the Whereby video stream, covered by the Whereby BAA. Attendance metadata is not PHI.
- **Supervision sessions are hard-locked**: no recording, no handouts, no clips, no
  agenda, no transcription, no AI/catch-up. Enforced at schema pre-validate, routes,
  and webhook. These locks are not optional and not admin-overridable.
- **ACEP #7760 belongs to GAITP.** Any future partner/marketplace course must issue
  under the PARTNER's own provider number, never #7760. Hosting partner content under
  GAITP's number puts GAITP's provider status at audit risk — do not build it that way.

### Course builder / layout roadmap (Ke's decisions)
- **Media work is two passes.** Pass 1: wire existing `CloudinaryUploader` + expose
  the size/position/alignment/highlight controls the viewer ALREADY renders (low risk,
  no viewer change). Pass 2: genuinely new layout variants (two-column, full-bleed
  banner, variable-width cards) — deliberate additions to the sacred viewer, separate branch.
- **Block variety already exists in the viewer, unexposed in the builder.** The block
  picker offers fewer types than the viewer renders. Exposing `statCard`, `pullQuote`,
  `caseStudy`, `keyTakeaway`, `table`, `timeline`, `callout`, and `sectionDivider`
  banner images is "surface existing capability," not "build new" (see Tier 1 reference).

### Working agreements with Claude / CC
- Clone/pull latest before proposing changes; cross-reference code → live API → DB.
- Deliver complete ready-to-deploy files, not patches (mobile GitHub-web workflow).
- CC falsely confirms completion — always verify with raw `grep`/`wc`/`git diff --stat`.
- "pushed ≠ merged" — verify against `origin/main` after every merge.

---

## TIER 3 — DISCOVERY LOG (append-only, dated)

> **Claude / CC instruction:** APPEND new dated entries at the bottom only. Never
> rewrite, delete, or reorder existing entries. A wrong entry can be added but must
> not corrupt prior ones. Ke periodically promotes durable discoveries up to Tier 1
> (codify in a generator) or Tier 2 (a ruling). Format: `### YYYY-MM-DD — short title`.

### 2026-06-12 — Live sessions Phases 1 & 3 merged
Whereby-backed live sessions live on `api.counselorready.com/api/live-sessions`.
CC built Phase 1 (sessions/attendance/certs) plus Phase 3 (agenda/watch-party/clips,
catch-up route, admin-live-sessions.html, live-host.html). Supervision hard-locks
verified across schema, routes, webhook. Phase 2 (Session Producer cron: drop
detection, break reminders, wrap-up emails) NOT yet built.

### 2026-06-13 — Media field-name divergence discovered
`image` and `imageText` blocks use different field names for the same concepts
(`imageUrl`/`imageAltText` vs `image`/`imageAlt`). Wiring a generic uploader's
`{url,alt}` to the wrong names = silent blank render (saves fine, word count fine,
shows nothing). Captured permanently in Tier 1 `BLOCK_FIELD_REFERENCE.md`. Viewer
also supports `sectionDivider` banner images and ~7 block types the builder doesn't expose.

<!-- APPEND NEW ENTRIES BELOW THIS LINE -->

### 2026-06-13 — Payment bypass via POST /:id/assessment (FIXED)
Assessment endpoint auto-created completed enrollments with no access check; free users could certify on paid courses without paying. Added hasPaidOrFreeAccess + freeTierDecision gate matching /enroll and /progress. Lesson: EVERY route that can create a CourseProgress must run the access gate — there are 3 such paths.

### 2026-06-13 — Outline import added (paste + docx, 3 modes)
AI Assistant tab now accepts an existing outline by paste or .docx upload instead of only generating from a topic. Modes: full-generate / shells-only / docx-convert. All feed the existing outline→generate→LOAD_COURSE pipeline; convert mode preserves prose verbatim. Endpoints: POST /course-builder/parse-outline, /import-docx.

### 2026-06-13 — Trial gate over-granted (FIXED); seat-timer still broken
hasPaidOrFreeAccess listed 'trial' as unlimited, bypassing the 1-CE-hour cap and course count. A no-card trial user took 10 CE hours free. Policy enforced now: no-card trial = 2 one-CE courses lifetime (trialCoursesUsed); card-on-file = 4 one-CE/month. Distinguish via subscription.stripeCustomerId. SEPARATE open issue: totalTimeSpent reads 0 platform-wide (front-end not posting timeSpent) — contact-hour evidence gap, cert-issuance chain (assessment+evaluation+attestation) itself is sound. Lesson: every CourseProgress-creating route (3 of them) must run the shared gate; fixing the shared fns fixed all three.

### 2026-07-07 — Diagnostic Model design spec added (docs/DIAGNOSTIC_MODEL_SPEC.md)
On-prem support-diagnosis design brief committed for future reference: investigate real state → trace → localize → report; auto-fix only proven-deterministic signatures (novel/uncertain → report only). Includes a failure-signature table and a Phase-2 tool build order. Design brief only — nothing runs yet; its file/line anchors (e.g. the interactiveCourseRoutes POST endpoint line numbers) should be re-verified against current code before any Phase-2 tool is built.

### 2026-08-22 — Viewer redesign landed (PRs #857–#862); mockup widths are proportional
The CReady Viewer now implements the design-handoff canon: Supplemental drawer (13b), knowledge-check popout (14a/b), sidebar retired to an on-demand Contents drawer, 11a overview (with delivery method/format/instructor/exit), 11e checkpoint, 11f one-question exam, 11g pass/evaluation/certificate, 2a accessibility drawer. Two traps worth remembering: (1) the mockup spec's pixel widths (640px reading column) are PROPORTIONS of its ~915px artboard — the design canvas confirms 70% of screen; hard-coding the pixel value re-created the old narrow look twice before this was understood, and inner per-element caps (680px paragraphs, 720px blocks/callouts/references) silently re-narrow content even after the column is widened. (2) Side panels must start below the sticky reader header (top:72px on desktop) or they cover the very tab row that opens them. Skipped knowledge checks and unsaved Supplemental items persist per learner via localStorage (cr-viewer-<slug> keys: kcResponses, supplemental, examDraft) and resurface at the section checkpoint. Still off-canon: 2b print/download drawer, inline multipleChoice/multiSelect blocks (render old inline cards), Contents drawer interior, 11g's APPLIES TO card (no client-side credential data), mobile footer nav overflow (pre-existing).

### 2026-08-22 — 640px reading column is CANON (corrects the entry above); drift-fix pass 1
Bundle-3 `DRIFT_FIXES.md` overrules the "proportional width" reading in the previous entry: 640px is a line-length decision (~70 chars at 17.5px Lato), NOT a fraction of the mockup artboard — the `min(70vw,1360px)` desktop override was a misreading and is now deleted. Wide screens get margin, never a wider column; the exam (11f) alone widens to 940px via `:has(.cr-exam-header)`. Same pass: standalone opener is section 1 only (20b contained card), checkpoint+opener merged into one 20a boundary screen, engagement blocks are navy (violet/cyan are builder-side hues, banned in learner UI), failed attempt with retries is navy 17a. Separate gotcha: `generateBlockFieldReference.js` only sees direct `block.X` reads, so a render fn that delegates to a helper (renderMultiSelect → crMselHtml since the 15j inline build) reports "No direct block.X reads" — the fields (question/options/explanation) are unchanged; inspect the helper before trusting that line.

### 2026-08-22 — Bundle-4 mockup-exact pass; 17a per-section diagnosis blocked on schema
Bundle 4 resolved the reading-width dispute definitively: BOTH caps at once — #crApp frame 1040px AND column 640px (the mockup's ~70% proportion). The wide-70vw ruling earlier today is superseded by Ke's "make it look exactly like the mockups" directive with that bundle. Blocks now match 15b/15c/15g/15f/16d/19a forms; left-accent bars converted to full-border tint cards (DRIFT §10). NOT buildable without a schema change: 17a's per-section score bars / THE PATTERN / derived review pages need a question→section mapping on assessment.questions (schema has question/type/options/explanation only) — adding a field requires Ke's task-level naming per CLAUDE.md; flagged in the PR instead of faked. 17b shipped within existing data (no re-enroll offer invented — that flow has no backend).

### 2026-08-22 — FINAL width ruling: reading column = 70% of the VIEWPORT
Ke rejected narrower treatments three times in one day (fixed 640px; 920px-frame proportion — "thats not 70 percent of page"). Standing rule, marked KE'S RULING in the CSS: `.cr-reading-column { max-width: min(70vw, 1360px) }` on desktop, 704px below 1025px; NO app-frame cap — header/footer bars span the full window (also Ke's explicit ask). The design bundles' 640px/920px reasoning is overruled; any future drift doc flagging this must be surfaced to Ke, never applied.
