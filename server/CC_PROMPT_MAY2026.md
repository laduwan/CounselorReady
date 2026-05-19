# CounselorReady — Claude Code Prompt (May 2026)

---

## REPO STATE (verified May 19 2026)

- **Frontend:** 82 static HTML pages in `client/public/`. Tailwind CDN pinned to v3.4.17 on ALL static files — never change.
- **Backend:** `server/src/index.js` — 54 route mounts. Never remove any import or `app.use()` line.
- **DB collection:** `interactivecourses` (live). `courses` = empty/legacy — never touch.
- **Hosting:** Render only. Not Vercel. Vite = build tool, not host.
- **CourseBuilder:** Fully refactored to `client/src/components/course-builder/` (7 tabs). Tiptap + @dnd-kit installed and wired. Do not rewrite.
- **Course player:** `client/public/interactive-course.html` — 7786L single-file. Sacred. Never rewrite or split. Every production path loads this file.
- **interactiveCourseRoutes.js:** Must stay above 1518L. Currently 1578L. Do not inline model declarations.

---

## HARD OFF-LIMITS FILES — DO NOT OPEN OR MODIFY UNLESS TASK NAMES THEM

- `server/src/routes/interactiveCourseRoutes.js` — full course pipeline (1578L). Never rewrite.
- `server/src/routes/auth.js`, `payments.js`, `courses.js`, `certificates.js`, `adminStripe.js`
- `server/src/services/emailTemplates.js`, `courseCompletionService.js`, `narrationService.js`
- `server/src/models/User.js`, `Course.js`, `InteractiveCourse.js`, `UserCourseProgress.js`
- `client/public/interactive-course.html` — 7786L. Surgical edits only, no refactoring.
- `client/src/components/CourseViewer.jsx` — legacy, being left to die. Do not extend.
- `client/src/components/CourseBuilder.jsx` — DO NOT TOUCH.
- `client/tailwind.config.cjs`, `client/src/index.css`

---

## ARCHITECTURE RULES (non-negotiable)

**Static-HTML-first.** 82 pages in `client/public/` are the production UI. CC defaults to React — reject React solutions for anything that already works as static HTML.

- Navigation between static pages: `<a href="/page.html">` — never React `<Link>`
- Static pages load Tailwind CDN, not the React build pipeline
- When in doubt: edit the `.html` file, not a `.jsx` component

**Route files exist ≠ registered.** Always verify mount in `server/src/index.js`. Use `routeManifest.js` as reference.

---

## SEED SCRIPTS

- Collection: `interactivecourses` — never `courses`
- Structure: `sections[].contentBlocks[]` (viewer normalizes `modules[]` → `sections[]` at load)
- Use Mongoose `.save()` — never raw `collection.insertOne()` (computed fields won't be set)
- Options shape: `[{text:String, isCorrect:Boolean}]` with `correctAnswer:Number` (integer index)
- **Never flat `[String]` options** — causes Mongoose char-explosion
- No `knowledgeCheck` wrappers — expand to individual `multipleChoice` blocks
- No `quiz` blocks — put exam in top-level `assessment`
- References ONLY in conclusion section + `course.references[]` — never in content sections
- Naming: `seedCR{code}-{Title}-{wordcount}words.js`

### 17 valid block types only:
`sectionDivider` `text` `imageText` `image` `accordion` `resources` `videoEmbed` `multipleChoice` `multiSelect` `matching` `cardSort` `sequencing` `timeline` `reflection` `scenarioTree` `flashcardDeck` `hotspot`

---

## COLORS — only these hex values, no exceptions

| Color | Hex | Use |
|---|---|---|
| Burgundy | `#6B1D34` | H1, logo, CTAs |
| Hunter Green | `#4A7C59` | H2, buttons, nav |
| Honey/Gold | `#D4A855` | Accents, badges only |
| Navy | `#284157` | H3, secondary text |
| Stone | `#F8F7F4` | Page backgrounds |
| Eggshell | `#F5F5DC` | Course viewer content area ONLY |

**Never use:** `#34495E` (old navy), `#40634A`, `#34503D`

---

## ICONS / FONTS

- **No Font Awesome CSS links** — CSP blocks them
- Use `<i class="fas fa-xxx">` — `cr-icons.js` auto-replaces with inline SVGs at runtime
- Or use inline SVGs directly
- **Never emoji in UI elements** — render as garbled UTF-8
- Tab icons: always inline SVGs
- Display/headings: `Cormorant Garamond` — Body: `Lato`

---

## POSTHOG (as of May 19 2026)

PostHog key: `phc_rRGb8TPVl8lDYnD4M2HMGGuBBkL9whGzghD5FEX20Vb`  
Host: `https://us.i.posthog.com`

**Live events in `interactive-course.html`:**
- `course_enrolled` — on enroll POST success
- `course_completed` — on assessment pass
- `certificate_generated` — on cert creation
- `section_completed` — on section progress PUT (when `isComplete`)
- `paywall_hit` — when gate renders (reason: `free_hours_exhausted` | `subscription_required`)

**Live events in `client/public/tools/*.html`:**
- `tool_used` — fires at start of generate function in: note-writer, consent-generator, safety-plan, sliding-scale, superbill, treatment-plan, diagnostic-helper

---

## ADMIN ANALYTICS

`/api/admin/stripe/overview` returns `{ data: { estimatedMRR, subscribers: { active, pastDue }, plans, stripeBalance } }`.  
This is now surfaced in `admin-analytics.html` as a revenue row above Detailed Ratings. Do not duplicate.

---

## CE PLANNER (`client/public/ce-planner.html`)

Backend: `/api/ce-planner/plan` returns `{ summary, plan[] }`. Plan items include urgency, categoryBreakdown, recommendations, suggestedHoursPerWeek.  
Page now has: summary cards, per-credential plans, weekly pace timeline (renders for urgent/critical credentials), Print/Export button. Do not rewrite — extend only.

---

## RENDER SHELL

- Port: 10000 (not 5000) — `curl http://localhost:10000/health`
- Working dir: `~/project/src/server`
- Run scripts: `node src/scripts/[filename].js`
- Node REPL for DB ops — never `node -e` with `$` operators (shell mangles them)
- `.cjs` extension required for scripts in ESM server (`"type": "module"`)
- Heredoc unreliable — paste directly into Node REPL

---

## ADMIN PAGES

- Course listing fetches: `limit=200`, `status=all`
- All courses in `interactivecourses` — never `GET /api/admin/courses` against legacy collection

---

## CC BEHAVIOR — KNOWN FAILURE MODES

1. **Pushes to branch instead of main** — always verify target branch before approving
2. **Claims to complete work that already exists** — re-fetch and diff before merge
3. **Makes unrelated destructive changes** — scope every PR to named files only
4. **Hallucinated completions** — never trust CC summaries; check raw terminal output
5. **Defaults to React** — reject for anything static HTML already handles
6. **Rewrites sacred files** — interactiveCourseRoutes.js destroyed twice (1518L → 388L); enforce minimum line count

**Rule: Only touch files explicitly named in the task prompt.**
