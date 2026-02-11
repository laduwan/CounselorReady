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
// ✅ FIXED: Changed from require() to import for ES6 modules
import { getCertificateSignedUrl } from '../utils/certificate-fix.js';

// Add this route for secure certificate access
router.get('/:id/signed-url', protect, getCertificateSignedUrl);

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
      notes: notes || null,
      credentials: parsedCredentials,
      approvingBody: approvingBody || null,
      approvalNumber: approvalNumber || null,
      applicability: applicability || 'General',
      applicableStates: parsedApplicableStates,
      fileUrl,
      fileKey,
      fileName,
      fileType,
      source: 'manual'
    });
    
    // Sync CE hours to linked credentials
    if (parsedCredentials.length > 0) {
      for (const credentialId of parsedCredentials) {
        try {
          const credential = await UserCredential.findOne({
            _id: credentialId,
            userId: req.user._id
          });
          
          if (credential) {
            await credential.addCEU({
              source: 'Certificate',
              sourceId: certificate._id,
              ceHours: parseFloat(ceHours),
              title,
              provider,
              completionDate: new Date(completionDate),
              category: category || 'General',
              nbccApproved: nbccApproved === 'true' || nbccApproved === true
            });
          }
        } catch (credError) {
          console.error('Error adding CEU to credential:', credError);
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
    
    // Send completion email if enabled
    try {
      await sendCourseCompletionEmail({
        user,
        course,
        certificateId: certificate._id,
        certificateNumber
      });
    } catch (emailError) {
      console.error('Failed to send completion email:', emailError);
      // Don't fail the certificate generation for email issues
    }
    
    console.log('Certificate generated successfully:', {
      certificateId: certificate._id,
      certificateNumber,
      userId,
      courseId
    });
    
    res.status(201).json({ 
      certificate,
      message: 'Certificate generated successfully' 
    });
    
  } catch (error) {
    console.error('Generate certificate error:', error);
    res.status(500).json({ error: 'Failed to generate certificate: ' + error.message });
  }
});

// Continue with rest of your existing routes...
// (I'm showing the key fixed parts - the rest of your routes should remain the same)

export default router;
