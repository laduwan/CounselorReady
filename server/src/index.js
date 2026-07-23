/**
 * CounselorReady API Server — index.js
 * ═══════════════════════════════════════════════════════════════
 * CRITICAL: This file is the canonical place where API routes are
 * MOUNTED. The declared set lives in ./routeManifest.js (ROUTE_MANIFEST).
 * The boot-time verifyRoutes() cross-checks the two and reports any
 * declared-but-not-mounted (forgotten app.use) or import-broken routers.
 *
 * If you are an AI assistant (Claude Code or otherwise):
 *   - NEVER remove or comment out any import or app.use() line
 *   - NEVER rewrite this file from scratch
 *   - Only ADD new routes — never subtract existing ones
 *   - When adding a route: add the app.use here AND an entry in routeManifest.js
 *   - The startup integrity check will catch regressions
 *
 * Last verified: 2026-03-25 — 37 route mounts, all confirmed
 * ═══════════════════════════════════════════════════════════════
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { requestId } from './middleware/requestId.js';
import { apiVersioning } from './middleware/apiVersioning.js';
import logger from './utils/logger.js';

dotenv.config();

// ═══════════════════════════════════════════════════════════════
// ROUTE IMPORTS — NEVER REMOVE ANY OF THESE
// ═══════════════════════════════════════════════════════════════
import authRoutes from './routes/auth.js';
import coursesRoutes from './routes/courses.js';
import adminRoutes from './routes/admin.js';
import adminAuditRoutes from './routes/adminAudit.js';
import adminCourseReviewsRoutes from './routes/adminCourseReviews.js';
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
import boardSourcesRoutes from './routes/boardSources.js';
import googleCalendarRoutes from './routes/googleCalendar.js';
import resendWebhookRoutes from './routes/webhooksResend.js';
import cePlannerRoutes from './routes/cePlanner.js';
import imageUploadRoutes from './routes/imageUpload.js';
import fileUploadRoutes from './routes/fileUpload.js';
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
import liveSessionRoutes from './routes/liveSessions.js';
import sessionSeriesRoutes from './routes/sessionSeries.js';
import webhooksWherebyRoutes from './routes/webhooksWhereby.js';
import insuranceCredentialsRoutes from './routes/insuranceCredentials.js';
import legacyVaultRoutes from './routes/legacyVault.js';
import groupLicensesRoutes from './routes/groupLicenses.js';
import scholarlyArticlesRoutes from './routes/scholarlyArticles.js';
import adminStatsRoutes from './routes/adminStats.js';
import adminStripeRoutes from './routes/adminStripe.js';
import adminCouponsRoutes from './routes/adminCoupons.js';
import adminCoursePresentationRoutes from './routes/adminCoursePresentation.js';
import organizationsRoutes from './routes/organizations.js';
import auditKitRoutes from './routes/auditKit.js';
import uploadsRoutes from './routes/uploads.js';
import videoAuditRoutes from './routes/videoAudit.js';
import orgRoutes from './routes/orgRoutes.js';
import complianceRoutes from './routes/complianceRoutes.js';
import askPresenterRoutes from './routes/askPresenterRoutes.js';
import { runVideoLinkAudit } from './jobs/videoLinkAuditJob.js';

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
import { runCertificateSelfHeal } from './jobs/certificateSelfHeal.js';
import { runSessionProducerTick } from './jobs/sessionProducerTick.js';
import { runTranscriptionTick } from './jobs/transcriptionTick.js';
import { runBlogAutoGen } from './jobs/blogAutoGen.js';
import { runComplianceDailyJob } from './services/complianceService.js';

import { ROUTE_MANIFEST } from './routeManifest.js';
import mongoSanitize from 'express-mongo-sanitize';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());

// Mount recorder — records every '/api/...' path passed to app.use so
// verifyRoutes() can detect routers that were imported but never mounted.
// Must be installed BEFORE any app.use() calls below.
const __mountedApiPaths = new Set();
const __origUse = app.use.bind(app);
app.use = (...args) => { if (typeof args[0] === 'string' && args[0].startsWith('/api')) __mountedApiPaths.add(args[0]); return __origUse(...args); };

// ═══════════════════════════════════════════════════════════════
// MIDDLEWARE
// ═══════════════════════════════════════════════════════════════

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'https://counselorready.com',
  'https://www.counselorready.com',
  'https://portal.counselorready.com',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Partner-Id', 'X-Partner-Slug']
}));

app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));
app.use('/api/webhooks/resend', express.raw({ type: 'application/json' }));
app.use('/api/webhooks/whereby', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Strip $ and . from user-supplied keys in body/query/params to block
// NoSQL injection (e.g. {"email": {"$gt": ""}}). Must run after body parsers.
app.use(mongoSanitize());

app.use(requestId);

app.use((req, res, next) => {
  logger.debug({ method: req.method, path: req.path, requestId: req.requestId }, 'request');
  next();
});

app.use(apiVersioning);

// ═══════════════════════════════════════════════════════════════
// DATABASE
// ═══════════════════════════════════════════════════════════════

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    logger.info({ host: conn.connection.host }, 'MongoDB connected');
    return conn;
  } catch (error) {
    logger.fatal({ error: error.message }, 'MongoDB connection failed');
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
      apiVersions: ['v1'],
      requiredRoutes: ROUTE_MANIFEST.length
    });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// API ROUTE REGISTRATION
// NEVER REMOVE ANY LINE. ONLY ADD.
// ═══════════════════════════════════════════════════════════════

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts, please try again later' }
});

app.use('/api/', globalLimiter);
app.use('/api/auth', authLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/interactive-courses', interactiveCourseRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/admin/stats', adminStatsRoutes);
app.use('/api/admin/stripe', adminStripeRoutes);
app.use('/api/admin/coupons', adminCouponsRoutes);
app.use('/api/admin/course-presentation', adminCoursePresentationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/audit', adminAuditRoutes);
app.use('/api/admin/course-reviews', adminCourseReviewsRoutes);
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
app.use('/api/board-sources', boardSourcesRoutes);
app.use('/api/google-calendar', googleCalendarRoutes);
app.use('/api/webhooks/resend', resendWebhookRoutes);
app.use('/api/ce-planner', cePlannerRoutes);
app.use('/api/images', imageUploadRoutes);
app.use('/api/files', fileUploadRoutes);
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
app.use('/api/live-sessions', liveSessionRoutes);
app.use('/api/session-series', sessionSeriesRoutes);
app.use('/api/webhooks/whereby', webhooksWherebyRoutes);
app.use('/api/insurance-credentials', insuranceCredentialsRoutes);
app.use('/api/legacy-vault', legacyVaultRoutes);
app.use('/api/group-licenses', groupLicensesRoutes);
app.use('/api/scholarly-articles', scholarlyArticlesRoutes);
app.use('/api/organizations', organizationsRoutes);
app.use('/api/audit-kit', auditKitRoutes);
app.use('/api/uploads', uploadsRoutes);
app.use('/api/admin/video-audit', videoAuditRoutes);
app.use('/api/orgs', orgRoutes);
app.use('/api/ask-presenter', askPresenterRoutes);
app.use('/api', complianceRoutes);

app.use('/templates', express.static(path.join(__dirname, 'templates')));

// ═══════════════════════════════════════════════════════════════
// ROUTE INTEGRITY CHECK
// Runs on every startup. Catches regressions from file overwrites.
// ═══════════════════════════════════════════════════════════════

function verifyRoutes() {
  try {
    const brokenImports = [];
    const notMounted = [];
    const manifestPaths = new Set();

    for (const entry of ROUTE_MANIFEST) {
      const [path, router, label] = entry;
      manifestPaths.add(path);
      if (!router || typeof router !== 'function') {
        brokenImports.push({ path, label });
      }
      if (!__mountedApiPaths.has(path)) {
        notMounted.push({ path, label });
      }
    }

    const untracked = [];
    for (const path of __mountedApiPaths) {
      if (path === '/api/payments/webhook') continue; // raw-body parser, not a router
      if (path === '/api/') continue; // global rate limiter, not a route handler
      if (!manifestPaths.has(path)) untracked.push(path);
    }

    if (brokenImports.length > 0 || notMounted.length > 0) {
      console.error('');
      console.error('╔══════════════════════════════════════════════════╗');
      console.error('║  ❌ ROUTE INTEGRITY CHECK FAILED                ║');
      console.error('╚══════════════════════════════════════════════════╝');
      if (brokenImports.length > 0) {
        console.error(`  Broken imports (router is not a function): ${brokenImports.length}`);
        brokenImports.forEach(({ path, label }) => console.error(`    ✗ ${path}  [${label}]`));
      }
      if (notMounted.length > 0) {
        console.error(`  Declared but NOT MOUNTED (forgotten app.use): ${notMounted.length}`);
        notMounted.forEach(({ path, label }) => console.error(`    ✗ ${path}  [${label}]`));
      }
      console.error('');
    } else {
      console.log(`✅ Route integrity: ${ROUTE_MANIFEST.length} routes declared, all mounted & valid`);
    }

    if (untracked.length > 0) {
      console.warn(`⚠️  Route integrity: ${untracked.length} mounted path(s) not in manifest (drift):`);
      untracked.forEach(p => console.warn(`    • ${p}`));
    }
  } catch (err) {
    console.error('Route integrity check threw — continuing boot:', err && err.message ? err.message : err);
  }
}

// Run the integrity check now — all top-level app.use(...) mounts above
// have already been registered (and recorded by __mountedApiPaths) by the
// time module evaluation reaches this line. Doing it here (rather than
// inside startServer) ensures it runs even if connectDB later exits.
verifyRoutes();

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
  logger.error({ err, requestId: req.requestId, method: req.method, path: req.path }, 'unhandled error');

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
  logger.info('CE deadline reminder cron scheduled (daily 9 AM ET)');

  // Daily notification check — credentials, insurance, stale courses, trial expiry — daily at 10 AM ET
  cron.schedule('0 10 * * *', () => {
    runDailyNotificationCheck().catch(err => console.error('Daily notification check error:', err.message));
  }, { timezone: 'America/New_York' });
  logger.info('Daily notification check cron scheduled (daily 10 AM ET)');

  // Hardship pause auto-resume — daily at 8 AM ET
  cron.schedule('0 8 * * *', () => {
    runHardshipPauseResume().catch(err =>
      console.error('Hardship pause resume error:', err.message)
    );
  }, { timezone: 'America/New_York' });
  logger.info('Hardship pause auto-resume cron scheduled (daily 8 AM ET)');

  // Certificate self-heal — every 6 hours
  cron.schedule('0 */6 * * *', () => {
    runCertificateSelfHeal().catch(err =>
      console.error('Certificate self-heal error:', err.message)
    );
  }, { timezone: 'America/New_York' });
  logger.info('Certificate self-heal cron scheduled (every 6 hours)');

  // Session producer tick — every minute (drop detection, break reminders, wrap-up dispatch)
  cron.schedule('* * * * *', () => {
    runSessionProducerTick().catch(err =>
      console.error('Session producer tick error:', err.message)
    );
  }, { timezone: 'America/New_York' });
  logger.info('Session producer tick cron scheduled (every minute)');

  // Self-hosted transcription tick — every 5 minutes (AWS Transcribe start/poll for catch-up)
  cron.schedule('*/5 * * * *', () => {
    runTranscriptionTick().catch(err =>
      console.error('Transcription tick error:', err.message)
    );
  }, { timezone: 'America/New_York' });
  logger.info('Transcription tick cron scheduled (every 5 minutes)');

  // Video link audit — every Monday at 3 AM ET
  cron.schedule('0 3 * * 1', () => {
    runVideoLinkAudit({ writeResults: true, verbose: true })
      .catch(err => console.error('[VideoAudit] Weekly cron error:', err.message));
  }, { timezone: 'America/New_York' });
  logger.info('Video link audit cron scheduled (Mondays 3 AM ET)');

  // Practice Compliance daily job — cert→assignment reconciliation, overdue
  // flips, due/expiry alerts, annual recurrence, GA STR recoupment alerts —
  // daily at 7 AM ET.
  cron.schedule('0 7 * * *', () => {
    runComplianceDailyJob().catch(err => console.error('Compliance daily job error:', err.message));
  }, { timezone: 'America/New_York' });
  logger.info('Practice Compliance daily job cron scheduled (daily 7 AM ET)');

  // Blog auto-generation — picks next topic from queue, generates a draft via
  // Claude, saves status='draft' for admin review. NEVER auto-publishes.
  // Review and publish at /admin-blog.html. Runs Tuesdays 6 AM ET.
  cron.schedule('0 6 * * 2', () => {
    runBlogAutoGen().catch(err => console.error('[BlogAutoGen] Cron error:', err.message));
  }, { timezone: 'America/New_York' });
  logger.info('Blog auto-generation cron scheduled (Tuesdays 6 AM ET)');
  // PostHog server-side analytics
  const phKey = process.env.POSTHOG_API_KEY || 'phc_rRGb8TPVl8lDYnD4M2HMGGuBBkL9whGzghD5FEX20Vb';
  global.posthog = new PostHog(phKey, { host: 'https://us.i.posthog.com' });
  logger.info('PostHog analytics initialized');
  const server = app.listen(PORT, () => {
    logger.info({ port: PORT, env: process.env.NODE_ENV || 'development', routes: ROUTE_MANIFEST.length }, 'CounselorReady API server started');
  });

  // Graceful shutdown — let in-flight requests finish on SIGTERM/SIGINT
  const shutdown = async (signal) => {
    console.log(`\n${signal} received — shutting down gracefully...`);
    server.close(() => {
      console.log('HTTP server closed');
      mongoose.connection.close(false).then(() => {
        console.log('MongoDB connection closed');
        process.exit(0);
      });
    });
    // Force exit after 10 seconds if graceful shutdown hangs
    setTimeout(() => {
      console.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

// Guard against unhandled promise rejections and uncaught exceptions.
// Prevents a stray async throw from silently killing the process (and causing 502s).
process.on('unhandledRejection', (reason, promise) => {
  console.error('[process] Unhandled Rejection at:', promise, 'reason:', reason);
  // Do not exit — log and continue. Render will restart on true crashes.
});

process.on('uncaughtException', (err) => {
  console.error('[process] Uncaught Exception:', err);
  // Exit so Render restarts cleanly rather than running in a broken state.
  process.exit(1);
});

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

export default app;
