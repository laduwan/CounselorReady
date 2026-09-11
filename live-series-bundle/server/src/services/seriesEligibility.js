/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 */

/**
 * seriesEligibility — PURE rules for "did this person complete the series?"
 * Used by issueSeriesCertificates() in liveSessionCompletionService.js.
 *
 * A person completes a series when, for every part 1..partsRequired, they attended
 * a COMPLETED session of that part at or above its attendance threshold (a
 * session still live — attendance not final — never counts) — and, if
 * the series sets completionRule.withinDays, all of those parts fall within that
 * many days of each other (Ethics Table Talk: 3 → the same Mon+Tue pair; mixing a
 * Part 1 from one week with a Part 2 from a later week does NOT count).
 * withinDays null/unset → flexible: any run, any order.
 */

const DAY = 24 * 60 * 60000;
const MAX_COMBOS = 5000;

/** Which part of its series a session is. Falls back to "Part N" in the title. */
export function partOf(session) {
  const p = Number(session?.seriesPart);
  if (Number.isInteger(p) && p > 0) return p;
  const m = /\bPart\s+(\d+)\b/i.exec(session?.title || '');
  return m ? Number(m[1]) : null;
}

export function ruleOf(series, sessions = []) {
  const maxPart = sessions.reduce((n, s) => Math.max(n, partOf(s) || 0), 0);
  const partsRequired = Number(series?.completionRule?.partsRequired) || maxPart || 2;
  const wd = series?.completionRule?.withinDays;
  const withinDays = wd === null || wd === undefined || wd === '' ? null : Number(wd);
  return { partsRequired, withinDays };
}

export function describeRule(rule) {
  return rule.withinDays === null
    ? `${rule.partsRequired} parts, any time, any order`
    : `${rule.partsRequired} parts within ${rule.withinDays} day${rule.withinDays === 1 ? '' : 's'} of each other`;
}

/**
 * @param {object}   series    SessionSeries (lean ok)
 * @param {object[]} sessions  every LiveSession in the series
 * @param {*}        userId
 * @param {(session, userId) => boolean} meets   attendance check (session.meetsAttendanceThreshold)
 * @returns {{ eligible, counted, missingParts, outOfWindow, rule, ceHours, completionDate }}
 */
export function evaluateSeries(series, sessions, userId, meets) {
  const rule = ruleOf(series, sessions);
  const uid = String(userId);
  const isReg = (s) => (s.registrants || []).some(r => r.user && String(r.user) === uid);

  const byPart = [];
  const missingParts = [];
  for (let p = 1; p <= rule.partsRequired; p++) {
    const cands = sessions
      .filter(s => partOf(s) === p && s.status === 'completed' && isReg(s) && meets(s, userId))
      .sort((a, b) => new Date(b.scheduledEnd) - new Date(a.scheduledEnd)); // newest first
    if (!cands.length) missingParts.push(p);
    byPart.push(cands);
  }
  if (missingParts.length) return { eligible: false, counted: [], missingParts, outOfWindow: false, rule };

  let counted = null;
  if (rule.withinDays === null) {
    counted = byPart.map(c => c[0]);
  } else {
    const limit = rule.withinDays * DAY;
    let best = null, bestEnd = -Infinity, tried = 0;
    const walk = (i, pick) => {
      if (tried > MAX_COMBOS) return;
      if (i === byPart.length) {
        tried++;
        // "within N days" = first start to last start
        const starts = pick.map(s => new Date(s.scheduledStart).getTime());
        const span = Math.max(...starts) - Math.min(...starts);
        const lastEnd = Math.max(...pick.map(s => new Date(s.scheduledEnd).getTime()));
        if (span <= limit && lastEnd > bestEnd) { best = [...pick]; bestEnd = lastEnd; }
        return;
      }
      for (const c of byPart[i]) { pick.push(c); walk(i + 1, pick); pick.pop(); }
    };
    walk(0, []);
    counted = best;
    if (!counted) return { eligible: false, counted: [], missingParts: [], outOfWindow: true, rule };
  }

  const total = Number(series?.totalCeuHours) || 0;
  const ceHours = total > 0 ? total : counted.reduce((n, s) => n + (Number(s.ceuHours) || 0), 0);
  const completionDate = new Date(Math.max(...counted.map(s => new Date(s.scheduledEnd).getTime())));
  return { eligible: true, counted, missingParts: [], outOfWindow: false, rule, ceHours, completionDate };
}
