/**
 * Upload Routes
 * 
 * Handles video and resource file uploads to R2 storage
 */

import express from 'express';
import multer from 'multer';
import { protect, requireAdmin } from '../middleware/auth.js';
import { uploadVideo, uploadResource, deleteFile, getFileInfo, getSignedUploadUrl } from '../utils/r2Storage.js';
import User from '../models/User.js';
import Course from '../models/Course.js';
import StorageUsage from '../models/StorageUsage.js';

const router = express.Router();

// Configure multer for memory storage (files go to buffer, then to R2)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 * 1024, // 5GB max for videos
  },
  fileFilter: (req, file, cb) => {
    // Check file types
    const videoTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska'];
    const resourceTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/zip',
      'text/plain',
    ];

    const allowedTypes = [...videoTypes, ...resourceTypes];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed`), false);
    }
  },
});

// Storage limits by tier (in bytes)
const STORAGE_LIMITS = {
  basic: 10 * 1024 * 1024 * 1024,      // 10 GB
  professional: 50 * 1024 * 1024 * 1024, // 50 GB
  enterprise: 200 * 1024 * 1024 * 1024,  // 200 GB
};

// Overage pricing per GB (in cents)
const OVERAGE_PRICING = {
  basic: 5,        // $0.05/GB
  professional: 4, // $0.04/GB
  enterprise: 3,   // $0.03/GB
};

/**
 * @route   POST /api/uploads/video
 * @desc    Upload a video file
 * @access  Private (Provider/Admin)
 */
router.post('/video', protect, upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }

    const user = await User.findById(req.user._id);
    const providerId = user.providerId || user._id.toString();
    const courseId = req.body.courseId || null;

    // Check storage limit
    const storageCheck = await checkStorageLimit(providerId, req.file.size);
    if (!storageCheck.allowed) {
      return res.status(400).json({
        error: 'Storage limit exceeded',
        currentUsage: storageCheck.currentUsage,
        limit: storageCheck.limit,
        overage: storageCheck.overage,
        overageCost: storageCheck.overageCost,
      });
    }

    // Upload to R2
    const result = await uploadVideo(
      req.file.buffer,
      req.file.originalname,
      providerId,
      courseId
    );

    // Track storage usage in database
    await trackStorageUsage(providerId, result.key, result.size, 'video');

    res.status(201).json({
      message: 'Video uploaded successfully',
      video: {
        key: result.key,
        url: result.url,
        size: result.size,
        sizeFormatted: formatBytes(result.size),
        originalName: req.file.originalname,
      },
      storage: {
        used: storageCheck.currentUsage + result.size,
        limit: storageCheck.limit,
        remaining: storageCheck.limit - (storageCheck.currentUsage + result.size),
      },
    });

  } catch (error) {
    console.error('Video upload error:', error);
    res.status(500).json({ error: 'Failed to upload video: ' + error.message });
  }
});

/**
 * @route   POST /api/uploads/resource
 * @desc    Upload a resource/handout file
 * @access  Private (Provider/Admin)
 */
router.post('/resource', protect, upload.single('resource'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No resource file uploaded' });
    }

    const user = await User.findById(req.user._id);
    const providerId = user.providerId || user._id.toString();
    const courseId = req.body.courseId;

    if (!courseId) {
      return res.status(400).json({ error: 'courseId is required for resource uploads' });
    }

    // Check storage limit
    const storageCheck = await checkStorageLimit(providerId, req.file.size);
    if (!storageCheck.allowed) {
      return res.status(400).json({
        error: 'Storage limit exceeded',
        currentUsage: storageCheck.currentUsage,
        limit: storageCheck.limit,
      });
    }

    // Upload to R2
    const result = await uploadResource(
      req.file.buffer,
      req.file.originalname,
      providerId,
      courseId
    );

    // Track storage usage
    await trackStorageUsage(providerId, result.key, result.size, 'resource');

    res.status(201).json({
      message: 'Resource uploaded successfully',
      resource: {
        key: result.key,
        url: result.url,
        size: result.size,
        sizeFormatted: formatBytes(result.size),
        originalName: req.file.originalname,
      },
    });

  } catch (error) {
    console.error('Resource upload error:', error);
    res.status(500).json({ error: 'Failed to upload resource: ' + error.message });
  }
});

/**
 * @route   POST /api/uploads/presigned
 * @desc    Get a presigned URL for direct browser upload (large files)
 * @access  Private (Provider/Admin)
 */
router.post('/presigned', protect, async (req, res) => {
  try {
    const { filename, contentType, courseId } = req.body;

    if (!filename || !contentType) {
      return res.status(400).json({ error: 'filename and contentType are required' });
    }

    const user = await User.findById(req.user._id);
    const providerId = user.providerId || user._id.toString();

    // Generate the key path
    const ext = filename.split('.').pop().toLowerCase();
    const safeName = filename
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9-_]/g, '-')
      .substring(0, 50);
    const timestamp = Date.now();
    
    const key = courseId
      ? `videos/${providerId}/${courseId}/${safeName}-${timestamp}.${ext}`
      : `videos/${providerId}/${safeName}-${timestamp}.${ext}`;

    // Get presigned URL (valid for 1 hour)
    const uploadUrl = await getSignedUploadUrl(key, contentType, 3600);

    res.json({
      uploadUrl,
      key,
      expiresIn: 3600,
      instructions: 'PUT your file to uploadUrl with Content-Type header matching contentType',
    });

  } catch (error) {
    console.error('Presigned URL error:', error);
    res.status(500).json({ error: 'Failed to generate upload URL: ' + error.message });
  }
});

/**
 * @route   DELETE /api/uploads/:key
 * @desc    Delete an uploaded file
 * @access  Private (Provider/Admin)
 */
router.delete('/:key(*)', protect, async (req, res) => {
  try {
    const key = req.params.key;
    const user = await User.findById(req.user._id);
    const providerId = user.providerId || user._id.toString();

    // Verify the file belongs to this provider
    if (!key.includes(`/${providerId}/`) && user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this file' });
    }

    // Get file info before deleting (for storage tracking)
    let fileSize = 0;
    try {
      const info = await getFileInfo(key);
      fileSize = info.size;
    } catch (e) {
      // File might not exist, continue anyway
    }

    // Delete from R2
    await deleteFile(key);

    // Update storage tracking
    await removeStorageUsage(providerId, key, fileSize);

    res.json({ message: 'File deleted successfully', key });

  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ error: 'Failed to delete file: ' + error.message });
  }
});

/**
 * @route   GET /api/uploads/storage
 * @desc    Get storage usage for current provider
 * @access  Private (Provider/Admin)
 */
router.get('/storage', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const providerId = user.providerId || user._id.toString();
    const tier = user.providerTier || 'basic';

    const usage = await getStorageUsage(providerId);
    const limit = STORAGE_LIMITS[tier] || STORAGE_LIMITS.basic;

    res.json({
      tier,
      used: usage,
      usedFormatted: formatBytes(usage),
      limit,
      limitFormatted: formatBytes(limit),
      remaining: Math.max(0, limit - usage),
      remainingFormatted: formatBytes(Math.max(0, limit - usage)),
      percentUsed: Math.round((usage / limit) * 100),
      overageRate: `$${(OVERAGE_PRICING[tier] / 100).toFixed(2)}/GB`,
    });

  } catch (error) {
    console.error('Storage usage error:', error);
    res.status(500).json({ error: 'Failed to get storage usage' });
  }
});

/**
 * @route   GET /api/uploads/files
 * @desc    List uploaded files for current provider
 * @access  Private (Provider/Admin)
 */
router.get('/files', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const providerId = user.providerId || user._id.toString();
    const { type, courseId } = req.query;

    // Get from database tracking
    const files = await getProviderFiles(providerId, type, courseId);

    res.json({ files });

  } catch (error) {
    console.error('List files error:', error);
    res.status(500).json({ error: 'Failed to list files' });
  }
});

// ============ Helper Functions ============

// Check if provider has storage space
async function checkStorageLimit(providerId, newFileSize) {
  // Get provider tier from database
  const provider = await User.findOne({ 
    $or: [{ _id: providerId }, { providerId }] 
  });
  const tier = provider?.providerTier || 'basic';
  const limit = STORAGE_LIMITS[tier] || STORAGE_LIMITS.basic;

  // Get current usage
  const currentUsage = await getStorageUsage(providerId);
  const newTotal = currentUsage + newFileSize;

  // Allow overage (they'll be billed) but warn them
  const overage = Math.max(0, newTotal - limit);
  const overageCostCents = Math.ceil((overage / (1024 * 1024 * 1024)) * OVERAGE_PRICING[tier]);

  return {
    allowed: true, // Allow upload, charge overage
    currentUsage,
    limit,
    newTotal,
    overage,
    overageCost: overageCostCents / 100, // dollars
    tier,
  };
}

// Track storage in database
async function trackStorageUsage(providerId, key, size, type) {
  await StorageUsage.create({ 
    providerId: providerId.toString(), 
    key, 
    size, 
    type 
  });
}

// Remove storage tracking when file deleted
async function removeStorageUsage(providerId, key, size) {
  await StorageUsage.deleteOne({ providerId: providerId.toString(), key });
}

// Get total storage used by provider
async function getStorageUsage(providerId) {
  const usage = await StorageUsage.getProviderUsage(providerId.toString());
  return usage.totalBytes;
}

// Get list of files for provider
async function getProviderFiles(providerId, type = null, courseId = null) {
  const query = { providerId: providerId.toString() };
  if (type) query.type = type;
  if (courseId) query.key = { $regex: `/${courseId}/` };
  return StorageUsage.find(query).sort({ createdAt: -1 });
}

// Format bytes to human readable
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default router;
