/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */

/**
 * patchTMH601_ScenariosAndContent.js
 * ──────────────────────────────────
 * Stage 2 of the Mastering TeleMental Health (CR-TMH601) cleanup.
 * CONTENT CORRECTNESS — fixes broken interactives + fills three content gaps Ke flagged.
 *
 * PART A — REPAIR (existing data, currently broken):
 *  All 13 scenarioTree blocks across §2, §3, §5, §6, §7, §8, §10, §11, §12 use a
 *  shape mismatched to the live viewer (interactive-course.html). The viewer reads:
 *    block.scenarioTitle, block.startNode, block.nodes[key] (dict), choice.next
 *  The seeds wrote:
 *    block.title, no startNode, block.nodes (array), choice.nextId
 *  Result: every scenarioTree currently renders as "Clinical Scenario" + "End of
 *  scenario." with no interactivity. This patch reshapes them in place:
 *    title → scenarioTitle
 *    description → prepended to start-node text as scenario setup
 *    nodes:[]  → nodes:{}  keyed by node.id
 *    choice.nextId → choice.next
 *    add startNode: "start" when missing
 *
 * PART B — ADDITIONS (new content, answering specific gaps):
 *  1. §4 — At-a-Glance 5-Platform Comparison TABLE (text block, inserted before
 *     the deep-dive accordion). Side-by-side BAA / cost / EHR-integration /
 *     group-session / client-download / best-for view of the 5 platforms the
 *     section already covers in prose.
 *  2. §5 — Privacy Expectations Script (callout, type:"clinical"). Concrete
 *     session-one language for setting client privacy/confidentiality
 *     expectations — sample script the clinician can read or paraphrase.
 *  3. §5 — "The First Session: A Walkthrough" scenarioTree. 5-decision-point
 *     intake walkthrough: paperwork → identity+location verification →
 *     environment privacy check → verbal consent confirmation → emergency
 *     contact & suitability re-screen.
 *
 * Both parts are idempotent — re-running detects already-applied changes and
 * skips them.
 *
 * Run on Render shell:
 *   cd ~/project/src/server
 *   node src/scripts/patchTMH601_ScenariosAndContent.js              # dry run
 *   APPLY=1 node src/scripts/patchTMH601_ScenariosAndContent.js      # write
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in env');
  process.exit(1);
}

const APPLY = process.env.APPLY === '1';

const TARGET_SLUGS = [
  'mastering-telemental-health-an-essential-guide-to-a-compliant-virtual-healthcare-practice-in-georgia-mkkycoyo',
  'mastering-telemental-health',
];

// Idempotency markers — substrings unique to each addition. If present in
// the course, we skip re-inserting. (Avoid markers that contain double quotes,
// since JSON.stringify escapes them and the substring match misses.)
const MARKERS = {
  comparisonTable: 'cr-marker-tmh-platform-comparison',
  privacyScript: 'Privacy Expectations: Session-One Script',
  firstSessionScenario: 'The First Session: A Walkthrough',
};

// ════════════════════════════════════════════════════════════════════
// PART A — scenarioTree shape repair
// ════════════════════════════════════════════════════════════════════
function repairScenarioTree(block) {
  if (!block || block.type !== 'scenarioTree') {
    return { block, changed: false };
  }

  // Already in viewer-correct shape?
  const alreadyRepaired =
    typeof block.scenarioTitle === 'string' &&
    typeof block.startNode === 'string' &&
    block.nodes &&
    typeof block.nodes === 'object' &&
    !Array.isArray(block.nodes);

  if (alreadyRepaired) return { block, changed: false };

  const out = { ...block };

  // title → scenarioTitle
  if (!out.scenarioTitle && typeof out.title === 'string') {
    out.scenarioTitle = out.title;
  }

  // startNode
  if (!out.startNode) out.startNode = 'start';

  // nodes [] → {} keyed by id
  let nodesDict = {};
  if (Array.isArray(out.nodes)) {
    out.nodes.forEach(n => {
      if (!n || !n.id) return;
      const choices = Array.isArray(n.choices)
        ? n.choices.map(c => ({
            text: c.text || '',
            next: c.next || c.nextId || '',
          }))
        : [];
      nodesDict[n.id] = { text: n.text || '', choices };
      if (n.isEnd) nodesDict[n.id].isEnd = true;
    });
  } else if (out.nodes && typeof out.nodes === 'object') {
    // Already a dict but choices may still have nextId — normalize
    Object.entries(out.nodes).forEach(([key, n]) => {
      const choices = Array.isArray(n.choices)
        ? n.choices.map(c => ({ text: c.text || '', next: c.next || c.nextId || '' }))
        : [];
      nodesDict[key] = { ...n, choices };
    });
  }
  out.nodes = nodesDict;

  // Fold description into the start node so the scenario setup isn't lost
  if (
    typeof out.description === 'string' &&
    out.description.trim().length > 0 &&
    out.nodes[out.startNode]
  ) {
    const setup = out.description.trim();
    const startNode = out.nodes[out.startNode];
    if (!startNode.text || !startNode.text.includes(setup)) {
      startNode.text = `<p style="background:#faf8f3;border-left:3px solid #D4A855;padding:10px 14px;margin-bottom:14px;font-style:italic">${escapeHtml(
        setup
      )}</p>${startNode.text || ''}`;
    }
  }

  return { block: out, changed: true };
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[c]);
}

// ════════════════════════════════════════════════════════════════════
// PART B — three content additions
// ════════════════════════════════════════════════════════════════════

// ── ADDITION 1 — §4 platform comparison table ──────────────────────
const PLATFORM_COMPARISON_BLOCK = {
  type: 'text',
  content: `<h2>At-a-Glance: 5-Platform Comparison</h2>
<p style="margin-bottom:10px"><em>Quick side-by-side reference for the platforms covered in detail below. Use this to narrow your shortlist, then drill into the accordion for the full pros / cons / pricing breakdown.</em></p>
<div style="overflow-x:auto"><!--cr-marker-tmh-platform-comparison-->
<table style="width:100%;border-collapse:collapse;margin:12px 0;font-size:0.88em;min-width:760px">
  <thead>
    <tr style="background:#6B1D34;color:#ffffff">
      <th style="padding:10px 10px;text-align:left;border:1px solid #6B1D34">Platform</th>
      <th style="padding:10px 10px;text-align:left;border:1px solid #6B1D34">BAA Available</th>
      <th style="padding:10px 10px;text-align:left;border:1px solid #6B1D34">Cost (solo, /mo)</th>
      <th style="padding:10px 10px;text-align:left;border:1px solid #6B1D34">EHR / Practice Mgmt</th>
      <th style="padding:10px 10px;text-align:left;border:1px solid #6B1D34">Group Sessions</th>
      <th style="padding:10px 10px;text-align:left;border:1px solid #6B1D34">Client Download</th>
      <th style="padding:10px 10px;text-align:left;border:1px solid #6B1D34">Best For</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding:8px 10px;border:1px solid #e5e5e5;font-weight:600">Doxy.me</td>
      <td style="padding:8px 10px;border:1px solid #e5e5e5">Yes (free tier)</td>
      <td style="padding:8px 10px;border:1px solid #e5e5e5">$0 – $50</td>
      <td style="padding:8px 10px;border:1px solid #e5e5e5">None</td>
      <td style="padding:8px 10px;border:1px solid #e5e5e5">Pro tier add-on</td>
      <td style="padding:8px 10px;border:1px solid #e5e5e5">None — browser link</td>
      <td style="padding:8px 10px;border:1px solid #e5e5e5">Solo, budget-tight, low-tech clients</td>
    </tr>
    <tr style="background:#faf8f3">
      <td style="padding:8px 10px;border:1px solid #e5e5e5;font-weight:600">Zoom for Healthcare</td>
      <td style="padding:8px 10px;border:1px solid #e5e5e5">Yes</td>
      <td style="padding:8px 10px;border:1px solid #e5e5e5">$13 – $25+</td>
      <td style="padding:8px 10px;border:1px solid #e5e5e5">None</td>
      <td style="padding:8px 10px;border:1px solid #e5e5e5">Strong — breakout rooms</td>
      <td style="padding:8px 10px;border:1px solid #e5e5e5">App preferred; browser limited</td>
      <td style="padding:8px 10px;border:1px solid #e5e5e5">Group therapy, familiar UI</td>
    </tr>
    <tr>
      <td style="padding:8px 10px;border:1px solid #e5e5e5;font-weight:600">SimplePractice</td>
      <td style="padding:8px 10px;border:1px solid #e5e5e5">Yes</td>
      <td style="padding:8px 10px;border:1px solid #e5e5e5">$69 – $99</td>
      <td style="padding:8px 10px;border:1px solid #e5e5e5">Full — EHR, billing, client portal</td>
      <td style="padding:8px 10px;border:1px solid #e5e5e5">Yes (Professional plan)</td>
      <td style="padding:8px 10px;border:1px solid #e5e5e5">None — browser portal</td>
      <td style="padding:8px 10px;border:1px solid #e5e5e5">All-in-one solo or group practice</td>
    </tr>
    <tr style="background:#faf8f3">
      <td style="padding:8px 10px;border:1px solid #e5e5e5;font-weight:600">TherapyNotes</td>
      <td style="padding:8px 10px;border:1px solid #e5e5e5">Yes</td>
      <td style="padding:8px 10px;border:1px solid #e5e5e5">$49 +</td>
      <td style="padding:8px 10px;border:1px solid #e5e5e5">Full — documentation-focused</td>
      <td style="padding:8px 10px;border:1px solid #e5e5e5">Yes</td>
      <td style="padding:8px 10px;border:1px solid #e5e5e5">App or browser</td>
      <td style="padding:8px 10px;border:1px solid #e5e5e5">Documentation-heavy, insurance-billing focus</td>
    </tr>
    <tr>
      <td style="padding:8px 10px;border:1px solid #e5e5e5;font-weight:600">Jane App</td>
      <td style="padding:8px 10px;border:1px solid #e5e5e5">Yes</td>
      <td style="padding:8px 10px;border:1px solid #e5e5e5">$79 +</td>
      <td style="padding:8px 10px;border:1px solid #e5e5e5">Full — multidisciplinary</td>
      <td style="padding:8px 10px;border:1px solid #e5e5e5">Yes</td>
      <td style="padding:8px 10px;border:1px solid #e5e5e5">None — browser</td>
      <td style="padding:8px 10px;border:1px solid #e5e5e5">Multidisciplinary clinics, allied health teams</td>
    </tr>
  </tbody>
</table>
</div>
<p style="font-size:0.82em;color:#777;margin-top:6px"><em>Pricing reflects publicly listed entry-tier solo-clinician plans as of 2026 and changes frequently — always verify current rates with the vendor before contracting.</em></p>`,
  accessibility: { role: 'article', ariaLabel: 'At-a-glance comparison of five telemental health platforms' },
};

// ── ADDITION 2 — §5 Privacy Expectations Script ─────────────────────
const PRIVACY_EXPECTATIONS_CALLOUT = {
  type: 'callout',
  calloutType: 'clinical',
  title: 'Privacy Expectations: Session-One Script',
  content: `<p style="margin-bottom:10px"><em>Privacy and confidentiality cannot be assumed — they have to be <strong>established</strong>. The consent document is the paper trail; the session-one conversation is where the client actually internalizes what's expected of them. Below is sample language you can adapt to your voice.</em></p>

<h4 style="margin-top:14px;margin-bottom:6px;color:#284157">1. The shared-responsibility frame</h4>
<p>"Before we get into clinical content, I want to talk about privacy for a few minutes. In an in-person office I control the environment — the soundproofing, the closed door, who can hear us. In telehealth, that control is shared. There are things I do on my end, and there are things I need you to do on yours. I want to walk you through both so we're on the same page."</p>

<h4 style="margin-top:14px;margin-bottom:6px;color:#284157">2. What you do on your end (clinician)</h4>
<p>"On my side: I'm in a private, locked room. No one else is in this space. My screen isn't visible to anyone. I use a HIPAA-compliant platform with a Business Associate Agreement, my device is encrypted, and I don't record sessions unless we've discussed it in advance and you've signed a separate release."</p>

<h4 style="margin-top:14px;margin-bottom:6px;color:#284157">3. What I need you to do on your end (client)</h4>
<p>"On your side: please choose a location where no one can overhear or see your screen — that means not a coffee shop, not the car if you're parked at work, not the living room if your housemate is in the next room with thin walls. Headphones are your single best privacy tool — they keep my voice from being heard by anyone near you. If you can't find a fully private space today, tell me — we have options, including rescheduling or switching to phone-only."</p>

<h4 style="margin-top:14px;margin-bottom:6px;color:#284157">4. The signal phrase (what to do if privacy is lost mid-session)</h4>
<p>"If at any point during a session someone walks in, calls out to you, or you stop being alone — just say <strong>"I'm going to need to pause for a minute."</strong> That's our signal. I'll stop what I'm doing immediately. You don't have to explain in the moment, and you never have to keep talking about clinical content if you don't feel safe doing so. We'll either wait, relocate, or reschedule — your call."</p>

<h4 style="margin-top:14px;margin-bottom:6px;color:#284157">5. What I can't guarantee (and why honesty matters here)</h4>
<p>"I want to be straightforward with you: I cannot guarantee the security of your device, your home network, or your physical environment. Those are yours to manage. What I can guarantee is that I'll be transparent if anything on my end changes, and that I'll never proceed with a session if I have reason to believe your privacy is compromised. If you ever have questions about the platform, the data it stores, or anything else, ask me — that's part of ongoing consent."</p>

<p style="margin-top:14px;padding-top:10px;border-top:1px dashed #D4A855;font-size:0.88em;color:#284157"><strong>Documentation tip:</strong> After this conversation, note in the session record: "Privacy expectations reviewed with client at session start; client identified [home office / bedroom / dedicated space] as their private session location; headphone use [confirmed / declined]; signal-phrase protocol explained and confirmed."</p>`,
};

// ── ADDITION 3 — §5 First Session Walkthrough scenarioTree ──────────
const FIRST_SESSION_WALKTHROUGH = {
  type: 'scenarioTree',
  scenarioTitle: 'The First Session: A Walkthrough',
  instructions:
    'You are 15 minutes from your first telehealth session with a new client, Jordan, who self-referred for anxiety. Walk through a compliant intake from connection to clinical hand-off. Pick the best next step at each decision point.',
  startNode: 'start',
  nodes: {
    start: {
      text: `<p style="background:#faf8f3;border-left:3px solid #D4A855;padding:10px 14px;margin-bottom:14px;font-style:italic">Pre-session check, 15 minutes before start. Jordan has completed the registration form but has not returned the signed informed-consent PDF you emailed two days ago.</p><p><strong>Step 1 of 5 — Pre-session.</strong> What do you do first?</p>`,
      choices: [
        {
          text: 'Connect at the scheduled time and review consent on screen during the session',
          next: 'fs_s1_proceed',
        },
        {
          text: 'Email Jordan now: "Please sign and return the consent before we connect. If you can\'t, we\'ll need to reschedule."',
          next: 'fs_s1_email',
        },
        {
          text: 'Cancel the session and reschedule for next week',
          next: 'fs_s1_cancel',
        },
      ],
    },
    fs_s1_proceed: {
      text: `<p style="color:#a02828"><strong>Risky.</strong> Georgia Rule 135-11 requires <em>both</em> written and verbal informed consent documented in the record <em>before</em> services are delivered. Reviewing consent on screen during a session is fine for the verbal portion — but the written, signed copy needs to exist before clinical content begins. Without it, your first session is non-compliant from minute one.</p>`,
      choices: [{ text: 'Show me the cleaner approach', next: 'fs_s1_email' }],
    },
    fs_s1_cancel: {
      text: `<p style="color:#a02828"><strong>Overcorrection.</strong> Outright cancellation isn't necessary and creates an unhelpful first impression for a new client. The consent gap is fixable in minutes if you act now.</p>`,
      choices: [{ text: 'Show me the right move', next: 'fs_s1_email' }],
    },
    fs_s1_email: {
      text: `<p style="color:#4A7C59"><strong>Correct.</strong> Brief, kind, and protects compliance. Most clients sign and return within minutes once prompted. If they can't, rescheduling is the right fallback — and you've documented the reason.</p><p style="margin-top:12px"><strong>Step 2 of 5 — Connection.</strong> Jordan returns the consent, you connect on time. The camera shows two people on the couch. Jordan waves; the other person is on their phone, not looking at the camera. What do you do?</p>`,
      choices: [
        {
          text: 'Say nothing — the other person isn\'t participating, so it\'s fine',
          next: 'fs_s2_ignore',
        },
        {
          text: '"Hi Jordan — before we get started, can you tell me who else is in the space with you?"',
          next: 'fs_s2_ask',
        },
        {
          text: 'End the session immediately for confidentiality breach',
          next: 'fs_s2_end',
        },
      ],
    },
    fs_s2_ignore: {
      text: `<p style="color:#a02828"><strong>Not safe.</strong> Confidentiality is not measured by whether the other person is "paying attention" — it's measured by whether they <em>can</em>. They can. You also haven't verified Jordan's identity yet (the other person could be the client). Ignoring this leaves the session non-compliant and Jordan unprotected.</p>`,
      choices: [{ text: 'How should I handle it?', next: 'fs_s2_ask' }],
    },
    fs_s2_end: {
      text: `<p style="color:#a02828"><strong>Too abrupt.</strong> A first reaction of "end the session" damages rapport and skips problem-solving. Most third-person-in-frame moments resolve with a clarifying question.</p>`,
      choices: [{ text: 'Show me the better script', next: 'fs_s2_ask' }],
    },
    fs_s2_ask: {
      text: `<p style="color:#4A7C59"><strong>Correct.</strong> A neutral, curious question. Jordan explains: "Oh — that\'s my roommate Sam, they\'re just waiting for an Uber, they\'ll be gone in five minutes." You have options: (a) wait the five minutes, (b) ask Sam to step out now, or (c) reschedule. All three are defensible if documented. Sam steps out.</p><p style="margin-top:12px"><strong>Step 3 of 5 — Identity & location.</strong> What do you verify next, before any clinical content begins?</p>`,
      choices: [
        {
          text: 'Confirm Jordan\'s full legal name and current physical address (city + state)',
          next: 'fs_s3_correct',
        },
        {
          text: 'Skip verification — Jordan\'s face matches the intake photo, that\'s enough',
          next: 'fs_s3_skip',
        },
        {
          text: 'Ask only the state, not the address',
          next: 'fs_s3_state_only',
        },
      ],
    },
    fs_s3_skip: {
      text: `<p style="color:#a02828"><strong>Insufficient.</strong> Photo-matching isn\'t identity verification — it\'s pattern recognition. You also need <em>location</em> verification for two reasons: (1) jurisdictional compliance (you\'re licensed in the state where the <em>client</em> is, not where you are), and (2) emergency response planning (if you need to call 911, dispatchers need an address).</p>`,
      choices: [{ text: 'What\'s the correct standard?', next: 'fs_s3_correct' }],
    },
    fs_s3_state_only: {
      text: `<p style="color:#a02828"><strong>Partial credit.</strong> State tells you about licensure compliance, but address tells you about emergency response. You need both, and you need to confirm them at the start of every session — clients travel, move, and visit family. Document the address in each session note.</p>`,
      choices: [{ text: 'Got it — what\'s the full standard?', next: 'fs_s3_correct' }],
    },
    fs_s3_correct: {
      text: `<p style="color:#4A7C59"><strong>Correct.</strong> Verify identity (name confirmation), state (licensure), and physical address (911 routing). Document all three in the session note. Jordan confirms: "Jordan Rivera, 1287 Oak Lane, Macon, Georgia." You\'re licensed in Georgia. ✓</p><p style="margin-top:12px"><strong>Step 4 of 5 — Privacy expectations & verbal consent.</strong> You\'re about to walk Jordan through your privacy script. Jordan interrupts: "I read the consent form already, do we have to do this again? I just want to start." What do you do?</p>`,
      choices: [
        {
          text: '"You\'re right, we can skip ahead — let\'s start with what brought you in."',
          next: 'fs_s4_skip',
        },
        {
          text: '"I hear you. Georgia requires me to confirm verbally that you understand the telehealth-specific parts. It takes three minutes. Then we go." (proceed with verbal review)',
          next: 'fs_s4_proceed',
        },
        {
          text: '"OK, let\'s do an abbreviated version — just the emergency procedures and you can ask questions if anything\'s unclear."',
          next: 'fs_s4_abbrev',
        },
      ],
    },
    fs_s4_skip: {
      text: `<p style="color:#a02828"><strong>Non-compliant.</strong> Rule 135-11 requires <em>both</em> verbal AND written consent, with the verbal portion documented. Skipping verbal review to accommodate impatience is a documented common compliance failure that comes up in Board audits. The three minutes is non-negotiable.</p>`,
      choices: [{ text: 'How do I handle this without losing rapport?', next: 'fs_s4_proceed' }],
    },
    fs_s4_abbrev: {
      text: `<p style="color:#a08028"><strong>Better than skipping, but still risky.</strong> "Abbreviated" can mean different things to different auditors. Safer to do the full verbal review every time — it normalizes the process for the client and gives you defensible documentation.</p>`,
      choices: [{ text: 'Show me the standard', next: 'fs_s4_proceed' }],
    },
    fs_s4_proceed: {
      text: `<p style="color:#4A7C59"><strong>Correct.</strong> Honor Jordan\'s urgency by naming the time-box, then complete the verbal review. This is exactly the situation the Privacy Expectations Script in this section is designed for — keep it conversational, hit the key points, document. Jordan listens, nods, says "got it." You document: "Verbal consent obtained; client confirmed understanding of privacy expectations and emergency procedures."</p><p style="margin-top:12px"><strong>Step 5 of 5 — Emergency contact & suitability re-check.</strong> Before transitioning to clinical content, what\'s your last step?</p>`,
      choices: [
        {
          text: 'Confirm an emergency contact who is NOT in the household + local crisis resources, and do a brief suitability check-in ("How are you feeling about being in this session right now?")',
          next: 'fs_s5_correct',
        },
        {
          text: 'Move directly to "What brings you in today?" — you can ask about emergency contacts at the end if needed',
          next: 'fs_s5_skip',
        },
        {
          text: 'Confirm the emergency contact only — skip the suitability check since they already passed pre-screening',
          next: 'fs_s5_partial',
        },
      ],
    },
    fs_s5_skip: {
      text: `<p style="color:#a02828"><strong>Don\'t do this.</strong> If a crisis develops mid-session and you don\'t have an emergency contact on file <em>before</em> clinical content starts, you\'re flying blind. Emergency contact verification is a session-start activity, not a wrap-up one. The session you most need it in is the one where it gets skipped.</p>`,
      choices: [{ text: 'What\'s the right protocol?', next: 'fs_s5_correct' }],
    },
    fs_s5_partial: {
      text: `<p style="color:#a08028"><strong>Close, but watch this.</strong> Pre-screening suitability is a snapshot; suitability on the day of the session can shift. A 10-second check-in ("How are you doing about being here today?") catches the days when someone is more dysregulated than the intake form suggested. It also lets you re-verify telehealth is the right modality <em>today</em>.</p>`,
      choices: [{ text: 'Got it — show me the full protocol', next: 'fs_s5_correct' }],
    },
    fs_s5_correct: {
      text: `<p style="color:#4A7C59"><strong>Correct.</strong> Three things, every first session:</p>
<ol style="margin:8px 0 12px 22px">
  <li><strong>Emergency contact</strong> — name, phone, relationship, and crucially <em>not in the household</em> (so they can be called if your client is the one in crisis at home)</li>
  <li><strong>Local crisis resources</strong> — confirm the client knows local crisis line + nearest ER address; you note both in the chart</li>
  <li><strong>Day-of suitability check-in</strong> — "How are you feeling about being here today?" — catches acute dysregulation before clinical content begins</li>
</ol>
<p>You\'ve now completed a compliant, defensible first telehealth session intake. Time elapsed: about 12 minutes. You move into the clinical interview with documentation in place, jurisdictional compliance confirmed, and a clear protocol if anything goes sideways.</p>
<p style="margin-top:14px;padding:10px 14px;background:#faf8f3;border-radius:6px;border-left:3px solid #4A7C59"><strong>The five non-negotiables of a compliant first telehealth session:</strong><br>
✓ Signed written consent in hand <em>before</em> connecting<br>
✓ Identity + state + address verified, documented<br>
✓ Verbal consent review with privacy expectations<br>
✓ Emergency contact not in household + local crisis resources<br>
✓ Day-of suitability check-in before clinical content begins</p>`,
      isEnd: true,
    },
  },
  accessibility: {
    role: 'application',
    ariaLabel: 'Scenario: walkthrough of a compliant first telehealth session',
  },
};

// ════════════════════════════════════════════════════════════════════
// Insertion helpers
// ════════════════════════════════════════════════════════════════════
function findSectionIndex(course, sectionTitleSubstring) {
  return (course.sections || []).findIndex(s =>
    typeof s.title === 'string' && s.title.toLowerCase().includes(sectionTitleSubstring.toLowerCase())
  );
}

function sectionAlreadyHas(section, markerSubstring) {
  return (section.contentBlocks || []).some(b => {
    const haystack = JSON.stringify(b);
    return haystack.includes(markerSubstring);
  });
}

function insertBlockBefore(section, predicate, newBlock) {
  const idx = section.contentBlocks.findIndex(predicate);
  if (idx < 0) {
    // Couldn't find anchor — append at end as safe fallback
    section.contentBlocks.push(newBlock);
    return 'appended-end';
  }
  section.contentBlocks.splice(idx, 0, newBlock);
  return `inserted-at-${idx}`;
}

function insertBlockAfter(section, predicate, newBlock) {
  const idx = section.contentBlocks.findIndex(predicate);
  if (idx < 0) {
    section.contentBlocks.push(newBlock);
    return 'appended-end';
  }
  section.contentBlocks.splice(idx + 1, 0, newBlock);
  return `inserted-at-${idx + 1}`;
}

// ════════════════════════════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════════════════════════════
function applyAll(course) {
  const changes = [];
  const sections = Array.isArray(course.sections) ? course.sections : [];

  // ─── PART A: Repair every scenarioTree in place ───
  sections.forEach((section, si) => {
    (section.contentBlocks || []).forEach((block, bi) => {
      if (block.type !== 'scenarioTree') return;
      const { block: repaired, changed } = repairScenarioTree(block);
      if (changed) {
        section.contentBlocks[bi] = repaired;
        changes.push({
          kind: 'scenarioTree repair',
          path: `sections[${si}].contentBlocks[${bi}]`,
          title: repaired.scenarioTitle || repaired.title || '(untitled)',
          nodeCount: Object.keys(repaired.nodes || {}).length,
        });
      }
    });
  });

  // ─── PART B-1: §4 platform comparison table ───
  const s4idx = findSectionIndex(course, 'Platform Selection');
  if (s4idx < 0) {
    changes.push({ kind: '⚠ skip', path: 'addition-1', note: '§4 not found by title match' });
  } else {
    const s4 = sections[s4idx];
    if (sectionAlreadyHas(s4, MARKERS.comparisonTable)) {
      changes.push({ kind: 'skip — already present', path: `sections[${s4idx}]`, title: 'comparison table' });
    } else {
      // Insert before the first accordion block
      const where = insertBlockBefore(
        s4,
        b => b.type === 'accordion',
        PLATFORM_COMPARISON_BLOCK
      );
      changes.push({
        kind: 'addition — §4 platform comparison table',
        path: `sections[${s4idx}]`,
        placement: where,
      });
    }
  }

  // ─── PART B-2: §5 Privacy Expectations Script callout ───
  // ─── PART B-3: §5 First Session Walkthrough scenarioTree ───
  const s5idx = findSectionIndex(course, 'Informed Consent');
  if (s5idx < 0) {
    changes.push({ kind: '⚠ skip', path: 'addition-2/3', note: '§5 not found by title match' });
  } else {
    const s5 = sections[s5idx];

    // Privacy script — insert after the flashcardDeck if present, otherwise after the last text block
    if (sectionAlreadyHas(s5, MARKERS.privacyScript)) {
      changes.push({
        kind: 'skip — already present',
        path: `sections[${s5idx}]`,
        title: 'Privacy Expectations Script',
      });
    } else {
      const flashIdx = s5.contentBlocks.findIndex(b => b.type === 'flashcardDeck');
      const where = flashIdx >= 0
        ? insertBlockAfter(s5, b => b === s5.contentBlocks[flashIdx], PRIVACY_EXPECTATIONS_CALLOUT)
        : insertBlockAfter(
            s5,
            b => b.type === 'text' || b.type === 'imageText',
            PRIVACY_EXPECTATIONS_CALLOUT
          );
      changes.push({
        kind: 'addition — §5 Privacy Expectations Script callout',
        path: `sections[${s5idx}]`,
        placement: where,
      });
    }

    // First Session Walkthrough — insert after the existing "Platform Switch" scenarioTree
    if (sectionAlreadyHas(s5, MARKERS.firstSessionScenario)) {
      changes.push({
        kind: 'skip — already present',
        path: `sections[${s5idx}]`,
        title: 'First Session Walkthrough',
      });
    } else {
      const stIdx = s5.contentBlocks.findIndex(b => b.type === 'scenarioTree');
      const where = stIdx >= 0
        ? insertBlockAfter(s5, b => b === s5.contentBlocks[stIdx], FIRST_SESSION_WALKTHROUGH)
        : insertBlockBefore(s5, b => b.type === 'reflection', FIRST_SESSION_WALKTHROUGH);
      changes.push({
        kind: 'addition — §5 First Session Walkthrough scenarioTree',
        path: `sections[${s5idx}]`,
        placement: where,
        nodeCount: Object.keys(FIRST_SESSION_WALKTHROUGH.nodes).length,
      });
    }
  }

  return { course, changes };
}

async function main() {
  console.log('═'.repeat(64));
  console.log('  CR-TMH601 Stage 2 — SCENARIOS REPAIR + CONTENT ADDITIONS');
  console.log('  Mode:', APPLY ? 'APPLY (writes)' : 'DRY RUN (no writes)');
  console.log('═'.repeat(64));

  await mongoose.connect(MONGODB_URI);
  console.log('✓ Connected to MongoDB');
  const db = mongoose.connection.db;
  const collection = db.collection('interactivecourses');

  for (const slug of TARGET_SLUGS) {
    console.log(`\n── slug: ${slug}`);
    const course = await collection.findOne({ slug });
    if (!course) {
      console.log('  (not found — skipping)');
      continue;
    }
    console.log(
      `  Found: "${course.title}" (${course.sections?.length || 0} sections)`
    );

    const { course: patched, changes } = applyAll(course);

    if (changes.length === 0) {
      console.log('  ✓ Nothing to do — already current.');
      continue;
    }

    // Summary
    const repairs = changes.filter(c => c.kind === 'scenarioTree repair');
    const additions = changes.filter(c => c.kind.startsWith('addition'));
    const skips = changes.filter(c => c.kind.startsWith('skip'));
    const warnings = changes.filter(c => c.kind.startsWith('⚠'));

    console.log(`  Repairs: ${repairs.length}  |  Additions: ${additions.length}  |  Skipped (idempotent): ${skips.length}  |  Warnings: ${warnings.length}`);

    repairs.forEach((c, i) => {
      console.log(`    [repair ${i + 1}] ${c.path}  "${c.title}"  (${c.nodeCount} nodes)`);
    });
    additions.forEach(c => {
      console.log(`    [add]    ${c.path}  ${c.placement || ''}  — ${c.kind.replace('addition — ', '')}`);
    });
    skips.forEach(c => console.log(`    [skip]   ${c.path}  ${c.title}`));
    warnings.forEach(c => console.log(`    [warn]   ${c.path}  ${c.note}`));

    if (!APPLY) {
      console.log('  (dry run — no write performed)');
      continue;
    }

    const result = await collection.updateOne(
      { slug },
      { $set: { sections: patched.sections, updatedAt: new Date() } }
    );
    console.log(`  ✓ Written. matched=${result.matchedCount} modified=${result.modifiedCount}`);

    // Verification re-read
    const verify = await collection.findOne(
      { slug },
      { projection: { sections: 1 } }
    );
    const stCount = (verify.sections || [])
      .flatMap(s => s.contentBlocks || [])
      .filter(b => b && b.type === 'scenarioTree').length;
    const stRepaired = (verify.sections || [])
      .flatMap(s => s.contentBlocks || [])
      .filter(
        b =>
          b &&
          b.type === 'scenarioTree' &&
          typeof b.scenarioTitle === 'string' &&
          b.startNode &&
          b.nodes &&
          typeof b.nodes === 'object' &&
          !Array.isArray(b.nodes)
      ).length;
    console.log(`  Verification: ${stRepaired}/${stCount} scenarioTrees in viewer-correct shape`);
  }

  await mongoose.disconnect();
  console.log('\n✓ Done.');
}

main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
