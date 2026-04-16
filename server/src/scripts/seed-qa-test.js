// ============================================================================
// seed-qa-test.js
// Seeds the QA smoke test course with a 60-minute TTL auto-delete.
// Run from server/: node src/scripts/seed-qa-test.js
// ============================================================================

import mongoose from 'mongoose';
// Run validator first: node src/scripts/validateSeed.js src/scripts/seed-qa-test.js
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Course } from '../models/InteractiveCourse.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MONGODB_URI = process.env.MONGODB_URI || 'your-mongodb-uri-here';

async function seedQATest() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // ── Step 1: Ensure TTL index exists on expiresAt ──
    const collection = mongoose.connection.collection('interactivecourses');

    try {
      await collection.createIndex(
        { expiresAt: 1 },
        { expireAfterSeconds: 0, sparse: true }
      );
      console.log('🔧 TTL index on expiresAt confirmed (sparse, auto-delete)\n');
    } catch (err) {
      if (err.code === 85) {
        console.log('🔧 TTL index already exists\n');
      } else {
        throw err;
      }
    }

    // ── Step 2: Remove any previous QA test course ──
    const deleted = await Course.deleteMany({ slug: 'qa-smoke-test' });
    if (deleted.deletedCount > 0) {
      console.log(`🗑️  Cleaned up ${deleted.deletedCount} previous QA test course(s)`);
    }

    // ── Step 3: Load and seed the test course ──
    const courseData = JSON.parse(
      readFileSync(join(__dirname, 'qa-test-course.json'), 'utf-8')
    );

    // Set the 60-minute expiration from NOW
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    courseData.expiresAt = expiresAt;

    // Remove the _qa metadata (not a schema field)
    delete courseData._qa;

    const course = await Course.create(courseData);

    console.log(`\n📚 QA Test Course Seeded Successfully`);
    console.log(`   Title:      ${course.title}`);
    console.log(`   Slug:       ${course.slug}`);
    console.log(`   ID:         ${course._id}`);
    console.log(`   Sections:   ${course.sections.length}`);
    console.log(`   Assessment: ${course.assessment.questions.length} questions`);
    console.log(`   Expires At: ${expiresAt.toLocaleString()}`);
    console.log(`   TTL:        60 minutes from now`);
    console.log(`\n── Analytics Checkpoints ──`);
    console.log(`   ✓ Enrollment event     → fires on course load`);
    console.log(`   ✓ Section progress      → fires on each section advance`);
    console.log(`   ✓ Block interactions    → fires on accordion/matching/flashcard/etc.`);
    console.log(`   ✓ Timer events          → fires on CE timer start/complete`);
    console.log(`   ✓ Assessment attempts   → fires on each quiz submission`);
    console.log(`   ✓ Certificate generation → fires on passing assessment`);
    console.log(`\n⏰ Course will auto-delete at ${expiresAt.toLocaleString()}`);
    console.log(`   MongoDB TTL index handles cleanup — no cron needed.\n`);

    // ── Step 4: Verify block types are queryable ──
    const verify = await Course.findOne({ slug: 'qa-smoke-test' }).lean();
    const blockTypes = new Set();
    verify.sections.forEach(s =>
      s.contentBlocks.forEach(b => blockTypes.add(b.type))
    );
    console.log(`── Block Types in Test Course (${blockTypes.size}) ──`);
    console.log(`   ${[...blockTypes].sort().join(', ')}\n`);

    const assessTypes = new Set();
    verify.assessment.questions.forEach(q => assessTypes.add(q.type));
    console.log(`── Assessment Question Types (${assessTypes.size}) ──`);
    console.log(`   ${[...assessTypes].join(', ')}\n`);

  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    if (err.errors) {
      Object.entries(err.errors).forEach(([field, e]) => {
        console.error(`   → ${field}: ${e.message}`);
      });
    }
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedQATest();
