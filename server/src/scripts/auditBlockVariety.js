// auditBlockVariety.js — Read-only diagnostic: block type variety across all courses
// Run: node src/scripts/auditBlockVariety.js (from server/)

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }

const KC_TYPES = new Set(['multipleChoice', 'multiSelect', 'matching', 'fillInBlank']);
const ACTIVITY_TYPES = new Set(['flashcardDeck', 'scenarioTree', 'cardSort', 'sequencing', 'timeline', 'hotspot']);
const MEDIA_TYPES = new Set(['videoEmbed', 'video', 'imageText', 'image', 'resources']);
const WRONG_TYPES = new Set(['multiple_choice', 'quiz', 'knowledgeCheck', 'text_block']);

async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;
  const courses = await db.collection('interactivecourses').find({}).toArray();

  console.log(`\n═══ CounselorReady Block Variety Audit ═══`);
  console.log(`Courses found: ${courses.length}\n`);

  const results = [];

  for (const course of courses) {
    const sections = course.sections || [];
    const allBlocks = sections.flatMap(s => s.contentBlocks || []);
    const totalBlocks = allBlocks.length;

    // Count by type
    const typeCounts = {};
    const wrongFound = [];
    let textCount = 0;
    const kcVariety = new Set();
    const activityVariety = new Set();
    const mediaFound = new Set();

    for (const block of allBlocks) {
      const t = block.type || 'unknown';
      typeCounts[t] = (typeCounts[t] || 0) + 1;

      if (t === 'text') textCount++;
      if (KC_TYPES.has(t)) kcVariety.add(t);
      if (ACTIVITY_TYPES.has(t)) activityVariety.add(t);
      if (MEDIA_TYPES.has(t)) mediaFound.add(t);
      if (WRONG_TYPES.has(t)) wrongFound.push(t);

      // Check for flat string options (common error)
      if (block.options?.length && typeof block.options[0] === 'string') {
        wrongFound.push('flat_options');
      }
    }

    // Assessment check
    const assessQs = course.assessment?.questions?.length || 0;
    const refs = course.references?.length || 0;

    // Per-section detail
    const sectionIssues = [];
    for (const [i, sec] of sections.entries()) {
      const blocks = sec.contentBlocks || [];
      const types = blocks.map(b => b.type);
      const secKC = types.filter(t => KC_TYPES.has(t));
      const secAct = types.filter(t => ACTIVITY_TYPES.has(t));
      const secMedia = types.filter(t => MEDIA_TYPES.has(t));
      const hasDivider = types.includes('sectionDivider');
      const hasReflection = types.includes('reflection');
      const hasAccordion = types.includes('accordion');
      const hasCallout = types.includes('callout');
      const hasKeyTakeaway = types.includes('keyTakeaway');

      const missing = [];
      if (!hasDivider) missing.push('sectionDivider');
      if (secKC.length < 2) missing.push(`KC(${secKC.length}/2)`);
      if (secAct.length < 1 && i > 0 && i < sections.length - 1) missing.push('activity');
      if (!hasReflection) missing.push('reflection');
      if (!hasAccordion && i > 0 && i < sections.length - 1) missing.push('accordion');
      if (!hasCallout && i > 0 && i < sections.length - 1) missing.push('callout');
      if (!hasKeyTakeaway) missing.push('keyTakeaway');

      if (missing.length) {
        sectionIssues.push({ section: i + 1, title: sec.title || `Section ${i + 1}`, missing });
      }
    }

    // Status determination
    const textPct = totalBlocks > 0 ? Math.round((textCount / totalBlocks) * 100) : 0;
    const uniqueWrong = [...new Set(wrongFound)];
    let status;
    if (kcVariety.size >= 3 && activityVariety.size >= 2 && mediaFound.size >= 2) {
      status = '🟢 RICH';
    } else if (kcVariety.size >= 2 || activityVariety.size >= 1) {
      status = '🟡 PARTIAL';
    } else {
      status = '🔴 THIN';
    }

    results.push({
      code: course.courseCode || course.slug || '(no code)',
      title: (course.title || '').substring(0, 45),
      ceHours: course.ceHours || course.ceuHours || '?',
      status,
      sections: sections.length,
      totalBlocks,
      textPct,
      kcVariety: [...kcVariety].join(', ') || 'none',
      kcCount: kcVariety.size,
      activityVariety: [...activityVariety].join(', ') || 'none',
      actCount: activityVariety.size,
      media: [...mediaFound].join(', ') || 'none',
      mediaCount: mediaFound.size,
      wrongTypes: uniqueWrong.join(', ') || '—',
      assessQs,
      refs,
      sectionIssues,
      isPublished: course.isPublished || false,
      slug: course.slug
    });
  }

  // Sort: THIN first, then PARTIAL, then RICH
  const order = { '🔴 THIN': 0, '🟡 PARTIAL': 1, '🟢 RICH': 2 };
  results.sort((a, b) => (order[a.status] ?? 3) - (order[b.status] ?? 3));

  // Print summary table
  console.log('Code'.padEnd(16) + 'Status'.padEnd(12) + 'CE'.padEnd(4) + 'Sec'.padEnd(5) +
    'Blks'.padEnd(6) + 'Txt%'.padEnd(6) + 'KC Types'.padEnd(10) + 'Activities'.padEnd(12) +
    'Media'.padEnd(8) + 'Exam'.padEnd(6) + 'Refs'.padEnd(6) + 'Wrong Types');
  console.log('─'.repeat(105));

  for (const r of results) {
    console.log(
      r.code.padEnd(16) +
      r.status.padEnd(12) +
      String(r.ceHours).padEnd(4) +
      String(r.sections).padEnd(5) +
      String(r.totalBlocks).padEnd(6) +
      (r.textPct + '%').padEnd(6) +
      String(r.kcCount).padEnd(10) +
      String(r.actCount).padEnd(12) +
      String(r.mediaCount).padEnd(8) +
      String(r.assessQs).padEnd(6) +
      String(r.refs).padEnd(6) +
      r.wrongTypes
    );
  }

  // Print THIN courses needing enrichment
  const thin = results.filter(r => r.status === '🔴 THIN');
  const partial = results.filter(r => r.status === '🟡 PARTIAL');

  if (thin.length) {
    console.log(`\n\n═══ 🔴 COURSES NEEDING FULL ENRICHMENT (${thin.length}) ═══\n`);
    for (const r of thin) {
      console.log(`  ${r.code} — ${r.title} (${r.ceHours}CE, ${r.totalBlocks} blocks, ${r.textPct}% text)`);
      console.log(`    KC: ${r.kcVariety} | Activities: ${r.activityVariety} | Media: ${r.media}`);
      if (r.wrongTypes !== '—') console.log(`    ⚠️  Wrong types: ${r.wrongTypes}`);
      if (r.sectionIssues.length) {
        for (const si of r.sectionIssues.slice(0, 3)) {
          console.log(`    Section ${si.section}: missing ${si.missing.join(', ')}`);
        }
        if (r.sectionIssues.length > 3) console.log(`    ... and ${r.sectionIssues.length - 3} more sections with issues`);
      }
      console.log();
    }
  }

  if (partial.length) {
    console.log(`\n═══ 🟡 COURSES NEEDING MEDIA/VARIETY BOOST (${partial.length}) ═══\n`);
    for (const r of partial) {
      console.log(`  ${r.code} — ${r.title} (${r.ceHours}CE)`);
      console.log(`    Has: KC(${r.kcVariety}), Act(${r.activityVariety}), Media(${r.media})`);
      if (r.wrongTypes !== '—') console.log(`    ⚠️  Wrong types: ${r.wrongTypes}`);
      console.log();
    }
  }

  const rich = results.filter(r => r.status === '🟢 RICH');
  console.log(`\n═══ SUMMARY ═══`);
  console.log(`  🔴 THIN:    ${thin.length} courses need full enrichment`);
  console.log(`  🟡 PARTIAL: ${partial.length} courses need media/variety boost`);
  console.log(`  🟢 RICH:    ${rich.length} courses meet variety requirements`);
  console.log(`  Total:      ${results.length} courses\n`);

  await mongoose.disconnect();
}

main().catch(e => { console.error(e.message); process.exit(1); });
