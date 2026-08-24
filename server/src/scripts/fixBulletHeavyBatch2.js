/**
 * fixBulletHeavyBatch2.js
 *
 * Converts <ul><li> bullet patterns to prose in additional bullet-heavy
 * courses found via live viewer inspection (not caught by audit threshold):
 *
 *   psychopharmacology-for-counselors  (CR-501)
 *
 * Same engine as fixBulletHeavyCourses.js.
 * Covers text, imageText, and accordion blocks.
 * Catches <ul style="..."> attributed lists.
 *
 * Usage:
 *   node src/scripts/fixBulletHeavyBatch2.js          # dry-run
 *   node src/scripts/fixBulletHeavyBatch2.js --apply  # write
 */

import 'dotenv/config';
import mongoose from 'mongoose';

const APPLY = process.argv.includes('--apply');
const DRY   = !APPLY;
if (!process.env.MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }

// Add more slugs here as they are spotted in the viewer
const TARGETS = [
  'psychopharmacology-for-counselors',
];

function countLi(h) { return ((h||'').match(/<li\b/gi)||[]).length; }
function countP(h)  { return ((h||'').match(/<p\b/gi)||[]).length; }

function getLiItems(ul) {
  const items = [];
  const re = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let m;
  while ((m = re.exec(ul)) !== null) {
    const t = m[1].replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().replace(/\.$/,'');
    if (t) items.push(t);
  }
  return items;
}

function joinItems(items) {
  if (!items.length) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return items.slice(0,-1).join(', ') + `, and ${items[items.length-1]}`;
}

function convertBullets(html) {
  if (!html || !countLi(html)) return html;
  let r = html;
  r = r.replace(
    /<p>\s*(<strong>[^<]+:?\s*<\/strong>)\s*<\/p>\s*<ul[^>]*>([\s\S]*?)<\/ul>/gi,
    (_, label, ul) => { const i=getLiItems(ul); return i.length?`<p>${label} ${joinItems(i)}.</p>`:_; }
  );
  r = r.replace(
    /<p>([^<]{12,}?:)\s*<\/p>\s*<ul[^>]*>([\s\S]*?)<\/ul>/gi,
    (_, intro, ul) => { const i=getLiItems(ul); return i.length?`<p>${intro.replace(/:$/,'')}: ${joinItems(i)}.</p>`:_; }
  );
  r = r.replace(
    /<ul[^>]*>([\s\S]*?)<\/ul>/gi,
    (_, ul) => { const i=getLiItems(ul); return i.length?i.map(x=>`<p>${x}.</p>`).join('\n'):''; }
  );
  return r;
}

async function fixCourse(col, slug) {
  const course = await col.findOne({ slug });
  if (!course) { console.log(`NOT FOUND: ${slug}`); return; }

  const sections = course.sections || [];
  let liBefore=0, pBefore=0, liAfter=0, pAfter=0, changed=0;

  const patchedSections = sections.map(sec => ({
    ...sec,
    contentBlocks: (sec.contentBlocks||[]).map(block => {
      if (block.type==='text' || block.type==='imageText') {
        const src = block.content||block.textContent||'';
        if (!countLi(src)) return block;
        liBefore+=countLi(src); pBefore+=countP(src);
        const conv = convertBullets(src);
        liAfter+=countLi(conv); pAfter+=countP(conv);
        if (conv!==src) { changed++; return block.content!==undefined?{...block,content:conv}:{...block,textContent:conv}; }
        return block;
      }
      if (block.type==='accordion') {
        const items = (block.accordionItems||[]).map(item => {
          const src=item.content||'';
          if (!countLi(src)) return item;
          liBefore+=countLi(src); pBefore+=countP(src);
          const conv=convertBullets(src);
          liAfter+=countLi(conv); pAfter+=countP(conv);
          if (conv!==src) { changed++; return {...item,content:conv}; }
          return item;
        });
        return {...block, accordionItems:items};
      }
      return block;
    })
  }));

  const pctB = pBefore+liBefore>0?Math.round(liBefore/(pBefore+liBefore)*100):0;
  const pctA = pAfter+liAfter>0?Math.round(liAfter/(pAfter+liAfter)*100):0;

  console.log(`${course.courseCode||'?'} — ${course.title}`);
  console.log(`  Before: ${liBefore}li/${pBefore}p = ${pctB}%  →  After: ${liAfter}li/${pAfter}p = ${pctA}%`);
  console.log(`  Blocks modified: ${changed}`);

  if (!changed) { console.log('  Nothing to convert.\n'); return; }

  if (!DRY) {
    const r = await col.updateOne({_id:course._id},{$set:{sections:patchedSections,updatedAt:new Date()}});
    if (r.modifiedCount===1) {
      const rb = await col.findOne({_id:course._id},{projection:{sections:1}});
      let rbLi=0,rbP=0;
      (rb.sections||[]).forEach(s=>(s.contentBlocks||[]).forEach(b=>{
        const c=b.content||b.textContent||'';
        rbLi+=countLi(c);rbP+=countP(c);
        (b.accordionItems||[]).forEach(a=>{rbLi+=countLi(a.content||'');rbP+=countP(a.content||'');});
      }));
      const rbPct=rbP+rbLi>0?Math.round(rbLi/(rbP+rbLi)*100):0;
      console.log(`  ✅ Written — read-back: ${rbLi}li/${rbP}p = ${rbPct}%`);
    } else console.error('  ❌ Write failed');
  }
  console.log();
}

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('interactivecourses');

  console.log('\n'+'='.repeat(64));
  console.log('fixBulletHeavyBatch2 — '+(DRY?'DRY RUN':'APPLYING WRITES'));
  console.log('='.repeat(64)+'\n');

  for (const slug of TARGETS) await fixCourse(col, slug);

  console.log('='.repeat(64));
  if (DRY) console.log('Re-run with --apply to write.');
  console.log('='.repeat(64)+'\n');

  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err=>{ console.error('Fatal:',err); process.exit(1); });
