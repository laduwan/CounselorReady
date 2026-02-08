#!/usr/bin/env node
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection.db;
console.log('Connected\n');

const codes = [
  { match: /Suicide Risk Assessment/, code: 'CR-101' },
  { match: /Crisis Intervention and Suicide Prevention/, code: 'CR-102' },
  { match: /Ethics and Professional Boundaries/, code: 'CR-201' },
  { match: /28 Days Later/, code: 'CR-301' },
  { match: /Motivational Interviewing: From Ambivalence/, code: 'CR-302' },
  { match: /Elephant in the Room: Navigating/, code: 'CR-401' },
  { match: /Walking on Eggshells: Working with High/, code: 'CR-402' },
  { match: /When It Rains, It Pours: Treating/, code: 'CR-403' },
  { match: /It Takes a Village: Consultation/, code: 'CR-404' },
  { match: /Dialectical Behavior Therapy: Foundations/, code: 'CR-501' }
];

for (const c of codes) {
  const result = await db.collection('courses').updateOne(
    { title: c.match },
    { $set: { code: c.code } }
  );
  console.log(result.modifiedCount ? '✅' : '⚠️', c.code, '-', c.match.toString().slice(1, 50));
}

await mongoose.disconnect();
console.log('\nDone!');
