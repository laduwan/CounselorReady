/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 *
 * dailyService — thin wrapper around the Daily.co REST API.
 * Used for sessionType: 'live-course' sessions only.
 * Supervision sessions always use wherebyService (HIPAA BAA).
 *
 * Env required:
 *   DAILY_API_KEY    — from Daily dashboard → Developers → API keys
 *   DAILY_DOMAIN     — your Daily domain, e.g. counselorready.daily.co
 *
 * Return shape intentionally mirrors wherebyService so liveRoomService
 * and liveSessions routes can treat both providers uniformly.
 * The `whereby` subdoc on LiveSession is reused for Daily room data —
 * the field is provider-agnostic in practice; `roomProvider` flags which.
 */

const DAILY_API_BASE = 'https://api.daily.co/v1';

function apiKey() {
  const key = process.env.DAILY_API_KEY;
  if (!key) throw new Error('DAILY_API_KEY is not set');
  return key;
}

function domain() {
  const d = process.env.DAILY_DOMAIN;
  if (!d) throw new Error('DAILY_DOMAIN is not set');
  return d.replace(/\/$/, '');
}

async function dailyFetch(path, options = {}) {
  const res = await fetch(`${DAILY_API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Daily API ${res.status} on ${path}: ${body}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

function toRoomName(slug) {
  return `cr-${slug}`.replace(/[^a-zA-Z0-9-]/g, '-').slice(0, 100);
}

export async function createRoom(session) {
  const roomName = toRoomName(session.slug);

  const properties = {
    enable_knocking: true,
    enable_prejoin_ui: true,
    enable_breakout_rooms: true,
    enable_recording: session.recordingEnabled ? 'cloud' : 'off',
    exp: Math.floor(new Date(session.scheduledEnd).getTime() / 1000) + 30 * 60,
    nbf: Math.floor(new Date(session.scheduledStart).getTime() / 1000) - 15 * 60,
  };

  await deleteRoom(roomName).catch(() => {});

  const data = await dailyFetch(`/rooms`, {
    method: 'POST',
    body: JSON.stringify({ name: roomName, properties })
  });

  const d = domain();
  const viewerRoomUrl = data.url || `https://${d}/${roomName}`;
  const hostToken = await mintToken(roomName, { is_owner: true });

  return {
    meetingId: data.id || roomName,
    roomName,
    viewerRoomUrl,
    hostRoomUrl: `${viewerRoomUrl}?t=${hostToken}`,
    windowStart: new Date(session.scheduledStart),
    windowEnd: new Date(session.scheduledEnd)
  };
}

export async function mintToken(roomName, claims = {}) {
  const data = await dailyFetch('/meeting-tokens', {
    method: 'POST',
    body: JSON.stringify({
      properties: {
        room_name: roomName,
        ...claims,
        exp: Math.floor(Date.now() / 1000) + 8 * 60 * 60
      }
    })
  });
  return data.token;
}

export async function getRoom(roomName) {
  if (!roomName) return null;
  try {
    return await dailyFetch(`/rooms/${encodeURIComponent(roomName)}`);
  } catch (err) {
    if (/Daily API 404 /.test(err.message)) return null;
    throw err;
  }
}

export async function deleteRoom(roomName) {
  if (!roomName) return;
  try {
    await dailyFetch(`/rooms/${encodeURIComponent(roomName)}`, { method: 'DELETE' });
  } catch (err) {
    console.warn(`[daily] deleteRoom(${roomName}): ${err.message}`);
  }
}
