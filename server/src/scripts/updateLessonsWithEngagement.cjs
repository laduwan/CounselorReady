// updateLessonsWithEngagement.cjs
// Run: node src/scripts/updateLessonsWithEngagement.cjs
// 
// Updates all 14 lessons with:
// 1. Header banner images (SVG-based, styled per topic)
// 2. Shortened intros (2-3 sentences)
// 3. Clear visual separators
// 4. Engagement elements (matching, fill-in-blank, fun facts, knowledge checks)

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const courseSchema = new mongoose.Schema({}, { strict: false });
const Course = mongoose.model('Course', courseSchema);

// ============================================
// HEADER BANNER GENERATORS (SVG-based)
// ============================================

const createBanner = (title, subtitle, colors, icon) => `
<div class="lesson-banner" style="background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%); padding: 40px 30px; border-radius: 12px; margin-bottom: 30px; text-align: center; color: white; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
  <div style="font-size: 48px; margin-bottom: 15px;">${icon}</div>
  <h1 style="margin: 0 0 10px 0; font-size: 28px; font-weight: 700; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">${title}</h1>
  <p style="margin: 0; font-size: 16px; opacity: 0.9;">${subtitle}</p>
</div>`;

const banners = {
  existential: createBanner(
    "Existential Therapy Case Study",
    "Exploring the Four Ultimate Concerns in Clinical Practice",
    { primary: "#4A5568", secondary: "#2D3748" },
    "🌌"
  ),
  billingCycle: createBanner(
    "The Billing Cycle",
    "Revenue Management for Mental Health Practices",
    { primary: "#2B6CB0", secondary: "#1A365D" },
    "💵"
  ),
  credentialing: createBanner(
    "Provider Credentialing",
    "Getting Paneled with Insurance Companies",
    { primary: "#2C7A7B", secondary: "#234E52" },
    "📋"
  ),
  icd10: createBanner(
    "ICD-10 Diagnostic Coding",
    "Accurate Coding for Mental Health Professionals",
    { primary: "#6B46C1", secondary: "#44337A" },
    "🔢"
  ),
  clearinghouse: createBanner(
    "Clearinghouse Operations",
    "Streamlining Your Claims Process",
    { primary: "#D69E2E", secondary: "#975A16" },
    "🔄"
  ),
  audit: createBanner(
    "Audit Preparation",
    "Protecting Your Practice Through Documentation",
    { primary: "#C53030", secondary: "#822727" },
    "📑"
  ),
  copays: createBanner(
    "Managing Client Payments",
    "Copays, Deductibles, and Self-Pay Collections",
    { primary: "#38A169", secondary: "#276749" },
    "💳"
  ),
  rule135: createBanner(
    "Georgia Rule 135",
    "Telehealth Regulations for Counselors",
    { primary: "#DD6B20", secondary: "#9C4221" },
    "⚖️"
  ),
  ethics: createBanner(
    "Ethical Decision Making",
    "Navigating Telehealth Dilemmas",
    { primary: "#805AD5", secondary: "#553C9A" },
    "🧭"
  ),
  appropriateness: createBanner(
    "Clinical Appropriateness Screening",
    "Determining Telehealth Suitability",
    { primary: "#319795", secondary: "#234E52" },
    "✅"
  ),
  platform: createBanner(
    "Platform Comparison & Setup",
    "Choosing and Configuring Your Telehealth Technology",
    { primary: "#3182CE", secondary: "#2A4365" },
    "💻"
  ),
  crisis: createBanner(
    "Crisis Protocols",
    "Managing Emergencies in the Virtual Environment",
    { primary: "#E53E3E", secondary: "#822727" },
    "🚨"
  ),
  cultural: createBanner(
    "Culturally Responsive Practice",
    "Bridging Barriers in Telehealth",
    { primary: "#D53F8C", secondary: "#702459" },
    "🌍"
  ),
  sustainable: createBanner(
    "Sustainable Telehealth Practice",
    "Building a Practice That Lasts",
    { primary: "#48BB78", secondary: "#276749" },
    "🌱"
  )
};

// ============================================
// CSS STYLES (to be added to platform)
// ============================================

const engagementStyles = `
<style>
.lesson-intro {
  background: linear-gradient(to right, #f7fafc, #edf2f7);
  border-left: 4px solid #4A5568;
  padding: 20px 25px;
  margin-bottom: 25px;
  border-radius: 0 8px 8px 0;
}
.lesson-intro h3 {
  margin-top: 0;
  color: #2D3748;
  font-size: 18px;
}
.section-divider {
  border: none;
  height: 3px;
  background: linear-gradient(to right, #E2E8F0, #4A5568, #E2E8F0);
  margin: 30px 0;
  border-radius: 2px;
}
.fun-fact {
  background: linear-gradient(135deg, #FFF5F5 0%, #FED7E2 100%);
  border: 1px solid #FC8181;
  border-radius: 10px;
  padding: 20px;
  margin: 25px 0;
  position: relative;
}
.fun-fact-icon {
  font-size: 24px;
  margin-right: 10px;
}
.knowledge-check {
  background: linear-gradient(135deg, #EBF8FF 0%, #BEE3F8 100%);
  border: 2px solid #63B3ED;
  border-radius: 10px;
  padding: 25px;
  margin: 25px 0;
}
.knowledge-check h4 {
  margin-top: 0;
  color: #2B6CB0;
}
.fill-in-blank {
  background: linear-gradient(135deg, #F0FFF4 0%, #C6F6D5 100%);
  border: 2px solid #68D391;
  border-radius: 10px;
  padding: 25px;
  margin: 25px 0;
}
.fill-in-blank h4 {
  margin-top: 0;
  color: #276749;
}
.matching-table {
  width: 100%;
  border-collapse: collapse;
  margin: 15px 0;
}
.matching-table th, .matching-table td {
  border: 1px solid #CBD5E0;
  padding: 12px;
  text-align: left;
}
.matching-table th {
  background: rgba(255,255,255,0.5);
}
.answer-reveal {
  margin-top: 15px;
  cursor: pointer;
}
.answer-reveal summary {
  background: #4A5568;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  font-weight: bold;
}
.answer-reveal summary:hover {
  background: #2D3748;
}
.answer-reveal p {
  background: #F7FAFC;
  padding: 15px;
  border-radius: 5px;
  margin-top: 10px;
  border: 1px solid #E2E8F0;
}
.key-takeaway {
  background: linear-gradient(135deg, #FFFAF0 0%, #FEEBC8 100%);
  border: 2px solid #ED8936;
  border-radius: 10px;
  padding: 25px;
  margin: 30px 0;
}
.key-takeaway h4 {
  margin-top: 0;
  color: #C05621;
}
</style>`;

// ============================================
// LESSON CONTENT
// ============================================

const lessonUpdates = {

  // ==========================================
  // EXISTENTIAL THEORY
  // ==========================================
  
  "Case Study: Complete Existential Session": engagementStyles + banners.existential + `
<div class="lesson-content">

<div class="lesson-intro">
<h3>Why This Matters</h3>
<p>This case study demonstrates how existential concepts translate into therapeutic dialogue. Observing a complete session bridges the gap between theory and practice that many clinicians experience.</p>
</div>

<hr class="section-divider" />

<h2>Case Background: Sarah, Age 34</h2>
<p>Sarah presents with feelings of emptiness and meaninglessness following a successful corporate career. Despite external achievements, she reports feeling disconnected from her life and questioning whether her choices have been authentic.</p>

<div class="fun-fact">
<span class="fun-fact-icon">💡</span>
<strong>Did You Know?</strong> Irvin Yalom identified that many high-achieving clients experience "tragic triviality"—the realization that success hasn't brought meaning. This is one of the most common presentations in existential therapy.
</div>

<h2>Session Opening: Establishing Presence</h2>
<p>The session begins with the therapist establishing authentic presence—creating space for Sarah to bring whatever feels most pressing. This reflects the existential emphasis on <em>being-with</em> rather than <em>doing-to</em> the client.</p>

<p><strong>Therapeutic Stance:</strong> The therapist demonstrates "horizontal" rather than "vertical" relating—meeting Sarah as a fellow human rather than an expert diagnosing pathology.</p>

<h2>Exploring the Four Ultimate Concerns</h2>

<p><strong>Death Awareness:</strong> Sarah mentions her father's recent health scare. The therapist explores how this has affected her sense of time and priorities, without rushing to reassurance.</p>

<p><strong>Freedom and Responsibility:</strong> When Sarah expresses feeling "trapped," the therapist gently explores the choices that led here—helping Sarah recognize her agency.</p>

<p><strong>Isolation:</strong> Sarah describes feeling fundamentally alone despite being surrounded by colleagues. The therapist validates this existential isolation while modeling genuine connection.</p>

<p><strong>Meaninglessness:</strong> Rather than prescribing meaning, the therapist helps Sarah explore what matters to <em>her</em>.</p>

<div class="knowledge-check">
<h4>🎯 Knowledge Check: Match the Ultimate Concern</h4>
<p>Match each client statement to the ultimate concern it represents:</p>
<table class="matching-table">
<tr><th>Client Statement</th><th>Ultimate Concern</th></tr>
<tr><td>1. "No one really understands what I'm going through."</td><td>A. Death</td></tr>
<tr><td>2. "I could have done anything—why did I choose this?"</td><td>B. Freedom</td></tr>
<tr><td>3. "Dad's heart attack made me realize I'm wasting time."</td><td>C. Isolation</td></tr>
<tr><td>4. "What's the point of any of this?"</td><td>D. Meaninglessness</td></tr>
</table>
<details class="answer-reveal">
<summary>Click to Reveal Answers</summary>
<p>1-C (Isolation), 2-B (Freedom), 3-A (Death), 4-D (Meaninglessness)</p>
</details>
</div>

<h2>Key Interventions</h2>

<p><strong>Phenomenological Inquiry:</strong> "What is it like for you right now, sitting with these questions?"</p>

<p><strong>Bracketing:</strong> Setting aside preconceptions about what Sarah "should" want or feel.</p>

<p><strong>Confrontation with Compassion:</strong> "I notice you describe this as something that happened to you. I wonder about the choices along the way."</p>

<h2>Working with Anxiety</h2>

<p>Existential anxiety emerges as Sarah confronts the reality that she alone must author her life. Rather than treating this as pathological, the therapist frames it as a signal of awakening.</p>

<div class="fill-in-blank">
<h4>📝 Fill in the Blank</h4>
<p>Complete the distinction between anxiety types:</p>
<ul>
<li><strong>Neurotic anxiety</strong> is ________-based and arises from self-deception.</li>
<li><strong>Existential anxiety</strong> is ________-oriented and arises from authentic confrontation with life.</li>
</ul>
<details class="answer-reveal">
<summary>Click to Reveal Answers</summary>
<p>Neurotic = <strong>avoidance</strong>-based | Existential = <strong>growth</strong>-oriented</p>
</details>
</div>

<h2>Session Closing</h2>
<p>The session concludes not with solutions but with Sarah sitting more fully with her questions. She identifies one small way she might live more authentically—not as homework but as an experiment in presence.</p>

<div class="key-takeaway">
<h4>🔑 Key Takeaway</h4>
<p>Existential therapy is less about technique and more about stance. The therapist's willingness to sit with uncertainty, engage authentically, and honor the client's freedom creates conditions for meaningful change.</p>
</div>

</div>`,

  // ==========================================
  // BILLING - LESSON 1
  // ==========================================

  "The Billing Cycle and Revenue Management": engagementStyles + banners.billingCycle + `
<div class="lesson-content">

<div class="lesson-intro">
<h3>Why This Matters</h3>
<p>Practices with documented billing workflows experience 23% fewer claim denials and collect payments 15 days faster. Understanding the complete cycle transforms reactive problem-solving into proactive revenue management.</p>
</div>

<hr class="section-divider" />

<h2>Overview of the Revenue Cycle</h2>
<p>The revenue cycle encompasses all functions that contribute to capturing, managing, and collecting patient service revenue.</p>

<div class="fun-fact">
<span class="fun-fact-icon">💡</span>
<strong>Did You Know?</strong> The average mental health practice loses 10-15% of potential revenue due to billing errors, missed filing deadlines, and uncollected copays. That's $15,000-$30,000 annually for a solo practitioner!
</div>

<h2>Phase 1: Pre-Service (Client Intake)</h2>
<p><strong>Insurance Verification:</strong> Before the first session, verify:</p>
<ul>
<li>Active coverage and effective dates</li>
<li>Mental health benefits (often separate from medical)</li>
<li>In-network or out-of-network status</li>
<li>Copay, coinsurance, and deductible amounts</li>
<li>Session limits or prior authorization requirements</li>
</ul>

<h2>Phase 2: Service Delivery and Documentation</h2>
<p>Each session note must support: medical necessity, the diagnosis billed, the CPT code selected, and time spent (for time-based codes).</p>

<h2>Phase 3: Charge Capture and Claim Creation</h2>
<ol>
<li>Select appropriate CPT codes (90834, 90837, 90847, etc.)</li>
<li>Assign ICD-10 diagnosis codes</li>
<li>Apply correct modifiers (95 for telehealth, etc.)</li>
<li>Verify place of service codes</li>
</ol>

<div class="knowledge-check">
<h4>🎯 Quick Quiz: Place of Service Codes</h4>
<table class="matching-table">
<tr><th>Setting</th><th>POS Code</th></tr>
<tr><td>1. Office</td><td>A. 02</td></tr>
<tr><td>2. Telehealth (patient at home)</td><td>B. 10</td></tr>
<tr><td>3. Client's home (in-person)</td><td>C. 11</td></tr>
<tr><td>4. Telehealth (patient at clinic)</td><td>D. 12</td></tr>
</table>
<details class="answer-reveal">
<summary>Click to Reveal Answers</summary>
<p>1-C (11=Office), 2-A (02=Telehealth-Home), 3-D (12=Home), 4-B (10=Telehealth-Clinic)</p>
</details>
</div>

<h2>Phase 4: Claim Submission</h2>
<p><strong>Timely Filing:</strong> Most payers require claims within 90-180 days.</p>
<p><strong>Clean Claim Rate:</strong> Aim for 95%+ (accepted on first submission).</p>

<h2>Phase 5: Payment Posting</h2>
<p>Post payments, verify contracted rates, address underpayments, and generate client statements.</p>

<h2>Phase 6: Denial Management</h2>
<p>Review denial codes, correct errors, and file appeals within deadlines (typically 30-60 days).</p>

<div class="fill-in-blank">
<h4>📝 Fill in the Blank: KPI Targets</h4>
<ul>
<li>Days in Accounts Receivable: Under ____ days</li>
<li>Clean Claim Rate: ____% or higher</li>
<li>Denial Rate: Under ____%</li>
<li>Collection Rate: ____% of expected revenue</li>
</ul>
<details class="answer-reveal">
<summary>Click to Reveal Answers</summary>
<p>AR: <strong>35</strong> days | Clean Claims: <strong>95</strong>% | Denials: under <strong>5</strong>% | Collections: <strong>95</strong>%</p>
</details>
</div>

<div class="key-takeaway">
<h4>🔑 Key Takeaway</h4>
<p>Create a billing calendar: daily charge entry, weekly claim submission, bi-weekly payment posting, monthly financial review. Consistency prevents revenue leakage.</p>
</div>

</div>`,

  // ==========================================
  // BILLING - LESSON 2
  // ==========================================

  "Provider Credentialing Process": engagementStyles + banners.credentialing + `
<div class="lesson-content">

<div class="lesson-intro">
<h3>Why This Matters</h3>
<p>Credentialing is your gateway to serving insured clients. Strategic understanding—which payers to prioritize, how to expedite applications—transforms this administrative task into practice-building opportunity.</p>
</div>

<hr class="section-divider" />

<h2>Credentialing vs. Contracting</h2>
<p><strong>Credentialing</strong> verifies your qualifications. <strong>Contracting</strong> establishes the business relationship and rates.</p>

<div class="fun-fact">
<span class="fun-fact-icon">💡</span>
<strong>Did You Know?</strong> The average credentialing application requires 45+ individual data points. CAQH ProView stores all of this once, saving you from re-entering information for every payer!
</div>

<h2>Prerequisites</h2>
<ul>
<li>Active state license in good standing</li>
<li>NPI (Type 1 individual, Type 2 organization if applicable)</li>
<li>Professional liability insurance ($1M/$3M minimum)</li>
<li>CAQH ProView profile completed and attested</li>
<li>Tax ID (SSN or EIN)</li>
</ul>

<h2>CAQH ProView Setup</h2>
<ol>
<li><strong>Register</strong> at proview.caqh.org</li>
<li><strong>Complete</strong> all sections</li>
<li><strong>Upload</strong> supporting documents</li>
<li><strong>Attest</strong> quarterly</li>
<li><strong>Authorize</strong> payers to access</li>
</ol>

<div class="knowledge-check">
<h4>🎯 Match the Credentialing Timeline</h4>
<table class="matching-table">
<tr><th>Payer Type</th><th>Timeline</th></tr>
<tr><td>1. Medicare</td><td>A. 60-180 days</td></tr>
<tr><td>2. Medicaid</td><td>B. 60-90 days</td></tr>
<tr><td>3. Commercial</td><td>C. 90-120 days</td></tr>
</table>
<details class="answer-reveal">
<summary>Click to Reveal Answers</summary>
<p>1-B (Medicare: 60-90), 2-C (Medicaid: 90-120), 3-A (Commercial: 60-180)</p>
</details>
</div>

<h2>Common Challenges</h2>
<p><strong>Closed Panels:</strong> Join group practices, request exceptions for underserved areas, or check periodically for reopening.</p>

<div class="fill-in-blank">
<h4>📝 Fill in the Blank</h4>
<p>To keep your CAQH ProView profile active, you must __________ every ____ months.</p>
<details class="answer-reveal">
<summary>Click to Reveal Answer</summary>
<p>You must <strong>attest</strong> every <strong>3</strong> months (quarterly).</p>
</details>
</div>

<div class="key-takeaway">
<h4>🔑 Key Takeaway</h4>
<p>Start credentialing 6 months before you plan to see insured clients. It's ongoing—re-credentialing every 2-3 years, CAQH attestation quarterly.</p>
</div>

</div>`,

  // ==========================================
  // BILLING - LESSON 3
  // ==========================================

  "ICD-10 Diagnostic Coding": engagementStyles + banners.icd10 + `
<div class="lesson-content">

<div class="lesson-intro">
<h3>Why This Matters</h3>
<p>Accurate ICD-10 coding ensures your clinical documentation aligns with the diagnosis submitted for payment—protecting both ethical practice and revenue integrity.</p>
</div>

<hr class="section-divider" />

<h2>ICD-10-CM Structure</h2>
<p><strong>Format: F##.##</strong> — Mental health diagnoses are in Chapter 5 (F01-F99).</p>

<div class="fun-fact">
<span class="fun-fact-icon">💡</span>
<strong>Did You Know?</strong> ICD-10-CM contains over 70,000 diagnosis codes—compared to about 14,000 in ICD-9! The mental health chapter alone has over 500 codes.
</div>

<h2>Common Mental Health Codes</h2>

<p><strong>Mood Disorders (F30-F39):</strong></p>
<ul>
<li>F32.0/F32.1/F32.2 - MDD, single episode (mild/moderate/severe)</li>
<li>F33.x - MDD, recurrent</li>
</ul>

<p><strong>Anxiety Disorders (F40-F48):</strong></p>
<ul>
<li>F41.0 - Panic disorder</li>
<li>F41.1 - Generalized anxiety disorder</li>
<li>F43.10 - PTSD</li>
<li>F43.2x - Adjustment disorders</li>
</ul>

<div class="knowledge-check">
<h4>🎯 Quick Quiz: Decode the Diagnosis</h4>
<table class="matching-table">
<tr><th>ICD-10 Code</th><th>Diagnosis</th></tr>
<tr><td>1. F32.1</td><td>A. Generalized anxiety disorder</td></tr>
<tr><td>2. F41.1</td><td>B. PTSD, unspecified</td></tr>
<tr><td>3. F43.10</td><td>C. MDD, single episode, moderate</td></tr>
<tr><td>4. F43.23</td><td>D. Adjustment disorder w/ mixed anxiety & depression</td></tr>
</table>
<details class="answer-reveal">
<summary>Click to Reveal Answers</summary>
<p>1-C, 2-A, 3-B, 4-D</p>
</details>
</div>

<h2>Three Essential Principles</h2>
<ol>
<li><strong>Code to Highest Specificity</strong> — F32.1 over F32.9</li>
<li><strong>Code What You Treat</strong> — Diagnosis must support the service</li>
<li><strong>Severity Specifiers Matter</strong> — Document mild/moderate/severe</li>
</ol>

<div class="fill-in-blank">
<h4>📝 Fill in the Blank</h4>
<p>ICD-10-CM is updated annually, effective __________ 1st each year.</p>
<details class="answer-reveal">
<summary>Click to Reveal Answer</summary>
<p>ICD-10 updates are effective <strong>October</strong> 1st.</p>
</details>
</div>

<div class="key-takeaway">
<h4>🔑 Key Takeaway</h4>
<p>Documentation must support the code: symptoms matching criteria, duration/frequency, functional impairment, and assessment scores when applicable.</p>
</div>

</div>`,

  // ==========================================
  // BILLING - LESSON 4
  // ==========================================

  "Clearinghouse Operations and Workflows": engagementStyles + banners.clearinghouse + `
<div class="lesson-content">

<div class="lesson-intro">
<h3>Why This Matters</h3>
<p>Clearinghouses catch errors before they become denials. Understanding their role lets you implement systematic processes that prevent billing problems proactively.</p>
</div>

<hr class="section-divider" />

<h2>What is a Clearinghouse?</h2>
<p>An electronic hub that receives claims, scrubs for errors, translates to payer formats, transmits to insurers, and delivers remittance advice (ERAs).</p>

<div class="fun-fact">
<span class="fun-fact-icon">💡</span>
<strong>Did You Know?</strong> Electronic claims through clearinghouses process in 5-14 days on average, compared to 30-45 days for paper claims. That's cash flow you can count on!
</div>

<h2>Clearinghouse Workflow</h2>
<ol>
<li><strong>Claim Creation</strong> — EHR/practice management creates claims</li>
<li><strong>Batch Upload</strong> — Claims sent to clearinghouse</li>
<li><strong>Scrubbing</strong> — Checked against HIPAA and payer rules</li>
<li><strong>Rejection Handling</strong> — Errors returned for correction</li>
<li><strong>Transmission</strong> — Clean claims sent to payers</li>
<li><strong>Remittance</strong> — ERA/835 returns with payment info</li>
</ol>

<div class="knowledge-check">
<h4>🎯 Match the Report Type</h4>
<table class="matching-table">
<tr><th>Report</th><th>Purpose</th></tr>
<tr><td>1. Claim Status</td><td>A. Claims outstanding too long</td></tr>
<tr><td>2. Rejection</td><td>B. Where each claim stands</td></tr>
<tr><td>3. Aging</td><td>C. Failed scrubbing with error codes</td></tr>
<tr><td>4. Payer Performance</td><td>D. Payment speed and denial rates</td></tr>
</table>
<details class="answer-reveal">
<summary>Click to Reveal Answers</summary>
<p>1-B, 2-C, 3-A, 4-D</p>
</details>
</div>

<h2>Popular Clearinghouses</h2>
<ul>
<li><strong>Office Ally</strong> — Free for claims</li>
<li><strong>Availity</strong> — Free for eligibility, fees for claims</li>
<li><strong>Trizetto</strong> — Integrated with many EHRs</li>
</ul>

<div class="key-takeaway">
<h4>🔑 Key Takeaway</h4>
<p><strong>Daily:</strong> Check rejection reports, correct same day. <strong>Weekly:</strong> Review aging report, follow up on 30+ day claims, process ERAs.</p>
</div>

</div>`,

  // ==========================================
  // BILLING - LESSON 5
  // ==========================================

  "Audit Preparation and Response": engagementStyles + banners.audit + `
<div class="lesson-content">

<div class="lesson-intro">
<h3>Why This Matters</h3>
<p>Audit-readiness practices improve overall documentation quality. The standards that satisfy auditors also represent best practices for clinical care.</p>
</div>

<hr class="section-divider" />

<h2>Types of Audits</h2>
<ul>
<li><strong>Pre-Payment Review:</strong> Documentation requested before payment</li>
<li><strong>Post-Payment Audit:</strong> Retrospective review of paid claims</li>
<li><strong>RAC Audits:</strong> Medicare-focused on overpayments</li>
<li><strong>Fraud Investigation:</strong> Triggered by specific concerns</li>
</ul>

<div class="fun-fact">
<span class="fun-fact-icon">💡</span>
<strong>Did You Know?</strong> The #1 audit trigger for mental health providers is billing a higher proportion of 90837 (53+ min) vs. 90834 (45 min) than peers. If 80% of your sessions are 90837, expect questions!
</div>

<h2>Common Audit Triggers</h2>
<ul>
<li>Billing patterns deviating from peers</li>
<li>High volume of specific codes</li>
<li>Services outside typical scope</li>
<li>Patient complaints or random selection</li>
</ul>

<div class="knowledge-check">
<h4>🎯 True or False</h4>
<p>Mark each statement True or False:</p>
<ol>
<li>You should proactively send additional documents beyond what's requested. ____</li>
<li>If documentation doesn't exist, you can recreate it from memory. ____</li>
<li>Appeal deadlines are typically 30-60 days. ____</li>
<li>Internal audits should be conducted quarterly. ____</li>
</ol>
<details class="answer-reveal">
<summary>Click to Reveal Answers</summary>
<p>1-False (only send what's requested), 2-False (never alter/create documentation), 3-True, 4-True</p>
</details>
</div>

<h2>Responding to Audit Requests</h2>
<ol>
<li><strong>Review carefully</strong> — Note exact records and deadline</li>
<li><strong>Gather documentation</strong> — Only what's requested; never alter</li>
<li><strong>Review before submitting</strong> — Ensure documentation supports claims</li>
<li><strong>Submit by deadline</strong> — Secure method with tracking</li>
</ol>

<div class="key-takeaway">
<h4>🔑 Key Takeaway</h4>
<p>If it's not documented, it didn't happen. The best audit defense is consistent, thorough documentation completed at the time of service.</p>
</div>

</div>`,

  // ==========================================
  // BILLING - LESSON 6
  // ==========================================

  "Managing Copays, Deductibles, and Self-Pay": engagementStyles + banners.copays + `
<div class="lesson-content">

<div class="lesson-intro">
<h3>Why This Matters</h3>
<p>How you discuss money affects therapeutic alliance and practice sustainability. Research shows transparent, compassionate financial discussions actually strengthen client relationships.</p>
</div>

<hr class="section-divider" />

<h2>Understanding Client Financial Responsibility</h2>
<ul>
<li><strong>Copay:</strong> Fixed amount per visit ($25, $50, etc.)</li>
<li><strong>Coinsurance:</strong> Percentage of allowed amount (20% of $150 = $30)</li>
<li><strong>Deductible:</strong> Amount paid before insurance covers</li>
<li><strong>Out-of-Pocket Maximum:</strong> Annual limit on client responsibility</li>
</ul>

<div class="fun-fact">
<span class="fun-fact-icon">💡</span>
<strong>Did You Know?</strong> Practices that collect at time of service have a 95%+ collection rate. Those that bill after? Often below 70%. Card-on-file policies make a huge difference!
</div>

<h2>Collection Best Practices</h2>
<p><strong>Sample Language:</strong> "Your copay of $30 is due at each session. We accept cash, check, and credit card. For convenience, we can keep a card on file."</p>

<div class="knowledge-check">
<h4>🎯 Scenario Check</h4>
<p>A client's insurance shows: $1,500 deductible (met: $500), 20% coinsurance after deductible, $150 allowed amount. What does the client owe for today's session?</p>
<details class="answer-reveal">
<summary>Click to Reveal Answer</summary>
<p><strong>$150</strong> — The deductible isn't met yet ($1,000 remaining), so client pays the full allowed amount until deductible is satisfied.</p>
</details>
</div>

<h2>Self-Pay Requirements</h2>
<p><strong>Good Faith Estimate (No Surprises Act):</strong> Provide diagnosis codes, service codes, expected frequency, and total estimated cost.</p>

<h2>Legal Considerations</h2>
<ul>
<li><strong>Waiving copays:</strong> Routine waiving may constitute fraud; document hardship</li>
<li><strong>Abandonment:</strong> Don't terminate solely for unpaid balances without notice and referrals</li>
</ul>

<div class="key-takeaway">
<h4>🔑 Key Takeaway</h4>
<p>Address financial concerns directly and compassionately. Growing debt damages the therapeutic relationship—prevention through clear policies beats collection later.</p>
</div>

</div>`,

  // ==========================================
  // TELEHEALTH - LESSON 1
  // ==========================================

  "Georgia Rule 135 Overview": engagementStyles + banners.rule135 + `
<div class="lesson-content">

<div class="lesson-intro">
<h3>Why This Matters</h3>
<p>Georgia Rule 135-11-.01 establishes requirements that protect both clients and practitioners. Understanding the "why" behind regulations strengthens compliance.</p>
</div>

<hr class="section-divider" />

<h2>Scope of Rule 135</h2>
<p>Applies to all Georgia-licensed counselors providing telehealth services, whether the client is in Georgia or another jurisdiction where you hold licensure.</p>

<div class="fun-fact">
<span class="fun-fact-icon">💡</span>
<strong>Did You Know?</strong> Georgia was one of the first states to create specific telehealth rules for counselors. Rule 135 has been a model for other state boards developing their own regulations.
</div>

<h2>Core Requirements</h2>
<ol>
<li><strong>Licensure:</strong> Active Georgia LPC/LAPC/LMFT/LAMFT in good standing</li>
<li><strong>Technology:</strong> HIPAA-compliant, encrypted, real-time communication</li>
<li><strong>Informed Consent:</strong> Telehealth-specific risks, emergency procedures, alternatives</li>
<li><strong>Identity Verification:</strong> Verify client identity each session</li>
<li><strong>Location Documentation:</strong> Document client's physical location each session</li>
</ol>

<div class="knowledge-check">
<h4>🎯 Compliance Check</h4>
<p>Which items are REQUIRED by Rule 135? (Select all that apply)</p>
<ol>
<li>Signed telehealth-specific informed consent</li>
<li>Recording every session</li>
<li>Documenting client location each session</li>
<li>Using only video (no phone sessions)</li>
<li>Emergency protocol established</li>
</ol>
<details class="answer-reveal">
<summary>Click to Reveal Answers</summary>
<p>Required: <strong>1, 3, 5</strong> | NOT required: 2 (recording), 4 (audio-only permitted under certain conditions)</p>
</details>
</div>

<h2>Emergency Protocols Required</h2>
<ul>
<li>Client's physical address at each session</li>
<li>Local emergency contacts for client's location</li>
<li>Protocol for technology failures during crisis</li>
<li>Backup communication methods</li>
</ul>

<div class="key-takeaway">
<h4>🔑 Key Takeaway</h4>
<p>Compliance checklist: Active license ✓ HIPAA platform ✓ Telehealth consent ✓ Emergency protocol ✓ Location documented ✓ Identity verified ✓</p>
</div>

</div>`,

  // ==========================================
  // TELEHEALTH - LESSON 2
  // ==========================================

  "Ethical Decision Making in Telehealth": engagementStyles + banners.ethics + `
<div class="lesson-content">

<div class="lesson-intro">
<h3>Why This Matters</h3>
<p>Telehealth creates ethical situations existing codes may not address. This lesson builds your capacity for nuanced ethical reasoning in the virtual environment.</p>
</div>

<hr class="section-divider" />

<h2>Foundational Principles</h2>
<ul>
<li><strong>Beneficence:</strong> Acting in client's best interest</li>
<li><strong>Nonmaleficence:</strong> Avoiding harm including technology-related risks</li>
<li><strong>Autonomy:</strong> Supporting self-determination through informed consent</li>
<li><strong>Justice:</strong> Ensuring equitable access</li>
<li><strong>Fidelity:</strong> Maintaining boundaries in virtual environment</li>
</ul>

<div class="fun-fact">
<span class="fun-fact-icon">💡</span>
<strong>Did You Know?</strong> Research shows "Zoom fatigue" affects therapists too—the constant eye contact on video is more intense than in-person. Building in screen breaks is an ethical self-care practice!
</div>

<h2>Boundary Considerations</h2>
<p><strong>Physical:</strong> Professional environment on camera, appropriate locations</p>
<p><strong>Time:</strong> Start/end on time, between-session communication policies</p>
<p><strong>Relational:</strong> Screen-mediated intimacy can create false familiarity</p>

<div class="knowledge-check">
<h4>🎯 Ethical Dilemma</h4>
<p>A client joins session from their car in a parking lot. They say it's the only place they have privacy. What ethical principles are in tension?</p>
<details class="answer-reveal">
<summary>Click to Explore</summary>
<p><strong>Autonomy</strong> (client's right to choose their space) vs. <strong>Nonmaleficence</strong> (safety concerns—what if crisis occurs in public?) vs. <strong>Beneficence</strong> (is this the best care option?). Document the discussion and client's reasoning.</p>
</details>
</div>

<h2>Decision-Making Framework</h2>
<ol>
<li>Identify the ethical issue</li>
<li>Review relevant codes and laws</li>
<li>Consider stakeholders</li>
<li>Generate options</li>
<li>Evaluate against principles</li>
<li>Decide and document</li>
<li>Reflect on outcome</li>
</ol>

<div class="key-takeaway">
<h4>🔑 Key Takeaway</h4>
<p>When facing novel telehealth dilemmas, return to foundational principles. Document your reasoning—ethical documentation protects both you and your clients.</p>
</div>

</div>`,

  // ==========================================
  // TELEHEALTH - LESSON 3 (NEW)
  // ==========================================

  "Clinical Appropriateness Screening for Telehealth": engagementStyles + banners.appropriateness + `
<div class="lesson-content">

<div class="lesson-intro">
<h3>Why This Matters</h3>
<p>Not every client, condition, or situation is appropriate for telehealth. Systematic screening protects clients from inadequate care and practitioners from liability.</p>
</div>

<hr class="section-divider" />

<h2>Three-Domain Assessment Model</h2>

<h3>Domain 1: Client Factors</h3>
<ul>
<li>Reliable internet and device with camera?</li>
<li>Can navigate platform independently?</li>
<li>Hearing/vision impairments affecting video?</li>
<li>Cognitive limitations with technology?</li>
</ul>

<h3>Domain 2: Clinical Factors</h3>

<div class="fun-fact">
<span class="fun-fact-icon">💡</span>
<strong>Did You Know?</strong> Research shows telehealth is equally effective as in-person therapy for mild-moderate depression and anxiety. However, clients with active suicidal ideation show better outcomes with in-person care where safety can be more directly managed.
</div>

<p><strong>✅ Generally Appropriate:</strong> Adjustment disorders, mild-moderate anxiety/depression, relationship concerns, grief, stress management</p>

<p><strong>⚠️ Requires Enhanced Assessment:</strong> PTSD (dissociation risk), eating disorders, substance use, personality disorders</p>

<p><strong>❌ Generally Contraindicated:</strong> Active suicidal ideation with plan, acute psychosis, severe dissociation, DV with perpetrator present</p>

<h3>Domain 3: Environmental Factors</h3>
<ul>
<li>Private space available?</li>
<li>Who else is in the home?</li>
<li>Domestic violence or coercive control?</li>
<li>Can speak freely?</li>
</ul>

<div class="knowledge-check">
<h4>🎯 Decision Matrix Practice</h4>
<p>Categorize each scenario as GREEN (appropriate), YELLOW (enhanced protocols), or RED (in-person indicated):</p>
<ol>
<li>Stable GAD, reliable WiFi, private home office</li>
<li>PTSD with occasional dissociation, supportive partner nearby</li>
<li>Active SI with plan, lives alone, rural area</li>
<li>Adjustment disorder, shared apartment, uses headphones</li>
</ol>
<details class="answer-reveal">
<summary>Click to Reveal Answers</summary>
<p>1-GREEN, 2-YELLOW (enhanced safety planning, grounding protocols), 3-RED (needs in-person/higher level of care), 4-GREEN (headphones address privacy)</p>
</details>
</div>

<h2>Screening Questions for Intake</h2>
<ol>
<li>"Where will you typically be during sessions? Will you have privacy?"</li>
<li>"Who else lives in your home?"</li>
<li>"Do you have reliable internet and a device with camera?"</li>
<li>"Is there anything that might make it difficult to speak freely?"</li>
<li>"If you were in crisis, who could you contact locally?"</li>
</ol>

<div class="key-takeaway">
<h4>🔑 Key Takeaway</h4>
<p>Appropriateness isn't static—reassess when symptoms worsen, living situations change, or treatment phases transition (e.g., beginning trauma processing).</p>
</div>

</div>`,

  // ==========================================
  // TELEHEALTH - LESSON 4
  // ==========================================

  "Platform Comparison and Setup": engagementStyles + banners.platform + `
<div class="lesson-content">

<div class="lesson-intro">
<h3>Why This Matters</h3>
<p>Technology selection impacts clinical effectiveness, compliance, and client experience. The goal is technology that disappears into the background, supporting rather than interfering with clinical work.</p>
</div>

<hr class="section-divider" />

<h2>Selection Criteria</h2>
<ul>
<li><strong>HIPAA Compliance:</strong> BAA, encryption, access controls</li>
<li><strong>Functionality:</strong> Video quality, waiting room, screen sharing</li>
<li><strong>Client Experience:</strong> No download preferred, mobile-friendly</li>
</ul>

<div class="fun-fact">
<span class="fun-fact-icon">💡</span>
<strong>Did You Know?</strong> Standard Zoom is NOT HIPAA-compliant! You need "Zoom for Healthcare" which costs more but includes the required BAA and security features. Many therapists don't realize this distinction.
</div>

<h2>Platform Comparison</h2>
<table class="matching-table">
<tr><th>Platform</th><th>Cost</th><th>Key Feature</th></tr>
<tr><td>Doxy.me</td><td>Free - $35/mo</td><td>No download, browser-based</td></tr>
<tr><td>SimplePractice</td><td>$69-99/mo</td><td>Integrated with EHR</td></tr>
<tr><td>Zoom Healthcare</td><td>$200+/yr</td><td>Robust features, reliable</td></tr>
<tr><td>Thera-LINK</td><td>$35-50/mo</td><td>Built for mental health</td></tr>
</table>

<div class="knowledge-check">
<h4>🎯 Setup Checklist</h4>
<p>Which are required for HIPAA-compliant telehealth? (Select all that apply)</p>
<ol>
<li>Business Associate Agreement (BAA)</li>
<li>4K video camera</li>
<li>End-to-end encryption</li>
<li>Session recording capability</li>
<li>Waiting room feature</li>
</ol>
<details class="answer-reveal">
<summary>Click to Reveal Answers</summary>
<p>Required: <strong>1, 3</strong> | Recommended but not required: 5 | Not required: 2, 4</p>
</details>
</div>

<h2>Technical Setup</h2>
<ul>
<li>Internet: Minimum 10 Mbps (wired ethernet preferred)</li>
<li>Camera: Eye level positioning</li>
<li>Lighting: Front-facing, not behind you</li>
<li>Audio: External mic or quality headset</li>
</ul>

<h2>Environment Setup</h2>
<ul>
<li>Professional, neutral background</li>
<li>Remove personal/distracting items</li>
<li>Private space, "Session in Progress" sign</li>
<li>Notifications disabled</li>
</ul>

<div class="key-takeaway">
<h4>🔑 Key Takeaway</h4>
<p>Test your setup before each day of sessions. Technology problems break therapeutic flow—prevention is easier than repair.</p>
</div>

</div>`,

  // ==========================================
  // TELEHEALTH - LESSON 5
  // ==========================================

  "Crisis Protocols for Telehealth Practice": engagementStyles + banners.crisis + `
<div class="lesson-content">

<div class="lesson-intro">
<h3>Why This Matters</h3>
<p>You can't physically intervene remotely. Crisis response in telehealth requires adapted protocols and proactive preparation—not reactive improvisation.</p>
</div>

<hr class="section-divider" />

<h2>Unique Challenges</h2>
<ul>
<li><strong>Physical distance:</strong> Can't prevent self-harm directly</li>
<li><strong>Location uncertainty:</strong> Client may not be where expected</li>
<li><strong>Technology dependence:</strong> Connection can fail at critical moments</li>
<li><strong>Delayed emergency response:</strong> Dispatching help takes longer</li>
</ul>

<div class="fun-fact">
<span class="fun-fact-icon">💡</span>
<strong>Did You Know?</strong> The average 911 response time is 7-10 minutes—but that assumes you know exactly where the client is. Verifying location at session start can save critical minutes in an emergency.
</div>

<h2>Pre-Crisis Preparation (Collect at Intake)</h2>
<ul>
<li>Client's physical address (street, not P.O. Box)</li>
<li>Cell phone number</li>
<li>Emergency contact (name, relationship, phone)</li>
<li>Local police non-emergency number</li>
<li>Local crisis line</li>
<li>Nearest ER with psychiatric services</li>
</ul>

<h2>Session-Start Protocol (EVERY Session)</h2>
<ol>
<li>"Can you confirm your current location/address?"</li>
<li>"Is your emergency contact still [name, number]?"</li>
<li>"Do you have your phone nearby if we get disconnected?"</li>
</ol>

<div class="knowledge-check">
<h4>🎯 Crisis Response by Risk Level</h4>
<p>Match the risk level to the appropriate response:</p>
<table class="matching-table">
<tr><th>Risk Level</th><th>Response</th></tr>
<tr><td>1. LOW (ideation, no plan)</td><td>A. DO NOT END SESSION, call 911, stay on video</td></tr>
<tr><td>2. MODERATE (vague plan)</td><td>B. Safety planning, increase session frequency</td></tr>
<tr><td>3. HIGH (specific plan, means)</td><td>C. Don't end until safe, engage support person, secure means</td></tr>
</table>
<details class="answer-reveal">
<summary>Click to Reveal Answers</summary>
<p>1-B, 2-C, 3-A</p>
</details>
</div>

<h2>Technology Failure During Crisis</h2>
<ol>
<li>IMMEDIATELY call client's cell (within 30 seconds)</li>
<li>No answer after 2 min → call emergency contact</li>
<li>Can't reach anyone in 5 min → call 911 for welfare check</li>
<li>Document all attempts with timestamps</li>
</ol>

<div class="key-takeaway">
<h4>🔑 Key Takeaway</h4>
<p>Create a Crisis Quick Reference Card for each client with all emergency info. Keep it visible during every session.</p>
</div>

</div>`,

  // ==========================================
  // TELEHEALTH - LESSON 6
  // ==========================================

  "Culturally Responsive Telehealth Practice": engagementStyles + banners.cultural + `
<div class="lesson-content">

<div class="lesson-intro">
<h3>Why This Matters</h3>
<p>Telehealth can both bridge and create cultural barriers. Clinicians who assume universal access and preferences risk inadvertently excluding clients from marginalized communities.</p>
</div>

<hr class="section-divider" />

<h2>The Digital Divide</h2>
<ul>
<li>Socioeconomic barriers to devices/internet</li>
<li>Geographic disparities in broadband</li>
<li>Generational differences in tech comfort</li>
<li>Language barriers in platform interfaces</li>
<li>Disability access needs</li>
</ul>

<div class="fun-fact">
<span class="fun-fact-icon">💡</span>
<strong>Did You Know?</strong> 21% of rural Americans lack broadband internet access, compared to 2% of urban residents. Offering phone sessions isn't just convenience—it's equity.
</div>

<h2>Privacy Across Cultures</h2>
<p>Many cultures include multigenerational households. Don't assume private rooms are available.</p>
<p><strong>Adaptations:</strong> Discuss constraints without judgment, explore creative solutions (car, outdoor space), offer scheduling flexibility, use headphones.</p>

<h2>Communication Styles</h2>
<p><strong>Eye Contact:</strong> Norms vary significantly. Looking at camera can feel unnaturally intense for some cultures.</p>
<p><strong>Nonverbal:</strong> Video limits full body language observation. Ask about rather than assume meaning.</p>

<div class="knowledge-check">
<h4>🎯 Self-Reflection</h4>
<p>Consider these questions (no "right" answers—reflection is the goal):</p>
<ol>
<li>What assumptions do I make about who can access telehealth?</li>
<li>How might my visible environment impact clients from different backgrounds?</li>
<li>What cultural groups do I feel less competent serving virtually?</li>
<li>How do I address technology barriers without judgment?</li>
</ol>
</div>

<h2>Intersectionality Considerations</h2>
<p>Consider intersections of: race/ethnicity, immigration status, language, disability, socioeconomic status, geography, LGBTQ+ identity, age/generation.</p>

<div class="key-takeaway">
<h4>🔑 Key Takeaway</h4>
<p>Offer multiple modalities (video, phone, in-person). Don't assume technology problems are resistance—they may be access barriers.</p>
</div>

</div>`,

  // ==========================================
  // TELEHEALTH - LESSON 7
  // ==========================================

  "Building a Sustainable Telehealth Practice": engagementStyles + banners.sustainable + `
<div class="lesson-content">

<div class="lesson-intro">
<h3>Why This Matters</h3>
<p>Screen fatigue, blurred boundaries, and isolation are real occupational hazards. Building sustainable telehealth practice requires intentional attention to wellbeing—not just compliance.</p>
</div>

<hr class="section-divider" />

<h2>Practice Model Options</h2>
<p><strong>Full Telehealth:</strong> No office overhead, geographic flexibility, but may limit client population</p>
<p><strong>Hybrid:</strong> Flexibility for client needs, but requires dual infrastructure</p>

<div class="fun-fact">
<span class="fun-fact-icon">💡</span>
<strong>Did You Know?</strong> Studies show therapists report higher burnout rates with back-to-back video sessions than in-person. The cognitive load of constant eye contact and reduced nonverbal cues is real—build in breaks!
</div>

<h2>Setting Boundaries</h2>
<p><strong>Physical:</strong> Dedicated workspace with door, professional background, separate from living space</p>
<p><strong>Time:</strong> Defined work hours, transition rituals, protected breaks</p>
<p><strong>Psychological:</strong> Work stays in workspace, "end of day" routines, separate devices if possible</p>

<div class="knowledge-check">
<h4>🎯 Burnout Prevention Quiz</h4>
<p>Which practices help prevent telehealth burnout?</p>
<ol>
<li>Scheduling back-to-back sessions to "get it done"</li>
<li>Using the 20-20-20 rule (every 20 min, look 20 ft away for 20 sec)</li>
<li>Working from the couch for comfort</li>
<li>Regular peer consultation</li>
<li>Building screen breaks into your day</li>
</ol>
<details class="answer-reveal">
<summary>Click to Reveal Answers</summary>
<p>Helpful: <strong>2, 4, 5</strong> | Harmful: 1 (contributes to fatigue), 3 (blurs boundaries)</p>
</details>
</div>

<h2>Preventing Screen Fatigue</h2>
<ul>
<li>Limit back-to-back sessions</li>
<li>Build screen breaks into your day</li>
<li>Look away periodically during sessions</li>
<li>20-20-20 rule</li>
</ul>

<h2>Combating Isolation</h2>
<ul>
<li>Regular peer consultation</li>
<li>Professional community involvement</li>
<li>Occasional coworking spaces</li>
<li>Scheduled social connection</li>
</ul>

<div class="fill-in-blank">
<h4>📝 Create Your Plan</h4>
<p>Complete your sustainability checklist:</p>
<ul>
<li>My ideal practice model is: __________</li>
<li>My transition ritual at end of day will be: __________</li>
<li>I will connect with peers by: __________</li>
<li>I will take screen breaks every ____ minutes</li>
</ul>
</div>

<div class="key-takeaway">
<h4>🔑 Key Takeaway</h4>
<p>Schedule quarterly practice reviews. What's working? What's draining? Sustainable practice requires ongoing adjustment, not set-it-and-forget-it.</p>
</div>

</div>`

};

// ============================================
// UPDATE FUNCTION
// ============================================

async function updateLessons() {
  console.log('Starting lesson updates with engagement elements...\n');
  
  let updatedCount = 0;
  let notFoundCount = 0;

  const courses = await Course.find({});
  
  for (const course of courses) {
    console.log(`\n📚 Processing: ${course.title}`);
    
    let courseModified = false;
    
    for (let m = 0; m < course.modules.length; m++) {
      for (let l = 0; l < course.modules[m].lessons.length; l++) {
        const lesson = course.modules[m].lessons[l];
        
        // Check if we have updated content for this lesson
        const newContent = lessonUpdates[lesson.title];
        
        if (newContent) {
          course.modules[m].lessons[l].content = newContent;
          course.modules[m].lessons[l].type = 'text';
          course.modules[m].lessons[l].videoUrl = undefined;
          courseModified = true;
          updatedCount++;
          console.log(`  ✅ Updated: ${lesson.title}`);
        }
      }
    }
    
    if (courseModified) {
      await course.save();
      console.log(`  💾 Saved: ${course.title}`);
    }
  }

  console.log('\n========================================');
  console.log('UPDATE SUMMARY');
  console.log('========================================');
  console.log(`✅ Updated: ${updatedCount} lessons`);
  console.log(`   - Header banners added`);
  console.log(`   - Intros shortened to 2-3 sentences`);
  console.log(`   - Visual separators added`);
  console.log(`   - Engagement elements added`);
  console.log('========================================\n');
}

updateLessons()
  .then(() => {
    console.log('Update complete!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Update failed:', err);
    process.exit(1);
  });
