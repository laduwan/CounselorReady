/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 */

/**
 * linkEthicsSeries.js
 * ─────────────────────────────────────────────────────────────────
 * Seeds the two "Ethics Table Talk" SessionSeries records (morning +
 * evening) and links the already-seeded LiveSession documents to them
 * as members.
 *
 * Membership grouping:
 *   - LiveSessions whose slug starts with 'ethics-table-talk-part'
 *   - slug contains '-8am' → morning series
 *   - slug contains '-6pm' → evening series
 *   - within each group, sorted by scheduledStart ascending
 *
 * Idempotent: a series is only created if one with its slug does not
 * already exist. Member linking runs every time so re-runs converge.
 *
 * Pricing note: SessionSeries.price / earlyBirdPrice are stored in whole
 * USD dollars — the register route (routes/sessionSeries.js) multiplies
 * by 100 for Stripe (Math.round(price * 100)). $115 / $98 therefore
 * store as 115 / 98, NOT as cents.
 *
 * Usage:
 *   MONGODB_URI=... node server/src/scripts/linkEthicsSeries.js           # dry run (default)
 *   MONGODB_URI=... node server/src/scripts/linkEthicsSeries.js --write   # apply changes
 */

import mongoose from 'mongoose';
import LiveSession from '../models/LiveSession.js';
import SessionSeries from '../models/SessionSeries.js';

const WRITE = process.argv.includes('--write');

const SERIES_DEFS = [
  {
    match: '-8am',
    title: 'The Ethics Table Talk — Morning Sessions (8–10:30 AM)',
    slug: 'ethics-table-talk-morning',
    totalCeuHours: 5,
    price: 115,          // USD ($115 standard) — register route × 100 for Stripe
    earlyBirdPrice: 98,  // USD ($98 early bird)
    earlyBirdDeadline: new Date('2026-08-15T23:59:59Z'),
    description: 'Five synchronous ethics CE hours split across Monday and Tuesday mornings, 8–10:30 AM ET. Attend both sessions in any weekly pair to earn your certificate.'
  },
  {
    match: '-6pm',
    title: 'The Ethics Table Talk — Evening Sessions (6–8:30 PM)',
    slug: 'ethics-table-talk-evening',
    totalCeuHours: 5,
    price: 115,          // USD ($115 standard)
    earlyBirdPrice: 98,  // USD ($98 early bird)
    earlyBirdDeadline: new Date('2026-08-15T23:59:59Z'),
    description: 'Five synchronous ethics CE hours split across Monday and Tuesday mornings, 8–10:30 AM ET. Attend both sessions in any weekly pair to earn your certificate.'
  }
];

async function run() {
  if (!process.env.MONGODB_URI) {
    console.error('ERROR: MONGODB_URI environment variable is required.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log(`Connected to MongoDB. Mode: ${WRITE ? 'WRITE' : 'DRY RUN (no changes will be written)'}\n`);

  // 1. Find all ethics-table-talk-part* sessions
  const sessions = await LiveSession.find({ slug: /^ethics-table-talk-part/ });
  console.log(`Found ${sessions.length} LiveSession(s) matching /^ethics-table-talk-part/\n`);

  let seriesCreated = 0;
  let sessionsUpdated = 0;

  for (const def of SERIES_DEFS) {
    // 2. group by time slot + 3. sort by scheduledStart ascending
    const members = sessions
      .filter(s => (s.slug || '').includes(def.match))
      .sort((a, b) => new Date(a.scheduledStart) - new Date(b.scheduledStart));

    console.log('─'.repeat(64));
    console.log(`Series: ${def.title}`);
    console.log(`  slug:         ${def.slug}`);
    console.log(`  totalCeuHours:${def.totalCeuHours}`);
    console.log(`  price:        $${def.price} (early bird $${def.earlyBirdPrice} until ${def.earlyBirdDeadline.toISOString()})`);
    console.log(`  members:      ${members.length}`);
    members.forEach((s, i) => console.log(`      ${i + 1}. ${s.slug}`));

    if (!members.length) {
      console.log('  (no matching sessions — nothing to create or link)\n');
      continue;
    }

    // 6. idempotent — skip creation if a series with this slug already exists
    let series = await SessionSeries.findOne({ slug: def.slug });
    if (series) {
      console.log(`  series already exists (${series._id}) — creation skipped`);
    } else if (WRITE) {
      series = await SessionSeries.create({
        title: def.title,
        slug: def.slug,
        description: def.description,
        totalCeuHours: def.totalCeuHours,
        price: def.price,
        earlyBirdPrice: def.earlyBirdPrice,
        earlyBirdDeadline: def.earlyBirdDeadline
      });
      seriesCreated++;
      console.log(`  CREATED series ${series._id}`);
    } else {
      console.log('  would CREATE series (dry run)');
    }

    // 5. link each session as a member
    //    seriesMembership.order has min:1 in the schema (documented 1,2,3…),
    //    so we use a 1-based order (index + 1), not the raw 0-based index.
    if (WRITE && series) {
      for (let i = 0; i < members.length; i++) {
        const s = members[i];
        s.seriesId = series._id;
        s.seriesMembership = { order: i + 1, required: true };
        await s.save();
        sessionsUpdated++;
      }
      console.log(`  linked ${members.length} session(s) as members (order 1..${members.length}, required:true)`);
    } else {
      console.log(`  would link ${members.length} session(s) (order 1..${members.length}, required:true)`);
    }
    console.log('');
  }

  console.log('═'.repeat(64));
  if (WRITE) {
    console.log(`DONE. Series created: ${seriesCreated}. Sessions updated: ${sessionsUpdated}.`);
  } else {
    console.log('DRY RUN complete. No changes written. Re-run with --write to apply.');
  }

  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error('FATAL:', err);
  try { await mongoose.disconnect(); } catch { /* ignore */ }
  process.exit(1);
});
