#!/usr/bin/env node

/**
 * Seed script – inserts (or replaces) the QA smoke-test course.
 *
 * Usage:
 *   MONGODB_URI="mongodb://..." node scripts/seed-qa-test.js
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import the InteractiveCourse model (ESM)
const { Course } = await import('../server/src/models/InteractiveCourse.js');

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('ERROR: MONGODB_URI environment variable is not set.');
    process.exit(1);
  }

  // Connect to MongoDB
  await mongoose.connect(uri);
  console.log('Connected to MongoDB.');

  // Ensure TTL index on expiresAt (sparse, expireAfterSeconds: 0)
  const collection = mongoose.connection.collection('interactivecourses');
  await collection.createIndex(
    { expiresAt: 1 },
    { expireAfterSeconds: 0, sparse: true }
  );
  console.log('TTL index on expiresAt ensured.');

  // Delete any existing QA smoke-test document
  const deleted = await Course.deleteOne({ slug: 'qa-smoke-test' });
  if (deleted.deletedCount) {
    console.log('Deleted existing qa-smoke-test document.');
  }

  // Read the course JSON
  const raw = readFileSync(join(__dirname, 'qa-test-course.json'), 'utf-8');
  const courseData = JSON.parse(raw);

  // Set expiration to 60 minutes from now
  courseData.expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  // Remove the _qa marker key
  delete courseData._qa;

  // Insert using the model
  const doc = await Course.create(courseData);

  console.log('QA smoke-test course inserted:');
  console.log(`  Title : ${doc.title}`);
  console.log(`  Slug  : ${doc.slug}`);
  console.log(`  ID    : ${doc._id}`);
  console.log(`  Expires: ${doc.expiresAt.toISOString()}`);

  await mongoose.disconnect();
  console.log('Disconnected. Done.');
}

main().catch(async (err) => {
  console.error('Seed script failed:', err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
