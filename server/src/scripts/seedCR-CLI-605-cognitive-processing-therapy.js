import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: new URL('../../../.env', import.meta.url).pathname });

const MONGODB_URI = process.env.MONGODB_URI;
const SLUG = 'cr-cli-605-cognitive-processing-therapy-ptsd';

const COURSE = {
  title: 'Cognitive Processing Therapy for PTSD: A Practical Guide',
  slug: SLUG,
  courseCode: 'CR-CLI-605',
  description: 'This course provides licensed mental health professionals with a comprehensive practical guide to Cognitive Processing Therapy (CPT), one of the most extensively researched first-line treatments for PTSD. Clinicians will learn the cognitive model underlying CPT, the structured 12-session protocol, core therapeutic techniques including Stuck Points and the ABC Worksheet, and strategies for adapting CPT to complex trauma presentations.',
  shortDescription: 'Learn to implement Cognitive Processing Therapy (CPT) for PTSD — the cognitive model, stuck points, worksheets, and protocol adaptations.',
  ceHours: 2,
  category: 'clinical',
  difficulty: 'intermediate',
  targetAudience: 'Licensed mental health professionals (LPCs, LCSWs, LMFTs, NCCs)',
  prerequisites: 'Basic familiarity with trauma-informed care recommended; prior training in cognitive-behavioral techniques helpful.',
  learningObjectives: [
    'Describe the cognitive model of PTSD underlying CPT and its empirical basis',
    'Identify the 12-session CPT protocol structure and the function of each phase',
    'Define "Stuck Points" and demonstrate how to identify and challenge them using CPT worksheets',
    'Apply the ABC Worksheet and Socratic questioning to maladaptive trauma-related cognitions',
    'Recognize the five themes central to CPT (safety, trust, power/control, esteem, and intimacy)',
    'Adapt CPT for complex trauma, co-occurring conditions, and diverse populations'
  ],
  presenter: {
    name: 'Kejuiana Johnson',
    credentials: 'MA, LPC, NCC, CPCS, BC-TMH',
    licenseNumber: 'LPC009587',
    licenseState: 'Georgia',
    licenseType: 'LPC'
  },
  provider: {
    name: 'GA Integrated Therapeutic Perspectives LLC',
    shortName: 'GAITP LLC',
    acepNumber: '7760',
    approvalBody: 'NBCC'
  },
  approvals: [{
    body: 'NBCC',
    number: '#7760',
    hourBreakdown: [{ label: 'core', hours: 2 }]
  }],
  isPublished: false,
  status: 'draft',
  sections: [
    {
      title: 'Introduction: The CPT Model and Evidence Base',
      order: 0,
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'Cognitive Processing Therapy for PTSD',
          subtitle: 'A practical guide to one of the most evidence-based trauma treatments available'
        },
        {
          type: 'text',
          content: `<h2>Why CPT?</h2>
<p>Post-traumatic stress disorder (PTSD) affects approximately 7–8% of the U.S. population over a lifetime, with higher rates among survivors of sexual assault (37–65%), combat veterans (11–30%), and other high-exposure populations. Despite decades of research establishing effective treatments, the majority of people with PTSD never receive evidence-based care — they receive supportive counseling, general CBT, or no trauma-specific treatment at all.</p>
<p>The gap between evidence and practice is one of the most significant public health challenges in mental health. Licensed counselors, social workers, and therapists are positioned to close that gap — but only if they have training in the approaches that actually work.</p>
<p>Cognitive Processing Therapy (CPT) is one of three treatments designated by the American Psychological Association and the U.S. Department of Veterans Affairs as strongly recommended, first-line treatments for PTSD. Developed by Dr. Patricia Resick and colleagues in the late 1980s and refined through decades of clinical trials, CPT has demonstrated large effect sizes for PTSD symptom reduction across diverse trauma types, populations, and settings.</p>
<p>This course provides practical training in CPT — the cognitive model, protocol structure, core techniques, and clinical considerations. It is not a full CPT certification training (that requires supervised practice), but it provides the foundational knowledge necessary to understand the approach, engage with CPT supervision, and begin integrating CPT techniques into your work with trauma survivors.</p>`
        },
        {
          type: 'text',
          content: `<h2>The Cognitive Model of PTSD</h2>
<p>CPT is grounded in a cognitive model of PTSD developed by Resick and Schnicke (1993). This model identifies the mechanism that maintains PTSD symptoms: the disruption of prior cognitive schemas (beliefs about self, others, and the world) by traumatic events.</p>
<p>Before trauma, most people hold relatively adaptive beliefs about the world: "The world is generally safe," "People are mostly trustworthy," "I have some control over what happens to me," "I am a good person." Trauma disrupts these schemas in two primary ways:</p>
<p><strong>1. Assimilation:</strong> The trauma survivor attempts to fit the traumatic event into existing schemas by distorting the memory of the event. "That couldn't have really happened to me" or "It wasn't really that bad" are examples. Assimilation prevents full processing of the traumatic experience and maintains avoidance.</p>
<p><strong>2. Over-accommodation:</strong> The trauma survivor changes their existing schemas in extreme, overly generalized ways to accommodate the traumatic experience. "The world is completely dangerous," "No one can ever be trusted," "I have no control over anything," "I am permanently damaged." These over-accommodated beliefs are the primary drivers of PTSD symptoms.</p>
<p>CPT targets over-accommodation directly. The therapist helps the client examine, challenge, and revise these extreme, overly generalized beliefs — called "Stuck Points" — to develop more balanced, nuanced beliefs that are accurate and adaptive.</p>
<p>Importantly, CPT's goal is not to make the client believe the world is safe when it isn't, or that people are trustworthy when many aren't. The goal is balance and accuracy: moving from "no one can ever be trusted" to "some people are trustworthy and I can learn to identify who" reflects genuine cognitive change, not toxic positivity.</p>`
        },
        {
          type: 'text',
          content: `<h2>What Are Stuck Points?</h2>
<p>Stuck Points are the core therapeutic target in CPT. They are defined as extreme, unhelpful beliefs — distorted cognitions — related to the traumatic event and its aftermath that prevent the natural recovery process from occurring.</p>
<p>Stuck Points fall into two categories:</p>
<p><strong>Self-blame and assimilation Stuck Points:</strong></p>
<ul>
<li>"I should have done something to stop it."</li>
<li>"If I had been more careful, this wouldn't have happened."</li>
<li>"I must have done something to deserve this."</li>
<li>"I knew something was wrong and did nothing."</li>
</ul>
<p><strong>Over-accommodation Stuck Points (about self, others, world, future):</strong></p>
<ul>
<li>"I am permanently damaged."</li>
<li>"The world is completely dangerous."</li>
<li>"No one can ever be trusted again."</li>
<li>"I will never be able to have a normal life."</li>
<li>"I am worthless."</li>
</ul>
<p>Stuck Points are NOT:</p>
<ul>
<li>Emotions ("I feel afraid") — these are feelings, not beliefs</li>
<li>Factual descriptions ("I was assaulted") — these are events, not beliefs</li>
<li>Questions ("Why did this happen?") — these are questions, not beliefs</li>
<li>Behavioral descriptions ("I avoid crowds") — these are behaviors, not beliefs</li>
</ul>
<p>A well-articulated Stuck Point is a complete thought that can be evaluated for accuracy and helpfulness: "It was my fault because I was drinking that night." This can be examined through evidence, challenged through Socratic questioning, and revised through the CPT worksheets.</p>`
        },
        {
          type: 'text',
          content: `<h2>The CPT Evidence Base</h2>
<p>CPT has one of the strongest evidence bases of any psychotherapy treatment for PTSD. Key findings:</p>
<p><strong>Randomized controlled trials:</strong> Multiple large RCTs have compared CPT to waitlist controls, supportive counseling, and other active treatments. CPT consistently produces large effect sizes for PTSD symptom reduction (Cohen's d = 1.0–2.0 in intent-to-treat analyses).</p>
<p><strong>Diverse trauma types:</strong> CPT has been studied extensively with sexual assault survivors (for whom it was originally developed), combat veterans, survivors of childhood sexual abuse, refugees, domestic violence survivors, and communities affected by mass violence.</p>
<p><strong>Diverse populations:</strong> CPT has been adapted and studied in low-income and minoritized communities, military populations, incarcerated individuals, and international settings (including Rwanda, Congo, and Bosnia).</p>
<p><strong>Treatment duration:</strong> The standard 12-session protocol produces clinically significant change for most participants. Brief versions (CPT-C, 12 sessions without written accounts) and intensive formats (daily sessions over two weeks) have also demonstrated efficacy.</p>
<p><strong>Comparison to other first-line treatments:</strong> Head-to-head trials comparing CPT to Prolonged Exposure (PE) — the other primary first-line PTSD treatment — generally show equivalent outcomes, suggesting both are effective without one being clearly superior. CPT's focus on cognition rather than exposure makes it preferable for some clients and clinical contexts.</p>
<p><strong>VA/DoD endorsement:</strong> CPT is one of two treatments (along with PE) most strongly recommended by the VA/DoD Clinical Practice Guideline for PTSD — the most widely used clinical guideline for this population.</p>`
        },
        {
          type: 'keyTakeaway',
          title: 'Key Takeaways: CPT Foundations',
          takeaways: [
            'CPT was developed by Patricia Resick and is a first-line, strongly recommended treatment for PTSD across VA, APA, and international guidelines',
            'The cognitive model of PTSD identifies two disruption pathways: assimilation (distorting the memory) and over-accommodation (overgeneralizing beliefs)',
            'Stuck Points are extreme, unhelpful beliefs — not emotions, events, or questions — that prevent natural PTSD recovery',
            'CPT targets over-accommodated beliefs about safety, trust, power/control, esteem, and intimacy',
            'Multiple RCTs demonstrate large effect sizes for PTSD reduction across diverse trauma types and populations',
            'CPT is equivalent in efficacy to Prolonged Exposure but focuses on cognition rather than trauma narrative exposure'
          ]
        },
        {
          type: 'multipleChoice',
          question: 'According to the CPT cognitive model, "over-accommodation" refers to:',
          options: [
            { text: 'Avoiding thinking about the trauma by distorting the memory of what happened', isCorrect: false },
            { text: 'Extreme, overgeneralized changes to prior beliefs in order to incorporate the traumatic experience', isCorrect: true },
            { text: 'Processing the trauma in ways that fully integrate it into existing schemas', isCorrect: false },
            { text: 'Accommodating the trauma survivor\'s needs within a therapeutic relationship', isCorrect: false }
          ],
          correctAnswer: 1,
          explanation: 'Over-accommodation in CPT refers to extreme, overgeneralized changes to prior beliefs driven by the traumatic event — moving from "some people are dangerous" to "no one can ever be trusted." These over-accommodated beliefs (Stuck Points) are the primary driver of PTSD symptoms and the primary target of CPT.'
        },
        {
          type: 'multiSelect',
          question: 'Which of the following are examples of Stuck Points? Select all that apply.',
          options: [
            { text: '"I feel anxious all the time"', isCorrect: false },
            { text: '"I was assaulted"', isCorrect: false },
            { text: '"It was my fault because I trusted him"', isCorrect: true },
            { text: '"I am permanently damaged and will never recover"', isCorrect: true },
            { text: '"No one can ever be trusted again"', isCorrect: true }
          ],
          explanation: 'Stuck Points are extreme, unhelpful beliefs — complete thoughts that can be evaluated for accuracy. "I feel anxious all the time" is an emotion, not a belief. "I was assaulted" is a factual event. The remaining three are beliefs about self, others, and the meaning of the trauma — classic Stuck Points amenable to CPT work.'
        }
      ]
    },
    {
      title: 'The CPT Protocol: Structure, Techniques, and Worksheets',
      order: 1,
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'CPT Protocol and Core Techniques',
          subtitle: 'The 12-session structure, ABC Worksheet, challenging questions, and five themes'
        },
        {
          type: 'text',
          content: `<h2>The 12-Session CPT Protocol Structure</h2>
<p>CPT follows a structured protocol, though good CPT therapists deliver it flexibly and relationally. The standard protocol consists of 12 individual sessions (60–90 minutes each), though some clients require more and some progress in fewer. A group format (CPT in groups of 8–12) has also demonstrated efficacy.</p>
<p><strong>Phase 1: Education and Introduction (Sessions 1–2)</strong></p>
<p>Session 1 introduces the cognitive model of PTSD, explains the treatment rationale, and assigns the first piece of work: the Impact Statement.</p>
<p>The Impact Statement asks: "Why do you think this traumatic event occurred? How has it affected your beliefs about yourself, others, and the world in the areas of safety, trust, power/control, esteem, and intimacy?"</p>
<p>This is not a trauma narrative — the client is not asked to describe what happened. The Impact Statement captures the client's current meaning-making: how they have explained the event to themselves and what it has done to their worldview. This provides the initial Stuck Points for the therapist to work with.</p>
<p>Session 2 reviews the Impact Statement together. The therapist listens for Stuck Points, names them, and introduces the concept explicitly. The therapist also teaches the connection between thoughts, feelings, and behaviors — the cognitive model in accessible language.</p>
<p><strong>Phase 2: Trauma Account and Stuck Point Identification (Sessions 3–4) — CPT+A version only</strong></p>
<p>In the original CPT protocol (CPT+A), Sessions 3–4 include written trauma accounts in which the client writes a detailed account of the traumatic event including sensory details and emotions. The therapist reads the account with the client and identifies Stuck Points emerging from the account.</p>
<p>In CPT-C (the more commonly used current version), the written accounts are omitted. Research has shown that CPT without accounts (CPT-C) produces equivalent outcomes for most clients — making it preferable in settings where accounts would be contraindicated or where clients strongly prefer to avoid them.</p>
<p><strong>Phase 3: Challenging Stuck Points (Sessions 4–11)</strong></p>
<p>The bulk of CPT focuses on challenging Stuck Points using structured worksheets. This phase is introduced gradually, moving from simpler to more complex challenging skills.</p>
<p><strong>Phase 4: Themes and Consolidation (Sessions 11–12)</strong></p>
<p>Later sessions address the five core Stuck Point themes systematically (safety, trust, power/control, esteem, intimacy) and consolidate gains. The final session includes a second Impact Statement for comparison, celebrating growth and consolidating resilience.</p>`
        },
        {
          type: 'text',
          content: `<h2>The ABC Worksheet (A=B=C Analysis)</h2>
<p>The ABC Worksheet is CPT's foundational skill-building tool, introduced in Sessions 2–3. It teaches clients to observe the connection between Activating Events (A), Beliefs about those events (B), and Consequences — emotional and behavioral (C).</p>
<p><strong>A — Activating Event:</strong> What happened? (A situation, trigger, or thought)</p>
<p><strong>B — Belief (Stuck Point):</strong> What did you tell yourself about A? What was your automatic thought?</p>
<p><strong>C — Consequences:</strong> What emotions did you feel? What behaviors resulted?</p>
<p><strong>Example ABC Worksheet:</strong></p>
<ul>
<li>A: My boss said I made a mistake on the report</li>
<li>B: "I am completely incompetent. I can never do anything right. I am worthless."</li>
<li>C: Shame, despair, withdrew from colleagues, considered quitting</li>
</ul>
<p>The ABC Worksheet teaches clients to identify Stuck Points in real time — they practice noticing when their emotional reactions are intense and working backward to identify the automatic thought (Stuck Point) driving the reaction.</p>
<p>The CPT therapist reviews ABC Worksheets collaboratively, uses Socratic questioning to explore the Stuck Points, and models the challenging process before the client does it independently. This scaffolded approach builds skills before the more demanding challenging worksheets are introduced.</p>`
        },
        {
          type: 'text',
          content: `<h2>Challenging Questions Worksheet</h2>
<p>Once clients have identified Stuck Points via the ABC Worksheet, the next step is challenging them. The Challenging Questions Worksheet guides clients through a systematic examination of evidence, logical errors, and alternative perspectives.</p>
<p><strong>The challenging questions include:</strong></p>
<ol>
<li>What is the evidence for and against this belief?</li>
<li>Is this belief always true? Are there exceptions?</li>
<li>Is there an alternative way of looking at this situation?</li>
<li>Am I confusing a habit with a fact?</li>
<li>Am I thinking in all-or-nothing terms?</li>
<li>Are my judgments based on feelings rather than facts?</li>
<li>Am I taking events out of context?</li>
<li>Am I making conclusions without evidence?</li>
<li>Am I using extreme words? (always, never, no one, everyone)</li>
<li>How important is this in the long run?</li>
</ol>
<p>Therapists should note: the goal of the Challenging Questions Worksheet is not to talk the client out of their beliefs or to "win" a debate. It is to help the client examine the evidence and logic underlying their beliefs so that they can revise those beliefs from the inside — a process that produces lasting change.</p>
<p><strong>Common therapist errors with challenging:</strong></p>
<ul>
<li>Rushing through the questions without genuine inquiry</li>
<li>Arguing with or dismissing client responses</li>
<li>Doing the challenging for the client rather than facilitating their own examination</li>
<li>Moving to the "Alternative Thought" before the client has genuinely engaged with the evidence</li>
</ul>`
        },
        {
          type: 'text',
          content: `<h2>The Patterns of Problematic Thinking Worksheet</h2>
<p>In later sessions, clients learn to identify patterns of problematic thinking — cognitive errors — that appear across multiple Stuck Points. Recognizing patterns helps clients challenge future Stuck Points more efficiently without needing the full Challenging Questions sequence each time.</p>
<p><strong>CPT's Patterns of Problematic Thinking include:</strong></p>
<p><em>Jumping to conclusions:</em> Assuming without evidence. "She didn't call back, which means she doesn't care about me."</p>
<p><em>Exaggerating or minimizing:</em> Catastrophizing negative events or minimizing positive ones. "That small mistake at work will definitely get me fired."</p>
<p><em>Ignoring important parts:</em> Focusing on one aspect of a situation while ignoring others. "I got 9 out of 10 answers right, but I got one wrong — I'm terrible at this."</p>
<p><em>Overgeneralizing:</em> Drawing broad conclusions from one event. "I was attacked once, so everywhere is dangerous."</p>
<p><em>Mind reading:</em> Assuming you know what others are thinking. "Everyone at the party could tell something was wrong with me."</p>
<p><em>Emotional reasoning:</em> Treating feelings as facts. "I feel guilty, so I must be guilty."</p>
<p><em>Shoulds:</em> Using inflexible rules about how you, others, or the world should be. "I should have done something to stop it."</p>
<p><em>Disqualifying the positive:</em> Explaining away positive evidence. "She said she trusts me, but she's just saying that."</p>
<p>Identifying patterns rather than individual Stuck Points accelerates the cognitive work and builds meta-cognitive skills the client can apply independently after treatment ends.</p>`
        },
        {
          type: 'text',
          content: `<h2>The Five Themes: CPT's Content Focus</h2>
<p>CPT systematically addresses five thematic areas in which traumatic events most commonly disrupt prior beliefs. These are introduced as a framework for understanding how the trauma has affected the client's worldview, and later sessions (7–11) address each theme explicitly.</p>
<p><strong>1. Safety</strong></p>
<p>Trauma disrupts beliefs about personal safety (self) and the safety of others. Over-accommodated safety beliefs include: "The world is completely dangerous," "I will be attacked again if I leave the house," "I can't protect myself or others."</p>
<p><em>Clinical note:</em> Safety beliefs require careful balance — some increased caution after trauma is adaptive. The goal is accurate threat assessment, not the belief that the world is universally safe.</p>
<p><strong>2. Trust</strong></p>
<p>Trauma disrupts beliefs about trustworthiness — both self-trust ("I can't trust my own judgment") and trust in others ("No one can ever be trusted"). Interpersonal traumas (assault, betrayal, abuse) particularly affect this theme.</p>
<p><strong>3. Power/Control</strong></p>
<p>Over-accommodated power beliefs include: "I have no control over what happens to me," "I am powerless," or the opposite extreme — "I must control everything to be safe." Both extremes interfere with adaptive functioning.</p>
<p><strong>4. Esteem</strong></p>
<p>Trauma affects self-esteem ("I am permanently damaged," "I am worthless," "I deserved this") and esteem for others ("People are terrible," "No one has value"). Self-blame Stuck Points often surface prominently in this theme.</p>
<p><strong>5. Intimacy</strong></p>
<p>Over-accommodated intimacy beliefs affect capacity for connection: "I will never be able to be close to anyone again," "No one could ever love me after what happened," "Being intimate is too dangerous."</p>
<p>The five themes provide a clinical map for understanding each client's specific pattern of over-accommodation. Not every client has significant Stuck Points in every theme — CPT focuses where the client's specific beliefs cluster.</p>`
        },
        {
          type: 'matching',
          matchingInstructions: 'Match each CPT component to its correct description.',
          matchingPairs: [
            { term: 'Impact Statement', definition: 'First homework assignment: client writes about why the trauma happened and how it affected their beliefs' },
            { term: 'Stuck Point', definition: 'An extreme, unhelpful belief related to trauma that prevents natural recovery' },
            { term: 'ABC Worksheet', definition: 'Tool connecting Activating events, Beliefs, and emotional/behavioral Consequences' },
            { term: 'Challenging Questions Worksheet', definition: 'Structured guide for examining evidence, logic, and alternatives to Stuck Points' },
            { term: 'Assimilation', definition: 'Distorting memory of the trauma to fit prior schemas; prevents full processing' },
            { term: 'Over-accommodation', definition: 'Extreme, overgeneralized changes to prior beliefs driven by the traumatic event' },
            { term: 'Patterns of Problematic Thinking', definition: 'Recurring cognitive errors (e.g., overgeneralizing, emotional reasoning) identified across multiple Stuck Points' }
          ]
        },
        {
          type: 'text',
          content: `<h2>Socratic Questioning in CPT</h2>
<p>Socratic questioning — a clinical skill adapted from cognitive therapy and the Socratic method — is CPT's primary relational technique for challenging Stuck Points. Rather than telling the client their beliefs are inaccurate, the therapist asks questions that invite the client to examine their own beliefs.</p>
<p><strong>Core Socratic questioning principles in CPT:</strong></p>
<ul>
<li><em>Genuine curiosity:</em> The therapist is genuinely interested in the client's perspective, not trying to lead them to a predetermined answer</li>
<li><em>Open questions:</em> Questions that invite exploration rather than yes/no responses</li>
<li><em>Building on client responses:</em> Each question follows from what the client just said</li>
<li><em>Pacing:</em> Socratic questioning is not rapid-fire — it allows space for genuine reflection</li>
</ul>
<p><strong>Socratic questioning examples:</strong></p>
<p>Client Stuck Point: "It was my fault — I should have fought back harder."</p>
<p>Therapist: "What makes you feel responsible for what happened?"<br>
Client: [responds]<br>
Therapist: "If your friend had been in exactly the same situation — the same person, the same threat, the same moment — would you say it was her fault for not fighting back harder?"<br>
Client: "No, of course not."<br>
Therapist: "What's different about your situation that makes you responsible and she wouldn't be?"</p>
<p>This sequence — the "Best Friend" question — is one of CPT's most powerful techniques for dismantling self-blame Stuck Points. The double standard between how clients judge themselves vs. how they would judge others in the same situation reveals the distortion without argument.</p>`
        },
        {
          type: 'multipleChoice',
          question: 'The CPT "Challenging Questions Worksheet" is designed to help clients:',
          options: [
            { text: 'Avoid thinking about the traumatic event by redirecting to positive experiences', isCorrect: false },
            { text: 'Systematically examine the evidence and logic underlying their Stuck Points', isCorrect: true },
            { text: 'Identify which traumatic memories require processing through written accounts', isCorrect: false },
            { text: 'Rate the severity of their PTSD symptoms across the five themes', isCorrect: false }
          ],
          correctAnswer: 1,
          explanation: 'The Challenging Questions Worksheet guides clients through systematic examination of evidence, logical errors, and alternative perspectives for each Stuck Point. The goal is not therapist-led persuasion but client-led cognitive revision through structured self-inquiry.'
        },
        {
          type: 'multipleChoice',
          question: 'A client has the Stuck Point: "I feel guilty about the accident, so I must be guilty." Which pattern of problematic thinking does this represent?',
          options: [
            { text: 'Jumping to conclusions', isCorrect: false },
            { text: 'Overgeneralizing', isCorrect: false },
            { text: 'Emotional reasoning', isCorrect: true },
            { text: 'Disqualifying the positive', isCorrect: false }
          ],
          correctAnswer: 2,
          explanation: 'Emotional reasoning is treating feelings as facts — "I feel X, therefore X is true." The client\'s Stuck Point equates the feeling of guilt with actual culpability, which is the defining characteristic of emotional reasoning in CPT\'s framework.'
        },
        {
          type: 'multiSelect',
          question: 'Which of the following are among the five themes CPT systematically addresses? Select all that apply.',
          options: [
            { text: 'Safety', isCorrect: true },
            { text: 'Trust', isCorrect: true },
            { text: 'Forgiveness', isCorrect: false },
            { text: 'Power/Control', isCorrect: true },
            { text: 'Intimacy', isCorrect: true },
            { text: 'Meaning', isCorrect: false }
          ],
          explanation: 'The five CPT themes are Safety, Trust, Power/Control, Esteem, and Intimacy. Forgiveness and meaning are not among CPT\'s five designated themes, though they may arise clinically. CPT specifically focuses on these five areas because trauma most commonly disrupts beliefs in these domains.'
        }
      ]
    },
    {
      title: 'Clinical Application: Complex Cases and Implementation',
      order: 2,
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'CPT in Clinical Practice',
          subtitle: 'Complex trauma, co-occurring conditions, cultural adaptation, and getting started'
        },
        {
          type: 'text',
          content: `<h2>CPT with Complex Trauma and Co-Occurring Conditions</h2>
<p>CPT was developed and initially studied with single-incident trauma survivors (primarily sexual assault survivors). Community mental health clinicians frequently work with clients whose presentations are more complex: multiple trauma exposures, childhood trauma histories, co-occurring substance use disorders, personality disorder features, or chronic PTSD. How does CPT fare with these presentations?</p>
<p><strong>Multiple trauma exposures:</strong> CPT is designed to address PTSD regardless of the specific trauma type or number of traumatic events. The protocol begins by having the client identify an "index trauma" — the event contributing most significantly to current PTSD symptoms — and focuses Stuck Point work around that event. Other traumatic experiences are incorporated as they surface in the five themes work. Research supports CPT's efficacy with multiple-trauma presentations.</p>
<p><strong>Childhood sexual abuse:</strong> CPT has been adapted and studied with adult survivors of childhood sexual abuse (CSA). The self-blame and esteem Stuck Points in CSA populations are often deeply entrenched ("I must have been bad for this to happen to a child" is a particularly painful Stuck Point). Research shows CPT produces significant improvement for CSA survivors, though the pace may be slower and more sessions may be needed.</p>
<p><strong>Co-occurring depression:</strong> Depression is highly comorbid with PTSD (rates of 50–70% in some populations). CPT produces significant reductions in both PTSD and depression symptoms — in many trials, treating PTSD with CPT also substantially reduces depressive symptoms without separate depression-specific intervention.</p>
<p><strong>Co-occurring substance use:</strong> Active SUD that is severe enough to impair cognitive engagement with the worksheets may need to be stabilized before CPT begins. However, CPT integrated with substance use treatment has been studied and is feasible for clients with mild-to-moderate SUD. Historically, clinicians have over-applied the "stabilize substance use first" rule in ways that indefinitely defer trauma treatment — which is not evidence-based. Clinicians should use clinical judgment rather than automatic deferral.</p>`
        },
        {
          type: 'text',
          content: `<h2>CPT with Dissociation</h2>
<p>Dissociative symptoms present a clinical complexity in CPT. When clients dissociate during sessions — particularly when engaging with trauma-adjacent material — they cannot meaningfully engage with the cognitive worksheets. The therapist must ground the client before continuing and assess whether CPT is the appropriate treatment modality at this time.</p>
<p><strong>Grounding techniques compatible with CPT:**</strong></p>
<ul>
<li>5-4-3-2-1 sensory grounding (identify 5 things you see, 4 you hear, etc.)</li>
<li>Cold water on hands or wrists</li>
<li>Orienting to the present time and place</li>
<li>Brief physical movement (standing, walking)</li>
</ul>
<p><strong>CPT adaptation for dissociation:</strong></p>
<ul>
<li>Build explicit grounding skills before trauma-adjacent content</li>
<li>Psychoeducate about dissociation as a learned protective response</li>
<li>Pace sessions to maintain the client in a productive window of tolerance</li>
<li>Consider stabilization-phase work (e.g., DBT skills, EMDR preparation phase) before CPT if dissociation is pervasive</li>
</ul>
<p>For clients with Dissociative Identity Disorder (DID) or severe dissociation, CPT as a standalone protocol is generally not appropriate without significant adaptation and consultation with dissociation specialists.</p>`
        },
        {
          type: 'text',
          content: `<h2>Cultural Adaptations of CPT</h2>
<p>CPT has been translated into more than 20 languages and studied across many cultural contexts. Cultural adaptations are necessary and evidence-supported. Key considerations:</p>
<p><strong>Collectivist cultures:</strong> The individualistic framing of some CPT Stuck Points ("I" beliefs) may not map well to clients whose self-concept is relational or communal. Therapists should adapt worksheet language to include relational dimensions: "Our family is permanently damaged" is a collectivistically-framed Stuck Point that can be challenged within the CPT framework.</p>
<p><strong>Cultural beliefs about causation:</strong> Many cultural and religious frameworks offer specific explanations for why traumatic events occur. These beliefs can function as Stuck Points (e.g., "God punished me for my sins") or as genuine sources of resilience and meaning. The therapist should explore how these beliefs function for the client — whether they cause suffering and impair functioning (Stuck Point) or provide comfort and integration (resource).</p>
<p><strong>Shame-based cultures:</strong> In cultural contexts where shame is a primary emotional organizer, self-blame Stuck Points may be particularly complex. The cultural context of honor, shame, and social standing should inform how the therapist approaches self-blame work — not to validate harmful beliefs, but to understand their cultural meaning and work within them.</p>
<p><strong>International research:</strong> CPT has been studied in Rwanda, Congo, Bosnia, Pakistan, Iraq, and multiple other international contexts, often delivered by trained lay counselors rather than licensed clinicians. These adaptations demonstrate the model's flexibility and cross-cultural applicability when implemented with cultural consultation and community involvement.</p>`
        },
        {
          type: 'text',
          content: `<h2>CPT vs. Prolonged Exposure: When to Choose Which</h2>
<p>CPT and Prolonged Exposure (PE) are the two most strongly supported PTSD treatments. Both are first-line. Both produce large effect sizes. When should a clinician choose CPT over PE (or vice versa)?</p>
<p><strong>Consider CPT when:</strong></p>
<ul>
<li>The client has significant self-blame or guilt Stuck Points that are driving PTSD symptoms</li>
<li>The client's PTSD is complicated by strong cognitive distortions about the meaning of the trauma</li>
<li>The client strongly prefers to avoid detailed trauma narration (CPT-C eliminates written accounts)</li>
<li>The clinical setting limits access to the longer sessions PE typically requires</li>
<li>Complex moral injury is a primary presenting issue (CPT's cognitive framework is particularly suited to moral injury work)</li>
</ul>
<p><strong>Consider PE when:</strong></p>
<ul>
<li>The client's PTSD is primarily maintained by avoidance of reminders (not by distorted cognitions)</li>
<li>The client has relatively intact pre-trauma beliefs and does not have prominent Stuck Points</li>
<li>The client is willing and able to engage with trauma narration and in vivo exposure</li>
</ul>
<p><strong>In practice:</strong> Many experienced trauma clinicians are trained in both and use clinical judgment — and client preference — to guide selection. Both approaches should be offered as options when possible; shared decision-making improves engagement and outcomes.</p>`
        },
        {
          type: 'text',
          content: `<h2>Moral Injury and CPT</h2>
<p>Moral injury — defined as the damage done to one's moral framework by participating in or witnessing events that violate one's deeply held moral beliefs — has gained significant clinical and research attention, particularly with veterans and military populations.</p>
<p>Moral injury is distinct from PTSD, though the two frequently co-occur. Moral injury presentations often include:</p>
<ul>
<li>Intense guilt and shame about actions taken or not taken during traumatic events</li>
<li>Feelings of betrayal by leaders, institutions, or peers</li>
<li>Loss of meaning, purpose, or spiritual/moral framework</li>
<li>Difficulty forgiving self or others</li>
</ul>
<p>CPT is particularly well-suited to moral injury work because its cognitive framework directly addresses guilt and shame Stuck Points. The Stuck Point "I should have done something to stop it" — central to moral injury — is directly addressed through CPT's self-blame challenging sequence.</p>
<p>Adaptations for moral injury in CPT:</p>
<ul>
<li>Extend time on the Power/Control theme — exploring what the client actually controlled in a complex, high-stakes situation</li>
<li>Use the "retrospective wisdom" examination: "What did you know at the moment? What information did you have?" challenges hindsight bias Stuck Points</li>
<li>Address grief and loss dimensions of moral injury alongside cognitive revision</li>
<li>Be attentive to spiritual and religious dimensions of moral injury; these may require consultation with chaplains or spiritual care providers</li>
</ul>`
        },
        {
          type: 'flashcardDeck',
          title: 'CPT Key Terms Flashcards',
          instructions: 'Review essential CPT terminology.',
          flashcards: [
            { front: 'Stuck Point', back: 'An extreme, unhelpful belief related to a traumatic event that prevents natural recovery — the primary CPT treatment target' },
            { front: 'Impact Statement', back: 'Session 1 homework: client writes about why the trauma occurred and how it affected their beliefs — identifies initial Stuck Points' },
            { front: 'Assimilation', back: 'Distorting the trauma memory to fit existing schemas; prevents full processing ("it wasn\'t really that bad")' },
            { front: 'Over-accommodation', back: 'Extreme, overgeneralized belief changes driven by trauma ("no one can ever be trusted again")' },
            { front: 'ABC Worksheet', back: 'Tool mapping Activating event → Belief (Stuck Point) → Consequences (emotions/behaviors)' },
            { front: 'Emotional Reasoning', back: 'Treating feelings as facts: "I feel guilty, so I must be guilty" — a common pattern of problematic thinking' },
            { front: 'Socratic Questioning', back: 'The CPT therapist\'s primary technique — genuine curiosity-based questions that guide clients to examine their own Stuck Points' },
            { front: 'CPT-C', back: 'CPT without written trauma accounts — the most commonly used current version; demonstrates equivalent efficacy to the original CPT+A' }
          ]
        },
        {
          type: 'text',
          content: `<h2>Getting Started with CPT: Practical Implementation</h2>
<p>For clinicians who want to begin implementing CPT, several practical steps are recommended:</p>
<p><strong>Training pathways:</strong></p>
<ul>
<li>The VA Caregiver Support Program and National Center for PTSD offer free online CPT training at www.cptforptsd.com</li>
<li>The CPT-PC (Primary Care) training package is available through the VA</li>
<li>Workshops through ISTSS (International Society for Traumatic Stress Studies) and APA Division 56</li>
<li>Full CPT certification requires a didactic training plus supervised cases with consultation</li>
</ul>
<p><strong>CPT worksheets:</strong> The official CPT therapist and patient materials are available through Guilford Press (Resick et al., 2017). Many training programs include free access to worksheets for training purposes.</p>
<p><strong>Case conceptualization:</strong> Before beginning CPT, the therapist conducts a thorough assessment including a structured PTSD measure (PCL-5 is most commonly used), identifies the index trauma, establishes an appropriate level of care, and reviews contraindications (active psychosis, active severe SUD, intellectual disability that would impair worksheet engagement).</p>
<p><strong>Session-by-session monitoring:</strong> The PCL-5 (PTSD Checklist for DSM-5) is administered weekly throughout CPT to track symptom trajectory. Clients who are not improving by Session 4–5 may need case conceptualization review, adjustments to Stuck Point selection, or consideration of whether CPT is the right treatment at this time.</p>
<p><strong>Supervision and consultation:</strong> CPT should be implemented with consultation, particularly for the first several cases. CPT consultation groups are available through training networks and the ISTSS consultation matching program.</p>`
        },
        {
          type: 'text',
          content: `<h2>Ethical Considerations in CPT</h2>
<p>Several ethical considerations arise specifically in CPT practice:</p>
<p><strong>Informed consent and transparency:</strong> Clients should understand what CPT involves — including homework expectations, the cognitive (not exposure) focus of CPT-C, and the anticipated course of treatment. Some clients will experience temporary symptom increases as they engage more actively with trauma-related cognitions. This should be anticipated and normalized in informed consent.</p>
<p><strong>Homework compliance and the therapeutic relationship:</strong> CPT's efficacy depends substantially on between-session homework (worksheets). When clients do not complete homework, clinicians should explore this within the therapeutic relationship rather than simply moving on: "What got in the way?" may reveal avoidance Stuck Points worth addressing directly.</p>
<p><strong>Treatment scope and appropriate referral:</strong> CPT is a trauma-specific intervention, not a general mental health treatment. Clinicians should be clear with clients (and themselves) about what CPT addresses and what it doesn't. Clients with significant psychosocial stressors, active suicidality, or needs beyond PTSD-specific treatment may require case management, safety planning, or concurrent services.</p>
<p><strong>Cultural humility:</strong> CPT's cognitive framework reflects Western psychological assumptions about the relationship between thoughts, feelings, and behavior. Clinicians should implement CPT with cultural humility — adapting language, frameworks, and examples to the client's cultural context and being open to culturally-specific meanings of the traumatic event.</p>
<p><strong>Scope of competence:</strong> This course provides foundational CPT knowledge. Clinicians who plan to implement CPT as a primary treatment modality should complete formal CPT training and obtain supervised experience before doing so. Using CPT techniques without adequate training or supervision is an ethical concern.</p>`
        },
        {
          type: 'keyTakeaway',
          title: 'Key Takeaways: CPT in Practice',
          takeaways: [
            'The 12-session CPT protocol moves from education → Stuck Point identification → challenging → themes consolidation',
            'CPT-C (without written accounts) demonstrates equivalent efficacy to the original CPT+A and is more widely used',
            'Socratic questioning — genuine curiosity-based questions — is CPT\'s primary relational technique for challenging Stuck Points',
            'CPT is uniquely suited to moral injury presentations because its cognitive framework directly addresses guilt and shame',
            'Cultural adaptations are necessary and evidence-supported — CPT has been implemented across 20+ languages and many cultural contexts',
            'CPT training should include both didactics and supervised cases; this course provides foundational knowledge, not certification'
          ]
        },
        {
          type: 'reflection',
          question: 'Consider a current or past client who experienced a traumatic event and developed beliefs that interfered with their recovery — what some CPT practitioners would call Stuck Points. What were one or two of those beliefs? How might the CPT framework — specifically the Challenging Questions Worksheet or the five themes — have helped you address those beliefs in a structured way?'
        },
        {
          type: 'multipleChoice',
          question: 'Which of the following clinical scenarios most strongly suggests choosing CPT over Prolonged Exposure (PE) for PTSD treatment?',
          options: [
            { text: 'A client whose PTSD is primarily maintained by behavioral avoidance of trauma reminders', isCorrect: false },
            { text: 'A client who is eager to engage with trauma narrative and in vivo exposure', isCorrect: false },
            { text: 'A client with prominent self-blame and guilt Stuck Points driving PTSD symptoms', isCorrect: true },
            { text: 'A client with relatively intact pre-trauma beliefs and few significant distortions', isCorrect: false }
          ],
          correctAnswer: 2,
          explanation: 'CPT is particularly indicated when self-blame, guilt, and cognitive distortions about the meaning of the trauma are prominent drivers of PTSD symptoms — exactly what CPT\'s Stuck Point challenging framework directly targets. PE is better suited when avoidance is the primary maintenance mechanism and cognitive distortions are less prominent.'
        },
        {
          type: 'multipleChoice',
          question: 'Which assessment tool is most commonly used to monitor PTSD symptom trajectory throughout a course of CPT?',
          options: [
            { text: 'PHQ-9', isCorrect: false },
            { text: 'PCL-5 (PTSD Checklist for DSM-5)', isCorrect: true },
            { text: 'GAD-7', isCorrect: false },
            { text: 'Beck Depression Inventory-II', isCorrect: false }
          ],
          correctAnswer: 1,
          explanation: 'The PCL-5 (PTSD Checklist for DSM-5) is the standard session-by-session monitoring tool in CPT. It maps directly to DSM-5 PTSD criteria and is sensitive enough to detect symptom changes across treatment. It is typically administered at every session to track progress and identify clients who are not improving.'
        },
        {
          type: 'multiSelect',
          question: 'Which of the following are appropriate Stuck Points for CPT work? Select all that apply.',
          options: [
            { text: '"I feel afraid all the time"', isCorrect: false },
            { text: '"No one can ever be trusted again"', isCorrect: true },
            { text: '"The attack happened at 11pm"', isCorrect: false },
            { text: '"I am permanently damaged"', isCorrect: true },
            { text: '"It was my fault because I should have known better"', isCorrect: true }
          ],
          explanation: 'Stuck Points must be beliefs (complete thoughts that can be evaluated), not emotions ("I feel afraid"), facts ("the attack happened"), or questions. "No one can ever be trusted again," "I am permanently damaged," and "It was my fault because I should have known better" are all classic Stuck Points — extreme, unhelpful beliefs about self, others, or the meaning of the trauma.'
        },
        {
          type: 'resources',
          title: 'Additional Resources',
          resources: [
            { name: 'CPT for PTSD (official training portal)', url: 'https://www.cptforptsd.com', description: 'Free online CPT training through the VA; therapist materials, worksheets, and consultation resources' },
            { name: 'National Center for PTSD — CPT Resources', url: 'https://www.ptsd.va.gov/professional/treat/txessentials/cpt_for_ptsd_pro.asp', description: 'Evidence base, implementation resources, and training links for CPT from the VA' },
            { name: 'Resick, P.A., Monson, C.M., & Chard, K.M. (2017). Cognitive Processing Therapy for PTSD: A comprehensive manual. Guilford Press.', url: '', description: 'The primary CPT practitioner reference; includes all worksheets and session-by-session guidance' },
            { name: 'International Society for Traumatic Stress Studies (ISTSS)', url: 'https://www.istss.org', description: 'Professional organization; CPT training, consultation matching, and PTSD treatment guidelines' }
          ]
        }
      ]
    }
  ],
  assessment: {
    questions: [
      {
        question: 'Who developed Cognitive Processing Therapy (CPT)?',
        options: ['Aaron Beck', 'Patricia Resick', 'Edna Foa', 'Bessel van der Kolk'],
        correctAnswer: 1,
        explanation: 'CPT was developed by Dr. Patricia Resick and colleagues, originally for sexual assault survivors, in the late 1980s. It has since been extensively studied and adapted for diverse trauma types and populations.'
      },
      {
        question: 'In the CPT cognitive model, which term describes distorting the memory of a traumatic event to fit pre-existing schemas?',
        options: ['Over-accommodation', 'Assimilation', 'Avoidance', 'Dissociation'],
        correctAnswer: 1,
        explanation: 'Assimilation refers to fitting the traumatic event into existing schemas by distorting the memory — "it wasn\'t really that bad" or "that couldn\'t really have happened." This prevents full processing of the trauma.'
      },
      {
        question: 'A Stuck Point in CPT is best defined as:',
        options: ['A memory of the traumatic event that is difficult to access', 'An emotion that is disproportionate to current circumstances', 'An extreme, unhelpful belief related to a traumatic event that prevents natural recovery', 'A behavioral pattern of avoidance maintaining PTSD symptoms'],
        correctAnswer: 2,
        explanation: 'Stuck Points are extreme, unhelpful beliefs — not emotions, memories, or behaviors — that prevent natural PTSD recovery. They are the primary treatment target in CPT.'
      },
      {
        question: 'Which of the following is NOT one of the five themes addressed in CPT?',
        options: ['Safety', 'Trust', 'Forgiveness', 'Esteem'],
        correctAnswer: 2,
        explanation: 'The five CPT themes are Safety, Trust, Power/Control, Esteem, and Intimacy. Forgiveness is not a designated CPT theme, though it may arise as a clinical issue and may be addressed through related Stuck Points.'
      },
      {
        question: 'The first homework assignment in CPT (the Impact Statement) asks the client to:',
        options: ['Write a detailed narrative of the traumatic event with sensory details', 'Rate their PTSD symptoms on the PCL-5', 'Write about why they think the trauma occurred and how it affected their beliefs', 'Identify three behavioral goals for treatment'],
        correctAnswer: 2,
        explanation: 'The Impact Statement asks the client to write about why they think the traumatic event occurred and how it has affected their beliefs about self, others, and the world. It is NOT a trauma narrative — it captures meaning-making and provides the therapist with initial Stuck Points.'
      },
      {
        question: 'CPT-C (CPT without written accounts) differs from the original CPT+A protocol in that:',
        options: ['It omits the Challenging Questions Worksheet', 'It eliminates written trauma accounts from the protocol', 'It requires more than 12 sessions for completion', 'It focuses on behavioral rather than cognitive interventions'],
        correctAnswer: 1,
        explanation: 'CPT-C eliminates the written trauma accounts (trauma narrative assignments) from the protocol. Research shows CPT-C produces equivalent outcomes to CPT+A for most clients, making it the more commonly used version.'
      },
      {
        question: 'The ABC Worksheet in CPT maps the connection between:',
        options: ['Assessment, Beliefs, and Coping strategies', 'Activating events, Beliefs, and Consequences', 'Avoidance, Behavior, and Cognition', 'Attention, Balance, and Control'],
        correctAnswer: 1,
        explanation: 'The ABC Worksheet connects Activating events (triggers), Beliefs (Stuck Points — automatic thoughts), and Consequences (emotional and behavioral reactions). It teaches clients to identify Stuck Points in real time by working backward from emotional reactions.'
      },
      {
        question: 'Which pattern of problematic thinking in CPT describes reasoning from an emotional state to a factual conclusion?',
        options: ['Overgeneralizing', 'Mind reading', 'Emotional reasoning', 'Disqualifying the positive'],
        correctAnswer: 2,
        explanation: 'Emotional reasoning treats feelings as evidence of facts: "I feel guilty, so I must be guilty." It is among the most common patterns in trauma-related Stuck Points and is directly targeted in CPT\'s challenging work.'
      },
      {
        question: 'Research comparing CPT to Prolonged Exposure (PE) for PTSD generally finds:',
        options: ['CPT produces larger effect sizes than PE across all populations', 'PE produces larger effect sizes than CPT for combat veterans', 'Both produce large effect sizes with generally equivalent outcomes', 'CPT is superior for childhood trauma and PE for adult trauma'],
        correctAnswer: 2,
        explanation: 'Head-to-head comparisons of CPT and PE generally show equivalent outcomes — both are effective, and neither is clearly superior across all populations. Clinicians should use clinical judgment and client preference to guide selection between these two first-line approaches.'
      },
      {
        question: 'CPT is particularly well-suited for moral injury presentations because:',
        options: ['It incorporates spiritual and religious frameworks into the protocol', 'Its cognitive framework directly addresses guilt and shame Stuck Points', 'It includes in vivo exposure to the contexts in which moral violations occurred', 'It uses group therapy formats that normalize moral injury experiences'],
        correctAnswer: 1,
        explanation: 'Moral injury presentations frequently involve intense guilt, shame, and self-blame about actions taken or not taken — exactly the Stuck Points that CPT\'s challenging framework directly targets. The "retrospective wisdom" examination and self-blame challenging sequences are particularly useful for moral injury work.'
      },
      {
        question: 'Which assessment tool is recommended for session-by-session symptom monitoring throughout CPT?',
        options: ['PHQ-9', 'GAD-7', 'PCL-5', 'BDI-II'],
        correctAnswer: 2,
        explanation: 'The PCL-5 (PTSD Checklist for DSM-5) is the standard CPT monitoring tool, typically administered at every session to track symptom trajectory and identify clients who are not responding to treatment.'
      },
      {
        question: 'For clients with active co-occurring substance use disorder, CPT research suggests:',
        options: ['SUD must always be fully resolved before beginning CPT', 'CPT integrated with substance use treatment is feasible for clients with mild-to-moderate SUD', 'CPT is contraindicated for any client with current substance use', 'Substance use should be the primary treatment focus until PTSD symptoms self-resolve'],
        correctAnswer: 1,
        explanation: 'CPT integrated with SUD treatment is feasible and has been studied. The historical "stabilize SUD first" rule is sometimes over-applied in ways that indefinitely delay trauma treatment. For mild-to-moderate SUD, CPT can typically begin while addressing substance use concurrently. Severe SUD that impairs cognitive engagement may require stabilization first.'
      },
      {
        question: 'Socratic questioning in CPT is best characterized as:',
        options: ['Confrontational challenge of client beliefs to produce insight', 'Genuine curiosity-based questions that guide clients to examine their own Stuck Points', 'Directive psychoeducation about cognitive distortions', 'Guided imagery techniques for processing traumatic memories'],
        correctAnswer: 1,
        explanation: 'Socratic questioning is characterized by genuine curiosity — following the client\'s responses, asking open questions, and building naturally from what the client says. It is not confrontational or directive; the therapist facilitates the client\'s own cognitive examination rather than leading them to predetermined conclusions.'
      },
      {
        question: 'Which of the following represents an appropriate ethical consideration when implementing CPT?',
        options: ['Clients should not be told about homework requirements until they are established in treatment', 'Clinicians should implement CPT after foundational training and with supervised case experience', 'CPT is appropriate as a general mental health treatment regardless of trauma history', 'Cultural adaptations to CPT\'s framework are not supported by research and should be avoided'],
        correctAnswer: 1,
        explanation: 'Scope of competence is a key ethical consideration: clinicians should complete formal CPT training and obtain supervised experience before using it as a primary treatment. This course provides foundational knowledge, not training certification. Clients also deserve informed consent including homework expectations, and cultural adaptation is both necessary and research-supported.'
      },
      {
        question: 'In CPT\'s five-theme framework, which theme most directly addresses the belief "No one can ever be trusted again"?',
        options: ['Safety', 'Trust', 'Power/Control', 'Intimacy'],
        correctAnswer: 1,
        explanation: '"No one can ever be trusted again" is an over-accommodated Trust Stuck Point — an extreme, generalized belief about others\' trustworthiness driven by the traumatic experience of betrayal or violation. The Trust theme in CPT directly addresses both self-trust ("I can\'t trust my own judgment") and trust in others.'
      },
      {
        question: 'When a CPT client is not showing improvement by Session 4–5, the recommended clinical response is:',
        options: ['Continue the protocol as written; improvement often comes in later sessions', 'Review the case conceptualization, Stuck Point selection, and consider whether CPT is the right fit', 'Add exposure components to accelerate progress', 'Discontinue CPT and refer to a more intensive program'],
        correctAnswer: 1,
        explanation: 'Early non-response in CPT warrants clinical review: Is the right index trauma being addressed? Are the Stuck Points actually extreme beliefs (not emotions or behaviors)? Is the therapeutic alliance sufficient? Is something interfering with homework completion? This review often identifies course corrections rather than requiring treatment discontinuation.'
      }
    ]
  },
  references: [
    { citation: 'Resick, P.A., & Schnicke, M.K. (1993). Cognitive processing therapy for rape victims: A treatment manual. Sage.' },
    { citation: 'Resick, P.A., Monson, C.M., & Chard, K.M. (2017). Cognitive processing therapy for PTSD: A comprehensive manual. Guilford Press.' },
    { citation: 'Resick, P.A., Galovski, T.E., Uhlmansiek, M.O., Scher, C.D., Clum, G.A., & Young-Xu, Y. (2008). A randomized clinical trial to dismantle components of cognitive processing therapy for posttraumatic stress disorder in female victims of interpersonal violence. Journal of Consulting and Clinical Psychology, 76(2), 243–258.' },
    { citation: 'Monson, C.M., Schnurr, P.P., Resick, P.A., Friedman, M.J., Young-Xu, Y., & Stevens, S.P. (2006). Cognitive processing therapy for veterans with military-related posttraumatic stress disorder. Journal of Consulting and Clinical Psychology, 74(5), 898–907.' },
    { citation: 'Chard, K.M. (2005). An evaluation of cognitive processing therapy for the treatment of posttraumatic stress disorder related to childhood sexual abuse. Journal of Consulting and Clinical Psychology, 73(5), 965–971.' },
    { citation: 'Laska, K.M., Gurman, A.S., & Wampold, B.E. (2014). Expanding the lens of evidence-based practice in psychotherapy: A common factors perspective. Psychotherapy, 51(4), 467–481.' },
    { citation: 'VA/DoD Clinical Practice Guideline Working Group. (2017). VA/DoD clinical practice guideline for the management of posttraumatic stress disorder and acute stress disorder. Department of Veterans Affairs.' },
    { citation: 'Watts, B.V., Schnurr, P.P., Mayo, L., Young-Xu, Y., Weeks, W.B., & Friedman, M.J. (2013). Meta-analysis of the efficacy of treatments for posttraumatic stress disorder. Journal of Clinical Psychiatry, 74(6), e541–e550.' },
    { citation: 'Galovski, T.E., Blain, L.M., Mott, J.M., Elwood, L., & Houle, T. (2012). Massed versus standard-spaced prolonged exposure sessions: Is there a difference? Journal of Consulting and Clinical Psychology, 80(2), 247–258.' },
    { citation: 'Kaysen, D., Seim, R., Majumdar, S., & Murray, L. (2014). Cognitive processing therapy for rape-related PTSD in women across cultures. Journal of Traumatic Stress, 27(3), 351–358.' },
    { citation: 'Bass, J.K., Annan, J., McIvor Murray, S., Kaysen, D., Griffiths, S., Cetinoglu, T., ... & Bolton, P.A. (2013). Controlled trial of psychotherapy for Congolese survivors of sexual violence. New England Journal of Medicine, 368(23), 2182–2191.' },
    { citation: 'Litz, B.T., Stein, N., Delaney, E., Lebowitz, L., Nash, W.P., Silva, C., & Maguen, S. (2009). Moral injury and moral repair in war veterans: A preliminary model and intervention strategy. Clinical Psychology Review, 29(8), 695–706.' },
    { citation: 'Hien, D.A., Cohen, L.R., Miele, G.M., Litt, L.C., & Capstick, C. (2004). Promising treatments for women with comorbid PTSD and substance use disorders. American Journal of Psychiatry, 161(8), 1426–1432.' },
    { citation: 'American Psychological Association. (2017). Clinical practice guideline for the treatment of posttraumatic stress disorder (PTSD) in adults. APA.' },
    { citation: 'Foa, E.B., Hembree, E.A., & Rothbaum, B.O. (2007). Prolonged exposure therapy for PTSD: Emotional processing of traumatic experiences. Oxford University Press.' },
    { citation: 'National Center for PTSD. (2023). Using the PTSD Checklist for DSM-5 (PCL-5). U.S. Department of Veterans Affairs. Retrieved from https://www.ptsd.va.gov' }
  ]
};

function stripHTML(h){return(h||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();}
function countWords(c){let t=0;for(const s of c.sections||[])for(const b of s.contentBlocks||[]){
  if(b.content)t+=stripHTML(b.content).split(/\s+/).filter(Boolean).length;
  if(b.question)t+=stripHTML(b.question).split(/\s+/).filter(Boolean).length;
  if(b.explanation)t+=stripHTML(b.explanation).split(/\s+/).filter(Boolean).length;
  if(b.accordionItems)b.accordionItems.forEach(a=>{t+=stripHTML(a.title).split(/\s+/).filter(Boolean).length;t+=stripHTML(a.content).split(/\s+/).filter(Boolean).length;});
  if(b.options)b.options.forEach(o=>t+=stripHTML(typeof o==='string'?o:o.text||'').split(/\s+/).filter(Boolean).length);
  if(b.cards||b.flashcards)(b.cards||b.flashcards||[]).forEach(c=>{t+=stripHTML(c.front).split(/\s+/).filter(Boolean).length;t+=stripHTML(c.back).split(/\s+/).filter(Boolean).length;});
  if(b.nodes)b.nodes.forEach(n=>{t+=stripHTML(n.text).split(/\s+/).filter(Boolean).length;if(n.choices)n.choices.forEach(ch=>t+=stripHTML(ch.text).split(/\s+/).filter(Boolean).length);});
  if(b.matchingPairs)b.matchingPairs.forEach(p=>{t+=stripHTML(p.term).split(/\s+/).filter(Boolean).length;t+=stripHTML(p.definition).split(/\s+/).filter(Boolean).length;});
  if(b.steps)b.steps.forEach(s=>t+=stripHTML(s.text).split(/\s+/).filter(Boolean).length);
  if(b.takeaways)b.takeaways.forEach(tk=>t+=stripHTML(tk).split(/\s+/).filter(Boolean).length);
  if(b.blanks)b.blanks.forEach(bl=>{t+=stripHTML(bl.prompt).split(/\s+/).filter(Boolean).length;t+=stripHTML(bl.answer).split(/\s+/).filter(Boolean).length;});
  if(b.resources)b.resources.forEach(r=>{t+=stripHTML(r.name||'').split(/\s+/).filter(Boolean).length;t+=stripHTML(r.description||'').split(/\s+/).filter(Boolean).length;});
}return t;}
function validate(c){const e=[];const wc=countWords(c);if(wc<c.ceHours*6000)e.push('CRITICAL:words');
for(const[i,s]of(c.sections||[]).entries()){const t=(s.contentBlocks||[]).map(b=>b.type);
if(!t.includes('sectionDivider'))e.push(`S${i+1}:divider`);
if(t.filter(x=>['multipleChoice','multiSelect','matching','fillInBlank'].includes(x)).length<2)e.push(`S${i+1}:KC<2`);
if(t.filter(x=>['flashcardDeck','scenarioTree','cardSort','sequencing'].includes(x)).length<1&&i>0&&i<c.sections.length-1)e.push(`S${i+1}:activity`);
for(const b of s.contentBlocks||[])if(b.options?.length&&typeof b.options[0]==='string')e.push('CRITICAL:flat_options');}
if((c.assessment?.questions?.length||0)<15)e.push('CRITICAL:exam<15');
if((c.references?.length||0)<15)e.push('CRITICAL:refs<15');return{wc,e};}
async function main(){
  await mongoose.connect(MONGODB_URI);const db=mongoose.connection.db;const col=db.collection('interactivecourses');
  const{wc,e}=validate(COURSE);COURSE.wordCount=wc;
  console.log(`${COURSE.courseCode}|${wc}w/${COURSE.ceHours*6000}req|${COURSE.sections.length}sec|${COURSE.assessment?.questions?.length}exam|${COURSE.references?.length}refs`);
  const crit=e.filter(x=>x.startsWith('CRITICAL'));
  if(crit.length){console.error('❌',crit.join('; '));await mongoose.disconnect();process.exit(1);}
  if(e.length)e.forEach(x=>console.warn('⚠️',x));
  const ex=await col.findOne({slug:SLUG});
  if(ex){await col.updateOne({slug:SLUG},{$set:{...COURSE,updatedAt:new Date()}});console.log('✅ Updated');}
  else{await col.insertOne({...COURSE,createdAt:new Date(),updatedAt:new Date()});console.log('✅ Inserted');}
  await mongoose.disconnect();
}
main().catch(e=>{console.error(e);process.exit(1);});
