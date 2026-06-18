/**
 * Partner feature gating middleware.
 * Blocks access to CR-proprietary features for partner users
 * unless the partner org has paid for the specific add-on.
 * Admin users bypass all gates automatically.
 */
import Partner from '../models/Partner.js';

// Cache partner addons for 5 minutes to avoid hammering DB
const addonCache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

async function getPartnerAddons(partnerId) {
  const key = String(partnerId);
  const cached = addonCache.get(key);
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data;

  const partner = await Partner.findById(partnerId).select('premiumAddons').lean();
  const data = partner?.premiumAddons || {};
  addonCache.set(key, { data, ts: Date.now() });
  return data;
}

/**
 * Middleware factory. Usage: requireAddon('certTracking')
 * - Admin users: always pass through
 * - Non-partner users (direct CR subscribers): always pass through
 * - Partner users: blocked unless addon is enabled
 */
export function requireAddon(addonKey) {
  return async (req, res, next) => {
    // Admins bypass
    if (req.user?.role === 'admin') return next();
    // Non-partner users (direct CR subscribers) bypass
    if (!req.user?.partnerId) return next();

    try {
      const addons = await getPartnerAddons(req.user.partnerId);
      if (addons[addonKey]?.enabled) return next();

      return res.status(403).json({
        error: 'Feature not available',
        code: 'ADDON_REQUIRED',
        addon: addonKey,
        message: 'This feature requires a premium add-on. Contact your organization administrator.',
        upgradeUrl: '/partner-billing.html#addons'
      });
    } catch (err) {
      console.error('partnerFeatureGate error:', err.message);
      return next(); // fail-open so we don't break direct subscribers
    }
  };
}

export async function getPartnerFeatureFlags(partnerId) {
  if (!partnerId) {
    return {
      certTracking: true,
      credentialManagement: true,
      complianceTracking: true,
      clinicalTools: true,
      isPartnerUser: false
    };
  }

  const addons = await getPartnerAddons(partnerId);
  return {
    certTracking: !!addons.certTracking?.enabled,
    credentialManagement: !!addons.credentialManagement?.enabled,
    complianceTracking: !!addons.complianceTracking?.enabled,
    clinicalTools: !!addons.clinicalTools?.enabled,
    isPartnerUser: true
  };
}

export function bustAddonCache(partnerId) {
  addonCache.delete(String(partnerId));
}
