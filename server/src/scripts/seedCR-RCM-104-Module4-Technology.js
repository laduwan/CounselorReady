/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const SLUG = 'rcm-module-4-technology-telehealth';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/counselorready';

async function connect() { await mongoose.connect(MONGODB_URI); console.log('Connected to MongoDB'); }

async function seed() {
  const col = mongoose.connection.db.collection('interactivecourses');
  const del = await col.deleteMany({ slug: SLUG });
  if (del.deletedCount) console.log(`Removed previous ${SLUG}`);
  const now = new Date();
  const doc = {
    title: 'RCM Module 4: Technology and Telehealth in Revenue Cycle Management',
    slug: SLUG,
    courseCode: 'CR-RCM-104',
    description: 'Explore how EHR systems, practice management software, clearinghouses, and telehealth platforms integrate with revenue cycle operations. Master telehealth-specific billing codes and modifiers.',
    ceHours: 1, ceProvider: 'NBCC ACEP #7760', acepNumber: '7760',
    objectives: [
      'Describe how EHR and practice management systems support RCM workflows',
      'Identify telehealth-specific CPT codes, modifiers, and place-of-service codes',
      'Explain the role of clearinghouses in electronic claims processing',
      'Evaluate automated eligibility verification tools and their impact on denials',
      'Discuss emerging technologies including AI in revenue cycle management'
    ],
    status: 'draft', isPublished: false,
    author: 'CounselorReady Content Team',
    presenter: { name: 'Dr. Sarah Mitchell', credentials: 'PhD, LPC, NCC', degree: 'PhD', qualificationStatement: 'Dr. Mitchell has over 15 years of experience in behavioral health practice management and revenue cycle optimization.' },
    categories: ['practice-management', 'revenue-cycle', 'technology'],
    tags: ['rcm', 'technology', 'telehealth', 'ehr', 'practice-management-software'],
    targetAudience: ['Licensed Professional Counselors', 'Practice Managers', 'Billing Specialists'],
    sections: [
      {
        _id: new mongoose.Types.ObjectId(),
        title: 'EHR, Practice Management Software, and Clearinghouses',
        description: 'Technology infrastructure that supports the revenue cycle.',
        order: 0, estimatedTime: 12,
        contentBlocks: [
          { _id: new mongoose.Types.ObjectId(), type: 'pillInstructions', order: 0, body: '<p>Throughout this course, you will encounter interactive elements designed to reinforce your learning:</p><ul><li><strong>★ Fun Fact</strong> — Tap to reveal interesting statistics and data points</li><li><strong>✦ Quick Recall</strong> — Type your answer to check your understanding</li><li><strong>◆ Knowledge Check</strong> — Select the best answer to test your comprehension</li></ul><p>These elements are not graded but will help you retain key concepts.</p>' },
          { _id: new mongoose.Types.ObjectId(), type: 'text', order: 1, textContent: '<h2>EHR Integration with Revenue Cycle</h2><p>Electronic Health Record (EHR) systems serve as the clinical backbone of modern behavioral health practices. When properly integrated with practice management (PM) software, EHRs automate key RCM functions: appointment scheduling triggers eligibility verification, clinical documentation auto-populates billing codes, and session completion initiates charge capture.</p><p>Key EHR features that support RCM include: integrated scheduling with automated appointment reminders (reducing no-shows by 25–40%), real-time eligibility checks at patient check-in, clinical documentation templates that capture time-based billing elements, auto-coding suggestions based on documentation, electronic superbill generation, and integrated clearinghouse submission.</p><p>Practice management software handles the financial side: patient demographics and insurance information, fee schedule management, claim generation and submission, payment posting, accounts receivable tracking, and financial reporting. The best systems provide a unified workflow where clinical documentation flows seamlessly into billing without manual data re-entry.</p>' },
          { _id: new mongoose.Types.ObjectId(), type: 'funFactStat', order: 2, stat: '96%', body: 'Over 96% of hospitals and 80% of office-based physicians now use certified EHR systems. However, behavioral health adoption lags behind — only about 62% of behavioral health practices use a fully integrated EHR/PM system, with many still relying on paper documentation.', source: 'ONC Health IT Dashboard 2024' },
          { _id: new mongoose.Types.ObjectId(), type: 'funFactFreeform', order: 3, prompt: 'What type of entity serves as an intermediary between healthcare providers and insurance payers for electronic claims processing?', hint: 'Think of a "hub" that routes claims', accepted: ['clearinghouse', 'claims clearinghouse', 'billing clearinghouse'], close: ['intermediary', 'claims processor', 'billing company'], feedbacks: { hit: 'Correct! A clearinghouse is an intermediary that receives claims from providers, scrubs them for errors, reformats them to payer-specific standards, and transmits them electronically.', close: 'Close — the specific term is clearinghouse (or claims clearinghouse), not just {input}.', miss: 'The answer is a clearinghouse. Clearinghouses serve as intermediaries that validate, reformat, and route electronic claims between providers and payers.' }, reveal: 'A clearinghouse (also called a claims clearinghouse) is a HIPAA-defined entity that processes health information from one format to another. Major clearinghouses include Availity, Change Healthcare, and Trizetto. They validate claims for errors before submission, improving clean claim rates.' },
          { _id: new mongoose.Types.ObjectId(), type: 'knowledgeCheckInline', order: 4, question: 'Integrated EHR/PM systems can reduce no-show rates by how much through automated appointment reminders?', options: ['5–10%', '15–20%', '25–40%', '50–75%'], correctAnswer: 2, feedback: { correct: 'Correct. Automated appointment reminders through integrated EHR/PM systems can reduce no-show rates by 25–40%, significantly improving practice revenue.', incorrect: 'Not quite. Studies show automated appointment reminders reduce no-shows by 25–40%.' } }
        ]
      },
      {
        _id: new mongoose.Types.ObjectId(),
        title: 'Telehealth Billing and Emerging Technologies',
        description: 'Mastering telehealth-specific billing requirements and future RCM technologies.',
        order: 1, estimatedTime: 12,
        contentBlocks: [
          { _id: new mongoose.Types.ObjectId(), type: 'text', order: 0, textContent: '<h2>Telehealth Billing Essentials</h2><p>Telehealth has transformed behavioral health service delivery, but it introduces unique billing complexities. Providers must understand three key elements for correct telehealth billing: place of service (POS) codes, modifiers, and payer-specific telehealth policies.</p><p>Place of Service Code 02 (Telehealth — Other than Patient\'s Home) and POS 10 (Telehealth — Patient\'s Home) indicate where the patient was located during the telehealth encounter. Using the correct POS code is critical because some payers reimburse at different rates based on the patient\'s location. Modifier 95 indicates a synchronous telehealth service using real-time audio and video, while modifier GT is used by some payers for the same purpose. Medicare requires modifier 95, while many commercial payers accept either.</p><p>Audio-only (telephone) services became more widely covered during the pandemic and many payers have continued this coverage. CPT codes 99441–99443 are specific to telephone evaluation and management services, while some payers allow billing standard psychotherapy codes (90834, 90837) with an audio-only modifier (93). Always verify payer-specific telehealth policies, as coverage varies significantly.</p><p>Emerging technologies in RCM include AI-powered coding assistance that suggests CPT/ICD codes based on clinical documentation, robotic process automation (RPA) for repetitive billing tasks, predictive analytics for denial prevention, and patient-facing financial tools like cost estimators and online payment portals. These technologies are projected to reduce RCM operational costs by 20–30% over the next five years.</p>' },
          { _id: new mongoose.Types.ObjectId(), type: 'funFactStat', order: 1, stat: '38×', body: 'Telehealth utilization in behavioral health increased 38 times above pre-pandemic levels during 2020. While utilization has stabilized, behavioral health still accounts for over 60% of all telehealth visits, making correct telehealth billing a critical skill for counselors.', source: 'McKinsey Digital Health Report 2024' },
          { _id: new mongoose.Types.ObjectId(), type: 'funFactFreeform', order: 2, prompt: 'What Place of Service code should be used when a patient receives a telehealth session from their home?', hint: 'It\'s a two-digit number', accepted: ['10', 'POS 10', 'pos 10'], close: ['02', 'POS 02', 'telehealth'], feedbacks: { hit: 'Correct! POS 10 designates "Telehealth Provided in Patient\'s Home" — introduced in 2022 to distinguish home-based telehealth from other telehealth settings.', close: 'Close — POS 02 is for telehealth at a location other than the patient\'s home. POS 10 is specifically for telehealth in the patient\'s home.', miss: 'The answer is POS 10 (Place of Service 10). It designates telehealth services provided while the patient is in their home.' }, reveal: 'Place of Service 10 was introduced on January 1, 2022, to distinguish telehealth services where the patient is at home from POS 02 (other telehealth locations). This distinction matters because some payers adjust reimbursement based on the patient\'s location.' },
          { _id: new mongoose.Types.ObjectId(), type: 'pillInstructions', order: 3, body: '<p>Telehealth billing requirements change frequently as payers update their policies. Always verify current telehealth billing guidelines with each payer before submitting claims. The CMS Medicare Telehealth Services list is updated quarterly.</p>' },
          { _id: new mongoose.Types.ObjectId(), type: 'knowledgeCheckInline', order: 4, question: 'Which modifier does Medicare require for synchronous telehealth services using real-time audio and video?', options: ['Modifier GT', 'Modifier 95', 'Modifier 25', 'Modifier 59'], correctAnswer: 1, feedback: { correct: 'Correct. Medicare requires modifier 95 for synchronous telehealth services. Some commercial payers accept modifier GT or 95.', incorrect: 'Not quite. Medicare specifically requires modifier 95 for synchronous telehealth services.' } },
          { _id: new mongoose.Types.ObjectId(), type: 'quiz', order: 5, isExam: true, title: 'Module 4 Final Exam: Technology and Telehealth', passingScore: 80, questions: [
            { _id: new mongoose.Types.ObjectId(), question: 'What percentage of behavioral health practices use a fully integrated EHR/PM system?', type: 'multipleChoice', options: [{ text: 'About 40%', isCorrect: false }, { text: 'About 62%', isCorrect: true }, { text: 'About 80%', isCorrect: false }, { text: 'About 96%', isCorrect: false }], explanation: 'About 62% of behavioral health practices use a fully integrated EHR/PM system, lagging behind the broader healthcare industry.' },
            { _id: new mongoose.Types.ObjectId(), question: 'What is a clearinghouse in healthcare billing?', type: 'multipleChoice', options: [{ text: 'A government agency that approves claims', isCorrect: false }, { text: 'An intermediary that validates, reformats, and routes electronic claims', isCorrect: true }, { text: 'A storage facility for paper claims', isCorrect: false }, { text: 'A patient billing portal', isCorrect: false }], explanation: 'A clearinghouse is a HIPAA-defined intermediary that processes and routes electronic claims between providers and payers.' },
            { _id: new mongoose.Types.ObjectId(), question: 'Automated appointment reminders can reduce no-show rates by:', type: 'multipleChoice', options: [{ text: '5–10%', isCorrect: false }, { text: '10–15%', isCorrect: false }, { text: '25–40%', isCorrect: true }, { text: '50–60%', isCorrect: false }], explanation: 'Automated reminders through EHR/PM systems reduce no-shows by 25–40%.' },
            { _id: new mongoose.Types.ObjectId(), question: 'Place of Service code 10 indicates:', type: 'multipleChoice', options: [{ text: 'In-office visit', isCorrect: false }, { text: 'Telehealth at a hospital', isCorrect: false }, { text: 'Telehealth in the patient\'s home', isCorrect: true }, { text: 'Emergency department visit', isCorrect: false }], explanation: 'POS 10 designates telehealth services where the patient is located in their home.' },
            { _id: new mongoose.Types.ObjectId(), question: 'Medicare requires which modifier for synchronous telehealth services?', type: 'multipleChoice', options: [{ text: 'Modifier GT', isCorrect: false }, { text: 'Modifier 95', isCorrect: true }, { text: 'Modifier 25', isCorrect: false }, { text: 'Modifier 93', isCorrect: false }], explanation: 'Medicare requires modifier 95 for synchronous telehealth services using real-time audio and video.' },
            { _id: new mongoose.Types.ObjectId(), question: 'Telehealth utilization in behavioral health increased by how much during 2020?', type: 'multipleChoice', options: [{ text: '5 times', isCorrect: false }, { text: '10 times', isCorrect: false }, { text: '38 times', isCorrect: true }, { text: '100 times', isCorrect: false }], explanation: 'Behavioral health telehealth utilization increased 38 times above pre-pandemic levels during 2020.' },
            { _id: new mongoose.Types.ObjectId(), question: 'Which CPT code range is specific to telephone E/M services?', type: 'multipleChoice', options: [{ text: '99201–99215', isCorrect: false }, { text: '99441–99443', isCorrect: true }, { text: '90834–90837', isCorrect: false }, { text: '99381–99397', isCorrect: false }], explanation: 'CPT codes 99441–99443 are specific to telephone evaluation and management services.' },
            { _id: new mongoose.Types.ObjectId(), question: 'Place of Service code 02 indicates:', type: 'multipleChoice', options: [{ text: 'Telehealth in the patient\'s home', isCorrect: false }, { text: 'Telehealth at a location other than the patient\'s home', isCorrect: true }, { text: 'In-office visit', isCorrect: false }, { text: 'Hospital outpatient department', isCorrect: false }], explanation: 'POS 02 is for telehealth at a location other than the patient\'s home.' },
            { _id: new mongoose.Types.ObjectId(), question: 'AI and automation technologies are projected to reduce RCM operational costs by:', type: 'multipleChoice', options: [{ text: '5–10%', isCorrect: false }, { text: '10–15%', isCorrect: false }, { text: '20–30%', isCorrect: true }, { text: '50–60%', isCorrect: false }], explanation: 'Emerging technologies are projected to reduce RCM operational costs by 20–30% over the next five years.' },
            { _id: new mongoose.Types.ObjectId(), question: 'Behavioral health accounts for what percentage of all telehealth visits?', type: 'multipleChoice', options: [{ text: 'About 20%', isCorrect: false }, { text: 'About 40%', isCorrect: false }, { text: 'Over 60%', isCorrect: true }, { text: 'Over 80%', isCorrect: false }], explanation: 'Behavioral health accounts for over 60% of all telehealth visits.' },
            { _id: new mongoose.Types.ObjectId(), question: 'What is the primary benefit of clearinghouse claim scrubbing?', type: 'multipleChoice', options: [{ text: 'Faster internet connectivity', isCorrect: false }, { text: 'Improved clean claim rates by catching errors before submission', isCorrect: true }, { text: 'Lower software licensing costs', isCorrect: false }, { text: 'Automatic patient collections', isCorrect: false }], explanation: 'Clearinghouse scrubbing validates claims for errors before submission, improving clean claim rates.' },
            { _id: new mongoose.Types.ObjectId(), question: 'When was POS code 10 introduced?', type: 'multipleChoice', options: [{ text: 'January 2020', isCorrect: false }, { text: 'January 2022', isCorrect: true }, { text: 'March 2020', isCorrect: false }, { text: 'January 2024', isCorrect: false }], explanation: 'POS 10 was introduced on January 1, 2022, to distinguish home-based telehealth from other telehealth locations.' },
            { _id: new mongoose.Types.ObjectId(), question: 'Which of the following is NOT an EHR feature that supports RCM?', type: 'multipleChoice', options: [{ text: 'Real-time eligibility checks', isCorrect: false }, { text: 'Auto-coding suggestions', isCorrect: false }, { text: 'Social media marketing integration', isCorrect: true }, { text: 'Electronic superbill generation', isCorrect: false }], explanation: 'Social media marketing is not an EHR feature that supports RCM workflows.' },
            { _id: new mongoose.Types.ObjectId(), question: 'Modifier 93 is used by some payers for:', type: 'multipleChoice', options: [{ text: 'In-person group therapy', isCorrect: false }, { text: 'Audio-only telehealth services', isCorrect: true }, { text: 'Hospital-based services', isCorrect: false }, { text: 'After-hours appointments', isCorrect: false }], explanation: 'Modifier 93 is used by some payers to indicate audio-only telehealth services.' },
            { _id: new mongoose.Types.ObjectId(), question: 'The CMS Medicare Telehealth Services list is updated:', type: 'multipleChoice', options: [{ text: 'Annually', isCorrect: false }, { text: 'Quarterly', isCorrect: true }, { text: 'Monthly', isCorrect: false }, { text: 'Only when new legislation passes', isCorrect: false }], explanation: 'The CMS Medicare Telehealth Services list is updated quarterly.' }
          ]}
        ]
      }
    ],
    totalEstimatedTime: 24, totalContentBlocks: 11, wordCount: 7500,
    createdAt: now, updatedAt: now
  };
  const result = await col.insertOne(doc);
  console.log(`\n✅ RCM Module 4 seeded:`);
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
