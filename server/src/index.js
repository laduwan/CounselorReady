import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cron from 'node-cron';

// Route imports
import scanRoutes from './routes/scan.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import courseRoutes from './routes/courses.js';
import credentialRoutes from './routes/credentials.js';
import certificateRoutes from './routes/certificates.js';
import reminderRoutes from './routes/reminders.js';
import paymentRoutes from './routes/payments.js';
import adminRoutes from './routes/admin.js';
import scormRoutes from './routes/scorm.js';
import ltiRoutes from './routes/lti.js';
import xapiRoutes from './routes/xapi.js';
import cebrokerRoutes from './routes/cebroker.js';
import announcementRoutes from './routes/announcements.js';
import analyticsRoutes from './routes/analytics.js';
import migrationRoutes from './routes/migration.js';
import adminSeedRoutes from './routes/adminSeed.js';

// Services
import { checkAndSendReminders } from './services/reminderService.js';
import { 
  sendGracePeriodWarningEmail, 
  sendGracePeriodExpiredEmail, 
  sendPauseEndingSoonEmail,
  sendPauseEndedEmail 
} from './services/hardshipEmailService.js';
import User from './models/User.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://counselorready.com', 'https://www.counselorready.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Stripe webhook needs raw body
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// JSON parser for all other routes
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/credentials', credentialRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/scorm', scormRoutes);
app.use('/api/lti', ltiRoutes);
app.use('/api/xapi', xapiRoutes);
app.use('/api/cebroker', cebrokerRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/migration', migrationRoutes);
app.use('/api/admin-seed', adminSeedRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      
      // Schedule daily reminder check at 8 AM
      cron.schedule('0 8 * * *', async () => {
        console.log('⏰ Running daily credential expiration check...');
        await checkAndSendReminders();
      });
      console.log('📅 Cron job scheduled: Daily reminder check at 8 AM');
      
      // Check grace period expirations daily at 9 AM
      cron.schedule('0 9 * * *', async () => {
        console.log('⏰ Checking grace period expirations...');
        try {
          const usersInGrace = await User.find({
            'subscription.paymentFailedAt': { $ne: null },
            'subscription.status': 'past_due'
          });
          
          for (const user of usersInGrace) {
            const daysRemaining = user.getGracePeriodRemaining ? user.getGracePeriodRemaining() : 0;
            
            // Send warning 3 days before expiration
            if (daysRemaining === 3) {
              await sendGracePeriodWarningEmail(user._id);
            }
            
            // Handle expired grace periods
            if (daysRemaining <= 0) {
              if (user.handleGracePeriodExpired) {
                await user.handleGracePeriodExpired();
              }
              await sendGracePeriodExpiredEmail(user._id);
              // TODO: Cancel Stripe subscription
            }
          }
          console.log(`Checked ${usersInGrace.length} users in grace period`);
        } catch (error) {
          console.error('Grace period check error:', error);
        }
      });
      console.log('📅 Cron job scheduled: Grace period check at 9 AM');
      
      // Check hardship pause expirations daily at 9:30 AM
      cron.schedule('30 9 * * *', async () => {
        console.log('⏰ Checking hardship pause expirations...');
        try {
          const now = new Date();
          const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
          
          // Find pauses ending in exactly 3 days (for warning email)
          const pausesEndingSoon = await User.find({
            'hardshipPause.isActive': true,
            'hardshipPause.pauseEndDate': {
              $gte: new Date(threeDaysFromNow.setHours(0, 0, 0, 0)),
              $lte: new Date(threeDaysFromNow.setHours(23, 59, 59, 999))
            }
          });
          
          for (const user of pausesEndingSoon) {
            await sendPauseEndingSoonEmail(user._id);
          }
          
          // Find expired pauses
          const expiredPauses = await User.find({
            'hardshipPause.isActive': true,
            'hardshipPause.pauseEndDate': { $lte: now }
          });
          
          for (const user of expiredPauses) {
            if (user.endHardshipPause) {
              await user.endHardshipPause();
            } else {
              user.hardshipPause.isActive = false;
              user.hardshipPause.pauseStartDate = null;
              user.hardshipPause.pauseEndDate = null;
              await user.save();
            }
            await sendPauseEndedEmail(user._id);
            // TODO: Resume Stripe subscription
          }
          
          console.log(`Sent ${pausesEndingSoon.length} pause warnings, ended ${expiredPauses.length} pauses`);
        } catch (error) {
          console.error('Hardship pause check error:', error);
        }
      });
      console.log('📅 Cron job scheduled: Hardship pause check at 9:30 AM');
      
      // Annual rollover check (Jan 1 at midnight)
      cron.schedule('0 0 1 1 *', async () => {
        console.log('⏰ Running annual hardship month rollover...');
        try {
          const vipUsers = await User.find({ 'subscription.plan': 'vip' });
          for (const user of vipUsers) {
            if (user.rolloverHardshipMonth) {
              await user.rolloverHardshipMonth();
            }
          }
          console.log(`Rolled over hardship months for ${vipUsers.length} VIP users`);
        } catch (error) {
          console.error('Annual rollover error:', error);
        }
      });
      console.log('📅 Cron job scheduled: Annual hardship rollover on Jan 1');
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

export default app;
