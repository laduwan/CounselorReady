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

const courses = await col.find({}).sort({title:1}).toArray();

for (const c of courses) {
  let wcTextContent = 0, wcContent = 0, wcHtml = 0, wcBody = 0;
  let wcQuestion = 0, wcOptions = 0, wcExplanation = 0;
  let wcAccordion = 0, wcOther = 0;
  let blockCount = 0;

  (c.sections || []).forEach(s => {
    (s.contentBlocks || []).forEach(b => {
      blockCount++;
      wcTextContent += wc(b.textContent);
      wcContent += wc(b.content);
      wcHtml += wc(b.html);
      wcBody += wc(b.body);
      wcQuestion += wc(b.question);
      wcExplanation += wc(b.explanation);
      if (b.options) {
        b.options.forEach(o => {
          if (typeof o === 'string') wcOptions += wc(o);
          else if (o?.text) wcOptions += wc(o.text);
        });
      }
      if (b.accordionItems) {
        b.accordionItems.forEach(a => { wcAccordion += wc(a.title) + wc(a.content); });
      }
      if (b.flashcards) {
        b.flashcards.forEach(fc => { wcOther += wc(fc.front) + wc(fc.back); });
      }
      if (b.matchingPairs) {
        b.matchingPairs.forEach(mp => { wcOther += wc(mp.term) + wc(mp.definition); });
      }
      if (b.nodes && typeof b.nodes === 'object') {
        Object.values(b.nodes).forEach(n => { wcOther += wc(n.text) + wc(n.prompt); });
      }
      if (b.cards) {
        b.cards.forEach(cd => { wcOther += wc(cd.text); });
      }
      if (b.steps) {
        b.steps.forEach(st => { wcOther += wc(st.text); });
      }
      if (b.takeaways) {
        b.takeaways.forEach(t => { wcOther += wc(t); });
      }
      if (b.resources) {
        b.resources.forEach(r => { wcOther += wc(r.title); });
      }
    });
  });

  // Max of textContent vs content (they often duplicate)
  const proseWords = Math.max(wcTextContent, wcContent);
  const totalAll = proseWords + wcQuestion + wcOptions + wcExplanation + wcAccordion + wcOther;
  const stored = c.wordCount || 0;

  const code = (c.courseCode || '').padEnd(12);
  const title = (c.title || '').substring(0, 50).padEnd(52);

  if (totalAll === 0 && blockCount === 0) {
    console.log(`EMPTY  ${code} ${title} blocks:0`);
  } else {
    const diff = totalAll - stored;
    const flag = Math.abs(diff) > 500 ? ' ← MISMATCH' : '';
    console.log(`${code} ${title} stored:${stored.toString().padStart(6)} | prose:${proseWords.toString().padStart(6)} q/opt/exp:${(wcQuestion+wcOptions+wcExplanation).toString().padStart(5)} accordion:${wcAccordion.toString().padStart(5)} other:${wcOther.toString().padStart(5)} | TOTAL:${totalAll.toString().padStart(6)}${flag}`);
  }
}

await mongoose.disconnect();
