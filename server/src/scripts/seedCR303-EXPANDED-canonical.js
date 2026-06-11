/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 */
import mongoose from 'mongoose';
import { Course } from '../models/InteractiveCourse.js';
import 'dotenv/config';

// CR-303 EXPANDED — canonical sections[] shape. Saves through the real model so the
// pre-save wordCount hook fires (no modules->sections conversion needed).

const COURSE_DATA = {
  "title": "Sexual Health Across the Lifespan: Assessment and Evidence-Based Clinical Practice",
  "slug": "sexual-health-across-the-lifespan",
  "courseCode": "CR-303",
  "description": "A comprehensive 3-hour continuing education course for licensed mental health professionals. Meets NBCC ACEP standards with graduate-level clinical content on sexual health assessment and affirming, evidence-based practice across the lifespan.",
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
    "Licensed mental health professionals including LPCs, LCSWs, LMFTs, psychologists, NCCs, and psychiatric NPs who address sexual health concerns across the lifespan in clinical practice."
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
    "Apply a biopsychosocial framework to sexual health assessment across childhood, adolescence, adulthood, and later life.",
    "Identify normative sexual development milestones and distinguish them from clinical concerns requiring assessment or mandated reporting.",
    "Implement evidence-based, affirming approaches to sexual health clinical conversations across diverse client populations.",
    "Recognize and respond clinically to sexual health concerns presenting in the context of chronic illness, disability, and aging.",
    "Apply cultural humility in sexual health clinical practice with LGBTQ+ clients and clients from diverse cultural backgrounds.",
    "Utilize validated assessment tools and referral pathways for sexual health concerns requiring specialist intervention."
  ],
  "assessment": {
    "isExam": true,
    "passingScore": 80,
    "maxAttempts": 3,
    "showExplanations": false,
    "questions": [
      {
        "question": "The biopsychosocial model of sexual health understands sexual functioning as:",
        "type": "multipleChoice",
        "options": [
          {
            "text": "Primarily determined by biological factors",
            "isCorrect": false
          },
          {
            "text": "The product of interacting biological, psychological, and sociocultural factors",
            "isCorrect": true
          },
          {
            "text": "Primarily a psychological phenomenon",
            "isCorrect": false
          },
          {
            "text": "Fixed across the lifespan unless disrupted by illness",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "The biopsychosocial model integrates all three domains; no single factor is sufficient."
      },
      {
        "question": "The WHO definition of sexual health is significant for clinical practice because it:",
        "type": "multipleChoice",
        "options": [
          {
            "text": "Defines sexual health solely as the absence of disease",
            "isCorrect": false
          },
          {
            "text": "Frames sexual health positively, including pleasure, safety, respect, and self-determination",
            "isCorrect": true
          },
          {
            "text": "Applies only to reproductive-age adults",
            "isCorrect": false
          },
          {
            "text": "Excludes emotional and social dimensions",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "The WHO definition is positive and integrative rather than deficit-based."
      },
      {
        "question": "In the PLISSIT model, providing accurate information that corrects a sexual myth corresponds to which level?",
        "type": "multipleChoice",
        "options": [
          {
            "text": "Permission",
            "isCorrect": false
          },
          {
            "text": "Limited Information",
            "isCorrect": true
          },
          {
            "text": "Specific Suggestions",
            "isCorrect": false
          },
          {
            "text": "Intensive Therapy",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "Correcting myths with accurate, targeted information is the Limited Information level."
      },
      {
        "question": "Which best describes responsive desire as described by Basson?",
        "type": "multipleChoice",
        "options": [
          {
            "text": "Desire that always precedes arousal",
            "isCorrect": false
          },
          {
            "text": "Desire that emerges in response to arousal and emotional intimacy",
            "isCorrect": true
          },
          {
            "text": "A disorder of low desire",
            "isCorrect": false
          },
          {
            "text": "Desire experienced only by men",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "Responsive desire emerges in response to arousal and intimacy and is a normal pattern for many people."
      },
      {
        "question": "Sexual behavior in a young child that is compulsive, non-redirectable, and accompanied by fear or aggression should be understood as:",
        "type": "multipleChoice",
        "options": [
          {
            "text": "Developmentally normative",
            "isCorrect": false
          },
          {
            "text": "Outside the normative range, warranting careful assessment",
            "isCorrect": true
          },
          {
            "text": "Proof that abuse has occurred",
            "isCorrect": false
          },
          {
            "text": "Clinically irrelevant",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "These features fall outside the normative range and warrant assessment, though they are not by themselves proof of abuse."
      },
      {
        "question": "The threshold for mandated reporting of suspected child abuse is:",
        "type": "multipleChoice",
        "options": [
          {
            "text": "Proof that abuse occurred",
            "isCorrect": false
          },
          {
            "text": "Reasonable suspicion",
            "isCorrect": true
          },
          {
            "text": "A disclosure by the child",
            "isCorrect": false
          },
          {
            "text": "Confirmation by another professional",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "Mandated reporting is triggered by reasonable suspicion; investigators, not clinicians, determine whether abuse occurred."
      },
      {
        "question": "Arousal non-concordance refers to:",
        "type": "multipleChoice",
        "options": [
          {
            "text": "The alignment of genital and subjective arousal",
            "isCorrect": false
          },
          {
            "text": "The common finding that genital response and subjective arousal do not always match",
            "isCorrect": true
          },
          {
            "text": "A paraphilic disorder",
            "isCorrect": false
          },
          {
            "text": "A medication side effect",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "Non-concordance is the well-documented finding that genital and subjective arousal are not always aligned."
      },
      {
        "question": "The dual control model conceptualizes sexual response as:",
        "type": "multipleChoice",
        "options": [
          {
            "text": "A purely hormonal process",
            "isCorrect": false
          },
          {
            "text": "The balance between sexual excitation and sexual inhibition",
            "isCorrect": true
          },
          {
            "text": "A fixed four-stage cycle",
            "isCorrect": false
          },
          {
            "text": "Determined entirely by relationship satisfaction",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "The dual control model frames response as the balance of excitation (accelerator) and inhibition (brakes)."
      },
      {
        "question": "Cultural humility in sexual health practice is best described as:",
        "type": "multipleChoice",
        "options": [
          {
            "text": "Achieving expertise in every culture's sexual norms",
            "isCorrect": false
          },
          {
            "text": "A stance of lifelong self-examination and openness to the client as expert on their own experience",
            "isCorrect": true
          },
          {
            "text": "Applying mainstream norms consistently",
            "isCorrect": false
          },
          {
            "text": "Avoiding discussion of culture entirely",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "Cultural humility emphasizes self-examination and client expertise rather than achieved competence."
      },
      {
        "question": "Meyer's minority stress model attributes elevated distress in sexual and gender minority populations to:",
        "type": "multipleChoice",
        "options": [
          {
            "text": "Inherent features of minority identity",
            "isCorrect": false
          },
          {
            "text": "Chronic exposure to stigma, discrimination, and internalized negative messages",
            "isCorrect": true
          },
          {
            "text": "Genetic vulnerability",
            "isCorrect": false
          },
          {
            "text": "Lack of access to medication",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "Minority stress locates elevated distress in stigma and discrimination, not in the identity itself."
      },
      {
        "question": "Regarding sexual activity after a cardiac event, clinicians should generally:",
        "type": "multipleChoice",
        "options": [
          {
            "text": "Advise permanent avoidance of sexual activity",
            "isCorrect": false
          },
          {
            "text": "Use risk-stratification guidance (e.g., Princeton Consensus); for most stable patients, activity is safe and reassurance is itself an intervention",
            "isCorrect": true
          },
          {
            "text": "Defer entirely to the patient with no guidance",
            "isCorrect": false
          },
          {
            "text": "Assume sexual activity is always dangerous",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "Princeton Consensus guidance supports the safety of sexual activity for most stable cardiac patients; reassurance is an intervention."
      },
      {
        "question": "Genitourinary syndrome of menopause (GSM) is best understood as:",
        "type": "multipleChoice",
        "options": [
          {
            "text": "An untreatable, inevitable end to sexual life",
            "isCorrect": false
          },
          {
            "text": "A normal and frequently treatable set of changes including dryness and tissue thinning",
            "isCorrect": true
          },
          {
            "text": "A psychiatric disorder",
            "isCorrect": false
          },
          {
            "text": "A sign of abuse",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "GSM is normal and responds well to medical management; naming it is the first step toward treatment."
      },
      {
        "question": "The social model of disability reframes the clinical goal as:",
        "type": "multipleChoice",
        "options": [
          {
            "text": "Fixing bodies that do not conform to a norm",
            "isCorrect": false
          },
          {
            "text": "Removing the social and environmental barriers to sexual expression",
            "isCorrect": true
          },
          {
            "text": "Discouraging sexual activity",
            "isCorrect": false
          },
          {
            "text": "Limiting care to medical providers",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "The social model targets barriers rather than 'fixing' nonconforming bodies."
      },
      {
        "question": "SSRIs commonly affect sexual function by:",
        "type": "multipleChoice",
        "options": [
          {
            "text": "Increasing desire in all users",
            "isCorrect": false
          },
          {
            "text": "Causing reduced desire, delayed or absent orgasm, and arousal difficulty, contributing to nonadherence",
            "isCorrect": true
          },
          {
            "text": "Having no effect on sexual function",
            "isCorrect": false
          },
          {
            "text": "Affecting only older adults",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "SSRI sexual side effects are common and a leading, often undetected, cause of nonadherence."
      },
      {
        "question": "A generalist clinician's appropriate response to entrenched sexual dysfunction beyond their competence is to:",
        "type": "multipleChoice",
        "options": [
          {
            "text": "Attempt intensive sex therapy regardless of training",
            "isCorrect": false
          },
          {
            "text": "Refer to an appropriately trained or AASECT-certified clinician while continuing to provide permission and support",
            "isCorrect": true
          },
          {
            "text": "Avoid the topic",
            "isCorrect": false
          },
          {
            "text": "Tell the client nothing can be done",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "Practicing within competence and referring appropriately is an ethical requirement under ACA/NBCC codes."
      },
      {
        "question": "Sex assigned at birth, gender identity, gender expression, and sexual orientation are best understood as:",
        "type": "multipleChoice",
        "options": [
          {
            "text": "Interchangeable terms for the same construct",
            "isCorrect": false
          },
          {
            "text": "Independent dimensions, none of which can be inferred from another",
            "isCorrect": true
          },
          {
            "text": "Determined entirely by anatomy",
            "isCorrect": false
          },
          {
            "text": "Relevant only when working with LGBTQ+ clients",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "These are distinct, independent dimensions; affirming practice requires asking rather than inferring one from another."
      },
      {
        "question": "The most common sexual concern brought to couples therapy is:",
        "type": "multipleChoice",
        "options": [
          {
            "text": "Erectile disorder",
            "isCorrect": false
          },
          {
            "text": "Desire discrepancy between partners",
            "isCorrect": true
          },
          {
            "text": "Genito-pelvic pain",
            "isCorrect": false
          },
          {
            "text": "Premature ejaculation",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "Desire discrepancy — a difference between partners rather than a dysfunction in either — is the most frequent couple presentation, and reframing it is itself an intervention."
      },
      {
        "question": "Common postpartum sexual changes (reduced desire, vaginal dryness) are best addressed by the clinician by:",
        "type": "multipleChoice",
        "options": [
          {
            "text": "Treating them as a sign of relationship failure",
            "isCorrect": false
          },
          {
            "text": "Normalizing them as common and often temporary and giving couples permission to communicate about them",
            "isCorrect": true
          },
          {
            "text": "Ignoring them as outside mental health scope",
            "isCorrect": false
          },
          {
            "text": "Advising indefinite abstinence",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "Normalizing common, often temporary perinatal changes and opening communication prevents a normal transition from becoming a lasting rupture."
      },
      {
        "question": "Capacity to consent to sexual activity in a resident with dementia is best understood as:",
        "type": "multipleChoice",
        "options": [
          {
            "text": "Automatically absent once dementia is diagnosed",
            "isCorrect": false
          },
          {
            "text": "An all-or-nothing status conferred by diagnosis",
            "isCorrect": false
          },
          {
            "text": "Decision-specific and potentially fluctuating, requiring individualized assessment",
            "isCorrect": true
          },
          {
            "text": "Irrelevant in long-term care settings",
            "isCorrect": false
          }
        ],
        "correctAnswer": 2,
        "explanation": "Capacity is decision-specific and can fluctuate; it is assessed individually rather than presumed absent from a diagnosis."
      },
      {
        "question": "When a client discloses a consensually non-monogamous relationship, affirming practice requires the clinician to:",
        "type": "multipleChoice",
        "options": [
          {
            "text": "Treat the structure itself as the clinical problem",
            "isCorrect": false
          },
          {
            "text": "Distinguish the relationship structure (not the clinician's to judge) from any genuine distress or coercion within it",
            "isCorrect": true
          },
          {
            "text": "Assume the relationship is dysfunctional",
            "isCorrect": false
          },
          {
            "text": "Refer the client out for having an unconventional relationship",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "Consensual non-monogamy is a relationship choice, not a disorder; the clinician supports the client within their structure while attending to genuine distress or coercion."
      },
      {
        "question": "A client presents for depression and, on routine inquiry, reveals an unaddressed sexual difficulty contributing to their mood. This illustrates that:",
        "type": "multipleChoice",
        "options": [
          {
            "text": "Sexual concerns are rare and rarely relevant to other presentations",
            "isCorrect": false
          },
          {
            "text": "Sexual concerns frequently hide behind other presenting problems, so routine inquiry is needed to bring them into view",
            "isCorrect": true
          },
          {
            "text": "Depression should never be treated alongside sexual concerns",
            "isCorrect": false
          },
          {
            "text": "Clinicians should wait for clients to raise sexual concerns themselves",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "Sexual concerns often surface only indirectly behind other complaints; routine, normalized inquiry is what makes the hidden sexual dimension visible and addressable."
      },
      {
        "question": "A client expresses shame about a recurring sexual fantasy. The most accurate clinical framework is that:",
        "type": "multipleChoice",
        "options": [
          {
            "text": "The content of a fantasy reliably predicts a desire to act on it",
            "isCorrect": false
          },
          {
            "text": "Fantasy is common and normal; clinical focus belongs on distress and on consent/harm in any acted-upon behavior, not on the content of private imagination",
            "isCorrect": true
          },
          {
            "text": "Unusual fantasies indicate pathology requiring elimination",
            "isCorrect": false
          },
          {
            "text": "Fantasy should always be interpreted as a hidden relationship problem",
            "isCorrect": false
          }
        ],
        "correctAnswer": 1,
        "explanation": "Fantasy is near-universal and is not a plan; the clinician distinguishes private fantasy from behavior, focusing on distress and on consent/harm rather than on fantasy content."
      },
      {
        "type": "trueFalse",
        "question": "Responsive desire — desire that arises after arousal and intimacy begin — is a normal pattern rather than evidence of a sexual disorder.",
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
        "explanation": "Responsive desire is normal and common, especially in long-term relationships; treating spontaneous desire as the only valid form can wrongly pathologize it."
      },
      {
        "type": "trueFalse",
        "question": "A situational sexual difficulty — present in one context but not another — points more strongly toward physiological causes than psychological or relational ones.",
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
        "explanation": "A situational pattern points toward psychological, relational, or contextual contributors; a generalized, consistent difficulty raises the relative likelihood of a physiological cause."
      },
      {
        "type": "trueFalse",
        "question": "Consensual non-monogamy is a recognized relationship structure rather than a disorder to be treated.",
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
        "explanation": "Consensual non-monogamy is a relationship choice; affirming practice assesses it on the client’s terms rather than pathologizing the structure."
      },
      {
        "type": "multiSelect",
        "question": "Which factors belong in a biopsychosocial formulation of a sexual concern? (Select all that apply)",
        "options": [
          {
            "text": "Biological/medical contributors (conditions, medications, hormones)",
            "isCorrect": true
          },
          {
            "text": "Psychological factors (anxiety, beliefs, trauma, mood)",
            "isCorrect": true
          },
          {
            "text": "Relational and sociocultural context",
            "isCorrect": true
          },
          {
            "text": "Only the presenting physical symptom in isolation",
            "isCorrect": false
          }
        ],
        "explanation": "A biopsychosocial formulation integrates biological, psychological, and social/relational factors rather than reducing the concern to one cause."
      },
      {
        "type": "multiSelect",
        "question": "Which are appropriate generalist actions when sexual material arises unexpectedly in session? (Select all that apply)",
        "options": [
          {
            "text": "Respond calmly and without surprise",
            "isCorrect": true
          },
          {
            "text": "Give permission to discuss it",
            "isCorrect": true
          },
          {
            "text": "Maintain professional boundaries and manage countertransference",
            "isCorrect": true
          },
          {
            "text": "Change the subject to avoid discomfort",
            "isCorrect": false
          }
        ],
        "explanation": "A calm, permission-giving response that maintains boundaries is appropriate; avoiding the material signals it is unwelcome and replicates the silence many clients already experience."
      }
    ]
  },
  "sections": [
    {
      "title": "Module 1: Foundations — The Biopsychosocial and Lifespan Framework",
      "order": 1,
      "estimatedTime": 20,
      "contentBlocks": [
        {
          "type": "sectionDivider",
          "order": 0,
          "sectionNumber": 1,
          "title": "Module 1",
          "subtitle": "Module 1: Foundations — The Biopsychosocial and Lifespan Framework"
        },
        {
          "type": "text",
          "order": 1,
          "content": "<h2>Why Sexual Health Belongs in Every Clinician's Scope</h2>\n<p>Sexual health is a fundamental dimension of human wellbeing that mental health professionals encounter across every clinical setting, yet it remains one of the most consistently undertreated dimensions of practice. The reasons are well documented: graduate training programs devote little or no curriculum to human sexuality; clinicians report discomfort and a fear of saying the wrong thing; and clients, anticipating judgment, rarely raise sexual concerns unprompted. The result is a clinical silence that leaves a large share of clients' distress unaddressed.</p>\n<p>The World Health Organization (2006) defines sexual health as \"a state of physical, emotional, mental, and social wellbeing in relation to sexuality; it is not merely the absence of disease, dysfunction, or infirmity.\" This definition has two clinically important features. First, it is positive rather than deficit-based: sexual health includes the presence of pleasure, safety, respect, and self-determination, not simply the absence of dysfunction. Second, it is integrative: it locates sexuality at the intersection of body, mind, relationship, and culture. A clinician who treats sexual concerns as purely medical, or purely psychological, will miss most of what is actually happening.</p>\n<p>This course takes the position that sexual health assessment is a general clinical competency, not a specialty reserved for certified sex therapists. The generalist clinician is not expected to provide specialized sex therapy. They are expected to be able to raise the topic without flinching, screen competently, recognize what is within their scope, and refer appropriately when it is not. That competency is what this course develops.</p>\n<h3>The Cost of Clinical Silence</h3>\n<p>When clinicians do not ask about sexual health, several predictable harms follow. Treatable conditions go untreated because they are never named. Medication side effects that drive nonadherence go undetected. Survivors of sexual trauma infer that the topic is unspeakable. And clients from marginalized groups, who already experience the healthcare system as unsafe, have that experience confirmed. The decision not to ask is not neutral; it is a clinical choice with consequences.</p>"
        },
        {
          "type": "text",
          "order": 2,
          "content": "<h2>The Biopsychosocial Model</h2>\n<p>The {{callout:biopsychosocial}} is the integrative framework that has replaced single-factor explanations of sexual functioning. It understands every sexual presentation as the product of the dynamic interaction of three domains, no one of which is sufficient on its own.</p>\n<h3>Biological Factors</h3>\n<p>Biological contributors include hormonal status (estrogen, testosterone, prolactin, thyroid function), vascular health (erectile and genital arousal depend on intact blood flow), neurological function, and — very commonly — medication effects. Antidepressants, antihypertensives, antipsychotics, hormonal contraceptives, and many other agents alter desire, arousal, and orgasm. Chronic illnesses such as diabetes, cardiovascular disease, and multiple sclerosis exert direct effects on sexual function. The clinician does not need to be a physician to recognize that a new sexual complaint coinciding with a new medication or diagnosis warrants medical consultation.</p>\n<h3>Psychological Factors</h3>\n<p>Psychological contributors include cognitive patterns (performance anxiety, spectatoring, catastrophic interpretation of normal variation), emotional regulation, attachment style, body image, sexual self-concept, and the residue of prior experience including trauma. Depression and anxiety both suppress and are suppressed by sexual difficulty, creating bidirectional loops that maintain distress.</p>\n<h3>Sociocultural Factors</h3>\n<p>Sociocultural contributors include cultural sexual scripts, gender-role expectations, religious and moral frameworks, relationship context, and the broader social messages a person has absorbed about what sex is supposed to be. A \"dysfunction\" in one cultural frame may be unremarkable in another; the clinician's task is to understand the meaning the client makes of their experience, not to impose a normative standard.</p>\n<p>Clinical formulation that attends to all three domains is substantially more useful than any single-factor account, because it generates a treatment plan with multiple points of entry. A man presenting with erectile difficulty may need a medical workup (biological), cognitive work on performance anxiety (psychological), and a conversation about relationship conflict and cultural expectations of male performance (social) — and addressing only one will usually fail.</p>",
          "callouts": {
            "biopsychosocial": {
              "label": "Biopsychosocial Model",
              "type": "reference",
              "body": "A framework understanding sexual function and concerns as the product of interacting biological, psychological, and social/relational factors."
            }
          }
        },
        {
          "type": "text",
          "order": 3,
          "content": "<h2>The Lifespan Developmental Framework</h2>\n<p>Sexuality is not a static adult attribute that switches on at puberty and off in old age. It is a developmental process that begins in infancy and continues through the end of life, with characteristic concerns, normative milestones, and specific clinical considerations at each stage.</p>\n<h3>Infancy and Early Childhood</h3>\n<p>Genital sensation and self-stimulation are present from infancy and are a developmentally expected component of bodily self-discovery. Early childhood (roughly ages 3–7) brings curiosity about bodies, genital exploration, \"playing doctor\" with same-age peers, and beginning gender awareness. The clinician's role here is largely educational with caregivers: distinguishing developmentally normative curiosity from the small subset of behaviors that warrant assessment, and coaching caregivers away from shaming responses that teach children their bodies are dangerous.</p>\n<h3>Middle Childhood</h3>\n<p>Middle childhood involves the internalization of cultural messages about sexuality and gender, increasing privacy, and the consolidation of gender identity. Sexual curiosity continues but typically becomes more private as children absorb social norms.</p>\n<h3>Adolescence</h3>\n<p>Adolescence integrates physical sexual maturation, sexual and gender identity development, and the beginning of partnered sexual experience. It is simultaneously one of the most powerful periods in sexual development and one of the most clinically sensitive, because it sits at the intersection of normal development, risk (unintended pregnancy, sexually transmitted infection, coercion), and the legal and ethical complexities of working with minors.</p>\n<h3>Adulthood and Later Life</h3>\n<p>Adult sexuality must accommodate partnership, parenthood, the demands of work and caregiving, and the physical changes of midlife. Later life brings physiological change — but, contrary to a pervasive cultural myth, sexual interest and activity persist well into old age for many people. Treating older adults as asexual is both inaccurate and a barrier to care, a point developed in Module 3.</p>"
        },
        {
          "type": "reflection",
          "order": 4,
          "prompt": "Think about your own clinical intake process. At what point, if ever, do you currently ask about sexual health? What has stopped you from asking earlier or more routinely?",
          "placeholder": "Reflect on your current practice..."
        },
        {
          "type": "text",
          "order": 5,
          "content": "<h2>The Clinical Conversation: Permission and the PLISSIT Model</h2>\n<p>The single most foundational skill in sexual health practice is <strong>permission-giving</strong>: the explicit, matter-of-fact communication that sexual health concerns are appropriate clinical topics, that the clinician is comfortable discussing them, and that the client's experiences are not inherently pathological. Permission is enacted by asking directly rather than waiting for the client to raise the subject, by tolerating the topic without visible discomfort, and by responding non-judgmentally to whatever is disclosed.</p>\n<h3>The {{callout:plissit}} Model</h3>\n<p>Annon's (1976) PLISSIT model remains the most widely used framework for organizing sexual health intervention by intensity, and it maps cleanly onto scope of practice:</p>\n<ul>\n<li><strong>P — Permission</strong>: normalizing the topic and inviting disclosure. Every clinician can and should operate at this level.</li>\n<li><strong>LI — Limited Information</strong>: providing accurate, targeted information that corrects myths and reduces distress (for example, that {{callout:responsive-desire}} is normal, or that medication side effects are common and manageable).</li>\n<li><strong>SS — Specific Suggestions</strong>: offering concrete behavioral strategies tailored to the presenting concern. This level requires some additional competence.</li>\n<li><strong>IT — Intensive Therapy</strong>: specialized treatment for entrenched concerns, typically the province of a certified sex therapist or appropriately trained clinician.</li>\n</ul>\n<p>Taylor and Davis (2006) proposed the <strong>Ex-PLISSIT</strong> revision, which makes permission the explicit foundation of every level and builds in reflection and review, addressing the tendency of clinicians to assume permission has been granted when it has not. The practical lesson is that most of what a generalist clinician needs to do — permission and limited information — is squarely within scope, and the model itself signals when to refer.</p>",
          "callouts": {
            "plissit": {
              "label": "PLISSIT",
              "type": "reference",
              "body": "A four-level model — Permission, Limited Information, Specific Suggestions, Intensive Therapy — for graduated intervention in sexual concerns. Most generalists work at the first two levels."
            },
            "responsive-desire": {
              "label": "Responsive Desire",
              "type": "definition",
              "body": "Desire that emerges in response to arousal and intimacy rather than preceding them — central to Basson’s circular model and common, especially in long-term relationships."
            }
          }
        },
        {
          "type": "multipleChoice",
          "order": 6,
          "question": "Within the PLISSIT model, the 'Permission' level is therapeutically valuable primarily because:",
          "options": [
            {
              "text": "It establishes a sexual diagnosis",
              "isCorrect": false
            },
            {
              "text": "It communicates that sexual concerns are legitimate clinical topics, reducing the shame that prevents disclosure",
              "isCorrect": true
            },
            {
              "text": "It identifies which clients need referral",
              "isCorrect": false
            },
            {
              "text": "It provides specific behavioral techniques",
              "isCorrect": false
            }
          ],
          "correctAnswer": 1,
          "explanation": "Permission-giving normalizes sexual health as a clinical topic and reduces shame, which is the precondition for any further assessment or intervention.",
          "showExplanation": true
        },
        {
          "type": "text",
          "order": 7,
          "content": "<h2>The Bidirectional Sexual Health–Mental Health Connection</h2>\n<p>The relationship between sexual health and overall mental health is bidirectional and clinically significant, which is the core justification for treating sexual health assessment as a standard component of general practice rather than an optional add-on.</p>\n<h3>Psychiatric Conditions Affect Sexual Function</h3>\n<p>Depression reduces desire and capacity for pleasure; anxiety drives performance concerns and avoidance; PTSD produces both hyperarousal and numbing that disrupt intimacy; and the relational withdrawal common to many conditions erodes the partnership context in which much sexual activity occurs.</p>\n<h3>Treatments Affect Sexual Function</h3>\n<p>The pharmacological treatments for these conditions frequently produce sexual side effects. Selective serotonin reuptake inhibitors (SSRIs) and serotonin-norepinephrine reuptake inhibitors (SNRIs) are associated with reduced desire, delayed or absent orgasm, and arousal difficulty in a substantial proportion of users. These effects are a leading cause of medication nonadherence, yet they are frequently never discussed because clinicians do not routinely ask. A clinician who monitors sexual side effects as part of ongoing medication management is not only treating a quality-of-life concern but directly protecting treatment adherence and outcome.</p>\n<h3>Sexual Difficulty Affects Mental Health</h3>\n<p>The relationship runs in the other direction as well. Sexual difficulty erodes self-esteem, strains relationships, and generates anxiety and depressive symptoms. Untreated sexual concerns can therefore undermine the very mental health treatment a client is receiving for another presenting problem.</p>"
        },
        {
          "type": "text",
          "order": 8,
          "content": "<h2>Validated Assessment Instruments</h2>\n<p>Standardized instruments complement — they do not replace — the clinical interview, and they can be integrated into general mental health assessment, not only specialty settings.</p>\n<ul>\n<li><strong>Female Sexual Function Index (FSFI; Rosen et al., 2000)</strong>: a 19-item measure assessing six domains — desire, arousal, lubrication, orgasm, satisfaction, and pain.</li>\n<li><strong>International Index of Erectile Function (IIEF; Rosen et al., 1997)</strong>: a 15-item measure of male sexual function across erectile function, orgasmic function, desire, intercourse satisfaction, and overall satisfaction.</li>\n<li><strong>Arizona Sexual Experience Scale (ASEX)</strong>: a brief 5-item measure especially useful for tracking medication-related sexual side effects over time.</li>\n</ul>\n<p>Instruments should be administered within a clinical context that normalizes the assessment, shares results transparently with the client, and integrates the data into a biopsychosocial formulation rather than reducing a person to a score. Used well, brief instruments lower the threshold to the conversation, because completing a questionnaire can feel safer to a client than initiating disclosure aloud.</p>\n<h3>Cultural Scripts and Sexual Meaning</h3>\n<p>Gagnon and Simon's (1973) concept of <strong>sexual scripts</strong> — culturally shared cognitive frameworks that organize sexual expectations, meanings, and behavior — provides a useful lens for understanding how cultural context shapes each individual's experience. Scripts operate at cultural, interpersonal, and intrapsychic levels. Effective assessment is curious about the specific scripts organizing a given client's sexual life rather than applying mainstream Western norms as universal standards — a stance of cultural humility developed further in Module 2.</p>"
        },
        {
          "type": "reflection",
          "order": 9,
          "prompt": "Which of the three biopsychosocial domains — biological, psychological, or sociocultural — do you most reliably attend to in your current practice, and which is most often neglected?",
          "placeholder": "Reflect..."
        },
        {
          "type": "text",
          "order": 10,
          "content": "<h2>Why the Training Gap Exists — and Why It Matters</h2>\n<p>Understanding why sexual health is so often absent from clinical practice helps clinicians work past their own hesitation rather than simply feeling guilty about it. The gap is structural, not personal. Most graduate programs in counseling, social work, psychology, and psychiatry include little or no required coursework in human sexuality. Surveys of training programs across the mental health disciplines have consistently found that sexuality content is minimal, optional, or absent, and that practicum and internship supervision rarely models sexual health assessment. Clinicians therefore enter practice without having watched a competent sexual history taken, without language for the work, and without having processed their own discomfort in a supervised setting.</p>\n<p>The consequence is a self-perpetuating silence. Clinicians who were never taught to ask do not ask; clients infer that the topic is off-limits; and the absence of disclosures confirms the clinician's impression that sexual concerns are rare. In reality, sexual concerns are common across every clinical population, and the apparent rarity is an artifact of the silence itself.</p>\n<h3>The Clinical Stakes</h3>\n<p>The stakes of closing this gap are concrete. Sexual side effects are among the most common reasons clients quietly stop taking psychiatric medication, so a clinician who never asks may attribute a relapse to \"noncompliance\" while missing its actual cause. Survivors of sexual violence frequently present first for depression, anxiety, or relationship difficulty, and a clinician who cannot raise sexual health may never learn the history that organizes the presentation. Couples in distress over desire discrepancy — the single most common sexual complaint in couples work — may spend months in therapy that never names the issue. In each case, the missing competency is not specialized sex therapy; it is the basic ability to open the conversation.</p>"
        },
        {
          "type": "text",
          "order": 11,
          "content": "<h2>Taking a Sexual History: A Practical Structure</h2>\n<p>A sexual history is not a single intrusive question dropped into an intake. It is a brief, normalized line of inquiry that can be woven into routine assessment, and it follows a recognizable structure.</p>\n<h3>Open With Normalization</h3>\n<p>The most effective openings frame the inquiry as routine and universal: \"I ask all of my clients about sexual health because it's an important part of overall wellbeing, and it's affected by a lot of the things we treat — stress, mood, medication, relationships. Is it all right if I ask you a few questions?\" This single sentence accomplishes permission, normalizes the topic, and gives the client a moment to prepare. The clinician's tone — matter-of-fact, unhurried, neither apologetic nor prurient — communicates more than the words.</p>\n<h3>The Core Domains to Cover</h3>\n<p>A competent screening history touches, at minimum, the following: whether the client is currently sexually active and with whom (without assuming gender or relationship structure); whether they have any concerns about desire, arousal, orgasm, or pain; whether they have noticed any changes related to mood, stress, or medication; their sexual safety, including any history of coercion or unwanted experiences (asked carefully and without pressure to disclose); and whether there is anything about their sexual health they would like help with. The history is calibrated to the setting and the presenting problem — a full sexual history is not required of every client at every visit — but the door is opened.</p>\n<h3>Responding to Disclosure</h3>\n<p>How the clinician responds to the first disclosure determines whether a second one ever comes. A neutral, accepting response — \"Thank you for telling me; that's exactly the kind of thing I can help with or help you find the right support for\" — keeps the door open. A visible flinch, a rushed change of subject, or premature reassurance closes it. The clinician does not need to have an immediate solution; they need to receive the disclosure without judgment and signal that it is a legitimate clinical concern.</p>\n<h3>Documentation</h3>\n<p>Sexual health information is documented with the same care, accuracy, and discretion as any other sensitive clinical content, using the client's own language, recording only what is clinically relevant, and attending to the heightened privacy considerations that sexual content carries — particularly in shared records, with adolescents, and in any situation where a record might be disclosed.</p>"
        },
        {
          "order": 12,
          "type": "sequencing",
          "instructions": "Order the clinician’s steps when a client discloses a sexual concern for the first time.",
          "steps": [
            {
              "order": 1,
              "text": "Respond calmly and without surprise, signaling the topic is welcome"
            },
            {
              "order": 2,
              "text": "Normalize and give permission to discuss sexual concerns"
            },
            {
              "order": 3,
              "text": "Gather a focused, non-judgmental history of the concern"
            },
            {
              "order": 4,
              "text": "Offer limited information or specific suggestions within scope, or refer as needed"
            }
          ],
          "explanation": "A first disclosure is fragile: the clinician’s calm, permission-giving response comes first, followed by focused assessment and then appropriately scoped intervention or referral."
        },
        {
          "type": "text",
          "order": 13,
          "content": "<h2>Working With Your Own Discomfort</h2>\n<p>Clinician discomfort is not a character flaw; it is a predictable product of inadequate training and the same cultural conditioning clients carry. Naming it honestly is more useful than pretending it away, because unexamined discomfort leaks into the room as avoidance, awkwardness, or subtle signals that the topic is unwelcome.</p>\n<h3>Common Sources of Discomfort</h3>\n<ul>\n<li><strong>Fear of saying the wrong thing</strong>: clinicians worry about using incorrect terminology, offending the client, or appearing incompetent. The antidote is preparation and a willingness to ask the client to teach the clinician their language.</li>\n<li><strong>Countertransference</strong>: sexual content can activate the clinician's own history, values, and reactions. Recognizing and processing these reactions — ideally in supervision or consultation — prevents them from distorting care.</li>\n<li><strong>Value conflicts</strong>: a clinician's personal, cultural, or religious values may differ sharply from a client's sexual life. Ethical practice requires bracketing those values so they do not become the basis for judgment, while also recognizing the limits of one's ability to provide affirming care and referring when necessary rather than imposing.</li>\n</ul>\n<p>The development of comfort is a process, not a prerequisite. Clinicians become comfortable by doing the work in manageable steps, debriefing in consultation, and accumulating experiences that disconfirm the catastrophic expectations that maintain avoidance. The goal is not the absence of discomfort but the capacity to remain present and useful in spite of it.</p>"
        },
        {
          "type": "text",
          "order": 15,
          "content": "<h2>Sexual Anatomy and Physiology: A Clinician's Working Knowledge</h2>\n<p>A generalist clinician does not need the detailed knowledge of a physician, but a working grasp of sexual physiology supports accurate assessment, demystifies common concerns, and allows the clinician to distinguish problems likely to have a physiological basis from those that do not.</p>\n<h3>The Physiology of Sexual Response</h3>\n<p>The two fundamental physiological processes underlying sexual response are <strong>vasocongestion</strong> — the engorgement of genital tissue with blood that produces erection in the penis and clitoris and lubrication and swelling in the vulva and vagina — and <strong>myotonia</strong>, the buildup of muscle tension that culminates in the rhythmic contractions of orgasm. Both depend on intact vascular and neurological function, which is why conditions and medications affecting blood flow or nerve conduction so frequently disrupt arousal and orgasm. This is also why a new arousal complaint coinciding with a cardiovascular diagnosis, diabetes, or a new medication points toward a physiological contributor and warrants medical consultation.</p>\n<h3>The Neuroendocrine Dimension</h3>\n<p>Sexual response is coordinated by the interaction of the autonomic nervous system and a set of hormones and neurotransmitters. Testosterone contributes to desire in people of all sexes; estrogen maintains genital tissue health; and neurotransmitter systems — particularly the balance of dopamine (which tends to facilitate sexual response) and serotonin (which tends to inhibit it) — explain why serotonergic antidepressants so reliably dampen desire and delay orgasm. Understanding this balance helps the clinician explain medication effects to clients in a way that reduces self-blame: the problem is pharmacological, not a failure of attraction or will.</p>"
        },
        {
          "type": "text",
          "order": 16,
          "content": "<h2>Sex, Gender, and Sexual Orientation: Foundational Concepts</h2>\n<p>Accurate, affirming sexual health practice depends on a clear grasp of several concepts that are frequently conflated, and on the use of precise, respectful language.</p>\n<h3>Distinguishing the Concepts</h3>\n<ul>\n<li><strong>Sex assigned at birth</strong> refers to the classification (typically male or female) assigned on the basis of observed anatomy at birth.</li>\n<li><strong>Gender identity</strong> is a person's internal sense of their own gender, which may or may not align with the sex they were assigned.</li>\n<li><strong>Gender expression</strong> is the outward presentation of gender through appearance, behavior, and other cues.</li>\n<li><strong>Sexual orientation</strong> describes the pattern of a person's romantic and sexual attraction to others.</li>\n</ul>\n<p>These are distinct dimensions. A person's gender identity does not determine their sexual orientation, and neither is defined by anatomy. Treating them as separate axes is not merely a matter of terminology; it is a prerequisite for accurate assessment, because assumptions that collapse them lead clinicians to misunderstand clients' relationships, bodies, and concerns.</p>\n<h3>Affirming Language</h3>\n<p>Affirming practice uses the language clients use for themselves — their name, pronouns, and the terms they use for their bodies, partners, and relationships. When the clinician does not know a client's terms, the appropriate move is to ask respectfully rather than to guess, and to follow the client's lead. Asexuality (a sexual orientation characterized by little or no sexual attraction) and the diversity of relationship structures are part of the normal range of human sexuality, and recognizing them prevents the clinician from pathologizing what is simply unfamiliar.</p>"
        },
        {
          "type": "text",
          "order": 17,
          "content": "<h2>Consent as a Clinical Framework</h2>\n<p>{{callout:sexual-consent}} is foundational to sexual health, and the clinician's understanding of consent shapes both how they assess clients' experiences and how they educate. Consent is best understood as an ongoing, freely given, reversible, informed, and specific agreement — not a one-time threshold that, once crossed, applies indefinitely.</p>\n<h3>Clinical Applications</h3>\n<p>This framework has direct assessment implications. It helps the clinician distinguish consensual sexual experiences from coercive ones, including the more subtle forms of coercion that clients may not initially name as such — pressure, manipulation, or the inability to refuse safely. It informs work with adolescents and with clients who have intellectual or developmental disabilities, where capacity to consent is a central consideration. And it underlies the clinician's own conduct: the absolute prohibition on sexual contact between clinician and client rests on the recognition that the power differential makes genuine consent impossible. Holding a clear consent framework allows the clinician to help clients evaluate their own experiences and relationships against a standard grounded in autonomy, safety, and mutual agreement.</p>",
          "callouts": {
            "sexual-consent": {
              "label": "Consent",
              "type": "definition",
              "body": "Freely given, informed, ongoing, and revocable agreement to sexual activity; a clinical framework for screening that sexual activity is wanted and safe."
            }
          }
        },
        {
          "type": "text",
          "order": 19,
          "content": "<h2>Common Sexual Myths and the Facts That Replace Them</h2>\n<p>A great deal of sexual distress is generated not by dysfunction but by false beliefs about what sex is supposed to be. Correcting these myths is a high-yield form of limited information, and it is squarely within every clinician's scope.</p>\n<h3>Myths About Desire and Frequency</h3>\n<p>The belief that healthy desire is always spontaneous causes distress for the many people whose desire is responsive; teaching that responsive desire is normal frequently resolves the concern. The belief that there is a \"normal\" frequency of sexual activity against which a couple should measure themselves drives needless comparison; the only meaningful standard is whether the partners are satisfied. The belief that desire discrepancy means something is wrong with the relationship pathologizes an almost universal feature of long-term partnerships.</p>\n<h3>Myths About Performance and Aging</h3>\n<p>The belief that sex must follow a particular script culminating in simultaneous orgasm sets up a performance standard that generates anxiety and disappointment. The belief that aging means the end of sexuality is both false and a barrier to care. The belief that any change in function signals serious dysfunction leads people to catastrophize normal variation. In each case, accurate information replaces a distressing standard with a realistic one.</p>\n<h3>Myths About What \"Counts\"</h3>\n<p>Narrow definitions of sex — typically equating it with penetrative intercourse — exclude much of human sexual experience and create problems for people whose bodies, health, or preferences do not fit that script. A broader, more accurate understanding of sexuality as encompassing a wide range of pleasurable and intimate experiences is both more inclusive and more clinically useful, particularly when working with clients managing illness, disability, or the physical changes of aging.</p>"
        },
        {
          "type": "text",
          "order": 20,
          "content": "<h2>Pleasure, Satisfaction, and Sexual Wellbeing</h2>\n<p>Because the clinical field has historically focused on dysfunction, it is easy to lose sight of the positive dimension that the WHO definition places at the center of sexual health. Sexual wellbeing is not merely the absence of problems; it includes pleasure, satisfaction, intimacy, and the freedom to express one's sexuality safely and authentically.</p>\n<h3>Why the Positive Dimension Matters Clinically</h3>\n<p>Attending to sexual wellbeing, not just dysfunction, changes the clinical conversation. It allows the clinician to support clients in building satisfying sexual lives rather than only repairing deficits, and it recognizes that two people with identical \"function\" may have very different sexual wellbeing depending on intimacy, communication, and the meaning sex holds for them. Sexual satisfaction is more strongly predicted by relational and emotional factors — communication, emotional closeness, the sense of being desired — than by mechanical function alone, which is why interventions that improve communication and intimacy often improve satisfaction even when a physical difficulty persists.</p>\n<h3>The Clinical Implication</h3>\n<p>A clinician oriented toward wellbeing asks not only \"Is anything wrong?\" but \"What would a satisfying sexual life look like for you?\" This reframing is particularly valuable for clients whose circumstances — chronic illness, disability, aging, treatment effects — mean that restoring prior function is not the goal. For these clients, the work is often about expanding the definition of satisfying sexuality rather than restoring a narrow prior norm.</p>"
        },
        {
          "type": "text",
          "order": 21,
          "content": "<h2>Relationship Diversity and Non-Pathologizing Practice</h2>\n<p>Clients present within a wide range of relationship structures, and competent practice neither assumes monogamy nor pathologizes consensual alternatives. The clinician's task is to understand and support the client's actual relationships, whatever their configuration.</p>\n<h3>The Range of Consensual Structures</h3>\n<p>Many clients are in monogamous relationships; others are in consensually non-monogamous arrangements — including open relationships, polyamory, and other negotiated structures — that are organized around honesty and mutual agreement. Consensual non-monogamy is a relationship choice, not a disorder or a symptom, and research does not support the assumption that it reflects pathology, immaturity, or relationship dysfunction. Clinicians who reflexively interpret non-monogamy as a problem to be fixed impose their own assumptions and alienate clients who need support, not correction.</p>\n<h3>The Clinical Stance</h3>\n<p>The appropriate stance is the same disciplined non-assumption that governs all affirming practice: asking about the structure and agreements of a client's relationships rather than assuming them, supporting the client in living according to their own values and agreements, and addressing genuine distress or conflict within whatever structure the client has chosen. The clinician distinguishes carefully between a client's relationship structure (which is not the clinician's to judge) and any actual distress, coercion, or dishonesty within it (which is appropriately a clinical focus). This same non-pathologizing discipline extends to the full range of consensual sexual interests and practices, a topic developed in greater depth in dedicated coursework.</p>"
        },
        {
          "order": 22,
          "type": "multiSelect",
          "question": "Which principles guide non-pathologizing practice with a client in a consensually non-monogamous relationship? (Select all that apply)",
          "options": [
            {
              "text": "Consensual non-monogamy is a relationship choice, not a disorder",
              "isCorrect": true
            },
            {
              "text": "The clinician assesses the relationship on the client’s own terms",
              "isCorrect": true
            },
            {
              "text": "Non-monogamy should be treated as a symptom to be resolved",
              "isCorrect": false
            },
            {
              "text": "Attention to communication, agreements, and consent is appropriate",
              "isCorrect": true
            },
            {
              "text": "The clinician avoids assuming distress is caused by the structure itself",
              "isCorrect": true
            }
          ],
          "explanation": "Consensual non-monogamy is a relationship choice; affirming practice assesses it on the client’s terms and attends to agreements and communication rather than pathologizing the structure."
        },
        {
          "type": "text",
          "order": 24,
          "content": "<h2>Integrating Sexual Health Screening into Routine Practice</h2>\n<p>Knowing that sexual health matters is not the same as actually asking about it, and the gap between intention and practice is where most clinicians lose the thread. Integrating sexual health into routine practice requires a deliberate, sustainable approach rather than reliance on remembering in the moment.</p>\n<h3>Make It Routine, Not Exceptional</h3>\n<p>The most effective strategy is to build a brief sexual health inquiry into the standard intake and review process so that it is asked of everyone as a matter of course, not selectively when the clinician happens to suspect a concern. Selective asking communicates that the topic is unusual and reserved for problems; universal asking communicates that it is a normal part of health. A single normalized opening — \"I ask everyone about this\" — accomplishes most of the work.</p>\n<h3>The One-Question Version</h3>\n<p>For clinicians worried about time, a minimal version suffices to open the door: a single question such as \"Do you have any sexual health concerns you'd like to discuss?\" asked routinely, with genuine willingness to follow up on a positive answer. The full history is reserved for clients who indicate a concern. The goal is not to conduct an exhaustive sexual assessment with every client at every visit; it is to ensure that no client leaves believing the topic is unwelcome.</p>\n<h3>Sustaining the Practice</h3>\n<p>Clinicians sustain the practice by tolerating the early discomfort until it fades, by debriefing difficult moments in consultation, and by accumulating the experiences of clients who are visibly relieved to finally be asked. Over time, what began as an effortful addition becomes simply part of how the clinician practices.</p>"
        },
        {
          "type": "text",
          "order": 25,
          "content": "<h2>When Sexual Material Arises Unexpectedly: Transference and Boundaries</h2>\n<p>Sexual material does not arise only when the clinician deliberately raises it. It can emerge unexpectedly — through a client's disclosure, through erotic transference, or in the course of trauma work — and the clinician's capacity to remain steady and professional in these moments protects both the client and the work.</p>\n<h3>Erotic Transference</h3>\n<p>Clients may develop romantic or sexual feelings toward the clinician, a phenomenon long recognized in the clinical literature. Handled well, these feelings can be understood and worked with as meaningful clinical material; handled poorly — with shaming, avoidance, or, catastrophically, with reciprocation — they cause harm. The clinician's task is to respond without shaming the client, to maintain absolutely clear boundaries, and to use consultation to manage their own reactions. The prohibition on sexual contact between clinician and client is absolute, grounded in the recognition that the power differential makes genuine consent impossible and that such contact is among the most serious harms a clinician can inflict.</p>\n<h3>The Clinician's Own Reactions</h3>\n<p>Clinicians may also experience their own reactions to sexual material — discomfort, judgment, or, at times, attraction. Recognizing these reactions as ordinary, and processing them in supervision or consultation rather than acting on or denying them, is what allows the clinician to remain a safe and useful presence. The capacity to notice one's reactions without being governed by them is a hallmark of competent practice in this domain.</p>"
        },
        {
          "type": "text",
          "order": 26,
          "content": "<h2>Sexual Health Education as Clinical Intervention</h2>\n<p>A large share of sexual distress arises from straightforward gaps in accurate information, the legacy of sex education that was absent, abstinence-focused, fear-based, or simply incomplete. For this reason, education is one of the most powerful and accessible interventions in the clinician's repertoire, and it falls within every clinician's scope as limited information.</p>\n<h3>Correcting the Information Deficit</h3>\n<p>Many clients carry misinformation about anatomy, about the range of normal function and variation, about how desire and arousal actually work, and about what consent requires. Correcting these misconceptions — explaining responsive desire, normalizing the diversity of sexual experience, clarifying the role of anxiety, accurately describing the effects of aging or medication — frequently resolves distress that had been experienced as a personal failing. The clinician functions, in these moments, as an educator providing the accurate information the client's prior education did not.</p>\n<h3>Education as Empowerment</h3>\n<p>Beyond correcting specific myths, sexual health education empowers clients to understand their own bodies and responses, to communicate with partners, and to make informed decisions. This educational stance is consistent with the sexual rights framework: clients have a right to accurate sexual information, and providing it is a core, accessible, and high-impact dimension of competent sexual health care across the lifespan.</p>"
        },
        {
          "type": "text",
          "order": 28,
          "content": "<h2>Examining Your Own Sexual Values</h2>\n<p>Because affirming, non-judgmental practice requires clinicians to set aside their own values when those values would distort care, a deliberate self-examination of one's sexual attitudes is itself a professional competency rather than an optional exercise.</p>\n<h3>Why Self-Examination Matters</h3>\n<p>Every clinician carries values, beliefs, and reactions about sexuality, shaped by their own culture, upbringing, religion, and experience. These are not problems in themselves, but they become clinical problems when they operate unexamined — leaking into the room as judgment, discomfort, or the subtle steering of a client toward the clinician's own preferences. A clinician who has never examined their reactions to particular sexual practices, identities, or relationship structures is more likely to communicate disapproval without intending to, and less able to recognize when their own values are shaping their clinical judgment.</p>\n<h3>The Work of Values Clarification</h3>\n<p>Useful self-examination involves honestly identifying the sexual topics, identities, behaviors, and presentations that evoke discomfort or judgment, understanding where those reactions come from, and developing the capacity to recognize them in the moment so they can be set aside in service of the client. The goal is not to erase one's values — that is neither possible nor necessary — but to hold them with enough awareness that they do not govern one's clinical conduct. Where a clinician finds that their values genuinely prevent them from providing affirming care to a particular client or concern, the ethical response is to recognize that limit and refer appropriately, rather than to impose those values on a client who came for help. This ongoing self-reflection, ideally supported by supervision and consultation, is part of what it means to practice sexual health care competently and ethically across the full diversity of the clients one serves.</p>"
        },
        {
          "type": "reflection",
          "order": 34,
          "prompt": "What is your own most likely source of discomfort in sexual health conversations — fear of saying the wrong thing, your own reactions, or value differences? What would help you work with it?",
          "placeholder": "Reflect..."
        }
      ]
    },
    {
      "title": "Module 2: Assessment Across the Lifespan and Affirming Practice",
      "order": 2,
      "estimatedTime": 20,
      "contentBlocks": [
        {
          "type": "sectionDivider",
          "order": 0,
          "sectionNumber": 2,
          "title": "Module 2",
          "subtitle": "Module 2: Assessment Across the Lifespan and Affirming Practice"
        },
        {
          "type": "text",
          "order": 1,
          "content": "<h2>Childhood Sexual Behavior: Normative versus Concerning</h2>\n<p>Clinicians who work with children and families must be able to distinguish developmentally normative sexual behavior from behavior that warrants assessment or mandated reporting. This is one of the highest-stakes discriminations in the field, because both over-reaction (pathologizing normal curiosity) and under-reaction (missing abuse) cause harm.</p>\n<p>Normative sexual behavior in young children is typically <strong>spontaneous, intermittent, and easily redirected</strong>; occurs between children of similar age, size, and developmental level; and is accompanied by curiosity and lightheartedness rather than fear, aggression, or compulsion. Genital self-touch, curiosity about others' bodies, and consensual same-age exploratory play fall within the normative range.</p>\n<h3>Behaviors That Warrant Assessment</h3>\n<p>Behaviors that fall outside the normative range and warrant careful assessment include sexual behavior that is compulsive and not redirectable; that involves significant age, size, or developmental differences between children; that is coercive or aggressive; that simulates adult sexual activity in detail beyond a child's expected knowledge; or that is accompanied by fear, anxiety, or distress. The presence of detailed sexual knowledge inconsistent with developmental stage is a particular concern. None of these signs is individually diagnostic of abuse, but they shift the clinical task toward careful assessment and, where indicated, mandated reporting.</p>"
        },
        {
          "type": "text",
          "order": 2,
          "content": "<h2>Mandated Reporting and Adolescent Confidentiality</h2>\n<p>Mandated reporting obligations require clinicians to report reasonable suspicion of child abuse; the threshold is suspicion, not proof, and the determination of whether abuse occurred belongs to investigators, not to the reporting clinician. Clinicians should know their specific jurisdiction's statute, including the definitions and the reporting mechanism, before a reportable situation arises rather than during one.</p>\n<h3>Adolescents: Confidentiality, Consent, and Risk</h3>\n<p>Work with adolescents introduces distinct ethical complexity. Adolescents are developmentally driven toward autonomy and privacy, and candid disclosure depends on a confidentiality framework they can trust — yet that confidentiality has limits defined by safety and by law. Best practice is to establish the confidentiality framework explicitly at the outset, with both the adolescent and caregivers, including the specific circumstances under which information will be shared.</p>\n<p>Assessment with adolescents attends to consensual versus coercive experience, the developmental appropriateness of partners (significant age gaps raise concern), substance use in sexual contexts, sexually transmitted infection and pregnancy risk, and the adolescent's access to accurate information. The clinician's stance is neither permissive nor punitive; it is one of accurate information, risk reduction, and respect for developing autonomy within the boundaries set by safety and law.</p>"
        },
        {
          "type": "multipleChoice",
          "order": 3,
          "question": "A clinician observes sexual behavior in a 5-year-old client. Which feature would most strongly shift the clinical task toward careful assessment and possible mandated reporting?",
          "options": [
            {
              "text": "The behavior is occasional and easily redirected",
              "isCorrect": false
            },
            {
              "text": "The behavior involves curiosity and same-age peers",
              "isCorrect": false
            },
            {
              "text": "The behavior is compulsive, not redirectable, and accompanied by fear or aggression",
              "isCorrect": true
            },
            {
              "text": "The child shows lighthearted curiosity about bodies",
              "isCorrect": false
            }
          ],
          "correctAnswer": 2,
          "explanation": "Compulsivity, non-redirectability, coercion, and accompanying fear or aggression fall outside the normative range and warrant assessment; the other options describe developmentally normative behavior.",
          "showExplanation": true
        },
        {
          "type": "text",
          "order": 4,
          "content": "<h2>Adult Sexual Response: Models and Their Clinical Use</h2>\n<p>Several models of sexual response inform contemporary assessment, and each corrects a limitation of its predecessor.</p>\n<h3>Masters and Johnson; Kaplan</h3>\n<p>Masters and Johnson (1966) described a four-phase response cycle — excitement, plateau, orgasm, and resolution — derived from physiological observation. Kaplan (1979) added <strong>desire</strong> as a distinct phase preceding arousal, a contribution that underlies the DSM's longstanding separation of desire, arousal, and orgasm disorders.</p>\n<h3>Basson's Circular, Responsive-Desire Model</h3>\n<p>Basson (2000, 2001) made a clinically pivotal contribution by describing a circular model in which, for many people — especially many women in established relationships — desire is <strong>responsive</strong> rather than spontaneous: it emerges in response to arousal and emotional intimacy rather than preceding them. This reframing is therapeutic in itself, because a great deal of distress arises from the mistaken belief that \"normal\" desire must be spontaneous. Teaching a client that responsive desire is normal often resolves the presenting concern without further intervention — a clear example of Limited Information in the PLISSIT framework.</p>\n<h3>The Dual Control Model</h3>\n<p>Bancroft and Janssen's dual control model conceptualizes sexual response as the balance between sexual excitation and sexual inhibition — an accelerator and a set of brakes. Many desire and arousal problems reflect high inhibition (stress, fatigue, body-image concern, relational anger) rather than low excitation. This depersonalizes the difficulty and points intervention toward reducing the brakes rather than manufacturing more accelerator.</p>"
        },
        {
          "type": "text",
          "order": 5,
          "content": "<h2>Assessing the Major Domains of Adult Sexual Concern</h2>\n<p>Comprehensive assessment covers desire, arousal, orgasm, and pain, while distinguishing {{callout:lifelong-acquired}} from acquired and generalized from situational presentations — distinctions that carry direct treatment implications.</p>\n<ul>\n<li><strong>Desire concerns</strong>: assess whether the difficulty is lifelong or acquired, generalized or situational, and whether responsive desire has been misinterpreted as disorder. Desire discrepancy between partners — not low desire per se — is the most common couple presentation.</li>\n<li><strong>Arousal concerns</strong>: distinguish subjective from physiological arousal, attend to arousal non-concordance (the common finding that genital response and subjective arousal do not always align), and evaluate vascular and medication contributors.</li>\n<li><strong>Orgasm concerns</strong>: assess delayed, absent, or distressing orgasm; medication effects (especially SSRIs) are a frequent and often missed contributor.</li>\n<li><strong>Pain ({{callout:gpppd}}/penetration)</strong>: sexual pain always warrants medical evaluation alongside psychological assessment, because it frequently has physiological contributors (pelvic floor dysfunction, vulvodynia, {{callout:gsm}} of menopause) that respond to targeted treatment.</li>\n</ul>\n<p>The acquired-versus-lifelong and generalized-versus-situational axes are not academic. A situational, acquired difficulty points toward relational, contextual, or medication factors; a lifelong, generalized one points toward different etiologies and a different treatment pathway.</p>",
          "callouts": {
            "gsm": {
              "label": "GSM",
              "type": "clinical",
              "body": "Genitourinary Syndrome of Menopause — common, frequently distressing, and highly treatable changes (dryness, thinning, discomfort) related to declining estrogen."
            },
            "gpppd": {
              "label": "Genito-Pelvic Pain",
              "type": "clinical",
              "body": "Genito-Pelvic Pain/Penetration Disorder (DSM-5-TR): persistent difficulty with pain, fear, or pelvic muscle tension related to penetration; requires biopsychosocial assessment."
            },
            "lifelong-acquired": {
              "label": "Lifelong vs. Acquired",
              "type": "definition",
              "body": "Lifelong difficulties have been present since first sexual activity; acquired difficulties develop after a period of unproblematic functioning — pointing toward what changed."
            }
          }
        },
        {
          "type": "reflection",
          "order": 6,
          "prompt": "Recall a client who presented with a sexual concern (or imagine a likely one in your setting). How would distinguishing lifelong/acquired and generalized/situational change your formulation?",
          "placeholder": "Reflect..."
        },
        {
          "type": "text",
          "order": 7,
          "content": "<h2>Cultural Humility and Affirming Practice with LGBTQ+ Clients</h2>\n<p>Cultural context shapes sexual values, expression, and the meaning of sexual experience, and most clinicians were trained within Western, predominantly white, heteronormative frameworks. <strong>Cultural humility</strong> — a stance of lifelong self-examination, openness to the client as the expert on their own experience, and attention to power imbalance — is the appropriate alternative to the impossible goal of \"competence\" in every culture.</p>\n<h3>Minority Stress and Affirming Sexual Health Care</h3>\n<p>Meyer's (2003) minority stress model explains the elevated rates of distress among sexual and gender minority populations not as a function of identity but as a function of chronic exposure to stigma, discrimination, expectation of rejection, and internalized negative messages. Applied to sexual health, affirming care means using the language clients use for their bodies and partners, not assuming the gender of partners or the configuration of relationships, recognizing the diversity of sexual practices without pathologizing consensual behavior, and understanding that for many LGBTQ+ clients the clinical setting itself has historically been a source of harm.</p>\n<p>Affirming practice is not a separate technique applied only with LGBTQ+ clients. It is the same stance of curiosity and non-assumption that good sexual health assessment requires with everyone — recognizing that every person's sexuality is organized by a specific cultural, developmental, and relational history that is uniquely theirs.</p>"
        },
        {
          "order": 8,
          "type": "fillInBlank",
          "title": "Quick check — desire",
          "blanks": [
            {
              "prompt": "Desire that emerges in response to arousal and intimacy rather than preceding them:",
              "answer": "responsive desire",
              "acceptAlternates": [
                "responsive"
              ]
            },
            {
              "prompt": "The researcher whose circular model centers responsive desire:",
              "answer": "Basson",
              "acceptAlternates": [
                "Rosemary Basson"
              ]
            }
          ]
        },
        {
          "type": "text",
          "order": 9,
          "content": "<h2>The DSM-5-TR Sexual Dysfunctions: A Clinical Orientation</h2>\n<p>Generalist clinicians benefit from a working orientation to how sexual dysfunctions are classified, both to communicate with prescribers and specialists and to recognize when a presentation warrants formal assessment. The DSM-5-TR (American Psychiatric Association, 2022) organizes the sexual dysfunctions around desire, arousal, orgasm, and pain, and applies a consistent set of qualifying criteria that are as clinically important as the categories themselves.</p>\n<h3>The Qualifying Criteria</h3>\n<p>To meet the threshold for a DSM-5-TR sexual dysfunction, symptoms generally must have persisted for a minimum duration (approximately six months), must occur in most or all sexual encounters (commonly operationalized as roughly 75–100% of the time), and — critically — must cause <strong>clinically significant distress</strong>. The distress criterion is decisive: variation in sexual interest or function that does not distress the person is not a disorder. A clinician who pathologizes a couple's mismatched but mutually acceptable desire, or labels an older adult's reduced frequency as \"dysfunction,\" has misapplied the framework.</p>\n<h3>The Subtype Specifiers</h3>\n<p>Each diagnosis is specified as <strong>lifelong or acquired</strong> and <strong>generalized or situational</strong>. These specifiers are not bookkeeping; they shape formulation and treatment. An acquired, situational difficulty (present only with a particular partner or in a particular context, after a period of unremarkable function) points strongly toward relational, contextual, or medication contributors. A lifelong, generalized difficulty points toward different etiologies. The same surface complaint can therefore call for very different responses depending on these axes.</p>\n<h3>The Major Categories</h3>\n<ul>\n<li><strong>Desire/interest</strong>: male hypoactive sexual desire disorder; female sexual interest/arousal disorder (which, reflecting Basson's work, combines desire and arousal in women).</li>\n<li><strong>Arousal</strong>: erectile disorder.</li>\n<li><strong>Orgasm</strong>: delayed ejaculation, premature (early) ejaculation, female orgasmic disorder.</li>\n<li><strong>Pain</strong>: genito-pelvic pain/penetration disorder.</li>\n<li><strong>Substance/medication-induced</strong> sexual dysfunction — a category the generalist should hold actively in mind given how often medication is the driver.</li>\n</ul>\n<p>The clinical value of this orientation is not diagnostic precision for its own sake; it is the ability to recognize when a concern is transient and reassurable, when it is medication-related and warrants prescriber consultation, and when it is persistent and distressing enough to merit formal assessment or referral.</p>"
        },
        {
          "type": "text",
          "order": 10,
          "content": "<h2>Desire Discrepancy: The Most Common Couple Presentation</h2>\n<p>The most frequent sexual concern brought to couples and individual therapists is not a dysfunction in either partner but a <strong>discrepancy</strong> in desire between partners. Reframing the problem from \"one partner has low desire\" to \"this couple has a difference they are managing poorly\" is itself a major intervention, because it removes the implicit diagnosis of a \"broken\" partner and locates the issue in the couple's dynamic.</p>\n<h3>Assessing the Discrepancy</h3>\n<p>Useful assessment establishes each partner's baseline desire pattern (spontaneous versus responsive), the meaning each attaches to sex and to its frequency, the pursuer–distancer dynamic that frequently develops (the higher-desire partner pursues, the lower-desire partner withdraws under pressure, and the pursuit itself further suppresses desire), and the contextual factors loading the brakes for the lower-desire partner — stress, fatigue, unaddressed relational resentment, body-image concerns, or untreated medical and medication factors.</p>\n<h3>Reframing Interventions</h3>\n<p>Limited-information interventions are often powerful here: teaching the couple about responsive desire (so the lower-desire partner stops experiencing their pattern as defective), about the dual control model (so both partners attend to reducing the brakes rather than demanding more accelerator), and about the pursuer–distancer trap (so the higher-desire partner understands how pursuit backfires). Many couples improve substantially with these reframes alone; those who do not are appropriate referrals for specialized couples or sex therapy.</p>"
        },
        {
          "type": "multipleChoice",
          "order": 11,
          "question": "Which DSM-5-TR criterion most directly prevents pathologizing a couple's mismatched but mutually acceptable level of sexual frequency?",
          "options": [
            {
              "text": "The six-month duration criterion",
              "isCorrect": false
            },
            {
              "text": "The requirement that symptoms occur in 75–100% of encounters",
              "isCorrect": false
            },
            {
              "text": "The requirement of clinically significant distress",
              "isCorrect": true
            },
            {
              "text": "The lifelong/acquired specifier",
              "isCorrect": false
            }
          ],
          "correctAnswer": 2,
          "explanation": "Without clinically significant distress, variation in sexual interest or function does not meet the threshold for a disorder — this criterion guards against pathologizing acceptable difference.",
          "showExplanation": true
        },
        {
          "type": "text",
          "order": 12,
          "content": "<h2>A Practical Framework for Adolescent Sexual Health Assessment</h2>\n<p>Adolescent sexual health assessment integrates into established psychosocial screening rather than standing apart from it. Structured adolescent interview frameworks (such as the widely used HEEADSSS approach, which surveys Home, Education/employment, Eating, Activities, Drugs, Sexuality, Suicide/depression, and Safety) embed sexuality within a broader developmental conversation, which is both more comfortable for the adolescent and more clinically complete.</p>\n<h3>The Sexuality Component</h3>\n<p>Within that framework, the sexuality component covers — at a developmentally appropriate pace and within a clear confidentiality agreement — whether the adolescent is in any romantic or sexual relationships; the nature, consensuality, and developmental appropriateness of those relationships (significant age gaps and any coercion are specific concerns); knowledge of and access to accurate information about contraception and sexually transmitted infection prevention; substance use in sexual contexts; and any unwanted or pressured experiences. Sexual orientation and gender identity are approached with openness and without assumption, recognizing that the clinical relationship may be one of the few safe places an adolescent has to explore these questions.</p>\n<h3>Balancing Autonomy, Safety, and Law</h3>\n<p>The clinician holds three considerations simultaneously: respect for the adolescent's developing autonomy and need for privacy; the safety obligations that set the limits of confidentiality; and the legal framework governing minors in their jurisdiction, including age-of-consent and mandated-reporting statutes. Establishing the confidentiality agreement explicitly — what stays private and what must be shared, and why — at the start of the work is what makes honest disclosure possible. The clinician's stance throughout is one of accurate information and harm reduction rather than prohibition, delivered with respect for the adolescent as an emerging adult.</p>"
        },
        {
          "type": "text",
          "order": 14,
          "content": "<h2>Differentiating Dysfunction Subtypes: Lifelong vs. Acquired, Generalized vs. Situational</h2>\n<p>When a sexual concern does reflect a dysfunction, two descriptive axes sharpen the assessment and point toward likely contributors: whether the difficulty is lifelong or acquired, and whether it is generalized or situational. These distinctions are clinically powerful and are part of how the diagnostic framework characterizes sexual dysfunctions.</p>\n<h3>Lifelong Versus Acquired</h3>\n<p>A lifelong difficulty has been present since the person became sexually active, whereas an acquired difficulty develops after a period of unproblematic functioning. The distinction matters because an acquired problem points the clinician toward what changed — a new medication, a health condition, a relationship shift, a stressor, a loss, or a traumatic experience — whereas a lifelong pattern raises different questions about development, learning, and longstanding factors. Identifying the onset and what coincided with it is frequently the single most informative step in understanding an acquired concern.</p>\n<h3>Generalized Versus Situational</h3>\n<p>A generalized difficulty occurs across all situations and partners, whereas a situational difficulty occurs only in certain contexts, with certain partners, or under certain conditions. This distinction is especially clarifying: a situational pattern — for example, a difficulty present with a partner but not during solo sexuality, or present in one relationship but not another — points strongly toward psychological, relational, or contextual contributors rather than a primarily physiological cause. A generalized, consistent difficulty, by contrast, raises the relative likelihood of a physiological or medication-related contributor warranting medical evaluation. Used together, these two axes help the generalist form an initial picture of where a concern is likely to originate and where to focus assessment and referral, well before any specialized workup.</p>",
          "title": "Differentiating Dysfunction Subtypes: Lifelong vs. Acquired, Generalized vs. Situational"
        },
        {
          "type": "text",
          "order": 15,
          "content": "<h2>Screening for Sexual Coercion and Intimate Partner Violence</h2>\n<p>Sexual concerns sometimes surface in the context of coercion, pressure, or intimate partner violence, and the generalist clinician has a responsibility to recognize this possibility rather than treating every sexual complaint as a dysfunction to be managed within the relationship as it stands.</p>\n<h3>Why Screening Matters</h3>\n<p>Difficulties such as pain, aversion, low desire, or distress about sexual activity can reflect a relational context in which sex is coerced, pressured, or unsafe rather than a problem located in the individual's body or psychology. Reframing a coercion-driven difficulty as a \"sexual dysfunction\" can inadvertently pathologize a healthy protective response and obscure a safety concern. Clinicians therefore screen, in a private and non-judgmental way, for whether sexual activity is wanted and consensual, whether the client feels safe and free to decline, and whether there is a broader pattern of control, fear, or violence in the relationship.</p>\n<h3>Responding to Disclosures</h3>\n<p>When coercion or intimate partner violence is disclosed, the clinical priorities shift toward safety: assessing risk, validating the client's experience, providing information about resources and options, and supporting the client's autonomy in decisions about the relationship without pressure or directive advice. The clinician attends to confidentiality and mandated-reporting obligations as applicable, conducts safety screening privately and never in the presence of a partner, and recognizes that a client may not be ready to label or leave a situation. Throughout, the clinician holds the client's safety and self-determination as paramount, and recognizes that what presents as a sexual problem may, on careful and compassionate inquiry, be a safety problem requiring a different response.</p>",
          "title": "Screening for Sexual Coercion and Intimate Partner Violence"
        },
        {
          "order": 16,
          "type": "cardSort",
          "instructions": "A client reports new sexual pain. Sort each possible contributor by domain.",
          "categories": [
            "Biological",
            "Psychological",
            "Social/Relational"
          ],
          "cards": [
            {
              "id": "gsm",
              "text": "Genitourinary changes / hormonal shifts",
              "correctCategory": "Biological"
            },
            {
              "id": "inf",
              "text": "Infection or dermatological condition",
              "correctCategory": "Biological"
            },
            {
              "id": "anx",
              "text": "Anticipatory anxiety and pelvic muscle guarding",
              "correctCategory": "Psychological"
            },
            {
              "id": "tr",
              "text": "Trauma history shaping the pain response",
              "correctCategory": "Psychological"
            },
            {
              "id": "rel",
              "text": "Relationship conflict or coercion",
              "correctCategory": "Social/Relational"
            },
            {
              "id": "cul",
              "text": "Cultural or religious messages about sex",
              "correctCategory": "Social/Relational"
            }
          ],
          "explanation": "New sexual pain is best understood biopsychosocially — biological, psychological, and social/relational contributors interact, and assessment spans all three rather than assuming a single cause."
        },
        {
          "type": "text",
          "order": 18,
          "content": "<h2>Conducting the Adult Sexual Assessment Interview</h2>\n<p>Where Module 1 introduced the general sexual history, the adult assessment interview goes deeper when a client presents with a specific concern. Its purpose is to gather enough information to form a biopsychosocial formulation and to determine whether the concern is within the generalist's scope or warrants referral.</p>\n<h3>Characterizing the Concern</h3>\n<p>The interview first locates the difficulty within the response cycle — is it primarily about desire, arousal, orgasm, or pain? — and then applies the two clinical axes introduced earlier: is it lifelong or acquired, generalized or situational? A concern that is acquired and situational immediately directs attention to what changed and to the specific contexts in which the difficulty does and does not occur. The clinician also asks how long the concern has persisted and, crucially, how much distress it causes the client and any partner, since distress is what distinguishes a clinical problem from normal variation.</p>\n<h3>Surveying the Three Domains</h3>\n<p>Comprehensive assessment then surveys each biopsychosocial domain: biological factors (general health, chronic conditions, all medications including over-the-counter and recreational substances, recent physical changes), psychological factors (mood, anxiety, performance concerns, body image, history of unwanted sexual experiences, the client's beliefs and expectations about sex), and sociocultural and relational factors (relationship quality and conflict, partner concerns, cultural and religious context, life stressors such as work, finances, and caregiving). A concern that looked simple at presentation frequently turns out to be multiply determined, which is precisely why a single-domain formulation so often fails.</p>\n<h3>Toward a Formulation</h3>\n<p>The interview concludes with a shared, collaborative formulation — a hypothesis, framed in plain language and offered to the client for correction, about how the contributing factors fit together — and a plan that may include limited information, specific suggestions, medical consultation, or referral. Sharing the formulation with the client is itself therapeutic, because it replaces a sense of personal defect with an understandable, addressable account.</p>"
        },
        {
          "type": "text",
          "order": 19,
          "content": "<h2>Affirming Practice with LGBTQ+ Clients: Specific Skills</h2>\n<p>Affirming practice with sexual and gender minority clients is built from concrete, learnable skills, not from a vague attitude of acceptance. Because these clients experience minority stress and frequently carry histories of harm within healthcare, the specifics matter.</p>\n<h3>The Clinical Environment and Intake</h3>\n<p>Affirming care begins before the first session, in forms and environment. Intake paperwork that offers space to indicate name in use, pronouns, gender identity beyond a binary checkbox, and relationship structures beyond monogamous heterosexual defaults signals safety. Using the client's name and pronouns consistently — and repairing quickly and without excessive apology when a mistake is made — is foundational.</p>\n<h3>Non-Assumption as a Discipline</h3>\n<p>The central skill is disciplined non-assumption: not assuming the gender of a client's partners, the configuration of their relationships, the language they use for their body, or their sexual practices. The clinician asks, follows the client's lead, and uses the client's own terms. For transgender and gender-diverse clients specifically, this includes asking which words the client uses for their anatomy rather than imposing clinical or gendered terms that may cause distress.</p>\n<h3>Minority Stress in the Formulation</h3>\n<p>Affirming sexual health assessment locates a client's concerns within the minority stress framework where relevant: chronic experiences of stigma, rejection, and internalized negative messages contribute to anxiety, shame, and difficulty with intimacy, and naming this context can be clarifying and validating. At the same time, the clinician avoids attributing every concern to minority stress, which would be its own form of stereotyping.</p>\n<h3>Knowing the Limits of One's Competence</h3>\n<p>Affirming practice also includes honesty about the edge of one's competence. A clinician who lacks specific training in gender-affirming care should not improvise it; the ethical move is to provide a supportive, affirming relationship while connecting the client with appropriately trained providers, just as with any other specialized need.</p>"
        },
        {
          "order": 20,
          "type": "multiSelect",
          "question": "Which are core skills of affirming sexual health practice with LGBTQ+ clients? (Select all that apply)",
          "options": [
            {
              "text": "Using inclusive, non-assuming language about partners and bodies",
              "isCorrect": true
            },
            {
              "text": "Following the client’s own identity terms and pronouns",
              "isCorrect": true
            },
            {
              "text": "Assuming heterosexuality unless told otherwise",
              "isCorrect": false
            },
            {
              "text": "Understanding minority stress and its clinical impact",
              "isCorrect": true
            },
            {
              "text": "Not relying on the client to provide basic education",
              "isCorrect": true
            }
          ],
          "explanation": "Affirming practice uses inclusive language, follows the client’s own terms, understands minority stress, and takes responsibility for the clinician’s own education rather than assuming or burdening the client."
        },
        {
          "type": "text",
          "order": 21,
          "content": "<h2>Working Across Religious and Cultural Difference</h2>\n<p>Sexuality is shaped powerfully by culture and religion, and clinicians regularly work with clients whose frameworks differ sharply from their own. Cultural humility here means neither imposing the clinician's values nor abandoning clinical responsibility, but helping clients navigate their own values, relationships, and wellbeing.</p>\n<h3>Faith and Sexuality</h3>\n<p>Clients from conservative religious backgrounds may experience conflict between sexual feelings or identities and deeply held beliefs, may carry shame rooted in religious teaching, or may seek to align their sexual lives with their faith. The clinician's task is not to argue the client out of their religion or to validate self-rejection, but to help the client explore the conflict, reduce shame, and arrive at a resolution that is genuinely their own. For sexual and gender minority clients from such backgrounds, this work is especially delicate, and affirming care means supporting the client's self-determination rather than steering them toward any predetermined outcome.</p>\n<h3>Immigrant, Refugee, and Cross-Cultural Contexts</h3>\n<p>Clients from immigrant and refugee backgrounds, and clients whose cultural sexual scripts differ from mainstream Western norms, require the clinician to understand sexuality as the client's culture constructs it rather than as the clinician's training assumes. Gender roles, the meaning of marriage and family, acceptable topics of discussion, and the involvement of family in personal decisions all vary. Intersectionality — the way multiple identities (race, religion, immigration status, sexual orientation, disability) combine to shape experience — means that no single cultural script captures a given client; the clinician remains curious about this particular person's particular configuration.</p>\n<h3>Bracketing Without Abandoning</h3>\n<p>The practical stance is to bracket the clinician's own sexual values so they do not become the basis for judgment, while retaining the clinical responsibility to provide accurate information and to recognize and respond to genuine harm, coercion, or risk. When a clinician's values make it impossible to provide affirming care to a particular client, the ethical response is appropriate referral, not the imposition of those values.</p>"
        },
        {
          "type": "text",
          "order": 23,
          "content": "<h2>Ejaculatory and Orgasmic Concerns: Assessment Essentials</h2>\n<p>Two of the most common male-presenting sexual concerns are premature (early) ejaculation and delayed ejaculation, and both are frequently treatable once accurately assessed. The generalist's role is to characterize the concern, identify likely contributors, and determine the appropriate level of intervention or referral.</p>\n<h3>Premature (Early) Ejaculation</h3>\n<p>Premature ejaculation involves ejaculation occurring sooner than the person or couple desires, with associated distress. Assessment establishes whether it is lifelong or acquired (an acquired pattern points toward anxiety, relationship change, or medical contributors), how much distress it causes, and its impact on the couple. Performance anxiety is a frequent maintaining factor, and the anxiety-ejaculation cycle is self-reinforcing. Many cases respond to behavioral techniques and anxiety reduction, which a trained generalist can provide or which a sex therapist can deliver; some respond to pharmacological approaches managed by a prescriber.</p>\n<h3>Delayed Ejaculation and Female Orgasmic Concerns</h3>\n<p>Delayed or absent ejaculation, and difficulty reaching orgasm in clients of any gender, share several common contributors that assessment should survey: medication (SSRIs are a leading cause across genders), anxiety and spectatoring (self-monitoring during sex that interrupts the response), insufficient or mismatched stimulation, and relationship factors. For female orgasmic concerns specifically, assessment distinguishes lifelong from acquired and generalized from situational, since a client who has never experienced orgasm requires a different approach than one who has lost a previously reliable capacity. Accurate sexual education — about the role of clitoral stimulation, about the wide range of normal experience, and about the effects of anxiety — is itself often therapeutic, and is squarely within the generalist's scope as limited information.</p>"
        },
        {
          "type": "text",
          "order": 24,
          "content": "<h2>Arousal Concerns Across Genders</h2>\n<p>Arousal difficulties — erectile difficulty in men, and reduced genital arousal and lubrication in women — share a common feature: because genital arousal is fundamentally vascular and neurological, new-onset arousal difficulty warrants consideration of medical contributors alongside psychological ones.</p>\n<h3>Erectile Difficulty</h3>\n<p>Erectile difficulty is one of the most common male sexual concerns and one of the most important to assess carefully, because it can be an early marker of cardiovascular disease — the same vascular processes that impair coronary circulation impair erectile function, often earlier. New-onset erectile difficulty therefore warrants medical evaluation, not only for the sexual concern itself but as a potential cardiovascular signal. Psychologically, the anxiety-erection cycle is powerful: a single difficult experience generates performance anxiety that makes the next one more likely, and addressing this cycle is central to treatment. A useful diagnostic clue is whether erections occur in some contexts (on waking, with self-stimulation) but not others, which points toward psychological and situational rather than purely vascular factors.</p>\n<h3>Arousal Concerns in Women</h3>\n<p>Reduced genital arousal and lubrication in women may reflect hormonal change (especially the genitourinary syndrome of menopause), medication, insufficient or mismatched stimulation, anxiety, or relationship factors, and assessment surveys each. Arousal non-concordance — the common finding that genital response and subjective arousal do not always align — is important to understand and to normalize, since clients distressed by a perceived mismatch between body and mind are often reassured to learn it is a normal feature of human sexual response rather than a sign of dysfunction or of dishonesty about their feelings.</p>"
        },
        {
          "type": "text",
          "order": 25,
          "content": "<h2>Genito-Pelvic Pain: A Closer Assessment Look</h2>\n<p>Sexual pain deserves particular attention because it is common, frequently has treatable physiological contributors, and is too often dismissed or attributed prematurely to psychological causes. The cardinal principle, stated in Module 2 and worth repeating, is that sexual pain always warrants medical evaluation alongside psychological assessment.</p>\n<h3>Common Contributors</h3>\n<p>Genito-pelvic pain has many possible physiological contributors, including pelvic floor muscle dysfunction (overactive or poorly coordinated pelvic floor muscles), the genitourinary syndrome of menopause, vulvodynia and related pain conditions, infections, dermatological conditions, and the after-effects of childbirth or surgery. Many of these respond well to targeted treatment — pelvic floor physical therapy in particular is an essential and frequently overlooked resource — which is why premature psychological attribution can leave a treatable condition untreated.</p>\n<h3>The Pain-Fear-Tension Cycle</h3>\n<p>Physiological and psychological factors interact in a self-reinforcing cycle: pain produces anticipatory fear, fear produces muscle tension and arousal inhibition, and tension and reduced arousal worsen pain. This is why effective treatment is usually interdisciplinary, combining medical and physical-therapy management of the physiological contributors with psychological work on the fear, anxiety, and avoidance that maintain the cycle. The mental health clinician's role is to assess the psychological dimension, to ensure the client receives appropriate medical and physical-therapy evaluation, and to address the fear-tension cycle — never to treat sexual pain as a purely psychological problem.</p>"
        },
        {
          "type": "text",
          "order": 27,
          "content": "<h2>Synthesis: Red Flags That a Concern Exceeds Generalist Scope</h2>\n<p>A central competency of generalist sexual health practice is recognizing when a concern exceeds one's scope and warrants referral. The following are practical indicators that a presentation calls for specialized assessment or treatment rather than generalist management.</p>\n<h3>Indicators for Referral</h3>\n<ul>\n<li><strong>Persistent, entrenched dysfunction</strong> that does not respond to permission, accurate information, and basic behavioral suggestions points toward specialized sex therapy.</li>\n<li><strong>Likely physiological contributors</strong> — sexual pain, new-onset erectile difficulty, symptoms coinciding with illness or medication — call for medical evaluation in parallel with any psychological work.</li>\n<li><strong>Significant trauma history</strong> driving the sexual concern, particularly where specialized trauma-focused treatment is indicated, warrants referral to or coordination with an appropriately trained trauma clinician.</li>\n<li><strong>Complex couple dynamics</strong> — entrenched desire discrepancy, conflict that overwhelms the sexual concern — may require specialized couples or sex therapy.</li>\n<li><strong>Concerns outside the clinician's training</strong>, including gender-affirming care and other specialized areas, call for connection with appropriately trained providers.</li>\n</ul>\n<h3>Referral Is Not Abandonment</h3>\n<p>Recognizing these red flags is not an admission of inadequacy; it is the exercise of the scope-of-practice judgment that ethical care requires. And referral does not mean withdrawal: the generalist frequently continues to provide the permission-giving, supportive relationship that complements specialized care. The goal is to ensure that each dimension of a client's concern is addressed by someone competent to address it, with the generalist often serving as the integrating presence across the team.</p>"
        },
        {
          "type": "text",
          "order": 28,
          "content": "<h2>Trauma-Informed Sexual Assessment</h2>\n<p>Because sexual health and sexual trauma are so frequently connected, sexual assessment must be conducted in a trauma-informed manner regardless of whether a trauma history is known. A trauma-informed approach protects clients who may have histories the clinician is unaware of, and makes disclosure possible for those who choose it.</p>\n<h3>Principles in Practice</h3>\n<p>Trauma-informed sexual assessment prioritizes the client's sense of safety and control throughout. The clinician explains why questions are being asked, signals that the client may decline any question or pause at any time, and never pressures for disclosure or for traumatic detail. Questions about unwanted or coercive sexual experiences are asked gently and without assumption, framed in a way that gives the client full control over what and whether to share. The clinician watches for signs of distress or dissociation and is prepared to slow down, ground the client, and prioritize stabilization over information-gathering.</p>\n<h3>Responding to Disclosure</h3>\n<p>When a client does disclose a history of sexual trauma, the clinician receives it without judgment, validates the courage of the disclosure, attends to the client's immediate emotional state and safety, and avoids pressing for details that are not clinically necessary in the moment. The clinician then determines, collaboratively with the client, whether specialized trauma-focused treatment is indicated and arranges appropriate referral or coordination. Throughout, the stance is one of safety, choice, and respect for the client's pace — the same principles that govern all trauma-informed care, applied to the specific sensitivity of sexual material.</p>"
        },
        {
          "type": "text",
          "order": 30,
          "content": "<h2>When Sexual Concerns Hide Behind Other Presentations</h2>\n<p>Sexual health concerns frequently do not present as such. Because clients anticipate judgment and lack permission to raise them directly, sexual concerns often surface only indirectly, behind another presenting problem — which is yet another reason routine inquiry matters.</p>\n<h3>Common Disguises</h3>\n<p>A client who presents for depression may be depressed in part because of an unaddressed sexual difficulty, or may be experiencing sexual side effects of antidepressant treatment that they have never mentioned. A couple presenting for \"communication problems\" may be in conflict largely over an unspoken sexual issue. A client presenting with anxiety may be avoiding intimacy because of performance fears or a trauma history. A relationship described as \"growing apart\" may be drifting around a sexual disconnection neither partner can name. In each case, the sexual dimension is doing significant work in the clinical picture while remaining invisible unless the clinician asks.</p>\n<h3>The Implication for Practice</h3>\n<p>The lesson is not that every presenting problem conceals a sexual one, but that the clinician who never inquires about sexual health will systematically miss the sexual dimension of presentations where it is operative — and will sometimes treat the surface complaint while the maintaining factor goes unaddressed. Routine, normalized inquiry brings these hidden concerns into view, allowing the clinician to address the actual problem rather than only its visible expression.</p>"
        },
        {
          "type": "text",
          "order": 31,
          "content": "<h2>Understanding Sexual Frequency and Variation</h2>\n<p>A great deal of clinical work involves helping clients let go of false standards against which they measure their sexual lives, and few standards cause more needless distress than beliefs about how often \"normal\" people have sex.</p>\n<h3>There Is No Normal Frequency</h3>\n<p>Research on sexual frequency consistently shows enormous variation across individuals and couples, with no single frequency that defines health. Frequency is influenced by age, relationship length, life circumstances, stress, health, and individual differences in desire, and it naturally changes over time within any relationship. The only meaningful clinical standard is whether the individual or couple is satisfied with their sexual life — not how their frequency compares to a real or imagined norm.</p>\n<h3>Helping Clients Reframe</h3>\n<p>Clients frequently arrive convinced that their frequency is abnormal, a belief often fueled by media portrayals and by the assumption that everyone else is having more or better sex. The clinician helps by normalizing variation, by redirecting attention from comparison to the couple's own satisfaction and connection, and by reframing changes in frequency as a normal feature of relationships rather than a sign of failure. This reframing alone frequently resolves distress, and it exemplifies the broader principle that accurate information is one of the most powerful interventions available.</p>"
        },
        {
          "type": "text",
          "order": 32,
          "content": "<h2>Sexual Fantasy: Clinical Meaning and Non-Pathologizing Assessment</h2>\n<p>Sexual fantasy is a near-universal feature of human sexuality that clients sometimes raise with shame or anxiety, and clinicians benefit from a clear, non-pathologizing framework for understanding it.</p>\n<h3>Fantasy Is Normal and Common</h3>\n<p>Sexual fantasy is extremely common across genders and orientations, and the presence of fantasy — including fantasy about scenarios a person would never wish to enact in reality — is not in itself a sign of pathology or of a problem with the person's relationship. Fantasies serve many functions, including arousal, exploration, and play, and the content of a fantasy does not necessarily reflect a desire to act on it. Clients distressed by their own fantasies are frequently relieved to learn that fantasy is normal and that its content does not define them.</p>\n<h3>The Clinical Distinction</h3>\n<p>The clinician distinguishes carefully between fantasy, which is internal and harms no one, and behavior, which is where questions of consent, harm, and legality apply. A fantasy is not a plan, and pathologizing fantasy alienates clients and discourages disclosure. The relevant clinical questions concern distress (is the client troubled by their fantasy life, and if so, why?) and behavior (does any acted-upon behavior involve non-consent or harm?), not the mere content of private imagination. This non-pathologizing stance toward fantasy is consistent with the affirming, consent-focused framework that runs throughout sexual health practice, and the deeper assessment of specific consensual interests is addressed in dedicated coursework.</p>"
        },
        {
          "order": 33,
          "type": "multiSelect",
          "question": "A client expresses shame about a recurring sexual fantasy. Which clinical responses are appropriate? (Select all that apply)",
          "options": [
            {
              "text": "Normalize that fantasy is common and not equivalent to action or intent",
              "isCorrect": true
            },
            {
              "text": "Explore the meaning and the shame rather than the content alone",
              "isCorrect": true
            },
            {
              "text": "Treat the fantasy as inherently pathological",
              "isCorrect": false
            },
            {
              "text": "Distinguish distress about the fantasy from the fantasy itself",
              "isCorrect": true
            },
            {
              "text": "Attend to any genuine risk while avoiding shaming",
              "isCorrect": true
            }
          ],
          "explanation": "Fantasy is common and not equivalent to intent; affirming practice addresses the shame and meaning, distinguishes distress from content, and attends to genuine risk without shaming."
        },
        {
          "type": "reflection",
          "order": 39,
          "prompt": "In your setting, how is sexual health currently addressed (or not) when you work with adolescents? What would a clear, explicit confidentiality agreement look like in your practice?",
          "placeholder": "Reflect..."
        }
      ]
    },
    {
      "title": "Module 3: Sexual Health in Context — Illness, Disability, Aging, and Referral",
      "order": 3,
      "estimatedTime": 20,
      "contentBlocks": [
        {
          "type": "sectionDivider",
          "order": 0,
          "sectionNumber": 3,
          "title": "Module 3",
          "subtitle": "Module 3: Sexual Health in Context — Illness, Disability, Aging, and Referral"
        },
        {
          "type": "text",
          "order": 1,
          "content": "<h2>Sexual Health and Chronic Illness</h2>\n<p>Chronic illness affects sexual function through disease processes, treatment effects, and the psychological burden of illness — and it is one of the most reliably overlooked dimensions of chronic-disease care.</p>\n<h3>Diabetes</h3>\n<p>Diabetes produces sexual dysfunction in both men and women through vascular damage and neuropathy, contributing to erectile difficulty, reduced genital sensation and lubrication, and orgasmic change. Because these effects are physiological, they require coordination with medical care, but the clinician who raises them often surfaces a concern the client assumed was unspeakable or untreatable.</p>\n<h3>Cardiovascular Disease</h3>\n<p>Cardiovascular disease raises both physiological and fear-based barriers. Many clients and partners avoid sexual activity after a cardiac event out of fear that it is dangerous. The Princeton Consensus guidelines provide a framework for stratifying cardiac risk associated with sexual activity; for most patients with stable disease, sexual activity is safe, and clinician reassurance grounded in medical guidance is itself an intervention.</p>\n<h3>Cancer Survivorship</h3>\n<p>Cancer and its treatments — surgery, radiation, chemotherapy, and hormonal therapy — produce wide-ranging sexual effects, from anatomical change and pain to altered desire and profound shifts in body image and identity. Breast, prostate, and gynecological cancers carry particularly direct sexual consequences. Survivorship care that ignores sexual health leaves a central domain of quality of life unaddressed.</p>\n<h3>Multiple Sclerosis and Chronic Pain</h3>\n<p>Multiple sclerosis can cause neurogenic sexual dysfunction alongside fatigue and spasticity. Chronic pain conditions interfere with sexual activity directly and through the medications used to treat them. In every case, the bidirectional loop between the condition, mood, and sexual function means that attending to sexuality can improve overall adjustment to illness.</p>"
        },
        {
          "type": "text",
          "order": 2,
          "content": "<h2>Disability and Sexuality</h2>\n<p>People with disabilities are sexual beings whose sexual health is systematically neglected because of ableist assumptions about who is, and is not, a sexual person. Affirming practice begins by rejecting that assumption.</p>\n<h3>Specific Considerations</h3>\n<ul>\n<li><strong>Spinal cord injury</strong>: the level and completeness of injury shape specific sexual implications, but sexual response and satisfaction remain possible and are an appropriate focus of rehabilitation.</li>\n<li><strong>Traumatic brain injury</strong>: may alter desire, produce disinhibition, and reshape relationship dynamics, requiring attention to both the person and their partner.</li>\n<li><strong>Intellectual and developmental disabilities</strong>: require a rights-based approach that balances the right to sexual expression and education with genuine attention to capacity and consent — neither denying sexuality nor neglecting protection.</li>\n<li><strong>Mobility limitations</strong>: often respond to practical problem-solving around positioning, timing, and adaptive approaches.</li>\n</ul>\n<p>The <strong>social model of disability</strong> reframes the clinical task: the goal is to remove the social and environmental barriers to sexual expression rather than to \"fix\" bodies that do not conform to a narrow norm.</p>"
        },
        {
          "type": "text",
          "order": 3,
          "content": "<h2>Sexuality and Aging</h2>\n<p>The belief that older adults are asexual is both empirically false and a barrier to care. Sexual interest and activity persist for many people well into later life, and older adults have a right to sexual health care that takes them seriously.</p>\n<h3>Normal Aging versus Pathology</h3>\n<p>Physiological changes accompany aging — vascular changes, hormonal shifts, slower arousal, and, after menopause, the genitourinary syndrome of menopause (GSM), which includes vaginal dryness and tissue thinning that can make intercourse painful. These changes are normal and frequently treatable; framing them as the inevitable end of a sexual life is inaccurate and harmful. GSM in particular responds well to medical management, and naming it is the first step toward treatment.</p>\n<h3>Overlooked Concerns in Older Adults</h3>\n<p>Sexually transmitted infection rates in older adults are an under-recognized public health concern, partly because clinicians do not provide sexual health education or screening to this population. Older adults in long-term care settings retain sexual rights that institutions frequently fail to accommodate, raising both clinical and ethical questions about privacy, capacity, and dignity. The clinician who carries the same matter-of-fact stance into work with older adults that they would bring to any other age group is providing care most older clients have never received.</p>"
        },
        {
          "type": "reflection",
          "order": 4,
          "prompt": "Consider the populations you serve who live with chronic illness, disability, or aging. Where has sexual health been absent from your assessment, and what would it take to include it?",
          "placeholder": "Reflect..."
        },
        {
          "type": "text",
          "order": 5,
          "content": "<h2>Medication Effects and Their Management</h2>\n<p>Because medication-related sexual effects are common, distressing, and a leading cause of nonadherence, recognizing and addressing them is a core competency even for clinicians who do not prescribe.</p>\n<ul>\n<li><strong>Antidepressants (SSRIs/SNRIs)</strong>: reduced desire, delayed or absent orgasm, and arousal difficulty are common. Management strategies that prescribers may consider include dose adjustment, timing, switching to an agent with a lower sexual side-effect profile, or augmentation — all decisions for the prescriber, but ones the non-prescribing clinician can surface and advocate for on the client's behalf.</li>\n<li><strong>Antihypertensives, antipsychotics, and hormonal agents</strong>: each carries its own profile of sexual effects.</li>\n</ul>\n<p>The essential clinical move is simple: ask. A clinician who routinely asks \"Have you noticed any changes in your sexual functioning since starting this medication?\" detects a problem that would otherwise drive silent nonadherence, and opens a collaborative conversation with the prescriber.</p>"
        },
        {
          "type": "text",
          "order": 6,
          "content": "<h2>Scope of Practice, Ethics, and Referral Pathways</h2>\n<p>Knowing the limits of one's competence and referring appropriately is itself an ethical competency, governed by the ACA and NBCC codes' requirements to practice within one's boundaries of competence and to refer when a client's needs exceed them.</p>\n<h3>When and Where to Refer</h3>\n<ul>\n<li><strong>Certified sex therapists (AASECT-certified)</strong>: for entrenched sexual dysfunction, complex desire discrepancies, and concerns requiring specialized intervention beyond permission and limited information.</li>\n<li><strong>Pelvic floor physical therapy</strong>: for genito-pelvic pain and pelvic floor dysfunction.</li>\n<li><strong>Urology, gynecology, and primary care</strong>: for any presentation with likely physiological contributors — sexual pain, new-onset erectile difficulty, or symptoms coinciding with illness or medication.</li>\n</ul>\n<h3>Boundaries Around Sexual Content</h3>\n<p>Discussing sexual material with clients requires clear professional boundaries. The clinician's comfort with sexual topics must never blur into anything that serves the clinician's interest rather than the client's; the entire purpose of permission-giving is the client's wellbeing. Maintaining a matter-of-fact, clinical stance — neither avoidant nor prurient — is both the most effective and the most ethical posture.</p>\n<h3>Putting It Together</h3>\n<p>The generalist clinician who finishes this course should be able to raise sexual health routinely, screen with a biopsychosocial and lifespan lens, recognize normative from concerning presentations across the age range, respond competently within the Permission and Limited Information levels, and refer accurately when a concern exceeds their scope. That combination — not specialized expertise — is what closes the clinical silence that leaves so much sexual distress unaddressed.</p>"
        },
        {
          "order": 7,
          "type": "matching",
          "matchingInstructions": "Match each sexual-health concern to the most appropriate generalist action.",
          "matchingPairs": [
            {
              "term": "Mild situational difficulty tied to stress",
              "definition": "Permission, education, and specific suggestions within generalist scope"
            },
            {
              "term": "New pain with intercourse",
              "definition": "Biopsychosocial assessment plus medical referral to rule out physical causes"
            },
            {
              "term": "Complex, refractory sexual dysfunction",
              "definition": "Referral to a specialized (e.g., AASECT-certified) sex therapist"
            },
            {
              "term": "Sexual concern signaling possible coercion",
              "definition": "Shift to safety screening and intimate partner violence resources"
            }
          ]
        },
        {
          "type": "text",
          "order": 9,
          "content": "<h2>Cancer Survivorship: A Closer Look</h2>\n<p>Cancer survivorship deserves specific attention because its sexual consequences are among the most profound and most neglected in all of clinical practice, and because the growing population of survivors increasingly presents to mental health professionals for the adjustment, mood, and relationship sequelae of treatment.</p>\n<h3>Treatment-Specific Effects</h3>\n<p>The sexual effects of cancer treatment are mechanism-specific. Surgery may remove or alter sexual anatomy and disrupt nerve pathways essential to arousal and orgasm. Radiation can damage tissue, producing pain, dryness, and structural change. Chemotherapy frequently induces fatigue, nausea, and — in many regimens — early menopause with its attendant sexual effects. Hormonal therapies, central to breast and prostate cancer treatment, directly suppress desire and arousal by design. Pelvic, breast, prostate, and gynecological cancers carry especially direct sexual consequences, but virtually any cancer experience reshapes a person's relationship to their body.</p>\n<h3>The Identity and Relationship Dimension</h3>\n<p>Beyond the physical, cancer reshapes sexual identity. Survivors frequently describe feeling disconnected from a body that has become a site of illness and treatment, grieving a prior sexual self, and renegotiating intimacy with partners who may themselves be navigating fear of recurrence, role change from partner to caregiver, and uncertainty about how to reintroduce physical closeness. The mental health clinician is often better positioned than the oncology team to address these dimensions, precisely because they fall outside the medical frame. Naming sexuality as a legitimate part of survivorship — rather than waiting for the survivor to raise it against the cultural pressure to simply be \"grateful to be alive\" — is frequently the intervention that matters most.</p>"
        },
        {
          "type": "text",
          "order": 10,
          "content": "<h2>Sexual Health and Serious Mental Illness</h2>\n<p>People living with serious mental illness — including schizophrenia spectrum disorders, bipolar disorder, and severe recurrent depression — have sexual health needs that are among the most systematically ignored in the entire healthcare system, reflecting a compounding of stigma about both mental illness and sexuality.</p>\n<h3>Distinct Considerations</h3>\n<p>Several factors converge in this population. Antipsychotic medications commonly produce sexual side effects, including those mediated by elevated prolactin, and these effects are a frequent driver of nonadherence in a population for whom medication discontinuation carries high risk. Symptoms themselves — anhedonia, negative symptoms, the disorganization of acute episodes, and the impulsivity and hypersexuality that can accompany manic states — affect sexual experience and decision-making. People with serious mental illness also face elevated risk of sexual victimization and of sexually transmitted infection, alongside reduced access to sexual health education and screening.</p>\n<h3>The Clinical Posture</h3>\n<p>The appropriate posture is neither the paternalistic denial of sexuality that has historically characterized care for this population nor a neglect of genuine vulnerability. It is a recognition that people with serious mental illness have the same right to sexual health, sexual expression, and sexual safety as anyone else, combined with attentive support around capacity, consent, medication effects, and protection from exploitation. Raising sexual side effects directly with this population is particularly important, because the link between antipsychotic side effects and nonadherence is strong and the consequences of nonadherence are severe.</p>"
        },
        {
          "order": 11,
          "type": "multiSelect",
          "question": "Why is it especially important to ask clients with serious mental illness about sexual health? (Select all that apply)",
          "options": [
            {
              "text": "Their sexual health is frequently overlooked by providers",
              "isCorrect": true
            },
            {
              "text": "Psychiatric medications commonly affect sexual functioning",
              "isCorrect": true
            },
            {
              "text": "They have the same rights to sexual health and to be asked",
              "isCorrect": true
            },
            {
              "text": "People with serious mental illness are assumed to be asexual",
              "isCorrect": false
            },
            {
              "text": "Sexual side effects can affect medication adherence and quality of life",
              "isCorrect": true
            }
          ],
          "explanation": "Clients with serious mental illness have the same right to sexual health, are frequently overlooked, and commonly experience medication-related sexual side effects that affect adherence and quality of life."
        },
        {
          "type": "text",
          "order": 12,
          "content": "<h2>When Trauma Underlies the Presentation: The Generalist's Role</h2>\n<p>A substantial proportion of sexual health concerns are connected, directly or indirectly, to a history of sexual trauma. The generalist clinician's role is not to provide specialized trauma treatment for sexual trauma — that is the focus of dedicated training and of separate coursework — but to recognize the connection, respond safely, and refer or coordinate appropriately.</p>\n<h3>Recognizing the Connection</h3>\n<p>Trauma may present as sexual avoidance or aversion, as dissociation during sexual activity, as compulsive sexual behavior, as genito-pelvic pain, or as difficulty with trust and intimacy. None of these presentations proves a trauma history, and clinicians must avoid assuming or suggesting trauma that a client has not reported. But holding the possibility in mind — and asking about unwanted sexual experiences gently, without pressure to disclose — allows the clinician to understand presentations that would otherwise be puzzling.</p>\n<h3>Responding Safely</h3>\n<p>When trauma is disclosed, the generalist's immediate tasks are to receive the disclosure without judgment, to prioritize the client's sense of safety and control in the conversation, to avoid pressing for traumatic detail that is not clinically necessary, and to assess current safety and stability. Specialized trauma-focused sexual health treatment — including the trauma-adapted and somatic approaches that require dedicated training — is then provided by an appropriately trained clinician, to whom the generalist refers or with whom they coordinate. Recognizing the limits of one's training here is not a failure; it is exactly the scope-of-practice judgment that ethical care requires.</p>"
        },
        {
          "type": "text",
          "order": 13,
          "content": "<h2>Building and Using a Referral Network</h2>\n<p>Competent referral depends on having a network in place before it is needed. A clinician who recognizes that a concern exceeds their scope but has no one to refer to has only solved half the problem.</p>\n<h3>Assembling the Network</h3>\n<p>A functional sexual health referral network typically includes: certified sex therapists (the AASECT directory is the standard source for certified clinicians); pelvic floor physical therapists, who are essential partners for genito-pelvic pain and pelvic floor dysfunction; urologists and gynecologists, particularly those known to be comfortable with sexual health concerns; primary care clinicians for medication review and medical workup; and, where relevant, specialists in gender-affirming care. Clinicians who build relationships with these providers — rather than handing clients a name from a directory — make referrals that clients are far more likely to follow through on.</p>\n<h3>Making the Referral Stick</h3>\n<p>A referral is most effective when the clinician frames it as added expertise rather than as a dismissal (\"I want to bring in someone who specializes in exactly this, and I'll stay involved\"), addresses the practical and emotional barriers to following through, and — with appropriate consent — coordinates with the receiving provider rather than simply transferring the client. The generalist frequently remains involved, continuing to provide the permission-giving and supportive presence that complements specialized care.</p>"
        },
        {
          "type": "text",
          "order": 15,
          "content": "<h2>Pregnancy, Postpartum, and Sexual Health</h2>\n<p>The perinatal period is a significant and frequently overlooked window of sexual change, and mental health clinicians working with pregnant and postpartum clients are well positioned to address it.</p>\n<h3>During Pregnancy</h3>\n<p>Sexual desire and comfort vary widely across pregnancy and across individuals — increasing for some, decreasing for others, and changing across trimesters as the body changes. Anxiety about harming the pregnancy, body-image shifts, and physical discomfort all influence sexual experience. Accurate information that, in uncomplicated pregnancies, sexual activity is generally safe (with guidance from the obstetric provider) relieves a common and unspoken worry.</p>\n<h3>The Postpartum Period</h3>\n<p>The postpartum period brings physical recovery, hormonal change (particularly the suppression of estrogen during lactation, which commonly causes vaginal dryness and discomfort), profound sleep disruption, and the reorganization of identity and relationship that accompanies new parenthood. Many couples experience a significant change in their sexual relationship that they did not anticipate and feel unable to discuss. Naming this as common and time-limited, providing accurate information about lactation-related changes and their management, and attending to the relationship strain that sexual change can produce are all within the generalist's scope and are frequently deeply appreciated by clients who assumed they were alone in the experience.</p>"
        },
        {
          "type": "text",
          "order": 16,
          "content": "<h2>Managing Later-Life Sexual Health: Practical Clinical Guidance</h2>\n<p>Building on the rejection of the asexual-aging myth, affirming practice with older adults requires specific clinical knowledge and a willingness to raise topics that the broader healthcare system routinely omits.</p>\n<h3>Managing the Physiology of Later-Life Sexuality</h3>\n<p>Genitourinary syndrome of menopause (GSM) is common, frequently distressing, and highly treatable; clients benefit from knowing that effective management exists and from being encouraged to raise it with a medical provider. For men, changes in erectile function are common with age but are not synonymous with the end of a sexual life, and they may signal vascular conditions that warrant evaluation. The clinician who frames these changes as manageable adaptations rather than terminal losses keeps possibilities open that ageist assumptions would foreclose.</p>\n<h3>Relationship and Context in Later Life</h3>\n<p>Later-life sexuality is shaped by partner availability, widowhood, the formation of new relationships, and — for those in long-term care — institutional constraints on privacy and autonomy. Clinicians can support older adults who are forming new sexual relationships (including the often-overlooked need for sexually transmitted infection prevention), help those navigating sexuality after the loss of a long-term partner, and advocate for the sexual rights and dignity of clients in institutional settings. The capacity to consent in the context of cognitive decline raises genuine clinical and ethical complexity that deserves careful, person-centered attention rather than blanket restriction.</p>",
          "title": "Managing Later-Life Sexual Health: Practical Clinical Guidance"
        },
        {
          "type": "text",
          "order": 17,
          "content": "<h2>Ethics and Documentation in Sexual Health Practice</h2>\n<p>Sexual health practice raises ethical considerations that, while continuous with general clinical ethics, carry distinctive sensitivities that warrant explicit attention.</p>\n<h3>Boundaries and Scope</h3>\n<p>The ACA and NBCC codes require practice within one's boundaries of competence, appropriate referral, and the maintenance of clear professional boundaries. In sexual health work, the most important boundary is the absolute prohibition on any sexual or romantic involvement with clients, grounded in the recognition that the power differential precludes genuine consent. The clinician's comfort with sexual material exists entirely in the service of the client and must never serve the clinician's interest. A matter-of-fact, clinical stance — neither avoidant nor prurient — is both the most therapeutic and the most ethical posture.</p>\n<h3>Values, Referral, and Non-Imposition</h3>\n<p>Where a clinician's personal values conflict sharply with a client's sexual life, ethical practice requires bracketing those values rather than imposing them, and — when a clinician cannot provide genuinely affirming care — referring rather than delivering judgment-laden or substandard treatment. Referral on the basis of values must never function as a rejection of the client's identity.</p>\n<h3>Documentation</h3>\n<p>Documentation of sexual health information follows the same standards of accuracy and relevance as all clinical documentation, with heightened attention to privacy. Clinicians record what is clinically necessary in the client's own language, consider the heightened sensitivity of sexual content in shared and disclosable records, and attend to the specific confidentiality complexities that arise with adolescents and with information that, if disclosed, could expose a client to harm. Thoughtful documentation protects both the client and the clinician.</p>"
        },
        {
          "type": "text",
          "order": 19,
          "content": "<h2>Sexual Health and Fertility: Infertility and Its Treatment</h2>\n<p>Fertility concerns and the experience of infertility have a significant and frequently overlooked impact on sexual health, and clinicians supporting clients through family-building difficulties should understand this intersection.</p>\n<h3>How Infertility Affects Sexuality</h3>\n<p>The experience of infertility, and the process of fertility treatment, can profoundly affect a couple's sexual relationship. Sex that has been a source of pleasure and connection can become medicalized, scheduled, and goal-directed, oriented toward conception rather than intimacy or enjoyment. The pressure of timed intercourse, the intrusion of monitoring and procedures, the grief and disappointment of unsuccessful cycles, and the strain on identity and relationship can all erode desire, arousal, spontaneity, and satisfaction. Sex may come to feel like a task or a reminder of loss rather than a source of closeness, and partners may differ in how they experience and cope with this.</p>\n<h3>Supporting Clients</h3>\n<p>Clinicians support clients through fertility-related sexual difficulties by acknowledging this impact, normalizing the strain that infertility places on a sexual relationship, and helping couples preserve or rebuild intimacy and pleasure alongside or apart from conception efforts. This can include helping partners communicate about their differing experiences, distinguishing sex for connection from sex for conception, and processing the grief, identity threat, and relationship strain that infertility brings. The clinician also remains attentive to the emotional toll of infertility more broadly — including depression, anxiety, and grief — and coordinates with medical fertility providers as appropriate. Throughout, the clinician validates that the sexual difficulties accompanying infertility are a common and understandable response to an exceptionally stressful experience, not a separate failing to be judged.</p>",
          "title": "Sexual Health and Fertility: Infertility and Its Treatment"
        },
        {
          "type": "text",
          "order": 20,
          "content": "<h2>Sexuality in Long-Term Care: Capacity, Privacy, and Dignity</h2>\n<p>Older adults in long-term care settings retain their sexuality and their right to sexual expression, yet institutional environments frequently fail to accommodate these rights, raising clinical and ethical questions that mental health professionals are well positioned to help address.</p>\n<h3>The Core Tensions</h3>\n<p>Long-term care settings must balance residents' rights to privacy, autonomy, and intimate relationships against legitimate concerns about safety and, in some cases, capacity to consent. Too often the balance defaults to blanket prohibition — denying residents privacy, treating sexual expression as a behavior to be managed, and overriding autonomy in ways that would never be accepted for younger adults. This default reflects ageist assumptions rather than genuine ethical reasoning.</p>\n<h3>Capacity to Consent</h3>\n<p>The presence of cognitive impairment, including dementia, complicates but does not eliminate the question of sexual rights. Capacity to consent to sexual activity is decision-specific and can fluctuate; it is not an all-or-nothing status conferred or removed by a diagnosis. Thoughtful assessment asks whether the person understands the nature of the relationship, can express a consistent choice, and is free from coercion — rather than presuming incapacity from diagnosis alone. These are genuinely difficult determinations that require careful, individualized, and frequently interdisciplinary judgment.</p>\n<h3>The Clinician's Contribution</h3>\n<p>Mental health clinicians can help long-term care settings move from reflexive prohibition toward individualized, dignity-centered approaches: supporting privacy, assessing capacity thoughtfully rather than presumptively, educating staff and families, and advocating for residents' rights alongside genuine attention to protection from exploitation. The goal is neither to ignore real vulnerability nor to deny older adults a dimension of life that remains meaningful to many of them.</p>"
        },
        {
          "type": "text",
          "order": 21,
          "content": "<h2>A Worked Case: Integrating the Biopsychosocial-Lifespan Formulation</h2>\n<p>Consider a 58-year-old client referred for depression who, when the clinician routinely asks about sexual health, discloses distress about reduced desire and difficulty with arousal over the past year — a difficulty she has assumed signaled the end of her sexual life and has never raised with any provider. A biopsychosocial-lifespan formulation organizes the assessment.</p>\n<h3>Applying the Framework</h3>\n<p><strong>Biological:</strong> The client is perimenopausal, reports vaginal dryness and discomfort consistent with the genitourinary syndrome of menopause, and began an SSRI for depression eight months ago — two highly plausible contributors to both reduced desire and arousal difficulty. <strong>Psychological:</strong> Her depression itself suppresses desire and pleasure, and her belief that the changes are an irreversible end-point is generating anticipatory anxiety and avoidance. <strong>Sociocultural and relational:</strong> She has absorbed a cultural script that frames older women as asexual, which has made the changes feel like confirmation rather than a solvable problem, and she has withdrawn from her partner, who has interpreted the distance as rejection.</p>\n<h3>From Formulation to Plan</h3>\n<p>The formulation generates multiple points of entry. The clinician provides <strong>limited information</strong> — that GSM is common and treatable, that SSRI sexual effects are common and that the prescriber has options, and that sexuality persists and changes rather than ending in later life — which alone reduces her distress and anticipatory anxiety. The clinician coordinates with the <strong>prescriber</strong> regarding the SSRI and recommends <strong>medical evaluation</strong> of GSM, both squarely within appropriate scope. The clinician addresses the <strong>relational</strong> withdrawal directly, helping the couple communicate about a change both had silently misread. And the clinician treats the <strong>depression</strong> that is both cause and consequence of the sexual difficulty. No single intervention would have sufficed; the integrated formulation is what made an apparently hopeless complaint into a set of addressable problems.</p>"
        },
        {
          "type": "multipleChoice",
          "order": 22,
          "question": "In the worked case, the client's reduced desire and arousal are best understood as:",
          "options": [
            {
              "text": "A purely psychological problem to be treated with insight alone",
              "isCorrect": false
            },
            {
              "text": "An inevitable, untreatable consequence of aging",
              "isCorrect": false
            },
            {
              "text": "A multiply determined difficulty with biological (GSM, SSRI), psychological (depression, beliefs), and relational contributors, each offering a point of intervention",
              "isCorrect": true
            },
            {
              "text": "A problem requiring immediate referral with no role for the generalist",
              "isCorrect": false
            }
          ],
          "correctAnswer": 2,
          "explanation": "The biopsychosocial-lifespan formulation reveals multiple contributors — each an addressable point of entry — which is why an integrated plan succeeds where any single-domain approach would fail.",
          "showExplanation": true
        },
        {
          "type": "text",
          "order": 24,
          "content": "<h2>Substance Use and Sexual Health</h2>\n<p>Substance use intersects with sexual health in ways that are clinically important and frequently unaddressed, and mental health clinicians — who often work with substance use directly — are well positioned to attend to this intersection.</p>\n<h3>Effects on Sexual Function</h3>\n<p>Different substances affect sexual function differently. Alcohol, though often used to reduce inhibition, impairs arousal and performance and, with chronic use, contributes to lasting sexual dysfunction. Stimulants may acutely increase arousal and risk-taking while contributing to dysfunction over time. Opioids are associated with marked suppression of desire and with hormonal effects that impair function. Tobacco contributes to vascular impairment of arousal. Recognizing these effects helps clinicians understand sexual concerns that coincide with substance use and avoid attributing them solely to psychological causes.</p>\n<h3>Sex, Risk, and Recovery</h3>\n<p>Substance use also shapes sexual decision-making and risk: intoxication impairs the capacity to negotiate consent, to assess situations, and to use protection, raising the risk of unwanted experiences, sexually transmitted infection, and unintended pregnancy. In recovery, sexuality presents its own challenges: people who have only ever experienced sex while using substances may face anxiety about sober sexual experience, and sexual situations can function as relapse triggers. Addressing sexuality as part of recovery — rather than treating it as a separate or taboo topic — supports both sexual health and sustained recovery, and is an appropriate focus for clinicians working in this area.</p>"
        },
        {
          "type": "text",
          "order": 25,
          "content": "<h2>Sexual Health After Surgery and Medical Procedures</h2>\n<p>Beyond cancer, a range of surgeries and medical procedures carry sexual consequences that are routinely under-addressed by the medical teams performing them, leaving an opening for the mental health clinician who simply asks.</p>\n<h3>Common Examples</h3>\n<p>Hysterectomy, prostate surgery, and other pelvic procedures can affect sensation, function, and body image. The creation of an ostomy reshapes a person's relationship to their body and frequently generates anxiety about intimacy and desirability. Cardiac procedures, joint replacements, and recovery from serious illness or injury all raise questions — often unspoken — about when and how to resume sexual activity, and about whether it is safe. As with cardiac events, fear-based avoidance frequently outlasts any actual medical restriction, and accurate information paired with permission to resume is itself an intervention.</p>\n<h3>The Clinical Task</h3>\n<p>The clinician's task is to normalize sexuality as a legitimate part of recovery, to help clients and partners communicate about changes and fears, to correct misinformation about safety (while directing specific medical questions to the appropriate provider), and to support the renegotiation of intimacy that major medical events require. For many clients, simply being asked about their sexual recovery — when no one else on their care team has raised it — is what allows them to address a concern they had assumed they must simply endure.</p>"
        },
        {
          "type": "text",
          "order": 26,
          "content": "<h2>Coordinating Care: The Mental Health Clinician on an Interdisciplinary Team</h2>\n<p>Because sexual health sits at the intersection of physical, psychological, relational, and social factors, effective care is frequently interdisciplinary, and the mental health clinician occupies a distinctive and valuable position on the team.</p>\n<h3>The Clinician's Distinctive Contribution</h3>\n<p>Medical providers may address the biological dimension but frequently lack the time, training, or comfort to address the psychological and relational dimensions; the mental health clinician supplies exactly these. The clinician can hold the integrated biopsychosocial formulation that no single discipline captures alone, can address the meaning a sexual concern holds for the client, can work with the relational and communication factors that medical care does not reach, and can provide the permission-giving and supportive presence that the medical encounter rarely affords.</p>\n<h3>Effective Coordination</h3>\n<p>Effective coordination requires appropriate consent and information-sharing, clear communication with the other providers about respective roles, and a collaborative rather than siloed stance. The mental health clinician frequently functions as the consistent presence who helps the client integrate the contributions of multiple providers — the urologist or gynecologist, the pelvic floor physical therapist, the prescriber, the sex therapist — into a coherent whole. In this role the clinician does not need to be the expert on every dimension; they need to recognize the dimensions, ensure each is addressed by someone competent, and help the client make sense of the whole. That integrative function is the essence of competent generalist sexual health practice across the lifespan.</p>"
        },
        {
          "type": "text",
          "order": 28,
          "content": "<h2>Sexual Health and Caregiving</h2>\n<p>The sexual lives of family caregivers represent another systematically overlooked dimension of sexual health, and one that mental health clinicians who work with caregivers are well positioned to address.</p>\n<h3>The Caregiver's Own Sexuality</h3>\n<p>People caring for an ill or disabled partner, parent, or child experience profound effects on their own sexuality and intimate relationships. When the care recipient is a partner, the relationship may shift from partnership toward a caregiving dynamic that erodes the conditions for sexual intimacy, and both partners may grieve the change. Caregiver exhaustion, depression, and the sheer absence of time and privacy suppress desire and opportunity. Caregivers frequently feel guilt about their own sexual needs in the context of a loved one's suffering, and rarely have any space in which to speak about it.</p>\n<h3>The Clinical Opening</h3>\n<p>The clinician who works with caregivers can offer that space: acknowledging that the caregiver's own needs — including sexual and relational ones — remain legitimate, helping caregiving couples preserve or renegotiate intimacy where possible, and normalizing the complicated feelings that arise. As with so much of sexual health practice, simply naming the topic as legitimate is the intervention most caregivers have never been offered.</p>"
        },
        {
          "type": "text",
          "order": 29,
          "content": "<h2>Telehealth and Sexual Health Conversations</h2>\n<p>As telehealth has become a routine mode of mental health care, clinicians need to consider how the sexual health conversation translates to the remote setting, where both new opportunities and new considerations arise.</p>\n<h3>Opportunities and Considerations</h3>\n<p>For some clients, the relative distance of telehealth lowers the barrier to discussing sensitive sexual material, and the ability to participate from home can make care accessible to clients who could not otherwise reach it. At the same time, the remote setting raises specific considerations. Privacy is paramount: the clinician confirms that the client is in a private space where they can speak freely, recognizing that a client may not be safe or able to discuss sexual concerns — or to disclose coercion or violence — if another person is within earshot. The clinician also attends to the reduced access to nonverbal cues, checking in more deliberately about the client's emotional state during sensitive material.</p>\n<h3>Maintaining Standards Remotely</h3>\n<p>The core principles of sexual health practice — permission, normalization, accurate information, trauma-informed sensitivity, and clear boundaries — apply identically in telehealth. The clinician simply adapts their implementation to the medium, taking particular care with privacy, safety, and the confirmation that the client is able to engage in the conversation freely and securely.</p>"
        },
        {
          "type": "text",
          "order": 30,
          "content": "<h2>Body Image and Sexual Self-Concept</h2>\n<p>Body image and sexual self-concept exert a powerful influence on sexual experience across the entire lifespan, and they intersect with nearly every theme of this course — aging, illness, disability, treatment effects, and cultural messages about bodies and desirability.</p>\n<h3>How Body Image Shapes Sexuality</h3>\n<p>Negative body image interferes with sexual experience through several mechanisms: it fuels spectatoring (self-monitoring during sex that pulls attention away from pleasure and connection), drives avoidance of sexual situations, and undermines the sense of being a desirable and sexual person. Cultural messages that equate sexual worth with a narrow standard of appearance, the bodily changes of aging, the alterations wrought by illness and treatment, and the effects of weight, disability, and difference all shape sexual self-concept — frequently in ways that generate distress disproportionate to anything about actual function.</p>\n<h3>The Clinical Focus</h3>\n<p>Addressing body image and sexual self-concept is therefore an important and accessible focus of sexual health work. Helping clients shift attention from self-monitoring to present-moment experience, challenging the internalized standards that equate worth with appearance, and supporting an expanded and more compassionate relationship with one's own body frequently improve sexual wellbeing even when no change in physical function occurs. This work is especially central for clients navigating the bodily changes of aging, illness, and treatment that recur throughout the lifespan.</p>"
        },
        {
          "type": "text",
          "order": 31,
          "content": "<h2>Sexual Communication: Helping Clients Talk With Partners</h2>\n<p>Many sexual concerns are sustained not by dysfunction but by the absence of effective communication between partners, and helping clients communicate about sex is one of the most broadly useful interventions in sexual health practice.</p>\n<h3>Why Sexual Communication Is Hard</h3>\n<p>Sexual communication is difficult for most people, who have rarely been taught how to do it and who fear that raising a concern will hurt or offend a partner. The result is that partners frequently make consequential assumptions about each other's desires, satisfaction, and difficulties without ever checking them — assumptions that, when wrong, generate distance, resentment, and unaddressed problems. The desire-discrepancy and pursuer-distancer dynamics described earlier are sustained largely by failures of communication.</p>\n<h3>Building the Skill</h3>\n<p>Clinicians help by normalizing the difficulty, by coaching clients to express desires and concerns directly and non-blamefully, by helping partners listen without defensiveness, and by reframing sexual communication as an ongoing collaborative process rather than a one-time conversation. Even brief, well-targeted communication coaching frequently produces meaningful improvement, because it addresses a maintaining factor common to a wide range of sexual concerns. This skill complements every other intervention in this course, from reframing desire discrepancy to renegotiating intimacy after illness.</p>"
        },
        {
          "type": "text",
          "order": 38,
          "content": "<h2>Bringing It Together: Sexual Health Across the Whole Lifespan</h2>\n<p>This course has traced sexual health from infancy through later life, across health and illness, ability and disability, and the full diversity of identities, cultures, and relationships. Several threads run through the whole.</p>\n<p>First, sexual health is a general clinical competency, not a specialty: every clinician can and should raise the topic, screen with a biopsychosocial and lifespan lens, and provide permission and accurate information. Second, the silence that surrounds sexual health is itself the central problem, and the single most consequential act a clinician performs is simply to ask. Third, sexual concerns are almost always multiply determined, which is why the integrated biopsychosocial-lifespan formulation succeeds where single-domain accounts fail. Fourth, affirming, non-pathologizing, culturally humble practice — grounded in disciplined non-assumption and in respect for each client's self-determination — is the stance that competent sexual health care requires with every client. And fifth, knowing the limits of one's scope and referring well is as much a part of competence as any technique.</p>\n<p>The generalist clinician who carries these principles into practice will not become a sex therapist, and does not need to. They will become a clinician who closes the silence — who ensures that sexual health, a fundamental dimension of human wellbeing across the entire lifespan, is no longer the dimension their clients are left to navigate alone.</p>"
        },
        {
          "type": "multipleChoice",
          "order": 33,
          "question": "A recurring theme across this course is that the single most consequential act a generalist clinician performs in sexual health care is to:",
          "options": [
            {
              "text": "Provide intensive sex therapy",
              "isCorrect": false
            },
            {
              "text": "Diagnose a sexual dysfunction",
              "isCorrect": false
            },
            {
              "text": "Simply ask about sexual health routinely, closing the clinical silence",
              "isCorrect": true
            },
            {
              "text": "Refer every client to a specialist",
              "isCorrect": false
            }
          ],
          "correctAnswer": 2,
          "explanation": "Because clinical silence is the central barrier, routinely asking — closing that silence — is the highest-impact act available to every clinician, regardless of specialization.",
          "showExplanation": true
        },
        {
          "type": "reflection",
          "order": 39,
          "prompt": "After this course, what is one concrete change you will make to how you assess or respond to sexual health in your practice?",
          "placeholder": "Reflect..."
        }
      ]
    }
  ]
};

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected.');
  const doc = await Course.findOne({ slug: COURSE_DATA.slug });
  if (!doc) { console.error('CR-303 not found by slug', COURSE_DATA.slug); process.exit(1); }

  // Assign expanded fields onto the existing document.
  for (const k of Object.keys(COURSE_DATA)) doc[k] = COURSE_DATA[k];
  doc.modules = undefined; // clear stale modules[] so only sections[] remain
  doc.markModified('sections');
  doc.markModified('assessment');

  await doc.save(); // triggers pre-save wordCount hook + schema validation
  const fresh = await Course.findById(doc._id).lean();
  console.log('Saved. Sections:', fresh.sections?.length, '| wordCount:', fresh.wordCount, '| accessType:', fresh.accessType, '| status:', fresh.status);

  await mongoose.disconnect();
  console.log('Done.');
}
main().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
