import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('No MONGODB_URI'); process.exit(1); }

async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;

  const icCourses = await db.collection('interactivecourses').find({}).toArray();

  console.log('═'.repeat(100));
  console.log('COUNSELORREADY — COURSE COMPLETENESS AUDIT');
  console.log(`Date: ${new Date().toISOString().split('T')[0]} | Courses: ${icCourses.length}`);
  console.log('═'.repeat(100));

  const results = [];

  for (const course of icCourses) {
    const r = {
      title: course.title || 'UNTITLED',
      slug: course.slug || 'NO-SLUG',
      status: course.status || (course.isPublished ? 'published' : 'draft'),
      ceHours: course.ceHours || course.ceuHours || course.creditHours || 0,
      contentArea: course.contentArea || course.category || '',
      sections: 0,
      wordCount: 0,
      requiredWords: 0,
      wordPct: 0,
      kcCount: 0,
      examQs: 0,
      refs: 0,
      objectives: (course.objectives || []).length,
      targetAudience: (course.targetAudience || []).length > 0,
      presenter: !!(course.presenter?.name || course.acepProvider?.name),
      interactiveTypes: new Set(),
      issues: [],
      score: 0
    };

    r.requiredWords = r.ceHours * 6000;
    const sections = course.sections || [];
    r.sections = sections.length;

    // Count words + blocks
    let totalWords = 0;
    for (const section of sections) {
      for (const block of (section.contentBlocks || [])) {
        // Words
        if (block.type === 'text' || block.type === 'imageText') {
          const text = (block.content || block.textContent || '').replace(/<[^>]+>/g, ' ').trim();
          totalWords += text.split(/\s+/).filter(w => w.length > 0).length;
        }
        // Track interactive types
        if (['multipleChoice','multiSelect','matching','cardSort','sequencing',
             'flashcardDeck','scenarioTree','reflection','hotspot','accordion'].includes(block.type)) {
          r.interactiveTypes.add(block.type);
        }
        // KCs
        if (['multipleChoice','multiSelect','matching'].includes(block.type)) {
          r.kcCount++;
        }
      }
    }
    r.wordCount = totalWords;
    r.wordPct = r.requiredWords > 0 ? Math.round((totalWords / r.requiredWords) * 100) : 0;

    // Assessment
    if (course.assessment?.questions?.length) {
      r.examQs = course.assessment.questions.length;
    }
    // Check last section for exam blocks
    if (sections.length > 0) {
      const last = sections[sections.length - 1];
      const examBlocks = (last.contentBlocks || []).filter(b =>
        (b.type === 'multipleChoice' || b.type === 'multiSelect') && b.isExam
      );
      if (examBlocks.length > r.examQs) r.examQs = examBlocks.length;
    }

    // References
    r.refs = (course.references || []).length;

    // ── SCORING (out of 100) ──
    // Words: 35 pts
    r.score += Math.min(35, Math.round((r.wordPct / 100) * 35));
    // Exam: 20 pts (15+ = full)
    r.score += Math.min(20, Math.round((Math.min(r.examQs, 15) / 15) * 20));
    // KCs: 15 pts (1+ per section = full)
    const kcTarget = Math.max(r.sections - 1, 1);
    r.score += Math.min(15, Math.round((Math.min(r.kcCount, kcTarget) / kcTarget) * 15));
    // References: 10 pts (15+ = full)
    r.score += Math.min(10, Math.round((Math.min(r.refs, 15) / 15) * 10));
    // Objectives: 10 pts (4+ = full)
    r.score += Math.min(10, Math.round((Math.min(r.objectives, 4) / 4) * 10));
    // Metadata: 10 pts
    if (r.targetAudience) r.score += 4;
    if (r.presenter) r.score += 3;
    if (r.contentArea) r.score += 3;

    // ── ISSUES ──
    if (r.wordCount < r.requiredWords * 0.5) r.issues.push('🔴 WORDS: ' + r.wordCount + '/' + r.requiredWords + ' (' + r.wordPct + '%)');
    else if (r.wordCount < r.requiredWords) r.issues.push('🟡 WORDS: ' + r.wordCount + '/' + r.requiredWords + ' (' + r.wordPct + '%)');
    if (r.examQs === 0) r.issues.push('🔴 NO EXAM');
    else if (r.examQs < 15) r.issues.push('🟡 EXAM: ' + r.examQs + '/15');
    if (r.kcCount === 0) r.issues.push('🔴 NO KCs');
    else if (r.kcCount < r.sections) r.issues.push('🟡 KCs: ' + r.kcCount + ' (need ~' + r.sections + ')');
    if (r.refs === 0) r.issues.push('🔴 NO REFS');
    else if (r.refs < 15) r.issues.push('🟡 REFS: ' + r.refs + '/15');
    if (r.objectives === 0) r.issues.push('🔴 NO OBJECTIVES');
    if (!r.targetAudience) r.issues.push('🟡 NO TARGET AUDIENCE');

    r.interactiveTypes = [...r.interactiveTypes];
    results.push(r);
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  // ── TIER DISPLAY ──
  const tiers = [
    { label: '🟢 READY TO PUBLISH (90-100)', min: 90, courses: [] },
    { label: '🟡 NEAR COMPLETE (70-89)', min: 70, courses: [] },
    { label: '🟠 NEEDS WORK (40-69)', min: 40, courses: [] },
    { label: '🔴 MAJOR GAPS (<40)', min: 0, courses: [] }
  ];

  for (const r of results) {
    for (const tier of tiers) {
      if (r.score >= tier.min) { tier.courses.push(r); break; }
    }
  }

  for (const tier of tiers) {
    if (tier.courses.length === 0) continue;
    console.log('\n' + '─'.repeat(100));
    console.log(tier.label + ' (' + tier.courses.length + ' courses)');
    console.log('─'.repeat(100));
    for (const r of tier.courses) {
      const bar = '█'.repeat(Math.round(r.score / 5)) + '░'.repeat(20 - Math.round(r.score / 5));
      console.log(`\n  ${bar} ${r.score}/100  ${r.title}`);
      console.log(`  ${r.ceHours}CE | ${r.sections} sections | ${r.wordCount.toLocaleString()} words (${r.wordPct}%) | ${r.kcCount} KCs | ${r.examQs} exam Qs | ${r.refs} refs | ${r.objectives} obj`);
      console.log(`  Status: ${r.status} | Content: ${r.contentArea || 'unset'} | Interactive: ${r.interactiveTypes.join(', ') || 'none'}`);
      if (r.issues.length > 0) console.log(`  Issues: ${r.issues.join(' | ')}`);
    }
  }

  // ── SUMMARY ──
  console.log('\n' + '═'.repeat(100));
  console.log('SUMMARY');
  console.log('═'.repeat(100));
  console.log(`  Total courses: ${results.length}`);
  console.log(`  Ready to publish: ${tiers[0].courses.length}`);
  console.log(`  Near complete: ${tiers[1].courses.length}`);
  console.log(`  Needs work: ${tiers[2].courses.length}`);
  console.log(`  Major gaps: ${tiers[3].courses.length}`);
  console.log(`  Total words: ${results.reduce((s,r) => s + r.wordCount, 0).toLocaleString()}`);
  console.log(`  Total CE hours: ${results.reduce((s,r) => s + r.ceHours, 0)}`);
  console.log('═'.repeat(100));

  await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
