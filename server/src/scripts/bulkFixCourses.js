/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('No MONGODB_URI'); process.exit(1); }

async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;
  const ic = db.collection('interactivecourses');

  console.log('\n' + '='.repeat(80));
  console.log('COUNSELORREADY BULK FIX SCRIPT');
  console.log('='.repeat(80) + '\n');

  // ═══════════════════════════════════════════════════════════════
  // FIX 1: Remove redundant sectionDivider titles
  // When section.title matches a sectionDivider block's title,
  // remove that sectionDivider block entirely (the section header
  // in the player already shows the section title)
  // ═══════════════════════════════════════════════════════════════
  console.log('FIX 1: Removing redundant sectionDivider blocks...\n');

  const allCourses = await ic.find({}).toArray();
  let totalDividersRemoved = 0;
  let coursesFixed = 0;

  for (const course of allCourses) {
    const sections = course.sections || [];
    let courseModified = false;

    for (let si = 0; si < sections.length; si++) {
      const section = sections[si];
      const blocks = section.contentBlocks || [];
      const sTitle = (section.title || '').trim().toLowerCase().replace(/module \d+[:\s]*/i, '').trim();

      // Find sectionDivider blocks that duplicate the section title
      const originalCount = blocks.length;
      const filtered = blocks.filter(b => {
        if (b.type !== 'sectionDivider') return true;
        const dTitle = (b.title || '').trim().toLowerCase().replace(/module \d+[:\s]*/i, '').trim();
        // Match exact, or one contains the other
        if (dTitle === sTitle) return false;
        if (sTitle && dTitle && (sTitle.includes(dTitle) || dTitle.includes(sTitle))) return false;
        return true;
      });

      if (filtered.length < originalCount) {
        const removed = originalCount - filtered.length;
        totalDividersRemoved += removed;
        courseModified = true;

        // Re-number order fields
        filtered.forEach((b, i) => { b.order = i + 1; });

        // Update in place
        sections[si].contentBlocks = filtered;
      }
    }

    if (courseModified) {
      await ic.updateOne({ _id: course._id }, { $set: { sections } });
      coursesFixed++;
      console.log(`  ✅ ${course.title} — removed dividers`);
    }
  }

  console.log(`\n  Total: ${totalDividersRemoved} redundant sectionDividers removed from ${coursesFixed} courses\n`);

  // ═══════════════════════════════════════════════════════════════
  // FIX 2: Fix CBT Toolbox — two duplicates in interactivecourses
  //   A) aca-ethics-section-a-counseling-relationship — 20,584 words (KEEP, rename)
  //   B) cbt-toolbox-core-techniques — 6,552 words (DELETE duplicate)
  // ═══════════════════════════════════════════════════════════════
  console.log('FIX 2: Fixing CBT Toolbox duplicate + slug...\n');

  const cbtGood = await ic.findOne({ slug: 'aca-ethics-section-a-counseling-relationship' });
  const cbtWeak = await ic.findOne({ slug: 'cbt-toolbox-core-techniques' });

  if (cbtGood && cbtWeak) {
    // Step 1: Remove the weaker 6,552-word duplicate
    console.log(`  Removing weaker duplicate (${cbtWeak._id}, 6552 words)...`);
    await ic.deleteOne({ _id: cbtWeak._id });
    console.log('  ✅ Deleted weaker CBT duplicate (cbt-toolbox-core-techniques, 6552 words)');

    // Also remove from legacy if it exists
    await db.collection('courses').deleteOne({ slug: 'cbt-toolbox-core-techniques' });

    // Step 2: Rename the good one
    await ic.updateOne(
      { _id: cbtGood._id },
      { $set: { slug: 'cbt-toolbox-core-techniques' } }
    );
    console.log('  ✅ Renamed: aca-ethics-section-a-counseling-relationship → cbt-toolbox-core-techniques (20584 words)');

    // Also fix in legacy
    const legacyCbt = await db.collection('courses').findOne({ slug: 'aca-ethics-section-a-counseling-relationship' });
    if (legacyCbt) {
      await db.collection('courses').updateOne(
        { _id: legacyCbt._id },
        { $set: { slug: 'cbt-toolbox-core-techniques' } }
      );
      console.log('  ✅ Also fixed slug in legacy courses collection');
    }
  } else if (cbtGood && !cbtWeak) {
    // No duplicate — just rename
    await ic.updateOne(
      { _id: cbtGood._id },
      { $set: { slug: 'cbt-toolbox-core-techniques' } }
    );
    console.log('  ✅ Renamed slug (no duplicate found)');
  } else {
    console.log('  ⚠️  CBT course with slug "aca-ethics-section-a-counseling-relationship" not found');
  }

  // ═══════════════════════════════════════════════════════════════
  // FIX 3: Fix "motivational-interviewing-art" — copy from legacy
  // to interactivecourses if it only exists in legacy
  // ═══════════════════════════════════════════════════════════════
  console.log('\nFIX 3: Checking motivational-interviewing-art...\n');

  const miInteractive = await ic.findOne({ slug: 'motivational-interviewing-art' });
  if (miInteractive) {
    console.log('  ✓ Already exists in interactivecourses');
  } else {
    const miLegacy = await db.collection('courses').findOne({ slug: 'motivational-interviewing-art' });
    if (miLegacy) {
      console.log('  ⚠️  Only in legacy courses. Title: ' + miLegacy.title);
      console.log('  ℹ️  NOTE: There is also "motivational-interviewing-from-ambivalence-to-action" in interactivecourses');
      console.log('  ℹ️  This may be a duplicate/older version. Skipping auto-migration.');
      console.log('  ℹ️  If needed, manually migrate or redirect this slug.');
    } else {
      console.log('  ❌ Not found in either collection');
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // VERIFICATION: Re-check the 3 previously broken slugs
  // ═══════════════════════════════════════════════════════════════
  console.log('\n' + '='.repeat(80));
  console.log('VERIFICATION: Slug status after fixes');
  console.log('='.repeat(80) + '\n');

  const checkSlugs = [
    'cbt-toolbox-core-techniques',
    '28-days-later-understanding-addiction-and-recovery',
    'motivational-interviewing-art',
    'motivational-interviewing-from-ambivalence-to-action'
  ];

  for (const slug of checkSlugs) {
    const inIC = await ic.findOne({ slug }, { projection: { title: 1, status: 1 } });
    const inLeg = await db.collection('courses').findOne({ slug }, { projection: { title: 1, status: 1 } });
    console.log(`  ${slug}`);
    console.log(`    interactive: ${inIC ? '✅ ' + inIC.title + ' (' + inIC.status + ')' : '❌ not found'}`);
    console.log(`    legacy:      ${inLeg ? '✅ ' + inLeg.title + ' (' + inLeg.status + ')' : '❌ not found'}`);
    console.log('');
  }

  // ═══════════════════════════════════════════════════════════════
  // QUICK STATS: Post-fix redundant title count
  // ═══════════════════════════════════════════════════════════════
  console.log('='.repeat(80));
  console.log('POST-FIX: Remaining redundant title check');
  console.log('='.repeat(80) + '\n');

  const postCourses = await ic.find({}).toArray();
  let remainingRedundant = 0;
  for (const c of postCourses) {
    for (const s of (c.sections || [])) {
      for (const b of (s.contentBlocks || [])) {
        if (b.type === 'sectionDivider' && b.title && s.title) {
          const st = s.title.trim().toLowerCase();
          const dt = b.title.trim().toLowerCase();
          if (st === dt || st.includes(dt) || dt.includes(st)) {
            remainingRedundant++;
            console.log(`  Still redundant: "${c.slug}" Section "${s.title}" / Divider "${b.title}"`);
          }
        }
      }
    }
  }
  console.log(`\n  Remaining redundant titles: ${remainingRedundant}`);

  console.log('\n✅ Bulk fix complete.\n');
  await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
