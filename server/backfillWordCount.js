import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

// Minimal schema to get sections with contentBlocks
const courseSchema = new mongoose.Schema({
  title: String,
  ceHours: Number,
  wordCount: Number,
  sections: [{
    contentBlocks: [{
      textContent: String,
      content: String,
      html: String,
      body: String
    }]
  }]
}, { strict: false });

const Course = mongoose.model('interactivecourses', courseSchema);

async function backfill() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const courses = await Course.find({}).select('title ceHours sections wordCount');
  console.log(`Found ${courses.length} courses`);

  let updated = 0;
  for (const course of courses) {
    let wc = 0;
    (course.sections || []).forEach(s => {
      (s.contentBlocks || []).forEach(b => {
        const txt = b.textContent || b.content || b.html || b.body || '';
        const plain = txt.replace(/<[^>]+>/g, ' ').replace(/&\w+;/g, ' ').trim();
        if (plain) wc += plain.split(/\s+/).filter(w => w.length > 0).length;
      });
    });

    const target = (course.ceHours || 0) * 6000;
    const pct = target > 0 ? Math.round((wc / target) * 100) : 0;

    await Course.updateOne({ _id: course._id }, { $set: { wordCount: wc } });
    console.log(`✓ ${course.title}: ${wc.toLocaleString()} words (${pct}% of target)`);
    updated++;
  }

  console.log(`\nDone. Updated ${updated} courses.`);
  await mongoose.disconnect();
}

backfill().catch(err => { console.error(err); process.exit(1); });
