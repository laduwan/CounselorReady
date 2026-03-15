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
import { protect, generateToken } from '../middleware/auth.js';
import { logActivity, ACTIVITY_TYPES } from '../services/activityTrackingService.js';

const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, state, partnerSlug } = req.body;
    
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
      emailVerificationToken: verificationTokenHash
    });
    
    // Log activity for admin notification
    await logActivity(ACTIVITY_TYPES.USER_REGISTERED, {
      state: state?.toUpperCase()
    }, {
      userId: user._id,
      userName: `${firstName} ${lastName || ''}`.trim(),
      userEmail: email.toLowerCase()
    });

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
      console.error('Verification email failed (non-blocking):', emailErr.message);
    }
    
    const token = generateToken(user._id);
    
    res.status(201).json({
      message: 'Registration successful. Please check your email to verify your account.',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
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

    const token = generateToken(user._id);

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
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
router.get('/me', protect, async (req, res) => {
  try {
    res.json({ user: req.user.toJSON() });
  } catch (error) {
    console.error('Get user error:', error);
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
    
    const resetUrl = `https://counselorready.com/reset-password.html?token=${resetToken}`;
    
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
    console.error('Forgot password error:', error);
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
    
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
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
    console.error('Change password error:', error);
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
    
    const user = await User.findOne({ emailVerificationToken: tokenHash });
    
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
    console.error('Email verification error:', error);
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
    console.error('Resend verification error:', error);
    res.status(500).json({ error: 'Failed to resend verification email' });
  }
});

export default router;
