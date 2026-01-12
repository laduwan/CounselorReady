/**
 * Certificate Generator
 * Creates NBCC ACEP compliant CE certificates
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const LOGO_PATH = path.join(__dirname, '../templates/logo.jpg');
const SIGNATURE_PATH = path.join(__dirname, '../templates/signature.png');

// Brand colors
const COLORS = {
  burgundy: rgb(0.42, 0.11, 0.20),
  forest: rgb(0.20, 0.31, 0.24),
  darkForest: rgb(0.17, 0.25, 0.20),
  gold: rgb(0.83, 0.63, 0.07),
  white: rgb(1, 1, 1),
  black: rgb(0, 0, 0)
};

/**
 * Generate an NBCC ACEP compliant certificate PDF
 */
export async function generateCertificate(data) {
  // Ensure all values have defaults
  const studentName = String(data.studentName || 'Participant');
  const courseTitle = String(data.courseTitle || 'Course');
  const ceHours = Number(data.ceHours) || 0;
  const ceCategory = String(data.ceCategory || 'Core');
  const completionDate = data.completionDate || new Date();
  const certificateNumber = String(data.certificateNumber || 'CR-000000');
  const objectives = Array.isArray(data.objectives) ? data.objectives.filter(o => o) : [];

  // Format date
  const formattedDate = new Date(completionDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Create PDF - Letter size landscape
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([792, 612]);
  const { width, height } = page.getSize();

  // Embed fonts
  const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
  const timesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Background
  page.drawRectangle({
    x: 0, y: 0, width, height,
    color: COLORS.white
  });

  // Decorative borders
  page.drawRectangle({
    x: 12, y: 12, width: width - 24, height: height - 24,
    borderColor: COLORS.burgundy, borderWidth: 3
  });
  page.drawRectangle({
    x: 18, y: 18, width: width - 36, height: height - 36,
    borderColor: COLORS.gold, borderWidth: 1
  });
  page.drawRectangle({
    x: 23, y: 23, width: width - 46, height: height - 46,
    borderColor: COLORS.forest, borderWidth: 2
  });

  // Try to add logo watermark
  try {
    const logoBytes = fs.readFileSync(LOGO_PATH);
    const logoImage = await pdfDoc.embedJpg(logoBytes);
    page.drawImage(logoImage, {
      x: (width - 140) / 2,
      y: 220,
      width: 140,
      height: 140,
      opacity: 0.05
    });
  } catch (e) {
    console.log('Logo not found');
  }

  // ========================================
  // HEADER - ACEP Name and Contact Info
  // ========================================
  
  const providerName = 'Ga Integrated Therapeutic Perspectives, LLC';
  const providerNameWidth = timesBold.widthOfTextAtSize(providerName, 20);
  page.drawText(providerName, {
    x: (width - providerNameWidth) / 2,
    y: height - 52,
    size: 20,
    font: timesBold,
    color: COLORS.forest
  });

  // ACEP Number
  const acepLine = 'NBCC Approved Continuing Education Provider, ACEP #7760';
  const acepLineWidth = helvetica.widthOfTextAtSize(acepLine, 9);
  page.drawText(acepLine, {
    x: (width - acepLineWidth) / 2,
    y: height - 67,
    size: 9,
    font: helvetica,
    color: COLORS.forest
  });

  // ========================================
  // CERTIFICATE TITLE
  // ========================================
  
  const certTitle = 'Certificate of Completion';
  const certTitleWidth = timesItalic.widthOfTextAtSize(certTitle, 26);
  page.drawText(certTitle, {
    x: (width - certTitleWidth) / 2,
    y: height - 98,
    size: 26,
    font: timesItalic,
    color: COLORS.burgundy
  });

  // Home Study indicator
  const homeStudy = 'Home Study Program';
  const homeStudyWidth = helvetica.widthOfTextAtSize(homeStudy, 8);
  page.drawText(homeStudy, {
    x: (width - homeStudyWidth) / 2,
    y: height - 112,
    size: 8,
    font: helvetica,
    color: COLORS.darkForest
  });

  // ========================================
  // PARTICIPANT NAME - WITH UNDERLINE
  // ========================================
  
  const certifyText = 'This certifies that';
  const certifyWidth = timesRoman.widthOfTextAtSize(certifyText, 11);
  page.drawText(certifyText, {
    x: (width - certifyWidth) / 2,
    y: height - 140,
    size: 11,
    font: timesRoman,
    color: COLORS.darkForest
  });

  // Student name - centered with underline
  const nameWidth = timesBold.widthOfTextAtSize(studentName, 22);
  const nameX = (width - nameWidth) / 2;
  const nameY = height - 165;
  
  page.drawText(studentName, {
    x: nameX,
    y: nameY,
    size: 22,
    font: timesBold,
    color: COLORS.burgundy
  });
  
  // Underline for student name
  page.drawLine({
    start: { x: nameX - 10, y: nameY - 4 },
    end: { x: nameX + nameWidth + 10, y: nameY - 4 },
    thickness: 1,
    color: COLORS.burgundy
  });

  // ========================================
  // PROGRAM TITLE
  // ========================================
  
  const completedText = 'has successfully completed the continuing education program';
  const completedWidth = timesRoman.widthOfTextAtSize(completedText, 10);
  page.drawText(completedText, {
    x: (width - completedWidth) / 2,
    y: height - 188,
    size: 10,
    font: timesRoman,
    color: COLORS.darkForest
  });

  // Course title - centered, handle long titles
  const maxTitleWidth = width - 120;
  let titleFontSize = 16;
  let titleWidth = timesBold.widthOfTextAtSize(courseTitle, titleFontSize);
  
  // Reduce font size if too wide
  while (titleWidth > maxTitleWidth && titleFontSize > 12) {
    titleFontSize--;
    titleWidth = timesBold.widthOfTextAtSize(courseTitle, titleFontSize);
  }
  
  if (courseTitle.length > 65) {
    const words = courseTitle.split(' ');
    const mid = Math.ceil(words.length / 2);
    const line1 = words.slice(0, mid).join(' ');
    const line2 = words.slice(mid).join(' ');
    
    const line1Width = timesBold.widthOfTextAtSize(line1, 14);
    page.drawText(line1, {
      x: (width - line1Width) / 2,
      y: height - 210,
      size: 14,
      font: timesBold,
      color: COLORS.forest
    });
    
    const line2Width = timesBold.widthOfTextAtSize(line2, 14);
    page.drawText(line2, {
      x: (width - line2Width) / 2,
      y: height - 228,
      size: 14,
      font: timesBold,
      color: COLORS.forest
    });
  } else {
    page.drawText(courseTitle, {
      x: (width - titleWidth) / 2,
      y: height - 215,
      size: titleFontSize,
      font: timesBold,
      color: COLORS.forest
    });
  }

  // ========================================
  // NBCC HOURS AWARDED
  // ========================================
  
  const hoursText = `${ceHours} NBCC Clock Hours Awarded`;
  const hoursTextWidth = helveticaBold.widthOfTextAtSize(hoursText, 11);
  page.drawText(hoursText, {
    x: (width - hoursTextWidth) / 2,
    y: height - 245,
    size: 11,
    font: helveticaBold,
    color: COLORS.burgundy
  });

  const categoryText = `Content Area: ${ceCategory}`;
  const categoryWidth = helvetica.widthOfTextAtSize(categoryText, 9);
  page.drawText(categoryText, {
    x: (width - categoryWidth) / 2,
    y: height - 259,
    size: 9,
    font: helvetica,
    color: COLORS.darkForest
  });

  // ========================================
  // LEARNING OBJECTIVES - Centered
  // ========================================
  
  let objY = height - 285;
  
  const objHeader = 'Learning Objectives:';
  const objHeaderWidth = helveticaBold.widthOfTextAtSize(objHeader, 9);
  page.drawText(objHeader, {
    x: (width - objHeaderWidth) / 2,
    y: objY,
    size: 9,
    font: helveticaBold,
    color: COLORS.forest
  });

  objY -= 14;
  
  // Use course objectives if available, otherwise defaults
  const displayObjectives = objectives.length > 0 ? objectives : [
    'Identify key concepts and best practices in the subject area',
    'Apply learned principles to professional counseling practice',
    'Demonstrate understanding through successful completion of assessment'
  ];
  
  displayObjectives.slice(0, 4).forEach((obj, i) => {
    if (obj) {
      const objText = String(obj);
      const displayText = objText.length > 90 ? objText.substring(0, 87) + '...' : objText;
      const fullText = `${i + 1}. ${displayText}`;
      const textWidth = helvetica.widthOfTextAtSize(fullText, 8);
      
      page.drawText(fullText, {
        x: (width - textWidth) / 2,
        y: objY - (i * 12),
        size: 8,
        font: helvetica,
        color: COLORS.darkForest
      });
    }
  });

  // ========================================
  // DATE OF COMPLETION & CERT NUMBER
  // ========================================
  
  const dateLabel = `Date of Completion: ${formattedDate}`;
  page.drawText(dateLabel, {
    x: 55,
    y: 130,
    size: 9,
    font: helvetica,
    color: COLORS.darkForest
  });

  const certNumText = `Certificate Number: ${certificateNumber}`;
  page.drawText(certNumText, {
    x: 55,
    y: 116,
    size: 8,
    font: helvetica,
    color: COLORS.darkForest
  });

  // Verification code (if provided)
  const verificationCode = data.verificationCode;
  if (verificationCode) {
    page.drawText(`Verification Code: ${verificationCode}`, {
      x: 55,
      y: 102,
      size: 8,
      font: helveticaBold,
      color: COLORS.burgundy
    });
    
    page.drawText(`Verify at: counselorready.com/verify`, {
      x: 55,
      y: 90,
      size: 7,
      font: helvetica,
      color: COLORS.darkForest
    });
  }

  // ========================================
  // SIGNATURE - Using actual signature image
  // ========================================
  
  const sigCenterX = width - 180;
  
  // Try to embed signature image
  try {
    const sigBytes = fs.readFileSync(SIGNATURE_PATH);
    const sigImage = await pdfDoc.embedPng(sigBytes);
    const sigDims = sigImage.scale(0.35); // Scale down
    
    page.drawImage(sigImage, {
      x: sigCenterX - (sigDims.width / 2),
      y: 148,
      width: sigDims.width,
      height: sigDims.height
    });
  } catch (e) {
    // Fallback to text signature
    console.log('Signature image not found, using text');
    const sigText = 'Kejuiana Johnson';
    const sigTextWidth = timesItalic.widthOfTextAtSize(sigText, 12);
    page.drawText(sigText, {
      x: sigCenterX - (sigTextWidth / 2),
      y: 155,
      size: 12,
      font: timesItalic,
      color: COLORS.darkForest
    });
  }
  
  // Signature line
  page.drawLine({
    start: { x: width - 280, y: 143 },
    end: { x: width - 80, y: 143 },
    thickness: 1,
    color: COLORS.darkForest
  });

  // Name under signature - smaller
  const printedName = 'Kejuiana L. Johnson';
  const printedNameWidth = helvetica.widthOfTextAtSize(printedName, 8);
  page.drawText(printedName, {
    x: sigCenterX - (printedNameWidth / 2),
    y: 130,
    size: 8,
    font: helvetica,
    color: COLORS.darkForest
  });

  // Credentials - smaller
  const sigCreds = 'MA, LPC, NBCC, CPCS';
  const sigCredsWidth = helvetica.widthOfTextAtSize(sigCreds, 7);
  page.drawText(sigCreds, {
    x: sigCenterX - (sigCredsWidth / 2),
    y: 119,
    size: 7,
    font: helvetica,
    color: COLORS.darkForest
  });
  
  // Title
  const sigTitle = 'Authorized Representative';
  const sigTitleWidth = helvetica.widthOfTextAtSize(sigTitle, 7);
  page.drawText(sigTitle, {
    x: sigCenterX - (sigTitleWidth / 2),
    y: 108,
    size: 7,
    font: helvetica,
    color: COLORS.darkForest
  });

  // ========================================
  // FOOTER - Contact Information
  // ========================================
  
  const footer1 = 'Ga Integrated Therapeutic Perspectives, LLC | 202 E General Stewart Way, Hinesville, GA 31313';
  const footer1Width = helvetica.widthOfTextAtSize(footer1, 7);
  page.drawText(footer1, {
    x: (width - footer1Width) / 2,
    y: 78,
    size: 7,
    font: helvetica,
    color: COLORS.darkForest
  });

  const footer2 = 'Phone: 678-664-4003 | Email: info@gaintegratedperspectives.com | Web: GaIntegratedPerspectives.com';
  const footer2Width = helvetica.widthOfTextAtSize(footer2, 7);
  page.drawText(footer2, {
    x: (width - footer2Width) / 2,
    y: 66,
    size: 7,
    font: helvetica,
    color: COLORS.darkForest
  });

  // ACEP statement
  const acepStatement = 'Ga Integrated Therapeutic Perspectives, LLC has been approved by NBCC as an Approved Continuing Education Provider, ACEP #7760.';
  const acepStatementWidth = helvetica.widthOfTextAtSize(acepStatement, 6);
  page.drawText(acepStatement, {
    x: (width - acepStatementWidth) / 2,
    y: 50,
    size: 6,
    font: helvetica,
    color: COLORS.darkForest
  });

  const acepStatement2 = 'Ga Integrated Therapeutic Perspectives, LLC is solely responsible for all aspects of the program.';
  const acepStatement2Width = helvetica.widthOfTextAtSize(acepStatement2, 6);
  page.drawText(acepStatement2, {
    x: (width - acepStatement2Width) / 2,
    y: 40,
    size: 6,
    font: helvetica,
    color: COLORS.darkForest
  });

  // Save PDF
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

/**
 * Generate certificate number
 */
export function generateCertificateNumber(courseId, userId, timestamp = Date.now()) {
  const prefix = 'CR';
  const courseCode = String(courseId || '0000').slice(-4).toUpperCase();
  const userCode = String(userId || '0000').slice(-4).toUpperCase();
  const timeCode = timestamp.toString(36).toUpperCase().slice(-4);
  return `${prefix}-${courseCode}-${userCode}-${timeCode}`;
}

export default {
  generateCertificate,
  generateCertificateNumber
};
