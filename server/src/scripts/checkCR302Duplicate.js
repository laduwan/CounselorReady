/**
 * READ-ONLY — no writes. Lists every document sharing courseCode 'CR-302'
 * to confirm the duplicate and identify which _id still has broken
 * assessment questions.
 *
 * Run from ~/project/src/server:
 *   node src/scripts/checkCR302Duplicate.js
 */
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('No MONGODB_URI'); process.exit(1); }

async function main() {
  await mongoose.connect(MONGODB_URI);
  const col = mongoose.connection.db.collection('interactivecourses');

  const docs = await col.find({ courseCode: 'CR-302' }).toArray();
  console.log(`Found ${docs.length} document(s) with courseCode 'CR-302'\n`);

  for (const doc of docs) {
    const qs = doc.assessment?.questions || [];
    const broken = qs.map((q, i) => ({ i, q })).filter(
      ({ q }) => !Array.isArray(q.options) || q.options.length === 0
    );
    console.log('─'.repeat(90));
    console.log(`_id: ${doc._id}`);
    console.log(`title: ${doc.title}`);
    console.log(`slug: ${doc.slug}`);
    console.log(`assessment.questions: ${qs.length} total, ${broken.length} broken`);
    broken.forEach(({ i, q }) => {
      console.log(`  [${i}] "${(q.question || '').slice(0, 70)}..."`);
    });
  }

  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
