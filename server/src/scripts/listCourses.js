#!/usr/bin/env node
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection.db;

const courses = await db.collection('courses').find({}).toArray();

const grouped = new Map();
courses.forEach(c => {
  const hrs = c.ceHours || 'none';
  if (!grouped.has(hrs)) grouped.set(hrs, []);
  grouped.get(hrs).push((c.code || '---') + ' | ' + (c.title || 'no title').substring(0, 55));
});

const keys = [...grouped.keys()].sort();
keys.forEach(h => {
  console.log('\n=== ' + h + ' CE HOUR(S) ===');
  grouped.get(h).forEach(c => console.log(c));
});

console.log('\nTotal:', courses.length, 'courses');
await mongoose.disconnect();
