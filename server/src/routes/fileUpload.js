// server/src/routes/fileUpload.js
// REGISTER IN index.js:
//   import fileUploadRoutes from './routes/fileUpload.js';
//   app.use('/api/files', fileUploadRoutes);   // add after the images route

import express from 'express';
import multer from 'multer';
import cloudinary from 'cloudinary';
import { Readable } from 'stream';
import { protect, adminOnly as requireAdmin } from '../middleware/auth.js';

const router = express.Router();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'text/csv',
];

const EXT_LABELS = {
  'application/pdf': 'PDF',
  'application/msword': 'DOC',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'application/vnd.ms-powerpoint': 'PPT',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPTX',
  'application/vnd.ms-excel': 'XLS',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
  'text/plain': 'TXT',
  'text/csv': 'CSV',
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type not allowed: ${file.mimetype}. Accepted: PDF, DOCX, PPTX, XLSX, TXT, CSV`), false);
    }
  },
});

// POST /api/files/upload
// Body (multipart): file, context (optional), courseCode (optional), title (optional)
router.post('/upload', protect, requireAdmin, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'No file provided' });

    const context   = req.body.context   || 'deliverable';
    const courseCode = req.body.courseCode || 'general';
    const title     = req.body.title     || req.file.originalname.replace(/\.[^.]+$/, '');
    const folder    = `counselorready/course-resources/${courseCode}`;
    const publicId  = `${context}_${Date.now()}`;
    const fileLabel = EXT_LABELS[req.file.mimetype] || 'FILE';

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream(
        {
          folder,
          resource_type: 'raw',
          public_id: publicId,
          use_filename: false,
          context: {
            title,
            uploadedBy: req.user?.email || 'admin',
            courseCode,
            uploadContext: context,
            fileType: fileLabel,
          },
        },
        (err, res) => (err ? reject(err) : resolve(res))
      );
      const readable = new Readable();
      readable.push(req.file.buffer);
      readable.push(null);
      readable.pipe(stream);
    });

    res.json({
      success: true,
      data: {
        url:        result.secure_url,
        publicId:   result.public_id,
        fileName:   req.file.originalname,
        title,
        fileType:   fileLabel,
        mimeType:   req.file.mimetype,
        bytes:      result.bytes,
        folder:     result.folder,
        createdAt:  result.created_at,
      },
    });
  } catch (err) {
    console.error('File upload error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/files/:publicId(*)
router.delete('/:publicId(*)', protect, requireAdmin, async (req, res) => {
  try {
    const result = await cloudinary.v2.uploader.destroy(req.params.publicId, { resource_type: 'raw' });
    res.json({ success: result.result === 'ok' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/files/browse?courseCode=CR-ETH301
router.get('/browse', protect, requireAdmin, async (req, res) => {
  try {
    const courseCode = req.query.courseCode || '';
    const folder = courseCode
      ? `counselorready/course-resources/${courseCode}`
      : 'counselorready/course-resources';
    const result = await cloudinary.v2.search
      .expression(`folder:${folder}/* AND resource_type:raw`)
      .sort_by('created_at', 'desc')
      .max_results(100)
      .execute();
    res.json({
      success: true,
      data: result.resources.map(r => ({
        url:       r.secure_url,
        publicId:  r.public_id,
        bytes:     r.bytes,
        format:    r.format,
        createdAt: r.created_at,
        title:     r.context?.custom?.title || r.public_id.split('/').pop(),
        fileType:  r.context?.custom?.fileType || r.format?.toUpperCase() || 'FILE',
      })),
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
