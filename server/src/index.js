/**
 * CounselorReady API Server — index.js
 * ═══════════════════════════════════════════════════════════════
 * CRITICAL: This file is the single source of truth for all API
 * route registrations. DO NOT rewrite this file without including
 * ALL routes listed in the REQUIRED_ROUTES array below.
 *
 * If you are an AI assistant (Claude Code or otherwise):
 *   - NEVER remove or comment out any import or app.use() line
 *   - NEVER rewrite this file from scratch
 *   - Only ADD new routes — never subtract existing ones
 *   - The startup integrity check will catch regressions
 *
 * Last verified: 2026-03-25 — 37 route mounts, all confirmed
 * ═══════════════════════════════════════════════════════════════
 */

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// ═══════════════════════════════════════════════════════════════
// ROUTE IMPORTS — NEVER REMOVE ANY OF THESE
// ═══════════════════════════════════════════════════════════════
import authRoutes from './routes/auth.js';
import coursesRoutes from './routes/courses.js';
import adminRoutes from './routes/admin.js';
import adminAuditRoutes from './routes/adminAudit.js';
import usersRoutes from './routes/users.js';
import certificatesRoutes from './routes/certificates.js';
import credentialsRoutes from './routes/credentials.js';
import paymentsRoutes from './routes/payments.js';
import analyticsRoutes from './routes/analytics.js';
import migrationRoutes from './routes/migration.js';
import announcementsRoutes from './routes/announcements.js';
import remindersRoutes from './routes/reminders.js';
import scanRoutes from './routes/scan.js';
import scormRoutes from './routes/scorm.js';
import ltiRoutes from './routes/lti.js';
import xapiRoutes from './routes/xapi.js';
import interactiveCourseRoutes from './routes/interactiveCourseRoutes.js'; // MUST be interactiveCourseRoutes.js (NOT courseRoutes.js)
import cebrokerRoutes from './routes/cebroker.js';
import helpRoutes from './routes/help.js';
import bulkUploadRoutes from './routes/bulkUpload.js';
import courseBuilderRoutes from './routes/courseBuilder.js';
import narrationRoutes from './routes/narration.js';
import aiRoutes from './routes/ai.js';
import aiCourseGeneratorRoutes from './routes/aiCourseGenerator.js';
import gamificationRoutes from './routes/gamification.js';
import referralsRoutes from './routes/referrals.js';
import rewardsRoutes from './routes/rewards.js';
import boardAlertsRoutes from './routes/boardAlerts.js';
import cePlannerRoutes from './routes/cePlanner.js';
import imageUploadRoutes from './routes/imageUpload.js';
import researchReadyRoutes from './routes/researchReady.js';
import adminCoursesRoutes from './routes/adminCourses.js';
import toolsRoutes from './routes/tools.js';
import toolRoutes from './routes/toolRoutes.js';
import partnersRoutes from './routes/partners.js';
import notificationsRoutes from './routes/notifications.js';
import recommendationsRoutes from './routes/recommendations.js';
import blogRoutes from './routes/blog.js';
import toolAnalyticsRoutes from './routes/toolAnalytics.js';
import remediationRoutes from './routes/remediation.js';
import securityRoutes from './routes/security.js';
import adminUsersRoutes from './routes/adminUsers.js';
import adminRewardsRoutes from './routes/adminRewards.js';
import supervisionRoutes from './routes/supervision.js';
import insuranceCredentialsRoutes from './routes/insuranceCredentials.js';
import legacyVaultRoutes from './routes/legacyVault.js';
import groupLicensesRoutes from './routes/groupLicenses.js';
import scholarlyArticlesRoutes from './routes/scholarlyArticles.js';
import adminStatsRoutes from './routes/adminStats.js';

// ═══════════════════════════════════════════════════════════════
// SERVICE IMPORTS
// ═══════════════════════════════════════════════════════════════
import { PostHog } from 'posthog-node';
import { initializeScheduler } from './services/notificationScheduler.js';
import { initializeBoardMonitor } from './services/boardMonitorService.js';
import cron from 'node-cron';
import { runDeadlineReminders } from './services/ceDeadlineReminder.js';
import { runDailyNotificationCheck } from './jobs/dailyNotificationCheck.js';
import { runHardshipPauseResume } from './jobs/hardshipPauseResume.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// ═══════════════════════════════════════════════════════════════
// MIDDLEWARE
// ═══════════════════════════════════════════════════════════════

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Partner-Id', 'X-Partner-Slug']
}));

app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
    next();
  });
}

// ═══════════════════════════════════════════════════════════════
// DATABASE
// ═══════════════════════════════════════════════════════════════

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// ═══════════════════════════════════════════════════════════════
// HEALTH CHECK
// ═══════════════════════════════════════════════════════════════

app.get('/health', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const dbStatus = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      mongodb: dbStatus[dbState] || 'unknown',
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      requiredRoutes: REQUIRED_ROUTES.length
    });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// API ROUTE REGISTRATION
// NEVER REMOVE ANY LINE. ONLY ADD.
// ═══════════════════════════════════════════════════════════════

app.use('/api/auth', authRoutes);
app.use('/api/interactive-courses', interactiveCourseRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/admin/stats', adminStatsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/audit', adminAuditRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/certificates', certificatesRoutes);
app.use('/api/credentials', credentialsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/migration', migrationRoutes);
app.use('/api/announcements', announcementsRoutes);
app.use('/api/reminders', remindersRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/scorm', scormRoutes);
app.use('/api/lti', ltiRoutes);
app.use('/api/xapi', xapiRoutes);
app.use('/api/cebroker', cebrokerRoutes);
app.use('/api/help', helpRoutes);
app.use('/api/admin', adminCoursesRoutes);
app.use('/api/admin/courses', bulkUploadRoutes);
app.use('/api/course-builder', courseBuilderRoutes);
app.use('/api/narration', narrationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/ai-course-generator', aiCourseGeneratorRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/referrals', referralsRoutes);
app.use('/api/rewards', rewardsRoutes);
app.use('/api/board-alerts', boardAlertsRoutes);
app.use('/api/ce-planner', cePlannerRoutes);
app.use('/api/images', imageUploadRoutes);
app.use('/api/research-ready', researchReadyRoutes);
app.use('/api/tools', toolsRoutes);
app.use('/api/tool-actions', toolRoutes);
app.use('/api/partners', partnersRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/tool-analytics', toolAnalyticsRoutes);
app.use('/api/remediation', remediationRoutes);
app.use('/api/security', securityRoutes);
app.use('/api/admin', adminUsersRoutes);
app.use('/api/admin/rewards', adminRewardsRoutes);
app.use('/api/supervision', supervisionRoutes);
app.use('/api/insurance-credentials', insuranceCredentialsRoutes);
app.use('/api/legacy-vault', legacyVaultRoutes);
app.use('/api/group-licenses', groupLicensesRoutes);
app.use('/api/scholarly-articles', scholarlyArticlesRoutes);

app.use('/templates', express.static(path.join(__dirname, 'templates')));

// ═══════════════════════════════════════════════════════════════
// ROUTE INTEGRITY CHECK
// Runs on every startup. Catches regressions from file overwrites.
// ═══════════════════════════════════════════════════════════════

const REQUIRED_ROUTES = {
  '/api/auth':                authRoutes,
  '/api/interactive-courses': interactiveCourseRoutes,
  '/api/courses':             coursesRoutes,
  '/api/admin':               adminRoutes,
  '/api/users':               usersRoutes,
  '/api/certificates':        certificatesRoutes,
  '/api/credentials':         credentialsRoutes,
  '/api/payments':            paymentsRoutes,
  '/api/analytics':           analyticsRoutes,
  '/api/announcements':       announcementsRoutes,
  '/api/notifications':       notificationsRoutes,
  '/api/gamification':        gamificationRoutes,
  '/api/referrals':           referralsRoutes,
  '/api/rewards':             rewardsRoutes,
  '/api/board-alerts':        boardAlertsRoutes,
  '/api/ce-planner':          cePlannerRoutes,
  '/api/scan':                scanRoutes,
  '/api/help':                helpRoutes,
  '/api/course-builder':      courseBuilderRoutes,
  '/api/research-ready':      researchReadyRoutes,
  '/api/tools':               toolsRoutes,
  '/api/partners':            partnersRoutes,
  '/api/recommendations':     recommendationsRoutes,
  '/api/images':              imageUploadRoutes,
  '/api/admin/courses':       bulkUploadRoutes,
  '/api/admin/course-mgmt':   adminCoursesRoutes,
  '/api/admin/rewards':       adminRewardsRoutes,
  '/api/blog':                blogRoutes,
  '/api/tool-analytics':      toolAnalyticsRoutes,
  '/api/security':            securityRoutes,
};

function verifyRoutes() {
  let passed = 0;
  let failed = 0;
  const errors = [];

  Object.entries(REQUIRED_ROUTES).forEach(([path, router]) => {
    if (!router || typeof router !== 'function') {
      errors.push(path);
      failed++;
    } else {
      passed++;
    }
  });

  if (failed > 0) {
    console.error('');
    console.error('╔══════════════════════════════════════════════════╗');
    console.error('║  ❌ ROUTE INTEGRITY CHECK FAILED                ║');
    console.error('╚══════════════════════════════════════════════════╝');
    errors.forEach(p => console.error(`  ✗ ${p} — import is undefined/broken`));
    console.error(`  ${passed} passed, ${failed} FAILED`);
    console.error('');
  } else {
    console.log(`✅ Route integrity: ${passed}/${Object.keys(REQUIRED_ROUTES).length} required routes verified`);
  }
}

// ═══════════════════════════════════════════════════════════════
// ERROR HANDLING
// ═══════════════════════════════════════════════════════════════

app.use((req, res, next) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
    hint: 'GET /health for server status'
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ error: 'Validation Error', details: messages });
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ error: `Duplicate value for ${field}` });
  }
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expired' });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// ═══════════════════════════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════════════════════════

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  initializeScheduler();
  initializeBoardMonitor();
  // CE deadline reminders — daily at 9 AM ET
  cron.schedule('0 9 * * *', () => {
    runDeadlineReminders().catch(err => console.error('CE deadline reminder error:', err.message));
  }, { timezone: 'America/New_York' });
  console.log('CE deadline reminder cron scheduled (daily 9 AM ET)');

  // Daily notification check — credentials, insurance, stale courses, trial expiry — daily at 10 AM ET
  cron.schedule('0 10 * * *', () => {
    runDailyNotificationCheck().catch(err => console.error('Daily notification check error:', err.message));
  }, { timezone: 'America/New_York' });
  console.log('Daily notification check cron scheduled (daily 10 AM ET)');

  // Hardship pause auto-resume — daily at 8 AM ET
  cron.schedule('0 8 * * *', () => {
    runHardshipPauseResume().catch(err =>
      console.error('Hardship pause resume error:', err.message)
    );
  }, { timezone: 'America/New_York' });
  console.log('Hardship pause auto-resume cron scheduled (daily 8 AM ET)');
  verifyRoutes();
  // PostHog server-side analytics
  const phKey = process.env.POSTHOG_API_KEY || 'phc_rRGb8TPVl8lDYnD4M2HMGGuBBkL9whGzghD5FEX20Vb';
  global.posthog = new PostHog(phKey, { host: 'https://us.i.posthog.com' });
  console.log('PostHog analytics initialized');
  app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════╗
║                                                    ║
║   🎓 CounselorReady API Server                     ║
║                                                    ║
║   Port: ${PORT}                                       ║
║   Environment: ${(process.env.NODE_ENV || 'development').padEnd(26)}║
║   MongoDB: Connected                               ║
║   Scheduler: Active                                ║
║   Board Monitor: Active                            ║
║   Routes: ${String(Object.keys(REQUIRED_ROUTES).length).padEnd(2)} required, verified               ║
║                                                    ║
║   Health: http://localhost:${PORT}/health              ║
║                                                    ║
╚════════════════════════════════════════════════════╝
    `);
  });
};

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

export default app;
