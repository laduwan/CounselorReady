# Settings Backend — Installation Guide

Complete backend implementation for the expanded Settings page. **12 files. Deploy in order.**

---

## 1. Install dependencies

In `server/`:

```bash
npm install speakeasy qrcode useragent
```

Already-installed deps assumed: `mongoose`, `express`, `stripe`, `resend`, `bcryptjs`.

---

## 2. Apply schema patches

### `server/src/models/User.js`

Open the file and merge fields from `User-schema-patches.js` into your existing `userSchema`. Six groups of additions:

- `profile.pronouns`, `profile.npi`, `profile.specializations`, `profile.supervisor`
- `recoveryEmail`, `recoveryEmailVerified`, `recoveryEmailToken`, `recoveryEmailExpires`
- `twoFactorEnabled`, `twoFactorSecret`, `twoFactorBackupCodes`, `twoFactorEnabledAt`
- `notifications.marketingEmail`, `notifications.marketingSms`, `notifications.quietHoursEnabled/From/To`
- `hardshipPause.{monthsAvailable, monthsAccrued, lastUsed, nextEligible, currentlyPaused, pauseEndsAt, history}`
- `lastDataExportAt`

Use `select: false` on `twoFactorSecret`, `twoFactorBackupCodes`, `recoveryEmailToken`, `recoveryEmailExpires` so they don't leak into `/auth/me` responses.

### `server/src/models/Credential.js`

Add the `isPrelicensed` field plus three pre-hooks (`save`, `findOneAndUpdate`, `updateOne`) per `Credential-schema-patches.js`.

---

## 3. Drop in new files

| Source | Destination |
|---|---|
| `Session.js` | `server/src/models/Session.js` |
| `twoFactorService.js` | `server/src/services/twoFactorService.js` |
| `dataExportService.js` | `server/src/services/dataExportService.js` |
| `sessionTracking.js` | `server/src/middleware/sessionTracking.js` |
| `security.js` | `server/src/routes/security.js` |

---

## 4. Merge route additions

### `server/src/routes/users.js`

Add the new endpoints from `users-additions.js`:

- `POST /notifications/test` — test email/SMS
- `POST /data-export` — request JSON export
- `PUT  /recovery-email` — set + send verification
- `GET  /recovery-email/verify/:token` — verify link target

**Also expand the field allow-list** in your existing `PUT /profile` and `PUT /notifications` handlers per the comments in that file. Critical: profile must accept `pronouns`, `npi`, `specializations`, `supervisor`; notifications must accept `marketingEmail`, `marketingSms`, `quietHoursEnabled/From/To`.

### `server/src/routes/subscription.js`

Add the three endpoints from `subscription-additions.js`:

- `GET  /hardship-pause`
- `POST /hardship-pause`
- `POST /hardship-pause/resume`
- `GET  /invoices`

### `server/src/routes/referrals.js`

Add `GET /me` from `referrals-me-addition.js`. **Verify your Referral model field names** (`referrerId` vs `referredBy`) and adjust the query to match.

---

## 5. Register security routes in `index.js`

```js
import securityRoutes from './routes/security.js';
import { trackSession } from './middleware/sessionTracking.js';

// After requireAuth middleware, before routes that benefit from req.session:
app.use('/api', requireAuth, trackSession); // or scope per-route

// Register the security router
app.use('/api/security', securityRoutes);
```

The `trackSession` middleware should run AFTER your auth middleware so `req.user` is populated. It's non-blocking — failures don't break the request.

---

## 6. Run migration (one-time)

In Render shell:

```bash
node server/scripts/migrateSettingsBackend.cjs
```

This is idempotent — safe to re-run. It backfills:

1. `isPrelicensed` on existing credentials
2. New notification defaults on all users
3. `hardshipPause` initialization for VIPs (1 free month)
4. Profile/security field defaults
5. Referral codes for users without one

---

## 7. Verify each endpoint

After deploy, hit each endpoint with a real auth token:

```bash
# 2FA setup (returns QR + secret)
curl -X POST https://api.counselorready.com/api/security/2fa/setup \
  -H "Authorization: Bearer $TOKEN"

# List active sessions
curl https://api.counselorready.com/api/security/sessions \
  -H "Authorization: Bearer $TOKEN"

# Hardship pause status (VIP only)
curl https://api.counselorready.com/api/subscription/hardship-pause \
  -H "Authorization: Bearer $TOKEN"

# Invoices
curl https://api.counselorready.com/api/subscription/invoices \
  -H "Authorization: Bearer $TOKEN"

# Referral stats
curl https://api.counselorready.com/api/referrals/me \
  -H "Authorization: Bearer $TOKEN"

# Test notification
curl -X POST https://api.counselorready.com/api/users/notifications/test \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"channel":"email"}'
```

---

## Things to verify before going live

**Auth middleware path.** Every new file imports `requireAuth` from `../middleware/auth.js`. Adjust if your file is at `../middleware/requireAuth.js` or similar.

**Email service signature.** `users-additions.js` calls `sendEmail({ to, subject, html })`. Adjust if your `emailService.js` exposes a different shape.

**SMS service signature.** Calls `sendSms({ to, body })`. Confirm against your existing Twilio wrapper.

**Stripe pause behavior.** The hardship-pause uses `pause_collection: { behavior: 'keep_as_draft' }`. Test in Stripe test mode — different behaviors have different billing implications:
- `keep_as_draft` — invoices generated but not finalized; resume normally
- `mark_uncollectible` — invoices created and immediately marked unpaid
- `void` — no invoices generated during pause

`keep_as_draft` is safest for a 30-day hardship pause. Resume with empty string `''` (not null).

**Resume scheduling.** Pauses don't auto-resume in code right now — Stripe handles billing pause, but `currentlyPaused` stays `true` in your DB. Add a daily cron or use Stripe webhooks (`customer.subscription.updated`) to flip `currentlyPaused: false` and update `pauseEndsAt: null` when the pause ends. Otherwise the UI will show "currently paused" forever.

**`UserActivity` write failures from your memory file.** This is a known issue independent of these changes — won't be fixed by this migration.

**`twoFactorBackupCodes` storage.** This implementation stores them in plaintext for simplicity. **Hash with bcrypt before going to production** — the verify function will need to loop and `bcrypt.compare` each, but that's the right pattern. Same goes for `recoveryEmailToken` if you want extra paranoia (low priority since it expires in 24h).

**`UserActivity` audit log.** Consider logging these events for compliance:
- 2FA enabled/disabled
- Recovery email changed/verified
- Session revoked
- Data export requested
- Hardship pause used

Match your existing `UserActivity` shape — pass `userId` so you don't trip the silent-write bug noted in your memory.

---

## Frontend ↔ backend contract

Verify these endpoint shapes match what `settings.html` expects:

| Frontend call | Backend response |
|---|---|
| `GET /api/credentials` | array of `{name, code, licenseNumber, isPrelicensed, state, expirationDate, ...}` |
| `GET /api/security/sessions` | `{sessions: [{id, browser, os, device, ip, location, lastActive, current}]}` |
| `GET /api/subscription/hardship-pause` | `{monthsAvailable, lastUsed, nextEligible, ...}` |
| `GET /api/subscription/invoices` | `{invoices: [{date, description, amount, url}]}` |
| `GET /api/referrals/me` | `{code, referralsCount, rewards, ...}` |
| `POST /api/security/2fa/setup` | `{secret, qrCodeDataUrl}` |
| `PUT /api/users/recovery-email` | `{pendingVerification: true}` |

The frontend handles 4xx/5xx gracefully ("not yet available"), so partial backend deployment is safe.
