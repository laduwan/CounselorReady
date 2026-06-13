/**
 * diagnoseTelementalBypass.cjs  —  READ ONLY. Makes no writes.
 *
 * Finds who is enrolled in the 6-hour telemental course, flags any whose access
 * looks unpaid (free/no purchase/no active sub), and reports whether a certificate
 * was issued. Run from the Render backend shell:
 *
 *   cd ~/project/src/server   (or wherever server package.json lives)
 *   node src/scripts/diagnoseTelementalBypass.cjs
 *
 * Override the course match if needed:
 *   COURSE_MATCH="telemental" node src/scripts/diagnoseTelementalBypass.cjs
 */
const mongoose = require('mongoose');

const COURSE_MATCH = process.env.COURSE_MATCH || 'telemental';
const MONGO = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL;

(async () => {
  if (!MONGO) { console.error('No Mongo URI in env (MONGODB_URI/MONGO_URI/DATABASE_URL).'); process.exit(1); }
  await mongoose.connect(MONGO);
  const db = mongoose.connection.db;

  // Use raw collections — avoids model-registration hassles in a one-off script.
  const courses  = db.collection('interactivecourses');
  const progress = db.collection('interactivecourseprogresses');
  const users    = db.collection('users');
  const certs    = db.collection('certificates');

  // 1. Find the telemental course(s)
  const courseDocs = await courses.find({
    $or: [
      { title: { $regex: COURSE_MATCH, $options: 'i' } },
      { slug:  { $regex: COURSE_MATCH, $options: 'i' } },
      { courseCode: { $regex: COURSE_MATCH, $options: 'i' } }
    ]
  }).project({ title: 1, slug: 1, courseCode: 1, ceHours: 1, ceuHours: 1, accessType: 1, price: 1 }).toArray();

  if (!courseDocs.length) { console.log(`No course matched "${COURSE_MATCH}".`); process.exit(0); }

  for (const course of courseDocs) {
    const hrs = course.ceHours || course.ceuHours || '?';
    console.log('\n==================================================================');
    console.log(`COURSE: ${course.title}`);
    console.log(`  slug=${course.slug}  code=${course.courseCode || '—'}  hours=${hrs}  accessType=${course.accessType || 'paid'}  price=${course.price ?? '—'}`);
    console.log('==================================================================');

    if (course.accessType === 'free') {
      console.log('  ⚠ accessType is FREE — anyone can enroll legitimately. If this should be paid, fix accessType.');
    }

    const enrollments = await progress.find({ courseId: course._id })
      .project({ userId: 1, status: 1, enrolledAt: 1, completedAt: 1, assessmentPassed: 1, overallProgress: 1 })
      .sort({ enrolledAt: -1 }).toArray();

    console.log(`  Enrollments: ${enrollments.length}`);

    for (const e of enrollments) {
      const u = await users.findOne({ _id: e.userId },
        { projection: { email: 1, phone: 1, 'profile.firstName': 1, 'profile.lastName': 1,
                        'subscription.status': 1, 'subscription.plan': 1, purchasedCourses: 1, role: 1 } });

      if (!u) { console.log(`   - [user ${e.userId} not found]`); continue; }

      const subStatus = u.subscription?.status || 'free';
      const subPlan   = u.subscription?.plan   || 'free';
      const isAdmin   = u.role === 'admin';
      const activeSub = ['active', 'trial', 'lifetime'].includes(subStatus) && subPlan !== 'free';
      const purchased = (u.purchasedCourses || []).some(pc =>
        pc.courseId && pc.courseId.toString() === course._id.toString());

      // Unpaid = not admin, not active sub, not purchased, and course isn't free
      const looksUnpaid = !isAdmin && !activeSub && !purchased && course.accessType !== 'free';

      // Was a certificate issued?
      const cert = await certs.findOne(
        { userId: e.userId, courseId: course._id, isRevoked: { $ne: true } },
        { projection: { certificateNumber: 1, completionDate: 1, ceHours: 1, fileUrl: 1 } });

      const flag = looksUnpaid ? '🚨 UNPAID' : '  ok    ';
      const name = `${u.profile?.firstName || ''} ${u.profile?.lastName || ''}`.trim() || '(no name)';
      console.log(`   ${flag} ${u.email}  [${name}]`);
      console.log(`            access: sub=${subStatus}/${subPlan} purchased=${purchased} admin=${isAdmin}`);
      console.log(`            progress: status=${e.status || '—'} passed=${e.assessmentPassed} enrolledAt=${e.enrolledAt ? new Date(e.enrolledAt).toISOString() : '—'}`);
      if (cert) {
        console.log(`            📜 CERTIFICATE ISSUED: ${cert.certificateNumber} (${cert.ceHours} hrs, ${cert.completionDate ? new Date(cert.completionDate).toISOString().slice(0,10) : '—'})`);
        if (looksUnpaid) console.log(`            ↑↑ UNPAID + CERTIFIED — review for void/convert. cert _id: ${cert._id}`);
      } else {
        console.log(`            no certificate on file`);
      }
    }
  }

  console.log('\nDone. This script made NO changes.');
  await mongoose.disconnect();
  process.exit(0);
})().catch(err => { console.error('Diagnostic error:', err.message); process.exit(1); });
