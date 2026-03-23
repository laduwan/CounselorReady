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

## Active Feature Status (as of March 2026)

| Feature | Backend | Frontend | Prompt |
|---|---|---|---|
| RNR CE (Researched-N-Ready) | ✅ Complete | 🔧 Gap-fill (10 tasks) | v2 prompt |
| Extend Trial +3 days | 🔧 Needs route | 🔧 Needs button | Prompt ready |
| Certificate tile (article CE) | 🔧 Needs rnrMeta | 🔧 Needs tile variant | In RNR v2 |
| CE Planner RNR block | ✅ Route exists | 🔧 Needs UI block | In RNR v2 |
| CourseViewer | ✅ Locked | ✅ Locked | Do not touch |
| Auth / Payments / Courses | ✅ Locked | ✅ Locked | Do not touch |
