import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { protect } from '../middleware/auth.js';
import Certificate from '../models/Certificate.js';
import Course from '../models/Course.js';
import User from '../models/User.js';
import UserCredential from '../models/UserCredential.js';
import UserCourseProgress from '../models/UserCourseProgress.js';
import { generateCertificate, generateCertificateNumber } from '../utils/certificate.js';
import { sendCourseCompletionEmail } from '../services/courseEmailService.js';

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, JPG, PNG allowed.'), false);
    }
  }
});

// Upload to Cloudinary helper
const uploadToCloudinary = (buffer, options) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    }).end(buffer);
  });
};

// GET /api/certificates - Get all certificates for user
router.get('/', protect, async (req, res) => {
  try {
    const certificates = await Certificate.find({ userId: req.user._id })
      .sort({ completionDate: -1 });
    
    res.json({ certificates });
  } catch (error) {
    console.error('Get certificates error:', error);
    res.status(500).json({ error: 'Failed to get certificates' });
  }
});

// GET /api/certificates/stats - Get certificate stats
router.get('/stats', protect, async (req, res) => {
  try {
    const certificates = await Certificate.find({ userId: req.user._id });
    
    const stats = {
      totalCertificates: certificates.length,
      totalHours: certificates.reduce((sum, c) => sum + (c.ceHours || 0), 0),
      nbccApproved: certificates.filter(c => c.nbccApproved).length
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

// GET /api/certificates/check-eligibility/:courseId - Check if user can get certificate
router.get('/check-eligibility/:courseId', protect, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    const progress = await UserCourseProgress.findOne({ userId, courseId });
    
    if (!progress) {
      return res.json({
        eligible: false,
        reason: 'Not enrolled in this course',
        requirements: {
          enrolled: false,
          courseCompleted: false,
          evaluationCompleted: false,
          attestationCompleted: false
        }
      });
    }
    
    const requireEvaluation = course.settings?.requireEvaluation !== false;
    const requireAttestation = course.settings?.requireAttestation !== false;
    
    const requirements = {
      enrolled: true,
      courseCompleted: progress.completed || false,
      evaluationRequired: requireEvaluation,
      evaluationCompleted: progress.evaluationCompleted || false,
      attestationRequired: requireAttestation,
      attestationCompleted: progress.attestationCompleted || false
    };
    
    let eligible = true;
    let reason = null;
    
    if (!requirements.courseCompleted) {
      eligible = false;
      reason = 'Complete all lessons first';
    } else if (requireEvaluation && !requirements.evaluationCompleted) {
      eligible = false;
      reason = 'Complete the course evaluation first';
    } else if (requireAttestation && !requirements.attestationCompleted) {
      eligible = false;
      reason = 'Complete the attestation first';
    }
    
    // Check if certificate already exists
    const existingCert = await Certificate.findOne({ userId, courseId, source: 'platform' });
    
    res.json({
      eligible,
      reason,
      requirements,
      hasCertificate: !!existingCert,
      certificateId: existingCert?._id
    });
  } catch (error) {
    console.error('Check eligibility error:', error);
    res.status(500).json({ error: 'Failed to check eligibility' });
  }
});

// POST /api/certificates - Upload new certificate
router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    console.log('POST /api/certificates - Request received');
    console.log('Body:', req.body);
    console.log('File:', req.file ? req.file.originalname : 'No file');
    
    const { title, provider, completionDate, ceHours, category, nbccApproved, acepNumber, notes, credentials, approvingBody, approvalNumber, applicability, applicableStates } = req.body;
    
    // Validate required fields
    if (!title || !provider || !completionDate || !ceHours) {
      return res.status(400).json({ error: 'Title, provider, completion date, and CE hours are required' });
    }
    
    let fileUrl = null;
    let fileKey = null;
    let fileName = null;
    let fileType = null;
    
    // Upload file to Cloudinary if provided
    if (req.file) {
      try {
        console.log('Uploading to Cloudinary...');
        const result = await uploadToCloudinary(req.file.buffer, {
          folder: `certificates/${req.user._id}`,
          resource_type: 'auto',
          public_id: `cert_${Date.now()}`
        });
        
        fileUrl = result.secure_url;
        fileKey = result.public_id;
        fileName = req.file.originalname;
        fileType = req.file.mimetype;
        console.log('Cloudinary upload success:', fileUrl);
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
      }
    }
    
    // Parse credentials if it's a string
    let parsedCredentials = [];
    if (credentials) {
      try {
        parsedCredentials = typeof credentials === 'string' ? JSON.parse(credentials) : credentials;
      } catch (e) {
        parsedCredentials = [];
      }
    }
    
    // Parse applicable states if it's a string
    let parsedApplicableStates = [];
    if (applicableStates) {
      try {
        parsedApplicableStates = typeof applicableStates === 'string' ? JSON.parse(applicableStates) : applicableStates;
      } catch (e) {
        parsedApplicableStates = [];
      }
    }
    
    const certificate = await Certificate.create({
      userId: req.user._id,
      title,
      provider,
      completionDate: new Date(completionDate),
      ceHours: parseFloat(ceHours),
      category: category || 'General',
      nbccApproved: nbccApproved === 'true' || nbccApproved === true,
      acepNumber: acepNumber || null,
      approvingBody: approvingBody || null,
      approvalNumber: approvalNumber || null,
      applicability: applicability || 'national',
      applicableStates: parsedApplicableStates,
      notes: notes || null,
      credentials: parsedCredentials,
      fileUrl,
      fileKey,
      fileName,
      fileType
    });
    
    console.log('Certificate created:', certificate._id);
    
    // Log CEUs to linked credentials
    if (parsedCredentials && parsedCredentials.length > 0) {
      for (const credId of parsedCredentials) {
        try {
          const credential = await UserCredential.findOne({
            _id: credId,
            userId: req.user._id
          });
          
          if (credential) {
            await credential.addCEU({
              hours: parseFloat(ceHours),
              category: category || 'General',
              description: title,
              provider: provider,
              date: new Date(completionDate),
              certificateId: certificate._id,
              source: 'external'
            });
            console.log(`Logged ${ceHours} CEUs to credential ${credId}`);
          }
        } catch (credError) {
          console.error(`Failed to log CEU to credential ${credId}:`, credError);
        }
      }
    }
    
    res.status(201).json({ 
      message: 'Certificate uploaded successfully',
      certificate 
    });
  } catch (error) {
    console.error('Upload certificate error:', error);
    res.status(500).json({ error: 'Failed to upload certificate' });
  }
});

// GET /api/certificates/:id - Get single certificate
router.get('/:id', protect, async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }
    
    res.json({ certificate });
  } catch (error) {
    console.error('Get certificate error:', error);
    res.status(500).json({ error: 'Failed to get certificate' });
  }
});

// PUT /api/certificates/:id - Update certificate
router.put('/:id', protect, upload.single('file'), async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }
    
    const { title, provider, completionDate, ceHours, category, nbccApproved, acepNumber, notes, credentials } = req.body;
    
    if (title) certificate.title = title;
    if (provider) certificate.provider = provider;
    if (completionDate) certificate.completionDate = new Date(completionDate);
    if (ceHours) certificate.ceHours = parseFloat(ceHours);
    if (category) certificate.category = category;
    if (nbccApproved !== undefined) certificate.nbccApproved = nbccApproved === 'true' || nbccApproved === true;
    if (acepNumber !== undefined) certificate.acepNumber = acepNumber || null;
    if (notes !== undefined) certificate.notes = notes || null;
    
    if (credentials) {
      try {
        certificate.credentials = typeof credentials === 'string' ? JSON.parse(credentials) : credentials;
      } catch (e) {}
    }
    
    if (req.file) {
      if (certificate.fileKey) {
        try {
          await cloudinary.uploader.destroy(certificate.fileKey);
        } catch (e) {}
      }
      
      const result = await uploadToCloudinary(req.file.buffer, {
        folder: `certificates/${req.user._id}`,
        resource_type: 'auto',
        public_id: `cert_${Date.now()}`
      });
      
      certificate.fileUrl = result.secure_url;
      certificate.fileKey = result.public_id;
      certificate.fileName = req.file.originalname;
      certificate.fileType = req.file.mimetype;
    }
    
    await certificate.save();
    
    res.json({ 
      message: 'Certificate updated successfully',
      certificate 
    });
  } catch (error) {
    console.error('Update certificate error:', error);
    res.status(500).json({ error: 'Failed to update certificate' });
  }
});

// DELETE /api/certificates/:id - Delete certificate
router.delete('/:id', protect, async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }
    
    if (certificate.fileKey) {
      try {
        await cloudinary.uploader.destroy(certificate.fileKey);
      } catch (e) {
        console.error('Cloudinary delete error:', e);
      }
    }
    
    await Certificate.deleteOne({ _id: certificate._id });
    
    res.json({ message: 'Certificate deleted successfully' });
  } catch (error) {
    console.error('Delete certificate error:', error);
    res.status(500).json({ error: 'Failed to delete certificate' });
  }
});

// POST /api/certificates/generate/:courseId - Generate certificate for course completion
router.post('/generate/:courseId', protect, async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.user._id;
    
    console.log('Generating certificate for course:', courseId, 'user:', userId);
    
    // Get user and course
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    // Check user's progress - MUST complete evaluation and attestation first
    const progress = await UserCourseProgress.findOne({ userId, courseId });
    
    if (!progress) {
      return res.status(400).json({ error: 'You are not enrolled in this course' });
    }
    
    // Check if course is completed (all lessons done)
    if (!progress.completed) {
      return res.status(400).json({ 
        error: 'Course not completed',
        message: 'You must complete all lessons before receiving a certificate'
      });
    }
    
    // Check if evaluation is required and completed
    if (course.settings?.requireEvaluation !== false) {
      if (!progress.evaluationCompleted) {
        return res.status(400).json({ 
          error: 'Evaluation required',
          message: 'You must complete the course evaluation before receiving your certificate'
        });
      }
    }
    
    // Check if attestation is required and completed
    if (course.settings?.requireAttestation !== false) {
      if (!progress.attestationCompleted) {
        return res.status(400).json({ 
          error: 'Attestation required',
          message: 'You must complete the attestation before receiving your certificate'
        });
      }
    }
    
    console.log('User:', user.name, 'Course:', course.title, '- All requirements met');
    
    // Check if certificate already exists
    let certificate = await Certificate.findOne({ 
      userId, 
      courseId,
      source: 'platform'
    });
    
    const certNumber = certificate?.certificateNumber || 
      generateCertificateNumber(courseId, userId, Date.now());
    
    // Extract objectives from course
    let objectives = [];
    
    // First try course-level objectives
    if (course.objectives && course.objectives.length > 0) {
      objectives = course.objectives;
    } 
    // Then try module-level objectives
    else if (course.modules && course.modules.length > 0) {
      course.modules.forEach(module => {
        if (module.objectives && module.objectives.length > 0) {
          objectives.push(...module.objectives);
        }
      });
    }
    
    // If still no objectives, generate based on course title
    if (objectives.length === 0) {
      objectives = [
        `Identify key concepts and best practices related to ${course.title}`,
        `Apply learned principles to professional counseling practice`,
        `Demonstrate understanding through successful completion of course assessment`
      ];
    }
    
    // Prepare data with safe defaults
    const certData = {
      studentName: user.name || user.email || 'Student',
      courseTitle: course.title || 'Course',
      courseSubtitle: course.subtitle || '',
      ceHours: course.ceuHours || 0,
      ceCategory: course.ceuCategories?.[0]?.category || 'Core',
      completionDate: new Date(),
      certificateNumber: certNumber,
      objectives: objectives.slice(0, 3),
      verificationCode: null // Will be set after certificate is created
    };
    
    console.log('Certificate data:', certData);
    
    // Create or get certificate record FIRST to get verification code
    if (!certificate) {
      certificate = await Certificate.create({
        userId,
        courseId,
        title: course.title,
        provider: 'GA Integrated Therapeutic Perspectives LLC',
        completionDate: new Date(),
        ceHours: course.ceuHours || 0,
        category: course.ceuCategories?.[0]?.category || 'Core',
        nbccApproved: course.ceuEligible || false,
        acepNumber: course.ceuApprovalNumber || '7760',
        certificateNumber: certNumber,
        fileName: `${course.slug}_certificate.pdf`,
        fileType: 'application/pdf',
        source: 'platform'
      });
      
      // Auto-log CEUs to all user credentials for this course category
      const userCredentials = await UserCredential.find({ userId });
      const courseCategory = course.ceuCategories?.[0]?.category || 'General';
      
      for (const credential of userCredentials) {
        if (credential.totalCEUsRequired > 0) {
          try {
            await credential.addCEU({
              hours: course.ceuHours || 0,
              category: courseCategory,
              description: course.title,
              provider: 'GA Integrated Therapeutic Perspectives LLC',
              date: new Date(),
              certificateId: certificate._id,
              courseId: courseId,
              source: 'internal'
            });
            console.log(`Auto-logged ${course.ceuHours} CEUs to credential ${credential._id}`);
          } catch (credError) {
            console.error(`Failed to log CEU to credential ${credential._id}:`, credError);
          }
        }
      }
      
      // Send course completion email (async, don't wait)
      sendCourseCompletionEmail(userId, courseId, certificate._id)
        .catch(err => console.error('Failed to send completion email:', err));
    }
    
    // Now add verification code to cert data and generate PDF
    certData.verificationCode = certificate.verificationCode;
    
    // Generate PDF with verification code
    const pdfBuffer = await generateCertificate(certData);
    
    // Upload to Cloudinary
    let fileUrl = null;
    let fileKey = null;
    
    try {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({
          folder: `certificates/${userId}`,
          resource_type: 'raw',
          public_id: `cert_${courseId}_${Date.now()}`,
          format: 'pdf'
        }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }).end(pdfBuffer);
      });
      
      fileUrl = result.secure_url;
      fileKey = result.public_id;
      
      // Update certificate with file URL
      certificate.fileUrl = fileUrl;
      certificate.fileKey = fileKey;
      await certificate.save();
    } catch (uploadError) {
      console.error('Cloudinary upload error:', uploadError);
    }
    
    // Return PDF directly for download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${course.slug}_certificate.pdf"`);
    res.send(pdfBuffer);
    
  } catch (error) {
    console.error('Generate certificate error:', error);
    res.status(500).json({ error: 'Failed to generate certificate: ' + error.message });
  }
});

// GET /api/certificates/download/:id - Download certificate PDF
router.get('/download/:id', protect, async (req, res) => {
  try {
    const certificate = await Certificate.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('courseId');
    
    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }
    
    // If we have a stored PDF URL, redirect to it
    if (certificate.fileUrl) {
      return res.redirect(certificate.fileUrl);
    }
    
    // If it's a platform certificate, regenerate
    if (certificate.courseId && certificate.source === 'platform') {
      const user = await User.findById(req.user._id);
      const course = certificate.courseId;
      
      const pdfBuffer = await generateCertificate({
        studentName: user.name,
        courseTitle: course.title || certificate.title,
        courseSubtitle: course.subtitle || '',
        ceHours: certificate.ceHours || course.ceuHours || 0,
        ceCategory: course.ceuCategories?.[0]?.category || 'Core',
        completionDate: certificate.completionDate,
        certificateNumber: certificate.certificateNumber,
        objectives: course.objectives || []
      });
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="certificate_${certificate._id}.pdf"`);
      return res.send(pdfBuffer);
    }
    
    res.status(404).json({ error: 'Certificate file not available' });
    
  } catch (error) {
    console.error('Download certificate error:', error);
    res.status(500).json({ error: 'Failed to download certificate' });
  }
});

// ============================================
// PUBLIC VERIFICATION (No auth required)
// ============================================

// @route   GET /api/certificates/verify/:code
// @desc    Verify a certificate by code (public)
// @access  Public
router.get('/verify/:code', async (req, res) => {
  try {
    const { code } = req.params;
    
    const certificate = await Certificate.findOne({ 
      verificationCode: code.toUpperCase() 
    }).populate('userId', 'profile.firstName profile.lastName');
    
    if (!certificate) {
      return res.status(404).json({ 
        valid: false, 
        error: 'Certificate not found. Please check the verification code.' 
      });
    }
    
    if (certificate.isRevoked) {
      return res.json({
        valid: false,
        revoked: true,
        revokedAt: certificate.revokedAt,
        reason: certificate.revokedReason || 'This certificate has been revoked.',
        certificate: {
          title: certificate.title,
          holderName: `${certificate.userId?.profile?.firstName || ''} ${certificate.userId?.profile?.lastName || ''}`.trim() || 'N/A'
        }
      });
    }
    
    // Return verified certificate info
    res.json({
      valid: true,
      certificate: {
        verificationCode: certificate.verificationCode,
        holderName: `${certificate.userId?.profile?.firstName || ''} ${certificate.userId?.profile?.lastName || ''}`.trim() || 'N/A',
        title: certificate.title,
        provider: certificate.provider,
        completionDate: certificate.completionDate,
        ceHours: certificate.ceHours,
        category: certificate.category,
        certificateNumber: certificate.certificateNumber,
        nbccApproved: certificate.nbccApproved,
        acepNumber: certificate.acepNumber,
        approvingBody: certificate.approvingBody,
        issuedAt: certificate.createdAt
      }
    });
  } catch (error) {
    console.error('Verify certificate error:', error);
    res.status(500).json({ valid: false, error: 'Verification failed' });
  }
});

// ============================================
// CE TRANSCRIPT
// ============================================

// @route   GET /api/certificates/transcript
// @desc    Generate CE transcript PDF with all certificates
// @access  Private
router.get('/transcript', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const certificates = await Certificate.find({ 
      userId: req.user._id,
      isRevoked: { $ne: true }
    }).sort({ completionDate: -1 });
    
    if (certificates.length === 0) {
      return res.status(404).json({ error: 'No certificates found' });
    }
    
    // Calculate totals by category
    const categoryTotals = {};
    let totalHours = 0;
    
    certificates.forEach(cert => {
      const cat = cert.category || 'General';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + (cert.ceHours || 0);
      totalHours += cert.ceHours || 0;
    });
    
    // Generate transcript PDF
    const PDFDocument = (await import('pdfkit')).default;
    const doc = new PDFDocument({ margin: 50, size: 'LETTER' });
    
    const chunks = [];
    doc.on('data', chunk => chunks.push(chunk));
    
    const pdfPromise = new Promise((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
    });
    
    // Header
    doc.fontSize(24).font('Helvetica-Bold')
       .fillColor('#6b1d34')
       .text('Continuing Education Transcript', { align: 'center' });
    
    doc.moveDown(0.5);
    doc.fontSize(12).font('Helvetica')
       .fillColor('#34503d')
       .text('CounselorReady - GA Integrated Therapeutic Perspectives LLC', { align: 'center' });
    doc.text('NBCC ACEP #7760', { align: 'center' });
    
    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(562, doc.y).stroke('#e5e5e5');
    doc.moveDown();
    
    // Student Info
    const fullName = `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim() || user.email;
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#2b4133')
       .text('Student: ', { continued: true })
       .font('Helvetica').text(fullName);
    
    doc.font('Helvetica-Bold').text('Email: ', { continued: true })
       .font('Helvetica').text(user.email);
    
    doc.font('Helvetica-Bold').text('Generated: ', { continued: true })
       .font('Helvetica').text(new Date().toLocaleDateString('en-US', { 
         year: 'numeric', month: 'long', day: 'numeric' 
       }));
    
    doc.moveDown();
    
    // Summary Box
    doc.rect(50, doc.y, 512, 60).fillAndStroke('#f5f5f4', '#e5e5e5');
    const summaryY = doc.y + 10;
    doc.fillColor('#2b4133').fontSize(14).font('Helvetica-Bold')
       .text(`Total CE Hours: ${totalHours.toFixed(1)}`, 70, summaryY);
    
    doc.fontSize(10).font('Helvetica').fillColor('#547c5f');
    let catX = 70;
    let catY = summaryY + 25;
    Object.entries(categoryTotals).forEach(([cat, hours], i) => {
      if (i > 0 && i % 4 === 0) {
        catY += 15;
        catX = 70;
      }
      doc.text(`${cat}: ${hours.toFixed(1)}`, catX, catY, { continued: i % 4 !== 3 });
      catX += 120;
    });
    
    doc.y = summaryY + 70;
    doc.moveDown();
    
    // Table Header
    const tableTop = doc.y;
    doc.rect(50, tableTop, 512, 20).fill('#6b1d34');
    doc.fillColor('#ffffff').fontSize(9).font('Helvetica-Bold');
    doc.text('Date', 55, tableTop + 6);
    doc.text('Course Title', 110, tableTop + 6);
    doc.text('Provider', 320, tableTop + 6);
    doc.text('Hours', 420, tableTop + 6);
    doc.text('Category', 470, tableTop + 6);
    
    // Table Rows
    let rowY = tableTop + 25;
    doc.fillColor('#2b4133').font('Helvetica').fontSize(8);
    
    certificates.forEach((cert, i) => {
      // Check if we need a new page
      if (rowY > 700) {
        doc.addPage();
        rowY = 50;
      }
      
      // Alternating row colors
      if (i % 2 === 0) {
        doc.rect(50, rowY - 3, 512, 18).fill('#fafafa');
      }
      
      doc.fillColor('#2b4133');
      const dateStr = cert.completionDate 
        ? new Date(cert.completionDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' })
        : 'N/A';
      
      doc.text(dateStr, 55, rowY, { width: 50 });
      doc.text(cert.title.substring(0, 40) + (cert.title.length > 40 ? '...' : ''), 110, rowY, { width: 200 });
      doc.text((cert.provider || 'CounselorReady').substring(0, 20), 320, rowY, { width: 95 });
      doc.text(cert.ceHours?.toFixed(1) || '0', 420, rowY, { width: 40 });
      doc.text(cert.category || 'General', 470, rowY, { width: 80 });
      
      rowY += 18;
    });
    
    // Footer
    doc.moveDown(2);
    doc.fontSize(8).fillColor('#999999')
       .text('This transcript is an official record of continuing education completed through CounselorReady.', 50, 720, { align: 'center' });
    doc.text('Verify individual certificates at counselorready.com/verify', { align: 'center' });
    
    doc.end();
    
    const pdfBuffer = await pdfPromise;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="CE_Transcript_${new Date().toISOString().split('T')[0]}.pdf"`);
    res.send(pdfBuffer);
    
  } catch (error) {
    console.error('Generate transcript error:', error);
    res.status(500).json({ error: 'Failed to generate transcript' });
  }
});

// @route   GET /api/certificates/transcript/json
// @desc    Get transcript data as JSON (for display)
// @access  Private
router.get('/transcript/json', protect, async (req, res) => {
  try {
    const certificates = await Certificate.find({ 
      userId: req.user._id,
      isRevoked: { $ne: true }
    }).sort({ completionDate: -1 });
    
    // Calculate totals by category
    const categoryTotals = {};
    let totalHours = 0;
    
    certificates.forEach(cert => {
      const cat = cert.category || 'General';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + (cert.ceHours || 0);
      totalHours += cert.ceHours || 0;
    });
    
    res.json({
      totalHours,
      categoryTotals,
      certificateCount: certificates.length,
      certificates: certificates.map(c => ({
        id: c._id,
        title: c.title,
        provider: c.provider,
        completionDate: c.completionDate,
        ceHours: c.ceHours,
        category: c.category,
        verificationCode: c.verificationCode,
        nbccApproved: c.nbccApproved
      }))
    });
  } catch (error) {
    console.error('Get transcript JSON error:', error);
    res.status(500).json({ error: 'Failed to get transcript' });
  }
});

export default router;
