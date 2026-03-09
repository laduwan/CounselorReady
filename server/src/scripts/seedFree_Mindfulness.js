/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('❌ MONGODB_URI not set'); process.exit(1); }

const SLUG = 'mindfulness-introduction';

const COURSE = {
  title: "Introduction to Mindfulness in Clinical Practice",
  slug: SLUG,
  courseCode: "CR-103",
  description: "Mindfulness has moved from contemplative traditions into mainstream mental health treatment with a robust evidence base. This 1-hour continuing education course provides clinicians with a grounded understanding of mindfulness—its definition, neurobiological mechanisms, evidence for clinical application, practical techniques for integration into therapy, and important contraindications. Rather than treating mindfulness as a panacea, this course equips clinicians to apply it judiciously as one tool within a comprehensive clinical repertoire.",
  ceHours: 1,
  ceuHours: 1,
  ceuEligible: true,
  ceCategory: "Clinical",
  approvingBody: "NBCC",
  approvalNumber: "7760",
  accessType: "free",
  price: 0,
  pricingTier: "standard",
  status: "published",
  isPublished: true,
  level: "Introductory",
  deliveryMethod: "Asynchronous Online",
  objectives: [
    "Define mindfulness using Kabat-Zinn's and Shapiro's models, distinguishing it from relaxation and from religious practice",
    "Summarize the evidence base for MBSR, MBCT, and mindfulness-integrated approaches across clinical conditions",
    "Explain the neurobiological mechanisms underlying mindfulness effects including decentering and attention regulation",
    "Teach three foundational mindfulness practices to clients: breath awareness, body scan, and the STOP technique",
    "Identify contraindications and cultural considerations for mindfulness-based interventions"
  ],
  targetAudience: [
    "Licensed Professional Counselors (LPC/LPCC)",
    "Licensed Clinical Social Workers (LCSW)",
    "Licensed Marriage and Family Therapists (LMFT)",
    "Psychologists",
    "Counselors-in-Training under supervision"
  ],
  presenter: {
    name: "Kejuiana Johnson",
    credentials: "MA, LPC, NCC, CPCS, BC-TMH",
    licenseNumber: "LPC009587",
    licenseState: "Georgia"
  },
  references: [
    { title: "Full catastrophe living: Using the wisdom of your body and mind to face stress, pain, and illness (Revised ed.)", author: "Kabat-Zinn, J.", year: 2013, source: "Bantam Books" },
    { title: "Mindfulness-based cognitive therapy for depression (2nd ed.)", author: "Segal, Z. V., Williams, J. M. G., & Teasdale, J. D.", year: 2013, source: "Guilford Press" },
    { title: "The mindful path to self-compassion", author: "Germer, C. K.", year: 2009, source: "Guilford Press" },
    { title: "Mechanisms of mindfulness", author: "Shapiro, S. L., Carlson, L. E., Astin, J. A., & Freedman, B.", year: 2006, source: "Journal of Clinical Psychology, 62(3), 373-386" },
    { title: "Mindfulness-based treatment approaches (2nd ed.)", author: "Baer, R. A. (Ed.)", year: 2014, source: "Academic Press" },
    { title: "Mindfulness: A practical guide to finding peace in a frantic world", author: "Williams, M., & Penman, D.", year: 2011, source: "Piatkus" }
  ],
  settings: {
    passingScore: 80,
    certificateEnabled: true,
    requireEvaluation: true,
    requireAttestation: true
  },

  sections: [
    // ─── SECTION 1 ──────────────────────────────────
    {
      title: "Understanding Mindfulness: Definition, Models, and Misconceptions",
      description: "What mindfulness is and isn't, key theoretical models, and neurobiological underpinnings",
      module: "Module 1: Foundations",
      order: 1,
      estimatedTime: 20,
      contentBlocks: [
        {
          type: "text",
          order: 1,
          textContent: `<h2>Defining Mindfulness</h2>
<p>Jon Kabat-Zinn's widely cited definition describes mindfulness as "paying attention in a particular way: on purpose, in the present moment, and non-judgmentally." While elegant, this definition can be misleading in its simplicity. Each component carries significant clinical weight. <strong>"On purpose"</strong> distinguishes mindfulness from the wandering attention of daydreaming—it involves deliberate, volitional direction of attention. <strong>"In the present moment"</strong> counters the mind's default tendencies toward rumination about the past and worry about the future—tendencies that are central to depression and anxiety, respectively. <strong>"Non-judgmentally"</strong> addresses the evaluative mental habits that amplify suffering—the tendency to categorize experience as good or bad, right or wrong, and to resist what is actually happening.</p>
<p>Shapiro, Carlson, Astin, and Freedman (2006) proposed a three-component model that offers additional clinical precision. They identify <strong>intention</strong> (why one is paying attention—the personal vision and motivation that underlies practice), <strong>attention</strong> (the moment-to-moment awareness itself), and <strong>attitude</strong> (the quality of attention—characterized by curiosity, openness, and acceptance). Shapiro's model is clinically useful because it highlights that mindfulness without intention can become aimless awareness, and mindfulness without the right attitudinal quality can become harsh self-monitoring.</p>`
        },
        {
          type: "multipleChoice",
          order: 2,
          question: "In Shapiro's three-component model of mindfulness, the components are:",
          options: [
            { text: "Breathing, focusing, and relaxing", isCorrect: false },
            { text: "Intention, attention, and attitude", isCorrect: true },
            { text: "Past, present, and future awareness", isCorrect: false },
            { text: "Observation, description, and participation", isCorrect: false }
          ],
          explanation: "Shapiro's model identifies intention (why you are paying attention), attention (the moment-to-moment awareness), and attitude (the quality of that attention—curiosity, openness, acceptance). This model adds precision beyond Kabat-Zinn's definition."
        },
        {
          type: "text",
          order: 3,
          textContent: `<h2>What Mindfulness Is Not</h2>
<p>Clinicians must understand common misconceptions to teach mindfulness effectively. <strong>Mindfulness is not relaxation.</strong> While mindfulness practice often produces relaxation as a side effect, making relaxation the goal fundamentally changes the practice. When a client approaches mindfulness expecting to feel calm, they will inevitably judge any moment of anxiety, restlessness, or discomfort as failure—which is the opposite of the non-judgmental awareness mindfulness cultivates. Mindfulness is about changing one's <em>relationship</em> to experience, not changing the experience itself.</p>
<p><strong>Mindfulness is not emptying the mind.</strong> This is perhaps the most persistent misconception and the one most likely to cause clients to abandon the practice. The mind thinks—that is what it does. Mindfulness does not stop thinking; it changes one's relationship to thoughts. Instead of being carried away by the content of thoughts (believing "I'm worthless" as a fact about reality), mindfulness allows one to observe the thought as a mental event ("I notice I'm having the thought that I'm worthless"). This shift—from content to process, from fusion to observation—is the mechanism of <strong>decentering</strong> (also called cognitive defusion), which is central to both mindfulness-based cognitive therapy and acceptance and commitment therapy.</p>
<p><strong>Mindfulness is not a religious practice.</strong> While mindfulness has roots in Buddhist contemplative traditions, the clinical applications developed by Kabat-Zinn and others are explicitly secular. However, clinicians should be sensitive to the fact that some clients—particularly those from certain Christian, Islamic, or other religious traditions—may have concerns about the Buddhist origins. A culturally sensitive approach acknowledges the historical roots while emphasizing the secular, evidence-based nature of clinical mindfulness, and remains open to clients' religious or spiritual frameworks for understanding the practice.</p>`
        },
        {
          type: "multipleChoice",
          order: 4,
          question: "Decentering (cognitive defusion) in mindfulness refers to:",
          options: [
            { text: "Stopping all thoughts during meditation", isCorrect: false },
            { text: "Moving away from difficult experiences", isCorrect: false },
            { text: "Observing thoughts as mental events rather than facts about reality", isCorrect: true },
            { text: "Centering one's attention on physical sensations only", isCorrect: false }
          ],
          explanation: "Decentering involves a fundamental shift in perspective—from being identified with thought content ('I am worthless') to observing thoughts as transient mental events ('I notice a thought about worthlessness'). This is a core mechanism of change in MBCT and ACT."
        },
        {
          type: "accordion",
          order: 5,
          title: "Neurobiological Underpinnings of Mindfulness",
          accordionItems: [
            {
              title: "Prefrontal Cortex and Attention Regulation",
              content: "Neuroimaging research consistently demonstrates that mindfulness practice strengthens prefrontal cortex function—particularly regions involved in sustained attention, executive control, and emotion regulation. The prefrontal cortex is responsible for top-down regulation of the amygdala's threat response, which explains why mindfulness practitioners often report reduced emotional reactivity: their regulatory capacity is literally enhanced through practice."
            },
            {
              title: "Default Mode Network and Rumination",
              content: "The brain's default mode network (DMN) is active during mind-wandering, self-referential thinking, and rumination—all of which are elevated in depression and anxiety. Research shows that experienced meditators have reduced DMN activation and stronger functional connectivity between the DMN and attention networks, suggesting that mindfulness practice helps the brain more quickly notice and interrupt rumination cycles."
            },
            {
              title: "Amygdala Reactivity and Emotional Processing",
              content: "Multiple studies demonstrate reduced amygdala reactivity to emotional stimuli following mindfulness training. This does not mean mindfulness numbs emotional experience—rather, the intensity and duration of the initial threat response decrease, allowing more space for adaptive emotional processing. The amygdala still signals, but the response is less overwhelming and shorter-lived."
            },
            {
              title: "Neuroplasticity and Structural Changes",
              content: "Studies using MRI have documented structural brain changes associated with mindfulness practice, including increased gray matter density in the hippocampus (memory and learning), posterior cingulate (self-awareness), temporo-parietal junction (perspective-taking and empathy), and decreased gray matter density in the amygdala (threat detection). These changes have been observed after as little as 8 weeks of regular practice."
            }
          ]
        },
        {
          type: "matching",
          order: 6,
          matchingInstructions: "Match each mindfulness misconception with the accurate understanding:",
          matchingPairs: [
            { term: "Mindfulness is relaxation", definition: "Mindfulness changes one's relationship to experience, not the experience itself; relaxation is a side effect, not the goal" },
            { term: "Mindfulness empties the mind", definition: "The mind thinks naturally; mindfulness changes the relationship to thoughts through decentering" },
            { term: "Mindfulness is a religious practice", definition: "Clinical mindfulness is secular and evidence-based, though it has roots in Buddhist contemplative traditions" },
            { term: "Mindfulness is always beneficial", definition: "Mindfulness has contraindications and can be harmful for some populations without appropriate adaptation" }
          ]
        },
        {
          type: "reflection",
          order: 7,
          question: "Consider your own experience with mindfulness, whether personal or professional. Have you held any of the misconceptions described above? How might your own understanding (or misunderstanding) of mindfulness affect how you introduce it to clients?"
        }
      ],
      hasQuiz: true,
      quizQuestions: [
        {
          question: "Kabat-Zinn's definition includes all of the following components EXCEPT:",
          type: "multipleChoice",
          options: [
            { text: "On purpose", isCorrect: false },
            { text: "In the present moment", isCorrect: false },
            { text: "Non-judgmentally", isCorrect: false },
            { text: "With the goal of achieving relaxation", isCorrect: true }
          ],
          explanation: "Kabat-Zinn's definition is 'paying attention on purpose, in the present moment, non-judgmentally.' Relaxation is a common side effect but explicitly NOT the goal—making relaxation the goal changes the practice fundamentally."
        },
        {
          question: "Neuroimaging research on mindfulness consistently shows:",
          type: "multipleChoice",
          options: [
            { text: "No measurable brain changes", isCorrect: false },
            { text: "Strengthened prefrontal cortex function and reduced amygdala reactivity", isCorrect: true },
            { text: "Increased default mode network activation", isCorrect: false },
            { text: "Decreased hippocampal volume", isCorrect: false }
          ],
          explanation: "Research shows mindfulness strengthens prefrontal regulation of emotional responses and reduces amygdala reactivity to emotional stimuli, supporting better emotion regulation without numbing emotional experience."
        },
        {
          question: "The default mode network is associated with:",
          type: "multipleChoice",
          options: [
            { text: "Focused, present-moment attention", isCorrect: false },
            { text: "Mind-wandering, self-referential thinking, and rumination", isCorrect: true },
            { text: "Physical movement and coordination", isCorrect: false },
            { text: "Language processing only", isCorrect: false }
          ],
          explanation: "The DMN is active during mind-wandering and rumination—both elevated in depression and anxiety. Mindfulness practice reduces DMN activation and helps the brain more quickly interrupt rumination cycles."
        },
        {
          question: "When introducing mindfulness to a client from a religious tradition that has concerns about Buddhist origins, the clinician should:",
          type: "multipleChoice",
          options: [
            { text: "Insist that mindfulness has nothing to do with Buddhism", isCorrect: false },
            { text: "Acknowledge historical roots while emphasizing the secular, evidence-based clinical application", isCorrect: true },
            { text: "Avoid using mindfulness entirely", isCorrect: false },
            { text: "Require the client to accept its Buddhist origins", isCorrect: false }
          ],
          explanation: "Cultural sensitivity means acknowledging historical roots honestly while emphasizing the secular, evidence-based nature of clinical mindfulness—and remaining open to the client's own religious or spiritual framework for understanding the practice."
        },
        {
          question: "Shapiro's model adds clinical precision by highlighting that mindfulness without the right attitudinal quality can become:",
          type: "multipleChoice",
          options: [
            { text: "More effective", isCorrect: false },
            { text: "Harsh self-monitoring rather than compassionate awareness", isCorrect: true },
            { text: "Purely physical exercise", isCorrect: false },
            { text: "A form of dissociation", isCorrect: false }
          ],
          explanation: "Without the attitude component—curiosity, openness, and acceptance—mindfulness can devolve into rigid, judgmental self-observation, which amplifies rather than reduces suffering. The quality of attention matters as much as the attention itself."
        }
      ],
      quizPassThreshold: 0.8
    },

    // ─── SECTION 2 ──────────────────────────────────
    {
      title: "The Evidence Base: What Works, for Whom, and How",
      description: "MBSR, MBCT, mechanisms of change, and meta-analytic findings",
      module: "Module 2: Evidence",
      order: 2,
      estimatedTime: 20,
      contentBlocks: [
        {
          type: "text",
          order: 1,
          textContent: `<h2>Mindfulness-Based Stress Reduction (MBSR)</h2>
<p>Jon Kabat-Zinn developed MBSR at the University of Massachusetts Medical Center in 1979. The program is an 8-week structured intervention consisting of weekly 2.5-hour group sessions plus a full-day retreat, with daily home practice of 45 minutes. Participants learn body scan meditation, sitting meditation, gentle yoga, and walking meditation. MBSR was originally designed for chronic pain patients whom the medical system had failed to help, and its success in that population launched mindfulness into mainstream healthcare.</p>
<p>The evidence for MBSR spans multiple conditions. Meta-analyses show moderate effect sizes for anxiety (Hedges' g ≈ 0.63), depression (g ≈ 0.59), chronic pain (g ≈ 0.33), and psychological distress in medical populations (g ≈ 0.54). MBSR has also demonstrated benefits for immune function, blood pressure, cortisol levels, and quality of life in cancer patients. However, it is important to note that many MBSR studies have methodological limitations—small samples, lack of active control conditions, and self-selected participants—and effect sizes are typically modest rather than dramatic.</p>`
        },
        {
          type: "multipleChoice",
          order: 2,
          question: "MBSR was originally developed for:",
          options: [
            { text: "Depression relapse prevention", isCorrect: false },
            { text: "Chronic pain patients whom the medical system had failed to help", isCorrect: true },
            { text: "Anxiety disorders in outpatient settings", isCorrect: false },
            { text: "Children with ADHD", isCorrect: false }
          ],
          explanation: "Kabat-Zinn developed MBSR in 1979 specifically for chronic pain patients at UMass Medical Center. Its success with this population catalyzed the broader integration of mindfulness into mainstream healthcare."
        },
        {
          type: "text",
          order: 3,
          textContent: `<h2>Mindfulness-Based Cognitive Therapy (MBCT)</h2>
<p>MBCT, developed by Segal, Williams, and Teasdale (2002, 2013), represents the most significant integration of mindfulness with established psychotherapy. MBCT was specifically designed to prevent relapse in recurrent depression, and its evidence base is compelling. Landmark randomized controlled trials demonstrated that MBCT reduces relapse rates by approximately 50% for individuals with three or more previous depressive episodes, compared to treatment as usual. This effect is comparable to maintenance antidepressant medication—making MBCT a viable alternative for patients who prefer a non-pharmacological approach or who experience medication side effects.</p>
<p>The theoretical mechanism of MBCT is elegant: individuals with recurrent depression have established neural pathways that link mild sadness to the full cascade of depressive thinking (rumination, hopelessness, self-criticism). When a vulnerable individual experiences a normal dip in mood, these pathways can rapidly reactivate the entire depressive pattern, triggering relapse. MBCT teaches patients to recognize the early signs of depressive reactivation and to respond with mindful awareness rather than getting caught in the rumination cycle. The key insight is that it is not the initial sadness that triggers relapse—it is the <em>relationship</em> to the sadness. Mindful awareness interrupts the automatic escalation from "I feel sad" to "I am worthless and will always feel this way."</p>
<h2>Mechanisms of Change</h2>
<p>Research has identified several mechanisms through which mindfulness produces clinical benefit: <strong>Decentering/cognitive defusion</strong>—observing thoughts as mental events rather than facts—reduces the power of depressive and anxious cognitions. <strong>Attention regulation</strong>—strengthened capacity to sustain focus and redirect wandering attention—counters the attentional biases that maintain psychological disorders. <strong>Exposure and desensitization</strong>—the non-judgmental observation of difficult internal experiences functions as a form of interoceptive exposure, reducing avoidance. <strong>Self-regulation</strong>—enhanced capacity to modulate emotional and physiological responses. <strong>Values clarification</strong>—the intentional component of mindfulness often leads practitioners to clarify what matters to them, supporting more values-congruent behavior.</p>`
        },
        {
          type: "multipleChoice",
          order: 4,
          question: "MBCT reduces depression relapse rates by approximately 50% specifically for individuals with:",
          options: [
            { text: "A single previous depressive episode", isCorrect: false },
            { text: "Current acute depression", isCorrect: false },
            { text: "Three or more previous depressive episodes", isCorrect: true },
            { text: "Bipolar depression", isCorrect: false }
          ],
          explanation: "MBCT's strongest evidence is for preventing relapse in individuals with three or more previous depressive episodes. For this population, MBCT reduces relapse by approximately 50%—comparable to maintenance antidepressant medication."
        },
        {
          type: "accordion",
          order: 5,
          title: "Beyond MBSR and MBCT: Other Mindfulness-Informed Approaches",
          accordionItems: [
            {
              title: "Acceptance and Commitment Therapy (ACT)",
              content: "ACT integrates mindfulness principles with values-based behavioral activation. Rather than teaching formal meditation, ACT uses experiential exercises to develop psychological flexibility—the ability to be present with difficult internal experiences while taking action guided by personal values. ACT has growing evidence for depression, anxiety, chronic pain, and substance use disorders."
            },
            {
              title: "Dialectical Behavior Therapy (DBT) Mindfulness Module",
              content: "DBT incorporates mindfulness as one of its four core skill modules. DBT mindfulness emphasizes 'what' skills (observe, describe, participate) and 'how' skills (non-judgmentally, one-mindfully, effectively). DBT's approach to mindfulness is more structured and behavioral than MBSR/MBCT, making it accessible to populations with severe emotional dysregulation."
            },
            {
              title: "Mindfulness-Based Relapse Prevention (MBRP)",
              content: "MBRP integrates mindfulness practices with cognitive-behavioral relapse prevention for substance use disorders. It teaches participants to observe cravings with non-judgmental awareness rather than automatically acting on them—'urge surfing' rather than urge suppression. Randomized trials show MBRP reduces substance use days and heavy drinking compared to standard relapse prevention."
            }
          ]
        },
        {
          type: "matching",
          order: 6,
          matchingInstructions: "Match each mechanism of change with its description:",
          matchingPairs: [
            { term: "Decentering", definition: "Observing thoughts as mental events rather than facts, reducing their power" },
            { term: "Attention regulation", definition: "Strengthened ability to sustain focus and redirect wandering attention" },
            { term: "Interoceptive exposure", definition: "Non-judgmental observation of difficult internal experiences reduces avoidance" },
            { term: "Self-regulation", definition: "Enhanced capacity to modulate emotional and physiological responses" },
            { term: "Values clarification", definition: "Increased clarity about what matters, supporting values-congruent behavior" }
          ]
        },
        {
          type: "reflection",
          order: 7,
          question: "Consider a client on your current caseload who might benefit from a mindfulness-based approach. What is their primary presenting concern, and which mindfulness mechanism (decentering, attention regulation, exposure, self-regulation, values clarification) seems most relevant to their needs?"
        }
      ],
      hasQuiz: true,
      quizQuestions: [
        {
          question: "The standard MBSR program consists of:",
          type: "multipleChoice",
          options: [
            { text: "A single weekend retreat", isCorrect: false },
            { text: "8 weekly 2.5-hour sessions plus a full-day retreat with daily home practice", isCorrect: true },
            { text: "12 individual therapy sessions", isCorrect: false },
            { text: "A self-paced online course", isCorrect: false }
          ],
          explanation: "MBSR is a structured 8-week group program with weekly 2.5-hour sessions, a full-day retreat, and 45 minutes of daily home practice. This structured format has been the basis of most MBSR research."
        },
        {
          question: "MBCT's theoretical mechanism for preventing depression relapse involves:",
          type: "multipleChoice",
          options: [
            { text: "Eliminating all negative emotions", isCorrect: false },
            { text: "Interrupting the automatic escalation from sadness to full depressive rumination through mindful awareness", isCorrect: true },
            { text: "Replacing negative thoughts with positive ones", isCorrect: false },
            { text: "Avoiding all situations that trigger sadness", isCorrect: false }
          ],
          explanation: "MBCT works by changing the relationship to sadness—teaching patients to respond to early mood dips with mindful awareness rather than getting caught in the rumination cycle that escalates to full relapse. It's not the initial sadness but the reaction to it that triggers relapse."
        },
        {
          question: "Meta-analytic effect sizes for MBSR across conditions are best described as:",
          type: "multipleChoice",
          options: [
            { text: "Large and dramatic", isCorrect: false },
            { text: "Moderate, with typical Hedges' g values between 0.33 and 0.63", isCorrect: true },
            { text: "Near zero, suggesting no benefit", isCorrect: false },
            { text: "Only significant for chronic pain", isCorrect: false }
          ],
          explanation: "Meta-analyses show moderate effect sizes for MBSR across conditions—meaningful but not dramatic. This is important context for clinicians setting realistic expectations about what mindfulness can and cannot accomplish."
        },
        {
          question: "'Urge surfing' in Mindfulness-Based Relapse Prevention involves:",
          type: "multipleChoice",
          options: [
            { text: "Suppressing cravings through willpower", isCorrect: false },
            { text: "Observing cravings with non-judgmental awareness rather than acting on them", isCorrect: true },
            { text: "Distracting from cravings with pleasant activities", isCorrect: false },
            { text: "Avoiding all situations that trigger cravings", isCorrect: false }
          ],
          explanation: "Urge surfing applies mindful awareness to cravings—observing their rise and fall without automatically acting on them. This approach contrasts with both suppression (which increases craving intensity) and distraction (which doesn't change the relationship to cravings)."
        },
        {
          question: "DBT's mindfulness 'what' skills include:",
          type: "multipleChoice",
          options: [
            { text: "Non-judgmentally, one-mindfully, effectively", isCorrect: false },
            { text: "Observe, describe, participate", isCorrect: true },
            { text: "Breath awareness, body scan, sitting meditation", isCorrect: false },
            { text: "Intention, attention, attitude", isCorrect: false }
          ],
          explanation: "DBT distinguishes between 'what' skills (observe, describe, participate—what you do when being mindful) and 'how' skills (non-judgmentally, one-mindfully, effectively—how you do it). The first option lists the 'how' skills."
        }
      ],
      quizPassThreshold: 0.8
    },

    // ─── SECTION 3 ──────────────────────────────────
    {
      title: "Practical Application: Teaching Mindfulness and Knowing Its Limits",
      description: "Foundational practices, clinical integration, contraindications, and cultural adaptations",
      module: "Module 3: Application",
      order: 3,
      estimatedTime: 20,
      contentBlocks: [
        {
          type: "text",
          order: 1,
          textContent: `<h2>The Therapist's Own Practice as Foundation</h2>
<p>A fundamental principle in mindfulness teaching is that clinicians should have their own personal mindfulness practice before teaching it to clients. This is not merely an aspirational recommendation—it is a clinical necessity. A clinician who teaches mindfulness from a textbook without personal experience is like a swimming instructor who has never been in the water. They may know the theory, but they cannot speak authentically about the experience, anticipate common difficulties, or model the embodied quality of mindful presence that makes the practice compelling.</p>
<p>Personal practice also protects against a subtle but significant clinical error: teaching mindfulness as a technique to "fix" the client. When mindfulness is experienced from the inside, the clinician understands that it is fundamentally about acceptance—not about achieving a particular state. Without this experiential understanding, clinicians may inadvertently communicate that the purpose of mindfulness is to eliminate anxiety, stop negative thoughts, or feel calm—which transforms mindfulness into just another avoidance strategy dressed in contemplative clothing.</p>
<h2>Three Foundational Practices for Clinical Integration</h2>
<p><strong>Breath awareness</strong> is the simplest and most portable mindfulness practice. Guide the client to focus attention on the physical sensations of breathing—the rise and fall of the abdomen, the flow of air through the nostrils—without trying to change the breath. When the mind wanders (and it will), gently notice where it went and return attention to the breath. The instructions should be brief and clear: "Just notice the sensations of breathing. When your mind wanders—and it absolutely will, because that's what minds do—gently bring your attention back. Each time you notice the wandering and return is a successful moment of mindfulness, not a failure."</p>`
        },
        {
          type: "multipleChoice",
          order: 2,
          question: "Why is the clinician's own mindfulness practice considered a clinical necessity rather than just a recommendation?",
          options: [
            { text: "Licensing boards require it", isCorrect: false },
            { text: "Without personal experience, clinicians cannot speak authentically, anticipate difficulties, or model mindful presence", isCorrect: true },
            { text: "Clients will ask about the clinician's practice", isCorrect: false },
            { text: "It reduces the clinician's liability", isCorrect: false }
          ],
          explanation: "Personal practice is clinically necessary because it provides the experiential understanding needed to teach authentically, anticipate common difficulties, model mindful presence, and avoid the error of teaching mindfulness as a 'fix' rather than an acceptance practice."
        },
        {
          type: "text",
          order: 3,
          textContent: `<p><strong>The body scan</strong> systematically moves attention through the body from feet to head (or head to feet), noticing physical sensations in each region without trying to change them. The body scan serves as an introduction to interoceptive awareness—the capacity to notice and tolerate internal sensations—which is therapeutically important for clients who are disconnected from their bodies (common in trauma, chronic pain, and eating disorders). It also demonstrates that attention can be directed deliberately, even when the mind resists.</p>
<p><strong>The STOP technique</strong> is a brief, portable mindfulness practice ideal for integration into daily life: <strong>S</strong>top what you are doing, <strong>T</strong>ake a breath, <strong>O</strong>bserve your internal experience (thoughts, feelings, physical sensations) without judgment, and <strong>P</strong>roceed with awareness. STOP takes less than a minute and can be practiced anywhere—making it particularly useful as an early intervention when clients notice stress, anxiety, or the beginning of a rumination cycle. It can be taught in a single session and assigned as between-session practice.</p>
<h2>Contraindications and Cautions</h2>
<p>Mindfulness is not universally appropriate. Clinicians must exercise clinical judgment about when mindfulness practices may be harmful or premature. <strong>Active psychosis or severe dissociation:</strong> Practices that direct attention inward can intensify psychotic symptoms or trigger dissociative episodes. Clients with active psychosis should not be given mindfulness practices that involve closing eyes and attending to internal experience without careful clinical assessment and modification. <strong>Acute trauma:</strong> For clients in the immediate aftermath of trauma, body-based mindfulness practices like the body scan can be retraumatizing by directing attention to a body that feels unsafe. Stabilization should precede mindfulness-based work with acutely traumatized clients. <strong>Severe depression with suicidal ideation:</strong> The non-judgmental observation stance of mindfulness can sometimes intensify suicidal thoughts in severely depressed individuals who are not yet stabilized. Mindfulness for this population requires careful clinical guidance, not self-directed practice.</p>`
        },
        {
          type: "multipleChoice",
          order: 4,
          question: "For a client in the immediate aftermath of trauma, body-based mindfulness practices like the body scan:",
          options: [
            { text: "Are always the best first intervention", isCorrect: false },
            { text: "Should be avoided as they can be retraumatizing by directing attention to a body that feels unsafe", isCorrect: true },
            { text: "Should be practiced for at least 45 minutes daily", isCorrect: false },
            { text: "Have no contraindications in trauma populations", isCorrect: false }
          ],
          explanation: "The body scan directs attention inward to body sensations—which can be retraumatizing for someone whose body feels unsafe after trauma. Stabilization (grounding, safety, resource-building) should precede any mindfulness-based work with acutely traumatized clients."
        },
        {
          type: "accordion",
          order: 5,
          title: "Practical Integration Tips",
          accordionItems: [
            {
              title: "Starting Small: Brief Practices First",
              content: "When introducing mindfulness to clients, start with 1-3 minute practices rather than the 20-45 minute meditations common in MBSR. Brief practices build confidence and demonstrate immediate benefit without overwhelming clients who may be skeptical or anxious about the practice. Once clients experience the value of brief mindfulness, they are more willing to extend their practice duration gradually."
            },
            {
              title: "Normalizing the Wandering Mind",
              content: "The single most important thing a clinician can do when teaching mindfulness is to normalize mind-wandering. Many clients interpret a wandering mind as failure and quit the practice. Frame the wandering as the practice: 'Every time you notice your mind has wandered and gently bring it back, you have just done a mindfulness rep. The wandering is not failure—the noticing and returning IS the practice.' This reframe can mean the difference between a client who abandons mindfulness and one who develops a sustained practice."
            },
            {
              title: "Cultural Adaptations",
              content: "Mindfulness practices can be adapted for diverse cultural contexts. For clients uncomfortable with the Buddhist associations, practices can be framed through a cognitive-behavioral lens ('attention training') or integrated with the client's own religious or spiritual practices (Christian contemplative prayer, Islamic dhikr, Jewish hitbonenut). For clients from collectivist cultures, group practices or practices that emphasize connection to others (loving-kindness meditation) may be more culturally resonant than individual, internally-focused practices."
            }
          ]
        },
        {
          type: "matching",
          order: 6,
          matchingInstructions: "Match each foundational practice with its primary clinical function:",
          matchingPairs: [
            { term: "Breath awareness", definition: "The simplest, most portable practice for training deliberate present-moment attention" },
            { term: "Body scan", definition: "Develops interoceptive awareness by systematically directing attention through body regions" },
            { term: "STOP technique", definition: "Brief (<1 minute) portable practice for interrupting stress or rumination in daily life" },
            { term: "Loving-kindness meditation", definition: "Cultivates compassion and may be more culturally resonant in collectivist contexts" }
          ]
        },
        {
          type: "multipleChoice",
          order: 7,
          question: "When teaching mindfulness, the single most important message for preventing client dropout is:",
          options: [
            { text: "Practice for at least 45 minutes daily", isCorrect: false },
            { text: "A wandering mind means you are failing", isCorrect: false },
            { text: "Noticing the wandering and returning attention IS the practice, not a failure", isCorrect: true },
            { text: "You should feel calm during every practice session", isCorrect: false }
          ],
          explanation: "Normalizing mind-wandering and reframing it as the actual practice—rather than a failure—is the single most important message for client retention. Many clients quit because they believe their wandering mind means they 'can't meditate.'"
        },
        {
          type: "reflection",
          order: 8,
          question: "Consider how you might introduce mindfulness to a client who is skeptical or has misconceptions about it. Draft a 2-3 sentence explanation you could use in session that addresses the most common concern you anticipate from your client population."
        }
      ],
      hasQuiz: true,
      quizQuestions: [
        {
          question: "The STOP technique stands for:",
          type: "multipleChoice",
          options: [
            { text: "Stop, Think, Observe, Proceed", isCorrect: false },
            { text: "Stop, Take a breath, Observe, Proceed with awareness", isCorrect: true },
            { text: "Sit, Trust, Open, Practice", isCorrect: false },
            { text: "Slow, Time, Orient, Process", isCorrect: false }
          ],
          explanation: "STOP stands for Stop what you're doing, Take a breath, Observe your internal experience without judgment, and Proceed with awareness. It takes less than a minute and can be practiced anywhere."
        },
        {
          question: "Mindfulness is contraindicated or requires significant modification for clients with:",
          type: "multipleChoice",
          options: [
            { text: "Mild anxiety or stress", isCorrect: false },
            { text: "Active psychosis, severe dissociation, or acute trauma", isCorrect: true },
            { text: "Any history of depression", isCorrect: false },
            { text: "Chronic pain", isCorrect: false }
          ],
          explanation: "Mindfulness practices that direct attention inward can intensify psychotic symptoms, trigger dissociation, or be retraumatizing for acutely traumatized clients. These populations require careful assessment and significant modification before mindfulness introduction."
        },
        {
          question: "When introducing mindfulness to clients, the recommended approach is to:",
          type: "multipleChoice",
          options: [
            { text: "Begin with 45-minute meditation sessions", isCorrect: false },
            { text: "Start with 1-3 minute practices that build confidence", isCorrect: true },
            { text: "Assign daily practice without in-session guidance", isCorrect: false },
            { text: "Only teach meditation to clients who request it", isCorrect: false }
          ],
          explanation: "Brief practices (1-3 minutes) build confidence and demonstrate immediate benefit without overwhelming skeptical or anxious clients. Duration can be gradually extended as clients experience the value of the practice."
        },
        {
          question: "For clients from collectivist cultures, which adaptation may be more culturally resonant?",
          type: "multipleChoice",
          options: [
            { text: "Extended silent individual meditation only", isCorrect: false },
            { text: "Group practices or loving-kindness meditation emphasizing connection to others", isCorrect: true },
            { text: "Eliminating all mindfulness practices", isCorrect: false },
            { text: "Using only Western-developed protocols without modification", isCorrect: false }
          ],
          explanation: "Clients from collectivist cultures may find individually-focused, internally-directed practices less resonant. Group practices and loving-kindness meditation, which emphasize connection to others, may be more culturally appropriate and engaging."
        },
        {
          question: "A clinician who teaches mindfulness from a textbook without personal practice risks:",
          type: "multipleChoice",
          options: [
            { text: "Being equally effective as someone with personal practice", isCorrect: false },
            { text: "Teaching mindfulness as a technique to 'fix' the client rather than as an acceptance practice", isCorrect: true },
            { text: "Only minor quality differences", isCorrect: false },
            { text: "Nothing—book knowledge is sufficient", isCorrect: false }
          ],
          explanation: "Without personal experiential understanding, clinicians may inadvertently teach mindfulness as a tool to eliminate anxiety or stop thoughts—transforming it into another avoidance strategy rather than the acceptance practice it fundamentally is."
        }
      ],
      quizPassThreshold: 0.8
    }
  ],

  assessment: {
    title: "Final Assessment",
    timeLimit: 30,
    passThreshold: 0.8,
    attemptsAllowed: 3,
    shuffleQuestions: true,
    shuffleOptions: true,
    questions: [
      {
        question: "Kabat-Zinn defines mindfulness as:", type: "multipleChoice",
        options: [
          { text: "Relaxing deeply while focusing on positive thoughts", isCorrect: false },
          { text: "Paying attention on purpose, in the present moment, non-judgmentally", isCorrect: true },
          { text: "Emptying the mind of all thoughts", isCorrect: false },
          { text: "A Buddhist meditation practice for spiritual development", isCorrect: false }
        ],
        explanation: "Kabat-Zinn's definition emphasizes three components: intentionality (on purpose), temporal focus (present moment), and attitudinal quality (non-judgmentally). Each component counters specific patterns that maintain psychological distress."
      },
      {
        question: "Shapiro's three-component model includes intention, attention, and:", type: "multipleChoice",
        options: [
          { text: "Relaxation", isCorrect: false },
          { text: "Attitude", isCorrect: true },
          { text: "Achievement", isCorrect: false },
          { text: "Analysis", isCorrect: false }
        ],
        explanation: "Shapiro's model identifies intention (why), attention (the awareness itself), and attitude (the quality of that attention—curiosity, openness, acceptance) as the three interacting components of mindfulness."
      },
      {
        question: "Decentering in mindfulness refers to:", type: "multipleChoice",
        options: [
          { text: "Physically moving away from stressful situations", isCorrect: false },
          { text: "Observing thoughts as mental events rather than facts about reality", isCorrect: true },
          { text: "Centering attention on the breath", isCorrect: false },
          { text: "Avoiding negative thoughts entirely", isCorrect: false }
        ],
        explanation: "Decentering shifts from being identified with thought content ('I am worthless') to observing thoughts as passing mental events ('I notice a thought about worthlessness'). This is a core mechanism of change in MBCT."
      },
      {
        question: "MBSR was originally developed for:", type: "multipleChoice",
        options: [
          { text: "Depression in college students", isCorrect: false },
          { text: "Chronic pain patients at UMass Medical Center", isCorrect: true },
          { text: "Anxiety disorders in veterans", isCorrect: false },
          { text: "PTSD in trauma survivors", isCorrect: false }
        ],
        explanation: "Kabat-Zinn developed MBSR in 1979 for chronic pain patients whom the medical system had failed to help. Its success in this population launched mindfulness into mainstream healthcare."
      },
      {
        question: "MBCT is most strongly supported for:", type: "multipleChoice",
        options: [
          { text: "Acute depression treatment", isCorrect: false },
          { text: "Preventing relapse in individuals with 3+ prior depressive episodes", isCorrect: true },
          { text: "First-episode depression", isCorrect: false },
          { text: "Bipolar depression management", isCorrect: false }
        ],
        explanation: "MBCT's strongest evidence is for relapse prevention in individuals with three or more prior depressive episodes, reducing relapse by approximately 50%—comparable to maintenance antidepressant medication."
      },
      {
        question: "The default mode network is relevant to mindfulness because:", type: "multipleChoice",
        options: [
          { text: "It controls physical relaxation", isCorrect: false },
          { text: "It is active during rumination, and mindfulness reduces its dominance", isCorrect: true },
          { text: "It only activates during meditation", isCorrect: false },
          { text: "It has no relationship to psychological disorders", isCorrect: false }
        ],
        explanation: "The DMN is active during mind-wandering and rumination—central features of depression and anxiety. Mindfulness practice reduces DMN activation and strengthens the brain's ability to interrupt rumination cycles."
      },
      {
        question: "The body scan is particularly useful for clients who:", type: "multipleChoice",
        options: [
          { text: "Are in acute trauma crisis", isCorrect: false },
          { text: "Are disconnected from their bodies, as in chronic pain or eating disorders", isCorrect: true },
          { text: "Have active psychosis", isCorrect: false },
          { text: "Prefer not to close their eyes", isCorrect: false }
        ],
        explanation: "The body scan develops interoceptive awareness—the capacity to notice and tolerate internal sensations—which is therapeutically important for clients disconnected from bodily experience. However, it requires caution with acutely traumatized clients."
      },
      {
        question: "When a client says 'I can't meditate—my mind won't stop thinking,' the best response is:", type: "multipleChoice",
        options: [
          { text: "'Try harder to focus'", isCorrect: false },
          { text: "'Noticing the wandering IS the practice—every time you notice and return, that's a successful moment of mindfulness'", isCorrect: true },
          { text: "'Mindfulness probably isn't for you'", isCorrect: false },
          { text: "'You need to practice more before it works'", isCorrect: false }
        ],
        explanation: "Normalizing mind-wandering and reframing the noticing-and-returning as the actual practice (rather than a failure) is the most important message for preventing dropout and building a sustainable mindfulness practice."
      },
      {
        question: "Mindfulness practices should be modified or avoided for clients with:", type: "multipleChoice",
        options: [
          { text: "Mild to moderate anxiety", isCorrect: false },
          { text: "Active psychosis or severe dissociative symptoms", isCorrect: true },
          { text: "Chronic stress", isCorrect: false },
          { text: "Relationship difficulties", isCorrect: false }
        ],
        explanation: "Inward-directed mindfulness practices can intensify psychotic symptoms and trigger dissociative episodes. These populations require careful clinical assessment and significant modification before any mindfulness introduction."
      },
      {
        question: "The STOP technique includes all EXCEPT:", type: "multipleChoice",
        options: [
          { text: "Stop what you are doing", isCorrect: false },
          { text: "Take a breath", isCorrect: false },
          { text: "Think about what went wrong", isCorrect: true },
          { text: "Proceed with awareness", isCorrect: false }
        ],
        explanation: "STOP stands for Stop, Take a breath, Observe (not Think/analyze), and Proceed with awareness. The 'O' involves non-judgmental observation of internal experience, not analytical thinking about causes."
      },
      {
        question: "A clinician's personal mindfulness practice is important because:", type: "multipleChoice",
        options: [
          { text: "It is required by all licensing boards", isCorrect: false },
          { text: "It provides experiential understanding needed to teach authentically and avoid reducing mindfulness to a 'fix-it' technique", isCorrect: true },
          { text: "Clients always ask about the clinician's practice", isCorrect: false },
          { text: "It replaces the need for clinical training", isCorrect: false }
        ],
        explanation: "Personal practice provides the experiential foundation for authentic teaching, the ability to anticipate difficulties, and the understanding that mindfulness is about acceptance—not about achieving a particular state."
      },
      {
        question: "Meta-analytic effect sizes for MBSR are best described as:", type: "multipleChoice",
        options: [
          { text: "Uniformly large across all conditions", isCorrect: false },
          { text: "Moderate, with meaningful but not dramatic benefits", isCorrect: true },
          { text: "Near zero for all mental health conditions", isCorrect: false },
          { text: "Only significant when combined with medication", isCorrect: false }
        ],
        explanation: "Meta-analyses show moderate effect sizes (Hedges' g between 0.33 and 0.63) across conditions. This is clinically meaningful but not dramatic—important context for setting realistic expectations."
      },
      {
        question: "Structural brain changes from mindfulness have been observed after:", type: "multipleChoice",
        options: [
          { text: "A single meditation session", isCorrect: false },
          { text: "As little as 8 weeks of regular practice", isCorrect: true },
          { text: "At least 5 years of daily practice", isCorrect: false },
          { text: "Structural changes have not been documented", isCorrect: false }
        ],
        explanation: "MRI studies have documented structural brain changes—including increased gray matter in the hippocampus and decreased amygdala density—after as little as 8 weeks of regular mindfulness practice, demonstrating neuroplasticity effects."
      },
      {
        question: "MBCT works primarily by:", type: "multipleChoice",
        options: [
          { text: "Replacing negative thoughts with positive ones", isCorrect: false },
          { text: "Changing the relationship to sadness so it doesn't automatically escalate to full depressive rumination", isCorrect: true },
          { text: "Eliminating all stress from the client's life", isCorrect: false },
          { text: "Providing social support through the group format", isCorrect: false }
        ],
        explanation: "MBCT's mechanism is about relationship to experience: it teaches patients to respond to early sadness with mindful awareness rather than getting caught in the automatic rumination that escalates to relapse."
      },
      {
        question: "For culturally responsive mindfulness teaching, clinicians should:", type: "multipleChoice",
        options: [
          { text: "Use identical protocols regardless of cultural context", isCorrect: false },
          { text: "Adapt practices for cultural context, including framing through the client's own spiritual traditions when appropriate", isCorrect: true },
          { text: "Avoid mindfulness entirely with non-Western clients", isCorrect: false },
          { text: "Only teach mindfulness to clients who identify as Buddhist", isCorrect: false }
        ],
        explanation: "Culturally responsive practice means adapting mindfulness for context—framing it through the client's own traditions when appropriate, using group practices for collectivist cultures, and acknowledging Buddhist roots while emphasizing secular clinical application."
      }
    ]
  }
};

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;
    const result = await db.collection('interactivecourses').updateOne(
      { slug: SLUG },
      { $set: { ...COURSE, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true }
    );
    console.log(result.upsertedCount ? '✅ Created' : '♻️ Updated', SLUG);
    await mongoose.disconnect();
  } catch (err) { console.error('❌', err); process.exit(1); }
}

seed();
