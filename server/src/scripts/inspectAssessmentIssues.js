/**
 * READ-ONLY — no writes. Dumps raw assessment.questions[] for the specific
 * courses flagged by auditAssessmentData.js, plus the inline isExam block
 * for CR-105, so we can see exactly what's malformed before writing a fix.
 *
 * Run from ~/project/src/server:
 *   node src/scripts/inspectAssessmentIssues.js
 */
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('No MONGODB_URI'); process.exit(1); }

const TARGET_CODES = ['CR-102', 'CR-301', 'CR-302', 'CR-105'];

async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;
  const courses = await db.collection('interactivecourses')
    .find({ courseCode: { $in: TARGET_CODES } }).toArray();

  for (const course of courses) {
    console.log('\n' + '═'.repeat(100));
    console.log(`${course.courseCode} — ${course.title}  (_id: ${course._id})`);
    console.log('═'.repeat(100));

    const qs = course.assessment?.questions || [];
    console.log(`Top-level assessment.questions: ${qs.length}`);
    qs.forEach((q, i) => {
      const hasOptions = Array.isArray(q.options) && q.options.length > 0;
      if (!hasOptions) {
        console.log(`\n  [${i}] MISSING/EMPTY OPTIONS — full raw object:`);
        console.log('  ' + JSON.stringify(q, null, 2).split('\n').join('\n  '));
      }
    });

    if (course.courseCode === 'CR-105') {
      console.log(`\n--- Inline isExam block(s) for CR-105 ---`);
      for (const section of (course.sections || [])) {
        for (const block of (section.contentBlocks || [])) {
          if (block.isExam) {
            console.log(`\n  Section: "${section.title}" | block.type: ${block.type}`);
            console.log('  ' + JSON.stringify(block, null, 2).split('\n').join('\n  '));
          }
        }
      }
    }
  }

  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
