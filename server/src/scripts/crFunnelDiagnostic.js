/**
 * crFunnelDiagnostic.js — READ-ONLY. Writes nothing. Answers: traffic vs conversion vs offer problem.
 * Run from ~/project/src/server :  node src/scripts/crFunnelDiagnostic.js
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  if (!process.env.MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  const users   = db.collection('users');
  const progress= db.collection('usercourseprogresses');
  const toolClk = db.collection('toolclicks');
  const activity= db.collection('useractivities');

  const now = new Date();
  const d90 = new Date(now - 90*864e5);
  const d30 = new Date(now - 30*864e5);

  // ── 1. TRAFFIC / POPULATION ──────────────────────────────────────────
  const totalUsers   = await users.countDocuments({});
  const since90       = await users.countDocuments({ createdAt: { $gte: d90 } });
  const since30       = await users.countDocuments({ createdAt: { $gte: d30 } });
  const everLoggedIn  = await users.countDocuments({ lastLoginAt: { $ne: null } });
  const loggedIn30    = await users.countDocuments({ lastLoginAt: { $gte: d30 } });

  // ── 2. ENGAGEMENT (reached the product) ──────────────────────────────
  const startedCourse = await progress.countDocuments({}).catch(()=>0);
  const distinctCourseUsers = (await progress.distinct('userId').catch(()=>[])).length;
  const usedAnyTool   = (await toolClk.distinct('userId').catch(()=>[])).length;
  const usedFreeCourse= await users.countDocuments({ $or: [
                          { 'trialCoursesUsed': { $gt: 0 } },
                          { 'freeCoursesUsedThisMonth': { $gt: 0 } },
                          { 'freeHoursUsed': { $gt: 0 } } ] });

  // ── 3. CONVERSION (reached the paywall / paid) ───────────────────────
  const startedCheckout = await users.countDocuments({ 'subscription.stripeCustomerId': { $ne: null } });
  const paidStatuses = ['active','trial','past_due','lifetime'];
  const paidNow      = await users.countDocuments({ 'subscription.status': { $in: paidStatuses } });
  const byPlan = await users.aggregate([
    { $group: { _id: '$subscription.plan', n: { $sum: 1 } } }, { $sort: { n: -1 } }
  ]).toArray();
  const byStatus = await users.aggregate([
    { $group: { _id: '$subscription.status', n: { $sum: 1 } } }, { $sort: { n: -1 } }
  ]).toArray();

  // ── 4. MIGRATED COHORT (the 74) ──────────────────────────────────────
  // migrated users predate launch; approximate by earliest createdAt cluster
  const oldest = await users.find({}).sort({ createdAt: 1 }).limit(1).toArray();
  const firstDate = oldest[0]?.createdAt;

  const pct = (a,b) => b ? (100*a/b).toFixed(1)+'%' : 'n/a';

  console.log('\n══════════ CR FUNNEL DIAGNOSTIC (read-only) ══════════');
  console.log('\n① TRAFFIC / POPULATION');
  console.log(`  Total users ........................ ${totalUsers}`);
  console.log(`  Created last 90d ................... ${since90}`);
  console.log(`  Created last 30d ................... ${since30}`);
  console.log(`  Ever logged in .................... ${everLoggedIn}  (${pct(everLoggedIn,totalUsers)})`);
  console.log(`  Logged in last 30d ................ ${loggedIn30}`);

  console.log('\n② ENGAGEMENT (reached the product)');
  console.log(`  Distinct users who started a course  ${distinctCourseUsers}  (${pct(distinctCourseUsers,totalUsers)})`);
  console.log(`  Course-progress records (total) .... ${startedCourse}`);
  console.log(`  Distinct users who used a tool ..... ${usedAnyTool}`);
  console.log(`  Users who used ANY free course ..... ${usedFreeCourse}  (${pct(usedFreeCourse,totalUsers)})`);

  console.log('\n③ CONVERSION (paywall → paid)');
  console.log(`  Reached checkout (has stripeCustomerId)  ${startedCheckout}  (${pct(startedCheckout,totalUsers)})`);
  console.log(`  Currently paid (active/trial/lifetime).. ${paidNow}  (${pct(paidNow,totalUsers)})`);
  console.log('  By plan:');     byPlan.forEach(p => console.log(`     ${(p._id||'(none)').padEnd(14)} ${p.n}`));
  console.log('  By status:');   byStatus.forEach(s => console.log(`     ${(s._id||'(none)').padEnd(14)} ${s.n}`));

  console.log('\n④ COHORT');
  console.log(`  Earliest user createdAt ............ ${firstDate ? firstDate.toISOString().slice(0,10) : 'n/a'}`);

  // ── VERDICT HINT ──────────────────────────────────────────────────────
  console.log('\n══════════ READ ══════════');
  if (distinctCourseUsers === 0 && everLoggedIn <= 80) {
    console.log('  → Looks like a TRAFFIC/ACTIVATION problem: almost no one reached the product.');
  } else if (distinctCourseUsers > 0 && startedCheckout === 0) {
    console.log('  → Looks like an OFFER/FUNNEL problem: people engaged but NONE reached checkout.');
  } else if (startedCheckout > 0 && paidNow === 0) {
    console.log('  → Looks like a PRICE/CHECKOUT problem: people reached checkout but none completed.');
  } else {
    console.log('  → Mixed signal — read the three sections together; numbers above are the truth.');
  }
  console.log('  (Engaged-but-unconverted users are your warmest interview pool.)\n');

  await mongoose.disconnect();
}
main().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
