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
console.log('Connected');

const col = mongoose.connection.db.collection('interactivecourses');
const course = await col.findOne({ slug: 'dbt-skills-training-comprehensive' });
if (!course) { console.error('Course not found'); process.exit(1); }

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

const expansions = {

"The Structure of Comprehensive DBT": [
  {
    type: "text",
    content: `<h3>Diary Cards: The Daily Tracking System</h3>
<p>The diary card is a deceptively simple but clinically essential tool in comprehensive DBT. Clients complete a diary card every day, recording their use of target behaviors (self-harm urges and actions, substance use, other behaviors being tracked), their emotional intensity on a scale of zero to five across multiple emotion categories, and their use of specific DBT skills. The diary card is reviewed at the beginning of every individual therapy session and serves multiple clinical functions simultaneously.</p>
<p>First, the diary card provides the data that drives the treatment target hierarchy. By reviewing the diary card, the therapist can immediately identify whether any life-threatening behaviors occurred since the last session, whether any therapy-interfering behaviors are present, and which quality-of-life issues are most active. This data-driven approach prevents the common clinical problem of allowing session content to be driven by whatever the client happens to be feeling in the moment rather than by the most clinically important issues. A client who arrives at session wanting to discuss a frustrating interaction with their landlord might have diary card data showing three episodes of self-harm urges during the week—data that would redirect the session to the higher-priority target of life-threatening behavior.</p>
<p>Second, the diary card creates a longitudinal record that reveals patterns invisible in any single session. A client who reports feeling "fine" in session may have diary card data showing escalating emotional intensity across the week, a pattern of increased substance use on weekends, or a correlation between interpersonal conflicts and self-harm urges. These patterns become the basis for behavioral chain analyses and for the development of targeted intervention strategies.</p>
<p>Third, the act of completing the diary card is itself a mindfulness practice. The daily requirement to observe and record one's emotional state, behavioral urges, and skill use cultivates the capacity for self-observation that is the foundation of the mindfulness module. Many clients report that the diary card makes them more aware of their emotional patterns and behavioral choices throughout the day, not just during the few minutes they spend completing the card. This increased self-awareness is one of the mechanisms through which DBT produces change: you cannot modify a pattern you have not noticed, and the diary card ensures that patterns are noticed, recorded, and brought into the therapeutic conversation.</p>`,
    accessibility: { role: "article", ariaLabel: "Diary cards in DBT" }
  }
],

"Evidence Base, Limitations, and Clinical Integration": [
  {
    type: "text",
    content: `<h3>The Fidelity Question: How Much DBT Is Enough?</h3>
<p>One of the most practically important questions facing clinicians who wish to integrate DBT into their practice concerns treatment fidelity: how closely must the treatment adhere to the comprehensive DBT model as Linehan described it in order to be effective? This question has generated considerable debate within the DBT community and has significant implications for clinical practice, training, and the interpretation of research findings.</p>
<p>On one end of the spectrum are adherent DBT programs that implement all four modes of treatment—individual therapy, skills group, phone coaching, and consultation team—following the protocols described in Linehan's treatment manuals. These programs can seek certification through the DBT-Linehan Board of Certification, which evaluates adherence to specific practice standards. Proponents of strict adherence argue that the components of DBT are synergistic and that removing any component diminishes the effectiveness of the whole. They point to the component analysis by Linehan and colleagues showing that the full package outperformed individual components delivered in isolation.</p>
<p>On the other end of the spectrum are clinicians who use selected DBT skills and concepts within an eclectic or integrative practice framework—what is typically called DBT-informed therapy. These clinicians may teach distress tolerance skills to clients in crisis, use validation as a deliberate therapeutic strategy, or apply the dialectical framework to case conceptualization, all without implementing a comprehensive DBT program. Critics of this approach worry that cherry-picking DBT components without the full treatment structure dilutes the treatment and may produce inferior outcomes. Supporters counter that some DBT is better than no DBT, particularly for clients in settings where comprehensive programs are not available.</p>
<p>The emerging research on this question suggests a nuanced answer. Stand-alone DBT skills groups—without the individual therapy, phone coaching, or consultation team components—have shown positive outcomes across multiple studies, though the effect sizes tend to be smaller than those found in comprehensive DBT trials. This suggests that the skills themselves have therapeutic value even outside the full treatment structure, but that the comprehensive package adds meaningful incremental benefit. For practicing clinicians, this means that integrating DBT skills into existing practice is a reasonable and evidence-informed approach, particularly when comprehensive DBT is not feasible—while acknowledging that this approach may not produce outcomes equivalent to the full treatment package.</p>`,
    accessibility: { role: "article", ariaLabel: "Treatment fidelity in DBT" }
  }
]

};

console.log('Expanding (round 3)...\n');

for (const mod of course.modules) {
  const newBlocks = expansions[mod.title];
  if (!newBlocks) continue;
  const blocks = mod.contentBlocks || [];
  const insertAt = Math.max(blocks.length - 1, 0);
  blocks.splice(insertAt, 0, ...newBlocks);
  mod.contentBlocks = blocks;
  let added = 0;
  for (const b of newBlocks) { added += cbw(b); }
  console.log('  ' + mod.title + ': +' + added + ' words');
}

console.log('\nSaving...');
await col.replaceOne({ slug: 'dbt-skills-training-comprehensive' }, course);

let total = 0;
for (const m of course.modules) {
  let mw = 0;
  (m.contentBlocks || []).forEach(b => { mw += cbw(b); });
  (m.lessons || []).forEach(l => { mw += sc(l.content); });
  console.log('  ' + m.title + ': ' + mw);
  total += mw;
}
console.log('\n  TOTAL: ' + total + ' / 36000 (' + Math.round(total/36000*100) + '%)');
console.log('  ' + (total >= 36000 ? 'PASS' : 'NEED ' + (36000-total) + ' MORE'));

await mongoose.disconnect();
