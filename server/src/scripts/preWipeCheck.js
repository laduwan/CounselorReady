/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('No MONGODB_URI'); process.exit(1); }

async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;

  console.log('\n' + '='.repeat(80));
  console.log('PRE-WIPE SAFETY CHECK');
  console.log('='.repeat(80) + '\n');

  // Check user progress records
  const collections = await db.listCollections().toArray();
  const collNames = collections.map(c => c.name);
  console.log('All collections:', collNames.join(', '));

  // Check progress
  for (const name of ['interactivecourseprogresses', 'userprogresses', 'courseprogresses', 'usercourseprogresses']) {
    if (collNames.includes(name)) {
      const count = await db.collection(name).countDocuments();
      console.log(`\n${name}: ${count} records`);
      if (count > 0) {
        const sample = await db.collection(name).find({}).limit(3).toArray();
        sample.forEach(s => {
          console.log(`  User: ${s.userId}, Course: ${s.courseId}, Status: ${s.status}, Progress: ${s.overallProgress}%`);
        });
      }
    }
  }

  // Check certificates
  if (collNames.includes('certificates')) {
    const certCount = await db.collection('certificates').countDocuments();
    console.log(`\ncertificates: ${certCount} records`);
  }

  // Count courses in both collections
  const icCount = await db.collection('interactivecourses').countDocuments();
  const legCount = await db.collection('courses').countDocuments();
  console.log(`\ninteractivecourses: ${icCount}`);
  console.log(`legacy courses: ${legCount}`);

  // Map seed scripts to courses
  console.log('\n' + '='.repeat(80));
  console.log('SEED SCRIPT → COURSE MAPPING');
  console.log('='.repeat(80) + '\n');

  const allIC = await db.collection('interactivecourses').find({}, { projection: { slug: 1, title: 1, status: 1 } }).toArray();
  
  // Known seed script mappings
  const scriptMap = {
    'seedInteractiveCourses.js': ['trauma-informed-care', 'neurobiology-of-trauma'],
    'seedDBT6hr_clean.js': ['dbt-skills-training-comprehensive'],
    'seedGoodWillHuntingCourse.js': ['good-will-hunting-trauma-attachment'],
    'seedMandatedReporter.js': ['mandated-reporter-duty'],
    'seedMovieCourses.js': ['beautiful-mind', 'black-swan', 'ordinary-people', 'sixth-sense'],
    'seedNarrativeTherapyCourse.js': ['narrative-therapy-techniques'],
    'seedNewCourses.js': ['crisis-intervention-and-suicide-prevention-a-comprehensive-clinical-guide', 'ethics-and-professional-boundaries-in-counseling-practice', '28-days-later-understanding-addiction-and-recovery', 'motivational-interviewing-from-ambivalence-to-action'],
    'seedNewCourses3.js': ['small-warriors-big-battles-parental-incarceration', 'beyond-the-uniform-first-responder-families', 'cultural-competence-ethics-risk-reduction-cr601'],
    'seedSuicideRiskInteractive.js': ['suicide-risk-assessment-interactive'],
    'seedStandardCourses_batch1.js': ['cbt-toolbox-core-techniques', 'dbt-skills-in-action', 'motivational-interviewing-art'],
    'seedStandardCourses_batch2.js': ['trauma-informed-care-foundations', 'suicide-assessment-safety-planning', 'psychopharmacology-for-counselors'],
    'seedTeleMentalHealth.js': ['mastering-telemental-health-an-essential-guide-to-a-compliant-virtual-healthcare-practice-in-georgia-mkkycoyo'],
    'seedExpandedCourses.js': ['the-elephant-in-the-room-navigating-difficult-conversations-in-therapy', 'walking-on-eggshells-high-conflict-clients', 'when-it-rains-it-pours-treating-clients-with-multiple-stressors-and-comorbidities', 'it-takes-a-village-collaborative-care'],
    'seedFadingVoices.js': ['fading-voices-lasting-connections-cr-sp-402'],
  };

  const coveredSlugs = new Set();
  for (const [script, slugs] of Object.entries(scriptMap)) {
    console.log(`📜 ${script}:`);
    for (const slug of slugs) {
      const found = allIC.find(c => c.slug === slug);
      if (found) {
        console.log(`  ✅ ${slug} → ${found.title} (${found.status})`);
        coveredSlugs.add(slug);
      } else {
        console.log(`  ❌ ${slug} → NOT IN DB`);
      }
    }
    console.log('');
  }

  // Courses NOT covered by any seed script
  console.log('COURSES WITH NO KNOWN SEED SCRIPT:');
  allIC.forEach(c => {
    if (!coveredSlugs.has(c.slug)) {
      console.log(`  ⚠️  ${c.slug} → ${c.title} (${c.status})`);
    }
  });

  await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
