// server/src/routes/fileUpload.js
// Course supplement files: upload / browse / delete on Cloudinary, plus a
// targeted save of a course's resources[] array (the Resources drawer source).
//
// MOUNTED IN index.js:
//   import fileUploadRoutes from './routes/fileUpload.js';
//   app.use('/api/files', fileUploadRoutes);   // right after the /api/images mount

import express from 'express';
import multer from 'multer';
import cloudinary from 'cloudinary';
import { Readable } from 'stream';
import { protect, adminOnly as requireAdmin } from '../middleware/auth.js';
import { Course as InteractiveCourse } from '../models/InteractiveCourse.js';

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
// Returns a Cloudinary raw secure_url with fl_attachment baked in so the Resources
// drawer link downloads cleanly.
router.post('/upload', protect, requireAdmin, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'No file provided' });

    const context    = req.body.context    || 'deliverable';
    const courseCode = req.body.courseCode  || 'general';
    const title      = req.body.title       || req.file.originalname.replace(/\.[^.]+$/, '');
    const folder     = `counselorready/course-resources/${courseCode}`;
    const publicId   = `${context}_${Date.now()}`;
    const fileLabel  = EXT_LABELS[req.file.mimetype] || 'FILE';

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
        (err, r) => (err ? reject(err) : resolve(r))
      );
      const readable = new Readable();
      readable.push(req.file.buffer);
      readable.push(null);
      readable.pipe(stream);
    });

    // Force-download URL for the drawer (inject fl_attachment after /upload/)
    const downloadUrl = result.secure_url.replace('/upload/', '/upload/fl_attachment/');

    res.json({
      success: true,
      data: {
        url:         downloadUrl,
        rawUrl:      result.secure_url,
        publicId:    result.public_id,
        fileName:    req.file.originalname,
        title,
        fileType:    fileLabel,
        type:        fileLabel.toLowerCase(),
        mimeType:    req.file.mimetype,
        bytes:       result.bytes,
        folder:      result.folder,
        createdAt:   result.created_at,
      },
    });
  } catch (err) {
    console.error('File upload error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/files/browse?courseCode=CR-501
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
        url:       r.secure_url.replace('/upload/', '/upload/fl_attachment/'),
        rawUrl:    r.secure_url,
        publicId:  r.public_id,
        bytes:     r.bytes,
        format:    r.format,
        createdAt: r.created_at,
        title:     r.context?.custom?.title || r.public_id.split('/').pop(),
        fileType:  r.context?.custom?.fileType || r.format?.toUpperCase() || 'FILE',
        type:      (r.context?.custom?.fileType || r.format || 'file').toLowerCase(),
      })),
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/files/:publicId(*)  — remove a raw file from Cloudinary
router.delete('/:publicId(*)', protect, requireAdmin, async (req, res) => {
  try {
    const result = await cloudinary.v2.uploader.destroy(req.params.publicId, { resource_type: 'raw' });
    res.json({ success: result.result === 'ok' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/files/resources/:courseId
// Replace a course's resources[] (feeds the viewer Resources drawer).
// Targeted $set — does NOT re-save / re-validate the whole course document, and the
// course-builder does not track resources[], so there is no autosave clobber.
router.put('/resources/:courseId', protect, requireAdmin, async (req, res) => {
  try {
    const { resources } = req.body;
    if (!Array.isArray(resources)) {
      return res.status(400).json({ success: false, error: 'resources must be an array' });
    }
    const clean = resources
      .filter(r => r && (r.title || r.url))
      .map(r => {
        const item = {
          title: String(r.title || '').trim(),
          url:   String(r.url || '').trim(),
          type:  String(r.type || 'link').trim().toLowerCase(),
        };
        if (r.description) item.description = String(r.description).trim();
        return item;
      });
    const course = await InteractiveCourse.findByIdAndUpdate(
      req.params.courseId,
      { $set: { resources: clean, updatedAt: new Date() } },
      { new: true, runValidators: false }
    );
    if (!course) return res.status(404).json({ success: false, error: 'Course not found' });
    res.json({ success: true, data: { resources: course.resources } });
  } catch (err) {
    console.error('Resources save error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
