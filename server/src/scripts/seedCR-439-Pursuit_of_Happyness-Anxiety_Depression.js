/**
 * seedCR-439-Pursuit_of_Happyness-Anxiety_Depression.js
 * CR-439 — The Pursuit of Happyness: Treating Anxiety and Depression (3 CE)
 * Source outline: server/src/scripts/courseMarkdown/Pursuit_of_Happyness_Anxiety_Depression_3CE(1).md
 *
 * Canonical seed pattern (_seedTemplate.js): model-based upsert via doc.save(),
 * which fires the pre-save hook that computes wordCount and runs schema
 * validation. Do NOT convert this to a raw collection insertOne.
 *
 * Audit before running (no DB connection needed):
 *   node src/scripts/auditCourse.js --file src/scripts/seedCR-439-Pursuit_of_Happyness-Anxiety_Depression.js
 *
 * Run from ~/project/src/server:
 *   node src/scripts/seedCR-439-Pursuit_of_Happyness-Anxiety_Depression.js
 *
 * NOTE: videoEmbed blocks carry PLACEHOLDER video URLs (repo convention) and
 * imageText blocks carry empty image paths with full alt text. Swap in real
 * assets before flipping status to 'published'.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { pathToFileURL } from 'url';
import { Course } from '../models/InteractiveCourse.js';

dotenv.config();

export const COURSE = {
  title: 'The Pursuit of Happyness: Treating Anxiety and Depression',
  slug: 'the-pursuit-of-happyness-treating-anxiety-and-depression',
  courseCode: 'CR-439',
  subtitle: 'Evidence-Based Interventions for Anxiety and Depression',
  description: 'Anxiety and depressive disorders are the most common presentations in outpatient mental health practice and among the most treatable — yet the gap between what these treatments achieve in trials and what they achieve in ordinary practice remains large. This 3-hour continuing education course closes that gap by teaching mechanism-matched treatment: identifying what is actually maintaining a client\'s anxiety or depression, and selecting the intervention that reverses that specific process. You will work through DSM-5-TR differential diagnosis across the anxiety and depressive disorders, cognitive and behavioral maintenance models, measurement-based assessment with the PHQ-9 and GAD-7, four-factor case conceptualization, cognitive restructuring and behavioral experiments, behavioral activation, exposure designed around inhibitory learning and expectancy violation, and the third-wave approaches — ACT, DBT skills, and MBCT — with clear indications for when each adds something traditional CBT does not. The course closes with stepped care, routine outcome monitoring, and relapse prevention planning.',
  ceHours: 3,
  ceuHours: 3,
  credits: 3,
  level: 'Intermediate',
  contentArea: 'Counseling Theory/Practice',
  nbccContentAreas: ['Counseling Theory/Practice'],
  deliveryFormat: 'async',
  deliveryMethod: 'Asynchronous Online Learning',
  approvingBody: 'NBCC',
  approvalNumber: '7760',
  acepNumber: '7760',
  approvalBody: 'NBCC',
  instructor: 'GA Integrated Therapeutic Perspectives LLC',
  accessType: 'purchase',
  price: 39.99,
  pricingTier: 'standard',
  status: 'draft',
  isPublished: false,
  isActive: true,
  passingScore: 80,
  maxAttempts: 3,
  settings: { passingScore: 80, certificateEnabled: true, requireEvaluation: true, requireAttestation: true },
  objectives: [
    'Apply DSM-5-TR diagnostic criteria to accurately differentiate among anxiety disorders (GAD, panic disorder, social anxiety disorder, specific phobias) and depressive disorders (MDD, persistent depressive disorder).',
    'Describe the cognitive, behavioral, and neurobiological mechanisms underlying anxiety and depression, explaining their relevance to treatment selection.',
    'Administer and interpret standardized assessment instruments including the PHQ-9, GAD-7, and Beck Depression and Anxiety Inventories for screening, diagnosis, and progress monitoring.',
    'Construct cognitive-behavioral case conceptualizations integrating predisposing, precipitating, perpetuating, and protective factors.',
    'Implement core CBT interventions including cognitive restructuring, behavioral experiments, and activity scheduling with appropriate adaptations for anxiety versus depression.',
    'Design and guide clients through exposure hierarchies for anxiety disorders, applying principles of inhibitory learning to maximize treatment effectiveness.',
    'Apply behavioral activation protocols for depression, helping clients reconnect with valued activities despite low motivation.',
    'Integrate third-wave approaches (ACT, DBT skills, MBCT) when indicated, demonstrating understanding of when these approaches may enhance or replace traditional CBT.',
    'Implement measurement-based care practices, using session-by-session outcome data to guide treatment decisions.'
  ],
  targetAudience: [
    'Licensed Professional Counselors and Licensed Mental Health Counselors',
    'National Certified Counselors',
    'Licensed Clinical Social Workers',
    'Licensed Marriage and Family Therapists',
    'Psychologists and Psychiatric Nurse Practitioners',
    'Graduate-level counseling students under supervision'
  ],
  sections: [
    {
      title: 'Course Introduction and Orientation',
      order: 1,
      description: 'The clinical problem this course solves, the framework it is built on, and what you should be able to do differently when you finish.',
      contentBlocks: [
        {
          type: 'sectionDivider',
          sectionNumber: 'Introduction',
          title: 'Course Introduction and Orientation',
          subtitle: 'Anxiety and depression are the two most common presentations in outpatient practice and among the most treatable — when the clinician targets the right mechanism with the right intervention.',
          order: 1
        },
        {
          type: 'text',
          content: `<h2>Two Clients, One Diagnosis, Two Different Treatments</h2>
<p>Marcus is thirty-four and cannot stop checking his work email. He checks it twenty times a day, sometimes more, and each check buys him about ninety seconds of relief before the next worry arrives — a different worry, usually, because his worries rotate. His shoulders ache. He has not slept through a night in four months. On the GAD-7 he scores 17.</p>
<p>Jasmine is twenty-nine and has not left her apartment except for work in six weeks. She describes her days as "grey." She has stopped answering her sister's calls, not from anger but because answering requires more than she has. She used to run; she cannot remember the last time she wanted to. On the PHQ-9 she scores 19, and she endorses item nine.</p>
<p>Both will be described in a case note as "anxiety and depression." Both are among the most treatable presentations in outpatient mental health. And if the same generic protocol is applied to both — some psychoeducation, some thought records, supportive conversation, a check-in on mood — both will improve less than they should, and one of them will not be safe.</p>
<p>What separates adequate care from excellent care here is not warmth, effort, or years of experience. It is mechanistic precision: knowing which specific process is holding this particular client's condition in place, and selecting the intervention that reverses that process. Marcus's worry is functioning as avoidance of emotional processing. Jasmine's withdrawal has cut her off from every source of reinforcement she had. Those are different mechanisms, they call for different interventions, and the difference is learnable.</p>
<p>Anxiety disorders affect roughly 40 million American adults in a given year and depressive disorders roughly 21 million. They co-occur so often that treating one without assessing the other is a predictable source of stalled treatment. Nearly every clinician reading this already has a caseload full of them. The question this course addresses is not whether you will see these clients — you already do — but whether what you deliver is doing what the research says it can.</p>`,
          order: 2
        },
        {
          type: 'callout',
          calloutType: 'clinical',
          title: 'Why This Matters',
          content: `<ul>
<li><strong>Volume.</strong> Anxiety and depressive disorders are the two most common presentations in outpatient practice — roughly 40 million and 21 million American adults annually — and lifetime comorbidity between GAD and major depression exceeds 50%.</li>
<li><strong>Treatability.</strong> These are among the most treatable conditions in mental health. Cognitive-behavioral therapy, behavioral activation, and exposure produce large effects when delivered with fidelity to the mechanism.</li>
<li><strong>The delivery gap.</strong> Effects achieved in ordinary practice fall well short of trial effects, and the gap is largely one of specificity rather than clinician effort — generic supportive work with occasional thought-challenging is not the treatment that was tested.</li>
<li><strong>Detection failure.</strong> Clinician judgment about client progress is demonstrably unreliable; without routine outcome data, deteriorating clients are identified at rates barely better than chance.</li>
<li><strong>Risk.</strong> Depression is the most common diagnostic context for suicide, which makes accurate assessment and routine screening a safety obligation rather than a documentation preference.</li>
</ul>`,
          order: 3
        },
        {
          type: 'text',
          content: `<h2>How This Course Is Organized</h2>
<p>The course moves in a deliberate sequence from phenomenology to mechanism to intervention to maintenance, because each stage depends on the one before it. Modules 1 and 2 establish what anxiety and depressive disorders actually are — their diagnostic boundaries, the cognitive and behavioral processes that maintain them, their neurobiological substrates, and the assessment instruments that let you measure rather than estimate. These modules are diagnostic in the working sense: the goal is to be able to say, of a specific client, which mechanism is active and therefore which treatment is indicated.</p>
<p>Module 3 turns to cognitive-behavioral therapy as a structured method — session architecture, case conceptualization, cognitive restructuring, and behavioral experiments — with explicit attention to how the emphasis shifts between anxiety and depression. Module 4 goes deep on the two most powerful behavioral engines available in outpatient work, behavioral activation and exposure, including the inhibitory learning framework that has substantially revised how exposure is designed over the past fifteen years.</p>
<p>Module 5 addresses the third-wave approaches — Acceptance and Commitment Therapy, DBT skills, and Mindfulness-Based Cognitive Therapy — with a focus on the specific clinical impasses in which each adds something traditional cognitive-behavioral work does not. Module 6 closes the loop with treatment planning, measurement-based care, and relapse prevention: how to know whether what you are doing is working, what to do when the data say it is not, and how to end treatment in a way that protects the gains.</p>
<p>Marcus and Jasmine recur throughout, so that assessment, conceptualization, intervention, and outcome monitoring can be traced through continuous cases rather than illustrated in fragments.</p>`,
          order: 4
        },
        {
          type: 'imageText',
          title: 'The Maintenance Model: One Framework Behind Every Intervention',
          content: `<p>Every intervention in this course rests on a single organising idea: anxiety and depression are held in place by identifiable, self-reinforcing loops, and treatment works by interrupting the loop at the point the client can actually act on.</p>
<p>The <strong>anxiety loop</strong> runs from cue to threat appraisal to anxiety to avoidance to relief — and the relief is the problem. Avoidance is negatively reinforced by the immediate drop in distress, and it simultaneously prevents the corrective learning that would occur if the person stayed in contact with the feared stimulus and discovered the predicted catastrophe did not arrive. Every effective anxiety treatment enters this loop at the avoidance node.</p>
<p>The <strong>depression loop</strong> runs from loss or stressor to withdrawal to reduced reinforcement to lowered mood and energy, and back to further withdrawal. Each turn removes access to the very experiences that would lift mood, and supplies fresh evidence for the negative cognitive triad. This loop cannot be broken at the level of mood, because mood is downstream; it is broken at the level of behavior, which is the one node the client can act on regardless of how they feel.</p>
<p>Hold both loops in mind as you work through the modules. When a treatment is described, ask which node it enters at. When a client stalls, ask which loop is running and whether the intervention you are using actually touches it.</p>`,
          image: '',
          imageAlt: 'Two side-by-side circular flow diagrams. The left, labelled Anxiety Loop, cycles from cue to threat appraisal to anxiety to avoidance to short-term relief and back to cue, with an arrow labelled "exposure" entering at the avoidance node. The right, labelled Depression Loop, cycles from loss or stressor to withdrawal to reduced positive reinforcement to lowered mood and energy and back to withdrawal, with an arrow labelled "behavioral activation" entering at the withdrawal node.',
          imagePosition: 'right',
          order: 5
        },
        {
          type: 'text',
          content: `<h3>Key Concepts Preview</h3>
<p>Six ideas do most of the work in this course. Each is previewed here and developed in the module noted.</p>`,
          order: 6
        },
        {
          type: 'accordion',
          accordionItems: [
            {
              title: 'Mechanism-matched treatment (Modules 1–2)',
              content: `<p>The clinical question is never "does this client have anxiety?" but "which process is holding this client's anxiety in place?" Worry-as-avoidance, catastrophic misinterpretation of bodily sensation, and fear of negative evaluation sustained by safety behaviors are three different mechanisms with three different interventions. Diagnosis matters because it points to mechanism.</p>`
            },
            {
              title: 'Avoidance as the common maintaining factor (Module 1)',
              content: `<p>Behavioral avoidance, cognitive avoidance through worry, interoceptive avoidance of bodily sensation, and subtle safety behaviors all do the same job: they buy immediate relief and block corrective learning. Recognising avoidance in its less obvious forms is often what unlocks a stalled anxiety treatment.</p>`
            },
            {
              title: 'The withdrawal loop and behavioral activation (Modules 2 and 4)',
              content: `<p>Depression is maintained by a loss of response-contingent positive reinforcement. Activation reverses it by scheduling specific, values-linked activity independent of momentary motivation — acting first, with mood following, rather than waiting to feel like it.</p>`
            },
            {
              title: 'Four-factor case conceptualization (Module 3)',
              content: `<p>Predisposing, precipitating, perpetuating, and protective factors organised into a working hypothesis the client recognises as a description of their own life. A conceptualization the client cannot restate is not yet doing clinical work.</p>`
            },
            {
              title: 'Expectancy violation and inhibitory learning (Module 4)',
              content: `<p>Exposure works by disconfirming a specific, falsifiable prediction — not by waiting for anxiety to halve. Anxiety can stay high throughout a highly successful exposure. The target is the gap between what the client predicted and what actually happened.</p>`
            },
            {
              title: 'Measurement-based care (Module 6)',
              content: `<p>A brief validated measure at every session, plotted and reviewed with the client, converts a subjective impression into a shared record. A flat trajectory across four to six sessions is a signal to change something, not a reason for patience.</p>`
            }
          ],
          order: 7
        },
        {
          type: 'keyTakeaway',
          title: 'What You Will Take Away',
          takeaways: [
            'The ability to name, for a specific client, which mechanism is maintaining their anxiety or depression — and to say which intervention reverses that mechanism.',
            'A working command of the PHQ-9 and GAD-7: administering them at every session, plotting the trajectory, and using the numbers in a conversation with the client rather than filing them.',
            'A four-factor case conceptualization you can write in ten minutes and share with the client in language they recognise as their own.',
            'The ability to design an exposure around a falsifiable prediction, identify and remove the safety behaviors that would prevent disconfirmation, and debrief it so the learning consolidates.',
            'A behavioral activation plan that is specific, values-linked, graded, and scheduled — with predicted-versus-actual mood ratings built in.',
            'A decision rule for when to change course, agreed in advance, and a relapse-prevention plan that names warning signs, skills, contacts, and the threshold for a booster session.'
          ],
          order: 8
        },
        {
          type: 'multipleChoice',
          question: 'Before we begin: a client with panic disorder completes an interoceptive exposure and reports that their anxiety stayed at 8 out of 10 for the entire exercise. Under the model this course teaches, how should this exposure be judged?',
          options: [
            {
              text: 'Potentially highly successful, depending on whether the client made a specific prediction and whether that prediction was disconfirmed.',
              isCorrect: true
            },
            {
              text: 'Unsuccessful — anxiety must decline by roughly half within the session for the exposure to have worked.',
              isCorrect: false
            },
            {
              text: 'Unsuccessful — the exposure should be repeated at a lower intensity until the client habituates.',
              isCorrect: false
            },
            {
              text: 'Impossible to judge without a physiological measure of arousal.',
              isCorrect: false
            }
          ],
          correctAnswer: 0,
          explanation: 'Under the inhibitory learning model, the outcome of an exposure is expectancy violation rather than within-session habituation. A client can remain highly anxious throughout and still learn a great deal, provided a falsifiable prediction was made and disconfirmed. We will explore this in Module 4, where the shift from the habituation model to inhibitory learning is worked through in detail.',
          order: 9
        },
        {
          type: 'multipleChoice',
          question: 'A client with major depression tells you they will start exercising again "once they have more energy." What does the behavioral model of depression predict about this plan?',
          options: [
            {
              text: 'It is sound — energy must be restored before activity can be sustained.',
              isCorrect: false
            },
            {
              text: 'It is sound provided the client also begins cognitive restructuring first.',
              isCorrect: false
            },
            {
              text: 'It is irrelevant, since exercise has no established effect on depressive symptoms.',
              isCorrect: false
            },
            {
              text: 'It is likely to fail, because motivation and energy follow activity rather than precede it; the plan waits on an input the loop will not supply.',
              isCorrect: true
            }
          ],
          correctAnswer: 3,
          explanation: 'The withdrawal loop does not resolve on its own: reduced activity lowers reinforcement, which lowers mood and energy, which makes activity feel even less possible. Waiting for energy is waiting for an output of the loop to arrive before supplying its input. Behavioral activation reverses the order deliberately — the client acts on the schedule regardless of how they feel, and the mood change follows. We will explore this in Module 4.',
          order: 10
        },
        {
          type: 'callout',
          calloutType: 'info',
          title: 'Scope and Limits of This Course',
          content: `<p>This course addresses outpatient assessment and psychotherapy for anxiety and depressive disorders in adults. It does not provide training sufficient for independent practice in any single protocol; competent delivery of exposure therapy, ACT, or DBT requires supervised practice beyond a continuing education course. It does not cover psychopharmacology beyond the level a non-prescriber needs for collaborative care, and it does not substitute for specialized training in suicide risk assessment, which every clinician working with depressed clients should hold separately. Where content touches on medication, medical rule-outs, or risk management, treat it as a prompt for consultation and referral rather than as a scope-of-practice expansion.</p>`,
          order: 11
        },
        {
          type: 'reflection',
          question: 'Bring to mind a specific client with anxiety or depression whose treatment has not moved the way you hoped. What did you actually do with them across the last month of sessions — not what modality you would name, but what happened in the room? Write down your current working hypothesis about what is keeping them stuck, in one or two sentences. Keep it where you can see it; at the end of this course you will be asked to rewrite that hypothesis in the language of maintaining mechanisms, and the rewrite is what will change your next session.',
          order: 12
        }
      ]
    },
    {
      title: 'Module 1: Understanding Anxiety Disorders',
      order: 2,
      description: 'Anxiety is a survival system that has lost its calibration — accurate differential diagnosis is what turns "anxiety" into a treatable target.',
      contentBlocks: [
        {
          type: 'sectionDivider',
          sectionNumber: '1',
          title: 'Module 1: Understanding Anxiety Disorders',
          subtitle: 'Anxiety is a survival system that has lost its calibration — accurate differential diagnosis is what turns "anxiety" into a treatable target.',
          order: 1
        },
        {
          type: 'text',
          content: `<h2>Introduction</h2>
<p>Anxiety disorders collectively represent the most common class of mental health conditions, affecting approximately 31% of American adults at some point in their lives. Despite their prevalence, anxiety disorders remain undertreated, with only about 37% of those affected receiving treatment. When clients do present for treatment, clinicians must accurately differentiate among anxiety disorder subtypes, as effective treatment requires precise targeting of the specific cognitive and behavioral patterns maintaining each condition. A client with panic disorder requires different interventions than one with generalized anxiety disorder, even though both experience "anxiety."</p>
<p>This module provides comprehensive coverage of anxiety disorder phenomenology, diagnostic criteria, and underlying mechanisms. Understanding the "what" and "why" of anxiety disorders creates the foundation for the "how" of evidence-based treatment covered in subsequent modules. We examine each major anxiety disorder through its diagnostic criteria, characteristic cognitive patterns, behavioral manifestations, and neurobiological substrates, building toward an integrated understanding that informs clinical assessment and treatment planning.</p>`,
          order: 2
        },
        {
          type: 'callout',
          calloutType: 'clinical',
          title: 'Differential Diagnosis Is a Treatment Decision',
          content: `<p>The diagnostic label matters clinically because it determines the mechanism you target. Generalized anxiety is maintained by worry as avoidance of emotional processing, so treatment targets the worry process itself. Panic disorder is maintained by catastrophic misinterpretation of benign bodily sensations, so treatment targets interoceptive fear. Social anxiety is maintained by self-focused attention and safety behaviors, so treatment targets attentional deployment and behavioral experiments in real social situations. A generic "anxiety protocol" applied without differential precision produces the mediocre outcomes that give CBT an undeserved reputation for being mechanical.</p>`,
          order: 3
        },
        {
          type: 'text',
          content: `<h3>Myth vs. Fact: Anxiety Edition</h3>
<p>Open each myth to see what the evidence actually shows.</p>`,
          order: 4
        },
        {
          type: 'accordion',
          accordionItems: [
            {
              title: 'Myth: Anxiety disorders are just excessive worrying that people should be able to control.',
              content: `<p><strong>Fact:</strong> Anxiety disorders involve dysregulation of threat-detection systems in the brain, creating genuine physiological responses that cannot be simply "controlled" through willpower. They are legitimate medical conditions, not character weaknesses.</p>`
            },
            {
              title: 'Myth: Benzodiazepines are the most effective treatment for anxiety disorders.',
              content: `<p><strong>Fact:</strong> While benzodiazepines provide rapid relief, cognitive-behavioral therapy produces equivalent short-term outcomes and superior long-term outcomes without risks of dependence. CBT is recommended as first-line treatment by all major guidelines.</p>`
            },
            {
              title: 'Myth: Avoiding anxiety triggers is helpful for managing anxiety.',
              content: `<p><strong>Fact:</strong> Avoidance is the primary maintaining factor for anxiety disorders. While it provides short-term relief, avoidance strengthens anxiety long-term by preventing corrective learning. Effective treatment involves gradual, systematic approach toward feared stimuli.</p>`
            }
          ],
          order: 5
        },
        {
          type: 'text',
          content: `<h2>The Nature of Anxiety: Adaptive Function Gone Awry</h2>
<p>Anxiety represents a fundamental survival mechanism that evolved to protect organisms from threat. When functioning adaptively, the anxiety response mobilizes cognitive, physiological, and behavioral resources to detect and respond to danger. The anxious brain scans the environment for threat, the anxious body prepares for fight or flight through sympathetic nervous system activation, and anxious behavior motivates protective action. Without anxiety, humans would fail to recognize and respond to genuine dangers.</p>
<p>Anxiety becomes disordered when this protective system misfires—activating in the absence of genuine threat, activating with intensity disproportionate to actual risk, or persisting beyond the duration of any real danger. The smoke detector analogy proves useful: a well-functioning smoke detector activates only when actual smoke is present, while a malfunctioning detector sounds false alarms that disrupt daily life. Anxiety disorders involve smoke detectors calibrated too sensitively, responding to harmless stimuli as if they were dangerous.</p>
<p>The cognitive model of anxiety, developed by Aaron Beck and colleagues, emphasizes the role of threat appraisal in anxiety generation and maintenance. According to this model, anxiety results from overestimation of the probability and severity of negative outcomes combined with underestimation of one's ability to cope with those outcomes. A person with social anxiety, for example, overestimates the likelihood of negative evaluation by others, exaggerates the consequences of such evaluation ("If they think I'm awkward, my life will be ruined"), and underestimates their capacity to handle rejection or criticism.</p>
<p>Behavioral models emphasize the role of avoidance in maintaining anxiety. When anxiety arises, avoidance of the feared stimulus produces immediate relief—a powerful negative reinforcement that strengthens avoidance behavior. However, avoidance prevents the natural extinction of fear that would occur through repeated exposure without negative consequences. The person who avoids elevators never learns that elevators are safe; each avoided elevator ride maintains the belief that elevators are dangerous. This avoidance-anxiety cycle becomes self-perpetuating, as the relief obtained through avoidance reinforces the behavior that maintains the disorder.</p>
<p>Neurobiologically, anxiety disorders involve hyperactivity in threat-detection circuits centered on the amygdala, combined with inadequate top-down regulation from prefrontal cortical regions. The amygdala functions as the brain's alarm system, rapidly evaluating incoming stimuli for potential threat and initiating defensive responses. In anxiety disorders, amygdala reactivity is heightened, triggering alarm responses to stimuli that would not register as threatening in non-anxious individuals. Simultaneously, prefrontal regions that would normally evaluate threat appraisals and inhibit false alarms are less effective in modulating amygdala activity.</p>`,
          order: 6
        },
        {
          type: 'text',
          content: `<h2>Clinical Vignette: Meet Marcus</h2>
<blockquote><p>Marcus, a 34-year-old software engineer, presents for treatment reporting "constant anxiety" that has worsened over the past year. He describes persistent worry about multiple life domains—work performance, health, finances, relationships—that he finds difficult to control. He reports muscle tension, particularly in his shoulders and neck, difficulty sleeping due to racing thoughts, and feeling "keyed up" and easily fatigued. His wife has commented that he seems irritable and distracted. Marcus has begun avoiding social gatherings because he worries about saying something embarrassing, and he's started checking his work emails compulsively, sometimes 20+ times per day, to ensure he hasn't made mistakes.</p></blockquote>`,
          order: 7
        },
        {
          type: 'multipleChoice',
          question: 'Clinical Vignette: Meet Marcus — Based on this initial presentation, which anxiety disorder(s) should be highest on your differential diagnosis?',
          options: [
            { text: 'GAD with possible comorbid Social Anxiety Disorder', isCorrect: true },
            { text: 'Generalized Anxiety Disorder only', isCorrect: false },
            { text: 'Social Anxiety Disorder only', isCorrect: false },
            { text: 'Obsessive-Compulsive Disorder only', isCorrect: false }
          ],
          correctAnswer: 0,
          explanation: 'Marcus presents with hallmark features of GAD—excessive worry across multiple domains, difficulty controlling worry, muscle tension, sleep disturbance, and irritability lasting more than six months. However, his social avoidance and fear of embarrassment suggest possible comorbid social anxiety disorder warranting further assessment. The email checking could be anxiety-driven reassurance-seeking rather than true OCD, as it\'s connected to worry about work performance rather than ego-dystonic obsessions. This vignette illustrates the importance of thorough differential diagnosis, as comorbidity is common and affects treatment planning. We\'ll return to Marcus throughout this course to illustrate assessment and treatment concepts.',
          order: 8
        },
        {
          type: 'text',
          content: `<h2>Generalized Anxiety Disorder (GAD)</h2>
<p>Generalized Anxiety Disorder is characterized by persistent, excessive worry about multiple life domains that the individual finds difficult to control. Unlike other anxiety disorders that feature anxiety focused on specific triggers, GAD involves free-floating anxiety that attaches to whatever concern is most salient at any given moment. Clients with GAD often describe their worry as shifting—when one concern resolves, another immediately takes its place.</p>
<p>The DSM-5-TR diagnostic criteria for GAD require excessive anxiety and worry occurring more days than not for at least six months, about multiple events or activities. The worry must be difficult to control and must be associated with at least three of six somatic and cognitive symptoms: restlessness or feeling keyed up, being easily fatigued, difficulty concentrating or mind going blank, irritability, muscle tension, and sleep disturbance. Symptoms must cause clinically significant distress or functional impairment and cannot be attributable to substances, medical conditions, or another mental disorder.</p>
<p>The cognitive profile of GAD centers on intolerance of uncertainty. Individuals with GAD struggle to tolerate ambiguous situations and the possibility that negative outcomes might occur, even when such outcomes are unlikely. This intolerance drives excessive information-seeking, reassurance-seeking, and attempts to prepare for every possible negative eventuality. Paradoxically, the worry itself may be experienced as serving a protective function—as if worrying about something prevents it from happening or prepares one to cope if it does.</p>
<p>Metacognitive beliefs about worry also maintain GAD. Individuals may hold positive beliefs about worry ("Worrying helps me prepare") that motivate continued worry, alongside negative beliefs about the dangerousness of worry itself ("I'll lose control if I keep worrying") that generate anxiety about anxiety in a recursive loop. Addressing these metacognitive beliefs often proves essential for treatment success.</p>`,
          order: 9
        },
        {
          type: 'text',
          content: `<h2>Panic Disorder</h2>
<p>Panic Disorder is characterized by recurrent, unexpected panic attacks combined with persistent concern about future attacks or maladaptive behavioral changes in response to attacks. A panic attack is an abrupt surge of intense fear or discomfort that reaches peak intensity within minutes and includes at least four of thirteen characteristic symptoms: palpitations, sweating, trembling, shortness of breath, feelings of choking, chest pain, nausea, dizziness, chills or heat sensations, paresthesias, derealization or depersonalization, fear of losing control, and fear of dying.</p>
<p>The critical distinction between panic attacks and panic disorder lies in the unexpected nature of attacks and the subsequent fear and behavioral changes. Panic attacks can occur in the context of any anxiety disorder when facing feared stimuli. Panic disorder specifically involves unexpected attacks that occur "out of the blue," without any apparent trigger, leading to anticipatory anxiety about future attacks and often to agoraphobic avoidance of situations where attacks have occurred or where escape might be difficult.</p>
<p>The cognitive model of panic disorder emphasizes catastrophic misinterpretation of bodily sensations. Individuals with panic disorder interpret normal physiological variations—a slight increase in heart rate, a brief moment of breathlessness—as signs of imminent catastrophe such as heart attack, suffocation, or loss of control. This misinterpretation triggers anxiety, which produces additional physiological arousal, which provides more sensations to misinterpret, creating a rapidly escalating feedback loop that culminates in full panic.</p>`,
          order: 10
        },
        {
          type: 'flashcardDeck',
          instructions: 'Anxiety Disorders: Rapid Differential Review — Work through each card, answering before you flip. These are the discriminating features that separate anxiety presentations that can look identical on intake.',
          flashcards: [
            {
              id: 'cr439-m1-f1',
              front: 'What is the defining feature of the worry in GAD, as opposed to worry in other anxiety disorders?',
              back: 'The worry is excessive, difficult to control, and migrates across multiple life domains rather than attaching to a single feared stimulus. When one concern resolves, another immediately takes its place. Duration must exceed six months, with at least three of six associated symptoms: restlessness, fatigue, concentration difficulty, irritability, muscle tension, and sleep disturbance.'
            },
            {
              id: 'cr439-m1-f2',
              front: 'What is the central maintaining mechanism in panic disorder?',
              back: 'Catastrophic misinterpretation of benign interoceptive sensations. A racing heart is read as an impending heart attack, dizziness as impending collapse, derealization as impending insanity. The fear is of the bodily sensations themselves and of their imagined consequences, which is why interoceptive exposure is the mechanism-matched intervention.'
            },
            {
              id: 'cr439-m1-f3',
              front: 'What distinguishes social anxiety disorder from ordinary shyness or introversion?',
              back: 'Clinically significant fear of negative evaluation that produces avoidance or endurance with intense distress, along with functional impairment. Safety behaviors — rehearsing statements, avoiding eye contact, staying near a trusted companion — prevent the disconfirming experience that would otherwise reduce the fear, which is why they are removed during treatment.'
            },
            {
              id: 'cr439-m1-f4',
              front: 'What percentage of individuals with one anxiety disorder meet criteria for at least one additional anxiety disorder?',
              back: 'Approximately 60%. Lifetime comorbidity between GAD and major depressive disorder exceeds 50%, and substance use disorders frequently co-occur as attempts at self-medication. Systematic assessment of all anxiety criteria — rather than stopping at the first diagnosis identified — is therefore standard practice.'
            },
            {
              id: 'cr439-m1-f5',
              front: 'Which medical conditions should be ruled out before attributing new-onset anxiety to a primary anxiety disorder?',
              back: 'Thyroid dysfunction (particularly hyperthyroidism), cardiac arrhythmias, respiratory conditions including asthma and COPD, hypoglycemia, and pheochromocytoma. Substance-related contributors include caffeine, stimulants, bronchodilators, and withdrawal from alcohol or benzodiazepines. Prominent physical symptoms or onset after age 40 raise the index of suspicion.'
            },
            {
              id: 'cr439-m1-f6',
              front: 'Why is avoidance described as the primary maintaining factor across anxiety disorders?',
              back: 'Avoidance produces immediate relief, which negatively reinforces the avoidance behavior. It simultaneously prevents the corrective learning that would occur if the person remained in contact with the feared stimulus and discovered that the predicted catastrophe did not occur. The relief that makes avoidance feel adaptive is precisely what keeps the disorder in place.'
            }
          ],
          order: 11
        },
        {
          type: 'text',
          content: `<h2>Reflection Exercise: Your Anxiety Experiences</h2>
<p>Take a moment to reflect on your personal relationship with anxiety:</p>
<ol><li><strong>What are your own anxiety triggers?</strong> (Public speaking, health concerns, uncertainty, etc.)</li></ol>
<ol><li><strong>How do you typically respond when anxious?</strong> (Avoidance, reassurance-seeking, distraction, etc.)</li></ol>
<ol><li><strong>How might your personal anxiety patterns affect your clinical work with anxious clients?</strong> (Potential blind spots, over-identification, counter-therapeutic responses?)</li></ol>
<blockquote><p>There are no right answers—this exercise builds self-awareness that enhances clinical effectiveness. Consider journaling your responses.</p></blockquote>`,
          order: 12
        },
        {
          type: 'text',
          content: `<h2>Social Anxiety Disorder</h2>
<p>Social Anxiety Disorder (SAD) involves marked fear or anxiety about social situations in which the individual is exposed to possible scrutiny by others. The fear centers on acting in ways or showing anxiety symptoms that will be negatively evaluated—leading to embarrassment, humiliation, or rejection. Social situations are avoided or endured with intense distress, and the fear or avoidance causes significant functional impairment. SAD is among the most common anxiety disorders, with lifetime prevalence estimated at 12%, and it typically has an early onset in adolescence.</p>
<p>The cognitive model of social anxiety highlights the role of negative self-focused attention and distorted self-perception. When entering social situations, individuals with SAD shift attention inward, monitoring their own behavior and appearance for signs of inadequacy. They engage in what Clark and Wells describe as creating an "observer perspective" mental image of themselves—imagining how they appear to others from an external viewpoint—that is invariably more negative than reality. This image is often constructed from feared outcomes rather than actual feedback and may be influenced by memories of past embarrassments.</p>
<p>This self-focused attention has several problematic consequences. It interferes with actual social performance by diverting cognitive resources from the conversation to self-monitoring, potentially creating the very awkwardness the person fears. It prevents processing of positive or neutral social feedback because attention is directed inward rather than outward. It generates intense anxiety because the person is essentially creating and then observing a negative image of themselves throughout the interaction.</p>
<p>Pre-event and post-event processing further maintain social anxiety. Before social situations, individuals with SAD engage in anticipatory worry, imagining all that could go wrong. Afterward, they engage in "post-mortem" rumination, reviewing the interaction in detail and focusing on perceived failures. This post-event processing often becomes more negative over time as memory reconstruction emphasizes negative elements and minimizes positive ones. Together, anticipatory anxiety and post-event rumination ensure that social situations are dreaded before, dreaded during, and regretted after.</p>
<p>Safety behaviors—subtle avoidance strategies employed within social situations—maintain social anxiety by preventing disconfirmation of negative beliefs. Examples include avoiding eye contact, speaking quietly, giving short answers, staying near exits, wearing concealing clothing, rehearsing statements mentally before speaking, holding drinks to hide shaking hands, or arriving late to avoid small talk. A person who avoids eye contact, speaks softly, or stays near exits may get through social encounters without obvious disaster, but they attribute their survival to the safety behaviors rather than learning that catastrophe was never imminent. "I only got through it because I didn't make eye contact" prevents learning that eye contact wouldn't have led to rejection. Effective treatment requires identification and elimination of safety behaviors alongside exposure to feared situations.</p>`,
          order: 13
        },
        {
          type: 'text',
          content: `<h2>Specific Phobias</h2>
<p>Specific Phobias involve marked fear or anxiety about specific objects or situations that is out of proportion to actual danger. Common phobia categories include animal type (spiders, snakes), natural environment type (heights, storms), blood-injection-injury type, situational type (airplanes, elevators), and other type (choking, vomiting). The phobic stimulus almost always provokes immediate fear, is avoided or endured with intense anxiety, and causes clinically significant distress or impairment.</p>
<p>Unlike other anxiety disorders with complex cognitive maintaining factors, specific phobias are primarily maintained through simple avoidance. The person who fears dogs avoids dogs; by avoiding dogs, they never learn that most dogs are not dangerous. Treatment through systematic exposure is highly effective, with many specific phobias responding to even brief, intensive exposure interventions. The blood-injection-injury subtype represents a unique case, as it involves parasympathetic (rather than sympathetic) activation leading to vasovagal response and possible fainting, requiring modified exposure protocols.</p>`,
          order: 14
        },
        {
          type: 'text',
          content: `<h2>Skill Builder: Anxiety Disorder Differential Diagnosis</h2>
<p>Practice differentiating anxiety disorders using the following brief presentations. Identify the most likely primary diagnosis for each:</p>
<p><strong>Case A:</strong> 28-year-old reports intense fear of public speaking. She avoids all situations requiring presentations, recently turned down a promotion because it would involve leading meetings, and rehearses conversations extensively before social encounters. At parties, she stays near her husband and avoids meeting new people.</p>
<p><strong>Your Diagnosis:</strong> _______________________</p>
<p><strong>Case B:</strong> 42-year-old describes sudden episodes of racing heart, sweating, and feeling like he can't breathe that occur unpredictably, sometimes waking him from sleep. Since these started 4 months ago, he's begun avoiding exercise (afraid it will trigger an episode) and won't drive on highways (afraid of being trapped if an episode occurs).</p>
<p><strong>Your Diagnosis:</strong> _______________________</p>
<p><strong>Case C:</strong> 35-year-old presents with chronic worry about "everything"—her children's safety, her job security, whether she offended a friend, whether she's developing a serious illness. She describes difficulty relaxing, tension headaches, and snapping at her family. When one worry resolves, another immediately replaces it.</p>
<p><strong>Your Diagnosis:</strong> _______________________</p>
<h3>Skill Builder Answer Key</h3>
<p><strong>Case A: Social Anxiety Disorder</strong> — Fear of scrutiny/evaluation in social situations, avoidance of performance and social interaction, safety behaviors (staying near husband, rehearsing conversations).</p>
<p><strong>Case B: Panic Disorder</strong> — Recurrent unexpected panic attacks, anticipatory anxiety, agoraphobic avoidance (exercise, highways) based on fear of attacks occurring.</p>
<p><strong>Case C: Generalized Anxiety Disorder</strong> — Excessive worry across multiple domains, difficulty controlling worry, associated symptoms (tension, irritability), chronic course.</p>`,
          order: 15
        },
        {
          type: 'text',
          content: `<h2>Comorbidity and Differential Diagnosis Considerations</h2>
<p>Anxiety disorders frequently co-occur with each other and with other psychiatric conditions. Approximately 60% of individuals with one anxiety disorder meet criteria for at least one additional anxiety disorder. Depression is highly comorbid with anxiety, with lifetime comorbidity rates exceeding 50% for major depressive disorder and GAD. Substance use disorders also commonly co-occur, sometimes representing attempts at self-medication.</p>
<p>Careful differential diagnosis requires systematic assessment of each potential disorder rather than stopping at the first diagnosis identified. Assessment should include structured or semi-structured diagnostic interviews covering all anxiety disorder criteria, assessment of depressive symptoms, and screening for substance use. Medical conditions that can produce anxiety symptoms—including thyroid disorders, cardiac arrhythmias, and respiratory conditions—should be ruled out, particularly for new-onset anxiety or anxiety with prominent physical symptoms.</p>
<p>The distinction between anxiety disorders and obsessive-compulsive and related disorders (now a separate diagnostic category in DSM-5) requires attention. While anxiety is prominent in OCD, the presence of true obsessions (intrusive, unwanted thoughts that are ego-dystonic) and compulsions (repetitive behaviors or mental acts performed to reduce anxiety) distinguishes OCD from anxiety disorders. Similarly, trauma-related disorders (PTSD, Acute Stress Disorder) may present with prominent anxiety but are classified separately and require trauma-specific assessment and treatment.</p>`,
          order: 16
        },
        {
          type: 'multipleChoice',
          question: 'According to the cognitive model of anxiety, anxiety disorders result from:',
          options: [
            { text: 'Excessive activation of the parasympathetic nervous system', isCorrect: false },
            { text: 'Insufficient worry about realistic life concerns', isCorrect: false },
            { text: 'Exclusively genetic factors unrelated to cognition', isCorrect: false },
            {
              text: 'Overestimation of threat probability/severity and underestimation of coping ability',
              isCorrect: true
            }
          ],
          correctAnswer: 3,
          explanation: 'Beck\'s cognitive model emphasizes distorted threat appraisal (overestimating danger, underestimating coping resources) as the core cognitive feature generating and maintaining anxiety.',
          order: 17
        },
        {
          type: 'multipleChoice',
          question: 'The primary maintaining factor across most anxiety disorders is:',
          options: [
            { text: 'Avoidance of feared stimuli', isCorrect: true },
            { text: 'Medication side effects', isCorrect: false },
            { text: 'Excessive exposure to feared stimuli', isCorrect: false },
            { text: 'Positive beliefs about anxiety', isCorrect: false }
          ],
          correctAnswer: 0,
          explanation: 'Avoidance is negatively reinforced by anxiety reduction but prevents extinction learning, maintaining the belief that feared stimuli are dangerous and the person cannot cope.',
          order: 18
        },
        {
          type: 'multipleChoice',
          question: 'Panic Disorder is distinguished from panic attacks occurring in other anxiety disorders by:',
          options: [
            { text: 'The severity of panic symptoms', isCorrect: false },
            {
              text: 'Unexpected attacks plus persistent fear/behavioral changes related to attacks',
              isCorrect: true
            },
            { text: 'The presence of agoraphobia', isCorrect: false },
            { text: 'Exclusively nocturnal occurrence', isCorrect: false }
          ],
          correctAnswer: 1,
          explanation: 'Panic disorder specifically requires unexpected (uncued) attacks plus either persistent concern about future attacks, worry about attack consequences, or maladaptive behavioral changes—not just the experience of panic symptoms.',
          order: 19
        },
        {
          type: 'keyTakeaway',
          title: 'Module 1 — What to Carry Into the Room',
          takeaways: [
            'Anxiety disorders are dysregulations of a normal threat-detection system, not deficits of willpower; the clinical question is always which specific maintaining mechanism is active.',
            'Avoidance — behavioral, cognitive, and interoceptive — is the common maintaining factor across every anxiety disorder, and every effective treatment works by reversing it.',
            'GAD presents as free-floating worry that migrates across domains; panic disorder presents as fear of the body\'s own sensations; social anxiety presents as fear of negative evaluation with safety behaviors that prevent disconfirmation.',
            'Comorbidity is the rule rather than the exception: roughly 60% of clients with one anxiety disorder meet criteria for another, and lifetime comorbidity with major depression exceeds 50%.',
            'Rule out medical contributors — thyroid dysfunction, cardiac arrhythmia, respiratory disease, substance and caffeine effects — particularly with new-onset anxiety or prominent somatic symptoms.'
          ],
          order: 20
        },
        {
          type: 'multipleChoice',
          question: 'The cognitive model of Social Anxiety Disorder emphasizes which maintaining factor?',
          options: [
            { text: 'Insufficient social skills', isCorrect: false },
            { text: 'Realistic evaluation of social threat', isCorrect: false },
            {
              text: 'Negative self-focused attention and distorted self-perception',
              isCorrect: true
            },
            { text: 'Underactive amygdala response', isCorrect: false }
          ],
          correctAnswer: 2,
          explanation: 'SAD is maintained by shifting attention inward to monitor for signs of inadequacy, constructing distorted images of how one appears to others, which interferes with performance and prevents processing positive feedback.',
          order: 21
        },
        {
          type: 'multipleChoice',
          question: 'Intolerance of uncertainty is a core cognitive feature of:',
          options: [
            { text: 'Specific Phobia', isCorrect: false },
            { text: 'Panic Disorder', isCorrect: false },
            { text: 'Social Anxiety Disorder', isCorrect: false },
            { text: 'Generalized Anxiety Disorder', isCorrect: true }
          ],
          correctAnswer: 3,
          explanation: 'Intolerance of uncertainty—difficulty tolerating ambiguity and the possibility of negative outcomes—is central to GAD, driving excessive worry as an attempt to achieve certainty and prepare for all possibilities.',
          order: 22
        },
        {
          type: 'reflection',
          question: 'Think of a client you have worked with whose anxiety you found difficult to categorize. Looking back with the differential framework from this module in mind, which maintaining mechanism was most likely operating — worry as avoidance, catastrophic misinterpretation of bodily sensations, or fear of negative evaluation sustained by safety behaviors? What would you have done differently if you had named that mechanism explicitly in session three rather than session thirteen?',
          order: 23
        }
      ]
    },
    {
      title: 'Module 2: Understanding Depressive Disorders',
      order: 3,
      description: 'Depression is not sadness intensified; it is a disorder of behavioral withdrawal, cognitive distortion, and lost reinforcement that responds to structured intervention.',
      contentBlocks: [
        {
          type: 'sectionDivider',
          sectionNumber: '2',
          title: 'Module 2: Understanding Depressive Disorders',
          subtitle: 'Depression is not sadness intensified; it is a disorder of behavioral withdrawal, cognitive distortion, and lost reinforcement that responds to structured intervention.',
          order: 1
        },
        {
          type: 'text',
          content: `<h2>Introduction</h2>
<p>Depression is among the leading causes of disability worldwide, affecting over 280 million people globally and creating profound suffering for individuals and their families. In the United States, major depressive disorder affects approximately 8.4% of adults annually, with lifetime prevalence exceeding 20%. Depression is associated with impaired functioning across all life domains, medical comorbidity, and elevated mortality—including but not limited to suicide, which claims nearly 46,000 American lives each year.</p>
<p>Despite the magnitude of depression's impact, it remains one of the most treatable mental health conditions when evidence-based interventions are applied. Cognitive-behavioral therapy produces response rates comparable to antidepressant medication, with evidence suggesting more durable effects and lower relapse rates following treatment termination. Understanding the phenomenology and mechanisms of depressive disorders enables clinicians to select and deliver effective treatments that can restore functioning and quality of life.</p>
<p>This module examines depressive disorders through their diagnostic criteria, cognitive and behavioral mechanisms, neurobiological substrates, and assessment approaches. We pay particular attention to features that guide treatment selection and that predict treatment response, building practical knowledge that informs clinical decision-making.</p>`,
          order: 2
        },
        {
          type: 'callout',
          calloutType: 'warning',
          title: 'Screen for Bipolarity Before Treating Depression',
          content: `<p>Every depressed client requires screening for a history of hypomania or mania before treatment planning. A depressive episode within bipolar disorder is the same phenomenology with a different treatment pathway and different risk profile, and the client will rarely volunteer a hypomanic history because hypomania is not what brings people to treatment. Ask directly about periods of decreased need for sleep with increased energy, uncharacteristic impulsivity, and elevated or irritable mood lasting several days. Document the screening. Missing bipolarity is one of the most consequential and most common diagnostic errors in outpatient depression care.</p>`,
          order: 3
        },
        {
          type: 'text',
          content: `<h3>Myth vs. Fact: Depression Edition</h3>
<p>Open each myth to see what the evidence actually shows.</p>`,
          order: 4
        },
        {
          type: 'accordion',
          accordionItems: [
            {
              title: 'Myth: Depression is just sadness that people need to "snap out of."',
              content: `<p><strong>Fact:</strong> Depression is a syndrome involving changes in mood, cognition, behavior, and physiology that cannot be willed away. It involves measurable changes in brain function and is as much a medical condition as diabetes or hypertension.</p>`
            },
            {
              title: 'Myth: If someone is functioning at work, they can\'t be seriously depressed.',
              content: `<p><strong>Fact:</strong> Many individuals with depression maintain functioning through enormous effort, often at great personal cost. High-functioning depression is genuine depression and warrants treatment.</p>`
            },
            {
              title: 'Myth: Talking about suicide increases suicide risk.',
              content: `<p><strong>Fact:</strong> Research consistently shows that asking about suicide does not increase risk and may actually reduce it by opening dialogue and communicating care. Clinicians should directly assess suicide risk in all depressed clients.</p>`
            },
            {
              title: 'Myth: Depression is a sign of personal weakness.',
              content: `<p><strong>Fact:</strong> Depression occurs across all levels of strength, success, and character. Many accomplished individuals—Abraham Lincoln, Winston Churchill, Buzz Aldrin—have experienced significant depression. Depression is a medical condition influenced by genetics, brain chemistry, life experiences, and circumstances. It is no more a sign of weakness than diabetes or heart disease.</p>`
            }
          ],
          order: 5
        },
        {
          type: 'text',
          content: `<h2>The Phenomenology of Depression</h2>
<p>Depression involves far more than sadness. While depressed mood is often the most prominent feature, the syndrome encompasses changes across multiple domains: emotion, cognition, motivation, behavior, and physiology. Clients may describe their experience using terms other than "sad"—empty, numb, hopeless, irritable, or unable to experience pleasure. Some clients, particularly men and those from certain cultural backgrounds, may minimize emotional symptoms while endorsing physical complaints, social withdrawal, or irritability.</p>
<p>The emotional features of depression include persistent low mood, diminished interest or pleasure (anhedonia), and emotional flatness or emptiness. Anhedonia—the loss of ability to experience pleasure in previously enjoyable activities—is particularly diagnostically significant and often more specific to depression than sadness alone. Clients may describe no longer caring about hobbies, relationships, or achievements that previously brought satisfaction.</p>
<p>Cognitive features include difficulty concentrating and making decisions, negative views of self, world, and future (Beck's cognitive triad), rumination on past failures and current inadequacies, and in severe cases, psychotic features such as delusions of guilt, worthlessness, or somatic disease. The cognitive slowing often experienced in depression can impair work performance, academic functioning, and daily task completion.</p>
<p>Behavioral features include psychomotor retardation (slowed movement, speech, and thought) or agitation (restlessness, pacing, inability to sit still), social withdrawal, and reduced engagement in activities. Motivational deficits—difficulty initiating and sustaining goal-directed activity—often precede and outlast mood symptoms, creating functional impairment even when clients no longer feel acutely sad.</p>
<p>Physiological features include changes in sleep (insomnia or hypersomnia), appetite (decreased or increased, with corresponding weight changes), energy (fatigue despite adequate rest), and libido. These neurovegetative symptoms reflect depression's biological dimensions and often require direct intervention alongside psychological treatment.</p>`,
          order: 6
        },
        {
          type: 'imageText',
          title: 'The Depression Maintenance Cycle',
          content: `<p>The behavioral model of depression is best understood as a closed loop rather than a linear chain. A precipitating loss or stressor reduces contact with rewarding activity. Reduced reward produces lowered mood and diminished energy. Lowered mood makes further activity feel effortful and pointless, which produces additional withdrawal. Each turn of the loop reduces the client's access to the very experiences that would lift mood, and each turn provides fresh evidence for the negative cognitive triad: I am incapable, the world offers nothing, and this will not change.</p>
<p>Reading the cycle clinically matters because it identifies where intervention can enter. The loop cannot be broken at the level of mood, because mood is downstream — telling a client to feel differently asks them to change the output rather than the input. It can be broken at the level of behavior, because behavior is the one node the client can act on directly regardless of how they feel. This is the entire rationale for behavioral activation, and it is the rationale you will need to give the client in plain language before the first activity is scheduled.</p>`,
          image: '',
          imageAlt: 'A circular diagram of the depression maintenance cycle with four connected nodes: a precipitating loss or stressor leads to reduced activity and withdrawal, which leads to reduced positive reinforcement, which leads to lowered mood and fatigue, which returns to further withdrawal. An arrow labeled "behavioral activation" enters the loop at the withdrawal node, indicating the point of intervention.',
          imagePosition: 'right',
          order: 7
        },
        {
          type: 'text',
          content: `<h2>Clinical Vignette: Meet Jasmine</h2>
<blockquote><p>Jasmine, a 28-year-old marketing coordinator, presents reporting that she "just can't do anything anymore." Over the past two months, she's been calling in sick to work frequently, has stopped going to the gym (previously a daily habit), and hasn't seen friends in weeks. She reports sleeping 10-12 hours per night yet waking exhausted, and she's gained 15 pounds from "eating whatever's easiest." She describes her mood as "empty" rather than sad and says she doesn't see the point in trying because "nothing will change anyway." When asked about interests, she shrugs: "I don't really care about anything." She denies active suicidal ideation but admits she sometimes thinks "everyone would be fine without me."</p></blockquote>`,
          order: 8
        },
        {
          type: 'multipleChoice',
          question: 'Clinical Vignette: Meet Jasmine — Which additional assessment is MOST critical at this point in the interview?',
          options: [
            { text: 'Detailed sleep study to rule out sleep disorder', isCorrect: false },
            { text: 'Comprehensive suicide risk assessment', isCorrect: true },
            {
              text: 'Personality assessment to evaluate characterological features',
              isCorrect: false
            },
            { text: 'Assessment of manic/hypomanic symptoms', isCorrect: false }
          ],
          correctAnswer: 1,
          explanation: 'Jasmine\'s statement that "everyone would be fine without me" is a passive suicidal statement that requires immediate follow-up with comprehensive suicide risk assessment. While the other assessments have value, safety assessment takes priority. Her presentation suggests major depressive disorder with significant neurovegetative features, but determining suicide risk is the immediate clinical imperative. Assessment of manic/hypomanic symptoms (option d) is appropriate to rule out bipolar disorder, but only after safety is established. Sleep assessment and personality evaluation can occur later in the evaluation process. We\'ll continue following Jasmine\'s case to illustrate treatment planning and implementation.',
          order: 9
        },
        {
          type: 'text',
          content: `<h2>Self-Assessment: Depression Risk Awareness</h2>
<p>How prepared are you to assess depression and suicide risk? Rate honestly:</p>
<table><thead><tr><th>Competency</th><th>Not at all</th><th>Somewhat</th><th>Very</th></tr></thead><tbody><tr><td>I can recite all 9 DSM-5 MDD criteria from memory</td><td>○</td><td>○</td><td>○</td></tr><tr><td>I routinely use standardized depression measures</td><td>○</td><td>○</td><td>○</td></tr><tr><td>I directly ask about suicide with every depressed client</td><td>○</td><td>○</td><td>○</td></tr><tr><td>I know the difference between passive and active SI</td><td>○</td><td>○</td><td>○</td></tr><tr><td>I can distinguish MDD from bipolar depression</td><td>○</td><td>○</td><td>○</td></tr></tbody></table>
<blockquote><p>Areas rated "Not at all" or "Somewhat" are your growth edges for this module.</p></blockquote>`,
          order: 10
        },
        {
          type: 'text',
          content: `<h2>Major Depressive Disorder: Diagnostic Criteria</h2>
<p>Major Depressive Disorder (MDD) requires the presence of a major depressive episode, defined as five or more symptoms present during the same two-week period, with at least one symptom being either depressed mood or loss of interest/pleasure (anhedonia). The nine criterion symptoms, easily remembered through the mnemonic SIG E CAPS (Sleep, Interest, Guilt, Energy, Concentration, Appetite, Psychomotor changes, Suicidality), must represent a change from previous functioning and must cause clinically significant distress or functional impairment.</p>
<p>The specific criteria are: (1) depressed mood most of the day, nearly every day; (2) markedly diminished interest or pleasure in almost all activities; (3) significant weight loss or gain, or decrease or increase in appetite; (4) insomnia or hypersomnia; (5) psychomotor agitation or retardation observable by others; (6) fatigue or loss of energy; (7) feelings of worthlessness or excessive/inappropriate guilt; (8) diminished ability to think, concentrate, or make decisions; and (9) recurrent thoughts of death, suicidal ideation, or suicide attempt.</p>
<p>MDD specifiers provide additional diagnostic precision and guide treatment. Current severity (mild, moderate, severe) is rated based on symptom count and functional impairment. The "with anxious distress" specifier applies when significant anxiety symptoms accompany depression and predicts poorer treatment response. The "with melancholic features" specifier indicates a depression subtype with profound anhedonia, distinct quality of depressed mood, and prominent neurovegetative symptoms that may respond preferentially to biological treatments. The "with atypical features" specifier describes depression with mood reactivity, hypersomnia, hyperphagia, and rejection sensitivity. The "with peripartum onset" and "with seasonal pattern" specifiers identify depressions with particular timing patterns.</p>`,
          order: 11
        },
        {
          type: 'text',
          content: `<h2>Persistent Depressive Disorder (Dysthymia)</h2>
<p>Persistent Depressive Disorder (PDD), previously called dysthymia, involves chronic depressed mood for at least two years (one year in children/adolescents) accompanied by at least two of six associated symptoms: appetite changes, sleep changes, low energy, low self-esteem, poor concentration, and hopelessness. Unlike MDD, PDD does not require the full syndrome of a major depressive episode, but it involves longer duration and often becomes part of the individual's personality, with statements like "I've always been this way."</p>
<p>When major depressive episodes occur superimposed on PDD, this represents "double depression"—a particularly challenging presentation involving both acute episodes and chronic background depression. Treatment of double depression requires addressing both the acute episode and the chronic depression, as simply treating the acute episode will return the client to their chronic depressed baseline rather than to euthymia.</p>
<p>The distinction between MDD and PDD has treatment implications. PDD's chronicity and ego-syntonic nature often require longer treatment and particular attention to beliefs that depression is "just who I am" rather than a treatable condition. Chronic depression may also involve more characterological features and interpersonal patterns that require attention beyond acute symptom management.</p>`,
          order: 12
        },
        {
          type: 'matching',
          matchingInstructions: 'Depression: Mechanisms and Measures — Match each construct to the description that captures its clinical meaning. These are the terms you will use when explaining depression to a client and when documenting your formulation.',
          matchingPairs: [
            {
              term: 'Negative cognitive triad',
              definition: 'Beck\'s account of the three simultaneous negative views that characterize depressive cognition: a negative view of the self, of the world and current experience, and of the future.'
            },
            {
              term: 'Anhedonia',
              definition: 'Markedly diminished interest or pleasure in nearly all activities — one of the two gateway symptoms for major depressive disorder, and often a stronger predictor of functional impairment than sad mood.'
            },
            {
              term: 'Response-contingent positive reinforcement',
              definition: 'The behavioral construct whose loss drives depression: as withdrawal reduces contact with rewarding activity, mood drops further, producing more withdrawal in a self-sustaining cycle.'
            },
            {
              term: 'Persistent depressive disorder',
              definition: 'Depressed mood for more days than not over at least two years with at least two additional symptoms; typically earlier onset, more chronic course, and greater comorbidity than a discrete major depressive episode.'
            },
            {
              term: 'PHQ-9',
              definition: 'A nine-item self-report measure mapped directly onto DSM criteria, scored 0–27, with severity bands at 5, 10, 15, and 20, and a final item that screens directly for thoughts of death or self-harm.'
            },
            {
              term: 'Rumination',
              definition: 'Repetitive, abstract, self-focused analysis of distress and its causes that prolongs depressed mood, impairs problem-solving, and predicts both onset and recurrence of depressive episodes.'
            },
            {
              term: 'Behavioral activation',
              definition: 'A structured treatment that reverses the withdrawal cycle by scheduling specific, values-linked activities graded for mastery and pleasure, independent of the client\'s momentary motivation.'
            }
          ],
          order: 13
        },
        {
          type: 'text',
          content: `<h2>Cognitive and Behavioral Models of Depression</h2>
<h3>Beck's Cognitive Model</h3>
<p>Aaron Beck's cognitive model of depression, developed in the 1960s and refined over subsequent decades, remains the dominant psychological model underlying cognitive therapy for depression. The model proposes that depression results from negatively biased information processing driven by dysfunctional schemas—core beliefs about self, world, and future (the "cognitive triad") that filter experience in depression-maintaining ways.</p>
<p>The cognitive triad consists of negative views of the self ("I am worthless, inadequate, unlovable"), negative views of the world ("The world is harsh, unfair, unsatisfying"), and negative views of the future ("Things will never improve, there's no point trying"). These negative views generate automatic thoughts—the spontaneous, often unexamined cognitions that run through the mind in specific situations—that maintain depressed mood and behavior.</p>
<p>Cognitive distortions represent systematic errors in information processing that maintain negative beliefs despite contradicting evidence. Common distortions include all-or-nothing thinking (seeing situations in black-and-white terms without middle ground), overgeneralization (drawing broad negative conclusions from single events), mental filtering (focusing exclusively on negative details while ignoring positives), disqualifying the positive (dismissing positive experiences as not counting), jumping to conclusions (mind-reading or fortune-telling without evidence), catastrophizing (exaggerating the importance of negative events), emotional reasoning (assuming feelings reflect reality: "I feel hopeless, therefore my situation is hopeless"), should statements (rigid rules about how self/others should behave), labeling (attaching global negative labels to self or others), and personalization (assuming responsibility for negative events outside one's control).</p>
<h3>Behavioral Models</h3>
<p>Behavioral models of depression, particularly Lewinsohn's behavioral activation model, emphasize the role of reduced positive reinforcement in maintaining depression. According to this model, depression develops when individuals experience decreased access to positive reinforcement—whether due to environmental changes (loss of job, relationship, valued activities) or skill deficits that limit ability to obtain reinforcement. Reduced reinforcement leads to reduced behavior, which further reduces opportunities for reinforcement, creating a downward spiral of behavioral withdrawal and depressive symptoms.</p>
<p>This model has profound treatment implications. Rather than waiting for motivation to return before engaging in activity (which often never happens), behavioral activation treatment has clients increase activity despite low motivation. As activity increases, opportunities for positive reinforcement increase, and mood gradually improves. The slogan "action before motivation" captures this principle—motivation follows behavior rather than preceding it.</p>
<p>Rumination—repetitive, passive focus on depressive symptoms and their causes and consequences—represents another behavioral maintaining factor. Unlike active problem-solving, rumination involves cycling through negative thoughts without moving toward resolution. Rumination is reinforced because it feels like productive thinking, but it actually maintains depression by intensifying negative affect, interfering with problem-solving, and reducing engagement in potentially rewarding activities.</p>`,
          order: 14
        },
        {
          type: 'text',
          content: `<h2>Reflection Exercise: The Client Who Doesn't Believe Change Is Possible</h2>
<p>Imagine you're working with a client who has been depressed for years and firmly believes nothing can help. They've "tried everything," view their depression as permanent, and come to sessions passively, waiting to be "fixed."</p>
<p>Reflect on the following:</p>
<ol><li><strong>What emotions arise in you</strong> when working with a client who seems hopeless about treatment?</li></ol>
<ol><li><strong>How might you address hopelessness as a symptom of depression</strong> rather than an accurate assessment of treatment prospects?</li></ol>
<ol><li><strong>What evidence would you offer</strong> that change is possible for chronic depression?</li></ol>
<ol><li><strong>How would you balance validation of their suffering</strong> with gentle challenging of hopelessness?</li></ol>
<blockquote><p>Consider discussing these questions in peer consultation or supervision.</p></blockquote>`,
          order: 15
        },
        {
          type: 'text',
          content: `<h2>Neurobiological Perspectives</h2>
<p>Depression involves alterations in multiple neurobiological systems, though no single mechanism fully accounts for the disorder—a reality that reflects the heterogeneity of depression as a clinical syndrome. Understanding neurobiological factors helps clinicians appreciate depression's biological reality, informs pharmacological treatment decisions, and supports psychoeducation that reduces client shame and self-blame.</p>
<p>The monoamine hypothesis, which guided antidepressant development for decades, proposes that depression results from deficits in serotonin, norepinephrine, and/or dopamine neurotransmission. This hypothesis emerged from observations that drugs depleting monoamines could induce depression-like states, while drugs enhancing monoamine availability (the early antidepressants) could relieve depression. While antidepressants that increase monoamine availability are effective, the latency of their effects (typically 2-4 weeks despite immediate neurochemical changes) suggests the mechanism involves downstream adaptations—changes in receptor sensitivity, gene expression, and neuroplasticity—rather than simple correction of a chemical imbalance. The simplistic "chemical imbalance" narrative, while useful for reducing stigma, does not accurately capture the complexity of depression's neurobiology.</p>
<p>Neuroimaging studies reveal structural and functional alterations in depression, including reduced hippocampal volume (potentially reflecting stress-related neurotoxicity or impaired neurogenesis), altered prefrontal cortex function (particularly in regions involved in cognitive control and emotion regulation), and hyperactive amygdala responses to negative stimuli. The subgenual anterior cingulate cortex (Brodmann area 25) shows hyperactivity in depression that normalizes with successful treatment, whether that treatment is medication, psychotherapy, or deep brain stimulation. These findings support the notion of depression as a brain-based disorder while not negating the importance of psychological treatment, which also produces measurable brain changes—a phenomenon that undermines the false dichotomy between "biological" and "psychological" conditions.</p>
<p>Stress and hypothalamic-pituitary-adrenal (HPA) axis dysfunction are implicated in depression. Many depressed individuals show elevated cortisol levels, disrupted diurnal cortisol patterns (lacking the normal decline from morning to evening), and failure to suppress cortisol in response to dexamethasone challenge. Chronic stress exposure may produce neurotoxic effects that contribute to the hippocampal volume reductions observed in depression. The relationship between stress and depression is bidirectional—stress predicts depression onset through biological and psychological mechanisms, and depression increases stress exposure through impaired functioning, interpersonal difficulties, and stress generation.</p>
<p>Inflammation has emerged as another potentially important mechanism in a subset of depressed individuals. Elevated inflammatory markers (C-reactive protein, interleukins, tumor necrosis factor) are observed in some depressed patients, and inflammation may contribute to depression through effects on neurotransmitter metabolism (particularly through the kynurenine pathway), neuroplasticity, and HPA axis function. This "inflammatory subtype" may have implications for treatment selection, potentially responding better to anti-inflammatory interventions or to antidepressants with anti-inflammatory effects. The inflammation-depression link also helps explain the well-documented relationship between depression and physical illness, particularly inflammatory conditions.</p>
<p>Genetic factors contribute to depression risk, with heritability estimates around 40%. However, depression is polygenic, with many genes of small effect rather than single genes of large effect. Gene-environment interactions are important—genetic vulnerability may become expressed only in the context of environmental stressors, and environmental resilience factors may buffer genetic risk.</p>`,
          order: 16
        },
        {
          type: 'text',
          content: `<h2>Assessment and Measurement-Based Care</h2>
<p>Effective depression treatment requires systematic assessment using validated instruments administered repeatedly to track progress and guide treatment decisions. This measurement-based care approach improves outcomes compared to treatment guided by clinical judgment alone.</p>
<p>The Patient Health Questionnaire-9 (PHQ-9) is the most widely used depression screening and monitoring instrument in clinical practice. Its nine items directly correspond to DSM-5 criteria, scored from 0 (not at all) to 3 (nearly every day), yielding total scores from 0 to 27. Cut-points of 5, 10, 15, and 20 represent mild, moderate, moderately severe, and severe depression. The PHQ-9 takes approximately two minutes to complete and can be administered at every session to track progress.</p>
<p>The Beck Depression Inventory-II (BDI-II) is a 21-item self-report measure widely used in both clinical practice and research. Each item presents four statements representing increasing severity, scored 0-3. Total scores range from 0 to 63, with cut-points of 14, 20, and 29 representing mild, moderate, and severe depression. The BDI-II has excellent psychometric properties and extensive normative data.</p>`,
          order: 17
        },
        {
          type: 'text',
          content: `<h2>Skill Builder: PHQ-9 Interpretation Practice</h2>
<p>Review the following PHQ-9 results and determine severity level, clinical interpretation, and recommended action:</p>
<p><strong>Client 1:</strong> Total score = 22</p>
<ul><li>Item 9 (suicidal thoughts) = 2 ("More than half the days")</li></ul>
<p><strong>Your interpretation:</strong> _______________________ <strong>Recommended action:</strong> _______________________</p>
<p><strong>Client 2:</strong> Total score = 8</p>
<ul><li>All items scored 0 or 1</li><li>Reports significant functional impairment despite low score</li></ul>
<p><strong>Your interpretation:</strong> _______________________ <strong>Recommended action:</strong> _______________________</p>
<p><strong>Client 3:</strong> Week 1 score = 18, Week 4 score = 16, Week 8 score = 15</p>
<p><strong>Your interpretation:</strong> _______________________ <strong>Recommended action:</strong> _______________________</p>
<h3>Skill Builder Answer Key</h3>
<p><strong>Client 1:</strong> Severe depression (20+ = severe range) with significant suicide risk requiring immediate assessment. The elevated item 9 necessitates comprehensive suicide risk evaluation before proceeding with other session content. Action: Conduct full suicide risk assessment, develop safety plan, determine appropriate level of care.</p>
<p><strong>Client 2:</strong> Mild depression by score, but discrepancy between score and functional impairment warrants exploration. Client may be minimizing on self-report, may have atypical depression presentation, or impairment may relate to other factors. Action: Explore discrepancy through clinical interview, consider other contributing factors, don't dismiss client's experience based on low score.</p>
<p><strong>Client 3:</strong> Inadequate treatment response. After 8 weeks, score reduction of only 3 points (17%) falls far short of expected 50% reduction. Action: Review treatment fidelity, consider barriers to engagement, evaluate need for treatment adjustment (intensification, augmentation, or change of approach).</p>`,
          order: 18
        },
        {
          type: 'multipleChoice',
          question: 'The cognitive triad in Beck\'s model of depression includes negative views of:',
          options: [
            { text: 'Self, world, and future', isCorrect: true },
            { text: 'Past, present, and future', isCorrect: false },
            { text: 'Family, work, and relationships', isCorrect: false },
            { text: 'Body, mind, and spirit', isCorrect: false }
          ],
          correctAnswer: 0,
          explanation: 'Beck\'s cognitive triad specifically describes negative views of the self (I am worthless), the world (the world is harsh), and the future (things will never improve).',
          order: 19
        },
        {
          type: 'multipleChoice',
          question: 'Behavioral activation is based on which principle?',
          options: [
            { text: 'Motivation must return before behavior can change', isCorrect: false },
            {
              text: 'Increased activity leads to increased opportunities for positive reinforcement',
              isCorrect: true
            },
            {
              text: 'Relaxation reduces depression by decreasing physiological arousal',
              isCorrect: false
            },
            {
              text: 'Analyzing the causes of depression is necessary before symptoms can improve',
              isCorrect: false
            }
          ],
          correctAnswer: 1,
          explanation: 'Behavioral models propose that depression is maintained by reduced positive reinforcement. Behavioral activation increases activity to increase reinforcement opportunities—action before motivation.',
          order: 20
        },
        {
          type: 'multipleChoice',
          question: 'Which PHQ-9 total score indicates severe depression?',
          options: [
            { text: '5-9', isCorrect: false },
            { text: '10-14', isCorrect: false },
            { text: '20 or higher', isCorrect: true },
            { text: '15-19', isCorrect: false }
          ],
          correctAnswer: 2,
          explanation: 'PHQ-9 severity ranges are 5-9 (mild), 10-14 (moderate), 15-19 (moderately severe), and 20+ (severe).',
          order: 21
        },
        {
          type: 'keyTakeaway',
          title: 'Module 2 — What to Carry Into the Room',
          takeaways: [
            'Major depressive disorder requires either depressed mood or anhedonia plus a total of five symptoms across a two-week period; persistent depressive disorder requires two years of chronic low-grade symptoms and often responds differently to treatment.',
            'Beck\'s cognitive model locates depression in the negative triad — negative views of self, world, and future — sustained by systematic information-processing biases.',
            'Behavioral models locate depression in a loss of response-contingent positive reinforcement, which explains why withdrawal deepens depression and why activation reverses it.',
            'The PHQ-9 provides both severity scoring and a direct suicide-risk item; a score of 10 or above warrants active treatment, and any endorsement of item 9 requires immediate assessment.',
            'Screen every depressed client for a history of hypomania before selecting a treatment path — unrecognized bipolarity changes both the treatment and the risk picture.'
          ],
          order: 22
        },
        {
          type: 'multipleChoice',
          question: 'Persistent Depressive Disorder differs from Major Depressive Disorder primarily in:',
          options: [
            { text: 'Severity of symptoms', isCorrect: false },
            { text: 'Presence of suicidal ideation', isCorrect: false },
            { text: 'Response to medication', isCorrect: false },
            { text: 'Duration (at least 2 years of chronic depression)', isCorrect: true }
          ],
          correctAnswer: 3,
          explanation: 'PDD is defined by chronicity—depressed mood more days than not for at least 2 years—rather than necessarily meeting full major depressive episode criteria at any given time.',
          order: 23
        },
        {
          type: 'multipleChoice',
          question: 'Rumination maintains depression by:',
          options: [
            {
              text: 'Intensifying negative affect while interfering with productive action',
              isCorrect: true
            },
            { text: 'Promoting active problem-solving', isCorrect: false },
            { text: 'Providing distraction from negative emotions', isCorrect: false },
            { text: 'Facilitating emotional processing and resolution', isCorrect: false }
          ],
          correctAnswer: 0,
          explanation: 'Unlike productive reflection, rumination involves passive, repetitive focus on symptoms and their causes that intensifies negative affect, impairs problem-solving, and reduces engagement in reinforcing activities.',
          order: 24
        },
        {
          type: 'reflection',
          question: 'Consider your own reaction to a client who describes their depression as permanent and their situation as unchangeable. What happens in you when a client rejects the possibility of improvement — do you argue, reassure, go quiet, or work harder? Write honestly about the pull you feel, and about what a behavioral rather than a persuasive response would look like in that moment.',
          order: 25
        }
      ]
    },
    {
      title: 'Module 3: Cognitive-Behavioral Therapy for Anxiety and Depression',
      order: 4,
      description: 'CBT works because it changes what clients believe and what clients do — and because it teaches them to keep doing it after therapy ends.',
      contentBlocks: [
        {
          type: 'sectionDivider',
          sectionNumber: '3',
          title: 'Module 3: Cognitive-Behavioral Therapy for Anxiety and Depression',
          subtitle: 'CBT works because it changes what clients believe and what clients do — and because it teaches them to keep doing it after therapy ends.',
          order: 1
        },
        {
          type: 'text',
          content: `<h2>Introduction</h2>
<p>Cognitive-Behavioral Therapy represents the most extensively researched and empirically supported psychotherapy for anxiety and depressive disorders. Meta-analyses consistently demonstrate that CBT produces large effect sizes compared to waitlist controls and performs comparably or superiorly to pharmacotherapy, with evidence suggesting more durable effects and lower relapse rates following treatment termination. Professional guidelines from organizations including the American Psychological Association, the National Institute for Health and Care Excellence (NICE), and the American Psychiatric Association recommend CBT as a first-line treatment for most anxiety and depressive disorders.</p>
<p>CBT's effectiveness stems from its direct targeting of the cognitive and behavioral factors that maintain psychological distress. Rather than exploring historical origins of difficulties or waiting for insight to produce change, CBT actively intervenes in the present-focused thoughts and behaviors that perpetuate symptoms. This action-oriented approach produces relatively rapid symptom reduction—typically within 12-16 sessions—while teaching skills that clients can continue applying independently after treatment ends.</p>
<p>This module covers the core principles and techniques of CBT applicable to both anxiety and depression, with attention to adaptations for each. We examine case conceptualization as the foundation for individualized treatment, cognitive restructuring techniques for identifying and modifying maladaptive thoughts, and behavioral interventions including activity scheduling and behavioral experiments. Throughout, we emphasize the collaborative, empirical stance that characterizes effective CBT.</p>`,
          order: 2
        },
        {
          type: 'callout',
          calloutType: 'tip',
          title: 'Structure Is Not Rigidity',
          content: `<p>New CBT clinicians often abandon session structure the moment a client arrives distressed, believing that agenda-setting is cold. The opposite is true: structure is what makes a session containing rather than diffuse. Set the agenda collaboratively in the first five minutes, and if the client brings a crisis, put the crisis on the agenda and allocate time to it explicitly. What you are protecting is not the agenda items but the practice of deciding together how the hour will be spent — which is itself a corrective experience for clients who feel their lives are happening to them.</p>`,
          order: 3
        },
        {
          type: 'text',
          content: `<h2>The Structure and Style of CBT</h2>
<p>CBT is distinguished by its structured, directive approach that differs markedly from less structured therapies. Each session follows a predictable format: brief mood check using standardized measures, agenda setting collaboratively with the client, review of homework from the previous week, work on agenda items using cognitive and behavioral techniques, summary, and assignment of new homework. This structure maximizes efficient use of session time and reinforces the active, skill-building nature of treatment.</p>
<p>The therapeutic relationship in CBT is characterized by collaborative empiricism—therapist and client work together as a team to investigate the client's beliefs and test them against evidence. The therapist does not tell the client what to think but guides discovery through Socratic questioning—a method of inquiry using strategic questions to help clients examine their thoughts, discover contradictions, and arrive at new conclusions. This collaborative stance engages clients as active participants in their own treatment rather than passive recipients of expert pronouncements.</p>
<p>Homework—or "action plans" as some clinicians prefer—is an essential component of CBT that extends learning beyond the therapy hour. Typical homework includes thought records capturing automatic thoughts and practicing cognitive restructuring, behavioral experiments testing predictions, exposure exercises, activity scheduling, and reading or psychoeducational materials. Treatment outcomes are substantially better when homework is completed, making homework engagement a critical process variable to monitor.</p>`,
          order: 4
        },
        {
          type: 'text',
          content: `<h3>Myth vs. Fact: CBT Edition</h3>
<p>Open each myth to see what the evidence actually shows.</p>`,
          order: 5
        },
        {
          type: 'accordion',
          accordionItems: [
            {
              title: 'Myth: CBT is just positive thinking—telling clients to "look on the bright side."',
              content: `<p><strong>Fact:</strong> CBT does not promote positive thinking but rather accurate, evidence-based thinking. The goal is not to replace negative thoughts with positive ones but to evaluate thoughts critically and develop more balanced, realistic perspectives.</p>`
            },
            {
              title: 'Myth: CBT ignores emotions and focuses only on thoughts.',
              content: `<p><strong>Fact:</strong> CBT directly addresses emotions—they are the target of treatment. Cognitive and behavioral interventions are employed precisely because they are effective means of changing emotional experience. CBT fully acknowledges the importance of emotions.</p>`
            },
            {
              title: 'Myth: CBT is superficial and doesn\'t address "deeper" issues.',
              content: `<p><strong>Fact:</strong> CBT addresses the core beliefs (schemas) that underlie surface-level automatic thoughts. These schemas often developed in childhood and profoundly shape how individuals interpret experience. CBT can be as "deep" as needed while maintaining its practical focus.</p>`
            }
          ],
          order: 6
        },
        {
          type: 'text',
          content: `<h2>CBT Case Conceptualization</h2>
<p>Effective CBT requires individualized case conceptualization that goes beyond diagnosis to understand the specific factors maintaining a particular client's difficulties. The case conceptualization serves as a roadmap for treatment, identifying targets for intervention and guiding selection of specific techniques. While manualized protocols provide useful structure, the individualized conceptualization determines how protocols are applied to each unique client.</p>
<p>A comprehensive CBT case conceptualization addresses several domains. Predisposing factors identify vulnerabilities that increased risk for developing the current difficulties—these might include genetic predisposition, temperamental factors, early adverse experiences, or developmental of maladaptive schemas. Precipitating factors identify the triggers that led to the onset of current symptoms—often stressors, losses, or life transitions that activated latent vulnerabilities.</p>
<p>Most critically for treatment, perpetuating factors identify the cognitive, behavioral, and environmental patterns that maintain symptoms in the present. These are the direct targets for intervention. Perpetuating factors typically include maladaptive thoughts and beliefs, avoidance behaviors, safety behaviors, rumination, reduced positive reinforcement, interpersonal patterns that generate stress, and environmental stressors. Finally, protective factors identify strengths, resources, and resilience factors that can be leveraged in treatment.</p>
<p>The cognitive case conceptualization model links situations, automatic thoughts, emotions, and behaviors in a chain that illuminates maintenance patterns. When a particular situation occurs, it triggers automatic thoughts based on underlying beliefs; these thoughts generate emotional reactions that drive behavioral responses that often reinforce the original beliefs. Making these connections explicit helps clients understand their patterns and identifies specific targets for intervention.</p>`,
          order: 7
        },
        {
          type: 'text',
          content: `<h2>Clinical Vignette: Conceptualizing Marcus</h2>
<blockquote><p>Recall Marcus, our software engineer with GAD and possible social anxiety. Through assessment, you've gathered the following information:</p></blockquote>
<blockquote><p>Predisposing factors: Mother with anxiety disorder, childhood characterized by parental criticism and high expectations, early temperamental inhibition.</p></blockquote>
<blockquote><p>Precipitating factors: Promotion to senior engineer 18 months ago with increased responsibilities and visibility; wife's pregnancy (first child expected in 4 months).</p></blockquote>
<blockquote><p>Current patterns: Constant worry about work performance leading to compulsive email checking and excessive preparation for meetings. Avoids social situations due to fear of embarrassment. Physical tension and insomnia. Seeks frequent reassurance from wife.</p></blockquote>`,
          order: 8
        },
        {
          type: 'text',
          content: `<h3>Cognitive Restructuring in Session: A Demonstration</h3>
<p>This demonstration follows a single automatic thought from identification through evidence-testing to an alternative balanced thought, with the belief rating recorded before and after. As you watch, notice how often the clinician asks a question rather than offering a reframe, and note the moment at which the work shifts from the surface thought to the underlying assumption.</p>`,
          order: 9
        },
        {
          type: 'videoEmbed',
          videoTitle: 'Cognitive Restructuring in Session: A Demonstration',
          videoUrl: 'https://www.youtube.com/embed/PLACEHOLDER_cr439_cognitive_restructuring',
          markers: [
            {
              time: '00:00',
              label: 'Eliciting the automatic thought',
              prompt: 'Notice the specificity of the situation the clinician anchors to before asking for the thought.'
            },
            {
              time: '03:20',
              label: 'Rating belief strength',
              prompt: 'Why take a numeric rating before doing any restructuring work?'
            },
            {
              time: '07:45',
              label: 'Evidence for and against',
              prompt: 'Track how the clinician handles evidence the client offers that supports the negative thought.'
            },
            {
              time: '12:10',
              label: 'Generating the balanced alternative',
              prompt: 'Who produces the alternative thought, and why does that matter for durability?'
            }
          ],
          order: 10
        },
        {
          type: 'multipleChoice',
          question: 'Clinical Vignette: Conceptualizing Marcus — Which of the following would you prioritize as the primary perpetuating factor to target in treatment?',
          options: [
            { text: 'His mother\'s anxiety disorder', isCorrect: false },
            { text: 'His childhood experiences of criticism', isCorrect: false },
            {
              text: 'His avoidance of social situations and compulsive checking behaviors',
              isCorrect: true
            },
            { text: 'His wife\'s pregnancy', isCorrect: false }
          ],
          correctAnswer: 2,
          explanation: 'While the predisposing factors (a, b) provide important context for understanding vulnerability, they cannot be changed through treatment and are not maintaining current symptoms. The precipitating factor of wife\'s pregnancy (d) is a life circumstance, not a treatment target. The perpetuating factors—avoidance, compulsive checking, reassurance-seeking—are behaviors that Marcus engages in daily that maintain his anxiety by preventing corrective learning. These are the direct targets for CBT intervention. Understanding his history helps build rapport and inform conceptualization, but treatment focuses on present-maintaining factors.',
          order: 11
        },
        {
          type: 'cardSort',
          instructions: 'Sorting the CBT Toolkit — Sort each clinical move into the part of the CBT model it primarily targets. Some will feel like they could belong in two places — decide based on the mechanism the technique is designed to change.',
          categories: ['Cognitive intervention', 'Behavioral intervention', 'Structural / process element'],
          cards: [
            {
              id: 'cr439-m3-c1',
              text: 'Identifying an automatic thought using a thought record and rating belief strength before and after',
              correctCategory: 'Cognitive intervention'
            },
            {
              id: 'cr439-m3-c2',
              text: 'Examining evidence for and against a catastrophic prediction',
              correctCategory: 'Cognitive intervention'
            },
            {
              id: 'cr439-m3-c3',
              text: 'Labeling a cognitive distortion such as catastrophizing, mind-reading, or all-or-nothing thinking',
              correctCategory: 'Cognitive intervention'
            },
            {
              id: 'cr439-m3-c4',
              text: 'Downward-arrow questioning to reach a core belief',
              correctCategory: 'Cognitive intervention'
            },
            {
              id: 'cr439-m3-c5',
              text: 'Designing a behavioral experiment that could falsify the client\'s prediction',
              correctCategory: 'Behavioral intervention'
            },
            {
              id: 'cr439-m3-c6',
              text: 'Scheduling a graded activity and recording predicted versus actual mood',
              correctCategory: 'Behavioral intervention'
            },
            {
              id: 'cr439-m3-c7',
              text: 'Dropping a safety behavior during a feared social situation',
              correctCategory: 'Behavioral intervention'
            },
            {
              id: 'cr439-m3-c8',
              text: 'Collaboratively setting the session agenda in the first five minutes',
              correctCategory: 'Structural / process element'
            },
            {
              id: 'cr439-m3-c9',
              text: 'Reviewing last week\'s homework before introducing new material',
              correctCategory: 'Structural / process element'
            },
            {
              id: 'cr439-m3-c10',
              text: 'Eliciting a capsule summary from the client at the end of session',
              correctCategory: 'Structural / process element'
            }
          ],
          order: 12
        },
        {
          type: 'text',
          content: `<h2>Cognitive Restructuring Techniques</h2>
<p>Cognitive restructuring refers to the systematic process of identifying, evaluating, and modifying maladaptive thoughts. The goal is not to replace negative thoughts with positive ones but to develop more accurate, balanced, and helpful thinking patterns. This process respects clients' intelligence and autonomy—rather than telling clients what to think, cognitive restructuring guides them to evaluate their own thoughts critically and reach their own conclusions. Cognitive restructuring proceeds through several steps.</p>
<p>Identifying automatic thoughts requires learning to catch the fleeting thoughts that arise in response to situations and that influence emotional reactions. Because automatic thoughts are often rapid, habitual, and occur outside awareness, clients need training to notice them. They are called "automatic" precisely because they arise without deliberate effort, like a reflex. Techniques for catching automatic thoughts include asking "What went through your mind just then?" when clients report emotional shifts, using thought records to capture thoughts associated with distressing situations, noting "hot cognitions"—thoughts that carry particular emotional charge, and imagery techniques where clients vividly recall distressing situations to access the thoughts that accompanied them.</p>
<p>Common automatic thoughts in anxiety include predictions of catastrophe ("Something terrible will happen"), overestimations of probability ("I'll definitely fail"), and underestimations of coping ("I can't handle this"). Common automatic thoughts in depression include self-critical judgments ("I'm worthless"), hopeless predictions ("Nothing will ever improve"), and negative interpretations of neutral events ("They didn't call back because they don't like me").</p>
<p>Evaluating thoughts involves examining the evidence for and against automatic thoughts, considering alternative interpretations, and assessing the usefulness of thought patterns. Socratic questioning guides this evaluation without telling clients what to think. The Socratic approach assumes clients have the capacity to reason effectively when guided to examine their thinking—it is not about the therapist having the "right" answers. Key questions include: "What evidence supports this thought? What evidence contradicts it? Is there an alternative explanation? What's the most realistic outcome? How likely is this outcome, really? Is this thought helping me or hurting me? What would I tell a friend in this situation? If a friend thought this, what would I say to them?"</p>
<p>Examining the evidence involves systematically listing support for and against the automatic thought. Often, clients find that the evidence against is stronger than they realized, and the evidence for is weaker or based on assumptions rather than facts. For example, a client who thinks "Everyone at the party will judge me negatively" might list evidence for (once someone seemed dismissive at a party five years ago) and evidence against (many parties have gone fine, friends report enjoying his company, he's never received clear negative feedback from party attendees). This examination reveals that the thought is based more on fear than on evidence.</p>
<p>The thought record (or dysfunctional thought record) provides a structured format for cognitive restructuring. In its full form, the thought record includes columns for the situation, automatic thoughts (with belief ratings), emotions (with intensity ratings), evidence supporting the thought, evidence against the thought, alternative/balanced thought, and outcome (re-rated emotions and beliefs). Initially, therapists guide clients through thought records in session; with practice, clients complete them independently as homework. The written format helps make the cognitive process explicit and concrete, and provides a record that can be reviewed.</p>
<p>Developing balanced alternative thoughts is the culmination of cognitive restructuring. Alternative thoughts should not be unrealistically positive but rather should be accurate, balanced, and helpful. An alternative thought acknowledges the kernel of truth in the original thought while correcting its distortions. For example, "I might make a small mistake in my presentation, but that's normal and doesn't mean I'm incompetent or that I'll be fired. I've made mistakes before and recovered." The alternative thought is not denial but a more complete, accurate picture.</p>
<p>Cognitive restructuring is not arguing with clients or dismissing their concerns. Effective restructuring involves genuine, collaborative inquiry that takes clients' thoughts seriously while examining them carefully. Validation precedes restructuring—the therapist communicates understanding of why the thought makes sense given the client's history and current experience, before guiding examination. When clients conclude through their own examination that a thought is distorted, change is more likely and more durable than when they feel told they are "wrong."</p>`,
          order: 13
        },
        {
          type: 'text',
          content: `<h2>Skill Builder: Cognitive Restructuring Practice</h2>
<p>Practice identifying cognitive distortions and developing alternative thoughts for the following automatic thoughts:</p>
<p><strong>Automatic Thought 1:</strong> "I made a small mistake in my presentation. Everyone thinks I'm incompetent and I'll probably get fired."</p>
<p><strong>Cognitive distortion(s):</strong> _______________________ <strong>Evidence against:</strong> _______________________ <strong>Alternative thought:</strong> _______________________</p>
<p><strong>Automatic Thought 2:</strong> "I feel anxious, so something bad must be about to happen."</p>
<p><strong>Cognitive distortion(s):</strong> _______________________ <strong>Evidence against:</strong> _______________________ <strong>Alternative thought:</strong> _______________________</p>
<p><strong>Automatic Thought 3:</strong> "If I can't do this perfectly, there's no point in trying at all."</p>
<p><strong>Cognitive distortion(s):</strong> _______________________ <strong>Evidence against:</strong> _______________________ <strong>Alternative thought:</strong> _______________________</p>
<h3>Skill Builder Answer Key</h3>
<p><strong>Thought 1:</strong> Distortions: Catastrophizing, mind-reading, overgeneralization. Evidence against: Small mistakes are normal; no evidence others noticed or judged harshly; many past mistakes haven't led to firing. Alternative: "I made a small mistake, which is normal and human. I don't actually know what others thought, and one mistake doesn't define my competence or job security."</p>
<p><strong>Thought 2:</strong> Distortions: Emotional reasoning. Evidence against: Anxiety is a feeling, not evidence of actual danger; many times I've felt anxious and nothing bad happened. Alternative: "I'm feeling anxious, but feelings aren't facts. Anxiety often occurs without any real danger, and my track record shows anxious feelings are usually false alarms."</p>
<p><strong>Thought 3:</strong> Distortions: All-or-nothing thinking. Evidence against: Partial efforts often produce partial benefits; learning involves imperfection; many valuable things are accomplished imperfectly. Alternative: "Perfection isn't required for something to be worthwhile. Doing something imperfectly is usually better than not doing it at all, and I can improve with practice."</p>`,
          order: 14
        },
        {
          type: 'text',
          content: `<h2>Behavioral Experiments</h2>
<p>Behavioral experiments test the validity of beliefs through direct experience. Where cognitive restructuring examines evidence verbally, behavioral experiments generate new evidence through action. Behavioral experiments are particularly powerful because experiential learning often produces more compelling and lasting belief change than verbal discussion alone.</p>
<p>Designing effective behavioral experiments involves identifying a specific prediction to test, designing an experiment that will genuinely test the prediction, specifying what data will be collected and how, and determining in advance what results would confirm versus disconfirm the prediction. The experiment should be set up so that both possible outcomes yield useful information—either the prediction is disconfirmed, providing evidence against the maladaptive belief, or it is confirmed, providing information to discuss and understand.</p>
<p>For anxiety disorders, behavioral experiments often test predictions about feared outcomes. A client with social anxiety who believes "If I speak up in meetings, people will think I'm stupid" might experiment by offering one comment in a meeting and then collecting data on actual reactions. A client with panic disorder who believes "If my heart races, I'll have a heart attack" might deliberately increase heart rate through exercise while monitoring for catastrophic outcomes.</p>
<p>For depression, behavioral experiments often test predictions about capacity for pleasure or accomplishment. A depressed client who believes "I can't enjoy anything anymore" might schedule an activity they previously enjoyed and rate their actual enjoyment compared to their prediction. A client who believes "I can't accomplish anything" might attempt a small task and evaluate the outcome.</p>`,
          order: 15
        },
        {
          type: 'text',
          content: `<h2>Reflection Exercise: Your Own Cognitive Patterns</h2>
<p>CBT therapists benefit from awareness of their own cognitive patterns. Reflect on:</p>
<ol><li><strong>What are your most common cognitive distortions?</strong> (All-or-nothing thinking about your clinical work? Mind-reading about what clients think of you? Catastrophizing about clients' outcomes?)</li></ol>
<ol><li><strong>How might your own cognitive patterns affect your delivery of CBT?</strong> (Might you overidentify with certain client thoughts? Might you have blind spots for distortions you share?)</li></ol>
<ol><li><strong>Have you ever practiced cognitive restructuring on your own thoughts?</strong> Consider completing a thought record on a recent distressing situation.</li></ol>
<blockquote><p>Personal application of CBT techniques deepens understanding and enhances ability to teach them authentically.</p></blockquote>`,
          order: 16
        },
        {
          type: 'text',
          content: `<h2>Adapting CBT for Anxiety versus Depression</h2>
<p>While CBT principles apply across disorders, their application differs for anxiety versus depression, reflecting the distinct maintaining mechanisms of each.</p>
<p>For anxiety disorders, the central intervention is exposure—systematic approach to feared stimuli that allows anxiety to diminish through habituation and inhibitory learning. Cognitive restructuring plays a supporting role, helping clients examine threat appraisals and predictions that maintain avoidance. Behavioral experiments in anxiety treatment often involve exposure-based tests of feared predictions. The therapist's stance encourages approach rather than avoidance and challenges safety behaviors that prevent learning.</p>
<p>For depression, behavioral activation—increasing engagement in valued activities—often precedes or accompanies cognitive work, based on the understanding that behavior change can shift mood and provide evidence for cognitive change. Cognitive restructuring targets the depressive cognitive triad and specific distortions maintaining negative views. Activity scheduling and mastery/pleasure ratings build evidence against beliefs about inability to accomplish or enjoy anything. The therapist's stance encourages action despite low motivation and challenges withdrawal patterns.</p>
<p>The treatment of comorbid anxiety and depression, which is extremely common, requires integration of approaches. Often, treatment begins by addressing whichever condition is more severe or more limiting of engagement in treatment. Behavioral activation may be needed before anxious clients can engage in exposure, while anxious avoidance may prevent depressed clients from accessing positive reinforcement. Careful conceptualization guides sequencing and integration.</p>`,
          order: 17
        },
        {
          type: 'multipleChoice',
          question: 'The therapeutic stance in CBT is characterized by:',
          options: [
            { text: 'Expert pronouncement of correct thoughts', isCorrect: false },
            { text: 'Collaborative empiricism and Socratic questioning', isCorrect: true },
            { text: 'Primarily supportive listening without direction', isCorrect: false },
            { text: 'Analysis of unconscious motivations', isCorrect: false }
          ],
          correctAnswer: 1,
          explanation: 'CBT involves therapist and client working together to investigate beliefs empirically, using Socratic questioning to guide client discovery rather than telling clients what to think.',
          order: 18
        },
        {
          type: 'multipleChoice',
          question: 'In CBT case conceptualization, which factors are the direct targets for intervention?',
          options: [
            { text: 'Predisposing factors', isCorrect: false },
            { text: 'Precipitating factors', isCorrect: false },
            { text: 'Perpetuating factors', isCorrect: true },
            { text: 'Protective factors', isCorrect: false }
          ],
          correctAnswer: 2,
          explanation: 'Perpetuating factors—the cognitive, behavioral, and environmental patterns maintaining symptoms in the present—are the direct targets for CBT intervention because they can be modified through treatment.',
          order: 19
        },
        {
          type: 'multipleChoice',
          question: 'Behavioral experiments in CBT are designed to:',
          options: [
            { text: 'Avoid situations that trigger distress', isCorrect: false },
            { text: 'Analyze childhood origins of current problems', isCorrect: false },
            { text: 'Develop positive affirmations', isCorrect: false },
            { text: 'Test the validity of beliefs through direct experience', isCorrect: true }
          ],
          correctAnswer: 3,
          explanation: 'Behavioral experiments generate new evidence through action, testing predictions and providing experiential learning that is often more compelling than verbal discussion alone.',
          order: 20
        },
        {
          type: 'keyTakeaway',
          title: 'Module 3 — What to Carry Into the Room',
          takeaways: [
            'CBT is defined by its structure: collaborative agenda-setting, in-session skill practice, between-session homework, and explicit review of the previous week\'s assignment.',
            'A usable case conceptualization organizes predisposing, precipitating, perpetuating, and protective factors into a working hypothesis the client can recognize as their own.',
            'Cognitive restructuring is an evidence-testing process, not a positive-thinking exercise; the target is accuracy and usefulness, not optimism.',
            'Behavioral experiments generally produce more durable belief change than verbal disputation because they generate new experiential evidence rather than new arguments.',
            'For anxiety, weight the treatment toward exposure and behavioral experiments; for depression, weight it toward activation first and restructuring second, because depressed clients often lack the cognitive resources for restructuring early in treatment.'
          ],
          order: 21
        },
        {
          type: 'multipleChoice',
          question: 'The primary intervention for anxiety disorders in CBT is:',
          options: [
            { text: 'Exposure to feared stimuli', isCorrect: true },
            { text: 'Medication management', isCorrect: false },
            { text: 'Exploration of childhood trauma', isCorrect: false },
            { text: 'Relaxation training alone', isCorrect: false }
          ],
          correctAnswer: 0,
          explanation: 'Exposure—systematic approach to feared stimuli—is the central intervention for anxiety disorders, allowing anxiety to diminish through habituation and corrective learning.',
          order: 22
        },
        {
          type: 'multipleChoice',
          question: 'In CBT for depression, behavioral activation is prioritized because:',
          options: [
            { text: 'Cognitive interventions don\'t work for depression', isCorrect: false },
            {
              text: 'Behavior change can shift mood and provide evidence for cognitive change',
              isCorrect: true
            },
            { text: 'Depressed clients cannot engage in cognitive work', isCorrect: false },
            { text: 'Activity is more important than thoughts', isCorrect: false }
          ],
          correctAnswer: 1,
          explanation: 'Behavioral activation increases opportunities for positive reinforcement and mastery experiences, shifting mood and providing concrete evidence against depressive beliefs about inability to enjoy or accomplish.',
          order: 23
        },
        {
          type: 'reflection',
          question: 'Identify one automatic thought of your own that arises reliably in clinical work — for example, "if this client does not improve, I am not good at this," or "if I set a limit, they will leave." Apply the evidence-testing process to it as you would with a client. What did you notice about how it feels to do this from the inside, and what does that tell you about what you are asking of your clients?',
          order: 24
        }
      ]
    },
    {
      title: 'Module 4: Behavioral Activation and Exposure-Based Interventions',
      order: 5,
      description: 'Behavioral activation and exposure are the two most powerful behavioral engines in outpatient practice, and both work by disconfirming a prediction.',
      contentBlocks: [
        {
          type: 'sectionDivider',
          sectionNumber: '4',
          title: 'Module 4: Behavioral Activation and Exposure-Based Interventions',
          subtitle: 'Behavioral activation and exposure are the two most powerful behavioral engines in outpatient practice, and both work by disconfirming a prediction.',
          order: 1
        },
        {
          type: 'text',
          content: `<h2>Introduction</h2>
<p>Behavioral interventions represent some of the most powerful and efficient tools in the clinician's repertoire for treating anxiety and depression. Behavioral Activation (BA) for depression and exposure-based treatments for anxiety disorders have demonstrated efficacy comparable to full cognitive-behavioral therapy packages, suggesting that behavioral change may be sufficient for many clients even without extensive cognitive restructuring. This module provides practical guidance for implementing these evidence-based behavioral interventions.</p>
<p>The rationale for prioritizing behavioral interventions is straightforward: behavior is directly observable and modifiable, behavior change creates opportunities for new learning, and behavioral successes provide concrete evidence for cognitive change. For depressed clients who report "I can't do anything," completing a small task demonstrates that the belief is inaccurate more powerfully than verbal restructuring. For anxious clients who believe "I can't handle this," approaching feared stimuli and surviving provides experiential evidence of coping capacity.</p>`,
          order: 2
        },
        {
          type: 'callout',
          calloutType: 'protocol',
          title: 'Exposure Is Not Habituation Anymore',
          content: `<p>The inhibitory learning model has replaced habituation as the mechanistic account of exposure therapy. Under the old model, the clinician stayed in the exposure until anxiety dropped by half and treated within-session fear reduction as the marker of success. Under the inhibitory learning model, the target is <em>expectancy violation</em>: the client makes a specific, falsifiable prediction, the exposure tests it, and the mismatch between prediction and outcome is what creates new learning. Anxiety may remain high throughout and the exposure can still be highly successful. Design each exposure around the question "What does the client predict will happen, and how will we find out?"</p>`,
          order: 3
        },
        {
          type: 'text',
          content: `<h2>Behavioral Activation for Depression</h2>
<p>Behavioral Activation (BA) is a structured treatment for depression that focuses on increasing engagement in adaptive activities, particularly those that are positively reinforcing or aligned with personal values. BA emerged from component analyses of CBT suggesting that the behavioral components alone produced effects comparable to the full CBT package, leading researchers to distill BA into a standalone treatment. Contemporary BA protocols, including Behavioral Activation Treatment for Depression (BATD) and the BA component of Martell and colleagues' approach, provide structured frameworks for implementation that have demonstrated efficacy in numerous clinical trials.</p>
<p>The theoretical foundation of BA is the behavioral model of depression: reduced positive reinforcement leads to reduced behavior, which further reduces reinforcement opportunities in a downward spiral. This cycle often begins with a trigger—a loss, stressor, or life change—that reduces access to rewarding activities or experiences. The person withdraws from activities, losing sources of positive reinforcement. As positive reinforcement decreases, mood worsens, motivation drops further, and behavior decreases more, creating a self-perpetuating cycle that maintains and deepens depression.</p>
<p>Importantly, BA does not wait for motivation to return before encouraging activity—instead, it operates on the principle that action precedes motivation. Depressed clients often report waiting until they "feel like" doing something before attempting it. But depression specifically impairs motivation, so waiting for motivation is waiting for the impossible. The BA approach reverses the expected sequence: clients act despite not feeling like it, and motivation follows as the benefits of activity become apparent. This principle, sometimes called "outside-in" change, directly counters the "inside-out" expectation that one must feel better before behaving better.</p>
<p>Activity monitoring establishes a baseline of current activity patterns and reveals the relationship between activities and mood. Clients track activities hour-by-hour or block-by-block and rate associated mood, mastery (sense of accomplishment), and pleasure on 0-10 scales. This monitoring often reveals patterns such as low activity overall, imbalance between obligatory and pleasurable activities, absence of previously enjoyed activities, and activities that reliably worsen or improve mood. Monitoring itself is therapeutic for some clients, increasing awareness of activity-mood connections that may have been outside awareness. A client might notice, for example, that social contact reliably improves mood while hours on social media reliably worsen it—an observation that can motivate behavior change.</p>
<p>Activity scheduling involves planning increased activities, particularly those likely to be reinforcing. Scheduling is important because depressed clients' low motivation makes spontaneous activity initiation unlikely—if left to decide in the moment, the depressed person will choose the couch. When activities are scheduled in advance, they are more likely to occur because the decision has already been made. Initial activities should be achievable given current functioning—starting with small, manageable activities rather than overwhelming expectations—and should include both mastery activities (providing sense of accomplishment) and pleasure activities (intrinsically enjoyable). The schedule functions as a behavioral experiment, testing whether activity affects mood as predicted.</p>
<p>Values clarification helps identify activities that are personally meaningful rather than arbitrarily assigned. When clients engage in activities aligned with their values—connection, creativity, accomplishment, health, family, spirituality, etc.—they experience deeper and more sustainable reinforcement than from activities chosen without regard to values. Exploring values also provides motivation for behavior change that transcends feeling-based motivation: "I value being a good parent, so I'll engage in activities that enact that value even when I don't feel like it." Values provide direction and meaning that can sustain behavioral engagement through the difficult early phases when mood has not yet improved.</p>
<p>Problem-solving barriers to activation addresses the real-world obstacles that prevent activity engagement. These might include practical barriers (lack of transportation, childcare responsibilities, physical limitations), skill deficits (not knowing how to meet people, lacking job interview skills), or cognitive barriers (beliefs that activity won't help, fear of failure). BA addresses these barriers through concrete problem-solving, skills training when needed, and cognitive techniques to address interfering beliefs.</p>`,
          order: 4
        },
        {
          type: 'imageText',
          title: 'Habituation Versus Inhibitory Learning: Two Ways to Read the Same Exposure',
          content: `<p>Two clients complete an identical exposure and end the session with identical anxiety ratings. Under the habituation model, the exposure would be judged a partial failure for both — anxiety did not decline within the session. Under the inhibitory learning model, one may have learned a great deal and the other almost nothing, and the difference is entirely in whether a specific prediction was made and violated.</p>
<p>This shift changes what the clinician does at each stage. Instead of asking "How anxious are you now, on a scale of zero to ten?" and waiting for the number to halve, the clinician asks "What did you predict would happen? What actually happened? How confident are you now that your prediction was accurate?" Anxiety ratings still have a place as a marker of engagement — a client rating zero anxiety is probably not in contact with the feared stimulus — but they are no longer the outcome. The outcome is the size of the gap between expectation and experience, and the durability of the learning is increased by varying context, spacing repetitions, and removing safety behaviors that would explain away the disconfirmation.</p>`,
          image: '',
          imageAlt: 'A side-by-side comparison chart. The left panel, labeled Habituation Model, shows an anxiety curve declining within a single exposure session with success marked at the point where anxiety halves. The right panel, labeled Inhibitory Learning Model, shows a flat anxiety curve alongside a separate bar comparing predicted probability of catastrophe against observed outcome, with success marked by the gap between prediction and outcome.',
          imagePosition: 'left',
          order: 5
        },
        {
          type: 'text',
          content: `<h2>Clinical Vignette: Activating Jasmine</h2>
<blockquote><p>Jasmine (our depressed marketing coordinator) completed activity monitoring last week. Her record shows: sleeping 10-12 hours daily, watching TV 4-5 hours daily, minimal work engagement (calling in sick 3 days), no exercise, no social contact, eating fast food alone. Her average mood rating was 2/10. She notes, "See, I told you I'm not doing anything. I'm pathetic."</p></blockquote>`,
          order: 6
        },
        {
          type: 'text',
          content: `<h3>Designing a First Exposure: Prediction, Test, Debrief</h3>
<p>A clinician and client plan and conduct an initial interoceptive exposure for panic disorder. The segment shows the full arc: rationale, elicitation of a falsifiable prediction, identification and removal of safety behaviors, the exposure itself, and the debrief that converts the experience into learning. Watch particularly for the client's attempt to introduce a subtle safety behavior mid-exposure and how the clinician handles it without shaming.</p>`,
          order: 7
        },
        {
          type: 'videoEmbed',
          videoTitle: 'Designing a First Exposure: Prediction, Test, Debrief',
          videoUrl: 'https://www.youtube.com/embed/PLACEHOLDER_cr439_exposure_design',
          markers: [
            {
              time: '00:00',
              label: 'Delivering the rationale',
              prompt: 'How is the rationale phrased so that the client can restate it in their own words?'
            },
            {
              time: '04:30',
              label: 'Eliciting the prediction',
              prompt: 'What makes this prediction falsifiable rather than vague?'
            },
            {
              time: '09:15',
              label: 'A safety behavior appears',
              prompt: 'Consider how you would name a subtle safety behavior without implying the client is doing therapy wrong.'
            },
            {
              time: '14:00',
              label: 'The debrief',
              prompt: 'Note the specific questions used to compare prediction against outcome.'
            }
          ],
          order: 8
        },
        {
          type: 'multipleChoice',
          question: 'Clinical Vignette: Activating Jasmine — What is your BEST next step in behavioral activation?',
          options: [
            {
              text: 'Point out that her self-criticism ("I\'m pathetic") is a cognitive distortion requiring restructuring',
              isCorrect: false
            },
            {
              text: 'Assign a full schedule of activities to get her reactivated as quickly as possible',
              isCorrect: false
            },
            {
              text: 'Validate that the monitoring reveals reduced activity, then collaboratively identify one small, achievable activity to add',
              isCorrect: true
            },
            {
              text: 'Explore the childhood origins of her tendency to withdraw when stressed',
              isCorrect: false
            }
          ],
          correctAnswer: 2,
          explanation: 'While (a) addresses her cognitive distortion, the behavioral activation approach prioritizes action over cognitive work at this stage—mood improvements from activity will provide evidence against the "pathetic" belief. Option (b) risks overwhelming an already depleted client with an unrealistic schedule that sets up failure. Option (d) shifts away from the present-focused, action-oriented BA approach. The best approach validates her observation (reduced activity is indeed occurring), reframes it non-judgmentally as part of depression rather than a character flaw, and collaboratively identifies one achievable activity to begin reversing the pattern. Start small for early success.',
          order: 9
        },
        {
          type: 'text',
          content: `<h2>Skill Builder: Behavioral Activation Planning</h2>
<p>Design a behavioral activation plan for Jasmine, starting small and building gradually.</p>
<p><strong>Week 1 goal (very achievable):</strong> Activity: _______________________ When: _______________________ Predicted mood before (0-10): _______ Actual mood after (0-10): _______</p>
<p><strong>Week 2 additions:</strong> Mastery activity: _______________________ Pleasure activity: _______________________</p>
<p><strong>Values to connect activities to:</strong> _______________________</p>
<p><strong>Barriers to anticipate and problem-solve:</strong> _______________________</p>
<h3>Skill Builder Sample Plan</h3>
<p><strong>Week 1:</strong> 15-minute walk outside, 3x this week, any time. Predicted mood: 2. (Compare to actual after completing.)</p>
<p><strong>Week 2:</strong> Mastery—respond to 3 work emails from home. Pleasure—watch one episode of favorite show without phone (mindful engagement).</p>
<p><strong>Values:</strong> Health, competence at work, self-care.</p>
<p><strong>Barriers:</strong> "I won't feel like it" → Schedule specifically and commit regardless of motivation. "It won't help" → Frame as experiment to test this prediction. "It's raining" → Plan indoor alternative.</p>`,
          order: 10
        },
        {
          type: 'sequencing',
          instructions: 'Building an Exposure That Actually Teaches Something — Arrange the steps of a mechanism-matched exposure in the order you would carry them out with a client. The order matters: skipping the prediction step is the single most common reason an exposure produces distress without learning.',
          explanation: 'Exposure produces change through expectancy violation. Rationale and consent come first because a client who does not understand why they are approaching what they fear will withdraw at the first spike of anxiety. The specific, falsifiable prediction must be elicited before the exposure, because a prediction reconstructed afterward is contaminated by the outcome. Safety behaviors are identified and removed next, since they are precisely what prevents disconfirmation. The exposure is then conducted long enough for the prediction to be tested — not until anxiety halves. Debriefing compares prediction to outcome explicitly, and the learning is consolidated through varied, self-directed repetition between sessions.',
          steps: [
            {
              id: 'cr439-m4-s1',
              text: 'Provide the treatment rationale in the client\'s own terms and obtain informed consent for the exposure work.',
              order: 1
            },
            {
              id: 'cr439-m4-s2',
              text: 'Collaboratively identify the feared outcome and elicit a specific, falsifiable prediction with an estimated probability.',
              order: 2
            },
            {
              id: 'cr439-m4-s3',
              text: 'Identify safety behaviors — overt and subtle — and agree on which will be dropped during the exposure.',
              order: 3
            },
            {
              id: 'cr439-m4-s4',
              text: 'Conduct the exposure, staying in contact with the feared stimulus long enough for the prediction to be genuinely tested.',
              order: 4
            },
            {
              id: 'cr439-m4-s5',
              text: 'Debrief by comparing what the client predicted with what actually happened, and record the discrepancy.',
              order: 5
            },
            {
              id: 'cr439-m4-s6',
              text: 'Assign varied self-directed repetition across different contexts, times, and intensities to deepen and generalize the learning.',
              order: 6
            }
          ],
          order: 11
        },
        {
          type: 'text',
          content: `<h2>Exposure-Based Treatments for Anxiety</h2>
<p>Exposure therapy involves systematic confrontation with feared stimuli in order to reduce fear responses. Exposure is the most potent intervention for anxiety disorders, with effect sizes among the largest in the psychotherapy literature. Despite its effectiveness, exposure is underutilized in clinical practice, with surveys suggesting that many clinicians avoid exposure due to concerns about client distress or dropout. These concerns, while understandable, are not supported by evidence—exposure therapy is well-tolerated, and dropout rates are comparable to other treatments.</p>
<p>The traditional explanation for exposure effectiveness was habituation—repeated exposure leads to gradual diminution of the fear response. While habituation occurs and is clinically useful, contemporary understanding emphasizes inhibitory learning as the primary mechanism. Rather than erasing original fear associations, exposure creates new inhibitory associations that compete with the fear memory. The client who feared dogs doesn't forget their fear but learns new safety associations that inhibit fear when activated.</p>
<p>This inhibitory learning model has implications for optimizing exposure. Rather than aiming solely for within-session fear reduction (habituation), effective exposure should maximize learning by violating expectations (the feared outcome doesn't occur), varying exposure contexts (to enhance generalization), removing safety behaviors (which prevent full learning), and consolidating learning through sleep and retrieval practice.</p>
<p>Exposure hierarchy development is typically the first step in exposure treatment. Client and therapist collaboratively identify feared stimuli and situations, then rank them from least to most distressing using Subjective Units of Distress (SUDs) ratings (0-100 scale). The hierarchy provides a roadmap for treatment, allowing graduated approach that builds self-efficacy while avoiding overwhelming the client. However, rigid adherence to hierarchical progression is not required—when possible, tackling moderately high items early in treatment can accelerate progress.</p>`,
          order: 12
        },
        {
          type: 'text',
          content: `<h2>Exposure Techniques by Anxiety Disorder</h2>
<p>For specific phobias, in vivo exposure (direct confrontation with the feared object or situation) is the treatment of choice. Single-session treatments of 2-3 hours have demonstrated effectiveness for many specific phobias. Exposure proceeds from lower to higher hierarchy items, with prolonged contact at each level until fear diminishes. For situations that cannot be directly accessed, virtual reality exposure provides an alternative.</p>
<p>For social anxiety disorder, exposure involves entering feared social situations while eliminating safety behaviors. Key targets include shifting attention externally (rather than self-focused), dropping subtle avoidance behaviors (rehearsing, avoiding eye contact, speaking quietly), and deliberately making "mistakes" to test catastrophic predictions. Behavioral experiments testing specific predictions ("If I say something stupid, everyone will reject me") integrate exposure with cognitive restructuring.</p>
<p>For panic disorder, interoceptive exposure—deliberately inducing feared bodily sensations—targets the core fear of physical symptoms. Exercises such as hyperventilation (induces dizziness, derealization), spinning (dizziness), breathing through a straw (shortness of breath), or running in place (racing heart) produce feared sensations in a controlled context, allowing clients to learn that the sensations are unpleasant but not dangerous. In vivo exposure addresses agoraphobic avoidance of situations where panic might occur.</p>
<p>For generalized anxiety disorder, exposure takes a somewhat different form because the feared stimulus is internal (worry content) rather than external. Exposure may involve imaginal exposure to worst-case scenarios, with clients vividly imagining feared outcomes and remaining with the image until distress diminishes. Behavioral experiments test predictions embedded in worry content. Worry exposure scripts, written and repeatedly read aloud, provide structured imaginal exposure to worry themes.</p>`,
          order: 13
        },
        {
          type: 'text',
          content: `<h3>Myth vs. Fact: Exposure Therapy Edition</h3>
<p>Open each myth to see what the evidence actually shows.</p>`,
          order: 14
        },
        {
          type: 'accordion',
          accordionItems: [
            {
              title: 'Myth: Exposure therapy is cruel—it traumatizes clients by forcing them to confront their fears.',
              content: `<p><strong>Fact:</strong> Exposure is carefully graduated, collaborative, and client-directed. Clients are never forced; they are supported in approaching what they choose to approach. Exposure is actually quite safe and well-tolerated, with dropout rates similar to other therapies.</p>`
            },
            {
              title: 'Myth: Clients must experience extreme distress for exposure to work.',
              content: `<p><strong>Fact:</strong> While some anxiety activation is necessary for learning, overwhelming distress can impair learning. Moderate anxiety that the client can tolerate produces optimal learning. Exposure should be challenging but manageable.</p>`
            },
            {
              title: 'Myth: If anxiety doesn\'t decrease during an exposure session, it didn\'t work.',
              content: `<p><strong>Fact:</strong> Within-session habituation is not required for exposure to be effective. What matters is violating expectations and building inhibitory learning. Clients who remain anxious during exposure but see that feared outcomes don't occur still benefit.</p>`
            }
          ],
          order: 15
        },
        {
          type: 'text',
          content: `<h2>Reflection Exercise: Your Relationship with Exposure</h2>
<p>Many clinicians avoid conducting exposure due to their own discomfort. Reflect honestly:</p>
<ol><li><strong>How comfortable are you watching clients experience anxiety?</strong> Does client distress activate your own anxiety or urge to rescue?</li></ol>
<ol><li><strong>Do you tend to end exposures prematurely</strong> when clients become distressed, potentially reinforcing avoidance?</li></ol>
<ol><li><strong>Have you ever avoided recommending exposure</strong> to a client who needed it? What were your reasons?</li></ol>
<ol><li><strong>What would help you conduct exposure more effectively?</strong> (Training, consultation, practicing on your own fears?)</li></ol>
<blockquote><p>Clinician avoidance of exposure is itself an avoidance behavior that can be addressed through... exposure! Consider seeking training or consultation if you notice yourself avoiding this effective treatment.</p></blockquote>`,
          order: 16
        },
        {
          type: 'multipleChoice',
          question: 'Behavioral activation operates on the principle that:',
          options: [
            { text: 'Motivation must return before behavior can change', isCorrect: false },
            { text: 'Analyzing the causes of inactivity is the key to activation', isCorrect: false },
            {
              text: 'Action precedes motivation—behavior change leads to mood improvement',
              isCorrect: true
            },
            { text: 'Only pleasurable activities should be scheduled', isCorrect: false }
          ],
          correctAnswer: 2,
          explanation: 'BA does not wait for motivation; clients act despite low motivation, and motivation/mood improvement follows as activity increases contact with positive reinforcement.',
          order: 17
        },
        {
          type: 'multipleChoice',
          question: 'According to the inhibitory learning model, exposure works primarily by:',
          options: [
            { text: 'Erasing the original fear memory', isCorrect: false },
            { text: 'Teaching clients to suppress fear', isCorrect: false },
            { text: 'Providing relaxation to counteract anxiety', isCorrect: false },
            {
              text: 'Creating new safety associations that compete with and inhibit fear',
              isCorrect: true
            }
          ],
          correctAnswer: 3,
          explanation: 'Inhibitory learning proposes that exposure doesn\'t erase fear but creates new inhibitory associations that compete with the fear memory. This has implications for optimizing exposure to enhance learning.',
          order: 18
        },
        {
          type: 'multipleChoice',
          question: 'Interoceptive exposure, used in treatment of panic disorder, involves:',
          options: [
            { text: 'Deliberately inducing feared bodily sensations', isCorrect: true },
            { text: 'Imagining feared social situations', isCorrect: false },
            { text: 'Gradual approach to specific phobic objects', isCorrect: false },
            { text: 'Confronting trauma memories', isCorrect: false }
          ],
          correctAnswer: 0,
          explanation: 'Interoceptive exposure targets the core fear in panic disorder—fear of physical sensations—by deliberately producing sensations like dizziness, racing heart, and shortness of breath through exercises like hyperventilation or running in place.',
          order: 19
        },
        {
          type: 'keyTakeaway',
          title: 'Module 4 — What to Carry Into the Room',
          takeaways: [
            'Behavioral activation is a standalone evidence-based treatment for depression with outcomes comparable to full CBT and to antidepressant medication in severe depression.',
            'Activity scheduling works when it is specific, values-linked, and graded — activities are chosen for mastery and pleasure, scheduled at a defined time, and rated for predicted versus actual mood.',
            'Motivation follows action rather than preceding it; the client commits to the scheduled activity regardless of how they feel at the time, and this reversal is the core therapeutic message.',
            'Exposure is designed around expectancy violation: a specific prediction, a test that could disconfirm it, and removal of the safety behaviors that would otherwise prevent learning.',
            'Vary the context, duration, and intensity of exposures and combine feared stimuli where clinically appropriate — deepened and variable exposure produces more durable, less context-bound learning.'
          ],
          order: 20
        },
        {
          type: 'multipleChoice',
          question: 'An effective exposure hierarchy should:',
          options: [
            { text: 'Include only the most feared items to maximize efficiency', isCorrect: false },
            {
              text: 'Range from moderately to highly distressing items, allowing graduated approach',
              isCorrect: true
            },
            { text: 'Be rigidly followed from bottom to top without deviation', isCorrect: false },
            { text: 'Focus only on situations that can be easily avoided', isCorrect: false }
          ],
          correctAnswer: 1,
          explanation: 'Hierarchies rank feared situations from least to most distressing using SUDs ratings, providing a roadmap for graduated exposure that builds self-efficacy while challenging avoidance.',
          order: 21
        },
        {
          type: 'multipleChoice',
          question: 'Safety behaviors during exposure should generally be:',
          options: [
            { text: 'Encouraged as coping strategies', isCorrect: false },
            { text: 'Maintained throughout treatment', isCorrect: false },
            { text: 'Eliminated because they prevent full corrective learning', isCorrect: true },
            { text: 'Added to help clients tolerate distress', isCorrect: false }
          ],
          correctAnswer: 2,
          explanation: 'Safety behaviors prevent full exposure and allow clients to attribute survival to the safety behavior rather than learning that the situation was actually safe. Eliminating safety behaviors is essential for maximal learning.',
          order: 22
        },
        {
          type: 'reflection',
          question: 'Exposure asks clients to do the thing they most want to avoid, and it asks clinicians to tolerate watching a client be distressed without rescuing them. Where do you sit with that? Recall a moment when you softened an exposure, allowed a safety behavior to stay, or changed the subject when a client became anxious. What were you protecting — the client, or your own discomfort?',
          order: 23
        }
      ]
    },
    {
      title: 'Module 5: Third-Wave Approaches',
      order: 6,
      description: 'When change strategies stall, acceptance strategies open a second door — but only when the clinician knows why they are opening it.',
      contentBlocks: [
        {
          type: 'sectionDivider',
          sectionNumber: '5',
          title: 'Module 5: Third-Wave Approaches',
          subtitle: 'When change strategies stall, acceptance strategies open a second door — but only when the clinician knows why they are opening it.',
          order: 1
        },
        {
          type: 'text',
          content: `<h2>Introduction</h2>
<p>Third-wave cognitive-behavioral therapies represent an evolution in the CBT tradition that emphasizes mindfulness, acceptance, values, and the function of cognitions rather than their content. While traditional CBT targets the content of thoughts—evaluating whether thoughts are accurate and replacing distorted thoughts with balanced ones—third-wave approaches often focus on changing the relationship to thoughts, reducing their behavioral influence regardless of content. These approaches have accumulated substantial empirical support and offer valuable alternatives or adjuncts to traditional CBT for anxiety and depression.</p>
<p>The major third-wave approaches include Acceptance and Commitment Therapy (ACT), Dialectical Behavior Therapy (DBT), and Mindfulness-Based Cognitive Therapy (MBCT). Each has distinct theoretical emphases and clinical applications, though they share common themes including mindfulness practice, acceptance of difficult experiences, and focus on values-guided behavioral change. This module provides an overview of each approach and guidance on when third-wave interventions may be indicated.</p>`,
          order: 2
        },
        {
          type: 'callout',
          calloutType: 'key',
          title: 'Third-Wave Is a Complement, Not a Replacement',
          content: `<p>Acceptance and Commitment Therapy, DBT skills, and Mindfulness-Based Cognitive Therapy are not upgrades that make traditional CBT obsolete. Head-to-head trials generally show comparable outcomes for depression and anxiety. What third-wave approaches add is a different response to a specific clinical impasse: the client who can dispute a thought perfectly and still feels terrible, the client for whom cognitive challenging has become another form of experiential avoidance, and the client with recurrent depression whose relapses are driven by ruminative reactivity to ordinary sad mood. Choose the approach that fits the mechanism you are seeing, not the one that feels most current.</p>`,
          order: 3
        },
        {
          type: 'text',
          content: `<h2>Acceptance and Commitment Therapy (ACT)</h2>
<p>Acceptance and Commitment Therapy, developed by Steven Hayes and colleagues, is grounded in Relational Frame Theory, a behavioral account of language and cognition. ACT represents a significant philosophical shift from traditional CBT, though both share behavioral roots and empirical commitments. ACT proposes that psychological suffering often results from two interrelated processes: experiential avoidance—attempts to avoid or control unwanted internal experiences (thoughts, feelings, sensations, memories)—and cognitive fusion—treating thoughts as literal truths that must be obeyed rather than as mental events that can be observed.</p>
<p>Experiential avoidance is deeply human and widely encouraged by culture ("don't think about it," "stay positive," "control your emotions"), yet it is ultimately futile and often counterproductive. Attempts to suppress thoughts increase their frequency (the "white bear effect"). Avoiding anxiety-provoking situations maintains anxiety. Numbing painful emotions through alcohol or distraction provides temporary relief but long-term harm. The more people struggle against unwanted internal experiences, the more these experiences dominate their lives, narrowing behavioral repertoires and disconnecting individuals from what they value.</p>
<p>Cognitive fusion occurs when thoughts are experienced as literal reality rather than as mental events. When fused with a thought, individuals respond to the thought as if it were what it says. A person fused with "I'm a failure" experiences themselves as actually being a failure, not as a person having a thought about failure. Fusion gives thoughts power to control behavior—if I believe "I can't handle it," I won't try. ACT does not dispute whether thoughts are true or false (unlike traditional CBT) but rather helps clients reduce fusion so thoughts have less behavioral impact regardless of content.</p>
<p>The ACT model identifies six core processes organized in the "hexaflex"—a visual representation showing how the processes interrelate. Acceptance involves willingness to experience thoughts and feelings without attempting to change or avoid them. Acceptance is active, not passive—it is choosing to allow internal experiences to be as they are while pursuing valued action, not resignation to suffering. Cognitive defusion involves reducing the literal hold of thoughts, seeing thoughts as thoughts rather than reality. Defusion techniques (described below) help clients observe thoughts without being controlled by them. Present-moment awareness involves flexible attention to here-and-now experience rather than being caught in the past (rumination) or future (worry). Self-as-context involves accessing a transcendent sense of self—the "I" that observes experience—that is not defined by any particular thought, feeling, or experience. This observer self provides a stable perspective from which to witness internal events without being overwhelmed. Values involves clarifying what matters most deeply—the directions in life that are intrinsically meaningful. Unlike goals (which can be achieved), values are ongoing qualities of action that guide behavior. Committed action involves taking concrete steps toward valued living, even in the presence of difficult thoughts and feelings.</p>
<p>Rather than reducing symptoms directly, ACT aims to increase psychological flexibility—the ability to contact the present moment fully, as a conscious human being, and to change or persist in behavior in service of chosen values. Psychological flexibility allows adaptive response to changing circumstances rather than rigid, rule-governed behavior that may not serve the person's interests. Paradoxically, symptom reduction often follows from this flexibility, as people stop feeding symptoms through avoidance and struggle—but symptom reduction is not the primary goal. A client with anxiety might learn to experience anxiety fully while still taking valued action, rather than waiting for anxiety to remit before living fully.</p>
<p>ACT techniques are diverse and often experiential. Mindfulness exercises develop present-moment awareness and the observer perspective. Cognitive defusion techniques are often playful and aim to change the function of thoughts rather than their content. Examples include repeating a thought until it loses meaning (try saying "milk" rapidly for 30 seconds and notice how the word becomes just a sound), thanking the mind for its thoughts ("Thanks, mind, for that helpful observation"), singing thoughts to a silly tune, or saying thoughts in cartoon character voices. These techniques are not dismissive of serious concerns but create distance between the person and their thoughts, reducing fusion. Values clarification exercises help clients identify what truly matters through imagining their funeral eulogy, identifying heroes and what they admire, or exploring moments of deep fulfillment. Committed action planning translates values into specific behavioral goals, with attention to barriers and how to persist despite them. The therapist models and encourages willingness to experience discomfort in service of valued goals, often through self-disclosure and experiential exercises conducted in session.</p>`,
          order: 4
        },
        {
          type: 'text',
          content: `<h2>Dialectical Behavior Therapy Skills</h2>
<p>Dialectical Behavior Therapy, developed by Marsha Linehan originally for borderline personality disorder, includes skills training modules that have been adapted for depression and anxiety. The four skills modules—mindfulness, distress tolerance, emotion regulation, and interpersonal effectiveness—address deficits common in emotional disorders.</p>
<p>Mindfulness skills form the foundation of DBT and include "what" skills (observing, describing, participating) and "how" skills (non-judgmentally, one-mindfully, effectively). These skills support present-moment awareness and non-reactive observation of experience, reducing reactivity to emotional triggers.</p>
<p>Distress tolerance skills address crisis survival without making situations worse. Skills include distraction techniques (ACCEPTS: Activities, Contributing, Comparisons, Emotions, Pushing away, Thoughts, Sensations), self-soothing using the five senses, IMPROVE the moment (Imagery, Meaning, Prayer, Relaxation, One thing at a time, Vacation, Encouragement), and radical acceptance of reality as it is.</p>
<p>Emotion regulation skills focus on understanding, reducing vulnerability to, and changing unwanted emotions. The ABC PLEASE skills address accumulating positive experiences, building mastery, coping ahead, and taking care of physical health (treating PhysicaL illness, balanced Eating, avoiding mood-Altering substances, balanced Sleep, and Exercise). Opposite action—acting opposite to emotional urges when emotions don't fit the facts—directly changes emotional experience.</p>
<p>Interpersonal effectiveness skills address assertiveness, maintaining relationships, and maintaining self-respect. DEAR MAN (Describe, Express, Assert, Reinforce, stay Mindful, Appear confident, Negotiate) structures assertive requests, while GIVE (be Gentle, act Interested, Validate, use Easy manner) and FAST (be Fair, no Apologies, Stick to values, be Truthful) support relationship and self-respect goals.</p>`,
          order: 5
        },
        {
          type: 'scenarioTree',
          scenarioTitle: 'When Restructuring Stops Working: A Third-Wave Decision Point',
          startNode: 'start',
          nodes: {
            start: {
              text: 'Devon, 41, has completed fourteen sessions of well-delivered CBT for generalized anxiety. He fills out thought records meticulously, identifies his distortions accurately, and can generate balanced alternative thoughts without prompting. His GAD-7 has moved from 18 to 15 and has been flat for six weeks. In session he says: "I know the thought isn\'t true. I can prove it isn\'t true. I just still feel exactly the same, and now I feel like I\'m failing at therapy too." What do you do next?',
              choices: [
                {
                  text: 'Intensify the cognitive work — assign more thought records and add a daily distortion log.',
                  next: 'intensify'
                },
                {
                  text: 'Shift the target from changing the content of the thoughts to changing his relationship with them, introducing defusion and acceptance.',
                  next: 'shift'
                },
                {
                  text: 'Conclude CBT has failed and refer him out for medication management.',
                  next: 'refer'
                }
              ]
            },
            intensify: {
              text: 'You double the cognitive homework. Devon completes all of it and returns more discouraged. His GAD-7 rises to 17. He mentions that he now spends about an hour each evening "arguing with his own head," and that the arguing itself has become another thing he cannot stop. This is a recognizable impasse: cognitive restructuring has been absorbed into the anxiety as a new form of control effort and experiential avoidance. More of the same intervention deepens the trap rather than escaping it.',
              choices: [
                {
                  text: 'Reconsider — change the mechanism you are targeting rather than the dose.',
                  next: 'shift'
                }
              ]
            },
            shift: {
              text: 'You name the pattern out loud: the problem is no longer that Devon believes the thoughts, but that he is at war with them, and the war is exhausting. You introduce cognitive defusion — noticing "I\'m having the thought that…" rather than disputing the content — and begin exploring what he would be doing with his evenings if the arguing were not required. Over six sessions his GAD-7 drops to 9 and, more tellingly, he resumes coaching his daughter\'s soccer team. The relevant clinical judgment was not that ACT is superior to CBT, but that the maintaining mechanism had changed and the intervention needed to change with it.',
              choices: []
            },
            refer: {
              text: 'You refer Devon for a medication evaluation, which is a reasonable adjunct but not a substitute for addressing the impasse. He returns in eight weeks on an SSRI with modestly improved sleep and an unchanged GAD-7, and the same complaint: he knows the thoughts are untrue and still feels the same. The therapeutic question is still open. Referral for medication does not resolve a psychotherapy process problem — it postpones it.',
              choices: [
                {
                  text: 'Return to the therapy question: what mechanism is actually maintaining the anxiety now?',
                  next: 'shift'
                }
              ]
            }
          },
          order: 6
        },
        {
          type: 'text',
          content: `<h2>Mindfulness-Based Cognitive Therapy (MBCT)</h2>
<p>Mindfulness-Based Cognitive Therapy, developed by Zindel Segal, Mark Williams, and John Teasdale, integrates mindfulness practices from Mindfulness-Based Stress Reduction (MBSR) with cognitive therapy for depression. MBCT was specifically developed to prevent depressive relapse in individuals with recurrent depression and has demonstrated efficacy comparable to maintenance antidepressant medication for this purpose.</p>
<p>MBCT addresses the cognitive vulnerability to depression relapse: even after recovery, previously depressed individuals show reactivation of negative thinking patterns when they experience mild dysphoria. This reactivation can trigger rumination and escalation into full depressive episode. MBCT teaches mindfulness skills that allow individuals to recognize negative thought patterns early and to respond with detached awareness rather than habitual ruminative engagement.</p>
<p>The eight-week MBCT program includes formal mindfulness practices (body scan, sitting meditation, mindful movement), informal mindfulness in daily activities, and cognitive elements addressing automatic pilot functioning and the relationship between thoughts and feelings. Participants learn to approach their experience with curiosity rather than judgment, to recognize thoughts as mental events rather than facts, and to disengage from ruminative patterns that fuel depression.</p>
<p>MBCT is most strongly indicated for individuals with three or more prior depressive episodes, for whom relapse rates are substantially higher than for those with fewer episodes. For this population, MBCT reduces relapse risk by approximately 40-50% compared to usual care. Growing evidence supports MBCT for current depression as well, though it may be less effective than BA or CBT for acute treatment.</p>`,
          order: 7
        },
        {
          type: 'text',
          content: `<h3>Myth vs. Fact: Third-Wave Therapies Edition</h3>
<p>Open each myth to see what the evidence actually shows.</p>`,
          order: 8
        },
        {
          type: 'accordion',
          accordionItems: [
            {
              title: 'Myth: Third-wave therapies are completely different from traditional CBT.',
              content: `<p><strong>Fact:</strong> Third-wave therapies evolved from CBT and share its emphasis on behavior change and empirical evaluation. They extend rather than replace traditional CBT, adding emphasis on mindfulness, acceptance, and values.</p>`
            },
            {
              title: 'Myth: Acceptance means giving up on change or resigning oneself to suffering.',
              content: `<p><strong>Fact:</strong> In ACT, acceptance means willingness to experience internal states (thoughts, feelings) as they are, not passive resignation to unchangeable circumstances. Acceptance creates space for effective action toward valued goals.</p>`
            },
            {
              title: 'Myth: Third-wave approaches are only for treatment-resistant cases.',
              content: `<p><strong>Fact:</strong> Third-wave approaches are first-line treatments for some presentations and populations. MBCT is specifically indicated for relapse prevention in recurrent depression; ACT is a viable first-line option for anxiety and depression.</p>`
            }
          ],
          order: 9
        },
        {
          type: 'text',
          content: `<h2>When to Consider Third-Wave Approaches</h2>
<p>Third-wave approaches may be particularly indicated in several clinical contexts. For clients who have not responded to traditional CBT, third-wave approaches offer a different angle that may produce results where direct cognitive restructuring did not. Some clients find it difficult to identify or challenge thoughts in the way traditional CBT requires; for these clients, acceptance and defusion may be more accessible.</p>
<p>When rumination is a prominent maintaining factor, MBCT or ACT's defusion techniques may be particularly helpful. Traditional cognitive restructuring can inadvertently reinforce rumination by engaging repeatedly with thought content; acceptance-based approaches teach disengagement from the ruminative process.</p>
<p>For clients who struggle with chronic, treatment-resistant conditions or who face genuinely difficult circumstances that cannot be changed, acceptance-based approaches offer a path to quality of life that does not depend on symptom elimination or circumstance change. The focus on values and committed action supports meaning and engagement even amid ongoing difficulties.</p>
<p>For relapse prevention following successful acute treatment, MBCT is specifically indicated for individuals with recurrent depression. The skills learned in MBCT provide ongoing protection against depressive relapse.</p>
<p>Integration of third-wave elements with traditional CBT is common and often clinically sensible. A course of treatment might begin with behavioral activation, incorporate mindfulness to address rumination, use cognitive restructuring for specific distortions, and conclude with values clarification and committed action planning for maintenance.</p>`,
          order: 10
        },
        {
          type: 'multipleChoice',
          question: 'According to ACT, psychological suffering often results from:',
          options: [
            { text: 'Insufficient positive thinking', isCorrect: false },
            { text: 'Lack of insight into childhood origins', isCorrect: false },
            { text: 'Chemical imbalance requiring medication', isCorrect: false },
            { text: 'Experiential avoidance and cognitive fusion', isCorrect: true }
          ],
          correctAnswer: 3,
          explanation: 'ACT proposes that suffering results from attempts to avoid unwanted internal experiences (experiential avoidance) and from treating thoughts as literal truths that must be obeyed (cognitive fusion).',
          order: 11
        },
        {
          type: 'multipleChoice',
          question: 'The primary goal of ACT is to:',
          options: [
            { text: 'Increase psychological flexibility and values-guided action', isCorrect: true },
            { text: 'Eliminate negative thoughts and feelings', isCorrect: false },
            { text: 'Develop insight into unconscious conflicts', isCorrect: false },
            { text: 'Achieve complete relaxation', isCorrect: false }
          ],
          correctAnswer: 0,
          explanation: 'ACT aims to increase psychological flexibility—the ability to be present and to act in service of values regardless of internal experience—rather than directly targeting symptom reduction.',
          order: 12
        },
        {
          type: 'multipleChoice',
          question: 'MBCT was specifically developed for:',
          options: [
            { text: 'Treatment of acute first-episode depression', isCorrect: false },
            { text: 'Prevention of depressive relapse in recurrent depression', isCorrect: true },
            { text: 'Treatment of anxiety disorders', isCorrect: false },
            { text: 'Treatment of borderline personality disorder', isCorrect: false }
          ],
          correctAnswer: 1,
          explanation: 'MBCT was developed specifically to prevent depressive relapse, particularly in individuals with three or more prior episodes who are at highest risk for recurrence.',
          order: 13
        },
        {
          type: 'keyTakeaway',
          title: 'Module 5 — What to Carry Into the Room',
          takeaways: [
            'ACT targets psychological flexibility through six processes — acceptance, defusion, present-moment contact, self-as-context, values, and committed action — rather than symptom reduction directly.',
            'DBT skills modules (mindfulness, distress tolerance, emotion regulation, interpersonal effectiveness) are widely transportable to anxiety and depression even outside a full DBT program.',
            'MBCT has the strongest indication in recurrent depression, where it reduces relapse risk substantially in clients with three or more prior episodes.',
            'Consider a third-wave approach when cognitive restructuring has become avoidance, when the client\'s suffering is tied to unworkable control efforts, or when relapse prevention is the primary goal.',
            'Third-wave approaches require clinician experiential familiarity; teaching mindfulness competently is difficult without a personal practice.'
          ],
          order: 14
        },
        {
          type: 'multipleChoice',
          question: 'DBT\'s "opposite action" skill involves:',
          options: [
            { text: 'Thinking the opposite of your automatic thoughts', isCorrect: false },
            { text: 'Avoiding any situation that triggers emotion', isCorrect: false },
            {
              text: 'Acting opposite to emotional urges when emotions don\'t fit the facts',
              isCorrect: true
            },
            { text: 'Suppressing all emotional expression', isCorrect: false }
          ],
          correctAnswer: 2,
          explanation: 'Opposite action involves behaving counter to what the emotion urges when that emotion isn\'t justified by the facts—for example, approaching rather than avoiding when fear isn\'t warranted.',
          order: 15
        },
        {
          type: 'multipleChoice',
          question: 'Third-wave approaches are MOST appropriate when:',
          options: [
            { text: 'Traditional CBT is contraindicated for medical reasons', isCorrect: false },
            { text: 'Clients refuse all psychological intervention', isCorrect: false },
            { text: 'Only medication management is appropriate', isCorrect: false },
            {
              text: 'Clients have difficulty with thought identification or when rumination is prominent',
              isCorrect: true
            }
          ],
          correctAnswer: 3,
          explanation: 'Third-wave approaches offer alternatives for clients who struggle with traditional cognitive restructuring and particularly address rumination through disengagement from thought content rather than repeated engagement.',
          order: 16
        },
        {
          type: 'reflection',
          question: 'Third-wave approaches ask clinicians to model a stance toward their own internal experience, not just to teach a technique. Take an honest inventory: when a difficult feeling arises in your own life, is your default to change it, argue with it, or make room for it? What would need to be true for you to teach acceptance credibly to a client who is watching you closely for signs that you actually believe it?',
          order: 17
        }
      ]
    },
    {
      title: 'Module 6: Treatment Planning, Measurement-Based Care, and Relapse Prevention',
      order: 7,
      description: 'Measurement-based care turns clinical intuition into clinical evidence, and relapse prevention turns remission into recovery.',
      contentBlocks: [
        {
          type: 'sectionDivider',
          sectionNumber: '6',
          title: 'Module 6: Treatment Planning, Measurement-Based Care, and Relapse Prevention',
          subtitle: 'Measurement-based care turns clinical intuition into clinical evidence, and relapse prevention turns remission into recovery.',
          order: 1
        },
        {
          type: 'text',
          content: `<h2>Introduction</h2>
<p>Effective treatment for anxiety and depression extends beyond mastery of specific techniques to encompass systematic treatment planning, ongoing monitoring, and attention to maintenance of gains. The clinician who delivers evidence-based interventions but fails to monitor outcomes may persist with ineffective treatment; the clinician who successfully treats acute symptoms but neglects relapse prevention may see gains evaporate. This module addresses the broader framework within which specific interventions are deployed: stepped care models that match treatment intensity to need, measurement-based care that uses data to guide decisions, and relapse prevention strategies that protect and extend treatment gains.</p>`,
          order: 2
        },
        {
          type: 'callout',
          calloutType: 'ethics',
          title: 'Measurement Is an Ethical Practice, Not an Administrative One',
          content: `<p>Roughly one in three clients does not improve in psychotherapy, and clinicians without outcome data identify deteriorating clients at rates barely better than chance. Routine outcome monitoring is not a billing formality — it is the mechanism by which a clinician discovers that a client is not benefiting while there is still time to change course. The ACA Code of Ethics obligates counselors to monitor effectiveness and to terminate or refer when a client is not being helped. A PHQ-9 and a GAD-7 at every session, plotted and reviewed with the client, is the least burdensome way to meet that obligation honestly.</p>`,
          order: 3
        },
        {
          type: 'text',
          content: `<h2>Stepped Care and Treatment Selection</h2>
<p>Stepped care models match treatment intensity to patient need, beginning with lower-intensity interventions and stepping up to more intensive treatments for those who don't respond. This approach conserves resources while ensuring that those who need intensive treatment receive it. The collaborative care model, which integrates behavioral health into primary care with measurement-based monitoring and stepped interventions, has demonstrated effectiveness for depression and anxiety in numerous trials.</p>
<p>Treatment selection considers multiple factors: disorder and severity, patient preference, available resources, and clinician expertise. For mild to moderate anxiety and depression, self-help materials, bibliotherapy, or brief interventions may be sufficient. For moderate to severe presentations, full courses of CBT or other evidence-based therapies are indicated. For severe, treatment-resistant, or complex cases, intensive interventions, combination treatment (therapy plus medication), or specialty referral may be needed.</p>
<p>Patient preference significantly influences treatment engagement and outcome. When patients choose their treatment format, adherence and outcomes improve. Shared decision-making—discussing options, providing information about each, and incorporating patient preferences—supports treatment engagement. Some patients strongly prefer medication, others prefer psychotherapy, and this preference should be respected when both are appropriate.</p>`,
          order: 4
        },
        {
          type: 'text',
          content: `<h2>Measurement-Based Care</h2>
<p>Measurement-based care (MBC) involves routine administration of standardized outcome measures and use of this data to guide clinical decisions. Research demonstrates that MBC improves outcomes: clinicians using systematic outcome monitoring achieve better results than those relying on clinical judgment alone. MBC provides early warning of treatment non-response, enables timely treatment adjustment, and facilitates communication about progress.</p>
<p>Implementation involves selecting appropriate measures (PHQ-9 and GAD-7 are efficient choices for depression and anxiety respectively), administering them at every session or at regular intervals, reviewing results, and using data to guide decisions. When scores aren't improving as expected, this signals need for treatment adjustment—modifying the current approach, intensifying treatment, or trying a different approach.</p>
<p>Expected trajectories help interpret progress. For depression, a 50% reduction in PHQ-9 scores by weeks 4-6 of treatment indicates likely response. Failure to achieve this early improvement predicts poor ultimate outcome if treatment is unchanged. For anxiety, improvement often occurs somewhat later, but lack of any improvement by mid-treatment warrants reconsideration.</p>`,
          order: 5
        },
        {
          type: 'text',
          content: `<h2>Clinical Vignette: Jasmine's Progress Check</h2>
<blockquote><p>It's week 6 of treatment with Jasmine. You've been implementing behavioral activation and cognitive restructuring. Her PHQ-9 scores:</p></blockquote>
<ul><li><em>Week 1: 19 (moderately severe)</em></li><li><em>Week 3: 17</em></li><li><em>Week 6: 15</em></li></ul>`,
          order: 6
        },
        {
          type: 'multipleChoice',
          question: 'Clinical Vignette: Jasmine\'s Progress Check — How should you interpret this data and what action is indicated?',
          options: [
            { text: 'Excellent progress—continue current treatment approach', isCorrect: false },
            {
              text: 'Inadequate progress—significant treatment modification is needed',
              isCorrect: true
            },
            { text: 'Discharge her since scores are improving', isCorrect: false },
            { text: 'Scores are meaningless—trust clinical judgment instead', isCorrect: false }
          ],
          correctAnswer: 1,
          explanation: 'After 6 weeks, Jasmine\'s scores have dropped only 4 points (21% reduction) rather than the expected 50% reduction. This trajectory predicts poor outcome if treatment continues unchanged. This doesn\'t mean treatment has failed, but it signals need for adjustment: assess fidelity (is treatment being delivered as intended?), assess engagement (is homework being completed?), consider barriers, evaluate whether the treatment approach matches her specific maintaining factors, consider augmentation or alternative approaches. Option (a) is too optimistic; option (c) is premature when she remains in moderately severe range; option (d) ignores valuable data.',
          order: 7
        },
        {
          type: 'matching',
          matchingInstructions: 'Measurement, Stepped Care, and the Ending of Treatment — Match each term to its operational definition. These are the concepts that turn "the client seems better" into a defensible clinical decision.',
          matchingPairs: [
            {
              term: 'Measurement-based care',
              definition: 'Systematic administration of a brief validated outcome measure at each session, with the results reviewed collaboratively and used to make explicit treatment decisions.'
            },
            {
              term: 'Stepped care',
              definition: 'A service model that begins with the least intensive intervention likely to be effective and escalates intensity based on demonstrated response rather than on assumption.'
            },
            {
              term: 'Reliable change',
              definition: 'A change in score large enough to exceed the measurement error of the instrument, distinguishing genuine improvement from ordinary fluctuation.'
            },
            {
              term: 'Lapse versus relapse',
              definition: 'A lapse is a temporary return of symptoms managed with existing skills; a relapse is a full return of the syndrome. Framing the distinction in advance prevents a lapse from becoming self-fulfilling.'
            },
            {
              term: 'Booster session',
              definition: 'A scheduled or as-needed follow-up contact after termination that reviews the relapse-prevention plan and reinforces skill use, associated with reduced recurrence rates.'
            },
            {
              term: 'Warning signs',
              definition: 'The client\'s own early, individualized indicators of deterioration — often sleep change, social withdrawal, or increased rumination — identified while well and written into the prevention plan.'
            }
          ],
          order: 8
        },
        {
          type: 'text',
          content: `<h2>Relapse Prevention</h2>
<p>Relapse is common following successful treatment of anxiety and depression, with rates of 40-60% for depression within two years of recovery and similarly high rates for anxiety disorders. These sobering statistics underscore that acute symptom reduction, while important, is not sufficient—effective treatment should include explicit attention to relapse prevention, helping clients anticipate and prepare for future challenges. Relapse prevention is not optional but an essential component of comprehensive treatment.</p>
<p>Relapse prevention begins with education about the chronic/recurrent nature of anxiety and depression for many individuals. This is not pessimism but realistic preparation. Clients who expect that difficulties may recur and who have plans for responding are better prepared than those who assume treatment produces permanent cure. Framing potential recurrence as a possibility to prepare for—rather than a failure to avoid—reduces shame if symptoms return and increases likelihood of early intervention. The message is not "you will relapse" but "if symptoms start to return, you'll know what to do."</p>
<p>Understanding the distinction between lapse and relapse helps clients respond effectively to early warning signs. A lapse is a brief return of symptoms that may occur during stress or vulnerability; it is not the same as a full relapse into the disorder. Clients who interpret a lapse as evidence of complete failure ("I'm right back where I started") may give up coping efforts in ways that transform a manageable lapse into a full relapse. Normalizing occasional lapses while providing skills to prevent their escalation is essential.</p>
<p>Identifying warning signs helps clients recognize early indications that symptoms may be returning. These warning signs are often idiosyncratic, reflecting each client's particular pattern. Behavioral warning signs might include reducing activity, withdrawing socially, stopping exercise, neglecting self-care, or returning to avoidance patterns. Cognitive warning signs might include increasing negative thinking, more frequent rumination, return of catastrophic predictions, or resumption of worry patterns. Mood changes might include subtle shifts in baseline mood, increased irritability, or loss of interest in previously enjoyed activities. Clients develop personalized lists of their warning signs based on their history and patterns, often with input from family members or friends who may notice early changes.</p>
<p>Developing a response plan specifies what clients will do if warning signs appear. Having a plan in place before it's needed enables rapid response rather than paralysis or denial when symptoms emerge. The response plan might include re-implementing learned skills—resuming activity scheduling, completing thought records, conducting exposures. It might include reaching out to support persons—calling a friend, partner, or sponsor. It might include scheduling "booster" sessions with the therapist—clients should know that returning for additional sessions is not failure but good self-management. It might include increasing self-care activities—improving sleep hygiene, resuming exercise, reducing alcohol use. The specific plan is individualized based on what worked during acute treatment and what is feasible given the client's life circumstances.</p>
<p>Ongoing practice of skills maintains competency. Just as physical fitness requires ongoing exercise, psychological skills require ongoing practice to remain accessible. A person who learned cognitive restructuring during acute treatment but never practices it afterward may find the skill unavailable when needed months later. Clients may schedule regular "maintenance" cognitive restructuring—perhaps reviewing thought records monthly even when feeling well. Mindfulness practice is particularly suited to ongoing maintenance, as it can be integrated into daily life. Periodic behavioral experiments or occasional exposures keep these skills fresh.</p>
<p>Lifestyle factors that reduce relapse risk include regular physical exercise, which has well-documented antidepressant and anxiolytic effects; maintaining social connections, which provide support and positive reinforcement; healthy sleep habits, as sleep disruption is both a symptom and maintaining factor for anxiety and depression; limiting alcohol and substance use, which can trigger or worsen episodes; and general stress management, including maintaining reasonable workloads and boundaries. Addressing modifiable risk factors as part of treatment increases resilience against future episodes.</p>
<p>For recurrent depression specifically, long-term strategies may include continuation of antidepressant medication beyond symptom remission—guidelines typically recommend continuation for at least 6-12 months, with longer or indefinite continuation for highly recurrent depression. Participation in MBCT, which has specifically demonstrated efficacy for relapse prevention in recurrent depression, is another option. Scheduled periodic "booster" sessions with the therapist, even when symptoms are not present, provide maintenance of skills and early detection of warning signs. The decision about long-term strategies considers severity and frequency of past episodes, patient preference, side effects and burdens of maintenance treatments, and available resources.</p>`,
          order: 9
        },
        {
          type: 'text',
          content: `<h2>Skill Builder: Relapse Prevention Plan Template</h2>
<p>Using the template below, develop a relapse prevention plan as if you were completing this with a client in session:</p>
<p><strong>My Warning Signs (How I'll know if I'm heading toward relapse):</strong></p>
<ol><li>_______________________</li><li>_______________________</li><li>_______________________</li></ol>
<p><strong>My Triggers (Situations that increase my vulnerability):</strong></p>
<ol><li>_______________________</li><li>_______________________</li></ol>
<p><strong>Skills I'll Use When Warning Signs Appear:</strong></p>
<ol><li>_______________________</li><li>_______________________</li></ol>
<p><strong>People I'll Reach Out To:</strong></p>
<ol><li>Name: _____________ Phone: _____________</li><li>Name: _____________ Phone: _____________</li></ol>
<p><strong>When I'll Call My Therapist for a Booster Session:</strong> _______________________</p>
<p><strong>Lifestyle Factors I'll Maintain:</strong> Sleep: _______________________ Exercise: _______________________ Social connection: _______________________</p>`,
          order: 10
        },
        {
          type: 'text',
          content: `<h2>Deciding When to Change Course</h2>
<p>Measurement only helps if it is attached to a decision rule agreed in advance. Without one, a clinician looking at eight sessions of flat PHQ-9 scores can always construct a reason to continue unchanged: the client is engaged, the alliance is strong, the work is deep, change takes time. Each of those statements may be true and none of them is evidence that the treatment is working. The remedy is to set the threshold before you need it.</p>
<p>A defensible rule for outpatient anxiety and depression looks like this. By session four, expect some movement — commonly a twenty to thirty percent reduction from the baseline score. If there has been no reliable change by session six, treat that as a mandate to do something different rather than to do more of the same. "Something different" has a limited menu, and working through it systematically is more useful than agonizing over which option is right. Revisit the formulation first: the most common cause of a stalled treatment is that the mechanism you have been targeting is not the one that is actually maintaining the problem. An unassessed comorbidity — substance use, trauma, an eating disorder, undiagnosed ADHD, an untreated medical condition — is the second most common cause, and it is worth a deliberate re-screen rather than an assumption. Third, examine adherence honestly, including your own: is homework being assigned, reviewed, and adjusted, or has the treatment drifted into unstructured supportive conversation? Fourth, consider intensity — weekly may not be enough for a severely depressed client, and twice-weekly for a defined period is an underused option. Fifth, consider adding or referring for medication evaluation. Sixth, consider that the fit between this client and this clinician may not be the one that will help, and that saying so is a clinical act rather than a failure.</p>
<p>Whatever you choose, say it out loud to the client and document it. "We agreed at the start that we would look at your scores together. They have not moved in six weeks, so I want to change our approach rather than keep going and hope" is a sentence that strengthens rather than damages an alliance. It tells the client that you are paying attention, that their time is valuable, and that treatment is accountable to something outside your impressions and theirs.</p>`,
          order: 11
        },
        {
          type: 'text',
          content: `<h2>Documentation, Termination, and Collaborative Care</h2>
<p>The clinical record for anxiety and depression treatment should make three things visible to any reviewer: the formulation, the intervention that follows from it, and the outcome data that test it. In practice this means a progress note that names the target mechanism, describes what was actually done in session rather than what was discussed in general terms, records the session's outcome scores, and states the between-session assignment. A note reading "processed feelings about work stress, supportive, will continue" documents attendance rather than treatment. A note reading "GAD-7 = 14 (baseline 19); reviewed exposure homework — completed 4 of 5 planned; conducted in-session interoceptive exposure with hyperventilation, prediction of fainting not confirmed; assigned daily practice x5" documents care that can be evaluated, defended, and continued by someone else if it needs to be.</p>
<p>Termination deserves the same deliberateness. Planned endings should be signposted several sessions in advance, with session frequency tapered from weekly to biweekly to monthly so that the client accumulates evidence of managing independently while support is still available. The final sessions review the formulation in the client's own words, consolidate the relapse-prevention plan, and rehearse a specific setback scenario in detail: what the client will notice, what they will do first, whom they will contact, and at what point they will call for a booster session. Explicitly distinguishing a lapse from a relapse in that conversation is protective, because clients who interpret a bad week as evidence that treatment failed are far more likely to abandon the skills that would have contained it.</p>
<p>Finally, most anxiety and depression care happens inside a wider system. Primary care physicians, prescribers, school personnel, and family members frequently hold information that changes the formulation, and coordination has measurable effects on outcome — collaborative care models for depression in primary care consistently outperform usual care. Obtain releases early rather than at the point of crisis, communicate in specific and useful terms when you do, and be clear about what you are asking for. A prescriber who receives "client's PHQ-9 has moved from 21 to 19 over eight sessions of behavioral activation with good adherence; requesting medication evaluation" can act on it. A prescriber who receives "client still struggling" cannot.</p>`,
          order: 12
        },
        {
          type: 'multipleChoice',
          question: 'Measurement-based care improves treatment outcomes primarily by:',
          options: [
            {
              text: 'Enabling early detection of non-response and timely treatment adjustment',
              isCorrect: true
            },
            { text: 'Reducing the need for clinical judgment', isCorrect: false },
            { text: 'Proving to clients that they are improving', isCorrect: false },
            { text: 'Satisfying insurance requirements', isCorrect: false }
          ],
          correctAnswer: 0,
          explanation: 'MBC\'s primary benefit is providing objective data that signals when treatment isn\'t working as expected, enabling clinicians to adjust treatment rather than persisting with ineffective approaches.',
          order: 13
        },
        {
          type: 'multipleChoice',
          question: 'For depression treatment, what PHQ-9 trajectory by weeks 4-6 predicts likely treatment response?',
          options: [
            { text: 'Any improvement, regardless of magnitude', isCorrect: false },
            { text: 'Approximately 50% reduction from baseline', isCorrect: true },
            { text: 'Complete symptom remission (score <5)', isCorrect: false },
            { text: 'Worsening that will eventually reverse', isCorrect: false }
          ],
          correctAnswer: 1,
          explanation: 'Research indicates that approximately 50% reduction in depression symptom severity by weeks 4-6 predicts likely ultimate response. Failure to achieve this early improvement signals need for treatment modification.',
          order: 14
        },
        {
          type: 'multipleChoice',
          question: 'Relapse prevention planning should include all of the following EXCEPT:',
          options: [
            { text: 'Identification of personal warning signs', isCorrect: false },
            {
              text: 'Development of a response plan for when warning signs appear',
              isCorrect: false
            },
            { text: 'Assuming treatment has produced permanent cure', isCorrect: true },
            { text: 'Planning for ongoing skill practice and lifestyle factors', isCorrect: false }
          ],
          correctAnswer: 2,
          explanation: 'Relapse prevention explicitly acknowledges the chronic/recurrent nature of anxiety and depression for many individuals. Assuming permanent cure leaves clients unprepared for potential recurrence.',
          order: 15
        },
        {
          type: 'keyTakeaway',
          title: 'Module 6 — What to Carry Into the Room',
          takeaways: [
            'Stepped care matches treatment intensity to severity and to demonstrated response, escalating when data show inadequate progress rather than when the clinician senses stagnation.',
            'Measurement-based care means administering a brief validated measure at every session, plotting the trajectory, and discussing it openly with the client.',
            'A flat or worsening trajectory across four to six sessions is a signal to change something — the formulation, the intervention, the frequency, or the referral — not to continue unchanged.',
            'Relapse prevention plans should name personal warning signs, high-risk situations, specific coping skills, support contacts, and the threshold for a booster session.',
            'Plan the ending from the beginning: taper session frequency, rehearse setbacks explicitly, and frame a lapse as data rather than failure.'
          ],
          order: 16
        },
        {
          type: 'multipleChoice',
          question: 'Stepped care models for anxiety and depression involve:',
          options: [
            {
              text: 'Starting with the most intensive treatment and stepping down as symptoms improve',
              isCorrect: false
            },
            {
              text: 'Providing only one level of treatment regardless of response',
              isCorrect: false
            },
            {
              text: 'Avoiding evidence-based treatments in favor of generic supportive therapy',
              isCorrect: false
            },
            {
              text: 'Matching treatment intensity to need, beginning with lower-intensity interventions',
              isCorrect: true
            }
          ],
          correctAnswer: 3,
          explanation: 'Stepped care begins with lower-intensity interventions and steps up to more intensive treatments for non-responders, efficiently matching resources to patient need.',
          order: 17
        },
        {
          type: 'multipleChoice',
          question: 'Shared decision-making in treatment selection is important because:',
          options: [
            {
              text: 'Patient preference influences treatment engagement and outcome',
              isCorrect: true
            },
            { text: 'It reduces clinician liability', isCorrect: false },
            { text: 'It allows patients to avoid any discomfort', isCorrect: false },
            { text: 'Clinicians should not offer recommendations', isCorrect: false }
          ],
          correctAnswer: 0,
          explanation: 'When patients participate in choosing their treatment, engagement and outcomes improve. Shared decision-making incorporates patient preferences while providing expert information about options.',
          order: 18
        },
        {
          type: 'reflection',
          question: 'If you began plotting a PHQ-9 or GAD-7 for every client at every session starting next week, what would you be afraid of finding? Name the specific fear. Then consider what you would owe a client whose trajectory has been flat for two months, and what would have to change in your practice for you to see that clearly and act on it in time.',
          order: 19
        }
      ]
    },
    {
      title: 'Course Summary and Review',
      order: 8,
      description: 'Consolidation of the course\'s central arguments, a module-by-module review, an ethical practice plan, downloadable resources, and the full reference list.',
      contentBlocks: [
        {
          type: 'sectionDivider',
          sectionNumber: 'Conclusion',
          title: 'Course Summary and Review',
          subtitle: 'What to keep, what to practice next, and how to hold yourself accountable for the outcomes of the clients you are already seeing.',
          order: 1
        },
        {
          type: 'text',
          content: `<h2>Key Takeaways</h2>
<p>The central claim of this course is that anxiety and depression are highly treatable conditions whose treatment fails most often not from lack of clinician skill or care but from lack of mechanistic precision. Every module has been an argument for the same discipline: identify what is maintaining this client's condition, select the intervention that reverses that specific process, deliver it with fidelity, and measure whether it is working.</p>
<p>For anxiety, the maintaining mechanism is nearly always avoidance in one of its forms — behavioral avoidance of feared situations, cognitive avoidance through worry, interoceptive avoidance of bodily sensation, or subtle safety behaviors that prevent disconfirming evidence from registering. This is why exposure, in its various forms, is the intervention with the strongest evidence base across the anxiety disorders, and why the inhibitory learning framework matters: exposure works by violating a specific expectancy, not by waiting for anxiety to subside. The clinician's job is to help the client make a falsifiable prediction, arrange a test that could disconfirm it, remove the safety behaviors that would explain away the result, and make the discrepancy between prediction and outcome explicit.</p>
<p>For depression, the maintaining mechanism is the withdrawal loop: loss or stress reduces contact with reinforcing activity, reduced reinforcement lowers mood and energy, and lowered mood makes further activity feel pointless. Behavioral activation reverses the loop at the only node the client can act on directly. It works because it changes the input rather than arguing with the output, and because the resulting experiences generate evidence against the negative cognitive triad that no amount of verbal disputation can produce. Cognitive restructuring remains valuable, but with depressed clients it is generally more effective after activation has restored some cognitive capacity than before.</p>
<p>Case conceptualization is what turns these general mechanisms into a specific treatment plan. The four-factor framework — predisposing, precipitating, perpetuating, and protective — is not a documentation exercise. It is the working hypothesis that determines what you do in the next session, and it should be shared with the client in language they recognize as a description of their own life. A conceptualization the client cannot restate is a conceptualization that is not yet doing clinical work.</p>
<p>Third-wave approaches earn their place when the standard mechanisms are not the ones in play. When a client can dispute a thought flawlessly and still suffers, when the disputing has itself become a control strategy, when the presenting problem is unworkable struggle with internal experience rather than inaccurate belief, or when the goal is preventing recurrence in a client with multiple prior depressive episodes — these are the indications for acceptance-based and mindfulness-based work. They are choices about mechanism, not choices about which school of therapy you belong to.</p>
<p>Finally, measurement is what makes all of this honest. Clinician judgment about client progress is demonstrably unreliable, and the clients who deteriorate are the ones we are least likely to identify without data. Administering a PHQ-9 and a GAD-7 at every session, plotting the scores, and reviewing them openly with the client costs about ninety seconds and converts a subjective impression into a shared, actionable record. A flat trajectory over four to six sessions is not a reason for patience; it is a signal to change the formulation, the intervention, the intensity, or the provider. Ending well matters just as much: tapering frequency, rehearsing setbacks in advance, distinguishing a lapse from a relapse, and writing a concrete prevention plan are what convert a good treatment episode into a durable outcome.</p>`,
          order: 2
        },
        {
          type: 'callout',
          calloutType: 'key',
          title: 'When You Return to Practice on Monday',
          content: `<ul>
<li><strong>Put a PHQ-9 and a GAD-7 in front of every client, every session.</strong> Ninety seconds. Plot the scores where the client can see them, and say out loud what the line is doing.</li>
<li><strong>Before your next session with a stalled client, write the mechanism down in one sentence.</strong> If you cannot name it, that is the finding — the assessment is not finished, and more of the same intervention will not fix it.</li>
<li><strong>With any depressed client, schedule one specific activity before you do any cognitive work.</strong> Named activity, named day, named time, predicted mood recorded in advance.</li>
<li><strong>Before your next exposure, ask for the prediction and write it down.</strong> "What do you think will happen, and how likely is that?" Then compare it to what happened, out loud, at the end.</li>
<li><strong>Set your change-course threshold now, in writing.</strong> No reliable improvement by session six means revisit the formulation, re-screen for comorbidity, check adherence including your own, consider intensity, consider medication referral, consider fit.</li>
<li><strong>Ask every client with depression about thoughts of death, out loud, the same way you ask about sleep.</strong> Not only when the screener flags it.</li>
</ul>`,
          order: 3
        },
        {
          type: 'text',
          content: `<h3>Module Highlights</h3>
<p>Open each module to review its central points before the final assessment.</p>`,
          order: 4
        },
        {
          type: 'accordion',
          accordionItems: [
            {
              title: 'Module 1 — Understanding Anxiety Disorders',
              content: `<p>Anxiety is an adaptive threat-detection system that has lost its calibration. Disordered anxiety involves heightened amygdala reactivity with insufficient prefrontal regulation, and it is maintained behaviorally by avoidance that produces immediate relief while preventing corrective learning. GAD is characterized by uncontrollable worry that migrates across domains; panic disorder by catastrophic misinterpretation of benign bodily sensations; social anxiety by fear of negative evaluation sustained by safety behaviors; specific phobia by circumscribed fear with intense avoidance. Comorbidity is the norm, and medical and substance-related contributors must be ruled out before treatment planning.</p>`
            },
            {
              title: 'Module 2 — Understanding Depressive Disorders',
              content: `<p>Major depressive disorder requires depressed mood or anhedonia plus a total of five symptoms over two weeks; persistent depressive disorder describes a chronic two-year course with earlier onset and greater comorbidity. Beck's cognitive model locates the disorder in the negative triad sustained by information-processing biases; behavioral models locate it in the loss of response-contingent positive reinforcement. Neurobiological findings — HPA axis dysregulation, reduced hippocampal volume, altered prefrontal-limbic connectivity — contextualize but do not replace psychosocial formulation. The PHQ-9 supplies both severity scoring and direct suicide screening, and bipolarity must be ruled out before a treatment path is chosen.</p>`
            },
            {
              title: 'Module 3 — Cognitive-Behavioral Therapy',
              content: `<p>CBT is defined by its structure as much as by its content: collaborative agenda-setting, homework review, in-session skill practice, new assignment, and a client-generated summary. Case conceptualization organizes predisposing, precipitating, perpetuating, and protective factors into a hypothesis the client recognizes. Cognitive restructuring is evidence-testing rather than positive thinking, and behavioral experiments generally produce more durable belief change than verbal disputation because they create new experience rather than new argument. With anxiety, weight the work toward exposure and experiments; with depression, activate before restructuring.</p>`
            },
            {
              title: 'Module 4 — Behavioral Activation and Exposure',
              content: `<p>Behavioral activation is a standalone treatment with outcomes comparable to full CBT and to medication in severe depression. It works through specific, values-linked, graded activity scheduling with predicted-versus-actual mood ratings, and it depends on the client acting independently of momentary motivation. Exposure is designed around expectancy violation: a falsifiable prediction, a test, removal of safety behaviors, and an explicit debrief. Vary context, duration, and intensity, and combine feared stimuli where clinically appropriate, to produce learning that generalizes beyond the therapy room.</p>`
            },
            {
              title: 'Module 5 — Third-Wave Approaches',
              content: `<p>ACT targets psychological flexibility through acceptance, defusion, present-moment contact, self-as-context, values, and committed action, treating symptom reduction as a byproduct rather than a target. DBT skills modules transport well to anxiety and depression outside a full DBT program, particularly for clients with emotion-regulation deficits. MBCT has its strongest indication in recurrent depression, where it substantially reduces relapse in clients with three or more prior episodes. Choose a third-wave approach because the mechanism calls for it, not because it is newer.</p>`
            },
            {
              title: 'Module 6 — Treatment Planning, Measurement, and Relapse Prevention',
              content: `<p>Stepped care matches intensity to severity and escalates on the basis of demonstrated response. Measurement-based care means a brief validated measure at every session, plotted and discussed with the client, with a flat or worsening trajectory over four to six sessions treated as a mandate to change something. Relapse prevention plans specify individual warning signs, high-risk situations, coping skills, support contacts, and the threshold for a booster session. Plan the ending from the beginning: taper frequency, rehearse setbacks, and frame a lapse as data rather than failure.</p>`
            }
          ],
          order: 5
        },
        {
          type: 'keyTakeaway',
          title: 'Course-Level Key Takeaways',
          takeaways: [
            'Anxiety and depression are maintained by identifiable self-reinforcing loops; treatment works by entering the loop at the node the client can act on — avoidance for anxiety, behavior for depression.',
            'Differential diagnosis is a treatment decision: worry-as-avoidance, catastrophic misinterpretation of bodily sensation, and fear of negative evaluation each call for a different intervention.',
            'The PHQ-9 and GAD-7 give severity, trajectory, and — through item nine — a direct safety signal; screen every depressed client for a history of hypomania before selecting a treatment path.',
            'A four-factor conceptualization the client can restate in their own words is the difference between a documented formulation and one that is doing clinical work.',
            'Exposure is designed around expectancy violation: a falsifiable prediction, removal of safety behaviors, a genuine test, and an explicit debrief comparing prediction to outcome.',
            'Behavioral activation is a standalone evidence-based treatment; activity is specific, values-linked, graded, scheduled, and undertaken independently of momentary motivation.',
            'Third-wave approaches are indicated by mechanism, not fashion — when disputation has become avoidance, when the struggle is with internal experience rather than inaccurate belief, or when preventing recurrence is the goal.',
            'A flat outcome trajectory across four to six sessions is a mandate to change the formulation, the intervention, the intensity, or the provider — and the threshold should be set before you need it.'
          ],
          order: 6
        },
        {
          type: 'text',
          content: `<h2>Ethical Practice Plan</h2>
<p>Translating this course into practice creates specific ethical obligations, and they are worth naming concretely rather than leaving as good intentions. The first is competence. Reading about exposure therapy or ACT does not confer the ability to deliver either well. If you intend to add exposure work to your practice, obtain supervision or consultation from someone who has delivered it, start with clients whose presentations are uncomplicated, and be honest with clients about your level of experience with the specific protocol. The ACA Code of Ethics locates competence in education, training, and supervised experience together — not in any one of them alone.</p>
<p>The second is monitoring. If you adopt measurement-based care, you take on the obligation to act on what the data show. Collecting PHQ-9 scores and filing them without review is worse than not collecting them, because it creates a record of deterioration that you documented and did not address. Decide in advance what your threshold will be — a common standard is no reliable improvement across four to six sessions — and decide in advance what you will do when it is crossed: revisit the formulation, consult, intensify, refer for medication evaluation, or transfer care.</p>
<p>The third is risk. Depression is the most common diagnostic context for suicide, and every clinician treating depressed clients needs a current, practiced approach to risk assessment, safety planning, and lethal-means counseling, together with documented consultation practices for elevated-risk cases. If the PHQ-9 item on thoughts of death is endorsed, it is assessed the same day, and the assessment is documented.</p>
<p>The fourth is informed consent as an ongoing process. Exposure therapy in particular asks clients to do difficult things deliberately, and consent for that work should be explicit, revisited, and revocable. Clients should understand the rationale well enough to explain it back, should know that distress during exposure is expected rather than a sign of harm, and should know that they can stop. Write your plan for each of these four obligations before your next clinical day, and make it specific enough that someone reviewing your practice could tell whether you had followed it.</p>`,
          order: 7
        },
        {
          type: 'reflection',
          question: 'Return now to the client and the working hypothesis you wrote down before Module 1. Rewrite the hypothesis using the language of maintaining mechanisms: what specifically is keeping this client stuck — avoidance and its subtypes, the withdrawal loop, unworkable control efforts, an unaddressed comorbidity, or something you have not yet assessed? Then name the single intervention that most directly reverses that mechanism, and the first concrete thing you will do differently in your next session with them. Be specific enough that a colleague reading it would know exactly what you intend to do.',
          order: 8
        },
        {
          type: 'resources',
          resources: [
            {
              title: 'PHQ-9 Patient Health Questionnaire (public domain)',
              url: 'https://www.phqscreeners.com/',
              type: 'worksheet',
              description: 'Free, public-domain depression severity measure with scoring instructions and translations. Nine items, one minute to complete, with a direct suicide-risk screening item.'
            },
            {
              title: 'GAD-7 Generalized Anxiety Disorder Scale (public domain)',
              url: 'https://www.phqscreeners.com/',
              type: 'worksheet',
              description: 'Free seven-item anxiety severity measure validated for screening and for session-by-session progress monitoring across the anxiety disorders.'
            },
            {
              title: 'Association for Behavioral and Cognitive Therapies — Clinician Resources',
              url: 'https://www.abct.org/',
              type: 'organization',
              description: 'Fact sheets, treatment-protocol guidance, find-a-therapist directory, and continuing education in evidence-based cognitive and behavioral treatments.'
            },
            {
              title: 'Association for Contextual Behavioral Science — ACT Resources',
              url: 'https://contextualscience.org/',
              type: 'organization',
              description: 'Free ACT worksheets, values-clarification exercises, measures, and practitioner training pathways maintained by the professional home of Acceptance and Commitment Therapy.'
            },
            {
              title: 'NICE Guideline NG222 — Depression in Adults: Treatment and Management',
              url: 'https://www.nice.org.uk/guidance/ng222',
              type: 'guidelines',
              description: 'Current stepped-care treatment algorithms for depression, including recommendations by severity level and guidance on relapse prevention.'
            },
            {
              title: 'Society of Clinical Psychology — Research-Supported Psychological Treatments',
              url: 'https://div12.org/treatments/',
              type: 'research',
              description: 'Division 12 database of psychological treatments by disorder with strength-of-evidence ratings, useful for treatment selection and for documenting the evidence basis of a treatment plan.'
            }
          ],
          order: 9
        },
        {
          type: 'text',
          content: `<div class="cr-references"><h2>References</h2>
<p class="cr-reference">American Psychiatric Association. (2022). <em>Diagnostic and statistical manual of mental disorders</em> (5th ed., text rev.). American Psychiatric Publishing.</p>
<p class="cr-reference">Barlow, D. H. (Ed.). (2021). <em>Clinical handbook of psychological disorders: A step-by-step treatment manual</em> (6th ed.). Guilford Press.</p>
<p class="cr-reference">Beck, A. T. (1979). <em>Cognitive therapy of depression</em>. Guilford Press.</p>
<p class="cr-reference">Beck, A. T., & Haigh, E. A. P. (2014). Advances in cognitive theory and therapy: The generic cognitive model. <em>Annual Review of Clinical Psychology</em>, 10, 1-24.</p>
<p class="cr-reference">Beck, J. S. (2021). <em>Cognitive behavior therapy: Basics and beyond</em> (3rd ed.). Guilford Press.</p>
<p class="cr-reference">Craske, M. G., Treanor, M., Conway, C. C., Zbozinek, T., & Vervliet, B. (2014). Maximizing exposure therapy: An inhibitory learning approach. <em>Behaviour Research and Therapy</em>, 58, 10-23.</p>
<p class="cr-reference">Cuijpers, P., Quero, S., Noma, H., Ciharova, M., Miguel, C., Karyotaki, E., Cipriani, A., Cristea, I. A., & Furukawa, T. A. (2021). Psychotherapies for depression: A network meta-analysis covering efficacy, acceptability and long-term outcomes of all main treatment types. <em>World Psychiatry</em>, 20(2), 283-293.</p>
<p class="cr-reference">Dimidjian, S., Barrera, M., Jr., Martell, C., Muñoz, R. F., & Lewinsohn, P. M. (2011). The origins and current status of behavioral activation treatments for depression. <em>Annual Review of Clinical Psychology</em>, 7, 1-38.</p>
<p class="cr-reference">Hayes, S. C., Strosahl, K. D., & Wilson, K. G. (2012). <em>Acceptance and commitment therapy: The process and practice of mindful change</em> (2nd ed.). Guilford Press.</p>
<p class="cr-reference">Hofmann, S. G., Asnaani, A., Vonk, I. J., Sawyer, A. T., & Fang, A. (2012). The efficacy of cognitive behavioral therapy: A review of meta-analyses. <em>Cognitive Therapy and Research</em>, 36(5), 427-440.</p>
<p class="cr-reference">Kessler, R. C., Petukhova, M., Sampson, N. A., Zaslavsky, A. M., & Wittchen, H. U. (2012). Twelve-month and lifetime prevalence and lifetime morbid risk of anxiety and mood disorders in the United States. <em>International Journal of Methods in Psychiatric Research</em>, 21(3), 169-184.</p>
<p class="cr-reference">Kroenke, K., Spitzer, R. L., & Williams, J. B. (2001). The PHQ-9: Validity of a brief depression severity measure. <em>Journal of General Internal Medicine</em>, 16(9), 606-613.</p>
<p class="cr-reference">Linehan, M. M. (2015). <em>DBT skills training manual</em> (2nd ed.). Guilford Press.</p>
<p class="cr-reference">Martell, C. R., Dimidjian, S., & Herman-Dunn, R. (2022). <em>Behavioral activation for depression: A clinician's guide</em> (2nd ed.). Guilford Press.</p>
<p class="cr-reference">Segal, Z. V., Williams, J. M. G., & Teasdale, J. D. (2018). <em>Mindfulness-based cognitive therapy for depression</em> (2nd ed.). Guilford Press.</p>
<p class="cr-reference">Spitzer, R. L., Kroenke, K., Williams, J. B., & Löwe, B. (2006). A brief measure for assessing generalized anxiety disorder: The GAD-7. <em>Archives of Internal Medicine</em>, 166(10), 1092-1097.</p>
</div>`,
          order: 10
        }
      ]
    }
  ],
  assessment: {
    passingScore: 80,
    passThreshold: 0.8,
    attemptsAllowed: 3,
    shuffleQuestions: true,
    shuffleOptions: true,
    questions: [
      {
        type: 'multipleChoice',
        question: 'According to the cognitive model of anxiety, anxiety disorders result from:',
        options: [
          {
            text: 'Overestimation of threat and underestimation of coping ability',
            isCorrect: true
          },
          { text: 'Insufficient worry about real threats', isCorrect: false },
          { text: 'Underactive amygdala function', isCorrect: false },
          { text: 'Excessive positive thinking', isCorrect: false }
        ],
        correctAnswer: 0,
        explanation: 'Core cognitive model principle.',
        sectionIndex: 1
      },
      {
        type: 'multipleChoice',
        question: 'The primary maintaining factor for most anxiety disorders is:',
        options: [
          { text: 'Medication non-compliance', isCorrect: false },
          { text: 'Avoidance of feared stimuli', isCorrect: true },
          { text: 'Childhood trauma', isCorrect: false },
          { text: 'Insufficient social support', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'Prevents extinction learning and maintains fear.',
        sectionIndex: 1
      },
      {
        type: 'multipleChoice',
        question: 'Beck\'s cognitive triad in depression consists of negative views of:',
        options: [
          { text: 'Past, present, and future', isCorrect: false },
          { text: 'Body, mind, and spirit', isCorrect: false },
          { text: 'Self, world, and future', isCorrect: true },
          { text: 'Family, work, and relationships', isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: 'Beck\'s cognitive triad.',
        sectionIndex: 1
      },
      {
        type: 'multipleChoice',
        question: 'Behavioral activation operates on the principle that:',
        options: [
          { text: 'Motivation must return before behavior can change', isCorrect: false },
          { text: 'Rest is needed before activity', isCorrect: false },
          { text: 'Cognitive change must precede behavioral change', isCorrect: false },
          { text: 'Action precedes motivation', isCorrect: true }
        ],
        correctAnswer: 3,
        explanation: 'Core behavioral activation principle.',
        sectionIndex: 2
      },
      {
        type: 'multipleChoice',
        question: 'Which PHQ-9 total score indicates severe depression?',
        options: [
          { text: '20 or higher', isCorrect: true },
          { text: '5-9', isCorrect: false },
          { text: '10-14', isCorrect: false },
          { text: '15-19', isCorrect: false }
        ],
        correctAnswer: 0,
        explanation: 'PHQ-9 severity cutoffs.',
        sectionIndex: 2
      },
      {
        type: 'multipleChoice',
        question: 'In CBT, Socratic questioning is used to:',
        options: [
          { text: 'Tell clients what to think', isCorrect: false },
          { text: 'Guide client discovery through strategic questioning', isCorrect: true },
          { text: 'Analyze unconscious motivations', isCorrect: false },
          { text: 'Induce relaxation', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'Socratic method.',
        sectionIndex: 2
      },
      {
        type: 'multipleChoice',
        question: 'Behavioral experiments in CBT are designed to:',
        options: [
          { text: 'Avoid anxiety-provoking situations', isCorrect: false },
          { text: 'Analyze childhood experiences', isCorrect: false },
          { text: 'Test the validity of beliefs through direct experience', isCorrect: true },
          { text: 'Replace negative thoughts with positive ones', isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: 'Behavioral experiment purpose.',
        sectionIndex: 3
      },
      {
        type: 'multipleChoice',
        question: 'According to the inhibitory learning model, exposure works primarily by:',
        options: [
          { text: 'Erasing the original fear memory', isCorrect: false },
          { text: 'Teaching suppression of fear', isCorrect: false },
          { text: 'Inducing relaxation', isCorrect: false },
          { text: 'Creating new inhibitory associations that compete with fear', isCorrect: true }
        ],
        correctAnswer: 3,
        explanation: 'Inhibitory learning model.',
        sectionIndex: 3
      },
      {
        type: 'multipleChoice',
        question: 'Interoceptive exposure for panic disorder involves:',
        options: [
          { text: 'Deliberately inducing feared bodily sensations', isCorrect: true },
          { text: 'Gradual approach to phobic objects', isCorrect: false },
          { text: 'Imagining worst-case scenarios', isCorrect: false },
          { text: 'Avoiding all triggers', isCorrect: false }
        ],
        correctAnswer: 0,
        explanation: 'Interoceptive exposure definition.',
        sectionIndex: 3
      },
      {
        type: 'multipleChoice',
        question: 'The primary goal of ACT is to increase:',
        options: [
          { text: 'Positive thinking', isCorrect: false },
          { text: 'Psychological flexibility and values-guided action', isCorrect: true },
          { text: 'Insight into childhood origins', isCorrect: false },
          { text: 'Relaxation skills', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'ACT\'s primary goal.',
        sectionIndex: 4
      },
      {
        type: 'multipleChoice',
        question: 'MBCT was specifically developed for:',
        options: [
          { text: 'Treating acute first-episode depression', isCorrect: false },
          { text: 'Treating anxiety disorders', isCorrect: false },
          { text: 'Preventing relapse in recurrent depression', isCorrect: true },
          { text: 'Treating personality disorders', isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: 'MBCT\'s specific indication.',
        sectionIndex: 4
      },
      {
        type: 'multipleChoice',
        question: 'Measurement-based care improves outcomes primarily by:',
        options: [
          { text: 'Satisfying documentation requirements', isCorrect: false },
          { text: 'Proving treatment efficacy to clients', isCorrect: false },
          { text: 'Reducing session length', isCorrect: false },
          {
            text: 'Enabling early detection of non-response and treatment adjustment',
            isCorrect: true
          }
        ],
        correctAnswer: 3,
        explanation: 'MBC benefit.',
        sectionIndex: 4
      },
      {
        type: 'multipleChoice',
        question: 'Expected treatment response for depression by weeks 4-6 is:',
        options: [
          { text: 'Approximately 50% symptom reduction', isCorrect: true },
          { text: 'Any improvement', isCorrect: false },
          { text: 'Complete remission', isCorrect: false },
          { text: 'No change expected until week 12', isCorrect: false }
        ],
        correctAnswer: 0,
        explanation: 'Expected early response trajectory.',
        sectionIndex: 5
      },
      {
        type: 'multipleChoice',
        question: 'Relapse prevention planning should include:',
        options: [
          { text: 'Assuming permanent cure', isCorrect: false },
          { text: 'Identification of warning signs and response plans', isCorrect: true },
          { text: 'Discontinuation of all learned skills', isCorrect: false },
          { text: 'Avoidance of discussing potential recurrence', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'Relapse prevention components.',
        sectionIndex: 5
      },
      {
        type: 'multipleChoice',
        question: 'In stepped care models, treatment begins with:',
        options: [
          { text: 'The most intensive interventions available', isCorrect: false },
          { text: 'Medication only', isCorrect: false },
          {
            text: 'Lower-intensity interventions, stepping up for non-responders',
            isCorrect: true
          },
          { text: 'Hospitalization', isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: 'Stepped care model.',
        sectionIndex: 5
      }
    ]
  },
  references: [
    {
      citation: 'American Psychiatric Association. (2022). Diagnostic and statistical manual of mental disorders (5th ed., text rev.). American Psychiatric Publishing.'
    },
    {
      citation: 'Barlow, D. H. (Ed.). (2021). Clinical handbook of psychological disorders: A step-by-step treatment manual (6th ed.). Guilford Press.'
    },
    {
      citation: 'Beck, A. T. (1979). Cognitive therapy of depression. Guilford Press.'
    },
    {
      citation: 'Beck, A. T., & Haigh, E. A. P. (2014). Advances in cognitive theory and therapy: The generic cognitive model. Annual Review of Clinical Psychology, 10, 1-24.'
    },
    {
      citation: 'Beck, J. S. (2021). Cognitive behavior therapy: Basics and beyond (3rd ed.). Guilford Press.'
    },
    {
      citation: 'Craske, M. G., Treanor, M., Conway, C. C., Zbozinek, T., & Vervliet, B. (2014). Maximizing exposure therapy: An inhibitory learning approach. Behaviour Research and Therapy, 58, 10-23.'
    },
    {
      citation: 'Cuijpers, P., Quero, S., Noma, H., Ciharova, M., Miguel, C., Karyotaki, E., Cipriani, A., Cristea, I. A., & Furukawa, T. A. (2021). Psychotherapies for depression: A network meta-analysis covering efficacy, acceptability and long-term outcomes of all main treatment types. World Psychiatry, 20(2), 283-293.'
    },
    {
      citation: 'Dimidjian, S., Barrera, M., Jr., Martell, C., Muñoz, R. F., & Lewinsohn, P. M. (2011). The origins and current status of behavioral activation treatments for depression. Annual Review of Clinical Psychology, 7, 1-38.'
    },
    {
      citation: 'Hayes, S. C., Strosahl, K. D., & Wilson, K. G. (2012). Acceptance and commitment therapy: The process and practice of mindful change (2nd ed.). Guilford Press.'
    },
    {
      citation: 'Hofmann, S. G., Asnaani, A., Vonk, I. J., Sawyer, A. T., & Fang, A. (2012). The efficacy of cognitive behavioral therapy: A review of meta-analyses. Cognitive Therapy and Research, 36(5), 427-440.'
    },
    {
      citation: 'Kessler, R. C., Petukhova, M., Sampson, N. A., Zaslavsky, A. M., & Wittchen, H. U. (2012). Twelve-month and lifetime prevalence and lifetime morbid risk of anxiety and mood disorders in the United States. International Journal of Methods in Psychiatric Research, 21(3), 169-184.'
    },
    {
      citation: 'Kroenke, K., Spitzer, R. L., & Williams, J. B. (2001). The PHQ-9: Validity of a brief depression severity measure. Journal of General Internal Medicine, 16(9), 606-613.'
    },
    {
      citation: 'Linehan, M. M. (2015). DBT skills training manual (2nd ed.). Guilford Press.'
    },
    {
      citation: 'Martell, C. R., Dimidjian, S., & Herman-Dunn, R. (2022). Behavioral activation for depression: A clinician\'s guide (2nd ed.). Guilford Press.'
    },
    {
      citation: 'Segal, Z. V., Williams, J. M. G., & Teasdale, J. D. (2018). Mindfulness-based cognitive therapy for depression (2nd ed.). Guilford Press.'
    },
    {
      citation: 'Spitzer, R. L., Kroenke, K., Williams, J. B., & Löwe, B. (2006). A brief measure for assessing generalized anxiety disorder: The GAD-7. Archives of Internal Medicine, 166(10), 1092-1097.'
    }
  ],
  resources: [
    {
      title: 'PHQ-9 Patient Health Questionnaire (public domain)',
      url: 'https://www.phqscreeners.com/',
      type: 'worksheet',
      description: 'Free, public-domain nine-item depression severity measure with scoring instructions, severity bands, and translations.'
    },
    {
      title: 'GAD-7 Generalized Anxiety Disorder Scale (public domain)',
      url: 'https://www.phqscreeners.com/',
      type: 'worksheet',
      description: 'Free seven-item anxiety severity measure validated for screening and for session-by-session progress monitoring.'
    },
    {
      title: 'Association for Behavioral and Cognitive Therapies',
      url: 'https://www.abct.org/',
      type: 'organization',
      description: 'Professional home of evidence-based cognitive and behavioral treatment, with clinician fact sheets and training pathways.'
    },
    {
      title: 'Association for Contextual Behavioral Science — ACT Resources',
      url: 'https://contextualscience.org/',
      type: 'organization',
      description: 'Free ACT worksheets, values exercises, measures, and practitioner training resources.'
    },
    {
      title: 'NICE Guideline NG222 — Depression in Adults',
      url: 'https://www.nice.org.uk/guidance/ng222',
      type: 'guidelines',
      description: 'Current stepped-care treatment algorithms for depression by severity level, including relapse-prevention recommendations.'
    },
    {
      title: 'Society of Clinical Psychology — Research-Supported Psychological Treatments',
      url: 'https://div12.org/treatments/',
      type: 'research',
      description: 'Division 12 database of psychological treatments by disorder with strength-of-evidence ratings.'
    }
  ]
};

export default COURSE;

// ── model-based upsert: fires pre-save hook (wordCount) + runs validation ────
async function seed() {
  if (!process.env.MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }
  await mongoose.connect(process.env.MONGODB_URI);

  let doc = await Course.findOne({ slug: COURSE.slug });
  if (doc) {
    doc.set(COURSE);
    console.log('Updating existing:', COURSE.slug);
  } else {
    doc = new Course(COURSE);
    console.log('Inserting new:', COURSE.slug);
  }
  await doc.save();

  console.log(`Saved ${doc.courseCode} — wordCount=${doc.wordCount} (target ${(doc.ceHours || 0) * 6000})`);
  if (doc.wordCount < (doc.ceHours || 0) * 6000) {
    console.warn('Saved but UNDER target — left as draft. Add content and re-run.');
  }
  await mongoose.disconnect();
}

// Only seed when executed directly — lets auditCourse.js import COURSE safely.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  seed().catch(e => { console.error('SEED ERROR:', e.message); process.exit(1); });
}
