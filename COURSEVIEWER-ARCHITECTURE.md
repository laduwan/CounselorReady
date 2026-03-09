# CourseViewer Architecture & Dependency Map

## Why This Document Exists

Multiple AI-assisted sessions have introduced bugs when fixing or upgrading CourseViewer features. This document maps the critical dependencies so future changes don't break the course player.

---

## Two Course Systems (Do NOT Confuse)

| | Traditional Courses | Interactive Courses (Deep Dive) |
|---|---|---|
| **Model** | `server/src/models/Course.js` | `server/src/models/InteractiveCourse.js` |
| **Structure** | `modules[] → lessons[]` | `sections[] → contentBlocks[]` |
| **Server Routes** | `server/src/routes/courses.js` → `/api/courses/*` | `server/src/routes/interactiveCourseRoutes.js` → `/api/interactive-courses/*` |
| **Client Page** | `client/src/pages/CourseView.jsx` | `client/src/components/CourseViewer.jsx` |
| **Route** | `/courses/:slug` (wrapped in Layout) | `/learn/:slug` (standalone, own layout) |
| **Catalog** | N/A (legacy) | `client/src/pages/InteractiveCourseCatalog.jsx` |

**Critical**: The catalog links to `/learn/:slug`. The interactive CourseViewer is the primary player. Do NOT redirect courses to `/courses/:slug` — that's the legacy player.

---

## CourseViewer API Dependencies

CourseViewer uses **raw fetch** (not axios). The rest of the app uses **axios** via `client/src/services/api.js`.

### API Response Format

The server (`interactiveCourseRoutes.js`) wraps ALL responses in:
```json
{ "success": true, "data": <payload> }
```

CourseViewer must unwrap this: `json.data || json`

The axios-based `api.js` does its own unwrapping (`response.data.data`). These are two separate patterns — changing one does NOT fix the other.

### Route Map (Client → Server)

These must stay in sync. If you change a server route, update the client, and vice versa.

| Client Method | Client URL | Server Route | HTTP Method |
|---|---|---|---|
| `getCourse` | `/slug/{slug}` | `GET /slug/:slug` (line 92) | GET |
| `getProgress` | `/{slug}/progress` | `GET /:id/progress` (line 175) | GET |
| `updateSectionProgress` | `/{slug}/progress/section/{idx}` | `PUT /:id/progress/section/:sectionIndex` (line 758) | PUT |
| `submitSectionQuiz` | `/{slug}/progress/section/{idx}/quiz` | `POST /:id/progress/section/:sectionIndex/quiz` (line 841) | POST |
| `submitAssessment` | `/{slug}/assessment` | `POST /:id/assessment` (line 262) | POST |
| `logInteraction` | `/{slug}/progress/interaction` | `POST /:id/progress/interaction` (line 946) | POST |

### API Base URL

```javascript
const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/interactive-courses`
  : 'https://api.counselorready.com/api/interactive-courses';
```

- `VITE_API_URL` must include `/api` (e.g., `https://api.counselorready.com/api`)
- In dev, Vite proxy forwards `/api/*` to `localhost:5000` (see `client/vite.config.js`)
- In production (Vercel), there is NO proxy — requests go directly to the API server

---

## Common Pitfalls

### 1. Response Wrapping Mismatch
**Symptom**: `TypeError: can't access property 0, t.sections is undefined`
**Cause**: Server returns `{ success: true, data: course }` but client reads raw response
**Fix**: Always unwrap with `json.data || json` in fetch-based API calls

### 2. Route Path Mismatch
**Symptom**: 404 errors in console, progress not saving, quizzes not submitting
**Cause**: Client URL doesn't match server route pattern
**Check**: Compare `CourseViewer.jsx` API methods against `interactiveCourseRoutes.js` routes

### 3. HTTP Method Mismatch
**Symptom**: 404 or 405 errors
**Cause**: Client sends POST but server expects PUT (or vice versa)
**Example**: `updateSectionProgress` must use PUT, not POST

### 4. Two Route Files for Same Mount Point
**WARNING**: There are TWO route files that BOTH handle interactive courses:
- `server/src/routes/courseRoutes.js` — older, uses `/:param` pattern
- `server/src/routes/interactiveCourseRoutes.js` — newer, has `/slug/:slug` and full progress routes

Only `interactiveCourseRoutes.js` is mounted in `server/src/index.js` (line 218). The other file (`courseRoutes.js`) is NOT used but still exists — do NOT reference it when debugging.

### 5. Auth: fetch vs axios
- **axios** (`api.js`): Automatically attaches JWT from interceptor
- **fetch** (`CourseViewer.jsx`): Must manually add `Authorization: Bearer ${token}` via `authHeaders()`
- If auth breaks, check that `localStorage.getItem('token')` returns a valid JWT

### 6. CORS Preflight
- OPTIONS requests returning 204 is normal (CORS preflight)
- The actual GET/POST/PUT follows the OPTIONS request
- If you see only OPTIONS (204) with no follow-up request, CORS is blocking

### 7. Vercel Deployment
- `client/vercel.json` only has SPA rewrites — NO API proxy
- Relative API URLs (`/api/...`) will return `index.html` on Vercel (broken)
- Must use absolute URLs via `VITE_API_URL` env var
- Ensure `VITE_API_URL` is set in Vercel project environment variables

---

## Data Flow: Course Load

```
User navigates to /learn/:slug
  → App.jsx routes to CourseViewerWrapper
    → CourseViewer receives courseSlug prop
      → useEffect calls:
         1. api.getCourse(slug)    → GET /api/interactive-courses/slug/:slug
         2. api.getProgress(slug)  → GET /api/interactive-courses/:slug/progress
      → Server returns { success: true, data: course/progress }
      → Client unwraps json.data
      → Sets course + progress state
      → Renders: CourseSidebar + SectionView (or AssessmentView or ReferencesView)
```

### SectionView Rendering Chain

```
SectionView receives section (course.sections[currentIndex])
  → contentBlocks = section.contentBlocks || []
  → groupBlocksIntoPages(contentBlocks) splits into pages
  → Each block renders via ContentBlockRenderer
    → Maps block.type to component (Accordion, MatchingExercise, etc.)
    → Interactive blocks open in KnowledgeCheckModal
```

---

## Locked Visual Elements (Do NOT Change)

Per `CLAUDE.md`, ALL page aesthetics are locked to the burgundy/forest brand scheme:
- Button colors: burgundy-700/burgundy-800
- Logo gradient: `linear-gradient(135deg, #8B2542, #6B1D34)`
- Base background: `bg-stone-50` (eggshell)
- See `CLAUDE.md` for full locked sections list

---

## Files That Must Stay in Sync

If you modify any of these files, check the others:

1. `client/src/components/CourseViewer.jsx` (API calls, rendering)
2. `server/src/routes/interactiveCourseRoutes.js` (API endpoints)
3. `server/src/models/InteractiveCourse.js` (data schema)
4. `client/src/components/InteractiveCourseComponents.jsx` (block renderers)
5. `client/src/pages/InteractiveCourseCatalog.jsx` (links to /learn/:slug)
6. `client/src/App.jsx` (routing)
