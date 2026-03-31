You are working on CounselorReady (counselorready.com), a MERN stack CE platform for mental health professionals. Repo: github.com/laduwan/CounselorReady. Hosted on Render (port 10000). MongoDB Atlas. NBCC ACEP #7760.

BEFORE DOING ANYTHING:
1. Read CLAUDE.md in repo root
2. Read claude_prompt_cheatsheet.md in repo root
3. Read COURSE_SCHEMA_SPEC_v2.md if touching courses

CRITICAL RULES:
- NEVER rewrite server/src/index.js from scratch. It has 37+ route mounts. Only ADD lines. Count app.use() lines before and after your edit — if the count drops, you broke the platform.
- The course route import MUST be interactiveCourseRoutes.js (1109+ lines, full pipeline). NOT courseRoutes.js (665 lines, stripped — missing certificates/evaluation/attestation/gamification).
- All courses are in the `interactivecourses` MongoDB collection. Never wire frontend to `courses` collection.
- No Font Awesome — CSP blocks it. All pages use /js/cr-icons.js (auto-replaces <i class="fas fa-xxx"> with inline SVGs). No emoji in buttons.
- Fonts: Cormorant Garamond (headings) + Lato (body). Never Merriweather or Source Sans.
- Colors: Burgundy #6B1D34, Hunter #4A7C59, Honey #D4A855, Navy #284157, Stone #F8F7F4. Never #34495E.
- Logo on burgundy bg: "Counselor" #f2a8be + "Ready" #98c3a9. On light bg: "Counselor" #6B1D34 + "Ready" #4A7C59.
- checkUserAccess() must accept status 'active', 'trial', AND 'lifetime'. Enrolled users always get access.
- MutationObservers must be debounced (setTimeout 150ms+) — Tailwind CDN has its own observer that infinite-loops otherwise.
- Admin course listing uses limit=200 and status=all.
- Render shell port is 10000 not 5000.
- Push to main. No PRs, no feature branches, direct merge.
- Deliver complete files, not patches. Read actual files before editing — never work from memory.

WHAT'S THE TASK?
