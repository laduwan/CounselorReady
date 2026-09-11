// addSessionBreak.js
// Inserts ONE declared break into a live-course session, after a given agenda
// segment, and EXTENDS scheduledEnd by the break length so NBCC instructional
// minutes (scheduled duration − breaks) stay equal to ceuHours × 60.
//
// Writes, in a single updateOne/$set:
//   breaks[]      + { label, startsAt, durationMin }   (drives attendance clipping
//                   in attendedMinutesAdjusted + the 3-min resume reminder)
//   agenda[]      + a type:'break' segment after --after, orders renumbered
//                   (so the host console + attendee NOW card show the break)
//   scheduledEnd  + durationMin
//
// startsAt = scheduledStart + sum(durationMin of agenda segments 0..--after).
//
// Guards: live-course + scheduled only; refuses if the agenda already has a
// 'break' segment or breaks[] is non-empty (no double-inserts); refuses if
// agenda minutes ≠ current window (timing would be wrong).
//
// AFTER --apply you MUST re-run regenerateWherebyRoom.js for the slug — the
// Whereby room's endDate is still the OLD scheduledEnd.
//
// SAFE BY DEFAULT: dry run prints before/after. Writes only with --apply.
//   node src/scripts/addSessionBreak.js --slug ethics-table-talk-5hr-sep26 --after 10 --min 15
//   ...same line... --apply
//   Optional: --label "Break"
//
// Requires: MONGODB_URI

import mongoose from 'mongoose';
import LiveSession from '../models/LiveSession.js';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('No MONGODB_URI set'); process.exit(1); }

function arg(name) { const i = process.argv.indexOf(name); return i !== -1 ? process.argv[i + 1] : null; }
const APPLY = process.argv.includes('--apply');
const slug = (arg('--slug') || '').trim();
const after = Number(arg('--after'));
const min = Number(arg('--min'));
const label = arg('--label') || 'Break';
if (!slug || !Number.isInteger(after) || !Number.isInteger(min) || min < 1 || min > 120) {
  console.error('Usage: --slug <slug> --after <agendaOrder> --min <1-120> [--label "Break"] [--apply]');
  process.exit(1);
}

const fmt = (d) => new Date(d).toLocaleString('en-US', { timeZone: 'America/New_York', weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) + ' ET';
const sumMin = (a) => a.reduce((n, s) => n + (s.durationMin || 0), 0);

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log(`Connected.\nMode: ${APPLY ? 'APPLY' : 'DRY RUN (nothing written)'}\n` + '='.repeat(90));

  const s = await LiveSession.findOne({ slug }).lean();
  if (!s) throw new Error(`Not found: ${slug}`);
  if (s.sessionType !== 'live-course') throw new Error(`sessionType '${s.sessionType}' — live-course only.`);
  if (s.status !== 'scheduled') throw new Error(`status '${s.status}' — scheduled only.`);

  const agenda = [...(s.agenda || [])].sort((a, b) => a.order - b.order);
  if (!agenda.length) throw new Error('Agenda is empty.');
  if (agenda.some(a => a.type === 'break')) throw new Error('Agenda already has a break segment. Aborting (no double-insert).');
  if ((s.breaks || []).length) throw new Error(`breaks[] already has ${s.breaks.length} entr(ies). Aborting (no double-insert).`);
  const idx = agenda.findIndex(a => a.order === after);
  if (idx === -1 || idx === agenda.length - 1) throw new Error(`--after ${after} must be an existing, non-final agenda order.`);

  const start = new Date(s.scheduledStart);
  const oldEnd = new Date(s.scheduledEnd);
  const windowMin = Math.round((oldEnd - start) / 60000);
  const agendaMin = sumMin(agenda);
  if (agendaMin !== windowMin) throw new Error(`Agenda minutes (${agendaMin}) ≠ window (${windowMin}). Fix timing first.`);

  const offsetMin = sumMin(agenda.slice(0, idx + 1));
  const breakStart = new Date(start.getTime() + offsetMin * 60000);
  const newEnd = new Date(oldEnd.getTime() + min * 60000);

  const resumeStr = new Date(breakStart.getTime() + min * 60000).toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit' }) + ' ET';
  const breakSeg = { type: 'break', title: label, durationMin: min, prompt: `${label} — back at ${resumeStr}` };
  const newAgenda = [...agenda.slice(0, idx + 1), breakSeg, ...agenda.slice(idx + 1)]
    .map((a, i) => { const { _id, ...rest } = a; return { ...rest, order: i }; });
  const newBreaks = [{ label, startsAt: breakStart, durationMin: min }];

  const instrMin = Math.round((newEnd - start) / 60000) - min;
  const targetMin = Math.round((s.ceuHours || 0) * 60);

  console.log(`> ${slug}   (ceuHours ${s.ceuHours})`);
  console.log(`   window   ${fmt(start)} → ${fmt(oldEnd)}   (${windowMin} min)`);
  console.log(`   break    after #${after} "${agenda[idx].title}"`);
  console.log(`            ${fmt(breakStart)} → ${fmt(new Date(breakStart.getTime() + min * 60000))}   (${min} min, "${label}")`);
  console.log(`   new end  ${fmt(newEnd)}`);
  console.log(`   agenda   ${agenda.length} → ${newAgenda.length} segments, ${sumMin(newAgenda)} min`);
  console.log(`   NBCC     instructional ${instrMin} min vs ceuHours×60 = ${targetMin}  ${instrMin === targetMin ? 'OK' : 'MISMATCH'}`);
  if (instrMin !== targetMin) throw new Error('Instructional minutes would not equal ceuHours × 60. Aborting.');

  if (!APPLY) { console.log('\nDRY RUN — nothing written. Re-run with --apply.'); return; }

  await LiveSession.updateOne({ _id: s._id }, { $set: { agenda: newAgenda, breaks: newBreaks, scheduledEnd: newEnd } });

  const back = await LiveSession.findById(s._id);
  const ok = back.agenda.length === newAgenda.length
    && back.breaks.length === 1
    && back.scheduledEnd.getTime() === newEnd.getTime()
    && back.instructionalMinutes() === targetMin;
  console.log(`\nRead-back: ${back.agenda.length} segments, ${back.breaks.length} break, end ${fmt(back.scheduledEnd)}, instructional ${back.instructionalMinutes()} — ${ok ? 'OK' : 'MISMATCH'}`);
  if (!ok) { process.exitCode = 1; return; }
  console.log(`\nNEXT: node src/scripts/regenerateWherebyRoom.js --slugs ${slug} --apply   (room endDate is still the old time)`);
}

run()
  .catch(err => { console.error('FAILED:', err.message); process.exitCode = 1; })
  .finally(() => mongoose.disconnect());
