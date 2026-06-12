# Course Marketplace ("marketing additive") — what shipped & what's gated

Reciprocal syndication where **the distributor keeps 15%, the course owner keeps 85%**:
- A partner opts in → CounselorReady's published catalog appears in their branded library; on
  those sales the **partner** keeps 15%.
- Vice versa → the partner's published courses can be listed in the CounselorReady marketplace;
  on those sales **CounselorReady** keeps 15%.

Presented as an opt-in "marketing additive" — surfaced on the partner dashboard (promo card +
Marketplace tile) and on a dedicated `partner-marketplace.html` page. Opt-in only; reversible
any time; existing enrollments unaffected.

## Shipped in this batch (no money moves — all reversible)

- **`Partner.syndication`** schema: `importPlatformCourses`, `listInMarketplace`,
  `distributorRate` (default `0.15`), `agreedAt`, `agreedByUserId`.
- **Endpoints** (`/api/partners/...`): `GET/PUT /my/syndication` (opt-in state + save) and
  `GET /my/library` (own courses + opted-in CR catalog, with per-sale cut shown).
- **`partner-marketplace.html`** — two-toggle opt-in page with live opportunity counts and
  earnings framing; `/partner/marketplace` + `/partner-marketplace` redirects.
- **Dashboard** — "marketing additive" promo card + Marketplace quick-action tile.
- **`CommissionLedger`** model + **`recordSyndicationCommission()`** helper — computes and
  records the 15/85 split per syndicated sale. Accounting only; moves no money.

## The webhook hook (now wired)

The ledger records nothing until it's called from the purchase flow. The correct, minimal hook
is in `server/src/routes/payments.js`, inside the `checkout.session.completed` webhook case
(~line 660), right after course access is granted:

```js
import { recordSyndicationCommission } from '../utils/syndicationCommission.js';
// ... inside case 'checkout.session.completed', after access is granted:
const course = await InteractiveCourse.findById(session.metadata?.courseId);
const buyer  = await User.findById(session.metadata?.userId);
if (course && buyer) {
  await recordSyndicationCommission({
    course, buyer,
    grossAmount: (session.amount_total || 0) / 100,
    saleId: session.id
  });
}
```

It's wrapped to never throw, so it can't break a purchase. I left it for you/CC to add after
confirming the metadata field names on your checkout sessions and the payout decision below.

## ⚠️ Decision that gates real money: how partners get paid

There's **no Stripe Connect** in the repo today — payments land in the platform account, and
there's no rail to send a partner their share. Two ways forward:

1. **Ledger + periodic manual payout (ship fast).** Accrue commissions in `CommissionLedger`
   (already built), show partners a balance, and pay out on a schedule (Stripe payout, ACH, or
   account credit like the CareCredits pattern). Lowest lift; you control timing; needs a payout
   admin view + reconciliation.
2. **Stripe Connect (automated splits).** Onboard each partner as a Connect account and split at
   checkout via `application_fee_amount` / `transfer_data`. Cleanest long-term, but it's a real
   build: partner KYC onboarding, Connect account state, and changes to the checkout flow.

Recommendation: ship **(1)** now — the ledger is already in place — and layer in Connect later if
volume justifies it.

## Legal / ops to confirm before turning on payouts

- A short **revenue-share / reseller addendum** to the partner agreement (the opt-in stamps
  `agreedAt`, but the terms text should live in your agreement).
- **1099 / tax reporting** for partner payouts above thresholds.
- **NBCC/ACEP**: syndicated courses still carry your ACEP #7760 and compliance — confirm how
  co-branded delivery is represented on certificates for partner-distributed CR courses.
- Confirm the **15% direction** matches your intent (distributor keeps 15%); the rate is a single
  field (`distributorRate`) if you want to tune it per partner.

## Apply

Everything from all three turns (partner pages, SEO, marketplace — 124 files) is in
`counselorready-batch.patch` (supersedes the earlier `seo-partner-batch.patch`). Verified to apply
cleanly to current `main`.

```bash
git checkout -b feat/partner-portal-seo-marketplace
git apply counselorready-batch.patch
cd client && npm run prebuild   # regenerate sitemap + course pages
cd .. && git add -A && git commit -m "Partner portal pages, SEO, and course marketplace opt-in"
```

---

# Update — Earnings, reconciliation & expense labeling

Added on top of the above:

- **Outgoing 15% is labeled `advertising`.** Every `CommissionLedger` entry now carries an
  `accountingCategory`: when we own the course and a partner sold it, the 15% we pay them is
  tagged `advertising` (marketing/distribution spend). When a partner owns the course and we
  sold it, the 85% we pass through is tagged `cogs`. The admin screen totals these separately so
  the advertising expense is a clean line you can export to your books.

- **Partner earnings page** (`partner-earnings.html`, `GET /my/earnings`): pending balance,
  lifetime earned, and a per-sale history. Linked from the dashboard (Earnings tile).

- **Admin reconciliation** (`admin-payouts.html`, linked from Partner Management):
  - `GET /admin/commissions` — per-partner amounts owed, plus totals for **advertising expense**,
    **content cost**, and **total pending owed**.
  - `POST /admin/commissions/settle` — marks a partner's pending entries paid and records the
    method. **Account credit** is the cheap default: when the partner has a Stripe customer on
    file, it applies a Stripe customer balance credit toward their next CounselorReady invoice
    (this is the no-Connect, most-economical path). `external`/`cash` just record the settlement
    for manual ACH/check handling.

**Now wired:** `recordSyndicationCommission()` is called inside the `checkout.session.completed` webhook (`payments.js`), in the `course_purchase` branch right after the purchase is recorded — fire-and-forget, guarded so it can never affect the purchase. It reads the live session metadata (`{ type:'course_purchase', courseId, userId, slug }`) and `session.amount_total`, looks up the course + buyer, and writes the split to the ledger (or nothing, if the sale isn't syndicated). The earnings and admin payout screens populate automatically from there.

Note: Direction A (a partner's user buys a CounselorReady course from their branded library) is fully live. Direction B (a CounselorReady-audience buyer purchases a partner's course) records correctly too, but only fires once partner courses are actually surfaced in the main CR catalog — that listing surface in `courses.html` is the remaining piece if/when you want Direction B selling.

---

# Update — Direction B catalog surface + test verification

## Direction B is now live (partner courses in the main catalog)

- **Latent bug fixed:** `partnerId` was never declared on the course schema, so under strict mode
  Mongoose was silently dropping it on save — partner-created courses lost their owner. Now
  declared (`InteractiveCourse.js`), so partner ownership persists and tenant scoping works.
- **Catalog scoping (`GET /api/interactive-courses`):** previously returned *every* published
  course (partner courses would have leaked into the main catalog). Now returns platform courses
  **plus** partner courses only from partners who opted into `listInMarketplace` — non-listed
  partner courses are excluded. Listed partner courses carry a `marketplacePartner` brand tag.
- **`courses.html`:** marketplace partner courses show an "Offered by {partner}" badge in the
  partner's brand color. Purchasing one flows through the existing `/purchase-course` →
  webhook → `recordSyndicationCommission()`, which books the `cogs` split (we keep 15%).

## End-to-end test (Stripe test mode) before going live

1. **Test keys:** confirm the server is using Stripe test keys and that a test webhook endpoint
   for `checkout.session.completed` points at `/api/payments/webhook` with the matching
   `STRIPE_WEBHOOK_SECRET`.
2. **Opt a test partner in:** as a partner admin, toggle on the marketplace at
   `/partner/marketplace` (Direction A: import our catalog; and/or publish a partner course and
   enable "list in marketplace" for Direction B).
3. **Direction A:** as a user under that partner, buy a CounselorReady course (use Stripe test
   card `4242 4242 4242 4242`). After the webhook fires, check:
   - server logs for `action: 'syndication_commission_recorded'` with `category: 'advertising'`;
   - `/partner/earnings` shows a pending balance (their 15%);
   - `/admin-payouts.html` shows the partner with pending owed + the advertising-expense total.
4. **Direction B:** as a CounselorReady-audience user, buy a listed partner course; expect a
   `cogs` ledger entry, the partner owed 85%, and our 15% retained.
5. **Settle:** on `/admin-payouts.html`, settle the partner via **account credit**; if they have a
   Stripe customer on file, confirm a balance credit was applied (test mode) and the entries flip
   to `paid`.
6. **Edge cases to eyeball:** a non-syndicated sale (platform user buying a platform course) writes
   **no** ledger entry; a partner buying their own course writes none; refunds are not yet reflected
   in the ledger (add a `charge.refunded` handler later if you want clawbacks).

If a ledger row doesn't appear, 95% of the time it's the webhook: verify the endpoint is reachable,
the signing secret matches, and `session.metadata.type === 'course_purchase'` on the event.

---

# Update — Refund clawbacks + partnerId backfill

## Refund handling (live)

- Ledger gains `paymentIntentId` (set from `session.payment_intent` at sale time), plus
  `voidedAt` and `clawbackRequired`.
- New `charge.refunded` webhook case calls `voidSyndicationCommissionByPaymentIntent()`:
  - matches the ledger entry by payment intent and sets `status: 'void'`;
  - if it was still `pending`, it simply never pays out;
  - if it was already `paid`, it sets `clawbackRequired: true` (the partner was settled and the
    amount needs recovering).
- The admin payouts screen now shows a **clawback alert** with the total to recover and the
  count of already-paid refunded sales. Recover it from the partner's next settlement.
- Scope note: this handles full refunds cleanly. Partial refunds void the whole entry — if you
  expect partial course refunds, add proration later.

## partnerId backfill (`server/src/scripts/backfillPartnerCourseIds.js`)

Because `partnerId` was being dropped on save, older partner-created courses have no stored owner.
There's no direct link to recover, so the script infers it from the `author` the create handler
stamped (the partner user's name/email), matching it to a User who has a `partnerId`.

```bash
# from ~/project/src/server on Render
node src/scripts/backfillPartnerCourseIds.js          # dry-run report (safe)
APPLY=1 node src/scripts/backfillPartnerCourseIds.js  # write partnerId for clear matches
```

Dry-run by default. It only assigns ownership for clear author→partner-user matches; everything
else stays `null` (= platform-owned, correct for the CounselorReady catalog). If you have no
partner courses yet, it reports zero candidates and changes nothing.

---

# Update — Chargebacks + partial-refund proration

- **Partial refunds prorate.** `charge.refunded` now reduces the commission to the un-refunded
  portion (instead of voiding the whole entry); a full refund still voids it. New ledger fields:
  `refundedAmount`, `clawbackAmount`.
- **Chargebacks handled.** New `charge.dispute.created` case treats a dispute as a full reversal —
  voids the commission and flags a clawback if already paid.
- **Clawback total is exact.** The admin payouts screen now sums `clawbackAmount` (the precise
  partner-owed recovery), covering both full voids and partial-refund clawbacks on still-`paid`
  entries.

---

# Update — Agreement version recorded on acceptance (clickwrap)

- `server/src/config/marketplaceAgreement.js` holds the authoritative current agreement **version**
  + effective date + URL. Bump it when the terms change.
- Enabling a marketplace program now **requires accepting the current version**. `PUT /my/syndication`
  returns `409 AGREEMENT_ACCEPTANCE_REQUIRED` unless the request carries the current `acceptedVersion`;
  the server only honors its own current version (never a client-supplied older one).
- Each acceptance appends an immutable **clickwrap audit record** to `partner.syndication.acceptances`:
  version, timestamp, accepting user (id + email), IP, user-agent, and which programs were enabled.
- `GET /my/syndication` returns `agreement: { currentVersion, accepted, acceptedVersion, acceptedAt,
  reacceptanceRequired }`. Bump the version and partners with a stale acceptance get a
  "terms updated — please re-accept" banner and must re-accept to change settings.
- The marketplace page shows the version, a "Read the agreement" link, an "I have read and agree to
  the Partner Marketplace Agreement vX" checkbox required to enable, and the accepted-on status.

---

# Update — Partner is emailed a copy on acceptance

- When a partner accepts the agreement (the clickwrap in `PUT /my/syndication`), the platform now
  emails them a copy automatically: `server/src/services/partnerAgreementEmail.js` sends a branded
  confirmation via Resend with the **acceptance record** (version, timestamp, accepting user, IP,
  programs enabled) and **attaches the agreement PDF**.
- The versioned PDF lives at `server/src/assets/legal/partner-marketplace-agreement-v{version}.pdf`
  (v1.0 bundled). When you bump the agreement version, drop in the matching PDF; if it's missing the
  email still sends with a link to the published agreement (graceful fallback).
- Send is fire-and-forget — a mail hiccup never blocks the opt-in from saving.
- Partners can re-request their copy any time: `POST /my/agreement/resend`, surfaced as an
  "Email me a copy" link on the marketplace page once they've accepted.
- Requires `RESEND_API_KEY` (already used by other CounselorReady email). No new env needed.

---

# Update — Filed copy of every signed agreement

- Every **signing** (a partner accepting the agreement) now blind-copies a filing address so
  CounselorReady keeps a copy of each executed agreement with its acceptance record + PDF.
- Address is `AGREEMENT_ARCHIVE_EMAIL` (defaults to `legal@counselorready.com`). Set the env var to
  change it.
- BCC fires on signing events only — partner "Email me a copy" re-requests are NOT archived, so the
  filing inbox stays a clean one-per-signing record.

---

# Update — Personalized partner address (vanity subdomain)

- Every partner can set a branded address on the primary domain, e.g. `acme.counselorready.com`,
  on **any plan**. Stored in `branding.subdomain`, kept separate from the internal `slug` so changing
  the public address never breaks internal references; falls back to the slug-based address when unset.
- `detectPartner` resolves a subdomain host by matching `branding.subdomain` first, then `slug`.
- `PUT /my/subdomain` validates (3–40 chars, `[a-z0-9-]`, no leading/trailing hyphen), blocks a
  reserved list (www, api, admin, app, …), and enforces uniqueness against every partner's slug and
  subdomain. Empty value clears it.
- The branding page now has a "Your CounselorReady Address" section with the `{label}.counselorready.com`
  input, availability/error feedback, and a live link. The full **custom domain** (their own domain via
  CNAME) remains the Professional+ upgrade.
- DNS note: serving `*.counselorready.com` requires a wildcard DNS record + TLS for the subdomains
  pointing at the app (the app already routes them; this is hosting/DNS config, not code).
