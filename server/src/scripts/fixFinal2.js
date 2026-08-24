/**
 * fixFinal2.js
 *
 * Fixes the final 2 remaining audit issues:
 *
 *   CR-418  neurobiology-of-trauma        intro:67w  (also residual ULs with style attrs)
 *   CR-415  elephant-in-the-room-difficult-conversations  conclusion:0w (in textContent field)
 *
 * Both issues require reading the actual DB state and writing precisely.
 * Uses raw $set — no .save().
 *
 * Usage:
 *   node src/scripts/fixFinal2.js          # dry-run
 *   node src/scripts/fixFinal2.js --apply  # write
 */

import 'dotenv/config';
import mongoose from 'mongoose';

const APPLY = process.argv.includes('--apply');
const DRY   = !APPLY;
if (!process.env.MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }

function stripHtml(h) { return (h||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim(); }
function wc(s) { return s.trim().split(/\s+/).filter(Boolean).length; }
function countLi(h) { return ((h||'').match(/<li\b/gi)||[]).length; }

// Convert <ul style="..."> and <ul> that weren't caught by the first pass
function convertStyledUls(html) {
  if (!html || !countLi(html)) return html;
  let r = html;

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
  function join(items) {
    if (!items.length) return '';
    if (items.length === 1) return items[0];
    if (items.length === 2) return `${items[0]} and ${items[1]}`;
    return items.slice(0,-1).join(', ') + `, and ${items[items.length-1]}`;
  }

  // <p><strong>Label:</strong></p> + <ul ...>
  r = r.replace(
    /<p>\s*(<strong>[^<]+:?\s*<\/strong>)\s*<\/p>\s*<ul[^>]*>([\s\S]*?)<\/ul>/gi,
    (_, label, ul) => { const i=getLiItems(ul); return i.length?`<p>${label} ${join(i)}.</p>`:_; }
  );
  // <p>Sentence:</p> + <ul ...>
  r = r.replace(
    /<p>([^<]{12,}?:)\s*<\/p>\s*<ul[^>]*>([\s\S]*?)<\/ul>/gi,
    (_, intro, ul) => { const i=getLiItems(ul); return i.length?`<p>${intro.replace(/:$/,'')}: ${join(i)}.</p>`:_; }
  );
  // Any remaining <ul ...>
  r = r.replace(
    /<ul[^>]*>([\s\S]*?)<\/ul>/gi,
    (_, ul) => { const i=getLiItems(ul); return i.length?i.map(x=>`<p>${x}.</p>`).join('\n'):''; }
  );
  return r;
}

const CR418_INTRO = `<h2>What the Brain Remembers</h2>
<p>Every client who has experienced trauma brings a nervous system that has been reorganized by that experience. The hippocampus that was supposed to contextualize threatening memories — to file them as past and not present — is functioning differently than it was before the trauma. The prefrontal cortex that regulates emotional responses goes offline under stress in ways it doesn't in people who haven't experienced the same level of threat. The amygdala that scans for danger has been calibrated to a level of alertness that once made sense, and that now interferes with safety in every domain of the client's life: relationships, work, sleep, the body itself.</p>
<p>When clinicians understand these mechanisms — not as metaphors but as actual neurobiological processes with specific anatomical substrates — they stop fighting the symptom and start working with the biology. They understand why a client who genuinely wants to heal cannot simply decide to stop being hypervigilant. They understand why trauma memories intrude into present experience as sensations and images rather than coherent narratives. They understand which evidence-based approaches — somatic, relational, cognitive — are aligned with the brain's actual healing mechanisms, and why. That understanding transforms clinical practice at a foundational level. This course provides it in clinical depth.</p>`;

const CR415_CONCLUSION = `<h2>Taking This Into Every Session</h2>
<p>The conversations this course has prepared you for are not exceptional moments in clinical work — they are the texture of clinical work at its most honest. The rupture that needs naming. The pattern the client has not yet seen. The cultural difference that has been quietly shaping every exchange. The feedback the clinician has been holding back because the timing never felt right. These are not crises. They are clinical opportunities that require a clinician who has learned to tolerate the discomfort of saying what is true rather than what is comfortable.</p>
<p>Your own avoidance is your most reliable signal. When the impulse arises to soften, redirect, or wait until next session — that is the signal that the conversation needs to happen now. Not harshly, not without preparation, but honestly and directly, in the service of the clinical relationship and the client's growth. The clients who most need you to stay present through difficulty are often the clients who most expect you to flinch. Meeting that expectation differently — remaining curious, remaining warm, remaining direct — can be among the most therapeutic things you do.</p>
<p>Bring one avoided conversation to supervision this week. Name it specifically. Practice the language. The discipline of naming in supervision what needs to be said in session is the bridge between knowing these skills and actually using them in the moments that count.</p>`;

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('interactivecourses');

  console.log('\n'+'='.repeat(64));
  console.log('fixFinal2 — '+(DRY?'DRY RUN':'APPLYING WRITES'));
  console.log('='.repeat(64)+'\n');

  // ── CR-418: fix intro + residual styled ULs ──────────────────────
  {
    const course = await col.findOne({ slug:'neurobiology-of-trauma' });
    if (!course) { console.log('CR-418 NOT FOUND'); } else {
      console.log(`CR-418: ${course.title}`);
      const sections = course.sections || [];
      let introFixed=false, ulFixed=0;

      const patchedSections = sections.map((sec, si) => {
        const patchedBlocks = (sec.contentBlocks||[]).map((block, bi) => {
          // Fix intro: first text block in first section
          if (si===0 && block.type==='text' && !introFixed) {
            const existing = block.content||block.textContent||'';
            const existingW = wc(stripHtml(existing));
            if (existingW < 80) {
              introFixed=true;
              console.log(`  intro: ${existingW}w → ${wc(stripHtml(CR418_INTRO))}w`);
              return block.content!==undefined
                ? {...block, content:CR418_INTRO}
                : {...block, textContent:CR418_INTRO, content:CR418_INTRO};
            }
          }
          // Fix residual styled ULs in any text/imageText block
          const src = block.content||block.textContent||'';
          if ((block.type==='text'||block.type==='imageText') && countLi(src)) {
            const conv = convertStyledUls(src);
            if (conv!==src) {
              ulFixed++;
              return block.content!==undefined?{...block,content:conv}:{...block,textContent:conv};
            }
          }
          return block;
        });
        return {...sec, contentBlocks:patchedBlocks};
      });

      console.log(`  Residual UL blocks converted: ${ulFixed}`);
      if (!DRY) {
        const r = await col.updateOne({_id:course._id},{$set:{sections:patchedSections,updatedAt:new Date()}});
        console.log(r.modifiedCount===1?'  ✅ Written':'  ❌ Write failed');
      }
    }
  }

  // ── CR-415: fix conclusion — check both content and textContent ───
  {
    const course = await col.findOne({ slug:'elephant-in-the-room-difficult-conversations' });
    if (!course) { console.log('\nCR-415 NOT FOUND'); } else {
      console.log(`\nCR-415: ${course.title}`);
      const sections = course.sections || [];
      console.log(`  Sections: ${sections.length}`);

      // Inspect last section
      const lastSec = sections[sections.length-1];
      if (!lastSec) { console.log('  No sections found'); }
      else {
        const blocks = lastSec.contentBlocks||[];
        const textBlocks = blocks.filter(b=>b.type==='text');
        console.log(`  Last section: "${lastSec.title}" — ${blocks.length} blocks, ${textBlocks.length} text blocks`);

        textBlocks.forEach((b,i)=>{
          const c = b.content||'';
          const tc = b.textContent||'';
          console.log(`  Text block ${i}: content=${wc(stripHtml(c))}w textContent=${wc(stripHtml(tc))}w`);
        });

        // Find the last text block and check both fields
        const lastText = textBlocks[textBlocks.length-1];
        const conclusionContent = lastText ? (lastText.content||lastText.textContent||'') : '';
        const conclusionW = wc(stripHtml(conclusionContent));

        if (!lastText || conclusionW < 60) {
          console.log(`  conclusion: ${conclusionW}w → ${wc(stripHtml(CR415_CONCLUSION))}w`);

          let patchedBlocks;
          if (!lastText) {
            const maxOrder = blocks.reduce((m,b)=>Math.max(m,b.order||0),0);
            patchedBlocks = [...blocks, {type:'text',order:maxOrder+1,content:CR415_CONCLUSION}];
          } else {
            patchedBlocks = blocks.map(b=>
              b===lastText?{...b,content:CR415_CONCLUSION,textContent:CR415_CONCLUSION}:b
            );
          }
          patchedBlocks.forEach((b,i)=>{b.order=i+1;});

          const patchedSections = sections.map((s,i)=>
            i===sections.length-1 ? {...s,contentBlocks:patchedBlocks} : s
          );

          if (!DRY) {
            const r = await col.updateOne({_id:course._id},{$set:{sections:patchedSections,updatedAt:new Date()}});
            console.log(r.modifiedCount===1?'  ✅ Written':'  ❌ Write failed');
          }
        } else {
          console.log(`  conclusion already OK (${conclusionW}w) — audit may be reading wrong field`);
          // Force-write the conclusion to .content regardless, so audit can find it
          if (lastText && !lastText.content && lastText.textContent) {
            console.log('  Migrating textContent → content for audit compatibility');
            const patchedBlocks = blocks.map(b=>
              b===lastText ? {...b, content:b.textContent} : b
            );
            const patchedSections = sections.map((s,i)=>
              i===sections.length-1 ? {...s,contentBlocks:patchedBlocks} : s
            );
            if (!DRY) {
              const r = await col.updateOne({_id:course._id},{$set:{sections:patchedSections,updatedAt:new Date()}});
              console.log(r.modifiedCount===1?'  ✅ Written':'  ❌ Write failed');
            }
          }
        }
      }
    }
  }

  console.log('\n'+'='.repeat(64));
  if (DRY) console.log('Re-run with --apply, then: node src/scripts/auditIntrosConclusions.js');
  console.log('='.repeat(64)+'\n');

  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err=>{ console.error('Fatal:',err); process.exit(1); });
