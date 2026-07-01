/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 */

/**
 * Unit tests for Phase 2 attendance math.
 * Pure math functions are duplicated here so tests have no external dependencies
 * (no mongoose, no S3, no Resend). The canonical implementations live in
 * LiveSession.js (breakOverlapMin, attendedMinutesAdjusted, instructionalMinutes)
 * and sessionProducer.js (computeGaps).
 */

import { describe, it, expect } from 'vitest';

// ── Pure math implementations (mirrors LiveSession.js + sessionProducer.js) ───

function breakOverlapMin(segStart, segEnd, breakStart, breakEnd) {
  const overlapStart = Math.max(segStart, breakStart);
  const overlapEnd = Math.min(segEnd, breakEnd);
  if (overlapEnd <= overlapStart) return 0;
  return (overlapEnd - overlapStart) / 60000;
}

function instructionalMinutes(scheduledDurationMin, breaks) {
  const breakMin = (breaks || []).reduce((s, b) => s + b.durationMin, 0);
  return Math.max(1, scheduledDurationMin - breakMin);
}

function attendedMinutesAdjusted(attendance, userId, breaks) {
  const segments = attendance.filter(a => a.user === userId && a.joinedAt && a.leftAt);
  const bks = (breaks || []).map(b => ({
    start: b.startsAt.getTime(),
    end: b.startsAt.getTime() + b.durationMin * 60000
  }));
  let total = 0;
  for (const seg of segments) {
    const segStart = seg.joinedAt.getTime();
    const segEnd = seg.leftAt.getTime();
    let rawMin = Math.max(0, (segEnd - segStart) / 60000);
    for (const br of bks) rawMin -= breakOverlapMin(segStart, segEnd, br.start, br.end);
    total += Math.max(0, rawMin);
  }
  return Math.round(total);
}

function meetsAttendanceThreshold(attendance, userId, scheduledDurationMin, breaks, thresholdPct) {
  const instMin = instructionalMinutes(scheduledDurationMin, breaks);
  const required = instMin * (thresholdPct / 100);
  return attendedMinutesAdjusted(attendance, userId, breaks) >= required;
}

function insideBreakWindow(breaks, when) {
  return (breaks || []).some(b => {
    const start = b.startsAt.getTime();
    const end = start + b.durationMin * 60000;
    const t = when.getTime();
    return t >= start && t < end;
  });
}

function computeGaps(session, userId) {
  const segments = session.attendance
    .filter(a => a.user === userId && a.joinedAt && a.leftAt)
    .sort((a, b) => a.joinedAt - b.joinedAt);

  if (segments.length === 0) return [];

  const gaps = [];
  const sessionStart = session.scheduledStart.getTime();
  const sessionEnd = session.scheduledEnd.getTime();

  for (let i = 0; i < segments.length - 1; i++) {
    const left = segments[i].leftAt;
    const next = segments[i + 1].joinedAt;
    const gapMin = Math.round((next - left) / 60000);
    if (gapMin >= 3 && !insideBreakWindow(session.breaks, left)) {
      gaps.push({ leftAt: left, nextJoinAt: next, gapMin, offsetSec: Math.round((left.getTime() - sessionStart) / 1000) });
    }
  }

  const last = segments[segments.length - 1];
  if (last.leftAt.getTime() < sessionEnd) {
    const gapMin = Math.round((sessionEnd - last.leftAt.getTime()) / 60000);
    if (gapMin >= 3 && !insideBreakWindow(session.breaks, last.leftAt)) {
      gaps.push({ leftAt: last.leftAt, nextJoinAt: null, gapMin, offsetSec: Math.round((last.leftAt.getTime() - sessionStart) / 1000) });
    }
  }

  return gaps;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

const BASE = new Date('2026-06-12T14:00:00Z');
const ms = n => n * 60000;

function atMin(offsetMin, durationMin) {
  return {
    joinedAt: new Date(BASE.getTime() + ms(offsetMin)),
    leftAt: new Date(BASE.getTime() + ms(offsetMin + durationMin))
  };
}

function lunchBreak(offsetMin = 60, dur = 30) {
  return { label: 'Lunch', startsAt: new Date(BASE.getTime() + ms(offsetMin)), durationMin: dur };
}

// ── breakOverlapMin ────────────────────────────────────────────────────────────

describe('breakOverlapMin', () => {
  it('returns 0 when segment entirely before break', () => {
    expect(breakOverlapMin(0, ms(30), ms(60), ms(90))).toBe(0);
  });

  it('returns 0 when segment entirely after break', () => {
    expect(breakOverlapMin(ms(100), ms(120), ms(60), ms(90))).toBe(0);
  });

  it('returns 30 when segment spans entire break', () => {
    expect(breakOverlapMin(0, ms(120), ms(60), ms(90))).toBe(30);
  });

  it('returns 20 when segment starts inside break', () => {
    expect(breakOverlapMin(ms(70), ms(120), ms(60), ms(90))).toBe(20);
  });

  it('returns 20 when segment ends inside break', () => {
    expect(breakOverlapMin(0, ms(80), ms(60), ms(90))).toBe(20);
  });

  it('returns 10 when segment entirely inside break', () => {
    expect(breakOverlapMin(ms(65), ms(75), ms(60), ms(90))).toBe(10);
  });

  it('returns 0 at touching boundary (no overlap)', () => {
    expect(breakOverlapMin(0, ms(60), ms(60), ms(90))).toBe(0);
  });
});

// ── instructionalMinutes ───────────────────────────────────────────────────────

describe('instructionalMinutes', () => {
  it('equals scheduled duration when no breaks', () => {
    expect(instructionalMinutes(180, [])).toBe(180);
  });

  it('subtracts 30-min lunch from 3-hr session → 150', () => {
    expect(instructionalMinutes(180, [lunchBreak()])).toBe(150);
  });

  it('floors to 1 when breaks exceed duration', () => {
    expect(instructionalMinutes(30, [{ label: 'B', startsAt: BASE, durationMin: 120 }])).toBe(1);
  });
});

// ── attendedMinutesAdjusted ────────────────────────────────────────────────────

describe('attendedMinutesAdjusted', () => {
  it('returns raw minutes when no breaks', () => {
    const att = [{ user: 'u1', ...atMin(0, 180) }];
    expect(attendedMinutesAdjusted(att, 'u1', [])).toBe(180);
  });

  it('clips break overlap — full session through lunch banks 150 min', () => {
    const att = [{ user: 'u1', ...atMin(0, 180) }];
    expect(attendedMinutesAdjusted(att, 'u1', [lunchBreak(60, 30)])).toBe(150);
  });

  it('handles multiple segments with break clipping', () => {
    const att = [
      { user: 'u1', ...atMin(0, 50) },
      { user: 'u1', ...atMin(95, 85) }
    ];
    // Break 60–90. First seg 0–50: no overlap. Second seg 95–180: no overlap.
    expect(attendedMinutesAdjusted(att, 'u1', [lunchBreak(60, 30)])).toBe(135);
  });

  it('returns 0 for a user with no attendance', () => {
    expect(attendedMinutesAdjusted([], 'u1', [])).toBe(0);
  });
});

// ── meetsAttendanceThreshold ───────────────────────────────────────────────────

describe('meetsAttendanceThreshold', () => {
  it('3-hr session + 30-min lunch: denominator 150, threshold 90% = 135 min', () => {
    const att = [{ user: 'u1', ...atMin(0, 130) }];
    expect(meetsAttendanceThreshold(att, 'u1', 180, [lunchBreak(60, 30)], 90)).toBe(false);
  });

  it('135 min adjusted → exactly meets 90% of 150', () => {
    // Break 60–90. Attend 0–60 (60 min) + 90–165 (75 min) = 135 instructional min.
    const att = [
      { user: 'u1', ...atMin(0, 60) },
      { user: 'u1', ...atMin(90, 75) }
    ];
    expect(meetsAttendanceThreshold(att, 'u1', 180, [lunchBreak(60, 30)], 90)).toBe(true);
  });

  it('user connected entire session: adjusted 150 ≥ 135 → true', () => {
    const att = [{ user: 'u1', ...atMin(0, 180) }];
    expect(meetsAttendanceThreshold(att, 'u1', 180, [lunchBreak(60, 30)], 90)).toBe(true);
  });
});

// ── computeGaps ───────────────────────────────────────────────────────────────

describe('computeGaps', () => {
  function makeSession(durationMin = 120, breaks = [], attendance = []) {
    return {
      scheduledStart: BASE,
      scheduledEnd: new Date(BASE.getTime() + ms(durationMin)),
      breaks,
      attendance
    };
  }

  it('returns empty for open segment (no leftAt)', () => {
    const s = makeSession(120, [], [{ user: 'u1', joinedAt: BASE, leftAt: null }]);
    expect(computeGaps(s, 'u1')).toHaveLength(0);
  });

  it('detects a 10-min mid-session gap', () => {
    const s = makeSession(120, [], [
      { user: 'u1', ...atMin(0, 30) },
      { user: 'u1', ...atMin(40, 80) }
    ]);
    const gaps = computeGaps(s, 'u1');
    expect(gaps).toHaveLength(1);
    expect(gaps[0].gapMin).toBe(10);
  });

  it('ignores a gap < 3 min', () => {
    const s = makeSession(120, [], [
      { user: 'u1', ...atMin(0, 30) },
      { user: 'u1', ...atMin(32, 88) }
    ]);
    expect(computeGaps(s, 'u1')).toHaveLength(0);
  });

  it('detects a trailing gap when user left before scheduledEnd', () => {
    const s = makeSession(120, [], [{ user: 'u1', ...atMin(0, 60) }]);
    const gaps = computeGaps(s, 'u1');
    expect(gaps).toHaveLength(1);
    expect(gaps[0].gapMin).toBe(60);
    expect(gaps[0].nextJoinAt).toBeNull();
  });

  it('excludes gaps inside a declared break window', () => {
    const breakObj = { label: 'Break', startsAt: new Date(BASE.getTime() + ms(30)), durationMin: 15 };
    const s = makeSession(120, [breakObj], [
      { user: 'u1', ...atMin(0, 30) },
      { user: 'u1', ...atMin(45, 75) }
    ]);
    expect(computeGaps(s, 'u1')).toHaveLength(0);
  });

  it('returns correct offsetSec from scheduledStart', () => {
    const s = makeSession(120, [], [
      { user: 'u1', ...atMin(0, 45) },
      { user: 'u1', ...atMin(60, 60) }
    ]);
    const gaps = computeGaps(s, 'u1');
    expect(gaps[0].offsetSec).toBe(45 * 60);
  });
});
