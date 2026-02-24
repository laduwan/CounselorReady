import mongoose from 'mongoose';

const WORDS_PER_CE_HOUR = 6000;

function sc(text) {
  if (!text || typeof text !== 'string') return 0;
  return text.replace(/<[^>]*>/g, ' ').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim().split(' ').filter(w => w.length > 0).length;
}

function cbw(block) {
  if (!block) return 0;
  let w = 0;
  w += sc(block.content);
  w += sc(block.textContent);
  if (block.type === 'sectionDivider') { w += sc(block.title); w += sc(block.subtitle); }
  if (block.accordionItems) { block.accordionItems.forEach(a => { w += sc(a.title); w += sc(a.content); }); }
  w += sc(block.question);
  w += sc(block.explanation);
  if (block.options) { block.options.forEach(o => { w += sc(typeof o === 'string' ? o : o.text); }); }
  w += sc(block.matchingInstructions);
  if (block.matchingPairs) { block.matchingPairs.forEach(p => { w += sc(p.term); w += sc(p.definition); }); }
  if (block.resources) { block.resources.forEach(r => { w += sc(r.title); }); }
  return w;
}

await mongoose.connect(process.env.MONGODB_URI);
const col = mongoose.connection.db.collection('interactivecourses');
const courses = await col.find({}).sort({ ceHours: -1, title: 1 }).toArray();
console.log('Courses: ' + courses.length + '\n');

let pass = 0, fail = 0;
for (const c of courses) {
  const mods = c.modules || c.sections || [];
  const ce = c.ceHours || c.credits || 1;
  const target = ce * WORDS_PER_CE_HOUR;
  let total = 0;
  for (const m of mods) {
    let mw = 0;
    (m.contentBlocks || []).forEach(b => { mw += cbw(b); });
    (m.lessons || []).forEach(l => { mw += sc(l.content); });
    total += mw;
  }
  const pct = Math.round(total / target * 100);
  const s = pct >= 70 ? 'PASS' : 'FAIL';
  if (pct >= 70) pass++; else fail++;
  console.log(s + ' | ' + c.title);
  console.log('     CE:' + ce + ' | Words:' + total + '/' + target + ' (' + pct + '%) | Mods:' + mods.length + ' | ' + (c.status || 'n/a'));
}

console.log('\nPASS: ' + pass + '  FAIL: ' + fail);
await mongoose.disconnect();
