/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// server/src/routes/tools.js
// Free clinical tools API — Note Writer with tiered rate limits
// Tiers: Anonymous 15/day | Starter 30/day | Professional 60/day | VIP Unlimited

import express from 'express';
import jwt from 'jsonwebtoken';
import Anthropic from '@anthropic-ai/sdk';
import { logActivity, ACTIVITY_TYPES } from '../services/activityTrackingService.js';

const router = express.Router();

// ═══════════════════════════════════════════
// IN-MEMORY RATE LIMITER
// (Swap to Redis if you scale beyond 1 dyno)
// ═══════════════════════════════════════════
const rateLimitStore = new Map(); // key → { count, resetAt }

const TIER_LIMITS = {
  anonymous: 15,
  tools_subscriber: 30,  // $7.95/mo — Note Writer only
  tools_plus: 30,        // $15.95/mo — Note Writer + Treatment Planner
  starter: 30,
  professional: 60,
  vip: Infinity
};

function getDailyKey(identifier) {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return `${identifier}:${today}`;
}

function checkRateLimit(identifier, tier) {
  const limit = TIER_LIMITS[tier] || TIER_LIMITS.anonymous;
  if (limit === Infinity) return { allowed: true, remaining: Infinity, limit };

  const key = getDailyKey(identifier);
  const now = Date.now();
  const resetAt = new Date();
  resetAt.setHours(24, 0, 0, 0); // midnight tonight

  let entry = rateLimitStore.get(key);

  // Clean expired entries periodically
  if (rateLimitStore.size > 10000) {
    for (const [k, v] of rateLimitStore) {
      if (v.resetAt < now) rateLimitStore.delete(k);
    }
  }

  if (!entry || entry.resetAt < now) {
    entry = { count: 0, resetAt: resetAt.getTime() };
  }

  if (entry.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      limit,
      resetAt: entry.resetAt,
      tier
    };
  }

  entry.count++;
  rateLimitStore.set(key, entry);

  return {
    allowed: true,
    remaining: limit - entry.count,
    limit,
    tier
  };
}

// ═══════════════════════════════════════════
// OPTIONAL AUTH — extracts user if token present, doesn't require it
// ═══════════════════════════════════════════
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    req.user = null;
  }
  next();
}

function getUserTier(user) {
  if (!user) return 'anonymous';
  const plan = user.subscriptionPlan || user.plan || 'free';
  const status = user.subscriptionStatus || user.status || '';

  // Active subscribers get their tier
  if (status === 'active' || plan === 'free') {
    switch (plan.toLowerCase()) {
      case 'vip':
      case 'enterprise':
        return 'vip';
      case 'professional':
      case 'pro':
        return 'professional';
      case 'starter':
      case 'basic':
        return 'starter';
      case 'tools':
      case 'tools_subscriber':
        return 'tools_subscriber';
      case 'tools_plus':
      case 'tools_pro':
        return 'tools_plus';
      default:
        return 'anonymous';
    }
  }

  return 'anonymous';
}

// ═══════════════════════════════════════════
// GET /api/tools/note-limit
// Returns current usage and limits for the user
// ═══════════════════════════════════════════
router.get('/note-limit', optionalAuth, (req, res) => {
  const tier = getUserTier(req.user);
  const identifier = req.user ? `user:${req.user.id}` : `ip:${req.ip}`;
  const key = getDailyKey(identifier);
  const entry = rateLimitStore.get(key);
  const limit = TIER_LIMITS[tier];
  const used = entry ? entry.count : 0;

  res.json({
    tier,
    limit: limit === Infinity ? 'unlimited' : limit,
    used,
    remaining: limit === Infinity ? 'unlimited' : Math.max(0, limit - used)
  });
});

// ═══════════════════════════════════════════
// POST /api/tools/generate-note
// Proxies to Anthropic API with rate limiting
// ═══════════════════════════════════════════
router.post('/generate-note', optionalAuth, async (req, res) => {
  try {
    // Partner feature gate — clinical tools require add-on
    if (req.user?.partnerId) {
      const Partner = (await import('../models/Partner.js')).default;
      const partner = await Partner.findById(req.user.partnerId).select('premiumAddons').lean();
      if (!partner?.premiumAddons?.clinicalTools?.enabled) {
        return res.status(403).json({
          error: 'Feature not available',
          code: 'ADDON_REQUIRED',
          addon: 'clinicalTools',
          message: 'Clinical tools require a premium add-on.',
          upgradeUrl: '/partner-billing.html#addons'
        });
      }
    }

    // 1. Determine tier and rate limit
    const tier = getUserTier(req.user);
    const identifier = req.user ? `user:${req.user.id}` : `ip:${req.ip}`;
    const rateCheck = checkRateLimit(identifier, tier);

    if (!rateCheck.allowed) {
      const upgradeMsg = tier === 'anonymous'
        ? 'Subscribe to Clinical Tools for $7.95/mo for 30 notes/day — or add the Treatment Planner for $15.95/mo.'
        : tier === 'tools_subscriber'
          ? 'Upgrade to Clinical Tools Plus ($15.95/mo) to add the Treatment Planner, or go VIP for unlimited everything.'
          : tier === 'tools_plus'
            ? 'Upgrade to a full CounselorReady plan for CE courses, credential tracking, and more.'
            : tier === 'starter'
              ? 'Upgrade to Professional for 60 notes/day, or VIP for unlimited.'
              : 'Upgrade to VIP for unlimited daily notes.';

      return res.status(429).json({
        error: 'Daily limit reached',
        message: `You've used all ${rateCheck.limit} notes for today.`,
        upgrade: upgradeMsg,
        tier,
        limit: rateCheck.limit,
        resetsAt: new Date(rateCheck.resetAt).toISOString()
      });
    }

    // 2. Validate input
    const { format, bulletPoints, sessionType, duration, modalities, diagnosis, riskLevel, clientInitials } = req.body;

    if (!bulletPoints || !bulletPoints.trim()) {
      return res.status(400).json({ error: 'Session notes are required.' });
    }

    if (bulletPoints.length > 5000) {
      return res.status(400).json({ error: 'Session notes must be under 5,000 characters.' });
    }

    const validFormats = ['SOAP', 'DAP', 'BIRP', 'NARRATIVE'];
    const noteFormat = validFormats.includes(format) ? format : 'SOAP';

    const formatSections = {
      SOAP: 'Subjective, Objective, Assessment, Plan',
      DAP: 'Data, Assessment, Plan',
      BIRP: 'Behavior, Intervention, Response, Plan',
      NARRATIVE: 'Narrative'
    };

    // 3. Build prompt
    const systemPrompt = `You are a clinical documentation assistant for licensed mental health professionals. Generate a professional ${noteFormat} note based on the clinician's session bullet points.

RULES:
- Write in professional clinical language appropriate for medical records
- Use third person ("The client" or "Ct.")
- Be specific and behavioral in descriptions
- Include measurable observations where possible
- Do NOT fabricate details not provided by the clinician
- Do NOT include any PHI — use only the initials provided
- Format with clear section headers for: ${formatSections[noteFormat]}
- Keep the note concise but thorough (typically 200-400 words total)
- End the Plan section with next session date/frequency if mentioned
- If risk factors are noted, include appropriate safety language

Session context:
- Format: ${noteFormat}
- Session Type: ${sessionType || 'Not specified'}
- Duration: ${duration || '50'} minutes
- Modalities: ${modalities && modalities.length ? modalities.join(', ') : 'Not specified'}
- Diagnosis: ${diagnosis || 'Not provided'}
- Risk Level: ${riskLevel || 'None identified'}
- Client: ${clientInitials || 'Ct.'}`;

    // 4. Call Anthropic API
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-5',
      thinking: { type: 'disabled' },
      max_tokens: 1500,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Generate a ${noteFormat} note from these session bullet points:\n\n${bulletPoints}`
        }
      ]
    });

    const noteText = message.content?.[0]?.text || '';

    if (!noteText) {
      return res.status(500).json({ error: 'Unable to generate note. Please try again.' });
    }

    // 5. Return note with rate limit info
    res.json({
      note: noteText,
      format: noteFormat,
      tier,
      remaining: rateCheck.remaining === Infinity ? 'unlimited' : rateCheck.remaining,
      limit: rateCheck.limit === Infinity ? 'unlimited' : rateCheck.limit
    });

    logActivity(ACTIVITY_TYPES.TOOL_USED, {
      tool: 'note-writer',
      toolName: 'Note Writer',
      event: 'generation_complete',
      tier: getUserTier(req.user)
    }, {
      userId: req.user?.id || undefined,
      userEmail: req.user?.email || undefined
    }).catch(err => console.error('[tools] activity log failed:', err.message));

  } catch (err) {
    console.error('Note generation error:', err.message);

    if (err.status === 429) {
      return res.status(503).json({ error: 'AI service temporarily busy. Please try again in a moment.' });
    }

    res.status(500).json({ error: 'Failed to generate note. Please try again.' });
  }
});

// ═══════════════════════════════════════════
// POST /api/tools/capture-email
// Lightweight email capture for marketing — stores in MongoDB
// ═══════════════════════════════════════════
router.post('/capture-email', async (req, res) => {
  try {
    const { email, source } = req.body;

    if (!email || !email.includes('@') || !email.includes('.')) {
      return res.status(400).json({ error: 'Valid email required.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Use mongoose if available, otherwise log to console for manual collection
    try {
      const mongoose = (await import('mongoose')).default;

      // Create or reuse a simple schema
      let ToolEmail;
      try {
        ToolEmail = mongoose.model('ToolEmail');
      } catch {
        const schema = new mongoose.Schema({
          email: { type: String, required: true, unique: true, lowercase: true, trim: true },
          source: String,      // which tool they were using
          capturedAt: { type: Date, default: Date.now },
          subscribed: { type: Boolean, default: true },
          convertedToUser: { type: Boolean, default: false }
        });
        schema.index({ email: 1 }, { unique: true });
        ToolEmail = mongoose.model('ToolEmail', schema);
      }

      // Upsert — if they already exist, just update the source/date
      await ToolEmail.findOneAndUpdate(
        { email: cleanEmail },
        { email: cleanEmail, source: source || 'unknown', capturedAt: new Date() },
        { upsert: true, new: true }
      );

      res.json({ success: true, message: "You're in!" });
    } catch (dbErr) {
      // If DB fails, log it but still respond success (we'll collect from logs)
      console.log(`[EMAIL CAPTURE] ${cleanEmail} from ${source || 'unknown'} (DB save failed: ${dbErr.message})`);
      res.json({ success: true, message: "You're in!" });
    }
  } catch (err) {
    console.error('Email capture error:', err.message);
    res.status(500).json({ error: 'Could not save email.' });
  }
});

export default router;
