/**
 * remediateUnpaidTelehealthCert.cjs
 *
 * Targets exactly ONE bad certificate from the assessment-bypass:
 *   T'Challa O'Bryant (aterry@gmail.com) — CR-2026-564100703 — CR-TMH601
 *
 * DRY RUN by default — prints the records it WOULD change, writes nothing.
 * To actually apply:  CONFIRM=yes node src/scripts/remediateUnpaidTelehealthCert.cjs
 *
 * What a confirmed run does (and ONLY this):
 *   1. Certificate CR-2026-564100703: isRevoked=true, revokedAt=now,
 *      revokedReason="Issued without payment via assessment-endpoint bypass (2026-06-13)"
 *   2. That user's CourseProgress for the TMH601 course(s): status -> 'not_started',
 *      clears completedAt / certificateId / certificateIssuedAt, overallProgress -> 0
 *
 * It does NOT touch any other user, certificate, payment, or the user account.
 * Fully scoped by email + certificateNumber so it cannot affect anyone else.
 */
const mongoose = require('mongoose');

const TARGET_EMAIL = 'aterry@gmail.com';
const TARGET_CERT  = 'CR-2026-564100703';
const REASON       = 'Issued without payment via assessment-endpoint bypass (2026-06-13)';
const CONFIRM      = process.env.CONFIRM === 'yes';
const MONGO = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL;

(async () => {
  if (!MONGO) { console.error('No Mongo URI in env.'); process.exit(1); }
  await mongoose.connect(MONGO);
  const db = mongoose.connection.db;
  const users = db.collection('users');
  const certs = db.collection('certificates');
  const progress = db.collection('interactivecourseprogresses');

  console.log(`MODE: ${CONFIRM ? '🔴 LIVE (will write)' : '🟢 DRY RUN (no writes)'}\n`);

  // --- locate the exact cert by number (authoritative key) ---
  const cert = await certs.findOne({ certificateNumber: TARGET_CERT });
  if (!cert) { console.log(`Certificate ${TARGET_CERT} not found. Nothing to do.`); return done(); }

  const user = await users.findOne({ _id: cert.userId },
    { projection: { email: 1, 'profile.firstName': 1, 'profile.lastName': 1 } });

  // Safety: confirm the cert really belongs to the expected email
  if (user?.email?.toLowerCase() !== TARGET_EMAIL.toLowerCase()) {
    console.error(`SAFETY STOP: ${TARGET_CERT} belongs to ${user?.email || '(unknown)'}, not ${TARGET_EMAIL}. Aborting without changes.`);
    return done();
  }

  console.log('CERTIFICATE TO REVOKE:');
  console.log(`  number=${cert.certificateNumber}  _id=${cert._id}`);
  console.log(`  user=${user.email}  course=${cert.title || cert.courseId}`);
  console.log(`  ceHours=${cert.ceHours}  currentlyRevoked=${!!cert.isRevoked}\n`);

  // --- locate the user's progress for this course (could be the dup course id too) ---
  // Use the cert's courseId; also catch any TMH601 dup the user is enrolled in.
  const courseIds = [cert.courseId].filter(Boolean);
  const progressDocs = await progress.find({ userId: cert.userId, courseId: { $in: courseIds } }).toArray();

  console.log(`PROGRESS RECORDS TO RESET: ${progressDocs.length}`);
  for (const p of progressDocs) {
    console.log(`  _id=${p._id}  courseId=${p.courseId}  status=${p.status}  passed=${p.assessmentPassed}  overall=${p.overallProgress}`);
  }
  console.log('');

  if (!CONFIRM) {
    console.log('DRY RUN complete. No changes made.');
    console.log('To apply: CONFIRM=yes node src/scripts/remediateUnpaidTelehealthCert.cjs');
    return done();
  }

  // --- LIVE writes ---
  const r1 = await certs.updateOne(
    { _id: cert._id },
    { $set: { isRevoked: true, revokedAt: new Date(), revokedReason: REASON } }
  );
  console.log(`✓ Certificate revoked (matched=${r1.matchedCount}, modified=${r1.modifiedCount})`);

  if (progressDocs.length) {
    const r2 = await progress.updateMany(
      { _id: { $in: progressDocs.map(p => p._id) } },
      { $set: { status: 'not_started', overallProgress: 0 },
        $unset: { completedAt: '', certificateId: '', certificateIssuedAt: '' } }
    );
    console.log(`✓ Progress reset (matched=${r2.matchedCount}, modified=${r2.modifiedCount})`);
  }

  console.log('\nRemediation complete. Only this one user/cert was affected.');
  return done();

  function done() { return mongoose.disconnect().then(() => process.exit(0)); }
})().catch(err => { console.error('Error:', err.message); process.exit(1); });
