# Security Hardening — SSRF Guard, Access-Code Limiter, Cert-Verify Route, Report-Only CSP

**Date:** 2026-07-26
**PR:** [laduwan/CounselorReady#748](https://github.com/laduwan/CounselorReady/pull/748)
**Scope:** Four additive hardening fixes. 5 code/config files changed (`+136 / −1`), plus this summary. CSP is report-only (enforces nothing).

---

## 1. SSRF guard — `server/src/utils/outboundUrlGuard.js` (new) + `server/src/routes/liveSessions.js`

**Problem:** `POST /api/live-sessions/:id/fetch-and-load` fetches admin-supplied URLs server-side. Without validation, a URL like `http://169.254.169.254/…` (cloud metadata) or `http://127.0.0.1:…` could be used for SSRF.

**Fix:** `assertSafeOutboundUrl(url)`:
- rejects any protocol other than `http:` / `https:`;
- `dns.promises.lookup(host, { all: true })` and rejects if **any** resolved address is loopback (`127/8`, `::1`), private (`10/8`, `172.16/12`, `192.168/16`), link-local (`169.254/16`, `fe80::/10`), IPv6 ULA (`fc00::/7`), or `0/8`;
- throws a descriptive `Error` on rejection.

Called before **both** `fetch()` calls in `/fetch-and-load` (explicit-items path and URLs path), **inside** the existing per-item `try/catch`, so a blocked URL is pushed to `errors[]` and never crashes the request.

**Test — `server/src/__tests__/outboundUrlGuard.test.js` (new):** rejects `http://localhost`, `http://127.0.0.1`, `http://169.254.169.254`, `http://10.0.0.1`, `ftp://x`; accepts `https://example.com`. 6/6 pass.

## 2. Access-code brute-force limiter — `server/src/routes/liveSessions.js`

**Problem:** `GET /code/:accessCode` is public and access codes are short/grindable; only the global 300/15m limiter applied.

**Fix:** a dedicated `express-rate-limit` instance (`windowMs` 15m, `max` 10, `standardHeaders: true`) applied **only** to that route (matching the `books.js` limiter style). A code miss still returns the existing plain `404` — no hint text added.

## 3. Cert verify URL 404 — `client/public/_redirects`

**Problem:** Certificates print `counselorready.com/verify/<code>`, but `_redirects` only routed bare `/verify`, so `/verify/<code>` fell through to the 404 catch-all.

**Fix:** added `/verify/*   /verify.html   200` immediately after the `/verify` rule (before the catch-all).

**How `verify.html` already gets the code:** it reads **both** a `?code=` query param **and** the path segment — `urlParams.get('code') || window.location.pathname.split('/verify/')[1]` — then pre-fills `#codeInput` and **auto-submits**. Since path parsing + auto-submit already exist and the `200` rewrite preserves the browser URL, **`verify.html` needed no change** and is not in the diff (the protected file stays untouched).

## 4. CSP report-only — `client/public/_headers`

**Fix:** added `Content-Security-Policy-Report-Only: …` to the global `/*` scope. Report-Only only **logs** violations to the console — it enforces nothing.

> ⚠️ **Flagged for owner:** `_headers` **already ships an enforcing `Content-Security-Policy`** (line 8) that is **broader** than this report-only policy (it also allows `'unsafe-eval'`, PostHog, Google Tag Manager / Analytics, DoubleClick, `googleadservices`, `cdn.jsdelivr.net`, plus `object-src 'none'` / `base-uri 'self'`). The task assumed no CSP existed. Per "additive only," the enforcing CSP was left untouched and the report-only header added alongside it. The eventual "convert to enforcing" task should **reconcile the two policies**, not assume a greenfield. No enforcing CSP was added or modified.

---

## Verification

**Gates:**
```
GATE 1  assertSafeOutboundUrl present at both fetch-and-load fetches (liveSessions.js:1830, 1884) + import (32)
GATE 2  max: 10 near /code route (accessCodeLimiter, line 41; applied line 198)
GATE 3  grep -c "verify/*" client/public/_redirects → 1
GATE 4  grep -c "Report-Only" client/public/_headers → 1   (enforcing CSP count still 1, unchanged)
node --check outboundUrlGuard.js / liveSessions.js / outboundUrlGuard.test.js → all OK
```

**`cd server && npm test` (baseline-aware):**
```
Test Files  4 failed | 7 passed (11)
     Tests  1 failed | 68 passed (69)
```
- New **outboundUrlGuard suite PASSES (6/6)** — exactly +6 passing / +1 file vs. baseline.
- The 4 failing files (`contentGating`, `payments`, `quotaEnforcement`, `gateLogic`) and the 1 failing test are **pre-existing** — proven by running the identical suite against pristine `main`: `4 failed | 6 passed (10)` / `1 failed | 62 passed (63)`. None relate to these changes.

## Safety-preamble compliance
- Branched off `main`; single PR (#748).
- Client changes are only `_redirects` and `_headers`; `verify.html` not touched (already handles path parsing).
- No protected file in the diff; `interactiveCourseRoutes.js` untouched.
