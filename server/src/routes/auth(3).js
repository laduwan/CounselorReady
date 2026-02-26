import express from 'express';
import crypto from 'crypto';
import { Resend } from 'resend';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { protect, generateToken } from '../middleware/auth.js';
import { logActivity, ACTIVITY_TYPES } from '../services/activityTrackingService.js';

const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);

// Validation error handler
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
};

// Register
router.post('/register', [
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').optional().trim(),
  body('state').optional().trim().isLength({ max: 2 }).withMessage('State must be a 2-letter code'),
  validate
], async (req, res) => {
  try {
    const { email, password, firstName, lastName, state } = req.body;
    
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 7);
    
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
        plan: 'free',
        trialEndsAt
      }
    });
    
    // Log activity for admin notification
    await logActivity(ACTIVITY_TYPES.USER_REGISTERED, {
      state: state?.toUpperCase()
    }, {
      userId: user._id,
      userName: `${firstName} ${lastName || ''}`.trim(),
      userEmail: email.toLowerCase()
    });
    
    const token = generateToken(user._id);
    
    res.status(201).json({
      message: 'Registration successful',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
], async (req, res) => {
  try {
    const { email, password } = req.body;
    
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
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  validate
], async (req, res) => {
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
router.post('/reset-password', [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  validate
], async (req, res) => {
  try {
    const { token, password } = req.body;
    
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
router.post('/change-password', protect, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
  validate
], async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
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

export default router;
