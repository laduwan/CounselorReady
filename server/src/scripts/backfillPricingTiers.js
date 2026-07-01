/**
 * One-time migration script to backfill pricing tiers on existing courses.
 * Run via Render shell: node server/src/scripts/backfillPricingTiers.js
 */
import mongoose from 'mongoose';
import { resolvePricingFromWordCount } from '../utils/pricingRules.js';

await mongoose.connect(process.env.MONGODB_URI);

const IC = mongoose.connection.collection('interactivecourses');
const courses = await IC.find({}).toArray();

let updated = 0;
for (const c of courses) {
  // Count words from all section text blocks
  let words = 0;
  for (const s of (c.sections ?? [])) {
    for (const b of (s.contentBlocks ?? [])) {
      if (b.type === 'text' && b.content) {
        words += b.content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
      }
    }
  }
  // Fall back to ceHours estimate if no content blocks
  if (words === 0 && c.ceHours) words = c.ceHours * 6000;

  const pricing = resolvePricingFromWordCount(words);

  await IC.updateOne(
    { _id: c._id },
    { $set: { pricingTier: pricing.pricingTier, accessTier: pricing.accessTier, accessType: pricing.accessType, price: pricing.price } }
  );
  console.log(`${c.title} → ${pricing.pricingTier} ($${pricing.price}) [${words} words]`);
  updated++;
}

console.log(`\nDone. ${updated} courses updated.`);
await mongoose.disconnect();
