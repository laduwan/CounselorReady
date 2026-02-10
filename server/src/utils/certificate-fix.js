// Certificate Generation and Signing Utilities for CounselorReady
// ==============================================================
// Complete file with PDF generation AND signed URL fix (ES6 version)

import PDFDocument from 'pdfkit';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// =====================================
// PDF GENERATION FUNCTIONS
// =====================================

/**
 * Generate a certificate PDF buffer
 */
export async function generateCertificate({
  holderName,
  courseName,
  completionDate,
  ceHours,
  certificateNumber,
  instructorName = 'CounselorReady',
  acepNumber = 'ACEP #7760'
}) {
  return new Promise((resolve, reject) => {
    try {
      // Create PDF document
      const doc = new PDFDocument({
        size: 'LETTER',
        layout: 'landscape',
        margin: 50
      });
      
      const chunks = [];
      
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve(pdfBuffer);
      });
      
      doc.on('error', reject);
      
      // Format date
      const formattedDate = new Date(completionDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      // === CERTIFICATE DESIGN ===
      
      // Background gradient effect (light blue to white)
      doc.rect(0, 0, doc.page.width, doc.page.height)
         .fill('#f8fafc');
      
      // Decorative border
      const borderMargin = 30;
      doc.rect(borderMargin, borderMargin, doc.page.width - (borderMargin * 2), doc.page.height - (borderMargin * 2))
         .lineWidth(3)
         .stroke('#10B981');
      
      // Inner decorative border
      doc.rect(borderMargin + 10, borderMargin + 10, doc.page.width - (borderMargin * 2) - 20, doc.page.height - (borderMargin * 2) - 20)
         .lineWidth(1)
         .stroke('#06B6D4');
      
      // Header
      doc.fontSize(14)
         .fillColor('#64748b')
         .text('COUNSELORREADY', 0, 60, { align: 'center' });
      
      doc.fontSize(10)
         .fillColor('#94a3b8')
         .text('NBCC Approved Continuing Education Provider #7760', 0, 78, { align: 'center' });
      
      // Main title
      doc.fontSize(36)
         .fillColor('#1e293b')
         .font('Helvetica-Bold')
         .text('Certificate of Completion', 0, 110, { align: 'center' });
      
      // Decorative line
      const lineY = 160;
      doc.moveTo(doc.page.width / 2 - 150, lineY)
         .lineTo(doc.page.width / 2 + 150, lineY)
         .lineWidth(2)
         .stroke('#10B981');
      
      // "This certifies that"
      doc.fontSize(14)
         .fillColor('#64748b')
         .font('Helvetica')
         .text('This certifies that', 0, 190, { align: 'center' });
      
      // Holder name
      doc.fontSize(28)
         .fillColor('#1e293b')
         .font('Helvetica-Bold')
         .text(holderName, 0, 220, { align: 'center' });
      
      // "has successfully completed"
      doc.fontSize(14)
         .fillColor('#64748b')
         .font('Helvetica')
         .text('has successfully completed', 0, 260, { align: 'center' });
      
      // Course name
      doc.fontSize(20)
         .fillColor('#1e293b')
         .font('Helvetica-Bold')
         .text(courseName, 0, 290, { align: 'center', width: doc.page.width - 100 });
      
      // CE Hours
      doc.fontSize(16)
         .fillColor('#64748b')
         .font('Helvetica')
         .text(`${ceHours} Continuing Education Hours`, 0, 340, { align: 'center' });
      
      // Completion date
      doc.fontSize(14)
         .fillColor('#64748b')
         .text(`Completed on ${formattedDate}`, 0, 370, { align: 'center' });
      
      // Certificate number
      doc.fontSize(12)
         .fillColor('#94a3b8')
         .text(`Certificate #${certificateNumber}`, 0, 400, { align: 'center' });
      
      // Bottom section
      const leftX = 100;
      const rightX = doc.page.width - 250;
      const signatureY = 460;
      
      // Left side - Instructor
      doc.fontSize(12)
         .fillColor('#1e293b')
         .text(instructorName, leftX, signatureY, { align: 'center', width: 200 });
      
      doc.moveTo(leftX, signatureY - 10)
         .lineTo(leftX + 200, signatureY - 10)
         .lineWidth(1)
         .stroke('#cbd5e1');
      
      doc.fontSize(10)
         .fillColor('#64748b')
         .text('Instructor', leftX, signatureY + 20, { align: 'center', width: 200 });
      
      // Right side - Provider
      doc.fontSize(12)
         .fillColor('#1e293b')
         .text('CounselorReady', rightX, signatureY, { align: 'center', width: 200 });
      
      doc.moveTo(rightX, signatureY - 10)
         .lineTo(rightX + 200, signatureY - 10)
         .lineWidth(1)
         .stroke('#cbd5e1');
      
      doc.fontSize(10)
         .fillColor('#64748b')
         .text(`NBCC Provider ${acepNumber}`, rightX, signatureY + 20, { align: 'center', width: 200 });
      
      // Footer
      doc.fontSize(8)
         .fillColor('#94a3b8')
         .text('This certificate verifies completion of continuing education requirements', 0, 500, { align: 'center' });
      
      doc.text('GAITP LLC | counselorready.com', 0, 515, { align: 'center' });
      
      // Finalize the PDF
      doc.end();
      
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Generate unique certificate number
 */
export async function generateCertificateNumber() {
  const year = new Date().getFullYear();
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  
  // Format: CR-YYYY-XXXXXX (where X is timestamp + random)
  return `CR-${year}-${timestamp.toString().slice(-6)}${random.toString().padStart(3, '0')}`;
}

// =====================================
// CLOUDINARY SIGNED URL FUNCTIONS
// =====================================

/**
 * Generate a signed URL for secure certificate access
 */
export function generateSignedCertificateUrl(publicId, options = {}) {
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
 */
export function extractPublicIdFromUrl(cloudinaryUrl) {
  if (!cloudinaryUrl) return null;
  
  try {
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

// Default export for backward compatibility
export default {
  generateCertificate,
  generateCertificateNumber,
  generateSignedCertificateUrl,
  extractPublicIdFromUrl
};
