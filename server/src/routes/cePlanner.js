/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import express from 'express';
import UserCredential from '../models/UserCredential.js';
import Certificate from '../models/Certificate.js';
import CredentialTemplate from '../models/CredentialTemplate.js';
import { Course as InteractiveCourse, CourseProgress } from '../models/InteractiveCourse.js';
import UserCourseProgress from '../models/UserCourseProgress.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

// ── Generate personalized CE plan ──
router.get('/plan', async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user's active credentials
    const credentials = await UserCredential.find({ userId, status: { $ne: 'renewed' } });
    if (credentials.length === 0) {
      return res.json({
        plan: [],
        message: 'Add your credentials first to get a personalized CE plan.'
      });
    }

    // Auto-sync certificates into credentials before building the plan
    // This pulls data from both credentials page AND certificates page
    const certificates = await Certificate.find({
      userId,
      isRevoked: { $ne: true }
    });

    if (certificates.length > 0) {
      for (const credential of credentials) {
        let credentialUpdated = false;

        for (const cert of certificates) {
          const isExplicitlyLinked = cert.credentials && cert.credentials.some(credId =>
            credId.toString() === credential._id.toString()
          );
          const isPlatformCert = cert.source === 'platform';

          // Match uploaded certs by category to credential requirements
          const certCategory = (cert.category || 'General').toLowerCase().replace(/[-_]/g, ' ');
          const hasRequirements = credential.requirements && credential.requirements.length > 0;
          const matchesCategory = !hasRequirements || credential.requirements.some(req =>
            req.category.toLowerCase().replace(/[-_]/g, ' ') === certCategory
          ) || certCategory === 'general';

          // Apply explicitly linked, platform-generated, or category-matched certs
          if (!isExplicitlyLinked && !isPlatformCert && !matchesCategory) continue;

          // Skip if already logged (no duplicates)
          const alreadyLogged = credential.ceuLogs.some(log =>
            log.certificateId && log.certificateId.toString() === cert._id.toString()
          );
          if (alreadyLogged) continue;

          credential.ceuLogs.push({
            date: cert.completionDate,
            hours: cert.ceHours || 0,
            category: cert.category || 'General',
            source: isPlatformCert ? 'internal' : 'external',
            certificateId: cert._id,
            courseId: cert.courseId || null,
            description: cert.title,
            provider: cert.provider || 'CounselorReady'
          });
          credentialUpdated = true;
        }

        if (credentialUpdated) {
          credential.recalculateProgress();
          await credential.save();
        }
      }
    }

    // Ensure credentials with totalCEUsRequired but empty requirements
    // get a synthetic "General" requirement so the planner can suggest courses
    for (const cred of credentials) {
      if (cred.totalCEUsRequired > 0 && (!cred.requirements || cred.requirements.length === 0)) {
        cred.requirements = [{
          category: 'General',
          hoursRequired: cred.totalCEUsRequired,
          hoursCompleted: cred.totalCEUsCompleted || 0
        }];
      }
    }

    // Get available courses (include all matchable fields)
    const courses = await InteractiveCourse.find({ status: 'published' })
      .select('title slug ceHours categories tags ceuCategories nbccContentAreas contentAreas deliveryFormat description approvalBody');

    // Get user's completed courses (check both legacy and interactive progress)
    const [completedLegacy, completedInteractive] = await Promise.all([
      UserCourseProgress.find({ userId, status: 'completed' }),
      CourseProgress.find({ userId, status: { $in: ['completed', 'certified'] } })
    ]);
    const completedCourseIds = new Set([
      ...completedLegacy.map(p => p.courseId.toString()),
      ...completedInteractive.map(p => p.courseId.toString())
    ]);

    // Build plan per credential
    const plan = credentials.map(cred => {
      const remaining = cred.getRemainingHours();
      const daysLeft = cred.daysUntilExpiration;
      const totalRemaining = remaining.reduce((sum, r) => sum + r.remaining, 0);

      // Find recommended courses for each category gap
      const recommendations = [];
      for (const req of remaining) {
        if (req.remaining <= 0) continue;

        const categoryLower = req.category.toLowerCase().replace(/[-_]/g, ' ');

        // Category alias map: credential requirement → course signals
        const ALIASES = {
          'ethics': ['ethics', 'ethical', 'boundaries', 'professional identity'],
          'core': ['counseling theory', 'counseling practice', 'clinical', 'assessment', 'treatment'],
          'general': [], // matches everything
          'related': ['wellness', 'prevention', 'human development', 'social', 'cultural', 'career', 'group dynamics', 'research'],
          'supervision': ['supervision', 'supervisory', 'cpcs', 'clinical supervisor'],
          'telehealth': ['telehealth', 'telemental', 'telebehavioral', 'distance', 'technology'],
          'cultural diversity': ['cultural', 'multicultural', 'diversity', 'social justice', 'equity'],
          'substance abuse': ['addiction', 'substance', 'substance abuse', 'recovery'],
          'trauma': ['trauma', 'ptsd', 'crisis', 'resilience']
        };
        const aliases = ALIASES[categoryLower] || [categoryLower];

        const matchingCourses = courses.filter(c => {
          if (completedCourseIds.has(c._id.toString())) return false;

          // General matches everything
          if (categoryLower === 'general') return true;

          // Build all searchable text from course
          const courseCats = (c.categories || []).map(x => (x || '').toLowerCase());
          const courseTags = (c.tags || []).map(x => (x || '').toLowerCase());
          const ceuCats = (c.ceuCategories || []).map(x => (typeof x === 'object' ? x.category : x) || '').map(x => x.toLowerCase());
          const nbccAreas = (c.nbccContentAreas || c.contentAreas || []).map(x => (typeof x === 'string' ? x : x.name || '').toLowerCase());
          const title = (c.title || '').toLowerCase();
          const desc = (c.description || '').toLowerCase();

          const allSignals = [...courseCats, ...courseTags, ...ceuCats, ...nbccAreas, title, desc];
          const combined = allSignals.join(' ');

          // Check if any alias keyword appears in any course signal
          return aliases.some(alias => combined.includes(alias)) ||
            allSignals.some(s => s.includes(categoryLower) || categoryLower.includes(s));
        });

        // Sort: prefer courses with matching deliveryFormat for synchronous requirements
        const needsSynchronous = categoryLower.includes('ethics') && 
          (cred.state === 'GA' || cred.name?.includes('GA'));
        
        matchingCourses.sort((a, b) => {
          let scoreA = 0, scoreB = 0;
          if (needsSynchronous) {
            if ((a.deliveryFormat || 'async') === 'live') scoreA += 10;
            if ((a.deliveryFormat || 'async') === 'hybrid') scoreA += 5;
            if ((b.deliveryFormat || 'async') === 'live') scoreB += 10;
            if ((b.deliveryFormat || 'async') === 'hybrid') scoreB += 5;
          }
          // Prefer courses with explicit nbccContentAreas set
          if ((a.nbccContentAreas || []).length > 0) scoreA += 3;
          if ((b.nbccContentAreas || []).length > 0) scoreB += 3;
          // Prefer higher CE hour courses to fill gaps faster
          scoreA += Math.min(5, a.ceHours || 0);
          scoreB += Math.min(5, b.ceHours || 0);
          return scoreB - scoreA;
        });

        if (matchingCourses.length > 0) {
          recommendations.push({
            category: req.category,
            hoursNeeded: req.remaining,
            needsSynchronous: needsSynchronous || false,
            suggestedCourses: matchingCourses.slice(0, 3).map(c => ({
              id: c._id,
              title: c.title,
              slug: c.slug,
              ceHours: c.ceHours,
              deliveryFormat: c.deliveryFormat || 'async',
              category: (c.ceuCategories?.[0]?.category || c.categories?.[0]) || 'General'
            }))
          });
        } else {
          recommendations.push({
            category: req.category,
            hoursNeeded: req.remaining,
            suggestedCourses: [],
            note: `No matching courses found for ${req.category}. Check back as new courses are added.`
          });
        }
      }

      // Calculate urgency
      let urgency = 'on_track';
      if (daysLeft !== null) {
        if (daysLeft <= 0) urgency = 'expired';
        else if (daysLeft <= 30) urgency = 'critical';
        else if (daysLeft <= 90) urgency = 'urgent';
        else if (daysLeft <= 180) urgency = 'upcoming';
      }

      // Estimate weekly hours needed
      const weeksLeft = daysLeft ? Math.max(1, Math.floor(daysLeft / 7)) : null;
      const hoursPerWeek = weeksLeft && totalRemaining > 0 ? Math.ceil((totalRemaining / weeksLeft) * 10) / 10 : null;

      return {
        credentialId: cred._id,
        credentialName: cred.name,
        credentialType: cred.credentialType,
        code: cred.code,
        issuingBody: cred.issuingBody,
        licenseNumber: cred.licenseNumber,
        state: cred.state,
        expirationDate: cred.expirationDate,
        daysUntilExpiration: daysLeft,
        urgency,
        totalHoursRequired: cred.totalCEUsRequired,
        totalHoursCompleted: cred.totalCEUsCompleted,
        totalHoursRemaining: totalRemaining,
        suggestedHoursPerWeek: hoursPerWeek,
        categoryBreakdown: remaining,
        recommendations
      };
    });

    // Sort by urgency
    const urgencyOrder = { expired: 0, critical: 1, urgent: 2, upcoming: 3, on_track: 4 };
    plan.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]);

    // Overall summary
    const totalCertificateHours = certificates.reduce((sum, c) => sum + (c.ceHours || 0), 0);
    const summary = {
      totalCredentials: credentials.length,
      totalCertificates: certificates.length,
      totalCertificateHours,
      totalHoursRemaining: plan.reduce((sum, p) => sum + p.totalHoursRemaining, 0),
      nearestDeadline: plan.length > 0 ? plan[0].expirationDate : null,
      credentialsByUrgency: {
        expired: plan.filter(p => p.urgency === 'expired').length,
        critical: plan.filter(p => p.urgency === 'critical').length,
        urgent: plan.filter(p => p.urgency === 'urgent').length,
        upcoming: plan.filter(p => p.urgency === 'upcoming').length,
        onTrack: plan.filter(p => p.urgency === 'on_track').length
      }
    };

    res.json({ summary, plan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Get quick stats for dashboard widget ──
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user._id;
    const credentials = await UserCredential.find({ userId, status: { $ne: 'renewed' } });
    const certificates = await Certificate.find({ userId, isRevoked: { $ne: true } });

    const now = new Date();
    const stats = {
      totalCredentials: credentials.length,
      totalCertificates: certificates.length,
      totalHoursRemaining: 0,
      nearestDeadline: null,
      nearestCredentialName: null,
      expiringSoon: 0
    };

    for (const cred of credentials) {
      const remaining = Math.max(0, cred.totalCEUsRequired - cred.totalCEUsCompleted);
      stats.totalHoursRemaining += remaining;

      if (cred.expirationDate) {
        const days = Math.ceil((cred.expirationDate - now) / (1000 * 60 * 60 * 24));
        if (days > 0 && days <= 90) stats.expiringSoon++;
        if (!stats.nearestDeadline || cred.expirationDate < stats.nearestDeadline) {
          stats.nearestDeadline = cred.expirationDate;
          stats.nearestCredentialName = cred.name;
        }
      }
    }

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
