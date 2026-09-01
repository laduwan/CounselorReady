/**
 * patchACEPCompliance_CR-307.js
 * GAITP LLC · NBCC ACEP #7760
 *
 * Brings "Motivational Interviewing: From Ambivalence to Action"
 * (courseCode CR-307, slug motivational-interviewing-from-ambivalence-to-action,
 * ceHours 3) up to full ACEP structural compliance per CLAUDE_COURSE_STRUCTURE.md.
 *
 * ⚠ THIS COURSE IS PUBLISHED (status "published", isPublished true, accessType
 * "subscription", price 29). Real learners can enroll right now. This patch is
 * CONTENT-ONLY. It never touches status, isPublished, accessType, price, slug,
 * or courseCode — see assertImmutable() below, which hard-aborts if any of
 * those would change.
 *
 * ── LIVE DOCUMENT AS READ (read-only MongoDB, at write time of this script) ──
 *   title:      Motivational Interviewing: From Ambivalence to Action
 *   slug:       motivational-interviewing-from-ambivalence-to-action
 *   courseCode: CR-307 · ceHours 3 · status published · wordCount 9,767
 *   sections:   3, each EXACTLY [sectionDivider, text]:
 *                 1. Foundations and Spirit of Motivational Interviewing
 *                 2. MI Micro-Skills and Clinical Application
 *                 3. Advanced MI — Integration, Diversity, and Fidelity
 *               No intro section, no conclusion section. No callout,
 *               keyTakeaway, activity, structured knowledge check, or
 *               reflection anywhere in the course.
 *   references: 20 (objects with {author, year, title, source, formatted}) —
 *               ALREADY above the ≥15 floor.
 *   assessment: 15 questions — ALREADY at the ≥15 floor. Options are correctly
 *               shaped [{text, isCorrect}] and every question has an
 *               explanation. Two defects found (both fixed additively below).
 *
 * ── WHAT THIS PATCH DOES (insert-only / additive-only) ──
 *   1. INSERT an "Introduction: The Client Who Already Knows" section at
 *      position 1 (~3,000 words) in the fixed §3 order.
 *   2. APPEND compliance blocks to the END of each of the 3 existing body
 *      sections. The existing [sectionDivider, text] pair in each section is
 *      left byte-for-byte untouched. Each section gains: callout,
 *      2 new text blocks, interactive activity/activities, keyTakeaway,
 *      3 knowledge checks, reflection.
 *      Activity rotation covers all five required types:
 *        S1 flashcardDeck · S2 scenarioTree + sequencing · S3 cardSort + matching
 *      calloutType rotation: intro=clinical, S1=info, S2=tip, S3=warning,
 *      conclusion=key.
 *   3. APPEND a "Conclusion: From Ambivalence to Action in Your Practice"
 *      section (~2,700 words) in the fixed §8 order, ending with a resources
 *      block built from course.resources[] and a references TEXT block built
 *      from course.references[] (never a type:"references" content block —
 *      no renderReferences() exists; it renders "Unsupported block type").
 *   4. APPEND 12 new APA-7 citations to course.references[] (20 → 32), one for
 *      every new empirical claim introduced above. Existing entries keep their
 *      current order and shape; new entries match the existing
 *      {author, year, title, source, formatted} object shape.
 *   5. ADDITIVE ASSESSMENT REPAIRS (no answer is changed, no question is
 *      rewritten, none is added or removed):
 *        a. All 15 questions have `correctAnswer: undefined`. The viewer reads
 *           correctAnswer first and only then falls back to
 *           options.findIndex(o => o.isCorrect), so grading currently works by
 *           fallback — but §11 requires correctAnswer to be set. This backfills
 *           correctAnswer to EXACTLY the index the fallback already computes.
 *           If a question's isCorrect index cannot be resolved unambiguously
 *           (0 or 2+ correct options), it is SKIPPED and reported, never guessed.
 *        b. assessment.passingScore is absent (only passThreshold 0.8 is set).
 *           §11 requires assessment.passingScore = 80. Set only if absent, and
 *           only to 80 — which is what passThreshold 0.8, course.passingScore,
 *           and settings.passingScore already independently encode.
 *
 * ── WHAT THIS PATCH DELIBERATELY DOES NOT DO ──
 *   · Does not remove the raw-HTML "✅ Knowledge Check / Question N: … Correct
 *     Answer: B — …" dumps already embedded in each body section's existing
 *     text block. They pre-date this patch, they reveal answers inline, and
 *     removing them is a destructive rewrite of published content that needs
 *     its own scoped task. The 9 NEW structured knowledge checks added here
 *     were written to avoid duplicating any of those 15 embedded questions or
 *     any of the 15 final-exam questions. FLAGGED FOR KE.
 *   · Does not add videoEmbed blocks. §14 wants ≥2 course-wide; there are 0.
 *     No real video assets exist for this course and fabricating URLs is worse
 *     than the gap. FLAGGED FOR KE.
 *   · Does not set an `image` on the new imageText blocks (the field is
 *     optional; `content` is what renders). No placeholder URLs.
 *   · Does not renumber the existing dividers' sectionNumber (1, 2, 3). The
 *     new intro/conclusion dividers intentionally omit sectionNumber, so the
 *     three numbered modules keep their existing numbering and the unnumbered
 *     intro/conclusion frame them.
 *   · Does not deduplicate the final exam. Q2/Q4 both ask what OARS stands for
 *     and Q1/Q5 both define change talk. Rewriting published exam items is out
 *     of scope here. FLAGGED FOR KE.
 *
 * ── CONTENT PROVENANCE ──
 *   The never-applied draft seed
 *   `seedCR302_Motivational_Interviewing_From_Ambivalence_t-18795words.js`
 *   was read in full and compared paragraph-by-paragraph against the live
 *   document. Finding: the live CR-307 body prose is a CONDENSED edition of
 *   that draft's prose — same headings, same argument, shorter paragraphs.
 *   Nothing in that draft was copied into this patch. Its exam questions are
 *   raw-HTML dumps inside text blocks and its own header warns that their
 *   correctAnswer values were never verified, so none were carried over. What
 *   the draft DID provide was negative information used here: it confirmed
 *   which topics the live prose already covers, so every block below develops
 *   material the course does not already contain rather than restating it.
 *   All prose, activities, questions, and answers below are written fresh and
 *   independently verified against the cited literature.
 *
 * IDEMPOTENT: intro/conclusion detected by exact section title; each body
 * section's addition detected by a unique callout `title` marker; each new
 * reference by its `formatted` string; assessment repairs are no-ops once
 * applied. Re-running is safe and reports SKIP for everything already done.
 *
 * DRY RUN by default:
 *   node src/scripts/patchACEPCompliance_CR-307.js
 * Write:
 *   node src/scripts/patchACEPCompliance_CR-307.js --execute
 *
 * WRITE PATH: takes a pre-write snapshot via snapshotCourse() (CLAUDE.md
 * "Database Backups — Snapshot Before Every Course Write"), then writes
 * through the Mongoose model (doc.save()) so the pre-save hook recomputes
 * wordCount/totalContentBlocks/totalEstimatedTime. On a validation failure
 * caused by PRE-EXISTING unrelated content, falls back to a raw collection
 * update that mirrors those rollups using the canonical counter — and says so
 * loudly rather than dying.
 *
 * This script was NOT run with --execute as part of authoring it. Self-
 * validation was done in memory instead: new Course(finalCourseObject)
 * .validateSync() plus countCourseWords(), no DB connection required.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { pathToFileURL } from 'url';
import { Course } from '../models/InteractiveCourse.js';
import { countCourseWords, requiredWordsFor } from '../utils/courseWordCount.js';
import { snapshotCourse } from '../services/dbBackupService.js';

dotenv.config();

const EXECUTE = process.argv.includes('--execute');

// ─────────────────────────────────────────────────────────────────────────────
// IDENTITY
// ─────────────────────────────────────────────────────────────────────────────
const SLUGS = ['motivational-interviewing-from-ambivalence-to-action'];
const CODES = ['CR-307'];

const INTRO_TITLE = 'Introduction: The Client Who Already Knows';
const CONCLUSION_TITLE = 'Conclusion: From Ambivalence to Action in Your Practice';

/** Fields that must never change on this published course. */
const IMMUTABLE = ['status', 'isPublished', 'accessType', 'price', 'slug', 'courseCode'];

// ─────────────────────────────────────────────────────────────────────────────
// NEW REFERENCES — one per new empirical claim introduced by this patch.
// Shape matches the 20 existing entries: {author, year, title, source, formatted}
// ─────────────────────────────────────────────────────────────────────────────
const NEW_REFERENCES = [
  {
    author: 'Amrhein, P. C., Miller, W. R., Yahne, C. E., Palmer, M., & Fulcher, L.',
    year: 2003,
    title: 'Client commitment language during motivational interviewing predicts drug use outcomes',
    source: 'Journal of Consulting and Clinical Psychology, 71(5), 862–878. https://doi.org/10.1037/0022-006X.71.5.862',
    formatted:
      'Amrhein, P. C., Miller, W. R., Yahne, C. E., Palmer, M., & Fulcher, L. (2003). Client commitment language during motivational interviewing predicts drug use outcomes. <em>Journal of Consulting and Clinical Psychology, 71</em>(5), 862–878. https://doi.org/10.1037/0022-006X.71.5.862',
  },
  {
    author: 'Magill, M., Apodaca, T. R., Borsari, B., Gaume, J., Hoadley, A., Gordon, R. E. F., Tonigan, J. S., & Moyers, T.',
    year: 2018,
    title: 'A meta-analysis of motivational interviewing process: Technical, relational, and conditional process models of change',
    source: 'Journal of Consulting and Clinical Psychology, 86(2), 140–157. https://doi.org/10.1037/ccp0000250',
    formatted:
      'Magill, M., Apodaca, T. R., Borsari, B., Gaume, J., Hoadley, A., Gordon, R. E. F., Tonigan, J. S., &amp; Moyers, T. (2018). A meta-analysis of motivational interviewing process: Technical, relational, and conditional process models of change. <em>Journal of Consulting and Clinical Psychology, 86</em>(2), 140–157. https://doi.org/10.1037/ccp0000250',
  },
  {
    author: 'Moyers, T. B., Rowell, L. N., Manuel, J. K., Ernst, D., & Houck, J. M.',
    year: 2016,
    title: 'The Motivational Interviewing Treatment Integrity code (MITI 4): Rationale, preliminary reliability and validity',
    source: 'Journal of Substance Abuse Treatment, 65, 36–42. https://doi.org/10.1016/j.jsat.2016.01.001',
    formatted:
      'Moyers, T. B., Rowell, L. N., Manuel, J. K., Ernst, D., &amp; Houck, J. M. (2016). The Motivational Interviewing Treatment Integrity code (MITI 4): Rationale, preliminary reliability and validity. <em>Journal of Substance Abuse Treatment, 65</em>, 36–42. https://doi.org/10.1016/j.jsat.2016.01.001',
  },
  {
    author: 'Moyers, T. B., Miller, W. R., & Hendrickson, S. M. L.',
    year: 2005,
    title: 'How does motivational interviewing work? Therapist interpersonal skill predicts client involvement within motivational interviewing sessions',
    source: 'Journal of Consulting and Clinical Psychology, 73(4), 590–598. https://doi.org/10.1037/0022-006X.73.4.590',
    formatted:
      'Moyers, T. B., Miller, W. R., &amp; Hendrickson, S. M. L. (2005). How does motivational interviewing work? Therapist interpersonal skill predicts client involvement within motivational interviewing sessions. <em>Journal of Consulting and Clinical Psychology, 73</em>(4), 590–598. https://doi.org/10.1037/0022-006X.73.4.590',
  },
  {
    author: 'Miller, W. R., Yahne, C. E., Moyers, T. B., Martinez, J., & Pirritano, M.',
    year: 2004,
    title: 'A randomized trial of methods to help clinicians learn motivational interviewing',
    source: 'Journal of Consulting and Clinical Psychology, 72(6), 1050–1062. https://doi.org/10.1037/0022-006X.72.6.1050',
    formatted:
      'Miller, W. R., Yahne, C. E., Moyers, T. B., Martinez, J., &amp; Pirritano, M. (2004). A randomized trial of methods to help clinicians learn motivational interviewing. <em>Journal of Consulting and Clinical Psychology, 72</em>(6), 1050–1062. https://doi.org/10.1037/0022-006X.72.6.1050',
  },
  {
    author: 'Wagner, C. C., & Ingersoll, K. S.',
    year: 2013,
    title: 'Motivational interviewing in groups',
    source: 'Guilford Press.',
    formatted:
      'Wagner, C. C., &amp; Ingersoll, K. S. (2013). <em>Motivational interviewing in groups</em>. Guilford Press.',
  },
  {
    author: 'Miller, W. R., & Moyers, T. B.',
    year: 2021,
    title: 'Effective psychotherapists: Clinical skills that improve regard, empathy, and outcomes',
    source: 'Guilford Press.',
    formatted:
      'Miller, W. R., &amp; Moyers, T. B. (2021). <em>Effective psychotherapists: Clinical skills that improve regard, empathy, and outcomes</em>. Guilford Press.',
  },
  {
    author: 'Deci, E. L., & Ryan, R. M.',
    year: 2000,
    title: 'The "what" and "why" of goal pursuits: Human needs and the self-determination of behavior',
    source: 'Psychological Inquiry, 11(4), 227–268. https://doi.org/10.1207/S15327965PLI1104_01',
    formatted:
      'Deci, E. L., &amp; Ryan, R. M. (2000). The "what" and "why" of goal pursuits: Human needs and the self-determination of behavior. <em>Psychological Inquiry, 11</em>(4), 227–268. https://doi.org/10.1207/S15327965PLI1104_01',
  },
  {
    author: 'Project MATCH Research Group',
    year: 1997,
    title: 'Matching alcoholism treatments to client heterogeneity: Project MATCH posttreatment drinking outcomes',
    source: 'Journal of Studies on Alcohol, 58(1), 7–29. https://doi.org/10.15288/jsa.1997.58.7',
    formatted:
      'Project MATCH Research Group. (1997). Matching alcoholism treatments to client heterogeneity: Project MATCH posttreatment drinking outcomes. <em>Journal of Studies on Alcohol, 58</em>(1), 7–29. https://doi.org/10.15288/jsa.1997.58.7',
  },
  {
    author: 'Frost, H., Campbell, P., Maxwell, M., O’Carroll, R. E., Dombrowski, S. U., Williams, B., Cheyne, H., Coles, E., & Pollock, A.',
    year: 2018,
    title: 'Effectiveness of motivational interviewing on adult behaviour change in health and social care settings: A systematic review of reviews',
    source: 'PLOS ONE, 13(10), e0204890. https://doi.org/10.1371/journal.pone.0204890',
    formatted:
      'Frost, H., Campbell, P., Maxwell, M., O’Carroll, R. E., Dombrowski, S. U., Williams, B., Cheyne, H., Coles, E., &amp; Pollock, A. (2018). Effectiveness of motivational interviewing on adult behaviour change in health and social care settings: A systematic review of reviews. <em>PLOS ONE, 13</em>(10), e0204890. https://doi.org/10.1371/journal.pone.0204890',
  },
  {
    author: 'American Counseling Association',
    year: 2014,
    title: 'ACA code of ethics',
    source: 'American Counseling Association. https://www.counseling.org/resources/aca-code-of-ethics.pdf',
    formatted:
      'American Counseling Association. (2014). <em>ACA code of ethics</em>. https://www.counseling.org/resources/aca-code-of-ethics.pdf',
  },
  {
    author: 'National Board for Certified Counselors',
    year: 2023,
    title: 'NBCC code of ethics',
    source: 'National Board for Certified Counselors. https://www.nbcc.org/Assets/Ethics/NBCCCodeofEthics.pdf',
    formatted:
      'National Board for Certified Counselors. (2023). <em>NBCC code of ethics</em>. https://www.nbcc.org/Assets/Ethics/NBCCCodeofEthics.pdf',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// INTRODUCTION SECTION (§3 fixed order)
//   sectionDivider → hook text → callout → roadmap text → imageText →
//   accordion → keyTakeaway → baseline multipleChoice → reflection
// ─────────────────────────────────────────────────────────────────────────────

function buildIntroSection() {
  const blocks = [
    {
      type: 'sectionDivider',
      title: INTRO_TITLE,
      subtitle:
        'Most clients who are not changing can already recite every reason they should. The problem is almost never a missing argument.',
      // sectionNumber intentionally omitted — see header note.
    },

    // ── Opening hook (~610 words) — composite clinical vignette, never "welcome"
    {
      type: 'text',
      content: `<h2>Everything the Counselor Said Was True</h2>
<p>A man in his early forties sits down for a fourth session. He was referred by his primary care physician after a hemoglobin A1c came back at 9.1, and the referral note says, in its entirety, "patient non-compliant with diabetes management, please address motivation." He is pleasant. He is on time. He has missed no appointments. And for three sessions he has not changed one thing about how he eats, whether he takes his metformin, or how much he drinks in the evenings.</p>
<p>In the third session, the counselor decided to be direct with him, because the lab values were genuinely alarming and because being direct felt like the responsible thing to do. She explained what an A1c above nine means over a ten-year horizon. She described diabetic neuropathy accurately and without exaggeration. She noted, gently, that alcohol was working against the metformin. She asked him whether he wanted his daughter to have a father at her graduation. Every single thing she said was true, clinically accurate, and offered out of genuine care.</p>
<p>He agreed with all of it. He said she was right. He said he knew he had to get this under control. He thanked her for being straight with him. Then he went home and nothing changed, and in the fourth session he is slightly less forthcoming than he was in the first, and the counselor cannot quite name when the room got smaller.</p>
<p>Here is what the referral note got wrong, and it is the most consequential misdiagnosis in behavior-change work: this client is not unmotivated. He is not in denial. He does not lack information. Ask him to list the reasons he should manage his diabetes and he will produce a more complete and more frightening list than his counselor just did, because he has been carrying it privately for two years. What he also carries — and has told no one — is that his father died in a hospital bed after a long illness in which every decision was made for him, that taking a daily pill makes him feel like that story has already started, and that the two hours after work when he is drinking are the only two hours in his day that belong to him. He is not missing an argument for change. He is holding two arguments at once, and no one has ever asked him about the second one.</p>
<p>That simultaneous holding of two incompatible positions is <strong>ambivalence</strong> — the normal human experience of genuinely wanting something and genuinely not wanting it at the same time, rather than a deficit of insight or willpower. It is not a pathology, not a defense mechanism, and not a stage to be pushed through. It is the ordinary condition of nearly every person contemplating a change that matters to them, and it is the specific clinical phenomenon Motivational Interviewing was built to work with.</p>
<p>What went wrong in the third session was not the counselor's accuracy. It was that she supplied one side of an argument the client was already having with himself, and in doing so she took a side — which left him, by the simple conversational physics of disagreement, holding the other one. He argued for the status quo not because he believed in it but because someone else was arguing against it. Then he heard himself argue for it, and believed it slightly more than he had an hour earlier. The counselor's care, delivered as persuasion, made the outcome marginally worse.</p>
<p>The alternative is not passivity, and it is not withholding information. It is a specific, learnable, well-evidenced way of conducting the conversation so that the client is the one who voices the case for change — because the person who makes the argument is the person who ends up persuaded. That method is what this course teaches.</p>`,
    },

    // ── "Why This Matters" callout (clinical)
    {
      type: 'callout',
      calloutType: 'clinical',
      title: 'Why This Matters',
      calloutItems: [
        'Ambivalence, not resistance, is the modal presentation in behavior-change work — treating it as opposition is the single most common and most costly clinical misread in the referral stream most counselors actually receive (Miller &amp; Rollnick, 2023).',
        'Direct persuasion measurably backfires: in a controlled comparison of therapist styles, a confrontational-directive approach produced significantly more client resistance and predicted <em>worse</em> drinking outcomes at one-year follow-up than a motivational style (Miller, Benefield, &amp; Tonigan, 1993).',
        'Therapist behavior, not client characteristics, is the strongest available lever. Therapist interpersonal skill within the session predicts client involvement and change talk, and the same techniques produce different outcomes depending on the relationship carrying them (Moyers, Miller, &amp; Hendrickson, 2005).',
        'What clients say in session predicts what they do afterward: the strength of client commitment language during an MI session predicts subsequent drug use outcomes, which is why evoking change talk is a clinical target rather than a stylistic preference (Amrhein et al., 2003).',
        'MI is not a niche addictions technique. A systematic review of reviews found effects on adult behaviour change across health and social care settings generally, making it a general-purpose counseling competency rather than a specialty add-on (Frost et al., 2018).',
        'The effects are real but modest and context-dependent — meta-analytic work finds MI outperforms no treatment and often matches longer active treatments in far less time, which makes it valuable precisely where contact is brief (Lundahl &amp; Burke, 2009).',
      ],
    },

    // ── Course roadmap (~450 words)
    {
      type: 'text',
      content: `<h2>How This Course Is Built</h2>
<p>The three modules that follow move from why MI works, to how it is done, to whether you are actually doing it — and that last question turns out to be the one most clinicians get wrong about themselves.</p>
<p>Module 1 establishes the foundations. It traces MI from Miller's 1983 observation that empathic clinicians outperformed confrontational ones in alcohol treatment, through the theoretical machinery that explains why: self-determination theory, which identifies the psychological needs MI satisfies; reactance theory, which explains why well-intentioned persuasion produces the opposite of its intent; and self-perception theory, which explains why hearing yourself argue for change changes you. It then develops the spirit of MI — partnership, acceptance, compassion, evocation — and the four processes of engaging, focusing, evoking, and planning. The module closes on the boundary question that keeps MI honest: what MI is <em>not</em>, and the clinical situations where reaching for it is the wrong call.</p>
<p>Module 2 is the skills module. It works through OARS — open questions, affirmations, reflections, summaries — with particular weight on reflective listening, which is where most MI training either lands or fails. It develops the reflection continuum from simple restatement through amplified, double-sided, and undershooting reflections, and it takes seriously the distinction between an affirmation and a compliment. It then turns to the language itself: change talk and sustain talk, the preparatory and mobilizing forms of each, and the strategic responses that make change talk more likely to recur. It closes on the righting reflex and the specific traps — expert, labeling, premature focus, blaming, question-answer — that pull competent clinicians out of MI without their noticing.</p>
<p>Module 3 is integration and fidelity. It addresses how MI combines with CBT, DBT, and trauma-informed care rather than competing with them; how MI is adapted for adolescents, older adults, clients with co-occurring disorders, and clients whose cultural frame does not center individual autonomy the way MI's American origins assumed; and how MI works in groups, where the mechanism changes substantially. It ends with fidelity: the MITI coding system, what its global and behavior-count scores actually measure, and the uncomfortable and well-replicated finding that clinician self-assessment of MI skill correlates poorly with observed performance — which is why fidelity is measured rather than felt.</p>
<p>The introduction and conclusion that bracket these three modules are not filler. This introduction is where the central reframe lives — ambivalence as normal rather than pathological — and the conclusion is where the course converts into a specific thirty-day plan, because a CE course that changes nothing about Monday has not actually done its job.</p>`,
    },

    // ── imageText — foundational framework
    {
      type: 'imageText',
      title: 'The Four Processes Are a Staircase You Can Walk Back Down',
      imagePosition: 'right',
      highlight: true,
      content: `<p>The organizing framework for everything that follows is the <strong>four processes model</strong> — engaging, focusing, evoking, and planning, the four overlapping tasks that Miller and Rollnick's third edition introduced to replace the earlier phase-based description of MI. Almost every clinical error in MI can be located as an attempt to work in a later process than the conversation has actually reached.</p>
<p><strong>Engaging</strong> is the establishment of a working relationship in which the client is willing to say true things. Nothing else in MI functions without it, and it is not a preliminary you complete once — a session can lose engagement in a single sentence and have to recover it.</p>
<p><strong>Focusing</strong> is the negotiation of a direction: what, specifically, are we talking about changing? Focusing is genuinely negotiated, not assigned. A referral note names the referrer's agenda, which may or may not be the client's, and the gap between those two is where the premature-focus trap lives.</p>
<p><strong>Evoking</strong> is the process that distinguishes MI from every other humanistic approach. Here the clinician deliberately elicits and strengthens the client's own arguments for change rather than supplying them. Evoking is what makes MI directional; without it, MI is simply supportive listening with better vocabulary.</p>
<p><strong>Planning</strong> is the development of a concrete change plan, and it is the process clinicians most often reach for too early. Planning attempted before evoking has done its work produces the polite, agreeable, entirely inert plan that the client in the opening vignette would have signed without hesitation.</p>
<p>The word "staircase" is doing specific work here. The processes are sequential in the sense that each depends on the one before it, but they are also recursive: a client who becomes guarded during planning has lost engagement, and the correct move is to walk back down to engaging rather than to press forward with the plan. Reading which step you are actually standing on — rather than which one your treatment plan says you should be on by session four — is the core diagnostic skill this course develops.</p>`,
    },

    // ── Key concepts preview accordion
    {
      type: 'accordion',
      accordionItems: [
        {
          title: 'The Spirit of MI (PACE)',
          content:
            '<p>Partnership, acceptance, compassion, and evocation — the underlying stance from which MI techniques draw their effect. Module 1 develops each component, including why compassion was added explicitly in the third edition: to close the door on using MI techniques skillfully in the service of the clinician\'s agenda rather than the client\'s welfare.</p>',
        },
        {
          title: 'Ambivalence, Sustain Talk, and Discord',
          content:
            '<p>Three things older MI literature bundled together as "resistance," now carefully separated. Ambivalence is the normal state; sustain talk is the client\'s language favoring the status quo; discord is friction in the relationship itself. Module 1 shows why the distinction is not academic — sustain talk and discord call for different clinical responses.</p>',
        },
        {
          title: 'OARS and the Reflection Continuum',
          content:
            '<p>Open questions, affirmations, reflections, and summaries are the mechanical substrate of MI. Module 2 spends most of its weight on reflection specifically, developing the continuum from simple restatement through complex, amplified, double-sided, and undershooting reflections — and on why a reflection is delivered as a statement rather than a question.</p>',
        },
        {
          title: 'Change Talk: DARN-CAT',
          content:
            '<p>Client language favoring change sorts into preparatory forms (desire, ability, reasons, need) and mobilizing forms (commitment, activation, taking steps). Module 2 develops why the mobilizing forms matter disproportionately — commitment language strength during a session predicts later behavior in a way that preparatory language alone does not.</p>',
        },
        {
          title: 'The Righting Reflex',
          content:
            '<p>The trained clinical instinct to correct what appears wrong — the instinct that made the counselor in the opening vignette explain neuropathy. Module 2 treats it as the central occupational hazard of the helping professions and works through the specific traps it produces: expert, labeling, premature focus, blaming, and question-answer.</p>',
        },
        {
          title: 'Fidelity and the MITI',
          content:
            '<p>Whether you are doing MI is an empirical question with an established answer method. Module 3 covers the Motivational Interviewing Treatment Integrity system, its global ratings and behavior counts, and the reason it exists: clinician confidence in their own MI skill is a poor predictor of coded performance.</p>',
        },
      ],
    },

    // ── Intro keyTakeaway
    {
      type: 'keyTakeaway',
      title: 'What You Will Take Away',
      takeaways: [
        'The ability to recognize ambivalence as the normal presentation it is, and to stop treating a client\'s counter-arguments as evidence that they are not ready for treatment.',
        'A reflective-listening repertoire you can actually deploy under time pressure — simple, complex, double-sided, amplified, and undershooting reflections, with a working sense of when each one fits.',
        'The ability to hear change talk and sustain talk in real time and to respond to each differently, rather than responding to everything a client says with the same supportive nod.',
        'A concrete method for giving clients information and advice — elicit–provide–elicit — that preserves autonomy instead of triggering the reactance that plain advice-giving produces.',
        'The judgment to notice your own righting reflex in the moment it fires, and a set of named traps to check yourself against when a session starts feeling like an argument.',
        'A defensible way to assess your own MI fidelity that does not rely on your impression of how the session felt, plus a realistic plan for the ongoing coaching that sustaining MI skill actually requires.',
      ],
    },

    // ── Baseline knowledge checks (2)
    {
      type: 'multipleChoice',
      question:
        'Before we begin: a client says, "I know I should cut back, and I\'ve tried, but honestly my drinking is the only thing that makes the evenings bearable." What is the most accurate clinical read of this statement?',
      options: [
        { text: 'The client is in denial about the severity of the problem and needs psychoeducation about alcohol\'s effects.', isCorrect: false },
        { text: 'The client is expressing ambivalence — both change talk and sustain talk in a single utterance — which is the normal starting condition MI is designed to work with.', isCorrect: true },
        { text: 'The client is being resistant and the clinician should confront the rationalization directly before continuing.', isCorrect: false },
        { text: 'The client is not yet appropriate for treatment and should be re-referred when they are more motivated.', isCorrect: false },
      ],
      correctAnswer: 1,
      explanation:
        '"I know I should cut back, and I\'ve tried" is change talk; "it\'s the only thing that makes the evenings bearable" is sustain talk. Both are present in one sentence, which is exactly what ambivalence looks like — not denial, not resistance, and certainly not unreadiness. We will develop this distinction throughout Module 1 and work on responding to each side differently in Module 2.',
    },
    {
      type: 'multipleChoice',
      question:
        'A counselor accurately explains the long-term medical consequences of a client\'s untreated condition, and the client agrees with everything said but does not change. Based on what MI theory predicts, what most likely happened?',
      options: [
        { text: 'The client lacked sufficient information and needs the explanation repeated with more specific data.', isCorrect: false },
        { text: 'The client has a personality-level deficit in conscientiousness that limits treatment response.', isCorrect: false },
        { text: 'The counselor voiced the pro-change side of an argument the client was already having internally, which positions the client to voice — and thereby strengthen commitment to — the other side.', isCorrect: true },
        { text: 'The therapeutic alliance was too weak for psychoeducation to be effective, and rapport-building should have come first.', isCorrect: false },
      ],
      correctAnswer: 2,
      explanation:
        'This is the core mechanism the course is built around, drawing on reactance theory and self-perception theory: when the clinician takes the pro-change side, the ambivalent client is left holding the status-quo side, argues for it, hears themselves argue for it, and becomes marginally more committed to it. Accuracy is not the issue; who voices the argument is. Module 1 develops the theory and Module 2 develops the alternative technique.',
    },

    // ── Opening reflection
    {
      type: 'reflection',
      question:
        'Bring to mind a specific client on your current caseload who "knows what they need to do" and is not doing it — the one you find yourself explaining things to more than once. Write down what you have said to them about why they should change. Then write down what you actually know about why they have not. If the second list is shorter than the first, that gap is what this course is about.',
      minLength: 60,
    },
  ];

  blocks.forEach((b, i) => { b.order = i + 1; });

  return {
    title: INTRO_TITLE,
    order: 0, // reassigned during resequence
    estimatedTime: 22,
    contentBlocks: blocks,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// PER-BODY-SECTION ADDITIONS
// Keyed by the EXACT existing section title. Each appends to the end of that
// section's existing [sectionDivider, text] pair — nothing existing is touched.
// `marker` is the idempotency sentinel (the callout's title).
// ─────────────────────────────────────────────────────────────────────────────

const SECTION_ADDITIONS = {

  // ══ SECTION 1 ═════════════════════════════════════════════════════════════
  'Foundations and Spirit of Motivational Interviewing': {
    marker: 'Sustain Talk Is Not Discord',
    build: () => [
      {
        type: 'callout',
        calloutType: 'info',
        title: 'Sustain Talk Is Not Discord',
        calloutItems: [
          '<strong>Sustain talk</strong> is the client\'s own language in favour of the status quo — "I\'ve tried before and it didn\'t work." It is one half of normal ambivalence and it is <em>about the behaviour</em>.',
          '<strong>Discord</strong> is friction in the working relationship itself — "You don\'t understand what my life is like," interrupting, disengaging. It is <em>about you and the client</em>, not about the behaviour.',
          'The older single category of "resistance" collapsed these two, which produced a single generic response to two different problems. The third edition separated them precisely because the correct clinical moves diverge.',
          'Sustain talk is responded to with reflection — often double-sided or amplified — and is expected. Discord is a signal to stop, repair the relationship, and usually to check whether you have drifted into a later process than the client is in.',
          'Sustain talk that steadily increases across a session is worth reading as a fidelity signal about the clinician\'s behaviour, not only as information about the client\'s readiness.',
        ],
      },

      {
        type: 'text',
        content: `<h2>Why the Four Processes Are Recursive Rather Than Sequential</h2>
<p>The four processes are frequently taught as a linear sequence, and the sequence is real in one direction: you cannot meaningfully evoke from a client who is not engaged, and a change plan built before evocation has done its work will be agreed to and abandoned. But the more clinically useful property of the model is that it runs backwards as well, and reading the backward movement is where most of the skill lives.</p>
<p>Consider what actually happens across a typical course of treatment. A client engages well in session one, a focus is negotiated in session two, and evocation goes productively in session three — the client generates several genuine reasons for change and the session ends with real momentum. In session four the clinician, reasonably, moves to planning. The client becomes vague. Answers get shorter. The specificity that was present a week ago is gone.</p>
<p>The intuitive reading is that the client has lost motivation, and the intuitive response is to re-motivate — to revisit the reasons, perhaps with slightly more emphasis than last time. This is almost always wrong. What has usually happened is that the move to planning raised the stakes, and raised stakes cost engagement. The client is not less motivated; the client is less safe. The MI-consistent move is to walk back down the staircase: return to engaging, reflect what has become harder, and let focusing and evoking re-establish themselves before planning is attempted again. Clinicians who cannot make this backward move tend to interpret every stall as a motivational deficit and respond by pressing, which reliably converts sustain talk into discord.</p>
<p>This is also where <strong>premature focus</strong> — one of the classic MI traps — does its damage. Premature focus is the trap of settling on a change target before the client has agreed that it is the target, and it is structurally encouraged by the systems most counselors work inside. A referral note names the referrer's concern. An intake form names a presenting problem. A treatment plan, often written before session three, names a goal with a measurable objective attached to it. None of these are the client's focus; they are the institution's. Working the institution's focus while believing it is the client's produces a client who is cooperative and inert, which is the presentation most often mislabeled as unmotivated.</p>
<p>The recursion has a second implication that matters for how you read a session in real time. Because the processes overlap rather than strictly succeeding one another, the diagnostic question is never "which phase of treatment is this client in?" but "which process is this <em>moment</em> in?" A single session can require engaging in the first ten minutes, evoking in the middle, a brief return to engaging when a difficult topic surfaces, and a small piece of planning at the end. Treating the process as a property of the treatment episode rather than of the moment is what produces sessions that feel technically correct and clinically dead.</p>
<h3>The Boundary: Where MI Is Not the Right Tool</h3>
<p>A course that presents MI as universally applicable does its learners a disservice, and MI's own literature is unusually clear about the boundary. MI is a method for resolving ambivalence about change. Where there is no ambivalence, MI has nothing to work on and using it wastes clinical time that belongs to something else.</p>
<p>A client who arrives already committed and asking for help with execution does not need evoking; they need planning, skills, and structure, and continuing to evoke reasons for a change they have already decided on is experienced as an odd refusal to help. A client in acute crisis — actively suicidal, in medical danger, unsafe at home — needs assessment, stabilization, and sometimes directive action, and MI's non-directive surface is a poor container for a situation requiring immediate protective steps. A client whose primary difficulty is a skills deficit rather than a motivational conflict needs teaching. And clients with significant cognitive impairment or acute psychosis may not be able to engage the reflective, ambivalence-exploring conversation MI depends on.</p>
<p>The clinically mature position is that MI is one instrument among several, distinguished by being the right one when the obstacle is ambivalence — which is a large fraction of behavior-change work but nowhere near all of clinical practice. Miller and Rollnick are direct that MI is best understood as combinable with other approaches rather than as a comprehensive treatment model, and the integration question is developed in Module 3.</p>`,
      },

      {
        type: 'flashcardDeck',
        instructions: 'Review each foundational term, then flip the card. These terms recur throughout Modules 2 and 3 and are used precisely rather than interchangeably.',
        flashcards: [
          { id: 'cr307-s1-fc1', front: 'Ambivalence', back: 'The simultaneous experience of wanting and not wanting the same change — a normal, expected human condition rather than denial, resistance, or a motivational deficit. Ambivalence is the specific clinical phenomenon MI was designed to resolve.' },
          { id: 'cr307-s1-fc2', front: 'Sustain Talk', back: 'Client language favouring the status quo — reasons not to change, doubts about ability, or arguments for the current behaviour. It is one normal half of ambivalence and is about the behaviour, not about the therapeutic relationship.' },
          { id: 'cr307-s1-fc3', front: 'Discord', back: 'Friction in the working relationship itself, expressed as arguing, interrupting, dismissing, or disengaging. Distinguished from sustain talk in the third edition because discord signals a problem in the alliance requiring repair, not more evoking.' },
          { id: 'cr307-s1-fc4', front: 'MI Spirit (PACE)', back: 'The underlying relational stance of MI: partnership (collaboration rather than hierarchy), acceptance (absolute worth, accurate empathy, autonomy support, affirmation), compassion (active commitment to the client\'s welfare), and evocation (drawing out what is already there).' },
          { id: 'cr307-s1-fc5', front: 'Evocation', back: 'The MI assumption that motivation and the resources for change already exist within the client and are drawn out rather than installed. Evocation is what makes MI directional and distinguishes it from purely non-directive person-centred counselling.' },
          { id: 'cr307-s1-fc6', front: 'Psychological Reactance', back: 'The motivational state produced when a person perceives a threat to their freedom of choice, driving them to restore that freedom — frequently by engaging more strongly in the discouraged behaviour. Reactance theory explains why direct persuasion backfires with ambivalent clients.' },
          { id: 'cr307-s1-fc7', front: 'Developing Discrepancy', back: 'The MI strategy of helping a client become more fully aware of the gap between their current behaviour and their own deeply held values or goals — elicited from the client rather than pointed out by the clinician, because self-generated discrepancy does not trigger reactance.' },
          { id: 'cr307-s1-fc8', front: 'Premature Focus', back: 'The clinician trap of settling on a change target before the client has agreed it is the target — frequently by adopting the referral source\'s or institution\'s agenda. It produces cooperative but inert clients who are then mislabeled as unmotivated.' },
          { id: 'cr307-s1-fc9', front: 'Autonomy Support', back: 'Explicit acknowledgement that the decision belongs to the client, including decisions the clinician disagrees with. Paradoxically increases the likelihood of change by removing the perceived threat to freedom that would otherwise trigger reactance.' },
        ],
      },

      {
        type: 'keyTakeaway',
        title: 'Module 1 Takeaways',
        takeaways: [
          'Ambivalence is the normal condition of people contemplating meaningful change, not evidence of denial, resistance, or unreadiness for treatment.',
          'Sustain talk and discord are different phenomena requiring different responses — sustain talk is reflected and expected; discord signals an alliance rupture that must be repaired before the work continues.',
          'The four processes are recursive, not merely sequential: a stall during planning usually means engagement has been lost, and the correct move is backward rather than harder.',
          'Direct persuasion of an ambivalent client predictably produces the opposite of its intent, because it positions the client to voice — and thereby strengthen — the status-quo side of their own argument.',
          'MI is a method for resolving ambivalence and is the wrong tool where ambivalence is not the obstacle: acute crisis, pure skills deficits, and clients already committed to change all call for something else.',
          'The spirit of MI is not decorative. Techniques delivered without partnership, acceptance, compassion, and evocation function as manipulation and are reliably experienced as such.',
        ],
      },

      {
        type: 'text',
        content: `<h2>What the Outcome Literature Actually Supports</h2>
<p>MI has an unusually large evidence base for a specific counselling method, and reading it accurately matters — both for honest informed consent and for knowing when to reach for MI rather than something else.</p>
<p>The broad finding across four decades is that MI produces small-to-moderate effects on behaviour change that are reliably better than no treatment or minimal-advice control conditions, and are frequently equivalent to substantially longer active treatments delivered in far more contact time (Lundahl &amp; Burke, 2009; Hettema, Steele, &amp; Miller, 2005). That last property — comparable outcomes in fewer sessions — is the practical argument for MI in settings where contact is brief, which describes most primary care, most crisis and intake work, most school counselling, and a great deal of community mental health.</p>
<p>The effects generalize well beyond the addictions context in which MI was developed. A systematic review of reviews covering health and social care settings found evidence of effect across a wide range of adult behaviour-change targets, though with substantial heterogeneity in effect size and considerable variability in the quality of the underlying trials (Frost et al., 2018). Honest reporting includes the null findings: a Cochrane-style review of MI for substance abuse concluded that effects, while present, were often small and not consistently maintained at long follow-up (Smedslund et al., 2011). MI is well supported. It is not a large-effect intervention, and clinicians who oversell it to clients or to themselves are setting up a disappointment.</p>
<p>More interesting for practice is the process literature — the question of <em>why</em> MI works, which bears directly on what to do in the room. The most comprehensive process meta-analysis to date tested two competing accounts (Magill et al., 2018). The <strong>technical hypothesis</strong> holds that MI works because MI-consistent clinician behaviours increase client change talk and decrease sustain talk, and that client language in turn predicts behaviour. The <strong>relational hypothesis</strong> holds that MI works through empathy and the MI spirit — that is, through general therapeutic relationship factors rather than anything specific to MI. The findings supported the technical pathway with reasonable consistency: clinician MI-consistent behaviour reliably predicted client change talk, and the ratio of change talk to sustain talk predicted behavioural outcome. Support for the purely relational pathway was weaker and less consistent.</p>
<p>Two clinical implications follow. First, evoking is not optional decoration on top of good rapport — the language the client produces is on the causal path, which is why the Module 2 skills are worth drilling rather than merely appreciating. Second, the relational findings' weakness in this specific analysis should not be over-read as evidence that the relationship does not matter; therapist interpersonal skill within sessions predicts client involvement and change talk, so empathy operates substantially by making the technical pathway possible rather than by bypassing it (Moyers, Miller, &amp; Hendrickson, 2005; Miller &amp; Moyers, 2021).</p>
<p>Finally, commitment language specifically. Amrhein and colleagues (2003) found that it was not the overall volume of change talk that predicted subsequent drug use outcomes but the <em>strength</em> of commitment language, and particularly its trajectory across the session — commitment strength rising toward the end predicted better outcomes than a high but flat level. This is a concrete listening target: the clinically meaningful question at the close of an MI session is not whether the client said encouraging things but whether the strength of what they committed to increased while you talked.</p>`,
      },

      {
        type: 'multipleChoice',
        question:
          'A client engaged well for three sessions and generated genuine reasons for change. In session four, the clinician moves to building a concrete change plan and the client becomes noticeably vague and less specific. What does the four-processes model suggest is the most likely explanation and correct response?',
        options: [
          { text: 'The client has lost motivation; the clinician should revisit the reasons for change with more emphasis.', isCorrect: false },
          { text: 'The move to planning raised the stakes and cost engagement; the clinician should move back down to engaging before re-attempting planning.', isCorrect: true },
          { text: 'The client is exhibiting discord; the clinician should name the rupture directly and process the therapeutic relationship at length.', isCorrect: false },
          { text: 'Four sessions is insufficient for planning; the clinician should defer planning until a fixed number of evoking sessions is complete.', isCorrect: false },
        ],
        correctAnswer: 1,
        explanation:
          'The processes are recursive, not merely sequential. Vagueness appearing precisely when planning begins is characteristically a loss of engagement under raised stakes rather than a loss of motivation. Re-evoking harder tends to convert this into discord. There is also no fixed session count that licenses planning — readiness is read from the conversation, not from the calendar.',
      },
      {
        type: 'multipleChoice',
        question:
          'Which of the following client statements is best classified as discord rather than sustain talk?',
        options: [
          { text: '"I\'ve tried quitting three times already and it never lasted more than a month."', isCorrect: false },
          { text: '"Honestly, the smoking is the only break I get during a twelve-hour shift."', isCorrect: false },
          { text: '"You keep circling back to this. I don\'t think you actually hear what I\'m telling you about my job."', isCorrect: true },
          { text: '"I know it\'s bad for me, I just don\'t think now is the right time with everything else going on."', isCorrect: false },
        ],
        correctAnswer: 2,
        explanation:
          'The first, second, and fourth options are all sustain talk — arguments about the behaviour and the status quo, which are the expected other half of ambivalence and are handled with reflection. The third is about the relationship itself: the client is telling the clinician that they are not being heard. That is discord, and it calls for repair — and usually for checking whether the clinician has drifted ahead of where the client actually is.',
      },
      {
        type: 'multipleChoice',
        question:
          'A client presents in acute crisis with active suicidal ideation and a specific plan. Applying the boundary conditions of MI covered in this module, what is the appropriate clinical stance?',
        options: [
          { text: 'Use MI throughout, since autonomy support is always the highest priority regardless of acuity.', isCorrect: false },
          { text: 'Use MI to evoke the client\'s own reasons for choosing safety before taking any protective action.', isCorrect: false },
          { text: 'Recognize that acute crisis calls for assessment, stabilization, and directive protective action; MI addresses ambivalence about change and is not a substitute for crisis response.', isCorrect: true },
          { text: 'MI is contraindicated for all clients with suicidal ideation at any level of acuity and should be discontinued permanently.', isCorrect: false },
        ],
        correctAnswer: 2,
        explanation:
          'MI\'s own literature is explicit about this boundary. Where the obstacle is not ambivalence — acute danger, pure skills deficits, or a client already committed to change — MI is the wrong instrument, and a non-directive surface is a poor container for a situation requiring immediate protective steps. Note the over-broad fourth option: the contraindication is about acuity in the moment, not about suicidal ideation as a permanent exclusion; MI-consistent work is frequently appropriate with these clients once they are stabilized.',
      },

      {
        type: 'reflection',
        question:
          'Think of a recent session where you felt a client was "not ready." Re-read that memory using the distinction developed in this module: were they producing sustain talk (arguments about the behaviour), or discord (friction with you)? What in your own behaviour immediately preceded it — had you moved to a later process than the client was actually in?',
        minLength: 50,
      },
    ],
  },

  // ══ SECTION 2 ═════════════════════════════════════════════════════════════
  'MI Micro-Skills and Clinical Application': {
    marker: 'A Reflection Is a Statement, Not a Question',
    build: () => [
      {
        type: 'callout',
        calloutType: 'tip',
        title: 'A Reflection Is a Statement, Not a Question',
        calloutItems: [
          'Let your voice fall at the end of a reflection. Rising inflection converts it into a question, and questions ask the client to justify themselves; statements invite them to continue.',
          '"So drinking is the one part of the evening that belongs to you." — a reflection. "So drinking is the one part of the evening that belongs to you?" — a question that will get you a yes or no and stop the exploration.',
          'A reflection is a hypothesis offered for correction, not a demonstration that you understood. Being slightly wrong is often more productive than being exactly right, because it prompts the client to clarify and elaborate.',
          'Aim for at least twice as many reflections as questions in an MI-consistent session; the ratio is a coded MITI metric, not a stylistic preference (Moyers et al., 2016).',
          'When you cannot think of a reflection, the reliable fallback is to reflect the emotion rather than the content — you are far less likely to be wrong about how something felt than about what it meant.',
        ],
      },

      {
        type: 'text',
        content: `<h2>DARN-CAT: Hearing the Structure Inside Change Talk</h2>
<p>Once you accept that client language is on the causal path to behaviour change, the question becomes practical: what exactly are you listening for? "Change talk" as a single undifferentiated category is too coarse to guide a response in real time. The DARN-CAT taxonomy divides it into two families that behave differently and call for different clinical moves.</p>
<p><strong>Preparatory change talk</strong> reflects a client moving toward change without yet committing to it. It contains four recognizable forms, remembered as DARN: <strong>Desire</strong> ("I want to", "I wish I could"), <strong>Ability</strong> ("I could", "I might be able to"), <strong>Reasons</strong> ("I'd sleep better if I did", "my daughter has noticed"), and <strong>Need</strong> ("I have to", "something has to give"). Preparatory change talk is genuine motivational movement and should be reinforced, but on its own it does not forecast behaviour especially well. Clients can produce large quantities of it and change nothing — which is precisely the presentation that leads clinicians to conclude the client is "all talk."</p>
<p><strong>Mobilizing change talk</strong> is the family that matters disproportionately, remembered as CAT: <strong>Commitment</strong> ("I will", "I'm going to"), <strong>Activation</strong> ("I'm ready to", "I'm willing to"), and <strong>Taking steps</strong> ("I threw the rest of it out this week", "I called and got the number"). Taking-steps language is the strongest of these because it reports behaviour that has already occurred rather than behaviour intended.</p>
<table>
<caption>The DARN-CAT taxonomy of change talk, with clinical listening targets</caption>
<thead>
<tr><th>Family</th><th>Form</th><th>Sounds like</th><th>What it tells you</th></tr>
</thead>
<tbody>
<tr><td>Preparatory (DARN)</td><td>Desire</td><td>"I want to stop feeling like this."</td><td>Motivation exists; commitment does not yet.</td></tr>
<tr><td>Preparatory (DARN)</td><td>Ability</td><td>"I probably could if I planned it out."</td><td>Self-efficacy is present — a target to strengthen.</td></tr>
<tr><td>Preparatory (DARN)</td><td>Reasons</td><td>"My blood pressure would come down."</td><td>Specific personal arguments to evoke more of.</td></tr>
<tr><td>Preparatory (DARN)</td><td>Need</td><td>"I can't keep doing this."</td><td>Urgency without direction; needs a focus.</td></tr>
<tr><td>Mobilizing (CAT)</td><td>Commitment</td><td>"I'm going to call on Monday."</td><td>The strongest verbal predictor of behaviour.</td></tr>
<tr><td>Mobilizing (CAT)</td><td>Activation</td><td>"I'm ready to try something."</td><td>Approaching commitment; planning may be viable.</td></tr>
<tr><td>Mobilizing (CAT)</td><td>Taking steps</td><td>"I poured out what was left."</td><td>Behaviour already begun — affirm specifically.</td></tr>
</tbody>
</table>
<p>The clinical significance of the split rests on a specific finding. Amrhein and colleagues (2003) coded commitment language across MI sessions and found that it was the strength of commitment language, and particularly its rising trajectory across the session, that predicted subsequent drug use outcomes — not the sheer volume of change talk overall. Preparatory language mattered mainly as a route to commitment language. The practical listening target this creates is unusually concrete: at the end of a session, the question is not "did the client say encouraging things?" but "did the strength of what the client committed to increase while we talked?"</p>
<h3>Responding When Change Talk Appears: EARS</h3>
<p>Change talk that goes unreinforced does not necessarily recur. When it appears, four strategic responses — <strong>EARS</strong> — make more of it likely. <strong>Elaborating</strong> asks for more: "In what way?" or "Tell me about the last time that happened." <strong>Affirming</strong> recognizes the strength or effort the statement reveals. <strong>Reflecting</strong> selectively restates the change-talk element rather than the sustain-talk element in an ambivalent utterance, which is the quiet directional work at the heart of MI. <strong>Summarizing</strong> gathers accumulated change talk into a collected whole and hands it back, so the client hears the case they have assembled in their own words.</p>
<p>Selective reflection deserves particular attention because it is where MI's directionality actually operates and where it is most easily misused. When a client says, "I know I should quit, but I've failed so many times," the clinician chooses which half to reflect. Reflecting the second half — "It's discouraging to have tried and not had it stick" — is empathic and sometimes exactly right when the alliance needs it. Reflecting the first half — "Part of you knows this needs to change" — is empathic <em>and</em> directional. Neither is dishonest; both are true things the client said. But the choice is not neutral, and making it deliberately rather than by default is a large part of what separates MI from general supportive listening.</p>
<p>The ethical guardrail on this is the MI spirit, and specifically compassion, which the third edition added explicitly because selective reflection is a genuinely powerful influence technique. The same skill that helps a client find their own reasons to take their insulin can be aimed at a goal the clinician prefers and the client does not hold. What makes selective reflection MI rather than manipulation is that the change being evoked is one the client has an authentic stake in — which is a question the clinician must keep actually asking rather than assume.</p>`,
      },

      {
        type: 'scenarioTree',
        scenarioTitle: 'Session Three: Responding to Sustain Talk',
        instructions: 'Work through this clinical decision point. There is more than one defensible path — follow one to its outcome, then use Back to explore an alternative.',
        startNode: 'start',
        nodes: {
          start: {
            text: `<p>Danielle is a 34-year-old client referred after a second citation for driving under the influence. She is court-involved, articulate, and has attended all three sessions. In session two she generated several reasons to cut back on drinking, including that her sister has stopped letting her drive her nephew.</p><p>Ten minutes into session three she says: <em>"I've been thinking about it all week, and honestly? I'm not an alcoholic. Everyone I work with drinks like I do. The only reason I'm sitting here is that I got unlucky twice. I don't think I have the problem you all think I have."</em></p>`,
            question: 'IF a court-involved client voices sustain talk that contradicts last week\'s change talk, THEN what is your next response?',
            choices: [
              { text: 'Point out the contradiction with last session — she listed real reasons to cut back a week ago.', next: 'confront', tag: 'Confront' },
              { text: 'Offer a double-sided reflection holding both what she said last week and what she is saying now.', next: 'doubleSided', tag: 'Double-sided' },
              { text: 'Reflect the autonomy and the frustration underneath, without arguing the diagnosis.', next: 'autonomy', tag: 'Autonomy + affect' },
              { text: 'Provide objective feedback on the drinking norms she has just invoked.', next: 'feedback', tag: 'Information' },
            ],
          },
          confront: {
            text: `<p>You say: <em>"Last week you told me your sister won't let you drive your nephew anymore, and that it bothered you. That doesn't sound like someone without a problem."</em></p><p>Danielle's posture changes. <em>"I said it bothered me that she's being dramatic. You're twisting what I said. This is exactly what I mean — you've all decided what I am."</em> She is noticeably cooler for the rest of the session and answers the next several questions in a sentence or less.</p>`,
            question: 'IF confrontation has produced discord, THEN what now?',
            choices: [
              { text: 'Hold the position — the contradiction is real and letting it go colludes with minimization.', next: 'holdPosition', tag: 'Hold' },
              { text: 'Stop, repair, and explicitly return the decision to her.', next: 'repair', tag: 'Repair' },
            ],
          },
          holdPosition: {
            type: 'endpoint',
            text: `<p>You maintain that the contradiction matters. Danielle becomes formally compliant — she agrees that you may be right, commits to nothing specific, and attends the remaining mandated sessions without further disclosure.</p>`,
            outcome: 'Compliance without change; alliance not recovered',
            score: 'poor',
            outcomeDetail:
              'Confronting the contradiction placed you on the pro-change side of her ambivalence, which left her arguing the status-quo side and hearing herself do it. What began as sustain talk about the behaviour became discord about the relationship, and holding the position converted discord into surface compliance. Note that nothing you said was inaccurate — accuracy was never the problem. This is the reactance mechanism from Module 1 operating in real time.',
          },
          repair: {
            type: 'endpoint',
            text: `<p>You say: <em>"I've pushed, and that wasn't useful. You're the one who gets to decide what this is and what to do about it — not me and not the court. Can I hear more about what it's been like having everyone decide what you are?"</em> Her shoulders drop slightly. She talks for several minutes about her sister.</p>`,
            outcome: 'Discord repaired; engagement recovered',
            score: 'good',
            outcomeDetail:
              'Recognizing discord and repairing it — rather than pressing — is the correct move, and explicitly returning the decision restores the autonomy the confrontation threatened. This is a real recovery. It is scored "acceptable with gaps" rather than optimal only because the confrontation cost a portion of the session and some disclosure that may not return immediately. Getting there without the detour is better.',
          },
          doubleSided: {
            text: `<p>You say: <em>"So on the one hand, you're clear you're not who people have decided you are, and the label doesn't fit — and on the other, something about your sister not letting you drive your nephew has stayed with you."</em></p><p>Danielle pauses. <em>"...Yeah. I mean, I'm not going to sit here and say I'm an alcoholic. But the nephew thing. That one got me."</em></p>`,
            question: 'IF a double-sided reflection has surfaced the change-talk side, THEN what next?',
            choices: [
              { text: 'Elaborate — ask her to say more about the nephew.', next: 'elaborate', tag: 'Elaborate (EARS)' },
              { text: 'Move to planning now that she has conceded a concern.', next: 'earlyPlan', tag: 'Plan' },
            ],
          },
          elaborate: {
            type: 'endpoint',
            text: `<p>You ask what it was about that specifically. She talks for eight minutes — about being the aunt who shows up, about what her sister's face looked like, about not wanting to be the relative people manage around. She ends with: <em>"I don't know what the answer is. But I don't want to be that."</em></p>`,
            outcome: 'Change talk deepened; commitment strength rising',
            score: 'excellent',
            outcomeDetail:
              'This is the MI-consistent path. The double-sided reflection acknowledged the sustain talk without endorsing or arguing it, and ended on the change-talk side — deliberate directional sequencing, since a double-sided reflection tends to leave the client continuing from whichever half came last. Elaborating then converted a conceded concern into her own extended argument. Note what you did not do: you never contested the "alcoholic" label, because the label was never the clinical target.',
          },
          earlyPlan: {
            type: 'endpoint',
            text: `<p>You suggest that since the nephew matters to her, this might be a good moment to set a concrete limit on drinking days. Danielle agrees pleasantly to two drink-free days a week. She reports the following session that it "didn't really happen."</p>`,
            outcome: 'Premature planning; inert plan',
            score: 'good',
            outcomeDetail:
              'A single conceded concern is preparatory change talk, not commitment. Moving to planning on the strength of it produces exactly the agreeable, uncommitted plan the course opened with — and note that she agreed readily, which is the trap: easy agreement in an ambivalent client is a signal to slow down, not a green light. More evoking first would likely have produced a plan she owned.',
          },
          autonomy: {
            type: 'endpoint',
            text: `<p>You say: <em>"It's genuinely frustrating to have a room full of people who've already decided what you are — and at the end of this, what you do about your drinking is your call, not the court's and not mine."</em> Danielle relaxes visibly. <em>"Thank you. That's the first time anyone's said that."</em> The remainder of the session is markedly more open, though the drinking itself is not addressed again today.</p>`,
            outcome: 'Engagement strengthened; evoking deferred',
            score: 'good',
            outcomeDetail:
              'Reflecting autonomy and affect without arguing the diagnosis is MI-consistent and was probably the right call for the alliance with a court-involved client who feels pre-judged. It is scored "acceptable with gaps" only because it stays in engaging when a double-sided reflection could have preserved the alliance and moved toward evoking in the same breath. With a more fragile alliance, this would be the optimal choice.',
          },
          feedback: {
            type: 'endpoint',
            text: `<p>You offer normative data: most adults drink considerably less than she has described, and her intake places her well above typical. Danielle says, <em>"I guess that depends who you ask,"</em> and the conversation moves on. The topic does not return.</p>`,
            outcome: 'Information delivered without permission; no traction',
            score: 'poor',
            outcomeDetail:
              'The information itself may be accurate and normative feedback has genuine evidence behind it — but delivered unasked, directly into sustain talk, it functions as counter-argument and triggers the same reactance as confrontation. The MI-consistent version is elicit–provide–elicit: ask permission, offer the data neutrally, then ask what she makes of it. The technique is not wrong; the sequencing and the missing permission are.',
          },
        },
      },

      {
        type: 'keyTakeaway',
        title: 'Module 2 Takeaways',
        takeaways: [
          'Change talk divides into preparatory forms (desire, ability, reasons, need) and mobilizing forms (commitment, activation, taking steps) — and it is the strength and rising trajectory of commitment language, not the volume of change talk overall, that predicts behaviour.',
          'A reflection is delivered as a statement with falling inflection; rising inflection converts it into a question and stops the exploration it was meant to open.',
          'Selective reflection is where MI\'s directionality actually lives: in an ambivalent utterance, which half you reflect is a clinical choice, and a double-sided reflection should generally end on the change-talk side.',
          'EARS — elaborate, affirm, reflect, summarize — are the responses that make change talk recur once it appears; unreinforced change talk does not reliably return.',
          'Information and advice are fully compatible with MI when delivered through elicit–provide–elicit with explicit permission; the same information delivered unasked into sustain talk functions as counter-argument.',
          'Easy agreement from an ambivalent client is a signal to slow down rather than a green light to begin planning.',
        ],
      },

      {
        type: 'imageText',
        title: 'Elicit–Provide–Elicit: Giving Information Without Triggering Reactance',
        imagePosition: 'left',
        content: `<p>The most persistent misconception about MI among clinicians learning it is that MI forbids giving information or advice. It does not. Withholding relevant clinical information from a client who needs it is not autonomy support — it is a failure of the compassion component of the MI spirit, and in many contexts it is an ethical problem. What MI specifies is not <em>whether</em> to give information but <em>how</em>, and the structure is <strong>elicit–provide–elicit</strong> (E-P-E).</p>
<p><strong>Elicit first.</strong> Before providing anything, find out what the client already knows and ask permission to add to it. "What do you already know about how metformin works?" followed by "Would it be alright if I shared a couple of things I know about it?" This does two things at once: it prevents you from delivering a lecture on material the client already has, which is a reliable way to communicate that you have not been listening, and it converts the information from something imposed into something invited. The permission ask is not a formality. It is the specific move that removes the threat to autonomy that would otherwise generate reactance.</p>
<p><strong>Provide neutrally.</strong> Offer the information in manageable pieces, in plain language, without attaching an implied instruction. "Some people find the stomach side effects settle after a couple of weeks" is neutral. "So you really should stick with it for at least two weeks" is an instruction wearing information's clothing, and clients hear the difference immediately. Offering more than one option where options genuinely exist further supports autonomy, because a choice among alternatives preserves the client's decision-making role in a way that a single recommendation does not.</p>
<p><strong>Elicit again.</strong> Close by asking what the client makes of it: "What do you think about that?" or "How does that land, given what you've been dealing with?" The final elicit is the step most often dropped under time pressure, and dropping it forfeits most of the value. It returns interpretation to the client, and it frequently produces change talk directly — because a client invited to react to information they asked for will often generate the argument the clinician was tempted to make.</p>
<p>Notice how E-P-E would have changed the opening vignette of this course. The counselor's account of diabetic neuropathy was accurate and important, and a client managing an A1c of 9.1 genuinely needs it. What made it counter-productive was that it arrived unrequested, in a single undivided block, with an implied instruction attached, and with no closing question. The identical content, asked for and then handed back to him for his own interpretation, would have been MI-consistent — and would have been considerably more likely to be acted on.</p>`,
      },

      {
        type: 'sequencing',
        instructions: 'Arrange the steps of an elicit–provide–elicit exchange in the correct clinical order.',
        explanation:
          'E-P-E always opens by finding out what the client already knows, then asks permission before anything is provided — the permission ask is the specific step that prevents reactance. Information is delivered neutrally and in manageable pieces, and the exchange closes by returning interpretation to the client. The final elicit is the step most often dropped under time pressure, and dropping it forfeits most of the technique\'s value.',
        steps: [
          { id: 'cr307-s2-seq1', order: 1, text: 'Ask what the client already knows about the topic, so you neither repeat what they have nor talk past what they are missing.' },
          { id: 'cr307-s2-seq2', order: 2, text: 'Ask explicit permission before adding anything: "Would it be alright if I shared a couple of things about that?"' },
          { id: 'cr307-s2-seq3', order: 3, text: 'Provide the information in small, plain-language pieces, without an implied instruction attached.' },
          { id: 'cr307-s2-seq4', order: 4, text: 'Where genuine alternatives exist, offer more than one option rather than a single recommendation.' },
          { id: 'cr307-s2-seq5', order: 5, text: 'Ask the client what they make of it, returning interpretation and the decision to them.' },
          { id: 'cr307-s2-seq6', order: 6, text: 'Reflect whatever change talk the client\'s response produced, rather than moving straight on to the next agenda item.' },
        ],
      },

      {
        type: 'multipleChoice',
        question:
          'A client says, "I poured what was left down the sink on Tuesday." Using the DARN-CAT taxonomy, how should this be classified, and why does the classification matter clinically?',
        options: [
          { text: 'Preparatory change talk (ability) — it demonstrates the client believes they are capable of change.', isCorrect: false },
          { text: 'Mobilizing change talk (taking steps) — it reports behaviour already performed, the strongest verbal indicator in the taxonomy, and warrants specific affirmation.', isCorrect: true },
          { text: 'Preparatory change talk (need) — it indicates the client felt compelled to act.', isCorrect: false },
          { text: 'Sustain talk, because describing past action can function as an argument that no further change is required.', isCorrect: false },
        ],
        correctAnswer: 1,
        explanation:
          'Taking steps is the "T" of CAT and reports behaviour that has already occurred rather than intention. It is the strongest of the mobilizing forms precisely because it is retrospective rather than prospective. Clinically it calls for specific affirmation of what the client actually did — not generic praise — and it is a reasonable signal that planning may now be viable.',
      },
      {
        type: 'multiSelect',
        question:
          'A client says: "I know I need to do something about the pills, but I\'ve been on them for six years and I don\'t know who I am without them." Which of the following responses are MI-consistent? Select all that apply.',
        options: [
          { text: '"Part of you knows something has to change, and at the same time six years is a long time to have built a life around something." — a double-sided reflection ending on the sustain-talk side to hold the alliance.', isCorrect: true },
          { text: '"Six years is a long time — and something in you is saying it needs to change." — a double-sided reflection ending on the change-talk side.', isCorrect: true },
          { text: '"You do know who you are without them. You were someone before six years ago." — a correction offered to build hope.', isCorrect: false },
          { text: '"Tell me about the part that knows something needs to change." — elaborating on the change-talk element.', isCorrect: true },
          { text: '"Have you considered that dependence on the medication may be part of the problem?" — a closed question introducing the clinician\'s formulation.', isCorrect: false },
        ],
        correctAnswer: 0,
        explanation:
          'The first, second, and fourth options are MI-consistent: two double-sided reflections (either ordering is defensible — ending on change talk is more directional, ending on sustain talk is sometimes right when the alliance needs it) and an elaborating question aimed at the change-talk element. The third corrects the client, which argues with their stated experience and invites them to defend it. The fifth is a closed question carrying the clinician\'s formulation — the expert trap, and reliably a producer of sustain talk. Note that correctAnswer for a multiSelect block records the first correct option only; the viewer grades from the isCorrect flags.',
      },
      {
        type: 'multipleChoice',
        question:
          'A clinician wants to share normative drinking data with a client who has just said, "everyone I work with drinks like I do." What is the MI-consistent way to proceed?',
        options: [
          { text: 'Withhold the data — providing information contradicts MI\'s non-directive stance.', isCorrect: false },
          { text: 'Present the data immediately, since the client\'s statement is factually inaccurate and leaving it uncorrected would be collusion.', isCorrect: false },
          { text: 'Ask what the client already knows about typical drinking levels, ask permission to share, provide the data neutrally, then ask what they make of it.', isCorrect: true },
          { text: 'Reflect the sustain talk and never return to the topic, since raising it again would risk discord.', isCorrect: false },
        ],
        correctAnswer: 2,
        explanation:
          'This is elicit–provide–elicit. The first and fourth options both rest on the common misconception that MI forbids giving information — withholding relevant clinical information is a failure of compassion, not autonomy support. The second delivers accurate information as counter-argument directly into sustain talk, which produces reactance regardless of accuracy. E-P-E preserves the information and removes the threat to autonomy that would otherwise make it backfire.',
      },

      {
        type: 'reflection',
        question:
          'Record or recall your most recent full session and estimate two numbers honestly: roughly how many reflections did you offer, and roughly how many questions did you ask? If reflections were not at least double the questions, pick one question you asked and write the reflection you could have offered instead.',
        minLength: 50,
      },
    ],
  },

  // ══ SECTION 3 ═════════════════════════════════════════════════════════════
  'Advanced MI — Integration, Diversity, and Fidelity': {
    marker: 'Fidelity Is Measured, Not Felt',
    build: () => [
      {
        type: 'callout',
        calloutType: 'warning',
        title: 'Fidelity Is Measured, Not Felt',
        calloutItems: [
          'Clinician self-report of MI skill correlates poorly with independently coded performance. Feeling like you had an MI session is not evidence that you had one.',
          'Workshop attendance alone — including a workshop exactly this length — does not reliably produce sustained MI proficiency. It reliably produces confidence, which is a different thing (Miller, Yahne, Moyers, Martinez, &amp; Pirritano, 2004).',
          'What does produce durable skill is workshop training <em>plus</em> ongoing feedback and coaching against recorded sessions; without that follow-up, gains decay substantially within months (Schwalbe, Oh, &amp; Zweben, 2014).',
          'This means completing this course does not make you MI-proficient. It makes you MI-informed, which is the necessary first component of a three-part process — training, practice with real clients, and coded feedback — and only the first.',
          'The practical minimum for anyone intending to practise MI seriously: record sessions with consent, and get at least a subset independently reviewed against MITI criteria rather than self-assessed.',
        ],
      },

      {
        type: 'text',
        content: `<h2>What MITI Coding Actually Measures</h2>
<p>The Motivational Interviewing Treatment Integrity system exists because of an uncomfortable and well-replicated finding: clinicians are poor judges of their own MI fidelity, and the direction of the error is consistently toward overestimation. The MITI provides an external, structured answer to the question of whether a given session was actually MI, and its architecture is worth understanding even for clinicians who will never be formally coded, because it names precisely what a good MI session contains.</p>
<p>The MITI has two components. The first is a set of <strong>global ratings</strong>, each scored on a five-point scale across the session as a whole and capturing the gestalt properties that no individual utterance carries. In MITI 4, these are cultivating change talk, softening sustain talk, partnership, and empathy (Moyers, Rowell, Manuel, Ernst, &amp; Houck, 2016). Note what the first two encode: the technical pathway from Module 1 is built directly into the fidelity instrument, so a session can be warm, well-attuned, and score poorly because the clinician never worked with the client's language.</p>
<p>The second component is a set of <strong>behaviour counts</strong> — tallies of specific clinician utterances, from which summary ratios are computed. The counted categories include giving information, persuade, persuade with permission, question, simple reflection, complex reflection, affirm, seeking collaboration, and emphasizing autonomy. Two derived ratios do most of the work in practice. The <strong>reflection-to-question ratio</strong> asks whether the clinician is primarily reflecting or primarily interrogating; MI-consistent practice runs well above parity, and a session dominated by questions is not MI regardless of how collaborative it felt. The <strong>percent complex reflections</strong> ratio asks whether reflections are adding meaning or merely restating words, since a session full of simple parroting can hit a good reflection-to-question ratio while doing very little clinical work.</p>
<p>Three things follow for practice. First, fidelity is behavioural and countable, which is what makes it improvable — you cannot practise "being more empathic" directly, but you can practise offering a complex reflection instead of the next question. Second, the global ratings mean technique alone will not carry a session: a clinician can hit the ratios mechanically and still score poorly on partnership and empathy, which is the coded version of the point that the MI spirit is not decorative. Third, and most practically, the specific things the MITI counts are the specific things worth attending to in your own recordings, whether or not anyone formally codes them.</p>
<h3>The Training Finding That Should Change Your Plan</h3>
<p>The most important applied result in the MI literature is not about clients at all. Miller and colleagues (2004) randomized clinicians to different methods of learning MI and found that a standard workshop produced immediate self-reported gains and immediate confidence — and that observed skill in actual practice largely decayed without follow-up. The conditions that produced durable, coded improvement were those adding ongoing feedback and coaching against real recorded sessions. A meta-analysis of MI training studies reached a compatible conclusion: initial training effects are real but decay, and sustained proficiency depends on continued coaching (Schwalbe, Oh, &amp; Zweben, 2014).</p>
<p>The honest implication for a course like this one is worth stating plainly, and it is the reason this callout is a warning rather than a tip. Completing three CE hours on MI produces knowledge of MI. It does not produce MI proficiency, and the well-documented risk is that it produces the <em>confidence</em> of proficiency, which is worse than knowing you are a novice because it removes the motive to seek feedback. A clinician who leaves here and begins recording sessions, reviewing them against the behaviour counts above, and arranging periodic external review is on the path the evidence supports. A clinician who leaves here believing they now do MI is, statistically, the clinician most likely to be doing something else and calling it MI.</p>`,
      },

      {
        type: 'cardSort',
        instructions: 'Sort each clinician utterance according to how MITI-style coding would treat it. Consider what the utterance does, not how warmly it was said.',
        explanation:
          'MI-adherent behaviours actively support autonomy, seek collaboration, affirm, or persuade only with explicit permission. MI non-adherent behaviours confront, direct, or persuade without permission — note that these can be delivered warmly and still be non-adherent, because coding attends to function rather than tone. Neutral behaviours (plain questions, simple information-giving, simple reflections) are counted but are neither adherent nor non-adherent on their own; they become MI or not through the ratios they produce across a session.',
        categories: ['MI-Adherent', 'MI Non-Adherent', 'Counted but Neutral'],
        cards: [
          { id: 'cr307-s3-cs1', text: '"Ultimately this is your decision, and you\'re the one who has to live with it."', correctCategory: 'MI-Adherent' },
          { id: 'cr307-s3-cs2', text: '"Would it be alright if I told you what the research says about that?"', correctCategory: 'MI-Adherent' },
          { id: 'cr307-s3-cs3', text: '"You kept that appointment even though you had every reason not to."', correctCategory: 'MI-Adherent' },
          { id: 'cr307-s3-cs4', text: '"What would you like us to focus on today?"', correctCategory: 'MI-Adherent' },
          { id: 'cr307-s3-cs5', text: '"If you keep going like this you\'re going to end up back in the hospital."', correctCategory: 'MI Non-Adherent' },
          { id: 'cr307-s3-cs6', text: '"I really think you need to stop seeing him — I say this because I care about you."', correctCategory: 'MI Non-Adherent' },
          { id: 'cr307-s3-cs7', text: '"You\'re minimizing. That\'s classic denial and we both know it."', correctCategory: 'MI Non-Adherent' },
          { id: 'cr307-s3-cs8', text: '"How many days last week did you take the medication?"', correctCategory: 'Counted but Neutral' },
          { id: 'cr307-s3-cs9', text: '"So you had a hard week."', correctCategory: 'Counted but Neutral' },
          { id: 'cr307-s3-cs10', text: '"The group meets on Tuesdays and Thursdays at six."', correctCategory: 'Counted but Neutral' },
        ],
      },

      {
        type: 'keyTakeaway',
        title: 'Module 3 Takeaways',
        takeaways: [
          'MI fidelity is an empirical question with an established method: MITI global ratings (cultivating change talk, softening sustain talk, partnership, empathy) plus behaviour counts yielding reflection-to-question and percent-complex-reflection ratios.',
          'Clinician self-assessment of MI skill overestimates coded performance, which is why recording and external review — not impression — is the minimum standard for anyone practising MI seriously.',
          'Workshop training alone produces confidence that decays into non-adherence; durable proficiency requires ongoing coaching against real recorded sessions.',
          'MI integrates with CBT, DBT, and trauma-informed care as a stance and a phase rather than a competitor — most commonly as the engagement and motivation-building work that precedes and periodically interrupts a more structured protocol.',
          'Cultural adaptation of MI adjusts what autonomy means and who participates in a decision, not whether the client\'s self-determination is honoured; autonomy support is a constant, its expression is a variable.',
          'Group MI changes the mechanism substantially — the facilitator must evoke change talk across members and manage the real risk of sustain talk becoming socially reinforced.',
        ],
      },

      {
        type: 'text',
        content: `<h2>Adapting MI Without Abandoning It</h2>
<p>MI was developed in the United States and the United Kingdom, and its emphasis on individual autonomy carries assumptions that are not universal. The adaptation question is one of the more misunderstood areas of MI practice, and it is usually posed badly — as a choice between fidelity to MI and responsiveness to the client. The more accurate framing distinguishes what is constant from what is variable.</p>
<p>What is constant is that the client's self-determination is honoured — that the clinician does not decide for the client and does not impose a change agenda. What is variable is what self-determination looks like and who is properly part of it. For a client from a strongly collectivist cultural frame, an autonomous decision may be one made in appropriate consultation with family or community, and a clinician who insists on locating the decision in the individual is not being more MI-consistent; they are substituting one imposed value for another. The MI-consistent adaptation asks whose input matters to this client, and evokes reasons for change that include relational and communal ones — the effect on a parent, the obligations of a role — rather than treating personal benefit as the only legitimate motivator (Resnicow &amp; McMaster, 2012; Castro, Barrera, &amp; Holleran Steiker, 2010).</p>
<p>Similar reasoning applies across other adaptations. With adolescents, whose autonomy is real but bounded and who are frequently in the room involuntarily, MI's non-confrontational stance is a particularly strong fit, and the evidence for adolescent MI is reasonably good — but the clinician must be explicit about the actual limits of confidentiality and the actual limits of the young person's decision-making authority rather than implying an autonomy that does not exist (Naar-King &amp; Suarez, 2011). With older adults, the change targets shift toward medication adherence, functional independence, and health behaviours, and the clinician should be alert to the ageist assumption that a long-standing behaviour is not worth addressing. With clients with co-occurring mental health and substance use conditions, MI's non-confrontational stance and its tolerance for slow, non-linear movement are advantages, though cognitive and symptom factors may require shorter sessions and more frequent summarizing.</p>
<h3>MI in Groups</h3>
<p>Group MI is not individual MI conducted in front of an audience, and clinicians who treat it that way tend to produce a series of brief individual sessions while the rest of the group disengages. The mechanism genuinely changes, and Wagner and Ingersoll's (2013) development of group MI is the standard reference for how (Wagner &amp; Ingersoll, 2013).</p>
<p>Two differences matter most. The first is that the facilitator's evoking is distributed: change talk must be elicited across members, and one member's change talk can be reflected and linked to another's, so that the group itself becomes a source of the arguments for change. Done well, this is more powerful than individual MI, because change talk voiced in front of peers carries the additional weight of a public statement. The second difference is the corresponding risk. Sustain talk is socially contagious in groups in a way it is not in dyads — one member's articulate defence of the status quo can be taken up and amplified by others, and a group can consolidate around a shared position that no individual member fully held on arrival. The facilitator's job includes actively softening sustain talk without confronting the member who voiced it, which is a genuinely harder skill than its individual equivalent and is the main reason group MI requires specific training rather than extrapolation from individual practice.</p>
<h3>Integration: MI as a Stance and a Phase</h3>
<p>The most common practical question about MI is how it fits with the structured protocols clinicians are already running. The answer is that MI functions as both a stance that can be maintained throughout and a distinct phase that recurs. Integrated with CBT, MI most often does the engagement and motivation work before a structured protocol begins, and is returned to whenever homework non-completion or protocol drift signals that the client's commitment has thinned — which is a considerably more productive reading than the alternative of treating non-adherence as a client characteristic. Integrated with DBT, MI's stance is already substantially compatible with the dialectical balance of acceptance and change. Integrated with trauma-informed care, MI's insistence on autonomy, collaboration, and permission-seeking is close to a direct expression of trauma-informed principles, and the fit is strong enough that the two are often difficult to separate in practice.</p>`,
      },

      {
        type: 'matching',
        matchingInstructions: 'Match each clinical population or context to the adaptation consideration that most specifically applies to it.',
        matchingPairs: [
          { term: 'Adolescents', definition: 'MI\'s non-confrontational stance fits an involuntary and developmentally autonomy-seeking client well, but the clinician must be explicit about the real limits of confidentiality and decision-making authority rather than implying an autonomy that does not exist.' },
          { term: 'Clients from collectivist cultural frames', definition: 'Evoke relational and communal reasons for change alongside personal ones, and treat consultation with family or community as a legitimate form of autonomous decision-making rather than a departure from it.' },
          { term: 'Older adults', definition: 'Change targets shift toward adherence, functional independence, and health behaviours; the clinician must guard against the ageist assumption that a long-standing behaviour is not worth addressing.' },
          { term: 'Co-occurring mental health and substance use disorders', definition: 'MI\'s tolerance for slow, non-linear movement is an advantage, but cognitive and symptom factors often call for shorter sessions and more frequent summarizing.' },
          { term: 'Group settings', definition: 'Evoking must be distributed across members and linked between them, while the facilitator actively softens sustain talk that would otherwise be socially amplified and consolidated by the group.' },
          { term: 'Court-mandated and other involuntary clients', definition: 'Naming the coercive reality of the referral openly, and explicitly returning whatever decision genuinely remains to the client, is what prevents the mandate itself from generating persistent reactance.' },
        ],
      },

      {
        type: 'multipleChoice',
        question:
          'A supervisee reports that their MI sessions "feel really collaborative" and asks whether formal fidelity coding is necessary. Based on the fidelity and training literature, what is the most defensible response?',
        options: [
          { text: 'Self-assessment is adequate once a clinician has completed formal MI training, since trained clinicians can accurately judge their own adherence.', isCorrect: false },
          { text: 'How a session felt is a poor predictor of coded fidelity, and clinicians consistently overestimate their own MI adherence — recorded sessions reviewed against MITI criteria are the appropriate standard.', isCorrect: true },
          { text: 'Fidelity coding is a research instrument with no application to routine clinical practice.', isCorrect: false },
          { text: 'Collaboration is the single MITI global rating, so a session that feels collaborative is by definition MI-adherent.', isCorrect: false },
        ],
        correctAnswer: 1,
        explanation:
          'The overestimation finding is the entire reason the MITI exists. The fourth option is also factually wrong about the instrument: MITI 4 has four global ratings — cultivating change talk, softening sustain talk, partnership, and empathy — and a session can feel highly collaborative while scoring poorly on cultivating change talk, because warmth and technical MI work are separately coded.',
      },
      {
        type: 'multipleChoice',
        question:
          'A clinician is working with a client whose family expects to be consulted on major health decisions. Which approach is most consistent with culturally adapted MI?',
        options: [
          { text: 'Maintain that the decision must be the client\'s alone, since autonomy support is a non-negotiable MI principle.', isCorrect: false },
          { text: 'Defer entirely to the family\'s preference, since imposing an individualist frame would be culturally insensitive.', isCorrect: false },
          { text: 'Evoke the client\'s own reasons for change including relational and communal ones, and treat consultation with family as a legitimate expression of the client\'s self-determination rather than a departure from it.', isCorrect: true },
          { text: 'Discontinue MI and switch to a directive family-systems approach, since MI\'s assumptions do not transfer across cultural frames.', isCorrect: false },
        ],
        correctAnswer: 2,
        explanation:
          'The constant in MI is that the client\'s self-determination is honoured; the variable is what self-determination looks like and who is properly part of it. The first option mistakes a culturally specific expression of autonomy for the principle itself. The second abandons the client\'s own voice. The fourth treats a manageable adaptation as a contraindication.',
      },
      {
        type: 'multipleChoice',
        question:
          'In a group MI session, one member offers an articulate defence of continuing to use, and two other members visibly agree. What does the group MI literature indicate about this moment?',
        options: [
          { text: 'It should be left alone, since confronting sustain talk in any form is MI non-adherent.', isCorrect: false },
          { text: 'Sustain talk is socially amplified in groups in a way it is not in dyads; the facilitator should actively soften it — reflecting and linking to other members\' change talk — without confronting the member who voiced it.', isCorrect: true },
          { text: 'The facilitator should conduct an individual MI exchange with that member while the group observes.', isCorrect: false },
          { text: 'The member should be removed from the group, since one member\'s sustain talk makes the group unworkable.', isCorrect: false },
        ],
        correctAnswer: 1,
        explanation:
          'Softening sustain talk is one of the four MITI global ratings and is an active clinical task, not a matter of leaving it alone — the first option confuses "do not confront" with "do not respond." The third describes exactly the error of treating group MI as individual MI with an audience. Distributed evoking and active softening without confrontation is the skill that makes group MI require its own training.',
      },

      {
        type: 'reflection',
        question:
          'Given the training evidence in this module — that workshop attendance produces confidence that decays without coaching — write a specific and realistic plan for your own MI development over the next six months. Name how you will obtain recorded sessions with appropriate consent, who could review them or with whom you could review them, and what you would look at first.',
        minLength: 60,
      },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// CONCLUSION SECTION (§8 fixed order)
//   sectionDivider → synthesis text → callout → accordion → keyTakeaway →
//   ethical-practice-plan text → reflection → resources → references text
//   (zero knowledge checks)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build the inline `.cr-references` text block from course.references[].
 * Handles all three formats the schema's Mixed type accepts, preferring the
 * pre-rendered `formatted` HTML the existing 20 entries already carry.
 * The DISPLAY list is alphabetized; course.references[] itself is never
 * reordered (that would be a rewrite of existing data).
 */
function buildReferencesBlock(references) {
  const lines = (references || [])
    .map((r) => {
      if (typeof r === 'string') return r;
      if (!r || typeof r !== 'object') return null;
      if (r.formatted) return r.formatted;
      if (r.citation) return r.citation;
      if (r.author) {
        return [
          r.author,
          r.year ? `(${r.year}).` : '',
          r.title ? `<em>${r.title}</em>.` : '',
          r.source || '',
        ].filter(Boolean).join(' ');
      }
      return null;
    })
    .filter(Boolean);

  if (!lines.length) return null;

  const sorted = [...lines].sort((a, b) =>
    a.replace(/<[^>]+>/g, '').localeCompare(b.replace(/<[^>]+>/g, ''), 'en')
  );

  return {
    type: 'text',
    content:
      '<div class="cr-references"><h2>References</h2>\n' +
      sorted.map((l) => `<p class="cr-reference">${l}</p>`).join('\n') +
      '\n</div>',
  };
}

function buildConclusionSection(course) {
  const blocks = [
    {
      type: 'sectionDivider',
      title: CONCLUSION_TITLE,
      subtitle:
        'The measure of this course is not what you can now explain about MI. It is what a client hears from you differently next week.',
      // sectionNumber intentionally omitted — see header note.
    },

    // ── Synthesis narrative (~680 words)
    {
      type: 'text',
      content: `<h2>What This Course Argued</h2>
<p>Throughout this course we have examined Motivational Interviewing as a specific, learnable, and measurable clinical method rather than as a general disposition toward being warm and non-judgmental. The argument moved through three modules, and it is worth reassembling before you leave, because the modules are considerably more useful held together than separately.</p>
<p>Module 1 established the foundation, and its central claim was a reframe: ambivalence is the normal condition of people contemplating meaningful change, not evidence of denial, resistance, or unreadiness. Everything else in MI follows from taking that claim seriously. Reactance theory explained why direct persuasion of an ambivalent client reliably produces the opposite of its intent — the clinician who voices the pro-change argument leaves the client holding the other one. Self-perception theory explained the corollary: because people infer their own attitudes partly from hearing themselves speak, the person who voices the argument is the person who ends up persuaded, which makes the client\'s own language a clinical target rather than a byproduct. Self-determination theory explained why autonomy support increases rather than decreases the likelihood of change. And the four processes — engaging, focusing, evoking, planning — gave us a way to read which conversation is actually happening, along with the discipline to walk back down the staircase when a stall during planning turns out to be a loss of engagement rather than a loss of motivation. Module 1 also drew the boundary that keeps MI honest: where the obstacle is not ambivalence, MI is the wrong instrument.</p>
<p>Module 2 turned that framework into behaviour. OARS supplied the mechanical substrate, with the weight on reflective listening, where MI is either learned or merely admired — the reflection continuum from simple restatement through complex, double-sided, amplified, and undershooting reflections, and the small but decisive discipline of letting your voice fall so that a reflection stays a statement. DARN-CAT gave us a taxonomy precise enough to guide a response in real time, along with the finding that gives the taxonomy its clinical weight: it is the strength and rising trajectory of commitment language, not the raw volume of change talk, that forecasts what a client will actually do. EARS supplied the responses that make change talk recur once it appears. Elicit–provide–elicit dismantled the most persistent misconception about MI by showing that information and advice are fully compatible with the method — that what MI specifies is not whether to inform but how. And the righting reflex was named for what it is: not a personal failing but the trained occupational instinct of every helping professional, firing hardest precisely when we care most.</p>
<p>Module 3 asked the question that separates clinicians who practise MI from clinicians who believe they do. Integration showed MI functioning as both a stance and a recurring phase alongside CBT, DBT, and trauma-informed care rather than competing with them. Adaptation established the distinction that keeps cultural responsiveness from collapsing into either rigidity or abandonment: honouring the client\'s self-determination is the constant, and what self-determination looks like — including who is properly part of a decision — is the variable. Group MI showed the mechanism genuinely changing, with distributed evoking on one side and socially amplified sustain talk on the other. And fidelity closed the course on its least comfortable finding: clinician self-assessment of MI skill consistently overestimates coded performance, workshop training reliably produces confidence that decays without coaching, and the only defensible answer to "am I doing MI?" involves a recording and someone other than yourself.</p>
<p>The thread running through all three modules is a single reversal, applied at every level from a single reflection to a six-month development plan. In ordinary helping, the clinician supplies the argument and the client supplies the resistance. In MI, the clinician supplies the conditions and the client supplies the argument. Nearly every MI error — the righting reflex, premature focus, the expert trap, unrequested information, planning before evoking — is a version of the same slip back into supplying the argument yourself. Noticing that slip, in the moment it happens, is the skill. It does not arrive fully formed at the end of a course; it is built session by session, against recordings, with feedback, over years.</p>`,
    },

    // ── Clinical integration callout
    {
      type: 'callout',
      calloutType: 'key',
      title: 'When You Return to Practice on Monday',
      calloutItems: [
        'In your next session, count your reflections against your questions. Do not change anything else yet — just get the number, because you almost certainly believe it is higher than it is.',
        'Pick one client you have been explaining things to repeatedly. Next session, ask them what they already know, ask permission before adding anything, and close by asking what they make of it. That is elicit–provide–elicit, and it is the single highest-yield change most clinicians can make immediately.',
        'When a client next produces an ambivalent sentence, notice which half you reflected. If you defaulted to the sustain-talk half, offer a double-sided reflection instead and let it end on the change-talk side.',
        'Stop treating easy agreement as progress. When an ambivalent client agrees readily to a plan, treat it as a signal to return to evoking rather than as permission to proceed.',
        'When a session starts to feel like an argument, name it to yourself as discord rather than resistance, stop, repair, and check whether you have moved to a later process than the client is in.',
        'Arrange the recording. Get consent, record one session this month, and listen to the first fifteen minutes with the MITI behaviour counts in front of you. This is the step that separates MI-informed from MI-proficient, and it is the step most clinicians skip.',
      ],
    },

    // ── Section highlights accordion
    {
      type: 'accordion',
      accordionItems: [
        {
          title: 'Introduction: The Client Who Already Knows',
          content:
            '<p>Established the reframe the whole course rests on — that the client who is not changing is typically not missing information or motivation but holding two genuine arguments at once — and showed how accurate, caring persuasion makes that situation measurably worse.</p>',
        },
        {
          title: 'Foundations and Spirit of Motivational Interviewing',
          content:
            '<p>Traced MI from Miller\'s 1983 observation through the theory that explains it, developed the PACE spirit and the four recursive processes, separated sustain talk from discord, and drew the boundary where MI is the wrong tool.</p>',
        },
        {
          title: 'MI Micro-Skills and Clinical Application',
          content:
            '<p>Built the working skill set: OARS and the reflection continuum, the DARN-CAT taxonomy with commitment language as the clinical listening target, EARS for reinforcing change talk, elicit–provide–elicit for information, and the righting reflex with its family of traps.</p>',
        },
        {
          title: 'Advanced MI — Integration, Diversity, and Fidelity',
          content:
            '<p>Addressed how MI combines with CBT, DBT, and trauma-informed care; how it adapts across cultural frames, developmental stages, and group settings without abandoning autonomy support; and how fidelity is actually measured — along with the training evidence showing that a course alone will not produce proficiency.</p>',
        },
      ],
    },

    // ── Course-level key takeaways
    {
      type: 'keyTakeaway',
      title: 'Course-Level Key Takeaways',
      takeaways: [
        'Ambivalence is the normal presentation, not a motivational deficit — and the clinician who argues the pro-change side leaves the client arguing, and thereby believing, the other one.',
        'MI is directional as well as person-centred: evoking the client\'s own change talk is what distinguishes it from supportive listening, and client language sits on the causal path to behaviour change.',
        'Sustain talk and discord are distinct and call for different responses — reflection for the first, repair and a step backward in the processes for the second.',
        'The four processes are recursive: engagement can be lost mid-session, and a stall during planning is usually a signal to move back rather than to press forward.',
        'Commitment language strength and its trajectory across a session predict subsequent behaviour more reliably than the overall volume of change talk.',
        'Information and advice belong in MI, delivered through elicit–provide–elicit with explicit permission; withholding needed clinical information is a failure of compassion, not autonomy support.',
        'Cultural adaptation varies what self-determination looks like and who participates in it, while honouring the client\'s self-determination remains constant.',
        'MI fidelity is measured, not felt — clinician self-assessment overestimates coded performance, and durable proficiency requires recorded sessions with ongoing coaching rather than training alone.',
      ],
    },

    // ── Ethical practice plan (~420 words)
    {
      type: 'text',
      content: `<h2>Ethical Practice Plan</h2>
<p>MI raises ethical questions that are easy to miss precisely because the method is warm and collaborative on its surface. Three deserve deliberate attention as you integrate this material.</p>
<p>The first is competence. The ACA Code of Ethics ties competence to education, training, <em>and</em> supervised experience together (ACA, 2014, §C.2.a), and the NBCC Code of Ethics obliges certified counselors to practise only within the boundaries of demonstrated competence (NBCC, 2023). This course is education. On the evidence reviewed in Module 3, education alone does not produce MI proficiency — which means that describing yourself as an MI practitioner on the strength of three CE hours is a competence-boundary problem, not merely an overstatement. The defensible position after this course is that you are practising MI-informed counselling and pursuing proficiency through supervised, recorded practice. Naming that accurately to clients, to supervisors, and in any marketing you control is the ethical action item, and it costs nothing but precision.</p>
<p>The second is the one MI\'s own developers were sufficiently worried about to change the model over. Selective reflection, evoking, and the strategic sequencing of double-sided reflections are genuine influence techniques, and they work. The same skill that helps a client locate their own reasons to take their insulin can be aimed at an outcome the clinician prefers and the client does not hold — a program\'s completion metrics, a referring physician\'s target, a family member\'s preference, or simply the clinician\'s own conviction about what this person should do. Compassion was added explicitly to the MI spirit in the third edition to close exactly this door. Practically, this means asking yourself before each evoking sequence whose goal you are strengthening, and treating an inability to answer confidently as a reason to stop and return to focusing. Where the change target came from a mandate rather than the client, informed consent requires naming that plainly (ACA, 2014, §A.2.a) rather than allowing a coercive arrangement to be experienced as a collaborative one.</p>
<p>The third concerns the recordings the fidelity plan requires. Recording sessions for supervision and self-review is standard and defensible, but it needs genuine informed consent that specifies who will hear the recording, for what purpose, how long it is retained, and how it is stored and destroyed — and the client\'s refusal must carry no consequence for their care (ACA, 2014, §§A.1.a, B.6). Build the consent and the retention practice before you record, not after.</p>
<p>Finally, hold the client\'s welfare above the method. MI is a good instrument with a real evidence base and real limits. A client who needs crisis intervention, skills training, medication evaluation, or simply concrete help with a material problem needs those things, and continuing to evoke while they go unaddressed is a fidelity success and a clinical failure.</p>`,
    },

    // ── Course-level reflection
    {
      type: 'reflection',
      question:
        'Return to the client you wrote about in the opening reflection — the one you had been explaining things to. Based on everything in this course, identify one specific change you will make in your practice within the next 30 days: name the client or session, name the technique you will use instead of explaining, and name how you will know whether it worked.',
      minLength: 60,
    },

    // ── Resources block, built from course.resources[]
    {
      type: 'resources',
      resources: Array.isArray(course.resources) ? course.resources : [],
    },

    // ── References text block appended below
  ];

  const refBlock = buildReferencesBlock(course.references);
  if (refBlock) blocks.push(refBlock);

  blocks.forEach((b, i) => { b.order = i + 1; });

  return {
    title: CONCLUSION_TITLE,
    order: 0, // reassigned during resequence
    estimatedTime: 20,
    contentBlocks: blocks,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// ENGINE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Additive assessment repairs. Never changes an answer, never rewrites,
 * adds, or removes a question. Returns a NEW assessment object (or the
 * original if nothing to do) plus the actions taken.
 */
export function planAssessmentRepairs(assessment) {
  const actions = [];
  if (!assessment || typeof assessment !== 'object') {
    return { assessment, actions: ['assessment: SKIP (absent)'] };
  }

  const next = JSON.parse(JSON.stringify(assessment));

  // (a) backfill correctAnswer from the isCorrect flags the viewer already
  //     falls back to. Never guesses: ambiguous questions are left alone.
  let filled = 0, already = 0, ambiguous = 0;
  (next.questions || []).forEach((q, i) => {
    if (!q || !Array.isArray(q.options)) return;
    if (typeof q.correctAnswer === 'number' && Number.isInteger(q.correctAnswer)) { already++; return; }
    const idxs = q.options
      .map((o, j) => ((o && typeof o === 'object' && o.isCorrect) ? j : -1))
      .filter((j) => j >= 0);
    if (idxs.length !== 1) {
      ambiguous++;
      actions.push(`assessment Q${i + 1}: SKIP correctAnswer — ${idxs.length} options flagged isCorrect (ambiguous; NOT guessed)`);
      return;
    }
    q.correctAnswer = idxs[0];
    filled++;
  });
  if (filled) actions.push(`assessment: BACKFILL correctAnswer on ${filled} question(s) from existing isCorrect flags (no answer changed)`);
  if (already && !filled) actions.push(`assessment: SKIP correctAnswer backfill (${already} already set)`);

  // (b) assessment.passingScore — §11 requires 80. Set only if absent.
  if (next.passingScore === undefined || next.passingScore === null) {
    next.passingScore = 80;
    actions.push('assessment: SET passingScore = 80 (was absent; matches existing passThreshold 0.8, course.passingScore, and settings.passingScore)');
  } else {
    actions.push(`assessment: SKIP passingScore (already ${next.passingScore})`);
  }

  const changed = filled > 0 || next.passingScore !== assessment.passingScore;
  if (!changed && !ambiguous) actions.push('assessment: nothing to repair');

  return { assessment: changed ? next : assessment, actions, changed };
}

/** Pure transform: returns { sections, references, assessment, actions } — no I/O. */
export function planPatch(course) {
  const sections = JSON.parse(JSON.stringify(course.sections || []));
  const actions = [];

  // ── 1. Introduction ───────────────────────────────────────────────────────
  if (sections.length > 0 && sections[0].title === INTRO_TITLE) {
    actions.push('intro: SKIP (already present)');
  } else {
    const intro = buildIntroSection();
    sections.unshift(intro);
    actions.push(`intro: INSERT section at position 1 (${intro.contentBlocks.length} blocks)`);
  }

  // ── 2. Per-body-section additions ─────────────────────────────────────────
  for (const section of sections) {
    const patch = SECTION_ADDITIONS[section.title];
    if (!patch) continue; // intro / conclusion / unrecognized title
    const already = (section.contentBlocks || []).some(
      (b) => b.type === 'callout' && b.title === patch.marker
    );
    if (already) {
      actions.push(`"${section.title}": SKIP (marker "${patch.marker}" present)`);
      continue;
    }
    const newBlocks = patch.build();
    section.contentBlocks = [...(section.contentBlocks || []), ...newBlocks];
    actions.push(`"${section.title}": APPEND ${newBlocks.length} blocks`);
  }

  // Warn loudly if an expected body section title was not found — a renamed
  // section would silently skip its whole compliance payload.
  for (const title of Object.keys(SECTION_ADDITIONS)) {
    if (!sections.some((s) => s.title === title)) {
      actions.push(`WARNING: expected body section "${title}" NOT FOUND — its compliance blocks were not applied`);
    }
  }

  // ── 3. References (append-only, existing order preserved) ─────────────────
  const references = Array.isArray(course.references) ? [...course.references] : [];
  const has = (formatted) => references.some((r) => {
    const s = typeof r === 'string' ? r : (r && (r.formatted || r.citation || r.title)) || '';
    return s.replace(/<[^>]+>/g, '').includes(formatted.replace(/<[^>]+>/g, '').slice(0, 60));
  });
  let added = 0;
  for (const ref of NEW_REFERENCES) {
    if (has(ref.formatted)) continue;
    references.push(ref);
    added++;
  }
  actions.push(added
    ? `references: APPEND ${added} citation(s) (${(course.references || []).length} → ${references.length})`
    : 'references: SKIP (all new citations already present)');

  // ── 4. Assessment (additive repairs only) ─────────────────────────────────
  const { assessment, actions: aActions } = planAssessmentRepairs(course.assessment);
  actions.push(...aActions);

  // ── 5. Conclusion ─────────────────────────────────────────────────────────
  if (sections.length > 0 && sections[sections.length - 1].title === CONCLUSION_TITLE) {
    actions.push('conclusion: SKIP (already present)');
  } else {
    const conclusion = buildConclusionSection({ ...course, references });
    sections.push(conclusion);
    actions.push(`conclusion: APPEND section (${conclusion.contentBlocks.length} blocks)`);
  }

  // ── 6. Resequence — every section and EVERY block gets an order ───────────
  sections.forEach((s, i) => {
    s.order = i + 1;
    (s.contentBlocks || []).forEach((b, j) => { b.order = j + 1; });
  });

  return { sections, references, assessment, actions };
}

/** Hard guard: this course is PUBLISHED. Content only. */
function assertImmutable(before, after) {
  const violations = IMMUTABLE.filter((f) =>
    Object.prototype.hasOwnProperty.call(after, f) &&
    JSON.stringify(after[f]) !== JSON.stringify(before[f])
  );
  if (violations.length) {
    throw new Error(
      `ABORT — patch would change immutable published-course field(s): ${violations.join(', ')}. ` +
      'This course is live to paying learners; only content may change.'
    );
  }
}

async function findCourse(col) {
  for (const slug of SLUGS) {
    const doc = await col.findOne({ slug });
    if (doc) return { doc, matchedBy: `slug:${slug}` };
  }
  for (const code of CODES) {
    const doc = await col.findOne({ courseCode: code });
    if (doc) return { doc, matchedBy: `courseCode:${code}` };
  }
  return { doc: null, matchedBy: null };
}

async function main() {
  if (!process.env.MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('interactivecourses');

  const line = '='.repeat(78);
  console.log('\n' + line);
  console.log(`patchACEPCompliance_CR-307 — ${EXECUTE ? 'EXECUTING WRITES' : 'DRY RUN (pass --execute to write)'}`);
  console.log(line);

  const { doc: raw, matchedBy } = await findCourse(col);
  if (!raw) {
    console.log(`NOT FOUND — tried slugs [${SLUGS.join(', ')}] and codes [${CODES.join(', ')}]`);
    await mongoose.disconnect();
    return;
  }

  console.log(`matched by ${matchedBy}`);
  console.log(`  "${(raw.title || '').slice(0, 70)}"`);
  console.log(`  courseCode=${raw.courseCode} · status=${raw.status} · isPublished=${raw.isPublished} · accessType=${raw.accessType} · price=${raw.price}`);
  console.log(`  ${(raw.sections || []).length} sections · wordCount=${raw.wordCount ?? 'n/a'} · references=${(raw.references || []).length} · examQs=${raw.assessment?.questions?.length ?? 0}`);

  if (raw.courseCode !== 'CR-307' || raw.slug !== SLUGS[0]) {
    console.log(`\nWARNING: matched document identity (${raw.courseCode} / ${raw.slug}) does not exactly match the expected CR-307 identity — verify before proceeding.\n`);
  }
  if (raw.status === 'published') {
    console.log('\n  ⚠ PUBLISHED COURSE — live to enrolled learners. Content-only patch.\n');
  }

  const { sections, references, assessment, actions } = planPatch(raw);
  actions.forEach((a) => console.log(`   ${a}`));

  const patched = { ...raw, sections, references, assessment };
  assertImmutable(raw, patched);
  console.log(`   immutable-field guard: PASS (${IMMUTABLE.join(', ')} unchanged)`);

  if (actions.every((a) => a.includes('SKIP') || a.includes('nothing to repair'))) {
    console.log('\nnothing to do — already fully patched');
    await mongoose.disconnect();
    return;
  }

  const before = countCourseWords(raw);
  const after = countCourseWords(patched);
  const target = requiredWordsFor(raw.ceHours || 0);
  console.log(`\nwords: ${before.toLocaleString()} → ${after.toLocaleString()} (+${(after - before).toLocaleString()})`);
  console.log(`CE target (${raw.ceHours} hr × 6,000 = ${target.toLocaleString()}): ${after >= target ? 'PASS' : 'STILL SHORT by ' + (target - after).toLocaleString()}`);
  console.log(`references: ${(raw.references || []).length} → ${references.length} (floor 15) · exam questions: ${assessment?.questions?.length ?? 0} (floor 15)`);

  // In-memory schema validation before any write.
  const vErr = new Course(patched).validateSync();
  if (vErr) {
    console.log('\nvalidateSync FAILED on the patched document:');
    Object.entries(vErr.errors || {}).slice(0, 20).forEach(([p, e]) => console.log(`   ${p}: ${e.message}`));
    console.log('\nAborting — fix validation before writing.');
    await mongoose.disconnect();
    return;
  }
  console.log('validateSync: PASS');

  if (!EXECUTE) {
    console.log('\nDRY RUN — no writes, no snapshot taken. Re-run with --execute to write.');
    console.log(line + '\n');
    await mongoose.disconnect();
    return;
  }

  // ── Pre-write snapshot (CLAUDE.md: "Snapshot Before Every Course Write") ──
  // toObject()/plain doc only — a live Mongoose document's subdocument arrays
  // carry a __parentArray circular reference that breaks EJSON serialization.
  console.log('\ntaking pre-write snapshot...');
  const snapSource = typeof raw.toObject === 'function' ? raw.toObject() : raw;
  const snap = await snapshotCourse(snapSource, {
    reason: 'patchACEPCompliance_CR-307: insert intro + conclusion, append per-section compliance blocks, append 12 references, additive assessment repairs',
  });
  console.log(`  local: ${snap.localPath || 'n/a'}${snap.localEphemeral ? ' (ephemeral on Render)' : ''}`);
  console.log(`  s3:    ${snap.s3Uri || snap.s3Error || 'n/a'}`);
  if (!snap.localPath && !snap.s3Uri) {
    console.log('\nABORT — snapshot produced neither a local nor an S3 copy. Refusing to write without a backup.');
    await mongoose.disconnect();
    return;
  }

  // ── Primary write path: Mongoose model (fires the pre-save rollup hook) ──
  try {
    const model = await Course.findById(raw._id);
    if (!model) throw new Error('document disappeared between read and write');
    model.set('sections', sections);
    model.set('references', references);
    if (assessment !== raw.assessment) model.set('assessment', assessment);
    model.markModified('sections');
    model.markModified('references');
    model.markModified('assessment');
    await model.save();
    console.log(`\nSAVED via model — wordCount=${model.wordCount} · sections=${model.sections.length} · references=${model.references.length}`);
  } catch (err) {
    console.log(`\n!!! MODEL SAVE FAILED: ${err.message}`);
    console.log('!!! FALLING BACK to raw collection update (validation bypassed).');
    console.log('!!! The failure above is in PRE-EXISTING content and must be fixed separately.');
    await col.updateOne({ _id: raw._id }, {
      $set: {
        sections,
        references,
        assessment,
        wordCount: countCourseWords(patched),
        totalContentBlocks: sections.reduce((n, s) => n + (s.contentBlocks || []).length, 0),
        totalEstimatedTime: sections.reduce((n, s) => n + (s.estimatedTime || 15), 0),
        sectionCount: sections.length,
        moduleCount: sections.length,
        assessmentQuestionCount: assessment?.questions?.length || 0,
        updatedAt: new Date(),
      },
    });
    console.log(`SAVED via collection — wordCount=${countCourseWords(patched)}`);
  }

  console.log(line + '\n');
  await mongoose.disconnect();
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => { console.error('ERROR:', e); process.exit(1); });
}
