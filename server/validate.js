const mongoose = require('mongoose');
const WORDS_PER_CE_HOUR = 6000;

function sc(text) {
  if (!text || typeof text !== 'string') return 0;
  return text.replace(/<[^>]*>/g, ' ').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim().split(' ').filter(function(w){return w.length>0}).length;
}

function cbw(block) {
  if (!block) return 0;
  var w = 0;
  w += sc(block.content);
  w += sc(block.textContent);
  if (block.type === 'sectionDivider') { w += sc(block.title); w += sc(block.subtitle); }
  if (block.accordionItems) { block.accordionItems.forEach(function(a){w += sc(a.title); w += sc(a.content);}); }
  w += sc(block.question);
  w += sc(block.explanation);
  if (block.options) { block.options.forEach(function(o){w += sc(typeof o === 'string' ? o : o.text);}); }
  w += sc(block.matchingInstructions);
  if (block.matchingPairs) { block.matchingPairs.forEach(function(p){w += sc(p.term); w += sc(p.definition);}); }
  if (block.resources) { block.resources.forEach(function(r){w += sc(r.title);}); }
  return w;
}

mongoose.connect(process.env.MONGODB_URI).then(async function() {
  var col = mongoose.connection.db.collection('interactivecourses');
  var courses = await col.find({}).sort({ceHours:-1,title:1}).toArray();
  console.log('Courses: ' + courses.length + '\n');
  var pass=0, fail=0;
  for (var c of courses) {
    var mods = c.modules || c.sections || [];
    var ce = c.ceHours || c.credits || 1;
    var target = ce * WORDS_PER_CE_HOUR;
    var total = 0;
    for (var m of mods) {
      var mw = 0;
      (m.contentBlocks||[]).forEach(function(b){mw += cbw(b);});
      (m.lessons||[]).forEach(function(l){mw += sc(l.content);});
      total += mw;
    }
    var pct = Math.round(total/target*100);
    var s = pct >= 70 ? 'PASS' : 'FAIL';
    if (pct>=70) pass++; else fail++;
    console.log(s + ' | ' + c.title);
    console.log('     CE:' + ce + ' | Words:' + total + '/' + target + ' (' + pct + '%) | Mods:' + mods.length + ' | ' + (c.status||'n/a'));
  }
  console.log('\nPASS:' + pass + ' FAIL:' + fail);
  await mongoose.disconnect();
});
