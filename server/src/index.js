import express from 'express';
import cors from 'cors';
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
// FIX: was importing courseRoutes.js (665L stripped version missing certificate/eval/attestation/gamification)
// Must be interactiveCourseRoutes.js (1109L full pipeline)
import interactiveCourseRoutes from './routes/interactiveCourseRoutes.js';
import cebrokerRoutes from './routes/cebroker.js';
import helpRoutes from './routes/help.js';
import bulkUploadRoutes from './routes/bulkUpload.js';
import courseBuilderRoutes from './routes/courseBuilder.js';
import narrationRoutes from './routes/narration.js';
import aiRoutes from './routes/ai.js';
import aiCourseGeneratorRoutes from './routes/aiCourseGenerator.js';
// FIX: 6 route files existed but were never imported/registered
import gamificationRoutes from './routes/gamification.js';
import referralsRoutes from './routes/referrals.js';
import boardAlertsRoutes from './routes/boardAlerts.js';
import cePlannerRoutes from './routes/cePlanner.js';
import imageUploadRoutes from './routes/imageUpload.js';
import adminStatsRoutes from './routes/adminStats.js';

// Import services
import { initializeScheduler } from './services/notificationScheduler.js';
import { initializeBoardMonitor } from './services/boardMonitorService.js';

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
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(null, true); // Allow anyway for development - tighten in production
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware
// Stripe webhook needs raw body, so we handle it before json parsing
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

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
    const conn = await mongoose.connect(process.env.MONGODB_URI);
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
    const dbStatus = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
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
app.use('/api/course-builder', courseBuilderRoutes);
app.use('/api/narration', narrationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/ai-course-generator', aiCourseGeneratorRoutes);
// FIX: 6 previously unregistered routes — these files existed but were never mounted
app.use('/api/gamification', gamificationRoutes);
app.use('/api/referrals', referralsRoutes);
app.use('/api/board-alerts', boardAlertsRoutes);
app.use('/api/ce-planner', cePlannerRoutes);
app.use('/api/images', imageUploadRoutes);
app.use('/api/admin/stats', adminStatsRoutes);

// Serve static files from templates directory (for certificates)
app.use('/templates', express.static(path.join(__dirname, 'templates')));

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
      '/api/course-builder/*',
      '/api/gamification/*',
      '/api/referrals/*',
      '/api/board-alerts/*',
      '/api/ce-planner/*',
      '/api/scan/*'
    ]
  });
});

// Global error handler
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

// ===========================================
// START SERVER
// ===========================================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  initializeScheduler();
  initializeBoardMonitor();
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
