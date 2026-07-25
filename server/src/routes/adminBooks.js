/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// /server/src/routes/adminBooks.js — admin CRUD for the Books store
import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import Book from '../models/Book.js';
import BookOrder from '../models/BookOrder.js';
import { protect } from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Same admin guard adminCourses.js uses.
const adminOnly = async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer — memory storage, PDF only, up to 50MB for book files.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed for book assets'), false);
    }
  }
});

// ── GET /  — list all books, any status, INCLUDING assetKey ─────────────
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const books = await Book.find({}).sort({ order: 1, createdAt: -1 });
    res.json(books);
  } catch (error) {
    logger.error({ err: error }, 'Admin books list failed');
    res.status(500).json({ error: 'Failed to load books' });
  }
});

// ── POST /  — create ────────────────────────────────────────────────────
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.status === 'published' && !data.publishedAt) {
      data.publishedAt = new Date();
    }
    const book = await Book.create(data);
    res.status(201).json(book);
  } catch (error) {
    logger.error({ err: error }, 'Admin book create failed');
    res.status(400).json({ error: error.message });
  }
});

// ── PUT /:id  — update ──────────────────────────────────────────────────
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.status === 'published' && !updates.publishedAt) {
      const current = await Book.findById(req.params.id).select('publishedAt');
      if (current && !current.publishedAt) updates.publishedAt = new Date();
    }
    const book = await Book.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (error) {
    logger.error({ err: error }, 'Admin book update failed');
    res.status(400).json({ error: error.message });
  }
});

// ── DELETE /:id  — soft delete -> status:'archived' ─────────────────────
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, { status: 'archived' }, { new: true });
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json({ success: true, book });
  } catch (error) {
    logger.error({ err: error }, 'Admin book archive failed');
    res.status(500).json({ error: 'Failed to archive book' });
  }
});

// ── POST /upload  — private book asset upload ───────────────────────────
// Cover images go to a separate PUBLIC folder via the existing image upload
// route — do not duplicate that logic here.
router.post('/upload', protect, adminOnly, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'counselorready/books',
          resource_type: 'raw',
          type: 'authenticated',
          access_mode: 'authenticated'
        },
        (err, result) => err ? reject(err) : resolve(result)
      );
      stream.end(req.file.buffer);
    });

    res.json({ assetKey: result.public_id, bytes: result.bytes || req.file.size });
  } catch (error) {
    logger.error({ err: error }, 'Admin book asset upload failed');
    res.status(500).json({ error: 'Upload failed' });
  }
});

// ── GET /:id/orders  — order list + download logs for leak investigation ─
router.get('/:id/orders', protect, adminOnly, async (req, res) => {
  try {
    const orders = await BookOrder.find({ bookId: req.params.id })
      .sort({ createdAt: -1 })
      .populate('userId', 'firstName lastName email');
    res.json(orders);
  } catch (error) {
    logger.error({ err: error }, 'Admin book orders fetch failed');
    res.status(500).json({ error: 'Failed to load orders' });
  }
});

export default router;
