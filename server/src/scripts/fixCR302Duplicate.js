/**
 * Fixes the SECOND document sharing courseCode 'CR-302' — "Motivational
 * Interviewing: From Ambivalence to Action" — targeted by its exact _id
 * to avoid the ambiguity that let this get missed the first time (two
 * documents share courseCode 'CR-302'; findOne({courseCode}) only ever
 * grabbed one of them).
 *
 * Only assessment.questions[0] and [1] are touched. Nothing else on this
 * document is modified.
 *
 * DRY RUN by default. Run from ~/project/src/server:
 *   node src/scripts/fixCR302Duplicate.js            (dry run, safe)
 *   node src/scripts/fixCR302Duplicate.js --apply     (writes changes)
 */
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('No MONGODB_URI'); process.exit(1); }

const APPLY = process.argv.includes('--apply');
const TARGET_ID = '699766ce2b436278fb309c9c'; // Motivational Interviewing: From Ambivalence to Action

const REPLACEMENTS = {
  0: { question: "Which of the following best describes Change Talk in Motivational Interviewing?", type: "multipleChoice", options: [{text:"Statements that support maintaining the status quo",isCorrect:false},{text:"Statements that favor movement toward change",isCorrect:true},{text:"Therapist-generated arguments for why change is beneficial",isCorrect:false},{text:"Questions used to assess readiness to change",isCorrect:false}], correctAnswer: 1, explanation: "Change Talk refers to client speech that favors movement toward change, including desire, ability, reasons, need, and commitment language — the DARN-CAT framework." },
  1: { question: "The OARS acronym in Motivational Interviewing stands for:", type: "multipleChoice", options: [{text:"Open questions, Affirmations, Reflections, Summaries",isCorrect:true},{text:"Observations, Assessments, Reflections, Support",isCorrect:false},{text:"Open questions, Advocacy, Resistance, Scaling",isCorrect:false},{text:"Observations, Affirmations, Rapport, Strategies",isCorrect:false}], correctAnswer: 0, explanation: "OARS represents the four core communication skills in MI: Open questions, Affirmations, Reflections, and Summaries." }
};

async function main() {
  await mongoose.connect(MONGODB_URI);
  const col = mongoose.connection.db.collection('interactivecourses');
  const _id = new mongoose.Types.ObjectId(TARGET_ID);

  console.log('═'.repeat(90));
  console.log(APPLY ? 'APPLYING FIX' : 'DRY RUN — no writes (pass --apply to commit)');
  console.log('═'.repeat(90));

  const course = await col.findOne({ _id });
  if (!course) {
    console.log(`NOT FOUND: _id ${TARGET_ID}`);
    await mongoose.disconnect();
    return;
  }

  console.log(`\nTarget: ${course.title} (_id: ${course._id})`);
  const qs = course.assessment?.questions || [];

  for (const [idxStr, replacement] of Object.entries(REPLACEMENTS)) {
    const idx = Number(idxStr);
    const cur = qs[idx];
    const alreadyFixed = cur && cur.question === replacement.question && Array.isArray(cur.options) && cur.options.length > 0;
    if (alreadyFixed) {
      console.log(`  [${idx}] already fixed — skipping`);
      continue;
    }
    console.log(`  [${idx}] old: "${(cur?.question || '').slice(0, 60)}..."`);
    console.log(`  [${idx}] new: "${replacement.question}"`);
    if (APPLY) {
      await col.updateOne(
        { _id },
        { $set: { [`assessment.questions.${idx}`]: replacement } }
      );
    }
  }
  if (APPLY) console.log('\n  -> written');

  console.log('\n' + '═'.repeat(90));
  console.log(APPLY ? 'Done.' : 'Dry run complete. Re-run with --apply to write.');
  console.log('═'.repeat(90));

  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
