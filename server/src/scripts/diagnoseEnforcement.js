#!/usr/bin/env node
/**
 * diagnoseEnforcement.js — READ ONLY, v5
 * Tests ALL phases on a deep clone. Saves NOTHING.
 * 
 * node src/scripts/diagnoseEnforcement.js --slug=beautiful-mind
 * node src/scripts/diagnoseEnforcement.js --all   (runs on every course)
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const SLUG = process.argv.find(a => a.startsWith('--slug='))?.split('=')[1];
const ALL = process.argv.includes('--all');
if (!SLUG && !ALL) { console.error('Usage: --slug=<slug> or --all'); process.exit(1); }

function stripHtml(html) { return (html||'').replace(/<[^>]+>/g,' ').replace(/&\w+;/g,' ').replace(/\s+/g,' ').trim(); }
function countWords(text) { const p = stripHtml(text); return p ? p.split(/\s+/).filter(w => w.length > 0).length : 0; }
function getBlockHtml(b) { return b.textContent || b.content || ''; }
function countBlockWords(b) {
  let w = 0;
  if (b.textContent) w += countWords(b.textContent);
  if (b.content) w += countWords(b.content);
  if (b.accordionItems) b.accordionItems.forEach(ai => { w += countWords(ai.content); });
  return w;
}
function countSectionWords(s) { return (s.contentBlocks||[]).reduce((sum, b) => sum + countBlockWords(b), 0); }
function countCourseWords(ss) { return (ss||[]).reduce((sum, s) => sum + countSectionWords(s), 0); }
function targetSectionCount(ce) { return ce <= 1 ? 3 : ce <= 2 ? 5 : ce <= 3 ? 6 : ce <= 4 ? 7 : ce <= 5 ? 8 : ce <= 6 ? 9 : ce <= 7 ? 11 : 12; }

const BANNED_HEADINGS = new Set([
  'introduction', 'theoretical foundation', 'theoretical framework',
  'key concepts', 'key concepts and definitions', 'practical application',
  'practical applications', 'practical guidelines', 'overview', 'summary',
  'summary and key takeaways', 'conclusion', 'evidence base and research',
  'evidence base', 'learning objectives', 'background', 'case study',
  'case studies', 'clinical implications', 'clinical applications',
  'ethical considerations', 'cultural considerations',
  'review', 'review questions', 'key terms', 'key takeaways',
  'objectives', 'what you will learn', "what you'll learn"
]);

const METADATA_RE = {
  provider: /(?:CounselorReady|NBCC|ACEP|Provider\s*#?\s*7760|GA Integrated|GAITP)/i,
  ceLine: /\d+\s*CE\s*(?:Hour|Credit|Unit)/i,
  objectives: /^\s*\d+\.\s+(?:Differentiate|Identify|Describe|Analyze|Evaluate|Apply|Demonstrate|Explain|Recognize|Compare)/im,
};

async function diagnose() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  let courses;
  if (ALL) {
    courses = await db.collection('interactivecourses').find({}).toArray();
  } else {
    courses = await db.collection('interactivecourses').find({ slug: { $regex: SLUG } }).toArray();
  }

  if (!courses.length) { console.log('❌ No courses found'); process.exit(1); }
  console.log(`\nDiagnosing ${courses.length} course(s)...\n`);

  for (const course of courses) {
    const clone = JSON.parse(JSON.stringify(course));
    const sections = clone.sections || [];
    const totalWords = countCourseWords(sections);
    const ce = clone.ceHours || 1;
    const target = ce * 6000;
    const targetSections = targetSectionCount(ce);

    console.log(`${'═'.repeat(70)}`);
    console.log(`${clone.title}`);
    console.log(`${clone.slug} | ${ce}CE | ${totalWords}w/${target}w (${Math.round(totalWords/target*100)}%) | ${sections.length}/${targetSections} sections`);
    console.log(`${'═'.repeat(70)}`);

    const issues = [];

    // Check: embedded metadata
    const firstBlock = sections[0]?.contentBlocks?.find(b => b.type === 'text' && getBlockHtml(b));
    if (firstBlock) {
      const html = getBlockHtml(firstBlock);
      const plain = stripHtml(html).substring(0, 600);
      const hasTitle = plain.toLowerCase().includes(clone.title.toLowerCase().substring(0, 20));
      const hasProvider = METADATA_RE.provider.test(plain);
      const hasCE = METADATA_RE.ceLine.test(plain);
      const hasObj = METADATA_RE.objectives.test(plain);
      if (hasTitle || hasProvider || hasCE || hasObj) {
        const flags = [hasTitle && 'TITLE', hasProvider && 'PROVIDER', hasCE && 'CE_LINE', hasObj && 'OBJECTIVES'].filter(Boolean);
        issues.push(`EMBEDDED_METADATA: ${flags.join(', ')}`);
      }
    }

    // Check: section count
    if (sections.length < targetSections) {
      issues.push(`SECTIONS: ${sections.length}/${targetSections} (needs splitting)`);
    }

    // Check: word count
    if (totalWords < target) issues.push(`WORDS: ${totalWords}/${target}`);

    // Per-section checks
    const allHeadings = [];
    sections.forEach((s, si) => {
      const blocks = s.contentBlocks || [];
      const sw = countSectionWords(s);

      // KCs
      const kc = blocks.filter(b => b.type === 'multipleChoice' || b.type === 'multiSelect').length;
      if (kc < 2) issues.push(`S${si+1} KC:${kc}/2`);

      // Missing elements
      if (!blocks.some(b => b.type === 'reflection')) issues.push(`S${si+1} NO_REFLECTION`);
      if (!blocks.some(b => b.type === 'matching')) issues.push(`S${si+1} NO_MATCHING`);
      if (si === sections.length - 1 && !blocks.some(b => b.type === 'resources' && b.resources?.length)) {
        issues.push(`NO_RESOURCES`);
      }

      // Banned headings
      blocks.filter(b => b.type === 'text').forEach(b => {
        const html = getBlockHtml(b);
        html.replace(/<h[2-4][^>]*>(.*?)<\/h[2-4]>/gi, (m, c) => {
          const clean = stripHtml(c).trim().toLowerCase();
          if (BANNED_HEADINGS.has(clean)) issues.push(`S${si+1} BANNED:"${clean}"`);
          if (clean.length > 3) allHeadings.push({ text: clean, section: si + 1 });
        });
      });

      // Content field check
      blocks.filter(b => b.type === 'text').forEach((b, bi) => {
        if (!b.textContent && b.content) issues.push(`S${si+1} B${bi} uses "content" not "textContent"`);
        if (!b.textContent && !b.content) issues.push(`S${si+1} B${bi} EMPTY`);
      });

      // Preamble check
      const ft = blocks.find(b => b.type === 'text' && getBlockHtml(b));
      if (ft) {
        const fPlain = stripHtml(getBlockHtml(ft)).substring(0, 300);
        if (/in this (?:lesson|section|module),?\s+you will/i.test(fPlain) ||
            /this (?:lesson|section|module) (?:will|provides|covers)/i.test(fPlain)) {
          issues.push(`S${si+1} PREAMBLE`);
        }
      }
    });

    // Duplicate headings
    const hCounts = {};
    allHeadings.forEach(h => { hCounts[h.text] = (hCounts[h.text]||0) + 1; });
    Object.entries(hCounts).forEach(([h, c]) => {
      if (c > 1) issues.push(`DUP_HEADING:"${h}"×${c}`);
    });

    // Assessment
    const examQ = clone.assessment?.questions?.length || 0;
    if (examQ < 15) issues.push(`EXAM:${examQ}/15`);

    // Objectives + refs
    if ((clone.objectives?.length||0) < 4) issues.push(`OBJ:${clone.objectives?.length||0}/4`);
    if ((clone.references?.length||0) < 5) issues.push(`REFS:${clone.references?.length||0}/5`);

    // Print results
    if (issues.length === 0) {
      console.log(`  ✅ All checks passed\n`);
    } else {
      issues.forEach(iss => console.log(`  ⚠️  ${iss}`));
      console.log(`  Total: ${issues.length} issues\n`);
    }
  }

  await mongoose.disconnect();
  console.log('✅ Diagnosis complete — NOTHING was saved.\n');
}

diagnose().catch(e => { console.error('❌', e.message); process.exit(1); });
