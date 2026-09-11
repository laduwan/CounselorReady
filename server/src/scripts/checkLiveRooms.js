// checkLiveRooms.js
// Checks every SCHEDULED live session starting within --days (default 7) against
// Whereby and reports its room: ok / missing / stale (window doesn't cover the
// session). Same logic the 6-hourly self-heal job and /join use
// (services/liveRoomService.js).
//
// SAFE BY DEFAULT: dry run calls Whereby read-only (GET) and writes nothing.
// --apply creates missing rooms, re-creates stale ones, and emails the admin.
//
//   node src/scripts/checkLiveRooms.js
//   node src/scripts/checkLiveRooms.js --days 30
//   node src/scripts/checkLiveRooms.js --apply
//
// Requires: MONGODB_URI, WHEREBY_API_KEY

import mongoose from 'mongoose';
import { runLiveRoomCheck } from '../services/liveRoomService.js';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('No MONGODB_URI set'); process.exit(1); }
if (!process.env.WHEREBY_API_KEY) { console.error('No WHEREBY_API_KEY set'); process.exit(1); }

function arg(name) { const i = process.argv.indexOf(name); return i !== -1 ? process.argv[i + 1] : null; }
const APPLY = process.argv.includes('--apply');
const days = Number(arg('--days')) || 7;

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log(`Connected.\nMode: ${APPLY ? 'APPLY (creates/re-creates rooms, emails admin)' : 'DRY RUN (Whereby read-only, nothing written)'}   Window: next ${days} days\n` + '='.repeat(90));

  const stats = await runLiveRoomCheck({ days, dryRun: !APPLY, source: 'manual checkLiveRooms.js' });
  for (const r of stats.results) {
    const tag = { none: 'OK      ', created: 'CREATED ', regenerated: 'RE-MADE ', 'would-create': 'MISSING ', 'would-regenerate': 'STALE   ', skipped: 'SKIPPED ', failed: 'FAILED  ' }[r.action] || r.action;
    console.log(`${tag} ${r.starts.padEnd(26)} ${r.slug}\n         ${r.detail}${r.meetingId && r.action !== 'none' ? ` → ${r.meetingId}` : ''}${r.error ? `  (${r.error})` : ''}`);
  }
  console.log('='.repeat(90));
  console.log(`Scanned ${stats.scanned}   OK ${stats.ok}   ${APPLY ? 'Fixed' : 'Need fixing'} ${stats.fixed}   Skipped ${stats.skipped}   Failed ${stats.failed}`);
  if (!APPLY && stats.fixed) console.log('\nDRY RUN — re-run with --apply to fix.');
}

run()
  .catch(err => { console.error('FAILED:', err.message); process.exitCode = 1; })
  .finally(() => mongoose.disconnect());
