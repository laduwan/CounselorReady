/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// DROP INTO: /server/src/routes/imageUpload.js
// THEN ADD TO /server/src/index.js:
//   import imageUploadRoutes from './routes/imageUpload.js';
//   app.use('/api/images', imageUploadRoutes);
// THEN RUN: cd /server && npm install multer

import express from 'express';
import multer from 'multer';
import cloudinary from 'cloudinary';
import { Readable } from 'stream';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    cb(allowed.includes(file.mimetype) ? null : new Error('Images only'), allowed.includes(file.mimetype));
  }
});

router.post('/upload', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'No image file provided' });
    const folder = req.body.folder || 'counselorready/course-images';
    const context = req.body.context || 'general';

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream(
        { folder, resource_type: 'image', public_id: `${context}_${Date.now()}`,
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
          context: { alt: req.body.alt || '', uploadedBy: req.user.email, uploadContext: context }
        },
        (err, res) => err ? reject(err) : resolve(res)
      );
      const readable = new Readable();
      readable.push(req.file.buffer);
      readable.push(null);
      readable.pipe(stream);
    });

    res.json({ success: true, data: {
      url: result.secure_url, publicId: result.public_id,
      width: result.width, height: result.height, format: result.format,
      bytes: result.bytes, alt: req.body.alt || '',
      thumbnailUrl: cloudinary.v2.url(result.public_id, { width: 400, crop: 'fill', quality: 'auto' }),
      mediumUrl: cloudinary.v2.url(result.public_id, { width: 800, crop: 'limit', quality: 'auto' }),
      largeUrl: result.secure_url,
    }});
  } catch (error) {
    console.error('Image upload error:', error);
    if (error instanceof multer.MulterError || error.message === 'Images only') {
      return res.status(400).json({ success: false, error: 'Images only, max 10MB' });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/:publicId(*)', protect, requireAdmin, async (req, res) => {
  try {
    const result = await cloudinary.v2.uploader.destroy(req.params.publicId, { resource_type: 'image' });
    res.json({ success: result.result === 'ok' });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

router.get('/browse', protect, requireAdmin, async (req, res) => {
  try {
    const folder = req.query.folder || '';
    const search = req.query.search || '';
    const limit = Math.min(parseInt(req.query.max_results) || 50, 200);

    // Build Cloudinary search expression
    const folders = folder
      ? [folder]
      : ['counselorready/course-content', 'counselorready/course-thumbnails', 'counselorready/inline', 'counselorready/hotspot-bg'];

    const folderExpr = folders.map(f => `folder:${f}`).join(' OR ');
    let expression = folders.length > 1 ? `(${folderExpr})` : folderExpr;
    if (search) {
      expression += ` AND (public_id:*${search}* OR context.alt:*${search}*)`;
    }

    const result = await cloudinary.v2.search
      .expression(expression)
      .sort_by('created_at', 'desc')
      .max_results(limit)
      .with_field('context')
      .execute();

    res.json({ success: true, data: {
      images: result.resources.map(r => ({
        url: r.secure_url, publicId: r.public_id, width: r.width, height: r.height,
        format: r.format, bytes: r.bytes, createdAt: r.created_at,
        alt: r.context?.custom?.alt || '',
        folder: r.folder || '',
        thumbnailUrl: cloudinary.v2.url(r.public_id, { width: 200, height: 200, crop: 'fill', quality: 'auto' }),
      })),
      totalCount: result.total_count,
    }});
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

// ─── Search Pexels (admin) — proxies the Pexels API using the server-side key ─
// GET /api/images/pexels-search?q=<query>&page=<n>
router.get('/pexels-search', protect, requireAdmin, async (req, res) => {
  try {
    if (!process.env.PEXELS_API_KEY) {
      return res.status(503).json({ success: false, error: 'PEXELS_API_KEY not configured on the server.' });
    }
    const q = (req.query.q || '').toString().trim();
    if (!q) return res.status(400).json({ success: false, error: 'Missing search query (q).' });
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&orientation=landscape&per_page=15&page=${page}`;
    const r = await fetch(url, { headers: { Authorization: process.env.PEXELS_API_KEY } });
    if (!r.ok) {
      const detail = await r.text().catch(() => '');
      return res.status(502).json({ success: false, error: `Pexels ${r.status}: ${detail.slice(0, 150)}` });
    }
    const data = await r.json();
    const images = (data.photos || []).map((p) => ({
      id: p.id,
      url: (p.src && (p.src.large2x || p.src.large)) || p.src?.original,
      thumbnailUrl: (p.src && (p.src.medium || p.src.small)) || p.src?.tiny,
      photographer: p.photographer || '',
      alt: p.alt || q,
    })).filter((x) => x.url);
    res.json({ success: true, data: { images, page, totalCount: data.total_results || 0 } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── Upload an image from a remote URL into Cloudinary (admin) ───────────────
// POST /api/images/upload-from-url   body: { url, folder?, alt? }
// Used by the editor to persist a chosen Pexels image into the banner library.
router.post('/upload-from-url', protect, requireAdmin, async (req, res) => {
  try {
    const { url, folder, alt } = req.body || {};
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ success: false, error: 'Missing image url.' });
    }
    const targetFolder = folder || 'counselorready/banner-library';
    const result = await cloudinary.v2.uploader.upload(url, {
      folder: targetFolder,
      transformation: [{ width: 1600, crop: 'limit', quality: 'auto', fetch_format: 'auto' }],
      context: alt ? `alt=${String(alt).replace(/[|=]/g, ' ')}` : undefined,
    });
    res.json({ success: true, data: {
      url: result.secure_url,
      publicId: result.public_id,
      thumbnailUrl: cloudinary.v2.url(result.public_id, { width: 200, height: 200, crop: 'fill', quality: 'auto' }),
    }});
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
