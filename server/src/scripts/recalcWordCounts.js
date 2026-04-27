/**
 * recalcWordCounts.js — Recalculates wordCount for all interactivecourses
 * Run: node src/scripts/recalcWordCounts.js
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('ERROR: MONGODB_URI not found'); process.exit(1); }

await mongoose.connect(MONGODB_URI);
const db = mongoose.connection.db;
const col = db.collection('interactivecourses');

const courses = await col.find({}).toArray();
console.log(`Found ${courses.length} courses\n`);

let fixed = 0;
for (const c of courses) {
  let wc = 0;
  (c.sections || []).forEach(s => {
    (s.contentBlocks || []).forEach(b => {
      const txt = b.textContent || b.content || b.html || b.body || '';
      const plain = String(txt).replace(/<[^>]+>/g, ' ').replace(/&\w+;/g, ' ').trim();
      if (plain) wc += plain.split(/\s+/).filter(w => w.length > 0).length;
    });
  });

  const oldWc = c.wordCount || 0;
  const totalBlocks = (c.sections || []).reduce((n, s) => n + (s.contentBlocks || []).length, 0);

  if (wc !== oldWc) {
    await col.updateOne({ _id: c._id }, { $set: { wordCount: wc, totalContentBlocks: totalBlocks } });
    console.log(`  FIXED: ${(c.courseCode || '').padEnd(10)} ${(c.title || '').substring(0, 50).padEnd(52)} ${oldWc} → ${wc}`);
    fixed++;
  } else {
    console.log(`  OK:    ${(c.courseCode || '').padEnd(10)} ${(c.title || '').substring(0, 50).padEnd(52)} ${wc} words`);
  }
}

console.log(`\n✅ Done. Fixed ${fixed} of ${courses.length} courses.`);
await mongoose.disconnect();
