// dumpLiveSessionAgendas.js
// READ-ONLY. Dumps agenda[] and clips[] for every live-course LiveSession so we can
// see the real state in Mongo (does NOT write anything).
// Run: node server/src/scripts/dumpLiveSessionAgendas.js
// Requires: MONGODB_URI environment variable

import mongoose from 'mongoose';
import LiveSession from '../models/LiveSession.js';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ No MONGODB_URI environment variable set');
  process.exit(1);
}

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB\n');

  const sessions = await LiveSession.find({ sessionType: 'live-course' })
    .sort({ scheduledStart: 1 })
    .lean();

  console.log(`Found ${sessions.length} live-course sessions\n`);
  console.log('='.repeat(80));

  let emptyAgendaCount = 0;
  let emptyClipsCount = 0;

  for (const s of sessions) {
    const start = s.scheduledStart ? new Date(s.scheduledStart).toLocaleString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit'
    }) : '—';

    console.log(`\n📌 ${s.title}`);
    console.log(`   id: ${s._id}   slug: ${s.slug}`);
    console.log(`   status: ${s.status}   scheduled: ${start}   published: ${s.isPublished}`);

    const clips = s.clips || [];
    console.log(`   clips: ${clips.length}`);
    if (!clips.length) emptyClipsCount++;
    clips.forEach((c, i) => {
      console.log(`     [${i}] "${c.title}" — ${c.durationSec}s — s3Key: ${c.s3Key}`);
    });

    const agenda = s.agenda || [];
    console.log(`   agenda rows: ${agenda.length}`);
    if (!agenda.length) {
      emptyAgendaCount++;
      console.log('     ⚠️  EMPTY — nothing saved for this session yet.');
    } else {
      agenda
        .slice()
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .forEach(a => {
          const clipRef = (a.type === 'clip' && a.clipIndex != null) ? ` (clipIndex ${a.clipIndex})` : '';
          const dur = a.durationMin ? `${a.durationMin}min` : 'no duration';
          console.log(`     [order ${a.order}] ${a.type} — "${a.title}" — ${dur}${clipRef}`);
          if (a.prompt) console.log(`         prompt: ${a.prompt}`);
        });
    }
    console.log('-'.repeat(80));
  }

  console.log(`\nSummary: ${emptyAgendaCount} of ${sessions.length} sessions have NO agenda saved.`);
  console.log(`Summary: ${emptyClipsCount} of ${sessions.length} sessions have NO clips registered.`);

  await mongoose.disconnect();
  process.exit(0);
}

run().catch(err => {
  console.error('❌ Script error:', err);
  process.exit(1);
});
