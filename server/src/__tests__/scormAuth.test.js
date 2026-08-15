/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * Tripwire: SCORM routes must be admin-gated.
 *
 * The import/export/preview SCORM routes create, export, and preview courses.
 * They must require an admin (requireAdmin), not just any logged-in user (protect).
 * This test reads the raw source of routes/scorm.js and FAILS if any
 * router.post/get/delete line whose path mentions import|export|preview lacks
 * requireAdmin — making a silent access-control regression impossible.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';

const SOURCE = readFileSync(new URL('../routes/scorm.js', import.meta.url), 'utf8');

// Match router.<method>(...) route registrations for import|export|preview.
const ROUTE_LINE = /router\.(post|get|delete)\s*\(\s*['"`][^'"`]*(import|export|preview)[^'"`]*['"`][^\n]*/gi;

describe('SCORM route access control', () => {
  const matches = SOURCE.match(ROUTE_LINE) || [];

  it('finds the import/export/preview route registrations', () => {
    // If this drops to 0, the route file was restructured — re-verify by hand.
    expect(matches.length).toBeGreaterThanOrEqual(3);
  });

  it('gates every import/export/preview route with requireAdmin', () => {
    const ungated = matches.filter((line) => !/\brequireAdmin\b/.test(line));
    expect(
      ungated,
      `These SCORM route registrations lack requireAdmin:\n${ungated.join('\n')}`
    ).toEqual([]);
  });

  it('imports requireAdmin from the auth middleware', () => {
    expect(SOURCE).toMatch(/import\s*\{[^}]*\brequireAdmin\b[^}]*\}\s*from\s*['"]\.\.\/middleware\/auth\.js['"]/);
  });
});
