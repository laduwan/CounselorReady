/**
 * patchACEPCompliance_CR-CULTR-601.js
 * GAITP LLC · NBCC ACEP #7760
 *
 * Brings "Foundations of Cultural Competence, Ethics, and Risk Reduction"
 * (courseCode CR-CULTR-601, slug cultural-competence-ethics-risk-reduction-cr601,
 * ceHours 3) up to full ACEP structural compliance per CLAUDE_COURSE_STRUCTURE.md.
 *
 * Current state (verified against the live document at write time):
 *   - wordCount 14,849 / target 18,000 (3 CE × 6,000 words/CE)
 *   - 4 sections, each just [sectionDivider, text] — no intro, no conclusion,
 *     no callout/keyTakeaway/interactive activity/knowledge check/reflection
 *     anywhere in the body
 *   - 28 references (well above the ≥15 floor — left as-is)
 *   - assessment.questions: 15 (meets the floor — left as-is)
 *
 * REUSE: The "Course Introduction and Orientation" section and the conclusion
 * blocks (synthesis, clinical-integration callout, Module Highlights accordion,
 * course-level keyTakeaway, Ethical Practice Plan, reflection, resources) are
 * hand-authored content that already exists for this exact course — under the
 * stale code label "CR-601" — in expandIntrosConclusions_CR301_CR302_CR307_CR601.js,
 * apparently never applied (--apply was never run against this document, which
 * still has no intro/conclusion). This script imports that file's PATCHES array
 * and reuses the CR-CULTR-601 entry's authored prose verbatim, adapting only the
 * assembly (this document has no existing conclusion section, so the conclusion
 * is built as a new section rather than inserted into one).
 *
 * NEW WORK (the gap the reused script does not cover): each of the 4 existing
 * body sections is bare — [sectionDivider, text] only. This script inserts,
 * into each of the 4 sections, matching its existing topic:
 *   - a missing sectionDivider subtitle (sections 2-4 lack one)
 *   - a callout (rotating calloutType: ethics / warning / protocol / donot)
 *   - a second text block (topic-specific enrichment; a comparison table in
 *     Section 1, an ethical-decision flowchart imageText in Section 4)
 *   - an accordion (preceded by its own heading text block, per the
 *     TECH_MANUAL "unrendered fields inflate word count" gotcha below)
 *   - one interactive activity, rotating type: flashcardDeck (§1) /
 *     scenarioTree (§2) / matching (§3) / sequencing (§4)
 *   - a keyTakeaway
 *   - 2 multipleChoice knowledge checks
 *   - a reflection
 *
 * FIELD-NAME DISCIPLINE (BLOCK_FIELD_REFERENCE.md + TECH_MANUAL 2026-09-01
 * "Unrendered block fields silently inflate the CE word count"): countCourseWords()
 * counts block.title on every block type regardless of whether the viewer's
 * renderer reads it. accordion/matching/flashcardDeck/scenarioTree/cardSort/
 * sequencing/reflection/resources renderers do NOT read block.title, so this
 * script never sets .title on those block types — heading prose goes into a
 * preceding `text` block (rendered + counted) and per-block framing goes into
 * the field the renderer actually reads (`instructions`, `matchingInstructions`).
 *
 * DRY RUN by default:
 *   node src/scripts/patchACEPCompliance_CR-CULTR-601.js
 * Write (NOT run by this task):
 *   node src/scripts/patchACEPCompliance_CR-CULTR-601.js --execute
 *
 * IDEMPOTENT. Re-running detects the inserted intro/conclusion sections (by
 * title) and each body-section insertion (by a stable callout-title marker)
 * and skips what is already present.
 *
 * WRITE PATH: primary is the Mongoose model (doc.save()) so the pre-save hook
 * recomputes wordCount/totalContentBlocks/totalEstimatedTime. Falls back to a
 * raw collection update (with the canonical word counter and the same rollups
 * the hook would have computed) if model validation fails on pre-existing
 * content, and says so loudly — matching the pattern in
 * expandIntrosConclusions_CR301_CR302_CR307_CR601.js.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { pathToFileURL } from 'url';
import { Course } from '../models/InteractiveCourse.js';
import { countCourseWords, requiredWordsFor } from '../utils/courseWordCount.js';
import { PATCHES as REUSED_PATCHES } from './expandIntrosConclusions_CR301_CR302_CR307_CR601.js';

dotenv.config();

const EXECUTE = process.argv.includes('--execute');

const SLUG_CANDIDATES = [
  'cultural-competence-ethics-risk-reduction-cr601',
  'foundations-cultural-competence-ethics-risk-reduction',
];
const CODE_CANDIDATES = ['CR-CULTR-601', 'CR-601', 'CR-307'];

// The hand-authored intro/conclusion content for this exact course, reused
// verbatim from expandIntrosConclusions_CR301_CR302_CR307_CR601.js. Matched by
// slug (not the stale "CR-601" code label in that file's comments — see
// TECH_MANUAL.md's 2026-09-01 note on course-code ambiguity).
const REUSED = REUSED_PATCHES.find(p => p.slugs.includes(SLUG_CANDIDATES[0]));
if (!REUSED) {
  console.error('FATAL: could not find the CR-CULTR-601 entry in expandIntrosConclusions_CR301_CR302_CR307_CR601.js PATCHES — content source moved or renamed.');
  process.exit(1);
}

const INTRO_TITLE = 'Course Introduction and Orientation';
const INTRO_TITLE_RE = /course introduction and orientation/i;
const CONCLUSION_TITLE = 'Course Summary and Review';
const CONCLUSION_TITLE_RE = /course summary and review|conclusion/i;

// ─────────────────────────────────────────────────────────────────────────────
// INTRO / CONCLUSION — built from the reused content (adapted assembly logic
// from expandIntrosConclusions_CR301_CR302_CR307_CR601.js's buildIntroSection /
// buildConclusionBlocks, whose internals are not exported).
// ─────────────────────────────────────────────────────────────────────────────

// New authored content (not reused) added to close the intro word-count gap —
// the reused CR-CULTR-601 intro content alone runs to roughly 2,250 words,
// short of the 2,500-word floor in CLAUDE_COURSE_STRUCTURE.md §3.
const INTRO_AUDIENCE_TEXT = {
  type: 'text',
  content: `<h3>Why This Course Treats Licensure Paths as One Audience</h3>
<p>This course is written for LPCs, LMHCs, LCSWs, LMFTs, NCCs, and psychologists together, rather than adapted separately for each. That is a deliberate choice rather than a shortcut. The ACA, NBCC, NASW, and AMHCA codes differ in wording and in the specific liability exposures most common to each license — a social worker's documentation obligations are not identical to a counselor's, and a marriage and family therapist's informed consent process for a couple is not identical to an individual practitioner's — but the underlying competence standard, the mechanism by which bias reaches a clinical decision, and the structure of a defensible consent conversation or note are the same regardless of license type. Treating them as a shared foundation, with license-specific detail woven in where the codes actually diverge, reflects how most outpatient teams work in practice: mixed-license case conferences, shared documentation systems, and consultation relationships that cross license lines as often as they stay within one.</p>
<p>If you hold more than one credential, or supervise clinicians who do not share your license type, the material in Modules 3 and 4 in particular is written to transfer directly — the consent and documentation practices and the structured decision model are not counselor-specific, social-work-specific, or psychology-specific. They are built from the point where the codes converge rather than the point where they diverge, which is also, not coincidentally, the point a board reviewer or a plaintiff's expert is most likely to examine regardless of which code governs the complaint.</p>`,
};

function buildIntroSection(p) {
  // Order per CLAUDE_COURSE_STRUCTURE.md §3: divider, opening hook, "why this
  // matters" callout, roadmap, foundational framework imageText, (extra
  // course-specific essay), key-concepts accordion, keyTakeaway, baseline
  // multipleChoice, reflection.
  const [hook, roadmap, ...restIntro] = p.introBlocks;
  const blocks = [
    { type: 'sectionDivider', title: INTRO_TITLE, subtitle: p.introDividerSubtitle },
    hook,
    p.introCallout,
    roadmap,
    p.framework,
    ...restIntro,
    INTRO_AUDIENCE_TEXT,
    { type: 'text', content: `<h3>${p.introAccordion.title}</h3>\n<p>${p.introAccordion.instructions}</p>` },
    { type: 'accordion', accordionItems: p.introAccordion.accordionItems },
    { type: 'keyTakeaway', title: 'What You Will Take Away', takeaways: p.introTakeaways },
    {
      type: 'multipleChoice',
      question: p.baselineMC.question,
      options: p.baselineMC.options.map((o, i) => ({ text: o.text, isCorrect: i === p.baselineMC.correct })),
      correctAnswer: p.baselineMC.correct,
      explanation: p.baselineMC.explanation,
    },
    { type: 'reflection', question: p.introReflection },
  ];
  blocks.forEach((b, i) => { b.order = i + 1; });
  return {
    title: INTRO_TITLE,
    order: 1,
    description: 'What this course covers, how it is organized, and what you should be able to do differently when you finish.',
    contentBlocks: blocks,
  };
}

/** APA reference list block, built from course.references[] (three accepted shapes). */
function buildReferencesBlock(references) {
  const lines = (references || []).map(r => {
    if (typeof r === 'string') return r;
    if (r && r.citation) return r.citation;
    if (r && r.author) return [r.author, r.year ? `(${r.year}).` : '', r.title ? `<em>${r.title}</em>.` : '', r.source || ''].filter(Boolean).join(' ');
    return null;
  }).filter(Boolean);
  if (!lines.length) return null;
  return {
    type: 'text',
    content: `<div class="cr-references"><h2>References</h2>\n${lines.map(l => `<p class="cr-reference">${l}</p>`).join('\n')}\n</div>`,
  };
}

function buildConclusionSection(p, references) {
  // Order per CLAUDE_COURSE_STRUCTURE.md §8: synthesis text, clinical-
  // integration callout, section-highlights accordion, course-level
  // keyTakeaway, ethical-practice-plan text, reflection, resources, then the
  // inline reference list — this document has no existing conclusion, so the
  // whole section (including the .cr-references block) is created fresh.
  const newBlocks = [
    { type: 'text', content: p.takeaways },
    p.integrationCallout,
    { type: 'text', content: '<h3>Module Highlights</h3>\n<p>Open each item to review its central points before the final assessment.</p>' },
    { type: 'accordion', accordionItems: p.highlights },
    { type: 'keyTakeaway', title: 'Course-Level Key Takeaways', takeaways: p.takeawayItems },
    { type: 'text', content: p.plan },
    { type: 'reflection', question: p.conclusionReflection },
    { type: 'resources', resources: p.resources },
  ];
  const refBlock = buildReferencesBlock(references);
  const blocks = [
    {
      type: 'sectionDivider', title: CONCLUSION_TITLE,
      subtitle: 'Consolidation of the course’s central arguments, a module-by-module review, an ethical practice plan, and the full reference list.',
    },
    ...newBlocks,
    ...(refBlock ? [refBlock] : []),
  ];
  blocks.forEach((b, i) => { b.order = i + 1; });
  return {
    title: CONCLUSION_TITLE,
    order: 0, // resequenced below
    description: 'Key takeaways, module highlights, an ethical practice plan, a course-level reflection, and the reference list.',
    contentBlocks: blocks,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// BODY SECTIONS — the deeper gap not covered by the reused script. Each of the
// 4 existing content sections is [sectionDivider, text] only. For each, we
// insert: a missing subtitle (if absent), a callout, a second text block, an
// accordion (heading in its own text block), one interactive activity
// (rotating type), a keyTakeaway, 2 multipleChoice knowledge checks, and a
// reflection — matched to that section's existing topic.
// ─────────────────────────────────────────────────────────────────────────────

const SECTION_PATCHES = [

  // ── Section 1 — Cultural Competence as an Ethical and Professional Mandate ──
  {
    titleRe: /cultural competence as an ethical and professional mandate/i,
    subtitle: null, // already present on the live document
    marker: 'Why This Is a Competence Standard, Not a Courtesy',
    calloutType: 'ethics',
    calloutTitle: 'Why This Is a Competence Standard, Not a Courtesy',
    calloutContent: `<ul>
<li>The {{callout:aca-code}} treats multicultural competence as a component of the general competence standard (Section C — Professional Responsibility), not a separate optional domain — a clinician who has not developed it is practicing outside the boundaries of competence.</li>
<li>The NASW Code of Ethics addresses cultural competence directly under its professional conduct standards, requiring social workers to understand culture and its function in human behavior and society and to demonstrate competence in practice with people of diverse backgrounds.</li>
<li>AMHCA's Code of Ethics locates multicultural counseling competence within its foundational principles on client welfare and professional responsibility, applying it across assessment, diagnosis, and treatment planning.</li>
<li>The {{callout:nbcc-standard}} carries parallel language for National Certified Counselors, tying multicultural knowledge to the same competence framework that governs every other clinical domain.</li>
<li>Read across these codes, "I didn't mean anything by it" is not a defense recognized anywhere in professional ethics — the operative standard is competence, not intent.</li>
</ul>`,
    extraText: `<h3>From Aspiration to Enforceable Standard</h3>
<p>Multicultural counseling has not always been framed this way. Through the 1970s and 1980s, cross-cultural sensitivity was largely treated as a matter of individual clinician disposition — desirable, rarely required, and almost never examined at the level of licensure. That began to change as the profession's major bodies revised their codes to locate cultural knowledge inside the competence standard rather than beside it, and as licensing boards began treating a culturally uninformed clinical decision the same way they treat any other competence failure.</p>
<p>The table below summarizes how four codes governing the professions in this course's target audience treat the obligation. The specific language differs; the underlying requirement does not.</p>
<table>
<tr><th>Code</th><th>Where the obligation sits</th><th>Core requirement</th></tr>
<tr><td>ACA Code of Ethics</td><td>Section C — Professional Responsibility (competence)</td><td>Gain knowledge, awareness, sensitivity, and skill for practice with a diverse client population</td></tr>
<tr><td>NBCC Code of Ethics</td><td>Competence and professional practice provisions</td><td>Parallel competence-based obligation for National Certified Counselors</td></tr>
<tr><td>NASW Code of Ethics</td><td>Standard 1.05, Cultural Competence</td><td>Understand culture's function in behavior and society; demonstrate competence with diverse populations</td></tr>
<tr><td>AMHCA Code of Ethics</td><td>Client welfare and professional responsibility principles</td><td>Apply multicultural competence across assessment, diagnosis, and treatment planning</td></tr>
</table>
<p>What unites the four is the placement, not just the content: none treats cultural knowledge as a specialty add-on. Each folds it into the ordinary competence standard that governs whether a clinician may practice at all in a given area — which is exactly why a cultural misstep so often surfaces in a complaint as a competence allegation rather than a bias allegation.</p>`,
    accordionHeadingText: '<h3>Three Frameworks Worth Holding at Once</h3>\n<p>The field has produced more than one useful model for organizing multicultural competence. Rather than choosing among them, most experienced clinicians hold several simultaneously, using whichever lens the moment calls for.</p>',
    accordionItems: [
      { title: 'Sue’s Tripartite Model', content: '<p>Organizes multicultural competence into three interacting domains: awareness of one’s own cultural values, assumptions, and biases; knowledge of a client’s worldview and the sociopolitical forces that shaped it; and skill in selecting and adapting intervention strategies that fit the client rather than the textbook. A clinician strong in only one domain — self-aware but under-skilled, or knowledgeable but unreflective — remains incompletely competent.</p>' },
      { title: 'Cultural Competence vs. Cultural Humility', content: '<p>Competence names a body of knowledge and skill that can, in principle, be mastered. Humility names an ongoing stance — a lifelong commitment to self-evaluation and critique, to redressing power imbalances, and to holding the client as the authority on their own experience — that never reaches completion. Contemporary practice treats humility as the disposition that keeps competence from calcifying into a checklist applied uniformly to every client who shares a demographic label.</p>' },
      { title: 'The ADDRESSING Framework', content: '<p>A mnemonic prompting systematic inquiry across nine identity dimensions — Age, Developmental/acquired Disability, Religion, Ethnicity, Socioeconomic status, Sexual orientation, Indigenous heritage, National origin, and Gender — so that clinical attention does not settle by default on whichever dimension is most visible. Two clients who appear to share one dimension may differ substantially across the other eight.</p>' },
    ],
    activity: {
      type: 'flashcardDeck',
      instructions: 'Six terms that recur throughout this course. Review each before moving on.',
      flashcards: [
        { id: 'cc-f1', front: 'Cultural Competence', back: 'The knowledge, awareness, and skill required to work effectively and ethically across cultural difference, encompassing self-awareness of one’s own values and biases, knowledge of a client’s cultural context, and the ability to adapt intervention accordingly.' },
        { id: 'cc-f2', front: 'Cultural Humility', back: 'An ongoing stance of self-evaluation, openness to being corrected by the client, and attention to power imbalances in the clinical relationship, distinguished from competence by its emphasis on process over mastery.' },
        { id: 'cc-f3', front: 'ADDRESSING Framework', back: 'A mnemonic (Age, Developmental/acquired Disability, Religion, Ethnicity, Socioeconomic status, Sexual orientation, Indigenous heritage, National origin, Gender) used to prompt systematic assessment across multiple identity dimensions rather than a single visible one.' },
        { id: 'cc-f4', front: 'Sue’s Tripartite Model', back: 'A framework describing multicultural competence as the interaction of three domains: self-awareness of one’s own biases, knowledge of the client’s worldview, and skill in adapting intervention.' },
        { id: 'cc-f5', front: 'Multicultural Orientation', back: 'A therapist stance combining cultural humility, cultural opportunities (moments in session where identity becomes clinically relevant), and cultural comfort (ease engaging cultural material rather than avoiding it).' },
        { id: 'cc-f6', front: 'Intersectionality', back: 'The recognition that a person’s multiple social identities — race, gender, class, disability, and others — interact to produce experiences of privilege or marginalization that cannot be understood by examining any one identity in isolation.' },
      ],
    },
    keyTakeaways: [
      'Multicultural competence is located inside the general competence standard in the ACA, NBCC, NASW, and AMHCA codes — not treated as a specialty add-on.',
      'Cultural humility supplements rather than replaces competence, keeping accumulated knowledge from hardening into a template applied uniformly to every client.',
      'The ADDRESSING framework and Sue’s Tripartite Model are complementary tools — one organizes identity dimensions, the other organizes the clinician’s own competence-building process.',
      'A culturally uninformed clinical decision is treated by licensing bodies as a competence failure, which is the frame that governs how a resulting complaint is evaluated.',
    ],
    knowledgeChecks: [
      {
        question: 'Which statement most accurately reflects how the ACA, NBCC, NASW, and AMHCA codes of ethics treat multicultural competence?',
        options: [
          'It is an aspirational value with no direct connection to competence standards.',
          'It is embedded within each code’s general competence standard, making cultural knowledge and skill a condition of practicing within one’s competence.',
          'It applies only to clinicians who specialize in multicultural counseling.',
          'It is addressed exclusively through continuing education requirements rather than the codes themselves.',
        ],
        correct: 1,
        explanation: 'All four codes place multicultural knowledge and skill inside the general competence standard rather than treating it as a separate, optional domain. That placement is why a culturally uninformed clinical decision is evaluated as a competence failure rather than a lapse in sensitivity.',
      },
      {
        question: 'A clinician is highly self-aware about their own cultural values but has limited knowledge of a specific client population and has not adapted their intervention approach accordingly. According to Sue’s Tripartite Model, this clinician is:',
        options: [
          'Fully culturally competent, since self-awareness is the most important domain.',
          'Incompletely competent — strong in the awareness domain but underdeveloped in the knowledge and skill domains.',
          'Not required to develop further, since awareness alone satisfies the ethical standard.',
          'Exhibiting cultural humility rather than a competence gap.',
        ],
        correct: 1,
        explanation: 'Sue’s Tripartite Model treats competence as the interaction of awareness, knowledge, and skill. Strength in one domain does not compensate for underdevelopment in the others; a clinician needs to build knowledge of the specific population and adapt intervention accordingly.',
      },
    ],
    reflection: 'Identify one client population you work with infrequently — a cultural, religious, linguistic, or identity group represented by only a handful of clients on your caseload. Using Sue’s Tripartite Model, rate your own awareness, knowledge, and skill for that population honestly, and name the specific gap that most needs closing.',
  },

  // ── Section 2 — Bias, Power, and Clinical Risk ──────────────────────────────
  {
    titleRe: /bias, power, and clinical risk/i,
    subtitle: 'Bias operates through ordinary clinical channels — diagnostic weighting, treatment offering, and the threshold for risk decisions — not through conscious hostility.',
    marker: 'Where Bias Actually Shows Up',
    calloutType: 'warning',
    calloutTitle: 'Where Bias Actually Shows Up',
    calloutContent: `<ul>
<li><strong>Diagnostic weighting</strong> — the same symptom cluster is weighted toward a more severe or stigmatizing diagnosis for clients from some groups than others, independent of presentation.</li>
<li><strong>Treatment offering</strong> — evidence-based options are offered less consistently to clients whose background differs from the clinician’s own.</li>
<li><strong>Credibility of reported distress</strong> — a client’s own account of their symptoms or pain is discounted or requires more corroboration before it is acted on.</li>
<li><strong>Nonverbal warmth</strong> — measurable differences in eye contact, proximity, and vocal tone track client demographics even when clinicians report equivalent regard for all clients.</li>
<li><strong>Risk and reporting thresholds</strong> — the point at which a clinician escalates to involuntary intervention or a mandated report shifts by client background, independent of actual risk indicators.</li>
</ul>
<p>None of these require hostility. They are the documented mechanism by which good intentions and disparate outcomes coexist.</p>`,
    extraText: `<h3>Power, Disclosure, and the Cost of Silence</h3>
<p>Every clinical relationship carries a built-in power asymmetry: the clinician assigns a diagnosis, documents a record a third party may read, and in some settings holds authority over hospitalization, custody evaluation, or continued eligibility for services. For a client from a marginalized community, that asymmetry compounds whatever power differential already exists in the surrounding society, and it shapes what gets disclosed. A client who has learned — inside or outside the therapy room — that naming a concern about a clinician’s cultural blind spot carries a cost will often manage that risk by staying quiet, appearing compliant, or terminating without explanation rather than raising it directly.</p>
<p><strong>Microaggressions</strong> — brief, often unintentional exchanges that communicate hostile, derogatory, or invalidating messages toward a marginalized group — operate through this same channel. Microinvalidations, the subtype that denies or dismisses a client’s lived experience ("I don’t see color," "you’re being oversensitive"), have the most consistently documented effect on alliance: they measurably reduce disclosure, weaken the working relationship, and predict premature termination, even when the clinician’s intent was reassurance rather than dismissal. Naming a power differential directly, rather than pretending it does not exist, is one of the few interventions with evidence for reducing the burden a client would otherwise carry silently.</p>`,
    accordionHeadingText: '<h3>Recognizing the Pattern in Your Own Practice</h3>\n<p>These three categories account for most of the bias-related risk documented in the literature. Review each honestly.</p>',
    accordionItems: [
      { title: 'Implicit vs. Explicit Bias', content: '<p>Explicit bias is a consciously held attitude a clinician could, if asked, report and typically would disavow. Implicit bias operates below conscious awareness, is measurable through instruments such as the Implicit Association Test, and is not eliminated by good intentions or explicit egalitarian beliefs — it requires structural correction (time, structured assessment, external review) rather than willpower alone.</p>' },
      { title: 'The Power Differential', content: '<p>The clinician’s authority over diagnosis, documentation, and in some cases involuntary intervention compounds existing societal power imbalances for clients from marginalized groups, shaping what a client is willing to disclose and how safe correction feels.</p>' },
      { title: 'Microaggressions and Retention', content: '<p>Microinvalidations in particular — denying or dismissing a client’s account of their own experience — predict reduced disclosure and premature termination, independent of a clinician’s intent.</p>' },
    ],
    activity: {
      type: 'scenarioTree',
      scenarioTitle: 'Noticing Your Own Reaction',
      instructions: 'A client’s disclosure produces an internal reaction you did not expect. Choose a response at each step and see where it leads.',
      startNode: 'start',
      nodes: {
        start: {
          text: 'A client from a background very different from your own describes a decision you find difficult to understand — one shaped by norms you are not familiar with. You notice a flicker of judgment before you can suppress it.',
          question: 'What do you do first?',
          choices: [
            { text: 'Say nothing about the reaction and continue the session as if it did not happen.', next: 'suppress', tag: 'Suppress' },
            { text: 'Silently notice the reaction without acting on it, and continue listening for more context.', next: 'notice', tag: 'Notice' },
            { text: 'Immediately ask the client to explain and justify the decision to you.', next: 'demand', tag: 'Demand justification' },
          ],
        },
        suppress: {
          text: 'Suppressing the reaction without examining it does not remove its influence — research on implicit bias indicates an unexamined reaction is more, not less, likely to leak into tone, follow-up questions, or the eventual clinical formulation. The client may sense something shifted without being able to name it.',
          choices: [ { text: 'Return to the start and choose differently.', next: 'start' } ],
        },
        demand: {
          text: 'Asking a client to justify a decision shaped by their own cultural context — on the spot, without first examining your own reaction — risks the microinvalidation pattern: the client experiences their judgment as being put on trial rather than being understood, which predicts reduced future disclosure.',
          choices: [ { text: 'Return to the start and choose differently.', next: 'start' } ],
        },
        notice: {
          text: 'You notice the reaction without acting on it and keep listening. This is the first correct move — awareness without immediate action.',
          question: 'What next?',
          choices: [
            { text: 'After the session, take the reaction to supervision or peer consultation and examine where it came from.', next: 'consult' },
            { text: 'Decide the reaction was minor and let it go without further reflection.', next: 'dismiss' },
          ],
        },
        dismiss: {
          text: 'Deciding a noticed reaction is minor and moving on without examining it forfeits the chance to learn what triggered it — and an unexamined pattern tends to recur with the next client who evokes it.',
          choices: [ { text: 'Return to the start and choose differently.', next: 'start' } ],
        },
        consult: {
          text: 'Taking the reaction to supervision or peer consultation is the structural correction the literature supports: examined, named, and traced to its source, the reaction becomes information about your own formation rather than a silent influence on the client’s care. This is the response most consistent with the evidence on correcting implicit bias.',
          choices: [],
        },
      },
    },
    keyTakeaways: [
      'Bias reaches clinical decisions through diagnostic weighting, treatment offering, credibility of reported distress, nonverbal warmth, and risk/reporting thresholds — none of which require conscious hostility.',
      'The clinical relationship’s built-in power asymmetry compounds societal power imbalances for clients from marginalized groups and shapes what gets disclosed.',
      'Microinvalidations — denying or dismissing a client’s account of their own experience — have the most consistently documented negative effect on alliance and retention.',
      'An implicit bias reaction is corrected structurally (supervision, consultation, structured assessment), not by willpower or good intentions alone.',
    ],
    knowledgeChecks: [
      {
        question: 'A clinician notices a flicker of judgment about a client’s culturally shaped decision but says nothing and continues the session as though the reaction did not occur. According to the evidence on implicit bias, what is the most likely consequence?',
        options: [
          'The reaction dissipates on its own with no effect on the session.',
          'The unexamined reaction is more likely, not less, to influence tone, follow-up questions, or the eventual clinical formulation.',
          'Suppressing the reaction is the correct clinical response and requires no further action.',
          'The client will be unaware anything occurred, regardless of the clinician’s tone.',
        ],
        correct: 1,
        explanation: 'Implicit bias research indicates that suppressing a reaction without examining it does not neutralize its influence — it tends to leak into behavior the clinician is not consciously monitoring. Structural correction (supervision, consultation) is what the evidence supports, not suppression alone.',
      },
      {
        question: 'Which of the following best describes a microinvalidation?',
        options: [
          'A deliberate, explicit insult directed at a client’s cultural background.',
          'A statement that denies or dismisses a client’s account of their own lived experience, such as "you’re being oversensitive."',
          'Any clinical question about a client’s cultural background.',
          'A formal complaint filed against a clinician for biased treatment.',
        ],
        correct: 1,
        explanation: 'Microinvalidations are a subtype of microaggression that deny or dismiss a client’s reality rather than expressing overt hostility. They are the subtype most consistently linked in the literature to reduced disclosure and premature termination.',
      },
    ],
    reflection: 'Recall a moment in the past few months when a client’s decision, value, or behavior produced an internal reaction in you that surprised you. Did you name it to yourself in the moment? Did you take it anywhere afterward — supervision, peer consultation, your own reflection? Write what you would do differently now.',
  },

  // ── Section 3 — Culturally Responsive Informed Consent and Documentation ───
  {
    titleRe: /culturally responsive informed consent and documentation/i,
    subtitle: 'Consent and documentation are where cultural misunderstanding most often converts into liability — and where the fix is procedural, not attitudinal.',
    marker: 'A Consent and Documentation Checklist',
    calloutType: 'protocol',
    calloutTitle: 'A Consent and Documentation Checklist',
    calloutContent: `<ul>
<li>Is the consent conversation delivered in a language and at a comprehension level this specific client can follow — not merely the language on the form?</li>
<li>If translation is needed, is it provided by a professional interpreter rather than a family member or bilingual staff member pulled in informally?</li>
<li>Has comprehension been checked out loud (e.g., "tell me in your own words what happens if...") rather than assumed from a signature?</li>
<li>Does the client know who else, if anyone, they expect or want involved in the decision, and has that expectation been discussed rather than assumed away?</li>
<li>Does the note include the client’s own account of the problem, the cultural or contextual factors considered, and the alternatives ruled out — or only the conclusion?</li>
</ul>`,
    extraText: `<h3>The Cultural Formulation Interview</h3>
<p>The <strong>Cultural Formulation Interview (CFI)</strong> — a 16-question, semi-structured protocol published with the DSM-5 and continued in DSM-5-TR — gives clinicians a standardized way to gather exactly the information a defensible cultural formulation requires: the client’s own understanding of their problem, the social and cultural context contributing to it, cultural factors affecting self-coping and past help-seeking, and cultural factors affecting the current clinical relationship. It is not required for every client, and using it selectively — only for clients who "seem" culturally different — reintroduces the same bias problem covered in the previous section. Many clinicians adapt a handful of its core questions into a standard intake for every client, which both normalizes the inquiry and avoids singling anyone out.</p>
<p>The interview does two things at once. Clinically, it surfaces information a standard mental status exam misses — the client’s own explanatory model for their symptoms often diverges sharply from a DSM category, and the divergence itself is clinically useful. Administratively, a documented CFI (or an adapted set of its core questions) is close to the strongest single piece of evidence a file can contain that a diagnosis was reached through a structured process rather than an unexamined first impression — which is precisely the evidence a board reviewer is looking for.</p>`,
    accordionHeadingText: '<h3>Documentation Elements Worth Standardizing</h3>\n<p>Each of these can be built into a note template so the discipline survives a full caseload rather than depending on memory.</p>',
    accordionItems: [
      { title: 'The Client’s Own Words', content: '<p>Record the client’s own description of the problem, in language close to what they used, before translating it into diagnostic terms. This is the anchor a reviewer checks the diagnosis against.</p>' },
      { title: 'Identity and Context Factors', content: '<p>Note the specific identity and contextual elements that bear on the presentation — not a checklist of demographics, but the factors the client identified as relevant.</p>' },
      { title: 'Alternatives Considered', content: '<p>Record what else was considered and why it was ruled out. A note that shows only the conclusion cannot demonstrate that culturally normative experience was distinguished from symptom.</p>' },
    ],
    activity: {
      type: 'matching',
      matchingInstructions: 'Match each term to its definition.',
      matchingPairs: [
        { term: 'Cultural Formulation Interview (CFI)', definition: 'A 16-question, semi-structured protocol from the DSM-5-TR for gathering the client’s own explanatory model, cultural context, and factors affecting the clinical relationship.' },
        { term: 'Comprehension Check', definition: 'Asking a client to restate, in their own words, what they understand they are agreeing to — the practice that distinguishes genuine consent from a signature.' },
        { term: 'Professional Interpreter', definition: 'A trained, neutral third party used for translation in clinical encounters, distinguished from an informally recruited family member or bilingual staff member.' },
        { term: 'Cultural Formulation (in documentation)', definition: 'The section of a clinical note recording the client’s own account, relevant identity and context factors, alternatives considered, and treatment implications.' },
        { term: 'Documented Consultation', definition: 'A record showing that a clinician sought input on a complex case and what that input was — the single most protective element available in a board review.' },
      ],
    },
    keyTakeaways: [
      'Informed consent is a comprehension standard, established by checking understanding out loud, not a signature standard.',
      'Professional interpretation, not an informally recruited family member, is the standard for clients with limited proficiency in the language of the session.',
      'The Cultural Formulation Interview gives a standardized way to gather exactly the information a defensible cultural formulation requires — used routinely rather than only for clients who "seem" different.',
      'A note recording the client’s own words, the context factors, and the alternatives ruled out is the difference between a defensible and an indefensible file.',
    ],
    knowledgeChecks: [
      {
        question: 'A clinician uses a bilingual front-desk staff member to translate during an intake session because a professional interpreter was not immediately available. What is the primary concern with this practice?',
        options: [
          'Bilingual staff members are never accurate translators regardless of training.',
          'An informally recruited translator has not been vetted for clinical interpretation, may filter or simplify sensitive content, and the arrangement is not the professional standard the codes expect.',
          'There is no concern as long as the client appeared to understand.',
          'The concern applies only if the staff member is a family member, not a coworker.',
        ],
        correct: 1,
        explanation: 'Professional interpretation is the standard specifically because informal translators — family members or untrained staff — are not vetted for clinical accuracy and may unintentionally filter, soften, or misrepresent sensitive material. Comprehension appearing adequate does not substitute for the standard itself.',
      },
      {
        question: 'Which best describes the primary value of the Cultural Formulation Interview (CFI)?',
        options: [
          'It replaces the standard diagnostic interview entirely.',
          'It is required only for clients presenting with a language barrier.',
          'It provides a standardized way to gather the client’s explanatory model, cultural context, and factors affecting the clinical relationship — information a defensible formulation and a defensible note both require.',
          'It is primarily a billing and coding tool rather than a clinical one.',
        ],
        correct: 2,
        explanation: 'The CFI’s sixteen questions systematically surface the client’s own understanding of their problem, relevant social and cultural context, and factors that may affect the therapeutic relationship — exactly the content a defensible cultural formulation and a reviewer-proof note both depend on.',
      },
    ],
    reflection: 'Pull your own informed consent document and read it as a client with limited English proficiency would experience it. Where would comprehension break down? What would you add to your process — not the document itself, but the conversation — to check understanding rather than assume it?',
  },

  // ── Section 4 — Ethical Decision-Making in Culturally Complex Cases ─────────
  {
    titleRe: /ethical decision-making in culturally complex cases/i,
    subtitle: 'The hardest cases are resolved by a structured process, not by intuition or reflexive deference.',
    marker: 'Common Missteps in Culturally Complex Cases',
    calloutType: 'donot',
    calloutTitle: 'Common Missteps in Culturally Complex Cases',
    calloutContent: `<ul>
<li><strong>Overriding the client’s values by default</strong> because they are unfamiliar, rather than testing whether accommodation is actually incompatible with the clinical or legal obligation at stake.</li>
<li><strong>Abandoning a clinical or legal obligation by default</strong> out of deference to a client’s stated values, rather than working through whether the obligation is genuinely negotiable.</li>
<li><strong>Treating referral as the automatic response</strong> to cultural unfamiliarity, when referral offered because the clinician is uncomfortable — rather than because the case exceeds their competence — functions as a denial of care.</li>
<li><strong>Consulting without documenting it</strong>, which forfeits nearly all of the protective value consultation would otherwise provide.</li>
<li><strong>Deciding by intuition</strong> in a case complex enough to warrant a structured process, and discovering only afterward that the reasoning cannot be reconstructed for the file.</li>
</ul>`,
    extraText: `<h3>Why a Structured Model Outperforms Intuition Here</h3>
<p>Genuinely hard cases — where a client’s cultural or religious values appear to conflict with clinical judgment, a legal obligation, or a professional standard — are exactly the cases where intuition is least reliable and least defensible. Intuition compresses a multi-factor judgment into a single felt sense, and it cannot later be reconstructed for a reviewer, a supervisor, or the clinician’s own future reference. A structured decision model does the opposite: it forces each factor to be named explicitly, in an order, producing both a better decision and a record of how it was reached.</p>
<p>The sequence used in this course — and represented in the risk-management literature under various names — treats the conflict as a set of obligations to be reconciled rather than a single choice between "respecting culture" and "following the rule." Both framings are usually wrong: most apparent conflicts, examined closely, either resolve because the obligation has more flexibility than assumed, or resolve because the value, once understood in the client’s own terms, is compatible with the obligation after all. The cases that remain genuinely conflicted after that examination are rare, and they are exactly the cases where documented consultation carries the most weight.</p>`,
    imageText: {
      title: 'The Structured Ethical Decision-Making Sequence',
      image: '',
      imageAlt: 'A seven-step horizontal flow diagram: Identify the competing obligations, Consult the relevant code and law, Obtain and document consultation, Generate the available options, Test each option against client welfare and professional standards, Decide, Record the reasoning.',
      imagePosition: 'left',
      content: '<p>Each of the seven steps produces something concrete: a written list of the specific obligations in tension, a note of which code provisions and statutes apply, a record of who was consulted and what they said, a real set of alternatives rather than a false binary, a documented test of each alternative against client welfare and the applicable standard, a decision, and a reasoning trail a reviewer could follow without asking the clinician to explain it later. Skipping a step does not make the case simpler — it removes the evidence that the step was considered at all.</p>',
    },
    accordionHeadingText: '<h3>Where These Conflicts Tend to Arise</h3>\n<p>These recurring categories account for most genuinely hard cultural-ethical conflicts in outpatient practice.</p>',
    accordionItems: [
      { title: 'Family Involvement in Decision-Making', content: '<p>A client’s cultural framework may expect a spouse, parent, or extended family to participate in treatment decisions the clinician’s training treats as individually held. The structured model asks whether accommodating that expectation is compatible with the client’s own informed choice, rather than assuming either that it must be honored or that it must be overridden.</p>' },
      { title: 'Religious or Spiritual Practice and Clinical Recommendation', content: '<p>A client’s religious framework may conflict with a specific recommended intervention (a medication, a behavioral directive, a diagnostic label). The structured model tests whether the clinical objective can be met through an alternative compatible with the client’s framework before treating the conflict as unresolvable.</p>' },
      { title: 'Legal or Reporting Obligations', content: '<p>Mandatory reporting and duty-to-warn obligations are the clearest case of a genuinely non-negotiable obligation — cultural context can inform how the obligation is carried out (who explains it, in what language, with what preparation) but does not change whether it applies.</p>' },
    ],
    activity: {
      type: 'sequencing',
      instructions: 'Put the seven steps of the structured ethical decision-making model in the correct order.',
      steps: [
        { id: 'edm-1', text: 'Identify the specific competing obligations — the client’s stated values, the clinical judgment involved, and any applicable legal or ethical standard.', order: 1 },
        { id: 'edm-2', text: 'Consult the relevant code provisions and applicable law before assuming either obligation is fixed.', order: 2 },
        { id: 'edm-3', text: 'Obtain consultation from a supervisor, peer group, or ethics resource, and document that it occurred.', order: 3 },
        { id: 'edm-4', text: 'Generate the realistic set of options, rather than treating the case as a binary choice.', order: 4 },
        { id: 'edm-5', text: 'Test each option against the client’s welfare and the applicable professional standards.', order: 5 },
        { id: 'edm-6', text: 'Decide.', order: 6 },
        { id: 'edm-7', text: 'Record the reasoning in the file, in enough detail that a reviewer could follow it without asking the clinician to explain further.', order: 7 },
      ],
    },
    keyTakeaways: [
      'Genuinely hard cultural-ethical conflicts are resolved through a structured decision process, not through reflexive deference to the client’s values or reflexive adherence to the clinician’s original plan.',
      'Legal and mandatory-reporting obligations are the clearest non-negotiable category — cultural context can shape how they are carried out but not whether they apply.',
      'Referral is appropriate when a case exceeds a clinician’s competence, not when the clinician is merely uncomfortable — reflexive referral functions as a denial of care.',
      'Documented consultation is simultaneously the strongest clinical safeguard and the strongest available protection in a later review.',
    ],
    knowledgeChecks: [
      {
        question: 'A client’s religious framework conflicts with a specific clinical recommendation. According to the structured decision-making model presented in this section, what is the appropriate first response?',
        options: [
          'Override the client’s stated religious framework, since the clinical recommendation is evidence-based.',
          'Abandon the clinical recommendation immediately out of respect for the client’s stated values.',
          'Identify the specific competing obligations precisely, then test whether the clinical objective can be met through an alternative compatible with the client’s framework before treating the conflict as unresolvable.',
          'Refer the client to a different clinician without further exploration.',
        ],
        correct: 2,
        explanation: 'The structured model treats an apparent conflict as a set of obligations to reconcile, not an immediate choice between two extremes. Many apparent conflicts resolve once the clinical objective and the client’s framework are both examined closely enough to identify a compatible alternative.',
      },
      {
        question: 'Which of the following is most clearly a non-negotiable obligation within the structured decision-making model — one that cultural context can shape in its execution but not eliminate?',
        options: [
          'The choice of therapeutic modality.',
          'A mandatory reporting obligation triggered by disclosed abuse.',
          'The frequency of scheduled sessions.',
          'Whether a family member is present during intake.',
        ],
        correct: 1,
        explanation: 'Mandatory reporting and duty-to-warn obligations are the clearest non-negotiable category in the model — cultural context can inform how the obligation is carried out (who explains it, in what language, with what preparation) but does not change whether it applies.',
      },
    ],
    reflection: 'Think of a case — your own, or one described to you in supervision or consultation — where a client’s cultural or religious values appeared to conflict with a clinical recommendation. Walk it through the seven-step sequence now. At which step, if any, did the actual handling of the case diverge from what the sequence would have produced?',
  },
];

/** Build the array of new content blocks for one body section (excluding the existing divider + text). */
function buildSectionAdditions(sp) {
  const activityBlock = { ...sp.activity };
  const blocks = [
    { type: 'callout', calloutType: sp.calloutType, title: sp.calloutTitle, content: sp.calloutContent },
    { type: 'text', content: sp.extraText },
    ...(sp.imageText ? [{ type: 'imageText', ...sp.imageText }] : []),
    { type: 'text', content: sp.accordionHeadingText },
    { type: 'accordion', accordionItems: sp.accordionItems },
    activityBlock,
    { type: 'keyTakeaway', takeaways: sp.keyTakeaways },
    ...sp.knowledgeChecks.map(kc => ({
      type: 'multipleChoice',
      question: kc.question,
      options: kc.options.map((text, i) => ({ text, isCorrect: i === kc.correct })),
      correctAnswer: kc.correct,
      explanation: kc.explanation,
    })),
    { type: 'reflection', question: sp.reflection },
  ];
  return blocks;
}

function sectionAlreadyPatched(section, marker) {
  return (section.contentBlocks || []).some(b =>
    (b.title || '').includes(marker) || (b.content || '').includes(marker));
}

// ─────────────────────────────────────────────────────────────────────────────
// PLAN — pure transform, no I/O. Exported so a scratch script can call it for
// validateSync() / word-count self-checks without a DB connection.
// ─────────────────────────────────────────────────────────────────────────────
export function planPatch(course) {
  const sections = JSON.parse(JSON.stringify(course.sections || []));
  const actions = [];

  // ── 1. Introduction ─────────────────────────────────────────────────────
  const hasIntro = sections.length > 0 && INTRO_TITLE_RE.test(sections[0].title || '');
  if (hasIntro) {
    actions.push('intro: SKIP (section 1 is already an introduction)');
  } else {
    const intro = buildIntroSection(REUSED);
    sections.unshift(intro);
    actions.push(`intro: INSERT section at position 1 (${intro.contentBlocks.length} blocks, reused from expandIntrosConclusions_CR301_CR302_CR307_CR601.js)`);
  }

  // ── 2. Body sections ────────────────────────────────────────────────────
  for (const sp of SECTION_PATCHES) {
    const section = sections.find(s => sp.titleRe.test(s.title || ''));
    if (!section) {
      actions.push(`body "${sp.marker}": SECTION NOT FOUND — expected a section matching ${sp.titleRe}`);
      continue;
    }
    section.contentBlocks = section.contentBlocks || [];

    // Missing subtitle on the sectionDivider (sections 2-4 on the live doc).
    if (sp.subtitle) {
      const divider = section.contentBlocks.find(b => b.type === 'sectionDivider');
      if (divider && !divider.subtitle) {
        divider.subtitle = sp.subtitle;
        actions.push(`"${section.title}": SET missing sectionDivider subtitle`);
      }
    }

    if (sectionAlreadyPatched(section, sp.marker)) {
      actions.push(`"${section.title}": SKIP body additions (marker "${sp.marker}" already present)`);
      continue;
    }

    const additions = buildSectionAdditions(sp);
    // Insert right after the existing [sectionDivider, text] pair (or at the
    // end if the section is shaped differently than expected).
    const insertAt = Math.min(2, section.contentBlocks.length);
    section.contentBlocks = [
      ...section.contentBlocks.slice(0, insertAt),
      ...additions,
      ...section.contentBlocks.slice(insertAt),
    ];
    actions.push(`"${section.title}": INSERT ${additions.length} blocks (callout+text+accordion+${sp.activity.type}+keyTakeaway+${sp.knowledgeChecks.length}xMC+reflection)`);
  }

  // ── 3. Conclusion ───────────────────────────────────────────────────────
  const last = sections[sections.length - 1];
  const hasConclusion = last && CONCLUSION_TITLE_RE.test(last.title || '');
  if (hasConclusion) {
    actions.push('conclusion: SKIP (a conclusion-like section already exists)');
  } else {
    const conclusion = buildConclusionSection(REUSED, course.references);
    sections.push(conclusion);
    actions.push(`conclusion: CREATE section "${CONCLUSION_TITLE}" (${conclusion.contentBlocks.length} blocks, reused from expandIntrosConclusions_CR301_CR302_CR307_CR601.js)`);
  }

  // ── 4. Resequence ───────────────────────────────────────────────────────
  sections.forEach((s, i) => {
    s.order = i + 1;
    (s.contentBlocks || []).forEach((b, j) => { b.order = j + 1; });
  });

  return { sections, actions };
}

async function findCourse(col) {
  for (const slug of SLUG_CANDIDATES) {
    const doc = await col.findOne({ slug });
    if (doc) return { doc, matchedBy: `slug:${slug}` };
  }
  for (const code of CODE_CANDIDATES) {
    const doc = await col.findOne({ courseCode: code });
    if (doc) return { doc, matchedBy: `courseCode:${code}` };
  }
  return { doc: null, matchedBy: null };
}

async function main() {
  if (!process.env.MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('interactivecourses');

  console.log('\n' + '='.repeat(78));
  console.log(`patchACEPCompliance_CR-CULTR-601 — ${EXECUTE ? 'EXECUTING WRITE' : 'DRY RUN (pass --execute to write)'}`);
  console.log('='.repeat(78));

  const { doc: raw, matchedBy } = await findCourse(col);
  if (!raw) {
    console.log(`NOT FOUND — tried slugs [${SLUG_CANDIDATES.join(', ')}] and codes [${CODE_CANDIDATES.join(', ')}]`);
    await mongoose.disconnect();
    process.exit(1);
  }
  console.log(`matched by ${matchedBy} · "${(raw.title || '').slice(0, 70)}" · status=${raw.status} · ${(raw.sections || []).length} sections · wordCount=${raw.wordCount ?? 'n/a'}`);

  const { sections, actions } = planPatch(raw);
  actions.forEach(a => console.log('  ' + a));

  if (actions.every(a => a.includes('SKIP') || a.includes('NOT FOUND'))) {
    console.log('\nNothing to do — already patched.');
    await mongoose.disconnect();
    return;
  }

  const before = countCourseWords(raw);
  const after = countCourseWords({ ...raw, sections });
  const target = requiredWordsFor(raw.ceHours || raw.ceuHours || 0);
  console.log(`\nwords: ${before.toLocaleString()} → ${after.toLocaleString()} (+${(after - before).toLocaleString()}) · CE target ${target.toLocaleString()} · ${after >= target ? 'PASS' : 'STILL SHORT by ' + (target - after).toLocaleString()}`);

  if (!EXECUTE) {
    console.log('\nDRY RUN — no writes. Re-run with --execute to write.');
    console.log('='.repeat(78) + '\n');
    await mongoose.disconnect();
    return;
  }

  try {
    const model = await Course.findById(raw._id);
    if (!model) throw new Error('document disappeared between read and write');
    model.set('sections', sections);
    model.markModified('sections');
    await model.save();
    console.log(`SAVED via model — wordCount=${model.wordCount}`);
  } catch (err) {
    console.log(`MODEL SAVE FAILED: ${err.message}`);
    console.log('FALLING BACK to collection update (validation bypassed — the failure above is in PRE-EXISTING content and should be fixed separately)');
    const patchedDoc = { ...raw, sections };
    await col.updateOne({ _id: raw._id }, {
      $set: {
        sections,
        wordCount: countCourseWords(patchedDoc),
        totalContentBlocks: sections.reduce((n, s) => n + (s.contentBlocks || []).length, 0),
        totalEstimatedTime: sections.reduce((n, s) => n + (s.estimatedTime || 15), 0),
        sectionCount: sections.length,
        moduleCount: sections.length,
        assessmentQuestionCount: raw.assessment?.questions?.length || 0,
        updatedAt: new Date(),
      },
    });
    console.log(`SAVED via collection — wordCount=${countCourseWords(patchedDoc)}`);
  }

  console.log('='.repeat(78) + '\n');
  await mongoose.disconnect();
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(e => { console.error('ERROR:', e); process.exit(1); });
}
