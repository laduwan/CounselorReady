/**
 * ✅ FIXED: Extract public_id from existing Cloudinary URL
 * This version preserves the file extension and handles version numbers correctly
 */
function extractPublicIdFromUrl(cloudinaryUrl) {
  if (!cloudinaryUrl) return null;
  
  try {
    // Extract the public_id from URL like:
    // https://res.cloudinary.com/dzfsgjhdx/image/upload/v1769707131/certificates/695810fa77585ec7a2c97ec2/cert_1769707131332.pdf
    
    const urlParts = cloudinaryUrl.split('/');
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    
    if (uploadIndex === -1) return null;
    
    // Get everything after /upload/v[version]/
    // Skip the version part (e.g., "v1769707131")
    const pathAfterVersion = urlParts.slice(uploadIndex + 2).join('/');
    
    // ✅ CRITICAL FIX: Don't remove the .pdf extension
    // For PDFs, we need to keep the full path including extension
    return pathAfterVersion;
    
  } catch (error) {
    console.error('Failed to extract public_id from URL:', error);
    return null;
  }
}

/**
 * ✅ FIXED: Generate a signed URL for secure certificate access
 * Updated to handle PDF files correctly with proper format
 */
function generateSignedCertificateUrl(publicId, options = {}) {
  // Remove .pdf extension from publicId if present, since Cloudinary adds it automatically
  const cleanPublicId = publicId.replace(/\.pdf$/, '');
  
  const defaultOptions = {
    resource_type: 'raw', // Correct for PDFs
    sign_url: true,
    secure: true,
    expires_at: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
    type: 'upload',
    format: 'pdf' // ✅ Explicitly set PDF format
  };

  return cloudinary.url(cleanPublicId, { ...defaultOptions, ...options });
}
