/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 */

/**
 * SSRF guard for server-side outbound fetches of user-supplied URLs.
 *
 * assertSafeOutboundUrl(url) throws a descriptive Error unless the URL is
 * http/https AND every DNS-resolved address for its hostname is a public,
 * routable address. This blocks requests aimed at loopback, private RFC-1918
 * ranges, link-local (incl. the cloud metadata endpoint 169.254.169.254),
 * and IPv6 loopback / unique-local addresses.
 *
 * Resolving with { all: true } and rejecting if ANY address is unsafe closes
 * the DNS-rebinding gap where a hostname returns both a public and a private
 * record.
 */
import dns from 'dns';
import net from 'net';

// True if an already-resolved numeric IP (v4 or v6) is loopback, private,
// link-local, or otherwise not a public routable address.
function isBlockedAddress(address) {
  if (net.isIPv6(address)) {
    const a = address.toLowerCase();
    if (a === '::1') return true;                       // IPv6 loopback
    if (a === '::' ) return true;                       // unspecified
    if (a.startsWith('fe80')) return true;              // link-local fe80::/10
    if (a.startsWith('fc') || a.startsWith('fd')) return true; // unique-local fc00::/7 (ULA)
    // IPv4-mapped IPv6 (::ffff:a.b.c.d) — re-check the embedded IPv4.
    const mapped = a.match(/(?:::ffff:)(\d+\.\d+\.\d+\.\d+)$/);
    if (mapped) return isBlockedAddress(mapped[1]);
    return false;
  }

  const parts = address.split('.').map(Number);
  if (parts.length !== 4 || parts.some(n => Number.isNaN(n))) return true; // unparseable → block
  const [a, b] = parts;
  if (a === 127) return true;                    // loopback 127.0.0.0/8
  if (a === 10) return true;                     // private 10.0.0.0/8
  if (a === 172 && b >= 16 && b <= 31) return true; // private 172.16.0.0/12
  if (a === 192 && b === 168) return true;       // private 192.168.0.0/16
  if (a === 169 && b === 254) return true;       // link-local 169.254.0.0/16 (cloud metadata)
  if (a === 0) return true;                       // "this" network 0.0.0.0/8
  return false;
}

/**
 * @param {string} url
 * @throws {Error} if the URL is not http/https or resolves to a blocked address.
 */
export async function assertSafeOutboundUrl(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(`Blocked outbound URL: "${url}" is not a valid URL`);
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error(`Blocked outbound URL: protocol "${parsed.protocol}" not allowed (only http/https)`);
  }

  const hostname = parsed.hostname;
  let resolved;
  try {
    resolved = await dns.promises.lookup(hostname, { all: true });
  } catch {
    throw new Error(`Blocked outbound URL: DNS lookup failed for host "${hostname}"`);
  }

  if (!resolved.length) {
    throw new Error(`Blocked outbound URL: host "${hostname}" did not resolve`);
  }

  for (const { address } of resolved) {
    if (isBlockedAddress(address)) {
      throw new Error(
        `Blocked outbound URL: host "${hostname}" resolves to a private/loopback/link-local address (${address})`
      );
    }
  }
}

export default assertSafeOutboundUrl;
