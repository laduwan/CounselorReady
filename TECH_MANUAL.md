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

### 2026-06-13 — Trial gate over-granted (FIXED); seat-timer still broken
hasPaidOrFreeAccess listed 'trial' as unlimited, bypassing the 1-CE-hour cap and course count. A no-card trial user took 10 CE hours free. Policy enforced now: no-card trial = 2 one-CE courses lifetime (trialCoursesUsed); card-on-file = 4 one-CE/month. Distinguish via subscription.stripeCustomerId. SEPARATE open issue: totalTimeSpent reads 0 platform-wide (front-end not posting timeSpent) — contact-hour evidence gap, cert-issuance chain (assessment+evaluation+attestation) itself is sound. Lesson: every CourseProgress-creating route (3 of them) must run the shared gate; fixing the shared fns fixed all three.
