[CREADY-VIEWER-ARCHITECTURE.md](https://github.com/user-attachments/files/27072748/CREADY-VIEWER-ARCHITECTURE.md)
# CReady™ Viewer — Architecture & Diagnostic Reference

**File:** `client/public/interactive-course.html`
**Size:** ~6,300 lines (single file: HTML + CSS + JS)
**Owner:** GAITP LLC · CounselorReady™
**Status:** Live, production. Canonical course player.

---

## 0. Read This First

This document describes the **active** course viewer. There is also a doc called `COURSEVIEWER-ARCHITECTURE.md` in the repo — that one describes a **deprecated React playback path** (`/learn/:slug` → `CourseViewer.jsx`) that production traffic does not use. Do not confuse the two.

If you are about to edit the viewer, the rule is: **surgical only, no refactoring, no file split, no React migration.** The single-file architecture is intentional.

---

## 1. Why a Single Static File

The platform's first viewer was a ready-built React component (`CourseViewer.jsx` + `/learn/:slug` route). It stripped course content during rendering and limited layout flexibility — author intent was lost between the database and the screen.

`interactive-course.html` was built to replace that system with a viewer Ke fully controls. The constraints baked into this design:

- **No build step** — file deploys as-is from `client/public/` to Render. Edits go live the moment the static site rebuilds.
- **No React** — rendering is direct DOM manipulation. No virtual DOM, no component tree, no hydration.
- **No external runtime dependencies** — fonts pull from Google Fonts; everything else is in the file. This is required for the licensing / white-label product positioning.
- **No content stripping** — the viewer renders what the database holds, including raw HTML in text blocks.

That last constraint is the source of most layout fragility (see §11).

---

## 2. Entry & Boot Sequence

User arrives via one of these paths — all converge on `interactive-course.html`:

| Path | How it lands here |
|---|---|
| Layout nav → Browse Courses | `/courses.html` (static catalog) → click → `/interactive-course.html?slug=X` |
| Course detail page | `/course-details.html?slug=X` → Start Course → `/interactive-course.html?slug=X` |
| Old direct link | `/course-player.html?slug=X` → 13-line redirect → `/interactive-course.html?slug=X` |
| Old direct link | `/course-player-unified.html?slug=X` → 4-line redirect → same |

URL params: `?slug=X` (preferred) or `?id=X`.

Boot sequence:
1. Read `slug` or `id` from `window.location.search`.
2. Read JWT from `localStorage.getItem('token')`. If missing → redirect to `/login.html?redirect=...`.
3. `GET /api/interactive-courses/slug/{slug}` (or `/{id}`) with `Authorization: Bearer ${token}`.
4. Server returns `{ success: true, data: courseDoc }`. Client unwraps with `data.data || data`.
5. Hide loading screen, render the first section, build the section nav, check certificate eligibility.

**API base:** `https://api.counselorready.com` in production, `http://localhost:5000` in dev.

---

## 3. Block Render Pipeline

Every visible piece of course content is a "block." The contract is:

```javascript
// Each block lives inside a section, which lives inside the course
course.sections[i].contentBlocks[j] = { type: "text", content: "...", ... }
```

The dispatcher is `renderBlock(block, index)` at line ~3041. It:

1. Creates a wrapper `<div class="cr-block" data-block-type="{type}" data-block-index="{i}">`.
2. Applies optional `block.accessibility.{ariaLabel,role}` to the wrapper.
3. Switches on `block.type` and calls the matching renderer.
4. Each renderer writes its HTML via `wrap.innerHTML = '...'`.

### 3.1 Block types the viewer renders

The seed-script spec lists 17 valid types. The viewer renders **22** — the 17 documented plus 5 forgiveness aliases for legacy data:

| Documented (17) | Forgiveness aliases (5) |
|---|---|
| `sectionDivider`, `text`, `imageText`, `image`, `accordion`, `resources`, `videoEmbed` | `deliverables` (→ resources), `video` (→ videoEmbed) |
| `multipleChoice`, `multiSelect`, `matching`, `cardSort`, `sequencing`, `timeline` | `knowledgeCheck` (still rendered despite spec saying it's banned) |
| `reflection`, `scenarioTree`, `flashcardDeck`, `hotspot` | `quiz`, `callout`, `fillInBlank`, `keyTakeaway` |

**Implication:** seed scripts that emit `knowledgeCheck` or `quiz` blocks won't crash — they render. But they're discouraged because they couple courses to viewer-specific forgiveness branches that may be removed later.

### 3.2 Event delegation

User actions (option clicks, accordion toggles, flashcard flips, scenario choices) are not wired with `onclick=` attributes. A single delegated listener at line ~5820 reads `data-action` attributes and dispatches:

```html
<button data-action="selectMC" data-target="mc-3" data-idx="2">…</button>
```

This means **adding a new interaction requires adding a `case` in the delegated switch** — not just an event handler.

---

## 4. State Model

State lives in module-scope `let` variables, not a store. The active set:

| Variable | Holds |
|---|---|
| `course` | The full course object from the API |
| `currentSectionIndex` | Which section is visible (0-based) |
| `completedBlocks` | `Set` of block indices the learner has interacted with |
| `crTimerElapsed` / `crTimerRequired` | Time-on-section enforcement |
| `assessmentTimer`, `timeRemaining`, `assessmentAttempt`, `assessmentAnswers`, `shuffledQuestions` | Final exam state |

`saveProgress()` (line ~5599) syncs to the backend; `localStorage` carries the timer across page reloads.

### 4.1 LocalStorage keys

| Key | Purpose |
|---|---|
| `token` | JWT — set by login, read on every API call |
| `cr_timer_{courseId-or-slug}` | Seconds elapsed on the time-enforced timer |
| `{base}-{key}` (where base is course-scoped) | Per-course preferences (a11y settings, etc., via `saveProgress`) |

---

## 5. Markdown Parsing Layer

Two parsers handle text:

- `mdInlineParse(str)` — inline only: `**bold**`, `*italic*`, `` `code` ``. Returns a single-line HTML fragment with no block tags.
- `mdBlockParse(text)` — block-level: paragraphs, `<ul>`, `<table>`, `<blockquote>`, `<h3>`, `<h4>`. Returns a multi-line HTML fragment. Auto-closes lists/tables at end of input.

Both are home-grown (no `marked` or `markdown-it`). They are minimal and have known edge cases — see §11.

The `text` block specifically does **not** call the markdown parser. It runs `block.content` through `parseCalloutSyntax` (which is mostly pass-through with callout-syntax expansion) and emits straight to `innerHTML`. That means `text` blocks expect their content to already be HTML, not markdown.

---

## 6. CSS System (cr-* namespace)

All viewer styles use the `cr-*` prefix. The system inside the file:

- **Design tokens** — top of `<style>`: `--cr-burgundy`, `--cr-green`, `--cr-gold`, `--cr-navy` (= `#284157`), `--cr-stone`, `--cr-eggshell`, `--cr-text`, `--cr-text-muted`, plus typography tokens (`--cr-font-display` = Cormorant Garamond, `--cr-font-body` = Lato).
- **Block styles** — `.cr-block`, `.cr-section-divider`, `.cr-prose`, `.cr-card`, `.cr-flashcard*`, `.cr-scenario*`, `.cr-matching*`, `.cr-cardsort*`, etc.
- **Accessibility variants** — `.cr-large-text`, `.cr-high-contrast`, `.cr-dark-mode`, `.cr-dyslexia-font`, `.cr-reduced-motion`, etc. — toggled by adding/removing classes on `<body>` or a wrapper.
- **Course content scope** — `.cr-prose` wraps user-authored HTML so heading/paragraph styles only apply to course content, not viewer chrome.

**Eggshell `#F5F5DC` background applies only to the course-content area inside this viewer.** Do not propagate it to admin pages, settings, or anywhere else.

---

## 7. The 19 Accessibility Features

Live and shipped. Toggles persist via the storage layer in §4.1.

1. Text size · 2. Line spacing · 3. High contrast · 4. Dark mode · 5. Dyslexia font (OpenDyslexic) · 6. Read aloud + TTS · 7. Reduced motion · 8. Enhanced focus · 9. Reading guide · 10. Color vision filters · 11. Chunked reading · 12. Keyboard shortcuts · 13. Search course · 14. Glossary · 15. Focus not obscured · 16. Voice feedback · 17. Translation · 18. Bookmarks · 19. Notes

Each feature is wired into the same delegated event system in §3.2. The settings panel's data-action values match the function names.

---

## 8. Communication With the Parent Page

When the viewer is iframed (e.g., embedded inside a custom shell), it speaks `postMessage`:

| Message | Direction | Meaning |
|---|---|---|
| `{ type: 'COURSE_LOADED', title, sections }` | viewer → parent | Sent on successful course load |
| `{ type: 'REQUEST_CERTIFICATE' }` | viewer → parent | User clicked the certificate button — parent triggers cert generation |
| (future progress events) | viewer → parent | Progress sync points are emitted via `postMessage` |

Standalone (non-iframed) deployments: the certificate button shows an alert telling the user it only works when embedded.

---

## 9. Files That Touch This One

If you change something in `interactive-course.html`, consider whether these need to change too:

- `client/public/courses.html` — catalog page; emits `<a href="/interactive-course.html?slug=...">` links
- `client/public/course-details.html` — detail page; calls `window.location.href = '/interactive-course.html?slug=' + slug` after enroll
- `client/public/course-player.html`, `course-player-unified.html` — redirect shells, point here
- `server/src/routes/interactiveCourseRoutes.js` — the API the viewer calls (`getCourse`, `saveProgress`, `submitAssessment`, etc.)
- `server/src/models/InteractiveCourse.js` — the schema; if a new block type is rendered here, the schema must allow it

---

## 10. What This File Is NOT

- **Not React.** Do not propose a React rewrite. Do not extract logic into `client/src/`. The whole point is no React.
- **Not split into multiple files.** `cready-viewer.html`, `cready-viewer.css`, `cready-viewer.js` do not exist. A split was scoped but never executed. Any prompt or doc that names those files is stale.
- **Not legacy.** It is the live production viewer. The legacy is `CourseViewer.jsx` and the `/learn/:slug` route, which production users do not hit.
- **Not the only `interactive-course.html` in the repo.** A 2,902-line orphan exists at `client/src/components/interactive-course.html` (not imported anywhere) and a 2,674-line `interactive-course-legacy.html` exists at `client/public/`. Leave both alone.

---

## 11. ADA Controls — Persistence & Reachability (WCAG 2.1 AA)

This is the section to read first when you see "the accessibility button got covered" or "a11y panel disappeared behind a modal." It is the highest-priority fragility in the viewer because it has compliance implications.

### 11.1 What the controls are

The 19 a11y features (§7) are accessed through:

- **`.cr-a11y-toggle`** — the floating ♿ button at `position: fixed; bottom: 24px; right: 24px;` (line ~424).
- **`.cr-a11y-panel`** — the settings panel at `position: fixed; bottom: 88px; right: 24px;` (line ~438).

Both are at **`z-index: 50`** in the current file.

### 11.2 Why they get bumped

The viewer has a stacking hierarchy that buries the a11y controls under almost every other overlay:

| z-index | Layer | Buries the a11y controls? |
|---|---|---|
| 99999 | Banner notifications | Yes |
| 10000 | Settings modal, generic modals | Yes |
| 9999 | Subscription gate (`#crGateSubscription`), course gate | Yes |
| 91 | Annotation panel | Yes |
| 89 | Annotation backdrop | Yes |
| 80 | Search / notes panel | Yes |
| 60 | Toolbar (specific) | Yes |
| **50** | **A11y toggle + panel** (current) | — |
| 49 | Reading-guide overlay | No |
| 40 | Sidebar | No |
| 30 | Topbar | No |

A learner who needs high contrast or dyslexia font activated **cannot reach the toggle** while a gate, banner, or auxiliary panel is showing. This is a WCAG 2.1 AA compliance risk (SC 2.4.3 Focus Order, SC 2.5.5 Target Size, and the principle of always-available assistive controls).

### 11.3 Secondary cause — stacking context contamination

A content block that contains CSS `transform`, `filter`, `perspective`, or `will-change` creates a new stacking context. If a `text` block from a docx import smuggles those properties in (via a copied-in `style=` attribute), `position: fixed` elements added later in the document can be trapped in the contaminated parent's stacking context. They will appear lower in the visual stack than their declared `z-index` should produce.

The viewer renderers do not strip inline `style=` attributes (no sanitization — see §10's reasoning). This means a malformed import can break a11y reachability without any error in the console.

### 11.4 Symptoms → cause

| Symptom | Cause | Fix |
|---|---|---|
| ♿ button vanishes when banner appears | a11y `z-index: 50` is below banner's `99999` | Raise a11y to `99998` (see §11.5) |
| ♿ button gone during subscription/course gate | a11y below gate's `9999` | Same |
| Panel opens behind search/annotation overlay | a11y below overlay's `80–91` | Same |
| Panel positions correctly but is partially clipped | `body.cr-has-timer` class adjusting `bottom` is stuck on after timer ends | Verify `body.cr-has-timer` is removed when timer completes |
| ♿ button shifts up oddly mid-section | iOS Safari on-screen keyboard reflowing fixed elements | Known platform behavior; accept or detect & re-pin |
| ♿ button appears, but clicks don't open the panel | Stacking context contamination from content above | Search the section's text blocks for inline `style=` containing `transform`, `filter`, `perspective`, `will-change` |
| Panel opens at wrong vertical position | Timer widget visible but `cr-has-timer` class not applied | Check `<body>` for the class; check the timer activation path |

### 11.5 The fix

Raise the a11y controls above all overlay layers except the system banner, and isolate their stacking context so content cannot poison it.

```css
/* Append inside the existing <style> block in interactive-course.html */
.cr-a11y-toggle,
.cr-a11y-panel {
  z-index: 99998;        /* above all gates, modals, panels; below banner only */
  isolation: isolate;    /* protect against parent stacking-context contamination */
}
```

This is purely additive (no rule removed), respects the banner-on-top hierarchy, and uses `isolation: isolate` to guarantee the controls render in their own compositing layer regardless of what content above them does.

### 11.6 Pre-built CC task prompt for ADA fragility

Paste this when reporting "a11y controls disappeared":

> The accessibility toggle (`.cr-a11y-toggle`) and panel (`.cr-a11y-panel`) in `client/public/interactive-course.html` are at `z-index: 50`, which is below most overlay layers (gate modals at 9999, search/notes panels at 80, etc.). Per `CREADY-VIEWER-ARCHITECTURE.md` §11, this buries the controls and creates a WCAG 2.1 AA reachability issue.
>
> Apply the §11.5 patch and only that patch. No other edits.
>
> 1. Open `client/public/interactive-course.html`.
> 2. Locate the existing `.cr-a11y-toggle` rule (around line 424).
> 3. Append the §11.5 CSS block at the end of the existing `<style>` block, before `</style>`.
> 4. Do NOT modify any existing rule. Do NOT change other z-index values.
> 5. Verify with grep before claiming done:
>
> ```bash
> grep -n "z-index: 99998" client/public/interactive-course.html
> grep -n "isolation: isolate" client/public/interactive-course.html
> git diff --stat main
> ```
>
> Diff stat must show exactly one file changed. Paste raw output of all greps in the PR.

### 11.7 Long-term: validate ADA persistence in CI

The viewer should never ship a state where the ♿ button can be buried. A future scoped task: add a Playwright test that opens each overlay/modal in turn and asserts the a11y toggle is hit-testable (`page.locator('.cr-a11y-toggle').isVisible()` after the overlay is open, plus a `boundingBox` check that it sits inside the viewport). That is out of scope for an emergency fix; tracked here as the right structural answer.

---

## 11A. Layout Fragility — Activity Options (separate issue)

This is a *different* fragility from §11, kept for completeness because it does happen with malformed content.

### 11.1 The root cause class

The viewer **does not sanitize HTML.** Every renderer writes content via `wrap.innerHTML = ...`. When `block.content` contains malformed HTML — typically from a `.docx` import or a seed script that didn't escape something — the browser's DOM parser does its best, which means:

- Unclosed `<div>`, `<p>`, `<strong>`, `<em>`, `<a>` tags get auto-closed at unexpected points.
- An unclosed inline tag inside one block can leave a styling state that bleeds into the next sibling block visually (even though they're in separate `cr-block` containers, CSS like `.cr-prose + .cr-prose { margin-top: ...}` and shared tokens can be affected).
- Activity blocks that use CSS Grid (`matching`, `cardSort`, `sequencing`) are most vulnerable: if the prior text block left a broken inline element open, the grid's `grid-template-columns` can compute against the wrong width and options shift left/right or overlap.

### 11.2 Symptoms → likely cause

| Symptom | Most likely cause | Where to look |
|---|---|---|
| Matching options stacked or overlapping | Unclosed `<strong>` / `<em>` in the prior `text` block | `course.sections[N].contentBlocks[M-1].content` for unbalanced inline tags |
| Card-sort cards appear in the wrong column | Unclosed `<div>` in any block above it in the same section | grep for `<div` and `</div>` counts in each `text` block |
| MC options indented or italic for no reason | Inline tag bled in from a previous block | Look for `<em>`, `<i>`, `<blockquote>` without close tag |
| Whole section renders as one big italic block | A blockquote in a text block doesn't have a closing `</blockquote>` | Section's first malformed block — usually a converted .docx pull-quote |
| Section nav highlights right section but content shows wrong section | Stale `currentSectionIndex` from a state bug — separate from the HTML issue | Open DevTools, check `currentSectionIndex` value |
| Bullet list breaks across two adjacent blocks | `mdBlockParse` was given content that splits across blocks | Author error: list should be in one block |
| Tables render with no borders | Inline `style=` was stripped by an upstream processor | Check `course.sections[N].contentBlocks[M].content` for full table HTML |

### 11.3 Diagnostic shortcut for a CC session

When opening a "fix layout" task, run these against the offending course **before any code edit**:

```bash
# Find the course in the DB
COURSE_SLUG="<slug-from-url>"

# 1. Pull the course doc as JSON, identify the section that breaks
# (use mongo shell or a one-off node script — never edit data directly)

# 2. For each text block in that section, check tag balance:
#    For every block.content, count opening and closing tags of
#    div, p, strong, em, blockquote, ul, ol, li, table, tr, td, span, a
#    Any non-zero delta is the suspect.
```

The fix is **always** on the data side, not the viewer side. Re-run the seed with corrected content. Do not patch the viewer to "tolerate" malformed HTML — that path leads to silent data corruption and viewer logic that drifts further from spec.

### 11.4 Pre-built CC task prompt for layout bumping

Paste this as the task prompt when you report "options bumped" to CC:

> Course `<slug>` has bumped/misaligned activity options on section `<N>` in `interactive-course.html`. Per `CREADY-VIEWER-ARCHITECTURE.md` §11, this is almost certainly malformed HTML in a `text` block above the activity (unclosed inline tag from a docx import).
>
> Do NOT edit `client/public/interactive-course.html` or any viewer code. Edits here cause data drift.
>
> Instead:
> 1. Pull the course doc from `interactivecourses` collection in Mongo. Print `course.sections[<N>].contentBlocks[*].content` for the broken section.
> 2. For each text block in that section, count opening vs closing tags for: div, p, strong, em, blockquote, ul, ol, li, table, tr, td, span, a. Report any non-zero delta.
> 3. Identify which seed script produced this course. Open it and find the matching block.
> 4. Patch the seed script's content (close the unbalanced tag), re-run the seed, confirm fix.
> 5. Paste raw grep / diff output of the seed script change before claiming done.
>
> Do not write a "data migration" script. Do not modify the viewer to be more forgiving. Fix the seed and re-run.

---

## 12. Forbidden Patterns (Things That Have Hurt Us Before)

- **Editing `interactive-course.html` to "tolerate" bad data.** Always fix the data.
- **Adding a new block type to the renderer without updating the schema in `InteractiveCourse.js`.** Either both, or neither.
- **Splitting the file** (extracting CSS, JS, or sections to separate files). The single-file architecture is licensing-relevant.
- **Migrating to React** because "it would be cleaner." Reject reflexively.
- **Removing emoji from the file in one pass without scoped review.** Some emoji are inside `mdBlockParse` special-case branches (📋 ⚡ 🪞 📊 🔀 ✓ ✗) and removing them changes content rendering. Strip emoji per task, with verification.
- **Treating `client/src/components/interactive-course.html` or `interactive-course-legacy.html` as canonical.** Both are dormant. The file at `client/public/interactive-course.html` is the only one that runs.

---

## 13. Out of Scope: COURSEVIEWER-ARCHITECTURE.md

The repo has a doc named `COURSEVIEWER-ARCHITECTURE.md`. It describes the legacy React playback path that this static viewer replaced. It is **not** a description of `interactive-course.html`.

**Recommendation:** rename it to `LEGACY-REACT-VIEWER.md` with a banner at the top stating "This describes a deprecated playback path. The live viewer is documented in `CREADY-VIEWER-ARCHITECTURE.md`." Or delete it. Do not let it accumulate authority — it has misled at least three Claude sessions to date.

---

*Last verified against repo HEAD `7e9ae20`, file size 6,329 lines.*
*If this doc and the file disagree, the file wins. Update this doc.*
