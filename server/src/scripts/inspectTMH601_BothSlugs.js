/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */

/**
 * inspectTMH601_BothSlugs.js
 * ─────────────────────────
 * READ-ONLY diagnostic. Prints a field-by-field comparison of the two
 * TMH601 course documents so we can decide exactly what to copy vs. preserve
 * when we sync clean-slug content into the mkkycoyo URL.
 *
 *   cd ~/project/src/server
 *   node src/scripts/inspectTMH601_BothSlugs.js
 *
 * Does NOT modify anything. Safe to run repeatedly.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in env');
  process.exit(1);
}

const MKKYCOYO_SLUG = 'mastering-telemental-health-an-essential-guide-to-a-compliant-virtual-healthcare-practice-in-georgia-mkkycoyo';
const CLEAN_SLUG = 'mastering-telemental-health';

// Field categories — these drive both the inspector display and (later) the
// sync script's "copy vs. preserve" logic.
const IDENTITY_FIELDS = ['_id', 'slug', 'title', 'createdAt', 'updatedAt', 'courseCode', 'status', 'isPublished', 'isActive', 'publishedAt'];
const HEADER_FIELDS = ['thumbnail', 'headerImage', 'headerImageAlt', 'headerTitle', 'headerSubtitle'];
const BILLING_FIELDS = ['price', 'pricingTier', 'accessType'];
const CONTENT_FIELDS = ['description', 'objectives', 'references', 'resources', 'tags', 'categories', 'targetAudience', 'nbccContentAreas', 'acaCodeSections'];
const CE_FIELDS = ['ceHours', 'ceProvider', 'acepNumber', 'approvalBody', 'approvingBody', 'approvalNumber', 'ceCategory', 'contentArea', 'ceuHours', 'credits', 'level', 'deliveryMethod', 'deliveryFormat'];
const DELIVERY_FIELDS = ['minimumTimeMinutes', 'dripEnabled', 'dripIntervalMinutes', 'dripSectionsPerInterval', 'enforceSectionOrder', 'previousSectionsReviewable', 'narrationEnabled', 'attestationRequired', 'certificateEnabled', 'maxAttempts', 'passingScore'];
const PRESENTER_FIELDS = ['presenter', 'author', 'instructor'];
const ROLLUP_FIELDS = ['totalEstimatedTime', 'totalContentBlocks', 'totalQuizQuestions', 'wordCount'];

function safePreview(v, max = 80) {
  if (v === null || v === undefined) return String(v);
  if (typeof v === 'boolean' || typeof v === 'number') return String(v);
  if (v instanceof Date) return v.toISOString();
  if (Array.isArray(v)) return `Array[${v.length}]`;
  if (typeof v === 'object') {
    if (v._bsontype === 'ObjectID') return v.toString();
    const keys = Object.keys(v);
    return `Object{${keys.slice(0, 5).join(', ')}${keys.length > 5 ? ', …' : ''}}`;
  }
  const s = String(v);
  return s.length > max ? s.slice(0, max) + '…' : s;
}

function fmt(label, val) {
  const v = safePreview(val);
  return `    ${label.padEnd(28)} ${v}`;
}

async function main() {
  console.log('═'.repeat(78));
  console.log('  CR-TMH601 SLUG COMPARISON — read-only inspector');
  console.log('═'.repeat(78));

  await mongoose.connect(MONGODB_URI);
  console.log('✓ Connected to MongoDB\n');
  const db = mongoose.connection.db;
  const collection = db.collection('interactivecourses');

  const mkky = await collection.findOne({ slug: MKKYCOYO_SLUG });
  const clean = await collection.findOne({ slug: CLEAN_SLUG });

  if (!mkky) console.log('⚠ mkkycoyo slug NOT FOUND');
  if (!clean) console.log('⚠ clean slug NOT FOUND');
  if (!mkky || !clean) {
    await mongoose.disconnect();
    return;
  }

  // ── Sections side-by-side ──
  console.log('━'.repeat(78));
  console.log('SECTIONS — what each slug actually contains');
  console.log('━'.repeat(78));
  console.log(`\n  mkkycoyo (${mkky.sections?.length || 0} sections):`);
  (mkky.sections || []).forEach((s, i) => {
    const blocks = s.contentBlocks?.length || 0;
    const trees = (s.contentBlocks || []).filter(b => b.type === 'scenarioTree').length;
    const workingTrees = (s.contentBlocks || []).filter(b =>
      b.type === 'scenarioTree' && b.scenarioTitle && b.startNode && b.nodes && !Array.isArray(b.nodes)
    ).length;
    console.log(`    §${i + 1}. ${(s.title || '(no title)').slice(0, 60).padEnd(60)} blocks:${String(blocks).padStart(3)} scenarioTrees:${trees}(${workingTrees} working)`);
  });
  console.log(`\n  clean slug (${clean.sections?.length || 0} sections):`);
  (clean.sections || []).forEach((s, i) => {
    const blocks = s.contentBlocks?.length || 0;
    const trees = (s.contentBlocks || []).filter(b => b.type === 'scenarioTree').length;
    const workingTrees = (s.contentBlocks || []).filter(b =>
      b.type === 'scenarioTree' && b.scenarioTitle && b.startNode && b.nodes && !Array.isArray(b.nodes)
    ).length;
    console.log(`    §${i + 1}. ${(s.title || '(no title)').slice(0, 60).padEnd(60)} blocks:${String(blocks).padStart(3)} scenarioTrees:${trees}(${workingTrees} working)`);
  });

  // ── Field comparison ──
  const sections = [
    ['IDENTITY (preserve mkkycoyo)',         IDENTITY_FIELDS],
    ['HEADER / PRESENTATION (likely preserve mkkycoyo)', HEADER_FIELDS],
    ['BILLING (likely preserve mkkycoyo)',   BILLING_FIELDS],
    ['CONTENT FIELDS (copy from clean)',     CONTENT_FIELDS],
    ['CE / APPROVAL (likely copy from clean)', CE_FIELDS],
    ['DELIVERY RULES',                       DELIVERY_FIELDS],
    ['PRESENTER',                            PRESENTER_FIELDS],
    ['ROLLUP CALCULATED (auto-recomputed)',  ROLLUP_FIELDS],
  ];

  for (const [label, fields] of sections) {
    console.log('\n' + '━'.repeat(78));
    console.log(label);
    console.log('━'.repeat(78));
    for (const field of fields) {
      const m = mkky[field];
      const c = clean[field];
      const mPreview = safePreview(m);
      const cPreview = safePreview(c);
      const match = JSON.stringify(m) === JSON.stringify(c);
      const flag = match ? '   ' : ' ≠ ';
      console.log(`  ${field}`);
      console.log(`    mkkycoyo:  ${mPreview}`);
      console.log(`    clean:    ${flag}${cPreview}`);
    }
  }

  // ── Approvals array detailed ──
  console.log('\n' + '━'.repeat(78));
  console.log('APPROVALS ARRAY (governs certificate template binding)');
  console.log('━'.repeat(78));
  console.log('\n  mkkycoyo.approvals:');
  (mkky.approvals || []).forEach((a, i) => {
    console.log(`    [${i}] body=${a.body}  providerNumber=${a.providerNumber}  status=${a.status}  deliveryFormat=${a.deliveryFormat}`);
    (a.hourBreakdown || []).forEach(h => console.log(`         - ${h.label}: ${h.hours} hours`));
  });
  console.log('\n  clean.approvals:');
  (clean.approvals || []).forEach((a, i) => {
    console.log(`    [${i}] body=${a.body}  providerNumber=${a.providerNumber}  status=${a.status}  deliveryFormat=${a.deliveryFormat}`);
    (a.hourBreakdown || []).forEach(h => console.log(`         - ${h.label}: ${h.hours} hours`));
  });

  // ── Settings (catch-all mixed field) ──
  console.log('\n' + '━'.repeat(78));
  console.log('SETTINGS (mixed field — may contain Stripe IDs or anything else)');
  console.log('━'.repeat(78));
  console.log('\n  mkkycoyo.settings:');
  console.log('   ', JSON.stringify(mkky.settings || null, null, 2).split('\n').join('\n    '));
  console.log('\n  clean.settings:');
  console.log('   ', JSON.stringify(clean.settings || null, null, 2).split('\n').join('\n    '));

  // ── Look for any non-schema fields actually present (might hold Stripe IDs) ──
  console.log('\n' + '━'.repeat(78));
  console.log('ALL TOP-LEVEL FIELDS PRESENT (catch anything the schema-walk missed)');
  console.log('━'.repeat(78));
  const allKnown = new Set([...IDENTITY_FIELDS, ...HEADER_FIELDS, ...BILLING_FIELDS, ...CONTENT_FIELDS, ...CE_FIELDS, ...DELIVERY_FIELDS, ...PRESENTER_FIELDS, ...ROLLUP_FIELDS, 'sections', 'assessment', 'approvals', 'settings', 'prerequisites', '__v']);
  const mkkyKeys = Object.keys(mkky);
  const cleanKeys = Object.keys(clean);
  const mkkyExtra = mkkyKeys.filter(k => !allKnown.has(k));
  const cleanExtra = cleanKeys.filter(k => !allKnown.has(k));
  console.log('\n  mkkycoyo extra top-level fields:', mkkyExtra.length ? mkkyExtra : '(none)');
  mkkyExtra.forEach(k => console.log(`    ${k}: ${safePreview(mkky[k], 150)}`));
  console.log('\n  clean extra top-level fields:', cleanExtra.length ? cleanExtra : '(none)');
  cleanExtra.forEach(k => console.log(`    ${k}: ${safePreview(clean[k], 150)}`));

  // ── Enrollment / progress count check ──
  console.log('\n' + '━'.repeat(78));
  console.log('ENROLLMENT & PROGRESS COUNTS');
  console.log('━'.repeat(78));
  const progressCol = db.collection('interactivecourseprogresses');
  const mkkyProgress = await progressCol.countDocuments({ courseId: mkky._id });
  const mkkyInProgress = await progressCol.countDocuments({ courseId: mkky._id, 'sectionProgress.status': 'in_progress' });
  const mkkyCompleted = await progressCol.countDocuments({ courseId: mkky._id, status: 'completed' });
  const cleanProgress = await progressCol.countDocuments({ courseId: clean._id });
  const cleanInProgress = await progressCol.countDocuments({ courseId: clean._id, 'sectionProgress.status': 'in_progress' });
  const cleanCompleted = await progressCol.countDocuments({ courseId: clean._id, status: 'completed' });
  console.log(`\n  mkkycoyo: ${mkkyProgress} progress records  (in_progress: ${mkkyInProgress}, completed: ${mkkyCompleted})`);
  console.log(`  clean:    ${cleanProgress} progress records  (in_progress: ${cleanInProgress}, completed: ${cleanCompleted})`);

  // ── Look for any Product / Stripe binding in a separate collection ──
  console.log('\n' + '━'.repeat(78));
  console.log('SEPARATE STRIPE / PRODUCT BINDINGS (if any collections reference courseId)');
  console.log('━'.repeat(78));
  const allCollections = await db.listCollections().toArray();
  const candidateCols = allCollections.map(c => c.name).filter(n =>
    /product|stripe|price|subscription|enrollment/i.test(n)
  );
  if (!candidateCols.length) {
    console.log('  No separate product/stripe/subscription collections found.');
  } else {
    for (const colName of candidateCols) {
      const col = db.collection(colName);
      const mkkyRefs = await col.countDocuments({ courseId: mkky._id });
      const cleanRefs = await col.countDocuments({ courseId: clean._id });
      console.log(`  ${colName}: mkkycoyo refs=${mkkyRefs}, clean refs=${cleanRefs}`);
      if (mkkyRefs > 0) {
        const sample = await col.findOne({ courseId: mkky._id });
        console.log(`    sample mkkycoyo doc:`, JSON.stringify(sample, null, 2).slice(0, 600));
      }
      if (cleanRefs > 0) {
        const sample = await col.findOne({ courseId: clean._id });
        console.log(`    sample clean doc:`, JSON.stringify(sample, null, 2).slice(0, 600));
      }
    }
  }

  // ── Certificates issued for this course ──
  console.log('\n' + '━'.repeat(78));
  console.log('CERTIFICATES ISSUED (for back-compat reference)');
  console.log('━'.repeat(78));
  const allCols = allCollections.map(c => c.name);
  const certCol = allCols.find(n => /^certificates?$/i.test(n));
  if (certCol) {
    const col = db.collection(certCol);
    const mkkyCerts = await col.countDocuments({ courseId: mkky._id });
    const cleanCerts = await col.countDocuments({ courseId: clean._id });
    console.log(`  ${certCol}: mkkycoyo certs=${mkkyCerts}, clean certs=${cleanCerts}`);
    if (mkkyCerts > 0) {
      const sampleCert = await col.findOne({ courseId: mkky._id });
      const certKeys = Object.keys(sampleCert).filter(k => /template|design|format/i.test(k));
      console.log(`    Cert template-related fields on a mkkycoyo cert:`, certKeys.length ? certKeys.map(k => `${k}=${safePreview(sampleCert[k])}`) : '(none — template likely computed at issuance from course data)');
    }
  } else {
    console.log('  (no certificates collection located by name pattern)');
  }

  await mongoose.disconnect();
  console.log('\n═'.repeat(78));
  console.log('  DONE. No writes performed.');
  console.log('═'.repeat(78));
}

main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
