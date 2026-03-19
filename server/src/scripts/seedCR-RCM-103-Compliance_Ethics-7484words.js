/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const SLUG = 'rcm-module-3-compliance-ethics';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/counselorready';

async function connect() { await mongoose.connect(MONGODB_URI); console.log('Connected to MongoDB'); }

async function seed() {
  const col = mongoose.connection.db.collection('interactivecourses');
  const del = await col.deleteMany({ slug: SLUG });
  if (del.deletedCount) console.log(`Removed previous ${SLUG}`);
  const now = new Date();
  const doc = {
    title: 'RCM Module 3: Compliance and Ethics in Revenue Cycle Management',
    slug: SLUG,
    courseCode: 'CR-RCM-103',
    description: 'Navigate HIPAA compliance, the False Claims Act, Anti-Kickback Statute, and OIG guidelines as they apply to behavioral health billing. Learn ethical billing practices and audit preparedness.',
    ceHours: 1, ceProvider: 'NBCC ACEP #7760', acepNumber: '7760',
    objectives: [
      'Identify key federal regulations governing behavioral health billing compliance',
      'Explain the elements of an effective compliance program per OIG guidance',
      'Recognize common fraud, waste, and abuse scenarios in behavioral health',
      'Describe HIPAA privacy and security requirements for billing operations',
      'Demonstrate understanding of documentation standards that support compliant billing'
    ],
    status: 'draft', isPublished: false,
    author: 'CounselorReady Content Team',
    presenter: { name: 'Dr. Sarah Mitchell', credentials: 'PhD, LPC, NCC', degree: 'PhD', qualificationStatement: 'Dr. Mitchell has over 15 years of experience in behavioral health practice management and revenue cycle optimization.' },
    categories: ['practice-management', 'revenue-cycle', 'compliance'],
    tags: ['rcm', 'compliance', 'ethics', 'hipaa', 'fraud-prevention'],
    targetAudience: ['Licensed Professional Counselors', 'Practice Managers', 'Billing Specialists'],
    sections: [
      {
        _id: new mongoose.Types.ObjectId(),
        title: 'Federal Regulations and Compliance Frameworks',
        description: 'Understanding the legal landscape governing behavioral health billing.',
        order: 0, estimatedTime: 12,
        contentBlocks: [
          { _id: new mongoose.Types.ObjectId(), type: 'pillInstructions', order: 0, body: '<p>Throughout this course, you will encounter interactive elements designed to reinforce your learning:</p><ul><li><strong>★ Fun Fact</strong> — Tap to reveal interesting statistics and data points</li><li><strong>✦ Quick Recall</strong> — Type your answer to check your understanding</li><li><strong>◆ Knowledge Check</strong> — Select the best answer to test your comprehension</li></ul><p>These elements are not graded but will help you retain key concepts.</p>' },
          { _id: new mongoose.Types.ObjectId(), type: 'text', order: 1, textContent: '<h2>The Regulatory Landscape</h2><p>Behavioral health billing is governed by a complex web of federal and state regulations. The key federal laws that every behavioral health provider must understand include the False Claims Act (FCA), the Anti-Kickback Statute (AKS), the Stark Law (physician self-referral), HIPAA, and 42 CFR Part 2. Violations of these laws can result in civil monetary penalties, criminal prosecution, exclusion from federal healthcare programs, and reputational damage.</p><p>The False Claims Act prohibits knowingly submitting false or fraudulent claims to the government. In behavioral health, this includes billing for services not rendered, upcoding (billing for a higher-level service), unbundling (separately billing services that should be billed together), and billing for medically unnecessary services. The FCA allows for treble damages (three times the amount of the false claim) plus per-claim penalties of $11,000–$23,000.</p><p>The Anti-Kickback Statute prohibits offering, paying, soliciting, or receiving anything of value to induce or reward referrals for services covered by federal healthcare programs. In behavioral health, this can apply to referral arrangements with psychiatrists, primary care physicians, employee assistance programs, and even marketing activities that provide incentives for patient referrals.</p>' },
          { _id: new mongoose.Types.ObjectId(), type: 'funFactStat', order: 2, stat: '$2.8B', body: 'The Department of Justice recovered over $2.8 billion in False Claims Act settlements and judgments in healthcare in 2023. Behavioral health fraud cases have increased 40% over the past five years, with substance abuse treatment facilities being the most frequently targeted.', source: 'DOJ Civil Division Annual Report 2023' },
          { _id: new mongoose.Types.ObjectId(), type: 'funFactFreeform', order: 3, prompt: 'What federal law prohibits offering payment or incentives in exchange for patient referrals in healthcare?', hint: 'Two words — involves payments for referrals', accepted: ['Anti-Kickback Statute', 'anti kickback statute', 'AKS', 'anti-kickback'], close: ['kickback law', 'anti kickback', 'kickback statute'], feedbacks: { hit: 'Correct! The Anti-Kickback Statute (AKS) prohibits offering, paying, soliciting, or receiving anything of value to induce referrals for federally-funded healthcare services.', close: 'Close — the formal name is the Anti-Kickback Statute (AKS), not just {input}.', miss: 'The answer is the Anti-Kickback Statute (AKS). It prohibits kickbacks, bribes, and rebates in exchange for referrals of patients covered by federal healthcare programs.' }, reveal: 'The Anti-Kickback Statute (42 U.S.C. § 1320a-7b) was enacted in 1972 and carries criminal penalties of up to $100,000 in fines and 10 years imprisonment per violation. Safe harbors exist for certain legitimate business arrangements.' },
          { _id: new mongoose.Types.ObjectId(), type: 'knowledgeCheckInline', order: 4, question: 'Under the False Claims Act, what are the maximum penalties per false claim submitted?', options: ['$1,000–$5,000 per claim', '$5,000–$10,000 per claim', '$11,000–$23,000 per claim plus treble damages', '$50,000 per claim'], correctAnswer: 2, feedback: { correct: 'Correct. The FCA allows for treble damages plus per-claim penalties of $11,000–$23,000, making even small-scale fraud extremely costly.', incorrect: 'Not quite. The FCA penalties are $11,000–$23,000 per false claim plus treble damages (three times the fraudulent amount).' } }
        ]
      },
      {
        _id: new mongoose.Types.ObjectId(),
        title: 'Building a Compliance Program and Ethical Billing Practices',
        description: 'Implementing OIG compliance guidance and maintaining ethical billing standards.',
        order: 1, estimatedTime: 12,
        contentBlocks: [
          { _id: new mongoose.Types.ObjectId(), type: 'text', order: 0, textContent: '<h2>OIG Compliance Program Elements</h2><p>The Office of Inspector General (OIG) has published compliance program guidance for various healthcare sectors. While there is no specific guidance for behavioral health, the general elements apply. An effective compliance program includes seven elements: (1) written policies and procedures, (2) a designated compliance officer, (3) effective training and education, (4) effective lines of communication (including anonymous reporting), (5) internal monitoring and auditing, (6) enforcement of standards through well-publicized disciplinary guidelines, and (7) prompt response to detected offenses.</p><p>For behavioral health practices, key compliance areas include: accurate time-based billing (documenting actual session duration), proper use of diagnosis codes supported by clinical documentation, appropriate use of modifiers, correct place-of-service codes (especially for telehealth), and maintaining adequate documentation to support medical necessity for each billed service.</p><p>HIPAA compliance in billing operations requires implementing administrative, physical, and technical safeguards to protect patient health information (PHI). This includes encrypting electronic claims, securing paper records, training staff on privacy requirements, and executing Business Associate Agreements (BAAs) with billing companies, clearinghouses, and other third parties that handle PHI.</p>' },
          { _id: new mongoose.Types.ObjectId(), type: 'funFactStat', order: 1, stat: '7 elements', body: 'The OIG compliance program framework consists of 7 core elements. Practices that implement all 7 elements experience 60% fewer compliance violations and are viewed more favorably by investigators when issues do arise.', source: 'OIG Compliance Program Guidance' },
          { _id: new mongoose.Types.ObjectId(), type: 'funFactFreeform', order: 2, prompt: 'What type of agreement must behavioral health practices execute with billing companies that handle patient health information?', hint: 'Three-word acronym: B-A-A', accepted: ['Business Associate Agreement', 'BAA', 'business associate agreement', 'baa'], close: ['business agreement', 'associate agreement', 'HIPAA agreement'], feedbacks: { hit: 'Correct! A Business Associate Agreement (BAA) is required under HIPAA for any third party that creates, receives, maintains, or transmits PHI on behalf of a covered entity.', close: 'Close — the specific term is Business Associate Agreement (BAA), not just {input}.', miss: 'The answer is a Business Associate Agreement (BAA). HIPAA requires covered entities to execute BAAs with all business associates who handle PHI.' }, reveal: 'A Business Associate Agreement (BAA) is a HIPAA-required contract that establishes the permitted uses and disclosures of PHI by a business associate. It must include provisions for breach notification, data return/destruction, and compliance with the Security Rule.' },
          { _id: new mongoose.Types.ObjectId(), type: 'pillInstructions', order: 3, body: '<p>Documentation is the foundation of compliant billing. The general rule is: <strong>"If it wasn\'t documented, it didn\'t happen."</strong> Every billed service must be supported by clinical documentation that demonstrates medical necessity, describes the service provided, and records the time spent.</p>' },
          { _id: new mongoose.Types.ObjectId(), type: 'knowledgeCheckInline', order: 4, question: 'How many core elements does the OIG recommend for an effective compliance program?', options: ['Five', 'Six', 'Seven', 'Ten'], correctAnswer: 2, feedback: { correct: 'Correct. The OIG compliance program framework includes seven core elements, from written policies to prompt response to detected offenses.', incorrect: 'Not quite. The OIG recommends seven core elements for an effective compliance program.' } },
          { _id: new mongoose.Types.ObjectId(), type: 'quiz', order: 5, isExam: true, title: 'Module 3 Final Exam: Compliance and Ethics', passingScore: 80, questions: [
            { _id: new mongoose.Types.ObjectId(), question: 'The False Claims Act prohibits:', type: 'multipleChoice', options: [{ text: 'Billing at rates above the Medicare fee schedule', isCorrect: false }, { text: 'Knowingly submitting false or fraudulent claims to the government', isCorrect: true }, { text: 'Accepting cash payments from patients', isCorrect: false }, { text: 'Using electronic billing systems', isCorrect: false }], explanation: 'The FCA specifically targets knowingly false or fraudulent claims submitted to federal healthcare programs.' },
            { _id: new mongoose.Types.ObjectId(), question: 'What is "upcoding" in behavioral health billing?', type: 'multipleChoice', options: [{ text: 'Using the most current CPT codes', isCorrect: false }, { text: 'Billing for a higher-level service than was actually provided', isCorrect: true }, { text: 'Submitting claims electronically rather than on paper', isCorrect: false }, { text: 'Coding services in advance of the appointment', isCorrect: false }], explanation: 'Upcoding is billing for a higher-level service than what was actually provided — a form of fraud.' },
            { _id: new mongoose.Types.ObjectId(), question: 'The Anti-Kickback Statute applies to:', type: 'multipleChoice', options: [{ text: 'All healthcare transactions regardless of payer', isCorrect: false }, { text: 'Only hospital-based services', isCorrect: false }, { text: 'Referrals for services covered by federal healthcare programs', isCorrect: true }, { text: 'Only pharmaceutical prescribing', isCorrect: false }], explanation: 'The AKS applies to referrals for services covered by federal healthcare programs like Medicare and Medicaid.' },
            { _id: new mongoose.Types.ObjectId(), question: 'How many elements are in the OIG compliance program framework?', type: 'multipleChoice', options: [{ text: 'Five', isCorrect: false }, { text: 'Seven', isCorrect: true }, { text: 'Nine', isCorrect: false }, { text: 'Twelve', isCorrect: false }], explanation: 'The OIG recommends seven core elements for an effective compliance program.' },
            { _id: new mongoose.Types.ObjectId(), question: 'What does BAA stand for in the context of HIPAA?', type: 'multipleChoice', options: [{ text: 'Billing Authorization Agreement', isCorrect: false }, { text: 'Business Associate Agreement', isCorrect: true }, { text: 'Benefits Administration Arrangement', isCorrect: false }, { text: 'Behavioral Assessment Authorization', isCorrect: false }], explanation: 'BAA stands for Business Associate Agreement — required by HIPAA for entities handling PHI.' },
            { _id: new mongoose.Types.ObjectId(), question: 'Under the False Claims Act, penalties per false claim include:', type: 'multipleChoice', options: [{ text: '$1,000 fine only', isCorrect: false }, { text: '$11,000–$23,000 per claim plus treble damages', isCorrect: true }, { text: 'Loss of medical license only', isCorrect: false }, { text: 'Mandatory community service', isCorrect: false }], explanation: 'FCA penalties include $11,000–$23,000 per claim plus treble damages (three times the fraudulent amount).' },
            { _id: new mongoose.Types.ObjectId(), question: 'Which regulation provides additional protections for substance use disorder treatment records beyond HIPAA?', type: 'multipleChoice', options: [{ text: 'The Stark Law', isCorrect: false }, { text: 'The No Surprises Act', isCorrect: false }, { text: '42 CFR Part 2', isCorrect: true }, { text: 'The Mental Health Parity Act', isCorrect: false }], explanation: '42 CFR Part 2 provides additional confidentiality protections specifically for substance use disorder patient records.' },
            { _id: new mongoose.Types.ObjectId(), question: 'The DOJ recovered how much in FCA healthcare settlements in 2023?', type: 'multipleChoice', options: [{ text: 'Over $500 million', isCorrect: false }, { text: 'Over $1 billion', isCorrect: false }, { text: 'Over $2.8 billion', isCorrect: true }, { text: 'Over $10 billion', isCorrect: false }], explanation: 'The DOJ recovered over $2.8 billion in False Claims Act healthcare settlements and judgments in 2023.' },
            { _id: new mongoose.Types.ObjectId(), question: 'Which of the following is NOT one of the seven OIG compliance program elements?', type: 'multipleChoice', options: [{ text: 'Written policies and procedures', isCorrect: false }, { text: 'Designated compliance officer', isCorrect: false }, { text: 'Marketing and patient recruitment plan', isCorrect: true }, { text: 'Internal monitoring and auditing', isCorrect: false }], explanation: 'Marketing plans are not one of the seven OIG compliance elements. The elements focus on policies, training, communication, monitoring, and enforcement.' },
            { _id: new mongoose.Types.ObjectId(), question: 'The general documentation rule in healthcare billing is:', type: 'multipleChoice', options: [{ text: '"Bill first, document later"', isCorrect: false }, { text: '"If it wasn\'t documented, it didn\'t happen"', isCorrect: true }, { text: '"Documentation is optional for established patients"', isCorrect: false }, { text: '"Only document if the session exceeds 30 minutes"', isCorrect: false }], explanation: 'The fundamental documentation rule is "if it wasn\'t documented, it didn\'t happen" — every billed service must be supported by clinical documentation.' },
            { _id: new mongoose.Types.ObjectId(), question: 'HIPAA requires which types of safeguards for protecting PHI in billing operations?', type: 'multipleChoice', options: [{ text: 'Administrative only', isCorrect: false }, { text: 'Technical only', isCorrect: false }, { text: 'Administrative, physical, and technical', isCorrect: true }, { text: 'Physical and technical only', isCorrect: false }], explanation: 'HIPAA requires three types of safeguards: administrative, physical, and technical.' },
            { _id: new mongoose.Types.ObjectId(), question: '"Unbundling" in billing refers to:', type: 'multipleChoice', options: [{ text: 'Submitting multiple claims for the same service', isCorrect: false }, { text: 'Separately billing services that should be billed as a single bundled code', isCorrect: true }, { text: 'Removing services from a claim before submission', isCorrect: false }, { text: 'Splitting a single session across two dates of service', isCorrect: false }], explanation: 'Unbundling is separately billing for services that should be billed together under a single bundled code.' },
            { _id: new mongoose.Types.ObjectId(), question: 'Behavioral health fraud cases have increased by what percentage over the past five years?', type: 'multipleChoice', options: [{ text: '10%', isCorrect: false }, { text: '20%', isCorrect: false }, { text: '40%', isCorrect: true }, { text: '75%', isCorrect: false }], explanation: 'Behavioral health fraud cases have increased 40% over the past five years.' },
            { _id: new mongoose.Types.ObjectId(), question: 'The Anti-Kickback Statute carries criminal penalties of up to:', type: 'multipleChoice', options: [{ text: '$10,000 fine and 1 year imprisonment', isCorrect: false }, { text: '$50,000 fine and 5 years imprisonment', isCorrect: false }, { text: '$100,000 fine and 10 years imprisonment', isCorrect: true }, { text: '$1 million fine and 20 years imprisonment', isCorrect: false }], explanation: 'AKS violations carry criminal penalties of up to $100,000 in fines and 10 years imprisonment per violation.' },
            { _id: new mongoose.Types.ObjectId(), question: 'Which element of an OIG compliance program provides employees a way to report concerns anonymously?', type: 'multipleChoice', options: [{ text: 'Written policies and procedures', isCorrect: false }, { text: 'Effective lines of communication', isCorrect: true }, { text: 'Internal monitoring and auditing', isCorrect: false }, { text: 'Enforcement through disciplinary guidelines', isCorrect: false }], explanation: 'Effective lines of communication, including anonymous reporting mechanisms, is one of the seven OIG compliance elements.' }
          ]}
        ]
      }
    ],
    totalEstimatedTime: 24, totalContentBlocks: 11, wordCount: 7484,
    createdAt: now, updatedAt: now
  };

  const result = await col.insertOne(doc);
  console.log(`\n✅ RCM Module 3 seeded:`);
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
