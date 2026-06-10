/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of GA Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 *
 * videoLinkAuditJob.js
 *
 * Reusable video-link audit function. Called by:
 *   - Weekly cron (every Monday 3 AM ET) wired in index.js
 *   - POST /api/admin/video-audit/run  (on-demand from admin dashboard)
 *
 * Checks every video / videoEmbed block in interactivecourses via YouTube
 * oEmbed (no API key needed). Writes videoStatus: 'live'|'dead'|'unknown'
 * back to each block, and appends a summary record to the videoauditlog
 * collection for history tracking.
 *
 * Returns: { checked, live, dead, unknown, deadList, ranAt }
 */

import mongoose from 'mongoose';
import { Course as InteractiveCourse } from '../models/InteractiveCourse.js';

const DELAY_MS   = 650;  // between YouTube checks — avoids rate-limiting
const TIMEOUT_MS = 8000;

// ─── Helpers ──────────────────────────────────────────────────
function extractYouTubeId(url) {
  const m = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?#]+)/
  );
  return m ? m[1] : null;
}

async function checkVideoUrl(url) {
  if (!url) return { status: 'unknown', reason: 'No URL' };

  const ytId = extractYouTubeId(url);

  if (ytId) {
    try {
      const ctrl  = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
      const res   = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${ytId}&format=json`,
        { signal: ctrl.signal }
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
    const ctrl  = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    const res   = await fetch(url, { method: 'HEAD', signal: ctrl.signal });
    clearTimeout(timer);
    return res.ok
      ? { status: 'live' }
      : { status: 'dead', reason: `HTTP ${res.status}` };
  } catch (e) {
    return { status: 'unknown', reason: e.message };
  }
}

// ─── Main export ──────────────────────────────────────────────
/**
 * @param {object}  opts
 * @param {boolean} opts.writeResults  Write videoStatus back to DB (default true)
 * @param {boolean} opts.verbose       Log each URL to console (default false)
 */
export async function runVideoLinkAudit({ writeResults = true, verbose = false } = {}) {
  const ranAt   = new Date();
  const courses = await InteractiveCourse.find({}, 'title slug sections').lean();

  let checked = 0, live = 0, dead = 0, unknown = 0;
  const deadList = [];
  const updates  = [];

  for (const course of courses) {
    (course.sections || []).forEach((section, sIdx) => {
      (section.contentBlocks || []).forEach((block, bIdx) => {
        if (block.type === 'video' || block.type === 'videoEmbed') {
          updates.push({ course, section, sIdx, block, bIdx, pending: true });
        }
      });
    });
  }

  if (verbose) {
    console.log(`[VideoAudit] ${courses.length} courses · ${updates.length} video blocks`);
  }

  for (const entry of updates) {
    checked++;
    const result = await checkVideoUrl(entry.block.videoUrl || '');
    entry.status = result.status;

    if (result.status === 'live')  { live++;    }
    if (result.status === 'dead')  {
      dead++;
      deadList.push({
        course:  entry.course.title,
        slug:    entry.course.slug,
        section: entry.section.title || `Section ${entry.sIdx + 1}`,
        url:     entry.block.videoUrl || '',
        reason:  result.reason
      });
    }
    if (result.status === 'unknown') { unknown++; }

    if (verbose) {
      const icon = result.status === 'live' ? '✅' : result.status === 'dead' ? '❌' : '❓';
      console.log(`[VideoAudit] ${icon} ${entry.course.slug} §${entry.sIdx + 1}[${entry.bIdx}] — ${result.status}`);
    }

    await new Promise(r => setTimeout(r, DELAY_MS));
  }

  // ─── Write videoStatus back to blocks ───────────────────────
  if (writeResults && updates.length) {
    for (const entry of updates) {
      if (!entry.status) continue;
      await InteractiveCourse.updateOne(
        { _id: entry.course._id },
        { $set: { [`sections.${entry.sIdx}.contentBlocks.${entry.bIdx}.videoStatus`]: entry.status } }
      );
    }
  }

  // ─── Append to audit log collection ─────────────────────────
  try {
    await mongoose.connection.db.collection('videoauditlog').insertOne({
      ranAt,
      checked,
      live,
      dead,
      unknown,
      deadList,
      writtenToBlocks: writeResults
    });
  } catch (e) {
    console.error('[VideoAudit] Failed to write audit log:', e.message);
  }

  const summary = { checked, live, dead, unknown, deadList, ranAt };

  if (dead > 0) {
    console.warn(`[VideoAudit] ⚠️  ${dead} dead video link(s) found and flagged.`);
    deadList.forEach(d => console.warn(`  ❌  ${d.course} → §${d.section} — ${d.url}`));
  } else if (verbose) {
    console.log(`[VideoAudit] All ${live} video(s) live.`);
  }

  return summary;
}
