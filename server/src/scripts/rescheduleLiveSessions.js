// rescheduleLiveSessions.js
// Shifts scheduledStart + scheduledEnd of NAMED live sessions by a whole-day
// offset, preserving each session's duration. You pass the exact slugs, so
// nothing moves that you didn't name.
//
// SAFE BY DEFAULT: dry run prints old -> new (UTC and ET) for each. Nothing is
// written unless you pass --apply. Only touches status:'scheduled' sessions.
//
//   node src/scripts/rescheduleLiveSessions.js --slugs ethics-table-talk-part1-wk4-6pm,ethics-table-talk-part2-wk4-6pm --days 1
//   ...same line... --days 1 --apply
//
// Requires: MONGODB_URI
//
// NOTE — this moves the DATABASE times only. It does NOT (a) notify registrants,
// or (b) move/recreate the Whereby room. Handle those separately (see chat).

import mongoose from 'mongoose';
import LiveSession from '../models/LiveSession.js';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('No MONGODB_URI set'); process.exit(1); }

function arg(name) {
  const i = process.argv.indexOf(name);
  return i !== -1 ? process.argv[i + 1] : null;
}
const APPLY = process.argv.includes('--apply');
const slugs = (arg('--slugs') || '').split(',').map(s => s.trim()).filter(Boolean);
const days = Number(arg('--days'));

if (!slugs.length || !Number.isFinite(days) || days === 0) {
  console.error('Usage: --slugs a,b --days N [--apply]   (N may be negative; must be non-zero)');
  process.exit(1);
}
const DELTA_MS = days * 24 * 60 * 60 * 1000;

const fmt = (d) => {
  const utc = new Date(d).toLocaleString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) + ' UTC';
  const et = new Date(d).toLocaleString('en-US', { timeZone: 'America/New_York', weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) + ' ET';
  return `${et}  (${utc})`;
};

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log(`Connected.\nMode: ${APPLY ? 'APPLY (writing)' : 'DRY RUN (no changes)'}\nShift: ${days > 0 ? '+' : ''}${days} day(s)\n` + '='.repeat(90));

  let moved = 0, skipped = 0, missing = 0;
  for (const slug of slugs) {
    const s = await LiveSession.findOne({ slug });
    if (!s) { console.log(`? ${slug} — NOT FOUND`); missing++; continue; }
    if (s.status !== 'scheduled') { console.log(`- ${slug} — status is '${s.status}', not 'scheduled'. Skipping.`); skipped++; continue; }

    const newStart = new Date(new Date(s.scheduledStart).getTime() + DELTA_MS);
    const newEnd = new Date(new Date(s.scheduledEnd).getTime() + DELTA_MS);
    console.log(`\n> ${slug}`);
    console.log(`   start  ${fmt(s.scheduledStart)}  ->  ${fmt(newStart)}`);
    console.log(`   end    ${fmt(s.scheduledEnd)}  ->  ${fmt(newEnd)}`);

    if (APPLY) {
      const res = await LiveSession.updateOne(
        { _id: s._id, status: 'scheduled' },
        { $set: { scheduledStart: newStart, scheduledEnd: newEnd } }
      );
      const fresh = await LiveSession.findById(s._id).lean();
      const ok = new Date(fresh.scheduledStart).getTime() === newStart.getTime()
              && new Date(fresh.scheduledEnd).getTime() === newEnd.getTime();
      console.log(`   [written] matched=${res.matchedCount} modified=${res.modifiedCount}; read-back ${ok ? 'OK' : 'MISMATCH — CHECK'}`);
      moved++;
    }
  }

  console.log('\n' + '='.repeat(90));
  console.log(`Named: ${slugs.length}   ${APPLY ? 'Moved' : 'Would move'}: ${APPLY ? moved : slugs.length - skipped - missing}   Skipped: ${skipped}   Not found: ${missing}`);
  if (!APPLY) console.log('\nDRY RUN — nothing written. Re-run with --apply once the new times look right.');
  console.log('\nReminder: this moved DB times only. Registrants are NOT auto-notified, and the');
  console.log('Whereby room still points at the old window — regenerate the room + announce the new time.');
  await mongoose.disconnect();
}
run().catch(e => { console.error(e); process.exit(1); });
