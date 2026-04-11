// diagnoseEvals.cjs
// Run: cd ~/project/src/server && node src/scripts/diagnoseEvals.cjs

const mongoose = require('mongoose');
require('dotenv').config();

async function diagnose() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  console.log('Connected.\n');

  const collections = await db.listCollections().toArray();
  const collNames = collections.map(c => c.name).sort();
  const evalColl = collNames.find(n => /eval|feedback|survey|nps/i.test(n));
  console.log('=== ALL COLLECTIONS ===');
  console.log(collNames.join('\n'));
  console.log('\nDedicated eval collection: ' + (evalColl || 'NONE') + '\n');

  if (evalColl) {
    const sample = await db.collection(evalColl).find().sort({ _id: -1 }).limit(3).toArray();
    console.log('=== ' + evalColl + ' SAMPLE ===');
    console.log(JSON.stringify(sample, null, 2));
    console.log('Total: ' + await db.collection(evalColl).countDocuments() + '\n');
  }

  // Check progress collection for embedded evals
  const progressColl = collNames.find(n => /progress/i.test(n));
  if (progressColl) {
    const withEval = await db.collection(progressColl).countDocuments({ evaluation: { $exists: true, $ne: null } });
    const total = await db.collection(progressColl).countDocuments();
    console.log('=== ' + progressColl + ' ===');
    console.log('Total: ' + total + ', With evaluation: ' + withEval);
    if (withEval > 0) {
      const s = await db.collection(progressColl).find({ evaluation: { $exists: true } }).sort({ _id: -1 }).limit(1).toArray();
      console.log(JSON.stringify({ evaluation: s[0].evaluation }, null, 2));
    }
    console.log('');
  }

  // Check interactivecourses for analytics/eval subdocs
  const ic = await db.collection('interactivecourses').findOne({}, { projection: { title: 1, analytics: 1, ratings: 1, evaluations: 1 } });
  console.log('=== interactivecourses analytics fields ===');
  console.log(JSON.stringify(ic, null, 2) + '\n');

  // Check users for eval data
  const u = await db.collection('users').findOne(
    { $or: [{ evaluations: { $exists: true } }, { npsScore: { $exists: true } }, { feedback: { $exists: true } }] },
    { projection: { email: 1, evaluations: 1, npsScore: 1, feedback: 1 } }
  );
  console.log('=== User with eval/nps fields ===');
  console.log(u ? JSON.stringify(u, null, 2) : 'NONE');
  console.log('');

  // Mongoose models loaded
  console.log('=== Mongoose Models ===');
  console.log(mongoose.modelNames().join(', '));
  console.log('');

  console.log('=== SUMMARY ===');
  console.log('Eval collection: ' + (evalColl || 'MISSING'));
  console.log('Unregistered route files (from audit): adminStats.js, adminStatsRoutes.js');
  console.log('If no eval data anywhere → POST /evaluation returns 200 but discards data.');

  await mongoose.disconnect();
}

diagnose().catch(e => { console.error(e); process.exit(1); });

