# CounselorReady — Claude Prompt Cheat Sheet
_Last updated: June 2026_

---

## Before Any Code Changes
"Read the actual files before writing anything. Show me what you found, then propose changes."

## Before Route/Wiring Work
"Check the repo first — read index.js and the route files before touching anything."

## Before Replacing Files
"Diff against what exists — compare your output to current code before replacing."

## When Something Seems Off
"Don't assume, grep — search the actual codebase instead of working from memory."

## Before Generating Anything
"Show me your findings before generating."

## After Uploading Files
"I uploaded [file]. Read it first, summarize what you see, then we'll decide what to do."

## For Audit Script Changes
"Test your endpoint paths against the actual route files before adding them to the script."

## Before Writing Any Seed Script
"Seed scripts write to `interactivecourses` — never `courses`. Use `sections[].contentBlocks[]` — never `modules[]` or `lessons[]`. Only the 17 valid block types. No `knowledgeCheck` wrappers — expand into individual `multipleChoice` blocks. No `quiz` blocks in sections — the exam goes in the top-level `assessment` object. Options are always `[{text: String, isCorrect: Boolean}]` with `correctAnswer: Number` — never flat string arrays. No migration scripts — fix the seed and re-run it."

## Before Writing Any Migration Script
"Stop. Don't write a migration script. Fix the seed script instead and re-run it. Migration scripts have broken courses every time they've been used."

## Before Proposing Option Format Changes
"Options format is `options: [{text: '...', isCorrect: false}, {text: '...', isCorrect: true}]` with optional `correctAnswer: Number` (index). **Never flat `['A','B','C']` string arrays** — flat strings cause Mongoose char-explosion. This is the canonical format per `server/src/models/InteractiveCourse.js`."

---

## CRITICAL RULES — READ BEFORE TOUCHING ANYTHING

### Route Registration
- **All routes are registered in `server/src/index.js`.** Do NOT add, remove, or rewrite any `import` or `app.use()` line without including ALL existing routes. Count route mounts before and after your edit. If the count drops, you broke something.
- **Never rewrite index.js from scratch.** Only add new lines. The startup integrity check will catch regressions.
- Route file `interactiveCourseRoutes.js` is the FULL course pipeline — minimum 1518 lines enforced (currently ~1578). `courseRoutes.js` is a STRIPPED legacy version. The import MUST point to `interactiveCourseRoutes.js`. **Never go below the line floor. Never rewrite.**

### Protected / Sacred Files — Never Rewrite
- **`client/public/interactive-course.html`** — the live CReady Viewer. Single-file HTML/CSS/JS (~8300+ lines). Do NOT split, extract CSS, extract JS, or rewrite. Only targeted `str_replace` on specific blocks. This is the production playback path.
- **`server/src/routes/interactiveCourseRoutes.js`** — minimum 1518 lines enforced. Never rewrite.
- **`server/src/models/InteractiveCourse.js`** — canonical schema. Changes affect all 60+ live courses. Confirm before touching.
- **`client/index.html`** — Vite React entry. Must always contain `#root` and `/src/main.jsx`. Never overwrite with marketing HTML.

### Viewer Architecture
- **Production player:** `client/public/interactive-course.html` — static HTML served directly.
- **`CourseViewer.jsx` (3749L)** — legacy React component. Do NOT extend or fix. Leave to die.
- **`course-player.html`, `course-player-unified.html`, `courses-unified.html`** — redirect shells only, not players.
- **`/learn/:slug` React route** — points to legacy CourseViewer.jsx. Non-functional for playback. Do not repair.
- **Two `index.html` files exist:** `client/index.html` (React/Vite entry) and `client/public/index.html` (static landing). Architecture documented in `CLAUDE.md`.

### JavaScript Syntax Validation for Viewer Edits
- `node --check client/public/interactive-course.html` **does not work** in Node 22 — the runtime rejects `.html` extensions before reading content.
- **Correct pattern:** Extract the changed JS block to a temp `.js` file, then validate:
  ```bash
  # After editing CALLOUT_LIBRARY, PILL_COLORS, etc.:
  sed -n '4930,5000p' client/public/interactive-course.html > /tmp/check_block.js
  node --check /tmp/check_block.js
  ```
- For full embedded script extraction:
  ```bash
  sed -n '/<script>/,/<\/script>/p' client/public/interactive-course.html > /tmp/viewer_js.js
  node --check /tmp/viewer_js.js
  ```

### Icons — No Font Awesome
- **Never add Font Awesome CSS links.** CSP blocks them and emoji render as empty boxes.
- **Use `cr-icons.js`** — all pages load `<script src="/js/cr-icons.js"></script>` before `</body>`. It auto-replaces `<i class="fas fa-xxx">` with inline SVGs.
- **For new icons in templates/JS**, keep using `<i class="fas fa-whatever">` — cr-icons.js will replace them. Or use inline SVGs directly.
- **Never use emoji in buttons or UI elements.** They render as garbled characters or giant empty boxes. Tab icons must be inline SVGs.

### Fonts
- Display/headings: `Cormorant Garamond` (never Merriweather)
- Body: `Lato` (never Source Sans)
- DOCX output: Georgia (headings), Calibri (body)

### Colors — ONLY these hex values
- Burgundy: `#6B1D34` (H1, logo, CTAs)
- Hunter Green: `#4A7C59` (H2, buttons, nav)
- Honey/Gold: `#D4A855` (accents, badges — never on "CounselorReady" wordmark)
- Navy: `#284157` (H3, secondary text, footers)
- Stone: `#F8F7F4` (page backgrounds — all pages except viewer)
- Eggshell: `#F5F5DC` (course viewer content area ONLY — never admin/dashboard/nav)
- **NEVER use:** `#34495E` (old Navy — deprecated), `#40634A`, `#34503D`

### Logo Rules
- "CounselorReady" = two separate spans/runs: "Counselor" + "Ready"
- On light backgrounds: Counselor = `#6B1D34` (burgundy), Ready = `#4A7C59` (hunter green)
- On burgundy backgrounds: Counselor = `#D0768A` (rose), Ready = `#4A7C59`
- CR monogram: C (`#6B1D34`, larger, z-top) dominant; R (`#4A7C59`, smaller) drops 5px, shifts 6px left. Font: Cormorant Garamond bold. Box: 36px burgundy gradient rounded square.
- Never single-color, never gold on the wordmark

### Frontend Access Checks
- `checkUserAccess()` must accept `status: 'active'`, `'trial'`, AND `'lifetime'`
- Enrolled users always get access regardless of tier
- Individual purchases (`purchasedCourses`) bypass tier checks
- Tier levels: free=0, starter=1, professional=2, premium=3, vip=4, annual_vip=4, lifetime=4

### MutationObservers
- **Tailwind CDN has its own MutationObserver.** Any page-level observer that modifies DOM on every mutation will infinite-loop with Tailwind.
- Always debounce MutationObservers with `setTimeout(fn, 150+)`.
- Never inject DOM elements inside an observer callback without a guard (`if (el.dataset.replaced) return`).

### Admin Pages
- `limit=200` for course listing fetches (50 causes pagination hangs)
- `status=all` parameter needed to show drafts alongside published
- No legacy `GET /api/admin/courses` fetch — all courses are in `interactivecourses` collection

### Render Shell
- Port is 10000 (not 5000) — `curl http://localhost:10000/health`
- Working dir: `~/project/src/server`
- Run scripts: `node src/scripts/[filename].js`
- For inline scripts: enter `node` REPL first, then paste JS
- `!` and `$` characters break `node -e` and bash heredocs — use `python3 -c "open('file','w').write(...)"` for file creation instead
- Paste limits corrupt multi-line JS in the shell — use the Python open/write pattern for any file >20 lines
- `node --check filename.js` validates syntax without connecting to MongoDB — use on `.js` files only (see Viewer section above for `.html` workaround)

### Collections
- `interactivecourses` = active canonical (all courses live here — 60+ published)
- `courses` = legacy/empty (do not wire frontend to this, do not seed into this)
- `usercourseprogresses` = progress tracking (lowercase pluralized)
- Scripts run from `~/project/src/server` as `node src/scripts/[filename].js`
- Seed naming convention: `CourseCode-CourseTitle-WordCount.js`

### Seed Script Options Shape — CANONICAL
```js
// CORRECT — always this shape
options: [
  { text: 'Option A', isCorrect: false },
  { text: 'Option B', isCorrect: true },
  { text: 'Option C', isCorrect: false },
]
// correctAnswer: 1  ← optional index, include anyway

// WRONG — flat strings cause Mongoose char-explosion
options: ['Option A', 'Option B', 'Option C']  // ❌ NEVER
```

### Seed Script Block Field Names — Canonical (Gold Standard spec is WRONG on these)
| Block type | Wrong (spec) | Correct (schema/viewer) |
|---|---|---|
| `flashcardDeck` | `cards: [{...}]` | `flashcards: [{id, front, back}]` |
| `matching` | `pairs`, `left`/`right` | `matchingPairs: [{term, definition}]` + `matchingInstructions` |
| `scenarioTree` | `scenario.choices` | `scenarioTitle + startNode + nodes: {dict}` |
| `cardSort` | `items` | `cards: [{id, text, correctCategory}]` |

### Inline Callout Syntax (viewer feature — use in `text`/`imageText` blocks)
- `{{callout:id}}` → styled pill with tooltip (works in `text` and `imageText` content only)
- `{{alert:type}}` → inline alert badge
- Does NOT work in: accordion bodies, MC options, scenario tree text, final exam questions
- IDs defined in `CALLOUT_LIBRARY` at line ~4930 in `interactive-course.html` (56 entries as of June 2026)
- Custom per-block callouts: add a `callouts: { id: { label, body, type } }` dict to the block

### Branch Policy (per CLAUDE.md)
- **Default:** feature branch (`task/<short-description>`)
- **Direct-to-main** ONLY when ALL true: single file, ≤10 net additive lines, no logic change, not a protected file, AND Ke explicitly says "push to main"
- Code changes (routes, schema, services) → ALWAYS feature branch
- Additive data-only changes (e.g. expanding CALLOUT_LIBRARY) → direct to main with Ke approval

### CC Verification Gates — Always Run Raw Output
After any commit, show raw output before declaring done:
```bash
git log --oneline -3                          # confirm commit hash and message
grep -n "<distinctive-string>" <file>         # confirm edit landed
wc -l <file>                                  # confirm line count
git diff --stat origin/main                   # confirm scope of change
```
CC frequently reports completion without evidence. Always verify with raw terminal output. Never trust CC summaries alone.

### Protected DB Records — Never Delete
- "Mastering TeleMental Health" (`mastering-telemental-health…mkkycoyo`) — intentional duplicate, keep both
- "The Neurobiology of Trauma" — intentional duplicate, keep both
- Delete only if Ke explicitly requests by exact name

### File Delivery (Claude Desktop / CC sessions)
- Output to `/mnt/user-data/outputs/` then `present_files`
- For HTML edits: targeted `str_replace` on specific functions — never full rewrites
- For JS syntax validation in HTML files: extract block to `.js`, then `node --check` (see above)
- Seed scripts: deliver complete ready-to-deploy files, not patches
