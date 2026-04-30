import express from 'express';
import User from '../models/User.js';
import Session from '../models/Session.js';
import { protect } from '../middleware/auth.js';
import {
  generate2FASetup,
  verify2FACode,
  generateBackupCodes,
  hashBackupCodes,
} from '../services/twoFactorService.js';
import { hashToken } from '../middleware/sessionTracking.js';

const router = express.Router();

router.post('/2fa/setup', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('+twoFactorSecret email twoFactorEnabled');
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.twoFactorEnabled) {
      return res.status(400).json({ error: '2FA is already enabled. Disable it first to re-set up.' });
    }

    const setup = await generate2FASetup(user.email);

    user.twoFactorSecret = setup.secret;
    await user.save();

    return res.json({
      secret:        setup.secret,
      qrCodeDataUrl: setup.qrCodeDataUrl,
    });
  } catch (err) {
    console.error('[2fa/setup] error:', err);
    return res.status(500).json({ error: 'Failed to generate 2FA setup' });
  }
});

router.post('/2fa/verify', protect, async (req, res) => {
  try {
    const { code } = req.body;
    if (!/^\d{6}$/.test(String(code || ''))) {
      return res.status(400).json({ error: 'Code must be 6 digits' });
    }

    const user = await User.findById(req.user._id).select('+twoFactorSecret +twoFactorBackupCodes');
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!user.twoFactorSecret) {
      return res.status(400).json({ error: 'Run /2fa/setup first' });
    }

    const valid = verify2FACode(user.twoFactorSecret, code);
    if (!valid) return res.status(400).json({ error: 'Invalid code' });

    const plaintextBackupCodes = generateBackupCodes();
    const hashedBackupCodes = await hashBackupCodes(plaintextBackupCodes);
    user.twoFactorEnabled     = true;
    user.twoFactorEnabledAt   = new Date();
    user.twoFactorBackupCodes = hashedBackupCodes;
    await user.save();

    // Return PLAINTEXT codes once — user saves them now or never sees them again
    return res.json({
      enabled: true,
      backupCodes: plaintextBackupCodes,
    });
  } catch (err) {
    console.error('[2fa/verify] error:', err);
    return res.status(500).json({ error: 'Failed to verify 2FA code' });
  }
});

router.post('/2fa/disable', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.twoFactorEnabled     = false;
    user.twoFactorSecret      = null;
    user.twoFactorBackupCodes = [];
    user.twoFactorEnabledAt   = null;
    await user.save();

    return res.json({ enabled: false });
  } catch (err) {
    console.error('[2fa/disable] error:', err);
    return res.status(500).json({ error: 'Failed to disable 2FA' });
  }
});

router.get('/sessions', protect, async (req, res) => {
  try {
    const sessions = await Session.findActiveByUser(req.user._id);

    const authHeader = req.headers.authorization || '';
    const currentToken = authHeader.replace(/^Bearer\s+/i, '').trim();
    const currentHash = currentToken ? hashToken(currentToken) : null;

    const result = sessions.map(s => ({
      id:         s._id.toString(),
      browser:    s.browser,
      os:         s.os,
      device:     s.device,
      ip:         s.ip,
      location:   s.location,
      lastActive: s.lastActive,
      createdAt:  s.createdAt,
      current:    currentHash && s.tokenHash === currentHash,
    }));

    return res.json({ sessions: result });
  } catch (err) {
    console.error('[sessions] error:', err);
    return res.status(500).json({ error: 'Failed to load sessions' });
  }
});

router.delete('/sessions', protect, async (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    const currentToken = authHeader.replace(/^Bearer\s+/i, '').trim();
    const currentHash = currentToken ? hashToken(currentToken) : null;

    const result = await Session.revokeAllExcept(req.user._id, currentHash);
    return res.json({ revoked: result.modifiedCount || 0 });
  } catch (err) {
    console.error('[sessions delete all] error:', err);
    return res.status(500).json({ error: 'Failed to revoke sessions' });
  }
});

router.delete('/sessions/:id', protect, async (req, res) => {
  try {
    const session = await Session.revoke(req.params.id, req.user._id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    return res.json({ revoked: true });
  } catch (err) {
    console.error('[sessions delete one] error:', err);
    return res.status(500).json({ error: 'Failed to revoke session' });
  }
});

export default router;
