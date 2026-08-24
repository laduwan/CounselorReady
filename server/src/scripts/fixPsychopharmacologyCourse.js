/**
 * fixPsychopharmacologyCourse.js
 *
 * Diagnoses and fixes the psychopharmacology-for-counselors course (CR-501)
 * which is not loading in the viewer.
 *
 * Likely causes:
 *   - status: 'approved' instead of 'published'
 *   - accessType: 'paid' instead of 'subscription'
 *   - modules structure not converted to sections
 *
 * Usage:
 *   node src/scripts/fixPsychopharmacologyCourse.js          # diagnose only
 *   node src/scripts/fixPsychopharmacologyCourse.js --apply  # fix + write
 */

import 'dotenv/config';
import mongoose from 'mongoose';

const APPLY = process.argv.includes('--apply');
const DRY   = !APPLY;
const SLUG  = 'psychopharmacology-for-counselors';

if (!process.env.MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }

const VALID_ACCESS  = new Set(['free','subscription','purchase']);
const VALID_STATUS  = new Set(['draft','published','archived']);
const VALID_DELIVER = new Set(['async','live','hybrid']);

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('interactivecourses');

  const course = await col.findOne({ slug: SLUG });
  if (!course) { console.error('NOT FOUND: ' + SLUG); await mongoose.disconnect(); process.exit(1); }

  console.log('\n'+'='.repeat(64));
  console.log('fixPsychopharmacologyCourse — '+(DRY?'DIAGNOSE':'APPLYING FIXES'));
  console.log('='.repeat(64));
  console.log(`\nTitle:          ${course.title}`);
  console.log(`CourseCode:     ${course.courseCode}`);
  console.log(`Status:         ${course.status}  ${!VALID_STATUS.has(course.status)?'❌ INVALID':'✅'}`);
  console.log(`AccessType:     ${course.accessType}  ${!VALID_ACCESS.has(course.accessType)?'❌ INVALID':'✅'}`);
  console.log(`DeliveryFormat: ${course.deliveryFormat}  ${course.deliveryFormat && !VALID_DELIVER.has(course.deliveryFormat)?'❌ INVALID':'✅'}`);
  console.log(`IsPublished:    ${course.isPublished}`);
  console.log(`IsActive:       ${course.isActive}`);
  console.log(`Sections:       ${(course.sections||[]).length}`);
  console.log(`Modules:        ${(course.modules||[]).length}`);
  console.log(`CE Hours:       ${course.ceHours}`);
  console.log(`WordCount:      ${course.wordCount}`);
  console.log(`Assessment Qs:  ${(course.assessment?.questions||[]).length}`);

  const setPayload = {};
  const fixes = [];

  // Fix status
  if (!VALID_STATUS.has(course.status)) {
    const fixed = course.status === 'approved' ? 'published' : 'draft';
    setPayload.status = fixed;
    setPayload.isPublished = fixed === 'published';
    fixes.push(`status: '${course.status}' → '${fixed}'`);
  }

  // Fix accessType
  if (!VALID_ACCESS.has(course.accessType)) {
    const remap = { paid:'subscription', premium:'subscription', free:'free' };
    const fixed = remap[course.accessType] || 'subscription';
    setPayload.accessType = fixed;
    fixes.push(`accessType: '${course.accessType}' → '${fixed}'`);
  }

  // Fix deliveryFormat
  if (course.deliveryFormat && !VALID_DELIVER.has(course.deliveryFormat)) {
    const remap = { online:'async', asynchronous:'async', 'on-demand':'async' };
    const fixed = remap[(course.deliveryFormat||'').toLowerCase()] || 'async';
    setPayload.deliveryFormat = fixed;
    fixes.push(`deliveryFormat: '${course.deliveryFormat}' → '${fixed}'`);
  }

  // Ensure isActive
  if (!course.isActive) {
    setPayload.isActive = true;
    fixes.push('isActive: false → true');
  }

  // If modules exist but sections don't — flag for manual review
  // (conversion is complex, handle separately if needed)
  const hasSections = (course.sections||[]).length > 0;
  const hasModules  = (course.modules||[]).length > 0;
  if (!hasSections && hasModules) {
    console.log('\n⚠️  CRITICAL: Course has modules but NO sections.');
    console.log('   The viewer requires sections. Manual reseed required.');
    fixes.push('MANUAL: reseed sections from modules');
  } else {
    console.log(`\n✅ Sections structure present (${(course.sections||[]).length} sections)`);
    // Check section order fields
    let missingOrder = 0;
    (course.sections||[]).forEach(s => {
      if (s.order == null) missingOrder++;
      (s.contentBlocks||[]).forEach(b => { if (b.order == null) missingOrder++; });
    });
    if (missingOrder > 0) {
      fixes.push(`${missingOrder} missing order fields in sections/contentBlocks`);
      // Fix orders
      const fixedSections = (course.sections||[]).map((s,si) => ({
        ...s,
        order: s.order != null ? s.order : si+1,
        contentBlocks: (s.contentBlocks||[]).map((b,bi) => ({
          ...b,
          order: b.order != null ? b.order : bi+1
        }))
      }));
      setPayload.sections = fixedSections;
    }
  }

  console.log('\nFixes needed:');
  if (!fixes.length) { console.log('  None — course looks structurally OK'); }
  else fixes.forEach(f => console.log(`  • ${f}`));

  if (!APPLY || !Object.keys(setPayload).length) {
    if (DRY && fixes.length > 0) console.log('\n  Re-run with --apply to write fixes.');
    await mongoose.disconnect();
    process.exit(0);
  }

  setPayload.updatedAt = new Date();
  const r = await col.updateOne({ _id:course._id }, { $set:setPayload });
  if (r.modifiedCount === 1) {
    const rb = await col.findOne({ _id:course._id }, {
      projection:{ status:1, accessType:1, isPublished:1, isActive:1, sections:1 }
    });
    console.log('\n✅ Written. Read-back:');
    console.log(`  status: ${rb.status}, accessType: ${rb.accessType}`);
    console.log(`  isPublished: ${rb.isPublished}, isActive: ${rb.isActive}`);
    console.log(`  sections: ${(rb.sections||[]).length}`);
  } else {
    console.error('\n❌ Write failed (modifiedCount=0)');
  }

  console.log('\n'+('='.repeat(64))+'\n');
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err=>{ console.error('Fatal:',err); process.exit(1); });
