/**
 * Seed Ethics Table Talk Part 1 + Part 2 sessions
 * Mon+Tue alternating weeks, alternating times (8-10:30 PM ET / 6-8:30 PM ET)
 * Run: MONGODB_URI=... node src/scripts/seedEthicsSplitSessions.js
 * Add --write to actually insert (dry run by default)
 */

import mongoose from 'mongoose';
import LiveSession from '../models/LiveSession.js';

const WRITE = process.argv.includes('--write');
const URI   = process.env.MONGODB_URI;
if (!URI) { console.error('MONGODB_URI required'); process.exit(1); }

// EDT = UTC-4. Dates below are Mondays; Tuesday = Monday + 1 day.
// She already created week of July 27. Start from Aug 10.
// Alternating weeks: Aug 10, Aug 24, Sep 7, Sep 21
// Alternating times: 8-10:30PM, 6-8:30PM, 8-10:30PM, 6-8:30PM

const WEEKS = [
  { monday: '2026-08-10', time: '8pm' },
  { monday: '2026-08-24', time: '6pm' },
  { monday: '2026-09-07', time: '8pm' },
  { monday: '2026-09-21', time: '6pm' },
];

function makeDate(dateStr, hour, minute) {
  // EDT = UTC-4; hour is local ET
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCHours(hour + 4, minute); // convert ET to UTC
  return d;
}

function buildPair(week, idx) {
  const is8pm = week.time === '8pm';
  const startHour = is8pm ? 20 : 18;
  const endHour   = is8pm ? 22 : 20;
  const endMin    = 30; // both end :30

  const monDate = week.monday;
  const tueDate = (() => {
    const d = new Date(monDate); d.setUTCDate(d.getUTCDate() + 1);
    return d.toISOString().slice(0,10);
  })();

  const weekNum = idx + 2; // week 1 = already created, we start at 2
  const timeLabel = is8pm ? '8pm' : '6pm';

  return [
    {
      title: 'The Ethics Table Talk — Part 1 (Hours 1–2.5)',
      slug: `ethics-table-talk-part1-wk${weekNum}-${timeLabel}`,
      sessionType: 'live-course',
      ceuHours: 2.5,
      category: 'Ethics',
      nbccContentAreas: ['Professional Identity'],
      scheduledStart: makeDate(monDate, startHour, 0),
      scheduledEnd:   makeDate(monDate, endHour, endMin),
      capacity: 40,
      price: 0, // series handles pricing
      isPublished: false,
      description: 'Hours 1–2.5 of The Ethics Table Talk. Covers Georgia Board Rule 135-7 and O.C.G.A. 43-10A-17: the catch-all disciplinary ground, privilege, and Case A. Part of a two-session series — attend both for 5.0 synchronous ethics CE hours.',
      presenter: {
        name: 'Kejuiana Johnson, MA, LPC, NCC, BC-TMH, CPCS',
        credentials: 'MA, LPC, NCC, BC-TMH, CPCS',
        licenseNumber: 'LPC009587',
        licenseState: 'Georgia'
      }
    },
    {
      title: 'The Ethics Table Talk — Part 2 (Hours 2.5–5)',
      slug: `ethics-table-talk-part2-wk${weekNum}-${timeLabel}`,
      sessionType: 'live-course',
      ceuHours: 2.5,
      category: 'Ethics',
      nbccContentAreas: ['Professional Identity'],
      scheduledStart: makeDate(tueDate, startHour, 0),
      scheduledEnd:   makeDate(tueDate, endHour, endMin),
      capacity: 40,
      price: 0,
      isPublished: false,
      description: 'Hours 2.5–5 of The Ethics Table Talk. Covers competence, supervision, the disciplinary panel, and advertising. Part of a two-session series — attend both for 5.0 synchronous ethics CE hours.',
      presenter: {
        name: 'Kejuiana Johnson, MA, LPC, NCC, BC-TMH, CPCS',
        credentials: 'MA, LPC, NCC, BC-TMH, CPCS',
        licenseNumber: 'LPC009587',
        licenseState: 'Georgia'
      }
    }
  ];
}

await mongoose.connect(URI);
console.log('Connected');

const allSessions = WEEKS.flatMap((w, i) => buildPair(w, i));

console.log(`\n${WRITE ? 'WRITING' : 'DRY RUN'} — ${allSessions.length} sessions:\n`);

for (const s of allSessions) {
  const startLocal = new Date(s.scheduledStart);
  const endLocal   = new Date(s.scheduledEnd);
  console.log(`  ${s.slug}`);
  console.log(`    Mon/Tue: ${startLocal.toUTCString()} → ${endLocal.toUTCString()}`);
  console.log(`    ${s.ceuHours} CE hrs · price: $${s.price} · published: ${s.isPublished}`);
}

if (WRITE) {
  let created = 0;
  for (const s of allSessions) {
    const exists = await LiveSession.findOne({ slug: s.slug });
    if (exists) { console.log(`SKIP (exists): ${s.slug}`); continue; }
    await LiveSession.create(s);
    console.log(`CREATED: ${s.slug}`);
    created++;
  }
  console.log(`\nDone — ${created} sessions created.`);
} else {
  console.log('\nDry run complete. Add --write to insert.');
}

await mongoose.disconnect();
