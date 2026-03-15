/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
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
 * @param {Object} options - Certificate data
 * @param {Object} [customization] - Visual customization from course settings
 */
export async function generateCertificate({
  holderName,
  courseName,
  completionDate,
  ceHours,
  certificateNumber,
  instructorName = 'CounselorReady',
  acepNumber = 'ACEP #7760',
  verificationCode,
  customization = {}
}) {
  return new Promise((resolve, reject) => {
    try {
      const c = {
        layout: customization.layout || 'classic',
        orientation: customization.orientation || 'landscape',
        borderColor: customization.borderColor || '#10B981',
        accentColor: customization.accentColor || '#06B6D4',
        headerColor: customization.headerColor || '#1e293b',
        textColor: customization.textColor || '#64748b',
        backgroundColor: customization.backgroundColor || '#f8fafc',
        signerName: customization.signerName || 'CounselorReady',
        signerTitle: customization.signerTitle || `NBCC Provider ${acepNumber}`,
        certificateTitle: customization.certificateTitle || 'Certificate of Completion',
        customFooter: customization.customFooter || '',
        showVerificationCode: customization.showVerificationCode !== false,
        showCeHours: customization.showCeHours !== false,
        showCompletionDate: customization.showCompletionDate !== false,
        showNbccLogo: customization.showNbccLogo !== false
      };

      const doc = new PDFDocument({
        size: 'LETTER',
        layout: c.orientation,
        margin: 50
      });

      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const formattedDate = new Date(completionDate).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      });

      const W = doc.page.width;
      const H = doc.page.height;

      // ── Background ──
      doc.rect(0, 0, W, H).fill(c.backgroundColor);

      if (c.layout === 'classic' || c.layout === 'elegant') {
        // Double border
        const bm = 30;
        doc.rect(bm, bm, W - bm * 2, H - bm * 2).lineWidth(3).stroke(c.borderColor);
        doc.rect(bm + 10, bm + 10, W - bm * 2 - 20, H - bm * 2 - 20).lineWidth(1).stroke(c.accentColor);
      } else if (c.layout === 'modern') {
        // Top accent bar
        doc.rect(0, 0, W, 12).fill(c.borderColor);
        doc.rect(0, H - 12, W, 12).fill(c.borderColor);
      } else if (c.layout === 'minimal') {
        // Thin top line only
        doc.rect(50, 40, W - 100, 2).fill(c.borderColor);
        doc.rect(50, H - 42, W - 100, 2).fill(c.borderColor);
      }

      // ── Y positions scale with orientation ──
      const isLandscape = c.orientation === 'landscape';
      const yScale = isLandscape ? 1 : 1.3;
      let yPos = isLandscape ? 60 : 80;

      // ── Header ──
      doc.fontSize(14).fillColor(c.textColor).text('COUNSELORREADY', 0, yPos, { align: 'center' });
      yPos += 18;
      if (c.showNbccLogo) {
        doc.fontSize(10).fillColor('#94a3b8').text('NBCC Approved Continuing Education Provider #7760', 0, yPos, { align: 'center' });
        yPos += 22;
      } else {
        yPos += 12;
      }

      // ── Title ──
      const titleSize = c.layout === 'elegant' ? 40 : 36;
      doc.fontSize(titleSize).fillColor(c.headerColor).font('Helvetica-Bold')
         .text(c.certificateTitle, 0, yPos, { align: 'center' });
      yPos += titleSize + 14;

      // Decorative line
      if (c.layout !== 'minimal') {
        doc.moveTo(W / 2 - 150, yPos).lineTo(W / 2 + 150, yPos).lineWidth(2).stroke(c.borderColor);
      }
      yPos += 20;

      // ── "This certifies that" ──
      doc.fontSize(14).fillColor(c.textColor).font('Helvetica')
         .text('This certifies that', 0, yPos, { align: 'center' });
      yPos += 28;

      // ── Holder name ──
      const nameSize = c.layout === 'elegant' ? 32 : 28;
      doc.fontSize(nameSize).fillColor(c.headerColor).font('Helvetica-Bold')
         .text(holderName, 0, yPos, { align: 'center' });
      yPos += nameSize + 12;

      // ── "has successfully completed" ──
      doc.fontSize(14).fillColor(c.textColor).font('Helvetica')
         .text('has successfully completed', 0, yPos, { align: 'center' });
      yPos += 26;

      // ── Course name ──
      doc.fontSize(20).fillColor(c.headerColor).font('Helvetica-Bold')
         .text(courseName, 50, yPos, { align: 'center', width: W - 100 });
      yPos += 40;

      // ── CE Hours ──
      if (c.showCeHours) {
        doc.fontSize(16).fillColor(c.textColor).font('Helvetica')
           .text(`${ceHours} Continuing Education Hours`, 0, yPos, { align: 'center' });
        yPos += 26;
      }

      // ── Completion date ──
      if (c.showCompletionDate) {
        doc.fontSize(14).fillColor(c.textColor)
           .text(`Completed on ${formattedDate}`, 0, yPos, { align: 'center' });
        yPos += 24;
      }

      // ── Certificate number ──
      doc.fontSize(12).fillColor('#94a3b8')
         .text(`Certificate #${certificateNumber}`, 0, yPos, { align: 'center' });
      yPos += 20;

      // ── Verification code ──
      if (c.showVerificationCode && verificationCode) {
        doc.fontSize(10).fillColor('#94a3b8')
           .text(`Verification: counselorready.com/verify/${verificationCode}`, 0, yPos, { align: 'center' });
        yPos += 20;
      }

      // ── Signature section ──
      const sigY = Math.max(yPos + 20, isLandscape ? 460 : 620);
      const leftX = 100;
      const rightX = W - 250;

      // Left side - Instructor
      doc.moveTo(leftX, sigY - 10).lineTo(leftX + 200, sigY - 10).lineWidth(1).stroke('#cbd5e1');
      doc.fontSize(12).fillColor(c.headerColor).text(instructorName, leftX, sigY, { align: 'center', width: 200 });
      doc.fontSize(10).fillColor(c.textColor).text('Instructor', leftX, sigY + 20, { align: 'center', width: 200 });

      // Right side - Provider
      doc.moveTo(rightX, sigY - 10).lineTo(rightX + 200, sigY - 10).lineWidth(1).stroke('#cbd5e1');
      doc.fontSize(12).fillColor(c.headerColor).text(c.signerName, rightX, sigY, { align: 'center', width: 200 });
      doc.fontSize(10).fillColor(c.textColor).text(c.signerTitle, rightX, sigY + 20, { align: 'center', width: 200 });

      // ── Footer ──
      const footerY = sigY + 50;
      if (c.customFooter) {
        doc.fontSize(8).fillColor('#94a3b8').text(c.customFooter, 0, footerY, { align: 'center' });
      } else {
        doc.fontSize(8).fillColor('#94a3b8')
           .text('This certificate verifies completion of continuing education requirements', 0, footerY, { align: 'center' });
      }
      doc.fontSize(8).fillColor('#94a3b8').text('GAITP LLC | counselorready.com', 0, footerY + 14, { align: 'center' });

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
