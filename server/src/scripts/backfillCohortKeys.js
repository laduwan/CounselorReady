/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */

/**
 * BACKFILL cohortKey ON EXISTING LIVE SESSIONS
 *
 * A "cohort" is one complete CE offering the learner attends: either a single
 * full-length session, or a Part 1 + Part 2 pair. Registering for any member
 * of a cohort enrolls the learner in all of it, and the allowance check is
 * made against the cohort's TOTAL CE hours — not one half.
 *
 * Nothing currently links a pair. seedEthicsSplitSessions.js builds the two
 * halves independently; the only connection is the slug convention. This
 * script derives a key from the slug ONCE and writes it to the record, so
 * runtime never has to parse slugs.
 *
 * Derivation:
 *   ethics-table-talk-part1-wk4-6pm  ->  ethics-table-talk-wk4-6pm
 *   ethics-table-talk-part2-wk4-6pm  ->  ethics-table-talk-wk4-6pm   (pairs)
 *   ethics-table-talk-part-1         ->  ethics-table-talk-wk1-6pm   (see below)
 *
 * The two July sessions (ethics-table-talk-part-1 / part-2) predate the
 * wk{N}-{slot} convention. They are the evening series' first cohort, so they
 * are mapped explicitly rather than by pattern — a regex loose enough to catch
 * them would also catch things it shouldn't.
 *
 * Sessions with no detectable pair (e.g. ethics-table-talk-full, a standalone
 * 5-hour session) get a cohortKey of their own slug: a cohort of one. That is
 * correct, not a fallback — registering for it enrolls exactly it.
 *
 * DRY RUN BY DEFAULT. Set APPLY=1 to write.
 *
 * Usage:
 *   node src/scripts/backfillCohortKeys.js
 *   APPLY=1 node src/scripts/backfillCohortKeys.js
 */
import mongoose from 'mongoose';

const APPLY = process.env.APPLY === '1';

// Slugs that predate the wk{N}-{slot} convention, mapped by hand.
const EXPLICIT = {
  'ethics-table-talk-part-1': 'ethics-table-talk-wk1-6pm',
  'ethics-table-talk-part-2': 'ethics-table-talk-wk1-6pm'
};

function deriveCohortKey(slug) {
  if (EXPLICIT[slug]) return EXPLICIT[slug];
  // part1-wk4-6pm / part2-wk4-6pm  ->  strip the part marker
  const m = slug.match(/^(.*)-part[12]-(wk\d+-.*)$/);
  if (m) return `${m[1]}-${m[2]}`;
  // No pair detectable — cohort of one.
  return slug;
}

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  const sessions = await db.collection('livesessions')
    .find({}).sort({ scheduledStart: 1 }).toArray();

  console.log('='.repeat(90));
  console.log('BACKFILL cohortKey');
  console.log('Sessions: ' + sessions.length + (APPLY ? '   MODE: APPLY' : '   MODE: DRY RUN'));
  console.log('='.repeat(90) + '\n');

  const groups = {};
  const plan = [];

  sessions.forEach(s => {
    const key = deriveCohortKey(s.slug);
    const current = s.cohortKey || '(unset)';
    groups[key] = groups[key] || [];
    groups[key].push(s);
    if (s.cohortKey !== key) plan.push({ s, key, current });
  });

  console.log('COHORTS AS THEY WOULD BE:');
  Object.keys(groups).sort().forEach(key => {
    const members = groups[key];
    const totalCE = members.reduce((sum, m) => sum + (m.ceuHours || 0), 0);
    const flag = members.length > 2 ? '   *** MORE THAN 2 MEMBERS — CHECK THIS ***' : '';
    console.log('\n  ' + key + '   (' + members.length + ' session' +
      (members.length === 1 ? '' : 's') + ', ' + totalCE + ' CE hrs)' + flag);
    members.forEach(m => console.log('      ' + m.slug + '  | ceu: ' + (m.ceuHours || 0)));
  });

  console.log('\n' + '-'.repeat(90));
  console.log('WRITES PENDING: ' + plan.length);
  plan.forEach(p => console.log('   ' + p.s.slug + '   ' + p.current + ' -> ' + p.key));

  if (!APPLY) {
    console.log('\nDRY RUN — nothing written. Re-run with APPLY=1 to execute.');
    return mongoose.disconnect();
  }

  for (const p of plan) {
    await db.collection('livesessions').updateOne(
      { _id: p.s._id },
      { $set: { cohortKey: p.key } }
    );
    console.log('Set ' + p.s.slug + ' -> ' + p.key);
  }

  console.log('\nDone. ' + plan.length + ' record(s) updated.');
  await mongoose.disconnect();
}

main().catch(err => { console.error('Script error:', err.message); process.exit(1); });
