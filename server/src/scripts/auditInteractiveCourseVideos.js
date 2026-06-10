/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of GA Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 *
 * auditInteractiveCourseVideos.js
 *
 * Scans every video / videoEmbed block in the interactivecourses collection,
 * checks each videoUrl via YouTube oEmbed (no API key required), and writes
 * videoStatus: 'live' | 'dead' | 'unknown' back to each block in MongoDB.
 *
 * The viewer reads block.videoStatus — dead blocks show a styled fallback
 * card instead of a broken iframe.
 *
 * Usage:
 *   node src/scripts/auditInteractiveCourseVideos.js          # dry run
 *   APPLY=1 node src/scripts/auditInteractiveCourseVideos.js  # write to DB
 *
 * Anti-lying gate (dry run):
 *   node src/scripts/auditInteractiveCourseVideos.js | grep -E "checked|live|dead"
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import InteractiveCourse from '../models/InteractiveCourse.js';

const DRY_RUN = process.env.APPLY !== '1';
const DELAY_MS = 650; // between YouTube checks — avoids rate-limiting

// ─── YouTube ID extractor ──────────────────────────────────────
function extractYouTubeId(url) {
  const m = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?#]+)/
  );
  return m ? m[1] : null;
}

// ─── URL status checker ────────────────────────────────────────
async function checkVideoUrl(url) {
  if (!url) return { status: 'unknown', reason: 'No URL' };

  const ytId = extractYouTubeId(url);

  if (ytId) {
    // YouTube: use oEmbed — no API key, returns 404 for deleted/private
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${ytId}&format=json`,
        { signal: controller.signal }
      );
      clearTimeout(timer);
      if (res.ok) {
        const data = await res.json();
        return { status: 'live', title: data.title };
      }
      if ([400, 403, 404].includes(res.status)) {
        return { status: 'dead', reason: `oEmbed HTTP ${res.status}` };
      }
      return { status: 'unknown', reason: `oEmbed HTTP ${res.status}` };
    } catch (e) {
      return { status: 'unknown', reason: e.message };
    }
  }

  // Non-YouTube: HEAD request
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, { method: 'HEAD', signal: controller.signal });
    clearTimeout(timer);
    return res.ok
      ? { status: 'live' }
      : { status: 'dead', reason: `HTTP ${res.status}` };
  } catch (e) {
    return { status: 'unknown', reason: e.message };
  }
}

// ─── Main ──────────────────────────────────────────────────────
async function main() {
  await mongoose.connect(process.env.MONGODB_URI);

  console.log(`\nCReady Video Audit — ${DRY_RUN ? 'DRY RUN (no writes)' : '⚠️  APPLY MODE (writing to DB)'}`);
  console.log('─'.repeat(65));

  const courses = await InteractiveCourse.find({}, 'title slug sections').lean();
  console.log(`Found ${courses.length} courses in interactivecourses\n`);

  let totalChecked = 0;
  let totalLive    = 0;
  let totalDead    = 0;
  let totalUnknown = 0;
  const deadList   = [];
  const updates    = []; // { courseId, sIdx, bIdx, status }

  for (const course of courses) {
    const videoBlocks = [];

    (course.sections || []).forEach((section, sIdx) => {
      (section.contentBlocks || []).forEach((block, bIdx) => {
        if (block.type === 'video' || block.type === 'videoEmbed') {
          videoBlocks.push({ section, sIdx, block, bIdx });
        }
      });
    });

    if (!videoBlocks.length) continue;

    console.log(`📚  ${course.title}`);
    console.log(`    slug: ${course.slug} · ${videoBlocks.length} video block(s)`);

    for (const { section, sIdx, block, bIdx } of videoBlocks) {
      totalChecked++;
      const url = block.videoUrl || '';
      const short = url.length > 55 ? url.substring(0, 52) + '...' : url;

      process.stdout.write(`    ⏳  §${sIdx + 1} block[${bIdx}]  ${short}  `);

      const result = await checkVideoUrl(url);
      updates.push({ courseId: course._id, sIdx, bIdx, status: result.status });

      if (result.status === 'live') {
        totalLive++;
        console.log(`✅  live${result.title ? '  —  ' + result.title : ''}`);
      } else if (result.status === 'dead') {
        totalDead++;
        console.log(`❌  DEAD  —  ${result.reason}`);
        deadList.push({
          course:  course.title,
          slug:    course.slug,
          section: section.title || `Section ${sIdx + 1}`,
          url,
          reason:  result.reason
        });
      } else {
        totalUnknown++;
        console.log(`❓  unknown  —  ${result.reason}`);
      }

      await new Promise(r => setTimeout(r, DELAY_MS));
    }

    console.log('');
  }

  // ─── Summary ───────────────────────────────────────────────
  console.log('─'.repeat(65));
  console.log(
    `SUMMARY  |  ${totalChecked} checked  ·  ` +
    `${totalLive} live ✅  ·  ` +
    `${totalDead} dead ❌  ·  ` +
    `${totalUnknown} unknown ❓`
  );

  if (deadList.length) {
    console.log('\nDEAD VIDEO LIST:');
    deadList.forEach((d, i) => {
      console.log(`  ${i + 1}.  ${d.course}  →  §${d.section}`);
      console.log(`       URL:    ${d.url}`);
      console.log(`       Reason: ${d.reason}`);
    });
  }

  // ─── Write ─────────────────────────────────────────────────
  if (!DRY_RUN) {
    if (!updates.length) {
      console.log('\nNo video blocks found — nothing to write.');
    } else {
      console.log(`\nWriting videoStatus to ${updates.length} blocks…`);
      let written = 0;
      for (const { courseId, sIdx, bIdx, status } of updates) {
        await InteractiveCourse.updateOne(
          { _id: courseId },
          { $set: { [`sections.${sIdx}.contentBlocks.${bIdx}.videoStatus`]: status } }
        );
        written++;
      }
      console.log(`WROTE ${written} block(s).`);
    }
  } else {
    console.log('\nDry run complete — no writes. Re-run with APPLY=1 to persist.');
  }

  await mongoose.disconnect();
  console.log('Done.\n');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
