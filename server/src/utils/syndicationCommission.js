/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 *
 * recordSyndicationCommission — call AFTER a successful course purchase. Determines
 * whether the sale was syndicated (a partner sold CR's course, or CR sold a partner's
 * course) and, if so, writes a CommissionLedger entry splitting DISTRIBUTOR vs OWNER.
 * No money is moved here; settlement is handled separately.
 *
 * Returns the ledger doc (or null if the sale was not syndicated).
 */
import Partner from '../models/Partner.js';
import CommissionLedger from '../models/CommissionLedger.js';

const round2 = n => Math.round(n * 100) / 100;

/**
 * @param {Object} p
 * @param {Object} p.course   InteractiveCourse (needs _id, title, partnerId)
 * @param {Object} p.buyer    User (needs _id, partnerId)
 * @param {Number} p.grossAmount  Amount paid (USD)
 * @param {String} p.saleId   Stripe session / payment-intent id
 */
export async function recordSyndicationCommission({ course, buyer, grossAmount, saleId, paymentIntentId }) {
  try {
    if (!course || !grossAmount || grossAmount <= 0) return null;

    const courseOwnerPartnerId = course.partnerId ? String(course.partnerId) : null;
    const buyerPartnerId = buyer?.partnerId ? String(buyer.partnerId) : null;

    let entry = null;

    // Case A: CR-owned course sold to a buyer who belongs to a partner that opted to import.
    //          Distributor = that partner (keeps the rate). Owner = platform.
    if (!courseOwnerPartnerId && buyerPartnerId) {
      const partner = await Partner.findById(buyerPartnerId).lean();
      if (partner?.syndication?.importPlatformCourses) {
        const rate = partner.syndication.distributorRate ?? 0.15;
        const distributorAmount = round2(grossAmount * rate);
        entry = {
          ownerType: 'platform', ownerPartnerId: null,
          distributorType: 'partner', distributorPartnerId: partner._id,
          distributorRate: rate, distributorAmount, ownerAmount: round2(grossAmount - distributorAmount),
          accountingCategory: 'advertising' // 15% paid to the partner for selling our course = ad spend
        };
      }
    }

    // Case B: Partner-owned course sold to a buyer NOT under that partner (e.g. a CR-audience
    //          buyer). Distributor = platform (keeps the rate). Owner = the course's partner.
    else if (courseOwnerPartnerId && courseOwnerPartnerId !== buyerPartnerId) {
      const ownerPartner = await Partner.findById(courseOwnerPartnerId).lean();
      if (ownerPartner?.syndication?.listInMarketplace) {
        const rate = ownerPartner.syndication.distributorRate ?? 0.15;
        const distributorAmount = round2(grossAmount * rate);
        entry = {
          ownerType: 'partner', ownerPartnerId: ownerPartner._id,
          distributorType: 'platform', distributorPartnerId: null,
          distributorRate: rate, distributorAmount, ownerAmount: round2(grossAmount - distributorAmount),
          accountingCategory: 'cogs' // 85% passed to the partner for their content = cost of goods
        };
      }
    }

    if (!entry) return null; // not a syndicated sale

    return await CommissionLedger.create({
      saleId,
      paymentIntentId,
      courseId: course._id,
      courseTitle: course.title,
      grossAmount,
      buyerUserId: buyer?._id,
      ...entry
    });
  } catch (err) {
    // Never let commission accounting break a purchase
    console.error('recordSyndicationCommission failed:', err.message);
    return null;
  }
}

/**
 * applyRefundToCommission — call on a refund or dispute. Reduces the matching ledger entry's
 * owed amounts to the un-refunded portion (proration), voids it on a full refund, and — if the
 * partner was already paid — flags `clawbackRequired` and accumulates `clawbackAmount` for the
 * difference. Returns the updated entry, or null if there was nothing to adjust.
 *
 * @param {String} paymentIntentId
 * @param {Number} refundedAmount  refunded gross this event (USD)
 * @param {Number} totalAmount     original charge total (USD); falls back to entry.grossAmount
 */
export async function applyRefundToCommission(paymentIntentId, refundedAmount, totalAmount) {
  try {
    if (!paymentIntentId) return null;
    const entry = await CommissionLedger.findOne({ paymentIntentId, status: { $ne: 'void' } });
    if (!entry) return null;

    const total = totalAmount || entry.grossAmount || 0;
    const ratio = total > 0 ? Math.min(1, (refundedAmount || 0) / total) : 1;
    if (ratio <= 0) return entry;

    const wasPaid = entry.status === 'paid';
    const partnerShare = (e) =>
      (e.distributorType === 'partner' ? (e.distributorAmount || 0) : 0) +
      (e.ownerType === 'partner' ? (e.ownerAmount || 0) : 0);
    const shareBefore = partnerShare(entry);

    const keep = 1 - ratio;
    entry.distributorAmount = round2(entry.distributorAmount * keep);
    entry.ownerAmount = round2(entry.ownerAmount * keep);
    entry.refundedAmount = round2((entry.refundedAmount || 0) + (refundedAmount || 0));

    if (ratio >= 0.999) { entry.status = 'void'; entry.voidedAt = new Date(); }

    const shareAfter = partnerShare(entry);
    if (wasPaid && shareAfter < shareBefore) {
      entry.clawbackRequired = true;
      entry.clawbackAmount = round2((entry.clawbackAmount || 0) + (shareBefore - shareAfter));
    }

    await entry.save();
    return entry;
  } catch (err) {
    console.error('applyRefundToCommission failed:', err.message);
    return null;
  }
}

/** Full reversal (e.g. a chargeback/dispute) — convenience wrapper. */
export async function voidSyndicationCommissionByPaymentIntent(paymentIntentId) {
  return applyRefundToCommission(paymentIntentId, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
}
