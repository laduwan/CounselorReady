[CALLOUT-RETROFIT-AUDIT.md](https://github.com/user-attachments/files/27078306/CALLOUT-RETROFIT-AUDIT.md)
# Inline Callout Retrofit Audit
**Date:** April 2026
**Scope:** Identify courses that should use the inline callout/alert system (live in `interactive-course.html`) but currently don't.

---

## Findings Summary

- **67** total seed scripts in the repo
- **0** use `{{callout:...}}` inline syntax
- **0** use `{{alert:...}}` inline syntax
- **0** use the standalone `type: "callout"` block

The viewer's `parseCalloutSyntax` function (line 3133) and `renderCallout` function (in the dispatcher at line 3077) are fully wired and ready to render. The system was built but never adopted in any course.

This is a **high-leverage retrofit opportunity**: existing courses can become more visually informative, more compliance-explicit, and more learner-friendly by swapping plain prose terms for inline callouts — without rewriting any content.

---

## Priority 1 — Telehealth (Highest ROI)

These courses are entirely about regulatory compliance for remote service delivery. Every paragraph should reference HIPAA, GA Rule 135, or PHI in some form. Plain prose buries those terms; callouts surface them.

### `seedCR-TMH601-Batch1-Sections1to4.js` and `Batch2to4-Sections5to13.js`
**Course:** Mastering TeleMental Health (6CE)
**Recommended retrofits:**
- Replace every prose mention of "HIPAA" with `{{callout:hipaa}}` (estimate: 30-50 occurrences across both batches)
- Replace every reference to "Georgia Rule 135-11" or "Composite Board Rule 135" with `{{callout:telehealth-rule}}`
- Replace "Protected Health Information" mentions with `{{callout:phi}}`
- Replace "informed consent" mentions with `{{callout:informed-consent}}`
- Add `{{alert:document}}` badges at every "must document" trigger (consent, emergency contact, location verification)
- Convert section warnings into standalone `callout` blocks with `calloutType: "ethics"` or `"warning"`

**Effort:** 2-3 hours per batch.
**Compliance value:** Very high — telehealth audit pulls focus on these exact terms.

### `seedCR-TMH602-TeleMental_Health_Supervision-20533words.js`
**Course:** TeleMental Health Supervision (3CE)
**Recommended retrofits:**
- All Priority 1 items above
- Add `{{callout:lpc-a-note}}` wherever pre-licensed supervisee responsibilities appear
- Add `{{alert:supervisor}}` badges at decision points where the supervisee must escalate
- Define a per-block custom callout for `gca-rule-135-11` (Georgia supervisor-specific rule) since it's referenced repeatedly and isn't in the global library

**Effort:** 2-3 hours.
**Compliance value:** Very high. This is your current Gold Standard target for ACEP submission — strong callout coverage looks polished in audit review.

---

## Priority 2 — Ethics & Risk

Ethics courses live and die on accurate citation of the ACA Code, NBCC standards, and dual-relationship rules. Every reference is a callout candidate.

### `Ethics_Professional_Boundaries_3CE.md` (CR-ETH301, your Gold Standard target)
**Recommended retrofits:**
- Every "ACA Code F.6.a" / "Code A.5.a" etc. reference → `{{callout:aca-code}}` (or per-block custom callouts for specific section IDs)
- Every "Tarasoff" / "duty to warn" mention → `{{callout:duty-to-warn}}`
- "informed consent" → `{{callout:informed-consent}}`
- Add standalone `callout` blocks (`calloutType: "ethics"` or `"donot"`) for boundary-violation scenarios — these deserve their own visual real estate

**Effort:** 3-4 hours (this is your spec course; it should set the standard).
**Compliance value:** Very high. The whole course is about ethical citation.

### `CR-601_Cultural_Competence_Ethics_Risk_Reduction_3CE.md`
**Recommended retrofits:**
- ACA Code references → `{{callout:aca-code}}`
- NBCC Standard references → `{{callout:nbcc-standard}}`
- Add `{{alert:ethics}}` badges where culture-bound assumptions risk ethical violation
- Standalone callout blocks for boundary case studies

**Effort:** 2-3 hours.
**Compliance value:** High.

---

## Priority 3 — Suicide / Crisis / Mandated Reporting

Safety-critical courses where a missed callout could be a missed legal duty.

### `seedSuicideRiskInteractive.js`
### `Suicide_Risk_Assessment_4CE.md`
### `Suicide_Crisis_Course_Full.md`
**Recommended retrofits:**
- "duty to warn" / "Tarasoff" → `{{callout:duty-to-warn}}`
- "mandatory reporting" / "must report" → `{{callout:mandatory-report}}`
- "involuntary hold" / "1013" / "mental health hold" — declare a custom block-level callout for `1013-form` since GA-specific
- `{{alert:mandatory}}` at every legally-mandated reporting trigger
- `{{alert:protocol}}` at clinical protocol decision points (lethality assessment, safety planning)
- Standalone `callout` blocks (`calloutType: "donot"`) for prohibited responses to suicidal disclosure

**Effort:** 2-3 hours per course.
**Compliance value:** Very high. Safety-critical and audit-visible.

### `seedCR-SP-204-Involuntary_Holds-6034words.js`
**Recommended retrofits:**
- All Priority 3 items above
- Heavy use of `{{alert:legal}}` and `{{alert:document}}` — involuntary holds are documentation-heavy
- Custom callouts for GA-specific 1013/2013 forms

**Effort:** 1-2 hours.
**Compliance value:** Very high.

### `seedMandatedReporter.js`
**Recommended retrofits:**
- Entire course should be saturated with `{{callout:mandatory-report}}` and `{{alert:mandatory}}`
- `{{alert:legal}}` for legal exposure points
- Custom callouts for state-specific reporting agencies and timelines

**Effort:** 1-2 hours.
**Compliance value:** Very high. The course is literally about mandatory reporting; the syntax is purpose-built for it.

### `seedCR612-Still_Standing_Geriatric_Suicide_Risk_Assessment-12797words.js`
**Recommended retrofits:**
- All Priority 3 items
- Custom callouts for elder-abuse-specific reporting (different timeline than child abuse in GA)

**Effort:** 1-2 hours.

---

## Priority 4 — Trauma & Clinical

Lower urgency than compliance courses, but still benefit from clinical-term callouts.

### `Inside_Out_Neurobiology_of_Trauma_3CE.md` and `Trauma_Informed_Care_PTSD_3CE.md`
**Recommended retrofits:**
- Custom block-level callouts for clinical terms: "polyvagal", "window of tolerance", "dual representation theory", "structural dissociation"
- Use `type: "clinical"` for the pill style
- Standalone `callout` blocks (`calloutType: "clinical"`) for case-formulation pull-outs

**Effort:** 1-2 hours per course.
**Compliance value:** Lower (educational, not regulatory). Pedagogical value is the win here.

### `seedCR501-DBT_Foundations_Clinical_Applications-8915words.js` and DBT 6hr scripts
**Recommended retrofits:**
- Custom callouts for "STOP skill", "TIPP", "DEAR MAN", "Wise Mind" etc. — DBT has its own vocabulary
- `{{alert:protocol}}` at lethal-means-counseling decision points
- `{{alert:mandatory}}` at self-harm reporting thresholds (depending on severity)

**Effort:** 1-2 hours per script.

---

## Priority 5 — Cultural & Specialty (Lowest urgency)

### `Beyond_the_Surface_Multicultural_Competence_3CE.md`
### `Lost_in_Translation_Cultural_Competency_3CE(1).md`
### Movie-themed and other clinical courses
**Recommended retrofits:**
- ACA Code section A.4 references → `{{callout:aca-code}}`
- Add custom block-level callouts for culture-specific concepts (acculturative stress, cultural humility, intersectionality) when the course discusses them

**Effort:** 30-60 min per course.
**Compliance value:** Low. Pedagogical polish more than compliance value.

---

## Recommended Workflow

Don't try to retrofit everything in one pass. Suggested rollout:

1. **Pilot (1 course)** — pick `seedCR-TMH602` (your current Gold Standard target). Apply the full callout treatment. Push to a feature branch, deploy to staging, view in the live viewer to confirm pills render correctly across light/dark modes and at all text-size settings.
2. **Iterate** — refine the callout list based on what you see. Add custom callouts you wish existed. If you want them globally available, propose adding to `CALLOUT_LIBRARY` in `interactive-course.html` (separate scoped task).
3. **Bulk Priority 1** — apply the refined approach to TMH601 and ETH301.
4. **Priority 3 batch** — Suicide / Mandated Reporter / Involuntary Holds in one wave.
5. **Lower priorities** as time allows.

---

## Out of Scope for Retrofit (Keep Plain Prose)

- Foundational education courses where the term doesn't need definition for the audience (e.g., "anxiety" in a basic anxiety/depression course — over-callout creates pill clutter)
- KC questions, scenario tree text, accordion bodies — `parseCalloutSyntax` doesn't run on those (see architecture doc §5A.7)
- Final exam questions

---

## Validation After Retrofit

Once a course is retrofitted, confirm in the live viewer:
1. Open the course at `/interactive-course.html?slug=<slug>`
2. Scan each section: pills should render with correct icon and color
3. Hover any pill: tooltip should appear with the full body text
4. Toggle dark mode (♿ panel): verify pill contrast remains readable
5. Toggle high-contrast mode: verify pills still differentiate from body text
6. Toggle dyslexia font: verify pill labels render correctly in OpenDyslexic

If any pill renders as a gray "Unknown: id" badge, the callout ID is wrong or not in the library — fix at the seed level.

---

*Reference: `CREADY-VIEWER-ARCHITECTURE.md` §5A for full syntax, color types, and standalone block options.*
