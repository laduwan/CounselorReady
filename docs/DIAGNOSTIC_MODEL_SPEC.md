# Diagnostic Model — Design Spec

A design brief for the on-prem model that investigates "something isn't working" across
CounselorReady (CR) and PassReady Prep (PRP). Built from a dozen real support incidents
and grounded in the current repos. Two layers: a **known-signature layer** that recognizes
(and, for proven-safe cases, fixes) your recurring failures, and a **general-method layer**
that investigates anything unfamiliar and stops at a localized diagnosis.

---

## 0. The one principle everything rests on

**The interface lies; the real state tells the truth.** Almost every incident in your
history was "the UI reported success (or showed something plausible) but the actual data
disagreed." The model's first instinct must always be to read real state, never to trust
the error message.

---

## 1. The loop (run for EVERY issue, known or new)

1. **Investigate — read real state.** One or more of: the network request *and* response
   bodies; the actual DB document; the deploy log; `node --check` on changed files. The
   symptom message is the least reliable clue in the room.
2. **Trace — walk the chain.** Follow the relevant path end to end and find the single link
   where behavior/value diverges from expected.
3. **Localize — pin it.** Exact file:line / route / field / env var. Not "somewhere in the
   save flow" — the line.
4. **Report — one root cause with evidence.** State the cause and the proof, not a list of
   maybes, once it's found.
5. **Fix — only if it matches a proven deterministic signature.** Otherwise stop at the
   report and hand the decision to a human.

---

## 2. Hard rules (the "don't break my stuff" contract)

- **Never request or handle secrets.** Diagnose config by *present vs. empty*, never by
  touching the key. (You pasted live Stripe keys more than once; the model must make that
  unnecessary.)
- **Additive fixes only.** Verify before proposing: `node --check`, single-file diff.
- **Auto-fix only the proven-deterministic classes** (e.g. a missing certificate where every
  requirement is verifiably met). Everything ambiguous → investigate and report.
- **Novel or uncertain → localize and report. Never invent a fix.** A confident wrong patch
  on a revenue platform is worse than "here's exactly where it's broken; your call."

---

## 3. Failure-signature table (the known ones, grounded in real files)

| # | Symptom (your words) | Read this first | Trace this chain | Likely root cause(s) | Real anchors | Auto-fix or Report |
|---|---|---|---|---|---|---|
| 1 | "Says saved but doesn't stick" (price, modules, settings) | network **request body** vs **response body**, then the DB doc | frontend payload → `adminCourses.js` update (`$set`/`findByIdAndUpdate`) → `Course.js` schema → DB → read-back | field-name mismatch (`individualPrice` vs `price`); route drops the field; field absent from `Course.js` schema; full-object replace clobbers siblings | client admin save fn; `server/src/routes/adminCourses.js`; `server/src/models/Course.js` | **Report** (needs the specific field); auto-fix only a known missing-schema-field |
| 2 | "Feature is dead, no error" (subscribe modal, etc.) | is the config value **present or empty**? are env vars set? | `client/public/js/stripe-config.js` `window.STRIPE_PUBLISHABLE_KEY` → `initStripe()` → card element mount | blank publishable key; missing `STRIPE_WEBHOOK_SECRET`; placeholder price IDs | `client/public/js/stripe-config.js` (currently populated with a `pk_live_…` value); payments route; Render env | **Report** the empty/placeholder value (never echo the key); you paste the fix |
| 3 | "Passed everything but got blocked / no result" (cert not issued) | the user's real `UserCourseProgress` + `Evaluation` + `Certificate` docs; and whether the **served** player actually calls the POST endpoints | served `interactive-course.html` fetch calls → `POST /:id/assessment` (605), `/evaluation` (763), `/attestation` (890), `/certificate` (985) → progress gate flags → `Certificate` | served file never POSTs; endpoint path/payload mismatch; a gate flag false; silent cert-gen failure (Cloudinary/crash) | `interactiveCourseRoutes.js`; `InteractiveCourse.js` (CourseProgress), `Certificate.js`, `Evaluation.js`; `jobs/certificateSelfHeal.js` | **Report** which gate broke; auto-fix ONLY all-requirements-met-but-no-cert (self-heal already does this). *This row is the certificate diagnostic we built — already automated.* |
| 4 | "Won't deploy" | `node --check` each changed file; the Render deploy log | changed file → syntax/content → `server/src/index.js` boot | syntax error; wrong content in a `.js` (e.g. HTML pasted into `admin.js`); bad import | `server/src/index.js`; the changed route/service file | **Report** file+line; auto-fixable if it's a clear restore |
| 5 | "Got worse after a change" (regression) | the **git diff** of the change; the failed network call | diff → new endpoint path/CORS/payload → backend expectation | wrong endpoint path; CORS; missing header; payload-shape mismatch | the changed file's diff; the route it calls | **Report** the mismatch |
| 6 | "UI weirdness / wrong data" (double dialog, mislabeled credential, 0 stats) | the handler wiring; the record's real source | event handler → bubbling; or display value → data source | event bubbling (needs `stopPropagation`); wrong stored value; stats source/refresh | the specific client page; the record/model | **Report**; small UI fixes are low-risk |

---

## 4. Standing gotchas (found while grounding this in the current repo)

- **Two progress models.** `CourseProgress` is exported from `InteractiveCourse.js`, and
  there is also a separate `UserCourseProgress.js`. Any progress/completion/certificate
  investigation must first confirm **which model the relevant route actually writes and
  reads** — mixing them is a classic "it saved but the other screen shows nothing" bug.
- **Sacred file:** `interactiveCourseRoutes.js` has a minimum-line-count guard. Investigate
  it freely; never rewrite it.
- **Config is client-side** in `stripe-config.js`: presence-check it, never echo the value.

---

## 5. Build order for the known-signature tools (Phase 2)

Each is a walk-the-chain tool built exactly like the certificate diagnostic: read the real
records, walk the chain, report (and auto-fix only the provable case).

1. **payment-didn't-unlock-a-course** — highest stakes; trace checkout → webhook →
   entitlement write → access check.
2. **trial-didn't-extend** — trace the extend-trial route → `trialEndsAt` write → gate.
3. **CE-didn't-allocate** — trace certificate → `UserCredential.ceuLogs` write.
4. **syllabus-didn't-attach** — trace posttest pass → syllabus generate → tile attach.

---

## 6. The general-method layer (how it "learns" new issues)

For any symptom not in the table, the model does **not** guess a fix. It runs the four
generic reads — network (request/response), the relevant DB document, the deploy log, and
`node --check` on anything recently changed — traces whichever chain the symptom implicates,
localizes the divergence, and returns an evidence-backed report. The *method* generalizes
even when the specific bug is brand new: new issue → precise "here's where and why it
breaks," handed to you to approve. That is the honest ceiling — investigate anything,
auto-fix only the proven.

---

## 7. What this is built from

Real incidents, not invented ones: the Telemental Health price that saved-but-didn't; the
blank Stripe publishable key that killed the subscribe modal for three months; `admin.js`
overwritten with HTML so the backend wouldn't deploy; the 87%-pass that still said "must
complete assessment" because the served player never POSTed; the scanner's double file
dialog; the settings-clobber risk; the near-duplicate case leak. Every signature above traces
to one or more of these, mapped to the files that actually hold the logic today.
