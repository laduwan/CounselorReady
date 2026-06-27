/**
 * Copyright (c) 2026 GA Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 *
 * Partner Certificate Generator — issues certificates for PARTNER-OWNED
 * courses under the partner's OWN approving body (APA, ASWB, a state board,
 * the partner's own ACEP number, etc.).
 *
 * This file is intentionally separate from utils/certificate.js. The platform
 * generator defaults to CounselorReady's own NBCC ACEP provider number; that
 * default is CORRECT for platform courses and WRONG for partner courses. To
 * keep the two paths from ever leaking into each other, this generator:
 *   - never references the platform ACEP provider number
 *   - never prints "NBCC Approved Continuing Education Provider" language
 *   - derives all approval data from the course's own approvals[] array
 *   - falls back to a clean Certificate of Completion (no provider claim) when
 *     no usable approval is present, instead of defaulting to NBCC.
 *
 * Primitives (drawDiamond / drawOrnamentalRule / page + font setup) are COPIED
 * from certificate.js, not imported, so the platform file stays frozen.
 */

import PDFDocument from 'pdfkit';

const DEFAULT_PRIMARY = '#6B1D34';   // burgundy
const DEFAULT_ACCENT  = '#D4A855';   // honey gold
const HUNTER_GREEN    = '#4A7C59';
const NAVY            = '#284157';
const TEXT_GRAY       = '#555555';
const MUTED_GRAY      = '#777777';

const VERIFY_URL  = 'counselorready.com/verify';
const POWERED_BY  = 'Powered by CounselorReady™';

// ── Delivery format label map (LPCA-GA taxonomy → human-readable) ──
// Copied from certificate.js — do not import (keeps platform file frozen).
const DELIVERY_FORMAT_LABELS = {
  'asynchronous':         'Asynchronous',
  'live-webinar':         'Live Webinar',
  'multi-live-workshop':  'Multi-Session Live Workshop',
  'in-person-single':     'In-Person',
  'in-person-conference': 'In-Person Conference',
};

// ============================================================================
// buildPartnerApprovalBlock
// ----------------------------------------------------------------------------
// Transforms a partner course's approvals[] array + the learner's selected
// approval body into the rows expected by generatePartnerCertificate().
//
// Deliberately DIFFERENT from certificate.js buildApprovalBlock(): on no match
// it returns { completionOnly: true, rows: [] } instead of falling back to a
// platform NBCC row. Partner certificates must never claim NBCC approval.
//
//   match → one row per hourBreakdown entry (or a single total-hours row),
//           using the entry's own providerNumber/providerName for the code.
//   no match → completion-only certificate (no provider number, no body code).
// ============================================================================
export function buildPartnerApprovalBlock(courseApprovals, selectedBody, fallbackHours = 1) {
  const usable = (a) => a && a.status !== 'expired' && a.status !== 'not-applied';

  const match = Array.isArray(courseApprovals)
    ? (courseApprovals.find(a => a.body === selectedBody && usable(a)) ||
       courseApprovals.find(a => usable(a)) ||
       null)
    : null;

  // No usable approval → clean Certificate of Completion. Never inject a platform NBCC default.
  if (!match) {
    return { completionOnly: true, rows: [] };
  }

  const providerNum  = (match.providerNumber || '').trim();
  const providerName = (match.providerName || '').trim();
  const deliveryFormat = match.deliveryFormat || 'asynchronous';

  // Display code for the approving body. Only an NBCC entry that literally
  // carries its own number renders an "ACEP #" — never a platform default.
  let code = '';
  if (match.body === 'NBCC') {
    code = providerNum ? `ACEP #${providerNum.replace(/[^0-9]/g, '') || providerNum}` : '';
  } else if (providerNum) {
    code = providerNum;
  } else if (providerName) {
    code = providerName;
  }

  const breakdown = Array.isArray(match.hourBreakdown) && match.hourBreakdown.length
    ? match.hourBreakdown
    : [{ label: '', hours: fallbackHours }];

  const rows = breakdown.map(({ label, hours }) => ({
    body:           match.body,
    code,
    providerName,
    hours:          Number(hours) || 0,
    category:       label ? label.charAt(0).toUpperCase() + label.slice(1) : '',
    deliveryFormat,
  }));

  return { completionOnly: false, rows };
}

// ── Filled diamond accent (copied from certificate.js) ──
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

// ── Decorative horizontal rule with center diamond (copied from certificate.js) ──
function drawOrnamentalRule(doc, cx, y, halfWidth, color) {
  doc.save().lineWidth(0.8).strokeColor(color);
  doc.moveTo(cx - halfWidth, y).lineTo(cx - 8, y).stroke();
  doc.moveTo(cx + 8, y).lineTo(cx + halfWidth, y).stroke();
  doc.fillColor(color);
  const d = 3;
  doc.moveTo(cx, y - d).lineTo(cx + d, y).lineTo(cx, y + d).lineTo(cx - d, y).closePath().fill();
  doc.restore();
}

// Best-effort fetch of a remote logo into a Buffer. Returns null on any failure
// so a missing/unreachable logo never blocks certificate issuance.
async function fetchLogoBuffer(logoUrl) {
  if (!logoUrl || typeof logoUrl !== 'string' || !/^https?:\/\//i.test(logoUrl)) return null;
  try {
    const res = await fetch(logoUrl);
    if (!res.ok) return null;
    const ctype = res.headers.get('content-type') || '';
    if (!/image\/(png|jpe?g)/i.test(ctype)) return null;
    return Buffer.from(await res.arrayBuffer());
  } catch {
    return null;
  }
}

export async function generatePartnerCertificate(data) {
  const holderName        = String(data.holderName || 'Participant').trim();
  const courseName        = String(data.courseName || 'Course').trim();
  const ceHours           = Number(data.ceHours) || 0;
  const certificateNumber = String(data.certificateNumber || 'CR-000000');
  const verificationCode  = String(data.verificationCode || certificateNumber);
  const partnerName       = String(data.partnerName || 'Provider').trim();
  const primaryColor      = String(data.primaryColor || DEFAULT_PRIMARY);
  const accentColor       = String(data.accentColor || DEFAULT_ACCENT);
  const completionOnly    = !!data.completionOnly;
  const approvalRows      = Array.isArray(data.approvalRows) ? data.approvalRows : [];
  const completionDate    = data.completionDate ? new Date(data.completionDate) : new Date();

  const deliveryLabel = DELIVERY_FORMAT_LABELS[approvalRows[0]?.deliveryFormat] || 'Asynchronous';

  const formattedDate = completionDate.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  // Resolve the partner logo (if any) up front — image embedding is synchronous.
  // Prefer a pre-fetched/uploaded buffer; fall back to fetching the URL.
  const logoBuffer = (data.logoBuffer && Buffer.isBuffer(data.logoBuffer))
    ? data.logoBuffer
    : await fetchLogoBuffer(data.logoUrl);

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'LETTER',
        layout: 'landscape',
        margins: { top: 0, bottom: 0, left: 0, right: 0 },
        info: {
          Title:    `Certificate of Completion — ${courseName}`,
          Author:   partnerName,
          Subject:  `${ceHours} CE Hour${ceHours !== 1 ? 's' : ''}`,
          Creator:  'CounselorReady',
          Keywords: `continuing education, ${partnerName}`
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

      // 2. Partner-colored OUTER + HUNTER GREEN INNER border
      doc.rect(22, 22, W - 44, H - 44).lineWidth(3).stroke(primaryColor);
      doc.rect(34, 34, W - 68, H - 68).lineWidth(1.2).stroke(HUNTER_GREEN);

      // 3. Accent diamond corner accents — anchored at the outer border corners
      const dCorner = 22;
      const diamondSize = 5;
      drawDiamond(doc, dCorner,     dCorner,     diamondSize, accentColor);
      drawDiamond(doc, W - dCorner, dCorner,     diamondSize, accentColor);
      drawDiamond(doc, dCorner,     H - dCorner, diamondSize, accentColor);
      drawDiamond(doc, W - dCorner, H - dCorner, diamondSize, accentColor);

      // 4/5. HEADER — partner logo (if present) + partner name.
      // A real header logo (letterhead mark), not a watermark. When a logo is
      // present the partner name tucks beneath it at a smaller size; otherwise
      // the name carries the header on its own.
      if (logoBuffer) {
        const logoW = 170, logoH = 34;
        try {
          doc.image(logoBuffer, (W - logoW) / 2, 40, {
            fit: [logoW, logoH], align: 'center', valign: 'center'
          });
        } catch { /* bad image data — skip logo */ }
        doc.font('Times-BoldItalic').fontSize(13).fillColor(HUNTER_GREEN)
           .text(partnerName, 0, 76, { align: 'center', width: W });
      } else {
        doc.font('Times-BoldItalic').fontSize(22).fillColor(HUNTER_GREEN)
           .text(partnerName, 0, 58, { align: 'center', width: W });
      }

      // Ornamental rule under the header (no NBCC credential line)
      drawOrnamentalRule(doc, cx, 92, 180, accentColor);

      // 6. HEADLINE
      doc.font('Times-Italic').fontSize(38).fillColor(primaryColor)
         .text('Certificate of Completion', 0, 104, { align: 'center', width: W });

      // 7. RECIPIENT BLOCK
      doc.font('Times-Italic').fontSize(12).fillColor(NAVY)
         .text('This certifies that', 0, 158, { align: 'center', width: W });

      const nameY = 180;
      doc.font('Times-Bold').fontSize(28).fillColor(NAVY);
      const nameWidth = doc.widthOfString(holderName);
      const nameX = (W - nameWidth) / 2;
      doc.text(holderName, nameX, nameY, { lineBreak: false });

      // Accent hairline under name
      const flourishY = nameY + 38;
      const flourishHalfWidth = Math.min(200, nameWidth / 2 + 30);
      doc.save().lineWidth(1.5).strokeColor(accentColor)
         .moveTo(cx - flourishHalfWidth, flourishY)
         .lineTo(cx + flourishHalfWidth, flourishY)
         .stroke()
         .restore();

      doc.font('Times-Italic').fontSize(12).fillColor(NAVY)
         .text('has successfully completed', 0, flourishY + 12, { align: 'center', width: W });

      // 8. COURSE TITLE
      const courseY = flourishY + 32;
      const courseFontSize = courseName.length > 70 ? 17 : courseName.length > 45 ? 19 : 22;
      doc.font('Times-Bold').fontSize(courseFontSize).fillColor(primaryColor)
         .text(courseName, 70, courseY, { align: 'center', width: W - 140 });

      let cursor = doc.y + 8;

      // 9. COMPLETION + DELIVERY
      doc.font('Helvetica').fontSize(11).fillColor(NAVY)
         .text(`Completed ${formattedDate}`, 0, cursor, { align: 'center', width: W });
      cursor += 18;
      doc.font('Helvetica-Oblique').fontSize(9).fillColor(primaryColor)
         .text(deliveryLabel, 0, cursor, { align: 'center', width: W });

      // 9b. LEARNING OBJECTIVES — ACEP-style; suppressed on completion-only certs
      // (no CE claim → no objectives). Mirrors the platform cert's objectives block.
      const objectives = Array.isArray(data.objectives) ? data.objectives.slice(0, 5) : [];
      if (!completionOnly && objectives.length) {
        let objY = doc.y + 24;
        doc.font('Times-Italic').fontSize(13).fillColor(HUNTER_GREEN)
           .text('Learning Objectives', 0, objY, { align: 'center', width: W });
        objY = doc.y + 8;
        const objW = W - 260;
        const objX = (W - objW) / 2;
        doc.font('Helvetica').fontSize(9).fillColor(TEXT_GRAY);
        objectives.forEach((o) => {
          const txt = `•  ${String(o).trim()}`;
          doc.text(txt, objX, objY, { width: objW, align: 'left', lineGap: 1 });
          objY = doc.y + 4;
        });
      }

      // ─── BOTTOM ROW — approval block (LEFT) | serial bar (CENTER) ───
      const bottomY = H - 188;

      // ── CENTER COLUMN: accent serial bar with the certificate number ──
      const serialBarY = bottomY + 30;
      const serialBarH = 18;
      const serialBarW = 200;
      const serialBarX = cx - serialBarW / 2;
      const tab = 8;
      doc.save()
         .moveTo(serialBarX, serialBarY)
         .lineTo(serialBarX + serialBarW, serialBarY)
         .lineTo(serialBarX + serialBarW + tab, serialBarY + serialBarH / 2)
         .lineTo(serialBarX + serialBarW, serialBarY + serialBarH)
         .lineTo(serialBarX, serialBarY + serialBarH)
         .lineTo(serialBarX - tab, serialBarY + serialBarH / 2)
         .closePath()
         .fillAndStroke(accentColor, primaryColor);
      doc.restore();
      doc.font('Times-Bold').fontSize(9).fillColor(primaryColor)
         .text(certificateNumber, serialBarX, serialBarY + 4, {
           width: serialBarW, align: 'center', characterSpacing: 0.8
         });

      // ── LEFT COLUMN: approval block (data-driven) OR hours-only ──
      const apprX = 50;
      const apprW = 220;

      doc.font('Times-Italic').fontSize(11).fillColor(HUNTER_GREEN)
         .text(completionOnly ? 'CE Hours' : 'Course Approval', apprX, bottomY + 22, {
           width: apprW, align: 'center'
         });

      doc.save().lineWidth(0.8).strokeColor(HUNTER_GREEN)
         .moveTo(apprX + 30, bottomY + 50)
         .lineTo(apprX + apprW - 30, bottomY + 50)
         .stroke()
         .restore();

      let apprCursor = bottomY + 56;

      if (completionOnly || approvalRows.length === 0) {
        // Completion-only: total hours, no provider claim, no body code.
        if (ceHours) {
          doc.font('Helvetica-Bold').fontSize(9).fillColor(primaryColor)
             .text(`${ceHours} CE Hour${ceHours !== 1 ? 's' : ''}`, apprX, apprCursor, {
               width: apprW, align: 'center'
             });
          apprCursor += 12;
        }
        doc.font('Helvetica-Oblique').fontSize(8).fillColor(TEXT_GRAY)
           .text('Certificate of Completion', apprX, apprCursor, {
             width: apprW, align: 'center'
           });
      } else {
        // Compact, fixed-height summary (body · code / total hours / category mix)
        // so a multi-category breakdown never grows into the footer band.
        const first = approvalRows[0] || {};
        const body  = String(first.body || '').trim();
        const code  = String(first.code || '').trim();
        const totalHrs = approvalRows.reduce((s, r) => s + (Number(r.hours) || 0), 0);
        const catParts = approvalRows
          .filter(r => r.category)
          .map(r => `${Number(r.hours) || 0} ${r.category}`);

        if (body) {
          doc.font('Helvetica-Bold').fontSize(8.5).fillColor(NAVY)
             .text(code ? `${body}  ·  ${code}` : body, apprX, apprCursor, { width: apprW, align: 'center' });
          apprCursor += 12;
        }
        if (totalHrs) {
          doc.font('Helvetica-Bold').fontSize(9).fillColor(primaryColor)
             .text(`${totalHrs} CE Hour${totalHrs !== 1 ? 's' : ''}`, apprX, apprCursor, { width: apprW, align: 'center' });
          apprCursor += 12;
        }
        if (catParts.length) {
          doc.font('Helvetica-Oblique').fontSize(8).fillColor(TEXT_GRAY)
             .text(catParts.join('  ·  '), apprX, apprCursor, { width: apprW, align: 'center' });
        }
      }

      // ── RIGHT COLUMN: issued-by (partner) ──
      const sigColX = W - 280;
      const sigColW = 240;
      doc.font('Times-Italic').fontSize(11).fillColor(HUNTER_GREEN)
         .text('Issued By', sigColX, bottomY + 22, { width: sigColW, align: 'center' });
      doc.save().lineWidth(0.8).strokeColor(HUNTER_GREEN)
         .moveTo(sigColX + 30, bottomY + 50)
         .lineTo(sigColX + sigColW - 30, bottomY + 50)
         .stroke()
         .restore();
      doc.font('Helvetica-Bold').fontSize(9).fillColor(NAVY)
         .text(partnerName, sigColX, bottomY + 56, { width: sigColW, align: 'center' });
      doc.font('Times-Italic').fontSize(9).fillColor(MUTED_GRAY)
         .text('Approved Provider', sigColX, bottomY + 70, { width: sigColW, align: 'center' });

      // 13b. Partner custom footer (license disclaimer / address / contact /
      // board-approval statement) — partner-set, above the verify line.
      const certFooter = String(data.certFooter || '').trim();
      if (certFooter) {
        doc.font('Helvetica').fontSize(7.5).fillColor(TEXT_GRAY)
           .text(certFooter, 80, H - 80, { width: W - 160, align: 'center', lineGap: 1 });
      }

      // 14. White-label: no "Powered by CounselorReady" line on partner certs.

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

export default {
  generatePartnerCertificate,
  buildPartnerApprovalBlock,
};
