// diag-cr614.js — diagnostic for CR-614 collection state
// Run: node src/scripts/diag-cr614.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URI not found');
  process.exit(1);
}

async function diag() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected. Checking for CR-614 in both collections...\n');

    const ic = mongoose.connection.collection('interactivecourses');
    const c = mongoose.connection.collection('courses');

    const icDoc = await ic.findOne({ courseCode: 'CR-614' });
    const cDoc = await c.findOne({ courseCode: 'CR-614' });

    console.log('========================================');
    console.log('interactivecourses.CR-614:');
    console.log('========================================');
    if (icDoc) {
      console.log('  _id:          ', icDoc._id);
      console.log('  title:        ', icDoc.title);
      console.log('  courseCode:   ', icDoc.courseCode);
      console.log('  ceHours:      ', icDoc.ceHours);
      console.log('  sections:     ', icDoc.sections ? icDoc.sections.length : 'MISSING');
      console.log('  modules:      ', icDoc.modules ? icDoc.modules.length : 'not present (good)');
      console.log('  assessment:   ', icDoc.assessment ? (icDoc.assessment.questions ? icDoc.assessment.questions.length + ' questions' : 'present but no questions') : 'MISSING');
      console.log('  references:   ', icDoc.references ? icDoc.references.length : 'MISSING');
      console.log('  top-level keys:', Object.keys(icDoc).sort().join(', '));
    } else {
      console.log('  NOT FOUND in interactivecourses');
    }

    console.log('\n========================================');
    console.log('courses.CR-614 (legacy/deprecated):');
    console.log('========================================');
    if (cDoc) {
      console.log('  _id:          ', cDoc._id);
      console.log('  title:        ', cDoc.title);
      console.log('  sections:     ', cDoc.sections ? cDoc.sections.length : 'MISSING');
      console.log('  modules:      ', cDoc.modules ? cDoc.modules.length : 'not present');
      console.log('  top-level keys:', Object.keys(cDoc).sort().join(', '));
      console.log('\n  ⚠ CR-614 EXISTS IN LEGACY courses COLLECTION — should be removed');
    } else {
      console.log('  NOT FOUND in courses (good)');
    }

    console.log('\n========================================');
    console.log('ALL CR-614 occurrences across DB:');
    console.log('========================================');
    const collections = await mongoose.connection.db.listCollections().toArray();
    for (const col of collections) {
      try {
        const doc = await mongoose.connection.collection(col.name).findOne({ courseCode: 'CR-614' });
        if (doc) {
          console.log(`  Found in '${col.name}': _id=${doc._id}, title="${doc.title}"`);
        }
      } catch(e) {}
    }

    await mongoose.disconnect();
    console.log('\n✓ Diagnostic complete');
    process.exit(0);
  } catch (err) {
    console.error('DIAGNOSTIC FAILED:', err);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
}

diag();
