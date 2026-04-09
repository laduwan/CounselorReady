import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
await mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection.db;
const col = db.collection('interactivecourses');

function strip(s) {
  return String(s||'').replace(/<[^>]+>/g,' ').replace(/&\w+;/g,' ').replace(/\s+/g,' ').trim();
}
function wc(s) {
  const p = strip(s);
  return p ? p.split(' ').length : 0;
}

function countAllWords(course) {
  let total = 0;
  (course.sections || []).forEach(s => {
    (s.contentBlocks || []).forEach(b => {
      // Prose
      total += Math.max(wc(b.textContent), wc(b.content));
      total += wc(b.html);
      total += wc(b.body);
      // Questions, options, explanations
      total += wc(b.question);
      total += wc(b.explanation);
      if (b.options) {
        b.options.forEach(o => {
          if (typeof o === 'string') total += wc(o);
          else if (o?.text) total += wc(o.text);
        });
      }
      // Accordion
      if (b.accordionItems) {
        b.accordionItems.forEach(a => { total += wc(a.title) + wc(a.content); });
      }
      // Flashcards
      if (b.flashcards) {
        b.flashcards.forEach(fc => { total += wc(fc.front) + wc(fc.back); });
      }
      // Matching pairs
      if (b.matchingPairs) {
        b.matchingPairs.forEach(mp => { total += wc(mp.term) + wc(mp.definition); });
      }
      // Scenario tree nodes
      if (b.nodes && typeof b.nodes === 'object') {
        Object.values(b.nodes).forEach(n => { total += wc(n.text) + wc(n.prompt); });
      }
      // Card sort
      if (b.cards) {
        b.cards.forEach(cd => { total += wc(cd.text); });
      }
      // Sequencing steps
      if (b.steps) {
        b.steps.forEach(st => { total += wc(st.text); });
      }
      // Key takeaways
      if (b.takeaways) {
        b.takeaways.forEach(t => { total += wc(t); });
      }
      // Callout items
      if (b.calloutItems) {
        b.calloutItems.forEach(ci => { total += wc(ci); });
      }
      // Fill in blank
      if (b.blanks) {
        b.blanks.forEach(bl => { total += wc(bl.prompt) + wc(bl.answer); });
      }
      // Timeline events
      if (b.events) {
        b.events.forEach(ev => { total += wc(ev.text); });
      }
      // Hotspots
      if (b.hotspots) {
        b.hotspots.forEach(hs => { total += wc(hs.label) + wc(hs.info) + wc(hs.description); });
      }
    });
  });
  return total;
}

// ── FIX WORD COUNTS ──
console.log('='.repeat(60));
console.log('  RECALCULATING WORD COUNTS (all learner-visible content)');
console.log('='.repeat(60) + '\n');

const courses = await col.find({}).sort({title:1}).toArray();
let fixed = 0;

for (const c of courses) {
  const blocks = (c.sections || []).reduce((n, s) => n + (s.contentBlocks || []).length, 0);
  if (blocks === 0) {
    // Check if content is in modules[] instead of sections[]
    const mods = c.modules || [];
    const modBlocks = mods.reduce((n, m) => n + (m.contentBlocks || m.lessons || []).length, 0);
    if (modBlocks > 0) {
      console.log(`WRONG FIELD  ${(c.courseCode||'').padEnd(12)} ${(c.title||'').substring(0,50).padEnd(52)} modules:${mods.length} modBlocks:${modBlocks}`);
    } else {
      console.log(`EMPTY        ${(c.courseCode||'').padEnd(12)} ${(c.title||'').substring(0,50)}`);
    }
    continue;
  }

  const newWc = countAllWords(c);
  const oldWc = c.wordCount || 0;

  if (newWc !== oldWc) {
    await col.updateOne({ _id: c._id }, { $set: { wordCount: newWc, totalContentBlocks: blocks } });
    console.log(`FIXED  ${(c.courseCode||'').padEnd(12)} ${(c.title||'').substring(0,50).padEnd(52)} ${oldWc} → ${newWc}`);
    fixed++;
  } else {
    console.log(`OK     ${(c.courseCode||'').padEnd(12)} ${(c.title||'').substring(0,50).padEnd(52)} ${newWc}`);
  }
}

console.log(`\n✅ Done. Fixed ${fixed} of ${courses.length} courses.\n`);
await mongoose.disconnect();
