/**
 * Copyright (c) 2026 CounselorReady / GA Integrated Therapeutic Perspectives, LLC.
 */
import mongoose from 'mongoose';
import { Course } from '../models/InteractiveCourse.js';
import 'dotenv/config';

// CR-307 EXPANDED — canonical sections[] shape; saves through the model (wordCount hook fires).
const COURSE_DATA = {
  "title": "Compulsive Sexual Behavior and Intimacy Disorders: Assessment and Treatment",
  "slug": "compulsive-sexual-behavior-intimacy-disorders",
  "courseCode": "CR-307",
  "description": "A comprehensive 3-hour continuing education course for licensed mental health professionals. Meets NBCC ACEP standards with 18,238 words of graduate-level clinical content.",
  "ceHours": 3,
  "credits": 3,
  "category": "Clinical",
  "ceCategory": "Clinical",
  "ceuHours": 3,
  "ceuEligible": true,
  "approvingBody": "NBCC",
  "approvalNumber": "#7760",
  "creditType": "NBCC",
  "acepProvider": {
    "name": "GA Integrated Therapeutic Perspectives LLC",
    "number": "7760"
  },
  "instructor": "GA Integrated Therapeutic Perspectives LLC",
  "targetAudience": [
    "Licensed mental health professionals including LPCs, LCSWs, LMFTs, psychologists, and NCCs who encounter compulsive sexual behavior, problematic pornography use, and intimacy disorders in clinical practice."
  ],
  "accessType": "subscription",
  "price": 59.99,
  "pricingTier": "standard",
  "status": "draft",
  "isPublished": false,
  "isActive": true,
  "passingScore": 80,
  "maxAttempts": 3,
  "settings": {
    "passingScore": 80,
    "certificateEnabled": true,
    "requireEvaluation": true,
    "requireAttestation": true
  },
  "objectives": [
    "Define compulsive sexual behavior disorder (CSBD) per ICD-11 criteria and distinguish it from sexual addiction models, paraphilic disorders, and normative high sexual desire.",
    "Apply validated assessment instruments including the CSBI and SCS within a biopsychosocial framework for clinical evaluation of compulsive sexual behavior.",
    "Identify the neurobiological, psychological, and interpersonal mechanisms that maintain compulsive sexual behavior and inform evidence-based treatment selection.",
    "Describe cognitive-behavioral, ACT-based, and motivational approaches for compulsive sexual behavior that are supported by current clinical evidence.",
    "Assess and address the specific clinical needs of clients with problematic pornography use, including its impacts on intimacy, relationships, and sexual functioning.",
    "Identify intimacy disorders — including avoidant attachment, intimacy avoidance, and emotional intimacy deficits — and their relationship to compulsive sexual behavior and sexual dysfunction."
  ],
  "assessment": {
    "isExam": true,
    "passingScore": 80,
    "maxAttempts": 3,
    "showExplanations": false,
    "questions": [
      {
        "question": "ICD-11 compulsive sexual behavior disorder (CSBD) is classified as:",
        "type": "multipleChoice",
        "options": [
          {
            "text": "A sexual dysfunction",
            "isCorrect": false
          },
          {
            "text": "An addictive disorder analogous to gambling disorder",
            "isCorrect": false
          },
          {
            "text": "An impulse control disorder",
            "isCorrect": true
          },
          {
            "text": "A paraphilic disorder",
            "isCorrect": false
          }
        ],
        "correctAnswer": 2,
        "explanation": "The correct answer is an impulse control disorder. The ICD-11 classifies CSBD under impulse control disorders (F63.8), reflecting a cautious, evidence-informed approach rather than adopting the addiction framework that lacks sufficient empirical validation. While the addiction model (option B) has been influential in treatment communities, neither the DSM-5 nor the ICD-11 validated it as a diagnostic category for sexual behavior."
      },
      {
        "question": "AASECT's official position on sex addiction is:",
        "type": "multipleChoice",
        "options": [
          {
            "text": "Sexual addiction is a well-validated diagnostic category requiring addiction-based treatment",
            "isCorrect": false
          },
          {
            "text": "There is insufficient empirical evidence to support sex addiction as a clinical diagnosis",
            "isCorrect": true
          },
          {
            "text": "Sexual addiction affects approximately 6% of the adult population",
            "isCorrect": false
          },
          {
            "text": "Sex addiction treatment should follow the 12-step model exclusively",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "The correct answer is that there is insufficient empirical evidence to support sex addiction as a clinical diagnosis. AASECT's official position statement explicitly states this, representing a competing perspective within the clinical field that challenges the addiction framework. Option A is incorrect because it directly contradicts AASECT's position, which questions the very validity of sexual addiction as a diagnostic category."
      },
      {
        "question": "The primary distinguishing feature of compulsive sexual behavior disorder in ICD-11 is:",
        "type": "multipleChoice",
        "options": [
          {
            "text": "High frequency of sexual activity regardless of distress",
            "isCorrect": false
          },
          {
            "text": "Persistent failure to control intense sexual urges causing marked distress or functional impairment",
            "isCorrect": true
          },
          {
            "text": "Sexual behavior that is inconsistent with cultural norms",
            "isCorrect": false
          },
          {
            "text": "Sexual behavior involving paraphilic interests",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "The correct answer is persistent failure to control intense sexual urges causing marked distress or functional impairment. The ICD-11 criteria require both subjective loss of control over sexual urges and clinically significant distress or impairment in functioning, persisting for at least six months. Option A (high frequency regardless of distress) is incorrect because frequency alone does not constitute CSBD; a person with high sexual desire who lacks subjective loss of control and distress does not meet criteria."
      },
      {
        "question": "Which assessment instrument was specifically developed for hypersexual behavior in men:",
        "type": "multipleChoice",
        "options": [
          {
            "text": "Sexual Compulsivity Scale (SCS)",
            "isCorrect": false
          },
          {
            "text": "Hypersexual Behavior Inventory (HBI)",
            "isCorrect": true
          },
          {
            "text": "Female Sexual Function Index (FSFI)",
            "isCorrect": false
          },
          {
            "text": "Compulsive Sexual Behavior Inventory (CSBI)",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "The correct answer is the Hypersexual Behavior Inventory (HBI). The HBI is a 19-item measure developed specifically for assessing hypersexual behavior in men, as described in Reid and colleagues' (2011) psychometric development study. The Sexual Compulsivity Scale (option A) is a general 10-item sexual compulsivity measure not specifically designed for men, making it the most plausible but incorrect alternative."
      },
      {
        "question": "The neurobiological model most supported by current research positions problematic sexual behavior as:",
        "type": "multipleChoice",
        "options": [
          {
            "text": "A primary dopaminergic addiction indistinguishable from substance use disorder",
            "isCorrect": false
          },
          {
            "text": "Involving reward circuitry in ways that may parallel impulsive/compulsive mechanisms without meeting full addiction criteria",
            "isCorrect": true
          },
          {
            "text": "A purely psychological phenomenon with no neurobiological component",
            "isCorrect": false
          },
          {
            "text": "Exclusively a paraphilic disorder with different neurobiology from other compulsive behaviors",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "The correct answer is that CSBD involves reward circuitry in ways that may parallel impulsive/compulsive mechanisms without meeting full addiction criteria. Neuroimaging research by Voon and colleagues (2014) found increased activation in the amygdala, ventral striatum, and dorsal anterior cingulate, but the field has not confirmed full addiction model criteria such as consistent tolerance and withdrawal phenomena. Option A is incorrect because research has identified important disanalogies with substance use disorders that prevent equating CSBD with a primary dopaminergic addiction."
      },
      {
        "question": "Problematic pornography use is most accurately described as:",
        "type": "multipleChoice",
        "options": [
          {
            "text": "A clearly validated diagnostic category in DSM-5",
            "isCorrect": false
          },
          {
            "text": "A subcategory of CSBD in which pornography is the primary sexual behavior of concern",
            "isCorrect": true
          },
          {
            "text": "A form of sexual addiction requiring 12-step treatment",
            "isCorrect": false
          },
          {
            "text": "A normal variation in sexual behavior that should never be pathologized",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "The correct answer is a subcategory of CSBD in which pornography is the primary sexual behavior of concern. Problematic pornography use is characterized by subjective loss of control, distress, and functional impairment related to pornography use, and it is clinically understood as a specific presentation within the broader CSBD framework. Option A is incorrect because problematic pornography use is not a validated diagnostic category in the DSM-5, which did not include any form of hypersexual or compulsive sexual behavior diagnosis."
      },
      {
        "question": "Partner trauma — the distress experienced by partners of individuals with CSBD — most closely resembles:",
        "type": "multipleChoice",
        "options": [
          {
            "text": "Separation anxiety disorder",
            "isCorrect": false
          },
          {
            "text": "Adjustment disorder with anxious mood",
            "isCorrect": false
          },
          {
            "text": "Post-traumatic stress disorder in its symptom profile",
            "isCorrect": true
          },
          {
            "text": "Dependent personality disorder",
            "isCorrect": false
          }
        ],
        "correctAnswer": 2,
        "explanation": "The correct answer is post-traumatic stress disorder in its symptom profile. Research by Steffens and Rennie (2006) documented that many partners of individuals with compulsive sexual behavior met PTSD criteria following disclosure, experiencing intrusive thoughts, hypervigilance, avoidance of intimacy, and significant trust disruption. Adjustment disorder (option B) is incorrect because the severity and specific trauma symptom profile observed in partners goes beyond what adjustment disorder captures, warranting trauma-informed clinical intervention."
      },
      {
        "question": "Acceptance and Commitment Therapy (ACT) addresses compulsive sexual behavior through:",
        "type": "multipleChoice",
        "options": [
          {
            "text": "Behavioral extinction of sexual urges through abstinence",
            "isCorrect": false
          },
          {
            "text": "Values clarification and psychological flexibility to reduce experiential avoidance driving compulsive behavior",
            "isCorrect": true
          },
          {
            "text": "Cognitive restructuring of sexual addiction beliefs",
            "isCorrect": false
          },
          {
            "text": "Systematic desensitization of sexual urges",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "The correct answer is values clarification and psychological flexibility to reduce experiential avoidance driving compulsive behavior. ACT conceptualizes compulsive sexual behavior as an experiential avoidance strategy -- a behavioral escape from unwanted internal states such as loneliness, anxiety, and shame -- and builds psychological flexibility and values-driven behavioral alternatives. Option A (behavioral extinction through abstinence) is incorrect because ACT does not aim to extinguish urges through abstinence but rather develops the capacity to hold uncomfortable experiences without reacting through compulsive avoidance."
      },
      {
        "question": "Intimacy avoidance as a clinical pattern is most directly associated with:",
        "type": "multipleChoice",
        "options": [
          {
            "text": "Insecure attachment — particularly dismissive-avoidant attachment style — developed through early relational experiences",
            "isCorrect": true
          },
          {
            "text": "Low sexual desire as the primary presenting concern",
            "isCorrect": false
          },
          {
            "text": "Antisocial personality as the underlying etiology",
            "isCorrect": false
          },
          {
            "text": "Sexual trauma as the only causal pathway",
            "isCorrect": false
          }
        ],
        "correctAnswer": 0,
        "explanation": "The correct answer is insecure attachment, particularly dismissive-avoidant attachment style, developed through early relational experiences. The course identifies dismissive-avoidant attachment as the pattern most directly associated with intimacy avoidance, as individuals who learned that emotional dependence is unsafe develop defensive self-reliance and deactivation of the attachment system in response to intimacy. Option D (sexual trauma as the only causal pathway) is incorrect because while trauma can contribute to intimacy avoidance, the attachment framework identifies multiple developmental pathways including consistent caregiver unavailability and rejection of attachment needs."
      },
      {
        "question": "The ethical obligation regarding sex addiction terminology in clinical documentation is to:",
        "type": "multipleChoice",
        "options": [
          {
            "text": "Use ICD-11 CSBD criteria rather than 'sexual addiction' given lack of DSM-5/ICD-11 validation",
            "isCorrect": true
          },
          {
            "text": "Exclusively use the client's preferred terminology",
            "isCorrect": false
          },
          {
            "text": "Document both terms to cover all clinical and insurance requirements",
            "isCorrect": false
          },
          {
            "text": "Avoid documentation of sexual behavior concerns entirely",
            "isCorrect": false
          }
        ],
        "correctAnswer": 0,
        "explanation": "The correct answer is to use ICD-11 CSBD criteria rather than 'sexual addiction' given the lack of DSM-5/ICD-11 validation. Because 'sexual addiction' is not a validated diagnostic category in either the DSM-5 or ICD-11, clinicians have an ethical obligation to use evidence-based diagnostic terminology in clinical documentation rather than unsupported diagnostic labels. Option B (exclusively using the client's preferred terminology) is incorrect because while client language matters therapeutically, clinical documentation must adhere to validated diagnostic frameworks regardless of client preference."
      },
      {
        "question": "Motivational interviewing is particularly valuable in compulsive sexual behavior clinical work because:",
        "type": "multipleChoice",
        "options": [
          {
            "text": "It provides the behavioral extinction necessary for recovery",
            "isCorrect": false
          },
          {
            "text": "It addresses the ambivalence about behavior change that is common and clinically significant in this population",
            "isCorrect": true
          },
          {
            "text": "It is the only evidence-based approach with RCT support for CSBD",
            "isCorrect": false
          },
          {
            "text": "It is required by ethical guidelines for this population",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "The correct answer is that MI addresses the ambivalence about behavior change that is common and clinically significant in this population. Ambivalence about change is nearly universal in CSBD because individuals may experience the behavior as partially ego-syntonic or may present under external pressure rather than internal motivation, and MI's non-judgmental, evocative stance creates conditions for internal motivation to develop. Option C is incorrect because MI is not required by ethical guidelines; rather, it is indicated by the clinical characteristics of the population."
      },
      {
        "question": "The sexual double bind describes:",
        "type": "multipleChoice",
        "options": [
          {
            "text": "The situation in which both partners experience sexual dysfunction simultaneously",
            "isCorrect": false
          },
          {
            "text": "The clinical dynamic in which sexual behavior is driven by both compulsive urges and shame about those urges",
            "isCorrect": true
          },
          {
            "text": "The paradox of recommending abstinence for sexual compulsivity",
            "isCorrect": false
          },
          {
            "text": "The situation in which treatment increases awareness of sexual urges temporarily",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "The correct answer is the clinical dynamic in which sexual behavior is driven by both compulsive urges and shame about those urges. The sexual double bind describes how the shame about sexual behavior paradoxically maintains the compulsive cycle, as both the urge and the shame are powerfully motivating forces that reinforce one another. Option C (the paradox of recommending abstinence) is incorrect because the sexual double bind refers specifically to the internal psychological dynamic between compulsive urges and shame, not to a treatment planning dilemma."
      },
      {
        "question": "Intimacy disorder in the context of compulsive sexual behavior is best described as:",
        "type": "multipleChoice",
        "options": [
          {
            "text": "Absence of sexual desire for intimate partners",
            "isCorrect": false
          },
          {
            "text": "Deficits in emotional intimacy capacity that drive compulsive sexual behavior as a substitute for genuine connection",
            "isCorrect": true
          },
          {
            "text": "Sexual dysfunction that prevents intimate partner sexual activity",
            "isCorrect": false
          },
          {
            "text": "Personality disorder that precludes the formation of intimate relationships",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "The correct answer is deficits in emotional intimacy capacity that drive compulsive sexual behavior as a substitute for genuine connection. The course emphasizes that compulsive sexual behavior often substitutes for authentic emotional intimacy, providing a form of connection that avoids the vulnerability of genuine relational closeness, and that treating only the compulsive behavior without addressing underlying intimacy deficits produces incomplete recovery. Option A (absence of sexual desire for intimate partners) is incorrect because intimacy disorder in this context refers to emotional intimacy capacity deficits, not to sexual desire or dysfunction per se."
      },
      {
        "question": "Relapse prevention in CSBD treatment is most effective when it:",
        "type": "multipleChoice",
        "options": [
          {
            "text": "Focuses exclusively on abstinence from all sexual behavior as the treatment goal",
            "isCorrect": false
          },
          {
            "text": "Addresses individual triggers, high-risk situations, and values-based behavioral alternatives alongside social support",
            "isCorrect": true
          },
          {
            "text": "Follows the 12-step model without adaptation to individual presentations",
            "isCorrect": false
          },
          {
            "text": "Focuses primarily on shame reduction without behavioral components",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "The correct answer is that relapse prevention addresses individual triggers, high-risk situations, and values-based behavioral alternatives alongside social support. The cognitive-behavioral relapse prevention model identifies specific high-risk situations -- including emotional states, interpersonal contexts, and environmental cues -- and develops individualized coping plans with practical strategies and accountability structures. Option A (focusing exclusively on abstinence from all sexual behavior) is incorrect because effective relapse prevention is individualized and values-based rather than requiring blanket abstinence from all sexual activity."
      },
      {
        "question": "The clinical standard of care for couples affected by CSBD disclosure:",
        "type": "multipleChoice",
        "options": [
          {
            "text": "Requires immediate couples therapy as the primary treatment modality",
            "isCorrect": false
          },
          {
            "text": "Typically involves staged treatment: individual stabilization for the CSBD partner, crisis support for the affected partner, and couples work when both are ready",
            "isCorrect": true
          },
          {
            "text": "Prioritizes the CSBD partner's individual treatment without attention to partner needs",
            "isCorrect": false
          },
          {
            "text": "Requires assessment of both partners for addiction disorders",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "The correct answer is staged treatment: individual stabilization for the CSBD partner, crisis support for the affected partner, and couples work when both are ready. The course describes a staged approach beginning with individual stabilization and partner crisis support, followed by couples work only after both partners have achieved sufficient individual stabilization. Option A (requiring immediate couples therapy) is incorrect because initiating couples work before individual stabilization risks overwhelming both partners and undermining the therapeutic process."
      },
      {
        "type": "multipleChoice",
        "question": "Estimates of CSBD prevalence vary widely primarily because:",
        "options": [
          {
            "text": "Researchers do not study it",
            "isCorrect": false
          },
          {
            "text": "Definitions vary — stricter impairment-based definitions yield lower estimates than broad self-report measures that may capture moral incongruence and high desire",
            "isCorrect": true
          },
          {
            "text": "It does not occur across cultures",
            "isCorrect": false
          },
          {
            "text": "It is identical to high desire",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "Prevalence estimates depend heavily on definition; broad self-report measures capture moral incongruence and high desire, inflating estimates relative to strict impairment-based criteria.",
        "showExplanation": true
      },
      {
        "type": "multipleChoice",
        "question": "The \"triple-A\" features (accessibility, affordability, anonymity) of online sexual content are clinically relevant because they:",
        "options": [
          {
            "text": "Make technology inherently harmful for everyone",
            "isCorrect": false
          },
          {
            "text": "Can intensify difficulty with control for those vulnerable to compulsive patterns, without making ordinary use pathological",
            "isCorrect": true
          },
          {
            "text": "Prove pornography is addictive",
            "isCorrect": false
          },
          {
            "text": "Are irrelevant to treatment",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "The triple-A features can facilitate escalation for vulnerable individuals while most use remains unproblematic; the clinician addresses access patterns without moralizing technology itself.",
        "showExplanation": true
      },
      {
        "type": "multipleChoice",
        "question": "When a client trying to change has a lapse, the abstinence violation effect describes:",
        "options": [
          {
            "text": "Automatic full recovery",
            "isCorrect": false
          },
          {
            "text": "Intense shame and a sense of total failure that can paradoxically trigger further behavior, which relapse prevention reframes as a single event to learn from",
            "isCorrect": true
          },
          {
            "text": "A medication side effect",
            "isCorrect": false
          },
          {
            "text": "The partner’s reaction only",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "The abstinence violation effect is the shame-driven \"I’ve already failed\" spiral after a lapse; reframing the lapse as a learning event, met with self-compassion, prevents it from deepening.",
        "showExplanation": true
      },
      {
        "type": "multipleChoice",
        "question": "Contemporary, evidence-informed practice regards a partner affected by a client’s compulsive sexual behavior as:",
        "options": [
          {
            "text": "A \"co-addict\" responsible for the behavior",
            "isCorrect": false
          },
          {
            "text": "A person affected by another’s actions who deserves support and respect in their own right, not blamed for the client’s behavior",
            "isCorrect": true
          },
          {
            "text": "Irrelevant to treatment",
            "isCorrect": false
          },
          {
            "text": "Required to remain in the relationship",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "Contemporary practice rejects blaming the partner (e.g., \"co-addict\" frameworks) and supports the partner as someone affected by another’s actions, entitled to their own support and decisions.",
        "showExplanation": true
      },
      {
        "type": "multipleChoice",
        "question": "A consistent, accepting therapeutic relationship is especially important in treating compulsive sexual behavior because it:",
        "options": [
          {
            "text": "Increases the client’s shame",
            "isCorrect": false
          },
          {
            "text": "Counters the shame and isolation that drive the cycle and, for clients with avoidant patterns, provides a corrective experience of safe closeness",
            "isCorrect": true
          },
          {
            "text": "Replaces all other interventions",
            "isCorrect": false
          },
          {
            "text": "Is unnecessary if techniques are used",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "The non-judgmental relationship counters the shame-compulsivity cycle and, for clients with avoidant attachment, offers a corrective experience of safe closeness central to change.",
        "showExplanation": true
      },
      {
        "type": "multipleChoice",
        "question": "Self-compassion functions as an active clinical ingredient in treating compulsive sexual behavior because it:",
        "options": [
          {
            "text": "Excuses the behavior and reduces motivation",
            "isCorrect": false
          },
          {
            "text": "Counters the shame that drives the compulsivity cycle and prevents the post-lapse shame spiral, supporting sustained change",
            "isCorrect": true
          },
          {
            "text": "Replaces all other interventions",
            "isCorrect": false
          },
          {
            "text": "Is only relevant for partners",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "Self-compassion directly counters the shame that fuels the cycle and the post-lapse \"I’ve failed\" spiral; it supports, rather than undermines, values-driven change.",
        "showExplanation": true
      },
      {
        "type": "multipleChoice",
        "question": "A non-shaming therapeutic stance is clinically essential (not merely humane) in this area because:",
        "options": [
          {
            "text": "Shame is an effective motivator",
            "isCorrect": false
          },
          {
            "text": "Shame both drives and results from the behavior, so increasing it tends to intensify the cycle rather than break it",
            "isCorrect": true
          },
          {
            "text": "It speeds up assessment",
            "isCorrect": false
          },
          {
            "text": "It is required only in couples work",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "Shame fuels the compulsivity cycle; shaming or moralizing approaches tend to intensify the very behavior the client is trying to change, making a non-shaming stance clinically essential.",
        "showExplanation": true
      },
      {
        "type": "multipleChoice",
        "question": "An integrative treatment plan for compulsive sexual behavior is preferred because:",
        "options": [
          {
            "text": "One technique addresses every dimension",
            "isCorrect": false
          },
          {
            "text": "The behavior is multiply determined and serves multiple functions, so combining CBT, acceptance/mindfulness, motivational, relapse-prevention, and relational approaches — tailored to the individual — works best",
            "isCorrect": true
          },
          {
            "text": "It avoids assessment",
            "isCorrect": false
          },
          {
            "text": "It guarantees abstinence",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "Because compulsive sexual behavior is multiply determined, integrative, individualized treatment combining multiple evidence-informed approaches is generally most effective.",
        "showExplanation": true
      },
      {
        "type": "multipleChoice",
        "question": "ICD-11 classifies Compulsive Sexual Behaviour Disorder as:",
        "options": [
          {
            "text": "A substance addiction",
            "isCorrect": false
          },
          {
            "text": "An impulse-control disorder, deliberately avoiding the contested addiction framing",
            "isCorrect": true
          },
          {
            "text": "A paraphilic disorder",
            "isCorrect": false
          },
          {
            "text": "A marker of high sexual desire",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "ICD-11 recognizes CSBD as an impulse-control disorder — not an addiction, paraphilia, or marker of high desire — providing a category for genuine impairing loss of control while avoiding the contested addiction model.",
        "showExplanation": true
      },
      {
        "type": "multipleChoice",
        "question": "Across treatment approaches, the unifying clinical stance toward compulsive sexual behavior is:",
        "options": [
          {
            "text": "Moralizing and abstinence-enforcing",
            "isCorrect": false
          },
          {
            "text": "Non-judgmental, function-focused, evidence-informed, with collaborative goals and vigilance against pathologizing non-disordered sexuality",
            "isCorrect": true
          },
          {
            "text": "Confrontational",
            "isCorrect": false
          },
          {
            "text": "Focused only on the behavior’s frequency",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "The unifying stance is non-shaming, function-focused, and evidence-informed, with collaborative goals and careful guarding against pathologizing sexuality that is not actually disordered.",
        "showExplanation": true
      },
      {
        "type": "trueFalse",
        "question": "Per the ICD-11, distress arising entirely from moral or religious disapproval of one’s sexual behavior is, by itself, sufficient to diagnose CSBD.",
        "options": [
          {
            "text": "True",
            "isCorrect": false
          },
          {
            "text": "False",
            "isCorrect": true
          }
        ],
        "correctAnswer": 1,
        "explanation": "The ICD-11 specifies that moral incongruence alone does not warrant a CSBD diagnosis; the disorder requires genuine loss of control with distress or impairment."
      },
      {
        "type": "trueFalse",
        "question": "Reflexively imposing abstinence is the recommended default goal for every client with compulsive sexual behavior.",
        "options": [
          {
            "text": "True",
            "isCorrect": false
          },
          {
            "text": "False",
            "isCorrect": true
          }
        ],
        "correctAnswer": 1,
        "explanation": "Best practice sets collaborative, values-based goals; abstinence is not reflexively imposed, and harm-reduction or abstinence may be appropriate depending on the client."
      },
      {
        "type": "trueFalse",
        "question": "Compulsive sexual behavior frequently functions as a form of emotion regulation, which is why building alternative coping is central to treatment.",
        "options": [
          {
            "text": "True",
            "isCorrect": true
          },
          {
            "text": "False",
            "isCorrect": false
          }
        ],
        "correctAnswer": 0,
        "explanation": "CSB frequently serves to regulate difficult emotional states; functional analysis identifies this so that alternative coping can be developed."
      },
      {
        "type": "multiSelect",
        "question": "Which are accurate about partners affected by CSBD disclosure? (Select all that apply)",
        "options": [
          {
            "text": "Their reaction can resemble betrayal trauma in its impact",
            "isCorrect": true
          },
          {
            "text": "They deserve support in their own right",
            "isCorrect": true
          },
          {
            "text": "They should be framed as “co-addicts” responsible for the behavior",
            "isCorrect": false
          },
          {
            "text": "Disclosure carries clinical considerations around timing and process",
            "isCorrect": true
          }
        ],
        "explanation": "Partner reactions can resemble betrayal trauma and warrant support in their own right; framing partners as “co-addicts” is inappropriate, and disclosure requires careful clinical handling."
      },
      {
        "type": "multiSelect",
        "question": "Which are appropriate elements of a non-shaming, function-focused approach to CSBD? (Select all that apply)",
        "options": [
          {
            "text": "Understanding the behavior’s function rather than only condemning it",
            "isCorrect": true
          },
          {
            "text": "Distinguishing CSBD from normative or minority sexuality",
            "isCorrect": true
          },
          {
            "text": "Collaborative, values-based goal-setting",
            "isCorrect": true
          },
          {
            "text": "Using shame as a motivator for change",
            "isCorrect": false
          }
        ],
        "explanation": "A non-shaming, function-focused approach understands the behavior’s function, avoids pathologizing normal sexuality, and sets collaborative goals — shame is counterproductive, not a tool."
      }
    ]
  },
  "references": [
    {
      "title": "AASECT position on sex addiction. https://www.aasect.org",
      "author": "American Association of Sexuality Educators, Counselors and Therapists",
      "year": 2016,
      "source": "6). AASECT position on sex addiction. https://www.aasect.org"
    },
    {
      "title": "Sexual addiction, sexual compulsivity, sexual impulsivity, or what? Journal of Sex Research, 41(3), 225–234.",
      "author": "Bancroft, J",
      "year": 2004,
      "source": "pulsivity, or what? Journal of Sex Research, 41(3), 225–234."
    },
    {
      "title": "Out of the shadows: Understanding sexual addiction. CompCare Publications.",
      "author": "Carnes, P",
      "year": 1983,
      "source": "dows: Understanding sexual addiction. CompCare Publications."
    },
    {
      "title": "Is your patient suffering from compulsive sexual behavior? Psychiatric Annals, 22(6), 320–325.",
      "author": "Coleman, E",
      "year": 1992,
      "source": "pulsive sexual behavior? Psychiatric Annals, 22(6), 320–325."
    },
    {
      "title": "What's in a name? Terminology for designating a syndrome of driven sexual behavior. Sexual Addiction & Compulsivity, 8(",
      "author": "Goodman, A",
      "year": 2001,
      "source": "behavior. Sexual Addiction & Compulsivity, 8(3–4), 191–213."
    },
    {
      "title": "Hypersexual disorder: A proposed diagnosis for DSM-5. Archives of Sexual Behavior, 39(2), 377–400.",
      "author": "Kafka, M",
      "year": 2010,
      "source": "osis for DSM-5. Archives of Sexual Behavior, 39(2), 377–400."
    },
    {
      "title": "Hypersexuality and recidivism among sexual offenders. Sexual Addiction & Compulsivity, 20(1–2), 91–105.",
      "author": "Kingston, D",
      "year": 2013,
      "source": "offenders. Sexual Addiction & Compulsivity, 20(1–2), 91–105."
    },
    {
      "title": "Should compulsive sexual behavior be considered an addiction? Addiction, 111(12), 2097–2106.",
      "author": "Kraus, S",
      "year": 2016,
      "source": "r be considered an addiction? Addiction, 111(12), 2097–2106."
    },
    {
      "title": "Impulsive-compulsive sexual behavior. CNS Spectrums, 11(12), 944–955.",
      "author": "Mick, T",
      "year": 2006,
      "source": "-compulsive sexual behavior. CNS Spectrums, 11(12), 944–955."
    },
    {
      "title": "Data do not support sex as addictive. Lancet Psychiatry, 4(12), 899.",
      "author": "Prause, N",
      "year": 2017,
      "source": "not support sex as addictive. Lancet Psychiatry, 4(12), 899."
    },
    {
      "title": "Reliability, validity, and psychometric development of the Hypersexual Behavior Inventory in an outpatient sample of me",
      "author": "Reid, R",
      "year": 2011,
      "source": "ample of men. Sexual Addiction & Compulsivity, 18(1), 30–51."
    },
    {
      "title": "Current status and future directions in couple therapy. Annual Review of Psychology, 57, 317–344.",
      "author": "Snyder, D",
      "year": 2006,
      "source": "in couple therapy. Annual Review of Psychology, 57, 317–344."
    },
    {
      "title": "The traumatic nature of disclosure for wives of sexual addicts. Sexual Addiction & Compulsivity, 13(2–3), 247–267.",
      "author": "Steffens, B",
      "year": 2006,
      "source": "addicts. Sexual Addiction & Compulsivity, 13(2–3), 247–267."
    },
    {
      "title": "Hypersexuality: A critical review and introduction to the 'Sexhavior Cycle.' Archives of Sexual Behavior, 46(8), 2231–2",
      "author": "Walton, M",
      "year": 2017,
      "source": "avior Cycle.' Archives of Sexual Behavior, 46(8), 2231–2251."
    },
    {
      "title": "International classification of diseases (11th revision). https://icd.who.int",
      "author": "World Health Organization",
      "year": 2019,
      "source": "ssification of diseases (11th revision). https://icd.who.int"
    },
    {
      "title": "Hypersexual disorder: A more cautious approach. Archives of Sexual Behavior, 39(3), 594–596.",
      "author": "Winters, J",
      "year": 2010,
      "source": "tious approach. Archives of Sexual Behavior, 39(3), 594–596."
    }
  ],
  "sections": [
    {
      "title": "Module 1: Compulsive Sexual Behavior — Diagnosis, Neurobiology, and Assessment",
      "order": 1,
      "estimatedTime": 20,
      "contentBlocks": [
        {
          "type": "sectionDivider",
          "sectionNumber": 1,
          "title": "Module 1",
          "subtitle": "Module 1: Compulsive Sexual Behavior — Diagnosis, Neurobiology, and Assessment",
          "order": 0
        },
        {
          "type": "text",
          "content": "<h2>Defining Compulsive Sexual Behavior: ICD-11, Controversies, and Biopsychosocial Etiology</h2>\n<h3>The Contested Diagnostic Landscape</h3>\n<p>Compulsive sexual behavior — characterized by persistent, distressing preoccupation with sexual thoughts, urges, and behaviors that the individual experiences as difficult or impossible to control — occupies a contested conceptual and diagnostic space in contemporary clinical practice, reflecting genuine scientific uncertainty about its nature, etiology, and optimal treatment. The most widely used lay term — sexual addiction — imports the addiction framework of substance use disorders into the sexual behavior domain, implying the same neurobiological mechanisms, the same progressive tolerance and withdrawal phenomena, and the same disease model that organizes substance use disorder treatment.</p>\n<p>This framework has been influential in treatment communities and has shaped public understanding of the condition, but it has not been validated by the empirical research base in ways that would justify its formal adoption as a clinical diagnosis. The DSM-5 did not include sexual addiction or hypersexual disorder as a diagnostic category — despite Kafka's (2010) proposal for the latter — citing insufficient empirical evidence. The ICD-11's classification of Compulsive Sexual Behavior Disorder (CSBD) as an impulse control disorder — not as an addictive disorder — reflects a more cautious, evidence-informed approach to the classification of this clinical phenomenon.</p>\n<h3>ICD-11 Diagnostic Criteria</h3>\n<p>ICD-11 Compulsive Sexual Behavior Disorder (F63.8) is defined by:</p>\n<ul>\n<li>A persistent pattern of failure to control intense, repetitive sexual impulses or urges</li>\n<li>Repetitive sexual behavior that becomes a central focus of the person's life to the point of neglecting health and personal care or other interests, activities, and responsibilities</li>\n<li>Continued repetitive sexual behavior despite adverse consequences or deriving little or no satisfaction from it</li>\n<li>Marked distress or significant impairment in personal, family, social, educational, occupational, or other important areas of functioning</li>\n</ul>\n<p>The ICD-11 criteria require that these features persist over an extended period — at least six months — and that they not be better explained by another mental disorder, the physiological effects of a substance or medication, or another medical condition. AASECT's official position statement — explicitly stating that there is insufficient empirical evidence to support sexual addiction or compulsive sexual behavior as a clinical diagnosis — reflects a competing perspective within the clinical field that clinicians should be aware of as they navigate this contested diagnostic terrain.</p>\n<h3>Distinguishing CSBD from Normative High Sexual Desire</h3>\n<p>The distinction between compulsive sexual behavior disorder and normative high sexual desire is a clinically essential assessment distinction that has direct implications for clinical formulation and treatment planning. Not all frequent sexual behavior, high sexual desire, or sexual behavior that others consider excessive constitutes CSBD.</p>\n<p>The diagnostic criteria require both the persistence of experienced loss of control over sexual urges and marked distress or functional impairment — meaning that a person with high sexual desire who engages in frequent sexual activity without subjective loss of control and without significant distress or functional impairment does not meet criteria for CSBD, regardless of the frequency or cultural unconventionality of their behavior. Conversely, a person who experiences intense distress about sexual urges and significant functional impairment from compulsive sexual behavior — even at levels of sexual activity that others might consider normative — may meet criteria. The clinical assessment must attend to subjective experience and functional impact rather than applying frequency or moral norms as diagnostic criteria.</p>\n<h3>CSBD and Paraphilic Disorders</h3>\n<p>The relationship between compulsive sexual behavior and paraphilic disorders requires specific clinical attention to avoid both the conflation and the erroneous separation of these distinct clinical phenomena. Paraphilic disorders — defined in DSM-5 as intense and persistent sexual interests in atypical objects, situations, or individuals that cause distress or functional impairment or that are acted upon with non-consenting individuals — are distinct from CSBD in their diagnostic basis: paraphilic disorders are defined by the specific content of sexual interests, while CSBD is defined by the behavioral pattern of compulsive engagement with sexual activity regardless of its specific content.</p>\n<p>These conditions can co-occur — a person can have both a paraphilic disorder and CSBD — or either can occur independently. Clinical assessment should address both the pattern of sexual behavior and the specific content of sexual interests, using the resulting information to guide formulation and treatment planning for each dimension of the presentation independently.</p>",
          "order": 1
        },
        {
          "type": "text",
          "content": "<h2>Neurobiology, Psychological Factors, and Comprehensive Assessment</h2>\n<h3>Neurobiological Underpinnings</h3>\n<p>The neurobiological underpinnings of compulsive sexual behavior are an active area of research that has produced some findings suggesting parallels with substance use disorder neurobiology while also identifying important disanalogies that complicate the addiction framework. Neuroimaging studies have documented that exposure to sexual stimuli activates reward circuitry — including the ventral striatum and prefrontal cortex — in ways that share structural similarity with substance cue reactivity in addiction.</p>\n<p>Voon and colleagues' (2014) neuroimaging research found that individuals with CSBD showed increased activation in the amygdala, ventral striatum, and dorsal anterior cingulate in response to sexual cue exposure compared to controls — patterns similar to those seen in substance use disorders. However, other research has challenged the addiction model interpretation of these findings, noting that enhanced cue reactivity does not in itself validate addiction, that the behavioral escalation and tolerance phenomena central to the addiction model are not consistently documented in CSBD, and that subjective 'craving' in CSBD may not parallelize substance craving in the ways the addiction model requires.</p>\n<h3>Psychological and Developmental Factors</h3>\n<p>Psychological and developmental factors in the etiology of compulsive sexual behavior include:</p>\n<ul>\n<li>Attachment disruptions</li>\n<li>Early sexual trauma</li>\n<li>Shame-based sexual development</li>\n<li>The psychological functions that compulsive sexual behavior serves — including emotional regulation, dissociation from distressing affect, and the search for intimacy in substitute sexual encounters that cannot satisfy the underlying relational need</li>\n</ul>\n<p>The relationship between attachment insecurity — particularly dismissive-avoidant and anxious-preoccupied attachment patterns — and compulsive sexual behavior is clinically significant: individuals who have learned through early relational experiences that emotional intimacy is unsafe may develop sexual behavior as a substitute form of connection that provides physical closeness while avoiding the vulnerability of genuine emotional intimacy. This intimacy avoidance pattern — the chronic compromise of emotional closeness through the substitution of sexual activity, pornography use, or other sexually-mediated intimacy substitutes — is both a contributing etiological factor in many CSBD presentations and a treatment target that must be addressed for genuine recovery to occur.</p>\n<h3>Cultural and Sociocultural Context</h3>\n<p>The cultural and sociocultural context of compulsive sexual behavior deserves specific clinical attention because cultural factors significantly shape both the phenomenology of the behavior and the distress associated with it. Research by Prause, Janssen, and colleagues suggests that the subjective distress experienced in relation to sexual behavior is significantly predicted by religiosity and moral disapproval of the behavior — meaning that some portion of the distress attributed to 'compulsive' sexual behavior may more accurately reflect moral or religious incongruence between the behavior and the person's values rather than clinically meaningful compulsivity.</p>\n<p>This finding has direct clinical implications: clinicians must carefully distinguish between genuine compulsive sexual behavior — characterized by persistent subjective loss of control and functional impairment independent of moral evaluation — and moral distress about sexual behavior that is incongruent with the person's religious or moral values, which requires a different clinical response that includes attention to values clarification rather than behavioral disorder treatment.</p>\n<h3>Comprehensive Assessment</h3>\n<p>Assessment of compulsive sexual behavior requires a comprehensive, multi-modal approach that combines clinical interview with validated self-report instruments and attends to the full range of biopsychosocial factors contributing to the presentation. Validated instruments include:</p>\n<ul>\n<li>The <strong>Sexual Compulsivity Scale (SCS)</strong>, a 10-item self-report measure of sexual compulsivity</li>\n<li>The <strong>Hypersexual Behavior Inventory (HBI)</strong>, a 19-item measure developed specifically for hypersexual behavior in men</li>\n<li>The <strong>Compulsive Sexual Behavior Inventory (CSBI)</strong>, a 28-item measure assessing control over sexual behavior, abuse, and violence</li>\n</ul>\n<p>These instruments provide standardized, quantitative data that complement clinical interview findings and support treatment monitoring. Clinical interview should assess:</p>\n<ul>\n<li>The specific behaviors involved, their frequency and duration</li>\n<li>The degree of subjective loss of control</li>\n<li>The presence of craving, tolerance, and withdrawal-like phenomena</li>\n<li>Functional impact across occupational, relational, and health domains</li>\n<li>Comorbid conditions including depression, anxiety, substance use, and trauma</li>\n<li>Sexual development history including early sexual experiences and exposure to pornography</li>\n<li>Attachment history and current relational patterns</li>\n<li>Religious, cultural, and moral context for the behavior</li>\n</ul>",
          "order": 2
        },
        {
          "type": "text",
          "content": "<blockquote class=\"cr-vignette\"><strong>Clinical Vignette</strong><br>Robert, 38, presents at the request of his wife following her discovery of extensive pornography use and contact with escorts over six years. He acknowledges escalating frequency, work impairment, and intense shame alongside ongoing urges feeling 'outside my control.' Assessment: ICD-11 CSBD criteria evaluation; HBI administration; functional behavior assessment; comorbidity screening (depression, anxiety, attachment history); partner trauma assessment. Plan: individual CBT/ACT-based therapy; partner trauma support; staged couples work when both stabilized; ICD-11 CSBD framing rather than 'sex addiction'; values clarification as motivation foundation.</blockquote>",
          "order": 3
        },
        {
          "type": "reflection",
          "prompt": "After reviewing this module 1: compulsive sexual behavior — diagnosis, neurobiology, and assessment, what aspect of your current clinical practice most needs updating or strengthening?",
          "placeholder": "Take a moment to reflect on how this applies to your clinical practice...",
          "order": 4
        },
        {
          "type": "multipleChoice",
          "question": "ICD-11 classifies compulsive sexual behavior disorder as:",
          "options": [
            {
              "text": "An addictive disorder analogous to gambling disorder",
              "isCorrect": false
            },
            {
              "text": "A sexual dysfunction",
              "isCorrect": false
            },
            {
              "text": "An impulse control disorder",
              "isCorrect": true
            },
            {
              "text": "A paraphilic disorder",
              "isCorrect": false
            }
          ],
          "correctAnswer": 2,
          "explanation": "ICD-11 classifies CSBD as an impulse control disorder (F63.8) — not as an addictive disorder — reflecting a more cautious approach than the 'sexual addiction' framework that lacks DSM-5/ICD-11 validation.",
          "showExplanation": true,
          "order": 5
        },
        {
          "order": 6,
          "type": "multiSelect",
          "question": "Which features distinguish CSBD from normative high sexual desire? (Select all that apply)",
          "options": [
            {
              "text": "A persistent failure to control the behavior despite efforts",
              "isCorrect": true
            },
            {
              "text": "Marked distress or functional impairment",
              "isCorrect": true
            },
            {
              "text": "Simply having a high frequency of consensual sexual activity",
              "isCorrect": false
            },
            {
              "text": "Continued behavior despite adverse consequences",
              "isCorrect": true
            },
            {
              "text": "The behavior becoming a central focus that crowds out other interests",
              "isCorrect": true
            }
          ],
          "explanation": "CSBD is defined by loss of control, distress/impairment, and persistence despite consequences — not by high desire or frequency alone, which is not itself disordered."
        },
        {
          "type": "multipleChoice",
          "question": "The sexual double bind in CSBD describes:",
          "options": [
            {
              "text": "Situations where both partners experience compulsive sexual behavior simultaneously",
              "isCorrect": false
            },
            {
              "text": "The dynamic where both the sexual urge and the shame about it powerfully maintain the compulsive cycle",
              "isCorrect": true
            },
            {
              "text": "Treatment paradoxes involving simultaneous abstinence and exposure",
              "isCorrect": false
            },
            {
              "text": "Legal and ethical conflicts in mandatory reporting",
              "isCorrect": false
            }
          ],
          "correctAnswer": 1,
          "explanation": "The sexual double bind — in which shame about sexual urges paradoxically maintains them — requires clinical approaches that hold both compassionate understanding of the mechanisms driving behavior and values-based accountability.",
          "showExplanation": true,
          "order": 7
        },
        {
          "type": "text",
          "content": "<h2>The Diagnostic Debate: Naming the Problem</h2>\n<p>Few areas of clinical practice are as conceptually contested as compulsive sexual behavior, and a clinician working in this area must understand the debate, because how the problem is framed shapes assessment, treatment, and the stance taken toward the client.</p>\n<h3>Competing Models</h3>\n<p>Several frameworks have been used to describe distressing, out-of-control sexual behavior: a sexual \"addiction\" model drawing analogy to substance addiction; a hypersexuality or sexual-desire-dysregulation model; an impulse-control model; and an obsessive-compulsive-spectrum model. Each carries different assumptions about cause, and each implies different treatment. The \"addiction\" framing in particular is popular in the public and in some treatment programs but is scientifically contested, as the evidence that this behavior functions like a substance addiction at the neurobiological level is mixed and incomplete.</p>\n<h3>Why DSM-5 Declined and ICD-11 Acted</h3>\n<p>The DSM-5 considered but ultimately did not include hypersexual disorder, citing insufficient evidence and concern about pathologizing normal sexual variation. The ICD-11 subsequently included {{callout:csbd}} Disorder (CSBD), but deliberately classified it as an impulse-control disorder rather than as an addiction or a paraphilia, reflecting a cautious, evidence-based stance. This history matters clinically: it counsels humility about etiology, caution about the \"addiction\" language, and great care not to pathologize sexual behavior that is simply frequent, unconventional, or in conflict with the client's or society's values.</p>",
          "order": 8,
          "callouts": {
            "csbd": {
              "label": "CSBD",
              "type": "reference",
              "body": "Compulsive Sexual Behaviour Disorder (ICD-11) — a persistent pattern of failure to control intense, repetitive sexual impulses causing marked distress or impairment; classified as an impulse-control disorder."
            }
          }
        },
        {
          "type": "text",
          "content": "<h2>ICD-11 Compulsive Sexual Behaviour Disorder in Depth</h2>\n<p>The ICD-11 criteria for CSBD provide the most authoritative current definition, and understanding them precisely is essential for accurate diagnosis and for avoiding overdiagnosis.</p>\n<h3>The Core Features</h3>\n<p>CSBD is characterized by a persistent pattern of failure to control intense, repetitive sexual impulses or urges, resulting in repetitive sexual behavior over an extended period (generally six months or more), with several hallmark features: the behavior becomes a central focus of the person's life to the neglect of health, self-care, and other interests and responsibilities; the person makes numerous unsuccessful efforts to control or reduce the behavior; the person continues despite adverse consequences or deriving little satisfaction from it; and the pattern causes marked distress or significant impairment in important areas of functioning.</p>\n<h3>The Crucial Exclusion</h3>\n<p>The ICD-11 includes a critical clarification: distress that is entirely related to moral judgments and disapproval about sexual impulses, urges, or behaviors is not sufficient to meet the diagnosis. In other words, a person who is distressed about their sexual behavior solely because it conflicts with their personal, religious, or cultural values — but whose behavior is not genuinely out of control by the other criteria — does not have CSBD. This exclusion is one of the most clinically important features of the diagnosis, and it directly shapes assessment.</p>",
          "order": 9
        },
        {
          "type": "text",
          "content": "<h2>Moral Incongruence: The Central Clinical Distinction</h2>\n<p>Research over the past decade has established that a large proportion of people who self-identify as having a sexual behavior \"problem\" — particularly around pornography use — are experiencing what is termed {{callout:moral-incongruence}}: distress arising from the conflict between their behavior and their moral or religious values, rather than from genuine loss of control.</p>\n<h3>Why This Matters Enormously</h3>\n<p>Studies have found that self-perceived problematic sexual behavior, especially problematic pornography use, is frequently predicted more strongly by religiosity and moral disapproval than by the actual frequency or quantity of the behavior. A person may use pornography at a level that causes no objective impairment, yet experience intense distress and self-condemnation because the behavior violates deeply held beliefs. This is a fundamentally different clinical situation from genuine compulsivity, and treating it as an \"addiction\" can deepen shame, reinforce a sense of being diseased, and miss the actual source of suffering.</p>\n<h3>The Clinical Implication</h3>\n<p>The clinician must carefully distinguish genuine compulsivity (behavior that is truly out of control, persists despite serious consequences, and impairs functioning) from moral incongruence (distress driven primarily by value conflict). The two call for different approaches: genuine compulsivity may warrant the evidence-based treatments for CSBD, while moral incongruence is better addressed by helping the client explore and reconcile the conflict between their behavior and their values, reduce shame, and arrive at a resolution that is genuinely their own — which may involve changing the behavior, revising the belief, or finding an integration, as the client determines.</p>",
          "order": 10,
          "callouts": {
            "moral-incongruence": {
              "label": "Moral Incongruence",
              "type": "definition",
              "body": "Distress about one’s sexual behavior arising from conflict with personal moral or religious values; the ICD-11 specifies this alone does not warrant a CSBD diagnosis."
            }
          }
        },
        {
          "type": "text",
          "content": "<h2>Distinguishing CSBD from Normative High Sexual Desire</h2>\n<p>One of the gravest errors in this clinical area is pathologizing high sexual desire or frequent consensual sexual behavior that is not actually disordered, and guarding against it is a core competency.</p>\n<h3>High Desire Is Not a Disorder</h3>\n<p>People vary enormously in sexual desire and activity, and a high level of sexual interest or frequent sexual behavior is, by itself, simply a point on the normal spectrum of human sexuality — not a disorder. The defining features of CSBD are loss of control, the central and life-dominating role of the behavior, continuation despite serious adverse consequences, and marked distress or impairment — not frequency as such. A person with a high libido who enjoys an active, consensual sexual life and experiences no loss of control or impairment does not have a disorder, regardless of how their frequency compares to others.</p>\n<h3>The Risk of Overdiagnosis</h3>\n<p>The history of this field includes the pathologizing of sexual behavior that was merely frequent, unconventional, or socially disapproved, and the contemporary clinician remains vigilant against repeating that error. Cultural and personal discomfort with a client's sexuality must never become the basis for a diagnosis. The clinician applies the criteria rigorously, attends to whether the behavior is genuinely out of control rather than merely frequent or disapproved, and respects the wide range of healthy sexual expression.</p>",
          "order": 11
        },
        {
          "type": "text",
          "content": "<h2>Differential Diagnosis</h2>\n<p>Compulsive sexual behavior can resemble, co-occur with, or be better explained by other conditions, and careful differential diagnosis is essential to accurate formulation and treatment.</p>\n<h3>Conditions to Consider</h3>\n<p>Several conditions warrant consideration. <strong>Bipolar disorder</strong>: increased sexual behavior can be a feature of manic or hypomanic episodes, and behavior occurring only during mood episodes is better explained by the mood disorder. <strong>Substance use</strong>: sexual behavior driven by or occurring under the influence of substances, including in the context of chemsex, may reflect the substance use. <strong>Obsessive-compulsive disorder</strong>: intrusive sexual thoughts in OCD are ego-dystonic and not pleasurable, differing from the urges of CSBD. <strong>Paraphilic disorders</strong>: these involve atypical sexual interests and are a distinct category from CSBD, though they can co-occur. <strong>ADHD and other impulse-control problems</strong>, as well as the effects of certain medications (such as dopaminergic agents), can also contribute to disinhibited sexual behavior.</p>\n<h3>Co-Occurrence and Formulation</h3>\n<p>These conditions frequently co-occur with compulsive sexual behavior rather than simply ruling it in or out, and assessment determines what is driving the behavior and what conditions require treatment in their own right. A thorough differential prevents both the misattribution of mood- or substance-driven behavior to CSBD and the neglect of co-occurring conditions that must be addressed for treatment to succeed.</p>",
          "order": 12
        },
        {
          "order": 13,
          "type": "fillInBlank",
          "title": "Quick check — the central distinction",
          "blanks": [
            {
              "prompt": "Distress arising entirely from conflict with one’s moral or religious values is called:",
              "answer": "moral incongruence",
              "acceptAlternates": [
                "moral-incongruence"
              ]
            },
            {
              "prompt": "Per the ICD-11, moral incongruence alone is ___ sufficient to diagnose CSBD:",
              "answer": "not",
              "acceptAlternates": [
                "insufficient"
              ]
            }
          ]
        },
        {
          "type": "text",
          "content": "<h2>Neurobiological Considerations</h2>\n<p>Research has examined the neurobiology of compulsive sexual behavior, and the clinician benefits from understanding both what the evidence suggests and its limits.</p>\n<h3>What the Research Suggests</h3>\n<p>Studies have explored the role of brain reward systems, dopaminergic signaling, and circuits involved in impulse control and habit, with some findings paralleling those seen in addictive and impulse-control disorders. These lines of research inform the impulse-control framing of CSBD and suggest that, for some individuals with genuine compulsivity, dysregulation of reward and inhibitory systems may contribute to the difficulty controlling behavior.</p>\n<h3>Interpreting the Evidence Cautiously</h3>\n<p>At the same time, the neurobiological evidence is incomplete and contested, and it does not definitively establish that compulsive sexual behavior is neurobiologically equivalent to substance addiction. The clinician holds this knowledge with appropriate humility: neurobiological factors may contribute, particularly in genuine compulsivity, but they neither fully explain the behavior nor justify a reductive \"brain disease\" framing that can deepen shame or imply the behavior is beyond the client's capacity to change. A biopsychosocial formulation that integrates neurobiological, psychological, and social factors remains the most accurate and clinically useful framework.</p>",
          "order": 14
        },
        {
          "type": "text",
          "content": "<h2>Psychological, Developmental, and Trauma Factors</h2>\n<p>Compulsive sexual behavior frequently functions within a larger psychological context, and understanding the factors that drive and maintain it is essential to effective treatment.</p>\n<h3>Emotion Regulation and Coping</h3>\n<p>For many people, sexual behavior serves as a way of coping with difficult internal states — anxiety, depression, loneliness, boredom, shame, or the aftermath of trauma. The behavior provides temporary relief, escape, or soothing, which negatively reinforces it, and over time it can become a primary and increasingly automatic coping strategy. Understanding the function the behavior serves — what it does for the person, what states it manages — is frequently more clinically useful than focusing on the behavior in isolation.</p>\n<h3>Developmental and Trauma History</h3>\n<p>Histories of childhood trauma, including sexual abuse, neglect, and disrupted attachment, are common among people with compulsive sexual behavior, and the behavior may be linked to trauma in multiple ways — as a means of regulating trauma-related states, as a reenactment, or as a learned pattern. Early experiences also shape the beliefs about self, intimacy, and worth that underlie the behavior. A trauma-informed approach is therefore frequently essential, and unaddressed trauma is a common reason treatment focused only on behavior change fails.</p>",
          "order": 15
        },
        {
          "type": "text",
          "content": "<h2>Attachment and Intimacy in the Etiology</h2>\n<p>Attachment patterns formed in early relationships profoundly shape adult sexuality and intimacy, and they are central to understanding both compulsive sexual behavior and the intimacy disorders with which it frequently intertwines.</p>\n<h3>The Attachment Lens</h3>\n<p>Insecure attachment — particularly avoidant and disorganized patterns — is associated with difficulties in emotional intimacy, and for some individuals compulsive sexual behavior functions partly as a substitute for, or a defense against, genuine intimacy. Sexual behavior can provide connection or arousal without the vulnerability of emotional closeness, which can feel threatening to those with avoidant attachment histories. Understanding a client's attachment patterns illuminates why the behavior may serve to avoid intimacy even as it appears to seek connection.</p>\n<h3>Implications for Treatment</h3>\n<p>This attachment framing connects compulsive sexual behavior to the intimacy disorders addressed later in this course, and it implies that effective treatment frequently must address not only the behavior but the underlying capacity for emotional intimacy and the attachment-related fears and patterns that drive avoidance of it. For many clients, building the capacity for genuine intimacy is as central to recovery as reducing the problematic behavior.</p>",
          "order": 16
        },
        {
          "type": "text",
          "content": "<h2>Cultural, Religious, and Sociocultural Context</h2>\n<p>Cultural and religious context shapes both the experience of sexual behavior and its appraisal as problematic, and attending to this context is essential to accurate, non-judgmental assessment.</p>\n<h3>Context Shapes What Is \"Problematic\"</h3>\n<p>What is considered acceptable or problematic sexual behavior varies across cultures and religious traditions, and a client's appraisal of their own behavior is heavily shaped by these frameworks. As the research on moral incongruence demonstrates, religiosity and cultural disapproval strongly influence whether a person perceives their behavior as a problem, frequently more than the behavior's objective characteristics. The clinician must therefore understand the client's cultural and religious context to distinguish genuine compulsivity from value conflict and to avoid imposing either the clinician's own values or a pathologizing framework.</p>\n<h3>Working Respectfully With Values</h3>\n<p>Cultural humility here means neither dismissing the client's values nor enforcing them, but helping the client navigate their own framework. For a client whose distress is rooted in value conflict, the clinician supports exploration and self-determined resolution; for a client with genuine compulsivity, the clinician provides appropriate treatment while remaining respectful of the cultural and religious context that gives the behavior its meaning. Throughout, the clinician brackets personal values so they do not distort the work.</p>",
          "order": 17
        },
        {
          "type": "text",
          "content": "<h2>Comprehensive Assessment and Instruments</h2>\n<p>Assessment of compulsive sexual behavior is a careful, multidimensional process that distinguishes genuine compulsivity from moral incongruence and normative behavior, identifies contributing and co-occurring factors, and informs treatment.</p>\n<h3>The Assessment Process</h3>\n<p>Comprehensive assessment characterizes the behavior (its nature, frequency, contexts, and triggers), evaluates the hallmark features of genuine compulsivity (loss of control, life-dominating centrality, continuation despite consequences, distress and impairment), and explicitly assesses whether distress is driven by genuine loss of control or by moral incongruence. It surveys the biopsychosocial contributors — emotional and trauma history, attachment and intimacy, co-occurring conditions, relational context, and cultural and religious framework — and it assesses the consequences of the behavior across domains of the person's life. Safety considerations, including any behavior involving non-consent or legal risk, are evaluated.</p>\n<h3>Validated Instruments</h3>\n<p>Several validated instruments can supplement the clinical interview, including measures of compulsive sexual behavior and sexual compulsivity that help quantify the concern, structure assessment, and track change. As with all instruments, these supplement rather than replace clinical judgment, must be interpreted in light of the moral-incongruence distinction (since high scores may reflect distress driven by value conflict rather than genuine compulsivity), and should be used in a culturally responsive way. Used thoughtfully, they add rigor to an assessment that must remain nuanced and individualized.</p>",
          "order": 18
        },
        {
          "order": 19,
          "type": "cardSort",
          "instructions": "Sort each scenario by whether a CSBD diagnosis may apply or caution is warranted.",
          "categories": [
            "CSBD may apply",
            "Caution — likely not CSBD"
          ],
          "cards": [
            {
              "id": "a",
              "text": "Loss of control and impairment, distress not driven only by moral conflict",
              "correctCategory": "CSBD may apply"
            },
            {
              "id": "b",
              "text": "Distress arising entirely from religious guilt about normative behavior",
              "correctCategory": "Caution — likely not CSBD"
            },
            {
              "id": "c",
              "text": "High consensual sexual frequency with no distress or impairment",
              "correctCategory": "Caution — likely not CSBD"
            },
            {
              "id": "d",
              "text": "Repeated failure to control behavior despite serious adverse consequences",
              "correctCategory": "CSBD may apply"
            },
            {
              "id": "e",
              "text": "A sexual-minority client distressed mainly by internalized stigma",
              "correctCategory": "Caution — likely not CSBD"
            }
          ],
          "explanation": "CSBD requires genuine loss of control with distress/impairment not reducible to moral incongruence or stigma; high frequency without distress, or distress driven only by moral conflict or internalized stigma, calls for caution."
        },
        {
          "type": "reflection",
          "prompt": "How will you distinguish genuine compulsivity from moral incongruence in your own assessment process, and what questions would help you tell them apart?",
          "placeholder": "Reflect on your clinical practice...",
          "order": 31
        },
        {
          "type": "text",
          "content": "<h2>Prevalence, Course, and Who Seeks Help</h2>\n<p>Compulsive sexual behavior occurs across genders, orientations, and cultures, though estimates of its prevalence vary widely depending on how it is defined — a direct consequence of the diagnostic debates discussed earlier. Stricter, impairment-based definitions yield lower estimates than broad self-report measures that may capture moral incongruence and high desire.</p>\n<h3>Patterns in Help-Seeking</h3>\n<p>Those who present for help are not a representative sample of those who might meet criteria. Help-seeking is shaped by shame, by relationship crises (discovery by a partner is a frequent precipitant), by moral and religious frameworks that lead some to label their behavior as addiction, and by the consequences the behavior has produced. Men present more frequently than women, which may reflect both genuine differences and the gendered ways sexuality is judged and labeled. The clinician keeps these patterns in mind, recognizing that the path to treatment shapes how a concern is presented and understood.</p>\n<h3>Course</h3>\n<p>The course of compulsive sexual behavior is variable. For some it is chronic and entrenched; for others it waxes and wanes with life stress, mood, and circumstance; and for many it improves substantially with treatment that addresses the underlying functions and co-occurring conditions. A single lapse does not mean treatment has failed, and improvement is frequently non-linear.</p>",
          "order": 21
        },
        {
          "type": "text",
          "content": "<h2>Screening: When and How to Assess</h2>\n<p>Because compulsive sexual behavior is frequently hidden behind shame and behind other presenting concerns, clinicians benefit from a thoughtful approach to when and how to screen.</p>\n<h3>When to Consider It</h3>\n<p>Indicators that warrant gentle exploration include a client's own concern about loss of control over sexual behavior, relationship crises involving sexual behavior, co-occurring conditions frequently associated with the pattern, and the use of sexual behavior to manage distress. The clinician raises the topic non-judgmentally and follows the client's lead, recognizing that shame makes spontaneous disclosure unlikely and that a calm, accepting inquiry is what makes honest discussion possible.</p>\n<h3>Screening Without Overpathologizing</h3>\n<p>Screening in this area carries a specific risk: framing ordinary or value-discordant sexual behavior as a potential disorder can itself induce shame and a false self-understanding. The clinician therefore screens in a way that assesses for genuine loss of control and impairment without implying that frequent or value-discordant sexual behavior is inherently pathological. The same careful distinction that governs diagnosis — genuine compulsivity versus high desire versus moral incongruence — governs screening.</p>",
          "order": 22
        },
        {
          "type": "text",
          "content": "<h2>A Function-Focused Formulation: A Worked Example</h2>\n<p>Consider a client who presents, after a partner's discovery, distressed about compulsive use of online sexual content that has begun to interfere with work and with his relationship. A function-focused biopsychosocial formulation organizes the assessment and treatment.</p>\n<h3>Building the Formulation</h3>\n<p>Assessment reveals genuine loss of control (repeated failed efforts to cut down, use continuing despite clear adverse consequences) and real impairment — distinguishing this from moral incongruence. The behavior is found to function primarily as a way of managing chronic anxiety and a deep discomfort with emotional intimacy rooted in an avoidant attachment history; co-occurring depressive symptoms amplify the pattern, and shame about the behavior feeds a self-perpetuating cycle. Each of these is a point of intervention.</p>\n<h3>From Formulation to Plan</h3>\n<p>The plan follows directly: building emotion-regulation and urge-management skills (CBT, mindfulness, {{callout:urge-surfing}}) for the anxiety the behavior has managed; ACT work on values and on tolerating intimacy-related discomfort; treatment of the co-occurring depression; reduction of shame through a non-judgmental stance and self-compassion work; attention to the underlying intimacy and attachment difficulty; and, with the client's consent and readiness, couples work to support the partner and the relationship. No single intervention would suffice; the integrated, function-focused formulation is what turns an apparently overwhelming problem into a set of addressable targets.</p>",
          "order": 23,
          "callouts": {
            "urge-surfing": {
              "label": "Urge Surfing",
              "type": "clinical",
              "body": "A mindfulness technique of observing an urge rise, peak, and subside without acting on it — building tolerance of urges rather than suppression."
            }
          }
        },
        {
          "type": "text",
          "content": "<h2>The First Sessions: Engagement in a Shame-Laden Area</h2>\n<p>Few clinical areas are as saturated with shame as compulsive sexual behavior, and the opening sessions determine whether a client can be honest enough for treatment to work.</p>\n<h3>Establishing Safety</h3>\n<p>Clients frequently arrive expecting judgment, having internalized moralizing messages about their behavior, and may disclose only a fraction of what is occurring until they feel safe. The clinician's calm, matter-of-fact, explicitly non-judgmental stance in these first conversations is the foundational intervention: it communicates that the client will be helped rather than condemned, and that honesty is safe. Normalizing the difficulty, explaining the collaborative and non-moralizing nature of the work, and conveying that the goal is the client's own wellbeing all lower the barrier to honest engagement.</p>\n<h3>The Frame</h3>\n<p>Early sessions also establish the frame: confidentiality and its limits, the client's control over goals and pace, and the clarity that treatment serves the client's values rather than an imposed standard of conduct. For clients whose sexuality has been a source of secrecy and shame, the experience of being met with acceptance is itself the beginning of change.</p>",
          "order": 24
        },
        {
          "type": "text",
          "content": "<h2>Integrating This Work Into General Practice</h2>\n<p>General mental health clinicians need not specialize in compulsive sexual behavior to provide valuable help, and integrating a basic competence into ordinary practice serves many clients who would otherwise go unhelped.</p>\n<h3>What the Generalist Can Do</h3>\n<p>The generalist can screen sensitively, conduct a careful initial assessment that distinguishes genuine compulsivity from moral incongruence and high desire, provide a non-judgmental relationship that reduces shame, deliver foundational interventions (psychoeducation, emotion-regulation and urge-management skills, motivational and acceptance-based strategies), address co-occurring conditions, and recognize when a presentation calls for specialized care. Much of what helps clients in this area — a non-shaming stance, accurate understanding, and attention to underlying functions — is within the generalist's reach.</p>\n<h3>Knowing the Limits</h3>\n<p>The generalist also recognizes the limits of their competence and refers appropriately: complex or entrenched presentations, significant co-occurring conditions beyond their scope, couples work requiring specialized skill, and any presentation involving non-consensual or illegal behavior that raises distinct frameworks. Referral is not abandonment; the generalist frequently continues to provide support alongside specialized care.</p>",
          "order": 25
        },
        {
          "type": "text",
          "content": "<h2>Integrating the Assessment: From Findings to Formulation</h2>\n<p>Pulling together the assessment, a biopsychosocial synthesis integrates the biological, psychological, and social-relational threads into a single working understanding that guides treatment.</p>\n<h3>The Pattern of Comorbidity</h3>\n<p>Compulsive sexual behavior commonly co-occurs with mood disorders, anxiety, substance use, trauma-related conditions, and the {{callout:compulsivity-impulsivity}} associated with certain other conditions, and these relationships are bidirectional and mutually reinforcing. A synthesis identifies which conditions are present, how they interact with the sexual behavior, and which are driving which — recognizing that the same behavior may serve different functions and arise from different sources in different clients.</p>\n<h3>An Individualized Formulation</h3>\n<p>The synthesis yields an individualized formulation: a working account of how this particular client's biology, psychological history and emotion-regulation patterns, attachment and intimacy capacities, co-occurring conditions, cultural and relational context, and the specific functions of the behavior fit together. This formulation, shared collaboratively with the client, replaces a generic \"addiction\" label with a personalized understanding that directly informs a tailored, multimodal treatment plan and supports the client's own sense-making and hope.</p>",
          "order": 26,
          "callouts": {
            "compulsivity-impulsivity": {
              "label": "Compulsivity vs. Impulsivity",
              "type": "definition",
              "body": "Impulsivity is acting on urges for anticipated reward; compulsivity is driven behavior aimed at relieving distress. CSBD involves features of both."
            }
          }
        }
      ]
    },
    {
      "title": "Module 2: Evidence-Based Treatment, Intimacy Disorders, and Couples Practice",
      "order": 2,
      "estimatedTime": 20,
      "contentBlocks": [
        {
          "type": "sectionDivider",
          "sectionNumber": 2,
          "title": "Module 2",
          "subtitle": "Module 2: Evidence-Based Treatment, Intimacy Disorders, and Couples Practice",
          "order": 0
        },
        {
          "type": "text",
          "content": "<h2>CBT, ACT, Motivational Interviewing, and Relapse Prevention</h2>\n<h3>Cognitive-Behavioral Approaches</h3>\n<p>Cognitive-behavioral approaches to the treatment of compulsive sexual behavior draw on the well-established CBT framework for impulsive and compulsive behaviors, adapting its core components — functional assessment of antecedents and consequences, cognitive restructuring, behavioral skill building, and {{callout:relapse-prevention}} planning — to the specific cognitive and behavioral patterns that maintain CSBD. Functional behavior assessment — identifying the specific triggers, thoughts, emotions, and behavioral consequences that constitute the individual's specific compulsive sexual behavior cycle — provides the foundation for an individualized treatment plan that addresses the specific maintaining mechanisms rather than applying generic CSBD treatment approaches to heterogeneous presentations that may differ substantially in their specific etiology and function.</p>\n<p>The CSBD behavioral cycle typically involves:</p>\n<ol>\n<li>A triggering situation or emotional state</li>\n<li>Cognitive events including intrusive sexual thoughts and permission-giving beliefs that allow the behavior</li>\n<li>The behavior itself</li>\n<li>Immediate reinforcing consequences including emotional relief, pleasure, or dissociative numbing</li>\n<li>Delayed consequences including shame, guilt, and functional impairment that maintain the shame-behavior cycle</li>\n</ol>\n<h3>The Sexual Double Bind</h3>\n<p>The sexual double bind — the clinical dynamic in which both the sexual urge and the shame about the urge are powerfully motivating forces that together maintain the compulsive cycle — is among the most important clinical concepts in CSBD treatment. The standard shame-reduction approach to many clinical conditions — normalizing the experience, reducing self-judgment — is insufficient in CSBD because the shame about the behavior is often ethically warranted: the person is engaging in behavior that genuinely violates their own values and that may harm others.</p>\n<p>Effective CSBD treatment must hold both dimensions: the compassionate acknowledgment of the psychological mechanisms driving the behavior, which reduces the shame that paradoxically maintains it, and the values-based engagement with the person's own ethical commitments that provides the motivational foundation for behavior change. This holding of both dimensions — compassion and accountability — requires clinical skill and conceptual clarity that distinguishes effective CSBD treatment from either pure shame reduction or shame-amplifying moral confrontation.</p>\n<h3>Acceptance and Commitment Therapy (ACT)</h3>\n<p>Acceptance and Commitment Therapy (ACT) provides a particularly well-suited therapeutic framework for CSBD because it addresses the experiential avoidance — the attempt to escape or suppress unwanted internal experiences including uncomfortable emotions, memories, and sexual urges — that is a primary driver of many compulsive behaviors. From an ACT perspective, compulsive sexual behavior functions as an experiential avoidance strategy: a behavioral escape from the discomfort of unwanted internal states — loneliness, anxiety, shame, boredom, depression — through the dissociative, pleasurable, or numbing properties of sexual activity.</p>\n<p>The ACT approach to CSBD involves:</p>\n<ul>\n<li>Identification and defusion from the thoughts that permission-give compulsive behavior</li>\n<li>Acceptance of the internal states that the behavior serves to avoid</li>\n<li>Clarification of personal values as the basis for values-driven behavior change</li>\n<li>Commitment to behavioral choices aligned with values rather than driven by avoidance</li>\n</ul>\n<p>ACT's emphasis on psychological flexibility — the capacity to hold uncomfortable experiences without reacting to them through behavioral avoidance — directly addresses the compulsive mechanism while building the values-based behavioral repertoire that sustained recovery requires.</p>\n<h3>Motivational Interviewing</h3>\n<p>Motivational interviewing is a clinically essential approach for the early stages of CSBD treatment because ambivalence about behavior change is nearly universal in this population and because the confrontational approaches that were historically used in addiction treatment — and that were sometimes applied to CSBD — are now well-documented to reduce rather than increase motivation for change.</p>\n<p>Many individuals presenting with CSBD are not certain they want to change the behavior — they may experience the behavior as ego-syntonic at least in part, may derive genuine pleasure and relief from it, and may be presenting for treatment under external pressure from a partner, employer, or legal system rather than from internal motivation. Motivational interviewing's non-judgmental, evocative, collaborative stance — exploring the individual's own ambivalence and eliciting their own reasons for change rather than providing the reasons from an external authoritative perspective — creates the clinical conditions in which motivation for change can develop and strengthen from within.</p>",
          "order": 1,
          "callouts": {
            "relapse-prevention": {
              "label": "Relapse Prevention",
              "type": "clinical",
              "body": "A structured approach identifying triggers and high-risk situations, building coping strategies, and treating lapses as learning opportunities rather than failures."
            }
          }
        },
        {
          "type": "text",
          "content": "<h2>Problematic Pornography Use, Partner Trauma, and Relapse Prevention</h2>\n<h3>Problematic Pornography Use</h3>\n<p>Pornography use and its clinical management has emerged as a significant clinical concern in the past two decades, as internet pornography has become universally accessible and as the proportion of clients presenting with concerns about their pornography use has grown substantially. Problematic pornography use — defined by the experience of subjective loss of control over pornography use, distress about pornography use, and functional impairment related to pornography use — is distinguished from normative pornography use by these criteria rather than by frequency or content alone.</p>\n<p>The clinical assessment of problematic pornography use must attend to:</p>\n<ul>\n<li>The frequency, duration, and content of pornography use</li>\n<li>The degree of subjective control or loss of control</li>\n<li>The functional impact on occupational functioning, intimate relationships, and sexual functioning</li>\n<li>The presence of comorbid conditions including depression, anxiety, and social anxiety that may be contributing to pornography use as an avoidance behavior</li>\n<li>The cultural, religious, and moral context in which the pornography use is experienced as problematic</li>\n</ul>\n<h3>Impact on Relationships and Sexual Functioning</h3>\n<p>The impact of pornography use on intimate relationships and sexual functioning is a clinically complex topic about which the evidence is contested and evolving. Research suggests that high-frequency pornography use is associated with reduced sexual satisfaction, reduced sexual desire for intimate partners, and difficulties with sexual arousal to partnered sexual stimuli that may reflect the specific arousal properties of pornography — including novelty, variety, and absence of the relational dimensions of partnered sex.</p>\n<p>However, the causal direction of these associations — whether pornography use causes these outcomes or whether individuals with these characteristics are more likely to use pornography frequently — is not clearly established. Clinicians should approach clients' concerns about pornography's impact on their sexual functioning and relationships with a genuinely curious, non-judgmental clinical stance that neither dismisses the concerns as unfounded nor amplifies them beyond what the evidence supports, and that provides accurate clinical information about what is and is not known about pornography's effects.</p>\n<h3>Partner Trauma</h3>\n<p>Partner trauma — the distress experienced by partners who discover or are disclosed to about a significant other's compulsive sexual behavior — has been described as resembling post-traumatic stress in its symptom profile, including intrusive thoughts and images, hypervigilance about partner behavior, avoidance of intimacy, and significant disruptions in trust and safety. Research by Steffens and Rennie (2006) documented that many partners of self-identified 'sex addicts' met criteria for PTSD following disclosure, a finding that has been replicated in subsequent research and that has produced the concept of 'partner {{callout:betrayal-trauma}} trauma' as a clinical construct.</p>\n<p>Whether partner distress following CSBD disclosure constitutes genuine PTSD — or a subclinical but clinically significant trauma response — has clinical treatment implications: partners who meet PTSD criteria benefit from trauma-informed clinical approaches including psychoeducation about trauma responses, validation of the reality-based nature of their hypervigilance and distress, and the specific trauma-focused interventions with the strongest evidence for PTSD symptom reduction.</p>\n<h3>Relapse Prevention</h3>\n<p>Relapse prevention in CSBD treatment draws on the well-established cognitive-behavioral relapse prevention model developed for substance use disorders and adapts it to the specific features of sexual compulsive behavior. The relapse prevention model identifies high-risk situations — the specific circumstances, emotional states, cognitive patterns, and interpersonal contexts that increase vulnerability to compulsive sexual behavior — and develops individualized coping plans for each identified high-risk situation.</p>\n<p>High-risk situations for CSBD commonly include:</p>\n<ul>\n<li>Specific emotional states including loneliness, boredom, stress, and shame</li>\n<li>Specific interpersonal contexts including conflict with a partner</li>\n<li>Specific environmental cues including access to internet-enabled devices in private settings</li>\n<li>Specific times including late evenings after the family is asleep</li>\n<li>Specific internal states including sexual frustration within an intimate relationship</li>\n</ul>\n<p>Effective relapse prevention planning addresses each identified high-risk situation with specific, practical coping strategies and builds the social support and accountability structures that reduce both the likelihood and the impact of lapse experiences.</p>",
          "order": 2,
          "callouts": {
            "betrayal-trauma": {
              "label": "Betrayal Trauma",
              "type": "definition",
              "body": "The trauma-like impact on a partner following disclosure of CSBD-related behavior; resembles betrayal trauma and warrants partner support in its own right."
            }
          }
        },
        {
          "type": "text",
          "content": "<h2>Intimacy Disorders, Attachment, and Couples Treatment</h2>\n<h3>The Intimacy-Compulsivity Dynamic</h3>\n<p>Intimacy disorders — clinical patterns characterized by significant deficits in the capacity for or engagement with emotional intimacy — are clinically intertwined with compulsive sexual behavior in ways that are often central to the etiology, maintenance, and treatment of both. The relationship between intimacy avoidance and compulsive sexual behavior is bidirectional and reinforcing:</p>\n<ul>\n<li>The compulsive sexual behavior substitutes for genuine emotional intimacy, providing a form of connection that avoids the vulnerability of authentic relational closeness</li>\n<li>The intimacy avoidance maintains the motivation for the compulsive behavior by preventing the development of genuine emotional connection that would reduce the need for its substitute</li>\n</ul>\n<p>Understanding this intimacy-compulsivity dynamic is clinically essential because treatment that addresses only the compulsive behavior dimension without attending to the underlying intimacy deficits will produce incomplete and unstable recovery.</p>\n<h3>Attachment Framework and Dismissive-Avoidant Patterns</h3>\n<p>The attachment framework — developed from Bowlby's (1969) foundational theory and subsequently elaborated through decades of empirical research — provides the most clinically comprehensive account of intimacy disorder development and maintenance. Dismissive-avoidant attachment — characterized by defensive self-reliance, suppression of attachment needs, and deactivation of the attachment system in response to intimacy — is the attachment pattern most directly associated with intimacy avoidance.</p>\n<p>Individuals with dismissive-avoidant attachment learned through early relational experiences that emotional dependence is unsafe — that caregivers were consistently unavailable, rejecting, or shaming of attachment needs — and developed the adaptive strategy of dismissing attachment needs and managing emotional regulation independently. In adulthood, this strategy produces difficulties with emotional intimacy, discomfort with vulnerability, and a preference for sexual or activity-based forms of connection that provide relational engagement without the vulnerability of emotional closeness. The compulsive sexual behavior of individuals with dismissive-avoidant attachment often serves exactly this function: it provides a form of connection and pleasure that satisfies the attachment need at a surface level while avoiding the vulnerability that deeper intimacy requires.</p>\n<h3>Treatment of Intimacy Disorders</h3>\n<p>The treatment of intimacy disorders in the context of CSBD requires clinical approaches that address the deep relational and attachment dimensions of the clinical presentation — dimensions that are not adequately addressed by behavioral approaches focused exclusively on the compulsive sexual behavior. Schema therapy — developed by Young and colleagues — provides a clinical framework for identifying and addressing the early maladaptive schemas that organize the intimacy avoidance pattern, including the specific abandonment, shame, emotional deprivation, and defectiveness schemas that are most commonly associated with intimacy disorders.</p>\n<p>Attachment-informed approaches — including the application of Emotionally Focused Therapy (EFT) principles to individual therapy and to couples work — address the attachment-level disruptions that underlie intimacy avoidance and build the secure attachment experiences that support genuine intimacy development. The therapeutic relationship itself, conducted with consistent attunement and explicit attention to the client's attachment-related responses to intimacy within the therapeutic relationship, provides a corrective relational experience that is directly relevant to the development of intimacy capacity.</p>\n<h3>Staged Couples Treatment</h3>\n<p>Couples treatment for compulsive sexual behavior typically involves a staged approach that addresses the needs of both the individual with CSBD and their partner while attending to the significant relational damage that CSBD-related behaviors and their discovery typically produce. The initial stage typically focuses on:</p>\n<ul>\n<li>Individual stabilization for the CSBD partner, including immediate behavioral management and engagement with an appropriate treatment modality</li>\n<li>Crisis support for the affected partner, including trauma-informed support for the acute distress of discovery and disclosure</li>\n<li>The development of a minimum safety plan for the relationship that specifies the conditions under which both partners can remain in the relationship while treatment proceeds</li>\n</ul>\n<p>Subsequent couples work — typically initiated when both partners have achieved sufficient individual stabilization — focuses on the relational repair dimensions of CSBD recovery: rebuilding trust through transparency and accountability; addressing the intimacy deficits that contributed to both the CSBD and to the partner's experience of disconnection; and rebuilding a mutually satisfying intimate and sexual relationship that meets both partners' needs.</p>",
          "order": 3
        },
        {
          "type": "text",
          "content": "<blockquote class=\"cr-vignette\"><strong>Clinical Vignette</strong><br>Carla, 45, presents with anxiety, depression, and relationship difficulties. Assessment reveals a lifelong pattern of emotional intimacy avoidance — maintaining closeness through sexual engagement while avoiding emotional vulnerability. Her partner describes her as 'emotionally unavailable.' Formulation: dismissive-avoidant attachment as organizing pattern; compulsive sexual behavior serving intimacy-avoidance function. Plan: attachment-informed individual therapy addressing emotional deprivation and defectiveness schemas; graduated emotional vulnerability development; couples EFT adjunct; psychoeducation about responsive vs. avoidant intimacy.</blockquote>",
          "order": 4
        },
        {
          "type": "reflection",
          "prompt": "After reviewing this module 2: evidence-based treatment, intimacy disorders, and couples practice, what aspect of your current clinical practice most needs updating or strengthening?",
          "placeholder": "Take a moment to reflect on how this applies to your clinical practice...",
          "order": 5
        },
        {
          "order": 6,
          "type": "matching",
          "matchingInstructions": "Match each treatment modality to its primary mechanism in CSBD care.",
          "matchingPairs": [
            {
              "term": "CBT",
              "definition": "Identifying triggers and modifying thoughts and behavior patterns"
            },
            {
              "term": "ACT",
              "definition": "Accepting urges and committing to values-consistent action rather than control struggles"
            },
            {
              "term": "Motivational Interviewing",
              "definition": "Resolving ambivalence and strengthening the client’s own motivation"
            },
            {
              "term": "Relapse Prevention",
              "definition": "Anticipating high-risk situations and treating lapses as learning"
            }
          ]
        },
        {
          "type": "multipleChoice",
          "question": "Partner trauma following CSBD disclosure most closely resembles in its symptom profile:",
          "options": [
            {
              "text": "Separation anxiety disorder",
              "isCorrect": false
            },
            {
              "text": "Adjustment disorder with depressed mood",
              "isCorrect": false
            },
            {
              "text": "Post-traumatic stress disorder",
              "isCorrect": true
            },
            {
              "text": "Dependent personality disorder",
              "isCorrect": false
            }
          ],
          "correctAnswer": 2,
          "explanation": "Research by Steffens and Rennie (2006) documented that many partners of individuals with CSBD met PTSD criteria following disclosure, supporting trauma-informed clinical approaches for affected partners.",
          "showExplanation": true,
          "order": 7
        },
        {
          "type": "multipleChoice",
          "question": "Motivational interviewing is indicated in CSBD treatment because:",
          "options": [
            {
              "text": "It provides behavioral extinction of compulsive urges",
              "isCorrect": false
            },
            {
              "text": "It addresses the ambivalence about change that is common in this population",
              "isCorrect": true
            },
            {
              "text": "It is required by ethical guidelines for this clinical population",
              "isCorrect": false
            },
            {
              "text": "It is the only evidence-based approach with RCT support",
              "isCorrect": false
            }
          ],
          "correctAnswer": 1,
          "explanation": "Ambivalence about behavior change is nearly universal in CSBD, and MI's non-judgmental evocative approach creates conditions for internal motivation development — contrasting with confrontational approaches that reduce motivation.",
          "showExplanation": true,
          "order": 8
        },
        {
          "type": "text",
          "content": "<h2>Principles of Treatment: Non-Shaming and Function-Focused</h2>\n<p>Before any specific technique, treatment of compulsive sexual behavior rests on a set of principles that distinguish effective, ethical care from the moralizing approaches that have historically harmed clients in this area.</p>\n<h3>Core Principles</h3>\n<p>Effective treatment is non-judgmental and non-shaming, recognizing that shame fuels rather than resolves compulsive patterns. It is function-focused, addressing what the behavior does for the person — the states it manages and needs it meets — rather than only the behavior's surface. It is individualized and client-centered, oriented to the client's own goals rather than to an externally imposed standard of sexual conduct. It addresses co-occurring conditions and underlying factors, since compulsive sexual behavior rarely exists in isolation. And it is evidence-informed, drawing on approaches with empirical support rather than on the contested assumptions of any single popular model.</p>\n<h3>Goals Defined With the Client</h3>\n<p>Crucially, treatment goals are set collaboratively. For some clients the goal is to stop a specific behavior; for others it is to regain a sense of control, to reduce distress, to align behavior with values, or to address the underlying emotional needs the behavior has been managing. The clinician does not assume that abstinence from all sexual activity is the goal, and helps the client define what recovery means for them.</p>",
          "order": 9
        },
        {
          "type": "text",
          "content": "<h2>Cognitive-Behavioral Therapy for Compulsive Sexual Behavior</h2>\n<p>Cognitive-behavioral approaches are among the most established treatments for compulsive sexual behavior, targeting the triggers, thoughts, and behavioral patterns that maintain the cycle.</p>\n<h3>Understanding and Managing Triggers</h3>\n<p>CBT begins by helping the client identify the triggers — emotional states, situations, times, and cues — that precede the behavior, and the chain of events and thoughts that leads from trigger to behavior. With this map, the client develops strategies to manage triggers: avoiding or modifying high-risk situations where appropriate, interrupting the chain earlier, and developing alternative responses to the states that previously led to the behavior.</p>\n<h3>Cognitive and Behavioral Components</h3>\n<p>The cognitive component identifies and challenges the thoughts that permit or drive the behavior — rationalizations, permission-giving beliefs, and the distorted thinking that accompanies urges — and addresses the shame-laden beliefs that fuel the cycle. The behavioral component builds urge-management skills, develops alternative coping strategies for the emotional states the behavior has managed, restructures the environment to reduce cues, and establishes new routines. Because compulsive sexual behavior so often functions as emotion regulation, building healthier emotion-regulation skills is central to the behavioral work.</p>",
          "order": 10
        },
        {
          "type": "text",
          "content": "<h2>Acceptance and Commitment Therapy</h2>\n<p>Acceptance and Commitment Therapy (ACT) has emerged as a particularly well-suited approach for compulsive sexual behavior, in part because its emphasis on values and acceptance addresses the shame and avoidance at the heart of the problem.</p>\n<h3>The ACT Approach</h3>\n<p>Rather than focusing on controlling or eliminating urges directly, ACT helps clients change their relationship to urges and difficult internal experiences. Through acceptance, clients learn to allow urges and uncomfortable feelings to be present without acting on them; through cognitive defusion, they learn to observe thoughts and urges without being controlled by them; and through values clarification, they connect with what genuinely matters to them and use those values to guide behavior. The central construct, psychological flexibility, is the capacity to act in line with one's values even in the presence of difficult internal experiences.</p>\n<h3>Why It Fits</h3>\n<p>ACT is well matched to compulsive sexual behavior for several reasons. It directly addresses the experiential avoidance — the attempt to escape painful internal states — that frequently drives the behavior. Its non-judgmental, acceptance-based stance counters the shame that fuels the compulsivity cycle, rather than adding to it. And its focus on values, rather than on rules or prohibitions, helps clients build a life that is meaningful and aligned with what they care about, which supports lasting change more durably than willpower or restriction alone.</p>",
          "order": 11
        },
        {
          "type": "text",
          "content": "<h2>Mindfulness and Urge Surfing</h2>\n<p>Mindfulness-based strategies are a valuable component of treatment, giving clients a concrete way to experience urges without acting on them.</p>\n<h3>Urge Surfing</h3>\n<p>Urge surfing is a mindfulness technique in which the client learns to observe an urge as it rises, peaks, and falls — like a wave — without acting on it and without fighting it. The key insight is that urges, however intense, are temporary: they rise and pass if not acted upon. By observing the urge with curiosity and acceptance rather than panic or suppression, the client discovers experientially that they can tolerate the urge and that it will subside, weakening the automatic link between urge and behavior.</p>\n<h3>Broader Mindfulness Practice</h3>\n<p>Beyond urge surfing, mindfulness cultivates the present-moment, non-judgmental awareness that helps clients notice triggers and the early links in the behavioral chain, tolerate difficult emotional states without escaping into the behavior, and reduce the self-criticism that feeds the shame-compulsivity cycle. Mindfulness practice supports the emotion-regulation goals shared across CBT and ACT, and it gives clients a portable skill they can use in the moments when urges arise.</p>",
          "order": 12
        },
        {
          "type": "text",
          "content": "<h2>Motivational Interviewing and Ambivalence</h2>\n<p>Clients with compulsive sexual behavior are frequently ambivalent — they may want to change and also experience the behavior as meeting real needs or providing relief — and motivational interviewing provides a stance and a set of skills for working with this ambivalence.</p>\n<h3>Working With Ambivalence</h3>\n<p>Motivational interviewing recognizes ambivalence as a normal part of the change process rather than as resistance or denial. Through a collaborative, non-confrontational, empathic style, the clinician helps the client explore their own reasons for and against change, resolves ambivalence in the direction of the client's own values and goals, and strengthens the client's intrinsic motivation. Confrontational or shaming approaches — common in some traditional models — tend to increase defensiveness and are counterproductive; the motivational interviewing stance, by contrast, evokes the client's own motivation.</p>\n<h3>Engagement and Retention</h3>\n<p>Because shame and ambivalence are such powerful barriers in this area, the motivational interviewing spirit is valuable not only as a discrete technique but as an overall stance that supports engagement and retention in treatment. Meeting the client where they are, honoring their autonomy, and supporting their own reasons for change makes it possible for clients to remain in and benefit from treatment.</p>",
          "order": 13
        },
        {
          "type": "text",
          "content": "<h2>Relapse Prevention and Managing Lapses</h2>\n<p>Relapse prevention, adapted from the treatment of addictive behaviors, helps clients maintain change over time and respond constructively to lapses.</p>\n<h3>Anticipating and Planning</h3>\n<p>Relapse prevention helps clients identify high-risk situations — the emotional states, contexts, and cues most likely to precipitate the behavior — and develop specific plans for managing them. It builds coping skills for high-risk moments, supports the lifestyle changes that reduce vulnerability (such as addressing stress, isolation, and unmet needs), and helps clients recognize the early warning signs that precede a lapse.</p>\n<h3>The Abstinence Violation Effect</h3>\n<p>A central concept is the abstinence violation effect: when a person who is trying to change has a lapse, they may experience intense shame, guilt, and a sense of total failure that paradoxically triggers further behavior — \"I've already failed, so it doesn't matter.\" Relapse prevention reframes a lapse as a single event to learn from rather than a catastrophic failure, helping the client respond to a lapse with self-compassion and recommitment rather than the shame spiral that would otherwise deepen it. This reframing is especially important given the central role of shame in compulsive sexual behavior.</p>",
          "order": 14
        },
        {
          "type": "text",
          "content": "<h2>The Abstinence and Harm-Reduction Question</h2>\n<p>One of the most important — and frequently mishandled — questions in treating compulsive sexual behavior is what the goal should be, and the answer is neither automatic nor universal.</p>\n<h3>Beyond a Reflexive Abstinence Model</h3>\n<p>Some popular treatment models assume that the goal is abstinence, often modeled on substance-addiction recovery. But sexuality, unlike substance use, is a normal and healthy part of human life that most clients neither can nor should eliminate, and a blanket abstinence goal frequently makes little clinical sense. The goal is usually not to stop being sexual but to regain control, to align sexual behavior with one's values, to stop a specific problematic behavior, or to address the underlying needs the behavior has been managing.</p>\n<h3>Defining Goals With the Client</h3>\n<p>The appropriate goal is defined collaboratively with the client and depends on the specific behavior, its consequences, and the client's values and circumstances. For some behaviors and some clients, stopping a specific behavior entirely is the goal; for others, the goal is a healthier, more controlled, values-consistent relationship with sexuality. The clinician helps the client clarify what they actually want and what would genuinely serve their wellbeing, rather than imposing a one-size-fits-all abstinence framework that may not fit and may even deepen shame.</p>",
          "order": 15
        },
        {
          "order": 16,
          "type": "multiSelect",
          "question": "Which reflect best practice in setting treatment goals for compulsive sexual behavior? (Select all that apply)",
          "options": [
            {
              "text": "Goals are set collaboratively with the client",
              "isCorrect": true
            },
            {
              "text": "Goals are grounded in the client’s own values",
              "isCorrect": true
            },
            {
              "text": "Reflexive, clinician-imposed abstinence is the default for everyone",
              "isCorrect": false
            },
            {
              "text": "Goals focus on function, wellbeing, and control rather than shame",
              "isCorrect": true
            },
            {
              "text": "Both abstinence and harm-reduction goals may be appropriate depending on the client",
              "isCorrect": true
            }
          ],
          "explanation": "Best practice sets collaborative, values-based, function-focused goals; abstinence is not reflexively imposed, and harm-reduction or abstinence may fit depending on the individual."
        },
        {
          "type": "text",
          "content": "<h2>Treating Co-Occurring Conditions</h2>\n<p>Compulsive sexual behavior rarely occurs in isolation, and effective treatment addresses the co-occurring conditions that frequently accompany and maintain it.</p>\n<h3>Common Co-Occurrence</h3>\n<p>Depression, anxiety, substance use, trauma-related conditions, and other difficulties frequently co-occur with compulsive sexual behavior, and the relationship runs both ways: these conditions can drive the behavior (which functions to manage the associated distress), and the behavior and its consequences can worsen them. A client who uses sexual behavior to cope with depression or trauma will struggle to change the behavior while the underlying condition goes untreated.</p>\n<h3>Integrated Treatment</h3>\n<p>Effective care assesses for and treats co-occurring conditions in an integrated way rather than addressing the sexual behavior in isolation. This frequently means treating depression or anxiety, addressing trauma with appropriate trauma-focused care, coordinating substance-use treatment, and understanding how these conditions and the sexual behavior interact. Because so much compulsive sexual behavior functions as emotion regulation and as coping with underlying distress, treating the underlying conditions is often essential to lasting change in the behavior itself.</p>",
          "order": 17
        },
        {
          "type": "text",
          "content": "<h2>Pharmacological Adjuncts</h2>\n<p>While psychotherapy is the foundation of treatment, medication has an adjunctive role that clinicians should understand in order to coordinate care, even when they do not prescribe.</p>\n<h3>The Role of Medication</h3>\n<p>Medication is generally adjunctive rather than primary, and is most often used to treat co-occurring conditions — such as depression and anxiety — that drive or accompany the behavior. In some cases, agents that reduce sexual drive or target impulsivity have been used, and certain medications have been explored specifically for compulsive sexual behavior, though the evidence base is limited and such use requires specialized prescribing judgment. Notably, some medications (including certain antidepressants) have sexual side effects that may incidentally reduce the behavior, which carries its own considerations.</p>\n<h3>Coordinating Care</h3>\n<p>Non-prescribing clinicians contribute by recognizing when a medication consultation may help — particularly for co-occurring depression, anxiety, or significant impulsivity — referring to and coordinating with prescribers, and helping the client make informed decisions. As throughout, the client's autonomy and goals guide these decisions, and medication is integrated with the psychological and relational work rather than substituted for it.</p>",
          "order": 18
        },
        {
          "type": "text",
          "content": "<h2>Group Treatment and Peer Support</h2>\n<p>Group modalities and peer support play a significant role in this area, offering distinctive benefits while also raising considerations the clinician should weigh.</p>\n<h3>What Groups Offer</h3>\n<p>Because shame, secrecy, and isolation are so central to compulsive sexual behavior, group treatment and peer support can be powerfully therapeutic: the experience of being among others who understand, of reducing secrecy, and of mutual support can counter the shame and isolation that maintain the behavior. Process and skills-based groups can provide support, accountability, and a setting to practice new skills.</p>\n<h3>Considerations With Peer Models</h3>\n<p>Various peer-support and twelve-step-style programs exist for sexual behavior, and some clients find them helpful. The clinician approaches these with balanced judgment: they can offer valuable community and support, but some are built on the contested addiction and abstinence models, and some carry shame-based or moralizing elements that may be counterproductive for a given client. The clinician helps the client evaluate whether a particular program fits their needs and values, supports their autonomy in the choice, and remains alert to whether a program is reducing or inadvertently increasing shame.</p>",
          "order": 19
        },
        {
          "type": "text",
          "content": "<h2>Behavioral Activation and Lifestyle Foundations in Recovery</h2>\n<p>Treatment for compulsive sexual behavior frequently focuses on the behavior itself, but sustainable change rests substantially on the broader structure of a person's life. Attending to behavioral activation and lifestyle foundations strengthens treatment and addresses conditions that drive compulsive patterns.</p>\n<h3>Structure, Activity, and the Empty Hours</h3>\n<p>Compulsive sexual behavior frequently occupies the unstructured, isolated, or distressing hours of a person's life, serving to fill emptiness, escape difficult states, or manage boredom and loneliness. Helping clients build a fuller, more structured, and more rewarding daily life directly addresses these drivers. Behavioral activation — collaboratively increasing engagement in meaningful, pleasurable, and values-consistent activities — counters the isolation and emptiness that compulsive behavior frequently fills, and provides genuine sources of reward and meaning that the behavior had been substituting for. Building structure into the day, particularly around high-risk times, reduces the unstructured vulnerability in which urges escalate.</p>\n<h3>Sleep, Stress, and Physical Foundations</h3>\n<p>The physical foundations of self-regulation also matter. Poor sleep, chronic stress, and physical depletion erode the capacity to tolerate distress and resist urges, while attention to sleep, stress management, physical activity, and basic self-care strengthens it. These are not peripheral to treatment but part of building the regulatory capacity on which behavior change depends; a depleted, exhausted, chronically stressed person has fewer resources to bring to the difficult work of changing an entrenched pattern. Integrating attention to activity, structure, connection, and physical wellbeing into treatment — alongside the more targeted work on urges, triggers, and underlying factors — supports durable change by addressing the life conditions in which compulsive behavior takes hold, rather than treating the behavior in isolation from the life around it.</p>",
          "order": 20,
          "title": "Behavioral Activation and Lifestyle Foundations in Recovery"
        },
        {
          "type": "multipleChoice",
          "question": "Research on self-perceived pornography \"addiction\" indicates that distress is frequently driven by:",
          "options": [
            {
              "text": "The objective quantity of use alone",
              "isCorrect": false
            },
            {
              "text": "Moral incongruence — conflict between use and the person’s moral/religious values — rather than genuine loss of control",
              "isCorrect": true
            },
            {
              "text": "Always genuine neurobiological addiction",
              "isCorrect": false
            },
            {
              "text": "Partner approval",
              "isCorrect": false
            }
          ],
          "correctAnswer": 1,
          "explanation": "Studies show self-perceived pornography addiction is frequently driven by moral incongruence rather than by quantity of use or genuine compulsivity, which is why careful assessment must distinguish the two.",
          "showExplanation": true,
          "order": 21
        },
        {
          "type": "reflection",
          "prompt": "How might you respond differently to a client distressed about pornography use driven by moral incongruence versus one with genuine loss of control? What would change in your approach?",
          "placeholder": "Reflect on your clinical practice...",
          "order": 35
        },
        {
          "type": "text",
          "content": "<h2>Building Emotion-Regulation Skills</h2>\n<p>Because compulsive sexual behavior so frequently functions as a way of managing painful internal states, building the client's capacity to regulate emotion in other ways is central to lasting change across every treatment approach.</p>\n<h3>The Rationale</h3>\n<p>If sexual behavior is the client's primary tool for managing anxiety, loneliness, emptiness, or distress, simply removing the behavior leaves the underlying states unmanaged — which is why behavior-only approaches frequently fail or relapse. Effective treatment helps the client develop a broader repertoire for tolerating and regulating difficult emotions, so that the behavior becomes less necessary.</p>\n<h3>What This Involves</h3>\n<p>Emotion-regulation work includes helping the client identify and name internal states (many clients act on states they cannot yet recognize), tolerate distress without escaping into the behavior, soothe and regulate themselves through other means, and meet the underlying needs — for connection, soothing, stimulation, or relief — in healthier ways. Mindfulness, distress-tolerance skills, and the acceptance-based strategies of ACT all contribute. As the client's capacity to manage internal states grows, the pull of the compulsive behavior typically weakens.</p>",
          "order": 23
        },
        {
          "type": "text",
          "content": "<h2>Technology, Accessibility, and the Modern Context</h2>\n<p>The contemporary technological environment has changed the landscape of sexual behavior, and understanding this context informs assessment and treatment.</p>\n<h3>The Role of Accessibility</h3>\n<p>Online sexual content and sexual contact are available with unprecedented ease, privacy, affordability, and variety. For most people this access is unproblematic, but for those vulnerable to compulsive patterns, the constant availability, novelty, and low barriers can intensify difficulty with control. The \"triple-A\" qualities frequently noted — accessibility, affordability, and anonymity — describe features of the online environment that can facilitate escalation for those who are vulnerable, without making the technology itself inherently harmful for the majority.</p>\n<h3>Clinical Implications</h3>\n<p>Understanding the technological context helps the clinician assess realistically and plan practically — for example, in addressing the environmental cues and access patterns that maintain the behavior — while avoiding the moralizing of technology use itself. The same careful distinction applies: most use is unproblematic, and the clinician guards against treating ordinary technology-mediated sexual behavior as pathological while attending to genuine loss of control where it exists.</p>",
          "order": 24
        },
        {
          "type": "text",
          "content": "<h2>Measuring Progress and Defining Recovery</h2>\n<p>Because recovery in this area is individually defined rather than tied to a universal abstinence standard, measuring progress requires clarity about what the client is actually working toward.</p>\n<h3>What Progress Looks Like</h3>\n<p>Progress may include reduced frequency or cessation of a specific problematic behavior, a restored sense of control and choice, reduced distress, behavior brought into alignment with the client's values, improved emotion regulation, healthier intimacy and relationships, and the resolution of co-occurring conditions. The clinician and client define, collaboratively, what recovery means in this case, and track movement toward those goals rather than toward an external standard.</p>\n<h3>A Realistic, Compassionate View</h3>\n<p>Progress is frequently non-linear, with lapses and setbacks that — handled with the relapse-prevention reframe — become information and opportunities for learning rather than evidence of failure. A recovery-oriented, compassionate view sustains the client's motivation and counters the shame that would otherwise sabotage change. The measure of success is the client's genuine wellbeing and self-defined goals, not conformity to any predetermined model of sexual conduct.</p>",
          "order": 25
        },
        {
          "order": 26,
          "type": "sequencing",
          "instructions": "Order the steps of a functional analysis of a compulsive sexual behavior episode.",
          "steps": [
            {
              "order": 1,
              "text": "Identify the trigger or high-risk situation"
            },
            {
              "order": 2,
              "text": "Notice the emotional state or distress that arises"
            },
            {
              "order": 3,
              "text": "Observe the behavior used to regulate that state"
            },
            {
              "order": 4,
              "text": "Examine the short-term relief and longer-term consequences"
            }
          ],
          "explanation": "Functional analysis traces trigger → emotion → behavior → consequence, revealing the emotion-regulation function the behavior serves — the target for building alternative coping."
        },
        {
          "type": "text",
          "content": "<h2>Self-Compassion as a Clinical Tool</h2>\n<p>Given the central role of shame in compulsive sexual behavior, cultivating the client's self-compassion is not a soft add-on but a clinically active ingredient of change.</p>\n<h3>Why Self-Compassion Helps</h3>\n<p>Self-criticism and shame fuel the compulsivity cycle: they intensify the painful internal states the behavior is used to escape, and they drive the \"I've already failed\" spiral after lapses. Self-compassion — treating oneself with the kindness, understanding, and perspective one would offer a friend — directly counters this dynamic. It reduces the shame that drives the behavior, supports recovery from lapses without spiraling, and makes sustained change more possible.</p>\n<h3>Cultivating It</h3>\n<p>The clinician models self-compassion through their own non-judgmental stance and helps the client develop it explicitly: recognizing and softening harsh self-criticism, understanding their behavior with compassion rather than condemnation, and responding to setbacks with kindness and recommitment rather than self-attack. Far from excusing the behavior or reducing motivation, self-compassion frees the energy that shame consumes and supports the genuine, values-driven change the client seeks.</p>",
          "order": 27
        },
        {
          "type": "text",
          "content": "<h2>Aftercare and Maintaining Gains</h2>\n<p>As treatment approaches its goals, attention turns to consolidating gains and supporting the client to maintain them over time.</p>\n<h3>Consolidating Change</h3>\n<p>The clinician helps the client understand what produced their improvement — which skills, insights, and changes made the difference — so they can sustain and reapply them. Anticipating future challenges (stress, life transitions, relationship changes, and the high-risk situations identified in relapse prevention) and planning for them supports lasting change. The client leaves treatment not only improved but equipped with a framework for maintaining gains and responding to difficulties.</p>\n<h3>Responding to Setbacks</h3>\n<p>Clients are helped to understand that setbacks can occur and do not erase progress, and to respond to them with the relapse-prevention reframe and self-compassion rather than shame. Knowing when and how to return for support if needed, and having a plan for early warning signs, gives the client confidence and a safety net. A thoughtful conclusion affirms the client's gains and agency and supports their continued wellbeing beyond treatment.</p>",
          "order": 28
        },
        {
          "type": "text",
          "content": "<h2>Combining Modalities: An Integrative Treatment Plan</h2>\n<p>Effective treatment of compulsive sexual behavior is typically integrative, combining elements from the approaches surveyed rather than applying any single method in isolation.</p>\n<h3>Why Integration</h3>\n<p>Because the behavior is multiply determined and serves multiple functions, no single modality addresses every dimension. A typical integrative plan might combine cognitive-behavioral skills for triggers and urges, acceptance- and mindfulness-based strategies for the relationship to urges and difficult states, motivational work for ambivalence, relapse-prevention planning, treatment of co-occurring conditions, attention to intimacy and attachment, and — where relevant — couples work and partner support. The clinician sequences and combines these according to the client's needs, readiness, and goals.</p>\n<h3>Tailoring the Plan</h3>\n<p>The integrative plan is tailored, not formulaic: it follows from the individualized formulation and is revised as treatment proceeds and as the clinician learns more about what helps this client. Throughout, the unifying threads remain constant — a non-shaming stance, a function-focused understanding, collaborative goals, and attention to the underlying needs and conditions that sustain the behavior.</p>",
          "order": 29
        },
        {
          "type": "text",
          "content": "<h2>Common Pitfalls in Treatment</h2>\n<p>Several recurring pitfalls undermine treatment of compulsive sexual behavior, and awareness of them helps the clinician avoid them.</p>\n<h3>Frequent Errors</h3>\n<p>Common pitfalls include adopting a moralizing or shaming stance that intensifies the very cycle being treated; reflexively imposing an abstinence-on-an-addiction model that may not fit; pathologizing high desire, normative variation, or moral incongruence as disorder; treating the sexual behavior in isolation while ignoring co-occurring conditions and underlying functions; neglecting the intimacy and attachment difficulties that drive many cases; and mishandling the partner — either neglecting them or casting them in blaming frameworks. Each of these errors reflects a departure from the evidence-informed, non-judgmental, function-focused principles of sound practice.</p>\n<h3>Staying on Course</h3>\n<p>The clinician guards against these pitfalls through ongoing self-examination, consultation, and a steady return to first principles: careful differential assessment, a non-shaming stance, collaborative and individualized goals, attention to function and to co-occurring and underlying factors, and humility about a contested and evolving area. When treatment stalls, revisiting these principles — and considering whether an unaddressed factor or a misframed goal is the obstacle — frequently reveals the path forward.</p>",
          "order": 30
        }
      ]
    },
    {
      "title": "Module 3: Intimacy Disorders, Relationships, and Ethical Practice",
      "order": 2,
      "estimatedTime": 25,
      "contentBlocks": [
        {
          "type": "sectionDivider",
          "order": 0,
          "sectionNumber": 3,
          "title": "Module 3",
          "subtitle": "Module 3: Intimacy Disorders, Relationships, and Ethical Practice"
        },
        {
          "type": "text",
          "order": 1,
          "content": "<h2>Intimacy Disorders: An Overview</h2>\n<p>Compulsive sexual behavior is frequently intertwined with difficulties in intimacy, and understanding these intimacy difficulties is essential to comprehensive assessment and treatment. \"Intimacy disorder\" is not a formal diagnostic category but a clinically useful way of describing persistent difficulty with genuine emotional closeness.</p>\n<h3>What Intimacy Difficulties Involve</h3>\n<p>Intimacy difficulties involve trouble forming or sustaining genuine emotional closeness — difficulty being vulnerable, trusting, and truly known by another person. They may manifest as avoidance of closeness, emotional distance even within ongoing relationships, difficulty tolerating the vulnerability that intimacy requires, and a pattern of substituting other experiences for genuine connection. These difficulties typically have roots in developmental experiences and attachment history.</p>\n<h3>Why They Matter Here</h3>\n<p>For many clients, sexual behavior and intimacy difficulties are connected: sex can become a way of obtaining a feeling of connection or relief without the vulnerability of genuine intimacy, or a way of avoiding closeness altogether. Recognizing and addressing the intimacy dimension frequently turns out to be central to lasting change, because treating the sexual behavior without addressing the underlying difficulty with closeness leaves the driving factor in place.</p>"
        },
        {
          "type": "text",
          "order": 2,
          "content": "<h2>The Intimacy-Compulsivity Connection</h2>\n<p>One of the most clinically important insights in this area is the relationship between compulsive sexual behavior and difficulty with genuine intimacy.</p>\n<h3>Sex as a Substitute for Intimacy</h3>\n<p>For many clients, compulsive sexual behavior provides a counterfeit of intimacy — the physical and emotional sensations associated with closeness without the vulnerability, mutuality, and risk that genuine intimacy requires. Sexual behavior can deliver a temporary sense of connection, validation, or soothing while protecting the person from the exposure of being truly known. Paradoxically, the behavior that seems to seek connection frequently functions to avoid it.</p>\n<h3>The Avoidance Function</h3>\n<p>Understood this way, compulsive sexual behavior often serves as an avoidance of intimacy: it manages the anxiety that closeness provokes, fills the emptiness left by its absence, and substitutes for the connection the person both wants and fears. This is why purely behavioral approaches that target only the sexual behavior frequently fall short — the behavior is meeting a need and managing a fear that remain unaddressed. Effective treatment helps the client develop the capacity for genuine intimacy, so that the counterfeit becomes less necessary.</p>"
        },
        {
          "type": "text",
          "order": 3,
          "content": "<h2>Attachment Theory and Sexual Behavior</h2>\n<p>Attachment theory provides a powerful framework for understanding the intimacy difficulties that frequently underlie compulsive sexual behavior.</p>\n<h3>Attachment Patterns</h3>\n<p>Early relationships with caregivers shape internal working models of self and others and characteristic patterns of relating in close relationships. Secure attachment supports the capacity for intimacy — the ability to depend on others, tolerate vulnerability, and sustain closeness. Insecure attachment patterns, by contrast, involve characteristic difficulties: avoidant or dismissive patterns involve discomfort with closeness and a tendency to maintain distance and self-reliance, while anxious patterns involve fear of abandonment and difficulty feeling secure in relationships.</p>\n<h3>Attachment and Compulsive Sexual Behavior</h3>\n<p>Insecure attachment, particularly patterns involving avoidance of genuine emotional intimacy, is frequently associated with compulsive sexual behavior. For a person with a dismissive-avoidant pattern, sexual behavior may provide connection-like experiences while maintaining the emotional distance the person is comfortable with; for a person with an anxious pattern, it may provide reassurance and soothe fears of inadequacy or abandonment. Understanding a client's attachment pattern illuminates the function the sexual behavior serves and points toward treatment that addresses the underlying relational template, not just the behavior.</p>"
        },
        {
          "type": "text",
          "order": 4,
          "content": "<h2>Working With Avoidant and Dismissive Patterns</h2>\n<p>Because dismissive-avoidant patterns are so frequently associated with compulsive sexual behavior and intimacy difficulties, working with these patterns is a common clinical task.</p>\n<h3>The Clinical Picture</h3>\n<p>Clients with dismissive-avoidant patterns may present as self-sufficient and uncomfortable with emotional closeness, minimizing the importance of relationships and intimacy, and struggling to access or express vulnerable feelings. They may not initially recognize intimacy difficulty as relevant to their sexual behavior, and the therapeutic relationship itself may evoke the discomfort with closeness that characterizes the pattern.</p>\n<h3>Treatment Considerations</h3>\n<p>Working with these patterns requires patience and attunement. The therapeutic relationship — consistent, accepting, and safe — itself becomes a vehicle for developing the capacity for closeness, offering a different experience of being known. Treatment gradually helps the client access and tolerate vulnerable feelings, recognize the costs of emotional distance, and develop the capacity for genuine intimacy. This work is typically slower and more relationally focused than purely behavioral intervention, and it addresses the underlying template that the sexual behavior has been serving.</p>"
        },
        {
          "order": 5,
          "type": "multiSelect",
          "question": "Which statements about the relationship between compulsive sexual behavior and intimacy are accurate? (Select all that apply)",
          "options": [
            {
              "text": "Compulsive behavior frequently coexists with difficulty in genuine intimacy",
              "isCorrect": true
            },
            {
              "text": "For some, the behavior substitutes for or avoids vulnerable connection",
              "isCorrect": true
            },
            {
              "text": "Addressing underlying intimacy and attachment difficulties is often part of treatment",
              "isCorrect": true
            },
            {
              "text": "Intimacy difficulties are irrelevant to CSBD treatment",
              "isCorrect": false
            }
          ],
          "explanation": "CSBD frequently coexists with intimacy and attachment difficulties, sometimes substituting for vulnerable connection; addressing these is often integral to treatment."
        },
        {
          "type": "text",
          "order": 6,
          "content": "<h2>Relationship Impact and Betrayal</h2>\n<p>Compulsive sexual behavior frequently occurs within committed relationships and can have a profound impact on partners, who deserve clinical attention and support in their own right.</p>\n<h3>The Partner's Experience</h3>\n<p>When a partner discovers compulsive sexual behavior — particularly behavior that was hidden, or that involved infidelity or deception — they frequently experience significant distress: shock, betrayal, anger, grief, damaged self-esteem, and difficulty trusting. Some clinicians describe this experience using the language of betrayal trauma, noting that the discovery and the deception can produce trauma-like responses including intrusive thoughts, hypervigilance, and emotional dysregulation. The partner's distress is real and significant regardless of the framework used to describe it.</p>\n<h3>Holding the Framing Carefully</h3>\n<p>The clinician holds the conceptual framing with care. The betrayal-trauma framework can validate and help partners, and the partner's pain is genuine and deserves support; at the same time, some applications of the framework are tied to the contested addiction model and to assumptions that may not fit every couple. The clinician supports the partner's actual experience and needs rather than imposing a predetermined narrative, and remains attentive to the specific dynamics of the particular relationship rather than applying a fixed template.</p>"
        },
        {
          "type": "text",
          "order": 7,
          "content": "<h2>Supporting the Partner</h2>\n<p>Partners affected by a loved one's compulsive sexual behavior need and deserve support in their own right, distinct from their role in the couple's treatment.</p>\n<h3>The Partner's Own Care</h3>\n<p>Partners benefit from their own space to process the distress, betrayal, and disruption they have experienced, to attend to their own wellbeing and safety (including sexual health concerns where relevant), and to make their own decisions about the relationship free from pressure. Individual support for the partner — whether through their own therapy or through partner-focused work — recognizes that the partner is not merely an adjunct to the client's treatment but a person with their own needs and their own process.</p>\n<h3>Avoiding Harmful Frameworks</h3>\n<p>Historically, some models cast partners in unhelpful roles — as \"co-addicts\" or as contributors to the behavior — frameworks that can be invalidating and harmful. Contemporary, evidence-informed practice rejects blaming the partner for the client's behavior and instead supports the partner as someone affected by another's actions and entitled to support and respect. The clinician helps the partner attend to their own needs and decisions while avoiding any framework that holds them responsible for the client's compulsive behavior.</p>"
        },
        {
          "type": "text",
          "order": 8,
          "content": "<h2>Couples Treatment: A Staged Approach</h2>\n<p>When a couple chooses to work on the relationship in the context of compulsive sexual behavior, treatment typically proceeds in stages, with stabilization preceding the deeper work of rebuilding.</p>\n<h3>Stabilization First</h3>\n<p>The early stage focuses on stabilization: managing the acute crisis that frequently accompanies discovery, attending to both partners' immediate emotional needs and safety, establishing enough stability and safety in the relationship to allow further work, and beginning to address the compulsive behavior itself. Attempting to rebuild trust or intimacy before this stabilization is in place generally fails, much as trauma processing fails without prior stabilization.</p>\n<h3>Rebuilding and Growth</h3>\n<p>Later stages, entered when stabilization allows, focus on rebuilding trust, repairing and deepening the relationship, addressing the intimacy difficulties that frequently underlie the behavior, and supporting the growth of genuine closeness. This work integrates the individual treatment of the compulsive behavior with the relational work, and it proceeds at a pace both partners can sustain. Throughout, the clinician supports each partner's autonomy, including the possibility that a partner may decide the relationship cannot continue.</p>"
        },
        {
          "type": "text",
          "order": 9,
          "content": "<h2>Disclosure: Clinical Considerations</h2>\n<p>The question of disclosure — what a client tells a partner about their sexual behavior, and how — is a significant and sometimes contested element of couples work in this area.</p>\n<h3>The Role of Disclosure</h3>\n<p>Where there has been hidden behavior or deception, disclosure is frequently important to the possibility of rebuilding trust, because trust cannot be rebuilt on continued concealment. Some approaches use a structured therapeutic disclosure process, in which the client shares relevant information with the partner in a prepared, facilitated way intended to support honesty while minimizing gratuitous harm. The aim is honesty in service of the relationship's possible repair and the partner's right to make informed decisions.</p>\n<h3>Handling Disclosure Thoughtfully</h3>\n<p>Disclosure is also genuinely complex, and practices vary. Questions about timing, scope, and the level of detail that is helpful versus harmful are matters of clinical judgment and ongoing debate. Excessive or poorly handled detail can be retraumatizing for a partner, while concealment undermines repair. The clinician approaches disclosure thoughtfully and individually — attending to the needs of both partners, the specific situation, and the goal of honesty in service of the partner's autonomy and the relationship's possible healing — rather than applying a rigid formula.</p>"
        },
        {
          "type": "reflection",
          "order": 10,
          "prompt": "How comfortable are you working with the partner’s experience and with couples affected by compulsive sexual behavior? Where would your competence benefit from further training or consultation?",
          "placeholder": "Reflect on your clinical practice..."
        },
        {
          "type": "text",
          "order": 11,
          "content": "<h2>Rebuilding Trust and Intimacy</h2>\n<p>For couples who choose to rebuild, the restoration of trust and the development of genuine intimacy are central and gradual tasks.</p>\n<h3>Trust as a Gradual Process</h3>\n<p>Trust, once damaged, rebuilds slowly and through consistent, demonstrated trustworthiness over time rather than through promises alone. The clinician helps the couple understand that rebuilding trust is a process, supports the behavior change and transparency that make it possible, and helps the partner navigate the gradual and non-linear recovery of their ability to trust. Both partners need realistic expectations: setbacks and waves of distress are normal parts of the process rather than signs of failure.</p>\n<h3>Developing Genuine Intimacy</h3>\n<p>Because intimacy difficulties so frequently underlie compulsive sexual behavior, rebuilding often involves developing a kind of genuine closeness the couple may never have had. This includes building emotional intimacy and vulnerability, improving communication, and addressing the patterns that kept the couple distant. For many couples, the crisis becomes, painful as it is, an occasion for developing a deeper and more honest relationship than existed before — though this outcome is never guaranteed and is never the clinician's to promise.</p>"
        },
        {
          "type": "text",
          "order": 12,
          "content": "<h2>Sexual Functioning and Compulsive Behavior</h2>\n<p>Compulsive sexual behavior intersects with sexual functioning in both partners, and attending to this dimension is part of comprehensive care.</p>\n<h3>Effects on the Client's Sexuality</h3>\n<p>Compulsive patterns can shape and distort a person's sexuality in various ways: a reliance on particular stimuli or escalating novelty, a disconnection of sex from intimacy and relationship, and, in some cases, difficulty with partnered sexual functioning. Some clients experience difficulty with arousal or response in partnered sex relative to solitary compulsive behavior. Recovery frequently involves not only reducing the compulsive behavior but reintegrating sexuality into intimacy and rebuilding a satisfying partnered sexual life.</p>\n<h3>Effects on the Couple's Sexuality</h3>\n<p>The couple's sexual relationship is frequently affected — by the partner's distress and difficulty with sexual closeness after a betrayal, by the disruption of trust, and by the work of rebuilding. Renegotiating sexual intimacy at a pace both partners can manage, with attention to the partner's needs and autonomy, is part of the rebuilding process. As elsewhere, the clinician restores choice and control and proceeds at the couple's pace, and refers to or collaborates with sexual health expertise where the sexual difficulties exceed their competence.</p>"
        },
        {
          "type": "text",
          "order": 13,
          "content": "<h2>Special Populations and the Risk of Stigma</h2>\n<p>Work in this area requires particular attention to the populations who have historically been harmed by the pathologizing of sexuality, and to the role of stigma in presentation and care.</p>\n<h3>Sexual and Gender Minorities</h3>\n<p>Sexual and gender minority clients warrant particular care. The history of pathologizing LGBTQ+ sexuality means that affirming practice must be vigilant against mislabeling minority sexuality as compulsive. Minority stress, internalized stigma, and the conflict between identity and a non-affirming environment can produce distress and shame that may be misread as compulsivity. The clinician applies the same careful distinction — genuine loss of control and impairment versus value-based or stigma-driven distress — with heightened attention to the ways stigma can distort both the client's self-perception and the clinician's judgment.</p>\n<h3>Stigma and Help-Seeking</h3>\n<p>Across populations, stigma and shame shape who seeks help, what they disclose, and how they understand their own behavior. The clinician's non-judgmental, affirming, culturally humble stance is what makes honest engagement possible, and remains the foundation of competent care. Recognizing the role of stigma also guards against the clinician's own assumptions and protects clients from the harm of being pathologized for difference rather than helped for genuine impairment.</p>"
        },
        {
          "type": "text",
          "order": 14,
          "content": "<h2>Ethics and the Risk of Pathologizing</h2>\n<p>More than perhaps any other area of sexual health practice, work with compulsive sexual behavior carries a central ethical risk: the pathologizing of sexuality that is not actually disordered. Competent, ethical practice is organized around guarding against this risk.</p>\n<h3>The Central Ethical Tension</h3>\n<p>The clinician must hold two truths simultaneously: some clients genuinely experience impairing loss of control over sexual behavior and deserve effective, compassionate help; and the field has a long, harmful history of labeling normal sexual variation, high desire, and value-discordant behavior as pathology — disproportionately harming women, sexual minorities, and people whose sexuality differs from a dominant norm. Ethical practice neither dismisses genuine suffering nor manufactures disorder where there is only difference or moral conflict.</p>\n<h3>Practicing Ethically</h3>\n<p>This means applying diagnostic criteria carefully (including the moral-incongruence exclusion), maintaining a non-judgmental and non-moralizing stance, examining one's own sexual values so they do not become a clinical standard, setting goals collaboratively rather than imposing a standard of sexual conduct, and using approaches that reduce rather than amplify shame. It also means practicing within one's competence and referring complex presentations to clinicians with specialized training, and remaining humble about a contested and evolving area of knowledge. The clinician's guiding aim is the client's genuine wellbeing as the client defines it.</p>"
        },
        {
          "order": 15,
          "type": "multiSelect",
          "question": "Which are central ethical risks specific to working with compulsive sexual behavior? (Select all that apply)",
          "options": [
            {
              "text": "Pathologizing normative or minority sexuality as “compulsive”",
              "isCorrect": true
            },
            {
              "text": "Imposing the clinician’s moral judgments on the client",
              "isCorrect": true
            },
            {
              "text": "Reflexively diagnosing distress driven only by moral incongruence",
              "isCorrect": true
            },
            {
              "text": "Affirming the client’s autonomy and values",
              "isCorrect": false
            }
          ],
          "explanation": "The central ethical risks are pathologizing normal or minority sexuality, imposing moral judgments, and over-diagnosing moral-incongruence distress — not respecting the client’s autonomy, which is appropriate."
        },
        {
          "type": "text",
          "order": 31,
          "content": "<h2>Sustaining Practice and Course Summary</h2>\n<p>This course has provided a foundation for understanding and treating compulsive sexual behavior and the intimacy difficulties so often associated with it. Several principles unify the material.</p>\n<p>First, compulsive sexual behavior is defined by genuine loss of control and impairment, not by the frequency or content of sexual behavior, and the ICD-11 framing of CSBD as an impulse-control disorder — distinct from the contested addiction model — orients responsible practice. Second, careful assessment must distinguish genuine compulsivity from normative high desire and, crucially, from moral incongruence, guarding against the pathologizing of sexuality that the field's history demands vigilance against. Third, shame both drives and results from compulsive sexual behavior, so non-shaming, function-focused, evidence-informed treatment — drawing on CBT, ACT, mindfulness, motivational, and relapse-prevention approaches — is essential. Fourth, intimacy difficulties and attachment patterns frequently underlie the behavior, and addressing them, along with co-occurring conditions and the impact on partners and relationships, is often central to lasting change.</p>\n<p>And finally, this is an area that demands ongoing humility, self-examination, and development. The clinician sustains competent practice through consultation and supervision, continued learning in an evolving field, attention to their own values and reactions, and a steady commitment to the client's genuine wellbeing over any imposed standard. The clinician who carries these principles forward can offer real help to clients who are suffering, while protecting against the harm of pathologizing what is simply human.</p>"
        },
        {
          "type": "reflection",
          "order": 32,
          "prompt": "After this course, what is one change you will make to how you assess or treat compulsive sexual behavior — and how will you guard against the risk of pathologizing sexuality that is not disordered?",
          "placeholder": "Reflect on your clinical practice..."
        },
        {
          "type": "text",
          "content": "<h2>Adolescents and Developmental Considerations</h2>\n<p>Work with adolescents around sexual behavior requires particular developmental sensitivity and even greater caution about pathologizing, given the normal upheavals of adolescent sexual development.</p>\n<h3>Normal Development Versus Genuine Concern</h3>\n<p>Adolescence involves emerging sexuality, exploration, curiosity, and the use of online sexual content — much of which is a normal part of development rather than a disorder. The threshold for considering a sexual behavior genuinely problematic in an adolescent is high and must account for developmental norms; behavior that would be unremarkable is too easily mislabeled when viewed through an anxious or moralizing lens. At the same time, genuine difficulties — including behavior driven by trauma, used compulsively to manage distress, or causing real impairment — do occur and deserve careful, developmentally appropriate help.</p>\n<h3>The Clinical Approach</h3>\n<p>Work with adolescents attends to developmental stage, involves the family and care system appropriately while protecting the adolescent's appropriate confidentiality, and remains especially vigilant against pathologizing normal sexual development. As with adults, a non-judgmental, function-focused stance — and careful attention to any underlying trauma, distress, or co-occurring difficulty — guides assessment and treatment. The clinician also remains alert to safety and to the possibility that an adolescent's sexual behavior reflects victimization or risk requiring protective response.</p>",
          "order": 18
        },
        {
          "type": "text",
          "content": "<h2>Telehealth in Treating Compulsive Sexual Behavior</h2>\n<p>Treatment of compulsive sexual behavior translates to telehealth, which can expand access while raising specific considerations.</p>\n<h3>Opportunities and Safeguards</h3>\n<p>For many clients, the privacy and reduced stigma of engaging from home lower the barrier to seeking help for a concern surrounded by shame. The clinician confirms the client is in a private space where they can speak freely, attends to the reduced access to nonverbal cues, and maintains the same non-judgmental, function-focused approach. Where couples work is involved, the clinician manages the particular dynamics of having both partners present remotely, including attention to safety and to each partner's ability to speak freely.</p>\n<h3>Maintaining Standards</h3>\n<p>The core principles — careful assessment, non-shaming stance, evidence-informed treatment, attention to co-occurring conditions and intimacy difficulties — apply identically in telehealth. The clinician adapts implementation to the medium while preserving the quality and the ethical care that work in this sensitive area requires.</p>",
          "order": 19
        },
        {
          "type": "text",
          "content": "<h2>Documentation, Confidentiality, and Legal Awareness</h2>\n<p>The sensitive and sometimes legally relevant nature of sexual behavior makes thoughtful documentation and confidentiality especially important in this area.</p>\n<h3>Documentation</h3>\n<p>The clinician documents factually and professionally — the clinical picture, assessment, formulation, and plan — without unnecessary graphic detail, distinguishing the client's report from clinical observation. Given that sexual behavior can intersect with legal matters and with relationship disputes, the clinician is mindful that records may in some circumstances be accessed, and documents accurately and discreetly in a way that serves the client's care while protecting privacy.</p>\n<h3>Confidentiality and Its Limits</h3>\n<p>Clients need to understand both the confidentiality of the work and its limits, including mandated-reporting obligations that vary by jurisdiction. This is particularly salient if any disclosed behavior involves non-consensual conduct, minors, or other reportable matters — which, as noted, raise separate clinical, ethical, and legal frameworks distinct from CSBD itself. In couples work, the clinician clarifies in advance how individually shared information will be handled. Clarity about these matters protects the client, the partner where relevant, and the integrity of the work.</p>",
          "order": 20
        },
        {
          "order": 21,
          "type": "multiSelect",
          "question": "In assessing possible compulsive sexual behavior in an adolescent, the clinician should: (Select all that apply)",
          "options": [
            {
              "text": "Account for normative adolescent sexual development",
              "isCorrect": true
            },
            {
              "text": "Be cautious about pathologizing developmentally typical behavior",
              "isCorrect": true
            },
            {
              "text": "Apply adult CSBD criteria directly without developmental context",
              "isCorrect": false
            },
            {
              "text": "Attend to safety, exploitation risk, and access to age-appropriate education",
              "isCorrect": true
            }
          ],
          "explanation": "Adolescent assessment requires developmental context and caution against pathologizing typical behavior, while attending to genuine safety and exploitation concerns — not direct application of adult criteria."
        },
        {
          "type": "text",
          "content": "<h2>The Clinician's Self-Care and Values</h2>\n<p>Working with compulsive sexual behavior places particular demands on the clinician, both emotionally and in terms of the self-examination the work requires.</p>\n<h3>Examining One's Own Values</h3>\n<p>Because this area is so saturated with cultural and moral judgment, clinicians must examine their own sexual values, reactions, and assumptions with particular rigor. A clinician who has not done this work is at risk of subtly moralizing, of mislabeling difference or value-discordant behavior as pathology, or of communicating judgment that deepens client shame. Ongoing values-clarification, supported by consultation, is essential to providing the non-judgmental care this work requires, and recognizing when one's own values prevent affirming care for a particular client — and referring accordingly — is part of ethical practice.</p>\n<h3>Sustaining Oneself</h3>\n<p>The work also exposes clinicians to intense material — clients' shame and distress, the impact of betrayal on partners, and emotionally demanding couples work. Clinicians sustain themselves through consultation and supervision (for both clinical guidance and emotional support), manageable caseloads, attention to their own wellbeing and boundaries, and ongoing learning in an evolving field. A depleted or unexamined clinician cannot provide the steady, non-judgmental presence this work requires.</p>",
          "order": 22
        },
        {
          "type": "text",
          "content": "<h2>Coordinating Care and Building Referral Networks</h2>\n<p>Comprehensive care for compulsive sexual behavior frequently involves multiple providers, and the clinician's ability to coordinate care and refer well strengthens treatment.</p>\n<h3>The Interdisciplinary Picture</h3>\n<p>A given client may benefit from individual therapy, couples work, treatment of co-occurring conditions, psychiatric consultation for medication, partner support, and — for some — peer support or group treatment. The clinician helps integrate these elements, communicating with other providers (with appropriate consent) and helping the client make sense of a coordinated plan rather than a set of disconnected interventions.</p>\n<h3>Building the Network</h3>\n<p>Clinicians benefit from knowing the resources in their community and field: clinicians with specialized training in compulsive sexual behavior, trauma specialists, prescribers, affirming providers for sexual and gender minority clients, sexual health and couples specialists, and reputable support resources for clients and partners. A ready, vetted referral network allows the clinician to ensure each dimension of a client's situation is addressed by someone competent, and to refer well when a presentation exceeds their own scope.</p>",
          "order": 23
        },
        {
          "type": "text",
          "content": "<h2>Supporting Clients and Partners With Resources</h2>\n<p>Beyond direct treatment, clinicians help clients and partners by connecting them with appropriate resources, chosen with the same care that governs the rest of the work.</p>\n<h3>Choosing Resources Wisely</h3>\n<p>A range of books, programs, online resources, and support communities exists in this area, of widely varying quality and orientation. Some are evidence-informed and non-shaming; others are built on the contested addiction model or carry moralizing, shame-based messages that may be counterproductive. The clinician helps clients and partners evaluate resources, steering them toward those consistent with an evidence-informed, non-judgmental approach and away from those that may deepen shame or impose a false framework.</p>\n<h3>Resources for Partners</h3>\n<p>Partners, in particular, benefit from resources and support tailored to their own experience and needs — recognizing them as people affected by another's behavior who deserve their own support, rather than positioning them within frameworks that assign them responsibility for it. Connecting partners with appropriate individual support is frequently among the most valuable things the clinician can do for the couple as a whole.</p>",
          "order": 24
        },
        {
          "type": "text",
          "content": "<h2>When to Refer to a Specialist</h2>\n<p>Recognizing the limits of one's competence and referring well is a core part of ethical practice in this area, as in all sexual health work.</p>\n<h3>Indicators for Referral</h3>\n<p>A presentation may exceed general competence when the compulsive behavior is severe, entrenched, or unresponsive to foundational intervention; when significant co-occurring conditions require specialized treatment; when substantial trauma underlies the pattern and calls for specialized trauma care; when couples work requires skills beyond the clinician's training; when the presentation involves complex intimacy and attachment difficulties needing in-depth relational work; or when any disclosed behavior is non-consensual or illegal and raises distinct clinical, ethical, and legal frameworks. In each case, referral to or collaboration with an appropriately trained specialist serves the client.</p>\n<h3>Referral as Good Care</h3>\n<p>Referral is an act of competent, ethical care rather than a failure, and it need not mean withdrawal: the generalist frequently continues to provide a supportive relationship alongside specialized treatment, and serves as the integrating presence across providers. Knowing one's scope, building a referral network, and referring well ensure that each client's needs are met by someone competent to meet them.</p>",
          "order": 25
        },
        {
          "type": "text",
          "content": "<h2>Hope, Recovery, and the Possibility of Change</h2>\n<p>Amid the careful attention to diagnosis, controversy, and the avoidance of harm, it is important to hold a realistic and grounded hope: clients who genuinely struggle with compulsive sexual behavior can and do improve.</p>\n<h3>Change Is Possible</h3>\n<p>With treatment that addresses the underlying functions, the co-occurring conditions, the shame, and the intimacy difficulties — and that sets collaborative, values-consistent goals — many clients regain a sense of control, reduce distress, align their behavior with their values, and build healthier relationships and more genuine intimacy. The path is frequently non-linear, with lapses along the way, but improvement is the common outcome of good treatment rather than the exception.</p>\n<h3>The Clinician's Hopeful Realism</h3>\n<p>The clinician holds this hope realistically: neither minimizing the genuine difficulty of change nor falling into pessimism, and neither promising outcomes nor doubting that improvement is possible. Communicating grounded hope — that the client's situation is understandable and workable, and that change is achievable — counters the despair and shame that clients so often carry, and supports the engagement and persistence that recovery requires.</p>",
          "order": 26
        },
        {
          "type": "text",
          "content": "<h2>Key Takeaways for Practice</h2>\n<p>Several practical takeaways distill this course into principles the clinician can carry into the next session with a client struggling with sexual behavior.</p>\n<h3>What to Remember</h3>\n<p>Assess carefully and distinguish genuine compulsivity from high desire and from moral incongruence before applying any disorder label. Lead with a non-judgmental, non-shaming stance, recognizing that shame fuels rather than resolves the pattern. Understand the behavior's function — what states it manages and needs it meets — and build other ways to meet those needs. Set goals collaboratively, oriented to the client's values rather than to an imposed standard, and do not assume abstinence is the aim. Address co-occurring conditions and the intimacy and attachment difficulties that frequently underlie the behavior. Support partners as people affected in their own right. And guard, always, against the field's persistent risk of pathologizing sexuality that is not actually disordered.</p>\n<h3>The Underlying Commitment</h3>\n<p>Beneath all of these is a single commitment: to the client's genuine wellbeing as the client defines it, pursued with humility in a contested and evolving area, and with steady vigilance against causing the very harm the history of this field cautions against. The clinician who holds this commitment offers real help to people who are suffering while honoring the diversity and dignity of human sexuality.</p>",
          "order": 27
        }
      ]
    }
  ]
};

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }
async function main(){
  await mongoose.connect(MONGODB_URI); console.log('Connected.');
  const doc = await Course.findOne({ slug: COURSE_DATA.slug });
  if(!doc){ console.error('CR-307 not found:', COURSE_DATA.slug); process.exit(1); }
  for(const k of Object.keys(COURSE_DATA)) doc[k]=COURSE_DATA[k];
  doc.modules=undefined; doc.markModified('sections'); doc.markModified('assessment');
  await doc.save();
  const fresh=await Course.findById(doc._id).lean();
  console.log('Saved. Sections:',fresh.sections?.length,'| wordCount:',fresh.wordCount,'| accessType:',fresh.accessType,'| status:',fresh.status);
  await mongoose.disconnect(); console.log('Done.');
}
main().catch(e=>{console.error('ERROR:',e.message);process.exit(1);});
