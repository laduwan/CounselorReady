/**
 * migrateToArchitectureA.js
 * 
 * Migrates ALL courses from the 'courses' collection (Architecture B: modules/lessons)
 * into the 'interactivecourses' collection (Architecture A: sections/contentBlocks).
 * 
 * Run: node migrateToArchitectureA.js
 * 
 * Safe to run multiple times — uses upsert by slug.
 * Does NOT delete anything from the 'courses' collection.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);
console.log('✅ Connected to MongoDB\n');

const db = mongoose.connection.db;
const coursesCol = db.collection('courses');
const interactiveCol = db.collection('interactivecourses');

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function normalizeOptions(options = []) {
  return options.map(o => ({
    text: o.text || o.label || '',
    isCorrect: o.isCorrect || o.correct || false
  }));
}

function normalizeQuestion(q) {
  return {
    question: q.question || q.text || '',
    type: 'multipleChoice',
    options: normalizeOptions(q.options || q.choices || []),
    explanation: q.explanation || q.rationale || ''
  };
}

/**
 * Converts a modules/lessons course into sections/contentBlocks format.
 * Handles three sub-cases:
 *   A) module.contentBlocks already exists (DBT, Narrative, etc.) — rename only
 *   B) module.lessons[] exists — convert each lesson into contentBlocks
 *   C) module has neither — wrap module content into a text block
 */
function convertModulesToSections(modules = []) {
  return modules.map((mod, idx) => {
    const sectionBase = {
      title: mod.title || `Module ${idx + 1}`,
      description: mod.description || '',
      order: mod.order || idx + 1,
      estimatedTime: mod.estimatedTime || mod.duration || 30,
      hasQuiz: false,
      quizQuestions: [],
      quizPassThreshold: 0.8
    };

    // Case A: contentBlocks already present — use as-is
    if (mod.contentBlocks && mod.contentBlocks.length > 0) {
      const contentBlocks = mod.contentBlocks.map((b, bi) => ({
        ...b,
        order: b.order !== undefined ? b.order : bi
      }));

      // Extract any inline multipleChoice blocks as section quiz questions too
      const quizBlocks = contentBlocks.filter(b =>
        b.type === 'multipleChoice' || b.type === 'multiSelect'
      );

      return {
        ...sectionBase,
        contentBlocks,
        hasQuiz: quizBlocks.length > 0,
        quizQuestions: quizBlocks.map(b => normalizeQuestion(b)),
        quizPassThreshold: 0.8
      };
    }

    // Case B: lessons array — build contentBlocks from each lesson
    if (mod.lessons && mod.lessons.length > 0) {
      const contentBlocks = [];
      const quizQs = [];
      let blockOrder = 0;

      // Section divider first
      contentBlocks.push({
        type: 'sectionDivider',
        order: blockOrder++,
        sectionNumber: mod.order || idx + 1,
        title: mod.title || `Module ${idx + 1}`,
        subtitle: mod.description || ''
      });

      mod.lessons.forEach((lesson) => {
        // Main text content
        if (lesson.content && lesson.content.trim()) {
          contentBlocks.push({
            type: 'text',
            order: blockOrder++,
            textContent: lesson.content
          });
        }

        // Lesson-level quiz questions
        const lessonQuestions = lesson.quizQuestions || lesson.knowledgeCheck || [];
        lessonQuestions.forEach(q => {
          const normalized = normalizeQuestion(q);
          contentBlocks.push({
            type: 'multipleChoice',
            order: blockOrder++,
            question: normalized.question,
            options: normalized.options,
            explanation: normalized.explanation
          });
          quizQs.push(normalized);
        });

        // Reflection prompts
        if (lesson.reflectionPrompt || lesson.reflection) {
          contentBlocks.push({
            type: 'reflection',
            order: blockOrder++,
            question: lesson.reflectionPrompt || lesson.reflection || 'Reflect on what you have learned.',
            minLength: 100
          });
        }

        // Accordions
        if (lesson.accordionItems && lesson.accordionItems.length > 0) {
          contentBlocks.push({
            type: 'accordion',
            order: blockOrder++,
            accordionItems: lesson.accordionItems
          });
        }
      });

      return {
        ...sectionBase,
        contentBlocks,
        hasQuiz: quizQs.length > 0,
        quizQuestions: quizQs,
        quizPassThreshold: 0.8
      };
    }

    // Case C: fallback — wrap whatever content exists in a text block
    const fallbackContent = mod.content || mod.description || '';
    return {
      ...sectionBase,
      contentBlocks: [
        {
          type: 'sectionDivider',
          order: 0,
          sectionNumber: mod.order || idx + 1,
          title: mod.title || `Module ${idx + 1}`,
          subtitle: ''
        },
        ...(fallbackContent ? [{
          type: 'text',
          order: 1,
          textContent: fallbackContent
        }] : [])
      ]
    };
  });
}

function normalizeAssessment(raw = {}) {
  const questions = (raw.questions || []).map(normalizeQuestion);
  return {
    title: raw.title || 'Final Assessment',
    description: raw.description || 'You must score 80% or higher to receive CE credit.',
    timeLimit: raw.timeLimit || 30,
    passThreshold: raw.passThreshold || raw.passingScore || 0.8,
    attemptsAllowed: raw.attemptsAllowed || 3,
    shuffleQuestions: raw.shuffleQuestions !== false,
    shuffleOptions: raw.shuffleOptions !== false,
    questions
  };
}

function buildInteractiveCourse(course) {
  const sections = convertModulesToSections(course.modules || []);

  // Calculate totals
  const totalEstimatedTime = sections.reduce((s, sec) => s + (sec.estimatedTime || 15), 0);
  const totalContentBlocks = sections.reduce((s, sec) => s + (sec.contentBlocks?.length || 0), 0);
  const totalQuizQuestions = sections.reduce((s, sec) => s + (sec.quizQuestions?.length || 0), 0)
    + (course.assessment?.questions?.length || 0);

  return {
    // Identity
    title: course.title,
    slug: course.slug,
    description: course.description || course.shortDescription || '',
    thumbnail: course.thumbnail || '',

    // CE info
    ceHours: course.ceHours || course.credits || 1,
    ceProvider: course.ceProvider || `NBCC ACEP #${course.nbccProviderNumber || '7760'} - CounselorReady`,
    acepNumber: course.acepNumber || course.nbccProviderNumber || '7760',

    // Learning
    objectives: course.learningObjectives || course.objectives || [],
    targetAudience: course.targetAudience || [
      'Licensed Professional Counselors',
      'Licensed Clinical Social Workers',
      'Licensed Marriage and Family Therapists',
      'Psychologists'
    ],
    categories: course.categories || [course.category || course.contentArea || 'Clinical Practice'],
    tags: course.tags || [],

    // Content
    sections,
    assessment: normalizeAssessment(course.assessment || {}),

    // Presenter
    presenter: course.presenter || course.instructorCredentials ? {
      name: (course.presenter?.name || course.instructorCredentials?.name || 'Kejuiana Johnson, MA, LPC, CPCS, BC-TMH'),
      credentials: (course.presenter?.credentials || course.instructorCredentials?.credentials || 'Licensed Professional Counselor'),
      qualificationStatement: course.presenter?.qualificationStatement || ''
    } : undefined,

    // References
    references: (course.references || course.bibliography || []).map(r =>
      typeof r === 'string' ? r : (r.citation || r.text || JSON.stringify(r))
    ),

    // Metadata
    author: course.author || 'CounselorReady',
    status: course.status === 'published' || course.isPublished ? 'published' : 'draft',
    publishedAt: course.publishedAt || (course.isPublished ? new Date() : undefined),
    updatedAt: new Date(),

    // Calculated
    totalEstimatedTime,
    totalContentBlocks,
    totalQuizQuestions
  };
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

const allCourses = await coursesCol.find({}).toArray();
console.log(`Found ${allCourses.length} courses in 'courses' collection\n`);

let migrated = 0;
let skipped = 0;
let errors = [];

for (const course of allCourses) {
  if (!course.slug) {
    console.log(`  ⚠️  SKIP (no slug): ${course.title}`);
    skipped++;
    continue;
  }

  // Check if already in interactivecourses AND already has sections/contentBlocks
  const existing = await interactiveCol.findOne({ slug: course.slug });
  if (existing && existing.sections && existing.sections.length > 0) {
    const hasCB = existing.sections.some(s => s.contentBlocks && s.contentBlocks.length > 0);
    if (hasCB) {
      console.log(`  ✓  SKIP (already migrated): ${course.title}`);
      skipped++;
      continue;
    }
  }

  try {
    const converted = buildInteractiveCourse(course);

    await interactiveCol.findOneAndUpdate(
      { slug: course.slug },
      { $set: converted },
      { upsert: true }
    );

    const sectionCount = converted.sections.length;
    const blockCount = converted.totalContentBlocks;
    const qCount = converted.assessment.questions.length;
    console.log(`  ✅ MIGRATED: ${course.title}`);
    console.log(`     Sections: ${sectionCount} | Blocks: ${blockCount} | Assessment Qs: ${qCount}`);
    migrated++;
  } catch (err) {
    console.error(`  ❌ ERROR: ${course.title} — ${err.message}`);
    errors.push({ title: course.title, slug: course.slug, error: err.message });
  }
}

console.log('\n══════════════════════════════════════════');
console.log(`Migration complete`);
console.log(`  Migrated : ${migrated}`);
console.log(`  Skipped  : ${skipped}`);
console.log(`  Errors   : ${errors.length}`);
if (errors.length > 0) {
  console.log('\nErrors:');
  errors.forEach(e => console.log(`  - ${e.slug}: ${e.error}`));
}
console.log('══════════════════════════════════════════\n');

await mongoose.connection.close();
