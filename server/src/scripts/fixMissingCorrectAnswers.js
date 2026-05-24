# Fix: KC correctAnswer + CR-614 syntax error
## Push to GitHub first, then run on Render shell

## Files changed
- `server/src/scripts/fixMissingCorrectAnswers.js` — NEW
- `server/src/scripts/seedCR614-The_Final_Chapter_End_of_Life_Death_Anxiety_Meaning-18037words.js` — shebang removed
- `server/src/scripts/seedCR614-recovered-from-docx.js` — shebang removed

---

## Render shell commands (from ~/project/src/server)

### 1. Fix 167 missing correctAnswers across 6 courses
```
node src/scripts/fixMissingCorrectAnswers.js
```
Expected: 6 courses updated, ~167 KCs total

### 2. Re-run CR-614 (now syntax-clean)
```
node src/scripts/seedCR614-The_Final_Chapter_End_of_Life_Death_Anxiety_Meaning-18037words.js
```

### 3. Verify
```
node src/scripts/diagnoseCourseValidation.js CR-303
node src/scripts/diagnoseCourseValidation.js CR-401
node src/scripts/diagnoseCourseValidation.js CR-402
node src/scripts/diagnoseCourseValidation.js CR-NEU
node src/scripts/diagnoseCourseValidation.js CR-PHY
node src/scripts/diagnoseCourseValidation.js CR-TIC
node src/scripts/diagnoseCourseValidation.js CR-614
```
All should return `0 would fail save`.

---

## Note
correctAnswer defaults to index 1 (second option) — matches the authoring
pattern in these seeds where the substantive answer is position 1.
Confirm in CourseBuilder before publishing each course.
