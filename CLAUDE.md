[CLAUDE(4).md](https://github.com/user-attachments/files/26329659/CLAUDE.4.md)
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
### Backend models — locked
- `server/src/models/User.js` — do not add, remove, or rename fields unless task names it
- `server/src/models/Course.js` — do not touch
- `server/src/models/Certificate.js` — do not touch unless task names it
- `server/src/models/UserCourseProgress.js` — do not touch
### Frontend components — locked (fully)
- `client/src/components/CourseViewer.jsx` — NEVER TOUCH. This is the core course player.
- `client/src/components/CourseBuilder.jsx` — NEVER TOUCH.
- `client/src/components/Layout.jsx` — do not touch unless task names it
- `client/src/components/AccessibilityProvider.jsx` — do not touch
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
Every task should be on its own branch:
```
git checkout -b task/<short-description>
```
Show a diff summary before committing. If you touched a file not in the task list, revert it before committing.
---
## When In Doubt
Stop. Ask. Do not guess, do not approximate, do not "make it work" by changing something adjacent. The cost of asking is zero. The cost of unwiring a stable feature is high.
---
## Dead Code Audit (P1-T1 — March 2026)

### `server/src/services/researchSynthesis.js`
**Status: UNREFERENCED DEAD CODE — distinct function, not a duplicate.**
- Purpose: Uses Anthropic Claude to perform meta-analysis and comparative analysis of multiple scholarly articles, then generates full CEU course content (4 modules, 15+ questions).
- Functions: `synthesizeMetaAnalysis()`, `synthesizeComparativeAnalysis()`, `generateCourseFromSynthesis()`
- NOT a duplicate of `openAlex.js` — openAlex.js is a search/fetch service; this is a synthesis/content-generation service.
- Not imported or referenced anywhere in the codebase (grep confirms zero references).
- Candidate for future "Research Synthesis" advanced feature but currently unused.
- **Do not delete** — flag for product review.

### `server/src/services/scholarlySearch.js`
**Status: UNREFERENCED DEAD CODE — wrapper around openAlex.js + CrossRef, not a duplicate.**
- Purpose: Unified search across CrossRef AND OpenAlex APIs with deduplication by DOI/title.
- Functions: `searchScholarlyDatabases()`, `fetchArticlesForSynthesis()`
- Imports from `openAlex.js` (uses `searchArticles` and `decodeAbstractInvertedIndex`).
- NOT a duplicate — it EXTENDS openAlex.js by adding CrossRef as a second data source.
- Not imported or referenced anywhere in the codebase (grep confirms zero references).
- Candidate for future multi-source search but currently unused.
- **Do not delete** — flag for product review.

### Route Guard Audit (P1-T7)
- Learner routes with auth middleware: `/search`, `/request`, `/my-requests`, `/request/:id`, `/request/:id/content`, `/request/:id/complete`, `/recommendations`, `/saved`, `/engagement/:courseId`
- Admin routes with auth + requireAdmin: `/currency-check`, `/build-ce`, `/queue`, `/request/:id/approve`, `/request/:id/reject`, `/request/:id/rebuild`, `/request/:id/status`
- All routes properly guarded as of this audit.

---
## Active Feature Status (as of March 2026)
⚠️ This table is manually maintained. Do not treat it as authoritative — verify actual file state before assuming status.

| Feature | Backend | Frontend | Prompt |
|---|---|---|---|
| RNR CE (Researched-N-Ready) | ✅ Complete | 🔧 Gap-fill (10 tasks) | v2 prompt |
| Extend Trial +3 days | 🔧 Needs route | 🔧 Needs button | Prompt ready |
| Certificate tile (article CE) | 🔧 Needs rnrMeta | 🔧 Needs tile variant | In RNR v2 |
| CE Planner RNR block | ✅ Route exists | 🔧 Needs UI block | In RNR v2 |
| CourseViewer | ✅ Locked | ✅ Locked | Do not touch |
| Auth / Payments / Courses | ✅ Locked | ✅ Locked | Do not touch |

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
