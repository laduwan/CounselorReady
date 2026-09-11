// regenerateWherebyRoom.js
// Regenerates the Whereby room for NAMED live sessions so the room's window matches
// the session's CURRENT scheduledStart/scheduledEnd. Run this AFTER rescheduling —
// a DB time change does not move the Whereby room, and a cancelled session's room is
// often already torn down, so attendees hit a dead room until this runs.
//
// Order is safe: create the NEW room first and save it, THEN delete the OLD one — so a
// failed create never leaves a session with no room. An empty whereby (room already
// deleted on cancel) is fine; it just mints a fresh one.
//
// SAFE BY DEFAULT: dry run prints the old meetingId + the new window each room will get,
// and calls Whereby for NOTHING. Only --apply creates/deletes rooms and writes.
//
//   node src/scripts/regenerateWherebyRoom.js --slugs ethics-table-talk-part1-wk4-6pm,ethics-table-talk-part2-wk4-6pm
//   ...same line... --apply
//
// Requires: MONGODB_URI and WHEREBY_API_KEY.

import mongoose from 'mongoose';
import LiveSession from '../models/LiveSession.js';
import { createMeeting, deleteMeeting } from '../services/wherebyService.js';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('No MONGODB_URI set'); process.exit(1); }

function arg(name) { const i = process.argv.indexOf(name); return i !== -1 ? process.argv[i + 1] : null; }
const APPLY = process.argv.includes('--apply');
const slugs = (arg('--slugs') || '').split(',').map(s => s.trim()).filter(Boolean);
if (!slugs.length) { console.error('Usage: --slugs a,b [--apply]'); process.exit(1); }
if (APPLY && !process.env.WHEREBY_API_KEY) { console.error('No WHEREBY_API_KEY set — required for --apply.'); process.exit(1); }

const fmt = (d) => new Date(d).toLocaleString('en-US', { timeZone: 'America/New_York', weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) + ' ET';

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log(`Connected.\nMode: ${APPLY ? 'APPLY (creating/deleting Whereby rooms)' : 'DRY RUN (no Whereby calls, no writes)'}\n` + '='.repeat(90));

  let done = 0, skipped = 0, missing = 0, failed = 0;
  for (const slug of slugs) {
    const session = await LiveSession.findOne({ slug });
    if (!session) { console.log(`? ${slug} — NOT FOUND`); missing++; continue; }
    if (session.status !== 'scheduled') { console.log(`- ${slug} — status '${session.status}', not 'scheduled'. Skipping.`); skipped++; continue; }
    if (session.sessionType !== 'live-course') { console.log(`- ${slug} — sessionType '${session.sessionType}'. Skipping.`); skipped++; continue; }

    const oldId = session.whereby?.meetingId || '(none)';
    console.log(`\n> ${slug}`);
    console.log(`   window   ${fmt(session.scheduledStart)}  →  ${fmt(session.scheduledEnd)}`);
    console.log(`   old room ${oldId}`);

    if (!APPLY) { console.log('   would: create a new room for the window above, save it, then delete the old room'); continue; }

    try {
      const room = await createMeeting(session);          // uses the CURRENT (new) dates
      session.whereby = room;
      session.markModified('whereby');
      await session.save();
      const fresh = await LiveSession.findById(session._id).lean();
      const ok = fresh.whereby?.meetingId === room.meetingId;
      console.log(`   new room ${room.meetingId}  ${ok ? '(read-back OK)' : '(READ-BACK MISMATCH — CHECK)'}`);
      if (oldId !== '(none)') { await deleteMeeting(oldId); console.log(`   old room ${oldId} deleted`); }
      done++;
    } catch (err) {
      console.log(`   ✗ FAILED: ${err.message} — old room left intact, nothing written.`);
      failed++;
    }
  }

  console.log('\n' + '='.repeat(90));
  console.log(`Named: ${slugs.length}   ${APPLY ? 'Regenerated' : 'Would regenerate'}: ${APPLY ? done : slugs.length - skipped - missing}   Skipped: ${skipped}   Not found: ${missing}   Failed: ${failed}`);
  if (!APPLY) console.log('\nDRY RUN — no Whereby calls made, nothing written. Re-run with --apply.');
  else console.log('\nReminder: registrants still need the new time announced — this only fixes the room.');
  await mongoose.disconnect();
}
run().catch(e => { console.error(e); process.exit(1); });
