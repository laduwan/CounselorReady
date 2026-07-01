/**
 * AI Course Builder — budget metering.
 *
 * Two buckets, partner-facing unit is always "course-hours":
 *   • FREE monthly allowance — a dollar COGS ceiling (cents) metered against ACTUAL Anthropic cost.
 *     Resets each billing period; does NOT roll over.
 *   • PURCHASED packs — counted in course-hours; consumed by the requested CE-hours of a generation.
 *     Roll over; do not expire.
 *
 * A single generation is paid entirely from ONE bucket: free first (while it can cover the request),
 * otherwise purchased hours. Failed generations are never charged.
 */
import { getAiBudgetCents } from './planLimits.js';

// Claude Sonnet 4 standard rates (USD per million tokens). Update if the builder model changes.
const INPUT_CENTS_PER_MTOK = 300;   // $3.00 / 1M input tokens
const OUTPUT_CENTS_PER_MTOK = 1500; // $15.00 / 1M output tokens

// Guardrails so one request can never run unbounded.
export const MAX_CE_HOURS_PER_GENERATION = 6;
export const MAX_GENERATION_CENTS = 1200; // $12 hard cap on a single generation's metered cost
const EST_CENTS_PER_CE_HOUR = 100;        // pre-check estimate (~$1/CE hour; tune from real usage)

/** Convert an Anthropic usage object ({ input_tokens, output_tokens }) to integer cents. */
export function costCentsFromUsage(usage = {}) {
  const inTok = usage.input_tokens || 0;
  const outTok = usage.output_tokens || 0;
  return Math.ceil((inTok / 1e6) * INPUT_CENTS_PER_MTOK + (outTok / 1e6) * OUTPUT_CENTS_PER_MTOK);
}

/** Conservative up-front estimate (cents) used to decide whether the free bucket can cover a request. */
export function estimateGenerationCents(ceHours = 1) {
  return Math.min(MAX_GENERATION_CENTS, Math.ceil(Math.max(1, ceHours) * EST_CENTS_PER_CE_HOUR));
}

/** Reset the monthly free allowance if the period rolled over. Mutates partner.aiUsage. */
export function ensurePeriod(partner) {
  if (!partner.aiUsage) partner.aiUsage = {};
  const now = new Date();
  if (!partner.aiUsage.periodResetAt || now >= partner.aiUsage.periodResetAt) {
    partner.aiUsage.freeUsedCents = 0;
    partner.aiUsage.periodResetAt = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  }
}

export function freeRemainingCents(partner) {
  const budget = getAiBudgetCents(partner.billing?.plan || 'free');
  return Math.max(0, budget - (partner.aiUsage?.freeUsedCents || 0));
}

export function purchasedHours(partner) {
  return Math.max(0, partner.aiUsage?.purchasedHours || 0);
}

/**
 * Decide whether (and from which bucket) a generation can start.
 * Returns { ok, bucket: 'free'|'purchased'|null, reason }.
 */
export function canStart(partner, ceHours = 1) {
  if (ceHours > MAX_CE_HOURS_PER_GENERATION) {
    return { ok: false, bucket: null, reason: `Generate at most ${MAX_CE_HOURS_PER_GENERATION} CE hours per request — split larger courses.` };
  }
  if (freeRemainingCents(partner) >= estimateGenerationCents(ceHours)) return { ok: true, bucket: 'free' };
  if (purchasedHours(partner) >= ceHours) return { ok: true, bucket: 'purchased' };
  return { ok: false, bucket: null, reason: 'Generation allowance exhausted. Buy a credit pack or wait for your monthly reset.' };
}

/** Charge a successful generation to the chosen bucket. Mutates partner.aiUsage; caller saves. */
export function chargeUsage(partner, bucket, actualCents, ceHours) {
  if (!partner.aiUsage) partner.aiUsage = {};
  if (bucket === 'free') {
    partner.aiUsage.freeUsedCents = (partner.aiUsage.freeUsedCents || 0) + actualCents;
  } else if (bucket === 'purchased') {
    partner.aiUsage.purchasedHours = Math.max(0, (partner.aiUsage.purchasedHours || 0) - ceHours);
  }
  partner.aiUsage.lifetimeCents = (partner.aiUsage.lifetimeCents || 0) + actualCents;
}

/** Add purchased course-hours from a credit pack. Mutates; caller saves. */
export function addPurchasedHours(partner, hours) {
  if (!partner.aiUsage) partner.aiUsage = {};
  partner.aiUsage.purchasedHours = (partner.aiUsage.purchasedHours || 0) + hours;
}

/** Snapshot for the partner UI / API responses (everything shown to partners as hours). */
export function budgetSummary(partner) {
  const freeCents = freeRemainingCents(partner);
  return {
    freeRemainingCents: freeCents,
    freeRemainingHoursApprox: Math.floor(freeCents / EST_CENTS_PER_CE_HOUR),
    purchasedHours: purchasedHours(partner),
    periodResetAt: partner.aiUsage?.periodResetAt || null
  };
}

// Credit packs (overage). hours = course-hours added to the purchased balance.
export const AI_CREDIT_PACKS = {
  small:  { name: '5 course-hours',  hours: 5,  priceUsd: 99 },
  medium: { name: '15 course-hours', hours: 15, priceUsd: 249 },
  large:  { name: '40 course-hours', hours: 40, priceUsd: 599 }
};
