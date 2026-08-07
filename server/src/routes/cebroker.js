/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import express from 'express';
import { protect } from '../middleware/auth.js';
import Course from '../models/Course.js';
import { Course as InteractiveCourse } from '../models/InteractiveCourse.js';
import User from '../models/User.js';
import Certificate from '../models/Certificate.js';
import {
  CEBrokerClient,
  reportCECompletion,
  getSupportedStates,
  stateUsesCEBroker,
  getStateBoardInfo
} from '../utils/cebroker.js';

const router = express.Router();

// Dual-lookup — same pattern as certificates.js. The legacy `courses`
// collection is empty in production, so this fallback is what makes
// reporting work for real (interactive) courses at all.
async function findCourseByEitherModel(courseId) {
  const legacy = await Course.findById(courseId);
  if (legacy) return { course: legacy, fromLegacy: true };
  const interactive = await InteractiveCourse.findById(courseId);
  if (interactive) return { course: interactive, fromLegacy: false };
  return null;
}

// Legacy Course carries an explicit ceuEligible flag; InteractiveCourse has
// no such field — every InteractiveCourse requires ceHours > 0, which is the
// equivalent "this is CE content" signal.
function resolveEligibility(course, fromLegacy) {
  const ceuHours = fromLegacy ? (course.ceuHours || 0) : (course.ceuHours ?? course.ceHours ?? 0);
  const eligible = fromLegacy ? !!course.ceuEligible : ceuHours > 0;
  return { ceuHours, eligible };
}

// reportCECompletion (utils/cebroker.js) reads course.ceuHours, ceuCategories,
// and ceuApprovalNumber — all legacy field names. Untouched here; instead this
// builds a normalized shim so it gets correct data regardless of which model
// the course actually came from.
function toReportableCourse(course, fromLegacy, ceuHours) {
  if (fromLegacy) return course;
  return {
    _id: course._id,
    title: course.title,
    ceuHours,
    ceuCategories: course.categories?.length
      ? [{ category: course.categories[0], hours: ceuHours }]
      : [],
    ceuApprovalNumber: course.acepNumber || '7760'
  };
}

// @route   GET /api/cebroker/states
// @desc    Get list of states that use CE Broker
// @access  Public
router.get('/states', (req, res) => {
  const states = getSupportedStates();
  res.json({ states });
});

// @route   GET /api/cebroker/check/:state
// @desc    Check if a state uses CE Broker
// @access  Public
router.get('/check/:state', (req, res) => {
  const state = req.params.state.toUpperCase();
  const uses = stateUsesCEBroker(state);
  const info = getStateBoardInfo(state);
  
  res.json({ 
    state,
    usesCEBroker: uses,
    boardInfo: info
  });
});

// @route   POST /api/cebroker/report
// @desc    Report a CE completion to CE Broker
// @access  Private
router.post('/report', protect, async (req, res) => {
  try {
    const { courseId, certificateId } = req.body;

    const user = await User.findById(req.user._id);
    const resolved = await findCourseByEitherModel(courseId);
    const certificate = certificateId ? await Certificate.findById(certificateId) : null;

    if (!resolved) {
      return res.status(404).json({ error: 'Course not found' });
    }
    const { course, fromLegacy } = resolved;
    const { ceuHours, eligible } = resolveEligibility(course, fromLegacy);

    if (!eligible || !ceuHours) {
      return res.status(400).json({ error: 'Course is not CE eligible' });
    }

    // Check if user has license info
    if (!user.licenseNumber || !user.licenseState) {
      return res.status(400).json({ 
        error: 'License information required',
        message: 'Please update your profile with your license number and state'
      });
    }

    // Check if state uses CE Broker
    if (!stateUsesCEBroker(user.licenseState)) {
      return res.json({
        success: false,
        message: `${user.licenseState} does not use CE Broker. Manual reporting may be required.`,
        manualReporting: true
      });
    }

    // Generate certificate number if not provided
    const certNumber = certificate?.certificateNumber || 
      `CR-${course._id.toString().slice(-6)}-${user._id.toString().slice(-6)}-${Date.now()}`;

    // Report to CE Broker
    const result = await reportCECompletion(
      user,
      toReportableCourse(course, fromLegacy, ceuHours),
      certificate?.issuedAt || new Date(),
      certNumber
    );

    // Update certificate with CE Broker status
    if (certificate) {
      await Certificate.findByIdAndUpdate(certificate._id, {
        $set: {
          ceBrokerStatus: result.success ? 'reported' : 'failed',
          ceBrokerConfirmation: result.confirmationNumber || null,
          ceBrokerReportedAt: result.success ? new Date() : null
        }
      });
    }

    res.json(result);

  } catch (error) {
    console.error('CE Broker report error:', error);
    res.status(500).json({ error: 'Failed to report completion' });
  }
});

// @route   POST /api/cebroker/batch-report
// @desc    Report multiple CE completions
// @access  Private
router.post('/batch-report', protect, async (req, res) => {
  try {
    const { completions } = req.body; // Array of { courseId, certificateId }
    const results = [];

    for (const completion of completions) {
      try {
        const user = await User.findById(req.user._id);
        const resolved = await findCourseByEitherModel(completion.courseId);
        const certificate = completion.certificateId
          ? await Certificate.findById(completion.certificateId)
          : null;

        if (!resolved) {
          results.push({
            courseId: completion.courseId,
            success: false,
            error: 'Course not found or not CE eligible'
          });
          continue;
        }
        const { course, fromLegacy } = resolved;
        const { ceuHours, eligible } = resolveEligibility(course, fromLegacy);
        if (!eligible) {
          results.push({
            courseId: completion.courseId,
            success: false,
            error: 'Course not found or not CE eligible'
          });
          continue;
        }

        const certNumber = certificate?.certificateNumber ||
          `CR-${course._id.toString().slice(-6)}-${Date.now()}`;

        const result = await reportCECompletion(
          user,
          toReportableCourse(course, fromLegacy, ceuHours),
          certificate?.issuedAt || new Date(),
          certNumber
        );

        results.push({
          courseId: completion.courseId,
          ...result
        });

      } catch (err) {
        results.push({
          courseId: completion.courseId,
          success: false,
          error: err.message
        });
      }
    }

    res.json({ results });

  } catch (error) {
    console.error('CE Broker batch report error:', error);
    res.status(500).json({ error: 'Batch report failed' });
  }
});

// @route   GET /api/cebroker/status/:certificateId
// @desc    Get CE Broker reporting status for a certificate
// @access  Private
router.get('/status/:certificateId', protect, async (req, res) => {
  try {
    const certificate = await Certificate.findOne({
      _id: req.params.certificateId,
      userId: req.user._id
    });

    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    res.json({
      certificateId: certificate._id,
      status: certificate.ceBrokerStatus || 'not_reported',
      confirmationNumber: certificate.ceBrokerConfirmation || null,
      reportedAt: certificate.ceBrokerReportedAt || null
    });

  } catch (error) {
    console.error('CE Broker status error:', error);
    res.status(500).json({ error: 'Failed to get status' });
  }
});

// @route   POST /api/cebroker/verify-license
// @desc    Verify a license with CE Broker
// @access  Private
router.post('/verify-license', protect, async (req, res) => {
  try {
    const { state, licenseNumber } = req.body;

    if (!process.env.CE_BROKER_API_KEY) {
      return res.json({
        verified: false,
        message: 'CE Broker API not configured',
        simulated: true
      });
    }

    const client = new CEBrokerClient(
      process.env.CE_BROKER_API_KEY,
      process.env.CE_BROKER_PROVIDER_ID,
      process.env.CE_BROKER_SANDBOX === 'true'
    );

    const result = await client.verifyLicense(state, licenseNumber);
    
    // Update user's license info if verified
    if (result.verified) {
      await User.findByIdAndUpdate(req.user._id, {
        $set: {
          licenseNumber,
          licenseState: state,
          licenseVerified: true,
          licenseVerifiedAt: new Date()
        }
      });
    }

    res.json(result);

  } catch (error) {
    console.error('License verification error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// @route   GET /api/cebroker/config
// @desc    Get CE Broker configuration status
// @access  Private
router.get('/config', protect, (req, res) => {
  const configured = !!(process.env.CE_BROKER_API_KEY && process.env.CE_BROKER_PROVIDER_ID);
  const sandbox = process.env.CE_BROKER_SANDBOX === 'true';
  
  res.json({
    configured,
    sandbox,
    providerId: configured ? process.env.CE_BROKER_PROVIDER_ID : null,
    supportedStates: getSupportedStates().map(s => s.code)
  });
});

export default router;
