import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const cs = await mongoose.connection.collection('interactivecourses').find({}).sort({ title: 1 }).toArray();

  console.log('\n══ COURSES WITHOUT CODES ══');
  for (const c of cs) {
    if (!c.courseCode) {
      const pct = c.ceHours ? Math.round((c.wordCount / (c.ceHours * 6000)) * 100) : 0;
      console.log(`  ${(c.status || '?').padEnd(10)} ${(c.ceHours + 'CE').padEnd(5)} ${(pct + '%').padStart(5)}  ${(c.title || '').substring(0, 65)}`);
    }
  }

  console.log('\n══ COURSES WITH CODES ══');
  for (const c of cs) {
    if (c.courseCode) {
      const pct = c.ceHours ? Math.round((c.wordCount / (c.ceHours * 6000)) * 100) : 0;
      console.log(`  ${(c.courseCode).padEnd(14)} ${(c.status || '?').padEnd(10)} ${(c.ceHours + 'CE').padEnd(5)} ${(pct + '%').padStart(5)}  ${(c.title || '').substring(0, 55)}`);
    }
  }

  const noCode = cs.filter(c => !c.courseCode).length;
  const withCode = cs.filter(c => c.courseCode).length;
  console.log(`\nTotal: ${cs.length} (${withCode} with code, ${noCode} without)`);
  await mongoose.disconnect();
}

run().catch(e => { console.error(e); process.exit(1); });
