/**
 * Seed: CR-CLI-604 — Solution-Focused Brief Therapy in Community Mental Health
 * CE Hours: 2 | Category: clinical | Difficulty: intermediate
 * Provider: GA Integrated Therapeutic Perspectives LLC (NBCC ACEP #7760)
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Course as InteractiveCourse } from '../models/InteractiveCourse.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../../.env') });

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

// ─── Word-count helper ────────────────────────────────────────────────────────
function countWords(blocks) {
  let total = 0;
  function extractText(val) {
    if (!val) return '';
    if (typeof val === 'string') return val.replace(/<[^>]+>/g, ' ');
    if (Array.isArray(val)) return val.map(extractText).join(' ');
    if (typeof val === 'object') return Object.values(val).map(extractText).join(' ');
    return '';
  }
  for (const block of blocks) {
    const raw = extractText(block);
    total += raw.split(/\s+/).filter(Boolean).length;
  }
  return total;
}

// ─── Validate helper ─────────────────────────────────────────────────────────
function validate(course) {
  const errors = [];
  if (!course.courseCode) errors.push('Missing courseCode');
  if (!course.slug) errors.push('Missing slug');
  if (!course.title) errors.push('Missing title');
  if (!course.sections || course.sections.length < 3) errors.push('Need at least 3 sections');
  if (!course.assessment || course.assessment.length < 15) errors.push('Need at least 15 assessment questions');
  if (!course.references || course.references.length < 15) errors.push('Need at least 15 references');
  if (!course.resources || course.resources.length < 6) errors.push('Need at least 6 resources');
  // word count
  const allBlocks = course.sections.flatMap(s => s.blocks || []);
  const wc = countWords(allBlocks);
  console.log(`  Word count (block text): ~${wc}`);
  if (wc < 10000) errors.push(`Word count too low: ${wc} (need ≥10,000 from blocks)`);
  return errors;
}

// ─── Course document ─────────────────────────────────────────────────────────
const course = {
  courseCode: 'CR-CLI-604',
  slug: 'cr-cli-604-solution-focused-brief-therapy',
  title: 'Solution-Focused Brief Therapy in Community Mental Health',
  ceHours: 2,
  category: 'clinical',
  difficulty: 'intermediate',
  isPublished: false,
  status: 'draft',
  targetAudience: 'Licensed mental health professionals (LPCs, LCSWs, LMFTs, NCCs)',
  description: 'This course provides a comprehensive exploration of Solution-Focused Brief Therapy (SFBT) with a specific focus on application within community mental health settings. Participants will examine the theoretical foundations developed by Steve de Shazer and Insoo Kim Berg, master core techniques including the miracle question, exception questions, and scaling questions, and develop competency in adapting SFBT for mandated clients, crisis presentations, and populations with chronic mental illness. Ethical considerations unique to brief therapy in under-resourced settings are also addressed.',
  presenter: {
    name: 'Kejuiana Johnson',
    credentials: 'MA, LPC, NCC, CPCS, BC-TMH',
    licenseNumber: 'LPC009587',
    licenseState: 'Georgia',
    licenseType: 'LPC',
  },
  provider: {
    name: 'GA Integrated Therapeutic Perspectives LLC',
    shortName: 'GAITP LLC',
    acepNumber: '7760',
    approvalBody: 'NBCC',
  },
  approvals: [
    {
      body: 'NBCC',
      number: '#7760',
      hourBreakdown: [{ label: 'core', hours: 2 }],
    },
  ],

  // ── SECTIONS ──────────────────────────────────────────────────────────────
  sections: [
    // ════════════════════════════════════════════════════════════════════════
    // SECTION 0 — Introduction
    // ════════════════════════════════════════════════════════════════════════
    {
      title: 'Introduction: A Different Kind of Listening',
      order: 0,
      contentBlocks: [
        {
          type: 'text',
          content: `<p>Imagine sitting across from a client who has been in and out of community mental health services for the past seven years. She has a thick chart, multiple diagnoses, and a history of treatment that, by any objective measure, has not produced lasting change. She sits with her arms crossed, prepared to recount the same story she has told to twelve therapists before you. She is not difficult — she is exhausted. And if you begin the way most clinicians are trained to begin — by gathering a full problem history, mapping symptom timelines, and building a case conceptualization rooted in what is wrong — you will confirm, once again, that therapy is a place where problems live.</p>

<p>Solution-Focused Brief Therapy (SFBT) begins differently. It begins with the assumption that this woman has survived something. That within her seven-year history, there are moments — probably dozens of them — when things were at least a little better. That she has strengths she has not been asked to name. That she already knows, in some corner of her awareness, what a better future might look like. SFBT invites her to articulate that future first, to locate the exceptions to her problem, and to discover that the seeds of her solution are already present in her own life.</p>

<p>This course provides a thorough grounding in SFBT as developed by Steve de Shazer and Insoo Kim Berg at the Brief Family Therapy Center in Milwaukee during the late 1970s and 1980s, and as refined by decades of subsequent research and practice. We will examine the philosophical roots of the model, master its core techniques, and then apply that knowledge specifically to the challenges of community mental health — a setting where caseloads are high, sessions are often few, clients are frequently mandated, and the gap between presenting need and available resources is wide.</p>

<p>By the end of this course, you will be able to distinguish SFBT from other brief therapy models, apply signature techniques including the miracle question, exception questions, and scaling questions, adapt the model for populations with complex presentations, identify common misapplications, and navigate the ethical considerations that arise when deploying a brief model in a chronically under-resourced system.</p>

<p>This is a 2-CE-hour course approved by the National Board for Certified Counselors (NBCC ACEP #7760). It is designed for intermediate-level practitioners — licensed counselors, social workers, marriage and family therapists, and nationally certified counselors who have foundational psychotherapy training but wish to deepen their competency in solution-focused practice.</p>`,
        },
        {
          type: 'videoEmbed',
          title: 'Introduction to Solution-Focused Brief Therapy',
          videoUrl: 'https://www.youtube.com/embed/PLACEHOLDER',
          content: 'This overview video introduces the core philosophy of SFBT and its distinction from problem-focused models. As you watch, consider how you might shift your typical intake questions to align with a solution-focused stance.',
        },
        {
          type: 'callout',
          calloutType: 'tip',
          title: 'How to Use This Course',
          content: '<p>Each section builds on the previous one. The interactive activities are not optional review — they are the primary practice mechanism. Plan to complete each activity before moving forward. If you are a current community mental health practitioner, consider bringing a de-identified case to mind as you work through the content; the material will land differently when it is tethered to real clinical experience.</p>',
        },
      ],
    },

    // ════════════════════════════════════════════════════════════════════════
    // SECTION 1 — SFBT Foundations
    // ════════════════════════════════════════════════════════════════════════
    {
      title: 'Section 1: Theoretical Foundations of Solution-Focused Brief Therapy',
      order: 1,
      contentBlocks: [
        // 1. sectionDivider
        {
          type: 'sectionDivider',
          title: 'Section 1: Theoretical Foundations of Solution-Focused Brief Therapy',
          subtitle: 'Origins, philosophy, and core techniques',
        },

        // 2. text (500-800 words)
        {
          type: 'text',
          content: `<h2>The Origins of a Radical Pragmatism</h2>

<p>In the late 1970s, Steve de Shazer and Insoo Kim Berg, working alongside colleagues at the Brief Family Therapy Center (BFTC) in Milwaukee, Wisconsin, began questioning one of therapy's most foundational assumptions: that understanding a problem's origin is necessary for solving it. This was not a rhetorical provocation. De Shazer, trained in systems theory and influenced by the Mental Research Institute (MRI) brief therapy tradition in Palo Alto, had observed something in session recordings that could not easily be explained by the prevailing models. Sometimes clients improved dramatically — not because their problems had been analyzed and resolved — but because something in the conversation had shifted their relationship to the possibility of change.</p>

<p>Berg, a Korean-born social worker whose work was deeply influenced by her experience with families in poverty and under-resourced communities, brought a practice wisdom to the collaboration that de Shazer's more theoretical orientation needed. Together, they spent years videotaping sessions, coding interactions, and asking a deceptively simple question: what do therapists do when therapy works? Not what theory predicts should work — what actually, observably, works in the room?</p>

<p>The answer they arrived at was counterintuitive. Therapists who produced change in brief windows were not primarily diagnosing, interpreting, or teaching. They were asking about exceptions. They were exploring what clients wanted rather than cataloging what clients lacked. They were treating clients as the primary experts on their own lives. This was the empirical foundation from which SFBT emerged — not as a technique package imported from theory, but as an inductive model built from observations of effective practice.</p>

<p>The intellectual genealogy of SFBT draws from several sources. Milton Erickson's hypnotherapeutic approach, which emphasized utilization of existing client resources and the power of indirect suggestion, was a significant influence on de Shazer's early thinking. Gregory Bateson's cybernetic systems theory provided a framework for understanding how small changes in information could produce large changes in behavior. The MRI brief therapy model, developed by Watzlawick, Weakland, and Fisch, contributed the insight that attempted solutions often maintain problems — but SFBT departed from MRI by focusing not on interrupting failed solutions but on amplifying successful ones.</p>

<p>Perhaps most significantly, SFBT was shaped by social constructionism — the philosophical tradition, associated with thinkers like Berger and Luckmann, Gergen, and Wittgenstein, that argues that our understanding of reality is constructed through language and social interaction rather than discovered as an objective fact. For SFBT practitioners, this means that the way a client talks about their situation is not a neutral description of a pre-existing problem — it is itself constitutive of the problem's shape and meaning. Change the conversation and you begin to change the reality the client inhabits.</p>

<p>This philosophical grounding has practical implications that are sometimes underappreciated. SFBT does not simply "add positivity" to a standard therapeutic frame. It represents a genuinely different epistemological stance — one that holds that problems and solutions are not opposite ends of the same continuum, that the causes of problems are largely irrelevant to the production of solutions, and that clients' theories about what will help them should guide clinical decision-making far more than clinician theories about what is wrong.</p>

<p>By the mid-1980s, de Shazer and Berg had articulated the core assumptions of the model, published early empirical findings, and begun training practitioners internationally. The model's growth was accelerated by its demonstrated effectiveness in settings where resources were limited and session counts were few — precisely the conditions that define community mental health practice.</p>`,
        },

        // 3. callout
        {
          type: 'callout',
          calloutType: 'clinical',
          title: 'The Solution-Focused vs. Problem-Focused Distinction Is Epistemological, Not Attitudinal',
          content: `<p>Clinicians new to SFBT sometimes interpret "solution-focused" as a directive to maintain a relentlessly positive tone — to redirect clients away from pain, minimize suffering, or avoid discussing problems altogether. This misreading produces a distorted practice that feels dismissive to clients and produces poor outcomes.</p>
<p>The actual distinction is epistemological. Problem-focused models assume that understanding the problem — its history, its causes, its function — is a necessary prerequisite to solving it. SFBT assumes that this causal analysis, however accurate, does not reliably produce solutions. The model does not deny that problems exist or that they cause genuine suffering. It simply holds that the path to resolution runs through the client's exceptions, goals, and resources — not through the problem's etiology.</p>
<p>In practice, this means SFBT practitioners do not interrupt clients who want to describe their pain. They listen fully. But they listen with a different purpose: not to build a problem map, but to find the moments within the problem narrative where things were different, where the client coped, where something worked — however briefly. The clinical skill is in hearing the exception within the complaint.</p>`,
        },

        // 4. text (500-800 words)
        {
          type: 'text',
          content: `<h2>Core Assumptions and Signature Techniques</h2>

<p>SFBT is organized around a set of explicit assumptions that function as both philosophical commitments and clinical directives. Understanding these assumptions is essential, because every core technique flows from them. The assumptions are not decorative — they determine what the clinician listens for, what questions they ask, and how they respond to client responses.</p>

<p><strong>The assumption of client competence and resources.</strong> SFBT holds that every client has the resources, strengths, and competencies necessary to construct solutions to their problems. This is not naive optimism. It is a deliberate clinical stance that changes what the therapist looks for. When you assume competence, you hear differently. A client who says "I managed to get out of bed three days last week" is not just reporting a symptom level — they are demonstrating capacity that can be amplified.</p>

<p><strong>The assumption that small changes lead to larger changes.</strong> SFBT does not require grand transformation. The model predicts that even minor behavioral shifts, particularly those in the direction of the client's stated goals, will generate ripple effects across the system. This assumption is especially important in community mental health, where it is unrealistic to expect comprehensive personality reorganization in eight sessions. The question "What would be the smallest sign that things were moving in the right direction?" is a direct expression of this assumption.</p>

<p><strong>The assumption that solutions are not necessarily related to problems.</strong> This is perhaps the most clinically counterintuitive assumption. It holds that the activities, contexts, and relationships associated with a client's problem do not need to be fully understood in order to construct a solution. De Shazer made this point with characteristic directness: "The solution is not the opposite of the problem." A client with chronic anxiety does not solve the anxiety by eliminating all anxiety-provoking stimuli; they solve it by amplifying the moments, contexts, and behaviors that are associated with functioning despite anxiety.</p>

<p><strong>The miracle question.</strong> Developed by de Shazer and Berg in the mid-1980s, the miracle question is the model's most recognized technique. Its standard form is: "Suppose that tonight, while you are sleeping, a miracle happens. The miracle is that the problem that brought you here today is solved. But because you are sleeping, you don't know the miracle has happened. When you wake up tomorrow morning, what would be the first small sign that something is different? What would you notice?" The miracle question serves a precise clinical function: it invites the client to construct a detailed, behavioral, first-person description of a preferred future — without requiring them to know how that future will be achieved. The question bypasses the client's problem-saturated thinking by shifting the temporal frame entirely. It is not a fantasy exercise; it is a goal-setting mechanism that generates the behavioral specifics that guide subsequent exception-finding and task assignment.</p>

<p><strong>Exception questions.</strong> Exceptions are the times when the problem could have occurred but did not, or when the problem was less severe, shorter in duration, or less distressing than usual. Exception questions invite the client to notice and describe these moments: "Can you think of a time, even recently, when the depression was just a little bit less crushing?" "What was different about that day?" "What were you doing, thinking, or saying that might have contributed to that?" Exception questions accomplish two things simultaneously: they gather information about what is already working in the client's life, and they begin to shift the client's narrative from a story of unrelenting deficit to a story in which competence already exists — however intermittently.</p>

<p><strong>Scaling questions.</strong> Scaling questions ask clients to rate something on a numerical scale, typically 0 to 10, and then to explore the meaning of their rating in behavioral terms. "On a scale of 0 to 10, where 0 is the worst this problem has ever been and 10 is the day after the miracle, where are you today?" The rating itself is less important than what follows: "What tells you you're at a 4 and not a 2?" This question invites the client to identify what they are already doing that is keeping them above zero — which is, in effect, an exception inquiry in numerical form. Scaling questions are remarkably flexible. They can be used to measure motivation, confidence, progress, hope, and safety, and they produce quantifiable data that both client and clinician can track across sessions.</p>

<p><strong>Coping questions.</strong> When clients present in extreme distress or believe that nothing has ever worked, coping questions redirect to survival rather than solution: "Given everything you're dealing with, how have you managed to keep going?" This question acknowledges the weight of the problem while simultaneously locating agency in the client's response to it. It is particularly valuable in crisis presentations and with clients who have experienced complex trauma.</p>`,
        },

        // 5. accordion
        {
          type: 'accordion',
          accordionItems: [
            {
              title: 'What distinguishes SFBT from other brief therapy models like CBT or MRI?',
              content: '<p>Cognitive-Behavioral Therapy (CBT) and SFBT are both brief and structured, but they differ fundamentally in focus and mechanism. CBT identifies cognitive distortions and behavioral avoidances as maintaining factors, then systematically challenges and modifies them. The intervention logic is: change the cognition → change the emotion → change the behavior. SFBT bypasses the problem analysis entirely. It does not attempt to correct distorted thinking; it amplifies existing functional thinking. MRI brief therapy, the immediate predecessor model, focuses on identifying and interrupting the "attempted solution" that maintains the problem — often by prescribing a paradoxical intervention. SFBT, by contrast, focuses not on what to stop doing but on what to do more of. The locus of intervention is the client\'s own exceptions and resources, not the therapist\'s strategic reframe.</p>',
            },
            {
              title: 'How does the postmodern philosophical stance of SFBT affect the therapeutic relationship?',
              content: '<p>In traditional medical-model therapy, the therapist is the expert on psychopathology and the client is the expert on their symptoms. SFBT inverts this. Because SFBT is rooted in social constructionism — the view that meaning is co-created through language rather than discovered as objective fact — the therapeutic relationship is explicitly collaborative and non-hierarchical. The SFBT therapist does not diagnose in the traditional sense and does not interpret the client\'s unconscious motivations. The client\'s stated goals, their descriptions of exceptions, and their theories about what helps them are taken seriously as the primary data. This stance, sometimes called "not-knowing" (after Harlene Anderson\'s work), requires the therapist to suspend the expert position and genuinely follow the client\'s lead.</p>',
            },
            {
              title: 'Is SFBT evidence-based for serious mental illness?',
              content: '<p>The evidence base for SFBT is substantial, though like most psychotherapy research it is heterogeneous in quality. Meta-analyses by Kim (2008) and Gingerich and Peterson (2013) found positive effects for depression, anxiety, and relationship functioning. Research by Stams et al. (2006) found SFBT effects comparable to other brief models for juvenile delinquency. SFBT has been studied in settings including schools, domestic violence programs, and medical social work. For serious and persistent mental illness (SPMI), the evidence is more limited — SFBT is rarely the primary treatment for schizophrenia spectrum disorders, for example — but it has been used as an adjunctive approach to enhance engagement, set realistic goals, and build therapeutic alliance even with clients who have psychotic features. Franklin et al. (2017) provide the most comprehensive review of the outcome research.</p>',
            },
            {
              title: 'What is "the formula first session task" and how is it used?',
              content: '<p>De Shazer developed the Formula First Session Task (FFST) as a standard between-session assignment given to virtually all clients after the first session, before specific exceptions or goals have been fully mapped. The task is: "Between now and when we meet next, I would like you to observe — so that you can describe to me next time — what happens in your life that you want to continue to happen." The FFST accomplishes several things at once: it establishes between-session observation as normative, it presupposes that positive things are already happening (and therefore searchable), and it positions the client as an active observer of their own life rather than a passive recipient of therapeutic intervention. Research suggests it increases client engagement between sessions and accelerates exception-finding in session two.</p>',
            },
            {
              title: 'How does SFBT handle client ambivalence or resistance?',
              content: '<p>SFBT largely dissolves the concept of resistance by reframing it as information about fit rather than a client deficit. If a client rejects a task or declines to engage with a particular question, the SFBT clinician takes this as feedback that the approach needs to be adjusted to better match how the client works. De Shazer famously asserted that "resistance does not exist" — not because clients are always cooperative, but because what looks like resistance is typically the therapist\'s hypothesis colliding with the client\'s actual way of being. The corrective is to ask: "What would be useful to you?" rather than "Why aren\'t you following my direction?" This stance is particularly important with mandated clients, who may be actively hostile to the therapeutic frame but who often have areas of their life they do care about improving.</p>',
            },
          ],
        },

        // 6. imageText
        {
          type: 'imageText',
          content: `<h3>The Miracle Question in Practice: A Step-by-Step Anatomy</h3>
<p>The miracle question is more than a clever reframe — it is a precisely constructed clinical instrument. Each element of its phrasing is intentional. "Suppose tonight, while you are sleeping" — the sleep detail matters. It prevents the client from generating a logical pathway from problem to solution (they must bypass problem-solving cognition). "A miracle happens" — the word "miracle" signals that we are not asking about realistic plans; we are asking about a desired future freed from current constraints. "The problem that brought you here is solved" — this affirms the client's problem as real and taken seriously. "Because you were sleeping, you don't know the miracle has happened" — this prevents the client from simply saying "I'd feel relieved" and forces behavioral specification: what would you notice first? What would tell you? What would others notice? The behavioral specificity is what makes the miracle question clinically generative rather than merely inspirational.</p>
<p>When clients struggle with the miracle question — "I can't imagine a miracle" or "I don't believe in miracles" — the skilled clinician neither abandons the question nor insists on it. They translate: "Let's say instead — suppose you woke up and things were genuinely better. Not perfect, but meaningfully better. What would be the first small sign?" The spirit of the question — eliciting a behaviorally specific preferred future — is preserved even when the exact wording must be adapted.</p>`,
          image: '',
          imageAlt: 'Diagram illustrating the clinical elements of the miracle question and their therapeutic functions',
          imagePosition: 'right',
        },

        // 7. KC block A — multipleChoice
        {
          type: 'multipleChoice',
          question: 'Steve de Shazer and Insoo Kim Berg developed SFBT primarily through which methodology?',
          options: [
            { text: 'Randomized controlled trials comparing SFBT to CBT', isCorrect: false },
            { text: 'Systematic observation and coding of therapy sessions to identify what effective therapists actually do', isCorrect: true },
            { text: 'Theoretical synthesis of psychoanalytic and humanistic models', isCorrect: false },
            { text: 'Pharmacological research on anxiety and depressive disorders', isCorrect: false },
          ],
          explanation: 'De Shazer and Berg used an inductive, observation-based methodology at the Brief Family Therapy Center — watching and coding videotaped sessions to identify patterns associated with positive outcomes. This empirical pragmatism distinguished SFBT from models derived primarily from theory.',
        },

        // 8. text (400-600 words)
        {
          type: 'text',
          content: `<h2>The Philosophical DNA of SFBT: Social Constructionism and Language</h2>

<p>To practice SFBT well, it is not sufficient to memorize the miracle question and use scaling questions in every session. The techniques are expressions of a deeper philosophical stance, and without that stance, the techniques become gimmicks. Understanding the social constructionist roots of SFBT transforms the practitioner's entire way of listening.</p>

<p>Ludwig Wittgenstein, whose later philosophy influenced both de Shazer directly and the broader postmodern therapeutic tradition, argued that the meaning of language is not fixed by mental content but by use — by what we do with words in particular contexts. For SFBT, this insight has a specific clinical corollary: the words a client uses to describe their problem are not neutral, transparent labels for an underlying psychological reality. They are active constructions that shape and constrain what seems possible. The client who says "I am a depressed person" is doing something different with language than the client who says "I have been struggling with depression." The first formulation positions depression as an identity; the second positions it as an experience with at least some temporal boundaries.</p>

<p>SFBT clinicians are therefore attentive to language in a specific way. They listen for absolutes ("I always fail," "nothing ever works") and gently introduce exceptions through questioning rather than direct challenge. They use the client's exact language rather than substituting clinical terminology, because the client's words carry the client's meaning and the therapeutic relationship depends on that alignment. They speak in future-oriented, possibility language — not "when did this start?" but "what would tell you things were getting better?"</p>

<p>This linguistic orientation is also why de Shazer spent considerable energy analyzing the specific wording of SFBT questions. The difference between "Why haven't things gotten worse?" (a coping question that presupposes the client is maintaining something) and "What's been going wrong?" (a problem question that invites problem elaboration) is not trivial. Each question creates a different conversational reality and invites the client into a different narrative about their situation.</p>

<p>Social constructionism also informs the SFBT stance on diagnosis. SFBT practitioners are typically not hostile to diagnostic labels — they recognize their practical utility in community mental health settings, including for insurance reimbursement and service coordination. But they hold diagnostic labels lightly, treating them as one possible story about the client rather than as definitive descriptions of an underlying pathology. A client's DSM-5 Major Depressive Disorder diagnosis tells the clinician something about the client's presentation; it does not tell the clinician what the client's preferred future looks like, what their exceptions are, or what resources they bring to the work.</p>

<p>Taken together, these philosophical commitments — about language, about the co-construction of reality, about client expertise — produce a therapeutic stance that is genuinely different from the expert-driven, problem-analyzing approaches that dominate clinical training. For many practitioners, learning SFBT requires not just acquiring new techniques but unlearning some deeply held assumptions about what therapy is supposed to do.</p>`,
        },

        // 9. flashcardDeck
        {
          type: 'flashcardDeck',
          title: 'SFBT Core Concepts: Flashcard Review',
          flashcards: [
            {
              front: 'What is the primary purpose of the miracle question in SFBT?',
              back: 'To elicit a behaviorally specific, first-person description of a preferred future — bypassing problem-saturated thinking by shifting the temporal frame and generating the behavioral details that guide subsequent exception-finding and goal-setting.',
            },
            {
              front: 'What is an "exception" in SFBT terminology?',
              back: 'A time when the problem could have occurred but did not, or when it was less severe or less disruptive than usual. Exceptions are the empirical evidence that the client already possesses some capacity to function differently — and are the primary building material for solutions.',
            },
            {
              front: 'How do scaling questions function as an exception inquiry?',
              back: 'By asking "What tells you you\'re at a 4 and not a 2?", the clinician invites the client to identify what they are already doing that keeps them above zero — which is functionally equivalent to asking about exceptions. The numerical frame makes the question accessible and the answer trackable across sessions.',
            },
            {
              front: 'What is the social constructionist basis for SFBT\'s emphasis on language?',
              back: 'Social constructionism holds that meaning is co-created through language rather than discovered as objective fact. For SFBT, this means that problem descriptions are not neutral reports but active constructions that constrain possibility. Shifting the conversational frame — from problem language to exception and future language — literally shifts what the client can perceive as possible.',
            },
            {
              front: 'What is the Formula First Session Task (FFST)?',
              back: 'A standard between-session assignment given after the first session: "Between now and next time we meet, observe what happens in your life that you want to continue to happen." It presupposes that positive things are already occurring and establishes the client as an active observer of their own resources.',
            },
            {
              front: 'What did de Shazer mean when he said "the solution is not the opposite of the problem"?',
              back: 'That understanding and eliminating the problem does not automatically produce a solution. Solutions are built from the client\'s existing competencies, exceptions, and goal descriptions — which may have no direct relationship to the problem\'s etiology or maintaining factors.',
            },
            {
              front: 'What is a coping question and when is it most useful?',
              back: 'A coping question redirects the inquiry to survival: "Given everything you\'re dealing with, how have you managed to keep going?" It is most useful with clients in extreme distress, crisis presentations, or those who report that nothing has ever worked. It locates agency in the client\'s response to adversity rather than their ability to eliminate it.',
            },
            {
              front: 'What philosophical tradition most directly influenced de Shazer\'s understanding of therapeutic language?',
              back: 'Ludwig Wittgenstein\'s philosophy of language — specifically the idea that meaning is constituted by use rather than by mental content. De Shazer applied this to therapy by arguing that the way problems are talked about actively shapes what seems possible as a solution.',
            },
          ],
        },

        // 10. KC block B — matching
        {
          type: 'matching',
          matchingInstructions: 'Match each SFBT concept on the left with its accurate clinical description on the right.',
          matchingPairs: [
            { term: 'Exception question', definition: 'Asks about times when the problem did not occur or was less severe, locating existing client competence' },
            { term: 'Miracle question', definition: 'Invites the client to describe a preferred future in behavioral detail, bypassing the need to identify a causal pathway from problem to solution' },
            { term: 'Scaling question', definition: 'Uses a 0-to-10 rating followed by behavioral elaboration to measure progress, motivation, or confidence and to locate existing strengths above zero' },
            { term: 'Coping question', definition: 'Redirects extreme distress to survival and agency: "How have you managed to keep going despite everything?"' },
            { term: 'Formula First Session Task', definition: 'Between-session observation assignment that presupposes positive events are already occurring and positions the client as an active observer of their own resources' },
            { term: 'Social constructionism', definition: 'The philosophical basis for SFBT\'s language focus — the view that meaning and reality are co-constructed through conversation rather than discovered as objective facts' },
          ],
        },

        // 11. reflection
        {
          type: 'reflection',
          question: 'Think about your typical first session with a new client. How much of that session is organized around gathering problem information versus exploring what the client wants and what is already working? What is one specific question you currently ask that you might reframe in a solution-focused direction?',
        },

        // 12. keyTakeaway
        {
          type: 'keyTakeaway',
          title: 'Key Takeaways — Section 1',
          takeaways: [
            'SFBT was developed inductively by de Shazer and Berg through systematic observation of effective therapy sessions, not derived from pre-existing theory.',
            'The model\'s philosophical foundation is social constructionism: the way problems are spoken about actively shapes what seems possible as a solution.',
            'SFBT is not "positive thinking therapy." Its solution-focus is epistemological — it holds that problem analysis is not necessary or sufficient for producing solutions.',
            'The miracle question functions as a behavioral goal-elicitation tool, not a fantasy exercise. Its specific phrasing bypasses problem-saturated cognition to produce actionable preferred-future descriptions.',
            'Exception questions locate the client\'s existing competence within the problem narrative — the moments when the problem did not occur or was less severe.',
            'Scaling questions translate subjective experience into trackable data and simultaneously function as exception inquiries by asking what keeps the client above zero.',
            'Resistance, in SFBT, is reframed as feedback about fit rather than a client deficit — an invitation to adjust the therapeutic approach rather than to overcome client opposition.',
          ],
        },
      ],
    },

    // ════════════════════════════════════════════════════════════════════════
    // SECTION 2 — SFBT in Community Mental Health
    // ════════════════════════════════════════════════════════════════════════
    {
      title: 'Section 2: Applying SFBT in Community Mental Health Settings',
      order: 2,
      contentBlocks: [
        // 1. sectionDivider
        {
          type: 'sectionDivider',
          title: 'Section 2: Applying SFBT in Community Mental Health Settings',
          subtitle: 'Session structure, mandated clients, crisis adaptation, and ethical considerations',
        },

        // 2. text (500-800 words)
        {
          type: 'text',
          content: `<h2>Community Mental Health as the Natural Habitat of SFBT</h2>

<p>Community mental health centers (CMHCs) occupy a particular position in the mental health landscape. They serve populations that are often multiply marginalized — by poverty, by housing instability, by involvement with the criminal justice system, by diagnoses that carry profound stigma — and they do so with resources that are consistently inadequate to the demand. Caseloads are high. Sessions are few. Waitlists are long. Staff turnover is chronic. The gap between what clients need and what the system can provide is not a temporary funding problem; it is a structural feature of community mental health that practitioners must navigate every day.</p>

<p>It is precisely in this context that SFBT demonstrates its particular strength. The model was not designed for weekly, open-ended therapy with highly verbal, psychologically-minded clients who can commit to months of treatment. It was designed to produce meaningful change in limited time with clients across a wide range of presentations and engagement levels. The Brief Family Therapy Center where SFBT was developed served Milwaukee's urban poor — a population with many characteristics overlapping with typical community mental health caseloads. De Shazer and Berg were not theorizing about efficiency; they were problem-solving within real constraints.</p>

<p>Research consistently supports SFBT's effectiveness in brief formats. A meta-analysis by Gingerich and Peterson (2013), reviewing 43 controlled outcome studies, found positive effects for diverse presenting problems and across treatment lengths from one to ten sessions. Importantly, several studies found no significant difference in outcomes between SFBT delivered in four to six sessions and longer treatments — a finding with obvious implications for community mental health, where session limits are frequently imposed by payer requirements or organizational policy.</p>

<p><strong>The SFBT session structure in community mental health.</strong> A typical SFBT session in community mental health can be organized into four phases, adapted from de Shazer and Berg's original model:</p>

<p><em>Pre-session change.</em> The first session begins, before the formal intake, with a question: "Many people notice that things have already started to change between when they made their appointment and when they arrive. Has anything been different for you since you called?" This question, which de Shazer termed the "pre-session change inquiry," capitalizes on the psychological phenomenon that people often begin preparing for change once they decide to seek help. Studies by Weiner-Davis, de Shazer, and Gingerich (1987) found that approximately two-thirds of clients reported noticing positive pre-session changes when asked. Amplifying these changes in the first session establishes that positive movement is already underway — a powerful therapeutic frame.</p>

<p><em>Goal-setting.</em> SFBT goal-setting is specific, behavioral, and client-driven. The clinician uses the miracle question and exception questions to help the client articulate what they want to be different, in terms that are measurable and in the client's own behavioral language. Goals in SFBT are described in the presence of something rather than the absence of a problem — not "I want to stop drinking" but "I want to wake up in the morning feeling clear-headed and ready to deal with my kids." This positive framing is not motivational rhetoric; it identifies the target behaviors that will guide subsequent interventions.</p>

<p><em>The break and the compliment.</em> Traditional SFBT practice, as developed at BFTC, included a brief pause during or at the end of the session during which the therapist stepped out to consult with a team watching behind a one-way mirror. In community mental health, this team format is rarely available, but the structural function of the break can be preserved by a brief period of consultation with notes at the end of the session. What follows the break is a compliment — a direct, specific acknowledgment of the client's strengths, competencies, or progress observed during the session. Compliments in SFBT are not generic praise ("You're doing great!"); they are evidence-based summaries of what the clinician has observed ("I was struck by how clearly you were able to describe what you want for your kids, even in the middle of everything you're carrying right now").</p>

<p><em>Task assignment.</em> The session concludes with a task — a between-session activity designed to amplify existing exceptions or experiment with new behaviors. Tasks fall into two broad categories: observation tasks ("Notice the times when the anxiety is just a bit less, and see if you can figure out what is different about those moments") and behavioral tasks ("Try doing one thing this week that the miracle-version of you would do"). Tasks are always tailored to the client's goals and presented tentatively, as experiments rather than prescriptions.</p>`,
        },

        // 3. callout
        {
          type: 'callout',
          calloutType: 'warning',
          title: 'Why SFBT Explicitly Avoids Problem Analysis in Community Mental Health Settings — And Why Misapplying This Principle Is Harmful',
          content: `<p>SFBT's stance on problem analysis — that understanding a problem's history is not necessary for constructing solutions — is frequently misapplied in community mental health in ways that cause harm. The principle is sometimes used to justify insufficient assessment: skipping trauma screening, bypassing suicide risk assessment, or avoiding mandated-reporter obligations on the grounds that "SFBT doesn't focus on problems." This is a dangerous distortion.</p>
<p>SFBT does not prohibit assessment. It shifts the purpose of the conversation from problem excavation to resource identification. A solution-focused clinician conducting an initial session with a client who has expressed suicidal ideation absolutely assesses lethality, explores protective factors, and follows standard safety protocols. The solution-focused frame is applied within that structure — asking about times the client has managed urges without acting, exploring what has kept them alive, using scaling to assess intent and access to means — not instead of it.</p>
<p>Similarly, SFBT's "not-knowing" stance does not mean the clinician brings no clinical knowledge to the session. It means the clinician does not presume to know what the client's goals should be, what their problem means, or what the solution looks like before the client has been heard. Clinical knowledge about safety, trauma sequelae, medication interactions, and community resources is applied in service of the client's goals — not imposed over them.</p>`,
        },

        // 4. text (500-800 words)
        {
          type: 'text',
          content: `<h2>SFBT with Mandated Clients, Crisis Presentations, and Complex Populations</h2>

<p><strong>Mandated clients.</strong> Community mental health caseloads include substantial numbers of mandated clients — individuals referred by courts, child protective services, probation departments, or employers who are required to attend therapy as a condition of something else: avoiding incarceration, maintaining parental rights, keeping a job. These clients present a particular challenge for any therapeutic model, but SFBT has demonstrated consistent utility with mandated populations, for reasons rooted in its core assumptions.</p>

<p>The critical move with mandated clients is to distinguish between the referral source's goals and the client's goals. A client mandated to substance abuse treatment by a drug court may have no personal investment in sobriety but may have intense investment in maintaining contact with his children. SFBT finds that investment — whatever it is — and builds from there. The question is not "What does the court want from you?" but "What do you want for yourself?" When a mandated client cannot identify any personal goal, the clinician might ask: "Okay — who in your life would notice if things got better for you? What would they see?" This brings the client's relational world into the session and often surfaces goals that pure problem-analysis would not reach.</p>

<p>Berg and Kelly (2000) developed a specific SFBT protocol for mandated clients that distinguishes between "customers" (clients motivated for change), "complainants" (clients who see problems but don't see themselves as part of the solution), and "visitors" (clients who don't see any problem at all). The protocol matches task assignment to the client's current level of engagement rather than imposing a customer-level intervention on a visitor-level client — a distinction that dramatically reduces session-sabotaging confrontations and increases the likelihood that even mandatory attendees will return.</p>

<p><strong>Crisis presentations.</strong> Community mental health clinicians frequently encounter clients in acute crisis — suicidal ideation, self-harm, acute psychosis, domestic violence. SFBT is not a crisis intervention model in itself, and standard safety assessment and intervention protocols take precedence. However, SFBT techniques integrate effectively within a crisis frame, particularly in the post-stabilization phase.</p>

<p>Coping questions are especially valuable in crisis: "How have you gotten through previous nights like this one?" "What has kept you here before?" These questions are not minimizing the crisis — they are locating the client's survival competence within it. Exception questions in crisis contexts look for times the suicidal urge was present but not acted upon: "Have there been moments in the past week when the urge was there but you got through it? What did you do?" Safety planning in SFBT draws heavily on exception-identified coping strategies and relational resources rather than on clinician-prescribed behavioral protocols.</p>

<p><strong>Clients with chronic mental illness.</strong> SFBT is sometimes dismissed as unsuitable for clients with serious and persistent mental illness (SPMI), on the assumption that these clients lack the cognitive or relational resources the model requires. This assumption is both clinically inaccurate and ethically problematic. Research by Macdonald (2011) and clinical descriptions by Lipchik (2002) document effective SFBT applications with clients experiencing schizophrenia, bipolar disorder, and borderline personality disorder.</p>

<p>The key adaptations for SPMI clients involve pacing and scope. The miracle question may need to be simplified: "If things were just a little better for you, what would that look like?" Goals need to be scaled to what is realistic within the client's current functional level, without becoming paternalistic about what is possible. Sessions may be shorter and more frequent during acute phases. And the clinician must be attentive to medication adherence, coordinated care with prescribers, and community support systems in ways that pure SFBT protocol does not require — because community mental health is a multidisciplinary system, not a dyadic therapeutic relationship in isolation.</p>

<p><strong>Common misapplications and ethical considerations.</strong> Several misapplications of SFBT are common enough in community mental health to warrant direct attention. First, as noted in the callout above, SFBT's de-emphasis on problem analysis is sometimes used to justify inadequate assessment. Second, the model's brevity is sometimes used to rationalize premature termination — closing cases at the session limit regardless of client need. SFBT is brief because it can produce meaningful change briefly; it is not a justification for abandoning clients who need continued support. Third, SFBT's strength-based orientation is sometimes weaponized against clients with trauma histories — dismissing expressions of pain as "dwelling on the problem" rather than honoring necessary grief and processing. A solution-focused approach that does not make space for grief is not SFBT; it is a performance of positivity that leaves trauma untouched.</p>

<p>The ethical obligation in SFBT is to the client's genuine wellbeing and goals — not to the technique's formal elegance. When a client needs problem-focused processing, problem-focused processing is what the clinician provides. When the session limit has been reached but the client is in acute distress, the clinician advocates for continued services. SFBT is a framework for organizing therapeutic conversations, not a set of rules that supersede clinical judgment.</p>`,
        },

        // 5. accordion
        {
          type: 'accordion',
          accordionItems: [
            {
              title: 'How do you handle a mandated client who says "I don\'t have any goals — I\'m only here because I have to be"?',
              content: '<p>This is one of the most common presentations in community mental health, and SFBT handles it with explicit non-confrontation. The first move is to acknowledge the situation fully: "I get it — you didn\'t choose to be here, and I\'m not going to pretend otherwise." Then the clinician looks for what the client does care about, even if it has nothing to do with the referral concern: "Is there anything in your life right now that you would like to be different — even something small and totally unrelated to why you were sent here?" If the client remains at a visitor level, tasks are correspondingly light: "Would you be willing to just notice this week if anything happens that you want to keep happening?" The goal is not to force investment but to keep the door open until investment naturally appears.</p>',
            },
            {
              title: 'What is the SFBT approach to trauma-informed care — is SFBT trauma-informed?',
              content: '<p>SFBT\'s compatibility with trauma-informed care has been debated in the field. Lipchik (2002) and others have argued that SFBT\'s relational, non-pathologizing, strength-based orientation is inherently trauma-informed. Critics argue that SFBT\'s de-emphasis on problem history means trauma may go undetected and unprocessed. The resolution is integrative: SFBT\'s philosophical stance — respect for client expertise, avoidance of re-traumatizing problem-excavation, focus on survival and coping — is consistent with trauma-informed principles. But SFBT techniques should not be used to avoid trauma processing when that processing is what the client needs. A trauma-informed SFBT practitioner uses solution-focused language while remaining attuned to trauma sequelae, makes space for grief and anger without redirecting it prematurely to exceptions, and integrates safety planning as a core component of work with trauma survivors.</p>',
            },
            {
              title: 'How should session limits be handled in a solution-focused frame?',
              content: '<p>Session limits — whether imposed by managed care, agency policy, or payer requirements — are one of the most ethically fraught realities of community mental health. SFBT handles this by making session limits explicit and therapeutic: "We have eight sessions together. Knowing that, what would you most like to have accomplished by the time we finish?" This reframes the limit as a focusing tool rather than a barrier. Research on SFBT outcomes suggests that the model is actually well-suited to brief formats — many studies find equivalent outcomes at four sessions versus twelve. However, when a client\'s clinical need genuinely exceeds the available session limit, the ethical obligation is to advocate for the client and facilitate warm handoffs to other resources, not to shoehorn complex treatment into an arbitrary session count.</p>',
            },
            {
              title: 'Can SFBT be combined with Motivational Interviewing?',
              content: '<p>Yes — and many community mental health practitioners find the integration natural and effective. Both models share a non-confrontational stance, a respect for client ambivalence, and a belief that the client\'s own values and goals are the engine of change. MI\'s focus on exploring ambivalence and building discrepancy between current behavior and stated values complements SFBT\'s focus on amplifying existing exceptions and preferred-future vision. In practice, the integration often looks like: using MI techniques (reflective listening, rolling with resistance, exploring importance and confidence) in the early stages of engagement with ambivalent or mandated clients, and transitioning to SFBT exception-finding and scaling once the client has identified a goal they are willing to work toward. Arkowitz and Miller (2008) and others have described this integration in detail.</p>',
            },
            {
              title: 'What makes a compliment therapeutic in SFBT versus just patronizing?',
              content: '<p>SFBT compliments are therapeutic when they are specific, evidence-based, and directly tied to the client\'s stated goals. "You\'ve been doing really well" is generic and patronizing. "I noticed that when you described wanting your kids to see you differently, your whole posture changed — that tells me this matters to you in a deep way, and I think that caring is something you can build on" is a genuine SFBT compliment. It identifies something specific the clinician observed, names the client strength it demonstrates, and connects it to the client\'s own goal. The effect is not flattery; it is a clinician-validated reflection of the client\'s own competence, delivered in a way that the client cannot easily dismiss.</p>',
            },
          ],
        },

        // 6. imageText
        {
          type: 'imageText',
          content: `<h3>The Visitor-Complainant-Customer Framework for Engagement Classification</h3>
<p>Steve de Shazer's classification of client engagement levels — visitor, complainant, and customer — is one of the most practically useful tools SFBT offers for community mental health practitioners. Understanding a client's current level of engagement allows the clinician to calibrate their interventions appropriately, avoiding the common error of treating every client as if they were equally motivated for change.</p>
<p>A <strong>visitor</strong> does not perceive a problem that needs solving — they are present because someone else requires their attendance. With visitors, the appropriate intervention is minimal: an observation task, a compliment on their willingness to come, and an open door. Behavioral tasks and miracle questions will be rejected by visitors and may permanently damage the alliance.</p>
<p>A <strong>complainant</strong> recognizes that a problem exists but does not yet see themselves as part of the solution — the problem is attributed to others (a partner, an employer, the system). With complainants, the clinician validates their perspective fully, then uses exception questions to gently explore what is different on better days. Observation tasks work well; behavioral tasks that require the client to change may feel unfair and be refused.</p>
<p>A <strong>customer</strong> recognizes the problem, sees themselves as part of the solution, and is actively motivated to change. With customers, the full SFBT toolkit is available: miracle question, scaling, behavioral tasks, and explicit goal-tracking.</p>
<p>Importantly, these categories are not fixed. A visitor in session one may become a customer by session three — if the clinician has not alienated them by pushing too hard too soon. The practitioner's job is to meet the client where they are and create conditions for the natural evolution of motivation.</p>`,
          image: '',
          imageAlt: 'Three-tier diagram showing the visitor-complainant-customer engagement framework with corresponding intervention strategies',
          imagePosition: 'left',
        },

        // 7. KC block A — multiSelect
        {
          type: 'multiSelect',
          question: 'Which of the following statements accurately reflect SFBT\'s approach to mandated clients? Select ALL that apply.',
          options: [
            { text: 'The clinician distinguishes between the referral source\'s goals and the client\'s personal goals, prioritizing the latter as the therapeutic focus', isCorrect: true },
            { text: 'Mandated clients are automatically classified as "visitors" and receive only observation tasks for the entire treatment course', isCorrect: false },
            { text: 'The clinician uses relational questions to identify what people in the client\'s life would notice if things got better, surfacing goals that direct questioning might not reach', isCorrect: true },
            { text: 'SFBT holds that resistance in mandated clients reflects a character defect that must be addressed before therapy can proceed', isCorrect: false },
            { text: 'Task assignment is matched to the client\'s current level of engagement — visitor, complainant, or customer — rather than imposed at a fixed intensity', isCorrect: true },
            { text: 'If a mandated client cannot identify any personal goal, the therapeutic relationship should be terminated as non-viable', isCorrect: false },
          ],
          explanation: 'SFBT with mandated clients requires finding the client\'s own investment — whatever it is — and building from there. The visitor-complainant-customer framework guides intervention intensity, and the assumption is that engagement levels are fluid and can evolve with appropriate therapeutic conditions.',
        },

        // 8. text (400-600 words)
        {
          type: 'text',
          content: `<h2>Sustaining Fidelity: Common Misapplications and Quality Assurance in SFBT Practice</h2>

<p>The widespread adoption of SFBT in community mental health has produced a significant fidelity problem. The model's techniques — particularly the miracle question and scaling questions — are so teachable in their surface form that clinicians often deploy them without internalizing the underlying stance. The result is what Lipchik (2002) called "solution-forced therapy" — an approach that looks solution-focused in its technique use but operates from a problem-focused epistemology, using solution-talk to steer clients away from pain rather than to amplify existing competence.</p>

<p>Several specific misapplications warrant attention in community mental health contexts:</p>

<p><strong>Premature exception-finding.</strong> Jumping to "but what about when things are better?" before the client feels heard is one of the most common SFBT errors. Clients who feel their pain is being minimized disengage. The exception inquiry should follow sufficient joining — enough reflective listening that the client's experience of the problem has been genuinely acknowledged. In session one, this may mean spending the first fifteen minutes listening to the problem narrative before introducing any solution-focused question.</p>

<p><strong>Mechanical miracle questions.</strong> Delivering the miracle question in a rote, flat way — as if reading from a script — produces flat answers. The question requires genuine curiosity on the therapist's part. When the clinician is actually interested in the answer, the pacing, tone, and follow-up elaboration create the conditions for a genuinely exploratory response. Supervision of SFBT should include direct observation of miracle question delivery, not just clinician self-report.</p>

<p><strong>Avoiding the negative.</strong> SFBT does not require the clinician to maintain constant positivity. When a client's answer to "what would be different the day after the miracle?" includes painful content — "I wouldn't have to worry about whether my kids are safe," "I wouldn't wake up every morning wishing I hadn't" — the clinician follows that content with genuine curiosity. These are not problem diversions; they are descriptions of what the client most wants. The solution-focused work is to gently translate the absence into a presence: "What would you be feeling instead of that fear?" "What would waking up look like when you're not in that place?"</p>

<p><strong>Confusing brevity with superficiality.</strong> SFBT is brief in session count, not in depth. A single well-conducted SFBT session can produce profound shifts in how a client relates to their situation. The goal is not to cover less ground; it is to cover the ground that matters most — the client's preferred future and existing resources — efficiently and without detours into problem archaeology that do not serve the therapeutic purpose.</p>

<p>Quality assurance in SFBT practice is best supported through video review, peer supervision, and use of validated fidelity instruments. The Solution-Focused Therapy Treatment Manual for Working with Individuals (published by SFBTA) and the SFBT fidelity checklist developed by Ferraz and Wellman (2008) both provide structured frameworks for assessing practice quality. In community mental health settings, where supervision is often sparse and practitioner training is variable, building SFBT fidelity structures into organizational practice — not just individual professional development — is an ethical imperative.</p>`,
        },

        // 9. cardSort
        {
          type: 'cardSort',
          instructions: 'Sort each clinical scenario into the correct client engagement category: Visitor, Complainant, or Customer. Each card describes a client presentation at the beginning of a first session.',
          categories: ['Visitor', 'Complainant', 'Customer'],
          cards: [
            {
              id: '1',
              text: 'Marcus was ordered to attend counseling by his probation officer after a DUI. He says: "I don\'t have a drinking problem. The cop just had it out for me. I\'ll come to your sessions but I\'m not going to pretend I need to change."',
              correctCategory: 'Visitor',
            },
            {
              id: '2',
              text: 'Denise comes voluntarily after a painful divorce. She says: "I know I need to do things differently — I keep attracting the same type of person. I want to understand my patterns so I can change them."',
              correctCategory: 'Customer',
            },
            {
              id: '3',
              text: 'Jerome was referred by his employer\'s EAP after a workplace conflict. He says: "My supervisor is impossible to work with. If management would deal with him, everything would be fine. I\'m not the problem here."',
              correctCategory: 'Complainant',
            },
            {
              id: '4',
              text: 'Anika comes because her mother insisted. She says: "My mom thinks I\'m depressed but I just don\'t like talking about my feelings. I don\'t really see why I\'m here."',
              correctCategory: 'Visitor',
            },
            {
              id: '5',
              text: 'Rafael comes after his second panic attack in a month. He says: "Something is wrong and I need to figure out what. I want to understand what triggers this and what I can do about it."',
              correctCategory: 'Customer',
            },
            {
              id: '6',
              text: 'Tanya was referred by CPS after a report of child neglect. She says: "I love my kids more than anything, but CPS only talks to me about what I\'m doing wrong. Nobody asks what I\'m doing right. I want my kids back."',
              correctCategory: 'Complainant',
            },
          ],
        },

        // 10. KC block B — fillInBlank
        {
          type: 'fillInBlank',
          question: 'Complete the following statements about SFBT in community mental health:',
          blanks: [
            {
              before: 'The pre-session change inquiry asks clients whether things have already changed between making their appointment and arriving for the first session. Research by Weiner-Davis et al. found that approximately',
              answer: 'two-thirds',
              after: 'of clients reported noticing positive pre-session changes when asked.',
            },
            {
              before: 'In the SFBT visitor-complainant-customer framework, a client who recognizes a problem exists but attributes it entirely to external factors and does not see themselves as part of the solution is classified as a',
              answer: 'complainant',
              after: '. The most appropriate task for this client type is typically an observation task.',
            },
            {
              before: 'SFBT compliments are therapeutic when they are specific,',
              answer: 'evidence-based',
              after: ', and directly tied to the client\'s stated goals — not generic praise.',
            },
            {
              before: 'The ethical concern with using SFBT\'s de-emphasis on problem analysis to skip trauma screening or suicide risk assessment represents a misapplication called',
              answer: 'solution-forced therapy',
              after: ' — using solution-focused techniques to avoid clinical obligations rather than to serve the client\'s genuine wellbeing.',
            },
          ],
        },

        // 11. reflection
        {
          type: 'reflection',
          question: 'Identify a client on your current caseload (or a client type you regularly encounter in your practice setting) who would be classified as a "visitor" or "complainant." How have you typically responded to their resistance or externalization? What specific SFBT technique or reframe might you apply in your next session with them?',
        },

        // 12. keyTakeaway
        {
          type: 'keyTakeaway',
          title: 'Key Takeaways — Section 2',
          takeaways: [
            'SFBT was developed in settings similar to community mental health — serving urban, under-resourced populations with brief, structured conversations — making it particularly well-suited to CMHCs.',
            'The SFBT session structure includes four phases: pre-session change inquiry, goal-setting, the break and compliment, and task assignment.',
            'Pre-session change inquiry capitalizes on the psychological reality that change often begins before the first session; research finds approximately two-thirds of clients report positive pre-session changes when asked.',
            'The visitor-complainant-customer framework classifies client engagement level and matches task assignment accordingly — interventions that work for customers will alienate visitors.',
            'SFBT with mandated clients locates the client\'s own investment — not the referral source\'s goals — as the therapeutic lever, using relational questions to surface goals that direct questioning may not reach.',
            'SFBT integrates effectively within crisis intervention by using coping questions and exception inquiry to locate survival competence, while safety protocols remain paramount.',
            'Common misapplications include premature exception-finding before the client feels heard, mechanical technique delivery, and using solution-focus to avoid necessary problem assessment or trauma processing.',
            'SFBT fidelity is best maintained through video review, peer supervision, and validated fidelity instruments — not just self-report.',
          ],
        },

        // inline resources block (final section only)
        {
          type: 'resources',
          title: 'Professional Resources for SFBT Practice',
          resources: [
            {
              title: 'Solution-Focused Brief Therapy Association (SFBTA)',
              url: 'https://www.sfbta.org',
              type: 'website',
              description: 'The primary professional organization for SFBT practitioners worldwide. Offers training standards, a practitioner directory, research library, and the SFBT Treatment Manual for Working with Individuals.',
            },
            {
              title: 'Brief Family Therapy Center — Original Training Materials',
              url: 'https://www.bftc.us',
              type: 'website',
              description: 'Archive and resources from de Shazer and Berg\'s original Brief Family Therapy Center in Milwaukee, including case transcripts and foundational papers.',
            },
            {
              title: 'SAMHSA\'s Evidence-Based Practices Resource Center',
              url: 'https://www.samhsa.gov/resource-search/ebp',
              type: 'website',
              description: 'SAMHSA\'s repository of evidence-based practice resources, including implementation guides for brief therapy models in community mental health settings.',
            },
            {
              title: 'Journal of Solution-Focused Practices',
              url: 'https://digitalscholarship.unlv.edu/journalsfp/',
              type: 'website',
              description: 'Peer-reviewed journal publishing research and practice papers on solution-focused approaches across clinical, educational, and organizational contexts.',
            },
            {
              title: 'NBCC Center for the Study of Mental Health Counseling',
              url: 'https://www.nbcc.org',
              type: 'website',
              description: 'National Board for Certified Counselors professional development resources, ethics guidelines, and continuing education for NCCs practicing SFBT and other brief therapy models.',
            },
            {
              title: 'Solution-Focused Therapy Treatment Manual for Working with Individuals (SFBTA, 2nd ed.)',
              url: 'https://www.sfbta.org/resources',
              type: 'guide',
              description: 'The official SFBTA treatment manual providing session-by-session guidance, fidelity checklists, and clinical examples for SFBT with adult individual clients — highly recommended for community mental health practitioners seeking to standardize their practice.',
            },
            {
              title: 'Community Mental Health Journal — SFBT Special Issues',
              url: 'https://link.springer.com/journal/10597',
              type: 'website',
              description: 'Peer-reviewed journal publishing research on mental health service delivery in community settings, including studies on brief therapy effectiveness with underserved populations.',
            },
          ],
        },

        // 13. text — SFBT outcome research and evidence base
        {
          type: 'text',
          content: `<h2>SFBT Outcome Research and the Evidence Base</h2>

<p>Clinicians adopting a new therapeutic model are right to ask what the outcome research actually supports — not just what its developers claim. SFBT has accumulated a substantial body of controlled outcome research over the past three decades, and understanding both its strengths and its honest limitations equips practitioners to represent the model accurately to supervisors, funders, and clients.</p>

<p>The two most frequently cited quantitative syntheses are Kim's (2008) meta-analysis and Gingerich and Peterson's (2013) systematic qualitative review. Kim (2008) pooled data across 22 studies and found small-to-moderate effect sizes for SFBT on externalizing behavior and internalizing problems, with somewhat weaker effects on family and relationship outcomes. Gingerich and Peterson (2013) took a broader approach, reviewing 43 controlled outcome studies published between 1988 and 2010, and concluded that the evidence was predominantly positive: 32 of the 43 studies reported significant positive results favoring SFBT on at least one outcome measure, and none reported SFBT to be harmful or significantly worse than a comparison condition. Franklin, Zhang, Froerer, and Johnson (2017) extended this work with a systematic review and meta-summary of SFBT process research, adding methodological texture to the outcome findings by examining what specific in-session mechanisms (exception elaboration, scaling, compliments) were associated with client change. Taken together, these three syntheses represent the closest thing SFBT has to a settled evidence consensus, and each is worth reading directly rather than relying solely on secondary summaries when representing the model's evidence base to colleagues or oversight bodies.</p>

<p>Certain populations and settings show particularly consistent positive findings. Youth and school-based applications are among the best-studied contexts for SFBT — Kim (2008) and later reviews found that school-based SFBT interventions for behavioral and academic concerns produced some of the more robust effect sizes in the literature, plausibly because school settings provide naturally brief, externally structured contact that matches SFBT's format. Clients presenting with circumscribed, brief-duration concerns also tend to show stronger response than those with chronic, multiply-comorbid presentations. Perhaps counterintuitively, externally motivated and even mandated clients have shown meaningful benefit in several studies, consistent with the model's visitor-complainant-customer framework and its explicit techniques for engaging low-motivation clients (Berg & Kelly, 2000). Community mental health settings specifically appear in a meaningful subset of the reviewed studies, and the pattern that emerges — equivalent outcomes at four to six sessions compared with longer courses of treatment — is one of the most practically important findings for practitioners working under session limits imposed by payers or agency policy.</p>

<p>An honest accounting of the evidence base requires equal attention to its limitations. First, allegiance effects are a persistent concern: a substantial proportion of the published SFBT outcome literature was conducted by researchers affiliated with SFBT training institutes or with direct ties to de Shazer and Berg's professional network, and allegiance effects are a well-documented source of inflated effect sizes across the psychotherapy outcome literature generally, not unique to SFBT. Second, Gingerich and Peterson (2013) themselves noted substantial heterogeneity in how "SFBT" was operationalized across the 43 studies reviewed — some interventions closely followed the BFTC protocol, while others used loosely adapted solution-focused elements embedded within otherwise different treatment frameworks, making it difficult to know precisely which version of "SFBT" produced which effects. This definitional looseness is not unique to SFBT — it is a recurring problem across brand-name psychotherapy outcome research generally — but it is a particularly relevant caution for SFBT given how readily its surface techniques (a scaling question here, a compliment there) can be borrowed piecemeal into another model's framework while being labeled, sometimes inaccurately, as "solution-focused." Third, the field has a relative paucity of dismantling studies — research designed to isolate which specific components of SFBT (the miracle question, scaling, compliments, exception-finding) are actually driving outcomes, as opposed to nonspecific factors like therapeutic alliance or the brief format itself. Without dismantling research, it remains genuinely unclear whether SFBT's specific techniques add active ingredients beyond what any well-structured, alliance-focused brief intervention would produce. Franklin et al.'s (2017) process-research review is a step toward closing this gap, but it examines in-session mechanisms associated with client change rather than randomized component-removal designs, so the underlying question of active ingredients remains substantially open.</p>

<p>How does SFBT compare with Cognitive-Behavioral Therapy at equivalent session counts? Direct head-to-head comparisons are fewer than comparisons of either model against waitlist or treatment-as-usual controls, but the available research generally finds SFBT and brief CBT protocols to produce roughly comparable outcomes for depression and anxiety when session counts are matched, with CBT sometimes showing an edge on symptom-specific outcome measures (which is unsurprising, since CBT protocols are typically designed and validated against those specific measures) and SFBT showing comparable or occasionally superior client-rated satisfaction and engagement measures. Neither model has demonstrated clear superiority across the full range of outcomes that matter in community mental health — symptom reduction, functional improvement, treatment retention, and client-perceived helpfulness — which supports a pragmatic clinical stance: SFBT and CBT are both defensible evidence-based choices for brief-format work, and the choice between them should be guided by client preference, presenting concern, and clinician competency rather than by an assumption that one model is categorically superior to the other. Agencies that require staff to select a single primary modality for a given program should be cautious about treating this evidence as grounds for mandating one model over the other agency-wide, since the comparative literature simply does not support that degree of confident differentiation.</p>

<p>For the community mental health practitioner, the practical takeaway is this: SFBT has a genuine, peer-reviewed evidence base that supports its use, particularly in brief and session-limited formats, with youth, in school settings, and with externally motivated clients. That evidence base also has real limits — allegiance effects, definitional heterogeneity, and a shortage of dismantling research — that a rigorous practitioner should be able to name honestly rather than overstate. Representing the model's evidence accurately, including its limitations, is itself consistent with SFBT's foundational commitment to observed reality over theoretical elegance.</p>

<p>This evidence base also has direct implications for documentation and agency accountability. When a community mental health agency asks a clinician to justify a brief-format treatment plan to a utilization reviewer or funding body, citing Gingerich and Peterson's (2013) finding of equivalent outcomes at four to six sessions provides a defensible, peer-reviewed rationale — one considerably stronger than simply asserting that "brief therapy works" without a source. Conversely, clinicians should resist the temptation to cite SFBT research selectively in ways that overstate certainty, particularly when working with complex, comorbid, or high-acuity presentations where the evidence is thinner. Miller, Duncan, and Hubble's (1997) broader critique of the psychotherapy outcome literature is instructive here: across virtually every model, common factors — alliance quality, client motivation, therapist allegiance — account for more outcome variance than model-specific technique. SFBT's outcome research should be read in that context: it supports the model as one credible, evidence-informed option among several defensible brief approaches, not as a uniquely superior technology. Practitioners who hold the evidence with this degree of nuance are better equipped to make sound case-by-case decisions about when SFBT is the right fit, when a longer or more intensive course of treatment is clinically warranted, and when a different or blended approach — trauma-focused, skills-based, or integrative — better serves a given client's presenting needs and treatment goals.</p>`,
        },

        // 14. reflection
        {
          type: 'reflection',
          question: 'Think of a client who has repeatedly described the same problem across multiple sessions without movement. What one exception question or scaling question might you introduce in your next session that you have not yet tried? What has stopped you from using a more explicitly solution-focused frame with this client — and what does that hesitation reveal about your own theoretical assumptions?',
        },
      ],
    },

    // ── CONCLUSION ─────────────────────────────────────────────────────────
    {
      title: 'Conclusion: Solution-Focused Listening as a Sustainable Community Mental Health Practice',
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'Conclusion',
          subtitle: 'From theoretical foundations to sustainable community mental health practice',
        },
        {
          type: 'text',
          content: `<p>This course opened by naming SFBT as "a different kind of listening" — and that framing has run through everything since. Section 1 grounded that different listening in its theoretical foundations: SFBT's inductive origins in de Shazer and Berg's observation of what actually worked in sessions, its social-constructionist premise that language shapes therapeutic reality, and its core epistemological claim that solutions do not require excavating a problem's history to be built. The techniques you learned there — exception questions, scaling questions, the miracle question, and the Formula First Session Task — are not gimmicks; they are structured ways of directing clinical attention toward existing client competence rather than problem analysis.</p>
<p>Section 2 tested that theoretical foundation against the realities of community mental health: mandated clients who did not choose to be in the room, crisis presentations where safety assessment must take precedence, and the visitor-complainant-customer framework for calibrating intervention to a client's actual engagement level. You also confronted the ethical misapplications that give SFBT a bad name when done poorly — using "no problem focus" to justify skipping trauma or suicide screening, or weaponizing strength-based language against clients who need room to grieve. Genuine SFBT practice holds both: rigorous safety assessment where required, and a stance of curious, competence-focused listening within that structure.</p>
<p>The thread connecting both sections is de Shazer's foundational claim that the solution is not the opposite of the problem. Community mental health clinicians carry heavy caseloads and structural session limits; SFBT's brief, competence-focused approach is not a compromise forced by those constraints but a clinically validated model in its own right, supported by outcome research showing brief delivery achieves outcomes comparable to longer treatment. Used with integrity — safety obligations intact, genuine curiosity toward the client's own resources — solution-focused listening offers a sustainable way to do meaningful work within real-world constraints.</p>`,
        },
        {
          type: 'keyTakeaway',
          title: 'Course-Wide Key Takeaways',
          takeaways: [
            'SFBT was built inductively from observing what worked in actual therapy sessions, not derived from prior theory and then tested — a social-constructionist model in which language shapes therapeutic reality.',
            'De Shazer\'s core claim — the solution is not the opposite of the problem — means solutions can be built from existing client competence without requiring full problem-history analysis.',
            'Exception questions, scaling questions, and the miracle question all function to locate and amplify evidence of a client\'s existing capacity to function differently.',
            'The visitor-complainant-customer framework calibrates intervention to a client\'s actual engagement level, particularly important with mandated clients in community mental health.',
            'SFBT does not prohibit or replace standard safety assessment, trauma screening, or mandated-reporter obligations — these proceed within the SFBT frame, not instead of it.',
            'Outcome research, including Gingerich and Peterson\'s (2013) meta-analysis, supports brief SFBT delivery (four to six sessions) as comparable in effectiveness to longer treatment.',
          ],
        },
        {
          type: 'callout',
          calloutType: 'tip',
          title: 'Continuing Your SFBT Practice',
          content: `<p>SFBT competency deepens with structured practice and consultation. Consider pursuing further training through the Solution-Focused Brief Therapy Association (SFBTA), reviewing the SFBTA treatment manual for session-by-session fidelity guidance, and seeking peer consultation when working with mandated or crisis-level clients where the SFBT frame must be integrated with standard safety protocols.</p>`,
        },
        {
          type: 'reflection',
          question: 'Identify one client on your current caseload with whom you have defaulted to problem-focused questioning across multiple sessions. What is one exception question or scaling question you could introduce in your next session with them — and what would you need to let go of, theoretically, to ask it genuinely?',
        },
      ],
    },
  ],

  // ── ASSESSMENT ─────────────────────────────────────────────────────────────
  assessment: {
    title: 'Final Assessment — CR-CLI-604: Solution-Focused Brief Therapy in Community Mental Health',
    passingScore: 80,
    passThreshold: 0.8,
    attemptsAllowed: 3,
    shuffleQuestions: true,
    shuffleOptions: true,
    questions: [
    {
      question: 'Solution-Focused Brief Therapy was developed primarily through which of the following processes?',
      options: [
        { text: 'A series of randomized controlled trials comparing SFBT to CBT and psychodynamic therapy', isCorrect: false },
        { text: 'Systematic observation and coding of videotaped therapy sessions to identify what effective therapists actually do when therapy works', isCorrect: true },
        { text: 'Meta-analysis of existing brief therapy outcome research by de Shazer\'s graduate research team', isCorrect: false },
        { text: 'Theoretical synthesis of Eriksonian hypnotherapy with cognitive-behavioral principles', isCorrect: false },
      ],
      explanation: 'SFBT was built inductively — de Shazer and Berg watched, coded, and analyzed what worked in actual sessions, rather than deriving a model from existing theory and then testing it.',
    },
    {
      question: 'Which philosophical tradition most directly informs SFBT\'s emphasis on the role of language in shaping therapeutic reality?',
      options: [
        { text: 'Existential phenomenology, particularly the work of Heidegger and Sartre', isCorrect: false },
        { text: 'Behavioral psychology and operant conditioning theory', isCorrect: false },
        { text: 'Social constructionism, including influences from Wittgenstein, Berger and Luckmann, and Gergen', isCorrect: true },
        { text: 'Classical psychoanalysis and object relations theory', isCorrect: false },
      ],
      explanation: 'Social constructionism holds that meaning and reality are co-created through language and social interaction. For SFBT, this means that how problems are talked about shapes what seems possible as a solution — and that changing the conversation can change the client\'s experienced reality.',
    },
    {
      question: 'De Shazer\'s statement that "the solution is not the opposite of the problem" most directly challenges which therapeutic assumption?',
      options: [
        { text: 'That therapy should be conducted in a warm, empathic relational context', isCorrect: false },
        { text: 'That fully understanding and eliminating the problem is necessary and sufficient for producing a solution', isCorrect: true },
        { text: 'That behavioral homework assignments can be useful in therapy', isCorrect: false },
        { text: 'That the therapeutic relationship is a factor in client outcomes', isCorrect: false },
      ],
      explanation: 'SFBT\'s core epistemological claim is that problem analysis does not reliably produce solutions. Solutions are built from existing client competencies, exceptions, and goals — which may have no causal relationship to the problem\'s origins or maintaining factors.',
    },
    {
      question: 'A client responds to the miracle question by saying: "I don\'t believe in miracles — that question is ridiculous." The most appropriate SFBT response is:',
      options: [
        { text: 'Explain the therapeutic rationale for the miracle question until the client accepts the frame', isCorrect: false },
        { text: 'Abandon the question and move to a different topic to preserve the alliance', isCorrect: false },
        { text: 'Translate the spirit of the question into accessible language: "Suppose you woke up and things were genuinely better — not perfect, but meaningfully better. What would be the first small sign?"', isCorrect: true },
        { text: 'Document the resistance and attempt to re-introduce the question in session three', isCorrect: false },
      ],
      explanation: 'The clinical function of the miracle question — eliciting a behaviorally specific preferred future — can be preserved even when the specific wording is not workable for a particular client. The spirit of the question, not its exact form, is what matters.',
    },
    {
      question: 'Exception questions in SFBT serve which primary clinical function?',
      options: [
        { text: 'To identify the historical origins of the presenting problem so that root causes can be addressed', isCorrect: false },
        { text: 'To locate within the problem narrative the times when the problem did not occur or was less severe, demonstrating existing client competence', isCorrect: true },
        { text: 'To help clients recognize cognitive distortions that maintain their presenting symptoms', isCorrect: false },
        { text: 'To assess for trauma history that may be underlying the current presentation', isCorrect: false },
      ],
      explanation: 'Exception questions identify the empirical evidence that the client already has some capacity to function differently. This existing competence is the raw material from which SFBT solutions are constructed.',
    },
    {
      question: 'Scaling questions are described as functioning as "exception inquiries in numerical form." This is because:',
      options: [
        { text: 'They use a mathematical framework that is more objective than verbal self-report', isCorrect: false },
        { text: 'The follow-up question "What tells you you\'re at a 4 and not a 2?" invites the client to identify what they are already doing that keeps them above zero', isCorrect: true },
        { text: 'Numerical ratings activate the prefrontal cortex and reduce emotional reactivity', isCorrect: false },
        { text: 'They provide standardized data that can be compared to normative clinical populations', isCorrect: false },
      ],
      explanation: 'The clinical mechanism of scaling questions is not the number itself — it is the follow-up inquiry that asks the client to behaviorally describe what is keeping them at their rated point rather than lower. This is functionally equivalent to an exception question.',
    },
    {
      question: 'Which of the following best describes the Formula First Session Task (FFST)?',
      options: [
        { text: 'A structured worksheet completed by the client before the first session, detailing their problem history and treatment goals', isCorrect: false },
        { text: 'A standard between-session observation assignment asking clients to notice what is already happening that they want to continue, presupposing that positive events are already occurring', isCorrect: true },
        { text: 'A cognitive restructuring exercise assigned after each session to challenge negative automatic thoughts', isCorrect: false },
        { text: 'A mood-tracking diary used to establish a symptom baseline before SFBT interventions begin', isCorrect: false },
      ],
      explanation: 'The FFST is a powerful tool precisely because of what it presupposes: that positive things are already happening and are therefore searchable. It also establishes between-session observation as normative and the client as an active agent in their own change process.',
    },
    {
      question: 'In the visitor-complainant-customer framework, a client who attends sessions because their employer requires it, denies any personal problem, and declines to identify any personal goals is best classified as:',
      options: [
        { text: 'A complainant, because they are physically present in the sessions', isCorrect: false },
        { text: 'A visitor, because they do not perceive a problem that needs solving and are present due to external requirement only', isCorrect: true },
        { text: 'A customer, because voluntary appearance demonstrates at least minimal engagement', isCorrect: false },
        { text: 'Untreatable within an SFBT framework, and should be referred to a more directive approach', isCorrect: false },
      ],
      explanation: 'Visitor-level clients require visitor-appropriate interventions: non-confrontation, light observation tasks, genuine curiosity about their world, and patience for engagement level to evolve naturally. Imposing customer-level interventions on visitors typically sabotages the alliance.',
    },
    {
      question: 'Which of the following most accurately describes the SFBT pre-session change inquiry?',
      options: [
        { text: 'A structured intake form completed between scheduling and the first session to identify client goals', isCorrect: false },
        { text: 'A question asked at the beginning of the first session asking whether anything has already changed for the better since the appointment was made', isCorrect: true },
        { text: 'A between-session check-in call made by the clinician to assess client safety', isCorrect: false },
        { text: 'An observation the clinician makes about the client\'s demeanor before the formal session begins', isCorrect: false },
      ],
      explanation: 'Research by Weiner-Davis et al. (1987) found that approximately two-thirds of clients reported positive pre-session changes when directly asked. Amplifying these changes in the first session establishes early that positive movement is already underway.',
    },
    {
      question: 'A community mental health clinician uses SFBT\'s de-emphasis on problem history to justify skipping a suicide risk assessment with a client expressing passive suicidal ideation. This represents:',
      options: [
        { text: 'Sound SFBT practice, as problem-focused inquiry would only amplify the client\'s distress', isCorrect: false },
        { text: 'A misapplication of SFBT — standard safety assessment is conducted within the SFBT frame, not bypassed by it', isCorrect: true },
        { text: 'An acceptable adaptation of the model for community mental health settings where time is limited', isCorrect: false },
        { text: 'A legitimate clinical judgment call based on the therapeutic alliance quality', isCorrect: false },
      ],
      explanation: 'SFBT\'s de-emphasis on problem history refers to causal problem analysis in service of conceptualization — it does not authorize clinicians to skip safety assessment, trauma screening, or other clinical obligations. These proceed within the SFBT frame, integrated with solution-focused questioning.',
    },
    {
      question: 'SFBT\'s "not-knowing" stance, associated with Harlene Anderson\'s work, requires the therapist to:',
      options: [
        { text: 'Withhold all clinical knowledge from the session to avoid influencing the client\'s narrative', isCorrect: false },
        { text: 'Suspend the expert position regarding what the client\'s problem means and what the solution should look like, while applying clinical knowledge in service of the client\'s own goals', isCorrect: true },
        { text: 'Decline to share clinical observations or hypotheses under any circumstances', isCorrect: false },
        { text: 'Accept all client self-reports without critical clinical evaluation', isCorrect: false },
      ],
      explanation: 'Not-knowing is a relational stance, not an absence of clinical competence. The clinician does not presume to know what the client\'s goals should be or what the problem means before the client has defined it — but clinical knowledge about safety, trauma, and community resources is applied in service of the client\'s stated goals.',
    },
    {
      question: 'Research by Gingerich and Peterson (2013) reviewed 43 controlled outcome studies of SFBT and found:',
      options: [
        { text: 'SFBT was significantly less effective than CBT for anxiety and depressive disorders', isCorrect: false },
        { text: 'SFBT produced positive effects for diverse presenting problems, with several studies finding no significant difference in outcomes between brief (four to six sessions) and longer SFBT treatment', isCorrect: true },
        { text: 'SFBT was effective only when delivered in formats of twelve or more sessions', isCorrect: false },
        { text: 'SFBT showed positive effects only for relationship-focused presenting problems, not for individual symptom reduction', isCorrect: false },
      ],
      explanation: 'The Gingerich and Peterson meta-analysis is one of the most comprehensive reviews of SFBT outcome research. Its finding that brief delivery (four to six sessions) produced comparable outcomes to longer SFBT has direct implications for community mental health, where session limits are a structural reality.',
    },
    {
      question: 'Coping questions are most clinically valuable in which of the following contexts?',
      options: [
        { text: 'With highly motivated customers who have clearly identified goals and consistent treatment engagement', isCorrect: false },
        { text: 'With clients in extreme distress or crisis who report that nothing has ever worked, redirecting to survival competence and agency', isCorrect: true },
        { text: 'As a replacement for the miracle question with clients who have difficulty with hypothetical scenarios', isCorrect: false },
        { text: 'During the compliment phase to validate client progress made between sessions', isCorrect: false },
      ],
      explanation: 'Coping questions ("How have you managed to keep going despite everything?") locate agency within the client\'s response to adversity rather than their ability to eliminate the problem. They are particularly useful in crisis presentations and with clients experiencing complex, chronic difficulties.',
    },
    {
      question: 'Which of the following represents an authentic SFBT compliment, as opposed to generic praise?',
      options: [
        { text: '"You\'re doing really well — keep it up!"', isCorrect: false },
        { text: '"I noticed that when you described what you want for your children, your voice became more certain — that clarity tells me this goal is something real for you that we can build on."', isCorrect: true },
        { text: '"It\'s great that you came today."', isCorrect: false },
        { text: '"You have a lot of strengths that will help you through this difficult time."', isCorrect: false },
      ],
      explanation: 'SFBT compliments are specific, evidence-based, and tied to the client\'s own goals. They reflect what the clinician has actually observed, name the client strength it demonstrates, and connect to the therapeutic direction — functioning as a validated reflection of the client\'s competence rather than generic encouragement.',
    },
    {
      question: 'In SFBT, the goal-setting process produces goals described in terms of "the presence of something rather than the absence of a problem." An example of this principle applied correctly is:',
      options: [
        { text: '"I want to stop drinking" → goal accepted and explored as stated', isCorrect: false },
        { text: '"I want to stop drinking" → reframed as "What would you be doing instead? What would your mornings look like when you\'re not drinking?"', isCorrect: true },
        { text: '"I want to feel less depressed" → reframed as "Let\'s explore the causes of your depression so we can address them systematically"', isCorrect: false },
        { text: '"I want to manage my anxiety" → accepted and translated into a cognitive restructuring plan', isCorrect: false },
      ],
      explanation: 'Positive goal framing in SFBT identifies the target behaviors and states that the client is moving toward — not just what they want to move away from. "What would you be doing instead?" generates the behavioral specifics that guide exception-finding and task assignment.',
    },
    {
      question: 'A client with schizophrenia who has been in community mental health services for five years responds to the miracle question with difficulty. The most appropriate SFBT adaptation is:',
      options: [
        { text: 'Determine that SFBT is contraindicated for this client and refer to a more directive, skill-building approach', isCorrect: false },
        { text: 'Simplify the scope and language: "If things were just a little better for you, what would that look like?" — adjusting goals to match the client\'s current functional level without becoming paternalistic about what is possible', isCorrect: true },
        { text: 'Administer the miracle question exactly as scripted, as any modification would compromise SFBT fidelity', isCorrect: false },
        { text: 'Replace SFBT with a psychoeducational approach focusing on symptom management', isCorrect: false },
      ],
      explanation: 'SFBT is adaptable to SPMI clients through pacing, simplified language, and scoped goals — but the clinician must avoid becoming paternalistic about what is possible. The core stance — client expertise, resource amplification, exception-finding — remains intact even when the specific technique must be simplified.',
    },
    {
      question: 'The term "solution-forced therapy," coined by Lipchik (2002), refers to:',
      options: [
        { text: 'A highly directive SFBT variant used with mandated clients who refuse to engage voluntarily', isCorrect: false },
        { text: 'An approach that deploys solution-focused techniques while actually operating from a problem-focused epistemology — using solution-talk to steer clients away from pain rather than to amplify existing competence', isCorrect: true },
        { text: 'A time-limited treatment format in which clients must achieve their goals within a fixed session count or treatment is terminated', isCorrect: false },
        { text: 'The MRI brief therapy technique of prescribing paradoxical solutions to problem-maintaining sequences', isCorrect: false },
      ],
      explanation: '"Solution-forced therapy" is Lipchik\'s critique of SFBT misapplication in which the techniques are used to avoid acknowledging client pain, rush to positivity prematurely, or bypass necessary clinical assessment — distorting the model\'s genuine strength-based orientation into a performance of optimism that fails clients.',
    },
  ],
  },

  // ── REFERENCES ─────────────────────────────────────────────────────────────
  references: [
    'Berg, I. K. (1994). <em>Family-based services: A solution-focused approach</em>. Norton.',
    'Berg, I. K., & Kelly, S. (2000). <em>Building solutions in child protective services</em>. Norton.',
    'Berg, I. K., & Miller, S. D. (1992). <em>Working with the problem drinker: A solution-focused approach</em>. Norton.',
    'de Shazer, S. (1985). <em>Keys to solution in brief therapy</em>. Norton.',
    'de Shazer, S. (1988). <em>Clues: Investigating solutions in brief therapy</em>. Norton.',
    'de Shazer, S. (1991). <em>Putting difference to work</em>. Norton.',
    'de Shazer, S. (1994). <em>Words were originally magic</em>. Norton.',
    'de Shazer, S., Berg, I. K., Lipchik, E., Nunnally, E., Molnar, A., Gingerich, W., & Weiner-Davis, M. (1986). Brief therapy: Focused solution development. <em>Family Process, 25</em>(2), 207–221. https://doi.org/10.1111/j.1545-5300.1986.00207.x',
    'Franklin, C., Zhang, A., Froerer, A., & Johnson, S. (2017). Solution focused brief therapy: A systematic review and meta-summary of process research. <em>Journal of Marital and Family Therapy, 43</em>(1), 16–30. https://doi.org/10.1111/jmft.12193',
    'Gingerich, W. J., & Peterson, L. T. (2013). Effectiveness of solution-focused brief therapy: A systematic qualitative review of controlled outcome studies. <em>Research on Social Work Practice, 23</em>(3), 266–283. https://doi.org/10.1177/1049731512470859',
    'Kim, J. S. (2008). Examining the effectiveness of solution-focused brief therapy: A meta-analysis. <em>Research on Social Work Practice, 18</em>(2), 107–116. https://doi.org/10.1177/1049731507307807',
    'Lipchik, E. (2002). <em>Beyond technique in solution-focused therapy: Working with emotions and the therapeutic relationship</em>. Guilford Press.',
    'Macdonald, A. J. (2011). <em>Solution-focused therapy: Theory, research and practice</em> (2nd ed.). Sage Publications.',
    'Miller, S. D., Duncan, B. L., & Hubble, M. A. (1997). <em>Escape from Babel: Toward a unifying language for psychotherapy practice</em>. Norton.',
    'Stams, G. J., Dekovic, M., Buist, K., & de Vries, L. (2006). Effectiviteit van oplossingsgerichte korte therapie: Een meta-analyse. <em>Gedragstherapie, 39</em>(2), 81–95.',
    'Weiner-Davis, M., de Shazer, S., & Gingerich, W. J. (1987). Building on pretreatment change to construct the therapeutic solution: An exploratory study. <em>Journal of Marital and Family Therapy, 13</em>(4), 359–363. https://doi.org/10.1111/j.1752-0606.1987.tb00717.x',
    'Wittgenstein, L. (1953). <em>Philosophical investigations</em> (G. E. M. Anscombe, Trans.). Blackwell. (Original work published 1945)',
    'Arkowitz, H., & Miller, W. R. (2008). Learning, applying, and extending motivational interviewing. In H. Arkowitz, H. A. Westra, W. R. Miller, & S. Rollnick (Eds.), <em>Motivational interviewing in the treatment of psychological problems</em> (pp. 1–25). Guilford Press.',
    'Ferraz, H., & Wellman, N. (2008). The integration of solution-focused brief therapy principles in nursing: A literature review. <em>Journal of Psychiatric and Mental Health Nursing, 15</em>(1), 37–44. https://doi.org/10.1111/j.1365-2850.2007.01189.x',
  ],

  // ── RESOURCES ──────────────────────────────────────────────────────────────
  resources: [
    {
      title: 'Solution-Focused Brief Therapy Association (SFBTA)',
      url: 'https://www.sfbta.org',
      type: 'website',
      description: 'Primary professional organization for SFBT practitioners worldwide; training standards, practitioner directory, fidelity tools, and the official SFBT Treatment Manual.',
    },
    {
      title: 'SAMHSA Evidence-Based Practices Resource Center',
      url: 'https://www.samhsa.gov/resource-search/ebp',
      type: 'website',
      description: 'Federal repository of implementation guides and outcome research for evidence-based practices in community mental health settings.',
    },
    {
      title: 'Journal of Solution-Focused Practices',
      url: 'https://digitalscholarship.unlv.edu/journalsfp/',
      type: 'website',
      description: 'Peer-reviewed open-access journal publishing SFBT research and clinical applications across diverse settings.',
    },
    {
      title: 'Brief Family Therapy Center Resources',
      url: 'https://www.bftc.us',
      type: 'website',
      description: 'Archives, case transcripts, and foundational papers from de Shazer and Berg\'s original SFBT development site.',
    },
    {
      title: 'Community Mental Health Journal',
      url: 'https://link.springer.com/journal/10597',
      type: 'website',
      description: 'Peer-reviewed journal focused on mental health service delivery in community settings, including brief therapy outcome research with underserved populations.',
    },
    {
      title: 'NBCC Continuing Education — Solution-Focused Resources',
      url: 'https://www.nbcc.org',
      type: 'website',
      description: 'National Board for Certified Counselors professional development, ethics guidelines, and CE approval resources for NCCs practicing SFBT.',
    },
    {
      title: 'Gingerich & Peterson (2013) Meta-Analysis — Full Text via ResearchGate',
      url: 'https://www.researchgate.net/publication/258043136',
      type: 'document',
      description: 'The most comprehensive systematic review of SFBT controlled outcome studies (43 studies), foundational for evidence-based justification of SFBT in community mental health.',
    },
  ],
};

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('Connected.');

  // Normalize order on sections/contentBlocks — required by schema, and the
  // model's pre('save') autofill runs AFTER validation so it can't rescue this.
  (course.sections || []).forEach((sec, si) => {
    if (sec.order === undefined || sec.order === null) sec.order = si;
    (sec.contentBlocks || []).forEach((blk, bi) => {
      if (blk && (blk.order === undefined || blk.order === null)) blk.order = bi;
    });
  });

  // Validate
  const errors = validate(course);
  if (errors.length) {
    console.error('Validation errors:');
    errors.forEach(e => console.error('  ✗', e));
    process.exit(1);
  }
  console.log('  Validation passed.');

  // Check for existing
  const existing = await InteractiveCourse.findOne({ slug: course.slug });
  if (existing) {
    console.log(`Course ${course.slug} already exists (id: ${existing._id}). Updating...`);
    existing.set(course);
    await existing.save();
    console.log('Updated successfully.');
  } else {
    const doc = new InteractiveCourse(course);
    await doc.save();
    console.log(`Inserted new course: ${doc._id}`);
  }

  await mongoose.disconnect();
  console.log('Done. Disconnected from MongoDB.');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
