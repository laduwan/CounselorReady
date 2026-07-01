# CounselorReady QA Roadmap
**What exists now vs. what to build next**

---

## ✅ Done (after this session)

1. **COURSE_SCHEMA_SPEC.md** — source of truth for all course structure
   - Add to Claude project files so every AI session reads it
   - Location: src/scripts/COURSE_SCHEMA_SPEC.md

2. **validateCourses.js** — database validation script
   - Run: `node src/scripts/validateCourses.js`
   - Catches: missing exams, wrong question format, low word count, bad references

3. **QA_CHECKLIST.md** — manual learner experience checklist
   - Walk through before every publish
   - Location: src/scripts/QA_CHECKLIST.md

4. **smokeTest.js** — automated API tests
   - Run: `TEST_EMAIL=x TEST_PASSWORD=x node src/scripts/smokeTest.js`
   - Tests: login, course catalog, enrollment, progress tracking, exam structure
   - Location: src/scripts/smokeTest.js

---

## 🔜 Next Priority (build when stable)

5. **Certificate end-to-end test**
   - Actually complete a course with the test account
   - Verify certificate PDF generates correctly
   - Check name, CE hours, provider number, date
   - Why: certificate bugs only show after a learner finishes — too late

6. **Exam submission test**
   - Submit answers to the final exam via API
   - Verify score calculation is correct
   - Verify pass/fail logic works
   - Verify attempt counter decrements correctly
   - Why: the exam could exist in the DB but fail to score correctly

7. **Cross-browser visual check**
   - Check course player in Chrome, Firefox, Safari, mobile
   - Why: your course player CSS has known issues (Tailwind CDN warning)

---

## 🗓️ Medium Term

8. **Automated regression suite**
   - Run smokeTest.js automatically after every Render deploy
   - Render supports deploy hooks — trigger a test run post-deploy
   - Alert via email if tests fail

9. **Word count audit script**
   - Separate from validator — generates a full report of all courses
   - Shows which courses are below threshold and by how much
   - Helps prioritize content expansion work

10. **Admin dashboard health panel**
    - Single page showing all courses with: word count %, exam status, question count
    - Green/yellow/red indicators
    - Makes it easy to spot problems without running scripts

11. **Learner journey analytics**
    - Track where learners drop off (which module, which question)
    - Identify exam questions with very high failure rates (may be poorly written)
    - Helps improve course quality over time

---

## 🔭 Long Term

12. **State compliance verification**
    - Verify each course meets requirements for the states you're targeting
    - Georgia requires ethics hours to be synchronous — flag async ethics courses
    - Automated check against state requirement database

13. **CE Broker integration testing**
    - Test that completed courses report correctly to CE Broker
    - Verify learner credits appear in their CE Broker account

14. **Load testing**
    - Simulate multiple concurrent learners
    - Ensure Render + MongoDB Atlas handles traffic spikes
    - Important before any marketing push

---

## How to Use This Roadmap

- Items 1-4 are done — use them now
- Items 5-7 are the highest-impact next steps — do these before your first paid learner completes a course
- Items 8-11 build a sustainable QA system — schedule for after your first 10 courses are stable
- Items 12-14 are for scale — revisit when you have active learners in multiple states
