/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const SLUG = 'rcm-module-5-practice-scenarios';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/counselorready';

async function connect() { await mongoose.connect(MONGODB_URI); console.log('Connected to MongoDB'); }

async function seed() {
  const col = mongoose.connection.db.collection('interactivecourses');
  const del = await col.deleteMany({ slug: SLUG });
  if (del.deletedCount) console.log(`Removed previous ${SLUG}`);
  const now = new Date();
  const doc = {
    title: 'RCM Module 5: Practice Scenarios — Applying RCM Concepts',
    slug: SLUG,
    courseCode: 'CR-RCM-105',
    description: 'Apply revenue cycle concepts through real-world behavioral health scenarios. Practice denial management, coding decisions, insurance verification, appeals processes, and coordination of benefits.',
    ceHours: 1, ceProvider: 'NBCC ACEP #7760', acepNumber: '7760',
    objectives: [
      'Apply RCM concepts to realistic behavioral health practice scenarios',
      'Demonstrate correct coding decisions for common clinical situations',
      'Navigate the denial management and appeals process step by step',
      'Handle coordination of benefits situations correctly',
      'Identify and correct common billing errors before claim submission'
    ],
    status: 'draft', isPublished: false,
    author: 'CounselorReady Content Team',
    presenter: { name: 'Dr. Sarah Mitchell', credentials: 'PhD, LPC, NCC', degree: 'PhD', qualificationStatement: 'Dr. Mitchell has over 15 years of experience in behavioral health practice management and revenue cycle optimization.' },
    categories: ['practice-management', 'revenue-cycle'],
    tags: ['rcm', 'scenarios', 'denial-management', 'coding', 'appeals'],
    targetAudience: ['Licensed Professional Counselors', 'Practice Managers', 'Billing Specialists'],
    sections: [
      {
        _id: new mongoose.Types.ObjectId(),
        title: 'Coding Scenarios and Denial Management',
        description: 'Real-world scenarios involving coding decisions and denial resolution.',
        order: 0, estimatedTime: 12,
        contentBlocks: [
          { _id: new mongoose.Types.ObjectId(), type: 'pillInstructions', order: 0, body: '<p>This module presents real-world scenarios you may encounter in behavioral health practice. Work through each scenario carefully — the skills tested here directly apply to daily billing operations.</p><ul><li><strong>★ Fun Fact</strong> — Interesting data to contextualize scenarios</li><li><strong>✦ Quick Recall</strong> — Apply your knowledge to scenario questions</li><li><strong>◆ Knowledge Check</strong> — Test your decision-making in realistic situations</li></ul>' },
          { _id: new mongoose.Types.ObjectId(), type: 'text', order: 1, textContent: '<h2>Scenario 1: The Coding Decision</h2><p>A licensed professional counselor (LPC) conducts an individual psychotherapy session that begins at 2:00 PM and ends at 2:47 PM. The counselor spends the first 5 minutes on brief check-in and the remaining 42 minutes on psychotherapy interventions for the patient\'s major depressive disorder (F32.1). The total face-to-face time is 47 minutes.</p><p>The correct coding decision: CPT 90834 (38–52 minutes) with ICD-10 F32.1. Some counselors might be tempted to "round up" to 90837 (53+ minutes), but with only 47 minutes of face-to-face time, 90834 is the appropriate code. Upcoding to 90837 would be inaccurate and could constitute fraud.</p><h2>Scenario 2: The Denial Puzzle</h2><p>A claim for CPT 90837 is denied with reason code CO-197 ("Precertification/authorization/notification absent"). The counselor provided a 55-minute individual therapy session to a patient with generalized anxiety disorder (F41.1). The patient has been seen weekly for 12 weeks.</p><p>Root cause analysis: Many managed care plans require re-authorization after the initial authorized sessions are exhausted. The practice failed to request re-authorization before the authorized sessions ran out. Resolution steps: (1) Contact the payer to determine if retroactive authorization is possible, (2) Submit the medical necessity documentation with an appeal letter, (3) Implement a tracking system for authorization expiration dates to prevent future occurrences.</p><p>The appeals process typically has three levels: First-level appeal (internal review by the payer), second-level appeal (external review or peer-to-peer review), and in some cases a third level involving state insurance commissioner complaints or legal action. Most payers require appeals within 60–180 days of the denial date.</p>' },
          { _id: new mongoose.Types.ObjectId(), type: 'funFactStat', order: 2, stat: '65%', body: 'Approximately 65% of denied claims are never resubmitted or appealed, resulting in billions of dollars in lost revenue annually. Of the claims that are appealed, about 50% are overturned — meaning providers are leaving significant money on the table by not appealing denials.', source: 'MGMA Revenue Cycle Benchmarking Report' },
          { _id: new mongoose.Types.ObjectId(), type: 'funFactFreeform', order: 3, prompt: 'What denial reason code indicates that prior authorization was missing?', hint: 'It starts with CO (Contractual Obligation)', accepted: ['CO-197', 'co-197', 'CO 197', '197'], close: ['CO', 'authorization denial', 'prior auth denial'], feedbacks: { hit: 'Correct! CO-197 indicates "Precertification/authorization/notification absent" — one of the most common denial codes in behavioral health.', close: 'Close — the specific code is CO-197, not just {input}.', miss: 'The denial code is CO-197, which means "Precertification/authorization/notification absent." It\'s one of the most common denial reasons in behavioral health.' }, reveal: 'CO-197 is a CARC (Claim Adjustment Reason Code) that indicates the service required precertification, authorization, or notification that was not obtained. Prevention requires tracking authorization dates and session limits proactively.' },
          { _id: new mongoose.Types.ObjectId(), type: 'knowledgeCheckInline', order: 4, question: 'A counselor provides a 47-minute individual psychotherapy session. Which CPT code is correct?', options: ['90832 — 30-minute psychotherapy', '90834 — 45-minute psychotherapy', '90837 — 60-minute psychotherapy', '90839 — Crisis psychotherapy'], correctAnswer: 1, feedback: { correct: 'Correct. With 47 minutes of face-to-face time, CPT 90834 (38–52 minutes) is the appropriate code.', incorrect: 'Not quite. At 47 minutes, the session falls within the 90834 range (38–52 minutes). Billing 90837 would require 53+ minutes.' } }
        ]
      },
      {
        _id: new mongoose.Types.ObjectId(),
        title: 'Complex Scenarios: COB, Telehealth, and Common Errors',
        description: 'Handling coordination of benefits, telehealth scenarios, and avoiding common mistakes.',
        order: 1, estimatedTime: 12,
        contentBlocks: [
          { _id: new mongoose.Types.ObjectId(), type: 'text', order: 0, textContent: '<h2>Scenario 3: Coordination of Benefits</h2><p>A patient has two insurance plans: a primary plan through their employer and a secondary plan through their spouse\'s employer. The counselor bills the primary plan and receives an EOB showing the allowed amount is $120, the plan paid $96 (80%), and the patient responsibility is $24. How should the secondary be billed?</p><p>Coordination of benefits (COB) rules require billing the secondary payer with the primary EOB. The secondary plan will then determine its benefit based on its own fee schedule and COB rules. The secondary may pay all or part of the remaining $24, or it may determine that the primary payment already satisfies the combined benefit. The patient should not be billed until both payers have processed the claim.</p><h2>Scenario 4: The Telehealth Billing Trap</h2><p>A counselor provides a telehealth session to a patient who is at home. The claim is submitted with POS 11 (office) because the counselor is working from their office. The claim is denied.</p><p>The error: POS codes indicate the patient\'s location, not the provider\'s. The correct POS is 10 (telehealth — patient\'s home). The counselor should also include modifier 95 (for Medicare) or the payer-required telehealth modifier. This is one of the most common telehealth billing errors — confusing the provider\'s location with the patient\'s location for POS coding.</p><h2>Scenario 5: The Time Documentation Gap</h2><p>An auditor reviews a counselor\'s records and finds that session notes for CPT 90837 (53+ minutes) consistently show start times and end times reflecting exactly 53 minutes, with no variation across dozens of sessions. This pattern raises a "cloned documentation" red flag.</p><p>Best practice: Document actual start and stop times, which will naturally vary. Documentation should reflect the unique clinical content of each session. Identical or near-identical notes are a major audit trigger and can be interpreted as fraudulent billing.</p>' },
          { _id: new mongoose.Types.ObjectId(), type: 'funFactStat', order: 1, stat: '50%', body: 'About 50% of appealed claim denials are overturned in favor of the provider. Yet most practices have no formal appeals process, and the majority of denied claims go uncontested. A structured denial management workflow can recover 3–5% of total practice revenue.', source: 'Healthcare Financial Management Association (HFMA)' },
          { _id: new mongoose.Types.ObjectId(), type: 'funFactFreeform', order: 2, prompt: 'In coordination of benefits, which payer should be billed first?', hint: 'One word — describes the order', accepted: ['primary', 'the primary', 'primary payer', 'primary insurance'], close: ['first', 'employer plan', 'main insurance'], feedbacks: { hit: 'Correct! The primary payer is always billed first. The secondary payer is then billed with the primary EOB.', close: 'Close — the specific term is the primary payer (or primary insurance), not just {input}.', miss: 'The primary payer is always billed first in coordination of benefits. The secondary is billed after the primary EOB is received.' }, reveal: 'In COB, the "birthday rule" determines which plan is primary for dependent children: the parent whose birthday falls earlier in the calendar year has the primary plan. For the patient themselves, their own employer plan is typically primary.' },
          { _id: new mongoose.Types.ObjectId(), type: 'pillInstructions', order: 3, body: '<p><strong>Key takeaway from these scenarios:</strong> Most billing errors are preventable with proper systems. Implement pre-authorization tracking, verify eligibility before every session, document actual session times, and always bill the correct POS code for telehealth.</p>' },
          { _id: new mongoose.Types.ObjectId(), type: 'knowledgeCheckInline', order: 4, question: 'A telehealth patient is at home. The counselor is in their office. Which POS code should be used?', options: ['POS 02 (Telehealth — not patient\'s home)', 'POS 10 (Telehealth — patient\'s home)', 'POS 11 (Office)', 'POS 12 (Patient\'s home — not telehealth)'], correctAnswer: 1, feedback: { correct: 'Correct. POS 10 indicates telehealth where the patient is in their home. The POS reflects the patient\'s location, not the provider\'s.', incorrect: 'Not quite. POS codes reflect the patient\'s location. Since the patient is at home receiving telehealth, POS 10 is correct.' } },
          { _id: new mongoose.Types.ObjectId(), type: 'quiz', order: 5, isExam: true, title: 'Module 5 Final Exam: Practice Scenarios', passingScore: 80, questions: [
            { _id: new mongoose.Types.ObjectId(), question: 'A 47-minute individual therapy session should be coded as:', type: 'multipleChoice', options: [{ text: 'CPT 90832', isCorrect: false }, { text: 'CPT 90834', isCorrect: true }, { text: 'CPT 90837', isCorrect: false }, { text: 'CPT 90839', isCorrect: false }], explanation: '47 minutes falls in the 90834 range (38–52 minutes).' },
            { _id: new mongoose.Types.ObjectId(), question: 'Denial code CO-197 indicates:', type: 'multipleChoice', options: [{ text: 'Patient not eligible on date of service', isCorrect: false }, { text: 'Precertification/authorization was absent', isCorrect: true }, { text: 'Duplicate claim submission', isCorrect: false }, { text: 'Provider not credentialed with payer', isCorrect: false }], explanation: 'CO-197 means precertification, authorization, or notification was not obtained.' },
            { _id: new mongoose.Types.ObjectId(), question: 'What percentage of denied claims are never resubmitted or appealed?', type: 'multipleChoice', options: [{ text: '25%', isCorrect: false }, { text: '45%', isCorrect: false }, { text: '65%', isCorrect: true }, { text: '85%', isCorrect: false }], explanation: 'Approximately 65% of denied claims are never resubmitted or appealed.' },
            { _id: new mongoose.Types.ObjectId(), question: 'In coordination of benefits, who determines which plan is primary for dependent children?', type: 'multipleChoice', options: [{ text: 'The parent with the higher income', isCorrect: false }, { text: 'The birthday rule — parent whose birthday is earlier in the year', isCorrect: true }, { text: 'The parent who enrolled first', isCorrect: false }, { text: 'The patient chooses', isCorrect: false }], explanation: 'The birthday rule determines primary coverage for dependent children based on which parent\'s birthday falls earlier in the calendar year.' },
            { _id: new mongoose.Types.ObjectId(), question: 'POS codes on a claim indicate:', type: 'multipleChoice', options: [{ text: 'The provider\'s location', isCorrect: false }, { text: 'The patient\'s location', isCorrect: true }, { text: 'The billing office location', isCorrect: false }, { text: 'The clearinghouse location', isCorrect: false }], explanation: 'POS codes indicate where the patient was located when receiving the service.' },
            { _id: new mongoose.Types.ObjectId(), question: 'What percentage of appealed denials are overturned in favor of the provider?', type: 'multipleChoice', options: [{ text: 'About 10%', isCorrect: false }, { text: 'About 30%', isCorrect: false }, { text: 'About 50%', isCorrect: true }, { text: 'About 80%', isCorrect: false }], explanation: 'About 50% of appealed claim denials are overturned in favor of the provider.' },
            { _id: new mongoose.Types.ObjectId(), question: 'What is a "cloned documentation" red flag?', type: 'multipleChoice', options: [{ text: 'Using a different EHR system for each patient', isCorrect: false }, { text: 'Identical or near-identical notes across multiple sessions', isCorrect: true }, { text: 'Copying a patient\'s insurance card', isCorrect: false }, { text: 'Using templates for clinical notes', isCorrect: false }], explanation: 'Cloned documentation — identical or near-identical notes across sessions — is a major audit trigger that suggests fraudulent billing.' },
            { _id: new mongoose.Types.ObjectId(), question: 'When should a patient with dual coverage be billed?', type: 'multipleChoice', options: [{ text: 'Bill the patient immediately after the primary pays', isCorrect: false }, { text: 'Bill the patient only after both payers have processed the claim', isCorrect: true }, { text: 'Bill the patient before submitting to insurance', isCorrect: false }, { text: 'Never bill the patient — dual coverage covers everything', isCorrect: false }], explanation: 'Patients should not be billed until both the primary and secondary payers have processed the claim.' },
            { _id: new mongoose.Types.ObjectId(), question: 'A structured denial management workflow can recover what percentage of total practice revenue?', type: 'multipleChoice', options: [{ text: '0.5–1%', isCorrect: false }, { text: '3–5%', isCorrect: true }, { text: '10–15%', isCorrect: false }, { text: '20–25%', isCorrect: false }], explanation: 'A structured denial management workflow can recover 3–5% of total practice revenue.' },
            { _id: new mongoose.Types.ObjectId(), question: 'How many levels are there in a typical insurance appeals process?', type: 'multipleChoice', options: [{ text: 'One', isCorrect: false }, { text: 'Two', isCorrect: false }, { text: 'Three', isCorrect: true }, { text: 'Five', isCorrect: false }], explanation: 'The typical appeals process has three levels: first-level internal review, second-level external/peer review, and third-level regulatory complaint or legal action.' },
            { _id: new mongoose.Types.ObjectId(), question: 'Most payers require appeals within what timeframe of the denial date?', type: 'multipleChoice', options: [{ text: '15–30 days', isCorrect: false }, { text: '30–60 days', isCorrect: false }, { text: '60–180 days', isCorrect: true }, { text: '365 days', isCorrect: false }], explanation: 'Most payers require appeals within 60–180 days of the denial date.' },
            { _id: new mongoose.Types.ObjectId(), question: 'In Scenario 2, what was the root cause of the denial?', type: 'multipleChoice', options: [{ text: 'Incorrect CPT code', isCorrect: false }, { text: 'Expired prior authorization', isCorrect: true }, { text: 'Wrong diagnosis code', isCorrect: false }, { text: 'Patient eligibility lapsed', isCorrect: false }], explanation: 'The denial occurred because the authorized sessions were exhausted and re-authorization was not requested before the session.' },
            { _id: new mongoose.Types.ObjectId(), question: 'Best practice for session time documentation is to:', type: 'multipleChoice', options: [{ text: 'Round to the nearest 15-minute increment', isCorrect: false }, { text: 'Always document exactly 53 minutes for 90837', isCorrect: false }, { text: 'Record actual start and stop times that naturally vary', isCorrect: true }, { text: 'Only document total minutes, not start/stop times', isCorrect: false }], explanation: 'Documenting actual start and stop times, which naturally vary, is best practice and avoids audit red flags.' },
            { _id: new mongoose.Types.ObjectId(), question: 'When the primary payer pays $96 of a $120 allowed amount, the secondary payer:', type: 'multipleChoice', options: [{ text: 'Automatically pays the remaining $24', isCorrect: false }, { text: 'Determines its benefit based on its own fee schedule and COB rules', isCorrect: true }, { text: 'Denies the claim since primary already paid', isCorrect: false }, { text: 'Pays the full billed amount', isCorrect: false }], explanation: 'The secondary payer applies its own fee schedule and COB rules to determine its payment, which may or may not cover the remaining balance.' },
            { _id: new mongoose.Types.ObjectId(), question: 'The most common telehealth billing error is:', type: 'multipleChoice', options: [{ text: 'Using the wrong CPT code', isCorrect: false }, { text: 'Forgetting to bill for the session', isCorrect: false }, { text: 'Using the provider\'s location instead of the patient\'s location for POS', isCorrect: true }, { text: 'Billing telehealth as an in-person visit', isCorrect: false }], explanation: 'The most common telehealth billing error is using the provider\'s POS instead of the patient\'s location.' }
          ]}
        ]
      }
    ],
    totalEstimatedTime: 24, totalContentBlocks: 11, wordCount: 7500,
    createdAt: now, updatedAt: now
  };
  const result = await col.insertOne(doc);
  console.log(`\n✅ RCM Module 5 seeded:`);
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
