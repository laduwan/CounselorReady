/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import express from 'express';
import crypto from 'crypto';
import { Resend } from 'resend';
import User from '../models/User.js';
import Partner from '../models/Partner.js';
import {
  protect,
  generateToken,
  generateChallengeToken,
  verifyChallengeToken,
} from '../middleware/auth.js';
import { sendPartnerWelcomeEmail } from './partners.js';
import { logActivity, ACTIVITY_TYPES } from '../services/activityTrackingService.js';
import { verify2FACode, verifyBackupCode } from '../services/twoFactorService.js';
import Notification from '../models/Notification.js';
import { sendRealtimeNotification } from './notifications.js';
import { processReferralSignup } from '../services/rewardsService.js';
import twilio from 'twilio';
import logger from '../utils/logger.js';

const twilioClient = process.env.TWILIO_ACCOUNT_SID
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, state, partnerSlug, referralCode } = req.body;
    
    if (!email || !password || !firstName) {
      return res.status(400).json({ error: 'Email, password, and first name are required' });
    }
    
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }
    
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 7);
    
    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenHash = crypto.createHash('sha256').update(verificationToken).digest('hex');

    // Resolve partner if slug provided
    let partnerId;
    let partnerPlan;
    if (partnerSlug) {
      const partner = await Partner.findOne({ slug: partnerSlug.toLowerCase(), active: true });
      if (partner) {
        partnerId = partner._id;
        partnerPlan = partner.defaultPlan || 'free';
      }
    }

    const user = await User.create({
      email: email.toLowerCase(),
      passwordHash: password,
      profile: {
        firstName,
        lastName: lastName || '',
        state: state?.toUpperCase()
      },
      subscription: {
        status: 'trial',
        plan: partnerPlan || 'free',
        trialEndsAt
      },
      ...(partnerId && { partnerId }),
      emailVerified: false,
      emailVerificationToken: verificationTokenHash,
      emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000,
    });
    
    // Log activity for admin notification
    await logActivity(ACTIVITY_TYPES.USER_REGISTERED, {
      state: state?.toUpperCase()
    }, {
      userId: user._id,
      userName: `${firstName} ${lastName || ''}`.trim(),
      userEmail: email.toLowerCase()
    });

    // [REWARDS] Referral signup bonus — fire-and-forget, never blocks registration
    if (referralCode) {
      processReferralSignup(user._id, referralCode)
        .then(r => {
          if (r.referrerAwarded) {
            logger.info({ userId: user._id, points: r.points, action: 'referral_signup_bonus' }, '[REWARDS] referrer awarded signup bonus');
          }
        })
        .catch(err => logger.error({ err, userId: user._id, requestId: req.requestId }, '[REWARDS] referral signup failed'));
    }

    // Create welcome notification (non-blocking)
    try {
      const welcomeNotification = await Notification.create({
        userId: user._id,
        type: 'welcome',
        title: 'Welcome to CounselorReady!',
        message: `Hi ${firstName}, thanks for signing up! Your 7-day free trial is active. Explore our CE courses, track your credentials, and start earning continuing education hours today.`,
        urgency: 'info',
        link: '/courses',
        metadata: { trialEndsAt }
      });
      sendRealtimeNotification(user._id, welcomeNotification);
    } catch (notifErr) {
      logger.error({ err: notifErr, userId: user._id, requestId: req.requestId }, 'Welcome notification failed (non-blocking)');
    }

    // Send verification email (non-blocking — don't fail registration if email fails)
    const verifyUrl = `${process.env.CLIENT_URL || 'https://counselorready.com'}/verify-email.html?token=${verificationToken}`;
    try {
      await resend.emails.send({
        from: 'CounselorReady <noreply@counselorready.com>',
        to: user.email,
        subject: 'Verify Your Email - CounselorReady',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #6b1d34; padding: 30px; text-align: center;">
              <h1 style="color: #D4A855; margin: 0;">CounselorReady</h1>
              <p style="color: #fff; margin: 5px 0 0 0; font-size: 12px; letter-spacing: 2px;">LEARN. LICENSE. LEAD.</p>
            </div>
            <div style="padding: 30px; background: #fff;">
              <h2 style="color: #6b1d34;">Welcome, ${firstName}!</h2>
              <p>Thank you for joining CounselorReady. Please verify your email address to get the most out of your account.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verifyUrl}" style="background: #4A7C59; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">Verify Email Address</a>
              </div>
              <p style="color: #666; font-size: 14px;">This link expires in 24 hours.</p>
              <p style="color: #666; font-size: 14px;">If you didn't create this account, you can safely ignore this email.</p>
            </div>
            <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
              <p style="margin: 0;">Ga Integrated Therapeutic Perspectives LLC | NBCC ACEP #7760</p>
            </div>
          </div>
        `
      });
    } catch (emailErr) {
      logger.error({ err: emailErr, userId: user._id, requestId: req.requestId }, 'Verification email failed (non-blocking)');
    }

    // Send partner welcome email if user registered via partner
    if (partnerId) {
      try {
        const partnerDoc = await Partner.findById(partnerId);
        if (partnerDoc) {
          sendPartnerWelcomeEmail(user, partnerDoc);
        }
      } catch (err) { logger.error({ err, userId: user._id, requestId: req.requestId }, 'Partner welcome email failed'); }
    }

    const token = generateToken(user._id);

    try {
      if (global.posthog) {
        global.posthog.capture({
          distinctId: user._id.toString(),
          event: 'user_registered',
          properties: {
            plan: user.subscription?.plan || 'free',
            state: user.profile?.licenseState || '',
            licenseType: user.profile?.licenseType || '',
            referredBy: user.referredBy ? user.referredBy.toString() : null,
            $set: { email: user.email, name: `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim() }
          }
        });
      }
    } catch (phErr) { logger.error({ err: phErr, userId: user._id, requestId: req.requestId }, 'PostHog user_registered failed'); }

    // SMS: new registration
    if (twilioClient && process.env.ADMIN_PHONE) {
      const name = `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim() || 'Unknown';
      twilioClient.messages.create({
        body: `CounselorReady: New Registration\n${name} (${user.email})\n${user.profile?.licenseType || ''} · ${user.profile?.licenseState || ''}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: process.env.ADMIN_PHONE
      }).catch(e => logger.error({ err: e, userId: user._id, requestId: req.requestId }, 'SMS registration notification error'));
    }

    res.status(201).json({
      message: 'Registration successful. Please check your email to verify your account.',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    logger.error({ err: error, requestId: req.requestId }, 'Registration error');
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password, remember } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    user.lastLoginAt = new Date();

    if (user.isTrialExpired()) {
      user.subscription.status = 'expired';
    }

    await user.save();

    // 2FA gate — if enabled, do not issue a full token yet.
    if (user.twoFactorEnabled) {
      const challengeToken = generateChallengeToken(user._id);
      return res.json({
        requiresTwoFactor: true,
        challengeToken,
        message: 'Enter the 6-digit code from your authenticator app, or a backup code.',
      });
    }

    const token = generateToken(user._id, !!remember);

    try {
      if (global.posthog) {
        global.posthog.capture({
          distinctId: user._id.toString(),
          event: 'user_logged_in',
          properties: {
            plan: user.subscription?.plan || 'free',
            $set: { email: user.email }
          }
        });
      }
    } catch (phErr) { logger.error({ err: phErr, userId: user._id, requestId: req.requestId }, 'PostHog user_logged_in failed'); }
    // Log login activity (fire and forget)
    logActivity(ACTIVITY_TYPES.USER_LOGIN, {}, {
      notifyAdmin: false,
      userId: user._id,
      userName: user.profile?.firstName || '',
      userEmail: user.email
    }).catch(() => {});

    res.json({
      message: 'Login successful',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    logger.error({ err: error, requestId: req.requestId }, 'Login error');
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST /api/auth/login/verify-2fa
// Accepts a challenge token and either a 6-digit TOTP code or an
// XXXX-XXXX backup code. Returns the full JWT on success.
router.post('/login/verify-2fa', async (req, res) => {
  try {
    const { challengeToken, code, remember } = req.body;

    if (!challengeToken || !code) {
      return res.status(400).json({ error: 'challengeToken and code are required' });
    }

    const userId = verifyChallengeToken(challengeToken);
    if (!userId) {
      return res.status(401).json({ error: 'Challenge expired or invalid — please log in again' });
    }

    const user = await User.findById(userId).select('+twoFactorSecret +twoFactorBackupCodes');
    if (!user || !user.twoFactorEnabled) {
      return res.status(401).json({ error: 'Account not found or 2FA not enabled' });
    }

    const submitted = String(code).trim();
    let success = false;
    let usedBackup = false;

    // Try TOTP first (6 digits)
    if (/^\d{6}$/.test(submitted)) {
      success = verify2FACode(user.twoFactorSecret, submitted);
    }

    // Fall back to backup code (XXXX-XXXX, case-insensitive)
    if (!success && /^[A-Za-z0-9]{4}-[A-Za-z0-9]{4}$/.test(submitted)) {
      const idx = await verifyBackupCode(user.twoFactorBackupCodes, submitted);
      if (idx >= 0) {
        // One-time consumption — remove the used code
        user.twoFactorBackupCodes.splice(idx, 1);
        await user.save();
        success = true;
        usedBackup = true;
      }
    }

    if (!success) {
      return res.status(401).json({ error: 'Invalid code' });
    }

    const token = generateToken(user._id, !!remember);

    // Log login activity
    logActivity(ACTIVITY_TYPES.USER_LOGIN, { twoFactor: usedBackup ? 'backup' : 'totp' }, {
      notifyAdmin: false,
      userId: user._id,
      userName: user.profile?.firstName || '',
      userEmail: user.email
    }).catch(() => {});

    return res.json({
      message: 'Login successful',
      token,
      user: user.toJSON(),
      backupCodeUsed: usedBackup,
      backupCodesRemaining: usedBackup ? user.twoFactorBackupCodes.length : undefined,
    });
  } catch (err) {
    logger.error({ err, requestId: req.requestId }, '[login/verify-2fa] error');
    return res.status(500).json({ error: '2FA verification failed' });
  }
});

// Get current user
router.get('/me', protect, async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store');
    res.json({ user: req.user.toJSON() });
  } catch (error) {
    logger.error({ err: error, userId: req.user?._id, requestId: req.requestId }, 'Get user error');
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Forgot password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.json({ message: 'If an account exists, a reset email has been sent' });
    }
    
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    user.passwordResetToken = resetTokenHash;
    user.passwordResetExpires = Date.now() + 3600000;
    await user.save();
    
    const resetUrl = `${process.env.CLIENT_URL || 'https://counselorready.com'}/reset-password.html?token=${resetToken}`;
    
    await resend.emails.send({
      from: 'CounselorReady <noreply@counselorready.com>',
      to: user.email,
      subject: 'Reset Your Password - CounselorReady',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #34503d, #6b1d34); padding: 30px; text-align: center;">
            <h1 style="color: #facc15; margin: 0;">CounselorReady</h1>
            <p style="color: #fff; margin: 5px 0 0 0; font-size: 12px; letter-spacing: 2px;">LEARN. LICENSE. LEAD.</p>
          </div>
          <div style="padding: 30px; background: #fff;">
            <h2 style="color: #6b1d34;">Password Reset Request</h2>
            <p>Hi ${user.profile?.firstName || 'there'},</p>
            <p>We received a request to reset your password. Click the button below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background: #6b1d34; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">Reset Password</a>
            </div>
            <p style="color: #666; font-size: 14px;">This link expires in 1 hour.</p>
            <p style="color: #666; font-size: 14px;">If you didn't request this, ignore this email.</p>
          </div>
          <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
            <p style="margin: 0;">Ga Integrated Therapeutic Perspectives LLC | NBCC ACEP #7760</p>
          </div>
        </div>
      `
    });
    
    res.json({ message: 'If an account exists, a reset email has been sent' });
  } catch (error) {
    logger.error({ err: error, requestId: req.requestId }, 'Forgot password error');
    res.status(500).json({ error: 'Failed to process request' });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    
    if (!token || !password) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }
    
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }
    
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');
    
    const user = await User.findOne({
      passwordResetToken: resetTokenHash,
      passwordResetExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }
    
    user.passwordHash = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Send confirmation email (non-blocking — don't fail the reset if email fails)
    try {
      await resend.emails.send({
        from: 'CounselorReady <noreply@counselorready.com>',
        to: user.email,
        subject: 'Password Changed - CounselorReady',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #34503d, #6b1d34); padding: 30px; text-align: center;">
              <h1 style="color: #facc15; margin: 0;">CounselorReady</h1>
            </div>
            <div style="padding: 30px; background: #fff;">
              <h2 style="color: #34503d;">Password Changed Successfully</h2>
              <p>Hi ${user.profile?.firstName || 'there'},</p>
              <p>Your password has been successfully changed.</p>
              <p>If you did not make this change, contact us immediately at support@counselorready.com.</p>
            </div>
          </div>
        `
      });
    } catch (emailErr) {
      logger.error({ err: emailErr, userId: user._id, requestId: req.requestId }, 'Password reset confirmation email failed (non-blocking)');
    }

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    logger.error({ err: error, requestId: req.requestId }, 'Reset password error');
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// Change password (logged in)
router.post('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' });
    }
    
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' });
    }
    
    const user = await User.findById(req.user._id).select('+passwordHash');
    
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    
    user.passwordHash = newPassword;
    await user.save();
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    logger.error({ err: error, userId: req.user?._id, requestId: req.requestId }, 'Change password error');
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Verify email
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Verification token is required' });
    }
    
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    
    const user = await User.findOne({
      emailVerificationToken: tokenHash,
      emailVerificationExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification link' });
    }
    
    if (user.emailVerified) {
      return res.json({ message: 'Email already verified' });
    }
    
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();
    
    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    logger.error({ err: error, requestId: req.requestId }, 'Email verification error');
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Resend verification email
router.post('/resend-verification', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (user.emailVerified) {
      return res.json({ message: 'Email already verified' });
    }
    
    // Generate new token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenHash = crypto.createHash('sha256').update(verificationToken).digest('hex');
    
    user.emailVerificationToken = verificationTokenHash;
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();
    
    const verifyUrl = `${process.env.CLIENT_URL || 'https://counselorready.com'}/verify-email.html?token=${verificationToken}`;
    
    await resend.emails.send({
      from: 'CounselorReady <noreply@counselorready.com>',
      to: user.email,
      subject: 'Verify Your Email - CounselorReady',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #6b1d34; padding: 30px; text-align: center;">
            <h1 style="color: #D4A855; margin: 0;">CounselorReady</h1>
            <p style="color: #fff; margin: 5px 0 0 0; font-size: 12px; letter-spacing: 2px;">LEARN. LICENSE. LEAD.</p>
          </div>
          <div style="padding: 30px; background: #fff;">
            <h2 style="color: #6b1d34;">Verify Your Email</h2>
            <p>Hi ${user.profile?.firstName || 'there'},</p>
            <p>Click below to verify your email address:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verifyUrl}" style="background: #4A7C59; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">Verify Email Address</a>
            </div>
            <p style="color: #666; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
          </div>
          <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
            <p style="margin: 0;">Ga Integrated Therapeutic Perspectives LLC | NBCC ACEP #7760</p>
          </div>
        </div>
      `
    });
    
    res.json({ message: 'Verification email sent' });
  } catch (error) {
    logger.error({ err: error, userId: req.user?._id, requestId: req.requestId }, 'Resend verification error');
    res.status(500).json({ error: 'Failed to resend verification email' });
  }
});

// GET notification preferences
router.get('/notification-preferences', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      notifications: user.notifications || {},
      phone: user.phone || user.profile?.phone || null
    });
  } catch (error) {
    logger.error({ err: error, userId: req.user?._id, requestId: req.requestId }, 'Get notification preferences error');
    res.status(500).json({ error: 'Failed to get notification preferences' });
  }
});

// PUT update-notifications (granular)
router.put('/update-notifications', protect, async (req, res) => {
  try {
    const { email, sms, timing, inApp, unsubscribeAll } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Initialize if needed
    if (!user.notifications) user.notifications = {};

    // Allowlists
    const emailKeys = ['courseCompleted', 'certificateReady', 'courseReminder', 'ceRenewalReminders', 'ceMilestones', 'lowHoursAlert', 'credentialExpiring', 'insuranceExpiring', 'newCourseAnnouncements', 'promotions', 'platformUpdates', 'weeklyDigest'];
    const smsKeys = ['enabled', 'ceRenewalReminders', 'lowHoursAlert', 'credentialExpiring', 'insuranceExpiring', 'courseCompleted', 'ceMilestones'];
    const validReminderDays = [7, 14, 30, 60, 90];
    const validInsuranceDays = [7, 14, 30, 60];

    // Update email prefs
    if (email && typeof email === 'object') {
      if (!user.notifications.email) user.notifications.email = {};
      for (const key of emailKeys) {
        if (typeof email[key] === 'boolean') {
          user.notifications.email[key] = email[key];
        }
      }
    }

    // Update SMS prefs
    if (sms && typeof sms === 'object') {
      if (!user.notifications.sms) user.notifications.sms = {};
      for (const key of smsKeys) {
        if (typeof sms[key] === 'boolean') {
          user.notifications.sms[key] = sms[key];
        }
      }
    }

    // Update timing prefs
    if (timing && typeof timing === 'object') {
      if (!user.notifications.timing) user.notifications.timing = {};
      if (Array.isArray(timing.reminderDays)) {
        const filtered = timing.reminderDays.filter(d => validReminderDays.includes(d));
        if (filtered.length > 0) user.notifications.timing.reminderDays = filtered;
      }
      if (typeof timing.lowHoursThreshold === 'number' && timing.lowHoursThreshold >= 14 && timing.lowHoursThreshold <= 180) {
        user.notifications.timing.lowHoursThreshold = timing.lowHoursThreshold;
      }
      if (Array.isArray(timing.insuranceReminderDays)) {
        const filtered = timing.insuranceReminderDays.filter(d => validInsuranceDays.includes(d));
        if (filtered.length > 0) user.notifications.timing.insuranceReminderDays = filtered;
      }
      if (timing.quietHoursStart !== undefined) user.notifications.timing.quietHoursStart = timing.quietHoursStart;
      if (timing.quietHoursEnd !== undefined) user.notifications.timing.quietHoursEnd = timing.quietHoursEnd;
    }

    // Update inApp prefs
    if (inApp && typeof inApp === 'object') {
      if (!user.notifications.inApp) user.notifications.inApp = {};
      const inAppKeys = ['showBannerAnnouncements', 'showCourseProgress', 'showCeTracker'];
      for (const key of inAppKeys) {
        if (typeof inApp[key] === 'boolean') {
          user.notifications.inApp[key] = inApp[key];
        }
      }
    }

    // Unsubscribe all
    if (typeof unsubscribeAll === 'boolean') {
      user.notifications.unsubscribeAll = unsubscribeAll;
    }

    user.notifications.lastUpdated = new Date();

    // Core fix: Mongoose doesn't auto-detect nested object changes
    user.markModified('notifications');
    await user.save();

    res.json({
      message: 'Notification preferences updated',
      notifications: user.notifications
    });
  } catch (error) {
    logger.error({ err: error, userId: req.user?._id, requestId: req.requestId }, 'Update notifications error');
    res.status(500).json({ error: 'Failed to update notification preferences' });
  }
});

export default router;
