import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }
const SLUG = 'cr-cli-608-clinical-assessment';

const COURSE = {
  courseCode: 'CR-CLI-608',
  title: 'Clinical Assessment and Diagnosis: Structured Interviewing Skills',
  slug: SLUG,
  description: 'This course equips licensed mental health professionals with evidence-based frameworks for clinical assessment and differential diagnosis. Participants will master the mental status examination, structured and semi-structured interviewing approaches, validated screening instruments (PHQ-9, GAD-7, PCL-5, AUDIT, Columbia Suicide Severity Rating Scale), the DSM-5-TR diagnostic process, and ethical dimensions of diagnosis including labeling effects, cultural formulation, and the limits of insurance-driven diagnostic practice.',
  ceHours: 2,
  nbccContentArea: 'appraisal',
  deliveryFormat: 'online',
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
  difficulty: 'intermediate',
  targetAudience: 'Licensed mental health professionals (LPCs, LCSWs, LMFTs, NCCs)',
  learningObjectives: [
    'Conduct a systematic mental status examination across all eight domains: appearance, behavior, mood, affect, thought process and content, perceptual disturbances, cognition, insight, and judgment',
    'Distinguish structured, semi-structured, and unstructured clinical interviewing approaches and select the appropriate method for a given clinical context',
    'Administer and interpret validated screening instruments including the PHQ-9, GAD-7, PCL-5, AUDIT, and Columbia Suicide Severity Rating Scale',
    'Apply the DSM-5-TR differential diagnosis framework including ruling out medical causes, using specifiers, and applying severity ratings',
    'Identify common diagnostic errors — anchoring bias, premature closure, and diagnostic overshadowing — and implement strategies to reduce them',
    'Evaluate the ethical dimensions of diagnosis including labeling effects, insurance-driven diagnosis, informed consent, and cultural formulation'
  ],
  sections: [
    {
      title: 'Introduction: From Interview to Impression — The Assessment Relationship',
      sectionNumber: 1,
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'Introduction: From Interview to Impression — The Assessment Relationship',
          subtitle: 'Foundations of rigorous clinical assessment in mental health practice',
          sectionNumber: 1
        },
        {
          type: 'text',
          content: `<p>Clinical assessment is the cornerstone of every therapeutic encounter. Before a treatment plan is written, before a diagnosis is documented, before a single intervention is offered, the clinician is doing something deceptively complex: gathering information, organizing it into a meaningful clinical picture, and beginning to form hypotheses about what is happening for this particular person in this particular moment in their life. The quality of that assessment process directly determines the quality of everything that follows. A hastily conducted intake can set a course of treatment heading in entirely the wrong direction — mislabeling a trauma response as a personality disorder, overlooking a nascent psychosis, missing a medical condition presenting as depression, or failing to identify safety risk that requires immediate response.</p>
<p>And yet clinical assessment is often treated as a bureaucratic checkpoint rather than a clinical art. Intake forms get completed. Checklists get checked. DSM criteria get catalogued against presenting symptoms. The diagnostic impression emerges at the end of the process like a product rolling off an assembly line — sometimes accurate, sometimes profoundly wrong. The difference between assessment as bureaucracy and assessment as clinical practice lies not primarily in which instruments are used, but in the <em>quality of attention</em> the clinician brings to the entire encounter: their capacity to be present with this person, to track multiple channels of information simultaneously, to tolerate uncertainty long enough to form a genuinely considered clinical impression rather than a reflexive one.</p>
<p>This course is an examination of clinical assessment and diagnosis as a structured, evidence-based, and deeply relational skill set. We begin in this introductory section by establishing the conceptual foundation: what clinical assessment actually is, what purposes it serves, and how the therapeutic relationship shapes the quality of data that assessment yields. Section 2 then takes us inside the technical architecture of assessment: the biopsychosocial model, the mental status examination, structured versus semi-structured interviewing, and the validated screening tools that extend clinical observation into quantifiable data. Section 3 addresses the diagnostic process itself — the DSM-5-TR framework, differential diagnosis, common cognitive errors that compromise diagnostic accuracy, and the ethical dimensions of applying diagnostic labels in a real-world clinical context.</p>
<p>Licensed mental health professionals operate in a diagnostic landscape that is simultaneously more sophisticated and more fraught than at any prior point in the profession's history. The DSM-5-TR represents the state of the art in descriptive psychiatric classification. Validated screening instruments now exist for virtually every major presenting concern. Electronic health records create pressure for rapid diagnosis to support billing. Insurance authorizations may hinge on a specific diagnostic code. At the same time, communities most affected by psychiatric misdiagnosis — Black, Indigenous, LGBTQ+, immigrant, and neurodivergent clients — are increasingly articulate about the harms that follow from diagnostic errors, and the profession's ethical obligations to practice with cultural humility and diagnostic rigor have never been clearer. Navigating all of this requires exactly the structured, reflective, multi-dimensional approach to assessment that this course provides.</p>`
        },
        {
          type: 'videoEmbed',
          title: 'Clinical Interviewing: The Art and Structure Behind the Conversation',
          videoUrl: 'https://www.youtube.com/embed/PLACEHOLDER',
          content: 'An overview of how structured clinical assessment integrates relational skills, validated instruments, and diagnostic reasoning to build an accurate clinical picture.'
        },
        {
          type: 'imageText',
          content: `<p>Assessment is never conducted in a vacuum. The therapeutic alliance — the quality of the collaborative bond between clinician and client — directly shapes the completeness and accuracy of the information gathered. Research by Bordin (1979) established that the alliance consists of three components: agreement on goals, agreement on tasks, and the affective bond. Even in a single intake session, these components are already being negotiated. A client who does not feel understood, respected, or safe will manage information strategically — offering sanitized versions of their experience, omitting the most painful or stigmatized material, presenting the face they believe the clinician wants to see. The most sophisticated assessment protocol in the world will yield incomplete data if the relational container is not established first.</p>`,
          image: '',
          imageAlt: 'Clinician and client seated across from each other in a warm, collaborative intake conversation',
          imagePosition: 'right'
        }
      ]
    },
    {
      title: 'Foundations of Clinical Assessment: Biopsychosocial Model, Mental Status Examination, and Validated Instruments',
      sectionNumber: 2,
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'Foundations of Clinical Assessment: Biopsychosocial Model, Mental Status Examination, and Validated Instruments',
          subtitle: 'Building a complete clinical picture through observation, interviewing, and measurement',
          sectionNumber: 2
        },
        {
          type: 'text',
          content: `<p>The biopsychosocial model, introduced by George Engel in 1977, remains the most intellectually robust framework for understanding psychological presentations in clinical practice. Engel's foundational insight was that human suffering cannot be adequately explained by biology alone — that psychological, social, cultural, and systemic factors interact with biological predispositions to produce, maintain, and modify any given presentation. A client presenting with major depressive disorder is not simply a brain with insufficient serotonin: they are a person with a specific developmental history, an attachment style shaped by early relational experiences, a socioeconomic context that may limit access to healthy food and safe housing, a cultural framework that shapes whether emotional pain is expressible and to whom, and a biological substrate that interacts with all of these dimensions dynamically and bidirectionally.</p>
<p>For clinical assessment, the biopsychosocial model provides an organizing architecture that prevents the tunnel vision of any single-domain approach. The <strong>biological</strong> domain encompasses genetic predispositions, neurological functioning, medical comorbidities, substance use, medications, sleep, nutrition, and physical health. The <strong>psychological</strong> domain encompasses developmental history, attachment patterns, personality structure, coping style, cognitive schemas, emotional regulation capacity, and the specifics of the presenting complaint. The <strong>social</strong> domain encompasses relational context, family system dynamics, occupational and financial status, cultural identity, community connection, and structural factors including racism, poverty, discrimination, and systemic exclusion. A thorough biopsychosocial assessment addresses all three domains, producing a formulation that can support genuinely individualized treatment planning.</p>
<p>Within the psychological domain, the <strong>mental status examination (MSE)</strong> is the clinician's primary structured observational tool. The MSE is not a questionnaire administered to the client — it is the clinician's systematic documentation of what is observed and elicited during the clinical interview. It organizes clinical observation into eight interconnected domains that together provide a cross-sectional picture of a client's current psychological functioning.</p>
<p><strong>Appearance</strong> encompasses all observable physical presentation: dress and grooming, level of hygiene, apparent age relative to stated age, body build, distinctive physical features, and any observable physical health indicators. A client presenting in disheveled clothing with poor hygiene and appearing significantly older than their stated age raises different clinical hypotheses than one presenting in appropriate dress with well-maintained hygiene. Neither observation is diagnostic in isolation — both are data points that contribute to the overall clinical picture.</p>
<p><strong>Behavior</strong> encompasses the quality of the client's engagement during the interview: level of eye contact, psychomotor activity (agitation, restlessness, or retardation), gait if observed, attitude toward the examiner (cooperative, guarded, hostile, seductive, dismissive), and any notable behavioral patterns. Psychomotor retardation — slowed movement, long latency before responding, reduced spontaneous gesture — is a clinically significant finding particularly in the context of depression assessment. Psychomotor agitation — fidgeting, pacing, inability to sit still — may signal anxiety, mania, stimulant use, or akathisia from antipsychotic medication.</p>
<p><strong>Mood</strong> is the client's subjective, self-reported emotional experience: what they say they are feeling. It is documented in the client's own words wherever possible ("I feel empty," "I've been really on edge," "I honestly don't feel much of anything"). Mood should not be inferred or interpreted by the clinician — the clinician's observation of emotional state belongs in the affect domain. Mood may be described as depressed, anxious, angry, elevated, euphoric, irritable, neutral, or a range of other affective states.</p>
<p><strong>Affect</strong> is the clinician's objective observation of the client's expressed emotional experience during the interview — the behavioral expression of emotion as the clinician perceives it. Affect is described across four dimensions: range (full, restricted, blunted, flat), quality (dysphoric, euphoric, anxious, irritable, labile), intensity (heightened, diminished), and appropriateness (congruent or incongruent with the content of speech). A client describing the death of a loved one while smiling and laughing presents with mood-incongruent affect — a finding that warrants further exploration. A client who maintains a fixed, unchanging emotional expression throughout an emotionally varied interview demonstrates restricted or blunted affect.</p>`
        },
        {
          type: 'callout',
          calloutType: 'clinical',
          title: 'The DSM-5-TR Criteria Are Necessary But Not Sufficient: What Structured Interviewing Adds to Diagnostic Accuracy',
          content: `<p>The DSM-5-TR provides diagnostic criteria — constellations of symptoms that must be present for a given duration to qualify for a diagnosis. What it cannot provide is the clinical context those criteria live in. Two clients can both meet full criteria for Major Depressive Disorder, Single Episode, Moderate — yet have presentations so clinically distinct that identical pharmacological and psychotherapeutic approaches would be appropriate for one and wholly inadequate for the other. Structured clinical interviewing using tools like the Structured Clinical Interview for DSM-5 (SCID-5) or the Mini International Neuropsychiatric Interview (MINI) adds three dimensions that bare criteria application cannot: temporal sequencing (when symptoms appeared in relation to other life events, medical conditions, or substance use), functional context (how the symptoms interact with the client's specific relational, occupational, and daily living demands), and sub-threshold information (symptoms that nearly meet criteria, patterns that contextualize the ones that do, and prodromal features that may warrant early intervention). Clinicians who apply DSM criteria without structured interviewing are making diagnostic determinations on half the available data.</p>`
        },
        {
          type: 'text',
          content: `<p><strong>Thought Process</strong> refers to the form, flow, and organization of a client's thinking as revealed through their speech. Clinically normal thought process is described as linear, goal-directed, and logical. Deviations from this include: <em>circumstantiality</em> (reaching the point eventually but only after extensive tangential elaboration), <em>tangentiality</em> (veering off topic and never returning), <em>loose associations</em> (ideas connected in ways that are not logically apparent to the listener), <em>flight of ideas</em> (rapid, pressured thinking with quick topic shifts — commonly associated with mania), <em>thought blocking</em> (sudden cessation of thought mid-sentence, with the client unable to recall what they were saying — associated with psychosis), and <em>perseveration</em> (repetitive return to the same idea or theme despite attempts to move the conversation forward). <strong>Thought Content</strong> refers to what the client is thinking about — the preoccupations, themes, and specific ideational content of thought. Clinically significant thought content includes suicidal ideation (always assessed for intent, plan, means, and timeline), homicidal ideation, paranoid ideation, ideas of reference (the belief that external events, objects, or people have special personal significance), obsessions, phobias, and somatic preoccupations.</p>
<p><strong>Perceptual Disturbances</strong> encompass experiences in which perception occurs without an external stimulus (hallucinations) or in which an external stimulus is misperceived (illusions). Hallucinations should be documented by modality (auditory, visual, tactile, olfactory, gustatory) and by quality. Command hallucinations — auditory hallucinations that instruct the client to perform specific behaviors, particularly self-harm or violence — represent a specific and important clinical risk factor that must be directly assessed. The distinction between pseudo-hallucinations (recognized as internal and not real) and true hallucinations (experienced as external, real, and originating outside the self) carries diagnostic significance.</p>
<p><strong>Cognition</strong> in the MSE encompasses orientation (to person, place, time, and situation), attention and concentration (typically assessed via digit span or serial subtraction), memory (immediate, short-term, and long-term), and higher-order cognitive functions where relevant (abstract reasoning, fund of knowledge, executive function). Brief cognitive screening instruments such as the Montreal Cognitive Assessment (MoCA) or Mini-Mental State Examination (MMSE) extend formal cognitive assessment beyond what the MSE alone provides, particularly when neurocognitive decline, traumatic brain injury, or neurological disorder is suspected.</p>
<p><strong>Insight and Judgment</strong> round out the MSE. Insight refers to the client's awareness and understanding of their own condition — whether they recognize that they are experiencing something problematic, whether they attribute it to a mental health issue, and whether they understand the implications for their functioning. Insight is typically characterized as full, partial, limited, or absent. Judgment refers to the client's capacity to make reasonable decisions across domains of daily living — their ability to perceive situations accurately, weigh options, anticipate consequences, and act in ways aligned with their own stated values and goals. Impaired judgment — evidenced by recent financial, legal, relational, or behavioral decisions inconsistent with the client's baseline — is a significant clinical finding that carries implications for treatment intensity and safety planning.</p>
<p>Together, the eight MSE domains produce a clinical snapshot — a cross-sectional photograph of the client's mental functioning at a specific moment in time. This snapshot, combined with the longitudinal history obtained through structured interviewing and the quantitative data from validated screening instruments, forms the basis of the clinical formulation and diagnostic impression. No single domain of the MSE is pathognomonic; it is the pattern across domains, in clinical context, that carries diagnostic meaning.</p>`
        },
        {
          type: 'accordion',
          accordionItems: [
            {
              title: 'PHQ-9: Patient Health Questionnaire — Depression',
              content: '<p>The PHQ-9 is a 9-item self-report instrument assessing depression severity over the past two weeks, based directly on DSM criteria for Major Depressive Disorder. Each item is rated 0–3 (not at all to nearly every day), yielding a total score of 0–27. Scores are interpreted as: 1–4 minimal, 5–9 mild, 10–14 moderate, 15–19 moderately severe, 20–27 severe. Item 9 (thoughts of being better off dead or hurting yourself) should always be followed with direct clinical inquiry regardless of total score. The PHQ-9 has demonstrated sensitivity of 88% and specificity of 88% for major depressive disorder at a cutoff of 10. It is freely available and requires no license.</p>'
            },
            {
              title: 'GAD-7: Generalized Anxiety Disorder Scale',
              content: '<p>The GAD-7 is a 7-item self-report instrument assessing generalized anxiety symptom severity over the past two weeks. Total scores range from 0–21, with cutoffs of 5 (mild), 10 (moderate), and 15 (severe). At a cutoff of 10, the GAD-7 demonstrates sensitivity of 89% and specificity of 82% for GAD. Importantly, the GAD-7 also performs reasonably well as a transdiagnostic anxiety screener across panic disorder, social anxiety disorder, and PTSD, making it useful in initial screening contexts. Item 7 (difficulty controlling worry) is particularly discriminating. Freely available with no licensing requirements.</p>'
            },
            {
              title: 'PCL-5: PTSD Checklist for DSM-5',
              content: '<p>The PCL-5 is a 20-item self-report measure assessing DSM-5 PTSD symptom severity over the past month, covering all four symptom clusters: intrusion (items 1–5), avoidance (6–7), negative cognitions and mood (8–14), and hyperarousal (15–20). A total score of 33 or higher is recommended as a provisional PTSD diagnosis screening threshold. The PCL-5 can also be used to monitor symptom change over time, with a decrease of 5 points considered a minimally important difference. It is freely available from the National Center for PTSD at ptsd.va.gov and requires no license for clinical use.</p>'
            },
            {
              title: 'AUDIT: Alcohol Use Disorders Identification Test',
              content: '<p>The AUDIT is a 10-item self-report screen for hazardous alcohol use, harmful drinking, and alcohol dependence developed by the World Health Organization. Scores range from 0–40. A score of 8 or higher indicates hazardous or harmful use; 16 or higher suggests high-risk drinking; 20 or higher suggests possible alcohol dependence. The briefer AUDIT-C (first 3 items only, score 0–12) is validated as a rapid screening tool for hazardous consumption. The AUDIT has been validated across diverse global populations and is freely available from the WHO.</p>'
            },
            {
              title: 'Columbia Suicide Severity Rating Scale (C-SSRS)',
              content: '<p>The C-SSRS is the most widely validated structured interview instrument for suicide risk assessment, developed at Columbia University. It provides a standardized language for classifying suicidal ideation (from passive ideation to active ideation with intent and plan) and suicidal behavior (from preparatory behavior to interrupted, aborted, and actual attempts). The C-SSRS Lifetime/Recent version is used for initial assessment; the Since Last Visit version for ongoing monitoring. It is FDA-referenced for clinical trials and endorsed by the Joint Commission. Freely available at cssrs.columbia.edu. The C-SSRS does not replace clinical judgment — it structures the conversation and standardizes documentation.</p>'
            }
          ]
        },
        {
          type: 'imageText',
          content: `<p>Structured versus semi-structured interviewing represents a spectrum of clinical choices rather than a binary. Fully structured interviews — such as the Composite International Diagnostic Interview (CIDI) or the Diagnostic Interview Schedule (DIS) — follow a rigid question sequence, require no clinical inference, and can be administered by lay interviewers, yielding highly reliable data suited for research. Semi-structured interviews — such as the Structured Clinical Interview for DSM-5 (SCID-5), the Mini International Neuropsychiatric Interview (MINI), or the Kiddie Schedule for Affective Disorders and Schizophrenia (K-SADS) for youth — provide a structured framework of required questions with built-in flexibility for clinical elaboration, follow-up, and judgment. Unstructured clinical interviews, while flexible and relationship-building, demonstrate the lowest diagnostic reliability across clinicians. For most clinical practice settings, semi-structured approaches strike the appropriate balance between rigor and relational flexibility.</p>`,
          image: '',
          imageAlt: 'Side-by-side comparison chart showing structured, semi-structured, and unstructured interview characteristics',
          imagePosition: 'left'
        },
        {
          type: 'multipleChoice',
          question: 'A clinician observes that a client maintains a fixed, unchanging emotional expression throughout an emotionally varied interview that includes discussion of grief, humor, and anxiety-provoking content. Which MSE finding is MOST accurately documented?',
          options: [
            { text: 'Flat mood', isCorrect: false },
            { text: 'Restricted affect', isCorrect: true },
            { text: 'Incongruent affect', isCorrect: false },
            { text: 'Blunted mood', isCorrect: false }
          ],
          correctAnswer: 1,
          explanation: 'The clinician is observing the client\'s expressed emotional range — which belongs in the Affect domain of the MSE, not Mood (which is the client\'s subjective self-report). A fixed, unchanging expression across emotionally varied content represents restricted affect (markedly reduced range). Flat affect describes near-total absence of expressed emotion. Incongruent affect describes an emotional expression that is mismatched in quality to the content of speech. "Blunted mood" is a common but technically incorrect term — blunting applies to affect, not mood.'
        },
        {
          type: 'text',
          content: `<p>The reliability of validated screening instruments is one of their central clinical virtues — and one of the most misunderstood. <strong>Reliability</strong> refers to the consistency of measurement: a reliable instrument yields the same scores when administered under the same conditions to the same population at the same point in time (test-retest reliability), whether different raters administer it (inter-rater reliability), or whether its component items measure the same construct consistently (internal consistency). <strong>Validity</strong> refers to whether an instrument actually measures what it claims to measure. A measure can be reliable without being valid — a thermometer that consistently reads 3 degrees too high is reliable but not valid for accurate temperature measurement. The clinical relevance of this distinction is considerable: an instrument that is widely used and highly reliable may nonetheless be invalid for use with a specific population if it was not normed or validated in that population.</p>
<p>This matters practically for mental health clinicians because the vast majority of validated screening instruments — including the PHQ-9, GAD-7, and PCL-5 — were validated in predominantly White, English-speaking, Western clinical samples. Their performance characteristics (sensitivity, specificity, positive predictive value) may be substantially different when administered to clients from non-Western cultural backgrounds, clients whose primary language is not English, clients with limited literacy, or clients from communities where symptom expression is organized around somatic rather than psychological idioms. This does not mean these instruments are useless with diverse clients — it means that clinicians must apply cultural humility and clinical judgment when interpreting scores, avoid mechanical score-to-diagnosis translation, and supplement instrument data with culturally attuned clinical interviewing.</p>
<p>The Columbia Suicide Severity Rating Scale (C-SSRS) deserves particular attention as a structured clinical interview tool for suicide risk, rather than a self-report instrument. The C-SSRS distinguishes five levels of suicidal ideation (passive ideation — "I wish I were dead or could go to sleep and not wake up"; active ideation without method or plan; active ideation with some intention to act but no plan; active ideation with specific plan and intent) and five categories of suicidal behavior (preparatory behavior, interrupted attempt, aborted attempt, actual attempt, completed attempt). This standardized taxonomy replaces the imprecise and often clinically unhelpful categories of "active" versus "passive" ideation that many clinicians still use. Using the C-SSRS language in documentation creates a defensible clinical record that clearly specifies the nature and severity of ideation assessed — far more clinically and legally meaningful than "client denies SI."</p>
<p>It is worth emphasizing that validated instruments are assessment aids, not diagnostic replacements. A PHQ-9 score of 15 does not diagnose moderately severe depression — it flags that the client endorsed symptoms at a severity level that warrants clinical attention and that falls within the moderate range on this validated measure. The diagnostic process requires that the clinician gather that quantitative data, integrate it with the longitudinal clinical history, the MSE findings, the biopsychosocial formulation, and their own clinical judgment before arriving at a diagnostic impression. The instrument is one data channel among many. The clinician is the integrating intelligence.</p>`
        },
        {
          type: 'text',
          callouts: { headsss: { label: 'HEADSSS', type: 'clinical', body: 'Home, Education/Employment, Activities, Drugs, Sexuality, Suicide/depression, Safety — a semi-structured adolescent psychosocial interview framework (Goldenring & Rosen) sequenced from lower- to higher-threat domains.' } },
          content: `<p>Every element of the assessment architecture described above — the biopsychosocial model, the eight MSE domains, structured and semi-structured interviewing, validated screening instruments — must be actively adapted when the client in front of the clinician is an adolescent, an older adult, or a person whose primary language is not English. A generic intake protocol applied identically across these populations will systematically underperform: it will miss developmentally appropriate rapport-building with a teenager, misattribute a reversible cognitive presentation in an older adult to irreversible dementia, or produce a clinically unusable record when language access is handled poorly. Population-specific adaptation is not an optional refinement of the assessment process — it is a core competency requirement.</p>
<p><strong>The Adolescent Clinical Interview.</strong> Adolescents present a distinct developmental context that reshapes every dimension of the interview. Cognitively, most adolescents are moving through Piaget's formal operational stage, developing the capacity for abstract reasoning, hypothetical thinking, and metacognition — but this capacity is uneven and context-dependent, meaning a sixteen-year-old may reason abstractly about a peer's situation while struggling to apply the same reasoning to their own. Developmentally, the central task of adolescence is <strong>individuation</strong>: the formation of an autonomous identity distinct from parents and caregivers. This has direct clinical implications for rapport-building. Adolescents are frequently and understandably wary of adults who occupy an ambiguous role — not quite a peer, not quite a parent, and often perceived as an extension of parental authority, particularly when the referral for services originated with a parent or school rather than the adolescent's own request. Effective rapport-building with adolescents typically requires an explicit, early acknowledgment of this dynamic: naming that the adolescent may not have wanted to be here, clarifying the clinician's role as distinct from parental surveillance, and demonstrating non-judgmental curiosity rather than evaluative scrutiny. Clinicians should also be transparent about the distinction between the parent's legal consent to treatment and the adolescent's own developmentally appropriate assent, explaining in plain terms that meaningful engagement works best when the adolescent feels some genuine choice in the process rather than experiencing the intake as something being done to them. Techniques that reduce the interrogative quality of the interview — using open-ended, curiosity-driven questions rather than rapid-fire closed questions, allowing silence rather than filling it, incorporating strengths-based and interest-based questions early rather than leading with problem-focused inquiry — measurably improve adolescent engagement and disclosure. {{callout:headsss}} (Home, Education/Employment, Activities, Drugs, Sexuality, Suicide/depression, Safety), developed by Goldenring and Rosen, remains one of the most widely used semi-structured approaches for adolescent psychosocial assessment because its sequencing moves from lower-threat domains (home, school) to higher-threat domains (substance use, sexuality, safety) only after some rapport has been established, reducing the likelihood of defensive shutdown.</p>
<p>Confidentiality and parental or guardian involvement represent the most clinically and ethically fraught dimension of adolescent assessment. State minor-consent laws vary considerably — many states permit adolescents above a certain age to independently consent to outpatient mental health treatment, substance use treatment, or reproductive health services without parental notification, while younger adolescents typically require parental consent for treatment to occur at all. Regardless of the specific consent framework in a given jurisdiction, best practice is to establish the confidentiality parameters explicitly and in age-appropriate language at the outset of the first session, with both the adolescent and the parent or guardian present when possible: what will and will not be shared with parents, the specific exceptions that require disclosure regardless of the adolescent's wishes (imminent risk of harm to self or others, disclosure of abuse), and the clinician's process for handling situations that fall into gray areas. Adolescents who understand the confidentiality boundaries clearly are measurably more likely to disclose sensitive material — including suicidal ideation, substance use, and sexual activity — than adolescents left uncertain about what will be relayed to parents. At the same time, parental or guardian input remains a clinically essential data source: developmental history, family psychiatric history, observed behavioral changes over time, and functioning across settings (home, school) that the adolescent may not have insight into or may not accurately report. The clinical skill lies in gathering collateral information from caregivers without allowing the adolescent to perceive the clinician as a parental agent, and in managing the inevitable tension between the adolescent's assent to treatment and the parent's legal consent authority.</p>
<p><strong>The Older Adult Clinical Interview.</strong> Assessment with older adult clients requires the clinician to hold multiple, sometimes competing clinical possibilities simultaneously: normal age-related cognitive change, mild cognitive impairment, major or minor neurocognitive disorder (dementia), delirium, and depression — each of which can produce overlapping presentations, and several of which can co-occur in the same client. Cognitive screening is a standard component of a thorough older adult assessment, not an optional add-on reserved for cases with overt memory complaints, because early neurocognitive changes are frequently under-recognized by clients and families and because baseline cognitive data materially affects the interpretation of mood and behavioral symptoms. The <strong>Montreal Cognitive Assessment (MoCA)</strong> and <strong>Mini-Mental State Examination (MMSE)</strong> remain the most widely used brief cognitive screens in outpatient mental health settings, while the <strong>Mini-Cog</strong> (a three-item word recall plus clock-drawing task) offers an even briefer option suitable for routine intake screening when time is constrained. None of these instruments is diagnostic in isolation; each flags the need for more comprehensive neuropsychological evaluation when scores fall below established cutoffs, particularly when the score is inconsistent with the client's education level and premorbid functioning.</p>
<p><strong>The life review technique</strong>, developed by Robert Butler in his foundational 1963 work on reminiscence, is a structured interviewing approach uniquely suited to older adult assessment. Rather than treating reminiscence about the past as tangential to the presenting concern, the life review technique treats a structured, chronological review of the client's life narrative — childhood, family formation, career, major losses, current circumstances — as a primary assessment and therapeutic tool. Clinically, life review serves several functions simultaneously: it builds rapport by communicating genuine interest in the whole person rather than only the presenting problem; it surfaces historical psychiatric episodes, coping patterns, and unresolved grief that a symptom-focused intake would miss; and for clients with mild cognitive changes, the narrative coherence, sequencing accuracy, and level of detail the client is able to provide offer informal but clinically useful data about cognitive functioning that complements formal screening.</p>`
        },
        {
          type: 'text',
          callouts: { cfi: { label: 'Cultural Formulation Interview', type: 'clinical', body: 'DSM-5-TR Cultural Formulation Interview (CFI) — a structured protocol for eliciting a client\'s own explanatory model of distress, cultural identity, and help-seeking, used to reduce diagnostic bias with clients from different cultural backgrounds.' } },
          content: `<p>Distinguishing depression from dementia — and recognizing the specific presentation historically termed <strong>pseudodementia</strong> — is among the most consequential differential diagnostic tasks in older adult assessment, because the two conditions call for substantially different treatment approaches and because depression in older adults is both underdiagnosed and highly treatable. Several clinical features assist in this differentiation. Onset and course differ characteristically: depression-related cognitive complaints tend to have a more identifiable onset, often temporally associated with a loss, medical event, or life transition, and follow a more variable day-to-day course, whereas neurocognitive disorder due to a primary dementia process typically has an insidious, gradually progressive onset without a clear precipitant. Symptom awareness and effort differ: clients with depression-related cognitive complaints (sometimes still referred to clinically as pseudodementia, though the DSM-5-TR does not use this as a formal diagnostic category) frequently over-report cognitive difficulty, express significant distress about perceived cognitive decline, and respond to cognitive testing with early "I don't know" answers and reduced effort, while clients with a primary neurocognitive disorder more often under-report or minimize their cognitive difficulty, demonstrate reduced awareness of the deficit (<strong>anosognosia</strong>), and produce near-miss or confabulated answers on testing rather than simply declining to respond. Mood symptoms in depression-related presentations tend to be pervasive and precede the cognitive complaints, whereas in primary dementia, mood and behavioral symptoms — when present — more often emerge later in the course as a secondary feature of the neurocognitive decline. <strong>The Geriatric Depression Scale (GDS-15)</strong>, a 15-item yes/no instrument specifically designed to minimize reliance on somatic symptom items that overlap with normal aging and medical illness, is preferable to instruments like the PHQ-9 in older adult populations for this reason. Clinicians should also systematically screen for medical contributors that mimic or worsen cognitive presentations in older adults — polypharmacy and anticholinergic medication burden, undertreated pain, thyroid dysfunction, vitamin B12 deficiency, undiagnosed sleep apnea, and sensory impairment. Unaddressed hearing loss in particular is a frequently overlooked confound: a client who cannot hear interview questions accurately may perform poorly on cognitive screening or appear withdrawn and disengaged for reasons that have nothing to do with cognitive or mood pathology, underscoring the importance of confirming adequate hearing (and vision) before drawing clinical conclusions from interview behavior.</p>
<p><strong>Assessment with Clients of Limited English Proficiency.</strong> Clinically sound assessment with a client who has limited English proficiency (LEP) begins with the use of a professional, qualified interpreter — never a family member, and never an untrained bilingual staff member pressed into service informally. Family member interpretation introduces multiple, well-documented risks to assessment validity: family members may filter, soften, or omit disclosures they find shameful or distressing (particularly around suicidality, sexual content, substance use, or family conflict); the presence of a family member as interpreter fundamentally compromises the confidentiality the client would otherwise have with a neutral professional; and family interpreters, lacking training in mental health terminology, frequently mistranslate clinical concepts in ways that distort the resulting assessment. Title VI of the Civil Rights Act requires that federally funded healthcare and behavioral health entities provide qualified language access services at no cost to the client, and professional standards from the National Council on Interpreting in Health Care establish specific best practices that clinicians should actively apply rather than delegate entirely to the interpreter: brief the interpreter before the session on the purpose of the encounter and any sensitive content anticipated; position the interpreter beside or slightly behind the client so the clinician can maintain eye contact and observe nonverbal behavior directly, rather than positioning the interpreter as a barrier between clinician and client; speak directly to the client in the first person ("How have you been sleeping?") rather than to the interpreter in the third person ("Ask her how she's been sleeping"); request phrase-by-phrase interpretation rather than end-of-session paraphrased summary, which allows the clinician to track affect, hesitation, and word choice in real time rather than losing that data to summarization; and debrief with the interpreter after the session to clarify any translation ambiguities, idiomatic expressions that resisted direct translation, or cultural context the interpreter observed that may not have been explicitly stated by the client. Remote video and telephonic interpretation services extend qualified language access to less commonly encountered languages and to settings where in-person interpreters are unavailable, though in-person interpretation is generally preferable when feasible given its superior capacity to convey nonverbal and contextual nuance.</p>
<p>Assessment with LEP clients should also incorporate the {{callout:cfi}} more systematically than may be typical practice with English-speaking clients from the clinician's own cultural background, because language and culture are inseparable in shaping symptom expression. <strong>Idioms of distress</strong> — culturally specific ways of communicating suffering that do not map cleanly onto DSM symptom categories, such as "nervios" in Latin American cultural contexts, "thinking too much" reported across numerous cultural groups, or somatic presentations of psychological distress common in many Asian and Middle Eastern cultural contexts — require the clinician to resist the reflexive assumption that a symptom must be translated into a DSM-recognizable category to be clinically meaningful. The CFI's explicit inquiry into the client's own explanatory model of their distress — what they believe is happening and why, and what they believe would help — is particularly valuable with LEP clients because it surfaces the client's actual framework for understanding their experience rather than imposing the clinician's diagnostic framework by default. Clinicians conducting interpreter-mediated assessments should also anticipate that the length of the encounter will typically need to expand — often by 50% or more relative to a monolingual interview of comparable clinical complexity — to accommodate the interpretation process without compressing the depth or pace of clinical inquiry, and should build this into scheduling rather than allowing time pressure to truncate an interpreter-mediated intake.</p>
<p>A closely related and frequently overlooked population is Deaf and hard-of-hearing clients, whose language access needs are governed by the same Title VI and Americans with Disabilities Act principles as spoken-language LEP clients but require distinct accommodation. A qualified American Sign Language (ASL) interpreter — ideally one with specific mental health interpreting credentials, given the specialized vocabulary and the emotionally sensitive content typical of a clinical intake — should be engaged using the same positioning, direct-address, and pre-session briefing practices described above for spoken-language interpretation. Clinicians should not assume that a Deaf client is equally comfortable with written English exchange as an alternative to interpretation; for clients who are prelingually Deaf and whose first language is ASL, written English functions as a second language with its own comprehension demands, and relying on written notes in place of a qualified interpreter can produce the same distortions and omissions seen when family members are substituted for professional spoken-language interpreters. Video Relay Service and Video Remote Interpreting can extend qualified ASL access in settings without an available in-person interpreter, though — as with spoken-language remote interpretation — technical reliability and the interpreter's ability to see the client's full signing space should be confirmed before the session begins. Clinicians should also be alert to the fact that some Deaf clients present with documented histories of restricted early language access (in cases where sign language exposure was delayed or limited in childhood), a phenomenon associated with measurable effects on narrative coherence and abstract reasoning during interview that must not be misread as intellectual impairment, thought disorder, or low insight — a distinction that itself represents a form of <strong>diagnostic overshadowing</strong> specific to this population and that underscores why language access competency is inseparable from diagnostic accuracy across every population addressed in this section.</p>`
        },
        {
          type: 'callout',
          calloutType: 'donot',
          title: 'Never Use a Family Member as Interpreter',
          content: `<p>Family member interpretation compromises assessment validity in ways that are easy to miss in the moment: family members may filter or soften disclosures they find shameful, the client loses confidentiality with a neutral professional, and untrained interpreters frequently mistranslate clinical concepts. Always use a qualified professional interpreter for clients with limited English proficiency or who are Deaf/hard-of-hearing.</p>`
        },
        {
          type: 'sequencing',
          instructions: 'Place the steps of conducting a mental status examination in the correct clinical sequence, from what is observed earliest in the encounter to what requires deliberate elicitation later in the interview.',
          steps: [
            { text: 'Observe appearance and grooming as client enters the room', order: 1 },
            { text: 'Note behavioral presentation and psychomotor qualities during initial rapport-building', order: 2 },
            { text: 'Elicit mood using open-ended inquiry: "How have you been feeling emotionally?"', order: 3 },
            { text: 'Observe affect range, quality, intensity, and congruence throughout the interview', order: 4 },
            { text: 'Track thought process and content as client discusses presenting concerns', order: 5 },
            { text: 'Directly assess for perceptual disturbances and any command hallucinations', order: 6 },
            { text: 'Screen cognition with orientation questions and brief attention tasks if indicated', order: 7 },
            { text: 'Assess insight and judgment through questions about self-understanding and recent decision-making', order: 8 }
          ],
          explanation: 'The MSE unfolds throughout the clinical encounter, not as a separate checklist at the end. Appearance and behavior are observable from the moment the client arrives. Mood is elicited through direct inquiry. Affect is observed throughout the entire interview. Thought process and content emerge during discussion of presenting concerns. Perceptual disturbances, cognitive screening, and insight/judgment assessment typically occur in the latter portions of a thorough intake, once rapport and safety are established.'
        },
        {
          type: 'multiSelect',
          question: 'Which of the following statements about validated screening instruments in clinical assessment are ACCURATE? Select ALL that apply.',
          options: [
            { text: 'A PHQ-9 score of 10 or higher establishes a clinical diagnosis of Major Depressive Disorder', isCorrect: false },
            { text: 'The C-SSRS provides a standardized taxonomy of suicidal ideation and behavior that is more clinically precise than "active vs. passive" ideation categories', isCorrect: true },
            { text: 'Reliability refers to consistency of measurement; validity refers to whether an instrument measures what it claims to measure', isCorrect: true },
            { text: 'Validated instruments may perform differently across cultural populations than in their original normative samples', isCorrect: true },
            { text: 'The PCL-5 assesses both PTSD symptom severity and the client\'s lifetime trauma exposure history', isCorrect: false }
          ],
          explanation: 'Validated instruments are screening and measurement tools, not diagnostic replacements. The PHQ-9 flags severity levels, not diagnoses. The PCL-5 measures symptom severity only — lifetime exposure requires a separate instrument like the LEC-5. The C-SSRS provides a validated taxonomy that replaces the imprecise active/passive binary. Reliability and validity are distinct psychometric properties. Cultural performance differences are well-documented and require clinical consideration.'
        },
        {
          type: 'reflection',
          question: 'Consider the eight domains of the mental status examination. Which domain do you feel most confident assessing in your current clinical practice, and which do you find most challenging to document accurately and consistently? What specific competency development would close that gap?'
        },
        {
          type: 'keyTakeaway',
          title: 'Key Takeaways',
          takeaways: [
            'The biopsychosocial model requires assessment across biological, psychological, and social domains simultaneously — any single-domain approach will produce an incomplete and potentially misleading clinical picture.',
            'The mental status examination is an eight-domain observational framework (appearance, behavior, mood, affect, thought process, thought content, perceptual disturbances, cognition, insight, and judgment) that the clinician completes through observation and elicitation — not a questionnaire administered to the client.',
            'Mood is the client\'s subjective self-report; affect is the clinician\'s objective observation — these are distinct MSE domains that must be documented separately.',
            'Validated screening instruments (PHQ-9, GAD-7, PCL-5, AUDIT, C-SSRS) quantify symptom severity and standardize clinical documentation but do not replace clinical judgment in the diagnostic process.',
            'The Columbia Suicide Severity Rating Scale provides a standardized taxonomy of suicidal ideation and behavior that is clinically and legally more defensible than informal ideation categories; documenting "client denies SI" without structured inquiry is insufficient.',
            'Reliability and validity are distinct psychometric properties; clinicians must apply cultural humility when interpreting instrument scores with populations that differ from normative samples.'
          ]
        }
      ]
    },
    {
      title: 'DSM-5-TR Diagnostic Process: Differential Diagnosis, Diagnostic Errors, and the Ethics of Diagnosis',
      sectionNumber: 3,
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'DSM-5-TR Diagnostic Process: Differential Diagnosis, Diagnostic Errors, and the Ethics of Diagnosis',
          subtitle: 'From assessment data to diagnostic impression — rigorously, ethically, and with cultural humility',
          sectionNumber: 3
        },
        {
          type: 'text',
          content: `<p>The DSM-5-TR (Diagnostic and Statistical Manual of Mental Disorders, Fifth Edition, Text Revision, 2022) is the primary diagnostic classification system used by mental health professionals in the United States. It provides operationalized diagnostic criteria — symptom constellations, duration requirements, functional impairment thresholds, and exclusion criteria — that allow clinicians to apply diagnostic labels consistently across providers, settings, and time. The DSM-5-TR is a descriptive classification system: it describes what presentations look like without claiming to explain their causes. It is organized around symptom clusters, not etiologies, which has significant implications for the differential diagnosis process.</p>
<p>The differential diagnosis framework is the structured clinical reasoning process by which a clinician arrives at the most accurate diagnostic impression from among the range of plausible possibilities that the assessment data supports. The APA and clinical training traditions recommend a systematic sequence: (1) rule out medical and neurological causes first; (2) rule out substance-induced presentations; (3) consider primary mental disorders from most to least parsimonious; (4) apply specifiers, severity ratings, and course modifiers; and (5) document any additional conditions that are a focus of clinical attention (V-codes or Z-codes under ICD-10-CM) that do not constitute a primary diagnosis but bear on treatment.</p>
<p><strong>Step 1: Rule Out Medical Causes.</strong> The most significant errors in psychiatric differential diagnosis involve missing medical conditions that are presenting as mental health symptoms. Hypothyroidism commonly presents as depression. Hyperthyroidism can present as anxiety or mania. Temporal lobe epilepsy may produce hallucinations, depersonalization, and personality changes. Traumatic brain injury can produce depression, irritability, executive dysfunction, and impulse dyscontrol. Autoimmune encephalitis (including anti-NMDA receptor encephalitis) can produce acute psychiatric presentations indistinguishable from first-episode psychosis. Anemia, vitamin B12 deficiency, and folate deficiency produce fatigue and cognitive symptoms that overlap with major depression. Diabetes, Lyme disease, lupus, and multiple sclerosis each have documented psychiatric presentations. Mental health clinicians who do not have prescribing authority are not responsible for conducting medical workups — but they are responsible for maintaining a differential that includes medical conditions and for making appropriate referrals when the clinical picture raises concern about an organic etiology.</p>
<p><strong>Step 2: Rule Out Substance-Induced Presentations.</strong> The DSM-5-TR requires that clinicians rule out substance intoxication, substance withdrawal, or substance/medication-induced mental disorders before diagnosing a primary mental disorder. This is not because substance use and mental disorders are mutually exclusive — in fact, co-occurring substance use disorders and primary mental disorders (dual diagnosis) are among the most common presentations in community mental health settings — but because substance-induced presentations require different clinical management than primary mental disorders and because premature application of a primary psychiatric diagnosis before ruling out substance etiology can result in inappropriate or ineffective treatment. The AUDIT, DAST-10, and toxicology screening (when appropriate and ethically obtained) support this step. A client in acute opioid withdrawal presenting with anxiety and dysphoria does not have a primary anxiety disorder — they have opioid withdrawal, which requires specific medical management.</p>
<p><strong>Step 3: Consider Primary Mental Disorders Systematically.</strong> With medical and substance causes adequately explored, the clinician considers the range of primary DSM-5-TR diagnoses that the assessment data supports. The key clinical discipline here is <em>parsimony</em> — Occam's Razor applied to diagnosis: prefer the single diagnosis that best accounts for the full clinical picture before adding additional diagnoses. This does not mean denying diagnostic complexity when it genuinely exists — comorbidity is the norm rather than the exception in clinical populations — but it does mean resisting the impulse to assign a separate diagnosis to each presenting symptom without first asking whether a single condition might account for the pattern. A client presenting with low mood, impaired sleep, reduced energy, appetite changes, and poor concentration meets criteria for a depressive episode; they also meet criteria for several anxiety symptoms and some somatic symptom criteria. The clinical question is: is this Major Depressive Disorder with anxious distress (a DSM-5-TR specifier) or a comorbid depressive and anxiety disorder? Parsimony favors MDD with anxious distress as a first hypothesis.</p>`
        },
        {
          type: 'callout',
          calloutType: 'warning',
          title: 'Diagnostic Overshadowing: How Existing Diagnoses Can Blind Clinicians to New Presentations',
          content: `<p>Diagnostic overshadowing is the phenomenon in which a pre-existing diagnosis becomes the explanatory lens through which all subsequent clinical presentations are interpreted, causing new or co-occurring conditions to be missed. A client with a documented diagnosis of Borderline Personality Disorder who reports auditory hallucinations may have those experiences dismissed as "BPD symptoms" rather than assessed on their own merits — even though psychotic episodes can and do co-occur with BPD, and schizophrenia may have been mislabeled as BPD. A client with an intellectual disability who reports depressive symptoms may have those symptoms attributed to "their disability" rather than assessed for a superimposed Major Depressive Disorder. Clients with a documented substance use disorder history may have legitimate pain complaints dismissed. Clinicians must actively counteract diagnostic overshadowing by treating each clinical encounter as an opportunity to assess the client's current presentation on its own terms, not filtered through the pre-existing diagnostic lens.</p>`
        },
        {
          type: 'text',
          content: `<p><strong>Specifiers, Severity Ratings, and Course Modifiers.</strong> DSM-5-TR specifiers are crucial clinical tools that are frequently underused in practice. They add precision to a diagnosis by describing features of the current episode, severity, and course that carry significant treatment planning implications. For Major Depressive Disorder, for example, the specifier "with anxious distress" (endorsed anxiety symptoms during the depressive episode) is associated with increased suicidality, longer episodes, greater functional impairment, and poorer response to standard antidepressants — all clinical data that should influence treatment decisions. The specifier "with melancholic features" (loss of pleasure in all activities, early morning awakening, diurnal mood variation, significant psychomotor changes) suggests a more biologically-driven presentation that typically responds better to somatic treatments. "With atypical features" (mood reactivity, leaden paralysis, hypersomnia, hyperphagia, rejection sensitivity) may point toward MAOIs or certain psychotherapeutic approaches as preferable. Severity ratings (mild, moderate, severe) anchor clinical documentation to functional impairment and symptom count — not to the clinician's subjective impression of how serious the situation appears. Using specifiers consistently communicates a higher level of diagnostic precision and improves the utility of records across providers.</p>
<p><strong>Anchoring Bias</strong> is one of the most well-documented cognitive errors in clinical assessment. It occurs when the clinician's initial hypothesis — formed early in the encounter, often on the basis of a referral diagnosis, a chief complaint, or first impressions — anchors subsequent clinical reasoning and creates a confirmatory lens through which new information is selectively processed. Evidence consistent with the initial hypothesis is weighted more heavily; evidence inconsistent with it is discounted or explained away. A clinician who forms an early impression of "this is a bipolar presentation" will tend to interpret subsequent clinical data — including data that might support a PTSD, ADHD, or borderline personality formulation — through a bipolar confirmatory lens. The practical countermeasure is to generate multiple competing hypotheses early in the assessment process and to actively seek disconfirming evidence for each hypothesis rather than seeking only confirmation. Clinical supervision and peer consultation serve a specific cognitive function here: an outside perspective is not subject to the same anchoring that has shaped the treating clinician's observations.</p>
<p><strong>Premature Closure</strong> is the related error of arriving at a diagnostic conclusion before sufficient data has been gathered to support it — accepting the most convenient or plausible explanation and ending the diagnostic inquiry. Premature closure is particularly common in high-volume clinical settings where time pressure creates an implicit demand for rapid diagnosis, in settings where reimbursement depends on a specific diagnostic code being entered quickly, and in supervision-light environments where clinicians' diagnostic impressions are rarely challenged. The antidote to premature closure is a deliberate commitment to remaining in a state of diagnostic uncertainty until the data genuinely supports a conclusion — which may require additional sessions, collateral information, consultation, or structured clinical interviewing to achieve.</p>
<p>The <strong>Cultural Formulation Interview (CFI)</strong> included in DSM-5-TR provides a structured 16-question protocol for gathering the cultural context essential to accurate diagnosis. It explores cultural identity (how the client describes their cultural, ethnic, and racial background), cultural explanatory models (what the client believes is causing their distress and what they think would help), cultural and psychosocial stressors (how cultural background shapes the client's experience of stressors and support), and cultural elements of the clinician-client relationship (differences in cultural background, status, and power). The CFI is not optional for culturally competent practice — it is the structural mechanism through which cultural context is systematically integrated into the diagnostic process. Research demonstrates that the CFI uncovers clinically significant information that is missed in standard diagnostic interviews, particularly regarding idioms of distress that do not map onto DSM categories, explanatory models that affect treatment engagement, and structural barriers that affect access to and utilization of care.</p>
<p>The ethical dimensions of diagnosis deserve sustained clinical attention. Diagnostic labels carry social and systemic consequences that extend far beyond the clinical encounter: they follow clients in medical and insurance records, affect employment eligibility in certain sectors (military, law enforcement, aviation), influence custody determinations, shape how others in the client's life perceive and respond to them, and fundamentally affect how clients understand themselves. <strong>Labeling effects</strong> — the way a diagnostic label shapes the client's self-perception, expectations, and behavior — are well-documented in the research literature. A client who internalizes a diagnosis of Borderline Personality Disorder may develop a self-concept organized around instability, dangerousness, and untreatability — expectations reinforced by provider bias, system responses, and interpersonal dynamics — regardless of whether the diagnostic label is accurate. Clinicians have an ethical obligation to discuss diagnostic impressions with clients in plain language, to explain what the diagnosis means and does not mean, to acknowledge uncertainty where it exists, and to obtain meaningful informed consent about the implications of documented diagnoses, including their potential effects on insurance, employment, and legal proceedings.</p>
<p><strong>Insurance-driven diagnosis</strong> is a pervasive structural pressure in clinical practice. Third-party reimbursement requires a DSM diagnostic code. The necessity of billing leads to diagnostic codes being entered sometimes before the assessment process is complete, sometimes for presentations that are genuinely subclinical, and sometimes as a choice between a more accurate diagnosis that carries stigma and a less accurate one that is less harmful to the client's interests. The ethical framework for navigating these pressures is clear: clinicians may not document false diagnoses to secure insurance coverage. However, where genuine diagnostic uncertainty exists, the DSM provides Unspecified and Other Specified categories that are both accurate and billable — they represent clinical honesty, not evasion. Clinicians may also legitimately emphasize the most functionally significant aspects of a complex clinical picture for billing purposes, provided the documented diagnosis is genuinely defensible on the available clinical evidence.</p>`
        },
        {
          type: 'text',
          content: `<p>Trauma-informed assessment is not a discrete instrument or an added intake question — it is a stance that reorganizes the entire diagnostic encounter around the recognition that the presenting symptoms in front of the clinician frequently represent adaptations to overwhelming past experience rather than intrinsic pathology. The foundational reframe, articulated across the trauma-informed care literature and formalized in SAMHSA's framework of trauma-informed principles, is the shift from asking "what is wrong with you?" to asking "what happened to you?" This is not merely a softer way of phrasing the same clinical inquiry. It reflects a substantively different diagnostic starting hypothesis: that a client's hypervigilance, emotional dysregulation, avoidance, dissociation, or interpersonal difficulty may be best understood, at least provisionally, as an organized and once-adaptive response to threat and adversity rather than as evidence of an intrinsic disorder to be labeled and treated in isolation from its origins. This reframe has direct implications for differential diagnosis: presentations that would otherwise be diagnosed reflexively as Borderline Personality Disorder, Bipolar Disorder, Oppositional Defiant Disorder, or a primary psychotic disorder frequently resolve, on careful trauma-informed assessment, into complex presentations of PTSD, Complex PTSD (recognized in the ICD-11 though not as a standalone DSM-5-TR category), or dissociative disorders whose surface symptoms mimic other diagnostic categories. SAMHSA's trauma-informed framework organizes this stance around four "R's": realizing the widespread impact of trauma and potential paths for recovery; recognizing the signs and symptoms of trauma in clients, families, and staff; responding by integrating trauma knowledge into policies and practices; and actively resisting re-traumatization — a principle with direct application to how the assessment interview itself is conducted, not only to what is assessed.</p>
<p>Adverse Childhood Experiences ({{callout:ace-score}}) screening, originating from the landmark Felitti and Anda Kaiser-CDC study published in 1998, offers clinicians a structured, empirically grounded way to systematically inquire about childhood adversity across ten categories: physical, emotional, and sexual abuse; physical and emotional neglect; and five categories of household dysfunction including caregiver mental illness, substance use, incarceration, domestic violence, and parental separation or divorce. The original ACE study demonstrated a robust, graded dose-response relationship between cumulative ACE score and adult physical health outcomes (cardiovascular disease, diabetes, chronic obstructive pulmonary disease), mental health outcomes (depression, suicide attempts, substance use disorders), and premature mortality, establishing ACEs as one of the most replicated findings in public health and behavioral health research. The clinical utility of ACEs screening lies in its capacity to systematize an inquiry that clinicians might otherwise conduct inconsistently or avoid altogether, and in providing a shared, destigmatized vocabulary for discussing childhood adversity as a health-relevant exposure rather than a shameful secret. However, the limits of ACEs screening deserve equal clinical attention and are frequently underemphasized in training. The original ten-item ACE score omits entire categories of adversity now understood to carry significant developmental impact, including community violence exposure, discrimination and racism, bullying, poverty, immigration-related trauma, and medical trauma — omissions that expanded and adapted ACE instruments (sometimes referred to as PACEs, or Positive and Adverse Childhood Experiences, when protective factors are incorporated) attempt to address but that the original ten-item tool does not capture. A numerical ACE score is not diagnostic and does not predict individual outcomes — it is a population-level, dose-response risk indicator, and clinicians must resist the temptation to treat an individual client's score as deterministic of their prognosis or to substitute a checklist score for a genuine clinical narrative of the client's developmental history. ACEs screening also carries retrospective recall bias, may inadvertently retraumatize if administered as a cold checklist without adequate clinical framing and pacing, and — critically — says nothing about the protective factors, resilience resources, and adaptive coping that shape how any given individual's adversity exposure translates (or does not translate) into current symptomatology. Trauma-informed practice uses ACEs screening as one input alongside, never as a replacement for, a fuller clinical trauma history.</p>
<p>Recognizing dissociation as it occurs in real time during the assessment interview itself is a distinct and frequently underdeveloped clinical skill, separate from screening for dissociative symptoms as a historical or diagnostic matter. Dissociation exists on a continuum from normative, mild absorption (losing track of a conversation while daydreaming) through clinically significant depersonalization and derealization, to marked amnesia, identity fragmentation, and, at the most severe end, Dissociative Identity Disorder. During an intake interview, in-session dissociation can present subtly and is easily misread by an inexperienced or rushed clinician as disinterest, resistance, low motivation, or even boredom — a misreading that itself constitutes a diagnostic error with real consequences. Clinical signs suggestive of in-session dissociation include: a sudden flattening or change in affect and vocal tone mid-conversation; prolonged pauses or a trance-like, unfocused gaze; difficulty maintaining a coherent narrative thread, with the client losing their place or seeming confused about what was just discussed; noticeable shifts in vocabulary, posture, or apparent age-presentation within the same session; the client directly reporting feeling "spacey," "not real," "far away," or "like I'm watching myself"; and discontinuities in memory for material discussed earlier in the same session. When a clinician observes these signs, the clinically appropriate response is not to push forward with the planned assessment questions but to gently name the observation, check in directly with the client ("I noticed you seemed to go somewhere else for a moment — are you here with me?"), and, if dissociation is confirmed, to shift into grounding rather than continued content-gathering. <strong>The Dissociative Experiences Scale (DES)</strong> remains the most widely used self-report screening instrument for dissociative symptoms as a trait-level historical matter, but it does not substitute for the clinician's moment-to-moment observational skill in recognizing dissociation as it unfolds within the assessment encounter.</p>
<p>Adjusting the mental status examination approach when a client becomes dysregulated during the assessment interview requires the clinician to hold the MSE framework flexibly rather than mechanically. Daniel Siegel's {{callout:window-tolerance}} concept — describing the zone of arousal within which a person can process information, reflect, and engage relationally, bounded above by <strong>hyperarousal</strong> (fight-or-flight activation: racing speech, visible agitation, escalating distress) and below by <strong>hypoarousal</strong> (freeze or shutdown: numbing, flat affect, disconnection, minimal verbal output) — provides a practical clinical framework for this adjustment. A client who has moved outside their window of tolerance during the interview is, at that moment, not reliably able to engage with abstract or reflective questioning, meaning that continuing to press forward with a standard MSE sequence (cognitive screening questions, detailed history-taking, direct questions about thought content) is both clinically counterproductive and potentially re-traumatizing. The trauma-informed adjustment is to titrate: to slow the pace, reduce the density of questions, explicitly name what the clinician is observing, offer the client control over pacing ("We can pause here, or come back to this another time — what feels right to you?"), and incorporate brief grounding techniques (orienting to the present physical environment, paced breathing, sensory grounding) before resuming content-focused inquiry. This does not mean abandoning the MSE — appearance, behavior, and affect can still be observed and documented even during a dysregulated moment, and in fact a client's specific pattern of dysregulation is itself clinically significant MSE data — but it does mean recognizing that the sequence and pacing of the interview must adapt to the client's current window of tolerance rather than proceeding on a fixed protocol regardless of the client's moment-to-moment state.</p>`
        },
        {
          type: 'text',
          content: `<p>Finally, trauma-informed intake practice integrates safety planning as a standard component of the initial assessment rather than deferring it until a crisis emerges later in treatment. Traditional practice models often reserve formal safety planning for moments of acute crisis — a disclosure of active suicidal ideation, a report of intimate partner violence, a disclosure of ongoing self-harm — treating safety planning as an exceptional intervention triggered only by acute risk. Trauma-informed practice instead treats collaborative safety planning as a normalized, expected component of every trauma-focused intake, integrated proactively rather than reactively. The {{callout:stanley-brown}} Safety Planning Intervention, one of the most extensively validated brief safety planning protocols, structures this into six collaborative steps: recognizing personal warning signs; identifying internal coping strategies the client can use independently; identifying people and social settings that provide distraction; identifying people the client can ask for help; identifying professionals and agencies to contact during a crisis; and making the environment safer, including means restriction counseling around lethal means. Introducing elements of this framework during the initial intake — even in the absence of currently disclosed suicidal ideation — normalizes safety planning as a standard, non-stigmatizing part of trauma-focused care, establishes the groundwork and rapport needed for the client to engage authentically if risk does emerge later, and avoids the clinically costly pattern in which safety planning is rushed or absent precisely at the moment it is needed most because no foundation was laid earlier. Embedding safety planning into the structure of the intake itself, rather than treating it as an emergency-only intervention, is a defining feature of trauma-informed assessment practice.</p>
<p>Documentation practices during a trauma-informed intake deserve explicit clinical attention, because the language a clinician chooses when recording assessment findings carries forward into every subsequent treatment decision, every future provider who reads the chart, and — should the record ever be subpoenaed — every legal proceeding in which the client's mental health history becomes relevant. Trauma-informed documentation favors descriptive, behaviorally specific language over interpretive or pathologizing shorthand: recording that "client reported difficulty trusting others following disclosed history of caregiver betrayal" preserves clinical meaning and context that the bare label "trust issues" or "guarded, avoidant" discards, and avoids inadvertently reframing an adaptive trauma response as a fixed personality trait before sufficient longitudinal data exists to support that conclusion. Clinicians should also document dissociative episodes observed during the interview itself with the same behavioral specificity used for other MSE findings — noting the observable signs, the clinician's response, and the client's return to baseline — rather than either omitting the observation or over-interpreting it as evidence of a specific dissociative disorder diagnosis on the basis of a single session. Finally, trauma-informed assessment requires the clinician to attend to their own regulation throughout the interview: {{callout:vicarious-trauma}} and secondary traumatic stress are well-documented occupational hazards of trauma-focused clinical work, and a dysregulated clinician is measurably less able to track subtle dissociative cues, pace the interview appropriately, or maintain the grounded, attuned presence that trauma-informed assessment depends on. Regular clinical supervision, peer consultation specifically focused on trauma caseloads, and deliberate attention to one's own window of tolerance during and between trauma-focused intakes are not peripheral self-care recommendations — they are structural requirements for sustaining diagnostic accuracy and clinical safety across a caseload of trauma-affected clients over time.</p>`
        },
        {
          type: 'reflection',
          question: `<p>Review a recent intake you completed — disguised or generalized as needed to protect client confidentiality — and use it as the basis for the following reflective exercise.</p>
<p>Begin by reconstructing, as specifically as you can, the sequence of questions you actually asked during that intake, and the order in which you asked them. Then consider: what question did you <em>not</em> ask that you now, on reflection, wish you had? This might be a question you consciously decided to skip because it felt intrusive or because time ran short, or it might be a question that never occurred to you at all in the moment — a domain of the client's experience (developmental history, trauma exposure, cultural context, substance use, safety) that simply was not on your radar during that particular encounter. Try to name the specific question, not just the general topic area, and consider what it would have taken — more time, a different opening, a different level of rapport — to actually ask it in that session.</p>
<p>Next, consider what assumption you made about the client's presentation over the course of that intake. Every clinician forms working hypotheses quickly, often within the first few minutes of an encounter, based on referral information, presenting complaint, appearance, and initial rapport. Which of your working hypotheses in this case might the structured assessment process described in this course — systematic biopsychosocial coverage, full eight-domain MSE documentation, a validated screening instrument, or a more deliberate differential diagnosis sequence — have surfaced, tested, or potentially overturned more rigorously than your actual process did in the moment?</p>
<p>Finally, reflect on what specifically you would change about your own intake process going forward as a result of this exercise. Consider each of the following as you formulate your answer: (1) Is there a specific population-adapted technique from this course — HEADSSS-style sequencing for an adolescent, life review for an older adult, structured interpreter protocol for an LEP client, or trauma-informed pacing for a dysregulated client — that would have strengthened this particular intake? (2) Where in your current intake structure would a brief, collaborative safety-planning component fit most naturally, even in the absence of acute risk? (3) What single structural change to your intake documentation or protocol would make it more likely that you catch a missed question or an unexamined assumption the next time, rather than only in retrospect?</p>`
        },
        {
          type: 'accordion',
          accordionItems: [
            {
              title: 'Anchoring Bias in Diagnostic Reasoning',
              content: '<p>Anchoring bias occurs when the clinician\'s initial diagnostic hypothesis exerts disproportionate influence over all subsequent clinical reasoning. First impressions — from intake paperwork, referral diagnoses, or the first minutes of a session — create a cognitive anchor that subsequent information is measured against. Countermeasures include: generating multiple competing hypotheses explicitly before settling on a leading diagnosis; actively seeking disconfirming evidence for the primary hypothesis; using structured clinical interviews (SCID-5, MINI) that require inquiry across diagnostic domains rather than following a preferred pathway; and routine peer consultation where the consulting clinician has not been exposed to the anchoring information.'
            },
            {
              title: 'Premature Closure in Fast-Paced Clinical Settings',
              content: '<p>Premature closure is the tendency to stop gathering diagnostic information as soon as a plausible explanation for the presenting complaint is identified, before the clinical picture is complete. It is most common in high-volume outpatient and community mental health settings, where time pressure is real. Structural countermeasures include: scheduling at least 90 minutes for initial assessments; using a comprehensive intake protocol that includes both structured interview domains and validated screening instruments; making a policy of flagging diagnostic impressions as "preliminary" until a second session allows for confirmation; and maintaining explicit awareness that the first diagnosis is a hypothesis, not a conclusion.'
            },
            {
              title: 'Diagnostic Overshadowing',
              content: '<p>Diagnostic overshadowing occurs when an existing diagnosis — most commonly intellectual disability, personality disorder, autism spectrum disorder, or substance use disorder — becomes an all-purpose explanatory lens that causes new presentations to be attributed to the existing diagnosis without independent assessment. It is a form of confirmation bias specific to diagnostic contexts. Every new clinical presentation should be assessed on its own merits, with the existing diagnostic history as contextual data rather than a conclusion-determining filter. Clients with BPD can develop MDD, PTSD, bipolar disorder, and psychotic disorders — none of these is automatically explained by the BPD label.'
            },
            {
              title: 'Cultural Formulation Interview: When to Use It',
              content: '<p>The DSM-5-TR Cultural Formulation Interview (CFI) should be used whenever: the client\'s cultural background differs meaningfully from that of the treating clinician; the client uses idioms of distress that do not map directly onto DSM categories ("my nerves," "I have been hexed," "heart distress," "soul loss"); the clinical picture is atypical or does not fit neatly into standard categories; the client has had prior negative or culturally invalidating mental health experiences; or the presenting concern involves cultural or family expectations that shape distress and help-seeking. In practice, elements of the CFI should inform every cross-cultural clinical assessment, even when the full instrument is not formally administered.'
            },
            {
              title: 'Informed Consent to Diagnosis',
              content: '<p>Ethically robust clinical practice requires that clients receive meaningful informed consent about the nature and implications of their diagnosis, including: what the diagnostic criteria are and why the clinician believes this diagnosis applies; what the diagnosis does and does not mean about the client\'s character, prognosis, and treatability; that diagnoses are provisional and subject to revision as more information becomes available; how the diagnosis will appear in records and which third parties (insurers, employers in certain sectors, courts if subpoenaed) may access those records; and what alternatives to formal diagnosis are available where clinically appropriate (e.g., Unspecified diagnoses, V/Z code documentation). Informed consent to diagnosis is an ongoing relational process, not a one-time disclosure at the intake session.'
            }
          ]
        },
        {
          type: 'imageText',
          content: `<p>The DSM-5-TR V-codes (ICD-10-CM Z-codes) represent an underutilized clinical tool for documenting conditions that are not mental disorders but are clinically relevant to the treatment. V60.0 (Homelessness), V61.10 (Relationship distress with spouse or intimate partner), V62.3 (Academic or educational problem), V15.41 (Personal history of physical abuse in childhood), and Z59.7 (Insufficient social insurance and welfare support) are examples of conditions that frequently shape clinical presentations without constituting a diagnosable mental disorder. Documenting them communicates a fuller clinical picture to other providers, supports appropriate treatment planning that addresses social determinants, and may support billing for case management and care coordination services that address these factors.</p>`,
          image: '',
          imageAlt: 'DSM-5-TR differential diagnosis flowchart showing progression from medical causes through substance-induced presentations to primary mental disorders',
          imagePosition: 'right'
        },
        {
          type: 'multiSelect',
          question: 'Which of the following represent ACCURATE principles of the DSM-5-TR differential diagnosis process? Select ALL that apply.',
          options: [
            { text: 'Medical and neurological causes should be considered before primary mental disorders', isCorrect: true },
            { text: 'A single diagnosis that accounts for the full clinical picture is preferable to multiple diagnoses where parsimony is supported', isCorrect: true },
            { text: 'Specifiers such as "with anxious distress" or "with melancholic features" are optional documentation details with no clinical significance', isCorrect: false },
            { text: 'Substance-induced presentations must be distinguished from primary mental disorders before assigning a primary diagnosis', isCorrect: true },
            { text: 'V-codes (Z-codes) document clinically relevant conditions that do not constitute diagnosable mental disorders', isCorrect: true }
          ],
          explanation: 'The differential diagnosis process follows a systematic sequence: medical causes first, substance-induced presentations second, primary mental disorders third (with parsimony applied), then specifiers and V/Z-codes added. Specifiers are clinically significant — "with anxious distress" carries specific implications for suicidality, episode duration, and treatment response. V/Z-codes document non-disorder conditions relevant to care.'
        },
        {
          type: 'cardSort',
          instructions: 'Sort each clinical scenario into the correct diagnostic error category: Anchoring Bias, Premature Closure, or Diagnostic Overshadowing.',
          categories: ['Anchoring Bias', 'Premature Closure', 'Diagnostic Overshadowing'],
          cards: [
            { id: '1', text: 'A clinician receives a referral noting "suspected bipolar disorder" and, despite the client presenting with classic PTSD hyperarousal, continues to focus the assessment on mood cycling rather than trauma history.', correctCategory: 'Anchoring Bias' },
            { id: '2', text: 'A client with an existing BPD diagnosis reports new auditory hallucinations, which the clinician attributes to "BPD stress response" without independent psychosis assessment.', correctCategory: 'Diagnostic Overshadowing' },
            { id: '3', text: 'A clinician concludes "this is depression" after the client endorses low mood and sleep disturbance, and does not probe further for mania history, substance use, thyroid function, or PTSD symptoms.', correctCategory: 'Premature Closure' },
            { id: '4', text: 'A clinician who initially suspected ADHD continues to interpret a client\'s disorganization, emotional dysregulation, and impulsivity as ADHD symptoms even after trauma history and complex PTSD markers emerge.', correctCategory: 'Anchoring Bias' },
            { id: '5', text: 'A client with intellectual disability who reports persistent sadness and anhedonia has these symptoms attributed to "their cognitive limitations" rather than assessed for Major Depressive Disorder.', correctCategory: 'Diagnostic Overshadowing' },
            { id: '6', text: 'After identifying that a client meets criteria for GAD, a clinician does not assess for co-occurring depression, PTSD, or substance use, even though these frequently co-occur with anxiety presentations.', correctCategory: 'Premature Closure' }
          ]
        },
        {
          type: 'matching',
          matchingInstructions: 'Match each DSM-5-TR concept on the left with its accurate description on the right.',
          matchingPairs: [
            { term: 'Specifier', definition: 'An additional descriptor that increases diagnostic precision regarding features, severity, or course of an episode (e.g., "with anxious distress," "with melancholic features")' },
            { term: 'Severity Rating', definition: 'A classification of symptom burden as mild, moderate, or severe based on symptom count and functional impairment level' },
            { term: 'Cultural Formulation Interview (CFI)', definition: 'A 16-question structured protocol for gathering cultural context — identity, explanatory models, stressors, and the clinician-client relationship — integrated into DSM-5-TR' },
            { term: 'Diagnostic Parsimony', definition: 'The clinical principle of preferring the single diagnosis that most completely accounts for the full clinical picture before assigning multiple diagnoses' },
            { term: 'V-code / Z-code', definition: 'ICD-10-CM code documenting a clinically significant condition (e.g., relationship distress, homelessness, childhood abuse history) that is not itself a diagnosable mental disorder but is relevant to treatment' },
            { term: 'Other Specified / Unspecified Diagnoses', definition: 'DSM-5-TR categories used when a presentation causes significant distress or impairment but does not fully meet criteria for a named disorder; ethically preferable to assigning an inaccurate primary diagnosis' }
          ]
        },
        {
          type: 'reflection',
          question: 'Reflect on a case (disguised for confidentiality) in which you suspect diagnostic overshadowing, anchoring bias, or premature closure may have influenced a diagnostic conclusion — whether your own or a previous provider\'s. What specific clinical steps would you now take to reassess that presentation with fresh eyes?'
        },
        {
          type: 'resources',
          title: 'Resources for Clinical Assessment and Diagnosis',
          resources: [
            {
              title: 'PHQ-9 and GAD-7 (Spitzer Lab)',
              url: 'https://www.phqscreeners.com',
              type: 'website',
              description: 'Free downloadable PHQ-9, GAD-7, PHQ-2, and related screeners for depression and anxiety in multiple languages and formats.'
            },
            {
              title: 'Columbia Suicide Severity Rating Scale (C-SSRS)',
              url: 'https://cssrs.columbia.edu',
              type: 'website',
              description: 'Free validated structured interview tool for suicide risk assessment with lifetime, recent, and since-last-visit versions. Includes training resources and clinical documentation guidance.'
            },
            {
              title: 'PCL-5 and Trauma Assessment Instruments — VA National Center for PTSD',
              url: 'https://www.ptsd.va.gov/professional/assessment/overview/index.asp',
              type: 'website',
              description: 'Freely available library of validated trauma assessment instruments including PCL-5, LEC-5, and specialty measures for specific populations and trauma types.'
            },
            {
              title: 'AUDIT — WHO Alcohol Use Disorders Identification Test',
              url: 'https://www.who.int/publications/i/item/WHO-MSD-MSB-01.6a',
              type: 'website',
              description: 'Complete AUDIT instrument and implementation guide from the World Health Organization. Free for clinical use in multiple languages.'
            },
            {
              title: 'DSM-5-TR Cultural Formulation Interview (CFI) — APA',
              url: 'https://www.psychiatry.org/psychiatrists/cultural-competency/education/cultural-formulation',
              type: 'website',
              description: 'Official APA resource for the Cultural Formulation Interview, supplementary modules, informant version, and related training materials. Free for download.'
            },
            {
              title: 'SCID-5 — Structured Clinical Interview for DSM-5',
              url: 'https://www.appi.org/Products/Structured-Clinical-Interview-for-DSM-5-SCID-5',
              type: 'website',
              description: 'Information about the gold-standard semi-structured diagnostic interview for DSM-5 diagnoses. Available for purchase through American Psychiatric Association Publishing.'
            },
            {
              title: 'Morrison, J. — The First Interview (Guilford Press)',
              url: 'https://www.guilford.com/books/The-First-Interview/James-Morrison/9781462542819',
              type: 'website',
              description: 'Practical, evidence-based guide to clinical interviewing, mental status examination, and diagnostic reasoning. Essential reference for training and practice.'
            },
            {
              title: 'SAMHSA — Screening, Brief Intervention, and Referral to Treatment (SBIRT)',
              url: 'https://www.samhsa.gov/sbirt',
              type: 'website',
              description: 'Evidence-based framework and screening tools for substance use assessment integrated into clinical and primary care settings. Free training and resources.'
            }
          ]
        },
        {
          type: 'keyTakeaway',
          title: 'Key Takeaways',
          takeaways: [
            'The DSM-5-TR differential diagnosis process follows a systematic sequence: rule out medical causes, rule out substance-induced presentations, consider primary mental disorders parsimoniously, apply specifiers and severity ratings, and document relevant V/Z-code conditions.',
            'DSM-5-TR specifiers are not optional documentation extras — specifiers like "with anxious distress" and "with melancholic features" carry specific clinical implications for suicidality, treatment response, episode course, and functional prognosis.',
            'Anchoring bias, premature closure, and diagnostic overshadowing are the three most clinically consequential cognitive errors in diagnostic reasoning; each requires active, structural countermeasures rather than simply "trying harder" to be accurate.',
            'Diagnostic overshadowing — interpreting new presentations through the filter of an existing diagnosis — is particularly harmful for clients with intellectual disability, personality disorder diagnoses, autism spectrum disorder, or substance use disorder histories.',
            'The Cultural Formulation Interview is a structured clinical tool, not an optional courtesy; it uncovers clinically significant information about idioms of distress, explanatory models, and cultural barriers that standard diagnostic interviews systematically miss.',
            'The ethics of diagnosis require informed consent, honest communication about uncertainty, avoidance of insurance-driven diagnostic distortion, and awareness of the real-world consequences — employment, legal, relational — that diagnostic labels carry beyond the clinical setting.'
          ]
        }
      ]
    }
  ],
  assessment: {
    title: 'Final Assessment — CR-CLI-608: Clinical Assessment and Diagnosis: Structured Interviewing Skills',
    passingScore: 80,
    maxAttempts: 3,
    shuffleQuestions: true,
    questions: [
      {
        type: 'multipleChoice',
        question: 'In the mental status examination, a clinician documents "mood: sad and empty (client\'s words)" and "affect: constricted, dysphoric, congruent with reported mood." This documentation is BEST described as:',
        options: [
          { text: 'Redundant — mood and affect describe the same clinical phenomenon', isCorrect: false },
          { text: 'Accurate — mood (subjective self-report) and affect (clinician\'s objective observation) are distinct MSE domains correctly documented separately', isCorrect: true },
          { text: 'Inaccurate — affect should be documented using the client\'s own words, not clinical descriptors', isCorrect: false },
          { text: 'Incomplete — the MSE requires mood to be rated on a numerical scale', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'Mood and affect are distinct MSE domains. Mood is the client\'s subjective, self-reported emotional experience, documented in the client\'s own words. Affect is the clinician\'s objective observation of expressed emotional state, documented using clinical descriptors (range, quality, intensity, congruence). Documenting them separately is accurate and clinically essential.'
      },
      {
        type: 'multipleChoice',
        question: 'Which of the following BEST describes the purpose of the Columbia Suicide Severity Rating Scale (C-SSRS) in clinical assessment?',
        options: [
          { text: 'To provide a definitive prediction of future suicide attempt likelihood', isCorrect: false },
          { text: 'To replace clinical judgment in suicide risk determination', isCorrect: false },
          { text: 'To provide a standardized, validated taxonomy of suicidal ideation severity and behavior that structures clinical inquiry and documentation', isCorrect: true },
          { text: 'To screen for depression and hopelessness as suicide risk factors', isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: 'The C-SSRS provides a standardized taxonomy of suicidal ideation (five levels from passive to active ideation with intent and plan) and suicidal behavior (five categories from preparatory behavior through completed attempt). It structures clinical inquiry and produces documentation far more defensible and precise than informal ideation categories. It does not replace clinical judgment and cannot predict future behavior.'
      },
      {
        type: 'multipleChoice',
        question: 'A client presents with severe fatigue, flat affect, slowed speech and movement, and markedly low mood. Before diagnosing Major Depressive Disorder, which medical condition should the clinician MOST prioritize ruling out?',
        options: [
          { text: 'Hypertension', isCorrect: false },
          { text: 'Hypothyroidism', isCorrect: true },
          { text: 'Gastroesophageal reflux disease', isCorrect: false },
          { text: 'Type 2 diabetes without complications', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'Hypothyroidism (underactive thyroid) classically presents with fatigue, flat affect, psychomotor slowing, weight gain, cold intolerance, and depressed mood — a symptom constellation that is nearly indistinguishable from major depressive disorder without thyroid function testing. Medical rule-out should include thyroid function (TSH, T3, T4) in all presentations of depressive syndrome, particularly when somatic symptoms are prominent.'
      },
      {
        type: 'multipleChoice',
        question: 'A clinician notes that a client receiving a referral for "suspected bipolar disorder" continues to organize all subsequent assessment questions around mood cycling, even when the client\'s history is strongly suggestive of complex PTSD and emotional dysregulation secondary to chronic childhood trauma. This BEST illustrates which diagnostic error?',
        options: [
          { text: 'Premature closure', isCorrect: false },
          { text: 'Diagnostic overshadowing', isCorrect: false },
          { text: 'Anchoring bias', isCorrect: true },
          { text: 'Validity error', isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: 'Anchoring bias occurs when an initial diagnostic hypothesis — in this case the "suspected bipolar" referral — disproportionately influences all subsequent clinical reasoning, causing the clinician to filter evidence through a confirmatory lens and underweight disconfirming data. The clinician is anchored to the referral diagnosis rather than following the clinical evidence.'
      },
      {
        type: 'multipleChoice',
        question: 'The DSM-5-TR specifier "with anxious distress" applied to Major Depressive Disorder carries which of the following specific clinical implications?',
        options: [
          { text: 'It indicates that the depression is secondary to an untreated anxiety disorder', isCorrect: false },
          { text: 'It is associated with increased suicidality, longer episodes, and poorer response to standard antidepressants', isCorrect: true },
          { text: 'It requires a separate GAD diagnosis to be documented concurrently', isCorrect: false },
          { text: 'It indicates that anxiety symptoms preceded the onset of the depressive episode', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'The DSM-5-TR specifier "with anxious distress" (endorsed anxiety symptoms — tension, restlessness, difficulty concentrating due to worry, fear of something awful happening, or fear of losing control — during a depressive episode) is associated empirically with increased suicidal ideation, longer episode duration, and poorer response to standard antidepressant monotherapy. It does not require a separate anxiety diagnosis; it describes a feature of the current depressive episode.'
      },
      {
        type: 'multipleChoice',
        question: 'A client with a documented history of Borderline Personality Disorder reports new onset of auditory hallucinations commanding self-harm. The clinician attributes these to "BPD stress-related quasi-psychotic experiences" without a formal psychosis assessment. This MOST accurately illustrates:',
        options: [
          { text: 'Anchoring bias', isCorrect: false },
          { text: 'Premature closure', isCorrect: false },
          { text: 'Diagnostic overshadowing', isCorrect: true },
          { text: 'Appropriate clinical reasoning given the BPD diagnosis', isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: 'Diagnostic overshadowing occurs when an existing diagnosis is used as an all-purpose explanatory lens that prevents independent assessment of new presentations. BPD does include stress-related paranoid ideation and dissociative symptoms, but command auditory hallucinations require independent assessment — a co-occurring psychotic episode, superimposed schizophrenia, or organic cause cannot be ruled out without it. The existing BPD diagnosis does not explain away a new safety-relevant symptom.'
      },
      {
        type: 'multipleChoice',
        question: 'Which of the following BEST describes the ethical obligation of clinicians regarding informed consent to diagnosis?',
        options: [
          { text: 'Clinicians should share diagnostic impressions only after the course of treatment is complete to avoid influencing the therapeutic process', isCorrect: false },
          { text: 'Clinicians should discuss the diagnosis, what it means, its uncertainty if applicable, and its potential implications for records and third-party access', isCorrect: true },
          { text: 'Informed consent to diagnosis is required only when a personality disorder or psychotic disorder diagnosis is being applied', isCorrect: false },
          { text: 'Clinicians may withhold a diagnosis if they believe the client would find it distressing', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'Informed consent to diagnosis requires clinicians to discuss the diagnostic impression, what the criteria are, what it means and does not mean, the existence of diagnostic uncertainty, and how the diagnosis may appear in records and be accessible to third parties (insurers, employers in certain sectors, courts). It is an ongoing relational process applicable to all diagnoses, not a one-time disclosure limited to specific categories.'
      },
      {
        type: 'multipleChoice',
        question: 'In the biopsychosocial model, structural factors such as housing instability, poverty, racism, and systemic exclusion belong PRIMARILY in which domain?',
        options: [
          { text: 'Biological domain', isCorrect: false },
          { text: 'Psychological domain', isCorrect: false },
          { text: 'Social domain', isCorrect: true },
          { text: 'They are not represented in the biopsychosocial model', isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: 'The social domain of the biopsychosocial model encompasses relational context, family dynamics, community connection, cultural identity, occupational and financial status, and structural factors including racism, poverty, discrimination, and systemic exclusion. These factors are not peripheral — they directly shape the biological and psychological dimensions of clinical presentation and must be systematically assessed.'
      },
      {
        type: 'multipleChoice',
        question: 'A clinician concludes that a client has GAD after the client endorses worry and sleep disturbance, and does not probe further for co-occurring depression, PTSD, or substance use. This BEST illustrates:',
        options: [
          { text: 'Anchoring bias', isCorrect: false },
          { text: 'Premature closure', isCorrect: true },
          { text: 'Diagnostic overshadowing', isCorrect: false },
          { text: 'Parsimonious diagnostic reasoning', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'Premature closure is the error of ending diagnostic inquiry as soon as a plausible explanation is identified, without gathering sufficient data to confirm or rule out competing hypotheses. GAD frequently co-occurs with MDD, PTSD, and substance use disorders — not assessing for these after identifying GAD markers leaves the clinical picture incomplete and risks missing conditions that require different or additional treatment.'
      },
      {
        type: 'multipleChoice',
        question: 'Which of the following is MOST accurate regarding the reliability and validity of validated screening instruments when used with populations that differ from their normative samples?',
        options: [
          { text: 'Validity is always preserved as long as the instrument is administered in the client\'s primary language', isCorrect: false },
          { text: 'Reliability and validity properties established in normative samples may not generalize to populations that differ in culture, language, literacy, or symptom expression', isCorrect: true },
          { text: 'The PHQ-9 and GAD-7 have been validated in all global populations and perform identically across cultural groups', isCorrect: false },
          { text: 'Clinicians should avoid validated instruments with culturally diverse clients and rely on clinical observation alone', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'Validity and reliability properties are established in specific normative samples and may not generalize to populations with different cultural backgrounds, symptom expression patterns, or literacy levels. This does not mean abandoning validated instruments — it means applying cultural humility, avoiding mechanical score-to-diagnosis translation, and supplementing instrument data with culturally attuned clinical interviewing.'
      },
      {
        type: 'multipleChoice',
        question: 'The PHQ-9 at a cutoff score of 10 demonstrates which of the following psychometric characteristics for Major Depressive Disorder?',
        options: [
          { text: 'Sensitivity of 50%, specificity of 50%', isCorrect: false },
          { text: 'Sensitivity of 88%, specificity of 88%', isCorrect: true },
          { text: 'Sensitivity of 100%, specificity of 100%', isCorrect: false },
          { text: 'Sensitivity of 70%, specificity of 95%', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'At a cutoff of 10, the PHQ-9 demonstrates sensitivity of 88% (correctly identifies 88% of true cases of MDD) and specificity of 88% (correctly excludes 88% of non-cases). This makes it a strong screening instrument but not a diagnostic tool — some true cases will score below 10 and some non-cases above 10. Clinical context and structured interviewing must supplement all screening instrument data.'
      },
      {
        type: 'multipleChoice',
        question: 'Which MSE domain documents the clinician\'s objective observation of how a client\'s emotional expression varies (or fails to vary) across the content of the clinical interview?',
        options: [
          { text: 'Mood', isCorrect: false },
          { text: 'Affect', isCorrect: true },
          { text: 'Thought Content', isCorrect: false },
          { text: 'Behavior', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'Affect is the clinician\'s objective observation of expressed emotional state — documented across four dimensions: range (full, restricted, blunted, flat), quality (dysphoric, euphoric, irritable, anxious, labile), intensity (heightened, diminished), and appropriateness (congruent or incongruent with speech content). Mood is the client\'s subjective self-report and is documented in the client\'s own words, not the clinician\'s clinical descriptors.'
      },
      {
        type: 'multiSelect',
        question: 'Which of the following are recognized medical or neurological conditions that can present with psychiatric symptoms and must be included in the DSM-5-TR differential diagnosis process? Select ALL that apply.',
        options: [
          { text: 'Hypothyroidism presenting as depression', isCorrect: true },
          { text: 'Anti-NMDA receptor encephalitis presenting as first-episode psychosis', isCorrect: true },
          { text: 'Type 2 diabetes (without complications) presenting as anxiety disorder', isCorrect: false },
          { text: 'Temporal lobe epilepsy presenting with hallucinations and personality changes', isCorrect: true },
          { text: 'Vitamin B12 deficiency presenting with fatigue and cognitive symptoms', isCorrect: true }
        ],
        explanation: 'Multiple medical conditions are well-documented to present with psychiatric symptoms: hypothyroidism (depressive syndrome), anti-NMDA receptor encephalitis (acute psychosis), temporal lobe epilepsy (hallucinations, personality change, depersonalization), and vitamin B12 deficiency (fatigue, cognitive symptoms resembling depression). Routine uncomplicated type 2 diabetes is not a primary cause of anxiety disorder presentation. Medical rule-out is Step 1 of the differential diagnosis process.'
      },
      {
        type: 'multiSelect',
        question: 'Which of the following are ethical obligations of clinicians when assigning and documenting a psychiatric diagnosis? Select ALL that apply.',
        options: [
          { text: 'Discuss the diagnosis with the client in plain language and explain what it means and does not mean', isCorrect: true },
          { text: 'Acknowledge diagnostic uncertainty when the clinical picture does not yet fully support a specific diagnosis', isCorrect: true },
          { text: 'Assign the most billable diagnosis regardless of clinical accuracy to secure reimbursement', isCorrect: false },
          { text: 'Inform the client about potential implications of the diagnosis for records and third-party access', isCorrect: true },
          { text: 'Use Other Specified or Unspecified diagnostic categories when the presentation causes significant distress but does not fully meet specific criteria', isCorrect: true }
        ],
        explanation: 'Ethical diagnosis requires informed consent (plain-language explanation of the diagnosis and its implications), acknowledgment of uncertainty, transparency about record consequences, and honest documentation. Assigning inaccurate diagnoses for billing is an ethics violation. Other Specified/Unspecified categories are ethical choices that maintain clinical honesty when full criteria are not met.'
      },
      {
        type: 'multiSelect',
        question: 'Which of the following are validated screening instruments and their CORRECT primary assessment targets? Select ALL that apply.',
        options: [
          { text: 'PHQ-9 — depression symptom severity based on DSM criteria', isCorrect: true },
          { text: 'GAD-7 — generalized anxiety symptom severity (also performs as transdiagnostic anxiety screener)', isCorrect: true },
          { text: 'AUDIT — hazardous and harmful alcohol use and alcohol dependence', isCorrect: true },
          { text: 'PCL-5 — lifetime trauma exposure inventory', isCorrect: false },
          { text: 'C-SSRS — structured assessment of suicidal ideation severity and suicidal behavior categories', isCorrect: true }
        ],
        explanation: 'PHQ-9 assesses depression severity; GAD-7 assesses anxiety severity and functions as a transdiagnostic screener; AUDIT assesses hazardous/harmful alcohol use and dependence; C-SSRS assesses suicidal ideation severity and behavior type. The PCL-5 assesses PTSD symptom severity — NOT lifetime trauma exposure. The Life Events Checklist (LEC-5) is the appropriate lifetime trauma exposure instrument.'
      },
      {
        type: 'multiSelect',
        question: 'Which of the following accurately describe the Cultural Formulation Interview (CFI) included in DSM-5-TR? Select ALL that apply.',
        options: [
          { text: 'It is a 16-question structured protocol for gathering cultural context relevant to the diagnostic process', isCorrect: true },
          { text: 'It explores cultural identity, explanatory models of illness, cultural stressors, and the clinician-client relationship', isCorrect: true },
          { text: 'It is applicable only to clients who are immigrants or whose primary language is not English', isCorrect: false },
          { text: 'Research demonstrates it uncovers clinically significant information missed in standard diagnostic interviews', isCorrect: true },
          { text: 'It replaces the standard diagnostic criteria application in cross-cultural clinical encounters', isCorrect: false }
        ],
        explanation: 'The CFI is a 16-question structured protocol exploring cultural identity, explanatory models, cultural stressors, and clinician-client cultural dynamics. It is appropriate whenever cultural factors may shape presentation — not limited to immigrant clients. Research shows it yields clinically significant information missed by standard interviews. It supplements rather than replaces standard DSM criteria application.'
      },
      {
        type: 'multiSelect',
        question: 'Which clinical scenarios warrant the use of a structured or semi-structured diagnostic interview (such as the SCID-5 or MINI) rather than relying on an unstructured clinical interview alone? Select ALL that apply.',
        options: [
          { text: 'Complex presentations where multiple diagnoses may be present and need to be systematically ruled in or out', isCorrect: true },
          { text: 'Clients who have received multiple differing diagnoses from previous providers', isCorrect: true },
          { text: 'Any client presenting for a first session, regardless of complexity', isCorrect: false },
          { text: 'Cases where diagnostic accuracy has legal implications (competency evaluations, forensic assessments, disability determinations)', isCorrect: true },
          { text: 'Presentations where anchoring bias or premature closure may be risks', isCorrect: true }
        ],
        explanation: 'Structured and semi-structured diagnostic interviews are specifically indicated when diagnostic complexity warrants systematic coverage of multiple diagnostic domains, when prior diagnostic inconsistency requires re-evaluation, when legal or forensic accuracy is essential, or when the clinician needs a structural tool to counteract anchoring or premature closure tendencies. They are not necessary for all first sessions — clinical judgment determines when the rigor of structured interviewing is warranted.'
      },
      {
        type: 'multiSelect',
        question: 'A client presents with low mood, hypersomnia, significant weight gain, leaden paralysis, and extreme sensitivity to interpersonal rejection. Which DSM-5-TR specifier for MDD is MOST accurately supported by this symptom constellation, and which clinical implication does the research evidence support? Select ALL that apply.',
        options: [
          { text: 'The specifier "with atypical features" is most supported by this symptom profile', isCorrect: true },
          { text: 'Atypical features include mood reactivity, hypersomnia, hyperphagia, leaden paralysis, and rejection sensitivity', isCorrect: true },
          { text: 'The specifier "with melancholic features" is most supported by this profile', isCorrect: false },
          { text: 'Atypical features may point toward MAOIs or specific psychotherapeutic approaches as preferable treatment options', isCorrect: true },
          { text: 'Specifiers do not carry treatment planning implications and are documentation-only additions', isCorrect: false }
        ],
        explanation: 'The symptom constellation described — hypersomnia, weight gain/hyperphagia, leaden paralysis, and rejection sensitivity, combined with mood reactivity — is classic for the DSM-5-TR specifier "with atypical features." Melancholic features include early morning awakening, diurnal mood variation, distinct quality of depression, and psychomotor changes. Atypical features have specific treatment implications — research supports MAOIs and certain psychotherapeutic modalities. Specifiers are clinically significant, not documentation extras.'
      }
    ]
  },
  references: [
    'American Psychiatric Association. (2022). <em>Diagnostic and statistical manual of mental disorders</em> (5th ed., text rev.). https://doi.org/10.1176/appi.books.9780890425787',
    'Bordin, E. S. (1979). The generalizability of the psychoanalytic concept of the working alliance. <em>Psychotherapy: Theory, Research and Practice, 16</em>(3), 252–260. https://doi.org/10.1037/h0085885',
    'Engel, G. L. (1977). The need for a new medical model: A challenge for biomedicine. <em>Science, 196</em>(4286), 129–136. https://doi.org/10.1126/science.847460',
    'First, M. B., Williams, J. B. W., Karg, R. S., & Spitzer, R. L. (2016). <em>Structured Clinical Interview for DSM-5 Disorders — Clinician Version (SCID-5-CV)</em>. American Psychiatric Association Publishing.',
    'Kroenke, K., Spitzer, R. L., & Williams, J. B. (2001). The PHQ-9: Validity of a brief depression severity measure. <em>Journal of General Internal Medicine, 16</em>(9), 606–613. https://doi.org/10.1046/j.1525-1497.2001.016009606.x',
    'Spitzer, R. L., Kroenke, K., Williams, J. B. W., & Löwe, B. (2006). A brief measure for assessing generalized anxiety disorder: The GAD-7. <em>Archives of Internal Medicine, 166</em>(10), 1092–1097. https://doi.org/10.1001/archinte.166.10.1092',
    'Posner, K., Brown, G. K., Stanley, B., Brent, D. A., Yershova, K. V., Oquendo, M. A., Currier, G. W., Melvin, G. A., Greenhill, L., Shen, S., & Mann, J. J. (2011). The Columbia–Suicide Severity Rating Scale: Initial validity and internal consistency findings from three multisite studies with adolescents and adults. <em>American Journal of Psychiatry, 168</em>(12), 1266–1277. https://doi.org/10.1176/appi.ajp.2011.10111704',
    'Saunders, J. B., Aasland, O. G., Babor, T. F., De la Fuente, J. R., & Grant, M. (1993). Development of the Alcohol Use Disorders Identification Test (AUDIT): WHO collaborative project on early detection of persons with harmful alcohol consumption—II. <em>Addiction, 88</em>(6), 791–804. https://doi.org/10.1111/j.1360-0443.1993.tb02093.x',
    'Weathers, F. W., Litz, B. T., Keane, T. M., Palmieri, P. A., Marx, B. P., & Schnurr, P. P. (2013). <em>The PTSD Checklist for DSM-5 (PCL-5)</em>. National Center for PTSD. https://www.ptsd.va.gov',
    'Morrison, J. (2014). <em>The first interview</em> (4th ed.). Guilford Press.',
    'Shea, S. C. (1998). <em>Psychiatric interviewing: The art of understanding</em> (2nd ed.). W.B. Saunders.',
    'Segal, D. L., & Hersen, M. (Eds.). (2010). <em>Diagnostic interviewing</em> (4th ed.). Springer.',
    'Lewis-Fernández, R., Aggarwal, N. K., Hinton, L., Hinton, D. E., & Kirmayer, L. J. (Eds.). (2016). <em>DSM-5 handbook on the cultural formulation interview</em>. American Psychiatric Association Publishing.',
    'Croskerry, P. (2002). Achieving quality in clinical decision making: Cognitive strategies and detection of bias. <em>Academic Emergency Medicine, 9</em>(11), 1184–1204. https://doi.org/10.1111/j.1553-2712.2002.tb01574.x',
    'Graber, M. L., Franklin, N., & Gordon, R. (2005). Diagnostic error in internal medicine. <em>Archives of Internal Medicine, 165</em>(13), 1493–1499. https://doi.org/10.1001/archinte.165.13.1493',
    'Mason, O. J., & Claridge, G. (Eds.). (2015). <em>The Oxford handbook of psychiatric ethics</em>. Oxford University Press.',
    'Sadock, B. J., Sadock, V. A., & Ruiz, P. (2017). <em>Kaplan and Sadock\'s comprehensive textbook of psychiatry</em> (10th ed.). Wolters Kluwer.',
    'Othmer, E., & Othmer, S. C. (2002). <em>The clinical interview using DSM-IV-TR: Volume 1, Fundamentals</em>. American Psychiatric Publishing.',
    'Substance Abuse and Mental Health Services Administration. (2020). <em>Screening and assessment of co-occurring disorders in the justice system</em>. SAMHSA. https://store.samhsa.gov'
  ]
};

function stripHTML(h){return(h||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();}
function countWords(c){let t=0;for(const s of c.sections||[])for(const b of s.contentBlocks||[]){
  if(b.content)t+=stripHTML(b.content).split(/\s+/).filter(Boolean).length;
  if(b.question)t+=stripHTML(b.question).split(/\s+/).filter(Boolean).length;
  if(b.explanation)t+=stripHTML(b.explanation).split(/\s+/).filter(Boolean).length;
  if(b.accordionItems)b.accordionItems.forEach(a=>{t+=stripHTML(a.title).split(/\s+/).filter(Boolean).length;t+=stripHTML(a.content).split(/\s+/).filter(Boolean).length;});
  if(b.options)b.options.forEach(o=>t+=stripHTML(typeof o==='string'?o:o.text||'').split(/\s+/).filter(Boolean).length);
  if(b.cards||b.flashcards)(b.cards||b.flashcards||[]).forEach(c=>{t+=stripHTML(c.front||c.text||'').split(/\s+/).filter(Boolean).length;t+=stripHTML(c.back||'').split(/\s+/).filter(Boolean).length;});
  if(b.nodes)Object.values(b.nodes||{}).forEach(n=>{t+=stripHTML(n.text).split(/\s+/).filter(Boolean).length;if(n.choices)n.choices.forEach(ch=>t+=stripHTML(ch.text).split(/\s+/).filter(Boolean).length);});
  if(b.matchingPairs)b.matchingPairs.forEach(p=>{t+=stripHTML(p.term).split(/\s+/).filter(Boolean).length;t+=stripHTML(p.definition).split(/\s+/).filter(Boolean).length;});
  if(b.steps)b.steps.forEach(s=>t+=stripHTML(s.text).split(/\s+/).filter(Boolean).length);
  if(b.takeaways)b.takeaways.forEach(tk=>t+=stripHTML(tk).split(/\s+/).filter(Boolean).length);
  if(b.resources)b.resources.forEach(r=>{t+=stripHTML(r.title||'').split(/\s+/).filter(Boolean).length;t+=stripHTML(r.description||'').split(/\s+/).filter(Boolean).length;});
}
for(const q of c.assessment?.questions||[]){
  if(q.question)t+=stripHTML(q.question).split(/\s+/).filter(Boolean).length;
  if(q.explanation)t+=stripHTML(q.explanation).split(/\s+/).filter(Boolean).length;
  if(q.options)q.options.forEach(o=>t+=stripHTML(o.text||'').split(/\s+/).filter(Boolean).length);
}
return t;}

function validate(c){const e=[];const wc=countWords(c);if(wc<c.ceHours*6000)e.push(`CRITICAL:words ${wc}/${c.ceHours*6000}`);
for(const[i,s]of(c.sections||[]).entries()){const types=(s.contentBlocks||[]).map(b=>b.type);
if(!types.includes('sectionDivider'))e.push(`S${i+1}:divider`);
if(types.filter(x=>['multipleChoice','multiSelect','matching','fillInBlank'].includes(x)).length<2)e.push(`S${i+1}:KC<2`);
if(i>0&&types.filter(x=>['flashcardDeck','scenarioTree','cardSort','sequencing'].includes(x)).length<1)e.push(`S${i+1}:activity`);
for(const b of s.contentBlocks||[])if(b.options?.length&&typeof b.options[0]==='string')e.push(`CRITICAL:flat_options in S${i+1}`);}
if((c.assessment?.questions?.length||0)<15)e.push(`CRITICAL:exam<15 (${c.assessment?.questions?.length})`);
if((c.references?.length||0)<15)e.push(`CRITICAL:refs<15 (${c.references?.length})`);
const lastSection=c.sections?.[c.sections.length-1];
if(lastSection&&!(lastSection.contentBlocks||[]).some(b=>b.type==='resources'))e.push('WARN:final section missing resources block');
return{wc,e};}

async function main(){
  await mongoose.connect(MONGODB_URI);const db=mongoose.connection.db;const col=db.collection('interactivecourses');
  const{wc,e}=validate(COURSE);COURSE.wordCount=wc;
  console.log(`${COURSE.courseCode} | ${wc}w / ${COURSE.ceHours*6000} req | ${COURSE.sections.length} sec | ${COURSE.assessment?.questions?.length} exam Qs | ${COURSE.references?.length} refs`);
  const crit=e.filter(x=>x.startsWith('CRITICAL'));
  if(crit.length){console.error('FAIL',crit.join('; '));await mongoose.disconnect();process.exit(1);}
  if(e.length)e.forEach(x=>console.warn('WARN',x));
  const ex=await col.findOne({slug:SLUG});
  if(ex){await col.updateOne({slug:SLUG},{$set:{...COURSE,updatedAt:new Date()}});console.log('Updated',SLUG);}
  else{await col.insertOne({...COURSE,createdAt:new Date(),updatedAt:new Date()});console.log('Inserted',SLUG);}
  await mongoose.disconnect();
}
main().catch(e=>{console.error(e);process.exit(1);});
