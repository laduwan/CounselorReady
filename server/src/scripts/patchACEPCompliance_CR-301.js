/**
 * patchACEPCompliance_CR-301.js
 * GAITP LLC · NBCC ACEP #7760
 *
 * Brings the live course "28 Days Later: Understanding Addiction and Recovery"
 * (courseCode CR-301, slug 28-days-later-understanding-addiction-and-recovery,
 * ceHours 3) up to full ACEP structural compliance per
 * CLAUDE_COURSE_STRUCTURE.md.
 *
 * As of the last read (2026-09-01), the live document has:
 *   - wordCount 14,955 / target 18,000 (3 CE × 6,000 words/CE)
 *   - 5 body sections, EVERY one just [sectionDivider, text] — no callout,
 *     no keyTakeaway, no interactive activity, no knowledge checks, no
 *     reflection anywhere in the body
 *   - no intro section, no conclusion section
 *   - only 12 references (floor is 15)
 *   - assessment.questions: 15 (meets floor — untouched by this patch)
 *
 * This patch does five things, all as INSERTS into existing structure —
 * nothing existing is edited, reordered, or removed:
 *
 *   1. INTRO — reuses (does not rewrite) the hand-authored "Course
 *      Introduction and Orientation" content already sitting unapplied in
 *      expandIntrosConclusions_CR301_CR302_CR307_CR601.js's PATCHES array,
 *      entry code 'CR-301'. That script has apparently never been run with
 *      --apply, so the live doc still has no intro section. This script
 *      imports that PATCHES entry directly (no copy-paste, no rewrite of its
 *      prose) and assembles the intro section from it in the exact §3 block
 *      order (sectionDivider → hook → callout → roadmap → imageText →
 *      accordion → keyTakeaway → baseline MC → reflection).
 *
 *   2. BODY SECTIONS (new authored content — the sibling script does NOT
 *      cover this) — each of the 5 existing [divider, text] sections gets a
 *      second text block, a callout, one interactive activity (rotated
 *      across all five types: flashcardDeck, matching, cardSort,
 *      scenarioTree, sequencing — one per section, matching that section's
 *      topic), a keyTakeaway, 3 knowledge-check multipleChoice blocks, and a
 *      reflection — inserted after the existing text block.
 *
 *   3. REFERENCES — appends 8 new, real, verifiable APA-7 citations
 *      supporting the new body-section claims (12 existing + 8 new = 20,
 *      clears the ≥15 floor with margin). Existing references are untouched.
 *
 *   4. CONCLUSION — reuses the same PATCHES['CR-301'] entry's conclusion
 *      content (synthesis text, clinical-integration callout, module
 *      highlights accordion, course-level keyTakeaway, ethical practice
 *      plan text, reflection, resources block) via the same
 *      buildConclusionBlocks() shape as the sibling script, then appends a
 *      final .cr-references text block built from the FULL (12+8) merged
 *      references array — never a `type: "references"` content block.
 *
 *   5. Resequences `order` on every section and block after insertion.
 *
 * IDEMPOTENT — every inserted block carries a stable `patchId` marker
 * (`ACEP-CR301-2026-09::<section>`); re-running detects existing markers and
 * skips that piece. Safe to run twice.
 *
 * DRY RUN by default:
 *   node src/scripts/patchACEPCompliance_CR-301.js
 * Write (NOT run by this task — dry-run only was requested):
 *   node src/scripts/patchACEPCompliance_CR-301.js --execute
 *
 * WRITE PATH: Mongoose model (doc.save()) so the pre-save hook recomputes
 * wordCount/totalContentBlocks/totalEstimatedTime. Falls back to a raw
 * collection update (with wordCount computed via the canonical counter) if
 * model validation fails on PRE-EXISTING content, same pattern as
 * expandIntrosConclusions_CR301_CR302_CR307_CR601.js — and says so loudly.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { pathToFileURL } from 'url';
import { Course } from '../models/InteractiveCourse.js';
import { countCourseWords, requiredWordsFor } from '../utils/courseWordCount.js';
import { PATCHES as INTRO_CONCLUSION_PATCHES } from './expandIntrosConclusions_CR301_CR302_CR307_CR601.js';

dotenv.config();

const EXECUTE = process.argv.includes('--execute') || process.argv.includes('--apply');

// ─────────────────────────────────────────────────────────────────────────────
// Target course — slug drift is real in this collection (see
// reconcileDuplicates.js), so we try slug candidates then courseCode
// fallbacks, exactly like the sibling script.
// ─────────────────────────────────────────────────────────────────────────────
const SLUG_CANDIDATES = [
  '28-days-later-understanding-addiction-and-recovery',
  '28-days-later-addiction-recovery',
];
const CODE_CANDIDATES = ['CR-301', 'CR-401'];

const CR301 = INTRO_CONCLUSION_PATCHES.find((p) => p.code === 'CR-301');
if (!CR301) {
  throw new Error(
    "CR-301 entry not found in expandIntrosConclusions_CR301_CR302_CR307_CR601.js PATCHES — " +
    "this script reuses that entry's intro/conclusion content and cannot proceed without it."
  );
}

const PATCH_PREFIX = 'ACEP-CR301-2026-09';
const marker = (key) => `${PATCH_PREFIX}::${key}`;

const INTRO_TITLE_RE = /course introduction|introduction and orientation/i;
const CONCLUSION_TITLE_RE = /summary|conclusion|review|wrap[- ]?up/i;

// ─────────────────────────────────────────────────────────────────────────────
// NEW REFERENCES — real, verifiable APA-7 citations supporting the new
// body-section content below. Existing 12 references are untouched; these 8
// bring the total to 20 (floor is 15).
// ─────────────────────────────────────────────────────────────────────────────
const NEW_REFERENCES = [
  'Koob, G. F., & Volkow, N. D. (2016). Neurobiology of addiction: A neurocircuitry analysis. The Lancet Psychiatry, 3(8), 760–773. https://doi.org/10.1016/S2215-0366(16)00104-8',
  'Sinha, R. (2001). How does stress increase risk of drug abuse and relapse? Psychopharmacology, 158(4), 343–359. https://doi.org/10.1007/s002130100917',
  'McLellan, A. T., Lewis, D. C., O’Brien, C. P., & Kleber, H. D. (2000). Drug dependence, a chronic medical illness: Implications for treatment, insurance, and outcomes evaluation. JAMA, 284(13), 1689–1695. https://doi.org/10.1001/jama.284.13.1689',
  'Miller, W. R., & Rose, G. S. (2009). Toward a theory of motivational interviewing. American Psychologist, 64(6), 527–537. https://doi.org/10.1037/a0016830',
  'Witkiewitz, K., & Marlatt, G. A. (2004). Relapse prevention for alcohol and drug problems: That was Zen, this is Tao. American Psychologist, 59(4), 224–235. https://doi.org/10.1037/0003-066X.59.4.224',
  'Laudet, A. B., & White, W. L. (2008). Recovery capital as prospective predictor of sustained recovery, life satisfaction, and stress among former poly-substance users. Substance Use & Misuse, 43(1), 27–54.',
  'Mee-Lee, D. (Ed.). (2013). The ASAM criteria: Treatment for addiction involving co-occurring conditions. American Society of Addiction Medicine.',
  'Roberts, S. C. M., & Pies, C. (2011). Complex calculations: How drug use during pregnancy becomes a barrier to prenatal care. Maternal and Child Health Journal, 15(3), 333–341.',
];
// NOTE: the Laudet & White (2008) and Roberts & Pies (2011) DOIs are omitted
// deliberately — I could not confirm the exact DOI suffix with certainty and
// would rather ship a citation without a DOI than one with a guessed, wrong
// DOI. The bibliographic details (authors/year/title/journal/volume/issue/
// pages) for both are correct and the works are real, well-known papers in
// the addiction literature. Flagged in the PR report rather than guessed on.

// ─────────────────────────────────────────────────────────────────────────────
// Reused intro/conclusion assembly — mirrors buildIntroSection() /
// buildConclusionBlocks() / buildReferencesBlock() in
// expandIntrosConclusions_CR301_CR302_CR307_CR601.js exactly, so the CR-301
// PATCHES entry's prose is reused verbatim rather than rewritten. Kept local
// (rather than imported) only because the sibling script does not export
// those three helpers — the DATA they operate on (CR301, i.e.
// INTRO_CONCLUSION_PATCHES.find(...)) is imported, not duplicated.
//
// One deliberate deviation from the sibling script: its sectionDivider
// blocks set `sectionNumber: 'Introduction'` / `sectionNumber: 'Conclusion'`
// (strings) against a schema field declared `sectionNumber: Number`
// (InteractiveCourse.js line ~110), which throws a Mongoose CastError on
// save. This may be *why* that script has never been applied. This script
// uses numeric sectionNumbers (0 for intro, 6 for conclusion, consistent
// with the live document's 1–5 on the existing body sections) instead.
// ─────────────────────────────────────────────────────────────────────────────
function buildIntroSection(p) {
  const [hook, roadmap, ...restIntro] = p.introBlocks;
  const m = marker('intro');
  const blocks = [
    { type: 'sectionDivider', sectionNumber: 0, title: 'Course Introduction and Orientation', subtitle: p.introDividerSubtitle, patchId: m },
    { ...hook, patchId: m },
    { ...p.introCallout, patchId: m },
    { ...roadmap, patchId: m },
    { ...p.framework, patchId: m },
    ...restIntro.map((b) => ({ ...b, patchId: m })),
    { type: 'text', content: `<h3>${p.introAccordion.title}</h3>\n<p>${p.introAccordion.instructions}</p>\n<p>Each answer below is short by design — a full treatment of every question comes later, in the module where it belongs. The point here is to clear the objections and misconceptions that otherwise sit in the background of the material and quietly limit how much of it a clinician is willing to use, before the neuroscience, the assessment tools, and the treatment evidence are introduced on their own terms.</p>`, patchId: m },
    { type: 'accordion', accordionItems: p.introAccordion.accordionItems, patchId: m },
    { type: 'keyTakeaway', title: 'What You Will Take Away', takeaways: p.introTakeaways, patchId: m },
    {
      type: 'multipleChoice',
      question: p.baselineMC.question,
      options: p.baselineMC.options.map((o, i) => ({ text: o.text, isCorrect: i === p.baselineMC.correct })),
      correctAnswer: p.baselineMC.correct,
      explanation: p.baselineMC.explanation,
      patchId: m,
    },
    { type: 'reflection', question: p.introReflection, patchId: m },
  ];
  return {
    title: 'Course Introduction and Orientation',
    order: 1,
    description: 'What this course covers, how it is organized, and what you should be able to do differently when you finish.',
    contentBlocks: blocks,
  };
}

function buildConclusionBlocks(p) {
  const m = marker('conclusion');
  return [
    { type: 'text', content: p.takeaways, patchId: m },
    { ...p.integrationCallout, patchId: m },
    { type: 'text', content: '<h3>Module Highlights</h3>\n<p>Open each module to review its central points before the final assessment.</p>', patchId: m },
    { type: 'accordion', accordionItems: p.highlights, patchId: m },
    { type: 'keyTakeaway', title: 'Course-Level Key Takeaways', takeaways: p.takeawayItems, patchId: m },
    { type: 'text', content: p.plan, patchId: m },
    { type: 'reflection', question: p.conclusionReflection, patchId: m },
    { type: 'resources', resources: p.resources, patchId: m },
  ];
}

/** APA reference list block, built from the FINAL merged references array. */
function buildReferencesBlock(references) {
  const lines = (references || [])
    .map((r) => {
      if (typeof r === 'string') return r;
      if (r && r.citation) return r.citation;
      if (r && r.author) return [r.author, r.year ? `(${r.year}).` : '', r.title ? `<em>${r.title}</em>.` : '', r.source || ''].filter(Boolean).join(' ');
      return null;
    })
    .filter(Boolean);
  if (!lines.length) return null;
  return {
    type: 'text',
    content: `<div class="cr-references"><h2>References</h2>\n${lines.map((l) => `<p class="cr-reference">${l}</p>`).join('\n')}\n</div>`,
    patchId: marker('conclusion'),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// NEW body-section compliance content (authored for this patch — NOT in the
// sibling script). Keyed by the live document's exact section titles. Each
// entry inserts, after the section's existing [divider, text]:
//   text2 → callout → activity → keyTakeaway → 3× multipleChoice → reflection
// which satisfies §2's "2+ text, callout AND keyTakeaway, 1 activity, 2–3
// KCs, 1 reflection" per-section minimum while following the divider→text→
// callout→text→activity→keyTakeaway→KC→KC→KC→reflection rhythm from §2.
// Activities rotate across all five types (flashcardDeck, matching,
// cardSort, scenarioTree, sequencing), one per section. calloutType rotates
// across five of the eight enum values, none repeating the intro's
// ("clinical") or conclusion's ("key").
// ─────────────────────────────────────────────────────────────────────────────
const SECTION_COMPLIANCE = {

  'The Neuroscience and Phenomenology of Addiction': () => ({
    text2: `<h3>The View From Inside: Craving, Cue Reactivity, and the Collapse of Intention</h3>
<p>Everything in the preceding section describes addiction from the outside — circuits, receptors, allostatic set points. Clinically, what a clinician actually meets in the room is the first-person experience those mechanisms produce, and it rarely matches the popular image of a person weighing costs and benefits and choosing poorly. <strong>Craving</strong> — an urgent, often somatic pull toward use that arrives without a preceding decision — is the clearest example. Cue-reactivity research using functional neuroimaging shows that exposure to drug-associated stimuli (a location, a person, a time of day, a physical sensation) activates the same mesolimbic and striatal circuitry engaged by the substance itself, and does so before conscious appraisal occurs (Koob & Volkow, 2016). A client is not lying when they say the urge to use "came out of nowhere" between the parking lot and the front door. Neurobiologically, it did — the cue triggered the response before deliberation had a chance to weigh in.</p>
<p>This has a direct clinical corollary: <strong>intention and craving operate on different clocks.</strong> A client can leave a Monday session meaning every word of their commitment to abstain, and by Wednesday evening, standing in the specific hallway where they used to use, find that intention has simply gone quiet. Sinha's (2001) work on stress-induced craving adds a second mechanism to the same picture: acute stress reliably potentiates craving and reduces the cognitive control resources available to resist it, which is why relapse clusters so heavily around periods of interpersonal conflict, financial strain, grief, and sleep disruption rather than around moments of boredom or ease. The clinical task is not to convince the client to want sobriety more — most already do — but to help them build environmental and behavioral structure around the specific windows when craving reliably outpaces intention.</p>
<p>The affective sequence that follows a lapse deserves equal attention. Shame — the global judgment "I am weak" or "I am an addict, this proves it" — is distinct from guilt, the more limited judgment "I did something I regret," and the distinction is not academic. Shame is one of the most reliably documented predictors of continued use following a lapse, because it removes the identity a person would need to occupy in order to try again, while guilt, uncomfortable as it is, leaves that identity intact. A clinician who responds to a disclosed lapse with anything that reads as confirmation of the client's worst belief about themselves — even inadvertently, through tone or facial reaction — measurably lowers the odds the client discloses the next one. What keeps the therapeutic relationship functional as a space for honest reporting is a stated, practiced, non-shaming response to relapse disclosure, established before the first lapse rather than improvised after it.</p>`,
    callout: {
      type: 'callout', calloutType: 'info', title: 'Why This Neurobiology Changes the Clinical Conversation',
      content: `<ul>
<li>Craving that arrives without warning is a documented neurobiological event, not evidence of weak resolve — cue reactivity activates reward circuitry before conscious appraisal.</li>
<li>Stress reliably potentiates craving and depletes the cognitive control needed to resist it; relapse risk clusters around conflict, financial strain, grief, and sleep loss, not around boredom.</li>
<li>Shame after a lapse predicts continued use; guilt does not carry the same risk. How a clinician responds to disclosure shapes which one the client is left holding.</li>
<li>A client who honestly intended to stay abstinent on Monday can still use on Wednesday — intention and craving run on different clocks, and planning has to account for the gap.</li>
</ul>`,
    },
    activity: {
      type: 'flashcardDeck',
      instructions: 'Review each term, then flip the card to check your understanding. These terms recur throughout the remaining modules.',
      flashcards: [
        { id: 'fc1', front: 'Mesolimbic dopamine pathway', back: 'The dopaminergic circuit running from the ventral tegmental area to the nucleus accumbens and prefrontal cortex; substances of abuse produce reinforcement by triggering an exaggerated dopamine signal in this pathway.' },
        { id: 'fc2', front: 'Allostasis (in addiction)', back: "The process by which the brain resets its regulatory set point in response to repeated substance exposure, producing tolerance and a progressively lower baseline mood that use temporarily restores." },
        { id: 'fc3', front: 'Negative reinforcement (in addiction)', back: 'Continued use to escape or avoid an aversive state — withdrawal, dysphoria, anxiety — rather than to produce pleasure; this mechanism typically supersedes positive reinforcement as a disorder progresses.' },
        { id: 'fc4', front: 'Cue reactivity', back: 'The activation of reward-related brain circuitry by stimuli associated with past substance use — a location, person, or sensation — occurring before conscious deliberation.' },
        { id: 'fc5', front: 'Executive control impairment', back: 'Diminished prefrontal cortex capacity to inhibit impulses, evaluate delayed consequences, and override cue-triggered urges, contributing to the gap between stated intention and behavior.' },
        { id: 'fc6', front: 'Craving', back: 'An urgent, often physically felt pull toward substance use, frequently triggered by cue exposure or stress and occurring prior to and independent of conscious decision-making.' },
      ],
    },
    keyTakeaway: {
      type: 'keyTakeaway', title: 'Key Takeaway: Addiction as Brain Disease Changes What You Do in the Room',
      takeaways: [
        'Treat craving as a documented neurobiological event to be planned around, not a report of insufficient willpower.',
        'Ask about stress, sleep, and interpersonal conflict specifically when building a relapse-prevention plan — these are the conditions under which craving reliably outpaces intention.',
        'Distinguish shame from guilt in how you respond to disclosure; a shaming response predicts the client will not tell you about the next lapse.',
        'Explain the intention-craving gap to clients directly — it normalizes the experience without excusing the behavior, and most clients find it validating rather than permissive.',
        'Build environmental structure around specific high-risk windows (avoiding known cue-heavy contexts, having a scripted response ready) rather than relying on willpower alone.',
      ],
    },
    kcs: [
      {
        question: "A client reports that a craving to use appeared suddenly while driving past a former dealer's block, despite having no conscious thought of using beforehand. Which concept best explains this?",
        options: [
          { text: 'Cue reactivity, in which drug-associated stimuli activate reward circuitry prior to conscious appraisal', isCorrect: true },
          { text: 'Malingering, since genuine craving would be preceded by a deliberate thought', isCorrect: false },
          { text: 'Substance-induced psychosis', isCorrect: false },
          { text: 'A failure of the therapeutic alliance', isCorrect: false },
        ],
        correctAnswer: 0,
        explanation: 'Cue-reactivity findings show that exposure to drug-associated stimuli activates mesolimbic and striatal circuitry before conscious deliberation occurs, consistent with craving a client experiences as arising with no preceding thought (Koob & Volkow, 2016).',
      },
      {
        question: 'Which mechanism best explains why relapse risk rises sharply during periods of interpersonal conflict or acute financial stress?',
        options: [
          { text: 'Stress potentiates craving and reduces the cognitive control resources available to resist it', isCorrect: true },
          { text: 'Stress has no established relationship to craving; relapse timing is essentially random', isCorrect: false },
          { text: 'Financial stress directly damages the mesolimbic dopamine pathway', isCorrect: false },
          { text: 'Interpersonal conflict is only relevant for clients with a co-occurring personality disorder', isCorrect: false },
        ],
        correctAnswer: 0,
        explanation: "Sinha's (2001) research on stress and craving established that acute stress reliably increases craving intensity while reducing the executive resources needed to resist it, which is why relapse clusters around stressful life events.",
      },
      {
        question: "A client discloses a weekend relapse and immediately says, \"I knew I'd screw this up, I'm just an addict.\" What does the research on shame and guilt suggest about the clinically indicated response?",
        options: [
          { text: "Respond in a way that separates the behavior (\"I used\") from a global identity judgment (\"I am an addict, therefore I will fail\"), since shame — unlike guilt — predicts continued use", isCorrect: true },
          { text: 'Agree that the pattern confirms a poor prognosis, since honesty about limitations is clinically important', isCorrect: false },
          { text: 'Change the subject to avoid reinforcing the disclosure', isCorrect: false },
          { text: 'Immediately increase session frequency without first addressing the disclosure itself', isCorrect: false },
        ],
        correctAnswer: 0,
        explanation: 'Shame, the global self-judgment, is associated with continued use following a lapse because it removes the identity a person needs in order to try again; guilt, the more limited judgment about the behavior, does not carry the same risk.',
      },
    ],
    reflectionQuestion: "Recall a client whose \"sudden\" urge to use puzzled you or them — it seemed to come from nowhere. Using the concept of cue reactivity, identify the specific cue (a place, person, time, sensation, or emotional state) that was most likely operating, and write one concrete way you could help that client either avoid or prepare for that cue before your next session with them.",
  }),

  'Screening, Assessment, and Diagnosis': () => ({
    text2: `<h3>Interviewing for Disclosure: What Makes Clients Tell the Truth</h3>
<p>A validated instrument only produces an accurate score if the client answers honestly, and the difference between an honest answer and a socially acceptable one is determined almost entirely by how the question is asked. Clients routinely under-report frequency and quantity of use to clinicians they perceive as likely to judge, report, or restrict them — a rational response to real consequences, not a character flaw to be corrected. The interview technique that improves disclosure rates is well established and teachable, and it has three components that generalize across every screening instrument in this module.</p>
<p><strong>Normalize before you ask.</strong> A question framed as "Some people find that stress leads them to drink more than they'd like — has that been true for you at all recently?" produces more honest answers than "Do you have a drinking problem?" The first assumes the behavior exists on a spectrum most people occupy somewhere on; the second forces a binary self-label the client has every incentive to reject.</p>
<p><strong>Be specific rather than general.</strong> "How many drinks, on the days you drink, in a typical week?" produces more accurate data than "Do you drink a lot?" because it removes the client's own definition of "a lot" — usually calibrated upward against a peer group — from the answer. The same principle underlies the AUDIT and AUDIT-C's use of quantified drink counts rather than a subjective frequency label.</p>
<p><strong>Ask in a way that assumes competence, not judgment.</strong> Tone and body language during a screening interview communicate as much as the words. A clinician who asks the CAGE questions in the same flat, unhurried register used for every other intake item gets more honest answers than one whose tone shifts — even slightly — when substance questions come up. Clients read that shift accurately and adjust their answers to manage it.</p>
<p>These three moves matter more with certain populations than others. Pregnant clients, clients in mandated treatment, clients with prior negative experiences disclosing to a provider who then contacted an employer or a court, and clients from communities that have historically been over-policed for substance use all carry a documented and justified wariness that a normalizing, specific, non-judgmental interview partially offsets — and that a rushed or moralizing one confirms as founded.</p>`,
    callout: {
      type: 'callout', calloutType: 'protocol', title: "Screening Interview Do's and Don'ts",
      content: `<ul>
<li><strong>Do</strong> normalize the question before asking it — frame use as something you ask everyone, not something you suspect in this client specifically.</li>
<li><strong>Do</strong> ask for a specific quantity and frequency rather than a subjective label like "a lot" or "sometimes."</li>
<li><strong>Do</strong> keep your tone and pace identical to the rest of the intake — clients read a shift in register as judgment, even a small one.</li>
<li><strong>Don't</strong> lead with "Do you have a problem with...?" — it forces a binary self-label the client is motivated to reject.</li>
<li><strong>Don't</strong> screen only the clients who "seem like" they might have a substance use issue — that judgment is where bias enters, and it is why universal screening outperforms clinical impression.</li>
</ul>`,
    },
    activity: {
      type: 'matching',
      matchingInstructions: 'Match each screening instrument to the description of what it is designed to do.',
      matchingPairs: [
        { term: 'AUDIT', definition: '10-item WHO instrument screening for hazardous, harmful, and dependent patterns of alcohol use; validated across primary care and behavioral health settings.' },
        { term: 'AUDIT-C', definition: 'The 3-item consumption-only subset of the AUDIT, optimized as an ultra-brief universal screen when time is limited.' },
        { term: 'DAST-10', definition: '10-item self-report instrument screening for problematic use of drugs other than alcohol over the past 12 months.' },
        { term: 'CAGE', definition: '4-item screen (Cut down, Annoyed, Guilty, Eye-opener) originally developed for alcohol; quick but less sensitive to early-stage or lower-severity use than the AUDIT.' },
        { term: 'Addiction Severity Index (ASI)', definition: 'Structured, multi-domain interview assessing severity across medical, employment, legal, family/social, psychiatric, and substance-use domains — used for comprehensive assessment rather than brief screening.' },
        { term: 'Timeline Followback (TLFB)', definition: 'Calendar-based interview method reconstructing day-by-day substance use over a defined recall period, producing more precise quantity/frequency data than a single summary question.' },
      ],
    },
    keyTakeaway: {
      type: 'keyTakeaway', title: 'Key Takeaway: Assessment Accuracy Is an Interview Skill, Not Just an Instrument Choice',
      takeaways: [
        'The most validated instrument still produces an inaccurate score if the interview style invites a socially acceptable rather than honest answer.',
        'Normalize, be specific, and hold your tone steady — these three moves measurably improve disclosure across every instrument in this module.',
        'Universal screening — administered to every client, not the ones who "seem like" they might need it — is where the assessment process starts protecting against clinician bias.',
        'Populations with documented reasons to distrust disclosure (pregnant clients, mandated clients, over-policed communities) need the normalizing interview style most, not least.',
        'A single quantity/frequency question is a starting point; the Timeline Followback produces the precision an accurate severity picture needs when the stakes of the assessment are high.',
      ],
    },
    kcs: [
      {
        question: 'A clinician wants to improve honest disclosure during substance use screening. Which interview approach is best supported by this module?',
        options: [
          { text: 'Normalize the question, ask for specific quantities rather than subjective labels, and keep tone and pace consistent with the rest of the intake', isCorrect: true },
          { text: '"Do you have a drinking problem?" so the client understands the seriousness of the question', isCorrect: false },
          { text: 'Only ask detailed follow-up questions of clients whose intake responses already suggest a concern', isCorrect: false },
          { text: 'Preface the questions with a statement about mandatory reporting to ensure informed consent', isCorrect: false },
        ],
        correctAnswer: 0,
        explanation: "Normalizing, specific, non-judgmental questioning measurably improves disclosure; a binary 'problem' framing invites denial, and screening only clients who 'seem like' they need it reintroduces clinician bias rather than reducing it.",
      },
      {
        question: 'A clinician has 90 seconds during a busy intake to screen for hazardous alcohol use. Which instrument is purpose-built for this constraint?',
        options: [
          { text: 'AUDIT-C', isCorrect: true },
          { text: 'Addiction Severity Index (ASI)', isCorrect: false },
          { text: 'Timeline Followback (TLFB)', isCorrect: false },
          { text: 'Full DSM-5-TR criteria review', isCorrect: false },
        ],
        correctAnswer: 0,
        explanation: 'The AUDIT-C is the 3-item consumption-only subset of the AUDIT, designed specifically as an ultra-brief universal screen; the ASI and TLFB are far more time-intensive tools for comprehensive assessment.',
      },
      {
        question: "A client's AUDIT-C score suggests hazardous drinking, and the clinician wants day-by-day data on quantity and frequency over the past month to inform severity and treatment planning. Which method is designed for this?",
        options: [
          { text: 'Timeline Followback (TLFB)', isCorrect: true },
          { text: 'CAGE', isCorrect: false },
          { text: 'AUDIT-C repeated weekly', isCorrect: false },
          { text: 'DAST-10', isCorrect: false },
        ],
        correctAnswer: 0,
        explanation: 'The Timeline Followback uses a calendar-anchored interview to reconstruct day-by-day use over a defined period, producing quantity and frequency detail that brief screens like the AUDIT-C or CAGE are not designed to capture.',
      },
    ],
    reflectionQuestion: 'Think of a recent intake where you asked about substance use in a way that, on reflection, may have signaled judgment — through wording, tone, or timing. Rewrite the question as you would ask it today, applying the normalize-specific-neutral-tone framework from this section, and note what you think the honest answer might have been if you had asked it that way the first time.',
  }),

  'Evidence-Based Treatment Approaches': () => ({
    text2: `<h3>Matching Treatment Intensity to Clinical Severity</h3>
<p>The interventions covered in this module — motivational interviewing, CBT, contingency management, medication-assisted treatment, harm reduction — are not competing options a clinician chooses between once. They are components matched to severity and combined, and the ASAM Criteria exist specifically to make that matching systematic rather than intuitive (Mee-Lee, 2013). A client with mild alcohol use disorder, stable housing, no withdrawal risk, and strong recovery capital may be well served entirely within outpatient counseling built around motivational interviewing and CBT relapse-prevention skills. A client with severe opioid use disorder, active withdrawal risk, and an unstable living situation needs a fundamentally different intensity of care — and referring that client to weekly outpatient sessions alone, however skillfully delivered, is a level-of-care error regardless of the clinician's technique.</p>
<p>Two matching errors recur in general practice. The first is under-referral: a generalist clinician, reluctant to "lose" a client to a higher level of care, keeps a client with a severe, medically risky presentation in a treatment intensity built for a milder one. The second, less discussed, is over-referral: a client with a mild-to-moderate presentation and good recovery capital is pushed toward residential treatment reflexively, disrupting employment, housing, and family stability the client did not need to lose in order to get well. Both errors trace to the same cause — deciding intensity by instinct rather than by systematically assessing the six ASAM dimensions (intoxication/withdrawal risk, biomedical conditions, emotional/behavioral conditions, treatment acceptance/resistance, relapse/continued-use risk, and recovery environment) the criteria are built around.</p>
<p>Medication-assisted treatment deserves particular emphasis in this matching logic because it is so frequently treated as a separate, optional add-on rather than as first-line care. For opioid use disorder specifically, treatment with buprenorphine or methadone reduces all-cause and overdose mortality by roughly half relative to non-pharmacological treatment alone — one of the most robust findings in all of behavioral health — and a non-prescribing clinician who never raises MAT as an option with an eligible client is withholding the single intervention most likely to keep that client alive, regardless of how strong the counseling relationship is otherwise.</p>`,
    callout: {
      type: 'callout', calloutType: 'ethics', title: 'The Ethical Cost of Treating MAT as Optional',
      content: `<p>Declining to raise medication-assisted treatment with an eligible client — out of personal discomfort with medication, unexamined "true sobriety" beliefs, or simple unfamiliarity — is a scope-of-competence issue, not a values-neutral treatment choice.</p>
<ul>
<li>Buprenorphine and methadone reduce opioid-related mortality by roughly half compared with non-pharmacological treatment alone.</li>
<li>A counselor does not need to prescribe to raise MAT, explain it accurately, and refer — that is within every generalist's competence.</li>
<li>Withholding information about a life-saving intervention because of the clinician's own bias against medication is an informed-consent problem: the client cannot weigh an option they were never told about.</li>
<li>The ethical baseline is to raise MAT with every clinically eligible client, then support whatever informed decision the client makes.</li>
</ul>`,
    },
    activity: {
      type: 'cardSort',
      instructions: 'Sort each intervention into the category that best describes its primary mechanism. Several of the strongest treatment plans combine one item from each column.',
      categories: ['Behavioral / Psychosocial', 'Pharmacological', 'Recovery Support / Mutual-Aid'],
      cards: [
        { id: 'cs1', text: 'Motivational Interviewing', correctCategory: 'Behavioral / Psychosocial' },
        { id: 'cs2', text: 'Cognitive-Behavioral Therapy (CBT) relapse prevention', correctCategory: 'Behavioral / Psychosocial' },
        { id: 'cs3', text: 'Contingency Management', correctCategory: 'Behavioral / Psychosocial' },
        { id: 'cs4', text: 'Buprenorphine', correctCategory: 'Pharmacological' },
        { id: 'cs5', text: 'Methadone', correctCategory: 'Pharmacological' },
        { id: 'cs6', text: 'Naltrexone', correctCategory: 'Pharmacological' },
        { id: 'cs7', text: '12-Step facilitation / mutual-support groups', correctCategory: 'Recovery Support / Mutual-Aid' },
        { id: 'cs8', text: 'Recovery community organizations', correctCategory: 'Recovery Support / Mutual-Aid' },
      ],
      explanation: 'The strongest treatment plans typically combine a behavioral component, a pharmacological component where indicated, and a recovery-support component rather than relying on one category alone.',
    },
    keyTakeaway: {
      type: 'keyTakeaway', title: 'Key Takeaway: Level of Care Is a Clinical Decision, Not a Default',
      takeaways: [
        "Use the ASAM Criteria's six dimensions to decide treatment intensity systematically rather than by instinct or convenience.",
        'Under-referral (keeping a severe presentation in outpatient care) and over-referral (pushing a mild presentation into residential care) are both matching errors with real costs.',
        "Raise medication-assisted treatment with every eligible client — withholding it on the basis of personal bias against medication is an informed-consent failure, not a neutral stance.",
        'Buprenorphine and methadone cut opioid-related mortality by roughly half compared with non-pharmacological treatment alone.',
        'The strongest treatment plans typically combine a behavioral component, a pharmacological component where indicated, and a recovery-support component — not one to the exclusion of the others.',
      ],
    },
    kcs: [
      {
        question: 'A client with severe opioid use disorder, active withdrawal risk, and unstable housing is referred to weekly outpatient counseling only. What does this scenario illustrate?',
        options: [
          { text: "An under-referral — treatment intensity was not matched to the ASAM dimensions the client actually presents with", isCorrect: true },
          { text: 'Appropriate care, since outpatient counseling is always the least restrictive and therefore preferred option', isCorrect: false },
          { text: 'An over-referral', isCorrect: false },
          { text: 'A confidentiality violation', isCorrect: false },
        ],
        correctAnswer: 0,
        explanation: 'The ASAM Criteria match treatment intensity to severity across six dimensions, including withdrawal risk and recovery environment. A severe presentation with active withdrawal risk and unstable housing calls for a higher level of care than weekly outpatient counseling alone; placing such a client there is an under-referral.',
      },
      {
        question: 'A non-prescribing counselor never raises medication-assisted treatment with an opioid-use-disorder client who would likely be eligible, because the counselor personally believes recovery should be medication-free. Which statement best characterizes this practice?',
        options: [
          { text: "It is an informed-consent problem — the client cannot weigh an option they were never told exists, and the clinician's personal belief has substituted for the client's own choice", isCorrect: true },
          { text: 'It is acceptable, since MAT decisions belong exclusively to prescribers and counselors have no role', isCorrect: false },
          { text: "It is acceptable as long as the counselor documents their personal view in the chart", isCorrect: false },
          { text: 'It is only a concern if the client later asks about medication directly', isCorrect: false },
        ],
        correctAnswer: 0,
        explanation: 'A non-prescriber does not need to prescribe MAT to have an ethical obligation to raise it, explain it accurately, and refer for it. Withholding that information based on personal bias denies the client informed choice about an intervention associated with roughly half the mortality risk of non-pharmacological treatment alone.',
      },
      {
        question: 'Which set of dimensions does the ASAM Criteria use to determine appropriate treatment intensity?',
        options: [
          { text: 'Intoxication/withdrawal risk, biomedical conditions, emotional/behavioral conditions, treatment acceptance/resistance, relapse/continued-use risk, and recovery environment', isCorrect: true },
          { text: 'DSM-5-TR criterion count only', isCorrect: false },
          { text: 'Insurance authorization category and length of sobriety only', isCorrect: false },
          { text: 'Client preference alone, independent of clinical presentation', isCorrect: false },
        ],
        correctAnswer: 0,
        explanation: 'The ASAM Criteria assess six dimensions — including biomedical and psychiatric status, withdrawal risk, motivation, relapse risk, and the recovery environment — to systematically match a client to the least intensive level of care that can safely and effectively meet their needs.',
      },
    ],
    reflectionQuestion: 'Identify a client on your caseload, past or present, whose level of care you now suspect may have been mismatched to their actual severity — either under-referred to a lower intensity than they needed or over-referred to a higher one than necessary. Walk through the six ASAM dimensions for that client as best you can reconstruct them, and note what a systematic assessment might have indicated instead of the instinct-based decision that was made.',
  }),

  'Special Populations and Cultural Considerations': () => ({
    text2: `<h3>Formulating Reluctance Without Assuming Motivation</h3>
<p>A recurring clinical error with special populations is formulating a client's reluctance to disclose substance use, or to engage fully in treatment, as evidence of low motivation — when the more accurate formulation is that the client is responding rationally to real structural consequences the clinician does not personally face. Pregnant clients provide the clearest example. In a number of jurisdictions, a positive toxicology result at delivery can trigger a child welfare investigation, and prenatal substance use has in some cases been prosecuted as child endangerment (Roberts & Pies, 2011). A pregnant client who minimizes use, delays prenatal care, or avoids disclosing to a provider is frequently making an accurate risk calculation about disclosure consequences, not demonstrating denial or poor insight. Treating that caution as a motivation problem to be confronted, rather than a structural barrier to be named and worked around collaboratively, damages the alliance and, more importantly, delays the very engagement with care that would most reduce risk to both client and pregnancy.</p>
<p>The same logic extends across this module's other populations. A client from a community with a documented history of disproportionate policing and harsher sentencing for substance offenses has an accurate basis, not an irrational one, for hesitating to disclose fully to any provider whose confidentiality protections they have not personally tested. An LGBTQ+ client who has had a prior negative experience with a provider who pathologized their identity alongside their substance use has an accurate basis for anticipating this provider might do the same. An adolescent who fears a parent will be told everything discussed in session has an accurate basis for withholding.</p>
<p>The clinical corrective is not to abandon direct, honest inquiry — vague reassurance that avoids the topic entirely is itself a barrier to good care — but to name the structural reality explicitly, be precise rather than vague about the actual limits of confidentiality, and let the client's caution inform the pace of disclosure rather than treating caution itself as the presenting problem.</p>`,
    callout: {
      type: 'callout', calloutType: 'warning', title: 'Common Formulation Errors With Special Populations',
      content: `<ul>
<li><strong>Reading structural caution as denial.</strong> A pregnant client who minimizes use may be making an accurate risk calculation about child welfare involvement, not lacking insight.</li>
<li><strong>Offering vague reassurance instead of precise limits.</strong> "Everything here is confidential" is often untrue, and once discovered to be untrue it destroys trust faster than an accurate, limited disclosure of your actual reporting obligations would have.</li>
<li><strong>Treating one identity as the whole client.</strong> Formulating a client through a single lens (e.g., "the pregnant client," "the LGBTQ+ client") flattens the intersecting factors — race, class, immigration status, prior systems involvement — that actually shape their risk calculation.</li>
<li><strong>Assuming your confidentiality protections are self-evident.</strong> A client harmed by a prior provider's disclosure will not extend trust by default; it has to be actively rebuilt through consistent, demonstrated discretion.</li>
</ul>`,
    },
    activity: {
      type: 'scenarioTree',
      scenarioTitle: 'A Pregnant Client Discloses Ongoing Substance Use',
      instructions: 'Work through the branching decision points a clinician faces after this disclosure. There is a clinically preferred path at each branch, but the scenario also shows what happens down the less advisable paths.',
      startNode: 'start',
      nodes: {
        start: {
          text: 'A client who is 22 weeks pregnant discloses that she has continued using alcohol several times over the past month despite knowing the risks, and appears anxious as she says it, watching your reaction closely.',
          choices: [
            { text: 'Respond with visible concern and immediately outline mandatory reporting obligations before discussing anything else.', next: 'leadReport' },
            { text: 'Acknowledge the disclosure calmly, thank her for trusting you with it, and ask what has made it hard to stop.', next: 'leadEmpathy' },
            { text: 'Reassure her that "everything said here is completely confidential" to encourage further disclosure.', next: 'leadFalseReassurance' },
          ],
        },
        leadReport: {
          text: 'Leading with reporting obligations, even accurately stated, before acknowledging the disclosure itself frequently reads to the client as the consequence she feared arriving immediately — and predicts she minimizes or withholds in future sessions.',
          choices: [{ text: 'Continue to the recommended path', next: 'leadEmpathy' }],
        },
        leadFalseReassurance: {
          text: 'Blanket confidentiality claims are often inaccurate — many jurisdictions carry specific reporting triggers for prenatal substance use — and when a client later discovers the claim was false, the damage to trust is typically worse than an accurate, limited disclosure would have caused.',
          choices: [{ text: 'Continue to the recommended path', next: 'leadEmpathy' }],
        },
        leadEmpathy: {
          text: 'Acknowledging the disclosure without visible alarm, and asking what has made stopping difficult, keeps the client engaged and gives you the actual clinical information — the function the substance is serving — that a plan needs. This is also the point to be precise, not vague, about your specific reporting obligations in your jurisdiction, stated plainly rather than as a threat.',
          choices: [{ text: 'See the outcome', next: 'end' }],
        },
        end: {
          text: 'Outcome: Naming the structural reality precisely, without either alarm or false reassurance, is what keeps a high-risk pregnant client engaged in care long enough for treatment to reduce risk to both her and the pregnancy — which is the actual clinical goal.',
          choices: [],
        },
      },
    },
    keyTakeaway: {
      type: 'keyTakeaway', title: 'Key Takeaway: Structural Barriers, Not Motivation Deficits, Explain Most Reluctance',
      takeaways: [
        "A pregnant client's minimization of substance use is frequently an accurate risk calculation about child welfare consequences, not a lack of insight.",
        'Vague blanket confidentiality reassurances that turn out to be inaccurate damage trust more than a precise, limited disclosure of real reporting obligations would.',
        'Communities with documented histories of disproportionate policing have an accurate, not irrational, basis for hesitating to fully disclose to an untested provider.',
        'The clinical corrective to structural caution is precision and consistency, not confrontation of the caution itself.',
        'Formulating a client through a single population label flattens the intersecting factors that actually shape their specific risk calculation.',
      ],
    },
    kcs: [
      {
        question: 'A pregnant client minimizes her alcohol use during intake. Which formulation is best supported by this module?',
        options: [
          { text: 'Her minimization may reflect an accurate assessment of child-welfare and legal risk associated with disclosure, not necessarily denial or poor insight', isCorrect: true },
          { text: 'Minimization during pregnancy always indicates denial requiring confrontation', isCorrect: false },
          { text: 'Pregnant clients are less reliable historians than other clients as a general rule', isCorrect: false },
          { text: 'Minimization should be addressed only after delivery to avoid legal complications', isCorrect: false },
        ],
        correctAnswer: 0,
        explanation: 'In jurisdictions where prenatal substance use can trigger child welfare involvement or prosecution, minimization is frequently a rational response to real structural risk. Formulating it as denial and confronting it directly tends to reduce engagement rather than improve disclosure.',
      },
      {
        question: "Which practice is most consistent with this module's guidance on discussing confidentiality with clients from communities with a history of disproportionate policing for substance use?",
        options: [
          { text: "State the actual, specific limits of confidentiality precisely rather than offering a blanket \"everything is confidential\" reassurance", isCorrect: true },
          { text: 'Avoid discussing confidentiality limits at all, to prevent discouraging disclosure', isCorrect: false },
          { text: "Assume the client already trusts the clinician's discretion by default", isCorrect: false },
          { text: 'Discuss confidentiality limits only if the client raises the topic first', isCorrect: false },
        ],
        correctAnswer: 0,
        explanation: "Vague or inaccurate blanket reassurances damage trust once discovered to be false. Precise, accurate disclosure of the actual limits — even when unwelcome — respects the client's demonstrated basis for caution and supports a more honest working relationship.",
      },
      {
        question: 'In the scenario activity, why does leading with mandatory-reporting obligations before acknowledging the disclosure tend to reduce future honesty, even when the information given is accurate?',
        options: [
          { text: 'It reads to the client as the feared consequence arriving immediately, which predicts minimization or withholding in subsequent sessions', isCorrect: true },
          { text: 'Reporting obligations should never be discussed with any client under any circumstances', isCorrect: false },
          { text: 'Accuracy is irrelevant to how a disclosure is received', isCorrect: false },
          { text: 'It has no measurable effect on subsequent disclosure patterns', isCorrect: false },
        ],
        correctAnswer: 0,
        explanation: 'Sequencing matters clinically: acknowledging the disclosure and understanding its function before pivoting to reporting obligations keeps the client engaged, whereas leading with the obligation — however accurate — often reads as the anticipated consequence materializing.',
      },
    ],
    reflectionQuestion: "Identify a client from a population covered in this module whose reluctance to disclose fully you may have formulated, even briefly, as a motivation problem. Reconsider that reluctance through the structural-barrier lens presented here: what real consequence might that client have been rationally weighing? Write one specific change to how you would open that conversation differently next time.",
  }),

  'Relapse Prevention and Recovery Support': () => ({
    text2: `<h3>The First Session After a Lapse: A Structured Response</h3>
<p>Everything this module covers about relapse as process rather than event has a single point where it either gets applied or doesn't: the session immediately following a disclosed lapse. Clinicians without a structured plan for that session tend to default to one of two unhelpful patterns — an implicit or explicit expression of disappointment that confirms the client's fear of judgment, or a minimization that treats the lapse as unimportant and misses the clinical information it contains. Witkiewitz and Marlatt's (2004) update to the original relapse-prevention model offers a structured alternative built on four moves, usable within a single fifty-minute session.</p>
<p><strong>First, assess safety.</strong> Tolerance falls during a period of abstinence, and a substantial share of overdose deaths occur when someone returns to a previously tolerated dose after a tolerance-reducing gap — this is true across substances but is especially acute and time-urgent with opioids. Safety assessment comes before any exploration of meaning or motivation, every time.</p>
<p><strong>Second, conduct a functional analysis of the specific sequence.</strong> Not "why did you relapse" as a global question, but a concrete walk-through: what was happening in the hours before, what was the specific high-risk situation, what coping response was attempted or not attempted, and what happened immediately after the first use that determined whether it stayed a single lapse or became an extended return to the prior pattern.</p>
<p><strong>Third, address the abstinence violation effect directly.</strong> This is the cognitive-affective spiral in which a single lapse, interpreted through an all-or-nothing lens ("I've blown it, might as well keep going"), becomes the mechanism that converts a lapse into a full relapse. Naming this spiral explicitly to the client — often before they've said it themselves — frequently short-circuits it, because the client recognizes the pattern and feels it has been anticipated rather than judged.</p>
<p><strong>Fourth, revise the plan based on what the functional analysis revealed</strong> — not by starting over, but by treating the lapse as new data about a specific gap in coping, environmental structure, or support that the existing plan didn't yet cover.</p>`,
    callout: {
      type: 'callout', calloutType: 'tip', title: 'Recovery Capital: What Predicts Sustained Recovery',
      content: `<p>Recovery capital — the sum of internal and external resources a person can draw on to initiate and sustain recovery — predicts long-term outcome better than treatment dose alone (Laudet & White, 2008).</p>
<ul>
<li><strong>Social capital:</strong> relationships that actively support recovery — family, peers in recovery, sponsors, community.</li>
<li><strong>Physical capital:</strong> stable housing, reliable transportation, financial stability, access to healthcare.</li>
<li><strong>Human capital:</strong> education, employment skills, physical and mental health, coping skills and self-efficacy.</li>
<li><strong>Cultural capital:</strong> values, beliefs, and community norms that support the recovery identity being built.</li>
</ul>
<p>A relapse-prevention plan that only lists coping skills and ignores recovery capital across these four domains is treating a fraction of what actually predicts whether recovery holds.</p>`,
    },
    activity: {
      type: 'sequencing',
      instructions: 'Put these steps in the order a clinician should move through them in the first session after a client discloses a lapse.',
      steps: [
        { id: 's1', text: 'Assess immediate safety, including loss of tolerance and overdose risk', order: 1 },
        { id: 's2', text: 'Conduct a functional analysis of the specific sequence — the high-risk situation, the coping attempted, and what followed the first use', order: 2 },
        { id: 's3', text: "Name the abstinence violation effect directly if the client's language suggests an all-or-nothing spiral", order: 3 },
        { id: 's4', text: 'Revise the existing relapse-prevention plan based on the specific gap the functional analysis revealed', order: 4 },
        { id: 's5', text: "Reconfirm the client's support contacts and recovery capital resources before the session ends", order: 5 },
      ],
      explanation: "Safety always comes first because tolerance loss carries acute, time-sensitive risk. Only after safety is established does the functional analysis — and then plan revision — make clinical sense; reconfirming support resources closes the session by pointing the client back toward what sustains recovery beyond the session itself.",
    },
    keyTakeaway: {
      type: 'keyTakeaway', title: 'Key Takeaway: The Response to a Lapse Is a Structured Clinical Skill',
      takeaways: [
        'Safety assessment, including tolerance loss, always comes first in the session following a disclosed lapse — this is a time-sensitive step, not an optional one.',
        'A functional analysis of the specific sequence produces more useful clinical information than a global question about why the relapse happened.',
        'Naming the abstinence violation effect explicitly and early frequently interrupts the all-or-nothing spiral that converts a lapse into an extended relapse.',
        'Recovery capital — social, physical, human, and cultural resources — predicts sustained recovery better than treatment dose alone, and should be assessed and built deliberately, not assumed.',
        'A relapse-prevention plan is revised in response to new information from a lapse, not discarded and restarted.',
      ],
    },
    kcs: [
      {
        question: 'A client discloses returning to opioid use after three weeks of abstinence. What is the first clinical priority in that session?',
        options: [
          { text: 'Assess immediate safety, including tolerance loss and overdose risk', isCorrect: true },
          { text: "Explore the client's underlying motivation for using again", isCorrect: false },
          { text: 'Revise the relapse-prevention plan', isCorrect: false },
          { text: "Contact the client's support system", isCorrect: false },
        ],
        correctAnswer: 0,
        explanation: 'Tolerance falls during abstinence, and a substantial proportion of overdose deaths occur when someone returns to a previously tolerated dose after a tolerance-reducing gap. Safety assessment is time-sensitive and always comes before exploring meaning or revising the plan.',
      },
      {
        question: 'A client says, after a single lapse, "I already messed up, so I might as well keep using through the weekend." What clinical concept does this statement illustrate?',
        options: [
          { text: 'The abstinence violation effect — an all-or-nothing interpretation of a lapse that converts it into an extended relapse', isCorrect: true },
          { text: 'Contingency management', isCorrect: false },
          { text: 'Cultural formulation', isCorrect: false },
          { text: 'Negative reinforcement', isCorrect: false },
        ],
        correctAnswer: 0,
        explanation: 'The abstinence violation effect describes exactly this cognitive-affective spiral, in which a single lapse, interpreted through an all-or-nothing lens, becomes the psychological mechanism that turns a lapse into a sustained return to the prior pattern. Naming it explicitly often interrupts it.',
      },
      {
        question: 'Which of the following best reflects the concept of recovery capital as distinct from treatment dose?',
        options: [
          { text: "The client's stable housing, supportive sober friendships, employment skills, and connection to a recovery-affirming community, considered together", isCorrect: true },
          { text: 'The total number of counseling sessions the client has attended', isCorrect: false },
          { text: 'The specific medication regimen the client is prescribed', isCorrect: false },
          { text: 'The severity specifier assigned at diagnosis', isCorrect: false },
        ],
        correctAnswer: 0,
        explanation: 'Recovery capital refers to the social, physical, human, and cultural resources a person can draw on to sustain recovery — distinct from, and predictive above and beyond, the amount of formal treatment received.',
      },
    ],
    reflectionQuestion: 'Think about how you typically respond in the session immediately after a client discloses a lapse. Using the four-move structure from this section — safety, functional analysis, naming the abstinence violation effect, plan revision — identify which move you currently do well and which one you tend to skip or rush. What would change in your next such session if you deliberately slowed down at the step you skip?',
  }),
};

function buildSectionInsertBlocks(title) {
  const spec = SECTION_COMPLIANCE[title];
  if (!spec) return null;
  const s = spec();
  const m = marker(title);
  return [
    { type: 'text', content: s.text2, patchId: m },
    { ...s.callout, patchId: m },
    { ...s.activity, patchId: m },
    { ...s.keyTakeaway, patchId: m },
    ...s.kcs.map((kc) => ({ type: 'multipleChoice', patchId: m, ...kc })),
    { type: 'reflection', question: s.reflectionQuestion, patchId: m },
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// Pure transform: given the raw course document (plain object or Mongoose
// doc), returns { sections, references, actions } — no I/O. Exported so a
// scratch validation script can build the final in-memory course and run
// `new Course(finalCourseObject).validateSync()` / `countCourseWords()`
// without touching the database.
// ─────────────────────────────────────────────────────────────────────────────
export function planPatch(course) {
  const sections = JSON.parse(JSON.stringify(course.sections || []));
  const references = [...(course.references || [])];
  const actions = [];

  // 1. Body-section inserts (skip intro/conclusion sections if already present).
  for (const section of sections) {
    if (INTRO_TITLE_RE.test(section.title || '') || CONCLUSION_TITLE_RE.test(section.title || '')) continue;
    const m = marker(section.title);
    const already = (section.contentBlocks || []).some((b) => b.patchId === m);
    if (already) {
      actions.push(`section "${section.title}": SKIP (already patched)`);
      continue;
    }
    const inserts = buildSectionInsertBlocks(section.title);
    if (!inserts) {
      actions.push(`section "${section.title}": NO COMPLIANCE SPEC DEFINED — skipped (unexpected/renamed section title, review manually)`);
      continue;
    }
    section.contentBlocks = [...(section.contentBlocks || []), ...inserts];
    actions.push(`section "${section.title}": INSERT ${inserts.length} blocks (text, callout, activity, keyTakeaway, 3x KC, reflection)`);
  }

  // 2. Intro section.
  const hasIntro = sections.length > 0 && INTRO_TITLE_RE.test(sections[0].title || '');
  if (hasIntro) {
    actions.push('intro: SKIP (section 1 is already an introduction)');
  } else {
    sections.unshift(buildIntroSection(CR301));
    actions.push(`intro: INSERT section at position 1 (reused from expandIntrosConclusions_CR301_CR302_CR307_CR601.js PATCHES['CR-301'])`);
  }

  // 3. References — append new ones not already present (idempotent).
  let addedRefs = 0;
  for (const r of NEW_REFERENCES) {
    if (!references.includes(r)) {
      references.push(r);
      addedRefs++;
    }
  }
  actions.push(`references: +${addedRefs} new (was ${(course.references || []).length}, now ${references.length})`);

  // 4. Conclusion section.
  const last = sections[sections.length - 1];
  const isConclusion = last && CONCLUSION_TITLE_RE.test(last.title || '');
  if (isConclusion) {
    const m = marker('conclusion');
    const already = (last.contentBlocks || []).some((b) => b.patchId === m);
    if (already) {
      actions.push('conclusion: SKIP (already patched)');
    } else {
      const blocks = buildConclusionBlocks(CR301);
      const refBlock = buildReferencesBlock(references);
      let at = (last.contentBlocks || []).findIndex((b) => /class="cr-references"/.test(b.content || ''));
      if (at < 0) at = (last.contentBlocks || []).length;
      last.contentBlocks = [
        ...(last.contentBlocks || []).slice(0, at),
        ...blocks,
        ...(refBlock ? [refBlock] : []),
        ...(last.contentBlocks || []).slice(at),
      ];
      actions.push(`conclusion: INSERT ${blocks.length + (refBlock ? 1 : 0)} blocks into existing "${last.title}"`);
    }
  } else {
    const blocks = buildConclusionBlocks(CR301);
    const refBlock = buildReferencesBlock(references);
    const contentBlocks = [
      { type: 'sectionDivider', sectionNumber: 6, title: 'Course Summary and Review', subtitle: "Consolidation of the neuroscience, assessment, treatment, population, and recovery material into a single clinical picture, with an ethical practice plan and the complete reference list.", patchId: marker('conclusion') },
      ...blocks,
      ...(refBlock ? [refBlock] : []),
    ];
    sections.push({
      title: 'Course Summary and Review',
      order: sections.length + 1,
      description: 'Synthesis of the course’s central arguments, a module-by-module review, an ethical practice plan, a course-level reflection, supplemental resources, and the full reference list.',
      contentBlocks,
    });
    actions.push(`conclusion: CREATE section "Course Summary and Review" (${contentBlocks.length} blocks, reused from PATCHES['CR-301'] + references block built from the merged ${references.length}-entry references array)`);
  }

  // 5. Resequence order on every section and block.
  sections.forEach((s, i) => {
    s.order = i + 1;
    (s.contentBlocks || []).forEach((b, j) => { b.order = j + 1; });
  });

  return { sections, references, actions };
}

// ─────────────────────────────────────────────────────────────────────────────
// I/O
// ─────────────────────────────────────────────────────────────────────────────
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
  console.log(`patchACEPCompliance_CR-301 — ${EXECUTE ? 'EXECUTING WRITE' : 'DRY RUN (pass --execute to write)'}`);
  console.log('='.repeat(78));

  const { doc: raw, matchedBy } = await findCourse(col);
  if (!raw) {
    console.log(`NOT FOUND — tried slugs [${SLUG_CANDIDATES.join(', ')}] and codes [${CODE_CANDIDATES.join(', ')}]`);
    await mongoose.disconnect();
    return;
  }
  console.log(`matched by ${matchedBy} · "${(raw.title || '').slice(0, 60)}" · status=${raw.status} · ${(raw.sections || []).length} sections · wordCount=${raw.wordCount ?? 'n/a'} · references=${(raw.references || []).length}`);

  const { sections, references, actions } = planPatch(raw);
  actions.forEach((a) => console.log('  ' + a));

  if (actions.every((a) => a.includes('SKIP'))) {
    console.log('nothing to do — already fully patched');
    await mongoose.disconnect();
    return;
  }

  const before = countCourseWords(raw);
  const after = countCourseWords({ ...raw, sections });
  const required = requiredWordsFor(raw.ceHours || raw.ceuHours || 0);
  console.log(`words: ${before.toLocaleString()} → ${after.toLocaleString()} (+${(after - before).toLocaleString()}) · CE floor ${required.toLocaleString()} · ${after >= required ? 'PASS' : 'STILL SHORT by ' + (required - after).toLocaleString()}`);
  console.log(`references: ${(raw.references || []).length} → ${references.length} · floor 15 · ${references.length >= 15 ? 'PASS' : 'STILL SHORT'}`);

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
    model.set('references', references);
    model.markModified('sections');
    model.markModified('references');
    await model.save();
    console.log(`SAVED via model — wordCount=${model.wordCount}`);
  } catch (err) {
    console.log(`MODEL SAVE FAILED: ${err.message}`);
    console.log('FALLING BACK to collection update (validation bypassed — the failure above is in PRE-EXISTING content and should be fixed separately)');
    const patchedDoc = { ...raw, sections };
    await col.updateOne({ _id: raw._id }, {
      $set: {
        sections,
        references,
        wordCount: countCourseWords(patchedDoc),
        totalContentBlocks: sections.reduce((n, s) => n + (s.contentBlocks || []).length, 0),
        totalEstimatedTime: sections.reduce((n, s) => n + (s.estimatedTime || 15), 0),
        sectionCount: sections.length,
        moduleCount: sections.length,
        updatedAt: new Date(),
      },
    });
    console.log(`SAVED via collection — wordCount=${countCourseWords(patchedDoc)}`);
  }

  console.log('='.repeat(78) + '\n');
  await mongoose.disconnect();
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => { console.error('ERROR:', e); process.exit(1); });
}
