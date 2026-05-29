/**
 * API Versioning Middleware
 *
 * Rewrites /api/v1/* requests to /api/* so they hit existing route mounts.
 * This lets both /api/courses and /api/v1/courses work simultaneously.
 *
 * - Existing frontend pages keep using /api/ (no changes needed)
 * - New integrations and partners use /api/v1/
 * - When v2 is needed, mount v2-specific handlers separately
 */
export const apiVersioning = (req, res, next) => {
  if (req.path.startsWith('/api/v1/')) {
    req.url = req.url.replace('/api/v1/', '/api/');
  }
  next();
};
