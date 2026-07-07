/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */

/**
 * seedCR-AI-107 — Data Privacy, HIPAA, and AI Tools in Behavioral Health (2 CE)
 * Technology & Ethics module · GAITP LLC · NBCC ACEP #7760
 *
 * UPSERT by slug; no deletes. Ships STATUS: DRAFT (isPublished:false).
 * Validate without DB:  DRY_RUN=1 node src/scripts/seedCR-AI-107-Data_Privacy_HIPAA_and_AI_Tools-12038words.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Course as InteractiveCourse } from '../models/InteractiveCourse.js';
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI && !process.env.DRY_RUN) { console.error('MONGODB_URI not set'); process.exit(1); }
const SLUG = 'data-privacy-hipaa-and-ai-tools-in-behavioral-health';

const COURSE = {
  title: 'Data Privacy, HIPAA, and AI Tools in Behavioral Health',
  slug: SLUG,
  courseCode: 'CR-AI-107',
  subtitle: 'Protecting Client Information When Clinical Data Meets Artificial Intelligence',
  description: 'A 2-CE intermediate course for licensed behavioral health professionals on protecting client information when artificial intelligence tools enter the clinical workflow. Covers HIPAA Privacy and Security Rule fundamentals, the consumer-app regulatory gap, business associate agreements and vendor vetting, de-identification, state privacy laws including 42 CFR Part 2 and California CMIA, and breach response — grounded in HHS, FTC, ONC, and NIST guidance. Approximately 12,000 counted words.',

  ceHours: 2, ceuHours: 2, credits: 2, ceuEligible: true,
  category: 'Technology & Ethics', ceCategory: 'Technology & Ethics', contentArea: 'Professional Identity',
  level: 'Intermediate', deliveryMethod: 'Asynchronous Online',
  approvingBody: 'NBCC', approvalNumber: '7760', acepNumber: '7760',
  provider: { name: 'GA Integrated Therapeutic Perspectives LLC', shortName: 'GAITP LLC', acepNumber: '7760', approvalBody: 'NBCC' },
  approvals: [{ body: 'NBCC', providerNumber: '7760', providerName: 'GA Integrated Therapeutic Perspectives LLC', status: 'approved', hourBreakdown: [{ label: 'core', hours: 2 }], deliveryFormat: 'asynchronous' }],
  nbccContentAreas: ['Professional Identity'],
  presenter: { name: 'Kejuiana Johnson', credentials: 'MA, LPC, NCC, CPCS, BC-TMH', degree: 'MA', licenseNumber: 'LPC009587', licenseState: 'Georgia', qualificationStatement: 'Kejuiana Johnson, MA, LPC, NCC, CPCS, BC-TMH, is a licensed professional counselor and approved clinical supervisor in Georgia with expertise in privacy, HIPAA compliance, and telebehavioral health.' },
  instructor: 'GA Integrated Therapeutic Perspectives LLC',
  author: 'Kejuiana Johnson, MA, LPC, NCC, CPCS, BC-TMH',
  accessType: 'subscription', price: 39.99, pricingTier: 'standard',
  status: 'draft', isPublished: false, isActive: true,
  attestationRequired: true, certificateEnabled: true,
  passingScore: 80, maxAttempts: 3,
  settings: { passingScore: 80, certificateEnabled: true, requireEvaluation: true, requireAttestation: true },
  targetAudience: ['Licensed mental health professionals (LPCs, LCSWs, LMFTs, NCCs, psychologists) and practice owners responsible for protecting client data when using AI tools.'],
  tags: ['HIPAA', 'data privacy', 'security', 'compliance', 'artificial intelligence'],

  objectives: [
    'Define protected health information (PHI) under the HIPAA Privacy Rule and identify which AI tools and workflows constitute a regulated use or disclosure of PHI.',
    'Differentiate covered entities and business associates from consumer wellness and AI applications that fall outside HIPAA, and explain the FTC Health Breach Notification Rule that governs many of them.',
    'Evaluate an AI vendor for behavioral health use by analyzing its business associate agreement, data-retention and model-training practices, sub-processors, and security controls.',
    'Apply de-identification standards (Safe Harbor and Expert Determination), the minimum-necessary standard, and informed consent to reduce privacy risk when using AI tools.',
    'Construct an incident-response and breach-notification plan that satisfies HIPAA, the FTC, and applicable state laws including 42 CFR Part 2 and the California Confidentiality of Medical Information Act.',
  ],

  sections: [
    // ════════════════════════════════════════════════════════════════════
    // SECTION 1 — HIPAA, PHI, and the AI Context
    // ════════════════════════════════════════════════════════════════════
    {
      title: 'HIPAA, PHI, and the AI Context',
      order: 1,
      contentBlocks: [
        { type: 'sectionDivider', order: 1, sectionNumber: '1', title: 'HIPAA, PHI, and the AI Context', subtitle: 'Why feeding client information to an AI tool is a regulated act, not a private convenience' },

        { type: 'text', order: 2, content: `<h2>The New Decision Point</h2>
<p>A clinician finishes a difficult intake session, opens a generative AI chatbot, and types: "Help me write a treatment plan for a 29-year-old woman with panic disorder and a recent miscarriage who works as a paramedic in Savannah." The plan that comes back is genuinely useful. The clinician copies it into the chart, closes the tab, and moves on. In the span of those ninety seconds, a regulated disclosure of protected health information occurred — to a third-party company, across the public internet, into a system whose data-retention and model-training practices the clinician has never read. Whether that disclosure was lawful depends entirely on facts the clinician did not pause to consider.</p>
<p>This is the central problem of artificial intelligence in behavioral health. The tools are extraordinary, and they arrive frictionlessly: a browser tab, an app store download, a feature quietly added to software you already use. There is no moment where a compliance officer hands you a form. The decision point — "am I about to disclose protected health information to an outside party?" — is invisible precisely because the action feels private. You are alone at your keyboard. But the Health Insurance Portability and Accountability Act does not care whether a disclosure feels private. It cares whether protected health information left your control and entered someone else's, and whether you had the legal authority to send it there.</p>
<p>The purpose of this course is to make that invisible decision point visible, and to give you a repeatable way to reason through it before you act rather than after. We will not tell you to avoid AI tools — many are legitimately useful and can be used compliantly. We will teach you to recognize when client information is about to cross a regulatory boundary, and what must be true for that crossing to be lawful, ethical, and safe.</p>
<h3>What HIPAA Actually Regulates</h3>
<p>HIPAA is built from two rules that clinicians must hold together. The Privacy Rule (45 CFR Part 164, Subpart E) governs who may use and disclose protected health information and under what conditions. The Security Rule (45 CFR Part 164, Subparts A and C) governs how electronic protected health information must be safeguarded — the administrative, physical, and technical controls that keep it from leaking. A third rule, the Breach Notification Rule, governs what you must do when those safeguards fail. AI tools implicate all three at once: using one is a Privacy Rule disclosure question, the tool's architecture is a Security Rule question, and a vendor's data leak is a Breach Notification Rule question.</p>
<p>The Privacy Rule's foundational concept is protected health information, or PHI. PHI is individually identifiable health information — information that relates to a person's physical or mental health, the provision of health care, or payment for it, and that identifies the person or could reasonably be used to identify them — held or transmitted by a covered entity or its business associate, in any form. Behavioral health clinicians often underestimate how broad this is. The diagnosis is PHI. So is the appointment time, the fact that someone is a client at all, the content of a session, a voicemail, a billing record, and a photograph. When that information lives in electronic form — in your EHR, your email, your AI prompt — it is electronic protected health information (ePHI), and the Security Rule attaches to it.</p>
<p>Crucially, PHI does not stop being PHI when you paste it into an AI prompt. The regulated status travels with the information. A prompt that says "my client, a transgender teen whose parents don't know they're in therapy, is having suicidal thoughts" is a disclosure of some of the most sensitive PHI imaginable, sent to whatever company operates the chatbot. The fact that you did not type the client's legal name does not make it de-identified, as Section 4 will show in detail. The regulatory boundary was crossed the moment identifiable health information left your system.</p>
<h3>Why Behavioral Health Carries Heightened Stakes</h3>
<p>Every health record is sensitive, but behavioral health records occupy a special category of vulnerability, and this raises the stakes of every AI decision a mental health clinician makes. A leaked orthopedic record reveals a broken ankle; a leaked therapy record can reveal a suicide attempt, a history of abuse, an undisclosed sexual orientation, a substance use disorder, or a diagnosis that a client has hidden from family, employers, and insurers for decades. The harm from exposure is not merely embarrassment. It can mean the loss of a job, the loss of custody in a contested divorce, the collapse of a marriage, denial of insurance, immigration consequences, or, in the most tragic cases, the deepening of the very crisis that brought the client to treatment. Clients disclose to us precisely because they believe the room is sealed. When an AI tool quietly carries those disclosures out of the room, it is not a technical footnote — it is a rupture of the foundational promise of psychotherapy.</p>
<p>This is also why behavioral health information is disproportionately targeted and disproportionately regulated. Federal law singles out substance use disorder records for extra protection under 42 CFR Part 2; many state laws impose special consent requirements for mental health and psychotherapy records; and professional ethics codes treat confidentiality as nearly absolute, breached only for narrow, defined reasons. The clinician who reaches for an AI tool is operating inside this dense web of heightened protections, often without realizing it. A workflow that might be merely risky in a primary-care setting can be a serious violation in a behavioral health setting, because the data is more sensitive and the legal protections are more numerous. The discipline this course builds is, in part, a habit of remembering that what feels routine to you is, to the client, among the most private facts of their life.</p>
<p>Consider, too, that the asymmetry of harm runs entirely against the client. When a clinician makes a careless AI disclosure, the immediate consequences for the clinician — a possible board complaint, a possible fine — are real but bounded and, in most cases, recoverable. The consequences for the client can be neither bounded nor recoverable. A client cannot un-disclose that they once contemplated suicide, cannot retract from a data broker the inference that they are in addiction recovery, cannot restore the marriage or the custody arrangement or the job that the exposure cost them. This asymmetry is the moral weight behind every safeguard in this course. We are not protecting data for the sake of regulatory tidiness; we are protecting people who handed us their secrets in a moment of trust and who bear the full cost when that trust is broken through our convenience. Holding that asymmetry in mind transforms privacy practice from a compliance chore into an extension of clinical care.</p>` },

        { type: 'text', order: 3, content: `<h2>Covered Entities, Business Associates, and the Chain of Trust</h2>
<p>HIPAA does not regulate everyone who touches health information. It regulates a defined set of actors and the contractors who work for them. Understanding exactly where you sit in this structure — and where an AI vendor sits — is the prerequisite for every compliance judgment that follows. Get this structural question wrong and every downstream decision inherits the error; get it right and the rest of the analysis falls into place.</p>
<p>A <strong>covered entity</strong> is a health plan, a health care clearinghouse, or a health care provider who transmits health information electronically in connection with certain standard transactions, such as submitting insurance claims. Nearly every billing behavioral health practice is a covered entity. If you bill insurance, accept payment electronically, or transmit claims, you are almost certainly a covered entity, and HIPAA applies to you directly and fully. Even cash-only practices frequently become covered entities through electronic transactions they don't think about. As a covered entity, you are legally responsible not only for your own conduct but for ensuring that the contractors you hand PHI to are bound to protect it.</p>
<p>A <strong>business associate</strong> is a person or organization that performs functions or services on behalf of a covered entity that involve the use or disclosure of PHI. Your EHR vendor is a business associate. Your billing service is a business associate. Your telehealth platform is a business associate. And — this is the pivotal point for AI — <em>an AI vendor that processes your clients' PHI on your behalf is a business associate.</em> When an AI tool sits in your clinical workflow handling identifiable client information, it is not a neutral utility like a calculator; it is a business associate, and it may only lawfully receive PHI if you have a Business Associate Agreement (BAA) in place with it. Section 3 examines BAAs in depth.</p>
<p>This creates what compliance professionals call the chain of trust. The covered entity is responsible for the PHI. It may share PHI with a business associate only under a contract obligating that associate to safeguard it. The business associate, in turn, may use subcontractors (sub-processors) only if they too are bound by agreements flowing the same protections downstream. When you feed PHI to an AI tool, you are extending your chain of trust to that tool, to the cloud infrastructure it runs on, and to every sub-processor it relies on. If any link in that chain is unbound — no BAA, no downstream agreement — the chain is broken, and the disclosure was unauthorized.</p>
<h3>Why "It's Just a Tool I Use" Is the Wrong Frame</h3>
<p>Clinicians often resist the business-associate framing because the AI tool doesn't feel like a vendor relationship. It feels like a personal productivity aid, no different from using a spell-checker or a search engine. But HIPAA draws the line not at how the tool feels to you but at what the tool does with the information. A spell-checker that runs locally on your device and transmits nothing is not a disclosure. A cloud AI service that receives your client's clinical narrative, processes it on remote servers, may log it, may retain it, and may use it to improve its models is unambiguously receiving and using PHI on your behalf. The casual interface conceals an enterprise data flow.</p>
<p>The corollary is liberating as well as cautionary: if a tool genuinely never receives identifiable health information — because you de-identified the input, or because the tool runs entirely on your own hardware with no external transmission — then HIPAA's disclosure rules are not triggered in the same way, because no PHI was disclosed. This is why de-identification and on-device processing are such powerful risk-reduction strategies, and why the question "where does the data go?" is the first question to ask of any AI tool. The rest of this course is, in large part, an elaboration of that single question.</p>
<h3>Three Workflows, Three Risk Levels</h3>
<p>It helps to see how the same broad activity — "using AI" — spans radically different risk levels depending on what data flows and where. Consider three workflows a behavioral health clinician might adopt. In the first, the clinician uses a general-purpose chatbot's free consumer tier to summarize a session, pasting in the client's clinical narrative including identifiers. This is a disclosure of PHI to an outside company with no BAA, on a tier that may retain inputs and use them for model training. It is the highest-risk workflow imaginable and almost certainly an unauthorized disclosure. In the second, the clinician uses an enterprise AI service that has signed a BAA, promises not to train on inputs, and offers a defined retention policy, to draft documentation from session content. This is a permitted disclosure to a business associate under contract — lawful if the clinician has verified the vendor's practices and applies minimum necessary. In the third, the clinician uses any AI tool to draft a generic psychoeducation handout on anxiety, entering no client information at all. No PHI is disclosed, so the disclosure rules do not attach; this workflow is low-risk regardless of the tool.</p>
<p>The lesson of these three workflows is that "Is AI safe to use?" is the wrong question, because it has no single answer. The right questions are narrower and answerable: What data am I about to send? Where does it go? Is that destination bound to protect it? The same clinician, the same brand of tool, and the same broad task can land in any of the three risk tiers depending solely on those answers. Mastering AI privacy is mastering the discipline of placing each specific action into the correct tier before performing it — and of pulling high-risk actions down into lower tiers by de-identifying inputs, choosing BAA-backed tools, or sending no PHI at all.</p>` },

        { type: 'imageText', order: 4, title: 'The Chain of Trust', content: `<p>Picture PHI as a sealed package. The covered entity owns it. Every party who receives it must sign for it (a BAA) and promise to keep it sealed. A business associate may hand it to a sub-processor only if that party also signs. An AI vendor with no signature in the chain is an unauthorized recipient — and the package was opened the moment you sent the prompt. The clinician at the top of the chain remains accountable for every link below.</p>`, image: '', imageAlt: 'Diagram showing a covered entity passing protected health information down a chain of signed agreements to business associates and sub-processors', imagePosition: 'right' },

        { type: 'accordion', order: 5, title: 'Key Definitions at a Glance', accordionItems: [
          { title: 'Protected Health Information (PHI)', content: 'Individually identifiable health information relating to a person\'s physical or mental health, the provision of care, or payment for care, held or transmitted by a covered entity or business associate in any form — paper, oral, or electronic. In behavioral health, the mere fact that someone is a client is PHI.' },
          { title: 'Electronic PHI (ePHI)', content: 'PHI that is created, received, maintained, or transmitted in electronic form. ePHI is what the HIPAA Security Rule protects. A clinical narrative typed into an AI chatbot is ePHI in transit and, often, ePHI at rest on the vendor\'s servers.' },
          { title: 'Covered Entity', content: 'A health plan, clearinghouse, or health care provider who transmits health information electronically for standard transactions (e.g., insurance claims). Most billing behavioral health practices are covered entities directly subject to HIPAA.' },
          { title: 'Business Associate', content: 'A person or organization performing a function or service on behalf of a covered entity that involves PHI. An AI vendor processing client PHI on your behalf is a business associate and requires a Business Associate Agreement before it may lawfully receive PHI.' },
          { title: 'Use vs. Disclosure', content: 'A "use" is the sharing or handling of PHI within the entity that holds it. A "disclosure" is the release of PHI to an outside party. Sending PHI to an external AI service is a disclosure — the highest-scrutiny category.' },
        ]},

        { type: 'callout', order: 6, calloutType: 'key', title: 'The First Question', content: 'Before any AI tool touches client information, ask: "Where does this data go, and is that destination bound to protect it?" If the answer is an outside company with no Business Associate Agreement, you are about to make an unauthorized disclosure of PHI.' },

        { type: 'videoEmbed', order: 7, videoTitle: 'HIPAA Fundamentals: Privacy and Security Rules in Plain Language', videoUrl: 'https://www.youtube.com/embed/PLACEHOLDER_hipaa', description: 'An orientation to the Privacy Rule, the Security Rule, and the definition of protected health information, framed for clinicians encountering new technology in practice.' },

        { type: 'multipleChoice', order: 8,
          question: 'A clinician pastes a client\'s clinical narrative — without the legal name but including age, profession, city, and diagnosis — into a public generative AI chatbot. Under HIPAA, what has occurred?',
          options: [
            { text: 'Nothing regulated, because the legal name was omitted', isCorrect: false },
            { text: 'A disclosure of PHI to an outside party, because the information remains individually identifiable', isCorrect: true },
            { text: 'A permitted internal use, because the clinician owns the record', isCorrect: false },
            { text: 'A de-identification event that removes the information from HIPAA', isCorrect: false },
          ],
          correctAnswer: 1,
          explanation: 'Omitting the legal name does not de-identify information that still contains identifying details such as age, profession, and a specific city combined with a diagnosis. Sending it to an outside AI company is a disclosure of PHI, which requires a lawful basis — typically a Business Associate Agreement or valid authorization.' },

        { type: 'multiSelect', order: 9,
          question: 'Which of the following count as protected health information (PHI) in a behavioral health context? (Select all that apply)',
          options: [
            { text: 'The fact that a named person is a client at your practice', isCorrect: true },
            { text: 'A client\'s appointment date and time', isCorrect: true },
            { text: 'A fully de-identified aggregate statistic with no path to any individual', isCorrect: false },
            { text: 'A voicemail confirming a client\'s session', isCorrect: true },
            { text: 'A client\'s diagnosis entered into your EHR', isCorrect: true },
          ],
          explanation: 'In behavioral health, even the existence of the treatment relationship is PHI, as are appointment details, voicemails, and diagnoses. Only genuinely de-identified information with no reasonable path back to an individual falls outside PHI.' },

        { type: 'flashcardDeck', order: 10, instructions: 'Review these core HIPAA-and-AI concepts. Tap each card to reveal the answer.', flashcards: [
          { id: 'f1', front: 'Does PHI lose its protected status when pasted into an AI prompt?', back: 'No. The regulated status travels with the information. Identifiable health information sent to an AI tool is still a disclosure of PHI, regardless of the interface used.' },
          { id: 'f2', front: 'What makes an AI vendor a "business associate"?', back: 'Performing a function or service that involves using or disclosing PHI on behalf of a covered entity. An AI tool that processes client PHI in your workflow is a business associate requiring a BAA.' },
          { id: 'f3', front: 'Which HIPAA rule governs how ePHI must be safeguarded?', back: 'The Security Rule (45 CFR Part 164, Subparts A and C), which requires administrative, physical, and technical safeguards for electronic PHI.' },
          { id: 'f4', front: 'What is the single most important first question to ask of any AI tool?', back: '"Where does the data go, and is that destination contractually bound to protect it?" If PHI leaves your control to an unbound party, the disclosure is unauthorized.' },
          { id: 'f5', front: 'Why is the casual AI interface a compliance trap?', back: 'It conceals an enterprise data flow. A friendly chat box may transmit, log, retain, and train on PHI — the same as any cloud vendor — but feels as private as a notepad.' },
        ]},

        { type: 'reflection', order: 11, question: 'Think of the last time you used any AI tool — a chatbot, a transcription service, a note-drafting assistant. Did any client information, even partial or "disguised," enter it? At that moment, did you know where that data went, or had you simply assumed it was private?' },

        { type: 'keyTakeaway', order: 12, title: 'Key Takeaways', takeaways: [
          'HIPAA regulates the use and disclosure of protected health information regardless of how private the action feels; an AI prompt containing client information is a disclosure to an outside party.',
          'PHI in behavioral health is broad — it includes the very existence of the treatment relationship, appointment details, voicemails, and diagnoses, in any form.',
          'An AI vendor that processes client PHI on your behalf is a business associate and may only lawfully receive PHI under a Business Associate Agreement.',
          'The clinician at the top of the chain of trust remains accountable for every downstream link, including the AI vendor and its sub-processors.',
          'The first question for any AI tool is "where does the data go?" — de-identification and on-device processing reduce risk precisely by changing that answer.',
        ]},
      ],
    },

    // ════════════════════════════════════════════════════════════════════
    // SECTION 2 — The Consumer-App Gap
    // ════════════════════════════════════════════════════════════════════
    {
      title: 'The Consumer-App Gap',
      order: 2,
      contentBlocks: [
        { type: 'sectionDivider', order: 1, sectionNumber: '2', title: 'The Consumer-App Gap', subtitle: 'Why most mental-health and AI apps are not covered by HIPAA, and what the FTC regulates instead' },

        { type: 'text', order: 2, content: `<h2>The Coverage Gap Most Clinicians Miss</h2>
<p>There is a widespread and dangerous assumption among clinicians and clients alike: that any app dealing with mental health, mood, or wellness must be governed by HIPAA. It is intuitive — health information feels like it should carry health-information protections. But HIPAA's reach is defined by <em>who holds the information</em>, not by how sensitive the information is. HIPAA applies to covered entities and their business associates. A direct-to-consumer wellness app, mood tracker, meditation tool, journaling app, or AI "therapy" chatbot that a person downloads and uses on their own — with no covered entity in the relationship — is generally <strong>not</strong> a HIPAA-covered entity and generally <strong>not</strong> a business associate. It sits in the consumer-app gap, outside HIPAA entirely.</p>
<p>This is not a loophole so much as a structural feature of the law. HIPAA was written in 1996 to regulate the flow of health information among insurers, clearinghouses, and providers. It was never designed to govern a marketplace of millions of consumer apps collecting health-adjacent data directly from users. The result is that the most intimate categories of behavioral health data — mood logs, sleep patterns, anxiety triggers, conversations with an AI confidant — frequently live in systems with no HIPAA obligations at all. The data is just as sensitive; the protection is dramatically weaker.</p>
<p>For clinicians, this gap matters in two distinct ways. First, you may be tempted to recommend or use a consumer app in your practice, assuming it carries HIPAA protections it does not. Second, your clients are using these apps independently, often disclosing in them what they hesitate to say in session, with little understanding of where that data flows. Part of your professional role is helping clients understand the gap, and a large part of your own risk management is never assuming "it's a mental health app, so it must be HIPAA-compliant."</p>
<h3>Where the Data Actually Goes</h3>
<p>The business model of many free consumer wellness apps is data. When the product is free, the user is frequently the product. Behavioral and health-adjacent data collected by consumer apps has been documented flowing to advertising networks, analytics firms, and data brokers. A mood-tracking app may share usage patterns with third-party software development kits embedded for advertising. A "free AI therapist" may log every conversation and use it to train models or refine targeting. Once data leaves the app to a data broker, it can be aggregated with other data sets, re-identified, and sold — and there is no clinical confidentiality wrapping any of it, because no covered entity was ever involved.</p>
<p>The mechanics of how this data escapes are worth understanding, because they explain why "free" is the operative warning sign. Many apps embed third-party software development kits — pre-built code modules for analytics, crash reporting, and especially advertising — that transmit data to outside companies as a routine part of how the app functions. The user sees a meditation timer; behind it, an advertising SDK may report engagement patterns, device identifiers, and usage events to an ad network that builds a profile. The app's own developers may not fully control or even fully understand what every embedded SDK transmits. Investigative reporting and regulatory actions have repeatedly found sensitive health-adjacent data flowing through these channels to advertisers and brokers, sometimes contrary to the app's own stated privacy promises. For a clinician, the takeaway is that the absence of a payment is itself a data-flow signal: when no money changes hands, the economics of the product usually depend on the data, and the data is the user.</p>
<p>This is the data-broker problem in its starkest form. Data brokers compile profiles from countless sources and sell them with minimal oversight. Health-adjacent inferences — that a person searched for panic-attack relief, used an addiction-recovery app, or logged depressive symptoms — are commercially valuable and, in the consumer-app world, often unprotected. Regulators have grown increasingly alarmed by this, which is precisely why the Federal Trade Commission has stepped into the space HIPAA does not reach.</p>
<h3>The Client's Mental Model Is Usually Wrong</h3>
<p>What makes the consumer-app gap genuinely dangerous in clinical practice is that clients almost never understand it. The typical client assumes that anything dealing with their mental health is private the way their conversation with you is private. They confide in an AI companion app at two in the morning, disclosing suicidal ideation or relationship details they have not yet brought to session, on the unexamined assumption that "it's like talking to a therapist, so it must be confidential." It is not. There is no privilege, no confidentiality obligation, no clinical relationship — only a software company with a privacy policy that the client has never read and that may permit the very disclosures the client would be horrified by. The gap between the client's mental model and the legal reality is the space where harm happens.</p>
<p>This gives clinicians a genuine educational role that is itself part of competent, ethical practice. You are not the privacy police for your clients' phones, and a blanket prohibition on all apps would be both unrealistic and disrespectful of client autonomy. But when a client mentions using a mood tracker, a journaling app, or an AI companion, a brief, non-judgmental conversation about where that data may go — and an encouragement to read the privacy policy and avoid entering anything they would not want sold — is a meaningful intervention. It costs a minute of session time and can prevent the client from unknowingly broadcasting their most private struggles into a commercial data ecosystem. Helping clients understand the consumer-app gap is, in the AI era, an extension of the informed-consent and client-welfare duties you already hold.</p>` },

        { type: 'text', order: 3, content: `<h2>The FTC and the Health Breach Notification Rule</h2>
<p>The Federal Trade Commission regulates unfair and deceptive trade practices under Section 5 of the FTC Act, and it has applied that authority aggressively to health and privacy. Where HIPAA does not reach a consumer health app, the FTC frequently does. Two mechanisms matter most for behavioral health.</p>
<p>The first is the <strong>FTC Health Breach Notification Rule</strong> (16 CFR Part 318). This rule applies to vendors of personal health records and related entities that are <em>not</em> covered by HIPAA — exactly the consumer apps in the gap. It requires them to notify consumers, the FTC, and in some cases the media when there is a breach of unsecured identifiable health information. In 2021 the FTC issued a policy statement clarifying that the rule reaches health apps and connected devices, and the agency has since brought enforcement actions against consumer health and app companies for disclosing users' sensitive health information to third parties without consent and for failing to notify users of unauthorized disclosures. The Rule was updated in 2024 to modernize its definitions and explicitly cover health apps and emerging technologies, and to clarify what counts as a "breach" — including the unauthorized sharing of health data for advertising.</p>
<p>The second mechanism is the FTC's broader Section 5 enforcement against deceptive privacy claims and unfair data practices. If a consumer app promises "your data is private" or "we never share your information" and then shares it with advertisers, that is a deceptive practice the FTC can act on. The FTC has also pursued companies for unfair data practices even absent an explicit broken promise, where the sharing of sensitive data caused or was likely to cause substantial consumer injury.</p>
<h3>What "HIPAA-Compliant" Marketing Actually Means</h3>
<p>The phrase "HIPAA-compliant" appears constantly in technology marketing, and clinicians must learn to read it skeptically, because it is doing a great deal of rhetorical work and very little legal work. There is no government certification body that audits and certifies software as "HIPAA-compliant." No agency issues a HIPAA seal of approval. When a vendor says it is "HIPAA-compliant," it is making a self-assessment, and the phrase can mean anything from "we have built genuine safeguards and will sign a BAA" to "we read the regulation once and believe we're fine."</p>
<p>The operationally meaningful question is never "is this tool HIPAA-compliant?" It is "will this vendor sign a Business Associate Agreement with me, and what does that agreement actually say?" A vendor's willingness to execute a BAA — and the substance of that BAA — is the concrete, enforceable fact. Marketing language is not. Many consumer apps that describe themselves with health-adjacent reassurances ("secure," "private," "confidential," even "HIPAA-aligned") will not sign a BAA at all, which is the tell that they are consumer products outside the HIPAA framework. "Won't sign a BAA" effectively means "cannot lawfully receive your clients' PHI."</p>
<p>There is a further trap in the word "compliant" applied to AI specifically. A general-purpose chatbot's enterprise tier might offer a BAA, while its free consumer tier does not — same brand, same interface, entirely different legal posture. Clinicians who log in to the consumer version because it is what they have at home are using an unbound tool even though a compliant version of the "same" product exists. The brand is not the unit of compliance; the specific service tier and its contract are.</p>
<p>A related and increasingly common trap is the "AI feature bolted onto familiar software." A practice may use a scheduling tool, a note-taking app, or a video platform for years, then one day the vendor adds an "AI assistant," "smart summary," or "meeting transcription" feature. Suddenly client information that previously stayed within a known, BAA-covered system may be routed to a new AI sub-processor whose terms the clinician never reviewed. The feature is enabled by default, the consent dialog is a single click, and the data flow changes silently. Clinicians must treat every new AI feature in existing software as a fresh vendor-vetting question: Does the existing BAA cover this new processing? Does the AI component introduce a new sub-processor? Is it on by default, and should it be turned off? The familiarity of the host application is exactly what makes its new AI features so easy to trust without scrutiny.</p>` },

        { type: 'imageText', order: 4, title: 'Inside vs. Outside HIPAA', content: `<p>Imagine two doors. Behind the first sits your EHR vendor, your billing service, your telehealth platform, and any enterprise AI tool that signed a BAA — all inside HIPAA\'s chain of trust. Behind the second sits the meditation app, the mood tracker, the free AI companion, and the data brokers buying their exhaust — all outside HIPAA, governed (if at all) by the FTC. Your clients walk through the second door constantly, often unaware it leads anywhere at all.</p>`, image: '', imageAlt: 'Two doors illustration contrasting HIPAA-covered vendors with consumer wellness apps outside HIPAA governed by the FTC', imagePosition: 'left' },

        { type: 'accordion', order: 5, title: 'The Consumer-App Landscape, Decoded', accordionItems: [
          { title: 'Wellness and meditation apps', content: 'Typically consumer products with no covered entity involved. Outside HIPAA. Data practices governed by their privacy policy and FTC oversight, not by clinical confidentiality. Many embed third-party advertising SDKs.' },
          { title: 'Mood and symptom trackers', content: 'Collect highly sensitive behavioral health data directly from users. Almost always outside HIPAA. Their data may flow to analytics and advertising partners unless the policy clearly forbids it.' },
          { title: 'Direct-to-consumer "AI therapist" chatbots', content: 'A user chatting with an AI companion on their own is in a consumer relationship. No covered entity, no HIPAA. Conversations may be logged, retained, and used for model training. The intimacy of the disclosures does not create legal protection.' },
          { title: 'Data brokers', content: 'Aggregate and sell profiles built from app data, web activity, and purchases. Health-adjacent inferences are commercially valuable and largely unprotected for consumer-sourced data. A growing FTC enforcement target.' },
          { title: 'The FTC Health Breach Notification Rule', content: 'Requires non-HIPAA vendors of personal health records to notify consumers and the FTC of breaches of unsecured identifiable health information. Updated in 2024 to explicitly cover health apps and unauthorized advertising disclosures.' },
        ]},

        { type: 'callout', order: 6, calloutType: 'warning', title: 'The BAA Tell', content: '"HIPAA-compliant" is a marketing self-claim with no certifying authority behind it. The enforceable fact is whether the vendor will sign a Business Associate Agreement. If a vendor will not sign a BAA, it cannot lawfully receive your clients\' PHI — full stop.' },

        { type: 'matching', order: 7, matchingInstructions: 'Match each entity or instrument to the regulatory regime that primarily governs it.',
          matchingPairs: [
            { term: 'A billing behavioral health practice\'s EHR vendor', definition: 'HIPAA — business associate under a BAA with a covered entity' },
            { term: 'A consumer mood-tracking app a client downloads independently', definition: 'Outside HIPAA — governed by the FTC and the app\'s privacy policy' },
            { term: 'A non-HIPAA health app that suffers a data breach', definition: 'FTC Health Breach Notification Rule (16 CFR Part 318)' },
            { term: 'A consumer app that promises privacy then shares data with advertisers', definition: 'FTC Section 5 — deceptive or unfair trade practice enforcement' },
          ]},

        { type: 'fillInBlank', order: 8, title: 'Complete the Compliance Reasoning', blanks: [
          { prompt: 'HIPAA applies based on _____ holds the information, not on how sensitive the information is.', answer: 'who', acceptAlternates: ['who holds'] },
          { prompt: 'The FTC ______ Breach Notification Rule covers non-HIPAA vendors of personal health records.', answer: 'Health', acceptAlternates: [] },
          { prompt: 'The concrete, enforceable test of whether a vendor can receive PHI is whether it will sign a ______.', answer: 'BAA', acceptAlternates: ['Business Associate Agreement', 'business associate agreement'] },
          { prompt: 'When an app is free, the user is frequently the ______.', answer: 'product', acceptAlternates: [] },
        ]},

        { type: 'scenarioTree', order: 9, scenarioTitle: 'The "Free AI Therapist" Recommendation', instructions: 'A client mentions they have been "talking to an AI therapist app" between sessions and finds it helpful. Work through the privacy implications.', startNode: 'start',
          nodes: {
            start: { text: 'Your client uses a free direct-to-consumer AI chatbot to process distressing thoughts between sessions. What is the most accurate framing of the privacy situation?', choices: [
              { text: 'It is a mental-health app, so it must be HIPAA-protected', nextId: 'wrong1' },
              { text: 'It is a consumer app outside HIPAA; conversations may be logged, retained, and used for training', nextId: 'right1' },
            ]},
            wrong1: { text: 'This is the common misconception. HIPAA coverage turns on who holds the data, not on subject matter. A consumer app the client uses independently has no covered entity in the relationship and is outside HIPAA. Reconsider.', choices: [
              { text: 'Re-evaluate the framing', nextId: 'right1' },
            ]},
            right1: { text: 'Correct. The app is outside HIPAA. What is the most helpful clinical response?', choices: [
              { text: 'Tell the client to stop using all technology immediately', nextId: 'overreach' },
              { text: 'Help the client understand the privacy gap and read the app\'s data practices', nextId: 'end1' },
            ]},
            overreach: { text: 'Blanket prohibition is paternalistic and unrealistic; the client may benefit from the tool. The clinical role is to inform, not forbid. Reconsider.', choices: [
              { text: 'Choose the informing response', nextId: 'end1' },
            ]},
            end1: { text: 'Well reasoned. You explain that the app is not bound by clinical confidentiality, that its conversations may be retained and used commercially, and you encourage the client to review its privacy policy and avoid entering information they would not want sold or shared. You have respected autonomy while closing a knowledge gap.', isEnd: true },
          }},

        { type: 'reflection', order: 10, question: 'Have you ever recommended a wellness, meditation, or mental-health app to a client? Did you investigate its data practices and whether it shares information with advertisers or brokers — or did you assume that, because it addresses mental health, it must protect the data?' },

        { type: 'keyTakeaway', order: 11, title: 'Key Takeaways', takeaways: [
          'HIPAA coverage depends on who holds the information, not on how sensitive it is; most consumer wellness and AI apps sit outside HIPAA in the consumer-app gap.',
          'Behavioral health data in consumer apps frequently flows to analytics firms, advertisers, and data brokers, with no clinical confidentiality attached.',
          'The FTC fills part of the gap through the Health Breach Notification Rule (16 CFR Part 318) and Section 5 enforcement against deceptive and unfair data practices.',
          '"HIPAA-compliant" is an uncertified marketing self-claim; the enforceable test is whether the vendor will sign a Business Associate Agreement.',
          'The same brand may offer a BAA-backed enterprise tier and an unbound consumer tier — the service tier and its contract, not the brand, is the unit of compliance.',
        ]},
      ],
    },

    // ════════════════════════════════════════════════════════════════════
    // SECTION 3 — BAAs, Vendor Vetting, and Data Retention
    // ════════════════════════════════════════════════════════════════════
    {
      title: 'BAAs, Vendor Vetting, and Data Retention',
      order: 3,
      contentBlocks: [
        { type: 'sectionDivider', order: 1, sectionNumber: '3', title: 'BAAs, Vendor Vetting, and Data Retention', subtitle: 'What a Business Associate Agreement must contain, where your prompts go, and how to vet an AI vendor before trusting it with PHI' },

        { type: 'text', order: 2, content: `<h2>The Business Associate Agreement: Your Enforceable Promise</h2>
<p>The Business Associate Agreement is the single most important compliance instrument when you bring any vendor — and especially an AI vendor — into contact with PHI. It is the contract that extends your chain of trust to the vendor and makes the vendor legally accountable for protecting the information you share. Without a signed BAA, a covered entity's disclosure of PHI to a vendor is, by default, an impermissible disclosure. With a BAA, the disclosure is permitted and the vendor assumes defined obligations and liability.</p>
<p>The HIPAA rules specify the elements a BAA must contain (45 CFR 164.504(e)). A compliant BAA establishes the permitted and required uses and disclosures of PHI by the business associate; prohibits uses or disclosures beyond those permitted by the contract or required by law; requires the business associate to use appropriate safeguards to prevent unauthorized use or disclosure, including compliance with the Security Rule for ePHI; requires the business associate to report any use or disclosure not provided for, including security incidents and breaches; requires that subcontractors who receive PHI agree to the same restrictions (flowing the obligations downstream); requires the business associate to make PHI available for access and amendment; and requires return or destruction of PHI at the end of the relationship, where feasible.</p>
<p>For AI vendors, several of these elements deserve special scrutiny. The "permitted uses" clause is where you discover whether the vendor reserves the right to use your clients' PHI to train its models. The "safeguards" clause is where the Security Rule obligations live. The "subcontractor" clause is where you learn whether your PHI will be handed to cloud providers and other sub-processors — and whether those are bound. The "return or destruction" clause is where data-retention and deletion promises become enforceable. A BAA that is silent or evasive on these points is a warning, not a comfort.</p>
<p>It is worth pausing on why the BAA matters so much in practical, not just legal, terms. Without a BAA, you have no enforceable promise and no allocation of liability — if the vendor leaks your clients' data, you bear the full weight of the breach as an unauthorized disclosure you yourself caused by sending PHI to an unbound party. With a properly executed BAA, the vendor has assumed defined safeguarding duties, breach-reporting obligations, and liability; the disclosure was permitted; and you have a contractual basis to demand information and remediation when something goes wrong. The BAA does not make the data safe by magic, but it converts a reckless act into a governed relationship. This is why "Will you sign a BAA?" is not bureaucratic box-checking but the single most informative question you can ask a vendor — a vendor's answer, and the substance of the agreement it offers, tells you more about its seriousness than any volume of marketing copy.</p>
<h3>A BAA Is Necessary, Not Sufficient</h3>
<p>It is tempting to treat a signed BAA as the finish line: the vendor signed, therefore we are compliant. This is a serious error. A BAA is a legal allocation of responsibility; it does not by itself make a vendor's actual practices safe. A vendor can sign a BAA and still retain data longer than you expect, use confusing default settings, rely on sub-processors in jurisdictions you did not anticipate, or suffer a breach. The BAA gives you contractual recourse and assigns liability, but your due diligence — the vendor vetting described below — is what tells you whether the vendor's real-world practices match the paper. Compliance is the BAA <em>plus</em> the verification.</p>` },

        { type: 'text', order: 3, content: `<h2>Where Your Prompts Go — and Whether They Train the Model</h2>
<p>When you type into an AI tool, your input travels somewhere, is processed somewhere, and may be stored somewhere. Each of these "somewheres" is a privacy question, and the answers vary enormously across products and even across tiers of the same product. The conscientious clinician treats every AI input as a transmission of data to a remote system until proven otherwise.</p>
<p>The most consequential question is whether your inputs are used to train or improve the vendor's models. Model training on inputs means your clients' clinical narratives could become part of the data the model learns from — potentially surfacing, in fragmentary or transformed form, in outputs to other users, and certainly being retained and processed in ways you cannot audit. Enterprise and business tiers of major AI providers typically promise <em>not</em> to train on customer inputs by default and will sign a BAA; consumer tiers frequently reserve the right to use inputs for model improvement. The difference is not cosmetic. Sending PHI to a tier that trains on inputs is sending PHI into a system designed to remember and generalize from it.</p>
<p>Retention is the next question. Even a vendor that does not train on your inputs may retain them — in logs, in abuse-monitoring systems, in backups — for some period. A "zero data retention" arrangement, offered by some enterprise AI services, means inputs are not stored after the request is processed. Where zero retention is not available, you need to know the retention period, who can access retained data (including the vendor's own staff and any human reviewers), and how deletion works when you terminate the relationship. The Security Rule's safeguards and the BAA's return-or-destruction clause both bear on these answers.</p>
<h3>Sub-Processors, Encryption, and Access Controls</h3>
<p>Modern AI services are built on layers of infrastructure. The vendor you contract with likely runs on a major cloud provider, may use additional sub-processors for storage, content moderation, or analytics, and may route data across regions. Each sub-processor is a link in your chain of trust that must be bound by agreements flowing your protections downstream. A responsible vendor publishes its sub-processor list and its BAA flows obligations to them; an opaque vendor that cannot or will not tell you who else touches the data is asking you to trust an unknown chain.</p>
<p>Encryption is a baseline expectation, not a luxury. PHI should be encrypted in transit (so it cannot be read as it travels the internet) and at rest (so stored copies are unreadable without keys). The Security Rule treats encryption as an "addressable" specification, but for behavioral health data crossing the public internet to an AI vendor, strong encryption in transit and at rest is the practical standard, and breach-notification obligations are reduced when breached data was properly encrypted. Access controls — who at the vendor can see your data, under what authentication, with what logging — determine whether "encrypted at rest" actually means "protected from insiders." Multi-factor authentication, role-based access, and audit logging are the marks of a vendor that takes the Security Rule seriously.</p>
<h3>The Human-Reviewer Question</h3>
<p>One detail that clinicians routinely overlook, and that can be decisive for behavioral health data, is whether any human being at the vendor ever reads the inputs. Many AI services employ human reviewers for quality assurance, abuse detection, or safety monitoring, meaning that a fraction of submitted content may be seen by the vendor's staff or contractors. For ordinary consumer use this is a minor consideration; for a clinician submitting psychotherapy content, it means a stranger employed by a technology company could read a client's most intimate disclosures. A serious vendor will be transparent about whether, when, and how human review occurs, whether reviewers see identifiable content, and whether you can opt out. A vendor that will not answer the human-reviewer question is asking you to assume that no human will ever see your clients' data while being unwilling to promise it — a posture incompatible with behavioral health confidentiality. NIST's guidance on implementing the Security Rule and its broader risk-management frameworks both emphasize understanding the full lifecycle of data, including who can access it and under what circumstances, precisely because access by people, not just systems, is where so much real-world exposure occurs.</p>` },

        { type: 'videoEmbed', order: 4, videoTitle: 'Reading a Business Associate Agreement: What to Look For', videoUrl: 'https://www.youtube.com/embed/PLACEHOLDER_baa', description: 'A walkthrough of the required BAA elements under 45 CFR 164.504(e), with emphasis on model-training, retention, sub-processor, and deletion clauses relevant to AI vendors.' },

        { type: 'accordion', order: 5, title: 'The AI Vendor Vetting Checklist', accordionItems: [
          { title: 'Will the vendor sign a BAA?', content: 'The threshold question. If no, the vendor cannot lawfully receive PHI. If yes, obtain and read the actual BAA — do not rely on a marketing claim that one is "available."' },
          { title: 'Does it train on your inputs?', content: 'Confirm in writing that your clients\' data will not be used to train or improve the vendor\'s models. Enterprise tiers typically promise this; consumer tiers often do not.' },
          { title: 'What is the retention and deletion policy?', content: 'Determine how long inputs are retained, who can access them, whether "zero data retention" is offered, and how data is returned or destroyed when you leave. Tie these to the BAA\'s return-or-destruction clause.' },
          { title: 'Who are the sub-processors?', content: 'Ask for the sub-processor list and confirm that obligations flow downstream. Note data-residency and cross-border routing. Opacity here is a red flag.' },
          { title: 'How is data encrypted and access-controlled?', content: 'Require encryption in transit and at rest, multi-factor authentication, role-based access, and audit logging. Ask whether human reviewers ever see inputs.' },
          { title: 'What is the breach-notification commitment?', content: 'Confirm the vendor will report security incidents and breaches promptly, with timelines that let you meet your own HIPAA breach-notification deadlines.' },
        ]},

        { type: 'callout', order: 6, calloutType: 'protocol', title: 'BAA + Verification = Compliance', content: 'A signed Business Associate Agreement is necessary but not sufficient. It allocates legal responsibility; it does not by itself make a vendor\'s real practices safe. Pair every BAA with active due diligence on training, retention, sub-processors, and security controls.' },

        { type: 'multipleChoice', order: 7,
          question: 'A clinician wants to use a popular general-purpose AI chatbot for drafting clinical documentation. Which factor most directly determines whether this is permissible under HIPAA?',
          options: [
            { text: 'Whether the chatbot\'s answers are clinically accurate', isCorrect: false },
            { text: 'Whether the specific service tier offers a signed BAA and does not train on inputs', isCorrect: true },
            { text: 'Whether the clinician finds the interface convenient', isCorrect: false },
            { text: 'Whether other clinicians in the practice already use it', isCorrect: false },
          ],
          correctAnswer: 1,
          explanation: 'Permissibility turns on the legal and data-handling posture of the specific tier: whether a BAA is signed and whether inputs are used for model training and retained. Convenience, popularity, and output accuracy do not establish HIPAA compliance.' },

        { type: 'multiSelect', order: 8,
          question: 'Which clauses in an AI vendor\'s BAA deserve special scrutiny because they directly affect PHI risk? (Select all that apply)',
          options: [
            { text: 'Permitted uses — whether inputs may be used to train models', isCorrect: true },
            { text: 'Subcontractor flow-down — whether sub-processors are bound', isCorrect: true },
            { text: 'The vendor\'s logo and brand colors', isCorrect: false },
            { text: 'Return or destruction of PHI at termination', isCorrect: true },
            { text: 'Safeguards and Security Rule compliance for ePHI', isCorrect: true },
          ],
          explanation: 'Permitted uses (training), subcontractor flow-down, return-or-destruction, and safeguards clauses each map to a concrete PHI risk. Branding is irrelevant to compliance.' },

        { type: 'cardSort', order: 9, instructions: 'Sort each vendor characteristic into "Green Flag" (supports compliant use) or "Red Flag" (signals risk).', categories: ['Green Flag', 'Red Flag'],
          cards: [
            { id: 'c1', text: 'Signs a BAA and provides the full text on request', correctCategory: 'Green Flag' },
            { id: 'c2', text: 'Reserves the right to use your inputs to improve its models', correctCategory: 'Red Flag' },
            { id: 'c3', text: 'Publishes its sub-processor list and flows obligations downstream', correctCategory: 'Green Flag' },
            { id: 'c4', text: 'Cannot say how long it retains your data or who can access it', correctCategory: 'Red Flag' },
            { id: 'c5', text: 'Encrypts data in transit and at rest with audit logging', correctCategory: 'Green Flag' },
            { id: 'c6', text: 'Markets itself as "HIPAA-aligned" but will not sign a BAA', correctCategory: 'Red Flag' },
          ]},

        { type: 'reflection', order: 10, question: 'For the AI or cloud tools currently in your workflow, do you actually possess a signed BAA for each one that touches PHI? If you searched your files right now, how many could you produce — and how many have you simply assumed are covered?' },

        { type: 'keyTakeaway', order: 11, title: 'Key Takeaways', takeaways: [
          'A Business Associate Agreement is the instrument that lawfully permits disclosing PHI to a vendor and binds the vendor to HIPAA obligations under 45 CFR 164.504(e).',
          'A BAA is necessary but not sufficient — pair it with verification of the vendor\'s actual training, retention, sub-processor, and security practices.',
          'The most consequential AI question is whether your inputs are used to train the model; enterprise tiers typically promise not to, while consumer tiers often reserve that right.',
          'Retention, sub-processors, encryption in transit and at rest, and access controls determine whether the paper promises match real-world protection.',
          'Vet every AI vendor against a concrete checklist before trusting it with PHI; opacity about data handling is itself a red flag.',
        ]},
      ],
    },

    // ════════════════════════════════════════════════════════════════════
    // SECTION 4 — Practical Safeguards
    // ════════════════════════════════════════════════════════════════════
    {
      title: 'Practical Safeguards',
      order: 4,
      contentBlocks: [
        { type: 'sectionDivider', order: 1, sectionNumber: '4', title: 'Practical Safeguards', subtitle: 'De-identification, minimum necessary, consent, state laws, and breach response when AI enters the workflow' },

        { type: 'text', order: 2, content: `<h2>De-Identification: The Most Powerful Safeguard</h2>
<p>The single most effective way to use AI tools while protecting clients is to ensure the tool never receives PHI in the first place. If the input is genuinely de-identified, it is no longer protected health information, and the disclosure rules that govern PHI do not attach to it in the same way. De-identification is not a vague aspiration; the HIPAA Privacy Rule (45 CFR 164.514) defines two rigorous methods for achieving it.</p>
<p>The first is <strong>Safe Harbor</strong>. Under Safe Harbor, information is de-identified when eighteen specified categories of identifiers are removed, and the covered entity has no actual knowledge that the remaining information could be used to identify the individual. The eighteen identifiers include names; geographic subdivisions smaller than a state (with specific rules for ZIP codes); all dates more specific than year that relate to an individual (birth date, admission date, etc.); telephone and fax numbers; email addresses; Social Security numbers; medical record and account numbers; certificate and license numbers; vehicle and device identifiers; URLs and IP addresses; biometric identifiers; full-face photographs; and any other unique identifying number, characteristic, or code. Removing all eighteen, and having no knowledge that re-identification remains possible, yields Safe Harbor de-identification.</p>
<p>The second method is <strong>Expert Determination</strong>. Here, a person with appropriate statistical and scientific knowledge applies generally accepted methods to determine that the risk of re-identifying an individual from the information is very small, and documents that determination. Expert Determination is more flexible — it can preserve more analytic value than Safe Harbor — but it requires genuine expertise and documentation, and is generally beyond the reach of an individual clinician working ad hoc.</p>
<h3>Why Informal "Disguising" Fails</h3>
<p>The practical danger for clinicians is the gap between de-identification and informal disguising. Changing a client's name, or omitting it, while leaving age, profession, location, family structure, and a distinctive presenting problem intact does <em>not</em> de-identify the information. "A 41-year-old male firefighter in a town of 3,000 with an only child who recently disclosed a gambling addiction" is not de-identified by any standard — there may be exactly one such person, and the narrative points straight to him. Safe Harbor exists precisely because human intuition about what is "anonymous enough" is unreliable. When you cannot strip an input to genuine de-identification — and clinical narratives are often too rich to fully de-identify and remain useful — you must instead use a BAA-backed tool, obtain authorization, or not use the AI tool for that input at all.</p>
<p>There is a further subtlety unique to the AI era: the risk of re-identification through combination. A single de-identified detail may be harmless, but AI systems and data brokers excel at combining fragments. If you submit several "disguised" cases over time to the same tool, the accumulated details — the small town, the unusual profession, the rare diagnosis, the specific family configuration — can be cross-referenced into a portrait that points to a real person, even though no single prompt named them. The Safe Harbor standard's requirement that you have "no actual knowledge" that re-identification is possible must therefore be read in light of how powerfully modern systems can triangulate. The conservative and correct posture is to treat de-identification as binary: either the input genuinely satisfies Safe Harbor or Expert Determination, or it is PHI and must be handled as PHI. There is no reliable middle ground of "probably anonymous enough," and clinical narratives that retain enough texture to be useful to an AI usually retain enough texture to be re-identifiable.</p>` },

        { type: 'text', order: 3, content: `<h2>Minimum Necessary, Consent, and State Law Overlays</h2>
<p>Even when a tool is BAA-backed and a disclosure is permitted, the <strong>minimum necessary</strong> standard still governs. Share with the AI tool only what the task actually requires. Drafting a generic psychoeducation handout requires no client identifiers at all. Summarizing a session may require clinical content but rarely requires the client's full identifying profile. The discipline is to ask, before every input, "what is the smallest amount of information that accomplishes this task?" — and to send only that. Minimum necessary is not just a Privacy Rule obligation; it is the most reliable way to shrink the consequences if anything ever goes wrong.</p>
<p><strong>Informed consent</strong> deserves explicit attention in the AI era. Professional ethics codes — the ACA Code of Ethics (2014), NBCC, NASW, AAMFT — and many state laws require that clients understand how their information is handled. As AI tools enter the workflow, transparency about their use is both an ethical obligation and a trust-building practice. This does not mean every keystroke needs a consent form, but clients should understand, through your Notice of Privacy Practices and informed-consent process, that technology vendors (including AI tools) may process their information under appropriate safeguards. Where you use AI in ways a reasonable client would want to know about — for instance, AI-assisted documentation or transcription — disclosing that use respects autonomy and reduces complaint risk.</p>
<h3>State Laws and Special Categories: CMIA and 42 CFR Part 2</h3>
<p>HIPAA is a federal floor; many state laws are stricter, and certain categories of behavioral health information carry heightened federal protection that AI workflows can easily violate. Two overlays are essential for behavioral health clinicians.</p>
<p>The <strong>California Confidentiality of Medical Information Act (CMIA)</strong> is an example of a state law that imposes confidentiality and consent requirements often more protective than HIPAA, with its own penalties, and that reaches some entities and uses HIPAA does not. Clinicians in California — and those serving California residents — must comply with CMIA in addition to HIPAA, and other states have their own analogous statutes. State medical-privacy and mental-health-records laws frequently require specific authorization for disclosures that HIPAA would permit more freely.</p>
<p><strong>42 CFR Part 2</strong> is the federal regulation governing the confidentiality of substance use disorder (SUD) treatment records held by federally assisted SUD programs. Part 2 is significantly stricter than HIPAA: it generally requires patient consent for disclosures even for treatment, payment, and operations, and restricts redisclosure. For a clinician whose work touches SUD records covered by Part 2, feeding those records to an AI tool — even a BAA-backed one — can violate Part 2 unless the specific consent and redisclosure requirements are satisfied. The 2024 alignment of Part 2 with HIPAA in some respects did not erase its heightened protections. The lesson is categorical: SUD records demand an additional, stricter analysis before any AI tool touches them.</p>
<p>The redisclosure restriction deserves particular emphasis because it is where AI workflows so easily go wrong. Part 2 attaches a prohibition on redisclosure to the information itself, meaning that once Part 2-protected data is shared, the recipient is generally barred from passing it on without separate consent. An AI vendor that receives, logs, retains, and potentially routes SUD content to sub-processors is, in effect, performing exactly the kind of redisclosure Part 2 restricts. A standard HIPAA BAA does not, by itself, satisfy Part 2's consent and redisclosure framework. Clinicians working in or adjacent to addiction treatment must therefore treat any AI use involving SUD records as a separate, higher-bar analysis, confirming that the necessary patient consents are in place and that the tool's data handling does not effect a prohibited redisclosure. When in doubt about whether records fall under Part 2, the safe assumption is that they do, and that no AI tool touches them without the stricter consent foundation.</p>
<h3>Documentation, Consent Forms, and the Notice of Privacy Practices</h3>
<p>The mechanism through which much of this transparency is delivered is your written documentation — the Notice of Privacy Practices (NPP) and the informed-consent forms clients review at intake. As AI tools become part of the clinical workflow, these documents should accurately reflect that technology vendors, including AI tools operating under business associate agreements, may process client information under appropriate safeguards. This is not a license to bury AI use in fine print; it is a reminder that the formal documents clients sign are the backbone of lawful, ethical information handling, and that they must keep pace with how your practice actually operates. A practice that has quietly adopted AI-assisted documentation while its NPP and consent forms still describe a paper-and-fax world has a gap between its stated and actual practices — a gap that surfaces painfully in a board complaint or audit. Keeping documentation current with technology is itself a safeguard.</p>` },

        { type: 'imageText', order: 4, title: 'Layered Protections', content: `<p>Think of safeguards as concentric rings around the client. The outer ring is HIPAA — the federal floor. Inside it sits stricter state law like CMIA. Inside that sit special-category rules like 42 CFR Part 2 for SUD records. At the center is the simplest protection of all: never sending PHI to the tool, through genuine de-identification or minimum-necessary inputs. The closer to the center you operate, the less any single failure can harm the client.</p>`, image: '', imageAlt: 'Concentric rings illustrating layered privacy protections from HIPAA to state law to 42 CFR Part 2 to de-identification at the center', imagePosition: 'right' },

        { type: 'text', order: 5, content: `<h2>Breach Response and Incident Planning</h2>
<p>Safeguards reduce the probability of a privacy failure; they do not eliminate it. Competent practice therefore includes a written incident-response plan and a working knowledge of the breach-notification obligations that activate when something goes wrong. With AI tools in the workflow, the failure modes multiply: a vendor data leak, a misconfigured account that exposed prompts, an employee pasting PHI into an unapproved consumer tool, or the discovery that a "compliant" tool was retaining and training on inputs after all.</p>
<p>Under the HIPAA <strong>Breach Notification Rule</strong> (45 CFR 164.400–414), an impermissible use or disclosure of unsecured PHI is presumed to be a breach unless the covered entity demonstrates a low probability that the PHI was compromised, through a risk assessment considering the nature of the PHI, the unauthorized recipient, whether the PHI was actually acquired or viewed, and the extent of mitigation. When a breach is confirmed, affected individuals must be notified without unreasonable delay and no later than 60 calendar days after discovery; the Secretary of HHS must be notified (immediately for breaches of 500 or more individuals, annually for smaller ones); and breaches affecting 500 or more residents of a state require media notification. Notably, a breach of PHI that was properly encrypted may not trigger these obligations at all — another reason encryption is foundational.</p>
<p>For consumer apps and non-HIPAA vendors, the FTC Health Breach Notification Rule imposes parallel obligations, and state breach-notification laws add another layer with their own definitions and timelines. A clinician who used a non-HIPAA tool and suffered a breach may face FTC and state obligations even where HIPAA does not apply. The practical mandate is a single, written incident-response plan that identifies who is notified, in what order, within what deadlines, and that is rehearsed before it is needed. An incident plan written during an incident is written too late.</p>
<p>The four-factor risk assessment that determines whether an impermissible disclosure rises to a reportable breach deserves a closer look, because clinicians often skip it and either over-report or, more dangerously, under-report. The first factor is the nature and extent of the PHI involved, including the types of identifiers and the likelihood of re-identification — a single diagnosis paired with a name is more compromising than a stray appointment time. The second is the unauthorized person who used the PHI or to whom it was disclosed; disclosure to another HIPAA-covered entity bound by confidentiality is different from disclosure to an anonymous attacker. The third is whether the PHI was actually acquired or viewed, as opposed to merely exposed in a way that may not have been accessed. The fourth is the extent to which the risk to the PHI has been mitigated, such as obtaining assurances that erroneously disclosed data was destroyed. Only if this assessment shows a low probability of compromise may the presumption of breach be rebutted. Documenting the assessment is essential; a defensible "no breach" conclusion must be written down, with its reasoning, because the burden is on the covered entity to demonstrate that notification was not required.</p>
<p>Embedding this into practice means deciding, in advance and in writing, who in your practice owns the incident response, where the logs and vendor BAAs are kept so they can be retrieved under pressure, and what the notification path looks like for both HIPAA and non-HIPAA tools. A solo practitioner is the whole response team and must know the steps cold; a group practice should designate a privacy officer and rehearse the plan at least annually, ideally with a tabletop exercise that walks through a realistic AI-related scenario such as a clinician pasting PHI into an unapproved tool. The difference between a contained, well-documented incident and a career-threatening crisis is rarely the technical severity of the breach — it is whether the clinician knew what to do in the first hour and could prove, afterward, that they did it.</p>` },

        { type: 'accordion', order: 6, title: 'Breach Response, Step by Step', accordionItems: [
          { title: '1. Contain and preserve', content: 'Stop the exposure — revoke access, disable the account, halt use of the tool. Preserve logs and evidence; do not delete anything that documents what happened.' },
          { title: '2. Assess whether a breach occurred', content: 'Run the HIPAA four-factor risk assessment (nature of the PHI, unauthorized recipient, whether PHI was actually acquired or viewed, mitigation). Encrypted PHI may not constitute a reportable breach.' },
          { title: '3. Notify within deadlines', content: 'For HIPAA breaches: affected individuals within 60 days; HHS immediately for 500+ or annually for smaller; media for 500+ in a state. For non-HIPAA tools: FTC Health Breach Notification Rule and state laws.' },
          { title: '4. Mitigate and document', content: 'Take reasonable steps to mitigate harm, document the entire response, and retain records. Documentation is both a legal requirement and your defense.' },
          { title: '5. Remediate the root cause', content: 'Fix what allowed the breach — terminate a non-compliant vendor, retrain staff, tighten access controls, update the incident plan based on lessons learned.' },
        ]},

        { type: 'callout', order: 7, calloutType: 'clinical', title: 'SUD Records Are Different', content: '42 CFR Part 2 protects substance use disorder treatment records far more strictly than HIPAA, generally requiring patient consent even for treatment disclosures and restricting redisclosure. Before any AI tool touches Part 2 records, complete a separate, stricter consent analysis — a HIPAA-compliant tool is not automatically Part 2-compliant.' },

        { type: 'multipleChoice', order: 8,
          question: 'A clinician wants to "disguise" a case for an AI consultation by removing the name but keeping age, profession, town size, and a distinctive presenting problem. Under the HIPAA de-identification standard, is the input de-identified?',
          options: [
            { text: 'Yes — removing the name is sufficient for Safe Harbor', isCorrect: false },
            { text: 'No — Safe Harbor requires removing all eighteen identifier categories, and the remaining details could identify the individual', isCorrect: true },
            { text: 'Yes — informal disguising satisfies Expert Determination', isCorrect: false },
            { text: 'It does not matter, because consultation is always permitted', isCorrect: false },
          ],
          correctAnswer: 1,
          explanation: 'Safe Harbor requires removing all eighteen categories of identifiers and having no actual knowledge that re-identification remains possible. A rich narrative with age, profession, location, and a distinctive problem can point to a specific person and is not de-identified.' },

        { type: 'sequencing', order: 9, instructions: 'Arrange the breach-response steps in the correct order, from the moment an exposure is discovered.', steps: [
            { id: 's1', text: 'Contain the exposure and preserve logs and evidence', order: 1 },
            { id: 's2', text: 'Run the four-factor risk assessment to determine whether a reportable breach occurred', order: 2 },
            { id: 's3', text: 'Notify affected individuals, HHS, and (if applicable) media within the required deadlines', order: 3 },
            { id: 's4', text: 'Mitigate harm and fully document the response', order: 4 },
            { id: 's5', text: 'Remediate the root cause and update the incident-response plan', order: 5 },
          ], explanation: 'Contain first to stop the bleeding and preserve evidence, then assess whether the event is a reportable breach, then meet notification deadlines, then mitigate and document, and finally fix the underlying cause so it cannot recur.' },

        { type: 'multipleChoice', question: "Using the \"concentric rings\" safeguard model from this section, which law sits at the outer ring as the federal floor?", options: [{ text: "42 CFR Part 2", isCorrect: false }, { text: "HIPAA", isCorrect: true }, { text: "State-level CMIA-type statutes", isCorrect: false }, { text: "Vendor terms of service", isCorrect: false }], correctAnswer: 1, explanation: "HIPAA is described as the outer ring — the federal floor — with stricter state law and special-category rules like 42 CFR Part 2 sitting inside it as additional, more protective layers." },
{ type: 'reflection', order: 10, question: 'If you discovered today that an AI tool you use had been retaining and training on every prompt you ever sent it — including client information — would you know exactly what to do in the first hour? Who would you notify, and within what deadline?' },

        { type: 'keyTakeaway', order: 11, title: 'Key Takeaways', takeaways: [
          'Genuine de-identification — Safe Harbor (removing all eighteen identifiers) or Expert Determination — removes information from PHI status; informal "disguising" reliably fails.',
          'Minimum necessary and informed consent apply even to BAA-backed tools; send only what the task requires and be transparent with clients about AI use.',
          'State laws like California\'s CMIA and the federal 42 CFR Part 2 for SUD records are stricter than HIPAA and require separate analysis before AI touches the data.',
          'The HIPAA Breach Notification Rule requires individual notice within 60 days, HHS notice, and media notice for large breaches; encryption can prevent a reportable breach.',
          'A written, rehearsed incident-response plan — contain, assess, notify, mitigate, remediate — must exist before an incident, not be improvised during one.',
        ]},
      ],
    },

    // ════════════════════════════════════════════════════════════════════
    // SECTION 5 — Summary, Resources, and Commitments
    // ════════════════════════════════════════════════════════════════════
    {
      title: 'Summary, Resources, and Commitments',
      order: 5,
      contentBlocks: [
        { type: 'sectionDivider', order: 1, sectionNumber: '5', title: 'Summary, Resources, and Commitments', subtitle: 'Synthesizing a defensible AI privacy practice and committing to concrete next steps' },

        { type: 'text', order: 2, content: `<h2>Bringing It Together</h2>
<p>The arrival of artificial intelligence in behavioral health is not a reason for panic and it is not a reason for naïveté. It is a reason for discipline. Everything in this course reduces to a small number of habits that, practiced consistently, allow you to capture the genuine benefits of AI tools while keeping faith with the clients who trust you with their most private experiences.</p>
<p>The first habit is recognition. The decision point — "am I about to disclose protected health information to an outside party?" — is invisible by default, concealed by the privacy of a keyboard and the friendliness of an interface. Naming it before you act is the whole game. Protected health information does not stop being PHI when you paste it into a prompt; the regulated status travels with the information, and so does your responsibility for it. When client information is about to leave your control, you have reached a decision point, however casual the moment feels.</p>
<p>The second habit is structural awareness. You know now where you sit — as a covered entity — and where vendors sit. An AI tool that processes client PHI on your behalf is a business associate, lawful to use only under a Business Associate Agreement, and accountable through the chain of trust that you, at the top, remain responsible for. You also know that most consumer wellness and AI apps sit entirely outside HIPAA, governed if at all by the FTC, and that "HIPAA-compliant" is a marketing self-claim whose only enforceable test is whether the vendor will sign a BAA.</p>
<p>The third habit is verification. A BAA is necessary but not sufficient. You vet the vendor: Does it train on your inputs? How long does it retain them, and who can access them? Who are the sub-processors? Is data encrypted in transit and at rest? Will it report breaches in time for you to meet your own deadlines? Opacity is a red flag, and the brand is never the unit of compliance — the specific service tier and its contract are. Verification is not a one-time event but an ongoing posture: vendors change their terms, add AI features, and adjust their sub-processors, and a tool that was compliant when you adopted it can drift out of compliance through an update you never noticed. Periodic re-review — at least annually, and whenever a vendor announces a new feature — keeps the verification current rather than letting it ossify into a stale assumption.</p>
<p>The fourth habit is layered protection. The most powerful safeguard is to never send PHI at all: genuine de-identification under Safe Harbor or Expert Determination, and minimum-necessary inputs that carry only what the task requires. Above that sit consent and transparency; above that, stricter state laws like CMIA and special-category rules like 42 CFR Part 2 for substance use records, which demand their own analysis before any AI tool is involved. And surrounding all of it is a written, rehearsed breach-response plan, because safeguards reduce risk without eliminating it, and the clinician who has planned for failure recovers from it with far less harm to clients and to their own practice. No single layer is sufficient on its own; their strength lies in redundancy, so that when one control fails, another stands behind it. That is precisely how defense in depth protects clients even on the day that something goes wrong.</p>
<p>Hold these four habits — recognition, structural awareness, verification, and layered protection — and you will be able to answer the question that opened this course. When you finish a session and reach for an AI tool, you will pause for the ninety seconds that matter, ask where the data goes, and act with the same care at the keyboard that you bring to the therapy room. That is what protecting client information in the age of AI actually looks like: not a refusal of new tools, but a refusal to use them carelessly.</p>
<h3>A Word on Proportionality and Professional Identity</h3>
<p>It would be easy to read this course as a counsel of fear — to conclude that AI tools are so fraught that the safest course is to avoid them entirely. That is not the intended message, and it would be a disservice to clients. Used well, AI tools can reduce the administrative burden that drives clinician burnout, help draft psychoeducational materials, support clinical reasoning, and free time for the human work that only a clinician can do. The goal is proportionality: matching the rigor of your safeguards to the sensitivity of the data and the risk of the workflow, so that low-risk uses remain easy and high-risk uses are properly gated. A clinician who de-identifies inputs, uses BAA-backed tools for PHI, and reserves consumer tools for tasks involving no client information can capture genuine benefits with genuine safety. The discipline is not abstinence; it is judgment.</p>
<p>This judgment is, ultimately, an expression of professional identity. The counselor's identity is built on a foundation of trust, confidentiality, and the welfare of the client, and those commitments do not change when the technology does. The medium through which we might breach confidentiality has shifted — from a misdirected fax to a careless prompt — but the underlying duty is the same one our codes of ethics have always named. To practice competently in the age of AI is to carry the same protective instinct into a new context, recognizing that the casual keyboard is now one of the places where the sacred promise of the therapy room can be kept or broken. The clinician who internalizes that recognition has not merely learned a set of rules; they have extended their professional identity to meet the moment. That extension — thoughtful, proportionate, and grounded in the enduring duty to the client — is the real outcome this course hopes to produce.</p>` },

        { type: 'imageText', order: 3, title: 'The Defensible AI Practice', content: `<p>A defensible AI privacy practice is not a binder of policies gathering dust. It is a set of reflexes: pausing at the keyboard, asking where the data goes, reaching for de-identified or minimum-necessary inputs first, insisting on a BAA before any tool touches PHI, knowing which state and special-category laws apply to this client, and having already decided what you will do if something fails. Reflexes, not rules, are what hold up under the pressure of a busy clinical day.</p>`, image: '', imageAlt: 'Clinician pausing thoughtfully at a keyboard before entering information into an AI tool, representing a defensible privacy practice', imagePosition: 'left' },

        { type: 'callout', order: 4, calloutType: 'tip', title: 'The Ninety-Second Pause', content: 'The cheapest, most effective control in this entire course is a deliberate pause before any AI input: "Is there PHI here? Where does it go? Is that destination bound to protect it? Is there a stricter law in play?" Ninety seconds of recognition prevents the great majority of AI privacy failures.' },

        { type: 'multipleChoice', order: 5,
          question: 'Which sequence best captures the disciplined reasoning this course recommends before using an AI tool with client-related information?',
          options: [
            { text: 'Check convenience, then check popularity, then proceed', isCorrect: false },
            { text: 'Recognize the decision point, identify the data destination, verify the vendor and BAA, apply de-identification and stricter laws, and plan for failure', isCorrect: true },
            { text: 'Confirm the tool is marketed as "HIPAA-compliant" and proceed', isCorrect: false },
            { text: 'Remove the client\'s name and proceed', isCorrect: false },
          ],
          correctAnswer: 1,
          explanation: 'The defensible practice integrates recognition, structural awareness, verification, layered protection (de-identification, minimum necessary, state and special-category law), and breach planning. Convenience, marketing claims, and name-removal alone are each insufficient.' },

        { type: 'matching', order: 6, matchingInstructions: 'Match each authoritative source to the privacy topic it most directly governs.',
          matchingPairs: [
            { term: 'HHS Office for Civil Rights — 45 CFR Part 164', definition: 'HIPAA Privacy, Security, and Breach Notification Rules' },
            { term: 'Federal Trade Commission — 16 CFR Part 318', definition: 'Health Breach Notification Rule for non-HIPAA health apps' },
            { term: 'SAMHSA — 42 CFR Part 2', definition: 'Confidentiality of substance use disorder treatment records' },
            { term: 'NIST Special Publication 800-66', definition: 'Guidance on implementing the HIPAA Security Rule' },
          ]},

        { type: 'flashcardDeck', order: 7, instructions: 'A final review of the course\'s anchoring facts. Tap each card to confirm your recall.', flashcards: [
          { id: 'f1', front: 'What are the two HIPAA de-identification methods?', back: 'Safe Harbor (remove all eighteen identifier categories, no knowledge of re-identification) and Expert Determination (a qualified expert documents very small re-identification risk).' },
          { id: 'f2', front: 'What is the HIPAA breach individual-notification deadline?', back: 'Without unreasonable delay and no later than 60 calendar days after discovery of the breach.' },
          { id: 'f3', front: 'What governs SUD treatment records beyond HIPAA?', back: '42 CFR Part 2, which generally requires patient consent even for treatment disclosures and restricts redisclosure.' },
          { id: 'f4', front: 'What is the only enforceable test of a vendor\'s "HIPAA-compliant" claim?', back: 'Whether the vendor will sign a Business Associate Agreement — and what that BAA actually says about training, retention, sub-processors, and security.' },
          { id: 'f5', front: 'What is the single most powerful privacy safeguard with AI tools?', back: 'Never sending PHI at all — through genuine de-identification and minimum-necessary inputs, so the disclosure rules never attach.' },
        ]},

        { type: 'resources', order: 8, title: 'Privacy & Compliance Resources', resources: [
          { title: 'HHS — HIPAA for Professionals', url: 'https://www.hhs.gov/hipaa/for-professionals/index.html', type: 'link', description: 'The HHS Office for Civil Rights hub for the Privacy, Security, and Breach Notification Rules, including guidance and enforcement information.' },
          { title: 'HHS — HIPAA Privacy Rule (45 CFR Part 164, Subpart E)', url: 'https://www.hhs.gov/hipaa/for-professionals/privacy/index.html', type: 'link', description: 'Official summary and text of the Privacy Rule governing the use and disclosure of protected health information.' },
          { title: 'HHS — Guidance on De-identification of PHI', url: 'https://www.hhs.gov/hipaa/for-professionals/privacy/special-topics/de-identification/index.html', type: 'link', description: 'Detailed HHS guidance on the Safe Harbor and Expert Determination methods, including the eighteen identifiers.' },
          { title: 'FTC — Health Breach Notification Rule', url: 'https://www.ftc.gov/legal-library/browse/rules/health-breach-notification-rule', type: 'link', description: 'The FTC rule (16 CFR Part 318) requiring non-HIPAA vendors of personal health records to notify consumers of breaches.' },
          { title: 'FTC — Health Privacy Guidance for Businesses', url: 'https://www.ftc.gov/business-guidance/privacy-security/health-privacy', type: 'link', description: 'FTC resources on health data privacy, deceptive practices, and obligations for consumer health apps.' },
          { title: 'ONC — Health IT Privacy and Security', url: 'https://www.healthit.gov/topic/privacy-security-and-hipaa', type: 'link', description: 'Office of the National Coordinator for Health IT guidance on privacy, security, and HIPAA in health technology.' },
          { title: 'NIST — Special Publication 800-66 (HIPAA Security Rule)', url: 'https://csrc.nist.gov/pubs/sp/800/66/r2/final', type: 'link', description: 'NIST guidance on implementing the HIPAA Security Rule, including risk analysis and safeguard implementation.' },
          { title: 'SAMHSA — 42 CFR Part 2 (Confidentiality of SUD Records)', url: 'https://www.samhsa.gov/about-us/who-we-are/laws-regulations/confidentiality-regulations-faqs', type: 'link', description: 'SAMHSA resources on the confidentiality regulations governing substance use disorder treatment records.' },
          { title: 'HHS — Breach Notification Rule', url: 'https://www.hhs.gov/hipaa/for-professionals/breach-notification/index.html', type: 'link', description: 'Official guidance on breach notification obligations, including the 60-day deadline and reporting thresholds.' },
          { title: 'APA — Record Keeping Guidelines', url: 'https://www.apa.org/practice/guidelines/record-keeping', type: 'link', description: 'American Psychological Association guidelines on the maintenance, security, and disposal of clinical records.' },
        ]},

        { type: 'fillInBlank', order: 9, title: 'Lock In the Commitments', blanks: [
          { prompt: 'Before any AI input, I will pause to ask where the ______ goes.', answer: 'data', acceptAlternates: ['PHI', 'information'] },
          { prompt: 'I will not let any tool touch PHI without a signed ______.', answer: 'BAA', acceptAlternates: ['Business Associate Agreement', 'business associate agreement'] },
          { prompt: 'For substance use records, I will apply the stricter 42 CFR Part ______ analysis.', answer: '2', acceptAlternates: ['two'] },
        ]},

        { type: 'reflection', order: 10, question: 'Name three concrete commitments you will make in the next thirty days to protect client information when using AI tools. Be specific: which tool will you stop using, which BAA will you obtain, and which workflow will you redesign to de-identify inputs?' },

        { type: 'keyTakeaway', order: 11, title: 'Key Takeaways', takeaways: [
          'A defensible AI privacy practice rests on four habits: recognition of the decision point, structural awareness of HIPAA roles, verification of vendors and BAAs, and layered protection.',
          'The ninety-second pause before any AI input — "Is there PHI here? Where does it go? Is it bound? Is a stricter law in play?" — prevents most AI privacy failures.',
          'Authoritative sources are HHS (45 CFR Part 164), the FTC (16 CFR Part 318), SAMHSA (42 CFR Part 2), ONC, NIST (SP 800-66), and the APA record-keeping guidelines.',
          'The most powerful safeguard is never sending PHI at all, through genuine de-identification and minimum-necessary inputs.',
          'Turn this course into action with concrete commitments: stop using one unbound tool, obtain one missing BAA, and redesign one workflow to de-identify inputs.',
        ]},
      ],
    },
  ],

  assessment: {
    passingScore: 80,
    passThreshold: 0.8,
    maxAttempts: 3,
    questions: [
      { type: 'multipleChoice', question: 'When a clinician pastes a client\'s identifiable clinical narrative into a public AI chatbot, what has occurred under HIPAA?',
        options: [
          { text: 'Nothing regulated, because no insurance claim was filed', isCorrect: false },
          { text: 'A disclosure of PHI to an outside party requiring a lawful basis', isCorrect: true },
          { text: 'A permitted internal use within the practice', isCorrect: false },
          { text: 'An automatic de-identification event', isCorrect: false },
        ], correctAnswer: 1,
        explanation: 'Sending identifiable health information to an external AI company is a disclosure of PHI, which requires a lawful basis such as a BAA or authorization. The regulated status travels with the information regardless of the interface.' },

      { type: 'multipleChoice', question: 'Which HIPAA rule governs how electronic protected health information (ePHI) must be safeguarded?',
        options: [
          { text: 'The Privacy Rule', isCorrect: false },
          { text: 'The Security Rule', isCorrect: true },
          { text: 'The Enforcement Rule', isCorrect: false },
          { text: 'The Omnibus Rule', isCorrect: false },
        ], correctAnswer: 1,
        explanation: 'The Security Rule (45 CFR Part 164, Subparts A and C) establishes the administrative, physical, and technical safeguards required for ePHI.' },

      { type: 'multipleChoice', question: 'An AI vendor that processes client PHI on a clinician\'s behalf is best classified as a:',
        options: [
          { text: 'Covered entity', isCorrect: false },
          { text: 'Business associate requiring a BAA', isCorrect: true },
          { text: 'Neutral utility outside HIPAA', isCorrect: false },
          { text: 'Health care clearinghouse', isCorrect: false },
        ], correctAnswer: 1,
        explanation: 'A vendor performing a service involving PHI on behalf of a covered entity is a business associate and may lawfully receive PHI only under a Business Associate Agreement.' },

      { type: 'multipleChoice', question: 'Why are most consumer wellness and "AI therapist" apps generally NOT covered by HIPAA?',
        options: [
          { text: 'Because they encrypt all data', isCorrect: false },
          { text: 'Because HIPAA coverage depends on who holds the data, and no covered entity is in the relationship', isCorrect: true },
          { text: 'Because they are too small to regulate', isCorrect: false },
          { text: 'Because mental health data is exempt from HIPAA', isCorrect: false },
        ], correctAnswer: 1,
        explanation: 'HIPAA applies to covered entities and their business associates. A consumer using an app independently has no covered entity in the relationship, so the app sits in the consumer-app gap outside HIPAA.' },

      { type: 'multipleChoice', question: 'Which federal rule requires non-HIPAA vendors of personal health records to notify consumers of breaches?',
        options: [
          { text: 'The HIPAA Breach Notification Rule', isCorrect: false },
          { text: 'The FTC Health Breach Notification Rule (16 CFR Part 318)', isCorrect: true },
          { text: 'The Gramm-Leach-Bliley Act', isCorrect: false },
          { text: '42 CFR Part 2', isCorrect: false },
        ], correctAnswer: 1,
        explanation: 'The FTC Health Breach Notification Rule (16 CFR Part 318) covers vendors of personal health records that are not subject to HIPAA, including many health apps.' },

      { type: 'multipleChoice', question: 'What does the marketing phrase "HIPAA-compliant" reliably establish about an AI tool?',
        options: [
          { text: 'That a government agency certified it', isCorrect: false },
          { text: 'Nothing by itself — there is no certifying authority; the enforceable test is whether the vendor will sign a BAA', isCorrect: true },
          { text: 'That it never retains any data', isCorrect: false },
          { text: 'That it is exempt from the Security Rule', isCorrect: false },
        ], correctAnswer: 1,
        explanation: 'No agency certifies software as "HIPAA-compliant." The phrase is a self-claim. The concrete test is whether the vendor will sign a Business Associate Agreement and what that agreement says.' },

      { type: 'multipleChoice', question: 'Under 45 CFR 164.504(e), which clause in an AI vendor\'s BAA most directly addresses whether your clients\' data could train the vendor\'s model?',
        options: [
          { text: 'The indemnification clause', isCorrect: false },
          { text: 'The permitted uses and disclosures clause', isCorrect: true },
          { text: 'The governing-law clause', isCorrect: false },
          { text: 'The force-majeure clause', isCorrect: false },
        ], correctAnswer: 1,
        explanation: 'The permitted uses and disclosures clause defines what the business associate may do with PHI, including whether it may use inputs to train or improve its models.' },

      { type: 'multipleChoice', question: 'A signed BAA with an AI vendor is best described as:',
        options: [
          { text: 'Sufficient on its own to guarantee compliance', isCorrect: false },
          { text: 'Necessary but not sufficient — it must be paired with verification of actual practices', isCorrect: true },
          { text: 'Optional if the vendor is well known', isCorrect: false },
          { text: 'A substitute for the Security Rule', isCorrect: false },
        ], correctAnswer: 1,
        explanation: 'A BAA allocates legal responsibility but does not by itself make a vendor\'s real practices safe. Due diligence on training, retention, sub-processors, and security is also required.' },

      { type: 'multipleChoice', question: 'Which is generally the safest approach to using an AI tool with client-related information?',
        options: [
          { text: 'Send full identifiers so the AI gives better answers', isCorrect: false },
          { text: 'Ensure the tool never receives PHI through genuine de-identification or minimum-necessary inputs', isCorrect: true },
          { text: 'Rely on the tool being marketed as secure', isCorrect: false },
          { text: 'Use the free consumer tier to save money', isCorrect: false },
        ], correctAnswer: 1,
        explanation: 'If the input is genuinely de-identified or limited to the minimum necessary, the disclosure rules for PHI do not attach in the same way, dramatically reducing risk.' },

      { type: 'multipleChoice', question: 'Under the Safe Harbor method, information is de-identified when:',
        options: [
          { text: 'The client\'s last name is removed', isCorrect: false },
          { text: 'All eighteen specified identifier categories are removed and there is no knowledge that re-identification remains possible', isCorrect: true },
          { text: 'The clinician believes it is "anonymous enough"', isCorrect: false },
          { text: 'The data is encrypted', isCorrect: false },
        ], correctAnswer: 1,
        explanation: 'Safe Harbor requires removing all eighteen categories of identifiers and having no actual knowledge that the remaining information could identify the individual. Encryption and informal disguising do not satisfy it.' },

      { type: 'multipleChoice', question: 'Why does informally "disguising" a case (removing the name but keeping age, profession, town size, and a distinctive problem) fail to de-identify it?',
        options: [
          { text: 'Because the name is the only identifier that matters', isCorrect: false },
          { text: 'Because the remaining details can still reasonably identify a specific individual', isCorrect: true },
          { text: 'Because Expert Determination forbids it', isCorrect: false },
          { text: 'It does not fail — disguising always works', isCorrect: false },
        ], correctAnswer: 1,
        explanation: 'A rich narrative with age, profession, location, and a distinctive presenting problem can point to one identifiable person, so removing only the name does not meet Safe Harbor or Expert Determination.' },

      { type: 'multipleChoice', question: '42 CFR Part 2 differs from HIPAA primarily because it:',
        options: [
          { text: 'Applies only to insurance companies', isCorrect: false },
          { text: 'Provides stricter protection for SUD records, generally requiring consent even for treatment disclosures and restricting redisclosure', isCorrect: true },
          { text: 'Permits all disclosures without consent', isCorrect: false },
          { text: 'Has been fully repealed', isCorrect: false },
        ], correctAnswer: 1,
        explanation: '42 CFR Part 2 protects substance use disorder treatment records more strictly than HIPAA, generally requiring patient consent even for treatment and limiting redisclosure.' },

      { type: 'multipleChoice', question: 'The California Confidentiality of Medical Information Act (CMIA) illustrates which principle?',
        options: [
          { text: 'Federal law always preempts state privacy law', isCorrect: false },
          { text: 'State laws may be stricter than HIPAA and must also be followed', isCorrect: true },
          { text: 'State laws never apply to behavioral health', isCorrect: false },
          { text: 'HIPAA is the ceiling, not the floor', isCorrect: false },
        ], correctAnswer: 1,
        explanation: 'HIPAA is a federal floor. State laws such as CMIA can be more protective and must be complied with in addition to HIPAA.' },

      { type: 'multipleChoice', question: 'Under the HIPAA Breach Notification Rule, affected individuals must be notified:',
        options: [
          { text: 'Within 24 hours of discovery', isCorrect: false },
          { text: 'Without unreasonable delay and no later than 60 calendar days after discovery', isCorrect: true },
          { text: 'Within one year of discovery', isCorrect: false },
          { text: 'Only if the breach exceeds 5,000 people', isCorrect: false },
        ], correctAnswer: 1,
        explanation: 'The Breach Notification Rule requires notifying affected individuals without unreasonable delay and no later than 60 calendar days after discovery of the breach.' },

      { type: 'multipleChoice', question: 'Which step comes FIRST in a sound breach-response sequence?',
        options: [
          { text: 'Notify the media', isCorrect: false },
          { text: 'Contain the exposure and preserve logs and evidence', isCorrect: true },
          { text: 'Remediate the root cause', isCorrect: false },
          { text: 'Mitigate harm to clients', isCorrect: false },
        ], correctAnswer: 1,
        explanation: 'Containment and evidence preservation come first to stop the exposure and protect the record needed for assessment, before risk assessment, notification, mitigation, and remediation.' },

      { type: 'multipleChoice', question: 'A breach of PHI that was properly encrypted may:',
        options: [
          { text: 'Always trigger full notification regardless', isCorrect: false },
          { text: 'Not trigger breach-notification obligations, because the data was unreadable', isCorrect: true },
          { text: 'Require notifying the FBI within 24 hours', isCorrect: false },
          { text: 'Automatically result in license revocation', isCorrect: false },
        ], correctAnswer: 1,
        explanation: 'The Breach Notification Rule applies to unsecured PHI. Properly encrypted PHI may render data unreadable and may not constitute a reportable breach, which is a key reason encryption is foundational.' },

      { type: 'multipleChoice', question: 'The "ninety-second pause" the course recommends before any AI input is intended to surface which questions?',
        options: [
          { text: 'Is the tool popular and convenient?', isCorrect: false },
          { text: 'Is there PHI here, where does it go, is the destination bound, and is a stricter law in play?', isCorrect: true },
          { text: 'Is the output clinically impressive?', isCorrect: false },
          { text: 'Did a colleague recommend it?', isCorrect: false },
        ], correctAnswer: 1,
        explanation: 'The pause is designed to make the invisible decision point visible: identifying PHI, the data destination, whether that destination is bound, and whether stricter state or special-category law applies.' },
    ],
  },

  references: [
    'U.S. Department of Health and Human Services. (2013). HIPAA Privacy Rule, 45 C.F.R. Part 164, Subpart E. Office for Civil Rights.',
    'U.S. Department of Health and Human Services. (2013). HIPAA Security Rule, 45 C.F.R. Part 164, Subparts A and C. Office for Civil Rights.',
    'U.S. Department of Health and Human Services. (2013). HIPAA Breach Notification Rule, 45 C.F.R. §§ 164.400–414. Office for Civil Rights.',
    'U.S. Department of Health and Human Services. (2012). Guidance regarding methods for de-identification of protected health information in accordance with the HIPAA Privacy Rule (45 C.F.R. § 164.514). Office for Civil Rights.',
    'U.S. Department of Health and Human Services. (2013). Business associate contracts: Sample business associate agreement provisions, 45 C.F.R. § 164.504(e). Office for Civil Rights.',
    'Federal Trade Commission. (2024). Health Breach Notification Rule, 16 C.F.R. Part 318. Washington, DC: Author.',
    'Federal Trade Commission. (2021). Statement of the Commission on breaches by health apps and other connected devices. Washington, DC: Author.',
    'Federal Trade Commission. (2023). Protecting consumers\' health privacy: Business guidance on health data. Washington, DC: Author.',
    'National Institute of Standards and Technology. (2024). Implementing the HIPAA Security Rule: A cybersecurity resource guide (NIST Special Publication 800-66, Rev. 2). Gaithersburg, MD: Author.',
    'Office of the National Coordinator for Health Information Technology. (2023). Privacy, security, and HIPAA. Washington, DC: U.S. Department of Health and Human Services.',
    'Substance Abuse and Mental Health Services Administration. (2024). Confidentiality of substance use disorder patient records, 42 C.F.R. Part 2. Washington, DC: U.S. Department of Health and Human Services.',
    'California Legislature. (2024). Confidentiality of Medical Information Act, Cal. Civ. Code §§ 56–56.37. Sacramento, CA: Author.',
    'American Counseling Association. (2014). ACA code of ethics. Alexandria, VA: Author.',
    'National Board for Certified Counselors. (2023). NBCC code of ethics. Greensboro, NC: Author.',
    'American Psychological Association. (2007). Record keeping guidelines. American Psychologist, 62(9), 993–1004.',
    'U.S. Department of Health and Human Services. (2009). Health Information Technology for Economic and Clinical Health (HITECH) Act, 42 U.S.C. §§ 17921–17954. Washington, DC: Author.',
    'National Institute of Standards and Technology. (2023). Artificial intelligence risk management framework (AI RMF 1.0). Gaithersburg, MD: Author.',
  ],

  resources: [
    { title: 'HHS — HIPAA for Professionals', url: 'https://www.hhs.gov/hipaa/for-professionals/index.html', type: 'link', description: 'Central HHS Office for Civil Rights resource for the Privacy, Security, and Breach Notification Rules.' },
    { title: 'FTC — Health Breach Notification Rule', url: 'https://www.ftc.gov/legal-library/browse/rules/health-breach-notification-rule', type: 'link', description: 'The FTC rule governing breach notification for non-HIPAA vendors of personal health records.' },
    { title: 'SAMHSA — 42 CFR Part 2 Confidentiality Regulations', url: 'https://www.samhsa.gov/about-us/who-we-are/laws-regulations/confidentiality-regulations-faqs', type: 'link', description: 'Guidance on the heightened confidentiality protections for substance use disorder treatment records.' },
    { title: 'NIST — SP 800-66 Rev. 2 (HIPAA Security Rule)', url: 'https://csrc.nist.gov/pubs/sp/800/66/r2/final', type: 'link', description: 'NIST guidance on implementing the HIPAA Security Rule, including risk analysis and safeguards.' },
    { title: 'ONC — Privacy, Security, and HIPAA', url: 'https://www.healthit.gov/topic/privacy-security-and-hipaa', type: 'link', description: 'Office of the National Coordinator resources on privacy and security in health information technology.' },
    { title: 'HHS — De-identification of PHI Guidance', url: 'https://www.hhs.gov/hipaa/for-professionals/privacy/special-topics/de-identification/index.html', type: 'link', description: 'Detailed guidance on Safe Harbor and Expert Determination de-identification methods.' },
  ],
};

function stripHtml(h){return(h||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();}
function countWords(s){return stripHtml(s).split(/\s+/).filter(Boolean).length;}
function validate(course){
  const errors=[],warnings=[];
  let total=0;
  (course.sections||[]).forEach(s=>{(s.contentBlocks||[]).forEach(b=>{
    total+=countWords(b.content||'')+countWords(b.question||'')+countWords(b.explanation||'')+countWords(b.subtitle||'')+countWords(b.title||'')+countWords(b.instructions||'')+countWords(b.matchingInstructions||'');
    (b.accordionItems||[]).forEach(a=>{total+=countWords(a.title)+countWords(a.content);});
    (b.flashcards||[]).forEach(f=>{total+=countWords(f.front)+countWords(f.back);});
    (b.matchingPairs||[]).forEach(p=>{total+=countWords(p.term)+countWords(p.definition);});
    (b.options||[]).forEach(o=>{total+=countWords(typeof o==='object'?o.text:o);});
    (b.cards||[]).forEach(c=>{total+=countWords(c.text);});
    (b.takeaways||[]).forEach(t=>{total+=countWords(t);});
    (b.steps||[]).forEach(st=>{total+=countWords(st.text);});
    (b.blanks||[]).forEach(bl=>{total+=countWords(bl.prompt)+countWords(bl.answer);});
    if(b.nodes){const nv=Array.isArray(b.nodes)?b.nodes:Object.values(b.nodes);nv.forEach(n=>{total+=countWords(n.text||'');(n.choices||[]).forEach(ch=>total+=countWords(ch.text||''));});}
  });});
  const req=course.ceHours*6000;
  if(total<req) errors.push(`Word count ${total} < ${req}`);
  else console.log(`✅ Words: ${total.toLocaleString()}/${req.toLocaleString()}`);
  (course.sections||[]).forEach((s,i)=>{
    const b=s.contentBlocks||[];
    if(!b[0]||b[0].type!=='sectionDivider') errors.push(`Sec ${i+1} no sectionDivider first`);
    if(b[0]&&(!b[0].title||!b[0].subtitle)) errors.push(`Sec ${i+1} divider missing title/subtitle`);
    b.forEach((blk,bi)=>{if(blk.type==='multipleChoice'||blk.type==='multiSelect'){if(!Array.isArray(blk.options)||typeof blk.options[0]!=='object') errors.push(`Sec ${i+1} blk ${bi+1}: flat options`);}});
  });
  if((course.assessment?.questions||[]).length<15) errors.push(`Assessment <15 Qs`);
  if(course.assessment?.passingScore!==80) errors.push('passingScore≠80');
  if(course.maxAttempts!==3) errors.push('maxAttempts≠3');
  if((course.references||[]).length<15) errors.push(`Refs: ${(course.references||[]).length}<15`);
  else console.log(`✅ Refs: ${course.references.length}`);
  return{errors,warnings,total};
}
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
