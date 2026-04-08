/**
 * publishCRC1toCRC5.js
 * Set status: "published" and isPublished: true for CR-C1 through CR-C5
 * in the interactivecourses collection.
 *
 * Run: node src/scripts/publishCRC1toCRC5.js
 * Uses native MongoDB driver (not Mongoose).
 */

import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌  MONGODB_URI not set");
  process.exit(1);
}

const TARGET_CODES = ["CR-C1", "CR-C2", "CR-C3", "CR-C4", "CR-C5"];

async function main() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db();
    const col = db.collection("interactivecourses");

    console.log("\n══════════════════════════════════════════════════════");
    console.log("  publishCRC1toCRC5 — publishing CR-C1 through CR-C5");
    console.log("══════════════════════════════════════════════════════\n");

    // Fetch current state first for logging
    const docs = await col
      .find({ courseCode: { $in: TARGET_CODES } })
      .project({ courseCode: 1, slug: 1, title: 1, status: 1, isPublished: 1 })
      .sort({ courseCode: 1 })
      .toArray();

    if (docs.length === 0) {
      console.error("❌  No CR-C1 through CR-C5 courses found. Run the seed first.");
      process.exit(1);
    }

    // Publish each one
    for (const doc of docs) {
      const result = await col.updateOne(
        { _id: doc._id },
        { $set: { status: "published", isPublished: true } }
      );
      const changed = result.modifiedCount > 0 ? "✅ published" : "⬜ already published (no change)";
      console.log(`  ${doc.courseCode} | ${doc.title}`);
      console.log(`    was: status=${doc.status}, isPublished=${doc.isPublished}`);
      console.log(`    now: ${changed}`);
      console.log();
    }

    // Report any missing
    const foundCodes = new Set(docs.map((d) => d.courseCode));
    const missing = TARGET_CODES.filter((c) => !foundCodes.has(c));
    if (missing.length > 0) {
      console.warn("⚠️  These course codes were NOT found — not published:");
      for (const code of missing) console.warn(`   • ${code}`);
    }

    console.log(`\nDone. ${docs.length} courses processed, ${missing.length} missing.\n`);
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error("❌  Script error:", err);
  process.exit(1);
});
