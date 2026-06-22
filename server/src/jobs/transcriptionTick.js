/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 */

/**
 * transcriptionTick — runs every 5 minutes, America/New_York.
 * Mirrors sessionProducerTick.js structure.
 *
 * Drives self-hosted transcription for completed live-course sessions that
 * have a ready recording but no transcript yet:
 *   - not yet in progress → start an AWS Transcribe job
 *   - already in progress → poll it; on completion the transformed transcript
 *     is written to transcripts/{id}.json and handed to onTranscriptionFinished
 *
 * Failed jobs are excluded from the query so they are not retried automatically.
 */

import LiveSession from '../models/LiveSession.js';
import { startTranscription, pollTranscription } from '../services/transcriptionService.js';

const LOG = '[TranscriptionTick]';

export async function runTranscriptionTick() {
  let sessions;
  try {
    sessions = await LiveSession.find({
      sessionType: 'live-course',
      status: 'completed',
      'recordings.status': 'ready',
      'producer.transcriptS3Key': { $exists: false },
      'producer.transcribeStatus': { $ne: 'failed' } // never auto-retry a failed job
    });
  } catch (err) {
    console.error(`${LOG} query error:`, err.message);
    return;
  }

  if (sessions.length === 0) return;

  for (const session of sessions) {
    try {
      if (session.producer?.transcribeStatus !== 'in_progress') {
        await startTranscription(session);
      } else {
        await pollTranscription(session);
      }
    } catch (err) {
      console.error(`${LOG} error processing session ${session._id}:`, err.message);
    }
  }
}
