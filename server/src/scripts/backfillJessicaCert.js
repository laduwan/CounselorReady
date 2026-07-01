// One-time backfill script
// Deletes Jessica Ward's bare certificate (issued without rich template)
// and reissues it using the full ./src/utils/certificate.js generator.
//
// Run from server directory:
//   node src/scripts/backfillJessicaCert.js
//
// After running successfully, this file can be deleted from the repo.

import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { generateCertificate, generateCertificateNumber } from '../utils/certificate.js';

const TARGET_EMAIL = 'jessicawardtpc@gmail.com';
const COURSE_ID = '699766ce2b436278fb309c8b';
const BARE_CERT_ID = '69f178851038d0d240c50489';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function run() {
  if (!process.env.MONGODB_URI) {
    console.error('ERROR: MONGODB_URI not set');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  // Lookups
  const u = await db.collection('users').findOne({ email: TARGET_EMAIL });
  if (!u) { console.error('User not found'); process.exit(1); }
  const c = await db.collection('interactivecourses').findOne({ _id: new mongoose.Types.ObjectId(COURSE_ID) });
  if (!c) { console.error('Course not found'); process.exit(1); }
  const p = await db.collection('interactivecourseprogresses').findOne({ userId: u._id, courseId: c._id });
  if (!p) { console.error('Progress not found'); process.exit(1); }

  console.log('User:', u.email, '|', u.profile?.firstName, u.profile?.lastName);
  console.log('Course:', c.title, '|', c.ceHours, 'CE hrs');
  console.log('Completed:', p.completedAt);
  console.log('Objectives available:', (c.learningObjectives || c.objectives || []).length);

  // Step 1: delete bare cert
  const bareCertId = new mongoose.Types.ObjectId(BARE_CERT_ID);
  const delResult = await db.collection('certificates').deleteOne({ _id: bareCertId });
  console.log('Deleted bare cert:', delResult.deletedCount);
  await db.collection('users').updateOne(
    { _id: u._id },
    { $pull: { certificates: { certificateId: bareCertId } } }
  );
  console.log('Pulled from user.certificates[]');

  // Step 2: assemble payload mirroring interactiveCourseRoutes.js
  const certificateNumber = await generateCertificateNumber(c._id, u._id);
  const userName =
    (u.profile?.certificateName?.trim()) ||
    `${(u.profile?.firstName || '')} ${(u.profile?.lastName || '')}`.trim() ||
    u.email;

  console.log('Generating rich cert:', certificateNumber, '|', userName);

  const pdfBuffer = await generateCertificate({
    holderName: userName,
    courseName: c.title,
    completionDate: p.completedAt || new Date(),
    ceHours: c.ceHours || 1,
    certificateNumber,
    acepNumber: 'ACEP #7760',
    ceCategory: c.ceCategory || c.contentArea || c.categories?.[0] || 'Counseling Theory/Practice and the Counseling Relationship',
    objectives: c.learningObjectives || c.objectives || [],
    approvingBody: 'NBCC'
  });

  // Step 3: upload to Cloudinary (mirrors route exactly)
  const uploadResult = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        folder: 'certificates',
        public_id: `cert_${certificateNumber}_${Date.now()}`,
        format: 'pdf'
      },
      (err, result) => err ? reject(err) : resolve(result)
    );
    const r = new Readable();
    r.push(pdfBuffer);
    r.push(null);
    r.pipe(stream);
  });
  const pdfUrl = uploadResult.secure_url;
  console.log('PDF URL:', pdfUrl);

  // Step 4: insert new cert record + update user + update progress
  const certDoc = {
    userId: u._id,
    courseId: c._id,
    title: c.title,
    provider: 'Ga Integrated Therapeutic Perspectives, LLC',
    completionDate: p.completedAt || new Date(),
    ceHours: c.ceHours || 1,
    category: c.categories?.[0] || 'Core',
    nbccApproved: true,
    acepNumber: c.acepNumber || '7760',
    approvingBody: 'NBCC',
    approvalNumber: c.acepNumber || '#7760',
    certificateNumber,
    holderName: userName,
    pdfUrl,
    source: 'platform',
    issuedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  const ins = await db.collection('certificates').insertOne(certDoc);
  console.log('Cert inserted:', ins.insertedId);

  await db.collection('users').updateOne(
    { _id: u._id },
    { $push: { certificates: { certificateId: ins.insertedId, courseId: c._id, issuedAt: new Date(), pdfUrl } } }
  );
  await db.collection('interactivecourseprogresses').updateOne(
    { _id: p._id },
    { $set: { certificateIssued: true, certificateId: ins.insertedId, certificateUrl: pdfUrl } }
  );

  console.log('DONE — rich cert live at:', pdfUrl);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch(err => {
  console.error('ERROR:', err.message);
  console.error(err.stack);
  process.exit(1);
});
