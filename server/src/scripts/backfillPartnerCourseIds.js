/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 *
 * Backfill InteractiveCourse.partnerId.
 *
 * Because `partnerId` was previously undeclared on a strict CourseSchema, Mongoose silently
 * dropped it on save — so partner-created courses have no stored owner. There's no direct link
 * to recover, so this script infers ownership from the `author` the create handler stamped
 * (the partner user's "First Last" or email) by matching it to a User who has a partnerId.
 *
 * SAFE BY DEFAULT: dry-run. It only reports candidates. Re-run with APPLY=1 to write partnerId.
 * Courses whose author does NOT map to a partner user are left as-is (null = platform-owned,
 * which is correct for CounselorReady's own catalog).
 *
 * Usage:
 *   node src/scripts/backfillPartnerCourseIds.js          # dry-run report
 *   APPLY=1 node src/scripts/backfillPartnerCourseIds.js  # apply the clear matches
 */
import mongoose from 'mongoose';
import User from '../models/User.js';
import Partner from '../models/Partner.js';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('No MONGODB_URI'); process.exit(1); }
const APPLY = process.env.APPLY === '1';

async function main() {
  await mongoose.connect(MONGODB_URI);
  const courses = mongoose.connection.collection('interactivecourses');

  const withPartner = await courses.countDocuments({ partnerId: { $ne: null, $exists: true } });
  const missing = await courses.find({ $or: [{ partnerId: null }, { partnerId: { $exists: false } }] })
    .project({ slug: 1, title: 1, author: 1, status: 1 }).toArray();

  console.log(`Courses with partnerId already set: ${withPartner}`);
  console.log(`Courses missing partnerId: ${missing.length}`);
  console.log('');

  // Build a lookup of partner-affiliated users (those with a partnerId)
  const partnerUsers = await User.find({ partnerId: { $ne: null, $exists: true } })
    .select('email profile.firstName profile.lastName partnerId').lean();
  const partners = await Partner.find({}).select('name').lean();
  const partnerName = Object.fromEntries(partners.map(p => [String(p._id), p.name]));

  const byEmail = new Map();
  const byName = new Map();
  for (const u of partnerUsers) {
    if (u.email) byEmail.set(u.email.toLowerCase(), u);
    const full = `${u.profile?.firstName || ''} ${u.profile?.lastName || ''}`.trim().toLowerCase();
    if (full) byName.set(full, u);
  }

  const candidates = [];
  const ambiguous = [];
  for (const c of missing) {
    const author = (c.author || '').trim();
    if (!author) continue;
    const u = byEmail.get(author.toLowerCase()) || byName.get(author.toLowerCase());
    if (u?.partnerId) {
      candidates.push({ course: c, partnerId: u.partnerId, partner: partnerName[String(u.partnerId)] || '(unknown)', via: u.email || author });
    }
  }

  if (!candidates.length) {
    console.log('No partner-owned courses detected among courses missing partnerId.');
    console.log('All such courses are treated as platform-owned (correct for the CR catalog). Nothing to backfill.');
  } else {
    console.log(`Detected ${candidates.length} likely partner-owned course(s):`);
    for (const cand of candidates) {
      console.log(`  • "${cand.course.title}" (${cand.course.slug}) → ${cand.partner}  [matched via ${cand.via}]`);
    }
    console.log('');

    if (APPLY) {
      let applied = 0;
      for (const cand of candidates) {
        await courses.updateOne({ _id: cand.course._id }, { $set: { partnerId: cand.partnerId } });
        applied++;
      }
      console.log(`APPLIED partnerId to ${applied} course(s).`);
    } else {
      console.log('DRY RUN — re-run with APPLY=1 to write these partnerId values.');
      console.log('Review the matches above first; only clear author→partner-user matches are listed.');
    }
  }

  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => { console.error('Backfill error:', err.message); process.exit(1); });
