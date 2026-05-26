/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import express from 'express';
import crypto from 'crypto';
import Stripe from 'stripe';
import { Resend } from 'resend';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { generateUserDataExport } from '../services/dataExportService.js';
import { sendTestSMS } from '../services/calendarSmsService.js';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    res.json({ user: req.user.toJSON() });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { firstName, lastName, certificateName, state, timezone, phone, fullName,
            pronouns, npi, specializations, supervisor, preferredApprovalBody } = req.body;

    const user = await User.findById(req.user._id);

    // Support fullName as single field (split into first/last)
    if (fullName && !firstName && !lastName) {
      const parts = fullName.trim().split(/\s+/);
      user.profile.firstName = parts[0] || '';
      user.profile.lastName = parts.slice(1).join(' ') || '';
    } else {
      if (firstName !== undefined) user.profile.firstName = firstName;
      if (lastName !== undefined) user.profile.lastName = lastName;
    }
    if (certificateName !== undefined) user.profile.certificateName = certificateName;
    if (state && typeof state === 'string') user.profile.state = state.toUpperCase();
    if (timezone) user.profile.timezone = timezone;
    if (phone !== undefined) {
      const trimmedPhone = String(phone).trim();
      if (trimmedPhone !== '') {
        const digits = trimmedPhone.replace(/\D/g, '');
        if (digits.length < 10 || digits.length > 15) {
          return res.status(400).json({ error: 'Phone must be a valid number (10–15 digits)' });
        }
      }
      user.profile.phone = trimmedPhone;
      user.phone = trimmedPhone; // keep top-level in sync — SMS/Twilio services read user.phone
    }

    if (pronouns !== undefined) user.profile.pronouns = pronouns;
    if (npi !== undefined) {
      if (npi && !/^\d{10}$/.test(npi)) {
        return res.status(400).json({ error: 'NPI must be exactly 10 digits' });
      }
      user.profile.npi = npi;
    }
    if (Array.isArray(specializations)) user.profile.specializations = specializations;
    if (preferredApprovalBody !== undefined) user.profile.preferredApprovalBody = preferredApprovalBody;
    if (supervisor && typeof supervisor === 'object') {
      user.profile.supervisor = {
        name:        supervisor.name        ?? user.profile.supervisor?.name        ?? '',
        license:     supervisor.license     ?? user.profile.supervisor?.license     ?? '',
        credentials: supervisor.credentials ?? user.profile.supervisor?.credentials ?? '',
        startDate:   supervisor.startDate   ? new Date(supervisor.startDate)
                                            : user.profile.supervisor?.startDate ?? null,
      };
    }

    await user.save();
    
    res.json({
      message: 'Profile updated',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// @route   PUT /api/users/notifications
// @desc    Update notification preferences
// @access  Private
router.put('/notifications', protect, async (req, res) => {
  try {
    const { 
      emailReminders, 
      smsReminders,
      calendarSync, 
      marketingEmails, 
      reminderFrequency,
      weeklyProgress,
      fallingBehindAlert,
      ceMilestones,
      courseProgressReminders
    } = req.body;
    
    const user = await User.findById(req.user._id);
    
    // Initialize notifications object if needed
    if (!user.notifications) user.notifications = {};
    
    if (emailReminders !== undefined) user.notifications.emailReminders = emailReminders;
    if (smsReminders !== undefined) user.notifications.smsReminders = smsReminders;
    if (calendarSync !== undefined) user.notifications.calendarSync = calendarSync;
    if (marketingEmails !== undefined) user.notifications.marketingEmails = marketingEmails;
    if (reminderFrequency) user.notifications.reminderFrequency = reminderFrequency;
    if (weeklyProgress !== undefined) user.notifications.weeklyProgress = weeklyProgress;
    if (fallingBehindAlert !== undefined) user.notifications.fallingBehindAlert = fallingBehindAlert;
    if (ceMilestones !== undefined) user.notifications.ceMilestones = ceMilestones;
    if (courseProgressReminders !== undefined) user.notifications.courseProgressReminders = courseProgressReminders;

    user.markModified('notifications');
    await user.save();
    
    res.json({
      message: 'Notification preferences updated',
      notifications: user.notifications,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Update notifications error:', error);
    res.status(500).json({ error: 'Failed to update notifications' });
  }
});

// @route   DELETE /api/users/account
// @desc    Delete user account
// @access  Private
router.delete('/account', protect, async (req, res) => {
  try {
    const { confirmEmail } = req.body;
    
    // Require email confirmation to delete
    if (confirmEmail !== req.user.email) {
      return res.status(400).json({ error: 'Please confirm your email to delete account' });
    }
    
    const user = await User.findById(req.user._id);

    // Cancel Stripe subscription if active
    if (user.subscription?.stripeSubscriptionId) {
      try {
        const Stripe = (await import('stripe')).default;
        const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
        if (stripe) {
          await stripe.subscriptions.cancel(user.subscription.stripeSubscriptionId);
          console.log(`Canceled Stripe subscription ${user.subscription.stripeSubscriptionId} for deleted user ${user._id}`);
        }
      } catch (stripeErr) {
        console.error('Failed to cancel Stripe subscription on account deletion:', stripeErr.message);
      }
    }

    // Delete related data
    const Certificate = (await import('../models/Certificate.js')).default;
    const UserCredential = (await import('../models/UserCredential.js')).default;
    const UserCourseProgress = (await import('../models/UserCourseProgress.js')).default;
    await Promise.all([
      Certificate.deleteMany({ userId: req.user._id }),
      UserCredential.deleteMany({ userId: req.user._id }),
      UserCourseProgress.deleteMany({ userId: req.user._id }),
    ]);

    await User.findByIdAndDelete(req.user._id);

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

// Import models for dashboard
import Certificate from '../models/Certificate.js';
import UserCredential from '../models/UserCredential.js';
import UserCourseProgress from '../models/UserCourseProgress.js';
import Course from '../models/Course.js';

// @route   GET /api/users/dashboard
// @desc    Get dashboard stats and data
// @access  Private
router.get('/dashboard', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get certificates
    const certificates = await Certificate.find({ userId });
    const certificatesCount = certificates.length;
    const totalHours = certificates.reduce((sum, c) => sum + (c.ceHours || 0), 0);
    
    // Get credentials
    const credentials = await UserCredential.find({ userId });
    const credentialsCount = credentials.length;
    
    // Get course progress
    const courseProgress = await UserCourseProgress.find({ userId })
      .populate('courseId', 'title slug thumbnail ceHours ceuHours');
    const coursesCompleted = courseProgress.filter(p => p.status === 'completed').length;
    const inProgressCourses = courseProgress.filter(p => p.status === 'in_progress');
    
    // CE Progress per credential
    const ceProgress = credentials.map(cred => ({
      id: cred._id,
      name: cred.name,
      state: cred.state,
      completed: cred.totalCEUsCompleted || 0,
      required: cred.totalCEUsRequired || 0,
      percent: cred.totalCEUsRequired > 0 
        ? Math.min(100, Math.round((cred.totalCEUsCompleted || 0) / cred.totalCEUsRequired * 100))
        : 0,
      expirationDate: cred.expirationDate
    }));
    
    // Upcoming renewals (within 90 days)
    const now = new Date();
    const ninetyDaysFromNow = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
    const upcomingRenewals = credentials
      .filter(c => c.expirationDate && new Date(c.expirationDate) <= ninetyDaysFromNow && new Date(c.expirationDate) > now)
      .map(c => ({
        id: c._id,
        name: c.name,
        state: c.state,
        expirationDate: c.expirationDate,
        daysLeft: Math.ceil((new Date(c.expirationDate) - now) / (1000 * 60 * 60 * 24))
      }))
      .sort((a, b) => a.daysLeft - b.daysLeft);
    
    // Recent activity (last 10 items)
    const recentCertificates = certificates
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(c => ({
        type: 'certificate',
        title: c.title,
        date: c.createdAt,
        ceHours: c.ceHours
      }));
    
    const recentCourseActivity = courseProgress
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5)
      .map(p => ({
        type: p.status === 'completed' ? 'course_complete' : 'course_progress',
        title: p.courseId?.title || 'Unknown Course',
        slug: p.courseId?.slug || null,
        courseId: p.courseId?._id || null,
        date: p.updatedAt,
        progress: p.percentComplete || 0
      }));
    
    const recentActivity = [...recentCertificates, ...recentCourseActivity]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);
    
    res.json({
      totalHours,
      certificatesCount,
      credentialsCount,
      coursesCompleted,
      inProgressCourses: inProgressCourses.map(p => ({
        courseId: p.courseId?._id,
        title: p.courseId?.title,
        slug: p.courseId?.slug,
        thumbnail: p.courseId?.thumbnail,
        progress: p.progressPercent || 0
      })),
      ceProgress,
      upcomingRenewals,
      recentActivity
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to load dashboard data' });
  }
});

// ============================================
// HARDSHIP PAUSE ROUTES
// ============================================

import { sendHardshipPauseActivatedEmail, sendPauseEndedEmail } from '../services/hardshipEmailService.js';

// Helper: Check and perform annual rollover if needed
async function checkAndRollover(user) {
  const currentYear = new Date().getFullYear();
  
  // Skip if already rolled over this year
  if (user.hardshipPause?.lastRolloverYear === currentYear) {
    return false;
  }
  
  // Skip if user is new this year (no previous year to rollover from)
  const memberYear = new Date(user.memberSince || user.createdAt).getFullYear();
  if (memberYear === currentYear && !user.hardshipPause?.lastRolloverYear) {
    if (!user.hardshipPause) user.hardshipPause = {};
    user.hardshipPause.lastRolloverYear = currentYear;
    await user.save();
    return false;
  }
  
  // Perform rollover if method exists
  if (user.rolloverHardshipMonth) {
    await user.rolloverHardshipMonth();
    return true;
  }
  return false;
}

// @route   GET /api/users/hardship-status
// @desc    Get hardship pause status for dashboard
// @access  Private (VIP only)
router.get('/hardship-status', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Check if VIP
    const isVip = user.isVip ? user.isVip() : user.subscription?.plan === 'vip';
    
    if (!isVip) {
      return res.json({
        isVip: false,
        totalMonths: 0,
        available: 0,
        banked: 0
      });
    }
    
    // Check for annual rollover
    await checkAndRollover(user);
    
    const totalMonths = user.getTotalHardshipMonths ? user.getTotalHardshipMonths() : 
      (user.hardshipPause?.available || 0) + (user.hardshipPause?.banked || 0);
    const gracePeriodDays = user.getGracePeriodDays ? user.getGracePeriodDays() : 7;
    
    res.json({
      isVip: true,
      totalMonths,
      available: user.hardshipPause?.available || 0,
      banked: user.hardshipPause?.banked || 0,
      usedTotal: user.hardshipPause?.usedTotal || 0,
      history: user.hardshipPause?.history || [],
      isActive: user.hardshipPause?.isActive || false,
      pauseStartDate: user.hardshipPause?.pauseStartDate,
      pauseEndDate: user.hardshipPause?.pauseEndDate,
      gracePeriodDays,
      paymentFailed: !!user.subscription?.paymentFailedAt,
      graceDaysRemaining: user.getGracePeriodRemaining ? user.getGracePeriodRemaining() : 0,
      memberSince: user.memberSince || user.createdAt
    });
    
  } catch (error) {
    console.error('Hardship status error:', error);
    res.status(500).json({ error: 'Failed to get hardship status' });
  }
});

// @route   POST /api/users/hardship-pause
// @desc    Activate a hardship pause
// @access  Private (VIP only)
router.post('/hardship-pause', protect, async (req, res) => {
  try {
    const { reason } = req.body;
    const user = await User.findById(req.user._id);
    
    // Validate eligibility
    if (user.canUseHardshipPause) {
      const canUse = user.canUseHardshipPause();
      if (!canUse.allowed) {
        return res.status(400).json({ 
          error: canUse.reason,
          monthsAvailable: user.getTotalHardshipMonths ? user.getTotalHardshipMonths() : 0
        });
      }
    }
    
    // Activate pause
    if (user.useHardshipPause) {
      await user.useHardshipPause(reason);
    } else {
      // Manual fallback
      if (!user.hardshipPause) user.hardshipPause = {};
      user.hardshipPause.isActive = true;
      user.hardshipPause.pauseStartDate = new Date();
      user.hardshipPause.pauseEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      await user.save();
    }
    
    // Pause Stripe subscription (set to cancel at period end, then reactivate on resume)
    if (user.subscription?.stripeSubscriptionId) {
      try {
        const Stripe = (await import('stripe')).default;
        const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
        if (stripe) {
          await stripe.subscriptions.update(user.subscription.stripeSubscriptionId, {
            pause_collection: { behavior: 'void' }
          });
          console.log(`Paused Stripe subscription ${user.subscription.stripeSubscriptionId} for hardship`);
        }
      } catch (stripeErr) {
        console.error('Failed to pause Stripe subscription:', stripeErr.message);
      }
    }

    // Send confirmation email
    await sendHardshipPauseActivatedEmail(user._id);
    
    res.json({
      success: true,
      message: 'Hardship pause activated',
      pauseEndDate: user.hardshipPause.pauseEndDate,
      monthsRemaining: user.getTotalHardshipMonths ? user.getTotalHardshipMonths() : 0
    });
    
  } catch (error) {
    console.error('Hardship pause error:', error);
    res.status(500).json({ error: error.message || 'Failed to activate hardship pause' });
  }
});

// @route   POST /api/users/end-hardship-pause
// @desc    End a hardship pause early (optional)
// @access  Private
router.post('/end-hardship-pause', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user.hardshipPause?.isActive) {
      return res.status(400).json({ error: 'No active hardship pause' });
    }
    
    if (user.endHardshipPause) {
      await user.endHardshipPause();
    } else {
      user.hardshipPause.isActive = false;
      user.hardshipPause.pauseStartDate = null;
      user.hardshipPause.pauseEndDate = null;
      await user.save();
    }
    
    // Resume Stripe subscription
    if (user.subscription?.stripeSubscriptionId) {
      try {
        const Stripe = (await import('stripe')).default;
        const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
        if (stripe) {
          await stripe.subscriptions.update(user.subscription.stripeSubscriptionId, {
            pause_collection: ''
          });
          console.log(`Resumed Stripe subscription ${user.subscription.stripeSubscriptionId} after hardship pause`);
        }
      } catch (stripeErr) {
        console.error('Failed to resume Stripe subscription:', stripeErr.message);
      }
    }

    // Send confirmation email
    await sendPauseEndedEmail(user._id);
    
    res.json({
      success: true,
      message: 'Hardship pause ended'
    });
    
  } catch (error) {
    console.error('End hardship pause error:', error);
    res.status(500).json({ error: 'Failed to end hardship pause' });
  }
});

// ============================================
// LIABILITY INSURANCE ROUTES
// ============================================

// Known insurance providers with typical rates (updated periodically)
const insuranceProviders = [
  {
    id: 'hpso',
    name: 'HPSO (Healthcare Providers Service Organization)',
    website: 'https://www.hpso.com',
    typicalPremium: { min: 150, max: 350 },
    coverage: '1M/3M',
    coverageType: 'occurrence',
    features: ['Free license defense', 'HIPAA coverage', 'Cyber liability add-on'],
    rating: 4.5,
    bestFor: 'Most counselors - good value and reputation'
  },
  {
    id: 'cph',
    name: 'CPH & Associates',
    website: 'https://www.cphins.com',
    typicalPremium: { min: 100, max: 280 },
    coverage: '1M/3M',
    coverageType: 'occurrence',
    features: ['Low premiums', 'Easy online quotes', 'Student discounts'],
    rating: 4.3,
    bestFor: 'Budget-conscious counselors and students'
  },
  {
    id: 'proliability',
    name: 'Proliability (Mercer)',
    website: 'https://www.proliability.com',
    typicalPremium: { min: 180, max: 400 },
    coverage: '1M/3M',
    coverageType: 'occurrence',
    features: ['ACA endorsed', 'Includes legal defense', 'Board complaint coverage'],
    rating: 4.4,
    bestFor: 'ACA members (discounts available)'
  },
  {
    id: 'american_professional',
    name: 'American Professional Agency',
    website: 'https://www.americanprofessional.com',
    typicalPremium: { min: 140, max: 320 },
    coverage: '1M/3M',
    coverageType: 'both',
    features: ['Occurrence and claims-made options', 'Flexible coverage', 'Good for group practices'],
    rating: 4.2,
    bestFor: 'Group practices and diverse needs'
  },
  {
    id: 'therapist_insurance',
    name: 'Therapist Insurance Services',
    website: 'https://www.therapistinsurance.com',
    typicalPremium: { min: 130, max: 290 },
    coverage: '1M/3M',
    coverageType: 'occurrence',
    features: ['Telehealth included', 'Quick quotes', 'Specialty coverage'],
    rating: 4.1,
    bestFor: 'Telehealth-focused practices'
  },
  {
    id: 'lockton',
    name: 'Lockton Affinity (NBCC endorsed)',
    website: 'https://www.locktonaffinity.com/nbcc',
    typicalPremium: { min: 160, max: 350 },
    coverage: '1M/3M',
    coverageType: 'occurrence',
    features: ['NBCC member discounts', 'NCC specialty coverage', 'License defense'],
    rating: 4.4,
    bestFor: 'NCC holders (member discounts)'
  }
];

// @route   GET /api/users/insurance
// @desc    Get user's liability insurance info
// @access  Private
router.get('/insurance', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    const insurance = user.liabilityInsurance || {};
    const reminders = user.insuranceReminders || { enabled: true, reminderDays: 30 };
    
    // Calculate days until expiration
    let daysUntilExpiration = null;
    let status = 'none';
    
    if (insurance.expirationDate) {
      const expDate = new Date(insurance.expirationDate);
      const now = new Date();
      daysUntilExpiration = Math.ceil((expDate - now) / (1000 * 60 * 60 * 24));
      
      if (daysUntilExpiration < 0) {
        status = 'expired';
      } else if (daysUntilExpiration <= 30) {
        status = 'expiring_soon';
      } else if (daysUntilExpiration <= 60) {
        status = 'upcoming';
      } else {
        status = 'active';
      }
    }
    
    res.json({
      insurance,
      reminders,
      status,
      daysUntilExpiration
    });
    
  } catch (error) {
    console.error('Get insurance error:', error);
    res.status(500).json({ error: 'Failed to get insurance info' });
  }
});

// @route   PUT /api/users/insurance
// @desc    Update user's liability insurance info
// @access  Private
router.put('/insurance', protect, async (req, res) => {
  try {
    const {
      provider,
      policyNumber,
      coverageAmount,
      aggregateCoverage,
      annualPremium,
      effectiveDate,
      expirationDate,
      autoRenew,
      coverageType,
      tailCoverage,
      notes
    } = req.body;
    
    const user = await User.findById(req.user._id);
    
    // Initialize if not exists
    if (!user.liabilityInsurance) {
      user.liabilityInsurance = {};
    }
    
    // Update fields
    if (provider !== undefined) user.liabilityInsurance.provider = provider;
    if (policyNumber !== undefined) user.liabilityInsurance.policyNumber = policyNumber;
    if (coverageAmount !== undefined) user.liabilityInsurance.coverageAmount = coverageAmount;
    if (aggregateCoverage !== undefined) user.liabilityInsurance.aggregateCoverage = aggregateCoverage;
    if (annualPremium !== undefined) user.liabilityInsurance.annualPremium = annualPremium;
    if (effectiveDate !== undefined) user.liabilityInsurance.effectiveDate = effectiveDate;
    if (expirationDate !== undefined) user.liabilityInsurance.expirationDate = expirationDate;
    if (autoRenew !== undefined) user.liabilityInsurance.autoRenew = autoRenew;
    if (coverageType !== undefined) user.liabilityInsurance.coverageType = coverageType;
    if (tailCoverage !== undefined) user.liabilityInsurance.tailCoverage = tailCoverage;
    if (notes !== undefined) user.liabilityInsurance.notes = notes;
    
    await user.save();
    
    res.json({
      message: 'Insurance info updated',
      insurance: user.liabilityInsurance
    });
    
  } catch (error) {
    console.error('Update insurance error:', error);
    res.status(500).json({ error: 'Failed to update insurance info' });
  }
});

// @route   PUT /api/users/insurance/reminders
// @desc    Update insurance reminder preferences
// @access  Private
router.put('/insurance/reminders', protect, async (req, res) => {
  try {
    const { enabled, reminderDays } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (!user.insuranceReminders) {
      user.insuranceReminders = {};
    }
    
    if (enabled !== undefined) user.insuranceReminders.enabled = enabled;
    if (reminderDays !== undefined) user.insuranceReminders.reminderDays = reminderDays;
    
    await user.save();
    
    res.json({
      message: 'Insurance reminders updated',
      reminders: user.insuranceReminders
    });
    
  } catch (error) {
    console.error('Update insurance reminders error:', error);
    res.status(500).json({ error: 'Failed to update reminders' });
  }
});

// @route   GET /api/users/insurance/providers
// @desc    Get list of insurance providers with typical rates
// @access  Private
router.get('/insurance/providers', protect, async (req, res) => {
  try {
    res.json({ providers: insuranceProviders });
  } catch (error) {
    console.error('Get providers error:', error);
    res.status(500).json({ error: 'Failed to get providers' });
  }
});

// @route   GET /api/users/insurance/compare
// @desc    Compare user's current premium against market rates
// @access  Private
router.get('/insurance/compare', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const currentPremium = user.liabilityInsurance?.annualPremium;
    const currentProvider = user.liabilityInsurance?.provider;
    
    if (!currentPremium) {
      return res.json({
        hasCurrentPolicy: false,
        message: 'Add your current policy to see comparisons',
        providers: insuranceProviders
      });
    }
    
    // Calculate potential savings
    const comparisons = insuranceProviders.map(provider => {
      const avgPremium = (provider.typicalPremium.min + provider.typicalPremium.max) / 2;
      const potentialSavings = currentPremium - avgPremium;
      const savingsPercent = Math.round((potentialSavings / currentPremium) * 100);
      
      return {
        ...provider,
        avgPremium: Math.round(avgPremium),
        potentialSavings: Math.round(potentialSavings),
        savingsPercent,
        isCurrentProvider: currentProvider?.toLowerCase().includes(provider.name.toLowerCase().split(' ')[0])
      };
    }).sort((a, b) => b.potentialSavings - a.potentialSavings);
    
    // Find best savings
    const bestOption = comparisons.find(c => !c.isCurrentProvider && c.potentialSavings > 0);
    
    // Market average
    const marketAvg = Math.round(
      insuranceProviders.reduce((sum, p) => sum + (p.typicalPremium.min + p.typicalPremium.max) / 2, 0) / insuranceProviders.length
    );
    
    // Update last comparison date
    user.liabilityInsurance.lastComparisonDate = new Date();
    await user.save();
    
    res.json({
      hasCurrentPolicy: true,
      currentPremium,
      currentProvider,
      marketAverage: marketAvg,
      comparedToMarket: currentPremium > marketAvg ? 'above' : currentPremium < marketAvg ? 'below' : 'average',
      percentFromAverage: Math.round(((currentPremium - marketAvg) / marketAvg) * 100),
      comparisons,
      bestAlternative: bestOption || null,
      recommendation: bestOption && bestOption.potentialSavings > 50 
        ? `You could save ~$${bestOption.potentialSavings}/year by switching to ${bestOption.name}`
        : currentPremium <= marketAvg 
          ? 'Your current rate is competitive!'
          : 'Your rate is slightly above average. Consider shopping around at renewal.',
      lastCompared: new Date()
    });
    
  } catch (error) {
    console.error('Compare insurance error:', error);
    res.status(500).json({ error: 'Failed to compare rates' });
  }
});

// @route   POST /api/users/promo
// @desc    Apply a promo/discount code to user's active subscription
// @access  Private
router.post('/promo', protect, async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Payment system not configured' });
  }

  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Promo code is required' });
    }

    // Look up promotion code in Stripe
    const promoCodes = await stripe.promotionCodes.list({
      code: code.toUpperCase(),
      active: true,
      limit: 1
    });

    if (promoCodes.data.length === 0) {
      return res.status(404).json({ error: 'Promo code not found or expired' });
    }

    const promoCode = promoCodes.data[0];
    const coupon = promoCode.coupon;

    // Check if user has an active Stripe subscription
    const user = await User.findById(req.user._id);
    if (!user || !user.stripeSubscriptionId) {
      return res.status(400).json({ error: 'No active subscription found. Use this code when subscribing.' });
    }

    // Apply the coupon to the existing subscription
    await stripe.subscriptions.update(user.stripeSubscriptionId, {
      coupon: coupon.id
    });

    const discountDesc = coupon.percent_off
      ? `${coupon.percent_off}% off`
      : `$${(coupon.amount_off / 100).toFixed(2)} off`;

    res.json({
      message: `Promo code applied! You now get ${discountDesc} your subscription.`
    });
  } catch (error) {
    console.error('Apply promo code error:', error);
    if (error.type === 'StripeInvalidRequestError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to apply promo code' });
  }
});

// @route   GET /api/users/tool-access/:toolKey
// @desc    Check whether the current user has unlocked a specific clinical tool
// @access  Private
router.get('/tool-access/:toolKey', protect, async (req, res) => {
  try {
    const { toolKey } = req.params;
    const user = await User.findById(req.user._id).select('unlockedTools');

    const tool = user?.unlockedTools?.find(t => t.toolKey === toolKey);

    if (!tool) {
      return res.status(403).json({
        hasAccess: false,
        message: 'Tool not unlocked',
        toolKey
      });
    }

    if (tool.expiresAt && new Date(tool.expiresAt) < new Date()) {
      return res.status(403).json({
        hasAccess: false,
        expired: true,
        expiresAt: tool.expiresAt,
        message: 'Tool access has expired. Complete the course again to renew.',
        toolKey
      });
    }

    return res.json({
      hasAccess: true,
      toolKey,
      unlockedAt: tool.unlockedAt,
      expiresAt: tool.expiresAt
    });
  } catch (error) {
    console.error('Tool access check error:', error);
    res.status(500).json({ error: 'Failed to check tool access' });
  }
});

// @route   GET /api/users/unlocked-tools
// @desc    List all currently active unlocked tools for the user
// @access  Private
router.get('/unlocked-tools', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('unlockedTools');
    const now = new Date();

    const tools = (user?.unlockedTools || []).filter(
      t => !t.expiresAt || new Date(t.expiresAt) > now
    );

    res.json({ tools });
  } catch (error) {
    console.error('List unlocked tools error:', error);
    res.status(500).json({ error: 'Failed to list unlocked tools' });
  }
});

// ── POST /notifications/test ──
router.post('/notifications/test', protect, async (req, res) => {
  try {
    const { channel } = req.body;
    if (!['email', 'sms'].includes(channel)) {
      return res.status(400).json({ error: 'channel must be "email" or "sms"' });
    }
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (channel === 'email') {
      if (!user.email) return res.status(400).json({ error: 'No email on file' });
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { error: resendError } = await resend.emails.send({
        from: 'CounselorReady <noreply@counselorready.com>',
        to: user.email,
        subject: 'CounselorReady — Test Notification',
        html: `<p>Hi ${user.profile?.firstName || 'there'},</p>
               <p>This is a test notification from CounselorReady. If you received this, your email notifications are working.</p>
               <p>— The CounselorReady Team</p>`,
      });
      if (resendError) {
        console.error('[notifications/test] resend error:', resendError);
        return res.status(502).json({ error: resendError.message || 'Email send failed' });
      }
    } else {
      if (!user.profile?.phone) return res.status(400).json({ error: 'No phone on file' });
      const smsResult = await sendTestSMS(user.profile.phone);
      if (!smsResult?.success) {
        console.error('[notifications/test] sms error:', smsResult?.error);
        return res.status(502).json({ error: smsResult?.error || 'SMS send failed' });
      }
    }
    return res.json({ sent: true, channel });
  } catch (err) {
    console.error('[notifications/test] error:', err);
    return res.status(500).json({ error: 'Failed to send test notification' });
  }
});

// ── POST /data-export ──
router.post('/data-export', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.lastDataExportAt && (Date.now() - user.lastDataExportAt.getTime() < 24 * 60 * 60 * 1000)) {
      return res.status(429).json({ error: 'Data export already requested in the last 24 hours.' });
    }
    user.lastDataExportAt = new Date();
    await user.save();
    generateUserDataExport(user).catch(err => console.error('[data-export] generation failed:', err));
    return res.json({ requested: true, message: 'Export will be emailed shortly.' });
  } catch (err) {
    console.error('[data-export] error:', err);
    return res.status(500).json({ error: 'Failed to request data export' });
  }
});

// ── PUT /recovery-email ──
router.put('/recovery-email', protect, async (req, res) => {
  try {
    const { recoveryEmail } = req.body;
    if (!recoveryEmail) {
      await User.findByIdAndUpdate(req.user._id, {
        recoveryEmail: '',
        recoveryEmailVerified: false,
        recoveryEmailToken: null,
        recoveryEmailExpires: null,
      });
      return res.json({ cleared: true });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recoveryEmail)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }
    const user = await User.findById(req.user._id);
    if (recoveryEmail.toLowerCase() === user.email.toLowerCase()) {
      return res.status(400).json({ error: 'Recovery email must differ from primary email' });
    }
    const token = crypto.randomBytes(32).toString('hex');
    user.recoveryEmail         = recoveryEmail.toLowerCase();
    user.recoveryEmailVerified = false;
    user.recoveryEmailToken    = token;
    user.recoveryEmailExpires  = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();
    const baseUrl = process.env.PUBLIC_APP_URL || 'https://counselorready.com';
    const verifyUrl = `${baseUrl}/api/users/recovery-email/verify/${token}`;
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'CounselorReady <noreply@counselorready.com>',
      to: recoveryEmail,
      subject: 'Verify your CounselorReady recovery email',
      html: `<p>Confirm this address as your CounselorReady recovery email by clicking below:</p>
             <p><a href="${verifyUrl}">Verify recovery email</a></p>
             <p>If you did not request this, ignore this message. The link expires in 24 hours.</p>`,
    });
    return res.json({ pendingVerification: true });
  } catch (err) {
    console.error('[recovery-email] error:', err);
    return res.status(500).json({ error: 'Failed to update recovery email' });
  }
});

// ── GET /recovery-email/verify/:token ──
router.get('/recovery-email/verify/:token', async (req, res) => {
  try {
    const user = await User.findOne({
      recoveryEmailToken: req.params.token,
      recoveryEmailExpires: { $gt: new Date() },
    }).select('+recoveryEmailToken +recoveryEmailExpires');
    if (!user) {
      return res.status(400).send('<h1>Link expired or invalid</h1><p>Request a new verification from Settings.</p>');
    }
    user.recoveryEmailVerified = true;
    user.recoveryEmailToken    = null;
    user.recoveryEmailExpires  = null;
    await user.save();
    return res.send('<h1>Recovery email verified</h1><p>You can close this window.</p>');
  } catch (err) {
    console.error('[recovery-email verify] error:', err);
    return res.status(500).send('Server error');
  }
});

export default router;
