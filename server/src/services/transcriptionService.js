/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 */

/**
 * transcriptionService — self-hosted transcription for live-course catch-up.
 *
 * Why this exists: Whereby's built-in recording-transcription can't be used
 * here (it requires Whereby-provided storage, isn't HIPAA-marked, and fails on
 * the multi-hour recordings our CE sessions produce). We already store the
 * recording in our own S3 (`recording.finished` → `session.recordings[]`), so
 * we transcribe it ourselves with AWS Transcribe and feed the existing
 * consumer, `populateCatchupSummaries` (in sessionProducer.js).
 *
 * Hard contract with the consumer (do NOT change here):
 *   - Output transcript JSON lives in bucket `AWS_S3_RECORDINGS_BUCKET` at key
 *     `transcripts/{sessionId}.json` and has the shape
 *       { segments: [ { start: <seconds from session start>, text: <string> }, ... ] }
 *   - `start` is seconds relative to recording start (≈ session.scheduledStart),
 *     which is exactly what AWS Transcribe emits in `start_time`.
 *
 * All AWS calls are wrapped in try/catch; failures are non-fatal and logged,
 * mirroring the defensive style of populateCatchupSummaries.
 */

import {
  TranscribeClient,
  StartTranscriptionJobCommand,
  GetTranscriptionJobCommand
} from '@aws-sdk/client-transcribe';
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand
} from '@aws-sdk/client-s3';
import { onTranscriptionFinished } from './sessionProducer.js';

// Reuse the same region/bucket env that populateCatchupSummaries reads from.
const REGION = process.env.AWS_REGION || 'us-east-1';
const RECORDINGS_BUCKET = process.env.AWS_S3_RECORDINGS_BUCKET;
const LOG = '[transcriptionService]';

// Credentials come from the default AWS chain / existing env — no explicit creds here.
function transcribeClient() {
  return new TranscribeClient({ region: REGION });
}
function s3Client() {
  return new S3Client({ region: REGION });
}

async function getJson(key) {
  const resp = await s3Client().send(new GetObjectCommand({ Bucket: RECORDINGS_BUCKET, Key: key }));
  const chunks = [];
  for await (const chunk of resp.Body) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

async function putJson(key, obj) {
  await s3Client().send(new PutObjectCommand({
    Bucket: RECORDINGS_BUCKET,
    Key: key,
    Body: JSON.stringify(obj),
    ContentType: 'application/json'
  }));
}

/**
 * Transform raw AWS Transcribe output into the consumer shape
 * `{ segments: [{ start, text }] }` with `start` in seconds.
 *
 * Prefer `results.audio_segments[]` (sentence/utterance-level). If absent,
 * fall back to grouping `results.items[]` into segments, splitting on
 * sentence-ending punctuation, with each segment's `start` taken from its
 * first word's `start_time`.
 */
export function transformToSegments(raw) {
  const results = raw?.results || {};

  // Preferred: audio_segments are already utterance-level with start_time/transcript.
  if (Array.isArray(results.audio_segments) && results.audio_segments.length) {
    return results.audio_segments
      .map(seg => ({ start: Number(seg.start_time), text: String(seg.transcript || '').trim() }))
      .filter(s => Number.isFinite(s.start) && s.text);
  }

  // Fallback: group items[] into sentence-level segments.
  const items = Array.isArray(results.items) ? results.items : [];
  const segments = [];
  let cur = null;

  for (const it of items) {
    const isPunct = it.type === 'punctuation';
    const content = it.alternatives?.[0]?.content || '';
    if (!content) continue;

    if (!cur && !isPunct) {
      cur = { start: Number(it.start_time), text: '' };
    }
    if (!cur) continue; // leading punctuation with no open segment — skip

    if (isPunct) {
      cur.text += content; // attach punctuation with no leading space
      if (/[.!?]/.test(content)) {
        cur.text = cur.text.trim();
        if (Number.isFinite(cur.start) && cur.text) segments.push(cur);
        cur = null;
      }
    } else {
      cur.text += (cur.text ? ' ' : '') + content;
    }
  }

  if (cur) {
    cur.text = cur.text.trim();
    if (Number.isFinite(cur.start) && cur.text) segments.push(cur);
  }

  return segments;
}

/**
 * Kick off an AWS Transcribe job for the session's latest ready recording.
 * Idempotent and guarded; safe to call every tick.
 */
export async function startTranscription(session) {
  try {
    if (session.sessionType !== 'live-course') return;
    session.producer = session.producer || {};
    if (session.producer.transcriptS3Key) return;
    if (session.producer.transcribeStatus === 'in_progress') return;

    const ready = (session.recordings || []).filter(r => r.status === 'ready');
    if (ready.length === 0) return;
    // Pick the latest ready recording by recordedAt.
    const rec = ready.reduce((a, b) =>
      (new Date(b.recordedAt || 0).getTime() >= new Date(a.recordedAt || 0).getTime() ? b : a)
    );

    const jobName = `cr-${session._id}-${Date.now()}`;
    const mediaUri = `s3://${rec.s3Bucket || RECORDINGS_BUCKET}/${rec.s3Key}`;

    await transcribeClient().send(new StartTranscriptionJobCommand({
      TranscriptionJobName: jobName,
      Media: { MediaFileUri: mediaUri },
      MediaFormat: 'mp4', // Whereby cloud recordings are mp4
      LanguageCode: 'en-US',
      OutputBucketName: RECORDINGS_BUCKET,
      OutputKey: `transcribe-raw/${session._id}.json`
    }));

    session.producer.transcribeJobName = jobName;
    session.producer.transcribeStatus = 'in_progress';
    await session.save();
    console.log(`${LOG} started job ${jobName} for session ${session._id}`);
  } catch (err) {
    console.error(`${LOG} startTranscription error (non-fatal) for ${session?._id}:`, err.message);
  }
}

/**
 * Poll an in-progress AWS Transcribe job. On COMPLETED, fetch the raw output,
 * transform it to the consumer shape, write it to transcripts/{id}.json, and
 * hand off to onTranscriptionFinished. On FAILED, mark failed and stop (no
 * automatic retry).
 */
export async function pollTranscription(session) {
  try {
    session.producer = session.producer || {};
    const jobName = session.producer.transcribeJobName;
    if (!jobName) return;

    const out = await transcribeClient().send(new GetTranscriptionJobCommand({ TranscriptionJobName: jobName }));
    const status = out?.TranscriptionJob?.TranscriptionJobStatus;

    if (status === 'COMPLETED') {
      const raw = await getJson(`transcribe-raw/${session._id}.json`);
      const segments = transformToSegments(raw);
      const transcriptKey = `transcripts/${session._id}.json`;
      await putJson(transcriptKey, { segments });

      session.producer.transcribeStatus = 'completed';
      session.producer.transcribeJobName = undefined;
      await session.save();

      await onTranscriptionFinished(session, transcriptKey);
      console.log(`${LOG} completed transcription for session ${session._id} (${segments.length} segments)`);
    } else if (status === 'FAILED') {
      session.producer.transcribeStatus = 'failed';
      session.producer.transcribeJobName = undefined;
      await session.save();
      console.error(`${LOG} transcription FAILED for session ${session._id}: ${out?.TranscriptionJob?.FailureReason || 'unknown'} — no automatic retry`);
    }
    // QUEUED / IN_PROGRESS: leave state untouched; poll again next tick.
  } catch (err) {
    console.error(`${LOG} pollTranscription error (non-fatal) for ${session?._id}:`, err.message);
  }
}

export default { startTranscription, pollTranscription, transformToSegments };
