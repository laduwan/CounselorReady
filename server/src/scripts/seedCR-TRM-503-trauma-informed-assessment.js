import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Course as InteractiveCourse } from '../models/InteractiveCourse.js';
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
  deliveryFormat: 'async',
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
          content: `<p>The ACEs (Adverse Childhood Experiences) study, published in 1998 by Felitti and colleagues, fundamentally transformed how medicine and mental health understood the long-term impact of childhood adversity. By demonstrating a dose-response relationship between cumulative childhood trauma and adult health outcomes — including depression, substance use, cardiovascular disease, and early death — the study gave clinicians a language and a number: the ACE score{{callout:ace-score}}. A score of 4 or higher came to signal elevated risk, and the 10-item questionnaire became one of the most widely used screening tools in primary care, behavioral health, child welfare, and juvenile justice settings.</p>
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
        },
        {
          type: 'text',
          content: `<p>To appreciate why the field has moved beyond the ACE score, it helps to understand precisely what the original ACE study did and did not establish. The 1998 investigation was an epidemiological study of more than seventeen thousand adult members of a large health maintenance organization in Southern California. It was designed to answer a public health question: across a large population, does the accumulation of adverse childhood experiences correlate with later medical and psychiatric morbidity? The answer was a resounding yes, and the dose-response gradient the study uncovered — more adversity associated with progressively worse outcomes — became one of the most replicated findings in public health. That is an extraordinary contribution. It reframed conditions once seen as personal failings as the downstream consequences of childhood adversity, and it gave advocates a powerful, data-driven argument for prevention and early intervention.</p>
<p>But the inferential logic of an epidemiological population study is fundamentally different from the inferential logic required at the bedside or in the consulting room. Population-level associations describe what tends to happen on average across thousands of people; they do not predict what will happen to any single individual sitting in front of a clinician. This distinction is not a technicality — it is the heart of why an ACE score must never be used as a diagnostic or prognostic instrument for an individual. A high ACE score raises the statistical probability of certain outcomes across a population, but at the individual level the variance is enormous. Many people with high ACE scores are doing well; some people with low ACE scores are profoundly impaired by a single, severe, or developmentally mistimed event the questionnaire never asks about. To treat the number as a verdict about a particular person is to commit a basic error of reasoning known as the ecological fallacy: applying a group-level statistic to an individual case.</p>
<p>Consider what the ten ACE items actually capture and what they cannot. They count the presence or absence of ten categories of household adversity before age eighteen. They do not record when the adversity occurred, how severe it was, how long it lasted, how often it recurred, or whether anyone intervened to buffer its impact. A single frightening event at age sixteen and years of unrelenting abuse beginning in infancy can produce the identical score of one. Two clients can both endorse "household member with mental illness," yet one experienced a parent with well-managed depression and the other was the primary caregiver for a parent with untreated psychosis from the age of seven. The questionnaire flattens timing, severity, chronicity, and context — the very variables that developmental trauma research tells us shape outcome most powerfully. It also asks nothing about the protective and resilience factors that can dramatically alter a trajectory: a stable extended family member, a mentor, a faith community, an aptitude that opened doors.</p>
<p>None of this is an argument against using the ACE questionnaire. Used well, it is a humane and efficient way to open a conversation about childhood adversity, to normalize that such experiences are common and consequential, and to signal to a client that their history is welcome in the room. The problem is not the tool; it is the misuse of the tool as a stand-alone verdict. The skill this course teaches is to hold the ACE score lightly — as one data point that prompts further inquiry — while building the multidimensional clinical picture that actually guides assessment, formulation, and care. The remainder of the course is devoted to that picture: the domains it must cover, the validated instruments that populate it, and the relational and cultural skill required to gather it without causing harm.</p>`
        },
        {
          type: 'accordion',
          accordionItems: [
            {
              title: 'What the ACE study established — and what it did not',
              content: '<p>The ACE study established a robust, replicated population-level association between cumulative childhood adversity and later health and psychiatric outcomes, supporting a dose-response gradient. It did NOT establish that any individual ACE score predicts that particular person\'s outcome. Population epidemiology answers questions about averages across groups; it cannot be reverse-applied to forecast a single life. Treating a score as an individual prognosis is the ecological fallacy and is clinically and ethically inappropriate.</p>'
            },
            {
              title: 'Why timing matters',
              content: '<p>The developing brain passes through sensitive periods during which particular systems — attachment, affect regulation, stress reactivity, executive function — are especially shaped by experience. Adversity during these windows, particularly in the first years of life when the attachment system is being organized, can carry a different neurobiological signature than the same adversity occurring later. The ACE score records nothing about when an experience happened, erasing one of the strongest moderators of impact.</p>'
            },
            {
              title: 'Why severity and chronicity matter',
              content: '<p>A single dichotomous "yes" on an ACE item gives equal weight to a brief, less severe experience and to years of relentless, life-threatening exposure. Chronic, inescapable adversity tends to produce more pervasive dysregulation and a higher likelihood of dissociative adaptation than discrete events. By collapsing severity and chronicity into present-or-absent, the questionnaire discards information that comprehensive assessment must recover through skilled interviewing and severity-graded instruments.</p>'
            },
            {
              title: 'What the ACE score cannot see: protective factors',
              content: '<p>Resilience research consistently shows that outcomes after adversity are powerfully shaped by buffering factors — a stable attachment to at least one caring adult, community and cultural belonging, meaning-making, and individual temperament. The ACE questionnaire asks about none of these. Two identical scores can represent two entirely different prognoses depending on the protective scaffolding present. Assessing strengths is therefore not optional decoration; it is part of accurately reading risk.</p>'
            }
          ]
        },
        {
          type: 'text',
          content: `<p>It is worth dwelling on how the ACE score, despite its limitations, came to occupy such a central place in practice — because understanding that history clarifies how to use it responsibly going forward. The ACE framework arrived at a moment when behavioral health was hungry for a simple, communicable way to make the case that childhood experience matters for adult health. A single integer that any clinician could calculate in minutes, that correlated with outcomes everyone cared about, was almost irresistibly useful for advocacy, screening programs, and policy. Whole systems — pediatric clinics, child welfare agencies, schools, and juvenile justice settings — adopted ACE screening with genuine good intentions. The unintended consequence was that a population-level epidemiological metric began to be treated, in some settings, as if it were a clinical assessment that could classify, predict, or even ration services for individuals. That drift is precisely what trauma-informed assessment must correct.</p>
<p>The corrective is not cynicism about the ACE concept but disciplined clinical reasoning about its proper scope. A useful way to hold this is to distinguish three different uses of the questionnaire, only some of which are legitimate. As a population surveillance and advocacy tool, the ACE framework is excellent: it demonstrates the scale of childhood adversity and justifies investment in prevention. As a conversation opener and psychoeducational device with an individual client, it can be valuable: it signals that adversity is common and welcome to discuss, and it can help a client connect present struggles to past experience in a normalizing way. As a stand-alone diagnostic, prognostic, or service-eligibility instrument for an individual, it is inappropriate and potentially harmful, because it lacks the precision, the contextual variables, and the protective-factor data that individual decisions require. Keeping these three uses distinct in one's own practice prevents the most common ACE-related errors.</p>
<p>There is also an ethical dimension to how an ACE score, once recorded, can follow a person. A number written into a chart can be read later by other providers, by systems, and sometimes by institutions making consequential decisions, without the surrounding context that gave it meaning. A high score, stripped of the information that the client has strong supports and is functioning well, can invite assumptions of fragility or risk that the person does not warrant. This is one more reason to treat the ACE score as the beginning of an inquiry rather than its conclusion, and to ensure that whatever is documented reflects a contextualized clinical understanding — functional impact, strengths, and formulation — rather than a bare number that later readers may over-interpret. The throughline of this entire course is that respect for the complexity of a person's history is not only clinically more accurate; it is also the more ethical stance.</p>`
        },
        {
          type: 'accordion',
          accordionItems: [
            {
              title: 'Three legitimate uses of the ACE questionnaire',
              content: '<p>Distinguishing the questionnaire\'s uses prevents its most common misuse. As a population surveillance and advocacy tool it is excellent, demonstrating the scale of childhood adversity and justifying prevention. As a conversation opener and psychoeducational device with an individual it can be valuable, normalizing adversity and helping a client connect present struggles to past experience. As a stand-alone diagnostic, prognostic, or service-eligibility instrument for an individual it is inappropriate, because it lacks the precision, contextual variables, and protective-factor data that individual decisions require.</p>'
            },
            {
              title: 'How a recorded score can follow a person',
              content: '<p>A number entered into a chart can later be read by other providers and institutions making consequential decisions, stripped of the context that gave it meaning. A high score divorced from information about strong supports and good functioning can invite unwarranted assumptions of fragility or risk. This is one more reason to treat the ACE score as the beginning of an inquiry, and to document a contextualized clinical understanding — functional impact, strengths, and formulation — rather than a bare number that later readers may over-interpret.</p>'
            },
            {
              title: 'Holding the score lightly in practice',
              content: '<p>The clinical skill is to let the ACE score prompt curiosity rather than conclusion. A positive screen invites questions about timing, severity, chronicity, buffering relationships, and present-day impact; it does not, by itself, establish diagnosis or prognosis. Holding the number lightly keeps the clinician oriented to the person rather than the statistic, and it preserves the therapeutic stance of meeting each client as an individual whose history cannot be reduced to an integer.</p>'
            }
          ]
        },
        {
          type: 'text',
          content: `<p>As this opening section closes, it is worth naming the shift in clinical identity that trauma-informed assessment asks of us. Moving beyond the ACE score is not merely the addition of a few more instruments to an intake packet; it is a change in how the clinician understands the very purpose of assessment. The aim is no longer to classify a person quickly against a category or a risk threshold, but to understand a person deeply enough to help them — to build, with their participation, a contextualized account of what they have lived through, how it shaped them, what strengths they carry, and what would constitute healing in their own terms. Everything that follows in this course serves that aim: the multidimensional framework and validated instruments of the next section, and the somatic, dissociative, and culturally responsive skills of the section after. Held together, they replace a single number with a living, working understanding of a human being — which is, in the end, what assessment was always meant to provide.</p>`
        }
      ,
{ type: 'multipleChoice', question: "A central limitation of the ACE score in clinical use is that it:", options: [{ text: "Cannot be measured reliably", isCorrect: false }, { text: "Predicts risk at the population level but should not be used as an individual diagnostic or prognostic instrument", isCorrect: true }, { text: "Includes too many protective factors", isCorrect: false }, { text: "Applies only to adults over 65", isCorrect: false }], correctAnswer: 1, explanation: "ACE research demonstrates population-level dose-response associations; applying a score deterministically to an individual ignores timing, severity, chronicity, and protective/resilience factors." },
{ type: 'multipleChoice', question: "Trauma-informed assessment emphasizes which of the following?", options: [{ text: "Rapid, exhaustive trauma disclosure regardless of client readiness", isCorrect: false }, { text: "Safety, choice, collaboration, and appropriate pacing/titration", isCorrect: true }, { text: "Avoiding all trauma-related topics entirely", isCorrect: false }, { text: "Producing a numeric score as the sole output", isCorrect: false }], correctAnswer: 1, explanation: "Trauma-informed assessment centers safety, choice, collaboration, transparency, and titration to gather meaningful information without re-traumatizing the client." }
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
<p><strong>Domain 3: Current Symptom Burden.</strong> The PTSD Checklist for DSM-5 (PCL-5){{callout:pcl-5}} is the gold-standard self-report measure for PTSD symptom severity and is freely available from the National Center for PTSD. It assesses all four symptom clusters: intrusion, avoidance, negative cognitions and mood, and hyperarousal. For complex PTSD (ICD-11 diagnosis){{callout:icd-11}}, the International Trauma Questionnaire (ITQ) also assesses disturbances in self-organization — affect dysregulation, negative self-concept, and relational disturbances — that are not captured by the PCL-5. Dissociative symptoms warrant separate screening using the Dissociative Experiences Scale (DES) or the Multiscale Dissociation Inventory (MDI); these symptoms are frequently missed in standard diagnostic interviewing. Co-occurring depression and anxiety require parallel assessment; the PHQ-9 and GAD-7 are efficient and well-validated for these constructs. For clients with trauma-related substance use, the Drug Abuse Screening Test (DAST-10) and AUDIT provide efficient screening, with the reminder that substance use in trauma contexts often represents affect regulation rather than primary addiction.</p>
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
<p>Taken together, these six domains constitute a trauma assessment architecture that is genuinely comprehensive — one that can support a clinical formulation, a DSM-5{{callout:dsm-5}} diagnostic picture, a treatment plan tailored to the individual's strengths and needs, and ongoing monitoring of progress across multiple dimensions. The validated instruments referenced above are not meant to be administered all at once; they are a toolkit from which clinicians select based on the client's presenting concerns, the time available, and the clinical relationship. A judicious selection of two or three validated measures, integrated with skilled clinical interviewing, will yield far more clinically useful data than an ACE score alone.</p>`
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
          type: 'text',
          content: `<p>A recurring source of confusion in clinical practice is the difference between screening and comprehensive assessment. The two are related but distinct activities with different purposes, instruments, and standards. Screening is a brief, low-burden process designed to answer a single yes-or-no question across many people: is there enough signal here to warrant a closer look? A positive screen is not a diagnosis and not a treatment plan — it is a flag. Comprehensive assessment, by contrast, is the slower, individualized clinical process of building an integrated understanding of a particular person: the nature and history of their exposures, their current symptom burden across multiple domains, their functioning, their strengths, and the cultural context that gives all of it meaning. The ACE questionnaire is a screening tool. The error that this course is designed to correct is the habit of letting a screen masquerade as an assessment.</p>
<p>Good screening and good assessment are complementary, not competing. In a busy clinical setting it is entirely appropriate to begin with brief, validated screeners — a PCL-5 for PTSD symptoms, a PHQ-9 for depression, a GAD-7 for anxiety, perhaps a DES short form when dissociation is suspected — to triage and direct attention. The discipline is in what happens next. A positive screen should trigger a deliberate, paced clinical inquiry rather than an immediate label. A negative screen should never close the door, because trauma frequently presents obliquely: a client may screen low on a PTSD measure while carrying a heavy dissociative load they are not currently accessing, or may express their distress through somatic idioms that symptom checklists were never designed to capture. Screening sensitivity is a starting point, not a verdict, and the clinician's judgment remains the integrating instrument.</p>
<p>Choosing instruments wisely means matching the tool to the question and respecting its intended use. The Life Events Checklist for DSM-5 (LEC-5) inventories exposure — it tells you what kinds of potentially traumatic events a person has encountered across the lifespan, and is typically paired with the PCL-5, which measures the severity of current symptoms tied to a specified index event. The International Trauma Questionnaire (ITQ) extends the picture to ICD-11 complex PTSD, capturing disturbances in self-organization that the PCL-5 omits. The Dissociative Experiences Scale (DES) screens for the dissociation that standard interviews routinely miss. None of these is a substitute for the others, and none is a substitute for clinical interviewing. A common and avoidable mistake is to administer a battery mechanically and then treat the resulting numbers as the assessment, rather than as structured inputs that the clinician must interpret, contextualize, and integrate with the relational and observational data gathered in the room.</p>
<p>Equally important is respecting the boundaries of what each instrument can claim. A cutoff score that supports a provisional diagnosis in a research or triage context is not the same as a definitive diagnosis, and self-report measures are vulnerable to underreporting, overreporting, and state-dependent fluctuation. A client in acute crisis may endorse symptoms more intensely than they would a week later; a client who has learned to minimize may underreport profoundly. Instruments are most trustworthy when their results are triangulated — self-report cross-checked against collateral information, behavioral observation, functional data, and the clinician's developing clinical understanding. The goal of comprehensive assessment is not a single number but a coherent formulation that explains how this person came to present as they do and what is likely to help.</p>`
        },
        {
          type: 'accordion',
          accordionItems: [
            {
              title: 'Screening versus comprehensive assessment',
              content: '<p>Screening is brief, standardized, and population-oriented: it answers "is there enough signal to look closer?" Comprehensive assessment is individualized and integrative: it builds a coherent clinical understanding of one person across exposure, symptoms, functioning, strengths, and cultural context. A positive screen is a flag, not a diagnosis; a negative screen never closes the door because trauma often presents obliquely. The two are complementary stages, not interchangeable.</p>'
            },
            {
              title: 'Matching the instrument to the question',
              content: '<p>The LEC-5 inventories lifetime exposure; the PCL-5 measures current PTSD symptom severity for a specified index event; the ITQ adds ICD-11 complex PTSD and disturbances in self-organization; the DES screens for dissociation. Each answers a different question, and none substitutes for clinical interviewing. Selecting two or three well-matched instruments yields far more clinically useful data than administering a large battery mechanically and reading the numbers as if they were the assessment.</p>'
            },
            {
              title: 'Reading cutoff scores responsibly',
              content: '<p>A cutoff that supports a provisional diagnosis in research or triage is not a definitive clinical diagnosis. Self-report scores are state-dependent and vulnerable to under- and over-reporting: a client in acute crisis may endorse symptoms more intensely than a week later, while a client who minimizes may underreport severe history. Trustworthy interpretation triangulates self-report with behavioral observation, functional data, collateral information, and clinical judgment rather than treating any single score as conclusive.</p>'
            },
            {
              title: 'When negative screens still warrant inquiry',
              content: '<p>A low score on a PTSD measure does not rule out a significant trauma history. Dissociative clients may score low precisely because they are not accessing traumatic material during assessment; clients whose distress is expressed somatically or through cultural idioms may not recognize themselves in symptom-checklist language; and clients who minimize or fear disclosure consequences may underreport. Clinicians should let presentation, history, and context — not a single screening number — determine how deeply to assess.</p>'
            },
            {
              title: 'Assessing protective and resilience factors systematically',
              content: '<p>Resilience is assessable, not merely inferred. Werner and Smith\'s longitudinal work distinguished individual factors (temperament, internal locus of control, problem-solving capacity), family factors (at least one secure attachment bond, cohesion, consistent structure), and community factors (mentors, peers, faith and cultural belonging). Validated measures such as the Connor-Davidson Resilience Scale and the Brief Resilience Scale can quantify these resources. Documenting strengths reframes the formulation from a deficit inventory to a whole-person narrative and directly informs prognosis and treatment sequencing.</p>'
            }
          ]
        },
        {
          type: 'text',
          content: `<p>Extending the trauma exposure domain beyond the household categories the ACE questionnaire captures is one of the most consequential refinements a clinician can make. The original ten items focus on adversity within the childhood home, which means they are silent about whole classes of traumatic experience that powerfully shape adult presentation. Adult interpersonal violence — intimate partner violence, sexual assault, stalking — falls entirely outside the ACE frame, as does community violence, which is a defining feature of life for many clients in under-resourced neighborhoods. So too do accidents, medical trauma, and the trauma of serious illness or invasive treatment; grief and traumatic loss; combat and occupational exposure among first responders, healthcare workers, and military personnel; and the diffuse but cumulatively corrosive stress of systemic oppression based on race, ethnicity, immigration status, gender, sexual orientation, or disability. A comprehensive exposure inventory deliberately spans childhood and adulthood, household and community, discrete events and chronic conditions, because any of these can be the most clinically relevant strand in a person's history.</p>
<p>Validated tools support this broader inventory. The Life Events Checklist for DSM-5 (LEC-5){{callout:lec-5}} walks through a standardized list of potentially traumatic events across the lifespan and distinguishes whether each was experienced directly, witnessed, learned about, or encountered occupationally — distinctions that matter for both diagnosis and formulation. The Traumatic Life Events Questionnaire offers a similarly broad lifetime inventory. For children and adolescents, instruments such as the UCLA PTSD Reaction Index and child trauma screening questionnaires gather developmentally appropriate exposure and symptom data. Across all of these, the framing principle remains constant: ask in behavioral, concrete language rather than interpretive labels. "Did someone ever hit you so hard that you were hurt or afraid?" reaches experiences that a question framed as "Were you abused?" will miss, because many people do not categorize what happened to them using clinical or legal terms — and may actively resist those terms out of loyalty, shame, or a wish not to indict family.</p>
<p>How exposure questions are sequenced and embedded also matters. Lifetime exposure inventories are most safely administered once some rapport and orientation are in place, framed explicitly as a structured way to make sure nothing important is missed, with permission for the client to note an event without elaborating on it. The aim at the exposure stage is breadth and presence, not depth: the clinician is mapping the territory, not yet walking through it. This is also the natural point to begin noting protective and contextual information alongside the exposures — who was present, what helped, how the client coped — so that the emerging picture is never a bare list of harms but a contextualized account that already gestures toward strengths. Approached this way, exposure assessment becomes both more complete and less destabilizing than the open-ended "tell me your trauma history" invitation it replaces.</p>`,
          callouts: { 'lec-5': { label: 'LEC-5', type: 'clinical', body: 'The Life Events Checklist for DSM-5 is a validated lifetime trauma exposure inventory distinguishing direct experience, witnessing, learning about, and occupational exposure to potentially traumatic events.' } }
        },
        {
          type: 'accordion',
          accordionItems: [
            {
              title: 'Exposures the ACE items miss',
              content: '<p>The ten ACE items focus on childhood household adversity and are silent about adult interpersonal violence, community violence, accidents and medical trauma, traumatic grief and loss, combat and occupational exposure, and the chronic stress of systemic oppression. A comprehensive exposure inventory spans childhood and adulthood, household and community, discrete events and chronic conditions — because any of these may be the most clinically relevant strand in a person\'s history.</p>'
            },
            {
              title: 'Tools for lifetime exposure inventory',
              content: '<p>The Life Events Checklist for DSM-5 (LEC-5) walks through standardized potentially traumatic events and distinguishes direct experience, witnessing, learning about, and occupational exposure. The Traumatic Life Events Questionnaire offers a similarly broad lifetime inventory. For youth, the UCLA PTSD Reaction Index and child trauma screening questionnaires gather developmentally appropriate data. Across all of them, the principle holds: inventory exposure before exploring any single event in depth.</p>'
            },
            {
              title: 'Behavioral framing of exposure questions',
              content: '<p>Ask in concrete, behavioral language rather than interpretive labels. "Did someone ever hit you so hard that you were hurt or afraid?" reaches experiences that "Were you abused?" will miss, because many people do not categorize what happened using clinical or legal terms and may resist those terms out of loyalty, shame, or a wish not to indict family. Behavioral framing increases sensitivity and reduces systematic underreporting.</p>'
            },
            {
              title: 'Sequencing exposure assessment safely',
              content: '<p>Administer lifetime exposure inventories once rapport and orientation are in place, framed as a structured way to ensure nothing important is missed, with explicit permission to note an event without elaborating. The aim at this stage is breadth and presence, not depth — mapping the territory rather than walking through it. Noting protective and contextual information alongside exposures keeps the emerging picture a contextualized account rather than a bare list of harms.</p>'
            }
          ]
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
<p>Documentation of the trauma-informed assessment deserves careful attention.{{alert:document}} Clinical records serve multiple purposes simultaneously: they guide treatment, support insurance billing, may be disclosed in legal proceedings, and can be accessed by the client. Trauma disclosure in a chart carries specific risks: it can become a barrier to employment, military service, or custody determinations if records are subpoenaed. Clinicians should document the functional impact of trauma and the clinical formulation rather than exhaustive trauma inventories. "Client reports chronic stress and loss during childhood that affects current affect regulation and relational functioning" is often more appropriate than a verbatim account of specific traumatic events. Document enough to justify treatment; document thoughtfully enough to protect the client.</p>`
        },
        {
          type: 'text',
          content: `<p>Attachment and functional impairment deserve closer attention than they typically receive in symptom-focused assessment, because each shapes both prognosis and the practical shape of treatment. Attachment history is not merely background; it is a strong predictor of how a client will experience the therapeutic relationship itself. A client whose early caregiving was frightening or unpredictable may approach the clinician with the same wary, push-pull pattern that organized their earliest bonds, testing safety before risking disclosure. Recognizing this during assessment reframes early treatment ruptures not as failure but as expected, workable material. Clinicians need not administer formal attachment instruments to gather useful data; thoughtful questions about who was reliably present in childhood, who the client turned to when frightened or hurt, and how relationships have generally felt across life yield a serviceable picture of attachment organization and its likely expression in the alliance.</p>
<p>Functional impairment, meanwhile, is the dimension that most directly answers the questions clients and systems actually care about: how is this affecting daily life, work, relationships, and self-care? Symptom severity and functional impairment are correlated but not identical — two clients with similar PTSD scores may differ markedly in whether they can hold a job, maintain relationships, or care for children. Standardized functional assessment, such as the WHODAS 2.0, captures impairment across cognition, mobility, self-care, getting along with others, life activities, and participation in society, and it does so in a cross-diagnostic way that tracks change over the course of treatment. Functional data also grounds documentation in observable, defensible terms and supports medical-necessity justifications without requiring exposure of sensitive narrative detail. Assessing function is, in this sense, both clinically and ethically efficient.</p>
<p>Integrating attachment, function, symptoms, somatic and dissociative findings, strengths, and cultural context into a single working formulation is the intellectual core of trauma-informed assessment. The formulation is a hypothesis — explicitly revisable — about how this particular person came to present as they do and what is most likely to help. A useful formulation answers several questions at once: What happened, in broad and contextualized terms? How did developmental timing and relational buffering shape its impact? How does the trauma express itself now across the symptom, somatic, dissociative, and functional domains? What strengths and resources can treatment mobilize? And what cultural meanings frame both the suffering and the path to healing? When these threads are woven together, the assessment stops being a stack of scores and becomes a map for treatment — one that tells the clinician not only what is wrong but where to begin, how fast to go, and what to build on.</p>`
        },
        {
          type: 'accordion',
          accordionItems: [
            {
              title: 'Assessing attachment without formal instruments',
              content: '<p>Attachment history predicts how a client will experience the therapeutic relationship itself, including early ruptures and testing behavior. You need not administer formal attachment measures to gather useful data: ask who was reliably present in childhood, who the client turned to when frightened or hurt, and how relationships have generally felt across life. The resulting picture of attachment organization helps you anticipate alliance dynamics and reframe early ruptures as expected, workable material rather than failure.</p>'
            },
            {
              title: 'Why functional impairment is its own domain',
              content: '<p>Symptom severity and functional impairment are correlated but not identical: two clients with similar PTSD scores may differ greatly in whether they can work, sustain relationships, or care for dependents. Functional assessment answers the questions clients and systems care about most. The WHODAS 2.0 captures impairment across cognition, mobility, self-care, getting along, life activities, and social participation, tracks change over treatment, and grounds documentation in observable terms without exposing sensitive narrative detail.</p>'
            },
            {
              title: 'Dimensional and transdiagnostic thinking',
              content: '<p>Trauma sequelae rarely respect diagnostic boundaries. A survivor of chronic childhood maltreatment may show features spanning PTSD, complex PTSD, depression, anxiety, somatic symptom disorder, and personality-level difficulties without cleanly meeting any single set of criteria. Tracking the nature, severity, and impact of trauma responses across mood regulation, self-concept, interpersonal functioning, somatic experience, and sense of safety yields a richer and more treatment-relevant picture than asking only whether a categorical PTSD threshold is met.</p>'
            },
            {
              title: 'The working formulation as a revisable hypothesis',
              content: '<p>A formulation is an explicitly revisable hypothesis about how this person came to present as they do and what is most likely to help. It weaves together what happened (contextualized), how developmental timing and buffering shaped impact, how trauma expresses across symptom, somatic, dissociative, and functional domains, what strengths can be mobilized, and what cultural meanings frame the suffering and the healing. Done well, it converts a stack of scores into a map that indicates where to begin, how fast to go, and what to build on.</p>'
            }
          ]
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
          type: 'text',
          content: `<p>The defining feature of trauma-informed assessment is not which instruments are used but how the entire process is conducted. A clinician can administer every validated measure in the field and still retraumatize a client through a cold, interrogative, or rushed manner; conversely, a clinician with a single sheet of paper and genuine attunement can gather rich, accurate data while strengthening the therapeutic relationship. Several principles, drawn from SAMHSA's trauma-informed care framework, organize this stance. The first is safety — physical, emotional, and relational. Before any substantive history is taken, the client should understand where they are, who the clinician is, what will happen with the information, and that they remain in control of the pace. A simple orientation at the outset — describing confidentiality and its limits, naming that some questions may touch on difficult experiences, and explicitly inviting the client to pause or decline — does more to enable honest disclosure than any clever question.</p>
<p>The second principle is choice and collaboration. Trauma is, at its core, an experience of powerlessness; assessment that reproduces powerlessness is countertherapeutic. The trauma-informed clinician shares control wherever possible: offering the client a say in where to begin, signaling that any question can be set aside for later, and framing the assessment as something done with the client rather than to them. Transparency reinforces this. Explaining why a particular question is being asked — "I ask everyone about their early relationships because it helps me understand how to be most useful to you" — demystifies the process and reduces the sense of being examined. Collaboration also means treating the client as the expert on their own experience, eliciting their language for what they have lived through rather than imposing clinical labels they may not recognize or accept.</p>
<p>The third principle is pacing and titration. Disclosure should be metered to the client's window of tolerance{{callout:window-tolerance}}, not the clinician's intake template. This means beginning with less activating material — present-day functioning, current supports, strengths — before moving toward exposure history, and watching continuously for signs that the client is leaving their window: escalating arousal, or the flat, distant quality of shutdown. When such signs appear, the skilled clinician slows down, grounds, and may table the material entirely. Crucially, the assessment does not have to be completed in one sitting; distributing it across two or three sessions is often the more clinically sound choice for complex histories. Every assessment session should end with deliberate stabilization so that the client leaves regulated rather than raw. These principles are not soft additions to a technical process; they are the conditions under which accurate data can be gathered at all, because a dysregulated or mistrustful client cannot report reliably.</p>`
        },
        {
          type: 'accordion',
          accordionItems: [
            {
              title: 'Safety: the precondition for disclosure',
              content: '<p>Safety in assessment is physical, emotional, and relational. Orient the client at the outset: who you are, what will happen, how confidentiality works and where its limits lie, and that some questions may touch difficult ground. Make explicit that the client may pause, skip, or stop at any time. This orientation is not a formality — it is what makes honest disclosure possible, because a client who does not feel safe will, appropriately, withhold.</p>'
            },
            {
              title: 'Choice and collaboration',
              content: '<p>Because trauma is an experience of powerlessness, assessment that restores agency is itself therapeutic. Share control: let the client influence where to begin and what to defer, frame the process as done with them rather than to them, and treat them as the expert on their own life. Eliciting the client\'s own words for their experience, rather than imposing diagnostic labels, both respects autonomy and yields more accurate, less defended information.</p>'
            },
            {
              title: 'Transparency',
              content: '<p>Explaining the purpose behind questions reduces the sense of being interrogated. A brief rationale — for example, that you ask everyone about early relationships because it informs how best to help — demystifies the process and builds trust. Transparency also means being honest about documentation: clients have a right to understand, in general terms, what will be recorded and why, which supports informed and voluntary disclosure.</p>'
            },
            {
              title: 'Pacing, titration, and stabilization',
              content: '<p>Disclosure should follow the client\'s window of tolerance, not the intake template. Begin with less activating material, watch continuously for hyperarousal or shutdown, and slow or table content when those signs appear. Spreading assessment across two or three sessions is often the sounder choice for complex histories. End every session with deliberate grounding and stabilization so the client leaves regulated rather than raw.</p>'
            }
          ]
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
          type: 'text',
          content: `<p>Translating somatic awareness into routine assessment practice does not require a clinician to become a somatic therapist; it requires building a habit of dual attention — listening to the client's words while also tracking the body that is speaking them. In practice this means noticing, without comment at first, when a client's breath catches, when their hands grip the chair, when their gaze drifts and their voice flattens, or when a particular topic is met with sudden stillness. These shifts are data about the client's autonomic state and window of tolerance in real time, and they often reveal far more than the content of the answers. A client may say "I'm fine talking about it" while their body organizes into a freeze; the trauma-informed clinician trusts the body's report and adjusts pacing accordingly. Over time, learning to read these cues allows the clinician to titrate the assessment moment by moment, slowing or shifting before a client crosses into dysregulation rather than after.</p>
<p>Somatic observation also enriches documentation and formulation in ways that pure self-report cannot. Functional, descriptive language about the body — "speech slowed and became halting when describing the home environment; posture collapsed; eye contact decreased" — captures clinically meaningful information without interpretation or pathologizing, and it can be revisited as a baseline against which to measure later change. It is important, however, to hold somatic observations as hypotheses rather than conclusions. There is no fixed dictionary in which a given posture means a given trauma; bodily presentation is shaped by culture, by physical health, by neurodivergence, and by countless individual factors. The clinical value of somatic data lies not in decoding it definitively but in using it to stay attuned, to pace responsibly, and to generate questions worth exploring collaboratively with the client.</p>
<p>The same dual attention applies to the clinician's own body. Trauma assessment is relational and affecting, and clinicians are not immune to activation, vicarious distress, or the subtle pull to either avoid difficult material or, conversely, to probe for more than the client can safely give. Noticing one's own breath, tension, and impulses during an assessment is part of trauma-informed practice: it guards against unconsciously rushing past a client's distress, and it models the regulated, present nervous system that helps a dysregulated client settle. A clinician who can stay grounded — neither flinching from the material nor pressing into it — offers the client a co-regulating presence that is, in itself, part of what makes accurate and safe assessment possible.</p>`
        },
        {
          type: 'accordion',
          accordionItems: [
            {
              title: 'Dual attention: tracking words and body together',
              content: '<p>Trauma-informed assessment means listening to the client\'s words while also tracking the body speaking them — a caught breath, gripped hands, a drifting gaze, sudden stillness. These shifts report on autonomic state and window of tolerance in real time and often reveal more than the verbal content. When a client says they are fine while the body organizes into freeze, trust the body\'s report and adjust pacing. This skill lets the clinician titrate moment by moment, slowing before dysregulation rather than after.</p>'
            },
            {
              title: 'Somatic observations as hypotheses, not conclusions',
              content: '<p>There is no fixed dictionary in which a given posture decodes to a given trauma. Bodily presentation is shaped by culture, physical health, neurodivergence, and individual factors. The value of somatic data is not in decoding it definitively but in using it to stay attuned, pace responsibly, and generate questions to explore collaboratively. Document somatic findings in functional, descriptive language as data points, never as interpretive labels.</p>'
            },
            {
              title: 'The clinician\'s own nervous system',
              content: '<p>Assessment is relational and affecting; clinicians experience activation, vicarious distress, and pulls to either avoid difficult material or probe for more than a client can safely give. Noticing one\'s own breath, tension, and impulses guards against unconsciously rushing past distress and models a regulated nervous system that helps a dysregulated client settle. A grounded clinician — neither flinching from nor pressing into the material — provides co-regulating presence that is itself part of safe, accurate assessment.</p>'
            }
          ]
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
          type: 'text',
          content: `<p>Dissociation deserves a fuller treatment in assessment than it usually receives, because it is both common in chronic trauma and routinely missed. The structural theory of dissociation, developed by van der Hart, Nijenhuis, and Steele, offers a clinically useful way to understand the spectrum. In its milder forms, dissociation appears as everyday detachment — losing time on a familiar drive, feeling foggy or far away under stress, watching oneself as if from a distance. In trauma-related conditions it becomes more organized and more disruptive: a person may experience parts of self that hold trauma separately from the part that manages daily life, may lose access to memory for periods or events, or may shift state abruptly in response to reminders. Because a moderately dissociative client can present as calm, articulate, and even insightful while not actually accessing their traumatic material, the standard verbal interview can produce a deceptively unremarkable picture. Screening with the Dissociative Experiences Scale, and attending to in-session markers such as glazing over, sudden flatness, slowed or halted speech, and gaps in autobiographical memory, is what brings this domain into view.</p>
<p>The clinical stakes of detecting dissociation are high because it directly determines whether trauma processing is safe to begin. A client with significant dissociation lacks, at the outset, the internal integration required to metabolize trauma material; pushing into detailed processing before stabilization can precipitate flooding, state switching, self-harm, or broader decompensation. The widely accepted standard of care is phase-based treatment, in which a substantial first phase of safety, stabilization, affect-regulation skill-building, and resource development precedes any focused trauma processing. Assessment is what tells the clinician where on this map a client begins. A careful dissociation assessment is therefore not an academic exercise; it is the single most important input into the question of pacing and sequencing, and getting it wrong is one of the more common ways that well-intentioned trauma treatment causes harm.</p>
<p>Detecting dissociation also reframes a number of presentations that are otherwise easy to misread. A client who seems inconsistent from session to session, who reports symptoms that do not cohere, who cannot remember what was discussed previously, or who responds to certain topics with sudden disengagement is often not unmotivated, resistant, or characterologically difficult — they may be dissociating. Treatment-resistant depression and anxiety, eating-disordered behavior, and self-injury frequently overlay an unrecognized dissociative process. When dissociation is identified and named with the client in a normalizing, non-frightening way — as an understandable adaptation that once helped them survive — assessment itself can become the first therapeutic intervention, replacing self-blame with a coherent and compassionate account of how their mind learned to protect them.</p>`
        },
        {
          type: 'accordion',
          accordionItems: [
            {
              title: 'The dissociation spectrum',
              content: '<p>Dissociation ranges from everyday detachment — losing time on a familiar drive, feeling foggy under stress, watching oneself from a distance — to more organized, disruptive forms in which trauma is held by parts of self separate from the daily-functioning self, memory is lost for periods or events, or state shifts abruptly in response to reminders. Because a moderately dissociative client can present as calm and articulate while not accessing traumatic material, the standard interview can look deceptively unremarkable.</p>'
            },
            {
              title: 'Why dissociation determines treatment sequencing',
              content: '<p>A significantly dissociative client lacks the internal integration to metabolize trauma material at the outset; premature processing risks flooding, state switching, self-harm, or decompensation. Phase-based treatment — a substantial first phase of safety, stabilization, affect-regulation, and resource-building before focused trauma processing — is the standard of care. Assessment of dissociation tells the clinician where a client begins on this map and is the single most important input into pacing decisions.</p>'
            },
            {
              title: 'Presentations dissociation can explain',
              content: '<p>Inconsistency across sessions, incoherent symptom reports, inability to recall prior discussions, and sudden disengagement around certain topics often reflect dissociation rather than resistance or difficult character. Treatment-resistant depression and anxiety, eating-disordered behavior, and self-injury frequently overlay an unrecognized dissociative process. Identifying and naming dissociation with the client in a normalizing way — as an adaptation that once helped them survive — can itself be a first therapeutic intervention.</p>'
            }
          ]
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
          type: 'text',
          content: `<p>Culturally responsive assessment is best understood as a stance of cultural humility{{callout:cultural-humility}} rather than a checklist of cultural facts. Cultural competence, framed as accumulating knowledge about how members of a given group think and behave, risks sliding into stereotype and can leave a clinician confidently wrong about the person actually in the room. Cultural humility, by contrast, is a lifelong posture of self-reflection, openness, and willingness to be taught by the client about what their experience means. In assessment this translates into concrete behaviors: asking rather than assuming, eliciting the client's own explanatory model of their distress, noticing and setting aside one's own reflexive interpretations, and treating moments of confusion or mismatch as invitations to inquire rather than as data confirming a category. The Cultural Formulation Interview provides a structured way to do this, but the underlying disposition matters more than any single instrument.</p>
<p>Several practical commitments operationalize this stance. First, inquire about idioms of distress in the client's own words, since constructs like depression, anxiety, and trauma may not map onto how the client understands their suffering, and a great deal of distress in many communities is expressed somatically. Second, ask about explanatory models — what the client believes caused their difficulties, what they fear, and what they expect or hope will help — because these beliefs shape engagement and adherence as much as any diagnosis. Third, attend to the cultural dimensions of the clinician-client relationship itself, including how differences in background, language, and power may affect what the client feels able to disclose. Fourth, recognize that for many clients institutional mistrust is well-founded, rooted in real histories of mistreatment, and that earning trust is part of the assessment task rather than a precondition for it.</p>
<p>Finally, culturally responsive assessment requires holding individual and collective levels of trauma together. For many clients, the most significant traumatic material is not a discrete personal event but an ongoing condition — racialized stress, the precarity of undocumented status, the aftermath of forced migration, or the inherited weight of historical trauma carried across generations. These do not fit neatly into event-based PTSD frameworks, yet they are profoundly consequential and frequently invisible to assessment that asks only about individual incidents. Routinely inquiring about experiences of discrimination, family histories of loss and displacement, and the client's relationship to community and cultural belonging brings these dimensions into the assessment where they belong. The aim throughout is not to become an expert in every culture, which is impossible, but to remain genuinely curious, humble, and guided by the client's own understanding of what has shaped them and what healing would mean.</p>`
        },
        {
          type: 'accordion',
          accordionItems: [
            {
              title: 'Cultural humility versus cultural competence',
              content: '<p>Framing cultural competence as accumulated knowledge about groups risks stereotype and can leave a clinician confidently wrong about the person in the room. Cultural humility is a lifelong posture of self-reflection, openness, and willingness to be taught by the client. In assessment it means asking rather than assuming, eliciting the client\'s own explanatory model, setting aside reflexive interpretations, and treating confusion or mismatch as an invitation to inquire rather than as confirmation of a category.</p>'
            },
            {
              title: 'Eliciting idioms of distress and explanatory models',
              content: '<p>Constructs like depression, anxiety, and trauma may not map onto how a client understands their suffering, and much distress is expressed somatically. Ask about distress in the client\'s own words, and ask about their explanatory model — what they believe caused their difficulties, what they fear, and what they hope will help. These beliefs shape engagement and adherence as much as any diagnosis, and surfacing them early prevents misattribution and premature labeling.</p>'
            },
            {
              title: 'Holding individual and collective trauma together',
              content: '<p>For many clients the most significant material is not a discrete event but an ongoing condition — racialized stress, the precarity of undocumented status, the aftermath of forced migration, or inherited historical trauma. These do not fit event-based PTSD frameworks yet are profoundly consequential and easily missed by assessment that asks only about individual incidents. Routinely inquire about discrimination, family histories of loss and displacement, and the client\'s relationship to community and cultural belonging.</p>'
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
          type: 'text',
          content: `<p>Perhaps the most important ethical principle in trauma assessment is the obligation to avoid re-traumatization — the iatrogenic harm that occurs when the assessment process itself reactivates traumatic states or compels disclosure the client is not yet resourced to manage. Re-traumatization is not rare or exotic; it is a routine risk whenever a clinician, eager for a complete history, asks a recently met client to narrate their worst experiences in detail. The traumatic memory is not a neutral file to be retrieved on request. For many survivors, recounting events can pull them out of the present and into the implicit, sensory, autonomic reality of the original experience, leaving them flooded, dissociated, or destabilized — sometimes for days. An assessment that produces a thorough trauma inventory at the cost of a decompensated client has failed, regardless of how complete the chart appears.</p>
<p>The core protective skill is titrating disclosure: gathering the clinically necessary information about the presence, type, timing, and impact of traumatic experiences without requiring a detailed narrative of the events themselves. In most assessment contexts the clinician does not need to know exactly what happened in order to plan treatment; they need to know that something happened, roughly when and for how long, and how it affects the client's present functioning, regulation, relationships, and sense of safety. Behavioral and functional framing accomplishes this. "Did something happen that was very frightening or dangerous?" and "How does that experience affect you now?" gather the necessary signal while leaving the depth and detail of disclosure under the client's control. If a client begins to spill into a detailed account with rising distress, the trauma-informed response is to gently slow the flow — acknowledging the importance of what they are sharing while protecting them from being overwhelmed — rather than to lean in for more.</p>
<p>Finally, assessment is not an end in itself; its purpose is to inform a case formulation and a treatment plan. A formulation integrates the assessment data into a coherent, individualized account: what this person experienced, how it was buffered or compounded by developmental and relational context, how it manifests across symptom, somatic, dissociative, and functional domains, what strengths and resources are available, and what cultural meanings shape the whole. From this integrated picture flows a treatment plan with appropriate sequencing. The single most consequential assessment finding for sequencing is the presence and degree of dissociation and affect dysregulation, because these determine whether a client can tolerate trauma processing or must first complete a phase of stabilization and resource-building. A client with significant dissociation routed prematurely into exposure-based processing is at real risk of destabilization; the same client, accurately assessed and offered phase-based care, can do well. In this sense, comprehensive trauma assessment is not paperwork that precedes the real work — it is the clinical reasoning that makes the real work safe and effective.</p>`
        },
        {
          type: 'accordion',
          accordionItems: [
            {
              title: 'How re-traumatization happens in assessment',
              content: '<p>Re-traumatization occurs when the assessment process itself reactivates traumatic states or compels disclosure a client cannot yet manage. Asking a newly met client to narrate their worst experiences in detail can pull them from the present into the sensory, autonomic reality of the original event, leaving them flooded or dissociated — sometimes for days. A complete trauma inventory obtained at the cost of a decompensated client is not a successful assessment.</p>'
            },
            {
              title: 'Titrating disclosure',
              content: '<p>The protective skill is to gather necessary information — the presence, type, timing, and impact of experiences — without requiring a detailed narrative of the events themselves. Most treatment planning needs to know that something happened, roughly when and for how long, and how it affects present functioning. Behavioral, functional framing keeps the depth of disclosure under the client\'s control. If a client begins to flood, gently slow the flow rather than leaning in for more detail.</p>'
            },
            {
              title: 'From assessment to case formulation',
              content: '<p>A formulation integrates assessment data into a coherent, individualized account: what the person experienced, how developmental and relational context buffered or compounded it, how it manifests across symptom, somatic, dissociative, and functional domains, what strengths exist, and what cultural meanings shape the picture. The formulation — not a raw list of events or scores — is what guides treatment, and it is the clinician\'s integrating work, not the output of any single instrument.</p>'
            },
            {
              title: 'Using assessment to sequence treatment',
              content: '<p>The most consequential finding for sequencing is the presence and degree of dissociation and affect dysregulation. These determine whether a client can tolerate trauma processing or must first complete a stabilization and resource-building phase. A significantly dissociative client routed prematurely into exposure-based processing risks destabilization; accurately assessed and offered phase-based care, the same client can do well. Assessment is the reasoning that makes treatment safe, not paperwork that precedes it.</p>'
            }
          ]
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
  if(!process.env.MONGODB_URI){ console.error('MONGODB_URI not set'); process.exit(1); }
  await mongoose.connect(process.env.MONGODB_URI);
  // schema requires an explicit order on every section and content block
  COURSE.sections.forEach((s,si)=>{ if(s.order==null)s.order=si; (s.contentBlocks||[]).forEach((b,bi)=>{ if(b.order==null)b.order=bi; }); });
  let doc = await InteractiveCourse.findOne({ slug: SLUG });
  const action = doc ? 'Updated' : 'Inserted';
  if(doc){ doc.set(COURSE); } else { doc = new InteractiveCourse(COURSE); }
  await doc.save(); // fires pre-save hook -> canonical wordCount, totalContentBlocks; runs schema validation
  const floor = doc.ceHours*6000;
  const flag = doc.wordCount < floor ? '  \u26a0\ufe0f BELOW FLOOR' : '';
  console.log(`\u2705 ${action}: ${doc.courseCode} | ${doc.wordCount}w (floor ${floor}) | ${doc.totalContentBlocks} blocks | ${doc.sections.length} sec${flag}`);
  await mongoose.disconnect();
}
main().catch(e=>{ console.error('\u274c', e.message); process.exit(1); });
