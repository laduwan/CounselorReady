// routes/toolRoutes.js
// API routes for gated clinical tools — license verification + usage tracking
// Mount at: /api/tools

import express from 'express';
import { ToolLicense, ToolUsageLog } from '../models/ToolAccess.js';
import { logActivity, ACTIVITY_TYPES } from '../services/activityTrackingService.js';

const router = express.Router();

// ═══════════════════════════════════════════════════════════════════════════════
// POST /api/tools/:tool/verify-license
// Verify and store a clinician's license for tool access (annual)
// No auth required — tool is accessible without a CR account
// ═══════════════════════════════════════════════════════════════════════════════
router.post('/:tool/verify-license', async (req, res) => {
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

    const { tool } = req.params;
    const {
      name, licenseNumber, licenseState, credentialType, email,
      licenseType, supervisorName, superviseeName,
      verifiedAt, expiresAt
    } = req.body;

    // Validate required fields
    if (!name || !licenseNumber || !licenseState || !credentialType || !email) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, licenseNumber, licenseState, credentialType, email'
      });
    }

    // Validate tool name
    const validTools = ['hold-guide', 'superbill-generator', 'safety-plan-builder', 'sliding-scale-calculator'];
    if (!validTools.includes(tool)) {
      return res.status(400).json({ success: false, message: `Invalid tool: ${tool}` });
    }

    // Check for existing active license for this tool + email
    const existing = await ToolLicense.findOne({
      tool,
      email: email.toLowerCase(),
      status: 'active',
      expiresAt: { $gt: new Date() }
    });

    if (existing) {
      // Update existing record (re-verification)
      existing.name = name;
      existing.licenseNumber = licenseNumber;
      existing.licenseState = licenseState;
      existing.credentialType = credentialType;
      existing.licenseType = licenseType || 'independent';
      existing.supervisorName = supervisorName || null;
      existing.superviseeName = superviseeName || null;
      existing.renewalCount += 1;
      existing.lastRenewalAt = new Date();
      await existing.save();

      console.log(`🔄 Tool license renewed: ${tool} | ${email} | ${licenseNumber}`);

      return res.json({
        success: true,
        message: 'License verification renewed',
        data: {
          id: existing._id,
          expiresAt: existing.expiresAt,
          renewalCount: existing.renewalCount
        }
      });
    }

    // Create new license record
    const license = await ToolLicense.create({
      tool,
      name,
      email: email.toLowerCase(),
      licenseNumber,
      licenseState,
      credentialType,
      licenseType: licenseType || 'independent',
      supervisorName: licenseType === 'supervisor' ? supervisorName : null,
      superviseeName: licenseType === 'supervisor' ? superviseeName : null,
      verifiedAt: verifiedAt ? new Date(verifiedAt) : new Date(),
      expiresAt: expiresAt ? new Date(expiresAt) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      status: 'active'
    });

    console.log(`✅ Tool license verified: ${tool} | ${email} | ${licenseNumber} | ${licenseState}`);

    // Log the verification event
    await ToolUsageLog.create({
      tool,
      event: 'license_verified',
      licenseNumber,
      email: email.toLowerCase(),
      data: { licenseState, credentialType, licenseType },
      clientTimestamp: verifiedAt ? new Date(verifiedAt) : new Date(),
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    logActivity(ACTIVITY_TYPES.TOOL_USED, {
      tool,
      toolName: tool,
      event: 'license_verified',
      state: licenseState,
      credentialType
    }, { userEmail: req.body.email }).catch(err => console.error('[toolRoutes] activity log failed:', err.message));

    res.status(201).json({
      success: true,
      message: 'License verified successfully',
      data: {
        id: license._id,
        expiresAt: license.expiresAt
      }
    });

  } catch (error) {
    console.error('❌ Tool license verification error:', error.message);
    res.status(500).json({ success: false, message: 'Server error during license verification' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// POST /api/tools/:tool/track
// Log a usage event (fire-and-forget from client)
// ═══════════════════════════════════════════════════════════════════════════════
router.post('/:tool/track', async (req, res) => {
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

    const { tool } = req.params;
    const { event, licenseNumber, email, timestamp, ...extraData } = req.body;

    if (!event) {
      return res.status(400).json({ success: false, message: 'Missing event name' });
    }

    await ToolUsageLog.create({
      tool,
      event,
      licenseNumber: licenseNumber || 'unknown',
      email: email ? email.toLowerCase() : 'unknown',
      data: extraData,
      clientTimestamp: timestamp ? new Date(timestamp) : new Date(),
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    logActivity(ACTIVITY_TYPES.TOOL_USED, {
      tool,
      toolName: tool,
      event: req.body.event || 'track'
    }, { userEmail: req.body.email }).catch(err => console.error('[toolRoutes] activity log failed:', err.message));

    res.json({ success: true });

  } catch (error) {
    // Silent fail — tracking should never break the tool
    console.error('⚠️ Tool tracking error:', error.message);
    res.json({ success: true }); // Always return success to client
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// GET /api/tools/:tool/check-license
// Check if a license is still valid (called on page load as alternative to localStorage)
// ═══════════════════════════════════════════════════════════════════════════════
router.get('/:tool/check-license', async (req, res) => {
  try {
    const { tool } = req.params;
    const { email, licenseNumber } = req.query;

    if (!email || !licenseNumber) {
      return res.json({ valid: false, message: 'Missing email or licenseNumber' });
    }

    const license = await ToolLicense.findOne({
      tool,
      email: email.toLowerCase(),
      licenseNumber,
      status: 'active',
      expiresAt: { $gt: new Date() }
    });

    if (!license) {
      return res.json({ valid: false, message: 'No active license found' });
    }

    res.json({
      valid: true,
      data: {
        name: license.name,
        licenseNumber: license.licenseNumber,
        expiresAt: license.expiresAt
      }
    });

  } catch (error) {
    console.error('❌ License check error:', error.message);
    res.json({ valid: false, message: 'Server error' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN ROUTES (protected — add auth middleware when wiring up)
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/tools/admin/licenses — List all tool licenses
router.get('/admin/licenses', async (req, res) => {
  try {
    const { tool, status, state, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (tool) filter.tool = tool;
    if (status) filter.status = status;
    if (state) filter.licenseState = state;

    const total = await ToolLicense.countDocuments(filter);
    const licenses = await ToolLicense.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: licenses,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('❌ Admin licenses error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/tools/admin/usage — Usage analytics
router.get('/admin/usage', async (req, res) => {
  try {
    const { tool, event, days = 30 } = req.query;
    const since = new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000);
    const filter = { createdAt: { $gte: since } };
    if (tool) filter.tool = tool;
    if (event) filter.event = event;

    // Aggregate stats
    const [totalEvents, uniqueUsers, eventBreakdown, dailyCounts] = await Promise.all([
      ToolUsageLog.countDocuments(filter),
      ToolUsageLog.distinct('email', filter).then(arr => arr.length),
      ToolUsageLog.aggregate([
        { $match: filter },
        { $group: { _id: { tool: '$tool', event: '$event' }, count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      ToolUsageLog.aggregate([
        { $match: filter },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ])
    ]);

    // Quiz performance (hold-guide specific)
    let quizStats = null;
    if (!tool || tool === 'hold-guide') {
      const quizResults = await ToolUsageLog.find({
        tool: 'hold-guide',
        event: 'quiz_completed',
        createdAt: { $gte: since }
      }).select('data');

      if (quizResults.length) {
        const scores = quizResults.map(r => r.data?.score || 0);
        quizStats = {
          totalAttempts: quizResults.length,
          avgScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
          highScore: Math.max(...scores),
          lowScore: Math.min(...scores),
          passRate: Math.round((scores.filter(s => s >= 70).length / scores.length) * 100)
        };
      }
    }

    res.json({
      success: true,
      data: {
        period: `${days} days`,
        totalEvents,
        uniqueUsers,
        eventBreakdown: eventBreakdown.map(e => ({
          tool: e._id.tool,
          event: e._id.event,
          count: e.count
        })),
        dailyCounts: dailyCounts.map(d => ({ date: d._id, count: d.count })),
        quizStats
      }
    });

  } catch (error) {
    console.error('❌ Admin usage error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/tools/admin/licenses/expiring — Licenses expiring within N days
router.get('/admin/licenses/expiring', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const cutoff = new Date(Date.now() + parseInt(days) * 24 * 60 * 60 * 1000);

    const expiring = await ToolLicense.find({
      status: 'active',
      expiresAt: { $lte: cutoff, $gt: new Date() }
    }).sort({ expiresAt: 1 });

    res.json({
      success: true,
      count: expiring.length,
      data: expiring
    });

  } catch (error) {
    console.error('❌ Expiring licenses error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
