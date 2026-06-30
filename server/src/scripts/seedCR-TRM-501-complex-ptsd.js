import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }
const SLUG = 'cr-trm-501-complex-ptsd';

const COURSE = {
  courseCode: 'CR-TRM-501',
  title: 'Complex PTSD: Diagnosis, Formulation, and Phase-Based Treatment',
  slug: SLUG,
  description: 'This course provides licensed mental health clinicians with a comprehensive framework for understanding and treating Complex PTSD (C-PTSD). Participants will explore the ICD-11 diagnostic criteria for C-PTSD, distinguish it from PTSD and borderline personality disorder, apply phase-based treatment models, and integrate evidence-based interventions targeting the disturbances in self-organization that characterize this diagnosis.',
  ceHours: 3,
  nbccContentArea: 'trauma',
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
    hourBreakdown: [{ label: 'core', hours: 3 }]
  }],
  isPublished: false,
  status: 'draft',
  difficulty: 'intermediate',
  targetAudience: 'Licensed mental health professionals (LPCs, LCSWs, LMFTs, NCCs)',
  learningObjectives: [
    'Distinguish Complex PTSD from PTSD and borderline personality disorder using ICD-11 diagnostic criteria',
    'Identify the three disturbances in self-organization (DSO) that define C-PTSD beyond standard PTSD criteria',
    'Apply phase-based treatment principles (stabilization, trauma processing, integration) appropriate to C-PTSD presentations',
    'Select and apply evidence-based interventions targeting affect dysregulation, negative self-concept, and relational disturbances',
    'Adapt trauma-focused interventions for clients with dissociative presentations and complex trauma histories'
  ],
  sections: [
    {
      title: 'Introduction: Understanding Complex PTSD',
      sectionNumber: 1,
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'Introduction: Understanding Complex PTSD',
          subtitle: 'A diagnostic framework for chronic, relational, and developmental trauma',
          sectionNumber: 1
        },
        {
          type: 'text',
          content: `<p>The concept of Complex PTSD has a complex history of its own. Judith Herman introduced the term in her 1992 landmark text <em>Trauma and Recovery</em>, arguing that the then-dominant PTSD diagnosis failed to capture the full clinical picture of survivors of prolonged, repeated, and inescapable trauma — particularly trauma inflicted within intimate relationships, such as childhood abuse, domestic violence, torture, and trafficking. Herman identified a syndrome characterized not only by PTSD's classic symptom clusters but also by profound alterations in consciousness, self-perception, relational capacity, and systems of meaning — dimensions that standard PTSD criteria neither required nor captured.</p>
<p>For decades, clinicians working with complex trauma survivors observed this mismatch between the DSM's trauma formulation and the clients in their offices: clients who had been traumatized repeatedly in contexts of interpersonal captivity or dependency, who presented with pervasive affect dysregulation, chronic self-destructive behaviors, fragmented identity, fundamental disturbances in their capacity to trust or attach to others, and a sense of hopelessness and shame that permeated their self-concept. Many received diagnoses of borderline personality disorder, which often fit imperfectly and carried significant stigma. Many received co-occurring diagnoses — PTSD plus MDD plus generalized anxiety plus personality disorder NOS — that captured the symptom landscape but not the underlying unity of the presentation.</p>
<p>In 2018, the World Health Organization's ICD-11 formally recognized Complex PTSD as a distinct diagnostic category, providing the first internationally recognized diagnostic framework for what Herman and others had long described clinically. The ICD-11 model conceptualizes C-PTSD as containing all of PTSD's symptom clusters plus three additional "disturbances in self-organization" (DSO): persistent affect dysregulation, persistent negative self-concept, and persistent disturbances in relational functioning. These DSO features must be present, must cause significant impairment, and must be attributable to the traumatic exposure — not better explained by another diagnosis.</p>
<p>This course is organized around three core clinical questions that C-PTSD raises for practicing clinicians. Section 2 addresses the diagnostic and conceptual question: How do we accurately identify C-PTSD, distinguish it from standard PTSD and from personality disorders, and formulate a case that honors the complexity and coherence of the presentation? Section 3 addresses the treatment question: What does evidence-based phase-oriented treatment for C-PTSD look like, and how do we sequence and deliver interventions responsibly for this population? Section 4 addresses the relational and systemic question: How do we work within the therapeutic relationship with C-PTSD clients in ways that are reparative rather than replicating traumatic relational dynamics, and how do we address the broader systemic and social contexts that shaped and sustain the trauma? Together, these three sections provide a clinically grounded foundation for working competently and compassionately with one of the most clinically complex presentations in the field.</p>`
        },
        {
          type: 'videoEmbed',
          title: 'Judith Herman and the Origins of Complex PTSD',
          videoUrl: 'https://www.youtube.com/embed/UkMqNoKB2gI',
          description: 'An exploration of Judith Herman\'s foundational contributions to understanding complex trauma and the clinical syndrome that became Complex PTSD.',
          accessibility: { ariaLabel: 'Video: Judith Herman and the Origins of Complex PTSD', role: 'complementary' }
        },
        {
          type: 'imageText',
          title: 'From Simple to Complex: A Continuum of Trauma Response',
          content: `<p>Trauma responses exist on a continuum shaped by the duration, severity, age of onset, and relational context of traumatic exposure. Single-incident adult trauma in a person with adequate resources and secure attachment typically produces the classic PTSD constellation. Repeated, prolonged trauma occurring in childhood — particularly when inflicted by caregivers — produces a qualitatively different clinical picture that involves fundamental alterations in self-organization. Understanding this continuum is essential for clinical formulation.</p>`,
          image: '',
          imageAlt: 'Diagram showing trauma continuum from single-incident PTSD to complex developmental trauma',
          imagePosition: 'right'
        }
      ]
    },
    {
      title: 'Diagnosis and Clinical Formulation of Complex PTSD',
      sectionNumber: 2,
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'Diagnosis and Clinical Formulation of Complex PTSD',
          subtitle: 'ICD-11 criteria, differential diagnosis, and trauma-informed case conceptualization',
          sectionNumber: 2
        },
        {
          type: 'text',
          content: `<p>The ICD-11 diagnostic criteria for Complex PTSD require that all diagnostic requirements for PTSD are met PLUS the presence of all three disturbances in self-organization (DSO) clusters: (1) problems with affect regulation, (2) negative self-concept, and (3) disturbances in relationships. Each cluster must be severe and persistent, causing significant functional impairment in personal, family, social, occupational, or other areas of functioning. The exposure requirement specifies that the traumatic events were typically prolonged or repetitive and from which escape is difficult or impossible — examples include torture, slavery, genocide, prolonged domestic violence, repeated childhood sexual or physical abuse, and situations of captivity. This exposure requirement distinguishes C-PTSD from standard PTSD, which can follow any qualifying Criterion A event regardless of duration or relational context.</p>
<p>The three DSO clusters require detailed clinical understanding. <strong>Problems with affect regulation</strong> include emotional hyperreactivity, episodes of explosive anger or extreme irritability, emotional numbing or dissociative detachment from emotions, persistent dysphoria, and difficulty identifying and articulating emotional states (alexithymia). These features reflect what developmental trauma researchers call "emotion dysregulation" — not simply the hyperarousal and emotional numbing that are part of standard PTSD, but a fundamental disruption in the capacity to regulate, tolerate, and process emotional experience. This dysregulation is often visible in session as the client swings between flooding and shutdown, or struggles to name what they are feeling even when visibly distressed. It has roots in the failure of early caregiving relationships to provide co-regulatory support for the developing nervous system.</p>
<p><strong>Persistent negative self-concept</strong> encompasses pervasive beliefs of defeat, failure, worthlessness, and damage that are rooted in the traumatic experience itself. The client who was chronically abused in childhood often internalizes the abuser's attributions: they are bad, defective, unlovable, deserving of harm. This is qualitatively different from the negative cognitions about the world and future that appear in standard PTSD (Criterion D). In C-PTSD, the negative cognitions are specifically organized around self-concept and identity — a deeply held, shame-organized conviction that one is fundamentally flawed or damaged. Chronic shame, rather than guilt, is the hallmark affective signature. And critically, these beliefs typically predate the formal traumatic exposures being assessed: they were installed through the relational dynamics of chronic maltreatment, not formed retrospectively about a discrete traumatic event.</p>
<p><strong>Disturbances in relational functioning</strong> include profound difficulties in forming or maintaining close relationships, persistent tendencies to avoid relationships altogether, pervasive feelings of distrust and suspicion toward others, and cycles of idealization and devaluation that reflect disrupted attachment organization. These relational disturbances are not merely symptomatic of depression or anxiety — they are organized around the client's internalized working models of relationships, formed in a context where relationships were the source of harm. The relational disturbance is thus not a random complication of trauma but a logical extension of it: when the people who were supposed to protect you were your primary danger, trusting relationships becomes genuinely dangerous, and the attachment behavioral system becomes organized around strategies that once served survival but now limit intimacy and connection.</p>
<p>Taken together, the DSO features represent what Judith Herman called "alterations in identity and in relations with others" and what later theorists have described as "disturbances in self-organization" — a phrase that captures both the severity and the coherence of the presentation. The client is not randomly symptomatic across multiple domains; they are organized in a coherent way around the legacy of their trauma history, expressed across affective, cognitive, and relational systems. Recognizing this coherence is the beginning of a trauma-informed formulation.</p>`
        },
        {
          type: 'callout',
          title: 'Diagnostic Note: C-PTSD in ICD-11 vs. DSM-5',
          calloutType: 'clinical',
          content: `<p>C-PTSD is recognized in ICD-11 but NOT in DSM-5. In DSM-5, the closest formulation is PTSD with the specifier "with prominent dissociative symptoms" combined with features from the PTSD's extended Criterion D. Clinicians billing with DSM-5 codes should document C-PTSD in the formulation while using the most accurate available DSM-5 code (typically F43.10 PTSD or a combination of PTSD + persistent depressive disorder). When using C-PTSD as a formulation concept, note the ICD-11 framework explicitly in the clinical record to justify the treatment approach — particularly phase-based treatment, which may otherwise appear to deviate from standard trauma-focused CBT protocols.</p>`
        },
        {
          type: 'text',
          content: `<p><strong>Differential Diagnosis: C-PTSD vs. Borderline Personality Disorder.</strong> The overlap between C-PTSD and BPD is one of the most clinically significant diagnostic controversies in the trauma field. Both presentations involve affect dysregulation, identity disturbance, impulsivity, relational instability, and chronic feelings of emptiness or badness. Epidemiological studies find high rates of childhood trauma in BPD samples, leading some researchers to propose that BPD is itself primarily a trauma disorder. Others maintain that BPD has distinct features — abandonment fear, chronic suicidality, self-harm, splitting/idealization-devaluation cycles, brief psychotic episodes under stress — that warrant separate diagnostic recognition.</p>
<p>The ICD-11 working group deliberately constructed C-PTSD to be diagnostically distinct from BPD. Key differentiating features include: (1) C-PTSD requires the presence of all three standard PTSD symptom clusters (re-experiencing, avoidance, and hyperarousal) — features that are not diagnostic requirements for BPD; (2) C-PTSD's affect dysregulation is dominated by numbing and shutdown as well as hyperreactivity, whereas BPD is more consistently characterized by acute and intense emotional responses; (3) C-PTSD does not require the frantic efforts to avoid abandonment that are characteristic of BPD; (4) BPD may involve impulsive behaviors (reckless spending, sexual impulsivity, substance use) that are not required for C-PTSD. Research by Cloitre and colleagues using the International Trauma Questionnaire has confirmed that C-PTSD and BPD are distinguishable diagnostic categories with distinct factor structures and that most individuals in complex trauma samples receive one but not the other diagnosis.</p>
<p>For clinical purposes, when significant overlap exists, a trauma-informed formulation is more useful than a diagnostic binary. The question is not merely "Is this C-PTSD or BPD?" but "How did this person's trauma history shape their attachment organization, affect regulation capacity, self-concept, and relational style, and what does that mean for treatment?" A formulation grounded in trauma history and developmental context can guide treatment effectively regardless of whether the ICD-11 or DSM-5 label more precisely fits the presentation.</p>
<p><strong>Clinical Formulation in C-PTSD.</strong> A trauma-informed formulation for C-PTSD should organize around four axes: (1) <em>Trauma history</em> — what happened, when, by whom, in what relational context, with what buffering resources or absence thereof; (2) <em>Developmental impact</em> — how the trauma affected attachment organization, nervous system regulation, self-concept formation, and cognitive development; (3) <em>Current presentations</em> — the specific constellation of PTSD and DSO symptoms, their severity, their functional impact, and their organizing role in the client's daily life; and (4) <em>Strengths and resources</em> — what resilience factors are present, what the therapeutic alliance capacity appears to be, and what internal and external resources can be mobilized in treatment. This four-axis formulation provides the architecture for a phase-based treatment plan tailored to the individual rather than a generic trauma-focused protocol.</p>`
        },
        {
          type: 'accordion',
          accordionItems: [
            {
              title: 'ICD-11 C-PTSD Diagnostic Requirements',
              content: '<p>ICD-11 C-PTSD requires: (A) All PTSD criteria met (re-experiencing in present, deliberate avoidance, persistent sense of current threat); (B) Affect dysregulation — severe, persistent problems with affect regulation including difficulty returning to baseline after emotional upset, explosive anger, emotional numbing; (C) Negative self-concept — persistent, pervasive negative beliefs about oneself as diminished, defeated, or worthless; (D) Disturbances in relationships — persistent difficulties sustaining close relationships and/or feelings of distrust and pervasive sense of others as dangerous or betraying; (E) Symptoms attributable to prolonged/repeated trauma from which escape was difficult or impossible; (F) Significant functional impairment.'
            },
            {
              title: 'The Three Disturbances in Self-Organization (DSO)',
              content: '<p>Affect dysregulation: difficulty modulating arousal and emotion, including both hyperreactivity (rage, terror, despair) and hypoactivity (emotional numbing, alexithymia, shutdown). Negative self-concept: chronic shame-based beliefs about being fundamentally defective, bad, or worthless — qualitatively different from PTSD\'s negative cognitions about the world or future. Disturbances in relationships: persistent inability to form or maintain close relationships, hypervigilance toward interpersonal threat, fundamental difficulties with trust — rooted in internalized working models of relationships as dangerous.'
            },
            {
              title: 'C-PTSD vs. PTSD: Key Distinctions',
              content: '<p>Standard PTSD can follow any qualifying single-incident or repeated trauma and does not require the DSO features. C-PTSD requires all three DSO clusters (affect dysregulation, negative self-concept, relational disturbances) in addition to standard PTSD symptoms. C-PTSD specifically requires a trauma history of prolonged, repeated, inescapable trauma — typically within an interpersonal context of dependency or captivity. Importantly, not everyone who experiences chronic trauma develops C-PTSD; protective factors including secure attachment, social support, and cognitive appraisal moderate the relationship between exposure and outcome.'
            },
            {
              title: 'C-PTSD vs. BPD: Clinical Differentiation',
              content: '<p>C-PTSD and BPD share affect dysregulation, identity disturbance, and relational difficulties. C-PTSD is distinguished by: (1) requirement for all standard PTSD symptom clusters; (2) affect dominated by numbing/shutdown as well as reactivity; (3) absence of BPD-specific features like frantic abandonment-avoidance, chronic emptiness, and self-harm as affect regulation; (4) identity disturbance organized around shame and self-blame rather than chronic identity confusion. Research using the ITQ finds these are empirically distinguishable presentations. Both may be trauma-rooted; treatment frameworks differ importantly.'
            },
            {
              title: 'Structural Dissociation in C-PTSD',
              content: '<p>Van der Hart, Nijenhuis, and Steele\'s Theory of Structural Dissociation describes how prolonged trauma disrupts the normal integration of personality into discrete parts: the Apparently Normal Personality (ANP), organized around daily functioning but avoiding trauma content, and one or more Emotional Personality parts (EP), organized around trauma-related survival responses (fight, flight, freeze, collapse, attach). In C-PTSD, structural dissociation is common and may range from mild (two-part ANP/EP organization) to complex (multiple EP parts). Understanding structural dissociation guides Phase 1 stabilization work: parts cannot be integrated until they are first stabilized and in contact with each other.'
            }
          ]
        },
        {
          type: 'imageText',
          title: 'The Window of Tolerance in C-PTSD',
          content: `<p>Siegel's concept of the "window of tolerance" — the optimal arousal zone between hyperarousal (flooding/activation) and hypoarousal (shutdown/dissociation) — is especially critical for C-PTSD treatment. Clients with C-PTSD typically have a significantly narrowed window, meaning they move rapidly from the window into either flooded hyperarousal or collapsed hypoarousal with minimal provocation. All Phase 1 treatment is organized around widening this window before trauma processing begins.</p>`,
          image: '',
          imageAlt: 'Window of tolerance diagram showing hyperarousal zone, optimal zone, and hypoarousal zone with C-PTSD window illustrated as very narrow',
          imagePosition: 'left'
        },
        {
          type: 'multipleChoice',
          question: 'According to ICD-11, what distinguishes Complex PTSD from standard PTSD?',
          options: [
            { text: 'Complex PTSD requires more severe trauma exposure than standard PTSD', isCorrect: false },
            { text: 'Complex PTSD additionally requires three disturbances in self-organization: affect dysregulation, negative self-concept, and relational disturbances', isCorrect: true },
            { text: 'Complex PTSD does not require avoidance symptoms that standard PTSD requires', isCorrect: false },
            { text: 'Complex PTSD is the ICD-11 equivalent of PTSD with dissociative features in DSM-5', isCorrect: false }
          ],
          correctAnswer: 1,
          explanation: 'ICD-11 C-PTSD requires all PTSD criteria PLUS three disturbances in self-organization (DSO): persistent affect dysregulation, persistent negative self-concept, and persistent disturbances in relational functioning. It is not simply PTSD with dissociative features — it has a distinct symptom cluster requirement for the DSO features.'
        },
        {
          type: 'text',
          content: `<p>Assessing for C-PTSD requires attention to the DSO features that are often less salient to clients and clinicians than the classic PTSD symptom clusters. Many clients do not spontaneously disclose their affect regulation difficulties in terms that map onto clinical assessment questions — they may describe it as "always flying off the handle" or "going completely numb" or "not even knowing what I feel most of the time." Shame-based negative self-concept may be expressed as pervasive statements of worthlessness, self-blame for the trauma, or deeply entrenched beliefs that they are "broken" or "ruined" by what happened to them. Relational disturbances may present as a long history of failed relationships, profound loneliness alongside inability to tolerate closeness, or alternating extremes of isolation and enmeshed dependency.</p>
<p>The International Trauma Questionnaire (ITQ) is the validated self-report instrument designed to assess both PTSD and C-PTSD per ICD-11 criteria. It includes six items assessing standard PTSD clusters and six additional items assessing the three DSO domains. It is freely available and takes approximately 5–10 minutes to complete. The ITQ allows clinicians to identify whether a client meets criteria for PTSD only, C-PTSD only, both, or neither — an important clinical distinction because the treatment implications differ substantially between PTSD and C-PTSD presentations. Notably, research by Cloitre and colleagues found that approximately 25% of traumatized samples met ICD-11 C-PTSD criteria versus 12% meeting standard PTSD criteria, suggesting C-PTSD is not rare in clinical settings.</p>`
        },
        {
          type: 'matching',
          matchingInstructions: 'Match each disturbance in self-organization (DSO) feature to its correct domain.',
          matchingPairs: [
            { term: 'Chronic alexithymia and difficulty returning to baseline after emotional upset', definition: 'Affect Dysregulation' },
            { term: 'Pervasive shame-based beliefs of being fundamentally defective or worthless', definition: 'Negative Self-Concept' },
            { term: 'Persistent inability to trust or maintain close relationships', definition: 'Relational Disturbances' },
            { term: 'Explosive anger or rage episodes that feel uncontrollable', definition: 'Affect Dysregulation' },
            { term: 'Deep sense of being permanently damaged by what happened', definition: 'Negative Self-Concept' },
            { term: 'Pervasive hypervigilance toward interpersonal threat and betrayal', definition: 'Relational Disturbances' }
          ]
        },
        {
          type: 'multiSelect',
          question: 'Which features SPECIFICALLY distinguish C-PTSD from borderline personality disorder (BPD) per ICD-11 diagnostic logic? Select ALL that apply.',
          options: [
            { text: 'C-PTSD requires all three standard PTSD symptom clusters (re-experiencing, avoidance, hyperarousal)', isCorrect: true },
            { text: 'C-PTSD does not require frantic efforts to avoid abandonment', isCorrect: true },
            { text: 'C-PTSD involves affect dysregulation including numbing/shutdown, not only hyperreactivity', isCorrect: true },
            { text: 'C-PTSD is always preceded by documented childhood abuse', isCorrect: false },
            { text: 'C-PTSD requires prolonged, inescapable trauma as a qualifying exposure', isCorrect: true }
          ],
          explanation: 'C-PTSD is distinguished from BPD by requiring all standard PTSD clusters, not requiring abandonment-fear, including hypoarousal/numbing alongside hyperreactivity, and specifying a prolonged inescapable trauma exposure. C-PTSD does NOT require childhood abuse specifically — adult captivity, trafficking, and prolonged DV also qualify. Many C-PTSD presentations involve no early abuse.'
        },
        {
          type: 'reflection',
          question: 'Think of a client you have worked with (or are currently working with) whose presentation seemed to exceed standard PTSD — perhaps involving pervasive shame, fundamental distrust, or profound affect dysregulation. How might viewing their presentation through a C-PTSD lens change your formulation and your treatment approach?'
        },
        {
          type: 'keyTakeaway',
          title: 'Key Takeaways',
          takeaways: [
            'ICD-11 C-PTSD requires all standard PTSD criteria PLUS three disturbances in self-organization: affect dysregulation, negative self-concept, and relational disturbances — all must be present and functionally impairing.',
            'The three DSO features reflect fundamental disruptions in self-regulation, identity, and relational capacity rooted in the relational context of chronic, inescapable trauma — not merely extended PTSD symptoms.',
            'C-PTSD is empirically distinguishable from BPD: it requires PTSD clusters, involves both hypo- and hyperarousal, and does not require the abandonment-fear and splitting dynamics that characterize BPD.',
            'The ITQ (International Trauma Questionnaire) is the validated, free self-report instrument for ICD-11 C-PTSD assessment and is preferred over the PCL-5 for complex trauma presentations.',
            'A trauma-informed formulation organizing around trauma history, developmental impact, current presentations, and resilience resources provides a more useful clinical guide than diagnostic labels alone.'
          ]
        }
      ]
    },
    {
      title: 'Phase-Based Treatment for Complex PTSD',
      sectionNumber: 3,
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'Phase-Based Treatment for Complex PTSD',
          subtitle: 'Stabilization, trauma processing, and integration — sequencing care responsibly',
          sectionNumber: 3
        },
        {
          type: 'text',
          content: `<p>The most important clinical principle in C-PTSD treatment is phase-based sequencing: the systematic progression from Phase 1 stabilization and skill-building, through Phase 2 trauma processing, to Phase 3 integration and reconnection. This three-phase model, articulated in Judith Herman's original formulation and elaborated extensively in the field's treatment guidelines (ISSTD, ISTSS, NICE), reflects a fundamental truth about working with complex trauma: clients who cannot regulate their affect, who lack internal resources for managing distress, and who have severely disrupted relational capacity are not safe candidates for direct trauma processing. Attempting to move immediately to trauma-focused interventions with an inadequately stabilized C-PTSD client risks decompensation, crisis, dropout, and retraumatization. Stabilization is not a preliminary to treatment — it IS treatment, often for a substantial portion of the therapeutic process.</p>
<p><strong>Phase 1: Safety, Stabilization, and Skill Building.</strong> The goals of Phase 1 are establishing safety, building stabilization skills, psychoeducation about the trauma response, and developing the therapeutic alliance. Safety encompasses both external safety (freedom from ongoing abuse, safe housing, crisis planning) and internal safety (ability to manage distress without self-harm, suicidal action, or dangerous dissociation). External safety must be established before internal stabilization work can proceed effectively: a client who is still living with an abusive partner will find it impossible to develop internal resources while their threat response is chronically activated.</p>
<p>Stabilization skills in Phase 1 focus specifically on three capacities: (1) <em>Arousal regulation</em> — the ability to recognize and modulate states of hyperarousal and hypoarousal. Skills include diaphragmatic breathing, grounding techniques, sensory anchoring, TIPP skills (Temperature, Intense exercise, Paced breathing, Progressive muscle relaxation), and orienting responses. (2) <em>Affect tolerance</em> — the ability to experience emotions without being overwhelmed or shutting down. DBT's emotion regulation and distress tolerance skills are highly applicable here: PLEASE, ACCEPTS, IMPROVE, self-soothe kits, and urge surfing. (3) <em>Dissociation management</em> — the ability to recognize and interrupt dissociative episodes. Grounding scripts, sensory stimulation, dual awareness statements ("I am here, now, in 2025, and that happened in the past"), and EMDR's container and safe place exercises all support this capacity.</p>
<p>Phase 1 also includes psychoeducation about trauma and the nervous system. Research consistently demonstrates that psychoeducation is itself a therapeutic intervention: understanding the neurobiology of the trauma response — that hypervigilance is the nervous system doing its job, that flashbacks are not signs of "going crazy" but rather traumatic memory activating, that shame in C-PTSD was installed by the abuser not discovered about oneself — significantly reduces self-blame, increases sense of agency, and strengthens the therapeutic alliance. Polyvagal Theory-informed psychoeducation ("your nervous system learned these patterns to protect you; now we're going to help it learn new ones") is particularly validating for clients who have been repeatedly told that their responses are disproportionate or irrational.</p>
<p><strong>Phase 2: Trauma Processing.</strong> Phase 2 begins only when the client has demonstrated adequate Phase 1 stabilization: consistent ability to regulate arousal within the window of tolerance, capacity to manage distressing emotions without crisis, stable external safety, and a robust therapeutic alliance. The transition to Phase 2 should be collaborative and explicit — the client should understand what trauma processing involves and choose to engage in it from a place of sufficient stabilization.</p>
<p>Evidence-based Phase 2 modalities for C-PTSD include EMDR (Eye Movement Desensitization and Reprocessing), Prolonged Exposure (PE) adapted for complex presentations, CPT (Cognitive Processing Therapy), STAIR-NT (Skills Training in Affective and Interpersonal Regulation, Narrative Therapy), and phase-based adaptations of somatic approaches including Sensorimotor Psychotherapy and Somatic Experiencing. All of these modalities require Phase 1 preparation before implementation, and all recommend titration and pacing to maintain the client within the window of tolerance during processing. Unlike standard PTSD treatment, C-PTSD processing typically involves more gradual exposure, more frequent returns to stabilization techniques, and processing of the relational and identity-level dimensions of the trauma alongside the specific traumatic memories.</p>
<p>A critical distinction in Phase 2 with C-PTSD clients is between trauma memory processing (the central target of standard PTSD interventions) and schema-level processing (addressing the DSO features that are not simply traumatic memories but rather deeply organized beliefs, relational patterns, and emotional response systems). EMDR's standard protocol targets traumatic memory processing; the DSO features of C-PTSD often require additional schema-focused intervention. Schema Therapy, CPT's cognitive restructuring work on stuck points, and EMDR's recent Resource Development and Installation protocol modifications all address schema-level change. Clinicians should not assume that resolving traumatic memories will automatically resolve the DSO features; targeted intervention at the level of self-concept, affect regulation capacity, and relational schemas is often required.</p>`
        },
        {
          type: 'callout',
          title: 'Protocol: Sequencing Phase 1 to Phase 2 Transition',
          calloutType: 'protocol',
          content: `<p>Before initiating Phase 2 trauma processing with a C-PTSD client, confirm ALL of the following: (1) External safety is established — no ongoing abuse, stable housing, crisis plan in place; (2) Client can regulate arousal within window of tolerance using at least 2–3 internalized stabilization skills; (3) Client can tolerate moderate emotional distress without self-harm or crisis-level dysregulation; (4) Dissociation is adequately managed — client can ground and return to present awareness when needed; (5) Therapeutic alliance is robust — ruptures can be named and repaired; (6) Client has given informed consent with understanding of what trauma processing involves. Document this clinical readiness assessment in the record before beginning Phase 2.</p>`
        },
        {
          type: 'text',
          content: `<p><strong>Phase 3: Integration and Reconnection.</strong> Phase 3 involves the work of integrating the trauma narrative into a coherent autobiographical identity and reconnecting with life, relationships, and meaning. Herman described this as "the survivor mission" — the process of making meaning from traumatic experience and reclaiming ordinary life. Phase 3 work is less sharply defined than Phases 1 and 2, and the clinical literature is thinner. Key tasks include: narrative integration (constructing a coherent life story in which traumatic experiences are contextualized but do not define the whole); identity consolidation (developing a stable, complex sense of self that is not organized primarily around trauma or shame); relational reconstruction (building new relational experiences that disconfirm the trauma-organized relational templates); and meaning-making (finding or constructing personal, spiritual, or social meaning that gives the suffering significance beyond the experience itself).</p>
<p>Phase 3 is also the phase where the therapeutic relationship is most explicitly reparative — where the therapist's consistent presence, attunement, and capacity to hold the client's complexity without pathologizing, abandoning, or becoming overwhelmed provides a new relational experience that gradually revises the client's internalized working models of relationships. This does not mean that Phase 1 and 2 are relationally irrelevant — the therapeutic relationship is always the medium through which all trauma work occurs. But in Phase 3, the relational reparation itself becomes more explicitly a therapeutic target, and the therapist's authentic presence is particularly valuable.</p>
<p>The integration of Phase 3 is ongoing and nonlinear. Clients may return to Phase 1 or 2 work during periods of stress, life transitions, or when new traumatic material emerges. The phase-based model is a clinical map, not a rigid protocol: clients move between phases, sometimes within a single session, and the skilled C-PTSD clinician learns to read these transitions and adjust the clinical stance accordingly. A session that begins in Phase 3 narrative integration may require a return to Phase 1 grounding when unexpected activation occurs; the therapist's flexibility and attunement in navigating these shifts is itself a therapeutic intervention.</p>`
        },
        {
          type: 'accordion',
          accordionItems: [
            {
              title: 'STAIR-NT (Skills Training in Affective and Interpersonal Regulation — Narrative Therapy)',
              content: '<p>STAIR-NT is a two-module evidence-based treatment for C-PTSD. Module 1 (STAIR) provides 8 sessions of skill-building targeting emotion regulation and interpersonal effectiveness — directly addressing the DSO features of affect dysregulation and relational disturbances. Module 2 (NT/Narrative Therapy) provides 8 sessions of trauma narrative processing. This two-phase structure explicitly operationalizes phase-based treatment and has demonstrated efficacy in RCTs with adult survivors of childhood abuse. Cloitre and colleagues (2010) found that STAIR before narrative therapy produced superior outcomes compared to supportive counseling before narrative therapy or narrative therapy alone — providing empirical support for Phase 1 sequencing.</p>'
            },
            {
              title: 'DBT Skills for C-PTSD Phase 1',
              content: '<p>Dialectical Behavior Therapy (DBT), originally developed for BPD, is highly applicable to C-PTSD Phase 1 stabilization given the shared affect dysregulation features. Specific DBT modules that map onto C-PTSD Phase 1 targets: Mindfulness skills (radical acceptance, observing and describing experience) — support affect tolerance and dissociation management; Distress Tolerance skills (TIPP, ACCEPTS, IMPROVE, self-soothe) — build capacity to survive emotional crises without escalation; Emotion Regulation skills (PLEASE, opposite action, check the facts) — support the affect dysregulation DSO feature directly; Interpersonal Effectiveness skills (DEAR MAN, GIVE, FAST) — begin addressing the relational disturbances DSO feature. Full DBT requires extensive training; adapted DBT skill modules can be delivered by any trained clinician.</p>'
            },
            {
              title: 'EMDR for Complex PTSD',
              content: '<p>EMDR has strong evidence for PTSD and growing evidence for C-PTSD. Standard EMDR protocol (8 phases: history-taking, preparation, assessment, desensitization, installation, body scan, closure, re-evaluation) requires Phase 1 preparation before Phase 3 (assessment) through Phase 7 (desensitization and installation). For C-PTSD clients, the EMDR preparation phase typically extends substantially beyond what standard PTSD treatment requires. Resource Development and Installation (RDI) is often used extensively in Phase 1. Modified approaches include the EMDR Recent Traumatic Event Protocol, the Trauma Recovery Protocol for complex trauma, and the Attachment-Focused EMDR adaptations developed by Laurel Parnell. EMDR with C-PTSD requires specialized training beyond basic EMDR certification.</p>'
            },
            {
              title: 'Somatic Approaches for C-PTSD',
              content: '<p>Somatic Experiencing (SE, developed by Peter Levine) and Sensorimotor Psychotherapy (SP, developed by Pat Ogden) both address the body-based dimensions of C-PTSD that verbal therapies may miss. SE uses titrated somatic tracking to allow the nervous system to discharge incomplete defensive responses and complete biological survival cycles. SP integrates mindful body awareness, movement, and somatic resources into a comprehensive relational trauma treatment. Both approaches are organized around titration and pendulation (alternating between resourcing and trauma material) that naturally supports phase-based sequencing. These approaches require specific training and are not techniques to be added ad hoc to existing practice.</p>'
            },
            {
              title: 'Internal Family Systems (IFS) for C-PTSD',
              content: '<p>Internal Family Systems therapy, developed by Richard Schwartz, conceptualizes mind as naturally multiple — composed of "parts" or sub-personalities organized in protective and exile roles. IFS offers a particularly well-suited framework for C-PTSD because it: (1) destigmatizes what others might pathologize as identity disorder; (2) provides a non-pathologizing framework for understanding dissociative parts; (3) organizes treatment around strengthening the "Self" (the core, compassionate leadership capacity) rather than suppressing or removing parts; (4) targets shame directly through Self-to-part compassionate engagement with wounded exile parts. IFS is manualized and has growing empirical support for trauma. The concept of "unblending" (separating the observer from the reactive part) is particularly valuable for C-PTSD clients with significant affect dysregulation.</p>'
            }
          ]
        },
        {
          type: 'imageText',
          title: 'Phase-Based Treatment Timeline in Practice',
          content: `<p>For many C-PTSD clients, Phase 1 stabilization occupies anywhere from several months to over a year of treatment before Phase 2 processing is clinically indicated. Clinicians trained primarily in brief trauma-focused protocols may experience this as treatment stalling, but it represents appropriate clinical judgment. Attempting to rush Phase 2 with an inadequately stabilized C-PTSD client is one of the most common — and consequential — errors in complex trauma treatment.</p>`,
          image: '',
          imageAlt: 'Timeline diagram illustrating typical phase-based treatment duration for C-PTSD with Phase 1 longer than Phases 2 and 3',
          imagePosition: 'right'
        },
        {
          type: 'scenarioTree',
          scenarioTitle: 'Navigating Phase Transitions: A Clinical Decision Scenario',
          instructions: 'Work through this clinical scenario by making decisions at each branch point. There are multiple paths — consider the rationale for each choice.',
          nodes: [
            {
              id: 'start',
              text: 'Marisol, 34, has been in therapy with you for 8 months. She has a documented history of severe childhood sexual and physical abuse from ages 4–12 by a family member. She meets ICD-11 criteria for C-PTSD: re-experiencing (nightmares, intrusive images), avoidance, hyperarousal, severe affect dysregulation (several recent dissociative episodes, one incident of self-harm by cutting 3 months ago), negative self-concept ("I am ruined"), and profound relational distrust. She now says, "I think I\'m ready to start talking about what happened. I want to process the abuse directly." What is your primary clinical consideration?',
              choices: [
                { text: 'She is motivated and ready — begin trauma processing next session', nextId: 'premature' },
                { text: 'Assess her Phase 1 stabilization status before responding to the readiness statement', nextId: 'assess' }
              ]
            },
            {
              id: 'premature',
              text: 'You proceed with direct trauma processing the following session. Marisol quickly becomes overwhelmed and floods with terror and rage. She dissociates severely mid-session and you spend the last 20 minutes attempting to ground her. She leaves distressed and texts you that night: "I can\'t do this. I knew I was too broken to be helped." She cancels her next two appointments. This outcome illustrates the consequences of premature trauma processing — the client\'s motivation to process is not the same as clinical readiness. The Phase 1 stabilization criteria had not been met, and the attempt has disrupted the therapeutic alliance.',
              isEnd: true
            },
            {
              id: 'assess',
              text: 'You gently validate her motivation and then conduct a clinical readiness assessment. You find: she used self-harm 3 months ago (no current self-harm but the behavior is recent); she has experienced multiple dissociative episodes in recent months; she can use grounding skills but sometimes forgets them when activated; her window of tolerance is narrow. Based on this, what is your clinical recommendation?',
              choices: [
                { text: 'Continue Phase 1 stabilization, explain the reasoning to Marisol, and collaboratively set Phase 2 readiness goals', nextId: 'continue_phase1' },
                { text: 'Begin titrated trauma processing given her motivation, using very brief exposures', nextId: 'titrated' }
              ]
            },
            {
              id: 'continue_phase1',
              text: 'You explain phase-based treatment to Marisol in non-pathologizing language: "Your nervous system needs more preparation before we go into the hardest material — not because anything is wrong with you, but because we want to make sure you have the tools to get through it without it becoming another overwhelming experience." You collaboratively set readiness goals: 90 days without self-harm, reliable grounding, ability to tolerate moderate distress. Marisol is disappointed but understands. Over the next 4 months, she achieves all three goals. You then collaboratively transition to Phase 2 — and she moves through processing with much greater stability. This represents best-practice phase-based treatment.',
              isEnd: true
            },
            {
              id: 'titrated',
              text: 'You begin very brief, titrated trauma exposures. In the first session this seems manageable. By the third session, however, Marisol has a severe dissociative episode and self-harms again after the session. She reports feeling "cracked open" and asks to stop. While titration is a valid Phase 2 technique, the clinical readiness criteria had not been met — the ongoing dissociation and recent self-harm indicated Phase 1 stabilization was still needed. The premature transition, even titrated, has resulted in a crisis and alliance disruption requiring repair.',
              isEnd: true
            }
          ],
          accessibility: { ariaLabel: 'Scenario: Navigating C-PTSD phase transitions', role: 'application' }
        },
        {
          type: 'multipleChoice',
          question: 'A client with C-PTSD has been in Phase 1 stabilization for 10 months. They are motivated and asking to "finally deal with the trauma." Which factor MOST strongly indicates clinical readiness to transition to Phase 2?',
          options: [
            { text: 'The client\'s expressed motivation and readiness to process trauma', isCorrect: false },
            { text: 'Consistent ability to regulate arousal within the window of tolerance, no self-harm in 90+ days, robust therapeutic alliance, and reliable grounding skills', isCorrect: true },
            { text: 'Reduction in PCL-5 scores below the PTSD threshold', isCorrect: false },
            { text: 'Client and therapist agreement that 10 months of Phase 1 is sufficient', isCorrect: false }
          ],
          correctAnswer: 1,
          explanation: 'Clinical readiness for Phase 2 is determined by demonstrated stabilization capacities — not by client motivation, symptom reduction, or time in treatment. The key readiness markers are: consistent arousal regulation within the window of tolerance, no recent self-harm, a robust and repaired therapeutic alliance, and reliable use of grounding/distress tolerance skills.'
        },
        {
          type: 'multiSelect',
          question: 'Which of the following evidence-based interventions specifically address the disturbances in self-organization (DSO) features of C-PTSD rather than only traumatic memory? Select ALL that apply.',
          options: [
            { text: 'STAIR (Skills Training in Affective and Interpersonal Regulation)', isCorrect: true },
            { text: 'DBT emotion regulation and interpersonal effectiveness modules', isCorrect: true },
            { text: 'Prolonged Exposure (standard protocol)', isCorrect: false },
            { text: 'Schema Therapy', isCorrect: true },
            { text: 'Internal Family Systems (IFS)', isCorrect: true }
          ],
          explanation: 'STAIR, DBT, Schema Therapy, and IFS all target the DSO features of C-PTSD (affect dysregulation, negative self-concept, relational disturbances) alongside or prior to traumatic memory. Standard Prolonged Exposure is primarily a trauma memory processing intervention and does not specifically target DSO features — it is often insufficient as a stand-alone treatment for C-PTSD and may require Phase 1 adaptations and DSO-targeting supplements.'
        },
        {
          type: 'reflection',
          question: 'Consider your current clinical setting and caseload. What are the realistic barriers to implementing phase-based treatment (e.g., insurance authorization limits, agency session caps, client expectations)? What adaptations could you make within those constraints to still sequence treatment responsibly?'
        },
        {
          type: 'keyTakeaway',
          title: 'Key Takeaways',
          takeaways: [
            'Phase-based treatment — stabilization before processing, processing before integration — is the evidence-based standard of care for C-PTSD and reflects the neurobiological and clinical reality of complex trauma.',
            'Phase 1 is not preliminary to treatment; for C-PTSD clients, it often constitutes the majority of treatment time and includes safety establishment, arousal regulation, affect tolerance, dissociation management, and psychoeducation.',
            'Clinical readiness for Phase 2 is determined by demonstrated stabilization capacities, not client motivation or time in treatment — premature Phase 2 risks crisis, decompensation, and therapeutic alliance rupture.',
            'DSO features (affect dysregulation, negative self-concept, relational disturbances) require targeted intervention beyond traumatic memory processing; STAIR, DBT, Schema Therapy, and IFS specifically address these domains.',
            'Phase 3 integration involves narrative construction, identity consolidation, relational reconstruction, and meaning-making — the therapeutic relationship itself is a primary vehicle for relational reparation in this phase.'
          ]
        }
      ]
    },
    {
      title: 'The Therapeutic Relationship and Systemic Considerations in C-PTSD Treatment',
      sectionNumber: 4,
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'The Therapeutic Relationship and Systemic Considerations in C-PTSD Treatment',
          subtitle: 'Working relationally, avoiding enactments, and addressing systemic trauma',
          sectionNumber: 4
        },
        {
          type: 'text',
          content: `<p>The therapeutic relationship in C-PTSD treatment is simultaneously the most powerful therapeutic tool and the most complex clinical terrain. Because C-PTSD's relational disturbance features are rooted in early caregiving contexts where relationships were the source of harm, the therapeutic relationship invariably activates the client's trauma-organized relational templates. The therapist will become the target of the client's survival-organized relational strategies: distance-seeking when closeness feels threatening, testing behaviors when trust is fragile, idealization followed by devaluation as ambivalence about dependency surfaces, rage when the therapist disappoints or fails, and profound longing for a caregiving that the therapist cannot provide.</p>
<p>None of this is pathological acting out — it is the relational DSO features of C-PTSD expressing themselves in the most important relationship the client has. The therapist's task is to understand these relational dynamics in terms of their traumatic origins, to maintain a consistent therapeutic stance that does not enact the traumatic relational template, and to use the ruptures and repairs in the therapeutic relationship as explicit vehicles for relational learning. Rupture and repair — when the therapist fails the client (and this will happen), names it, takes responsibility, and repairs the alliance — is one of the most potent interventions available in C-PTSD treatment. It provides direct experiential evidence that relationship ruptures do not have to be catastrophic and that trust can survive imperfection.</p>
<p>Countertransference management is a non-negotiable clinical competency in C-PTSD treatment. Working intensively with survivors of complex trauma exposes clinicians to material that routinely challenges professional boundaries, activates rescue fantasies, evokes vicarious trauma responses, generates countertransferential despair or hopelessness, and creates risks of both under-involvement (clinical distance as self-protection) and over-involvement (boundary violations driven by rescue motivation or identification with the client). Regular supervision — particularly trauma-informed supervision from a clinician experienced with complex presentations — is not optional for this work. Peer consultation, personal therapy, and structured self-care practices are also clinical necessities, not luxuries.</p>
<p><strong>Trauma Enactments and Their Clinical Management.</strong> A trauma enactment occurs when the client-therapist interaction begins to replicate the traumatic relational dynamic — the therapist unknowingly takes on a role (perpetrator, rescuer, bystander, abandoner) that reproduces the original traumatic relationship. Enactments are not errors to be avoided at all costs — in Herman's framing, they are inevitable in deep complex trauma work. What matters is the therapist's capacity to recognize the enactment, step out of the role, name what happened, and use the enactment as clinical material. A therapist who never experiences activation, who never makes a mistake, who never disappoints — is probably not doing deep enough relational work with C-PTSD clients. The therapeutic relationship's authenticity, including its authentic imperfection and repair, is precisely what makes it therapeutically potent.</p>
<p>Specific enactment dynamics that are particularly common in C-PTSD work include: the helpless-helper dynamic (client presents as completely dependent and helpless; therapist works increasingly hard and takes on more responsibility, eventually burning out or setting firm limits that the client experiences as abandonment); the persecutor-victim reversal (therapist, frustrated by limit-testing and boundary challenges, begins to respond with rigidity or punitiveness that mirrors the original abusive relationship); the idealization-crash cycle (client idealizes therapist as the perfect, all-powerful rescuer; therapist is unable to meet the idealized expectation; client experiences the failure as devastating betrayal). Recognizing these dynamics — in real time, not only retrospectively in supervision — requires the therapist to maintain ongoing self-reflective awareness throughout sessions.</p>`
        },
        {
          type: 'callout',
          title: 'Ethics: Boundaries in C-PTSD Treatment',
          calloutType: 'ethics',
          content: `<p>The relational intensity of C-PTSD treatment creates specific boundary risks. Clients who experienced early relational trauma may interpret therapist warmth and attunement as evidence of a special relationship that transcends professional limits. Rescue fantasies on the part of the therapist can lead to boundary extensions (extra sessions, personal disclosure, availability outside hours) that create dependency without building autonomy. Review your ethics code's guidance on dual relationships and boundary management before beginning intensive trauma work. Establish clear treatment agreements including contact protocols, crisis resources, and session frequency expectations from the outset. Use supervision proactively — not only when something feels wrong, but routinely, as prevention.</p>`
        },
        {
          type: 'text',
          content: `<p><strong>Systemic Trauma: Addressing the Social Context of C-PTSD.</strong> Complex trauma does not occur in a social vacuum, and C-PTSD treatment that focuses exclusively on the individual without engaging the systemic context of the trauma risks both clinical incompleteness and ethical failure. For many clients — particularly clients from marginalized communities — the trauma that has shaped their C-PTSD presentation is embedded in and perpetuated by systemic oppression. Racism, poverty, homophobia, transphobia, ableism, and historical violence are not mere contextual background — they are active, ongoing sources of traumatic stress that individual therapy cannot resolve and that a treatment model focused only on internal self-regulation implicitly delegitimizes.</p>
<p>A socially-informed approach to C-PTSD treatment includes: (1) explicitly acknowledging the systemic dimensions of the client's trauma rather than locating the problem entirely within the individual; (2) recognizing that some of what appears to be affect dysregulation or negative self-concept may be realistic appraisals of ongoing danger or internalized oppression rather than trauma distortions; (3) integrating advocacy, resource connection, and social support into the treatment frame; (4) attending to power dynamics within the therapeutic relationship itself — particularly when the therapist comes from a dominant social group and the client from a marginalized one. The ADDRESSING framework (Hays, 2016) is a useful tool for systematic analysis of cultural influences on identity and experience.</p>
<p>Post-traumatic growth (PTG) — the positive psychological change that can emerge from the struggle with highly challenging life circumstances — is a real phenomenon documented across diverse cultural and clinical populations. Tedeschi and Calhoun identified five domains of PTG: personal strength, new possibilities, relating to others, appreciation of life, and spiritual change. PTG does not erase or cancel the suffering of trauma — it is not a silver lining that makes the trauma "worth it." Rather, it represents the human capacity to find meaning, connection, and vitality even in and through profound suffering. Clinicians working in Phase 3 can explicitly attend to and support PTG as an integration-enhancing process, while remaining careful not to impose a growth narrative on clients who are not experiencing or seeking it.</p>
<p>The final clinical consideration in C-PTSD treatment is the question of ending. Termination with C-PTSD clients is typically a complex and often extended process — not a brief administrative conclusion but a therapeutic intervention in its own right. For clients whose relational history is dominated by abandonment, sudden ending, and loss, the ending of therapy activates all of those dynamics. Planned, gradual, collaborative termination that explicitly acknowledges the significance of the therapeutic relationship, processes the grief of ending, celebrates the growth and integration achieved, and reinforces the client's internalization of the relational experience — is the clinical standard. Abrupt or unplanned endings (due to therapist relocation, insurance termination, or administrative decisions) should be prevented wherever possible; when unavoidable, they require careful management and transitional support.</p>`
        },
        {
          type: 'accordion',
          accordionItems: [
            {
              title: 'Vicarious Traumatization and Clinician Self-Care',
              content: '<p>Vicarious traumatization (VT) — the cumulative transformation of the therapist\'s inner world through empathic engagement with trauma material — is an occupational hazard, not a clinical failure, in complex trauma work. Pearlman and Saakvitne identified VT as disruptions in the therapist\'s schemas about safety, trust, power, esteem, and intimacy — the same schema domains that trauma disrupts in clients. Prevention requires: structural protections (caseload balance, regular supervision, peer support), personal practices (creative expression, physical activity, spiritual practice, meaningful relationships outside work), and organizational supports (trauma-informed supervision, adequate case consultation time, manageable caseloads). Recognizing the signs of VT in oneself — including cynicism, emotional numbing, intrusive imagery from client material, avoidance of clinical engagement — is essential to maintaining competent practice.</p>'
            },
            {
              title: 'Working with Dissociative Systems in C-PTSD',
              content: '<p>When C-PTSD presentations include significant structural dissociation (multiple identifiable "parts" or ego states), specialized knowledge is required. Key clinical guidelines: (1) Map the dissociative system before attempting processing — know who the parts are and what functions they serve; (2) Build communication and collaboration between parts in Phase 1 before processing with any single part in Phase 2; (3) Avoid processing with the Apparently Normal Personality while ignoring Emotional Personality parts — the EP holds the trauma and needs to be part of treatment; (4) Maintain a stance of curiosity and compassion toward all parts, including self-destructive ones — they were all organized to protect; (5) Consider consultation or referral when dissociative complexity exceeds the clinician\'s training or scope of practice. ISSTD Guidelines for treating DID and complex dissociative presentations are the field standard.</p>'
            },
            {
              title: 'Group Therapy as Adjunct for C-PTSD',
              content: '<p>Group therapy is a powerful complement to individual therapy for C-PTSD clients, particularly in Phase 1 and Phase 3. The group context directly addresses relational disturbance features by providing a corrective relational experience within a peer community. Skill-based psychoeducational groups (DBT skills groups, trauma-focused CBT groups, Seeking Safety for co-occurring trauma and substance use) are particularly appropriate for Phase 1 stabilization and skill-building. Phase 3 relational groups can support social reconnection and community belonging. Process-oriented trauma groups are generally not appropriate for clients still in Phase 1 — the relational intensity and potential for triggering make them contraindicated before adequate stabilization. Assess group readiness using the same criteria as Phase 2 individual readiness.'
            },
            {
              title: 'Medication Considerations in C-PTSD',
              content: '<p>While pharmacological treatment is outside the scope of counseling practice, understanding the psychiatric landscape supports effective collaborative care. No medication is FDA-approved specifically for C-PTSD. SSRIs (sertraline, paroxetine) are FDA-approved for PTSD and often used for C-PTSD\'s PTSD features. Prazosin has evidence for trauma nightmares. For the DSO features, evidence is limited: affect dysregulation may respond to mood stabilizers (lamotrigine, valproate) or second-generation antipsychotics, with mixed evidence. Dissociative features are generally not well-addressed by available medications. Benzodiazepines are typically contraindicated in trauma presentations due to risks of dependence and potential interference with fear extinction. Coordinating with prescribers, helping clients communicate their treatment goals, and monitoring medication effects are appropriate collaborative care practices.'
            }
          ]
        },
        {
          type: 'imageText',
          title: 'The Therapist\'s Use of Self in Complex Trauma Work',
          content: `<p>Research consistently identifies the therapeutic relationship as the most potent predictor of treatment outcome across modalities. In C-PTSD treatment specifically, the therapist's capacity for authentic presence — the ability to be genuinely present, emotionally available, and relationally real while maintaining professional grounding — is not merely a relational skill. It is the primary therapeutic medium. Supervision, personal therapy, and self-reflective practice are not optional enrichments; they are clinical necessities that maintain the therapist's capacity for this kind of work.</p>`,
          image: '',
          imageAlt: 'Clinician and client in genuine engaged conversation, representing authentic therapeutic presence',
          imagePosition: 'left'
        },
        {
          type: 'fillInBlank',
          title: 'C-PTSD Treatment Concepts: Fill in the Blanks',
          blanks: [
            {
              prompt: 'A trauma _____________ occurs when the client-therapist interaction begins to replicate the original traumatic relational dynamic, such as the therapist unknowingly taking on a perpetrator, rescuer, or abandoner role.',
              answer: 'enactment',
              acceptAlternates: ['enactments', 'reenactment', 'reenactments']
            },
            {
              prompt: 'The concept of _____________ and repair describes the therapeutic process by which an alliance rupture — when the therapist fails or disappoints the client — is named, addressed, and healed, providing direct experiential evidence that relationships can survive imperfection.',
              answer: 'rupture',
              acceptAlternates: ['alliance rupture', 'therapeutic rupture']
            },
            {
              prompt: 'Pearlman and Saakvitne described _____________ traumatization as the cumulative transformation of the therapist\'s inner world through empathic engagement with clients\' trauma material.',
              answer: 'vicarious',
              acceptAlternates: ['secondary']
            },
            {
              prompt: 'Tedeschi and Calhoun\'s model of post-traumatic _____________ identifies five domains of positive psychological change that can emerge from the struggle with highly challenging life circumstances.',
              answer: 'growth',
              acceptAlternates: ['posttraumatic growth', 'PTG']
            },
            {
              prompt: 'The Theory of Structural _____________, developed by van der Hart, Nijenhuis, and Steele, describes how chronic trauma disrupts the integration of personality into Apparently Normal and Emotional parts.',
              answer: 'Dissociation',
              acceptAlternates: ['dissociation']
            }
          ]
        },
        {
          type: 'multipleChoice',
          question: 'Which clinical dynamic is MOST accurately described as a "trauma enactment" in C-PTSD therapy?',
          options: [
            { text: 'The client discussing trauma content in Phase 2 processing', isCorrect: false },
            { text: 'The therapist becoming increasingly responsible and working harder as the client presents as helpless, eventually burning out or setting limits the client experiences as abandonment', isCorrect: true },
            { text: 'The client reporting increased nightmares after beginning trauma processing', isCorrect: false },
            { text: 'The therapist using countertransference to inform clinical understanding', isCorrect: false }
          ],
          correctAnswer: 1,
          explanation: 'The helpless-helper dynamic is a classic trauma enactment: the client\'s trauma-organized relational pattern of presenting as completely dependent pulls for the therapist to work harder, rescue, and over-function. The therapist eventually either burns out or sets firm limits, which the client experiences as the abandonment they expected. This replicates the traumatic relational template rather than disconfirming it.'
        },
        {
          type: 'multiSelect',
          question: 'Which of the following represent systemic considerations that a socially-informed C-PTSD treatment approach should incorporate? Select ALL that apply.',
          options: [
            { text: 'Acknowledging that some affect dysregulation may reflect realistic appraisal of ongoing danger rather than trauma distortion', isCorrect: true },
            { text: 'Explicitly naming systemic oppression as a source of ongoing traumatic stress, not only background context', isCorrect: true },
            { text: 'Restricting treatment focus to internal self-regulation as the only appropriate clinical goal', isCorrect: false },
            { text: 'Attending to power dynamics within the therapeutic relationship when therapist and client come from different social positions', isCorrect: true },
            { text: 'Integrating advocacy and resource connection into the treatment frame', isCorrect: true }
          ],
          explanation: 'Socially-informed C-PTSD treatment recognizes systemic oppression as an active ongoing stressor, validates realistic appraisals of danger, attends to power dynamics in the therapeutic relationship, and integrates advocacy alongside clinical intervention. Restricting treatment to internal regulation without addressing systemic context implicitly locates the problem entirely within the individual and delegitimizes the external reality of ongoing oppression.'
        },
        {
          type: 'videoEmbed',
          title: 'The Therapeutic Relationship in Complex Trauma Treatment',
          videoUrl: 'https://www.youtube.com/embed/MsH0RyB4PQ4',
          description: 'An exploration of relational dynamics, rupture and repair, and the therapist\'s use of self in complex trauma treatment.',
          accessibility: { ariaLabel: 'Video: The Therapeutic Relationship in Complex Trauma Treatment', role: 'complementary' }
        },
        {
          type: 'reflection',
          question: 'Identify a time in your clinical work when you noticed a potential enactment dynamic — a moment when the therapeutic interaction began to replicate a familiar relational pattern from the client\'s history. How did you recognize it? How did you respond? What would you do differently now?'
        },
        {
          type: 'resources',
          title: 'Resources for Complex PTSD Treatment',
          resources: [
            {
              name: 'ISSTD Guidelines for Treating Dissociative Identity Disorder (and Complex Dissociative Disorders)',
              description: 'International Society for the Study of Trauma and Dissociation clinical practice guidelines covering assessment, phase-based treatment, and specific interventions for complex dissociative presentations.',
              url: 'https://www.isst-d.org/resources/practice-guidelines/'
            },
            {
              name: 'ISTSS PTSD Prevention and Treatment Guidelines',
              description: 'International Society for Traumatic Stress Studies comprehensive treatment guidelines with specific recommendations for complex PTSD presentations, evidence quality ratings for all major modalities.',
              url: 'https://www.istss.org/treating-trauma/new-istss-prevention-and-treatment-guidelines.aspx'
            },
            {
              name: 'International Trauma Questionnaire (ITQ) — ICD-11 PTSD and C-PTSD Assessment',
              description: 'Free validated self-report measure assessing both PTSD and Complex PTSD per ICD-11 criteria, including all three disturbances in self-organization.',
              url: 'https://www.traumameasures.com'
            },
            {
              name: 'National Center for PTSD — Complex Trauma',
              description: 'VA/DoD clinical resources on complex trauma, including free training materials, assessment tools, and clinician guides.',
              url: 'https://www.ptsd.va.gov/professional/treat/type/complex_trauma.asp'
            },
            {
              name: 'Herman, J.L. (1992). Trauma and Recovery — Foundation Text',
              description: 'Judith Herman\'s foundational text introducing the concept of Complex PTSD and the three-phase treatment model. Essential reading for any clinician working with complex trauma survivors.',
              url: 'https://www.basicbooks.com/titles/judith-l-herman/trauma-and-recovery/9780465087303/'
            },
            {
              name: 'SAMHSA Trauma-Informed Care in Behavioral Health Services (TIP 57)',
              description: 'Free comprehensive clinical guide for trauma-informed assessment and treatment, including extensive material on complex trauma presentations.',
              url: 'https://store.samhsa.gov/product/trauma-informed-care-behavioral-health-services/SMA14-4816'
            },
            {
              name: 'IFS Institute — Internal Family Systems Resources',
              description: 'Training, consultation, and clinical resources for Internal Family Systems therapy, including applications to complex trauma and C-PTSD.',
              url: 'https://ifs-institute.com'
            },
            {
              name: 'Seeking Safety: A Treatment Manual for PTSD and Substance Abuse',
              description: 'Empirically validated integrated treatment for co-occurring PTSD and substance use, well-suited for Phase 1 stabilization in C-PTSD with substance use presentations.',
              url: 'https://www.treatment-innovations.org/seeking-safety.html'
            }
          ],
          accessibility: { ariaLabel: 'Complex PTSD treatment resources', role: 'complementary' }
        },
        {
          type: 'keyTakeaway',
          title: 'Key Takeaways',
          takeaways: [
            'The therapeutic relationship in C-PTSD work is simultaneously the most powerful therapeutic tool and the most complex clinical terrain — clients\' relational disturbance features activate in and through the therapeutic relationship itself.',
            'Rupture and repair — when the therapist fails, names it, takes responsibility, and repairs — is one of the most potent interventions in C-PTSD, providing direct experiential evidence that relationships can survive imperfection.',
            'Trauma enactments are inevitable in deep complex trauma work; the clinician\'s capacity to recognize and step out of the enactment — naming it as clinical material — transforms it from a replication of trauma into a vehicle for healing.',
            'Vicarious traumatization is an occupational hazard requiring active prevention through caseload balance, regular supervision, peer consultation, and personal self-care practices.',
            'Socially-informed C-PTSD treatment recognizes systemic oppression as an active source of ongoing traumatic stress, attends to therapeutic relationship power dynamics, and integrates advocacy alongside internal regulation work.'
          ]
        }
      ]
    }
  ],
  assessment: {
    title: 'Final Assessment — CR-TRM-501: Complex PTSD: Diagnosis, Formulation, and Phase-Based Treatment',
    passingScore: 80,
    maxAttempts: 3,
    shuffleQuestions: true,
    questions: [
      {
        type: 'multipleChoice',
        question: 'Which of the following BEST describes what distinguishes ICD-11 Complex PTSD from standard PTSD?',
        options: [
          { text: 'C-PTSD requires more severe individual traumatic events', isCorrect: false },
          { text: 'C-PTSD requires all PTSD symptom clusters PLUS three disturbances in self-organization: affect dysregulation, negative self-concept, and relational disturbances', isCorrect: true },
          { text: 'C-PTSD does not require avoidance symptoms', isCorrect: false },
          { text: 'C-PTSD can only be diagnosed when childhood abuse is documented', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'ICD-11 C-PTSD requires all standard PTSD criteria PLUS all three disturbances in self-organization (DSO). The exposure requirement is prolonged, inescapable trauma — not necessarily childhood abuse specifically. Avoidance is required in both PTSD and C-PTSD.'
      },
      {
        type: 'multipleChoice',
        question: 'Which three disturbances in self-organization (DSO) are required for an ICD-11 C-PTSD diagnosis?',
        options: [
          { text: 'Dissociation, hypervigilance, and avoidance', isCorrect: false },
          { text: 'Affect dysregulation, negative self-concept, and disturbances in relational functioning', isCorrect: true },
          { text: 'Identity confusion, impulsivity, and suicidal behavior', isCorrect: false },
          { text: 'Intrusive memories, emotional numbing, and sleep disturbance', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'The three DSO features are: (1) affect dysregulation, (2) persistent negative self-concept, and (3) disturbances in relational functioning. All three must be present and functionally impairing. Dissociation, hypervigilance, and avoidance are PTSD features; identity confusion, impulsivity, and suicidal behavior are BPD features.'
      },
      {
        type: 'multipleChoice',
        question: 'How is Complex PTSD currently handled within the DSM-5 diagnostic system?',
        options: [
          { text: 'It is listed as a specifier of PTSD ("PTSD with prominent dissociative symptoms")', isCorrect: false },
          { text: 'It is recognized as a distinct category in DSM-5 Section III (emerging measures)', isCorrect: false },
          { text: 'It is not a recognized DSM-5 diagnosis; it is an ICD-11 category; DSM-5 clinicians use PTSD or co-occurring diagnoses', isCorrect: true },
          { text: 'It replaced borderline personality disorder in the DSM-5 revision', isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: 'C-PTSD is recognized in ICD-11 but NOT in DSM-5. Clinicians in DSM-5 settings typically document C-PTSD in their formulation while coding PTSD and any co-occurring conditions. The DSM-5 "with prominent dissociative symptoms" specifier is not equivalent to ICD-11 C-PTSD, which requires the full DSO cluster.'
      },
      {
        type: 'multipleChoice',
        question: 'Which feature SPECIFICALLY distinguishes C-PTSD from borderline personality disorder (BPD) per ICD-11 diagnostic criteria?',
        options: [
          { text: 'C-PTSD does not involve self-harm', isCorrect: false },
          { text: 'C-PTSD requires all three standard PTSD symptom clusters (re-experiencing, avoidance, hyperarousal)', isCorrect: true },
          { text: 'C-PTSD only occurs in women', isCorrect: false },
          { text: 'BPD is always preceded by a single discrete traumatic event', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'A key diagnostic differentiator: C-PTSD requires all three standard PTSD symptom clusters. BPD does not require PTSD symptoms. C-PTSD also differs from BPD in that it involves hypoarousal/numbing alongside hyperreactivity and does not require frantic abandonment-avoidance or identity confusion as diagnostic criteria.'
      },
      {
        type: 'multipleChoice',
        question: 'What is the evidence-based sequencing standard for C-PTSD treatment?',
        options: [
          { text: 'Begin trauma processing immediately to prevent avoidance from entrenching', isCorrect: false },
          { text: 'Use medication first to stabilize symptoms before any psychotherapy', isCorrect: false },
          { text: 'Phase-based treatment: stabilization and skill-building (Phase 1) before trauma processing (Phase 2) before integration (Phase 3)', isCorrect: true },
          { text: 'Address personality disorder features first, then trauma processing if PTSD remains', isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: 'Phase-based treatment — with stabilization preceding processing and integration — is the evidence-based and clinical standard of care for C-PTSD endorsed by ISSTD, ISTSS, NICE, and other major professional bodies. Premature Phase 2 risks decompensation, crisis, and alliance rupture. The phase sequence reflects both neurobiological and relational realities of complex trauma treatment.'
      },
      {
        type: 'multipleChoice',
        question: 'Which clinical indicator MOST strongly suggests a C-PTSD client is ready to transition from Phase 1 to Phase 2 trauma processing?',
        options: [
          { text: 'The client has been in therapy for at least one year', isCorrect: false },
          { text: 'The client expresses strong motivation to "finally deal with what happened"', isCorrect: false },
          { text: 'PCL-5 score has dropped below the PTSD diagnostic threshold', isCorrect: false },
          { text: 'Consistent ability to regulate arousal within the window of tolerance using internalized stabilization skills', isCorrect: true }
        ],
        correctAnswer: 3,
        explanation: 'Phase 2 readiness is determined by demonstrated stabilization capacities: consistent arousal regulation within the window of tolerance, reliable use of grounding and distress tolerance skills, no recent self-harm, and a robust therapeutic alliance. Time in treatment and client motivation are not readiness indicators — clinical functioning is.'
      },
      {
        type: 'multipleChoice',
        question: 'Judith Herman\'s Phase 3 of complex trauma treatment is primarily characterized by which clinical tasks?',
        options: [
          { text: 'Exposure to feared stimuli and habituation to trauma memories', isCorrect: false },
          { text: 'Grounding skills, stabilization, and crisis planning', isCorrect: false },
          { text: 'Narrative integration, identity consolidation, relational reconstruction, and meaning-making', isCorrect: true },
          { text: 'Pharmacological management and symptom monitoring', isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: 'Herman\'s Phase 3 (Reconnection) involves integrating the trauma narrative into a coherent autobiographical identity, consolidating a stable sense of self, rebuilding relational connections, and constructing meaning from the traumatic experience. These tasks represent the integration goals of treatment after stabilization and processing have been addressed.'
      },
      {
        type: 'multipleChoice',
        question: 'What is a "trauma enactment" in the context of C-PTSD therapy?',
        options: [
          { text: 'When the client narrates a traumatic event during a processing session', isCorrect: false },
          { text: 'When the client-therapist interaction begins to replicate the traumatic relational dynamic, with the therapist taking on a role (perpetrator, rescuer, abandoner) from the original trauma', isCorrect: true },
          { text: 'When the therapist uses role play to help the client rehearse new relational behaviors', isCorrect: false },
          { text: 'When the client re-experiences trauma symptoms during an EMDR session', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'A trauma enactment is when the therapeutic relationship begins to replicate the traumatic relational dynamic — the therapist unknowingly takes on a role (perpetrator, rescuer, abandoner, bystander) from the client\'s original traumatic context. Recognizing and stepping out of the enactment, naming it, and using it as clinical material is the therapeutic response.'
      },
      {
        type: 'multipleChoice',
        question: 'Which validated instrument is specifically designed to assess ICD-11 C-PTSD, including all three disturbances in self-organization?',
        options: [
          { text: 'PCL-5', isCorrect: false },
          { text: 'Child Trauma Questionnaire (CTQ)', isCorrect: false },
          { text: 'International Trauma Questionnaire (ITQ)', isCorrect: true },
          { text: 'Dissociative Experiences Scale (DES)', isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: 'The ITQ is specifically designed to assess both PTSD and Complex PTSD per ICD-11 criteria, including the three DSO features. The PCL-5 assesses DSM-5 PTSD symptom severity; the CTQ assesses childhood maltreatment history; the DES assesses dissociation. The ITQ is freely available and is the preferred instrument for ICD-11 C-PTSD assessment.'
      },
      {
        type: 'multipleChoice',
        question: 'Pearlman and Saakvitne\'s concept of vicarious traumatization describes:',
        options: [
          { text: 'A client\'s trauma response that develops from hearing others\' trauma stories', isCorrect: false },
          { text: 'The cumulative transformation of the therapist\'s inner world through empathic engagement with clients\' trauma material', isCorrect: true },
          { text: 'The therapist\'s secondary PTSD that develops from personal trauma history activated by clinical work', isCorrect: false },
          { text: 'Client-to-client trauma transmission in group therapy settings', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'Vicarious traumatization (VT) describes the cumulative transformation of the therapist\'s inner world — specifically their schemas about safety, trust, power, esteem, and intimacy — through repeated empathic engagement with clients\' traumatic material. It is distinct from secondary traumatic stress (acute PTSD-like symptoms from single exposures) and burnout (depletion from work overload).'
      },
      {
        type: 'multiSelect',
        question: 'Which of the following are required components of Phase 1 stabilization for C-PTSD, per the phase-based treatment model? Select ALL that apply.',
        options: [
          { text: 'External safety establishment (freedom from ongoing abuse)', isCorrect: true },
          { text: 'Arousal regulation skills for both hyperarousal and hypoarousal', isCorrect: true },
          { text: 'Trauma memory processing through prolonged exposure', isCorrect: false },
          { text: 'Affect tolerance building (ability to experience emotions without shutdown or flooding)', isCorrect: true },
          { text: 'Psychoeducation about trauma and the nervous system', isCorrect: true }
        ],
        explanation: 'Phase 1 stabilization requires: establishing external safety, building arousal regulation skills, developing affect tolerance, managing dissociation, psychoeducation, and building therapeutic alliance. Trauma memory processing (prolonged exposure or other Phase 2 modalities) is explicitly NOT part of Phase 1 — it is the central task of Phase 2, which begins only after Phase 1 completion.'
      },
      {
        type: 'multiSelect',
        question: 'Which evidence-based interventions have been shown to specifically target the disturbances in self-organization (DSO) features of C-PTSD? Select ALL that apply.',
        options: [
          { text: 'STAIR (Skills Training in Affective and Interpersonal Regulation)', isCorrect: true },
          { text: 'DBT emotion regulation and interpersonal effectiveness modules', isCorrect: true },
          { text: 'Schema Therapy', isCorrect: true },
          { text: 'Standard Prolonged Exposure (unmodified)', isCorrect: false },
          { text: 'Internal Family Systems (IFS)', isCorrect: true }
        ],
        explanation: 'STAIR, DBT, Schema Therapy, and IFS specifically address the DSO features: affect dysregulation, negative self-concept, and relational disturbances. Standard Prolonged Exposure is primarily a trauma memory processing intervention and does not target DSO features; it is often insufficient as stand-alone treatment for C-PTSD without Phase 1 preparation and DSO-specific supplementation.'
      },
      {
        type: 'multiSelect',
        question: 'Which features characterize the "helpless-helper" trauma enactment dynamic? Select ALL that apply.',
        options: [
          { text: 'Client presents as completely dependent and helpless', isCorrect: true },
          { text: 'Therapist increasingly takes on responsibility and works harder to compensate', isCorrect: true },
          { text: 'Therapist eventually burns out or sets firm limits', isCorrect: true },
          { text: 'Client experiences the therapist\'s limits as the expected abandonment', isCorrect: true },
          { text: 'Client responds by immediately forming a secure attachment with the therapist', isCorrect: false }
        ],
        explanation: 'The helpless-helper dynamic is a complete enactment cycle: the client\'s trauma-organized helplessness pulls for the therapist to over-function, the therapist eventually burns out or sets limits, and the client experiences this as the expected abandonment from their relational history — replicating rather than disconfirming the traumatic relational template. The client does not typically form secure attachment in this dynamic; the enactment must be recognized and interrupted first.'
      },
      {
        type: 'multiSelect',
        question: 'Which of the following reflect socially-informed considerations for C-PTSD treatment? Select ALL that apply.',
        options: [
          { text: 'Recognizing systemic oppression as an active ongoing source of traumatic stress, not mere background context', isCorrect: true },
          { text: 'Acknowledging that some affect dysregulation may reflect realistic threat appraisal rather than trauma distortion', isCorrect: true },
          { text: 'Focusing exclusively on internal self-regulation as the only appropriate clinical target', isCorrect: false },
          { text: 'Attending to power dynamics in the therapeutic relationship', isCorrect: true },
          { text: 'Integrating advocacy and resource connection into the treatment frame alongside clinical intervention', isCorrect: true }
        ],
        explanation: 'Socially-informed C-PTSD treatment: recognizes systemic oppression as ongoing trauma, validates realistic threat appraisal, attends to therapeutic relationship power dynamics, and integrates advocacy. It does NOT restrict focus to internal regulation — doing so implicitly locates the problem within the individual and delegitimizes the reality of ongoing systemic harm.'
      },
      {
        type: 'multiSelect',
        question: 'Which elements should be included in a trauma-informed clinical formulation for C-PTSD? Select ALL that apply.',
        options: [
          { text: 'Trauma history including duration, relational context, and buffering resources', isCorrect: true },
          { text: 'Developmental impact on attachment, self-concept, and affect regulation', isCorrect: true },
          { text: 'Current DSO symptom presentations and functional impairment', isCorrect: true },
          { text: 'Listing only DSM-5 diagnoses without contextual interpretation', isCorrect: false },
          { text: 'Resilience resources, strengths, and protective factors', isCorrect: true }
        ],
        explanation: 'A complete trauma-informed C-PTSD formulation covers: trauma history (duration, context, buffering), developmental impact, current DSO and PTSD presentations with functional impairment, and resilience resources/protective factors. A formulation limited only to DSM-5 diagnosis codes without contextual narrative fails to capture the complexity and coherence of the C-PTSD presentation that guides individualized treatment planning.'
      }
    ]
  },
  references: [
    'Herman, J. L. (1992). Trauma and recovery: The aftermath of violence — from domestic abuse to political terror. Basic Books.',
    'World Health Organization. (2018). International classification of diseases, 11th revision (ICD-11). https://icd.who.int/',
    'Cloitre, M., Garvert, D. W., Brewin, C. R., Bryant, R. A., & Maercker, A. (2013). Evidence for proposed ICD-11 PTSD and complex PTSD: A latent profile analysis. European Journal of Psychotraumatology, 4(1), 20706. https://doi.org/10.3402/ejpt.v4i0.20706',
    'Cloitre, M., Shevlin, M., Brewin, C. R., Bisson, J. I., Roberts, N. P., Maercker, A., Karatzias, T., & Hyland, P. (2018). The International Trauma Questionnaire: Development of a self-report measure of ICD-11 PTSD and complex PTSD. Acta Psychiatrica Scandinavica, 138(6), 536–546. https://doi.org/10.1111/acps.12956',
    'Cloitre, M., Stovall-McClough, K. C., Nooner, K., Zorbas, P., Cherry, S., Jackson, C. L., Gan, W., & Petkova, E. (2010). Treatment for PTSD related to childhood abuse: A randomized controlled trial. American Journal of Psychiatry, 167(8), 915–924. https://doi.org/10.1176/appi.ajp.2010.09081247',
    'van der Hart, O., Nijenhuis, E. R. S., & Steele, K. (2006). The haunted self: Structural dissociation and the treatment of chronic traumatization. W.W. Norton & Company.',
    'Porges, S. W. (2011). The polyvagal theory: Neurophysiological foundations of emotions, attachment, communication, and self-regulation. W.W. Norton & Company.',
    'Siegel, D. J. (1999). The developing mind: How relationships and the brain interact to shape who we are. Guilford Press.',
    'Pearlman, L. A., & Saakvitne, K. W. (1995). Trauma and the therapist: Countertransference and vicarious traumatization in psychotherapy with incest survivors. W.W. Norton & Company.',
    'Schwartz, R. C. (1995). Internal family systems therapy. Guilford Press.',
    'Linehan, M. M. (2015). DBT skills training manual (2nd ed.). Guilford Press.',
    'Shapiro, F. (2018). Eye movement desensitization and reprocessing (EMDR) therapy: Basic principles, protocols, and procedures (3rd ed.). Guilford Press.',
    'Ogden, P., Minton, K., & Pain, C. (2006). Trauma and the body: A sensorimotor approach to psychotherapy. W.W. Norton & Company.',
    'Tedeschi, R. G., & Calhoun, L. G. (1996). The posttraumatic growth inventory: Measuring the positive legacy of trauma. Journal of Traumatic Stress, 9(3), 455–471. https://doi.org/10.1007/BF02103658',
    'International Society for the Study of Trauma and Dissociation. (2011). Guidelines for treating dissociative identity disorder in adults, third revision. Journal of Trauma & Dissociation, 12(2), 115–187. https://doi.org/10.1080/15299732.2011.537247',
    'van der Kolk, B. A. (2014). The body keeps the score: Brain, mind, and body in the healing of trauma. Viking Press.',
    'Hyland, P., Shevlin, M., Brewin, C. R., Cloitre, M., Downes, A. J., Jumbe, S., Karatzias, T., Bisson, J. I., & Roberts, N. P. (2017). Distinguishing PTSD and complex PTSD: Latent class analysis in a clinical sample. Journal of Psychiatric Research, 159, 178–184. https://doi.org/10.1016/j.jpsychires.2017.04.012',
    'SAMHSA. (2014). Trauma-informed care in behavioral health services (TIP 57). Substance Abuse and Mental Health Services Administration. https://store.samhsa.gov/product/SMA14-4816'
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
