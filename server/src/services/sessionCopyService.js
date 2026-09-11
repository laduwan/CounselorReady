/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 */

/**
 * sessionCopyService — PURE helpers (no DB, no Whereby) behind two admin actions
 * in routes/liveSessions.js, so a new session never starts with an empty run of show:
 *
 *   POST /:id/duplicate           → buildDuplicate(): a new session that carries the
 *                                   source's run of show (incl. host-only speaker
 *                                   scripts), breaks (moved with the new start time),
 *                                   handouts, clips, description, presenter, and CE
 *                                   settings. Never copies registrants, attendance,
 *                                   recordings, live state, producer state, or the room.
 *
 *   POST /:id/agenda/copy-from    → mergeAgendas(): fill an EXISTING session's run of
 *                                   show from one or more other sessions, in order
 *                                   (e.g. Part 1 + Part 2 → the 5-hour day). Clips a
 *                                   copied segment points at are brought along and
 *                                   re-indexed. Break segments are not copied — breaks
 *                                   belong to the target and are placed by the Breaks tool.
 */

const MS = 60000;

const strip = (arr) => (arr || []).map(x => { const { _id, ...rest } = x; return rest; });
const sumMin = (arr) => (arr || []).reduce((n, s) => n + (Number(s.durationMin) || 0), 0);
const scripted = (arr) => (arr || []).filter(a => (a.script || '').trim().length > 0).length;

/**
 * @param {object} src  lean LiveSession (source)
 * @param {object} o    { title?, slug, scheduledStart, scheduledEnd?, isPublished?,
 *                        ceuHours?, capacity?, price?, attendanceThresholdPct?,
 *                        recordingEnabled?, registrationCutoffDays? }
 * @returns {{ doc, summary, warnings }}
 */
export function buildDuplicate(src, o = {}) {
  const warnings = [];
  const slug = String(o.slug || '').trim().toLowerCase();
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) throw new Error('Slug is required — lowercase letters, numbers, and hyphens only.');

  const newStart = new Date(o.scheduledStart);
  if (!o.scheduledStart || isNaN(newStart.getTime())) throw new Error('Pick a start date and time for the new session.');
  const srcStart = new Date(src.scheduledStart);
  const srcWinMs = new Date(src.scheduledEnd) - srcStart;
  const newEnd = o.scheduledEnd ? new Date(o.scheduledEnd) : new Date(newStart.getTime() + srcWinMs);
  if (isNaN(newEnd.getTime()) || newEnd <= newStart) throw new Error('End time must be after the start time.');

  const isSupervision = src.sessionType === 'supervision';
  const delta = newStart - srcStart;

  // Breaks keep their position relative to the start.
  const breaks = [];
  for (const b of (src.breaks || [])) {
    const startsAt = new Date(new Date(b.startsAt).getTime() + delta);
    const endsAt = startsAt.getTime() + (b.durationMin || 0) * MS;
    if (startsAt < newStart || endsAt > newEnd.getTime()) {
      warnings.push(`Break "${b.label || 'Break'}" no longer fits inside the new time window and was not copied.`);
      continue;
    }
    breaks.push({ label: b.label || 'Break', startsAt, durationMin: b.durationMin });
  }

  const num = (v, fallback) => (v === undefined || v === null || v === '' || !Number.isFinite(Number(v)) ? fallback : Number(v));
  const doc = {
    title: String(o.title || src.title || '').trim(),
    slug,
    description: src.description || '',
    presenter: src.presenter ? { ...src.presenter } : undefined,
    sessionType: src.sessionType,
    courseRef: src.courseRef,
    ceuHours: isSupervision ? 0 : num(o.ceuHours, src.ceuHours || 0),
    nbccContentAreas: [...(src.nbccContentAreas || [])],
    category: src.category,
    supervisionFormat: src.supervisionFormat ?? null,
    scheduledStart: newStart,
    scheduledEnd: newEnd,
    timezone: src.timezone || 'America/New_York',
    capacity: num(o.capacity, src.capacity || 50),
    registrationCutoffDays: num(o.registrationCutoffDays, src.registrationCutoffDays ?? 7),
    price: num(o.price, src.price || 0),
    isPublished: !!o.isPublished,
    attendanceThresholdPct: num(o.attendanceThresholdPct, src.attendanceThresholdPct || 90),
    recordingEnabled: isSupervision ? false : (o.recordingEnabled === undefined ? !!src.recordingEnabled : !!o.recordingEnabled),
    handouts: isSupervision ? [] : strip(src.handouts),
    clips: isSupervision ? [] : strip(src.clips),
    agenda: isSupervision ? [] : strip(src.agenda).map((a, i) => ({ ...a, order: i })),
    breaks,
    // Series link travels with the copy (one certificate across the parts)
    // Admin can change/remove the series in the Duplicate form; otherwise keep the source's.
    seriesId: isSupervision ? null : ('seriesId' in o ? (o.seriesId || null) : (src.seriesId || null)),
    ...((('seriesPart' in o ? o.seriesPart : src.seriesPart) && !isSupervision) ? { seriesPart: Number('seriesPart' in o ? o.seriesPart : src.seriesPart) } : {})
  };
  if (!doc.title) throw new Error('Title is required.');

  // CE sanity check (informational — admin may be changing the format on purpose).
  const windowMin = Math.round((newEnd - newStart) / MS);
  const instrMin = windowMin - sumMin(breaks);
  if (doc.ceuHours > 0 && instrMin !== Math.round(doc.ceuHours * 60)) {
    warnings.push(`Instructional time is ${instrMin} min but CE hours = ${doc.ceuHours} (${Math.round(doc.ceuHours * 60)} min). Check the end time or breaks.`);
  }

  return {
    doc,
    summary: {
      segments: doc.agenda.length,
      scripted: scripted(doc.agenda),
      agendaMin: sumMin(doc.agenda),
      breaks: breaks.length,
      handouts: doc.handouts.length,
      clips: doc.clips.length,
      windowMin,
      instructionalMin: instrMin
    },
    warnings
  };
}

/**
 * @param {object}   target   lean LiveSession being filled
 * @param {object[]} sources  lean LiveSessions, in the order their segments should run
 * @param {'replace'|'append'} mode
 * @returns {{ agenda, clips, stats, warnings }}
 */
export function mergeAgendas(target, sources, mode = 'replace') {
  const warnings = [];
  const clips = strip(target.clips);
  const clipIndexByKey = new Map(clips.map((c, i) => [c.s3Key, i]));

  const base = mode === 'append'
    ? strip((target.agenda || []).filter(a => a.type !== 'break')).sort((a, b) => a.order - b.order)
    : [];

  const added = [];
  let droppedBreakSegs = 0;
  for (const src of sources) {
    const segs = [...(src.agenda || [])].sort((a, b) => a.order - b.order);
    for (const seg of segs) {
      if (seg.type === 'break') { droppedBreakSegs++; continue; }
      const { _id, ...copy } = seg;
      if (copy.clipIndex !== undefined && copy.clipIndex !== null) {
        const clip = (src.clips || [])[copy.clipIndex];
        if (!clip) {
          delete copy.clipIndex;
          warnings.push(`"${copy.title || 'Clip segment'}" pointed at a clip that no longer exists — re-select its clip.`);
        } else {
          if (!clipIndexByKey.has(clip.s3Key)) {
            const { _id: _cid, ...c } = clip;
            clips.push(c);
            clipIndexByKey.set(clip.s3Key, clips.length - 1);
          }
          copy.clipIndex = clipIndexByKey.get(clip.s3Key);
        }
      }
      added.push(copy);
    }
  }

  const agenda = [...base, ...added].map((a, i) => ({ ...a, order: i }));
  const agendaMin = sumMin(agenda);
  const windowMin = Math.round((new Date(target.scheduledEnd) - new Date(target.scheduledStart)) / MS);
  const breakMin = sumMin(target.breaks);
  const instrMin = windowMin - breakMin;

  if ((target.breaks || []).length) {
    warnings.push(`This session has ${target.breaks.length} break(s). Open Breaks and click Save & Apply so they appear in the new run of show.`);
  }
  if (droppedBreakSegs) {
    warnings.push(`${droppedBreakSegs} break segment(s) from the source were skipped — add breaks for this session with the Breaks button.`);
  }
  if (agendaMin !== instrMin) {
    warnings.push(`Run of show totals ${agendaMin} min; this session has ${instrMin} instructional min. ${agendaMin > instrMin ? 'Trim segments or extend the end time.' : 'Add segments or shorten the end time.'}`);
  }

  return {
    agenda,
    clips,
    stats: { segments: agenda.length, added: added.length, scripted: scripted(agenda), agendaMin, instructionalMin: instrMin, clipsAdded: clips.length - (target.clips || []).length },
    warnings
  };
}

/**
 * Suggest a slug for a copy: drop a trailing date/week token from the source
 * slug and add the new date — "ethics-table-talk-part2-wk8-6pm" + Oct 20 →
 * "ethics-table-talk-part2-oct20". Uses America/New_York for the date.
 */
export function suggestSlug(srcSlug, newStart) {
  const d = new Date(newStart);
  const mon = d.toLocaleString('en-US', { month: 'short', timeZone: 'America/New_York' }).toLowerCase();
  const day = d.toLocaleString('en-US', { day: 'numeric', timeZone: 'America/New_York' });
  const base = String(srcSlug || 'session').replace(/-copy$/, '').replace(/-(wk\d+.*|[a-z]{3}\d{1,2}(-\d{4})?)$/, '');
  return `${base}-${mon}${day}`.slice(0, 80);
}
