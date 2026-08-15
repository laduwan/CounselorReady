# Dead-File Cleanup — Findings & Changes

**Date:** 2026-07-26
**PR:** [laduwan/CounselorReady#745](https://github.com/laduwan/CounselorReady/pull/745) (merged)
**Scope:** Deletions only — remove dead/unreferenced files after a per-file reference gate. One directory-name fix via `git mv`.

---

## What was deleted (45 files + 1 rename; 19,431 deletions, 0 content additions)

### Server (2)
- `server/src/services/researchSynthesis.js` — 0 references
- `server/src/services/scholarlySearch.js` — 0 references

### Duplicate directories (md5-verified)
- `server/src/scripts/src/` — nested duplicate of `seedCR614-…DeathAnxiety_Meaning.js` (md5 `6871b923…`, identical to the canonical copy in `scripts/`)
- `server/src/scripts/scripts/` — 5 files removed (see note below)

### Directory-name fix (rename, content identical — `R100`)
- `server/src/scripts/ /checkBatchReferencesResources.js` → `server/src/scripts/checkBatchReferencesResources.js`
  (eliminates the trailing-space directory `server/src/scripts/ `)

### Client — public (2)
- `client/public/mockup-dashboard.html` — 0 references
- `client/public/update-content.html` — 0 references

### Client — stray orphan copy (1)
- `client/src/components/interactive-course.html` — orphan; the live viewer `client/public/interactive-course.html` is untouched.

### Client — unrouted React pages (28)
`AdminBulkUpload`, `AdminPartnerAnalytics`, `AdminPartnerSupport`, `AdminPartners`, `AuditKit`, `BoardAlerts`, `CourseQuickEdit`, `Gamification`, `GroupLicenseDashboard`, `InsuranceTracker`, `LegacyVault`, `OrganizationDashboard`, `PartnerBilling`, `PartnerBrandingSettings`, `PartnerBulkUpload`, `PartnerCourseAdmin`, `PartnerCourseCatalog`, `PartnerDashboard`, `PartnerDomainSettings`, `PartnerEmailTemplates`, `PartnerOnboarding`, `PartnerReports`, `PartnerUserManagement`, `PartnerUserManual`, `QuickEnroll`, `ScholarlyArticles`, `SupervisionTracker`, `ThumbnailManager` (all `.jsx`). None imported or routed; client build verified.

### Client — components (2)
- `client/src/components/ErrorBoundary.jsx` — 0 references
- `client/src/components/InteractiveCourseComponents.jsx` — 0 references

### Root artifacts (4)
- `files(203).zip`, `partner-dashboard-links.patch`, `partner-login-routing-dash.patch`, `repo-tree.txt`

---

## Key findings — 6 task-listed files intentionally NOT deleted

The reference gate caught files assumed dead that are actually live or protected. Per the rule "any hit → don't delete, list instead," these were kept:

| File | Reason kept |
|---|---|
| `client/public/home.html` | **Live site root** — `_redirects:11` rewrites `/ → /home.html`. Deleting breaks the homepage. |
| `client/public/verify.html` | **Live certificate-verification page** — `/verify` route + certificates print `counselorready.com/verify/${code}`. The narrow task gate only checked `auth.js` (which correctly uses the separate `verify-email.html`) and missed this. |
| `client/public/interactive-course-legacy.html` | CLAUDE.md:94 — "do not delete or consolidate." |
| `client/src/components/AccessibilityProvider.jsx` | CLAUDE.md:91 — "do not touch." |
| `server/src/routes/courseRoutes.js` | CLAUDE.md:70 "do not touch" + stale references in `checkCourseAccess.js` and `admin-course-links.html`. |
| `server/src/scripts/bulkRegenerateBadCerts.js` | Referenced by a comment in `certificateService.js`. |

---

## Other notes

- **`scripts/scripts/` was not a pure duplicate.** Only `seedStandardCourses_batch1.js` matched the canonical `scripts/` copy (md5 `3fcabe62…`). The other 4 — `cleanupEmptyShells.js`, `extractStaticQuizzes.js`, `migrateCoursesToInteractive.js`, `seedFromMarkdownSources.js` — existed only in that nested path with 0 references. The task instructed deleting the whole directory, so all 5 went; all are recoverable from git history.
- **Protected files confirmed untouched:** live viewer `interactive-course.html`, `client/index.html`, `interactiveCourseRoutes.js` (still 1,745 lines ≥ 1,578).
- **Basename collisions were verified safe:** remaining grep hits for `interactive-course.html`, `seedStandardCourses_batch1.js`, and `seedCR614-…js` all point at surviving canonical files, not the deleted copies.

## Verification performed

- `cd client && npm run build` → success (React deletions broke no imports; `verify-react-entry` guard passed).
- `node --check` on the renamed file → pass.
- `cd server && npm test` → 4 failing suites (payments mock, a `process.exit(0)` in `gateLogic.test.cjs`, a `quotaEnforcement` field mismatch). **Proven pre-existing** by running the identical suite against pristine `main` (same failures with none of the deletions present). These touch files outside this task's scope and were not modified.
