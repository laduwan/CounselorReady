/**
 * Seed Ethics Table Talk Part 1+2 sessions — every week, alternating AM/PM
 * Week 1 (Jul 27/28) already created. This seeds weeks 2–8 (Aug 3 through Sep 15).
 * Run dry: node src/scripts/seedEthicsSplitSessions.js
 * Run write: node src/scripts/seedEthicsSplitSessions.js --write
 */
import mongoose from 'mongoose';
import LiveSession from '../../models/LiveSession.js';

const WRITE = process.argv.includes('--write');
const URI   = process.env.MONGODB_URI;
if (!URI) { console.error('MONGODB_URI required'); process.exit(1); }

// makeDate: convert ET local time to UTC Date (EDT = UTC-4)
function makeDate(dateStr, hour, minute) {
  const d = new Date(dateStr + 'T00:00:00Z');
  d.setUTCHours(hour + 4, minute, 0, 0);
  return d;
}

// Weeks 2–8: Mon Aug 3 through Mon Sep 14
// Jul 27 week = morning (8AM). Aug 3 week = evening (6PM). Alternates from there.
const WEEKS = [
  { monday: '2026-08-03', morning: false },
  { monday: '2026-08-10', morning: true  },
  { monday: '2026-08-17', morning: false },
  { monday: '2026-08-24', morning: true  },
  { monday: '2026-08-31', morning: false },
  { monday: '2026-09-07', morning: true  },
  { monday: '2026-09-14', morning: false },
];

function buildPair(week, idx) {
  const { monday, morning } = week;
  const startHour = morning ? 8  : 18;
  const endHour   = morning ? 10 : 20;
  const slotLabel = morning ? '8am' : '6pm';
  const weekNum   = idx + 2;

  const tueDate = (() => {
    const d = new Date(monday + 'T00:00:00Z');
    d.setUTCDate(d.getUTCDate() + 1);
    return d.toISOString().slice(0, 10);
  })();

  const presenter = {
    name: 'Kejuiana Johnson, MA, LPC, NCC, BC-TMH, CPCS',
    credentials: 'MA, LPC, NCC, BC-TMH, CPCS',
    licenseNumber: 'LPC009587',
    licenseState: 'Georgia'
  };

  return [
    {
      title: 'The Ethics Table Talk — Part 1 (Hours 1–2.5)',
      slug: `ethics-table-talk-part1-wk${weekNum}-${slotLabel}`,
      sessionType: 'live-course',
      ceuHours: 2.5,
      category: 'Ethics',
      nbccContentAreas: ['Professional Identity'],
      scheduledStart: makeDate(monday, startHour, 0),
      scheduledEnd:   makeDate(monday, endHour, 30),
      capacity: 40,
      price: 0,
      isPublished: false,
      description: 'Hours 1–2.5 of The Ethics Table Talk. Georgia Board Rule 135-7 and O.C.G.A. 43-10A-17: the catch-all disciplinary ground, privilege, and Case A. Part of a two-session series — attend both for 5.0 synchronous ethics CE hours.',
      presenter
    },
    {
      title: 'The Ethics Table Talk — Part 2 (Hours 2.5–5)',
      slug: `ethics-table-talk-part2-wk${weekNum}-${slotLabel}`,
      sessionType: 'live-course',
      ceuHours: 2.5,
      category: 'Ethics',
      nbccContentAreas: ['Professional Identity'],
      scheduledStart: makeDate(tueDate, startHour, 0),
      scheduledEnd:   makeDate(tueDate, endHour, 30),
      capacity: 40,
      price: 0,
      isPublished: false,
      description: 'Hours 2.5–5 of The Ethics Table Talk. Competence, supervision, the disciplinary panel, and advertising. Part of a two-session series — attend both for 5.0 synchronous ethics CE hours.',
      presenter
    }
  ];
}

await mongoose.connect(URI);
console.log('Connected');

const allSessions = WEEKS.flatMap((w, i) => buildPair(w, i));
console.log(`\n${WRITE ? 'WRITING' : 'DRY RUN'} — ${allSessions.length} sessions:\n`);

for (const s of allSessions) {
  const startET = s.scheduledStart.toLocaleString('en-US', { timeZone: 'America/New_York' });
  const endET   = s.scheduledEnd.toLocaleString('en-US', { timeZone: 'America/New_York' });
  console.log(`  ${s.slug}`);
  console.log(`    ${startET} → ${endET} ET`);
}

if (WRITE) {
  let created = 0, skipped = 0;
  for (const s of allSessions) {
    const exists = await LiveSession.findOne({ slug: s.slug });
    if (exists) { console.log(`SKIP: ${s.slug}`); skipped++; continue; }
    await LiveSession.create(s);
    console.log(`CREATED: ${s.slug}`);
    created++;
  }
  console.log(`\nDone — ${created} created, ${skipped} skipped.`);
} else {
  console.log('\nDry run complete. Add --write to insert.');
}

await mongoose.disconnect();
