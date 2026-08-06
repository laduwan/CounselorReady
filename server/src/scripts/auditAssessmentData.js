/**
 * READ-ONLY audit — no writes. Reports the actual state of course.assessment
 * vs any in-section isExam blocks, using the native driver (bypasses Mongoose
 * casting/strict-mode so we see exactly what's persisted).
 *
 * Run from ~/project/src/server:
 *   node src/scripts/auditAssessmentData.js
 */
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('No MONGODB_URI'); process.exit(1); }

const VALID_TYPES = ['multipleChoice', 'multiSelect', 'trueFalse'];

async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;
  const courses = await db.collection('interactivecourses').find({}).toArray();

  console.log('═'.repeat(100));
  console.log('ASSESSMENT DATA AUDIT — ' + new Date().toISOString().split('T')[0]);
  console.log(`Courses scanned: ${courses.length}`);
  console.log('═'.repeat(100));

  const buckets = { ok: [], needsMigration: [], mismatch: [], none: [], invalidTypes: [] };

  for (const course of courses) {
    const code = course.courseCode || course.slug || course.title || String(course._id);
    const topQs = course.assessment?.questions || [];
    const topLen = topQs.length;
    const badTypes = topQs.filter(q => q.type && !VALID_TYPES.includes(q.type)).map(q => q.type);
    const missingOptions = topQs.filter(q => !Array.isArray(q.options) || q.options.length === 0).length;

    // Find inline isExam blocks (any section, any block type)
    let inlineExamBlocks = [];
    for (const section of (course.sections || [])) {
      for (const block of (section.contentBlocks || [])) {
        if (block.isExam) {
          inlineExamBlocks.push({
            sectionTitle: section.title,
            blockType: block.type,
            questionCount: Array.isArray(block.questions) ? block.questions.length : 0,
            hasSingleQuestion: !!block.question,
            passingScore: block.passingScore,
            maxAttempts: block.maxAttempts
          });
        }
      }
    }
    const inlineQCount = inlineExamBlocks.reduce((s, b) => s + b.questionCount, 0);

    const row = {
      code, title: course.title, id: String(course._id),
      topLen, badTypes, missingOptions,
      inlineExamBlocks: inlineExamBlocks.length,
      inlineQCount,
      inlineDetail: inlineExamBlocks
    };

    if (badTypes.length > 0 || missingOptions > 0) {
      buckets.invalidTypes.push(row);
    } else if (topLen >= 15 && inlineExamBlocks.length === 0) {
      buckets.ok.push(row);
    } else if (topLen < 15 && inlineQCount > 0) {
      buckets.needsMigration.push(row);
    } else if (topLen > 0 && inlineExamBlocks.length > 0) {
      buckets.mismatch.push(row);
    } else if (topLen === 0 && inlineExamBlocks.length === 0) {
      buckets.none.push(row);
    } else {
      buckets.ok.push(row);
    }
  }

  const printRow = r =>
    console.log(`  ${r.code.padEnd(45)} top=${String(r.topLen).padStart(2)} inline=${String(r.inlineQCount).padStart(2)} (${r.inlineExamBlocks} block${r.inlineExamBlocks===1?'':'s'})` +
      (r.badTypes.length ? `  BAD_TYPES=[${r.badTypes.join(',')}]` : '') +
      (r.missingOptions ? `  MISSING_OPTIONS=${r.missingOptions}` : ''));

  console.log(`\n--- OK (${buckets.ok.length}) — top-level assessment already has 15+ valid questions, no inline exam block left behind ---`);
  buckets.ok.forEach(printRow);

  console.log(`\n--- NEEDS_MIGRATION (${buckets.needsMigration.length}) — top-level assessment empty/short, inline isExam block has the real questions ---`);
  buckets.needsMigration.forEach(printRow);

  console.log(`\n--- INVALID_TYPES / MISSING_OPTIONS (${buckets.invalidTypes.length}) — top-level assessment exists but has schema-invalid question data ---`);
  buckets.invalidTypes.forEach(printRow);

  console.log(`\n--- MISMATCH (${buckets.mismatch.length}) — BOTH top-level assessment AND an inline isExam block exist (need manual look) ---`);
  buckets.mismatch.forEach(printRow);

  console.log(`\n--- NONE (${buckets.none.length}) — no assessment questions anywhere ---`);
  buckets.none.forEach(printRow);

  console.log('\n' + '═'.repeat(100));
  console.log(`SUMMARY: ok=${buckets.ok.length} needsMigration=${buckets.needsMigration.length} invalidTypes=${buckets.invalidTypes.length} mismatch=${buckets.mismatch.length} none=${buckets.none.length}`);
  console.log('═'.repeat(100));

  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
