/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 */
// CR-TMH602-shell.js
// Seed script SHELL for CR-TMH602. All content is PLACEHOLDER.
// Deploy: node server/src/scripts/CR-TMH602-shell.js
// Requires: MONGODB_URI environment variable

import mongoose from "mongoose";
import { Course as InteractiveCourse } from "../models/InteractiveCourse.js";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌ No MONGODB_URI environment variable set");
  process.exit(1);
}

const P = "PLACEHOLDER";

// ═══ SECTION 1 ═══
const SECTION_1 = {
  title: P,
  description: P,
  order: 1,
  estimatedTime: 60,
  contentBlocks: [
    { type: "sectionDivider", order: 1, sectionNumber: 1, title: P, subtitle: P },
    { type: "text", order: 2, title: P, textContent: P },
    { type: "text", order: 3, title: P, textContent: P },
    {
      type: "accordion",
      order: 4,
      title: P,
      accordionItems: [
        { title: P, content: P },
        { title: P, content: P },
        { title: P, content: P },
      ],
    },
    { type: "text", order: 5, title: P, textContent: P },
    {
      type: "flashcardDeck",
      order: 6,
      title: P,
      flashcards: [
        { id: "s1-card-1", front: P, back: P },
        { id: "s1-card-2", front: P, back: P },
        { id: "s1-card-3", front: P, back: P },
        { id: "s1-card-4", front: P, back: P },
        { id: "s1-card-5", front: P, back: P },
        { id: "s1-card-6", front: P, back: P },
      ],
    },
    { type: "text", order: 7, title: P, textContent: P },
    { type: "text", order: 8, title: P, textContent: P },
    {
      type: "matching",
      order: 9,
      title: P,
      matchingInstructions: P,
      matchingPairs: [
        { term: P, definition: P },
        { term: P, definition: P },
        { term: P, definition: P },
        { term: P, definition: P },
      ],
    },
    {
      type: "knowledgeCheck",
      order: 10,
      title: P,
      question: P,
      options: [
        { text: P, isCorrect: true },
        { text: P, isCorrect: false },
        { text: P, isCorrect: false },
        { text: P, isCorrect: false },
      ],
      explanation: P,
    },
    {
      type: "knowledgeCheck",
      order: 11,
      title: P,
      question: P,
      options: [
        { text: P, isCorrect: false },
        { text: P, isCorrect: true },
        { text: P, isCorrect: false },
        { text: P, isCorrect: false },
      ],
      explanation: P,
    },
    { type: "reflection", order: 12, title: P, question: P, minLength: 50 },
  ],
};

// ═══ SECTION 2 ═══
const SECTION_2 = {
  title: P,
  description: P,
  order: 2,
  estimatedTime: 60,
  contentBlocks: [
    { type: "sectionDivider", order: 1, sectionNumber: 2, title: P, subtitle: P },
    { type: "text", order: 2, title: P, textContent: P },
    { type: "text", order: 3, title: P, textContent: P },
    {
      type: "accordion",
      order: 4,
      title: P,
      accordionItems: [
        { title: P, content: P },
        { title: P, content: P },
        { title: P, content: P },
      ],
    },
    { type: "text", order: 5, title: P, textContent: P },
    { type: "text", order: 6, title: P, textContent: P },
    {
      type: "accordion",
      order: 7,
      title: P,
      accordionItems: [
        { title: P, content: P },
        { title: P, content: P },
        { title: P, content: P },
        { title: P, content: P },
        { title: P, content: P },
        { title: P, content: P },
        { title: P, content: P },
        { title: P, content: P },
      ],
    },
    { type: "text", order: 8, title: P, textContent: P },
    { type: "text", order: 9, title: P, textContent: P },
    {
      type: "scenarioTree",
      order: 10,
      title: P,
      scenarioTitle: P,
      startNode: "start",
      nodes: {
        start: { text: P, choices: [{ label: P, next: "nodeA" }, { label: P, next: "nodeB" }] },
        nodeA: { text: P, choices: [] },
        nodeB: { text: P, choices: [] },
      },
    },
    {
      type: "knowledgeCheck",
      order: 11,
      title: P,
      question: P,
      options: [
        { text: P, isCorrect: true },
        { text: P, isCorrect: false },
        { text: P, isCorrect: false },
        { text: P, isCorrect: false },
      ],
      explanation: P,
    },
    {
      type: "knowledgeCheck",
      order: 12,
      title: P,
      question: P,
      options: [
        { text: P, isCorrect: false },
        { text: P, isCorrect: true },
        { text: P, isCorrect: false },
        { text: P, isCorrect: false },
      ],
      explanation: P,
    },
    { type: "reflection", order: 13, title: P, question: P, minLength: 50 },
  ],
};

// ═══ SECTION 3 ═══
const SECTION_3 = {
  title: P,
  description: P,
  order: 3,
  estimatedTime: 60,
  contentBlocks: [
    { type: "sectionDivider", order: 1, sectionNumber: 3, title: P, subtitle: P },
    { type: "text", order: 2, title: P, textContent: P },
    {
      type: "accordion",
      order: 3,
      title: P,
      accordionItems: Array.from({ length: 16 }, () => ({ title: P, content: P })),
    },
    { type: "text", order: 4, title: P, textContent: P },
    {
      type: "accordion",
      order: 5,
      title: P,
      accordionItems: [
        { title: P, content: P },
        { title: P, content: P },
        { title: P, content: P },
      ],
    },
    { type: "text", order: 6, title: P, textContent: P },
    { type: "text", order: 7, title: P, textContent: P },
    {
      type: "matching",
      order: 8,
      title: P,
      matchingInstructions: P,
      matchingPairs: [
        { term: P, definition: P },
        { term: P, definition: P },
        { term: P, definition: P },
        { term: P, definition: P },
      ],
    },
    { type: "text", order: 9, title: P, textContent: P },
    { type: "text", order: 10, title: P, textContent: P },
    {
      type: "knowledgeCheck",
      order: 11,
      title: P,
      question: P,
      options: [
        { text: P, isCorrect: true },
        { text: P, isCorrect: false },
        { text: P, isCorrect: false },
        { text: P, isCorrect: false },
      ],
      explanation: P,
    },
    {
      type: "knowledgeCheck",
      order: 12,
      title: P,
      question: P,
      options: [
        { text: P, isCorrect: false },
        { text: P, isCorrect: true },
        { text: P, isCorrect: false },
        { text: P, isCorrect: false },
      ],
      explanation: P,
    },
    { type: "reflection", order: 13, title: P, question: P, minLength: 50 },
  ],
};

// ═══ ASSESSMENT (15 PLACEHOLDER QUESTIONS) ═══
const ASSESSMENT_QUESTIONS = Array.from({ length: 15 }, (_, i) => ({
  question: P,
  type: "multipleChoice",
  options: [
    { text: P, isCorrect: i % 4 === 0 },
    { text: P, isCorrect: i % 4 === 1 },
    { text: P, isCorrect: i % 4 === 2 },
    { text: P, isCorrect: i % 4 === 3 },
  ],
  explanation: P,
}));

// ═══ REFERENCES (20 PLACEHOLDER) ═══
const REFERENCES = Array.from({ length: 20 }, () => ({
  formatted: P,
  title: P,
  author: P,
  year: 2026,
  source: P,
  url: P,
}));

// ═══ COURSE DATA ═══
const COURSE_DATA = {
  courseCode: "CR-TMH602",
  title: "TeleMental Health Supervision: Georgia Rule 135-11 Compliance for Supervisors",
  slug: "telemental-health-supervision-georgia-rule-135-11",
  description: P,
  ceHours: 3,
  ceuHours: 3,
  ceCategory: "Ethics",
  accessType: "subscription",
  status: "published",
  isPublished: true,
  instructor: "GA Integrated Therapeutic Perspectives LLC",
  approvingBody: "NBCC",
  approvalNumber: "#7760",
  ceProvider: "NBCC ACEP #7760",
  acepNumber: "7760",
  approvalBody: "NBCC",
  objectives: [P, P, P],
  targetAudience: [P],
  categories: ["Ethics"],
  tags: [P],
  sections: [SECTION_1, SECTION_2, SECTION_3],
  assessment: {
    title: "Final Assessment",
    timeLimit: 30,
    passThreshold: 0.8,
    attemptsAllowed: 3,
    shuffleQuestions: true,
    shuffleOptions: true,
    questions: ASSESSMENT_QUESTIONS,
  },
  references: REFERENCES,
  presenter: {
    name: P,
    credentials: P,
    degree: P,
    licenseNumber: P,
    licenseState: "Georgia",
    qualificationStatement: P,
    category: "category1",
  },
  author: "GA Integrated Therapeutic Perspectives LLC",
  publishedAt: new Date(),
};

// ═══ SEED FUNCTION (idempotent by courseCode) ═══
async function main() {
  console.log("🔌 Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);

  const existing = await InteractiveCourse.findOne({ courseCode: COURSE_DATA.courseCode });

  let doc;
  if (existing) {
    Object.assign(existing, COURSE_DATA);
    doc = await existing.save();
    console.log(`✅ Updated: ${doc.title}`);
  } else {
    doc = new InteractiveCourse(COURSE_DATA);
    await doc.save();
    console.log(`✅ Created: ${doc.title}`);
  }

  console.log("\n📊 Course Statistics:");
  console.log(`   Code: ${doc.courseCode}`);
  console.log(`   Slug: ${doc.slug}`);
  console.log(`   CE Hours: ${doc.ceHours}`);
  console.log(`   Sections: ${doc.sections.length}`);
  console.log(`   Assessment questions: ${doc.assessment.questions.length}`);
  console.log(`   References: ${doc.references.length}`);
  console.log(`   Status: ${doc.status}`);
  console.log("\n⚠️  SHELL ONLY — all content is PLACEHOLDER.");

  await mongoose.disconnect();
  console.log("\n🔌 Disconnected from MongoDB");
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
