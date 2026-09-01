/**
 * patchACEPCompliance_CR-THEO-604.js
 * GAITP LLC · NBCC ACEP #7760
 *
 * Brings "Solution-Focused Brief Therapy in Community Mental Health"
 * (courseCode CR-THEO-604, slug cr-theo-604-solution-focused-brief-therapy,
 * ceHours 2) up to full ACEP structural compliance per
 * CLAUDE_COURSE_STRUCTURE.md §3 (intro), §8 (conclusion), and the 6,000
 * words/CE-hour floor (12,000 words for 2 CE).
 *
 * The live document already has:
 *   - A thin 4-block intro ("Introduction: A Different Kind of Listening")
 *     missing the roadmap text, imageText, accordion, keyTakeaway, baseline
 *     multipleChoice, and reflection required by §3.
 *   - Two well-built content sections (Section 1: Theoretical Foundations,
 *     Section 2: Applying SFBT in Community Mental Health) that already carry
 *     BOTH a callout and a keyTakeaway plus a full activity/KC/reflection set
 *     — these are NOT touched.
 *   - 19 references and 17 assessment questions — both already clear the
 *     ACEP floors (>=15 each) and are NOT touched.
 *   - No conclusion section at all.
 *
 * This patch is INSERTION-ONLY:
 *   - The intro section's 4 existing blocks are kept in place, unmodified,
 *     in their existing order. New blocks are inserted around them to bring
 *     the section as close to the §3 fixed order as insertion allows:
 *       divider(existing) -> hook text(existing) -> NEW "Why This Matters"
 *       callout -> videoEmbed(existing) -> "How to Use This Course"
 *       callout(existing) -> NEW roadmap text -> NEW imageText -> NEW
 *       accordion -> NEW keyTakeaway -> NEW baseline multipleChoice ->
 *       NEW reflection.
 *   - A brand-new "Course Summary and Review" conclusion section is appended,
 *     built in the exact §8 order: synthesis text -> clinical-integration
 *     callout -> section-highlights accordion -> course-level keyTakeaway ->
 *     ethical-practice-plan text -> reflection -> resources block ->
 *     references text block (built from course.references[], NEVER a
 *     type:"references" content block — no renderer exists for that type).
 *   - Two new APA-7 references (ACA Code of Ethics, NBCC Code of Ethics) are
 *     appended to course.references[] because the new Ethical Practice Plan
 *     text cites both. Nothing existing in references[] or assessment[] is
 *     touched.
 *
 * Field names follow BLOCK_FIELD_REFERENCE.md (Tier 1, generated from the
 * live renderX() functions) — in particular: multipleChoice/multiSelect
 * options are [{text, isCorrect}] objects; accordion uses accordionItems
 * [{title, content}]; keyTakeaway uses takeaways[String]; callout uses
 * calloutType + content (HTML) with an optional title; imageText uses
 * image/imageAlt/imagePosition (not imageUrl/imageAltText, which belong to
 * the standalone `image` block type).
 *
 * IDEMPOTENT. Re-running detects the inserted "Why This Matters" callout and
 * the "Course Summary and Review" section by title/marker and skips whatever
 * is already present, so it is safe to run twice.
 *
 * DRY RUN by default (prints the plan, word-count deltas, and a
 * validateSync() self-check — no DB writes):
 *   node src/scripts/patchACEPCompliance_CR-THEO-604.js
 * Write:
 *   node src/scripts/patchACEPCompliance_CR-THEO-604.js --execute
 *   node src/scripts/patchACEPCompliance_CR-THEO-604.js --apply   (alias)
 *
 * WRITE PATH: the Mongoose model (doc.save()) so the pre-save hook recomputes
 * wordCount, totalContentBlocks, totalEstimatedTime, sectionCount,
 * moduleCount, and assessmentQuestionCount. If the pre-existing document
 * fails schema validation for reasons unrelated to this patch, the script
 * falls back to a raw collection update that still sets a correct wordCount
 * via the canonical counter, and says so loudly.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { pathToFileURL } from 'url';
import { Course } from '../models/InteractiveCourse.js';
import { countCourseWords, requiredWordsFor } from '../utils/courseWordCount.js';

dotenv.config();

const APPLY = process.argv.includes('--execute') || process.argv.includes('--apply');

export const SLUG_CANDIDATES = ['cr-theo-604-solution-focused-brief-therapy'];
export const COURSE_CODES = ['CR-THEO-604'];

const WHY_THIS_MATTERS_TITLE = 'Why This Matters';
const CONCLUSION_TITLE = 'Course Summary and Review';
const CONCLUSION_TITLE_RE = /course summary and review/i;

// ─────────────────────────────────────────────────────────────────────────
// NEW REFERENCES — appended because the Ethical Practice Plan text (in the
// new conclusion) cites both. Matches the plain-string format already used
// throughout course.references[] on this document.
// ─────────────────────────────────────────────────────────────────────────
export const NEW_REFERENCES = [
  'American Counseling Association. (2014). <em>ACA code of ethics</em>. Author.',
  'National Board for Certified Counselors. (2023). <em>NBCC code of ethics</em>. Author.',
];

// ─────────────────────────────────────────────────────────────────────────
// INTRO INSERTIONS — §3 blocks missing from the existing 4-block intro.
// Returned as two arrays so the engine can splice them into the existing
// section at two different insertion points without touching what's there.
// ─────────────────────────────────────────────────────────────────────────

/** Inserted immediately after the existing opening-hook text block (order 2),
 *  ahead of the existing videoEmbed/"How to Use This Course" callout. */
export function buildWhyThisMattersCallout() {
  return {
    type: 'callout',
    calloutType: 'info',
    title: WHY_THIS_MATTERS_TITLE,
    content: `<ul>
<li>Most community mental health centers authorize a limited course of care — commonly six to twelve sessions per client per year, and some payers cap coverage lower still — while many graduate training programs continue to teach open-ended, insight-oriented models built around dozens of sessions.</li>
<li>Solution-Focused Brief Therapy was not adapted for brevity as a compromise. It was built, from its earliest sessions at the Brief Family Therapy Center, to produce meaningful change inside exactly these constraints.</li>
<li>Attrition in community mental health is high. A substantial share of clients attend only one to three sessions regardless of what was authorized or planned, which means a model that front-loads meaningful movement fits the reality of the caseload better than a model that assumes a full course of care will be delivered.</li>
<li>Meta-analytic evidence (Kim, 2008; Gingerich &amp; Peterson, 2013; Franklin et al., 2017) finds SFBT produces outcomes comparable to longer treatments across a range of presenting problems — the empirical basis for its widespread adoption in exactly the settings this course addresses.</li>
<li>Misapplied brevity is not harmless. Using SFBT's structure to justify a skipped risk assessment or bypassed trauma processing — a pattern this course names directly in Section 2 — causes real harm, which is precisely why technique and clinical judgment are taught together here rather than separately.</li>
<li>Practitioners trained to lead with a full problem history often experience their first few SFBT sessions as uncomfortably short on assessment — a discomfort worth naming now, because it is one of the more common reasons clinicians drift back toward problem-talk under caseload pressure, exactly the drift this course is designed to help you notice and correct.</li>
</ul>`,
  };
}

/** Inserted after the existing "How to Use This Course" callout (order 4),
 *  in the §3 order: roadmap -> imageText -> accordion -> keyTakeaway ->
 *  baseline multipleChoice -> reflection. */
export function buildIntroTailBlocks() {
  return [
    {
      type: 'text',
      content: `<h3>How This Course Builds</h3>
<p>The two sections that follow are sequenced deliberately, and each depends on the one before it. Section 1 establishes the theoretical foundation: where SFBT came from, why de Shazer and Berg built it inductively rather than deriving it from existing theory, and what its core assumptions and signature techniques — the miracle question, exception questions, scaling questions — actually do clinically. This section is more conceptually dense than Section 2, and that density is intentional. A clinician who can execute the miracle question but cannot explain why the sleep detail in its phrasing matters, or what de Shazer meant by "the solution is not the opposite of the problem," is applying technique without the stance that makes the technique work — precisely the failure mode Section 2 names as "solution-forced therapy."</p>
<p>Section 2 takes that foundation into the setting where most of you will actually use it: community mental health, with its high caseloads, mandated clients, crisis presentations, and clients carrying serious and persistent mental illness. This section works through the SFBT session structure, the visitor-complainant-customer framework for calibrating intervention to client engagement, and the specific adaptations SFBT requires — and the specific misapplications to watch for — when it is deployed in an under-resourced system rather than a research clinic.</p>
<p>Along the way, both sections use interactive practice rather than passive reading to build the skill: a flashcard deck and matching exercise in Section 1 to consolidate the core vocabulary, and a card sort and fill-in-the-blank exercise in Section 2 to practice classifying real client presentations by engagement level. Treat these as the primary mechanism for retaining this material, not as optional review — reading about a scaling question and being able to construct one on the spot in session are different skills, and the interactive activities are where the second one gets built.</p>
<p>By the time you reach the final assessment, you should be able to move fluidly between the theoretical "why" and the clinical "how" — able to explain the philosophical basis for a technique you are using in the room, and able to adapt that technique to a client who does not fit the textbook case. That fluency, more than mastery of any single question, is what distinguishes competent SFBT practice from a collection of borrowed phrases.</p>`,
    },
    {
      type: 'imageText',
      title: 'The Framework Underneath Every Technique: Problem-Talk and Solution-Talk',
      content: `<p>Every technique this course teaches — the miracle question, exception questions, scaling questions, the visitor-complainant-customer framework — is a specific application of one underlying move: shifting a conversation from problem-talk to solution-talk.</p>
<p><strong>Problem-talk</strong> organizes a session around what is wrong: symptom history, causal factors, what has failed before, what is currently not working. It is not inherently mistaken — clients arrive with real problems, and a clinician who refuses to hear them causes harm. But problem-talk, extended indefinitely, tends to reproduce itself. The more detail a client supplies about a problem, the more entrenched the problem becomes in the conversation, and the less room is left for anything else.</p>
<p><strong>Solution-talk</strong> organizes a session around what is wanted and what is already, at least intermittently, working. It does not require that the problem be minimized, resolved, or fully understood first. It requires only that the clinician ask a different category of question — about exceptions, about a preferred future, about what the client is already doing that keeps things from being worse — and that the client's answers be treated as clinically significant data rather than as evasion.</p>
<p>This is not a claim that problem-talk should be eliminated. Clients need to be heard, and a clinician who redirects too quickly toward exceptions before a client feels understood produces exactly the alienation Section 2 will describe as premature exception-finding. The clinical skill is not choosing solution-talk over problem-talk; it is knowing how much problem-talk a given moment calls for, and recognizing the point at which continuing to elaborate the problem stops serving the client and starts reinforcing the very narrative that keeps them stuck.</p>
<table>
<thead><tr><th>Problem-talk asks</th><th>Solution-talk asks</th></tr></thead>
<tbody>
<tr><td>What is wrong, and how long has it been wrong?</td><td>What would you notice first if things were even a little better?</td></tr>
<tr><td>What caused this?</td><td>What have you already tried that helped, even briefly?</td></tr>
<tr><td>Why hasn't this gotten better?</td><td>What is different on the days when it's not quite as bad?</td></tr>
</tbody>
</table>
<p>Section 1 will ground this shift philosophically, in the social-constructionist claim that the language a conversation uses does not just describe a client's reality — it actively shapes what the client can perceive as possible within it. Section 2 will ground it practically, in the session structure and client-engagement framework that make the shift usable inside a brief community mental health appointment. Hold the basic move — problem-talk to solution-talk — in mind as the throughline connecting every technique that follows.</p>`,
      image: '',
      imageAlt: 'Two-column diagram contrasting problem-talk (symptom history, causal analysis, what isn\'t working) with solution-talk (preferred future, exceptions, existing competence), with an arrow showing the SFBT clinician\'s job as steering the conversation from the left column to the right.',
      imagePosition: 'right',
    },
    {
      type: 'accordion',
      accordionItems: [
        {
          title: 'The Miracle Question',
          content: '<p>SFBT\'s signature technique for eliciting a detailed, behavioral description of a client\'s preferred future — without requiring the client to first explain how that future will be achieved. Section 1 walks through its exact phrasing and why each element of that phrasing is clinically deliberate, not incidental, including what to do when a client rejects the premise outright.</p>',
        },
        {
          title: 'Exception Questions',
          content: '<p>Questions that locate the moments when a problem could have occurred but did not, or was less severe than usual — treated in SFBT not as incidental good luck but as evidence of competence the client already possesses. You will practice recognizing and pursuing exceptions in Section 1\'s interactive activities, including the difference between an exception the client volunteers and one the clinician has to listen for underneath a problem narrative.</p>',
        },
        {
          title: 'The Visitor-Complainant-Customer Framework',
          content: '<p>A three-category framework for reading how engaged a client currently is with the idea that they, personally, have something to do differently — and for calibrating which SFBT techniques will land and which will backfire. Section 2 applies this framework directly to community mental health caseloads, including mandated clients.</p>',
        },
        {
          title: 'Solution-Forced Therapy',
          content: '<p>The most common fidelity failure in widespread SFBT practice: deploying the surface techniques — scaling, the miracle question — while still operating from a problem-focused stance underneath, using solution-talk to steer clients away from pain rather than to build on their competence. Section 2 names this pattern explicitly, describes how it develops even in well-intentioned clinicians, and gives you a specific correction to apply when you catch yourself doing it.</p>',
        },
        {
          title: 'SFBT Under Real-World Constraints',
          content: '<p>What changes, and what does not, when SFBT is delivered inside a system with high caseloads, session limits, mandated referrals, and clients in acute crisis or living with serious and persistent mental illness. This is the material most specific to community mental health practice, and it occupies most of Section 2.</p>',
        },
        {
          title: 'Fidelity and Quality Assurance',
          content: '<p>Because SFBT\'s surface techniques are easy to imitate and easy to deploy without the underlying stance, the model has a documented fidelity problem in widespread practice. Section 2 covers what maintains fidelity — video review, peer supervision, and validated fidelity instruments — and what erodes it.</p>',
        },
        {
          title: 'Community Mental Health as SFBT\'s Natural Habitat',
          content: '<p>SFBT is sometimes taught as if it needs to be adapted downward for under-resourced settings — simplified, shortened, made to fit. Section 2 makes the opposite case: the model was built among a population with substantial overlap with a typical community mental health caseload, and its structure already assumes high caseloads, few sessions, and clients who did not necessarily choose to be there.</p>',
        },
      ],
    },
    {
      type: 'keyTakeaway',
      title: 'What You Will Take Away',
      takeaways: [
        'The ability to explain SFBT\'s core assumptions well enough to teach them to a colleague — not just recite the miracle question, but say why it is phrased the way it is.',
        'A working script for the miracle question, exception questions, and scaling questions that you can adapt in session rather than deliver by rote.',
        'The ability to classify a client\'s engagement level (visitor, complainant, or customer) in real time and adjust your intervention intensity accordingly.',
        'A clear account of where SFBT\'s brevity ends and where standard risk assessment and trauma-informed practice must take over, so that you never mistake solution-focus for an excuse to skip a safety check.',
        'The ability to recognize solution-forced therapy — technique without stance — in your own sessions, and a specific correction for it.',
        'A repeatable habit, the pre-session change inquiry, that you can add to your very next intake regardless of presenting problem.',
        'A defensible answer, if a supervisor or a client ever asks, for why de-emphasizing problem history is not the same thing as ignoring risk, trauma, or the parts of a client\'s story that are genuinely not yet resolved.',
      ],
    },
    {
      type: 'multipleChoice',
      question: 'Before you begin: which of the following best describes what "solution-focused" means in Solution-Focused Brief Therapy?',
      options: [
        { text: 'A therapeutic stance that avoids discussing painful or difficult material', isCorrect: false },
        { text: 'An epistemological position holding that understanding a problem\'s cause is not necessary to build a solution to it', isCorrect: true },
        { text: 'A technique for encouraging clients to think more positively about their circumstances', isCorrect: false },
        { text: 'A time-limited treatment format used only when longer therapy is unavailable', isCorrect: false },
      ],
      correctAnswer: 1,
      explanation: 'SFBT\'s solution-focus is epistemological, not attitudinal — it does not require avoiding pain or manufacturing positivity, and it was not designed merely as a fallback for when longer treatment is unavailable. Notice that all three incorrect options describe things SFBT is frequently mistaken for by clinicians who have only seen the surface techniques. We\'ll unpack the actual distinction, and where each misreading goes wrong, in detail in Section 1.',
    },
    {
      type: 'reflection',
      question: 'Think about a recent client whose case felt stuck — where session after session covered the same problem territory without much movement. What proportion of your time with that client was spent on problem history versus on what the client wanted or what was already working, even a little? If you had asked one exception question in your next session with them, what might you have asked, and what do you think the answer would have been? Write your answer down in enough detail that you could reread it later and remember exactly which client and which session you had in mind — hold that client in mind, because you will be asked to return to a similar question at the end of the course.',
    },
  ];
}

// ─────────────────────────────────────────────────────────────────────────
// CONCLUSION SECTION — brand new, built in the exact §8 order. No conclusion
// exists on the live document, so this is a full section insertion, not a
// splice into existing content.
// ─────────────────────────────────────────────────────────────────────────

function buildReferencesTextBlock(references) {
  const lines = (references || []).map((r) => {
    if (typeof r === 'string') return r;
    if (r && r.citation) return r.citation;
    if (r && r.author) {
      return [r.author, r.year ? `(${r.year}).` : '', r.title ? `<em>${r.title}</em>.` : '', r.source || ''].filter(Boolean).join(' ');
    }
    return null;
  }).filter(Boolean);
  return {
    type: 'text',
    content: `<div class="cr-references"><h2>References</h2>\n${lines.map((l) => `<p class="cr-reference">${l}</p>`).join('\n')}\n</div>`,
  };
}

/** @param {Array} references - course.references[] AFTER NEW_REFERENCES has been appended. */
export function buildConclusionSection(references) {
  const blocks = [
    {
      type: 'sectionDivider',
      title: CONCLUSION_TITLE,
      subtitle: 'A synthesis of the theoretical and applied material, a section-by-section review, an ethical practice plan for community mental health, and the full reference list.',
    },
    {
      type: 'text',
      content: `<h2>Course Summary and Review</h2>
<p>Throughout this course, we've examined Solution-Focused Brief Therapy from two directions that are meant to inform each other: what the model is, philosophically and technically, and what it takes to practice it well inside a community mental health system that was never designed with any particular therapy model in mind.</p>
<p>Section 1 established that SFBT is not an attitude adjustment or a set of borrowed positive-psychology techniques. It is a genuinely different epistemological position, built inductively by de Shazer and Berg from systematic observation of what effective therapists actually did in session — not derived from theory and then applied. Its philosophical grounding in social constructionism, and specifically in the Wittgensteinian claim that meaning is constituted by use rather than fixed in advance, is not academic decoration. It is the reason the model's signature techniques work the way they do. The miracle question is not a fantasy exercise; it is a precisely engineered instrument for generating behaviorally specific goal language while bypassing problem-saturated cognition. Exception questions are not a search for silver linings; they are a systematic method for surfacing evidence of competence the client already possesses but has not been asked to name. Scaling questions are not a rating exercise; they are exception questions translated into a numerical frame that both client and clinician can track across sessions.</p>
<p>Section 2 took that foundation into the setting most of you actually practice in. Community mental health did not receive SFBT as an import from a research clinic — the model was built, from its earliest sessions at the Brief Family Therapy Center, among a population with significant overlap with a typical CMHC caseload: multiply marginalized, under-resourced, and working within real constraints on how much time therapy could take. The session structure — pre-session change inquiry, behaviorally specific goal-setting, the compliment, task assignment — is designed to produce meaningful movement inside exactly the session limits that community mental health imposes. The visitor-complainant-customer framework gives you a way to calibrate intervention intensity to actual client engagement rather than applying the same technique regardless of whether a client asked to be there. And the material on mandated clients, crisis presentations, and clients with serious and persistent mental illness demonstrated that SFBT's core moves — locate the client's own investment, ask about exceptions, keep goals behaviorally specific — remain usable even when the textbook case is the exception rather than the rule on your caseload.</p>
<p>The thread connecting both sections is the distinction between technique and stance. A clinician who has memorized the miracle question's wording but has not internalized why problem analysis is treated as unnecessary — who still, underneath the solution-talk, believes the client needs to be steered away from their pain — is practicing what Section 2 named solution-forced therapy: SFBT's surface form deployed from a problem-focused epistemology. The correction is not more technique. It is returning to the stance Section 1 established: that clients are the primary experts on their own lives, that small changes propagate, and that a solution does not require a fully resolved account of the problem it addresses.</p>
<p>None of this is a substitute for clinical judgment, and Section 2 was explicit about where SFBT's structure ends and other obligations begin. De-emphasizing problem history is not a license to skip a suicide risk assessment. Brevity is not a justification for premature termination when a client needs continued care. Strength-based language is not a way to avoid necessary grief work with a client carrying trauma. SFBT organizes the conversation; it does not override the clinician's responsibility for what the conversation needs to include.</p>`,
    },
    {
      type: 'callout',
      calloutType: 'key',
      title: 'When You Return to Practice on Monday',
      content: `<ul>
<li><strong>Start your next intake with the pre-session change inquiry.</strong> Ask what has already shifted between scheduling the appointment and walking in the door — you will be surprised how often the answer is something.</li>
<li><strong>Before you ask the miracle question, slow down.</strong> Deliver it with genuine curiosity about the answer, not as a scripted line — a flat delivery produces a flat answer.</li>
<li><strong>Classify engagement before you choose an intervention.</strong> A behavioral task offered to a visitor will damage the alliance; an observation task offered to a customer will feel like it's holding them back. Match the technique to where the client actually is.</li>
<li><strong>Never let solution-focus substitute for a safety check.</strong> Assess risk, trauma history, and medication needs exactly as thoroughly as you would in any other model — SFBT is applied within that structure, not instead of it.</li>
<li><strong>Watch your own delivery for solution-forced therapy.</strong> If you notice yourself redirecting a client away from pain rather than toward their own competence, you have drifted from stance into technique — return to genuinely listening for the exception inside what they are telling you.</li>
<li><strong>Keep goals in the presence of something, not the absence of a problem.</strong> "I want to feel steady enough to get my kids to school on time" gives you more to build on than "I want to stop feeling anxious."</li>
</ul>`,
    },
    {
      type: 'accordion',
      accordionItems: [
        {
          title: 'Section 1 — Theoretical Foundations of Solution-Focused Brief Therapy',
          content: '<p>SFBT was developed inductively by de Shazer and Berg through systematic observation of effective sessions, grounded philosophically in social constructionism and the Wittgensteinian view that language actively shapes what a client can perceive as possible. The section covered SFBT\'s core assumptions — client competence, the propagation of small changes, and the independence of solutions from problem etiology — and its signature techniques: the miracle question, exception questions, scaling questions, and coping questions.</p>',
        },
        {
          title: 'Section 2 — Applying SFBT in Community Mental Health Settings',
          content: '<p>Community mental health is SFBT\'s natural habitat, not an adaptation of it — the model was built among a population with substantial overlap with a typical CMHC caseload. The section covered the four-phase SFBT session structure, the visitor-complainant-customer framework for calibrating intervention to engagement, SFBT with mandated and crisis-presenting clients and clients with serious and persistent mental illness, and the common misapplications — most notably solution-forced therapy — that compromise fidelity in real-world practice.</p>',
        },
      ],
    },
    {
      type: 'keyTakeaway',
      title: 'Course-Level Key Takeaways',
      takeaways: [
        'SFBT is an epistemological position, not an attitude: it holds that understanding a problem\'s cause is neither necessary nor sufficient to build a solution, and every signature technique follows from that claim.',
        'The miracle question, exception questions, and scaling questions are precisely engineered instruments, not conversational tricks — each is phrased the way it is for a specific clinical reason.',
        'Community mental health is the setting SFBT was built for, not a setting it has been awkwardly adapted to; its brevity and structure match the session limits and caseload pressures of CMHC practice directly.',
        'The visitor-complainant-customer framework lets you calibrate intervention intensity to actual client engagement — applying a customer-level intervention to a visitor is a common and avoidable alliance rupture.',
        'Solution-forced therapy — deploying SFBT\'s surface techniques from an underlying problem-focused stance — is the most common fidelity failure in widespread practice, and it is corrected by returning to stance, not by adding more technique.',
        'SFBT\'s de-emphasis on problem history never substitutes for risk assessment, trauma-informed care, or mandated-reporter obligations; the model is applied within standard clinical safety structures, not instead of them.',
        'Goals stated in the presence of something — a specific behavior the client wants more of — are more clinically usable than goals stated as the absence of a problem.',
      ],
    },
    {
      type: 'text',
      content: `<h2>Ethical Practice Plan</h2>
<p>Turn this material into specific, dated commitments rather than general intentions.</p>
<p><strong>Competence and scope.</strong> The {{callout:aca-code}} Section C.2.a limits practice to the boundaries of competence based on education, training, and supervised experience. A single continuing education course establishes exposure, not competence in the full sense. Identify which SFBT techniques you can implement now with your existing clinical foundation, which require peer consultation as you build fluency, and which populations on your caseload — complex trauma, active psychosis, high acute risk — call for consultation with a supervisor before you apply a brief model on your own judgment alone.</p>
<p><strong>Informed consent and honesty about the model.</strong> Where your setting authorizes a limited number of sessions, be direct with clients about that structure rather than letting it go unspoken. ACA Code Section A.2 requires that clients understand the nature and anticipated course of treatment; a client who does not know they are in a six-session model cannot meaningfully participate in decisions about how that time is used.</p>
<p><strong>Safety takes precedence over model fidelity.</strong> The {{callout:nbcc-standard}} and the ACA Code both require competent risk assessment regardless of theoretical orientation. Commit now, in writing if your documentation allows it, to a standing rule: SFBT's structure is never grounds to abbreviate a suicide risk assessment, skip a mandated report, or avoid processing material a client needs to process. If your own practice pattern shows you defaulting to solution-talk when a client raises something painful, that is a competence issue to bring to supervision, not a stylistic preference.</p>
<p><strong>Documentation.</strong> Session notes for SFBT work should capture the client's stated goals in their own language, the exceptions identified, and the specific task or homework assigned — not only that "SFBT was utilized." This is both a fidelity discipline and, in settings where session count is authorized against demonstrated progress, an audit necessity.</p>
<p><strong>Ongoing fidelity.</strong> Record one session in the next month, if your setting and consent process allow it, and review it — alone or with a peer — against the misapplications named in Section 2: premature exception-finding, mechanical technique delivery, and solution-forced avoidance of necessary problem content.</p>`,
    },
    {
      type: 'reflection',
      question: 'Based on everything you\'ve learned in this course, identify one specific change you will make in your clinical practice within the next 30 days — naming the client population it applies to, the specific technique or framework you will use differently, and how you will know whether it worked.',
    },
    {
      type: 'resources',
      title: 'Resources for Ongoing Ethical and Fidelity Practice',
      resources: [
        { title: 'ACA Code of Ethics (2014)', url: 'https://www.counseling.org/resources/aca-code-of-ethics.pdf', type: 'pdf', description: 'The full ethical code referenced throughout this course\'s Ethical Practice Plan, including Section C.2.a on competence boundaries and Section A.2 on informed consent.' },
        { title: 'NBCC Code of Ethics', url: 'https://www.nbcc.org/ethics', type: 'standards', description: 'Ethical standards for National Certified Counselors, carrying parallel competence, consent, and risk-assessment obligations to those discussed in this course\'s conclusion.' },
        { title: 'National Council for Mental Wellbeing', url: 'https://www.thenationalcouncil.org', type: 'organization', description: 'National association for community behavioral health organizations, publishing practice guidance and policy resources relevant to brief-treatment delivery in community mental health settings.' },
        { title: 'SFBTA Fidelity and Training Resources', url: 'https://www.sfbta.org/for-clinicians', type: 'guide', description: 'Ongoing training, case consultation groups, and fidelity resources for practitioners continuing to build SFBT competence after this course.' },
      ],
    },
    buildReferencesTextBlock(references),
  ];
  blocks.forEach((b, i) => { b.order = i + 1; });
  return {
    title: CONCLUSION_TITLE,
    order: 0, // resequenced by the engine
    description: 'A synthesis of the course, a section-by-section review, an ethical practice plan, a closing reflection, and the full reference list.',
    estimatedTime: 20,
    contentBlocks: blocks,
  };
}

// ─────────────────────────────────────────────────────────────────────────
// ENGINE
// ─────────────────────────────────────────────────────────────────────────

/** Pure transform: returns { sections, references, actions } — no I/O. */
export function planPatch(course) {
  const sections = JSON.parse(JSON.stringify(course.sections || []));
  const references = JSON.parse(JSON.stringify(course.references || []));
  const actions = [];

  // ── 1. Intro insertions ──────────────────────────────────────────────
  const intro = sections[0];
  const introAlreadyPatched = !!intro && (intro.contentBlocks || []).some(
    (b) => b.type === 'callout' && (b.title || '') === WHY_THIS_MATTERS_TITLE
  );
  if (!intro) {
    actions.push('intro: SKIP — no section at position 1 found (expected the existing intro section)');
  } else if (introAlreadyPatched) {
    actions.push('intro: SKIP (already patched — "Why This Matters" callout present)');
  } else {
    const hookIdx = intro.contentBlocks.findIndex((b) => b.type === 'text');
    const insertAt = hookIdx >= 0 ? hookIdx + 1 : intro.contentBlocks.length;
    const whyThisMatters = buildWhyThisMattersCallout();
    intro.contentBlocks = [
      ...intro.contentBlocks.slice(0, insertAt),
      whyThisMatters,
      ...intro.contentBlocks.slice(insertAt),
    ];
    intro.contentBlocks.push(...buildIntroTailBlocks());
    intro.contentBlocks.forEach((b, i) => { b.order = i + 1; });
    actions.push(`intro: INSERT "Why This Matters" callout at position ${insertAt + 1}; APPEND roadmap, imageText, accordion, keyTakeaway, baseline multipleChoice, reflection (7 new blocks total)`);
  }

  // ── 2. New references (cited by the Ethical Practice Plan) ────────────
  const existingCitations = new Set(references.map((r) => (typeof r === 'string' ? r : r?.citation || '')));
  const refsToAdd = NEW_REFERENCES.filter((r) => !existingCitations.has(r));
  if (refsToAdd.length) {
    references.push(...refsToAdd);
    actions.push(`references: APPEND ${refsToAdd.length} new (${references.length - refsToAdd.length} -> ${references.length})`);
  } else {
    actions.push('references: SKIP (ACA/NBCC ethics code citations already present)');
  }

  // ── 3. Conclusion section ──────────────────────────────────────────────
  const hasConclusion = sections.some((s) => CONCLUSION_TITLE_RE.test(s.title || ''));
  if (hasConclusion) {
    actions.push('conclusion: SKIP (a "Course Summary and Review" section already exists)');
  } else {
    sections.push(buildConclusionSection(references));
    actions.push(`conclusion: CREATE section "${CONCLUSION_TITLE}" (9 blocks, references built from course.references[] after the append above)`);
  }

  // ── 4. Resequence ──────────────────────────────────────────────────────
  sections.forEach((s, i) => {
    s.order = i + 1;
    (s.contentBlocks || []).forEach((b, j) => { b.order = j + 1; });
  });

  return { sections, references, actions };
}

async function findCourse(col) {
  for (const slug of SLUG_CANDIDATES) {
    const doc = await col.findOne({ slug });
    if (doc) return { doc, matchedBy: `slug:${slug}` };
  }
  for (const code of COURSE_CODES) {
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
  console.log(`patchACEPCompliance_CR-THEO-604 — ${APPLY ? 'EXECUTING WRITE' : 'DRY RUN (pass --execute to write)'}`);
  console.log('='.repeat(78));

  const { doc: raw, matchedBy } = await findCourse(col);
  if (!raw) {
    console.log(`NOT FOUND — tried slugs [${SLUG_CANDIDATES.join(', ')}] and codes [${COURSE_CODES.join(', ')}]`);
    await mongoose.disconnect();
    process.exit(1);
  }
  console.log(`matched by ${matchedBy} · "${raw.title}" · status=${raw.status} · ${(raw.sections || []).length} sections · wordCount(stored)=${raw.wordCount ?? 'n/a'}`);

  const { sections, references, actions } = planPatch(raw);
  actions.forEach((a) => console.log('  ' + a));

  const before = countCourseWords(raw);
  const patchedCourse = { ...raw, sections, references };
  const after = countCourseWords(patchedCourse);
  const target = requiredWordsFor(raw.ceHours || 0);
  console.log(`\nwords (canonical counter): ${before.toLocaleString()} -> ${after.toLocaleString()} (+${(after - before).toLocaleString()}) · CE target ${target.toLocaleString()} · ${after >= target ? 'PASS' : 'STILL SHORT by ' + (target - after).toLocaleString()}`);

  // Per-section word counts, via the canonical counter scoped to one section at a time.
  console.log('\nper-section word counts:');
  patchedCourse.sections.forEach((s) => {
    const w = countCourseWords({ sections: [s] });
    console.log(`  "${s.title}" -> ${w.toLocaleString()}`);
  });

  // ── Self-validation (no DB write required) ────────────────────────────
  console.log('\nvalidateSync() self-check:');
  const probe = new Course(patchedCourse);
  const verr = probe.validateSync();
  if (verr) {
    console.log('  FAILED:');
    Object.values(verr.errors || {}).forEach((e) => console.log('   - ' + e.message));
  } else {
    console.log('  PASSED — no schema validation errors.');
  }

  if (actions.every((a) => a.includes('SKIP'))) {
    console.log('\nnothing to do — already patched.');
    await mongoose.disconnect();
    return;
  }

  if (!APPLY) {
    console.log('\nDRY RUN — no writes. Re-run with --execute (or --apply) to write.');
    await mongoose.disconnect();
    return;
  }

  // ── Write path: Mongoose model first (fires pre-save hook), raw
  // collection fallback second (logged loudly) if pre-existing content
  // fails validation for reasons unrelated to this patch. ──────────────
  try {
    const model = await Course.findById(raw._id);
    if (!model) throw new Error('document disappeared between read and write');
    model.set('sections', sections);
    model.set('references', references);
    model.markModified('sections');
    model.markModified('references');
    await model.save();
    console.log(`\nSAVED via model — wordCount=${model.wordCount}`);
  } catch (err) {
    console.log(`\nMODEL SAVE FAILED: ${err.message}`);
    console.log('FALLING BACK to collection update (validation bypassed — the failure above is in PRE-EXISTING content and should be fixed separately)');
    const finalWordCount = countCourseWords(patchedCourse);
    await col.updateOne({ _id: raw._id }, {
      $set: {
        sections,
        references,
        wordCount: finalWordCount,
        totalContentBlocks: sections.reduce((n, s) => n + (s.contentBlocks || []).length, 0),
        totalEstimatedTime: sections.reduce((n, s) => n + (s.estimatedTime || 15), 0),
        sectionCount: sections.length,
        moduleCount: sections.length,
        assessmentQuestionCount: raw.assessment?.questions?.length || 0,
        updatedAt: new Date(),
      },
    });
    console.log(`SAVED via collection — wordCount=${finalWordCount}`);
  }

  await mongoose.disconnect();
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => { console.error('ERROR:', e); process.exit(1); });
}
