# CounselorReady — Claude Code Instructions
## GA Integrated Therapeutic Perspectives LLC · NBCC ACEP #7760
---
## Prime Directive
**Only touch files explicitly named in the task prompt.**
If a file is not listed in the task, do not open it, do not edit it, do not refactor it, do not "improve" it, do not add imports to it. If completing the task seems to require touching an unlisted file, stop and ask.
---
## The Golden Rule
> **Fix what is broken. Nothing else.**
Do not change colors, fonts, components, emojis, sizing, layout, variable names, or file structure unless explicitly asked. Do not refactor working code. Do not rename things for consistency. Do not reorganize imports. Do not upgrade patterns. If it works, leave it alone.
---
## Commit & PR Hygiene
Never add Co-Authored-By lines or "Generated with Claude Code" footers to commits or PR descriptions.
---
## Architecture: Two `index.html` files (READ BEFORE TOUCHING EITHER)
CounselorReady is **static-HTML-first** (82 `.html` pages in `client/public/`), but a
few routes are **React** — most importantly the **course-builder**. This creates a
trap that has broken production **three times**, so it is documented here permanently.

There are two different files both named `index.html`. They are NOT interchangeable:

| File | What it is | Must contain |
| --- | --- | --- |
| `client/index.html` | **Vite's React entry.** Built and emitted as the deployed `/index.html`. | `<div id="root">` + `<script type="module" src="/src/main.jsx">` |
| `client/public/index.html` | **The public marketing homepage** (Features/Pricing/Sign in). Copied verbatim to the build root. | marketing markup (no `#root`) |

`client/public/_redirects` maps the SPA routes to the React entry:
```

/admin/course-builder /index.html 200 # the React shell (client/index.html, after build) /admin-course-builder /index.html 200

```
**The trap:** Vite copies `public/` verbatim, so if `client/index.html` is ever
overwritten with marketing HTML (no `#root`, no `main.jsx`), the build ships a
marketing page as `/index.html`. Then `/admin/course-builder` serves the marketing
homepage — with a "Sign in" button — instead of booting React, which looks exactly
like the course-builder "logging you out." (`/auth/me` still returns 200; the React
app simply never loads.)

**Rules:**
- Never paste marketing/static HTML into `client/index.html`. Edit the marketing
  homepage in `client/public/index.html` only.
- `client/vite.config.js` has a `verify-react-entry` build guard that FAILS the build
  if `client/index.html` loses `#root` or `/src/main.jsx`. Do not remove it.
- If a course-builder "can't load / logs me out" report comes in, check this first:
  `grep 'id="root"' client/index.html` — if missing, the entry was clobbered again.

History: broken/restored at commits `268e190`, `2875c7e`, then re-broken at `53797f2`.
---
## Seed & Course Authoring
**Before creating or editing any interactive-course seed, read `docs/SEED_AUTHORING_AND_VIEWER_GUIDE.md`** — verified block-type shapes, the references/resources drawer mechanism, validation gates, and engagement rules. The code (`InteractiveCourse.js`, `interactive-course.html`) overrides any spec doc.

---
## Hard Off-Limits Files
These files are complete and stable. Do NOT open, read, or modify them unless the task prompt explicitly names them:
### Backend services — locked
- `server/src/services/openAlex.js` — RNR CE OpenAlex integration, complete
- `server/src/services/currencyCheck.js` — RNR CE currency check, complete
- `server/src/services/ceBuild.js` — RNR CE CE build, complete
- `server/src/services/syllabusGenerator.js` — RNR CE syllabus DOCX, complete
- `server/src/services/courseCompletionService.js` — do not touch
- `server/src/services/emailTemplates.js` — do not touch
- `server/src/services/narrationService.js` — do not touch
### Backend routes — locked
- `server/src/routes/auth.js` — authentication, do not touch
- `server/src/routes/payments.js` — Stripe billing, do not touch
- `server/src/routes/courses.js` — core course delivery, do not touch
- `server/src/routes/courseRoutes.js` — do not touch
- `server/src/routes/certificates.js` — do not touch unless task names it
- `server/src/routes/adminStripe.js` — do not touch
- `server/src/routes/interactiveCourseRoutes.js` — NEVER rewrite. 1518+ lines. Full course pipeline (gateContent, assessment, evaluation, attestation, certificate, gamification, free course monthly limit). If this file drops below 1000 lines, it has been destroyed. Do NOT embed mongoose.model() calls — models are imported from server/src/models/.
### Backend models — locked
- `server/src/models/User.js` — do not add, remove, or rename fields unless task names it
- `server/src/models/Course.js` — do not touch
- `server/src/models/Certificate.js` — do not touch unless task names it
- `server/src/models/UserCourseProgress.js` — do not touch
- `server/src/models/InteractiveCourse.js` — primary content schema. Adding fields requires task-level naming. **Removing or modifying any value in any `enum:` array is a destructive change** — it invalidates existing documents on next save and can silently strip block types from courses (see "PROTECTED ENUM: ContentBlockSchema.type" below).
### Frontend — viewers and builders (locked)

**Architecture note:** This platform is **static-HTML-first**. The course player is intentionally a single HTML file, not a React component. CC's default is to suggest React patterns; reject them for anything in the course-playback path.

- `client/public/interactive-course.html` — **THE LIVE COURSE PLAYER.** 6,329-line single-file HTML+CSS+JS player (the "CReady Viewer"). This is the viewer Ke built to replace the original ready-built React viewer, specifically to avoid content stripping and gain full layout control. Every production static path (`/courses.html`, `/course-details.html`, `/course-player.html`, `/course-player-unified.html`) loads this. Edits require explicit task-level naming and surgical scope only — no refactoring, no splitting into separate files, no "while I was there" cleanup. The single-file architecture is intentional (product brief / licensing). Verify with `grep` after every edit. **This file replaces, does not coexist with, any React-based viewer.**

- `client/src/components/CourseViewer.jsx` — **LEGACY / DO NOT EXTEND.** Originally part of the ready-built React viewer system that the static `interactive-course.html` replaced. The file itself is now 3,749 lines and exports `CourseBuilderV2` (CourseBuilder code dropped into a viewer-named file at some point). It is wired to `/learn/:slug` in App.jsx, but production traffic does not flow through that route — Layout nav and course-details pages all bypass React and load `interactive-course.html` directly. **Do not "fix" the filename, do not migrate code in or out, do not suggest re-routing Dashboard tiles to make `/learn/:slug` work, do not propose a React rewrite of the viewer. This component is being left to die, not repaired.**

- `client/src/components/CourseBuilder.jsx` — DO NOT TOUCH.
- `client/src/components/CourseViewerPatch.jsx` — 633 lines of patch helpers imported by `CourseViewer.jsx`. Same legacy status. Do not extend.
- `client/src/components/Layout.jsx` — do not touch unless task names it. (Note: it correctly links course nav to the static `/courses.html`, not to React routes — preserve this.)
- `client/src/components/AccessibilityProvider.jsx` — do not touch.

### Files that LOOK like duplicates but are not — leave alone
- `client/public/interactive-course-legacy.html` (2,674 lines) — older snapshot, do not delete or "consolidate"
- `client/src/components/interactive-course.html` (2,902 lines) — orphan duplicate not imported anywhere; do not delete without a dedicated task
- `client/public/course-player.html` (13L), `course-player-unified.html` (4L), `courses-unified.html` (8L) — redirect shells that point to `/interactive-course.html`. Do not "improve" them; their job is to forward old URLs.

### React vs static — decision rule
When a task touches anything course-playback related, default to editing the static HTML files (`interactive-course.html`, `courses.html`, `course-details.html`). Only touch React (`/client/src/`) when the task is explicitly about a non-playback feature (RNR CE, dashboard widgets, admin tools). If a task seems to require routing course playback through React, **stop and ask** — that direction is against architecture.
### Frontend config — locked
- `client/tailwind.config.cjs` — color palette and font families are locked
- `client/src/index.css` — base layer and component layer styles are locked
- `client/vite.config.js` — do not touch
- `client/src/main.jsx` — do not touch
---
## Locked Visual Design
### Platform-wide brand (all existing pages)
- Buttons: `burgundy-700` / `burgundy-800` — do NOT change to any other color
- Logo gradient: `linear-gradient(135deg, #8B2542, #6B1D34)` — do NOT flatten
- Colors: the existing burgundy/forest/stone brand scheme — do NOT introduce new palettes on existing pages
- Navy = `#284157` — **never** `#34495E` (deprecated, will appear in autocomplete — reject it)
- Fonts: display/sans/body font families in tailwind.config — do NOT change
### Course Catalog Page — FULLY LOCKED
`client/src/pages/InteractiveCourseCatalog.jsx`
- Header banner: teal-600 to emerald-600 gradient — locked
- Filter bar: white bg, rounded-xl, gray-300 borders — locked
- Grid layout: 1/2/3-column responsive with gap-6 — locked
- CourseCard: gradient thumbnail, gray-100 border — locked
- Functional/data changes only. Zero visual changes.
### RNR CE Components — separate design system
RNR CE components (`client/src/components/researchReady/*` and `client/src/pages/ResearchReadyCE.jsx`) use a DIFFERENT design system from the rest of the platform. This is intentional:
- Palette: eggnog `#FAF5EC`, buttercream `#FDF8EE`, honey `#8B5E2E`, burgundy `#7B2D3E`, pewter `#DDD9D3`
- Font: Georgia serif throughout
- Reference: `RNR_CE_UI.js` in repo root
- Do NOT apply the platform's Tailwind burgundy/forest palette to RNR CE components
- Do NOT apply the RNR CE palette to any other platform page
---
## Locked Code Markers
Sections marked with these comments are protected — do not modify:
```js
// @lock-start: <reason>
... protected code ...
// @lock-end

const VALUE = 'x'; // @lock
```
---
## CE Hour Calculation — never change this formula
```js
// 1 CE hr = 6,000 words. Always round DOWN to nearest 0.5.
Math.floor((wordCount / 6000) * 2) / 2
```
This formula is used in `openAlex.js` and `RNR_CE_UI.js`. Do not alter the formula, the divisor, or the rounding direction anywhere in the codebase.
---
## Task Scope Rules
1. **Read the task file list first.** Every Claude Code prompt for this repo names the exact files to touch. Start there.
2. **Do not add files not requested.** If a task says "edit X", do not create Y as a bonus.
3. **Do not add dependencies.** Do not run `npm install` for new packages unless the task explicitly requests it.
4. **Do not run database migrations** or seed scripts unless the task explicitly says to.
5. **Do not change API response shapes** on existing routes — consumers depend on them.
6. **Ask before touching shared utilities.** Files in `server/src/utils/` affect many features. Confirm before editing.
7. **Before removing, replacing, or re-routing any import, route, component, or service:** grep for every place it is referenced across the entire codebase. List all dependents. Do not touch it until you have confirmed nothing else breaks.
8. **Before adding a new import to any file:** confirm the source file actually exists. A missing file breaks the entire build silently.
---
## Collections & Routes
- User-facing course content reads from `interactivecourses` only. **Never wire a frontend component to `GET /api/courses`.**
- Always verify a route file is imported AND mounted in `server/src/index.js` before calling it from the frontend — a route file that exists but is not registered is completely unreachable.
- Route order matters in Express — specific paths (e.g. `/user/my-courses`) must be registered before wildcard paths (e.g. `/:id`).
- Always add a timeout + AbortController to frontend fetch calls — never leave a fetch with no timeout.
---
## Branch Policy

**Default: feature branch.**

Every task should be on its own branch:
```
git checkout -b task/<short-description>
```
Show a diff summary before committing. If you touched a file not in the task list, revert it before committing.

**Direct-to-main exception** is permitted ONLY when ALL of the following are true:

1. **Single file changed.** No multi-file refactors. (Exception: documentation-only commits touching CLAUDE.md plus one related file.)
2. **Net additive change ≤10 lines.** No deletions, no replacements — only insertions or new files.
3. **No code logic changed.** Allowed: HTML content edits, CSS additions, copy changes, config additions, new env-var-driven values. Disallowed: any JS function modification, schema changes, route handler edits, webhook handler edits, test changes.
4. **No protected file touched.** See "Protected Services" section below — those always require explicit authorization regardless of branch policy.
5. **Ke explicitly states "push to main" in the task prompt.** Default behavior without that explicit instruction is feature branch.

When in doubt: feature branch. The cost of an extra merge step is 30 seconds. The cost of an unauthorized direct push to main is potentially hours of recovery.

If a task prompt says "push to main" but any of conditions 1–4 are violated, STOP and surface the conflict — do not proceed on either path without clarification.
---
## When In Doubt
Stop. Ask. Do not guess, do not approximate, do not "make it work" by changing something adjacent. The cost of asking is zero. The cost of unwiring a stable feature is high.
---
## Active Feature Status (as of March 2026)
⚠️ This table is manually maintained. Do not treat it as authoritative — verify actual file state before assuming status.

| Feature | Backend | Frontend | Prompt |
|---|---|---|---|
| RNR CE (Researched-N-Ready) | ✅ Complete | 🔧 Gap-fill (10 tasks) | v2 prompt |
| Extend Trial +3 days | 🔧 Needs route | 🔧 Needs button | Prompt ready |
| Certificate tile (article CE) | 🔧 Needs rnrMeta | 🔧 Needs tile variant | In RNR v2 |
| CE Planner RNR block | ✅ Route exists | 🔧 Needs UI block | In RNR v2 |
| Course Player (live) | ✅ Locked | ✅ Static `interactive-course.html` — Ke's hand-built viewer | Do not touch without scoped task |
| React viewer (`/learn/:slug`, CourseViewer.jsx) | — | ⚠️ Legacy / deprecated — do not extend | Do not touch, do not "fix" |
| Auth / Payments / Courses | ✅ Locked | ✅ Locked | Do not touch |

---
## ⚠️ PROTECTED FILE: client/public/interactive-course.html
**This is the live course player and the canonical viewer for this platform.** Single-file HTML+CSS+JS at 6,329 lines (the "CReady Viewer"). Ke built this specifically to replace the original ready-built React viewer system, which stripped content and limited layout flexibility. **It is intentionally NOT a React component.**

Every production static path converges here: `courses.html`, `course-details.html`, `course-player.html`, `course-player-unified.html` all redirect or link to `/interactive-course.html?slug=X`. Layout nav points to `/courses.html`, not to a React route — preserve that.

### Rules for interactive-course.html
1. **Never rewrite from scratch.** It is 6,329 lines for a reason — entire 17-block-type renderer, 19 accessibility features, viewer state machine, and the cr-* CSS system in one file.
2. **Surgical edits only.** No refactoring. No "while I was there" cleanup. No reformatting.
3. **No file-structure changes.** Do not extract CSS to a separate file. Do not extract JS to a separate file. Do not split into modules. Single-file architecture is intentional and required for the product brief / licensing model.
4. **Never propose migrating this to React.** The whole point of this file existing is to NOT be React. If a task seems to require a React rewrite of the player, stop and ask — that is against architecture.
5. ## Chat-Display Artifacts in Prompts

When receiving prompts from Ke (or any LLM-generated source) containing code,
text inside chat interfaces may be auto-linkified by the rendering layer in ways
that corrupt the underlying code. This is a DISPLAY artifact, NOT actual code.

### Common artifacts to recognize and ignore

**JavaScript property access (e.g., `this.style.display`):**
Chat UIs sometimes interpret dotted identifiers as domains and wrap them in
markdown link syntax. You may see:

  - `[this.style](http://this.style).display='none'`
  - `[window.location](http://window.location).href = ...`
  - `[document.body](http://document.body).innerHTML = ...`
  - `[user.email](http://user.email).toLowerCase()`

The actual underlying code is always the un-bracketed, un-URL-wrapped form:

  - `this.style.display='none'`
  - `window.location.href = ...`
  - `document.body.innerHTML = ...`
  - `user.email.toLowerCase()`

**Email-style strings inside code:**
Anything resembling an email or domain may be auto-linkified even when it's
clearly part of a code expression, regex, or string literal.

**File paths with dots:**
Paths like `nav-footer.js` or `index.html` are usually safe, but watch for
`config.api.url` style chains in object access — same auto-linking risk.

### Mandatory behavior

1. **Take all JavaScript, TypeScript, JSX, HTML attributes, and code expressions
   as LITERAL.** If a code snippet contains markdown link syntax around
   identifiers, STRIP the markdown — do not preserve it, do not "fix" it by
   adding parens or URLs.

2. **Never insert URLs into code that didn't have them in the original intent.**
   Markdown link syntax inside JS/HTML/CSS is always an artifact, never a
   feature.

3. **When in doubt, ask Ke before substituting.** Per existing "When in doubt:
   stop, ask" governance, surface the ambiguity rather than guessing.

4. **Do not "improve" code by linkifying identifiers.** Even if you think a
   property name "looks like" it could be a URL, it isn't.

### Worked example

Ke sends a prompt containing:
  `onerror="this.style.display='none'"`

Chat UI may render that as:
  `onerror="[this.style](http://this.style).display='none'"`

The CORRECT interpretation when writing this attribute to a file:
  `onerror="this.style.display='none'"`

The INCORRECT interpretation (do NOT do this):
  `onerror="[this.style](http://this.style).display='none'"`

The corrupted form is invalid JavaScript and will throw a parse error in the
browser. Always strip the markdown link wrapping from JS code.

### When this rule applies

- Any prompt from Ke containing inline code
- Any code block that appears to have URLs embedded mid-expression
- Any HTML attribute value containing what looks like a markdown link inside
  an `on*` event handler, `style`, `data-*`, or other attribute

### When this rule does NOT apply

- Genuine href/src attributes pointing to real URLs
- Documentation prose where URLs are intentionally referenced
- Configuration files where API endpoints are legitimately URLs
6. **Do not call this file legacy, redirect shell, or stale duplicate.** It is the production viewer. The actual redirect shells are `course-player.html`, `course-player-unified.html`, and `courses-unified.html` (each under 15 lines). The actual legacy is `CourseViewer.jsx`.
7. **Do not assume `cready-viewer.html`, `cready-viewer.css`, or `cready-viewer.js` exist.** They do not. A file split was scoped but never executed. Any prompt or doc that references those filenames is stale.
8. **Verify after every edit:** paste raw `grep` output into the PR description proving the change landed and nothing else was touched. `git diff --stat main` should typically show exactly one file changed.

---
## ⚠️ PROTECTED FILE: client/src/components/CourseViewer.jsx (LEGACY)
**Despite the filename, this is NOT the active course viewer.** This component is a remnant of the original ready-built React viewer system that the static `client/public/interactive-course.html` was built specifically to replace.

The file currently contains 3,749 lines of `CourseBuilderV2` code (BlockEditor, AIGenerator, ACEPChecker, parseMarkdownToCourse — all builder UI, no viewer state). Whoever last edited it dropped builder code into a viewer-named file. The mismatch is part of the legacy mess, not a bug to fix.

The `/learn/:slug` route in `App.jsx` still points here. Production traffic does NOT flow through that route — the live navigation (`Layout.jsx → /courses.html → /interactive-course.html`) bypasses React entirely.

### Rules for CourseViewer.jsx
1. **Do not extend it.** No new features, no migration of code in or out, no "fixes" to make `/learn/:slug` work.
2. **Do not rename it** to match its contents, do not split it into proper builder/viewer files. Those are dedicated cleanup tasks that must be scoped explicitly.
3. **Do not propose React rewrites of the static viewer.** The static `interactive-course.html` is intentional. React is not the path forward for course playback.
4. **`CourseViewerPatch.jsx`** (633 lines, imported by this file) — same legacy status. Do not extend.
5. **If a task seems to require touching this file**, stop and ask whether the task should target the static viewer instead.
This file has a history of being overwritten with incomplete versions, breaking all routes that get dropped.
### Rules for index.js
1. **NEVER rewrite this file from scratch.** Always read the current version first, then make targeted additions.
2. **NEVER remove any `import` or `app.use()` line.** If a route seems unused, leave it — removing it breaks the frontend page that depends on it.
3. **NEVER change the interactiveCourseRoutes import.** It MUST point to `./routes/interactiveCourseRoutes.js` (NOT `courseRoutes.js`). The stripped `courseRoutes.js` is missing certificate generation, evaluation, attestation, gamification, and CE auto-allocation.
4. **The REQUIRED_ROUTES object at the bottom is a startup integrity check.** If you add a new route, add it there too. The server will log which routes are broken on every boot.
5. **If the task requires adding a new route:** add the import AND the `app.use()` mount AND an entry in REQUIRED_ROUTES. All three or nothing.
6. **Current route count: 37 mounts.** If your version has fewer, you dropped something.

---
## ⚠️ PROTECTED FILE: server/src/index.js
This file has a history of being overwritten with incomplete versions, breaking all routes that get dropped.
### Rules for index.js
1. **NEVER rewrite this file from scratch.** Always read the current version first, then make targeted additions.
2. **NEVER remove any `import` or `app.use()` line.** If a route seems unused, leave it — removing it breaks the frontend page that depends on it.
3. **NEVER change the interactiveCourseRoutes import.** It MUST point to `./routes/interactiveCourseRoutes.js` (NOT `courseRoutes.js`). The stripped `courseRoutes.js` is missing certificate generation, evaluation, attestation, gamification, and CE auto-allocation.
4. **The REQUIRED_ROUTES object at the bottom is a startup integrity check.** If you add a new route, add it there too. The server will log which routes are broken on every boot.
5. **If the task requires adding a new route:** add the import AND the `app.use()` mount AND an entry in REQUIRED_ROUTES. All three or nothing.
6. **Current route count: 37 mounts.** If your version has fewer, you dropped something.

---
## ⚠️ PROTECTED FILE: server/src/routes/interactiveCourseRoutes.js
This file has been destroyed TWICE by being rewritten from 1518 lines to 388 lines with inline model schemas, crashing the server with OverwriteModelError.
### Rules for interactiveCourseRoutes.js
1. **NEVER rewrite this file from scratch.** It is 1518+ lines. If your version is under 1000 lines, you destroyed it.
2. **NEVER add mongoose.model() calls.** Models are imported from `server/src/models/`. Inline schemas cause `OverwriteModelError: Cannot overwrite InteractiveCourse model once compiled` crashes.
3. **NEVER remove gateContent, findCourseByIdOrSlug, assessment, evaluation, attestation, or certificate routes.** These are the complete course completion pipeline.
4. **Only make targeted edits** — add new endpoints or modify specific functions. Never replace the whole file.
5. **Key functions that MUST exist:** `gateContent()`, `stripContent()`, `findCourseByIdOrSlug()`, `getFreeCoursesUsed()`, `incrementFreeCoursesUsed()`, `recordGamification()`
6. **Key routes that MUST exist:** GET `/`, GET `/:id`, GET `/slug/:slug`, POST `/:id/enroll`, POST `/:id/assessment`, POST `/:id/evaluation`, POST `/:id/attestation`, GET `/:id/certificate`, PUT `/:id/progress/section/:sectionIndex`

---

## ⚠️ PROTECTED ENUM: ContentBlockSchema.type (in InteractiveCourse.js)

This enum defines every valid content-block type the platform recognizes. It has been silently stripped at least once — `clinicalVignette` was removed in early May 2026, breaking publish for several existing courses, and the May 9 2026 incident review found that `bulkRebuildCourses.js` carried a stale `VALID_BLOCK_TYPES` Set missing 9 valid types, capable of dropping callout / clinicalVignette / keyTakeaway / deliverables / fillInBlank / references / knowledgeCheck / quiz / video blocks on any course it processed.

### Rules for the ContentBlockSchema.type enum
1. **NEVER remove an existing value from the enum.** Doing so invalidates every existing document that uses it; saves fail with `\`X\` is not a valid enum value for path \`type\``. If a value is genuinely deprecated, mark it deprecated in a code comment and leave it in the enum.
2. **The current canonical set (as of May 10, 2026) is 26 values:**
   `accordion, callout, cardSort, clinicalVignette, deliverables, fillInBlank, flashcardDeck, hotspot, image, imageText, keyTakeaway, knowledgeCheck, matching, multiSelect, multipleChoice, quiz, references, reflection, resources, scenarioTree, sectionDivider, sequencing, text, timeline, video, videoEmbed`
3. **Adding a value requires** updating ALL of the following in the same PR: (a) the enum in `server/src/models/InteractiveCourse.js`; (b) `VALID_BLOCK_TYPES` in `server/src/scripts/bulkRebuildCourses.js`; (c) the renderer dispatch in `client/public/interactive-course.html` (renderBlock switch around line 4496); (d) the documented type list in `COURSE_SCHEMA_SPEC.md` and Tech Manual §10.
4. **NEVER drop entries from `VALID_BLOCK_TYPES` in any script.** If a script filters blocks by type, its allow-list must contain at minimum every value above. A drift between the schema enum and a script's filter is a silent data-loss bug.
5. **Other related enums in the same file** (`approvals[].body`, `nbccContentAreas`, `accessType`, question `type`, `deliveryFormat`, `calloutType`) follow the same rule: removing or renaming a value breaks existing data. If you must rename, write a migration that maps old → new before merging the schema change.

---

## Protected Services — Do Not Modify Without Explicit Authorization

The following files implement core platform notification, tracking, and webhook infrastructure. Bugs in these files are silent — they don't throw errors, they just stop working. Past incidents (commits 43db65e and 590b68d) demonstrate that "tightening" or "refactoring" these files has broken the entire admin notification pipeline without anyone noticing for weeks.

NEVER modify these files unless Ke explicitly says "edit [filename]" or "fix the bug in [filename]":

- `server/src/services/activityTrackingService.js`
- `server/src/services/adminNotificationService.js`
- `server/src/services/notificationTriggerService.js`
- `server/src/services/notificationScheduler.js`
- `server/src/services/reminderService.js`
- `server/src/routes/payments.js` (Stripe webhook handler)
- `server/src/jobs/dailyNotificationCheck.js`
- `server/src/jobs/renewalReminderJob.js`

If a user-reported issue could be solved by editing one of these files, STOP and surface that to Ke as a recommendation. Do not unilaterally edit them.

## Destructive Database Scripts — Never Run Without Explicit Confirmation

The following scripts perform mass deletes from production data. They MUST NOT be invoked without an explicit, written instruction from Ke containing the exact script name and the words "run in production":

- `server/src/scripts/selectiveWipe.js`
- `server/src/scripts/bulkRebuildCourses.js` — **quarantined**. Overwrites course content via the Anthropic API and historically dropped block types whose names weren't in its `VALID_BLOCK_TYPES` Set. The script now refuses to run without `--i-acknowledge-data-risk`. Even with the flag, it overwrites content for whichever courses it processes — back up the collection first.
- Any script containing `deleteMany` against `interactivecourses`, `interactivecourseprogresses`, `users`, `usercredentials`, `notifications`, `useractivities`, `payments`, or `certificates`
- Any `cleanup*.js`, `reset*.js`, `purge*.js`, or `wipe*.js` script in `server/src/scripts/`

Creating or refactoring such scripts is allowed; running them is not. If you find yourself about to run one, stop and ask.

## Activity Tracking Wiring — Always Use logActivity

When adding new user-facing endpoints (purchases, signups, tool usage, content generation, etc.), the corresponding activity event MUST be logged via `logActivity()` from `activityTrackingService.js`. Never call `UserActivity.create()` directly, and never write a one-off `Resend.emails.send()` for admin notifications. The central service handles persistence, admin feed, and email alerts uniformly.

## Technical Manual Governance (MANDATORY — applies to every session)

The repo's technical knowledge lives in a three-tier system designed so that no
single chat session needs to hold all prior corrections. Follow these rules in
EVERY session, without exception:

### TIER 1 — Generated facts (`BLOCK_FIELD_REFERENCE.md` and any future generated refs)
- These files are produced by scripts in `server/src/scripts/` (e.g.
  `generateBlockFieldReference.js`). They are the authoritative field-name source.
- **Before writing or editing any course block, seed, or builder media code, READ
  `BLOCK_FIELD_REFERENCE.md`.** It reflects the actual viewer render functions and
  overrides GOLD_STANDARD_SPEC.md and any other doc on field names.
- **After ANY change to a block render function in `interactive-course.html` or to
  block fields in `InteractiveCourse.js`, regenerate the reference:**
  `node server/src/scripts/generateBlockFieldReference.js`
  and include the regenerated file in the same PR. Do NOT hand-edit it.

### TIER 2 — Human-owned governance (in `TECH_MANUAL.md`, the section so marked)
- **Never modify, rewrite, summarize, condense, reorder, or "improve" Tier 2.**
  It contains Ke's rulings (architecture, compliance, roadmap), not observations.
- If code appears to contradict a Tier 2 ruling, **FLAG it to Ke in your PR summary.
  Do NOT edit the manual to match the code.** Rulings outrank code; a contradiction
  means either the code is wrong or the ruling needs Ke's explicit update.

### TIER 3 — Discovery log (in `TECH_MANUAL.md`, append-only)
- When a session uncovers something architectural (a gotcha, a field mismatch, a
  non-obvious constraint), **APPEND a dated entry** at the bottom of the Tier 3 log:
  `### YYYY-MM-DD — short title` + 1–3 sentences.
- **Never rewrite, delete, or reorder existing Tier 3 entries.** Append only.
- Do not promote entries to Tier 1/2 yourself — that is Ke's call.

### Enforcement checklist for PRs that touch blocks, seeds, the builder, or the viewer
- [ ] Read `BLOCK_FIELD_REFERENCE.md` before coding
- [ ] Regenerated it if render fns or schema fields changed (file included in PR)
- [ ] Did not touch Tier 2; flagged any code/ruling contradiction instead
- [ ] Appended a Tier 3 entry if a new gotcha/constraint was discovered
- [ ] Verified with raw `grep`/`wc`/`git diff --stat` (CC self-reports are not trusted)

---

## Batch Course Generation
When Ke says "generate courses", "next batch", "run week N", "next 10", or gives a topic + CE hours + count:
1. Read `docs/BATCH_COURSE_GENERATION.md` — follow end-to-end
2. Read `docs/COURSE_PRODUCTION_QUEUE.md` — find next pending week
3. Generate all 10 courses autonomously. No pausing. No confirmation between courses.
4. Update queue status. Commit to feature branch.
