/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// updateVideoLessons.js
// Run in Render Shell: node updateVideoLessons.js
// This script updates the 14 video placeholder lessons with full text content

const mongoose = require('mongoose');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Lesson Schema (matches your existing schema)
const lessonSchema = new mongoose.Schema({
  title: String,
  type: String,
  content: String,
  videoUrl: String,
  duration: Number,
  order: Number
}, { strict: false });

const moduleSchema = new mongoose.Schema({
  title: String,
  description: String,
  order: Number,
  lessons: [lessonSchema]
}, { strict: false });

const courseSchema = new mongoose.Schema({
  title: String,
  modules: [moduleSchema]
}, { strict: false });

const Course = mongoose.model('Course', courseSchema);

// ============================================
// LESSON CONTENT DATA
// ============================================

const lessonUpdates = {
  // COURSE 1: Existential Theory
  "Existential Theory in Clinical Practice": {
    "Video Case Study: Complete Existential Session": {
      content: `<div class="lesson-content">
<h2>Complete Existential Therapy Session: A Case Demonstration</h2>

<div class="intro-box">
<h3>Why This Matters</h3>
<p>This lesson bridges theory and practice through detailed case analysis. Observing a complete existential session allows clinicians to see how philosophical concepts manifest in actual therapeutic dialogue. Many practitioners report that existential ideas resonate intellectually but feel uncertain about implementation—this case study addresses that gap directly.</p>
<p>Understanding existential therapy in action is essential because clients increasingly present with concerns that defy simple diagnostic categorization: pervasive emptiness despite external success, paralysis in the face of life choices, profound loneliness even within relationships. These presentations call for therapeutic approaches that honor the depth of human experience rather than pathologizing it.</p>
</div>

<h3>Case Background: Sarah, Age 34</h3>
<p>Sarah presents with feelings of emptiness and meaninglessness following a successful corporate career. Despite external achievements, she reports feeling disconnected from her life and questioning whether her choices have been authentic. She describes a persistent sense that she is "going through the motions" without genuine engagement.</p>

<h3>Session Opening: Establishing Presence</h3>
<p>The session begins with the therapist establishing authentic presence. Rather than immediately pursuing an agenda, the therapist creates space for Sarah to bring whatever feels most pressing. This reflects the existential emphasis on being-with rather than doing-to the client.</p>
<p><strong>Therapeutic Stance:</strong> The therapist demonstrates what Yalom calls "horizontal" rather than "vertical" relating—meeting Sarah as a fellow human grappling with universal concerns rather than as an expert diagnosing pathology.</p>

<h3>Exploring the Four Ultimate Concerns</h3>
<p><strong>Death Awareness:</strong> Sarah mentions her father's recent health scare. The therapist explores how this has affected her sense of time and priorities, without rushing to reassurance. Confronting mortality often catalyzes authentic living.</p>
<p><strong>Freedom and Responsibility:</strong> When Sarah expresses feeling "trapped" by her career, the therapist gently explores the choices that led here. This helps Sarah recognize her agency while acknowledging real constraints.</p>
<p><strong>Isolation:</strong> Sarah describes feeling fundamentally alone despite being surrounded by colleagues. The therapist validates this existential isolation while also modeling genuine connection in the therapeutic relationship.</p>
<p><strong>Meaninglessness:</strong> Rather than prescribing meaning, the therapist helps Sarah explore what matters to her—not what should matter based on external standards.</p>

<h3>Key Interventions Demonstrated</h3>
<p><strong>Phenomenological Inquiry:</strong> The therapist asks, "What is it like for you right now, sitting with these questions?" This grounds the discussion in immediate experience rather than abstract intellectualization.</p>
<p><strong>Bracketing:</strong> The therapist sets aside preconceptions about what Sarah "should" want or feel, remaining curious about her unique experience.</p>
<p><strong>Confrontation with Compassion:</strong> When Sarah deflects responsibility, the therapist gently but firmly brings attention to this pattern: "I notice you describe this as something that happened to you. I wonder about the choices along the way."</p>

<h3>Working with Anxiety</h3>
<p>Existential anxiety emerges as Sarah confronts the reality that she alone must author her life. Rather than treating this anxiety as pathological, the therapist frames it as a signal of awakening—the discomfort of recognizing freedom and responsibility.</p>
<p>The therapist helps Sarah distinguish between:</p>
<ul>
<li><strong>Neurotic anxiety:</strong> Avoidance-based, limiting, arising from self-deception</li>
<li><strong>Existential anxiety:</strong> Growth-oriented, inevitable, arising from authentic confrontation with life</li>
</ul>

<h3>Session Closing: Integration</h3>
<p>The session concludes not with solutions but with Sarah sitting more fully with her questions. She identifies one small way she might live more authentically in the coming week—not as homework but as an experiment in presence.</p>

<h3>Clinical Application Questions</h3>
<ol>
<li>How do you manage your own existential anxiety when clients raise ultimate concerns?</li>
<li>What helps you maintain authentic presence when the urge to "fix" arises?</li>
<li>How might your theoretical orientation complement or conflict with existential principles?</li>
<li>What client presentations in your current caseload might benefit from existential exploration?</li>
</ol>

<h3>Key Takeaways</h3>
<p>Existential therapy is less about technique and more about stance. The therapist's willingness to sit with uncertainty, to engage authentically, and to honor the client's freedom creates conditions for meaningful change. Sarah leaves not with answers but with a renewed sense that her questions matter and that she has the capacity to engage with them.</p>
</div>`
    }
  },

  // COURSE 2: Mental Health Billing Essentials  
  "Mental Health Billing Essentials for Licensed Professional Counselors": {
    "The Billing Cycle and Revenue Management": {
      content: `<div class="lesson-content">
<h2>The Billing Cycle and Revenue Management for Mental Health Practices</h2>

<div class="intro-box">
<h3>Why This Matters</h3>
<p>Understanding the complete billing cycle transforms reactive problem-solving into proactive revenue management. Many clinicians experience billing as a series of frustrations—denied claims, delayed payments, confused clients—without recognizing how these issues connect to specific cycle breakdowns.</p>
<p>This lesson maps the entire revenue cycle, identifying where problems typically originate and how systematic processes prevent them. Research indicates that practices with documented billing workflows experience 23% fewer claim denials and collect payments 15 days faster on average.</p>
</div>

<h3>Overview of the Revenue Cycle</h3>
<p>The revenue cycle encompasses all administrative and clinical functions that contribute to capturing, managing, and collecting patient service revenue. For mental health practices, this cycle has unique considerations due to the nature of services provided and payer requirements.</p>

<h3>Phase 1: Pre-Service (Client Intake)</h3>
<p><strong>Insurance Verification:</strong> Before the first session, verify:</p>
<ul>
<li>Active coverage and effective dates</li>
<li>Mental health benefits (often separate from medical benefits)</li>
<li>In-network or out-of-network status</li>
<li>Copay, coinsurance, and deductible amounts</li>
<li>Session limits or prior authorization requirements</li>
<li>Telehealth coverage specifications</li>
</ul>
<p><strong>Collecting Client Information:</strong> Accurate demographic and insurance information prevents claim denials. Implement a standard intake form that captures all required billing fields.</p>

<h3>Phase 2: Service Delivery and Documentation</h3>
<p>Clinical documentation directly impacts billing success. Each session note must support:</p>
<ul>
<li>Medical necessity for the service</li>
<li>The diagnosis billed</li>
<li>The CPT code selected</li>
<li>The time spent (for time-based codes)</li>
</ul>
<p><strong>Documentation Best Practices:</strong></p>
<ul>
<li>Complete notes within 24-48 hours</li>
<li>Include presenting problem, intervention, and response</li>
<li>Document treatment plan progress</li>
<li>Note session start and stop times for time-based codes</li>
</ul>

<h3>Phase 3: Charge Capture and Claim Creation</h3>
<p>Convert services into billable claims by:</p>
<ol>
<li>Selecting appropriate CPT codes (90834, 90837, 90847, etc.)</li>
<li>Assigning diagnosis codes (ICD-10) that support medical necessity</li>
<li>Applying correct modifiers when required (95 for telehealth, etc.)</li>
<li>Verifying place of service codes (02 for telehealth, 11 for office)</li>
</ol>

<h3>Phase 4: Claim Submission</h3>
<p><strong>Timely Filing:</strong> Most payers require claims within 90-180 days. Track deadlines by payer.</p>
<p><strong>Clean Claim Rate:</strong> Aim for 95%+ clean claims (accepted on first submission). Common errors include:</p>
<ul>
<li>Incorrect client information</li>
<li>Missing or invalid diagnosis codes</li>
<li>Incorrect modifier usage</li>
<li>Duplicate claims</li>
</ul>

<h3>Phase 5: Payment Posting and Reconciliation</h3>
<p>When payments arrive:</p>
<ol>
<li>Post payments to correct client accounts</li>
<li>Verify payment matches contracted rate</li>
<li>Identify and address underpayments</li>
<li>Transfer client responsibility to client balance</li>
<li>Generate client statements for remaining balances</li>
</ol>

<h3>Phase 6: Denial Management and Appeals</h3>
<p>Denied claims require prompt attention:</p>
<ul>
<li>Review denial reason codes</li>
<li>Correct errors and resubmit if applicable</li>
<li>File appeals with supporting documentation</li>
<li>Track appeal deadlines (typically 30-60 days)</li>
</ul>

<h3>Key Performance Indicators (KPIs)</h3>
<p>Monitor these metrics monthly:</p>
<ul>
<li><strong>Days in Accounts Receivable:</strong> Target under 35 days</li>
<li><strong>Clean Claim Rate:</strong> Target 95%+</li>
<li><strong>Denial Rate:</strong> Target under 5%</li>
<li><strong>Collection Rate:</strong> Target 95%+ of expected revenue</li>
</ul>

<h3>Practice Application</h3>
<p>Develop a billing calendar that schedules: daily charge entry, weekly claim submission, bi-weekly payment posting, and monthly financial review. Consistent attention to each phase prevents revenue leakage.</p>
</div>`
    },
    
    "Provider Credentialing Process": {
      content: `<div class="lesson-content">
<h2>Provider Credentialing: Getting Paneled with Insurance Companies</h2>

<div class="intro-box">
<h3>Why This Matters</h3>
<p>Credentialing represents the gateway to serving insured clients, yet the process frustrates many clinicians with its complexity and lengthy timelines. Understanding credentialing strategically—knowing which payers to prioritize, how to expedite applications, and when to consider alternatives—transforms this administrative burden into practice-building opportunity.</p>
</div>

<h3>Understanding Credentialing vs. Contracting</h3>
<p><strong>Credentialing</strong> verifies your qualifications: education, licensure, malpractice history, and professional references. <strong>Contracting</strong> establishes the business relationship, including reimbursement rates and terms of service.</p>

<h3>Prerequisites for Credentialing</h3>
<p>Before applying, ensure you have:</p>
<ul>
<li>Active state license in good standing</li>
<li>National Provider Identifier (NPI) - both Type 1 (individual) and Type 2 (organization) if applicable</li>
<li>Professional liability insurance meeting payer minimums (typically $1M/$3M)</li>
<li>CAQH ProView profile completed and attested</li>
<li>Tax identification number (SSN or EIN)</li>
<li>Practice address that meets payer requirements</li>
</ul>

<h3>CAQH ProView: Your Universal Application</h3>
<p>CAQH ProView serves as a centralized credentialing database used by most major payers. Complete setup includes:</p>
<ol>
<li><strong>Register</strong> at proview.caqh.org</li>
<li><strong>Complete</strong> all sections: demographics, education, training, work history, licensure, malpractice history, references</li>
<li><strong>Upload</strong> supporting documents (license, DEA if applicable, malpractice certificate, W-9)</li>
<li><strong>Attest</strong> quarterly to keep profile active</li>
<li><strong>Authorize</strong> payers to access your profile</li>
</ol>

<h3>The Application Process</h3>
<p><strong>Step 1: Research Payer Requirements</strong></p>
<p>Each payer has different requirements, panel status (open/closed), and credentialing timelines. Contact provider relations departments or check websites for current information.</p>

<p><strong>Step 2: Submit Applications</strong></p>
<p>Methods vary by payer: online portals (increasingly common), CAQH-based applications, or paper applications (becoming rare).</p>

<p><strong>Step 3: Complete Primary Source Verification</strong></p>
<p>Payers verify your credentials directly with original sources: licensing boards, educational institutions, previous employers, and malpractice carriers.</p>

<p><strong>Step 4: Credentialing Committee Review</strong></p>
<p>A committee reviews your file and makes approval/denial decisions. This typically occurs monthly.</p>

<p><strong>Step 5: Contract Negotiation</strong></p>
<p>Upon approval, you receive a provider agreement. Review carefully before signing, paying attention to fee schedule and reimbursement rates, timely filing requirements, termination clauses, required authorizations, and medical necessity definitions.</p>

<h3>Timeline Expectations</h3>
<ul>
<li><strong>Medicare:</strong> 60-90 days</li>
<li><strong>Medicaid:</strong> 90-120 days (varies by state)</li>
<li><strong>Commercial Payers:</strong> 60-180 days</li>
</ul>

<h3>Common Credentialing Challenges</h3>
<p><strong>Closed Panels:</strong> Many payers have "closed" panels. Strategies include joining group practices with existing contracts, requesting panel exception for underserved specialties/areas, and checking periodically for panel reopening.</p>

<p><strong>Application Delays:</strong> Prevent delays by responding promptly to requests for additional information, keeping CAQH profile current and attested, and following up monthly on application status.</p>

<h3>Maintaining Credentials</h3>
<p>Credentialing is not one-time. Requirements include re-credentialing every 2-3 years, prompt reporting of changes (address, licensure, malpractice claims), quarterly CAQH attestation, and annual contract review.</p>
</div>`
    },
    
    "ICD-10 Diagnostic Coding": {
      content: `<div class="lesson-content">
<h2>ICD-10 Diagnostic Coding for Mental Health Professionals</h2>

<div class="intro-box">
<h3>Why This Matters</h3>
<p>Diagnostic coding serves dual purposes: clinical communication and reimbursement justification. Accurate ICD-10 coding ensures that the clinical picture documented in your notes aligns with the diagnosis submitted for payment—an alignment that protects both ethical practice and revenue integrity.</p>
</div>

<h3>ICD-10-CM Structure</h3>
<p>Mental health diagnoses fall primarily in Chapter 5 (F01-F99: Mental, Behavioral and Neurodevelopmental Disorders). The code structure:</p>
<p><strong>Format: F##.##</strong></p>
<ul>
<li>First character: Category (F for mental disorders)</li>
<li>Second and third characters: Disorder category</li>
<li>Characters after decimal: Specify type, severity, or other details</li>
</ul>

<h3>Commonly Used Code Categories</h3>
<p><strong>F30-F39: Mood Disorders</strong></p>
<ul>
<li>F32.0 - Major depressive disorder, single episode, mild</li>
<li>F32.1 - Major depressive disorder, single episode, moderate</li>
<li>F32.2 - Major depressive disorder, single episode, severe without psychotic features</li>
<li>F33.0 - Major depressive disorder, recurrent, mild</li>
<li>F33.1 - Major depressive disorder, recurrent, moderate</li>
<li>F31.9 - Bipolar disorder, unspecified</li>
</ul>

<p><strong>F40-F48: Anxiety and Stress-Related Disorders</strong></p>
<ul>
<li>F41.0 - Panic disorder</li>
<li>F41.1 - Generalized anxiety disorder</li>
<li>F43.10 - Post-traumatic stress disorder, unspecified</li>
<li>F43.21 - Adjustment disorder with depressed mood</li>
<li>F43.23 - Adjustment disorder with mixed anxiety and depressed mood</li>
</ul>

<p><strong>F10-F19: Substance-Related Disorders</strong></p>
<ul>
<li>F10.10 - Alcohol use disorder, mild</li>
<li>F10.20 - Alcohol use disorder, moderate</li>
<li>F12.10 - Cannabis use disorder, mild</li>
</ul>

<h3>Coding Principles</h3>
<p><strong>1. Code to the Highest Level of Specificity</strong></p>
<p>Always use the most specific code available. F32.1 (MDD, single episode, moderate) is preferred over F32.9 (MDD, single episode, unspecified).</p>

<p><strong>2. Code What You Treat</strong></p>
<p>The diagnosis must support medical necessity for the service. If treating anxiety, code the anxiety disorder—not a historical diagnosis you are not addressing.</p>

<p><strong>3. Severity Specifiers Matter</strong></p>
<p>Many codes require severity specification (mild, moderate, severe). Document severity consistently in clinical notes using standardized measures when possible.</p>

<h3>Supporting Medical Necessity</h3>
<p>Documentation must support the diagnosis code through symptom description matching diagnostic criteria, duration and frequency of symptoms, functional impairment, assessment tools/scores when applicable, and rule-out process for differential diagnoses.</p>

<h3>Common Coding Errors</h3>
<p><strong>Using Unspecified Codes When More Specific Options Exist:</strong> Payers increasingly deny or downcode unspecified diagnoses.</p>
<p><strong>Diagnosis-Procedure Mismatch:</strong> The diagnosis must justify the service. Family therapy (90847) requires a relational diagnosis or clear documentation of how family intervention addresses the identified patient's condition.</p>

<h3>Z Codes for Social Determinants</h3>
<p>Z codes capture circumstances affecting treatment but are not standalone billable diagnoses:</p>
<ul>
<li>Z63.0 - Problems in relationship with spouse/partner</li>
<li>Z56.9 - Unspecified problems related to employment</li>
<li>Z60.2 - Problems related to living alone</li>
</ul>
</div>`
    },
    
    "Clearinghouse Operations and Workflows": {
      content: `<div class="lesson-content">
<h2>Clearinghouse Operations: Streamlining Your Claims Process</h2>

<div class="intro-box">
<h3>Why This Matters</h3>
<p>Clearinghouses function as the invisible infrastructure of healthcare billing, yet understanding their role transforms billing efficiency. Rather than troubleshooting individual claim problems, clinicians who understand clearinghouse operations can implement systematic processes that prevent errors before they occur.</p>
</div>

<h3>What is a Clearinghouse?</h3>
<p>A clearinghouse is an electronic hub that:</p>
<ul>
<li>Receives claims from providers in various formats</li>
<li>Scrubs claims for errors before submission</li>
<li>Translates claims into payer-specific formats</li>
<li>Transmits claims to insurance companies</li>
<li>Receives and delivers remittance advice (ERAs)</li>
<li>Provides eligibility verification services</li>
</ul>

<h3>Benefits of Using a Clearinghouse</h3>
<p><strong>Error Reduction:</strong> Claims are checked against payer rules before submission, catching errors that would cause denials.</p>
<p><strong>Faster Payment:</strong> Electronic claims process in days rather than weeks for paper claims.</p>
<p><strong>Simplified Multi-Payer Billing:</strong> Submit to hundreds of payers through a single connection rather than managing separate processes for each.</p>

<h3>Clearinghouse Workflow</h3>
<p><strong>Step 1: Claim Creation</strong> - Your practice management or EHR system creates claims based on session documentation.</p>
<p><strong>Step 2: Batch Upload</strong> - Claims are uploaded to the clearinghouse, either automatically or manually.</p>
<p><strong>Step 3: Scrubbing</strong> - The clearinghouse checks each claim against HIPAA requirements, payer-specific rules, and duplicate detection.</p>
<p><strong>Step 4: Rejection Handling</strong> - Claims that fail scrubbing are returned with error codes for correction.</p>
<p><strong>Step 5: Transmission</strong> - Clean claims are transmitted to the appropriate payer.</p>
<p><strong>Step 6: Remittance Processing</strong> - ERAs return from payers through the clearinghouse.</p>

<h3>Common Clearinghouse Reports</h3>
<ul>
<li><strong>Claim Status Report:</strong> Shows where each claim stands—accepted, rejected, pending, paid, or denied</li>
<li><strong>Rejection Report:</strong> Lists claims that failed scrubbing with specific error codes</li>
<li><strong>Aging Report:</strong> Identifies claims outstanding beyond expected timeframes</li>
<li><strong>Payer Performance Report:</strong> Compares payment speed and denial rates across payers</li>
</ul>

<h3>Selecting a Clearinghouse</h3>
<p>Consider payer connections, integration with your EHR, pricing structure, support availability, and ERA/EFT capabilities.</p>

<h3>Best Practices</h3>
<p><strong>Daily:</strong> Check rejection reports, correct and resubmit rejected claims, verify acknowledgments.</p>
<p><strong>Weekly:</strong> Review aging report, follow up on claims pending over 30 days, process ERAs.</p>
</div>`
    },
    
    "Audit Preparation and Response": {
      content: `<div class="lesson-content">
<h2>Audit Preparation and Response for Mental Health Practices</h2>

<div class="intro-box">
<h3>Why This Matters</h3>
<p>Insurance audits evoke anxiety for most practitioners, yet preparation transforms audits from threats into manageable administrative events. More importantly, audit-readiness practices improve overall clinical documentation quality. The standards that satisfy auditors also represent best practices for clinical care.</p>
</div>

<h3>Types of Audits</h3>
<p><strong>Pre-Payment Review:</strong> Payer reviews claims before payment, requesting documentation to verify medical necessity.</p>
<p><strong>Post-Payment Audit:</strong> Retrospective review of paid claims to verify services were provided as billed.</p>
<p><strong>RAC Audits (Recovery Audit Contractors):</strong> Medicare-specific audits focused on identifying overpayments.</p>
<p><strong>Fraud Investigation:</strong> Triggered by specific concerns; significantly more serious than routine audits.</p>

<h3>Common Audit Triggers</h3>
<ul>
<li>Billing patterns that deviate from peers (e.g., higher rate of 90837 vs. 90834)</li>
<li>High volume of specific codes</li>
<li>Billing for services outside typical scope</li>
<li>Patient complaints or random selection</li>
</ul>

<h3>Documentation Requirements</h3>
<p><strong>Medical Necessity:</strong> Current symptoms and functional impairment, treatment goals addressing the diagnosis, intervention rationale tied to evidence-based practice, client response to treatment.</p>
<p><strong>Service Delivered:</strong> Date, start time, and duration; service type matching CPT code; who was present; modality (in-person vs. telehealth).</p>
<p><strong>Diagnosis Support:</strong> Symptoms consistent with ICD-10 code, assessment tools documenting severity, regular reassessment.</p>

<h3>Pre-Audit Preparation</h3>
<p><strong>Conduct Internal Audits:</strong> Quarterly, randomly select 10 charts and review: Does documentation support the CPT code billed? Is time documented? Does diagnosis match presenting concerns? Are treatment plans current?</p>

<h3>Responding to Audit Requests</h3>
<ol>
<li><strong>Review the Request Carefully</strong> - Note exact records requested and deadline</li>
<li><strong>Gather Documentation</strong> - Pull only records specifically requested; do not alter any documentation</li>
<li><strong>Review Before Submitting</strong> - Ensure documentation supports each claim</li>
<li><strong>Submit by Deadline</strong> - Send via secure method with tracking; keep copies</li>
</ol>

<h3>Key Takeaway</h3>
<p>The best audit defense is consistent, thorough documentation completed at the time of service. If it's not documented, it didn't happen—regardless of what actually occurred.</p>
</div>`
    },
    
    "Managing Copays, Deductibles, and Self-Pay": {
      content: `<div class="lesson-content">
<h2>Managing Copays, Deductibles, and Self-Pay Collections</h2>

<div class="intro-box">
<h3>Why This Matters</h3>
<p>Client financial responsibility conversations blend clinical and business considerations. How we discuss money affects therapeutic alliance, treatment adherence, and practice sustainability. Research shows that transparent, compassionate financial discussions actually strengthen client relationships.</p>
</div>

<h3>Understanding Client Financial Responsibility</h3>
<p><strong>Copay:</strong> Fixed amount due at each visit (e.g., $25 per session).</p>
<p><strong>Coinsurance:</strong> Percentage of allowed amount (e.g., 20% of $150 = $30).</p>
<p><strong>Deductible:</strong> Amount client pays before insurance begins covering services.</p>
<p><strong>Out-of-Pocket Maximum:</strong> Annual limit on client's total financial responsibility.</p>

<h3>Verification Best Practices</h3>
<p>At intake and periodically: Verify current benefits and accumulators, calculate estimated per-session cost, communicate clearly with the client, and document the conversation.</p>

<h3>Collection Policies</h3>
<p><strong>Collect at Time of Service:</strong> The most effective collection point. Implement card-on-file policies and clear communication about payment expectations.</p>
<p><strong>Sample Language:</strong> "Your copay of $30 is due at each session. We accept cash, check, and credit card. For your convenience, we can keep a card on file."</p>

<h3>Handling the Deductible Period</h3>
<p>Early in the calendar year, many clients have unmet deductibles. Options include collecting full fee, establishing payment plans, or adjusting session frequency while respecting financial constraints.</p>

<h3>Self-Pay Clients</h3>
<p><strong>Good Faith Estimates:</strong> The No Surprises Act requires providing self-pay clients with a Good Faith Estimate including diagnosis codes, service codes, expected frequency and duration, and total estimated cost.</p>

<h3>Managing Outstanding Balances</h3>
<p><strong>Prevention:</strong> Collect at time of service, send statements promptly, discuss balances before they grow large.</p>
<p><strong>Clinical Considerations:</strong> Growing debt can damage the therapeutic relationship and lead to premature termination. Address financial concerns directly and compassionately.</p>

<h3>Legal and Ethical Considerations</h3>
<p><strong>Waiving Copays/Deductibles:</strong> Routinely waiving client responsibility may constitute insurance fraud. Document financial hardship if reducing fees.</p>
<p><strong>Abandonment:</strong> Do not terminate clients solely for unpaid balances without proper notice and referral options.</p>
</div>`
    }
  },

  // COURSE 3: Mastering TeleMental Health (Georgia)
  "Mastering TeleMental Health": {
    "Video: Georgia Rule 135 Overview": {
      newTitle: "Georgia Rule 135 Overview",
      content: `<div class="lesson-content">
<h2>Georgia Rule 135: Telehealth Regulations for Counselors</h2>

<div class="intro-box">
<h3>Why This Matters</h3>
<p>Regulatory compliance forms the foundation of ethical telehealth practice. Georgia Rule 135-11-.01 establishes requirements that protect both clients and practitioners. Understanding the "why" behind regulations strengthens compliance—requirements for informed consent, emergency protocols, and technology standards exist because telehealth presents genuine risks that thoughtful implementation mitigates.</p>
</div>

<h3>Scope of Rule 135</h3>
<p>Rule 135 applies to all Georgia-licensed counselors providing telehealth services, whether the client is located in Georgia or another jurisdiction where the counselor holds licensure.</p>

<h3>Definition of Telehealth Under Georgia Law</h3>
<p>Telehealth is defined as the delivery of counseling services using interactive audio, video, or other electronic media. This includes synchronous video sessions (real-time interaction), audio-only sessions (telephone) under specific conditions, and asynchronous services (store-and-forward) with limitations.</p>

<h3>Core Requirements</h3>
<p><strong>1. Licensure Requirements</strong></p>
<p>Counselors must hold an active Georgia LPC, LAPC, LMFT, or LAMFT license in good standing with no restrictions that would prohibit telehealth practice.</p>

<p><strong>2. Technology Standards</strong></p>
<p>The technology platform must provide HIPAA-compliant security and encryption, support real-time interactive communication, include safeguards against unauthorized access, and maintain confidentiality of client information.</p>

<p><strong>3. Informed Consent Requirements</strong></p>
<p>Before initiating telehealth services, obtain informed consent addressing: nature of telehealth services, technology requirements, potential risks, emergency procedures, alternatives to telehealth, fee structure, and between-session contact procedures.</p>

<p><strong>4. Client Identity Verification</strong></p>
<p>Counselors must verify client identity at each session through visual confirmation via video, code words or security questions, or photo ID verification at intake.</p>

<p><strong>5. Location Documentation</strong></p>
<p>Document the client's physical location at each session. This determines applicable laws, emergency response jurisdiction, and mandatory reporting requirements.</p>

<h3>Emergency Protocols</h3>
<p>Rule 135 requires established emergency procedures including: collection of client's physical address at each session, identification of local emergency contacts, emergency contact information for client's location, protocol for technology failures during crisis, and backup communication methods.</p>

<h3>Compliance Checklist</h3>
<ol>
<li>Active Georgia license in good standing</li>
<li>HIPAA-compliant telehealth platform</li>
<li>Telehealth-specific informed consent signed</li>
<li>Emergency protocol established</li>
<li>Client location documented each session</li>
<li>Identity verification procedures in place</li>
<li>Interstate licensure verified if applicable</li>
</ol>
</div>`
    },
    
    "Video: Ethical Decision Making in Telehealth": {
      newTitle: "Ethical Decision Making in Telehealth",
      content: `<div class="lesson-content">
<h2>Ethical Decision Making in Telehealth Practice</h2>

<div class="intro-box">
<h3>Why This Matters</h3>
<p>Telehealth creates ethical terrain that existing codes and training may not fully address. Questions arise that have no clear precedent: How do we maintain boundaries when seeing into clients' homes? What are our obligations when technology fails during a crisis disclosure? This lesson applies established ethical frameworks to telehealth-specific dilemmas.</p>
</div>

<h3>Foundational Ethical Principles</h3>
<p>The ACA Code of Ethics and state regulations provide the foundation for telehealth ethics:</p>
<ul>
<li><strong>Beneficence:</strong> Acting in the client's best interest, including determining when telehealth is appropriate</li>
<li><strong>Nonmaleficence:</strong> Avoiding harm, including technology-related risks and boundary violations</li>
<li><strong>Autonomy:</strong> Supporting client self-determination through informed consent and choice</li>
<li><strong>Justice:</strong> Ensuring equitable access to services</li>
<li><strong>Fidelity:</strong> Maintaining trust and professional boundaries in the virtual environment</li>
</ul>

<h3>Boundary Considerations</h3>
<p><strong>Physical Space Boundaries:</strong> Maintain professional environment visible on camera, avoid sessions from inappropriate locations, set expectations about client environment.</p>
<p><strong>Time Boundaries:</strong> Start and end on time despite informal setting, establish between-session communication policies, define response times for messages.</p>
<p><strong>Relationship Boundaries:</strong> Screen-mediated intimacy can create false familiarity; maintain professional demeanor despite casual setting; navigate "seeing into" each other's homes appropriately.</p>

<h3>Ethical Decision-Making Framework</h3>
<p>When facing telehealth ethical dilemmas, apply this framework:</p>
<ol>
<li><strong>Identify the ethical issue</strong> - What principles are in tension?</li>
<li><strong>Review relevant codes and laws</strong> - What do ACA ethics, state rules require?</li>
<li><strong>Consider stakeholders</strong> - Who is affected and how?</li>
<li><strong>Generate options</strong> - What are possible courses of action?</li>
<li><strong>Evaluate options</strong> - Apply ethical principles to each option</li>
<li><strong>Decide and document</strong> - Choose the most ethical course, document rationale</li>
<li><strong>Reflect</strong> - After implementation, assess the outcome</li>
</ol>
</div>`
    },
    
    "Video: Platform Comparison and Setup": {
      newTitle: "Platform Comparison and Setup",
      content: `<div class="lesson-content">
<h2>Telehealth Platform Comparison and Setup Guide</h2>

<div class="intro-box">
<h3>Why This Matters</h3>
<p>Technology selection impacts every aspect of telehealth practice—from clinical effectiveness to compliance to client experience. The goal is technology that disappears into the background, supporting rather than interfering with clinical work.</p>
</div>

<h3>Platform Selection Criteria</h3>
<p><strong>HIPAA Compliance:</strong> Willingness to sign Business Associate Agreement (BAA), end-to-end encryption, secure data storage practices, access controls and audit logs.</p>
<p><strong>Functionality:</strong> Video and audio quality, screen sharing, virtual waiting room, session recording options, EHR integration.</p>
<p><strong>Client Experience:</strong> Ease of access (no download required is ideal), mobile compatibility, technical requirements, accessibility features.</p>

<h3>Platform Comparison</h3>
<p><strong>SimplePractice Telehealth:</strong> Integrated with SimplePractice EHR, HIPAA-compliant with BAA, browser-based, included with subscription ($69-99/month).</p>
<p><strong>Doxy.me:</strong> Free tier available, HIPAA-compliant with BAA, browser-based, free to $35/month.</p>
<p><strong>Zoom for Healthcare:</strong> HIPAA-compliant version (not standard Zoom), robust features, requires client download, $200+/year.</p>

<h3>Setup Checklist</h3>
<p><strong>Technical Setup:</strong></p>
<ul>
<li>Test internet speed (minimum 10 Mbps recommended)</li>
<li>Use wired ethernet connection when possible</li>
<li>Position camera at eye level</li>
<li>Ensure adequate front-facing lighting</li>
<li>Use external microphone or quality headset</li>
</ul>

<p><strong>Environment Setup:</strong></p>
<ul>
<li>Choose professional, neutral background</li>
<li>Remove distracting or personal items from view</li>
<li>Ensure private space free from interruption</li>
<li>Post "Session in Progress" signage</li>
<li>Disable notifications on devices</li>
</ul>

<p><strong>Administrative Setup:</strong></p>
<ul>
<li>Execute Business Associate Agreement</li>
<li>Configure waiting room settings</li>
<li>Set up session reminders</li>
<li>Create backup communication protocol</li>
<li>Document platform in informed consent</li>
</ul>

<h3>Security Best Practices</h3>
<p>Use unique meeting links, enable waiting room feature, lock session after client joins, do not record without explicit consent, log out after each session.</p>
</div>`
    },
    
    "Video: Role-Playing Crisis Scenarios": {
      newTitle: "Crisis Protocols for Telehealth Practice",
      content: `<div class="lesson-content">
<h2>Crisis Protocols for Telehealth Practice</h2>

<div class="intro-box">
<h3>Why This Matters</h3>
<p>Crisis response in telehealth requires adapted protocols that account for physical distance and technology mediation. The clinician cannot physically intervene, may not know the client's precise location, and depends on technology that can fail at critical moments. These realities demand proactive preparation rather than reactive improvisation.</p>
</div>

<h3>The Unique Challenges of Telehealth Crisis Response</h3>
<ul>
<li><strong>Physical distance:</strong> You cannot physically prevent self-harm or provide hands-on support</li>
<li><strong>Location uncertainty:</strong> Client may not be where you expect them to be</li>
<li><strong>Technology dependence:</strong> Connection can fail at critical moments</li>
<li><strong>Environmental unknowns:</strong> You cannot fully assess the client's surroundings</li>
<li><strong>Delayed emergency response:</strong> Dispatching help takes longer when you're not on-site</li>
</ul>

<h3>Pre-Crisis Preparation: Required Information</h3>
<p>Collect at intake, verify each session:</p>
<ul>
<li>Client's current physical address (street address, not P.O. Box)</li>
<li>Client's cell phone number (for backup contact)</li>
<li>Emergency contact name, relationship, and phone number</li>
<li>Local police non-emergency number for client's jurisdiction</li>
<li>Local crisis line number for client's area</li>
<li>Nearest emergency room with psychiatric services</li>
<li>Client's primary care provider contact information</li>
<li>Current medications and prescribing physician</li>
</ul>

<h3>Session-Start Protocol</h3>
<p>At the beginning of EVERY telehealth session, confirm:</p>
<ol>
<li>"Can you confirm your current location/address for me today?"</li>
<li>"Is your emergency contact information still [name, number]?"</li>
<li>"Do you have your phone nearby in case we get disconnected?"</li>
</ol>

<h3>Crisis Response Protocol: Step-by-Step</h3>

<h4>Level 1: Client Expresses Suicidal Ideation</h4>
<p><strong>Immediate Actions:</strong></p>
<ol>
<li>Stay calm and maintain connection - Keep video on, maintain eye contact</li>
<li>Assess directly: "I hear you're having thoughts about not wanting to be here. Are you thinking about suicide?"</li>
<li>Determine immediacy: "Do you have a plan? Do you have access to [method]? Have you done anything to prepare?"</li>
<li>Verify location: "Can you confirm exactly where you are right now?"</li>
<li>Assess support: "Is anyone else in the home with you?"</li>
</ol>

<p><strong>LOW RISK (Ideation without plan, future-oriented, protective factors present):</strong></p>
<ul>
<li>Continue session with focus on safety planning</li>
<li>Review and update safety plan</li>
<li>Increase session frequency if indicated</li>
<li>Schedule follow-up within 24-48 hours</li>
</ul>

<p><strong>MODERATE RISK (Ideation with vague plan, some ambivalence):</strong></p>
<ul>
<li>Do not end session until safety is established</li>
<li>Engage support person or emergency contact</li>
<li>Remove or secure means if accessible</li>
<li>Create concrete safety plan for next 24 hours</li>
</ul>

<p><strong>HIGH RISK (Specific plan, access to means, intent):</strong></p>
<ul>
<li>DO NOT END THE VIDEO SESSION</li>
<li>Keep client engaged while you initiate emergency response</li>
<li>Call 911 for client's location (use a second phone)</li>
<li>Stay on video until emergency services arrive</li>
</ul>

<h4>Level 2: Technology Failure During Crisis</h4>
<p>If video disconnects during a crisis conversation:</p>
<ol>
<li>IMMEDIATELY call client's cell phone (within 30 seconds)</li>
<li>If no answer after 2 minutes, call emergency contact</li>
<li>If unable to reach anyone within 5 minutes, call 911 for welfare check</li>
<li>Document all attempts with timestamps</li>
</ol>

<h4>Level 3: Third Party Crisis Situations</h4>
<p>If someone appears on screen during session:</p>
<ul>
<li>Acknowledge neutrally without revealing therapeutic context</li>
<li>If client appears distressed, offer break</li>
<li>Use pre-established code words if domestic violence is a concern</li>
<li>Do not identify yourself as therapist unless client does first</li>
</ul>

<h3>Post-Crisis Protocol</h3>
<p><strong>Within 24 Hours:</strong></p>
<ul>
<li>Contact client to assess current status</li>
<li>Review and update safety plan</li>
<li>Coordinate with any emergency services involved</li>
<li>Complete thorough documentation</li>
<li>Consult with supervisor or colleague if needed</li>
</ul>

<h3>Crisis Resource Quick Reference Card</h3>
<p>Create for each client containing: client name/DOB, current address, cell phone, emergency contact, local 911, local crisis line, nearest ER, PCP contact, any code words established. Keep visible during every session.</p>
</div>`
    },
    
    "Video: Culturally Responsive Telehealth Practice": {
      newTitle: "Culturally Responsive Telehealth Practice",
      content: `<div class="lesson-content">
<h2>Culturally Responsive Telehealth Practice</h2>

<div class="intro-box">
<h3>Why This Matters</h3>
<p>Telehealth can both bridge and create cultural barriers. Technology access, privacy norms, communication styles, and family structures vary across cultural contexts in ways that affect telehealth viability and effectiveness. Clinicians who assume universal access and preferences risk inadvertently excluding or alienating clients from marginalized communities.</p>
</div>

<h3>Cultural Considerations in Technology Access</h3>
<p><strong>The Digital Divide:</strong> Technology access is not equally distributed. Consider:</p>
<ul>
<li>Socioeconomic barriers to devices and internet</li>
<li>Geographic disparities in broadband availability</li>
<li>Generational differences in technology comfort</li>
<li>Language barriers in platform interfaces</li>
<li>Disability access and accommodation needs</li>
</ul>

<p><strong>Culturally Responsive Responses:</strong></p>
<ul>
<li>Offer multiple modalities (video, phone, in-person options)</li>
<li>Don't assume technology problems are resistance</li>
<li>Provide patient technology support</li>
<li>Consider community resources (library WiFi, community centers)</li>
</ul>

<h3>Privacy Across Cultural Contexts</h3>
<p><strong>Living Situations:</strong> Many cultures include multigenerational households or shared living spaces. Assumptions about private rooms may not apply.</p>
<p><strong>Adaptations:</strong> Discuss privacy constraints without judgment, explore creative solutions (parked car, outdoor space, walking while talking), offer scheduling flexibility, use headphones for confidentiality.</p>

<h3>Communication Styles and Video</h3>
<p><strong>Eye Contact:</strong> Direct eye contact norms vary significantly across cultures. On video, looking at the camera can feel unnaturally intense; discuss comfort with video and offer alternatives.</p>
<p><strong>Nonverbal Communication:</strong> Video limits observation of full body language; gestures may have different meanings; ask about rather than assume meaning of expressions.</p>

<h3>Intersectionality in Telehealth</h3>
<p>Consider intersections of: race and ethnicity, immigration status, language, disability, socioeconomic status, geographic location, sexual orientation and gender identity, and age/generation.</p>

<h3>Self-Reflection Questions</h3>
<ol>
<li>What assumptions do I make about who can access telehealth?</li>
<li>How might my visible environment impact clients from different backgrounds?</li>
<li>What cultural groups do I feel less competent serving virtually?</li>
<li>How do I address technology barriers without judgment?</li>
<li>What additional training would enhance my cultural responsiveness in telehealth?</li>
</ol>
</div>`
    },
    
    "Video: Building a Sustainable Telehealth Practice": {
      newTitle: "Building a Sustainable Telehealth Practice",
      content: `<div class="lesson-content">
<h2>Building a Sustainable Telehealth Practice</h2>

<div class="intro-box">
<h3>Why This Matters</h3>
<p>The initial rush to telehealth adoption prioritized access over sustainability. Now, clinicians report screen fatigue, blurred work-life boundaries, and isolation as significant occupational hazards. Building a sustainable telehealth practice requires intentional attention to business operations, personal wellbeing, and professional boundaries.</p>
</div>

<h3>Practice Model Decisions</h3>
<p><strong>Full Telehealth Practice:</strong> No physical office overhead, geographic flexibility, requires strong home office setup, may limit client population.</p>
<p><strong>Hybrid Model:</strong> Combination of in-person and telehealth, flexibility for client needs, requires both physical and virtual infrastructure, scheduling complexity.</p>

<h3>Business Considerations</h3>
<p>Telehealth-only practice may eliminate: office rent, utilities, furniture, commute time and cost.</p>
<p>But requires investment in: quality technology equipment, reliable high-speed internet, HIPAA-compliant platform subscription, professional home office space, backup systems.</p>

<h3>Setting Boundaries in a Home-Based Practice</h3>
<p><strong>Physical Boundaries:</strong> Dedicated workspace with door, professional background visible on camera, separation from living space when possible.</p>
<p><strong>Time Boundaries:</strong> Defined work hours (resist "always available" pull), transition rituals between work and home life, scheduled breaks between sessions, protected lunch and end-of-day times.</p>
<p><strong>Psychological Boundaries:</strong> Work stays in the workspace, develop "end of day" routines, separate devices for work and personal use when possible.</p>

<h3>Preventing Telehealth Burnout</h3>
<p><strong>Screen Fatigue:</strong> Video sessions are cognitively demanding.</p>
<ul>
<li>Limit back-to-back sessions</li>
<li>Build screen breaks into your day</li>
<li>Look away from screen periodically during sessions</li>
<li>Use the 20-20-20 rule (every 20 minutes, look 20 feet away for 20 seconds)</li>
</ul>

<p><strong>Isolation:</strong> Working from home can be isolating.</p>
<ul>
<li>Regular peer consultation (video or in-person)</li>
<li>Professional community involvement</li>
<li>Coworking spaces occasionally</li>
<li>Scheduled social connection</li>
</ul>

<h3>Action Planning</h3>
<p>Create your sustainable telehealth practice plan:</p>
<ol>
<li>Define your ideal practice model</li>
<li>Assess current technology and gaps</li>
<li>Establish boundary policies</li>
<li>Create self-care routine</li>
<li>Identify professional development needs</li>
<li>Set quarterly review schedule</li>
</ol>
</div>`
    }
  }
};

// Add the new Clinical Appropriateness Screening lesson
const clinicalAppropriatenessLesson = {
  title: "Clinical Appropriateness Screening for Telehealth",
  type: "text",
  content: `<div class="lesson-content">
<h2>Clinical Appropriateness Screening for Telehealth</h2>

<div class="intro-box">
<h3>Why This Matters</h3>
<p>Not every client, condition, or situation is appropriate for telehealth delivery. Clinical appropriateness screening protects clients from receiving inadequate care and protects practitioners from liability when telehealth limitations compromise treatment quality.</p>
</div>

<h3>Why Appropriateness Screening Matters</h3>
<p>Telehealth is a powerful tool, but it is not universally appropriate. Providing telehealth services to clients for whom in-person care would be more effective raises ethical concerns about quality of care and may create liability exposure.</p>

<h3>The Three-Domain Assessment Model</h3>

<h4>Domain 1: Client Factors</h4>
<p><strong>Technology Access and Literacy:</strong></p>
<ul>
<li>Does the client have reliable internet access?</li>
<li>Does the client have a device with camera and microphone?</li>
<li>Can the client navigate the telehealth platform independently?</li>
<li>Does the client have backup communication methods?</li>
</ul>

<p><strong>Physical and Sensory Considerations:</strong></p>
<ul>
<li>Does the client have hearing or vision impairments affecting video communication?</li>
<li>Can the client remain seated comfortably for session duration?</li>
<li>Are there cognitive limitations affecting technology use?</li>
</ul>

<h4>Domain 2: Clinical Factors</h4>
<p><strong>Generally Appropriate for Telehealth:</strong></p>
<ul>
<li>Adjustment disorders</li>
<li>Mild to moderate anxiety disorders</li>
<li>Mild to moderate depression</li>
<li>Relationship concerns</li>
<li>Grief and loss (uncomplicated)</li>
<li>Stress management, life transitions</li>
</ul>

<p><strong>Requires Enhanced Assessment:</strong></p>
<ul>
<li>PTSD and complex trauma (assess dissociation risk)</li>
<li>Eating disorders (may need medical monitoring)</li>
<li>Substance use disorders (assess intoxication, withdrawal risk)</li>
<li>Personality disorders (assess crisis potential)</li>
</ul>

<p><strong>Generally Contraindicated for Telehealth:</strong></p>
<ul>
<li>Active suicidal ideation with plan or intent</li>
<li>Active self-harm behaviors</li>
<li>Acute psychosis or severe dissociation</li>
<li>Severe substance intoxication or withdrawal</li>
<li>Domestic violence with perpetrator present or monitoring</li>
</ul>

<h4>Domain 3: Environmental Factors</h4>
<p><strong>Privacy and Safety:</strong></p>
<ul>
<li>Does the client have a private space for sessions?</li>
<li>Who else is in the home during sessions?</li>
<li>Is there domestic violence or coercive control present?</li>
<li>Can the client speak freely without being overheard?</li>
</ul>

<h3>The Appropriateness Decision Matrix</h3>
<p><strong>GREEN LIGHT (Telehealth Appropriate):</strong> Stable symptoms, low crisis risk, adequate technology, private safe environment, client engaged, emergency protocols in place.</p>
<p><strong>YELLOW LIGHT (Telehealth with Enhanced Protocols):</strong> Moderate symptoms or crisis history, some environmental limitations. Requires more frequent sessions, enhanced safety planning, clear criteria for stepping up to in-person.</p>
<p><strong>RED LIGHT (In-Person Indicated):</strong> Active safety concerns, severe symptoms, insufficient technology or privacy. Requires referral to in-person services, crisis intervention, higher level of care assessment.</p>

<h3>Sample Screening Questions</h3>
<ol>
<li>"Where will you typically be during our sessions? Will you have privacy?"</li>
<li>"Who else lives in your home? Will they be present during sessions?"</li>
<li>"Do you have reliable internet and a device with camera for video sessions?"</li>
<li>"Have you used video calling before? How comfortable are you with technology?"</li>
<li>"Is there anything that might make it difficult for you to speak freely during our sessions?"</li>
<li>"If you were in crisis, who could you contact locally for support?"</li>
</ol>

<h3>Documentation Requirements</h3>
<p>Document your appropriateness assessment including: factors considered in each domain, clinical reasoning for telehealth decision, any enhanced protocols implemented, plan for ongoing reassessment, and client's informed consent to telehealth modality.</p>
</div>`,
  duration: 20,
  order: 3 // Will be inserted as lesson 3 in the telehealth course
};

// ============================================
// UPDATE FUNCTIONS
// ============================================

async function updateLessons() {
  console.log('Starting lesson updates...\n');
  
  let updatedCount = 0;
  let notFoundCount = 0;
  let errorCount = 0;

  for (const [courseTitle, lessons] of Object.entries(lessonUpdates)) {
    console.log(`\n📚 Processing course: ${courseTitle}`);
    
    // Find course by partial title match
    const course = await Course.findOne({ 
      title: { $regex: courseTitle, $options: 'i' } 
    });
    
    if (!course) {
      console.log(`  ❌ Course not found: ${courseTitle}`);
      notFoundCount++;
      continue;
    }
    
    console.log(`  ✓ Found course: ${course.title}`);
    
    for (const [lessonTitle, updateData] of Object.entries(lessons)) {
      let lessonFound = false;
      
      // Search through all modules for the lesson
      for (let moduleIndex = 0; moduleIndex < course.modules.length; moduleIndex++) {
        const module = course.modules[moduleIndex];
        
        for (let lessonIndex = 0; lessonIndex < module.lessons.length; lessonIndex++) {
          const lesson = module.lessons[lessonIndex];
          
          // Match by title (partial match for "Video:" prefix variations)
          if (lesson.title === lessonTitle || 
              lesson.title.includes(lessonTitle.replace('Video: ', '')) ||
              lessonTitle.includes(lesson.title)) {
            
            // Update the lesson
            course.modules[moduleIndex].lessons[lessonIndex].type = 'text';
            course.modules[moduleIndex].lessons[lessonIndex].content = updateData.content;
            course.modules[moduleIndex].lessons[lessonIndex].videoUrl = undefined;
            
            // Update title if new title provided
            if (updateData.newTitle) {
              course.modules[moduleIndex].lessons[lessonIndex].title = updateData.newTitle;
            }
            
            lessonFound = true;
            updatedCount++;
            console.log(`    ✓ Updated: ${lesson.title}`);
            break;
          }
        }
        
        if (lessonFound) break;
      }
      
      if (!lessonFound) {
        console.log(`    ❌ Lesson not found: ${lessonTitle}`);
        notFoundCount++;
      }
    }
    
    // Save the course
    try {
      await course.save();
      console.log(`  💾 Saved course: ${course.title}`);
    } catch (err) {
      console.log(`  ❌ Error saving course: ${err.message}`);
      errorCount++;
    }
  }

  // Now add the Clinical Appropriateness lesson to the Telehealth course
  console.log('\n📝 Adding Clinical Appropriateness Screening lesson...');
  
  const telehealthCourse = await Course.findOne({ 
    title: { $regex: 'TeleMental Health', $options: 'i' } 
  });
  
  if (telehealthCourse && telehealthCourse.modules.length > 0) {
    // Find the appropriate module (first one or one that contains other ethics/overview lessons)
    const targetModule = telehealthCourse.modules[0];
    
    // Check if lesson already exists
    const existingLesson = targetModule.lessons.find(l => 
      l.title.includes('Clinical Appropriateness') || l.title.includes('Appropriateness Screening')
    );
    
    if (!existingLesson) {
      // Insert at position 3 (after Rule 135 and Ethics lessons)
      targetModule.lessons.splice(2, 0, clinicalAppropriatenessLesson);
      
      // Reorder all lessons
      targetModule.lessons.forEach((lesson, index) => {
        lesson.order = index + 1;
      });
      
      await telehealthCourse.save();
      console.log('  ✓ Added Clinical Appropriateness Screening lesson');
      updatedCount++;
    } else {
      console.log('  ⚠ Clinical Appropriateness lesson already exists');
    }
  }

  console.log('\n========================================');
  console.log('UPDATE SUMMARY');
  console.log('========================================');
  console.log(`✓ Updated: ${updatedCount} lessons`);
  console.log(`❌ Not found: ${notFoundCount}`);
  console.log(`⚠ Errors: ${errorCount}`);
  console.log('========================================\n');
}

// Run the update
updateLessons()
  .then(() => {
    console.log('Update complete!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Update failed:', err);
    process.exit(1);
  });
