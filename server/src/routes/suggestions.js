/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import express from 'express';
import Suggestion from '../models/Suggestion.js';
import { optionalAuth, requireAdmin } from '../middleware/auth.js';
import { sendSuggestionNotification } from '../services/emailService.js';

const router = express.Router();

const VALID_PLATFORMS = ['counselorready', 'passreadyprep', 'gaitp'];
const VALID_CATEGORIES = ['bug', 'feature-request', 'content', 'billing', 'other'];

// ═══════════════════════════════════════════
// IN-MEMORY RATE LIMITER — 10 submissions / IP / day
// (Swap to Redis if you scale beyond 1 dyno)
// ═══════════════════════════════════════════
const rateLimitStore = new Map(); // ip:day -> count
const DAILY_LIMIT = 10;

function checkRateLimit(ip) {
  const key = `${ip}:${new Date().toISOString().split('T')[0]}`;
  if (rateLimitStore.size > 10000) rateLimitStore.clear();
  const count = rateLimitStore.get(key) || 0;
  if (count >= DAILY_LIMIT) return false;
  rateLimitStore.set(key, count + 1);
  return true;
}

// ============================================
// PUBLIC — submit a suggestion (works logged in or anonymous)
// ============================================
router.post('/', optionalAuth, async (req, res) => {
  try {
    if (!checkRateLimit(req.ip)) {
      return res.status(429).json({ error: 'Too many submissions today. Please try again tomorrow.' });
    }

    const { message, category, platform, name, email, pageUrl } = req.body || {};

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'A message is required.' });
    }
    if (message.length > 4000) {
      return res.status(400).json({ error: 'Message is too long.' });
    }

    const suggestion = await Suggestion.create({
      message: message.trim(),
      category: VALID_CATEGORIES.includes(category) ? category : 'other',
      platform: VALID_PLATFORMS.includes(platform) ? platform : 'counselorready',
      user: req.user?._id || null,
      name: (name || req.user?.name || '').trim().slice(0, 200),
      email: (email || req.user?.email || '').trim().slice(0, 200),
      pageUrl: (pageUrl || req.headers.referer || '').slice(0, 500),
      userAgent: (req.headers['user-agent'] || '').slice(0, 300),
    });

    // Fire-and-forget — never block the user's response on email delivery
    sendSuggestionNotification(suggestion)
      .then(result => {
        if (result.success) {
          Suggestion.updateOne({ _id: suggestion._id }, { emailSent: true }).catch(() => {});
        }
      })
      .catch(() => {});

    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Error saving suggestion:', error);
    res.status(500).json({ error: 'Failed to submit suggestion.' });
  }
});

// ============================================
// ADMIN — review submissions
// ============================================
router.get('/', requireAdmin, async (req, res) => {
  try {
    const { platform, status, page = 1, limit = 50 } = req.query;
    const query = {};
    if (platform && VALID_PLATFORMS.includes(platform)) query.platform = platform;
    if (status) query.status = status;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));

    const [suggestions, total, counts] = await Promise.all([
      Suggestion.find(query)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Suggestion.countDocuments(query),
      Suggestion.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    ]);

    res.json({
      success: true,
      suggestions,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      counts: counts.reduce((acc, c) => ({ ...acc, [c._id]: c.count }), {}),
    });
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).json({ error: 'Failed to fetch suggestions.' });
  }
});

router.patch('/:id', requireAdmin, async (req, res) => {
  try {
    const { status, adminNote } = req.body || {};
    const update = {};
    if (status) update.status = status;
    if (typeof adminNote === 'string') update.adminNote = adminNote;

    const suggestion = await Suggestion.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!suggestion) return res.status(404).json({ error: 'Suggestion not found.' });

    res.json({ success: true, suggestion });
  } catch (error) {
    console.error('Error updating suggestion:', error);
    res.status(500).json({ error: 'Failed to update suggestion.' });
  }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const suggestion = await Suggestion.findByIdAndDelete(req.params.id);
    if (!suggestion) return res.status(404).json({ error: 'Suggestion not found.' });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting suggestion:', error);
    res.status(500).json({ error: 'Failed to delete suggestion.' });
  }
});

export default router;
