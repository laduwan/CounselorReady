// Certificate Fix: Signed URL Generation
// =====================================
// This addresses the 401 Unauthorized error when viewing certificates
// by implementing signed URL generation for secure Cloudinary access

const cloudinary = require('cloudinary').v2;
const Certificate = require('../models/Certificate');

// Configure Cloudinary (should already be done in certificateService.js)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Generate a signed URL for secure certificate access
 * This solves the 401 Unauthorized error from Cloudinary
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
 * API Route: Get signed certificate URL
 * Add this to your certificates.js routes file
 */
const getCertificateSignedUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Find certificate and verify ownership
    const certificate = await Certificate.findById(id).populate('user', '_id');
    
    if (!certificate) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Certificate not found' }
      });
    }

    // Verify user owns this certificate
    if (certificate.user._id.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Access denied' }
      });
    }

    if (!certificate.pdfUrl) {
      return res.status(404).json({
        success: false,
        error: { code: 'NO_PDF', message: 'Certificate PDF not available' }
      });
    }

    // Generate signed URL
    let signedUrl;
    
    if (certificate.cloudinaryPublicId) {
      // Use stored public_id if available
      signedUrl = generateSignedCertificateUrl(certificate.cloudinaryPublicId);
    } else {
      // Extract public_id from existing URL
      const publicId = extractPublicIdFromUrl(certificate.pdfUrl);
      if (!publicId) {
        return res.status(500).json({
          success: false,
          error: { code: 'INVALID_URL', message: 'Cannot generate signed URL' }
        });
      }
      signedUrl = generateSignedCertificateUrl(publicId);
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
 * Updated Certificate Service: Store public_id for future use
 * Modify the existing certificateService.js generatePDF function
 */
const updatedGeneratePDF = async function({
  certificateNumber,
  userName,
  courseTitle,
  completionDate,
  ceHours,
  nbccNumber,
  providerNumber = '7760',
  template = 'standard'
}) {
  return new Promise((resolve, reject) => {
    try {
      // ... existing PDF generation code ...

      const doc = new PDFDocument({
        size: 'LETTER',
        layout: 'landscape',
        margin: 50
      });
      
      const chunks = [];
      
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', async () => {
        try {
          const pdfBuffer = Buffer.concat(chunks);
          
          // Generate public_id for new certificates
          const publicId = `counselorready/certificates/cert_${certificateNumber.replace(/[^a-zA-Z0-9]/g, '_')}`;
          
          // Upload to Cloudinary with explicit public_id
          const uploadResult = await new Promise((res, rej) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                public_id: publicId,
                resource_type: 'raw',
                format: 'pdf',
                folder: false, // Don't add folder since it's in public_id
                overwrite: true
              },
              (error, result) => {
                if (error) rej(error);
                else res(result);
              }
            );
            
            const readable = new (require('stream').Readable)();
            readable.push(pdfBuffer);
            readable.push(null);
            readable.pipe(uploadStream);
          });
          
          // Return both secure_url and public_id for database storage
          resolve({
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id
          });
        } catch (uploadError) {
          reject(uploadError);
        }
      });
      
      doc.on('error', reject);
      
      // ... rest of PDF generation code remains the same ...
      
      doc.end();
      
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Database Migration Script: Update existing certificates
 * Run this to fix existing certificates with missing cloudinaryPublicId
 */
const fixExistingCertificates = async () => {
  console.log('Starting certificate URL fix migration...');
  
  try {
    const certificates = await Certificate.find({ 
      pdfUrl: { $exists: true },
      cloudinaryPublicId: { $exists: false }
    });

    console.log(`Found ${certificates.length} certificates to fix`);
    
    let fixed = 0;
    let failed = 0;
    
    for (const cert of certificates) {
      try {
        const publicId = extractPublicIdFromUrl(cert.pdfUrl);
        
        if (publicId) {
          await Certificate.findByIdAndUpdate(cert._id, {
            cloudinaryPublicId: publicId
          });
          fixed++;
          console.log(`Fixed certificate ${cert.certificateNumber}: ${publicId}`);
        } else {
          failed++;
          console.log(`Could not extract public_id for certificate ${cert.certificateNumber}: ${cert.pdfUrl}`);
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

// Export functions for use in routes and services
module.exports = {
  generateSignedCertificateUrl,
  extractPublicIdFromUrl,
  getCertificateSignedUrl,
  updatedGeneratePDF,
  fixExistingCertificates
};

// =====================================
// IMPLEMENTATION INSTRUCTIONS
// =====================================

/*
1. ADD TO ROUTES:
   In /server/src/routes/certificates.js, add:
   
   router.get('/:id/signed-url', protect, getCertificateSignedUrl);

2. UPDATE FRONTEND:
   Instead of using pdfUrl directly, call:
   
   GET /api/certificates/{id}/signed-url
   
   Then use the signedUrl from the response

3. UPDATE CERTIFICATE SERVICE:
   Replace the resolve(uploadResult.secure_url) in certificateService.js with:
   
   resolve({
     url: uploadResult.secure_url,
     publicId: uploadResult.public_id
   });
   
   And update the calling code to store both values

4. RUN MIGRATION:
   Execute fixExistingCertificates() to update existing certificates

5. FRONTEND UPDATE EXAMPLE:
   
   // Old way (causing 401 error):
   <a href={certificate.pdfUrl}>Download</a>
   
   // New way (secure):
   const getSignedUrl = async (certId) => {
     const response = await fetch(`/api/certificates/${certId}/signed-url`, {
       headers: { Authorization: `Bearer ${token}` }
     });
     const { data } = await response.json();
     return data.signedUrl;
   };
   
   <button onClick={async () => {
     const url = await getSignedUrl(certificate._id);
     window.open(url, '_blank');
   }}>
     Download Certificate
   </button>

This fix ensures secure, authenticated access to certificates while maintaining 
the existing certificate generation workflow.
*/
