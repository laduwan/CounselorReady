/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Throttles the activity-heartbeat write in protect() to once per user per minute.
const lastWrite = new Map();

// Protect routes - require authentication
export const protect = async (req, res, next) => {
  try {
    let token;
    
    // Get token from header
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({ error: 'Not authorized, no token' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from token
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    // Check if trial expired
    if (user.isTrialExpired()) {
      user.subscription.status = 'expired';
      await user.save();
    }
    
    // Fire-and-forget activity heartbeat, throttled to once per user per minute.
    // Never awaited — must not affect auth latency or behavior on any path.
    const now = Date.now();
    if (now - (lastWrite.get(String(user._id)) || 0) > 60000) {
      lastWrite.set(String(user._id), now);
      const set = { lastActiveAt: new Date(now) };
      if (!user.lastActiveAt || now - user.lastActiveAt.getTime() > 30 * 60000) {
        set.sessionStartAt = new Date(now);
      }
      User.updateOne({ _id: user._id }, { $set: set }).catch(() => {});
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ error: 'Not authorized, token invalid' });
  }
};

// Require active subscription
export const requireSubscription = async (req, res, next) => {
  if (!req.user.hasActiveSubscription()) {
    return res.status(403).json({ 
      error: 'Active subscription required',
      code: 'SUBSCRIPTION_REQUIRED'
    });
  }
  next();
};

// Require admin role
export const requireAdmin = async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Require partner_admin or admin role
export const requirePartnerAdmin = async (req, res, next) => {
  if (req.user.role === 'admin') {
    // Support "View as Partner" impersonation for admins
    const impersonateId = req.headers['x-partner-id'];
    if (impersonateId) {
      req.partnerId = impersonateId;
    }
    return next();
  }
  if (req.user.role === 'partner_admin' && req.user.partnerId) {
    req.partnerId = req.user.partnerId;

    // Enforce billing status — block access for inactive/canceled partners
    try {
      const Partner = (await import('../models/Partner.js')).default;
      const partner = await Partner.findById(req.user.partnerId).select('billing').lean();
      const billingStatus = partner?.billing?.status;
      if (billingStatus === 'inactive' || billingStatus === 'canceled') {
        return res.status(402).json({
          error: 'Subscription inactive',
          code: 'BILLING_INACTIVE',
          billingStatus,
          message: 'Your organization\'s subscription has lapsed. Please contact your administrator to reactivate.',
          upgradeUrl: '/partner-billing.html'
        });
      }
    } catch (err) {
      // Fail-open: billing check error should not lock out partner admins
      console.error('[requirePartnerAdmin] billing check error:', err.message);
    }

    return next();
  }
  return res.status(403).json({ error: 'Partner admin access required' });
};

// Optional auth - attach user if token exists, but don't require it
export const optionalAuth = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (user) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Token invalid, but that's okay - continue without user
    next();
  }
};

// Generate JWT token.
// `remember` is optional: when explicitly true the session is long-lived (30d),
// when explicitly false it is short-lived (1d). When omitted (undefined) the
// behavior is unchanged from before — JWT_EXPIRES_IN or the 7d default — so
// existing callers (2FA verify, admin impersonation) are unaffected.
export const generateToken = (userId, remember) => {
  let expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  if (remember === true) expiresIn = '30d';
  else if (remember === false) expiresIn = '1d';
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn }
  );
};

// Short-lived JWT used between password verification and 2FA code submission.
// 5-minute expiry. The 'purpose' claim distinguishes it from real auth tokens.
export const generateChallengeToken = (userId) => {
  return jwt.sign(
    { id: userId, purpose: '2fa-challenge' },
    process.env.JWT_SECRET,
    { expiresIn: '5m' }
  );
};

// Verify a 2FA challenge token. Returns userId on success, null otherwise.
// Rejects tokens without the 2fa-challenge purpose claim.
export const verifyChallengeToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded?.purpose !== '2fa-challenge') return null;
    return decoded.id;
  } catch {
    return null;
  }
};

// Alias for admin middleware (used in course routes)
export const admin = requireAdmin;
export const adminOnly = requireAdmin;
