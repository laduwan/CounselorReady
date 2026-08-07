/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('No MONGODB_URI'); process.exit(1); }

// ═══════════════════════════════════════════════════════════════════
// SESSION SERIES AUDIT — read-only
// Business rule: a series carries ONE 5hr course OR TWO 2.5hr courses.
// A series with more than 2 member sessions is misconfigured — a single
// purchase fans out to every member, so an oversized series over-seats
// (and over-credits) every buyer.
// Raw collections, no Mongoose models required.
// ═══════════════════════════════════════════════════════════════════

async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;

  const seriesList = await db.collection('sessionseries').find({}).toArray();
  const sessions = await db.collection('livesessions').find({}).toArray();

  console.log('='.repeat(90));
  console.log('SESSION SERIES AUDIT');
  console.log('Date: ' + new Date().toISOString());
  console.log('Series found: ' + seriesList.length);
  console.log('='.repeat(90) + '\n');

  const violations = [];

  seriesList.forEach(ser => {
    const members = sessions
      .filter(s => s.seriesId && s.seriesId.toString() === ser._id.toString())
      .sort((a, b) => new Date(a.scheduledStart) - new Date(b.scheduledStart));

    const required = members.filter(
      m => !m.seriesMembership || m.seriesMembership.required !== false
    );

    console.log('-'.repeat(90));
    console.log('SERIES     : ' + ser.title);
    console.log('SLUG       : ' + ser.slug);
    console.log('PRICE      : ' + ser.price + '   AUTOENROLL: ' + ser.autoEnroll);
    console.log('MEMBERS    : ' + members.length + '  (required: ' + required.length + ')');

    const enrolled = ser.autoEnroll === 'all' ? members : required;
    if (enrolled.length > 2) {
      console.log('*** RULE VIOLATION: one purchase seats ' + enrolled.length + ' sessions (max is 2) ***');
      violations.push({ title: ser.title, count: enrolled.length });
    }

    let totalCE = 0;
    members.forEach(m => {
      totalCE += (m.ceuHours || 0);
      const req = (!m.seriesMembership || m.seriesMembership.required !== false) ? 'REQ' : 'opt';
      console.log('   [' + req + '] ' + m.slug +
        '  | ' + m.scheduledStart +
        '  | ceu: ' + (m.ceuHours || 0) +
        '  | seats: ' + (m.registrants ? m.registrants.length : 0));
    });
    console.log('   TOTAL CE ACROSS MEMBERS: ' + totalCE);
  });

  // Sessions carrying a seriesId that points at nothing
  const seriesIds = seriesList.map(s => s._id.toString());
  const orphans = sessions.filter(
    s => s.seriesId && !seriesIds.includes(s.seriesId.toString())
  );
  if (orphans.length) {
    console.log('\n' + '-'.repeat(90));
    console.log('ORPHANED SESSIONS (seriesId points to a missing series):');
    orphans.forEach(s => console.log('   ' + s.slug + '  -> ' + s.seriesId));
  }

  console.log('\n' + '='.repeat(90));
  if (violations.length) {
    console.log('VIOLATIONS: ' + violations.length + ' series exceed the 2-session rule');
    violations.forEach(v => console.log('   ' + v.title + ' — ' + v.count + ' sessions per purchase'));
  } else {
    console.log('No series exceeds the 2-session rule.');
  }
  console.log('DONE — read-only, nothing was modified.');

  await mongoose.disconnect();
}

main().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
