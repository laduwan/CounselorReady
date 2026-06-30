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
          type: 'text',
          content: `<h2>Natural Recovery and Stuck Processing: Why Some People Recover and Others Don't</h2>
<p>A question clinicians frequently ask is: if traumatic experiences are so common, why do only some people develop chronic PTSD? Understanding natural recovery — and what disrupts it — is foundational to understanding why CPT works and how to explain the treatment rationale to clients.</p>
<p><strong>The natural recovery process</strong></p>
<p>After a traumatic event, most people experience acute distress — intrusive memories, hypervigilance, sleep disruption, emotional numbing. These symptoms are normative, not pathological. They reflect an adaptive stress response that mobilizes the organism to process a significant threat.</p>
<p>In the weeks and months following a trauma, most people naturally move through a recovery process. They think and talk about what happened, process their emotional reactions, and gradually integrate the traumatic experience into their narrative and worldview. Symptoms decrease. Functioning returns. This is natural recovery — and the majority of trauma survivors experience it.</p>
<p>PTSD develops when this natural recovery process is disrupted. The central mechanism of disruption, from a CPT perspective, is cognitive avoidance: the person avoids thinking about, feeling about, or processing the traumatic experience because doing so is intensely painful. This avoidance prevents the cognitive and emotional processing that would otherwise resolve the symptoms.</p>
<p><strong>The role of stuck points in disrupting recovery</strong></p>
<p>Stuck Points are not merely symptoms of PTSD — they are the mechanism by which natural recovery is disrupted. Consider a sexual assault survivor who develops the Stuck Point: "It was my fault because I didn't fight back hard enough." This belief generates intense shame whenever the assault comes to mind. To avoid the shame, the survivor avoids thinking about the assault — which prevents the processing that would naturally resolve PTSD symptoms. The Stuck Point generates avoidance, the avoidance prevents recovery, and PTSD is maintained.</p>
<p>Over-accommodation Stuck Points work similarly: "The world is completely dangerous" generates intense anxiety whenever the survivor leaves a safe environment. To reduce anxiety, they restrict their movements — which maintains hypervigilance and prevents the natural disconfirmation experiences that would revise the over-accommodated belief.</p>
<p>This model has a critical clinical implication: PTSD symptoms are not evidence of trauma severity or personal weakness. They are evidence that natural recovery has been disrupted by cognitive avoidance — a problem that CPT is specifically designed to address.</p>
<p><strong>Explaining the CPT rationale to clients</strong></p>
<p>When clinicians explain this model to clients, it is important to normalize both the symptoms and the recovery process. A useful psychoeducational frame: "After something terrible happens, our minds naturally try to make sense of it. But sometimes the meaning we make — the beliefs we form about what it says about us, about others, about the world — gets stuck in extreme places. And when our beliefs are stuck in extreme places, we avoid thinking about the event to avoid the pain of those beliefs. This avoidance keeps us stuck. What we're going to do in CPT is gently examine those stuck beliefs and see if we can find a more accurate, balanced perspective."</p>
<p>This framing does several important things: it normalizes PTSD symptoms as an understandable response (reducing shame), it identifies the cognitive mechanism clearly, it positions the client as an active participant in revision (rather than a passive recipient of therapy), and it sets realistic expectations for the treatment process.</p>`
        },
        {
          type: 'text',
          content: `<h2>Assimilation, Accommodation, and Over-Accommodation: Clinical Depth</h2>
<p>The three cognitive processes at the heart of CPT's model — assimilation, accommodation, and over-accommodation — deserve clinical elaboration beyond their textbook definitions. Understanding how these processes manifest in real clients enables more precise case conceptualization and targeted intervention.</p>
<p><strong>Assimilation in clinical practice</strong></p>
<p>Assimilation occurs when the trauma survivor distorts the traumatic memory to fit pre-existing beliefs. The classic example is the person who held the pre-trauma belief "bad things only happen to bad people" and assimilates a traumatic assault by concluding "I must have done something to deserve it" — preserving the prior belief at the cost of self-blame.</p>
<p>Assimilation also manifests as minimization: "It wasn't really that bad," "Plenty of people have been through worse," "I shouldn't be making such a big deal of this." These minimizing thoughts preserve the prior belief that trauma doesn't happen to ordinary people in ordinary circumstances — but at the cost of validating the severity of the experience and allowing full emotional processing.</p>
<p>Clinical examples of assimilation Stuck Points:</p>
<ul>
<li>A combat veteran who witnessed civilian casualties and holds the assimilation Stuck Point "We must have had a good reason for that mission" — avoiding moral injury by distorting his memory of the circumstances</li>
<li>A woman assaulted by a trusted friend who holds "He wouldn't have done that unless I gave him some reason to think it was okay" — distorting the event to preserve her prior belief that trusted friends are safe</li>
<li>A car accident survivor who holds "I must have been driving badly for this to happen" — preserving the belief that accidents happen to careless people, not careful ones</li>
</ul>
<p>The therapeutic task with assimilation Stuck Points is to help the client examine whether the distortion serves them. "If you truly believe it was your fault, what has that belief cost you? And is there any way that belief could be accurate given what you've told me about the circumstances?"</p>
<p><strong>Accommodation in clinical practice</strong></p>
<p>Accommodation — the healthy integration of new information into existing schemas — is the goal of CPT. When accommodation occurs successfully, the client's worldview becomes more nuanced and realistic: "Most people are trustworthy, but some people are capable of causing harm, and I can learn to identify warning signs." This is not a prior belief (which may have been "everyone is trustworthy") or an over-accommodated belief ("no one can be trusted") — it is a revised belief that integrates the traumatic experience with balanced accuracy.</p>
<p>Successful accommodation after trauma means:</p>
<ul>
<li>The traumatic event is understood as a real, significant event that happened (not minimized or denied)</li>
<li>The meaning of the event is integrated into a worldview that acknowledges both the reality of the harm and the continued possibility of safety, trust, and meaning</li>
<li>Symptoms decrease because avoidance is no longer necessary — the cognitive framework no longer generates overwhelming shame, guilt, or terror when the event comes to mind</li>
</ul>
<p><strong>Over-accommodation in clinical practice</strong></p>
<p>Over-accommodation is the opposite extreme from assimilation: instead of distorting the memory to preserve prior beliefs, the survivor completely revises their prior beliefs to accommodate the traumatic experience — but in ways that are extreme, global, and overgeneralized.</p>
<p>Clinical examples of over-accommodation across the five themes:</p>
<ul>
<li><em>Safety:</em> A domestic violence survivor who held the pre-trauma belief "My home is my safe place" over-accommodates after repeated abuse to "Nowhere is safe. Every relationship leads to harm."</li>
<li><em>Trust:</em> A person betrayed by a trusted authority figure over-accommodates from "Most authority figures are trustworthy" to "Everyone in a position of authority will exploit you. Never trust anyone with power over you."</li>
<li><em>Power/Control:</em> A survivor of a natural disaster who held the pre-trauma belief "Hard work and preparation protect me from catastrophe" over-accommodates to "There is no point in planning or preparing. Catastrophe can strike anyone at any time and there is nothing I can do."</li>
<li><em>Esteem:</em> A sexual assault survivor who held the pre-trauma belief "I am a capable, competent person" over-accommodates to "I am permanently damaged. No one will ever want to be close to me. I will never recover from this."</li>
<li><em>Intimacy:</em> A person whose intimate partner was the perpetrator of violence over-accommodates from "Intimate relationships can be a source of joy and connection" to "Intimacy is dangerous. Anyone I allow close to me will eventually hurt me."</li>
</ul>
<p>Over-accommodation Stuck Points are particularly painful because they cut the survivor off from the resources — connection, trust, agency, self-worth — that support recovery and resilience. CPT's primary therapeutic work targets these over-accommodated beliefs directly.</p>`
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
          content: `<h2>The 12-Session CPT Protocol: Session-by-Session Guide</h2>
<p>CPT follows a structured protocol, though good CPT therapists deliver it flexibly and relationally. The standard protocol consists of 12 individual sessions (60–90 minutes each), though some clients require more and some progress in fewer. A group format (CPT in groups of 8–12) has also demonstrated efficacy. Below is a detailed session-by-session breakdown of the CPT-C protocol (the version without written trauma accounts).</p>
<p><strong>Session 1: Education and Rationale</strong></p>
<p>Goals: Establish therapeutic alliance; provide psychoeducation about PTSD and the cognitive model; assign the Impact Statement homework.</p>
<p>The therapist explains PTSD in client-friendly language — what it is, why it develops, and why natural recovery sometimes gets stuck. The cognitive model is introduced: "Your symptoms are being maintained by beliefs — stuck points — that prevent your mind from fully processing what happened. We're going to work together to examine those beliefs." The therapist normalizes both the PTSD symptoms and the recovery process, reducing shame and increasing hope.</p>
<p>The Impact Statement assignment is introduced: "Between now and our next session, I'd like you to write at least one page about why you think this traumatic event happened and what impact it has had on your beliefs about yourself, other people, and the world. Think specifically about the areas of safety, trust, power and control, esteem, and intimacy." Critically, the client is asked about meaning — not what happened.</p>
<p>Common Session 1 therapeutic considerations: Clients who minimize ("I don't think I have PTSD") may need additional time on symptom validation. Clients who are overwhelmed by psychoeducation may need a slower pace. The therapeutic alliance begins here — warmth, genuineness, and collaborative framing are essential.</p>
<p><strong>Session 2: Impact Statement Review and Stuck Point Introduction</strong></p>
<p>Goals: Review the Impact Statement; identify initial Stuck Points; introduce ABC Worksheet and assign for homework.</p>
<p>The therapist reads the Impact Statement aloud with the client, listening carefully for Stuck Points. Stuck Points are circled or underlined and written on the Stuck Point Log — a running list maintained throughout therapy. The client may be surprised to have their beliefs identified so explicitly: "Wait, is that a stuck point? I thought that was just the truth." This moment of gentle challenge is the beginning of the cognitive work.</p>
<p>The therapist introduces the concept of emotions vs. thoughts: "Feelings are not the same as beliefs. 'I feel guilty' is an emotion. 'It was my fault' is a belief — and that's what we can examine together." The ABC Worksheet is introduced and assigned for practice between Sessions 2 and 3.</p>
<p><strong>Session 3: ABC Worksheets and Connecting Events to Emotions</strong></p>
<p>Goals: Review ABC Worksheets; practice identifying the thought-feeling connection; begin building the habit of catching Stuck Points in real time.</p>
<p>The therapist reviews the client's completed ABC Worksheets, models the analysis for any worksheets the client found difficult, and helps the client identify patterns. Early in this session, clients often report difficulty identifying their "B" — the belief. They describe activating events and emotional consequences but struggle to articulate the automatic thought connecting them. The therapist scaffolds this: "When that happened, what did you tell yourself about what it meant? About what it said about you?"</p>
<p>The Stuck Point Log is updated with any new Stuck Points surfacing in the ABC Worksheets. The client begins to see that their distress is driven by beliefs, not events — a subtle but powerful cognitive shift that sets the stage for challenging work.</p>
<p><strong>Session 4: Introduction to Challenging Beliefs (Challenging Questions Worksheet)</strong></p>
<p>Goals: Introduce the Challenging Questions Worksheet; complete the first challenging worksheet together in session; assign for homework.</p>
<p>This session marks a turning point: the client now has the tools to not just identify Stuck Points but actively examine them. The therapist introduces the Challenging Questions Worksheet and walks through each question with one of the client's identified Stuck Points. It is important to work collaboratively — the therapist asks the questions, the client generates the answers, and the therapist follows the client's lead rather than providing the "correct" response.</p>
<p>Session 4 is often emotionally intense. Examining a deeply held Stuck Point for the first time can produce grief, anger, or insight — sometimes all three. The therapist should pace the session carefully and allow space for emotional processing.</p>
<p><strong>Sessions 5–6: Stuck Point Challenging — Self-Blame and Assimilation</strong></p>
<p>Goals: Continue Challenging Questions Worksheet practice; focus on self-blame and assimilation Stuck Points; introduce Patterns of Problematic Thinking.</p>
<p>These sessions focus particularly on self-blame Stuck Points, which are often the most emotionally charged. The "Best Friend" technique — "Would you say this to a close friend who had been through the exact same thing?" — is highly effective in these sessions for dismantling the double standard between self-judgment and judgment of others.</p>
<p>The Patterns of Problematic Thinking Worksheet is introduced, teaching clients to recognize recurring cognitive errors across multiple Stuck Points. Clients often find this worksheet liberating — recognizing patterns reduces the need for exhaustive challenging of each individual Stuck Point.</p>
<p><strong>Sessions 7–8: Safety and Trust Themes</strong></p>
<p>Goals: Systematically address Safety Stuck Points; then Trust Stuck Points; introduce the Alternative Thoughts Worksheet.</p>
<p>Session 7 focuses specifically on the Safety theme, reviewing all safety-related Stuck Points from the Stuck Point Log. The therapist helps the client distinguish between actual danger assessment (which may require genuine updating of safety behaviors) and overgeneralized fear (which is the target of challenging). "Your hypervigilance makes complete sense given what you experienced. The question is: is your current danger assessment accurate for the situations you're actually in now?"</p>
<p>Session 8 addresses Trust Stuck Points, which often include both self-trust ("I can't trust my own judgment") and trust in others. Interpersonal trauma survivors particularly struggle here. The therapist introduces the Alternative Thoughts Worksheet in these sessions, helping clients formulate balanced replacement beliefs rather than simply identifying what's wrong with the original Stuck Point.</p>
<p><strong>Sessions 9–10: Power/Control and Esteem Themes</strong></p>
<p>Goals: Address Power/Control Stuck Points and Esteem Stuck Points; continue Alternative Thoughts Worksheet work.</p>
<p>Session 9 addresses the Power/Control theme — perhaps the most complex, because it involves two opposite distortions: the belief that one had more control than was actually possible ("I should have been able to prevent this") and the belief that one has no control ("There is nothing I can do to protect myself"). The therapist helps the client develop a nuanced sense of actual agency — what was genuinely controllable in the traumatic event and what was not.</p>
<p>Session 10 addresses Esteem Stuck Points, which often include the most painful self-beliefs ("I am permanently damaged," "I am unlovable," "I am worthless"). These sessions may require additional time and gentleness. The therapist should validate the depth of the wound while maintaining the collaborative spirit of examination: "You've believed this about yourself for a long time. I wonder if we can look at the evidence together and see if it holds up."</p>
<p><strong>Session 11: Intimacy Theme and Consolidation</strong></p>
<p>Goals: Address Intimacy Stuck Points; review treatment progress; prepare for termination.</p>
<p>Session 11 addresses the Intimacy theme — beliefs about capacity for connection, love, and closeness in the aftermath of trauma. These sessions often produce significant grief: clients who have isolated themselves for years may begin to recognize the toll of their over-accommodated intimacy beliefs. The therapist validates this grief while supporting movement toward connection.</p>
<p>The session also begins consolidation: reviewing the Stuck Point Log, noticing which Stuck Points have shifted, celebrating progress, and anticipating future application of CPT skills.</p>
<p><strong>Session 12: Final Impact Statement and Termination</strong></p>
<p>Goals: Write and review the final Impact Statement; compare with the initial Impact Statement; consolidate gains; plan for maintenance and relapse prevention.</p>
<p>The final session asks the client to write a new Impact Statement — answering the same questions as the first, about why the trauma happened and what they now believe about self, others, and the world. Reading this alongside the initial Impact Statement is typically a powerful experience: clients see in their own words how much their beliefs have changed.</p>
<p>Termination includes relapse prevention planning: Which Stuck Points might return under stress? What would be the early warning signs? How will the client use CPT skills independently going forward? Some clients benefit from booster sessions — occasional check-ins to address new Stuck Points that emerge over time.</p>`
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
          content: `<h2>The Challenging Questions Worksheet in Clinical Use</h2>
<p>Once clients have identified Stuck Points via the ABC Worksheet, the next step is challenging them. The Challenging Questions Worksheet guides clients through a systematic examination of evidence, logical errors, and alternative perspectives. Understanding how to use this worksheet skillfully in clinical practice requires more than knowing the questions — it requires understanding the purpose of each question, the common errors clinicians make, and how to adapt the worksheet to different Stuck Points and client presentations.</p>
<p><strong>The challenging questions and their clinical purpose:</strong></p>
<ol>
<li><em>What is the evidence for and against this belief?</em> The foundational empirical question — inviting the client to function as their own scientist. This question works best when clients can identify specific, concrete evidence rather than vague impressions. If a client says "I know I'm permanently damaged," the therapist might ask: "What would be evidence that someone is permanently damaged? What specific things do you believe you can no longer do?"</li>
<li><em>Is this belief always true? Are there exceptions?</em> Targets overgeneralization. A Stuck Point that is "always" true becomes more nuanced when even a single exception is identified. "You said no one can ever be trusted. Has there ever been anyone — anyone at all — you've trusted and who didn't betray you?"</li>
<li><em>Is there an alternative way of looking at this situation?</em> Invites perspective-taking without invalidating the client's current view. "That's one way to understand what happened. Is there another way to look at the same situation that could also be true?"</li>
<li><em>Am I confusing a habit with a fact?</em> Targets cognitive habits — beliefs that are held not because they are accurate but because they have been repeated so many times they feel true. "You've been telling yourself this for years. What if you've been practicing this belief so long it feels like a fact when it might just be a habit of thought?"</li>
<li><em>Am I thinking in all-or-nothing terms?</em> Identifies black-and-white thinking. "Is there a middle ground between 'completely safe' and 'completely dangerous'? What would that look like?"</li>
<li><em>Are my judgments based on feelings rather than facts?</em> Targets emotional reasoning — the pattern of using feelings as evidence. "You said you feel like a bad person, so you must be one. But feelings aren't facts — what would be actual evidence that a person is a bad person?"</li>
<li><em>Am I taking events out of context?</em> Examines whether the client is applying the meaning of a specific event too broadly. "That one experience is real and significant. But does it represent everything, or is it one part of a larger, more complex picture?"</li>
<li><em>Am I making conclusions without evidence?</em> Targets arbitrary inference. "How do you know that's true? What specific evidence would you need to be able to conclude that?"</li>
<li><em>Am I using extreme words? (always, never, no one, everyone)</em> Flags over-generalizations through language. Encouraging clients to replace extreme words with more qualified language — "some people," "sometimes," "in certain situations" — often reveals the inaccuracy of the original belief without additional argument.</li>
<li><em>How important is this in the long run?</em> Provides temporal perspective. Some Stuck Points lose their power when the client considers how they might view the situation in five or ten years.</li>
</ol>
<p><strong>The goal of the Challenging Questions Worksheet:</strong> The purpose is not to talk the client out of their beliefs or to "win" a debate. It is to help the client examine the evidence and logic underlying their beliefs so that they can revise those beliefs from the inside — a process that produces lasting change because the revision comes from the client's own cognitive work, not from external persuasion.</p>
<p><strong>Common therapist errors with the Challenging Questions Worksheet:</strong></p>
<ul>
<li><em>Rushing through the questions without genuine inquiry:</em> Treating the worksheet as a checklist produces superficial answers. The therapist should linger on each question, follow up on partial responses, and allow genuine reflection.</li>
<li><em>Arguing with or dismissing client responses:</em> If a client says "I can't think of any evidence against this belief," the therapist who responds with "But what about X?" is doing the challenging for the client — and will likely produce client compliance without genuine cognitive change.</li>
<li><em>Doing the challenging for the client:</em> This is the most common error and the most damaging. If the therapist is doing most of the cognitive work, the client is not building the skills to challenge future Stuck Points independently.</li>
<li><em>Moving to the "Alternative Thought" before the client has genuinely engaged with the evidence:</em> The alternative thought should emerge organically from the challenging process, not be imposed prematurely. A premature alternative thought often lacks the emotional weight of a belief the client has genuinely worked through.</li>
<li><em>Using challenging questions sarcastically or dismissively:</em> The questioning stance must be genuinely curious, warm, and collaborative. Questions asked with even a subtle edge of "of course that's not true" will trigger defensiveness and undermine the therapeutic alliance.</li>
</ul>
<p><strong>Worked clinical example — Challenging Questions Worksheet in practice:</strong></p>
<p>Stuck Point: "I should have known it was going to happen. I'm stupid for not seeing the warning signs."</p>
<p>Therapist: "Let's look at this together. What's the evidence that you should have known it was going to happen?" [Client lists several things she noticed but didn't act on.] Therapist: "So there were some signs. Were there things you didn't know at the time that you know now?" [Client begins to describe the perpetrator's deliberate grooming behavior that was not visible to her at the time.] Therapist: "So some of what you 'should have known' was information the other person was actively hiding from you. Does that change the picture at all?" [Pause.] Client: "I guess I couldn't have known what I didn't know." Therapist: "Is there an alternative thought that might be more accurate — something that takes all of this into account?"</p>
<p>This sequence illustrates the key principles: genuine curiosity, client-generated answers, building from the client's own responses, and allowing the alternative thought to emerge from the client's own process.</p>`
        },
        {
          type: 'text',
          content: `<h2>Patterns of Problematic Thinking: PTSD-Specific Clinical Examples</h2>
<p>In later sessions (typically Sessions 5–7), clients learn to identify patterns of problematic thinking — cognitive errors — that appear across multiple Stuck Points. Recognizing patterns accelerates the cognitive work and builds meta-cognitive skills the client can apply independently after treatment ends. Each pattern is particularly relevant to PTSD in specific ways, and clinicians benefit from understanding not just the definition but the characteristic ways each pattern manifests in trauma presentations.</p>
<p><strong>Jumping to conclusions</strong></p>
<p>Definition: Assuming something is true without evidence, or predicting the future with certainty despite insufficient evidence.</p>
<p>PTSD-specific examples:</p>
<ul>
<li>"She hasn't called me back, which means she's found out what happened to me and is disgusted." (A domestic violence survivor assuming her friend's silence is about her trauma history.)</li>
<li>"If I go to that neighborhood again, I will definitely be assaulted again." (A mugging survivor generalizing one event to predict certain future harm.)</li>
<li>"I could tell by the way he looked at me that he thinks I deserved it." (A sexual assault survivor interpreting a stranger's neutral expression as condemnation.)</li>
<li>"My therapist is going to think I'm making too big a deal of this." (A new therapy client predicting judgment before sharing their story.)</li>
</ul>
<p>Clinical note: In PTSD, jumping-to-conclusions thinking is often powered by hypervigilance — the nervous system's attempt to predict danger before it arrives. Clinicians should validate the protective function of this pattern while helping the client examine whether the predictions are accurate.</p>
<p><strong>Exaggerating or minimizing</strong></p>
<p>Definition: Catastrophizing negative events (making them larger than they are) or minimizing positive events (making them smaller than they are).</p>
<p>PTSD-specific examples:</p>
<ul>
<li>"I got triggered during our session today. This proves I will never get better." (Exaggerating one difficult moment to predict permanent failure.)</li>
<li>"I managed to drive past the accident scene without panicking — but that doesn't mean anything, it was just a good day." (Minimizing evidence of progress to maintain the belief "I will never recover.")</li>
<li>"My nightmares came back twice this week. I've completely relapsed." (Exaggerating symptom fluctuation, which is normal during recovery.)</li>
<li>"People said nice things about my work presentation, but they were just being polite." (A combat veteran minimizing evidence of competence to maintain the Stuck Point "I am permanently damaged.")</li>
</ul>
<p><strong>Ignoring important parts</strong></p>
<p>Definition: Focusing selectively on one aspect of a situation while ignoring other relevant information, resulting in a distorted conclusion.</p>
<p>PTSD-specific examples:</p>
<ul>
<li>"The only thing that matters about that deployment is that I wasn't able to save everyone." (A combat medic ignoring the many lives saved to focus exclusively on losses.)</li>
<li>"I froze during the assault. That's all that matters. I didn't fight back." (A sexual assault survivor ignoring the physiological freeze response to focus exclusively on her immobility as evidence of complicity or weakness.)</li>
<li>"My kids need me, I've been promoted at work, I've maintained my friendships — but none of that means anything because I still have nightmares." (A survivor ignoring substantial evidence of functioning.)</li>
</ul>
<p>Clinical note: This pattern often works in concert with the Esteem theme — selectively attending to evidence that confirms the over-accommodated Stuck Point about self-worth while systematically ignoring disconfirming evidence.</p>
<p><strong>Overgeneralizing</strong></p>
<p>Definition: Drawing broad, global conclusions from a single event or limited evidence.</p>
<p>PTSD-specific examples:</p>
<ul>
<li>"I was assaulted by a stranger in a parking garage. No public space is safe." (One assault → all public spaces are dangerous.)</li>
<li>"My marriage ended in abuse. All intimate relationships lead to harm." (One abusive relationship → all relationships are dangerous.)</li>
<li>"I made a mistake under fire that I regret. I will always make the wrong decision under pressure." (One combat decision → global incapacity for good judgment.)</li>
<li>"I couldn't protect my child during the accident. I'm a bad parent." (One event → global identity as a bad parent.)</li>
</ul>
<p><strong>Mind reading</strong></p>
<p>Definition: Assuming you know what others are thinking, typically assuming the worst, without evidence.</p>
<p>PTSD-specific examples:</p>
<ul>
<li>"Everyone at the support group can tell I'm more damaged than they are." (A PTSD group member assuming others are judging her severity.)</li>
<li>"My boss knows something is wrong with me. She's going to fire me." (A veteran with PTSD interpreting a supervisor's neutral behavior as suspicion.)</li>
<li>"When I told my partner what happened, they were disgusted even if they didn't say so." (A survivor interpreting a partner's quiet response as hidden contempt rather than empathy or emotional processing.)</li>
</ul>
<p><strong>Emotional reasoning</strong></p>
<p>Definition: Using emotional states as evidence of factual truth: "I feel X, therefore X is true."</p>
<p>PTSD-specific examples:</p>
<ul>
<li>"I feel guilty about surviving when others didn't, so I must have done something wrong." (Survivor's guilt used as evidence of actual culpability.)</li>
<li>"I feel like damaged goods, so I must be damaged goods." (Shame used as evidence of permanent worthlessness.)</li>
<li>"I feel like it was my fault, which means it was my fault." (Guilt feelings used as evidence of causation.)</li>
<li>"I feel like I'll never get better, so I probably won't." (Hopelessness used as evidence of prognosis.)</li>
</ul>
<p>Clinical note: Emotional reasoning is one of the most challenging patterns in trauma work because the emotions are real and intense — and in our culture, strong feelings are often taken as evidence. The CPT therapist helps clients distinguish between the validity of the emotion (which should be respected) and its use as evidence for factual claims (which should be examined).</p>
<p><strong>Shoulds</strong></p>
<p>Definition: Using inflexible rules — "should," "must," "have to," "ought to" — about how you, others, or the world should be, leading to guilt, shame, or anger when reality doesn't match the rule.</p>
<p>PTSD-specific examples:</p>
<ul>
<li>"I should have fought back harder." (Applying a rule — resistance equals safety — to a situation in which freeze was the physiological response and fighting back might have escalated danger.)</li>
<li>"I should be over this by now." (Applying an arbitrary timeline rule to a complex psychological process.)</li>
<li>"A good soldier should not be affected by combat. I should be able to handle this." (Applying a cultural/military ideal to a human response to extreme stress.)</li>
<li>"I should have known he was dangerous. I should have seen the signs." (Applying perfect-foresight standards retrospectively.)</li>
</ul>
<p><strong>Disqualifying the positive</strong></p>
<p>Definition: Explaining away or minimizing positive evidence so that it cannot challenge the negative belief.</p>
<p>PTSD-specific examples:</p>
<ul>
<li>"My children love me, but that's because they don't know what really happened to me." (Love explained away to preserve the Stuck Point "I am unworthy of love.")</li>
<li>"I've been promoted three times since the trauma, but anyone could do my job." (Professional success explained away to preserve "I am permanently damaged.")</li>
<li>"My therapist says I'm making good progress, but she has to say that." (Therapist feedback explained away as professional obligation.)</li>
</ul>
<p>Identifying patterns rather than individual Stuck Points accelerates the cognitive work and builds meta-cognitive skills the client can apply independently after treatment ends. When a client recognizes "Oh, I'm doing that emotional reasoning thing again," they can interrupt the cognitive process without the full Challenging Questions sequence — the goal of late-phase CPT skill-building.</p>
<p>In practice, most trauma survivors show two to four dominant patterns of problematic thinking across their Stuck Points. Identifying these dominant patterns — and teaching the client to recognize them in the moment — is one of the most durable outcomes of CPT. These meta-cognitive skills generalize beyond trauma: clients report using them to manage ordinary stressors, relationship conflicts, and future difficult life events long after treatment ends. This generalization is not a side effect of CPT — it is a core outcome, building resilience that extends well beyond PTSD symptom reduction.</p>`
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
          type: 'text',
          content: `<h2>Stuck Points Across the Five Themes: Clinical Examples</h2>
<p>The five CPT themes — Safety, Trust, Power/Control, Esteem, and Intimacy — provide a clinical map for organizing Stuck Points. Understanding the characteristic Stuck Points in each theme, including the sub-categories of self-focused and other-focused beliefs, allows for more precise clinical work. What follows is an expanded clinical guide to Stuck Points in each theme, with examples drawn from common trauma presentations.</p>
<p><strong>Theme 1: Safety</strong></p>
<p>The Safety theme addresses beliefs about personal vulnerability and the dangerousness of the world. Trauma survivors frequently develop over-accommodated safety beliefs that restrict their lives far more than is proportionate to the actual risk environment they live in.</p>
<p>Safety Stuck Points about self:</p>
<ul>
<li>"I cannot protect myself from harm." (A domestic violence survivor who successfully escaped her abuser but has generalized helplessness to all situations.)</li>
<li>"I will be attacked again. It is only a matter of time." (A mugging survivor who now avoids all public transportation despite low actual risk in her neighborhood.)</li>
<li>"I am not safe anywhere." (A combat veteran who cannot enter a grocery store without a weapon because of a generalized threat perception that extends to civilian environments.)</li>
<li>"My body is not safe. Something is always wrong with me physically." (A sexual assault survivor with somatic hypervigilance interpreting normal bodily sensations as threats.)</li>
</ul>
<p>Safety Stuck Points about others and the world:</p>
<ul>
<li>"The world is completely dangerous. Terrible things happen constantly and randomly." (Over-accommodation driven by the perceived randomness of the traumatic event.)</li>
<li>"Other people are dangerous. Anyone could be a threat." (Generalized from one perpetrator to all people.)</li>
<li>"I cannot keep my children safe." (A parent whose child was harmed, generalizing inability to prevent one specific harm to global parental incapacity.)</li>
</ul>
<p>Clinical note on Safety Stuck Points: The therapist must be careful to distinguish between over-accommodated safety beliefs (the CPT target) and accurate threat perception. A domestic violence survivor who has returned to an actively dangerous relationship does not need cognitive challenging of her safety concerns — she needs safety planning. The clinician's task is to assess actual risk before determining whether safety beliefs are over-accommodated.</p>
<p><strong>Theme 2: Trust</strong></p>
<p>The Trust theme addresses beliefs about trustworthiness — of self and others. Interpersonal traumas (betrayal, assault by trusted persons, childhood abuse) particularly affect this domain.</p>
<p>Trust Stuck Points about self:</p>
<ul>
<li>"I can't trust my own instincts. I had no idea he was dangerous." (A person betrayed by someone she trusted, generalizing failure to detect one perpetrator's deception to global judgment incapacity.)</li>
<li>"My body betrayed me during the assault. I can't trust my own reactions." (A survivor confused or ashamed by physiological responses during the trauma — arousal, freeze, dissociation.)</li>
<li>"I make bad decisions. I chose to be there. I chose to trust him." (Over-accommodation of responsibility that undermines self-trust.)</li>
</ul>
<p>Trust Stuck Points about others:</p>
<ul>
<li>"No one can ever be trusted. Everyone has a hidden agenda." (A survivor of childhood abuse by a caregiver, generalizing caregiver betrayal to universal untrustworthy otherness.)</li>
<li>"People who seem trustworthy are the most dangerous. The person I trusted most was the one who hurt me." (Inverse trust — where demonstrated trustworthiness becomes a red flag rather than a reassurance.)</li>
<li>"Men [or women, or authority figures, or family members] are inherently untrustworthy." (Group-level generalization from one perpetrator.)</li>
<li>"My family did not protect me. No one will ever protect me." (A childhood trauma survivor whose primary caregivers failed to protect her, generalizing to all potential protectors.)</li>
</ul>
<p><strong>Theme 3: Power/Control</strong></p>
<p>The Power/Control theme is distinctive in that it encompasses two opposite extreme positions: beliefs of excessive control (I should have been able to prevent this) and beliefs of total powerlessness (I have no control over anything). Both are over-accommodated positions that interfere with adaptive functioning.</p>
<p>Power Stuck Points reflecting excessive responsibility:</p>
<ul>
<li>"I should have been able to stop what happened. If I had done something different, it wouldn't have occurred." (Hindsight bias applied to a situation in which the client genuinely had limited options.)</li>
<li>"As the senior person there, it was my responsibility. Everything that happened is my fault." (A combat leader who holds himself responsible for outcomes beyond his actual control.)</li>
<li>"I could have left the relationship earlier. I chose to stay. So it's my fault." (A domestic violence survivor holding herself responsible for her abuser's actions.)</li>
</ul>
<p>Power Stuck Points reflecting powerlessness:</p>
<ul>
<li>"There is nothing I can do to protect myself. I am helpless." (Generalized learned helplessness from an event in which the client was genuinely unable to escape.)</li>
<li>"Trying to plan or prepare is pointless. Something terrible can always happen and there's nothing I can do." (A natural disaster survivor who has abandoned adaptive safety behaviors because no preparation prevented the disaster.)</li>
<li>"I have no control over my emotions. My PTSD controls me." (A survivor who has experienced panic attacks or dissociation interpreting these events as loss of all self-regulation capacity.)</li>
</ul>
<p>The therapeutic task with Power/Control Stuck Points is to help clients develop a nuanced, accurate sense of agency: where did you genuinely have influence, and where were you genuinely constrained? The "retrospective wisdom" examination — "What did you know at the moment the decision was made? What options did you actually have?" — is particularly effective here.</p>
<p><strong>Theme 4: Esteem</strong></p>
<p>The Esteem theme is often where the most painful Stuck Points live. Self-blame, shame, and over-accommodated beliefs about personal worthlessness are central features of PTSD in most trauma populations.</p>
<p>Esteem Stuck Points about self:</p>
<ul>
<li>"I am permanently damaged. I am not who I was before." (A survivor who experienced significant functional changes after trauma, generalizing real changes to permanent, total damage.)</li>
<li>"I am worthless. What happened to me proves I have no value." (A sexual assault survivor who has internalized the perpetrator's treatment of her as reflecting her actual worth.)</li>
<li>"I am weak for not being over this by now." (Comparing one's own recovery timeline to an idealized standard.)</li>
<li>"I am disgusting. What happened made me dirty/broken/used." (Sexual assault survivors, particularly, often hold profound shame-based esteem Stuck Points.)</li>
<li>"I deserved this. I must have done something to deserve what happened." (A self-blame Stuck Point that serves the secondary function of maintaining the belief that the world is fair — "bad things happen to people who deserve them.")</li>
</ul>
<p>Esteem Stuck Points about others:</p>
<ul>
<li>"People are terrible. Humanity is fundamentally evil." (A survivor of mass violence or torture generalizing from perpetrators to humanity.)</li>
<li>"Other people cannot understand what I've been through. They are superficial and unaware of real suffering." (A trauma survivor who has become isolated and has developed contempt or disconnection from people without trauma histories.)</li>
</ul>
<p><strong>Theme 5: Intimacy</strong></p>
<p>The Intimacy theme addresses capacity for closeness, vulnerability, and connection. Over-accommodated intimacy beliefs are often among the most functionally limiting, as they cut survivors off from the social support that is most protective against chronic PTSD.</p>
<p>Intimacy Stuck Points:</p>
<ul>
<li>"I will never be able to be close to anyone again. The trauma destroyed my ability to connect." (A survivor who has experienced emotional numbing and interprets this as permanent incapacity for connection.)</li>
<li>"No one could ever love me after what happened to me." (A shame-based belief that the trauma itself renders the survivor unlovable.)</li>
<li>"Being vulnerable is dangerous. Letting anyone in just gives them the chance to hurt me." (A survivor of interpersonal betrayal who has generalized the danger of intimacy from one relationship to all potential close relationships.)</li>
<li>"My family/partner is better off without me. I am a burden." (A PTSD survivor who interprets her symptoms as evidence that she diminishes rather than enriches the lives of people who love her.)</li>
<li>"Sex is now impossible for me. The trauma has taken that away permanently." (A sexual assault survivor who has experienced sexual dysfunction and generalized current difficulty to permanent incapacity.)</li>
</ul>`
        },
        {
          type: 'text',
          content: `<h2>CPT for Specific Populations</h2>
<p>CPT has been adapted and researched for a number of specific trauma populations. Understanding these adaptations allows clinicians to deliver CPT with greater precision and cultural responsiveness.</p>
<p><strong>CPT for Military and Veteran Populations</strong></p>
<p>Veterans and active-duty military represent one of the most extensively studied CPT populations. The VA/DoD Clinical Practice Guideline identifies CPT as a strongly recommended first-line treatment for military-related PTSD, and CPT is widely implemented across VA healthcare systems.</p>
<p>Military-specific considerations in CPT include:</p>
<p><em>Moral injury Stuck Points:</em> Military combat often involves morally complex situations — decisions made under fire, civilian casualties, orders followed that caused harm. Stuck Points in the veteran population frequently reflect moral injury: "I killed civilians who turned out to be non-combatants. I am a murderer." These Stuck Points require the "retrospective wisdom" examination — what did the service member know at the moment of the decision, under what constraints, with what information — as well as attention to the grief and loss dimensions that accompany moral injury beyond pure cognitive distortion.</p>
<p><em>Military identity and esteem:</em> Veterans often hold deep identifications with military values — strength, self-sufficiency, stoicism, unit cohesion — that generate specific Stuck Points about the meaning of having PTSD. "A good soldier doesn't let combat affect him" is a particularly entrenched Stuck Point in military populations that pathologizes a normal human response to extreme stress.</p>
<p><em>Betrayal trauma:</em> Military sexual trauma (MST) — sexual assault or harassment during military service — is prevalent and often accompanied by betrayal-specific Stuck Points: "The military was supposed to be my family and they failed to protect me" and "Those responsible were never held accountable, which proves I don't matter." MST survivors may need additional attention to institutional betrayal as a CPT theme not captured in the standard five.</p>
<p><em>Group format:</em> CPT in group format has been extensively studied in VA settings and demonstrates efficacy comparable to individual CPT for veterans. Groups of 6–10 veterans, typically meeting twice weekly for 6 weeks (the "massed" format) or once weekly for 12 weeks, produce significant PTSD symptom reduction. The group setting has the added benefit of normalizing trauma responses and Stuck Points through shared experience.</p>
<p><strong>CPT for Sexual Assault Survivors</strong></p>
<p>CPT was originally developed for sexual assault survivors, and this population has the strongest evidence base within the CPT literature. Sexual assault produces a characteristic constellation of Stuck Points that CPT is particularly effective in addressing.</p>
<p><em>Self-blame Stuck Points:</em> Sexual assault survivors carry disproportionate burdens of self-blame driven by cultural rape myths, social attributions of responsibility, and the need to make sense of a traumatic experience. Common self-blame Stuck Points include: "I shouldn't have been drinking," "I should have said no more clearly," "I shouldn't have gone to his apartment," "If I had fought harder it would have stopped." These Stuck Points reflect the internalization of cultural rape myths and require both cognitive challenging and — for many clients — psychoeducation about sexual coercion, consent, and perpetrator responsibility.</p>
<p><em>Shame and contamination Stuck Points:</em> Sexual assault often produces profound shame-based Stuck Points related to the body and sexual self: "I am dirty," "I am damaged goods," "No one will want to be with me after this." These Stuck Points are often held with particular rigidity and require sustained, careful work.</p>
<p><em>Trust and intimate relationship Stuck Points:</em> When the perpetrator was known to the survivor (as is the case in the majority of sexual assaults), trust Stuck Points are often severe: "The person I trusted most is the person who hurt me." These beliefs can generalize broadly and affect capacity for intimate relationships.</p>
<p><em>Secondary victimization:</em> Many sexual assault survivors have experienced invalidating, blaming, or dismissive responses from family, friends, police, or medical providers following the assault. These secondary victimization experiences generate their own Stuck Points ("No one believed me, which proves I deserved it") that require explicit clinical attention.</p>
<p><strong>CPT for Childhood Trauma Survivors</strong></p>
<p>Adult survivors of childhood sexual abuse (CSA), physical abuse, emotional abuse, or neglect present with complex PTSD presentations shaped by developmental context. CPT has been studied and adapted for this population, though the clinical work often requires additional time and flexibility.</p>
<p>Childhood trauma-specific considerations:</p>
<p><em>Developmental timing of schema formation:</em> When trauma occurs in childhood, over-accommodated beliefs are often formed before the client has developed abstract reasoning or theory of mind. "I am bad" as a childhood sexual abuse Stuck Point is not just an overgeneralization — it may have been the only way a child could make sense of abuse by a trusted caregiver. These early-formed schemas are deeply entrenched and often felt as identity rather than as beliefs.</p>
<p><em>Caregiver betrayal:</em> Abuse or neglect by primary caregivers disrupts attachment in ways that create particularly complex trust and intimacy Stuck Points. The client may have no template for safe relationships at all — the CPT therapeutic relationship itself may be one of the first trusting relationships they have experienced.</p>
<p><em>Self-blame as protective belief:</em> Children who are abused by caregivers often develop self-blame Stuck Points that originally served a protective function: "I am bad and my parent hurts me because of what I do" is more manageable than "My parent, whom I depend on for survival, is dangerous and unpredictable." Recognizing this protective origin can reduce resistance to challenging and increase compassion for the child-self who developed the belief.</p>
<p><em>Pacing:</em> CPT with childhood trauma presentations often requires additional sessions, slower pacing, and more time on the foundational phases before moving to challenging. The therapist should assess the client's current Window of Tolerance and titrate the pace of trauma-adjacent work accordingly.</p>
<p><strong>CPT in Group Format</strong></p>
<p>Group CPT follows the same 12-session protocol as individual CPT but is delivered in a group of 6–12 participants. Research demonstrates that group CPT produces outcomes equivalent to individual CPT for most participants. Groups have some unique therapeutic benefits:</p>
<ul>
<li>Normalization through shared experience: hearing that others hold similar Stuck Points reduces shame and isolation</li>
<li>Social support for between-session homework: group members can encourage and coach each other</li>
<li>Vicarious challenging: clients sometimes find it easier to identify the problems with another group member's Stuck Points before applying the same examination to their own</li>
<li>Cost-effectiveness: group format serves more clients per therapist hour</li>
</ul>
<p>Group CPT does require some adaptations: the therapist must balance time equitably across group members, pacing the challenging work so all members progress through the worksheets together. Some clients are not appropriate for group format — those with severe shame or social anxiety that would prevent engagement, or those whose trauma type (e.g., combat trauma) is so discordant from other group members that shared experience would be minimal.</p>
<p><strong>CPT via Telehealth</strong></p>
<p>CPT has been studied in telehealth formats, including fully remote video-based delivery, and demonstrates efficacy comparable to in-person delivery. Telehealth CPT expanded dramatically during the COVID-19 pandemic and is now widely practiced across VA and community settings.</p>
<p>Telehealth CPT considerations:</p>
<ul>
<li>Worksheet completion and sharing: electronic worksheets (shared via screen-sharing or secure patient portals) maintain the structure of the protocol</li>
<li>Safety planning: clinicians must have clear protocols for managing crisis situations in remote sessions, including verifying the client's location and establishing local emergency contacts</li>
<li>Privacy: clients conducting sessions from home may have limited privacy from family members — therapists should assess this explicitly and problem-solve as needed</li>
<li>Grounding for dissociation: grounding interventions may require adaptation for remote settings (e.g., cold water on hands is easy to implement at home)</li>
</ul>`
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
