# CounselorReady QA Checklist
**Run this after every course seed and before publishing.**

---

## How to Use

1. Log in as your test learner account (create one: testlearner@counselorready.com)
2. Work through every step below for the new course
3. Check off each item — if anything fails, do not publish
4. Document failures with a screenshot and the course slug

---

## Pre-Publish Smoke Test

### Step 1: Admin Verification
- [ ] Course appears in admin course list
- [ ] Status shows correctly (draft before publish)
- [ ] CE hours correct
- [ ] Price/access tier correct
- [ ] Word count shows 100%+ 
- [ ] All modules visible with lessons listed (not "No lessons yet")
- [ ] Run `node src/scripts/validateCourses.js` — zero errors

### Step 2: Course Catalog
- [ ] Course appears on /courses page
- [ ] Thumbnail displays (or placeholder shows cleanly)
- [ ] CE hours, price, and category show correctly
- [ ] "Enroll" or "Start" button is present and clickable

### Step 3: Enrollment
- [ ] Test learner can enroll successfully
- [ ] Course appears in learner dashboard after enrollment
- [ ] Progress shows 0% at start

### Step 4: Module Navigation
- [ ] Module 1 loads without error
- [ ] Content renders correctly (no raw HTML tags visible)
- [ ] Can navigate to next module
- [ ] Progress bar updates as modules are completed
- [ ] All modules accessible in sequence

### Step 5: Knowledge Checks (mid-module quizzes)
- [ ] Knowledge check appears at end of module
- [ ] Can select an answer
- [ ] Submitting shows feedback/explanation
- [ ] Can proceed after completing knowledge check

### Step 6: Final Exam
- [ ] Final exam is accessible after completing all modules
- [ ] Shows correct number of questions (15+)
- [ ] Can select answers and navigate between questions
- [ ] Submit button works
- [ ] Score is calculated and displayed
- [ ] Passing score (80%) grants completion
- [ ] Failing score shows retry option (up to 3 attempts)
- [ ] Answers are NOT shown during exam (showExplanations: false)

### Step 7: Certificate
- [ ] Certificate generates after passing exam
- [ ] Certificate shows learner's correct name
- [ ] Certificate shows correct course title
- [ ] Certificate shows correct CE hours
- [ ] Certificate shows NBCC Provider #7760
- [ ] Certificate shows completion date
- [ ] Certificate is downloadable as PDF
- [ ] Certificate appears in learner's certificate library

### Step 8: Progress & Records
- [ ] Course shows 100% complete in dashboard
- [ ] CE hours added to learner's CE tracker
- [ ] Completion appears in admin analytics

---

## After Publishing
- [ ] Change status to "published" in admin
- [ ] Course visible to all users on /courses
- [ ] Test enrollment works for a new user
- [ ] Send test to one trusted colleague before marketing

---

## Test Account Setup

Create this account once and keep it:
- Email: testlearner@counselorready.com
- Password: (store in your password manager)
- Role: regular user (not admin)
- Subscription: active (so all courses accessible)

Do NOT use your admin account for learner testing — admin access can mask errors regular users would hit.
