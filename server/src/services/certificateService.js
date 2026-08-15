/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * ⚠️  THIS IS NOT THE PLATFORM CERTIFICATE GENERATOR.
 *
 * The generator is utils/certificate.js. It is used by interactiveCourseRoutes.js,
 * liveSessionCompletionService.js, certificateSelfHeal.js, certificates.js,
 * admin.js, and the repair scripts. Certificates produced by that module carry
 * the delivery-format designation (synchronous / asynchronous) required by
 * GA Board Rule 135-9-.01(4)(c), plus approval blocks and learning objectives.
 *
 * generatePDF() in THIS file produces none of those. It is unreachable from the
 * running application — its only remaining caller is scripts/bulkRegenerateBadCerts.js.
 *
 * This module survives solely for deletePDF(), used by routes/admin.js.
 *
 * Do not add certificate features here. Do not route new certificate issuance here.
 */
// Certificate PDF Generation Service for CounselorReady
// Professional branded certificate with NBCC ACEP #7760 branding
// ============================================================

import PDFDocument from 'pdfkit';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Brand colors
const BURGUNDY = '#6B1D34';
const HUNTER_GREEN = '#4A7C59';
const HONEY_GOLD = '#D4A855';
const NAVY = '#284157';

/**
 * Generate a branded certificate PDF and upload to Cloudinary.
 * @param {Object} options
 * @param {string} options.certificateNumber - e.g. "CR-2026-966634639"
 * @param {string} options.userName - Full name of the learner
 * @param {string} options.courseTitle - Course title
 * @param {Date|string} options.completionDate - Date object or ISO string
 * @param {number} options.ceHours - Number of CE hours
 * @param {string} [options.nbccNumber] - User's NBCC number (optional)
 * @param {string} [options.providerNumber='7760'] - Provider number
 * @param {string} [options.template='standard'] - Template name
 * @returns {Promise<string>} Cloudinary secure_url of the uploaded PDF
 */
export async function generatePDF({
  certificateNumber,
  userName,
  courseTitle,
  completionDate,
  ceHours,
  nbccNumber = '',
  providerNumber = '7760',
  template = 'standard'
}) {
  // Generate the PDF buffer
  const pdfBuffer = await new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'LETTER',
        layout: 'landscape',
        margin: 0
      });

      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const W = 792; // landscape Letter width
      const H = 612; // landscape Letter height

      const formattedDate = new Date(completionDate).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      });

      // === CERTIFICATE DESIGN ===

      // 1. Background — white with subtle warm tint
      doc.rect(0, 0, W, H).fill('#FFFDF9');

      // 2. Outer border — 3pt burgundy, 25pt margin
      doc.rect(25, 25, W - 50, H - 50)
        .lineWidth(3)
        .stroke(BURGUNDY);

      // 3. Inner border — 1pt honey/gold, 35pt margin
      doc.rect(35, 35, W - 70, H - 70)
        .lineWidth(1)
        .stroke(HONEY_GOLD);

      // 4. Corner accents — small gold diamonds at each corner of inner border
      const corners = [
        [35, 35],
        [W - 35, 35],
        [35, H - 35],
        [W - 35, H - 35]
      ];
      for (const [cx, cy] of corners) {
        const s = 6;
        doc.save();
        doc.path(`M ${cx} ${cy - s} L ${cx + s} ${cy} L ${cx} ${cy + s} L ${cx - s} ${cy} Z`)
          .fill(HONEY_GOLD);
        doc.restore();
      }

      // 5. Header area — CounselorReady wordmark
      let y = 70;

      // "Counselor" in burgundy + "Ready" in hunter green on same line
      const wordmarkFontSize = 16;
      const counselorWidth = doc.font('Helvetica-Bold').fontSize(wordmarkFontSize).widthOfString('Counselor');
      const readyWidth = doc.font('Helvetica-Bold').fontSize(wordmarkFontSize).widthOfString('Ready');
      const totalWidth = counselorWidth + readyWidth;
      const startX = (W - totalWidth) / 2;

      doc.font('Helvetica-Bold').fontSize(wordmarkFontSize)
        .fillColor(BURGUNDY)
        .text('Counselor', startX, y, { continued: false, lineBreak: false });
      doc.font('Helvetica-Bold').fontSize(wordmarkFontSize)
        .fillColor(HUNTER_GREEN)
        .text('Ready', startX + counselorWidth, y, { lineBreak: false });

      y += 24;

      // "Continuing Education" subtitle
      doc.font('Helvetica').fontSize(10)
        .fillColor(NAVY)
        .text('Continuing Education', 0, y, { align: 'center', width: W });

      y += 18;

      // Gold horizontal rule — 200pt wide, centered
      const ruleStart = (W - 200) / 2;
      doc.moveTo(ruleStart, y).lineTo(ruleStart + 200, y)
        .lineWidth(1.5)
        .stroke(HONEY_GOLD);

      y += 20;

      // 6. Main title — "Certificate of Completion"
      doc.font('Helvetica-Bold').fontSize(32)
        .fillColor(BURGUNDY)
        .text('Certificate of Completion', 0, y, { align: 'center', width: W });

      y += 48;

      // 7. "This certifies that"
      doc.font('Helvetica').fontSize(12)
        .fillColor(NAVY)
        .text('This certifies that', 0, y, { align: 'center', width: W });

      y += 24;

      // 8. Learner name — large bold
      doc.font('Helvetica-Bold').fontSize(26)
        .fillColor(NAVY)
        .text(userName, 0, y, { align: 'center', width: W });

      y += 38;

      // Gold line under name — 250pt
      const nameRuleStart = (W - 250) / 2;
      doc.moveTo(nameRuleStart, y).lineTo(nameRuleStart + 250, y)
        .lineWidth(1)
        .stroke(HONEY_GOLD);

      y += 18;

      // 9. "has successfully completed"
      doc.font('Helvetica').fontSize(12)
        .fillColor(NAVY)
        .text('has successfully completed', 0, y, { align: 'center', width: W });

      y += 22;

      // Course title
      doc.font('Helvetica-Bold').fontSize(18)
        .fillColor(BURGUNDY)
        .text(courseTitle, 60, y, { align: 'center', width: W - 120 });

      y += 30;

      // CE hours line
      doc.font('Helvetica').fontSize(12)
        .fillColor(NAVY)
        .text(`${ceHours} Continuing Education Contact Hours`, 0, y, { align: 'center', width: W });

      // 10. Footer area
      const footerY = H - 100;

      // Left column — provider info
      doc.font('Helvetica').fontSize(9)
        .fillColor(NAVY)
        .text('Provider: GA Integrated Therapeutic Perspectives LLC', 55, footerY, { width: 250 });
      doc.font('Helvetica').fontSize(9)
        .fillColor(NAVY)
        .text(`NBCC Approved Provider #${providerNumber}`, 55, footerY + 13, { width: 250 });

      // Center — completion date
      doc.font('Helvetica').fontSize(10)
        .fillColor(NAVY)
        .text(formattedDate, 0, footerY + 4, { align: 'center', width: W });

      // Right column — certificate number
      doc.font('Helvetica').fontSize(9)
        .fillColor(NAVY)
        .text(`Certificate No: ${certificateNumber}`, W - 305, footerY, { width: 250, align: 'right' });

      // Bottom center — presenter
      doc.font('Helvetica').fontSize(8)
        .fillColor(NAVY)
        .text('Presenter: Kejuiana Johnson, MA, LPC, NCC, CPCS, BC-TMH', 0, footerY + 35, { align: 'center', width: W });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });

  // Upload PDF to Cloudinary
  const uploadResult = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        folder: 'certificates',
        public_id: `cert_${certificateNumber}_${Date.now()}.pdf`
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    const readable = new Readable();
    readable.push(pdfBuffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });

  return uploadResult.secure_url;
}

export default { generatePDF };
