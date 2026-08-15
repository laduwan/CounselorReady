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

### 2026-07-25 — Books store fulfilment uses a verify endpoint, not the Stripe webhook
The Books store (`server/src/routes/books.js`) fulfils purchases via `POST /api/books/verify/:sessionId`, called on the Stripe success redirect, rather than through the Stripe webhook. This is deliberate: `server/src/routes/payments.js` (which owns the webhook handler) is a protected file that must not be edited, so book-order creation, sales-count increment, and activity logging all happen in the verify route instead. The route is idempotent (keyed on `stripeSessionId`) and confirms `session.payment_status === 'paid'` and that `session.metadata.userId` matches the caller before creating a `BookOrder`. Private book PDFs are stored authenticated (Cloudinary type `authenticated` / S3) and delivered per-buyer, watermarked, through `GET /api/books/:bookId/download`.
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

### 2026-07-25 — Books store fulfilment uses a verify endpoint, not the Stripe webhook
The Books store (`server/src/routes/books.js`) fulfils purchases via `POST /api/books/verify/:sessionId`, called on the Stripe success redirect, rather than through the Stripe webhook. This is deliberate: `server/src/routes/payments.js` (which owns the webhook handler) is a protected file that must not be edited, so book-order creation, sales-count increment, and activity logging all happen in the verify route instead. The route is idempotent (keyed on `stripeSessionId`) and confirms `session.payment_status === 'paid'` and that `session.metadata.userId` matches the caller before creating a `BookOrder`. Private book PDFs are stored authenticated (Cloudinary type `authenticated` / S3) and delivered per-buyer, watermarked, through `GET /api/books/:bookId/download`.

### 2026-08-02 — The public homepage `/` is served by REACT, not by any `.html` file
Editing the marketing pricing/hero content in `client/public/index.html`,
`client/public/home.html`, or `client/public/landing.html` has NO effect on what
visitors see at `counselorready.com`. The live homepage is
`client/src/pages/Landing.jsx`, rendered by `<Route path="/" element={<Landing />} />`
in `client/src/App.jsx`.

**Why the static files don't win:** Vite emits the React entry (`client/index.html`)
as `dist/index.html`. That is a REAL FILE sitting at the build root, and a real file
always beats a `_redirects` rule for the same path. So the rule
`/  →  /home.html  200` in `client/public/_redirects` has never fired and is
effectively dead. `client/public/index.html` is copied into `dist/` but does not
overwrite Vite's output — it is simply never reached.

**How this was found (cost ~3h):** the pricing section was updated in `index.html`,
then `home.html`, then both, and merged and deployed successfully each time, while
`/` kept showing the old four cards. `/home.html` DID render the new cards when
requested by explicit filename, which proved the files deployed correctly and
misled the diagnosis toward caching. `view-source:https://counselorready.com/`
settled it: 42 lines, `<div id="root">`, `/assets/index-*.js` — the React shell.

**Verification one-liner** before editing any homepage content:
`view-source:https://counselorready.com/` — if you see `<div id="root">`, the page
is React and the edit belongs in `Landing.jsx`.

**Note for CLAUDE.md's "Two `index.html` files" section:** that section is accurate
about its own trap (never paste marketing HTML into `client/index.html`) but it
describes `client/public/index.html` as "the public marketing homepage," which
implies it is live. It is not. Nothing routes to it.

**Open architectural question (Ke's call, NOT yet decided):** React holding `/`
contradicts the Tier 2 static-HTML-first ruling, and it is structural rather than
chosen — Vite's emitted `dist/index.html` occupies the path. Undoing it means
changing what Vite emits or how the root is served, and touches build config.
Three near-duplicate marketing files (`public/index.html`, `home.html`,
`landing.html`) plus a dead redirect rule are the residue. Not to be attempted as
a side effect of a content change.

### 2026-08-07 — TECH_MANUAL.md is duplicated end-to-end (not fixed, flagging)
This file's entire content (Tiers 1–3) appears twice back-to-back — every line
in the first copy (through the 2026-07-25 entry) recurs verbatim in the second
copy, which then continues with the 2026-08-02 entry the first copy lacks. This
reads as mechanical duplication (a bad paste/merge), not two deliberately
different versions, but per this file's own Tier 2/3 rules ("never rewrite,
delete, or reorder") I'm not collapsing it myself — appending this entry at the
true bottom of the file instead and leaving the dedup call to Ke.

### 2026-08-07 — Legacy Course decommission, Phase 4 final inventory
`grep -rln "models/Course.js" server/src --include="*.js" | sort` after Phases
1–3 landed (recommendations.js ported, admin-video-upload.html repointed,
do-not-touch list untouched) returns **33 files**, not the "certificates.js,
payments.js, and inert scripts/seeds only" end state the plan anticipated.

Breakdown:
- **Matches plan exactly (2):** `routes/certificates.js`, `routes/payments.js`.
- **Inert — scripts/data/seeds/test, unreachable unless explicitly run (17):**
  `data/bulkCourseRepair.js`, `data/fixVideoLessons.js`, `data/seedCourses.js`,
  `data/seedStandardCourses.js`, `scripts/bulkRegenerateBadCerts.js` (quarantined,
  Phase 3), `scripts/checkVideoUrls.js`, `scripts/fixOrderAndPopulate.js`,
  `scripts/listCourseHours.js`, `scripts/populate1CECoursesComplete.js` (Phase 3),
  `scripts/restoreCourseContent.js`, `scripts/seedAndValidateCourses.js`,
  `scripts/seedFadingVoices.js`, `scripts/seedNewCourses021826.js` (Phase 3),
  `scripts/seedStandardCourses_batch2.js`, `scripts/unpublishIncompleteCourses.js`,
  `utils/seed.js`, `__tests__/payments.test.js`.
- **Dead code — file exists but is not imported/mounted anywhere in `index.js` (1):**
  `routes/adminAI.js`. Effectively inert despite living in `routes/`, same as the
  script bucket above, but worth a name check before anyone assumes it's live.
- **NOT in the plan — live, mounted routes/services still on the legacy model (13):**
  `routes/adminCourses.js`, `routes/adminUsers.js`, `routes/analytics.js`,
  `routes/bulkUpload.js`, `routes/cebroker.js`, `routes/courses.js` (the legacy
  `/api/courses` surface itself — still mounted, still serving from the empty
  collection), `routes/lti.js`, `routes/migration.js`, `routes/scorm.js`,
  `routes/users.js`, `routes/xapi.js`, `services/notificationScheduler.js`
  (initialized at boot in `index.js`), `services/courseEmailService.js`
  (reachable via `routes/researchReady.js`, which is mounted).

No files were changed as part of this inventory — Phase 4 is documentation only.
The 13-file "not in the plan" bucket is new information the original scoping
(P0–Phase 3) didn't anticipate; it needs its own scoping pass before anyone
schedules further decommission work.

### 2026-08-07 — Legacy Course decommission, Phase 5.4: analytics.js was pricier than scoped, plus P3 reclassification
Phase 5 scoping called `routes/analytics.js`'s four `Course.findById`/`.find`
spots a "low risk" dual-lookup, same shape as `certificates.js`. Reality: three
of the four (`POST /course/:id/view`, `POST /course/:id/rate`, `GET
/course/:id`) read or write `course.analytics.*` / `course.ratings[]`, and
**neither field exists anywhere on `InteractiveCourse`'s schema** — a naive
dual-lookup would have crashed (`TypeError` on `undefined.views = ...`), not
silently degraded. Fixed by branching on which model resolved the lookup:
legacy `Course` keeps the exact original read/write behavior; `InteractiveCourse`
gets an honest response instead of a crash or a silent no-op — view tracking
returns `tracked:false`, rating POST returns `501 unsupported_course_type`,
and the admin analytics GET omits ratings/counters it has nowhere to read from.
The fourth spot (`GET /courses/popular`) now fetches both collections and
merges/sorts in application code, since InteractiveCourse has no analytics
counters to sort by at the DB level — interactive courses normalize to zero on
every metric and always sort last. None of this required touching
`InteractiveCourse.js` (not named in the task); giving interactive courses
real view/rating tracking needs a schema decision from Ke, not a route patch.

Also, per the same scoping doc's P3 list: `routes/adminCourses.js` and
`routes/adminUsers.js` are reclassified into the Phase 3 do-not-touch/keep
list — confirmed already dual-source (`Course` + `InteractiveCourse`) by
design, matching the `certificates.js` pattern. No code change; this is the
"RECLASSIFY... no action ever" P3 item, recorded for the record.
