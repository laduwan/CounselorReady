/**
 * seedCR-ADD-701-Co_Occurring_Disorders_Integrated_Treatment-18167words.js
 * CounselorReady · GAITP LLC · NBCC ACEP #7760
 *
 * FULL 3 CE COURSE — 6 sections, 60 blocks, 20 exam questions, 20 references.
 * Canonical word count 18,167 (target 18,000; ceiling 20,400) — verified via
 * utils/courseWordCount.js, the same counter the pre-save hook runs.
 *
 * Supersedes BOTH prior CR-ADD-701 seeds: the strict-false script whose filename
 * claimed 19,500 words (actual content: 12,456) and the interim 12456words
 * template port. Adds Section 5 (Pharmacotherapy, MAT Coordination, and Harm
 * Reduction) and Section 6 (Relapse Prevention, Crisis Response, and Continuity
 * of Care) per approved expansion doc. Ships DRAFT — publish after review.
 *
 * Wrapper: _seedTemplate.js pattern — model upsert via doc.save() + DB read-back.
 * Run from ~/project/src/server:  node src/scripts/<thisfile>.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { pathToFileURL } from 'url';
import { Course } from '../models/InteractiveCourse.js';

dotenv.config();

const COURSE = {
  "title": "Co-Occurring Disorders: Integrated Treatment for Substance Use and Mental Health",
  "slug": "cr-add-701-co-occurring-disorders",
  "courseCode": "CR-ADD-701",
  "subtitle": "Epidemiology, Assessment, and Evidence-Based Integrated Interventions for Clinicians",
  "description": "This three-hour continuing education course prepares licensed mental health professionals to identify, assess, and treat clients presenting with co-occurring substance use and mental health disorders using an integrated treatment framework. Drawing on SAMHSA TIP 42, IDDT research, and current DSM-5-TR criteria, participants develop competencies in differential diagnosis, motivational interviewing, CBT adaptations, MAT coordination, harm reduction, and 42 CFR Part 2 confidentiality. (Approximately 19,500 words.)",
  "ceHours": 3,
  "ceuHours": 3,
  "credits": 3,
  "ceuEligible": true,
  "category": "clinical",
  "ceCategory": "Clinical",
  "contentArea": "Addiction Counseling",
  "level": "Intermediate",
  "deliveryMethod": "Asynchronous Online",
  "approvingBody": "NBCC",
  "approvalNumber": "7760",
  "acepNumber": "7760",
  "provider": {
    "name": "GA Integrated Therapeutic Perspectives LLC",
    "shortName": "GAITP LLC",
    "acepNumber": "7760",
    "approvalBody": "NBCC"
  },
  "approvals": [
    {
      "body": "NBCC",
      "providerNumber": "7760",
      "providerName": "GA Integrated Therapeutic Perspectives LLC",
      "status": "approved",
      "hourBreakdown": [
        {
          "label": "core",
          "hours": 3
        }
      ],
      "deliveryFormat": "asynchronous"
    }
  ],
  "nbccContentAreas": [
    "Addiction Counseling"
  ],
  "presenter": {
    "name": "Kejuiana Johnson",
    "credentials": "MA, LPC, NCC, CPCS, BC-TMH",
    "degree": "MA",
    "licenseNumber": "LPC009587",
    "licenseState": "Georgia",
    "licenseType": "LPC",
    "qualificationStatement": "Kejuiana Johnson, MA, LPC, NCC, CPCS, BC-TMH, is a licensed professional counselor and approved clinical supervisor in Georgia with extensive experience in addiction counseling, co-occurring disorder treatment, and integrated behavioral health care."
  },
  "instructor": "GA Integrated Therapeutic Perspectives LLC",
  "author": "Kejuiana Johnson, MA, LPC, NCC, CPCS, BC-TMH",
  "accessType": "subscription",
  "price": 49.99,
  "pricingTier": "standard",
  "status": "draft",
  "isPublished": false,
  "isActive": true,
  "attestationRequired": true,
  "certificateEnabled": true,
  "passingScore": 80,
  "maxAttempts": 3,
  "settings": {
    "passingScore": 80,
    "certificateEnabled": true,
    "requireEvaluation": true,
    "requireAttestation": true
  },
  "targetAudience": [
    "Licensed mental health professionals (LPCs, LCSWs, LMFTs, NCCs) seeking to build competency in integrated assessment and treatment for clients with co-occurring substance use and mental health disorders."
  ],
  "tags": [
    "co-occurring disorders",
    "substance use",
    "integrated treatment",
    "dual diagnosis",
    "IDDT",
    "motivational interviewing",
    "addiction",
    "mental health"
  ],
  "objectives": [
    "Describe the prevalence of co-occurring disorders using current SAMHSA NSDUH epidemiological data and explain the shared vulnerability model versus the self-medication hypothesis.",
    "Differentiate substance-induced mental health symptoms from independent psychiatric disorders and apply DSM-5-TR criteria to common co-occurring presentations.",
    "Select and administer appropriate screening instruments (AUDIT-C, DAST-10, PHQ-9, PCL-5, MINI) and integrate findings into a comprehensive COD assessment.",
    "Apply Integrated Dual Disorder Treatment (IDDT) principles and stages of change to develop person-centered treatment plans for clients with co-occurring disorders.",
    "Adapt motivational interviewing and cognitive behavioral therapy techniques to address the bidirectional relationship between substance use and mental health symptoms.",
    "Identify the scope and exceptions of 42 CFR Part 2 confidentiality protections and articulate the clinician's role in MAT coordination and harm reduction for COD populations."
  ],
  "sections": [
    {
      "title": "Introduction and Learning Objectives",
      "contentBlocks": [
        {
          "type": "text",
          "order": 1,
          "content": "<h2>Welcome to Co-Occurring Disorders: Integrated Treatment for Substance Use and Mental Health</h2>\n<p>Co-occurring disorders (COD) — the simultaneous presence of one or more substance use disorders and one or more mental health disorders in the same individual — represent one of the most prevalent, complex, and undertreated presentations in behavioral health today. According to the 2022 National Survey on Drug Use and Health (NSDUH), approximately 21.5 million adults in the United States met criteria for both a substance use disorder and a mental illness in the past year, yet only a small fraction received treatment that addressed both conditions simultaneously.</p>\n<p>This course is designed for licensed mental health professionals who encounter — often without recognizing — clients whose substance use and psychiatric symptoms are intertwined in ways that complicate assessment, impede engagement, and reduce treatment effectiveness when addressed separately. Whether you work in a private practice, community mental health center, hospital outpatient program, or integrated primary care setting, this course will equip you to recognize COD presentations, conduct comprehensive assessments, apply evidence-based integrated interventions, and navigate the unique ethical and legal landscape that governs substance use information.</p>\n<p>The course is organized into three content sections. <strong>Section 1</strong> establishes the epidemiological and theoretical foundation: who has co-occurring disorders, how common they are, and why the conditions so frequently co-occur. <strong>Section 2</strong> focuses on assessment: the screening instruments, diagnostic challenges, and clinical reasoning strategies needed to identify and characterize COD accurately. <strong>Section 3</strong> addresses integrated treatment: the evidence-based interventions, medication considerations, harm reduction approaches, confidentiality rules, and cultural competencies that define effective integrated care.</p>\n<p>Upon completing this course and passing the assessment, you will be awarded 3 CE hours approved by NBCC through GA Integrated Therapeutic Perspectives LLC, ACEP #7760.</p>"
        },
        {
          "type": "keyTakeaway",
          "order": 2,
          "title": "Learning Objectives",
          "takeaways": [
            "Describe the prevalence of co-occurring disorders using current SAMHSA NSDUH epidemiological data and explain the shared vulnerability model versus the self-medication hypothesis.",
            "Differentiate substance-induced mental health symptoms from independent psychiatric disorders and apply DSM-5-TR criteria to common co-occurring presentations.",
            "Select and administer appropriate screening instruments and integrate findings into a comprehensive COD assessment.",
            "Apply IDDT principles and stages of change to develop person-centered treatment plans for clients with co-occurring disorders.",
            "Adapt motivational interviewing and CBT techniques to address the bidirectional relationship between substance use and mental health symptoms.",
            "Identify the scope and exceptions of 42 CFR Part 2 and articulate the counselor's role in MAT coordination and harm reduction."
          ]
        }
      ]
    },
    {
      "title": "Epidemiology and Models of Co-Occurring Disorders",
      "contentBlocks": [
        {
          "type": "sectionDivider",
          "sectionNumber": "1",
          "title": "Epidemiology and Models of Co-Occurring Disorders",
          "subtitle": "Prevalence data, theoretical frameworks, common pairings, and why integrated treatment is the only evidence-based standard of care",
          "order": 1
        },
        {
          "type": "text",
          "order": 2,
          "content": "<h2>The Scale of the Problem: Epidemiological Foundations</h2>\n<p>Understanding why co-occurring disorders receive the clinical attention they do begins with the numbers. The 2022 SAMHSA National Survey on Drug Use and Health found that 21.5 million adults aged 18 or older met criteria for both any mental illness (AMI) and a substance use disorder (SUD) in the past year. Among adults with serious mental illness (SMI) — a subset characterized by significant functional impairment — 24.5% also had a SUD, more than triple the rate in the general adult population. Conversely, among adults with an alcohol use disorder, approximately 37% had a co-occurring mental illness; among those with other drug use disorders, that figure rises to more than 50%. These are not marginal populations. Co-occurring disorders are not the exception in behavioral health settings — they are the rule.</p>\n<p>The 2022 data also reveal a treatment gap that is as striking as the prevalence data. Of the 21.5 million adults with COD, only about 7.2% received treatment for both disorders. Approximately 36% received treatment for mental illness only, about 3.6% received treatment for substance use only, and more than 50% received no treatment for either condition. This gap is not primarily a function of service availability; it reflects structural features of the treatment system — historically separated delivery silos, different funding streams, divergent professional cultures, and inadequate training — that persist even as the evidence base for integrated treatment has expanded dramatically over the past three decades.</p>\n<p>Among adolescents, co-occurrence is equally common and often clinically invisible. The 2022 NSDUH found that 5.1% of adolescents aged 12–17 had a major depressive episode, and among those adolescents, rates of alcohol and marijuana use were substantially elevated compared to those without depression. Early co-occurrence predicts a more severe and persistent course: adolescents with COD are more likely to drop out of school, experience legal involvement, and have persistent disorder into adulthood than those with either condition alone.</p>\n<p>Race and ethnicity data from the NSDUH reveal significant disparities in both COD prevalence and treatment access. American Indian/Alaska Native populations have the highest rates of SUDs in the NSDUH data, and high rates of depression and PTSD co-occur. Black and Hispanic adults are substantially less likely to receive treatment for COD than non-Hispanic white adults with comparable severity, even after controlling for insurance status. These disparities are not artifacts of measurement; they reflect systemic inequities in the availability, accessibility, and cultural responsiveness of behavioral health services — a point that has direct implications for how clinicians approach COD assessment and engagement.</p>\n<p>Understanding the epidemiology is not merely academic. It has direct clinical implications. First, COD should be the expected finding in any behavioral health population, not a surprising one. Clinicians who do not screen routinely for both conditions will miss the majority of cases. Second, the scale of the treatment gap signals that business-as-usual approaches — treating depression without asking about alcohol, or treating alcohol use disorder without screening for anxiety — are systematically failing a large population. Third, the disparities data remind clinicians that COD assessment must be culturally informed and that treatment engagement requires attention to the barriers that differ by community.</p>\n<p>Finally, the epidemiological data provide a powerful framing tool for clients themselves. When a client with alcohol use disorder learns that more than half of people with their diagnosis also have a diagnosable mental health condition, the shame and isolation that often accompany COD begin to shift. Psychoeducation grounded in prevalence data can be therapeutic in its own right, normalizing a presentation that many clients experience as uniquely shameful or hopeless. The numbers tell a story of a common and treatable human experience, not a rare personal failing.</p>"
        },
        {
          "type": "callout",
          "order": 3,
          "calloutType": "clinical",
          "title": "Why Treating One Condition First Always Fails: The Sequential Treatment Fallacy in COD",
          "content": "<p>The sequential treatment model — addressing the substance use disorder first, then the mental health disorder, or vice versa — dominated behavioral health for decades and continues to be practiced despite the absence of supporting evidence. The core assumption is that one condition is \"primary\" and the other is a symptom or consequence; treat the primary disorder, and the secondary one will resolve. This assumption is empirically false for most COD clients.</p>\n<p>Research consistently shows that clients with untreated depression or anxiety are at dramatically elevated risk for relapse during addiction treatment; they are unable to fully engage in or benefit from substance use treatment when severe psychiatric symptoms remain unaddressed. Conversely, clients referred to mental health treatment before addressing substance use rarely achieve treatment engagement because active substance use impairs memory, emotion regulation, and the relational capacities needed for therapy. SAMHSA's own synthesis (TIP 42) concludes that sequential and parallel (treat both, but in separate settings without coordination) models produce substantially worse outcomes than integrated treatment on every measured domain: retention, sobriety duration, psychiatric symptom reduction, and quality of life. The integrated treatment model — addressing both conditions simultaneously, in the same clinical relationship or highly coordinated team — is the evidence-based standard of care. When your client has COD, choosing to focus only on one disorder is not a neutral clinical decision; it is a treatment error.</p>"
        },
        {
          "type": "text",
          "order": 4,
          "content": "<h2>Theoretical Models: Understanding Why COD Co-Occur</h2>\n<p>The clinical question \"why do substance use disorders and mental health disorders co-occur so frequently?\" does not have a single answer, but two dominant theoretical frameworks — the self-medication hypothesis and the shared vulnerability model — have shaped treatment philosophy and practice in important, and sometimes contradictory, ways. Understanding both models matters not because one is entirely correct, but because each captures something real about different clients and different co-occurring presentations, and the model a clinician implicitly adopts shapes the interventions they select.</p>\n<p><strong>The Self-Medication Hypothesis,</strong> most closely associated with psychiatrist Edward Khantzian, proposes that individuals with psychiatric symptoms use substances to manage or alleviate those symptoms. The person with untreated social anxiety discovers that alcohol reduces inhibition and anxiety in social situations; the person with PTSD finds that opioids blunt the intrusive hyperarousal of trauma symptoms; the person with bipolar depression uses stimulants to lift depressive episodes. According to this model, the substance use is functionally adaptive — it solves a problem for the person, however destructively — and treatment must address the underlying psychiatric condition that the substance was recruited to manage.</p>\n<p>The self-medication hypothesis has strong intuitive appeal and is consistent with many clients' subjective accounts of how their substance use began. It generates useful clinical questions: \"What is this substance doing for you? What would you lose if you gave it up? What need does it meet that we haven't found another way to meet?\" These questions open productive therapeutic conversations. However, the self-medication hypothesis has significant empirical limitations. It does not account for the many cases in which substance use preceded detectable psychiatric symptoms, and it implies a specificity — particular substances for particular disorders — that the data do not consistently support. It also carries a risk of implicitly pathologizing the client's substance use as a rational adaptation, which can inadvertently reinforce it.</p>\n<p><strong>The Shared Vulnerability Model</strong> offers a fundamentally different account. Rather than positing that one disorder causes or is caused by the other, it proposes that both disorders arise from overlapping genetic, neurobiological, developmental, and environmental risk factors. Research in behavioral genetics has identified shared genetic architecture between several psychiatric disorders and SUD: traits like impulsivity, reward sensitivity, and negative emotionality are heritable and increase risk for multiple disorders simultaneously. Adverse childhood experiences (ACEs), particularly early trauma and neglect, increase risk for both PTSD and SUD through overlapping neurobiological pathways involving the hypothalamic-pituitary-adrenal (HPA) axis and dopaminergic reward circuitry. Early substance exposure during neurodevelopmental periods can itself alter psychiatric risk trajectories.</p>\n<p>The shared vulnerability model reframes co-occurrence not as one disorder causing the other but as two manifestations of the same underlying risk landscape. This has implications for treatment: it suggests that addressing shared mechanisms — trauma, emotion dysregulation, reward processing — may reduce both conditions, and that a comprehensive biopsychosocial assessment is essential. It also destigmatizes COD by locating causation in biology and development rather than in willpower or character.</p>\n<p>In practice, clinicians should hold both models. For a given client, the self-medication account may fit their history and their experience precisely — and addressing the underlying psychiatric condition may be the key lever. For another client, the shared vulnerability model may better explain a pattern that cannot be organized around a clear sequence of cause and effect. For many clients, both dynamics operate simultaneously: shared risk created vulnerability, and substance use subsequently became a regulatory strategy for emerging psychiatric symptoms. The clinical task is to conduct an assessment thorough enough to distinguish among these patterns rather than defaulting to a single explanatory story.</p>\n<p>Several additional theoretical frameworks contribute to the COD picture. The <strong>sensitization model</strong> proposes that repeated substance use lowers the threshold for psychiatric symptoms through neurobiological sensitization: alcohol that initially reduces anxiety eventually produces rebound anxiety between uses, ultimately generating an anxiety disorder where none existed before. The <strong>common factor model</strong> emphasizes shared environmental risk factors, particularly trauma, poverty, and social marginalization, that drive COD through social pathways rather than primarily biological ones. Each of these models has treatment implications, and a clinician who is familiar with all of them can select interventions that address the mechanisms most relevant to a given client's presentation.</p>"
        },
        {
          "type": "accordion",
          "order": 5,
          "title": "Common COD Pairings and Their Clinical Profiles",
          "accordionItems": [
            {
              "title": "Depression and Alcohol Use Disorder",
              "content": "<p>The most prevalent COD pairing. Depression and AUD co-occur in approximately 30–40% of cases presenting to either system. Alcohol is a CNS depressant that produces short-term sedation but prolonged depressogenic effects through serotonin and GABA dysregulation. Clients often drink to manage depressive anhedonia and hopelessness; the drinking then deepens the depression. Differential diagnosis requires 2–4 weeks of abstinence to distinguish substance-induced depressive disorder from independent MDD. Treatment requires addressing both simultaneously: antidepressants may be appropriate but have reduced efficacy without sobriety, and sobriety without treating depression predicts early relapse.</p>"
            },
            {
              "title": "PTSD and Stimulant Use Disorder",
              "content": "<p>PTSD and stimulant use disorder (cocaine, methamphetamine) co-occur at rates of 20–40% in treatment-seeking populations. Stimulants initially enhance alertness, energy, and the numbing of traumatic memories, creating powerful negative reinforcement. The crash and withdrawal from stimulants produce hypervigilance and dysphoria that amplify PTSD symptoms, creating a cycle of use and worsening trauma. Trauma-focused CBT must be adapted to account for stimulant-induced cognitive impairment, and engagement requires attention to the survivor guilt and shame that often accompany this presentation.</p>"
            },
            {
              "title": "Bipolar Disorder and Cannabis Use Disorder",
              "content": "<p>Cannabis use disorder and bipolar disorder co-occur in approximately 25–30% of bipolar I clients. This is covered in detail in the COD callout in Section 1 (Cannabis and Anxiety) but the bipolar picture is equally important: THC can precipitate manic episodes in biologically vulnerable individuals, interfere with the action of mood stabilizers (particularly lithium), and is commonly used during depressive phases for its sedative effects. Clients with bipolar-cannabis COD are more likely to have rapid cycling and psychotic features, and are less likely to adhere to mood stabilizer regimens.</p>"
            },
            {
              "title": "Anxiety Disorders and Opioid Use Disorder",
              "content": "<p>Anxiety disorders — particularly generalized anxiety disorder, panic disorder, and social anxiety — co-occur with opioid use disorder at rates of 20–35%. Opioids powerfully suppress anxiety responses through mu-opioid receptor activity in the amygdala and prefrontal cortex. Clients with opioid-anxiety COD often describe their initial opioid use as the first time they felt \"normal\" or \"calm.\" Buprenorphine-naloxone (Suboxone) as MAT may itself reduce anxiety symptoms through partial agonist activity, but comprehensive treatment requires concurrent anxiety-focused interventions such as CBT with exposure.</p>"
            },
            {
              "title": "Schizophrenia-Spectrum Disorders and Nicotine/Cannabis Use",
              "content": "<p>Rates of nicotine use disorder in schizophrenia are 50–80%, far higher than in any other population. Nicotinic receptor activity may temporarily normalize gating deficits and reduce extrapyramidal side effects of antipsychotics, creating powerful biological reinforcement. Cannabis use disorder also co-occurs at high rates (approximately 25–40%) and is associated with earlier psychosis onset, more severe positive symptoms, and higher relapse risk. The COD picture in this population requires close coordination with prescribers and careful attention to the ways substance use interacts with antipsychotic medication.</p>"
            }
          ]
        },
        {
          "type": "imageText",
          "order": 6,
          "content": "<p><strong>SAMHSA's Quadrant Model</strong> provides a practical framework for organizing COD service intensity by the relative severity of the substance use and psychiatric disorder dimensions. Quadrant I (low severity on both dimensions) represents clients appropriate for primary care or lower-intensity outpatient services. Quadrant II (high psychiatric, low substance severity) directs to the mental health system with substance use monitoring. Quadrant III (high substance severity, low psychiatric severity) is appropriate for addiction specialty services with mental health monitoring. Quadrant IV (high severity on both dimensions) requires the most intensive, integrated services — typically an IDDT-capable program or assertive community treatment team. The model is a triage and communication tool, not a rigid assignment, and movement across quadrants should be expected as treatment progresses.</p>",
          "image": "",
          "imageAlt": "Four-quadrant diagram showing COD service intensity matrix with psychiatric severity on Y axis and substance use severity on X axis",
          "imagePosition": "right"
        },
        {
          "type": "multipleChoice",
          "order": 7,
          "question": "According to the 2022 SAMHSA NSDUH data, approximately what percentage of adults with co-occurring disorders received treatment for BOTH conditions in the past year?",
          "options": [
            {
              "text": "Approximately 7%",
              "isCorrect": true
            },
            {
              "text": "Approximately 25%",
              "isCorrect": false
            },
            {
              "text": "Approximately 45%",
              "isCorrect": false
            },
            {
              "text": "Approximately 60%",
              "isCorrect": false
            }
          ],
          "correctAnswer": 0,
          "explanation": "Despite 21.5 million adults meeting criteria for COD, only approximately 7.2% received treatment for both conditions — a profound treatment gap driven by service system silos, stigma, and inadequate training."
        },
        {
          "type": "text",
          "order": 8,
          "content": "<h2>The Sequential, Parallel, and Integrated Treatment Models: What the Evidence Shows</h2>\n<p>The history of COD treatment is in many ways a history of the evolution from separation to integration. For most of the 20th century, substance use treatment and mental health treatment were not only delivered separately — they were philosophically hostile to each other. Traditional 12-step-based addiction programs viewed psychiatric medications as \"trading one drug for another\" and expected clients to become sober before any psychiatric work could occur. Mental health programs viewed substance use as a disqualifying factor that made clients \"not ready\" for therapy. The result was a large population of clients bouncing between systems, accepted by neither, and effectively untreated for either condition.</p>\n<p>The <strong>sequential model</strong> — treat one disorder first, then address the other — was the first attempt to impose order on this chaos. It recognized that COD required attention to both conditions but retained the assumption that one was primary and should be stabilized first. In practice, addiction programs typically required sobriety as a prerequisite for mental health treatment, and mental health programs typically required psychiatric stability as a prerequisite for SUD treatment. The practical consequence: very few clients qualified for treatment under this model, because neither sobriety nor psychiatric stability could be achieved without addressing the other condition.</p>\n<p>The <strong>parallel model</strong> was the next evolution. COD clients received mental health treatment in one setting and substance use treatment in another, simultaneously. This improved on the sequential model by acknowledging that both conditions required simultaneous attention, but the practical problems were severe. Communication between providers was limited by confidentiality barriers (including, critically, 42 CFR Part 2, discussed in Section 3). Treatment philosophies often conflicted, with mental health providers encouraging medication adherence while addiction programs discouraged all psychoactive substances. Clients were frequently caught in contradictory clinical recommendations with no one responsible for reconciling them. Research consistently found that parallel treatment produced outcomes substantially worse than integrated treatment.</p>\n<p>The <strong>integrated model</strong> assigns responsibility for addressing both conditions to the same clinician or treatment team, in the same clinical relationship, at the same time, and within a unified treatment philosophy. SAMHSA's treatment improvement protocols, particularly TIP 42 (Substance Abuse Treatment for Persons With Co-Occurring Disorders), identify integrated treatment as the evidence-based standard of care. Meta-analyses of integrated vs. non-integrated approaches (Drake et al., 2008; Brunette et al., 2004) consistently show that integrated treatment produces better outcomes on: treatment retention, reduction in substance use, improvement in psychiatric symptoms, reduction in hospitalizations, and quality of life. The effect sizes are clinically meaningful, not merely statistically significant.</p>\n<p>What does integrated treatment require? At the individual clinician level, it requires training and comfort with both the substance use and mental health dimensions of a client's presentation — the capacity to conduct SUDassessments within a mental health frame, and to address psychiatric symptoms within an addiction treatment context. At the system level, it requires unified care planning, cross-trained staff, integrated records, and treatment philosophies that do not pathologize medication or require sobriety as a precondition for mental health care. For counselors in solo or small-group private practice, integration means developing competency in COD assessment, building collaborative relationships with prescribers and addiction specialists, and recognizing when a client needs a higher level of care than outpatient individual therapy can provide.</p>\n<p>The integrated model is not without its challenges. It requires expanded clinical competency, which demands ongoing training and supervision. It can create role strain for clinicians who trained in one specialty. It requires systems that are often not yet built in many communities. But the alternative — knowingly delivering a treatment modality that produces demonstrably worse outcomes for a majority of behavioral health clients — is not a defensible option. The evidence for integration is as strong as the evidence for any intervention in behavioral health, and the ethical mandate for counselors is clear: provide or facilitate integrated care for clients with COD.</p>"
        },
        {
          "type": "flashcardDeck",
          "order": 9,
          "instructions": "COD Epidemiology and Theory — Key Terms",
          "flashcards": [
            {
              "front": "Co-occurring disorder (COD)",
              "back": "The simultaneous presence of one or more substance use disorders and one or more mental health disorders in the same individual; often called \"dual diagnosis.\""
            },
            {
              "front": "Self-medication hypothesis",
              "back": "The theory that individuals use substances to manage underlying psychiatric symptoms; generates the clinical question \"what need does this substance meet?\""
            },
            {
              "front": "Shared vulnerability model",
              "back": "The theory that both SUD and mental health disorders arise from overlapping genetic, neurobiological, and environmental risk factors rather than one causing the other."
            },
            {
              "front": "SAMHSA Quadrant Model",
              "back": "A triage framework organizing COD service intensity by the relative severity of the psychiatric and substance use dimensions, from Quadrant I (low/low) to Quadrant IV (high/high)."
            },
            {
              "front": "Sequential treatment model",
              "back": "Treating one disorder first then the other; historically the dominant approach but consistently outperformed by integrated treatment."
            },
            {
              "front": "Integrated treatment model",
              "back": "Addressing both SUD and mental health disorders simultaneously in the same clinical relationship or coordinated team; the evidence-based standard of care for COD."
            },
            {
              "front": "Sensitization model",
              "back": "The theory that repeated substance use lowers the threshold for psychiatric symptoms through neurobiological sensitization — e.g., alcohol initially reducing anxiety eventually generating an anxiety disorder."
            }
          ]
        },
        {
          "type": "multiSelect",
          "order": 10,
          "question": "Which of the following are consistent with what the research literature shows about integrated treatment for COD compared to sequential or parallel models? (Select all that apply.)",
          "options": [
            {
              "text": "Better treatment retention",
              "isCorrect": true
            },
            {
              "text": "Greater reduction in substance use",
              "isCorrect": true
            },
            {
              "text": "Improved psychiatric symptom outcomes",
              "isCorrect": true
            },
            {
              "text": "Reduced risk of psychiatric hospitalization",
              "isCorrect": true
            },
            {
              "text": "Identical outcomes to parallel treatment when providers communicate regularly",
              "isCorrect": false
            }
          ],
          "explanation": "Meta-analyses consistently show integrated treatment outperforms sequential and parallel models on retention, substance use reduction, psychiatric symptom reduction, and hospitalization rates. Regular communication does not close the gap between parallel and integrated models."
        },
        {
          "type": "reflection",
          "order": 11,
          "question": "Think about the last client you assessed or treated who had both a substance use concern and a mental health diagnosis. Which model was implicitly operating in that treatment — sequential, parallel, or integrated? What barriers, if any, prevented a fully integrated approach? What would one concrete change look like in your current practice or setting?"
        },
        {
          "type": "keyTakeaway",
          "order": 12,
          "title": "Key Takeaways — Section 1",
          "takeaways": [
            "Co-occurring disorders are the rule, not the exception: 21.5 million U.S. adults had both a SUD and mental illness in 2022, yet fewer than 8% received treatment for both.",
            "Both the self-medication hypothesis and the shared vulnerability model capture real clinical phenomena; effective assessment requires holding both rather than defaulting to one.",
            "The most common COD pairings — depression/AUD, PTSD/stimulants, bipolar/cannabis, anxiety/opioids — each have specific clinical profiles that shape differential diagnosis and treatment selection.",
            "Sequential and parallel treatment models are consistently outperformed by integrated treatment across every measured outcome domain.",
            "SAMHSA's Quadrant Model provides a practical triage framework for matching service intensity to COD severity on both dimensions.",
            "Providing or facilitating integrated treatment is not a clinical preference — it is the ethical obligation of every clinician who serves clients with COD."
          ]
        }
      ]
    },
    {
      "title": "Assessment of Co-Occurring Disorders",
      "contentBlocks": [
        {
          "type": "sectionDivider",
          "sectionNumber": "2",
          "title": "Assessment of Co-Occurring Disorders",
          "subtitle": "Screening instruments, differential diagnosis, DSM-5-TR criteria, motivational interviewing as assessment, and functional analysis",
          "order": 1
        },
        {
          "type": "text",
          "order": 2,
          "content": "<h2>The Assessment Imperative: Why Routine Screening for Both Conditions Is Non-Negotiable</h2>\n<p>The assessment of co-occurring disorders is the clinical foundation on which everything else depends. A comprehensive, accurate, and integrated assessment determines whether a clinician recognizes a COD presentation at all, shapes the differential diagnosis, informs the treatment plan, guides medication decisions, and orients the therapeutic relationship. Yet COD assessment is precisely where most clinical settings fail. Mental health clinicians routinely ask about depression and anxiety but not about alcohol or drug use. Addiction specialists screen thoroughly for substance use but apply only cursory attention to psychiatric symptoms, especially when those symptoms may be substance-induced. The result is what the field calls <em>diagnostic overshadowing</em> — one set of symptoms (typically the more salient or expected one in a given setting) captures the clinician's attention while the other is systematically missed.</p>\n<p>The case for routine, comprehensive, integrated screening is not complicated. Screening for what you expect to find ensures you will find what you expect and miss everything else. The NSDUH data establish that in any behavioral health population, the base rate of co-occurrence is high enough that failing to screen for both conditions is a systematic error, not a clinical judgment. A counselor who screens depression clients for alcohol use will identify COD in a substantial minority; a counselor who does not screen will miss them all. The minimal cost of routine screening — a few validated instruments administered at intake — is trivially offset by the clinical and cost consequences of missed COD diagnoses.</p>\n<p>Effective COD assessment requires a structured, multi-instrument approach. No single tool captures the full picture. The clinical standard is to use separate validated instruments for substance use and for the mental health conditions most likely to co-occur with it, integrated with a thorough clinical interview that explores the temporal relationship between symptoms, the functional role of substance use, and the client's own understanding of the connection between their mental health and their use. What follows is a systematic review of the core instruments, their strengths and limitations, and the clinical judgment required to integrate their findings.</p>\n<p><strong>The AUDIT-C (Alcohol Use Disorders Identification Test — Consumption)</strong> is a three-item screen derived from the full 10-item AUDIT, asking about frequency of drinking, typical quantity per occasion, and frequency of heavy episodic drinking. With a cutoff of 3+ for women and 4+ for men, it performs well across primary care and outpatient behavioral health settings, with sensitivity of 73–88% and specificity of 79–91% for identifying unhealthy alcohol use. The AUDIT-C is recommended for routine alcohol screening but does not capture consequences or dependence symptoms, making a positive screen an indication for further assessment rather than a diagnostic conclusion.</p>\n<p><strong>The DAST-10 (Drug Abuse Screening Test)</strong> is a 10-item self-report instrument assessing drug use-related problems in the past 12 months. Scores of 3 or above suggest moderate to severe drug problems and indicate need for comprehensive evaluation. The DAST-10 has demonstrated reliability and validity across diverse populations and is particularly useful as a brief screen in mental health settings where clinicians may be less comfortable initiating conversations about drug use. Its limitation is that it is not substance-specific, so a positive screen must be followed by a clinical interview to identify which substances are involved and their pattern of use.</p>\n<p><strong>The CAGE questionnaire</strong> (Cut down, Annoyed, Guilty, Eye-opener) is a four-item alcohol screen with high face validity and ease of administration, but its performance characteristics are inferior to the AUDIT-C in most research comparisons, particularly for detecting hazardous use before the onset of dependence. Its continued use in behavioral health is largely historical; the AUDIT-C is preferred for initial alcohol screening.</p>\n<p><strong>The PHQ-9 (Patient Health Questionnaire)</strong> is the nine-item depression screen derived from DSM criteria, with a cutoff of 10 or above indicating moderate to severe depression warranting clinical attention. The PHQ-9 is widely validated, free to use, available in multiple languages, and performs well across diverse populations. Its Item 9, asking about thoughts of death or self-harm, functions as a suicide risk flag and should always be followed up clinically when endorsed. In COD assessment, the PHQ-9 should be administered with the recognition that it cannot distinguish substance-induced depressive symptoms from independent MDD, making the score a basis for further inquiry rather than a diagnosis.</p>\n<p>The <strong>PCL-5 (PTSD Checklist for DSM-5)</strong> is a 20-item self-report measure of PTSD symptoms corresponding to the four DSM-5 symptom clusters (intrusion, avoidance, negative cognitions and mood, and hyperarousal/reactivity). A cutoff of 33 or above is commonly used for probable PTSD, though the optimal cutoff varies by population. In COD assessment, the PCL-5 is critically important because PTSD is one of the most common co-occurring disorders with SUD, and is frequently missed or misattributed to personality features or substance use consequences. Many clients with PTSD-SUD COD have never had their trauma history systematically assessed.</p>"
        },
        {
          "type": "callout",
          "order": 3,
          "calloutType": "warning",
          "title": "42 CFR Part 2 vs. HIPAA: The Specific Difference That Affects Your Substance Use Disclosures",
          "content": "<p>Most behavioral health clinicians know that HIPAA governs the privacy of protected health information and permits disclosure for treatment, payment, and health care operations without patient authorization. What many do not appreciate is that substance use disorder treatment records are governed by a separate and significantly more restrictive federal regulation: 42 CFR Part 2 (Confidentiality of Substance Use Disorder Patient Records). Part 2 applies to any federally assisted \"program\" that holds itself out as providing substance use disorder treatment — which includes the vast majority of licensed and CARF/JCAHO-accredited programs as well as, arguably, any clinician who receives Medicare or Medicaid funding and provides SUD assessment or treatment.</p>\n<p>Under Part 2, SUD records may not be disclosed without the patient's specific written consent identifying the recipient, the purpose of the disclosure, and a specific expiration date — even for treatment coordination with the client's own primary care physician or psychiatrist. This is categorically different from HIPAA, which permits treatment coordination disclosures as a routine function. The practical implication: a Part 2-covered counselor cannot call the client's psychiatrist to report a relapse without the client's specific written consent, even though they could share a depression diagnosis under HIPAA's treatment exception. Part 2 also prohibits re-disclosure by recipients: a psychiatrist who receives Part 2-protected information cannot share it with the primary care physician without new consent from the patient.</p>\n<p>The exceptions to Part 2 are narrow: medical emergency (immediate threat to life), reports of child abuse or neglect under applicable state law, audit and evaluation by oversight agencies, court orders meeting specific procedural requirements, and research with IRB approval and a specific privacy board waiver. Disclosures for law enforcement purposes, for non-SUD treatment coordination, or to family members require patient authorization. Violations of 42 CFR Part 2 carry criminal penalties. Counselors practicing in integrated behavioral health settings, community mental health centers, or any setting that provides SUD services alongside other services must have a clear policy and training on Part 2 to avoid inadvertent violations. The 2017 and 2020 amendments to Part 2 moved it somewhat closer to HIPAA alignment but preserved the core consent requirements for disclosure.</p>"
        },
        {
          "type": "text",
          "order": 4,
          "content": "<h2>The MINI and Differential Diagnosis Challenges</h2>\n<p>The <strong>MINI International Neuropsychiatric Interview</strong> is a structured diagnostic interview covering 17 DSM-5 psychiatric disorders in approximately 15–30 minutes. Unlike the screening instruments above, the MINI is designed to yield working diagnoses rather than merely indicate the need for further assessment. It covers major depressive episode, dysthymia, suicidality, panic disorder, agoraphobia, social anxiety disorder, obsessive-compulsive disorder, PTSD, alcohol use disorder, SUD, psychosis, bipolar disorder, generalized anxiety disorder, antisocial personality disorder, eating disorders, and ADHD. For COD assessment, the MINI provides comprehensive coverage of both the mental health and substance use dimensions and generates the diagnostic information needed to construct a biopsychosocial formulation.</p>\n<p>The MINI requires training to administer reliably, particularly the sections involving complex differential diagnosis, but even relatively brief training produces acceptable inter-rater reliability in most studies. For counselors who do not use the MINI routinely, the instrument serves a secondary purpose as a template for comprehensive clinical interviewing: the MINI makes explicit the diagnostic questions that should be part of any thorough COD assessment, even if the clinician is not using the structured format.</p>\n<p>The most challenging task in COD assessment — and the one where experienced clinicians are most likely to err — is differentiating <strong>substance-induced mental health disorders</strong> from <strong>independent psychiatric disorders</strong>. The DSM-5-TR distinguishes between these categories by temporal relationship and by symptom persistence during abstinence. A substance-induced disorder is one in which the psychiatric symptoms emerged during active intoxication or within four weeks of cessation, and the symptoms are not better accounted for by an independent disorder. An independent disorder exists when psychiatric symptoms predate the substance use, persist for more than four weeks of abstinence, or have occurred during prior periods of sobriety.</p>\n<p>In practice, this distinction is difficult for several reasons. First, clients rarely present during a clear period of abstinence, making temporal assessment difficult. Second, memory for the timeline of symptom onset is often poor, particularly when use began in adolescence. Third, substance-induced symptoms and independent symptoms can be phenomenologically identical — a client with alcohol-induced depressive disorder and a client with MDD complicated by AUD may present with indistinguishable depressive symptoms. Fourth, the most common co-occurring presentations are bidirectional: depression worsens alcohol use, and alcohol use worsens depression, making it clinically impossible in many cases to identify which came first or which is \"primary.\"</p>\n<p>The practical guidance from SAMHSA TIP 42 and from the DSM-5-TR itself is instructive: when in doubt, treat both. The costs of withholding psychiatric treatment from a client who turns out to have an independent disorder are substantial; the costs of treating a client with antidepressants who turns out to have a substance-induced disorder and achieves sobriety are modest. The clinical principle is that uncertainty about temporal primacy is not a reason to defer integrated treatment; it is a reason for careful monitoring and reassessment as the clinical picture clarifies over time. A useful clinical strategy is to conduct a structured reassessment of psychiatric symptoms after 4–6 weeks of significantly reduced or abstinent substance use, using instruments like the PHQ-9 or PCL-5, to assess which symptoms persist and which resolve with sobriety — the latter being more consistent with substance-induced presentations.</p>\n<p>DSM-5-TR criteria for the most common co-occurring disorders are worth reviewing in their specifics. For <strong>alcohol use disorder</strong>, the DSM-5-TR specifies 11 criteria organized around impaired control, social impairment, risky use, and pharmacological features (tolerance and withdrawal), with severity classified as mild (2–3 criteria), moderate (4–5), or severe (6+). The removal of \"legal problems\" as a criterion and the addition of \"craving\" from DSM-IV to DSM-5 are clinically significant: craving is now a formal diagnostic feature, and the absence of legal consequences does not preclude diagnosis. For <strong>cannabis use disorder</strong> — increasingly relevant as legalization normalizes use — the same 11-criterion framework applies, and clinicians should note that tolerance and withdrawal (particularly irritability, sleep disturbance, and decreased appetite after cessation) are now established diagnostic features rather than debated phenomena.</p>\n<p>Motivational interviewing (MI) occupies a unique position in COD assessment: it is simultaneously an assessment strategy and a therapeutic intervention. The MI assessment roll, a structured component of early MI engagement, invites the client to tell their own story about their substance use and mental health, with the counselor listening for the client's own ambivalence, their self-assessment of problems and benefits, and the meaning they attach to their use. This approach gathers critical assessment data — the client's stage of change, their perceived barriers to addressing either condition, their values and goals — while simultaneously building the collaborative therapeutic relationship that is foundational to COD engagement. The functional analysis of substance use, discussed next, makes the MI assessment framework explicit.</p>"
        },
        {
          "type": "accordion",
          "order": 5,
          "title": "Assessment Instruments at a Glance",
          "accordionItems": [
            {
              "title": "AUDIT-C: Alcohol Use Screening",
              "content": "<p><strong>Items:</strong> 3. <strong>Administration:</strong> Self-report, under 1 minute. <strong>Cutoff:</strong> ≥3 women, ≥4 men. <strong>What it does well:</strong> Sensitive for hazardous drinking before dependence onset. <strong>Limitations:</strong> Does not assess consequences or dependence features; positive screen requires follow-up interview. <strong>Best use:</strong> Routine alcohol screening at intake, especially in non-addiction-specialty settings.</p>"
            },
            {
              "title": "DAST-10: Drug Problem Screening",
              "content": "<p><strong>Items:</strong> 10. <strong>Administration:</strong> Self-report, 2–3 minutes. <strong>Cutoff:</strong> Score 3+ = moderate problems, warrants full assessment. <strong>What it does well:</strong> Covers drug-related consequences without specifying a substance; normalizes the inquiry. <strong>Limitations:</strong> Does not identify which substances; some items may underperform with cannabis since legalization normalized social acceptance. <strong>Best use:</strong> Any intake where drug use history needs to be opened as a topic.</p>"
            },
            {
              "title": "PHQ-9: Depression Severity Screen",
              "content": "<p><strong>Items:</strong> 9. <strong>Administration:</strong> Self-report, 2–5 minutes. <strong>Cutoff:</strong> ≥10 = moderate-severe, warrants clinical attention. <strong>What it does well:</strong> Widely validated, free, available in 50+ languages, sensitive for MDD. <strong>Limitations:</strong> Cannot distinguish substance-induced from independent depression; Item 9 (suicidality) always requires clinical follow-up. <strong>Best use:</strong> Universal depression screening; reassessment after 4–6 weeks of reduced substance use to evaluate symptom persistence.</p>"
            },
            {
              "title": "PCL-5: PTSD Severity Screen",
              "content": "<p><strong>Items:</strong> 20. <strong>Administration:</strong> Self-report, 5–10 minutes. <strong>Cutoff:</strong> ≥33 = probable PTSD in most populations. <strong>What it does well:</strong> Aligned with DSM-5 four-cluster model; identifies the specific symptom clusters driving severity. <strong>Limitations:</strong> Cannot generate a formal PTSD diagnosis (requires structured interview); cutoff may vary by population. <strong>Best use:</strong> Routine PTSD screening for all COD clients; critical because PTSD is frequently missed in SUD settings.</p>"
            },
            {
              "title": "MINI: Structured Diagnostic Interview",
              "content": "<p><strong>Modules:</strong> 17 DSM-5 disorders. <strong>Administration:</strong> Clinician-administered, 15–30 minutes. <strong>What it does well:</strong> Generates working DSM-5 diagnoses across both psychiatric and SUD domains; explicit temporal and severity probes. <strong>Limitations:</strong> Requires training; longer than brief screens; can feel clinical/interrogative if not delivered with rapport. <strong>Best use:</strong> Comprehensive baseline diagnostic evaluation for clients with complex or unclear presentations; also useful as a training template for COD interview structure.</p>"
            }
          ]
        },
        {
          "type": "imageText",
          "order": 6,
          "content": "<p>A <strong>functional analysis of substance use</strong> maps the antecedents, behaviors, and consequences of a client's substance use in relation to their mental health symptoms, providing a clinical roadmap for integrated intervention. The assessment asks: What triggers use? (Antecedents — internal states like anxiety or depression, external cues, interpersonal events.) What does the client use, how much, and in what context? (Behavior — the use pattern.) What happens immediately after use, and what happens over time? (Consequences — the short-term relief that maintains use and the longer-term consequences that motivate change.) In COD, the functional analysis typically reveals that psychiatric symptoms serve as powerful antecedents for substance use, that the substance provides short-term relief (negative reinforcement), and that the long-term consequences worsen the psychiatric symptoms that drive the next cycle of use. This vicious cycle, made visible through functional analysis, is often a powerful psychoeducational and therapeutic tool — clients who see the cycle on paper often report a profound shift in their understanding of their own use.</p>",
          "image": "",
          "imageAlt": "A cyclical diagram showing psychiatric symptoms leading to substance use leading to short-term relief leading to worsened symptoms completing the cycle",
          "imagePosition": "left"
        },
        {
          "type": "multiSelect",
          "order": 7,
          "question": "Which of the following are accurate statements about 42 CFR Part 2 as it differs from HIPAA? (Select all that apply.)",
          "options": [
            {
              "text": "Part 2 requires patient-specific written consent to share SUD records with the patient's own psychiatrist for treatment coordination",
              "isCorrect": true
            },
            {
              "text": "Part 2 prohibits re-disclosure by recipients who receive Part 2-protected information",
              "isCorrect": true
            },
            {
              "text": "Part 2 and HIPAA both permit disclosure for treatment coordination without patient authorization",
              "isCorrect": false
            },
            {
              "text": "Violations of 42 CFR Part 2 can carry criminal penalties",
              "isCorrect": true
            },
            {
              "text": "Part 2 applies only to inpatient substance use treatment programs",
              "isCorrect": false
            }
          ],
          "explanation": "Part 2 is far more restrictive than HIPAA: it requires specific written consent for most disclosures including treatment coordination, prohibits re-disclosure, carries criminal penalties, and applies broadly to federally assisted SUD programs — not just inpatient settings."
        },
        {
          "type": "scenarioTree",
          "order": 8,
          "scenarioTitle": "The Intake That Tells Two Stories",
          "startNode": "start",
          "nodes": {
            "start": {
              "text": "Marcelline is a 34-year-old Black woman referred for outpatient therapy following a hospitalization for a depressive episode. She presents with PHQ-9 score of 16, reports low mood for \"at least two years,\" and denies any \"drug problems.\" Her AUDIT-C score is 5 (above the female threshold of 3). She explains she drinks \"a few glasses of wine to relax\" after work and on weekends. You have 30 minutes for an initial assessment. How do you proceed?",
              "choices": [
                {
                  "text": "Focus the assessment on depression since that is the referral reason; note the AUDIT-C result as secondary",
                  "next": "focus_depression"
                },
                {
                  "text": "Explore the AUDIT-C result with curiosity and without alarm, integrating alcohol questions into the broader assessment",
                  "next": "explore_alcohol"
                },
                {
                  "text": "Inform Marcelline that you need to assess her alcohol use thoroughly before treating her depression",
                  "next": "sequential_approach"
                }
              ]
            },
            "focus_depression": {
              "text": "You focus on depression and document MDD with plan to monitor alcohol. Three months into therapy, Marcelline reveals she has been drinking a bottle of wine nightly for five years, started when her first child was born and her anxiety \"went through the roof.\" Her depression has not improved despite adequate antidepressant trial. You now have a comprehensive COD picture — but you have been treating only one dimension. This is the sequential error in practice.",
              "choices": [
                {
                  "text": "Reflect: What might you have done at intake to catch this earlier?",
                  "next": "reflection_node"
                }
              ]
            },
            "explore_alcohol": {
              "text": "Using motivational interviewing, you say: \"I noticed your score on the drinking questions was a little elevated — can you tell me more about how wine fits into your evenings?\" Marcelline relaxes slightly and says the wine is the only thing that quiets her mind. You explore anxiety symptoms: she describes chronic worry, difficulty sleeping without alcohol, and physical tension that has been present since adolescence. Her PCL-5 score administered today is 28, below PTSD threshold but indicating significant trauma symptoms she had not mentioned. You now have a much fuller picture.",
              "choices": [
                {
                  "text": "How would you integrate these findings into a COD assessment summary?",
                  "next": "integration_node"
                }
              ]
            },
            "sequential_approach": {
              "text": "Telling Marcelline you need to assess alcohol before treating depression sends a message that feels familiar: that she must earn treatment by first addressing the \"right\" problem. She becomes guarded and minimizes her drinking. The sequential framing inadvertently recreates the sequential treatment model's gatekeeping function and damages early rapport.",
              "choices": [
                {
                  "text": "What would a more integrative framing look like?",
                  "next": "explore_alcohol"
                }
              ]
            },
            "integration_node": {
              "text": "An integrated assessment summary for Marcelline might read: \"Client presents with significant depressive and anxiety symptoms (PHQ-9=16, chronic worry, sleep disturbance, physical tension since adolescence) and elevated alcohol use (AUDIT-C=5, approximately 14 units/week), with the alcohol used functionally to manage anxiety and facilitate sleep. Timeline suggests anxiety preceded alcohol use. Differential includes MDD + GAD with comorbid AUD, or substance-induced depressive/anxiety disorder (less likely given pre-use symptom history). PCL-5 = 28, trauma history not yet explored. Recommend comprehensive COD treatment plan addressing both dimensions simultaneously.\" This is integrated assessment in practice.",
              "isEnd": true
            },
            "reflection_node": {
              "text": "The answer is always: ask routinely, without alarm, using a normalized frame (\"We ask everyone about alcohol and drug use because they affect mental health in important ways\"). A brief AUDIT-C at intake costs 60 seconds and catches what the referral letter misses. COD assessment is a routine clinical standard, not a specialty task reserved for addiction clinicians.",
              "isEnd": true
            }
          }
        },
        {
          "type": "matching",
          "order": 9,
          "matchingInstructions": "Match each assessment instrument to its primary clinical purpose in COD assessment.",
          "matchingPairs": [
            {
              "term": "AUDIT-C",
              "definition": "Three-item screen for hazardous or harmful alcohol use; sensitive for problematic drinking before dependence onset."
            },
            {
              "term": "DAST-10",
              "definition": "Ten-item self-report screen for drug-related problems across substances, without specifying which drug."
            },
            {
              "term": "PCL-5",
              "definition": "Twenty-item PTSD severity screen aligned with DSM-5 four-cluster model; critical for COD clients with trauma history."
            },
            {
              "term": "MINI",
              "definition": "Structured clinician-administered diagnostic interview covering 17 DSM-5 disorders including both psychiatric and SUD diagnoses."
            },
            {
              "term": "PHQ-9",
              "definition": "Nine-item depression severity screen with Item 9 serving as a suicidality flag; cannot distinguish substance-induced from independent depression."
            }
          ]
        },
        {
          "type": "reflection",
          "order": 10,
          "question": "Describe a client you have assessed or worked with who may have had unrecognized co-occurring disorders. What screening instruments were or were not used? What would a comprehensive COD assessment have included? What difference might earlier identification have made to the treatment course?"
        },
        {
          "type": "keyTakeaway",
          "order": 11,
          "title": "Key Takeaways — Section 2",
          "takeaways": [
            "Diagnostic overshadowing — one set of symptoms capturing clinical attention while the other is missed — is the most common assessment failure in COD populations and is prevented only by routine, integrated screening.",
            "No single instrument captures the full COD picture; comprehensive assessment requires separate validated instruments for substance use (AUDIT-C, DAST-10) and mental health (PHQ-9, PCL-5, MINI), integrated with a thorough clinical interview.",
            "Differentiating substance-induced from independent psychiatric disorders requires temporal assessment; when in doubt, treat both and reassess symptoms after 4–6 weeks of reduced or abstinent use.",
            "Motivational interviewing is both an assessment tool and an intervention: the MI assessment roll gathers clinical data while building the collaborative relationship essential for COD engagement.",
            "Functional analysis of substance use — mapping antecedents, behaviors, and consequences in relation to psychiatric symptoms — is a core COD assessment and psychoeducation tool.",
            "42 CFR Part 2 is more restrictive than HIPAA and requires patient-specific written consent for most SUD record disclosures, including treatment coordination with the client's own providers."
          ]
        }
      ]
    },
    {
      "title": "Integrated Treatment Interventions",
      "contentBlocks": [
        {
          "type": "sectionDivider",
          "sectionNumber": "3",
          "title": "Integrated Treatment Interventions",
          "subtitle": "IDDT, motivational interviewing, CBT adaptations, MAT, relapse prevention, harm reduction, and cultural considerations",
          "order": 1
        },
        {
          "type": "text",
          "order": 2,
          "content": "<h2>Integrated Dual Disorder Treatment: The Evidence-Based Framework</h2>\n<p>Integrated Dual Disorder Treatment (IDDT) is the most rigorously studied model of integrated care for people with severe mental illness and co-occurring substance use disorders. Developed through a series of controlled studies by Robert Drake, Kim Mueser, Mary Brunette, and colleagues at the New Hampshire-Dartmouth Psychiatric Research Center beginning in the 1980s, IDDT has been replicated across diverse populations and settings and is designated as an evidence-based practice by SAMHSA. The core principles of IDDT provide a practical framework applicable not only to clients with severe mental illness but to the full range of COD presentations encountered in outpatient mental health and addiction settings.</p>\n<p>IDDT is built on eight core principles, each of which has direct implications for clinical practice. The first is <strong>integration</strong>: substance use and mental health treatment are provided by the same clinician or team rather than coordinated across separate systems. The second is <strong>comprehensiveness</strong>: IDDT addresses housing, employment, family relationships, health, and legal concerns alongside clinical symptoms — recognizing that social determinants drive substance use and psychiatric outcomes in COD populations. The third is <strong>assertive outreach</strong>: IDDT does not wait for clients to show up motivated; it meets them where they are, literally and figuratively, using case management and home visits to maintain engagement even during periods of ambivalence or crisis. The fourth is <strong>reduction of negative consequences</strong>: harm reduction is an explicit component, not a compromise or a failure. The fifth is <strong>long-term perspective</strong>: COD recovery is understood as a years-long process with predictable setbacks rather than a program of defined episodes with expected discharge to recovery.</p>\n<p>The sixth principle is <strong>stage-wise treatment</strong>: interventions are matched to the client's current stage of motivation and readiness rather than applied uniformly regardless of engagement. IDDT draws on Prochaska and DiClemente's transtheoretical model but integrates it with COD-specific content. A client in precontemplation regarding their alcohol use requires a different intervention than a client in preparation. The seventh principle is <strong>motivational interventions</strong>: MI is used throughout treatment to build and sustain motivation for recovery from both conditions, especially during ambivalence and relapse. The eighth is <strong>multiple psychotherapeutic modalities</strong>: IDDT incorporates CBT, social skills training, family psychoeducation, and other evidence-based approaches alongside MI, matched to the client's clinical needs and stage.</p>\n<p>The IDDT stage model deserves particular attention because it provides practical guidance for intervention selection. IDDT identifies four stages: <strong>engagement</strong> (the client has no therapeutic relationship and is not considering change), <strong>persuasion</strong> (the client has a relationship but is not committed to addressing substance use), <strong>active treatment</strong> (the client is actively working on reducing or abstaining from substance use), and <strong>relapse prevention</strong> (the client is in sustained recovery and working to maintain gains). Each stage has specific clinical strategies. During engagement, the focus is on building trust and meeting practical needs; confronting substance use at this stage is contraindicated and drives clients away. During persuasion, MI strategies that explore ambivalence, develop discrepancy, and build intrinsic motivation are central. During active treatment, CBT, coping skills, and social support are activated. During relapse prevention, booster sessions, continuing care, and peer support structures maintain gains.</p>\n<p>For counselors working in outpatient or private practice settings without a full IDDT team, the IDDT framework translates into individual practice through several adaptations. Routinely addressing both conditions in each session — rather than siloing depression work and addiction work into alternate weeks — is the most foundational adaptation. Using MI to explore both dimensions simultaneously, asking about the relationships between use and symptoms rather than treating them as parallel but separate tracks, reflects the integration principle in individual practice. Maintaining a long-term engagement orientation and avoiding premature discharge when clients relapse reflects the assertive and long-term perspective principles. Incorporating harm reduction goals (reduced use, safer use practices) alongside abstinence goals when abstinence is not immediately achievable reflects the reduction-of-consequences principle.</p>\n<p>The evidence base for IDDT is strong. Drake et al.'s systematic reviews and SAMHSA's evidence-based practice resource kit document consistent findings: clients receiving integrated treatment show greater reduction in substance use, greater improvement in psychiatric symptoms, higher rates of stable housing, lower rates of hospitalization, and better community functioning compared to clients receiving non-integrated treatment across follow-up periods of one to eight years. No other intervention for COD has an evidence base of comparable quality. When a client presents with COD, IDDT principles should organize the treatment, regardless of setting.</p>"
        },
        {
          "type": "callout",
          "order": 3,
          "calloutType": "clinical",
          "title": "Cannabis and Anxiety: The Bidirectional Relationship Most Clinicians Under-Address",
          "content": "<p>The relationship between cannabis use and anxiety is one of the most clinically important — and most misunderstood — COD dynamics in current practice. As cannabis has been legalized in a growing number of states and culturally normalized, clinicians increasingly encounter clients who describe cannabis use as their primary anxiety management strategy. Many of these clients are surprised and resistant when cannabis is identified as a clinical concern, and their treatment providers often fail to raise it systematically.</p>\n<p>The neurobiology is genuinely bidirectional. The endocannabinoid system, particularly CB1 receptors in the amygdala, prefrontal cortex, and hippocampus, modulates anxiety responses. Low-dose THC activates CB1 receptors and can produce anxiolytic effects, which is the subjective experience clients report. However, high-dose THC, particularly in products with THC concentrations now commonly reaching 20–30% (far higher than 1990s cannabis), reliably produces anxiety and panic in a dose-dependent fashion. Chronic cannabis use downregulates CB1 receptor density and produces baseline endocannabinoid deficiency between uses, paradoxically generating elevated anxiety during abstinence — a cannabis withdrawal phenomenon now formally recognized in DSM-5-TR. The net effect of chronic high-dose cannabis use is often worsening anxiety over time, even though each individual use episode may produce short-term relief, creating a self-medication trap that looks identical to the alcohol-anxiety cycle.</p>\n<p>Clinically, the assessment question is: \"Tell me about how cannabis affects your anxiety — both in the moment and over the longer term.\" Many clients, when invited to reflect on the longer-term pattern, recognize that their anxiety has worsened since they began using heavily. This recognition creates an opening for functional analysis and for building discrepancy using MI. The treatment implication: anxiety treatment for clients with cannabis-anxiety COD must address both the anxiety disorder (CBT with exposure is the gold standard) and the cannabis use as a competing anxiety management strategy, providing alternative coping skills before, not after, expecting reduced use. Clinicians who treat anxiety without addressing cannabis in this population will typically see limited treatment gains.</p>"
        },
        {
          "type": "text",
          "order": 4,
          "content": "<h2>Motivational Interviewing and CBT Adaptations for COD</h2>\n<p>Motivational interviewing is not merely an engagement technique for COD populations — it is a clinical stance, a philosophy of collaboration, and a set of specific skills that are foundational to integrated treatment at every stage. In COD, MI must address ambivalence about change on two dimensions simultaneously, and these dimensions often produce different and sometimes contradictory change talk. A client may be highly motivated to reduce depression but express strong ambivalence about giving up cannabis, which they experience as their only effective antidepressant. An MI approach navigates this complexity by exploring both motivational profiles without privileging one and by using a strategic four-process framework (engaging, focusing, evoking, and planning) applied to the COD picture as an integrated whole.</p>\n<p>The MI skill of <strong>developing discrepancy</strong> is especially powerful in COD because the discrepancy most available in this population is the contradiction between the client's substance use (which they often experience as a solution) and their mental health goals (which they usually prioritize but cannot achieve while substance use continues at current levels). Skillfully reflecting this discrepancy — not confronting it, but holding it up for the client to see — often activates change talk that neither depression treatment nor addiction treatment alone could evoke. \"It sounds like the cannabis is really important to you for managing the anxiety, and I also hear you saying that the depression has gotten worse since your use increased. I wonder what you make of that connection?\" This kind of reflection invites self-examination without generating defensiveness.</p>\n<p>The MI skill of <strong>rolling with resistance</strong> (or, in the more current MI literature, \"discord\") is critically important in COD because both conditions generate powerful sustain talk: the client has compelling reasons to maintain their substance use (short-term psychiatric symptom relief) and compelling reasons to defer psychiatric treatment (the stigma of being \"crazy\" as well as \"addicted\"). Acknowledging and normalizing this ambivalence, rather than pushing through it, maintains the collaborative relationship that is the therapeutic medium in COD treatment.</p>\n<p>Cognitive Behavioral Therapy (CBT) is the most empirically supported psychological treatment for both substance use disorders and the most common co-occurring mental health disorders (depression, anxiety, PTSD). In COD, CBT must be adapted in specific ways to address the bidirectional relationship between cognitions, emotions, and substance use. The most important CBT adaptations for COD include:</p>\n<p><strong>Integrated cognitive restructuring</strong>: Standard CBT targets distorted cognitions that maintain depression or anxiety. In COD, the same techniques must explicitly address the cognitions that maintain substance use — \"I can't cope without it,\" \"Everyone drinks like this,\" \"Sobriety means a life without pleasure\" — as well as the cognitions that maintain psychiatric symptoms. A CBT thought record adapted for COD includes a column that asks: \"How does this thought connect to my use today?\"</p>\n<p><strong>Coping skills training with substance-specific applications</strong>: CBT coping skills for anxiety (diaphragmatic breathing, progressive muscle relaxation, graded exposure) and depression (behavioral activation, scheduling positive events) must be explicitly framed as alternatives to substance use rather than generic coping tools. The client who knows that alcohol reduces their anxiety in the short term needs a coping toolkit that is demonstrably effective for anxiety management before they can be asked to give up the tool they know works.</p>\n<p><strong>Integrated relapse prevention</strong>: Relapse prevention for COD must address triggers and high-risk situations for both psychiatric symptom escalation and substance use relapse — and critically, must address the connection between them. A relapse prevention plan for a client with depression-AUD COD must identify not only external triggers for drinking (social situations, stress, availability) but internal psychiatric triggers (depressive episodes, hopelessness, anhedonia) and must include crisis planning for psychiatric emergencies that does not require sobriety as a precondition for care.</p>\n<p>Medication-Assisted Treatment (MAT) for substance use disorders creates specific clinical considerations in COD. Buprenorphine-naloxone (Suboxone), extended-release naltrexone (Vivitrol), and acamprosate for alcohol use disorder are all effective evidence-based medications with documented efficacy in SUD treatment. In COD populations, MAT adds complexity: psychiatric medications and MAT medications can interact, and counselors who are not prescribers must understand enough pharmacology to facilitate coordination with prescribers, recognize side effects, and support medication adherence.</p>\n<p>The counselor's role in MAT is not prescriptive but is nonetheless clinical: psychosocial support significantly improves MAT outcomes, and counselors provide the relapse prevention, coping skills, and motivational work that medication alone cannot accomplish. A counselor who views MAT as \"not my lane\" and declines to engage with the medication dimension of a COD client's treatment is providing incomplete integrated care. Key knowledge areas include the difference between physical dependence (a physiological adaptation to a medication, expected and clinically managed) and addiction (a disorder of compulsive use despite negative consequences, not implied by physical dependence), and the evidence that MAT medications do not constitute \"trading one drug for another\" — a myth that, when endorsed by mental health providers, undermines MAT adherence and worsens outcomes.</p>"
        },
        {
          "type": "accordion",
          "order": 5,
          "title": "Integrated Treatment Strategies by Stage and Condition",
          "accordionItems": [
            {
              "title": "Stage 1 — Engagement: Building the Foundation",
              "content": "<p>During engagement, the client may not acknowledge COD, may mistrust the treatment system, or may be meeting a provider only because of an external requirement. Clinical priorities: establish rapport through consistent, non-judgmental presence; meet immediate practical needs (housing, safety, medical care) that compete with engagement; avoid confrontation about substance use; use MI engagement skills (open questions, reflective listening, affirmations, summaries — OARS) to build a collaborative relationship. Assessment during engagement is observational and exploratory rather than systematic. Pushing active treatment strategies at this stage reliably drives clients away.</p>"
            },
            {
              "title": "Stage 2 — Persuasion: Building Motivation for Change",
              "content": "<p>During persuasion, the client is engaged in treatment but ambivalent about changing their substance use. Clinical priorities: MI strategies to explore and develop discrepancy; psychoeducation about COD (the bidirectional cycle, why integrated treatment works); exploration of the client's own values and goals and how substance use connects to them; reviewing the pros and cons of change with the client driving the analysis. Decisional balance exercises are particularly useful here. Group interventions at this stage (IDDT persuasion groups) provide peer contact with others in similar situations without requiring commitment to abstinence.</p>"
            },
            {
              "title": "Stage 3 — Active Treatment: Skills Building and Change",
              "content": "<p>During active treatment, the client is committed to reducing or stopping substance use and addressing their psychiatric symptoms. Clinical priorities: CBT skills training (cognitive restructuring, coping skills, behavioral activation, graded exposure); integrated relapse prevention planning; coordination with prescribers for MAT or psychiatric medication management; social skills training; family education and involvement when appropriate. Sessions integrate both dimensions: psychiatric symptom monitoring is woven into every session, not siloed. Frequency and intensity typically increase at this stage.</p>"
            },
            {
              "title": "Stage 4 — Relapse Prevention: Sustaining Recovery",
              "content": "<p>During relapse prevention, the client has achieved significant reduction or abstinence and is consolidating gains. Clinical priorities: identifying high-risk situations for both substance use relapse and psychiatric relapse; building a robust continuing care plan; strengthening social support networks; addressing quality-of-life and meaning-making issues that become salient once acute symptoms are managed. The long-term perspective of IDDT is critical here: relapse is not failure but a signal for treatment intensification, not discharge. Ongoing psychoeducation about COD maintains the framework through episodes of difficulty.</p>"
            },
            {
              "title": "Harm Reduction Within Integrated Treatment",
              "content": "<p>Harm reduction is a clinical philosophy and a set of practical strategies that reduce the negative consequences of substance use without requiring abstinence as a precondition for care. In COD, harm reduction is an integrated treatment principle, not a treatment alternative. Harm reduction strategies relevant to COD include: psychoeducation about safer use practices; addressing overdose risk and providing naloxone training; reducing high-risk use contexts (driving while impaired, using alone); needle exchange and HIV prevention for injection drug users; hepatitis C screening and treatment linkage; reducing the use of highest-harm substances while accepting continued use of lower-harm substances. Harm reduction does not preclude abstinence as a goal; it accepts the full continuum of change as valid clinical targets and maintains engagement with clients who are not yet ready for abstinence.</p>"
            }
          ]
        },
        {
          "type": "imageText",
          "order": 6,
          "content": "<p><strong>Cultural considerations</strong> in COD treatment are not a supplement to evidence-based practice — they are a component of it. Cultural factors affect the meaning clients attach to substance use, the stigma they experience around mental illness, the sources of social support available to them, the help-seeking behaviors they have been socialized into, and the trust they bring (or withhold) from clinical encounters. Research consistently shows that culturally adapted interventions produce better engagement and retention outcomes for clients from racial and ethnic minority backgrounds than standard unadapted approaches. For COD specifically, cultural considerations include: attending to how substance use is framed within the client's community (social, spiritual, medical, moral); understanding the historical and ongoing trauma that may underlie COD in communities affected by systemic racism, colonization, or intergenerational trauma; incorporating family and community systems when appropriate and desired by the client; using interpreters and culturally appropriate screening materials; and examining one's own implicit biases about substance use and mental illness that may affect the clinical relationship. A clinician who is fluent in evidence-based COD interventions but delivers them within an uncritically monocultural frame will achieve reduced effectiveness, particularly with clients from communities that have had adversarial relationships with behavioral health institutions.</p>",
          "image": "",
          "imageAlt": "A visual representation of cultural factors — community, family, history, language, and spirituality — surrounding a COD treatment framework",
          "imagePosition": "right"
        },
        {
          "type": "cardSort",
          "order": 7,
          "instructions": "Sort each clinical strategy into the correct category: \"Motivational Interviewing Technique\" or \"CBT Adaptation for COD.\"",
          "categories": [
            "Motivational Interviewing Technique",
            "CBT Adaptation for COD"
          ],
          "cards": [
            {
              "id": "1",
              "text": "Exploring the pros and cons of changing substance use from the client's perspective without imposing the clinician's view",
              "correctCategory": "Motivational Interviewing Technique"
            },
            {
              "id": "2",
              "text": "Completing a thought record that includes a column connecting distorted cognitions to substance use triggers",
              "correctCategory": "CBT Adaptation for COD"
            },
            {
              "id": "3",
              "text": "Using a double-sided reflection to hold the client's ambivalence: \"On one hand... and on the other hand...\"",
              "correctCategory": "Motivational Interviewing Technique"
            },
            {
              "id": "4",
              "text": "Behavioral activation scheduling that explicitly replaces times previously devoted to substance use with rewarding alternative activities",
              "correctCategory": "CBT Adaptation for COD"
            },
            {
              "id": "5",
              "text": "Affirmations that identify the client's strengths and resilience without praise that centers the clinician",
              "correctCategory": "Motivational Interviewing Technique"
            },
            {
              "id": "6",
              "text": "Graded exposure hierarchy for anxiety that includes substance use cues at intermediate rungs",
              "correctCategory": "CBT Adaptation for COD"
            },
            {
              "id": "7",
              "text": "Eliciting change talk by asking the client what worries them most about continuing current substance use",
              "correctCategory": "Motivational Interviewing Technique"
            },
            {
              "id": "8",
              "text": "Relapse prevention planning that maps psychiatric symptom escalation as a high-risk situation for substance use",
              "correctCategory": "CBT Adaptation for COD"
            }
          ]
        },
        {
          "type": "fillInBlank",
          "order": 8,
          "title": "IDDT Stage Model — Quick Check",
          "blanks": [
            {
              "prompt": "In the IDDT model, the first of the four stages of integrated treatment — the stage that precedes persuasion, active treatment, and relapse prevention, where the clinician focuses on building a trusting working relationship before addressing substance use directly — is called:",
              "answer": "engagement",
              "acceptAlternates": ["Engagement"]
            },
            {
              "prompt": "IDDT's four-stage model guides intervention selection based on the client's current motivation and readiness rather than applying the same strategies regardless of where the client is in the change process. The final of the four stages, which follows active treatment and focuses on sustaining gains and preventing return to use, is called:",
              "answer": "relapse prevention",
              "acceptAlternates": ["Relapse Prevention", "relapse-prevention"]
            }
          ]
        },
        {
          "type": "reflection",
          "order": 9,
          "question": "Consider a clinical scenario in which a client with co-occurring depression and alcohol use disorder tells you: \"I need to get the drinking under control before I can deal with the depression — the therapist I saw before said the same thing.\" How would you respond using MI and integrated treatment principles? What would you say, and what would you avoid saying?"
        },
        {
          "type": "keyTakeaway",
          "order": 10,
          "title": "Key Takeaways — Section 3",
          "takeaways": [
            "Integrated Dual Disorder Treatment (IDDT) is the SAMHSA-designated evidence-based model for COD, built on eight core principles including integration, stage-wise treatment, assertive outreach, and harm reduction.",
            "Motivational interviewing in COD must address ambivalence on two dimensions simultaneously, exploring the client's motivation for both psychiatric recovery and substance use change without forcing either.",
            "CBT adaptations for COD include integrated cognitive restructuring (connecting distorted cognitions to substance use), coping skills training framed explicitly as alternatives to substance use, and integrated relapse prevention that maps both psychiatric and substance use triggers.",
            "The counselor's role in MAT is psychosocial, not prescriptive — providing the relapse prevention, coping skills, and motivation support that medication alone cannot accomplish, while actively countering the \"trading one drug for another\" myth that undermines adherence.",
            "Harm reduction is an integrated treatment principle that maintains engagement with clients who are not yet ready for abstinence by reducing consequences and building the therapeutic relationship that supports later change.",
            "Cultural adaptation of COD interventions is not supplementary but core — clinicians must attend to how culture shapes the meaning of substance use, the stigma of mental illness, help-seeking behavior, and trust in clinical institutions."
          ]
        },
        {
          "type": "resources",
          "order": 11,
          "title": "Clinical Resources for Co-Occurring Disorders",
          "resources": [
            {
              "title": "SAMHSA TIP 42: Substance Abuse Treatment for Persons With Co-Occurring Disorders",
              "url": "https://store.samhsa.gov/product/tip-42-substance-abuse-treatment-persons-co-occurring-disorders",
              "type": "website",
              "description": "The foundational SAMHSA treatment improvement protocol for COD, covering assessment, treatment, and recovery support. Free download."
            },
            {
              "title": "SAMHSA National Survey on Drug Use and Health (NSDUH) — Annual Data",
              "url": "https://www.samhsa.gov/data/data-we-collect/nsduh-national-survey-drug-use-and-health",
              "type": "website",
              "description": "Annual epidemiological data on substance use and mental health prevalence, co-occurrence, and treatment gaps in the U.S. adult and adolescent populations."
            },
            {
              "title": "IDDT Evidence-Based Practice Resource Kit (SAMHSA)",
              "url": "https://store.samhsa.gov/product/integrated-dual-disorders-treatment-iddt/sma08-4367",
              "type": "website",
              "description": "SAMHSA's complete IDDT implementation toolkit including the clinical practice guidelines, fidelity scale, and training materials developed by Drake, Mueser, and colleagues."
            },
            {
              "title": "AUDIT-C Alcohol Screening Tool — VA Implementation Resources",
              "url": "https://www.queri.research.va.gov/tools/alcohol-misuse/alcohol-faqs.cfm",
              "type": "website",
              "description": "Clinical guidance on administering and interpreting the AUDIT-C, including cutoff scores, sensitivity/specificity data, and follow-up protocols."
            },
            {
              "title": "PCL-5 (PTSD Checklist for DSM-5) — National Center for PTSD",
              "url": "https://www.ptsd.va.gov/professional/assessment/adult-sr/ptsd-checklist.asp",
              "type": "website",
              "description": "Free download and implementation guidance for the PCL-5, including scoring, cutoffs, and guidance for use with trauma populations including those with SUDs."
            },
            {
              "title": "42 CFR Part 2 — Substance Abuse Confidentiality Regulations (SAMHSA Guidance)",
              "url": "https://www.samhsa.gov/about-us/who-we-are/laws-regulations/confidentiality-regulations-faqs",
              "type": "website",
              "description": "SAMHSA's frequently asked questions on 42 CFR Part 2, covering who is covered, what requires consent, and the exceptions. Essential for any clinician providing SUD services."
            },
            {
              "title": "MINT (Motivational Interviewing Network of Trainers) Clinical Resources",
              "url": "https://motivationalinterviewing.org/clinical-resources",
              "type": "website",
              "description": "Training resources, fidelity coding tools, and research summaries on motivational interviewing with substance use and co-occurring disorder populations."
            }
          ]
        }
      ]
    },
    {
      "title": "Pharmacotherapy, MAT Coordination, and Harm Reduction",
      "order": 5,
      "estimatedTime": 45,
      "contentBlocks": [
        {
          "type": "sectionDivider",
          "sectionNumber": 4,
          "title": "Pharmacotherapy, MAT Coordination, and Harm Reduction",
          "subtitle": "The medication dimension of integrated care — and the counselor's role in it",
          "order": 1
        },
        {
          "type": "text",
          "content": "<h2>Medication-Assisted Treatment in the Integrated Framework</h2>\n<p>No competency in co-occurring disorder treatment is more consistently underdeveloped among non-prescribing clinicians than fluency with medication-assisted treatment. MAT is not an adjunct to integrated care — for opioid and alcohol use disorders it is among the most robustly evidence-supported interventions available, and SAMHSA's TIP 63 identifies clinician unfamiliarity as a primary driver of the treatment gap: most clients who would benefit from these medications never receive them (SAMHSA, 2021). The counselor who cannot describe what buprenorphine does, cannot answer a client's fear that \"I'm just trading one drug for another,\" and cannot recognize when a MAT referral is indicated is not neutral on the question — that clinician is functionally steering clients away from a first-line treatment.</p>\n<p>For opioid use disorder, three medications dominate the landscape, and their differences matter clinically. <strong>Methadone</strong> is a full opioid agonist dispensed only through federally certified opioid treatment programs, typically requiring daily attendance early in treatment — a structure that provides accountability for some clients and an insurmountable logistical barrier for others. <strong>Buprenorphine</strong> is a partial agonist with a ceiling effect that substantially reduces overdose risk; it can be prescribed in office-based settings, which dramatically widens access, and its partial-agonist pharmacology means clients describe feeling \"normal\" rather than sedated. <strong>Extended-release naltrexone</strong> is an opioid antagonist — it blocks rather than activates the receptor — delivered as a monthly injection, but it requires roughly seven to ten days of complete opioid abstinence before induction, a hurdle that eliminates many candidates who cannot tolerate a supervised withdrawal period.</p>\n<p>For alcohol use disorder, <strong>oral or injectable naltrexone</strong> reduces craving and blunts the rewarding effects of drinking; <strong>acamprosate</strong> supports maintained abstinence by stabilizing the glutamate system disrupted by chronic alcohol exposure; and <strong>disulfiram</strong> creates an aversive physiological reaction to alcohol, making it most useful for clients with high motivation and, ideally, monitored dosing. None of these requires a specialty program — any prescriber can order them — which makes the counselor's referral awareness the deciding variable in whether they ever reach the treatment plan.</p>\n<p>The non-prescriber's role in MAT parallels the role in psychotropic medication generally, with three COD-specific additions. First, <em>psychoeducation and stigma work</em>: the \"trading one addiction for another\" belief is the single most common client-side barrier to buprenorphine and methadone, and it is often reinforced by family members and even twelve-step communities. The integrated clinician addresses it directly — physiological dependence on a prescribed, stabilizing medication taken as directed is categorically different from the compulsive, escalating, life-constricting use that defines addiction (SAMHSA, 2021). Second, <em>monitoring and communication</em>: the counselor sees the client far more often than the prescriber does and is positioned to observe sedation, mood changes, resumed use, or diversion pressures, and to route those observations promptly. Third, <em>treatment-plan integration</em>: medication targets craving and physiological stability; counseling targets the mental health condition, the functional impairments, and the recovery environment. Neither substitutes for the other, and the plan should say explicitly what each component is responsible for (Mueser et al., 2003).</p>",
          "textContent": "<h2>Medication-Assisted Treatment in the Integrated Framework</h2>\n<p>No competency in co-occurring disorder treatment is more consistently underdeveloped among non-prescribing clinicians than fluency with medication-assisted treatment. MAT is not an adjunct to integrated care — for opioid and alcohol use disorders it is among the most robustly evidence-supported interventions available, and SAMHSA's TIP 63 identifies clinician unfamiliarity as a primary driver of the treatment gap: most clients who would benefit from these medications never receive them (SAMHSA, 2021). The counselor who cannot describe what buprenorphine does, cannot answer a client's fear that \"I'm just trading one drug for another,\" and cannot recognize when a MAT referral is indicated is not neutral on the question — that clinician is functionally steering clients away from a first-line treatment.</p>\n<p>For opioid use disorder, three medications dominate the landscape, and their differences matter clinically. <strong>Methadone</strong> is a full opioid agonist dispensed only through federally certified opioid treatment programs, typically requiring daily attendance early in treatment — a structure that provides accountability for some clients and an insurmountable logistical barrier for others. <strong>Buprenorphine</strong> is a partial agonist with a ceiling effect that substantially reduces overdose risk; it can be prescribed in office-based settings, which dramatically widens access, and its partial-agonist pharmacology means clients describe feeling \"normal\" rather than sedated. <strong>Extended-release naltrexone</strong> is an opioid antagonist — it blocks rather than activates the receptor — delivered as a monthly injection, but it requires roughly seven to ten days of complete opioid abstinence before induction, a hurdle that eliminates many candidates who cannot tolerate a supervised withdrawal period.</p>\n<p>For alcohol use disorder, <strong>oral or injectable naltrexone</strong> reduces craving and blunts the rewarding effects of drinking; <strong>acamprosate</strong> supports maintained abstinence by stabilizing the glutamate system disrupted by chronic alcohol exposure; and <strong>disulfiram</strong> creates an aversive physiological reaction to alcohol, making it most useful for clients with high motivation and, ideally, monitored dosing. None of these requires a specialty program — any prescriber can order them — which makes the counselor's referral awareness the deciding variable in whether they ever reach the treatment plan.</p>\n<p>The non-prescriber's role in MAT parallels the role in psychotropic medication generally, with three COD-specific additions. First, <em>psychoeducation and stigma work</em>: the \"trading one addiction for another\" belief is the single most common client-side barrier to buprenorphine and methadone, and it is often reinforced by family members and even twelve-step communities. The integrated clinician addresses it directly — physiological dependence on a prescribed, stabilizing medication taken as directed is categorically different from the compulsive, escalating, life-constricting use that defines addiction (SAMHSA, 2021). Second, <em>monitoring and communication</em>: the counselor sees the client far more often than the prescriber does and is positioned to observe sedation, mood changes, resumed use, or diversion pressures, and to route those observations promptly. Third, <em>treatment-plan integration</em>: medication targets craving and physiological stability; counseling targets the mental health condition, the functional impairments, and the recovery environment. Neither substitutes for the other, and the plan should say explicitly what each component is responsible for (Mueser et al., 2003).</p>",
          "order": 2
        },
        {
          "type": "callout",
          "calloutType": "warning",
          "title": "The Benzodiazepine Question Every COD Clinician Must Be Ready For",
          "content": "<p>Clients with co-occurring anxiety and substance use disorders are frequently prescribed benzodiazepines — and the combination of benzodiazepines with opioids (including methadone and buprenorphine) or with heavy alcohol use carries FDA boxed-warning-level respiratory depression risk. When your assessment reveals this combination, it is not a wait-for-the-next-coordination-call finding. Notify the prescriber promptly, with the client's knowledge, and document the notification. You are not making a medication judgment — you are ensuring the person making medication judgments has the full picture.</p>",
          "order": 3
        },
        {
          "type": "text",
          "content": "<h2>Harm Reduction: Clinical Pragmatism, Not Permissiveness</h2>\n<p>Harm reduction remains the most misunderstood framework in substance use treatment, and integrated COD care forces the question because so many clients arrive ambivalent about abstinence while urgently needing mental health treatment. The framework's premise is neither radical nor permissive: meet clients where they are, reduce the damage active use causes while engagement builds, and treat retention in care as the outcome that makes every other outcome possible. The stages-of-change literature that already anchors this course points the same direction — interventions matched to precontemplation and contemplation look like engagement and discrepancy-building, not abstinence contracts (Prochaska &amp; DiClemente, 1983; Miller &amp; Rollnick, 2013).</p>\n<p>Concretely, harm reduction in COD practice includes: ensuring clients who use opioids — and their families — have naloxone and know how to use it; discussing fentanyl contamination and test strips with clients who use any illicitly obtained substance, because contamination is no longer confined to opioid supplies; addressing use patterns that interact dangerously with prescribed psychotropics; and setting intermediate goals (reduced frequency, safer routes of use, no use before driving, protected sleep) that clients will actually pursue. For the client with bipolar disorder who will not stop cannabis use, the harm reduction conversation about timing, potency, and mood monitoring keeps them in treatment; the ultimatum ends treatment and, with it, mood stabilizer adherence monitoring.</p>\n<p>Two boundaries keep the framework clinically honest. First, harm reduction is a floor, not a ceiling — it coexists with, and often evolves into, abstinence-oriented goals as motivation develops, and the clinician continues to develop discrepancy rather than settling into passive acceptance of destructive use. Second, it never overrides duty-of-care obligations: imminent risk, mandated-reporting triggers, and safety-sensitive situations are governed by the same clinical and legal standards as always. The integrated clinician holds both truths — radical acceptance of the client's current position, and unwavering clarity about where the dangers are (SAMHSA, 2020).</p>\n<p>Documentation deserves a final word. Harm reduction goals are legitimate treatment plan objectives when they are specific, measurable, and tied to clinical rationale: \"Client will carry naloxone and complete overdose-response teaching with partner by next session\" is a defensible, auditable objective. \"Clinician supports client's continued use\" is not documentation of harm reduction; it is documentation of nothing. Write the clinical reasoning — engagement preservation, overdose risk mitigation, staged goal progression — and the record will reflect what the framework actually is: pragmatic, sequenced, evidence-aligned care (SAMHSA, 2021).</p>",
          "textContent": "<h2>Harm Reduction: Clinical Pragmatism, Not Permissiveness</h2>\n<p>Harm reduction remains the most misunderstood framework in substance use treatment, and integrated COD care forces the question because so many clients arrive ambivalent about abstinence while urgently needing mental health treatment. The framework's premise is neither radical nor permissive: meet clients where they are, reduce the damage active use causes while engagement builds, and treat retention in care as the outcome that makes every other outcome possible. The stages-of-change literature that already anchors this course points the same direction — interventions matched to precontemplation and contemplation look like engagement and discrepancy-building, not abstinence contracts (Prochaska &amp; DiClemente, 1983; Miller &amp; Rollnick, 2013).</p>\n<p>Concretely, harm reduction in COD practice includes: ensuring clients who use opioids — and their families — have naloxone and know how to use it; discussing fentanyl contamination and test strips with clients who use any illicitly obtained substance, because contamination is no longer confined to opioid supplies; addressing use patterns that interact dangerously with prescribed psychotropics; and setting intermediate goals (reduced frequency, safer routes of use, no use before driving, protected sleep) that clients will actually pursue. For the client with bipolar disorder who will not stop cannabis use, the harm reduction conversation about timing, potency, and mood monitoring keeps them in treatment; the ultimatum ends treatment and, with it, mood stabilizer adherence monitoring.</p>\n<p>Two boundaries keep the framework clinically honest. First, harm reduction is a floor, not a ceiling — it coexists with, and often evolves into, abstinence-oriented goals as motivation develops, and the clinician continues to develop discrepancy rather than settling into passive acceptance of destructive use. Second, it never overrides duty-of-care obligations: imminent risk, mandated-reporting triggers, and safety-sensitive situations are governed by the same clinical and legal standards as always. The integrated clinician holds both truths — radical acceptance of the client's current position, and unwavering clarity about where the dangers are (SAMHSA, 2020).</p>\n<p>Documentation deserves a final word. Harm reduction goals are legitimate treatment plan objectives when they are specific, measurable, and tied to clinical rationale: \"Client will carry naloxone and complete overdose-response teaching with partner by next session\" is a defensible, auditable objective. \"Clinician supports client's continued use\" is not documentation of harm reduction; it is documentation of nothing. Write the clinical reasoning — engagement preservation, overdose risk mitigation, staged goal progression — and the record will reflect what the framework actually is: pragmatic, sequenced, evidence-aligned care (SAMHSA, 2021).</p>",
          "order": 4
        },
        {
          "type": "accordion",
          "title": "MAT Medications at a Glance — What Non-Prescribers Need to Know",
          "accordionItems": [
            {
              "title": "Methadone (OUD)",
              "content": "Full opioid agonist dispensed only through certified opioid treatment programs, usually with daily observed dosing early on. Strong evidence for retention and overdose reduction. Counselor watch-points: sedation, missed program days, and the logistical strain daily attendance places on employment and childcare — all worth surfacing in coordination contacts."
            },
            {
              "title": "Buprenorphine (OUD)",
              "content": "Partial agonist with a ceiling effect that lowers overdose risk; office-based prescribing makes it the most accessible OUD medication. Often combined with naloxone (as in Suboxone) to deter injection misuse. Counselor watch-points: early-week adjustment symptoms, 'trading addictions' ambivalence, and pressure from others to divert doses."
            },
            {
              "title": "Extended-Release Naltrexone (OUD/AUD)",
              "content": "Opioid antagonist given as a monthly injection; requires roughly 7–10 opioid-free days before starting, which is the main barrier to induction. No agonist effects and no diversion value. Counselor watch-points: lapse risk during the abstinence run-up and the dangerously reduced opioid tolerance if a client discontinues and returns to use."
            },
            {
              "title": "Acamprosate and Oral Naltrexone (AUD)",
              "content": "Acamprosate supports maintained abstinence via glutamate stabilization and requires three-times-daily dosing — adherence support is the counseling contribution. Oral naltrexone reduces craving and drinking intensity and can be started while a client is still drinking, making it a strong fit for harm-reduction-staged goals."
            },
            {
              "title": "Disulfiram (AUD)",
              "content": "Creates an aversive reaction (flushing, nausea, tachycardia) if alcohol is consumed. Works best for clients with high commitment and monitored dosing; poorly suited to ambivalent clients, for whom an aversive surprise can rupture treatment engagement entirely. Counselor watch-points: covert discontinuation and shame after tested reactions."
            }
          ],
          "order": 5
        },
        {
          "type": "text",
          "content": "<h2>The Coordination Conversation: Making Split Treatment Actually Integrated</h2>\n<p>Everything this section has described — MAT referral, benzodiazepine flags, harm reduction documentation — runs through one operational skill: the prescriber coordination contact. Most integrated treatment failures are not philosophical disagreements between providers; they are communication failures between well-intentioned clinicians who never established a working channel. Building that channel is the counselor's job to initiate, because the counselor holds the most frequent client contact and, usually, the most complete behavioral picture.</p>\n<p>The infrastructure comes first. At intake or at the point a prescriber joins the treatment system, execute a release of information specific enough to be useful — naming the prescriber, the categories of information flowing in both directions, and the substance use disclosures governed by 42 CFR Part 2 where applicable. A release that covers \"coordination of care\" without Part 2-compliant language for substance use records will stall exactly when it is needed most. Then establish the channel's norms in a brief introductory contact: how the prescriber prefers to receive routine observations, what rises to a same-week call, and what constitutes the urgent tier. Prescribers manage large panels; a counselor who communicates in predictable, triaged, concise formats becomes a valued clinical partner rather than another source of inbox noise.</p>\n<p>The SBAR structure — Situation, Background, Assessment, Recommendation — adapts cleanly to COD coordination. Situation: \"I'm calling about Marcus Reed, whom I see weekly; I have a current release on file.\" Background: \"Co-occurring alcohol use disorder and major depression; four months' abstinence until a two-day lapse last weekend; on sertraline and oral naltrexone.\" Assessment: \"Since the lapse I'm seeing the depressive prodrome we identified — canceled plans, abandoned routines — plus renewed craving; PHQ-9 rose from 6 to 14; suicide screen negative today.\" Recommendation: \"I'd value a medication review this week rather than at the scheduled follow-up, and I'll increase session frequency in the interim.\" Ninety seconds, complete picture, clear ask. The recommendation is framed as clinical observation and scheduling advocacy — never as a medication instruction, which remains outside scope no matter how obvious the pharmacological implication seems.</p>\n<p>Documentation closes the loop. Every coordination contact enters the record with date, participants, information exchanged, and resulting plan — both because continuity requires it and because coordination documentation is precisely what distinguishes integrated treatment from parallel treatment in any subsequent utilization or licensing review. A useful discipline: if the treatment plan lists a prescriber as part of the team, the record should show contact at a clinically sensible cadence. Silence in the coordination section of a COD chart is not neutral; it is the documentary signature of the fragmented care this entire course exists to replace (Mueser et al., 2003; SAMHSA, 2020).</p>",
          "textContent": "<h2>The Coordination Conversation: Making Split Treatment Actually Integrated</h2>\n<p>Everything this section has described — MAT referral, benzodiazepine flags, harm reduction documentation — runs through one operational skill: the prescriber coordination contact. Most integrated treatment failures are not philosophical disagreements between providers; they are communication failures between well-intentioned clinicians who never established a working channel. Building that channel is the counselor's job to initiate, because the counselor holds the most frequent client contact and, usually, the most complete behavioral picture.</p>\n<p>The infrastructure comes first. At intake or at the point a prescriber joins the treatment system, execute a release of information specific enough to be useful — naming the prescriber, the categories of information flowing in both directions, and the substance use disclosures governed by 42 CFR Part 2 where applicable. A release that covers \"coordination of care\" without Part 2-compliant language for substance use records will stall exactly when it is needed most. Then establish the channel's norms in a brief introductory contact: how the prescriber prefers to receive routine observations, what rises to a same-week call, and what constitutes the urgent tier. Prescribers manage large panels; a counselor who communicates in predictable, triaged, concise formats becomes a valued clinical partner rather than another source of inbox noise.</p>\n<p>The SBAR structure — Situation, Background, Assessment, Recommendation — adapts cleanly to COD coordination. Situation: \"I'm calling about Marcus Reed, whom I see weekly; I have a current release on file.\" Background: \"Co-occurring alcohol use disorder and major depression; four months' abstinence until a two-day lapse last weekend; on sertraline and oral naltrexone.\" Assessment: \"Since the lapse I'm seeing the depressive prodrome we identified — canceled plans, abandoned routines — plus renewed craving; PHQ-9 rose from 6 to 14; suicide screen negative today.\" Recommendation: \"I'd value a medication review this week rather than at the scheduled follow-up, and I'll increase session frequency in the interim.\" Ninety seconds, complete picture, clear ask. The recommendation is framed as clinical observation and scheduling advocacy — never as a medication instruction, which remains outside scope no matter how obvious the pharmacological implication seems.</p>\n<p>Documentation closes the loop. Every coordination contact enters the record with date, participants, information exchanged, and resulting plan — both because continuity requires it and because coordination documentation is precisely what distinguishes integrated treatment from parallel treatment in any subsequent utilization or licensing review. A useful discipline: if the treatment plan lists a prescriber as part of the team, the record should show contact at a clinically sensible cadence. Silence in the coordination section of a COD chart is not neutral; it is the documentary signature of the fragmented care this entire course exists to replace (Mueser et al., 2003; SAMHSA, 2020).</p>",
          "order": 6
        },
        {
          "type": "text",
          "content": "<h2>Withdrawal Risk Literacy: The Medical Line Every Counselor Must Know</h2>\n<p>One piece of pharmacological literacy is non-negotiable for any clinician treating co-occurring disorders, because getting it wrong can be lethal: <strong>not all withdrawal syndromes carry the same medical risk.</strong> Opioid withdrawal is intensely uncomfortable — clients describe it as the worst flu of their lives — but it is rarely medically dangerous in otherwise healthy adults. Alcohol and benzodiazepine withdrawal are the opposite: both can progress to seizures, and severe alcohol withdrawal can progress to delirium tremens, a syndrome with meaningful mortality even in hospital settings. The practical implication is absolute: a client with significant daily alcohol or benzodiazepine use who announces a plan to stop abruptly — this week, cold, on willpower — is describing a medical event, not a motivational milestone, and the counselor's response is immediate referral for medically managed withdrawal assessment, communicated with the same urgency as any other acute safety issue.</p>\n<p>The screening questions are simple enough to ask in any session: how much, how often, how recently, and what happened during past quit attempts. A history of withdrawal seizures, hallucinations, or delirium during previous discontinuation is the single strongest predictor of dangerous withdrawal ahead, and it changes the referral from advisable to mandatory. Clients frequently minimize — both from stigma and because tolerance normalizes staggering intake levels — so collateral history, where consented, and physiological signs such as morning tremor or drinking to stop shakes deserve weight. None of this asks the counselor to perform medical assessment; it asks the counselor to recognize which announcements require one, to know the local detoxification and withdrawal-management resources by name, and to bridge the client there while the window of willingness is open (SAMHSA, 2020).</p>",
          "textContent": "<h2>Withdrawal Risk Literacy: The Medical Line Every Counselor Must Know</h2>\n<p>One piece of pharmacological literacy is non-negotiable for any clinician treating co-occurring disorders, because getting it wrong can be lethal: <strong>not all withdrawal syndromes carry the same medical risk.</strong> Opioid withdrawal is intensely uncomfortable — clients describe it as the worst flu of their lives — but it is rarely medically dangerous in otherwise healthy adults. Alcohol and benzodiazepine withdrawal are the opposite: both can progress to seizures, and severe alcohol withdrawal can progress to delirium tremens, a syndrome with meaningful mortality even in hospital settings. The practical implication is absolute: a client with significant daily alcohol or benzodiazepine use who announces a plan to stop abruptly — this week, cold, on willpower — is describing a medical event, not a motivational milestone, and the counselor's response is immediate referral for medically managed withdrawal assessment, communicated with the same urgency as any other acute safety issue.</p>\n<p>The screening questions are simple enough to ask in any session: how much, how often, how recently, and what happened during past quit attempts. A history of withdrawal seizures, hallucinations, or delirium during previous discontinuation is the single strongest predictor of dangerous withdrawal ahead, and it changes the referral from advisable to mandatory. Clients frequently minimize — both from stigma and because tolerance normalizes staggering intake levels — so collateral history, where consented, and physiological signs such as morning tremor or drinking to stop shakes deserve weight. None of this asks the counselor to perform medical assessment; it asks the counselor to recognize which announcements require one, to know the local detoxification and withdrawal-management resources by name, and to bridge the client there while the window of willingness is open (SAMHSA, 2020).</p>",
          "order": 7
        },
        {
          "type": "multipleChoice",
          "question": "A client stabilized on buprenorphine tells you her sponsor says she is \"not really sober\" and she is considering stopping the medication without telling her prescriber. What is the strongest integrated-care response?",
          "options": [
            {
              "text": "Agree to keep the disclosure confidential to protect her autonomy and the therapeutic alliance.",
              "isCorrect": false
            },
            {
              "text": "Explore the stigma message and her ambivalence, provide accurate psychoeducation about maintenance pharmacotherapy, and arrange prompt prescriber contact with her knowledge.",
              "isCorrect": true
            },
            {
              "text": "Support the taper, since long-term buprenorphine use is itself a form of ongoing addiction.",
              "isCorrect": false
            },
            {
              "text": "Refer her to a different mutual-aid group and take no further action.",
              "isCorrect": false
            }
          ],
          "correctAnswer": 1,
          "explanation": "Stigma-driven, unsupervised discontinuation of buprenorphine sharply elevates relapse and overdose risk because tolerance falls quickly. The integrated response treats the sponsor's message as clinical material — exploring it with MI skills and correcting the pharmacological misunderstanding — while ensuring the prescriber is looped in transparently. Colluding with secrecy (A), endorsing the stigma (C), or deflecting to a group change alone (D) each leaves a physiologically significant decision unmanaged.",
          "order": 8
        },
        {
          "type": "sequencing",
          "instructions": "Coordinating a MAT Referral — place the steps of a well-coordinated MAT referral in the order that best protects engagement and safety.",
          "steps": [
            {
              "text": "Elicit the client's own concerns and prior experiences with medication using open questions"
            },
            {
              "text": "Provide accurate, stigma-countering psychoeducation about the medication options"
            },
            {
              "text": "Obtain a release of information covering the prospective prescriber"
            },
            {
              "text": "Make the referral with a concise clinical summary of substance use and mental health findings"
            },
            {
              "text": "Confirm the appointment occurred and elicit the client's reaction to the visit"
            },
            {
              "text": "Integrate the medication plan into shared treatment goals and ongoing monitoring"
            }
          ],
          "order": 9
        },
        {
          "type": "multiSelect",
          "question": "Which of the following are harm reduction interventions appropriately documented as treatment plan objectives for a COD client? (Select all that apply.)",
          "options": [
            {
              "text": "Client will carry naloxone and complete overdose-response teaching with a family member.",
              "isCorrect": true
            },
            {
              "text": "Client will use fentanyl test strips when using any non-prescribed substance.",
              "isCorrect": true
            },
            {
              "text": "Clinician will discontinue discrepancy-building to respect the client's decision to keep using.",
              "isCorrect": false
            },
            {
              "text": "Client will reduce drinking days from daily to three per week and track sleep on non-drinking nights.",
              "isCorrect": true
            },
            {
              "text": "Clinician will withhold overdose risk information to avoid inducing shame.",
              "isCorrect": false
            }
          ],
          "explanation": "Harm reduction objectives are specific, measurable, and safety-advancing — naloxone access, contamination testing, and staged use-reduction with functional tracking all qualify. Abandoning motivational work or withholding risk information are not harm reduction; they are abdications of the clinical duties the framework explicitly preserves.",
          "order": 10
        },
        {
          "type": "flashcardDeck",
          "instructions": "MAT and Harm Reduction — Key Terms",
          "flashcards": [
            {
              "id": "fc1",
              "front": "Partial agonist",
              "back": "Activates the opioid receptor at a reduced maximum effect, producing a ceiling that limits respiratory depression — the pharmacology behind buprenorphine's safety advantage."
            },
            {
              "id": "fc2",
              "front": "Opioid antagonist",
              "back": "Occupies the receptor without activating it, blocking other opioids — the mechanism of naltrexone, and of naloxone in overdose reversal."
            },
            {
              "id": "fc3",
              "front": "Induction",
              "back": "The supervised process of starting a MAT medication; for extended-release naltrexone it requires roughly seven to ten opioid-free days first."
            },
            {
              "id": "fc4",
              "front": "Diversion",
              "back": "Transfer of a prescribed medication to someone it was not prescribed for — a monitoring concern counselors are positioned to observe and route to the prescriber."
            },
            {
              "id": "fc5",
              "front": "Naloxone",
              "back": "A rapid-acting opioid antagonist that reverses overdose; equipping clients and families with it is a core harm reduction intervention, not an endorsement of use."
            },
            {
              "id": "fc6",
              "front": "Abstinence violation effect",
              "back": "The catastrophic, shame-driven interpretation of a lapse ('I've ruined everything') that converts a single event into full relapse — countered by reframing the lapse as data and compressing re-engagement."
            },
            {
              "id": "fc7",
              "front": "Warm handoff",
              "back": "A transition in which the referring provider makes direct, real-time contact between the client and the receiving provider — the continuity practice that most reliably survives high-risk transitions."
            },
            {
              "id": "fc8",
              "front": "Bidirectional recurrence",
              "back": "The COD relapse dynamic in which each condition's re-emergence becomes the other's highest-probability trigger, requiring prevention plans that track both signatures side by side."
            }
          ],
          "order": 11
        },
        {
          "type": "keyTakeaway",
          "title": "Key Takeaways — Section 4",
          "takeaways": [
            "MAT is first-line, evidence-based treatment for opioid and alcohol use disorders, and non-prescriber unfamiliarity is a documented driver of the treatment gap — referral fluency is a core COD competency, not an optional extra.",
            "Methadone, buprenorphine, and extended-release naltrexone differ in mechanism, setting, and access barriers; AUD medications require no specialty program, making counselor awareness the deciding referral variable.",
            "The benzodiazepine–opioid and benzodiazepine–alcohol combinations are prompt-notification findings, not routine coordination items.",
            "Harm reduction is staged, documented, pragmatic care that preserves engagement and duty-of-care obligations alike — a floor for safety while motivation develops, never a ceiling on recovery."
          ],
          "order": 12
        }
      ]
    },
    {
      "title": "Relapse Prevention, Crisis Response, and Continuity of Care",
      "order": 6,
      "estimatedTime": 45,
      "contentBlocks": [
        {
          "type": "sectionDivider",
          "sectionNumber": 5,
          "title": "Relapse Prevention, Crisis Response, and Continuity of Care",
          "subtitle": "Sustaining dual recovery beyond the treatment hour",
          "order": 1
        },
        {
          "type": "text",
          "content": "<h2>Relapse as Process: The Dual-Recurrence Dynamic</h2>\n<p>In co-occurring disorder treatment, relapse is never a single event in a single condition. The defining clinical reality of COD recovery is <strong>bidirectional recurrence</strong>: a depressive episode erodes the behavioral activation and social contact that sustained sobriety; a return to drinking destabilizes sleep and medication adherence, which precipitates the mood episode; and each condition's recurrence becomes the other's highest-probability trigger. Marlatt's cognitive-behavioral model of relapse — the interplay of high-risk situations, coping capacity, outcome expectancies, and the abstinence violation effect — maps onto this dynamic with one COD-specific amendment: psychiatric symptom emergence is itself a high-risk situation, and substance use is itself a psychiatric destabilizer (Marlatt &amp; Donovan, 2005).</p>\n<p>This reframe changes what monitoring looks like. Single-condition relapse prevention tracks craving, exposure, and coping rehearsal. Integrated relapse prevention tracks those <em>plus</em> the prodromal signature of the client's specific mental health condition — the two or three earliest, most personal indicators that an episode is building. For one client with bipolar I disorder, that signature is decreased sleep need plus a surge of ambitious projects; for a client with recurrent major depression, it is canceled plans and abandoned morning routines; for a client with PTSD, it is nightmare recurrence and avoidance of previously tolerated reminders. The integrated relapse prevention plan names both signatures side by side, names the interaction explicitly — \"when my sleep drops below six hours for three nights, my craving doubles\" — and pre-commits responses to each (Mueser et al., 2003).</p>\n<p>The abstinence violation effect deserves particular attention in COD work because shame is a shared engine of both conditions. The client who lapses and concludes \"I've ruined everything, I'm hopeless\" is simultaneously experiencing a relapse-process cognition and, frequently, a depressive cognition — and the clinical response to both is the same: reframe the lapse as data, compress the time between lapse and re-engagement, and treat rapid disclosure as the success behavior it is. Clients should leave relapse prevention planning knowing precisely what to do in the first twenty-four hours after a lapse — whom to contact, which appointment to keep no matter what, which medication decisions belong to the prescriber rather than to the moment (Marlatt &amp; Donovan, 2005).</p>\n<p>Finally, recurrence planning extends to the psychiatric side with equal specificity. The plan for emerging mania is not \"call someone\" — it is a named prescriber contact within a defined window, a pre-discussed medication review, sleep protection strategies, and, where indicated, temporary restriction of access to substances and spending. Clients build these plans most durably when they are written during stability, reviewed at intervals, and shared — with consent — with the people positioned to notice the signature before the client does (SAMHSA, 2020).</p>",
          "textContent": "<h2>Relapse as Process: The Dual-Recurrence Dynamic</h2>\n<p>In co-occurring disorder treatment, relapse is never a single event in a single condition. The defining clinical reality of COD recovery is <strong>bidirectional recurrence</strong>: a depressive episode erodes the behavioral activation and social contact that sustained sobriety; a return to drinking destabilizes sleep and medication adherence, which precipitates the mood episode; and each condition's recurrence becomes the other's highest-probability trigger. Marlatt's cognitive-behavioral model of relapse — the interplay of high-risk situations, coping capacity, outcome expectancies, and the abstinence violation effect — maps onto this dynamic with one COD-specific amendment: psychiatric symptom emergence is itself a high-risk situation, and substance use is itself a psychiatric destabilizer (Marlatt &amp; Donovan, 2005).</p>\n<p>This reframe changes what monitoring looks like. Single-condition relapse prevention tracks craving, exposure, and coping rehearsal. Integrated relapse prevention tracks those <em>plus</em> the prodromal signature of the client's specific mental health condition — the two or three earliest, most personal indicators that an episode is building. For one client with bipolar I disorder, that signature is decreased sleep need plus a surge of ambitious projects; for a client with recurrent major depression, it is canceled plans and abandoned morning routines; for a client with PTSD, it is nightmare recurrence and avoidance of previously tolerated reminders. The integrated relapse prevention plan names both signatures side by side, names the interaction explicitly — \"when my sleep drops below six hours for three nights, my craving doubles\" — and pre-commits responses to each (Mueser et al., 2003).</p>\n<p>The abstinence violation effect deserves particular attention in COD work because shame is a shared engine of both conditions. The client who lapses and concludes \"I've ruined everything, I'm hopeless\" is simultaneously experiencing a relapse-process cognition and, frequently, a depressive cognition — and the clinical response to both is the same: reframe the lapse as data, compress the time between lapse and re-engagement, and treat rapid disclosure as the success behavior it is. Clients should leave relapse prevention planning knowing precisely what to do in the first twenty-four hours after a lapse — whom to contact, which appointment to keep no matter what, which medication decisions belong to the prescriber rather than to the moment (Marlatt &amp; Donovan, 2005).</p>\n<p>Finally, recurrence planning extends to the psychiatric side with equal specificity. The plan for emerging mania is not \"call someone\" — it is a named prescriber contact within a defined window, a pre-discussed medication review, sleep protection strategies, and, where indicated, temporary restriction of access to substances and spending. Clients build these plans most durably when they are written during stability, reviewed at intervals, and shared — with consent — with the people positioned to notice the signature before the client does (SAMHSA, 2020).</p>",
          "order": 2
        },
        {
          "type": "callout",
          "calloutType": "clinical",
          "title": "Suicide Risk in COD: Elevated at Baseline, Spiking at Transitions",
          "content": "<p>Clients with co-occurring disorders carry substantially elevated suicide risk relative to either condition alone — substance use disorders independently multiply risk, intoxication lowers inhibition, and depressive and trauma-related conditions supply the ideation. Screening in COD care is therefore a cadence, not an intake checkbox: rescreen at every level-of-care transition, after any lapse or relapse, after significant losses, and whenever the psychiatric prodrome appears. Treat a positive screen during active use as urgent — the combination of ideation and intoxication is the highest-lethality window in this population — and follow your full risk assessment and safety planning protocol with prescriber and, where indicated, crisis-system involvement.</p>",
          "order": 3
        },
        {
          "type": "text",
          "content": "<h2>Crisis Response Planning: When Both Conditions Escalate at Once</h2>\n<p>Relapse prevention plans manage foreseeable deterioration; crisis plans manage acute danger. In COD practice the two must be built together, because the presentations blur: the client in a psychiatric crisis is disinhibited toward use, the client in a substance-use crisis is destabilized psychiatrically, and the highest-acuity presentations — intoxication with suicidal ideation, stimulant-induced psychosis, withdrawal with agitation — are irreducibly both. A crisis plan written for one condition will be half a plan on the night it is needed.</p>\n<p>The integrated crisis plan is written during stability, in the client's own language, and it answers five questions concretely. <em>What does my crisis look like?</em> — the specific escalation signs beyond the early-warning signature, including the substance-involved versions. <em>What can I do first?</em> — internal coping strategies the client has actually used successfully, not aspirational ones. <em>Who do I contact, in what order?</em> — named supports with numbers, then the counselor's practice with its after-hours reality stated honestly, then crisis lines including the 988 Suicide and Crisis Lifeline, then emergency services. <em>What should the people around me do?</em> — the consented instructions for family or partners, including what helps, what escalates, and when to override the client's in-the-moment objections. <em>What happens with my medications and my substances?</em> — prescriber contact expectations, and any pre-agreed environmental changes such as a family member temporarily holding medications where overdose risk is elevated.</p>\n<p>Two COD-specific design points deserve emphasis. First, the plan distinguishes response tiers: a lapse activates the twenty-four-hour lapse plan from the relapse prevention work; emerging psychiatric symptoms activate the prodrome response; acute danger activates the crisis tier. Clients under stress cannot make tier judgments for the first time in the moment, so the plan states the triggers for each tier in observable terms. Second, the plan anticipates the intoxication problem directly: several of the client's internal coping strategies and support contacts may be unavailable or unwise while intoxicated, so the intoxicated-crisis pathway is shorter and more external — fewer self-management steps, faster escalation to human contact and, where risk is present, to crisis services.</p>\n<p>After any crisis activation, the re-entry session does three things before ordinary treatment resumes: reconstructs the timeline without blame, harvests what the plan got right and wrong, and revises the document while the data is fresh. Handled this way, a crisis becomes the most clinically productive event in a treatment episode — the moment the plan stopped being a worksheet and became the client's own technology for surviving the intersection of two conditions (Mueser et al., 2003; SAMHSA, 2020).</p>",
          "textContent": "<h2>Crisis Response Planning: When Both Conditions Escalate at Once</h2>\n<p>Relapse prevention plans manage foreseeable deterioration; crisis plans manage acute danger. In COD practice the two must be built together, because the presentations blur: the client in a psychiatric crisis is disinhibited toward use, the client in a substance-use crisis is destabilized psychiatrically, and the highest-acuity presentations — intoxication with suicidal ideation, stimulant-induced psychosis, withdrawal with agitation — are irreducibly both. A crisis plan written for one condition will be half a plan on the night it is needed.</p>\n<p>The integrated crisis plan is written during stability, in the client's own language, and it answers five questions concretely. <em>What does my crisis look like?</em> — the specific escalation signs beyond the early-warning signature, including the substance-involved versions. <em>What can I do first?</em> — internal coping strategies the client has actually used successfully, not aspirational ones. <em>Who do I contact, in what order?</em> — named supports with numbers, then the counselor's practice with its after-hours reality stated honestly, then crisis lines including the 988 Suicide and Crisis Lifeline, then emergency services. <em>What should the people around me do?</em> — the consented instructions for family or partners, including what helps, what escalates, and when to override the client's in-the-moment objections. <em>What happens with my medications and my substances?</em> — prescriber contact expectations, and any pre-agreed environmental changes such as a family member temporarily holding medications where overdose risk is elevated.</p>\n<p>Two COD-specific design points deserve emphasis. First, the plan distinguishes response tiers: a lapse activates the twenty-four-hour lapse plan from the relapse prevention work; emerging psychiatric symptoms activate the prodrome response; acute danger activates the crisis tier. Clients under stress cannot make tier judgments for the first time in the moment, so the plan states the triggers for each tier in observable terms. Second, the plan anticipates the intoxication problem directly: several of the client's internal coping strategies and support contacts may be unavailable or unwise while intoxicated, so the intoxicated-crisis pathway is shorter and more external — fewer self-management steps, faster escalation to human contact and, where risk is present, to crisis services.</p>\n<p>After any crisis activation, the re-entry session does three things before ordinary treatment resumes: reconstructs the timeline without blame, harvests what the plan got right and wrong, and revises the document while the data is fresh. Handled this way, a crisis becomes the most clinically productive event in a treatment episode — the moment the plan stopped being a worksheet and became the client's own technology for surviving the intersection of two conditions (Mueser et al., 2003; SAMHSA, 2020).</p>",
          "order": 4
        },
        {
          "type": "callout",
          "calloutType": "tip",
          "title": "Know Your Crisis System Before You Need It",
          "content": "<p>Crisis plans are only as strong as the clinician's working knowledge of the local crisis landscape — gathered during ordinary time, not during an emergency. Before your next COD client needs it, confirm four things: how the 988 Suicide and Crisis Lifeline routes in your area and whether a local crisis line offers stronger follow-up; whether your region operates mobile crisis teams and what their response looks like for intoxicated callers; which facilities accept clients who are both psychiatrically acute and actively using, since some units still refuse one presentation or the other; and where medically managed withdrawal beds actually exist, with current intake numbers. Write the answers into a one-page resource sheet, date it, and revisit it quarterly — crisis systems change often, and an out-of-date referral number at two in the morning is the failure mode this preparation exists to prevent.</p>",
          "order": 5
        },
        {
          "type": "text",
          "content": "<h2>Recovery Supports and Continuity of Care</h2>\n<p>Integrated treatment does not end at the office door, and for co-occurring disorders the recovery environment carries unusual weight because two conditions must be supported in the same ecosystem. Mutual-aid participation is the most accessible support, and the research base — while stronger for substance use outcomes than psychiatric ones — supports facilitated linkage rather than passive suggestion: clients who are actively connected to a specific meeting, ideally with a named contact, attend at several times the rate of clients told to \"try a meeting\" (SAMHSA, 2020). The COD-specific complication is that some recovery communities remain ambivalent about psychiatric medication, as the buprenorphine discussion in the previous section illustrated. Clinicians should know their local landscape: Dual Recovery Anonymous and Double Trouble in Recovery groups are built explicitly for co-occurring conditions, and many mainstream twelve-step meetings are fully medication-affirming — but the clinician who asks, rather than assumes, spares clients a destabilizing collision between their support system and their treatment plan.</p>\n<p>Peer support specialists — people in sustained recovery employed within treatment systems — occupy a role no clinician can replicate: lived-experience credibility, practical navigation knowledge, and availability outside the appointment structure. Where certified peer services exist, the referral is a continuity multiplier, particularly across the transitions where COD clients are most frequently lost: hospital discharge, residential step-down, incarceration release, and detoxification without follow-on treatment. Every one of those transitions is a documented spike in overdose mortality, because tolerance falls while stressors surge — which is why warm handoffs, bridge appointments scheduled before discharge, and naloxone in hand at the door are not administrative niceties but mortality interventions (SAMHSA, 2021).</p>\n<p>Continuity is also a documentation discipline. The integrated record travels: releases of information executed for every active provider, a current medication list the counselor actually maintains, crisis and relapse plans stored where covering clinicians can find them, and coordination contacts documented with date, participants, and clinical content. When treatment involves 42 CFR Part 2-protected substance use records, the disclosure rules reviewed in the assessment section govern every one of these exchanges — integrated care never means casual information flow (SAMHSA, 2023).</p>\n<p>The course closes where integrated treatment begins: with the conviction that neither condition waits its turn. The clinician who screens both, treats both, coordinates the medication dimension, plans for the recurrence of both, and builds a recovery environment that supports both is practicing the model the evidence has endorsed for two decades — and offering clients with co-occurring disorders what sequential systems never could: one plan, one team, one recovery (Drake et al., 2004; Mueser et al., 2003).</p>",
          "textContent": "<h2>Recovery Supports and Continuity of Care</h2>\n<p>Integrated treatment does not end at the office door, and for co-occurring disorders the recovery environment carries unusual weight because two conditions must be supported in the same ecosystem. Mutual-aid participation is the most accessible support, and the research base — while stronger for substance use outcomes than psychiatric ones — supports facilitated linkage rather than passive suggestion: clients who are actively connected to a specific meeting, ideally with a named contact, attend at several times the rate of clients told to \"try a meeting\" (SAMHSA, 2020). The COD-specific complication is that some recovery communities remain ambivalent about psychiatric medication, as the buprenorphine discussion in the previous section illustrated. Clinicians should know their local landscape: Dual Recovery Anonymous and Double Trouble in Recovery groups are built explicitly for co-occurring conditions, and many mainstream twelve-step meetings are fully medication-affirming — but the clinician who asks, rather than assumes, spares clients a destabilizing collision between their support system and their treatment plan.</p>\n<p>Peer support specialists — people in sustained recovery employed within treatment systems — occupy a role no clinician can replicate: lived-experience credibility, practical navigation knowledge, and availability outside the appointment structure. Where certified peer services exist, the referral is a continuity multiplier, particularly across the transitions where COD clients are most frequently lost: hospital discharge, residential step-down, incarceration release, and detoxification without follow-on treatment. Every one of those transitions is a documented spike in overdose mortality, because tolerance falls while stressors surge — which is why warm handoffs, bridge appointments scheduled before discharge, and naloxone in hand at the door are not administrative niceties but mortality interventions (SAMHSA, 2021).</p>\n<p>Continuity is also a documentation discipline. The integrated record travels: releases of information executed for every active provider, a current medication list the counselor actually maintains, crisis and relapse plans stored where covering clinicians can find them, and coordination contacts documented with date, participants, and clinical content. When treatment involves 42 CFR Part 2-protected substance use records, the disclosure rules reviewed in the assessment section govern every one of these exchanges — integrated care never means casual information flow (SAMHSA, 2023).</p>\n<p>The course closes where integrated treatment begins: with the conviction that neither condition waits its turn. The clinician who screens both, treats both, coordinates the medication dimension, plans for the recurrence of both, and builds a recovery environment that supports both is practicing the model the evidence has endorsed for two decades — and offering clients with co-occurring disorders what sequential systems never could: one plan, one team, one recovery (Drake et al., 2004; Mueser et al., 2003).</p>",
          "order": 6
        },
        {
          "type": "accordion",
          "title": "Early Warning Signs Across Domains — Building the Client's Signature List",
          "accordionItems": [
            {
              "title": "Substance-Use Domain",
              "content": "Romanticizing past use, resumed contact with using associates, unstructured time expanding, testing exposure ('I can be around it now'), discontinuing recovery activities, and secrecy about whereabouts or money. The signature question: which two of these historically appeared first for this client?"
            },
            {
              "title": "Mood and Anxiety Domain",
              "content": "Sleep architecture changes in either direction, canceled plans and social withdrawal, abandoned routines, irritability disproportionate to triggers, hopeless or globally negative self-talk, and — for elevated-mood conditions — decreased sleep need with increased goal-directed activity and spending."
            },
            {
              "title": "Trauma-Related Domain",
              "content": "Nightmare recurrence, re-emerging avoidance of previously mastered situations, hypervigilance in safe settings, dissociative episodes, and anniversary reactions. Because clients frequently used substances to manage exactly these symptoms, their return is a dual-condition alarm, not a single-condition one."
            },
            {
              "title": "Functional and Interpersonal Domain",
              "content": "Missed appointments or doses, work attendance slipping, conflict frequency rising, self-care visibly declining, and withdrawal from the specific people named in the recovery plan. These signs are often visible to others before the client reports internal changes — which is the argument for consented plan-sharing."
            }
          ],
          "order": 7
        },
        {
          "type": "text",
          "content": "<h2>Family and Concerned Others in Dual Recovery</h2>\n<p>Families arrive at COD treatment exhausted by two conditions they usually understand as one — \"the drinking\" or \"the depression,\" whichever face the crisis wore most recently — and their involvement, structured well, is one of the strongest continuity assets available. The evidence-informed posture comes from the Community Reinforcement and Family Training tradition: reject both the confrontational intervention model and the pure-detachment counsel that leaves families passive, and instead teach concerned others to reinforce non-using, treatment-engaged behavior, to allow natural consequences without rescue, to communicate without escalation, and to protect their own functioning regardless of the client's trajectory (Miller &amp; Rollnick, 2013).</p>\n<p>The COD-specific addition is dual psychoeducation. Families who understand only the substance use condition will misread psychiatric prodromes as relapse behavior and respond with accusation exactly when support is needed; families who understand only the psychiatric condition will excuse escalating use as self-medication long past the point of danger. A single consented family session covering both conditions, the interaction between them, the client's early-warning signature, and the specific role the family has agreed to play in the relapse and crisis plans converts the household from a monitoring liability into the earliest detection system the treatment team has. Consent boundaries hold throughout: the client defines what is shared, releases are executed and documented, and where 42 CFR Part 2 records are involved, family communication follows the same disclosure rules as any other (SAMHSA, 2023). Handled with that discipline, family work is not a supplement to integrated treatment — it is integrated treatment, extended to the environment where recovery actually has to survive.</p>",
          "textContent": "<h2>Family and Concerned Others in Dual Recovery</h2>\n<p>Families arrive at COD treatment exhausted by two conditions they usually understand as one — \"the drinking\" or \"the depression,\" whichever face the crisis wore most recently — and their involvement, structured well, is one of the strongest continuity assets available. The evidence-informed posture comes from the Community Reinforcement and Family Training tradition: reject both the confrontational intervention model and the pure-detachment counsel that leaves families passive, and instead teach concerned others to reinforce non-using, treatment-engaged behavior, to allow natural consequences without rescue, to communicate without escalation, and to protect their own functioning regardless of the client's trajectory (Miller &amp; Rollnick, 2013).</p>\n<p>The COD-specific addition is dual psychoeducation. Families who understand only the substance use condition will misread psychiatric prodromes as relapse behavior and respond with accusation exactly when support is needed; families who understand only the psychiatric condition will excuse escalating use as self-medication long past the point of danger. A single consented family session covering both conditions, the interaction between them, the client's early-warning signature, and the specific role the family has agreed to play in the relapse and crisis plans converts the household from a monitoring liability into the earliest detection system the treatment team has. Consent boundaries hold throughout: the client defines what is shared, releases are executed and documented, and where 42 CFR Part 2 records are involved, family communication follows the same disclosure rules as any other (SAMHSA, 2023). Handled with that discipline, family work is not a supplement to integrated treatment — it is integrated treatment, extended to the environment where recovery actually has to survive.</p>",
          "order": 8
        },
        {
          "type": "multipleChoice",
          "question": "A client with co-occurring alcohol use disorder and major depressive disorder reports a two-day lapse after four months of abstinence, saying \"I knew I'd blow it eventually — there's no point now.\" Which response best applies integrated relapse-prevention principles?",
          "options": [
            {
              "text": "Recommend immediate transfer to a higher level of care, since the lapse demonstrates outpatient treatment has failed.",
              "isCorrect": false
            },
            {
              "text": "Address the abstinence violation cognition as both a relapse-process and depressive cognition, compress re-engagement, execute the 24-hour lapse plan, and rescreen for suicide risk.",
              "isCorrect": true
            },
            {
              "text": "Reassure him that lapses are normal and resume the standing treatment plan without modification.",
              "isCorrect": false
            },
            {
              "text": "Focus the session exclusively on identifying the drinking trigger, deferring mood assessment to the next appointment.",
              "isCorrect": false
            }
          ],
          "correctAnswer": 1,
          "explanation": "The client's statement is simultaneously an abstinence violation effect and a depressive cognition — integrated care treats it as both, reframes the lapse as data, activates the pre-built 24-hour plan, and rescreens risk because lapse-plus-hopelessness is a defined high-lethality window. Automatic level-of-care escalation (A) punishes disclosure; normalization without plan activation (C) wastes the prevention structure; single-condition triage (D) is precisely the sequential thinking this course has argued against.",
          "order": 9
        },
        {
          "type": "cardSort",
          "instructions": "Sort each relapse trigger into the domain a clinician would target it under: Internal (thoughts, emotions, physiology), External (places, objects, situations), or Interpersonal (people and relationships).",
          "categories": [
            "Internal",
            "External",
            "Interpersonal"
          ],
          "cards": [
            {
              "id": "cs1",
              "text": "Hopeless self-talk after a setback at work",
              "correctCategory": "Internal"
            },
            {
              "id": "cs2",
              "text": "Driving past the former dealer's neighborhood on a new commute",
              "correctCategory": "External"
            },
            {
              "id": "cs3",
              "text": "A sibling who pressures the client to 'just have one' at family events",
              "correctCategory": "Interpersonal"
            },
            {
              "id": "cs4",
              "text": "Three nights of deteriorating sleep during a depressive prodrome",
              "correctCategory": "Internal"
            },
            {
              "id": "cs5",
              "text": "Unsupervised cash from a new payday schedule",
              "correctCategory": "External"
            },
            {
              "id": "cs6",
              "text": "Reconnecting on social media with a former using partner",
              "correctCategory": "Interpersonal"
            },
            {
              "id": "cs7",
              "text": "Craving surges paired with anxiety before performance reviews",
              "correctCategory": "Internal"
            },
            {
              "id": "cs8",
              "text": "A stocked liquor cabinet at the in-laws' holiday gathering",
              "correctCategory": "External"
            },
            {
              "id": "cs9",
              "text": "Escalating conflict with a partner who resents recovery meeting time",
              "correctCategory": "Interpersonal"
            }
          ],
          "order": 10
        },
        {
          "type": "multipleChoice",
          "question": "Which care transition is associated with the sharpest spike in overdose mortality for clients with co-occurring disorders, and what intervention most directly addresses it?",
          "options": [
            {
              "text": "Intake to weekly outpatient care; addressed by extending session length.",
              "isCorrect": false
            },
            {
              "text": "Release from incarceration or discharge from detox/residential settings; addressed by warm handoffs, bridge appointments scheduled before discharge, and naloxone provided in hand.",
              "isCorrect": true
            },
            {
              "text": "Transfer between outpatient therapists; addressed by records transfer within thirty days.",
              "isCorrect": false
            },
            {
              "text": "Stepping up from outpatient to intensive outpatient care; addressed by increasing group frequency.",
              "isCorrect": false
            }
          ],
          "correctAnswer": 1,
          "explanation": "Post-release and post-discharge windows combine sharply reduced opioid tolerance with surging stressors, producing documented spikes in overdose deaths. The mortality-relevant interventions are structural and immediate: a warm handoff to a named provider, a bridge appointment that exists before the client walks out, and naloxone physically provided — not mailed, not suggested.",
          "order": 11
        },
        {
          "type": "keyTakeaway",
          "title": "Key Takeaways — Section 5",
          "takeaways": [
            "COD relapse is bidirectional: each condition's recurrence is the other's highest-probability trigger, so integrated prevention plans track the substance-use warning signs and the client's psychiatric prodromal signature side by side.",
            "The abstinence violation effect and depressive cognition share an engine — shame — and share a response: reframe the lapse as data, compress re-engagement, and execute a pre-built 24-hour plan.",
            "Suicide screening in COD care is a cadence — every transition, every lapse, every prodrome — with ideation-plus-intoxication treated as the highest-lethality window.",
            "Care transitions are mortality events: warm handoffs, pre-discharge bridge appointments, and naloxone in hand are the interventions that close the gap, all conducted within 42 CFR Part 2 disclosure rules."
          ],
          "order": 12
        }
      ]
    }
  ],
  "assessment": {
    "questions": [
      {
        "type": "multipleChoice",
        "question": "According to the 2022 SAMHSA NSDUH, approximately how many U.S. adults met criteria for BOTH a substance use disorder AND a mental illness in the past year?",
        "options": [
          {
            "text": "5.2 million",
            "isCorrect": false
          },
          {
            "text": "12.0 million",
            "isCorrect": false
          },
          {
            "text": "21.5 million",
            "isCorrect": true
          },
          {
            "text": "37.0 million",
            "isCorrect": false
          }
        ],
        "correctAnswer": 2,
        "explanation": "The 2022 NSDUH found approximately 21.5 million U.S. adults with both a SUD and any mental illness — the foundational prevalence figure for COD epidemiology."
      },
      {
        "type": "multipleChoice",
        "question": "The self-medication hypothesis, as articulated by Khantzian, primarily proposes that:",
        "options": [
          {
            "text": "Substance use disorders and mental health disorders share overlapping genetic and neurobiological risk factors",
            "isCorrect": false
          },
          {
            "text": "Individuals use specific substances to manage or alleviate pre-existing psychiatric symptoms",
            "isCorrect": true
          },
          {
            "text": "Repeated substance use lowers the threshold for psychiatric symptoms through neurobiological sensitization",
            "isCorrect": false
          },
          {
            "text": "Social marginalization and poverty drive both SUDs and mental illness through shared environmental pathways",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "The self-medication hypothesis proposes that substance use is functionally adaptive — individuals use specific substances to manage psychiatric symptoms. This is distinct from the shared vulnerability model (overlapping risk factors) and the sensitization model (neurobiological lowering of symptom threshold)."
      },
      {
        "type": "multipleChoice",
        "question": "A client presents with significant depressive symptoms and an AUDIT-C score of 6. Which statement about differential diagnosis is most clinically accurate?",
        "options": [
          {
            "text": "A high AUDIT-C score indicates the depression is substance-induced; psychiatric treatment should be deferred until sobriety is established",
            "isCorrect": false
          },
          {
            "text": "Because the conditions are bidirectional, the temporal relationship cannot be determined and treatment should be integrated regardless",
            "isCorrect": false
          },
          {
            "text": "Reassess psychiatric symptoms after 4–6 weeks of reduced or abstinent alcohol use; symptoms persisting at that point are more consistent with an independent disorder",
            "isCorrect": true
          },
          {
            "text": "DSM-5-TR prohibits diagnosing MDD in the context of active alcohol use disorder",
            "isCorrect": false
          }
        ],
        "correctAnswer": 2,
        "explanation": "The clinical standard is to conduct a reassessment after 4–6 weeks of significantly reduced or abstinent use. Symptoms that persist are more consistent with an independent disorder; symptoms that resolve are more consistent with substance-induced presentation. SAMHSA and DSM-5-TR both recommend treating both conditions while this differential is clarified."
      },
      {
        "type": "multipleChoice",
        "question": "In the SAMHSA Quadrant Model, a client with severe major depressive disorder and mild alcohol use disorder (two criteria met, no significant impairment) would most appropriately be assigned to:",
        "options": [
          {
            "text": "Quadrant I (low severity on both dimensions) — primary care or lower-intensity outpatient",
            "isCorrect": false
          },
          {
            "text": "Quadrant II (high psychiatric severity, low SUD severity) — mental health specialty with SUD monitoring",
            "isCorrect": true
          },
          {
            "text": "Quadrant III (high SUD severity, low psychiatric severity) — addiction specialty with psychiatric monitoring",
            "isCorrect": false
          },
          {
            "text": "Quadrant IV (high severity on both dimensions) — intensive integrated services",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "Quadrant II serves clients with high psychiatric severity and low SUD severity. The primary service driver is the mental health system, with systematic monitoring and support for the substance use dimension. Quadrant assignment guides triage, not rigid assignment."
      },
      {
        "type": "multipleChoice",
        "question": "The AUDIT-C uses a cutoff of 3 or above for women and 4 or above for men. A score above these thresholds indicates:",
        "options": [
          {
            "text": "A confirmed diagnosis of alcohol use disorder",
            "isCorrect": false
          },
          {
            "text": "The need for a formal structured diagnostic interview only; no clinical follow-up otherwise",
            "isCorrect": false
          },
          {
            "text": "Probable hazardous or harmful alcohol use warranting further clinical assessment",
            "isCorrect": true
          },
          {
            "text": "That the client should be immediately referred to an addiction specialist before mental health treatment proceeds",
            "isCorrect": false
          }
        ],
        "correctAnswer": 2,
        "explanation": "A positive AUDIT-C screen indicates probable hazardous or harmful alcohol use and the need for further assessment — not a confirmed diagnosis and not an automatic referral. It is a signal for clinical inquiry, not a definitive finding."
      },
      {
        "type": "multipleChoice",
        "question": "Under 42 CFR Part 2, which of the following disclosures of SUD records requires the patient's specific written consent?",
        "options": [
          {
            "text": "Sharing SUD records with a state health department for public health surveillance",
            "isCorrect": false
          },
          {
            "text": "Sharing SUD information with the client's psychiatrist for treatment coordination",
            "isCorrect": true
          },
          {
            "text": "Sharing SUD records with a CARF audit team conducting an accreditation review",
            "isCorrect": false
          },
          {
            "text": "Reporting the client's positive drug screen to their employer",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "Under 42 CFR Part 2, sharing SUD records with the client's own psychiatrist for treatment coordination requires the patient's specific written consent — unlike HIPAA, which permits treatment coordination disclosures without authorization. Audit and evaluation by oversight agencies are recognized exceptions; employer disclosure without consent would violate both Part 2 and HIPAA."
      },
      {
        "type": "multipleChoice",
        "question": "In IDDT, the \"persuasion\" stage is characterized by:",
        "options": [
          {
            "text": "Active CBT skills training and relapse prevention planning",
            "isCorrect": false
          },
          {
            "text": "Building a therapeutic relationship and meeting practical needs before addressing substance use directly",
            "isCorrect": false
          },
          {
            "text": "The client being engaged in treatment but ambivalent about changing their substance use",
            "isCorrect": true
          },
          {
            "text": "The client having achieved sustained recovery and working to consolidate gains",
            "isCorrect": false
          }
        ],
        "correctAnswer": 2,
        "explanation": "The persuasion stage is characterized by engagement in treatment but ambivalence about change. MI strategies that develop discrepancy and explore the client's own values and goals are the central clinical tools. The engagement stage precedes this and focuses on relationship-building; active treatment follows when commitment to change has developed."
      },
      {
        "type": "multipleChoice",
        "question": "A counselor working with a client receiving buprenorphine-naloxone for opioid use disorder discovers that the client also has an anxiety disorder. The counselor's most appropriate response is to:",
        "options": [
          {
            "text": "Recommend that the client discontinue buprenorphine before anxiety treatment can begin",
            "isCorrect": false
          },
          {
            "text": "Decline to address the opioid use disorder dimension and refer exclusively to the prescribing physician",
            "isCorrect": false
          },
          {
            "text": "Provide psychosocial support, relapse prevention, and anxiety-focused CBT alongside MAT coordination with the prescriber",
            "isCorrect": true
          },
          {
            "text": "Advise the client that buprenorphine is itself an addictive drug and explore non-medication alternatives",
            "isCorrect": false
          }
        ],
        "correctAnswer": 2,
        "explanation": "The counselor's role in MAT is psychosocial — providing relapse prevention, coping skills, and motivational support that medication alone cannot accomplish, while coordinating with the prescriber and supporting medication adherence. Discouraging MAT or sequencing psychiatric treatment after sobriety both contradict integrated treatment principles."
      },
      {
        "type": "multiSelect",
        "question": "Which of the following are core principles of Integrated Dual Disorder Treatment (IDDT)? (Select all that apply.)",
        "options": [
          {
            "text": "Integration: addressing both conditions in the same clinical relationship or team",
            "isCorrect": true
          },
          {
            "text": "Stage-wise treatment: matching interventions to the client's current stage of motivation",
            "isCorrect": true
          },
          {
            "text": "Abstinence as a precondition for psychiatric treatment",
            "isCorrect": false
          },
          {
            "text": "Assertive outreach: meeting clients where they are rather than waiting for them to engage",
            "isCorrect": true
          },
          {
            "text": "Long-term perspective: understanding COD recovery as a years-long process with predictable setbacks",
            "isCorrect": true
          },
          {
            "text": "Harm reduction as an explicit treatment component",
            "isCorrect": true
          }
        ],
        "explanation": "IDDT core principles include integration, comprehensiveness, assertive outreach, harm reduction, long-term perspective, stage-wise treatment, motivational interventions, and multiple psychotherapeutic modalities. Requiring abstinence as a precondition for psychiatric treatment is explicitly rejected — it is a feature of the sequential model that IDDT was developed to replace."
      },
      {
        "type": "multiSelect",
        "question": "Which of the following are accurate statements about the PHQ-9 in COD assessment? (Select all that apply.)",
        "options": [
          {
            "text": "A score of 10 or above indicates moderate-to-severe depression warranting clinical attention",
            "isCorrect": true
          },
          {
            "text": "Item 9 (suicidality) always requires clinical follow-up when endorsed",
            "isCorrect": true
          },
          {
            "text": "The PHQ-9 can reliably distinguish substance-induced depressive disorder from independent MDD",
            "isCorrect": false
          },
          {
            "text": "The PHQ-9 is available in multiple languages and free to use",
            "isCorrect": true
          },
          {
            "text": "A PHQ-9 score is sufficient to diagnose major depressive disorder without further clinical interview",
            "isCorrect": false
          }
        ],
        "explanation": "The PHQ-9 is a validated screening instrument — not a diagnostic tool — that cannot distinguish substance-induced from independent depression. It is available free in many languages; a score of 10+ warrants clinical attention; Item 9 requires follow-up. A formal MDD diagnosis requires a clinical interview."
      },
      {
        "type": "multiSelect",
        "question": "Which of the following are CBT adaptations appropriate for clients with co-occurring depression and alcohol use disorder? (Select all that apply.)",
        "options": [
          {
            "text": "Thought records that include a column connecting distorted cognitions to alcohol use triggers",
            "isCorrect": true
          },
          {
            "text": "Behavioral activation scheduling that explicitly replaces time previously devoted to drinking",
            "isCorrect": true
          },
          {
            "text": "Requiring abstinence before introducing any cognitive restructuring",
            "isCorrect": false
          },
          {
            "text": "Integrated relapse prevention that identifies depressive episodes as high-risk situations for alcohol use",
            "isCorrect": true
          },
          {
            "text": "Coping skills training framed explicitly as alternatives to alcohol for managing depressive symptoms",
            "isCorrect": true
          }
        ],
        "explanation": "CBT for COD integrates both dimensions: thought records, behavioral activation, and relapse prevention all must explicitly address the substance use as connected to the psychiatric symptoms. Requiring abstinence before CBT contradicts integrated treatment principles and is not supported by evidence."
      },
      {
        "type": "multipleChoice",
        "question": "A client with PTSD and stimulant use disorder tells you: \"I use cocaine to numb out the memories. I know it's bad but it's the only thing that works.\" Which motivational interviewing response best reflects the OARS skill of reflective listening while preparing the ground for further exploration?",
        "options": [
          {
            "text": "\"The cocaine is clearly a problem we need to address right away. Have you considered inpatient treatment?\"",
            "isCorrect": false
          },
          {
            "text": "\"It sounds like the cocaine is doing something really important for you — it helps you manage the memories in a way nothing else has. And I also hear that part of you knows this comes at a cost.\"",
            "isCorrect": true
          },
          {
            "text": "\"I understand you feel that way, but research shows cocaine makes PTSD worse in the long run.\"",
            "isCorrect": false
          },
          {
            "text": "\"Let's set a goal to reduce your cocaine use by 50% this week and then we'll discuss the PTSD.\"",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "The correct response uses a double-sided reflection that acknowledges the function of substance use (the client's self-medication account) while gently evoking awareness of the cost — activating the client's own ambivalence without confrontation. The other responses confront directly (response A), provide unsolicited psychoeducation that may evoke resistance (C), or impose a sequential goal (D)."
      },
      {
        "type": "multipleChoice",
        "question": "Which theoretical model most accurately describes the bidirectional relationship between cannabis use and anxiety discussed in this course?",
        "options": [
          {
            "text": "Shared vulnerability model only — cannabis and anxiety share genetic risk factors but do not interact causally",
            "isCorrect": false
          },
          {
            "text": "Self-medication hypothesis only — cannabis reduces anxiety through CB1 receptor activation and is therefore a rational adaptation",
            "isCorrect": false
          },
          {
            "text": "Bidirectional sensitization: low-dose THC may reduce anxiety acutely while high-dose and chronic use downregulate CB1 receptors, increasing baseline anxiety and generating withdrawal anxiety",
            "isCorrect": true
          },
          {
            "text": "Sequential model — cannabis use always precedes anxiety disorder onset and is therefore the primary diagnosis",
            "isCorrect": false
          }
        ],
        "correctAnswer": 2,
        "explanation": "The cannabis-anxiety relationship is genuinely bidirectional: low-dose THC may acutely reduce anxiety via CB1 receptor activation, while chronic high-dose use (increasingly common given elevated THC concentrations in current products) downregulates CB1 receptor density and produces rebound and withdrawal anxiety — ultimately worsening the anxiety it was recruited to manage."
      },
      {
        "type": "multipleChoice",
        "question": "The functional analysis of substance use in COD assessment maps which three components?",
        "options": [
          {
            "text": "Motivation, ambivalence, and readiness to change",
            "isCorrect": false
          },
          {
            "text": "Antecedents, behaviors, and consequences",
            "isCorrect": true
          },
          {
            "text": "Screening score, diagnostic criteria, and treatment history",
            "isCorrect": false
          },
          {
            "text": "Biological, psychological, and social risk factors",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "The functional analysis (ABC analysis) maps antecedents (triggers for substance use, including psychiatric symptoms), behaviors (the use pattern itself), and consequences (short-term relief that maintains use and long-term harms that motivate change). This framework makes the bidirectional COD cycle visible to both clinician and client."
      },
      {
        "type": "multipleChoice",
        "question": "Which of the following most accurately describes \"diagnostic overshadowing\" in COD assessment?",
        "options": [
          {
            "text": "Using a single screening instrument that is not validated for the population being assessed",
            "isCorrect": false
          },
          {
            "text": "One set of symptoms capturing the clinician's attention while the other co-occurring condition is systematically missed",
            "isCorrect": true
          },
          {
            "text": "The tendency for clients to underreport substance use because of stigma",
            "isCorrect": false
          },
          {
            "text": "Misattributing substance withdrawal symptoms to a psychiatric disorder",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "Diagnostic overshadowing refers to the common assessment error in which one set of symptoms — typically the referral reason or the condition expected in a given setting — captures clinical attention while the co-occurring condition is missed. Mental health clinicians overshadow substance use; addiction clinicians overshadow psychiatric disorders. Routine integrated screening prevents both directions of overshadowing."
      },
      {
        "type": "multipleChoice",
        "question": "Under the IDDT framework, when a client with schizophrenia and cannabis use disorder has disengaged from treatment after three missed appointments, the most appropriate clinical response is:",
        "options": [
          {
            "text": "Discharge the client for non-compliance and offer to re-engage when they are ready",
            "isCorrect": false
          },
          {
            "text": "Send a formal termination letter and document unsuccessful treatment",
            "isCorrect": false
          },
          {
            "text": "Assertive outreach — contact the client through home visits or preferred communication to maintain engagement without conditions",
            "isCorrect": true
          },
          {
            "text": "Require that the client demonstrate two consecutive weeks of sobriety before services resume",
            "isCorrect": false
          }
        ],
        "correctAnswer": 2,
        "explanation": "Assertive outreach is a core IDDT principle: the treatment meets the client where they are rather than expecting the client to meet arbitrary compliance conditions. Disengagement — especially with severe mental illness and COD — is a clinical signal for intensified outreach, not discharge. IDDT's long-term perspective explicitly rejects sobriety as a precondition for service."
      },
      {
        "type": "multipleChoice",
        "question": "A counselor at a federally assisted substance use disorder program receives a subpoena for a client's SUD treatment records as part of a civil legal proceeding. Under 42 CFR Part 2, the counselor's first obligation is to:",
        "options": [
          {
            "text": "Comply with the subpoena immediately, as court orders always supersede 42 CFR Part 2",
            "isCorrect": false
          },
          {
            "text": "Refuse disclosure and notify the client, then seek legal counsel and respond under the specific procedural requirements for court orders under 42 CFR Part 2",
            "isCorrect": true
          },
          {
            "text": "Disclose only with the client's verbal consent given at the time of the court order",
            "isCorrect": false
          },
          {
            "text": "Contact SAMHSA directly for authorization before responding",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "A subpoena alone does not satisfy the requirements for disclosure under 42 CFR Part 2. Court-ordered disclosure under Part 2 requires a court order that meets specific procedural requirements including notice to the patient, opportunity to be heard, and findings that good cause exists. The counselor's obligation is to resist disclosure, seek legal counsel, and respond within Part 2's court order framework — not to comply automatically with any subpoena."
      },
      {
        "type": "multipleChoice",
        "question": "Which statement most accurately characterizes buprenorphine within an integrated COD treatment plan?",
        "options": [
          {
            "text": "It is a full opioid agonist available only through certified opioid treatment programs with daily observed dosing.",
            "isCorrect": false
          },
          {
            "text": "It is a partial agonist with a ceiling effect that reduces overdose risk, prescribable in office-based settings, and its use as directed constitutes treatment rather than continued addiction.",
            "isCorrect": true
          },
          {
            "text": "It is an opioid antagonist requiring seven to ten opioid-free days before induction.",
            "isCorrect": false
          },
          {
            "text": "It is an aversive agent producing an unpleasant physiological reaction when opioids are used.",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "Buprenorphine's partial-agonist pharmacology and ceiling effect lower overdose risk, and office-based prescribing makes it the most accessible OUD medication; distinguishing prescribed maintenance from addiction is core counselor psychoeducation. Option A describes methadone, C describes extended-release naltrexone, and D describes disulfiram's mechanism for alcohol."
      },
      {
        "type": "multipleChoice",
        "question": "A counselor documents: 'Client will reduce drinking from daily to three days per week, carry naloxone, and use fentanyl test strips with any non-prescribed substance; rationale: preserve engagement and reduce overdose risk while motivation for abstinence develops.' This documentation best exemplifies:",
        "options": [
          {
            "text": "A boundary violation, because the counselor is endorsing continued substance use.",
            "isCorrect": false
          },
          {
            "text": "Defensible harm reduction practice — specific, measurable, safety-advancing objectives tied to explicit clinical rationale.",
            "isCorrect": true
          },
          {
            "text": "A breach of 42 CFR Part 2, because harm reduction goals cannot appear in protected records.",
            "isCorrect": false
          },
          {
            "text": "Sequential treatment, because substance use goals are being addressed before mental health goals.",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "Harm reduction objectives are legitimate treatment plan content when specific, measurable, and clinically reasoned — exactly what this note demonstrates. It endorses staged safety, not use (A); Part 2 governs disclosure, not goal content (C); and staged substance-use goals within one integrated plan are the opposite of sequential treatment (D)."
      },
      {
        "type": "multipleChoice",
        "question": "In integrated relapse prevention for a client with bipolar I disorder and stimulant use disorder, which plan element most directly reflects the bidirectional-recurrence principle?",
        "options": [
          {
            "text": "A list of drug-using associates to avoid, reviewed monthly.",
            "isCorrect": false
          },
          {
            "text": "A written linkage — 'three nights under six hours of sleep with new ambitious projects means prescriber contact within 48 hours AND doubled recovery-meeting attendance' — pairing the psychiatric prodrome with substance-use protections.",
            "isCorrect": true
          },
          {
            "text": "An abstinence contract with escalating consequences for positive screens.",
            "isCorrect": false
          },
          {
            "text": "A commitment to address mood symptoms only after ninety days of verified abstinence.",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "Bidirectional recurrence means each condition's early signs trigger protective action in both domains — option B operationalizes exactly that pairing. Avoidance lists (A) are single-condition tools, contingency punishment (C) contradicts the engagement evidence, and deferring mood treatment (D) is the sequential fallacy the integrated model exists to correct."
      }
    ]
  },
  "references": [
    {
      "citation": "Drake, R. E., Mueser, K. T., Brunette, M. F., & McHugo, G. J. (2004). A review of treatments for people with severe mental illnesses and co-occurring substance use disorders. <em>Psychiatric Rehabilitation Journal, 27</em>(4), 360–374. https://doi.org/10.2975/27.2004.360.374"
    },
    {
      "citation": "Drake, R. E., O'Neal, E. L., & Wallach, M. A. (2008). A systematic review of psychosocial research on psychosocial interventions for people with co-occurring severe mental and substance use disorders. <em>Journal of Substance Abuse Treatment, 34</em>(1), 123–138. https://doi.org/10.1016/j.jsat.2007.01.011"
    },
    {
      "citation": "Mueser, K. T., Noordsy, D. L., Drake, R. E., & Fox, L. (2003). <em>Integrated treatment for dual disorders: A guide to effective practice.</em> Guilford Press."
    },
    {
      "citation": "Brunette, M. F., Mueser, K. T., & Drake, R. E. (2004). A review of research on residential programs for people with severe mental illness and co-occurring substance use disorders. <em>Drug and Alcohol Review, 23</em>(4), 471–481. https://doi.org/10.1080/09595230412331324590"
    },
    {
      "citation": "Minkoff, K., & Cline, C. A. (2004). Changing the world: The design and implementation of comprehensive continuous integrated systems of care for individuals with co-occurring disorders. <em>Psychiatric Clinics of North America, 27</em>(4), 727–743. https://doi.org/10.1016/j.psc.2004.07.008"
    },
    {
      "citation": "Substance Abuse and Mental Health Services Administration. (2020). <em>Treatment improvement protocol (TIP) 42: Substance use treatment for persons with co-occurring disorders.</em> SAMHSA Publication No. PEP20-02-01-004. https://store.samhsa.gov/product/tip-42-substance-abuse-treatment-persons-co-occurring-disorders"
    },
    {
      "citation": "Substance Abuse and Mental Health Services Administration. (2023). <em>2022 National survey on drug use and health (NSDUH): Detailed tables.</em> Center for Behavioral Health Statistics and Quality. https://www.samhsa.gov/data/data-we-collect/nsduh-national-survey-drug-use-and-health"
    },
    {
      "citation": "Khantzian, E. J. (1997). The self-medication hypothesis of substance use disorders: A reconsideration and recent applications. <em>Harvard Review of Psychiatry, 4</em>(5), 231–244. https://doi.org/10.3109/10673229709030550"
    },
    {
      "citation": "Kendler, K. S., Prescott, C. A., Myers, J., & Neale, M. C. (2003). The structure of genetic and environmental risk factors for common psychiatric and substance use disorders in men and women. <em>Archives of General Psychiatry, 60</em>(9), 929–937. https://doi.org/10.1001/archpsyc.60.9.929"
    },
    {
      "citation": "American Psychiatric Association. (2022). <em>Diagnostic and statistical manual of mental disorders</em> (5th ed., text rev.). American Psychiatric Association Publishing. https://doi.org/10.1176/appi.books.9780890425787"
    },
    {
      "citation": "Miller, W. R., & Rollnick, S. (2013). <em>Motivational interviewing: Helping people change</em> (3rd ed.). Guilford Press."
    },
    {
      "citation": "Prochaska, J. O., & DiClemente, C. C. (1983). Stages and processes of self-change of smoking: Toward an integrative model of change. <em>Journal of Consulting and Clinical Psychology, 51</em>(3), 390–395. https://doi.org/10.1037/0022-006X.51.3.390"
    },
    {
      "citation": "Bush, K., Kivlahan, D. R., McDonell, M. B., Fihn, S. D., & Bradley, K. A. (1998). The AUDIT alcohol consumption questions (AUDIT-C): An effective brief screening test for problem drinking. <em>Archives of Internal Medicine, 158</em>(16), 1789–1795. https://doi.org/10.1001/archinte.158.16.1789"
    },
    {
      "citation": "Kroenke, K., Spitzer, R. L., & Williams, J. B. W. (2001). The PHQ-9: Validity of a brief depression severity measure. <em>Journal of General Internal Medicine, 16</em>(9), 606–613. https://doi.org/10.1046/j.1525-1497.2001.016009606.x"
    },
    {
      "citation": "Weathers, F. W., Litz, B. T., Keane, T. M., Palmieri, P. A., Marx, B. P., & Schnurr, P. P. (2013). <em>The PTSD Checklist for DSM-5 (PCL-5).</em> National Center for PTSD. https://www.ptsd.va.gov"
    },
    {
      "citation": "Sheehan, D. V., Lecrubier, Y., Sheehan, K. H., Amorim, P., Janavs, J., Weiller, E., Hergueta, T., Baker, R., & Dunbar, G. C. (1998). The Mini-International Neuropsychiatric Interview (M.I.N.I.): The development and validation of a structured diagnostic psychiatric interview for DSM-IV and ICD-10. <em>Journal of Clinical Psychiatry, 59</em>(Suppl. 20), 22–33."
    },
    {
      "citation": "Substance Abuse and Mental Health Services Administration. (2023). <em>Advisory: Confidentiality of substance use disorder patient records — 42 CFR Part 2 revised rule.</em> SAMHSA. https://www.samhsa.gov/about-us/who-we-are/laws-regulations/confidentiality-regulations-faqs"
    },
    {
      "citation": "Ziedonis, D., Bhatt, M., Gupta, S., & Obach, R. S. (2005). Dual diagnosis. In B. J. Sadock & V. A. Sadock (Eds.), <em>Kaplan and Sadock's comprehensive textbook of psychiatry</em> (8th ed., pp. 1263–1290). Lippincott Williams & Wilkins."
    },
    {
      "citation": "Marlatt, G. A., & Donovan, D. M. (Eds.). (2005). <em>Relapse prevention: Maintenance strategies in the treatment of addictive behaviors</em> (2nd ed.). Guilford Press."
    },
    {
      "citation": "Substance Abuse and Mental Health Services Administration. (2021). <em>Medications for opioid use disorder: Treatment improvement protocol (TIP) series 63</em> (SAMHSA Publication No. PEP21-02-01-002). U.S. Department of Health and Human Services."
    }
  ]
};

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
  await doc.save();   // pre-save hook computes wordCount + totalContentBlocks

  const saved = await Course.findOne({ slug: COURSE.slug }).lean();
  if (!saved || !saved.wordCount || !saved.totalContentBlocks) {
    console.error('❌ READ-BACK FAILED — hook fields missing:', saved && { wordCount: saved.wordCount, totalContentBlocks: saved.totalContentBlocks });
    await mongoose.disconnect();
    process.exit(1);
  }
  console.log(`✅ DB verified ${saved.courseCode} — wordCount=${saved.wordCount}, totalContentBlocks=${saved.totalContentBlocks}, sections=${saved.sections.length} (target ${(saved.ceHours || 0) * 6000})`);
  if (saved.wordCount < (saved.ceHours || 0) * 6000) {
    console.warn('⚠ UNDER word target — investigate before publishing.');
  }
  await mongoose.disconnect();
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  seed().catch(e => { console.error('SEED ERROR:', e.message); process.exit(1); });
}
