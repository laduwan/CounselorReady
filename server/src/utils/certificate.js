/**
 * Copyright (c) 2026 GA Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 *
 * CounselorReady Certificate Generator — NBCC ACEP #7760 Compliant
 */

import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATES_DIR  = path.join(__dirname, '../templates');
const GAITP_LOGO_PATH = path.join(TEMPLATES_DIR, 'gaitp-logo.png');
const SIGNATURE_PATH = path.join(TEMPLATES_DIR, 'signature.png');
const NBCC_SEAL_PATH = path.join(TEMPLATES_DIR, 'nbcc-seal.jpg');

const BURGUNDY     = '#6B1D34';
const HUNTER_GREEN = '#4A7C59';
const HUNTER_DARK  = '#3D6A4A';
const HONEY_GOLD   = '#D4A855';
const HONEY_DARK   = '#B8903A';
const NAVY         = '#284157';
const TEXT_GRAY    = '#555555';
const MUTED_GRAY   = '#777777';

const PROVIDER_NAME = 'Ga Integrated Therapeutic Perspectives, LLC';
const ACEP_NUMBER   = '7760';
const VERIFY_URL    = 'counselorready.com/verify';

const NBCC_DISCLAIMER =
  `${PROVIDER_NAME} has been approved by NBCC as an Approved Continuing Education ` +
  `Provider, ACEP #${ACEP_NUMBER}. Programs that do not qualify for NBCC credit are ` +
  `clearly identified. ${PROVIDER_NAME} is solely responsible for all aspects of the program.`;

const DEFAULT_INSTRUCTOR = 'Kejuiana Johnson, MA, LPC, NCC, CPCS, BC-TMH';

// ── Filled diamond accent ──
function drawDiamond(doc, cx, cy, size, color) {
  doc.save().fillColor(color);
  doc.moveTo(cx, cy - size)
     .lineTo(cx + size, cy)
     .lineTo(cx, cy + size)
     .lineTo(cx - size, cy)
     .closePath()
     .fill();
  doc.restore();
}

// ── Decorative horizontal rule with center diamond ──
function drawOrnamentalRule(doc, cx, y, halfWidth, color) {
  doc.save().lineWidth(0.8).strokeColor(color);
  doc.moveTo(cx - halfWidth, y).lineTo(cx - 8, y).stroke();
  doc.moveTo(cx + 8, y).lineTo(cx + halfWidth, y).stroke();
  doc.fillColor(color);
  const d = 3;
  doc.moveTo(cx, y - d).lineTo(cx + d, y).lineTo(cx, y + d).lineTo(cx - d, y).closePath().fill();
  doc.restore();
}

export async function generateCertificate(data) {
  const holderName        = String(data.holderName || 'Participant').trim();
  const courseName        = String(data.courseName || 'Course').trim();
  const ceHours           = Number(data.ceHours) || 1;
  const certificateNumber = String(data.certificateNumber || 'CR-000000');
  const verificationCode  = String(data.verificationCode || certificateNumber);
  const acepNumber        = String(data.acepNumber || ACEP_NUMBER).replace(/[^\d]/g, '') || ACEP_NUMBER;
  const instructorName    = String(data.instructorName || DEFAULT_INSTRUCTOR);
  const ceCategory        = String(data.ceCategory || '').trim();
  const objectives        = Array.isArray(data.objectives) ? data.objectives.slice(0, 5) : [];
  const completionDate    = data.completionDate ? new Date(data.completionDate) : new Date();

  // Approvals — data-driven multi-body block. Falls back to NBCC-only.
  const approvals = Array.isArray(data.approvals) && data.approvals.length
    ? data.approvals
    : [{
        body:     'NBCC',
        code:     `ACEP #${acepNumber}`,
        hours:    ceHours,
        category: ceCategory
      }];

  const formattedDate = completionDate.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'LETTER',
        layout: 'landscape',
        margins: { top: 0, bottom: 0, left: 0, right: 0 },
        info: {
          Title:    `Certificate of Completion — ${courseName}`,
          Author:   PROVIDER_NAME,
          Subject:  `${ceHours} CE Hour${ceHours !== 1 ? 's' : ''} — NBCC ACEP #${acepNumber}`,
          Creator:  'CounselorReady',
          Keywords: `NBCC, ACEP, ${acepNumber}, continuing education, ${ceCategory}`
        }
      });

      const chunks = [];
      doc.on('data',  c => chunks.push(c));
      doc.on('end',   () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const W = doc.page.width;
      const H = doc.page.height;
      const cx = W / 2;

      // 1. Paper — warm tint
      doc.rect(0, 0, W, H).fill('#FFFDF8');

      // 2. BURGUNDY OUTER + HUNTER GREEN INNER border
      doc.rect(22, 22, W - 44, H - 44).lineWidth(3).stroke(BURGUNDY);
      doc.rect(34, 34, W - 68, H - 68).lineWidth(1.2).stroke(HUNTER_GREEN);

      // 3. GOLD DIAMOND corner accents — anchored at the burgundy
      //    outer border corners where the eye expects to find them
      const dCorner = 22;  // matches outer border position
      const diamondSize = 5;
      drawDiamond(doc, dCorner,         dCorner,         diamondSize, HONEY_GOLD);
      drawDiamond(doc, W - dCorner,     dCorner,         diamondSize, HONEY_GOLD);
      drawDiamond(doc, dCorner,         H - dCorner,     diamondSize, HONEY_GOLD);
      drawDiamond(doc, W - dCorner,     H - dCorner,     diamondSize, HONEY_GOLD);

      // 4. GAITP logo watermark — centered behind body content at low opacity
      if (fs.existsSync(GAITP_LOGO_PATH)) {
        const wmSize = 240;
        doc.opacity(0.12)
           .image(GAITP_LOGO_PATH, (W - wmSize) / 2, (H - wmSize) / 2 - 10, {
             width: wmSize, height: wmSize
           })
           .opacity(1);
      } else {
        console.warn(`[certificate] GAITP logo missing at ${GAITP_LOGO_PATH}`);
      }

      // 5. HEADER — provider name (HUNTER GREEN bold-italic) + tight credential line
      doc.font('Times-BoldItalic').fontSize(22).fillColor(HUNTER_GREEN)
         .text(PROVIDER_NAME, 0, 56, { align: 'center', width: W });
      doc.font('Times-Italic').fontSize(11).fillColor(BURGUNDY)
         .text(`NBCC Approved Continuing Education Provider  ·  ACEP #${acepNumber}`,
               0, 88, { align: 'center', width: W });

      // 6. HEADLINE — no diamond rule, just confidence
      doc.font('Times-Italic').fontSize(38).fillColor(BURGUNDY)
         .text('Certificate of Completion', 0, 104, { align: 'center', width: W });

      // 7. RECIPIENT BLOCK
      doc.font('Times-Italic').fontSize(12).fillColor(NAVY)
         .text('This certifies that', 0, 158, { align: 'center', width: W });

      const nameY = 180;
      doc.font('Times-Bold').fontSize(28).fillColor(NAVY);
      const nameWidth = doc.widthOfString(holderName);
      const nameX = (W - nameWidth) / 2;
      doc.text(holderName, nameX, nameY, { lineBreak: false });

      // Solid gold hairline under name — heavier weight for marquee emphasis
      const flourishY = nameY + 38;
      const flourishHalfWidth = Math.min(200, nameWidth / 2 + 30);
      doc.save().lineWidth(1.5).strokeColor(HONEY_GOLD)
         .moveTo(cx - flourishHalfWidth, flourishY)
         .lineTo(cx + flourishHalfWidth, flourishY)
         .stroke()
         .restore();

      doc.font('Times-Italic').fontSize(12).fillColor(NAVY)
         .text('has successfully completed', 0, flourishY + 12, { align: 'center', width: W });

      // 8. COURSE TITLE
      const courseY = flourishY + 32;
      const courseFontSize = courseName.length > 70 ? 17 : courseName.length > 45 ? 19 : 22;
      doc.font('Times-Bold').fontSize(courseFontSize).fillColor(BURGUNDY)
         .text(courseName, 70, courseY, { align: 'center', width: W - 140 });

      let cursor = doc.y + 8;

      // 9. COMPLETION + INSTRUCTOR + DELIVERY (consistent rhythm, with extra breath after Completed)
      doc.font('Helvetica').fontSize(11).fillColor(NAVY)
         .text(`Completed ${formattedDate}`, 0, cursor, { align: 'center', width: W });
      cursor += 28;
      doc.font('Helvetica-Bold').fontSize(10).fillColor(NAVY)
         .text(`Instructor: ${instructorName}`, 0, cursor, { align: 'center', width: W });
      cursor += 14;
      doc.font('Helvetica-Oblique').fontSize(9).fillColor(BURGUNDY)
         .text('Asynchronous', 0, cursor, { align: 'center', width: W });
      cursor += 22;

      // 10. LEARNING OBJECTIVES
      const FOOTER_TOP = H - 193;
      const room = FOOTER_TOP - cursor - 8;
      if (objectives.length && room >= 40) {
        doc.font('Times-Italic').fontSize(11).fillColor(HUNTER_GREEN)
           .text('Learning Objectives', 0, cursor, { align: 'center', width: W });
        cursor += 16;
        doc.font('Helvetica').fontSize(8).fillColor(NAVY);
        objectives.forEach((obj, i) => {
          if (cursor + 11 > FOOTER_TOP) return;
          doc.text(`${i + 1}.  ${String(obj).trim()}`, 110, cursor, {
            width: W - 220, align: 'center', lineBreak: false, ellipsis: true
          });
          cursor += 11;
        });
      }

      // ─── BOTTOM ROW — approvals (LEFT) | seal (CENTER) | signature (RIGHT) ───
      const bottomY = H - 188;

      // ── CENTER COLUMN: NBCC seal + small gold serial bar underneath ──
      const sealSize = 70;
      const sealCx = cx;
      if (fs.existsSync(NBCC_SEAL_PATH)) {
        doc.image(NBCC_SEAL_PATH, sealCx - sealSize / 2, bottomY, {
          width: sealSize, height: sealSize
        });
      } else {
        console.warn(`[certificate] NBCC seal missing at ${NBCC_SEAL_PATH}`);
      }

      // Gold serial bar — small, refined, sits under the seal with
      // mitered ribbon ends. Highlights the certificate number.
      const serialBarY = bottomY + sealSize + 6;
      const serialBarH = 18;
      const serialBarW = 200;
      const serialBarX = sealCx - serialBarW / 2;
      const tab = 8;
      doc.save()
         .moveTo(serialBarX, serialBarY)
         .lineTo(serialBarX + serialBarW, serialBarY)
         .lineTo(serialBarX + serialBarW + tab, serialBarY + serialBarH / 2)
         .lineTo(serialBarX + serialBarW, serialBarY + serialBarH)
         .lineTo(serialBarX, serialBarY + serialBarH)
         .lineTo(serialBarX - tab, serialBarY + serialBarH / 2)
         .closePath()
         .fillAndStroke(HONEY_GOLD, HONEY_DARK);
      doc.restore();
      doc.font('Times-Bold').fontSize(9).fillColor(BURGUNDY)
         .text(certificateNumber, serialBarX, serialBarY + 4, {
           width: serialBarW, align: 'center', characterSpacing: 0.8
         });

      // ── LEFT COLUMN: course approval block (data-driven) ──
      // Mirrors the signature column structurally: header label at top,
      // hunter hairline at the SAME Y as signature line, then body content below.
      const apprX = 50;
      const apprW = 220;
      const isSingleNbcc = approvals.length === 1
        && approvals[0].body?.toUpperCase() === 'NBCC';

      // Top label — centered above the line, parallels the signature image position
      doc.font('Times-Italic').fontSize(11).fillColor(HUNTER_GREEN)
         .text('Course Approval', apprX, bottomY + 22, {
           width: apprW, align: 'center'
         });

      // Hunter hairline — SAME Y as signature line for visual symmetry
      doc.save().lineWidth(0.8).strokeColor(HUNTER_GREEN)
         .moveTo(apprX + 30, bottomY + 50)
         .lineTo(apprX + apprW - 30, bottomY + 50)
         .stroke()
         .restore();

      // Body content below the line
      let apprCursor = bottomY + 56;
      approvals.forEach((appr) => {
        const body  = String(appr.body || '').trim();
        const code  = String(appr.code || '').trim();
        const hrs   = Number(appr.hours) || 0;
        const cat   = String(appr.category || '').trim();
        if (!body) return;

        // Body + code header line — omitted for single-NBCC since redundant
        if (!isSingleNbcc) {
          doc.font('Helvetica-Bold').fontSize(8.5).fillColor(NAVY)
             .text(code ? `${body}  ·  ${code}` : body, apprX, apprCursor, {
               width: apprW, align: 'center'
             });
          apprCursor += 11;
        }

        // Hours line
        if (hrs) {
          doc.font('Helvetica-Bold').fontSize(9).fillColor(BURGUNDY)
             .text(`${hrs} CE Hour${hrs !== 1 ? 's' : ''}`, apprX, apprCursor, {
               width: apprW, align: 'center'
             });
          apprCursor += 12;
        }

        // Category line (italic, may wrap)
        if (cat) {
          doc.font('Helvetica-Oblique').fontSize(8).fillColor(TEXT_GRAY)
             .text(cat, apprX, apprCursor, {
               width: apprW, align: 'center', lineBreak: true
             });
          apprCursor = doc.y + 6;
        } else {
          apprCursor += 4;
        }
      });

      // ── RIGHT COLUMN: signature ──
      const sigColX = W - 280;
      const sigColW = 240;
      if (fs.existsSync(SIGNATURE_PATH)) {
        const sigW = 140, sigH = 40;
        doc.image(SIGNATURE_PATH, sigColX + (sigColW - sigW) / 2, bottomY + 4, {
          width: sigW, height: sigH
        });
      } else {
        console.warn(`[certificate] Signature missing at ${SIGNATURE_PATH}`);
      }
      // Solid hunter hairline under signature (different from gold name line)
      doc.save().lineWidth(0.8).strokeColor(HUNTER_GREEN)
         .moveTo(sigColX + 30, bottomY + 50)
         .lineTo(sigColX + sigColW - 30, bottomY + 50)
         .stroke()
         .restore();
      doc.font('Helvetica-Bold').fontSize(8).fillColor(NAVY)
         .text(instructorName, sigColX, bottomY + 56, { width: sigColW, align: 'center' });
      doc.font('Times-Italic').fontSize(9).fillColor(MUTED_GRAY)
         .text('Authorized Signature', sigColX, bottomY + 70, {
           width: sigColW, align: 'center'
         });

      // 14. NBCC compliance disclaimer (inside frame, above gold rule at y=578)
      const disclaimerY = H - 72;
      doc.font('Helvetica').fontSize(6.2).fillColor(TEXT_GRAY)
         .text(NBCC_DISCLAIMER, 60, disclaimerY, {
           width: W - 120, align: 'center', lineGap: 0.5
         });

      // 15. Verify URL — bottom center, inside cert frame
      doc.font('Helvetica-Bold').fontSize(7).fillColor(NAVY)
         .text(`Verify at ${VERIFY_URL}/${verificationCode}`, 0, H - 50, {
           align: 'center', width: W
         });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

export async function generateCertificateNumber(courseId, userId) {
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 1_000_000_000)
                .toString().padStart(9, '0');
  return `CR-${year}-${rand}`;
}

export function generateSignedCertificateUrl(publicId, expiresInSeconds = 86400) {
  return cloudinary.url(publicId, {
    resource_type: 'raw',
    type:          'authenticated',
    sign_url:      true,
    expires_at:    Math.floor(Date.now() / 1000) + expiresInSeconds
  });
}

export function extractPublicIdFromUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    const parts = u.pathname.split('/');
    const uploadIdx = parts.indexOf('upload');
    if (uploadIdx === -1) return null;
    const startIdx = parts[uploadIdx + 1]?.startsWith('v')
      ? uploadIdx + 2
      : uploadIdx + 1;
    return parts.slice(startIdx).join('/');
  } catch {
    return null;
  }
}

export default {
  generateCertificate,
  generateCertificateNumber,
  generateSignedCertificateUrl,
  extractPublicIdFromUrl
};
