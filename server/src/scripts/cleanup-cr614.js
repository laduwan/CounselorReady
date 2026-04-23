// cleanup-cr614.js — delete the broken CR-614 doc so seed can re-insert clean
// Run: node src/scripts/cleanup-cr614.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URI not found');
  process.exit(1);
}

async function cleanup() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.\n');

    const ic = mongoose.connection.collection('interactivecourses');

    // Check what's there first
    const before = await ic.findOne({ courseCode: 'CR-614' });
    if (!before) {
      console.log('CR-614 not found in interactivecourses — nothing to clean up.');
      await mongoose.disconnect();
      process.exit(0);
    }

    console.log('Found CR-614:');
    console.log('  _id:     ', before._id);
    console.log('  title:   ', before.title);
    console.log('  modules: ', before.modules ? before.modules.length : 'none');
    console.log('  sections:', before.sections ? before.sections.length : 'MISSING (old structure)');
    console.log('');

    // Delete it
    const result = await ic.deleteOne({ courseCode: 'CR-614' });
    console.log(`✓ Deleted ${result.deletedCount} document(s)`);

    // Verify
    const after = await ic.findOne({ courseCode: 'CR-614' });
    if (after) {
      console.log('⚠ CR-614 still present after delete — something is wrong');
    } else {
      console.log('✓ Confirmed: CR-614 removed from interactivecourses');
      console.log('\nYou can now run the seed script to re-insert with fresh structure:');
      console.log('  node src/scripts/seedCR614-The_Final_Chapter-EndOfLife_DeathAnxiety_Meaning.js');
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('CLEANUP FAILED:', err);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
}

cleanup();
