/**
 * publishAllDrafts.js
 * Find every course in interactivecourses where status !== "published"
 * or isPublished !== true and publish them.
 *
 * Run (dry run):  DRY_RUN=true node src/scripts/publishAllDrafts.js
 * Run (live):     node src/scripts/publishAllDrafts.js
 *
 * Uses native MongoDB driver (not Mongoose).
 */

import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌  MONGODB_URI not set");
  process.exit(1);
}

const DRY_RUN = process.env.DRY_RUN === "true";

async function main() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db();
    const col = db.collection("interactivecourses");

    console.log("\n══════════════════════════════════════════════════════");
    console.log("  publishAllDrafts — publish every unpublished course");
    if (DRY_RUN) console.log("  ⚠️  DRY RUN — no changes will be written");
    console.log("══════════════════════════════════════════════════════\n");

    // Find all courses that are not fully published
    const drafts = await col
      .find({ $or: [{ status: { $ne: "published" } }, { isPublished: { $ne: true } }] })
      .project({ courseCode: 1, slug: 1, title: 1, status: 1, isPublished: 1 })
      .sort({ courseCode: 1 })
      .toArray();

    if (drafts.length === 0) {
      console.log("  ✅  No unpublished courses found — everything is already live.\n");
      return;
    }

    let published = 0;

    for (const doc of drafts) {
      const label = doc.courseCode || doc.slug || String(doc._id);
      console.log(`  ${label} | ${doc.title}`);
      console.log(`    was: status=${doc.status}, isPublished=${doc.isPublished}`);

      if (DRY_RUN) {
        console.log("    now: 🔍 would publish (dry run — no change written)");
      } else {
        const result = await col.updateOne(
          { _id: doc._id },
          { $set: { status: "published", isPublished: true } }
        );
        const changed = result.modifiedCount > 0 ? "✅ published" : "⬜ already published (no change)";
        console.log(`    now: ${changed}`);
        if (result.modifiedCount > 0) published++;
      }
      console.log();
    }

    if (DRY_RUN) {
      console.log(`Done (dry run). ${drafts.length} course(s) would be published.\n`);
    } else {
      console.log(`Done. ${published} course(s) published, ${drafts.length - published} already correct.\n`);
    }
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error("❌  Script error:", err);
  process.exit(1);
});
