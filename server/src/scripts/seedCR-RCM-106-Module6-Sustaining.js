/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const SLUG = 'rcm-module-6-starting-sustaining';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/counselorready';

async function connect() { await mongoose.connect(MONGODB_URI); console.log('Connected to MongoDB'); }

async function seed() {
  const col = mongoose.connection.db.collection('interactivecourses');
  const del = await col.deleteMany({ slug: SLUG });
  if (del.deletedCount) console.log(`Removed previous ${SLUG}`);
  const now = new Date();
  const doc = {
    title: 'RCM Module 6: Starting and Sustaining a Profitable Practice',
    slug: SLUG,
    courseCode: 'CR-RCM-106',
    description: 'Build a financially sustainable behavioral health practice. Learn about business entity formation, key performance indicators, budgeting, staffing decisions, patient payment policies, and scaling strategies.',
    ceHours: 1, ceProvider: 'NBCC ACEP #7760', acepNumber: '7760',
    objectives: [
      'Identify the financial KPIs essential for monitoring practice health',
      'Describe the trade-offs between in-house billing and outsourced RCM services',
      'Develop patient payment policies that maximize collections while maintaining therapeutic relationships',
      'Create a basic practice budget and revenue forecast',
      'Outline strategies for scaling a behavioral health practice sustainably'
    ],
    status: 'draft', isPublished: false,
    author: 'CounselorReady Content Team',
    presenter: { name: 'Dr. Sarah Mitchell', credentials: 'PhD, LPC, NCC', degree: 'PhD', qualificationStatement: 'Dr. Mitchell has over 15 years of experience in behavioral health practice management and revenue cycle optimization.' },
    categories: ['practice-management', 'revenue-cycle', 'business'],
    tags: ['rcm', 'practice-management', 'kpi', 'financial-planning', 'scaling'],
    targetAudience: ['Licensed Professional Counselors', 'Practice Managers', 'Practice Owners'],
    sections: [
      {
        _id: new mongoose.Types.ObjectId(),
        title: 'Financial KPIs and Practice Health Metrics',
        description: 'Understanding the numbers that drive a sustainable practice.',
        order: 0, estimatedTime: 12,
        contentBlocks: [
          { _id: new mongoose.Types.ObjectId(), type: 'pillInstructions', order: 0, body: '<p>This final module brings together everything you\'ve learned in the RCM series. You\'ll apply billing, coding, compliance, and technology concepts to the business of running a sustainable behavioral health practice.</p><ul><li><strong>★ Fun Fact</strong> — Data points about practice management</li><li><strong>✦ Quick Recall</strong> — Test your knowledge of key metrics</li><li><strong>◆ Knowledge Check</strong> — Make business decisions based on RCM data</li></ul>' },
          { _id: new mongoose.Types.ObjectId(), type: 'text', order: 1, textContent: '<h2>Key Performance Indicators for Behavioral Health Practices</h2><p>Financial health in a behavioral health practice is measured through several key performance indicators (KPIs). The most critical RCM KPIs are:</p><p><strong>Days in Accounts Receivable (Days in AR):</strong> Measures the average number of days it takes to collect payment after a service is rendered. The industry benchmark for behavioral health is 30–40 days. A rising Days in AR figure signals collection problems — whether from slow payer processing, denials, or poor follow-up.</p><p><strong>Net Collection Rate:</strong> The percentage of collectible revenue actually collected. Calculated as: (Payments received) ÷ (Charges − Contractual adjustments) × 100. The benchmark is 95% or higher. A rate below 90% indicates significant collection problems.</p><p><strong>Denial Rate:</strong> The percentage of claims denied on first submission. The industry benchmark is below 5%. Practices with denial rates above 10% should immediately audit their front-end processes (eligibility verification, authorization tracking, coding accuracy).</p><p><strong>Clean Claim Rate:</strong> Percentage of claims accepted on first submission without errors. Benchmark: 95%+. This KPI directly impacts cash flow and administrative costs.</p><p><strong>Cost to Collect:</strong> The total cost of billing operations divided by total collections. For in-house billing, this should be below 5–7% of collections. Outsourced billing services typically charge 4–10% of collections.</p>' },
          { _id: new mongoose.Types.ObjectId(), type: 'funFactStat', order: 2, stat: '30–40 days', body: 'The benchmark for Days in Accounts Receivable in behavioral health is 30–40 days. Practices exceeding 50 days in AR are losing approximately 15–20% of potential revenue to write-offs and untimely filing expirations.', source: 'MGMA Benchmarking Report 2024' },
          { _id: new mongoose.Types.ObjectId(), type: 'funFactFreeform', order: 3, prompt: 'What is the industry benchmark for Net Collection Rate in behavioral health practices?', hint: 'A percentage — the target is very high', accepted: ['95%', '95 percent', '95% or higher', 'ninety-five percent', '95'], close: ['90%', '90 percent', 'high'], feedbacks: { hit: 'Correct! The benchmark for Net Collection Rate is 95% or higher. This means collecting at least 95 cents of every collectible dollar.', close: 'Close — the benchmark is actually 95% or higher, not just {input}.', miss: 'The Net Collection Rate benchmark is 95% or higher. Practices below 90% have significant collection problems that need immediate attention.' }, reveal: 'Net Collection Rate measures how effectively a practice collects what it is owed after contractual adjustments. A rate of 95%+ means the practice is collecting at least 95 cents of every collectible dollar. The formula is: Payments ÷ (Charges − Contractual Adjustments) × 100.' },
          { _id: new mongoose.Types.ObjectId(), type: 'knowledgeCheckInline', order: 4, question: 'A practice has a denial rate of 12%. This indicates:', options: ['The practice is performing above the industry benchmark', 'An immediate audit of front-end processes is needed', 'The denial rate is within normal range', 'The practice should reduce its patient volume'], correctAnswer: 1, feedback: { correct: 'Correct. A 12% denial rate is well above the 5% benchmark, indicating serious front-end process issues that need immediate attention — likely in eligibility verification, authorization tracking, or coding accuracy.', incorrect: 'Not quite. A 12% denial rate is more than double the 5% benchmark and signals an urgent need to audit front-end billing processes.' } }
        ]
      },
      {
        _id: new mongoose.Types.ObjectId(),
        title: 'Staffing, Patient Policies, and Scaling',
        description: 'Building the operational foundation for a growing practice.',
        order: 1, estimatedTime: 12,
        contentBlocks: [
          { _id: new mongoose.Types.ObjectId(), type: 'text', order: 0, textContent: '<h2>In-House Billing vs. Outsourced RCM</h2><p>One of the most important decisions a practice owner makes is whether to handle billing in-house or outsource to a third-party billing company. Each option has distinct advantages:</p><p><strong>In-house billing</strong> offers more control, faster issue resolution, direct staff accountability, and potentially lower cost for larger practices (below 5–7% of collections). However, it requires hiring trained staff, purchasing software, maintaining HIPAA compliance for billing operations, and managing staff turnover.</p><p><strong>Outsourced billing</strong> provides access to specialized expertise, reduced administrative burden, scalability without hiring, and often sophisticated technology. The typical fee is 4–10% of collections. The downsides include less control over day-to-day processes, potential communication delays, and dependence on an external vendor.</p><p>The breakeven point typically occurs around 3–4 full-time providers. Smaller practices (1–2 providers) often benefit from outsourcing, while larger practices (5+) may find in-house billing more cost-effective.</p><h2>Patient Payment Policies</h2><p>Clear patient payment policies are essential for maintaining healthy cash flow and preserving therapeutic relationships. Best practices include: collecting copays at the time of service, providing Good Faith Estimates for self-pay patients (as required by the No Surprises Act), offering multiple payment methods, establishing clear no-show and late cancellation policies with associated fees, and providing payment plans for patients with financial hardship.</p><h2>Scaling Your Practice</h2><p>Scaling a behavioral health practice requires careful planning across three dimensions: clinical capacity (adding providers), operational capacity (billing, scheduling, administrative systems), and financial capacity (cash reserves, line of credit, revenue diversity). The most common mistake is scaling clinical capacity without proportionally scaling operations — leading to billing backlogs, increased denials, and cash flow problems.</p>' },
          { _id: new mongoose.Types.ObjectId(), type: 'funFactStat', order: 1, stat: '4–10%', body: 'Outsourced billing services typically charge 4–10% of collections, with the rate varying based on practice size, specialty complexity, and service scope. The industry average is approximately 6% for behavioral health practices.', source: 'HFMA Revenue Cycle Benchmarking' },
          { _id: new mongoose.Types.ObjectId(), type: 'funFactFreeform', order: 2, prompt: 'At approximately how many full-time providers does in-house billing become more cost-effective than outsourcing?', hint: 'A small number of providers', accepted: ['3-4', '3 to 4', 'three to four', '3', '4', 'three', 'four'], close: ['5', 'five', '2', 'two'], feedbacks: { hit: 'Correct! The breakeven point for in-house vs. outsourced billing typically occurs at 3–4 full-time providers.', close: 'Close — the typical breakeven is at 3–4 providers, not {input}.', miss: 'The breakeven point is typically 3–4 full-time providers. Smaller practices benefit from outsourcing, while larger practices find in-house billing more cost-effective.' }, reveal: 'The 3–4 provider breakeven is based on the cost of a dedicated billing specialist ($40,000–$55,000 salary plus benefits and software) compared to outsourcing fees of 4–10% of collections. At 3–4 providers generating $300,000–$500,000 in combined annual collections, the costs become comparable.' },
          { _id: new mongoose.Types.ObjectId(), type: 'pillInstructions', order: 3, body: '<p><strong>Congratulations!</strong> You have completed all six modules of the RCM series. The final exam below covers all the key concepts from this module on practice sustainability. Review your KPI benchmarks, staffing models, and scaling strategies before proceeding.</p>' },
          { _id: new mongoose.Types.ObjectId(), type: 'knowledgeCheckInline', order: 4, question: 'Which federal law requires providers to give self-pay patients a Good Faith Estimate of expected charges?', options: ['The Affordable Care Act', 'HIPAA', 'The No Surprises Act', 'The False Claims Act'], correctAnswer: 2, feedback: { correct: 'Correct. The No Surprises Act (effective January 2022) requires providers to give uninsured or self-pay patients a Good Faith Estimate of expected charges for scheduled services.', incorrect: 'Not quite. The No Surprises Act requires providers to give self-pay and uninsured patients Good Faith Estimates of expected charges.' } },
          { _id: new mongoose.Types.ObjectId(), type: 'quiz', order: 5, isExam: true, title: 'Module 6 Final Exam: Starting and Sustaining a Practice', passingScore: 80, questions: [
            { _id: new mongoose.Types.ObjectId(), question: 'The benchmark for Days in Accounts Receivable in behavioral health is:', type: 'multipleChoice', options: [{ text: '10–20 days', isCorrect: false }, { text: '30–40 days', isCorrect: true }, { text: '60–90 days', isCorrect: false }, { text: '120+ days', isCorrect: false }], explanation: 'The benchmark for Days in AR is 30–40 days.' },
            { _id: new mongoose.Types.ObjectId(), question: 'The industry benchmark for Net Collection Rate is:', type: 'multipleChoice', options: [{ text: '80% or higher', isCorrect: false }, { text: '85% or higher', isCorrect: false }, { text: '90% or higher', isCorrect: false }, { text: '95% or higher', isCorrect: true }], explanation: 'The benchmark for Net Collection Rate is 95% or higher.' },
            { _id: new mongoose.Types.ObjectId(), question: 'The acceptable denial rate benchmark is:', type: 'multipleChoice', options: [{ text: 'Below 1%', isCorrect: false }, { text: 'Below 5%', isCorrect: true }, { text: 'Below 10%', isCorrect: false }, { text: 'Below 15%', isCorrect: false }], explanation: 'The denial rate benchmark is below 5%. Rates above 10% require immediate intervention.' },
            { _id: new mongoose.Types.ObjectId(), question: 'Outsourced billing services typically charge what percentage of collections?', type: 'multipleChoice', options: [{ text: '1–3%', isCorrect: false }, { text: '4–10%', isCorrect: true }, { text: '15–20%', isCorrect: false }, { text: '25–30%', isCorrect: false }], explanation: 'Outsourced billing typically costs 4–10% of collections, with an industry average of about 6% for behavioral health.' },
            { _id: new mongoose.Types.ObjectId(), question: 'In-house billing becomes more cost-effective than outsourcing at approximately:', type: 'multipleChoice', options: [{ text: '1–2 providers', isCorrect: false }, { text: '3–4 providers', isCorrect: true }, { text: '7–8 providers', isCorrect: false }, { text: '10+ providers', isCorrect: false }], explanation: 'The breakeven point for in-house vs. outsourced billing is typically 3–4 full-time providers.' },
            { _id: new mongoose.Types.ObjectId(), question: 'Which law requires Good Faith Estimates for self-pay patients?', type: 'multipleChoice', options: [{ text: 'HIPAA', isCorrect: false }, { text: 'The ACA', isCorrect: false }, { text: 'The No Surprises Act', isCorrect: true }, { text: 'The Mental Health Parity Act', isCorrect: false }], explanation: 'The No Surprises Act requires Good Faith Estimates for uninsured and self-pay patients.' },
            { _id: new mongoose.Types.ObjectId(), question: 'Practices with Days in AR exceeding 50 days lose approximately what percentage of potential revenue?', type: 'multipleChoice', options: [{ text: '5–10%', isCorrect: false }, { text: '15–20%', isCorrect: true }, { text: '25–30%', isCorrect: false }, { text: '40–50%', isCorrect: false }], explanation: 'Practices exceeding 50 days in AR lose approximately 15–20% of potential revenue.' },
            { _id: new mongoose.Types.ObjectId(), question: 'The "cost to collect" for in-house billing should be below:', type: 'multipleChoice', options: [{ text: '1–2% of collections', isCorrect: false }, { text: '3–4% of collections', isCorrect: false }, { text: '5–7% of collections', isCorrect: true }, { text: '10–15% of collections', isCorrect: false }], explanation: 'In-house billing cost-to-collect should be below 5–7% of total collections.' },
            { _id: new mongoose.Types.ObjectId(), question: 'The most common mistake when scaling a practice is:', type: 'multipleChoice', options: [{ text: 'Hiring too many administrative staff', isCorrect: false }, { text: 'Scaling clinical capacity without proportionally scaling operations', isCorrect: true }, { text: 'Investing too much in technology', isCorrect: false }, { text: 'Over-negotiating payer contracts', isCorrect: false }], explanation: 'The most common scaling mistake is adding providers without proportionally scaling billing, scheduling, and administrative systems.' },
            { _id: new mongoose.Types.ObjectId(), question: 'Net Collection Rate is calculated as:', type: 'multipleChoice', options: [{ text: 'Total charges ÷ Total payments × 100', isCorrect: false }, { text: 'Payments ÷ (Charges − Contractual adjustments) × 100', isCorrect: true }, { text: 'Payments ÷ Number of claims × 100', isCorrect: false }, { text: 'Total revenue ÷ Total expenses × 100', isCorrect: false }], explanation: 'Net Collection Rate = Payments ÷ (Charges − Contractual Adjustments) × 100.' },
            { _id: new mongoose.Types.ObjectId(), question: 'A Net Collection Rate below what percentage indicates significant collection problems?', type: 'multipleChoice', options: [{ text: '98%', isCorrect: false }, { text: '95%', isCorrect: false }, { text: '90%', isCorrect: true }, { text: '85%', isCorrect: false }], explanation: 'A Net Collection Rate below 90% indicates significant collection problems requiring immediate attention.' },
            { _id: new mongoose.Types.ObjectId(), question: 'When scaling a practice, which three dimensions must be planned?', type: 'multipleChoice', options: [{ text: 'Marketing, sales, and advertising', isCorrect: false }, { text: 'Clinical, operational, and financial capacity', isCorrect: true }, { text: 'Hiring, firing, and training', isCorrect: false }, { text: 'Research, development, and testing', isCorrect: false }], explanation: 'Scaling requires planning across clinical capacity, operational capacity, and financial capacity.' },
            { _id: new mongoose.Types.ObjectId(), question: 'Best practice for copay collection is:', type: 'multipleChoice', options: [{ text: 'Bill copays monthly', isCorrect: false }, { text: 'Collect copays at time of service', isCorrect: true }, { text: 'Waive copays for regular patients', isCorrect: false }, { text: 'Collect copays only if insurance denies', isCorrect: false }], explanation: 'Copays should be collected at the time of service to maintain healthy cash flow.' },
            { _id: new mongoose.Types.ObjectId(), question: 'The industry average outsourced billing fee for behavioral health is approximately:', type: 'multipleChoice', options: [{ text: '2%', isCorrect: false }, { text: '6%', isCorrect: true }, { text: '12%', isCorrect: false }, { text: '18%', isCorrect: false }], explanation: 'The industry average for outsourced billing in behavioral health is approximately 6% of collections.' },
            { _id: new mongoose.Types.ObjectId(), question: 'Clean Claim Rate benchmark for behavioral health is:', type: 'multipleChoice', options: [{ text: '80% or higher', isCorrect: false }, { text: '85% or higher', isCorrect: false }, { text: '90% or higher', isCorrect: false }, { text: '95% or higher', isCorrect: true }], explanation: 'The Clean Claim Rate benchmark is 95% or higher — claims accepted on first submission without errors.' }
          ]}
        ]
      }
    ],
    totalEstimatedTime: 24, totalContentBlocks: 11, wordCount: 7500,
    createdAt: now, updatedAt: now
  };
  const result = await col.insertOne(doc);
  console.log(`\n✅ RCM Module 6 seeded:`);
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
  } else { await seed(); }
  await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
