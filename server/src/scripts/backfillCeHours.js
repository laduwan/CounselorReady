// backfillCeHours.js
// Backfills the STORED ceHours scalar from ceuHours where hours live only in
// ceuHours (a common seed artifact that trips the ACEP audit's R4/R2 rules).
//
// Uses the RAW driver (updateMany) so schema validation cannot block fixing the
// very field that fails validation. Only touches the interactivecourses collection.
//
// Run: node backfillCeHours.js
// Requires: MONGODB_URI environment variable

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ No MONGODB_URI environment variable set');
  process.exit(1);
}

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB\n');

  const col = mongoose.connection.db.collection('interactivecourses');

  // Pull the scalars only — the collection is small and we never touch prose.
  const docs = await col
    .find({}, { projection: { slug: 1, title: 1, ceHours: 1, ceuHours: 1 } })
    .toArray();
  console.log(`Found ${docs.length} courses\n`);

  const needsBackfill = []; // ceHours missing/<=0 but ceuHours > 0 → fixable
  const needsManual   = []; // BOTH missing/<=0 → hours can't be inferred

  for (const d of docs) {
    const ce  = Number(d.ceHours);
    const ceu = Number(d.ceuHours);
    const ceOk  = Number.isFinite(ce)  && ce  > 0;
    const ceuOk = Number.isFinite(ceu) && ceu > 0;

    if (!ceOk && ceuOk) needsBackfill.push(d);
    else if (!ceOk && !ceuOk) needsManual.push(d);
  }

  // Apply the fix. Single RAW updateMany over the resolved id set, using an
  // aggregation pipeline so ceHours is set from each doc's own ceuHours.
  for (const d of needsBackfill) {
    const slug = (d.slug || String(d._id)).padEnd(30).slice(0, 30);
    console.log(`${slug} | ceHours <- ceuHours (${Number(d.ceuHours)})`);
  }

  if (needsBackfill.length) {
    await col.updateMany(
      { _id: { $in: needsBackfill.map(d => d._id) } },
      [{ $set: { ceHours: '$ceuHours' } }]
    );
  }

  // List (do not modify) the docs that need a human to set hours.
  if (needsManual.length) {
    console.log('\n⚠ NEEDS MANUAL ceHours ───────────────────────────────');
    for (const d of needsManual) {
      console.log(`  ${d.slug || '(no-slug)'} | ${d.title || '(untitled)'} | ${d._id}`);
    }
  }

  console.log('\n── Summary ────────────────────────────────────────────');
  console.log(`  Total docs    : ${docs.length}`);
  console.log(`  Backfilled    : ${needsBackfill.length}`);
  console.log(`  Needs manual  : ${needsManual.length}`);

  await mongoose.disconnect();
}

run().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
