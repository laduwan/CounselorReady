import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection.db;
const course = await db.collection('interactivecourses').findOne({ slug: 'trauma-informed-care' });
console.log('found:', !!course);
console.log('status:', course?.status);
console.log('title:', course?.title);
process.exit();
