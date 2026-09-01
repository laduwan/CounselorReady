/**
 * expandIntrosConclusions_CR301_CR302_CR307_CR601.js
 * GAITP LLC · NBCC ACEP #7760
 *
 * Word-count expansion for four courses that ship straight into Module 1 with
 * no course-level introduction, and whose conclusions carry little more than a
 * reference list. Each course gains:
 *
 *   1. A "Course Introduction and Orientation" section inserted at position 0
 *      (sectionDivider, two orientation text blocks, a scope callout, and a
 *      pre-course reflection).
 *   2. Conclusion blocks — Key Takeaways, a Module Highlights accordion, an
 *      Ethical Practice Plan, and a course-level reflection — inserted into the
 *      existing summary section AHEAD of its .cr-references block, per the
 *      conclusion block order in docs/SEED_AUTHORING_AND_VIEWER_GUIDE.md §7.
 *      Where a course has no conclusion section at all (CR-307), one is created
 *      and a reference list is built from course.references[].
 *
 * Roughly 3,000 words are added per course. Nothing existing is edited,
 * reordered, or removed — the patch only inserts.
 *
 * COURSES (slug drift is real in this collection, so each patch carries an
 * ordered list of candidate slugs plus courseCode fallbacks; see
 * reconcileDuplicates.js for the keeper/duplicate mapping):
 *   CR-301      28 Days Later: Understanding Addiction and Recovery
 *   CR-302      Motivational Interviewing: From Ambivalence to Action
 *   CR-307      Compulsive Sexual Behavior and Intimacy Disorders
 *   CR-CULTR-601 Foundations of Cultural Competence, Ethics, and Risk Reduction
 *
 * IDEMPOTENT. Re-running detects the inserted section and blocks by title and
 * skips them, so it is safe to run twice.
 *
 * DRY RUN by default:
 *   node src/scripts/expandIntrosConclusions_CR301_CR302_CR307_CR601.js
 * Write:
 *   node src/scripts/expandIntrosConclusions_CR301_CR302_CR307_CR601.js --apply
 *
 * WRITE PATH: the Mongoose model (doc.save()) so the pre-save hook recomputes
 * wordCount. Several of these documents were originally raw-inserted and may
 * carry legacy shapes the current schema rejects; if validation fails on
 * pre-existing content the script falls back to a collection update that sets
 * sections plus a wordCount computed with the canonical counter
 * (server/src/utils/courseWordCount.js), and says loudly that it did so.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { pathToFileURL } from 'url';
import { Course } from '../models/InteractiveCourse.js';
import { countCourseWords, requiredWordsFor } from '../utils/courseWordCount.js';

dotenv.config();

const APPLY = process.argv.includes('--apply');

const INTRO_SECTION_TITLE = 'Course Introduction and Orientation';
const TAKEAWAYS_TITLE = 'Key Takeaways';
const HIGHLIGHTS_TITLE = 'Module Highlights';
const PLAN_TITLE = 'Ethical Practice Plan';

// ─────────────────────────────────────────────────────────────────────────────
// PATCH CATALOGUE
// ─────────────────────────────────────────────────────────────────────────────
export const PATCHES = [

  // ── CR-301 · 28 Days Later: Understanding Addiction and Recovery ───────────
  {
    code: 'CR-301',
    label: '28 Days Later: Understanding Addiction and Recovery',
    slugs: [
      '28-days-later-understanding-addiction-and-recovery',
      '28-days-later-addiction-recovery',
    ],
    codes: ['CR-301', 'CR-401'],
    expectedModules: 5,

    introDividerSubtitle: 'Addiction is a chronic, relapsing brain disorder that presents in ordinary outpatient practice long before it presents in treatment settings — and the clinician who recognises it is usually not the one who specialises in it.',

    introBlocks: [
      { type: 'text', content: `<h2>The Disorder Most Clinicians Treat Without Meaning To</h2>
<p>Substance use disorders are among the most common conditions in outpatient mental health practice and among the least likely to be the reason a client says they have come. The presenting problem is anxiety, insomnia, a marriage in trouble, a job at risk, a mood that will not lift. The substance use is in the history, sometimes volunteered and sometimes not, and whether it becomes part of the formulation frequently depends on whether the clinician asked in a way that made an honest answer possible. Estimates consistently put the proportion of adults with a diagnosable substance use disorder who receive any specialty treatment in a given year in the single digits to low teens. The overwhelming majority of people with these disorders are either in no treatment at all or in a general mental health, primary care, or social service setting where the disorder is being managed by someone who does not consider themselves an addiction clinician.</p>
<p>That is the practical argument for this course. You do not need to intend to specialise in addiction to need competence in it. You need it because roughly one in five of the clients on a general outpatient caseload will meet criteria for a substance use disorder at some point in their treatment with you, because the presence of an untreated substance use disorder is one of the most reliable reasons that treatment for depression or anxiety does not work, and because the clinical moves that make a difference — asking well, assessing accurately, matching the intervention to the stage, planning for lapse rather than being surprised by it — are learnable and are not the exclusive property of specialty programmes.</p>
<p>The film that lends this course its title is useful mostly as a corrective. Twenty-eight days of residential treatment has become cultural shorthand for what recovery is: a discrete episode, a fixed duration, a before and an after. The clinical reality is nearly the opposite. Substance use disorders behave like other chronic relapsing conditions — hypertension, asthma, type 2 diabetes — with comparable rates of adherence difficulty and comparable rates of symptom return after treatment ends. Nobody describes a returning asthma symptom as evidence that the patient failed treatment or lacked motivation. That framing is reserved for addiction, and it does measurable harm: it justifies discharge on relapse, it justifies time-limited episodes of care for a condition that is not time-limited, and it teaches clients that a lapse is proof they were never serious. Understanding addiction as chronic rather than episodic is not a softening of expectations. It changes what treatment is designed to do.</p>` },

      { type: 'text', content: `<h2>How This Course Is Organized</h2>
<p>The course moves from mechanism to assessment to intervention to maintenance, on the argument that clinical decisions about substance use are only as good as the model behind them.</p>
<p>Module 1 covers the neuroscience and the phenomenology together, which is the only useful way to cover either. You will work through the reward, motivation, and executive control circuitry involved in the transition from use to disorder, the shift from positive to negative reinforcement that explains why people continue using something they no longer enjoy, and the allostatic account of tolerance and withdrawal. Just as importantly, you will work through what this looks like from the inside — the craving that arrives without a decision, the intention that dissolves at the moment of cue exposure, the shame that follows and reliably drives the next use.</p>
<p>Module 2 covers screening, assessment, and diagnosis: validated instruments and where each belongs, the DSM-5-TR criteria and the severity specifiers, distinguishing substance-induced from independent psychiatric disorders, and the interview practices that produce accurate disclosure rather than the answers a client believes you want.</p>
<p>Module 3 covers the evidence base for treatment — motivational interventions, contingency management, cognitive-behavioral and relapse-prevention approaches, twelve-step facilitation, and medications for alcohol and opioid use disorder that a non-prescriber needs to understand well enough to refer for, explain, and support.</p>
<p>Module 4 addresses special populations and cultural considerations, including adolescents, older adults, pregnant clients, clients with co-occurring disorders, and the ways in which access, criminalisation, and stigma are distributed unequally. Module 5 covers relapse prevention and recovery support: the difference between a lapse and a relapse, high-risk situation analysis, recovery capital, and the long arc of recovery beyond the treatment episode.</p>
<p>Throughout, the emphasis is on what a generalist clinician can actually do — in a fifty-minute session, in an outpatient setting, without a specialty programme's resources.</p>` },

      { type: 'text', content: `<h2>What the Evidence Actually Says About Outcomes</h2>
<p>Clinicians frequently arrive at addiction work carrying a demoralising folk statistic: that treatment does not work, that most people relapse, that the effort is largely wasted. It is worth confronting this directly at the outset, because the belief shapes how hard a clinician tries and how they interpret what happens.</p>
<p>The comparison that resolves it is with other chronic conditions. Adherence to treatment regimens for type 1 diabetes, hypertension, and asthma runs in roughly the same range as adherence in substance use disorder treatment, and symptom recurrence rates after a treatment episode are broadly comparable across all four. Nobody concludes from a returning asthma symptom that inhaled corticosteroids do not work or that the patient was insufficiently motivated. The conclusion drawn is that the condition is chronic, that the treatment manages rather than cures it, and that recurrence indicates a need to re-engage and adjust rather than to discharge. Applying the same logic to substance use disorders is not lowering the bar. It is applying the correct bar.</p>
<p>Within that frame, the specific findings are encouraging. Brief interventions in general medical and outpatient settings produce small but real reductions in hazardous drinking at a cost measured in minutes. Contingency management produces some of the largest effect sizes in the behavioural treatment literature. Medications for opioid use disorder reduce mortality substantially — this is one of the clearest life-saving findings in behavioural health — and medications for alcohol use disorder produce meaningful reductions in heavy drinking days. Long-term follow-up studies consistently find that a majority of people with substance use disorders eventually achieve sustained remission, frequently after multiple treatment episodes and frequently including periods of unassisted change.</p>
<p>Two implications follow for practice. First, the number of treatment episodes is not a measure of failure; for a chronic relapsing condition it is a measure of continued engagement, which is the strongest predictor of eventual remission. Second, the clinician's realistic expectation should be improvement over a long horizon punctuated by setbacks, not a single decisive episode. Communicating that expectation to a client at the beginning — rather than letting them discover it by relapsing and concluding they have failed — is one of the highest-value things said in an early session.</p>` },
    ],

    introAccordion: {
      type: 'accordion', title: 'Common Questions Before You Begin',
      instructions: 'Open each question. These are the ones that come up most often from generalist clinicians approaching this material.',
      accordionItems: [
        { title: 'Do I need an addiction credential to treat substance use disorders?', content: '<p>No — but you do need competence, which the ethics codes define as education, training, and supervised experience together. Screening, assessment, formulation, brief intervention, motivational work, and relapse-prevention planning are within the scope of a licensed generalist. Medically supervised withdrawal, opioid treatment programme services, and prescribing are not. The practical question is not whether you hold a credential but whether you can describe, for a given client, what you are competent to provide and where the boundary of that is. Where a specialty credential adds most is in complex polysubstance use, severe presentations, and clients requiring a higher level of care than outpatient sessions.</p>' },
        { title: 'Should I require abstinence before treating a co-occurring disorder?', content: '<p>The sequential model — treat the substance use first, then the psychiatric disorder — is no longer supported. It excludes the clients most in need of care and produces poor outcomes for both conditions. Integrated treatment, addressing both concurrently within a single plan, is the current standard. The clinical challenge is diagnostic rather than sequential: distinguishing substance-induced symptoms from an independent disorder requires establishing temporal sequence and, where feasible, observing symptoms across a period of reduced use.</p>' },
        { title: 'Is harm reduction compatible with abstinence-oriented treatment?', content: '<p>Yes, and treating them as opposed is a false choice that costs lives. Harm reduction reduces the damage associated with continued use — overdose death, infection transmission, injury — for people who are not currently able or willing to stop. It does not preclude abstinence as a goal and does not reduce the likelihood of eventually achieving it. The clinical stance that follows is to keep the client alive and engaged while their goals develop, rather than making engagement contingent on a goal they have not yet chosen.</p>' },
        { title: 'What do I do if a client relapses?', content: '<p>Treat it as a clinical event requiring assessment and plan adjustment, exactly as you would a returning symptom in any chronic condition. Assess safety first, including tolerance loss after a period of abstinence, which is the mechanism behind a substantial proportion of overdose deaths. Then conduct a functional analysis of the sequence — the high-risk situation, the decision points, the coping attempted — and revise the plan accordingly. What you should not do is discharge, moralise, or treat it as evidence that the client was never serious. Deciding your response in advance, and telling the client what it will be, is what makes honest disclosure possible.</p>' },
      ],
    },

    framework: {
      type: 'imageText',
      title: 'The Chronic-Condition Frame: One Idea Behind Every Module',
      content: `<p>Every clinical recommendation in this course follows from a single organising claim: substance use disorders behave like other chronic relapsing conditions, and treating them as acute episodes produces the failures the field then blames on clients.</p>
<p>Under the <strong>acute frame</strong>, treatment is an episode with a beginning and an end, success is abstinence at discharge, and a return to use is evidence that the episode failed or that the client was not ready. This frame produces discharge-on-relapse policies, time-limited authorisations for an unlimited condition, and a client who learns that honesty about a lapse is dangerous.</p>
<p>Under the <strong>chronic frame</strong>, treatment manages a long-run condition, success is measured in trajectory rather than at a single endpoint, and a return to symptoms triggers re-engagement and plan adjustment — exactly as a returning asthma symptom triggers a medication review rather than a discharge. Adherence and recurrence rates for substance use disorders sit in broadly the same range as for type 1 diabetes, hypertension, and asthma; the difference is entirely in how the profession interprets the same numbers.</p>
<p>Hold this frame as you work through the modules. When an intervention is described, ask what it is managing rather than what it is curing. When a client returns to use, ask what the plan needs rather than whether the client was serious.</p>`,
      image: '',
      imageAlt: 'A two-column comparison diagram. The left column, labelled Acute frame, shows a linear path from intake through a fixed treatment episode to discharge, with a return to use branching off to a dead end marked "treatment failure / discharge". The right column, labelled Chronic frame, shows a continuous loop of assessment, treatment, monitoring, and re-engagement, with a return to use feeding back into plan adjustment rather than exit.',
      imagePosition: 'right',
    },

    introTakeaways: [
      'A validated screening instrument you administer to every client at intake, built into the packet rather than left to clinical impression.',
      'The ability to say, for a specific client, whether a psychiatric symptom is substance-induced or independent — and the temporal reasoning that settles it.',
      'A functional analysis of a return to use that produces a plan adjustment rather than a verdict about motivation.',
      'Enough working knowledge of medications for alcohol and opioid use disorder to explain them accurately and refer without ambivalence.',
      'A relapse-prevention plan naming warning signs, high-risk situations, coping skills, support contacts, and the threshold for re-engagement.',
      'A stated policy on what happens after a lapse, told to the client in advance, so that honesty stays possible.',
    ],

    baselineMC: {
      question: 'Before we begin: a client in outpatient treatment for alcohol use disorder returns after two weeks of abstinence having drunk heavily over a weekend. Which first response is most consistent with the evidence base?',
      options: [
        { text: 'Discharge the client from the programme, since continued use indicates they are not ready for outpatient treatment.' },
        { text: 'Assess safety first — including loss of tolerance — then conduct a functional analysis of the sequence and revise the plan accordingly.' },
        { text: 'Maintain the existing plan without change, since a single lapse is not clinically meaningful.' },
        { text: 'Refer immediately to residential treatment regardless of the circumstances of the lapse.' },
      ],
      correct: 1,
      explanation: 'A return to use in a chronic relapsing condition is a clinical event requiring assessment and plan adjustment, not a verdict about readiness. Safety comes first, because tolerance falls during abstinence and is a mechanism behind a substantial share of overdose deaths. Discharge guarantees the outcome it punishes and teaches the client that disclosure is dangerous; leaving the plan unchanged ignores information the lapse just supplied; automatic escalation to residential care skips the assessment that would establish whether it is indicated. We will explore this in Module 5.',
    },

    integrationCallout: {
      type: 'callout', calloutType: 'key', title: 'When You Return to Practice on Monday',
      content: `<ul>
<li><strong>Put a validated screener in the intake packet for every client</strong>, not for the ones who seem to need it — that judgment is where bias enters.</li>
<li><strong>Identify withdrawal risk before you build any behavioral plan.</strong> Unmanaged alcohol, benzodiazepine, and barbiturate withdrawal can be fatal. Know today who you will call.</li>
<li><strong>Tell every client in advance what happens if they use.</strong> The policy you state before a lapse determines whether you hear about it after one.</li>
<li><strong>Establish your referral relationships now</strong> — medication providers, higher levels of care, specialty programmes. The moment you need them is the moment a client is willing, and that window is short.</li>
<li><strong>Assess safety first after any return to use</strong>, tolerance loss included, before you do anything else.</li>
<li><strong>Ask about recovery capital, not just symptoms</strong> — housing, work, relationships, community, meaning. It predicts sustained recovery better than treatment dose does.</li>
</ul>`,
    },

    resources: [
      { title: 'NIAAA — Alcohol Treatment Navigator', url: 'https://alcoholtreatment.niaaa.nih.gov/', type: 'website', description: 'Federal guide to identifying quality alcohol treatment, including what to look for in a provider and how to evaluate programme claims. Useful to work through with clients and families.' },
      { title: 'SAMHSA National Helpline and Treatment Locator', url: 'https://findtreatment.gov/', type: 'website', description: 'Free, confidential referral service and searchable treatment locator covering substance use and co-occurring disorders across all levels of care.' },
      { title: 'AUDIT — Alcohol Use Disorders Identification Test (WHO)', url: 'https://www.who.int/publications/i/item/WHO-MSD-MSB-01.6a', type: 'worksheet', description: 'Ten-item validated screening instrument with scoring guidance, free from the World Health Organization. Suitable for universal intake screening.' },
      { title: 'SAMHSA TIP 63 — Medications for Opioid Use Disorder', url: 'https://store.samhsa.gov/product/tip-63-medications-opioid-use-disorder/pep21-02-01-002', type: 'guidelines', description: 'Federal treatment improvement protocol covering buprenorphine, methadone, and naltrexone, with a module written specifically for non-prescribing behavioral health clinicians.' },
    ],

    introCallout: {
      type: 'callout', calloutType: 'clinical', title: 'Why This Matters — and What This Course Will and Will Not Do',
      content: '<p>This course prepares licensed clinicians to screen, assess, formulate, and treat substance use disorders in general outpatient practice, and to know the boundaries of that setting. It does not qualify anyone to provide medically supervised withdrawal management: unmanaged alcohol, benzodiazepine, and barbiturate withdrawal can be fatal, and any client whose use pattern raises that possibility requires immediate medical evaluation rather than an outpatient behavioral plan. It does not substitute for the supervised experience required for a substance use credential, and it does not cover prescribing. Where the material addresses medications for addiction treatment, it does so at the level a non-prescriber needs in order to refer competently, explain accurately, and support adherence — not to make medication decisions.</p>',
    },

    introReflection: 'Before you begin, bring to mind a client on your current caseload whose substance use you have noted but never made a formal part of the treatment plan. Write down why: whether you judged it subclinical, whether you were waiting for the client to raise it, whether you were concerned about the alliance, or whether you were not confident you would know what to do if they said yes. Be specific about the reason. You will be asked to return to this at the end of the course, and the reason you write down now is the thing most likely to change what you do next.',

    takeaways: `<h2>Key Takeaways</h2>
<p>The organising argument of this course is that substance use disorders are chronic, relapsing conditions with identifiable neurobiological mechanisms, well-validated assessment tools, and a substantial evidence base for treatment — and that the clinician most likely to encounter them is a generalist who does not think of addiction as their area.</p>
<p>The mechanism matters because it drives the clinical stance. The transition from voluntary use to disorder involves progressive engagement of reward and motivational circuitry, a shift from positive reinforcement (using to feel good) to negative reinforcement (using to avoid feeling terrible), and a weakening of the prefrontal regulatory systems that would ordinarily interrupt the sequence. Craving is not a failure of resolve; it is a conditioned response to cue exposure that arrives before deliberation begins. A clinician who understands this stops treating continued use as evidence of insufficient motivation and starts treating it as a problem of cue exposure, reinforcement contingencies, and regulatory capacity that has specific interventions attached to it.</p>
<p>Assessment is where most generalist practice can improve fastest. Validated screening instruments take minutes, apply to every client rather than to the ones who look like they need it, and outperform clinical impression. DSM-5-TR criteria with severity specifiers replace the older abuse-dependence dichotomy and support a graded response. The hardest assessment judgment is distinguishing substance-induced symptoms from an independent co-occurring disorder, and the discipline that resolves it is temporal: establishing the sequence of onset, and where possible observing symptoms across a period of abstinence, rather than diagnosing both conditions at once and treating neither well.</p>
<p>Treatment has a real evidence base and the effect sizes are comparable to those for other chronic conditions. Motivational approaches work by evoking the client's own reasons for change rather than supplying the clinician's. Contingency management has among the strongest evidence in the field and remains among the least used, largely for reasons of funding and stigma rather than efficacy. Cognitive-behavioral and relapse-prevention approaches target the high-risk situations, the expectancies, and the coping deficits that convert an urge into a use. Medications for alcohol and opioid use disorder are substantially underprescribed relative to their evidence, and a non-prescriber's ability to explain them accurately and refer without ambivalence materially affects whether a client receives them.</p>
<p>Population and context change the picture. Adolescent presentations differ neurobiologically and developmentally; older adults are routinely under-screened and interact with medications differently; pregnant clients face a set of barriers in which fear of legal and child welfare consequences reliably suppresses disclosure; and the distribution of criminalisation, access, and stigma across communities means that two clients with identical use patterns can face entirely different consequences for seeking help. Formulating a client's reluctance to disclose without accounting for what disclosure costs them is a formulation error.</p>
<p>Finally, recovery is longer than treatment. A lapse is not a relapse, and the difference is largely determined by what the client believes about it — which is determined by what the clinician taught them to expect. High-risk situation analysis, coping rehearsal, recovery capital, and a written plan that names warning signs, skills, contacts, and thresholds are what convert an episode of care into a durable outcome. Discharge on relapse, for a chronic relapsing condition, is a policy that guarantees the outcome it punishes.</p>`,

    takeawayItems: [
      'Substance use disorders are chronic and relapsing, with adherence and recurrence rates comparable to hypertension, asthma, and type 2 diabetes — a lapse is a clinical event, not a moral verdict.',
      'Universal validated screening outperforms clinical impression and takes minutes; who "seems to warrant" screening is exactly where bias enters.',
      'Craving is a conditioned response that precedes deliberation; continued use is a problem of cue exposure, reinforcement, and regulatory capacity, not of insufficient motivation.',
      'Separating substance-induced from independent co-occurring disorders is a temporal judgment, established by sequence of onset and, where feasible, observation across abstinence.',
      'Medications for alcohol and opioid use disorder are substantially underprescribed; a non-prescriber\'s accurate explanation and unambivalent referral materially affect access.',
      'Recovery capital predicts sustained recovery better than treatment dose; plan for the arc after the episode, not just the episode.',
    ],
    highlights: [
      { title: 'Module 1 — The Neuroscience and Phenomenology of Addiction', content: '<p>The transition from use to disorder involves progressive engagement of reward and motivational circuitry, a shift from positive to negative reinforcement, and weakened prefrontal regulation. Allostatic models explain tolerance, withdrawal, and the falling hedonic set point. Phenomenologically this presents as craving that precedes deliberation, intention that dissolves at cue exposure, and shame that reliably drives the next use. Understanding addiction as a chronic relapsing brain disorder — with adherence and recurrence rates comparable to hypertension, asthma, and type 2 diabetes — reframes relapse as a clinical event rather than a moral verdict.</p>' },
      { title: 'Module 2 — Screening, Assessment, and Diagnosis', content: '<p>Validated screening applied universally outperforms clinical impression and takes minutes. DSM-5-TR replaces the abuse-dependence dichotomy with a single disorder across eleven criteria and mild, moderate, and severe specifiers, supporting a graded clinical response. The central diagnostic challenge is separating substance-induced from independent co-occurring disorders, resolved by establishing temporal sequence and, where feasible, observing symptoms across a period of abstinence. Interview technique determines disclosure: normalising, specific, non-judgmental questions produce accurate answers where general ones produce reassurance.</p>' },
      { title: 'Module 3 — Evidence-Based Treatment Approaches', content: '<p>Motivational interventions evoke the client\'s own change talk rather than supplying the clinician\'s reasons. Contingency management has among the strongest evidence in the field and among the lowest uptake. Cognitive-behavioral and relapse-prevention approaches target high-risk situations, outcome expectancies, and coping deficits. Twelve-step facilitation has empirical support distinct from the fellowship itself. Medications for alcohol and opioid use disorder are markedly underprescribed; a non-prescriber\'s accurate explanation and unambivalent referral materially affect access.</p>' },
      { title: 'Module 4 — Special Populations and Cultural Considerations', content: '<p>Adolescent presentations differ neurobiologically and developmentally and require different engagement and family involvement. Older adults are under-screened, and interactions with prescribed medication change the risk picture. Pregnant clients face legal and child welfare consequences that suppress disclosure, which is a structural problem rather than a motivational one. Criminalisation, treatment access, and stigma are distributed unequally across communities, and a formulation that ignores what disclosure costs a particular client will misread their reluctance.</p>' },
      { title: 'Module 5 — Relapse Prevention and Recovery Support', content: '<p>A lapse is a discrete return to use; a relapse is a return to the prior pattern, and what determines which one occurs is substantially what the client believes about the lapse. High-risk situation analysis, coping rehearsal, and the abstinence violation effect are the working concepts. Recovery capital — social, physical, human, and cultural resources — predicts sustained recovery better than treatment dose does. Written plans naming warning signs, skills, contacts, and thresholds for re-engagement convert an episode of care into a durable outcome.</p>' },
    ],

    plan: `<h2>Ethical Practice Plan</h2>
<p>Applying this material creates specific obligations worth naming concretely rather than leaving as intentions.</p>
<p><strong>Universal screening.</strong> Commit to a validated screening instrument administered to every client at intake rather than to the clients who seem to warrant it, since who "seems to warrant it" is exactly where clinical impression and bias enter. Build it into the intake packet so it happens on a full day.</p>
<p><strong>Medical safety.</strong> Commit to identifying withdrawal risk before building any behavioral plan. Unmanaged alcohol, benzodiazepine, and barbiturate withdrawal can be fatal; a client whose use pattern raises that possibility needs medical evaluation the same day, not an outpatient reduction schedule. Know in advance who you will call.</p>
<p><strong>Competence and referral.</strong> The ACA Code of Ethics locates competence in education, training, and supervised experience together. A continuing education course is one of the three. Identify honestly which parts of this material you can implement now, which require supervision before you use them, and which require referral — and establish the referral relationships before you need them, since the moment you need them is the moment a client is willing and the window is short.</p>
<p><strong>Confidentiality.</strong> Substance use records carry protections beyond the general standard in many jurisdictions, and clients are frequently more concerned about disclosure than about the use itself. Be accurate rather than reassuring about what you record, who can access it, and what your reporting obligations are. Vague comfort is worse than a precise account of limits, particularly for pregnant clients, parents, licensed professionals, and clients with legal involvement.</p>
<p><strong>Continuity through relapse.</strong> Decide now what your response to a lapse will be, and tell the client in advance. A policy of discharge on relapse, applied to a chronic relapsing condition, guarantees the outcome it punishes and teaches the client that honesty is dangerous. If your setting has such a policy, that is an institutional problem to raise rather than a clinical standard to adopt.</p>`,

    conclusionReflection: 'Return to the client you named before Module 1 — the one whose substance use you had noted but not made part of the plan. With the material of this course in view, rewrite your reason for that decision. Was it a screening problem, an assessment problem, a confidence problem, or an anticipated-alliance problem? Then write the specific first move you will make in your next session with them: the question you will ask, in the words you will use, and where in the session you will ask it. If your answer is that you would refer rather than treat, name the referral you would actually make and confirm this week that it exists and is accepting clients.',
  },

  // ── CR-302 · Motivational Interviewing: From Ambivalence to Action ─────────
  {
    code: 'CR-302',
    label: 'Motivational Interviewing: From Ambivalence to Action',
    slugs: [
      'motivational-interviewing-from-ambivalence-to-action',
      'motivational-interviewing-ambivalence-to-action',
    ],
    codes: ['CR-302', 'CR-402'],
    expectedModules: 3,

    introDividerSubtitle: 'Ambivalence is not resistance to change — it is the ordinary structure of wanting two incompatible things at once, and it is the material motivational interviewing was built to work with.',

    introBlocks: [
      { type: 'text', content: `<h2>The Client Who Says "I Know, But"</h2>
<p>"I know I need to stop, but." "I know I should leave, but." "I know I have to do something about it, but." Every clinician hears this sentence weekly, and the reflex it produces is remarkably consistent: supply the missing argument. Explain the risk more clearly. Offer the information the client seems to be missing. Point out the contradiction between what they say they want and what they are doing. Push, gently, in the direction of the obvious right answer.</p>
<p>The reflex is well-intentioned and it reliably makes things worse. The finding that gave rise to motivational interviewing, and that has been replicated many times since, is that when a clinician argues for change, the client argues against it — and that the amount of client language in favour of the status quo during a session predicts the absence of change afterward. The clinician who pushes hardest produces the most counter-argument, and the counter-argument is the mechanism by which the client talks themselves further into staying the same. Something that feels like doing more of the work is in fact producing the opposite of the intended result.</p>
<p>Ambivalence is the reason. A client saying "I know, but" is not being evasive or under-informed. They are reporting accurately that two things are simultaneously true: there are real reasons to change, and there are real reasons things have stayed as they are. The behaviour is doing something for them — managing anxiety, holding a relationship together, providing the only reliable relief available, protecting an identity — and the fact that it is also causing damage does not cancel the first function. Ambivalence is not a stage before readiness. For most people, most of the time, it is what readiness looks like from the inside.</p>
<p>Motivational interviewing was developed specifically for that space. It is not a set of techniques for overcoming ambivalence from the outside, and it is not — despite the persistence of this misreading — a warm-up that softens clients before the real intervention starts. It is a collaborative conversational method with a specific purpose: to help a person explore and resolve their own ambivalence in the direction of their own values. The change, when it comes, is theirs, argued for in their own words, which is precisely why it holds.</p>` },

      { type: 'text', content: `<h2>How This Course Is Organized</h2>
<p>The course moves from stance to skill to integration, in that order, because MI delivered as technique without spirit is reliably identifiable — by observers, by fidelity coders, and by clients — and does not produce the outcomes the method is known for.</p>
<p>Module 1 covers the foundations and the spirit: partnership, acceptance, compassion, and evocation as the underlying stance; the four processes of engaging, focusing, evoking, and planning as the arc of the work; the theoretical and empirical basis including psychological reactance and self-perception theory; and the central finding that change talk and sustain talk within a session predict behaviour outside it. It also addresses the righting reflex directly, since noticing and interrupting your own is the first practical skill in the method.</p>
<p>Module 2 covers the micro-skills and their clinical application: open questions, affirmations, reflections, and summaries; the distinction between simple and complex reflection and why complex reflection carries most of the therapeutic work; recognising change talk in its preparatory and mobilising forms; eliciting it deliberately rather than waiting for it; and responding to sustain talk and discord without either confronting or colluding. This module is where most of the deliberate practice sits.</p>
<p>Module 3 covers advanced application: integrating MI with other treatments rather than treating it as a rival school, using it across cultural difference and in contexts of unequal power, working with mandated and referred clients where autonomy is genuinely constrained, and fidelity — how MI is measured, how practitioners reliably overestimate their own adherence, and what actually improves it. The honest finding here is that workshop attendance alone produces little durable skill change and that coding and feedback on real sessions is the practice that does.</p>
<p>Throughout, the emphasis is on what the method sounds like in a real session rather than on what it is called. Reading about reflective listening does not produce reflective listening; hearing yourself and adjusting does.</p>` },

      { type: 'text', content: `<h2>What Motivational Interviewing Is Not</h2>
<p>MI is misread in four recurring ways, and each misreading produces a recognisable distortion in practice. Naming them at the outset is worth more than any definition.</p>
<p><strong>It is not a technique for getting people to do what you want.</strong> This is the most consequential misreading because it inverts the method while preserving its vocabulary. A clinician using reflective listening to steer a client toward the clinician's preferred conclusion is doing something other than MI, and clients generally detect it. The method is directional — it deliberately evokes and strengthens language on one side of the ambivalence — but the direction has to be the client's own stated goal. When it is the clinician's, the honest move is to say what you think and let the client refuse it.</p>
<p><strong>It is not simply being warm and non-confrontational.</strong> Client-centred warmth is a necessary condition and not a sufficient one. MI is distinguishable from good supportive counselling by its differential attention to change talk: the deliberate eliciting, reflecting, and reinforcing of the client's own arguments for change. A session with excellent empathy and no differential attention to change talk is empathic counselling, which is valuable and is not MI.</p>
<p><strong>It is not a preliminary stage before the real treatment.</strong> The "MI as engagement phase" framing is widespread and only half right. MI does work well as a prelude to a structured treatment, but it is also a complete method in its own right with independent evidence for behaviour change, and it is frequently most valuable in the middle of another treatment, at the point where progress has stalled and the clinician is about to start pushing.</p>
<p><strong>It is not incompatible with giving information or advice.</strong> Clinicians new to MI often become reluctant to say anything directive at all, which is unhelpful and is not what the method requires. Information and advice are given with permission, offered rather than imposed, and followed by an invitation to respond — the elicit-provide-elicit structure. Withholding relevant clinical information in the name of client autonomy is a distortion, not a fidelity.</p>` },
    ],

    introAccordion: {
      type: 'accordion', title: 'Common Questions Before You Begin',
      instructions: 'Open each question. These are the objections and confusions that come up most reliably in MI training.',
      accordionItems: [
        { title: 'Is MI a therapy, or a style I use inside another therapy?', content: '<p>Both, and the distinction matters less than it seems. MI has independent evidence as a brief standalone intervention, particularly for substance use, health behaviour change, and treatment engagement. It also integrates readily as a style within cognitive-behavioral, case management, and other treatments, and is frequently most valuable at the point where a structured treatment has stalled and the clinician is about to start pushing. What it is not is a warm-up phase to be completed and left behind.</p>' },
        { title: 'What do I do when a client is genuinely doing something dangerous?', content: '<p>Safety comes first and MI resumes afterward. Where there is imminent risk, the clinician acts — assessment, safety planning, reporting where required, hospitalisation where indicated. What MI contributes even here is the manner: information and concern delivered with permission and followed by an invitation to respond produce less reactance than the same content delivered as a warning. But the method is not a reason to defer an intervention a client urgently needs, and any framing that suggests otherwise has misread it.</p>' },
        { title: 'Does MI work with mandated clients who do not want to be there?', content: '<p>The evidence supports its use with mandated and referred populations, but honesty about the constraint is a precondition. Autonomy is genuinely limited when attendance is court-ordered and reports are required, and performing a freedom the client does not have damages credibility immediately. Name the constraint accurately, be clear about what you must report, and then be equally clear about what does remain the client\'s choice — which is usually more than they expect, and is where the work happens.</p>' },
        { title: 'How do I know whether I am actually doing MI?', content: '<p>Not by asking yourself. The consistent finding is that self-rated adherence correlates weakly with adherence coded from recordings, and that clinicians who have attended training reliably overestimate their own fidelity. What establishes competence is recording sessions, coding a sample against a fidelity measure such as the MITI, and receiving feedback — ideally with a colleague doing the same. Reading and workshop attendance prepare you to practise; they do not establish that you can.</p>' },
      ],
    },

    framework: {
      type: 'imageText',
      title: 'The Ambivalence Balance: Why Pushing Produces Resistance',
      content: `<p>The framework underneath every technique in this course is a simple balance with two sides, and one counter-intuitive property.</p>
<p>On one side sits everything arguing for change: the costs the behaviour is imposing, the values it conflicts with, the future the client wants. On the other sits everything holding the status quo in place: what the behaviour does for the client, what change would cost, and what has failed before. A person in ambivalence holds both sides at once, and both are genuine.</p>
<p>The counter-intuitive property is this: <strong>the balance is not static, and the clinician is standing on it.</strong> When a clinician argues the change side, the client — behaving exactly as people do when a position is argued at them — voices the other. That voicing is not a symptom of poor motivation. It is a product of the conversation, and the amount of it within a session predicts the absence of change afterward. The clinician who argues hardest for change reliably produces the most argument against it.</p>
<p>Everything MI does follows from this. Evoke rather than install. Reflect sustain talk rather than dispute it. Attend differentially to the client's own change language, because it is the client's arguments, spoken in the client's voice, that move the balance and hold once you are gone.</p>`,
      image: '',
      imageAlt: 'A balance-scale diagram. The left pan is labelled "reasons for change — costs, values, desired future" and the right pan "reasons for the status quo — what the behaviour does, what change costs, past failures". An arrow labelled "clinician argues for change" presses down on the left pan while the right pan rises, annotated "client voices sustain talk". A second arrow labelled "clinician evokes change talk" is shown lifting the right pan instead.',
      imagePosition: 'right',
    },

    introTakeaways: [
      'The ability to notice your own righting reflex in the moment and stop, rather than recognising it afterward on the drive home.',
      'Reliable complex reflection — naming the unspoken half of an ambivalent statement rather than repeating the spoken half.',
      'The ability to hear change talk in its preparatory and mobilising forms, and to respond to it differentially rather than letting it pass.',
      'A working set of evocative moves: importance and confidence rulers, looking forward and back, and values exploration.',
      'A response to sustain talk and to discord that neither confronts nor colludes.',
      'An honest read on your own fidelity, obtained from a recorded session rather than from your impression of how it went.',
    ],

    baselineMC: {
      question: 'Before we begin: a client says, "I know I should cut back on drinking, but honestly it is the only thing that helps me sleep." Which response best reflects motivational interviewing?',
      options: [
        { text: '"Actually, alcohol disrupts sleep architecture — it makes sleep worse, not better. Let me explain how that works."' },
        { text: '"Cutting back matters to you, and at the same time drinking is doing a real job for you right now — it is what gets you to sleep."' },
        { text: '"What do you think would happen if you tried just one week without it?"' },
        { text: '"A lot of my clients have found that sleep improves within a couple of weeks of stopping."' },
      ],
      correct: 1,
      explanation: 'The second response is a complex reflection that names both sides of the ambivalence, including the half the client has just told you is real. The first supplies accurate information as a correction and will reliably produce more argument for drinking — the righting reflex in its most common form. The third is a reasonable question asked too early, before the ambivalence has been reflected. The fourth offers information without permission and implicitly disputes the client\'s experience. We will explore complex reflection and the righting reflex in Modules 1 and 2.',
    },

    integrationCallout: {
      type: 'callout', calloutType: 'key', title: 'When You Return to Practice on Monday',
      content: `<ul>
<li><strong>Catch the righting reflex once per session and stop mid-sentence.</strong> Noticing it in the room, rather than afterward, is the first real skill.</li>
<li><strong>Reflect before you ask.</strong> A complex reflection ahead of a question changes what the question gets.</li>
<li><strong>Name the unspoken half.</strong> When a client gives you one side of the ambivalence, reflect the other side back and let them fill it in.</li>
<li><strong>End a summary on the change side</strong> — collect, link, and finish where the client\'s own momentum is.</li>
<li><strong>Wait for mobilising language before planning.</strong> Commitment, activation, taking steps. Planning ahead of it produces agreements the client does not enact.</li>
<li><strong>Record one session this month and listen to it.</strong> Your impression of your own adherence is a weak predictor of what a coder would find.</li>
</ul>`,
    },

    resources: [
      { title: 'Motivational Interviewing Network of Trainers (MINT)', url: 'https://motivationalinterviewing.org/', type: 'organization', description: 'The international professional home of MI, with free practitioner resources, training listings, and the current fidelity and coding literature.' },
      { title: 'MITI 4.2.1 Coding Manual (Motivational Interviewing Treatment Integrity)', url: 'https://casaa.unm.edu/codinginst.html', type: 'guide', description: 'Free coding instrument and manual from the University of New Mexico for measuring MI fidelity from recorded sessions — the tool that turns self-assessment into evidence.' },
      { title: 'SAMHSA TIP 35 — Enhancing Motivation for Change', url: 'https://store.samhsa.gov/product/tip-35-enhancing-motivation-change-substance-use-disorder-treatment/pep19-02-01-003', type: 'guidelines', description: 'Federal treatment improvement protocol on motivational approaches, including stage-matched strategies and worked clinical dialogue.' },
      { title: 'Importance and Confidence Ruler — printable client worksheet', url: 'https://motivationalinterviewing.org/sites/default/files/tnt_manual_2014_d10_20150205.pdf', type: 'worksheet', description: 'Ruler exercises and evocative question sets drawn from the MINT training manual, usable directly in session.' },
    ],

    introCallout: {
      type: 'callout', calloutType: 'clinical', title: 'Why This Matters — What This Course Can and Cannot Do',
      content: '<p>Motivational interviewing is a learnable clinical method with a strong evidence base across substance use, medication adherence, health behaviour change, and treatment engagement. It is also one of the methods practitioners are most likely to believe they are already doing. Self-rated MI adherence correlates weakly with coded adherence, and the correction that works is not more reading but recorded sessions reviewed against a fidelity measure with feedback. Treat this course as the conceptual foundation and the map of what to practise. Treat competence as something established afterwards, through supervised practice with real feedback on real sessions. Nothing here qualifies anyone to train or supervise others in the method.</p>',
    },

    introReflection: 'Before you begin, recall a recent session in which you found yourself working harder on a change than the client was. Reconstruct it honestly: what did you say, and what did the client say next? Most clinicians, replaying this, can hear the moment where their own argument for change produced the client\'s argument against it. Write down that exchange as closely as you can remember it. You will use it later in the course, and the two lines of dialogue you write now will teach you more about the righting reflex than any definition of it.',

    takeaways: `<h2>Key Takeaways</h2>
<p>Motivational interviewing is best understood as a specific answer to a specific clinical problem: how to work with a person who has genuine reasons to change and genuine reasons not to, without taking a side that will produce the counter-argument.</p>
<p>The spirit comes first because the technique does not work without it. Partnership means the conversation is between two experts, one on the method and one on their own life. Acceptance means honouring absolute worth, accurate empathy, autonomy, and affirmation — and autonomy in particular is not a courtesy but the operative ingredient, since a person who does not experience the choice as theirs has nothing to commit to. Compassion means the clinician's purpose is the client's welfare rather than the clinician's agenda. Evocation means the reasons for change are drawn out of the client rather than installed by the clinician, on the premise that they are already present.</p>
<p>The four processes give the work its shape. Engaging establishes the relationship without which nothing else functions. Focusing negotiates what the conversation is actually about, which is frequently not what the referral said. Evoking draws out and strengthens the client's own change talk — this is the process that distinguishes MI from good counselling generally. Planning follows only when the client's language indicates readiness, and beginning it early is the most common error, producing plans the client agrees to and does not enact.</p>
<p>The micro-skills carry the work. Open questions invite elaboration; closed questions collect data. Affirmations recognise strengths and efforts and must be specific and true to be anything other than flattery. Reflections are the load-bearing skill: simple reflections repeat or rephrase, while complex reflections add meaning, feeling, or the unspoken half of an ambivalent statement, and it is complex reflection that moves a conversation. Summaries collect, link, and transition, and a well-constructed summary that ends on the change side of the ambivalence is one of the most powerful interventions in the method.</p>
<p>Change talk and sustain talk are the measurable currency. Preparatory change talk — desire, ability, reasons, need — indicates movement; mobilising change talk — commitment, activation, taking steps — predicts action. Both can be evoked deliberately through evocative questions, importance and confidence rulers, looking forward and back, and values exploration. Sustain talk is met with reflection rather than argument, and discord in the relationship is met by attending to the relationship rather than pressing the content.</p>
<p>Finally, fidelity is not a formality. MI is unusually easy to believe you are doing and unusually easy to do badly, and the literature is consistent that training without coaching and feedback produces little durable change in practice. Recording sessions, coding a sample against a fidelity measure, and receiving feedback is the intervention that produces competence. Everything else is preparation for it.</p>`,

    takeawayItems: [
      'Ambivalence is the ordinary structure of wanting two incompatible things — not resistance, not a stage before readiness.',
      'When the clinician argues for change, the client argues against it; sustain talk within a session predicts the absence of change outside it.',
      'The spirit — partnership, acceptance, compassion, evocation — is the operative ingredient; technique delivered without it is identifiable and ineffective.',
      'Complex reflection carries most of the therapeutic work, and a summary that ends on the change side of the ambivalence is among the method\'s most powerful moves.',
      'Planning begins only when the client\'s language indicates readiness; starting it early produces plans that are agreed to and not enacted.',
      'Self-rated MI adherence correlates weakly with coded adherence — competence comes from recorded sessions, coding, and feedback, not from training hours.',
    ],
    highlights: [
      { title: 'Module 1 — Foundations and Spirit of Motivational Interviewing', content: '<p>MI is a collaborative, goal-oriented conversational style for strengthening a person\'s own motivation and commitment to change. Its spirit — partnership, acceptance, compassion, evocation — is the operative element, and technique delivered without it is identifiable and ineffective. The four processes (engaging, focusing, evoking, planning) give the work its arc. The righting reflex, the clinician\'s impulse to fix and argue for change, reliably produces sustain talk, and sustain talk within a session predicts the absence of change outside it. Psychological reactance and self-perception theory account for why.</p>' },
      { title: 'Module 2 — MI Micro-Skills and Clinical Application', content: '<p>OARS — open questions, affirmations, reflections, summaries — is the practical toolkit. Complex reflection, which adds meaning or names the unspoken half of an ambivalent statement, carries most of the therapeutic work; simple reflection maintains the conversation. Change talk appears in preparatory forms (desire, ability, reasons, need) and mobilising forms (commitment, activation, taking steps), the latter predicting behaviour most strongly. Evocative questions, importance and confidence rulers, looking forward and back, and values exploration elicit it deliberately. Sustain talk is reflected, not argued; discord is addressed relationally.</p>' },
      { title: 'Module 3 — Advanced MI: Integration, Diversity, and Fidelity', content: '<p>MI integrates with cognitive-behavioral, twelve-step, and case management approaches rather than competing with them, and is frequently most useful as a prelude to or a recovery from an impasse in another method. Across cultural difference and in contexts of unequal power, the autonomy-honouring stance requires deliberate work rather than assumption. With mandated and referred clients, autonomy is constrained in fact and can still be honoured in the conversation about what remains within the client\'s choice. Fidelity measurement matters because self-rated adherence correlates weakly with coded adherence, and coaching with feedback on recorded sessions is what produces durable skill.</p>' },
    ],

    plan: `<h2>Ethical Practice Plan</h2>
<p>Motivational interviewing raises ethical questions that its warmth can obscure, and they are worth naming plainly.</p>
<p><strong>Direction and consent.</strong> MI is directional: the clinician deliberately evokes and reinforces language on one side of the client's ambivalence. That is a form of influence, and it is ethical only when the direction is the client's own stated goal rather than the clinician's preference for their life. Before deliberately evoking change talk about a behaviour, be able to say where the client told you that change mattered to them. Where you cannot, you are persuading rather than evoking, and the honest move is to say what you think and let the client refuse it.</p>
<p><strong>Autonomy with mandated clients.</strong> With court-mandated, employer-referred, and child-welfare-involved clients, autonomy is genuinely constrained and pretending otherwise is dishonest. Name the constraint accurately, be clear about what you are required to report, and then be equally clear about what does remain the client's choice. Honouring autonomy inside a coercive context means being truthful about its limits, not performing a freedom the client does not have.</p>
<p><strong>Competence claims.</strong> Do not describe yourself or your programme as providing MI on the strength of a course. The evidence that practitioners overestimate their own adherence is strong enough that the claim should rest on coded feedback rather than on training hours. Commit to recording and reviewing a sample of sessions against a fidelity measure, ideally with a colleague, within the next quarter.</p>
<p><strong>Scope.</strong> MI is a method for working with ambivalence about change. It is not a treatment for a psychiatric disorder, not a substitute for risk assessment, and not a reason to defer an intervention a client urgently needs. Where safety is at issue, safety comes first and the conversational method resumes afterward.</p>`,

    conclusionReflection: 'Return to the exchange you wrote down before Module 1 — the moment your argument for change produced the client\'s argument against it. Rewrite your line. Not as a better argument, but as a complex reflection that names the half of their ambivalence they have not said out loud. Read both versions aloud and notice how differently each one would be received. Then decide which client you will try this with in the coming week, and commit to recording that session so you can hear what you actually did rather than what you intended.',
  },

  // ── CR-307 · Compulsive Sexual Behavior and Intimacy Disorders ─────────────
  {
    code: 'CR-307',
    label: 'Compulsive Sexual Behavior and Intimacy Disorders: Assessment and Treatment',
    slugs: [
      'compulsive-sexual-behavior-intimacy-disorders',
      'compulsive-sexual-behaviour-intimacy-disorders',
    ],
    codes: ['CR-307', 'CR-433', 'CR-634'],
    expectedModules: 3,

    introDividerSubtitle: 'Compulsive sexual behavior is one of the few presentations where the clinician\'s own moral discomfort is the most likely source of diagnostic error — and where over-pathologizing and under-recognising cause harm in equal measure.',

    introBlocks: [
      { type: 'text', content: `<h2>A Presentation Shaped by the Clinician's Discomfort</h2>
<p>Few clinical presentations put a clinician's own formation so directly in the way of accurate assessment. A client describes sexual behaviour that is distressing them, and the clinician has to sort — quickly, and usually without training in doing so — between a genuine impulse-control problem, a behaviour that is unremarkable but that the client has been taught to view as shameful, a symptom of something else entirely, and a partner's or a religious community's judgment that the client has adopted as their own diagnosis. Each of those requires an entirely different response, and the sorting is made harder by the fact that the clinician arrives with their own sexual formation, their own moral commitments, and, for most, no supervised experience talking about sex in clinical detail.</p>
<p>The result is a field in which errors run hard in both directions. Over-pathologising is the more visible one: behaviour that is consensual, legal, and within the ordinary range of human sexual variation gets treated as addiction because it exceeds the clinician's personal norm or because a distressed partner has framed it that way. Sexual behaviours have a long history of being pathologised for reasons that had nothing to do with clinical evidence, and a clinician who cannot distinguish a behaviour that is problematic from a behaviour they find unappealing will reliably produce that error again. Under-recognising is the quieter one and no less damaging: a client whose life is genuinely being dismantled by a behaviour they cannot stop is met with reassurance that they are normal, and leaves without an assessment.</p>
<p>The diagnostic landscape does not resolve this for you. Compulsive Sexual Behavior Disorder appears in the ICD-11 as an impulse-control disorder, deliberately not as an addiction, and with an explicit caution that distress arising solely from moral judgments about sexual impulses is not sufficient for diagnosis. The DSM-5-TR contains no equivalent category, having declined to include hypersexual disorder. Popular language, meanwhile, is saturated with the vocabulary of sex addiction, and many clients arrive having already diagnosed themselves through it. Holding an accurate position in that space requires knowing what the evidence supports, what it does not, and where your own reaction is doing the work.</p>` },

      { type: 'text', content: `<h2>How This Course Is Organized</h2>
<p>The course is built around that sorting problem and what follows once it is done well.</p>
<p>Module 1 covers diagnosis, neurobiology, and assessment. You will work through the ICD-11 criteria for Compulsive Sexual Behavior Disorder and the specific exclusion for moral incongruence; the reasons the DSM declined a parallel category and what that disagreement is actually about; the evidence on incentive salience, reward processing, and impulse control, including where the addiction analogy holds and where it breaks down; validated screening instruments and their limitations; and the differential — bipolar spectrum, substance-induced behaviour, obsessive-compulsive presentations, trauma-related sexual behaviour, personality-related patterns, and neurological contributors including medication effects.</p>
<p>Module 2 covers evidence-based treatment, intimacy disorders, and couples practice. This includes cognitive-behavioral and acceptance-based approaches to compulsive sexual behaviour, the role of shame in maintaining rather than deterring the behaviour, work with the underlying regulatory function the behaviour is serving, and the intimacy difficulties — avoidance, arousal patterns fused with shame, and disconnection between sexual and relational functioning — that frequently sit beneath the presenting complaint. It also covers the couple context directly, including disclosure, betrayal trauma in partners, and the substantial ethical hazards of working with a couple where one partner's behaviour is the presenting problem.</p>
<p>Module 3 covers intimacy disorders, relationships, and ethical practice in more depth: the specific competence, boundary, documentation, and referral obligations that this clinical territory carries, and the practices that keep a clinician's own material from steering the treatment.</p>
<p>Throughout, the standard being taught is the same one that governs the rest of clinical practice: assess before you conclude, distinguish distress from deviation from your own norm, and treat the mechanism rather than the label.</p>` },

      { type: 'text', content: `<h2>Language, and Why It Carries Clinical Weight Here</h2>
<p>Few clinical areas are as burdened by contested vocabulary, and the words a clinician uses are not neutral — each carries a model, and each model implies a treatment.</p>
<p><strong>Sex addiction</strong> is the term most clients arrive with, drawn from popular culture, self-help literature, and a substantial treatment industry. It carries an addiction model: tolerance, withdrawal, powerlessness, and, in most of its programmatic forms, abstinence or "sexual sobriety" as the goal. It has never been adopted as a diagnostic category by either major classification system, and the addiction framing is empirically contested rather than settled. It also carries a particular risk: applied to a domain of functioning that most people are not attempting to abstain from, it can convert ordinary sexual behaviour into a disease and ordinary desire into a symptom.</p>
<p><strong>Compulsive Sexual Behavior Disorder</strong> is the ICD-11 term and is classified among the impulse-control disorders, deliberately not among the addictive behaviours. It requires marked distress or significant impairment and excludes distress that arises solely from moral judgments about sexual impulses. This is the most defensible clinical term currently available, and it is the one to use in documentation.</p>
<p><strong>Out-of-control sexual behaviour</strong> is a descriptive term favoured by a number of sexuality-focused clinicians precisely because it describes the client's experience without asserting a mechanism. It is useful in conversation with clients who reject the addiction framing and with those for whom the diagnostic threshold is not met but the distress is real.</p>
<p>The practical guidance is straightforward. Ask what the client calls it and why. Use their language in the room while using precise language in the record. And when a client arrives having already diagnosed themselves through a framework, treat that framework as clinical information — about what they have been told, by whom, and what it has cost them — rather than as a diagnosis you have inherited and are obliged to work within.</p>` },
    ],

    introAccordion: {
      type: 'accordion', title: 'Common Questions Before You Begin',
      instructions: 'Open each question. These come up early and are worth settling before the first client presents with this material.',
      accordionItems: [
        { title: 'Is "sex addiction" a real diagnosis?', content: '<p>Not in either major classification system. The ICD-11 includes Compulsive Sexual Behavior Disorder among the impulse-control disorders, deliberately not among the addictive behaviours, and the DSM-5-TR declined to include hypersexual disorder after review. The underlying question — whether the presentation is best modelled as an addiction, an impulse-control problem, or a set of other conditions plus moral incongruence — remains genuinely contested. A clinician working here should be able to explain that disagreement to a client rather than adopting whichever framework the client arrived with.</p>' },
        { title: 'How do I tell distress about a behaviour from distress about a judgment?', content: '<p>Ask what the behaviour has actually cost, in the client\'s own account rather than a partner\'s: time, money, health, work, relationships, safety, and the experience of trying to stop and being unable to. Then ask separately what the client believes the behaviour means about them, where that belief came from, and who else holds it. A client whose reported consequences are limited to shame and a partner\'s reaction is describing moral incongruence, which is real distress requiring real treatment — but not this diagnosis, and not this treatment plan.</p>' },
        { title: 'What if a client discloses illegal behaviour?', content: '<p>Know your jurisdiction\'s reporting duties before you take a client in this area, and state the limits of confidentiality clearly at the outset rather than after a disclosure. Behaviour involving minors or non-consenting persons triggers obligations that vary by state and by profession and that you must be able to describe accurately. Where the presentation involves risk of offending, forensic assessment and specialised treatment are required; that work needs separate credentialing and is not within the scope of general outpatient practice.</p>' },
        { title: 'Can I see the couple as well as the individual?', content: '<p>Sometimes, and only with an explicit policy on secrets stated to both partners before you begin. A clinician holding one partner\'s ongoing undisclosed behaviour while treating the couple occupies a position that reliably ends in harm to at least one of them and frequently to the treatment. Partners of clients with compulsive sexual behaviour often present with genuine trauma responses to discovery and need care in their own right. Where both need care you cannot provide without collusion or blame, separate providers is the clinically and ethically correct answer.</p>' },
      ],
    },

    framework: {
      type: 'imageText',
      title: 'The Four-Way Sort: The Framework This Course Is Built On',
      content: `<p>One discipline underlies every module: separating four things that arrive in the room together and are constantly mistaken for one another.</p>
<p><strong>The behaviour</strong> — what the client is actually doing, described concretely rather than in the vocabulary of a framework. <strong>The distress</strong> — what the client is actually suffering, which is real regardless of what is causing it. <strong>The source of the distress</strong> — whether it arises from the behaviour\'s consequences (time, money, health, work, relationships, safety, failed attempts to stop) or from a judgment about the behaviour that the client has adopted from a partner, a community, or a religious formation. And <strong>your own reaction</strong> — the response your own sexual formation, moral commitments, and personal history produce when you hear it.</p>
<p>Errors in this territory run hard in both directions, and each is a failure of the same sort. Collapsing behaviour into distress over-pathologises: consensual, legal, unremarkable behaviour gets treated as addiction because it exceeds the clinician\'s norm. Collapsing distress into moral incongruence under-recognises: a client whose life is genuinely being dismantled is reassured that they are normal and leaves without an assessment. And a clinician who cannot see their own reaction as a separate object will reliably mistake it for a clinical finding.</p>
<p>Every assessment question in Module 1 and every treatment decision in Modules 2 and 3 is an application of this sort.</p>`,
      image: '',
      imageAlt: 'A diagram of four overlapping circles labelled "the behaviour", "the distress", "the source of the distress", and "the clinician\'s own reaction", shown initially merged into a single indistinct shape on the left and separated into four clearly bounded circles on the right, under a heading reading "accurate assessment separates these".',
      imagePosition: 'right',
    },

    introTakeaways: [
      'The ability to separate the behaviour, the distress, the source of the distress, and your own reaction — and to notice when they have collapsed into one another.',
      'Working command of the ICD-11 Compulsive Sexual Behavior Disorder criteria, including the moral-incongruence exclusion, and of why the DSM-5-TR contains no parallel category.',
      'An assessment that turns on function and consequence in the client\'s own account rather than on frequency, content, or a partner\'s framing.',
      'A differential you can actually work through: bipolar spectrum, substance-induced behaviour, obsessive-compulsive presentations, trauma-related behaviour, personality patterns, and neurological or medication contributors.',
      'A treatment stance that does not use shame as leverage, and that supplies an alternative regulatory strategy before removing the existing one.',
      'A stated policy on secrets in couple work, decided before you take the case rather than during it.',
    ],

    baselineMC: {
      question: 'Before we begin: a client reports weekly pornography use, describes intense shame about it, and says his church community regards it as a serious moral failing. He reports no impact on his work, finances, health, or relationships, and says he could stop but does not want to feel like he has to. What does the ICD-11 framework indicate?',
      options: [
        { text: 'Compulsive Sexual Behavior Disorder is indicated, since the client reports marked distress.' },
        { text: 'The diagnosis is not indicated — distress arising solely from moral judgments about sexual impulses is explicitly excluded — though the distress is real and warrants treatment on its own terms.' },
        { text: 'No treatment is indicated, since the behaviour falls within the normal range.' },
        { text: 'The diagnosis is indicated because pornography use meets the behavioural threshold regardless of impairment.' },
      ],
      correct: 1,
      explanation: 'The ICD-11 criteria contain an explicit exclusion: distress that is entirely a consequence of moral judgments and disapproval about sexual impulses, urges, or behaviours is not sufficient for the diagnosis. This client reports no functional impairment and describes preserved control. That does not mean nothing is wrong — the shame is real and clinically significant — but the indicated treatment addresses moral incongruence, identity, and community context rather than compulsivity. Answering "no treatment indicated" is the minimizing error. We will explore this in Module 1.',
    },

    integrationCallout: {
      type: 'callout', calloutType: 'key', title: 'When You Return to Practice on Monday',
      content: `<ul>
<li><strong>State the limits of confidentiality and your reporting duties before the client discloses</strong>, not after. A client who discloses and then learns of a duty has been treated unfairly whatever the law required.</li>
<li><strong>Ask what the behaviour has cost in the client\'s own account</strong> — time, money, health, work, relationships, safety, and what happens when they try to stop — separately from what they believe it means about them.</li>
<li><strong>Use the client\'s language in the room and precise language in the record.</strong> Ask what they call it and why before you adopt or correct their framework.</li>
<li><strong>Work the differential before you treat.</strong> Bipolar spectrum, substance-induced behaviour, OCD with intrusive sexual content, trauma-related behaviour, and medication effects each lead somewhere different.</li>
<li><strong>Do not use shame as leverage.</strong> It drives the behaviour rather than deterring it; interventions that raise it make outcomes worse.</li>
<li><strong>Decide and state your policy on secrets before you take a couple</strong>, and be willing to say that separate providers is the right answer.</li>
</ul>`,
    },

    resources: [
      { title: 'ICD-11 — 6C72 Compulsive Sexual Behaviour Disorder', url: 'https://icd.who.int/browse11/l-m/en', type: 'guidelines', description: 'The primary diagnostic source, including the full criteria and the exclusion for distress arising solely from moral judgments about sexual impulses.' },
      { title: 'AASECT — Find a Certified Sex Therapist', url: 'https://www.aasect.org/referral-directory', type: 'organization', description: 'Referral directory for AASECT-certified sex therapists and counselors, for presentations that exceed general outpatient competence.' },
      { title: 'Society for the Advancement of Sexual Health — Clinical Resources', url: 'https://sash.net/', type: 'organization', description: 'Practitioner resources, training, and current literature on out-of-control sexual behaviour, including partner-focused material.' },
      { title: 'SAMHSA — Trauma-Informed Care in Behavioral Health Services (TIP 57)', url: 'https://store.samhsa.gov/product/tip-57-trauma-informed-care-behavioral-health-services/sma14-4816', type: 'guidelines', description: 'Federal protocol on trauma-informed practice, relevant where sexual behaviour is functioning as a trauma-related regulatory strategy.' },
    ],

    introCallout: {
      type: 'callout', calloutType: 'clinical', title: 'Why This Matters — Scope, Competence, and Your Own Reaction',
      content: '<p>This course prepares licensed clinicians to assess and formulate compulsive sexual behavior and related intimacy difficulties, and to know when the presentation exceeds general outpatient competence. It does not confer certification in sex therapy, and it does not prepare anyone to conduct forensic sexual behaviour assessments, evaluate risk for sexual offending, or provide court-directed treatment — those require separate credentialing and supervised experience. Three obligations apply from the first session. Illegal behaviour, and behaviour involving minors or non-consenting persons, triggers mandatory reporting duties that must be understood and disclosed before the client discloses. Clinicians must be able to distinguish a behaviour that is clinically problematic from one that departs from their own values; where you cannot, that is a supervision matter, not a diagnostic one. And clinicians with unresolved personal material in this area — their own compulsive behaviour, their own betrayal experience, their own religious injunction — should be working on it in their own treatment rather than in the client\'s.</p>',
    },

    introReflection: 'Before you begin, write down the sexual behaviours you would find hardest to hear about with a neutral clinical stance. Be specific and be honest; nobody will read this. Then, for each one, ask what your reaction is made of — evidence about harm, a professional judgment about function and distress, a moral or religious commitment, or personal history. The purpose is not to eliminate the reaction, which is not available, but to be able to recognise it in the room. A clinician who knows which disclosures will jolt them can hold the jolt without letting it become a diagnosis.',

    takeaways: `<h2>Key Takeaways</h2>
<p>The central discipline of this course is separating four things that arrive together: a behaviour, the distress attached to it, the source of that distress, and the clinician's own reaction. Getting them apart is most of the clinical work.</p>
<p>Diagnostically, Compulsive Sexual Behavior Disorder in the ICD-11 requires a persistent pattern of failure to control intense, repetitive sexual impulses resulting in repetitive sexual behaviour, sustained over an extended period, causing marked distress or significant impairment. Its most important clause for everyday practice is the exclusion: distress that is entirely a consequence of moral judgments and disapproval about sexual impulses, urges, or behaviours is not sufficient for the diagnosis. The DSM-5-TR contains no equivalent category. This disagreement is substantive rather than administrative — it concerns whether the available evidence supports a distinct disorder or whether the presentation is better accounted for by other conditions and by moral incongruence — and a clinician working in this territory should be able to explain it to a client rather than adopting whichever framework arrived with them.</p>
<p>Mechanistically, the evidence supports involvement of incentive salience and reward processing alongside impulse-control difficulty, with meaningful similarities to substance and behavioural addictions and meaningful differences. The addiction analogy is useful for explaining cue-driven urges and the gap between intention and behaviour; it is misleading where it implies a substance-like tolerance and withdrawal profile, and it is actively harmful where it implies that abstinence is the only legitimate goal for a domain of human functioning that most people are not attempting to abstain from.</p>
<p>Assessment therefore turns on function and consequence rather than frequency or content. What is the behaviour doing for the person — regulating affect, managing loneliness, avoiding intimacy, discharging shame, coping with trauma memory? What has it cost them, in their own account rather than a partner's? What happens when they try to stop? And critically: is the distress arising from the behaviour's consequences, or from a judgment about the behaviour that the client has adopted from a partner, a community, or a formation? The differential is wide — bipolar spectrum, substance-induced behaviour, obsessive-compulsive presentations in which the sexual content is intrusive rather than desired, trauma-related sexual behaviour, personality-related patterns, and neurological or medication-induced changes — and each of those leads somewhere different.</p>
<p>Treatment works on the mechanism rather than the label. Cognitive-behavioral and acceptance-based approaches target cue exposure, urge tolerance, and the gap between values and action. Shame is not a deterrent but a driver, and interventions that increase it reliably increase the behaviour. Where the behaviour is serving a regulatory function, treatment has to supply another way of doing that job before removal is realistic. Intimacy work frequently turns out to be the substance of the treatment rather than an adjunct: avoidance of vulnerable contact, arousal patterns fused with secrecy, and disconnection between sexual and relational functioning are common and are treatable.</p>
<p>The couple context requires particular care. Partners frequently present with genuine trauma responses to discovery and disclosure, and both members of the couple need care that neither is well placed to provide to the other. Managed disclosure, clear agreements about confidentiality and secrets, and honesty about the limits of what one clinician can hold are the practices that prevent harm here. Where the clinician cannot maintain both alliances without collusion or blame, separate providers are the answer.</p>`,

    takeawayItems: [
      'Sort four things that arrive together: the behaviour, the distress, the source of the distress, and your own reaction to it.',
      'ICD-11 Compulsive Sexual Behavior Disorder is an impulse-control disorder that explicitly excludes distress arising solely from moral judgments; the DSM-5-TR has no equivalent category, and the disagreement is about evidence.',
      'Assessment turns on function and consequence in the client\'s own account, not on frequency, content, or a partner\'s framing.',
      'Shame drives the behaviour rather than deterring it; interventions that increase it reliably make outcomes worse.',
      'Where the behaviour serves a regulatory function, an alternative means of doing that job has to precede its removal.',
      'In couple work, decide and state your policy on secrets before you begin; holding one partner\'s undisclosed behaviour while treating the couple reliably ends in harm.',
    ],
    highlights: [
      { title: 'Module 1 — Diagnosis, Neurobiology, and Assessment', content: '<p>ICD-11 Compulsive Sexual Behavior Disorder is classified as an impulse-control disorder, requires marked distress or significant impairment, and explicitly excludes distress arising solely from moral judgments about sexual impulses. The DSM-5-TR contains no parallel category, and the disagreement concerns evidence rather than administration. Mechanistically, incentive salience and reward processing are implicated alongside impulse-control difficulty; the addiction analogy is useful for cue-driven urges and misleading where it implies a substance-like withdrawal profile or an abstinence goal. Assessment turns on function, consequence, and the source of the distress rather than on frequency or content, against a wide differential.</p>' },
      { title: 'Module 2 — Evidence-Based Treatment, Intimacy Disorders, and Couples Practice', content: '<p>Cognitive-behavioral and acceptance-based approaches target cue exposure, urge tolerance, and the values-action gap. Shame drives rather than deters the behaviour, and interventions that increase it worsen outcomes. Where the behaviour serves a regulatory function, an alternative means of doing that job has to precede removal. Intimacy difficulties — avoidance of vulnerable contact, arousal fused with secrecy, disconnection between sexual and relational functioning — are frequently the substance of the treatment. In the couple context, partners present with genuine trauma responses to discovery; managed disclosure, explicit agreements about secrets, and honesty about what one clinician can hold prevent predictable harm.</p>' },
      { title: 'Module 3 — Intimacy Disorders, Relationships, and Ethical Practice', content: '<p>This territory carries specific competence, boundary, documentation, and referral obligations. Reporting duties around illegal behaviour and behaviour involving minors or non-consenting persons must be understood and disclosed before disclosure occurs. Clinicians must be able to distinguish clinically problematic behaviour from behaviour that departs from their own values, and to recognise when their own material — personal history, betrayal experience, religious formation — is steering the treatment. Where it is, the answer is the clinician\'s own supervision and treatment rather than the client\'s.</p>' },
    ],

    plan: `<h2>Ethical Practice Plan</h2>
<p><strong>Reporting, stated up front.</strong> Know your jurisdiction's mandatory reporting duties as they apply to disclosures of behaviour involving minors, non-consenting persons, or illegal conduct, and state the limits of confidentiality clearly before a client discloses rather than after. A client who discloses and then learns of a reporting duty has been treated unfairly by you, whatever the law required afterward.</p>
<p><strong>Separating values from diagnosis.</strong> Commit to the discipline of asking, for every case, whether the client's distress arises from the behaviour's consequences or from a judgment about the behaviour adopted from elsewhere. Document the reasoning. Where you cannot make that separation because your own reaction is in the way, take it to supervision before you take it to a diagnosis.</p>
<p><strong>Competence boundaries.</strong> This course does not confer sex therapy certification and does not prepare anyone for forensic assessment, sexual offending risk evaluation, or court-directed treatment. Establish now which presentations you will refer, and identify actual referral options — AASECT-certified clinicians, forensic evaluators, medical providers for neurological and medication contributors — before you need them.</p>
<p><strong>Couples and secrets.</strong> Decide your policy on secrets before you take a couple, state it to both partners, and hold it. A clinician holding one partner's ongoing undisclosed behaviour while treating the couple is in an untenable position that reliably ends in harm to at least one of them. Where both partners need care that you cannot provide without collusion or blame, separate providers is the clinically and ethically correct answer, not a failure.</p>
<p><strong>Your own material.</strong> Clinicians with unresolved personal history in this area — their own compulsive behaviour, their own betrayal experience, their own religious injunction about sexuality — should be addressing it in their own treatment or supervision. It is not a disqualification. Leaving it unexamined while treating this population is.</p>`,

    conclusionReflection: 'Return to the list you wrote before Module 1 — the behaviours you would find hardest to hear about neutrally. With the course in view, take the one that still sits hardest and write out what an accurate assessment of a client presenting with it would require of you: the specific questions about function, consequence, and the source of distress; the differential you would need to work through; and the point at which you would refer. Then name the one thing about your own reaction that you will bring to supervision rather than carry into a session.',
  },

  // ── CR-CULTR-601 · Foundations of Cultural Competence, Ethics, Risk ────────
  {
    code: 'CR-CULTR-601',
    label: 'Foundations of Cultural Competence, Ethics, and Risk Reduction in Counseling Practice',
    slugs: [
      'cultural-competence-ethics-risk-reduction-cr601',
      'foundations-cultural-competence-ethics-risk-reduction',
    ],
    codes: ['CR-CULTR-601', 'CR-601', 'CR-307'],
    expectedModules: 4,

    introDividerSubtitle: 'Cultural competence is not adjacent to ethical practice — it is where the profession\'s most consequential ethical failures actually occur, and where liability follows them.',

    introBlocks: [
      { type: 'text', content: `<h2>Where Ethics and Culture Actually Meet</h2>
<p>Continuing education tends to treat ethics and multicultural practice as neighbouring topics: one about codes, boundaries, and liability, the other about awareness, humility, and respect. The separation is convenient and it is wrong. The great majority of ethical failures involving cultural difference are not the acts of clinicians who intended harm. They are competence failures, informed consent failures, assessment failures, and documentation failures — ordinary ethical categories, occurring at the point where a clinician's cultural frame and a client's did not meet and nobody noticed.</p>
<p>Consider what the ethics codes actually require. The ACA Code of Ethics locates multicultural understanding inside the standard of competence rather than beside it: counselors practise within the boundaries of their competence based on education, training, and supervised experience, and are required to gain knowledge relevant to working with a diverse client population. It requires that informed consent be delivered in a manner the client can understand, including arranging for translation where necessary. It requires that counselors recognise that culture affects how problems are defined and be cautious about pathologizing culturally normative experience. It requires assessment instruments to be used only within the populations for which they were validated. The NBCC code carries parallel obligations. None of these are aspirational statements about respect. They are competence standards, and they are the standards against which a licensure complaint is measured.</p>
<p>The liability picture follows the same logic. Complaints and claims in this territory rarely allege prejudice. They allege that the client did not understand what they were consenting to, that an assessment instrument was used outside its validated population, that a diagnosis was made without a documented basis, that a treatment plan was imposed rather than negotiated, or that a clinician continued practising past the limits of their competence rather than consulting or referring. Every one of those has a cultural dimension and none of them requires ill intent. That is the argument of this course: culturally responsive practice is risk management, and the same practices that make care better make it defensible.</p>` },

      { type: 'text', content: `<h2>How This Course Is Organized</h2>
<p>The course moves from mandate to mechanism to procedure, on the argument that a clinician who understands why an obligation exists implements it better than one who has memorised it.</p>
<p>Module 1 establishes cultural competence as an ethical and professional mandate. You will work through the specific provisions of the ACA and NBCC codes that bear on cultural practice, the distinction between cultural competence and cultural humility and why the field has moved toward the latter, the ADDRESSING framework as a systematic way of holding multiple identity dimensions, and the evidence connecting culturally responsive practice to outcome.</p>
<p>Module 2 addresses bias, power, and clinical risk directly. This covers implicit bias and its documented effects on diagnosis, treatment recommendation, and the credibility given to a client's account of their own distress; the power differential inherent in the clinical relationship and what it does to disclosure; microaggressions and their measurable effect on alliance and retention; and the mechanisms by which these produce the diagnostic disparities documented in the literature.</p>
<p>Module 3 covers culturally responsive informed consent and documentation — the two procedures that carry most of the liability. Consent that accounts for language accessibility, for varying norms about who participates in a decision, and for what the client actually understands rather than what they signed; and documentation that records cultural considerations, the clinical reasoning behind a diagnosis, and the alternatives considered, in a form that would satisfy a reviewer.</p>
<p>Module 4 covers ethical decision-making when cultural values conflict with clinical judgment, legal obligation, or professional standards — the cases that are genuinely hard rather than merely unfamiliar — using a structured decision model rather than intuition, and closing with risk-reduction practices aligned to liability and professional insurance expectations.</p>` },

      { type: 'text', content: `<h2>How Complaints Actually Arise</h2>
<p>It is worth being concrete about the pathway from a cultural misunderstanding to a board complaint, because the pathway is more mundane than clinicians expect and each stage is preventable.</p>
<p>Complaints in this territory almost never begin with an allegation of prejudice. They begin with a client who did not get what they thought they were getting. Something was decided that they did not understand — a diagnosis, a treatment approach, a report to a third party, a decision about who would be involved — and by the time they understood it, they experienced it as something done to them rather than agreed with them. The distance between the clinician's cultural frame and the client's is usually where the misunderstanding originated, but it is not what the complaint alleges. The complaint alleges inadequate informed consent, an inaccurate diagnosis, practice beyond competence, or inadequate records.</p>
<p>The second stage is that the record cannot answer the allegation. Reviewers do not have access to the clinician's reasoning, their good intentions, or the nuance of the relationship. They have the file. A note that records what was discussed but not what was considered, a diagnosis recorded without a documented basis, an assessment instrument used without a note on its applicability, or a consent form signed without any record of what was explained and how comprehension was checked — each of these turns a defensible clinical decision into an indefensible one, regardless of how sound the decision was.</p>
<p>The third stage is that consultation, where it happened, was not documented. Clinicians in this territory frequently do consult, and frequently do not record it. Documented consultation is the single most protective element available: it demonstrates that the clinician recognised the complexity, sought input, and acted on a reasoned basis. Undocumented consultation confers the clinical benefit and none of the protection.</p>
<p>The pattern is consistent enough to be actionable. The practices that prevent these complaints — comprehension-checked consent, documented cultural formulation, instruments used within their validated populations, and recorded consultation — are the same practices that produce better care. That convergence is the argument this course is built on.</p>` },
    ],

    introAccordion: {
      type: 'accordion', title: 'Common Questions Before You Begin',
      instructions: 'Open each question. These are the ones clinicians raise when ethics and cultural practice are taught together.',
      accordionItems: [
        { title: 'Is this an ethics course or a multicultural course?', content: '<p>Both, and the premise of the course is that separating them is what allows each to be neglected. The great majority of ethical failures involving cultural difference are ordinary competence, consent, assessment, and documentation failures occurring at the point where two cultural frames did not meet. Board complaints in this territory rarely allege prejudice; they allege that the client did not understand what they consented to, that an instrument was used outside its validated population, that a diagnosis lacked a documented basis, or that a clinician practised past the limits of their competence.</p>' },
        { title: 'What if a client\'s cultural or religious values conflict with my clinical judgment?', content: '<p>That is a genuinely hard case and it is resolved by a structured decision process rather than by intuition or by deference. Identify the competing obligations precisely, consult the relevant code provisions and any applicable law, obtain consultation and document it, generate options, test each against client welfare and the applicable standards, decide, and record the reasoning. What is not defensible is either overriding the client\'s values because they are unfamiliar or abandoning a clinical or legal obligation because a client\'s values conflict with it.</p>' },
        { title: 'Am I obligated to refer a client to a clinician who shares their background?', content: '<p>No, and doing so reflexively is frequently harmful. Demographic matching shows inconsistent effects on outcome and is neither necessary nor sufficient; what predicts alliance and outcome is the client\'s experience of the clinician\'s cultural comfort, engagement, and curiosity. Referral is indicated when the presentation genuinely exceeds your competence, when the client requests it, or when language access cannot otherwise be met. Referral offered because a clinician is uncomfortable is an abdication, and in most referral environments it functions as a denial of care.</p>' },
        { title: 'How much of this actually shows up in a board complaint or a claim?', content: '<p>More than clinicians expect, and rarely under the heading anyone anticipates. What reviewers examine is the file: whether consent was documented and comprehension checked, whether a diagnosis has a recorded basis, whether an assessment instrument was appropriate to the client, whether consultation occurred and was recorded, and whether the clinical reasoning is visible rather than only the conclusion. The practices that make care culturally responsive are the same practices that make a file defensible, which is the convergence this course is built on.</p>' },
      ],
    },

    framework: {
      type: 'imageText',
      title: 'Where Culture Meets Liability: The Framework This Course Is Built On',
      content: `<p>The organising claim of this course is that culturally responsive practice and ethical risk reduction are the same set of practices described in two vocabularies — and that the practices sit at four specific points in an ordinary clinical episode.</p>
<p><strong>Consent</strong> is the first. A client who did not understand what they were agreeing to, in a language and at a level they could follow, has not consented — and that is the allegation that begins most complaints in this territory, whatever the cultural misunderstanding underneath it.</p>
<p><strong>Assessment</strong> is the second. Instruments used outside their validated populations, and culturally normative experience recorded as symptom, produce diagnoses that cannot be defended because the reasoning was never tested.</p>
<p><strong>Documentation</strong> is the third and the most decisive. A reviewer has the file, not your intentions. A note that records the conclusion but not the alternatives considered converts a sound clinical decision into an indefensible one.</p>
<p><strong>Consultation</strong> is the fourth. Clinicians in culturally complex cases frequently do consult and frequently do not record it — which confers the clinical benefit and none of the protection.</p>
<p>Each module maps onto these four points. The convergence is the argument: the practices that make care better are the same ones that make it defensible.</p>`,
      image: '',
      imageAlt: 'A horizontal four-stage diagram titled "Where culture meets liability", with stages labelled Consent, Assessment, Documentation, and Consultation. Above each stage is the ethical obligation it carries; below each is the corresponding complaint allegation that arises when it is unmet — inadequate informed consent, inaccurate diagnosis, inadequate records, and practice beyond competence.',
      imagePosition: 'right',
    },

    introTakeaways: [
      'Consent practice that addresses the language of delivery, arranged professional translation, and checked comprehension rather than a signature.',
      'The ability to say which of your routine assessment instruments were validated in the population you are using them with, and to document the reasoning when they were not.',
      'A cultural formulation element in your notes: the client\'s own words, the identity and context factors, the alternatives considered, and the treatment implications.',
      'A structured decision process for cases where cultural or religious values conflict with clinical judgment or legal obligation — applied deliberately and recorded.',
      'The habit of documenting consultation, which is the single most protective element available and the one most often omitted.',
      'An audit of your own diagnostic and referral distribution, which requires no permission and surfaces what self-report cannot.',
    ],

    baselineMC: {
      question: 'Before we begin: a board complaint arises from a case involving cultural misunderstanding. Based on how these complaints actually proceed, what is a reviewer most likely to examine first?',
      options: [
        { text: 'Evidence of the clinician\'s attitudes toward the client\'s cultural group.' },
        { text: 'The clinical record — whether consent was documented and comprehension checked, whether the diagnosis has a recorded basis, whether instruments were appropriate, and whether consultation was documented.' },
        { text: 'The clinician\'s continuing education transcript for multicultural training hours.' },
        { text: 'Testimony from colleagues about the clinician\'s general cultural sensitivity.' },
      ],
      correct: 1,
      explanation: 'Complaints in this territory rarely allege prejudice and reviewers rarely have access to attitudes, intentions, or relational nuance. They have the file. What decides the outcome is whether the record shows the reasoning or only the conclusion — documented and comprehension-checked consent, a diagnosis with a recorded basis, instruments used within their validated populations, and consultation that was recorded rather than merely obtained. Training hours and character testimony are secondary. We will explore this in Modules 3 and 4.',
    },

    integrationCallout: {
      type: 'callout', calloutType: 'key', title: 'When You Return to Practice on Monday',
      content: `<ul>
<li><strong>Read your own consent document as a client with limited English would.</strong> Check comprehension out loud rather than assuming it, and arrange professional translation rather than relying on a family member.</li>
<li><strong>List your routine instruments and check what population each was validated in.</strong> Where you use one outside it, write down why it is still defensible and what it is not being used for.</li>
<li><strong>Add the cultural formulation element to your note template</strong> — client\'s words, context factors, alternatives considered, treatment implications — so it survives a full caseload.</li>
<li><strong>Identify your consultation route before you need it</strong>: supervisor, peer group, association ethics line, or carrier risk-management service.</li>
<li><strong>Document the consultation.</strong> Undocumented consultation gives you the clinical benefit and none of the protection.</li>
<li><strong>Audit your own diagnostic and referral distribution within ninety days.</strong> No permission required, and it shows what self-report cannot.</li>
</ul>`,
    },

    resources: [
      { title: 'ACA Code of Ethics (2014)', url: 'https://www.counseling.org/resources/aca-code-of-ethics.pdf', type: 'pdf', description: 'The primary ethical framework for licensed counselors, including Sections A.2.c on culturally appropriate informed consent, C.2.a on competence, E.5.b on cultural sensitivity in diagnosis, and E.8 on assessment population validity.' },
      { title: 'NBCC Code of Ethics', url: 'https://www.nbcc.org/ethics', type: 'standards', description: 'Ethical standards for National Certified Counselors, carrying parallel obligations on competence, consent, and assessment.' },
      { title: 'DSM-5-TR Cultural Formulation Interview — Online Assessment Measures', url: 'https://www.psychiatry.org/psychiatrists/practice/dsm/educational-resources/assessment-measures', type: 'pdf', description: 'The full 16-question core Cultural Formulation Interview plus the informant version and supplementary modules, free from the American Psychiatric Association.' },
      { title: 'National CLAS Standards — Office of Minority Health', url: 'https://thinkculturalhealth.hhs.gov/clas', type: 'standards', description: 'National standards for Culturally and Linguistically Appropriate Services, including language access requirements — the reference to cite when advocating for interpreter resources.' },
    ],

    introCallout: {
      type: 'callout', calloutType: 'clinical', title: 'Why This Matters — What Ethics Codes Actually Require Here',
      content: '<p>The {{callout:aca-code}} is explicit and specific. Section C.2.a limits practice to the boundaries of competence based on education, training, supervised experience, and professional credentials, and requires counselors to gain knowledge, awareness, sensitivity, and skills relevant to working with a diverse client population. Section A.2.c requires that informed consent be communicated in a developmentally and culturally appropriate manner, including arranging translation where the client has difficulty understanding. Section E.5.b requires recognition that culture affects the way client problems are defined and cautions against pathologizing culturally normative experience, and Section E.8 restricts the use of assessment techniques to populations for which they were validated. The {{callout:nbcc-standard}} carries parallel obligations for NCC holders. Read together, these mean that a culturally uninformed assessment is not a lapse of sensitivity — it is a departure from the competence standard, and it is the kind of departure that appears in board complaints.</p>',
    },

    introReflection: 'Before you begin, take one clinical decision you made in the past month that had a cultural dimension — a diagnosis, an assessment instrument you selected, a consent conversation, a treatment plan, or a decision about who to involve. Write down what you did and what your documented basis for it was. Then ask the question a board reviewer would ask: does the record show the reasoning, or only the conclusion? Keep your answer; the gap between the two is what most of this course is about closing.',

    takeaways: `<h2>Key Takeaways</h2>
<p>The argument running through this course is that culturally responsive practice and ethical risk reduction are the same set of practices described in two vocabularies, and that treating them separately is what allows both to be neglected.</p>
<p>Cultural competence is an ethical obligation located inside the competence standard. The ACA and NBCC codes require counselors to gain knowledge relevant to a diverse client population, to communicate informed consent in a culturally appropriate manner including arranging translation, to recognise that culture shapes how problems are defined and to avoid pathologizing culturally normative experience, and to use assessment instruments only within their validated populations. A clinician who has not met these has not been insufficiently sensitive; they have practised outside the competence standard, which is the framing that matters when a complaint is filed.</p>
<p>Cultural humility supplements rather than replaces competence. Competence supplies the knowledge base and the professional standard; humility supplies the stance that keeps knowledge from hardening into a template applied to an individual, keeps the clinician's own position under examination, and treats the client as the authority on their own experience. Frameworks such as ADDRESSING are useful precisely because they prompt systematic inquiry across dimensions — age, disability, religion, ethnicity, socioeconomic status, sexual orientation, indigenous heritage, national origin, gender — rather than allowing attention to settle on whichever dimension is most visible.</p>
<p>Bias operates through mundane clinical channels rather than through hostility. It shows up as differential diagnostic weighting of the same symptom, differential offering of treatment, differential credibility assigned to reports of distress, differences in nonverbal warmth, and differences in the threshold at which risk, reporting, and involuntary intervention decisions are made. These aggregate into the documented diagnostic disparities, and they are not corrected by good intentions. What corrects them is structural: reducing time pressure at decision points, using structured assessment that forces specific questions, and submitting diagnostic patterns to review by people authorised to name what they see.</p>
<p>Informed consent and documentation are where the liability concentrates, and both are procedures rather than attitudes. Culturally responsive consent addresses the language in which it is delivered, the client's actual comprehension rather than their signature, who the client expects to participate in the decision, and an explicit invitation to raise concerns about being misunderstood. Defensible documentation records the client's own account of the problem, the identity and context factors that bear on it, the alternatives considered and the reasoning that ruled them in or out, and the resulting treatment implications. The distinction between a note that records attendance and a note that records assessment is roughly four minutes of writing and the entire difference in a board review.</p>
<p>Finally, the genuinely hard cases — where a client's cultural or religious values conflict with clinical judgment, legal obligation, or professional standards — are not resolved by intuition or by deference. They are resolved by a structured decision model applied deliberately and documented: identifying the competing obligations, consulting the relevant code provisions and law, obtaining consultation, generating options, testing each against the client's welfare and the applicable standards, choosing, and recording the reasoning. Documented consultation is simultaneously the best clinical practice and the strongest available protection.</p>`,

    takeawayItems: [
      'Multicultural understanding sits inside the ACA and NBCC competence standards, not beside them — a culturally uninformed assessment is a competence departure, not a lapse of sensitivity.',
      'Cultural humility supplements competence by keeping knowledge tentative and the client positioned as the authority on their own experience.',
      'Bias reaches decisions through diagnostic weighting, treatment offering, credibility of reported distress, nonverbal behaviour, and risk thresholds — none of which require hostility.',
      'Informed consent is a comprehension standard, not a signature standard, and includes arranging professional translation where needed.',
      'Documentation that records the client\'s words, the identity and context factors, the alternatives considered, and the treatment implications is the difference between a defensible and an indefensible file.',
      'Documented consultation is simultaneously the strongest clinical and the strongest legal position; undocumented consultation confers the benefit and none of the protection.',
    ],
    highlights: [
      { title: 'Module 1 — Cultural Competence as an Ethical and Professional Mandate', content: '<p>Multicultural understanding sits inside the ACA and NBCC competence standards rather than beside them, with specific provisions governing scope of competence, culturally appropriate informed consent and translation, caution about pathologizing culturally normative experience, and restriction of assessment instruments to validated populations. Cultural humility supplements competence by keeping knowledge tentative, the clinician\'s own position under examination, and the client positioned as the authority on their own experience. The ADDRESSING framework prompts systematic inquiry across identity dimensions rather than allowing attention to settle on the most visible one.</p>' },
      { title: 'Module 2 — Bias, Power, and Clinical Risk', content: '<p>Implicit bias reaches clinical decisions through differential diagnostic weighting, differential treatment offering, differential credibility of reported distress, nonverbal behaviour, and thresholds for risk and reporting judgments — producing documented diagnostic disparities without requiring hostility. The clinical relationship\'s inherent power asymmetry shapes what clients disclose and how safe correction feels. Microaggressions, particularly microinvalidations, measurably weaken alliance, reduce disclosure, and predict premature termination. Good intentions do not correct any of this; structure does.</p>' },
      { title: 'Module 3 — Culturally Responsive Informed Consent and Documentation', content: '<p>Consent is a comprehension standard, not a signature standard: it must address the language of delivery, arranged translation where needed, the client\'s expectations about who participates in decisions, and an explicit invitation to raise concerns about being misunderstood. Documentation that would satisfy a reviewer records the client\'s own account of the problem, the identity and context factors bearing on it, the alternatives considered and the reasoning that ruled them in or out, and the treatment implications — the difference between recording attendance and recording assessment.</p>' },
      { title: 'Module 4 — Ethical Decision-Making in Culturally Complex Cases', content: '<p>Genuine conflicts between a client\'s cultural or religious values and clinical judgment, legal obligation, or professional standards are resolved by a structured decision model rather than by intuition or deference: identify the competing obligations, consult the applicable code provisions and law, obtain and document consultation, generate options, test each against client welfare and the standards, decide, and record the reasoning. Risk-reduction practice aligns with this directly — documented consultation is simultaneously the strongest clinical and the strongest legal position.</p>' },
    ],

    plan: `<h2>Ethical Practice Plan</h2>
<p>Turn this material into obligations with dates attached rather than intentions.</p>
<p><strong>Consent.</strong> Review your informed consent document and process this month against three questions: is it delivered in a language and at a level this client can understand, is comprehension checked rather than assumed, and does it invite the client to say if something is unclear or if they expect someone else to be part of the decision? Where translation is needed, arrange professional translation rather than relying on a family member.</p>
<p><strong>Assessment instruments.</strong> List the instruments you use routinely and check, for each, the population in which it was validated. Where you use one outside that population, decide whether it is defensible as a within-client tracking measure rather than a cut-score decision, and document that reasoning in the record rather than leaving it in your head.</p>
<p><strong>Documentation.</strong> Adopt a fixed cultural formulation element in your notes: the client\'s own words for the problem, the relevant identity and context factors as they described them, the alternative explanations considered, and the treatment implications. Add it to your template so it survives a full caseload.</p>
<p><strong>Consultation.</strong> Identify now, before you need it, who you will consult when a cultural and clinical or legal obligation conflict — a supervisor, a peer consultation group, your professional association\'s ethics line, your liability carrier\'s risk management service. Then use them and document that you did. Undocumented consultation provides clinical benefit and no protection.</p>
<p><strong>Pattern review.</strong> Within ninety days, review your own diagnostic and referral distribution across your caseload. This requires no permission and no budget, and it surfaces what self-report cannot.</p>`,

    conclusionReflection: 'Return to the clinical decision you documented before Module 1 and to your answer about whether the record showed the reasoning or only the conclusion. Rewrite that note now as it should have read: the client\'s own account of the problem, the identity and context factors, the alternatives you considered and why you ruled them out, and what followed for the treatment plan. Time yourself. Then decide what goes into your note template this week so that the second version is what you write by default rather than what you write when you remember to.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// ENGINE
// ─────────────────────────────────────────────────────────────────────────────

const CONCLUSION_TITLE_RE = /summary|conclusion|review|wrap[- ]?up/i;
const INTRO_TITLE_RE = /course introduction|introduction and orientation|introduction & overview|introduction and overview/i;

function stripHtml(h) { return String(h || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); }
function words(s) { const t = stripHtml(s); return t ? t.split(/\s+/).length : 0; }
function blockText(b) { return [b.content, b.textContent, b.question, b.title, b.subtitle].join(' '); }

/** Build the "Course Introduction and Orientation" section for a patch. */
function buildIntroSection(p) {
  // Block order follows CLAUDE_COURSE_STRUCTURE.md §3: divider, opening hook,
  // "why this matters" callout, roadmap, foundational framework imageText,
  // key-concepts accordion, keyTakeaway, baseline knowledge check, reflection.
  // introBlocks[0] is the hook, [1] the roadmap, [2] the course-specific essay.
  const [hook, roadmap, ...restIntro] = p.introBlocks;
  const blocks = [
    { type: 'sectionDivider', sectionNumber: 'Introduction', title: INTRO_SECTION_TITLE, subtitle: p.introDividerSubtitle },
    hook,
    p.introCallout,
    roadmap,
    p.framework,
    ...restIntro,
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
    title: INTRO_SECTION_TITLE,
    order: 1,
    description: 'What this course covers, how it is organized, and what you should be able to do differently when you finish.',
    contentBlocks: blocks,
  };
}

/**
 * Build the conclusion blocks (Key Takeaways → Highlights → Plan → Reflection).
 *
 * Field names follow BLOCK_FIELD_REFERENCE.md (Tier 1). In particular:
 * renderText() reads `content` only and renderAccordion() reads
 * `accordionItems` only, so headings and instructions for those two live in
 * their own text blocks rather than in an ignored `title`/`instructions`
 * field — a field the viewer does not read still counts toward wordCount,
 * which would inflate the CE hour calculation with text no learner sees.
 */
function buildConclusionBlocks(p) {
  // Block order follows CLAUDE_COURSE_STRUCTURE.md §8: synthesis narrative,
  // clinical-integration callout, section-highlights accordion, course-level
  // keyTakeaway, ethical practice plan, reflection, resources. The existing
  // .cr-references block stays last — these are inserted ahead of it.
  return [
    { type: 'text', content: p.takeaways },
    p.integrationCallout,
    { type: 'text', content: `<h3>${HIGHLIGHTS_TITLE}</h3>\n<p>Open each module to review its central points before the final assessment.</p>` },
    { type: 'accordion', accordionItems: p.highlights },
    { type: 'keyTakeaway', title: 'Course-Level Key Takeaways', takeaways: p.takeawayItems },
    { type: 'text', content: p.plan },
    { type: 'reflection', question: p.conclusionReflection },
    { type: 'resources', resources: p.resources },
  ];
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

async function findCourse(col, p) {
  for (const slug of p.slugs) {
    const doc = await col.findOne({ slug });
    if (doc) return { doc, matchedBy: `slug:${slug}` };
  }
  for (const code of p.codes) {
    const doc = await col.findOne({ courseCode: code });
    if (doc) return { doc, matchedBy: `courseCode:${code}` };
  }
  return { doc: null, matchedBy: null };
}

/** Pure transform: returns { sections, actions, addedWords } for a course. */
function planPatch(course, p) {
  const sections = JSON.parse(JSON.stringify(course.sections || []));
  const actions = [];

  // ── 1. Introduction section ────────────────────────────────────────────────
  const hasIntro = sections.length > 0 && INTRO_TITLE_RE.test(sections[0].title || '');
  if (hasIntro) {
    actions.push('intro: SKIP (section 1 is already an introduction)');
  } else {
    sections.unshift(buildIntroSection(p));
    actions.push(`intro: INSERT section at position 1 (${buildIntroSection(p).contentBlocks.length} blocks)`);
  }

  // ── 2. Conclusion blocks ───────────────────────────────────────────────────
  const last = sections[sections.length - 1];
  const isConclusion = last && CONCLUSION_TITLE_RE.test(last.title || '');
  const newBlocks = buildConclusionBlocks(p);

  if (isConclusion) {
    const existing = last.contentBlocks || [];
    const already = existing.some(b =>
      new RegExp(`<h2>\\s*${TAKEAWAYS_TITLE}\\s*</h2>`, 'i').test(b.content || '') ||
      new RegExp(`<h3>\\s*${HIGHLIGHTS_TITLE}\\s*</h3>`, 'i').test(b.content || '') ||
      new RegExp(`<h2>\\s*${PLAN_TITLE}\\s*</h2>`, 'i').test(b.content || ''));
    if (already) {
      actions.push('conclusion: SKIP (Key Takeaways / Module Highlights already present)');
    } else {
      // Insert ahead of the .cr-references block so the reference list stays last.
      let at = existing.findIndex(b => /class="cr-references"/.test(b.content || b.textContent || ''));
      if (at < 0) at = existing.length;
      last.contentBlocks = [...existing.slice(0, at), ...newBlocks, ...existing.slice(at)];
      actions.push(`conclusion: INSERT ${newBlocks.length} blocks into "${last.title}" at position ${at + 1}`);
    }
  } else {
    const refBlock = buildReferencesBlock(course.references);
    const blocks = [
      { type: 'sectionDivider', sectionNumber: 'Conclusion', title: 'Course Summary and Review',
        subtitle: 'Consolidation of the course\'s central arguments, a module-by-module review, an ethical practice plan, and the full reference list.' },
      ...newBlocks,
      ...(refBlock ? [refBlock] : []),
    ];
    sections.push({
      title: 'Course Summary and Review',
      order: sections.length + 1,
      description: 'Key takeaways, module highlights, an ethical practice plan, a course-level reflection, and the reference list.',
      contentBlocks: blocks,
    });
    actions.push(`conclusion: CREATE section "Course Summary and Review" (${blocks.length} blocks${refBlock ? ', references built from course.references[]' : ', NO references — course.references[] is empty'})`);
  }

  // ── 3. Resequence ──────────────────────────────────────────────────────────
  sections.forEach((s, i) => {
    s.order = i + 1;
    (s.contentBlocks || []).forEach((b, j) => { b.order = j + 1; });
  });

  const addedWords = [
    ...(hasIntro ? [] : buildIntroSection(p).contentBlocks),
    ...newBlocks,
  ].reduce((n, b) => n + words(blockText(b)) + (b.accordionItems || []).reduce((m, a) => m + words(a.title) + words(a.content), 0), 0);

  return { sections, actions, addedWords };
}

async function main() {
  if (!process.env.MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('interactivecourses');

  console.log('\n' + '='.repeat(78));
  console.log(`expandIntrosConclusions — ${APPLY ? 'APPLYING WRITES' : 'DRY RUN (pass --apply to write)'}`);
  console.log(`${PATCHES.length} courses in the patch catalogue`);
  console.log('='.repeat(78));

  let found = 0, patched = 0, notFound = 0, skipped = 0, failed = 0;

  for (const p of PATCHES) {
    console.log(`\n── ${p.code} · ${p.label}`);
    const { doc: raw, matchedBy } = await findCourse(col, p);
    if (!raw) {
      notFound++;
      console.log(`   NOT FOUND — tried slugs [${p.slugs.join(', ')}] and codes [${p.codes.join(', ')}]`);
      continue;
    }
    found++;
    console.log(`   matched by ${matchedBy} · "${(raw.title || '').slice(0, 60)}" · status=${raw.status} · ${(raw.sections || []).length} sections · wordCount=${raw.wordCount ?? 'n/a'}`);

    const contentSections = (raw.sections || []).filter(s => !INTRO_TITLE_RE.test(s.title || '') && !CONCLUSION_TITLE_RE.test(s.title || ''));
    if (p.expectedModules && contentSections.length !== p.expectedModules) {
      console.log(`   NOTE: expected ${p.expectedModules} module sections, found ${contentSections.length} — the Module Highlights accordion was written against the expected set. Review before publishing.`);
    }

    const { sections, actions, addedWords } = planPatch(raw, p);
    actions.forEach(a => console.log(`   ${a}`));
    if (actions.every(a => a.includes('SKIP'))) {
      skipped++;
      console.log('   nothing to do — already patched');
      continue;
    }

    const before = countCourseWords(raw);
    const after = countCourseWords({ ...raw, sections });
    console.log(`   words: ${before.toLocaleString()} → ${after.toLocaleString()} (+${(after - before).toLocaleString()}; ${addedWords.toLocaleString()} authored) · CE target ${requiredWordsFor(raw.ceHours || raw.ceuHours || 0).toLocaleString()}`);

    if (!APPLY) { patched++; continue; }

    // Primary write path: the Mongoose model, so the pre-save hook recomputes
    // wordCount, totalContentBlocks, and totalEstimatedTime.
    try {
      const model = await Course.findById(raw._id);
      if (!model) throw new Error('document disappeared between read and write');
      model.set('sections', sections);
      model.markModified('sections');
      await model.save();
      patched++;
      console.log(`   SAVED via model — wordCount=${model.wordCount}`);
    } catch (err) {
      // Legacy documents (originally raw-inserted) can fail validation on
      // pre-existing content. Fall back to a collection write that still sets a
      // correct wordCount using the canonical counter.
      console.log(`   MODEL SAVE FAILED: ${err.message}`);
      console.log('   FALLING BACK to collection update (validation bypassed — the failure above is in PRE-EXISTING content and should be fixed separately)');
      const patchedDoc = { ...raw, sections };
      // Mirror every rollup the pre-save hook would have computed, including the
      // three admin-library counts declared in PR #906 — a collection write skips
      // the hook, and an undeclared-or-unset rollup reads as missing in the app.
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
      patched++;
      failed++;
      console.log(`   SAVED via collection — wordCount=${countCourseWords(patchedDoc)}`);
    }
  }

  console.log('\n' + '='.repeat(78));
  console.log(`found ${found} · ${APPLY ? 'patched' : 'would patch'} ${patched} · already-patched ${skipped} · not found ${notFound}`);
  if (failed) console.log(`${failed} course(s) needed the collection fallback — their pre-existing content fails current schema validation.`);
  if (!APPLY) console.log('DRY RUN — no writes. Re-run with --apply to write.');
  console.log('='.repeat(78) + '\n');

  await mongoose.disconnect();
}

// Only run when executed directly, so PATCHES can be imported for testing.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(e => { console.error('ERROR:', e); process.exit(1); });
}
