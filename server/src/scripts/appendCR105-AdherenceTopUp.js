/**
 * appendCR105-AdherenceTopUp.js — adds ~680 canonical words to CR-105
 * CounselorReady · GAITP LLC · NBCC ACEP #7760
 *
 * WHY: post-repair canonical count is 5,665 — 335 under the 6,000/CE ACEP target
 * (1 CE). Adds three blocks (text → callout → multipleChoice) to Section 3,
 * inserted immediately before that section's reflection block. Content matches
 * the approved doc CR-105_Adherence_TopUp_680words.docx VERBATIM. Existing
 * blocks are never touched; prose is never rewritten.
 *
 * WRITE PATH: updateOne/$set (sections, wordCount, totalContentBlocks) with
 * canonical recompute + read-back verification. Idempotent — refuses to run
 * twice (checks for the new text block's heading).
 *
 * USAGE (from ~/project/src/server):
 *   node src/scripts/appendCR105-AdherenceTopUp.js           ← DRY RUN
 *   node src/scripts/appendCR105-AdherenceTopUp.js --apply   ← write
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Course } from '../models/InteractiveCourse.js';
import { countCourseWords, countBlockWords } from '../utils/courseWordCount.js';

dotenv.config();
const APPLY = process.argv.includes('--apply');
const CODE = 'CR-105';
const MARKER = 'Sustaining Adherence: The Counselor';

const TEXT_HTML = `<h2>Sustaining Adherence: The Counselor's Ongoing Role</h2>
<p>Medication adherence is rarely a one-time decision. Research consistently shows that roughly half of clients prescribed psychotropic medication deviate from the regimen within the first six months — skipping doses, adjusting timing, or discontinuing entirely — and most do so without telling their prescriber first. The counseling relationship, with its weekly contact and established trust, is often the first place these decisions surface. That makes the non-prescribing clinician a critical early-detection point in the treatment system, and it makes the adherence conversation a core clinical skill rather than an administrative afterthought.</p>
<p>The skill begins with how the question is asked. "Are you taking your medication?" invites a yes and closes the conversation. Normalizing, open-ended inquiry keeps it open: "A lot of people find it hard to take medication exactly as prescribed — what has that been like for you this month?" This framing communicates that imperfect adherence is expected human behavior, not a confession, and it reliably surfaces information a closed question never would (Ingersoll &amp; Rak, 2016).</p>
<p>When deviation surfaces, the counselor's task is exploration, not correction. Ambivalence about medication almost always carries meaning worth understanding: side effects the client finds intolerable or embarrassing, beliefs about what needing medication says about them, family or cultural messages about psychiatric treatment, cost and access barriers, or the common and clinically significant pattern of stopping because "I felt better." Each of these is legitimate counseling material. Exploring the client's reasoning with genuine curiosity — reflecting it, asking what they weighed, asking what they would want their prescriber to know — respects autonomy while keeping the treatment team informed. What remains outside scope is unchanged: the counselor does not advise starting, stopping, or adjusting any medication, and says so plainly when asked.</p>
<p>Timing of the prescriber loop matters. Abrupt discontinuation of several medication classes carries physiological risk — a client who reports having stopped suddenly warrants prompt prescriber notification, with the client's knowledge, rather than waiting for the next scheduled coordination contact (Stahl, 2021). Framing this transparently protects the alliance: "This is exactly the kind of thing Dr. Reyes needs to know about, and I'd like us to get it to her this week. Would you rather call her office yourself, or would you like me to send my observations with your permission?" The client stays the agent; the system stays informed.</p>`;

const NEW_BLOCKS = [
  {
    type: 'text',
    content: TEXT_HTML,
    textContent: TEXT_HTML
  },
  {
    type: 'callout',
    calloutType: 'clinical',
    title: 'Three Kinds of Adherence Barriers — and Where Each One Goes',
    content: '<p>When a client describes difficulty staying on a medication, sort what you hear into three buckets before deciding what to do with it.</p>',
    calloutItems: [
      'Practical barriers — cost, pharmacy access, complex dosing schedules, forgetting. Problem-solve these directly in session; they are squarely within counseling scope.',
      'Attitudinal barriers — stigma, identity concerns, family pressure, ambivalence about diagnosis. Explore these as counseling material; they respond to the same skills you use everywhere else.',
      'Physiological barriers — side effects, tolerability, feeling worse, or having already stopped. These route to the prescriber promptly and with the client\u2019s knowledge. Do not troubleshoot them yourself.'
    ]
  },
  {
    type: 'multipleChoice',
    question: 'During a session, a client mentions she stopped her antidepressant ten days ago because she "felt fine without it." Which response best reflects the non-prescribing clinician\u2019s role?',
    options: [
      { text: 'Encourage her to restart the medication right away, since discontinuation symptoms can be serious.', isCorrect: false },
      { text: 'Explore her reasoning with open curiosity, then arrange prompt prescriber notification with her knowledge and consent.', isCorrect: true },
      { text: 'Respect her autonomy by keeping the disclosure confidential unless she raises it again.', isCorrect: false },
      { text: 'Recommend she taper gradually using her remaining supply.', isCorrect: false }
    ],
    correctAnswer: 1,
    explanation: 'Advising restarting or tapering is prescribing-adjacent guidance outside the non-prescriber\u2019s scope (A, D). Sitting on the disclosure leaves the treatment team blind to a physiologically significant event (C). Exploring the decision as counseling material while promptly and transparently looping in the prescriber honors both the client\u2019s autonomy and the clinician\u2019s coordination responsibilities (B).'
  }
];

async function main() {
  if (!process.env.MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }
  await mongoose.connect(process.env.MONGODB_URI);

  console.log(`appendCR105 — ${APPLY ? '⚠ APPLY MODE' : 'DRY RUN (add --apply to write)'}\n`);

  const c = await Course.findOne({ courseCode: CODE }).lean();
  if (!c) { console.error(`❌ ${CODE} not found`); process.exit(1); }

  // idempotence guard
  const already = (c.sections || []).some(s => (s.contentBlocks || []).some(b =>
    typeof (b.content || b.textContent) === 'string' && (b.content || b.textContent).includes(MARKER)));
  if (already) { console.log('✅ Top-up already present — nothing to do.'); await mongoose.disconnect(); process.exit(0); }

  const sections = c.sections || [];
  const sIdx = sections.length - 1; // Section 3 of 3
  const blocks = sections[sIdx].contentBlocks || [];
  let insertAt = blocks.findIndex(b => b.type === 'reflection');
  if (insertAt === -1) insertAt = blocks.length;

  const addWords = NEW_BLOCKS.reduce((n, b) => n + countBlockWords(b), 0);
  console.log(`Target section: ${sIdx + 1} ("${sections[sIdx].title || ''}") — inserting 3 blocks at position ${insertAt + 1} of ${blocks.length + 1} (before reflection)`);
  console.log(`New canonical words from added blocks: ${addWords}`);

  blocks.splice(insertAt, 0, ...NEW_BLOCKS);
  blocks.forEach((b, i) => { b.order = i + 1; });
  sections[sIdx].contentBlocks = blocks;

  const wordCount = countCourseWords(c);
  const totalContentBlocks = sections.reduce((n, s) => n + (s.contentBlocks || []).length, 0);
  const target = (c.ceHours || 0) * 6000;
  console.log(`Course after insert: wordCount=${wordCount} (target ${target}) — ${wordCount >= target ? '✅ MEETS ACEP TARGET' : `⚠ still short by ${target - wordCount}`}, blocks=${totalContentBlocks}`);

  if (!APPLY) { console.log('\nDRY RUN complete — no writes. Re-run with --apply.'); await mongoose.disconnect(); process.exit(0); }

  await Course.updateOne({ _id: c._id }, { $set: { sections, wordCount, totalContentBlocks, updatedAt: new Date() } });
  const saved = await Course.findOne({ _id: c._id }).lean();
  const ok = saved && saved.wordCount === wordCount && saved.totalContentBlocks === totalContentBlocks &&
    (saved.sections[sIdx].contentBlocks || []).some(b => (b.content || '').includes(MARKER));
  console.log(ok
    ? `✅ written & verified — wordCount=${saved.wordCount}, totalContentBlocks=${saved.totalContentBlocks}`
    : '❌ WRITE VERIFY FAILED — inspect manually');
  await mongoose.disconnect();
  process.exit(ok ? 0 : 1);
}

main().catch(e => { console.error('APPEND ERROR:', e.message); process.exit(1); });
