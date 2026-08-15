/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 */
/**
 * Guards the useragent -> ua-parser-js swap in middleware/sessionTracking.js.
 * A Chrome UA must still produce a session with the SAME stored field names
 * (browser / os / device), populated as strings.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

const created = [];
vi.mock('../models/Session.js', () => ({
  default: {
    findOne: vi.fn().mockResolvedValue(null),
    create: vi.fn(async (doc) => { created.push(doc); return { ...doc, _id: 'fake-id' }; }),
    updateOne: vi.fn().mockResolvedValue({}),
  },
}));

import { trackSession } from '../middleware/sessionTracking.js';

const CHROME_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

describe('sessionTracking UA parse (ua-parser-js)', () => {
  beforeEach(() => { created.length = 0; });

  it('a Chrome UA yields a session with the same shape (browser/os/device)', async () => {
    const req = {
      user: { _id: 'user-1' },
      headers: { authorization: 'Bearer test-token', 'user-agent': CHROME_UA },
      ip: '203.0.113.7',
    };
    let nextCalled = false;
    await trackSession(req, {}, () => { nextCalled = true; });

    expect(nextCalled).toBe(true);
    expect(created).toHaveLength(1);

    const doc = created[0];
    // Exact stored field names must be preserved across the parser swap.
    expect(doc).toHaveProperty('browser');
    expect(doc).toHaveProperty('os');
    expect(doc).toHaveProperty('device');

    expect(doc.browser).toBe('Chrome');
    expect(typeof doc.os).toBe('string');
    expect(doc.os.length).toBeGreaterThan(0);
    expect(typeof doc.device).toBe('string');
    expect(doc.device.length).toBeGreaterThan(0);
  });
});
