// appendAgencyBlock.js
// Appends the facilitator guide's "Appendix — The agency block" to the host-only
// teleprompter `script` of the Hour 4 segment "Disciplinary panel — five real
// orders", as a clearly marked ALTERNATE. Per GA-Ethics-COMPLETE-Facilitator-Guide.md
// the agency block is a 20-minute SUBSTITUTE for the panel (not additional time),
// so it lives inside the panel segment — it adds no agenda minutes and never
// changes CE timing. Host scrolls past the panel copy to reach it.
//
// Scenario text, rule citations, and discussion content are verbatim from the guide;
// spoken lead-ins are marked plainly; facilitator actions use [DO]/[SLIDE]/[DISCUSS]/[NOTE].
//
// Targets: sessionType 'live-course', status 'scheduled', any agenda segment whose
// title is exactly "Disciplinary panel — five real orders".
// Idempotent: skips any segment whose script already contains the marker.
// Re-running importEthicsFacilitatorScripts.js --apply OVERWRITES scripts and would
// drop this block — re-run this script afterwards.
//
// SAFE BY DEFAULT: dry run lists targets + char counts. Writes only with --apply,
// via positional updateOne/$set on that one segment, then reads back.
//   node src/scripts/appendAgencyBlock.js
//   node src/scripts/appendAgencyBlock.js --apply
//
// Requires: MONGODB_URI

import mongoose from 'mongoose';
import LiveSession from '../models/LiveSession.js';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('No MONGODB_URI set'); process.exit(1); }
const APPLY = process.argv.includes('--apply');

const SEGMENT_TITLE = 'Disciplinary panel — five real orders';
const MARKER = '[NOTE — ALTERNATE · THE AGENCY BLOCK';

const AGENCY_BLOCK = `

────────────────────────────────────────

${MARKER} · 20 min]
[NOTE — Everything below REPLACES the disciplinary panel above. Use it only to keep Hour 4 entirely on supervision, or when running without the panel material. It runs 5 min shorter than the panel — give the extra time to Case D report-out or the close.]

Okay — change of format. Seven scenarios, rapid-fire. I read it, you get ninety seconds at your table, hands up, and we move. We'll stop on three of them.

Same question every single time — and it's the sentence we opened the hour with:

[SLIDE — "Does 135-7-.04(1) leave you individually accountable here, and what does that require you to do?"]

[DO · ~90s each — read 1–7, hands up, move on. Stop for discussion only on 2, 4, 7:
1. Your agency requires notes closed within twenty-four hours. You carry forty-five clients. Your notes are thin and you know it.
2. Agency policy directs you not to document suicidal ideation in the EHR, but on a separate risk form that isn't part of the clinical record.
3. You are asked to sign off on progress notes written by unlicensed staff whose work you did not supervise.
4. The agency assigns you a population you have no training in, and tells you everyone here learns on the job.
5. Agency policy caps sessions at eight regardless of clinical need, with no exception process.
6. Your supervisor instructs you to close a case you believe is unsafe to close.
7. The agency's release form authorizes disclosure to "the treatment team," undefined, and is signed at intake with no discussion.]

[DISCUSS · 4 min — Item 2]
Let's go back to number two. That policy creates a record that is incomplete on the single most important clinical fact. And remember Hour 1 — under 43-10A-17(h)(3), those records become admissible in a board proceeding regardless of privilege. A record split across two systems, one of which isn't the clinical record, is a record designed to be incomplete when it matters.
[NOTE — connect to 135-7-.01(1)]

[DISCUSS · 4 min — Item 4]
Number four is a direct callback to Hour 3 — 135-7-.02(2)(e): university level graduate training or substantially equivalent supervised experience. Agency assignment is not training. Individual accountability under .04(1) means the agency's staffing decision is not a defense to your competence obligation.

[DISCUSS · 4 min — Item 7]
Number seven. Go to 135-7-.03(2)(a)(2) and the consent standard — the licensee must describe the information to be revealed and the persons to whom it will be revealed before obtaining consent. An undefined "treatment team" doesn't meet that. And under (2)(d), the licensee is responsible for protecting confidences from disclosure by employees and associates.

[NOTE — land it back on the hour's opening sentence: none of these seven transfer accountability. "It was agency policy" was answered in the principle statement, before the list ever started.]`;

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log(`Connected.\nMode: ${APPLY ? 'APPLY' : 'DRY RUN (nothing written)'}\n` + '='.repeat(90));

  const sessions = await LiveSession.find({
    sessionType: 'live-course',
    status: 'scheduled',
    'agenda.title': SEGMENT_TITLE
  }).sort({ scheduledStart: 1 });

  let done = 0, skipped = 0, failed = 0;
  for (const s of sessions) {
    const seg = s.agenda.find(a => a.title === SEGMENT_TITLE);
    const before = (seg.script || '').length;
    const when = s.scheduledStart.toLocaleString('en-US', { timeZone: 'America/New_York', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    console.log(`\n> ${s.slug}  (${when} ET)  segment #${seg.order}  script ${before} ch`);

    if ((seg.script || '').includes(MARKER)) { console.log('   already has the agency block — skipping'); skipped++; continue; }
    if (!before) { console.log('   segment has NO panel script yet — run importEthicsFacilitatorScripts.js / copy first. Skipping.'); skipped++; continue; }

    const next = (seg.script || '').replace(/\s+$/, '') + AGENCY_BLOCK;
    console.log(`   would append ${AGENCY_BLOCK.length} ch → ${next.length} ch`);
    if (!APPLY) continue;

    await LiveSession.updateOne(
      { _id: s._id, 'agenda._id': seg._id },
      { $set: { 'agenda.$.script': next } }
    );
    const back = await LiveSession.findById(s._id).lean();
    const bSeg = back.agenda.find(a => String(a._id) === String(seg._id));
    const ok = bSeg && bSeg.script === next && back.agenda.length === s.agenda.length;
    console.log(`   read-back: ${bSeg ? bSeg.script.length : 0} ch, ${back.agenda.length} segments — ${ok ? 'OK' : 'MISMATCH'}`);
    ok ? done++ : failed++;
  }

  console.log('\n' + '='.repeat(90));
  console.log(`Targets ${sessions.length}   ${APPLY ? 'Updated' : 'Would update'} ${APPLY ? done : sessions.length - skipped}   Skipped ${skipped}   Failed ${failed}`);
  if (!APPLY) console.log('\nDRY RUN — re-run with --apply.');
  if (failed) process.exitCode = 1;
}

run()
  .catch(err => { console.error('FAILED:', err.message); process.exitCode = 1; })
  .finally(() => mongoose.disconnect());
