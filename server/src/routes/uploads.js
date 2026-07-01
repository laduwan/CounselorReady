/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import express from 'express';
import multer from 'multer';
import { protect, requireAdmin } from '../middleware/auth.js';
import StorageUsage from '../models/StorageUsage.js';
import { uploadVideo } from '../utils/r2Storage.js';

const router = express.Router();

// Multer config for video uploads (5GB max, video types only)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only video files (MP4, WebM, MOV, AVI) are allowed'));
    }
  }
});

// Storage tier limits (bytes)
const TIER_LIMITS = {
  starter: 5 * 1024 * 1024 * 1024,       // 5 GB
  professional: 25 * 1024 * 1024 * 1024,  // 25 GB
  vip: 100 * 1024 * 1024 * 1024,          // 100 GB
  admin: 500 * 1024 * 1024 * 1024,        // 500 GB
};

const OVERAGE_RATES = {
  starter: '$0.50/GB',
  professional: '$0.25/GB',
  vip: '$0.10/GB',
  admin: 'N/A',
};

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// GET /api/uploads/storage — storage usage for current user/provider
router.get('/storage', protect, requireAdmin, async (req, res) => {
  try {
    const providerId = req.user._id.toString();
    const tier = req.user.role === 'admin' ? 'admin' : (req.user.subscription?.plan || 'starter');
    const usage = await StorageUsage.getProviderUsage(providerId);
    const limit = TIER_LIMITS[tier] || TIER_LIMITS.starter;

    res.json({
      used: usage.totalBytes,
      usedFormatted: formatBytes(usage.totalBytes),
      limit,
      limitFormatted: formatBytes(limit),
      remaining: Math.max(0, limit - usage.totalBytes),
      remainingFormatted: formatBytes(Math.max(0, limit - usage.totalBytes)),
      percentUsed: limit > 0 ? Math.round((usage.totalBytes / limit) * 100) : 0,
      fileCount: usage.fileCount,
      tier,
      overageRate: OVERAGE_RATES[tier] || OVERAGE_RATES.starter,
    });
  } catch (error) {
    console.error('Storage usage error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/uploads/files — list uploaded files
router.get('/files', protect, requireAdmin, async (req, res) => {
  try {
    const providerId = req.user._id.toString();
    const typeFilter = req.query.type;

    const query = { providerId };
    if (typeFilter) query.type = typeFilter;

    const files = await StorageUsage.find(query).sort({ createdAt: -1 }).limit(50);

    res.json({
      files: files.map(f => ({
        _id: f._id,
        key: f.key,
        originalName: f.originalName,
        size: f.size,
        sizeFormatted: f.getFormattedSize(),
        type: f.type,
        contentType: f.contentType,
        courseId: f.courseId,
        url: f.url || f.key,
        createdAt: f.createdAt,
      })),
    });
  } catch (error) {
    console.error('List files error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/uploads/video — upload a video file
router.post('/video', protect, requireAdmin, upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file provided' });
    }

    const providerId = req.user._id.toString();
    const courseId = req.body.courseId || null;

    // Upload to R2
    const result = await uploadVideo(req.file.buffer, req.file.originalname, providerId, courseId);

    // Track in StorageUsage
    const record = await StorageUsage.create({
      providerId,
      key: result.key,
      originalName: req.file.originalname,
      size: result.size,
      type: 'video',
      contentType: req.file.mimetype,
      courseId: courseId || undefined,
      uploadedBy: req.user._id,
      url: result.url,
    });

    res.status(201).json({
      video: {
        _id: record._id,
        key: result.key,
        url: result.url,
        originalName: req.file.originalname,
        size: result.size,
        sizeFormatted: formatBytes(result.size),
      },
    });
  } catch (error) {
    console.error('Video upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
