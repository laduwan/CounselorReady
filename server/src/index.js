
/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth.js';
import coursesRoutes from './routes/courses.js';
import adminRoutes from './routes/admin.js';
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
import interactiveCourseRoutes from './routes/interactiveCourseRoutes.js';
import cebrokerRoutes from './routes/cebroker.js';
import helpRoutes from './routes/help.js';
import bulkUploadRoutes from './routes/bulkUpload.js';
import toolsRoutes from './routes/tools.js';
// ── Previously unregistered routes (wiring audit fix 2026-03-04) ──
import aiRoutes from './routes/ai.js';
import aiCourseGeneratorRoutes from './routes/aiCourseGenerator.js';
import courseBuilderRoutes from './routes/courseBuilder.js';
import narrationRoutes from './routes/narration.js';
import uploadsRoutes from './routes/uploads.js';
import imageUploadRoutes from './routes/imageUpload.js';
// ── New feature routes (2026-03-06) ──
import organizationsRoutes from './routes/organizations.js';
import cePlannerRoutes from './routes/cePlanner.js';
import insuranceCredentialsRoutes from './routes/insuranceCredentials.js';
import auditKitRoutes from './routes/auditKit.js';
import boardAlertsRoutes from './routes/boardAlerts.js';
// ── New feature routes (2026-03-06 batch 2) ──
import groupLicensesRoutes from './routes/groupLicenses.js';
import recommendationsRoutes from './routes/recommendations.js';
import supervisionRoutes from './routes/supervision.js';
import referralsRoutes from './routes/referrals.js';
import gamificationRoutes from './routes/gamification.js';
import notificationsRoutes from './routes/notifications.js';
import legacyVaultRoutes from './routes/legacyVault.js';
import adminStatsRoutes from './routes/adminStats.js';
// ── Whitelabel partner routes ──
import partnersRoutes from './routes/partners.js';
import rawMarkdownRoutes from './routes/rawMarkdownRoute.js';
import dashboardRoutes from './routes/dashboard.js';
// ── Research Ready CE ──
import researchReadyRoutes from './routes/researchReady.js';
// Import services
import { initializeScheduler } from './services/notificationScheduler.js';

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();

// ===========================================
// MIDDLEWARE
// ===========================================

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else if (process.env.NODE_ENV === 'production') {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    } else {
      // Allow all origins in development
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow cross-origin for API
  contentSecurityPolicy: false // Disable CSP since this is an API server
}));

// ===========================================
// RATE LIMITING
// ===========================================

// Global rate limit: 200 requests per 15 minutes per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', globalLimiter);

// Strict auth limiter: 7 attempts per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 7,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again in 15 minutes.' }
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Password reset limiter: 3 per hour
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many password reset requests. Please try again in an hour.' }
});
app.use('/api/auth/forgot-password', passwordResetLimiter);
app.use('/api/auth/reset-password', passwordResetLimiter);

// AI endpoint limiter: 15 per hour (protect against cost abuse)
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'AI generation rate limit reached. Please try again later.' }
});
app.use('/api/ai/', aiLimiter);
app.use('/api/ai-course-generator/', aiLimiter);
app.use('/api/admin/quiz/generate', aiLimiter);
app.use('/api/admin/course/generate', aiLimiter);
app.use('/api/admin/module/generate', aiLimiter);

// Body parsing middleware
// Stripe webhook needs raw body, so we handle it before json parsing
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Request logging (development)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
    next();
  });
}

// ===========================================
// DATABASE CONNECTION
// ===========================================

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // These options are no longer needed in Mongoose 6+, but kept for compatibility
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// ===========================================
// ROUTES
// ===========================================

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const dbStatus = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      mongodb: dbStatus[dbState] || 'unknown',
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0'
    });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/interactive-courses', interactiveCourseRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/certificates', certificatesRoutes);
app.use('/api/credentials', credentialsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/migration', migrationRoutes);
app.use('/api/announcements', announcementsRoutes);
app.use('/api/reminders', remindersRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/scorm', scormRoutes);
app.use('/api/lti', ltiRoutes);
app.use('/api/xapi', xapiRoutes);
app.use('/api/cebroker', cebrokerRoutes);
app.use('/api/help', helpRoutes);
app.use('/api/admin/courses', bulkUploadRoutes);
// ── Previously unregistered routes (wiring audit fix 2026-03-04) ──
app.use('/api/ai', aiRoutes);
app.use('/api/ai-course-generator', aiCourseGeneratorRoutes);
app.use('/api/course-builder', courseBuilderRoutes);
app.use('/api/narration', narrationRoutes);
app.use('/api/uploads', uploadsRoutes);
app.use('/api/images', imageUploadRoutes);
// ── New feature routes (2026-03-06) ──
app.use('/api/organizations', organizationsRoutes);
app.use('/api/ce-planner', cePlannerRoutes);
app.use('/api/insurance-credentials', insuranceCredentialsRoutes);
app.use('/api/audit-kit', auditKitRoutes);
app.use('/api/board-alerts', boardAlertsRoutes);
// ── New feature routes (2026-03-06 batch 2) ──
app.use('/api/group-licenses', groupLicensesRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use('/api/supervision', supervisionRoutes);
app.use('/api/referrals', referralsRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/legacy-vault', legacyVaultRoutes);
app.use('/api/admin/stats', adminStatsRoutes);
app.use('/api/partners', partnersRoutes);
app.use('/api/tools', toolsRoutes);
app.use('/api/rawmd', rawMarkdownRoutes);
app.use('/api/dashboard', dashboardRoutes);
// ── Research Ready CE ──
app.use('/api/research-ready', researchReadyRoutes);

// Serve syllabus DOCX files
app.use('/uploads/syllabi', express.static(path.join(__dirname, '../uploads/syllabi')));

// Static templates directory intentionally NOT served publicly
// Certificate assets (signature.png, certificate_template.pdf) are loaded
// via filesystem path in certificate generation routes only

// ===========================================
// ERROR HANDLING
// ===========================================

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
    availableEndpoints: [
      '/health',
      '/api/auth/*',
      '/api/courses/*',
      '/api/interactive-courses/*',
      '/api/admin/*',
      '/api/users/*',
      '/api/certificates/*',
      '/api/credentials/*',
      '/api/payments/*',
      '/api/analytics/*',
      '/api/migration/*',
      '/api/ai-course-generator/*' // ← NEW
    ]
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ error: 'Validation Error', details: messages });
  }
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ error: `Duplicate value for ${field}` });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expired' });
  }
  
  // Default error
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// ===========================================
// START SERVER
// ===========================================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to database first
  await connectDB();
  
  // Initialize notification scheduler
  initializeScheduler();
  
  // Start listening
  const server = app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════╗
║                                                  ║
║   🎓 CounselorReady API Server                   ║
║                                                  ║
║   Port: ${PORT}                                     ║
║   Environment: ${(process.env.NODE_ENV || 'development').padEnd(26)}║
║   MongoDB: Connected                             ║
║   Scheduler: Active                              ║
║   AI Generation: Ready                           ║
║                                                  ║
║   Health: http://localhost:${PORT}/health            ║
║                                                  ║
╚══════════════════════════════════════════════════╝
    `);
  });

  // Increase server timeout for AI generation endpoints (Anthropic calls take 30-90s)
  server.timeout = 120000; // 2 minutes
  server.keepAliveTimeout = 120000;
  server.headersTimeout = 125000;
};

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
  process.exit(1);
});

export default app;
