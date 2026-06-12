/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */

/**
 * patchTMH601_Stage5e_AlertBadges.js  (v2 — interactive)
 * ──────────────────────────────────
 * Stage 5e — Tappable alert-badge insertions. Completes the March 23, 2026
 * high-stakes alert design: each badge opens a reminder popup the learner
 * must acknowledge ("I've read this").
 *
 * REQUIRES the companion viewer PR (Stage 5e-int) to be merged first.
 * Without it, {{alert:type:refId}} tokens render as plain static badges
 * (safe degradation — never broken text).
 *
 * Each insertion writes TWO things into the target text block:
 *   1. token   — {{alert:TYPE:REFID}} placed immediately before the anchor
 *   2. callout — block.callouts[REFID] = { label, type, body } carrying the
 *                reminder text the popup displays
 *
 * 10 insertions across §3, §5, §7, §9, §10, §11, §12 (same map as the
 * original 2026-06-10 Stage 5e spec). Idempotent via HTML-comment markers
 * (<!--cr-marker-5e-…-->). Anchor-not-found = warning + skip. Both slugs.
 *
 *   DRY RUN:  node src/scripts/patchTMH601_Stage5e_AlertBadges.js
 *   APPLY:    APPLY=1 node src/scripts/patchTMH601_Stage5e_AlertBadges.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const APPLY = process.env.APPLY === '1';
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('❌ MONGODB_URI not set'); process.exit(1); }

const SLUGS = [
  'mastering-telemental-health',
  'mastering-telemental-health-an-essential-guide-to-a-compliant-virtual-healthcare-practice-in-georgia-mkkycoyo',
];

// Pill-type mapping so the lib entries are valid for PILL_COLORS too.
const PILL_TYPE = {
  legal: 'warning', mandatory: 'warning', donot: 'warning',
  document: 'clinical', supervisor: 'clinical', ethics: 'ethics', protocol: 'warning',
};

// ══════════════════════════════════════════════════════════════════════════
const INSERTIONS = [
  {
    id: 's3-baa-legal', badge: 'legal',
    label: '§3 legal — no BAA = HIPAA violation',
    sectionTitleMatch: /HIPAA/i,
    anchor: /\b(without a (signed |executed )?(BAA|business associate agreement)|no (BAA|business associate agreement))\b/i,
    body: 'Using any platform to transmit or store client information without a signed BAA is itself a HIPAA violation — even if no breach ever occurs. Encryption does not substitute for the agreement.',
  },
  {
    id: 's5-doc-record', badge: 'document',
    label: '§5 document — consent documented in the record',
    sectionTitleMatch: /Informed Consent|Clinical Documentation/i,
    anchor: /\bdocument(ed|ing)? (the )?(informed )?consent\b|\bconsent (must|should) be document/i,
    body: 'Telehealth informed consent is not complete until it is documented in the clinical record. A verbal yes without a record offers no protection in an audit or board complaint.',
  },
  {
    id: 's5-scope-mandatory', badge: 'mandatory',
    label: '§5 mandatory — state-specific scope of practice',
    sectionTitleMatch: /Informed Consent|Clinical Documentation/i,
    anchor: /\bscope of practice\b/i,
    body: 'Scope of practice is defined by the state where the CLIENT is located at the time of service. Verify that state\u2019s rules before each new client engagement — your home state\u2019s rules do not travel with you.',
  },
  {
    id: 's7-supervisor', badge: 'supervisor',
    label: '§7 supervisor — consult with supervisor',
    sectionTitleMatch: /./,
    anchor: /\bconsult(ation)? with (a |your )?(clinical )?supervis/i,
    body: 'Pre-licensed clinicians must involve their supervisor in this decision — and document the consultation: who, when, and what was decided.',
  },
  {
    id: 's9-911-donot', badge: 'donot',
    label: '§9 donot — 911 routes to the caller\u2019s location',
    sectionTitleMatch: /Crisis/i,
    anchor: /\b911\b[^.]{0,120}(caller|your location|clinician\u2019s|clinician's|dispatch)/i,
    body: 'Do NOT assume 911 reaches the client. Dialed from your office, 911 routes to YOUR location — not theirs. Verify the client\u2019s physical address and local emergency number at the start of every session.',
  },
  {
    id: 's9-contemporaneous-doc', badge: 'document',
    label: '§9 document — contemporaneous documentation',
    sectionTitleMatch: /Crisis/i,
    anchor: /\bcontemporaneous(ly)?\b|\bdocument (the )?(crisis|disclosure|intervention)\b/i,
    body: 'Crisis interventions must be documented contemporaneously — during or immediately after the session. Late entries invite scrutiny in any subsequent legal or board review.',
  },
  {
    id: 's10-dual-ethics', badge: 'ethics',
    label: '§10 ethics — dual-relationship rule',
    sectionTitleMatch: /Ethic|Boundar|Social Media|Professional/i,
    anchor: /\bdual relationship/i,
    body: 'The ACA Code of Ethics requires evaluating any dual relationship for potential harm BEFORE entering it. Online visibility makes inadvertent dual relationships easier to stumble into — and harder to defend.',
  },
  {
    id: 's10-reporting-mandatory', badge: 'mandatory',
    label: '§10 mandatory — mandatory reporting',
    sectionTitleMatch: /Ethic|Boundar|Professional/i,
    anchor: /\bmandat(ed|ory) report/i,
    body: 'Mandated reporting duties apply fully in telehealth and are governed by the law of the state where the client is located. Know that state\u2019s threshold and reporting channel before the first session.',
  },
  {
    id: 's11-uap-legal', badge: 'legal',
    label: '§11 legal — unauthorized practice prohibition',
    sectionTitleMatch: /Interstate|Cross-State|Across State/i,
    anchor: /\bunauthorized practice\b|\bpracticing without (a )?licens/i,
    body: 'Serving a client located in a state where you are not authorized to practice is unauthorized practice — a violation in that state regardless of your home license. Verify before every session, especially when clients travel.',
  },
  {
    id: 's12-burnout-legal', badge: 'legal',
    label: '§12 legal — burnout-related malpractice exposure',
    sectionTitleMatch: /Burnout|Sustainab|Long-Term|Self-Care|Wellness/i,
    anchor: /\bmalpractice\b/i,
    body: 'Impaired practice is malpractice exposure. Burnout that degrades care quality is a recognized liability risk — monitoring your own fitness to practice is a professional duty, not just self-care.',
  },
];

const VALID_BADGES = ['ethics', 'mandatory', 'donot', 'document', 'supervisor', 'legal', 'protocol'];
for (const ins of INSERTIONS) {
  if (!VALID_BADGES.includes(ins.badge)) {
    console.error(`❌ Bad badge type in config: ${ins.id} → ${ins.badge}`);
    process.exit(1);
  }
}

function markerFor(id) { return `<!--cr-marker-5e-${id}-->`; }
function labelFor(badge) {
  return { ethics: 'Ethics Alert', mandatory: 'Mandatory Report', donot: 'Do Not',
    document: 'Must Document', supervisor: 'Supervisor Required', legal: 'Legal Exposure',
    protocol: 'Protocol Required' }[badge];
}

// Insert "{marker}{{alert:badge:id}} " immediately before the anchor match,
// never inside an HTML tag.
function insertBadge(html, ins) {
  const m = html.match(ins.anchor);
  if (!m || m.index == null) return null;
  let pos = m.index;
  const lastOpen = html.lastIndexOf('<', pos);
  const lastClose = html.lastIndexOf('>', pos);
  if (lastOpen > lastClose) {
    const tagEnd = html.indexOf('>', pos);
    if (tagEnd === -1) return null;
    pos = tagEnd + 1;
  }
  return html.slice(0, pos) + markerFor(ins.id) + `{{alert:${ins.badge}:${ins.id}}} ` + html.slice(pos);
}

async function run() {
  await mongoose.connect(MONGODB_URI);
  const courses = mongoose.connection.db.collection('interactivecourses');
  console.log(`Stage 5e (v2 interactive) — Alert badges  |  mode: ${APPLY ? 'APPLY' : 'DRY RUN'}`);

  for (const slug of SLUGS) {
    console.log(`\n── ${slug.slice(0, 70)}${slug.length > 70 ? '…' : ''}`);
    const course = await courses.findOne({ slug });
    if (!course) { console.log('   ❌ not found'); continue; }

    const sections = course.sections || [];
    let inserted = 0, already = 0, missed = 0, changed = false;

    for (const ins of INSERTIONS) {
      const exists = sections.some(s => (s.contentBlocks || []).some(b =>
        typeof b.content === 'string' && b.content.includes(markerFor(ins.id))));
      if (exists) { already++; console.log(`   ⏭  ${ins.label} — already present`); continue; }

      let placed = false;
      for (let si = 0; si < sections.length && !placed; si++) {
        const sec = sections[si];
        const blocks = sec.contentBlocks || [];
        for (let bi = 0; bi < blocks.length && !placed; bi++) {
          const b = blocks[bi];
          if (b.type !== 'text' || typeof b.content !== 'string') continue;
          const out = insertBadge(b.content, ins);
          if (out) {
            const title = sec.title || `section ${si + 1}`;
            const guardNote = ins.sectionTitleMatch.test(title) ? '' : '  ⚠️ (outside expected section)';
            console.log(`   ✅ ${ins.label} → "${String(title).slice(0, 48)}" block ${bi}${guardNote}`);
            if (APPLY) {
              b.content = out;
              b.callouts = Object.assign({}, b.callouts || {}, {
                [ins.id]: { label: labelFor(ins.badge), type: PILL_TYPE[ins.badge], body: ins.body },
              });
            }
            placed = true; inserted++; changed = true;
          }
        }
      }
      if (!placed) { missed++; console.log(`   ⚠️  ${ins.label} — anchor not found, SKIPPED`); }
    }

    console.log(`   ── inserted: ${inserted}  already: ${already}  missed: ${missed}`);
    if (APPLY && changed) {
      const res = await courses.updateOne({ slug }, { $set: { sections } });
      console.log(`   WROTE (matched ${res.matchedCount}, modified ${res.modifiedCount})`);
    } else if (!APPLY) {
      console.log('   (dry run — nothing written)');
    }
  }

  await mongoose.disconnect();
  console.log('\nDone.');
}

run().catch(e => { console.error('❌', e); process.exit(1); });
