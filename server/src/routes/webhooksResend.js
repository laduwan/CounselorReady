/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 */

/**
 * Resend Email Webhook — verifies Svix signature, stores EmailEvent docs,
 * forwards opens/clicks to PostHog. Mounted at /api/webhooks/resend.
 * Raw body parser applied at app level in index.js (before express.json).
 * Set RESEND_WEBHOOK_SECRET (the "whsec_..." value from the Resend dashboard).
 */
import express from 'express';
import crypto from 'crypto';
import EmailEvent from '../models/EmailEvent.js';
import User from '../models/User.js';

const router = express.Router();

const TOLERANCE_SECONDS = 5 * 60;

function verifySvixSignature(payload, headers, secret) {
  const svixId = headers['svix-id'];
  const svixTimestamp = headers['svix-timestamp'];
  const svixSignature = headers['svix-signature'];
  if (!svixId || !svixTimestamp || !svixSignature || !secret) return false;

  const now = Math.floor(Date.now() / 1000);
  const ts = parseInt(svixTimestamp, 10);
  if (!Number.isFinite(ts) || Math.abs(now - ts) > TOLERANCE_SECONDS) return false;

  const key = Buffer.from(secret.replace(/^whsec_/, ''), 'base64');
  const signedContent = `${svixId}.${svixTimestamp}.${payload.toString('utf8')}`;
  const expected = crypto.createHmac('sha256', key).update(signedContent).digest('base64');

  return svixSignature.split(' ').some((entry) => {
    const sig = entry.includes(',') ? entry.split(',')[1] : entry;
    try {
      const a = Buffer.from(sig);
      const b = Buffer.from(expected);
      return a.length === b.length && crypto.timingSafeEqual(a, b);
    } catch {
      return false;
    }
  });
}

router.post('/', async (req, res) => {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[resend-webhook] RESEND_WEBHOOK_SECRET not set');
    return res.status(503).json({ error: 'Webhook not configured' });
  }

  const raw = Buffer.isBuffer(req.body) ? req.body : Buffer.from(req.body || '');
  if (!verifySvixSignature(raw, req.headers, secret)) {
    return res.status(400).json({ error: 'Invalid signature' });
  }

  let evt;
  try {
    evt = JSON.parse(raw.toString('utf8'));
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  res.json({ received: true });

  try {
    const type = String(evt.type || '').replace(/^email\./, '');
    const data = evt.data || {};
    const recipient = Array.isArray(data.to) ? data.to[0] : data.to || null;
    const clickUrl = data.click?.link || null;
    const eventAt = evt.created_at ? new Date(evt.created_at) : new Date();

    let userId = null;
    if (recipient) {
      const user = await User.findOne({ email: recipient }).select('_id').lean();
      if (user) userId = user._id;
    }

    await EmailEvent.create({
      messageId: data.email_id || null,
      type,
      email: recipient,
      userId,
      subject: data.subject || null,
      clickUrl,
      eventAt,
    });

    if (global.posthog && (type === 'opened' || type === 'clicked')) {
      global.posthog.capture({
        distinctId: userId ? userId.toString() : recipient || 'unknown',
        event: `email_${type}`,
        properties: { messageId: data.email_id || null, subject: data.subject || null, clickUrl, recipient },
      });
    }
  } catch (err) {
    console.error('[resend-webhook] processing error:', err.message);
  }
});

export default router;
