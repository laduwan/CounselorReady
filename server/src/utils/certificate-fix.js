/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
// Certificate Fix for CounselorReady (ES6 Module Version)
// =====================================================

import { v2 as cloudinary } from 'cloudinary';
import Certificate from '../models/Certificate.js';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * ✅ FINAL FIX: Generate a signed URL for secure certificate access
 * Fixed signature generation to match Cloudinary's requirements
 */
export function generateSignedCertificateUrl(publicId, options = {}) {
  try {
    // Don't remove .pdf extension - keep the full publicId as stored
    const signedUrl = cloudinary.url(publicId, {
      resource_type: 'image',
      type: 'upload',
      sign_url: true,
      secure: true,
      expires_at: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours from now
      ...options
      // Don't specify format - let Cloudinary use what's in the publicId
    });
    
    return signedUrl;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw error;
  }
}

/**
 * Extract public_id from existing Cloudinary URL
 */
export function extractPublicIdFromUrl(cloudinaryUrl) {
  if (!cloudinaryUrl) return null;
  
  try {
    const url = new URL(cloudinaryUrl);
    const pathParts = url.pathname.split('/');
    
    const uploadIndex = pathParts.findIndex(part => part === 'upload');
    if (uploadIndex === -1) return null;
    
    const publicIdParts = pathParts.slice(uploadIndex + 1);
    const fullPath = publicIdParts.join('/');
    
    return fullPath;
    
  } catch (error) {
    console.error('Failed to extract public_id from URL:', error);
    return null;
  }
}

/**
 * API Route: Get signed certificate URL
 */
export const getCertificateSignedUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Find certificate and verify ownership
    const certificate = await Certificate.findById(id);
    
    if (!certificate) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Certificate not found' }
      });
    }

    // Verify user owns this certificate
    if (certificate.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Access denied' }
      });
    }

    if (!certificate.fileUrl) {
      return res.status(404).json({
        success: false,
        error: { code: 'NO_PDF', message: 'Certificate PDF not available' }
      });
    }

    // Generate signed URL
    let signedUrl;
    
    if (certificate.fileKey) {
      // Use stored fileKey (public_id) - keep it exactly as stored
      signedUrl = generateSignedCertificateUrl(certificate.fileKey);
      console.log(`Generated signed URL using fileKey: ${certificate.fileKey}`);
    } else {
      // Fallback: Extract public_id from existing URL
      const publicId = extractPublicIdFromUrl(certificate.fileUrl);
      if (!publicId) {
        return res.status(500).json({
          success: false,
          error: { code: 'INVALID_URL', message: 'Cannot generate signed URL' }
        });
      }
      signedUrl = generateSignedCertificateUrl(publicId);
      console.log(`Generated signed URL using extracted publicId: ${publicId}`);
    }

    res.json({
      success: true,
      data: {
        signedUrl,
        expiresAt: new Date(Date.now() + (24 * 60 * 60 * 1000)), // 24 hours
        certificateNumber: certificate.certificateNumber
      }
    });

  } catch (error) {
    console.error('Certificate signed URL error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to generate signed URL' }
    });
  }
};

/**
 * Database Migration Script: Update existing certificates
 */
export const fixExistingCertificates = async () => {
  console.log('Starting certificate URL fix migration...');
  
  try {
    const certificates = await Certificate.find({ 
      fileUrl: { $exists: true },
      $or: [
        { fileKey: { $exists: false } },
        { fileKey: null },
        { fileKey: '' }
      ]
    });

    console.log(`Found ${certificates.length} certificates to fix`);
    
    let fixed = 0;
    let failed = 0;
    
    for (const cert of certificates) {
      try {
        const publicId = extractPublicIdFromUrl(cert.fileUrl);
        
        if (publicId) {
          await Certificate.findByIdAndUpdate(cert._id, {
            fileKey: publicId
          });
          fixed++;
          console.log(`Fixed certificate ${cert.certificateNumber}: ${publicId}`);
        } else {
          failed++;
          console.log(`Could not extract public_id for certificate ${cert.certificateNumber}: ${cert.fileUrl}`);
        }
      } catch (error) {
        failed++;
        console.error(`Failed to fix certificate ${cert.certificateNumber}:`, error.message);
      }
    }
    
    console.log(`Migration complete: ${fixed} fixed, ${failed} failed`);
  } catch (error) {
    console.error('Migration failed:', error);
  }
};

// Default export
export default {
  generateSignedCertificateUrl,
  extractPublicIdFromUrl,
  getCertificateSignedUrl,
  fixExistingCertificates
};
