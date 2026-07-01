/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * Cloudflare R2 Storage Utility
 * 
 * S3-compatible object storage for video uploads
 * 
 * Setup:
 * 1. Create R2 bucket in Cloudflare dashboard
 * 2. Generate API credentials (R2 > Manage R2 API Tokens)
 * 3. Add env vars: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME
 * 4. Optional: R2_PUBLIC_URL for custom domain or r2.dev public URL
 */

import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Initialize R2 client
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'counselorready-videos';
const PUBLIC_URL = process.env.R2_PUBLIC_URL; // e.g., https://videos.counselorready.com or https://pub-xxx.r2.dev

/**
 * Upload a file to R2
 * @param {Buffer} fileBuffer - File data
 * @param {string} key - Storage path/filename (e.g., 'videos/provider-123/workshop.mp4')
 * @param {string} contentType - MIME type (e.g., 'video/mp4')
 * @param {object} metadata - Optional metadata
 * @returns {object} { key, url, size }
 */
export async function uploadFile(fileBuffer, key, contentType, metadata = {}) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
    Metadata: metadata,
  });

  await r2Client.send(command);

  const url = PUBLIC_URL 
    ? `${PUBLIC_URL}/${key}`
    : await getSignedUrl(r2Client, new GetObjectCommand({ Bucket: BUCKET_NAME, Key: key }), { expiresIn: 604800 }); // 7 days

  return {
    key,
    url,
    size: fileBuffer.length,
  };
}

/**
 * Upload video with organized path structure
 * @param {Buffer} fileBuffer - Video data
 * @param {string} originalName - Original filename
 * @param {string} providerId - Provider/organization ID
 * @param {string} courseId - Course ID (optional)
 * @returns {object} { key, url, size }
 */
export async function uploadVideo(fileBuffer, originalName, providerId, courseId = null) {
  // Sanitize filename
  const ext = originalName.split('.').pop().toLowerCase();
  const safeName = originalName
    .replace(/\.[^/.]+$/, '') // Remove extension
    .replace(/[^a-zA-Z0-9-_]/g, '-') // Replace special chars
    .substring(0, 50); // Limit length
  
  const timestamp = Date.now();
  const path = courseId 
    ? `videos/${providerId}/${courseId}/${safeName}-${timestamp}.${ext}`
    : `videos/${providerId}/${safeName}-${timestamp}.${ext}`;

  const contentType = getVideoContentType(ext);
  
  return uploadFile(fileBuffer, path, contentType, {
    originalName,
    providerId,
    courseId: courseId || '',
    uploadedAt: new Date().toISOString(),
  });
}

/**
 * Upload resource/handout file
 * @param {Buffer} fileBuffer - File data
 * @param {string} originalName - Original filename
 * @param {string} providerId - Provider ID
 * @param {string} courseId - Course ID
 * @returns {object} { key, url, size }
 */
export async function uploadResource(fileBuffer, originalName, providerId, courseId) {
  const ext = originalName.split('.').pop().toLowerCase();
  const safeName = originalName
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .substring(0, 50);
  
  const timestamp = Date.now();
  const path = `resources/${providerId}/${courseId}/${safeName}-${timestamp}.${ext}`;
  
  const contentType = getResourceContentType(ext);
  
  return uploadFile(fileBuffer, path, contentType, {
    originalName,
    providerId,
    courseId,
    uploadedAt: new Date().toISOString(),
  });
}

/**
 * Delete a file from R2
 * @param {string} key - Storage path/filename
 */
export async function deleteFile(key) {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  await r2Client.send(command);
  return { deleted: true, key };
}

/**
 * Get file metadata (size, content type, etc.)
 * @param {string} key - Storage path/filename
 * @returns {object} File metadata
 */
export async function getFileInfo(key) {
  const command = new HeadObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  const response = await r2Client.send(command);
  
  return {
    key,
    size: response.ContentLength,
    contentType: response.ContentType,
    lastModified: response.LastModified,
    metadata: response.Metadata,
  };
}

/**
 * Generate a signed URL for private file access
 * @param {string} key - Storage path/filename
 * @param {number} expiresIn - Seconds until expiration (default 1 hour)
 * @returns {string} Signed URL
 */
export async function getSignedDownloadUrl(key, expiresIn = 3600) {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return getSignedUrl(r2Client, command, { expiresIn });
}

/**
 * Generate a signed URL for direct browser upload (presigned PUT)
 * Use for large files to upload directly from browser to R2
 * @param {string} key - Storage path/filename
 * @param {string} contentType - Expected content type
 * @param {number} expiresIn - Seconds until expiration (default 1 hour)
 * @returns {string} Signed upload URL
 */
export async function getSignedUploadUrl(key, contentType, expiresIn = 3600) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(r2Client, command, { expiresIn });
}

/**
 * Calculate storage used by a provider
 * Note: This is a simple implementation. For production, 
 * you may want to track this in your database instead.
 * @param {string} providerId - Provider ID
 * @returns {number} Total bytes used
 */
export async function getProviderStorageUsed(providerId) {
  // For accurate tracking, store file sizes in your database
  // This is a placeholder - R2 doesn't have a simple "list with sizes" API
  // You'd need to list all objects and sum their sizes, which is slow
  
  // Better approach: Track in your database when files are uploaded/deleted
  console.warn('getProviderStorageUsed: Implement database tracking for production');
  return 0;
}

// Helper: Get video content type
function getVideoContentType(ext) {
  const types = {
    'mp4': 'video/mp4',
    'webm': 'video/webm',
    'mov': 'video/quicktime',
    'avi': 'video/x-msvideo',
    'mkv': 'video/x-matroska',
    'm4v': 'video/x-m4v',
  };
  return types[ext] || 'video/mp4';
}

// Helper: Get resource content type
function getResourceContentType(ext) {
  const types = {
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'zip': 'application/zip',
    'txt': 'text/plain',
  };
  return types[ext] || 'application/octet-stream';
}

export default {
  uploadFile,
  uploadVideo,
  uploadResource,
  deleteFile,
  getFileInfo,
  getSignedDownloadUrl,
  getSignedUploadUrl,
  getProviderStorageUsed,
};
