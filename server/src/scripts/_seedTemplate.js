/**
 * _seedTemplate.js — CANONICAL seed pattern for CounselorReady courses
 * GAITP LLC · NBCC ACEP #7760
 *
 * Copy this to seed a new course. It fixes the two bugs that have caused
 * "meets word count but fails" and "not sellable":
 *
 *   1. Inserts THROUGH THE MONGOOSE MODEL via doc.save() — this fires the
 *      pre-save hook, so `wordCount` is computed and stored automatically.
 *      (The old raw db.collection().insertOne bypasses the hook and lands the
 *      course with NO wordCount → dashboard shows 0 → every validator fails it.)
 *
 *   2. save() runs schema validation, so an invalid `accessType` ('paid'),
 *      bad enum, or wrong-shaped field is REJECTED at seed time instead of
 *      silently stored and breaking later.
 *
 * BEFORE running this, audit it (no DB connection needed):
 *     node src/scripts/auditCourse.js --file src/scripts/<thisfile>.js
 * Only run the seed once it PASSES.
 *
 * Run from ~/project/src/server :
 *     node src/scripts/<thisfile>.js
 *
 * ── CANONICAL BLOCK SHAPES (the Gold Standard spec is WRONG on several; these
 *    match the live InteractiveCourse model and the viewer) ────────────────────
 *   multipleChoice : { type, question, options:[{text,isCorrect}], correctAnswer:Number, explanation }
 *                    NEVER flat string options — they cause Mongoose char-explosion.
 *   flashcardDeck  : { type:'flashcardDeck', flashcards:[{id,front,back}] }   (NOT 'cards')
 *   matching       : { type:'matching', matchingInstructions, matchingPairs:[{term,definition}] }  (NOT 'pairs')
 *   scenarioTree   : { type:'scenarioTree', scenarioTitle, startNode, nodes:{ id:{text,choices:[...]} } }  (NOT scenario.choices)
 *   cardSort       : { type:'cardSort', categories:[String], cards:[{id,text,correctCategory}] }   (NOT 'items')
 *   accordion      : { type:'accordion', accordionItems:[{title,content}] }
 *   reflection     : { type:'reflection', question }
 *   keyTakeaway    : { type:'keyTakeaway', items:[String] }
 *   No knowledgeCheck wrappers — expand to individual multipleChoice blocks.
 *   No quiz blocks in sections — the exam lives in top-level `assessment`.
 *   References live ONLY in the conclusion block + the course.references[] array.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { pathToFileURL } from 'url';
import { Course } from '../models/InteractiveCourse.js';

dotenv.config();

export const COURSE = {
  title: 'REPLACE — Course Title',
  slug: 'replace-course-slug',
  courseCode: 'CR-XXX-000',
  subtitle: 'REPLACE — one-line subtitle',
  description: 'REPLACE — catalog description.',

  // CE + accreditation
  ceHours: 2, ceuHours: 2, credits: 2, ceuEligible: true,
  level: 'Intermediate',
  approvingBody: 'NBCC', approvalNumber: '7760', acepNumber: '7760',
  instructor: 'GA Integrated Therapeutic Perspectives LLC',

  // SELLABILITY — accessType MUST be one of: free | subscription | purchase
  //   'purchase' → set a positive price (à-la-carte sale)
  //   'subscription' → no price needed (sold via plan)
  accessType: 'purchase', price: 39.99, pricingTier: 'standard',

  // Start as draft; flip to 'published' only after auditCourse.js passes.
  status: 'draft', isPublished: false, isActive: true,
  passingScore: 80, maxAttempts: 3,
  settings: { passingScore: 80, certificateEnabled: true, requireEvaluation: true, requireAttestation: true },

  objectives: [
    'REPLACE — measurable learning objective 1',
    'REPLACE — measurable learning objective 2',
  ],
  targetAudience: ['Licensed mental health professionals (LPCs, LCSWs, LMFTs, NCCs, psychiatric NPs).'],

  sections: [
    {
      title: 'REPLACE — Section 1 Title',
      order: 1,
      contentBlocks: [
        { type: 'sectionDivider', sectionNumber: '1', title: 'REPLACE — Section 1 Title', subtitle: 'REPLACE', order: 1 },

        { type: 'text', order: 2, content: `<h2>REPLACE — heading</h2><p>REPLACE — prose. Count everything from intro through the final congratulations screen. ACEP floor is 6,000 words per CE hour.</p>` },

        { type: 'accordion', order: 3, accordionItems: [
          { title: 'REPLACE — item title', content: '<p>REPLACE — item body.</p>' },
        ]},

        { type: 'flashcardDeck', order: 4, flashcards: [
          { id: 'f1', front: 'REPLACE — front', back: 'REPLACE — back' },
        ]},

        { type: 'matching', order: 5, matchingInstructions: 'REPLACE — instructions', matchingPairs: [
          { term: 'REPLACE — term', definition: 'REPLACE — definition' },
        ]},

        { type: 'multipleChoice', order: 6,
          question: 'REPLACE — question?',
          options: [
            { text: 'REPLACE — distractor', isCorrect: false },
            { text: 'REPLACE — correct',   isCorrect: true  },
            { text: 'REPLACE — distractor', isCorrect: false },
            { text: 'REPLACE — distractor', isCorrect: false },
          ],
          correctAnswer: 1,
          explanation: 'REPLACE — why the correct answer is correct.',
        },

        { type: 'reflection', order: 7, question: 'REPLACE — open reflection prompt.' },
      ],
    },
    // … add sections until auditCourse.js reports word count >= ceHours * 6000 …
  ],

  // Final exam — top-level, NOT inside sections.
  assessment: {
    passingScore: 80,
    questions: [
      { question: 'REPLACE — exam question?',
        options: [
          { text: 'REPLACE', isCorrect: false },
          { text: 'REPLACE', isCorrect: true  },
          { text: 'REPLACE', isCorrect: false },
          { text: 'REPLACE', isCorrect: false },
        ],
        correctAnswer: 1,
        explanation: 'REPLACE — rationale.',
      },
    ],
  },

  // References live here and in the conclusion block only (APA 7th). Not counted.
  references: [
    'REPLACE — Author, A. A. (Year). Title. Publisher.',
  ],
};

export default COURSE;

// ── model-based upsert: fires pre-save hook (wordCount) + runs validation ─────
async function seed() {
  if (!process.env.MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }
  await mongoose.connect(process.env.MONGODB_URI);

  let doc = await Course.findOne({ slug: COURSE.slug });
  if (doc) {
    doc.set(COURSE);
    console.log('Updating existing:', COURSE.slug);
  } else {
    doc = new Course(COURSE);
    console.log('Inserting new:', COURSE.slug);
  }
  await doc.save();   // ← pre-save hook computes wordCount; validation enforces enums/shapes

  // ── DB READ-BACK: verify the write actually landed with hook-computed fields.
  // "validation passed" and "the write mechanism works" are NOT the same thing —
  // this is the only check that proves the document in MongoDB has what the
  // viewer and admin dashboard need. Any seed that skips this is unverified.
  const saved = await Course.findOne({ slug: COURSE.slug }).lean();
  if (!saved) {
    console.error('❌ READ-BACK FAILED — course not found in DB after save().');
    await mongoose.disconnect();
    process.exit(1);
  }
  if (!saved.wordCount || !saved.totalContentBlocks) {
    console.error(`❌ READ-BACK FAILED — hook fields missing on the SAVED document: wordCount=${saved.wordCount}, totalContentBlocks=${saved.totalContentBlocks}`);
    console.error('   The pre-save hook did not run. The write path must be doc.save() on the real model — never a raw collection write.');
    await mongoose.disconnect();
    process.exit(1);
  }
  console.log(`✅ DB verified ${saved.courseCode || saved.slug} — wordCount=${saved.wordCount}, totalContentBlocks=${saved.totalContentBlocks}, sections=${(saved.sections || []).length} (word target ${(saved.ceHours || 0) * 6000})`);
  if (saved.wordCount < (saved.ceHours || 0) * 6000) {
    console.warn('⚠ Saved but UNDER word target — left as draft. Add content and re-run.');
  }
  await mongoose.disconnect();
}

// Only seed when executed directly — lets auditCourse.js import COURSE safely.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  seed().catch(e => { console.error('SEED ERROR:', e.message); process.exit(1); });
}
