import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

/**
 * CounselorReady — ACEP Word Count Backfill
 * NBCC ACEP Provider #7760 · GAITP LLC
 * ─────────────────────────────────────────
 * Recalculates and stores wordCount on every interactivecourses document.
 *
 * Counts text from ALL block types:
 *   text, imageText, callout, accordion, flashcardDeck, matching,
 *   cardSort, scenarioTree, multipleChoice, reflection, clinicalVignette,
 *   sectionDivider titles/subtitles, sequencing steps, timeline events,
 *   resource descriptions, references
 *
 * ACEP requirement: 6,000 words per CE credit hour (round DOWN to 0.5)
 *
 * Usage:
 *   MONGODB_URI="mongodb+srv://..." node backfillWordCount.js
 *   MONGODB_URI="..." node backfillWordCount.js --dry-run   (no DB writes)
 *   MONGODB_URI="..." node backfillWordCount.js --verbose   (per-section detail)
 */

const WORDS_PER_CE_HOUR = 6000;
const DRY_RUN = process.argv.includes('--dry-run');
const VERBOSE = process.argv.includes('--verbose');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }

function stripHtml(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function countWords(str) {
  const clean = stripHtml(str);
  if (!clean) return 0;
  return clean.split(/\s+/).filter(w => w.length > 0).length;
}

function countBlock(b) {
  if (!b || !b.type) return 0;
  let wc = 0;
  switch (b.type) {
    case 'text': case 'imageText': case 'clinicalVignette':
      wc += countWords(b.content || b.textContent || b.html || b.body || '');
      wc += countWords(b.title || '');
      break;
    case 'callout':
      wc += countWords(b.content || b.textContent || '');
      wc += countWords(b.title || '');
      (b.calloutItems || []).forEach(item => { wc += countWords(item); });
      break;
    case 'accordion':
      wc += countWords(b.title || '');
      (b.accordionItems || []).forEach(item => {
        wc += countWords(item.title || item.heading || '');
        wc += countWords(item.content || item.body || '');
      });
      break;
    case 'flashcardDeck':
      wc += countWords(b.title || '');
      (b.flashcards || []).forEach(card => {
        wc += countWords(card.front || '');
        wc += countWords(card.back || '');
      });
      break;
    case 'matching':
      wc += countWords(b.title || '');
      wc += countWords(b.matchingInstructions || '');
      (b.matchingPairs || []).forEach(pair => {
        wc += countWords(pair.term || '');
        wc += countWords(pair.definition || '');
      });
      break;
    case 'cardSort':
      wc += countWords(b.title || '');
      (b.cards || []).forEach(card => { wc += countWords(card.text || ''); });
      (b.categories || []).forEach(cat => { wc += countWords(cat); });
      break;
    case 'scenarioTree':
      wc += countWords(b.scenarioTitle || b.title || '');
      if (b.nodes && typeof b.nodes === 'object') {
        Object.values(b.nodes).forEach(node => {
          wc += countWords(node.text || node.content || '');
          (node.choices || []).forEach(choice => {
            wc += countWords(choice.text || choice.label || '');
            wc += countWords(choice.feedback || '');
          });
        });
      }
      break;
    case 'multipleChoice': case 'multiSelect': case 'trueFalse':
      wc += countWords(b.question || '');
      (b.options || []).forEach(opt => {
        wc += countWords(typeof opt === 'string' ? opt : opt.text || '');
      });
      wc += countWords(b.explanation || b.rationale || '');
      break;
    case 'reflection':
      wc += countWords(b.prompt || b.content || b.question || '');
      wc += countWords(b.title || '');
      break;
    case 'sectionDivider':
      wc += countWords(b.title || '');
      wc += countWords(b.subtitle || '');
      wc += countWords(b.description || '');
      break;
    case 'resources':
      (b.resources || b.items || []).forEach(r => {
        wc += countWords(r.title || r.label || '');
        wc += countWords(r.description || '');
      });
      break;
    case 'references':
      wc += countWords(b.content || b.textContent || b.html || '');
      (b.references || b.items || []).forEach(ref => {
        wc += countWords(typeof ref === 'string' ? ref : ref.citation || ref.text || '');
      });
      break;
    case 'sequencing':
      wc += countWords(b.title || '');
      (b.steps || []).forEach(step => { wc += countWords(step.text || ''); });
      break;
    case 'timeline':
      wc += countWords(b.title || '');
      (b.events || []).forEach(evt => {
        wc += countWords(evt.title || evt.label || '');
        wc += countWords(evt.description || evt.content || '');
      });
      break;
    default:
      wc += countWords(b.content || b.textContent || b.html || b.body || '');
      wc += countWords(b.title || '');
      break;
  }
  return wc;
}

const courseSchema = new mongoose.Schema({
  title: String, slug: String, ceHours: Number, wordCount: Number,
  sections: mongoose.Schema.Types.Mixed,
  references: mongoose.Schema.Types.Mixed,
}, { strict: false });

const Course = mongoose.model('InteractiveCourse', courseSchema, 'interactivecourses');

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB\n');
  const courses = await Course.find({}).lean();
  console.log(`Found ${courses.length} courses\n`);
  if (DRY_RUN) console.log('DRY RUN - no DB writes\n');

  let updated = 0, passing = 0, failing = 0;
  const failList = [];

  for (const course of courses) {
    let totalWc = 0;
    for (const section of (course.sections || [])) {
      let sectionWc = 0;
      (section.contentBlocks || []).forEach(b => { sectionWc += countBlock(b); });
      totalWc += sectionWc;
      if (VERBOSE) {
        const title = (section.title || `Section ${section.order}`).substring(0, 50);
        console.log(`  [${String(sectionWc.toLocaleString()).padStart(6)}w] ${title}`);
      }
    }
    if (Array.isArray(course.references)) {
      course.references.forEach(ref => {
        totalWc += countWords(typeof ref === 'string' ? ref : ref.citation || ref.text || '');
      });
    }

    const ceHours = course.ceHours || 0;
    const required = ceHours * WORDS_PER_CE_HOUR;
    const pct = required > 0 ? Math.round((totalWc / required) * 100) : 0;
    const pass = required > 0 ? totalWc >= required : null;
    const prevWc = course.wordCount || 0;
    const delta = totalWc - prevWc;
    const deltaStr = delta === 0 ? '' : ` (${delta >= 0 ? '+' : ''}${delta.toLocaleString()} vs stored)`;

    console.log(`[${pass === null ? '-' : pass ? 'PASS' : 'FAIL'}] ${course.title}`);
    console.log(`     ${totalWc.toLocaleString()} / ${required.toLocaleString()} words (${pct}%)${deltaStr}`);

    if (!pass && required > 0) {
      const shortfall = required - totalWc;
      console.log(`     SHORT ${shortfall.toLocaleString()} words`);
      failList.push({ title: course.title, slug: course.slug, ceHours, totalWc, required, shortfall });
      failing++;
    } else if (pass) { passing++; }

    if (!DRY_RUN) {
      await Course.updateOne({ _id: course._id }, { $set: { wordCount: totalWc } });
      updated++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('ACEP WORD COUNT AUDIT SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total courses : ${courses.length}`);
  console.log(`Passing       : ${passing}`);
  console.log(`Failing       : ${failing}`);
  if (!DRY_RUN) console.log(`Updated in DB : ${updated}`);
  if (failList.length > 0) {
    console.log('\nFailing courses:');
    failList.forEach(f => {
      console.log(`  ${f.title} (${f.ceHours} CE hrs)`);
      console.log(`    Has ${f.totalWc.toLocaleString()} / need ${f.required.toLocaleString()} / short ${f.shortfall.toLocaleString()}`);
      console.log(`    Est. ~${Math.ceil(f.shortfall / 800)} additional content sections`);
    });
  }
  await mongoose.disconnect();
  console.log('\nDone.');
}

main().catch(err => { console.error(err.message); process.exit(1); });
