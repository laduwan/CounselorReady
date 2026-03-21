import express from 'express';
import mongoose from 'mongoose';
import { protect } from '../middleware/auth.js';
import UserCredential from '../models/UserCredential.js';
import Certificate from '../models/Certificate.js';
import { Course } from '../models/InteractiveCourse.js';

const router = express.Router();

// GET /api/ce-planner/plan
// Returns personalized CE plan with gap analysis and course recommendations
router.get('/plan', protect, async (req, res) => {
  try {
    // 1. Fetch user's credentials with requirements + ceuLogs
    const credentials = await UserCredential.find({ userId: req.user._id })
      .sort({ expirationDate: 1 });

    if (!credentials.length) {
      return res.json({
        message: 'Add your credentials first to get a personalized CE plan.',
        plan: [],
        summary: {
          totalCredentials: 0,
          totalCertificates: 0,
          totalCertificateHours: 0,
          totalHoursRemaining: 0,
          credentialsByUrgency: { critical: 0, urgent: 0, onTrack: 0 }
        }
      });
    }

    // 2. Fetch user's certificates (to count external CE logged)
    const certificates = await Certificate.find({ userId: req.user._id });
    const totalCertificateHours = certificates.reduce((sum, c) => sum + (c.ceHours || 0), 0);

    // 3. Fetch published catalog courses for recommendations
    const catalogCourses = await Course.find(
      { status: 'published' },
      'title slug ceHours ceuCategories categories nbccContentAreas contentAreas description deliveryFormat'
    ).lean();

    // 4. Build plan per credential
    const now = new Date();
    const urgencyCounts = { critical: 0, urgent: 0, onTrack: 0 };
    let totalHoursRemaining = 0;

    const plan = credentials.map(cred => {
      // Update status calculations
      if (cred.updateStatus) cred.updateStatus();

      const daysUntilExpiration = cred.expirationDate
        ? Math.ceil((new Date(cred.expirationDate) - now) / (1000 * 60 * 60 * 24))
        : null;

      const totalReq = cred.totalCEUsRequired || 0;
      const totalDone = cred.totalCEUsCompleted || 0;
      const remaining = Math.max(0, totalReq - totalDone);
      totalHoursRemaining += remaining;

      // Determine urgency
      let urgency = 'on_track';
      if (daysUntilExpiration !== null) {
        if (daysUntilExpiration <= 0) urgency = 'critical';
        else if (daysUntilExpiration <= 90 && remaining > 0) urgency = 'critical';
        else if (daysUntilExpiration <= 180 && remaining > 0) urgency = 'urgent';
      }
      if (remaining <= 0) urgency = 'on_track';
      urgencyCounts[urgency]++;

      // Suggested pace
      let suggestedHoursPerWeek = null;
      if (remaining > 0 && daysUntilExpiration > 0) {
        const weeksLeft = daysUntilExpiration / 7;
        suggestedHoursPerWeek = weeksLeft > 0 ? Math.round(remaining / weeksLeft * 10) / 10 : null;
      }

      // Category breakdown
      const categoryBreakdown = (cred.requirements || []).map(r => ({
        category: r.category,
        required: r.hoursRequired || 0,
        completed: r.hoursCompleted || 0,
        remaining: Math.max(0, (r.hoursRequired || 0) - (r.hoursCompleted || 0))
      }));

      // Build recommendations from gaps
      const recommendations = [];
      const gaps = categoryBreakdown.filter(c => c.remaining > 0);

      gaps.forEach(gap => {
        const gapKey = gap.category.toLowerCase();

        // Find matching catalog courses
        const matches = catalogCourses.filter(course => {
          const courseCats = (course.ceuCategories || [])
            .map(c => (typeof c === 'object' ? c.category : c) || '')
            .map(s => s.toLowerCase());
          const courseAreas = (course.nbccContentAreas || course.contentAreas || [])
            .map(a => (typeof a === 'string' ? a : a.name || '').toLowerCase());
          const title = (course.title || '').toLowerCase();
          const allCats = [...courseCats, ...courseAreas];

          return allCats.some(c => c.includes(gapKey) || gapKey.includes(c)) ||
            (gapKey.includes('ethic') && title.includes('ethic')) ||
            (gapKey.includes('supervision') && title.includes('supervis')) ||
            (gapKey.includes('telehealth') && (title.includes('telemental') || title.includes('telehealth')));
        });

        const suggestedCourses = matches.slice(0, 3).map(c => ({
          slug: c.slug,
          title: c.title,
          ceHours: c.ceHours || 1,
          deliveryFormat: c.deliveryFormat || 'async'
        }));

        recommendations.push({
          category: gap.category,
          hoursNeeded: gap.remaining,
          suggestedCourses,
          note: suggestedCourses.length === 0
            ? `No matching courses found for "${gap.category}" — check external CE providers.`
            : null
        });
      });

      return {
        credentialId: cred._id,
        credentialName: cred.name,
        credentialType: cred.credentialType,
        state: cred.state,
        issuingBody: cred.issuingBody,
        licenseNumber: cred.licenseNumber,
        expirationDate: cred.expirationDate,
        daysUntilExpiration,
        totalHoursRequired: totalReq,
        totalHoursCompleted: totalDone,
        hoursRemaining: remaining,
        urgency,
        suggestedHoursPerWeek,
        categoryBreakdown,
        recommendations,
        recentCEActivity: (cred.ceuLogs || []).slice(-5).reverse().map(log => ({
          date: log.date,
          description: log.description,
          provider: log.provider,
          hours: log.hours,
          category: log.category,
          source: log.source
        }))
      };
    });

    // Sort: critical first, then urgent, then on_track
    const urgencyOrder = { critical: 0, urgent: 1, on_track: 2 };
    plan.sort((a, b) => (urgencyOrder[a.urgency] || 2) - (urgencyOrder[b.urgency] || 2));

    res.json({
      summary: {
        totalCredentials: credentials.length,
        totalCertificates: certificates.length,
        totalCertificateHours,
        totalHoursRemaining,
        credentialsByUrgency: urgencyCounts
      },
      plan
    });

  } catch (error) {
    console.error('CE Planner error:', error);
    res.status(500).json({ error: 'Failed to generate CE plan' });
  }
});

export default router;
