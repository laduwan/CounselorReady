/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 */

/**
 * breakPlanner — PURE planning for live-session breaks/lunch (no DB, no Whereby).
 * Used by POST /:id/breaks/plan (preview) and PUT /:id/breaks (apply) in
 * routes/liveSessions.js so the admin preview and the write can never disagree.
 *
 * NBCC rule this protects: instructional minutes = (scheduledEnd − scheduledStart)
 * − sum(breaks). See LiveSession.instructionalMinutes(). Adding a break inside a
 * fixed window silently drops CE minutes, so by default the planner EXTENDS
 * scheduledEnd to keep instructional minutes = ceuHours × 60.
 *
 * What a plan contains:
 *   breaks[]      sorted, validated, optionally snapped to run-of-show boundaries
 *   agenda[]      existing segments with ALL prior type:'break' segments removed
 *                 and one type:'break' segment inserted per break (renumbered)
 *   scheduledEnd  start + target instructional minutes + total break minutes
 *   errors[]      blocking problems (apply refuses)
 *   warnings[]    non-blocking notes shown in the admin preview
 */

const MS = 60000;

function fmtTime(d, tz) {
  return new Date(d).toLocaleTimeString('en-US', { timeZone: tz, hour: 'numeric', minute: '2-digit' });
}

function sumMin(arr) {
  return arr.reduce((n, s) => n + (Number(s.durationMin) || 0), 0);
}

/**
 * @param {object} session  lean or hydrated LiveSession (needs scheduledStart/End,
 *                          ceuHours, agenda, breaks, sessionType, timezone)
 * @param {Array}  input    [{ label, startsAt, durationMin, resumeReminderSentAt? }]
 * @param {object} opts     { adjustEnd = true, snap = true, lockAgendaAndEnd = false }
 */
export function planBreaks(session, input, opts = {}) {
  const adjustEnd = opts.adjustEnd !== false && !opts.lockAgendaAndEnd;
  const errors = [];
  const warnings = [];
  const tz = session.timezone || 'America/New_York';

  const start = new Date(session.scheduledStart);
  const oldEnd = new Date(session.scheduledEnd);
  const oldWindowMin = Math.round((oldEnd - start) / MS);
  const oldBreakMin = sumMin(session.breaks || []);

  // ── 1. Normalize + validate rows ──────────────────────────────────────────
  const rows = [];
  (Array.isArray(input) ? input : []).forEach((b, i) => {
    const label = String((b && b.label) || 'Break').trim().slice(0, 60) || 'Break';
    const dur = Number(b && b.durationMin);
    const when = new Date(b && b.startsAt);
    if (!b || !b.startsAt || isNaN(when.getTime())) { errors.push(`Row ${i + 1}: start time is required.`); return; }
    if (!Number.isInteger(dur) || dur < 1 || dur > 120) { errors.push(`Row ${i + 1}: minutes must be a whole number 1–120.`); return; }
    const row = { label, startsAt: when, durationMin: dur };
    if (b.resumeReminderSentAt) row.resumeReminderSentAt = new Date(b.resumeReminderSentAt);
    rows.push(row);
  });
  rows.sort((a, b) => a.startsAt - b.startsAt);

  const breakMin = sumMin(rows);
  const ceuMin = Math.round((Number(session.ceuHours) || 0) * 60);
  // Target instructional minutes: CE hours when set; otherwise keep whatever the
  // session delivers today (supervision / non-CE sessions).
  const targetMin = ceuMin > 0 ? ceuMin : Math.max(1, oldWindowMin - oldBreakMin);

  // ── 2. Run-of-show boundaries (instructional minutes, breaks excluded) ────
  const isLiveCourse = session.sessionType === 'live-course';
  const content = isLiveCourse
    ? [...(session.agenda || [])].filter(a => a.type !== 'break').sort((a, b) => a.order - b.order)
    : [];
  const hasAgenda = content.length > 1;
  const agendaMin = sumMin(content);
  const boundaries = []; // { min, afterIdx, afterTitle }
  if (hasAgenda) {
    let c = 0;
    for (let i = 0; i < content.length - 1; i++) {
      c += Number(content[i].durationMin) || 0;
      boundaries.push({ min: c, afterIdx: i, afterTitle: content[i].title || content[i].type });
    }
    if (agendaMin !== targetMin) {
      warnings.push(`Run of show totals ${agendaMin} min but the CE target is ${targetMin} min — break positions follow the run of show.`);
    }
  }
  const snap = opts.snap !== false && hasAgenda && !opts.lockAgendaAndEnd;

  // ── 3. Place each break ───────────────────────────────────────────────────
  let priorBreakMin = 0;
  const placed = [];
  const usedBoundaries = new Set();
  for (const r of rows) {
    const clockOffset = Math.round((r.startsAt - start) / MS);
    let instrOffset = clockOffset - priorBreakMin;
    let afterIdx = null;
    let afterTitle = null;

    if (snap) {
      let best = boundaries[0];
      for (const bd of boundaries) {
        if (Math.abs(bd.min - instrOffset) < Math.abs(best.min - instrOffset)) best = bd;
      }
      if (best.min !== instrOffset) {
        const moved = best.min - instrOffset;
        warnings.push(`"${r.label}" moved ${Math.abs(moved)} min ${moved > 0 ? 'later' : 'earlier'} to the end of "${best.afterTitle}".`);
      }
      if (usedBoundaries.has(best.min)) {
        errors.push(`"${r.label}" lands at the same point as another break (after "${best.afterTitle}"). Merge them or move one.`);
      }
      usedBoundaries.add(best.min);
      instrOffset = best.min;
      afterIdx = best.afterIdx;
      afterTitle = best.afterTitle;
      r.startsAt = new Date(start.getTime() + (instrOffset + priorBreakMin) * MS);
    } else if (hasAgenda) {
      const hit = boundaries.find(bd => bd.min === instrOffset);
      if (hit) { afterIdx = hit.afterIdx; afterTitle = hit.afterTitle; }
    }

    if (instrOffset <= 0) errors.push(`"${r.label}" starts at or before the session start.`);
    if (instrOffset >= targetMin) errors.push(`"${r.label}" starts after all instruction is finished.`);

    placed.push({ ...r, afterIdx, afterTitle, instrOffset });
    priorBreakMin += r.durationMin;
  }

  // ── 4. End time ───────────────────────────────────────────────────────────
  const newEnd = adjustEnd ? new Date(start.getTime() + (targetMin + breakMin) * MS) : oldEnd;
  const windowMin = Math.round((newEnd - start) / MS);
  const instructionalMin = windowMin - breakMin;

  for (const p of placed) {
    if (p.startsAt.getTime() + p.durationMin * MS > newEnd.getTime()) {
      errors.push(`"${p.label}" runs past the session end (${fmtTime(newEnd, tz)}).`);
    }
  }
  if (instructionalMin < targetMin) {
    const msg = `Instructional time would be ${instructionalMin} min — ${targetMin - instructionalMin} min short of ${ceuMin > 0 ? `${session.ceuHours} CE hours` : 'the current session length'}.`;
    if (ceuMin > 0 && !opts.lockAgendaAndEnd) errors.push(msg + ' Turn on "Extend end time" or shorten the breaks.');
    else warnings.push(msg);
  }

  // ── 5. Rebuild run of show ────────────────────────────────────────────────
  let agenda = null; // null = leave agenda untouched
  const priorBreakSegs = (session.agenda || []).filter(a => a.type === 'break').length;
  if (isLiveCourse && (session.agenda || []).length && !opts.lockAgendaAndEnd) {
    const byAfter = new Map();
    for (const p of placed) if (p.afterIdx !== null) byAfter.set(p.afterIdx, p);
    const unplaced = placed.filter(p => p.afterIdx === null);
    if (unplaced.length) {
      warnings.push(`${unplaced.map(p => `"${p.label}"`).join(', ')} ${unplaced.length === 1 ? 'is' : 'are'} not on a segment boundary, so ${unplaced.length === 1 ? 'it' : 'they'} won't appear in the run of show.`);
    }
    const out = [];
    content.forEach((seg, i) => {
      const plain = typeof seg.toObject === 'function' ? seg.toObject() : { ...seg };
      out.push(plain);
      const p = byAfter.get(i);
      if (p) {
        const back = new Date(p.startsAt.getTime() + p.durationMin * MS);
        out.push({ type: 'break', title: p.label, durationMin: p.durationMin, prompt: `${p.label} — back at ${fmtTime(back, tz)}` });
      }
    });
    agenda = out.map((a, i) => ({ ...a, order: i }));
  }

  const breaks = placed.map(({ label, startsAt, durationMin, resumeReminderSentAt }) => {
    const b = { label, startsAt, durationMin };
    if (resumeReminderSentAt) b.resumeReminderSentAt = resumeReminderSentAt;
    return b;
  });

  const endChanged = newEnd.getTime() !== oldEnd.getTime();
  return {
    breaks,
    agenda,
    scheduledStart: start,
    scheduledEnd: newEnd,
    oldScheduledEnd: oldEnd,
    endChanged,
    endDeltaMin: Math.round((newEnd - oldEnd) / MS),
    windowMin,
    breakMin,
    instructionalMin,
    targetMin,
    ceuHours: Number(session.ceuHours) || 0,
    agendaChange: agenda ? { before: (session.agenda || []).length, after: agenda.length, breakSegsBefore: priorBreakSegs, breakSegsAfter: agenda.filter(a => a.type === 'break').length } : null,
    placements: placed.map(p => ({
      label: p.label,
      startsAt: p.startsAt,
      endsAt: new Date(p.startsAt.getTime() + p.durationMin * MS),
      durationMin: p.durationMin,
      afterTitle: p.afterTitle,
      display: `${fmtTime(p.startsAt, tz)}–${fmtTime(p.startsAt.getTime() + p.durationMin * MS, tz)}`
    })),
    display: { start: fmtTime(start, tz), end: fmtTime(newEnd, tz), oldEnd: fmtTime(oldEnd, tz) },
    errors,
    warnings
  };
}
