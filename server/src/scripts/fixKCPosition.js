// fixKCPosition.js — Find & REMOVE Knowledge Checks that appear before text content
// These KCs are unanswerable (no content has been presented yet) and create KC clusters
// Run: node fixKCPosition.js          (dry run — report only)
// Run: node fixKCPosition.js --apply  (actually removes misplaced KCs)
// Paste into Render shell Node REPL or push to GitHub

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
const DRY_RUN = !process.argv.includes('--apply');

// Block types that count as "knowledge check" (should come AFTER text)
const KC_TYPES = ['multipleChoice', 'knowledgeCheck', 'quiz', 'multiSelect'];

async function main() {
  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db;
  const collection = db.collection('interactivecourses');
  const courses = await collection.find({}).toArray();

  console.log('='.repeat(80));
  console.log(`KC POSITION SCAN — ${DRY_RUN ? '🔍 DRY RUN (no changes)' : '⚡ REMOVING MISPLACED KCs'}`);
  console.log(`Courses: ${courses.length} | Date: ${new Date().toISOString().split('T')[0]}`);
  if (DRY_RUN) console.log('Run with --apply to remove misplaced KCs');
  console.log('='.repeat(80) + '\n');

  let totalRemoved = 0;
  let totalCoursesAffected = 0;

  for (const course of courses) {
    const sections = course.sections || [];
    let courseHasIssues = false;
    let courseIssues = [];

    for (let si = 0; si < sections.length; si++) {
      const section = sections[si];
      const blocks = section.contentBlocks || [];
      if (blocks.length < 2) continue;

      // Find first substantial text block index
      let firstTextIdx = -1;
      for (let bi = 0; bi < blocks.length; bi++) {
        if (blocks[bi].type === 'text') {
          const content = blocks[bi].content || blocks[bi].textContent || '';
          const plainText = content.replace(/<[^>]+>/g, '').trim();
          if (plainText.length > 100) {
            firstTextIdx = bi;
            break;
          }
        }
      }

      // Find KCs that appear before the first substantial text
      const misplacedKCs = [];
      for (let bi = 0; bi < blocks.length; bi++) {
        if (KC_TYPES.includes(blocks[bi].type)) {
          if (firstTextIdx === -1 || bi < firstTextIdx) {
            const q = blocks[bi].question || blocks[bi].title || '(no question text)';
            misplacedKCs.push({ blockIndex: bi, question: q.substring(0, 80) });
          }
        }
      }

      if (misplacedKCs.length > 0) {
        courseHasIssues = true;
        totalRemoved += misplacedKCs.length;

        courseIssues.push({
          sectionIndex: si,
          sectionTitle: section.title || `Section ${si + 1}`,
          misplacedCount: misplacedKCs.length,
          firstTextAt: firstTextIdx,
          kcs: misplacedKCs
        });

        if (!DRY_RUN) {
          // Remove misplaced KCs (reverse order to preserve indices)
          const indicesToRemove = misplacedKCs.map(k => k.blockIndex).sort((a, b) => b - a);
          for (const idx of indicesToRemove) {
            blocks.splice(idx, 1);
          }
          // Re-number order fields
          blocks.forEach((b, i) => { b.order = i + 1; });
        }
      }
    }

    if (courseHasIssues) {
      totalCoursesAffected++;
      console.log(`\n❌ ${course.title || course.slug}`);
      console.log(`   Code: ${course.courseCode || 'N/A'} | CE: ${course.ceHours || '?'}`);
      courseIssues.forEach(issue => {
        console.log(`   Section ${issue.sectionIndex}: "${issue.sectionTitle}" — ${issue.misplacedCount} KC(s) before first text at position ${issue.firstTextAt}`);
        issue.kcs.forEach(kc => {
          console.log(`     [${kc.blockIndex}] "${kc.question}..."`);
        });
      });

      if (!DRY_RUN) {
        await collection.updateOne(
          { _id: course._id },
          { $set: { sections: course.sections } }
        );
        console.log(`   ✅ REMOVED ${courseIssues.reduce((s, i) => s + i.misplacedCount, 0)} misplaced KC(s)`);
      }
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('SUMMARY');
  console.log(`  Courses scanned:  ${courses.length}`);
  console.log(`  Courses affected: ${totalCoursesAffected}`);
  console.log(`  KCs to remove:    ${totalRemoved}`);
  if (DRY_RUN && totalRemoved > 0) console.log(`\n  Run with --apply to remove these.`);
  console.log('='.repeat(80));

  await mongoose.disconnect();
  console.log('\nDone.');
}

main().catch(err => { console.error('Error:', err.message); process.exit(1); });
