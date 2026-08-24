import 'dotenv/config';
import mongoose from 'mongoose';

await mongoose.connect(process.env.MONGODB_URI);
const col = mongoose.connection.db.collection('interactivecourses');
const courses = await col.find({}, {
  projection: { title:1, slug:1, courseCode:1, description:1, subtitle:1, sections:1, status:1 }
}).toArray();

function stripHtml(h) { return (h||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim(); }
function countWords(s) { return s.trim().split(/\s+/).filter(Boolean).length; }

// Count <li> vs <p> tags in a string
function bulletRatio(html) {
  const li = (html.match(/<li\b/gi)||[]).length;
  const p  = (html.match(/<p\b/gi)||[]).length;
  return { li, p, total: li+p };
}

const rows = [];

for (const c of courses) {
  const sections = c.sections || [];
  const firstSec = sections[0];
  const lastSec  = sections[sections.length-1];

  // Description quality
  const desc = (c.description||'').trim();
  const descWords = countWords(stripHtml(desc));
  const descIsTitle = desc.toLowerCase() === (c.title||'').toLowerCase();
  const descWeak = descIsTitle || descWords < 50;

  // Intro: first text block of first content section (skip sectionDivider)
  const firstBlocks = (firstSec && firstSec.contentBlocks || []);
  const firstTextBlock = firstBlocks.find(b => b.type === 'text');
  const introHtml = firstTextBlock ? (firstTextBlock.content||'') : '';
  const introWords = countWords(stripHtml(introHtml));
  const introWeak = introWords < 100;

  // Conclusion: last text block of last section
  const lastBlocks = (lastSec && lastSec.contentBlocks || []);
  const lastTextBlocks = lastBlocks.filter(b => b.type === 'text');
  const lastTextBlock = lastTextBlocks[lastTextBlocks.length-1];
  const conclusionHtml = lastTextBlock ? (lastTextBlock.content||'') : '';
  const conclusionText = stripHtml(conclusionHtml);
  const conclusionWords = countWords(conclusionText);
  const conclusionGeneric = /this course has provided a comprehensive examination/i.test(conclusionText)
    || /as you apply these concepts.*continue to seek consultation/i.test(conclusionText)
    || conclusionWords < 60;

  // Bullet vs prose ratio across ALL content blocks
  let totalLi = 0, totalP = 0;
  for (const sec of sections) {
    for (const b of (sec.contentBlocks||[])) {
      if (b.type === 'text' || b.type === 'imageText') {
        const r = bulletRatio(b.content||'');
        totalLi += r.li; totalP += r.p;
      }
      if (b.type === 'accordion') {
        for (const item of (b.accordionItems||[])) {
          const r = bulletRatio(item.content||'');
          totalLi += r.li; totalP += r.p;
        }
      }
    }
  }
  const bulletPct = totalP+totalLi > 0 ? Math.round(totalLi/(totalP+totalLi)*100) : 0;
  const bulletHeavy = bulletPct > 40 && totalLi > 20;

  const issues = [];
  if (descWeak) issues.push(`desc:${descWords}w${descIsTitle?' (=title)':''}`);
  if (introWeak) issues.push(`intro:${introWords}w`);
  if (conclusionGeneric) issues.push(`conclusion:${conclusionWords}w${/this course has provided/i.test(conclusionText)?'(placeholder)':''}`);
  if (bulletHeavy) issues.push(`bullets:${bulletPct}% (${totalLi}li/${totalP}p)`);

  if (issues.length > 0) {
    rows.push({
      code: (c.courseCode||'(none)').padEnd(14),
      title: (c.title||'').slice(0,50).padEnd(50),
      status: (c.status||'?').padEnd(10),
      issues: issues.join(' | ')
    });
  }
}

console.log(`\nCOURSES WITH INTRO/CONCLUSION/BULLET ISSUES — ${rows.length} found\n`);
console.log('CODE           TITLE                                              STATUS     ISSUES');
console.log('-'.repeat(130));
for (const r of rows) {
  console.log(`${r.code} ${r.title} ${r.status} ${r.issues}`);
}
console.log('-'.repeat(130));
console.log(`\nTotal flagged: ${rows.length} of ${courses.length}`);

await mongoose.disconnect();
