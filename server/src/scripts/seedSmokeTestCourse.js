/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// scripts/seedSmokeTestCourse.js
// Seeds a temporary QA smoke-test course that auto-deletes via MongoDB TTL.
//
// Usage:
//   node src/scripts/seedSmokeTestCourse.js              # expires in 24 hours (default)
//   EXPIRE_HOURS=2 node src/scripts/seedSmokeTestCourse.js  # expires in 2 hours
//   node src/scripts/seedSmokeTestCourse.js --remove     # manually remove it now
// ================================================================

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Course } from '../models/InteractiveCourse.js';

dotenv.config();

const SLUG = 'qa-smoke-test-course';

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
}

async function removeCourse() {
  const result = await Course.deleteOne({ slug: SLUG });
  if (result.deletedCount) {
    console.log('Removed existing smoke-test course');
  }
  return result.deletedCount;
}

async function seedCourse() {
  const hours = parseInt(process.env.EXPIRE_HOURS || '24', 10);
  const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);

  // Remove any previous smoke-test course
  await removeCourse();

  const course = await Course.create({
    title: '[QA] Smoke Test Course',
    slug: SLUG,
    description: 'Temporary course for QA testing. Auto-deletes via TTL.',
    ceHours: 1,
    ceProvider: 'NBCC ACEP #7760',
    acepNumber: '7760',
    objectives: ['Verify course catalog display', 'Verify enrollment flow', 'Verify progress tracking'],
    status: 'published',
    publishedAt: new Date(),
    expiresAt,
    author: 'QA Automation',
    presenter: {
      name: 'QA Tester',
      credentials: 'N/A',
      degree: 'N/A',
      qualificationStatement: 'Automated QA test course'
    },
    categories: ['qa-test'],
    tags: ['smoke-test', 'qa'],
    sections: [
      {
        title: 'Introduction',
        description: 'Smoke test section 1',
        order: 0,
        estimatedTime: 5,
        contentBlocks: [
          {
            type: 'text',
            order: 0,
            textContent: '<p>This is a temporary QA smoke-test course. It will auto-delete at ' + expiresAt.toISOString() + '.</p>'
          },
          {
            type: 'multipleChoice',
            order: 1,
            question: 'Is this a smoke test?',
            options: [
              { text: 'Yes', isCorrect: true },
              { text: 'No', isCorrect: false }
            ],
            explanation: 'This is indeed a smoke test course.'
          }
        ],
        hasQuiz: true,
        quizQuestions: [
          {
            question: 'What is the purpose of this course?',
            type: 'multipleChoice',
            options: [
              { text: 'QA testing', isCorrect: true },
              { text: 'CE credit', isCorrect: false },
              { text: 'Production use', isCorrect: false }
            ],
            explanation: 'This course exists for QA testing only.'
          }
        ],
        quizPassThreshold: 0.8
      }
    ],
    assessment: {
      title: 'Smoke Test Final Assessment',
      timeLimit: 5,
      passThreshold: 0.8,
      attemptsAllowed: 99,
      shuffleQuestions: false,
      shuffleOptions: false,
      questions: [
        {
          question: 'Did the smoke test course load correctly?',
          type: 'trueFalse',
          options: [
            { text: 'True', isCorrect: true },
            { text: 'False', isCorrect: false }
          ],
          explanation: 'If you can see this, the course loaded.'
        }
      ]
    }
  });

  console.log(`\nSmoke-test course seeded:`);
  console.log(`  ID:         ${course._id}`);
  console.log(`  Slug:       ${course.slug}`);
  console.log(`  Status:     ${course.status}`);
  console.log(`  Expires at: ${expiresAt.toISOString()} (${hours}h from now)`);
  console.log(`\nThe course should now appear in the catalog. MongoDB will auto-delete it at expiry.`);
  console.log(`To remove manually: node src/scripts/seedSmokeTestCourse.js --remove`);
}

async function main() {
  await connectDB();

  if (process.argv.includes('--remove')) {
    const count = await removeCourse();
    if (!count) console.log('No smoke-test course found to remove');
  } else {
    await seedCourse();
  }

  await mongoose.disconnect();
}

main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
