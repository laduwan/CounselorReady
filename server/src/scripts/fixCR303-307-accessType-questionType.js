/**
 * fixCR303-307-accessType-questionType.js
 * ─────────────────────────────────────────
 * Fixes CR-303 through CR-307 in interactivecourses:
 *   1. accessType: "paid" → "subscription"
 *   2. assessment.questions[*].type: "multiple_choice" → "multipleChoice"
 *
 * Run from Render shell (~/project/src/server):
 *   node src/scripts/fixCR303-307-accessType-questionType.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }
await mongoose.connect(process.env.MONGODB_URI);

const col = mongoose.connection.db.collection('interactivecourses');

const SLUGS = [
  'sexual-health-across-the-lifespan',
  'sexuality-identity-mental-health-lgbtq',
  'sexual-trauma-assessment-treatment',
  'sex-therapy-foundations',
  'compulsive-sexual-behavior-intimacy-disorders',
];

let fixed = 0;

for (const slug of SLUGS) {
  const doc = await col.findOne({ slug });
  if (!doc) { console.log(`✗ NOT FOUND: ${slug}`); continue; }

  const qs = (doc.assessment?.questions || []).map(q => ({
    ...q,
    type: q.type === 'multiple_choice' ? 'multipleChoice' : q.type,
  }));

  await col.updateOne({ _id: doc._id }, {
    $set: {
      accessType: 'subscription',
      'assessment.questions': qs,
    }
  });

  console.log(`✓ ${slug}`);
  fixed++;
}

console.log(`\n${fixed}/${SLUGS.length} patched`);

// Quick verify
console.log('\n── Verify ──');
for (const slug of SLUGS) {
  const d = await col.findOne({ slug }, { projection: { accessType: 1, 'assessment.questions.type': 1 } });
  const types = [...new Set(d.assessment.questions.map(q => q.type))];
  const ok = d.accessType === 'subscription' && types.every(t => t === 'multipleChoice');
  console.log(`${ok ? '✓' : '✗'} ${slug} | accessType: ${d.accessType} | qtypes: ${types.join(',')}`);
}

await mongoose.disconnect();
