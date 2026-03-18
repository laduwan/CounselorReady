/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';
import Course from '../models/Course.js';
import dotenv from 'dotenv';
dotenv.config();

// ── CR-202: Trauma-Informed Approaches to Anxiety Disorders ──────────────────
const cr202Course = {
  title: 'Trauma-Informed Approaches to Anxiety Disorders',
  slug: 'trauma-informed-anxiety-cr202',
  courseCode: 'CR-202',
  description: 'A 2-hour CE course on recognizing and addressing the trauma foundations of anxiety presentations, neurobiological connections, trauma-sensitive assessment, and adapted evidence-based treatments.',
  shortDescription: 'Explore the neurobiological links between trauma and anxiety disorders, and learn trauma-informed treatment modifications.',
  ceHours: 2.0,
  ceType: 'Clinical',
  level: 'intermediate',
  deliveryMethod: 'Asynchronous Online Learning',
  author: 'GA Integrated Therapeutic Perspectives LLC',
  nbccApproved: true,
  nbccProviderNumber: '7760',
  isPublished: true,
  isFree: false,
  price: 39.99,
  learningObjectives: [
    'Explain the neurobiological connections between trauma exposure and anxiety symptom development.',
    'Identify ways that unresolved trauma may present as or contribute to anxiety disorder symptoms.',
    'Conduct trauma-informed assessments that screen for trauma history without causing retraumatization.',
    'Differentiate between primary anxiety disorders and trauma-based anxiety presentations.',
    'Implement trauma-informed modifications to cognitive-behavioral anxiety treatments.',
    'Integrate exposure-based interventions with trauma processing techniques.',
    'Recognize and manage dissociative responses that may emerge during anxiety treatment.',
    'Apply trauma-informed principles across diverse anxiety presentations and client populations.',
  ],
  modules: [
    {
      title: 'The Neurobiology of Trauma and Anxiety',
      order: 1,
      lessons: [{
        title: 'Module 1: The Neurobiology of Trauma and Anxiety',
        content: `<h2>The Neurobiology of Trauma and Anxiety</h2><p>The Neurobiology of Trauma and Anxiety

## Introduction: Understanding the Trauma-Anxiety Connection

The relationship between trauma exposure and anxiety disorders has been documented across multiple decades of research, yet clinical practice has often treated these as separate domains requiring distinct assessment and intervention approaches. Traditional diagnostic frameworks have categorized Post-Traumatic Stress Disorder (PTSD) separately from anxiety disorders, creating an artificial separation that fails to capture the substantial overlap in symptom presentation, underlying neurobiology, and treatment considerations. The DSM-5's reclassification of PTSD as a trauma and stressor-related disorder rather than an anxiety disorder represented an important recognition of trauma's unique features, yet it may have inadvertently reinforced the perception that trauma and anxiety occupy distinct clinical territories.

In clinical reality, trauma and anxiety exist along a continuum with substantial interconnections. Individuals who have experienced trauma frequently develop anxiety symptoms even when their presentation does not meet full criteria for PTSD. Conversely, individuals presenting with anxiety disorders often have significant trauma histories that may not be immediately apparent in their symptom presentation but that profoundly affect treatment engagement, intervention effectiveness, and clinical course. The failure to recognize these connections leads to several problematic clinical scenarios: anxiety treatments that fail because underlying trauma remains unaddressed, trauma histories that go undetected because assessment focuses exclusively on current anxiety symptoms, and therapeutic relationships that rupture when anxiety interventions trigger trauma responses t</p>`,
        order: 1,
        duration: 30
      }]
    },
    {
      title: 'Trauma-Informed Assessment of Anxiety',
      order: 2,
      lessons: [{
        title: 'Module 2: Trauma-Informed Assessment of Anxiety',
        content: `<h2>Trauma-Informed Assessment of Anxiety</h2><p>Trauma-Informed Assessment of Anxiety

## Introduction: Principles of Trauma-Informed Assessment

Trauma-informed assessment balances two competing imperatives: the clinical need to identify trauma history and its effects on current functioning, and the ethical obligation to avoid retraumatization through the assessment process itself. Traditional assessment practices often failed on both counts—either avoiding trauma inquiry entirely (missing crucial clinical information) or conducting trauma assessments in ways that were interrogatory, pressured, or insensitive to the client's current capacity to discuss traumatic experiences without becoming dysregulated.

A trauma-informed approach to anxiety assessment incorporates several core principles. **Safety** is paramount—the assessment environment, process, and clinician demeanor must communicate physical and emotional safety. This includes practical elements like meeting in a private space with clear exits, sitting at angles rather than directly facing the client (which can feel confrontational), and allowing the client to choose where they sit. It also includes relational elements like the clinician's tone of voice, pacing of questions, responsiveness to the client's nonverbal cues, and explicit permission to decline questions or take breaks.

**Empowerment and client control** guide the assessment process. Rather than following a rigid protocol that the clinician controls, trauma-informed assessment offers choices about what to discuss, when, and how much. The clinician might say, \"I'd like to understand your history, including any difficult or traumatic experiences you've had. Some people find it helpful to talk about these things, while others prefer to focus on current symptoms. What feels right for you today?\" This </p>`,
        order: 1,
        duration: 30
      }]
    },
    {
      title: 'Adapting Evidence-Based Anxiety Treatments',
      order: 3,
      lessons: [{
        title: 'Module 3: Adapting Evidence-Based Anxiety Treatments',
        content: `<h2>Adapting Evidence-Based Anxiety Treatments</h2><p>Adapting Evidence-Based Anxiety Treatments

## Introduction: Trauma-Informed Modifications to Standard Protocols

Evidence-based treatments for anxiety disorders—particularly cognitive-behavioral therapy (CBT), exposure therapy, and cognitive restructuring—have demonstrated effectiveness across diverse anxiety presentations. However, these treatments were primarily developed and tested with non-traumatized populations, and their application to trauma survivors requires meaningful adaptation. Simply applying standard anxiety protocols to clients with trauma histories risks several problematic outcomes: treatment dropout when interventions trigger overwhelming trauma responses, treatment failure when underlying trauma is not addressed, and retraumatization when exposure or other techniques activate trauma material without adequate support for processing it.

Trauma-informed adaptation of anxiety treatments does not require abandoning evidence-based approaches but rather modifying their implementation to account for trauma-related vulnerabilities. These modifications address: **pacing** (proceeding more gradually to prevent overwhelming dysregulation), **preparation** (building emotion regulation and grounding skills before exposure), **processing** (addressing trauma memories and meanings alongside anxiety symptoms), and **relationship** (attending to power dynamics, trust-building, and collaborative decision-making more explicitly than standard protocols specify).

The fundamental question in trauma-informed anxiety treatment is whether to address trauma first, address anxiety first, or integrate trauma and anxiety treatment. This decision depends on several factors: the severity and complexity of trauma symptoms, the degree to which trauma maintains current anxiety, the</p>`,
        order: 1,
        duration: 30
      }]
    },
    {
      title: 'Integration and Special Populations',
      order: 4,
      lessons: [{
        title: 'Module 4: Integration and Special Populations',
        content: `<h2>Integration and Special Populations</h2><p>Integration and Special Populations

## Introduction: Bringing It All Together

Trauma-informed approaches to anxiety treatment represent an integration of trauma-focused interventions and anxiety-specific techniques rather than a complete departure from evidence-based anxiety protocols. The goal is to maintain the effectiveness of established anxiety treatments while adapting them to meet the needs of trauma survivors. This integration requires clinical judgment about sequencing, pacing, and emphasis based on comprehensive case formulation and ongoing assessment of treatment response.

Three general approaches to integration have empirical support and clinical utility. **Sequential treatment** involves completing trauma-focused therapy first, addressing PTSD or trauma-related symptoms until they are stabilized or resolved, then implementing anxiety-specific interventions for remaining anxiety symptoms. This approach is appropriate when trauma symptoms are severe, when trauma clearly predates and appears to have caused anxiety symptoms, or when initial attempts at anxiety treatment produce overwhelming trauma responses. The advantage is that trauma processing occurs in a focused, intensive way without competing treatment targets. The disadvantage is extended time before addressing anxiety symptoms that may be the client's primary concern.

**Concurrent treatment** implements trauma-focused therapy and anxiety treatment in parallel, typically in separate sessions or with different providers. For example, a client might attend weekly trauma-focused therapy with one clinician and participate in an anxiety management group with another clinician. This approach is appropriate when both trauma and anxiety symptoms require urgent attention, when the client has sufficient resources and motivation to engage in both treatments simultaneously, and when providers can coordinate effectively to avoid conflicting approaches or overwhelming the client.</p>

<p><strong>Integrated treatment</strong> weaves trauma-focused and anxiety-specific interventions within the same treatment sessions, using a unified case conceptualization that addresses both trauma and anxiety as interconnected aspects of the client's presentation. This is the most clinically sophisticated approach and requires the therapist to hold both a trauma lens and an anxiety-specific treatment framework simultaneously. Integrated treatment is appropriate when trauma and anxiety are deeply intertwined, when the client's primary concern is anxiety but trauma clearly underlies it, and when the therapist has expertise in both domains.</p>

<h3>Special Population Considerations</h3>
<p>Certain populations require additional modifications to trauma-informed anxiety treatment. <strong>Children and adolescents</strong> benefit from developmentally adapted approaches that incorporate play-based elements, caregiver involvement, and psychoeducation calibrated to cognitive development. <strong>Older adults</strong> may present with anxiety symptoms that reflect cumulative lifetime trauma exposure and may require attention to medical comorbidities, cognitive changes, and loss-related stressors. <strong>Military veterans and first responders</strong> often experience trauma in the context of occupational identity and may benefit from approaches that honor their service while addressing occupational trauma. <strong>LGBTQ+ individuals</strong> may present with anxiety rooted in minority stress, identity-related trauma, or experiences of discrimination that require culturally affirming, trauma-informed treatment modifications.</p>

<p>Across all populations, the guiding principle remains the same: maintain the effectiveness of evidence-based anxiety treatments while adapting them to honor the trauma survivor's need for safety, choice, collaboration, and empowerment.</p>`,
        order: 1,
        duration: 30
      }]
    }
  ],
  quiz: {
    passingScore: 80,
    maxAttempts: 3,
    questions: [
    {
        "question": "The amygdala's role in trauma-related anxiety is primarily to:",
        "options": [
            "Store narrative memories of traumatic events",
            "Provide top-down cognitive regulation of emotions",
            "Rapidly detect threats and initiate defensive responses before conscious awareness",
            "Distinguish between past trauma and current safety"
        ],
        "correctAnswer": 2,
        "order": 1
    },
    {
        "question": "Which presentation most suggests trauma-based anxiety rather than primary anxiety disorder?",
        "options": [
            "Social anxiety involving fear of negative evaluation across diverse social contexts",
            "Social anxiety that developed after sexual assault and specifically involves avoidance of situations resembling the assault",
            "Worry about multiple life domains without identified traumatic experiences",
            "Specific phobia of heights without traumatic height-related experiences"
        ],
        "correctAnswer": 1,
        "order": 2
    },
    {
        "question": "The trauma-informed approach to screening for trauma history involves:",
        "options": [
            "Requiring detailed trauma disclosure in the first session",
            "Avoiding trauma inquiry to prevent retraumatization",
            "Using broad questions and allowing sequential disclosure based on client readiness",
            "Only asking about trauma if the client spontaneously mentions it"
        ],
        "correctAnswer": 2,
        "order": 3
    },
    {
        "question": "A client reports severe physiological anxiety without proportionate worry content. This pattern most suggests:",
        "options": [
            "Malingering",
            "Primary generalized anxiety disorder",
            "Trauma-based hyperarousal driven by neurobiological changes",
            "Panic disorder with typical presentation"
        ],
        "correctAnswer": 2,
        "order": 4
    },
    {
        "question": "Before beginning exposure therapy with trauma survivors, trauma-informed practice emphasizes:",
        "options": [
            "Proceeding immediately to high-intensity exposures",
            "Building emotion regulation and grounding skills first",
            "Eliminating all safety signals before beginning",
            "Avoiding any discussion of the trauma history"
        ],
        "correctAnswer": 1,
        "order": 5
    },
    {
        "question": "When a client dissociates during exposure, the appropriate response is to:",
        "options": [
            "Continue the exposure because dissociation indicates important material is being accessed",
            "Pause exposure, implement grounding, and modify future exposures",
            "Interpret dissociation as resistance requiring confrontation",
            "Terminate treatment because dissociation indicates inappropriateness for anxiety treatment"
        ],
        "correctAnswer": 1,
        "order": 6
    },
    {
        "question": "Cognitive work with trauma-related self-blame (\"I should have fought back\") is best approached by:",
        "options": [
            "Directly telling the client it wasn't their fault",
            "Avoiding discussion because it's too distressing",
            "Using Socratic dialogue to help examine the belief from multiple perspectives",
            "Agreeing with the client to build rapport"
        ],
        "correctAnswer": 2,
        "order": 7
    },
    {
        "question": "The hippocampus's role in trauma includes:",
        "options": [
            "Initiating rapid fear responses",
            "Encoding contextual and temporal information about traumatic events",
            "Regulating the stress hormone cortisol",
            "Storing explicit emotional meanings of trauma"
        ],
        "correctAnswer": 1,
        "order": 8
    },
    {
        "question": "Trauma-informed interoceptive exposure for panic disorder should:",
        "options": [
            "Proceed identically to standard panic treatment protocols",
            "Include processing of what sensations mean and distinguishing trauma-related from current sensations",
            "Be avoided entirely with trauma survivors",
            "Only target sensations unrelated to the trauma"
        ],
        "correctAnswer": 1,
        "order": 9
    },
    {
        "question": "Which principle is NOT characteristic of trauma-informed assessment?",
        "options": [
            "Ensuring client safety and providing choices about disclosure",
            "Explaining the purpose of trauma-related questions",
            "Following a rigid protocol regardless of client responses",
            "Validating trauma disclosure when it occurs"
        ],
        "correctAnswer": 2,
        "order": 10
    },
    {
        "question": "Complex PTSD differs from PTSD primarily by including:",
        "options": [
            "No differences\u2014they are identical conditions",
            "Additional disturbances in self-organization including affect dysregulation and interpersonal difficulties",
            "More severe intrusion symptoms",
            "Shorter symptom duration requirements"
        ],
        "correctAnswer": 1,
        "order": 11
    },
    {
        "question": "When deciding between sequential, concurrent, or integrated trauma and anxiety treatment, the decision should be based on:",
        "options": [
            "Always treating trauma first",
            "Always using the most efficient approach",
            "Comprehensive case formulation considering multiple factors",
            "Client preference without clinical input"
        ],
        "correctAnswer": 2,
        "order": 12
    },
    {
        "question": "Grounding techniques in trauma-informed practice are used to:",
        "options": [
            "Punish dissociative behavior",
            "Help clients stay present and manage dissociation",
            "Replace all other coping strategies",
            "Avoid discussing trauma entirely"
        ],
        "correctAnswer": 1,
        "order": 13
    },
    {
        "question": "Trauma-informed exposure hierarchy construction should:",
        "options": [
            "Include situations with genuine current danger to build resilience",
            "Carefully distinguish trauma reminders that can be safely approached from situations with actual current threat",
            "Proceed identically to exposure for primary anxiety disorders",
            "Avoid all situations remotely connected to trauma"
        ],
        "correctAnswer": 1,
        "order": 14
    },
    {
        "question": "Which statement best describes the relationship between trauma and anxiety disorders?",
        "options": [
            "They are completely separate conditions requiring entirely different treatments",
            "Trauma always causes PTSD, never anxiety disorders",
            "Trauma exposure frequently contributes to anxiety disorders, requiring integrated assessment and adapted treatment",
            "Standard anxiety treatment is equally effective for all clients regardless of trauma history"
        ],
        "correctAnswer": 2,
        "order": 15
    }
]
  },
  settings: { certificateEnabled: true, evaluationRequired: true }
};

// ── CR-203: Cognitive Reframing for Anxiety ──────────────────────────────────
const cr203Course = {
  title: 'Cognitive Reframing for Anxiety: Evidence-Based Strategies for Clinical Practice',
  slug: 'cognitive-reframing-anxiety-cr203',
  courseCode: 'CR-203',
  description: 'A 6-hour CE course on evidence-based cognitive reframing for anxiety, covering cognitive distortions, Socratic questioning, thought records, behavioral experiments, cultural considerations, and relapse prevention.',
  shortDescription: 'Master evidence-based cognitive reframing techniques for anxiety across six structured modules.',
  ceHours: 6.0,
  ceType: 'Clinical',
  level: 'intermediate',
  deliveryMethod: 'Asynchronous Online Learning',
  author: 'GA Integrated Therapeutic Perspectives LLC',
  nbccApproved: true,
  nbccProviderNumber: '7760',
  isPublished: true,
  isFree: false,
  price: 98.00,
  learningObjectives: [
    'Explain the theoretical foundations and neurobiological basis of cognitive reframing for anxiety.',
    'Identify at least five common cognitive distortions in anxious client presentations.',
    'Apply core cognitive reframing techniques including Socratic questioning, thought records, and behavioral experiments.',
    'Implement advanced reframing strategies for complex anxiety presentations including core belief modification.',
    'Adapt cognitive reframing techniques for diverse populations with cultural responsiveness.',
    'Develop relapse prevention and maintenance plans that support long-term treatment gains.',
  ],
  modules: [
    {
      title: 'Rewiring the Worry Circuit: Foundations of Cognitive Reframing',
      order: 1,
      lessons: [{
        title: 'Module 1: Rewiring the Worry Circuit: Foundations of Cognitive Reframing',
        content: `<h2>Rewiring the Worry Circuit: Foundations of Cognitive Reframing</h2><p>This module introduces the theoretical foundations of cognitive reframing, including Beck's cognitive model, the neurobiological basis of cognitive change, and the core principles distinguishing effective reframing from positive thinking. Clinicians will learn the fundamental premise that emotional responses are shaped by our interpretations of events, and develop personal familiarity with cognitive reframing as a foundation for clinical authenticity.</p>`,
        order: 1,
        duration: 60
      }],
      moduleQuiz: {
        passingScore: 80,
        questions: [
        {
                "question": "According to Beck's cognitive therapy model, emotional responses are primarily shaped by:",
                "options": [
                        "The severity of external events",
                        "Childhood attachment patterns exclusively",
                        "Our interpretations of events",
                        "Unconscious defense mechanisms"
                ],
                "correctAnswer": 2,
                "order": 1
        },
        {
                "question": "What neurobiological change has research associated with consistent cognitive reframing practice?",
                "options": [
                        "Increased amygdala activation",
                        "Strengthened prefrontal cortex regulation over amygdala reactivity",
                        "Reduced hippocampal volume",
                        "Decreased neurotransmitter production"
                ],
                "correctAnswer": 1,
                "order": 2
        },
        {
                "question": "Effective cognitive reframing differs from positive thinking in that it emphasizes:",
                "options": [
                        "Always finding the bright side of situations",
                        "Suppressing negative emotions",
                        "Developing realistic rather than simply optimistic thoughts",
                        "Avoiding discussion of worst-case scenarios"
                ],
                "correctAnswer": 2,
                "order": 3
        },
        {
                "question": "When clients initially resist cognitive reframing, clinicians should:",
                "options": [
                        "Insist more firmly on the reframing technique",
                        "Provide empathic validation while using gentle Socratic questioning",
                        "Move to a different therapeutic modality immediately",
                        "Challenge the client's resistance directly"
                ],
                "correctAnswer": 1,
                "order": 4
        },
        {
                "question": "Why is developing personal familiarity with reframing recommended for clinicians?",
                "options": [
                        "It is required for NBCC certification",
                        "It strengthens clinical authenticity and understanding",
                        "Clients will ask about the clinician's personal experience",
                        "It replaces the need for formal training"
                ],
                "correctAnswer": 1,
                "order": 5
        }
]
      }
    },
    {
      title: 'The Anxiety Decoder: Identifying Cognitive Distortions in Clinical Presentations',
      order: 2,
      lessons: [{
        title: 'Module 2: The Anxiety Decoder: Identifying Cognitive Distortions in Clinical Presentations',
        content: `<h2>The Anxiety Decoder: Identifying Cognitive Distortions in Clinical Presentations</h2><p>This module explores identification of cognitive distortions in anxious client presentations. Clinicians will learn to recognize catastrophizing, mind reading, all-or-nothing thinking, overgeneralization, and other distortion patterns that maintain anxiety across diverse anxiety disorders and cultural contexts.</p>`,
        order: 1,
        duration: 60
      }],
      moduleQuiz: {
        passingScore: 80,
        questions: [
        {
                "question": "A client states, 'If I make one mistake in my presentation, my entire career is ruined.' This best exemplifies which cognitive distortion?",
                "options": [
                        "Mind reading",
                        "Emotional reasoning",
                        "Catastrophizing combined with all-or-nothing thinking",
                        "Overgeneralization"
                ],
                "correctAnswer": 2,
                "order": 6
        },
        {
                "question": "Which cognitive distortion is most commonly associated with social anxiety maintenance?",
                "options": [
                        "Overgeneralization",
                        "Mind reading",
                        "Emotional reasoning",
                        "Magnification"
                ],
                "correctAnswer": 1,
                "order": 7
        },
        {
                "question": "When a client says, 'I feel terrified, so something bad must be about to happen,' they are demonstrating:",
                "options": [
                        "Appropriate threat detection",
                        "Catastrophizing",
                        "Emotional reasoning",
                        "Mind reading"
                ],
                "correctAnswer": 3,
                "order": 8
        },
        {
                "question": "Which linguistic markers often signal cognitive distortions in client speech?",
                "options": [
                        "Sometimes, perhaps, might",
                        "Always, never, should, must, everyone, no one",
                        "Possibly, occasionally, some",
                        "Maybe, could be, uncertain"
                ],
                "correctAnswer": 2,
                "order": 9
        },
        {
                "question": "Overgeneralization differs from catastrophizing in that overgeneralization:",
                "options": [
                        "Focuses on worst-case future outcomes",
                        "Transforms single experiences into universal patterns",
                        "Involves assuming knowledge of others' thoughts",
                        "Uses feelings as evidence of reality"
                ],
                "correctAnswer": 1,
                "order": 10
        }
]
      }
    },
    {
      title: 'The Reframe Game: Mastering Core Intervention Techniques',
      order: 3,
      lessons: [{
        title: 'Module 3: The Reframe Game: Mastering Core Intervention Techniques',
        content: `<h2>The Reframe Game: Mastering Core Intervention Techniques</h2><p>This module covers core intervention techniques of cognitive reframing, including Socratic questioning, thought records, behavioral experiments, and evidence gathering. Clinicians will practice guiding clients toward balanced, realistic thinking without invalidating their emotional experience.</p>`,
        order: 1,
        duration: 60
      }],
      moduleQuiz: {
        passingScore: 80,
        questions: [
        {
                "question": "Socratic questioning is preferred over direct challenging of distorted thoughts because:",
                "options": [
                        "It requires less clinical training",
                        "Clients reach conclusions through their own reasoning, generating more durable change",
                        "It takes less session time",
                        "Direct challenging is considered unethical"
                ],
                "correctAnswer": 1,
                "order": 11
        },
        {
                "question": "The components of a thought record include all of the following EXCEPT:",
                "options": [
                        "Triggering situation and automatic thoughts",
                        "Evidence for and against the automatic thought",
                        "Detailed family history of the client",
                        "Balanced alternative thought and emotional shift"
                ],
                "correctAnswer": 2,
                "order": 12
        },
        {
                "question": "When designing behavioral experiments for anxious clients, clinicians should ensure:",
                "options": [
                        "The experiment immediately addresses the client's core fear",
                        "Experiments are appropriately graduated to prevent overwhelming anxiety",
                        "The client completes the experiment alone without prior discussion",
                        "Only one experiment is ever conducted per presenting concern"
                ],
                "correctAnswer": 1,
                "order": 13
        },
        {
                "question": "The decatastrophizing technique involves:",
                "options": [
                        "Avoiding discussion of worst-case scenarios",
                        "Walking clients through feared scenarios to completion to examine survivability",
                        "Providing reassurance that bad outcomes will not occur",
                        "Challenging clients to face their greatest fears immediately"
                ],
                "correctAnswer": 2,
                "order": 14
        },
        {
                "question": "Cost-benefit analysis is particularly useful when clients:",
                "options": [
                        "Have no insight into their cognitive distortions",
                        "View their anxious thoughts as protective and functional",
                        "Refuse to complete thought records",
                        "Present with primarily somatic symptoms"
                ],
                "correctAnswer": 1,
                "order": 15
        }
]
      }
    },
    {
      title: 'Beyond the Basics: Advanced Reframing for Complex Anxiety Presentations',
      order: 4,
      lessons: [{
        title: 'Module 4: Beyond the Basics: Advanced Reframing for Complex Anxiety Presentations',
        content: `<h2>Beyond the Basics: Advanced Reframing for Complex Anxiety Presentations</h2><p>This module addresses advanced reframing strategies for complex presentations including core belief modification, schema-focused work, imagery rescripting, and working with clients who have chronic anxiety, comorbid trauma, or treatment resistance.</p>`,
        order: 1,
        duration: 60
      }],
      moduleQuiz: {
        passingScore: 80,
        questions: [
        {
                "question": "Core belief modification is indicated when:",
                "options": [
                        "A client successfully reframes isolated automatic thoughts",
                        "Surface-level reframing succeeds but new automatic thoughts continue emerging from underlying beliefs",
                        "The client prefers medication management",
                        "Standard cognitive techniques work well"
                ],
                "correctAnswer": 2,
                "order": 16
        },
        {
                "question": "Metacognitive approaches are particularly useful for clients who:",
                "options": [
                        "Have clearly identifiable cognitive distortions",
                        "Experience anxiety about having anxiety, creating recursive loops",
                        "Respond well to behavioral experiments",
                        "Have limited insight into their thinking patterns"
                ],
                "correctAnswer": 1,
                "order": 17
        },
        {
                "question": "Imagery rescripting differs from standard cognitive restructuring in that it:",
                "options": [
                        "Requires no client participation",
                        "Accesses emotional processing through imaginal work that verbal approaches may not reach",
                        "Focuses exclusively on future scenarios",
                        "Eliminates the need for Socratic questioning"
                ],
                "correctAnswer": 2,
                "order": 18
        },
        {
                "question": "Acceptance-based reframing is particularly valuable for:",
                "options": [
                        "Specific phobias with clear behavioral avoidance",
                        "Generalized anxiety and health anxiety where reassurance-seeking maintains the disorder",
                        "Acute stress responses with identifiable triggers",
                        "Performance anxiety with upcoming deadlines"
                ],
                "correctAnswer": 1,
                "order": 19
        },
        {
                "question": "Integration of somatic awareness into cognitive reframing is important because:",
                "options": [
                        "Physical symptoms are always the primary concern",
                        "It creates comprehensive intervention addressing both cognitive and physical anxiety pathways",
                        "Somatic work replaces the need for cognitive techniques",
                        "Insurance requires documentation of physical symptoms"
                ],
                "correctAnswer": 2,
                "order": 20
        }
]
      }
    },
    {
      title: 'Real World Application: Adapting Reframing Across Diverse Populations',
      order: 5,
      lessons: [{
        title: 'Module 5: Real World Application: Adapting Reframing Across Diverse Populations',
        content: `<h2>Real World Application: Adapting Reframing Across Diverse Populations</h2><p>This module explores cultural responsiveness in cognitive reframing, including how anxiety is experienced across cultural contexts, adapting techniques for diverse populations, and recognizing when cognitive patterns reflect adaptive responses to systemic challenges rather than distortions.</p>`,
        order: 1,
        duration: 60
      }],
      moduleQuiz: {
        passingScore: 80,
        questions: [
        {
                "question": "When working with clients from collectivist cultures, clinicians should recognize that anxiety may be primarily related to:",
                "options": [
                        "Individual achievement concerns",
                        "Family or community expectations",
                        "Career advancement worries",
                        "Personal autonomy conflicts"
                ],
                "correctAnswer": 1,
                "order": 21
        },
        {
                "question": "Trauma-informed modifications to cognitive reframing should include:",
                "options": [
                        "Moving more quickly to challenge distorted thoughts",
                        "Validating emotional experience before examining cognitive content",
                        "Avoiding any discussion of difficult experiences",
                        "Using only behavioral interventions"
                ],
                "correctAnswer": 2,
                "order": 22
        },
        {
                "question": "When adapting reframing techniques for adolescent clients, clinicians should consider:",
                "options": [
                        "Using more abstract cognitive analysis",
                        "Providing concrete examples and interactive exercises",
                        "Eliminating all psychoeducation",
                        "Avoiding collaborative approaches"
                ],
                "correctAnswer": 1,
                "order": 23
        },
        {
                "question": "For clients with ADHD, thought record adaptations might include:",
                "options": [
                        "Longer, more detailed forms",
                        "Shortened records with more frequent check-ins",
                        "Eliminating written exercises entirely",
                        "Requiring completion without session support"
                ],
                "correctAnswer": 2,
                "order": 24
        },
        {
                "question": "When anxiety co-occurs with depression, clinicians should:",
                "options": [
                        "Address only the anxiety using standard protocols",
                        "Recognize that hopelessness may undermine motivation for cognitive exercises",
                        "Refer out for separate depression treatment",
                        "Avoid discussing mood symptoms"
                ],
                "correctAnswer": 1,
                "order": 25
        }
]
      }
    },
    {
      title: 'Sustaining Success: Relapse Prevention and Long-Term Integration',
      order: 6,
      lessons: [{
        title: 'Module 6: Sustaining Success: Relapse Prevention and Long-Term Integration',
        content: `<h2>Sustaining Success: Relapse Prevention and Long-Term Integration</h2><p>This module focuses on relapse prevention, maintenance of treatment gains, and building long-term resilience. Clinicians will develop personalized relapse prevention plans, address termination anxiety, and equip clients with self-directed reframing skills.</p>

<h3>Building a Personalized Relapse Prevention Plan</h3>
<p>Effective relapse prevention begins with helping clients identify their unique vulnerability factors—the specific situations, stressors, cognitive patterns, and physiological states that increase the likelihood of anxiety symptom return. A comprehensive relapse prevention plan includes: (1) an early warning sign inventory personalized to the client's specific anxiety presentation, (2) a hierarchy of coping responses ranging from low-intensity self-management strategies to professional re-engagement, (3) a written action plan that specifies what the client will do when warning signs emerge, and (4) regularly scheduled self-check-ins to monitor progress after treatment ends.</p>

<h3>Addressing Termination Anxiety</h3>
<p>Many clients experience significant anxiety about ending treatment, particularly those whose anxiety is rooted in attachment insecurity or fear of abandonment. Clinicians should normalize termination anxiety, frame it as a therapeutic opportunity to practice coping skills in real time, and consider a graduated termination process that includes spacing sessions further apart before fully ending treatment. The therapist should explicitly communicate that returning to treatment is not a failure but a healthy response to recognizing the need for additional support.</p>

<h3>Self-Directed Reframing Skills</h3>
<p>The ultimate goal of cognitive reframing treatment is to equip clients with internalized skills they can use independently. This involves helping clients become their own cognitive therapists—able to catch distorted thinking, generate alternatives, test assumptions through behavioral experiments, and maintain balanced perspectives without external guidance. Clinicians can support this transition by gradually reducing therapist-guided reframing and increasing client-initiated practice during the final phase of treatment.</p>`,
        order: 1,
        duration: 60
      }],
      moduleQuiz: {
        passingScore: 80,
        questions: [
        {
                "question": "When educating clients about post-treatment anxiety, clinicians should emphasize that occasional symptom return:",
                "options": [
                        "Indicates treatment failure requiring new intervention",
                        "Is normal and represents an opportunity to practice skills",
                        "Means the client did not engage adequately in treatment",
                        "Should be suppressed through increased medication"
                ],
                "correctAnswer": 2,
                "order": 26
        },
        {
                "question": "Personal warning signs for anxiety relapse might include all of the following EXCEPT:",
                "options": [
                        "Disrupted sleep patterns",
                        "Return of specific automatic thoughts",
                        "Permanent elimination of all anxiety symptoms",
                        "Increased checking behaviors"
                ],
                "correctAnswer": 1,
                "order": 27
        },
        {
                "question": "Maintenance planning should:",
                "options": [
                        "Prescribe identical practices for all clients",
                        "Work collaboratively to identify sustainable strategies for each individual client",
                        "Focus exclusively on medication adherence",
                        "Avoid discussing potential future challenges"
                ],
                "correctAnswer": 2,
                "order": 28
        },
        {
                "question": "Booster sessions should be framed as:",
                "options": [
                        "Evidence of treatment failure",
                        "Required for all clients",
                        "A proactive approach during high-stress periods rather than waiting for full relapse",
                        "Unnecessary if initial treatment was effective"
                ],
                "correctAnswer": 1,
                "order": 29
        },
        {
                "question": "Processing anxiety about termination serves which therapeutic purpose?",
                "options": [
                        "It delays ending treatment",
                        "It provides a final opportunity to practice reframing skills",
                        "It indicates the client is not ready to terminate",
                        "It is unnecessary for successful treatment completion"
                ],
                "correctAnswer": 1,
                "order": 30
        }
]
      }
    }
  ],
  quiz: { passingScore: 80, maxAttempts: 3 },
  settings: { certificateEnabled: true, evaluationRequired: true }
};

// ── CR-SP-402: Fading Voices, Lasting Connections ────────────────────────────
const crSP402Course = {
  title: 'Fading Voices, Lasting Connections: Counseling Older Adults with Neurocognitive Disorders',
  slug: 'fading-voices-lasting-connections-cr-sp-402',
  courseCode: 'CR-SP-402',
  description: 'A 4-hour CE course on counseling older adults with neurocognitive disorders and their caregivers, covering differential diagnosis, therapeutic adaptations, informed consent, and evidence-based caregiver support.',
  shortDescription: 'Develop specialized skills for counseling older adults with neurocognitive disorders and supporting their caregivers.',
  ceHours: 4.0,
  ceType: 'Clinical',
  level: 'intermediate',
  deliveryMethod: 'Distance Learning - Self-Study',
  author: 'GA Integrated Therapeutic Perspectives LLC',
  nbccApproved: true,
  nbccProviderNumber: '7760',
  isPublished: true,
  isFree: false,
  price: 49.99,
  learningObjectives: [
    `Differentiate among the major types of neurocognitive disorders, including Alzheimer's disease, vascular dementia, Lewy body dementia, and frontotemporal dementia.`,
    `Apply person-centered assessment approaches to evaluate cognitive, emotional, and functional status in older adults.`,
    `Implement evidence-based therapeutic interventions, including Cognitive Stimulation Therapy, reminiscence therapy, and validation therapy.`,
    `Analyze the multidimensional impact of caregiving on family members, including ambiguous loss and compassion fatigue.`,
    `Evaluate ethical dilemmas in counseling older adults with neurocognitive disorders, including issues of autonomy and informed consent.`,
  ],
  modules: [
    {
      title: 'The Landscape of Neurocognitive Disorders',
      order: 1,
      lessons: [{
        title: 'Module 1: The Landscape of Neurocognitive Disorders',
        content: `<h2>The Landscape of Neurocognitive Disorders</h2><p>Understanding the Spectrum of Cognitive Decline in Older Adults The field of neurocognitive disorders has undergone significant transformation in recent decades, driven by advances in neuroimaging, biomarker research, and a deeper appreciation for the lived experience of those affected by cognitive decline. The Diagnostic and Statistical Manual of Mental Disorders, Fifth Edition, Text Revision (DSM-5-TR) consolidated previously disparate diagnostic categories under the umbrella terms of Major Neurocognitive Disorder and Mild Neurocognitive Disorder, replacing the older terminology of dementia and mild cognitive impairment while retaining these terms as acceptable alternatives in clinical usage (American Psychiatric Association, 2022). This nosological shift reflects not merely a semantic change but a fundamental reconceptualization of cognitive decline as existing on a continuum rather than as discrete diagnostic entities. For counselors working with older adults, understanding this spectrum is essential for accurate case conceptualization, appropriate treatment planning, and sensitive communication with clients and their families about diagnosis and prognosis. The continuum model of neurocognitive disorders has important implications for how counselors conceptualize and communicate about cognitive decline with clients and families. Rather than viewing dementia as a sudden categorical shift from normal to abnormal, the continuum perspective acknowledges that cognitive changes</p>`,
        order: 1,
        duration: 30
      }]
    },
    {
      title: 'Person-Centered Assessment of Neurocognitive Disorders',
      order: 2,
      lessons: [{
        title: 'Module 2: Person-Centered Assessment of Neurocognitive Disorders',
        content: `<h2>Person-Centered Assessment of Neurocognitive Disorders</h2><p>Comprehensive Evaluation in Clinical Practice Assessment of neurocognitive disorders represents one of the most complex and clinically significant tasks in geriatric mental health practice. The process extends far beyond the administration of screening instruments to encompass a holistic, person-centered evaluation that considers the individual’s cognitive strengths and vulnerabilities, emotional functioning, behavioral presentation, functional capacities, social context, cultural background, and personal history. For counselors, assessment serves multiple purposes: contributing to differential diagnosis, establishing a baseline against which to measure change, informing treatment planning, identifying appropriate interventions, guiding level-of-care decisions, and providing the foundation for ongoing therapeutic work. The person-centered approach to assessment recognizes that behind every cognitive score and diagnostic label is a unique individual with a lifetime of experiences, relationships, accomplishments, and values that must inform how we understand and respond to their current presentation. The biopsychosocial-spiritual model provides a comprehensive framework for conceptualizing assessment in neurocognitive disorders. Biological factors include the specific type and stage of neurocognitive disorder, comorbid medical conditions that may affect cognition (thyroid dysfunction, vitamin deficiencies, urinary tract infections, medication side effects, delirium superimposed</p>`,
        order: 1,
        duration: 30
      }]
    },
    {
      title: 'Behavioral and Psychological Symptoms of Dementia',
      order: 3,
      lessons: [{
        title: 'Module 3: Behavioral and Psychological Symptoms of Dementia',
        content: `<h2>Behavioral and Psychological Symptoms of Dementia</h2><p>Understanding and Managing BPSD in Clinical Practice Behavioral and psychological symptoms of dementia (BPSD), also referred to as neuropsychiatric symptoms, represent one of the most clinically significant and distressing aspects of neurocognitive disorders for both the individual experiencing cognitive decline and their caregivers. BPSD encompass a heterogeneous group of non-cognitive symptoms and behaviors that occur commonly throughout the course of neurocognitive disorders, affecting approximately 90 percent of individuals with dementia at some point during their illness (Kales, Gitlin, & Lyketsos, 2015). These symptoms include agitation, aggression, anxiety, apathy, depression, delusions, hallucinations, disinhibition, irritability, aberrant motor behavior, nighttime behavioral disturbances, and appetite changes. Far from being peripheral to the dementia experience, BPSD are frequently the primary driver of caregiver distress, premature institutionalization, increased healthcare costs, and reduced quality of life for all involved. Understanding BPSD requires a paradigm shift from viewing these symptoms as meaningless behavioral disturbances to recognizing them as meaningful communications from an individual whose capacity for verbal expression may be compromised. The unmet needs model posits that BPSD often represent the individual’s attempt to communicate unmet physical, emotional, social, or environmental needs when they can no longer do so through conventional langua</p>`,
        order: 1,
        duration: 30
      }]
    },
    {
      title: 'Evidence-Based Interventions for Neurocognitive Disorders',
      order: 4,
      lessons: [{
        title: 'Module 4: Evidence-Based Interventions for Neurocognitive Disorders',
        content: `<h2>Evidence-Based Interventions for Neurocognitive Disorders</h2><p>Therapeutic Approaches for Older Adults with Cognitive Decline The therapeutic landscape for neurocognitive disorders has expanded significantly in recent years, moving beyond a purely medical management model to embrace a range of psychosocial interventions that can meaningfully improve quality of life, slow functional decline, and support emotional well-being for individuals living with dementia. While no currently available intervention can reverse the underlying neurodegenerative process, a growing body of evidence demonstrates that targeted psychosocial interventions can enhance cognitive functioning, reduce behavioral symptoms, maintain functional abilities, improve mood, strengthen social engagement, and promote dignity and personhood throughout the disease trajectory. For counselors, understanding and implementing these evidence-based approaches represents a critical competency in geriatric practice, as these interventions address the emotional, relational, and existential dimensions of the dementia experience that pharmacological treatments alone cannot reach. The person-centered care philosophy articulated by Tom Kitwood (1997) provides the overarching framework for all therapeutic interventions with individuals experiencing neurocognitive disorders. Kitwood argued that the experience of dementia is shaped not only by neurological impairment but also by the individual’s personality, biography, physical health, social psychology, and the quality of the care environme</p>`,
        order: 1,
        duration: 30
      }]
    },
    {
      title: 'The Caregiver Experience',
      order: 5,
      lessons: [{
        title: 'Module 5: The Caregiver Experience',
        content: `<h2>The Caregiver Experience</h2><p>Understanding Burden, Grief, and Resilience in Dementia Caregiving The experience of caring for a family member with a neurocognitive disorder represents one of the most demanding and transformative challenges a person can face. Dementia caregiving is distinct from other forms of caregiving in several important ways: the progressive and unpredictable nature of the disease trajectory, the gradual loss of the care recipient’s personality and relational reciprocity, the extended duration of caregiving that may span a decade or more, the physical demands of increasing dependence, the behavioral challenges associated with BPSD, and the anticipatory grief that begins long before physical death. The Alzheimer’s Association (2024) reports that approximately 11.5 million Americans provide unpaid care for individuals with Alzheimer’s and other dementias, contributing an estimated 18.4 billion hours of care valued at nearly $346.6 billion annually. These caregivers experience elevated rates of depression, anxiety, physical health problems, social isolation, financial strain, and mortality compared to non-caregivers and those caring for individuals with other chronic conditions. The concept of caregiver burden has been extensively studied and is typically conceptualized as encompassing both objective and subjective dimensions. Objective burden refers to the concrete demands of caregiving, including the time spent providing care, the physical tasks required, the financial costs incurred, </p>`,
        order: 1,
        duration: 30
      }]
    },
    {
      title: 'Caregiver Interventions and Family Systems',
      order: 6,
      lessons: [{
        title: 'Module 6: Caregiver Interventions and Family Systems',
        content: `<h2>Caregiver Interventions and Family Systems</h2><p>Evidence-Based Support for Families Navigating Dementia Supporting the family caregiver system is not merely an adjunct to counseling the individual with dementia; it is a clinical imperative that directly impacts the well-being of all family members and the quality of care the person with dementia receives. Research consistently demonstrates that caregiver interventions can significantly reduce depression, burden, anxiety, and delayed institutionalization of the care recipient while improving the overall family system’s functioning and resilience (Brodaty & Donkin, 2009). Effective caregiver interventions are multicomponent, addressing education about the disease process, skill training for managing BPSD, emotional support and grief processing, self-care planning, family communication, and connection to community resources. The most effective interventions are tailored to the caregiver’s specific needs, cultural context, and stage in the caregiving trajectory, recognizing that the challenges of early-stage caregiving differ markedly from those encountered in the moderate and advanced stages. The REACH II (Resources for Enhancing Alzheimer’s Caregiver Health) intervention represents one of the most rigorously studied and successful multicomponent caregiver support programs. Developed and tested through a large-scale, multisite randomized controlled trial, REACH II incorporates five target areas: depression, burden, self-care and healthy behaviors, social support, and problem </p>`,
        order: 1,
        duration: 30
      }]
    },
    {
      title: 'Ethical Dimensions of Neurocognitive Disorder Care',
      order: 7,
      lessons: [{
        title: 'Module 7: Ethical Dimensions of Neurocognitive Disorder Care',
        content: `<h2>Ethical Dimensions of Neurocognitive Disorder Care</h2><p>Navigating Autonomy, Capacity, and End-of-Life Considerations Counseling individuals with neurocognitive disorders presents some of the most complex and emotionally charged ethical challenges in mental health practice. The progressive nature of cognitive decline creates a shifting landscape of decision-making capacity, autonomy, and vulnerability that requires counselors to continuously reassess the ethical dimensions of their work. The fundamental tension at the heart of these ethical dilemmas is the balance between respecting the individual’s autonomy, the right to make one’s own decisions, and exercising beneficence, the obligation to act in the individual’s best interest when their decision-making capacity is compromised. This tension is not a simple binary but a complex continuum that evolves as the disease progresses, requiring nuanced clinical judgment informed by ethical principles, legal requirements, cultural values, and the individual’s own previously expressed wishes and values. The American Counseling Association (ACA) Code of Ethics (2014) provides foundational guidance for ethical practice with this population, emphasizing respect for client dignity, promotion of client welfare, the obligation to do no harm, and the importance of informed consent. However, the unique challenges of neurocognitive disorders require counselors to extend beyond general ethical principles to consider specialized ethical frameworks. The concept of relational autonomy is particularly </p>`,
        order: 1,
        duration: 30
      }]
    },
    {
      title: 'End-of-Life Considerations and Continuing the Connection',
      order: 8,
      lessons: [{
        title: 'Module 8: End-of-Life Considerations and Continuing the Connection',
        content: `<h2>End-of-Life Considerations and Continuing the Connection</h2><p>Supporting Families Through Late-Stage Dementia and Beyond The late stages of neurocognitive disorder present unique clinical challenges that require counselors to adapt their approaches significantly while maintaining unwavering commitment to the dignity, comfort, and relational needs of both the individual with dementia and their family caregivers. Late-stage dementia is characterized by severe cognitive impairment affecting all domains, profound communication difficulties including loss of coherent speech, complete dependence for all activities of daily living, motor impairments including difficulty walking and swallowing, and vulnerability to infections, particularly pneumonia, which is the most common cause of death in advanced Alzheimer’s disease. Despite the severity of cognitive and functional decline, research consistently demonstrates that individuals in late-stage dementia retain the capacity for emotional experience, sensory awareness, and relational connection, challenging the assumption that meaningful therapeutic engagement is no longer possible (Perkins et al., 2021). The transition to late-stage dementia often represents a turning point for families, as the nature of caregiving shifts from managing behavioral symptoms and maintaining function to providing comfort care and preparing for the end of life. This transition may coincide with decisions about palliative care, hospice enrollment, artificial nutrition and hydration, hospitalization for acute illness, and do-not-resuscitate orders. Counselors play a critical role in facilitating family discussions about these decisions, helping family members process their grief and guilt, and supporting the development of advance care plans that reflect the individual's previously expressed values and wishes.</p>

<h3>Supporting Families Through the Final Stages</h3>
<p>Family-centered interventions during late-stage dementia focus on several key areas. <strong>Anticipatory grief work</strong> helps caregivers process the ongoing losses they experience as the disease progresses, acknowledging that grief in dementia is not a single event but a prolonged process of successive losses. <strong>Legacy work</strong> involves helping families create meaningful records of their loved one's life—through photo collections, written narratives, or recorded memories—that honor the person beyond the disease. <strong>Continuing bonds</strong> interventions support family members in maintaining a sense of connection with their loved one even as communication becomes increasingly limited, through touch, music, familiar scents, and quiet presence.</p>

<p>After the death of a person with dementia, bereaved caregivers often experience a complex mix of grief and relief that can generate significant guilt. Counselors should normalize this experience, validate the magnitude of the caregiving journey, and support the caregiver's transition from the caregiving role back to their own identity and life. Post-loss counseling may also address unresolved relational issues, complicated grief, and the caregiver's own health needs that were neglected during the caregiving period.</p>`,
        order: 1,
        duration: 30
      }]
    }
  ],
  quiz: {
    passingScore: 80,
    maxAttempts: 3,
    questions: [
    {
        "question": "Which of the following best distinguishes the early clinical presentation of Alzheimer\u2019s disease from vascular neurocognitive disorder?",
        "options": [
            "Alzheimer\u2019s disease typically presents with prominent executive dysfunction while vascular dementia presents with memory loss",
            "Alzheimer\u2019s disease typically presents with episodic memory impairment while vascular neurocognitive disorder typically features prominent executive dysfunction and processing speed deficits",
            "Vascular neurocognitive disorder always follows a stepwise decline while Alzheimer\u2019s disease is always gradual",
            "Alzheimer\u2019s disease primarily affects language while vascular neurocognitive disorder primarily affects motor function"
        ],
        "correctAnswer": 1,
        "order": 1
    },
    {
        "question": "A counselor is working with a 72-year-old client whose family reports dramatic fluctuations in alertness and attention throughout the day, vivid visual hallucinations of children playing in the living room, and acting out dreams during sleep. Which neurocognitive disorder should the counselor most strongly suspect?",
        "options": [
            "Alzheimer\u2019s disease",
            "Frontotemporal dementia",
            "Lewy body dementia",
            "Vascular neurocognitive disorder"
        ],
        "correctAnswer": 2,
        "order": 2
    },
    {
        "question": "A 58-year-old client\u2019s spouse reports progressive personality changes including social disinhibition, loss of empathy, and compulsive eating behaviors over the past two years, with relatively preserved memory function. Which diagnosis is most consistent with this presentation?",
        "options": [
            "Early-onset Alzheimer\u2019s disease",
            "Behavioral variant frontotemporal dementia",
            "Lewy body dementia",
            "Major depressive disorder with atypical features"
        ],
        "correctAnswer": 1,
        "order": 3
    },
    {
        "question": "A counselor administers the MoCA to a 70-year-old Chinese-American client who immigrated to the United States at age 40 and is bilingual in Mandarin and English. The client scores 23 out of 30. Which of the following represents the most clinically appropriate interpretation?",
        "options": [
            "The score definitively indicates mild cognitive impairment and the counselor should proceed with a dementia diagnosis",
            "The score is above the normal cutoff and no further evaluation is needed",
            "The score should be interpreted cautiously given the client\u2019s bilingual and cross-cultural background, and supplemented with additional assessment data including functional evaluation and collateral information",
            "The MoCA is not valid for use with bilingual individuals and the results should be discarded entirely"
        ],
        "correctAnswer": 2,
        "order": 4
    },
    {
        "question": "Which of the following assessment tools would be most essential to include when evaluating an older adult presenting with both cognitive complaints and low mood?",
        "options": [
            "The Beck Anxiety Inventory",
            "The Geriatric Depression Scale",
            "The CAGE Substance Abuse Screening",
            "The Patient Health Questionnaire-2"
        ],
        "correctAnswer": 1,
        "order": 5
    },
    {
        "question": "According to the unmet needs model of BPSD, a person with moderate dementia who repeatedly calls out and attempts to leave the care facility in the late afternoon is most likely communicating which of the following?",
        "options": [
            "A deliberate attempt to manipulate caregivers for attention",
            "An unmet need such as fatigue, overstimulation, hunger, or a desire to fulfill a remembered routine from earlier in life",
            "A psychotic episode requiring immediate pharmacological intervention",
            "Defiance against institutional rules and structured care"
        ],
        "correctAnswer": 1,
        "order": 6
    },
    {
        "question": "Which of the following represents the recommended first-line approach for managing agitation in a person with moderate Alzheimer\u2019s disease?",
        "options": [
            "Low-dose antipsychotic medication",
            "Physical restraints to prevent injury",
            "Nonpharmacological interventions including environmental modification, music therapy, and structured activities",
            "Benzodiazepine administration for immediate calming"
        ],
        "correctAnswer": 2,
        "order": 7
    },
    {
        "question": "A counselor working with a person in the moderate stage of Alzheimer\u2019s disease is considering appropriate evidence-based interventions. Which of the following has the strongest research support as a frontline psychosocial intervention for dementia?",
        "options": [
            "Cognitive Behavioral Therapy with full homework assignments",
            "Cognitive Stimulation Therapy",
            "Psychodynamic psychotherapy with focus on transference interpretation",
            "Dialectical Behavior Therapy skills training"
        ],
        "correctAnswer": 1,
        "order": 8
    },
    {
        "question": "Which of the following best explains why music-based interventions can remain effective even in advanced stages of Alzheimer\u2019s disease?",
        "options": [
            "Music processing occurs exclusively in the frontal lobe, which is the last area affected by Alzheimer\u2019s pathology",
            "The brain regions involved in musical memory, including the supplementary motor area and cingulate cortex, are among the last areas affected by Alzheimer\u2019s disease pathology",
            "Advanced dementia eliminates all cognitive function except auditory processing",
            "Music interventions work through classical conditioning which does not require intact cognitive function"
        ],
        "correctAnswer": 1,
        "order": 9
    },
    {
        "question": "Pauline Boss\u2019s concept of ambiguous loss is particularly relevant to dementia caregiving because:",
        "options": [
            "The person with dementia experiences a clear, definable loss that can be processed through traditional grief counseling",
            "The caregiver experiences a paradoxical loss in which the person is physically present but psychologically absent, creating a grief that cannot be fully resolved or socially recognized",
            "Ambiguous loss only applies to situations where the person has physically disappeared",
            "The concept primarily addresses the financial ambiguity associated with long-term care costs"
        ],
        "correctAnswer": 1,
        "order": 10
    },
    {
        "question": "A spousal caregiver of a person with moderate Alzheimer\u2019s disease tells the counselor, I feel terrible for saying this, but sometimes I feel relieved when she sleeps all day because I get a break. What does this statement most likely reflect?",
        "options": [
            "Caregiver neglect requiring mandatory reporting",
            "Normal oscillation between loss-oriented and restoration-oriented coping as described in the Dual Process Model of grief",
            "Clinical depression with anhedonia requiring immediate psychiatric referral",
            "Compassion fatigue that indicates the caregiver should immediately place the care recipient in a facility"
        ],
        "correctAnswer": 1,
        "order": 11
    },
    {
        "question": "The REACH II caregiver intervention program targets which five areas?",
        "options": [
            "Medication management, physical therapy, social activities, spiritual care, and financial planning",
            "Depression, burden, self-care and healthy behaviors, social support, and problem behaviors",
            "Housing, transportation, legal services, meal preparation, and personal care",
            "Cognitive rehabilitation, physical exercise, dietary modifications, sleep hygiene, and stress management"
        ],
        "correctAnswer": 1,
        "order": 12
    },
    {
        "question": "During a family meeting about dementia care planning, two adult siblings are in heated disagreement about whether to place their mother in a memory care facility. The most appropriate counselor intervention is to:",
        "options": [
            "Side with the sibling who has the most contact with the mother, as they best understand her needs",
            "Recommend immediate placement since family conflict indicates inability to provide adequate home care",
            "Facilitate exploration of each sibling\u2019s concerns, values, and perspectives while advocating for the care recipient\u2019s safety and well-being and helping the family develop a collaborative care plan",
            "Recommend the family hire a professional care manager to make the decision, removing the emotional component"
        ],
        "correctAnswer": 2,
        "order": 13
    },
    {
        "question": "An 80-year-old client with moderate Alzheimer\u2019s disease tells the counselor she does not want to move to a memory care facility. Her daughter, who holds healthcare power of attorney, believes placement is necessary for safety. Which ethical principle is most directly in tension in this scenario?",
        "options": [
            "Justice versus fidelity",
            "Autonomy versus beneficence",
            "Veracity versus nonmaleficence",
            "Confidentiality versus justice"
        ],
        "correctAnswer": 1,
        "order": 14
    },
    {
        "question": "A counselor conducting a home visit notices that a client with dementia appears significantly underweight, has unexplained bruising, and is living in unsanitary conditions, while the primary caregiver appears overwhelmed and exhausted. The counselor\u2019s first ethical obligation is to:",
        "options": [
            "Continue monitoring the situation over several sessions before taking action",
            "Confront the caregiver about potential abuse and demand immediate changes",
            "Assess the situation thoroughly and, if reasonable suspicion of neglect or abuse exists, fulfill mandatory reporting obligations to adult protective services",
            "Recommend immediate nursing home placement and terminate the therapeutic relationship"
        ],
        "correctAnswer": 2,
        "order": 15
    },
    {
        "question": "A family caregiver expresses guilt about considering hospice enrollment for their parent with advanced dementia, saying, I feel like I\u2019m giving up on her. Which counselor response best reflects a person-centered, ethically informed approach?",
        "options": [
            "You\u2019re right to feel guilty; hospice does mean stopping all treatment, and you should continue pursuing aggressive medical interventions",
            "Explore the caregiver\u2019s understanding of hospice, gently correct misconceptions, and help them see that choosing comfort-focused care is an expression of love and respect for the person\u2019s dignity, ideally connecting this to the individual\u2019s previously expressed wishes",
            "Tell the caregiver that guilt is irrational and they need to accept the reality of the situation",
            "Recommend the caregiver speak only with the physician about hospice, as this is a medical decision outside the counselor\u2019s scope"
        ],
        "correctAnswer": 1,
        "order": 16
    }
]
  },
  settings: { certificateEnabled: true, evaluationRequired: true }
};

// ── SEED RUNNER ──────────────────────────────────────────────────────────────
const seedNewCourses = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const courses = [
      { data: cr202Course, code: 'CR-202' },
      { data: cr203Course, code: 'CR-203' },
      { data: crSP402Course, code: 'CR-SP-402' }
    ];

    let created = 0;
    let skipped = 0;

    for (const { data, code } of courses) {
      const existing = await Course.findOne({
        $or: [{ slug: data.slug }, { courseCode: code }]
      });

      if (existing) {
        console.log(`SKIPPED ${code} — already exists`);
        skipped++;
      } else {
        const course = new Course(data);
        await course.save();
        console.log(`CREATED ${code}: ${data.title}`);
        console.log(`  CE Hours: ${data.ceHours} | Price: $${data.price} | Modules: ${data.modules.length}`);
        created++;
      }
    }

    console.log('\n--- Seed complete ---');
    console.log(`Created: ${created} | Skipped: ${skipped}`);
    console.log('\nPost-seed checklist:');
    console.log('  [ ] All 3 courses visible in admin panel');
    console.log('  [ ] Quiz loads and passes at 80%');
    console.log('  [ ] Certificate generates on completion');
    console.log('  [ ] NBCC provider #7760 displays correctly');

    await mongoose.connection.close();
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedNewCourses();
