/**
 * checkCRC1toCRC5.js
 * Verify CR-C1 through CR-C5 exist in interactivecourses collection
 * Run: node src/scripts/checkCRC1toCRC5.js
 *
 * Does NOT modify any data — read-only audit.
 */

import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌  MONGODB_URI not set");
  process.exit(1);
}

const TARGET_SLUGS = [
  "moral-injury-counselors",
  "racial-trauma-affirming-practice",
  "ai-ethics-mental-health",
  "clinician-burnout-sustainable-practice",
  "neurodivergent-affirming-practice",
];

const TARGET_CODES = ["CR-C1", "CR-C2", "CR-C3", "CR-C4", "CR-C5"];

async function main() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db();
    const col = db.collection("interactivecourses");

    console.log("\n══════════════════════════════════════════════════════");
    console.log("  CR-C1 through CR-C5 — interactivecourses audit");
    console.log("══════════════════════════════════════════════════════\n");

    // Query by courseCode
    const docs = await col
      .find({ courseCode: { $in: TARGET_CODES } })
      .project({ courseCode: 1, slug: 1, title: 1, status: 1, isPublished: 1, ceHours: 1, _id: 0 })
      .sort({ courseCode: 1 })
      .toArray();

    if (docs.length === 0) {
      console.log("⚠️  No documents found by courseCode. Trying slug fallback...\n");

      // Fallback: search by slug keyword
      const slugResults = await col
        .find({
          slug: {
            $in: TARGET_SLUGS,
          },
        })
        .project({ courseCode: 1, slug: 1, title: 1, status: 1, isPublished: 1, ceHours: 1, _id: 0 })
        .sort({ courseCode: 1 })
        .toArray();

      if (slugResults.length === 0) {
        console.log("❌  No CR-C1 through CR-C5 courses found in interactivecourses.\n");
        console.log("   These courses have NOT been seeded yet.\n");
        return;
      }
      docs.push(...slugResults);
    }

    // Report found courses
    const foundCodes = new Set(docs.map((d) => d.courseCode));
    for (const doc of docs) {
      const published = doc.isPublished ? "✅ isPublished=true" : "⬜ isPublished=false";
      const status = doc.status || "(no status field)";
      console.log(`  ${doc.courseCode || "??"} | ${doc.slug}`);
      console.log(`    Title    : ${doc.title}`);
      console.log(`    Status   : ${status}   ${published}`);
      console.log(`    CE Hours : ${doc.ceHours}`);
      console.log();
    }

    // Report missing
    const missing = TARGET_CODES.filter((c) => !foundCodes.has(c));
    if (missing.length > 0) {
      console.log("⚠️  MISSING courses (not in interactivecourses):");
      for (const code of missing) {
        console.log(`   • ${code}`);
      }
      console.log();
    } else {
      console.log("✅  All 5 courses found in interactivecourses.\n");
    }

    // Summary
    const draftCount = docs.filter((d) => d.status === "draft").length;
    const publishedCount = docs.filter((d) => d.status === "published").length;
    console.log(`Summary: ${docs.length} found | ${publishedCount} published | ${draftCount} draft | ${missing.length} missing`);
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error("❌  Script error:", err);
  process.exit(1);
});
