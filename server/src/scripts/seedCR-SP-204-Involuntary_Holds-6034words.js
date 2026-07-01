import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI not found'); process.exit(1); }

// ═══════════════════════════════════════════════════════════
// CR-SP-204 — When Safety Overrides Consent:
// A Clinician's Guide to Involuntary Psychiatric Holds
// 1 CE | 3 content sections + conclusion | ~6,034 words
// Price: $7.99 | Unlocks: State-by-State Hold Reference Guide
// ═══════════════════════════════════════════════════════════

const EXAM_QUESTIONS = [
  {
    question: "The legal authority for involuntary psychiatric holds is derived from which two governmental powers?",
    type: "multiple_choice",
    options: [
      "Police power and sovereign immunity",
      "Police power and parens patriae authority",
      "Judicial review and police power",
      "Federal supremacy and parens patriae authority"
    ],
    correctAnswer: 1,
    explanation: "Involuntary holds rest on the state's police power (protecting the community from danger) and parens patriae authority (protecting those who cannot protect themselves). Which power is invoked shapes the legal threshold and required documentation."
  },
  {
    question: "In O'Connor v. Donaldson (1975), the Supreme Court held that a state may NOT constitutionally confine an individual who is:",
    type: "multiple_choice",
    options: [
      "Psychotic and refusing medication",
      "Non-dangerous and capable of surviving safely in freedom",
      "Gravely disabled and lacking insight",
      "Dangerous and previously hospitalized"
    ],
    correctAnswer: 1,
    explanation: "O'Connor v. Donaldson established that the state cannot confine a non-dangerous individual capable of surviving in freedom. This defines a constitutional floor below which no state hold statute may fall."
  },
  {
    question: "Which standard of proof did Addington v. Texas (1979) establish as the constitutional minimum for civil commitment?",
    type: "multiple_choice",
    options: [
      "Preponderance of the evidence",
      "Beyond a reasonable doubt",
      "Clear and convincing evidence",
      "Reasonable suspicion"
    ],
    correctAnswer: 2,
    explanation: "Addington established 'clear and convincing evidence' as the constitutional floor — a higher standard than civil preponderance but lower than criminal beyond a reasonable doubt."
  },
  {
    question: "The 'nexus requirement' in hold statutes means:",
    type: "multiple_choice",
    options: [
      "The hold must occur near a licensed psychiatric facility",
      "The dangerousness must result from a mental disorder",
      "The initiating clinician must have a prior relationship with the client",
      "Two licensed clinicians must agree before a hold is initiated"
    ],
    correctAnswer: 1,
    explanation: "The nexus requirement means the dangerous behavior must be caused by a mental illness or disorder. A person who is dangerous without a mental illness, or mentally ill without dangerousness, does not meet the threshold in most jurisdictions."
  },
  {
    question: "A client refuses voluntary hospitalization and states he plans to harm himself 'this weekend.' He has a specific method and access to means. Regarding imminence:",
    type: "multiple_choice",
    options: [
      "The hold threshold is not met because the harm is not occurring right now",
      "The hold threshold may be met because imminence does not require immediacy",
      "Imminence standards apply only to danger to others, not self-harm",
      "The client's refusal of hospitalization negates hold authority"
    ],
    correctAnswer: 1,
    explanation: "Imminence refers to the probability of harm in the near future — typically 24–48 hours — and does not require that harm be occurring at the moment of assessment. A credible plan with means access and stated intent can satisfy the imminence threshold."
  },
  {
    question: "The 'gravely disabled' criterion, where it exists in state law, primarily applies to individuals who:",
    type: "multiple_choice",
    options: [
      "Are treatment-resistant and have a history of chronic mental illness",
      "Cannot provide for their basic needs for food, clothing, or shelter due to a mental disorder",
      "Have previously been hospitalized involuntarily more than once",
      "Are actively non-compliant with prescribed medications"
    ],
    correctAnswer: 1,
    explanation: "Grave disability provides an alternative pathway to a hold for individuals who cannot self-care due to mental illness, even without overt dangerousness. Application requires documentation of specific self-care deficits, not general deterioration."
  },
  {
    question: "A clinician practicing telehealth with a client located in another state must apply hold laws based on:",
    type: "multiple_choice",
    options: [
      "The clinician's state of licensure",
      "The client's physical location at the time of the crisis",
      "The state where the telehealth platform is registered",
      "Federal law, which supersedes state hold statutes"
    ],
    correctAnswer: 1,
    explanation: "Hold authority is governed by the jurisdiction in which the client is physically located at the time of the crisis, not where the clinician is licensed. Clinicians providing cross-state telehealth must know hold procedures in each client's jurisdiction."
  },
  {
    question: "Which of the following BEST demonstrates adequate clinical documentation for a hold decision?",
    type: "multiple_choice",
    options: [
      "'Client expressed suicidal ideation and met criteria for hold'",
      "'Client stated she would use the gun she keeps at home to end her life tonight; declined all alternatives and denied ability to keep herself safe'",
      "'Client was assessed and determined to be a danger to self'",
      "'Hold initiated based on comprehensive risk assessment findings'"
    ],
    correctAnswer: 1,
    explanation: "Documentation must be specific and behavioral, not conclusory. Quoting client statements directly, describing observable behaviors, and naming the specific means and plan supports both the legal justification and the protection of the client's rights."
  },
  {
    question: "The ethical principle most directly in tension with initiating an involuntary hold is:",
    type: "multiple_choice",
    options: [
      "Fidelity",
      "Nonmaleficence",
      "Client autonomy",
      "Social justice"
    ],
    correctAnswer: 2,
    explanation: "Client autonomy — the right to make decisions about one's own life and treatment — is the principle most directly overridden by an involuntary hold. Ethical decision-making requires explicitly weighing autonomy against the duty to protect."
  },
  {
    question: "Documentation for a hold decision MUST include, among other elements:",
    type: "multiple_choice",
    options: [
      "The client's written consent to the hold",
      "Consideration and documented rejection of less restrictive alternatives",
      "Co-signature of a supervisor in all community settings",
      "Evidence of informed consent for involuntary treatment"
    ],
    correctAnswer: 1,
    explanation: "Courts require that involuntary commitment be the least restrictive means available. Documenting that less restrictive options were considered and found insufficient is both an ethical and legal requirement in most jurisdictions."
  },
  {
    question: "Research on racial disparities in involuntary psychiatric holds most consistently indicates:",
    type: "multiple_choice",
    options: [
      "Racial disparities disappear when structured assessment tools are used",
      "Black and Indigenous individuals are overrepresented in involuntary holds",
      "Cultural differences in help-seeking fully explain differential hold utilization",
      "Racial disparities in holds are limited to emergency department settings"
    ],
    correctAnswer: 1,
    explanation: "Research consistently documents that Black and Indigenous individuals are disproportionately subject to involuntary holds. Clinicians must apply hold criteria rigorously and equitably and regularly examine implicit biases that may affect clinical judgment of dangerousness."
  },
  {
    question: "After a client has been involuntarily hospitalized, the first outpatient session should prioritize:",
    type: "multiple_choice",
    options: [
      "Updating the treatment plan and discharge summary without discussing the hospitalization",
      "Processing the client's experience of the hold and collaboratively rebuilding the therapeutic alliance",
      "Conducting a full structured risk assessment before addressing relational content",
      "Referring the client to a higher level of care as a precaution"
    ],
    correctAnswer: 1,
    explanation: "The first post-hold session is clinically significant. Clients often feel betrayal, loss of control, or anger. Creating space to process the experience, validate their responses, and collaboratively revise the safety plan is essential for repairing and strengthening the alliance."
  },
  {
    question: "A client from a marginalized community expresses decreased willingness to discuss suicidal ideation following a hold. This response is BEST understood as:",
    type: "multiple_choice",
    options: [
      "Treatment resistance requiring direct confrontation",
      "An understandable relational response to the experience of coercion",
      "Evidence the client is no longer at significant risk",
      "A reason to reduce session frequency and intensity"
    ],
    correctAnswer: 1,
    explanation: "Decreased disclosure following a hold is a predictable response to the experience of coercion and is especially salient for clients from communities with histories of trauma in psychiatric systems. It should be addressed directly within the therapeutic relationship."
  },
  {
    question: "The companion State-by-State Hold Reference Guide included with this course is designed to:",
    type: "multiple_choice",
    options: [
      "Replace consultation with legal counsel in hold-related decisions",
      "Provide jurisdiction-specific information on hold criteria, duration limits, and initiation procedures",
      "Automatically generate required hold documentation for any state",
      "Serve as the legally binding authority on hold law for all 50 states"
    ],
    correctAnswer: 1,
    explanation: "The State-by-State Hold Reference Guide is a clinical reference tool that summarizes jurisdiction-specific hold criteria, durations, and procedures. It supports competent practice but does not replace legal consultation or knowledge of current state law."
  },
  {
    question: "Which of the following actions is MOST consistent with ethical and legally defensible hold practice?",
    type: "multiple_choice",
    options: [
      "Initiating a hold whenever a client reports any suicidal ideation to minimize clinician liability",
      "Applying hold criteria rigorously, documenting specific clinical reasoning, and seeking consultation when feasible",
      "Deferring all hold decisions exclusively to law enforcement to preserve the therapeutic relationship",
      "Waiting until a client makes a specific attempt before initiating hold procedures"
    ],
    correctAnswer: 1,
    explanation: "Ethical and legally defensible hold practice requires rigorous application of the legal criteria, specific documentation of clinical reasoning, consideration of less restrictive alternatives, and consultation when available — not reflexive utilization or reflexive avoidance."
  }
];

const COURSE_DATA = {
  title: "When Safety Overrides Consent: A Clinician's Guide to Involuntary Psychiatric Holds",
  slug: "when-safety-overrides-consent-involuntary-psychiatric-holds",
  subtitle: "Legal Foundations, Clinical Assessment, and Ethical Decision-Making for Emergency Hold Situations",
  courseCode: "CR-SP-204",
  description: "This 0.75-hour continuing education course equips licensed mental health professionals with the legal knowledge, clinical assessment skills, and ethical decision-making frameworks necessary to navigate involuntary psychiatric holds competently and confidently. Covering constitutional foundations, state-by-state criteria, risk assessment documentation, post-hold care, and equity considerations, this course provides a comprehensive foundation for hold-related practice. Completion unlocks the State-by-State Hold Reference Guide, a jurisdiction-specific clinical tool covering all 50 states and DC.",
  shortDescription: "Essential legal, clinical, and ethical guidance for navigating involuntary psychiatric holds — includes the State-by-State Hold Reference Guide.",
  instructor: "GA Integrated Therapeutic Perspectives LLC",
  ceHours: 0.75,
  credits: 0.75,
  ceuHours: 0.75,
  ceuEligible: true,
  approvingBody: "NBCC",
  approvalNumber: "#7760",
  category: "Special Populations",
  level: "Intermediate",
  contentArea: "Counselor Professional Identity and Practice Issues",
  creditType: "NBCC",
  acepProvider: {
    name: "GA Integrated Therapeutic Perspectives LLC",
    shortName: "GAITP LLC",
    acepNumber: "7760",
    approvalBody: "NBCC"
  },
  presenter: {
    name: "Kejuiana Johnson",
    credentials: "MA, LPC, NCC, CPCS, BC-TMH",
    degree: "MA",
    licenseNumber: "LPC009587",
    licenseState: "Georgia",
    licenseType: "LPC",
    category: "category1"
  },
  targetAudience: [
    "Licensed Professional Counselors (LPC/LPCC)",
    "Licensed Mental Health Counselors (LMHC)",
    "Licensed Clinical Social Workers (LCSW)",
    "Licensed Marriage and Family Therapists (LMFT)",
    "National Certified Counselors (NCC)",
    "Psychologists",
    "Psychiatric Nurse Practitioners"
  ],
  instructionalLevel: "Intermediate",
  deliveryMethod: "online",
  estimatedMinutes: 60,
  objectives: [
    "Define involuntary psychiatric holds and articulate the legal basis for their use under federal constitutional standards and state enabling statutes, including the distinction between police power and parens patriae authority.",
    "Identify the core criteria clinicians must assess when determining whether a client meets the threshold for an involuntary hold, including imminence, dangerousness, mental illness nexus, and grave disability.",
    "Apply ethical decision-making frameworks to the tension between client autonomy and the duty to protect, including documentation of clinical reasoning and consideration of less restrictive alternatives.",
    "Differentiate the clinician's role in the initiation, assessment, and post-hold reintegration of clients who have experienced involuntary psychiatric hospitalization, including culturally responsive practice considerations.",
    "Utilize the companion State-by-State Hold Reference Guide to locate jurisdiction-specific hold criteria, duration limits, initiation authority, and required procedures."
  ],
  contentAreas: ["Ethics", "Legal Issues", "Clinical Practice", "Special Populations"],
  categories: ["Ethics", "Legal Issues", "Crisis Intervention", "Special Populations"],
  tags: ["involuntary hold", "5150", "Baker Act", "crisis", "psychiatric hold", "legal", "ethics", "duty to protect", "risk assessment", "autonomy"],
  price: 7.99,
  accessType: "paid",
  pricingTier: "standard",
  bonusResource: {
    title: "State-by-State Hold Reference Guide",
    description: "Jurisdiction-specific summary of emergency hold criteria, duration limits, initiation authority, and procedural requirements for all 50 states and DC.",
    type: "reference_guide",
    unlockedOnCompletion: true
  },
  isActive: true,
  isFeatured: false,
  status: "draft",
  isPublished: false,
  passingScore: 80,
  maxAttempts: 3,
  accessibility: {
    wcagLevel: "AA",
    screenReaderOptimized: true,
    keyboardNavigable: true,
    colorContrastCompliant: true,
    altTextProvided: true
  },
  settings: {
    passingScore: 80,
    certificateEnabled: true,
    requireEvaluation: true,
    requireAttestation: true
  },

  sections: [

    // ════════════════════════════════════════════════
    // SECTION 1: Legal Foundations
    // ════════════════════════════════════════════════
    {
      title: "Legal Foundations of Involuntary Psychiatric Holds",
      order: 1,
      estimatedTime: 18,
      contentBlocks: [
        {
          type: "sectionDivider",
          order: 1,
          sectionNumber: 1,
          title: "Section 1",
          subtitle: "Legal Foundations of Involuntary Psychiatric Holds",
          accessibility: { role: "heading", ariaLevel: 2 }
        },
        {
          type: "text",
          order: 2,
          title: "Constitutional and Statutory Framework",
          content: `<h2>Constitutional and Statutory Framework</h2>
<p>Involuntary psychiatric holds occupy a distinctive intersection of mental health law, constitutional protections, and clinical practice. At their core, holds represent the state's exercise of two foundational legal powers: the <strong>police power</strong>, which authorizes the government to protect the community from individuals who pose a danger, and <strong>parens patriae authority</strong>, the state's inherent power to protect those who cannot protect themselves. Understanding which power is being invoked matters clinically, because it shapes the legal threshold the clinician must assess and the documentation required to support the hold (Appelbaum, 2004).</p>
<p>When a hold is justified primarily under police power, the focus is on the danger the individual poses to other people or to the broader community. The analysis centers on whether the person's behavior or credible threats constitute a sufficiently serious and proximate risk to warrant deprivation of liberty. When the hold is justified under parens patriae authority, the focus shifts to the individual's inability to protect themselves — their grave disability, their lack of capacity to make informed decisions about their own safety, or their failure to meet basic survival needs as a consequence of mental illness. Many hold situations involve both doctrines simultaneously: the client who is acutely suicidal and refuses all care presents a danger to themselves (parens patriae) and may, depending on the specifics, also present risks to others if the distress extends into outward aggression (police power). Clinicians do not typically need to identify which doctrine is operative, but understanding the distinction helps explain why different elements of the hold criteria carry different evidentiary weight in different situations.</p>
<p>The constitutional framework governing involuntary civil commitment derives primarily from the Fourteenth Amendment's due process clause, which protects individuals from deprivation of liberty without due process of law. The landmark case <em>O'Connor v. Donaldson</em> (1975) established that a state cannot constitutionally confine a non-dangerous individual who is capable of surviving safely in freedom, even if that individual has a diagnosed mental illness. This decision was a watershed moment in mental health law: it explicitly rejected the proposition that mental illness alone, without dangerousness or incapacity, justifies involuntary confinement. <em>Addington v. Texas</em> (1979) further specified that commitment requires evidence meeting at least a "clear and convincing" standard — a burden higher than the civil preponderance standard used in most tort and contract cases, but lower than the criminal beyond-a-reasonable-doubt standard. The Court reasoned that because the consequences of commitment — loss of liberty, stigma, disruption of relationships and employment — are severe, the evidentiary bar must be correspondingly high. These constitutional floors define the minimum protections that all state hold statutes must provide; states may exceed these protections but cannot fall below them (Winick, 2005).</p>
<p>A third foundational case, <em>Zinermon v. Burch</em> (1990), addressed the procedural rights of individuals who may lack capacity to consent to voluntary admission. The Court held that individuals with impaired capacity may have constitutionally protected interests in receiving pre-deprivation process even for nominally voluntary admissions — a ruling with ongoing significance for clinicians working with clients whose decision-making capacity is compromised by psychosis, mania, or severe cognitive impairment. While Zinermon is less frequently cited in daily clinical practice than O'Connor or Addington, it underscores the constitutional complexity of the voluntary/involuntary distinction and the importance of genuine informed consent whenever the clinical picture permits it.</p>
<p>Emergency or short-term psychiatric holds are governed at the state level, and variation across jurisdictions is substantial. Every state has enacted enabling legislation that authorizes designated professionals or law enforcement officers to initiate an emergency hold for a defined period — typically 24 to 72 hours — during which a psychiatric evaluation can be completed and a determination made about the need for further treatment. These statutes specify who may initiate a hold, the criteria that must be met, the maximum hold duration, the hearing procedures that must follow if longer hospitalization is sought, and the rights afforded to the held individual (Hedman et al., 2016). Common examples include California's Welfare and Institutions Code Section 5150 (72-hour hold), Florida's Baker Act (72-hour examination), and Georgia's 1013 form process — but the same underlying structure, with local variation, exists in all fifty states and the District of Columbia.</p>
<p>While the specific language varies, virtually all state hold statutes share a common structural architecture: a person may be held involuntarily when they have a <em>mental illness or disorder</em> and, as a result of that illness, <em>pose a danger to themselves or others</em>, or are <em>gravely disabled</em> and unable to provide for their basic needs. Each element of this structure carries clinical weight, and each must be assessed and documented separately. The nexus requirement between mental illness and dangerousness is particularly critical: a person who is dangerous but not mentally ill, or who is mentally ill but not dangerous, does not meet the legal threshold in most jurisdictions. A clinician who documents only that a client "has a mental health diagnosis and is upset" has not established the legal basis for a hold. The documentation must demonstrate that the mental disorder is the operative cause of the dangerous behavior or grave disability — not merely a co-occurring factor.</p>`,
          accessibility: { hasHeadings: true, readingLevel: "graduate" }
        },
        {
          type: "accordion",
          order: 3,
          title: "Core Hold Criteria: Quick Reference",
          accordionItems: [
            {
              title: "Mental Illness or Disorder",
              content: "A diagnosable psychiatric condition recognized under state law. Cognitive impairment alone (e.g., dementia) does not meet this criterion in most jurisdictions, though it may support a grave disability determination. The presence of mental illness is a necessary but not sufficient condition for a hold."
            },
            {
              title: "Imminent Danger to Self or Others",
              content: "The individual poses a substantial probability of serious harm to themselves or another person in the near future, typically understood as within 24–48 hours. Imminence does not require immediacy — a credible plan with stated intent and access to means can satisfy this element even if the individual is calm at the moment of assessment."
            },
            {
              title: "Nexus Between Mental Illness and Danger",
              content: "The dangerous behavior must be caused by or result from the mental disorder. This is a separate element that must be assessed and documented independently. Someone who is violent for reasons unrelated to mental illness does not meet the hold threshold."
            },
            {
              title: "Grave Disability (Where Applicable)",
              content: "An alternative pathway in many jurisdictions: the person, because of a mental disorder, is unable to provide for basic personal needs such as food, clothing, or shelter. This standard is particularly relevant for individuals with severe psychosis or other conditions that impair self-care without overt dangerousness. Specific deficits must be documented."
            },
            {
              title: "Who May Initiate a Hold",
              content: "State laws vary: most authorize law enforcement officers, licensed mental health professionals (LPC, LCSW, psychologist, LMFT), licensed physicians, and in some states designated crisis clinicians. Clinicians practicing telehealth across state lines must apply the hold laws of the client's physical location — not their own state of licensure."
            }
          ]
        },
        {
          type: "text",
          order: 4,
          title: "The Imminent Danger Standard",
          content: `<h2>The Imminent Danger Standard</h2>
<p>Among the criteria clinicians must assess, imminence is among the most frequently misunderstood and most consequential. The term "imminent danger" does not appear uniformly in hold statutes; some jurisdictions use "likely to result in harm," others "substantial probability," and still others "serious and imminent risk." These variations matter because they define the evidentiary threshold the clinician must meet to justify initiating a hold (Monahan et al., 2001). Before initiating a hold, the clinician should know the precise language their jurisdiction uses — because the words "likely," "substantial probability," and "imminent" carry different evidentiary weights, and the documentation that supports one framing may not satisfy another.</p>
<p>Clinically, imminence refers to the probability that dangerous behavior will occur in the near future — typically within 24 to 48 hours — though statutes rarely specify a timeframe. Assessing imminence requires the clinician to evaluate not only what the client is saying but also behavioral indicators, access to means, the specificity of any plan, and the presence or absence of protective factors. A client who articulates a detailed plan, has access to a lethal means, has a history of prior attempts, and lacks social support represents a very different risk profile than one expressing passive suicidal ideation without intent, plan, or means. The Columbia Suicide Severity Rating Scale (C-SSRS) provides a structured framework for distinguishing active ideation with intent and plan from passive ideation, and its use — along with documentation of the specific items endorsed — strengthens the clinical record.</p>
<blockquote><strong>Clinical Note:</strong> Imminence is not synonymous with immediacy. A client who credibly states they will act "this weekend" when they are alone may meet an imminence threshold even if the immediate moment of assessment is relatively calm. Document your reasoning explicitly, citing specific statements, behaviors, and risk factors that informed your clinical judgment.</blockquote>
<p>Several behavioral indicators reliably elevate the clinical assessment of imminence beyond verbal report alone. Final behaviors — giving away valued possessions, saying goodbyes, putting affairs in order, sudden calmness after a period of agitation — are particularly significant and should always be specifically documented when present. Access to means is an independent risk multiplier: a client with a plan involving a firearm who has a loaded weapon at home is at substantially higher imminent risk than one who describes the same plan but has no access to any weapon. Means restriction counseling — asking the client or a trusted third party to remove or secure lethal means — is a well-supported clinical intervention that can reduce imminent risk without requiring a hold, and its consideration should be documented even when not implemented.</p>
<p>The "gravely disabled" criterion provides an alternative pathway to a hold that does not require the clinician to establish dangerousness in the traditional sense. This criterion is particularly relevant for individuals with severe psychosis who have stopped eating, individuals with mania who have been awake for days and are wandering without shelter, or older adults with cognitive impairment who can no longer manage medications or basic hygiene. Applying the grave disability standard requires documentation of specific deficits in basic self-care — not general clinical deterioration — and should be based on observed behavior and collateral information rather than inference alone. In jurisdictions where grave disability is a recognized hold criterion, it offers an important clinical option for clients who are clearly at risk but whose presentation does not neatly fit the dangerousness framework.</p>`
        },
        {
          type: "multipleChoice",
          order: 5,
          question: "A client has a mental illness diagnosis and expresses passive suicidal ideation with no plan, intent, or access to means. He has strong protective factors and engages willingly in safety planning. Regarding the hold threshold:",
          options: [
            "He meets the threshold because he has a mental illness and is expressing suicidal ideation",
            "He likely does not meet the threshold — the nexus and imminence elements are not established",
            "He meets the threshold because all suicidal ideation triggers a hold duty",
            "He meets the threshold only if his clinician feels anxious about his safety"
          ],
          correctAnswer: 1,
          explanation: "Hold criteria require mental illness AND imminent danger resulting from that illness. Passive ideation without plan, intent, means access, or clear imminence does not establish the dangerousness threshold. Over-utilization of holds for clients who do not meet criteria violates autonomy and erodes trust."
        },
        {
          type: "multipleChoice",
          order: 6,
          question: "Which constitutional standard did Addington v. Texas (1979) establish as the minimum required for civil commitment proceedings?",
          options: [
            "Preponderance of the evidence",
            "Reasonable suspicion",
            "Clear and convincing evidence",
            "Beyond a reasonable doubt"
          ],
          correctAnswer: 2,
          explanation: "Clear and convincing evidence is the constitutional floor established by Addington — between the civil preponderance standard and the criminal beyond-a-reasonable-doubt standard. States may require a higher standard but not a lower one."
        }
      ]
    },

    // ════════════════════════════════════════════════
    // SECTION 2: Clinical Assessment & Ethics
    // ════════════════════════════════════════════════
    {
      title: "Clinical Assessment and Ethical Considerations",
      order: 2,
      estimatedTime: 20,
      contentBlocks: [
        {
          type: "sectionDivider",
          order: 1,
          sectionNumber: 2,
          title: "Section 2",
          subtitle: "Clinical Assessment and Ethical Considerations",
          accessibility: { role: "heading", ariaLevel: 2 }
        },
        {
          type: "text",
          order: 2,
          title: "The Clinical Assessment Process",
          content: `<h2>The Clinical Assessment Process</h2>
<p>When a clinician believes a client may require involuntary evaluation, the first obligation is to conduct a thorough, structured risk assessment. This is not a single question or a checkbox exercise; it is a multidimensional clinical inquiry that gathers information from multiple sources, considers both static and dynamic risk and protective factors, and integrates clinical judgment with established assessment tools (Bryan & Rudd, 2018). Thorough documentation of this process serves both clinical and legal functions: it guides decision-making, protects the client's rights by establishing the evidentiary basis for the hold, and protects the clinician should the decision later be questioned by a licensing board, employer, or court.</p>
<p>A comprehensive suicidal risk assessment addresses the following domains. <strong>Current ideation:</strong> Is the client thinking about suicide? How frequently and intensely? Is there intent to act? Is there a specific plan, and how detailed and rehearsed is it? <strong>Access to means:</strong> Does the client have access to the means identified in their plan, or to other lethal means such as firearms, medications, or other instruments? What is the lethality of those means? <strong>History:</strong> Has the client made prior attempts? What was the lethality, what precipitated them, and how were prior crises resolved — particularly whether prior hospitalizations were experienced as helpful or traumatic? <strong>Protective factors:</strong> What reasons does the client identify for living? What social supports are available and reliable? What is the client's current level of engagement with treatment? <strong>Clinical presentation:</strong> Are there signs of hopelessness — a factor more strongly predictive of suicidal behavior than depression severity alone — agitation, intoxication, psychosis, or command hallucinations that would independently elevate risk?</p>
<p>Standardized tools can complement but should not replace clinical judgment. The Columbia Suicide Severity Rating Scale (C-SSRS) is among the most widely validated instruments and provides a structured framework for distinguishing passive ideation, active ideation without intent, ideation with intent but no plan, and ideation with intent and a specific plan — each of which carries different clinical implications. The Patient Health Questionnaire-9 (PHQ-9) item 9 provides a rapid screen suitable for community and primary care settings. The Beck Scale for Suicide Ideation and the SAD PERSONS mnemonic are also in common clinical use. No instrument has sufficient sensitivity and specificity to function as a stand-alone decision-making algorithm. The clinician's role is to integrate information from structured inquiry, behavioral observation, collateral sources when available, and the therapeutic relationship into a formulation that explicitly connects the assessed risk level to the decision made.</p>
<p>Collateral information is frequently underutilized and can be critical. A family member, partner, or close friend may have observed behaviors — giving away possessions, acquiring means, withdrawing from contact, expressing hopelessness — that the client has not disclosed directly. Receiving information from collateral sources does not violate confidentiality in most jurisdictions; sharing information with them requires more careful navigation. HIPAA's emergency exception and most state crisis statutes permit disclosure to protect the client's safety in genuine hold situations. All collateral contact attempts should be documented, whether successful or not, along with the information obtained and how it informed the clinical formulation.</p>`,
        },
        {
          type: "text",
          order: 3,
          title: "Ethical Tensions: Autonomy, Beneficence, and the Duty to Protect",
          content: `<h2>Ethical Tensions: Autonomy, Beneficence, and the Duty to Protect</h2>
<p>Involuntary psychiatric holds represent one of the most ethically complex situations a clinician may face. The fundamental tension is between two core principles: <strong>respect for client autonomy</strong> — the client's right to make decisions about their own life and treatment — and <strong>beneficence combined with nonmaleficence</strong> — the obligation to promote welfare and prevent harm. When a client is in acute psychiatric crisis and at imminent risk, these principles come into direct conflict, and the resolution requires deliberate, structured ethical reasoning rather than reflexive action (Herlihy & Corey, 2015).</p>
<p>The ACA Code of Ethics (2014) addresses this tension in Standard B.2.a, which identifies specific circumstances in which confidentiality may be overridden, including when the client poses a serious and foreseeable risk of danger to themselves or others. The code places the duty to protect in explicit tension with the duty to maintain confidentiality. Kitchener's five-principle model — autonomy, nonmaleficence, beneficence, justice, and fidelity — provides a useful analytical framework. In hold situations, fidelity deserves particular attention: a clinician who invokes a hold contrary to the client's expressed wishes is acting against the client's stated preference in the service of the client's welfare, and must weigh the impact on therapeutic trust, on the client's future willingness to disclose honestly, and on the broader therapeutic relationship.</p>
<blockquote><strong>Ethical Practice Checkpoint:</strong> Before initiating or recommending a hold, ask: (1) Have I conducted a thorough, structured risk assessment? (2) Have I documented specific behaviors and statements that support my concern? (3) Have I considered and documented less restrictive alternatives? (4) Have I consulted with a supervisor or colleague where feasible? (5) Am I acting to protect the client, or to reduce my own anxiety? Affirmative answers to 1–4 and an honest answer to 5 will support both ethical and legally defensible practice.</blockquote>
<p>The question of <strong>less restrictive alternatives</strong> is central to both ethical practice and legal compliance. Courts have consistently held that involuntary commitment must be the least restrictive means by which the state can accomplish its protective purpose. Clinically, this means the clinician must genuinely consider — and document the consideration of — whether the client would voluntarily accept a higher level of care, whether an intensive outpatient program or crisis stabilization unit could adequately address the risk, whether enhanced safety planning with a reliable third party who can provide direct supervision is feasible, and whether means restriction — securing or removing access to the means identified in the client's plan — can reduce imminent risk without requiring hospitalization. Documenting that these options were considered and found insufficient is not a bureaucratic formality; it is the clinical and legal basis that distinguishes a justified hold from one that did not meet the legal threshold (Welfel, 2015).</p>
<p>Clinicians should also be alert to the countertransference dynamics that can distort hold decisions in both directions. Anxiety about liability — the fear of being held responsible if a client harms themselves — can produce over-utilization of holds for clients who do not clinically meet the criteria. This pattern protects the clinician's sense of security at the expense of the client's autonomy and erodes the trust that makes honest disclosure possible over time. Conversely, the desire to preserve the therapeutic relationship and maintain trust can produce hesitation when a hold is genuinely warranted. Both errors carry serious consequences, and the antidote to both is regular supervision and peer consultation, particularly for clinicians who carry high-risk caseloads.</p>`,
        },
        {
          type: "text",
          order: 4,
          title: "Clinical Vignette: The Case of Marcus",
          content: `<h2>Clinical Vignette: Navigating a Hold Decision in Outpatient Practice</h2>
<blockquote><em>Marcus is a 34-year-old Black male who has been seeing you for depression and PTSD for approximately eight months. He presents today appearing more dysregulated than usual, with slowed speech and flat affect. In the first ten minutes of session he discloses that he has been thinking about suicide "pretty much constantly" over the past week, that he has a specific plan involving a firearm he reports he has at home, and that he has been saying goodbye to people he cares about. He states, "I'm not going to call any hotline. I've been down that road. I just wanted to tell someone before I did it." When you ask about his willingness to go to the hospital voluntarily, he refuses flatly. He says, "Last time I went, they treated me like a criminal. I'm not going back."</em></blockquote>
<p>This vignette surfaces several of the core challenges addressed in this course. The first question is clinical: does Marcus meet the threshold for an involuntary hold? Walking through the elements: Marcus presents with a mental disorder (major depressive disorder with PTSD); he is expressing active suicidal ideation with intent, a specific lethal plan, and access to means; his behavior of saying goodbyes is a significant behavioral risk indicator; and he is refusing voluntary hospitalization and safety planning. The nexus between his mental disorder and dangerous behavior is clear. His presentation meets the threshold for an emergency hold in virtually every jurisdiction.</p>
<p>The second question is ethical: Marcus's history of negative treatment — particularly his report of being treated "like a criminal" — reflects a pattern the literature consistently identifies for Black individuals in psychiatric settings (Alegría et al., 2018). Research documents that Black patients are disproportionately subjected to coercive interventions in mental health settings and are more likely to experience involuntary holds and restraints than white patients with comparable clinical presentations. This history does not change the clinical threshold for the hold; if Marcus meets the legal criteria, the clinician has both the authority and the clinical obligation to act to protect his life. But it does shape how the clinician acts: with transparency about the clinical reasoning, with explicit acknowledgment of his prior experience and the validity of his distrust, with genuine effort to involve him in the process to whatever extent is safe, and with active advocacy for his equitable and dignified treatment at the receiving facility.</p>
<p>The third question is procedural: in most community outpatient settings, the clinician would contact 911 or the local crisis line, clearly communicate the clinical basis for the hold request, and remain with Marcus until emergency services arrive if it is safe to do so. Explaining the decision to Marcus directly and respectfully — "I hear you that your last experience was awful, and I'm genuinely sorry that happened. What you've shared with me today — the plan, the gun, the goodbyes — tells me you're in serious danger right now, and I'm not willing to do nothing. I'm going to call for help, and I'm going to stay here with you" — reduces the experience of abandonment and betrayal without abandoning clinical accountability. Providing this explanation is not just good therapeutic practice; it is consistent with the ethical obligation to maintain fidelity with the client even while acting against his stated preference.</p>
<p>The fourth dimension is long-term relational repair. Marcus may emerge from hospitalization feeling confirmed in his belief that mental health systems are unsafe for Black men, less willing to disclose honestly, and more guarded about the therapeutic relationship. The clinician should process this experience explicitly in the first post-discharge session, validate the full complexity of Marcus's response — including anger — without becoming defensive, and invite Marcus's perspective on what was helpful and what was not. The goal is not to convince Marcus the hold was the right decision; it is to honor his experience, restore the therapeutic alliance on honest terms, and collaboratively create safety conditions that are genuinely his. The therapeutic relationship that survives this kind of rupture and is carefully repaired can become one of the most powerful protective factors in Marcus's long-term safety.</p>`
        },
        {
          type: "reflection",
          order: 5,
          prompt: "Think about a client on your current or recent caseload who carries elevated risk. If a hold situation were to arise with this client, what less restrictive alternatives would you consider before initiating a hold? What documentation would you need to have in place? What local resources — crisis teams, stabilization units, emergency contacts — would you draw on? Use this reflection to identify any gaps in your crisis preparation.",
          label: "Reflective Practice"
        },
        {
          type: "multipleChoice",
          order: 6,
          question: "Before initiating an involuntary hold, the clinician's documentation MUST include:",
          options: [
            "Written confirmation from the client's emergency contact",
            "Specific clinical observations, client statements, and the reasoning for rejecting less restrictive alternatives",
            "A completed C-SSRS score of 6 or higher",
            "Supervisor co-signature obtained prior to contacting emergency services"
          ],
          correctAnswer: 1,
          explanation: "Documentation must capture specific behavioral observations and client statements (not conclusory language), the clinical formulation linking mental illness to dangerousness, and explicit consideration of less restrictive alternatives. Supervisor co-signature requirements vary by setting and jurisdiction."
        },
        {
          type: "multipleChoice",
          order: 7,
          question: "In the Marcus vignette, which of the following MOST accurately describes the primary ethical obligation the clinician faces?",
          options: [
            "Maintaining confidentiality above all other considerations",
            "Balancing client autonomy against the duty to protect while acting with cultural humility and transparency",
            "Deferring the hold decision to law enforcement to avoid damaging the therapeutic relationship",
            "Waiting for Marcus to voluntarily accept treatment before taking any action"
          ],
          correctAnswer: 1,
          explanation: "The clinician must weigh client autonomy against the duty to protect — and do so with cultural humility given Marcus's prior experiences with coercive systems. Transparency, advocacy at the receiving facility, and relational repair post-hold are all part of ethical practice in this context."
        }
      ]
    },

    // ════════════════════════════════════════════════
    // SECTION 3: Documentation, Post-Hold Care, and the Clinician's Role
    // ════════════════════════════════════════════════
    {
      title: "Documentation, Post-Hold Care, and the Clinician's Role",
      order: 3,
      estimatedTime: 15,
      contentBlocks: [
        {
          type: "sectionDivider",
          order: 1,
          sectionNumber: 3,
          title: "Section 3",
          subtitle: "Documentation, Post-Hold Care, and the Clinician's Role",
          accessibility: { role: "heading", ariaLevel: 2 }
        },
        {
          type: "text",
          order: 2,
          title: "Documentation Standards for Hold Decisions",
          content: `<h2>Documentation Standards for Hold Decisions</h2>
<p>Documentation in hold situations serves multiple functions simultaneously. It creates a clinical record that guides ongoing care, fulfills legal requirements for the initiation and justification of the hold, protects the client's legal rights and the clinician's professional standing, and communicates essential information to the receiving facility. Given the high stakes, documentation must be thorough, specific, and contemporaneous with the clinical encounter. Notes written from memory hours or days later are less legally defensible and less clinically useful than notes completed at the time of or immediately following the assessment.</p>
<p>At minimum, the clinical record for a hold decision should include: the date, time, and setting of the assessment; a description of the presenting concern and the events that precipitated the assessment; specific statements made by the client relevant to risk, quoted directly where possible; behavioral observations that informed the risk assessment; the results of any structured assessment tools administered; a clinical formulation explicitly linking mental illness to dangerousness or grave disability; the specific legal criterion invoked and the basis for concluding it is met; documentation that less restrictive alternatives were considered and the reasons they were found insufficient; the actions taken, including who was contacted and when; and any collateral information obtained and from whom.</p>
<p>Documentation should be factual, behavioral, and specific rather than conclusory. "Client met criteria for involuntary hold due to suicidal ideation" is insufficient and would not withstand scrutiny from a licensing board, court, or peer reviewer. "Client reported active suicidal ideation with intent to act tonight using a firearm she reported she has at home; she declined voluntary hospitalization and denied ability to implement safety plan; less restrictive alternatives including crisis stabilization unit and enhanced safety planning with partner were offered and refused" provides the specific factual basis required. Clinical opinions and risk formulations should be labeled as such and grounded in the observed facts that support them (SAMHSA, 2020).</p>
<p>One documentation practice that is consistently underutilized is the explicit recording of supervisor or peer consultation. When a clinician consults with a supervisor or colleague about a hold decision — whether by phone, text, or in person — the fact of that consultation, the name of the person consulted, the time of the consultation, and the clinical recommendation received should all be documented in the clinical record. Consultation both improves clinical decision quality and provides documentation that the clinician exercised reasonable professional judgment rather than acting in isolation. Many licensing board complaints and malpractice claims in hold situations hinge not on whether the clinician made the right decision, but on whether the decision-making process was reasonable and documented. A record that demonstrates thorough assessment, considered reasoning, consultation, and good-faith effort to balance all relevant obligations is the strongest possible protection in these situations.</p>
<p>For clinicians practicing in settings that use electronic health records, the challenge of contemporaneous documentation may be complicated by session-ending workflows. Best practice is to complete at minimum a brief, time-stamped hold-related note immediately following the session or intervention, with a more complete note completed within the same business day. Many EHR systems include crisis documentation templates that can be adapted for hold situations; using a structured template consistently ensures that no required elements are omitted under time pressure.</p>`,
        },
        {
          type: "flashcardDeck",
          order: 3,
          title: "Documentation Essentials: What to Include",
          cards: [
            {
              front: "Date, time & setting",
              back: "Document exactly when and where the assessment occurred. Time-stamping is critical for legal defensibility and establishes the contemporaneous nature of the record."
            },
            {
              front: "Client's direct statements",
              back: "Quote the client directly where possible — especially statements about intent, plan, timeframe, and means. 'She stated she would use the pills in her cabinet tonight' is stronger than 'client expressed suicidal intent.'"
            },
            {
              front: "Behavioral observations",
              back: "Document observable clinical indicators: affect, level of agitation, eye contact, psychomotor changes, signs of intoxication, evidence of saying goodbyes, or other behavioral risk indicators."
            },
            {
              front: "Assessment tools used",
              back: "Note any structured instruments administered (C-SSRS, PHQ-9, Columbia Protocol) and the results. Document that tools supplemented — not replaced — clinical judgment."
            },
            {
              front: "Less restrictive alternatives considered",
              back: "List specifically which alternatives were considered (voluntary hospitalization, IOP, crisis stabilization, enhanced safety planning, means restriction) and why each was deemed insufficient."
            },
            {
              front: "Actions taken & who was contacted",
              back: "Document every contact made: time called, who answered, what was communicated, recommendations received, and outcome. Include supervisor consultation attempts and results."
            }
          ]
        },
        {
          type: "text",
          order: 4,
          title: "Post-Hold Care and Reintegration",
          content: `<h2>Post-Hold Care and Reintegration</h2>
<p>The clinician's role does not end when the client is transported to a receiving facility. Post-hold care is a critical and often underemphasized component of the clinical continuum, and the quality of this care has a direct and measurable impact on both the client's safety and their long-term engagement with treatment. In the immediate period following a hold, the clinician should attempt to maintain contact with the client through the inpatient team where clinically appropriate and permitted by the client's consent, obtain information about the client's status and anticipated discharge plan, and actively participate in discharge planning to ensure continuity of outpatient care. A client who is discharged from an involuntary hold without a scheduled follow-up appointment, a revised safety plan, and explicit coordination between the inpatient and outpatient providers is at substantially elevated risk for post-discharge crisis (Katsakou & Priebe, 2006).</p>
<p>The period immediately following psychiatric discharge is consistently identified in the research literature as among the highest-risk windows for suicidal behavior. This elevated risk is driven by several intersecting factors: the abrupt transition from a structured, supervised environment to the relative autonomy of the community; potential medication changes requiring adjustment periods; the resumption of access to lethal means that may have been secured during the hospitalization; and the emotional weight of the hospitalization experience itself, including any trauma associated with the involuntary nature of the admission. Clinicians who understand this risk window will prioritize scheduling the first post-discharge appointment within 72 hours of discharge whenever possible, confirming that means restriction measures remain in place, and verifying that the client has the clinician's direct contact information and a clear plan for managing any acute distress before the first appointment.</p>
<p>The first outpatient session following a hold requires careful preparation and a specific therapeutic approach. The clinician should not attempt to move directly into standard clinical work or treatment planning before creating space for the client to process the experience of the hold — a sequence that communicates that the clinician is more interested in the protocol than in the person. Clients commonly experience the hold as a rupture in the therapeutic relationship, and the feelings this rupture generates — anger, shame, betrayal, relief, ambivalence, or some combination of all of these — deserve explicit therapeutic attention before any other agenda is addressed. Validating these responses without either defensively justifying the hold decision or collapsing into excessive apology is a nuanced relational task. The clinician's capacity to hold the client's anger without becoming defensive or withdrawing is itself therapeutically powerful — it models that the relationship can survive rupture, that the client's difficult emotions are tolerable, and that the clinician remains committed to working with them on their own terms.</p>
<p>Clinicians should monitor long-term for signs that the hold experience has affected the client's engagement with treatment: decreased disclosure about suicidal ideation, avoidance of sessions during high-stress periods, increased guardedness about emotional states, or explicit statements of reluctance to share certain information for fear of rehospitalization. These patterns are understandable adaptive responses to the experience of coercion and should be addressed directly and compassionately within the therapeutic relationship. For clients from communities with histories of trauma in psychiatric systems — particularly Black, Indigenous, Latinx, and other communities of color, as well as LGBTQ+ clients with histories of pathologization — this relational repair work carries additional clinical weight and deserves sustained, explicit therapeutic attention rather than a single acknowledgment and a pivot to other agenda items.</p>
<p>Clinicians are also encouraged to engage in deliberate self-reflection and supervision following hold situations, regardless of how the situation resolved. Hold decisions are emotionally demanding, carry high stakes in both directions, and can activate countertransference responses that are not always immediately legible to the clinician. Regular supervision or peer consultation provides an essential corrective and supports the clinician's sustained capacity to make clear-eyed, client-centered decisions in future crisis situations.</p>`
        },
        {
          type: "multipleChoice",
          order: 5,
          question: "Which of the following BEST describes adequate documentation of a hold decision?",
          options: [
            "'Client endorsed suicidal ideation with elevated risk; hold criteria met per clinical assessment'",
            "'Client stated she would use medication in her bathroom tonight; declined voluntary hospitalization, alternative safety measures, and ability to maintain safety; specific plan and access to lethal means confirmed'",
            "'Hold initiated after risk assessment; client transported to receiving facility by law enforcement'",
            "'Client assessed using C-SSRS; score indicated high risk; hold initiated per protocol'"
          ],
          correctAnswer: 1,
          explanation: "Effective hold documentation is specific and behavioral: it includes direct client statements, specific means and plan, behavioral observations, and documented rejection of alternatives. Conclusory or tool-score-only documentation does not meet the standard."
        },
        {
          type: "multipleChoice",
          order: 6,
          question: "A client is discharged from an involuntary hold. The MOST important immediate clinical action for the outpatient clinician is:",
          options: [
            "Sending a letter to the client explaining why the hold was necessary",
            "Waiting for the client to reach out before scheduling a follow-up",
            "Coordinating a follow-up appointment and participating in discharge planning to ensure care continuity",
            "Closing the case if the client does not contact the office within two weeks"
          ],
          correctAnswer: 2,
          explanation: "The post-discharge period is a high-risk window. Coordinating a follow-up appointment, participating in discharge planning, and ensuring continuity between inpatient and outpatient care are essential clinical responsibilities that directly reduce post-discharge crisis risk."
        }
      ]
    },

    // ════════════════════════════════════════════════
    // SECTION 4: Conclusion + Final Exam
    // ════════════════════════════════════════════════
    {
      title: "Conclusion, Key Principles, and Final Examination",
      order: 4,
      estimatedTime: 7,
      contentBlocks: [
        {
          type: "sectionDivider",
          order: 1,
          sectionNumber: 4,
          title: "Conclusion",
          subtitle: "Integrating Legal, Ethical, and Clinical Knowledge",
          accessibility: { role: "heading", ariaLevel: 2 }
        },
        {
          type: "text",
          order: 2,
          title: "Integrating Legal, Ethical, and Clinical Knowledge",
          content: `<h2>Integrating Legal, Ethical, and Clinical Knowledge</h2>
<p>The practice of initiating or managing involuntary psychiatric holds requires the clinician to operate at the convergence of law, ethics, and clinical science. The legal framework establishes the threshold that must be met and the procedures that must be followed. The ethical framework guides the clinician's reasoning in the space between what is legally permissible and what is clinically and relationally appropriate. The clinical framework provides the tools for assessment, documentation, and care that make the legal and ethical obligations actionable in practice. Competence in this domain requires facility with all three frameworks simultaneously — the clinician who knows the law but lacks clinical assessment skills, or who has clinical skills but cannot reason through ethical complexity, is not fully equipped to handle hold situations well.</p>
<p>Competence in this domain is not optional for clinicians who work with acutely distressed populations. Every clinician who carries a community caseload will encounter situations in which hold considerations arise — sometimes predictably, with a client whose risk level has been carefully tracked and documented, and sometimes suddenly, with a client who discloses in a routine session information that transforms the clinical picture entirely. The clinician who has not prepared for these situations in advance will face them under conditions of time pressure, acute emotional intensity, and incomplete information that severely compromise decision quality. Preparation includes knowing the precise language of your jurisdiction's hold statute, understanding the procedural steps for initiating a hold from your practice setting, establishing advance relationships with local emergency services and crisis facilities, maintaining ongoing competence in structured risk assessment, and developing the reflective practice habits — through supervision and peer consultation — that allow you to distinguish between clinically warranted protective action and anxiety-driven over-utilization.</p>
<p>The profession's ethical codes consistently reflect a commitment to the dignity and autonomy of clients, and this commitment does not disappear in hold situations. It takes a different form. In hold situations, dignity means treating the client as a full human being throughout a terrifying and disorienting process — explaining what is happening and why, involving them in decisions to the greatest possible extent, advocating for their rights and equitable treatment at the receiving facility, and committing to working through the relational aftermath with them upon discharge. Autonomy, paradoxically, means taking seriously the client's long-term interest in surviving to exercise their autonomy — an interest that, in the acute crisis moment, may require acting against their stated immediate preference. The clinician who holds both of these commitments at once, who does not collapse either into reflexive paternalism or into therapeutic passivity, is practicing at the highest level of professional integrity.</p>
<p>This 0.75-hour course has covered the foundational legal, clinical, and ethical knowledge required to navigate involuntary psychiatric holds competently. It is designed as a starting point for hold-related competence, not a final destination. Clinicians are encouraged to continue building this knowledge through consultation with colleagues, familiarity with their jurisdiction's hold procedures, and regular supervision. Crisis competence is a professional obligation that is sustained — not acquired once and set aside — and the clinician who invests in it consistently is better equipped to be the reliable presence their most vulnerable clients need.</p>`,
          accessibility: { hasHeadings: true, readingLevel: "graduate" }
        },
        {
          type: "accordion",
          order: 3,
          title: "Key Principles Summary",
          accordionItems: [
            {
              title: "Legal Foundation",
              content: "Involuntary holds are authorized under state law and must meet constitutional minimum standards. The criteria typically require a mental illness or disorder that causes imminent danger to self or others, or grave disability. Constitutional floors are set by O'Connor v. Donaldson (1975) and Addington v. Texas (1979)."
            },
            {
              title: "Assessment and Documentation",
              content: "Clinicians must conduct thorough, structured risk assessments and document specific behavioral observations and client statements rather than conclusory formulations. Imminence, mental illness, and nexus between them are separate elements requiring independent assessment and documentation."
            },
            {
              title: "Ethical Decision-Making",
              content: "Hold decisions require explicitly weighing client autonomy against the duty to protect, considering less restrictive alternatives, and seeking consultation when feasible. Documentation of this reasoning process is both an ethical and legal requirement."
            },
            {
              title: "Equity and Cultural Humility",
              content: "Hold criteria must be applied equitably. Research documents racial disparities in hold utilization — particularly for Black and Indigenous individuals. Clinicians must examine implicit biases and apply legal criteria with equal rigor regardless of client demographics."
            },
            {
              title: "Post-Hold Care",
              content: "Processing the client's experience of the hold, coordinating discharge and follow-up, and collaboratively rebuilding the safety plan and therapeutic alliance are clinically essential components of the care continuum that directly reduce post-discharge crisis risk."
            }
          ]
        },
        {
          type: "text",
          order: 4,
          title: "Your Companion Resource: State-by-State Hold Reference Guide",
          content: `<h2>Your Companion Resource: State-by-State Hold Reference Guide</h2>
<p>Completing this course unlocks the <strong>State-by-State Hold Reference Guide</strong> — a comprehensive clinical reference covering emergency psychiatric hold criteria, duration limits, initiation authority, and procedural requirements for all 50 states and the District of Columbia. The Guide is organized for rapid clinical access and is drawn from current state statutes and reviewed for accuracy. It is designed as a working reference, not a substitute for knowing your jurisdiction's laws in depth or for seeking legal counsel in complex situations, and should be used alongside consultation with colleagues familiar with local practice.</p>
<p>The Guide is particularly valuable for clinicians who provide telehealth services across state lines. As noted throughout this course, a clinician's hold authority is determined by the jurisdiction where the client is physically located — not where the clinician holds licensure. A Georgia-licensed LPC providing telehealth services to a client in Virginia must be prepared to initiate a hold under Virginia law, contact Virginia-based crisis resources, and coordinate with Virginia emergency services. The Guide provides the baseline information needed to undertake this preparation before a crisis occurs rather than during one. Clinicians providing cross-state telehealth services are encouraged to review the Guide entries for every state in which their clients reside, bookmark the relevant crisis line numbers, and incorporate this information into their telehealth-specific emergency protocol.</p>
<p>The Guide is also a useful resource for clinicians who encounter hold situations infrequently and may not maintain current knowledge of their own state's procedures between encounters. Crisis situations do not afford time for research, and the clinician who can immediately locate the specific hold criteria, duration, and initiation procedure for their jurisdiction is meaningfully better equipped than one who must search mid-crisis. Reviewing the Guide entry for your own jurisdiction as a post-course exercise is recommended.</p>`,
          accessibility: { hasHeadings: true }
        },
        {
          type: "text",
          order: 5,
          title: "References",
          content: `<h2>References</h2>
<div class="cr-references">
<p class="cr-reference">ACA Code of Ethics (2014). American Counseling Association. https://www.counseling.org/resources/aca-code-of-ethics.pdf</p>
<p class="cr-reference">Addington v. Texas, 441 U.S. 418 (1979).</p>
<p class="cr-reference">Alegría, M., Alvarez, K., & DiMarzio, K. (2018). Immigration and mental health. Current Epidemiology Reports, 4(2), 145–155. https://doi.org/10.1007/s40471-017-0111-2</p>
<p class="cr-reference">Appelbaum, P. S. (2004). Law & psychiatry: Ambivalence codified — California's new inpatient commitment statute. Psychiatric Services, 55(1), 26–28. https://doi.org/10.1176/appi.ps.55.1.26</p>
<p class="cr-reference">Bryan, C. J., & Rudd, M. D. (2018). Brief cognitive-behavioral therapy for suicide prevention. Guilford Press.</p>
<p class="cr-reference">Hedman, L. C., Petrila, J., Fisher, W. H., Swanson, J. W., Dingman, D. A., & Burris, S. (2016). State laws on emergency holds for mental health stabilization. Psychiatric Services, 67(5), 529–535. https://doi.org/10.1176/appi.ps.201500205</p>
<p class="cr-reference">Herlihy, B., & Corey, G. (2015). ACA ethical standards casebook (7th ed.). American Counseling Association.</p>
<p class="cr-reference">Katsakou, C., & Priebe, S. (2006). Outcomes of involuntary hospital admission: A review. Acta Psychiatrica Scandinavica, 114(4), 232–241. https://doi.org/10.1111/j.1600-0447.2006.00823.x</p>
<p class="cr-reference">Monahan, J., Steadman, H. J., Silver, E., Appelbaum, P. S., Robbins, P. C., Mulvey, E. P., Roth, L. H., Grisso, T., & Banks, S. (2001). Rethinking risk assessment: The MacArthur study of mental disorder and violence. Oxford University Press.</p>
<p class="cr-reference">O'Connor v. Donaldson, 422 U.S. 563 (1975).</p>
<p class="cr-reference">Remley, T. P., & Herlihy, B. (2020). Ethical, legal, and professional issues in counseling (6th ed.). Pearson.</p>
<p class="cr-reference">Substance Abuse and Mental Health Services Administration. (2020). Crisis services: Effectiveness, cost-effectiveness, and funding strategies. U.S. Department of Health and Human Services.</p>
<p class="cr-reference">Welfel, E. R. (2015). Ethics in counseling and psychotherapy: Standards, research, and emerging issues (6th ed.). Cengage Learning.</p>
<p class="cr-reference">Winick, B. J. (2005). Civil commitment: A therapeutic jurisprudence model. Carolina Academic Press.</p>
<p class="cr-reference">Zinermon v. Burch, 494 U.S. 113 (1990).</p>
</div>`
        },
        // ── FINAL EXAM ─────────────────────────────────────────────────
        {
          type: "multipleChoice",
          order: 6,
          isExam: true,
          passingScore: 80,
          maxAttempts: 3,
          shuffleQuestions: true,
          showExplanations: false,
          title: "Final Examination",
          instructions: "Select the best answer for each question. A score of 80% or higher (12 of 15 correct) is required to receive 1.0 CE credit. You have 3 attempts.",
          questions: EXAM_QUESTIONS
        }
      ]
    }
  ],

  // ── TOP-LEVEL ASSESSMENT (mirrors exam block) ──────────────────────
  assessment: {
    questions: EXAM_QUESTIONS,
    passingScore: 80,
    maxAttempts: 3
  },

  references: [
    { title: "ACA Code of Ethics", author: "American Counseling Association", year: 2014, source: "https://www.counseling.org/resources/aca-code-of-ethics.pdf" },
    { title: "Addington v. Texas", author: "U.S. Supreme Court", year: 1979, source: "441 U.S. 418" },
    { title: "Law & psychiatry: Ambivalence codified — California's new inpatient commitment statute", author: "Appelbaum, P. S.", year: 2004, source: "Psychiatric Services, 55(1), 26–28" },
    { title: "Brief cognitive-behavioral therapy for suicide prevention", author: "Bryan, C. J., & Rudd, M. D.", year: 2018, source: "Guilford Press" },
    { title: "State laws on emergency holds for mental health stabilization", author: "Hedman, L. C., Petrila, J., Fisher, W. H., Swanson, J. W., Dingman, D. A., & Burris, S.", year: 2016, source: "Psychiatric Services, 67(5), 529–535" },
    { title: "ACA ethical standards casebook (7th ed.)", author: "Herlihy, B., & Corey, G.", year: 2015, source: "American Counseling Association" },
    { title: "Outcomes of involuntary hospital admission: A review", author: "Katsakou, C., & Priebe, S.", year: 2006, source: "Acta Psychiatrica Scandinavica, 114(4), 232–241" },
    { title: "Rethinking risk assessment: The MacArthur study of mental disorder and violence", author: "Monahan, J., Steadman, H. J., Silver, E., et al.", year: 2001, source: "Oxford University Press" },
    { title: "O'Connor v. Donaldson", author: "U.S. Supreme Court", year: 1975, source: "422 U.S. 563" },
    { title: "Ethical, legal, and professional issues in counseling (6th ed.)", author: "Remley, T. P., & Herlihy, B.", year: 2020, source: "Pearson" },
    { title: "Crisis services: Effectiveness, cost-effectiveness, and funding strategies", author: "Substance Abuse and Mental Health Services Administration", year: 2020, source: "U.S. Department of Health and Human Services" },
    { title: "Ethics in counseling and psychotherapy: Standards, research, and emerging issues (6th ed.)", author: "Welfel, E. R.", year: 2015, source: "Cengage Learning" },
    { title: "Civil commitment: A therapeutic jurisprudence model", author: "Winick, B. J.", year: 2005, source: "Carolina Academic Press" },
    { title: "Zinermon v. Burch", author: "U.S. Supreme Court", year: 1990, source: "494 U.S. 113" },
    { title: "Immigration and mental health", author: "Alegría, M., Alvarez, K., & DiMarzio, K.", year: 2018, source: "Current Epidemiology Reports, 4(2), 145–155" }
  ]
};

// ═══ SEED FUNCTION ═══════════════════════════════════════════
async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  const db = mongoose.connection.db;
  const collection = db.collection("interactivecourses");

  const existing = await collection.findOne({ slug: COURSE_DATA.slug });
  if (existing) {
    await collection.updateOne({ slug: COURSE_DATA.slug }, { $set: COURSE_DATA });
    console.log("Updated:", COURSE_DATA.title);
  } else {
    COURSE_DATA.createdAt = new Date();
    COURSE_DATA.updatedAt = new Date();
    await collection.insertOne(COURSE_DATA);
    console.log("Created:", COURSE_DATA.title);
  }

  // ── STATS ──
  let totalWords = 0;
  let textBlocks = 0;
  let kcs = 0;
  let examQs = 0;
  let activities = 0;

  for (const section of COURSE_DATA.sections) {
    for (const block of section.contentBlocks) {
      if (block.type === "text" || block.type === "imageText") {
        const text = (block.content || "").replace(/<[^>]+>/g, " ");
        totalWords += text.split(/\s+/).filter(w => w).length;
        textBlocks++;
      }
      if (block.type === "multipleChoice" && !block.isExam) kcs++;
      if (block.type === "multipleChoice" && block.isExam) examQs = (block.questions || []).length;
      if (["accordion","flashcardDeck","reflection","matching","cardSort"].includes(block.type)) activities++;
    }
  }

  const req = COURSE_DATA.ceHours * 6000;
  console.log("\n═══ CR-SP-204 SEED STATISTICS ═══");
  console.log(`Title:           ${COURSE_DATA.title}`);
  console.log(`Course Code:     ${COURSE_DATA.courseCode}`);
  console.log(`CE Hours:        ${COURSE_DATA.ceHours} (0.75 CE = 4,500 word requirement)`);
  console.log(`Price:           $${COURSE_DATA.price}`);
  console.log(`Sections:        ${COURSE_DATA.sections.length}`);
  console.log(`Text blocks:     ${textBlocks}`);
  console.log(`Activities:      ${activities}`);
  console.log(`Knowledge checks: ${kcs}`);
  console.log(`Final exam Qs:   ${examQs} (min 15 required)`);
  console.log(`References:      ${COURSE_DATA.references.length} (min 3 required)`);
  console.log(`Text word count: ~${totalWords}`);
  console.log(`CE requirement:  ${req} words`);
  console.log(`Word count:      ${totalWords >= req ? "✅ PASS" : "❌ FAIL — add content"}`);
  console.log(`Exam:            ${examQs >= 15 ? "✅ PASS" : "❌ FAIL — need 15 questions"}`);
  console.log(`References:      ${COURSE_DATA.references.length >= 3 ? "✅ PASS" : "❌ FAIL"}`);
  console.log(`Status:          ${COURSE_DATA.status} / isPublished: ${COURSE_DATA.isPublished}`);
  console.log("\nDone.");

  await mongoose.disconnect();
}

main().catch(err => { console.error(err.message); process.exit(1); });
