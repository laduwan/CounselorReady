import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection.db;

// Test 1: raw MongoDB query
const raw = await db.collection('interactivecourses').findOne({ slug: 'trauma-informed-care' });
console.log('RAW MongoDB - found:', !!raw, '| status:', raw?.status);

// Test 2: check all slugs containing "trauma"
const all = await db.collection('interactivecourses').find({ slug: /trauma/ }).toArray();
console.log('Slugs matching "trauma":', all.map(c => c.slug + ' [' + c.status + ']'));

// Test 3: count all published courses
const published = await db.collection('interactivecourses').countDocuments({ status: 'published' });
console.log('Total published courses:', published);

// Test 4: check what collection name Mongoose is using
const CourseModule = await import('./src/models/InteractiveCourse.js');
const Course = CourseModule.Course;
console.log('Mongoose collection name:', Course.collection.name);

// Test 5: Mongoose query matching the route
const mongooseResult = await Course.findOne({ slug: 'trauma-informed-care', status: 'published' });
console.log('Mongoose query result:', !!mongooseResult);

process.exit();
