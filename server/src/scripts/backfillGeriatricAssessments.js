import mongoose from 'mongoose';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
dotenv.config();

const client = new Anthropic();

const COURSES = [
  { slug: 'unretiring-the-self-identity-purpose-depression-older-adults', ceHours: 3 },
  { slug: 'the-long-goodbye-dementia-grief-family-systems', ceHours: 3 },
  { slug: 'still-standing-geriatric-suicide-risk-assessment-safety-planning', ceHours: 2 },
  { slug: 'seasoned-and-struggling-substance-use-disorders-older-adults', ceHours: 2 },
  { slug: 'the-final-chapter-end-of-life-counseling-death-anxiety-meaning-making', ceHours: 3 },
];

async function generateQuestions(course) {
  const prompt = `You are writing a final exam for a continuing education course for licensed mental health professionals (LPCs, LCSWs, LMFTs, NCCs).

Course title: "${course.title}"
CE Hours: ${course.ceHours}
Course description: ${course.description || 'A clinical CE course on the topic indicated by the title.'}

Generate exactly ${course.ceHours >= 3 ? 15 : 15} multiple choice assessment questions for this course.

Requirements:
- Questions must test clinical application, not just recall
- 4 answer options each (A, B, C, D)
- One correct answer per question
- No single option should be correct more than 40% of the time across all questions
- Answer distribution should be varied across A, B, C, D
- Questions should reflect graduate-level clinical content

Respond ONLY with a JSON array, no markdown, no explanation:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Brief explanation of why this is correct."
  }
]

correctAnswer is the zero-based index of the correct option.`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }]
  });

  const text = response.content[0].text.trim();
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const db = mongoose.connection.db;

  for (const c of COURSES) {
    console.log(`\nProcessing: ${c.slug}`);

    const course = await db.collection('interactivecourses').findOne(
      { slug: c.slug },
      { projection: { title: 1, slug: 1, ceHours: 1, description: 1 } }
    );

    if (!course) {
      console.log(`  SKIP — not found in DB`);
      continue;
    }

    console.log(`  Generating questions for: ${course.title}`);

    try {
      const questions = await generateQuestions(course);
      console.log(`  Generated ${questions.length} questions`);

      await db.collection('interactivecourses').updateOne(
        { _id: course._id },
        {
          $set: {
            assessment: {
              questions,
              passingScore: 80,
              passThreshold: 0.8,
              attemptsAllowed: 3,
              maxAttempts: 3,
              timeLimit: null,
              shuffleQuestions: false
            }
          }
        }
      );
      console.log(`  ✅ Saved to DB`);
    } catch (err) {
      console.error(`  ❌ Error: ${err.message}`);
    }

    // Rate limit buffer
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log('\nDone.');
  process.exit();
}

run().catch(err => { console.error(err); process.exit(1); });
