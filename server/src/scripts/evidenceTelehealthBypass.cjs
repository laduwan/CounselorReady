/**
 * evidenceTelehealthBypass.cjs  —  READ ONLY. No writes.
 *
 * Pulls the full engagement footprint for one user's enrollment to document
 * whether the certificate was legitimately earned. Use to justify void vs.
 * giving them a chance to pay.
 *
 *   node src/scripts/evidenceTelehealthBypass.cjs
 *   EMAIL="aterry@gmail.com" node src/scripts/evidenceTelehealthBypass.cjs
 */
const mongoose = require('mongoose');

const EMAIL = process.env.EMAIL || 'aterry@gmail.com';
const MONGO = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL;

function hms(sec) {
  sec = sec || 0;
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
  return `${h}h ${m}m ${s}s`;
}

(async () => {
  if (!MONGO) { console.error('No Mongo URI in env.'); process.exit(1); }
  await mongoose.connect(MONGO);
  const db = mongoose.connection.db;

  const user = await db.collection('users').findOne({ email: EMAIL.toLowerCase() },
    { projection: { email: 1, 'profile.firstName': 1, 'profile.lastName': 1,
                    'subscription.status': 1, 'subscription.plan': 1, createdAt: 1 } });
  if (!user) { console.log(`No user ${EMAIL}`); process.exit(0); }

  console.log(`\nUSER: ${user.email}  (${user.profile?.firstName||''} ${user.profile?.lastName||''})`);
  console.log(`  account created: ${user.createdAt ? new Date(user.createdAt).toISOString() : '—'}`);
  console.log(`  subscription: ${user.subscription?.status}/${user.subscription?.plan}\n`);

  const progs = await db.collection('interactivecourseprogresses')
    .find({ userId: user._id }).toArray();

  for (const p of progs) {
    const course = await db.collection('interactivecourses').findOne({ _id: p.courseId },
      { projection: { title: 1, courseCode: 1, ceHours: 1, price: 1 } });
    const cert = await db.collection('certificates').findOne(
      { userId: user._id, courseId: p.courseId },
      { projection: { certificateNumber: 1, isRevoked: 1, completionDate: 1, ceHours: 1 } });

    // Engagement footprint
    const sections = p.sectionProgress || [];
    const viewed = sections.reduce((n, s) => n + (s.viewedBlocks?.length || 0), 0);
    const completedBlocks = sections.reduce((n, s) => n + (s.completedBlocks?.length || 0), 0);
    const sectionsDone = sections.filter(s => s.status === 'completed').length;
    const attempts = p.assessmentAttempts || [];

    // Elapsed enrolled -> certified/completed
    const start = p.enrolledAt ? new Date(p.enrolledAt) : null;
    const end = p.completedAt ? new Date(p.completedAt) : (cert?.completionDate ? new Date(cert.completionDate) : null);
    const elapsedH = (start && end) ? ((end - start) / 3600000).toFixed(1) : '—';

    console.log('────────────────────────────────────────────────────');
    console.log(`COURSE: ${course?.title || p.courseId}  [${course?.courseCode||'—'}, ${course?.ceHours||'?'} CE hrs]`);
    console.log(`  status=${p.status}  passed=${p.assessmentPassed}  overallProgress=${p.overallProgress}%`);
    console.log(`  enrolledAt=${start?start.toISOString():'—'}  completedAt=${end?end.toISOString():'—'}  elapsed=${elapsedH}h`);
    console.log(`  RECORDED SEAT TIME: ${hms(p.totalTimeSpent)}  (required ~${course?.ceHours||'?'}h for ${course?.ceHours||'?'} CE)`);
    console.log(`  ENGAGEMENT: ${sectionsDone}/${sections.length} sections completed, ${viewed} blocks viewed, ${completedBlocks} interactive blocks done`);
    console.log(`  ASSESSMENT ATTEMPTS: ${attempts.length}` +
      (attempts.length ? ` — ` + attempts.map(a=>`${a.percentage}%${a.passed?'(pass)':''}`).join(', ') : ''));
    if (cert) {
      console.log(`  📜 CERT: ${cert.certificateNumber}  revoked=${!!cert.isRevoked}`);
    } else {
      console.log(`  no certificate`);
    }

    // Verdict heuristic for THIS record
    const requiredSec = (course?.ceHours || 0) * 3600;
    const seatRatio = requiredSec ? (p.totalTimeSpent || 0) / requiredSec : 0;
    const flags = [];
    if (seatRatio < 0.1) flags.push('seat-time <10% of required');
    if (viewed === 0) flags.push('ZERO content blocks viewed');
    if (sectionsDone === 0 && p.assessmentPassed) flags.push('passed assessment with NO sections completed');
    if (elapsedH !== '—' && parseFloat(elapsedH) < (course?.ceHours||0)) flags.push(`certified faster than course length (${elapsedH}h < ${course?.ceHours}h)`);
    if (cert && !cert.isRevoked && flags.length) {
      console.log(`  ⚠ ILLEGITIMATE-COMPLETION FLAGS: ${flags.join('; ')}`);
    }
  }

  console.log('\nRead-only. No changes made.');
  await mongoose.disconnect();
  process.exit(0);
})().catch(e => { console.error('Error:', e.message); process.exit(1); });
