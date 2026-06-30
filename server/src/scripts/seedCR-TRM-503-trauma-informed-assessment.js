import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }
const SLUG = 'cr-trm-503-trauma-informed-assessment';

const COURSE = {
  courseCode: 'CR-TRM-503',
  title: 'Trauma-Informed Assessment: Beyond the ACE Score',
  slug: SLUG,
  description: 'This course equips licensed mental health professionals with a comprehensive, multidimensional framework for trauma-informed assessment. Participants will move beyond the ACE questionnaire to understand developmental trauma trajectories, somatic and dissociative presentations, cultural considerations, and integrative tools for building a complete trauma picture that informs treatment planning.',
  ceHours: 2,
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
    hourBreakdown: [{ label: 'core', hours: 2 }]
  }],
  isPublished: false,
  status: 'draft',
  difficulty: 'intermediate',
  targetAudience: 'Licensed mental health professionals (LPCs, LCSWs, LMFTs, NCCs)',
  learningObjectives: [
    'Articulate the limitations of ACE score-only approaches to trauma assessment',
    'Apply a multidimensional framework encompassing developmental, relational, somatic, and cultural trauma domains',
    'Identify somatic indicators and dissociative markers in clinical assessment contexts',
    'Integrate validated trauma screening tools (PCL-5, CTQ, DAST, TSI-2) into comprehensive intake processes',
    'Adapt trauma assessment approaches for diverse cultural backgrounds and avoid re-traumatization'
  ],
  sections: [
    {
      title: 'Introduction: The Limits of Screening and the Promise of Assessment',
      sectionNumber: 1,
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'Introduction: The Limits of Screening and the Promise of Assessment',
          subtitle: 'Why a single score is never the whole story',
          sectionNumber: 1
        },
        {
          type: 'text',
          content: `<p>The ACEs (Adverse Childhood Experiences) study, published in 1998 by Felitti and colleagues, fundamentally transformed how medicine and mental health understood the long-term impact of childhood adversity. By demonstrating a dose-response relationship between cumulative childhood trauma and adult health outcomes — including depression, substance use, cardiovascular disease, and early death — the study gave clinicians a language and a number: the ACE score. A score of 4 or higher came to signal elevated risk, and the 10-item questionnaire became one of the most widely used screening tools in primary care, behavioral health, child welfare, and juvenile justice settings.</p>
<p>Yet the ACE score, for all its public health utility, is a blunt instrument. It tells you <em>that</em> adversity occurred; it says relatively little about <em>how</em> that adversity was processed, buffered, or compounded. Two clients with identical ACE scores of 6 may present in clinically opposite ways: one has robust social support, secure attachment history, and adaptive coping — the other experienced adversity in isolation, within a chaotic and unpredictable caregiving environment, without any buffering relationships. Their risk profiles, their clinical presentations, and their treatment needs are profoundly different, yet the ACE score collapses this complexity into a single integer.</p>
<p>This course is designed to help licensed mental health clinicians move beyond the ACE score into a genuinely comprehensive, trauma-informed assessment practice. That does not mean abandoning the ACE questionnaire — it remains a useful psychoeducational tool and can open important conversations. But it does mean situating ACE data within a much larger clinical picture that includes developmental context, attachment history, the quality and timing of caregiving relationships, somatic and autonomic presentations, dissociative experiences, cultural influences on disclosure and symptom expression, and validated multidomain screening measures that the ACE alone does not capture.</p>
<p>The course is organized around three major content areas. Section 2 examines the architecture of trauma-informed assessment: what domains must be covered, which validated instruments support each domain, and how to structure an intake that gathers rich data without re-traumatizing the client. Section 3 addresses clinical nuance: somatic and dissociative presentations that often fly under the radar in standard diagnostic interviewing, cultural competence in trauma disclosure, and the ethics of documentation and sharing trauma history. Together, these sections provide a practical blueprint for assessment that truly honors the complexity of traumatic experience.</p>`
        },
        {
          type: 'videoEmbed',
          title: 'The ACE Study: Legacy and Limitations',
          videoUrl: 'https://www.youtube.com/embed/95ovIJ3dsNk',
          description: 'An overview of the original ACE study findings and how the field has moved beyond them toward comprehensive trauma-informed assessment.',
          accessibility: { ariaLabel: 'Video: The ACE Study — Legacy and Limitations', role: 'complementary' }
        },
        {
          type: 'imageText',
          title: 'Assessment as Relationship, Not Data Collection',
          content: `<p>Trauma-informed assessment is not a checklist administered to extract information — it is a relational process that models safety, respect, and attunement from the very first contact. How questions are asked matters as much as which questions are asked. The goal is to understand the person's full lived experience while reinforcing the therapeutic relationship that will anchor treatment.</p>`,
          image: '',
          imageAlt: 'Clinician and client in a collaborative conversation, assessment tools visible on desk',
          imagePosition: 'right'
        }
      ]
    },
    {
      title: 'A Multidimensional Framework for Trauma Assessment',
      sectionNumber: 2,
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'A Multidimensional Framework for Trauma Assessment',
          subtitle: 'Developmental context, attachment, validated instruments, and somatic awareness',
          sectionNumber: 2
        },
        {
          type: 'text',
          content: `<p>A truly comprehensive trauma assessment covers at minimum six interconnected domains: (1) trauma exposure history, (2) developmental and attachment context, (3) current symptom burden across PTSD, dissociative, depressive, anxiety, and somatic spectrums, (4) functional impairment in relational, occupational, and daily living domains, (5) protective factors and resilience resources, and (6) cultural context that shapes both the experience of trauma and its expression in clinical settings. ACE screening addresses only the first domain — and even there incompletely, since it misses adult traumatic experiences, community violence, systemic oppression, and interpersonal trauma outside the household.</p>
<p><strong>Domain 1: Trauma Exposure History.</strong> The ACE questionnaire covers 10 categories of childhood adversity including physical, emotional, and sexual abuse; household substance use, mental illness, incarceration, and domestic violence; and emotional and physical neglect. Clinicians extending this domain should additionally assess: adult interpersonal violence (intimate partner violence, sexual assault), community violence, accidents and medical trauma, grief and loss, systemic oppression (racism, homophobia, transphobia, poverty), and vicarious trauma through occupational exposure. The Traumatic Life Events Questionnaire (TLEQ) and the Life Events Checklist (LEC-5) are validated tools for adult lifetime exposure inventories. For children and adolescents, the UCLA PTSD Reaction Index and the Child Trauma Screening Questionnaire (CTSQ) are well-validated options. Importantly, trauma exposure questions should be framed in behavioral language ("Did you ever witness someone being hurt badly?") rather than interpretive language ("Were you abused?"), because clients may not self-identify as abuse survivors even when experiences clearly meet clinical criteria.</p>
<p><strong>Domain 2: Developmental and Attachment Context.</strong> The timing, duration, and relational context of trauma exposures significantly shape their neurobiological and psychological impact. Early childhood trauma during critical sensitive periods of brain development — particularly the first three years, when attachment systems are being established — carries different neurobiological signatures than trauma occurring in late adolescence. Clinicians should gather a developmental history that includes: the quality and consistency of early caregiving relationships, separations and losses in early childhood, attachment disruptions (prolonged hospitalizations, foster care placements, parental addiction or mental illness affecting availability), and the presence or absence of protective buffering relationships. The Child Trauma Questionnaire (CTQ) assesses five subtypes of early maltreatment and provides severity ratings across emotional and physical abuse and neglect, and sexual abuse. Attachment style can be informally assessed through questions about early relationships and is predictive of therapeutic alliance and treatment engagement.</p>
<p><strong>Domain 3: Current Symptom Burden.</strong> The PTSD Checklist for DSM-5 (PCL-5) is the gold-standard self-report measure for PTSD symptom severity and is freely available from the National Center for PTSD. It assesses all four symptom clusters: intrusion, avoidance, negative cognitions and mood, and hyperarousal. For complex PTSD (ICD-11 diagnosis), the International Trauma Questionnaire (ITQ) also assesses disturbances in self-organization — affect dysregulation, negative self-concept, and relational disturbances — that are not captured by the PCL-5. Dissociative symptoms warrant separate screening using the Dissociative Experiences Scale (DES) or the Multiscale Dissociation Inventory (MDI); these symptoms are frequently missed in standard diagnostic interviewing. Co-occurring depression and anxiety require parallel assessment; the PHQ-9 and GAD-7 are efficient and well-validated for these constructs. For clients with trauma-related substance use, the Drug Abuse Screening Test (DAST-10) and AUDIT provide efficient screening, with the reminder that substance use in trauma contexts often represents affect regulation rather than primary addiction.</p>
<p><strong>Domain 4: Functional Impairment and Strengths.</strong> Standardized assessment of functional impairment is often neglected in favor of symptom checklists, yet functional data is essential for understanding severity, for insurance documentation, and for tracking treatment progress. The World Health Organization Disability Assessment Schedule (WHODAS 2.0) is a freely available, cross-diagnostic functional assessment tool. Equally important — and more frequently omitted — is systematic documentation of resilience resources and protective factors. Research consistently demonstrates that post-traumatic growth, social support quality, spirituality, and meaning-making capacity are among the most robust predictors of recovery trajectory. The Connor-Davidson Resilience Scale (CD-RISC-25) and the Brief Resilience Scale (BRS) are validated options for quantifying resilience resources. Integrating strengths assessment transforms the clinical formulation from a deficit inventory to a whole-person narrative.</p>`
        },
        {
          type: 'callout',
          title: 'Clinical Best Practice: Pacing and Titration in Trauma Assessment',
          calloutType: 'clinical',
          content: `<p>Comprehensive trauma assessment does not need to happen in a single session. For clients with complex or chronic trauma histories, distributing assessment across two to three initial sessions allows time for rapport building, pacing difficult disclosures, and attending to client window of tolerance. Begin with less activating material (current symptoms, functional status, strengths) and move toward detailed trauma exposure history only when the therapeutic relationship provides sufficient safety. Always end assessment sessions with stabilization and grounding to prevent clients from leaving dysregulated.</p>`
        },
        {
          type: 'text',
          content: `<p><strong>Domain 5: Protective Factors and Resilience.</strong> Resilience in the face of trauma is not luck or innate character — it is shaped by identifiable, assessable factors. Werner and Smith's longitudinal Kauai Resilience Study identified three broad categories of protective factors: individual characteristics (easy temperament, intelligence, internal locus of control, sense of humor), family factors (at least one close attachment bond, family cohesion, authoritative parenting), and community/social factors (mentors, peer relationships, connection to religious or cultural institutions). For clinicians, assessing these protective factors is not ancillary to trauma assessment — it is integral to case conceptualization and treatment planning. A client with moderate PTSD severity but strong social support, stable housing, and meaningful occupational engagement has a very different prognosis than a client with moderate PTSD severity who is socially isolated, housing-insecure, and occupationally impaired. The clinical response to each must differ accordingly.</p>
<p><strong>Domain 6: Cultural Context.</strong> Trauma is never experienced in a cultural vacuum, and trauma assessment that ignores cultural context will systematically miss, misinterpret, or pathologize normative responses to adversity within specific cultural frameworks. Cultural factors influence: what counts as traumatic (not universal across cultures), whether and how trauma is disclosed (many cultures have strong norms against disclosing family matters to outsiders), how symptoms are expressed (somatic equivalents of depression and anxiety are more prominent in many East Asian, South Asian, and Latinx clinical presentations), how healing is conceptualized (community and spiritual frameworks often displace or supplement individual therapy), and the degree to which systemic oppression is itself a source of ongoing traumatic stress. Lewis-Fernández and colleagues' Cultural Formulation Interview (CFI), developed for DSM-5, provides a structured protocol for gathering cultural context. Clinicians should at minimum ask about cultural explanatory models of distress, preferred terms for describing emotional suffering, family and community expectations about help-seeking, and prior experiences with mental health care that may have been culturally invalidating.</p>
<p>Taken together, these six domains constitute a trauma assessment architecture that is genuinely comprehensive — one that can support a clinical formulation, a DSM-5 diagnostic picture, a treatment plan tailored to the individual's strengths and needs, and ongoing monitoring of progress across multiple dimensions. The validated instruments referenced above are not meant to be administered all at once; they are a toolkit from which clinicians select based on the client's presenting concerns, the time available, and the clinical relationship. A judicious selection of two or three validated measures, integrated with skilled clinical interviewing, will yield far more clinically useful data than an ACE score alone.</p>`
        },
        {
          type: 'accordion',
          accordionItems: [
            {
              title: 'PCL-5 (PTSD Checklist for DSM-5)',
              content: '<p>The PCL-5 is a 20-item self-report measure assessing DSM-5 PTSD symptom severity over the past month. It can be used as a screener (cutoff score of 33), for provisional PTSD diagnosis, or to monitor symptom change over time. It is freely available at the National Center for PTSD website (ptsd.va.gov) and requires no license for clinical use. Administration time is approximately 5–10 minutes.</p>'
            },
            {
              title: 'Dissociative Experiences Scale (DES)',
              content: '<p>The DES is a 28-item self-report scale assessing the frequency of dissociative experiences across absorption, depersonalization/derealization, and amnesia domains. A DES-Taxon score ≥30 suggests pathological dissociation warranting further evaluation. The DES is especially important in complex trauma presentations, where dissociation is common but often underassessed. A brief 8-item version (DES-II) is available for screening contexts.</p>'
            },
            {
              title: 'International Trauma Questionnaire (ITQ)',
              content: '<p>The ITQ assesses both PTSD (6 items covering re-experiencing, avoidance, and hyperarousal) and Complex PTSD per ICD-11 criteria (6 additional items covering disturbances in self-organization: affect dysregulation, negative self-concept, and relational disturbances). It is especially valuable when complex trauma histories suggest C-PTSD, which is not diagnosable under DSM-5 but provides important treatment planning guidance. Freely available at traumameasures.net.</p>'
            },
            {
              title: 'Child Trauma Questionnaire (CTQ)',
              content: '<p>The CTQ is a 28-item retrospective self-report measure assessing five types of childhood maltreatment: emotional, physical, and sexual abuse, and emotional and physical neglect. Each subscale yields a severity score. It is particularly useful for adult clients whose ACE screening is positive but vague, as it provides more granular severity information. The CTQ has strong psychometric properties and is validated across diverse populations. A licensing fee is required for use.</p>'
            },
            {
              title: 'Cultural Formulation Interview (CFI)',
              content: '<p>The CFI is a 16-question structured interview developed for DSM-5 to assess cultural factors affecting clinical presentations. It explores cultural identity, explanatory models of illness, cultural and psychosocial stressors, cultural elements of the clinician-client relationship, and cultural influences on treatment-seeking. A supplementary informant version and a pediatric version are available. The CFI is freely available in the DSM-5 appendix and online from the American Psychiatric Association.</p>'
            }
          ]
        },
        {
          type: 'imageText',
          title: 'The Trauma Assessment Map',
          content: `<p>A visual representation of the six assessment domains — exposure, developmental context, symptom burden, functional impairment, protective factors, and cultural context — helps clinicians and clients alike understand that trauma assessment is an ecological process, not a symptom checklist. Using a diagram in session normalizes the complexity of trauma and communicates that the clinician understands trauma as more than a list of bad things that happened.</p>`,
          image: '',
          imageAlt: 'Six-domain trauma assessment framework depicted as interconnected hexagons',
          imagePosition: 'left'
        },
        {
          type: 'multipleChoice',
          question: 'Which validated instrument is MOST specifically designed to assess complex PTSD per ICD-11 criteria, including disturbances in self-organization?',
          options: [
            { text: 'PCL-5', isCorrect: false },
            { text: 'International Trauma Questionnaire (ITQ)', isCorrect: true },
            { text: 'Dissociative Experiences Scale (DES)', isCorrect: false },
            { text: 'Child Trauma Questionnaire (CTQ)', isCorrect: false }
          ],
          correctAnswer: 1,
          explanation: 'The ITQ assesses both PTSD and Complex PTSD per ICD-11 criteria, specifically measuring disturbances in self-organization (affect dysregulation, negative self-concept, relational disturbances) that the PCL-5 does not capture. The PCL-5 is DSM-5 PTSD-specific; the DES assesses dissociation; the CTQ assesses childhood maltreatment history.'
        },
        {
          type: 'text',
          content: `<p>One of the most clinically important shifts in trauma-informed assessment practice is moving from categorical thinking ("Does this person have PTSD?") to dimensional and transdiagnostic thinking ("What is the nature, severity, and impact of this person's trauma responses across multiple symptom domains?"). This matters because trauma's clinical sequelae rarely follow diagnostic categories neatly. A survivor of chronic childhood emotional abuse and neglect may present with a constellation of symptoms that spans PTSD, complex PTSD, depressive disorder, generalized anxiety, somatic symptom disorder, and borderline personality disorder features — without clearly meeting criteria for any single diagnosis and yet being significantly impaired by the whole picture.</p>
<p>Transdiagnostic assessment frameworks like the PTSD, Anxiety, and Depression Assessment (PADA) or the Structured Clinical Interview for DSM-5 (SCID-5) can help clinicians map the full landscape. But even without formal structured interviews, clinical thinking should track how traumatic experiences have affected mood regulation, self-concept, interpersonal functioning, somatic experience, and sense of safety in the world — not only the four symptom clusters of DSM-5 PTSD. This richer clinical picture is what distinguishes a trauma-informed formulation from a diagnostic checklist.</p>
<p>Documentation of the trauma-informed assessment deserves careful attention. Clinical records serve multiple purposes simultaneously: they guide treatment, support insurance billing, may be disclosed in legal proceedings, and can be accessed by the client. Trauma disclosure in a chart carries specific risks: it can become a barrier to employment, military service, or custody determinations if records are subpoenaed. Clinicians should document the functional impact of trauma and the clinical formulation rather than exhaustive trauma inventories. "Client reports chronic stress and loss during childhood that affects current affect regulation and relational functioning" is often more appropriate than a verbatim account of specific traumatic events. Document enough to justify treatment; document thoughtfully enough to protect the client.</p>`
        },
        {
          type: 'flashcardDeck',
          instructions: 'Review these validated trauma assessment instruments and their primary assessment targets.',
          flashcards: [
            { front: 'PCL-5', back: 'PTSD symptom severity per DSM-5; 20 items; screener cutoff 33; free from VA National Center for PTSD' },
            { front: 'ITQ (International Trauma Questionnaire)', back: 'PTSD + Complex PTSD per ICD-11; measures disturbances in self-organization; free at traumameasures.net' },
            { front: 'DES (Dissociative Experiences Scale)', back: 'Pathological dissociation (absorption, depersonalization, amnesia); DES-Taxon ≥30 suggests pathological dissociation' },
            { front: 'CTQ (Child Trauma Questionnaire)', back: 'Childhood maltreatment history and severity across 5 subtypes (emotional/physical/sexual abuse, emotional/physical neglect); requires license' },
            { front: 'LEC-5 (Life Events Checklist)', back: 'Lifetime trauma exposure inventory; identifies events meeting Criterion A for PTSD; paired with PCL-5 for comprehensive PTSD assessment' },
            { front: 'CFI (Cultural Formulation Interview)', back: 'Cultural factors in clinical presentation; 16 questions covering explanatory models, stressors, cultural identity, help-seeking; free from APA' },
            { front: 'WHODAS 2.0', back: 'WHO Disability Assessment Schedule; cross-diagnostic functional impairment across 6 domains; freely available; tracks treatment progress' },
            { front: 'CD-RISC-25', back: 'Connor-Davidson Resilience Scale; 25 items assessing resilience capacity; scores protective factors essential to treatment planning' }
          ],
          accessibility: { ariaLabel: 'Flashcard deck: Trauma assessment instruments', role: 'application' }
        },
        {
          type: 'multiSelect',
          question: 'Which of the following are limitations of the ACE questionnaire that a comprehensive trauma-informed assessment addresses? Select ALL that apply.',
          options: [
            { text: 'Does not assess adult traumatic experiences', isCorrect: true },
            { text: 'Does not capture quality of buffering relationships', isCorrect: true },
            { text: 'Does not measure current PTSD symptom severity', isCorrect: true },
            { text: 'Cannot be administered in primary care settings', isCorrect: false },
            { text: 'Does not assess systemic oppression or community violence', isCorrect: true },
            { text: 'Was never validated for clinical use', isCorrect: false }
          ],
          explanation: 'The ACE questionnaire has significant coverage limitations: it covers only 10 childhood adversity types within the household, misses adult trauma, community violence, systemic oppression, and provides no data on symptom severity, functional impact, cultural context, or protective factors. It CAN be used in primary care and was validated in large-scale research. A comprehensive assessment supplements ACE data across all missing domains.'
        },
        {
          type: 'reflection',
          question: 'Think about your current intake process. Which of the six assessment domains (trauma exposure, developmental context, symptom burden, functional impairment, protective factors, cultural context) is LEAST represented in your standard assessment? What would it take to integrate that domain into your current practice?'
        },
        {
          type: 'keyTakeaway',
          title: 'Key Takeaways',
          takeaways: [
            'Comprehensive trauma assessment covers six domains: exposure history, developmental context, symptom burden, functional impairment, protective factors, and cultural context — the ACE score covers only part of one.',
            'Validated instruments (PCL-5, ITQ, DES, CTQ, LEC-5, CFI, WHODAS) extend ACE screening across all six domains and provide severity, specificity, and treatment-monitoring capability.',
            'Assessment should be distributed across initial sessions and paced within the client\'s window of tolerance; it is a relational process, not an administrative checklist.',
            'Documentation should reflect functional impact and clinical formulation rather than exhaustive trauma inventories, protecting clients from inadvertent disclosure harms.',
            'Resilience assessment is not optional — protective factors are among the strongest predictors of recovery trajectory and must be integrated into every trauma formulation.'
          ]
        }
      ]
    },
    {
      title: 'Somatic, Dissociative, and Culturally Responsive Trauma Assessment',
      sectionNumber: 3,
      contentBlocks: [
        {
          type: 'sectionDivider',
          title: 'Somatic, Dissociative, and Culturally Responsive Trauma Assessment',
          subtitle: 'Reading the body, honoring culture, and avoiding re-traumatization',
          sectionNumber: 3
        },
        {
          type: 'text',
          content: `<p>Standard diagnostic interviews are largely organized around verbal self-report — the client articulates their experiences in response to structured questions, and the clinician translates those responses into diagnostic categories. This approach works reasonably well for many clinical presentations, but it systematically disadvantages clients whose trauma is encoded somatically, dissociatively, or in ways that their cultural context makes difficult to articulate to a clinician from a different background. In this section we examine three domains that are critical to comprehensive trauma assessment yet underserved by standard verbal interviewing: somatic presentation, dissociative experience, and cultural context.</p>
<p><strong>Somatic Markers of Trauma.</strong> Peter Levine, Bessel van der Kolk, and Pat Ogden have each contributed foundational frameworks for understanding how trauma is stored and expressed in the body. Van der Kolk's seminal text "The Body Keeps the Score" (2014) documented that traumatic memory is often encoded in sensory-somatic channels — implicit procedural memory, autonomic nervous system states, and body-based patterns of hyperarousal or shutdown — rather than explicit verbal-narrative memory. This means that a trauma survivor's diagnostic picture may be most legible not in their verbal responses to PTSD screening questions, but in their posture, breathing, movement quality, and somatic complaints.</p>
<p>Clinicians conducting trauma-informed assessments should incorporate observation of somatic cues as a routine part of the assessment process. This does not require specialized somatic therapy training — it requires attentiveness. Key somatic markers to observe include: postural patterns (collapsed, braced, or freeze-organized postures), respiratory patterns (shallow breathing, breath-holding, rapid breathing), autonomic activation markers (blushing, pallor, tremor, perspiration, accelerated speech or speech cutoffs), movement inhibition (restricted range of motion, stillness, reduced gesture), and somatic complaints disproportionate to medical explanation (unexplained chronic pain, GI distress, fatigue, or dizziness). These observations belong in the clinical formulation as data points, not pathological labels: "Client presents with collapsed posture and restricted respiration consistent with a dorsal vagal shutdown response" is clinically informative; "client appears slumped and depressed" is interpretive and potentially stigmatizing.</p>
<p>The relationship between somatic presentation and specific trauma types is not mechanistic — there is no one-to-one mapping between a somatic pattern and a particular traumatic experience. However, research supports that complex and chronic early trauma is associated with more diffuse somatic dysregulation than single-incident adult trauma, that hyperarousal presentations are more common following threat-based trauma (assault, combat, accidents), and that hypoarousal and dissociative presentations are more common following chronic inescapable trauma (childhood abuse, captivity, prolonged intimate partner violence). Stephen Porges's Polyvagal Theory provides a useful neurobiological framework: the social engagement system (ventral vagal) supports safe, connected functioning; the sympathetic system mobilizes fight/flight; and the dorsal vagal system mediates immobilization and collapse. A client who appears flat, disconnected, and barely present in session may not be unmotivated — they may be in dorsal vagal collapse, a neurobiologically organized survival state that warrants somatic intervention before verbal processing.</p>`
        },
        {
          type: 'callout',
          title: 'Warning: Avoid Re-Traumatization During Assessment',
          calloutType: 'warning',
          content: `<p>Asking trauma survivors to narrate traumatic events in detail during a first or second clinical contact carries significant risk of re-traumatization and iatrogenic harm. Assessment questions should target the presence and impact of traumatic experiences rather than narrative details of what happened. Phrase questions in behavioral and functional terms: "Did something happen that was very scary or dangerous?" is better than "Tell me about the worst thing that happened to you." If a client begins to detail traumatic events with visible distress, gently interrupt: "I can see that this is important, and I want to make sure we go at a pace that feels manageable for you." Stabilization skills should be available and sometimes taught before detailed disclosure is invited.</p>`
        },
        {
          type: 'text',
          content: `<p><strong>Dissociative Presentations in Assessment.</strong> Dissociation — the disruption of normally integrated functions of consciousness, memory, identity, emotion, perception, behavior, and sense of self — is among the most misunderstood and underdiagnosed sequelae of chronic trauma. In standard diagnostic interviewing, dissociation is frequently invisible: a client who is mildly dissociated may appear calm, cooperative, and articulate, reporting few trauma symptoms — because they are not fully accessing them in the moment. More significant dissociation may be misinterpreted as inattention, tangential thinking, or flat affect. Severe structural dissociation involving identity alteration may be mistaken for bipolar disorder, schizophrenia, or personality disorder if the clinician is not attuned to dissociative markers.</p>
<p>Clinical markers of dissociation that should be assessed in all trauma presentations include: amnesia for periods of time or for events others report occurred, identity confusion or sense of different "parts" of self, depersonalization (feeling detached from one's body, thoughts, or feelings — "like I'm watching myself from outside"), derealization (sense that the environment is unreal, dreamlike, or distant), trance-like states during session (glazed look, decreased responsiveness, speech slowing or stopping), and spontaneous age regression in affect or behavior. The Dissociative Experiences Scale (DES) is the primary validated self-report screening tool and should be administered whenever complex trauma, chronic childhood maltreatment, eating disorder, treatment-resistant depression or anxiety, or unusual diagnostic presentation is present. A DES score above 20–30 warrants clinical exploration; scores above 30 warrant consideration of dissociative disorder diagnosis, potentially with referral to a specialist in structural dissociation.</p>
<p>When dissociation is identified in assessment, it has critical implications for treatment planning. Dissociated clients are typically not good candidates for immediate trauma processing — they lack the internal integration needed to metabolize trauma material safely, and premature exposure to trauma content risks decompensation, crises, or destabilization. Phase-based treatment is the standard of care: Phase 1 (stabilization and resource building) must be substantially completed before Phase 2 (trauma processing) is indicated. Assessment of dissociation therefore directly guides treatment sequencing and pacing, making it clinically essential — not merely a curiosity.</p>
<p><strong>Culturally Responsive Trauma Assessment.</strong> Culture profoundly shapes what is experienced as traumatic, how distress is expressed, what constitutes appropriate disclosure, and what healing looks like. Ignoring cultural context in trauma assessment risks systematic under-identification of trauma in clients from communities where distress is expressed somatically or through idioms of distress that do not map onto DSM categories, over-pathologizing normative cultural coping behaviors, and eroding therapeutic alliance through microaggressions or cultural invalidation during the assessment process itself.</p>
<p>Key principles of culturally responsive trauma assessment include: (1) Assess for historical and intergenerational trauma. For Black, Indigenous, and other people of color, trauma histories are often not simply individual — they are intergenerational, with documented epigenetic and psychosocial transmission of stress responses across generations. Maria Yellow Horse Brave Heart's work on historical trauma among Indigenous populations, and research on post-traumatic slave syndrome and intergenerational transmission of Holocaust trauma, provide empirical grounding for routinely asking about family history of loss, forced migration, and systemic violence. (2) Assess for ongoing racialized stress. For clients from marginalized communities, race-based traumatic stress (racial trauma) may be an active, ongoing stressor — not a historical event — with presentations overlapping with and distinct from PTSD. Thema Bryant-Davis's Race-Based Traumatic Stress Symptom Scale (RBTSSS) is a validated tool for assessing this domain. (3) Adapt language and framing. Constructs like "PTSD," "trauma," and "triggers" are culturally coded and may carry stigma, feel foreign, or map poorly onto a client's self-understanding. Explore the client's own language for their experiences. (4) Address practical barriers. For immigrant clients, undocumented clients, or clients from communities with justified mistrust of institutions, fears about disclosure (deportation, child welfare involvement, legal consequences) may shape what they are willing to share and with whom.</p>`
        },
        {
          type: 'accordion',
          accordionItems: [
            {
              title: 'Historical and Intergenerational Trauma',
              content: '<p>Intergenerational trauma refers to the transmission of trauma sequelae across generations through epigenetic, psychological, and social pathways. Research documents this phenomenon among Holocaust survivors and their descendants, Indigenous communities affected by boarding school policies and forced assimilation, African Americans affected by slavery, segregation, and ongoing systemic racism, and refugees and survivors of genocide. Clinicians should ask about family history of loss, forced migration, community violence, and systemic oppression as part of a comprehensive trauma assessment, not only individual experiences.</p>'
            },
            {
              title: 'Somatic Idioms of Distress',
              content: '<p>Many cultures primarily express psychological distress through somatic channels. In Chinese clinical presentations, depression and anxiety may manifest as "neurasthenia" (fatigue, headache, bodily weakness). In South Asian presentations, heart-distress (dil ghabrana in Urdu/Hindi) may express emotional pain. In Latinx presentations, susto (fright/soul loss) and nervios (nerves/anxiety) are recognized idioms. Western trauma screening instruments based on emotional and cognitive symptom clusters may systematically underestimate distress in clients whose primary idiom is somatic. Clinicians should ask directly about bodily experiences of distress and not assume somatic complaints are purely medical.</p>'
            },
            {
              title: 'Race-Based Traumatic Stress',
              content: '<p>Race-based traumatic stress describes the psychological injury that can result from encounters with racial discrimination, hate crimes, racist violence, and ongoing microaggressions. Bryant-Davis and Ocampo (2005) proposed criteria that map onto PTSD: intrusive reexperiencing of discriminatory events, avoidance of similar situations, hyperarousal in race-relevant contexts, and physiological reactivity. The Race-Based Traumatic Stress Symptom Scale (RBTSSS) is a validated 22-item measure. Clinicians working with clients from marginalized communities should routinely inquire about experiences of discrimination and their emotional and functional impact.</p>'
            },
            {
              title: 'Religious and Spiritual Trauma',
              content: '<p>Religious or spiritual abuse — including manipulation, coercion, sexual exploitation, or psychological harm inflicted within religious contexts — is a form of trauma that is often minimized or missed in standard assessment. Survivors may struggle with spiritual injury (loss of faith, God image disturbances, spiritual shame) alongside more standard PTSD symptoms. Assessment should include questions about religious community affiliation and any harmful experiences within faith settings. The Spiritual Injury Scale and the Religious and Spiritual Struggles Scale are available validated instruments for this domain.</p>'
            },
            {
              title: 'Assessment with Non-English Speaking Clients',
              content: '<p>Conducting trauma assessment through an interpreter introduces significant challenges: emotional material must be mediated through a third party, confidentiality concerns arise when the interpreter is a family member or community member, interpreter distress at vicarious trauma exposure can affect translation quality, and nuanced cultural idioms may not translate accurately. Best practices include using professional medical interpreters rather than family members, briefing interpreters before sessions on trauma-sensitive interviewing principles, watching for interpreter distress, allowing for verification of key disclosures, and using validated translated versions of assessment instruments where available.</p>'
            }
          ]
        },
        {
          type: 'imageText',
          title: 'Polyvagal Framework in Clinical Assessment',
          content: `<p>Porges's Polyvagal Theory offers clinicians a neurobiological lens for understanding client presentation during assessment. A client in ventral vagal (social engagement) state is present, engaged, and relationally available. A client in sympathetic activation appears anxious, agitated, or hyperalert. A client in dorsal vagal collapse appears flat, disconnected, shut down, or dissociated. Each state requires different clinical responses, and recognizing these states during assessment allows clinicians to pace, titrate, and modulate the assessment process to keep clients within their window of tolerance.</p>`,
          image: '',
          imageAlt: 'Polyvagal autonomic ladder diagram showing ventral vagal, sympathetic, and dorsal vagal states',
          imagePosition: 'right'
        },
        {
          type: 'cardSort',
          instructions: 'Sort each clinical observation into the correct assessment domain: Somatic, Dissociative, or Cultural.',
          categories: ['Somatic Domain', 'Dissociative Domain', 'Cultural Domain'],
          cards: [
            { text: 'Client reports chronic unexplained pelvic pain following history of sexual abuse', category: 'Somatic Domain' },
            { text: 'Client describes periods of time they cannot account for', category: 'Dissociative Domain' },
            { text: 'Client uses the term "susto" to describe their trauma response', category: 'Cultural Domain' },
            { text: 'Client presents with collapsed posture and shallow respiration throughout session', category: 'Somatic Domain' },
            { text: 'Client reports feeling "outside their body" when discussing abuse', category: 'Dissociative Domain' },
            { text: 'Client is reluctant to disclose family trauma due to cultural norms about family privacy', category: 'Cultural Domain' },
            { text: 'Client reports headaches and GI symptoms that began shortly after traumatic bereavement', category: 'Somatic Domain' },
            { text: 'Client has gaps in autobiographical memory for ages 7–10', category: 'Dissociative Domain' },
            { text: 'Client describes intergenerational suffering linked to forced migration', category: 'Cultural Domain' }
          ],
          explanation: 'Somatic markers include bodily symptoms, postural patterns, and autonomic activation. Dissociative markers include amnesia, depersonalization, derealization, and identity alteration. Cultural markers include idioms of distress, disclosure norms, intergenerational trauma, and cultural explanatory models. All three domains require distinct assessment strategies.',
          accessibility: { ariaLabel: 'Card sort: Trauma assessment domains', role: 'application' }
        },
        {
          type: 'multipleChoice',
          question: 'According to Polyvagal Theory, a client who presents as flat, disconnected, barely responsive, and minimally interactive during assessment is MOST likely in which autonomic state?',
          options: [
            { text: 'Ventral vagal (social engagement)', isCorrect: false },
            { text: 'Sympathetic activation (fight/flight)', isCorrect: false },
            { text: 'Dorsal vagal shutdown (immobilization)', isCorrect: true },
            { text: 'Parasympathetic calm (homeostasis)', isCorrect: false }
          ],
          correctAnswer: 2,
          explanation: 'The Polyvagal Theory identifies three autonomic states: ventral vagal (social engagement — safe, connected, present), sympathetic (fight/flight — agitated, hyperalert, anxious), and dorsal vagal (immobilization — flat, disconnected, collapsed). A client appearing shut down, barely responsive, and minimally engaged is displaying dorsal vagal characteristics, which represent a survival-organized neurobiological state — not unmotivation or resistance.'
        },
        {
          type: 'multiSelect',
          question: 'Which of the following are clinical markers of dissociation that should prompt administration of a dissociation screening measure? Select ALL that apply.',
          options: [
            { text: 'Reports of time gaps or amnesia for events', isCorrect: true },
            { text: 'Sense of feeling outside one\'s body (depersonalization)', isCorrect: true },
            { text: 'Treatment-resistant depression or anxiety', isCorrect: true },
            { text: 'Elevated PCL-5 score', isCorrect: false },
            { text: 'History of chronic childhood maltreatment', isCorrect: true },
            { text: 'Trance-like states or glazed-over appearance during session', isCorrect: true }
          ],
          explanation: 'Dissociation screening is indicated when clients report amnesia, depersonalization, derealization, or identity confusion; present with trance-like states during session; have histories of complex or chronic trauma; or show treatment-resistant presentations. An elevated PCL-5 alone does not specifically indicate dissociation — dissociative clients may score low on PTSD measures because they are not fully accessing traumatic material during assessment.'
        },
        {
          type: 'videoEmbed',
          title: 'Cultural Humility in Trauma Assessment',
          videoUrl: 'https://www.youtube.com/embed/SaSHLbS1V4w',
          description: 'An exploration of culturally responsive trauma assessment practices, including working with historical trauma, idioms of distress, and the cultural formulation interview.',
          accessibility: { ariaLabel: 'Video: Cultural Humility in Trauma Assessment', role: 'complementary' }
        },
        {
          type: 'reflection',
          question: 'Recall a recent client whose presentation felt puzzling, flat, or inconsistent with what their verbal report suggested. In retrospect, how might somatic or dissociative markers have been present? What, if anything, would you assess differently now?'
        },
        {
          type: 'resources',
          title: 'Resources for Trauma-Informed Assessment',
          resources: [
            {
              name: 'PTSD Checklist for DSM-5 (PCL-5)',
              description: 'Free validated PTSD symptom severity measure. Downloadable from the National Center for PTSD at the VA.',
              url: 'https://www.ptsd.va.gov/professional/assessment/adult-sr/ptsd-checklist.asp'
            },
            {
              name: 'International Trauma Questionnaire (ITQ)',
              description: 'Free validated measure for both PTSD and Complex PTSD per ICD-11 criteria, including disturbances in self-organization.',
              url: 'https://www.traumameasures.com'
            },
            {
              name: 'Dissociative Experiences Scale (DES)',
              description: 'Classic 28-item self-report dissociation screening tool. Available in the public domain from the Sidran Foundation.',
              url: 'https://www.sidran.org/resources/for-survivors-and-loved-ones/dissociative-experiences-scale/'
            },
            {
              name: 'National Center for PTSD Assessment Measures',
              description: 'Comprehensive library of freely available, validated trauma assessment instruments for adults and children, organized by assessment target.',
              url: 'https://www.ptsd.va.gov/professional/assessment/overview/index.asp'
            },
            {
              name: 'DSM-5 Cultural Formulation Interview (CFI)',
              description: 'The CFI and supplementary modules are freely available from the American Psychiatric Association for download and clinical use.',
              url: 'https://www.psychiatry.org/psychiatrists/cultural-competency/education/cultural-formulation'
            },
            {
              name: 'Brave Heart, M.Y.H. — Historical Trauma',
              description: 'Foundational scholarly work on the historical trauma response among American Indian and Alaska Native communities. Available through PubMed and research databases.',
              url: 'https://pubmed.ncbi.nlm.nih.gov/?term=brave+heart+historical+trauma'
            },
            {
              name: 'SAMHSA Trauma-Informed Care in Behavioral Health Services',
              description: 'TIP 57 — comprehensive clinical guide for trauma-informed assessment and treatment across behavioral health settings. Free download.',
              url: 'https://store.samhsa.gov/product/trauma-informed-care-behavioral-health-services/SMA14-4816'
            },
            {
              name: 'van der Kolk, B. — The Body Keeps the Score',
              description: 'Foundational text on somatic and neurobiological dimensions of trauma. Essential reading for understanding body-based assessment.',
              url: 'https://www.besselvanderkolk.com/resources/the-body-keeps-the-score'
            }
          ],
          accessibility: { ariaLabel: 'Trauma-informed assessment resources', role: 'complementary' }
        },
        {
          type: 'keyTakeaway',
          title: 'Key Takeaways',
          takeaways: [
            'Somatic markers — posture, respiration, autonomic activation, unexplained physical symptoms — are legitimate trauma assessment data and should be routinely observed and documented using functional (not interpretive) language.',
            'Dissociation is systematically missed in standard verbal interviewing; the DES should be administered whenever complex trauma, treatment resistance, or identity disturbance is present.',
            'A client in dorsal vagal shutdown (flat, disconnected, immobilized) is in a survival-organized neurobiological state — pacing, titration, and stabilization precede any detailed trauma history taking.',
            'Cultural context shapes every dimension of trauma — from what is experienced as traumatic, to how it is expressed, to what healing looks like; the CFI provides a structured protocol for gathering this essential data.',
            'Intergenerational and racialized trauma require active assessment; individual ACE screening cannot capture collective and historical dimensions of traumatic experience.'
          ]
        }
      ]
    }
  ],
  assessment: {
    title: 'Final Assessment — CR-TRM-503: Trauma-Informed Assessment Beyond the ACE Score',
    passingScore: 80,
    maxAttempts: 3,
    shuffleQuestions: true,
    questions: [
      {
        type: 'multipleChoice',
        question: 'What is the primary limitation of relying solely on the ACE score in trauma assessment?',
        options: [
          { text: 'It is not validated for clinical use', isCorrect: false },
          { text: 'It covers only 10 categories of childhood household adversity and omits adult trauma, systemic oppression, symptom severity, and protective factors', isCorrect: true },
          { text: 'It takes too long to administer in clinical settings', isCorrect: false },
          { text: 'It requires specialized training to interpret', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'The ACE questionnaire covers only 10 categories of childhood adversity within the household and provides no data on adult trauma, community violence, systemic oppression, current PTSD symptom severity, functional impairment, cultural context, or resilience factors.'
      },
      {
        type: 'multipleChoice',
        question: 'Which of the following assessment instruments is BEST suited for identifying complex PTSD per ICD-11 criteria, including disturbances in self-organization?',
        options: [
          { text: 'PCL-5', isCorrect: false },
          { text: 'PHQ-9', isCorrect: false },
          { text: 'International Trauma Questionnaire (ITQ)', isCorrect: true },
          { text: 'Dissociative Experiences Scale (DES)', isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: 'The ITQ measures both PTSD and Complex PTSD per ICD-11 criteria, specifically assessing disturbances in self-organization: affect dysregulation, negative self-concept, and relational disturbances. The PCL-5 assesses DSM-5 PTSD only; the DES assesses dissociation; the PHQ-9 assesses depression.'
      },
      {
        type: 'multipleChoice',
        question: 'According to Polyvagal Theory, which autonomic state is associated with flat affect, social withdrawal, and apparent unresponsiveness in a trauma assessment context?',
        options: [
          { text: 'Ventral vagal activation', isCorrect: false },
          { text: 'Sympathetic fight/flight', isCorrect: false },
          { text: 'Dorsal vagal immobilization', isCorrect: true },
          { text: 'Parasympathetic homeostasis', isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: 'Dorsal vagal immobilization (collapse/shutdown) is associated with flat affect, social withdrawal, decreased responsiveness, and dissociative-like presentation. It is a survival-organized neurobiological state, not unmotivation or resistance, and requires pacing and stabilization before trauma assessment proceeds.'
      },
      {
        type: 'multipleChoice',
        question: 'Which statement BEST describes appropriate pacing for comprehensive trauma assessment?',
        options: [
          { text: 'All six assessment domains should be completed in the first session to establish a complete baseline', isCorrect: false },
          { text: 'Assessment should begin with the most traumatic material to get it out of the way quickly', isCorrect: false },
          { text: 'Assessment can be distributed across two to three sessions, beginning with less activating material and always ending with stabilization', isCorrect: true },
          { text: 'Trauma exposure history should never be documented to protect client privacy', isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: 'Distributing assessment across sessions allows rapport-building, pacing within the client\'s window of tolerance, and ending sessions with stabilization. Beginning with less activating material (current strengths, functional status) before moving to detailed trauma history is trauma-informed practice that reduces iatrogenic re-traumatization.'
      },
      {
        type: 'multipleChoice',
        question: 'The Dissociative Experiences Scale (DES) is MOST appropriately administered when which of the following is present?',
        options: [
          { text: 'Any client presenting with anxiety symptoms', isCorrect: false },
          { text: 'Clients with a history of chronic childhood maltreatment, treatment-resistant presentations, or identity confusion', isCorrect: true },
          { text: 'Only clients who have been previously diagnosed with a dissociative disorder', isCorrect: false },
          { text: 'Clients who score below 33 on the PCL-5', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'The DES is specifically indicated for clients with complex trauma histories, chronic childhood maltreatment, treatment-resistant depression or anxiety, unusual diagnostic presentations, or clinical markers of dissociation (amnesia, depersonalization, trance states during session). It should not be limited to clients with pre-existing dissociative disorder diagnoses.'
      },
      {
        type: 'multipleChoice',
        question: 'What does documentation best practice recommend for recording trauma history in clinical charts?',
        options: [
          { text: 'Verbatim accounts of all traumatic events to support accurate diagnosis', isCorrect: false },
          { text: 'Functional impact and clinical formulation rather than exhaustive event inventories', isCorrect: true },
          { text: 'Trauma history should not be documented at all due to privacy risks', isCorrect: false },
          { text: 'Only ACE scores should be documented, not clinical impressions', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'Clinical documentation should record the functional impact of trauma and the clinical formulation — enough to justify treatment and guide care — rather than exhaustive verbatim event narratives. Detailed trauma inventories in charts can become barriers to employment, military service, or custody determinations if subpoenaed.'
      },
      {
        type: 'multipleChoice',
        question: 'Race-based traumatic stress can BEST be distinguished from PTSD in that it:',
        options: [
          { text: 'Does not include re-experiencing or hyperarousal symptoms', isCorrect: false },
          { text: 'Involves ongoing, recurring stressors related to systemic racism and discrimination rather than a discrete past event', isCorrect: true },
          { text: 'Is not a clinically valid construct', isCorrect: false },
          { text: 'Only affects individuals who have witnessed physical racial violence', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'Race-based traumatic stress involves psychological injury from ongoing encounters with racial discrimination, microaggressions, and systemic racism — not a single discrete past traumatic event. While symptom overlap with PTSD exists (re-experiencing, avoidance, hyperarousal), the ongoing, systemic, and relational nature distinguishes it.'
      },
      {
        type: 'multipleChoice',
        question: 'Which of the following is a validated instrument specifically designed for assessing lifetime trauma exposure in adults?',
        options: [
          { text: 'PHQ-9', isCorrect: false },
          { text: 'PCL-5', isCorrect: false },
          { text: 'Life Events Checklist for DSM-5 (LEC-5)', isCorrect: true },
          { text: 'WHODAS 2.0', isCorrect: false }
        ],
        correctAnswer: 2,
        explanation: 'The LEC-5 is a validated lifetime trauma exposure inventory that identifies events meeting PTSD Criterion A. It is typically paired with the PCL-5 for comprehensive PTSD assessment. The PCL-5 measures symptom severity (not exposure), the PHQ-9 measures depression, and the WHODAS measures functional impairment.'
      },
      {
        type: 'multipleChoice',
        question: 'According to trauma-informed assessment principles, why should trauma exposure questions be phrased in behavioral language ("Did someone hurt you badly?") rather than interpretive language ("Were you abused?")?',
        options: [
          { text: 'Behavioral language is easier to document in charts', isCorrect: false },
          { text: 'Many clients do not self-identify as abuse survivors even when their experiences meet clinical criteria', isCorrect: true },
          { text: 'Interpretive language is not trauma-informed', isCorrect: false },
          { text: 'Behavioral language reduces client anxiety during assessment', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'Many survivors of abuse, neglect, or exploitation do not identify their experiences using clinical or legal labels. Behavioral language ("Did someone touch you in a sexual way when you didn\'t want them to?") captures experiences regardless of whether the client labels them as abuse, increasing assessment sensitivity and reducing systematic underreporting.'
      },
      {
        type: 'multipleChoice',
        question: 'Which of the following is NOT a core domain of the comprehensive six-domain trauma assessment framework described in this course?',
        options: [
          { text: 'Developmental and attachment context', isCorrect: false },
          { text: 'Socioeconomic and financial status', isCorrect: true },
          { text: 'Cultural context', isCorrect: false },
          { text: 'Protective factors and resilience resources', isCorrect: false }
        ],
        correctAnswer: 1,
        explanation: 'The six core domains are: trauma exposure history, developmental and attachment context, current symptom burden, functional impairment, protective factors and resilience resources, and cultural context. While socioeconomic status may be relevant clinical data, it is not one of the six named domains in the multidimensional framework.'
      },
      {
        type: 'multiSelect',
        question: 'Which of the following are limitations of the ACE questionnaire that make comprehensive assessment necessary? Select ALL that apply.',
        options: [
          { text: 'Does not assess adult traumatic experiences', isCorrect: true },
          { text: 'Does not measure quality of buffering relationships', isCorrect: true },
          { text: 'Cannot be self-administered', isCorrect: false },
          { text: 'Does not assess current PTSD symptom severity', isCorrect: true },
          { text: 'Misses systemic oppression and community violence', isCorrect: true }
        ],
        explanation: 'The ACE questionnaire has significant coverage gaps: it assesses only 10 childhood adversity categories within the household, misses adult trauma, cannot assess buffering relationship quality, provides no symptom severity data, and ignores systemic and community-level trauma. It CAN be self-administered — this is not a limitation.'
      },
      {
        type: 'multiSelect',
        question: 'Which clinical indicators suggest that phase-based treatment (stabilization before trauma processing) is warranted? Select ALL that apply.',
        options: [
          { text: 'DES score above 30', isCorrect: true },
          { text: 'PCL-5 score above 33', isCorrect: false },
          { text: 'History of chronic, inescapable childhood trauma', isCorrect: true },
          { text: 'Trance-like states observed during clinical session', isCorrect: true },
          { text: 'Reports of amnesia for significant life periods', isCorrect: true }
        ],
        explanation: 'Phase-based treatment (Phase 1 stabilization before Phase 2 trauma processing) is indicated when dissociation is present — evidenced by high DES scores, trance states in session, amnesia, or a history of chronic inescapable trauma that commonly produces structural dissociation. A PCL-5 score above 33 indicates PTSD symptom severity but does not by itself indicate dissociation requiring phase-based sequencing.'
      },
      {
        type: 'multiSelect',
        question: 'Which of the following represent culturally responsive trauma assessment practices? Select ALL that apply.',
        options: [
          { text: 'Assessing for intergenerational and historical trauma', isCorrect: true },
          { text: 'Asking about the client\'s own language and terms for emotional suffering', isCorrect: true },
          { text: 'Assuming that clients from collective cultures will not disclose family trauma', isCorrect: false },
          { text: 'Using the Cultural Formulation Interview (CFI) to assess explanatory models', isCorrect: true },
          { text: 'Inquiring about experiences of racial discrimination and their emotional impact', isCorrect: true }
        ],
        explanation: 'Culturally responsive assessment includes inquiry about intergenerational trauma, eliciting the client\'s own language and explanatory models, using the CFI, and asking about race-based stressors. Assuming clients from collective cultures will not disclose is itself a stereotype — the practice is to ask with sensitivity while allowing pacing; not to assume non-disclosure.'
      },
      {
        type: 'multiSelect',
        question: 'Which of the following are recognized somatic markers of trauma that a clinician might observe during assessment? Select ALL that apply.',
        options: [
          { text: 'Collapsed or braced posture', isCorrect: true },
          { text: 'Shallow or restricted breathing', isCorrect: true },
          { text: 'Elevated PHQ-9 score', isCorrect: false },
          { text: 'Unexplained chronic pain or GI distress', isCorrect: true },
          { text: 'Tremor or perspiration without medical cause', isCorrect: true }
        ],
        explanation: 'Somatic trauma markers observable during assessment include postural patterns (collapsed, braced), respiratory patterns (shallow, held breath), autonomic activation markers (tremor, perspiration, pallor, blushing), and somatic complaints disproportionate to medical explanation. An elevated PHQ-9 score is a self-report depression measure, not a somatic observation.'
      },
      {
        type: 'multiSelect',
        question: 'According to the course, which domains are systematically underserved by standard verbal diagnostic interviewing? Select ALL that apply.',
        options: [
          { text: 'Somatic presentation', isCorrect: true },
          { text: 'Dissociative experience', isCorrect: true },
          { text: 'PTSD symptom severity', isCorrect: false },
          { text: 'Cultural context', isCorrect: true },
          { text: 'Trauma exposure history', isCorrect: false }
        ],
        explanation: 'Standard verbal diagnostic interviewing adequately captures PTSD symptom severity and trauma exposure history (the domains ACE and PCL-5 address). What it systematically misses are somatic presentations (encoded implicitly in the body), dissociative experiences (often invisible during verbal assessment), and cultural context (requires specific inquiry, cultural humility, and adapted instruments).'
      }
    ]
  },
  references: [
    'Felitti, V. J., Anda, R. F., Nordenberg, D., Williamson, D. F., Spitz, A. M., Edwards, V., Koss, M. P., & Marks, J. S. (1998). Relationship of childhood abuse and household dysfunction to many of the leading causes of death in adults. American Journal of Preventive Medicine, 14(4), 245–258. https://doi.org/10.1016/S0749-3797(98)00017-8',
    'van der Kolk, B. A. (2014). The body keeps the score: Brain, mind, and body in the healing of trauma. Viking Press.',
    'Weathers, F. W., Litz, B. T., Keane, T. M., Palmieri, P. A., Marx, B. P., & Schnurr, P. P. (2013). The PTSD Checklist for DSM-5 (PCL-5). National Center for PTSD. https://www.ptsd.va.gov',
    'Cloitre, M., Shevlin, M., Brewin, C. R., Bisson, J. I., Roberts, N. P., Maercker, A., Karatzias, T., & Hyland, P. (2018). The International Trauma Questionnaire: Development of a self-report measure of ICD-11 PTSD and complex PTSD. Acta Psychiatrica Scandinavica, 138(6), 536–546. https://doi.org/10.1111/acps.12956',
    'Bernstein, D. P., Stein, J. A., Newcomb, M. D., Walker, E., Pogge, D., Ahluvalia, T., Stokes, J., Handelsman, L., Medrano, M., Desmond, D., & Zule, W. (2003). Development and validation of a brief screening version of the Childhood Trauma Questionnaire. Child Abuse & Neglect, 27(2), 169–190. https://doi.org/10.1016/S0145-2134(02)00541-0',
    'Porges, S. W. (2011). The polyvagal theory: Neurophysiological foundations of emotions, attachment, communication, and self-regulation. W.W. Norton & Company.',
    'Brave Heart, M. Y. H. (2003). The historical trauma response among Natives and its relationship with substance abuse: A Lakota illustration. Journal of Psychoactive Drugs, 35(1), 7–13. https://doi.org/10.1080/02791072.2003.10399988',
    'Bryant-Davis, T., & Ocampo, C. (2005). Racist incident-based trauma. The Counseling Psychologist, 33(4), 479–500. https://doi.org/10.1177/0011000005276465',
    'Carlson, E. B., & Putnam, F. W. (1993). An update on the Dissociative Experiences Scale. Dissociation, 6(1), 16–27.',
    'Lewis-Fernández, R., Aggarwal, N. K., Hinton, L., Hinton, D. E., & Kirmayer, L. J. (Eds.). (2016). DSM-5 handbook on the cultural formulation interview. American Psychiatric Association Publishing.',
    'Connor, K. M., & Davidson, J. R. T. (2003). Development of a new resilience scale: The Connor-Davidson Resilience Scale (CD-RISC). Depression and Anxiety, 18(2), 76–82. https://doi.org/10.1002/da.10113',
    'Üstün, T. B., Kostanjsek, N., Chatterji, S., & Rehm, J. (Eds.). (2010). Measuring health and disability: Manual for WHO disability assessment schedule (WHODAS 2.0). World Health Organization.',
    'Gray, M. J., Litz, B. T., Hsu, J. L., & Lombardo, T. W. (2004). Psychometric properties of the Life Events Checklist. Assessment, 11(4), 330–341. https://doi.org/10.1177/1073191104269954',
    'Werner, E. E., & Smith, R. S. (1992). Overcoming the odds: High risk children from birth to adulthood. Cornell University Press.',
    'SAMHSA. (2014). Trauma-informed care in behavioral health services (TIP 57). Substance Abuse and Mental Health Services Administration. https://store.samhsa.gov/product/SMA14-4816',
    'Ogden, P., Minton, K., & Pain, C. (2006). Trauma and the body: A sensorimotor approach to psychotherapy. W.W. Norton & Company.',
    'Ford, J. D., & Courtois, C. A. (Eds.). (2013). Treating complex traumatic stress disorders in adults: Scientific foundations and therapeutic models. Guilford Press.'
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
