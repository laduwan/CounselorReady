// Verifies the 3 courses backfilled by backfillApprovals_verified3.js
// actually have correct approvals[] with proper schema field names.
//
// Run from ~/project/src/server:
//   node src/scripts/verifyApprovals_verified3.js

import mongoose from 'mongoose';

const CODES = ['CR-201', 'CR-403', 'CR-404'];

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) { console.error('MONGODB_URI not set'); process.exit(1); }

  await mongoose.connect(uri);
  const C = mongoose.connection.collection('interactivecourses');

  for (const code of CODES) {
    const doc = await C.findOne({ courseCode: code }, { projection: { title: 1, approvals: 1 } });
    if (!doc) {
      console.log(`${code}: NOT FOUND`);
      continue;
    }
    console.log(`${code} — "${doc.title}"`);
    console.log(`  approvals: ${JSON.stringify(doc.approvals)}`);
  }

  await mongoose.connection.close();
}

main().catch((err) => {
  console.error('Verify failed:', err);
  process.exit(1);
});
