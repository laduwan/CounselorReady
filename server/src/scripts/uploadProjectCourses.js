#!/usr/bin/env node
/**
 * uploadProjectCourses.js
 * Uploads courses from /mnt/project that are ready
 * - CR-601 Cultural Competence & Ethics (3 CE)
 * - DBT course (if not already uploaded via seedDBTCourse.js)
 * 
 * Run: node uploadProjectCourses.js
 */

import mongoose from 'mongoose';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

// ============================================================
// CR-601: Cultural Competence, Ethics & Risk Reduction (3 CE)
// ============================================================

const CR601_COURSE = {
  code: 'CR-601',
  title: 'Foundations of Cultural Competence, Ethics, and Risk Reduction',
  slug: 'cultural-competence-ethics-risk-reduction',
  ceHours: 3,
  credits: 3,
  category: 'Ethics',
  level: 'Intermediate',
  contentArea: 'Cultural Competence and Ethics',
  description: 'This 3-hour continuing education course provides foundational training in cultural competence and cultural humility for professional counselors and mental health practitioners. Emphasis is placed on ethical responsibilities, clinical decision-making, documentation practices, and informed consent as they relate to multicultural counseling and professional liability risk. The course integrates ethical standards from the American Counseling Association (ACA) and the National Board for Certified Counselors (NBCC) with applied risk-management principles commonly emphasized by professional liability insurers.',
  targetAudience: [
    'Licensed Professional Counselors (LPC)',
    'Licensed Mental Health Counselors (LMHC)',
    'National Certified Counselors (NCC)',
    'Licensed Clinical Social Workers (LCSW)',
    'Licensed Marriage and Family Therapists (LMFT)',
    'Psychologists',
    'Psychiatric Nurse Practitioners',
    'Graduate-level Counseling Students'
  ],
  objectives: [
    'Define cultural competence and cultural humility as ethical obligations embedded within the ACA Code of Ethics and NBCC Code of Ethics',
    'Identify at least three ways that cultural bias, power differentials, and worldview differences contribute to ethical violations and malpractice claims',
    'Describe how implicit bias affects clinical processes including diagnosis, risk assessment, treatment planning, and therapeutic alliance',
    'Apply at least two evidence-based strategies for assessing and managing implicit bias in clinical practice',
    'Develop culturally responsive informed consent procedures that address language accessibility, decision-making norms, and power dynamics',
    'Implement documentation practices that reflect cultural considerations, clinical reasoning, and adherence to ethical standards',
    'Analyze at least three ethical dilemmas where cultural values intersect with clinical judgment and legal obligations',
    'Evaluate the adequacy of one's own cultural competence and develop a personalized continuing education plan'
  ],
  
  modules: [
    {
      title: 'Module 1: Introduction to Cultural Competence',
      order: 1,
      lessons: [{
        title: 'Introduction to Cultural Competence',
        order: 1,
        type: 'text',
        content: `<h2>Introduction to Cultural Competence</h2>
        
        <p>Cultural competence represents far more than an aspirational ideal in professional counseling—it constitutes a fundamental ethical obligation, a risk-management necessity, and a clinical competency without which effective therapeutic work cannot occur. This course provides a comprehensive examination of cultural competence from multiple vantage points: as an ethical mandate embedded within professional codes, as a legally enforceable standard of care subject to regulatory oversight and malpractice litigation, and as a dynamic set of knowledge, awareness, and skills that must be developed and refined throughout one's professional career.</p>

        <p>The mental health profession has moved far beyond the position that cultural competence is a specialized practice area relevant only to those who work with "diverse" populations. Current ethical standards and legal precedents establish cultural competence as a universal professional responsibility applicable to all client-counselor relationships regardless of the apparent demographic match between counselor and client. Every therapeutic encounter occurs within cultural contexts—multiple, intersecting, and complex contexts that shape the client's identity, worldview, help-seeking behavior, and response to intervention. Every therapeutic encounter also occurs within cultural contexts belonging to the counselor, whose own intersecting identities and cultural socializations inevitably influence clinical perception, diagnostic reasoning, and therapeutic approach. The question is never whether culture is relevant to a particular case but rather how culturally informed the counselor's practice will be.</p>

        <h3>Cultural Identity and Intersectionality</h3>
        
        <p>Every individual holds multiple intersecting identities that influence how they experience the world, access resources, and encounter barriers. These identities include but are not limited to race, ethnicity, gender identity, sexual orientation, disability status, socioeconomic status, spirituality and religious affiliation, immigration and documentation status, age, language, education level, and geographic location. Intersectionality, a framework originally articulated by legal scholar Kimberlé Crenshaw (1991), describes how these identities create layered and compounding experiences of privilege or marginalization that cannot be understood by examining any single dimension of identity in isolation.</p>

        <p>For clinical practice, the concept of intersectionality has profound implications. A Black woman experiencing postpartum depression, for example, cannot be adequately served by an approach that addresses her gender without considering the effects of racial discrimination on her healthcare experiences, or that addresses her racial identity without recognizing the specific vulnerabilities associated with postpartum mood disorders. Her experience exists at the intersection of these identities, and her clinical presentation, help-seeking behavior, trust in the therapeutic relationship, and response to treatment recommendations will all be shaped by this intersection.</p>

        <h3>Systemic and Historical Context</h3>
        
        <p>Culturally informed practice requires more than awareness of individual differences; it demands understanding of the historical injustices and systemic structures that have shaped the experiences of marginalized communities. The mental health profession itself has a troubled history regarding cultural diversity that continues to affect how diverse clients perceive and engage with professional services. From the pathologization of homosexuality in the Diagnostic and Statistical Manual of Mental Disorders to the Tuskegee syphilis study's devastating impact on Black Americans' trust in healthcare systems, the helping professions have caused significant harm to communities that counselors now serve.</p>

        <p>Racialized trauma represents one of the most significant systemic factors affecting clinical presentations in diverse populations. Research consistently demonstrates that experiences of racial discrimination produce measurable physiological and psychological effects, including elevated cortisol levels, increased allostatic load, heightened vigilance, and cumulative stress responses that mirror the symptom profiles of anxiety and trauma-related disorders. A clinician who treats these presentations as purely intrapsychic phenomena—without acknowledging the ongoing systemic stressors that produce and maintain them—is not providing culturally competent care.</p>`,
        textContent: 'Introduction to Cultural Competence. Cultural competence represents far more than an aspirational ideal...',
        duration: 30
      }]
    },
    
    {
      title: 'Module 2: The Ethical Mandate',
      order: 2,
      lessons: [{
        title: 'Professional Codes and Standards',
        order: 1,
        type: 'text',
        content: `<h2>The Ethical Mandate: Professional Codes and Standards</h2>
        
        <p>The ACA Code of Ethics (2014) addresses cultural competence across multiple sections, establishing it as a pervasive ethical obligation rather than a narrow specialization. Standard A.2.c. (Developmental and Cultural Sensitivity) states that counselors must "communicate information in ways that are both developmentally and culturally appropriate." Standard A.4.b. (Personal Values) requires counselors to be aware of and avoid imposing their values, attitudes, beliefs, and behaviors upon clients.</p>

        <p>The NBCC Code of Ethics similarly emphasizes cultural competence as a core professional responsibility. Directive 5 requires that National Certified Counselors "shall make reasonable efforts to understand the cultural backgrounds and worldviews of their clients and shall provide services that are sensitive to these considerations."</p>

        <h3>Enforcement and Consequences</h3>
        
        <p>What is significant about these ethical provisions is not merely their existence but their enforceability. Licensing boards increasingly cite cultural competence failures as grounds for disciplinary action, and professional liability insurers identify cultural incompetence as a contributing factor in malpractice claims. A counselor who uses a standardized assessment instrument without considering its cultural validity, who fails to provide informed consent in a language the client can understand, who applies a treatment modality that contradicts the client's deeply held cultural or spiritual beliefs without adequate discussion and documentation, or who makes diagnostic decisions influenced by cultural stereotypes rather than clinical evidence is practicing below the standard of care.</p>

        <p>The legal and professional consequences of these failures can include ethics complaints, licensure sanctions, malpractice litigation, and increased insurance premiums. Courts and licensing boards evaluate clinical practice against the prevailing professional standards at the time the care was provided, and those standards have become progressively more specific and demanding over the past two decades.</p>

        <h3>Knowledge Check</h3>
        <div class="knowledge-check">
          <p><strong>Question:</strong> Which of the following best describes the current professional standard regarding cultural competence?</p>
          <ul>
            <li>A) Cultural competence is a universal professional responsibility applicable to all counseling relationships</li>
            <li>B) Cultural competence is only necessary when working with "diverse" populations</li>
            <li>C) Cultural competence is an aspirational goal but not an enforceable standard</li>
            <li>D) Cultural competence training is only required in certain states</li>
          </ul>
          <p><em>Correct Answer: A - Cultural competence is now established as a universal professional responsibility in current ethical codes and legal standards.</em></p>
        </div>`,
        textContent: 'The Ethical Mandate: Professional Codes and Standards. The ACA Code of Ethics addresses cultural competence...',
        duration: 30
      }]
    },

    {
      title: 'Module 3: Implicit Bias and Clinical Decision-Making',
      order: 3,
      lessons: [{
        title: 'Understanding Implicit Bias',
        order: 1,
        type: 'text',
        content: `<h2>Implicit Bias and Clinical Decision-Making</h2>
        
        <p>Implicit biases are attitudes, stereotypes, and associations that operate outside conscious awareness and control, yet significantly influence perception, judgment, and behavior. Unlike explicit biases, which involve conscious endorsement of prejudiced beliefs, implicit biases can exist even in individuals who genuinely value equality and consciously reject stereotyping. The existence of implicit bias does not indicate moral failure or deliberate discrimination; it reflects the reality that human brains are pattern-recognition systems shaped by repeated exposure to cultural messages, media representations, and societal structures.</p>

        <h3>Mechanisms of Implicit Bias</h3>
        
        <p>Research using the Implicit Association Test and other experimental paradigms has demonstrated that implicit racial bias affects clinical judgment across multiple domains: diagnostic assessment, risk evaluation, pain management, treatment planning, and prognostic predictions. Studies consistently find that clinicians exhibit implicit racial bias at rates comparable to the general population and that these biases predict differential treatment recommendations even when clinical presentations are identical.</p>

        <p>One particularly troubling manifestation of implicit bias involves the misdiagnosis or underdiagnosis of psychiatric conditions in racial and ethnic minority populations. Research demonstrates that Black clients presenting with mood symptoms are significantly more likely to receive diagnoses of schizophrenia or psychotic disorders compared to White clients with identical symptom profiles. This pattern persists even when controlling for clinical severity, socioeconomic status, and other confounding variables.</p>

        <h3>Strategies for Managing Implicit Bias</h3>
        
        <p>The first step in addressing implicit bias is acknowledging its existence. Clinicians who believe themselves to be "color-blind" or who insist that they "treat everyone the same" are actually more vulnerable to bias effects because they have disabled the monitoring systems that might otherwise detect bias-driven errors in clinical reasoning. Research consistently demonstrates that awareness of bias, combined with motivation to correct for it, can reduce bias effects.</p>

        <p>Evidence-based strategies for managing implicit bias include: structured assessment protocols that reduce reliance on subjective clinical impressions, consultation and peer review processes that introduce multiple perspectives, cultural formulation interviews that systematically elicit the client's cultural identity and explanatory models, and deliberate perspective-taking exercises that promote understanding of the client's lived experience.</p>

        <h3>Knowledge Check</h3>
        <div class="knowledge-check">
          <p><strong>Question:</strong> Implicit bias is best understood as:</p>
          <ul>
            <li>A) Conscious prejudice that should be eliminated through awareness alone</li>
            <li>B) Automatic associations that operate outside conscious awareness and require systematic strategies to manage</li>
            <li>C) A moral failing that indicates the clinician should not work with diverse populations</li>
            <li>D) Irrelevant to clinical practice if the clinician values cultural diversity</li>
          </ul>
          <p><em>Correct Answer: B - Implicit bias involves automatic associations requiring systematic management strategies.</em></p>
        </div>`,
        textContent: 'Implicit Bias and Clinical Decision-Making. Implicit biases are attitudes and stereotypes that operate outside conscious awareness...',
        duration: 40
      }]
    },

    {
      title: 'Module 4: Culturally Responsive Informed Consent',
      order: 4,
      lessons: [{
        title: 'Informed Consent Across Cultures',
        order: 1,
        type: 'text',
        content: `<h2>Culturally Responsive Informed Consent</h2>
        
        <p>Informed consent represents both a legal requirement and an ethical cornerstone of professional practice, yet standard informed consent procedures often fail to account for cultural variations in communication norms, decision-making processes, power dynamics, and conceptualizations of autonomy and privacy. A truly informed consent process must be culturally responsive—adapted to the client's cultural context, language proficiency, health literacy level, and worldview.</p>

        <h3>Language and Accessibility</h3>
        
        <p>The most fundamental aspect of culturally responsive informed consent involves ensuring that consent information is provided in a language the client can understand. This requirement extends beyond mere translation to include attention to health literacy, use of plain language rather than clinical jargon, and verification of understanding through teach-back methods. For clients with limited English proficiency, providing consent documents only in English—or providing documents that have been poorly translated using automated translation services—constitutes a failure to obtain valid informed consent and creates significant legal liability.</p>

        <h3>Cultural Models of Decision-Making</h3>
        
        <p>Western bioethics and mental health practice emphasize individual autonomy as the primary value governing informed consent. However, many cultural groups employ collective or family-centered models of decision-making in which major health decisions are made in consultation with family members, elders, or religious advisors rather than by the individual alone. Counselors working with clients from collectivist cultural backgrounds must navigate the tension between respecting cultural norms around decision-making and meeting legal requirements for individual informed consent.</p>

        <p>Best practice involves explicitly discussing decision-making preferences during the informed consent process, documenting the client's preferences regarding family involvement, and creating consent procedures that honor those preferences to the extent legally permissible. This might involve inviting family members to participate in treatment planning discussions, providing information to designated family spokespersons with the client's written authorization, or structuring treatment recommendations in ways that acknowledge family and community considerations.</p>`,
        textContent: 'Culturally Responsive Informed Consent. Informed consent represents both a legal requirement and ethical cornerstone...',
        duration: 35
      }]
    },

    {
      title: 'Module 5: Documentation and Risk Management',
      order: 5,
      lessons: [{
        title: 'Culturally Informed Documentation',
        order: 1,
        type: 'text',
        content: `<h2>Documentation and Risk Management</h2>
        
        <p>Clinical documentation serves multiple purposes: it facilitates continuity of care, supports treatment planning, demonstrates medical necessity for reimbursement, and provides a legal record of clinical reasoning and decision-making. From a cultural competence and risk management perspective, documentation must reflect not only what the clinician did but also why particular clinical decisions were made, including how cultural factors informed those decisions.</p>

        <h3>The Cultural Formulation Interview</h3>
        
        <p>The DSM-5 includes a Cultural Formulation Interview (CFI) designed to systematically assess cultural factors that may affect diagnosis and treatment. The CFI addresses four key domains: cultural definition of the problem, cultural perceptions of cause and context, cultural factors affecting self-coping and past help-seeking, and cultural factors affecting current help-seeking. Incorporating CFI elements into intake documentation demonstrates cultural competence and provides valuable clinical information.</p>

        <h3>Documenting Cultural Reasoning</h3>
        
        <p>Effective risk management requires that clinical records document the reasoning process behind diagnostic and treatment decisions, particularly when cultural factors influence those decisions. For example, if a clinician decides not to use a standardized depression screening instrument because of concerns about its cultural validity for a particular client, that decision and its rationale should be documented. If a client's religious beliefs influence treatment planning—for instance, a preference for prayer and pastoral counseling over psychotropic medication—the documentation should reflect that these preferences were discussed, that the clinician provided information about evidence-based treatments, and that the treatment plan was developed collaboratively.</p>

        <h3>Knowledge Check</h3>
        <div class="knowledge-check">
          <p><strong>Question:</strong> Which statement best describes culturally informed documentation?</p>
          <ul>
            <li>A) Cultural factors should only be documented when working with "diverse" clients</li>
            <li>B) Documentation should reflect how cultural factors informed clinical reasoning and decision-making for all clients</li>
            <li>C) Mentioning the client's race or ethnicity in documentation is sufficient</li>
            <li>D) Cultural information should be kept separate from clinical notes</li>
          </ul>
          <p><em>Correct Answer: B - Documentation should reflect cultural reasoning for all clients as part of comprehensive clinical practice.</em></p>
        </div>`,
        textContent: 'Documentation and Risk Management. Clinical documentation serves multiple purposes and must reflect cultural considerations...',
        duration: 30
      }]
    },

    {
      title: 'Module 6: Ethical Decision-Making with Cultural Considerations',
      order: 6,
      lessons: [{
        title: 'Navigating Cultural Ethical Dilemmas',
        order: 1,
        type: 'text',
        content: `<h2>Ethical Decision-Making with Cultural Considerations</h2>
        
        <p>Ethical dilemmas in culturally diverse practice often arise when cultural values, client preferences, professional obligations, and legal requirements come into conflict. These situations require careful ethical reasoning that acknowledges the legitimacy of multiple perspectives while maintaining professional and legal boundaries. There are rarely simple right answers to these dilemmas, but there are more and less ethically defensible ways to navigate them.</p>

        <h3>Common Cultural-Ethical Dilemmas</h3>
        
        <p>One frequently encountered dilemma involves conflicts between client autonomy and beneficence when cultural or religious beliefs lead clients to refuse treatments that clinicians consider medically necessary. Another common scenario involves mandatory reporting requirements when cultural norms around child-rearing practices differ from legal definitions of abuse or neglect. A third area of tension involves confidentiality and privacy when working with clients from collectivist cultures where family involvement in treatment is expected.</p>

        <h3>Ethical Decision-Making Framework</h3>
        
        <p>Several ethical decision-making models can guide clinicians through culturally complex situations. The model developed by Forester-Miller and Davis (2016) involves seven steps: identify the problem, apply the ACA Code of Ethics, determine the nature and dimensions of the dilemma, generate potential courses of action, consider potential consequences, evaluate the selected course of action, and implement the decision. When cultural factors are prominent, this framework should be supplemented with explicit attention to how cultural worldviews influence problem definition, stakeholder identification, and consequence evaluation.</p>

        <p>Consultation represents a critical component of ethical decision-making in culturally complex cases. This may involve consultation with colleagues who share the client's cultural background, consultation with cultural community leaders or cultural brokers, ethics committee consultation, or legal consultation when relevant statutes and regulations are unclear.</p>`,
        textContent: 'Ethical Decision-Making with Cultural Considerations. Ethical dilemmas in diverse practice often arise from conflicts...',
        duration: 35
      }]
    }
  ],

  assessment: {
    questions: [
      {
        id: 'q1',
        question: 'According to current professional standards, cultural competence in counseling is best understood as:',
        type: 'multiple-choice',
        options: [
          { id: 'a', text: 'A specialized practice area relevant only for counselors working with "diverse" populations', isCorrect: false },
          { id: 'b', text: 'A universal professional responsibility applicable to all client-counselor relationships', isCorrect: true },
          { id: 'c', text: 'An aspirational goal that is encouraged but not ethically mandated', isCorrect: false },
          { id: 'd', text: 'A competency required only in states with diverse populations', isCorrect: false }
        ],
        points: 1,
        feedback: {
          correct: 'Correct! Cultural competence is now established as a universal professional responsibility in current ethical codes.',
          incorrect: 'Cultural competence is a universal professional responsibility applicable to all counseling relationships, not a specialized area.'
        }
      },
      {
        id: 'q2',
        question: 'Intersectionality in clinical practice refers to:',
        type: 'multiple-choice',
        options: [
          { id: 'a', text: 'The point where different highways cross in urban planning', isCorrect: false },
          { id: 'b', text: 'How multiple intersecting identities create layered experiences of privilege or marginalization', isCorrect: true },
          { id: 'c', text: 'The overlapping responsibilities of different mental health professionals', isCorrect: false },
          { id: 'd', text: 'A technique for managing conflicts between cultural values and clinical judgment', isCorrect: false }
        ],
        points: 1,
        feedback: {
          correct: 'Correct! Intersectionality describes how multiple identities intersect to create unique experiences.',
          incorrect: 'Intersectionality refers to how multiple intersecting identities create complex experiences of privilege or marginalization.'
        }
      },
      {
        id: 'q3',
        question: 'Implicit bias in clinical practice is best described as:',
        type: 'multiple-choice',
        options: [
          { id: 'a', text: 'Conscious prejudice that counselors should eliminate through awareness alone', isCorrect: false },
          { id: 'b', text: 'Automatic associations operating outside conscious awareness that require systematic management strategies', isCorrect: true },
          { id: 'c', text: 'A moral failing indicating the clinician lacks cultural competence', isCorrect: false },
          { id: 'd', text: 'Irrelevant to practice if the clinician values diversity', isCorrect: false }
        ],
        points: 1,
        feedback: {
          correct: 'Correct! Implicit bias involves automatic associations that operate outside conscious awareness and require systematic strategies to manage.',
          incorrect: 'Implicit bias operates automatically outside conscious awareness and requires systematic management strategies, not just awareness.'
        }
      },
      {
        id: 'q4',
        question: 'The ACA Code of Ethics requires that informed consent information be communicated:',
        type: 'multiple-choice',
        options: [
          { id: 'a', text: 'In writing only, using standard forms', isCorrect: false },
          { id: 'b', text: 'In ways that are both developmentally and culturally appropriate', isCorrect: true },
          { id: 'c', text: 'In English, with translations available upon request', isCorrect: false },
          { id: 'd', text: 'Using clinical terminology to ensure accuracy', isCorrect: false }
        ],
        points: 1,
        feedback: {
          correct: 'Correct! The ACA Code of Ethics specifically requires developmental and cultural appropriateness in communication.',
          incorrect: 'The ACA Code of Ethics requires that informed consent be communicated in developmentally and culturally appropriate ways.'
        }
      },
      {
        id: 'q5',
        question: 'When working with clients from collectivist cultures who prefer family-centered decision-making, the counselor should:',
        type: 'multiple-choice',
        options: [
          { id: 'a', text: 'Insist on individual autonomy as the only acceptable approach', isCorrect: false },
          { id: 'b', text: 'Discuss decision-making preferences and honor them to the extent legally permissible', isCorrect: true },
          { id: 'c', text: 'Automatically involve family members without discussing preferences', isCorrect: false },
          { id: 'd', text: 'Avoid discussing family involvement to protect confidentiality', isCorrect: false }
        ],
        points: 1,
        feedback: {
          correct: 'Correct! Best practice involves discussing preferences and honoring them within legal boundaries.',
          incorrect: 'Counselors should discuss decision-making preferences and honor them to the extent legally permissible.'
        }
      },
      {
        id: 'q6',
        question: 'The DSM-5 Cultural Formulation Interview (CFI) addresses which key domains?',
        type: 'multiple-choice',
        options: [
          { id: 'a', text: 'Only the client\'s ethnic and racial background', isCorrect: false },
          { id: 'b', text: 'Cultural definition of problem, perceptions of cause, self-coping, and help-seeking factors', isCorrect: true },
          { id: 'c', text: 'Immigration status and language proficiency only', isCorrect: false },
          { id: 'd', text: 'Religious beliefs and dietary restrictions', isCorrect: false }
        ],
        points: 1,
        feedback: {
          correct: 'Correct! The CFI systematically assesses cultural definition, perceptions, coping, and help-seeking.',
          incorrect: 'The CFI addresses four key domains: cultural definition of problem, perceptions of cause, self-coping, and help-seeking factors.'
        }
      },
      {
        id: 'q7',
        question: 'Research on implicit racial bias in clinical settings demonstrates that:',
        type: 'multiple-choice',
        options: [
          { id: 'a', text: 'Mental health clinicians do not exhibit implicit bias due to their training', isCorrect: false },
          { id: 'b', text: 'Clinicians exhibit implicit bias at rates comparable to the general population', isCorrect: true },
          { id: 'c', text: 'Implicit bias only affects clinicians with no diversity training', isCorrect: false },
          { id: 'd', text: 'Implicit bias has no measurable effect on clinical decisions', isCorrect: false }
        ],
        points: 1,
        feedback: {
          correct: 'Correct! Research shows clinicians exhibit implicit bias similar to the general population.',
          incorrect: 'Research demonstrates that clinicians exhibit implicit bias at rates comparable to the general population, affecting clinical judgment.'
        }
      },
      {
        id: 'q8',
        question: 'Culturally informed documentation should:',
        type: 'multiple-choice',
        options: [
          { id: 'a', text: 'Only mention race or ethnicity without further cultural information', isCorrect: false },
          { id: 'b', text: 'Reflect how cultural factors informed clinical reasoning for all clients', isCorrect: true },
          { id: 'c', text: 'Be kept separate from clinical progress notes', isCorrect: false },
          { id: 'd', text: 'Only be completed for clients from "diverse" backgrounds', isCorrect: false }
        ],
        points: 1,
        feedback: {
          correct: 'Correct! Documentation should reflect cultural reasoning as part of comprehensive clinical practice for all clients.',
          incorrect: 'Documentation should reflect how cultural factors informed clinical reasoning and decision-making for all clients.'
        }
      },
      {
        id: 'q9',
        question: 'When cultural values conflict with professional obligations in an ethical dilemma, the counselor should:',
        type: 'multiple-choice',
        options: [
          { id: 'a', text: 'Always prioritize professional obligations without discussion', isCorrect: false },
          { id: 'b', text: 'Use an ethical decision-making framework that explicitly considers cultural worldviews', isCorrect: true },
          { id: 'c', text: 'Defer entirely to the client\'s cultural preferences', isCorrect: false },
          { id: 'd', text: 'Refer the client to avoid the ethical complexity', isCorrect: false }
        ],
        points: 1,
        feedback: {
          correct: 'Correct! Ethical decision-making should use frameworks that explicitly consider cultural worldviews.',
          incorrect: 'Counselors should use ethical decision-making frameworks that explicitly consider how cultural worldviews influence all aspects of the dilemma.'
        }
      },
      {
        id: 'q10',
        question: 'The ADDRESSING framework helps clinicians consider:',
        type: 'multiple-choice',
        options: [
          { id: 'a', text: 'Only racial and ethnic identity', isCorrect: false },
          { id: 'b', text: 'Multiple dimensions of identity including age, disability, religion, ethnicity, SES, sexual orientation, indigenous heritage, national origin, and gender', isCorrect: true },
          { id: 'c', text: 'Where to send correspondence to the client', isCorrect: false },
          { id: 'd', text: 'How to structure informed consent forms', isCorrect: false }
        ],
        points: 1,
        feedback: {
          correct: 'Correct! The ADDRESSING framework systematically examines multiple intersecting dimensions of identity.',
          incorrect: 'The ADDRESSING framework helps clinicians systematically consider multiple dimensions of identity beyond just race and ethnicity.'
        }
      },
      {
        id: 'q11',
        question: 'Historical trauma in Indigenous and First Nations communities refers to:',
        type: 'multiple-choice',
        options: [
          { id: 'a', text: 'Only traumatic events that occurred in the distant past', isCorrect: false },
          { id: 'b', text: 'Cumulative emotional and psychological wounding transmitted across generations from massive group trauma', isCorrect: true },
          { id: 'c', text: 'Individual trauma experienced by one person in history', isCorrect: false },
          { id: 'd', text: 'Trauma that is no longer relevant to current generations', isCorrect: false }
        ],
        points: 1,
        feedback: {
          correct: 'Correct! Historical trauma refers to intergenerational transmission of trauma effects from massive group trauma experiences.',
          incorrect: 'Historical trauma refers to cumulative wounding transmitted across generations from massive group trauma experiences like genocide and forced removal.'
        }
      },
      {
        id: 'q12',
        question: 'Medical mistrust among diverse populations:',
        type: 'multiple-choice',
        options: [
          { id: 'a', text: 'Is irrational and should be challenged directly', isCorrect: false },
          { id: 'b', text: 'Has legitimate historical foundations and should be acknowledged and validated', isCorrect: true },
          { id: 'c', text: 'Only affects elderly clients who remember past events', isCorrect: false },
          { id: 'd', text: 'Can be eliminated with a single conversation about trust', isCorrect: false }
        ],
        points: 1,
        feedback: {
          correct: 'Correct! Medical mistrust has legitimate historical foundations and acknowledging this can enhance therapeutic rapport.',
          incorrect: 'Medical mistrust has legitimate historical foundations that should be acknowledged and validated, not dismissed as irrational.'
        }
      },
      {
        id: 'q13',
        question: 'Professional liability insurers identify cultural incompetence as:',
        type: 'multiple-choice',
        options: [
          { id: 'a', text: 'Irrelevant to malpractice claims', isCorrect: false },
          { id: 'b', text: 'A contributing factor in malpractice claims and litigation', isCorrect: true },
          { id: 'c', text: 'Only a problem in diverse geographic areas', isCorrect: false },
          { id: 'd', text: 'A concern only for beginning counselors', isCorrect: false }
        ],
        points: 1,
        feedback: {
          correct: 'Correct! Professional liability insurers recognize cultural incompetence as a significant factor in malpractice claims.',
          incorrect: 'Professional liability insurers identify cultural incompetence as a contributing factor in malpractice claims and litigation.'
        }
      },
      {
        id: 'q14',
        question: 'Strategies for managing implicit bias in clinical practice include:',
        type: 'multiple-choice',
        options: [
          { id: 'a', text: 'Denying that bias exists if the clinician values diversity', isCorrect: false },
          { id: 'b', text: 'Structured assessment protocols, consultation, cultural formulation, and perspective-taking', isCorrect: true },
          { id: 'c', text: 'Avoiding work with diverse populations', isCorrect: false },
          { id: 'd', text: 'Relying entirely on clinical intuition', isCorrect: false }
        ],
        points: 1,
        feedback: {
          correct: 'Correct! Evidence-based strategies include structured protocols, consultation, cultural formulation, and perspective-taking.',
          incorrect: 'Effective strategies include structured assessment protocols, consultation, cultural formulation interviews, and deliberate perspective-taking.'
        }
      },
      {
        id: 'q15',
        question: 'The standard of care for cultural competence:',
        type: 'multiple-choice',
        options: [
          { id: 'a', text: 'Has remained constant over the past 30 years', isCorrect: false },
          { id: 'b', text: 'Has become progressively more specific and demanding over time', isCorrect: true },
          { id: 'c', text: 'Varies depending on the clinician\'s personal beliefs', isCorrect: false },
          { id: 'd', text: 'Only applies to licensed professionals, not students', isCorrect: false }
        ],
        points: 1,
        feedback: {
          correct: 'Correct! The standard of care for cultural competence has become increasingly specific and demanding over time.',
          incorrect: 'The standard of care for cultural competence has become progressively more specific and demanding over the past two decades.'
        }
      }
    ],
    passThreshold: 0.80,
    timeLimit: 60,
    allowRetakes: true,
    maxAttempts: 3
  },

  deliveryMethod: 'online',
  status: 'draft',
  isPublished: false,
  format: 'asynchronous',
  language: 'English',
  
  acepProvider: {
    name: 'GA Integrated Therapeutic Perspectives LLC',
    number: '7760'
  },

  createdAt: new Date(),
  updatedAt: new Date()
};

// ============================================================
// MAIN UPLOAD FUNCTION
// ============================================================

async function uploadCourses() {
  try {
    console.log('\n🚀 Uploading Project Courses...\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    // Define Course schema
    const Course = mongoose.connection.models.Course || mongoose.model('Course', new mongoose.Schema({}, { strict: false }));
    
    let created = 0;
    let skipped = 0;
    
    // Upload CR-601
    console.log('📚 Processing: CR-601 - Cultural Competence & Ethics (3 CE)');
    
    const existing601 = await Course.findOne({
      $or: [
        { code: 'CR-601' },
        { title: CR601_COURSE.title }
      ]
    });
    
    if (existing601) {
      console.log('   ⏭️  Already exists, skipping\n');
      skipped++;
    } else {
      // Calculate word count
      const wordCount = CR601_COURSE.modules.reduce((total, module) => {
        return total + module.lessons.reduce((ltotal, lesson) => {
          const text = lesson.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
          return ltotal + text.split(/\s+/).length;
        }, 0);
      }, 0);
      
      console.log(`   📊 CE Hours: ${CR601_COURSE.ceHours}`);
      console.log(`   📑 Modules: ${CR601_COURSE.modules.length}`);
      console.log(`   ❓ Assessment Questions: ${CR601_COURSE.assessment.questions.length}`);
      console.log(`   📝 Word Count: ${wordCount.toLocaleString()}`);
      console.log(`   ✅ ACEP Compliant: ${wordCount >= (CR601_COURSE.ceHours * 6000) ? 'Yes' : 'Needs More Content'}`);
      
      await Course.create(CR601_COURSE);
      console.log('   ✅ Created successfully\n');
      created++;
    }
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 UPLOAD SUMMARY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Created: ${created}`);
    console.log(`⏭️  Skipped (Already Exist): ${skipped}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('📝 Additional Courses in Project:');
    console.log('   • seedDBTCourse.js - DBT Skills Training (6 CE) - Run separately');
    console.log('   • seedNewCourses.js - 5 additional courses - Check if markdown files exist\n');
    
    await mongoose.disconnect();
    console.log('✅ Database connection closed\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

// Run the upload
uploadCourses();
