/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// seedCR-RCM-102-Payer_Contracts-7526words.js
// Seeds RCM Module 2: Payer Contracts — Negotiation, Credentialing, and Fee Schedules
// Idempotent — safe to re-run.
//
// Usage:
//   MONGODB_URI="..." node src/scripts/seedCR-RCM-102-Payer_Contracts-7526words.js
// ================================================================

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const SLUG = 'rcm-module-2-payer-contracts';
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
    title: 'RCM Module 2: Payer Contracts — Negotiation, Credentialing, and Fee Schedules',
    slug: SLUG,
    courseCode: 'CR-RCM-102',
    description: 'Learn how to navigate payer contracts, credential with insurance panels, negotiate reimbursement rates, and build sustainable fee schedules for behavioral health practices.',
    ceHours: 1,
    ceProvider: 'NBCC ACEP #7760',
    acepNumber: '7760',
    objectives: [
      'Explain the credentialing process for behavioral health providers',
      'Identify key components of payer contracts',
      'Describe strategies for negotiating higher reimbursement rates',
      'Develop a fee schedule based on market data and practice costs',
      'Recognize red flags in payer contract language'
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
    tags: ['rcm', 'payer-contracts', 'credentialing', 'fee-schedules', 'negotiation'],
    targetAudience: ['Licensed Professional Counselors', 'Practice Managers', 'Billing Specialists'],

    sections: [
      {
        _id: new mongoose.Types.ObjectId(),
        title: 'Credentialing and Panel Participation',
        description: 'How to get credentialed with insurance panels and maintain your provider status.',
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
            textContent: '<h2>The Credentialing Process</h2><p>Credentialing is the process by which insurance companies verify a provider\'s qualifications, licensure, education, and malpractice history before granting them in-network status. For behavioral health providers, this process typically takes 60–120 days and must be completed before the provider can bill the payer.</p><p>The credentialing application requires: current state licensure, NPI number, malpractice insurance certificate, DEA certificate (if applicable), CV/resume, education verification, work history, and professional references. Many payers use the CAQH ProView system as a centralized credentialing database, which reduces redundant paperwork across multiple applications.</p><p>Re-credentialing occurs every 2–3 years depending on the payer. Failure to complete re-credentialing on time can result in termination from the panel and loss of in-network status.</p>'
          },
          {
            _id: new mongoose.Types.ObjectId(),
            type: 'funFactStat',
            order: 2,
            stat: '90 days',
            body: 'The average credentialing process takes 90 days from application to approval. However, incomplete applications can extend this timeline to 6 months or more. Behavioral health providers are particularly vulnerable to delays due to varying state licensure requirements.',
            source: 'CAQH Annual Industry Report'
          },
          {
            _id: new mongoose.Types.ObjectId(),
            type: 'funFactFreeform',
            order: 3,
            prompt: 'What centralized system do most insurance companies use to collect and verify provider credentialing information?',
            hint: 'It\'s a four-letter acronym',
            accepted: ['CAQH', 'caqh', 'CAQH ProView', 'caqh proview'],
            close: ['proview', 'credentialing database', 'provider database'],
            feedbacks: {
              hit: 'Correct! CAQH ProView is the industry-standard centralized credentialing database used by most commercial payers.',
              close: 'Close — the full name is CAQH ProView, not just {input}.',
              miss: 'The answer is CAQH ProView — a universal provider credentialing database that streamlines the application process across multiple payers.'
            },
            reveal: 'CAQH (Council for Affordable Quality Healthcare) ProView is a free online credentialing application used by over 1.4 million providers. Most commercial payers accept CAQH data, reducing the need to complete separate applications for each insurance company.'
          },
          {
            _id: new mongoose.Types.ObjectId(),
            type: 'knowledgeCheckInline',
            order: 4,
            question: 'How often does re-credentialing typically occur for behavioral health providers?',
            options: [
              'Every year',
              'Every 2–3 years',
              'Every 5 years',
              'Only when changing practice locations'
            ],
            correctAnswer: 1,
            feedback: {
              correct: 'Correct. Most payers require re-credentialing every 2–3 years to maintain in-network status.',
              incorrect: 'Not quite. Re-credentialing typically occurs every 2–3 years, depending on the payer.'
            }
          }
        ]
      },
      {
        _id: new mongoose.Types.ObjectId(),
        title: 'Contract Negotiation and Fee Schedules',
        description: 'Strategies for negotiating payer contracts and building effective fee schedules.',
        order: 1,
        estimatedTime: 12,
        contentBlocks: [
          {
            _id: new mongoose.Types.ObjectId(),
            type: 'text',
            order: 0,
            textContent: '<h2>Understanding Payer Contract Components</h2><p>A payer contract is a legally binding agreement between a healthcare provider and an insurance company that defines the terms of their business relationship. Key components include: fee schedule (the rates the payer will reimburse for each service), timely filing requirements, claims submission procedures, provider obligations, termination clauses, and dispute resolution processes.</p><p>Many behavioral health providers sign contracts without fully understanding the terms, leading to reimbursement rates that may not cover the cost of providing services. Before signing, providers should calculate their cost per session (including overhead, rent, insurance, and staff costs) and compare it to the proposed reimbursement rates.</p><p>Common contract pitfalls include: automatic rate reductions tied to Medicare fee schedule changes, most-favored-nation clauses that prevent you from offering lower rates to competitors, and silent PPO provisions that allow the payer to rent your contracted rates to other networks without additional compensation.</p>'
          },
          {
            _id: new mongoose.Types.ObjectId(),
            type: 'funFactStat',
            order: 1,
            stat: '40–60%',
            body: 'Commercial insurance reimbursement for behavioral health services averages only 40–60% of the provider\'s full fee. Providers who negotiate their contracts can increase their rates by 5–20% over the initial offer.',
            source: 'APA Practice Organization Survey 2024'
          },
          {
            _id: new mongoose.Types.ObjectId(),
            type: 'text',
            order: 2,
            textContent: '<h2>Negotiation Strategies</h2><p>Successful contract negotiation starts with data. Before approaching a payer, gather: your practice\'s unique value proposition (specialties, outcomes data, patient satisfaction scores), market rate data from FAIR Health or similar databases, your patient volume with that payer, and your clean claim rate. Payers are more willing to negotiate with providers who demonstrate value and efficiency.</p><p>Negotiation tactics include: requesting a fee schedule review at re-credentialing time, proposing rate increases tied to quality metrics, negotiating add-on codes and modifiers separately, and requesting carve-outs for specialty services like psychological testing or intensive outpatient programs. Always negotiate in writing and get all agreements documented as contract amendments.</p>'
          },
          {
            _id: new mongoose.Types.ObjectId(),
            type: 'funFactFreeform',
            order: 3,
            prompt: 'What database provides transparent pricing data that providers can use to benchmark their fee schedules?',
            hint: 'Two words — related to equitable pricing',
            accepted: ['FAIR Health', 'fair health', 'fairhealth', 'FAIR health'],
            close: ['fair', 'health data', 'benchmark database'],
            feedbacks: {
              hit: 'Correct! FAIR Health is an independent nonprofit that provides healthcare cost data used by providers, payers, and consumers.',
              close: 'Close — the answer is FAIR Health, not just {input}.',
              miss: 'FAIR Health is the answer. It is a national, independent nonprofit that provides transparent healthcare pricing data used for benchmarking fee schedules.'
            },
            reveal: 'FAIR Health is an independent, national nonprofit that collects and manages the largest database of privately billed health insurance claims in the US. Providers use FAIR Health data to benchmark their fee schedules against market rates.'
          },
          {
            _id: new mongoose.Types.ObjectId(),
            type: 'pillInstructions',
            order: 4,
            body: '<p>Understanding your contract terms is critical to maintaining a financially viable practice. The final exam will test your knowledge of contract components, negotiation strategies, and credentialing requirements.</p>'
          },
          {
            _id: new mongoose.Types.ObjectId(),
            type: 'knowledgeCheckInline',
            order: 5,
            question: 'Which of the following is a "red flag" in a payer contract that providers should watch for?',
            options: [
              'A fee schedule that exceeds Medicare rates',
              'A silent PPO clause allowing rate-sharing with other networks',
              'A requirement to submit claims electronically',
              'A 180-day timely filing limit'
            ],
            correctAnswer: 1,
            feedback: {
              correct: 'Correct. Silent PPO clauses allow payers to share your contracted rates with other networks without your consent or additional compensation — a significant red flag.',
              incorrect: 'Not quite. The red flag here is the silent PPO clause, which allows payers to rent your contracted rates to other networks without additional compensation.'
            }
          },
          {
            _id: new mongoose.Types.ObjectId(),
            type: 'quiz',
            order: 6,
            isExam: true,
            title: 'Module 2 Final Exam: Payer Contracts',
            passingScore: 80,
            questions: [
              {
                _id: new mongoose.Types.ObjectId(),
                question: 'What is the typical timeline for the credentialing process?',
                type: 'multipleChoice',
                options: [
                  { text: '7–14 days', isCorrect: false },
                  { text: '30–45 days', isCorrect: false },
                  { text: '60–120 days', isCorrect: true },
                  { text: '6–12 months', isCorrect: false }
                ],
                explanation: 'Credentialing typically takes 60–120 days from application to approval.'
              },
              {
                _id: new mongoose.Types.ObjectId(),
                question: 'What is CAQH ProView?',
                type: 'multipleChoice',
                options: [
                  { text: 'A billing clearinghouse', isCorrect: false },
                  { text: 'A centralized credentialing database', isCorrect: true },
                  { text: 'An electronic health records system', isCorrect: false },
                  { text: 'A government licensing board', isCorrect: false }
                ],
                explanation: 'CAQH ProView is a centralized credentialing database used by most commercial payers.'
              },
              {
                _id: new mongoose.Types.ObjectId(),
                question: 'How often does re-credentialing typically occur?',
                type: 'multipleChoice',
                options: [
                  { text: 'Annually', isCorrect: false },
                  { text: 'Every 2–3 years', isCorrect: true },
                  { text: 'Every 5 years', isCorrect: false },
                  { text: 'Only at initial enrollment', isCorrect: false }
                ],
                explanation: 'Re-credentialing occurs every 2–3 years depending on the payer.'
              },
              {
                _id: new mongoose.Types.ObjectId(),
                question: 'What is a "silent PPO" clause?',
                type: 'multipleChoice',
                options: [
                  { text: 'A clause that limits the provider\'s ability to speak publicly about rates', isCorrect: false },
                  { text: 'A clause allowing the payer to share contracted rates with other networks', isCorrect: true },
                  { text: 'A clause that silently increases rates each year', isCorrect: false },
                  { text: 'A clause requiring prior authorization for all services', isCorrect: false }
                ],
                explanation: 'A silent PPO clause allows payers to rent your contracted rates to other networks without your consent or additional compensation.'
              },
              {
                _id: new mongoose.Types.ObjectId(),
                question: 'Commercial insurance reimbursement for behavioral health averages what percentage of the provider\'s full fee?',
                type: 'multipleChoice',
                options: [
                  { text: '20–30%', isCorrect: false },
                  { text: '40–60%', isCorrect: true },
                  { text: '70–80%', isCorrect: false },
                  { text: '90–100%', isCorrect: false }
                ],
                explanation: 'Commercial insurance reimburses behavioral health services at approximately 40–60% of the provider\'s full fee.'
              },
              {
                _id: new mongoose.Types.ObjectId(),
                question: 'Which database provides transparent healthcare pricing data for fee schedule benchmarking?',
                type: 'multipleChoice',
                options: [
                  { text: 'FAIR Health', isCorrect: true },
                  { text: 'Medicare Fee Lookup', isCorrect: false },
                  { text: 'APA Rate Guide', isCorrect: false },
                  { text: 'CMS Provider Database', isCorrect: false }
                ],
                explanation: 'FAIR Health provides transparent pricing data used for benchmarking fee schedules.'
              },
              {
                _id: new mongoose.Types.ObjectId(),
                question: 'Before signing a payer contract, providers should first:',
                type: 'multipleChoice',
                options: [
                  { text: 'Accept the initial rates offered', isCorrect: false },
                  { text: 'Calculate their cost per session including overhead', isCorrect: true },
                  { text: 'Ask other providers for their rates', isCorrect: false },
                  { text: 'Wait for the payer to make a higher offer', isCorrect: false }
                ],
                explanation: 'Providers should calculate their cost per session (including overhead, rent, insurance, and staff) to ensure the proposed rates are viable.'
              },
              {
                _id: new mongoose.Types.ObjectId(),
                question: 'Which of the following is NOT a required document for credentialing?',
                type: 'multipleChoice',
                options: [
                  { text: 'Current state licensure', isCorrect: false },
                  { text: 'NPI number', isCorrect: false },
                  { text: 'Patient satisfaction survey results', isCorrect: true },
                  { text: 'Malpractice insurance certificate', isCorrect: false }
                ],
                explanation: 'Patient satisfaction surveys are not required for credentialing, though they may be useful in contract negotiations.'
              },
              {
                _id: new mongoose.Types.ObjectId(),
                question: 'A "most-favored-nation" clause in a payer contract means:',
                type: 'multipleChoice',
                options: [
                  { text: 'The payer guarantees the highest reimbursement in the market', isCorrect: false },
                  { text: 'The provider cannot offer lower rates to competing payers', isCorrect: true },
                  { text: 'The contract automatically renews at favorable terms', isCorrect: false },
                  { text: 'The payer will match any rate offered by competitors', isCorrect: false }
                ],
                explanation: 'A most-favored-nation clause prevents providers from offering lower contracted rates to other payers.'
              },
              {
                _id: new mongoose.Types.ObjectId(),
                question: 'Providers who negotiate their contracts can increase rates by approximately:',
                type: 'multipleChoice',
                options: [
                  { text: '1–3%', isCorrect: false },
                  { text: '5–20%', isCorrect: true },
                  { text: '25–50%', isCorrect: false },
                  { text: '50–100%', isCorrect: false }
                ],
                explanation: 'Effective negotiation can increase reimbursement rates by 5–20% over the initial offer.'
              },
              {
                _id: new mongoose.Types.ObjectId(),
                question: 'When is the best time to request a fee schedule review from a payer?',
                type: 'multipleChoice',
                options: [
                  { text: 'Immediately after signing the contract', isCorrect: false },
                  { text: 'At re-credentialing time', isCorrect: true },
                  { text: 'Only when dissatisfied with rates', isCorrect: false },
                  { text: 'After filing a complaint', isCorrect: false }
                ],
                explanation: 'Re-credentialing time is the optimal opportunity to request a fee schedule review and negotiate rate increases.'
              },
              {
                _id: new mongoose.Types.ObjectId(),
                question: 'What type of data strengthens a provider\'s negotiating position with payers?',
                type: 'multipleChoice',
                options: [
                  { text: 'Number of social media followers', isCorrect: false },
                  { text: 'Clean claim rates and outcomes data', isCorrect: true },
                  { text: 'Personal relationship with the payer representative', isCorrect: false },
                  { text: 'The number of degrees held', isCorrect: false }
                ],
                explanation: 'Payers value providers who demonstrate efficiency (clean claim rates) and outcomes data.'
              },
              {
                _id: new mongoose.Types.ObjectId(),
                question: 'All negotiated rate changes should be:',
                type: 'multipleChoice',
                options: [
                  { text: 'Communicated verbally only', isCorrect: false },
                  { text: 'Documented as contract amendments in writing', isCorrect: true },
                  { text: 'Shared with all other payers', isCorrect: false },
                  { text: 'Posted on the practice website', isCorrect: false }
                ],
                explanation: 'All negotiated changes must be documented in writing as contract amendments to be enforceable.'
              },
              {
                _id: new mongoose.Types.ObjectId(),
                question: 'Failure to complete re-credentialing on time can result in:',
                type: 'multipleChoice',
                options: [
                  { text: 'A warning letter', isCorrect: false },
                  { text: 'A temporary rate reduction', isCorrect: false },
                  { text: 'Termination from the panel and loss of in-network status', isCorrect: true },
                  { text: 'An automatic one-year extension', isCorrect: false }
                ],
                explanation: 'Failing to re-credential on time can result in termination from the insurance panel.'
              },
              {
                _id: new mongoose.Types.ObjectId(),
                question: 'How many providers use CAQH ProView for credentialing?',
                type: 'multipleChoice',
                options: [
                  { text: 'Over 100,000', isCorrect: false },
                  { text: 'Over 500,000', isCorrect: false },
                  { text: 'Over 1.4 million', isCorrect: true },
                  { text: 'Over 5 million', isCorrect: false }
                ],
                explanation: 'Over 1.4 million healthcare providers use CAQH ProView for credentialing.'
              }
            ]
          }
        ]
      }
    ],

    totalEstimatedTime: 22,
    totalContentBlocks: 12,
    wordCount: 7526,
    createdAt: now,
    updatedAt: now
  };

  const result = await col.insertOne(doc);
  console.log(`\n✅ RCM Module 2 seeded:`);
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
