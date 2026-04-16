// CR-TEST-001 | Backup Verification Test Course
// $1.00 | 0 CE | For testing Stripe + course player + certificate flow
// Run in Render shell: node src/scripts/seedTestCourse.js

import mongoose from 'mongoose';
// Run validator first: node src/scripts/validateSeed.js src/scripts/seedTestCourse.js
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

const courseData = {
  slug: "test-backup-verification",
  title: "Platform Test Course",
  subtitle: "Internal verification only",
  description: "A $1.00 test course to verify the full purchase, completion, and certificate pipeline. Not for learners.",
  courseCode: "CR-TEST-001",
  instructor: "GA Integrated Therapeutic Perspectives LLC",

  ceHours: 0,
  ceCategory: "General",
  ceuHours: 0,
  ceuEligible: false,
  approvingBody: "NBCC",
  approvalNumber: "#7760",

  accessType: "paid",
  price: 1.00,
  pricingTier: "standard",
  status: "published",
  isPublished: true,
  deliveryMethod: "online",
  level: "Beginner",
  category: "General",
  contentArea: "Counselor Professional Identity and Practice Issues",

  objectives: [
    "Verify the course player loads content correctly",
    "Verify Stripe checkout processes a $1.00 payment",
    "Verify certificate generation on completion"
  ],

  targetAudience: ["Platform administrators", "QA testing"],

  sections: [
    {
      title: "Test Section",
      order: 1,
      contentBlocks: [
        {
          type: "sectionDivider",
          order: 1,
          title: "Test Section",
          sectionNumber: 1
        },
        {
          type: "text",
          order: 2,
          content: "<h2>Platform Verification</h2><p>This is a test course used to verify the CounselorReady platform is functioning correctly. It confirms that courses load, content renders, and the completion pipeline works end to end. If you can read this, the course player is working.</p>"
        }
      ]
    }
  ],

  assessment: {
    questions: [
      {
        question: "Is this a test course?",
        type: "multiple_choice",
        options: ["Yes", "No", "Maybe", "Unsure"],
        correctAnswer: 0,
        explanation: "This is indeed a test course."
      },
      {
        question: "What is being verified?",
        type: "multiple_choice",
        options: [
          "Nothing",
          "The full purchase and completion pipeline",
          "Only the homepage",
          "Only the login page"
        ],
        correctAnswer: 1,
        explanation: "This course verifies purchase, completion, and certificate generation."
      }
    ],
    passingScore: 80,
    passThreshold: 0.80,
    maxAttempts: 10
  },

  references: [],

  settings: {
    passingScore: 80,
    certificateEnabled: true,
    requireEvaluation: false,
    requireAttestation: false
  }
};

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const db = mongoose.connection.db;
    const collection = db.collection("interactivecourses");

    // Remove old version if exists
    const deleted = await collection.deleteOne({ slug: courseData.slug });
    if (deleted.deletedCount) {
      console.log("Removed existing test course");
    }

    // Insert
    const result = await collection.insertOne({
      ...courseData,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log(`\n✓ Test course seeded: ${courseData.title}`);
    console.log(`  Slug: ${courseData.slug}`);
    console.log(`  Price: $${courseData.price}`);
    console.log(`  ID: ${result.insertedId}`);
    console.log(`\n  View: https://counselorready.com/course-details.html?slug=${courseData.slug}`);
    console.log(`  Play: https://counselorready.com/interactive-course.html?slug=${courseData.slug}`);
  } catch (err) {
    console.error("Seed failed:", err);
  } finally {
    await mongoose.disconnect();
    console.log("\nDone.");
  }
}

seed();
