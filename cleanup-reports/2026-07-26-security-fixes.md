# Security Fixes — SCORM Access Control & Blog Stored-XSS

**Date:** 2026-07-26
**PR:** [laduwan/CounselorReady#747](https://github.com/laduwan/CounselorReady/pull/747)
**Scope:** Two additive security fixes. 3 code files changed (`+59 / −10`), plus this summary.

---

## 1. SCORM access control — `server/src/routes/scorm.js`

**Problem:** The SCORM import/export/preview routes were gated only by `protect`, so **any logged-in user** — not just admins — could create, export, or preview courses.

**Fix:** Added `requireAdmin` after `protect` on all three routes:

| Route | Before | After |
|---|---|---|
| `POST /import` | `protect` | `protect, requireAdmin` |
| `GET /export/:id` | `protect` | `protect, requireAdmin` |
| `GET /preview/:id` | `protect` | `protect, requireAdmin` |

`requireAdmin` is imported from `../middleware/auth.js` using the same named-import pattern as `adminCourses.js`:
```js
import { protect, requireAdmin } from '../middleware/auth.js';
```

**Tripwire test — `server/src/__tests__/scormAuth.test.js` (new):** reads the raw source of `routes/scorm.js` and fails if any `router.post/get/delete` line whose path mentions `import|export|preview` lacks `requireAdmin`; also asserts `requireAdmin` is imported from the auth middleware. A future edit that drops the admin gate now breaks the build.

## 2. Blog stored-XSS — `client/public/blog-post.html`

**Problem:** Untrusted DB blog content was rendered via `marked.parse()` straight into `innerHTML`, and tag values were interpolated as raw `${tag}` into `innerHTML` — both unescaped, allowing stored XSS.

**Fix:**
- Added pinned **DOMPurify 3.2.4** (`https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.2.4/purify.min.js`).
- Wrapped the render sink: `DOMPurify.sanitize(marked.parse(post.content || ''))`.
- Rebuilt tag links via DOM APIs — `textContent` for the visible label, `encodeURIComponent` for the href query param — so no raw tag value ever reaches `innerHTML`.

---

## Verification

**Gates:**
```
scorm.js routes:
  24: router.post('/import', protect, requireAdmin, upload.single('scormPackage'), ...
  74: router.get('/export/:id', protect, requireAdmin, async ...
 102: router.get('/preview/:id', protect, requireAdmin, async ...
  10: import { protect, requireAdmin } from '../middleware/auth.js';

grep -n "DOMPurify.sanitize" client/public/blog-post.html   → line 206 (the only marked.parse call site, wrapped)
grep -n "dompurify/3.2.4/purify.min.js" ...                 → line 25 (present)
raw ${tag} into innerHTML                                    → none

node --check server/src/routes/scorm.js                      → OK
node --check server/src/__tests__/scormAuth.test.js          → OK
```

**`cd server && npm test` (baseline-aware):**
```
Test Files  4 failed | 6 passed (10)
     Tests  1 failed | 62 passed (63)
```
- The new **scormAuth suite PASSES** (3/3) — test count rose exactly +3 passing / +1 passing file vs. baseline.
- The 4 failing files (`contentGating`, `payments`, `quotaEnforcement`, `gateLogic`) and the 1 failing test are **pre-existing** — proven by running the identical suite against pristine `main`, which produced `4 failed | 5 passed (9)` / `1 failed | 59 passed (60)`. None relate to these changes; all touch files outside this task's scope and were not modified.

## Safety-preamble compliance
- Branched off `main`; single PR (#747).
- Only the task-named files were changed (`scorm.js`, `scormAuth.test.js`, `blog-post.html`); this summary doc was added separately at the owner's request.
- No protected file in the diff; `interactiveCourseRoutes.js` untouched at 1,745 lines (≥ 1,578).
