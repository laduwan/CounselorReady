// Updated Certificate Fix for CounselorReady
// =========================================
// This version works with your existing system that uses 'fileKey' instead of 'cloudinaryPublicId'

const cloudinary = require('cloudinary').v2;
const Certificate = require('../models/Certificate'); // Adjust path as needed

// Configure Cloudinary (should already be done)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Generate a signed URL for secure certificate access
 * Works with your existing 'fileKey' field
 */
function generateSignedCertificateUrl(publicId, options = {}) {
  const defaultOptions = {
    resource_type: 'raw',
    sign_url: true,
    secure: true,
    expires_at: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
    type: 'upload'
  };

  return cloudinary.url(publicId, { ...defaultOptions, ...options });
}

/**
 * Extract public_id from existing Cloudinary URL
 * Handles both old format (platform_cert_...) and new format (cert_...)
 */
function extractPublicIdFromUrl(cloudinaryUrl) {
  if (!cloudinaryUrl) return null;
  
  try {
    // Extract the public_id from URL like:
    // https://res.cloudinary.com/dzfsgjhdx/raw/upload/v1770355742/certificates/695810fa77585ec7a2c97ec2/platform_cert_CR-0000-0000-3L24.pdf
    const urlParts = cloudinaryUrl.split('/');
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    
    if (uploadIndex === -1) return null;
    
    // Get everything after /upload/v[version]/
    const pathAfterVersion = urlParts.slice(uploadIndex + 2).join('/');
    
    // Remove file extension
    const publicId = pathAfterVersion.replace(/\.[^/.]+$/, '');
    
    return publicId;
  } catch (error) {
    console.error('Failed to extract public_id from URL:', error);
    return null;
  }
}

/**
 * API Route: Get signed certificate URL (UPDATED VERSION)
 * This version works with your existing 'fileKey' field
 */
const getCertificateSignedUrl = async (req, res) => {
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

    // Verify user owns this certificate (updated to use userId instead of populated user)
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
      // Use stored fileKey (public_id) - this is your existing field!
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
 * Run this to fix existing certificates with missing fileKey
 */
const fixExistingCertificates = async () => {
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

/**
 * Test function to check if a certificate URL works
 */
const testCertificateAccess = async (certificateId) => {
  try {
    const certificate = await Certificate.findById(certificateId);
    if (!certificate) {
      console.log('Certificate not found');
      return;
    }

    console.log('Certificate Details:');
    console.log('- Certificate Number:', certificate.certificateNumber);
    console.log('- Original URL:', certificate.fileUrl);
    console.log('- File Key (public_id):', certificate.fileKey);
    
    let publicId = certificate.fileKey;
    if (!publicId) {
      publicId = extractPublicIdFromUrl(certificate.fileUrl);
      console.log('- Extracted Public ID:', publicId);
    }
    
    if (publicId) {
      const signedUrl = generateSignedCertificateUrl(publicId);
      console.log('- Signed URL:', signedUrl);
      console.log('✅ Signed URL generated successfully');
    } else {
      console.log('❌ Could not generate signed URL');
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Export functions for use in routes and services
module.exports = {
  generateSignedCertificateUrl,
  extractPublicIdFromUrl,
  getCertificateSignedUrl,
  fixExistingCertificates,
  testCertificateAccess
};

// =====================================
// IMPLEMENTATION STATUS
// =====================================

/*
✅ ALREADY COMPLETED:
1. Signed URL route added to certificates.js (lines 21, 24)
2. Platform certificates already store fileKey (public_id) correctly
3. Certificate generation is working properly

🔧 WHAT'S NEEDED:
1. Replace the certificate-fix.js utility file with this updated version
2. Test the signed URL generation
3. Optionally run migration for old certificates without fileKey

📍 YOUR SYSTEM STATUS:
- Platform certificate generation: ✅ Working (stores fileKey correctly)  
- Certificate viewing: ❌ Failing (401 errors from direct URLs)
- Signed URL route: ✅ Added to certificates.js
- Fix utility: ⏳ Needs this updated version

🚀 NEXT STEPS:
1. Replace /server/src/utils/certificate-fix.js with this code
2. Test by calling: GET /api/certificates/{certificate_id}/signed-url
3. Update frontend to use signed URLs instead of direct fileUrl
*/
