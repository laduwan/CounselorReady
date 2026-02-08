// checkCollections.js - Check where Active Listening course exists
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);
console.log('Connected to MongoDB');

const db = mongoose.connection.db;

const course = await db.collection('courses').findOne({ slug: 'active-listening-skills' });
const interactive = await db.collection('interactivecourses').findOne({ slug: 'active-listening-skills' });

console.log('\n--- COURSES COLLECTION ---');
console.log('Found:', course ? 'YES' : 'NO');
if (course) {
  console.log('Title:', course.title);
  console.log('Modules:', course.modules?.length || 0);
  console.log('Status:', course.status);
}

console.log('\n--- INTERACTIVECOURSES COLLECTION ---');
console.log('Found:', interactive ? 'YES' : 'NO');
if (interactive) {
  console.log('Title:', interactive.title);
  console.log('Sections:', interactive.sections?.length || 0);
  console.log('Status:', interactive.status);
}

await mongoose.connection.close();
console.log('\nDone!');
process.exit(0);
