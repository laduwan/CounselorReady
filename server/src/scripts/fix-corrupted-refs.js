import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

async function fixCorruptedRefs() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  const db = mongoose.connection.db;
  const collection = db.collection('interactivecourses');

  // Find all courses with references containing "undefined"
  const courses = await collection.find({
    'references.formatted': { $regex: /undefined/ }
  }).toArray();

  console.log(`Found ${courses.length} courses with corrupted references`);

  for (const course of courses) {
    const before = course.references.length;
    const clean = course.references.filter(ref => {
      const text = ref.formatted || ref.title || '';
      return text && !text.includes('undefined');
    });

    await collection.updateOne(
      { _id: course._id },
      { $set: { references: clean } }
    );

    console.log(`${course.slug}: ${before} → ${clean.length} refs`);
  }

  console.log('\nDone. Disconnecting.');
  await mongoose.disconnect();
}

fixCorruptedRefs().catch(err => {
  console.error(err);
  process.exit(1);
});
