/**
 * Batch-set nbccContentAreas on all courses based on title/description keyword matching.
 * Run on Render: cd ~/project/src/server && node src/scripts/batchSetContentAreas.js
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const AREA_KEYWORDS = {
  'Counseling Theory and Practice': ['counseling', 'therapy', 'therapeutic', 'CBT', 'DBT', 'psychotherapy', 'clinical', 'treatment', 'intervention', 'modality', 'narrative', 'ACT', 'motivational'],
  'Human Growth and Development': ['development', 'lifespan', 'aging', 'geriatric', 'adolescent', 'child', 'attachment', 'neuroscience', 'brain'],
  'Social and Cultural Foundations': ['cultural', 'multicultural', 'diversity', 'equity', 'social justice', 'intersectionality', 'race', 'identity', 'bias'],
  'Group Dynamics': ['group', 'family', 'couples', 'systemic', 'relational'],
  'Career Development': ['career', 'vocational', 'workplace', 'employment', 'job'],
  'Assessment': ['assessment', 'diagnosis', 'screening', 'evaluation', 'DSM', 'measure', 'scale', 'testing', 'psychopharmacology'],
  'Research and Program Evaluation': ['research', 'evidence-based', 'outcome', 'evaluation', 'data', 'efficacy'],
  'Counselor Professional Identity and Practice Issues': ['ethics', 'boundary', 'boundaries', 'supervision', 'licensure', 'mandated reporter', 'telemental', 'teletherapy', 'professional', 'confidentiality', 'informed consent', 'legal', 'malpractice', 'documentation'],
  'Wellness and Prevention': ['wellness', 'self-care', 'prevention', 'burnout', 'resilience', 'mindfulness', 'suicide', 'crisis', 'safety', 'trauma', 'addiction', 'substance', 'recovery', 'harm reduction']
};

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const col = db.collection('interactivecourses');
  const courses = await col.find({}, { projection: { title: 1, description: 1, slug: 1, nbccContentAreas: 1 } }).toArray();

  let updated = 0;
  for (const c of courses) {
    const text = ((c.title || '') + ' ' + (c.description || '')).toLowerCase();
    const matched = [];
    for (const [area, keywords] of Object.entries(AREA_KEYWORDS)) {
      if (keywords.some(kw => text.includes(kw.toLowerCase()))) {
        matched.push(area);
      }
    }
    if (matched.length === 0) matched.push('Counseling Theory and Practice'); // fallback

    const existing = c.nbccContentAreas || [];
    if (existing.length === 0 || JSON.stringify(existing.sort()) !== JSON.stringify(matched.sort())) {
      await col.updateOne({ _id: c._id }, { $set: { nbccContentAreas: matched } });
      console.log(`  ${c.slug}: ${matched.join(', ')}`);
      updated++;
    }
  }
  console.log(`\nUpdated ${updated} of ${courses.length} courses`);
  process.exit(0);
}
run().catch(e => { console.error(e); process.exit(1); });
