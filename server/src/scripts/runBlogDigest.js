/**
 * Standalone entry point for the blog digest job.
 * Usage: node src/scripts/runBlogDigest.js
 * Intended for a Render Cron Job (independent of app sleep state).
 */
import mongoose from 'mongoose';
import { runBlogDigest } from '../jobs/blogDigest.js';

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('[runBlogDigest] Connected to MongoDB.');

  const result = await runBlogDigest();
  console.log('[runBlogDigest] Result:', result);

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error('[runBlogDigest] Fatal error:', err);
  process.exit(1);
});
