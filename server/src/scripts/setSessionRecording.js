// setSessionRecording.js
// Turns recordingEnabled on/off for NAMED live sessions. Recording feeds the
// catch-up/transcription pipeline; with it on, createMeeting uses the cloud
// (S3) recording branch instead of type:'none'.
//
// SAFE BY DEFAULT: dry run prints old -> new for each. Nothing writes unless --apply.
// Never flips a supervision session on (HIPAA hard-lock is enforced by the model anyway).
//
//   node src/scripts/setSessionRecording.js --slugs ethics-table-talk-part1-wk4-6pm,ethics-table-talk-part2-wk4-6pm --on
//   ...same line... --on --apply
//
// Requires: MONGODB_URI

import mongoose from 'mongoose';
import LiveSession from '../models/LiveSession.js';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('No MONGODB_URI set'); process.exit(1); }

function arg(name) { const i = process.argv.indexOf(name); return i !== -1 ? process.argv[i + 1] : null; }
const APPLY = process.argv.includes('--apply');
const slugs = (arg('--slugs') || '').split(',').map(s => s.trim()).filter(Boolean);
const ON = process.argv.includes('--on');
const OFF = process.argv.includes('--off');
if (!slugs.length || (ON === OFF)) { console.error('Usage: --slugs a,b (--on | --off) [--apply]'); process.exit(1); }
const target = ON;

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log(`Connected.\nMode: ${APPLY ? 'APPLY (writing)' : 'DRY RUN'}   Set recordingEnabled = ${target}\n` + '='.repeat(80));

  let changed = 0, skipped = 0, missing = 0;
  for (const slug of slugs) {
    const s = await LiveSession.findOne({ slug });
    if (!s) { console.log(`? ${slug} — NOT FOUND`); missing++; continue; }
    if (s.sessionType === 'supervision' && target === true) {
      console.log(`- ${slug} — supervision session, recording is HIPAA-locked off. Skipping.`); skipped++; continue;
    }
    console.log(`> ${slug}: recordingEnabled ${s.recordingEnabled} -> ${target}`);
    if (APPLY) {
      await LiveSession.updateOne({ _id: s._id }, { $set: { recordingEnabled: target } });
      const fresh = await LiveSession.findById(s._id).lean();
      console.log(`   read-back: recordingEnabled = ${fresh.recordingEnabled}`);
      changed++;
    }
  }
  console.log('='.repeat(80));
  console.log(`Named: ${slugs.length}   ${APPLY ? 'Changed' : 'Would change'}: ${APPLY ? changed : slugs.length - skipped - missing}   Skipped: ${skipped}   Not found: ${missing}`);
  if (!APPLY) console.log('DRY RUN — nothing written. Re-run with --apply.');
  else console.log('\nNext: re-run regenerateWherebyRoom.js --apply to create the rooms via the cloud/S3 branch.');
  await mongoose.disconnect();
}
run().catch(e => { console.error(e); process.exit(1); });
