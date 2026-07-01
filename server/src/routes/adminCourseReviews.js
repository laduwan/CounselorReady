/**
 * adminCourseReviews.js — /api/admin/course-reviews
 * Admin queue for partner ACEP review requests.
 */
import express from 'express';
import Stripe from 'stripe';
import { Resend } from 'resend';
import { protect, requireAdmin } from '../middleware/auth.js';
import { Course as InteractiveCourse } from '../models/InteractiveCourse.js';
import Partner from '../models/Partner.js';
import { requiredWordsFor } from '../utils/courseWordCount.js';

const router = express.Router();
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const resend = new Resend(process.env.RESEND_API_KEY);

// Inline audit mirroring adminAudit.js — no auto-approve, admin owns the call
function auditCourseForReview(course) {
  const wc  = Number(course.wordCount || 0);
  const ce  = Number(course.ceuHours || course.ceHours || course.credits || 0);
  const floor = requiredWordsFor(ce);

  const refs = Array.isArray(course.sections)
    ? course.sections.flatMap(s => (s.blocks || []).filter(b => b.type === 'references')).length
    : 0;

  const fails = [];
  if (!ce || ce <= 0)      fails.push({ rule: 'R4-ceHours', detail: `ceuHours=${ce}` });
  if (!wc || wc <= 0)      fails.push({ rule: 'R1-wordCount-missing', detail: `wordCount=${wc}` });
  if (ce > 0 && wc > 0 && wc < floor)
    fails.push({ rule: 'R2-wordCount-below-floor', detail: `${wc} < ${ce}×6000=${floor}` });
  if (refs < 3)            fails.push({ rule: 'R3-references', detail: `references blocks=${refs} (min 3)` });

  return {
    _id:         course._id,
    title:       course.title,
    ceHours:     ce,
    wordCount:   wc,
    wordTarget:  floor,
    refCount:    refs,
    pass:        fails.length === 0,
    fails,
  };
}

// GET /api/admin/course-reviews?status=requested
router.get('/', protect, requireAdmin, async (req, res) => {
  try {
    const { status = 'requested' } = req.query;
    const query = { partnerId: { $exists: true, $ne: null } };
    if (status !== 'all') query.reviewStatus = status;

    const courses = await InteractiveCourse.find(query)
      .select('title ceuHours ceHours credits partnerId reviewStatus reviewFeeCents reviewPaidAt reviewAudit wordCount')
      .lean();

    const partnerIds = [...new Set(courses.map(c => String(c.partnerId)).filter(Boolean))];
    const partners   = await Partner.find({ _id: { $in: partnerIds } }).select('name').lean();
    const partnerMap = Object.fromEntries(partners.map(p => [String(p._id), p.name]));

    const rows = courses.map(c => {
      const audit = c.reviewAudit || auditCourseForReview(c);
      return {
        _id:           c._id,
        title:         c.title,
        partnerName:   partnerMap[String(c.partnerId)] || String(c.partnerId),
        ceHours:       c.ceuHours || c.ceHours || c.credits || 0,
        reviewStatus:  c.reviewStatus,
        reviewFeeCents: c.reviewFeeCents,
        reviewPaidAt:  c.reviewPaidAt,
        auditPass:     audit.pass,
        auditFails:    audit.fails,
      };
    });

    res.json({ data: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/course-reviews/:id/audit — re-run + return full report
router.get('/:id/audit', protect, requireAdmin, async (req, res) => {
  try {
    const course = await InteractiveCourse.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    const report = auditCourseForReview(course);
    // Cache the audit on the course
    course.reviewAudit = report;
    await course.save();
    res.json({ audit: report });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/course-reviews/:id/claim
router.post('/:id/claim', protect, requireAdmin, async (req, res) => {
  try {
    const course = await InteractiveCourse.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    if (course.reviewStatus !== 'requested') {
      return res.status(409).json({ error: `Status is ${course.reviewStatus}, not 'requested'` });
    }
    course.reviewStatus = 'in_review';
    course.reviewedBy   = req.user.email || String(req.user._id);
    await course.save();
    res.json({ reviewStatus: course.reviewStatus });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/course-reviews/:id/approve
router.post('/:id/approve', protect, requireAdmin, async (req, res) => {
  try {
    const course = await InteractiveCourse.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    course.reviewStatus   = 'approved';
    course.accredited     = true;
    course.reviewedAt     = new Date();
    course.reviewedBy     = req.user.email || String(req.user._id);
    course.approvingBody  = 'NBCC';
    course.approvalNumber = '7760';
    await course.save();

    // Notify partner admin
    const partner = course.partnerId
      ? await Partner.findById(course.partnerId).lean()
      : null;
    if (partner?.billing?.adminEmail) {
      await resend.emails.send({
        from: 'CounselorReady <noreply@counselorready.com>',
        to:   partner.billing.adminEmail,
        subject: `ACEP Review Approved — ${course.title}`,
        html: `<p>Your course <strong>${course.title}</strong> has been approved as NBCC/ACEP continuing education (Provider #7760). Learners will now receive CE credit certificates.</p>`,
      }).catch(() => null);
    }

    res.json({ reviewStatus: course.reviewStatus, accredited: course.accredited });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/course-reviews/:id/reject  body: { notes, refund? }
router.post('/:id/reject', protect, requireAdmin, async (req, res) => {
  try {
    const course = await InteractiveCourse.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const { notes, refund } = req.body;
    course.reviewStatus = 'rejected';
    course.accredited   = false;
    course.reviewNotes  = notes || null;
    course.reviewedAt   = new Date();
    course.reviewedBy   = req.user.email || String(req.user._id);
    await course.save();

    // Admin-discretion refund (non-refundable by default per §6.3)
    if (refund && stripe && course.reviewFeeCents > 0) {
      // Find the most recent payment intent for this course review via search
      // (We don't store the PI id, so we search by metadata)
      const sessions = await stripe.checkout.sessions.list({
        limit: 10,
        expand: ['data.payment_intent'],
      });
      const match = sessions.data.find(
        s => s.metadata?.type === 'course_review' && s.metadata?.courseId === String(course._id) && s.payment_status === 'paid'
      );
      if (match?.payment_intent) {
        const pi = typeof match.payment_intent === 'string' ? match.payment_intent : match.payment_intent.id;
        await stripe.refunds.create({ payment_intent: pi }).catch(() => null);
      }
    }

    // Notify partner admin
    const partner = course.partnerId
      ? await Partner.findById(course.partnerId).lean()
      : null;
    if (partner?.billing?.adminEmail) {
      await resend.emails.send({
        from: 'CounselorReady <noreply@counselorready.com>',
        to:   partner.billing.adminEmail,
        subject: `ACEP Review — Action Required: ${course.title}`,
        html: `<p>Your course <strong>${course.title}</strong> was not approved for NBCC/ACEP CE at this time.</p><p><strong>Reason:</strong> ${notes || 'See audit report.'}</p><p>You may correct the issues and re-submit for review.</p>`,
      }).catch(() => null);
    }

    res.json({ reviewStatus: course.reviewStatus });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
