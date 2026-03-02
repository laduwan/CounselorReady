#!/usr/bin/env node
/**
 * diagnoseEnforcement.js — READ ONLY
 * 
 * Pulls one course, deep-clones it, runs enforcement on the clone,
 * reports word counts at every single step. Saves NOTHING.
 * 
 * node src/scripts/diagnoseEnforcement.js --slug=beautiful-mind
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const SLUG = process.argv.find(a => a.startsWith('--slug='))?.split('=')[1];
if (!SLUG) { console.error('Usage: node diagnoseEnforcement.js --slug=<slug>'); process.exit(1); }

function stripHtml(html) { return (html || '').replace(/<[^>]+>/g, ' ').replace(/&\w+;/g, ' ').replace(/\s+/g, ' ').trim(); }
function countWords(text) { const p = stripHtml(text); return p ? p.split(/\s+/).filter(w => w.length > 0).length : 0; }

function countBlockWords(b) {
  let w = 0;
  if (b.textContent) w += countWords(b.textContent);
  if (b.content) w += countWords(b.content);
  if (b.accordionItems) b.accordionItems.forEach(ai => { w += countWords(ai.content); });
  return w;
}

function countSectionWords(s) {
  return (s.contentBlocks || []).reduce((sum, b) => sum + countBlockWords(b), 0);
}

async function diagnose() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  const course = await db.collection('interactivecourses').findOne({ slug: { $regex: SLUG } });
  if (!course) { console.log(`❌ No course matching "${SLUG}"`); process.exit(1); }

  console.log(`\n${'═'.repeat(70)}`);
  console.log(`DIAGNOSIS: ${course.title}`);
  console.log(`${course.slug} | ${course.ceHours}CE | ${course.sections?.length} sections`);
  console.log(`${'═'.repeat(70)}\n`);

  // Work on deep clone only
  const sections = JSON.parse(JSON.stringify(course.sections || []));

  sections.forEach((s, si) => {
    console.log(`── Section ${si + 1}: "${s.title}" ──`);
    const totalBefore = countSectionWords(s);
    console.log(`   Total words BEFORE: ${totalBefore}`);
    console.log(`   Blocks: ${s.contentBlocks?.length || 0}`);
    console.log('');

    // Inventory every block
    (s.contentBlocks || []).forEach((b, bi) => {
      const w = countBlockWords(b);
      const hasTextContent = !!b.textContent;
      const hasContent = !!b.content;
      const hasAccordion = !!b.accordionItems?.length;
      console.log(`   [${bi}] type=${b.type} | ${w}w | textContent=${hasTextContent} | content=${hasContent} | accordion=${hasAccordion}`);
      
      if (b.type === 'text') {
        if (!hasTextContent && !hasContent) {
          console.log(`       ⚠️  TEXT BLOCK WITH NO CONTENT — would be removed by empty filter`);
        }
        if (hasTextContent && !hasContent) {
          console.log(`       ✅ Content in textContent field`);
        }
        if (!hasTextContent && hasContent) {
          console.log(`       ⚠️  Content in "content" field, NOT "textContent" — old filter would remove this!`);
        }
        if (hasTextContent && hasContent) {
          console.log(`       📝 Content in BOTH fields`);
        }
      }
    });

    // Simulate each enforcement step
    console.log('');
    const blocks = JSON.parse(JSON.stringify(s.contentBlocks || []));

    // Step 1: sectionDivider removal
    const step1 = blocks.filter(b => {
      if (b.type !== 'sectionDivider') return true;
      const dt = (b.title || '').toLowerCase().replace(/module \d+[:\s]*/i, '').trim();
      const st = (s.title || '').toLowerCase().replace(/module \d+[:\s]*/i, '').trim();
      return dt !== st && !dt.includes(st) && !st.includes(dt) && dt.length >= 3;
    });
    const removedDividers = blocks.length - step1.length;
    const step1Words = step1.reduce((sum, b) => sum + countBlockWords(b), 0);
    console.log(`   Step 1 (remove dividers): -${removedDividers} blocks → ${step1Words}w`);

    // Step 2: heading fixes (simulate)
    let headingsRemoved = 0;
    step1.forEach(b => {
      if (b.type !== 'text') return;
      const html = b.textContent || b.content || '';
      const BANNED = [
        'introduction', 'theoretical foundation', 'theoretical framework',
        'key concepts', 'key concepts and definitions', 'practical application',
        'practical applications', 'practical guidelines', 'overview', 'summary',
        'summary and key takeaways', 'conclusion', 'evidence base and research',
        'evidence base', 'learning objectives', 'background'
      ];
      html.replace(/<(h[2-4])([^>]*)>(.*?)<\/\1>/gi, (match, tag, attrs, content) => {
        const clean = content.replace(/<[^>]+>/g, '').trim().toLowerCase();
        if (BANNED.includes(clean)) {
          headingsRemoved++;
          console.log(`       → Would remove heading: <${tag}>${clean}</${tag}> (${countWords(content)}w)`);
        }
      });
    });
    console.log(`   Step 2 (heading fixes): ${headingsRemoved} headings would be removed`);

    // Step 3: preamble removal (simulate)
    const BANNED_PREAMBLES = [
      /in this (?:lesson|section|module),?\s+you will (?:learn|explore|discover|examine|understand|gain)/i,
      /this (?:lesson|section|module) (?:will|provides|covers|explores|examines|focuses)/i,
      /by the end of this (?:lesson|section|module)/i,
    ];
    const firstText = step1.find(b => b.type === 'text' && (b.textContent || b.content));
    if (firstText) {
      const html = firstText.textContent || firstText.content || '';
      BANNED_PREAMBLES.forEach(pattern => {
        const pRe = new RegExp(`<p[^>]*>[^<]*?${pattern.source}[^<]*?</p>`, 'gi');
        const matches = html.match(pRe);
        if (matches) {
          matches.forEach(m => {
            console.log(`       → Would remove preamble paragraph (${countWords(m)}w): "${stripHtml(m).substring(0, 80)}..."`);
          });
        }
      });
    }

    // Step 4: empty block filter (simulate with BOTH fields)
    const step4_old = step1.filter(b => {
      if (b.type === 'text' && (!b.textContent || stripHtml(b.textContent).length < 10)) return false;
      return true;
    });
    const step4_new = step1.filter(b => {
      if (b.type === 'text') {
        const hasText = (b.textContent && stripHtml(b.textContent).length >= 10) ||
                        (b.content && stripHtml(b.content).length >= 10);
        if (!hasText) return false;
      }
      return true;
    });
    const oldFilterWords = step4_old.reduce((sum, b) => sum + countBlockWords(b), 0);
    const newFilterWords = step4_new.reduce((sum, b) => sum + countBlockWords(b), 0);
    console.log(`   Step 4 (empty filter OLD logic): ${step1.length - step4_old.length} blocks removed → ${oldFilterWords}w`);
    console.log(`   Step 4 (empty filter NEW logic): ${step1.length - step4_new.length} blocks removed → ${newFilterWords}w`);

    if (oldFilterWords !== newFilterWords) {
      console.log(`   ⚠️  BUG CONFIRMED: Old filter loses ${newFilterWords - oldFilterWords}w because blocks use "content" not "textContent"`);
    }

    // Final
    console.log(`\n   RESULT: ${totalBefore}w → ${newFilterWords}w (${totalBefore === newFilterWords ? '✅ SAFE' : `⚠️ DELTA: ${newFilterWords - totalBefore}w`})`);
    console.log('');
  });

  await mongoose.disconnect();
  console.log('✅ Diagnosis complete — NOTHING was saved.\n');
}

diagnose().catch(e => { console.error('❌', e.message); process.exit(1); });
