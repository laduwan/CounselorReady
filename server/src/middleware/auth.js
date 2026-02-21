import jwt from 'jsonwebtoken';
import User from '../models/User.js';

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

// Generate JWT token
export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Alias for admin middleware (used in course routes)
export const admin = requireAdmin;
export const adminOnly = requireAdmin;
