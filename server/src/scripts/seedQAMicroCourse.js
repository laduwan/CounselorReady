/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// scripts/seedQAMicroCourse.js
// Seeds a minimal QA micro-course with 1 section, 1 quiz question, and 3 assessment questions.
// No TTL, no expiration — stays until manually removed.
//
// Usage:
//   node src/scripts/seedQAMicroCourse.js           # seed the course
//   node src/scripts/seedQAMicroCourse.js --remove  # remove it
// ================================================================

import mongoose from 'mongoose';
// Run validator first: node src/scripts/validateSeed.js src/scripts/seedQAMicroCourse.js
import dotenv from 'dotenv';

dotenv.config();

const SLUG = 'qa-micro-course';
const MONGO_URI = process.env.MONGODB_URI;

// ── Connect ──────────────────────────────────────────────────────────────────
async function connect() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');
}

// ── Seed directly into the interactivecourses collection ─────────────────────
async function seed() {
  const col = mongoose.connection.db.collection('interactivecourses');

  // Remove previous
  const del = await col.deleteMany({ slug: SLUG });
  if (del.deletedCount) console.log('Removed previous qa-micro-course');

  const now = new Date();
  const doc = {
    title: '[QA] Micro Course — 3 Questions',
    slug: SLUG,
    courseCode: 'QA-MICRO-001',
    description: 'Minimal QA smoke-test micro-course. 1 section, 3 assessment questions.',
    ceHours: 0.5,
    ceProvider: 'NBCC ACEP #7760',
    acepNumber: '7760',
    objectives: [
      'Verify the full course completion flow',
      'Verify certificate generation'
    ],
    status: 'published',
    publishedAt: now,
    author: 'QA Automation',
    presenter: {
      name: 'QA Bot',
      credentials: 'N/A',
      degree: 'N/A',
      qualificationStatement: 'Automated QA test course'
    },
    categories: ['qa-test'],
    tags: ['smoke-test', 'qa', 'micro'],
    targetAudience: ['QA testers'],

    // ── Single section with one text block and one inline MC ─────────────
    sections: [
      {
        _id: new mongoose.Types.ObjectId(),
        title: 'QA Overview',
        description: 'Read the paragraph, then proceed to the final assessment.',
        order: 0,
        estimatedTime: 2,
        contentBlocks: [
          {
            _id: new mongoose.Types.ObjectId(),
            type: 'text',
            order: 0,
            textContent: '<h2>Welcome to the QA Micro Course</h2><p>This is a minimal smoke-test course designed to verify the entire learner flow: reading content, passing a quiz, passing the final assessment, submitting an evaluation, signing the attestation, and downloading a certificate.</p><p>When you are ready, mark this section complete and proceed to the Final Assessment.</p>'
          }
        ],
        hasQuiz: true,
        quizQuestions: [
          {
            _id: new mongoose.Types.ObjectId(),
            question: 'What is the purpose of this micro course?',
            type: 'multipleChoice',
            options: [
              { text: 'QA smoke testing', isCorrect: true },
              { text: 'Earning real CE credit', isCorrect: false },
              { text: 'Production training', isCorrect: false }
            ],
            explanation: 'This course exists solely for QA testing.'
          }
        ],
        quizPassThreshold: 0.8
      }
    ],

    // ── Final assessment — 3 simple questions ────────────────────────────
    assessment: {
      title: 'QA Micro Assessment',
      timeLimit: 5,
      passThreshold: 0.7,
      attemptsAllowed: 99,
      shuffleQuestions: false,
      shuffleOptions: false,
      questions: [
        {
          _id: new mongoose.Types.ObjectId(),
          question: 'Did the course content load correctly?',
          type: 'trueFalse',
          options: [
            { text: 'True', isCorrect: true },
            { text: 'False', isCorrect: false }
          ],
          explanation: 'If you can read this, the content loaded.'
        },
        {
          _id: new mongoose.Types.ObjectId(),
          question: 'Which of the following is a goal of QA testing?',
          type: 'multipleChoice',
          options: [
            { text: 'Finding bugs before users do', isCorrect: true },
            { text: 'Writing marketing copy', isCorrect: false },
            { text: 'Designing logos', isCorrect: false }
          ],
          explanation: 'QA testing aims to find bugs before they reach users.'
        },
        {
          _id: new mongoose.Types.ObjectId(),
          question: 'Is this course intended for production CE credit?',
          type: 'trueFalse',
          options: [
            { text: 'True', isCorrect: false },
            { text: 'False', isCorrect: true }
          ],
          explanation: 'This course is for QA testing only — not real CE credit.'
        }
      ]
    },

    // ── Computed fields (normally set by pre-save hook) ──────────────────
    totalEstimatedTime: 2,
    totalContentBlocks: 1,
    totalQuizQuestions: 4, // 1 section quiz + 3 assessment
    wordCount: 60,

    createdAt: now,
    updatedAt: now
  };

  const result = await col.insertOne(doc);

  console.log('\n✅ QA Micro Course seeded:');
  console.log(`  ID:     ${result.insertedId}`);
  console.log(`  Slug:   ${SLUG}`);
  console.log(`  Status: published`);
  console.log(`\nAssessment answers (in order):`);
  console.log(`  1. True`);
  console.log(`  2. "Finding bugs before users do"`);
  console.log(`  3. False`);
  console.log(`\nTo remove: node src/scripts/seedQAMicroCourse.js --remove`);
}

async function remove() {
  const col = mongoose.connection.db.collection('interactivecourses');
  const result = await col.deleteMany({ slug: SLUG });
  console.log(result.deletedCount ? 'Removed qa-micro-course' : 'No qa-micro-course found');
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  await connect();
  if (process.argv.includes('--remove')) {
    await remove();
  } else {
    await seed();
  }
  await mongoose.disconnect();
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
