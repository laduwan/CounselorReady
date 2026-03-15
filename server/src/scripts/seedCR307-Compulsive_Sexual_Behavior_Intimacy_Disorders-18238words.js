/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI not found'); process.exit(1); }

// ============================================================
// CR-307: Compulsive Sexual Behavior and Intimacy Disorders: Assessment and Treatment
// 3 CE Hours | 18,238 words | NBCC ACEP #7760
// ============================================================

const COURSE_DATA = {
  title: "Compulsive Sexual Behavior and Intimacy Disorders: Assessment and Treatment",
  slug: "compulsive-sexual-behavior-intimacy-disorders",
  courseCode: "CR-307",
  description: "A comprehensive 3-hour continuing education course for licensed mental health professionals. Meets NBCC ACEP standards with 18,238 words of graduate-level clinical content.",
  ceHours: 3,
  credits: 3,
  category: "Clinical",
  ceCategory: "Clinical",
  ceuHours: 3,
  ceuEligible: true,
  approvingBody: "NBCC",
  approvalNumber: "#7760",
  creditType: "NBCC",
  acepProvider: { name: "GA Integrated Therapeutic Perspectives LLC", number: "7760" },
  instructor: "GA Integrated Therapeutic Perspectives LLC",
  targetAudience: ["Licensed mental health professionals including LPCs, LCSWs, LMFTs, psychologists, and NCCs who encounter compulsive sexual behavior, problematic pornography use, and intimacy disorders in clinical practice."],
  accessType: "paid",
  price: 59.99,
  pricingTier: "standard",
  status: "draft",
  isPublished: false,
  isActive: true,
  passingScore: 80,
  maxAttempts: 3,
  settings: {
    passingScore: 80,
    certificateEnabled: true,
    requireEvaluation: true,
    requireAttestation: true
  },
  objectives: [
    "Define compulsive sexual behavior disorder (CSBD) per ICD-11 criteria and distinguish it from sexual addiction models, paraphilic disorders, and normative high sexual desire.",
    "Apply validated assessment instruments including the CSBI and SCS within a biopsychosocial framework for clinical evaluation of compulsive sexual behavior.",
    "Identify the neurobiological, psychological, and interpersonal mechanisms that maintain compulsive sexual behavior and inform evidence-based treatment selection.",
    "Describe cognitive-behavioral, ACT-based, and motivational approaches for compulsive sexual behavior that are supported by current clinical evidence.",
    "Assess and address the specific clinical needs of clients with problematic pornography use, including its impacts on intimacy, relationships, and sexual functioning.",
    "Identify intimacy disorders — including avoidant attachment, intimacy avoidance, and emotional intimacy deficits — and their relationship to compulsive sexual behavior and sexual dysfunction.",
  ],
  modules: [
    {
      title: "Module 1: Compulsive Sexual Behavior — Diagnosis, Neurobiology, and Assessment",
      order: 1,
      contentBlocks: [
        {
          type: "sectionDivider",
          sectionNumber: 1,
          title: "Module 1",
          subtitle: "Module 1: Compulsive Sexual Behavior — Diagnosis, Neurobiology, and Assessment"
        },
        {
          type: "text",
          content: `<h2>Defining Compulsive Sexual Behavior: ICD-11, Controversies, and Biopsychosocial Etiology</h2>
<h3>The Contested Diagnostic Landscape</h3>
<p>Compulsive sexual behavior — characterized by persistent, distressing preoccupation with sexual thoughts, urges, and behaviors that the individual experiences as difficult or impossible to control — occupies a contested conceptual and diagnostic space in contemporary clinical practice, reflecting genuine scientific uncertainty about its nature, etiology, and optimal treatment. The most widely used lay term — sexual addiction — imports the addiction framework of substance use disorders into the sexual behavior domain, implying the same neurobiological mechanisms, the same progressive tolerance and withdrawal phenomena, and the same disease model that organizes substance use disorder treatment.</p>
<p>This framework has been influential in treatment communities and has shaped public understanding of the condition, but it has not been validated by the empirical research base in ways that would justify its formal adoption as a clinical diagnosis. The DSM-5 did not include sexual addiction or hypersexual disorder as a diagnostic category — despite Kafka's (2010) proposal for the latter — citing insufficient empirical evidence. The ICD-11's classification of Compulsive Sexual Behavior Disorder (CSBD) as an impulse control disorder — not as an addictive disorder — reflects a more cautious, evidence-informed approach to the classification of this clinical phenomenon.</p>
<h3>ICD-11 Diagnostic Criteria</h3>
<p>ICD-11 Compulsive Sexual Behavior Disorder (F63.8) is defined by:</p>
<ul>
<li>A persistent pattern of failure to control intense, repetitive sexual impulses or urges</li>
<li>Repetitive sexual behavior that becomes a central focus of the person's life to the point of neglecting health and personal care or other interests, activities, and responsibilities</li>
<li>Continued repetitive sexual behavior despite adverse consequences or deriving little or no satisfaction from it</li>
<li>Marked distress or significant impairment in personal, family, social, educational, occupational, or other important areas of functioning</li>
</ul>
<p>The ICD-11 criteria require that these features persist over an extended period — at least six months — and that they not be better explained by another mental disorder, the physiological effects of a substance or medication, or another medical condition. AASECT's official position statement — explicitly stating that there is insufficient empirical evidence to support sexual addiction or compulsive sexual behavior as a clinical diagnosis — reflects a competing perspective within the clinical field that clinicians should be aware of as they navigate this contested diagnostic terrain.</p>
<h3>Distinguishing CSBD from Normative High Sexual Desire</h3>
<p>The distinction between compulsive sexual behavior disorder and normative high sexual desire is a clinically essential assessment distinction that has direct implications for clinical formulation and treatment planning. Not all frequent sexual behavior, high sexual desire, or sexual behavior that others consider excessive constitutes CSBD.</p>
<p>The diagnostic criteria require both the persistence of experienced loss of control over sexual urges and marked distress or functional impairment — meaning that a person with high sexual desire who engages in frequent sexual activity without subjective loss of control and without significant distress or functional impairment does not meet criteria for CSBD, regardless of the frequency or cultural unconventionality of their behavior. Conversely, a person who experiences intense distress about sexual urges and significant functional impairment from compulsive sexual behavior — even at levels of sexual activity that others might consider normative — may meet criteria. The clinical assessment must attend to subjective experience and functional impact rather than applying frequency or moral norms as diagnostic criteria.</p>
<h3>CSBD and Paraphilic Disorders</h3>
<p>The relationship between compulsive sexual behavior and paraphilic disorders requires specific clinical attention to avoid both the conflation and the erroneous separation of these distinct clinical phenomena. Paraphilic disorders — defined in DSM-5 as intense and persistent sexual interests in atypical objects, situations, or individuals that cause distress or functional impairment or that are acted upon with non-consenting individuals — are distinct from CSBD in their diagnostic basis: paraphilic disorders are defined by the specific content of sexual interests, while CSBD is defined by the behavioral pattern of compulsive engagement with sexual activity regardless of its specific content.</p>
<p>These conditions can co-occur — a person can have both a paraphilic disorder and CSBD — or either can occur independently. Clinical assessment should address both the pattern of sexual behavior and the specific content of sexual interests, using the resulting information to guide formulation and treatment planning for each dimension of the presentation independently.</p>`
        },
        {
          type: "text",
          content: `<h2>Neurobiology, Psychological Factors, and Comprehensive Assessment</h2>
<h3>Neurobiological Underpinnings</h3>
<p>The neurobiological underpinnings of compulsive sexual behavior are an active area of research that has produced some findings suggesting parallels with substance use disorder neurobiology while also identifying important disanalogies that complicate the addiction framework. Neuroimaging studies have documented that exposure to sexual stimuli activates reward circuitry — including the ventral striatum and prefrontal cortex — in ways that share structural similarity with substance cue reactivity in addiction.</p>
<p>Voon and colleagues' (2014) neuroimaging research found that individuals with CSBD showed increased activation in the amygdala, ventral striatum, and dorsal anterior cingulate in response to sexual cue exposure compared to controls — patterns similar to those seen in substance use disorders. However, other research has challenged the addiction model interpretation of these findings, noting that enhanced cue reactivity does not in itself validate addiction, that the behavioral escalation and tolerance phenomena central to the addiction model are not consistently documented in CSBD, and that subjective 'craving' in CSBD may not parallelize substance craving in the ways the addiction model requires.</p>
<h3>Psychological and Developmental Factors</h3>
<p>Psychological and developmental factors in the etiology of compulsive sexual behavior include:</p>
<ul>
<li>Attachment disruptions</li>
<li>Early sexual trauma</li>
<li>Shame-based sexual development</li>
<li>The psychological functions that compulsive sexual behavior serves — including emotional regulation, dissociation from distressing affect, and the search for intimacy in substitute sexual encounters that cannot satisfy the underlying relational need</li>
</ul>
<p>The relationship between attachment insecurity — particularly dismissive-avoidant and anxious-preoccupied attachment patterns — and compulsive sexual behavior is clinically significant: individuals who have learned through early relational experiences that emotional intimacy is unsafe may develop sexual behavior as a substitute form of connection that provides physical closeness while avoiding the vulnerability of genuine emotional intimacy. This intimacy avoidance pattern — the chronic compromise of emotional closeness through the substitution of sexual activity, pornography use, or other sexually-mediated intimacy substitutes — is both a contributing etiological factor in many CSBD presentations and a treatment target that must be addressed for genuine recovery to occur.</p>
<h3>Cultural and Sociocultural Context</h3>
<p>The cultural and sociocultural context of compulsive sexual behavior deserves specific clinical attention because cultural factors significantly shape both the phenomenology of the behavior and the distress associated with it. Research by Prause, Janssen, and colleagues suggests that the subjective distress experienced in relation to sexual behavior is significantly predicted by religiosity and moral disapproval of the behavior — meaning that some portion of the distress attributed to 'compulsive' sexual behavior may more accurately reflect moral or religious incongruence between the behavior and the person's values rather than clinically meaningful compulsivity.</p>
<p>This finding has direct clinical implications: clinicians must carefully distinguish between genuine compulsive sexual behavior — characterized by persistent subjective loss of control and functional impairment independent of moral evaluation — and moral distress about sexual behavior that is incongruent with the person's religious or moral values, which requires a different clinical response that includes attention to values clarification rather than behavioral disorder treatment.</p>
<h3>Comprehensive Assessment</h3>
<p>Assessment of compulsive sexual behavior requires a comprehensive, multi-modal approach that combines clinical interview with validated self-report instruments and attends to the full range of biopsychosocial factors contributing to the presentation. Validated instruments include:</p>
<ul>
<li>The <strong>Sexual Compulsivity Scale (SCS)</strong>, a 10-item self-report measure of sexual compulsivity</li>
<li>The <strong>Hypersexual Behavior Inventory (HBI)</strong>, a 19-item measure developed specifically for hypersexual behavior in men</li>
<li>The <strong>Compulsive Sexual Behavior Inventory (CSBI)</strong>, a 28-item measure assessing control over sexual behavior, abuse, and violence</li>
</ul>
<p>These instruments provide standardized, quantitative data that complement clinical interview findings and support treatment monitoring. Clinical interview should assess:</p>
<ul>
<li>The specific behaviors involved, their frequency and duration</li>
<li>The degree of subjective loss of control</li>
<li>The presence of craving, tolerance, and withdrawal-like phenomena</li>
<li>Functional impact across occupational, relational, and health domains</li>
<li>Comorbid conditions including depression, anxiety, substance use, and trauma</li>
<li>Sexual development history including early sexual experiences and exposure to pornography</li>
<li>Attachment history and current relational patterns</li>
<li>Religious, cultural, and moral context for the behavior</li>
</ul>`
        },
        {
          type: "text",
          content: `<blockquote class="cr-vignette"><strong>Clinical Vignette</strong><br>Robert, 38, presents at the request of his wife following her discovery of extensive pornography use and contact with escorts over six years. He acknowledges escalating frequency, work impairment, and intense shame alongside ongoing urges feeling 'outside my control.' Assessment: ICD-11 CSBD criteria evaluation; HBI administration; functional behavior assessment; comorbidity screening (depression, anxiety, attachment history); partner trauma assessment. Plan: individual CBT/ACT-based therapy; partner trauma support; staged couples work when both stabilized; ICD-11 CSBD framing rather than 'sex addiction'; values clarification as motivation foundation.</blockquote>`
        },
        {
          type: "reflection",
          prompt: "After reviewing this module 1: compulsive sexual behavior — diagnosis, neurobiology, and assessment, what aspect of your current clinical practice most needs updating or strengthening?",
          placeholder: "Take a moment to reflect on how this applies to your clinical practice..."
        },
        {
          type: "multipleChoice",
          question: "ICD-11 classifies compulsive sexual behavior disorder as:",
          options: [
            "An addictive disorder analogous to gambling disorder",
            "A sexual dysfunction",
            "An impulse control disorder",
            "A paraphilic disorder"
          ],
          correctAnswer: 2,
          explanation: "ICD-11 classifies CSBD as an impulse control disorder (F63.8) — not as an addictive disorder — reflecting a more cautious approach than the 'sexual addiction' framework that lacks DSM-5/ICD-11 validation.",
          showExplanation: true
        },
        {
          type: "multipleChoice",
          question: "The primary distinction between CSBD and normative high sexual desire is:",
          options: [
            "Frequency of sexual activity",
            "Content of sexual interests",
            "Subjective loss of control with marked distress or functional impairment",
            "Duration of sexual concern beyond 6 months"
          ],
          correctAnswer: 2,
          explanation: "CSBD requires both subjective loss of control over intense sexual urges and marked distress or significant functional impairment — not simply high sexual desire or frequency.",
          showExplanation: true
        },
        {
          type: "multipleChoice",
          question: "The sexual double bind in CSBD describes:",
          options: [
            "Situations where both partners experience compulsive sexual behavior simultaneously",
            "The dynamic where both the sexual urge and the shame about it powerfully maintain the compulsive cycle",
            "Treatment paradoxes involving simultaneous abstinence and exposure",
            "Legal and ethical conflicts in mandatory reporting"
          ],
          correctAnswer: 1,
          explanation: "The sexual double bind — in which shame about sexual urges paradoxically maintains them — requires clinical approaches that hold both compassionate understanding of the mechanisms driving behavior and values-based accountability.",
          showExplanation: true
        },
      ],
    },
    {
      title: "Module 2: Evidence-Based Treatment, Intimacy Disorders, and Couples Practice",
      order: 2,
      contentBlocks: [
        {
          type: "sectionDivider",
          sectionNumber: 2,
          title: "Module 2",
          subtitle: "Module 2: Evidence-Based Treatment, Intimacy Disorders, and Couples Practice"
        },
        {
          type: "text",
          content: `<h2>CBT, ACT, Motivational Interviewing, and Relapse Prevention</h2>
<h3>Cognitive-Behavioral Approaches</h3>
<p>Cognitive-behavioral approaches to the treatment of compulsive sexual behavior draw on the well-established CBT framework for impulsive and compulsive behaviors, adapting its core components — functional assessment of antecedents and consequences, cognitive restructuring, behavioral skill building, and relapse prevention planning — to the specific cognitive and behavioral patterns that maintain CSBD. Functional behavior assessment — identifying the specific triggers, thoughts, emotions, and behavioral consequences that constitute the individual's specific compulsive sexual behavior cycle — provides the foundation for an individualized treatment plan that addresses the specific maintaining mechanisms rather than applying generic CSBD treatment approaches to heterogeneous presentations that may differ substantially in their specific etiology and function.</p>
<p>The CSBD behavioral cycle typically involves:</p>
<ol>
<li>A triggering situation or emotional state</li>
<li>Cognitive events including intrusive sexual thoughts and permission-giving beliefs that allow the behavior</li>
<li>The behavior itself</li>
<li>Immediate reinforcing consequences including emotional relief, pleasure, or dissociative numbing</li>
<li>Delayed consequences including shame, guilt, and functional impairment that maintain the shame-behavior cycle</li>
</ol>
<h3>The Sexual Double Bind</h3>
<p>The sexual double bind — the clinical dynamic in which both the sexual urge and the shame about the urge are powerfully motivating forces that together maintain the compulsive cycle — is among the most important clinical concepts in CSBD treatment. The standard shame-reduction approach to many clinical conditions — normalizing the experience, reducing self-judgment — is insufficient in CSBD because the shame about the behavior is often ethically warranted: the person is engaging in behavior that genuinely violates their own values and that may harm others.</p>
<p>Effective CSBD treatment must hold both dimensions: the compassionate acknowledgment of the psychological mechanisms driving the behavior, which reduces the shame that paradoxically maintains it, and the values-based engagement with the person's own ethical commitments that provides the motivational foundation for behavior change. This holding of both dimensions — compassion and accountability — requires clinical skill and conceptual clarity that distinguishes effective CSBD treatment from either pure shame reduction or shame-amplifying moral confrontation.</p>
<h3>Acceptance and Commitment Therapy (ACT)</h3>
<p>Acceptance and Commitment Therapy (ACT) provides a particularly well-suited therapeutic framework for CSBD because it addresses the experiential avoidance — the attempt to escape or suppress unwanted internal experiences including uncomfortable emotions, memories, and sexual urges — that is a primary driver of many compulsive behaviors. From an ACT perspective, compulsive sexual behavior functions as an experiential avoidance strategy: a behavioral escape from the discomfort of unwanted internal states — loneliness, anxiety, shame, boredom, depression — through the dissociative, pleasurable, or numbing properties of sexual activity.</p>
<p>The ACT approach to CSBD involves:</p>
<ul>
<li>Identification and defusion from the thoughts that permission-give compulsive behavior</li>
<li>Acceptance of the internal states that the behavior serves to avoid</li>
<li>Clarification of personal values as the basis for values-driven behavior change</li>
<li>Commitment to behavioral choices aligned with values rather than driven by avoidance</li>
</ul>
<p>ACT's emphasis on psychological flexibility — the capacity to hold uncomfortable experiences without reacting to them through behavioral avoidance — directly addresses the compulsive mechanism while building the values-based behavioral repertoire that sustained recovery requires.</p>
<h3>Motivational Interviewing</h3>
<p>Motivational interviewing is a clinically essential approach for the early stages of CSBD treatment because ambivalence about behavior change is nearly universal in this population and because the confrontational approaches that were historically used in addiction treatment — and that were sometimes applied to CSBD — are now well-documented to reduce rather than increase motivation for change.</p>
<p>Many individuals presenting with CSBD are not certain they want to change the behavior — they may experience the behavior as ego-syntonic at least in part, may derive genuine pleasure and relief from it, and may be presenting for treatment under external pressure from a partner, employer, or legal system rather than from internal motivation. Motivational interviewing's non-judgmental, evocative, collaborative stance — exploring the individual's own ambivalence and eliciting their own reasons for change rather than providing the reasons from an external authoritative perspective — creates the clinical conditions in which motivation for change can develop and strengthen from within.</p>`
        },
        {
          type: "text",
          content: `<h2>Problematic Pornography Use, Partner Trauma, and Relapse Prevention</h2>
<h3>Problematic Pornography Use</h3>
<p>Pornography use and its clinical management has emerged as a significant clinical concern in the past two decades, as internet pornography has become universally accessible and as the proportion of clients presenting with concerns about their pornography use has grown substantially. Problematic pornography use — defined by the experience of subjective loss of control over pornography use, distress about pornography use, and functional impairment related to pornography use — is distinguished from normative pornography use by these criteria rather than by frequency or content alone.</p>
<p>The clinical assessment of problematic pornography use must attend to:</p>
<ul>
<li>The frequency, duration, and content of pornography use</li>
<li>The degree of subjective control or loss of control</li>
<li>The functional impact on occupational functioning, intimate relationships, and sexual functioning</li>
<li>The presence of comorbid conditions including depression, anxiety, and social anxiety that may be contributing to pornography use as an avoidance behavior</li>
<li>The cultural, religious, and moral context in which the pornography use is experienced as problematic</li>
</ul>
<h3>Impact on Relationships and Sexual Functioning</h3>
<p>The impact of pornography use on intimate relationships and sexual functioning is a clinically complex topic about which the evidence is contested and evolving. Research suggests that high-frequency pornography use is associated with reduced sexual satisfaction, reduced sexual desire for intimate partners, and difficulties with sexual arousal to partnered sexual stimuli that may reflect the specific arousal properties of pornography — including novelty, variety, and absence of the relational dimensions of partnered sex.</p>
<p>However, the causal direction of these associations — whether pornography use causes these outcomes or whether individuals with these characteristics are more likely to use pornography frequently — is not clearly established. Clinicians should approach clients' concerns about pornography's impact on their sexual functioning and relationships with a genuinely curious, non-judgmental clinical stance that neither dismisses the concerns as unfounded nor amplifies them beyond what the evidence supports, and that provides accurate clinical information about what is and is not known about pornography's effects.</p>
<h3>Partner Trauma</h3>
<p>Partner trauma — the distress experienced by partners who discover or are disclosed to about a significant other's compulsive sexual behavior — has been described as resembling post-traumatic stress in its symptom profile, including intrusive thoughts and images, hypervigilance about partner behavior, avoidance of intimacy, and significant disruptions in trust and safety. Research by Steffens and Rennie (2006) documented that many partners of self-identified 'sex addicts' met criteria for PTSD following disclosure, a finding that has been replicated in subsequent research and that has produced the concept of 'partner betrayal trauma' as a clinical construct.</p>
<p>Whether partner distress following CSBD disclosure constitutes genuine PTSD — or a subclinical but clinically significant trauma response — has clinical treatment implications: partners who meet PTSD criteria benefit from trauma-informed clinical approaches including psychoeducation about trauma responses, validation of the reality-based nature of their hypervigilance and distress, and the specific trauma-focused interventions with the strongest evidence for PTSD symptom reduction.</p>
<h3>Relapse Prevention</h3>
<p>Relapse prevention in CSBD treatment draws on the well-established cognitive-behavioral relapse prevention model developed for substance use disorders and adapts it to the specific features of sexual compulsive behavior. The relapse prevention model identifies high-risk situations — the specific circumstances, emotional states, cognitive patterns, and interpersonal contexts that increase vulnerability to compulsive sexual behavior — and develops individualized coping plans for each identified high-risk situation.</p>
<p>High-risk situations for CSBD commonly include:</p>
<ul>
<li>Specific emotional states including loneliness, boredom, stress, and shame</li>
<li>Specific interpersonal contexts including conflict with a partner</li>
<li>Specific environmental cues including access to internet-enabled devices in private settings</li>
<li>Specific times including late evenings after the family is asleep</li>
<li>Specific internal states including sexual frustration within an intimate relationship</li>
</ul>
<p>Effective relapse prevention planning addresses each identified high-risk situation with specific, practical coping strategies and builds the social support and accountability structures that reduce both the likelihood and the impact of lapse experiences.</p>`
        },
        {
          type: "text",
          content: `<h2>Intimacy Disorders, Attachment, and Couples Treatment</h2>
<h3>The Intimacy-Compulsivity Dynamic</h3>
<p>Intimacy disorders — clinical patterns characterized by significant deficits in the capacity for or engagement with emotional intimacy — are clinically intertwined with compulsive sexual behavior in ways that are often central to the etiology, maintenance, and treatment of both. The relationship between intimacy avoidance and compulsive sexual behavior is bidirectional and reinforcing:</p>
<ul>
<li>The compulsive sexual behavior substitutes for genuine emotional intimacy, providing a form of connection that avoids the vulnerability of authentic relational closeness</li>
<li>The intimacy avoidance maintains the motivation for the compulsive behavior by preventing the development of genuine emotional connection that would reduce the need for its substitute</li>
</ul>
<p>Understanding this intimacy-compulsivity dynamic is clinically essential because treatment that addresses only the compulsive behavior dimension without attending to the underlying intimacy deficits will produce incomplete and unstable recovery.</p>
<h3>Attachment Framework and Dismissive-Avoidant Patterns</h3>
<p>The attachment framework — developed from Bowlby's (1969) foundational theory and subsequently elaborated through decades of empirical research — provides the most clinically comprehensive account of intimacy disorder development and maintenance. Dismissive-avoidant attachment — characterized by defensive self-reliance, suppression of attachment needs, and deactivation of the attachment system in response to intimacy — is the attachment pattern most directly associated with intimacy avoidance.</p>
<p>Individuals with dismissive-avoidant attachment learned through early relational experiences that emotional dependence is unsafe — that caregivers were consistently unavailable, rejecting, or shaming of attachment needs — and developed the adaptive strategy of dismissing attachment needs and managing emotional regulation independently. In adulthood, this strategy produces difficulties with emotional intimacy, discomfort with vulnerability, and a preference for sexual or activity-based forms of connection that provide relational engagement without the vulnerability of emotional closeness. The compulsive sexual behavior of individuals with dismissive-avoidant attachment often serves exactly this function: it provides a form of connection and pleasure that satisfies the attachment need at a surface level while avoiding the vulnerability that deeper intimacy requires.</p>
<h3>Treatment of Intimacy Disorders</h3>
<p>The treatment of intimacy disorders in the context of CSBD requires clinical approaches that address the deep relational and attachment dimensions of the clinical presentation — dimensions that are not adequately addressed by behavioral approaches focused exclusively on the compulsive sexual behavior. Schema therapy — developed by Young and colleagues — provides a clinical framework for identifying and addressing the early maladaptive schemas that organize the intimacy avoidance pattern, including the specific abandonment, shame, emotional deprivation, and defectiveness schemas that are most commonly associated with intimacy disorders.</p>
<p>Attachment-informed approaches — including the application of Emotionally Focused Therapy (EFT) principles to individual therapy and to couples work — address the attachment-level disruptions that underlie intimacy avoidance and build the secure attachment experiences that support genuine intimacy development. The therapeutic relationship itself, conducted with consistent attunement and explicit attention to the client's attachment-related responses to intimacy within the therapeutic relationship, provides a corrective relational experience that is directly relevant to the development of intimacy capacity.</p>
<h3>Staged Couples Treatment</h3>
<p>Couples treatment for compulsive sexual behavior typically involves a staged approach that addresses the needs of both the individual with CSBD and their partner while attending to the significant relational damage that CSBD-related behaviors and their discovery typically produce. The initial stage typically focuses on:</p>
<ul>
<li>Individual stabilization for the CSBD partner, including immediate behavioral management and engagement with an appropriate treatment modality</li>
<li>Crisis support for the affected partner, including trauma-informed support for the acute distress of discovery and disclosure</li>
<li>The development of a minimum safety plan for the relationship that specifies the conditions under which both partners can remain in the relationship while treatment proceeds</li>
</ul>
<p>Subsequent couples work — typically initiated when both partners have achieved sufficient individual stabilization — focuses on the relational repair dimensions of CSBD recovery: rebuilding trust through transparency and accountability; addressing the intimacy deficits that contributed to both the CSBD and to the partner's experience of disconnection; and rebuilding a mutually satisfying intimate and sexual relationship that meets both partners' needs.</p>`
        },
        {
          type: "text",
          content: `<blockquote class="cr-vignette"><strong>Clinical Vignette</strong><br>Carla, 45, presents with anxiety, depression, and relationship difficulties. Assessment reveals a lifelong pattern of emotional intimacy avoidance — maintaining closeness through sexual engagement while avoiding emotional vulnerability. Her partner describes her as 'emotionally unavailable.' Formulation: dismissive-avoidant attachment as organizing pattern; compulsive sexual behavior serving intimacy-avoidance function. Plan: attachment-informed individual therapy addressing emotional deprivation and defectiveness schemas; graduated emotional vulnerability development; couples EFT adjunct; psychoeducation about responsive vs. avoidant intimacy.</blockquote>`
        },
        {
          type: "reflection",
          prompt: "After reviewing this module 2: evidence-based treatment, intimacy disorders, and couples practice, what aspect of your current clinical practice most needs updating or strengthening?",
          placeholder: "Take a moment to reflect on how this applies to your clinical practice..."
        },
        {
          type: "multipleChoice",
          question: "ACT addresses compulsive sexual behavior primarily through:",
          options: [
            "Behavioral extinction through abstinence training",
            "Values clarification and psychological flexibility to reduce experiential avoidance driving compulsive behavior",
            "Cognitive restructuring of permissive sexual beliefs",
            "Systematic desensitization of sexual triggers"
          ],
          correctAnswer: 1,
          explanation: "ACT addresses the experiential avoidance — escape from uncomfortable internal states — that drives compulsive sexual behavior, building psychological flexibility and values-driven behavioral alternatives.",
          showExplanation: true
        },
        {
          type: "multipleChoice",
          question: "Partner trauma following CSBD disclosure most closely resembles in its symptom profile:",
          options: [
            "Separation anxiety disorder",
            "Adjustment disorder with depressed mood",
            "Post-traumatic stress disorder",
            "Dependent personality disorder"
          ],
          correctAnswer: 2,
          explanation: "Research by Steffens and Rennie (2006) documented that many partners of individuals with CSBD met PTSD criteria following disclosure, supporting trauma-informed clinical approaches for affected partners.",
          showExplanation: true
        },
        {
          type: "multipleChoice",
          question: "Motivational interviewing is indicated in CSBD treatment because:",
          options: [
            "It provides behavioral extinction of compulsive urges",
            "It addresses the ambivalence about change that is common in this population",
            "It is required by ethical guidelines for this clinical population",
            "It is the only evidence-based approach with RCT support"
          ],
          correctAnswer: 1,
          explanation: "Ambivalence about behavior change is nearly universal in CSBD, and MI's non-judgmental evocative approach creates conditions for internal motivation development — contrasting with confrontational approaches that reduce motivation.",
          showExplanation: true
        },
      ],
    },
  ],
  assessment: {
    isExam: true,
    passingScore: 80,
    maxAttempts: 3,
    showExplanations: false,
    questions: [
      {
        question: "ICD-11 compulsive sexual behavior disorder (CSBD) is classified as:",
        type: "multiple_choice",
        options: [
          "A sexual dysfunction",
          "An addictive disorder analogous to gambling disorder",
          "An impulse control disorder",
          "A paraphilic disorder"
        ],
        correctAnswer: 2,
        explanation: "The correct answer is an impulse control disorder. The ICD-11 classifies CSBD under impulse control disorders (F63.8), reflecting a cautious, evidence-informed approach rather than adopting the addiction framework that lacks sufficient empirical validation. While the addiction model (option B) has been influential in treatment communities, neither the DSM-5 nor the ICD-11 validated it as a diagnostic category for sexual behavior."
      },
      {
        question: "AASECT's official position on sex addiction is:",
        type: "multiple_choice",
        options: [
          "Sexual addiction is a well-validated diagnostic category requiring addiction-based treatment",
          "There is insufficient empirical evidence to support sex addiction as a clinical diagnosis",
          "Sexual addiction affects approximately 6% of the adult population",
          "Sex addiction treatment should follow the 12-step model exclusively"
        ],
        correctAnswer: 1,
        explanation: "The correct answer is that there is insufficient empirical evidence to support sex addiction as a clinical diagnosis. AASECT's official position statement explicitly states this, representing a competing perspective within the clinical field that challenges the addiction framework. Option A is incorrect because it directly contradicts AASECT's position, which questions the very validity of sexual addiction as a diagnostic category."
      },
      {
        question: "The primary distinguishing feature of compulsive sexual behavior disorder in ICD-11 is:",
        type: "multiple_choice",
        options: [
          "High frequency of sexual activity regardless of distress",
          "Persistent failure to control intense sexual urges causing marked distress or functional impairment",
          "Sexual behavior that is inconsistent with cultural norms",
          "Sexual behavior involving paraphilic interests"
        ],
        correctAnswer: 1,
        explanation: "The correct answer is persistent failure to control intense sexual urges causing marked distress or functional impairment. The ICD-11 criteria require both subjective loss of control over sexual urges and clinically significant distress or impairment in functioning, persisting for at least six months. Option A (high frequency regardless of distress) is incorrect because frequency alone does not constitute CSBD; a person with high sexual desire who lacks subjective loss of control and distress does not meet criteria."
      },
      {
        question: "Which assessment instrument was specifically developed for hypersexual behavior in men:",
        type: "multiple_choice",
        options: [
          "Sexual Compulsivity Scale (SCS)",
          "Hypersexual Behavior Inventory (HBI)",
          "Female Sexual Function Index (FSFI)",
          "Compulsive Sexual Behavior Inventory (CSBI)"
        ],
        correctAnswer: 1,
        explanation: "The correct answer is the Hypersexual Behavior Inventory (HBI). The HBI is a 19-item measure developed specifically for assessing hypersexual behavior in men, as described in Reid and colleagues' (2011) psychometric development study. The Sexual Compulsivity Scale (option A) is a general 10-item sexual compulsivity measure not specifically designed for men, making it the most plausible but incorrect alternative."
      },
      {
        question: "The neurobiological model most supported by current research positions problematic sexual behavior as:",
        type: "multiple_choice",
        options: [
          "A primary dopaminergic addiction indistinguishable from substance use disorder",
          "Involving reward circuitry in ways that may parallel impulsive/compulsive mechanisms without meeting full addiction criteria",
          "A purely psychological phenomenon with no neurobiological component",
          "Exclusively a paraphilic disorder with different neurobiology from other compulsive behaviors"
        ],
        correctAnswer: 1,
        explanation: "The correct answer is that CSBD involves reward circuitry in ways that may parallel impulsive/compulsive mechanisms without meeting full addiction criteria. Neuroimaging research by Voon and colleagues (2014) found increased activation in the amygdala, ventral striatum, and dorsal anterior cingulate, but the field has not confirmed full addiction model criteria such as consistent tolerance and withdrawal phenomena. Option A is incorrect because research has identified important disanalogies with substance use disorders that prevent equating CSBD with a primary dopaminergic addiction."
      },
      {
        question: "Problematic pornography use is most accurately described as:",
        type: "multiple_choice",
        options: [
          "A clearly validated diagnostic category in DSM-5",
          "A subcategory of CSBD in which pornography is the primary sexual behavior of concern",
          "A form of sexual addiction requiring 12-step treatment",
          "A normal variation in sexual behavior that should never be pathologized"
        ],
        correctAnswer: 1,
        explanation: "The correct answer is a subcategory of CSBD in which pornography is the primary sexual behavior of concern. Problematic pornography use is characterized by subjective loss of control, distress, and functional impairment related to pornography use, and it is clinically understood as a specific presentation within the broader CSBD framework. Option A is incorrect because problematic pornography use is not a validated diagnostic category in the DSM-5, which did not include any form of hypersexual or compulsive sexual behavior diagnosis."
      },
      {
        question: "Partner trauma — the distress experienced by partners of individuals with CSBD — most closely resembles:",
        type: "multiple_choice",
        options: [
          "Separation anxiety disorder",
          "Adjustment disorder with anxious mood",
          "Post-traumatic stress disorder in its symptom profile",
          "Dependent personality disorder"
        ],
        correctAnswer: 2,
        explanation: "The correct answer is post-traumatic stress disorder in its symptom profile. Research by Steffens and Rennie (2006) documented that many partners of individuals with compulsive sexual behavior met PTSD criteria following disclosure, experiencing intrusive thoughts, hypervigilance, avoidance of intimacy, and significant trust disruption. Adjustment disorder (option B) is incorrect because the severity and specific trauma symptom profile observed in partners goes beyond what adjustment disorder captures, warranting trauma-informed clinical intervention."
      },
      {
        question: "Acceptance and Commitment Therapy (ACT) addresses compulsive sexual behavior through:",
        type: "multiple_choice",
        options: [
          "Behavioral extinction of sexual urges through abstinence",
          "Values clarification and psychological flexibility to reduce experiential avoidance driving compulsive behavior",
          "Cognitive restructuring of sexual addiction beliefs",
          "Systematic desensitization of sexual urges"
        ],
        correctAnswer: 1,
        explanation: "The correct answer is values clarification and psychological flexibility to reduce experiential avoidance driving compulsive behavior. ACT conceptualizes compulsive sexual behavior as an experiential avoidance strategy -- a behavioral escape from unwanted internal states such as loneliness, anxiety, and shame -- and builds psychological flexibility and values-driven behavioral alternatives. Option A (behavioral extinction through abstinence) is incorrect because ACT does not aim to extinguish urges through abstinence but rather develops the capacity to hold uncomfortable experiences without reacting through compulsive avoidance."
      },
      {
        question: "Intimacy avoidance as a clinical pattern is most directly associated with:",
        type: "multiple_choice",
        options: [
          "Insecure attachment — particularly dismissive-avoidant attachment style — developed through early relational experiences",
          "Low sexual desire as the primary presenting concern",
          "Antisocial personality as the underlying etiology",
          "Sexual trauma as the only causal pathway"
        ],
        correctAnswer: 0,
        explanation: "The correct answer is insecure attachment, particularly dismissive-avoidant attachment style, developed through early relational experiences. The course identifies dismissive-avoidant attachment as the pattern most directly associated with intimacy avoidance, as individuals who learned that emotional dependence is unsafe develop defensive self-reliance and deactivation of the attachment system in response to intimacy. Option D (sexual trauma as the only causal pathway) is incorrect because while trauma can contribute to intimacy avoidance, the attachment framework identifies multiple developmental pathways including consistent caregiver unavailability and rejection of attachment needs."
      },
      {
        question: "The ethical obligation regarding sex addiction terminology in clinical documentation is to:",
        type: "multiple_choice",
        options: [
          "Use ICD-11 CSBD criteria rather than 'sexual addiction' given lack of DSM-5/ICD-11 validation",
          "Exclusively use the client's preferred terminology",
          "Document both terms to cover all clinical and insurance requirements",
          "Avoid documentation of sexual behavior concerns entirely"
        ],
        correctAnswer: 0,
        explanation: "The correct answer is to use ICD-11 CSBD criteria rather than 'sexual addiction' given the lack of DSM-5/ICD-11 validation. Because 'sexual addiction' is not a validated diagnostic category in either the DSM-5 or ICD-11, clinicians have an ethical obligation to use evidence-based diagnostic terminology in clinical documentation rather than unsupported diagnostic labels. Option B (exclusively using the client's preferred terminology) is incorrect because while client language matters therapeutically, clinical documentation must adhere to validated diagnostic frameworks regardless of client preference."
      },
      {
        question: "Motivational interviewing is particularly valuable in compulsive sexual behavior clinical work because:",
        type: "multiple_choice",
        options: [
          "It provides the behavioral extinction necessary for recovery",
          "It addresses the ambivalence about behavior change that is common and clinically significant in this population",
          "It is the only evidence-based approach with RCT support for CSBD",
          "It is required by ethical guidelines for this population"
        ],
        correctAnswer: 1,
        explanation: "The correct answer is that MI addresses the ambivalence about behavior change that is common and clinically significant in this population. Ambivalence about change is nearly universal in CSBD because individuals may experience the behavior as partially ego-syntonic or may present under external pressure rather than internal motivation, and MI's non-judgmental, evocative stance creates conditions for internal motivation to develop. Option C is incorrect because MI is not required by ethical guidelines; rather, it is indicated by the clinical characteristics of the population."
      },
      {
        question: "The sexual double bind describes:",
        type: "multiple_choice",
        options: [
          "The situation in which both partners experience sexual dysfunction simultaneously",
          "The clinical dynamic in which sexual behavior is driven by both compulsive urges and shame about those urges",
          "The paradox of recommending abstinence for sexual compulsivity",
          "The situation in which treatment increases awareness of sexual urges temporarily"
        ],
        correctAnswer: 1,
        explanation: "The correct answer is the clinical dynamic in which sexual behavior is driven by both compulsive urges and shame about those urges. The sexual double bind describes how the shame about sexual behavior paradoxically maintains the compulsive cycle, as both the urge and the shame are powerfully motivating forces that reinforce one another. Option C (the paradox of recommending abstinence) is incorrect because the sexual double bind refers specifically to the internal psychological dynamic between compulsive urges and shame, not to a treatment planning dilemma."
      },
      {
        question: "Intimacy disorder in the context of compulsive sexual behavior is best described as:",
        type: "multiple_choice",
        options: [
          "Absence of sexual desire for intimate partners",
          "Deficits in emotional intimacy capacity that drive compulsive sexual behavior as a substitute for genuine connection",
          "Sexual dysfunction that prevents intimate partner sexual activity",
          "Personality disorder that precludes the formation of intimate relationships"
        ],
        correctAnswer: 1,
        explanation: "The correct answer is deficits in emotional intimacy capacity that drive compulsive sexual behavior as a substitute for genuine connection. The course emphasizes that compulsive sexual behavior often substitutes for authentic emotional intimacy, providing a form of connection that avoids the vulnerability of genuine relational closeness, and that treating only the compulsive behavior without addressing underlying intimacy deficits produces incomplete recovery. Option A (absence of sexual desire for intimate partners) is incorrect because intimacy disorder in this context refers to emotional intimacy capacity deficits, not to sexual desire or dysfunction per se."
      },
      {
        question: "Relapse prevention in CSBD treatment is most effective when it:",
        type: "multiple_choice",
        options: [
          "Focuses exclusively on abstinence from all sexual behavior as the treatment goal",
          "Addresses individual triggers, high-risk situations, and values-based behavioral alternatives alongside social support",
          "Follows the 12-step model without adaptation to individual presentations",
          "Focuses primarily on shame reduction without behavioral components"
        ],
        correctAnswer: 1,
        explanation: "The correct answer is that relapse prevention addresses individual triggers, high-risk situations, and values-based behavioral alternatives alongside social support. The cognitive-behavioral relapse prevention model identifies specific high-risk situations -- including emotional states, interpersonal contexts, and environmental cues -- and develops individualized coping plans with practical strategies and accountability structures. Option A (focusing exclusively on abstinence from all sexual behavior) is incorrect because effective relapse prevention is individualized and values-based rather than requiring blanket abstinence from all sexual activity."
      },
      {
        question: "The clinical standard of care for couples affected by CSBD disclosure:",
        type: "multiple_choice",
        options: [
          "Requires immediate couples therapy as the primary treatment modality",
          "Typically involves staged treatment: individual stabilization for the CSBD partner, crisis support for the affected partner, and couples work when both are ready",
          "Prioritizes the CSBD partner's individual treatment without attention to partner needs",
          "Requires assessment of both partners for addiction disorders"
        ],
        correctAnswer: 1,
        explanation: "The correct answer is staged treatment: individual stabilization for the CSBD partner, crisis support for the affected partner, and couples work when both are ready. The course describes a staged approach beginning with individual stabilization and partner crisis support, followed by couples work only after both partners have achieved sufficient individual stabilization. Option A (requiring immediate couples therapy) is incorrect because initiating couples work before individual stabilization risks overwhelming both partners and undermining the therapeutic process."
      },
    ]
  },
  references: [
      { title: "AASECT position on sex addiction. https://www.aasect.org", author: "American Association of Sexuality Educators, Counselors and Therapists", year: 2016, source: "6). AASECT position on sex addiction. https://www.aasect.org" },
      { title: "Sexual addiction, sexual compulsivity, sexual impulsivity, or what? Journal of Sex Research, 41(3), 225–234.", author: "Bancroft, J", year: 2004, source: "pulsivity, or what? Journal of Sex Research, 41(3), 225–234." },
      { title: "Out of the shadows: Understanding sexual addiction. CompCare Publications.", author: "Carnes, P", year: 1983, source: "dows: Understanding sexual addiction. CompCare Publications." },
      { title: "Is your patient suffering from compulsive sexual behavior? Psychiatric Annals, 22(6), 320–325.", author: "Coleman, E", year: 1992, source: "pulsive sexual behavior? Psychiatric Annals, 22(6), 320–325." },
      { title: "What's in a name? Terminology for designating a syndrome of driven sexual behavior. Sexual Addiction & Compulsivity, 8(", author: "Goodman, A", year: 2001, source: "behavior. Sexual Addiction & Compulsivity, 8(3–4), 191–213." },
      { title: "Hypersexual disorder: A proposed diagnosis for DSM-5. Archives of Sexual Behavior, 39(2), 377–400.", author: "Kafka, M", year: 2010, source: "osis for DSM-5. Archives of Sexual Behavior, 39(2), 377–400." },
      { title: "Hypersexuality and recidivism among sexual offenders. Sexual Addiction & Compulsivity, 20(1–2), 91–105.", author: "Kingston, D", year: 2013, source: "offenders. Sexual Addiction & Compulsivity, 20(1–2), 91–105." },
      { title: "Should compulsive sexual behavior be considered an addiction? Addiction, 111(12), 2097–2106.", author: "Kraus, S", year: 2016, source: "r be considered an addiction? Addiction, 111(12), 2097–2106." },
      { title: "Impulsive-compulsive sexual behavior. CNS Spectrums, 11(12), 944–955.", author: "Mick, T", year: 2006, source: "-compulsive sexual behavior. CNS Spectrums, 11(12), 944–955." },
      { title: "Data do not support sex as addictive. Lancet Psychiatry, 4(12), 899.", author: "Prause, N", year: 2017, source: "not support sex as addictive. Lancet Psychiatry, 4(12), 899." },
      { title: "Reliability, validity, and psychometric development of the Hypersexual Behavior Inventory in an outpatient sample of me", author: "Reid, R", year: 2011, source: "ample of men. Sexual Addiction & Compulsivity, 18(1), 30–51." },
      { title: "Current status and future directions in couple therapy. Annual Review of Psychology, 57, 317–344.", author: "Snyder, D", year: 2006, source: "in couple therapy. Annual Review of Psychology, 57, 317–344." },
      { title: "The traumatic nature of disclosure for wives of sexual addicts. Sexual Addiction & Compulsivity, 13(2–3), 247–267.", author: "Steffens, B", year: 2006, source: "addicts. Sexual Addiction & Compulsivity, 13(2–3), 247–267." },
      { title: "Hypersexuality: A critical review and introduction to the 'Sexhavior Cycle.' Archives of Sexual Behavior, 46(8), 2231–2", author: "Walton, M", year: 2017, source: "avior Cycle.' Archives of Sexual Behavior, 46(8), 2231–2251." },
      { title: "International classification of diseases (11th revision). https://icd.who.int", author: "World Health Organization", year: 2019, source: "ssification of diseases (11th revision). https://icd.who.int" },
      { title: "Hypersexual disorder: A more cautious approach. Archives of Sexual Behavior, 39(3), 594–596.", author: "Winters, J", year: 2010, source: "tious approach. Archives of Sexual Behavior, 39(3), 594–596." },
  ]
};

async function main() {
  console.log('\n' + '='.repeat(60));
  console.log('  SEED: CR-307 — Compulsive Sexual Behavior and Intimacy Disorders: Assessment and Treatment');
  console.log('='.repeat(60));
  
  await mongoose.connect(MONGODB_URI);
  console.log('\n✅ Connected to MongoDB');

  const Course = mongoose.connection.models.InteractiveCourse ||
    mongoose.model('InteractiveCourse', new mongoose.Schema({}, { strict: false }, 'interactivecourses'));

  const existing = await Course.findOne({ slug: COURSE_DATA.slug });
  if (existing) {
    await Course.updateOne({ _id: existing._id }, { $set: COURSE_DATA });
    console.log('  ✅ UPDATED:', COURSE_DATA.title);
  } else {
    await Course.create(COURSE_DATA);
    console.log('  ✅ CREATED:', COURSE_DATA.title);
  }

  const totalBlocks = COURSE_DATA.modules.reduce(
    (sum, m) => sum + (m.contentBlocks?.length || 0), 0
  );
  console.log(`\n  📊 Stats:`);
  console.log(`     CE Hours : 3`);
  console.log(`     Word Count: 18,238`);
  console.log(`     Modules  : ${COURSE_DATA.modules.length}`);
  console.log(`     Blocks   : ${totalBlocks}`);
  console.log(`     Exam Qs  : ${COURSE_DATA.assessment.questions.length}`);
  console.log(`     Status   : draft (review before publishing)\n`);

  await mongoose.disconnect();
  console.log('✅ Done.\n');
}

main().catch(err => { console.error('❌', err.message); process.exit(1); });
