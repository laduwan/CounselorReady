/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('No MONGODB_URI'); process.exit(1); }

// ═══════════════════════════════════════════════════════════════════
// LIVE SESSION REGISTRATION AUDIT — read-only
// Lists every live session and its roster, resolving registrant emails.
// Uses raw collections (like acepAudit.js) so no Mongoose model
// registration is required — this is what caused the populate() failures
// when run as an inline -e script.
// ═══════════════════════════════════════════════════════════════════

async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;

  const sessions = await db.collection('livesessions')
    .find({}).sort({ scheduledStart: 1 }).toArray();

  // Resolve all registrant userIds in one pass
  const userIds = [];
  sessions.forEach(s => (s.registrants || []).forEach(r => {
    if (r.user) userIds.push(r.user);
  }));

  const users = userIds.length
    ? await db.collection('users')
        .find({ _id: { $in: userIds } })
        .project({ email: 1, 'subscription.plan': 1, 'subscription.status': 1 })
        .toArray()
    : [];

  const byId = {};
  users.forEach(u => { byId[u._id.toString()] = u; });

  console.log('='.repeat(90));
  console.log('LIVE SESSION REGISTRATION AUDIT');
  console.log('Date: ' + new Date().toISOString());
  console.log('Sessions found: ' + sessions.length);
  console.log('='.repeat(90) + '\n');

  sessions.forEach(s => {
    const regs = s.registrants || [];
    console.log('-'.repeat(90));
    console.log('SLUG    : ' + s.slug);
    console.log('TITLE   : ' + s.title);
    console.log('STATUS  : ' + s.status + '   PUBLISHED: ' + s.isPublished);
    console.log('START   : ' + s.scheduledStart);
    console.log('PRICE   : ' + s.price + '   CUTOFF_HRS: ' + s.registrationCutoffHours);
    console.log('SEATS   : ' + regs.length + ' / ' + s.capacity);

    if (regs.length === 0) {
      console.log('   (no registrants)');
      return;
    }

    regs.forEach(r => {
      const u = r.user ? byId[r.user.toString()] : null;
      const email = u ? u.email : 'UNRESOLVED_USER';
      const plan = u && u.subscription ? (u.subscription.plan + '/' + u.subscription.status) : 'n/a';
      console.log('   ' + email +
        '  | paid: ' + r.paid +
        '  | plan: ' + plan +
        '  | at: ' + (r.registeredAt || 'n/a') +
        '  | stripe: ' + (r.stripeCheckoutSessionId || 'none'));
    });
  });

  console.log('\n' + '='.repeat(90));
  console.log('DONE — read-only, nothing was modified.');

  await mongoose.disconnect();
}

main().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
