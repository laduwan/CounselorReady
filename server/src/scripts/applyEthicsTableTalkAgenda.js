// applyEthicsTableTalkAgenda.js
// Copies the finished 22-row / 300-min agenda from the completed reference session
// (slug: live-continuing-education-webinar) into the real, currently-scheduled
// Ethics Table Talk cohort sessions, split at row 10 into a Part 1 half
// (rows 0-10, 145 min) and a Part 2 half (rows 11-21, 155 min).
//
// Only touches sessions whose slug matches:
//   ethics-table-talk-part1-wk*   -> Part 1 half
//   ethics-table-talk-part2-wk*   -> Part 2 half
// AND whose status is currently 'scheduled' (future sessions only — leaves the
// already-completed pilot/test sessions and stray dev sessions untouched).
//
// SAFE BY DEFAULT: dry run only, prints what WOULD change. Nothing is written
// unless you pass --apply.
//
// Run (dry run):   node server/src/scripts/applyEthicsTableTalkAgenda.js
// Run (apply):     node server/src/scripts/applyEthicsTableTalkAgenda.js --apply
// Requires: MONGODB_URI environment variable

import mongoose from 'mongoose';
import LiveSession from '../models/LiveSession.js';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ No MONGODB_URI environment variable set');
  process.exit(1);
}

const APPLY = process.argv.includes('--apply');
const TEMPLATE_SESSION_ID = '6a5f1184a4e309c498b9bd5a'; // live-continuing-education-webinar (completed, 5hr, 22 rows)
const SPLIT_AFTER_ORDER = 10; // rows 0-10 => Part 1, rows 11-21 => Part 2

const PART1_SLUG_RE = /^ethics-table-talk-part1-wk\d+-/;
const PART2_SLUG_RE = /^ethics-table-talk-part2-wk\d+-/;

function buildHalf(templateAgenda, half) {
  const rows = templateAgenda
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .filter(a => half === 'part1' ? a.order <= SPLIT_AFTER_ORDER : a.order > SPLIT_AFTER_ORDER);

  // Re-index order to 0..n for the half (clipIndex left as-is; template has none)
  return rows.map((a, i) => {
    const row = { order: i, type: a.type, title: a.title };
    if (a.durationMin != null) row.durationMin = a.durationMin;
    if (a.prompt) row.prompt = a.prompt;
    if (a.type === 'clip' && a.clipIndex != null) row.clipIndex = a.clipIndex;
    return row;
  });
}

function sumMinutes(agenda) {
  return agenda.reduce((s, a) => s + (a.durationMin || 0), 0);
}

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log(`Connected to MongoDB\nMode: ${APPLY ? 'APPLY (writing changes)' : 'DRY RUN (no changes will be made)'}\n`);

  const template = await LiveSession.findById(TEMPLATE_SESSION_ID).lean();
  if (!template) {
    console.error(`❌ Template session ${TEMPLATE_SESSION_ID} not found.`);
    process.exit(1);
  }
  if (!template.agenda || !template.agenda.length) {
    console.error('❌ Template session has no agenda to copy.');
    process.exit(1);
  }

  const part1Agenda = buildHalf(template.agenda, 'part1');
  const part2Agenda = buildHalf(template.agenda, 'part2');

  console.log(`Template: "${template.title}" (${template.slug})`);
  console.log(`  Part 1 half: ${part1Agenda.length} rows, ${sumMinutes(part1Agenda)} min`);
  console.log(`  Part 2 half: ${part2Agenda.length} rows, ${sumMinutes(part2Agenda)} min`);
  console.log('='.repeat(80));

  const candidates = await LiveSession.find({
    sessionType: 'live-course',
    status: 'scheduled',
    $or: [{ slug: { $regex: PART1_SLUG_RE } }, { slug: { $regex: PART2_SLUG_RE } }]
  }).sort({ scheduledStart: 1 });

  console.log(`\nFound ${candidates.length} matching scheduled sessions.\n`);

  let updated = 0, skippedNonEmpty = 0, errors = 0;

  for (const session of candidates) {
    const isPart1 = PART1_SLUG_RE.test(session.slug);
    const half = isPart1 ? part1Agenda : part2Agenda;
    const label = isPart1 ? 'Part 1' : 'Part 2';

    const start = session.scheduledStart
      ? new Date(session.scheduledStart).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
      : '—';

    if (session.agenda && session.agenda.length > 0) {
      console.log(`⏭  SKIP  ${session.slug}  (${start}) — already has ${session.agenda.length} agenda rows, not overwriting.`);
      skippedNonEmpty++;
      continue;
    }

    console.log(`${APPLY ? '✅ APPLY' : '🔍 WOULD APPLY'}  ${session.slug}  (${start}) — ${label}: ${half.length} rows, ${sumMinutes(half)} min`);

    if (APPLY) {
      try {
        session.agenda = half;
        await session.save(); // pre-validate re-runs hard-locks, matches PATCH route behavior
        updated++;
      } catch (err) {
        console.error(`   ❌ Failed to save ${session.slug}: ${err.message}`);
        errors++;
      }
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log(`\nMatched: ${candidates.length}   Skipped (non-empty): ${skippedNonEmpty}   ${APPLY ? `Updated: ${updated}   Errors: ${errors}` : 'Would update: ' + (candidates.length - skippedNonEmpty)}`);
  if (!APPLY) {
    console.log('\nThis was a DRY RUN — no changes were made. Re-run with --apply to write.');
  }

  // Read-back verification after writes
  if (APPLY && updated > 0) {
    console.log('\n--- Read-back verification ---');
    const verify = await LiveSession.find({
      sessionType: 'live-course',
      $or: [{ slug: { $regex: PART1_SLUG_RE } }, { slug: { $regex: PART2_SLUG_RE } }]
    }).sort({ scheduledStart: 1 }).lean();
    for (const s of verify) {
      console.log(`  ${s.slug}: ${s.agenda?.length || 0} rows, ${sumMinutes(s.agenda || [])} min`);
    }
  }

  await mongoose.disconnect();
  process.exit(0);
}

run().catch(err => {
  console.error('❌ Script error:', err);
  process.exit(1);
});
