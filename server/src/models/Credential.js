import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { protect } from '../middleware/auth.js';
import Certificate from '../models/Certificate.js';

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
    
    const { title, provider, completionDate, ceHours, nbccApproved, acepNumber, notes, credentials } = req.body;
    
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
    
    const { title, provider, completionDate, ceHours, nbccApproved, acepNumber, notes, credentials } = req.body;
    
    if (title) certificate.title = title;
    if (provider) certificate.provider = provider;
    if (completionDate) certificate.completionDate = new Date(completionDate);
    if (ceHours) certificate.ceHours = parseFloat(ceHours);
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

export default router;
