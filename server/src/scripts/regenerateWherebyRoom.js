// copyEthicsAgendaToSession.js
// Copies the scripted Run of Show (agenda[] incl. host-only `script` teleprompter
// text) from one or more SOURCE live sessions into a TARGET session, in the order
// given, renumbering `order` 0..N-1. Built for the 5-hour single-day Ethics Table
// Talk, which is created with an empty agenda and is NOT matched by
// importEthicsFacilitatorScripts.js (that script only targets *-part1-wk* / *-part2-wk*).
//
// Default sources: Part 1 + Part 2 of the most recent scheduled cohort (wk8).
// Part 1 = 145 min, Part 2 = 155 min  → 300 min = exactly one 5-hour session.
//
// Guards: target must be sessionType 'live-course' and status 'scheduled'.
//         Refuses to overwrite a non-empty target agenda unless --force.
//         Sources are READ ONLY — never modified.
//
// SAFE BY DEFAULT: dry run prints every segment + minutes + script chars. Writes
// only with --apply, via updateOne/$set, then reads back and verifies.
//
//   node src/scripts/copyEthicsAgendaToSession.js --target ethics-table-talk-5hr-sep26
//   ...same line... --apply
//   Optional: --from slugA,slugB   --force
//
// Requires: MONGODB_URI

import mongoose from 'mongoose';
import LiveSession from '../models/LiveSession.js';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('No MONGODB_URI set'); process.exit(1); }

function arg(name) { const i = process.argv.indexOf(name); return i !== -1 ? process.argv[i + 1] : null; }
const APPLY = process.argv.includes('--apply');
const FORCE = process.argv.includes('--force');
const target = (arg('--target') || '').trim();
const sources = (arg('--from') || 'ethics-table-talk-part1-wk8-6pm,ethics-table-talk-part2-wk8-6pm')
  .split(',').map(s => s.trim()).filter(Boolean);
if (!target) { console.error('Usage: --target <slug> [--from a,b] [--force] [--apply]'); process.exit(1); }

const len = (s) => (s || '').length;

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log(`Connected.\nMode: ${APPLY ? 'APPLY' : 'DRY RUN (nothing written)'}\n` + '='.repeat(90));

  const t = await LiveSession.findOne({ slug: target }).lean();
  if (!t) throw new Error(`Target not found: ${target}`);
  if (t.sessionType !== 'live-course') throw new Error(`Target sessionType is '${t.sessionType}', not 'live-course'.`);
  if (t.status !== 'scheduled') throw new Error(`Target status is '${t.status}', not 'scheduled'.`);
  if ((t.agenda || []).length && !FORCE) {
    throw new Error(`Target already has ${t.agenda.length} agenda segments. Re-run with --force to overwrite.`);
  }

  const agenda = [];
  for (const slug of sources) {
    const s = await LiveSession.findOne({ slug }).lean();
    if (!s) throw new Error(`Source not found: ${slug}`);
    const segs = [...(s.agenda || [])].sort((a, b) => a.order - b.order);
    if (!segs.length) throw new Error(`Source ${slug} has an empty agenda.`);
    console.log(`\n> source ${slug}  (${segs.length} segments)`);
    for (const seg of segs) {
      const copy = { order: agenda.length, type: seg.type, title: seg.title, durationMin: seg.durationMin };
      if (seg.prompt) copy.prompt = seg.prompt;
      if (seg.script) copy.script = seg.script;
      if (seg.clipIndex !== undefined && seg.clipIndex !== null) copy.clipIndex = seg.clipIndex;
      agenda.push(copy);
      console.log(`   ${String(copy.order).padStart(2)}  ${String(copy.durationMin).padStart(3)}m  ${copy.type.padEnd(10)}  script ${String(len(copy.script)).padStart(5)}ch  ${copy.title}`);
    }
  }

  if (agenda.some(a => a.clipIndex !== undefined) && !(t.clips || []).length) {
    throw new Error('Source segments reference clips but the target has no clips — clipIndex would dangle. Aborting.');
  }

  const totalMin = agenda.reduce((n, a) => n + (a.durationMin || 0), 0);
  const windowMin = Math.round((new Date(t.scheduledEnd) - new Date(t.scheduledStart)) / 60000);
  const breakMin = (t.breaks || []).reduce((n, b) => n + (b.durationMin || 0), 0);
  const scripted = agenda.filter(a => len(a.script) > 200).length;
  const chars = agenda.reduce((n, a) => n + len(a.script), 0);

  console.log('\n' + '='.repeat(90));
  console.log(`Target   ${target}`);
  console.log(`Segments ${agenda.length}  |  scripted ${scripted}/${agenda.length}  |  script chars ${chars}`);
  console.log(`Minutes  agenda ${totalMin}  |  breaks ${breakMin}  |  scheduled window ${windowMin}`);
  if (totalMin + breakMin > windowMin) console.log(`WARNING  agenda + breaks exceed the window by ${totalMin + breakMin - windowMin} min.`);

  if (!APPLY) { console.log('\nDRY RUN — nothing written. Re-run with --apply.'); return; }

  await LiveSession.updateOne({ _id: t._id }, { $set: { agenda } });

  const back = await LiveSession.findById(t._id).lean();
  const bChars = (back.agenda || []).reduce((n, a) => n + len(a.script), 0);
  const ok = back.agenda.length === agenda.length && bChars === chars;
  console.log(`\nRead-back: ${back.agenda.length} segments, ${bChars} script chars — ${ok ? 'OK' : 'MISMATCH'}`);
  if (!ok) process.exitCode = 1;
}

run()
  .catch(err => { console.error('FAILED:', err.message); process.exitCode = 1; })
  .finally(() => mongoose.disconnect());
