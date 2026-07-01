import crypto from 'crypto';
import useragent from 'useragent';
import Session from '../models/Session.js';

export function hashToken(token) {
  return crypto.createHash('sha256').update(String(token)).digest('hex');
}

async function lookupLocation(ip) {
  // TODO: integrate ipinfo.io or MaxMind GeoLite2
  return '';
}

export async function trackSession(req, res, next) {
  try {
    if (!req.user || !req.user._id) return next();

    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (!token) return next();

    const tokenHash = hashToken(token);
    const ua = useragent.parse(req.headers['user-agent'] || '');
    const ip = (req.headers['x-forwarded-for'] || req.ip || '').split(',')[0].trim();

    const existing = await Session.findOne({ userId: req.user._id, tokenHash });

    if (existing) {
      Session.updateOne(
        { _id: existing._id },
        { lastActive: new Date(), ip }
      ).catch(err => console.error('[sessionTracking] update failed:', err));
      req.session = existing;
    } else {
      const location = await lookupLocation(ip);
      const newSession = await Session.create({
        userId:     req.user._id,
        tokenHash,
        browser:    ua.family || 'Unknown',
        os:         ua.os.family || 'Unknown',
        device:     ua.device.family || 'Unknown',
        ip,
        location,
        createdAt:  new Date(),
        lastActive: new Date(),
      });
      req.session = newSession;
    }
    next();
  } catch (err) {
    console.error('[sessionTracking] error:', err);
    next();
  }
}

export async function isTokenRevoked(token, userId) {
  if (!token || !userId) return true;
  const tokenHash = hashToken(token);
  const session = await Session.findOne({ userId, tokenHash });
  if (!session) return false;
  return session.revoked === true;
}
