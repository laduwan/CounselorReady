/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// /server/src/routes/books.js — public Books store + private watermarked delivery
import { Router } from 'express';
import mongoose from 'mongoose';
import Stripe from 'stripe';
import rateLimit from 'express-rate-limit';
import Book from '../models/Book.js';
import BookOrder, { generateOrderNumber } from '../models/BookOrder.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { buildWatermarkedCopy, canDownload } from '../services/bookSecurityService.js';
import { logActivity, ACTIVITY_TYPES } from '../services/activityTrackingService.js';
import logger from '../utils/logger.js';

const router = Router();

// Initialize Stripe (same init line as payments.js — not imported from it)
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

const CLIENT_URL = process.env.CLIENT_URL || 'https://counselorready.com';

// Rate limit downloads: max 10 requests / 15 min / user.
const downloadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => (req.user?._id ? req.user._id.toString() : req.ip),
  message: { error: 'Too many download requests — please wait a few minutes and try again.' }
});

const fullName = (user) =>
  `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user?.email || 'Student';

// ── GET /  — PUBLIC catalog ─────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const books = await Book.find({ status: 'published' }).sort({ order: 1, publishedAt: -1 });
    res.json(books.map(b => b.toPublicJSON())); // never leak assetKey
  } catch (error) {
    logger.error({ err: error }, 'Books catalog fetch failed');
    res.status(500).json({ error: 'Failed to load books' });
  }
});

// ── GET /library/mine  — protect (must precede '/:slug') ────────────────
router.get('/library/mine', protect, async (req, res) => {
  try {
    const orders = await BookOrder.find({ userId: req.user._id, status: 'paid' })
      .sort({ createdAt: -1 })
      .populate('bookId', 'title slug coverUrl downloadLimit downloadWindowDays');

    const library = orders.map(o => {
      const book = o.bookId && typeof o.bookId === 'object' ? o.bookId : null;
      const limit = (book && book.downloadLimit) || 5;
      const gate = book ? canDownload(o, book) : { allowed: false, reason: 'Book unavailable' };
      return {
        orderId: o._id,
        orderNumber: o.orderNumber,
        bookId: book ? book._id : o.bookId,
        title: book ? book.title : o.bookTitle,
        slug: book ? book.slug : undefined,
        coverUrl: book ? book.coverUrl : undefined,
        downloadCount: o.downloadCount || 0,
        downloadLimit: limit,
        downloadsRemaining: Math.max(0, limit - (o.downloadCount || 0)),
        canDownload: gate.allowed,
        reason: gate.reason
      };
    });

    res.json(library);
  } catch (error) {
    logger.error({ err: error }, 'Library fetch failed');
    res.status(500).json({ error: 'Failed to load your library' });
  }
});

// ── POST /verify/:sessionId  — protect (fulfilment on success redirect) ──
// NOTE: we deliberately do NOT use the Stripe webhook, because payments.js is
// a protected file. Fulfilment happens here instead, on the success redirect.
router.post('/verify/:sessionId', protect, async (req, res) => {
  try {
    if (!stripe) return res.status(503).json({ error: 'Payments are not configured' });

    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    if (!session || session.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Payment not completed' });
    }
    if (session.metadata?.userId !== req.user._id.toString()) {
      return res.status(403).json({ error: 'This order does not belong to you' });
    }

    // Idempotent — never create a second order for the same session.
    const existing = await BookOrder.findOne({ stripeSessionId: session.id });
    if (existing) {
      return res.json({ orderId: existing._id, orderNumber: existing.orderNumber });
    }

    const bookId = session.metadata?.bookId;
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ error: 'Book not found' });

    const amount = (session.amount_total || 0) / 100;
    const order = await BookOrder.create({
      userId: req.user._id,
      bookId: book._id,
      bookTitle: book.title,
      orderNumber: generateOrderNumber(),
      amount,
      currency: session.currency || 'usd',
      stripeSessionId: session.id,
      source: 'stripe',
      status: 'paid',
      watermarkName: fullName(req.user),
      watermarkEmail: req.user.email
    });

    await Book.findByIdAndUpdate(book._id, { $inc: { salesCount: 1 } });

    logActivity(
      ACTIVITY_TYPES.PAYMENT_SUCCEEDED,
      { bookId: book._id, amount, type: 'book_purchase' },
      { userId: req.user._id, userName: fullName(req.user), userEmail: req.user.email }
    ).catch(() => {});

    res.json({ orderId: order._id, orderNumber: order.orderNumber });
  } catch (error) {
    logger.error({ err: error }, 'Book purchase verification failed');
    res.status(500).json({ error: 'Could not verify your purchase' });
  }
});

// ── GET /:slug  — PUBLIC single book ────────────────────────────────────
router.get('/:slug', async (req, res) => {
  try {
    const book = await Book.findOne({ slug: String(req.params.slug).toLowerCase(), status: 'published' });
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book.toPublicJSON());
  } catch (error) {
    logger.error({ err: error }, 'Book fetch failed');
    res.status(500).json({ error: 'Failed to load book' });
  }
});

// ── POST /:slug/checkout  — protect ─────────────────────────────────────
router.post('/:slug/checkout', protect, async (req, res) => {
  try {
    const book = await Book.findOne({ slug: String(req.params.slug).toLowerCase(), status: 'published' });
    if (!book) return res.status(404).json({ error: 'Book not found' });

    // Member-free access for active subscribers/VIP.
    if (book.memberFree && typeof req.user.hasActiveSubscription === 'function' && req.user.hasActiveSubscription()) {
      const existingFree = await BookOrder.findOne({ userId: req.user._id, bookId: book._id, status: 'paid' });
      if (existingFree) {
        return res.json({ free: true, alreadyOwned: true, orderId: existingFree._id });
      }
      const freeOrder = await BookOrder.create({
        userId: req.user._id,
        bookId: book._id,
        bookTitle: book.title,
        orderNumber: generateOrderNumber(),
        amount: 0,
        currency: 'usd',
        source: 'member_free',
        status: 'paid',
        watermarkName: fullName(req.user),
        watermarkEmail: req.user.email
      });
      return res.json({ free: true, orderId: freeOrder._id });
    }

    // Already purchased?
    const existing = await BookOrder.findOne({ userId: req.user._id, bookId: book._id, status: 'paid' });
    if (existing) {
      return res.json({ alreadyOwned: true, orderId: existing._id });
    }

    if (!stripe) return res.status(503).json({ error: 'Payments are not configured' });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(book.price * 100),
          product_data: {
            name: book.title,
            description: book.blurb || book.subtitle || ''
          }
        },
        quantity: 1
      }],
      success_url: `${CLIENT_URL}/book-success.html?session_id={CHECKOUT_SESSION_ID}&slug=${book.slug}`,
      cancel_url: `${CLIENT_URL}/book-details.html?slug=${book.slug}&cancelled=true`,
      metadata: {
        type: 'book_purchase',
        bookId: book._id.toString(),
        userId: req.user._id.toString(),
        slug: book.slug
      }
    });

    res.json({ url: session.url });
  } catch (error) {
    logger.error({ err: error }, 'Book checkout failed');
    res.status(500).json({ error: 'Could not start checkout' });
  }
});

// ── GET /:bookId/download  — protect + rate limit ───────────────────────
router.get('/:bookId/download', protect, downloadLimiter, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.bookId)) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const order = await BookOrder.findOne({
      userId: req.user._id,
      bookId: req.params.bookId,
      status: 'paid'
    });
    if (!order) return res.status(403).json({ error: 'You do not own this book' });

    const book = await Book.findById(req.params.bookId);
    if (!book) return res.status(404).json({ error: 'Book not found' });

    const gate = canDownload(order, book);
    if (!gate.allowed) return res.status(403).json({ error: gate.reason });

    const { buffer, filename } = await buildWatermarkedCopy(book, order);

    await BookOrder.findByIdAndUpdate(order._id, {
      $inc: { downloadCount: 1 },
      $push: { downloads: { at: new Date(), ip: req.ip, userAgent: req.get('user-agent') } }
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Cache-Control', 'no-store, private');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    res.send(buffer);
  } catch (error) {
    logger.error({ err: error }, 'Book download failed');
    res.status(500).json({ error: 'Could not prepare your download' });
  }
});

export default router;
