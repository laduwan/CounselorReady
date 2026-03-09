/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
#!/usr/bin/env node
/**
 * seedDBTCourseFixed.js
 * Seeds DBT course to the CORRECT collection: interactivecourses
 * Uses sections[] → contentBlocks[] schema (not modules[])
 * Source content: PDF export of full course
 *
 * Run: node src/scripts/seedDBTCourseFixed.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('❌ MONGODB_URI not set'); process.exit(1); }

const SLUG = 'dbt-skills-training-comprehensive';

const COURSE = {
  title: "Dialectical Behavior Therapy: Foundations, Clinical Applications, and Evidence-Based Integration",
  slug: SLUG,
  courseCode: "CR-501",
  subtitle: "A Comprehensive 6-Hour CE Course for Mental Health Professionals",
  description: "This comprehensive 6-hour continuing education course provides mental health professionals with a thorough understanding of Dialectical Behavior Therapy (DBT). From its theoretical foundations in biosocial theory and dialectical philosophy to practical applications of the four core skill modules—Mindfulness, Distress Tolerance, Emotion Regulation, and Interpersonal Effectiveness—this course equips clinicians with evidence-based strategies for working with clients who experience emotional dysregulation, self-destructive behaviors, and interpersonal difficulties.",
  ceHours: 6,
  ceuHours: 6,
  ceuEligible: true,
  ceCategory: "Clinical Practice",
  approvingBody: "NBCC",
  approvalNumber: "7760",
  instructor: "GA Integrated Therapeutic Perspectives LLC",
  accessType: "subscription",
  pricingTier: "standard",
  status: "published",
  isPublished: true,
  level: "Intermediate",
  deliveryMethod: "Asynchronous Online",
  objectives: [
    "Articulate the theoretical foundations of DBT, including biosocial theory, dialectical philosophy, and the transaction model of emotion dysregulation",
    "Identify and describe the four core DBT skill modules—Mindfulness, Distress Tolerance, Emotion Regulation, and Interpersonal Effectiveness",
    "Differentiate DBT from standard Cognitive Behavioral Therapy and identify clinical presentations where DBT is indicated",
    "Describe the four components of comprehensive DBT—individual therapy, group skills training, phone coaching, and consultation team",
    "Apply specific DBT techniques to common clinical scenarios in outpatient practice",
    "Evaluate the empirical evidence supporting DBT across multiple diagnostic categories",
    "Analyze limitations, criticisms, and cultural considerations related to DBT implementation"
  ],
  targetAudience: [
    "Licensed Professional Counselors (LPC/LPCC)",
    "Licensed Mental Health Counselors (LMHC)",
    "Licensed Clinical Social Workers (LCSW)",
    "Licensed Marriage and Family Therapists (LMFT)",
    "Psychologists",
    "Psychiatric Nurse Practitioners",
    "Counselors-in-Training under supervision"
  ],
  presenter: {
    name: "Kejuiana Johnson",
    credentials: "MA, LPC, NCC, CPCS, BC-TMH",
    licenseNumber: "LPC009587",
    licenseState: "Georgia"
  },
  conflictOfInterestDisclosure: "The presenter has no conflict of interest to disclose. No commercial support was received for this continuing education activity.",
  references: [
    { title: "Cognitive-behavioral treatment of borderline personality disorder", author: "Linehan, M. M.", year: 1993, source: "Guilford Press" },
    { title: "DBT skills training manual (2nd ed.)", author: "Linehan, M. M.", year: 2015, source: "Guilford Press" },
    { title: "Two-year randomized controlled trial and follow-up of DBT vs therapy by experts", author: "Linehan, M. M., et al.", year: 2006, source: "Archives of General Psychiatry, 63(7), 757–766" },
    { title: "Dialectical behavior therapy for high suicide risk in individuals with BPD", author: "Linehan, M. M., et al.", year: 2015, source: "JAMA Psychiatry, 72(5), 475–482" },
    { title: "A randomized trial of DBT versus general psychiatric management for BPD", author: "McMain, S. F., et al.", year: 2009, source: "American Journal of Psychiatry, 166(12), 1365–1374" },
    { title: "Putting feelings into words: Affect labeling disrupts amygdala activity", author: "Lieberman, M. D., et al.", year: 2007, source: "Psychological Science, 18(5), 421–428" },
    { title: "A biosocial developmental model of borderline personality", author: "Crowell, S. E., Beauchaine, T. P., & Linehan, M. M.", year: 2009, source: "Psychological Bulletin, 135(3), 495–510" },
    { title: "Dialectical behavior therapy is effective for the treatment of suicidal behavior: A meta-analysis", author: "DeCou, C. R., Comtois, K. A., & Landes, S. J.", year: 2019, source: "Behavior Therapy, 50(1), 60–72" },
    { title: "Dialectical behaviour therapy for women with BPD: 12-month randomised clinical trial", author: "Verheul, R., et al.", year: 2003, source: "British Journal of Psychiatry, 182(2), 135–140" },
    { title: "Dialectical behavior therapy adapted for suicidal adolescents", author: "Rathus, J. H., & Miller, A. L.", year: 2002, source: "Suicide and Life-Threatening Behavior, 32(2), 146–157" }
  ],
  settings: {
    passingScore: 80,
    certificateEnabled: true,
    requireEvaluation: true,
    requireAttestation: true
  },

  // ═══════════════════════════════════════════════════
  // SECTIONS
  // ═══════════════════════════════════════════════════
  sections: [

    // ─── SECTION 1: Introduction and Course Overview ──────────────────────
    {
      title: "Introduction and Course Overview",
      description: "Foundations of DBT, course structure, and learning goals",
      order: 1,
      estimatedTime: 35,
      contentBlocks: [
        {
          type: "text",
          order: 1,
          textContent: `<h2>Welcome to the Course</h2>
<p>Dialectical Behavior Therapy (DBT) has become one of the most widely researched and implemented psychotherapeutic treatments in the mental health field. Originally developed by Marsha M. Linehan in the late 1980s and early 1990s at the University of Washington, DBT was created to address a clinical problem that had long frustrated therapists: the treatment of chronically suicidal individuals, particularly those diagnosed with Borderline Personality Disorder (BPD). What emerged from that effort was not simply a new set of therapeutic techniques, but an entirely new framework for understanding emotional suffering and for balancing the seemingly contradictory therapeutic goals of acceptance and change.</p>
<p>This six-hour continuing education course is designed for licensed mental health professionals who wish to develop a thorough, clinically grounded understanding of DBT. Whether you are encountering DBT for the first time or deepening knowledge you have acquired through previous training, this course will provide you with the theoretical foundations, practical skills, and evidence-based context you need to integrate DBT-informed strategies into your clinical practice.</p>
<p>The course has been developed in accordance with the standards of the National Board for Certified Counselors (NBCC) Approved Continuing Education Provider (ACEP) program, and successful completion will earn you six continuing education credits. Throughout this course, you will engage with interactive content including clinical vignettes, decision-point exercises, accordion panels with detailed explanations, knowledge check questions with rationales, matching exercises, and reflective prompts.</p>
<p>Research in adult learning consistently demonstrates that interactive engagement with material produces superior retention and transfer compared to passive reading alone. Accordingly, you are encouraged to take your time with each module, expand every accordion panel, consider each reflection prompt carefully, and attempt all knowledge checks before reviewing the explanations provided.</p>
<h2>The Clinical Problem DBT Was Designed to Solve</h2>
<p>To fully appreciate DBT, it is essential to understand the clinical problem it was designed to solve. In the 1970s and 1980s, individuals with Borderline Personality Disorder were widely regarded as among the most difficult clients to treat. Standard cognitive-behavioral interventions frequently proved insufficient, and many therapists found themselves caught in a painful cycle: pushing for behavioral change triggered emotional crises in clients, while focusing solely on validation and acceptance failed to produce meaningful progress. Dropout rates were extraordinarily high, therapist burnout was endemic, and the therapeutic relationship itself often became a source of distress for both parties.</p>
<p>Marsha Linehan, then a young researcher at the University of Washington, began experimenting with standard CBT approaches for chronically suicidal women. She quickly discovered that a purely change-oriented approach was experienced by clients as invalidating—as if the therapist were saying that the client's pain was not real or not important. But when Linehan shifted to a purely acceptance-oriented approach, clients felt validated but made no behavioral progress.</p>
<p>The core insight that would eventually define DBT emerged from this clinical impasse: effective treatment required both acceptance AND change, held simultaneously in dialectical tension. This insight drew Linehan to the philosophical tradition of dialectics—the idea that reality is composed of opposing forces that can be synthesized into a higher truth—and to the contemplative practices of Zen Buddhism, which emphasize radical acceptance of the present moment. By integrating these perspectives with the empirical rigor of cognitive-behavioral therapy, Linehan created a treatment that could validate a client's experience of unbearable suffering while simultaneously teaching them the skills to build a life worth living.</p>
<h2>DBT in the Contemporary Mental Health Landscape</h2>
<p>Since its initial development in the early 1990s, DBT has grown from a specialized treatment for a single disorder into one of the most widely practiced evidence-based psychotherapies in the world. The treatment has been adapted for use with adolescents, older adults, forensic populations, individuals with intellectual disabilities, and clients presenting with a wide range of conditions beyond BPD, including eating disorders, substance use disorders, treatment-resistant depression, and post-traumatic stress disorder.</p>
<p>DBT programs now operate in virtually every type of clinical setting, from private practices to state psychiatric hospitals, from university counseling centers to veterans' affairs medical centers, and from community mental health agencies to correctional facilities. For practicing clinicians, this expanding landscape presents both opportunities and challenges. The opportunities are clear: DBT offers a powerful set of tools for working with some of the most distressed and difficult-to-treat clients in mental health care.</p>`
        },
        {
          type: "accordion",
          order: 2,
          title: "Course Overview",
          accordionItems: [
            {
              title: "Who Is This Course For?",
              content: "This course is designed for a broad audience of mental health professionals, including Licensed Professional Counselors (LPCs), Licensed Clinical Social Workers (LCSWs), Licensed Marriage and Family Therapists (LMFTs), Psychologists, Psychiatric Nurse Practitioners, and counselors-in-training under supervision. You do not need prior DBT training to benefit from this course, though professionals with some exposure to DBT concepts may find that the course deepens and contextualizes their existing knowledge in valuable ways. The clinical skills and conceptual frameworks presented are applicable across private practice, community mental health, intensive outpatient programs, inpatient psychiatric units, residential treatment facilities, and school-based counseling settings."
            },
            {
              title: "Course Format and Requirements",
              content: "This asynchronous online course consists of 9 content sections with embedded knowledge checks, reflection exercises, and a comprehensive 20-question final assessment. You must achieve 80% or higher on the final assessment to receive CE credit. You have up to 3 attempts. Estimated completion time is 6 hours. All content sections must be completed before the final exam becomes available."
            },
            {
              title: "Important Note on Course Scope",
              content: "This course provides a comprehensive overview of DBT and equips you with foundational knowledge and DBT-informed clinical strategies. It does not constitute DBT-intensive training or certification. Clinicians who wish to identify themselves as DBT therapists or to implement a comprehensive DBT program should pursue additional training through organizations such as Behavioral Tech, LLC, or seek certification through the DBT-Linehan Board of Certification (DBT-LBC)."
            },
            {
              title: "How to Get the Most from This Course",
              content: "Expand every accordion panel — they contain clinical nuances not covered in the main text. Attempt all knowledge checks before reading the rationale. Pause at each reflection prompt and apply the material to a specific client on your current caseload. Take notes on the skills you want to begin integrating immediately. The goal is not just to pass the assessment but to walk away with concrete strategies you can use in your next session."
            }
          ]
        },
        {
          type: "multipleChoice",
          order: 3,
          question: "DBT was originally developed to address which clinical problem?",
          options: [
            "The lack of effective treatments for generalized anxiety disorder",
            "Treatment of chronically suicidal individuals, particularly those with Borderline Personality Disorder",
            "Medication management for clients with bipolar disorder",
            "The absence of group therapy models in community mental health settings"
          ],
          correctAnswer: 1,
          explanation: "DBT was specifically developed by Marsha Linehan in the late 1980s to treat chronically suicidal individuals with BPD, a population for whom standard CBT proved insufficient. The core problem was that change-focused interventions felt invalidating while purely acceptance-based approaches failed to produce behavioral progress.",
          showExplanation: true
        },
        {
          type: "multipleChoice",
          order: 4,
          question: "Which three intellectual traditions does DBT integrate?",
          options: [
            "Psychoanalysis, humanistic therapy, and narrative therapy",
            "Cognitive-behavioral therapy, dialectical philosophy, and Zen Buddhist contemplative practices",
            "Gestalt therapy, existentialism, and positive psychology",
            "Acceptance and Commitment Therapy, EMDR, and motivational interviewing"
          ],
          correctAnswer: 1,
          explanation: "DBT integrates cognitive-behavioral therapy (its empirical foundation), dialectical philosophy (the idea that opposing truths can be synthesized), and Zen Buddhist contemplative practices (particularly radical acceptance and mindfulness). This integration is what distinguishes DBT from standard CBT.",
          showExplanation: true
        },
        {
          type: "reflection",
          order: 5,
          question: "Consider your current caseload and clinical setting. Which client presentations do you encounter that involve significant emotional dysregulation? As you begin this course, what specific knowledge or skills are you hoping to develop that would enhance your effectiveness with these clients? Take a moment to identify two or three specific learning goals that you can revisit as you progress through the modules."
        }
      ]
    },

    // ─── SECTION 2: Biosocial Theory and the Dialectical Worldview ────────
    {
      title: "Biosocial Theory and the Dialectical Worldview",
      description: "The theoretical foundations underlying all of DBT",
      order: 2,
      estimatedTime: 45,
      contentBlocks: [
        {
          type: "text",
          order: 1,
          textContent: `<h2>Biosocial Theory: The Cornerstone of DBT</h2>
<p>Biosocial theory is the cornerstone of DBT's understanding of how emotional dysregulation develops and persists. The theory is deceptively simple in its core claim: emotional dysregulation arises from the transaction between a biological predisposition toward emotional vulnerability and an invalidating social environment. Neither factor alone is sufficient to produce the pervasive patterns of emotional, behavioral, cognitive, and interpersonal dysregulation that characterize conditions like Borderline Personality Disorder. It is the ongoing interaction—the transaction—between these two factors that creates and maintains the clinical picture.</p>
<p>Understanding biosocial theory is not merely an academic exercise. It directly informs how DBT therapists conceptualize their clients' difficulties, how they communicate with clients about the origins of their suffering, and how they structure treatment. When a DBT therapist explains biosocial theory to a client, the explanation itself serves a powerful validating function: it communicates that the client's emotional pain is not their fault, that it has identifiable causes, and that those causes can be addressed through the development of specific skills.</p>
<h2>The Biological Component: Emotional Vulnerability</h2>
<p>The biological side of biosocial theory refers to a constitutional predisposition toward emotional vulnerability. Linehan identifies three defining characteristics of emotional vulnerability, each of which has been supported by subsequent neurobiological research:</p>
<p><strong>High Sensitivity to Emotional Stimuli:</strong> Emotionally vulnerable individuals detect and react to emotional cues at lower thresholds than others. They notice subtle shifts in tone of voice, facial expression, and interpersonal dynamics that others might miss entirely. In neurobiological terms, this reflects heightened amygdala reactivity—the brain's threat detection system fires more readily and intensely.</p>
<p><strong>High Reactivity:</strong> Once an emotional response is triggered, it occurs with greater intensity than would be expected given the precipitating event. This distinction is crucial: the intensity of the emotional response is not evidence of pathology or irrationality—it is the natural consequence of a nervous system that is biologically calibrated to produce strong emotional signals.</p>
<p><strong>Slow Return to Emotional Baseline:</strong> After an intense emotional response, the emotionally vulnerable individual takes significantly longer to return to their baseline emotional state. This slow return means that new emotional provocations are often layered on top of still-active prior emotional responses, creating a cumulative emotional burden that can feel overwhelming and unmanageable.</p>
<h2>The Social Component: The Invalidating Environment</h2>
<p>The second element of biosocial theory is the invalidating environment. An invalidating environment is one in which the individual's private experiences—their emotions, thoughts, sensations, and beliefs—are persistently dismissed, minimized, punished, or responded to erratically. Linehan identifies several specific patterns of invalidation that are particularly damaging when they interact with biological emotional vulnerability:</p>
<ul>
<li>The direct dismissal of emotional experience: telling a child who is crying that they have nothing to cry about</li>
<li>The intermittent reinforcement of extreme emotional expression: responding only to escalated or crisis-level behavior</li>
<li>The oversimplification of problem-solving: communicating that emotional problems are easy to solve</li>
</ul>
<p>It is essential to understand that the concept of the invalidating environment does not assign blame to families or caregivers. Many invalidating environments arise from caregivers who are doing their best with limited resources, limited understanding of emotional sensitivity, or their own histories of invalidation. Cultural context also plays a significant role—cultural norms around emotional expression, gender expectations, and family communication patterns can all create invalidating dynamics for emotionally vulnerable individuals.</p>`
        },
        {
          type: "multipleChoice",
          order: 2,
          question: "According to biosocial theory, emotional dysregulation results from which of the following?",
          options: [
            "A biological predisposition toward emotional vulnerability alone",
            "An invalidating social environment alone",
            "The ongoing transaction between biological emotional vulnerability and an invalidating social environment",
            "Genetic inheritance of personality disorder traits"
          ],
          correctAnswer: 2,
          explanation: "Biosocial theory specifically holds that neither biological vulnerability nor environmental invalidation alone is sufficient. It is the ongoing transaction—the continuous interaction between the two factors over time—that creates and maintains pervasive emotional dysregulation.",
          showExplanation: true
        },
        {
          type: "text",
          order: 3,
          textContent: `<h2>The Dialectical Worldview</h2>
<p>The second theoretical pillar of DBT is dialectical philosophy. While biosocial theory explains the origins of emotional dysregulation, dialectics provides the overarching philosophical framework that shapes every aspect of how DBT is delivered. The word "dialectical" in Dialectical Behavior Therapy is not decorative—it refers to a specific philosophical tradition with direct, practical implications for clinical work.</p>
<p>At its most basic level, dialectics rests on three core principles:</p>
<p><strong>Reality is interconnected and whole.</strong> Nothing exists in isolation; everything is part of a larger system, and changes in any part of the system affect every other part. In clinical terms, the client's behavior cannot be understood outside the context of their relationships, environment, biology, and history.</p>
<p><strong>Reality is composed of opposing forces.</strong> Every truth contains its opposite, and every position exists in tension with its counterpart. The client is doing the best they can AND they need to do better. These are not contradictions to be resolved—they are tensions to be held, understood, and synthesized.</p>
<p><strong>The synthesis of opposing forces produces change.</strong> When a thesis encounters its antithesis, the resulting tension creates the potential for a synthesis. This synthesis then becomes a new thesis that will eventually encounter its own antithesis, producing ongoing growth and transformation. Change, in the dialectical view, is not a destination but a continuous process.</p>
<h2>The Three Primary Dialectics in DBT</h2>
<p>In DBT, three dialectics are particularly central to the treatment. The most fundamental is the dialectic of <strong>acceptance and change</strong>: the simultaneous validation that the client is doing the best they can while insisting that they need to do better to build a life worth living. The second is the dialectic of <strong>flexibility and stability</strong>: the treatment must be responsive enough to meet each client's individual needs while structured enough to maintain therapeutic focus. The third is <strong>nurturing and demanding</strong>: the therapist must provide genuine care and support while also firmly setting limits on behaviors that undermine treatment.</p>
<h2>Dialectical Dilemmas</h2>
<p>Linehan identified three specific dialectical dilemmas—pairs of opposing behavioral extremes—that are commonly observed in individuals with pervasive emotional dysregulation. The first dilemma is <strong>emotional vulnerability versus self-invalidation</strong>. On one extreme, the individual is overwhelmed by emotional reactions; on the other, they swing to self-invalidation and judge their emotions as excessive or irrational.</p>
<p>The second dilemma is <strong>active passivity versus apparent competence</strong>. Active passivity describes approaching problems helplessly—demanding others solve one's problems rather than engaging in active problem-solving. Apparent competence is the opposite—presenting a facade of capability that masks internal overwhelm.</p>
<p>The third dilemma is <strong>unrelenting crisis versus inhibited grieving</strong>. Unrelenting crisis describes moving from one crisis to the next without respite. Inhibited grieving is the systematic avoidance of painful emotional experiences through distraction, dissociation, or behavioral avoidance.</p>`
        },
        {
          type: "multipleChoice",
          order: 4,
          question: "Which of the following best illustrates a dialectical therapeutic response to a client who says, 'Nothing I do matters—I'll never get better'?",
          options: [
            "'Let's look at the evidence for and against that belief.'",
            "'I understand how much pain you're in right now.'",
            "'I hear how much pain you're in, AND the fact that you're here talking to me is itself evidence that some part of you is still reaching for change.'",
            "'You shouldn't think that way—you have made progress.'"
          ],
          correctAnswer: 2,
          explanation: "A dialectical response synthesizes both validation and change simultaneously—it acknowledges the pain as real while also honoring the evidence of the client's continued effort. This is the hallmark of dialectical therapeutic communication: holding two truths at once rather than choosing one side.",
          showExplanation: true
        },
        {
          type: "multipleChoice",
          order: 5,
          question: "Which of the following statements about the invalidating environment is most consistent with biosocial theory?",
          options: [
            "Invalidating environments are always the result of intentional parental neglect or abuse",
            "Invalidating environments only affect individuals with biological emotional vulnerability",
            "Invalidating environments arise from caregivers who may be well-intentioned but lack understanding of emotional sensitivity",
            "Cultural factors are irrelevant to the concept of invalidating environments"
          ],
          correctAnswer: 2,
          explanation: "Biosocial theory is explicit that the invalidating environment does not require malicious intent. Many invalidating environments arise from caregivers doing their best with limited understanding of emotional sensitivity. Cultural norms also play a significant role in defining what constitutes invalidation.",
          showExplanation: true
        },
        {
          type: "reflection",
          order: 6,
          question: "Consider a client you have worked with (or a hypothetical client) who exhibits significant emotional dysregulation. Using the biosocial model, how would you conceptualize their difficulties? Can you identify aspects of both biological vulnerability (high sensitivity, high reactivity, slow return to baseline) and environmental invalidation in their history? How might sharing this conceptualization with the client serve a therapeutic function?"
        }
      ]
    },

    // ─── SECTION 3: The Structure of Comprehensive DBT ────────────────────
    {
      title: "The Structure of Comprehensive DBT",
      description: "The four components of comprehensive DBT and the treatment target hierarchy",
      order: 3,
      estimatedTime: 40,
      contentBlocks: [
        {
          type: "text",
          order: 1,
          textContent: `<h2>A Multi-Modal Treatment System</h2>
<p>Comprehensive DBT is not a single intervention; it is an integrated treatment system composed of four distinct but interdependent components. Each component serves a specific therapeutic function, and the model was designed so that the components work together synergistically to address the complex needs of clients with pervasive emotion dysregulation.</p>
<p>Standard comprehensive DBT was originally designed as a one-year outpatient treatment program. During this year, clients typically attend weekly individual therapy sessions (approximately 50–60 minutes), weekly group skills training sessions (approximately 2–2.5 hours), and have access to between-session phone coaching with their individual therapist. Simultaneously, therapists participate in a weekly consultation team meeting.</p>
<h2>Component 1: Individual Therapy</h2>
<p>Individual therapy is the primary arena for applying DBT skills to the specific problems in a client's life. Unlike some therapeutic approaches where session content is driven by what the client wants to discuss, DBT individual therapy follows a structured <strong>hierarchy of treatment targets</strong>:</p>
<p><strong>First priority — Life-threatening behaviors:</strong> Suicidal ideation, suicide attempts, self-harm, and homicidal ideation. If a client has engaged in or is at imminent risk of life-threatening behavior, this becomes the session focus regardless of other issues.</p>
<p><strong>Second priority — Therapy-interfering behaviors:</strong> Actions by either the client or the therapist that undermine the therapeutic process. For the client: missing sessions, not completing homework. For the therapist: being unprepared, failing to return calls.</p>
<p><strong>Third priority — Quality-of-life-interfering behaviors:</strong> Substance use, financial mismanagement, unsafe sexual behavior, housing instability, and other patterns preventing the client from building a life worth living.</p>
<p><strong>Fourth priority — Increasing behavioral skills:</strong> Helping the client apply the skills learned in group training to their daily life.</p>
<h2>Component 2: Group Skills Training</h2>
<p>Group skills training is the educational component of DBT. It functions more like a class than traditional group therapy. The skills training group is typically led by two co-facilitators and meets weekly for approximately 2 to 2.5 hours. Over the course of the treatment year, the group cycles through the four core skill modules: Mindfulness, Distress Tolerance, Emotion Regulation, and Interpersonal Effectiveness.</p>
<p>The distinction between skills training and group therapy is important. In DBT skills training, the primary focus is on teaching specific behavioral skills through instruction, modeling, role-play, and homework assignments. Homework is a critical component because behavioral skills cannot be learned through instruction alone—they must be practiced in real-world contexts.</p>
<h2>Component 3: Phone Coaching</h2>
<p>Phone coaching is perhaps the most misunderstood component of comprehensive DBT. It is not crisis counseling, and it is not between-session therapy. Phone coaching is a brief, focused intervention designed to help clients apply DBT skills in the moment when they need them most—during real-life situations that trigger urges toward self-destructive behavior or emotional overwhelm.</p>
<p>A typical phone coaching call lasts 5 to 15 minutes. An important clinical rule is the <strong>24-hour rule</strong>: if a client has engaged in self-harm or other target behaviors, they must wait 24 hours before contacting the therapist for phone coaching. This rule exists to avoid inadvertently reinforcing self-destructive behavior with therapeutic attention. The rule does not apply to genuine suicidal crises.</p>
<h2>Component 4: Therapist Consultation Team</h2>
<p>The therapist consultation team is often the least discussed but arguably the most innovative component of comprehensive DBT. It is the component that treats the therapist, not the client. Linehan recognized early that treating chronically suicidal, emotionally intense clients takes an enormous toll on therapists. Without systematic support, clinicians are at high risk for burnout, compassion fatigue, and loss of therapeutic effectiveness.</p>
<p>The consultation team meets weekly and provides clinical case consultation, emotional support, fidelity monitoring, and burnout prevention. The team operates under agreements that mirror the dialectical stance: all members are doing the best they can and simultaneously need to do better.</p>`
        },
        {
          type: "matching",
          order: 2,
          title: "Match the DBT Component to Its Function",
          matchingInstructions: "Match each DBT treatment component to its primary therapeutic function.",
          matchingPairs: [
            { term: "Individual Therapy", definition: "Structured hierarchy-driven sessions applying skills to personal treatment targets" },
            { term: "Group Skills Training", definition: "Educational format teaching the four core skill modules through instruction and homework" },
            { term: "Phone Coaching", definition: "Brief between-session support for real-time application of skills during crises" },
            { term: "Therapist Consultation Team", definition: "Weekly peer support preventing burnout and maintaining treatment fidelity" }
          ]
        },
        {
          type: "multipleChoice",
          order: 3,
          question: "What is the primary purpose of phone coaching in comprehensive DBT?",
          options: [
            "To conduct crisis counseling and assess suicidal risk between sessions",
            "To provide between-session therapy for unresolved therapeutic issues",
            "To help clients apply DBT skills in real-time during situations that trigger self-destructive urges",
            "To check in on homework completion and diary card recording"
          ],
          correctAnswer: 2,
          explanation: "Phone coaching serves skills generalization — helping clients apply already-learned skills in the moment when they need them most. It is explicitly not crisis counseling or between-session therapy. The calls are brief (5–15 minutes) and highly focused on skill identification and application.",
          showExplanation: true
        },
        {
          type: "multipleChoice",
          order: 4,
          question: "In the DBT treatment target hierarchy, what is always the first priority in individual therapy sessions?",
          options: [
            "Quality-of-life-interfering behaviors such as substance use or relationship problems",
            "Reviewing the diary card and skills homework",
            "Life-threatening behaviors including suicidal ideation and self-harm",
            "Therapy-interfering behaviors such as missed sessions"
          ],
          correctAnswer: 2,
          explanation: "Life-threatening behaviors are always first in the DBT hierarchy. If a client has engaged in suicidal behavior, self-harm, or homicidal behavior since the last session, this becomes the session focus regardless of what other issues are present. This unwavering prioritization communicates that the client's life matters above all other therapeutic goals.",
          showExplanation: true
        },
        {
          type: "multipleChoice",
          order: 5,
          question: "What is the primary function of the therapist consultation team in DBT?",
          options: [
            "To monitor client progress and adjust treatment plans",
            "To supervise interns and unlicensed staff",
            "To treat the therapist — providing support, fidelity monitoring, and burnout prevention",
            "To coordinate billing and administrative functions across the program"
          ],
          correctAnswer: 2,
          explanation: "The consultation team is the component that treats the therapist, not the client. Linehan recognized that clinicians working with severely dysregulated clients are at high risk for burnout. The team provides a validating, structured environment for therapists to process reactions, receive feedback, and maintain dialectical balance in their therapeutic stance.",
          showExplanation: true
        },
        {
          type: "reflection",
          order: 6,
          question: "Consider your current practice setting. Which of the four components of comprehensive DBT would be most feasible for you to implement? Which would face the greatest barriers? If you could only integrate one component into your existing practice, which would you choose and why? Think about how you might adapt DBT principles to work within your current professional constraints while still honoring the therapeutic logic of the model."
        }
      ]
    },

    // ─── SECTION 4: Core Skill Module — Mindfulness ───────────────────────
    {
      title: "Core Skill Module: Mindfulness",
      description: "The foundational skill set of DBT — What and How skills, states of mind",
      order: 4,
      estimatedTime: 45,
      contentBlocks: [
        {
          type: "text",
          order: 1,
          textContent: `<h2>Mindfulness as the Foundation of DBT</h2>
<p>Mindfulness holds a unique position among the four core skill modules of Dialectical Behavior Therapy. It is the first skill module taught in every skills training cycle, and it is revisited at the beginning of every subsequent module rotation. This structural prominence reflects a fundamental clinical conviction: mindfulness is not merely one skill among many—it is the foundation upon which all other DBT skills rest.</p>
<p>Without the capacity for present-moment awareness and non-judgmental observation, clients cannot effectively deploy the distress tolerance techniques that require noticing when they are in crisis, the emotion regulation strategies that depend on accurately identifying emotional states, or the interpersonal effectiveness skills that demand attention to both internal and external cues in social interactions.</p>
<p>Linehan's conceptualization of mindfulness in DBT draws heavily from Zen Buddhist contemplative traditions, but it is thoroughly secularized and operationalized for clinical use. In DBT, mindfulness is not a spiritual practice or a relaxation technique—it is a set of clearly defined behavioral skills that can be taught, practiced, measured, and refined.</p>
<h2>The Three States of Mind</h2>
<p>DBT organizes mindfulness around a central conceptual model: the three states of mind. Understanding these states provides clients with a framework for recognizing where they are at any given moment and for understanding where they want to be.</p>
<p><strong>Reasonable Mind</strong> is the state governed by logic, facts, evidence, and rational analysis. When you are in Reasonable Mind, you approach situations intellectually, weighing pros and cons, analyzing data, and making decisions based on factual information. The limitation of Reasonable Mind is that it can be disconnected from emotional experience, leading to decisions that are logical but fail to account for the emotional realities of a situation.</p>
<p><strong>Emotion Mind</strong> is the state governed by feelings, moods, and emotional impulses. When you are in Emotion Mind, your thinking and behavior are controlled by your current emotional state. Emotions feel like facts—if you feel rejected, the relationship must be over. Emotion Mind is passionate and creative, but its limitation is that it can lead to impulsive, poorly considered actions.</p>
<p><strong>Wise Mind</strong> is the synthesis of Reasonable Mind and Emotion Mind—the dialectical integration of logic and emotion. Wise Mind is the state in which a person can access both their rational understanding and their emotional experience, honoring both without being dominated by either. Linehan describes Wise Mind as the "still, calm place" within each person that knows what is true and what is needed. In clinical terms, Wise Mind is the state from which effective, values-consistent decisions are made.</p>`
        },
        {
          type: "multipleChoice",
          order: 2,
          question: "A client arrives at session furious about a conflict with their partner and says, 'I'm done. I'm going to pack my bags tonight.' Which state of mind is the client most likely operating from?",
          options: [
            "Reasonable Mind — they have analyzed the relationship and made a logical decision",
            "Wise Mind — they are honoring both their emotions and their values",
            "Emotion Mind — their current emotional state is controlling their thinking and decision-making",
            "Reflective Mind — they are processing the situation before acting"
          ],
          correctAnswer: 2,
          explanation: "The client is in Emotion Mind — their intense anger is driving an impulsive decision. In Emotion Mind, emotions feel like facts ('I'm done' feels certain and true) and action urges feel like reasonable plans. The therapeutic response would be to validate the pain while helping the client access Wise Mind before making major decisions.",
          showExplanation: true
        },
        {
          type: "text",
          order: 3,
          textContent: `<h2>The 'What' Skills: Observe, Describe, Participate</h2>
<p>DBT organizes mindfulness skills into two categories: "What" skills (what you do when practicing mindfulness) and "How" skills (how you do it). The three "What" skills are Observe, Describe, and Participate.</p>
<p><strong>Observe</strong> means to notice your experience without reacting to it. It is the skill of paying attention—to sensations in your body, to thoughts as they arise and pass, to emotions as they emerge. Observing is fundamentally different from thinking about your experience. For individuals with high emotional vulnerability, the skill of observing is particularly valuable because it creates a microsecond of space between stimulus and response—a pause in which choice becomes possible.</p>
<p><strong>Describe</strong> means to put words on your experience. After observing what is happening, you label it accurately and specifically. Instead of saying "I feel terrible," you describe: "I am feeling a combination of sadness and anxiety." Research in affective neuroscience has demonstrated that affect labeling—putting words on feelings—actually reduces amygdala activation and increases prefrontal cortex activity. In other words, naming your emotion literally makes it less intense.</p>
<p><strong>Participate</strong> means to throw yourself fully into the current activity without self-consciousness or internal commentary. Participating is complete engagement with the present moment—not watching yourself from the outside, not evaluating your performance. Athletes call this state "flow" or "being in the zone." Participation is the mindfulness skill that most directly connects to living a full, engaged, meaningful life.</p>
<h2>The 'How' Skills: Non-Judgmentally, One-Mindfully, Effectively</h2>
<p><strong>Non-Judgmentally</strong> means to observe, describe, and participate without evaluating experience as good or bad, right or wrong, fair or unfair. Judgments add a layer of suffering on top of the original experience: not only do you feel anxious, but now you feel bad about feeling anxious. By practicing non-judgment, clients can reduce this secondary layer of suffering.</p>
<p><strong>One-Mindfully</strong> means to focus on one thing at a time, with complete attention. In a culture that valorizes multitasking, one-mindfulness is a radical act. When you are in session with a client, you are fully present with that client—not thinking about your next client, not worrying about documentation.</p>
<p><strong>Effectively</strong> means to do what works in a given situation, rather than what feels "right" or "fair" or "principled." This is often the most provocative of the How skills because it can feel like it asks clients to abandon their values. In fact, it asks them to be strategic about how they pursue their values. Effectiveness is the mindfulness skill that most directly challenges the rigid, black-and-white thinking that characterizes emotional dysregulation.</p>`
        },
        {
          type: "multipleChoice",
          order: 4,
          question: "A client tells their therapist: 'I noticed my jaw clenching when my coworker started talking about the deadline. I felt heat rising in my chest and I had the urge to interrupt.' Which 'What' skill is the client demonstrating?",
          options: [
            "Participate — the client is fully engaged in the work situation",
            "Observe — the client is noticing internal and external experiences without immediately reacting",
            "Describe — the client is labeling their experience in factual, specific language",
            "Effectively — the client is doing what works in the situation"
          ],
          correctAnswer: 1,
          explanation: "The client is demonstrating Observe — noticing physical sensations, emotional states, and action urges without immediately reacting to them. This is the first and foundational What skill: paying attention to experience in real time, creating the space between stimulus and response. Note that they are noticing, not yet labeling (which would be Describe).",
          showExplanation: true
        },
        {
          type: "multipleChoice",
          order: 5,
          question: "Which 'How' skill involves doing what works in a situation rather than doing what feels fair or principled?",
          options: [
            "Non-Judgmentally",
            "One-Mindfully",
            "Effectively",
            "Radically"
          ],
          correctAnswer: 2,
          explanation: "Effectively is the How skill that asks clients to prioritize outcomes over adherence to what feels right or principled. It doesn't mean abandoning values—it means being strategic about how to pursue those values. A client in a custody hearing who feels rage acts effectively by remaining composed, not because their anger is wrong but because composure produces the outcome that matters most.",
          showExplanation: true
        },
        {
          type: "reflection",
          order: 6,
          question: "Think about a recent decision you made in your clinical practice—perhaps a decision about how to respond to a difficult moment in session, whether to adjust a treatment plan, or how to handle a boundary issue. Were you operating from Reasonable Mind, Emotion Mind, or Wise Mind? What would have changed if you had approached the situation from a different state of mind? How might you use the three states of mind framework to help clients understand their own decision-making patterns?"
        }
      ]
    },

    // ─── SECTION 5: Core Skill Module — Distress Tolerance ───────────────
    {
      title: "Core Skill Module: Distress Tolerance",
      description: "Crisis survival skills and reality acceptance skills",
      order: 5,
      estimatedTime: 45,
      contentBlocks: [
        {
          type: "text",
          order: 1,
          textContent: `<h2>The Purpose of Distress Tolerance</h2>
<p>Distress tolerance is the DBT skill module most directly concerned with the management of emotional crises. While emotion regulation skills aim to reduce the frequency and intensity of unwanted emotions over time, distress tolerance skills are designed for the immediate, acute moments when emotional pain feels unbearable and the risk of self-destructive behavior is highest.</p>
<p>The fundamental premise of distress tolerance is that pain is an inevitable part of life, that not all painful situations can be immediately changed or resolved, and that the ability to tolerate distress without making it worse is a critically important skill that can be taught and learned. Distress tolerance skills provide an alternative pathway—a set of strategies that acknowledge the reality of the pain while preventing the escalation of the crisis into a catastrophe.</p>
<p>It is important to understand that distress tolerance is not about eliminating pain, achieving serenity, or learning to enjoy suffering. It is about developing the capacity to experience intense emotional pain without engaging in behaviors that will make the situation worse.</p>
<h2>TIPP Skills: Changing Body Chemistry</h2>
<p>The TIPP skills are the fastest-acting crisis survival strategies in the DBT toolkit. They work by directly altering the body's physiological state, which in turn reduces the intensity of the emotional experience.</p>
<p><strong>Temperature:</strong> Applying cold to the face—particularly submerging the face in cold water or holding a cold pack against the eyes and cheeks for 30 seconds—activates the mammalian dive reflex, which triggers an automatic parasympathetic nervous system response. Heart rate slows, blood pressure adjusts, and the intensity of emotional arousal decreases. This is not a metaphorical calming technique—it is a hardwired physiological response that works reliably across individuals.</p>
<p><strong>Intense Exercise:</strong> Engaging in brief, vigorous physical activity for 10 to 20 minutes metabolizes the stress hormones (cortisol, adrenaline) that are fueling the emotional crisis. The exercise must be intense enough to significantly elevate heart rate. This skill is particularly effective when the emotional crisis involves anger or agitation.</p>
<p><strong>Paced Breathing:</strong> Deliberately slowing the breath to approximately five to six breath cycles per minute (inhaling for about four seconds, exhaling for about six to eight seconds) activates the parasympathetic nervous system and reduces physiological arousal. The emphasis on extending the exhalation is key, as the vagus nerve is primarily stimulated during exhalation.</p>
<p><strong>Progressive Muscle Relaxation:</strong> Systematically tensing and then releasing muscle groups throughout the body produces a physiological relaxation response that is incompatible with the tension and arousal of emotional crisis.</p>
<h2>Reality Acceptance Skills</h2>
<p><strong>Radical Acceptance</strong> is the practice of fully accepting reality as it is in this moment, without fighting it, without denying it, and without judging it as something that should not be. The word "radical" means "at the root"—radical acceptance goes all the way to the root of reality, leaving no part of the truth unacknowledged.</p>
<p>It is important to understand what radical acceptance is NOT: it is not approval, endorsement, or passivity. Refusing to accept reality does not change reality; it only adds a layer of suffering—the suffering of fighting against what has already occurred. Linehan expresses this principle concisely: "Pain plus non-acceptance equals suffering."</p>
<p><strong>Turning the Mind</strong> acknowledges that acceptance is not a one-time decision but an ongoing, repeated choice that must be made again and again. When you find yourself back in non-acceptance, you simply turn the mind again. Each time you turn the mind, you strengthen the neural and behavioral pathways associated with acceptance.</p>
<p><strong>Willingness versus Willfulness:</strong> Willingness is the stance of openness to experience—a readiness to do what is needed in the current moment. Willfulness is the refusal to tolerate the moment, the insistence that reality should be different from what it is. The goal is not to eliminate willfulness but to notice when you have become willful and gently redirect yourself toward willingness.</p>`
        },
        {
          type: "multipleChoice",
          order: 2,
          question: "Which physiological mechanism makes the Temperature skill in TIPP effective for rapidly reducing emotional arousal?",
          options: [
            "It triggers the release of endorphins, which counteract cortisol",
            "It activates the mammalian dive reflex, producing an automatic parasympathetic nervous system response",
            "It distracts attention from emotional pain by creating physical discomfort",
            "It reduces core body temperature, which is associated with decreased anxiety"
          ],
          correctAnswer: 1,
          explanation: "The Temperature skill specifically works by activating the mammalian dive reflex — a hardwired physiological response that automatically slows heart rate and adjusts blood pressure when cold water contacts the face (particularly around the eyes and cheeks). This parasympathetic response directly reduces the physiological arousal that amplifies emotional intensity.",
          showExplanation: true
        },
        {
          type: "multipleChoice",
          order: 3,
          question: "Which of the following best describes the concept of Radical Acceptance in DBT?",
          options: [
            "Approving of painful events and agreeing that they should have happened",
            "Fully accepting reality as it is without fighting, denying, or judging it, while not necessarily approving of it",
            "Passively giving up on efforts to change difficult circumstances",
            "Using positive self-talk to reframe painful experiences as opportunities for growth"
          ],
          correctAnswer: 1,
          explanation: "Radical Acceptance means fully acknowledging reality as it is — not approving of it, not agreeing it should have happened, and not giving up on change. The distinction is critical: refusing to accept reality doesn't change reality, it only adds the suffering of fighting against what has already occurred. Acceptance is the prerequisite for effective action, not a substitute for it.",
          showExplanation: true
        },
        {
          type: "multipleChoice",
          order: 4,
          question: "A client in acute emotional crisis has been engaging in self-harm when overwhelmed. Which distress tolerance strategies would be most appropriate to teach FIRST for immediate crisis management?",
          options: [
            "Radical Acceptance and Turning the Mind",
            "TIPP skills — specifically Temperature and Paced Breathing",
            "The Pros and Cons exercise completed during the crisis",
            "DEAR MAN to communicate needs to support system"
          ],
          correctAnswer: 1,
          explanation: "TIPP skills are the fastest-acting interventions in the DBT toolkit because they work directly on the physiology — specifically Temperature and Paced Breathing can produce measurable relief within seconds to minutes. Reality acceptance skills are valuable but require more cognitive capacity than is available during acute crisis. Pros and Cons must be completed in advance, not during the crisis.",
          showExplanation: true
        },
        {
          type: "reflection",
          order: 5,
          question: "Think about a client you have worked with who struggled with crisis-driven impulsive behaviors. Which distress tolerance skills from this module might have been most helpful for that client? Consider both the crisis survival skills (TIPP, ACCEPTS, IMPROVE) and the reality acceptance skills (Radical Acceptance, Turning the Mind, Willingness). How would you sequence the introduction of these skills in treatment, and what barriers might the client face in learning to use them?"
        }
      ]
    },

    // ─── SECTION 6: Core Skill Module — Emotion Regulation ───────────────
    {
      title: "Core Skill Module: Emotion Regulation",
      description: "Understanding, managing, and proactively reducing unwanted emotional experiences",
      order: 6,
      estimatedTime: 45,
      contentBlocks: [
        {
          type: "text",
          order: 1,
          textContent: `<h2>The Goals of Emotion Regulation</h2>
<p>The Emotion Regulation module operates at a fundamentally different level than Distress Tolerance. While distress tolerance focuses on surviving acute emotional crises, emotion regulation aims to change the emotional experience itself. The goals are to understand emotions and their function, reduce emotional vulnerability, decrease the frequency of unwanted emotions, and decrease emotional suffering.</p>
<p>A critical starting point is understanding that emotions are not the enemy. Emotions have evolved to serve essential functions: fear protects us from danger, anger motivates us to address injustice, sadness signals loss and elicits support from others, joy reinforces behaviors that promote wellbeing. The problem is not that emotionally dysregulated individuals have emotions—it is that their emotions are experienced with such intensity, frequency, and duration that they overwhelm the individual's capacity to function effectively.</p>
<h2>The DBT Model of Emotions</h2>
<p>DBT teaches a specific model for understanding how emotions work. The emotional experience breaks into identifiable components, each representing a potential point of intervention:</p>
<p><strong>Prompting Event:</strong> Something happens in the environment (or internally, such as a thought or memory) that sets the emotional process in motion.</p>
<p><strong>Interpretation:</strong> The person assigns meaning to the prompting event based on their beliefs, assumptions, past experiences, and current emotional state. The same event can generate very different emotions depending on how it is interpreted.</p>
<p><strong>Emotional Response:</strong> The emotion arises as a complex package that includes a subjective feeling state, physiological changes, cognitive changes, and an action urge.</p>
<p><strong>Action Urge:</strong> Every emotion comes with a built-in urge to act in a specific way. Fear generates the urge to flee. Anger generates the urge to attack. The gap between urge and action is where emotional regulation skills have their greatest impact.</p>
<p><strong>Behavior and Consequences:</strong> The person either acts on the urge, modifies their response, or uses a skill to respond differently. The behavior then produces consequences that feed back into the system.</p>
<h2>Core Emotion Regulation Skills</h2>
<p><strong>Check the Facts</strong> targets the interpretation component. When an intense emotion arises, the client pauses and systematically examines whether their interpretation of the situation is accurate. Questions include: What are the facts? What am I assuming? What is the most likely interpretation given all available evidence?</p>
<p><strong>Opposite Action</strong> — when an emotion is unjustified, meaning the interpretation does not fit the facts — involves acting in a way that is opposite to the urge generated by the emotion. If fear is unjustified, the opposite action is to approach what you are avoiding. If shame is unjustified, the opposite action is to share the experience rather than hide. The mechanism is well-supported by exposure therapy research: acting opposite to an unjustified emotion reduces its intensity over time.</p>
<p><strong>Problem Solving</strong> — when an emotion is justified, meaning it accurately reflects a real problem — involves identifying the problem, generating solutions, evaluating each, selecting the best option, and implementing it.</p>
<p>The critical clinical judgment in emotion regulation is distinguishing between situations that call for Opposite Action (emotion does not fit the facts) and situations that call for Problem Solving (emotion fits the facts and the situation needs to change).</p>`
        },
        {
          type: "multipleChoice",
          order: 2,
          question: "In the DBT model of emotions, at which point does the skill of 'Check the Facts' intervene in the emotional cycle?",
          options: [
            "At the prompting event, before any emotional response has occurred",
            "At the interpretation stage, examining whether the meaning assigned to the event is accurate",
            "At the action urge stage, before the behavior occurs",
            "At the behavior stage, after the emotional response has fully developed"
          ],
          correctAnswer: 1,
          explanation: "Check the Facts intervenes at the interpretation stage — the point where the person assigns meaning to the prompting event. Because the same event can generate very different emotions depending on interpretation, correcting an inaccurate interpretation can fundamentally change the emotional response. This makes the interpretation stage one of the highest-leverage intervention points in the emotional cycle.",
          showExplanation: true
        },
        {
          type: "multipleChoice",
          order: 3,
          question: "A client feels intense anger after their manager publicly criticized their work in a team meeting. After using Check the Facts, the client determines that the criticism was factually inaccurate and professionally inappropriate. Which emotion regulation skill is most appropriate next?",
          options: [
            "Opposite Action — act gently and take a step back because the emotion is too intense",
            "Problem Solving — the emotion fits the facts, so address the real-world situation",
            "Radical Acceptance — accept that the criticism happened and move on",
            "Paced Breathing — reduce the physiological arousal before taking any action"
          ],
          correctAnswer: 1,
          explanation: "When Check the Facts determines that the emotion FITS the facts — the criticism was genuinely inappropriate — Problem Solving is indicated. Using Opposite Action (acting gently) when the emotion is justified would be invalidating, dismissing a legitimate emotional signal. The client should channel the justified anger into effective action: identifying options and implementing a plan to address the actual problem.",
          showExplanation: true
        },
        {
          type: "multipleChoice",
          order: 4,
          question: "Which of the following are components of the ABC PLEASE skills?",
          options: [
            "Accumulate positive experiences, Build mastery, Cope ahead",
            "Analyze thoughts, Breathe mindfully, Check the facts",
            "Accept reality, Balance emotions, Create safety",
            "Assert needs, Build relationships, Communicate effectively"
          ],
          correctAnswer: 0,
          explanation: "ABC stands for Accumulate positive experiences, Build mastery, and Cope ahead. PLEASE refers to treating PhysicaL illness, balanced Eating, avoiding mood-Altering substances, balanced Sleep, and Exercise. Together, these proactive skills build long-term emotional resilience by improving the baseline conditions of the client's daily life.",
          showExplanation: true
        },
        {
          type: "reflection",
          order: 5,
          question: "Consider the distinction between Opposite Action (for unjustified emotions) and Problem Solving (for justified emotions). Think about a client who experiences intense emotional reactions in interpersonal situations. How would you help this client develop the skill of distinguishing between situations where their emotional response fits the facts and situations where it does not? What challenges might arise in making this distinction, and how would you use the therapeutic relationship to navigate those challenges?"
        }
      ]
    },

    // ─── SECTION 7: Core Skill Module — Interpersonal Effectiveness ───────
    {
      title: "Core Skill Module: Interpersonal Effectiveness",
      description: "DEAR MAN, GIVE, FAST, and Walking the Middle Path",
      order: 7,
      estimatedTime: 45,
      contentBlocks: [
        {
          type: "text",
          order: 1,
          textContent: `<h2>The Challenge of Interpersonal Effectiveness</h2>
<p>For individuals with emotional dysregulation, interpersonal relationships are often simultaneously the greatest source of meaning and the greatest source of suffering. The Interpersonal Effectiveness module addresses these challenges directly by teaching specific, structured communication skills that help clients pursue three distinct types of interpersonal goals.</p>
<p>Any interpersonal interaction involves a complex balancing act: the person wants to get their needs met (<strong>objective effectiveness</strong>), they want to maintain or improve the relationship (<strong>relationship effectiveness</strong>), and they want to preserve their self-respect (<strong>self-respect effectiveness</strong>). These goals sometimes align, but they often pull in different directions, requiring deliberate Wise Mind decisions about which priority is most important in a given interaction.</p>
<h2>DEAR MAN: Objective Effectiveness</h2>
<p>DEAR MAN is the primary skill set for getting what you want or need from an interpersonal interaction:</p>
<ul>
<li><strong>D — Describe:</strong> Describe the current situation factually, without judgment. Stick to observable facts.</li>
<li><strong>E — Express:</strong> Express your feelings and opinions using "I" statements.</li>
<li><strong>A — Assert:</strong> Assert what you want or need clearly and specifically. Do not hint or imply.</li>
<li><strong>R — Reinforce:</strong> Explain the positive consequences of cooperation.</li>
<li><strong>M — Mindful:</strong> Stay focused on your objective. If derailed, return to your request like a "broken record."</li>
<li><strong>A — Appear Confident:</strong> Use a confident tone, appropriate eye contact, and upright posture.</li>
<li><strong>N — Negotiate:</strong> Be willing to find a mutually acceptable solution.</li>
</ul>
<h2>GIVE: Relationship Effectiveness</h2>
<p>GIVE focuses on maintaining or improving the relationship during an interpersonal interaction:</p>
<ul>
<li><strong>G — Gentle:</strong> Do not attack, threaten, judge, or engage in contemptuous behavior.</li>
<li><strong>I — Interested:</strong> Show genuine interest in the other person's perspective.</li>
<li><strong>V — Validate:</strong> Acknowledge that the other person's experience makes sense from their perspective.</li>
<li><strong>E — Easy Manner:</strong> Use humor, warmth, and a relaxed tone when possible.</li>
</ul>
<h2>FAST: Self-Respect Effectiveness</h2>
<p>FAST focuses on maintaining your own self-respect and values:</p>
<ul>
<li><strong>F — Fair:</strong> Be fair to both yourself and the other person.</li>
<li><strong>A — (no) Apologies:</strong> Do not over-apologize for having needs, boundaries, or opinions.</li>
<li><strong>S — Stick to Values:</strong> Do not compromise your core values to please someone else.</li>
<li><strong>T — Truthful:</strong> Be honest. Do not lie, exaggerate, or manipulate.</li>
</ul>
<h2>Walking the Middle Path</h2>
<p>Walking the Middle Path addresses the dialectical challenge of navigating interpersonal differences without falling into the extremes of either demanding the other person change entirely or abandoning your own position completely. It involves dialectical thinking in relationships (moving from "either/or" to "both/and"), validation of others, and behavioral change strategies using reinforcement rather than punishment.</p>`
        },
        {
          type: "multipleChoice",
          order: 2,
          question: "A client needs to ask their supervisor for a schedule change to accommodate therapy appointments. They feel anxious about the request and worried about being perceived as difficult. Which interpersonal effectiveness framework should they primarily use?",
          options: [
            "GIVE — to focus on maintaining the relationship with their supervisor",
            "FAST — to maintain their self-respect while making the request",
            "DEAR MAN — to effectively make the request and get the schedule change",
            "Radical Acceptance — to accept that they may not get what they need"
          ],
          correctAnswer: 2,
          explanation: "DEAR MAN is the objective effectiveness skill — designed specifically for making requests and getting needs met. The client has a clear objective (the schedule change) and should use DEAR MAN to communicate it clearly and effectively. GIVE would be used alongside DEAR MAN to preserve the relationship, and FAST to maintain self-respect, but the primary framework for achieving the objective is DEAR MAN.",
          showExplanation: true
        },
        {
          type: "multipleChoice",
          order: 3,
          question: "A client has a tendency to over-apologize when making reasonable requests of their family members. Which FAST skill specifically addresses this pattern?",
          options: [
            "Fair — being fair to both yourself and the other person",
            "(no) Apologies — not over-apologizing for having needs or making reasonable requests",
            "Stick to Values — maintaining core values under pressure",
            "Truthful — being honest about your needs"
          ],
          correctAnswer: 1,
          explanation: "The 'A' in FAST stands for (no) Apologies — specifically the instruction not to over-apologize for existing, having needs, or making reasonable requests. Excessive apologizing communicates that your needs are not legitimate and undermines your credibility in the interaction. The skill is to apologize when you have genuinely wronged someone, but not for simply having boundaries or needs.",
          showExplanation: true
        },
        {
          type: "multipleChoice",
          order: 4,
          question: "Which factors should increase the intensity of a client's assertion, according to the interpersonal effectiveness intensity scale?",
          options: [
            "When the request is low priority and the relationship is casual",
            "When the need is important, the request is reasonable, and little harm will result from asking",
            "When the client feels intensely emotional and is in Emotion Mind",
            "When the relationship is at risk of ending regardless of the outcome"
          ],
          correctAnswer: 1,
          explanation: "The intensity of assertion should increase when: the need is important, the request is reasonable and ethical, it is the appropriate time and place, there is evidence the request will be heard, and little harm will result from asking. The intensity should decrease when the situation is reversed — low priority needs in fragile relationships warrant lower assertiveness.",
          showExplanation: true
        },
        {
          type: "reflection",
          order: 5,
          question: "Consider a situation in your own professional life where you needed to balance competing interpersonal goals—for example, asserting a professional boundary (FAST) while maintaining a collegial relationship (GIVE) and achieving a specific work objective (DEAR MAN). Which priority took precedence, and why? How might the DBT interpersonal effectiveness framework have helped you navigate the situation more deliberately? As a clinician, how would you help a client develop the skill of consciously choosing among these competing priorities rather than reacting impulsively?"
        }
      ]
    },

    // ─── SECTION 8: Evidence Base, Limitations, and Clinical Integration ──
    {
      title: "Evidence Base, Limitations, and Clinical Integration",
      description: "The research supporting DBT, its limitations, and strategies for practice integration",
      order: 8,
      estimatedTime: 40,
      contentBlocks: [
        {
          type: "text",
          order: 1,
          textContent: `<h2>The Evidence Base for DBT</h2>
<p>DBT is among the most extensively researched psychotherapeutic approaches in the mental health field. Over three decades of research have produced a substantial body of evidence supporting its efficacy across multiple clinical populations and treatment settings.</p>
<p>The strongest evidence for DBT exists in the treatment of Borderline Personality Disorder. Multiple randomized controlled trials (RCTs) have demonstrated that DBT, compared to treatment as usual, significantly reduces the frequency and severity of self-harm and suicide attempts, decreases psychiatric hospitalizations, reduces treatment dropout rates, and improves overall social and global functioning. Linehan's original 1991 RCT, along with subsequent replications by independent research groups (Verheul et al., 2003; Linehan et al., 2006; McMain et al., 2009), established DBT as the gold standard treatment for BPD with chronic suicidality.</p>
<p>Beyond BPD, DBT has accumulated promising evidence for eating disorders (DBT-ED), substance use disorders (DBT-SUD), treatment-resistant depression, PTSD (DBT-PE), and adolescents (DBT-A). A significant study by Linehan and colleagues (2015) found that DBT skills training without individual DBT therapy produced comparable reductions in suicidal ideation and depression, though full DBT was superior in reducing self-harm — suggesting that skills training may be the most active ingredient in DBT.</p>
<h2>Recognized Limitations and Criticisms</h2>
<p><strong>Resource intensity:</strong> Comprehensive DBT requires a minimum of two therapists for skills group co-facilitation, weekly individual sessions, weekly skills groups, phone coaching availability, and weekly consultation team meetings. For many clinical settings—particularly solo practices, under-resourced community mental health centers, and rural areas—implementing comprehensive DBT is simply not feasible.</p>
<p><strong>Cultural applicability:</strong> DBT was developed primarily with white, female clients in the Pacific Northwest, and most research samples have been predominantly white and female. The emphasis on direct emotional expression and assertive communication in the interpersonal effectiveness module may not align with communication norms of collectivist cultures. The concept of radical acceptance may resonate differently with individuals whose suffering is rooted in systemic oppression.</p>
<p><strong>Diagnostic stigma:</strong> DBT's strong association with BPD can create barriers to access when clients resist a referral for a treatment they associate with a stigmatized diagnosis.</p>
<p><strong>Treatment duration:</strong> Standard comprehensive DBT is designed as a one-year treatment, and less is known about the long-term durability of treatment gains or the optimal duration for different populations.</p>
<h2>Integrating DBT-Informed Strategies</h2>
<p>Many clinicians will choose to integrate specific DBT strategies into their existing practice rather than implementing the full comprehensive model. This is legitimate and appropriate when done transparently — saying "I integrate some DBT skills into my work" is accurate; saying "I do DBT" when you are not providing all four modes of treatment is misleading.</p>
<p>Practical steps for integration include: incorporating diary cards or simplified mood tracking; teaching TIPP skills as a first-line intervention for clients in acute distress; using the Check the Facts and Opposite Action framework to enhance cognitive-behavioral work; introducing radical acceptance language for clients struggling with grief or unchangeable circumstances; using DEAR MAN role-plays to prepare clients for difficult conversations; and adopting the dialectical stance of balancing validation with change in all therapeutic interactions.</p>`
        },
        {
          type: "multipleChoice",
          order: 2,
          question: "Which criticism addresses the concern that DBT's concept of radical acceptance may be problematic for individuals facing systemic oppression?",
          options: [
            "The resource intensity limitation — not enough clinicians are trained",
            "The cultural applicability limitation — accepting systemic injustice is fundamentally different from accepting personal loss",
            "The fidelity drift limitation — clinicians are using DBT-informed approaches incorrectly",
            "The client burden limitation — the treatment demands too much of clients"
          ],
          correctAnswer: 1,
          explanation: "The cultural applicability criticism specifically raises concern that radical acceptance may be applied inappropriately to clients from marginalized communities. Accepting the reality of systemic oppression — racism, discrimination, structural inequality — is fundamentally different from accepting a personal loss. The clinician must be sensitive to this distinction and ensure that radical acceptance does not become a tool for encouraging clients to accommodate injustice.",
          showExplanation: true
        },
        {
          type: "multipleChoice",
          order: 3,
          question: "A clinician describes their practice as 'DBT-informed' but only occasionally teaches mindfulness skills and does not use diary cards, behavioral chain analysis, or group skills training. What limitation does this example illustrate?",
          options: [
            "Resource intensity — the clinician lacks the staff to implement full DBT",
            "Fidelity drift — selective use of DBT components without the full treatment structure",
            "Diagnostic stigma — the clinician is avoiding formal DBT to protect clients from the BPD label",
            "Treatment duration — the clinician is implementing only the first phase of DBT"
          ],
          correctAnswer: 1,
          explanation: "Fidelity drift refers to the gradual erosion of the comprehensive treatment structure as clinicians selectively adopt individual components while abandoning the full model. While integrating DBT skills is legitimate, the concern is that cherry-picking components without the structural container may produce inferior outcomes. Transparency with clients about what level of DBT is being provided is ethically essential.",
          showExplanation: true
        },
        {
          type: "reflection",
          order: 4,
          question: "Having reviewed the evidence base and limitations of DBT, develop a preliminary plan for how you will integrate DBT-informed strategies into your current clinical practice. Identify specific DBT skills or principles you plan to use, the client population or presenting concerns they will be most relevant for, any modifications you may need to make for your specific setting or cultural context, and how you will be transparent with clients about the level of DBT you are providing. What is one concrete step you will take within the next two weeks to begin this integration?"
        }
      ]
    },

    // ─── SECTION 9: Glossary, Clinical Application, and Final Assessment ──
    {
      title: "Glossary, Clinical Application, and Final Assessment",
      description: "Key terms, clinical integration exercise, and final exam preparation",
      order: 9,
      estimatedTime: 30,
      contentBlocks: [
        {
          type: "accordion",
          order: 1,
          title: "DBT Glossary of Key Terms",
          accordionItems: [
            { title: "Biosocial Theory", content: "DBT's etiological model stating that emotional dysregulation arises from the transaction between biological emotional vulnerability (high sensitivity, high reactivity, slow return to baseline) and an invalidating social environment." },
            { title: "Dialectics", content: "A philosophical approach emphasizing that reality is composed of opposing forces that can be synthesized. In DBT, the core dialectic is acceptance AND change — held simultaneously rather than resolved in favor of one side." },
            { title: "Wise Mind", content: "The dialectical synthesis of Reasonable Mind (logic-governed) and Emotion Mind (feeling-governed). The state from which values-consistent, effective decisions are made." },
            { title: "Radical Acceptance", content: "Fully accepting reality as it is in this moment without fighting, denying, or judging it as something that should not be. Not approval or passivity — the prerequisite for effective action." },
            { title: "Behavioral Chain Analysis", content: "A detailed, step-by-step collaborative examination of the sequence of events, thoughts, emotions, and behaviors that led to a specific problem behavior, identifying intervention points along the chain." },
            { title: "TIPP Skills", content: "Temperature, Intense Exercise, Paced Breathing, and Progressive Muscle Relaxation — the fastest-acting crisis survival skills that work by directly altering physiological arousal." },
            { title: "Opposite Action", content: "Acting in a way that is opposite to the urge generated by an unjustified emotion. Based on exposure principles — repeatedly acting opposite to an unjustified emotion reduces its intensity over time." },
            { title: "DEAR MAN", content: "DBT acronym for objective effectiveness: Describe, Express, Assert, Reinforce, Mindful, Appear Confident, Negotiate. A structured sequence for making requests or saying no effectively." },
            { title: "Validation", content: "Communicating to a client that their emotional responses, thoughts, and behaviors make sense given their history, biology, or current circumstances. Not agreement — acknowledgment of the understandable logic of their experience." },
            { title: "Phone Coaching", content: "Brief (5-15 minute) between-session contacts with the individual therapist to help clients apply DBT skills in real-time. Not crisis counseling — skills generalization support." }
          ]
        },
        {
          type: "text",
          order: 2,
          textContent: `<h2>Putting It All Together: The Interconnection of DBT Skill Modules</h2>
<p>As you prepare to complete the final assessment, it is important to step back from the individual skill modules and appreciate the elegant interconnection of the DBT skills system as a whole. The four core modules are not four separate toolkits that happen to be packaged together—they are four interdependent dimensions of a single, integrated approach to building a life worth living.</p>
<p><strong>Mindfulness</strong> provides the foundational awareness that enables all other skills: you cannot regulate an emotion you have not noticed, tolerate distress you have not acknowledged, or communicate effectively in a relationship when you are not present.</p>
<p><strong>Distress tolerance</strong> provides the crisis survival capacity that keeps the client alive and in treatment during the acute episodes that are inevitable early in the treatment process, creating the stability necessary for longer-term work.</p>
<p><strong>Emotion regulation</strong> addresses the chronic patterns of emotional suffering that generate the crises distress tolerance manages.</p>
<p><strong>Interpersonal effectiveness</strong> addresses the relational context in which emotions arise and the interpersonal consequences of emotional dysregulation.</p>
<p>Progress in any one skill module supports progress in all the others. A client who develops stronger mindfulness skills becomes better at recognizing the early signs of emotional escalation, making emotion regulation interventions more timely and effective. A client who develops stronger distress tolerance skills feels more confident that they can survive intense emotional episodes, which paradoxically reduces the intensity of those episodes. The system is synergistic: the whole is considerably greater than the sum of its parts.</p>
<h2>Final Assessment Instructions</h2>
<p>The final assessment consists of <strong>20 questions</strong> covering material from all course modules. A score of <strong>80% or higher (16/20) is required to pass</strong>. You have up to <strong>3 attempts</strong>. Questions are drawn from the following topic areas:</p>
<ul>
<li>Biosocial theory and the development of emotional dysregulation (2-3 questions)</li>
<li>The four components of comprehensive DBT (2-3 questions)</li>
<li>Mindfulness skills: What skills, How skills, states of mind (3-4 questions)</li>
<li>Distress tolerance: TIPP, radical acceptance, willingness (3-4 questions)</li>
<li>Emotion regulation: Check the Facts, Opposite Action, Problem Solving (3-4 questions)</li>
<li>Interpersonal effectiveness: DEAR MAN, GIVE, FAST (2-3 questions)</li>
<li>Evidence base and limitations (1-2 questions)</li>
</ul>
<p>Upon passing the assessment, you will complete the required course evaluation and attestation before receiving your certificate of 6 continuing education hours.</p>`
        },
        {
          type: "resources",
          order: 3,
          title: "References and Further Reading",
          resources: [
            { title: "Cognitive-behavioral treatment of borderline personality disorder", author: "Linehan, M. M.", year: 1993, source: "Guilford Press", type: "book" },
            { title: "DBT Skills Training Manual (2nd ed.)", author: "Linehan, M. M.", year: 2015, source: "Guilford Press", type: "book" },
            { title: "Dialectical behavior therapy is effective for the treatment of suicidal behavior: A meta-analysis", author: "DeCou, C. R., Comtois, K. A., & Landes, S. J.", year: 2019, source: "Behavior Therapy, 50(1), 60–72", type: "article" },
            { title: "Behavioral Tech, LLC — What is DBT?", author: "Behavioral Tech, LLC", year: 2024, source: "https://behavioraltech.org/resources/faqs/dialectical-behavior-therapy-dbt/", type: "website" },
            { title: "Two-year randomized controlled trial and follow-up of DBT vs therapy by experts", author: "Linehan, M. M., et al.", year: 2006, source: "Archives of General Psychiatry, 63(7), 757–766", type: "article" }
          ]
        },
        {
          type: "multipleChoice",
          order: 4,
          isExam: true,
          passingScore: 80,
          maxAttempts: 3,
          showExplanations: false,
          shuffleQuestions: true,
          shuffleOptions: true,
          title: "Final Assessment",
          questions: [
            { question: "According to biosocial theory, emotional dysregulation arises from which of the following?", type: "multiple_choice", options: ["A biological predisposition to emotional vulnerability alone", "An invalidating social environment alone", "The ongoing transaction between biological emotional vulnerability and an invalidating social environment", "Genetic inheritance of Borderline Personality Disorder"], correctAnswer: 2, explanation: "Biosocial theory holds that neither factor alone is sufficient — it is the ongoing transaction between the two that creates and maintains emotional dysregulation." },
            { question: "Which of the following is NOT one of the three defining characteristics of biological emotional vulnerability according to Linehan?", type: "multiple_choice", options: ["High sensitivity to emotional stimuli", "High reactivity when emotions are triggered", "Slow return to emotional baseline", "Inability to identify emotional states (alexithymia)"], correctAnswer: 3, explanation: "The three characteristics are: high sensitivity, high reactivity, and slow return to baseline. Alexithymia is a related concept but is not one of Linehan's three defining characteristics of biological vulnerability." },
            { question: "What is the primary purpose of phone coaching in comprehensive DBT?", type: "multiple_choice", options: ["To conduct between-session therapy for unresolved issues", "To assess suicidal risk during crises", "To help clients apply DBT skills in real-time situations that trigger self-destructive urges", "To review diary card entries before individual sessions"], correctAnswer: 2, explanation: "Phone coaching serves skills generalization — brief (5-15 minute) contacts to help clients apply already-learned skills when they need them most. It is explicitly not crisis counseling or between-session therapy." },
            { question: "In the DBT treatment target hierarchy, therapy-interfering behaviors are addressed at which level?", type: "multiple_choice", options: ["First — they are the highest priority", "Second — after life-threatening behaviors", "Third — after quality-of-life-interfering behaviors", "Fourth — after increasing behavioral skills"], correctAnswer: 1, explanation: "The hierarchy is: (1) life-threatening behaviors, (2) therapy-interfering behaviors, (3) quality-of-life-interfering behaviors, (4) increasing behavioral skills. This structure ensures that what is most important to treatment continuity and safety is always addressed first." },
            { question: "A client is in acute emotional crisis and is at risk of self-harm. Which TIPP skill can produce measurable physiological change in seconds to minutes?", type: "multiple_choice", options: ["Progressive Muscle Relaxation", "Intense Exercise", "Temperature — applying cold water to the face", "Paced Breathing"], correctAnswer: 2, explanation: "The Temperature skill (cold water to the face, specifically around the eyes and cheeks) activates the mammalian dive reflex — a hardwired parasympathetic response that can produce measurable heart rate reduction within seconds. This makes it the fastest-acting of the TIPP skills for acute crisis." },
            { question: "Which state of mind represents the dialectical synthesis of Reasonable Mind and Emotion Mind?", type: "multiple_choice", options: ["Balanced Mind", "Wise Mind", "Reflective Mind", "Observing Mind"], correctAnswer: 1, explanation: "Wise Mind is the dialectical integration of logic (Reasonable Mind) and emotion (Emotion Mind) — the state from which values-consistent, effective decisions are made. It honors both rational understanding and emotional experience without being dominated by either." },
            { question: "The 'Describe' mindfulness skill is clinically valuable because research shows that affect labeling (putting words on feelings):", type: "multiple_choice", options: ["Increases amygdala activation, helping clients feel their emotions more fully", "Reduces amygdala activation, literally making the emotion less intense", "Transfers emotional processing from the right hemisphere to the left", "Activates the default mode network, facilitating self-reflection"], correctAnswer: 1, explanation: "Research by Lieberman and colleagues demonstrated that affect labeling reduces amygdala activation and increases prefrontal cortex activity. In practical terms, naming your emotion literally makes it less intense — providing a neurobiological mechanism for the clinical observation that labeling emotions aids regulation." },
            { question: "Radical Acceptance in DBT is best described as:", type: "multiple_choice", options: ["Approving of painful events and agreeing they should have happened", "Passively giving up on efforts to change difficult circumstances", "Fully accepting reality as it is without fighting or denying it, while not necessarily approving of it", "Using cognitive reframing to find the positive meaning in difficult experiences"], correctAnswer: 2, explanation: "Radical Acceptance means fully acknowledging reality — not approving it, not agreeing it should have happened, and not giving up on change. Refusing to accept reality doesn't change reality; it only adds the suffering of fighting against what has already occurred. Linehan: 'Pain plus non-acceptance equals suffering.'" },
            { question: "When should Opposite Action be used in emotion regulation?", type: "multiple_choice", options: ["When the emotion is justified and accurately reflects a real problem", "When the emotion is unjustified or the interpretation does not fit the facts", "When the client needs to avoid the situation triggering the emotion", "When TIPP skills have failed to reduce emotional intensity"], correctAnswer: 1, explanation: "Opposite Action is for unjustified emotions — when Check the Facts reveals the interpretation doesn't fit the facts or the intensity is disproportionate. For justified emotions, Problem Solving is indicated. Using Opposite Action for justified emotions is invalidating and therapeutically counterproductive." },
            { question: "Which FAST skill specifically addresses the pattern of over-apologizing when making reasonable requests?", type: "multiple_choice", options: ["Fair — being fair to yourself and the other person", "(no) Apologies — not apologizing for having needs, boundaries, or opinions", "Stick to Values — maintaining core values under interpersonal pressure", "Truthful — being honest about what you need"], correctAnswer: 1, explanation: "The 'A' in FAST stands for (no) Apologies — specifically not over-apologizing for existing, having needs, or making reasonable requests. Excessive apologizing undermines credibility and communicates that your needs are not legitimate. Apologize when you have genuinely wronged someone, not for simply making a reasonable request." },
            { question: "The DEAR MAN framework is used for which type of interpersonal goal?", type: "multiple_choice", options: ["Relationship effectiveness — maintaining a valued relationship", "Self-respect effectiveness — preserving your values and self-image", "Objective effectiveness — getting what you want or need from an interaction", "Validation effectiveness — feeling heard and understood by others"], correctAnswer: 2, explanation: "DEAR MAN addresses objective effectiveness — the goal of getting what you want or need from an interpersonal interaction. GIVE addresses relationship effectiveness, and FAST addresses self-respect effectiveness. In any interaction, the client must decide which of the three goals takes priority given the specific circumstances." },
            { question: "Which limitation of DBT specifically concerns the applicability of radical acceptance to clients from marginalized communities?", type: "multiple_choice", options: ["Resource intensity — comprehensive DBT is too expensive for underserved communities", "Cultural applicability — accepting systemic injustice differs fundamentally from accepting personal loss", "Fidelity drift — clinicians modify radical acceptance in ways that dilute its effectiveness", "Diagnostic stigma — the BPD association reduces access among marginalized clients"], correctAnswer: 1, explanation: "The cultural applicability limitation raises a specific concern: asking a client to radically accept the reality of systemic racism, discrimination, or structural inequality is fundamentally different from accepting a personal loss or unchangeable circumstance. The application of radical acceptance must be sensitive to this distinction." },
            { question: "The biosocial formulation is described as therapeutically powerful when shared with clients because it:", type: "multiple_choice", options: ["Provides a diagnostic label that validates their clinical presentation", "Communicates that their struggles are not their fault and have identifiable, addressable causes", "Establishes clear treatment goals and a structured therapeutic framework", "Justifies the use of medication to address biological vulnerability"], correctAnswer: 1, explanation: "Sharing the biosocial formulation is itself a validating clinical intervention — it communicates that the client's emotional pain is not their fault, has identifiable causes (biology + environment), and can be addressed through learnable skills. This stands in contrast to conceptualizations that locate the problem entirely within the individual as a character flaw or failure of willpower." },
            { question: "DBT's 24-hour rule in phone coaching states that:", type: "multiple_choice", options: ["Clients must wait 24 hours after each individual session before calling for phone coaching", "If a client has engaged in self-harm, they must wait 24 hours before contacting the therapist for coaching", "Phone coaching calls must be limited to 24 minutes to prevent boundaries violations", "Therapists must return coaching calls within 24 hours of receiving a message"], correctAnswer: 1, explanation: "The 24-hour rule states that if a client has engaged in self-harm or other target behaviors, they must wait 24 hours before calling for phone coaching. This rule exists to avoid inadvertently reinforcing self-destructive behavior with therapeutic attention. It does not apply to genuine suicidal crises, which always warrant immediate contact." },
            { question: "In the DBT model of emotions, the 'interpretation' stage is particularly important because:", type: "multiple_choice", options: ["It is the stage at which physiological arousal peaks", "The same event can generate very different emotions depending on how it is interpreted", "It determines whether the emotion will be expressed behaviorally", "It is the only stage at which therapeutic intervention is possible"], correctAnswer: 1, explanation: "The interpretation stage is the highest-leverage intervention point because the same prompting event can generate completely different emotional responses depending on the meaning assigned to it. Check the Facts intervenes here — correcting an inaccurate interpretation can fundamentally change the emotional response that follows." },
            { question: "Which of the following is accurate regarding the distinction between comprehensive DBT and DBT-informed therapy?", type: "multiple_choice", options: ["DBT-informed therapy is an accepted synonym for comprehensive DBT", "A clinician teaching only mindfulness skills is appropriately describing their work as 'doing DBT'", "Comprehensive DBT requires all four modes of treatment; DBT-informed therapy is the selective use of DBT concepts within a different framework", "There is no clinical difference between comprehensive DBT and DBT-informed approaches"], correctAnswer: 2, explanation: "Comprehensive DBT requires all four modes (individual therapy, skills group, phone coaching, consultation team). DBT-informed therapy is the legitimate selective integration of DBT concepts and skills within a different framework. Clinicians must be transparent with clients about which they are providing — saying 'I do DBT' when delivering only DBT-informed therapy is misleading." },
            { question: "The therapist consultation team in DBT is distinguished from typical clinical supervision by:", type: "multiple_choice", options: ["Its focus on case management and billing compliance", "Its role as a treatment component that supports therapist wellbeing and fidelity — treating the therapist, not the client", "Its hierarchical structure with a designated supervisor reviewing all clinical decisions", "Its primary focus on training new DBT therapists rather than supporting experienced ones"], correctAnswer: 1, explanation: "The consultation team is conceptualized as a treatment component — the component that treats the therapist. Linehan recognized that clinicians working with severely dysregulated clients are at high risk for burnout. The team provides a validating, structured peer environment for therapists that mirrors the dialectical balance provided to clients." },
            { question: "Walking the Middle Path, originally developed for DBT-A (adolescent DBT), involves which three core practices?", type: "multiple_choice", options: ["Observing, Describing, and Participating — the three What skills of mindfulness", "Dialectical thinking in relationships, validation of others, and behavioral change through reinforcement", "DEAR MAN, GIVE, and FAST — balancing three interpersonal goals simultaneously", "Radical Acceptance, Turning the Mind, and Willingness — the reality acceptance skills"], correctAnswer: 1, explanation: "Walking the Middle Path involves: (1) dialectical thinking in relationships — moving from 'either/or' to 'both/and'; (2) validation of others — finding the kernel of truth in the other person's perspective; and (3) behavioral change strategies using reinforcement rather than punishment. It directly addresses the extreme interpersonal dynamics common in parent-teen relationships." },
            { question: "Which of the following best describes the role of the diary card in comprehensive DBT?", type: "multiple_choice", options: ["A therapy homework assignment used to practice cognitive restructuring between sessions", "A daily self-monitoring tool tracking emotions, target behaviors, and skill use that drives the treatment target hierarchy", "A structured interview protocol used to assess the severity of BPD symptoms", "An optional record-keeping system used at the discretion of individual clinicians"], correctAnswer: 1, explanation: "The diary card is a daily self-monitoring form clients complete between sessions, recording emotional intensity, target behaviors (self-harm urges, substance use), and skill use. Reviewing it at the beginning of each session drives the target hierarchy — ensuring treatment addresses what is most clinically important rather than drifting to whatever the client happens to be feeling that day." },
            { question: "The overarching clinical goal of DBT, expressed in Linehan's phrase, is to help clients:", type: "multiple_choice", options: ["Eliminate self-destructive behaviors and achieve diagnostic remission from BPD", "Build a life worth living — a life rich enough in meaning and connection that self-destructive coping is no longer necessary", "Develop insight into the childhood origins of their emotional dysregulation", "Learn to manage their emotions well enough to function independently without ongoing therapy"], correctAnswer: 1, explanation: "Linehan's phrase 'build a life worth living' is both a clinical goal and a philosophical statement. Many clients entering DBT are not merely struggling with symptoms — they are living lives that are genuinely painful due to accumulated consequences of emotional dysregulation. The goal is not symptom management alone but the construction of a life that is sufficiently rich in meaning, connection, and accomplishment that the emotional baseline naturally improves." }
          ]
        }
      ]
    }

  ] // end sections
};

// ═══════════════════════════════════════════════════════════════════
// SEED FUNCTION
// ═══════════════════════════════════════════════════════════════════

async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;
  console.log('✅ Connected to MongoDB');

  const existing = await db.collection('interactivecourses').findOne({ slug: SLUG });

  if (existing) {
    console.log(`🔄 Updating existing course: ${existing.title}`);
    await db.collection('interactivecourses').updateOne(
      { slug: SLUG },
      { $set: { ...COURSE, updatedAt: new Date() } }
    );
  } else {
    console.log(`➕ Creating new course: ${COURSE.title}`);
    await db.collection('interactivecourses').insertOne({
      ...COURSE,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  // Verify
  const saved = await db.collection('interactivecourses').findOne({ slug: SLUG });
  console.log(`\n✅ Saved to interactivecourses`);
  console.log(`   Title: ${saved.title}`);
  console.log(`   Sections: ${saved.sections?.length || 0}`);
  console.log(`   Status: ${saved.status}`);

  const totalBlocks = saved.sections?.reduce((sum, s) => sum + (s.contentBlocks?.length || 0), 0) || 0;
  const examSection = saved.sections?.find(s => s.contentBlocks?.some(b => b.isExam));
  const examBlock = examSection?.contentBlocks?.find(b => b.isExam);
  console.log(`   Total content blocks: ${totalBlocks}`);
  console.log(`   Final exam questions: ${examBlock?.questions?.length || 0}`);

  await mongoose.disconnect();
  console.log('\n✅ Done! Course is published and visible in the player.');
}

main().catch(e => { console.error('💥', e.message); process.exit(1); });
