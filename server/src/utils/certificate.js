/**
 * CounselorReady Certificate Generator
 * NBCC ACEP #7760 Compliant CE Certificates
 * Uses PDFKit — produces landscape Letter PDF with brand design
 */

import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOGO_PATH = path.join(__dirname, '../templates/logo.jpg');
const SIGNATURE_PATH = path.join(__dirname, '../templates/signature.png');
const NBCC_SEAL_PATH = path.join(__dirname, '../templates/nbcc-acep-logo.jpg');

// CounselorReady brand colors
const BURGUNDY = '#6B1D34';
const HUNTER_GREEN = '#4A7C59';
const DARK_GREEN = '#3D6A4A';
const HONEY_GOLD = '#D4A855';
const NAVY = '#284157';

/**
 * Generate an NBCC ACEP compliant certificate PDF
 * @param {Object} data
 * @param {string} data.holderName - Learner's full name
 * @param {string} data.courseName - Course title
 * @param {Date}   data.completionDate - Date completed
 * @param {number} data.ceHours - CE clock hours awarded
 * @param {string} data.certificateNumber - Unique cert ID (e.g., CR-2026-XXXXXX)
 * @param {string} [data.acepNumber] - ACEP provider number (default: '#7760')
 * @param {string} [data.instructorName] - Instructor/presenter name
 * @param {string} [data.verificationCode] - Verification code for online lookup
 * @param {string} [data.ceCategory] - NBCC content area
 * @param {string[]} [data.objectives] - Learning objectives array
 * @param {string} [data.approvingBody] - e.g., 'NBCC'
 * @returns {Promise<Buffer>} PDF buffer
 */
export async function generateCertificate(data) {
  const holderName = String(data.holderName || 'Participant');
  const courseName = String(data.courseName || 'Course');
  const ceHours = Number(data.ceHours) || 1;
  const certificateNumber = String(data.certificateNumber || 'CR-000000');
  const acepNumber = String(data.acepNumber || 'ACEP #7760');
  const instructorName = String(data.instructorName || 'Kejuiana Johnson, MA, LPC, NCC, CPCS, BC-TMH');
  const verificationCode = data.verificationCode || certificateNumber;
  const ceCategory = data.ceCategory || '';
  const objectives = Array.isArray(data.objectives) ? data.objectives : [];
  const approvingBody = data.approvingBody || 'NBCC';
  const completionDate = data.completionDate || new Date();

  const formattedDate = new Date(completionDate).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'LETTER',
      layout: 'landscape',
      margins: { top: 40, bottom: 40, left: 50, right: 50 },
      info: {
        Title: `CounselorReady Certificate - ${courseName}`,
        Author: 'GA Integrated Therapeutic Perspectives LLC',
        Subject: 'Continuing Education Certificate',
        Creator: 'CounselorReady'
      }
    });

    const chunks = [];
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const W = doc.page.width;
    const H = doc.page.height;

    // ── WHITE BACKGROUND ──
    doc.rect(0, 0, W, H).fill('#FFFFFF');

    // ── TRIPLE DECORATIVE BORDERS ──
    // Outer: Burgundy
    doc.rect(15, 15, W - 30, H - 30).lineWidth(3).stroke(BURGUNDY);
    // Middle: Gold
    doc.rect(22, 22, W - 44, H - 44).lineWidth(1).stroke(HONEY_GOLD);
    // Inner: Hunter Green
    doc.rect(28, 28, W - 56, H - 56).lineWidth(2).stroke(HUNTER_GREEN);

    // ── LOGO WATERMARK (centered, faint) ──
    try {
      if (fs.existsSync(LOGO_PATH)) {
        doc.opacity(0.06).image(LOGO_PATH, (W - 160) / 2, (H - 160) / 2 - 10, { width: 160, height: 160 });
        doc.opacity(1);
      }
    } catch (e) { doc.opacity(1); }

    // ── HEADER: Provider Name ──
    doc.font('Times-Italic').fontSize(22).fillColor(HUNTER_GREEN);
    doc.text('Ga Integrated Therapeutic Perspectives, LLC', 0, 48, { align: 'center', width: W });

    // ACEP line
    doc.font('Helvetica-Bold').fontSize(9).fillColor(HUNTER_GREEN);
    doc.text(`${approvingBody} Approved Continuing Education Provider, ${acepNumber}`, 0, 73, { align: 'center', width: W });

    // ── CERTIFICATE TITLE ──
    doc.font('Times-Italic').fontSize(28).fillColor(BURGUNDY);
    doc.text('Certificate of Completion', 0, 95, { align: 'center', width: W });

    // Home Study indicator
    doc.font('Helvetica').fontSize(8).fillColor(DARK_GREEN);
    doc.text('Home Study Program', 0, 126, { align: 'center', width: W });

    // ── CERTIFIES THAT + LEARNER NAME ──
    doc.font('Times-Roman').fontSize(12).fillColor(NAVY);
    doc.text('This certifies that', 0, 148, { align: 'center', width: W });

    // Learner name — large, underlined
    const nameY = 168;
    doc.font('Times-Bold').fontSize(26).fillColor(BURGUNDY);
    const nameWidth = doc.widthOfString(holderName);
    const nameX = (W - nameWidth) / 2;
    doc.text(holderName, 0, nameY, { align: 'center', width: W });
    // Underline
    doc.moveTo(nameX, nameY + 30).lineTo(nameX + nameWidth, nameY + 30).lineWidth(1).stroke(BURGUNDY);

    // "has successfully completed"
    doc.font('Times-Roman').fontSize(12).fillColor(NAVY);
    doc.text('has successfully completed', 0, 206, { align: 'center', width: W });

    // ── COURSE TITLE ──
    const titleFontSize = courseName.length > 50 ? 16 : 20;
    doc.font('Times-Bold').fontSize(titleFontSize).fillColor(HUNTER_GREEN);
    doc.text(courseName, 60, 225, { align: 'center', width: W - 120 });

    // ── COMPLETION DATE (after course title) ──
    const dateY = courseName.length > 50 ? 255 : 250;
    doc.font('Helvetica').fontSize(10).fillColor(NAVY);
    doc.text(`Completed ${formattedDate}`, 0, dateY, { align: 'center', width: W });

    // ── INSTRUCTOR + ASYNCHRONOUS (spaced down 2 lines after date) ──
    const instrY = dateY + 28;
    doc.font('Helvetica').fontSize(10).fillColor(NAVY);
    doc.text(`Instructor: ${instructorName}`, 0, instrY, { align: 'center', width: W });
    doc.font('Helvetica-Oblique').fontSize(9).fillColor(DARK_GREEN);
    doc.text('Asynchronous', 0, instrY + 15, { align: 'center', width: W });

    // ── LEARNING OBJECTIVES (if provided, compact, centered, spaced down) ──
    let nextY = instrY + 55;
    if (objectives.length > 0 && objectives.length <= 6) {
      nextY += 4;
      doc.font('Helvetica-Bold').fontSize(9).fillColor(HUNTER_GREEN);
      doc.text('Learning Objectives:', 120, nextY, { width: W - 240, align: 'center' });
      nextY += 13;
      doc.font('Helvetica').fontSize(8).fillColor(NAVY);
      objectives.forEach((obj, i) => {
        const text = `${i + 1}. ${String(obj).substring(0, 120)}`;
        doc.text(text, 130, nextY, { width: W - 260, align: 'center' });
        nextY += 11;
      });
    }

    // ── SIGNATURE SECTION (two columns, spaced down 2-3 lines) ──
    const sigY = Math.max(nextY + 40, 395);
    const sigColW = (W - 120) / 2;

    // Left: Content area / CE hours above line, Certificate # below line
    const ceLabel = ceCategory
      ? `${ceCategory} / ${ceHours} CE Hour${ceHours !== 1 ? 's' : ''}`
      : `${ceHours} CE Hour${ceHours !== 1 ? 's' : ''}`;
    doc.font('Helvetica').fontSize(9).fillColor(NAVY);
    doc.text(ceLabel, 60, sigY + 22, { width: sigColW, align: 'center' });
    doc.moveTo(60 + 30, sigY + 35).lineTo(60 + sigColW - 30, sigY + 35).lineWidth(0.5).stroke('#999999');
    doc.font('Helvetica').fontSize(8).fillColor(NAVY);
    doc.text(`Certificate #: ${certificateNumber}`, 60, sigY + 40, { width: sigColW, align: 'center' });

    // NBCC SEAL (centered between the two signature columns)
    try {
      if (fs.existsSync(NBCC_SEAL_PATH)) {
        const sealSize = 70;
        doc.image(NBCC_SEAL_PATH, (W - sealSize) / 2, sigY - 5, { width: sealSize, height: sealSize });
      }
    } catch (e) { /* no seal image */ }

    // Right: Authorized Signature
    try {
      if (fs.existsSync(SIGNATURE_PATH)) {
        doc.image(SIGNATURE_PATH, (60 + sigColW + sigColW / 2) - 60, sigY - 5, { width: 120, height: 40 });
      }
    } catch (e) { /* no signature image */ }

    doc.moveTo(60 + sigColW + 30, sigY + 35).lineTo(60 + sigColW * 2 - 30, sigY + 35).lineWidth(0.5).stroke('#999999');
    doc.font('Helvetica').fontSize(8).fillColor(NAVY);
    doc.text(instructorName, 60 + sigColW, sigY + 40, { width: sigColW, align: 'center' });
    doc.font('Helvetica').fontSize(7).fillColor('#666666');
    doc.text('Authorized Signature', 60 + sigColW, sigY + 52, { width: sigColW, align: 'center' });

    // ── FOOTER ──
    const footerY = H - 52;
    doc.font('Helvetica-Bold').fontSize(7).fillColor('#777777');
    doc.text('Verify at counselorready.com/verify', 0, footerY, { align: 'center', width: W });
    doc.font('Helvetica').fontSize(6).fillColor('#AAAAAA');
    doc.text(
      `Ga Integrated Therapeutic Perspectives, LLC has been approved by NBCC as an Approved Continuing Education Provider, ${acepNumber}. ` +
      'Programs that do not qualify for NBCC credit are clearly identified. Ga Integrated Therapeutic Perspectives, LLC is solely responsible for all aspects of the program.',
      50, footerY + 12, { align: 'center', width: W - 100 }
    );

    doc.end();
  });
}

/**
 * Generate a unique certificate number
 */
export async function generateCertificateNumber(courseId, userId) {
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
  return `CR-${year}-${rand}`;
}

/**
 * Generate a signed Cloudinary URL for secure certificate access
 */
export function generateSignedCertificateUrl(publicId, expiresInSeconds = 86400) {
  return cloudinary.url(publicId, {
    resource_type: 'raw',
    type: 'authenticated',
    sign_url: true,
    expires_at: Math.floor(Date.now() / 1000) + expiresInSeconds
  });
}

/**
 * Extract Cloudinary public_id from a URL
 */
export function extractPublicIdFromUrl(url) {
  if (!url) return null;
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const uploadIdx = pathParts.indexOf('upload');
    if (uploadIdx === -1) return null;
    // Skip version segment (v1234567890)
    const startIdx = pathParts[uploadIdx + 1]?.startsWith('v') ? uploadIdx + 2 : uploadIdx + 1;
    return pathParts.slice(startIdx).join('/');
  } catch (e) {
    return null;
  }
}

export default {
  generateCertificate,
  generateCertificateNumber,
  generateSignedCertificateUrl,
  extractPublicIdFromUrl
};
