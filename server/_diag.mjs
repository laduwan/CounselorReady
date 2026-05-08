cat > _diag.mjs << 'EOF'
import mongoose from 'mongoose';
import InteractiveCourse from './src/models/InteractiveCourse.js';

const TITLES = [
  'eleMental Health Supervision',
  'TeleMental Health Supervision',
  'The Final Chapter',
  'Compulsive Sexual Behavior and Intimacy Disorders: Assessment and Treatment',
  'Seasoned and Struggling: Substance Use Disorders in Older Adults',
  'Sex Therapy Foundations: Integrating Sexual Health Into Counseling Practice',
  'Sexual Health Across the Lifespan: Assessment and Evidence-Based Clinical Practice',
  'Sexual Trauma: Assessment, Treatment, and Evidence-Based Interventions',
  'Sexuality, Identity, and Mental Health: Affirming Clinical Practice with LGBTQ+ Clients',
  'Still Standing: Geriatric Suicide Risk Assessment and Safety Planning',
  'The Long Goodbye: Clinical Practice with Dementia, Grief, and Family Systems',
  'Unretiring the Self: Identity, Purpose, and Depression in Later Life'
];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  for (const t of TITLES) {
    const doc = await InteractiveCourse.findOne({ title: t });
    if (!doc) { console.log('NOT FOUND:', t); continue; }
    doc.status = 'published';
    doc.isPublished = true;
    const err = doc.validateSync();
    if (!err) { console.log('OK:', t); continue; }
    console.log('---');
    console.log('FAIL:', t);
    for (const [path, e] of Object.entries(err.errors)) {
      console.log('  ' + path + ': ' + e.message);
    }
  }
  await mongoose.disconnect();
}
main().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
EOF
node _diag.mjs
