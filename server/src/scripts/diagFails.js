/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.MONGODB_URI) { console.error('No MONGODB_URI'); process.exit(1); }
await mongoose.connect(process.env.MONGODB_URI);

const col = mongoose.connection.db.collection('interactivecourses');

function sc(text) {
  if (!text || typeof text !== 'string') return 0;
  return text.replace(/<[^>]*>/g, ' ').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim().split(' ').filter(w => w.length > 0).length;
}
function cbw(block) {
  if (!block) return 0;
  let w = 0;
  w += sc(block.content); w += sc(block.textContent);
  if (block.type === 'sectionDivider') { w += sc(block.title); w += sc(block.subtitle); }
  if (block.accordionItems) { block.accordionItems.forEach(a => { w += sc(a.title); w += sc(a.content); }); }
  w += sc(block.question); w += sc(block.explanation);
  if (block.options) { block.options.forEach(o => { w += sc(typeof o === 'string' ? o : o.text); }); }
  w += sc(block.matchingInstructions);
  if (block.matchingPairs) { block.matchingPairs.forEach(p => { w += sc(p.term); w += sc(p.definition); }); }
  if (block.resources) { block.resources.forEach(r => { w += sc(r.title); }); }
  return w;
}

const fails = [
  'The Neurobiology of Trauma',
  'Trauma-Informed Care: Foundations for Clinical Practice',
  'Foundations of Trauma-Informed Care: Assessment and Stabilization',
  'Psychopharmacology for Counselors: Understanding Medications in Mental Health',
  'Suicide Assessment and Safety Planning: Evidence-Based Approaches',
  'Ethical Uses of AI in Mental Health Counseling',
  'Motivational Interviewing in First Sessions: Empowering Clients for Change'
];

for (const title of fails) {
  const c = await col.findOne({ title });
  if (!c) { console.log('NOT FOUND: ' + title + '\n'); continue; }
  const ce = c.ceHours || c.credits || 1;
  const target = ce * 6000;
  const mods = c.modules || c.sections || [];
  let total = 0;

  console.log('═══ ' + c.title + ' ═══');
  console.log('Slug: ' + c.slug);
  console.log('CE: ' + ce + ' | Target: ' + target + ' | Mods: ' + mods.length);
  console.log('Assessment: ' + (c.assessment?.questions?.length || 0) + ' questions');
  console.log('');

  for (const m of mods) {
    let mw = 0;
    const blocks = m.contentBlocks || [];
    (blocks).forEach(b => { mw += cbw(b); });
    (m.lessons || []).forEach(l => { mw += sc(l.content); });
    total += mw;

    const types = {};
    blocks.forEach(b => { types[b.type] = (types[b.type] || 0) + 1; });
    const typeStr = Object.entries(types).map(([k,v]) => k + ':' + v).join(', ');
    console.log('  ' + m.title);
    console.log('    ' + mw + ' words | ' + blocks.length + ' blocks (' + typeStr + ')');
  }

  const gap = target - total;
  console.log('');
  console.log('  TOTAL: ' + total + '/' + target + ' (' + Math.round(total/target*100) + '%) — need +' + gap);
  console.log('');
}

await mongoose.disconnect();
