import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Course as InteractiveCourse } from '../models/InteractiveCourse.js';
dotenv.config();

// ═══════════════════════════════════════════════════════════════════════════
// CR-CLI-605 — Cognitive Processing Therapy for PTSD: A Practical Guide
// 2 CE | 3 sections | NBCC ACEP #7760 | GA Integrated Therapeutic Perspectives
// Target: 13,000+ words (2 CE × 6,000 words/CE hr)
// ═══════════════════════════════════════════════════════════════════════════

const SLUG = 'cr-cli-605-cognitive-processing-therapy';

const COURSE = {
  title: 'Cognitive Processing Therapy for PTSD: A Practical Guide',
  slug: SLUG,
  courseCode: 'CR-CLI-605',
  subtitle: 'From Stuck Points to Adaptive Beliefs — A Session-by-Session Approach',
  description: 'A 2-hour intermediate continuing-education course equipping licensed mental health professionals with a thorough, evidence-grounded understanding of Cognitive Processing Therapy (CPT) for PTSD. Covers Resick\'s cognitive model of PTSD, assimilation versus over-accommodation, the identification and challenging of stuck points, the CPT session structure, CPT-C adaptations, and session-by-session worksheets. Section two addresses the five stuck-point themes, the ABC and Challenging Questions worksheets, Patterns of Problematic Thinking, adaptations for complex trauma, military and veteran populations, and group CPT, as well as the ethics of treatment fidelity and scope of practice.',
  ceHours: 2, ceuHours: 2, credits: 2, ceuEligible: true,
  category: 'clinical', ceCategory: 'Clinical', contentArea: 'Counseling Theory/Practice and the Counseling Relationship',
  level: 'Intermediate', difficulty: 'intermediate', deliveryMethod: 'Asynchronous Online',
  approvingBody: 'NBCC', approvalNumber: '7760', acepNumber: '7760',
  provider: { name: 'GA Integrated Therapeutic Perspectives LLC', shortName: 'GAITP LLC', acepNumber: '7760', approvalBody: 'NBCC' },
  approvals: [{ body: 'NBCC', number: '#7760', providerNumber: '7760', providerName: 'GA Integrated Therapeutic Perspectives LLC', status: 'approved', hourBreakdown: [{ label: 'core', hours: 2 }], deliveryFormat: 'asynchronous' }],
  nbccContentAreas: ['Counseling Theory/Practice'],
  presenter: { name: 'Kejuiana Johnson', credentials: 'MA, LPC, NCC, CPCS, BC-TMH', degree: 'MA', licenseNumber: 'LPC009587', licenseState: 'Georgia', licenseType: 'LPC', qualificationStatement: 'Kejuiana Johnson, MA, LPC, NCC, CPCS, BC-TMH, is a licensed professional counselor and approved clinical supervisor in Georgia with expertise in trauma-informed clinical practice, cognitive behavioral approaches, and counselor education.' },
  instructor: 'GA Integrated Therapeutic Perspectives LLC',
  author: 'Kejuiana Johnson, MA, LPC, NCC, CPCS, BC-TMH',
  accessType: 'subscription', price: 39.99, pricingTier: 'standard',
  status: 'draft', isPublished: false, isActive: true,
  attestationRequired: true, certificateEnabled: true,
  passingScore: 80, maxAttempts: 3,
  settings: { passingScore: 80, certificateEnabled: true, requireEvaluation: true, requireAttestation: true },
  targetAudience: 'Licensed mental health professionals (LPCs, LCSWs, LMFTs, NCCs)',
  tags: ['CPT', 'PTSD', 'trauma', 'cognitive processing therapy', 'stuck points', 'evidence-based', 'clinical'],
  objectives: [
    'Explain Resick\'s cognitive model of PTSD, including the roles of assimilation and over-accommodation in maintaining post-traumatic symptoms.',
    'Identify the four phases of CPT treatment and describe the clinical function of each phase.',
    'Define stuck points and explain how they are identified, externalized, and systematically challenged using CPT worksheets.',
    'Describe the five stuck-point themes in CPT (safety, trust, power/control, esteem, and intimacy) and recognize how each manifests in client language and behavior.',
    'Articulate evidence-based adaptations of CPT for complex trauma, military and veteran populations, and group format, and identify the ethical obligations related to treatment fidelity and scope of practice.',
  ],

  sections: [
    // ═══════════════════════════════════════════════════════════════════════
    // SECTION 0 — INTRODUCTION
    // ═══════════════════════════════════════════════════════════════════════
    {
      title: 'Introduction and Course Overview',
      order: 1,
      contentBlocks: [
        {
          type: 'sectionDivider', sectionNumber: '0',
          title: 'Introduction and Course Overview',
          subtitle: 'What CPT is, who it is for, and how this course is organized',
          order: 1,
        },
        {
          type: 'text', order: 2,
          content: `<h2>Welcome to Cognitive Processing Therapy for PTSD: A Practical Guide</h2>
<p>Post-traumatic stress disorder affects millions of adults in the United States, yet a significant proportion of those affected never receive a treatment with strong empirical support. Among the most extensively validated approaches for PTSD is Cognitive Processing Therapy, almost universally abbreviated CPT. Developed in the late 1980s by Patricia Resick and her colleagues, originally for survivors of sexual assault, CPT has since been studied across an extraordinarily wide range of populations and trauma types, including combat veterans, refugees, survivors of childhood abuse, survivors of natural disasters, and individuals with co-occurring depression and substance use disorders. Its evidence base now spans hundreds of randomized controlled trials, dissemination studies, and implementation science investigations, and it is endorsed as a first-line treatment for PTSD by the Department of Veterans Affairs and Department of Defense Clinical Practice Guidelines, the American Psychological Association, and the International Society for Traumatic Stress Studies.</p>
<p>Despite this reach, CPT is frequently mischaracterized in practice. Clinicians sometimes conflate it with generic cognitive behavioral therapy, assume that it always requires a written trauma account, confuse its structured worksheets with rigid scripting, or misunderstand the central role of stuck points, CPT's term for unhelpful cognitions that maintain PTSD symptoms. This course exists to replace those mischaracterizations with an accurate, clinically nuanced account of how CPT actually works and how its components are actually delivered.</p>
<p>The course is designed for licensed mental health professionals who are familiar with the fundamentals of trauma-related disorders and cognitive behavioral principles but who have not received formal CPT training. Two important caveats follow from that design. First, this course is didactic and conceptual; it provides the foundational knowledge base needed to understand CPT, evaluate referrals, and make an informed decision about whether to pursue formal training. It is not a substitute for that training. Delivering CPT with competence requires supervised practice with actual clients, feedback from an experienced trainer or consultant, and the kind of procedural fluency that only repeated application can build. Completing this course does not qualify you to deliver CPT as a manualized protocol. Second, CPT has been studied with sufficient rigor that specific procedural variations, such as omitting worksheets, skipping phases, or blending CPT elements with incompatible techniques, can reduce its effectiveness. Part of what this course teaches is why fidelity matters and what the ethics of protocol adherence look like in practice.</p>
<h3>How This Course Is Organized</h3>
<p>The course is divided into three sections. This introductory section orients you to CPT's place in the trauma treatment landscape and the structure of what follows. The first content section addresses the theoretical foundations of CPT: Resick's cognitive model of PTSD, the distinction between natural recovery and PTSD maintenance, the roles of assimilation and over-accommodation, the concept of stuck points, and the four-phase structure of CPT treatment including the CPT-C variant. The second content section addresses session-by-session practice: the ABC Worksheet, the Challenging Questions Worksheet, Patterns of Problematic Thinking, the five stuck-point themes, and adaptations of CPT for complex trauma, military and veteran populations, and group delivery. Each content section includes interactive activities, knowledge checks, and a reflection prompt to consolidate learning. A graded assessment follows Section 2.</p>
<h3>Learning Objectives</h3>
<p>After completing this course, you will be able to: explain Resick's cognitive model of PTSD, including the roles of assimilation and over-accommodation in maintaining post-traumatic symptoms; identify the four phases of CPT treatment and describe the clinical function of each phase; define stuck points and explain how they are identified, externalized, and systematically challenged using CPT worksheets; describe the five stuck-point themes in CPT and recognize how each manifests in client language and behavior; and articulate evidence-based adaptations of CPT for complex trauma, military and veteran populations, and group format, while identifying the ethical obligations related to treatment fidelity and scope of practice.</p>
<h3>A Note on Terminology</h3>
<p>CPT uses a precise vocabulary. The term <em>stuck point</em> refers specifically to a maladaptive belief maintained by assimilation or over-accommodation that interferes with natural emotional processing and blocks recovery. Stuck points are not the same as distorted thoughts, automatic thoughts, or core beliefs in the sense those terms carry in standard CBT, although the concepts overlap. Similarly, the term <em>trauma account</em> (sometimes called the impact statement or written account) has a specific meaning within the CPT protocol that differs from generic trauma narration. The course defines each term carefully as it is introduced and revisits them in the interactive activities so that you leave with genuine precision rather than approximate familiarity.</p>`,
        },
        {
          type: 'videoEmbed', order: 3,
          title: 'Overview: The CPT Approach to PTSD',
          videoUrl: 'https://www.youtube.com/embed/PLACEHOLDER',
          content: 'A brief orientation to Cognitive Processing Therapy, its origins, and its place among first-line PTSD treatments. (Video placeholder — narration to be added.)',
        },
        {
          type: 'imageText', order: 4,
          content: `<p>CPT is sometimes summarized as "helping clients challenge trauma-related thoughts," but this framing, while not wrong, understates the precision of the approach. CPT is a structured, manualized, time-limited protocol. The standard protocol runs 12 sessions. It proceeds in a defined sequence. Its worksheets are not optional enrichment activities but core therapeutic tools whose function is grounded in the underlying cognitive model. Understanding why CPT is built the way it is, why the worksheets appear in the order they do, why stuck points must be identified before they can be challenged, and why the five themes are addressed last rather than first, requires understanding the model that gives the structure its logic. That model is the subject of the first content section.</p>
<p>One more note before we begin: CPT was developed in and remains most extensively studied for PTSD as defined by the DSM. The course uses DSM-5-TR diagnostic language throughout. Clinicians who practice in jurisdictions or settings that use ICD coding should note that the DSM-5-TR criteria for PTSD (309.81) correspond to ICD-11 complex PTSD (6B41) in some but not all presentations, and that CPT's evidence base for ICD-11 complex PTSD specifically is an active area of ongoing research. We address this nuance in the second content section under adaptations for complex trauma.</p>`,
          image: '',
          imageAlt: 'Diagram showing CPT as a structured, sequenced 12-session protocol with defined phases and worksheets',
          imagePosition: 'right',
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════
    // SECTION 1 — CE HOUR 1: COGNITIVE MODEL, ASSIMILATION/OVER-ACCOMMODATION, STUCK POINTS, PHASES
    // ═══════════════════════════════════════════════════════════════════════
    {
      title: 'CPT Foundations: The Cognitive Model, Stuck Points, and Treatment Phases',
      order: 2,
      contentBlocks: [
        {
          type: 'sectionDivider', sectionNumber: '1',
          title: 'CPT Foundations: The Cognitive Model, Stuck Points, and Treatment Phases',
          subtitle: 'Resick\'s cognitive model of PTSD, assimilation vs. over-accommodation, and how CPT is structured',
          order: 1,
        },
        {
          type: 'text', order: 2,
          content: `<h2>Resick's Cognitive Model of PTSD: Why Some People Recover and Others Don't</h2>
<p>The starting point for understanding CPT is a question that Resick and her colleagues placed at the center of their early theoretical work: why do some trauma survivors recover naturally while others develop persistent PTSD? This is not merely an academic question. It shapes everything that follows, because if you understand what maintains PTSD, you can design an intervention that targets those maintenance mechanisms directly. That is precisely what CPT does.</p>
<p>Resick drew on information-processing theories of emotion and memory, particularly the work of Lang, Foa, and others in the emotional processing tradition, but she added a distinctly cognitive layer that set CPT apart from exposure-focused approaches. In her account, the human mind continuously works to integrate new experiences with pre-existing schemas, that is, with organized structures of knowledge and belief about the self, the world, and other people. When an experience fits relatively smoothly into existing schemas, it is processed and archived without significant disturbance. When an experience conflicts sharply with pre-existing schemas, a conflict arises between what the person believed and what has now happened. That conflict generates strong emotion, which is the mind's signal that something requires attention and resolution.</p>
<p>Under ordinary circumstances, people resolve this conflict through what Resick calls <em>natural recovery</em>: they oscillate between approaching the disturbing material, thinking about it, talking about it, feeling the emotions it generates, and pulling back from it when the emotional load becomes too heavy. Over weeks and months, this oscillation gradually allows the disturbing experience to be integrated, meaning that it finds a place in the person's understanding of the world without requiring either the denial of the experience or the abandonment of all prior beliefs. The emotions associated with the event reduce in intensity, intrusive recollections become less frequent, and the person is able to think about the event without being overwhelmed by it. This is natural recovery, and it is what most trauma survivors experience, quietly and without clinical intervention, in the months after a traumatic event.</p>
<p>PTSD, in Resick's model, is what happens when natural recovery is blocked. Two mechanisms do most of the blocking: assimilation and over-accommodation.</p>
<h3>Assimilation: Distorting the Event to Preserve the Schema</h3>
<p>Assimilation occurs when a person resolves the conflict between the traumatic event and their prior schemas by modifying their interpretation of the event to fit what they already believed, rather than updating their beliefs to accommodate what happened. A common example involves self-blame. Consider a person whose pre-existing schema includes the belief that the world is predictable and that careful behavior prevents harm. When something harmful happens despite their carefulness, the conflict between this belief and the event is acute. One way to resolve the conflict is to reinterpret the event: <em>It happened because I wasn't careful enough. If I had done something differently, it wouldn't have happened.</em> This re-interpretation preserves the schema (the world is predictable; careful behavior prevents harm) at the cost of distorting the event (assigning blame to the self that is not warranted by the actual circumstances).</p>
<p>Assimilation is the mechanism behind the self-blaming, self-doubting cognitions that clinicians so frequently encounter in trauma survivors. It is not irrational; it is a coherent strategy for maintaining a prior worldview that provides comfort and structure. But it comes at a steep price. When a person holds an assimilated stuck point, such as "I caused this to happen," the emotional processing of the event cannot be completed, because the version of the event being processed is distorted. The emotions are not fully experienced, because the event is being managed rather than felt. And because the processing loop never closes, intrusions and hyperarousal persist.</p>
<h3>Over-Accommodation: Distorting the Schema to Avoid the Event</h3>
<p>Over-accommodation is the mirror-image mechanism. Rather than distorting the event to preserve prior beliefs, the person distorts their beliefs, radically and globally, to incorporate one piece of traumatic evidence. Where assimilation produces "it happened because I am to blame," over-accommodation produces "now I know that the world is entirely dangerous, that no one can be trusted, that I am permanently damaged, and that nothing will ever be safe again." These are not updated beliefs; they are catastrophized generalizations that draw sweeping conclusions from a single experience.</p>
<p>Over-accommodated beliefs are recognizable in clinical practice by their absolutism and their sweeping scope. Where a person might say after a car accident, "I know that driving carries risk; I will be more careful," an over-accommodated belief says, "I know that I can be killed at any moment and that driving, or leaving the house, or being in the world is too dangerous." The traumatic event has been given an interpretive power far beyond what is warranted. And just as with assimilation, the result is a block on natural recovery: the stuck point generates persistent negative emotion (pervasive fear, shame, grief) and behavioral avoidance that prevents the updating that could actually resolve the conflict.</p>
<h3>Stuck Points: The Clinical Heart of CPT</h3>
<p>Resick uses the term <em>stuck point</em> as the clinical label for beliefs maintained by either assimilation or over-accommodation that block natural recovery and maintain PTSD. Stuck points are always expressed as statements, not as questions or descriptions of events. They are written in first person, present tense. They represent what the client currently believes, not what they report feeling or what they remember. Examples include: "It was my fault"; "I should have known"; "No one can be trusted"; "I am permanently broken"; "The world is completely dangerous"; "If I had fought harder, it would not have happened."</p>
<p>The identification and externalization of stuck points is the engine of CPT. The rationale is straightforward: a belief cannot be challenged until it is made explicit. Many trauma survivors carry stuck points that have never been articulated as statements; they manifest as diffuse shame, persistent fear, or chronic self-criticism without the survivor having consciously identified the underlying proposition. One of CPT's first clinical tasks is helping the client put the stuck point on paper, in their own words, as a concrete sentence that can subsequently be examined, questioned, and revised.</p>
<p>A crucial clinical distinction that CPT makes is between <em>stuck points</em> and what CPT calls <em>hot spots</em> in the trauma memory itself. A hot spot is a moment in the trauma narrative where emotional processing is particularly intense, a moment the client avoids, skips over, or reports as especially disturbing. Hot spots are not the same as stuck points. Hot spots are affective; stuck points are cognitive. Both are relevant to CPT treatment, but they call for different clinical responses, a distinction explored further below and in the callout block that follows.</p>
<p>CPT's cognitive model also specifies the <em>types of emotion</em> that arise from the two mechanisms. Resick distinguishes between what she calls <em>natural emotions</em>, the emotional responses that arise directly and appropriately from the traumatic event itself, and <em>manufactured emotions</em>, the secondary emotions generated by stuck points. Natural emotions include grief, fear, and anger that are directly connected to what happened. Manufactured emotions include guilt, shame, and unwarranted fear that arise not from the event but from the stuck-point interpretation of it. CPT aims to allow the natural emotions to be fully experienced and processed while challenging the manufactured emotions by targeting the stuck points that produce them. This distinction has practical clinical implications: a client who cries when recounting their loss is experiencing natural emotion, which the therapist honors rather than challenges. A client who floods with shame because of an assimilated stuck point ("It happened because I am worthless") is experiencing a manufactured emotion that points directly to a cognition that CPT can address.</p>`,
        },
        {
          type: 'callout', order: 3,
          calloutType: 'clinical',
          title: 'Stuck Points vs. Hot Spots: The Clinical Distinction CPT Practitioners Must Internalize',
          content: `<p>One of the most common errors made by clinicians new to CPT is conflating <strong>stuck points</strong> with <strong>hot spots</strong>. These are distinct clinical phenomena requiring different responses, and mixing them up can disrupt the therapeutic process.</p>
<p><strong>Stuck points</strong> are maladaptive <em>cognitions</em> — specific, articulable beliefs maintained by assimilation or over-accommodation that block natural emotional recovery. They are statements: "It was my fault." "I should have known." "I am permanently damaged." They are the direct targets of the Challenging Questions Worksheet and the Patterns of Problematic Thinking exercise. When a client identifies a stuck point, the therapist's response is Socratic questioning, not reassurance and not exposure.</p>
<p><strong>Hot spots</strong> are <em>affective nodes</em> in the trauma memory — moments during the written account or verbal narration where emotional processing is most intense, where the client goes quiet, reports numbness or flooding, or skips detail. Hot spots signal that natural emotion is present and partially blocked. They are addressed through the written account (in standard CPT) or, in CPT-C, through verbal processing that allows the emotion to move rather than stall. When a client encounters a hot spot, the therapist's response is to slow down, stay present, and facilitate the emotional processing rather than to redirect to cognitive challenging.</p>
<p><strong>The clinical rule:</strong> When a client expresses strong emotion, ask yourself: is this emotion generated by the event itself (hot spot / natural emotion) or by a belief about the event (stuck point / manufactured emotion)? If the former, facilitate processing. If the latter, work toward identifying and ultimately challenging the underlying stuck point. CPT's structure provides worksheets and questioning strategies for the cognitive work; the emotional work requires the therapist's relational presence and pacing skill.</p>`,
        },
        {
          type: 'text', order: 4,
          content: `<h2>Why CPT Does NOT Require a Trauma Narrative — and When to Use the Written Account Anyway</h2>
<p>One of the most practically significant developments in CPT's evolution was the development and validation of CPT-C, the version of the protocol that omits the written trauma account. This development deserves extended attention, because misunderstanding it leads to clinical errors in both directions: either clinicians insist that all clients must write the account (which the research does not require) or they conclude that CPT-C means the trauma is never directly addressed (which is also wrong).</p>
<p>In the original CPT protocol, clients write a detailed narrative of their traumatic event, typically between sessions four and five. The account describes what happened, what the client thought and felt, how the experience affected their beliefs about the self, the world, and other people, and why they believe the trauma occurred. The account is then read aloud in session, and the therapist uses the content to identify stuck points embedded in the narrative. The rationale for this procedure draws on emotional processing theory: repeated engagement with the trauma memory in a safe context, without avoidance, allows the conditioned emotional response to habituate and the memory to become less intrusive.</p>
<p>Research comparing standard CPT (with written account) and CPT-C (without written account) has consistently found that both produce equivalent outcomes for PTSD symptom reduction in most populations. This finding was initially counterintuitive to many clinicians, because the written account seemed like the most intuitively powerful component of treatment. The data suggest, however, that the cognitive work of identifying and challenging stuck points is the active ingredient whose presence or absence most consistently predicts outcome — and that cognitive change can occur without the formal written account when stuck points are effectively identified and challenged through other means.</p>
<p>CPT-C proceeds by substituting verbal discussion and Socratic questioning about the trauma for the formal written account. Clients still engage with the traumatic material; they still identify the thoughts and beliefs that arose from it; they still work through the stuck points systematically. The difference is that this engagement occurs in conversation rather than in writing, which makes CPT-C more accessible for clients with literacy challenges, those for whom writing is a significant avoidance trigger, and those in settings where homework completion is unreliable.</p>
<p>When, then, should a clinician choose standard CPT over CPT-C? Clinical judgment should guide this decision, and formal CPT training provides the experience needed to make it reliably. Some considerations that point toward including the written account: clients who present with highly fragmented, non-narrative trauma memories that appear to be contributing to their intrusive symptoms; clients for whom the act of writing itself has therapeutic value as an externalizing, organizing activity; clients who have strong literacy and writing comfort, where the written account does not serve as an avoidance; and clients who request the opportunity to write about the experience. Considerations pointing toward CPT-C: limited literacy or writing fluency; language barriers; significant written-account-specific avoidance; and time-limited settings where session efficiency is critical. The key is that the choice should be clinically driven and made within the context of a thorough assessment, not defaulted to as a matter of convenience.</p>
<h2>The Four Phases of CPT Treatment</h2>
<p>CPT, whether delivered in its standard 12-session form or the CPT-C variant, proceeds through four recognizable phases. These phases are not rigidly sequential in the sense that they each end before the next begins; there is overlap and recycling, particularly in the middle phases. But they reflect the logical arc of the treatment and help clinicians track where they are in the process and what the current clinical priority is.</p>
<p><strong>Phase 1: Assessment and Education (Sessions 1–2).</strong> The first phase of CPT serves two clinical functions: establishing a shared understanding of PTSD and introducing the cognitive model. The therapist administers the PCL-5 (PTSD Checklist for DSM-5) or another validated PTSD measure, reviews diagnostic criteria, and provides psychoeducation about the cognitive model: what stuck points are, how assimilation and over-accommodation maintain PTSD, and what the treatment will involve. Clients are introduced to the idea that their current distress is maintained by beliefs that can be examined and changed, not by permanent damage to themselves or their mind. The first homework assignment asks the client to write an <em>impact statement</em>: a brief narrative addressing why they believe the trauma occurred and how it has affected their beliefs about themselves, others, and the world. The impact statement is not the same as the trauma account; it focuses on meaning and belief, not on what happened. It is the first tool for identifying stuck points.</p>
<p><strong>Phase 2: Stuck Point Identification (Sessions 3–4).</strong> In the second phase, the therapist and client review the impact statement together, identifying and labeling specific stuck points. The stuck point log, a running list maintained by both therapist and client throughout treatment, is introduced at this point. Clients begin to practice noticing their own stuck points between sessions, adding to the log as new ones become apparent. The therapist introduces the ABC Worksheet, which teaches clients to connect activating events, their beliefs about those events, and the consequences of those beliefs, a tool that makes the stuck-point identification process more concrete and repeatable as a between-session skill. In standard CPT, the written trauma account is also assigned as homework in session 3 and processed in session 4, with the therapist reading it aloud in session and using its content to anchor the stuck point identification process.</p>
<p><strong>Phase 3: Pattern Challenging (Sessions 5–11).</strong> The third and longest phase of CPT is devoted to systematically challenging stuck points using increasingly sophisticated worksheet-based tools. The Challenging Questions Worksheet, introduced in session 5, teaches clients to examine a specific stuck point from multiple analytical angles: asking what evidence supports the belief, what evidence contradicts it, whether the belief rests on habit rather than fact, whether they are attending only to evidence that confirms the stuck point, and what a friend who cared about them would say. The Patterns of Problematic Thinking exercise, introduced mid-protocol, helps clients recognize recurring cognitive patterns, such as jumping to conclusions, mind reading, emotional reasoning, or self-blame, that are producing and maintaining stuck points across multiple belief domains. Sessions in this phase progressively address the five stuck-point themes, safety, trust, power and control, esteem, and intimacy, each paired with specific worksheets and Socratic dialogue.</p>
<p><strong>Phase 4: Consolidation and Relapse Prevention (Session 12).</strong> The final session of CPT serves several functions: reviewing progress, consolidating gains, addressing remaining stuck points or partially changed beliefs, and preparing the client for ongoing maintenance of the cognitive skills they have developed. The client writes a second impact statement, which serves as a direct measure of cognitive change by comparison with the first; differences between the two documents reflect the shift in beliefs that CPT has produced. The therapist helps the client develop a relapse-prevention plan identifying early warning signs of returning PTSD symptoms, strategies for applying the challenging skills they have learned, and an understanding of when and how to seek additional support. Final PCL-5 scoring provides a quantitative marker of symptom change.</p>`,
        },
        {
          type: 'accordion', order: 5,
          accordionItems: [
            {
              title: 'What Makes a Belief a "Stuck Point" Rather Than Just a Negative Thought?',
              content: `<p>In CPT, not every negative thought qualifies as a stuck point. Stuck points have specific features that distinguish them from ordinary distress, sadness, or situational worry. A stuck point is a <strong>belief about self, others, or the world</strong> that is maintained by either assimilation or over-accommodation of a traumatic event. It is stated as a declarative proposition in the present tense ("The world is not safe"; "I cannot trust anyone"; "It was my fault") rather than as a description of what happened or a question. It is durable — not situationally triggered and fleeting, but a persistent interpretive lens the client applies broadly. And it is <strong>blocking natural emotional recovery</strong>: the belief generates manufactured emotion (shame, guilt, chronic fear) that prevents the natural emotions associated with the trauma from being fully processed and integrated. When clinicians learn to distinguish stuck points from narrative description, emotional expressions, and temporary reactions, they become much more efficient at identifying the targets that CPT's worksheets are designed to address.</p>`,
            },
            {
              title: 'The Impact Statement: More Than an Assignment',
              content: `<p>The impact statement assigned after session 1 is frequently underutilized by clinicians new to CPT. Its purpose is not narrative; the client is not asked to describe what happened. The assignment is: <em>Write about why you believe this traumatic event occurred and how it has affected your beliefs about yourself, others, and the world.</em> That framing is deliberate. It bypasses the factual account and goes straight to meaning and belief, which is where stuck points live. A strong impact statement reads almost like a confession of worldview: "I think it happened because I was stupid enough to be in the wrong place. I now know that people cannot be trusted and that I am fundamentally unsafe wherever I go." Every clause in that sentence is a potential stuck point. The impact statement is essentially a first map of the client's stuck-point landscape, and a skilled CPT therapist reads it with that function in mind — not as a text to sympathize with, but as a document to mine for beliefs that will become treatment targets.</p>`,
            },
            {
              title: 'The Stuck Point Log: Maintaining a Living Inventory of Treatment Targets',
              content: `<p>The stuck point log is a running written list, maintained collaboratively by therapist and client across all twelve sessions, of every stuck point that has been identified. It serves multiple functions. First, it externalizes: putting a belief on paper and giving it a formal label as a "stuck point" shifts the client's relationship to it from <em>this is the truth about me</em> to <em>this is a belief I am examining</em>. That shift is subtle but psychologically significant. Second, it tracks progress: as beliefs are challenged and begin to shift, the therapist and client revisit the log and note which stuck points have been substantially challenged, which remain active, and which new ones have emerged. Third, it structures the trajectory of treatment: the log is the ongoing agenda for the pattern-challenging phase, ensuring that the middle sessions remain systematically targeted rather than drifting into open-ended processing. A log with ten to twenty entries across the course of treatment is entirely normal; clients often discover that many surface cognitions are expressions of a smaller number of core stuck points.</p>`,
            },
            {
              title: 'CPT vs. Prolonged Exposure: When to Recommend Which',
              content: `<p>CPT and Prolonged Exposure (PE) are the two most extensively validated individual psychotherapies for PTSD, and clinicians who understand both are better positioned to make individualized referral decisions. Both are endorsed as first-line treatments in the VA/DoD Clinical Practice Guidelines. The key clinical distinction is that CPT targets the cognitive beliefs generated by the trauma, while PE targets the conditioned fear response through systematic in-vivo and imaginal exposure. In practice, this means CPT tends to be particularly well-suited when the primary presenting features are guilt, shame, and self-blame (assimilation-dominant presentations), when the client presents with strong beliefs about having caused the trauma, when there are multiple trauma types or complex developmental trauma histories, or when the client has significant avoidance of thinking about the trauma that makes in-session imaginal exposure difficult to conduct safely. PE tends to be particularly effective when the primary presenting features are conditioned fear and avoidance of specific stimuli, when the trauma memory is relatively contained and narratively accessible, and when the client is able to tolerate graduated exposure with adequate therapist support. Both treatments can be effective for a wide range of clients, and many clinicians choose between them based on the client's presenting conceptualization, the client's preference, and the clinician's training and supervision context.</p>`,
            },
            {
              title: 'What "Manualized" Means — and Why It Matters for CPT',
              content: `<p>CPT is a <em>manualized</em> protocol, meaning it follows a detailed treatment manual that specifies the content of each session, the sequence in which worksheets are introduced, and the clinical targets at each phase. This is sometimes misunderstood as meaning CPT is scripted or inflexible. It is neither. A manualized protocol specifies what is addressed and in what sequence; it does not specify the exact words the therapist uses or override clinical judgment in responding to in-session crises, safety concerns, or unexpected developments. The manual exists because the sequence matters: the Challenging Questions Worksheet cannot be effectively used until stuck points are clearly identified; the Patterns of Problematic Thinking exercise cannot be effectively used until clients have practice with the Challenging Questions frame; the five-theme worksheets build on both. Fidelity to this sequence is not rigidity; it is the responsible implementation of a treatment whose evidence base was generated by following the sequence. When clinicians diverge from the sequence significantly, particularly by skipping the identification phase and moving prematurely to pattern challenging, outcomes typically suffer. The manual is a scaffold, not a cage.</p>`,
            },
          ],
        },
        {
          type: 'imageText', order: 6,
          content: `<p>CPT's structured sequence of worksheets is often depicted as a ladder: each tool introduces a skill that is presupposed by the next. The ABC Worksheet teaches clients to identify the connection between activating events, beliefs, and consequences — establishing the habit of treating beliefs as objects to be examined rather than facts to be accepted. The Challenging Questions Worksheet applies this habit to specific stuck points, subjecting each to systematic evidential scrutiny. The Patterns of Problematic Thinking exercise lifts the analysis from individual stuck points to recurring cognitive patterns, helping clients recognize the same mechanisms operating across different content areas. The five-theme worksheets then address the specific belief domains, safety, trust, power/control, esteem, and intimacy, in which PTSD's cognitive effects are most commonly concentrated. Moving through the ladder in sequence is not a bureaucratic formality; it is the implementation of the model's logic. Clients who arrive at the five-theme worksheets having internalized the earlier tools are equipped to do genuine cognitive work with them. Clients who receive the five-theme worksheets without having built the earlier skills often produce rote responses rather than genuine belief examination.</p>
<p>This point has direct implications for the way CPT training is structured. EMDR, PE, and CPT are all manualized protocols, and all three organizations that govern their training (EMDRIA, the Edna Foa PE team at Penn, and the CPT developers and trainers certified through the CPT Institute) require that trainees complete a supervised application component, not merely a didactic one. The manualized structure of these approaches does not substitute for supervision; it provides the framework within which supervision can address the gap between knowing the steps and being able to execute them with clinical skill. Continuing education courses like this one serve the didactic preparation function. Supervised practice fills in the rest.</p>`,
          image: '',
          imageAlt: 'Graphic showing CPT worksheets as sequential skill-building tools: ABC → Challenging Questions → Patterns of Problematic Thinking → Five-Theme Worksheets',
          imagePosition: 'left',
        },
        {
          type: 'multipleChoice', order: 7,
          question: 'According to Resick\'s cognitive model of PTSD, what is the primary difference between assimilation and over-accommodation?',
          options: [
            { text: 'Assimilation distorts the traumatic event to preserve prior schemas, while over-accommodation distorts prior schemas based on the traumatic event', isCorrect: true },
            { text: 'Assimilation refers to the avoidance of trauma memories, while over-accommodation refers to re-experiencing symptoms', isCorrect: false },
            { text: 'Assimilation produces over-generalized fear responses, while over-accommodation produces self-blame', isCorrect: false },
            { text: 'Assimilation and over-accommodation are two names for the same cognitive mechanism', isCorrect: false },
          ],
          explanation: 'In Resick\'s model, assimilation means modifying one\'s interpretation of the traumatic event to fit pre-existing schemas (preserving the schema, distorting the event — e.g., self-blame). Over-accommodation means radically revising one\'s schemas based on the event (distorting the schema, sweeping generalizations — e.g., "no one can ever be trusted").',
        },
        {
          type: 'text', order: 8,
          content: `<h2>The Written Trauma Account in CPT: Clinical Protocol and Therapeutic Function</h2>
<p>Although CPT-C (without the written account) is now the more commonly delivered variant in many settings, understanding the full protocol's use of the written account is important for any clinician working in this space. The written trauma account is not a freeform narrative; it is a structured writing assignment with a specific clinical purpose. Clients are asked to write in detail about the traumatic event, including what they saw, heard, felt physically, thought, and experienced emotionally. They are specifically asked to include any aspects of the event that are most disturbing and most avoided. They read the account aloud in session while the therapist listens, notes emotional responses, and identifies stuck points embedded in the narrative.</p>
<p>The therapeutic function of this procedure is dual. From an emotional processing standpoint, the repeated engagement with the traumatic memory in a safe relational context allows the conditioned emotional response to diminish over time. From a cognitive standpoint, the act of writing the account often brings implicit stuck points to the surface: the client who writes "and then I thought, why didn't I fight back?" is expressing an assimilation stuck point ("I should have fought back, and if I had, it wouldn't have happened") that can now be explicitly identified, logged, and subsequently challenged. The written account is particularly valuable when the trauma memory is fragmented, disorganized, or experienced in disconnected sensory flashes, because the act of sequential narrative construction itself has an organizing function.</p>
<p>A frequently raised clinical concern about the written account is that it may be too activating for certain clients, particularly those with significant emotion dysregulation, active suicidal ideation, or co-occurring conditions that reduce distress tolerance. The CPT literature addresses this concern in several ways. First, thorough assessment before beginning the account assignment allows the therapist to evaluate the client's current functioning, support system, and safety. Second, the preparation phase of CPT, which includes psychoeducation about the cognitive model and practice with the ABC Worksheet, is designed to give clients cognitive tools before they encounter the most activating material. Third, the option of CPT-C exists precisely for situations where the written account is contraindicated or where equivalent cognitive work can be accomplished verbally. The decision to include or omit the written account should be made collaboratively with the client, in the context of a thorough clinical assessment, and ideally within a CPT training and consultation context where the therapist has supervision available.</p>
<p>What the literature does not support is omitting the written account simply because it seems difficult or because the client expresses reluctance. Some degree of approach-oriented engagement with the traumatic material is part of what makes CPT effective; avoidance is the mechanism that maintains PTSD in the first place. The therapist's clinical task is to titrate the engagement appropriately, not to avoid it altogether. A client who is highly avoidant of writing about the trauma may benefit from gradual exposure to the writing process as part of the early sessions, building tolerance in small steps before the full account assignment. A client who reports genuine incapacity for the task despite adequate preparation may be a candidate for CPT-C, with ongoing monitoring of whether the verbal processing is producing comparable cognitive and symptomatic change.</p>
<p>One final point about the account: clients sometimes ask whether they must share every detail of what happened with the therapist. The answer is no. The account is written by the client for the client's own processing; the therapist's role during the reading is to be present, to observe, and to identify stuck points, not to be informed of every factual detail. Some clients choose to write in general terms about events they feel unable to narrate in detail, and CPT can proceed effectively with such an account. The level of factual specificity the client brings to the account is less important than the level of emotional and cognitive engagement they bring to it.</p>`,
        },
        {
          type: 'sequencing', order: 9,
          instructions: 'Place the following events in the correct order as they occur in the standard 12-session CPT protocol (not CPT-C). Drag and drop to arrange from first to last.',
          steps: [
            { text: 'Client receives psychoeducation about the cognitive model of PTSD and the concept of stuck points', order: 1 },
            { text: 'Client writes the first impact statement as a homework assignment after session 1', order: 2 },
            { text: 'Therapist and client review the impact statement and begin building the stuck point log', order: 3 },
            { text: 'Client writes the detailed written trauma account as a homework assignment', order: 4 },
            { text: 'Therapist and client read and process the written trauma account; key stuck points are identified from the narrative', order: 5 },
            { text: 'Client is introduced to the ABC Worksheet and begins practicing between-session identification of stuck points and their consequences', order: 6 },
            { text: 'Client is introduced to the Challenging Questions Worksheet and applies it to specific stuck points', order: 7 },
            { text: 'Patterns of Problematic Thinking are introduced; client recognizes recurring cognitive themes across multiple stuck points', order: 8 },
            { text: 'Five-theme worksheets address safety, trust, power/control, esteem, and intimacy stuck points systematically', order: 9 },
            { text: 'Client writes the second impact statement; therapist and client review progress, compare impact statements, and complete relapse prevention planning', order: 10 },
          ],
          explanation: 'The sequence reflects CPT\'s logic: understanding the model before identifying targets, identifying targets before challenging them, and challenging individual stuck points before addressing the broader thematic patterns. Departing from this sequence, particularly by moving to pattern challenging before stuck points are clearly identified, is one of the most common CPT implementation errors.',
        },
        {
          type: 'multiSelect', order: 10,
          question: 'Which of the following are characteristics that distinguish a CPT stuck point from a general negative thought? Select ALL that apply.',
          options: [
            { text: 'It is maintained by assimilation or over-accommodation of a traumatic event', isCorrect: true },
            { text: 'It is expressed as a declarative first-person belief statement in the present tense', isCorrect: true },
            { text: 'It is always related to self-blame', isCorrect: false },
            { text: 'It generates manufactured emotion that blocks natural recovery', isCorrect: true },
            { text: 'It is a durable interpretive belief applied broadly, not a situationally triggered reaction', isCorrect: true },
            { text: 'It must have been present before the traumatic event occurred', isCorrect: false },
          ],
          explanation: 'Stuck points are maintained by assimilation or over-accommodation, stated as declarative present-tense belief statements, durable and broadly applied, and productive of manufactured emotion that blocks natural recovery. They are not always self-blaming (over-accommodation produces other-blaming, world-catastrophizing beliefs), and they are generated by the traumatic event, not necessarily present before it.',
        },
        {
          type: 'reflection', order: 11,
          question: 'Think about a client you have worked with, or a case presentation you have encountered, in which trauma-related beliefs seemed to be maintaining distress. Without using identifying information: what belief, if present, might have been an assimilation stuck point? What belief, if present, might have been an over-accommodation stuck point? How might naming and externalizing these beliefs on a stuck point log have changed the therapeutic conversation?',
        },
        {
          type: 'keyTakeaway', order: 12,
          title: 'Key Takeaways — Section 1',
          takeaways: [
            'Resick\'s cognitive model holds that PTSD develops when natural recovery is blocked by assimilation (distorting the event to preserve prior schemas) or over-accommodation (distorting schemas based on the event) — producing stuck points that maintain symptoms.',
            'Stuck points are durable, declarative, first-person belief statements maintained by assimilation or over-accommodation. They generate manufactured emotions (guilt, shame, chronic fear) that block natural processing of the trauma.',
            'Stuck points and hot spots are clinically distinct: stuck points are cognitive targets (addressed with worksheets and Socratic questioning); hot spots are affective nodes in the trauma narrative (addressed with paced emotional processing).',
            'CPT proceeds through four phases: Assessment and Education, Stuck Point Identification, Pattern Challenging, and Consolidation/Relapse Prevention.',
            'CPT-C (without the written trauma account) produces equivalent outcomes to standard CPT for most populations. The choice between protocols should be clinically driven, not chosen by default for convenience.',
            'The written impact statement is CPT\'s first tool for surfacing stuck points. Its purpose is belief identification, not event narration — read it as a map of the client\'s stuck-point landscape.',
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════
    // SECTION 2 — CE HOUR 2: WORKSHEETS, FIVE THEMES, ADAPTATIONS, ETHICS
    // ═══════════════════════════════════════════════════════════════════════
    {
      title: 'CPT in Practice: Worksheets, Five Themes, Adaptations, and Ethics',
      order: 3,
      contentBlocks: [
        {
          type: 'sectionDivider', sectionNumber: '2',
          title: 'CPT in Practice: Worksheets, Five Themes, Adaptations, and Ethics',
          subtitle: 'The ABC Worksheet, Challenging Questions, Patterns of Problematic Thinking, five stuck-point themes, clinical adaptations, and ethical obligations',
          order: 1,
        },
        {
          type: 'text', order: 2,
          content: `<h2>The ABC Worksheet: Teaching Clients the Cognitive Model Through Practice</h2>
<p>The ABC Worksheet is the first between-session tool introduced in CPT, typically assigned after session 3 and reviewed in session 4. Its purpose is deceptively simple: to help clients build the habit of noticing the connection between an activating event (A), the belief or interpretation they apply to that event (B), and the consequences of that belief in terms of emotion and behavior (C). This sequence, the ABC framework, is not uniquely CPT's; it derives from Rational Emotive Behavior Therapy and from the cognitive behavioral tradition more broadly. But CPT uses it for a specific purpose within the CPT framework: to help clients concretely experience the observation that their feelings arise not merely from what happened but from what they believe about what happened.</p>
<p>Consider the difference between two clients who both experience an intrusive memory of a traumatic event (A). The first client thinks, "I can't believe that happened to me" (a relatively non-assimilated, grief-congruent response). The second client thinks, "This happened because I was weak and stupid" (an assimilation stuck point). The consequences (C) of these two interpretations differ substantially: the first client experiences grief and distress that are difficult but processable; the second experiences shame and self-contempt that tend to deepen avoidance and prevent recovery. The ABC Worksheet makes this connection visible to the client in their own language, with their own examples. It is not the same as the client being told by the therapist that their beliefs are distorted. It is the client discovering, through repeated self-observation, that the same event produces very different emotional consequences depending on what they believe about it.</p>
<p>A common error with the ABC Worksheet is using it to identify feelings at the B position rather than beliefs. Clients frequently write things like "I felt scared" or "I felt hopeless" in the B column. The therapist's response is not to correct but to probe: <em>And when you felt scared, what did you believe was true about you or the world in that moment?</em> That follow-up consistently surfaces the underlying stuck point. The worksheet is therefore not only a psychoeducational tool but an active clinical exercise in stuck-point identification. Clients who complete multiple ABC worksheets between sessions typically arrive at session with a richer, more specific stuck-point log entry than they could have produced by the impact statement alone.</p>
<h2>The Challenging Questions Worksheet: Socratic Examination of Stuck Points</h2>
<p>The Challenging Questions Worksheet, introduced around session 5 in the standard CPT protocol, is the primary instrument for beginning to destabilize and revise stuck points. It presents a single stuck point at the top of the worksheet and then poses thirteen structured questions designed to subject that belief to systematic evidential and logical scrutiny. The questions are not randomly ordered; they move through a deliberate analytical sequence.</p>
<p>The first cluster of questions concerns evidence: What evidence is there that this belief is true? What evidence is there that it is not true? These questions are grounding. They require the client to distinguish between what they actually know and what they have inferred, assumed, or catastrophized. Many stuck points, particularly assimilation-based ones, collapse under direct evidential inquiry: "It was my fault" often yields, upon examination, no strong evidence and substantial contradicting evidence.</p>
<p>The second cluster concerns habit and source: Is this a habit or a fact? How do you know this belief is true? Where did this belief come from? These questions invite the client to recognize that some beliefs are automatic and long-standing rather than the product of careful reasoning — and that their origin may itself be suspect, particularly when the belief emerged from the distorted perspective of the traumatic event itself.</p>
<p>The third cluster addresses alternative interpretations: Are there other explanations for this event? What evidence supports them? If a friend you loved had the same belief about themselves, what would you say to them? This last question is frequently the most powerful for clients who extend mercy to others that they completely withhold from themselves.</p>
<p>The fourth cluster concerns consequences: What is the effect of believing this? How does it affect you to hold this belief? Does holding this belief serve you? Is it keeping you from something you want or need? These questions shift the frame from epistemic (is this belief true?) to functional (what does holding this belief cost you?), which can be a useful complement to the evidential approach for clients who resist purely factual challenges.</p>
<p>The worksheet concludes with the client drafting a <em>challenging statement</em>: a revised belief that is more balanced, more adequately evidenced, and less globally negative than the original stuck point. The challenging statement is not meant to be the opposite extreme of the stuck point. If the stuck point was "No one can be trusted," the challenging statement is not "Everyone can be trusted completely." It might be something like: "The trauma was caused by one person's harmful choices. Most people in my life have shown me they can be trusted. I can use judgment about who to trust and when." The challenging statement reflects a calibrated, evidence-based update, not a forced positive reframe.</p>
<p>The clinical skill in using the Challenging Questions Worksheet lies in the therapist's ability to ask the questions in a genuinely Socratic spirit rather than in a corrective or persuasive one. The therapist's role is to facilitate the client's own examination of the stuck point, not to tell the client what the correct belief should be. A therapist who uses the worksheet as an opportunity to explain why the client's belief is wrong is likely to produce defensiveness and compliance rather than genuine cognitive change. The questions work best when the therapist holds them lightly, follows the client's lead, and allows the examination to proceed at a pace the client can genuinely process. Stuck points that have been held for years do not dissolve in a single session's worth of questioning; they require repeated challenge across multiple sessions and across the different question clusters before the challenging statement begins to feel genuinely plausible rather than merely logically constructed.</p>
<h2>Patterns of Problematic Thinking</h2>
<p>Around sessions 6 through 8, CPT introduces the Patterns of Problematic Thinking exercise, which shifts the level of analysis from individual stuck points to recurring cognitive patterns. The exercise presents a list of common maladaptive cognitive patterns drawn from the cognitive therapy literature, including: drawing overly broad conclusions from a single event ("If it happened once, it will always happen"); ignoring important aspects of a situation; over-valuing the importance of one's thoughts or feelings; mind reading (assuming you know what others are thinking without evidence); emotional reasoning (treating feelings as facts: "I feel guilty, therefore I must be guilty"); taking excessive personal responsibility for events beyond one's control; not taking into account plausible explanations other than the worst; and being convinced of one's power to make bad things happen while not recognizing one's power to prevent them.</p>
<p>The value of the Patterns exercise is that it teaches clients to recognize not just <em>this</em> stuck point but the <em>type</em> of thinking error that generates it. A client who recognizes that they habitually engage in emotional reasoning ("I feel as if I caused this, therefore I must have caused this") gains a metacognitive tool that applies across their entire stuck-point log, not just to the individual stuck point they examined in the Challenging Questions Worksheet. This generalization effect is one of the reasons CPT produces cognitive change that extends beyond the trauma narrative itself, improving functioning in domains that were not directly addressed in treatment.</p>`,
        },
        {
          type: 'callout', order: 3,
          calloutType: 'protocol',
          title: 'Why CPT Does NOT Require a Trauma Narrative — and When to Use the Written Account Anyway',
          content: `<p>A persistent misconception among clinicians learning about CPT is that effective treatment must include a written trauma account. The CPT-C variant (without written account) was developed and validated precisely because the research demonstrated that cognitive change, not exposure to the trauma narrative, is the active mechanism of PTSD symptom reduction in CPT. Multiple randomized trials have found CPT-C equivalent to standard CPT for most presentations.</p>
<p><strong>CPT-C is indicated when:</strong> the client has limited literacy or writing fluency; the written account assignment functions primarily as an avoidance trigger; the treatment setting does not reliably support between-session homework completion; or the therapist and client collaboratively determine that verbal processing will accomplish the same cognitive work more accessibly.</p>
<p><strong>Standard CPT (with written account) may add value when:</strong> trauma memories are highly fragmented and non-narrative in structure, where the sequential act of writing may have an organizing function; the client has strong writing comfort and reports that writing is a meaningful processing mode; or stuck points embedded in the detailed narrative are not surfacing adequately through verbal processing alone.</p>
<p><strong>What both variants share:</strong> thorough stuck-point identification via the impact statement and ABC Worksheet; systematic challenging via the Challenging Questions Worksheet and Patterns of Problematic Thinking; structured attention to all five stuck-point themes; and a concluding second impact statement with relapse-prevention planning. The cognitive work is non-negotiable regardless of variant. The written account is a delivery vehicle, not the treatment itself.</p>`,
        },
        {
          type: 'text', order: 4,
          content: `<h2>The Five Stuck-Point Themes</h2>
<p>Resick and her colleagues observed in their clinical and research work that the cognitive effects of trauma tend to concentrate in five specific domains of human experience: safety, trust, power and control, esteem, and intimacy. These are the domains in which prior schemas are most commonly and most severely disrupted by traumatic experience, and they are the domains in which stuck points most frequently cluster. CPT's session structure in the middle phase (approximately sessions 7–11) devotes specific attention to each theme in sequence, using dedicated worksheets designed for each domain. Understanding these five themes, including how they manifest in client language and behavior, is one of the most clinically practical aspects of CPT training.</p>
<p><strong>1. Safety.</strong> Safety stuck points arise from the trauma's disruption of the prior assumption (often implicit and pre-articulate) that the world is basically safe, that harm is preventable through careful behavior, and that one has some ability to anticipate and avoid danger. Assimilation-based safety stuck points take the form of self-blame for the trauma: "If I had been more careful, it wouldn't have happened." Over-accommodation-based safety stuck points produce sweeping threat beliefs: "The world is completely dangerous"; "I am never safe anywhere"; "Harm can come from anywhere at any time." Safety-themed stuck points often manifest clinically as hypervigilance, avoidance of places or situations associated with the trauma, and a persistent somatic sense of threat. The safety worksheet asks clients to examine the evidence for their current safety beliefs, to distinguish specific versus general risk, and to develop more calibrated assessments of risk that neither deny danger nor catastrophize it.</p>
<p><strong>2. Trust.</strong> Trust stuck points arise from the disruption of prior beliefs about the reliability and good intentions of others. In interpersonal trauma particularly, including assault, abuse, and betrayal, the traumatic event frequently involves a direct experience of another person's harmful or uncaring behavior, which over-accommodation generalizes to all people or all relationships: "No one can be trusted"; "People will always hurt me"; "Even people who seem kind are hiding something." Assimilation-based trust stuck points sometimes involve self-blame for having trusted someone who proved harmful: "I should have known he would betray me; I'm too naive." Trust-themed stuck points often manifest clinically as interpersonal withdrawal, relationship difficulties, and a persistent wariness that impairs the development of the therapeutic alliance itself. The trust worksheet helps clients develop a more differentiated understanding of trust — recognizing that trust is not all-or-nothing, that people can be trustworthy in some domains and not others, and that the fact of one betrayal does not make all people untrustworthy.</p>
<p><strong>3. Power and Control.</strong> Power and control stuck points arise from the traumatic experience of helplessness — the experience of not being able to stop something from happening, of one's actions having no effect on the outcome. Assimilation-based power/control stuck points often take the form of catastrophic self-criticism about one's failure to act or act effectively: "I should have fought back"; "I should have run"; "I froze, and that means I allowed it to happen." Over-accommodation-based power/control stuck points produce global helplessness beliefs: "I have no control over what happens to me"; "I am powerless to protect myself or those I love"; or, paradoxically, a compensatory over-control stance: "I must control everything in my environment at all times to be safe." The power/control worksheet helps clients examine what was actually in their control during the traumatic event, what the effects of their available options realistically would have been, and how to rebuild an appropriate — neither helpless nor omnipotent — sense of personal agency.</p>
<p><strong>4. Esteem.</strong> Esteem stuck points affect beliefs about the self's worth, value, and fundamental goodness, as well as beliefs about the worth of others. Self-esteem stuck points are commonly assimilation-based: "It happened because I am worthless"; "I deserved it"; "I am fundamentally damaged and no longer have value." Other-esteem stuck points are commonly over-accommodation-based: "All people are cruel"; "No one is genuinely good"; "There is nothing worth believing in." Esteem-themed stuck points are among the most clinically challenging to work with because they are often deeply embedded in pre-existing schemas shaped by developmental history, and the trauma has reinforced rather than created them. The esteem worksheet encourages clients to distinguish between their worth as a person and what was done to them — a distinction that many trauma survivors with self-blame stuck points find both obvious when stated abstractly and deeply difficult to feel in the body and believe in the self.</p>
<p><strong>5. Intimacy.</strong> Intimacy stuck points affect beliefs about closeness, connection, and the possibility of being known and accepted by another person. Over-accommodation produces global withdrawal beliefs: "I will never be close to anyone again"; "If people really knew what happened to me, they would reject me"; "I am permanently cut off from belonging." Assimilation can produce self-blame that expresses as a belief about unworthiness of intimacy: "I am too damaged to be loved now." Intimacy-themed stuck points often manifest clinically as social isolation, significant difficulty in romantic or family relationships following the trauma, and a persistent sense of being fundamentally different from others — unable to connect because of what has happened. The intimacy worksheet helps clients examine evidence from their current relationships for the presence of closeness, to identify specific fears about intimacy that can be tested against experience, and to develop beliefs that allow for both appropriate caution and genuine human connection.</p>
<h2>Adaptations of CPT for Complex Trauma, Military and Veteran Populations, and Group Format</h2>
<p>CPT was developed and initially validated for single-incident trauma in adults who had otherwise relatively stable developmental histories. The three decades since its introduction have generated a substantial body of research examining its application, often with protocol modifications, to populations and presentations for which the standard protocol may require thoughtful adaptation. Three of the most clinically significant adaptation contexts are complex trauma, military and veteran populations, and group delivery.</p>
<p><strong>Complex Trauma.</strong> Complex PTSD, as recognized in the ICD-11 (6B41), involves PTSD symptom clusters plus additional features in affect regulation, self-concept, and relational functioning that arise from chronic, repeated, often interpersonal trauma experienced in developmental contexts. In practice, many clients presenting with PTSD carry histories that include childhood abuse or neglect, domestic violence, or other forms of sustained interpersonal harm that result in more pervasive and more deeply entrenched stuck points than those typically associated with single-incident trauma. CPT for these clients often requires extended phase 1 work — more time in psychoeducation, more time in stabilization, and more attention to building the emotional regulation and distress tolerance skills that the Challenging Questions Worksheet presupposes. Clinicians working with complex trauma presentations in CPT should be attentive to the possibility that stuck points are deeply interwoven with identity and developmental self-concept, that the therapeutic relationship itself may activate trust- and esteem-themed stuck points in real time, and that the pace of cognitive change may be slower than in single-incident PTSD. Research supports CPT's effectiveness for complex trauma presentations, but also supports the need for extended treatment duration and, in some cases, integration with skills-based components that build affect regulation capacity before intensive cognitive challenging is attempted.</p>
<p><strong>Military and Veteran Populations.</strong> CPT was disseminated broadly throughout the VA healthcare system beginning in the mid-2000s and has been studied with active-duty service members, veterans from multiple eras, and military family members. Several features of military and veteran presentations have been identified as clinically significant for CPT delivery. First, moral injury — the experience of having done, witnessed, or failed to prevent something that violated one's moral code — produces a distinctive constellation of stuck points that differ from the fear-based stuck points of civilian PTSD. Moral injury stuck points often center on power/control and esteem themes: "I should have done more to save him"; "What I did in combat makes me irredeemable." The Challenging Questions Worksheet can be effective for these beliefs, but the moral dimension may require additional clinical attention that goes beyond factual evidence-gathering. Second, military culture may create specific barriers to the emotional expression and help-seeking that CPT presupposes, including beliefs that emotional processing is weakness, that admitting distress is professional failure, or that seeking mental health treatment threatens career standing. These cultural factors are themselves a potential source of stuck points and can be addressed as such within the CPT framework. Third, command-level stigma and institutional constraints may affect session attendance, homework completion, and the client's candor in session — factors that complicate fidelity to the standard protocol and require adaptive clinical judgment.</p>
<p><strong>Group CPT.</strong> CPT has been validated in group format, typically delivered in 12 sessions with groups of 8 to 12 participants, often with two co-therapists. Group CPT offers significant practical advantages, particularly in settings serving large numbers of PTSD-affected clients with limited clinician capacity, such as VA medical centers, refugee resettlement programs, and disaster-response contexts. The therapeutic factors that distinguish group CPT from individual delivery include universality (clients discover they are not alone in their stuck points), vicarious learning (observing other group members challenge their stuck points provides models that generalize), and the corrective interpersonal experience of trust and esteem being affirmed in a group context. Clinicians delivering group CPT should be attentive to several specific challenges: managing the pace so that no individual client is left significantly behind or significantly ahead of the group's progress through the protocol; containing between-member sharing that might inadvertently expose clients to secondary traumatization from others' accounts before stabilization work is complete; and maintaining the cognitive focus of the protocol in a context where the pull toward processing emotional content or providing mutual support can draw the group away from the worksheet work that is CPT's active ingredient.</p>`,
        },
        {
          type: 'accordion', order: 5,
          accordionItems: [
            {
              title: 'What Does CPT Treatment Fidelity Actually Require?',
              content: `<p>Treatment fidelity in CPT means delivering the protocol as it was designed and validated — not improvising a personalized hybrid that borrows some CPT elements while substituting others. Fidelity is measured along three dimensions: <strong>adherence</strong> (did the session content include the required components?), <strong>competence</strong> (did the therapist implement those components skillfully?), and <strong>pacing</strong> (did the treatment progress through the protocol in the intended sequence?). Research on CPT implementation consistently finds that lower fidelity is associated with poorer outcomes, and that the most common fidelity failures involve skipping the stuck-point identification phase (moving to pattern challenging before targets are clearly defined), substituting supportive processing for Socratic challenging (being empathic but not directive), and failing to assign and review between-session homework (which is where much of the cognitive work actually occurs). Fidelity does not mean rigidity: CPT allows for clinical judgment in pacing, in the depth of attention given to particular themes, and in how Socratic dialogue is conducted. But fidelity does mean that the core sequence of tools is delivered in order, that between-session assignments are treated as essential rather than optional, and that the focus remains on cognitive change rather than on narrative processing alone.</p>`,
            },
            {
              title: 'When NOT to Start CPT: Contraindications and Prerequisites',
              content: `<p>CPT is an active, demanding protocol that presupposes a level of psychological stability and cognitive capacity. There are presentations for which starting CPT immediately is contraindicated and for which preliminary work — or an alternative treatment — is more appropriate. Active psychosis is a contraindication: CPT's cognitive examination of beliefs requires intact reality testing. Active moderate-to-severe substance use that significantly impairs between-session functioning or cognitive processing is a relative contraindication: clients who are unable to retain and apply learning between sessions, or who use substances to avoid distressing between-session content, will not benefit from the protocol until stabilization is achieved. Severe, unstable suicidality requires safety stabilization before CPT is attempted. Ongoing trauma exposure — a client still in an abusive relationship, a refugee client in unstable housing, an active-duty service member in a combat deployment — limits CPT's effectiveness because safety and stabilization are prerequisite to cognitive processing. Finally, CPT requires adequate working memory and executive function to engage meaningfully with the worksheets; significant cognitive impairment from TBI, dementia, or other causes may require significant protocol adaptation or alternative approaches. None of these factors makes a client permanently ineligible for CPT; they indicate that the timing and sequencing of treatment must be carefully considered.</p>`,
            },
            {
              title: 'Moral Injury Stuck Points: How They Differ from Fear-Based PTSD Cognitions',
              content: `<p>Moral injury refers to the lasting psychological harm that results from committing, witnessing, or failing to prevent acts that violate one's moral code, particularly in high-stakes contexts such as military service or emergency response. Moral injury stuck points carry a distinctive quality that distinguishes them from the fear-based stuck points more commonly associated with civilian assault or accident trauma. Fear-based stuck points tend to center on safety ("the world is dangerous") and personal vulnerability ("I cannot protect myself"). Moral injury stuck points tend to center on esteem and power/control, but with a moral frame: "I am guilty"; "I deserve punishment"; "What I did is unforgivable"; "I have become the kind of person I always condemned." These beliefs are particularly resistant to purely evidential challenge, because they do not rest primarily on factual misattribution (the client may have accurate factual recall of what happened) but on moral self-condemnation. CPT's Challenging Questions Worksheet can be adapted for moral injury by including questions about proportionality (does this action define your entire character?), context (what were the constraints and pressures operating in that moment?), and moral growth (have you taken actions since that reflect your actual values?). Some CPT adaptations for veteran populations also integrate moral injury modules that address the distinctions between guilt, shame, and grief and provide a framework for distinguishing appropriate remorse from over-accommodated self-condemnation.</p>`,
            },
            {
              title: 'Scope of Practice: What CPT Training Actually Requires',
              content: `<p>The CPT Institute, the organization that oversees CPT training and certification, requires that therapists complete a training program that includes both a didactic workshop (typically two days) and a supervised consultation component (typically six or more calls reviewing recordings of actual CPT sessions). The consultation component is not optional: it is the mechanism through which therapists receive feedback on their fidelity to the protocol, their Socratic questioning skill, and their handling of the specific challenges that emerge when delivering CPT to actual clients with actual complexity. Completing a continuing-education course, including this one, satisfies none of these requirements. It does provide the conceptual foundation that makes training more accessible and productive, and it can help a clinician determine whether pursuing formal training makes clinical sense for their practice. If you work with a trauma-affected population and are considering adding CPT to your competencies, the next step is to identify a CPT Institute-affiliated training in your region or an online option, to confirm that the training includes a consultation component, and to build in appropriate supervision during your initial CPT cases. Delivering CPT without training and supervision is an ethics risk, not merely a competency risk — it exposes clients to a treatment they are not receiving in its evidence-based form.</p>`,
            },
            {
              title: 'Group CPT: Managing Fidelity in a Multi-Client Context',
              content: `<p>Group CPT presents fidelity challenges that do not arise in individual delivery. The most significant is maintaining the cognitive focus of the protocol in a context that naturally generates strong interpersonal emotion and peer support. Group members often want to process each other's narratives, offer comfort during distress, and explore relational themes in ways that are therapeutically meaningful but that pull the group away from the structured worksheet work that is CPT's active ingredient. Group CPT therapists need explicit group norms that support the cognitive focus, including agreements about the purpose of sharing (to practice identifying and challenging stuck points, not to process narrative content), the use of worksheets as the medium through which sharing occurs, and the role of co-therapists in redirecting narrative processing toward cognitive examination. A second fidelity challenge is pacing: because group members move through the protocol together, a client who masters a skill quickly cannot advance; a client who struggles with a worksheet cannot hold back the group. Effective group CPT therapists use between-session consultation, flexible extension of particular sessions when needed, and individual coaching within session to address the inevitable variability in within-group progress.</p>`,
            },
          ],
        },
        {
          type: 'imageText', order: 6,
          content: `<p>The five stuck-point themes serve as a clinical map for the middle phase of CPT. But they are not watertight categories, and experienced CPT clinicians quickly learn that stuck points rarely respect thematic boundaries. A single assaultive experience may produce stuck points across all five domains simultaneously: a safety stuck point ("Now I know that nowhere is safe"), a trust stuck point ("I can no longer trust anyone"), a power/control stuck point ("I should have fought back"), an esteem stuck point ("I must be fundamentally damaged for this to have happened to me"), and an intimacy stuck point ("I will never be able to be close to anyone again after this"). The five-theme sequence in CPT is not a diagnostic taxonomy; it is a structured scaffolding that ensures the clinician and client cover the full landscape of PTSD's cognitive effects rather than spending all twelve sessions working only in the most obvious or most distressing domain.</p>
<p>This has practical implications for how the middle-phase sessions are conducted. When the client presents a safety-themed stuck point in a session nominally focused on esteem, the therapist should not redirect to the theme-of-the-day but should work with what is present and trust that the five-theme worksheets will ensure eventual coverage. Themes are guides, not locks. Similarly, when a client in a veteran population presents moral injury content during a power/control-themed session, that is the content to engage with — using the power/control frame to examine what was in the client's control during the morally injurious event, and what the evidence says about the relationship between the client's choices and the outcome they carry guilt about. CPT's flexibility within structure is one of its clinical strengths: the protocol provides a scaffold that prevents drift, while the Socratic spirit of the questioning provides room for the clinician to follow the client's actual clinical material.</p>`,
          image: '',
          imageAlt: 'Diagram of the five CPT stuck-point themes (safety, trust, power/control, esteem, intimacy) arranged as overlapping domains, reflecting their clinical interpenetration',
          imagePosition: 'right',
        },
        {
          type: 'multiSelect', order: 7,
          question: 'Which of the following are correct characterizations of over-accommodation stuck points in the domain of TRUST following an interpersonal trauma? Select ALL that apply.',
          options: [
            { text: '"No one can ever be trusted" — a sweeping generalization from one betrayal', isCorrect: true },
            { text: '"People will always hurt me if I let them get close" — a global prediction applied to all relationships', isCorrect: true },
            { text: '"I should have known he would betray me; I am too naive" — self-blame for having trusted', isCorrect: false },
            { text: '"Even people who seem kind are hiding harmful intentions" — a mind-reading pattern applied universally', isCorrect: true },
            { text: '"I trusted him and it turned out badly; now I know trust is dangerous" — over-generalizing a single negative outcome to all trust situations', isCorrect: true },
          ],
          explanation: 'Over-accommodation produces sweeping, globally negative revisions to prior schemas based on traumatic evidence. The trust-based over-accommodation stuck points here generalize from one harmful experience to an absolute conclusion about all people or all trust relationships. The option "I should have known he would betray me; I am too naive" is an assimilation stuck point — it modifies the interpretation of the event (I should have known, implying predictability) to preserve the prior belief that the world is predictable if one is careful, placing blame on the self for trusting.',
        },
        {
          type: 'text', order: 8,
          content: `<h2>Ethics of Treatment Fidelity and Scope of Practice in CPT</h2>
<p>The ethical dimensions of delivering a manualized, evidence-based treatment like CPT involve two distinct but related obligations. The first is the obligation of <em>competence</em>, which in this context means that a clinician should not deliver CPT as a manualized protocol without having completed the training required to do so competently. The second is the obligation of <em>fidelity</em>, which in this context means that a clinician who has completed training should deliver the protocol in the form in which it was validated, rather than a self-modified hybrid that preserves the name while abandoning the procedures.</p>
<p>The competence obligation is grounded in the same standard that applies to all specialized practices: if a technique requires specific training to deliver safely and effectively, a clinician must obtain that training before delivering it. CPT is among the more specific examples of this standard, because its effectiveness is tied to procedural fidelity — to doing the specific worksheets, in the specific order, with the specific Socratic questioning approach — in a way that more loosely structured interventions are not. A clinician who delivers what they describe as "CBT for PTSD" while borrowing some CPT concepts is not delivering CPT and should not represent it as such. A clinician who delivers CPT without completing training, including the consultation component, is practicing beyond their competencies in a domain that directly affects the welfare of a population whose vulnerability is the defining feature of their presentation.</p>
<p>The fidelity obligation is less commonly discussed in ethical terms but is equally important. Once a clinician has completed CPT training, the obligation to maintain fidelity to the protocol reflects an ethical duty to the client: the client consented to receive CPT, the evidence base they agreed to participate in was generated using CPT as designed, and modifications that reduce that fidelity reduce the probability that the client will achieve the outcomes the evidence supports. This is not a claim that fidelity requires mechanical, inflexible adherence that ignores clinical context — CPT's developers have consistently emphasized that clinical judgment governs the moment-to-moment decisions of session delivery. It is a claim that systematic deviation from the protocol's core components, especially the omission of worksheet-based homework, skipping the stuck-point identification phase, or substituting narrative processing for cognitive challenging, represents a clinically significant departure from the evidence base, with potential consequences for client welfare.</p>
<p>A related ethical consideration involves the representation of CPT to clients and referral sources. CPT has a strong enough reputation that clinicians sometimes claim to use it as a marketing label for what is, in practice, general trauma-informed CBT. This misrepresentation is problematic for several reasons: it misleads clients about what they are receiving, it misrepresents the clinician's training, and it potentially occupies a client's treatment slot that a clinician trained in CPT might otherwise fill. Professional codes in counseling, social work, and psychology all include provisions about misrepresentation of credentials and techniques; applying a specific evidence-based treatment label to a different practice pattern implicates those provisions directly.</p>
<p>Finally, clinicians working with trauma have a specific ethical responsibility to maintain their own secondary traumatic stress and compassion fatigue. PTSD work is among the most clinically demanding specializations, and the literature consistently finds that CPT clinicians, like other trauma-focused therapists, are at elevated risk for vicarious traumatization, secondary traumatic stress, and burnout when their own self-care, supervision, and consultation supports are inadequate. The ethical obligation to practice within one's current competence and from a position of adequate psychological functioning does not disappear because a protocol is well-validated; it is intensified by the relentless exposure to traumatic material that trauma-focused work requires. Supervision and peer consultation are not optional enrichment in CPT practice; they are ethical infrastructure.</p>`,
        },
        {
          type: 'scenarioTree', order: 9,
          scenarioTitle: 'Managing a Stuck Point in Session: A CPT Decision Tree',
          startNode: 'start',
          nodes: {
            start: {
              text: 'You are in session 6 of CPT with a female survivor of sexual assault. She has been working on the stuck point: "It happened because I didn\'t fight back hard enough, which means I was partly responsible." You introduce the Challenging Questions Worksheet for this stuck point. She reads the first question — "What is the evidence that this belief is true?" — and immediately begins to cry, saying: "I just remember feeling frozen. I couldn\'t move. I couldn\'t speak. I don\'t understand why I didn\'t do more." What is your most clinically appropriate next response?',
              choices: [
                { text: 'Immediately reassure her that freezing is a normal trauma response and that she is not responsible, so she can see the belief is wrong', nextId: 'nodeA' },
                { text: 'Slow down, reflect her emotion, and then gently ask what she made of the fact that she felt frozen — helping her articulate the stuck-point interpretation before moving to the worksheet questions', nextId: 'nodeB' },
                { text: 'Redirect to the worksheet: remind her that the task is to identify evidence for and against the belief, and ask her to stay with that question', nextId: 'nodeC' },
                { text: 'Switch to an EMDR processing approach to address the somatic freezing response that is clearly present', nextId: 'nodeD' },
              ],
            },
            nodeA: {
              text: 'You tell her directly that freezing is a well-documented trauma response called tonic immobility and that she had no control over it, so the stuck point is factually wrong. She nods, says "I know," and moves on. The next session, she returns with the same stuck point still active. What happened?',
              choices: [
                { text: 'The intervention was too brief; she needed more psychoeducation about tonic immobility', nextId: 'nodeA2' },
                { text: 'The reassurance bypassed the Socratic process that allows her to arrive at the realization herself — so it was heard intellectually but not felt as true', nextId: 'nodeA3' },
              ],
            },
            nodeA2: {
              text: 'Actually, the issue is not the amount of psychoeducation. The CPT literature consistently finds that direct reassurance produces intellectual agreement that does not translate into cognitive change, because it replaces the client\'s examination of her own belief with the therapist\'s conclusion. The Socratic process — helping her examine the evidence herself — is the mechanism of change.',
              isEnd: true,
            },
            nodeA3: {
              text: 'Correct. In CPT, the therapist\'s role is to facilitate the client\'s own examination, not to provide the answer. When the therapist supplies the corrective belief ("You couldn\'t control freezing; you are not responsible"), the client receives information but does not do the cognitive work that produces genuine belief change. The stuck point persists because the client\'s own examination of it has been bypassed. Return to the Challenging Questions Worksheet in the next session and invite her to generate the evidence herself.',
              isEnd: true,
            },
            nodeB: {
              text: 'You reflect her emotion: "It sounds like that memory of being frozen is really painful and confusing." She nods. You then say: "When you were frozen, what did you tell yourself that meant about you or about what was happening?" She says: "I thought: Why won\'t my body work? And then after, I thought it must mean I wanted it to happen, or that I wasn\'t really in danger." You have now surfaced two distinct stuck points. What do you do next?',
              choices: [
                { text: 'Add both new stuck points to the stuck point log and continue with the Challenging Questions Worksheet on the original stuck point, noting the new ones for upcoming sessions', nextId: 'nodeB2' },
                { text: 'Immediately switch to working on the new stuck point "I must have wanted it to happen" because it seems more distressing and central', nextId: 'nodeB3' },
              ],
            },
            nodeB2: {
              text: 'Well done. This is the correct CPT response. The slow-down and Socratic probe surfaced additional stuck points, which are logged for later. The session then continues with the Challenging Questions Worksheet on the original stuck point, which can now be informed by the new understanding of what the freezing response meant to her. The stuck point log grows, providing a richer agenda for the remainder of treatment.',
              isEnd: true,
            },
            nodeB3: {
              text: 'Switching targets mid-session because a new stuck point seems more central risks leaving the Challenging Questions process unanchored and may unintentionally reinforce avoidance — the client learns that bringing up a new distressing content shifts the therapist\'s focus away from the one being examined. Logging the new stuck point and completing the worksheet on the original one is more consistent with CPT fidelity. The new stuck point will receive its own session attention.',
              isEnd: true,
            },
            nodeC: {
              text: 'You redirect to the worksheet before addressing her emotion, saying: "Let\'s stay with the question — what evidence is there that the belief is true?" She becomes visibly more constricted, provides a brief rote response, and the session continues with limited emotional engagement. The worksheet is completed technically but without genuine cognitive examination.',
              choices: [
                { text: 'This outcome suggests the redirect was premature — the emotion needed acknowledgment before the worksheet questions could be engaged productively', nextId: 'nodeC2' },
              ],
            },
            nodeC2: {
              text: 'Correct. CPT is not a technique where the therapist applies worksheets over the top of unacknowledged emotion. The relational and pacing skills of the therapist create the conditions under which the Socratic examination can be productive. Emotion that is acknowledged and briefly metabolized allows the client to re-engage cognitively; emotion that is redirected past tends to produce compliance without genuine examination. The Challenging Questions Worksheet requires a regulated-enough emotional state to engage in reasoning — and maintaining that state is partly the therapist\'s clinical responsibility.',
              isEnd: true,
            },
            nodeD: {
              text: 'Switching to EMDR processing mid-CPT session is a fidelity violation and a scope-of-practice issue if you are not trained in EMDR. More fundamentally, the presentation here is not primarily a somatic processing problem — it is a clear assimilation stuck point that CPT\'s tools are designed to address. Mixing modalities mid-protocol without clinical justification and training in both is neither evidence-based nor ethical.',
              isEnd: true,
            },
          },
        },
        {
          type: 'matching', order: 10,
          matchingInstructions: 'Match each CPT worksheet or tool on the left with the clinical function it primarily serves in the CPT protocol.',
          matchingPairs: [
            { term: 'Impact Statement (written before session 2)', definition: 'First map of the client\'s stuck-point landscape; identifies meaning and belief disruptions generated by the trauma' },
            { term: 'ABC Worksheet', definition: 'Teaches clients to identify the link between activating events, beliefs, and emotional/behavioral consequences — building between-session stuck-point identification skill' },
            { term: 'Stuck Point Log', definition: 'Running collaborative inventory of identified stuck points; externalizes beliefs and structures the agenda for the middle phase of treatment' },
            { term: 'Challenging Questions Worksheet', definition: 'Subjects a specific stuck point to systematic evidential and logical scrutiny; culminates in a more balanced challenging statement' },
            { term: 'Patterns of Problematic Thinking', definition: 'Identifies recurring cognitive error patterns (e.g., emotional reasoning, overgeneralization) that operate across multiple stuck points' },
            { term: 'Impact Statement (written before session 12)', definition: 'Measures cognitive change by direct comparison with the first impact statement; anchors relapse prevention planning' },
          ],
        },
        {
          type: 'reflection', order: 11,
          question: 'Of the five CPT stuck-point themes — safety, trust, power/control, esteem, and intimacy — which do you observe most commonly in the trauma presentations in your current practice or training context? What does the clinical presentation of that theme typically look like in client language and behavior? And what, if anything, in your own clinical training or supervision has prepared you to address it with the cognitive specificity that CPT requires?',
        },
        {
          type: 'keyTakeaway', order: 12,
          title: 'Key Takeaways — Section 2',
          takeaways: [
            'The ABC Worksheet is CPT\'s first between-session tool; its purpose is teaching clients to identify the link between beliefs and emotional consequences, not to document feelings — the B column contains beliefs, not emotions.',
            'The Challenging Questions Worksheet applies Socratic examination to a specific stuck point across four analytical clusters: evidence, source/habit, alternative interpretations, and functional consequences. It concludes with a calibrated challenging statement, not a forced positive reframe.',
            'Patterns of Problematic Thinking lifts analysis from individual stuck points to recurring cognitive error patterns, generating a generalization effect that extends the benefits of CPT beyond the trauma narrative.',
            'The five CPT stuck-point themes — safety, trust, power/control, esteem, and intimacy — provide a structured map of the domains most commonly disrupted by trauma. They are not watertight categories; stuck points frequently span multiple themes simultaneously.',
            'CPT adaptations for complex trauma (extended stabilization phase), military/veteran populations (moral injury stuck points, stigma barriers), and group delivery (maintaining cognitive focus, managing pacing) require deliberate clinical attention and are supported by emerging research evidence.',
            'Delivering CPT without completing training (including the supervised consultation component) is a competence and ethics issue. Representing modified CBT as CPT when the core protocol has been significantly altered is a misrepresentation issue. Both require attention to professional ethics codes.',
          ],
        },
        {
          type: 'resources', order: 13,
          title: 'Clinical Resources and Further Learning',
          resources: [
            {
              title: 'CPT Institute — Official CPT Training and Resources',
              url: 'https://cptforptsd.com',
              type: 'website',
              description: 'The official home of CPT training, certification, and consultation resources. Includes therapist worksheets, training calendars, and the consultation process for CPT certification.',
            },
            {
              title: 'VA/DoD Clinical Practice Guideline for PTSD (2023)',
              url: 'https://www.healthquality.va.gov/guidelines/MH/ptsd/',
              type: 'website',
              description: 'The Department of Veterans Affairs and Department of Defense joint clinical practice guideline for PTSD, including updated evidence ratings for CPT, PE, and other evidence-based treatments.',
            },
            {
              title: 'APA Clinical Practice Guideline for PTSD',
              url: 'https://www.apa.org/ptsd-guideline',
              type: 'website',
              description: 'The American Psychological Association\'s clinical practice guideline for the treatment of PTSD, including the evidence review for CPT and other strongly recommended interventions.',
            },
            {
              title: 'NCPTSD: About CPT (National Center for PTSD)',
              url: 'https://www.ptsd.va.gov/professional/treat/txessentials/cpt_for_ptsd_pro.asp',
              type: 'website',
              description: 'The VA National Center for PTSD\'s professional resource page for CPT, including the evidence base, implementation guidance, and downloadable patient and therapist materials.',
            },
            {
              title: 'International Society for Traumatic Stress Studies (ISTSS)',
              url: 'https://www.istss.org',
              type: 'website',
              description: 'ISTSS publishes treatment guidelines, supports CPT training and research, and hosts the primary professional conference for trauma treatment specialists.',
            },
            {
              title: 'PCL-5: PTSD Checklist for DSM-5 (NCPTSD)',
              url: 'https://www.ptsd.va.gov/professional/assessment/adult-sr/ptsd-checklist.asp',
              type: 'website',
              description: 'The PTSD Checklist for DSM-5 (PCL-5), the primary outcome measure used across CPT studies and in CPT clinical delivery. Free to download from the VA NCPTSD for clinical use.',
            },
            {
              title: 'Resick PA, Monson CM, Chard KM. Cognitive Processing Therapy for PTSD: A Comprehensive Manual.',
              url: 'https://www.guilford.com/books/Cognitive-Processing-Therapy-for-PTSD/Resick-Monson-Chard/9781462533756',
              type: 'website',
              description: 'The primary CPT manual by the developers of the protocol. Includes session-by-session guidance, all worksheets, and discussion of adaptations for diverse populations.',
            },
          ],
        },
      ],
    },

    // ─── CONCLUSION ─────────────────────────────────────────────────────────
    {
      title: 'Conclusion: From Stuck Points to Adaptive Beliefs, In Practice',
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'Conclusion',
          subtitle: 'Bringing the cognitive model, worksheets, and clinical fidelity together',
        },
        {
          type: 'text',
          content: `<p>This course built CPT from its theoretical foundation up to its clinical application. Section 1 established Resick's cognitive model of PTSD — the distinction between assimilation, which distorts the traumatic event to preserve prior schemas, and over-accommodation, which distorts prior schemas based on the trauma — and showed how stuck points, the durable interpretive beliefs that maintain PTSD symptoms, are identified and organized around the five stuck-point themes of safety, trust, power/control, esteem, and intimacy. That model gives CPT its structure: treatment is not generalized exposure or emotional ventilation, but the systematic identification and challenging of specific, nameable beliefs.</p>
<p>Section 2 turned that model into a session-by-session protocol: the ABC worksheet and Challenging Questions worksheet as the mechanical tools of stuck-point work, Patterns of Problematic Thinking as a way of categorizing distortion, and the adaptations required for complex trauma, military and veteran populations, and group delivery. Throughout, the emphasis has been on treatment fidelity and scope of practice — CPT is a manualized, evidence-based protocol, and its effectiveness depends on following its structure rather than freelancing pieces of it in isolation from the full model.</p>
<p>The principle that ties both sections together is the one at the heart of Resick's model: PTSD is maintained less by the traumatic event itself than by the beliefs a person has constructed to make sense of it. CPT does not ask clients to relive the trauma in detail — it asks them to examine, and ultimately revise, the assimilated or over-accommodated beliefs that trauma left behind. That focus on cognition over exposure is what distinguishes CPT from other evidence-based PTSD treatments, and it is the clinical skill this course has aimed to build.</p>`,
        },
        {
          type: 'keyTakeaway',
          title: 'Course-Wide Key Takeaways',
          takeaways: [
            'Resick\'s cognitive model distinguishes assimilation (distorting the trauma to preserve prior beliefs) from over-accommodation (distorting prior beliefs based on the trauma) as the two mechanisms maintaining PTSD.',
            'Stuck points are durable, present-tense, first-person belief statements maintained by assimilation or over-accommodation — not general negative thoughts, and not necessarily related to self-blame.',
            'The five stuck-point themes — safety, trust, power/control, esteem, and intimacy — organize the clinical territory CPT addresses across a course of treatment.',
            'The ABC worksheet and Challenging Questions worksheet are the core mechanical tools for identifying and revising stuck points session by session.',
            'CPT adapts to complex trauma, military and veteran populations, and group delivery formats, but treatment fidelity to the manualized protocol remains essential across all adaptations.',
            'CPT\'s focus on cognition — examining and revising trauma-related beliefs — rather than repeated exposure narration is what distinguishes it from other evidence-based PTSD treatments.',
          ],
        },
        {
          type: 'callout',
          calloutType: 'tip',
          title: 'Continuing Your CPT Practice',
          content: `<p>CPT competency deepens with formal training and consultation. Consider pursuing CPT training and certification through the developers' training program, working through Resick, Monson, and Chard's primary treatment manual referenced throughout this course, and seeking case consultation as you begin applying the ABC and Challenging Questions worksheets with your own clients.</p>`,
        },
        {
          type: 'reflection',
          question: 'Think of a client whose PTSD presentation includes a belief that sounds like self-blame or mistrust stated as fact. Using this course\'s framework, is that belief more likely assimilated or over-accommodated — and what would be your first Challenging Question in your next session with them?',
        },
      ],
    },
  ],

  assessment: {
    questions: [
      {
        type: 'multipleChoice',
        question: 'In Resick\'s cognitive model, which mechanism involves distorting one\'s interpretation of a traumatic event to preserve pre-existing schemas about the world being predictable and controllable?',
        options: [
          { text: 'Over-accommodation', isCorrect: false },
          { text: 'Assimilation', isCorrect: true },
          { text: 'Emotional processing', isCorrect: false },
          { text: 'Habituation', isCorrect: false },
        ],
        explanation: 'Assimilation preserves the schema by distorting the event — most commonly through self-blame ("it happened because of something I did or failed to do"). Over-accommodation distorts the schema itself based on the event.',
      },
      {
        type: 'multipleChoice',
        question: 'Which of the following is a clinically accurate example of an over-accommodation stuck point in the domain of esteem?',
        options: [
          { text: '"I should have fought back harder — my hesitation caused this to happen"', isCorrect: false },
          { text: '"I knew that situation was risky and I went anyway, so I am partly responsible"', isCorrect: false },
          { text: '"I am permanently damaged and no longer have value as a person because of what happened to me"', isCorrect: true },
          { text: '"If I had left earlier, this wouldn\'t have happened"', isCorrect: false },
        ],
        explanation: 'Over-accommodation produces sweeping, global negative revisions of prior schemas. "I am permanently damaged and no longer have value" is an over-accommodated esteem belief — it draws an extreme, global conclusion about the self from the traumatic event. The other options are assimilation-based (they modify the event to assign self-blame while preserving a sense that the outcome was preventable).',
      },
      {
        type: 'multipleChoice',
        question: 'What is the PRIMARY clinical distinction between a stuck point and a hot spot in CPT?',
        options: [
          { text: 'Stuck points occur in the first half of treatment; hot spots occur in the second half', isCorrect: false },
          { text: 'Stuck points are cognitive beliefs that block natural recovery; hot spots are affective nodes in the trauma memory where emotional processing is most intense', isCorrect: true },
          { text: 'Stuck points are identified by the client; hot spots are identified by the therapist', isCorrect: false },
          { text: 'Stuck points require the Challenging Questions Worksheet; hot spots require a separate trauma-focused medication consultation', isCorrect: false },
        ],
        explanation: 'Stuck points are cognitive (beliefs maintained by assimilation or over-accommodation) and are the direct targets of CPT\'s worksheet-based challenging. Hot spots are affective — moments in the trauma narrative where emotional intensity is particularly high and processing is blocked. They call for different clinical responses: stuck points require Socratic examination; hot spots require paced emotional processing.',
      },
      {
        type: 'multipleChoice',
        question: 'The first homework assignment in CPT — the impact statement — asks the client to do which of the following?',
        options: [
          { text: 'Write a detailed, sequential narrative of everything that happened during the traumatic event', isCorrect: false },
          { text: 'Complete an ABC Worksheet tracking their PTSD symptoms over the past week', isCorrect: false },
          { text: 'Write about why they believe the trauma occurred and how it has affected their beliefs about themselves, others, and the world', isCorrect: true },
          { text: 'List all of the situations and stimuli that trigger their PTSD symptoms', isCorrect: false },
        ],
        explanation: 'The impact statement focuses on meaning and belief, not on what happened. It is CPT\'s first tool for surfacing stuck points, because it asks the client to articulate their interpretation of why the trauma occurred and what it has meant for their worldview — precisely the content where stuck points live.',
      },
      {
        type: 'multipleChoice',
        question: 'Research comparing standard CPT (with written trauma account) to CPT-C (without written account) has generally found:',
        options: [
          { text: 'Standard CPT produces significantly better outcomes because the written account is the primary active ingredient', isCorrect: false },
          { text: 'CPT-C is superior for most populations because it avoids re-traumatization through unnecessary narrative exposure', isCorrect: false },
          { text: 'Both variants produce equivalent PTSD symptom reduction for most populations, suggesting cognitive change is the primary active ingredient', isCorrect: true },
          { text: 'CPT-C is contraindicated for interpersonal trauma because verbal processing is insufficient for processing assault-related memories', isCorrect: false },
        ],
        explanation: 'Multiple randomized trials have found CPT and CPT-C equivalent in PTSD symptom reduction for most populations. This supports the conclusion that cognitive change, not the written account per se, is the active mechanism. The written account appears to be a vehicle for accessing stuck points and facilitating cognitive change, not an indispensable ingredient in its own right.',
      },
      {
        type: 'multipleChoice',
        question: 'In the Challenging Questions Worksheet, what is the purpose of the question "What would you say to a friend who held this belief about themselves?"',
        options: [
          { text: 'To help the client practice cognitive reframing techniques they can teach to others', isCorrect: false },
          { text: 'To shift perspective and access the more balanced judgment the client typically extends to others but withholds from themselves', isCorrect: true },
          { text: 'To identify whether the client has adequate social support for recovery', isCorrect: false },
          { text: 'To determine whether the stuck point is assimilation-based or over-accommodation-based', isCorrect: false },
        ],
        explanation: 'This question exploits a well-documented asymmetry: most trauma survivors are significantly more compassionate toward others than toward themselves. By asking what they would say to a friend with the same stuck point, the therapist invites access to a more balanced perspective that the client already holds — and helps the client recognize that they apply different evidential standards to themselves than to people they care about.',
      },
      {
        type: 'multipleChoice',
        question: 'Which of the following clinical presentations is MOST strongly associated with an over-accommodation stuck point in the domain of POWER AND CONTROL?',
        options: [
          { text: 'A client who says: "I should have been more careful and then it wouldn\'t have happened to me"', isCorrect: false },
          { text: 'A client who says: "I knew he was dangerous and I stayed anyway — I allowed this"', isCorrect: false },
          { text: 'A client who says: "I have no control over what happens to me and I never will"', isCorrect: true },
          { text: 'A client who says: "If I had left ten minutes earlier the accident wouldn\'t have happened"', isCorrect: false },
        ],
        explanation: '"I have no control over what happens to me and I never will" is a sweeping global helplessness belief — an over-accommodated power/control stuck point that draws an absolute conclusion about the self\'s agency from one traumatic experience of helplessness. The other options involve assimilation — they preserve a prior belief in predictability and control by placing self-blame for specific choices.',
      },
      {
        type: 'multipleChoice',
        question: 'Moral injury stuck points in military and veteran populations MOST commonly concentrate in which two of the five CPT stuck-point themes?',
        options: [
          { text: 'Safety and intimacy', isCorrect: false },
          { text: 'Trust and safety', isCorrect: false },
          { text: 'Power/control and esteem', isCorrect: true },
          { text: 'Esteem and intimacy', isCorrect: false },
        ],
        explanation: 'Moral injury involves harm arising from violation of one\'s own moral code — having done, witnessed, or failed to prevent something perceived as morally wrong. The resulting stuck points tend to concentrate in power/control ("I should have done more to prevent it") and esteem ("What I did makes me fundamentally a bad person; I am irredeemable"). Safety- and trust-themed stuck points are more commonly associated with fear-based civilian trauma presentations.',
      },
      {
        type: 'multipleChoice',
        question: 'A CPT therapist provides direct reassurance to a client with a self-blame stuck point, saying: "What happened was not your fault — the research shows that freezing is a normal trauma response and you had no control over it." In the following session, the client returns with the stuck point still active. What does this outcome most likely illustrate?',
        options: [
          { text: 'The client needs more psychoeducation about tonic immobility before she can accept the correction', isCorrect: false },
          { text: 'Direct reassurance bypassed the Socratic process through which genuine cognitive change occurs — the client heard the information but did not do the examination that produces belief change', isCorrect: true },
          { text: 'The stuck point is too deeply entrenched for CPT and the client should be referred for a different treatment', isCorrect: false },
          { text: 'The therapist should have used the Patterns of Problematic Thinking exercise instead of reassurance', isCorrect: false },
        ],
        explanation: 'This outcome is a classic illustration of the limits of direct persuasion in CPT. When the therapist supplies the corrective belief, the client receives information but does not arrive at the updated belief through their own evidential examination. CPT\'s Socratic approach works because the client generates the evidence and the challenge themselves — which is what produces genuine, durable cognitive change rather than intellectual compliance.',
      },
      {
        type: 'multipleChoice',
        question: 'The Patterns of Problematic Thinking exercise in CPT adds value beyond the Challenging Questions Worksheet primarily because it:',
        options: [
          { text: 'Provides a more detailed evidence review for each individual stuck point', isCorrect: false },
          { text: 'Introduces the five stuck-point themes in a structured sequence', isCorrect: false },
          { text: 'Teaches clients to recognize recurring cognitive error patterns that operate across multiple stuck points, producing a generalization effect', isCorrect: true },
          { text: 'Replaces the Challenging Questions Worksheet for clients who have not responded to evidential questioning', isCorrect: false },
        ],
        explanation: 'The Challenging Questions Worksheet addresses one stuck point at a time. The Patterns of Problematic Thinking exercise lifts the level of analysis to recurring patterns (emotional reasoning, overgeneralization, mind reading, etc.) that generate multiple stuck points. Clients who recognize a recurring pattern — such as habitual emotional reasoning — gain a metacognitive tool that applies across their entire stuck-point log, extending the benefits of CPT beyond the content of any individual worksheet.',
      },
      {
        type: 'multipleChoice',
        question: 'Which of the following is a CONTRAINDICATION for beginning CPT immediately (rather than doing preparatory stabilization work first)?',
        options: [
          { text: 'A client who is reluctant to write and prefers verbal processing', isCorrect: false },
          { text: 'A client with mild to moderate depression in addition to PTSD', isCorrect: false },
          { text: 'A client with active moderate-to-severe substance use disorder that significantly impairs between-session functioning', isCorrect: true },
          { text: 'A client who has previously been in treatment for PTSD without completing it', isCorrect: false },
        ],
        explanation: 'Active moderate-to-severe substance use that impairs between-session cognitive functioning or that is used to avoid between-session distress significantly undermines CPT\'s between-session homework process, which is where much of the cognitive change work occurs. Stabilization of substance use is typically a prerequisite for effective CPT engagement. The other options — reluctance to write, comorbid depression, and prior incomplete treatment — do not contraindicate CPT initiation and can often be addressed within the protocol.',
      },
      {
        type: 'multipleChoice',
        question: 'What does the SECOND impact statement, written at the conclusion of CPT (before session 12), primarily serve to demonstrate?',
        options: [
          { text: 'The client\'s remaining stuck points that require continued work in a second phase of treatment', isCorrect: false },
          { text: 'Cognitive change by direct comparison with the first impact statement, reflecting the shift in beliefs that CPT has produced', isCorrect: true },
          { text: 'The client\'s mastery of the Challenging Questions process, serving as a final competency assessment', isCorrect: false },
          { text: 'The client\'s readiness to disclose the trauma to significant others in their social support network', isCorrect: false },
        ],
        explanation: 'The second impact statement is written on the same prompt as the first — why did the trauma occur and how has it affected your beliefs? — which allows direct comparison of the two documents. Differences in language, belief content, and emotional tone between the first and second impact statements are the most direct evidence of the cognitive change CPT has produced, and reviewing these differences together is a powerful consolidation experience for clients and therapists alike.',
      },
      {
        type: 'multipleChoice',
        question: 'In group CPT, the MOST significant fidelity challenge that distinguishes group from individual delivery is:',
        options: [
          { text: 'The difficulty of scheduling sessions that all group members can attend consistently', isCorrect: false },
          { text: 'The tendency of group process to pull toward narrative sharing and mutual support rather than the worksheet-based cognitive examination that is CPT\'s active ingredient', isCorrect: true },
          { text: 'The impossibility of maintaining confidentiality when group members discuss each other\'s trauma histories', isCorrect: false },
          { text: 'The requirement to add sessions beyond the standard 12 to cover all five stuck-point themes with multiple clients', isCorrect: false },
        ],
        explanation: 'Group dynamics in trauma groups naturally generate interpersonal emotion, narrative sharing, and mutual support. While these are therapeutic in general, they can pull the CPT group away from the structured cognitive work of the worksheets — which is the protocol\'s active ingredient. Maintaining the cognitive focus is the primary fidelity challenge in group CPT, and requires explicit group norms, active therapist structure, and co-therapist coordination.',
      },
      {
        type: 'multipleChoice',
        question: 'A clinician has completed a two-day CPT workshop but has not completed the supervised consultation component required by the CPT Institute. From an ethics standpoint, which of the following most accurately describes their situation?',
        options: [
          { text: 'They may deliver CPT as long as they use all of the worksheets in the correct order', isCorrect: false },
          { text: 'They are not yet competent to deliver CPT as a manualized protocol and should not represent their services as CPT until the consultation component is complete', isCorrect: true },
          { text: 'The workshop has provided sufficient training because CPT is a structured protocol that does not require supervised practice', isCorrect: false },
          { text: 'They may deliver CPT-C but not standard CPT until consultation is complete', isCorrect: false },
        ],
        explanation: 'CPT training requires both didactic and supervised consultation components. The consultation is where therapists receive feedback on their actual protocol delivery — including fidelity, Socratic questioning skill, and management of clinical complications. Without the consultation component, the clinician has conceptual knowledge but not the procedural competence that safe, ethical CPT delivery requires. Representing services as CPT without completing training is a misrepresentation issue under most professional ethics codes.',
      },
      {
        type: 'multipleChoice',
        question: 'What is the CORRECT column position for a belief in the CPT ABC Worksheet?',
        options: [
          { text: 'A — the activating event column', isCorrect: false },
          { text: 'B — the beliefs/interpretations column', isCorrect: true },
          { text: 'C — the consequences/emotions column', isCorrect: false },
          { text: 'Beliefs are not part of the CPT ABC Worksheet — it tracks events and symptoms only', isCorrect: false },
        ],
        explanation: 'The ABC Worksheet\'s B column contains beliefs and interpretations — the stuck-point content that mediates between the activating event and the emotional and behavioral consequences. A common client error is writing emotions in the B column ("I felt scared"). The therapist\'s Socratic probe — "And when you felt scared, what did you believe in that moment about yourself or the world?" — surfaces the underlying belief that belongs in column B.',
      },
    ],
  },

  references: [
    'Resick, P. A., & Schnicke, M. K. (1992). Cognitive processing therapy for sexual assault victims. <em>Journal of Consulting and Clinical Psychology, 60</em>(5), 748–756. https://doi.org/10.1037/0022-006X.60.5.748',
    'Resick, P. A., Monson, C. M., & Chard, K. M. (2017). <em>Cognitive processing therapy for PTSD: A comprehensive manual</em>. Guilford Press.',
    'Monson, C. M., Schnurr, P. P., Resick, P. A., Friedman, M. J., Young-Xu, Y., & Stevens, S. P. (2006). Cognitive processing therapy for veterans with military-related posttraumatic stress disorder. <em>Journal of Consulting and Clinical Psychology, 74</em>(5), 898–907. https://doi.org/10.1037/0022-006X.74.5.898',
    'Chard, K. M. (2005). An evaluation of cognitive processing therapy for the treatment of posttraumatic stress disorder related to childhood sexual abuse. <em>Journal of Consulting and Clinical Psychology, 73</em>(5), 965–971. https://doi.org/10.1037/0022-006X.73.5.965',
    'Galovski, T. E., Blain, L. M., Mott, J. M., Elwood, L., & Houle, T. (2012). Massed versus standard-paced cognitive processing therapy for posttraumatic stress disorder: An adaptive treatment trial. <em>Journal of Consulting and Clinical Psychology, 80</em>(5), 888–900. https://doi.org/10.1037/a0029879',
    'Bass, J. K., Annan, J., McIvor Murray, S., Kaysen, D., Griffiths, S., Cetinoglu, T., Wachter, K., Murray, L. K., & Bolton, P. A. (2013). Controlled trial of psychotherapy for Congolese survivors of sexual violence. <em>New England Journal of Medicine, 368</em>(23), 2182–2191. https://doi.org/10.1056/NEJMoa1211853',
    'Resick, P. A., Nishith, P., Weaver, T. L., Astin, M. C., & Feuer, C. A. (2002). A comparison of cognitive-processing therapy with prolonged exposure and a waiting condition for the treatment of chronic posttraumatic stress disorder in female rape victims. <em>Journal of Consulting and Clinical Psychology, 70</em>(4), 867–879. https://doi.org/10.1037/0022-006X.70.4.867',
    'Morland, L. A., Mackintosh, M.-A., Rosen, C. S., Willis, E., Resick, P., Chard, K., & Frueh, B. C. (2015). Telemedicine versus in-person delivery of cognitive processing therapy for women with posttraumatic stress disorder: A randomized noninferiority trial. <em>Depression and Anxiety, 32</em>(11), 811–820. https://doi.org/10.1002/da.22397',
    'Resick, P. A., Wachen, J. S., Mintz, J., Young-McCaughan, S., Roache, J. D., Borah, A. M., Borah, E. V., Dondanville, K. A., Hembree, E. A., Litz, B. T., & Peterson, A. L. (2015). A randomized clinical trial of group cognitive processing therapy compared with group present-centered therapy for PTSD among active duty military personnel. <em>Journal of Consulting and Clinical Psychology, 83</em>(6), 1058–1068. https://doi.org/10.1037/ccp0000016',
    'Chard, K. M., Ricksecker, E. G., Healy, E. T., Karlin, B. E., & Resick, P. A. (2012). Dissemination and experience with cognitive processing therapy. <em>Journal of Rehabilitation Research and Development, 49</em>(5), 667–678. https://doi.org/10.1682/JRRD.2011.10.0198',
    'Resick, P. A., Galovski, T. E., Uhlmansiek, M. O., Scher, C. D., Clum, G. A., & Young-Xu, Y. (2008). A randomized clinical trial to dismantle components of cognitive processing therapy for posttraumatic stress disorder in female victims of interpersonal violence. <em>Journal of Consulting and Clinical Psychology, 76</em>(2), 243–258. https://doi.org/10.1037/0022-006X.76.2.243',
    'American Psychological Association. (2017). <em>Clinical practice guideline for the treatment of posttraumatic stress disorder (PTSD) in adults</em>. APA. https://www.apa.org/ptsd-guideline',
    'VA/DoD Clinical Practice Guideline Working Group. (2023). <em>VA/DoD clinical practice guideline for the management of posttraumatic stress disorder and acute stress disorder</em> (Version 4.0). U.S. Department of Veterans Affairs and U.S. Department of Defense. https://www.healthquality.va.gov/guidelines/MH/ptsd/',
    'Litz, B. T., Stein, N., Delaney, E., Lebowitz, L., Nash, W. P., Silva, C., & Maguen, S. (2009). Moral injury and moral repair in war veterans: A preliminary model and intervention strategy. <em>Clinical Psychology Review, 29</em>(8), 695–706. https://doi.org/10.1016/j.cpr.2009.07.003',
    'Kaysen, D., Schumm, J., Pedersen, E. R., Strachan, M., Rosen, C. S., & Resick, P. (2014). Cognitive processing therapy for veterans with comorbid PTSD and alcohol use disorders. <em>Addictive Behaviors, 39</em>(2), 420–427. https://doi.org/10.1016/j.addbeh.2013.08.016',
    'Wachen, J. S., Dondanville, K. A., Pruiksma, K. E., Molino, A., Carson, C. S., Blankenship, A. E., Young-McCaughan, S., Mintz, J., Litz, B. T., Hembree, E. A., Roache, J. D., & Peterson, A. L. (2016). Implementing cognitive processing therapy for posttraumatic stress disorder with active duty U.S. military personnel: Special considerations and case examples. <em>Cognitive and Behavioral Practice, 23</em>(2), 133–147. https://doi.org/10.1016/j.cbpra.2015.02.003',
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// WORD COUNT UTILITY
// ═══════════════════════════════════════════════════════════════════════════
function stripHtml(html) {
  return (html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function countWords(text) {
  const clean = stripHtml(text);
  return clean.length === 0 ? 0 : clean.split(/\s+/).length;
}

function tallyWords(course) {
  let total = 0;
  for (const section of course.sections || []) {
    for (const block of section.contentBlocks || []) {
      if (block.content) total += countWords(block.content);
      if (block.title && typeof block.title === 'string') total += countWords(block.title);
      if (block.subtitle && typeof block.subtitle === 'string') total += countWords(block.subtitle);
      if (block.question) total += countWords(block.question);
      if (block.explanation) total += countWords(block.explanation);
      if (block.instructions) total += countWords(block.instructions);
      if (block.caption) total += countWords(block.caption);
      if (block.takeaways) for (const t of block.takeaways) total += countWords(t);
      if (block.flashcards) for (const f of block.flashcards) total += countWords(f.front) + countWords(f.back);
      if (block.accordionItems) for (const a of block.accordionItems) total += countWords(a.title) + countWords(a.content);
      if (block.options) for (const o of block.options) total += countWords(o.text) + countWords(o.explanation || '');
      if (block.matchingPairs) for (const p of block.matchingPairs) total += countWords(p.term) + countWords(p.definition);
      if (block.steps) for (const s of block.steps) total += countWords(s.text);
      if (block.resources) for (const r of block.resources) total += countWords(r.title) + countWords(r.description || '');
      if (block.cards) for (const c of block.cards) total += countWords(c.text);
      if (block.nodes) for (const n of Object.values(block.nodes)) {
        total += countWords(n.text);
        if (n.choices) for (const ch of n.choices) total += countWords(ch.text);
      }
      if (block.calloutType && block.content) { /* already counted above */ }
    }
  }
  if (course.assessment && course.assessment.questions) {
    for (const q of course.assessment.questions) {
      total += countWords(q.question);
      if (q.options) for (const o of q.options) total += countWords(o.text);
      if (q.explanation) total += countWords(q.explanation);
    }
  }
  return total;
}

// ═══════════════════════════════════════════════════════════════════════════
// VALIDATION
// ═══════════════════════════════════════════════════════════════════════════
function validate(course) {
  const errors = [];

  if (!course.slug) errors.push('Missing slug');
  if (!course.courseCode) errors.push('Missing courseCode');
  if (!course.title) errors.push('Missing title');
  if (!course.ceHours || course.ceHours < 1) errors.push('Missing or invalid ceHours');

  // Section count
  if (!course.sections || course.sections.length < 3) {
    errors.push(`Need at least 3 sections (intro + 2 content); found ${(course.sections || []).length}`);
  }

  // Resources block in final section
  const lastSection = (course.sections || []).slice(-1)[0];
  if (lastSection) {
    const hasResources = (lastSection.contentBlocks || []).some(b => b.type === 'resources');
    if (!hasResources) errors.push('Final section must include an inline resources block');
    const resourcesBlock = (lastSection.contentBlocks || []).find(b => b.type === 'resources');
    if (resourcesBlock && (!resourcesBlock.resources || resourcesBlock.resources.length < 6)) {
      errors.push(`Resources block needs at least 6 items; found ${(resourcesBlock.resources || []).length}`);
    }
  }

  // References
  if (!course.references || course.references.length < 15) {
    errors.push(`Need at least 15 references; found ${(course.references || []).length}`);
  }

  // Assessment
  if (!course.assessment || !course.assessment.questions || course.assessment.questions.length < 15) {
    errors.push(`Assessment needs 15–20 questions; found ${(course.assessment?.questions || []).length}`);
  }

  // Word count
  const wc = tallyWords(course);
  const required = course.ceHours * 6000;
  if (wc < required) {
    errors.push(`Word count too low: ${wc} words (need ${required} for ${course.ceHours} CE hours)`);
  } else {
    console.log(`✔  Word count: ${wc} words (${course.ceHours} CE hrs × 6,000 = ${required} minimum)`);
  }

  // Content section structural requirements
  const contentSections = (course.sections || []).slice(1); // skip intro
  for (let i = 0; i < contentSections.length; i++) {
    const s = contentSections[i];
    const types = (s.contentBlocks || []).map(b => b.type);
    const required_types = ['sectionDivider', 'text', 'callout', 'accordion', 'imageText', 'reflection', 'keyTakeaway'];
    for (const t of required_types) {
      if (!types.includes(t)) errors.push(`Section ${i + 1} missing block type: ${t}`);
    }
    // KC blocks
    const kcTypes = types.filter(t => ['multipleChoice', 'multiSelect', 'matching'].includes(t));
    if (kcTypes.length < 2) errors.push(`Section ${i + 1} needs at least 2 KC blocks; found ${kcTypes.length}`);
    // Interactive activity
    const activityTypes = types.filter(t => ['sequencing', 'scenarioTree', 'cardSort', 'flashcardDeck'].includes(t));
    if (activityTypes.length < 1) errors.push(`Section ${i + 1} needs at least 1 interactive activity`);
  }

  return errors;
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════
async function main() {
  console.log('\n══════════════════════════════════════════════════════════');
  console.log(`Seeding: ${COURSE.courseCode} — ${COURSE.title}`);
  console.log('══════════════════════════════════════════════════════════\n');

  // Validate before touching the database
  const errors = validate(COURSE);
  if (errors.length > 0) {
    console.error('❌  Validation failed:');
    for (const e of errors) console.error(`   • ${e}`);
    process.exit(1);
  }
  console.log('✔  Validation passed\n');

  // Connect
  const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!MONGO_URI) {
    console.error('❌  No MONGO_URI or MONGODB_URI in environment');
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI);
  console.log('✔  Connected to MongoDB\n');

  // Normalize order on sections/contentBlocks — required by schema, and the
  // model's pre('save') autofill runs AFTER validation so it can't rescue this.
  (COURSE.sections || []).forEach((sec, si) => {
    if (sec.order === undefined || sec.order === null) sec.order = si;
    (sec.contentBlocks || []).forEach((blk, bi) => {
      if (blk && (blk.order === undefined || blk.order === null)) blk.order = bi;
    });
  });

  // Upsert
  const existing = await InteractiveCourse.findOne({ slug: SLUG });
  if (existing) {
    console.log(`Found existing document (${existing._id}). Updating…`);
    existing.set(COURSE);
    await existing.save();
    console.log('✔  Updated successfully');
  } else {
    const doc = new InteractiveCourse(COURSE);
    await doc.save();
    console.log(`✔  Created new document (${doc._id})`);
  }

  await mongoose.disconnect();
  console.log('✔  Disconnected\n');
  console.log(`Done: ${COURSE.courseCode} — ${COURSE.title}`);
  console.log('══════════════════════════════════════════════════════════\n');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
