// createMigrationCertificates.cjs
// Creates Certificate records for TalentLMS migrated CE logs
// so they appear when users click "Sync CE Hours" on credentials.html
//
// Run on Render: node createMigrationCertificates.cjs

const mongoose = require('mongoose');
const crypto = require('crypto');

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  console.log('='.repeat(60));
  console.log('CREATE MIGRATION CERTIFICATES');
  console.log('='.repeat(60));

  // Get all migrated CE logs that have a course reference
  const logs = await db.collection('celogs').find({
    'migration.source': 'talentlms',
    status: 'completed',
    course: { $exists: true, $ne: null }
  }).toArray();

  console.log('CE logs with course ref:', logs.length);

  // Also count ones without course ref
  const noRef = await db.collection('celogs').countDocuments({
    'migration.source': 'talentlms',
    $or: [{ course: { $exists: false } }, { course: null }]
  });
  console.log('CE logs WITHOUT course ref (skipped):', noRef);

  if (logs.length === 0) {
    console.log('Nothing to process.');
    process.exit(0);
  }

  // Get next certificate number
  const year = new Date().getFullYear();
  const prefix = 'CR-' + year + '-';
  const lastCert = await db.collection('certificates').findOne(
    { certificateNumber: { $regex: '^' + prefix } },
    { sort: { certificateNumber: -1 } }
  );
  let nextNum = 1;
  if (lastCert) {
    const parts = lastCert.certificateNumber.split('-');
    nextNum = parseInt(parts[2]) + 1;
  }
  console.log('Starting cert number:', prefix + String(nextNum).padStart(4, '0'));

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const log of logs) {
    // Check if certificate already exists for this user+course combo
    const existing = await db.collection('certificates').findOne({
      user: log.user,
      course: log.course,
      batchId: 'TLMS-CERTS-2026'
    });

    if (existing) {
      skipped++;
      continue;
    }

    const certNumber = prefix + String(nextNum).padStart(4, '0');
    const verificationCode = crypto.randomBytes(8).toString('hex').toUpperCase();

    const certDoc = {
      certificateNumber: certNumber,
      user: log.user,
      course: log.course,
      ceLog: log._id,
      completionDate: log.completionDate || new Date('2025-12-01'),
      ceHours: log.hours || 3,
      nbccProgramNumber: null,
      providerNumber: '7760',
      pdfUrl: null,
      template: 'standard',
      batchId: 'TLMS-CERTS-2026',
      emailDelivery: { sent: false },
      verificationCode: verificationCode,
      verificationCount: 0,
      isRevoked: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    try {
      const result = await db.collection('certificates').insertOne(certDoc);

      // Update the CE log to link back to the certificate
      await db.collection('celogs').updateOne(
        { _id: log._id },
        {
          $set: {
            certificateGenerated: true,
            certificateId: result.insertedId
          }
        }
      );

      created++;
      nextNum++;
    } catch (e) {
      console.log('ERR:', log.title, e.message);
      errors++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('DONE');
  console.log('='.repeat(60));
  console.log('  Certificates created:', created);
  console.log('  Skipped (already exist):', skipped);
  console.log('  Skipped (no course ref):', noRef);
  console.log('  Errors:', errors);

  const total = await db.collection('certificates').countDocuments({ batchId: 'TLMS-CERTS-2026' });
  console.log('  Total migration certificates:', total);

  console.log('\nUsers can now click "Sync CE Hours" on credentials.html to see these.');
  process.exit(0);
})();
