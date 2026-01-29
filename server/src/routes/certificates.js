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

// Helper function to calculate if course is actually completed
const calculateCourseCompletion = (course, progress) => {
  if (!course || !progress) return false;
  
  // Get total lessons from course modules
  let totalLessons = 0;
  if (course.modules && Array.isArray(course.modules)) {
    course.modules.forEach(module => {
      if (module.lessons && Array.isArray(module.lessons)) {
        totalLessons += module.lessons.length;
      }
    });
  }
  
  // If no lessons, can't complete
  if (totalLessons === 0) return false;
  
  // Count completed lessons from progress
  // NOTE: Field is "lessonsCompleted" (array of {lessonId, completedAt}), NOT "lessons"
  const completedLessons = progress.lessonsCompleted?.length || 0;
  
  console.log('Course completion check:', {
    courseId: course._id,
    totalLessons,
    completedLessons,
    isComplete: completedLessons >= totalLessons && totalLessons > 0
  });
  
  return completedLessons >= totalLessons && totalLessons > 0;
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
    
    // ✅ FIXED: Calculate actual completion based on lessons
    const courseCompleted = calculateCourseCompletion(course, progress);
    
    const requireEvaluation = course.settings?.requireEvaluation !== false;
    const requireAttestation = course.settings?.requireAttestation !== false;
    
    const requirements = {
      enrolled: true,
      courseCompleted: courseCompleted,
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
              certificateId: certificate._id,
              hours: certificate.ceHours,
              category: certificate.category,
              date: certificate.completionDate,
              source: 'external'
            });
            console.log('Logged CEU to credential:', credId);
          }
        } catch (credError) {
          console.error('Error logging CEU to credential:', credError);
        }
      }
    }
    
    res.status(201).json({ certificate });
  } catch (error) {
    console.error('Create certificate error:', error);
    res.status(500).json({ error: 'Failed to create certificate' });
  }
});

// POST /api/certificates/generate/:courseId - Generate certificate for completed course
router.post('/generate/:courseId', protect, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;
    
    console.log('Generate certificate request:', { courseId, userId });
    
    // Check if certificate already exists
    const existingCert = await Certificate.findOne({ 
      userId, 
      courseId, 
      source: 'platform' 
    });
    
    if (existingCert) {
      return res.status(400).json({ 
        error: 'Certificate already exists for this course',
        certificateId: existingCert._id
      });
    }
    
    // Get course and progress
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    const progress = await UserCourseProgress.findOne({ userId, courseId });
    if (!progress) {
      return res.status(400).json({ error: 'Not enrolled in this course' });
    }
    
    // ✅ FIXED: Check actual completion based on lessons
    const courseCompleted = calculateCourseCompletion(course, progress);
    
    if (!courseCompleted) {
      return res.status(400).json({ 
        error: 'Course not completed. Please complete all lessons first.',
        progress: {
          lessonsCompleted: progress.lessonsCompleted?.length || 0,
          totalLessons: course.modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0
        }
      });
    }
    
    // Check evaluation requirement
    const requireEvaluation = course.settings?.requireEvaluation !== false;
    if (requireEvaluation && !progress.evaluationCompleted) {
      return res.status(400).json({ error: 'Please complete the course evaluation first' });
    }
    
    // Check attestation requirement
    const requireAttestation = course.settings?.requireAttestation !== false;
    if (requireAttestation && !progress.attestationCompleted) {
      return res.status(400).json({ error: 'Please complete the attestation first' });
    }
    
    // Get user info
    const user = await User.findById(userId);
    const fullName = `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim() || user.email;
    
    // Generate certificate number
    const certificateNumber = await generateCertificateNumber();
    
    // Generate certificate PDF
    const pdfBuffer = await generateCertificate({
      holderName: fullName,
      courseName: course.title,
      completionDate: new Date(),
      ceHours: course.ceuHours || course.ceHours || 0,
      certificateNumber,
      instructorName: course.instructor?.name || 'CounselorReady',
      acepNumber: course.acepNumber || 'ACEP #7760'
    });
    
    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(pdfBuffer, {
      folder: `certificates/${userId}`,
      resource_type: 'auto',
      public_id: `platform_cert_${certificateNumber}`,
      format: 'pdf'
    });
    
    // Create certificate record
    const certificate = await Certificate.create({
      userId,
      courseId,
      title: course.title,
      provider: 'CounselorReady',
      completionDate: new Date(),
      ceHours: course.ceuHours || course.ceHours || 0,
      category: course.category || 'General',
      nbccApproved: true,
      acepNumber: course.acepNumber || 'ACEP #7760',
      certificateNumber,
      fileUrl: uploadResult.secure_url,
      fileKey: uploadResult.public_id,
      fileName: `${course.title}_Certificate.pdf`,
      fileType: 'application/pdf',
      source: 'platform'
    });
    
    // Update progress to mark as completed
    progress.status = 'completed';
    progress.completedAt = new Date();
    await progress.save();
    
    console.log('Certificate generated successfully:', certificate._id);
    
    // ============================================
    // AUTO-APPLY CE HOURS TO USER'S CREDENTIALS
    // ============================================
    try {
      // Find all active credentials for this user
      const userCredentials = await UserCredential.find({ 
        userId,
        status: { $in: ['active', 'expiring_soon'] }
      });
      
      if (userCredentials.length > 0) {
        console.log(`Found ${userCredentials.length} credentials to apply CE hours to`);
        
        for (const credential of userCredentials) {
          try {
            // Check if this certificate's category matches any requirement
            const certCategory = certificate.category || 'General';
            const matchingReq = credential.requirements.find(r => 
              r.category === certCategory || r.category === 'General'
            );
            
            // Also check if hours are still needed
            if (credential.totalCEUsCompleted < credential.totalCEUsRequired) {
              await credential.addCEU({
                certificateId: certificate._id,
                courseId: course._id,
                hours: certificate.ceHours,
                category: certCategory,
                description: `${course.title} - CounselorReady Course`,
                provider: 'CounselorReady',
                date: certificate.completionDate,
                source: 'internal'
              });
              console.log(`Applied ${certificate.ceHours} CE hours to credential: ${credential.name}`);
            }
          } catch (credError) {
            console.error(`Error applying CEUs to credential ${credential._id}:`, credError);
            // Continue with other credentials even if one fails
          }
        }
      }
    } catch (credentialError) {
      console.error('Error auto-applying CE hours to credentials:', credentialError);
      // Don't fail the certificate generation if credential update fails
    }

    // Send completion email
    try {
      await sendCourseCompletionEmail(user, course, certificate);
    } catch (emailError) {
      console.error('Failed to send completion email:', emailError);
      // Don't fail the request if email fails
    }
    
    res.status(201).json({ 
      success: true,
      certificate,
      message: 'Certificate generated successfully'
    });
    
  } catch (error) {
    console.error('Generate certificate error:', error);
    res.status(500).json({ error: 'Failed to generate certificate' });
  }
});

// GET /api/certificates/:id - Get specific certificate
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
    
    const { title, provider, completionDate, ceHours, category, nbccApproved, acepNumber, notes, credentials, approvingBody, approvalNumber, applicability, applicableStates } = req.body;
    
    // Update fields
    if (title) certificate.title = title;
    if (provider) certificate.provider = provider;
    if (completionDate) certificate.completionDate = new Date(completionDate);
    if (ceHours) certificate.ceHours = parseFloat(ceHours);
    if (category) certificate.category = category;
    if (nbccApproved !== undefined) certificate.nbccApproved = nbccApproved === 'true' || nbccApproved === true;
    if (acepNumber !== undefined) certificate.acepNumber = acepNumber || null;
    if (approvingBody !== undefined) certificate.approvingBody = approvingBody || null;
    if (approvalNumber !== undefined) certificate.approvalNumber = approvalNumber || null;
    if (applicability) certificate.applicability = applicability;
    if (notes !== undefined) certificate.notes = notes || null;
    
    // Parse and update credentials
    if (credentials) {
      try {
        certificate.credentials = typeof credentials === 'string' ? JSON.parse(credentials) : credentials;
      } catch (e) {
        certificate.credentials = [];
      }
    }
    
    // Parse and update applicable states
    if (applicableStates) {
      try {
        certificate.applicableStates = typeof applicableStates === 'string' ? JSON.parse(applicableStates) : applicableStates;
      } catch (e) {
        certificate.applicableStates = [];
      }
    }
    
    // Upload new file if provided
    if (req.file) {
      try {
        // Delete old file from Cloudinary if exists
        if (certificate.fileKey) {
          await cloudinary.uploader.destroy(certificate.fileKey);
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
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
      }
    }
    
    await certificate.save();
    
    res.json({ certificate });
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
    
    // Don't allow deletion of platform-generated certificates
    if (certificate.source === 'platform') {
      return res.status(403).json({ 
        error: 'Cannot delete platform-generated certificates. Please contact support if you need to revoke this certificate.' 
      });
    }
    
    // Delete file from Cloudinary if exists
    if (certificate.fileKey) {
      try {
        await cloudinary.uploader.destroy(certificate.fileKey);
      } catch (cloudError) {
        console.error('Error deleting from Cloudinary:', cloudError);
      }
    }
    
    // Remove CEU logs from linked credentials
    if (certificate.credentials && certificate.credentials.length > 0) {
      for (const credId of certificate.credentials) {
        try {
          const credential = await UserCredential.findOne({
            _id: credId,
            userId: req.user._id
          });
          
          if (credential) {
            await credential.removeCEU(certificate._id);
          }
        } catch (credError) {
          console.error('Error removing CEU from credential:', credError);
        }
      }
    }
    
    await certificate.deleteOne();
    
    res.json({ message: 'Certificate deleted successfully' });
  } catch (error) {
    console.error('Delete certificate error:', error);
    res.status(500).json({ error: 'Failed to delete certificate' });
  }
});

// POST /api/certificates/:id/revoke - Revoke a certificate (admin only)
router.post('/:id/revoke', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can revoke certificates' });
    }
    
    const { reason } = req.body;
    
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }
    
    certificate.isRevoked = true;
    certificate.revokedAt = new Date();
    certificate.revokedBy = req.user._id;
    certificate.revokedReason = reason || 'Revoked by administrator';
    
    await certificate.save();
    
    res.json({ 
      message: 'Certificate revoked successfully',
      certificate 
    });
  } catch (error) {
    console.error('Revoke certificate error:', error);
    res.status(500).json({ error: 'Failed to revoke certificate' });
  }
});

// GET /api/certificates/verify/:code - Public verification endpoint
router.get('/verify/:code', async (req, res) => {
  try {
    const { code } = req.params;
    
    const certificate = await Certificate.findOne({ 
      verificationCode: code 
    }).populate('userId', 'profile.firstName profile.lastName');
    
    if (!certificate) {
      return res.json({ 
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

// ============================================
// SYNC CE HOURS TO CREDENTIALS
// ============================================

// @route   POST /api/certificates/sync-ce
// @desc    Sync all user's certificates to their credentials (for existing data)
// @access  Private
router.post('/sync-ce', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get all user's certificates
    const certificates = await Certificate.find({ 
      userId,
      isRevoked: { $ne: true }
    });
    
    // Get all user's active credentials
    const credentials = await UserCredential.find({ 
      userId,
      status: { $in: ['active', 'expiring_soon'] }
    });
    
    if (credentials.length === 0) {
      return res.json({ 
        message: 'No active credentials found to sync',
        synced: 0 
      });
    }
    
    if (certificates.length === 0) {
      return res.json({ 
        message: 'No certificates found to sync',
        synced: 0 
      });
    }
    
    let totalSynced = 0;
    const syncResults = [];
    
    for (const credential of credentials) {
      // Clear existing logs to avoid duplicates (optional - remove if you want to preserve)
      // credential.ceuLogs = [];
      // credential.totalCEUsCompleted = 0;
      
      // Check which certificates haven't been logged to this credential yet
      const existingCertIds = credential.ceuLogs.map(log => log.certificateId?.toString()).filter(Boolean);
      
      for (const cert of certificates) {
        // Skip if already logged
        if (existingCertIds.includes(cert._id.toString())) {
          continue;
        }
        
        // Skip if credential already has enough hours
        if (credential.totalCEUsCompleted >= credential.totalCEUsRequired) {
          continue;
        }
        
        try {
          await credential.addCEU({
            certificateId: cert._id,
            courseId: cert.courseId || null,
            hours: cert.ceHours || 0,
            category: cert.category || 'General',
            description: cert.title,
            provider: cert.provider || 'External',
            date: cert.completionDate,
            source: cert.source === 'platform' ? 'internal' : 'external'
          });
          
          totalSynced++;
          syncResults.push({
            certificate: cert.title,
            credential: credential.name,
            hours: cert.ceHours
          });
        } catch (err) {
          console.error(`Failed to sync cert ${cert._id} to credential ${credential._id}:`, err);
        }
      }
    }
    
    res.json({
      message: `Synced ${totalSynced} certificate(s) to credentials`,
      synced: totalSynced,
      details: syncResults,
      credentials: credentials.map(c => ({
        name: c.name,
        totalRequired: c.totalCEUsRequired,
        totalCompleted: c.totalCEUsCompleted
      }))
    });
    
  } catch (error) {
    console.error('Sync CE error:', error);
    res.status(500).json({ error: 'Failed to sync CE hours' });
  }
});

// @route   GET /api/certificates/ce-summary
// @desc    Get CE hours summary across all credentials
// @access  Private
router.get('/ce-summary', protect, async (req, res) => {
  try {
    const credentials = await UserCredential.find({ 
      userId: req.user._id 
    });
    
    const certificates = await Certificate.find({ 
      userId: req.user._id,
      isRevoked: { $ne: true }
    });
    
    const totalCertificateHours = certificates.reduce((sum, c) => sum + (c.ceHours || 0), 0);
    
    res.json({
      totalCertificates: certificates.length,
      totalCertificateHours,
      credentials: credentials.map(c => ({
        id: c._id,
        name: c.name,
        code: c.code,
        expirationDate: c.expirationDate,
        totalRequired: c.totalCEUsRequired,
        totalCompleted: c.totalCEUsCompleted,
        remaining: Math.max(0, c.totalCEUsRequired - c.totalCEUsCompleted),
        percentComplete: c.percentComplete,
        status: c.status,
        ceuLogCount: c.ceuLogs?.length || 0
      }))
    });
  } catch (error) {
    console.error('CE summary error:', error);
    res.status(500).json({ error: 'Failed to get CE summary' });
  }
});

export default router;
