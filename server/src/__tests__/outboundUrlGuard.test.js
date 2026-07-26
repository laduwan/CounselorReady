/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 */
import { describe, it, expect } from 'vitest';
import { assertSafeOutboundUrl } from '../utils/outboundUrlGuard.js';

describe('assertSafeOutboundUrl', () => {
  it('rejects loopback hostname (localhost)', async () => {
    await expect(assertSafeOutboundUrl('http://localhost')).rejects.toThrow();
  });

  it('rejects loopback IP (127.0.0.1)', async () => {
    await expect(assertSafeOutboundUrl('http://127.0.0.1')).rejects.toThrow();
  });

  it('rejects link-local cloud-metadata IP (169.254.169.254)', async () => {
    await expect(assertSafeOutboundUrl('http://169.254.169.254')).rejects.toThrow();
  });

  it('rejects private IP (10.0.0.1)', async () => {
    await expect(assertSafeOutboundUrl('http://10.0.0.1')).rejects.toThrow();
  });

  it('rejects a non-http(s) protocol (ftp)', async () => {
    await expect(assertSafeOutboundUrl('ftp://x')).rejects.toThrow();
  });

  it('accepts a public https URL (example.com)', async () => {
    await expect(assertSafeOutboundUrl('https://example.com')).resolves.toBeUndefined();
  });
});
