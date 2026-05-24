/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */

/**
 * Google Calendar OAuth & Sync Routes
 */
import express from 'express';
import User from '../models/User.js';
import UserCredential from '../models/UserCredential.js';
import { protect } from '../middleware/auth.js';
import {
  getAuthURL,
  handleCallback,
  syncAllToCalendar,
  syncCredentialToCalendar,
  disconnectGoogleCalendar
} from '../services/googleCalendarService.js';

const router = express.Router();

// @route   GET /api/google-calendar/oauth/connect
// @desc    Redirect to Google OAuth consent screen
// @access  Private
router.get('/oauth/connect', protect, (req, res) => {
  try {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return res.status(503).json({ error: 'Google Calendar integration is not configured' });
    }
    const url = getAuthURL(req.user._id);
    res.redirect(url);
  } catch (error) {
    console.error('Google Calendar auth error:', error);
    res.status(500).json({ error: 'Failed to initiate Google Calendar connection' });
  }
});

// @route   GET /api/google-calendar/oauth/callback
// @desc    Handle Google OAuth callback, save tokens, redirect to settings
// @access  Public (state param contains userId)
router.get('/oauth/callback', async (req, res) => {
  try {
    const { code, state: userId } = req.query;

    if (!code || !userId) {
      return res.redirect('/settings.html#calendar&error=missing_params');
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.redirect('/settings.html#calendar&error=user_not_found');
    }

    await handleCallback(code, user);

    res.redirect('/settings.html#calendar&gcal=connected');
  } catch (error) {
    console.error('Google Calendar callback error:', error);
    res.redirect('/settings.html#calendar&error=auth_failed');
  }
});

// @route   POST /api/google-calendar/sync
// @desc    Sync all credentials + insurance to Google Calendar
// @access  Private
router.post('/sync', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.googleCalendar?.connected) {
      return res.status(400).json({ error: 'Google Calendar not connected' });
    }

    const credentials = await UserCredential.find({ userId: req.user._id });
    const results = await syncAllToCalendar(user, credentials);

    res.json({
      message: 'Calendar synced successfully',
      ...results,
      lastSyncAt: user.googleCalendar.lastSyncAt
    });
  } catch (error) {
    console.error('Google Calendar sync error:', error);
    res.status(500).json({ error: 'Failed to sync calendar' });
  }
});

// @route   POST /api/google-calendar/sync/:credId
// @desc    Sync a single credential to Google Calendar
// @access  Private
router.post('/sync/:credId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.googleCalendar?.connected) {
      return res.status(400).json({ error: 'Google Calendar not connected' });
    }

    const credential = await UserCredential.findOne({
      _id: req.params.credId,
      userId: req.user._id
    });

    if (!credential) {
      return res.status(404).json({ error: 'Credential not found' });
    }

    if (!credential.expirationDate) {
      return res.status(400).json({ error: 'No expiration date set for this credential' });
    }

    await syncCredentialToCalendar(user, credential);

    res.json({ message: 'Credential synced to Google Calendar' });
  } catch (error) {
    console.error('Google Calendar credential sync error:', error);
    res.status(500).json({ error: 'Failed to sync credential' });
  }
});

// @route   DELETE /api/google-calendar/disconnect
// @desc    Disconnect Google Calendar, revoke tokens
// @access  Private
router.delete('/disconnect', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    await disconnectGoogleCalendar(user);

    res.json({ message: 'Google Calendar disconnected' });
  } catch (error) {
    console.error('Google Calendar disconnect error:', error);
    res.status(500).json({ error: 'Failed to disconnect Google Calendar' });
  }
});

// @route   GET /api/google-calendar/status
// @desc    Get Google Calendar connection status
// @access  Private
router.get('/status', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const gcal = user.googleCalendar || {};

    res.json({
      connected: gcal.connected || false,
      syncEnabled: gcal.syncEnabled || false,
      lastSyncAt: gcal.lastSyncAt || null,
      eventCount: gcal.eventIds?.length || 0
    });
  } catch (error) {
    console.error('Google Calendar status error:', error);
    res.status(500).json({ error: 'Failed to get calendar status' });
  }
});

export default router;
