/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import express from 'express';
import { protect } from '../middleware/auth.js';
import Course from '../models/Course.js';
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
    const course = await Course.findById(courseId);
    const certificate = certificateId ? await Certificate.findById(certificateId) : null;

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (!course.ceuEligible || !course.ceuHours) {
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
      course,
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
        const course = await Course.findById(completion.courseId);
        const certificate = completion.certificateId 
          ? await Certificate.findById(completion.certificateId) 
          : null;

        if (!course || !course.ceuEligible) {
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
          course,
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
