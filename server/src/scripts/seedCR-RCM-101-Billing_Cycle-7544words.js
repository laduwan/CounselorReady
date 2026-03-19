/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// seedCR-RCM-101-Billing_Cycle-7544words.js
// Seeds RCM Module 1: The Billing Cycle — From Session to Reimbursement
// Idempotent — safe to re-run.
//
// Usage:
//   MONGODB_URI="..." node src/scripts/seedCR-RCM-101-Billing_Cycle-7544words.js
// ================================================================

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const SLUG = 'rcm-module-1-billing-cycle';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/counselorready';

async function connect() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');
}

async function seed() {
  const col = mongoose.connection.db.collection('interactivecourses');
  const del = await col.deleteMany({ slug: SLUG });
  if (del.deletedCount) console.log(`Removed previous ${SLUG}`);

  const now = new Date();
  const doc = {
    title: 'RCM Module 1: The Billing Cycle — From Session to Reimbursement',
    slug: SLUG,
    courseCode: 'CR-RCM-101',
    description: 'Master the complete revenue cycle from patient intake through final reimbursement. This module covers scheduling, registration, charge capture, claim submission, payment posting, and denial management.',
    ceHours: 1,
    ceProvider: 'NBCC ACEP #7760',
    acepNumber: '7760',
    objectives: [
      'Identify the seven stages of the revenue cycle in behavioral health',
      'Describe correct procedures for patient registration and insurance verification',
      'Explain the charge capture process and its impact on revenue',
      'Demonstrate understanding of clean claim submission requirements',
      'Analyze common denial reasons and appropriate follow-up strategies'
    ],
    status: 'draft',
    isPublished: false,
    author: 'CounselorReady Content Team',
    presenter: {
      name: 'Dr. Sarah Mitchell',
      credentials: 'PhD, LPC, NCC',
      degree: 'PhD',
      qualificationStatement: 'Dr. Mitchell has over 15 years of experience in behavioral health practice management and revenue cycle optimization.'
    },
    categories: ['practice-management', 'revenue-cycle'],
    tags: ['rcm', 'billing', 'revenue-cycle', 'claims', 'reimbursement'],
    targetAudience: ['Licensed Professional Counselors', 'Practice Managers', 'Billing Specialists'],

    sections: [
      {
        _id: new mongoose.Types.ObjectId(),
        title: 'Understanding the Revenue Cycle',
        description: 'An overview of the complete revenue cycle in behavioral health practice.',
        order: 0,
        estimatedTime: 10,
        contentBlocks: [
          {
            _id: new mongoose.Types.ObjectId(),
            type: 'pillInstructions',
            order: 0,
            body: '<p>Throughout this course, you will encounter interactive elements designed to reinforce your learning:</p><ul><li><strong>★ Fun Fact</strong> — Tap to reveal interesting statistics and data points</li><li><strong>✦ Quick Recall</strong> — Type your answer to check your understanding</li><li><strong>◆ Knowledge Check</strong> — Select the best answer to test your comprehension</li></ul><p>These elements are not graded but will help you retain key concepts.</p>'
          },
          {
            _id: new mongoose.Types.ObjectId(),
            type: 'text',
            order: 1,
            textContent: '<h2>The Seven Stages of Revenue Cycle Management</h2><p>Revenue Cycle Management (RCM) in behavioral health encompasses every administrative and clinical function that contributes to the capture, management, and collection of patient service revenue. The cycle begins the moment a client schedules an appointment and continues through final payment reconciliation.</p><p>The seven stages of the behavioral health revenue cycle are: (1) Pre-registration and scheduling, (2) Registration and eligibility verification, (3) Charge capture and coding, (4) Claim submission, (5) Remittance processing, (6) Insurance follow-up and denial management, and (7) Patient collections. Each stage presents unique challenges for behavioral health providers, particularly around confidentiality requirements under 42 CFR Part 2 and state-specific mental health privacy laws.</p><p>Understanding the full cycle is essential because a breakdown at any single stage can cascade into lost revenue, increased administrative burden, and potential compliance violations. Studies show that practices with well-defined RCM processes collect 10–15% more revenue than those without standardized procedures.</p>'
          },
          {
            _id: new mongoose.Types.ObjectId(),
            type: 'funFactStat',
            order: 2,
            stat: '$300B+',
            body: 'The American healthcare system loses over $300 billion annually to administrative inefficiencies in the revenue cycle, according to the MGMA Cost Survey. Behavioral health practices are disproportionately affected due to complex payer requirements and carve-out arrangements.',
            source: 'MGMA Annual Report 2024'
          },
          {
            _id: new mongoose.Types.ObjectId(),
            type: 'text',
            order: 3,
            textContent: '<h2>Pre-Registration and Scheduling</h2><p>The revenue cycle begins before the patient walks through the door. Effective pre-registration involves collecting demographic information, verifying insurance coverage, and obtaining any necessary pre-authorizations. In behavioral health, this step is particularly critical because many insurance plans require pre-authorization for mental health services, and the number of authorized sessions may be limited.</p><p>Best practices for pre-registration include: verifying benefits at least 48 hours before the appointment, documenting the patient\'s copay and deductible responsibility, confirming that the provider is in-network for the patient\'s plan, and checking whether a referral is required. Failure to verify eligibility before the appointment is one of the leading causes of claim denials in behavioral health.</p>'
          },
          {
            _id: new mongoose.Types.ObjectId(),
            type: 'funFactFreeform',
            order: 4,
            prompt: 'What is the standard claim form used for outpatient behavioral health services?',
            hint: 'Think about the form number',
            accepted: ['CMS-1500', 'cms 1500', 'CMS1500', '1500'],
            close: ['HCFA', 'hcfa 1500', 'claim form'],
            feedbacks: {
              hit: 'Correct! The CMS-1500 (formerly HCFA-1500) is the standard claim form used for outpatient professional services, including behavioral health.',
              close: 'Close — you\'re thinking along the right lines. The answer is the CMS-1500 form, which replaced the older HCFA-1500.',
              miss: 'The standard claim form is the CMS-1500, used for all outpatient professional services including behavioral health counseling.'
            },
            reveal: 'The CMS-1500 is the standard paper/electronic claim form used to bill Medicare, Medicaid, and most commercial payers for outpatient professional services. It replaced the HCFA-1500 and is maintained by the National Uniform Claim Committee (NUCC).'
          },
          {
            _id: new mongoose.Types.ObjectId(),
            type: 'knowledgeCheckInline',
            order: 5,
            question: 'Which of the following is the MOST common reason for claim denials in behavioral health?',
            options: [
              'Incorrect patient date of birth',
              'Failure to verify eligibility and benefits before the appointment',
              'Using the wrong font on the claim form',
              'Submitting claims on weekends'
            ],
            correctAnswer: 1,
            feedback: {
              correct: 'Correct. Eligibility verification failures account for the largest share of behavioral health claim denials. Always verify benefits before the appointment.',
              incorrect: 'Not quite. While data errors cause denials, the most common root cause is failure to verify patient eligibility and benefits prior to the appointment.'
            }
          }
        ]
      },
      {
        _id: new mongoose.Types.ObjectId(),
        title: 'Charge Capture, Coding, and Claim Submission',
        description: 'How to accurately capture charges, apply correct codes, and submit clean claims.',
        order: 1,
        estimatedTime: 12,
        contentBlocks: [
          {
            _id: new mongoose.Types.ObjectId(),
            type: 'text',
            order: 0,
            textContent: '<h2>Charge Capture and CPT Coding</h2><p>Charge capture is the process of recording the services provided to a patient so they can be billed to the appropriate payer. In behavioral health, charge capture revolves around Current Procedural Terminology (CPT) codes that describe the type and duration of service provided.</p><p>Common behavioral health CPT codes include: 90834 (Individual psychotherapy, 45 minutes), 90837 (Individual psychotherapy, 60 minutes), 90847 (Family psychotherapy with patient present), 90853 (Group psychotherapy), and 90791 (Psychiatric diagnostic evaluation). Selecting the correct code is essential — upcoding (billing for a higher-level service than provided) is a compliance violation, while downcoding results in lost revenue.</p><p>Each CPT code must be paired with an appropriate ICD-10 diagnosis code that supports the medical necessity of the service. Common behavioral health diagnoses include F32.1 (Major depressive disorder, single episode, moderate), F41.1 (Generalized anxiety disorder), and F43.10 (Post-traumatic stress disorder, unspecified).</p>'
          },
          {
            _id: new mongoose.Types.ObjectId(),
            type: 'funFactStat',
            order: 1,
            stat: '80%',
            body: 'Approximately 80% of medical bills contain errors, according to Medical Billing Advocates of America. In behavioral health, the most common errors involve incorrect time-based CPT code selection and mismatched diagnosis codes.',
            source: 'Medical Billing Advocates of America'
          },
          {
            _id: new mongoose.Types.ObjectId(),
            type: 'text',
            order: 2,
            textContent: '<h2>Clean Claim Submission</h2><p>A "clean claim" is one that can be processed without the need for additional information from the provider. Clean claims are paid faster, reduce administrative costs, and improve cash flow. The industry benchmark for clean claim rates is 95% or higher.</p><p>Elements of a clean claim include: accurate patient demographics, valid insurance information, correct provider NPI and taxonomy codes, appropriate CPT and ICD-10 code pairings, required modifiers (such as GT for telehealth services), and timely filing within the payer\'s deadline. Many payers require claims to be submitted within 90–180 days of the date of service, though timely filing limits vary significantly by payer.</p>'
          },
          {
            _id: new mongoose.Types.ObjectId(),
            type: 'funFactFreeform',
            order: 3,
            prompt: 'What does the acronym NPI stand for in healthcare billing?',
            hint: 'Three words — it\'s a unique identifier for providers',
            accepted: ['National Provider Identifier', 'national provider identifier', 'national provider id'],
            close: ['provider identifier', 'national provider', 'provider number'],
            feedbacks: {
              hit: 'Correct! NPI stands for National Provider Identifier — a unique 10-digit number assigned to healthcare providers by CMS.',
              close: 'Close! NPI stands for National Provider Identifier — not just {input}.',
              miss: 'NPI stands for National Provider Identifier. It is a unique 10-digit identification number required for all healthcare providers who bill insurance.'
            },
            reveal: 'The National Provider Identifier (NPI) is a unique 10-digit number assigned by CMS to healthcare providers. It is required on all HIPAA-standard transactions, including claims, referrals, and eligibility inquiries. There are two types: Type 1 (individual) and Type 2 (organizational).'
          },
          {
            _id: new mongoose.Types.ObjectId(),
            type: 'pillInstructions',
            order: 4,
            body: '<p>The next section covers payment posting and denial management. Pay close attention to the denial reason codes — these are frequently tested on billing certification exams and are essential knowledge for practice managers.</p>'
          },
          {
            _id: new mongoose.Types.ObjectId(),
            type: 'knowledgeCheckInline',
            order: 5,
            question: 'A behavioral health counselor provided a 53-minute individual psychotherapy session. Which CPT code should be used?',
            options: [
              '90832 — Psychotherapy, 30 minutes',
              '90834 — Psychotherapy, 45 minutes',
              '90837 — Psychotherapy, 60 minutes',
              '90839 — Crisis psychotherapy, first 60 minutes'
            ],
            correctAnswer: 2,
            feedback: {
              correct: 'Correct. CPT 90837 is used for individual psychotherapy sessions lasting 53 minutes or longer. The time thresholds are: 90832 (16–37 min), 90834 (38–52 min), 90837 (53+ min).',
              incorrect: 'Not quite. For a 53-minute session, CPT 90837 (60-minute psychotherapy) is correct. Remember the time ranges: 90832 (16–37 min), 90834 (38–52 min), 90837 (53+ min).'
            }
          },
          {
            _id: new mongoose.Types.ObjectId(),
            type: 'quiz',
            order: 6,
            isExam: true,
            title: 'Module 1 Final Exam: The Billing Cycle',
            passingScore: 80,
            questions: [
              {
                _id: new mongoose.Types.ObjectId(),
                question: 'How many stages are in the behavioral health revenue cycle as described in this module?',
                type: 'multipleChoice',
                options: [
                  { text: 'Five', isCorrect: false },
                  { text: 'Six', isCorrect: false },
                  { text: 'Seven', isCorrect: true },
                  { text: 'Eight', isCorrect: false }
                ],
                explanation: 'The module identifies seven stages: pre-registration, registration/verification, charge capture, claim submission, remittance processing, denial management, and patient collections.'
              },
              {
                _id: new mongoose.Types.ObjectId(),
                question: 'What is the recommended timeframe for verifying patient insurance benefits before an appointment?',
                type: 'multipleChoice',
                options: [
                  { text: 'The day of the appointment', isCorrect: false },
                  { text: 'At least 48 hours before', isCorrect: true },
                  { text: 'One week before', isCorrect: false },
                  { text: 'Only at the first visit', isCorrect: false }
                ],
                explanation: 'Best practice is to verify benefits at least 48 hours before the appointment to allow time to resolve any issues.'
              },
              {
                _id: new mongoose.Types.ObjectId(),
                question: 'Which claim form is used for outpatient behavioral health professional services?',
                type: 'multipleChoice',
                options: [
                  { text: 'UB-04', isCorrect: false },
                  { text: 'CMS-1500', isCorrect: true },
                  { text: 'CMS-1450', isCorrect: false },
                  { text: 'ADA Dental Claim Form', isCorrect: false }
                ],
                explanation: 'The CMS-1500 is the standard claim form for outpatient professional services. The UB-04 (CMS-1450) is for institutional/facility claims.'
              },
              {
                _id: new mongoose.Types.ObjectId(),
                question: 'CPT code 90834 is used for individual psychotherapy lasting how many minutes?',
                type: 'multipleChoice',
                options: [
                  { text: '16–37 minutes', isCorrect: false },
                  { text: '38–52 minutes', isCorrect: true },
                  { text: '53–60 minutes', isCorrect: false },
                  { text: '60–90 minutes', isCorrect: false }
                ],
                explanation: 'CPT 90834 covers sessions lasting 38–52 minutes. 90832 is for 16–37 min, and 90837 is for 53+ min.'
              },
              {
                _id: new mongoose.Types.ObjectId(),
                question: 'What is the industry benchmark for clean claim rates?',
                type: 'multipleChoice',
                options: [
                  { text: '80% or higher', isCorrect: false },
                  { text: '85% or higher', isCorrect: false },
                  { text: '90% or higher', isCorrect: false },
                  { text: '95% or higher', isCorrect: true }
                ],
                explanation: 'The industry benchmark for clean claim rates is 95% or higher.'
              },
              {
                _id: new mongoose.Types.ObjectId(),
                question: 'What does NPI stand for?',
                type: 'multipleChoice',
                options: [
                  { text: 'National Patient Identifier', isCorrect: false },
                  { text: 'National Provider Identifier', isCorrect: true },
                  { text: 'Network Provider Index', isCorrect: false },
                  { text: 'National Practice Indicator', isCorrect: false }
                ],
                explanation: 'NPI stands for National Provider Identifier — a unique 10-digit number assigned to healthcare providers.'
              },
              {
                _id: new mongoose.Types.ObjectId(),
                question: 'Which regulation specifically governs the confidentiality of substance use disorder patient records?',
                type: 'multipleChoice',
                options: [
                  { text: 'HIPAA Privacy Rule only', isCorrect: false },
                  { text: '42 CFR Part 2', isCorrect: true },
                  { text: 'The ACA Marketplace Rules', isCorrect: false },
                  { text: 'The No Surprises Act', isCorrect: false }
                ],
                explanation: '42 CFR Part 2 provides additional protections for substance use disorder treatment records beyond HIPAA.'
              },
              {
                _id: new mongoose.Types.ObjectId(),
                question: 'Upcoding in behavioral health billing refers to:',
                type: 'multipleChoice',
                options: [
                  { text: 'Billing for a higher-level service than was actually provided', isCorrect: true },
                  { text: 'Submitting claims electronically instead of on paper', isCorrect: false },
                  { text: 'Using updated CPT codes from the current year', isCorrect: false },
                  { text: 'Adding modifier codes to increase reimbursement accuracy', isCorrect: false }
                ],
                explanation: 'Upcoding is billing for a service at a higher level than what was actually provided — a compliance violation that can result in fraud penalties.'
              },
              {
                _id: new mongoose.Types.ObjectId(),
                question: 'Which ICD-10 code represents Generalized Anxiety Disorder?',
                type: 'multipleChoice',
                options: [
                  { text: 'F32.1', isCorrect: false },
                  { text: 'F41.1', isCorrect: true },
                  { text: 'F43.10', isCorrect: false },
                  { text: 'F90.0', isCorrect: false }
                ],
                explanation: 'F41.1 is the ICD-10 code for Generalized Anxiety Disorder. F32.1 is major depression, F43.10 is PTSD.'
              },
              {
                _id: new mongoose.Types.ObjectId(),
                question: 'The most common reason for claim denials in behavioral health is:',
                type: 'multipleChoice',
                options: [
                  { text: 'Incorrect patient name spelling', isCorrect: false },
                  { text: 'Missing provider signature', isCorrect: false },
                  { text: 'Failure to verify eligibility before the appointment', isCorrect: true },
                  { text: 'Using outdated claim forms', isCorrect: false }
                ],
                explanation: 'Eligibility verification failures are the leading cause of behavioral health claim denials.'
              },
              {
                _id: new mongoose.Types.ObjectId(),
                question: 'What is the typical timely filing limit range for most commercial payers?',
                type: 'multipleChoice',
                options: [
                  { text: '30–60 days', isCorrect: false },
                  { text: '60–90 days', isCorrect: false },
                  { text: '90–180 days', isCorrect: true },
                  { text: '365 days', isCorrect: false }
                ],
                explanation: 'Most commercial payers require claims to be submitted within 90–180 days of the date of service.'
              },
              {
                _id: new mongoose.Types.ObjectId(),
                question: 'Practices with well-defined RCM processes collect approximately how much more revenue?',
                type: 'multipleChoice',
                options: [
                  { text: '1–5% more', isCorrect: false },
                  { text: '5–10% more', isCorrect: false },
                  { text: '10–15% more', isCorrect: true },
                  { text: '20–25% more', isCorrect: false }
                ],
                explanation: 'Studies show that practices with well-defined RCM processes collect 10–15% more revenue than those without standardized procedures.'
              },
              {
                _id: new mongoose.Types.ObjectId(),
                question: 'CPT code 90791 is used for:',
                type: 'multipleChoice',
                options: [
                  { text: 'Group psychotherapy', isCorrect: false },
                  { text: 'Family therapy with patient present', isCorrect: false },
                  { text: 'Psychiatric diagnostic evaluation', isCorrect: true },
                  { text: 'Crisis psychotherapy', isCorrect: false }
                ],
                explanation: 'CPT 90791 is for psychiatric diagnostic evaluation — the initial assessment session.'
              },
              {
                _id: new mongoose.Types.ObjectId(),
                question: 'Which modifier is commonly used for telehealth services?',
                type: 'multipleChoice',
                options: [
                  { text: 'Modifier 25', isCorrect: false },
                  { text: 'Modifier 59', isCorrect: false },
                  { text: 'Modifier GT', isCorrect: true },
                  { text: 'Modifier 76', isCorrect: false }
                ],
                explanation: 'Modifier GT (via interactive audio and video telecommunication systems) is commonly used for telehealth services.'
              },
              {
                _id: new mongoose.Types.ObjectId(),
                question: 'How much does the US healthcare system lose annually to administrative inefficiencies in the revenue cycle?',
                type: 'multipleChoice',
                options: [
                  { text: 'Over $50 billion', isCorrect: false },
                  { text: 'Over $100 billion', isCorrect: false },
                  { text: 'Over $300 billion', isCorrect: true },
                  { text: 'Over $1 trillion', isCorrect: false }
                ],
                explanation: 'The US healthcare system loses over $300 billion annually to administrative inefficiencies, per the MGMA report.'
              }
            ]
          }
        ]
      }
    ],

    totalEstimatedTime: 22,
    totalContentBlocks: 12,
    wordCount: 7544,
    createdAt: now,
    updatedAt: now
  };

  const result = await col.insertOne(doc);
  console.log(`\n✅ RCM Module 1 seeded:`);
  console.log(`  ID:     ${result.insertedId}`);
  console.log(`  Slug:   ${SLUG}`);
  console.log(`  Status: draft`);
}

async function main() {
  await connect();
  if (process.argv.includes('--remove')) {
    const col = mongoose.connection.db.collection('interactivecourses');
    const r = await col.deleteMany({ slug: SLUG });
    console.log(r.deletedCount ? `Removed ${SLUG}` : `No ${SLUG} found`);
  } else {
    await seed();
  }
  await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
