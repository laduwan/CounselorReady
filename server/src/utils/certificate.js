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
    doc.text('Ga Integrated Therapeutic Perspectives', 0, 46, { align: 'center', width: W });

    // Website URL
    doc.font('Helvetica').fontSize(9).fillColor(HUNTER_GREEN);
    doc.text('https://GaIntegratedPerspectives.com', 0, 72, { align: 'center', width: W });

    // ACEP provider line
    doc.font('Helvetica-Bold').fontSize(9).fillColor(HUNTER_GREEN);
    doc.text(`ACEP PROVIDER #${String(acepNumber).replace(/[^\d]/g, '') || '7760'}`, 0, 85, { align: 'center', width: W });

    // ── CERTIFICATE TITLE ──
    doc.font('Times-Italic').fontSize(28).fillColor(BURGUNDY);
    doc.text('Certificate of Completion', 0, 104, { align: 'center', width: W });

    // ── CERTIFIES THAT + LEARNER NAME ──
    doc.font('Times-Roman').fontSize(12).fillColor(NAVY);
    doc.text('This is to certify that', 0, 140, { align: 'center', width: W });

    // Learner name — large, underlined
    const nameY = 170;
    doc.font('Times-Bold').fontSize(26).fillColor(BURGUNDY);
    const nameWidth = doc.widthOfString(holderName);
    const nameX = (W - nameWidth) / 2;
    doc.text(holderName, 0, nameY, { align: 'center', width: W });
    // Underline
    doc.moveTo(nameX, nameY + 30).lineTo(nameX + nameWidth, nameY + 30).lineWidth(1).stroke(BURGUNDY);

    // "has successfully completed the course"
    doc.font('Times-Roman').fontSize(12).fillColor(NAVY);
    doc.text('has successfully completed the course', 0, 208, { align: 'center', width: W });

    // ── COURSE TITLE ──
    const titleFontSize = courseName.length > 50 ? 16 : 20;
    doc.font('Times-Bold').fontSize(titleFontSize).fillColor(HUNTER_GREEN);
    doc.text(courseName, 60, 228, { align: 'center', width: W - 120 });

    // ── COMPLETION DATE (after course title) ──
    const dateY = courseName.length > 50 ? 258 : 255;
    doc.font('Helvetica').fontSize(10).fillColor(NAVY);
    doc.text(`Completed ${formattedDate}`, 0, dateY, { align: 'center', width: W });

    // ── INSTRUCTOR + ASYNCHRONOUS ──
    const instrY = dateY + 24;
    doc.font('Helvetica').fontSize(10).fillColor(NAVY);
    doc.text(`Instructor: ${instructorName}`, 0, instrY, { align: 'center', width: W });
    doc.font('Helvetica-Oblique').fontSize(9).fillColor(DARK_GREEN);
    doc.text('Asynchronous', 0, instrY + 14, { align: 'center', width: W });

    // ── LEARNING OBJECTIVES (3–5 listed, centered) ──
    let nextY = instrY + 38;
    const objsToShow = objectives.slice(0, 5);
    if (objsToShow.length > 0) {
      doc.font('Helvetica-Bold').fontSize(9).fillColor(HUNTER_GREEN);
      doc.text('Learning Objectives:', 120, nextY, { width: W - 240, align: 'center' });
      nextY += 13;
      doc.font('Helvetica').fontSize(8).fillColor(NAVY);
      objsToShow.forEach((obj, i) => {
        const text = `Objective ${i + 1}: ${String(obj).substring(0, 120)}`;
        doc.text(text, 130, nextY, { width: W - 260, align: 'center' });
        nextY += 11;
      });
    }

    // ── BOTTOM SECTION: three columns (CE info | NBCC seal | signature) ──
    const sigY = Math.max(nextY + 35, 410);
    const colW = (W - 120) / 3;
    const leftX = 60;
    const centerX = 60 + colW;
    const rightX = 60 + colW * 2;
    const lineY = sigY + 40;

    // LEFT: content area + CE hours ABOVE line, cert # BELOW line
    doc.font('Helvetica-Bold').fontSize(10).fillColor(NAVY);
    const ceLabel = ceCategory
      ? `${ceHours} CE Hour${ceHours !== 1 ? 's' : ''}  •  ${ceCategory}`
      : `${ceHours} CE Hour${ceHours !== 1 ? 's' : ''}`;
    doc.text(ceLabel, leftX, sigY + 22, { width: colW, align: 'center' });
    doc.moveTo(leftX + 20, lineY).lineTo(leftX + colW - 20, lineY).lineWidth(0.5).stroke('#999999');
    doc.font('Helvetica').fontSize(8).fillColor(NAVY);
    doc.text(`Certificate #: ${certificateNumber}`, leftX, lineY + 5, { width: colW, align: 'center' });

    // CENTER: NBCC seal
    try {
      if (fs.existsSync(NBCC_SEAL_PATH)) {
        const sealSize = 72;
        doc.image(NBCC_SEAL_PATH, centerX + (colW - sealSize) / 2, sigY - 2, { width: sealSize, height: sealSize });
      }
    } catch (e) { /* no seal image */ }

    // RIGHT: signature image ABOVE line, instructor printed name + ACEP # BELOW line
    try {
      if (fs.existsSync(SIGNATURE_PATH)) {
        doc.image(SIGNATURE_PATH, rightX + (colW - 130) / 2, sigY, { width: 130, height: 38 });
      }
    } catch (e) { /* no signature image */ }
    doc.moveTo(rightX + 20, lineY).lineTo(rightX + colW - 20, lineY).lineWidth(0.5).stroke('#999999');
    doc.font('Helvetica-Bold').fontSize(8).fillColor(NAVY);
    doc.text(instructorName, rightX, lineY + 5, { width: colW, align: 'center' });
    doc.font('Helvetica').fontSize(7).fillColor('#666666');
    doc.text(`ACEP PROVIDER #${String(acepNumber).replace(/[^\d]/g, '') || '7760'}`, rightX, lineY + 17, { width: colW, align: 'center' });

    // ── FOOTER: GaITP contact info + verify URL ──
    const footerY = H - 50;
    doc.font('Helvetica').fontSize(7).fillColor('#555555');
    doc.text(
      'Ga Integrated Therapeutic Perspectives, LLC  •  202 E General Stewart Way, Hinesville, GA 31313  •  678-664-4003  •  info@gaintegratedperspectives.com',
      40, footerY, { align: 'center', width: W - 80 }
    );
    doc.font('Helvetica-Bold').fontSize(7).fillColor('#777777');
    doc.text('Verify at counselorready.com/verify', 0, footerY + 13, { align: 'center', width: W });

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
