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
  
  // Get all interactive courses
  const courses = await db.collection('interactivecourses').find({}).toArray();
  
  console.log(`\n${'='.repeat(80)}`);
  console.log(`COUNSELORREADY COURSE AUDIT — ${courses.length} courses found`);
  console.log(`${'='.repeat(80)}\n`);

  const issues = [];

  for (const c of courses) {
    const courseIssues = [];
    const sections = c.sections || c.modules || [];
    
    // --- Word count ---
    let totalWords = 0;
    sections.forEach(s => {
      (s.contentBlocks || []).forEach(b => {
        const txt = b.textContent || b.content || b.html || b.body || '';
        const plain = txt.replace(/<[^>]+>/g, ' ').replace(/&\w+;/g, ' ').trim();
        if (plain) totalWords += plain.split(/\s+/).filter(w => w.length > 0).length;
      });
    });
    const requiredWords = (c.ceHours || 1) * 6000;
    const wordPct = Math.round((totalWords / requiredWords) * 100);
    
    if (totalWords < requiredWords) {
      courseIssues.push(`LOW WORDS: ${totalWords}/${requiredWords} (${wordPct}%)`);
    }

    // --- Redundant titles (section.title matches sectionDivider.title) ---
    sections.forEach((s, si) => {
      const blocks = s.contentBlocks || [];
      const dividers = blocks.filter(b => b.type === 'sectionDivider');
      dividers.forEach(d => {
        if (d.title && s.title && d.title.trim() === s.title.trim()) {
          courseIssues.push(`REDUNDANT TITLE: Section ${si+1} title="${s.title}" duplicated in sectionDivider`);
        }
        // Also check partial match (section title contains divider title or vice versa)
        if (d.title && s.title && d.title !== s.title) {
          const sLower = s.title.toLowerCase().replace(/module \d+[:\s]*/i, '').trim();
          const dLower = d.title.toLowerCase().replace(/module \d+[:\s]*/i, '').trim();
          if (sLower === dLower || s.title.includes(d.title) || d.title.includes(s.title)) {
            courseIssues.push(`NEAR-DUPLICATE TITLE: Section ${si+1} "${s.title}" vs divider "${d.title}"`);
          }
        }
      });
    });

    // --- Missing resources ---
    let hasResources = false;
    sections.forEach(s => {
      (s.contentBlocks || []).forEach(b => {
        if (b.type === 'resources' && b.resources && b.resources.length > 0) hasResources = true;
      });
    });
    if (!hasResources) courseIssues.push('NO RESOURCES BLOCK');

    // --- References check ---
    const refs = c.references || [];
    if (refs.length < 3) courseIssues.push(`LOW REFERENCES: ${refs.length} (need ≥3)`);

    // --- Assessment check ---
    const assessQ = c.assessment?.questions || [];
    if (assessQ.length < 15) courseIssues.push(`LOW EXAM QUESTIONS: ${assessQ.length} (need ≥15)`);
    if (assessQ.length === 0) courseIssues.push('NO FINAL EXAM');

    // --- Knowledge checks per section ---
    sections.forEach((s, si) => {
      const blocks = s.contentBlocks || [];
      const kcCount = blocks.filter(b => b.type === 'multipleChoice' || b.type === 'multiSelect').length;
      if (kcCount < 2) courseIssues.push(`Section ${si+1} LOW KNOWLEDGE CHECKS: ${kcCount} (need ≥2)`);
    });

    // --- Empty sections ---
    sections.forEach((s, si) => {
      const blocks = s.contentBlocks || [];
      const textBlocks = blocks.filter(b => b.type === 'text' || b.type === 'accordion' || b.type === 'imageText');
      if (textBlocks.length === 0) courseIssues.push(`Section ${si+1} NO TEXT CONTENT`);
    });

    // --- Block type inventory ---
    const blockTypes = {};
    sections.forEach(s => {
      (s.contentBlocks || []).forEach(b => {
        blockTypes[b.type] = (blockTypes[b.type] || 0) + 1;
      });
    });

    // --- Print ---
    const statusIcon = c.status === 'published' ? '🟢' : '🔴';
    console.log(`${statusIcon} ${c.title}`);
    console.log(`   Slug: ${c.slug}`);
    console.log(`   Status: ${c.status} | CE: ${c.ceHours}hr | Words: ${totalWords} (${wordPct}% of ${requiredWords})`);
    console.log(`   Sections: ${sections.length} | Assessment: ${assessQ.length}q | Refs: ${refs.length}`);
    console.log(`   Block types: ${Object.entries(blockTypes).map(([k,v]) => `${k}:${v}`).join(', ')}`);
    
    if (courseIssues.length > 0) {
      courseIssues.forEach(issue => console.log(`   ⚠️  ${issue}`));
    } else {
      console.log(`   ✅ No issues found`);
    }
    console.log('');

    issues.push({ slug: c.slug, title: c.title, status: c.status, issues: courseIssues, wordPct, sections: sections.length });
  }

  // --- Also check legacy courses collection for the 3 broken slugs ---
  console.log(`${'='.repeat(80)}`);
  console.log('CHECKING LEGACY "courses" COLLECTION FOR MISSING SLUGS');
  console.log(`${'='.repeat(80)}\n`);
  
  const missingSlugs = ['motivational-interviewing-art', '28-days-later-understanding-addiction-and-recovery', 'cbt-toolbox-core-techniques'];
  
  for (const slug of missingSlugs) {
    const inInteractive = await db.collection('interactivecourses').findOne({ slug });
    const inLegacy = await db.collection('courses').findOne({ slug });
    
    // Also try partial match
    const partialInteractive = await db.collection('interactivecourses').find({ 
      slug: { $regex: slug.split('-').slice(0, 3).join('-'), $options: 'i' }
    }).toArray();
    
    console.log(`Slug: "${slug}"`);
    console.log(`  interactivecourses: ${inInteractive ? '✅ FOUND' : '❌ NOT FOUND'}`);
    console.log(`  legacy courses: ${inLegacy ? '✅ FOUND (title: ' + inLegacy.title + ')' : '❌ NOT FOUND'}`);
    if (partialInteractive.length > 0) {
      console.log(`  Partial matches in interactivecourses:`);
      partialInteractive.forEach(p => console.log(`    → "${p.slug}" (${p.title})`));
    }
    console.log('');
  }

  // --- List ALL slugs for reference ---
  console.log(`${'='.repeat(80)}`);
  console.log('ALL INTERACTIVE COURSE SLUGS');
  console.log(`${'='.repeat(80)}\n`);
  
  const allIC = await db.collection('interactivecourses').find({}, { projection: { slug: 1, title: 1, status: 1 } }).toArray();
  allIC.sort((a, b) => a.title.localeCompare(b.title));
  allIC.forEach(c => console.log(`  ${c.status === 'published' ? '🟢' : '🔴'} ${c.slug}`));

  console.log(`\n${'='.repeat(80)}`);
  console.log('ALL LEGACY COURSE SLUGS');
  console.log(`${'='.repeat(80)}\n`);
  
  const allLeg = await db.collection('courses').find({}, { projection: { slug: 1, title: 1, status: 1 } }).toArray();
  allLeg.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
  allLeg.forEach(c => console.log(`  ${c.status === 'published' ? '🟢' : '🔴'} ${c.slug} — ${c.title}`));

  // --- Summary ---
  console.log(`\n${'='.repeat(80)}`);
  console.log('SUMMARY');
  console.log(`${'='.repeat(80)}`);
  
  const withIssues = issues.filter(i => i.issues.length > 0);
  const noIssues = issues.filter(i => i.issues.length === 0);
  console.log(`Total courses: ${issues.length}`);
  console.log(`Clean: ${noIssues.length}`);
  console.log(`With issues: ${withIssues.length}`);
  
  const issueCounts = {};
  withIssues.forEach(c => {
    c.issues.forEach(i => {
      const type = i.split(':')[0];
      issueCounts[type] = (issueCounts[type] || 0) + 1;
    });
  });
  console.log('\nIssue breakdown:');
  Object.entries(issueCounts).sort((a,b) => b[1] - a[1]).forEach(([type, count]) => {
    console.log(`  ${count}x ${type}`);
  });

  await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
