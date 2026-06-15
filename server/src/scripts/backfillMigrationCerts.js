/**
 * Backfill Migration Certificates
 * 
 * Creates Certificate documents for TalentLMS-migrated users whose
 * completions were stored in user.courseCompletions but never
 * materialized into the Certificate collection.
 *
 * USAGE (Render shell):
 *   cd server
 *   node src/scripts/backfillMigrationCerts.js
 *
 * DRY RUN (no writes):
 *   DRY_RUN=1 node src/scripts/backfillMigrationCerts.js
 */

import mongoose from 'mongoose';

// ── Config ──────────────────────────────────────────────────────────
const MONGO_URI  = process.env.MONGO_URI || 'mongodb://localhost:27017/counselorready';
const DRY_RUN  = process.env.DRY_RUN === '1';

// ── TalentLMS course → CE metadata mapping ──────────────────────────
// These are the courses that existed on gaitp.talentlms.com.
// CE hours sourced from the original TalentLMS catalog.
const COURSE_MAP = {
  'Mastering TeleMental Health: An Essential Guide To Compliant Online Practice in Georgia': {
    ceHours: 6,
    category: 'Telehealth',
    nbccApproved: true,
    acepNumber: '7760',
    approvingBody: 'NBCC'
  },
  'Ethical Practices in Mental Health Counseling': {
    ceHours: 3,
    category: 'Ethics',
    nbccApproved: true,
    acepNumber: '7760',
    approvingBody: 'NBCC'
  },
  'The Neurobiology of Trauma: A Foundation for Trauma-Informed Care': {
    ceHours: 3,
    category: 'Trauma',
    nbccApproved: true,
    acepNumber: '7760',
    approvingBody: 'NBCC'
  },
  'Cultural Sensitivity in Uncertain Political Climates': {
    ceHours: 3,
    category: 'Cultural Diversity',
    nbccApproved: true,
    acepNumber: '7760',
    approvingBody: 'NBCC'
  }
};

// Fallback for any course name not in the map
const DEFAULT_META = {
  ceHours: 1,
  category: 'General',
  nbccApproved: false,
  acepNumber: null,
  approvingBody: null
};

// ── Minimal schemas (matches existing models) ───────────────────────
const userSchema = new mongoose.Schema({
  email: String,
  profile: {
    firstName: String,
    lastName: String
  },
  migratedFrom: String,
  courseCompletions: [{
    courseName: String,
    completedAt: Date,
    source: String
  }]
}, { strict: false });

const certificateSchema = new mongoose.Schema({
  userId:             { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId:           { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  title:              { type: String, required: true },
  provider:           { type: String, required: true },
  completionDate:     { type: Date, required: true },
  ceHours:            { type: Number, required: true, min: 0 },
  category:           String,
  nbccApproved:       { type: Boolean, default: false },
  acepNumber:         String,
  approvingBody:      String,
  certificateNumber:  { type: String, unique: true, sparse: true },
  source:             { type: String, default: 'import' },
  verificationCode:   { type: String, unique: true, sparse: true },
  verificationUrl:    String,
  notes:              String,
  isRevoked:          { type: Boolean, default: false }
}, { timestamps: true, strict: false });

// Auto-generate verification code (mirrors Certificate model pre-save)
certificateSchema.pre('save', function (next) {
  if (!this.verificationCode) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'CR-';
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
    code += '-';
    for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
    this.verificationCode = code;
    this.verificationUrl = `https://counselorready.com/verify/${code}`;
  }
  next();
});

function generateCertNumber() {
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 1_000_000_000).toString().padStart(9, '0');
  return `CR-${year}-${rand}`;
}

// ── Main ────────────────────────────────────────────────────────────
async function run() {
  console.log('');
  console.log('='.repeat(55));
  console.log('  Backfill Migration Certificates');
  console.log(DRY_RUN ? '  *** DRY RUN — no writes ***' : '  *** LIVE RUN ***');
  console.log('='.repeat(55));
  console.log('');

  await mongoose.connect(MONGO_URI);
  console.log('✓ Connected to MongoDB\n');

  const User = mongoose.model('User', userSchema);
  const Certificate = mongoose.model('Certificate', certificateSchema);

  // Find migrated users with completions
  const migratedUsers = await User.find({
    migratedFrom: 'talentlms',
    'courseCompletions.0': { $exists: true }
  }).lean();

  console.log(`Found ${migratedUsers.length} migrated users with completions\n`);

  const stats = { usersProcessed: 0, certsCreated: 0, skippedDuplicate: 0, errors: 0 };

  for (const user of migratedUsers) {
    const name = `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim() || user.email;
    console.log(`▸ ${name} (${user.email}) — ${user.courseCompletions.length} completion(s)`);

    for (const comp of user.courseCompletions) {
      const courseName = comp.courseName;
      const meta = COURSE_MAP[courseName] || DEFAULT_META;

      // Check for existing cert to avoid duplicates
      const existing = await Certificate.findOne({
        userId: user._id,
        title: courseName,
        source: 'import'
      });

      if (existing) {
        console.log(`    ⊘ SKIP (already exists): ${courseName}`);
        stats.skippedDuplicate++;
        continue;
      }

      const certData = {
        userId:            user._id,
        title:             courseName,
        provider:          'CounselorReady (via TalentLMS)',
        completionDate:    comp.completedAt || new Date(),
        ceHours:           meta.ceHours,
        category:          meta.category,
        nbccApproved:      meta.nbccApproved,
        acepNumber:        meta.acepNumber || undefined,
        approvingBody:     meta.approvingBody || undefined,
        certificateNumber: generateCertNumber(),
        source:            'import',
        notes:             `Migrated from TalentLMS (gaitp.talentlms.com). Original completion: ${comp.completedAt ? new Date(comp.completedAt).toLocaleDateString() : 'unknown'}.`
      };

      if (DRY_RUN) {
        console.log(`    ✓ WOULD CREATE: ${courseName} (${meta.ceHours} CE, ${meta.category})`);
      } else {
        try {
          const cert = new Certificate(certData);
          await cert.save();
          console.log(`    ✓ CREATED: ${courseName} (${meta.ceHours} CE) → ${cert.verificationCode}`);
          stats.certsCreated++;
        } catch (err) {
          console.log(`    ✗ ERROR: ${courseName} — ${err.message}`);
          stats.errors++;
        }
      }
    }

    stats.usersProcessed++;
  }

  console.log('');
  console.log('='.repeat(55));
  console.log('  Results');
  console.log('='.repeat(55));
  console.log(`  Users processed:     ${stats.usersProcessed}`);
  console.log(`  Certificates created: ${stats.certsCreated}`);
  console.log(`  Skipped (duplicate):  ${stats.skippedDuplicate}`);
  console.log(`  Errors:               ${stats.errors}`);
  console.log('='.repeat(55));
  console.log('');

  await mongoose.disconnect();
  console.log('Done.\n');
}

run().catch(err => {
  console.error('Backfill failed:', err);
  process.exit(1);
});
