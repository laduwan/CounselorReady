#!/usr/bin/env node
/**
 * backfillWordCount.js
 *
 * Re-saves every course so the pre-save hook in InteractiveCourse.js
 * recomputes wordCount + totalContentBlocks under the current logic.
 *
 * Run after deploying changes to the pre-save hook.
 *
 *   node src/scripts/backfillWordCount.js
 *
 * Safe to re-run. No content is modified — only the derived counters.
 */

import mongoose from 'mongoose';
import { Course as InteractiveCourse } from '../models/InteractiveCourse.js';
import 'dotenv/config';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI not set');
  process.exit(1);
}

async function main() {
  await mongoose.connect(MONGODB_URI);
  try {
    const all = await InteractiveCourse.find({}).sort({ courseCode: 1 });
    console.log(`Re-saving ${all.length} courses…\n`);

    const results = [];
    let raised = 0, dropped = 0, unchanged = 0, failed = 0;

    for (const c of all) {
      const code = c.courseCode || c.slug?.slice(0, 40) || c._id.toString().slice(-6);
      const before = c.wordCount || 0;
      const blocksBefore = c.totalContentBlocks || 0;
      const status = c.status || '?';
      const ce = c.ceHours || 0;

      try {
        await c.save();
        const after = c.wordCount;
        const blocksAfter = c.totalContentBlocks;
        const delta = after - before;
        const arrow = delta > 0 ? '↑' : delta < 0 ? '↓' : '·';
        if (delta > 0) raised++;
        else if (delta < 0) dropped++;
        else unchanged++;

        const floor = ce * 5820; // 97% of 6000 — methodology-adjusted ACEP floor
        const passes = after >= floor ? '✓' : '✗';

        results.push({ code, status, ce, before, after, delta, blocksBefore, blocksAfter, passes });
        console.log(
          `${passes} ${code.padEnd(28)} [${status.padEnd(9)}] ${ce}CE  ` +
          `${String(before).padStart(6)} ${arrow} ${String(after).padStart(6)}  ` +
          `(blocks ${blocksBefore} → ${blocksAfter})`
        );
      } catch (err) {
        failed++;
        console.log(`✗ ${code.padEnd(28)} SAVE FAILED: ${err.message?.slice(0, 80)}`);
      }
    }

    // Summary
    console.log('\n' + '─'.repeat(72));
    console.log(`Re-saved: ${all.length - failed} of ${all.length}`);
    console.log(`  ↑ raised:    ${raised}`);
    console.log(`  ↓ dropped:   ${dropped}`);
    console.log(`  · unchanged: ${unchanged}`);
    if (failed) console.log(`  ✗ failed:    ${failed}`);

    // Audit summary at 5,820 words/CE methodology-adjusted floor
    const published = results.filter(r => r.status === 'published');
    const passing = published.filter(r => r.passes === '✓').length;
    const failing = published.filter(r => r.passes === '✗');
    console.log(`\nAudit at 5,820 words/CE floor (97% methodology adjustment):`);
    console.log(`  Published courses: ${published.length}`);
    console.log(`  ✓ Passing: ${passing}`);
    console.log(`  ✗ Failing: ${failing.length}`);
    if (failing.length) {
      console.log('\n  Failing courses (still below 5,820/CE):');
      for (const r of failing) {
        const floor = r.ce * 5820;
        console.log(`    ${r.code}  ${r.ce}CE  ${r.after} words  (needs ${floor}, short by ${floor - r.after})`);
      }
    }
  } finally {
    await mongoose.disconnect();
  }
}

main().catch(err => { console.error(err); process.exit(1); });
