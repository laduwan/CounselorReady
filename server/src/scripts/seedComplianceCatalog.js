/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */

/**
 * seedComplianceCatalog — idempotent upsert of Practice Compliance catalog
 * metadata (ComplianceCourseMeta) and global TrainingTrack templates.
 *
 * UPSERT-ONLY. Performs NO deletes. Safe to re-run (no duplicate tracks/courses).
 * Does NOT author course CONTENT and does NOT flip ceEligible (owner CE gate).
 *
 * NOT run automatically. Invoke explicitly:
 *   node server/src/scripts/seedComplianceCatalog.js
 *
 * Re-running is idempotent: ComplianceCourseMeta is keyed by `code`; global
 * TrainingTracks are keyed by (orgId:null, name).
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ComplianceCourseMeta from '../models/ComplianceCourseMeta.js';
import TrainingTrack from '../models/TrainingTrack.js';
import { COMPLIANCE_CATALOG } from '../data/complianceCatalog.js';
import { GLOBAL_TRACKS } from '../data/complianceTracks.js';

dotenv.config();

export async function seedComplianceCatalog() {
  let courses = 0;
  let tracks = 0;

  for (const c of COMPLIANCE_CATALOG) {
    await ComplianceCourseMeta.updateOne(
      { code: c.code },
      { $set: c },
      { upsert: true }
    );
    courses++;
  }

  for (const t of GLOBAL_TRACKS) {
    await TrainingTrack.updateOne(
      { orgId: null, name: t.name },
      { $set: { ...t, orgId: null, active: true } },
      { upsert: true }
    );
    tracks++;
  }

  return { courses, tracks };
}

// Run directly (node server/src/scripts/seedComplianceCatalog.js)
const isDirect = process.argv[1] && process.argv[1].endsWith('seedComplianceCatalog.js');
if (isDirect) {
  (async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      const result = await seedComplianceCatalog();
      console.log(`✅ Compliance catalog seeded (idempotent): ${result.courses} courses, ${result.tracks} global tracks`);
      await mongoose.connection.close();
      process.exit(0);
    } catch (err) {
      console.error('❌ Seed failed:', err);
      process.exit(1);
    }
  })();
}

export default seedComplianceCatalog;
