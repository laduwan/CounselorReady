// enrichCRC3.js — weave callout + keyTakeaway components into CR-C3
// (slug: ai-ethics-mental-health) so the page reads as a designed course,
// not a wall of prose.
//
// All callout / takeaway text is DISTILLED FROM THE COURSE'S OWN PROSE
// (condensed, no new clinical claims). Existing prose is never rewritten.
// Blocks are inserted just before each section's questions and tagged
// enrichedBy:'CRC3-enrich' so the pass is idempotent and reversible.
//
// Run from ~/project/src/server :
//   node src/scripts/enrichCRC3.js            (DRY RUN — prints the plan)
//   node src/scripts/enrichCRC3.js --write    (APPLY — backs up sections first)
// After --write, recompute counts:
//   node src/scripts/recalcAllWordCounts.js

import mongoose from 'mongoose';
import { writeFileSync } from 'fs';

const WRITE = process.argv.includes('--write');
const SLUG = 'ai-ethics-mental-health';
const TAG = 'CRC3-enrich';

// Block types that mark the start of the section's assessment; new
// components are inserted immediately BEFORE the first one of these.
export const QUESTION_TYPES = new Set(['multipleChoice', 'multiSelect', 'knowledgeCheck', 'quiz']);

const p = (...paras) => paras.map(t => '<p>' + t + '</p>').join('');

// ── Enrichment content, keyed by sectionNumber. Grounded in CR-C3 prose. ──
export const CONTENT = {
  1: {
    callouts: [
      {
        calloutType: 'info',
        title: 'A working taxonomy',
        content: p(
          'The same term describes technologies that differ radically in design, function, risk, and ethical implications — administrative tools, screening and assessment systems, psychoeducational chatbots, clinical decision support, and general-purpose language models. Meaningful ethical engagement begins with distinguishing them.'
        )
      },
      {
        calloutType: 'warning',
        title: 'The BAA requirement',
        content: p(
          'Any AI tool that receives protected health information is a HIPAA business associate and must execute a Business Associate Agreement. Most consumer AI applications do not offer one — so using them with identifiable client information is a violation, however convenient the tool.'
        )
      }
    ],
    takeaway: {
      title: 'Key takeaway',
      takeaways: [
        'Administrative AI sits at a remove from clinical decisions — its main risks are privacy and documentation accuracy.',
        'Ambient transcription captures the full content of sessions, raising real confidentiality questions.',
        'Screening and assessment AI sits closer to clinical decisions, so its accuracy and equity across groups demand more scrutiny.'
      ]
    }
  },
  2: {
    callouts: [
      {
        calloutType: 'key',
        title: 'Automation bias, defined',
        content: p(
          'The tendency to over-rely on automated output and under-rely on one\u2019s own judgment — documented across aviation, medicine, and law. It is cognitive, not motivational: under cognitive load, a concrete risk score or suggestion becomes an anchor.'
        )
      }
    ],
    takeaway: {
      title: 'Key takeaway',
      takeaways: [
        'Automation bias operates below conscious awareness, so good intentions do not prevent it.',
        'A low AI risk score can pull a clinician toward less urgency and lighter safety planning than their own judgment warranted.',
        'High-caseload, high-demand settings are exactly where anchoring is most likely.'
      ]
    }
  },
  3: {
    callouts: [
      {
        calloutType: 'ethics',
        title: 'NBCC Standard B.1',
        content: p(
          'Clients have a right to accurate information about the methods used in their care. When an AI tool analyzes a client\u2019s information or supports decisions about their treatment, its use is a material fact that falls within the scope of informed consent.'
        )
      }
    ],
    takeaway: {
      title: 'Key takeaway',
      takeaways: [
        'You cannot consent a client to a tool you cannot explain — understanding the tool precedes the consent conversation.',
        'Patients are more comfortable with AI when told up front; concealment, discovered later, is what damages trust.',
        'Transparency about AI is both an ethical obligation and a clinical investment in the therapeutic alliance.'
      ]
    }
  },
  4: {
    callouts: [
      {
        calloutType: 'warning',
        title: 'Hallucination',
        content: p(
          'Large language models generate text by predicting likely next words, not by retrieving facts — so they can produce fluent, confident, fabricated studies, citations, and statistics. Their errors are often indistinguishable from correct output by tone alone; only independent verification reveals the difference.'
        )
      }
    ],
    takeaway: {
      title: 'Key takeaway',
      takeaways: [
        'An LLM\u2019s apparent capability outruns its actual reliability — fluency is not accuracy.',
        'Responsible clinical use requires independently verifying anything an LLM produces, which restores the very effort AI was meant to save.'
      ]
    }
  },
  5: {
    callouts: [
      {
        calloutType: 'clinical',
        title: 'Equity questions for any tool',
        content: p('For every AI tool you consider adopting, ask:'),
        calloutItems: [
          'Who was this tool designed for, and who might it fail?',
          'Which populations were included in the validation research — and which were not?',
          'How might it perform differently, or less well, for the specific clients I serve?'
        ]
      }
    ],
    takeaway: {
      title: 'Key takeaway',
      takeaways: [
        'AI can widen access, but the communities with the greatest unmet need are least represented in AI development pipelines.',
        'That representation gap means tools are often least validated for — and perform worst with — the populations that need them most.'
      ]
    }
  },
  6: {
    callouts: [
      {
        calloutType: 'protocol',
        title: 'A five-step case analysis',
        content: p('Work through AI ethics situations systematically:'),
        calloutItems: [
          'Identification — which AI-related issue is present?',
          'Stakeholder analysis — who is affected, and how?',
          'Standards analysis — which NBCC standards apply, and what do they require?',
          'Action identification — what specific actions, by whom, on what timeline?',
          'Advocacy assessment — is there a systemic issue that requires advocacy?'
        ]
      },
      {
        calloutType: 'key',
        title: 'The human irreducible',
        content: p(
          'No AI can be genuinely moved by a client\u2019s story, co-regulate one nervous system with another, or bring the weight of lived human experience to the encounter. That presence is what the therapeutic relationship most essentially requires.'
        )
      }
    ],
    takeaway: {
      title: 'Key takeaway',
      takeaways: [
        'The primary stakeholder in any clinical AI ethics situation is always the client whose care is affected.',
        'The ethical AI practitioner rests on four things: an accurate view of what AI does and does not do, a clear NBCC-grounded framework, ongoing AI literacy, and advocacy.'
      ]
    }
  }
};

export function buildBlocks(entry) {
  const blocks = [];
  for (const c of (entry.callouts || [])) {
    const b = { type: 'callout', calloutType: c.calloutType, title: c.title, content: c.content, enrichedBy: TAG };
    if (c.calloutItems) b.calloutItems = c.calloutItems;
    blocks.push(b);
  }
  if (entry.takeaway) {
    blocks.push({ type: 'keyTakeaway', title: entry.takeaway.title, takeaways: entry.takeaway.takeaways, enrichedBy: TAG });
  }
  return blocks;
}

export function sectionNumberOf(section, fallbackIndex) {
  const divider = (section.contentBlocks || []).find(b => b.type === 'sectionDivider');
  if (divider && typeof divider.sectionNumber === 'number') return divider.sectionNumber;
  return fallbackIndex + 1;
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) { console.error('MONGODB_URI not set'); process.exit(1); }
  await mongoose.connect(uri);
  const C = mongoose.connection.collection('interactivecourses');

  console.log('═══════════════════════════════════════════════════════════');
  console.log('CR-C3 enrichment  ' + (WRITE ? '(WRITE MODE)' : '(DRY RUN)'));
  console.log('Target: ' + SLUG);
  console.log('═══════════════════════════════════════════════════════════\n');

  const course = await C.findOne({ slug: SLUG });
  if (!course) { console.log('✖ course not found: ' + SLUG); process.exit(1); }

  const backup = JSON.parse(JSON.stringify(course.sections || []));
  const newSections = [];
  let totalCallouts = 0, totalTakeaways = 0, changed = false;

  (course.sections || []).forEach((rawSection, si) => {
    const section = { ...rawSection };
    const blocks = [...(section.contentBlocks || [])];
    const num = sectionNumberOf(section, si);
    const entry = CONTENT[num];

    if (!entry) { newSections.push(section); return; }

    // Idempotency — skip a section already enriched by this pass.
    if (blocks.some(b => b && b.enrichedBy === TAG)) {
      console.log('   §' + num + ' ' + (section.title || '').slice(0, 52) + '  →  already enriched, skipping');
      newSections.push(section);
      return;
    }

    const additions = buildBlocks(entry);
    if (!additions.length) { newSections.push(section); return; }

    // Insert just before the first question block; else append at end.
    let insertAt = blocks.findIndex(b => QUESTION_TYPES.has(b.type));
    if (insertAt === -1) insertAt = blocks.length;
    blocks.splice(insertAt, 0, ...additions);

    // Renumber order across the section.
    blocks.forEach((b, i) => { b.order = i + 1; });
    section.contentBlocks = blocks;

    const nc = additions.filter(b => b.type === 'callout').length;
    const nt = additions.filter(b => b.type === 'keyTakeaway').length;
    totalCallouts += nc; totalTakeaways += nt; changed = true;
    console.log('   §' + num + ' ' + (section.title || '').slice(0, 52) +
                '  →  +' + nc + ' callout(s), +' + nt + ' takeaway  (before block #' + (insertAt + 1) + ')');
    newSections.push(section);
  });

  console.log('\n   totals: +' + totalCallouts + ' callouts, +' + totalTakeaways + ' takeaways');

  if (!changed) { console.log('   nothing to do.\n'); await mongoose.disconnect(); return; }

  if (!WRITE) {
    console.log('\n   DRY RUN — no write. Re-run with --write to apply.\n');
    await mongoose.disconnect();
    return;
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = 'crc3-enrich-backup-' + stamp + '.json';
  writeFileSync(backupFile, JSON.stringify(backup, null, 2));
  console.log('\n   backup written: ' + backupFile);

  const result = await C.updateOne({ slug: SLUG }, { $set: { sections: newSections } });
  console.log('   updateOne matched=' + result.matchedCount + ' modified=' + result.modifiedCount);
  console.log('   ✔ applied. Now run: node src/scripts/recalcAllWordCounts.js\n');

  await mongoose.disconnect();
}

if (import.meta.url === `file://${process.argv[1]}`) main().catch(e => { console.error(e); process.exit(1); });
