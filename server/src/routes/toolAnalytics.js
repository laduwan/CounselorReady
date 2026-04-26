/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import express from 'express';
import jwt from 'jsonwebtoken';
import { protect } from '../middleware/auth.js';
import ToolClick from '../models/ToolClick.js';
import { logActivity, ACTIVITY_TYPES } from '../services/activityTrackingService.js';

const router = express.Router();

/**
 * Extract userId from Bearer token without rejecting unauthenticated requests.
 */
function optionalUserId(req) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) return jwt.verify(token, process.env.JWT_SECRET).id;
  } catch { /* ignore */ }
  return null;
}

// ============================================
// PUBLIC ENDPOINTS (no auth)
// ============================================

// @route   POST /api/tool-analytics/click
// @desc    Record an anonymous tool click from the landing page
// @access  Public
router.post('/click', async (req, res) => {
  const { toolSlug, sessionId, referrer } = req.body;
  if (!toolSlug) {
    return res.status(400).json({ error: 'toolSlug is required' });
  }

  // Fire-and-forget — always return 200
  ToolClick.create({
    toolSlug,
    event: 'click',
    sessionId: sessionId || undefined,
    referrer: referrer || undefined,
    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    userAgent: req.headers['user-agent'],
    timestamp: new Date()
  }).catch(err => console.error('[ToolAnalytics] click write failed:', err.message));

  logActivity(ACTIVITY_TYPES.TOOL_USED, {
    tool: toolSlug,
    toolName: toolSlug,
    event: 'click',
    referrer
  }).catch(err => console.error('[ToolAnalytics] activity log failed:', err.message));

  res.json({ success: true });
});

// @route   POST /api/tool-analytics/conversion
// @desc    Record a tool-to-registration conversion
// @access  Public (optional Bearer token for userId)
router.post('/conversion', async (req, res) => {
  const { toolSlug, sessionId } = req.body;
  if (!toolSlug) {
    return res.status(400).json({ error: 'toolSlug is required' });
  }

  const userId = optionalUserId(req);

  ToolClick.create({
    toolSlug,
    event: 'conversion',
    sessionId: sessionId || undefined,
    userId: userId || undefined,
    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    userAgent: req.headers['user-agent'],
    timestamp: new Date()
  }).catch(err => console.error('[ToolAnalytics] conversion write failed:', err.message));

  logActivity(ACTIVITY_TYPES.TOOL_USED, {
    tool: toolSlug,
    toolName: toolSlug,
    event: 'conversion'
  }, { userId: userId || undefined }).catch(err => console.error('[ToolAnalytics] activity log failed:', err.message));

  res.json({ success: true });
});

// ============================================
// ADMIN ENDPOINTS (auth + admin role)
// ============================================

// @route   GET /api/tool-analytics/admin/stats?days=30
// @desc    Aggregated tool click & conversion counts
// @access  Admin
router.get('/admin/stats', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const days = Math.min(parseInt(req.query.days) || 30, 365);
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const pipeline = [
      { $match: { timestamp: { $gte: since } } },
      {
        $group: {
          _id: { toolSlug: '$toolSlug', event: '$event' },
          count: { $sum: 1 }
        }
      }
    ];

    const results = await ToolClick.aggregate(pipeline);

    // Reshape into per-tool stats
    const toolMap = {};
    for (const row of results) {
      const slug = row._id.toolSlug;
      if (!toolMap[slug]) toolMap[slug] = { toolSlug: slug, clicks: 0, conversions: 0 };
      if (row._id.event === 'click') toolMap[slug].clicks = row.count;
      if (row._id.event === 'conversion') toolMap[slug].conversions = row.count;
    }

    const tools = Object.values(toolMap)
      .map(t => ({
        ...t,
        conversionRate: t.clicks > 0 ? parseFloat(((t.conversions / t.clicks) * 100).toFixed(1)) : 0
      }))
      .sort((a, b) => b.clicks - a.clicks);

    const totals = tools.reduce(
      (acc, t) => ({ clicks: acc.clicks + t.clicks, conversions: acc.conversions + t.conversions }),
      { clicks: 0, conversions: 0 }
    );
    totals.conversionRate = totals.clicks > 0
      ? parseFloat(((totals.conversions / totals.clicks) * 100).toFixed(1))
      : 0;

    res.json({
      period: { start: since.toISOString(), end: new Date().toISOString(), days },
      tools,
      totals
    });
  } catch (error) {
    console.error('[ToolAnalytics] admin/stats error:', error);
    res.status(500).json({ error: 'Failed to fetch tool analytics' });
  }
});

// @route   GET /api/tool-analytics/admin/trend?days=30&toolSlug=note-writer
// @desc    Daily time series of clicks/conversions
// @access  Admin
router.get('/admin/trend', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const days = Math.min(parseInt(req.query.days) || 30, 365);
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const { toolSlug } = req.query;

    const match = { timestamp: { $gte: since } };
    if (toolSlug) match.toolSlug = toolSlug;

    const pipeline = [
      { $match: match },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            event: '$event'
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': 1 } }
    ];

    const results = await ToolClick.aggregate(pipeline);

    // Reshape into daily entries
    const dayMap = {};
    for (const row of results) {
      const date = row._id.date;
      if (!dayMap[date]) dayMap[date] = { date, clicks: 0, conversions: 0 };
      if (row._id.event === 'click') dayMap[date].clicks = row.count;
      if (row._id.event === 'conversion') dayMap[date].conversions = row.count;
    }

    res.json({
      period: { start: since.toISOString(), end: new Date().toISOString(), days },
      toolSlug: toolSlug || 'all',
      trend: Object.values(dayMap)
    });
  } catch (error) {
    console.error('[ToolAnalytics] admin/trend error:', error);
    res.status(500).json({ error: 'Failed to fetch tool trend' });
  }
});

export default router;
