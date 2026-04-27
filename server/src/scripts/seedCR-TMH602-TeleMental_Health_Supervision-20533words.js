// CR-TMH602 | TeleMental Health Supervision: Georgia Rule 135-11 Compliance for Supervisors
// 3 CE Hours | Ethics / Supervision | ACEP Compliant | APA 7th Edition
// NBCC ACEP Provider #7760 | GAITP LLC
// Seed Script — ES Module format | Single-run deployment
// Total word count: ~20,500 words | Target collection: interactivecourses

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URI not found in environment');
  process.exit(1);
}

const CLOUD_BASE = "https://res.cloudinary.com/dzfscjhdx/image/upload/counselorready/course-resources/CR-TMH602";

// ═══════════════════════════════════════════════════════════
// COURSE DATA
// ═══════════════════════════════════════════════════════════
const COURSE_DATA = {
  title: "TeleMental Health Supervision",
  slug: "telemental-health-supervision-georgia-rule-135-11",
  subtitle: "Georgia Rule 135-11 Compliance for Supervisors",
  courseCode: "CR-TMH602",
  description: "This 3-hour continuing education course is designed specifically for licensed mental health professionals who provide clinical supervision via telehealth platforms in Georgia. Georgia Composite Board Rule 135-11 imposes distinct requirements on supervisors that go beyond the six hours required of all telehealth practitioners, including an additional three hours of supervisor-specific telehealth training, dual consent requirements with supervisees, and adherence to the supervisory provisions of Board Rule 135-5. This course provides a comprehensive examination of those supervisor-specific obligations, the ethical dimensions of virtual supervision, and evidence-based risk management strategies for telehealth supervision environments.",
  shortDescription: "Supervisor-specific training satisfying the 3-hour Rule 135-11 requirement for licensed supervisors providing telehealth supervision in Georgia.",
  instructor: "GA Integrated Therapeutic Perspectives LLC",
  ceHours: 3,
  credits: 3,
  ceuHours: 3,
  ceuEligible: true,
  approvingBody: "NBCC",
  approvalNumber: "#7760",
  category: "Ethics",
  level: "Advanced",
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
    "Licensed Professional Counselor Supervisors (LPC-S)",
    "Licensed Clinical Social Worker Supervisors (LCSW-S)",
    "Licensed Marriage and Family Therapist Supervisors (LMFT-S)",
    "Approved Clinical Supervisors (ACS)",
    "Certified Professional Counselor Supervisors (CPCS)",
    "Counselor educators supervising telehealth practicum/internship"
  ],
  instructionalLevel: "Advanced",
  deliveryMethod: "online",
  estimatedMinutes: 180,
  objectives: [
    "Identify the specific provisions of Georgia Composite Board Rule 135-11 that apply to supervisors providing telehealth supervision, including the additional three-hour training requirement, dual consent obligations, and the integration of Rule 135-5 standards.",
    "Analyze the regulatory ecosystem surrounding telehealth supervision in Georgia, including the intersection of Rule 135-11 with HIPAA requirements, professional ethics codes, and the Counseling Compact.",
    "Evaluate supervisee competence in delivering telehealth services using structured assessment frameworks aligned with BC-TMH competency domains and Georgia Board compliance standards.",
    "Apply ethical decision-making models to supervision challenges unique to virtual environments, including confidentiality in three-party telehealth contexts, technology-mediated boundaries, and cross-jurisdictional practice.",
    "Construct a telehealth supervision agreement that satisfies Rule 135-11 and Rule 135-5 requirements, including informed consent elements, emergency protocols, technology platform disclosures, and communication policies.",
    "Implement risk management strategies that address technology failure protocols, cross-jurisdictional complexity, and supervisee crisis management in telehealth supervision contexts."
  ],
  contentAreas: ["Ethics", "Supervision", "TeleMental Health", "Georgia Board Compliance"],
  categories: ["Ethics", "Supervision", "Telehealth", "Regulatory Compliance"],
  tags: ["supervision", "telehealth", "Rule 135-11", "Rule 135-5", "Georgia", "LPC-S", "ethics", "BC-TMH", "HIPAA", "risk management", "informed consent", "crisis management"],
  price: 59,
  accessType: "paid",
  pricingTier: "premium",
  isActive: true,
  isFeatured: false,
  status: "published",
  isPublished: true,
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

    // ════════════════════════════════════════════════════════
    // SECTION 1: Rule 135-11 Foundations
    // ════════════════════════════════════════════════════════
    {
      title: "Rule 135-11 Foundations: The Legal and Regulatory Framework",
      order: 1,
      contentBlocks: [
        {
          type: "sectionDivider",
          sectionNumber: 1,
          title: "Section 1",
          subtitle: "Rule 135-11 Foundations",
          accessibility: { role: "heading", ariaLevel: 2 }
        },
        {
          type: "text",
          content: `<h2>Introduction: Why Supervisors Are Held to a Higher Standard</h2>
<p>When you accepted a supervisory role, you accepted a dual accountability that most clinicians never fully reckon with: you are legally and ethically responsible not only for the quality of your own clinical practice, but for the professional development and clinical decision-making of every supervisee under your watch. In the context of telemental health, this dual accountability is amplified by Georgia's regulatory framework, which explicitly holds supervisors to standards that exceed those required of general telehealth practitioners.</p>
<p>Georgia Composite Board Rule 135-11, formally titled "Standards for the Delivery of Services by TeleMental Health," was adopted September 17, 2015 and remains one of the most comprehensive state telehealth regulations in the United States. While all Georgia-licensed mental health professionals who provide telehealth services must complete six hours of telehealth-specific training, the rule imposes an additional three hours on supervisors who conduct supervision via technology-assisted media. This is not a technicality. It reflects a substantive recognition that supervising via telehealth introduces distinct competency demands, ethical risks, and legal exposure that require specialized preparation beyond what any clinician needs simply to deliver telehealth services.</p>
<p>The elevated standard for supervisors derives from a foundational principle of supervisory ethics: supervisors bear vicarious liability for the clinical decisions of their supervisees. When a supervisee makes a clinical error in a telehealth context, the supervisor who authorized and oversaw that supervisee's practice shares accountability for the outcome. A supervisor who lacks genuine competence in telehealth supervision cannot effectively evaluate whether a supervisee is practicing safely and competently in a virtual environment. Rule 135-11's nine-hour total requirement for supervisors is thus not an arbitrary regulatory burden but a minimum threshold for the competence level required to fulfill the supervisory obligation in a telehealth context.</p>
<p>This section examines the supervisor-specific provisions of Rule 135-11 in detail, situates them within the broader regulatory ecosystem governing telehealth supervision in Georgia, and provides a systematic compliance framework supervisors can apply to audit and improve their current telehealth supervision arrangements.</p>
<h2>The Historical and Policy Context of Rule 135-11</h2>
<p>Rule 135-11 was adopted in 2015, at a moment when telemental health was transitioning from a niche modality used primarily in rural areas and correctional settings to a mainstream service delivery option being adopted across practice settings. The Georgia Composite Board, like regulators in other states, faced the challenge of establishing standards robust enough to protect clients and maintain professional integrity without creating barriers so high that they impeded access to care in a state where rural mental health access has historically been a significant public health problem.</p>
<p>Georgia's decision to mandate specific telehealth training hours rather than merely issuing guidance or best practice recommendations was deliberate. The Board had observed, through complaint investigations and professional practice consultations, a pattern of problems arising when clinicians assumed that their general clinical competence transferred automatically to the telehealth environment. Clinicians were encountering crisis situations without viable emergency protocols because the client's physical location was unknown. Informed consent processes that were adequate for in-person practice failed to address the specific risks of virtual service delivery. Technology platforms were being used that did not meet HIPAA security requirements. The mandatory training requirement was designed to ensure that practitioners were specifically prepared for these telehealth-specific challenges before they began providing services.</p>
<p>The decision to impose additional training on supervisors reflected a further recognition: that supervisory oversight of telehealth practice requires competence that goes beyond general telehealth practice competence. A supervisor who has completed six hours of general telehealth training knows how to deliver telehealth services. But supervising telehealth practice requires knowing how to observe and evaluate a supervisee's telehealth delivery, how to conduct meaningful supervision sessions in a virtual environment, how to assess whether a supervisee's telehealth practices meet the applicable legal and ethical standards, and how to manage the unique three-party confidentiality and emergency scenarios that telehealth supervision creates. These are genuinely distinct competencies that the supervisor-specific training requirement is designed to address.</p>
<p>The five-year recency window for the training requirement reflects the Board's recognition that telehealth technology and regulatory frameworks evolve rapidly. Training completed in 2015 reflected the state of telehealth platforms, HIPAA guidance, and clinical research available at that time. The landscape has changed substantially since then, particularly through the COVID-19 pandemic, which accelerated telehealth adoption, generated an enormous body of new clinical research, and prompted significant regulatory activity at both the federal and state levels. Supervisors who completed their initial telehealth training more than five years ago should plan their CE calendar to include updated telehealth training that reflects the current regulatory and clinical environment.</p>
<h2>Rule 135-11: The Complete Supervisory Framework</h2>
<p>Georgia Composite Board Rule 135-11 establishes minimum standards for telemental health delivery. Its provisions relevant to supervisors fall into three distinct categories: training requirements, consent requirements with supervisees, and the mandatory application of Rule 135-5 supervisory standards to telehealth supervision contexts. Understanding each category in detail is essential for full compliance.</p>
<h3>The Additional Three-Hour Training Requirement</h3>
<p>Rule 135-11 requires that supervisors providing supervision via telemental health complete three hours of supervisor-specific telehealth training in addition to the six hours required of all telehealth practitioners. This creates a nine-hour total training requirement for supervisors, all of which must have been completed within the five years preceding the provision of telemental health supervision.</p>
<p>The rule is explicit that these two training components are distinct requirements. The six general hours address telehealth service delivery competence. The three supervisor-specific hours address the competencies required to effectively supervise telehealth practice. Completing nine hours of general telehealth training does not satisfy the nine-hour total requirement unless at least three of those hours specifically address supervisor responsibilities in telehealth contexts. Supervisors reviewing their CE records to assess compliance should verify not only the total number of telehealth CE hours completed but whether the content of any completed training explicitly addressed supervisory practice.</p>
<p>The supervisor-specific training must address the distinct competencies required for conducting supervision in a virtual environment, including: how to assess supervisee telehealth competence using structured frameworks; how to conduct meaningful observation and feedback when direct observation is mediated by technology; how to manage the consent and confidentiality dimensions of three-way telehealth interactions involving supervisor, supervisee, and client; and how to respond when technology failures occur during supervision sessions. Training that addresses telehealth clinical practice generally, without specific attention to the supervision context, does not satisfy the supervisor-specific training requirement.</p>
<p>Supervisors who have recently obtained the BC-TMH credential from the Center for Credentialing and Education should verify whether their BC-TMH preparation included content specifically addressing supervisory practice. The BC-TMH curriculum addresses telehealth competencies broadly, including some supervisory content, but completing BC-TMH preparation may not in itself satisfy the three-hour supervisor-specific training requirement unless the training documentation clearly identifies supervisory content meeting the required hours.</p>
<div class="callout-box"><p><strong>Compliance Checkpoint</strong> Before providing any telehealth supervision, verify: (1) You have completed 6 hours of general telehealth training within the past 5 years. (2) You have completed 3 additional hours of supervisor-specific telehealth training within the past 5 years. (3) You have documentation (certificates or transcripts) for all 9 hours that includes content description, provider, date, and credit hours. If any training is more than 5 years old, plan renewal CE before those hours expire.</p></div>
<h3>Dual Consent Requirement for Supervisees</h3>
<p>Rule 135-11 extends its informed consent requirements to the supervisory relationship. Before conducting supervision via telemental health, supervisors must obtain both verbal AND written consent from supervisees. This is the same dual consent requirement the rule imposes for client relationships, and it carries the same documentation obligation: both the verbal and written consent must be recorded in the supervisee's record.</p>
<p>The supervisee consent must address the specific elements that Rule 135-11 requires in client consent: the nature of telemental health services and how they will be used (in this case, for supervision); the technology platforms to be used for supervision; privacy and confidentiality protections in the virtual supervision environment; emergency procedures if technology fails during a supervision session; the right to request in-person supervision as an alternative; and any third-party vendors involved in the telehealth platform. Supervisors should develop a telehealth supervision consent addendum that specifically addresses each of these elements in the supervisory context.</p>
<p>The verbal consent component is particularly important and frequently overlooked. Many supervisors develop detailed written consent forms that satisfy the written consent requirement but then neglect to conduct and document the verbal consent discussion. The verbal consent component is not a formality under Rule 135-11 and cannot be replaced by the supervisee's signature on a written form. The verbal discussion serves a substantive purpose: it ensures that the supervisee has a genuine, interactive understanding of the telehealth supervision arrangement and has had the opportunity to ask questions before committing to it. The supervisee who signs a form without a verbal discussion may not truly understand what they have agreed to, and the supervisor who relies solely on the form is not in compliance with the rule.</p>
<p>A best practice approach to supervisee consent documentation is to maintain a supervisee record that includes: the signed written consent form with the date of signature; a supervision session note or intake record that documents the date, content, and supervisee acknowledgment of the verbal consent discussion; and a notation of any questions the supervisee raised during the verbal discussion and how they were addressed. This documentation structure creates a clear record of both consent components and demonstrates good-faith compliance with the rule's dual consent requirement.</p>
<h3>Rule 135-5 Standards Apply to Telehealth Supervision</h3>
<p>Rule 135-11 specifies that supervision conducted through technology-assisted media must meet all the requirements of the applicable specialty found in Board Rule 135-5. This integration clause is critical: it means telehealth supervision is not a distinct, lesser form of supervision with reduced requirements. It is supervision, delivered via telehealth, with all of the standards that apply to supervision under Rule 135-5 fully in effect.</p>
<p>Rule 135-5 governs supervision standards for LPCs, LCSWs, and LMFTs and establishes requirements around supervision frequency, content, documentation, and supervisor qualifications. For LPC supervision, Rule 135-5 requires a minimum of one hour of individual supervision per week, or the equivalent in group supervision with individual supervision supplement, for full-time supervisees. The supervision must be face-to-face or via synchronous technology that allows for audio and visual communication. Rule 135-11's authorization of technology-assisted supervision satisfies this requirement, provided the technology allows real-time audio-visual interaction.</p>
<p>Asynchronous supervision methods, such as reviewing supervisee session recordings independently and providing written feedback, do not satisfy the synchronous supervision hour requirements under Rule 135-5, even when they involve detailed and thoughtful review. They may be valuable supplements to synchronous supervision, and supervisors may count time spent on asynchronous review as part of their supervisory activities for record-keeping purposes, but they cannot replace the synchronous supervision hours that Rule 135-5 requires. Supervisors who provide exclusively asynchronous oversight, even via detailed video feedback, are not meeting Rule 135-5 requirements regardless of the quality of their feedback.</p>
<p>The Rule 135-5 documentation requirements apply fully to telehealth supervision. Supervisors must maintain supervision records that document: the date, duration, and format of each supervision session; the cases or clinical content discussed; supervisory interventions and guidance provided; evaluative feedback communicated to the supervisee; and any concerns about supervisee performance or client safety that arose and how they were addressed. These records must be maintained securely and retained for the period specified by Rule 135-5, which varies by credential.</p>
<h2>The Regulatory Ecosystem: Federal and State Law Integration</h2>
<p>Rule 135-11 does not exist in isolation. It operates within a regulatory ecosystem that includes federal law, professional ethics codes, and other Georgia Board rules. Supervisors who understand this ecosystem are better positioned to navigate the edge cases and novel situations that telehealth supervision regularly presents.</p>
<h3>HIPAA and the Telehealth Supervision Context</h3>
<p>The Health Insurance Portability and Accountability Act and its implementing regulations establish baseline federal requirements for the protection of protected health information. HIPAA applies to covered entities, including licensed mental health professionals who transmit health information electronically, and their business associates. It establishes requirements around the use, disclosure, and safeguarding of PHI that apply regardless of whether services are delivered in person or via telehealth.</p>
<p>For supervisors, HIPAA compliance in telehealth contexts requires attention to the video platform selection for supervision sessions that involve discussion of identifiable client information. This typically means using a platform that offers end-to-end encryption, provides audit logging, and is willing to execute a Business Associate Agreement. Many general-purpose video conferencing tools are not configured correctly for clinical use involving PHI, and supervisors who use them for supervision sessions that involve identifiable client information are potentially in violation of HIPAA regardless of their compliance with Rule 135-11.</p>
<p>The Office for Civil Rights at the Department of Health and Human Services, which enforces HIPAA, issued guidance during the COVID-19 public health emergency that relaxed enforcement of some telehealth HIPAA requirements. That enforcement discretion has since been withdrawn, and supervisors who adopted non-HIPAA-compliant platforms during the emergency period should ensure they have transitioned to compliant solutions. OCR has imposed significant penalties on healthcare providers for HIPAA violations involving inadequately secured telehealth platforms, with fines reaching into the hundreds of thousands of dollars for serious violations involving multiple patients.</p>
<p>Supervisors should conduct a HIPAA technology audit that specifically addresses the supervision context. The relevant questions include: Is the video platform used for supervision sessions covered by a current BAA? Does the platform used for transmitting or storing session recordings (which contain PHI) meet HIPAA Security Rule requirements? Are supervision session notes stored in a HIPAA-compliant electronic record system? Are communications with supervisees that contain client information conducted through HIPAA-compliant channels? A supervision arrangement that is compliant with Rule 135-11 but uses non-HIPAA-compliant technology platforms is a significant liability exposure.</p>
<h3>Professional Ethics Codes and Telehealth Supervision</h3>
<p>Three primary ethics codes govern the practice of licensed mental health professionals in Georgia. The ACA Code of Ethics (2014) governs licensed professional counselors, the NASW Code of Ethics (2021) governs licensed clinical social workers, and the AAMFT Code of Ethics (2015) governs licensed marriage and family therapists. Each of these codes addresses supervision and technology, though the level of specificity varies.</p>
<p>The ACA Code of Ethics is the most detailed in its treatment of supervision (Section F) and technology-assisted services (Section H). Section F.2.a requires supervisors to be competent in the supervisory modalities they employ, which includes telehealth supervision for supervisors who provide it. Section F.4.a requires supervisors to establish clear supervisory agreements that address the parameters of the supervisory relationship. Section F.7.a requires supervisors to ensure that supervisees are adequately prepared for the services they provide, which includes ensuring supervisees have telehealth-specific competencies before delivering telehealth services to clients.</p>
<p>The ACES Technology in Counseling and Supervision guidelines (2019) represent the most current and detailed professional guidance specifically applicable to telehealth supervision. These guidelines were developed by the Association for Counselor Education and Supervision, the primary professional organization for counselor educators and supervisors, and reflect current research and best practice consensus in the field. The ACES guidelines address technology competencies for supervisors, ethical obligations in online supervision, data security and client confidentiality in telehealth supervision contexts, and the integration of technology into supervisory feedback and evaluation processes. Georgia supervisors should treat the ACES technology guidelines as an authoritative professional standard supplement to the ACA Code for purposes of telehealth supervision practice, even though the guidelines are not legally binding.</p>
<h3>The Counseling Compact and Cross-Jurisdictional Supervision</h3>
<p>Georgia joined the Counseling Compact in 2022, enabling compact-eligible licensed counselors to practice in other compact member states without obtaining additional state licenses. This development has significant implications for telehealth supervision, because it means that supervisors may be authorizing supervisees to serve clients located in other compact member states under Georgia law and Georgia supervisory authorization.</p>
<p>The Counseling Compact applies to licensed counselors, not to pre-licensed supervisees. A supervisee practicing under a Georgia supervision agreement is practicing under Georgia licensure regardless of where the supervisee is physically located or where the supervisee's clients are located. The supervisee's authorization to practice derives entirely from their supervisory agreement and their Georgia license status. Compact-member-state practice privileges are not available to pre-licensed supervisees.</p>
<p>This has a practical implication that supervisors must communicate clearly to supervisees: a supervisee who is providing telehealth services to clients in other states is doing so under Georgia law and Georgia supervisory authorization, and must comply with Georgia's telehealth requirements regardless of the laws of the state where the client is located. The supervisee cannot apply another state's less restrictive telehealth standards simply because the client is physically located in that state. Georgia law governs the supervisee's practice.</p>`,
          accessibility: { role: "article" }
        },
        {
          type: "accordion",
          title: "The Three Supervisor-Specific Provisions of Rule 135-11",
          accordionItems: [
            {
              title: "1. The Additional Three-Hour Training Requirement",
              content: `<p>Supervisors must complete three hours of supervisor-specific telehealth training <em>in addition to</em> the six hours required of all telehealth practitioners, for a nine-hour total, all within the five years preceding supervision. The supervisor-specific content must address structured competence evaluation, observation and feedback in virtual environments, three-party confidentiality management, and technology failure response — not general telehealth practice.</p>`
            },
            {
              title: "2. Dual Verbal and Written Consent from Supervisees",
              content: `<p>Before conducting supervision via telemental health, supervisors must obtain both verbal AND written consent from supervisees, with both recorded in the supervisee's record. Verbal consent is not a formality — it ensures genuine interactive understanding and cannot be substituted by a signed form alone. Consent must address platforms used, emergency procedures, third-party vendors, and the right to request in-person supervision.</p>`
            },
            {
              title: "3. Full Application of Rule 135-5 Supervisory Standards",
              content: `<p>Telehealth supervision is not a distinct, lesser form of supervision. Rule 135-11 explicitly integrates Rule 135-5 — meaning synchronous supervision hour requirements, documentation obligations, and supervisor qualification standards all apply fully. Asynchronous feedback cannot replace the synchronous supervision hours Rule 135-5 requires, regardless of feedback quality.</p>`
            }
          ],
          accessibility: { ariaLabel: "Rule 135-11 supervisor provisions", role: "region" }
        },
        {
          type: "flashcardDeck",
          title: "Regulatory Terminology — Rule 135-11 and Its Ecosystem",
          cards: [
            { front: "Rule 135-11", back: "Georgia Composite Board rule adopted 2015: 'Standards for the Delivery of Services by TeleMental Health.' Requires 9 total telehealth training hours for supervisors within a rolling 5-year window." },
            { front: "Rule 135-5", back: "Georgia Board rule governing supervision standards for LPCs, LCSWs, and LMFTs. Rule 135-11 explicitly integrates 135-5 — all its standards apply to telehealth supervision." },
            { front: "Dual Consent", back: "Under Rule 135-11, both verbal AND written consent must be obtained from supervisees before telehealth supervision begins, with both components documented." },
            { front: "BC-TMH", back: "Board Certified-TeleMental Health Provider credential from CCE/NBCC. A professional excellence credential providing a telehealth competency framework — not a Georgia Board-required credential." },
            { front: "Counseling Compact", back: "Interstate agreement allowing licensed counselors to practice in member states without additional licenses. Applies to licensed counselors only, NOT pre-licensed supervisees." },
            { front: "Business Associate Agreement (BAA)", back: "HIPAA-required contract between a covered entity and a vendor that handles PHI. Required for any video platform, transcription service, or cloud storage used in telehealth supervision." },
            { front: "Five-Year Recency Window", back: "Rule 135-11 requires all 9 training hours to have been completed within the 5 years preceding provision of telehealth supervision. This is a rolling — not fixed — boundary." }
          ],
          accessibility: { ariaLabel: "Regulatory terminology flashcards", role: "region" }
        },
        {
          type: "reflection",
          title: "Reflective Practice: Your Current Training Currency",
          prompt: "Pause and mentally audit your own telehealth training record. Can you identify (a) the date of your most recent 6-hour general telehealth training, (b) the date of your most recent 3-hour supervisor-specific telehealth training, and (c) whether each is within the 5-year window as of today? If you cannot answer these questions from memory or a readily-available document, what documentation practice would you need to adopt to be audit-ready?",
          minLength: 150,
          accessibility: { ariaLabel: "Reflective practice prompt", role: "region" }
        },
        {
          type: "multipleChoice",
          question: "Under Georgia Rule 135-11, the requirement that all 9 telehealth training hours be completed within the 5 years preceding supervision is best described as:",
          options: [
            "A one-time threshold that, once met, does not need to be re-verified",
            "A guideline the Board has not enforced since the COVID-19 public health emergency",
            "A requirement that applies only to newly credentialed supervisors",
            "A rolling 5-year window that supervisors must continuously monitor"
          ],
          correctAnswer: 3,
          explanation: "The 5-year window operates as a rolling boundary. Training hours age past the window continuously, and supervisors must maintain a training log and plan renewal CE proactively to stay compliant."
        },
        {
          type: "multipleChoice",
          question: "A supervisor has completed verbal consent discussion with a new supervisee but has not yet obtained a signed written consent form. Under Rule 135-11, which statement is most accurate?",
          options: [
            "The verbal consent alone is sufficient if documented in the supervisee's record",
            "The supervisor may begin supervision if the written consent is obtained within 30 days",
            "Both verbal and written consent must be obtained before supervision begins; neither can substitute for the other",
            "Written consent alone is sufficient as long as the supervisee has read the agreement"
          ],
          correctAnswer: 2,
          explanation: "Rule 135-11 requires BOTH verbal AND written consent, with both components documented in the supervisee's record. Neither component substitutes for the other, and supervision should not begin until both are complete."
        },
        {
          type: "multipleChoice",
          question: "A supervisor's practice relies exclusively on asynchronous review of supervisee session recordings with detailed written feedback. Regarding Rule 135-5 compliance, this supervisor is:",
          options: [
            "In compliance, because the feedback quality substitutes for synchronous interaction",
            "In compliance only if the supervisee also maintains peer consultation",
            "Not in compliance; asynchronous feedback cannot replace required synchronous supervision hours",
            "In compliance only for experienced supervisees nearing independent practice"
          ],
          correctAnswer: 2,
          explanation: "Rule 135-5 requires synchronous (real-time audio-visual) supervision hours. Asynchronous methods may supplement but cannot replace these hours regardless of feedback depth. This is a common compliance gap for supervisors working with geographically distant supervisees."
        }
      ]
    },

    // ════════════════════════════════════════════════════════
    // SECTION 2: Implementing Compliance
    // ════════════════════════════════════════════════════════
    {
      title: "Implementing Compliance: Common Errors, Audits, and Remediation",
      order: 2,
      contentBlocks: [
        {
          type: "sectionDivider",
          sectionNumber: 2,
          title: "Section 2",
          subtitle: "Implementing Compliance",
          accessibility: { role: "heading", ariaLevel: 2 }
        },
        {
          type: "text",
          content: `<h2>Common Compliance Errors and How to Prevent Them</h2>
<p>An analysis of Georgia Board disciplinary records and professional consultation reports reveals several recurring compliance errors specific to telehealth supervision. Supervisors who understand these patterns can proactively prevent violations and protect both their supervisees and themselves from disciplinary exposure.</p>
<h3>Error 1: Completing Only Six Hours of Telehealth Training</h3>
<p>The most common supervisor compliance error is completing only six hours of telehealth training and believing that full compliance has been achieved. Georgia law requires nine hours for supervisors, and the rule is unambiguous on this point. Supervisors who have completed the six-hour general requirement but have not completed the three additional supervisor-specific hours are in violation of Rule 135-11 when providing telehealth supervision, regardless of their years of experience or their general clinical competence.</p>
<p>This error is particularly common among supervisors who completed their initial telehealth training before the supervisory provisions of Rule 135-11 became widely understood in the professional community. Supervisors who completed six hours of general telehealth training between 2015 and 2020 and assumed that satisfied the full supervisory requirement should audit their CE records and, if the supervisor-specific three hours are not documented, complete that training before continuing to provide telehealth supervision.</p>
<h3>Error 2: Using a Standard Supervisory Agreement Without Telehealth Provisions</h3>
<p>Many supervisors use supervisory agreement templates that were developed for in-person supervision and have not been updated to address telehealth-specific provisions. These agreements do not satisfy Rule 135-11's consent requirements for telehealth supervision because they do not address the technology platforms, emergency protocols, third-party vendor disclosures, or the right to request in-person supervision that the rule requires.</p>
<p>A supervisory agreement that lacks telehealth provisions does not constitute informed consent for telehealth supervision under Rule 135-11. Supervisors who are currently using general supervisory agreements should immediately develop a telehealth addendum or revise their base agreement to incorporate the required telehealth-specific elements. The consent requirement is not satisfied by verbal assurances or informal communications about how telehealth supervision will work; the written agreement must address each required element.</p>
<h3>Error 3: Neglecting Emergency Protocol Development and Testing</h3>
<p>Supervisors frequently develop emergency protocols that exist only on paper and have never been reviewed or rehearsed with supervisees. A supervisee who has signed an agreement referencing an emergency protocol but has never been walked through the actual procedures is likely to be unable to execute the protocol effectively in an actual emergency, particularly in a high-stress crisis situation when clear procedural recall is most important.</p>
<p>Emergency protocols for telehealth supervision must be operational, not merely documented. Supervisors should conduct a verbal walk-through of all emergency protocols at the beginning of each supervisory relationship, verify that supervisees can accurately describe what to do in each emergency scenario, and update the protocols whenever relevant circumstances change. Documentation of protocol review should be included in the supervisory record.</p>
<h3>Error 4: Assuming HIPAA Compliance for All Video Platforms</h3>
<p>A widespread compliance error is using video conferencing platforms that are marketed as secure or encrypted without verifying HIPAA compliance specifically. Many platforms that are suitable for general business use do not meet HIPAA Security Rule requirements because they lack Business Associate Agreement availability, do not provide adequate audit logging, or store data on servers outside the required security parameters.</p>
<p>Supervisors should verify HIPAA compliance for every platform used in their telehealth supervision practice, including the platform used for synchronous supervision sessions, any platform used for reviewing or transmitting session recordings, any messaging or communication platform used for supervisee communications that include clinical content, and any platform used for storing supervision documentation. Each platform should have a current BAA on file before clinical use begins.</p>
<p>Supervisors overseeing supervisees who deliver telehealth services to clients with severe mental illness, active suicidality, or other high-acuity presentations must give particular attention to the suitability assessment requirements of Rule 135-11. The rule requires clinicians to conduct a careful assessment using instruments referenced in Board Rule 135-7-.05 to determine whether a client may be properly assessed or treated via telemental health. Supervisors bear responsibility not only for ensuring that supervisees perform this assessment, but for verifying that supervisees apply it accurately and document it appropriately. A supervisee who provides telehealth services to a client who is not suitable for telehealth delivery, without adequate suitability assessment, is in violation of Rule 135-11, and the supervisor who failed to verify this assessment practice shares in that compliance failure. Supervisors should review suitability assessment documentation as part of regular supervisory oversight, not merely at intake.</p>
<p>The practical mechanics of conducting meaningful clinical observation via telehealth require supervisors to develop new observational skills that account for the limitations of the virtual environment. In in-person observation, a supervisor has access to the full behavioral channel: posture, movement, tone of voice, facial expressions, and use of physical space all contribute to the supervisory observation. In telehealth observation, the supervisor sees a compressed video image that transmits a fraction of this information. Camera angle, lighting, and the supervisee's comfort with being observed on video all affect what the observation captures. Supervisors should discuss with supervisees how to optimize their telehealth setup for observation, including camera placement that shows the supervisee's face and upper body clearly, and should be explicit with supervisees about what observational data they are and are not able to gather from the virtual observation format and how supervisees can supplement virtual observation with self-report and reflective activities that address competencies the telehealth format cannot fully assess.</p>
<p>The formal evaluation of supervisee performance in telehealth contexts requires supervisors to develop evaluation criteria that specifically address telehealth competencies rather than relying solely on general clinical skill frameworks developed for in-person practice. Many standardized supervisory evaluation instruments used in counselor education and internship settings were developed prior to the widespread adoption of telehealth and do not include items specifically addressing telehealth competencies. Supervisors who rely on these instruments without supplementing them with telehealth-specific criteria may provide supervisees with evaluations that do not accurately reflect their readiness for independent telehealth practice. Supervisors should review their evaluation instruments for telehealth content and should add items addressing the BC-TMH competency domains, client suitability assessment, telehealth informed consent practices, and regulatory compliance knowledge for any supervisee who will be independently practicing via telehealth.</p>
<p>Supervisors providing telehealth supervision across geographic distances or time zones should be particularly attentive to how physical distance affects the supervisory relationship and emergency availability protocols. A supervisor and supervisee in different time zones may have limited overlap in working hours, which affects both the scheduling of synchronous supervision sessions and the practical availability of supervisor support during supervisee client hours. Supervision agreements should explicitly address time zone parameters and should ensure that emergency contact protocols are realistic given the actual overlap between supervisor and supervisee working hours. Supervisors who agree to supervise across significant time zone differences should be honest with themselves and their supervisees about the limitations this creates for real-time supervisory support, and should ensure that supervisees have adequate coverage arrangements for periods when the supervisor is unavailable due to time zone differences.</p>
<h3>Error 5: Inadequate Documentation of Training Currency</h3>
<p>Rule 135-11 imposes not merely a training completion requirement but a training currency requirement: all telehealth training hours, for both general practice and supervisor-specific content, must have been completed within the five years immediately preceding the provision of telemental health supervision. Supervisors frequently treat this as a one-time compliance achievement rather than an ongoing documentation obligation, and this assumption creates a recurring risk of inadvertent noncompliance.</p>
<p>The five-year window operates as a rolling rather than fixed boundary. A supervisor who completed six hours of general telehealth training in March 2020 and three hours of supervisor-specific training in June 2020 is fully compliant on the date each training was completed. But that supervisor will fall out of compliance on March 1, 2025, when the general telehealth training hours age past the five-year window, unless renewal hours have been completed in the interim. Supervisors who do not maintain a calendar of training currency dates often discover these expirations only when asked to produce documentation during a Board audit or in the aftermath of a complaint investigation — a context in which the discovery is consequential in ways it would not have been if identified during routine professional self-review.</p>
<p>The practical solution is a written training log that records the title, provider, date of completion, hour total, and content category (general telehealth versus supervisor-specific) for every telehealth training the supervisor has completed. The log should be updated immediately upon completing any new training, reviewed at least quarterly to identify hours approaching the five-year threshold, and used as the planning basis for annual continuing education calendars. Supervisors who maintain this documentation practice avoid the common scenario in which a capable and well-intentioned supervisor falls technically out of compliance because their training documentation has not kept pace with the rolling five-year window. This practice also provides the documentation a supervisor needs to respond promptly and persuasively to any Board inquiry about training currency, rather than scrambling to reconstruct training records from email archives, certificate files, and memory.</p>
<h3>Error 6: Failing to Renegotiate Consent After Significant Platform or Protocol Changes</h3>
<p>Rule 135-11's informed consent requirement is not satisfied by a single consent document signed at the outset of the supervisory relationship and never revisited. Any material change in the telehealth supervision arrangement — a change of video conferencing platform, a modification of emergency protocols, the addition of a new third-party vendor handling supervisee or client data, or a change in the geographic location from which the supervisee is providing services — triggers an obligation to renegotiate consent with the supervisee. A consent document that references a platform the supervisor no longer uses, or that omits a vendor now integral to the supervisory workflow, is not the informed consent the rule requires.</p>
<p>This error arises frequently because supervisors adopt new technology tools incrementally in response to operational needs without treating each change as a consent-relevant event. A supervisor who migrates from one HIPAA-compliant video platform to another because of pricing changes may assume this is an internal business decision of no concern to the supervisee, but it is in fact a change that should be disclosed, documented, and acknowledged in writing. Similarly, the addition of a documentation or transcription service that processes supervision session content creates a new data flow that supervisees have a right to be informed about and to consent to. The cumulative effect of several such undisclosed changes over the course of a multi-year supervisory relationship is a consent record that bears little resemblance to the actual operation of the supervisory arrangement.</p>
<p>Supervisors should adopt a practice of treating consent as a living document rather than an archival one. The supervisory agreement should be reviewed annually at minimum, with a structured review protocol that addresses each category of potential change: platforms used, vendors with access to data, emergency protocols, geographic circumstances of supervision, and any other element referenced in the original consent. When changes have occurred, an amendment or updated consent should be developed, discussed with the supervisee, and signed by both parties. This practice protects the supervisor from the compliance risk of outdated consent documentation and also maintains the quality of the supervisory alliance by ensuring that the formal relationship structure accurately reflects its actual operation.</p>
<h2>Implementing a Systematic Compliance Audit</h2>
<p>The most practical step supervisors can take upon completing this course is to conduct a systematic audit of their telehealth supervision arrangements against the requirements of Rule 135-11, Rule 135-5, and applicable ethics codes. A compliance audit is not a one-time exercise; it should be conducted at the outset of each new supervisory relationship, revisited annually, and updated whenever there is a significant change in technology platforms, supervisee caseload, or regulatory guidance. The audit should address training and credential documentation, platform HIPAA compliance, supervisory agreement completeness, consent documentation currency, emergency protocol adequacy, and competency evaluation framework alignment with current telehealth practice standards.</p>
<p>Training verification should be the first step of every supervisory compliance audit because it is the foundational requirement from which all other supervisory obligations flow. Before accepting any supervisee for telehealth supervision, supervisors should document that they have completed nine hours of telehealth training within the past five years. This documentation should include certificates or transcripts that identify content, provider, date, and credit hours for each training component. If any portion of the training is approaching the five-year mark, renewal training should be scheduled proactively rather than reactively.</p>
<p>Platform HIPAA compliance verification should be the second audit step because it affects every aspect of the telehealth supervision arrangement. Supervisors should maintain a current record of the platforms used in their telehealth supervision practice, the BAA status of each platform, and the date of last HIPAA compliance verification. This record should be updated whenever a new platform is adopted or whenever a platform' security certifications are renewed. Platform HIPAA compliance should be verified through the platform vendor's documentation rather than assumed based on general market reputation, because HIPAA compliance status can change when platforms update their architectures, change their terms of service, or are acquired by other organizations.</p>
<h4>Knowledge Check 1</h4>
<p><strong>Under Georgia Composite Board Rule 135-11, how many total hours of telehealth training are required for a supervisor providing supervision via telemental health?</strong></p>
<ul>
  <li>3 hours (supervisor-specific training only)</li>
  <li>6 hours (same as all telehealth practitioners)</li>
  <li><strong>9 hours (6 general + 3 supervisor-specific)</strong></li>
  <li>12 hours (annual renewal requirement)</li>
</ul>
<p><strong>Correct Answer: C. </strong><em>9 hours (6 general + 3 supervisor-specific)  |  Rule 135-11 requires 6 hours for all telehealth practitioners plus 3 additional supervisor-specific hours, totaling 9 hours for supervisors.</em></p>
<h4>Knowledge Check 2</h4>
<p><strong>Which of the following best describes the consent requirement Rule 135-11 imposes on supervisors before providing telehealth supervision?</strong></p>
<ul>
  <li>Written consent only from the supervisee, retained in the supervisory record</li>
  <li>Verbal consent only, as supervisees are professionals who do not need formal consent</li>
  <li><strong>Both verbal AND written consent from the supervisee, both documented in the supervisory record</strong></li>
  <li>No formal consent is required for supervisory relationships under Georgia law</li>
</ul>
<p><strong>Correct Answer: C. </strong><em>Both verbal AND written consent from the supervisee, both documented in the supervisory record  |  Rule 135-11 extends its dual consent requirement to supervisory relationships. Both verbal and written consent must be obtained and documented in the supervisee record.</em></p>`,
          accessibility: { role: "article" }
        },
        {
          type: "matching",
          title: "Compliance Error to Remediation",
          instructions: "Match each common Rule 135-11 compliance error to its primary remediation strategy.",
          pairs: [
            { left: "Completing only 6 hours of telehealth training", right: "Complete the additional 3 supervisor-specific hours within the 5-year window" },
            { left: "Using a generic supervisory agreement without telehealth provisions", right: "Develop a telehealth addendum addressing platforms, vendors, emergency protocols, and supervisee rights" },
            { left: "Documenting emergency protocols but never rehearsing them", right: "Conduct verbal walk-through of protocols at the start of each supervisory relationship and verify supervisee recall" },
            { left: "Using a general video platform without verified HIPAA compliance", right: "Verify BAA availability and Security Rule compliance for every platform used; never assume encryption equals HIPAA compliance" },
            { left: "Signing consent once at the start and never revisiting", right: "Treat consent as a living document; review annually and amend whenever platforms, vendors, or protocols change" },
            { left: "Keeping training records in scattered certificates and email archives", right: "Maintain a central written training log with title, provider, date, hours, and content category for every completed training" }
          ],
          accessibility: { ariaLabel: "Compliance error matching activity", role: "region" }
        },
        {
          type: "scenarioTree",
          title: "Compliance Decision: The New Supervisee Intake",
          description: "A newly credentialed associate counselor requests to begin telehealth supervision with you next Monday. Work through the intake decision points.",
          scenario: {
            prompt: "The supervisee's onboarding packet includes a signed general supervisory agreement from a template you have used for five years. You have 6 hours of general telehealth CE from 2021 and 3 hours of supervisor-specific training from 2019. The supervisee intends to serve telehealth clients starting their first week. What is your next action?",
            choices: [
              {
                text: "Proceed with supervision as scheduled; paperwork can be updated during the first month.",
                feedback: "This is a Rule 135-11 violation on two fronts. Your supervisor-specific training from 2019 is outside the 5-year window (if today is 2024 or later), and the general supervisory agreement lacks required telehealth provisions. Supervision cannot begin without these remedied.",
                correct: false
              },
              {
                text: "Postpone the start date. Complete renewal supervisor-specific training, develop a telehealth-compliant supervisory agreement, and conduct both verbal and written consent before beginning.",
                feedback: "Correct. Rule 135-11 compliance requires current training (9 hours within rolling 5-year window), a telehealth-specific supervisory agreement, and documented dual verbal/written consent — all before supervision begins.",
                correct: true
              },
              {
                text: "Accept the existing supervisory agreement but add a verbal discussion of telehealth provisions to the first session.",
                feedback: "The verbal discussion does not satisfy the written consent requirement when the underlying agreement omits telehealth provisions. Rule 135-11 requires written consent specifically addressing telehealth platforms, vendors, emergency protocols, and the right to request in-person supervision.",
                correct: false
              },
              {
                text: "Ask the supervisee to complete their 6-hour general telehealth training before beginning, which resolves the supervisor's compliance gap.",
                feedback: "The supervisee's training obligations are separate from the supervisor's. The supervisor's own 9-hour nine-hour requirement (6 general + 3 supervisor-specific) applies regardless of supervisee training. The supervisee completing training does not satisfy any supervisor obligation.",
                correct: false
              }
            ]
          },
          accessibility: { ariaLabel: "Scenario tree: new supervisee intake", role: "region" }
        },
        {
          type: "reflection",
          title: "Reflective Practice: Your Own Compliance Audit",
          prompt: "Identify one compliance element from this section where, upon honest self-review, you suspect you may have a gap — whether in training documentation, consent currency, platform HIPAA verification, or protocol rehearsal. Describe the specific step you will take within the next seven days to close that gap, and the mechanism you will use to verify that the step was actually completed.",
          minLength: 150,
          accessibility: { ariaLabel: "Compliance audit reflection", role: "region" }
        },
        {
          type: "multipleChoice",
          question: "A supervisor migrates from one HIPAA-compliant video platform to another due to pricing changes, considering this an internal business decision. Under Rule 135-11, which statement is correct?",
          options: [
            "The change does not affect consent obligations because both platforms are HIPAA-compliant",
            "The change requires disclosure to supervisees but not a new written consent",
            "The change triggers an obligation to renegotiate consent and obtain documented acknowledgment",
            "The change only requires action if supervisees specifically ask about it"
          ],
          correctAnswer: 2,
          explanation: "Any material change — platform migration, new third-party vendor, modified emergency protocol, changed geographic circumstances — triggers consent renegotiation under Rule 135-11. A consent document referencing tools no longer in use is not the informed consent the rule requires."
        },
        {
          type: "multipleChoice",
          question: "A supervisor has a written emergency protocol document that the supervisee signed at intake, but neither supervisor nor supervisee has ever walked through the actual steps. A client crisis occurs. Which statement best describes this situation?",
          options: [
            "The signed document demonstrates compliance regardless of rehearsal",
            "The supervisee's failure to execute the protocol correctly is a supervisee error, not a supervisor compliance issue",
            "Documented-but-unrehearsed protocols create elevated risk because supervisees are unlikely to recall unfamiliar procedures in crisis conditions",
            "The protocol is adequate if it was developed using a recognized template"
          ],
          correctAnswer: 2,
          explanation: "Emergency protocols must be operational, not merely documented. High-stress crisis conditions impair procedural recall; supervisees who have not rehearsed protocols are unlikely to execute them effectively, regardless of what they signed at intake. Protocol review and verbal walk-through should occur at the start of each supervisory relationship and whenever circumstances change."
        }
      ]
    },

    // ════════════════════════════════════════════════════════
    // SECTION 3: Ethics in Virtual Supervision
    // ════════════════════════════════════════════════════════
    {
      title: "Ethics in Virtual Supervision: Confidentiality, Competence, and Boundaries",
      order: 3,
      contentBlocks: [
        {
          type: "sectionDivider",
          sectionNumber: 3,
          title: "Section 3",
          subtitle: "Ethics in Virtual Supervision",
          accessibility: { role: "heading", ariaLevel: 2 }
        },
        {
          type: "text",
          content: `<h2>The Ethics of Supervision in a Virtual Environment</h2>
<p>Supervision is an ethically complex enterprise under any circumstances. The power differential between supervisor and supervisee, the gatekeeping function supervisors exercise over entry into the profession, and the indirect accountability supervisors bear for client outcomes create ethical obligations that exceed those in collegial professional relationships. When supervision moves into a virtual environment, these ethical complexities are amplified by the technological mediation of the supervisory relationship, the expanded opportunities for boundary diffusion that digital communication enables, and the unique confidentiality challenges that three-party telehealth supervision contexts introduce.</p>
<p>The ACA Code of Ethics (2014) and the NBCC Code of Ethics address supervision in considerable detail, establishing standards around informed consent (F.4), competence (F.2), avoiding nonprofessional relationships (F.3), documentation (F.1), evaluation and remediation (F.6), and due process (F.9). The Association for Counselor Education and Supervision Best Practices in Clinical Supervision (2011) and the ACES Technology in Counseling and Supervision guidelines (2019) provide additional specificity for telehealth supervision contexts. Georgia supervisors must integrate all of these frameworks with the specific requirements of Rule 135-11 and Rule 135-5 to construct an ethical supervisory practice that is both compliant and genuinely protective of supervisees and clients.</p>
<p>This section examines three domains that are particularly complex in telehealth supervision contexts: confidentiality in three-party telehealth interactions, technology as a dimension of supervisory competence, and the management of professional boundaries in virtual environments. Each domain presents challenges that do not arise in in-person supervision and that require supervisors to actively develop new professional skills and frameworks.</p>
<h2>Confidentiality in Three-Party Telehealth Supervision Contexts</h2>
<p>Standard confidentiality frameworks address the clinician-client dyad. Telehealth supervision introduces a fundamentally different structure: a three-party relationship involving supervisor, supervisee, and client, in which confidentiality obligations flow in multiple directions simultaneously. Clients whose sessions are observed or recorded for supervision purposes have confidentiality rights that supervisors must actively protect. Supervisees have confidentiality interests in their own professional development records. And supervisors have documentation obligations that may create tension with both sets of confidentiality interests. Managing these competing confidentiality obligations is one of the most complex ethical challenges in telehealth supervision practice.</p>
<h3>Client Confidentiality in Supervised Telehealth Sessions</h3>
<p>When a supervisor observes a supervisee's telehealth session, whether live through a co-observation platform or through recording review, the supervisor becomes privy to protected health information about clients who are not their patients. This creates obligations that supervisors must actively fulfill. First, the client must have been informed that their sessions may be observed or recorded for supervision purposes, and must have provided consent. This disclosure should appear in the client's telehealth informed consent documentation, and supervisors bear a responsibility to verify, not merely assume, that supervisees have obtained this consent before authorizing any observation or recording review.</p>
<p>Second, the platforms used for observation and recording review must meet HIPAA security requirements. A supervisee who shares a session recording with a supervisor via email or through a non-HIPAA-compliant file sharing service has violated client confidentiality, and a supervisor who accepts and reviews recordings transmitted through insecure channels bears shared responsibility for that violation. Supervisors should establish clear, written protocols for how session recordings are transmitted to and stored by the supervisor, verify that those protocols meet HIPAA requirements, and communicate those protocols to supervisees at the outset of the supervisory relationship.</p>
<p>Third, supervisors must maintain client confidentiality in their own documentation of supervisory sessions. Supervision notes that contain identifying client information must be stored in HIPAA-compliant systems with access controls appropriate to the sensitivity of the information. Supervisors who use general productivity tools, consumer-grade note-taking apps, or non-encrypted cloud storage for supervision notes containing PHI are creating compliance vulnerabilities that could result in HIPAA violations.</p>
<p>The group supervision format introduces additional confidentiality complexity. When supervisees present cases in group telehealth supervision, their clients' identifying information is being disclosed not only to the supervisor but to all supervisees in the group. Best practice is to present cases using de-identified information in group supervision, reserving identifying details for individual supervision when client permission has been obtained. Supervisors providing group telehealth supervision should establish explicit group confidentiality protocols and obtain agreements from all supervisees that they will maintain the confidentiality of all client information shared in group sessions.</p>
<h3>Supervisee Confidentiality and Documentation</h3>
<p>Supervisees have confidentiality interests in their supervision records, including documentation of their clinical performance, evaluative feedback, remediation activities, and professional development challenges. Supervisors must maintain supervision records with the same care and security they apply to client records, including appropriate access controls, clear retention policies, and explicit protocols governing who has access to supervision documentation beyond the supervisor and supervisee themselves.</p>
<p>The intersection of supervisee confidentiality and institutional authority creates significant ethical complexity, particularly in training programs, group practices, and agency settings where supervisors may answer to institutional administrators who have a legitimate interest in supervisee performance. Supervisors who are employed by or contracted with institutions that have administrative access to supervision records must disclose this to supervisees during the consent process, so that supervisees understand the limits of confidentiality in the supervisory relationship before they begin sharing professional development challenges.</p>
<p>When supervisee performance raises concerns about client safety or professional fitness, supervisors face a tension between supervisee confidentiality and their obligation to protect clients and the profession. This tension does not resolve in favor of confidentiality when client safety is at stake: supervisors have an affirmative ethical and legal obligation to take protective action, including reporting to licensing boards or training program administrators, when supervisee performance creates a credible risk of client harm. The key is that supervisors should handle performance concerns through appropriate institutional channels rather than through informal disclosures, and should document their supervisory interventions thoroughly to demonstrate that they fulfilled their supervisory obligation.</p>
<div class="callout-box"><p><strong>Clinical Vignette</strong> *Dr. Alexis Moreno supervises three pre-licensed counselors via telehealth. One supervisee, Marcus, has been struggling with a particularly difficult client who has disclosed active suicidal ideation. During a group supervision session conducted via video, Marcus begins describing the client<strong>'</strong>s presentation in detail, including the client<strong>'</strong>s name, employer, and the specific nature of the suicidal plan. Dr. Moreno has not established explicit protocols for de-identifying case presentations in group supervision. Consider: What confidentiality breach has occurred? What is Dr. Moreno<strong>'</strong>s supervisory obligation in this moment? What protocols should have been in place to prevent this situation?*</p></div>
<h2>Technology Competence as an Ethical Supervisory Obligation</h2>
<p>The ACA Code of Ethics requires supervisors to be competent in the supervisory modalities they employ (F.2.a). For supervisors providing telehealth supervision, this means possessing genuine competence in the technology and platform management skills required to supervise effectively in virtual environments, not merely the ability to operate a video conferencing application. Technology competence as an ethical obligation encompasses understanding how platforms handle data, knowing how to evaluate platform HIPAA compliance, being able to conduct meaningful clinical observation and feedback through a virtual interface, and having the capacity to assess supervisee technology competence and provide guidance for improving it.</p>
<p>Supervisors who provide telehealth supervision while experiencing significant discomfort with or avoidance of technology are potentially in violation of the ACA's competence standard. This is not about requiring supervisors to be technology enthusiasts; it is about requiring them to attain the level of technological proficiency needed to supervise effectively in the environment they have chosen to work in. If a supervisor cannot reliably operate the observation features of their supervision platform, cannot evaluate whether a supervisee's telehealth setup meets privacy standards, or cannot model effective telehealth practice for supervisees, they lack competence for telehealth supervision.</p>
<h3>Evaluating Supervisee Telehealth Competence: A Structured Framework</h3>
<p>One of the most important supervisor-specific telehealth competencies is the ability to evaluate supervisee telehealth competence using structured assessment frameworks. Supervisors who rely on informal impressions or general clinical skill assessments to evaluate supervisees' telehealth competence are likely to miss telehealth-specific skill deficits that can create client safety risks or regulatory compliance problems.</p>
<p>A structured approach to supervisee telehealth competence evaluation should assess multiple domains across the supervision period. Initial assessment, conducted during supervision orientation, should establish baseline competence in technology operation and troubleshooting, client suitability assessment for telehealth, telehealth informed consent procedures, crisis management protocols in virtual settings, and the supervisee's understanding of their regulatory obligations under Rule 135-11. Ongoing assessment throughout the supervision period should include direct observation of telehealth sessions (either live or through recording review) with structured feedback addressing telehealth-specific clinical skills.</p>
<p>The BC-TMH competency framework, developed by the Center for Credentialing and Education, provides a useful structure for telehealth competency assessment even for supervisors whose supervisees are not pursuing the BC-TMH credential. The BC-TMH competency domains include: technology proficiency, including platform management and troubleshooting; clinical assessment adaptations for the virtual environment; evidence-based telehealth clinical skills; regulatory compliance knowledge; crisis management in virtual contexts; cultural humility in telehealth; and documentation and billing for telehealth services. Supervisors can use these domains as an organizing framework for telehealth competency assessment and feedback.</p>
<div class="callout-box"><p><strong>Competency Domain</strong> <strong>Assessment Indicators and Methods</strong></p></div>
<div class="callout-box"><p>Technology proficiency Can operate platform features, troubleshoot common problems, maintain stable connection; assess via direct observation</p></div>
<div class="callout-box"><p>Client suitability assessment Accurately applies Rule 135-7-.05 assessment instruments; review assessment documentation</p></div>
<div class="callout-box"><p>Telehealth informed consent Obtains verbal and written consent addressing all required elements; review consent forms and session notes</p></div>
<div class="callout-box"><p>Virtual therapeutic alliance Adapts relationship-building skills for virtual format; review session recordings with structured feedback</p></div>
<div class="callout-box"><p>Crisis management protocols Can execute crisis protocol without supervisor availability; verbal walk-through and scenario simulation</p></div>
<div class="callout-box"><p>Regulatory compliance Understands Rule 135-11 obligations for their own practice; knowledge assessment and documentation audit</p></div>
<div class="callout-box"><p>Cultural considerations Considers technology access disparities and cultural factors; case conceptualization review</p></div>
<div class="callout-box"><p>Documentation accuracy Documents telehealth modality, client location, and crisis protocols in records; documentation audit</p></div>
<h2>Professional Boundaries in Virtual Supervision Environments</h2>
<p>The ACA Code of Ethics (F.3.a) prohibits supervisors from engaging in multiple relationships with supervisees when those relationships could impair professional judgment or create risk of exploitation. The virtual supervision environment introduces categories of multiple relationship risk that do not exist in in-person supervision and that supervisors must actively manage through explicit policies and consistent behavioral modeling.</p>
<h3>Social Media and Digital Boundary Management</h3>
<p>Social media presents particular challenges for supervisory boundary management. The distinction between professional and personal social media contexts, which is relatively clear in in-person professional settings, becomes blurred in virtual environments where the same devices and platforms are used for professional and personal purposes and where the boundaries between professional and personal communication are inherently permeable.</p>
<p>A general framework for supervisory social media boundaries distinguishes among three categories of platforms. Professional platforms such as LinkedIn, ResearchGate, and professional association networks are generally appropriate for supervisor-supervisee connections that are limited to professional content. These connections do not typically create meaningful boundary concerns because they are designed for professional networking and expose primarily professional rather than personal content. Personal social media platforms such as Instagram, Facebook, TikTok, and Twitter/X present meaningful boundary concerns when supervisor-supervisee connections expose personal lifestyle information, social activities, or informal self-expression that would be inappropriate to share in a professional relationship. Supervisors should generally decline social media connections with current supervisees on personal platforms and should articulate this boundary explicitly in the supervisory agreement rather than managing it on a case-by-case basis.</p>
<p>Messaging and instant communication applications require particular attention in telehealth supervision contexts because they are frequently used for quick coordination and supervisory check-ins in ways that can gradually erode professional boundaries. Text messages, WhatsApp messages, and similar communications that begin as logistical coordination can evolve into channels for informal clinical consultation, personal support, or social interaction. Supervisors should establish explicit protocols for asynchronous communication in the supervisory agreement: what platforms are used for what purposes, what types of content are appropriate for each platform, and how supervisory communications involving clinical content will be documented.</p>
<h3>Emotional Presence and Relational Attunement in Virtual Supervision</h3>
<p>The supervisory alliance, the quality of the working relationship between supervisor and supervisee, is among the most robust predictors of supervisory effectiveness in the research literature (Bernard & Goodyear, 2019). The telehealth environment introduces mediating factors that can attenuate supervisory alliance if supervisors do not intentionally adapt their relational practices for the virtual context.</p>
<p>In-person supervisory relationships benefit from the richness of full-body communication, shared physical presence, and the relational warmth of eye contact and proximity. Telehealth supervision reduces the channel bandwidth available for relational communication: supervisors and supervisees see each other through camera lenses that do not fully capture eye contact, body language is compressed into a small video frame, and the absence of shared physical space can make interactions feel more transactional and less relational. Supervisors who do not intentionally compensate for these limitations may find that their telehealth supervisory relationships feel less connected and that supervisees are less open about clinical struggles or professional development challenges than they would be in person.</p>
<p>Effective telehealth supervision requires deliberate attention to relational quality. This includes practices such as beginning supervision sessions with brief check-ins that invite supervisees to bring their full experience to the session, not merely their clinical cases; using explicit verbal communication to convey the warmth and attunement that would be communicated nonverbally in person; periodically reflecting on the supervisory relationship itself and inviting supervisee feedback on the virtual supervision experience; and periodically incorporating in-person supervision when feasible to reinforce the relational foundation of the supervisory relationship.</p>
<h3>Supervisee Vulnerability and Power Dynamics in Telehealth Contexts</h3>
<p>Pre-licensed supervisees are in a particularly vulnerable position in relation to their supervisors: they depend on the supervisor for licensure progress, professional references, and the clinical judgment that shapes their development as practitioners. This power differential, which is inherent to the supervisory relationship, is not eliminated by the telehealth environment. In some respects, it may be amplified.</p>
<p>Research on online professional relationships (Rousmaniere & Renfro-Michel, 2016) suggests that the physical distance of virtual interactions can both increase supervisee comfort with disclosing professional struggles (because the reduced physical proximity feels safer) and increase supervisee isolation when they are experiencing difficulty (because the reduced physical presence makes it harder to notice when supervisees are struggling). Supervisors who are primarily attuned to what supervisees are saying, rather than to the fuller relational texture of the interaction, may miss signals of supervisee distress, professional difficulty, or ethical compromise that would be more visible in person.</p>
<p>Supervisors should therefore maintain intentional practices for monitoring supervisee wellbeing in telehealth supervision: regular direct inquiry about supervisee professional wellness, caseload stress, and personal circumstances that may be affecting practice; periodic structured reflection exercises that invite supervisees to assess their own practice; and explicit acknowledgment that it is safe to bring struggles, uncertainties, and mistakes to supervision without fear of punitive response. These practices are important in any supervisory context but are particularly critical in telehealth supervision, where the attenuated relational channel makes it easier for supervisee difficulties to go undetected.</p>`,
          accessibility: { role: "article" }
        },
        {
          type: "cardSort",
          title: "Confidentiality Scenarios: HIPAA-Appropriate or Not?",
          instructions: "Sort each scenario into the appropriate category based on HIPAA and Rule 135-11 requirements.",
          categories: ["Compliant", "Non-Compliant / Risk Exposure"],
          items: [
            { text: "Discussing a de-identified case vignette during group supervision on a HIPAA-compliant video platform with a current BAA", category: "Compliant" },
            { text: "Reviewing a supervisee's session recording via a cloud storage service that does not have a BAA on file", category: "Non-Compliant / Risk Exposure" },
            { text: "Using a consumer-grade messaging app to send supervisee a quick note containing a client's initials and clinical presentation", category: "Non-Compliant / Risk Exposure" },
            { text: "Conducting supervision in a home office with a closed door, noise machine, and no household members present", category: "Compliant" },
            { text: "Taking supervision sessions from a coffee shop using the venue's public Wi-Fi", category: "Non-Compliant / Risk Exposure" },
            { text: "Storing supervision notes in an EHR that meets HIPAA Security Rule requirements and has audit logging", category: "Compliant" },
            { text: "Reviewing a session recording via screen-share on a video platform without verifying the platform handles PHI appropriately", category: "Non-Compliant / Risk Exposure" },
            { text: "Obtaining current client consent for recording that specifically names the supervisor who will review the recording", category: "Compliant" }
          ],
          accessibility: { ariaLabel: "Confidentiality sorting activity", role: "region" }
        },
        {
          type: "scenarioTree",
          title: "The Social Media Boundary: A Supervisory Dilemma",
          description: "A supervisee sends a LinkedIn connection request to their supervisor mid-way through the supervisory relationship. The supervisor also has personal accounts on Instagram and Facebook that contain family photos and political commentary.",
          scenario: {
            prompt: "Under ACA Code F.3.a and the ethics of supervisory boundary management, what is the supervisor's most defensible response?",
            choices: [
              {
                text: "Accept the LinkedIn connection — it is a professional platform — and treat it as separate from personal social media.",
                feedback: "Partially defensible but incomplete. Accepting LinkedIn is reasonable given its professional nature, but the broader boundary question remains: has this been addressed in the supervisory agreement? Without an explicit social media policy, the decision is made case by case rather than within a clear boundary framework.",
                correct: false
              },
              {
                text: "Decline all social media connections during the supervisory period, including LinkedIn, and document this in the supervisory agreement.",
                feedback: "This is one defensible approach. Blanket declination avoids the differential treatment issue and establishes a clean boundary. It should be disclosed in the supervisory agreement rather than communicated only when a request occurs, so supervisees understand the policy up front.",
                correct: true
              },
              {
                text: "Accept the LinkedIn connection and the supervisee's other social media requests, reasoning that supervisory boundaries are less important in virtual environments.",
                feedback: "This is ethically problematic. ACA F.3.a identifies multiple relationships as a supervisory concern, and personal social media access creates mutual access to personal information that can alter the power dynamics and evaluative clarity of the supervisory relationship. Virtual environments do not reduce this concern.",
                correct: false
              },
              {
                text: "Develop a written social media policy in the supervisory agreement that articulates which platforms the supervisor will and will not engage on during the supervisory relationship, then respond to the request per that policy.",
                feedback: "Correct. The defensible practice is to establish the policy proactively rather than reactively. The supervisory agreement should articulate the supervisor's stance on each category of platform (professional networking, general social media, messaging apps) so that responses to requests are grounded in a pre-existing policy rather than case-by-case judgment.",
                correct: true
              }
            ]
          },
          accessibility: { ariaLabel: "Social media boundary scenario", role: "region" }
        },
        {
          type: "reflection",
          title: "Reflective Practice: Technology Competence Self-Assessment",
          prompt: "Rate your own technology competence in each of the following supervisory tasks on a scale from 1 (limited) to 5 (highly competent): (1) evaluating whether a video platform meets HIPAA Security Rule standards; (2) troubleshooting common platform failures during a live supervision session; (3) assessing supervisee telehealth setup for privacy and observational adequacy; (4) securely transmitting and storing session recordings that contain PHI. Identify the lowest-rated area and describe one concrete step you will take within 30 days to strengthen that competence.",
          minLength: 150,
          accessibility: { ariaLabel: "Technology competence reflection", role: "region" }
        },
        {
          type: "multipleChoice",
          question: "According to the ACA Code of Ethics, what is a supervisor's ethical obligation regarding technology competence in telehealth supervision?",
          options: [
            "Supervisors must be competent in the supervisory modalities they employ, including the technology used for telehealth supervision",
            "Supervisors must obtain the BC-TMH credential before providing telehealth supervision",
            "Technology competence is a supervisee responsibility, not a supervisor ethical obligation",
            "Supervisors are exempt from technology competence requirements if they received training before 2015"
          ],
          correctAnswer: 0,
          explanation: "ACA Code F.2.a requires supervisors to be competent in the modalities they employ. For telehealth supervisors, this includes genuine technology competence sufficient to supervise effectively in the virtual environment."
        },
        {
          type: "multipleChoice",
          question: "During group supervision, a supervisee spontaneously shares a client's full name and employer while describing a clinical dilemma. Which response best reflects the supervisor's ethical obligation?",
          options: [
            "Continue the case discussion as scheduled; the group supervision format provides sufficient confidentiality protection",
            "Document the event but take no further action, since the information was shared in good faith",
            "End the group immediately and refer the client to another clinician",
            "Pause the discussion, redirect to de-identified presentation, and address the breach in post-group debrief with the supervisee"
          ],
          correctAnswer: 3,
          explanation: "The supervisor's ethical obligation is to protect client confidentiality in real time by interrupting identifying disclosure, then address the breach educationally with the supervisee afterward. Group supervision does not create an expanded confidentiality envelope that permits identifying client information to be shared."
        }
      ]
    },

    // ════════════════════════════════════════════════════════
    // SECTION 4: Cultural Competence & Developmental Considerations
    // ════════════════════════════════════════════════════════
    {
      title: "Cultural Competence and Developmental Considerations",
      order: 4,
      contentBlocks: [
        {
          type: "sectionDivider",
          sectionNumber: 4,
          title: "Section 4",
          subtitle: "Cultural Competence and Developmental Considerations",
          accessibility: { role: "heading", ariaLevel: 2 }
        },
        {
          type: "text",
          content: `<h2>Developmental Considerations in Telehealth Supervision</h2>
<p>The developmental context of the supervisory relationship has important implications for how supervisors approach ethical challenges in telehealth supervision. Supervisors using the Integrated Developmental Model (Stoltenberg & McNeill, 2009) recognize that supervisees at different developmental stages have different needs, different vulnerabilities, and different capacities for self-direction. Beginning supervisees, characterized by high anxiety and strong dependence on supervisor direction, may be particularly vulnerable to the power dynamics of telehealth supervision because the virtual environment can amplify their sense of isolation and reduce the natural supervisory attunement that in-person proximity provides. Supervisors working with beginning supervisees in telehealth contexts should be intentional about creating explicit structures for support and feedback, reducing the ambiguity that high-anxiety supervisees find most difficult, and maintaining consistent, reliable supervisory presence that helps build the secure supervisory base from which effective clinical development proceeds.</p>
<p>Mid-level supervisees, characterized by growing confidence and productive discomfort with clinical complexity, present different supervisory challenges in telehealth contexts. These supervisees may resist supervisory structure in ways that create compliance risks, may develop overconfidence that makes them less likely to seek consultation in ambiguous situations, and may use the physical distance of telehealth supervision to manage a supervisory relationship they find challenging. Supervisors working with mid-level supervisees via telehealth should be attentive to signs of supervisory resistance or avoidance, should maintain clear expectations about supervisory disclosure and consultation, and should periodically conduct explicit metacommunication about the supervisory relationship to ensure that the telehealth format is not creating barriers to honest supervisory engagement.</p>
<p>Advanced supervisees, approaching independent practice readiness, present yet another set of considerations. The supervisory relationship at this stage should increasingly resemble consultative peer interaction, and telehealth supervision may feel comfortable and collegial in ways that inadvertently obscure the supervisory responsibility the supervisor retains regardless of supervisee developmental level. Supervisors should maintain clear awareness of their ongoing supervisory accountability even with highly competent supervisees, and should ensure that the transition from supervisory to consultative relationship occurs through a deliberate, documented process rather than through gradual erosion of supervisory structure.</p>
<p>Cultural humility in telehealth supervision requires supervisors to examine how their own cultural assumptions, technology access privileges, and professional socialization shape the supervisory relationship and the telehealth supervision framework they impose. A supervisor who grew up with reliable high-speed internet, who works in a private home office, and who has always had access to current technology tools has a relationship to telehealth shaped by privilege in ways that may be invisible to them but visible to supervisees who do not share that background. Cultivating cultural humility in telehealth supervision means examining these assumptions actively, seeking feedback from supervisees about the accessibility and equity of supervisory arrangements, and being willing to adapt supervisory structures that inadvertently create barriers for supervisees from underrepresented communities.</p>
<p>The documentation of supervisee telehealth competence development over the course of a supervisory relationship serves multiple functions. It fulfills Rule 135-5 documentation requirements, provides a contemporaneous record of the supervisor's assessment of supervisee readiness for independent practice, creates a professional development narrative supervisees can use to reflect on their own growth, and provides the evidence base for any remediation plan when supervisee performance does not meet expected standards. Supervisors should develop a consistent documentation structure for supervisee telehealth competency assessment that captures initial baseline, progress at regular intervals, and terminal assessment at the conclusion of the supervisory relationship. This documentation structure transforms competency evaluation from a periodic judgment event into an ongoing developmental conversation grounded in specific behavioral evidence.</p>
<p>The ethical obligation of supervisors to address impairment extends to supervisee difficulties arising from technology-related stress and telehealth-specific burnout. Research on telehealth practitioners during and after the COVID-19 pandemic identified a specific cluster of stress responses associated with prolonged video-mediated interaction, sometimes called "Zoom fatigue" or screen fatigue, characterized by increased cognitive load, reduced attention regulation, and interpersonal disconnection. Supervisees experiencing screen fatigue may show reduced quality of therapeutic presence in their telehealth sessions, may be less attentive to nonverbal cues from clients, and may seek to shorten or avoid telehealth sessions in ways that compromise clinical care. Supervisors should monitor for signs of telehealth-specific fatigue in supervisees and should address it as a clinical wellness concern rather than a performance failure, including discussion of scheduling practices, between-session recovery routines, and the appropriate use of in-person alternatives when telehealth-specific fatigue is affecting clinical quality.</p>
<h2>Managing Supervisory Relationships Across Diverse Supervisee Populations</h2>
<p>Telehealth supervision serves a supervisee population that is increasingly diverse in terms of professional background, geographic location, technology access, cultural identity, and prior experience with virtual clinical practice. Supervisors who design their telehealth supervision arrangements without attention to this diversity risk creating systems that work well for supervisees who match the supervisor's own profile and poorly for those who do not. Effective telehealth supervision requires intentional design of supervisory structures that are accessible and equitable across a range of supervisee circumstances.</p>
<p>Technology access disparities represent one of the most consequential equity dimensions of telehealth supervision. Supervisees who lack reliable broadband internet access, who use shared household devices, who work in homes without private spaces, or who have limited financial resources for technology upgrades face practical barriers to telehealth supervision that are invisible to supervisors who take high-quality technology access for granted. A supervisee who joins supervision sessions via mobile data from a shared living space, where family members may be present and the connection is unreliable, has a qualitatively different supervisory experience than one with a dedicated home office and high-speed fiber internet. Supervisors should conduct explicit technology access assessments as part of supervision orientation and should work collaboratively with supervisees to identify solutions for access barriers rather than treating technology access as a supervisee personal responsibility.</p>
<p>Language and communication considerations in telehealth supervision deserve attention that they do not always receive. Supervisees for whom English is a second language may find the attenuated communication channel of video supervision more challenging than in-person supervision, because the compressed nonverbal channel makes it harder to supplement verbal communication with the paralinguistic cues that second-language speakers often rely on more heavily than native speakers. Supervisors working with supervisees who communicate in English as a second language should be particularly deliberate about checking for understanding, inviting questions, and using written summaries of supervisory feedback to supplement verbal communication. This is not about accommodating deficiency; it is about ensuring that supervisory communication is genuinely received, which is the supervisor's professional obligation regardless of the supervisee's linguistic background.</p>
<p>Supervisory relationships with supervisees from cultural backgrounds in which hierarchical authority structures are normative require particular attention to the power dynamics that telehealth supervision can amplify. Supervisees who come from cultural contexts where deference to authority figures is expected may be less likely to raise concerns, challenge supervisory guidance, or disclose professional struggles in a telehealth supervision context where the social cues that might invite reciprocity in an in-person relationship are attenuated. Supervisors should be attentive to cultural dimensions of supervisory communication, should explicitly create space for supervisee challenge and disagreement, and should model the kind of reflective self-questioning they want supervisees to bring to their clinical practice. A supervision relationship in which the supervisee consistently agrees with every supervisory suggestion is likely not providing the developmental challenge that effective supervision requires.</p>
<p>Supervisees who are themselves racial or ethnic minorities in their clinical settings, or who serve clients whose cultural backgrounds differ significantly from their own, bring both strengths and challenges to telehealth clinical practice that merit specific supervisory attention. Research on multicultural telehealth practice (Bernard & Goodyear, 2019) suggests that cultural factors affect not only the clinical content of telehealth sessions but the technological dimension: clients from communities with historical reasons to distrust healthcare institutions may be particularly attuned to privacy and data security concerns in telehealth, and supervisees who have not thought carefully about how to address these concerns will be less effective with these clients. Supervisors should include multicultural telehealth competence as an explicit domain in supervisee competency assessment and should bring their own multicultural awareness to the supervisory relationship itself.</p>
<p>The supervision of supervisees who are themselves experiencing personal mental health challenges requires particular sensitivity in telehealth contexts. A supervisee who is managing depression, anxiety, or other mental health concerns may find the isolation of telehealth practice and telehealth supervision more challenging than in-person alternatives. The absence of the collegial human contact that in-person work settings provide can exacerbate feelings of isolation and reduce the informal social support that buffers against mental health deterioration. Supervisors should be attentive to signs of supervisee distress in telehealth supervision contexts, should maintain explicit conversations about supervisee wellness as part of the supervisory relationship, and should be prepared to connect supervisees with appropriate professional support when personal challenges appear to be affecting clinical practice. This supervisory attention to supervisee wellbeing is both an ethical obligation and a client safety measure, because supervisee mental health has a direct bearing on the quality of care supervisees provide.</p>
<h2>Cultural Humility in Telehealth Supervision: A Case-Based Exploration</h2>
<p>The principles discussed in the preceding section take concrete form in the actual supervisory encounters that telehealth supervisors navigate. The following composite clinical scenario — drawn from the typical patterns that arise in Georgia supervisory practice, with identifying details altered to protect confidentiality — illustrates how cultural humility, technology equity, and supervisory attunement intersect in real time.</p>
<div class="clinical-vignette">
  <p><em>Clinical Vignette: Dr. Martinez, a licensed supervisor in Atlanta, has been providing telehealth supervision for fourteen months to Ms. Reynolds, an associate counselor in a rural Southeast Georgia county approximately 190 miles away. Ms. Reynolds is a Black woman in her mid-thirties who returned to counseling as a second career after a decade in social services work. She serves a predominantly Black rural client population, many of whom are low-income and have limited technology access, through a community mental health agency that provides her with a basic laptop and agency-provided office space. Dr. Martinez, a white woman who has practiced in Atlanta for twenty-two years, works from a private home office with enterprise-grade broadband and a recent-model computer outfitted for telehealth supervision.</em></p>
</div>
<p><em>Over several months, Dr. Martinez has noticed that Ms. Reynolds's supervision sessions are characterized by consistent agreement with Dr. Martinez's clinical observations, minimal challenge of supervisory recommendations, and what Dr. Martinez perceives as a polite but somewhat formal distance. Ms. Reynolds's documentation is timely, her clinical work appears competent, and client outcomes are within expected ranges. Yet Dr. Martinez has a sense that the supervisory relationship has not developed the kind of depth that she believes effective supervision requires. She initiates a conversation about the supervisory relationship itself, inviting Ms. Reynolds to share her experience of their work together.</em></p>
<p><em>What emerges, through a series of supervision sessions in which Ms. Reynolds gradually becomes more candid, is a picture of supervisory experience quite different from Dr. Martinez's perception. Ms. Reynolds describes feeling that supervision sessions often run against a tight schedule that does not accommodate the longer reflective processes she values. She notes that Dr. Martinez's clinical framework, while evidence-based, assumes client access to resources and social supports that many of her rural clients do not have. She mentions, only in response to direct questioning, that the video quality on her agency-provided laptop is often poor, that her office door does not fully close, and that she has sometimes joined supervision sessions from a parked car when office privacy was not available. And she reveals, with considerable hesitation, that she had perceived Dr. Martinez's enthusiasm about telehealth delivery as insufficiently attentive to the genuine access barriers her clients face.</em></p>
<p>The case illustrates several dimensions of cultural humility that effective telehealth supervisors attend to proactively rather than reactively. Dr. Martinez's sense that the supervisory relationship lacked depth was accurate, but the causes were structural and cultural in ways that her supervisory framework had not surfaced. The technology asymmetry between Dr. Martinez's private home office with enterprise-grade broadband and Ms. Reynolds's shared agency space with poor video quality created an unspoken power differential that shaped Ms. Reynolds's willingness to disclose difficulty. The clinical framework Dr. Martinez brought to supervision, while technically competent, reflected an urban practice context that Ms. Reynolds had to continuously translate to her rural caseload, adding an invisible labor to Ms. Reynolds's work that Dr. Martinez had not recognized. And the cultural pattern of deferring to authority figures, which Ms. Reynolds had brought from her own professional socialization, interacted with the power dynamics of the supervisory relationship to produce the polite agreement that Dr. Martinez had misread as genuine concurrence.</p>
<p>The remediation Dr. Martinez undertook — lengthening supervision sessions, actively inviting challenge and disagreement, examining her clinical framework for urban assumptions, and working with Ms. Reynolds's agency to improve technology access — addressed the surface elements of the problem. More important, however, was Dr. Martinez's underlying shift in supervisory orientation, from assuming that the absence of evident difficulty meant the relationship was functioning well to actively seeking out the information that culturally humble supervision requires. Effective telehealth supervision in diverse supervisory dyads requires this active stance, not as an imposition on an otherwise adequate framework, but as the only reliable basis for supervisory relationships in which genuine professional development can occur.</p>
<p>The broader lesson extends beyond this specific dyad. Telehealth supervision magnifies whatever cultural and structural blind spots are present in the supervisor's framework, because the attenuated relational channel of video-mediated communication offers fewer opportunities for the supervisor to notice subtle cues of supervisee discomfort or disagreement. A supervisor who relies on facial expression, body language, and the informal pre- and post-session conversation to sense when something is wrong in the supervisory relationship will find those cues diminished or absent in telehealth supervision. The compensating practice is explicit, structured invitation of supervisee feedback about the relationship itself — not as a one-time orientation question, but as a recurring element of supervisory process. Cultural humility in telehealth supervision, in other words, is not only a set of beliefs about diversity but a set of communication practices that make the cultural and structural dimensions of the supervisory relationship routinely visible and discussable.</p>
<h4>Knowledge Check 3</h4>
<p><strong>When a supervisor reviews a supervisee</strong><strong>'</strong><strong>s session recording that was transmitted via email, what is the primary HIPAA compliance concern?</strong></p>
<ul>
  <li>Email is HIPAA-compliant if the supervisor uses a secure password on their device</li>
  <li><strong>Standard email is generally not HIPAA-compliant for PHI transmission, and the recording should be transmitted through a HIPAA-compliant secure system</strong></li>
  <li>HIPAA does not apply to session recordings used for supervision purposes</li>
  <li>HIPAA compliance is only required when the supervisor bills for the session</li>
</ul>
<p><strong>Correct Answer: B. </strong><em>Standard email is generally not HIPAA-compliant for PHI transmission, and the recording should be transmitted through a HIPAA-compliant secure system  |  Session recordings contain PHI regardless of their purpose. Standard email is generally not HIPAA-compliant; a secure, encrypted HIPAA-compliant file transfer method is required.</em></p>
<h4>Knowledge Check 4</h4>
<p><strong>According to the ACA Code of Ethics, what is a supervisor</strong><strong>'</strong><strong>s ethical obligation regarding technology competence in telehealth supervision?</strong></p>
<ul>
  <li>Supervisors must obtain the BC-TMH credential before providing telehealth supervision</li>
  <li><strong>Supervisors must be competent in the supervisory modalities they employ, including the technology used for telehealth supervision</strong></li>
  <li>Technology competence is a supervisee responsibility, not a supervisor ethical obligation</li>
  <li>Supervisors are exempt from technology competence requirements if they received training before 2015</li>
</ul>
<p><strong>Correct Answer: B. </strong><em>Supervisors must be competent in the supervisory modalities they employ, including the technology used for telehealth supervision  |  ACA Code F.2.a requires supervisors to be competent in the modalities they employ. For telehealth supervisors, this includes genuine technology competence sufficient to supervise effectively in the virtual environment.</em></p>`,
          accessibility: { role: "article" }
        },
        {
          type: "matching",
          title: "Developmental Stage to Supervisory Approach",
          instructions: "Match each supervisee developmental stage (Stoltenberg & McNeill IDM) to its most appropriate telehealth supervisory approach.",
          pairs: [
            { left: "Beginning supervisee (high anxiety, strong dependence on supervisor direction)", right: "Explicit structures for support, reduced ambiguity, consistent and reliable supervisory presence" },
            { left: "Mid-level supervisee (growing confidence, productive discomfort with complexity)", right: "Monitor for supervisory resistance or avoidance; maintain clear consultation expectations; periodic explicit metacommunication about the relationship" },
            { left: "Advanced supervisee (approaching independent practice readiness)", right: "Deliberate and documented transition from supervisory to consultative relationship; maintain clear awareness of ongoing supervisory accountability" },
            { left: "Supervisee from a high-power-distance cultural background", right: "Explicitly create space for challenge and disagreement; model reflective self-questioning; do not mistake deference for genuine concurrence" },
            { left: "Supervisee experiencing screen fatigue or telehealth-specific burnout", right: "Address as a clinical wellness concern rather than performance failure; discuss scheduling, recovery routines, and selective in-person alternatives" }
          ],
          accessibility: { ariaLabel: "Developmental stage matching", role: "region" }
        },
        {
          type: "flashcardDeck",
          title: "Cultural Humility in Telehealth Supervision — Core Concepts",
          cards: [
            { front: "Cultural Humility (operational definition)", back: "An active stance that requires supervisors to examine their own cultural assumptions, technology access privilege, and professional socialization as they shape the supervisory relationship — not a belief set but a set of communication practices." },
            { front: "Technology Access Asymmetry", back: "The invisible power differential created when supervisor and supervisee operate with markedly different hardware, bandwidth, and environmental privacy. Left unaddressed, it shapes what supervisees feel able to disclose." },
            { front: "High-Power-Distance Deference", back: "Cultural pattern in which supervisees from certain backgrounds defer to authority and avoid challenge. In telehealth contexts, the attenuated relational channel amplifies this pattern, producing polite agreement that supervisors may misread as concurrence." },
            { front: "Structured Invitation of Feedback", back: "The compensating practice for telehealth's diminished relational cues: supervisors explicitly and recurrently invite supervisee feedback about the supervisory relationship itself, rather than waiting to sense difficulty through nonverbal channels that video cannot transmit." },
            { front: "Multicultural Telehealth Competence", back: "Distinct competence domain including awareness that clients from historically mistrusted communities are more attuned to privacy and data-security concerns in telehealth, and that supervisees require preparation to address those concerns." },
            { front: "Screen Fatigue (Supervisory Implication)", back: "Cluster of stress responses from prolonged video-mediated interaction (reduced attention regulation, interpersonal disconnection). In supervisees, it compromises clinical presence and session quality — a clinical wellness concern, not a performance failure." }
          ],
          accessibility: { ariaLabel: "Cultural humility flashcards", role: "region" }
        },
        {
          type: "reflection",
          title: "Reflective Practice: Supervisory Relationship Review",
          prompt: "Think of one current or recent supervisee whose cultural background, technology circumstances, or developmental stage differs significantly from your own baseline. Honestly evaluate: Have you invited explicit feedback from this supervisee about the supervisory relationship within the past 90 days? If yes, what did you learn? If no, what has prevented you from doing so, and what would it take to initiate that conversation in your next scheduled supervision session?",
          minLength: 150,
          accessibility: { ariaLabel: "Supervisory relationship reflection", role: "region" }
        },
        {
          type: "multipleChoice",
          question: "A supervisor notices that a supervisee consistently agrees with all supervisory recommendations, never pushes back, and has a polite but formal tone in video sessions. What is the most likely culturally humble interpretation?",
          options: [
            "The supervisory relationship may be inhibiting genuine disagreement, and the supervisor should actively invite structured feedback about the relationship itself",
            "The supervisee is highly competent and has little need for challenge or correction",
            "The supervisee is underperforming and should be placed on a remediation plan",
            "The video format is preventing the supervisor from seeing genuine engagement that would be visible in person"
          ],
          correctAnswer: 0,
          explanation: "Consistent agreement without challenge is often a relational signal — frequently shaped by cultural patterns around authority, technology asymmetry, or the attenuated channel of video. Culturally humble supervision responds with active, structured invitation of feedback rather than accepting the surface appearance of concurrence."
        },
        {
          type: "multipleChoice",
          question: "A supervisee reports increased fatigue, reduced attention during client sessions, and difficulty connecting emotionally with clients across a predominantly telehealth caseload. The most appropriate supervisory response is:",
          options: [
            "Place the supervisee on a performance improvement plan for clinical skill deficits",
            "Recommend the supervisee increase their client caseload to maintain skill sharpness",
            "Address the pattern as a clinical wellness concern; discuss scheduling practices, recovery routines, and selective in-person alternatives",
            "Document the concern and delay action until the next formal evaluation period"
          ],
          correctAnswer: 2,
          explanation: "The pattern described is characteristic of screen fatigue / telehealth-specific burnout. Effective supervisory response addresses it as a clinical wellness concern rather than a performance failure, because supervisee wellness directly affects client care quality and is a legitimate focus of supervisory attention."
        }
      ]
    },

    // ════════════════════════════════════════════════════════
    // SECTION 5: Risk Management and Supervisory Agreements
    // ════════════════════════════════════════════════════════
    {
      title: "Risk Management and Supervisory Agreements",
      order: 5,
      contentBlocks: [
        {
          type: "sectionDivider",
          sectionNumber: 5,
          title: "Section 5",
          subtitle: "Risk Management and Supervisory Agreements",
          accessibility: { role: "heading", ariaLevel: 2 }
        },
        {
          type: "text",
          content: `<h2>Risk Management as a Supervisory Competency</h2>
<p>Risk management in supervision is not a defensive posture adopted in response to liability concerns. It is an affirmative professional responsibility that flows directly from the supervisory obligation to protect clients, support supervisees, and uphold professional standards. Supervisors who manage risk well do not merely protect themselves from disciplinary or legal exposure; they create the conditions under which supervisees can develop genuine clinical competence in a safe and well-structured learning environment. In telehealth supervision, effective risk management demands attention to domains that do not arise in in-person practice: technology failure scenarios, cybersecurity vulnerabilities, cross-jurisdictional complexity, the documentation challenges of virtual environments, and the supervisory oversight limitations that physical distance creates.</p>
<p>Research on supervisory risk in telehealth contexts (Vaccaro & Lambie, 2007; Kanz, 2001) identifies several categories of elevated risk compared to in-person supervision. Technology failures can interrupt supervision sessions at critical moments, potentially leaving supervisees without guidance during client crises. The absence of physical proximity makes it harder for supervisors to directly observe supervisee clinical behavior in authentic ways. Cross-jurisdictional practice creates regulatory complexity that supervisees may navigate incorrectly without adequate supervisory guidance. And the documentation requirements of telehealth supervision are more extensive than in-person requirements, creating greater exposure when documentation is incomplete or inaccurate.</p>
<p>Effective risk management in telehealth supervision requires a systematic approach that identifies potential failure points before they occur, develops protocols and procedures that address those failure points, communicates those protocols clearly to supervisees, tests protocols through practice and review rather than assuming supervisees have internalized them, and regularly reviews and updates protocols as circumstances evolve. This approach is not burdensome for well-organized supervisors; it is the foundation of confident, effective telehealth supervisory practice.</p>
<h2>The Telehealth Supervision Agreement: A Comprehensive Framework</h2>
<p>The supervisory agreement is the foundational document of the supervisory relationship and the primary vehicle through which supervisors communicate their expectations, policies, and protocols to supervisees. In telehealth supervision, the agreement must serve the dual function of establishing the general terms of the supervisory relationship (as required by ACA Code F.4.a and Rule 135-5) and satisfying the specific consent and disclosure requirements of Rule 135-11. A supervisory agreement that does not address telehealth-specific provisions is not merely incomplete; it potentially leaves the supervisor in violation of both the ethics code and the Georgia Board rule.</p>
<h3>Required Elements of a Rule 135-11 Compliant Supervisory Agreement</h3>
<p>The following elements should be addressed in any supervisory agreement for telehealth supervision in Georgia. Supervisors who are currently using general supervisory agreements should review each element and develop a telehealth addendum that fills any gaps, or revise the base agreement to incorporate telehealth-specific content throughout.</p>
<ul>
  <li>Supervisor and supervisee credentials and contact information, including licensure status and supervision credential (e.g., LPC-S)</li>
  <li>Clear statement that supervision will be conducted via telemental health and specification of the technology platforms to be used</li>
  <li>Statement of HIPAA compliance for all platforms used and identification of any Business Associate Agreements in place</li>
  <li>Third-party vendor disclosure identifying any vendors involved in the supervision platform and their data handling roles</li>
  <li>Verbal and written consent documentation: the agreement serves as the written consent, and the supervisee's signature acknowledges their verbal consent discussion was completed</li>
  <li>Technology failure protocol: specific procedures supervisees should follow when the primary platform fails during supervision or client sessions</li>
  <li>Emergency protocol for client crises occurring during supervised telehealth sessions: how to contact the supervisor, what to do if the supervisor is unavailable, and documentation requirements</li>
  <li>Protocols for session observation and recording review, including verification of client consent for observation and recording</li>
  <li>Asynchronous communication policy: what platforms are used for what purposes, expected response times, and which communications require documentation</li>
  <li>Social media policy: explicit statement of the boundary between professional and personal social media connections with supervisees</li>
  <li>Documentation and record retention policy for supervision records, including storage security requirements</li>
  <li>Telehealth competency evaluation framework and timeline</li>
  <li>Cross-jurisdictional practice policy: obligations when supervisees or clients are located outside Georgia</li>
  <li>Reference to Rule 135-11 and Rule 135-5 compliance obligations and statement that telehealth supervision meets all Rule 135-5 standards</li>
  <li>Supervisee right to request in-person supervision and procedures for making such a request</li>
</ul>
<div class="callout-box"><p><strong>Practice Tool</strong> Use this list as a checklist when reviewing your current supervisory agreement. Place a checkmark next to each element that is clearly addressed. Any element without a checkmark represents either a missing provision or a provision that is present but insufficiently specific for telehealth supervision. Develop targeted language to address each gap before your next supervisory intake.</p></div>
<h2>Crisis Management in the Three-Party Telehealth Supervision Context</h2>
<p>Crisis management in supervised telehealth practice is more complex than in either direct telehealth practice or in-person supervision, because it involves three parties who may be in different locations, connected through technology that can fail at any moment. The supervisor, the supervisee, and the client may each be in different cities or states, with different local emergency resources and different relationships to the technology connecting them. Supervisors must prepare supervisees to manage client crises during telehealth sessions as if the supervisor were completely unavailable, while also maintaining the supervisory oversight capacity to intervene when necessary.</p>
<p>This preparation requirement creates an important supervisory paradox: the supervisor must simultaneously empower supervisees to act independently in crises and maintain meaningful oversight of supervisee crisis management. Resolving this paradox requires thorough upfront preparation, including review of crisis protocols, scenario-based practice, clear documentation of supervisory expectations, and a supervisory relationship that is open enough that supervisees bring crisis situations to supervision promptly rather than managing them in isolation.</p>
<h3>The Three Primary Crisis Scenarios in Telehealth Supervision</h3>
<p>Three distinct crisis scenarios require specific protocols in telehealth supervision. The first is a client crisis during a supervisee's independent telehealth session, when the supervisor is not present. The supervisee must know exactly what to do: how to assess crisis severity, what de-escalation approaches to attempt, when to initiate emergency services, how and when to contact the supervisor, and how to document the crisis intervention. The supervisee should be able to execute this protocol without supervisor availability, and the supervisor's contribution to crisis management in this scenario is the upfront preparation that enables effective supervisee action.</p>
<p>The second scenario is a client crisis during a live-observed supervision session, when the supervisor is present but the client does not have a direct relationship with the supervisor. The supervisor and supervisee must have a pre-established protocol for the supervisor to provide real-time guidance without confusing the client about who is directing the intervention. This typically involves the supervisor communicating with the supervisee through a text or chat channel that the client cannot see, while the supervisee remains the primary face of the crisis intervention. Practicing this coordination before it is needed in an actual crisis is essential; improvised communication protocols in the middle of a client crisis are prone to failure.</p>
<p>The third scenario involves the supervisee as the person in crisis, including mental health emergencies, ethical crises requiring immediate supervisory intervention, or situations where the supervisee is incapacitated during a session with a client. Supervisors must have protocols that address what happens to the supervisee's clients if the supervisee becomes unable to practice, including coverage arrangements and client notification procedures. These protocols should be developed at the beginning of the supervisory relationship, not in response to an emergency.</p>
<h3>Anatomy of a Crisis: A Detailed Clinical Scenario</h3>
<p>Emergency protocols remain abstract until they are tested by an actual crisis. The following composite scenario illustrates how the telehealth supervision crisis framework operates in practice and identifies the decision points at which well-developed protocols prevent crises from escalating into professional and ethical failures.</p>
<div class="clinical-vignette">
  <p><em>Clinical Vignette: On a Tuesday evening at 7:14 p.m., Ms. Lawson, an associate counselor providing telehealth services to a client with a history of suicide attempts, is thirty-four minutes into a scheduled session when the client begins describing, in increasing detail, a plan to take their own life that night. The client has given a consistent location address in their intake documentation but has recently mentioned traveling to stay with family members whose address Ms. Lawson does not have on file. Ms. Lawson's supervisor, Dr. Thompson, is on her regular emergency consultation line, and Ms. Lawson contacts Dr. Thompson via the secure messaging system they established for supervisory emergencies.</em></p>
</div>
<p><em>Dr. Thompson receives Ms. Lawson's message within ninety seconds and responds by calling Ms. Lawson on a dedicated supervision phone. Ms. Lawson excuses herself briefly from the client session to take Dr. Thompson's call, explaining to the client that she is connecting with a consultant to ensure the best care for the client's safety. Dr. Thompson helps Ms. Lawson review the client's current information: suicidal ideation with plan, means described as accessible, timeline of that evening, and uncertain geographic location. Dr. Thompson and Ms. Lawson determine that emergency services contact is warranted but that the client's actual physical location must first be established, because emergency services in the client's home county cannot respond to an address where the client is not present.</em></p>
<p><em>Ms. Lawson returns to the session and, using the direct questioning approach the supervisory relationship has prepared her for, asks the client where they are currently physically located. The client names a town approximately sixty miles from their home address. Ms. Lawson requests the full address and receives it after some hesitation. Ms. Lawson then communicates this information to Dr. Thompson via secure message while maintaining verbal connection with the client. Dr. Thompson initiates contact with the emergency dispatch for the county where the client is currently located, providing the address, the client's name and date of birth, the nature of the crisis, and the contact information for Ms. Lawson should the dispatched officers need to communicate with her. Ms. Lawson continues to engage the client in safety-focused conversation for the thirty-seven minutes it takes emergency services to arrive, during which the client agrees to await the officers' arrival and to surrender the means of harm when they arrive.</em></p>
<p><em>The client is transported to a regional emergency department for psychiatric assessment and is admitted for crisis stabilization. The session concludes when emergency services arrive on scene. Ms. Lawson and Dr. Thompson debrief for ninety minutes that evening, document the crisis and all response actions in both the client's clinical record and the supervisory record, and coordinate follow-up steps including next-day contact with the emergency department, communication with the client's family with appropriate consent, and clinical planning for resumption of services upon discharge.</em></p>
<p>This vignette illustrates what effective telehealth supervision crisis response looks like when protocols have been developed, communicated, and practiced. Several features of the response merit attention. The supervisor was available within a timeframe that permitted real-time support — within ninety seconds of the initial message — because the supervisory agreement had established an emergency consultation line with specific response-time commitments. Ms. Lawson was able to maintain client engagement while accessing supervisory support because she had been prepared for exactly this scenario through prior discussion and role-play during supervision. The critical step of establishing actual client location was recognized as the necessary prerequisite to effective emergency services dispatch, reflecting supervisory preparation that emphasized the specific challenges telehealth creates for emergency response. Documentation was thorough, contemporaneous, and addressed both the clinical record and the supervisory record, reflecting the separate documentation obligations the three-party telehealth supervision relationship creates. And the debrief and follow-up structure prevented a successful crisis response from ending in supervisory silence, instead using the crisis as an opportunity for supervisee learning and supervisory system improvement.</p>
<p>Had any element of this preparation been missing, the outcome might have been very different. A supervisory agreement that did not specify emergency response-time expectations could have left Ms. Lawson attempting to manage the crisis alone while her supervisor was in another session or unavailable. A supervisee who had not been prepared through explicit discussion to ask directly about current physical location might have assumed the intake address was sufficient, delaying effective emergency dispatch. Documentation practices that were vague about supervisory responsibility could have left a compliance record that did not accurately represent the supervisor's involvement in the crisis response. A secure communication channel that had not been established in advance could have forced Ms. Lawson to use an insecure messaging platform in the crisis moment, creating a HIPAA exposure at the worst possible time. Each element of the response that succeeded reflected preparation that preceded the crisis, illustrating the central principle of telehealth supervision risk management: the quality of crisis response is almost entirely a function of the quality of the supervisory preparation that preceded it.</p>
<p>A final observation bears mention. The case above concludes with client stabilization and effective supervisory follow-up, but not every crisis ends this way even with excellent preparation. Supervisors and supervisees who have responded to crises that ended less favorably — in completed suicide, in serious self-injury, in client harm to others — bear a particular professional and personal burden that deserves supervisory attention in its own right. The supervisory relationship should include explicit space for processing the emotional aftermath of difficult cases, access to consultation with senior supervisors or peer supervisory groups, and, when indicated, referral for the supervisor's own counseling support. Sustainable telehealth supervisory practice requires that supervisors care for themselves as the instruments through which client care is ultimately delivered, recognizing that the cumulative weight of crisis exposure in supervisory practice is real and requires deliberate attention rather than professional stoicism.</p>
<h3>Technology Failure Protocols</h3>
<p>Every telehealth supervision arrangement must have a documented technology failure protocol that supervisees can execute without supervisor assistance, because technology failures by definition occur at unpredictable moments and may leave the supervisee unable to reach the supervisor through the primary communication channel. A technology failure during a client session that is not addressed by a clear, pre-established protocol is particularly dangerous, because the supervisee may feel unable to proceed or may improvise solutions that create liability or clinical risks.</p>
<p>An effective technology failure protocol for telehealth supervision should address the following scenarios: the video connection fails during a supervision session; the video connection fails during a supervisee's session with a client; the primary platform experiences a complete service outage; the supervisee's internet connection fails; and a technology failure occurs during a client crisis. For each scenario, the protocol should specify what steps the supervisee should take in what order, what the backup communication methods are (typically by phone), at what point the supervisee should attempt to continue the session through a backup method versus rescheduling, and how the technology failure should be documented in the clinical record.</p>
<p>Supervisors should conduct technology failure protocol drills during the orientation phase of each supervisory relationship. This does not require elaborate simulation; a verbal walk-through in which the supervisee is asked to describe what they would do in each technology failure scenario, followed by clarification and correction where needed, is sufficient to verify that supervisees have internalized the protocol. Documentation of the drill should be included in the supervisory record as evidence of protocol training.</p>`,
          accessibility: { role: "article" }
        },
        {
          type: "accordion",
          title: "Required Elements of a Rule 135-11 Compliant Supervisory Agreement",
          accordionItems: [
            {
              title: "Supervisor and Supervisee Credentials",
              content: `<p>Supervisor licensure status, supervision credential (e.g., LPC-S, CPCS), jurisdiction of licensure, and NBCC provider status if applicable. Supervisee licensure status, specific credential being pursued, and scope of authorized practice under the supervision agreement.</p>`
            },
            {
              title: "Technology Platform Specification",
              content: `<p>Specific platforms that will be used for synchronous supervision sessions, session recording review, secure messaging, and document sharing. For each platform, confirmation of HIPAA compliance and current BAA status.</p>`
            },
            {
              title: "Third-Party Vendor Disclosure",
              content: `<p>Any third-party vendors with potential access to PHI, including transcription services, cloud storage providers, EHR vendors, and AI-based documentation tools. Supervisees have the right to know which entities may process supervision-related data.</p>`
            },
            {
              title: "Emergency Protocols",
              content: `<p>Specific procedures for client crises during supervisee-independent sessions, live-observed sessions, and supervisee incapacitation scenarios. Must include supervisor availability parameters, response-time commitments, and backup contact protocols.</p>`
            },
            {
              title: "Asynchronous Communication Policy",
              content: `<p>What platforms are used for what purposes, expected response times, and which communications require documentation in the supervisory record.</p>`
            },
            {
              title: "Social Media Policy",
              content: `<p>Explicit statement of the boundary between professional and personal social media connections with supervisees during the supervisory period.</p>`
            },
            {
              title: "Cross-Jurisdictional Practice Policy",
              content: `<p>Obligations when supervisees or clients are located outside Georgia, with reference to Georgia-law governance of the supervisee's practice regardless of client location and supervisee licensure scope.</p>`
            },
            {
              title: "Supervisee Right to Request In-Person Supervision",
              content: `<p>Rule 135-11 preserves this right. The agreement must articulate it and describe the procedure for requesting such a change.</p>`
            },
            {
              title: "Documentation and Record Retention Policy",
              content: `<p>Where supervision records are stored, storage security parameters, retention period consistent with Rule 135-5, and supervisee access rights.</p>`
            },
            {
              title: "Telehealth Competency Evaluation Framework",
              content: `<p>The specific framework used to evaluate supervisee telehealth competence, evaluation intervals, and remediation pathway if performance does not meet expected standards.</p>`
            }
          ],
          accessibility: { ariaLabel: "Supervisory agreement required elements", role: "region" }
        },
        {
          type: "scenarioTree",
          title: "Crisis Response: The Uncertain-Location Client",
          description: "A supervisee contacts you 34 minutes into a telehealth session. Her client, with a history of suicide attempts, has described an imminent suicide plan for tonight. The client's intake address is in their home county, but the client mentioned recently visiting family members — the supervisee does not know the current address.",
          scenario: {
            prompt: "You receive the supervisee's emergency message. What is your immediate action?",
            choices: [
              {
                text: "Instruct the supervisee to immediately contact 911 using the client's home county address listed at intake.",
                feedback: "Dispatching emergency services to an address where the client is not physically present delays response and may prevent intervention entirely. Establishing the client's actual current location is the necessary prerequisite to effective dispatch.",
                correct: false
              },
              {
                text: "Call the supervisee on a dedicated supervision line, help her prepare to ask the client directly about current physical location, then coordinate emergency dispatch to the client's actual location once established.",
                feedback: "Correct. The critical step is establishing the client's actual physical location before emergency services are dispatched. The supervisee, with supervisor support, asks the client directly about current location; the supervisor then initiates contact with emergency dispatch for the correct county. The supervisee continues to engage the client in safety-focused conversation until emergency services arrive.",
                correct: true
              },
              {
                text: "Instruct the supervisee to end the session immediately to reduce the supervisor's vicarious liability exposure.",
                feedback: "Ending the session leaves the client in crisis without professional engagement during the critical window before emergency services arrive. Vicarious liability is not reduced by session termination in a crisis; it is likely increased, and the clinical obligation to the client continues regardless.",
                correct: false
              },
              {
                text: "Tell the supervisee to handle the crisis independently and debrief later, since supervisor intervention may confuse the client.",
                feedback: "In a crisis of this magnitude, supervisor support is appropriate and expected. The coordination approach — supervisor on a separate channel, supervisee remaining the client-facing voice — allows real-time guidance without confusing the client about who is directing the intervention.",
                correct: false
              }
            ]
          },
          accessibility: { ariaLabel: "Crisis response scenario", role: "region" }
        },
        {
          type: "reflection",
          title: "Reflective Practice: Crisis Preparedness Audit",
          prompt: "Consider your current supervisees (or a single representative supervisee). Have you walked through — verbally and in specific detail — the protocol for each of the three primary telehealth crisis scenarios: (1) client crisis during supervisee's independent session, (2) client crisis during live-observed supervision, and (3) supervisee as the person in crisis? For any scenario where the answer is no or 'not recently,' schedule a protocol review in your next supervision session and document the review in the supervisory record.",
          minLength: 150,
          accessibility: { ariaLabel: "Crisis preparedness reflection", role: "region" }
        },
        {
          type: "multipleChoice",
          question: "During a supervisee's independent telehealth session, technology fails completely — video and audio both drop. Which protocol best reflects Rule 135-11 compliant preparation?",
          options: [
            "The supervisee should wait five minutes to see if the connection restores, then end the session if it does not",
            "The supervisee should immediately contact 911 because technology failures constitute clinical emergencies",
            "Technology failure protocols are not necessary because platform outages are rare",
            "The supervisee executes a documented and rehearsed protocol with backup contact methods specific to each failure scenario"
          ],
          correctAnswer: 3,
          explanation: "Effective technology failure protocols specify backup contact methods (phone, alternative platform) and the specific action for each scenario, documented and rehearsed with the supervisee in advance. Waiting passively or treating all failures as clinical emergencies are both inappropriate."
        },
        {
          type: "multipleChoice",
          question: "A supervisor reviews her supervisory agreement annually as a matter of routine. Which of the following changes should trigger a consent amendment and supervisee re-acknowledgment, even before the annual review?",
          options: [
            "Adding a new AI-based documentation service that processes supervision session content",
            "Changing the supervisor's office location within the same building",
            "Updating the supervisor's malpractice insurance carrier",
            "Adjusting the price of supervision services"
          ],
          correctAnswer: 0,
          explanation: "Any new third-party vendor that has access to PHI creates a new data flow supervisees have a right to be informed about and consent to. Office location changes, insurance carrier changes, and price adjustments generally do not affect consent to the telehealth supervision arrangement under Rule 135-11."
        },
        {
          type: "multipleChoice",
          question: "Which of the following is essential for documenting a supervisor's response during a client crisis that occurred in a supervisee's independent telehealth session?",
          options: [
            "Documentation should appear in both the client's clinical record and the supervisory record, with contemporaneous entries addressing supervisory consultation, interventions, and follow-up",
            "Only the supervisee's clinical record needs to document the crisis; supervisory records are separate",
            "Only a brief supervisor-to-supervisee text message is needed for documentation",
            "Crisis documentation can be completed at the next scheduled supervision session"
          ],
          correctAnswer: 0,
          explanation: "The three-party nature of telehealth supervision creates separate documentation obligations. The client's clinical record documents the crisis and intervention; the supervisory record documents the supervisor's consultation, guidance, and follow-up. Both should be contemporaneous with the event."
        }
      ]
    },

    // ════════════════════════════════════════════════════════
    // SECTION 6: Cross-Jurisdictional Practice and Sustainability
    // ════════════════════════════════════════════════════════
    {
      title: "Cross-Jurisdictional Practice and Professional Sustainability",
      order: 6,
      contentBlocks: [
        {
          type: "sectionDivider",
          sectionNumber: 6,
          title: "Section 6",
          subtitle: "Cross-Jurisdictional Practice and Sustainability",
          accessibility: { role: "heading", ariaLevel: 2 }
        },
        {
          type: "text",
          content: `<h2>Cross-Jurisdictional Practice and Supervisory Risk</h2>
<p>Georgia supervisors frequently work with supervisees who serve clients located in other states, whether because the supervisee practices in a border area, serves clients who have relocated temporarily, or specifically markets telehealth services to clients in other geographic areas. Cross-jurisdictional telehealth practice is one of the most legally complex areas of telehealth compliance, and supervisors bear a meaningful responsibility for ensuring their supervisees understand and comply with applicable jurisdictional requirements.</p>
<p>The foundational principle of cross-jurisdictional telehealth practice for pre-licensed supervisees is that the supervisee's practice authority derives entirely from their Georgia supervision agreement and Georgia licensure status. The supervisee is authorized to practice by Georgia law, under Georgia supervisory oversight, and subject to Georgia regulatory requirements. The client's physical location determines which state's laws apply to the client's rights and protections, but the supervisee's conduct is governed by Georgia law regardless of where the client is located.</p>
<p>This means that a Georgia supervisee serving a client located in a state with less restrictive telehealth requirements cannot apply that state's standards to their practice. The supervisee must comply with Georgia's requirements for telehealth practice, including the client suitability assessment requirements of Rule 135-11, the informed consent requirements, and all other applicable Georgia Board standards. The more restrictive Georgia requirements apply, not the less restrictive requirements of the client's state.</p>
<p>Supervisors should ensure that supervisees who serve clients in other states have conducted a jurisdictional compliance review for each client's state. This review should address whether the supervisee is authorized to serve clients in that state under applicable interstate practice provisions, what consent and notice requirements apply in the client's state, and whether there are any state-specific reporting obligations (such as mandatory reporting laws that differ from Georgia's) that apply to the supervisee's work with that client. Documenting this jurisdictional compliance review in the supervisory record provides evidence of supervisory oversight and demonstrates good-faith compliance with cross-jurisdictional practice obligations.</p>
<h2>Supervisory Liability and Professional Insurance in Telehealth Contexts</h2>
<p>Supervisors in Georgia bear vicarious liability for the clinical decisions of their supervisees under Georgia law and under the professional ethics standards that define supervisory responsibility. This liability exists regardless of whether supervision is conducted in person or via telehealth, but the telehealth context introduces specific liability risks that supervisors should understand and address through their professional liability insurance coverage.</p>
<p>Professional liability policies for mental health professionals vary significantly in how they address telehealth and supervision. Some policies explicitly cover telehealth supervision activities; others have exclusions or limitations for telehealth practice that may affect coverage for supervisory liability arising from telehealth supervision. Supervisors should review their professional liability policy specifically for telehealth and supervision coverage before providing telehealth supervision, and should consult with their insurance broker if the policy language is ambiguous.</p>
<p>The documentation quality of telehealth supervision records has a direct bearing on liability defense in the event of a complaint or lawsuit. Supervisors who maintain thorough, contemporaneous supervision records demonstrating that they fulfilled their supervisory obligation, provided appropriate guidance, and took reasonable action in response to concerns about supervisee performance are in a much stronger position to defend against complaints than supervisors whose records are incomplete or retrospective. Documentation should be treated as a professional protection, not as an administrative burden.</p>
<h2>Sustainability and Professional Development for Telehealth Supervisors</h2>
<p>Telehealth supervision imposes distinctive professional demands that, if unmanaged, contribute to burnout, compassion fatigue, and the erosion of supervisory effectiveness. The always-available quality of digital communication, the cognitive load of monitoring supervisee competence and client safety across multiple technological platforms, the complexity of regulatory compliance in an evolving environment, and the relational demands of maintaining meaningful supervisory alliances through attenuated virtual channels all extract a professional cost that supervisors must actively manage.</p>
<p>The research literature on supervisory burnout (Johnson & Kaslow, 2014) identifies several factors that protect against burnout in supervisors: access to regular consultation about their own supervisory practice, clear role boundaries that prevent supervision from expanding to fill all available time, a sense of professional community with other supervisors, and commitment to ongoing professional development. In telehealth supervision contexts, each of these protective factors requires intentional cultivation because the isolation of virtual work can undermine them.</p>
<h3>Supervision of Supervision</h3>
<p>The concept of supervision of supervision, sometimes called consultative supervision, refers to the practice of seeking regular consultation with a peer or mentor specifically about one's supervisory practice. This is distinct from clinical case consultation, which addresses the supervisee's clients; supervision of supervision addresses the supervisory relationship itself, the supervisor's reactions and responses to supervisees, and the professional development challenges the supervisor is navigating in their supervisory work.</p>
<p>Supervision of supervision is rare in the professional community despite being widely recommended in the supervisory literature. Supervisors who have spent years in the role may feel that seeking consultation about their supervisory practice implies inadequacy or uncertainty that is inappropriate for someone in a position of supervisory authority. This perception is a barrier to professional development and a risk factor for supervisory burnout. Effective supervision of supervision is not remediation for supervisory failure; it is a professional excellence practice that supports reflective, effective supervisory work throughout a career.</p>
<p>In telehealth supervision contexts, supervision of supervision is particularly valuable because the relative novelty of telehealth supervision as a widespread practice means that even experienced supervisors are navigating challenges for which the professional literature and peer community provide limited guidance. Connecting with a peer group of telehealth supervisors, participating in supervision-of-supervision consultations, and engaging in continuing education specifically focused on supervisory practice are all professional development investments that pay dividends in supervisory effectiveness.</p>
<h3>Setting Boundaries in Digital Supervision Environments</h3>
<p>The availability of digital communication tools creates pressure for supervisors to be available to supervisees at all times. A supervisee who texts a supervisor on a Saturday evening with a clinical question, or who emails a supervisor at midnight before a difficult session the following morning, is not necessarily being inappropriate; they are responding to the accessibility that digital tools create. But supervisors who respond to every contact in real time, regardless of hour or context, are eroding the professional boundaries that protect both the supervisory relationship and their own wellbeing.</p>
<p>Supervisors should establish clear communication policies that specify what communication channels are used for what purposes, what constitutes a clinical emergency requiring immediate response versus a matter that can wait until the next scheduled session, what hours the supervisor is available for supervisory communications, and how supervisees should handle situations that arise outside those hours. These policies should be included in the supervisory agreement and communicated to supervisees during orientation. The supervisor who maintains clear, consistent communication boundaries is modeling the kind of professional self-care they should be teaching supervisees.</p>
<p>Finally, supervisors should attend to their own professional development as telehealth practitioners and supervisors with the same commitment they bring to supervising their supervisees' development. The telehealth supervision landscape is evolving rapidly, with new research, new regulatory guidance, and new technology tools emerging continuously. Supervisors who engage in ongoing professional development, maintain active connections with the supervision professional community, and approach their own development with curiosity and openness are better equipped to guide supervisees through an equally complex and evolving professional environment.</p>
<h2>Documentation Standards for Telehealth Supervision</h2>
<p>The documentation of telehealth supervision sessions requires attention to elements that do not arise in in-person supervision documentation. Every telehealth supervision session note should include the date, duration, and telehealth modality used; the names of all participants; the clinical cases or content discussed; supervisory interventions and guidance provided; any concerns about supervisee performance or client safety that arose and how they were addressed; and notation of any technology difficulties that affected the session and how they were managed. This documentation structure creates a contemporaneous record demonstrating compliance with Rule 135-5 requirements and providing evidence of supervisory diligence in the event of a complaint or investigation.</p>
<p>Supervisors who provide group telehealth supervision must address additional documentation considerations. Group supervision notes should identify all participants, document the specific cases or content addressed by each supervisee, and note the group process dynamics that affected the supervisory interaction. When a supervisee presents a case in group supervision that raises significant clinical or ethical concerns, the supervisor should supplement the group note with an individual note documenting the specific concern, the supervisory response, and the follow-up plan. This creates a clear record that the concern was identified and addressed, which is essential for both compliance and liability purposes.</p>
<p>Telehealth supervision records are subject to the same retention requirements as other professional records under Georgia Board rules and applicable law. Supervisors should verify the retention period applicable to their credential and maintain telehealth supervision records accordingly. Records that include identifiable client information must be maintained in HIPAA-compliant systems with appropriate access controls. Supervisors should not maintain supervision records on personal devices or consumer-grade cloud storage without verifying that those systems meet applicable security requirements. The security requirements for supervisory records are not merely bureaucratic; they reflect the genuine sensitivity of the information supervisory records contain, including client PHI, supervisee performance assessments, and documentation of clinical errors and their remediation.</p>
<p>The intersection of telehealth supervision documentation and professional liability defense deserves specific attention. Supervisors who are named in licensing board complaints arising from supervisee conduct have a strong interest in demonstrating through their records that they fulfilled their supervisory obligation: they provided adequate oversight, identified and addressed performance concerns, maintained appropriate documentation, and exercised reasonable professional judgment in their supervisory decisions. Documentation that is thorough, contemporaneous, and specific, rather than vague, retrospective, or primarily formulaic, is far more persuasive as evidence of supervisory diligence. Supervisors who maintain documentation primarily as a compliance exercise, recording only what is required, rather than as a genuine record of supervisory activity, may find that their records provide inadequate protection in the event of a serious complaint.</p>
<h2>Insurance, Billing, and Business Considerations for Telehealth Supervision</h2>
<p>The business infrastructure supporting telehealth supervision involves considerations that supervisors do not always address systematically. Professional liability insurance coverage for telehealth supervision activities varies significantly across policies and carriers. Some policies explicitly include coverage for supervisory liability arising from telehealth supervision; others have exclusions or limitations for telehealth practice that may apply to supervisory contexts. Supervisors should review their professional liability policy specifically for telehealth supervision coverage and should consult with their insurance broker if the policy language is ambiguous. This review should occur before accepting the first telehealth supervisee, not after a complaint has been filed.</p>
<p>The question of whether and how to bill for telehealth supervision services involves both practical and ethical dimensions. Some supervisors, particularly those in group practice or institutional settings, bill for supervision through the institution's billing systems. Independent supervisors may charge supervisees directly. The billing arrangements should be explicitly addressed in the supervisory agreement, including the fee structure, billing cycle, and policies for missed or cancelled supervision sessions. Supervisors should ensure that their billing practices for telehealth supervision are consistent with applicable insurance and regulatory requirements and should not create financial incentives that could compromise the objectivity of supervisory evaluation.</p>
<p>The administrative infrastructure of telehealth supervision extends beyond billing to include record storage systems, communication platforms, scheduling tools, and the physical workspace from which supervision is conducted. Supervisors who provide telehealth supervision from home offices should ensure that their physical workspace meets the privacy standards they require of supervisees: a private space where supervision sessions cannot be overheard, appropriate security for any physical documents related to supervisory cases, and a technology setup that is reliable and professional. The supervisor who expects supervisees to maintain private, professional telehealth workspaces while conducting their own supervision sessions from a kitchen table with household activity audible in the background is modeling a standard they do not themselves meet.</p>
<h2>Looking Forward: The Future of Telehealth Supervision in Georgia</h2>
<p>The telehealth supervision landscape in Georgia and nationally is continuing to evolve in ways that will create new compliance requirements, new clinical challenges, and new professional development opportunities for supervisors. Several trends are likely to shape this evolution in the coming years and deserve supervisors' attention as they plan their professional development and supervisory infrastructure.</p>
<p>Regulatory evolution is ongoing at both the state and federal levels. Georgia's Composite Board, like other state licensing boards, regularly reviews and updates its rules in response to changes in clinical practice, technology, and professional standards. Supervisors should monitor Georgia Board rule updates through the Board's website and through professional association communications. Significant rule changes affecting telehealth supervision, such as updates to the training hour requirements or the consent provisions of Rule 135-11, may require supervisors to update their supervisory agreements, obtain additional training, or modify their supervision practices.</p>
<p>The expansion of interstate practice through the Counseling Compact will continue to create both opportunities and complexities for Georgia telehealth supervisors. As more states join the Compact and as interstate telehealth practice becomes more common, supervisors will increasingly be asked to supervise practices that involve multi-state client populations and complex jurisdictional considerations. Supervisors who develop expertise in interstate telehealth compliance will be better positioned to support their supervisees through this complexity and may find that this expertise is a meaningful professional differentiator.</p>
<p>The integration of technology-assisted tools into clinical practice and supervision will continue to accelerate, bringing both benefits and risks that supervisors must be prepared to address. Artificial intelligence tools for session documentation, clinical decision support, and outcome monitoring are already being adopted in some telehealth practices, and their use will likely expand significantly in the coming years. Supervisors who engage proactively with these developments, who seek professional education about the ethical and regulatory implications of AI-assisted clinical tools, and who develop informed supervisory frameworks for evaluating supervisee use of emerging technologies will be better equipped to fulfill their supervisory obligations in an increasingly technology-mediated practice environment.</p>
<p>The professional development infrastructure for telehealth supervisors is itself developing, with more specialized training programs, credentialing pathways, and peer communities emerging as telehealth supervision matures as a practice specialty. Supervisors who invest in this development, who pursue advanced training beyond the minimum required hours, who engage with the telehealth supervision professional community, and who contribute their own expertise to the development of better supervisory practices are not merely meeting their own professional development obligations. They are contributing to the development of a professional field that will benefit the supervisees and clients they serve for years to come.</p>
<h4>Knowledge Check 5</h4>
<p><strong>A supervisee</strong><strong>'</strong><strong>s client experiences a suicidal crisis during a telehealth session. The supervisee attempts to contact the supervisor but cannot reach them. What aspect of the supervisor</strong><strong>'</strong><strong>s risk management practice is most relevant to this situation?</strong></p>
<ul>
  <li>The supervisor should have been available by phone at all times during supervisee sessions</li>
  <li><strong>The supervisor fulfills their risk management obligation through thorough upfront preparation: developing, communicating, and rehearsing a crisis protocol that the supervisee can execute independently</strong></li>
  <li>The supervisor bears no responsibility for crises that occur when they are unavailable</li>
  <li>The supervisee should terminate the session immediately any time a supervisor cannot be reached</li>
</ul>
<p><strong>Correct Answer: B. </strong><em>The supervisor fulfills their risk management obligation through thorough upfront preparation: developing, communicating, and rehearsing a crisis protocol that the supervisee can execute independently  |  Supervisors cannot be available at all times. Their risk management obligation is fulfilled by ensuring supervisees have a documented, rehearsed crisis protocol they can execute independently, developed through thorough upfront preparation.</em></p>
<h4>Knowledge Check 6</h4>
<p><strong>Which of the following best describes the supervisory liability principle in Georgia regarding telehealth supervision?</strong></p>
<ul>
  <li>Supervisors are not liable for supervisee actions in telehealth contexts because the supervisor is not physically present</li>
  <li><strong>Supervisors bear vicarious liability for supervisee clinical decisions regardless of whether supervision is conducted in person or via telehealth</strong></li>
  <li>Supervisory liability is eliminated when supervisees sign a consent form acknowledging independent responsibility</li>
  <li>Supervisors are liable only for supervisee actions that occur during scheduled supervision sessions</li>
</ul>
<p><strong>Correct Answer: B. </strong><em>Supervisors bear vicarious liability for supervisee clinical decisions regardless of whether supervision is conducted in person or via telehealth  |  Vicarious supervisory liability applies to supervisee clinical decisions under Georgia law and professional ethics standards regardless of the supervision modality.</em></p>`,
          accessibility: { role: "article" }
        },
        {
          type: "cardSort",
          title: "Jurisdictional Scenarios: Permitted or Prohibited?",
          instructions: "Sort each practice scenario based on applicable Georgia law and licensure scope.",
          categories: ["Permitted", "Prohibited or Requires Additional Authorization"],
          items: [
            { text: "A Georgia-licensed LPC, eligible under the Counseling Compact, serves an established client who has temporarily relocated to a Compact member state for three months", category: "Permitted" },
            { text: "A Georgia-licensed pre-licensed supervisee provides telehealth services to a client who has moved to Florida, based on the supervisor's assurance that the Compact applies", category: "Prohibited or Requires Additional Authorization" },
            { text: "A supervisor in Atlanta provides telehealth supervision to a supervisee who is physically located in South Carolina while the supervisee serves Georgia clients", category: "Permitted" },
            { text: "A supervisee who is a Georgia resident provides telehealth services to clients located in a non-Compact state, relying on the client-location-governs-law argument", category: "Prohibited or Requires Additional Authorization" },
            { text: "A supervisor charges a supervision fee that has increased 20% since the original supervisory agreement, without amending the agreement", category: "Prohibited or Requires Additional Authorization" },
            { text: "A supervisor maintains separate HIPAA-compliant channels for synchronous supervision, session recording review, and written feedback", category: "Permitted" }
          ],
          accessibility: { ariaLabel: "Jurisdictional sorting activity", role: "region" }
        },
        {
          type: "matching",
          title: "Documentation Element to Purpose",
          instructions: "Match each supervisory documentation element to its primary professional purpose.",
          pairs: [
            { left: "Contemporaneous session notes with date, duration, format, cases discussed, and supervisory interventions", right: "Satisfies Rule 135-5 documentation requirement and supports vicarious liability defense" },
            { left: "Written training log with provider, date, hours, and content category for all telehealth CE", right: "Supports audit response to Rule 135-11 training-currency inquiries" },
            { left: "Annual review of supervisory agreement against current platforms, vendors, and protocols", right: "Maintains consent currency and identifies amendment triggers" },
            { left: "Emergency protocol walk-through documentation at supervisee intake and after significant changes", right: "Demonstrates operational readiness of protocols, not merely paper existence" },
            { left: "Structured telehealth competency evaluation at baseline, interval, and termination of supervisory relationship", right: "Creates the evidence base for supervisee independent-practice readiness determinations" }
          ],
          accessibility: { ariaLabel: "Documentation matching", role: "region" }
        },
        {
          type: "reflection",
          title: "Reflective Practice: Your Sustainability Plan",
          prompt: "The final section emphasizes that telehealth supervisory practice carries cumulative weight — crisis exposure, relational labor, technology-mediated fatigue — that requires deliberate attention. Describe two specific sustainability practices you will commit to over the next 90 days: one that addresses your own wellness (e.g., supervision-of-supervision, peer consultation group, referral for counseling support when needed), and one that addresses the structural conditions of your supervisory work (e.g., caseload limits, between-session recovery routines, scheduled administrative time).",
          minLength: 150,
          accessibility: { ariaLabel: "Sustainability reflection", role: "region" }
        },
        {
          type: "multipleChoice",
          question: "A Georgia-licensed pre-licensed supervisee continues providing telehealth services to an established client who relocates to Florida. Which statement accurately describes the regulatory status?",
          options: [
            "The Counseling Compact extends to pre-licensed supervisees as long as their supervisor is Compact-eligible",
            "The supervisee may continue services without regulatory concern because the client relationship was established before relocation",
            "Interstate practice is permissible so long as the supervisor assumes full liability",
            "Pre-licensed supervisees practice under Georgia licensure regardless of client location; the Compact does not extend to them"
          ],
          correctAnswer: 3,
          explanation: "The Counseling Compact applies to licensed counselors only. Pre-licensed supervisees practice under Georgia law and Georgia supervisory authorization regardless of client physical location, and the supervisee's authorization does not extend to out-of-state practice."
        },
        {
          type: "multipleChoice",
          question: "Which statement best describes a supervisor's malpractice insurance consideration for telehealth supervision?",
          options: [
            "Supervisors should verify that their policy specifically addresses telehealth supervision, including cross-jurisdictional scenarios and supervisee vicarious liability",
            "Standard professional liability policies automatically cover telehealth supervision across all jurisdictions",
            "Malpractice insurance is optional for supervisors practicing exclusively within Georgia",
            "Supervisors are covered under their supervisees' individual malpractice policies during the supervisory period"
          ],
          correctAnswer: 0,
          explanation: "Policies vary considerably in their treatment of telehealth supervision and cross-jurisdictional practice. Supervisors should explicitly verify coverage for their specific practice arrangement and document that verification in their professional records."
        },
        {
          type: "multipleChoice",
          question: "A supervisor's preferred sustainability practice is 'supervision of supervision' with a senior peer. Which description most accurately captures the ethical and practical function of this practice?",
          options: [
            "It is a required element of Rule 135-11 compliance for all telehealth supervisors",
            "It is primarily a networking activity without substantive impact on supervisory quality",
            "It transfers vicarious liability from the primary supervisor to the senior peer",
            "It provides a structured consultation forum for the supervisor's own supervisory cases, supporting both professional development and risk management"
          ],
          correctAnswer: 3,
          explanation: "Supervision of supervision (or peer supervisory consultation) is not a Rule 135-11 requirement but represents best practice for sustainable supervisory careers. It creates space for the supervisor to think through challenging cases with senior perspective, supports ongoing development, and functions as a risk management layer — without altering the primary supervisor's liability."
        }
      ]
    },

    // ════════════════════════════════════════════════════════
    // SECTION 7: CONCLUSION
    // ════════════════════════════════════════════════════════
    {
      title: "Conclusion: The Supervisor as Standard-Bearer",
      order: 7,
      contentBlocks: [
        {
          type: "sectionDivider",
          sectionNumber: 7,
          title: "Conclusion",
          subtitle: "The Supervisor as Standard-Bearer",
          accessibility: { role: "heading", ariaLevel: 2 }
        },
        {
          type: "text",
          content: `<p>The obligations Rule 135-11 places on supervisors are substantial, but they reflect a recognition that supervision is not merely an administrative function. It is the primary mechanism through which the counseling profession perpetuates its values, maintains its standards, and protects the clients it exists to serve. When you provide telehealth supervision in compliance with Georgia law and in accordance with the ethical frameworks of the counseling profession, you are not simply checking boxes. You are demonstrating that professional accountability extends to the virtual environment, that client protection does not diminish with physical distance, and that the supervisory relationship is robust enough to serve its developmental and gatekeeping functions regardless of the medium through which it is conducted.</p>
<p>Telehealth supervision done well is a high-value professional activity. It expands access to supervision for supervisees in underserved areas, enables supervisors to support a wider range of supervisees across a broader geographic territory, and creates opportunities for innovative supervisory formats including group telehealth supervision, integrated in-person and virtual arrangements, and supervision structures that leverage technology to enhance rather than merely replicate in-person practice. The regulatory framework Rule 135-11 provides is not an obstacle to these possibilities. It is the foundation that makes them trustworthy and professionally sound.</p>
<p>The most common barrier to excellent telehealth supervision is not regulatory complexity or technological challenge, though both are real. It is the tendency to treat the virtual environment as a lesser version of in-person supervision that requires less intentional investment, less careful relationship-building, and less systematic attention to the specific competency demands of the virtual context. Every element of this course has been designed to counter that tendency by providing specific, actionable frameworks for telehealth supervisory excellence that go beyond minimum compliance to genuine professional mastery.</p>
<p>Excellent telehealth supervisors share several characteristics that distinguish them from supervisors who merely comply with the minimum requirements. They invest in their own telehealth competence continuously, treating the nine-hour training requirement as a floor rather than a ceiling. They build supervisory relationships that are warm, honest, and developmentally responsive despite the attenuated communication channel of the virtual environment. They maintain supervisory documentation that genuinely reflects the supervisory work they have done rather than merely satisfying regulatory requirements. They seek consultation about their own supervisory practice from peers who challenge and support them. And they approach the ethical complexities of telehealth supervision with the same curiosity and rigor they bring to the most challenging clinical work.</p>
<p>Georgia's regulatory framework for telehealth supervision is among the most rigorous in the nation, and that rigor serves the profession and the public well. Supervisors who understand and embrace these requirements are not constrained by them; they are empowered by them to provide supervision that clients can trust and that supervisees can genuinely learn from. The nine hours Rule 135-11 requires of telehealth supervisors are not a burden. They are an investment in the professional infrastructure that makes excellent telehealth supervision possible.</p>
<p>As you complete this course and return to your supervisory practice, we encourage you to conduct an honest audit of your current telehealth supervision arrangements against the compliance framework presented in these three sections. Use the supervisory agreement checklist and competency evaluation framework as working documents, not one-time exercises. Seek supervision of supervision from peers who share your commitment to telehealth supervisory excellence. And approach the continuing evolution of telehealth technology, regulation, and clinical practice with the same openness and curiosity you bring to your own clinical development.</p>
<p>You entered the supervision role because you believed in the importance of investing in the next generation of the profession. That commitment, exercised through rigorous, compassionate, and compliant telehealth supervision, is among the most meaningful professional contributions you will make in your career. The supervisees you develop today will carry the professional values you model into practices and communities you will never directly touch, extending your influence far beyond the immediate supervisory relationship. That is the work of supervision at its best, and it is what this course has been designed to support.</p>
<p>The cumulative picture that emerges from this course is of a supervisory practice that is neither more burdensome nor less rewarding than traditional in-person supervision, but is genuinely different in the competencies it requires and the attention it demands. Supervisors who approach telehealth supervision as a simple extension of in-person practice will find themselves out of step with the regulatory framework Georgia has established and with the evolving ethical expectations of the profession. Supervisors who treat telehealth supervision as its own distinct modality — requiring specific training, specific consent structures, specific crisis protocols, and specific relational attunement — position themselves to provide supervision that is both compliant and effective. The regulatory framework of Rule 135-11, the ethical commitments of the ACA, NASW, and AAMFT codes, and the practical demands of contemporary clinical practice all converge on the same underlying requirement: that supervisors take seriously the specific features of telehealth practice and develop the specific competencies those features require.</p>
<p>The three sections of this course address complementary dimensions of telehealth supervisory competence that work together as an integrated practice framework. Section 1 established the legal and regulatory foundation: the specific provisions of Rule 135-11 that apply to supervisors, the training requirements, the consent obligations, and the compliance audit processes that ensure ongoing adherence to Georgia law. Section 2 explored the ethical dimensions: the confidentiality challenges of three-party telehealth interactions, the technology competence obligations of supervisors, the boundary management demands of virtual professional relationships, and the developmental considerations that shape effective supervisory practice across diverse supervisee populations. Section 3 translated these foundations into operational risk management: the supervisory agreement as a compliance and consent document, crisis management protocols for the three primary emergency scenarios in telehealth supervision, cross-jurisdictional practice complexities, and the sustainability practices that enable supervisors to maintain excellent telehealth supervision over the course of a career.</p>
<p>Integrating these three dimensions into a coherent supervisory practice framework requires supervisors to recognize that compliance, ethics, and risk management are not separate domains requiring separate attention. They are different perspectives on the same supervisory reality. A supervisor who approaches telehealth supervision with genuine ethical commitment to supervisee development and client protection will naturally be drawn to compliance as the expression of that commitment in regulatory form. A supervisor who maintains thorough compliance documentation and robust risk management systems will find that these practices support, rather than constrain, the relational quality of the supervisory relationship by providing the structure within which developmental work can safely occur.</p>
<p>The practical integration of these dimensions begins with the supervisory agreement and the consent process. A comprehensive telehealth supervisory agreement that addresses all the elements discussed in this course is simultaneously a compliance document (satisfying the written consent requirement of Rule 135-11), an ethical instrument (ensuring informed supervisee consent and transparent communication about the supervisory relationship), and a risk management tool (documenting protocols and expectations that protect supervisees, clients, and supervisors). The care with which supervisors develop and review supervisory agreements reflects the depth of their commitment to all three dimensions of telehealth supervisory competence.</p>
<p>Ongoing integration of compliance, ethics, and risk management occurs through the regular practice of supervision itself: maintaining thorough session documentation, conducting periodic compliance audits, engaging in supervision of supervision, reviewing and updating protocols as circumstances change, and approaching supervisory challenges with the same reflective inquiry that supervisors model for their supervisees. Supervisors who approach their telehealth supervisory practice as an ongoing developmental enterprise, rather than a set of requirements to be met once and then maintained, will find that the three dimensions of competence this course addresses become increasingly integrated over time into a coherent professional identity as a telehealth supervisor.</p>
<p>The evaluation of telehealth supervisory competence, both for initial credentialing and for ongoing professional development, is an emerging area in which the profession is still developing consistent standards and instruments. Supervisors who are committed to their own development as telehealth supervisors should proactively seek evaluation of their supervisory practice through peer consultation, participation in telehealth supervision training programs that include practicum or observation components, and engagement with the professional literature on telehealth supervision effectiveness. The field is young enough that supervisors who invest in their own development now, while the professional standards are still being established, have an opportunity to contribute to the development of those standards through their own exemplary practice.</p>`,
          accessibility: { role: "article" }
        },
        {
          type: "accordion",
          title: "Key Takeaways from the Three Sections",
          accordionItems: [
            {
              title: "Regulatory Foundation (Sections 1–2)",
              content: `<p>Rule 135-11 imposes a 9-hour training requirement on telehealth supervisors (6 general + 3 supervisor-specific), operating on a rolling 5-year window. Dual verbal and written consent is required, with both components documented. Rule 135-5 standards apply fully to telehealth supervision — synchronous hours cannot be replaced by asynchronous review. Compliance is an ongoing practice, not a one-time achievement; platform changes, vendor additions, and rolling training-currency all require active monitoring.</p>`
            },
            {
              title: "Ethical Practice (Sections 3–4)",
              content: `<p>Technology competence, confidentiality in three-party contexts, and boundary management in virtual environments are ethical obligations, not technical conveniences. Cultural humility in telehealth supervision requires active, structured invitation of supervisee feedback — the attenuated video channel cannot substitute for explicit relational practices. Developmental stage and cultural background shape the supervisory relationship in ways that virtual environments amplify, not diminish.</p>`
            },
            {
              title: "Risk Management and Sustainability (Sections 5–6)",
              content: `<p>The supervisory agreement is simultaneously a compliance document, an ethical instrument, and a risk management tool. Crisis response quality is almost entirely a function of preparation quality. Cross-jurisdictional complexity requires explicit attention to Counseling Compact boundaries and the governance of pre-licensed supervisee practice. Sustainable telehealth supervision requires supervisors to care for themselves as the instruments of client care — through peer consultation, realistic caseload limits, and recognition of crisis exposure as a real professional burden.</p>`
            }
          ],
          accessibility: { ariaLabel: "Key takeaways accordion", role: "region" }
        },
        {
          type: "reflection",
          title: "Ethical Practice Plan: Your Next 90 Days",
          prompt: "Draft a concrete 90-day ethical practice plan for your telehealth supervision work. Your plan should include: (1) one Rule 135-11 compliance action (e.g., training log creation, agreement revision, consent renegotiation); (2) one ethical practice strengthening action (e.g., explicit feedback-invitation protocol, HIPAA platform audit, social media policy articulation); (3) one risk management action (e.g., crisis protocol walk-through with each supervisee, supervisory agreement annual review); and (4) one sustainability action (e.g., peer consultation group, caseload limit reaffirmation). For each item, specify the completion target date and the verification mechanism.",
          minLength: 200,
          accessibility: { ariaLabel: "Ethical practice plan", role: "region" }
        },
        {
          type: "resources",
          title: "Continuing Education and Professional Development Resources",
          content: `<h3>Continuing Education and Professional Development Resources</h3>
<p>Supervisors committed to ongoing telehealth supervisory development should consider the following resources and pathways:</p>
<ul>
<li><strong>Board Certified-TeleMental Health (BC-TMH) credential</strong> from the Center for Credentialing and Education (CCE/NBCC) — a professional excellence credential providing structured telehealth competency development.</li>
<li><strong>ACES Guidelines for Online Learning and Technology in Counselor Education and Supervision (2019)</strong> — the most current professional consensus document specifically addressing telehealth supervision.</li>
<li><strong>Georgia Composite Board Rule 135-11 and Rule 135-5</strong> — official rule text available through the Georgia Secretary of State; supervisors should review periodically for amendments.</li>
<li><strong>NBCC ACEP-approved telehealth supervision courses</strong> — including those offered through GAITP LLC (CounselorReady, NBCC ACEP #7760).</li>
<li><strong>Peer consultation and supervision-of-supervision</strong> — through state associations (Licensed Professional Counselors Association of Georgia, Georgia Society for Clinical Social Work, Georgia Association for Marriage and Family Therapy) and peer supervisory consultation groups.</li>
<li><strong>Published professional literature</strong> — including the journals <em>Counselor Education and Supervision</em>, <em>The Clinical Supervisor</em>, <em>Professional Psychology: Research and Practice</em>, and the <em>Journal of Telemedicine and Telecare</em>.</li>
</ul>`,
          accessibility: { role: "complementary", ariaLabel: "Additional resources" }
        }
      ]
    }

  ],

  // ═══════════════════════════════════════════════════════════
  // ASSESSMENT (Top-Level, Final Exam) — 15 questions
  // ═══════════════════════════════════════════════════════════
  assessment: {
    passingScore: 80,
    maxAttempts: 3,
    shuffleQuestions: true,
    showExplanations: true,
    questions: [
      {
        question: "Under Georgia Rule 135-11, how many total hours of telehealth training are required for a supervisor providing telehealth supervision?",
        type: "multiple_choice",
        options: ["3 hours", "6 hours", "9 hours", "12 hours"],
        correctAnswer: 2,
        explanation: "Rule 135-11 requires 9 total hours: 6 hours of general telehealth training required of all practitioners, plus 3 additional hours of supervisor-specific telehealth training, all within the 5 years preceding supervision."
      },
      {
        question: "What type of consent must Georgia supervisors obtain from supervisees before conducting supervision via telemental health?",
        type: "multiple_choice",
        options: [
          "Written consent only",
          "Verbal consent only",
          "Both verbal and written consent, both documented",
          "No formal consent is required for supervisory relationships"
        ],
        correctAnswer: 2,
        explanation: "Rule 135-11 requires both verbal AND written consent, with both components documented in the supervisee's record. Neither substitutes for the other."
      },
      {
        question: "Which Georgia Board rule specifies that supervision conducted via telehealth must meet all standards of the applicable supervisory specialty?",
        type: "multiple_choice",
        options: [
          "Board Rule 135-3",
          "Board Rule 135-5, as referenced in Rule 135-11",
          "Board Rule 135-7",
          "Board Rule 135-9"
        ],
        correctAnswer: 1,
        explanation: "Rule 135-11 explicitly integrates Rule 135-5 supervision standards, meaning telehealth supervision must meet all the same synchronous hour, documentation, and qualification requirements as in-person supervision."
      },
      {
        question: "Under HIPAA, which statement is TRUE regarding session recordings reviewed for supervision purposes?",
        type: "multiple_choice",
        options: [
            "Session recordings are exempt from HIPAA when used for supervision",
            "HIPAA applies only to records created by the treating clinician, not to supervisory records",
            "Only recordings that include the client's face are subject to HIPAA requirements",
            "Session recordings contain PHI and must be transmitted and stored using HIPAA-compliant methods with an appropriate BAA"
          ],
        correctAnswer: 3,
        explanation: "Session recordings contain PHI regardless of the purpose for which they are reviewed. HIPAA Security Rule requirements apply to transmission and storage, and any third-party platform handling recordings must have a current BAA."
      },
      {
        question: "Which of the following best describes the BC-TMH credential?",
        type: "multiple_choice",
        options: [
          "A Georgia Board required credential for all telehealth supervisors",
          "A federal certification required for HIPAA compliance in mental health settings",
          "A professional excellence credential from CCE/NBCC providing a framework for telehealth competency",
          "A billing credential enabling supervisors to invoice for telehealth supervision services"
        ],
        correctAnswer: 2,
        explanation: "BC-TMH (Board Certified-TeleMental Health) is a voluntary professional credential from CCE/NBCC. It is not Georgia-Board-required and does not in itself satisfy Rule 135-11 supervisor-specific training unless the documentation identifies supervisory content."
      },
      {
        question: "A supervisor who has completed only six hours of general telehealth training begins providing telehealth supervision in Georgia. Which statement accurately describes this situation?",
        type: "multiple_choice",
        options: [
          "The supervisor is in full compliance with Rule 135-11",
          "The supervisor is in partial compliance; only the supervisor-specific training hours are missing",
          "The supervisor is in violation of Rule 135-11, which requires nine total hours for supervisors",
          "The supervisor is in compliance if their supervisees have each completed their own six hours of general telehealth training"
        ],
        correctAnswer: 2,
        explanation: "Rule 135-11 requires 9 total training hours for supervisors. Completion of only the general 6 hours, without the additional 3 supervisor-specific hours, places the supervisor in violation."
      },
      {
        question: "Which of the following should be included in a telehealth supervision agreement under Georgia Rule 135-11?",
        type: "multiple_choice",
        options: [
          "Only supervisor and supervisee contact information and session frequency",
          "Technology platforms, third-party vendors, emergency protocols, communication policies, and supervisee consent documentation",
          "A copy of the supervisor's malpractice insurance policy and the supervisee's graduate transcripts",
          "The supervisor's personal availability schedule and preferred communication style"
        ],
        correctAnswer: 1,
        explanation: "Rule 135-11 requires supervisory agreements to address the specific elements that make telehealth supervision identifiable and informed: platforms, vendors, emergency protocols, communication policies, and documented consent."
      },
      {
        question: "What is the supervisor's primary obligation regarding client confidentiality when reviewing a supervisee's session recording?",
        type: "multiple_choice",
        options: [
          "Supervisors have no client confidentiality obligation for recordings they did not create",
          "Supervisors must verify client consent for recording and ensure recordings are transmitted and stored using HIPAA-compliant methods",
          "Client confidentiality obligations end once the supervisee authorizes the supervisor to review the recording",
          "Session recordings may be freely shared within a practice group without additional client consent"
        ],
        correctAnswer: 1,
        explanation: "Supervisors share the client confidentiality obligation with supervisees when reviewing session recordings. This includes verifying appropriate client consent and using HIPAA-compliant transmission and storage for all PHI."
      },
      {
        question: "Which population does the Counseling Compact multistate practice privilege apply to?",
        type: "multiple_choice",
        options: [
          "All counselors licensed in compact member states, including pre-licensed supervisees",
          "Licensed counselors only; pre-licensed supervisees practice under their supervision agreement and state licensure regardless of client location",
          "Board Certified Counselors with specific compact credentials",
          "Counselors who have completed a compact-specific CE requirement within the past two years"
        ],
        correctAnswer: 1,
        explanation: "The Counseling Compact applies to licensed counselors. Pre-licensed supervisees practice under Georgia licensure and their supervisory agreement, regardless of client physical location."
      },
      {
        question: "According to the ACA Code of Ethics F.3.a, which of the following represents a potential multiple relationship concern in telehealth supervision?",
        type: "multiple_choice",
        options: [
          "A supervisor who uses the same video platform for supervision sessions and for direct client telehealth services",
          "A supervisee who connects with the supervisor on a professional networking platform such as LinkedIn",
          "A supervisor and supervisee who follow each other on personal social media platforms, creating mutual access to personal lifestyle information",
          "A supervisor who occasionally supervises a former classmate who is completing pre-licensed hours"
        ],
        correctAnswer: 2,
        explanation: "Personal social media connections create mutual access to personal lifestyle information that alters the power dynamics and evaluative clarity of the supervisory relationship — a multiple-relationship concern under ACA F.3.a that is amplified by virtual environments."
      },
      {
        question: "What is the recommended approach when a supervisor cannot be reached during a supervisee's client crisis?",
        type: "multiple_choice",
        options: [
          "The supervisee should wait until the supervisor is available before taking any clinical action",
          "The supervisee executes the documented crisis protocol developed and rehearsed with the supervisor in advance",
          "The supervisee should terminate the session and reschedule once the supervisor is available",
          "The supervisory relationship should be evaluated for continuation if the supervisor is unavailable during a crisis"
        ],
        correctAnswer: 1,
        explanation: "The foundational principle of telehealth supervision crisis preparedness is that supervisees must be able to execute crisis protocols independently if the supervisor is unreachable. This requires documented, rehearsed protocols established at intake."
      },
      {
        question: "Which of the following is essential for an effective technology failure protocol in telehealth supervision?",
        type: "multiple_choice",
        options: [
          "The supervisor must be on call by phone at all times when supervisees conduct telehealth sessions",
          "Backup contact methods and specific procedures for each failure scenario, documented and rehearsed with supervisees before any failures occur",
          "Technology failures automatically constitute clinical emergencies requiring supervisees to call 911",
          "Supervisors are not responsible for technology failures that occur during independent supervisee sessions"
        ],
        correctAnswer: 1,
        explanation: "Effective technology failure protocols specify backup contact methods and scenario-specific procedures, documented and rehearsed in advance. Protocols that exist only on paper are unlikely to be executed effectively under pressure."
      },
      {
        question: "What documentation practice best supports regulatory compliance when the verbal consent component of supervisee telehealth consent is completed?",
        type: "multiple_choice",
        options: [
          "No documentation is required for verbal consent; only the written consent form is documented",
          "The date, content, and supervisee acknowledgment of the verbal consent discussion must be documented in the supervisory record",
          "Verbal consent may substitute for written consent if the supervisee declines to sign the agreement",
          "Documentation of verbal consent is optional unless the supervisee specifically requests it"
        ],
        correctAnswer: 1,
        explanation: "Rule 135-11 requires documentation of both consent components. The verbal consent discussion should be recorded with date, content summary, and supervisee acknowledgment — the signed form alone does not demonstrate compliance."
      },
      {
        question: "Asynchronous supervision methods, such as reviewing session recordings and providing written feedback, satisfy which supervisory requirement under Georgia Board rules?",
        type: "multiple_choice",
        options: [
          "They satisfy the synchronous supervision hour requirements under Rule 135-5",
          "They satisfy the Rule 135-11 consent documentation requirement",
          "They may supplement synchronous supervision but cannot replace the synchronous supervision hours required by Rule 135-5",
          "They satisfy all supervisory requirements for supervisees who prefer asynchronous feedback formats"
        ],
        correctAnswer: 2,
        explanation: "Rule 135-5 requires synchronous (real-time audio-visual) supervision hours. Asynchronous methods add value but cannot replace these hours regardless of the quality of feedback provided."
      },
      {
        question: "What best describes the supervisory liability principle regarding telehealth supervision in Georgia?",
        type: "multiple_choice",
        options: [
          "Supervisors are not liable for supervisee actions in telehealth because they are not physically present during sessions",
          "Supervisors bear vicarious liability for supervisee clinical decisions regardless of whether supervision is conducted in person or via telehealth",
          "Supervisory liability is eliminated when supervisees complete the six-hour general telehealth training requirement",
          "Supervisors are liable only for supervisee actions that occur during scheduled live-observed supervision sessions"
        ],
        correctAnswer: 1,
        explanation: "Vicarious liability is a foundational principle of supervision and is not altered by the modality of supervisory oversight. Supervisors bear responsibility for supervisee clinical decisions whether supervision is delivered in person or via telehealth."
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════
  // REFERENCES (APA 7th Edition)
  // ═══════════════════════════════════════════════════════════
  references: [
    { author: "American Counseling Association", year: 2014, title: "ACA code of ethics", source: "American Counseling Association." },
    { author: "American Association for Marriage and Family Therapy", year: 2015, title: "AAMFT code of ethics", source: "AAMFT." },
    { author: "Association for Counselor Education and Supervision", year: 2011, title: "Best practices in clinical supervision", source: "ACES." },
    { author: "Association for Counselor Education and Supervision", year: 2019, title: "ACES guidelines for online learning and technology in counselor education and supervision", source: "ACES." },
    { author: "Bernard, J. M., & Goodyear, R. K.", year: 2019, title: "Fundamentals of clinical supervision (6th ed.)", source: "Pearson." },
    { author: "Center for Credentialing and Education", year: 2023, title: "Board Certified-TeleMental Health Provider (BC-TMH) credential overview", source: "CCE Global." },
    { author: "Counseling Compact", year: 2022, title: "Counseling Compact — Georgia enactment", source: "The Counseling Compact Commission." },
    { author: "Georgia Composite Board of Professional Counselors, Social Workers, and Marriage and Family Therapists", year: 2015, title: "Rule 135-11: Standards for the delivery of services by telemental health", source: "Georgia Secretary of State." },
    { author: "Georgia Composite Board of Professional Counselors, Social Workers, and Marriage and Family Therapists", year: 2023, title: "Rule 135-5: Supervision standards", source: "Georgia Secretary of State." },
    { author: "Georgia Composite Board of Professional Counselors, Social Workers, and Marriage and Family Therapists", year: 2023, title: "Rule 135-7: Code of ethics", source: "Georgia Secretary of State." },
    { author: "Health Insurance Portability and Accountability Act of 1996", year: 1996, title: "HIPAA, Pub. L. No. 104-191, 110 Stat. 1936", source: "U.S. Government." },
    { author: "Inman, A. G., Soheilian, S. S., & Luu, L. P.", year: 2019, title: "Telesupervision: Ripe with opportunities and challenges", source: "Journal of Clinical Psychology, 75(2), 292-301." },
    { author: "Johnson, W. B., & Kaslow, N. J. (Eds.)", year: 2014, title: "The Oxford handbook of education and training in professional psychology", source: "Oxford University Press." },
    { author: "Kanz, J. E.", year: 2001, title: "Clinical-supervision.com: Issues in the provision of online supervision", source: "Professional Psychology: Research and Practice, 32(4), 415-420." },
    { author: "National Association of Social Workers", year: 2021, title: "NASW code of ethics", source: "NASW." },
    { author: "National Board for Certified Counselors", year: 2023, title: "NBCC policy regarding the provision of distance professional services", source: "NBCC." },
    { author: "Rousmaniere, T., & Renfro-Michel, E. (Eds.)", year: 2016, title: "Using technology to enhance clinical supervision", source: "American Counseling Association." },
    { author: "Stoltenberg, C. D., & McNeill, B. W.", year: 2009, title: "IDM supervision: An integrative developmental model for supervising counselors and therapists (3rd ed.)", source: "Routledge." },
    { author: "U.S. Department of Health and Human Services", year: 2022, title: "HIPAA security rule guidance material", source: "HHS." },
    { author: "Vaccaro, N., & Lambie, G. W.", year: 2007, title: "Computer-based counselor-in-training supervision: Ethical and practical implications for counselor educators and supervisors", source: "Counselor Education and Supervision, 47(1), 46-59." }
  ]
};

// ═══════════════════════════════════════════════════════════
// SCHEMA (minimal — relies on existing InteractiveCourse model)
// ═══════════════════════════════════════════════════════════
const interactiveCourseSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const InteractiveCourse = mongoose.models.InteractiveCourse ||
  mongoose.model('InteractiveCourse', interactiveCourseSchema, 'interactivecourses');

// ═══════════════════════════════════════════════════════════
// DEPLOYMENT
// ═══════════════════════════════════════════════════════════
async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Check for existing course by courseCode
    const existing = await InteractiveCourse.findOne({ courseCode: 'CR-TMH602' });

    if (existing) {
      console.log(`⚠ Course CR-TMH602 already exists (id: ${existing._id}). Updating...`);
      Object.assign(existing, COURSE_DATA);
      await existing.save();
      console.log('✓ CR-TMH602 updated successfully');
    } else {
      const doc = new InteractiveCourse(COURSE_DATA);
      await doc.save();
      console.log(`✓ CR-TMH602 created successfully (id: ${doc._id})`);
    }

    // Quick audit
    const saved = await InteractiveCourse.findOne({ courseCode: 'CR-TMH602' });
    const totalWords = JSON.stringify(saved.sections).split(/\s+/).length;
    console.log('\n─── AUDIT ──────────────────────────');
    console.log(`  Course Code: ${saved.courseCode}`);
    console.log(`  Title: ${saved.title}`);
    console.log(`  CE Hours: ${saved.ceHours}`);
    console.log(`  Sections: ${saved.sections.length} (target: 7 = 6 content + 1 conclusion)`);
    console.log(`  Content Blocks: ${saved.sections.reduce((acc, s) => acc + s.contentBlocks.length, 0)}`);
    console.log(`  Assessment Qs: ${saved.assessment.questions.length} (min: 15)`);
    console.log(`  References: ${saved.references.length} (min: 15)`);
    console.log(`  Est. Word Count (sections): ~${totalWords.toLocaleString()}`);
    console.log(`  ACEP Min (6,000 × 3 = 18,000): ${totalWords >= 18000 ? '✓ PASS' : '✗ FAIL'}`);
    console.log('────────────────────────────────────\n');

    await mongoose.disconnect();
    console.log('✓ Disconnected cleanly');
    process.exit(0);
  } catch (err) {
    console.error('✗ SEED FAILED:', err);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
}

seed();
