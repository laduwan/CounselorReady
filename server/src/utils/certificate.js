/**
 * Certificate Generator
 * Creates CE certificates compliant with multiple approval bodies (NBCC, GCSCW, State Boards)
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
const ACEP_LOGO_PATH = path.join(__dirname, '../templates/nbcc-acep-logo.jpg');
const GCSCW_LOGO_PATH = path.join(__dirname, '../templates/gcscw-logo.png');

// Brand colors
const COLORS = {
  burgundy: rgb(0.42, 0.11, 0.20),
  forest: rgb(0.20, 0.31, 0.24),
  darkForest: rgb(0.17, 0.25, 0.20),
  gold: rgb(0.83, 0.63, 0.07),
  white: rgb(1, 1, 1),
  black: rgb(0, 0, 0)
};

// Approval body configurations
const APPROVAL_BODY_CONFIG = {
  'NBCC': {
    name: 'NBCC',
    fullName: 'National Board for Certified Counselors',
    providerTitle: 'Approved Continuing Education Provider (ACEP)',
    defaultProviderNumber: '#7760',
    statementTemplate: (providerName, providerNumber) => 
      `${providerName} has been approved by NBCC as an Approved Continuing Education Provider, ACEP ${providerNumber}. Programs that do not qualify for NBCC credit are clearly identified. ${providerName} is solely responsible for all aspects of the programs.`,
    logoPath: ACEP_LOGO_PATH,
    hoursLabel: 'NBCC Clock Hours'
  },
  'GCSCW': {
    name: 'GCSCW',
    fullName: 'Georgia Composite Board of Professional Counselors, Social Workers, and Marriage & Family Therapists',
    providerTitle: 'Approved CE Provider',
    defaultProviderNumber: '',
    statementTemplate: (providerName, providerNumber) => 
      `${providerName} is approved by the Georgia Composite Board to provide continuing education for Licensed Clinical Social Workers, Licensed Professional Counselors, and Licensed Marriage and Family Therapists.${providerNumber ? ` Provider Number: ${providerNumber}` : ''}`,
    logoPath: GCSCW_LOGO_PATH,
    hoursLabel: 'CE Hours'
  },
  'GA-LPC-Board': {
    name: 'GA LPC Board',
    fullName: 'Georgia Board of Professional Counselors',
    providerTitle: 'State Approved Provider',
    defaultProviderNumber: '',
    statementTemplate: (providerName, providerNumber) => 
      `This program has been approved by the Georgia Board of Professional Counselors for continuing education credit.${providerNumber ? ` Provider Number: ${providerNumber}` : ''}`,
    logoPath: null,
    hoursLabel: 'CE Hours'
  },
  'GA-LCSW-Board': {
    name: 'GA LCSW Board',
    fullName: 'Georgia Board of Licensed Clinical Social Workers',
    providerTitle: 'State Approved Provider',
    defaultProviderNumber: '',
    statementTemplate: (providerName, providerNumber) => 
      `This program has been approved by the Georgia Board of Licensed Clinical Social Workers for continuing education credit.${providerNumber ? ` Provider Number: ${providerNumber}` : ''}`,
    logoPath: null,
    hoursLabel: 'CE Hours'
  },
  'ACA': {
    name: 'ACA',
    fullName: 'American Counseling Association',
    providerTitle: 'Approved Provider',
    defaultProviderNumber: '',
    statementTemplate: (providerName, providerNumber) => 
      `${providerName} is an American Counseling Association approved continuing education provider.${providerNumber ? ` Provider Number: ${providerNumber}` : ''}`,
    logoPath: null,
    hoursLabel: 'CE Hours'
  },
  'NASW': {
    name: 'NASW',
    fullName: 'National Association of Social Workers',
    providerTitle: 'Approved Provider',
    defaultProviderNumber: '',
    statementTemplate: (providerName, providerNumber) => 
      `${providerName} is approved by the National Association of Social Workers as a continuing education provider.${providerNumber ? ` Provider Number: ${providerNumber}` : ''}`,
    logoPath: null,
    hoursLabel: 'CE Hours'
  }
};

/**
 * Get approval body configuration
 */
export function getApprovalBodyConfig(bodyCode) {
  return APPROVAL_BODY_CONFIG[bodyCode] || {
    name: bodyCode,
    fullName: bodyCode,
    providerTitle: 'Approved Provider',
    defaultProviderNumber: '',
    statementTemplate: (providerName, providerNumber) => 
      `${providerName} is an approved continuing education provider.${providerNumber ? ` Provider Number: ${providerNumber}` : ''}`,
    logoPath: null,
    hoursLabel: 'CE Hours'
  };
}

/**
 * Generate a CE certificate PDF for a specific approval body
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
  
  // Get approval body info - support both new array format and legacy single body
  let approvalBody = 'NBCC';
  let providerNumber = '#7760';
  let providerName = 'Ga Integrated Therapeutic Perspectives, LLC';
  
  if (data.approval) {
    // New format: specific approval passed
    approvalBody = data.approval.body || 'NBCC';
    providerNumber = data.approval.providerNumber || getApprovalBodyConfig(approvalBody).defaultProviderNumber;
    providerName = data.approval.providerName || providerName;
  } else if (data.approvals && data.approvals.length > 0) {
    // New format: array of approvals, use first approved one or NBCC if available
    const nbccApproval = data.approvals.find(a => a.body === 'NBCC' && a.status === 'approved');
    const firstApproved = nbccApproval || data.approvals.find(a => a.status === 'approved');
    if (firstApproved) {
      approvalBody = firstApproved.body;
      providerNumber = firstApproved.providerNumber || getApprovalBodyConfig(approvalBody).defaultProviderNumber;
      providerName = firstApproved.providerName || providerName;
    }
  } else if (data.approvingBody) {
    // Legacy format
    approvalBody = data.approvingBody === 'ACEP' ? 'NBCC' : data.approvingBody;
    providerNumber = data.approvalNumber || '#7760';
  }
  
  const bodyConfig = getApprovalBodyConfig(approvalBody);

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
      opacity: 0.07
    });
  } catch (e) {
    console.log('Logo not found');
  }

  // ========================================
  // HEADER - Provider Name and Approval Info
  // ========================================
  
  const providerNameWidth = timesBold.widthOfTextAtSize(providerName, 20);
  page.drawText(providerName, {
    x: (width - providerNameWidth) / 2,
    y: height - 52,
    size: 20,
    font: timesBold,
    color: COLORS.forest
  });

  // Approval body line (dynamic based on approval body)
  const approvalLine = `${bodyConfig.fullName} ${bodyConfig.providerTitle}${providerNumber ? `, ${providerNumber}` : ''}`;
  const approvalLineWidth = helvetica.widthOfTextAtSize(approvalLine, 9);
  page.drawText(approvalLine, {
    x: (width - approvalLineWidth) / 2,
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
  // HOURS AWARDED (dynamic based on approval body)
  // ========================================
  
  const hoursText = `${ceHours} ${bodyConfig.hoursLabel} Awarded`;
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
  // APPROVAL BODY LOGO (if available)
  // ========================================
  
  const logoPath = bodyConfig.logoPath;
  if (logoPath) {
    try {
      const logoBytes = fs.readFileSync(logoPath);
      // Determine image type from path
      const isJpg = logoPath.toLowerCase().endsWith('.jpg') || logoPath.toLowerCase().endsWith('.jpeg');
      const logoImage = isJpg ? await pdfDoc.embedJpg(logoBytes) : await pdfDoc.embedPng(logoBytes);
      
      // Position in bottom left area
      page.drawImage(logoImage, {
        x: 55,
        y: 38,
        width: 50,
        height: 50
      });
    } catch (e) {
      console.log(`${approvalBody} logo not found:`, e.message);
    }
  }

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

  // Approval statement (dynamic based on approval body)
  const acepStatement = bodyConfig.statementTemplate(providerName, providerNumber);
  // Split long statements
  const maxStatementWidth = width - 160;
  let statementFontSize = 6;
  let statementLines = [];
  
  // Simple word wrap
  const words = acepStatement.split(' ');
  let currentLine = '';
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = helvetica.widthOfTextAtSize(testLine, statementFontSize);
    if (testWidth > maxStatementWidth && currentLine) {
      statementLines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) statementLines.push(currentLine);
  
  statementLines.slice(0, 2).forEach((line, i) => {
    const lineWidth = helvetica.widthOfTextAtSize(line, statementFontSize);
    page.drawText(line, {
      x: (width - lineWidth) / 2 + (logoPath ? 25 : 0),
      y: 50 - (i * 10),
      size: statementFontSize,
      font: helvetica,
      color: COLORS.darkForest
    });
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

/**
 * Generate certificates for all approval bodies a course has
 */
export async function generateCertificatesForAllApprovals(data) {
  const approvals = data.approvals || [];
  const certificates = [];
  
  // If no approvals array, generate single certificate using legacy method
  if (approvals.length === 0) {
    const cert = await generateCertificate(data);
    return [{ body: data.approvingBody || 'NBCC', certificate: cert }];
  }
  
  // Generate a certificate for each approved body
  for (const approval of approvals) {
    if (approval.status === 'approved') {
      const certData = { ...data, approval };
      const cert = await generateCertificate(certData);
      certificates.push({ body: approval.body, certificate: cert });
    }
  }
  
  return certificates;
}

export default {
  generateCertificate,
  generateCertificateNumber,
  generateCertificatesForAllApprovals,
  getApprovalBodyConfig,
  APPROVAL_BODY_CONFIG
};
