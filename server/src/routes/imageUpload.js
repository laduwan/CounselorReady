// DROP INTO: /server/src/routes/imageUpload.js
// THEN ADD TO /server/src/index.js:
//   import imageUploadRoutes from './routes/imageUpload.js';
//   app.use('/api/images', imageUploadRoutes);
// THEN RUN: cd /server && npm install multer

import express from 'express';
import multer from 'multer';
import cloudinary from 'cloudinary';
import { Readable } from 'stream';
import { protect, adminOnly } from '../middleware/auth.js';

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

router.post('/upload', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: { message: 'No image file provided' } });
    const folder = req.body.folder || 'counselorready/course-content';
    const context = req.body.context || 'general';

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream(
        { folder, resource_type: 'image', public_id: `${context}_${Date.now()}`,
          transformation: [{ quality: 'auto:good', fetch_format: 'auto' }],
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
      thumbnailUrl: cloudinary.v2.url(result.public_id, { width: 200, height: 200, crop: 'fill', quality: 'auto' }),
      mediumUrl: cloudinary.v2.url(result.public_id, { width: 800, quality: 'auto', fetch_format: 'auto' }),
      largeUrl: cloudinary.v2.url(result.public_id, { width: 1200, quality: 'auto', fetch_format: 'auto' }),
    }});
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

router.delete('/:publicId(*)', protect, adminOnly, async (req, res) => {
  try {
    const result = await cloudinary.v2.uploader.destroy(req.params.publicId, { resource_type: 'image' });
    res.json({ success: result.result === 'ok' });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

router.get('/browse', protect, adminOnly, async (req, res) => {
  try {
    const folder = req.query.folder || 'counselorready/course-content';
    const result = await cloudinary.v2.search.expression(`folder:${folder}`).sort_by('created_at', 'desc').max_results(50).execute();
    res.json({ success: true, data: {
      images: result.resources.map(r => ({
        url: r.secure_url, publicId: r.public_id, width: r.width, height: r.height,
        format: r.format, bytes: r.bytes, createdAt: r.created_at, alt: r.context?.custom?.alt || '',
      })),
      totalCount: result.total_count,
    }});
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

export default router;
