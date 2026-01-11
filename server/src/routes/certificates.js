import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { protect } from '../middleware/auth.js';
import Certificate from '../models/Certificate.js';
import Course from '../models/Course.js';
import User from '../models/User.js';
import UserCredential from '../models/UserCredential.js';
import { generateCertificate, generateCertificateNumber } from '../utils/certificate.js';

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

// POST /api/certificates - Upload new certificate
router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    console.log('POST /api/certificates - Request received');
    console.log('Body:', req.body);
    console.log('File:', req.file ? req.file.originalname : 'No file');
    
    const { title, provider, completionDate, ceHours, category, nbccApproved, acepNumber, notes, credentials } = req.body;
    
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
    
    console.log('User:', user.name, 'Course:', course.title);
    
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
      objectives: objectives.slice(0, 3)
    };
    
    console.log('Certificate data:', certData);
    
    // Generate PDF
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
    } catch (uploadError) {
      console.error('Cloudinary upload error:', uploadError);
    }
    
    // Create or update certificate record
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
        fileUrl,
        fileKey,
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
    } else {
      // Update existing
      certificate.fileUrl = fileUrl || certificate.fileUrl;
      certificate.fileKey = fileKey || certificate.fileKey;
      await certificate.save();
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

export default router;
