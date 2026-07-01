/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// CR-TMH601-Mastering_TeleMental_Health-41451words.js
// Seed script for CounselorReady interactivecourses collection
// Deploy: node CR-TMH601-Mastering_TeleMental_Health-41451words.js
// Requires: MONGODB_URI environment variable

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌ No MONGODB_URI environment variable set");
  process.exit(1);
}

// ═══ ASSESSMENT QUESTIONS (20 questions, balanced A=4 B=4 C=6 D=6) ═══
const ASSESSMENT_QUESTIONS = [
  {
    question: "Georgia Rule 135-11-.01 requires how many hours of telehealth-specific continuing education before a licensee may provide telemental health services?",
    options: ["3 hours", "10 hours", "12 hours", "6 hours"],
    correctAnswer: 3,
    explanation: "Rule 135-11 mandates 6 hours of telehealth-specific CE training within the 5 years preceding the provision of telemental health services."
  },
  {
    question: "Under Georgia Rule 135-11, what type(s) of informed consent must be obtained before delivering telemental health services?",
    options: ["Written consent only", "Verbal consent only", "Both verbal AND written consent, documented in the record", "Electronic consent via the telehealth platform"],
    correctAnswer: 2,
    explanation: "Georgia requires both verbal and written consent, with both documented in the client's record — stricter than most states."
  },
  {
    question: "A HIPAA-compliant telehealth platform must have which of the following before a clinician may use it for client sessions?",
    options: ["A signed Business Associate Agreement (BAA)", "A free tier available for solo practitioners", "Integration with the clinician's EHR system", "End-to-end encryption certified by the FCC"],
    correctAnswer: 0,
    explanation: "HIPAA requires a BAA with any vendor that creates, receives, maintains, or transmits PHI."
  },
  {
    question: "Which of the following platforms is NOT considered HIPAA-compliant for telemental health use?",
    options: ["Doxy.me (free tier)", "Zoom for Healthcare", "Consumer Zoom (standard free version)", "SimplePractice Telehealth"],
    correctAnswer: 2,
    explanation: "Consumer Zoom is NOT the same product as Zoom for Healthcare and does not include a BAA."
  },
  {
    question: "When conducting a mental status examination via telehealth, which domain is MOST limited by the video format?",
    options: ["Thought process and content", "Speech characteristics", "Psychomotor activity below the camera frame", "Mood as reported by the client"],
    correctAnswer: 2,
    explanation: "Video typically shows only the face and upper torso, making lower body psychomotor activity invisible."
  },
  {
    question: "Georgia Rule 135-11 requires that telehealth suitability screening assess the client across which domains?",
    options: ["Clinical appropriateness only", "Financial ability to pay and insurance coverage", "Clinical appropriateness and technology access", "Clinical, technological, and environmental suitability"],
    correctAnswer: 3,
    explanation: "A comprehensive suitability assessment evaluates clinical appropriateness, technological capacity, and environmental suitability."
  },
  {
    question: "The legal principle governing which state's laws apply during a telehealth session is based on:",
    options: ["The state where the clinician is physically located", "The state where the clinician holds their primary license", "The state where the client is physically located at the time of the session", "The state where the telehealth platform's servers are located"],
    correctAnswer: 2,
    explanation: "Services are considered delivered in the state where the client is physically located."
  },
  {
    question: "When a client discloses active suicidal ideation with a plan during a telehealth session, the clinician's FIRST step should be:",
    options: ["Maintain calm therapeutic presence and conduct a structured risk assessment", "Immediately call 911 in the client's jurisdiction", "End the session and refer the client to a crisis hotline", "Contact the client's emergency contact person"],
    correctAnswer: 0,
    explanation: "The first step is maintaining therapeutic presence and conducting a structured risk assessment (e.g., C-SSRS)."
  },
  {
    question: "If the video connection drops during a crisis event with a client, the clinician should:",
    options: ["Wait for the client to reconnect on their own", "Immediately contact law enforcement for a welfare check", "Attempt to reconnect via platform, then phone, then emergency contact, then 911 if needed", "Document the disconnection and schedule a follow-up session"],
    correctAnswer: 2,
    explanation: "The protocol follows a stepped escalation: reconnect via platform → phone → emergency contact → emergency services."
  },
  {
    question: "Which encryption standard is recommended by NIST for protecting healthcare data in telehealth communications?",
    options: ["SSL 3.0", "TLS 1.0", "WEP", "AES-256"],
    correctAnswer: 3,
    explanation: "AES-256 is the NIST-recommended standard for healthcare data encryption."
  },
  {
    question: "A Georgia-licensed supervisor providing clinical supervision via telehealth must complete how many ADDITIONAL hours of telehealth training beyond the standard 6-hour requirement?",
    options: ["3 additional hours", "0 additional hours", "6 additional hours", "10 additional hours"],
    correctAnswer: 0,
    explanation: "Georgia requires supervisors to complete 3 additional hours of supervisor-specific telehealth training."
  },
  {
    question: "The primary advantage of Doxy.me over other telehealth platforms for clients with limited technology proficiency is:",
    options: ["It offers the highest video quality available", "It requires no software download — sessions run entirely in a web browser", "It includes integrated EHR and billing features", "It provides free group therapy functionality"],
    correctAnswer: 1,
    explanation: "Doxy.me's zero-download approach means clients simply click a link — no apps to install."
  },
  {
    question: "Under HIPAA's Breach Notification Rule, affected individuals must be notified of a breach of unsecured PHI within:",
    options: ["24 hours of discovery", "30 days of discovery", "90 days of discovery", "60 days of discovery"],
    correctAnswer: 3,
    explanation: "HIPAA requires notification without unreasonable delay and no later than 60 days from discovery."
  },
  {
    question: "When adapting EMDR therapy for telehealth delivery, bilateral stimulation can be achieved through all of the following EXCEPT:",
    options: ["Therapist-guided eye movements via video screen", "Client self-administered butterfly hug tapping", "Technology-assisted BLS applications", "Therapist physically guiding the client's eye movements"],
    correctAnswer: 3,
    explanation: "Physical guidance of eye movements requires in-person contact and cannot be accomplished through telehealth."
  },
  {
    question: "Georgia Rule 135-11 requires that the informed consent for telemental health include disclosure of:",
    options: ["The clinician's malpractice insurance carrier", "Any third-party vendors such as billing services or record-keeping platforms", "The cost comparison between telehealth and in-person services", "The clinician's personal home address"],
    correctAnswer: 1,
    explanation: "Rule 135-11 specifically requires disclosure of third-party vendors including record-keeping and billing services."
  },
  {
    question: "The Counseling Compact, when fully implemented, will allow eligible licensed counselors to:",
    options: ["Obtain a privilege to practice in compact member states without separate licensure in each state", "Practice in any state without any license", "Bill Medicare at a higher reimbursement rate", "Bypass HIPAA requirements for interstate telehealth"],
    correctAnswer: 0,
    explanation: "The Compact creates a privilege-to-practice model for eligible counselors in member states."
  },
  {
    question: "In telehealth practice, 'Zoom fatigue' is primarily caused by:",
    options: ["Poor internet bandwidth causing video lag", "Inadequate lighting in the clinician's office", "Using consumer Zoom instead of Zoom for Healthcare", "The cognitive load of self-monitoring on screen, sustained close-up eye contact, and reduced mobility"],
    correctAnswer: 3,
    explanation: "Research identifies self-image monitoring, unnatural sustained gaze, and reduced mobility as primary contributors."
  },
  {
    question: "For a client experiencing domestic violence, the MOST critical telehealth-specific safety consideration is:",
    options: ["Ensuring the client has a high-speed internet connection", "Assessing whether the abusive partner monitors the client's technology use or internet history", "Making sure the client's camera is at eye level", "Providing the client with a list of recommended telehealth platforms"],
    correctAnswer: 1,
    explanation: "Technology-facilitated coercive control poses a direct safety risk that must be assessed."
  },
  {
    question: "The correct Medicare place-of-service code for a telehealth session delivered to a client located in their home is:",
    options: ["POS 10", "POS 11", "POS 02", "POS 95"],
    correctAnswer: 2,
    explanation: "POS 02 indicates telehealth services delivered to a patient in their home."
  },
  {
    question: "Failure to comply with Georgia Rule 135-11 requirements constitutes:",
    options: ["A minor administrative violation with no consequences", "Unprofessional conduct under the Code of Ethics as described in Board Rule 135-7", "Automatic license revocation", "A HIPAA violation subject to federal enforcement"],
    correctAnswer: 1,
    explanation: "Rule 135-11 explicitly states that failure to comply constitutes unprofessional conduct under Board Rule 135-7."
  },
];

// ═══ COURSE DATA ═══
const COURSE_DATA = {
  slug: "mastering-telemental-health-ga-compliant-virtual-practice",
  title: "Mastering TeleMental Health: An Essential Guide to Compliant Virtual Healthcare Practice",
  subtitle: "Georgia Rule 135-11 Compliant • Comprehensive Virtual Practice Training",
  description: "This comprehensive 6-hour continuing education course provides mental health professionals with the knowledge, skills, and practical tools needed to establish and maintain compliant, effective, and sustainable telemental health practices. With specific emphasis on Georgia Rule 135-11 requirements, HIPAA compliance, platform selection, clinical adaptations, crisis intervention protocols, cultural responsiveness, and ethical decision-making in digital practice.",
  courseCode: "CR-TMH601",
  instructor: "GA Integrated Therapeutic Perspectives LLC",

  // CE Metadata
  ceHours: 6,
  ceCategory: "Telehealth",
  ceuHours: 6,
  ceuEligible: true,
  approvingBody: "NBCC",
  approvalNumber: "#7760",

  // Access & Pricing
  accessType: "paid",
  price: 98.00,
  pricingTier: "premium",

  // Status — save as draft for review
  status: "draft",
  isPublished: false,

  // Learning Objectives (8)
  objectives: [
    "Analyze the historical evolution and current regulatory landscape of telemental health practice, including federal legislation, state-specific requirements, and the impact of the COVID-19 pandemic on permanent policy changes.",
    "Evaluate telehealth technology platforms against HIPAA compliance requirements, including end-to-end encryption standards, Business Associate Agreement provisions, and minimum technical specifications for secure clinical use.",
    "Develop comprehensive telehealth-specific informed consent documents that address technology risks, privacy limitations, emergency protocols, recording policies, and interstate practice restrictions consistent with ACA, NASW, and AAMFT ethical codes.",
    "Adapt evidence-based clinical assessment techniques for virtual service delivery, including modifications to mental status examinations, risk assessments, and standardized screening instruments.",
    "Implement structured crisis intervention protocols for telehealth settings, including cross-jurisdictional emergency coordination, technology failure contingency plans, and remote safety planning strategies.",
    "Design culturally responsive telehealth service delivery models that address barriers related to technology access, digital literacy, language diversity, disability accommodations, and underserved populations.",
    "Apply ethical decision-making frameworks to complex telehealth-specific dilemmas including dual relationships in digital spaces, social media boundaries, confidentiality in shared environments, and AI integration.",
    "Construct a sustainable telehealth practice model incorporating boundary-setting strategies, burnout prevention techniques, business planning considerations, and ongoing professional development plans.",
  ],

  // Target Audience
  targetAudience: [
    "Licensed Professional Counselors (LPC)",
    "Licensed Associate Professional Counselors (LAPC)",
    "Licensed Clinical Social Workers (LCSW)",
    "Licensed Marriage and Family Therapists (LMFT)",
    "Licensed Mental Health Counselors (LMHC)",
    "National Certified Counselors (NCC)",
    "Psychologists",
    "Psychiatric Nurse Practitioners",
  ],

  instructionalLevel: "Intermediate to Advanced",

  // Categories & Tags
  categories: ["Telehealth", "Ethics", "Professional Practice", "Georgia Requirements", "Clinical Practice"],
  tags: ["telehealth", "telemental health", "Georgia", "HIPAA", "Rule 135-11", "virtual practice", "crisis intervention", "informed consent", "platform comparison", "suitability screening"],

  // ═══ SECTIONS ═══
  sections: [
    {
      title: "Foundations of Telemental Health Practice",
      sectionNumber: 1,
      contentBlocks: [
        { type: "sectionDivider", title: "Section 1", subtitle: "Foundations of Telemental Health Practice" },
        { type: "text", textContent: "<p><em>Content imported from docx — Section 1: Historical evolution, definitions, modalities, pandemic impact, evidence base, competency standards, disparities, international perspectives, scope of practice.</em></p>" },
      ]
    },
    {
      title: "The Regulatory Landscape — Federal and State Frameworks",
      sectionNumber: 2,
      contentBlocks: [
        { type: "sectionDivider", title: "Section 2", subtitle: "The Regulatory Landscape — Federal and State Frameworks" },
        { type: "text", textContent: "<p><em>Content imported from docx — Section 2: HIPAA framework, BAA requirements, Georgia Rule 135-11 (6-hour training, dual consent, suitability assessment, vendor disclosure, supervisor requirements, comparison table), state licensing, reimbursement, billing.</em></p>" },
      ]
    },
    {
      title: "HIPAA Compliance and Technology Infrastructure",
      sectionNumber: 3,
      contentBlocks: [
        { type: "sectionDivider", title: "Section 3", subtitle: "HIPAA Compliance and Technology Infrastructure" },
        { type: "text", textContent: "<p><em>Content imported from docx — Section 3: Administrative/physical/technical safeguards, encryption, risk analysis, compliance program, cybersecurity threats.</em></p>" },
      ]
    },
    {
      title: "Platform Selection and Digital Security Protocols",
      sectionNumber: 4,
      contentBlocks: [
        { type: "sectionDivider", title: "Section 4", subtitle: "Platform Selection and Digital Security Protocols" },
        { type: "text", textContent: "<p><em>Content imported from docx — Section 4: Top 5 platform deep-dive (Doxy.me, Zoom Healthcare, SimplePractice, TherapyNotes, Jane App — pros, cons, pricing, best-for), incident response, security maintenance, cloud storage, client troubleshooting, office setup.</em></p>" },
      ]
    },
    {
      title: "Informed Consent and Clinical Documentation",
      sectionNumber: 5,
      contentBlocks: [
        { type: "sectionDivider", title: "Section 5", subtitle: "Informed Consent and Clinical Documentation for Virtual Practice" },
        { type: "text", textContent: "<p><em>Content imported from docx — Section 5: Enhanced consent requirements, essential elements, ongoing consent, state-specific requirements, documentation standards, templates, client orientation.</em></p>" },
      ]
    },
    {
      title: "Clinical Assessment Adaptations for Telehealth",
      sectionNumber: 6,
      contentBlocks: [
        { type: "sectionDivider", title: "Section 6", subtitle: "Clinical Assessment Adaptations for Telehealth" },
        { type: "text", textContent: "<p><em>Content imported from docx — Section 6: MSE adaptations, standardized instrument administration, risk assessment, suitability screening framework (3-domain model), collateral information, functional assessment, treatment progress monitoring.</em></p>" },
      ]
    },
    {
      title: "Evidence-Based Treatment Modifications",
      sectionNumber: 7,
      contentBlocks: [
        { type: "sectionDivider", title: "Section 7", subtitle: "Evidence-Based Treatment Modifications for Virtual Delivery" },
        { type: "text", textContent: "<p><em>Content imported from docx — Section 7: Therapeutic alliance, CBT adaptations, DBT virtual delivery, trauma-focused therapies (PE, CPT, EMDR), couples/family therapy, substance use treatment, group therapy, mindfulness/experiential interventions.</em></p>" },
      ]
    },
    {
      title: "Crisis Intervention and Safety Planning Across Distance",
      sectionNumber: 8,
      contentBlocks: [
        { type: "sectionDivider", title: "Section 8", subtitle: "Crisis Intervention and Safety Planning Across Distance" },
        { type: "text", textContent: "<p><em>Content imported from docx — Section 8: Pre-crisis planning, active suicidal crisis management, technology failure during crisis, cross-jurisdictional coordination, involuntary commitment, documentation, debriefing.</em></p>" },
      ]
    },
    {
      title: "Special Populations and Cultural Considerations",
      sectionNumber: 9,
      contentBlocks: [
        { type: "sectionDivider", title: "Section 9", subtitle: "Special Populations and Cultural Considerations in Telehealth" },
        { type: "text", textContent: "<p><em>Content imported from docx — Section 9: Digital divide, culturally responsive practice, geriatric populations, pediatric/adolescent considerations, disability accommodations, LGBTQ+ populations, military families, rural mental health, trauma-informed technology use.</em></p>" },
      ]
    },
    {
      title: "Ethical Decision-Making in Digital Practice",
      sectionNumber: 10,
      contentBlocks: [
        { type: "sectionDivider", title: "Section 10", subtitle: "Ethical Decision-Making in Digital Practice" },
        { type: "text", textContent: "<p><em>Content imported from docx — Section 10: Confidentiality in shared environments, social media boundaries, AI integration ethics, dual relationships, gifts/value exchange, ethical frameworks, supervision in digital age, record-keeping.</em></p>" },
      ]
    },
    {
      title: "Interstate Practice, Compacts, and Jurisdictional Navigation",
      sectionNumber: 11,
      contentBlocks: [
        { type: "sectionDivider", title: "Section 11", subtitle: "Interstate Practice, Compacts, and Jurisdictional Navigation" },
        { type: "text", textContent: "<p><em>Content imported from docx — Section 11: Client-location rule, Counseling Compact, PSYPACT, alternative authorization models, liability/malpractice, regulatory monitoring, compact preparation.</em></p>" },
      ]
    },
    {
      title: "Building and Sustaining a Telehealth Practice",
      sectionNumber: 12,
      contentBlocks: [
        { type: "sectionDivider", title: "Section 12", subtitle: "Building and Sustaining a Telehealth Practice" },
        { type: "text", textContent: "<p><em>Content imported from docx — Section 12: Business planning, marketing, boundary management, burnout prevention, continuing professional development, legal/risk management, hybrid practice models, financial planning.</em></p>" },
      ]
    },
    {
      title: "Conclusion — Integrating Competent Virtual Care",
      sectionNumber: 13,
      contentBlocks: [
        { type: "sectionDivider", title: "Section 13", subtitle: "Conclusion — Integrating Competent Virtual Care" },
        { type: "text", textContent: "<p><em>Content imported from docx — Section 13: Synthesis of core competencies, ethical practice commitments, resources for continued learning, future of telemental health.</em></p>" },
        {
          type: "resources",
          title: "Bonus Materials — Downloadable Practice Templates",
          description: "These professionally formatted templates are yours to keep and use in your telehealth practice. Each document is branded, editable, and designed for immediate clinical use.",
          resources: [
            {
              title: "TeleMental Health Informed Consent — GA Rule 135-11 Compliant",
              url: "/downloads/CR-TMH601_Informed_Consent_GA_135-11.docx",
              type: "DOCX"
            },
            {
              title: "Telehealth Suitability Screening Form — 3-Domain Assessment",
              url: "/downloads/CR-TMH601_Suitability_Screening_Form.docx",
              type: "DOCX"
            },
            {
              title: "Telehealth Practice Launch Checklist — 7-Phase Implementation Plan",
              url: "/downloads/CR-TMH601_Telehealth_Practice_Launch_Checklist.docx",
              type: "DOCX"
            }
          ]
        },
      ]
    },
  ],

  // ═══ ASSESSMENT ═══
  assessment: {
    title: "Final Assessment: Mastering TeleMental Health",
    passingScore: 80,
    maxAttempts: 3,
    instructions: "This assessment evaluates your comprehensive understanding of telemental health regulations, HIPAA compliance, technology requirements, clinical adaptations, crisis intervention, ethical decision-making, and Georgia-specific requirements under Rule 135-11. You must score 80% or higher (16 of 20 correct) to receive CE credit. You have a maximum of 3 attempts.",
    questions: ASSESSMENT_QUESTIONS,
  },

  // ═══ REFERENCES (21 APA 7th Edition) ═══
  references: [
    { title: "A non-inferiority trial of prolonged exposure for PTSD: In person versus home-based telehealth", author: "Acierno, R., Knapp, R., Tuerk, P., et al.", year: 2017, source: "Behaviour Research and Therapy, 89, 57-65" },
    { title: "ACA code of ethics", author: "American Counseling Association", year: 2014, source: "Author" },
    { title: "Guidelines for the practice of telepsychology", author: "American Psychological Association", year: 2013, source: "American Psychologist, 68(9), 791-800" },
    { title: "Psychologists embrace telehealth to prevent the spread of COVID-19", author: "American Psychological Association", year: 2020, source: "APA Practice Organization" },
    { title: "Computer therapy for the anxiety and depression disorders is effective", author: "Andrews, G., Basu, A., Cuijpers, P., et al.", year: 2018, source: "Journal of Anxiety Disorders, 55, 70-78" },
    { title: "Nonverbal overload: A theoretical argument for the causes of Zoom fatigue", author: "Bailenson, J. N.", year: 2021, source: "Technology, Mind, and Behavior, 2(1)" },
    { title: "Are videoconferenced mental and behavioral health services just as good as in-person?", author: "Batastini, A. B., Paprzycki, P., Jones, A. C. T., & MacLean, N.", year: 2021, source: "Clinical Psychology Review, 83, 101944" },
    { title: "A systematic review of providers' attitudes toward telemental health", author: "Connolly, S. L., Miller, C. J., Lindsay, J. A., & Bauer, M. S.", year: 2020, source: "Clinical Psychology: Science and Practice, 27(2), e12311" },
    { title: "Telepsychiatry: Psychiatric consultation by interactive television", author: "Dwyer, T. F.", year: 1973, source: "American Journal of Psychiatry, 130(8), 865-869" },
    { title: "The alliance in adult psychotherapy: A meta-analytic synthesis", author: "Flückiger, C., Del Re, A. C., Wampold, B. E., & Horvath, A. O.", year: 2018, source: "Psychotherapy, 55(4), 316-340" },
    { title: "An evaluation of crisis hotline outcomes part 2: Suicidal callers", author: "Gould, M. S., Kalafat, J., Harrismunfakh, J. L., & Kleinman, M.", year: 2016, source: "Suicide and Life-Threatening Behavior, 37(3), 338-352" },
    { title: "The effectiveness of telemental health: A 2013 review", author: "Hilty, D. M., Ferrer, D. C., Parish, M. B., et al.", year: 2013, source: "Telemedicine and e-Health, 19(6), 444-454" },
    { title: "The impact of social distancing on people with BPD", author: "Lakeman, R., & Crighton, J.", year: 2021, source: "Issues in Mental Health Nursing, 42(7), 651-658" },
    { title: "EMDR online: Can we do it? If so, how?", author: "Lenferink, L. I. M., Meyerbröker, K., & Boelen, P. A.", year: 2020, source: "Journal of EMDR Practice and Research, 14(4), 257-270" },
    { title: "Digital cognitive behavioral therapy for insomnia: A state-of-the-science review", author: "Luik, A. I., Kyle, S. D., & Espie, C. A.", year: 2017, source: "Current Sleep Medicine Reports, 3(2), 48-56" },
    { title: "Working alliance and outcome effectiveness in videoconferencing psychotherapy", author: "Norwood, C., Moghaddam, N. G., Malins, S., & Sabin-Farrell, R.", year: 2018, source: "Clinical Psychology and Psychotherapy, 25(6), 797-808" },
    { title: "Therapists make the switch to telepsychology to safely continue treating their patients during COVID-19", author: "Sampaio, M., Haro, M. V. N., De Sousa, B., Melo, W. V., & Hoffman, H. G.", year: 2021, source: "Frontiers in Psychology, 12, 613608" },
    { title: "Telehealth for the treatment of serious mental illness and substance use disorders", author: "Substance Abuse and Mental Health Services Administration", year: 2021, source: "SAMHSA Publication No. PEP21-06-02-001" },
    { title: "Improving cost-effectiveness and access to CBT for depression", author: "Thase, M. E., McCrone, P., Barrett, M. S., et al.", year: 2020, source: "Psychotherapy and Psychosomatics, 89(5), 307-313" },
    { title: "Two-way television in group therapy", author: "Wittson, C. L., Affleck, D. C., & Johnson, V.", year: 1961, source: "Mental Hospitals, 12(11), 22-23" },
    { title: "Remote CBT for obsessive-compulsive symptoms: A meta-analysis", author: "Wootton, B. M.", year: 2016, source: "Clinical Psychology Review, 43, 103-113" },
  ],

  // Presenter metadata
  presenter: {
    name: "Kejuiana Johnson",
    credentials: "MA, LPC, NCC, CPCS, BC-TMH",
    degree: "MA",
    licenseNumber: "LPC009587",
    licenseState: "Georgia",
    licenseType: "LPC",
    category: "category1",
  },

  // Settings
  settings: {
    linearProgression: true,
    enforceMinTime: false,
    narrationEnabled: false,
    certificateEnabled: true,
    requireEvaluation: true,
    requireAttestation: true,
    allowRetake: true,
    retakeCooldownDays: 0,
  },

  // Timestamps
  createdAt: new Date(),
  updatedAt: new Date(),
};

// ═══ SEED FUNCTION ═══
async function main() {
  console.log("🔌 Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);

  const db = mongoose.connection.db;
  const collection = db.collection("interactivecourses");

  const existing = await collection.findOne({ slug: COURSE_DATA.slug });

  if (existing) {
    await collection.updateOne(
      { slug: COURSE_DATA.slug },
      { $set: { ...COURSE_DATA, updatedAt: new Date() } }
    );
    console.log(`✅ Updated: ${COURSE_DATA.title}`);
  } else {
    await collection.insertOne(COURSE_DATA);
    console.log(`✅ Created: ${COURSE_DATA.title}`);
  }

  // Stats
  const totalQuestions = COURSE_DATA.assessment.questions.length;
  const totalSections = COURSE_DATA.sections.length;
  const totalRefs = COURSE_DATA.references.length;
  const targetWords = COURSE_DATA.ceHours * 6000;

  console.log("\n📊 Course Statistics:");
  console.log(`   Title: ${COURSE_DATA.title}`);
  console.log(`   Code: ${COURSE_DATA.courseCode}`);
  console.log(`   CE Hours: ${COURSE_DATA.ceHours}`);
  console.log(`   Sections: ${totalSections}`);
  console.log(`   Assessment: ${totalQuestions} questions (80% pass, 3 attempts)`);
  console.log(`   References: ${totalRefs} (APA 7th Edition)`);
  console.log(`   Word count target: ${targetWords.toLocaleString()}+ (docx verified at 41,451)`);
  console.log(`   Status: ${COURSE_DATA.status}`);
  console.log(`   Slug: ${COURSE_DATA.slug}`);
  console.log("\n⚠️  NOTE: Section text content is placeholder. Import full content from docx.");
  console.log("   Source: CR-TMH601_Mastering_TeleMental_Health_6CE.docx (41,451 words)");
  console.log("\n📁 DEPLOY BONUS TEMPLATES:");
  console.log("   Copy these 3 files to client/public/downloads/ in your GitHub repo:");
  console.log("   - CR-TMH601_Informed_Consent_GA_135-11.docx");
  console.log("   - CR-TMH601_Suitability_Screening_Form.docx");
  console.log("   - CR-TMH601_Telehealth_Practice_Launch_Checklist.docx");
  console.log("   Render auto-deploys → students download from /downloads/filename.docx");

  await mongoose.disconnect();
  console.log("\n🔌 Disconnected from MongoDB");
}

main().catch(err => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
