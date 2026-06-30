import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }
const SLUG = 'cr-add-701-co-occurring-disorders';

const COURSE = {
  courseCode: 'CR-ADD-701',
  title: 'Co-Occurring Disorders: Integrated Treatment for Substance Use and Mental Health',
  slug: SLUG,
  description: 'This course provides mental health professionals with an evidence-based framework for assessing, diagnosing, and treating clients who present with co-occurring substance use and mental health disorders. Covering epidemiology, integrated treatment models, motivational interviewing, trauma-informed care, and special population considerations, this course equips clinicians to move beyond sequential treatment toward truly integrated, recovery-oriented care.',
  ceHours: 3,
  category: 'clinical',
  nbccContentArea: 'addiction_counseling',
  difficulty: 'intermediate',
  targetAudience: 'Licensed mental health professionals (LPCs, LCSWs, LMFTs, NCCs)',
  estimatedTime: 180,
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
    hourBreakdown: [{ label: 'core', hours: 3 }]
  }],
  isPublished: false,
  status: 'draft',
  sections: [
    // ─── SECTION 0: INTRO ───────────────────────────────────────────────────
    {
      title: 'Introduction: The Challenge of Co-Occurring Disorders',
      sectionNumber: 0,
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'Co-Occurring Disorders: Integrated Treatment for Substance Use and Mental Health',
          subtitle: 'Moving beyond parallel care toward truly integrated, recovery-oriented practice',
          sectionNumber: 0
        },
        {
          type: 'text',
          content: `<p>Few clinical presentations are more complex, more common, or more chronically undertreated than co-occurring disorders (CODs) — the simultaneous presence of a substance use disorder and one or more mental health conditions. For decades, the behavioral health system treated these as separate problems requiring separate solutions: clients were routed either to substance abuse programs or mental health services, rarely to both, and almost never to an integrated setting that understood how profoundly each disorder shapes the other. The consequences were predictable. Clients fell through the cracks, relapsed repeatedly, and cycled through emergency rooms and crisis services without ever receiving care that addressed the full picture of their experience.</p>
<p>The field has evolved significantly. The Substance Abuse and Mental Health Services Administration (SAMHSA), the National Institute on Drug Abuse (NIDA), and decades of clinical research now converge on a clear conclusion: integrated treatment — addressing both disorders simultaneously, within the same clinical relationship or treatment team — produces meaningfully better outcomes than sequential or parallel approaches. Yet implementation remains uneven. Many mental health clinicians feel underprepared to address substance use, while many addiction counselors feel unprepared to treat psychiatric conditions. The gap between what the evidence supports and what clients receive in real-world settings remains one of the most pressing public health challenges in mental health care.</p>
<p>This course is designed to bridge that gap. Whether you work in an outpatient mental health clinic, a community behavioral health center, a private practice, a school, or a residential program, the clients you serve are almost certainly affected by co-occurring disorders — whether or not those disorders are formally recognized and treated. By the end of this course, you will be able to: (1) describe the epidemiology of CODs and explain the neurobiological and psychological mechanisms by which they co-occur; (2) distinguish sequential, parallel, and integrated treatment models and articulate the evidence base for each; (3) apply motivational interviewing, integrated CBT, DBT skills, and trauma-informed approaches in COD treatment; (4) navigate the ethical and confidentiality requirements specific to COD practice, including 42 CFR Part 2; and (5) adapt integrated treatment for special populations including adolescents, pregnant clients, justice-involved individuals, and older adults.</p>`
        },
        {
          type: 'videoEmbed',
          title: 'Understanding Co-Occurring Disorders: Why Integration Matters',
          videoUrl: 'https://www.youtube.com/embed/2i5BqN8FxXc',
          description: 'An overview of the scope of co-occurring disorders in the United States and the evidence base for integrated treatment approaches, presented by SAMHSA behavioral health researchers.'
        },
        {
          type: 'imageText',
          title: 'The Integrated Treatment Imperative',
          content: `<p>The phrase "no wrong door" has become a touchstone in integrated care policy — the idea that wherever a person enters the behavioral health system, they should receive care for the full range of their needs. In practice, this means that mental health clinicians must be equipped to screen, assess, and address substance use as part of their routine clinical work, and that addiction counselors must be equipped to recognize and respond to co-occurring psychiatric conditions.</p>
<p>The stakes are high. Research consistently shows that untreated co-occurring disorders are associated with higher rates of hospitalization, homelessness, incarceration, HIV and hepatitis C infection, domestic violence, and suicide. When both disorders are treated together, these outcomes improve dramatically — not because clients suddenly have easy lives, but because integrated treatment addresses the self-reinforcing cycle in which untreated mental health symptoms drive substance use and untreated substance use destabilizes mental health.</p>`,
          imageUrl: '/images/courses/co-occurring-intro.jpg',
          imageAlt: 'Two overlapping circles representing the intersection of substance use and mental health disorders',
          imagePosition: 'right'
        }
      ]
    },

    // ─── SECTION 1: EPIDEMIOLOGY AND FOUNDATIONS ───────────────────────────
    {
      title: 'Section 1: Epidemiology, Etiology, and Diagnostic Foundations',
      sectionNumber: 1,
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'Epidemiology, Etiology, and Diagnostic Foundations',
          subtitle: 'Understanding the scope, causes, and assessment of co-occurring disorders',
          sectionNumber: 1
        },
        {
          type: 'text',
          content: `<h3>How Common Are Co-Occurring Disorders?</h3>
<p>The epidemiological picture of co-occurring disorders is both striking and consequential for clinical practice. According to SAMHSA's National Survey on Drug Use and Health (NSDUH), approximately 9.2 million adults in the United States experienced both a mental illness and a substance use disorder in 2020 — roughly 3.4% of the adult population. Among adults with a serious mental illness (SMI), the rate of co-occurring substance use disorder is approximately 24.5%, nearly double the rate in the general population. Among adults already identified as having a substance use disorder, rates of co-occurring mental illness range from 30% to over 50% depending on the population and setting.</p>
<p>These figures likely underestimate the true prevalence, because both disorders are subject to significant underdiagnosis. Substance use disorders remain stigmatized and frequently undetected in mental health settings, particularly when clinicians do not routinely screen for them. Mental health disorders are frequently attributed to substance use without sufficient assessment to determine whether they exist independently, leading to significant diagnostic error. When both disorders are present and only one is identified, treatment is necessarily incomplete.</p>
<p>The relationship between specific substances and specific psychiatric conditions follows recognizable patterns. Alcohol use disorder co-occurs most frequently with mood disorders, particularly major depressive disorder (MDD) and bipolar disorder, as well as with anxiety disorders and PTSD. Cannabis use disorder has increasingly documented associations with psychotic disorders, particularly in individuals with genetic vulnerability, and with anxiety and depression. Stimulant use disorders co-occur commonly with ADHD, mood disorders, and anxiety. Opioid use disorder is strongly associated with PTSD, depression, and trauma histories. These patterns are not coincidental — they reflect the shared neurobiological mechanisms and psychological dynamics discussed in the next sections.</p>
<p>From a population health perspective, co-occurring disorders are associated with dramatic disparities in health outcomes. Individuals with co-occurring disorders have higher rates of emergency department visits, inpatient psychiatric hospitalizations, and involvement in the criminal justice system. They experience higher rates of homelessness — studies suggest that 50–75% of chronically homeless individuals have CODs. They are more likely to engage in high-risk sexual behavior and injection drug use, increasing vulnerability to HIV and hepatitis C. They have significantly elevated rates of suicide — the intersection of active substance use and untreated psychiatric illness is one of the most robust predictors of suicidal behavior in clinical populations. Understanding this epidemiological landscape is essential not only for justifying integrated treatment approaches but for communicating to clients and other stakeholders why treating only one disorder at a time is a clinically indefensible approach.</p>`
        },
        {
          type: 'text',
          content: `<h3>Why Do Substance Use and Mental Health Disorders Co-Occur? Three Explanatory Frameworks</h3>
<p>Understanding why CODs co-occur is not merely theoretically interesting — it has direct implications for how clinicians conceptualize cases and structure treatment. The research literature supports three major explanatory frameworks that are not mutually exclusive and that likely apply in different combinations for different clients.</p>
<p><strong>The Self-Medication Hypothesis.</strong> First formally articulated by Edward Khantzian in the 1970s and 1980s, the self-medication hypothesis proposes that individuals with underlying psychiatric conditions — particularly those associated with dysphoric emotional states — use substances to manage or reduce symptoms that are experienced as unbearable or uncontrollable. In this framework, substance use is not irrational behavior; it is a functional, if ultimately harmful, attempt to solve a real problem. The person who drinks heavily to quiet the hyperarousal and intrusive memories of PTSD is using alcohol because it works — at least temporarily. The person with social anxiety disorder who uses cannabis before social situations is medicating a genuine deficit in their ability to tolerate social stress. The person with bipolar disorder who drinks during depressive episodes may be seeking stimulation and mood elevation. The clinical significance of this framework is profound: when clinicians understand substance use as a misguided but understandable attempt at symptom management, they can respond with curiosity and compassion rather than judgment, and they can help clients understand their own behavior in a way that reduces shame and increases motivation for treatment. They can also identify which psychiatric symptoms are most strongly driving substance use, guiding treatment priorities.</p>
<p><strong>Shared Neurobiological Vulnerability.</strong> A second framework emphasizes that substance use disorders and many psychiatric conditions share common neurobiological substrates, including dysregulation of dopaminergic reward pathways, serotonergic mood regulation systems, the HPA axis (governing stress reactivity), and prefrontal cortical executive function. Genetic research has identified specific polymorphisms — including variants of the COMT gene, the DRD2 gene, and serotonin transporter genes — that confer elevated risk for both substance use disorders and mood, anxiety, and psychotic disorders. This shared vulnerability means that the same underlying neurobiological profile that predisposes an individual to depression also predisposes them to substance use disorder, and vice versa. Neither disorder causes the other in a linear sense; rather, both emerge from a common diathesis interacting with environmental stressors. For clinicians, this framework helps explain why simply treating one disorder does not automatically resolve the other, and why medication decisions in COD clients require careful attention to how psychotropic medications interact with substances and with addiction neurobiology.</p>
<p><strong>Trauma as a Common Root.</strong> The third framework — increasingly well-supported by both research and clinical observation — positions trauma not as a risk factor for either CODs independently, but as a foundational organizing experience that shapes the emergence of both. Adverse childhood experiences (ACEs) are powerfully associated with both substance use disorders and psychiatric conditions in a dose-response relationship: the greater the number and severity of childhood adversities, the higher the risk of both disorders. Trauma-related neurobiological dysregulation — particularly alterations to the HPA axis, prefrontal-amygdala connectivity, and dopaminergic systems — creates the very conditions (hyperarousal, emotional dysregulation, negative affect, difficulty with executive function) that make substances both appealing and difficult to resist. Understanding trauma as a common root has significant treatment implications: trauma-focused interventions are not adjunctive to COD treatment but are frequently central to it. Clients with PTSD and SUD, in particular, show stronger outcomes when both disorders are addressed simultaneously in a trauma-informed integrated framework than when trauma treatment is deferred until sobriety is achieved.</p>`
        },
        {
          type: 'text',
          content: `<h3>Treatment Models: Sequential, Parallel, and Integrated</h3>
<p>The history of COD treatment is, in many ways, a history of gradually recognizing that treating these disorders in isolation produces inferior outcomes. The evolution of treatment models from sequential to parallel to integrated reflects both expanding clinical understanding and shifting policy frameworks.</p>
<p><strong>Sequential Treatment.</strong> The earliest and most pervasive approach to CODs was sequential treatment: one disorder was treated first, and treatment for the other was deferred until the first was "resolved." In practice, this almost always meant that substance use disorders were treated first, with the expectation that mental health symptoms would either resolve with sobriety or become addressable once the patient was stable in recovery. Mental health clinicians would often refuse to see clients who were actively using, and addiction programs would often refer out clients showing psychiatric symptoms without addressing them directly. The sequential model was intuitive — treat the simpler problem first, then address the more complex one — but it rested on assumptions about symptom primacy and disorder independence that were not supported by evidence. Clients who relapsed (which is to say, most clients) could not access mental health services. Clients with untreated psychiatric conditions had dramatically lower rates of sustained recovery from substance use. Sequential treatment produced poor outcomes not because clients failed treatment, but because the treatment model failed clients.</p>
<p><strong>Parallel Treatment.</strong> As recognition of the inadequacy of sequential approaches grew, parallel treatment emerged as an alternative: clients could receive mental health and substance use treatment simultaneously, but from different providers in different settings using different frameworks. The mental health clinician addressed depression; the addiction counselor addressed drinking; the two providers might or might not communicate. While parallel treatment represented an improvement — at least both disorders were being addressed — it created significant challenges of coordination, communication, and conceptual coherence. Clients received conflicting messages. Mental health providers might prescribe benzodiazepines for anxiety while addiction counselors urged avoidance of all mood-altering substances. Different providers assessed the same behaviors through different theoretical lenses, producing confusing and sometimes contradictory case conceptualizations. Clients, already managing complex presentations, bore the burden of synthesizing disconnected care.</p>
<p><strong>Integrated Treatment.</strong> Integrated treatment addresses both substance use and mental health disorders simultaneously, within the same clinical relationship or treatment team, using a unified conceptual framework. The evidence base for integrated treatment is now substantial. Multiple randomized controlled trials and systematic reviews demonstrate that integrated approaches produce significantly better outcomes than either sequential or parallel treatment across a range of metrics including psychiatric symptom severity, substance use severity, hospitalization rates, housing stability, and client satisfaction. SAMHSA's Integrated Dual Diagnosis Treatment (IDDT) model — developed specifically for individuals with serious mental illness and co-occurring substance use disorders — is among the most extensively studied integrated frameworks. IDDT is characterized by: (1) team-based care in which all providers share responsibility for both disorders; (2) a stage-wise approach that matches interventions to the client's current level of motivation and engagement; (3) a long-term perspective recognizing that recovery from both disorders is a process measured in years, not weeks; (4) integration of motivational interviewing, cognitive-behavioral strategies, and family psychoeducation; and (5) attention to housing, vocational, and social supports as components of integrated care. The model has demonstrated effectiveness in reducing hospitalizations, reducing substance use, and improving community functioning in individuals with schizophrenia, bipolar disorder, and PTSD who have co-occurring SUD.</p>
<p><strong>Diagnostic Challenges in COD Assessment.</strong> A persistent clinical challenge in COD practice is distinguishing substance-induced symptoms from independent psychiatric conditions. Substance use produces a wide range of psychiatric symptoms — depression, anxiety, psychosis, mood lability, cognitive impairment — that can be difficult to distinguish from independent disorders during active use or early withdrawal. The DSM-5 distinguishes "substance/medication-induced mental disorders" (which are expected to resolve with abstinence or stabilization) from independent disorders (which persist beyond the expected physiological effects of the substance). In practice, this distinction is often difficult to make in real time. A commonly used guideline is the "four-week rule": if significant psychiatric symptoms persist beyond four weeks of abstinence, an independent disorder is more likely. However, this rule has significant limitations. Many clients cannot or do not achieve four weeks of abstinence. Some substances have prolonged effects. Some symptoms fluctuate. The clinical standard of care involves careful longitudinal assessment, attention to chronology (which came first?), family history, and symptom patterns during previous periods of sobriety. Validated screening tools — including the AUDIT, DAST-10, and CAGE — are essential components of systematic COD screening, though they must be understood as screening instruments rather than diagnostic tools, requiring follow-up assessment when positive. The AUDIT (Alcohol Use Disorders Identification Test) is a 10-item WHO-developed screening tool with strong sensitivity and specificity for harmful and hazardous alcohol use. The DAST-10 (Drug Abuse Screening Test) screens for drug use problems across a range of substances. The CAGE (Cut down, Annoyed, Guilty, Eye-opener) is a brief 4-item tool that, while less comprehensive, is widely used in primary care settings for rapid alcohol screening.</p>`
        },
        {
          type: 'callout',
          calloutType: 'important',
          title: 'The Diagnostic Timing Problem',
          content: 'Clinicians cannot reliably distinguish substance-induced psychiatric symptoms from independent disorders during active intoxication or early withdrawal. When assessment timing is not ideal, document the uncertainty, track symptoms longitudinally, and avoid premature diagnostic closure. A provisional diagnosis with explicit plans for reassessment is both clinically sound and ethically appropriate.'
        },
        {
          type: 'accordion',
          title: 'COD Screening Tool Reference',
          accordionItems: [
            {
              title: 'AUDIT (Alcohol Use Disorders Identification Test)',
              content: 'The AUDIT is a 10-item self-report screen developed by the World Health Organization. It assesses alcohol consumption frequency and quantity, dependence symptoms, and alcohol-related harm. Scores range from 0–40; scores of 8+ indicate hazardous or harmful use, scores of 15+ suggest possible alcohol use disorder, and scores of 20+ are associated with high-severity dependence. The AUDIT-C is a validated 3-item abbreviation that can be administered in under one minute. Sensitivity for AUD is approximately 84–92% and specificity approximately 77–95% depending on population.'
            },
            {
              title: 'DAST-10 (Drug Abuse Screening Test — 10 item)',
              content: 'The DAST-10 is a 10-item yes/no self-report screen adapted from the original 28-item DAST. It covers drug use problems during the past 12 months (excluding alcohol and tobacco). Scores of 1–2 indicate low risk; 3–5 moderate risk; 6–8 substantial risk; 9–10 severe risk. The DAST-10 has adequate sensitivity and specificity for identifying drug use disorders in both clinical and community settings, though it does not identify specific substances and requires follow-up assessment for treatment planning.'
            },
            {
              title: 'CAGE Questionnaire',
              content: 'The CAGE consists of four questions: (C) Have you ever felt you needed to Cut down on your drinking? (A) Have people Annoyed you by criticizing your drinking? (G) Have you ever felt Guilty about drinking? (E) Have you ever felt you needed a drink first thing in the morning (Eye-opener)? Two or more "yes" responses are considered a positive screen. The CAGE is widely used in primary care for its brevity but has lower sensitivity for at-risk or hazardous use than the AUDIT, and does not capture recent drinking patterns. It is best understood as a rapid clinical flag rather than a comprehensive screen.'
            },
            {
              title: 'MINI International Neuropsychiatric Interview (MINI)',
              content: 'The MINI is a brief structured diagnostic interview that screens for major DSM and ICD psychiatric diagnoses, including mood disorders, anxiety disorders, psychotic disorders, and substance use disorders. It is widely used in COD settings because it allows rapid assessment of multiple psychiatric conditions simultaneously, making it particularly useful when differentiating substance-induced from independent disorders. The MINI takes approximately 15–30 minutes to administer and has well-established reliability and validity across clinical populations.'
            }
          ]
        },
        {
          type: 'imageText',
          title: 'Sequential vs. Parallel vs. Integrated: A Visual Comparison',
          content: `<p><strong>Sequential:</strong> Treat SUD → then treat mental health. Problem: clients can't access MH care during relapse; MH symptoms drive relapse.</p>
<p><strong>Parallel:</strong> Treat SUD and MH simultaneously but separately. Problem: coordination gaps, conflicting messages, client bears burden of integration.</p>
<p><strong>Integrated:</strong> Both disorders addressed simultaneously within same relationship or team, using unified conceptual framework. Evidence: best outcomes across psychiatric symptoms, SUD severity, hospitalization, housing stability.</p>`,
          imageUrl: '/images/courses/treatment-model-comparison.jpg',
          imageAlt: 'Three-column diagram comparing sequential, parallel, and integrated treatment models',
          imagePosition: 'left'
        },
        {
          type: 'knowledgeCheck',
          title: 'Knowledge Check: Epidemiology',
          question: 'According to SAMHSA\'s National Survey on Drug Use and Health, approximately what percentage of adults with serious mental illness (SMI) have a co-occurring substance use disorder?',
          blockType: 'multipleChoice',
          options: [
            { text: 'Approximately 10%', isCorrect: false },
            { text: 'Approximately 24.5%', isCorrect: true },
            { text: 'Approximately 40%', isCorrect: false },
            { text: 'Approximately 60%', isCorrect: false }
          ],
          correctAnswer: 1,
          explanation: 'SAMHSA data indicates that approximately 24.5% of adults with serious mental illness have a co-occurring substance use disorder — roughly double the rate in the general population. This underscores why routine SUD screening should be a standard component of mental health assessment.'
        },
        {
          type: 'knowledgeCheck',
          title: 'Knowledge Check: Explanatory Frameworks',
          question: 'Which of the following are recognized explanatory frameworks for why substance use disorders and mental health disorders co-occur? Select all that apply.',
          blockType: 'multiSelect',
          options: [
            { text: 'The self-medication hypothesis', isCorrect: true },
            { text: 'Shared neurobiological vulnerability', isCorrect: true },
            { text: 'Trauma as a common root', isCorrect: true },
            { text: 'The diagnostic displacement theory', isCorrect: false }
          ],
          explanation: 'Research supports three major frameworks: the self-medication hypothesis (substances used to manage psychiatric symptoms), shared neurobiological vulnerability (common genetic and neurological substrates), and trauma as a common root (ACEs driving both disorders). "Diagnostic displacement theory" is not a recognized framework in the COD literature.'
        },
        {
          type: 'flashcardDeck',
          title: 'Flashcards: Key Terms in COD Assessment and Treatment',
          instructions: 'Review these key terms and their definitions. Click each card to reveal the answer.',
          flashcards: [
            {
              front: 'What is the "four-week rule" in COD assessment?',
              back: 'A clinical guideline suggesting that if significant psychiatric symptoms persist beyond four weeks of abstinence from substances, an independent (rather than substance-induced) psychiatric disorder is more likely. This guideline has significant limitations and must be used as one data point in comprehensive longitudinal assessment.'
            },
            {
              front: 'What does IDDT stand for and who developed it?',
              back: 'Integrated Dual Diagnosis Treatment. IDDT was developed by SAMHSA researchers and is the most extensively studied integrated treatment model for individuals with serious mental illness and co-occurring SUD. It features team-based care, stage-wise interventions, long-term perspective, MI, CBT, and family psychoeducation.'
            },
            {
              front: 'What is the self-medication hypothesis?',
              back: 'Proposed by Khantzian, this framework holds that individuals with underlying psychiatric conditions use substances to manage or reduce unbearable symptoms. Substance use in this framework is understood as a functional (if harmful) response to real symptom burden, not as irrational behavior — a reframe that reduces client shame and increases treatment engagement.'
            },
            {
              front: 'What does the AUDIT screen for?',
              back: 'The Alcohol Use Disorders Identification Test (AUDIT) is a 10-item WHO-developed screen for hazardous and harmful alcohol use. Scores of 8+ indicate hazardous use; 15+ suggest AUD; 20+ are associated with high-severity dependence. Sensitivity for AUD is approximately 84–92%.'
            },
            {
              front: 'What is the DAST-10?',
              back: 'The Drug Abuse Screening Test (10-item version) is a self-report screen covering drug use problems (excluding alcohol and tobacco) over the past 12 months. Scores 1–2: low risk; 3–5: moderate; 6–8: substantial; 9–10: severe. Does not identify specific substances; requires follow-up for treatment planning.'
            },
            {
              front: 'What is the "no wrong door" principle?',
              back: 'A policy framework stating that wherever a person enters the behavioral health system — whether through mental health, addiction, primary care, or emergency services — they should receive care addressing the full range of their behavioral health needs. It requires that all providers be equipped to screen for and respond to co-occurring disorders.'
            },
            {
              front: 'What characterizes parallel (vs. integrated) COD treatment?',
              back: 'Parallel treatment addresses both disorders simultaneously but in separate settings with separate providers who may or may not coordinate. It produces better outcomes than sequential treatment but worse outcomes than integrated treatment, largely due to coordination gaps and conflicting clinical messages reaching the client.'
            },
            {
              front: 'What shared neurobiological systems are implicated in the co-occurrence of SUD and psychiatric disorders?',
              back: 'Dopaminergic reward pathways, serotonergic mood regulation systems, the HPA axis (stress reactivity), and prefrontal cortical executive function. Genetic variants of COMT, DRD2, and serotonin transporter genes confer elevated risk for both classes of disorders, suggesting shared diathesis rather than simple causal relationship.'
            }
          ]
        },
        {
          type: 'reflection',
          title: 'Reflection: Your Current Practice',
          question: 'Think about a current or recent client whose presentation might involve co-occurring disorders. How was substance use assessed in the initial intake? Were formal screening tools (AUDIT, DAST-10, CAGE) used? If substance use was identified, how was it addressed in treatment? Based on what you have learned in this section, what might you do differently in future assessments?'
        },
        {
          type: 'keyTakeaway',
          title: 'Key Takeaways: Section 1',
          takeaways: [
            'Approximately 9.2 million U.S. adults experience CODs annually; among those with serious mental illness, the rate of co-occurring SUD is nearly 25%.',
            'Three frameworks explain why CODs co-occur: self-medication hypothesis, shared neurobiological vulnerability, and trauma as a common root — all three likely apply in different combinations for different clients.',
            'Integrated treatment consistently outperforms sequential and parallel models across psychiatric symptoms, SUD severity, hospitalization rates, and housing stability.',
            'SAMHSA\'s IDDT model is the evidence gold standard for serious mental illness + SUD populations; key features include team-based care, stage-wise approach, and long-term perspective.',
            'Screening tools (AUDIT, DAST-10, CAGE) are essential starting points but require follow-up assessment; the four-week rule for distinguishing substance-induced from independent disorders is useful but limited.'
          ]
        }
      ]
    },

    // ─── SECTION 2: EVIDENCE-BASED INTERVENTIONS ───────────────────────────
    {
      title: 'Section 2: Evidence-Based Clinical Interventions for CODs',
      sectionNumber: 2,
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'Evidence-Based Clinical Interventions for Co-Occurring Disorders',
          subtitle: 'Motivational interviewing, CBT, DBT, trauma-informed approaches, and common COD presentations',
          sectionNumber: 2
        },
        {
          type: 'text',
          content: `<h3>Motivational Interviewing and the Stages of Change in COD Practice</h3>
<p>One of the defining clinical challenges of co-occurring disorders is ambivalence. Clients with CODs are almost never uniformly motivated to address both disorders simultaneously. They may be deeply committed to stopping substance use but resistant to exploring underlying psychiatric symptoms. They may be engaged in mental health treatment but unwilling to acknowledge that their drinking is a problem. They may recognize both disorders but feel overwhelmed, hopeless, or convinced that treatment cannot help. Working skillfully with ambivalence — not pushing through it, minimizing it, or interpreting it as resistance — is a core competency of COD practice.</p>
<p>Motivational Interviewing (MI) was developed by William Miller and Stephen Rollnick specifically for work with substance use, and it maps onto the Transtheoretical Model (TTM) of change with particular utility. In the TTM framework, clients move through five stages: Precontemplation (not yet considering change), Contemplation (aware of the problem, considering change but not committed), Preparation (beginning to make plans for change), Action (actively implementing change), and Maintenance (sustaining change over time). COD clients often present at different stages for different disorders — in Contemplation for their alcohol use but in Preparation for their depression, or vice versa — and clinicians who fail to assess stage of change for each disorder risk providing stage-mismatched interventions that backfire.</p>
<p>The Spirit of MI — characterized by partnership, acceptance, compassion, and evocation — is particularly important in COD work, where clients frequently arrive carrying layers of shame, stigma, prior treatment failures, and systemic harm. The four MI processes (Engaging, Focusing, Evoking, Planning) provide a framework for moving from relational alliance to targeted exploration of ambivalence to eliciting the client's own arguments for change. Key MI techniques including reflective listening, open-ended questions, affirmations, and summaries are tools for helping clients hear themselves articulate change talk — their own language about the desire, ability, reasons, and need for change. When working with COD ambivalence specifically, clinicians should explore the intersection of both disorders in the client's own change talk: "It sounds like part of you knows that when you drink heavily, your anxiety actually gets worse the next day, not better — tell me more about that." This kind of exploration helps clients develop integrated awareness of how the two disorders interact in their own lives, which is a powerful motivator for integrated change.</p>
<p>Research specifically examining MI in COD populations has found that MI-based interventions reduce substance use and improve mental health treatment engagement more effectively than standard care or confrontational approaches. MI has also been found to be particularly effective in reducing premature dropout from treatment — a major challenge in COD populations, where retention in treatment is often the strongest predictor of outcome. When implemented in a stage-matched way, MI moves clients through the early stages of change and builds the alliance and trust necessary for deeper clinical work.</p>`
        },
        {
          type: 'text',
          content: `<h3>Integrated Cognitive-Behavioral Therapy for Co-Occurring Disorders</h3>
<p>Cognitive-behavioral therapy (CBT) is among the most extensively studied interventions for both substance use disorders and psychiatric conditions separately, and a growing body of research supports its effectiveness when delivered in integrated form to address both simultaneously. Integrated CBT for CODs is based on the premise that both disorders are maintained by overlapping cognitive and behavioral mechanisms — including cognitive distortions, dysfunctional core beliefs, behavioral avoidance, and maladaptive coping patterns — and that targeting these shared mechanisms simultaneously is more efficient and effective than addressing them in separate treatment contexts.</p>
<p>The cognitive model of CODs identifies several key targets for intervention. <strong>Substance-related cognitive distortions</strong> include craving-amplifying thoughts ("I need a drink to handle this"), permission-giving beliefs ("One drink won't hurt"), and minimization ("I don't have a real problem"). <strong>Psychiatric cognitive distortions</strong> include depressogenic thinking patterns (negative automatic thoughts about self, world, and future), anxiety-maintaining catastrophizing and hypervigilance, and the negative self-schema that frequently underlies both disorders. In integrated CBT, clinicians help clients identify how these cognitive patterns interact: the client who catastrophizes about social situations (anxiety) may use alcohol to manage pre-social anxiety, then experience next-day shame and depressed mood that further entrenches negative self-beliefs, increasing vulnerability to the next anxiety-driven drinking episode. Making this cycle explicit, and collaboratively intervening at multiple points in it, is the core task of integrated CBT.</p>
<p>Behavioral components of integrated CBT include coping skills training (including both substance-specific coping for craving and urge management and general emotional regulation skills), behavioral activation for depression, exposure-based work for anxiety, and functional analysis of substance use patterns in relation to psychiatric symptoms. Homework assignments in integrated CBT are designed to target both disorders simultaneously: a client might be assigned to notice and record automatic thoughts before anxiety-driven substance use, practice a specific coping skill, and track mood and craving data in relation to substance use events. The relapse prevention model (Marlatt and Gordon) fits naturally within integrated CBT, identifying high-risk situations that trigger both psychiatric symptoms and substance use, developing personalized coping plans, and building self-efficacy for managing both sets of triggers.</p>
<p>DBT skills have particular utility in COD populations, especially those with significant emotional dysregulation, impulsivity, and trauma histories. DBT's four skills modules — Mindfulness, Distress Tolerance, Emotion Regulation, and Interpersonal Effectiveness — address the core deficits that drive both substance use and psychiatric distress in many COD clients. Mindfulness skills help clients observe cravings and psychiatric symptoms without automatically acting on them. Distress Tolerance skills (particularly the TIPP skills and radical acceptance) provide alternatives to substance use in moments of acute dysphoria. Emotion Regulation skills target the negative affect that drives both SUD relapse and psychiatric symptom exacerbation. Interpersonal Effectiveness skills address the relationship chaos that frequently characterizes the lives of clients with CODs and personality pathology. Research specifically examining DBT for clients with CODs and borderline personality features has found significant reductions in both substance use and psychiatric symptoms compared to standard treatment.</p>`
        },
        {
          type: 'text',
          content: `<h3>Trauma-Informed Approaches and Common COD Presentations</h3>
<p>Trauma is not a background variable in co-occurring disorders — it is frequently the organizing clinical reality. The high rates of adverse childhood experiences, interpersonal violence, and other traumatic exposures in COD populations mean that trauma-informed practice is not a specialty orientation but a baseline requirement. Trauma-informed care (TIC) involves recognizing the pervasive impact of trauma, integrating knowledge about trauma into all aspects of service delivery, avoiding re-traumatization, and actively supporting recovery and resilience. In COD settings, this translates to several concrete clinical practices: routinely and sensitively asking about trauma history; explaining the neurobiological and psychological connections between trauma, mental health, and substance use; understanding substance use as a trauma response rather than a moral failure; ensuring that assessment and treatment processes do not replicate dynamics of powerlessness, unpredictability, or violation; and collaborating with clients to build genuine safety — both internal (emotional regulation) and external (social support, stable housing) — before undertaking intensive trauma processing.</p>
<p>The question of when to begin trauma-focused treatment in COD clients — particularly whether active substance use must be resolved before trauma processing can begin — has been a significant point of clinical debate. Traditional addiction treatment models held that trauma work should be deferred until stable sobriety, out of concern that trauma processing would destabilize clients and precipitate relapse. This sequential approach has been largely contradicted by the evidence. Multiple RCTs, including the landmark Concurrent Treatment of PTSD and Substance Use Disorders Using Prolonged Exposure (COPE) and the Integrated Cognitive Behavioral Therapy (ICBT) trials, have demonstrated that trauma-focused treatment delivered concurrently with substance use treatment does not increase relapse rates and in fact produces better outcomes on both PTSD and SUD measures than delayed trauma treatment.</p>
<p>Understanding common COD presentations helps clinicians develop more targeted assessment and treatment approaches. <strong>PTSD + SUD</strong> is among the most common and most clinically complex COD presentations. Hyperarousal, intrusive symptoms, and emotional numbing drive substance use as a self-medication strategy, while substance use in turn disrupts sleep, increases emotional reactivity, and undermines the predictability and safety necessary for trauma recovery. <strong>Major Depressive Disorder + Alcohol Use Disorder</strong> is the most epidemiologically prevalent COD combination. Depression drives alcohol use through multiple pathways including anhedonia (alcohol produces short-term reward where nothing else does), hopelessness (drinking as giving up on recovery), and sleep disruption (alcohol as a sleep aid). Alcohol in turn produces direct neurobiological depression through its effects on serotonin and GABA systems, creating a self-reinforcing depressive cycle. <strong>Anxiety Disorders + Cannabis Use Disorder</strong> is an increasingly common presentation as cannabis potency has increased and its perceived therapeutic use for anxiety has grown. Cannabis can produce short-term anxiolytic effects for some users, but chronic heavy use is associated with increased anxiety, paranoia, and depressive symptoms, particularly with high-THC products. <strong>Bipolar Disorder + Alcohol Use Disorder</strong> is associated with particularly poor outcomes if untreated, given that alcohol destabilizes mood, interferes with mood-stabilizing medications, and dramatically increases suicide risk in bipolar populations. <strong>Psychotic Disorders + Cannabis Use Disorder</strong> presents unique diagnostic challenges, as cannabis can precipitate psychotic episodes in vulnerable individuals, exacerbate existing psychotic symptoms, and produce transient psychotic symptoms in individuals without primary psychotic disorders, requiring careful longitudinal assessment to establish diagnostic clarity.</p>`
        },
        {
          type: 'callout',
          calloutType: 'tip',
          title: 'Working with Denial and Resistance in COD Clients',
          content: 'What clinicians label as "denial" in COD clients is often a combination of shame, prior treatment trauma, legitimate ambivalence, cognitive effects of substances, and a rational response to a treatment system that has historically failed them. Confrontational approaches to denial reliably increase resistance without improving outcomes. MI-consistent responses — rolling with resistance, reflecting ambivalence, exploring discrepancies without argument — consistently outperform confrontation in the COD literature. Before interpreting resistance as pathological, ask: what function does this resistance serve? What does the client need to feel safe enough to acknowledge the problem?'
        },
        {
          type: 'accordion',
          title: 'DBT Skills Applied to COD Treatment',
          accordionItems: [
            {
              title: 'Mindfulness Skills: Observing Without Reacting',
              content: 'Mindfulness skills — particularly "observe," "describe," and "participate" without judgment — help COD clients develop the capacity to notice cravings, psychiatric symptoms, and emotional states without automatically acting on them. In COD practice, mindfulness is taught not as meditation but as a practical capacity: noticing the physical sensation of a craving as a wave that rises and falls, observing anxiety as a body state rather than a truth about danger, and recognizing that "I want to use" is a thought, not a command. This cognitive defusion from both craving and psychiatric symptoms is foundational to skill-based coping.'
            },
            {
              title: 'Distress Tolerance: Riding Out the Urge Without Acting',
              content: 'Distress tolerance skills are directly applicable to both substance use urges and acute psychiatric distress. TIPP skills (Temperature, Intense exercise, Paced breathing, Progressive muscle relaxation) address the physiological arousal that drives both relapse and psychiatric crisis. Radical acceptance — fully accepting a reality without approving of it — addresses the secondary suffering that often drives continued substance use: "I can\'t stand feeling this way, so I have to drink." Crisis survival skills (ACCEPTS, Self-Soothe) provide a concrete behavioral toolkit for getting through high-risk moments without using.'
            },
            {
              title: 'Emotion Regulation: Targeting the Negative Affect Driving Use',
              content: 'Many COD clients use substances specifically to regulate overwhelming emotional states: using alcohol to quiet rage, cannabis to manage anxiety, opioids to numb grief, stimulants to escape depression. Emotion regulation skills address these patterns by building the vocabulary and capacity to identify, label, and modulate emotions without substances. The PLEASE skills (treating PhysicaL illness, balanced Eating, Avoiding mood-altering substances, balanced Sleep, Exercise) address the lifestyle foundations of emotional regulation. The "opposite action" skill — deliberately acting opposite to an emotion-driven urge — is directly applicable to substance use urges.'
            },
            {
              title: 'Interpersonal Effectiveness: Rebuilding Relationships After CODs',
              content: 'Co-occurring disorders consistently damage interpersonal relationships — through erratic behavior during psychiatric episodes, relationship chaos during active use, broken trust, and social isolation. Interpersonal effectiveness skills help COD clients navigate the complex relational repair process that is often central to sustained recovery. DEAR MAN (Describe, Express, Assert, Reinforce, Mindful, Appear confident, Negotiate) provides a framework for making requests and setting limits in recovery. GIVE (Gentle, Interested, Validate, Easy manner) supports relationship maintenance. FAST (Fair, no Apologies, Stick to values, Truthful) supports self-respect in relationships.'
            }
          ]
        },
        {
          type: 'imageText',
          title: 'The COD Cycle: How Each Disorder Maintains the Other',
          content: `<p>In most COD presentations, the two disorders are not simply co-present — they are dynamically interacting in a self-reinforcing cycle. Psychiatric symptoms (hyperarousal, anhedonia, anxiety, impulsivity) create conditions that make substance use both appealing and difficult to resist. Substance use temporarily reduces symptoms (reinforcing continued use) while also producing neurobiological changes that worsen the underlying psychiatric condition over time. Understanding this cycle — and identifying the specific entry points for clinical intervention — is central to integrated case conceptualization.</p>`,
          imageUrl: '/images/courses/cod-cycle-diagram.jpg',
          imageAlt: 'Circular diagram showing how psychiatric symptoms drive substance use which worsens psychiatric symptoms',
          imagePosition: 'right'
        },
        {
          type: 'knowledgeCheck',
          title: 'Knowledge Check: MI Stages of Change',
          question: 'A client with co-occurring depression and alcohol use disorder says: "I know my drinking has gotten worse, but I don\'t think therapy for depression is going to help me." According to the Transtheoretical Model, which statement best describes this client\'s stage of change?',
          blockType: 'multipleChoice',
          options: [
            { text: 'Precontemplation for both disorders', isCorrect: false },
            { text: 'Contemplation for alcohol use disorder; Precontemplation for depression treatment', isCorrect: true },
            { text: 'Preparation for both disorders', isCorrect: false },
            { text: 'Action for alcohol use disorder; Precontemplation for depression treatment', isCorrect: false }
          ],
          correctAnswer: 1,
          explanation: 'This client is acknowledging that alcohol use has worsened (awareness of the problem = Contemplation stage for AUD) while simultaneously denying that depression treatment will help (not yet considering depression treatment = Precontemplation). COD clients often present at different stages for different disorders, requiring stage-matched interventions for each.'
        },
        {
          type: 'knowledgeCheck',
          title: 'Knowledge Check: Trauma-Informed COD Treatment',
          question: 'Which of the following statements about trauma-focused treatment in clients with active substance use are supported by the current evidence base? Select all that apply.',
          blockType: 'multiSelect',
          options: [
            { text: 'Trauma processing should be deferred until stable sobriety is achieved to prevent relapse', isCorrect: false },
            { text: 'Concurrent trauma-focused and SUD treatment does not increase relapse rates compared to sequential approaches', isCorrect: true },
            { text: 'Integrated trauma-SUD treatment (e.g., COPE) produces better outcomes on both PTSD and SUD measures than delayed trauma treatment', isCorrect: true },
            { text: 'Trauma-informed care requires avoiding any discussion of trauma history during active substance use', isCorrect: false }
          ],
          explanation: 'Current evidence from RCTs including COPE and ICBT trials demonstrates that concurrent trauma-focused and SUD treatment is safe and effective, producing better outcomes than the traditional sequential approach of deferring trauma treatment until sobriety. Trauma-informed care involves sensitive, collaborative engagement with trauma history rather than avoidance.'
        },
        {
          type: 'scenarioTree',
          scenarioTitle: 'Clinical Decision Point: Managing Ambivalence in a COD Client',
          instructions: 'You are meeting with Marcus, a 38-year-old client who has been referred by his PCP following a positive AUDIT screen. He presents with symptoms of generalized anxiety disorder and reports drinking 4–6 drinks most evenings to "turn his brain off." He says he does not think he has a drinking problem and resists the idea that therapy for anxiety would be useful because "talking about my problems just makes them worse." Walk through the clinical decision points.',
          nodes: [
            {
              id: 'start',
              text: 'Marcus says: "Look, I don\'t think I have a drinking problem. I use alcohol to relax, which is totally normal. I\'m here because my doctor made me come." How do you respond?',
              choices: [
                { text: 'Confront the discrepancy directly: "Your AUDIT score suggests a significant problem with alcohol — that\'s why you\'re here."', nextId: 'confrontation' },
                { text: 'Roll with resistance using a simple reflection: "You\'re not sure the drinking is really the issue."', nextId: 'rolling' },
                { text: 'Ignore the alcohol for now and focus on the anxiety he mentioned.', nextId: 'ignore' }
              ]
            },
            {
              id: 'confrontation',
              text: 'Marcus becomes defensive: "That test is ridiculous. Everyone I know drinks that much." His body language closes off. You have increased his resistance. What is the most likely clinical impact of continuing the confrontational approach?',
              choices: [
                { text: 'He will eventually admit the problem if confronted firmly enough.', nextId: 'confrontation_bad' },
                { text: 'He will likely disengage from treatment — confrontation reliably increases resistance in COD clients.', nextId: 'confrontation_correct' }
              ]
            },
            {
              id: 'confrontation_bad',
              text: 'Research consistently shows that confrontational approaches do NOT increase admission of problems in addicted clients — they increase dropout and treatment avoidance. Marcus needs a different approach.',
              isEnd: true,
              choices: []
            },
            {
              id: 'confrontation_correct',
              text: 'Correct. Confrontation increases resistance and is associated with higher dropout rates. You pivot to an MI-consistent approach — rolling with resistance, using simple reflections, and focusing on his ambivalence. This is the evidence-supported path.',
              isEnd: true,
              choices: []
            },
            {
              id: 'rolling',
              text: 'Marcus visibly relaxes slightly. "Yeah, I mean, the drinking is just how I cope." You reflect: "Coping with something difficult." He says, "My anxiety is through the roof at night — I can\'t turn my brain off." What do you explore next?',
              choices: [
                { text: 'Explore the connection between anxiety and alcohol: "Tell me more about what happens to your anxiety if you don\'t have the drinks at night."', nextId: 'connection' },
                { text: 'Immediately suggest anxiety treatment and schedule a follow-up for CBT.', nextId: 'premature_action' }
              ]
            },
            {
              id: 'connection',
              text: 'Marcus: "Honestly, it gets really bad. I can\'t sleep, I just lie there thinking. That\'s why I need the drinks." You have successfully helped him articulate how the anxiety drives the drinking — this is integrated awareness, and it is motivationally significant. You can now explore whether the drinking might also be making the anxiety worse over time. This is excellent COD-informed MI.',
              isEnd: true,
              choices: []
            },
            {
              id: 'premature_action',
              text: 'Moving to action-stage interventions (scheduling treatment) with a client in Precontemplation or early Contemplation produces premature closure and increases dropout. Marcus needs more evocative work before he is ready for this step.',
              isEnd: true,
              choices: []
            },
            {
              id: 'ignore',
              text: 'Ignoring the alcohol issue means providing parallel (sequential?) care rather than integrated care. The alcohol use is driving the anxiety and the anxiety is driving the alcohol use — addressing only one is likely to be ineffective.',
              isEnd: true,
              choices: []
            }
          ]
        },
        {
          type: 'reflection',
          title: 'Reflection: DBT Skills in Your Practice',
          question: 'DBT\'s four skills modules (Mindfulness, Distress Tolerance, Emotion Regulation, Interpersonal Effectiveness) address core deficits that drive both substance use and psychiatric distress. Which of these skill sets do you feel most and least comfortable teaching to clients? What gaps in your training or practice do you notice when you consider applying these skills to clients with co-occurring disorders? What one specific DBT skill might you incorporate more intentionally into your current work?'
        },
        {
          type: 'keyTakeaway',
          title: 'Key Takeaways: Section 2',
          takeaways: [
            'MI is the most evidence-supported approach to COD ambivalence; stage-matched MI (assessing stage of change separately for each disorder) prevents stage-mismatched interventions that backfire.',
            'Integrated CBT targets overlapping cognitive and behavioral mechanisms of both disorders simultaneously — more efficient and effective than disorder-specific CBT delivered separately.',
            'DBT skills (Mindfulness, Distress Tolerance, Emotion Regulation, Interpersonal Effectiveness) address core deficits driving both substance use and psychiatric distress in COD clients.',
            'Trauma-focused treatment delivered concurrently with SUD treatment does not increase relapse and produces better outcomes on both PTSD and SUD measures than the traditional sequential approach.',
            'Common COD presentations (PTSD+SUD, MDD+AUD, anxiety+cannabis, bipolar+AUD, psychosis+cannabis) follow recognizable patterns that guide integrated assessment and treatment planning.'
          ]
        }
      ]
    },

    // ─── SECTION 3: ADVANCED PRACTICE AND SPECIAL POPULATIONS ──────────────
    {
      title: 'Section 3: Advanced Practice, Ethics, and Special Populations',
      sectionNumber: 3,
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'Advanced Practice, Ethics, and Special Populations in COD Treatment',
          subtitle: 'MAT, Seeking Safety, 42 CFR Part 2, peer support, and adapting care for diverse populations',
          sectionNumber: 3
        },
        {
          type: 'text',
          content: `<h3>Medication-Assisted Treatment in the COD Context</h3>
<p>Medication-assisted treatment (MAT) — the use of FDA-approved medications in combination with counseling and behavioral therapies to treat substance use disorders — represents one of the most evidence-supported advances in addiction medicine over the past three decades. For mental health clinicians working with COD clients, a working knowledge of MAT is essential: both because MAT significantly improves SUD outcomes when appropriately indicated, and because interactions between MAT medications and psychiatric medications require careful clinical coordination.</p>
<p>The FDA-approved MAT options for opioid use disorder (OUD) include methadone, buprenorphine (with and without naloxone), and extended-release naltrexone (XR-naltrexone). For alcohol use disorder (AUD), approved medications include naltrexone (oral and extended-release injectable), acamprosate, and disulfiram. For nicotine use disorder, nicotine replacement therapies, varenicline, and bupropion are available. Each medication class has a distinct mechanism of action, evidence base, safety profile, and clinical use context.</p>
<p>In COD populations, MAT presents both opportunities and complexities. Buprenorphine, a partial mu-opioid agonist, is increasingly recognized not only as an effective OUD treatment but as having potential antidepressant and anxiolytic properties in some patients — a particularly useful profile in the OUD + depression COD presentation. Naltrexone, an opioid antagonist used for both OUD and AUD, requires careful coordination with pain management and can interact with the opioid effects of certain psychiatric medications. Methadone, administered only through federally regulated opioid treatment programs (OTPs), can produce QTc prolongation at higher doses, a concern when combined with antipsychotic medications. For clients with bipolar disorder and AUD, naltrexone can be combined with mood stabilizers and has shown efficacy in reducing drinking in bipolar populations without destabilizing mood.</p>
<p>Mental health clinicians who are not prescribers play a critical role in the MAT context: supporting client engagement with MAT, addressing the stigma that many clients (and their families, and their communities) carry about medication-based SUD treatment, coordinating with prescribing providers, monitoring for psychiatric medication interactions, and helping clients maintain adherence to MAT in the context of the broader recovery process. Stigma about MAT is pervasive — including among mental health providers — and is not supported by the evidence. MAT is not "trading one addiction for another"; it is treating a chronic neurobiological illness with medication, as insulin treats diabetes. Mental health clinicians who communicate accurately about MAT's evidence base can significantly affect whether COD clients pursue and maintain this life-saving treatment.</p>`
        },
        {
          type: 'text',
          content: `<h3>Seeking Safety and Recovery-Oriented Systems of Care</h3>
<p>Seeking Safety, developed by Lisa Najavits in the 1990s, is among the most extensively researched manualized interventions specifically designed for clients with co-occurring PTSD and substance use disorders. It is a present-focused, coping-skills-based group or individual treatment model that simultaneously addresses both PTSD and SUD without requiring clients to achieve abstinence before beginning and without engaging in trauma processing (which it defers to later phases of treatment). The manual consists of 25 topics organized around three domains: cognitive (e.g., "Compassion," "Honesty," "Recovery Thinking"), behavioral (e.g., "Taking Good Care of Yourself," "Detaching from Emotional Pain"), and interpersonal (e.g., "Asking for Help," "Setting Boundaries in Relationships"). Each session follows a consistent structure: check-in, introduction of a safe coping skill, practice, and commitment.</p>
<p>Seeking Safety has demonstrated effectiveness across more than 20 RCTs and other rigorous studies, showing significant reductions in PTSD symptoms, substance use, depression, and suicidal ideation compared to standard care. Importantly, Seeking Safety has been found effective across highly diverse populations — including veterans, incarcerated individuals, adolescents, and homeless women — making it one of the most generalizable COD interventions available. It is listed as an evidence-based intervention in SAMHSA's National Registry of Evidence-based Programs and Practices (NREPP). The model's emphasis on safety — both literal safety (from dangerous situations and relationships) and internal safety (from symptoms and self-destructive behaviors) — resonates deeply with COD clients who have experienced chronic trauma and whose lives may be characterized by ongoing instability.</p>
<p>Recovery-oriented systems of care (ROSC) represent a broader framework for organizing behavioral health services around the long-term recovery needs of individuals with CODs. ROSC moves beyond episodic, acute-care models (treat the crisis, discharge, repeat) toward continuous, community-based support that recognizes recovery as a long-term, nonlinear process. Key ROSC principles include person-centeredness (the individual defines their own recovery goals), strengths-based focus (building on existing resources rather than deficit remediation), community integration (supporting participation in community life, not just symptom reduction), and sustained support (recovery checkups, peer support, recovery coaching long after formal treatment ends). For COD clients specifically, ROSC addresses the fragmentation of the behavioral health system by creating care pathways that move fluidly between different levels of care (outpatient, intensive outpatient, residential, peer support, community services) as the client's needs evolve.</p>
<p>Case management and coordination with SUD treatment systems are practical necessities in integrated COD care. Mental health clinicians who work with COD clients often serve as the de facto coordination hub, interfacing with addiction treatment providers, prescribers, housing programs, vocational services, courts (in justice-involved cases), and family systems. Effective case management in COD settings includes understanding the structure of SUD treatment (levels of care per the ASAM criteria; the distinction between opioid treatment programs, residential programs, and intensive outpatient programs), maintaining warm referral relationships with SUD providers, communicating with COD clients' permission according to the stringent confidentiality requirements of 42 CFR Part 2 (discussed below), and helping clients navigate between systems that historically have not communicated well.</p>`
        },
        {
          type: 'text',
          content: `<h3>Ethics, Confidentiality (42 CFR Part 2), and Special Population Considerations</h3>
<p>Clinicians working with COD clients navigate a distinctive ethical landscape, shaped in part by federal confidentiality regulations that are stricter than those governing mental health records. Understanding these regulations is not merely a compliance requirement — it has direct implications for clinical practice, client trust, and care coordination.</p>
<p><strong>42 CFR Part 2 (Part 2)</strong> is a federal regulation that governs the confidentiality of substance use disorder treatment records for programs that receive federal assistance (directly or indirectly). Unlike HIPAA, which permits disclosure of mental health records for treatment coordination purposes without patient authorization in many circumstances, Part 2 generally requires written patient consent before SUD treatment records can be shared — even with other healthcare providers. This creates significant practical challenges in COD settings: a mental health clinician who wants to coordinate with a client's MAT provider must obtain a specific written consent that meets Part 2 requirements (including specification of the recipient, the type of information to be disclosed, the purpose, and an expiration date or event). Part 2 also restricts the use of SUD records in criminal proceedings without patient consent, a protection designed to encourage people to seek treatment without fear of legal consequences.</p>
<p>In 2020, SAMHSA finalized significant revisions to Part 2 that aligned it more closely with HIPAA, including allowing patients to give broad consent covering all future disclosures for treatment, payment, and healthcare operations. However, the core prohibition on disclosure without patient consent remains more restrictive than HIPAA, and mental health clinicians who work with COD clients in Part 2-covered programs must understand and comply with its requirements. Documentation in integrated COD settings must also be carefully managed: notes about substance use issues in mental health records may or may not be covered by Part 2 depending on whether the clinician is working within a Part 2-covered program, creating potential confusion about which regulations govern a given record.</p>
<p><strong>Special Population Considerations.</strong> Integrated COD treatment requires meaningful adaptation for specific populations whose presentations, needs, and contexts differ substantially from the general adult outpatient population. <em>Adolescents</em> with CODs present unique developmental considerations: substance use during adolescence occurs during a critical period of brain development, particularly of prefrontal cortical executive function, making them particularly vulnerable to both the neurobiological effects of substances and to the trajectory effects of untreated psychiatric disorders. Adolescent COD treatment must be developmentally tailored — involving families, addressing school functioning, using peer-oriented approaches — and must navigate the complex consent and confidentiality landscape around minor treatment rights. <em>Justice-involved individuals</em> are among the highest-prevalence COD populations; studies suggest that 65–80% of incarcerated individuals have a substance use disorder, and rates of co-occurring mental illness in correctional settings are dramatically elevated. Treatment in justice-involved contexts must navigate mandatory reporting obligations, legal constraints on treatment options, and the therapeutic challenges of working with clients whose engagement may be coerced rather than voluntary. <em>Pregnant clients</em> with CODs face unique medical and social complexity, including the teratogenic effects of substances on fetal development, the risks of abrupt withdrawal during pregnancy, the evidence base for MAT (specifically methadone and buprenorphine for OUD) in pregnancy, and the social and legal implications of substance use during pregnancy including mandatory reporting in many states and child welfare involvement. <em>Older adults</em> with CODs are a growing and frequently underrecognized population: substance use disorders — particularly alcohol use disorder — in adults over 60 are often missed in clinical settings because providers may not screen, clients may minimize use, and symptoms may mimic or be attributed to aging-related conditions. Age-related physiological changes alter both the pharmacokinetics of substances and the metabolism of psychiatric medications, requiring adjusted treatment approaches.</p>
<p>Peer support integration is a particularly powerful component of integrated COD care that is increasingly recognized in the evidence base. Peer support specialists — individuals with lived experience of both mental health and substance use challenges who are trained to support others in recovery — can provide unique credibility, practical knowledge, and relational support that professional clinicians cannot replicate. Research on peer support in COD settings shows improved engagement in treatment, reduced hospitalization, improved quality of life, and sustained recovery outcomes. Mental health clinicians who understand how to collaborate with peer support specialists — clarifying respective roles, maintaining appropriate communication, and integrating peer perspectives into care planning — are better positioned to serve COD clients within a genuinely integrated recovery-oriented system.</p>`
        },
        {
          type: 'callout',
          calloutType: 'warning',
          title: '42 CFR Part 2: A Critical Compliance Note',
          content: 'Part 2 is more restrictive than HIPAA. If your client is receiving substance use disorder treatment at a federally assisted program, you must obtain a specific written consent meeting Part 2 requirements before sharing their SUD treatment records — even with their other healthcare providers. Failure to comply is a federal violation. When in doubt, consult your agency\'s compliance officer or legal counsel. Document all Part 2 consents carefully, including recipient, type of information, purpose, and expiration.'
        },
        {
          type: 'accordion',
          title: 'Special Population Adaptation Guide',
          accordionItems: [
            {
              title: 'Adolescents with Co-Occurring Disorders',
              content: 'Adolescent COD treatment must account for the developmental context of substance use during brain development, the centrality of family and peer systems, school functioning, and the distinct consent/confidentiality landscape for minors. Effective approaches use developmentally tailored language, involve parents or guardians (with appropriate client consent), address school-related stressors, and recognize that adolescents\' stage of change and treatment motivation is heavily influenced by their social environment. Family-Based Therapy and Multidimensional Family Therapy (MDFT) have the strongest evidence for adolescent CODs. Screen adolescents with the CRAFFT (Car, Relax, Alone, Forget, Friends, Trouble) screening tool, which is validated for ages 12–21.'
            },
            {
              title: 'Justice-Involved Clients with CODs',
              content: 'Between 65–80% of incarcerated individuals have a substance use disorder; rates of co-occurring mental illness in correctional settings are substantially elevated. Key clinical considerations include: (1) Voluntary vs. mandated treatment — involuntary treatment engagement does not preclude positive outcomes when combined with MI-consistent approaches; (2) Navigating mandatory reporting and court reporting obligations transparently with clients; (3) Understanding drug court frameworks and how COD treatment interacts with legal requirements; (4) Addressing criminogenic thinking (attitudes, values, and beliefs that support criminal behavior) as a treatment target alongside CODs; (5) Re-entry planning for individuals being released from incarceration — the period immediately following release is among the highest-risk periods for overdose death, particularly for individuals who received MAT or naloxone in custody.'
            },
            {
              title: 'Pregnant Clients with Co-Occurring Disorders',
              content: 'Abrupt withdrawal from alcohol, benzodiazepines, or opioids during pregnancy carries serious risks including seizures, preterm labor, and fetal distress — medical detoxification under supervision is essential. For pregnant clients with OUD, methadone and buprenorphine are evidence-based, FDA-recommended options; neonatal opioid withdrawal syndrome (NOWS), while manageable medically, is a predictable consequence rather than a contraindication to MAT. Mental health treatment during pregnancy must account for the psychotropic medication risk-benefit profile in pregnancy. Mandatory reporting obligations for substance use during pregnancy vary by state and can create significant barriers to treatment engagement when clients fear legal consequences — trauma-informed approaches that prioritize the therapeutic alliance are critical for retaining pregnant clients in care.'
            },
            {
              title: 'Older Adults with Co-Occurring Disorders',
              content: 'Alcohol use disorder is the most prevalent SUD in adults over 60 and is frequently underdetected. Age-related physiological changes (reduced lean body mass, decreased liver metabolism, reduced renal function) mean that older adults experience the effects of substances at lower doses and are more vulnerable to drug interactions. Comorbid medical conditions are common and complicate both assessment and treatment. Common COD presentations in older adults include AUD + depression, AUD + anxiety, prescription opioid misuse + chronic pain + depression. Isolation and grief (loss of partners, friends, work identity, physical functioning) frequently drive late-onset substance use. Use the SMAST-G (Short Michigan Alcoholism Screening Test — Geriatric Version) for screening. Involve primary care providers in coordinated care.'
            },
            {
              title: 'Implementing Peer Support in COD Settings',
              content: 'Peer support specialists bring lived experience credentials that are uniquely credible to clients who have felt judged, misunderstood, or failed by professional systems. In integrated COD settings, peers can provide: accompaniment to appointments, help navigating insurance and benefits systems, practical recovery coaching, facilitation of peer support groups, and ongoing recovery check-ins between professional appointments. Effective collaboration with peers requires: clear role definition (clinical vs. peer support functions), regular communication, trauma-informed supervision, attention to boundaries (peers have their own recovery needs), and genuine integration into the care team rather than relegation to administrative functions. Research supports peer-delivered interventions for both SUD and mental health; the dual-expertise of COD peers is particularly valuable in integrated settings.'
            }
          ]
        },
        {
          type: 'imageText',
          title: 'The ASAM Criteria: Matching Level of Care to COD Severity',
          content: `<p>The American Society of Addiction Medicine (ASAM) Criteria (formerly ASAM Patient Placement Criteria) provide a multidimensional assessment framework for matching individuals to appropriate levels of SUD treatment intensity. The six dimensions assessed include: (1) Acute intoxication/withdrawal potential; (2) Biomedical conditions and complications; (3) Emotional, behavioral, or cognitive conditions and complications — this dimension directly captures co-occurring psychiatric disorders; (4) Readiness to change; (5) Relapse potential; (6) Recovery/living environment. For COD clients, Dimension 3 is often the most clinically significant driver of placement decisions — severe psychiatric symptoms may require more intensive or specialized levels of care than SUD severity alone would suggest. Mental health clinicians coordinating with SUD providers should be familiar with ASAM criteria to communicate effectively about client needs across systems.</p>`,
          imageUrl: '/images/courses/asam-criteria-dimensions.jpg',
          imageAlt: 'Six-dimensional ASAM criteria framework for level of care placement in substance use treatment',
          imagePosition: 'left'
        },
        {
          type: 'knowledgeCheck',
          title: 'Knowledge Check: 42 CFR Part 2',
          question: 'Under 42 CFR Part 2, which of the following is accurate regarding disclosure of substance use disorder treatment records from a federally assisted program?',
          blockType: 'multipleChoice',
          options: [
            { text: 'Records may be shared with any treating provider for treatment coordination under HIPAA\'s treatment exception', isCorrect: false },
            { text: 'Records generally require written patient consent before disclosure even to other healthcare providers, with few exceptions', isCorrect: true },
            { text: 'Records may be freely disclosed to law enforcement when a crime is suspected', isCorrect: false },
            { text: 'Records are treated identically to general mental health records under HIPAA', isCorrect: false }
          ],
          correctAnswer: 1,
          explanation: '42 CFR Part 2 is more restrictive than HIPAA and generally requires specific written patient consent before SUD treatment records can be shared — including with other healthcare providers. Unlike HIPAA\'s treatment exception, Part 2 does not allow disclosure for treatment coordination without consent. Law enforcement disclosure without patient consent is also generally prohibited. The 2020 revisions aligned Part 2 more closely with HIPAA but maintained the core consent requirement.'
        },
        {
          type: 'knowledgeCheck',
          title: 'Knowledge Check: MAT and COD',
          question: 'Which of the following statements about medication-assisted treatment (MAT) in co-occurring disorder clients are accurate? Select all that apply.',
          blockType: 'multiSelect',
          options: [
            { text: 'MAT for OUD includes methadone, buprenorphine, and extended-release naltrexone', isCorrect: true },
            { text: 'MAT is considered "trading one addiction for another" and should be avoided in clients with psychiatric co-occurring disorders', isCorrect: false },
            { text: 'Mental health clinicians play a key role in addressing MAT stigma and supporting client adherence', isCorrect: true },
            { text: 'Methadone can cause QTc prolongation at higher doses, a concern when combined with some antipsychotic medications', isCorrect: true }
          ],
          explanation: 'MAT for OUD includes methadone, buprenorphine (with/without naloxone), and extended-release naltrexone. MAT is not "trading addictions" — it is evidence-based pharmacotherapy for a chronic illness. Mental health clinicians are critical partners in addressing MAT stigma and supporting adherence. Methadone\'s QTc prolongation risk is a real clinical concern in clients taking antipsychotic medications.'
        },
        {
          type: 'sequencing',
          title: 'Sequencing Activity: Steps in Integrated COD Case Management',
          instructions: 'Arrange the following steps in the correct order for conducting integrated COD case management with a new client. Drag and drop to place them in the proper sequence.',
          steps: [
            { text: 'Administer validated screening tools (AUDIT, DAST-10) and complete a comprehensive biopsychosocial assessment covering both substance use and psychiatric history.', order: 1 },
            { text: 'Assess stage of change separately for substance use and for mental health treatment engagement; identify barriers to treatment entry for each.', order: 2 },
            { text: 'Obtain signed consent forms including a Part 2-compliant consent for coordination with SUD treatment providers if applicable.', order: 3 },
            { text: 'Develop an integrated treatment plan addressing both disorders simultaneously, with measurable goals for each, and identify level of care placement using ASAM criteria guidance.', order: 4 },
            { text: 'Initiate MI-consistent engagement work matched to the client\'s current stage of change; begin skills-based interventions (coping skills, psychoeducation, safety planning) as appropriate.', order: 5 },
            { text: 'Coordinate with SUD treatment providers, prescribers, peer support specialists, and community resources; document coordination contacts and outcomes.', order: 6 }
          ],
          explanation: 'Effective integrated COD case management begins with comprehensive assessment and screening, then evaluates stage of change and treatment readiness, obtains appropriate consents (including Part 2 compliance), develops an integrated treatment plan, initiates appropriately matched interventions, and establishes ongoing coordination with the broader treatment system.'
        },
        {
          type: 'reflection',
          title: 'Reflection: Ethics and Boundaries in COD Practice',
          question: 'Consider the ethical dimensions of your current practice with clients who have co-occurring disorders. Are you routinely screening for substance use disorders using validated tools? Do you have a process for obtaining Part 2-compliant consents when coordinating with SUD providers? When a client discloses substance use, how do you balance confidentiality, duty to warn, and therapeutic alliance? What systemic barriers in your current setting make integrated COD care more difficult, and what is one step you could take to address one of those barriers?'
        },
        {
          type: 'keyTakeaway',
          title: 'Key Takeaways: Section 3',
          takeaways: [
            'MAT (methadone, buprenorphine, naltrexone for OUD; naltrexone, acamprosate, disulfiram for AUD) significantly improves SUD outcomes; mental health clinicians play a key role in addressing MAT stigma and supporting adherence.',
            'Seeking Safety is a manualized, evidence-based intervention for PTSD + SUD that is effective, generalizable, and does not require abstinence before treatment begins.',
            '42 CFR Part 2 requires written patient consent before SUD treatment records from federally assisted programs can be shared — more restrictive than HIPAA, even for treatment coordination.',
            'Peer support integration improves treatment engagement, reduces hospitalization, and supports sustained recovery in COD populations — peers with dual lived experience are uniquely valuable in integrated settings.',
            'Special populations (adolescents, justice-involved, pregnant clients, older adults) require meaningful adaptation of integrated COD treatment approaches — not just demographic tailoring but substantive modification of assessment tools, treatment models, and coordination strategies.'
          ]
        },
        {
          type: 'resources',
          title: 'Resources: Co-Occurring Disorders Practice and Research',
          items: [
            {
              name: 'SAMHSA — Co-Occurring Disorders Resource Overview',
              url: 'https://www.samhsa.gov/co-occurring-disorders',
              description: 'SAMHSA\'s central resource hub for co-occurring disorders, including the IDDT toolkit, Tip 42 (Substance Abuse Treatment for Persons With Co-Occurring Disorders), and clinical guidance documents.'
            },
            {
              name: 'SAMHSA TIP 42: Substance Abuse Treatment for Persons With Co-Occurring Disorders (Revised 2020)',
              url: 'https://store.samhsa.gov/product/TIP-42-Substance-Abuse-Treatment-for-Persons-With-Co-Occurring-Disorders/PEP20-02-01-004',
              description: 'The authoritative federal clinical guidance document on COD treatment, extensively revised in 2020. Required reading for clinicians working in integrated COD settings.'
            },
            {
              name: 'Seeking Safety — Official Program Website',
              url: 'https://www.treatment-innovations.org/seeking-safety.html',
              description: 'Official site for Seeking Safety by Lisa Najavits, including the manual overview, training opportunities, research database, and implementation guidance for clinicians and programs.'
            },
            {
              name: 'NIDA — Comorbidity: Substance Use Disorders and Other Mental Illnesses',
              url: 'https://nida.nih.gov/research-topics/comorbidity',
              description: 'The National Institute on Drug Abuse\'s research overview on CODs, including the neurobiology of comorbidity, treatment research findings, and population-specific data.'
            },
            {
              name: 'ASAM Criteria (American Society of Addiction Medicine)',
              url: 'https://www.asam.org/asam-criteria',
              description: 'The ASAM Criteria provide the clinical framework for matching patients to appropriate levels of SUD care across six dimensions, including co-occurring psychiatric disorders (Dimension 3).'
            },
            {
              name: '42 CFR Part 2 — SAMHSA Guidance and Q&A',
              url: 'https://www.samhsa.gov/about-us/who-we-are/laws-regulations/confidentiality-regulations-faqs',
              description: 'SAMHSA\'s comprehensive FAQ and guidance on 42 CFR Part 2 confidentiality requirements for substance use disorder treatment records, including the 2020 regulatory revisions.'
            },
            {
              name: 'Motivational Interviewing Network of Trainers (MINT)',
              url: 'https://motivationalinterviewing.org/',
              description: 'MINT is the international organization for MI trainers and practitioners. The site includes training resources, research, videos, and the MI reading room — an excellent resource for deepening MI skills for COD practice.'
            },
            {
              name: 'CRAFT (Community Reinforcement and Family Training) — Overview',
              url: 'https://www.robertjmeyersphd.com/craft.html',
              description: 'CRAFT is an evidence-based approach for family members and significant others of individuals with CODs who are not yet engaging in treatment. Effectively brings treatment-resistant individuals into care.'
            }
          ]
        }
      ]
    }
  ],

  // ─── ASSESSMENT ──────────────────────────────────────────────────────────
  assessment: {
    passingScore: 80,
    maxAttempts: 3,
    shuffleQuestions: true,
    questions: [
      {
        question: 'According to SAMHSA\'s National Survey on Drug Use and Health, what is the approximate number of U.S. adults who experienced both a mental illness and a substance use disorder in 2020?',
        type: 'multipleChoice',
        options: [
          { text: 'Approximately 2.1 million', isCorrect: false },
          { text: 'Approximately 9.2 million', isCorrect: true },
          { text: 'Approximately 15.4 million', isCorrect: false },
          { text: 'Approximately 25 million', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'SAMHSA data from the 2020 NSDUH indicated that approximately 9.2 million U.S. adults experienced co-occurring mental illness and substance use disorder — roughly 3.4% of the adult population.'
      },
      {
        question: 'Edward Khantzian\'s self-medication hypothesis proposes that substance use in individuals with psychiatric disorders is best understood as:',
        type: 'multipleChoice',
        options: [
          { text: 'A purely neurobiological compulsion with no psychological meaning', isCorrect: false },
          { text: 'A functional attempt to manage unbearable or uncontrollable psychiatric symptoms', isCorrect: true },
          { text: 'Evidence of antisocial personality traits', isCorrect: false },
          { text: 'A failure of willpower or moral character', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'Khantzian\'s self-medication hypothesis frames substance use in psychiatric populations as a functional (if ultimately harmful) attempt to manage real symptoms — not as irrational behavior. This reframe supports clinical curiosity and compassion and reduces client shame.'
      },
      {
        question: 'Which of the following features distinguish SAMHSA\'s Integrated Dual Diagnosis Treatment (IDDT) model from other COD treatment approaches? Select all that apply.',
        type: 'multiSelect',
        options: [
          { text: 'Team-based care in which all providers share responsibility for both disorders', isCorrect: true },
          { text: 'A stage-wise approach matched to the client\'s level of motivation and engagement', isCorrect: true },
          { text: 'A long-term perspective recognizing recovery as a process measured in years', isCorrect: true },
          { text: 'Mandatory abstinence as a prerequisite for mental health treatment', isCorrect: false }
        ],
        explanation: 'IDDT is characterized by team-based care, a stage-wise approach, and a long-term recovery perspective. It does NOT require mandatory abstinence before mental health treatment — that is characteristic of traditional sequential models that IDDT was developed to replace.'
      },
      {
        question: 'A client with a history of childhood trauma presents with PTSD symptoms and has been using alcohol heavily for five years. According to current evidence, the most appropriate approach to treatment is:',
        type: 'multipleChoice',
        options: [
          { text: 'Treat the alcohol use disorder first; defer trauma processing until sobriety is established for at least six months', isCorrect: false },
          { text: 'Treat only the PTSD; the alcohol use will resolve when trauma symptoms are resolved', isCorrect: false },
          { text: 'Address both PTSD and AUD concurrently using an integrated trauma-informed approach', isCorrect: true },
          { text: 'Refer the client to a separate addiction counselor; do not address trauma until the addiction counselor confirms stabilization', isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: 'RCTs (including COPE and ICBT trials) demonstrate that concurrent trauma-focused and SUD treatment produces better outcomes on both PTSD and SUD measures than the sequential approach of deferring trauma treatment. Treating trauma and SUD concurrently does not increase relapse rates.'
      },
      {
        question: 'The AUDIT screening tool was developed by which organization, and what score generally indicates hazardous or harmful alcohol use?',
        type: 'multipleChoice',
        options: [
          { text: 'SAMHSA; score of 5 or higher', isCorrect: false },
          { text: 'World Health Organization (WHO); score of 8 or higher', isCorrect: true },
          { text: 'NIDA; score of 10 or higher', isCorrect: false },
          { text: 'American Psychological Association; score of 12 or higher', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'The AUDIT (Alcohol Use Disorders Identification Test) was developed by the World Health Organization. Scores of 8 or higher indicate hazardous or harmful alcohol use; scores of 15+ suggest possible AUD; scores of 20+ are associated with high-severity dependence.'
      },
      {
        question: 'Under 42 CFR Part 2, substance use disorder treatment records from federally assisted programs may be disclosed to other healthcare providers for treatment coordination:',
        type: 'multipleChoice',
        options: [
          { text: 'Freely, under HIPAA\'s treatment exception', isCorrect: false },
          { text: 'Only with a specific written patient consent meeting Part 2 requirements', isCorrect: true },
          { text: 'With verbal patient consent documented in the chart', isCorrect: false },
          { text: 'Only when ordered by a court', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: '42 CFR Part 2 is more restrictive than HIPAA and generally requires written patient consent — meeting specific Part 2 requirements including identification of the recipient, type of information, purpose, and expiration — before SUD records can be shared even with treating providers.'
      },
      {
        question: 'Which of the following FDA-approved medications are used in medication-assisted treatment (MAT) for opioid use disorder? Select all that apply.',
        type: 'multiSelect',
        options: [
          { text: 'Methadone', isCorrect: true },
          { text: 'Buprenorphine/naloxone', isCorrect: true },
          { text: 'Extended-release naltrexone (XR-naltrexone)', isCorrect: true },
          { text: 'Disulfiram', isCorrect: false }
        ],
        explanation: 'FDA-approved MAT for OUD includes methadone (through federally regulated OTPs), buprenorphine (with or without naloxone), and extended-release naltrexone. Disulfiram is approved for alcohol use disorder, not OUD.'
      },
      {
        question: 'In the Transtheoretical Model (TTM), a client with co-occurring bipolar disorder and alcohol use disorder who says "I know my drinking is a problem, but I\'m not ready to do anything about it yet" is in which stage of change for the substance use disorder?',
        type: 'multipleChoice',
        options: [
          { text: 'Precontemplation', isCorrect: false },
          { text: 'Contemplation', isCorrect: true },
          { text: 'Preparation', isCorrect: false },
          { text: 'Maintenance', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'Contemplation is characterized by awareness of the problem and consideration of change without current commitment to action. "I know it\'s a problem but I\'m not ready" is classic Contemplation language. Stage-matched MI interventions (exploring ambivalence, eliciting change talk) are most appropriate here.'
      },
      {
        question: 'Seeking Safety, developed by Lisa Najavits, is best described as:',
        type: 'multipleChoice',
        options: [
          { text: 'A trauma processing intervention requiring abstinence before beginning', isCorrect: false },
          { text: 'A present-focused coping skills intervention addressing PTSD and SUD simultaneously without requiring abstinence', isCorrect: true },
          { text: 'A medication management protocol for clients with complex trauma and SUD', isCorrect: false },
          { text: 'A 12-step facilitation program modified for COD populations', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'Seeking Safety is a present-focused, coping-skills-based intervention that addresses PTSD and SUD simultaneously without requiring abstinence or trauma processing. It has demonstrated effectiveness across more than 20 RCTs and is listed in SAMHSA\'s NREPP.'
      },
      {
        question: 'Which of the following clinical approaches are consistent with a trauma-informed approach to co-occurring disorders? Select all that apply.',
        type: 'multiSelect',
        options: [
          { text: 'Understanding substance use as a trauma response rather than a moral failure', isCorrect: true },
          { text: 'Requiring clients to be abstinent for 30 days before discussing trauma history', isCorrect: false },
          { text: 'Ensuring assessment and treatment processes do not replicate dynamics of powerlessness or violation', isCorrect: true },
          { text: 'Collaborating with clients to build both internal and external safety', isCorrect: true }
        ],
        explanation: 'Trauma-informed COD care involves understanding substance use as a trauma response, avoiding clinical processes that replicate trauma dynamics (such as coercive or unpredictable interactions), and collaboratively building safety. The 30-day abstinence requirement before discussing trauma is the sequential approach that is contradicted by current evidence.'
      },
      {
        question: 'A mental health clinician is coordinating care for a client with OUD and depression who is receiving buprenorphine from a federally-funded opioid treatment program. The clinician has obtained the client\'s consent but realizes the consent form only specifies "treatment coordination" without naming the specific receiving provider. This consent form:',
        type: 'multipleChoice',
        options: [
          { text: 'Is adequate under HIPAA and thus also adequate under Part 2', isCorrect: false },
          { text: 'Is likely insufficient under 42 CFR Part 2, which requires specific identification of the recipient', isCorrect: true },
          { text: 'Is adequate because the client gave verbal authorization separately', isCorrect: false },
          { text: 'Is adequate if signed by the client\'s prescriber as well', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: '42 CFR Part 2 requires specific consent elements including identification of the specific recipient, the type of information to be disclosed, the purpose, and an expiration date or event. A general "treatment coordination" consent without a named recipient is likely insufficient under Part 2\'s requirements.'
      },
      {
        question: 'The ASAM Criteria assess clients across six dimensions for SUD treatment placement. Which dimension specifically addresses co-occurring psychiatric disorders?',
        type: 'multipleChoice',
        options: [
          { text: 'Dimension 1: Acute intoxication and withdrawal potential', isCorrect: false },
          { text: 'Dimension 2: Biomedical conditions and complications', isCorrect: false },
          { text: 'Dimension 3: Emotional, behavioral, or cognitive conditions and complications', isCorrect: true },
          { text: 'Dimension 6: Recovery/living environment', isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: 'ASAM Dimension 3 (Emotional, behavioral, or cognitive conditions and complications) directly captures co-occurring psychiatric disorders and is often the most clinically significant driver of placement decisions for COD clients — severe psychiatric symptoms may require more intensive care than SUD severity alone would suggest.'
      },
      {
        question: 'Which of the following DBT skills modules are particularly applicable to COD clients? Select all that apply.',
        type: 'multiSelect',
        options: [
          { text: 'Mindfulness — observing cravings and psychiatric symptoms without automatically acting on them', isCorrect: true },
          { text: 'Distress Tolerance — TIPP skills and radical acceptance as alternatives to substance use in acute distress', isCorrect: true },
          { text: 'Emotion Regulation — targeting negative affect that drives both relapse and psychiatric symptom exacerbation', isCorrect: true },
          { text: 'Interpersonal Effectiveness — rebuilding relationships damaged by CODs', isCorrect: true }
        ],
        explanation: 'All four DBT skills modules are directly applicable to COD clients. Mindfulness supports observing rather than reacting to symptoms and cravings. Distress Tolerance provides alternatives to using in acute distress. Emotion Regulation targets negative affect driving both disorders. Interpersonal Effectiveness supports relationship repair central to sustained recovery.'
      },
      {
        question: 'A pregnant client with opioid use disorder is concerned about taking buprenorphine during pregnancy because she has heard it will harm her baby. The most accurate clinical response is:',
        type: 'multipleChoice',
        options: [
          { text: 'Agree that buprenorphine should be avoided in pregnancy and recommend medically supervised abstinence instead', isCorrect: false },
          { text: 'Explain that buprenorphine is FDA-recommended for OUD in pregnancy; neonatal opioid withdrawal syndrome is manageable medically and the risks of untreated OUD outweigh the risks of MAT', isCorrect: true },
          { text: 'Advise the client to ask her obstetrician to prescribe methadone instead, which is safer in pregnancy', isCorrect: false },
          { text: 'Recommend she discontinue opioid use abruptly to protect the fetus', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'Both methadone and buprenorphine are FDA-recommended and evidence-based for OUD in pregnancy. Neonatal opioid withdrawal syndrome (NOWS) is a predictable and medically manageable outcome, not a contraindication to MAT. Abrupt withdrawal during pregnancy carries serious risks including seizures, preterm labor, and fetal distress.'
      },
      {
        question: 'Research on peer support specialists in COD settings shows which of the following outcomes compared to standard care? Select all that apply.',
        type: 'multiSelect',
        options: [
          { text: 'Improved engagement in treatment', isCorrect: true },
          { text: 'Reduced rates of psychiatric hospitalization', isCorrect: true },
          { text: 'Improved quality of life', isCorrect: true },
          { text: 'Complete resolution of co-occurring psychiatric symptoms without professional treatment', isCorrect: false }
        ],
        explanation: 'Research on peer support in COD settings demonstrates improved treatment engagement, reduced hospitalization, and improved quality of life compared to standard care without peer support. Peer support enhances but does not replace professional treatment; it does not produce complete resolution of psychiatric symptoms independently.'
      },
      {
        question: 'The "four-week rule" in COD assessment refers to:',
        type: 'multipleChoice',
        options: [
          { text: 'The required waiting period before initiating antidepressant treatment in clients with active substance use', isCorrect: false },
          { text: 'A guideline suggesting that psychiatric symptoms persisting beyond four weeks of abstinence are more likely to reflect an independent disorder', isCorrect: true },
          { text: 'The maximum time allowed before mandatory reassessment under ASAM criteria', isCorrect: false },
          { text: 'The minimum duration of MAT required before transition to outpatient mental health treatment', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'The four-week rule is a clinical guideline suggesting that significant psychiatric symptoms persisting beyond four weeks of substance abstinence are more likely to reflect an independent disorder rather than substance-induced symptoms. This rule has significant limitations and must be used as one data point in comprehensive longitudinal assessment, not as a rigid standard.'
      }
    ]
  },

  // ─── REFERENCES ──────────────────────────────────────────────────────────
  references: [
    {
      citation: 'Substance Abuse and Mental Health Services Administration. (2020). Key substance use and mental health indicators in the United States: Results from the 2020 National Survey on Drug Use and Health (HHS Publication No. PEP21-07-01-003). SAMHSA.',
      url: 'https://www.samhsa.gov/data/report/2020-nsduh-annual-national-report'
    },
    {
      citation: 'Drake, R. E., Mueser, K. T., Brunette, M. F., & McHugo, G. J. (2004). A review of treatments for people with severe mental illnesses and co-occurring substance use disorders. Psychiatric Rehabilitation Journal, 27(4), 360–374.',
      url: 'https://doi.org/10.2975/27.2004.360.374'
    },
    {
      citation: 'Khantzian, E. J. (1997). The self-medication hypothesis of substance use disorders: A reconsideration and recent applications. Harvard Review of Psychiatry, 4(5), 231–244.',
      url: 'https://doi.org/10.3109/10673229709030550'
    },
    {
      citation: 'Najavits, L. M. (2002). Seeking Safety: A treatment manual for PTSD and substance abuse. Guilford Press.',
      url: ''
    },
    {
      citation: 'Miller, W. R., & Rollnick, S. (2013). Motivational interviewing: Helping people change (3rd ed.). Guilford Press.',
      url: ''
    },
    {
      citation: 'Brady, K. T., Back, S. E., & Coffey, S. F. (2004). Substance abuse and posttraumatic stress disorder. Current Directions in Psychological Science, 13(5), 206–209.',
      url: 'https://doi.org/10.1111/j.0963-7214.2004.00309.x'
    },
    {
      citation: 'Minkoff, K., & Drake, R. E. (Eds.). (1991). Dual diagnosis of major mental illness and substance disorder. New Directions for Mental Health Services.',
      url: 'https://doi.org/10.1002/yd.23319915103'
    },
    {
      citation: 'Substance Abuse and Mental Health Services Administration. (2020). Substance abuse treatment for persons with co-occurring disorders (Treatment Improvement Protocol [TIP] Series, No. 42). SAMHSA.',
      url: 'https://store.samhsa.gov/product/TIP-42-Substance-Abuse-Treatment-for-Persons-With-Co-Occurring-Disorders/PEP20-02-01-004'
    },
    {
      citation: 'Prochaska, J. O., & DiClemente, C. C. (1983). Stages and processes of self-change of smoking: Toward an integrative model of change. Journal of Consulting and Clinical Psychology, 51(3), 390–395.',
      url: 'https://doi.org/10.1037/0022-006X.51.3.390'
    },
    {
      citation: 'Hien, D. A., Cohen, L. R., Miele, G. M., Litt, L. C., & Capstick, C. (2004). Promising treatments for women with comorbid PTSD and substance use disorders. American Journal of Psychiatry, 161(8), 1426–1432.',
      url: 'https://doi.org/10.1176/appi.ajp.161.8.1426'
    },
    {
      citation: 'Linehan, M. M. (1993). Cognitive-behavioral treatment of borderline personality disorder. Guilford Press.',
      url: ''
    },
    {
      citation: 'Ries, R. K., Fiellin, D. A., Miller, S. C., & Saitz, R. (Eds.). (2014). The ASAM principles of addiction medicine (5th ed.). Wolters Kluwer.',
      url: ''
    },
    {
      citation: 'Leshner, A. I. (1997). Addiction is a brain disease, and it matters. Science, 278(5335), 45–47.',
      url: 'https://doi.org/10.1126/science.278.5335.45'
    },
    {
      citation: 'Substance Abuse and Mental Health Services Administration. (2022). 42 CFR Part 2 confidentiality of substance use disorder patient records: Final rule. Federal Register, 85(99).',
      url: 'https://www.samhsa.gov/about-us/who-we-are/laws-regulations/confidentiality-regulations-faqs'
    },
    {
      citation: 'Mueser, K. T., Noordsy, D. L., Drake, R. E., & Fox, L. (2003). Integrated treatment for dual disorders: A guide to effective practice. Guilford Press.',
      url: ''
    },
    {
      citation: 'Felitti, V. J., Anda, R. F., Nordenberg, D., Williamson, D. F., Spitz, A. M., Edwards, V., Koss, M. P., & Marks, J. S. (1998). Relationship of childhood abuse and household dysfunction to many of the leading causes of death in adults. American Journal of Preventive Medicine, 14(4), 245–258.',
      url: 'https://doi.org/10.1016/S0749-3797(98)00017-8'
    },
    {
      citation: 'Babor, T. F., Higgins-Biddle, J. C., Saunders, J. B., & Monteiro, M. G. (2001). AUDIT: The Alcohol Use Disorders Identification Test: Guidelines for use in primary care (2nd ed.). World Health Organization.',
      url: 'https://apps.who.int/iris/handle/10665/67205'
    },
    {
      citation: 'Mills, K. L., Teesson, M., Back, S. E., Brady, K. T., Baker, A. L., Hopwood, S., Sannibale, C., Barrett, E. L., Merz, S., Rosenfeld, J., & Ewer, P. L. (2012). Integrated exposure-based therapy for co-occurring posttraumatic stress disorder and substance dependence: A randomized controlled trial. JAMA, 308(7), 690–699.',
      url: 'https://doi.org/10.1001/jama.2012.9071'
    }
  ]
};

function stripHTML(h) { return (h || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(); }
function countWords(c) {
  let t = 0;
  for (const s of c.sections || []) {
    for (const b of s.contentBlocks || []) {
      if (b.content) t += stripHTML(b.content).split(/\s+/).filter(Boolean).length;
      if (b.question) t += stripHTML(b.question).split(/\s+/).filter(Boolean).length;
      if (b.explanation) t += stripHTML(b.explanation).split(/\s+/).filter(Boolean).length;
      if (b.accordionItems) b.accordionItems.forEach(a => {
        t += stripHTML(a.title).split(/\s+/).filter(Boolean).length;
        t += stripHTML(a.content).split(/\s+/).filter(Boolean).length;
      });
      if (b.options) b.options.forEach(o => t += stripHTML(typeof o === 'string' ? o : o.text || '').split(/\s+/).filter(Boolean).length);
      if (b.flashcards) b.flashcards.forEach(f => {
        t += stripHTML(f.front).split(/\s+/).filter(Boolean).length;
        t += stripHTML(f.back).split(/\s+/).filter(Boolean).length;
      });
      if (b.nodes) b.nodes.forEach(n => {
        t += stripHTML(n.text).split(/\s+/).filter(Boolean).length;
        if (n.choices) n.choices.forEach(ch => t += stripHTML(ch.text).split(/\s+/).filter(Boolean).length);
      });
      if (b.steps) b.steps.forEach(s => t += stripHTML(s.text).split(/\s+/).filter(Boolean).length);
      if (b.takeaways) b.takeaways.forEach(tk => t += stripHTML(tk).split(/\s+/).filter(Boolean).length);
      if (b.items) b.items.forEach(r => {
        t += stripHTML(r.name || '').split(/\s+/).filter(Boolean).length;
        t += stripHTML(r.description || '').split(/\s+/).filter(Boolean).length;
      });
    }
  }
  if (c.assessment) {
    for (const q of c.assessment.questions || []) {
      t += stripHTML(q.question).split(/\s+/).filter(Boolean).length;
      if (q.explanation) t += stripHTML(q.explanation).split(/\s+/).filter(Boolean).length;
      if (q.options) q.options.forEach(o => t += stripHTML(o.text || '').split(/\s+/).filter(Boolean).length);
    }
  }
  return t;
}

function validate(c) {
  const e = [];
  const wc = countWords(c);
  if (wc < c.ceHours * 6000) e.push(`CRITICAL:words ${wc}<${c.ceHours * 6000}`);
  for (const [i, s] of (c.sections || []).entries()) {
    const types = (s.contentBlocks || []).map(b => b.type);
    if (!types.includes('sectionDivider')) e.push(`S${i}:missing sectionDivider`);
    if (i > 0) {
      const kcCount = (s.contentBlocks || []).filter(b => b.type === 'knowledgeCheck').length;
      if (kcCount < 2) e.push(`S${i}:KC<2 (found ${kcCount})`);
    }
    for (const b of s.contentBlocks || []) {
      if (b.options?.length && typeof b.options[0] === 'string') e.push(`CRITICAL:flat_options in section ${i}`);
    }
  }
  if ((c.assessment?.questions?.length || 0) < 15) e.push(`CRITICAL:exam<15 (found ${c.assessment?.questions?.length})`);
  if ((c.references?.length || 0) < 15) e.push(`CRITICAL:refs<15 (found ${c.references?.length})`);
  return { wc, e };
}

async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;
  const col = db.collection('interactivecourses');
  const { wc, e } = validate(COURSE);
  COURSE.wordCount = wc;
  console.log(`${COURSE.courseCode} | ${wc}w / ${COURSE.ceHours * 6000} req | ${COURSE.sections.length} sections | ${COURSE.assessment?.questions?.length} exam Qs | ${COURSE.references?.length} refs`);
  const crit = e.filter(x => x.startsWith('CRITICAL'));
  if (crit.length) {
    console.error('VALIDATION FAILED:', crit.join('; '));
    await mongoose.disconnect();
    process.exit(1);
  }
  if (e.length) e.forEach(x => console.warn('WARNING:', x));
  const existing = await col.findOne({ slug: SLUG });
  if (existing) {
    await col.updateOne({ slug: SLUG }, { $set: { ...COURSE, updatedAt: new Date() } });
    console.log('Updated existing course:', SLUG);
  } else {
    await col.insertOne({ ...COURSE, createdAt: new Date(), updatedAt: new Date() });
    console.log('Inserted new course:', SLUG);
  }
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
