// /server/src/routes/certificates.js
// Fixed JWT user extraction for certificates router
import { Router } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import Certificate from '../models/Certificate.js';
import jwt from 'jsonwebtoken';

// Use native fetch (Node 18+) — no need for node-fetch

// Create router instance
const router = Router();

// Fixed auth middleware with better JWT user extraction
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error('JWT verification error:', err);
        return res.status(403).json({ error: 'Invalid or expired token' });
      }
      
      // Handle different JWT payload structures
      req.user = {
        _id: decoded._id || decoded.userId || decoded.id || decoded.sub,
        ...decoded
      };
      
      console.log(`Authenticated user: ${req.user._id}`);
      
      if (!req.user._id) {
        console.error('No user ID found in token:', decoded);
        return res.status(403).json({ error: 'Invalid token structure' });
      }
      
      next();
    });
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ error: 'Authentication error' });
  }
};

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, JPG, and PNG files are allowed'), false);
    }
  }
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ✅ FIXED: Secure certificate serving route using Cloudinary signed/private URLs
router.get('/:id/serve', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    console.log(`Certificate serve request: ${id} from user: ${userId}`);

    // Find certificate and verify ownership
    const certificate = await Certificate.findById(id);
    
    if (!certificate) {
      console.log(`Certificate not found: ${id}`);
      return res.status(404).json({ error: 'Certificate not found' });
    }

    // Verify user owns this certificate
    if (certificate.userId.toString() !== userId.toString()) {
      console.log(`Access denied for certificate ${id} - user mismatch`);
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!certificate.fileUrl) {
      console.log(`No file URL for certificate ${id}`);
      return res.status(404).json({ error: 'Certificate file not available' });
    }

    console.log(`Serving certificate ${certificate.certificateNumber || id} from: ${certificate.fileUrl}`);

    // Extract public_id from the Cloudinary URL
    // URL format: https://res.cloudinary.com/{cloud}/image/upload/v{version}/{public_id}.{ext}
    const urlMatch = certificate.fileUrl.match(/\/upload\/(?:v\d+\/)?(.+)$/);
    
    if (!urlMatch) {
      console.log('Could not parse Cloudinary URL, trying raw fetch...');
      return tryRawFetch(certificate.fileUrl, certificate, res);
    }

    const fullPath = urlMatch[1]; // e.g., "certificates/userId/cert_name.pdf"
    const publicId = fullPath.replace(/\.[^.]+$/, '');
    const ext = fullPath.match(/\.([^.]+)$/)?.[1] || 'pdf';
    
    console.log(`Extracted public_id: ${publicId}, format: ${ext}`);

    // Strategy 1: Check if resource exists and get its details via Admin API
    try {
      const resourceInfo = await cloudinary.api.resource(publicId, { resource_type: 'image' });
      console.log(`✅ Resource found in Cloudinary: ${resourceInfo.public_id}, bytes: ${resourceInfo.bytes}, type: ${resourceInfo.type}`);
      
      // Use the secure_url from the resource info (freshest URL)
      const freshUrl = resourceInfo.secure_url;
      console.log(`Fresh URL from API: ${freshUrl}`);
      
      const fetchResult = await fetch(freshUrl);
      if (fetchResult.ok) {
        const arrayBuffer = await fetchResult.arrayBuffer();
        const fileBuffer = Buffer.from(arrayBuffer);
        console.log(`✅ Fetched via fresh URL, size: ${fileBuffer.length} bytes`);
        return sendFile(res, fileBuffer, certificate, ext);
      }
      console.log(`Fresh URL returned ${fetchResult.status}`);
    } catch (apiErr) {
      console.log(`Admin API check failed: ${apiErr.message}`);
      
      // Maybe it was uploaded as 'raw' resource type instead of 'image'
      try {
        const rawResource = await cloudinary.api.resource(publicId, { resource_type: 'raw' });
        console.log(`✅ Found as raw resource: ${rawResource.secure_url}`);
        const fetchResult = await fetch(rawResource.secure_url);
        if (fetchResult.ok) {
          const arrayBuffer = await fetchResult.arrayBuffer();
          const fileBuffer = Buffer.from(arrayBuffer);
          return sendFile(res, fileBuffer, certificate, ext);
        }
      } catch (rawErr) {
        console.log(`Raw resource check also failed: ${rawErr.message}`);
      }
    }

    // Strategy 2: Generate a signed URL
    try {
      const signedUrl = cloudinary.url(publicId, {
        sign_url: true,
        resource_type: 'image',
        format: ext,
        secure: true
      });
      console.log(`Trying signed URL: ${signedUrl}`);
      
      const signedResult = await fetch(signedUrl);
      if (signedResult.ok) {
        const arrayBuffer = await signedResult.arrayBuffer();
        const fileBuffer = Buffer.from(arrayBuffer);
        console.log(`✅ Signed URL worked, size: ${fileBuffer.length} bytes`);
        return sendFile(res, fileBuffer, certificate, ext);
      }
      console.log(`Signed URL returned ${signedResult.status}`);
    } catch (signErr) {
      console.log(`Signed URL attempt failed: ${signErr.message}`);
    }

    // Strategy 3: Try raw stored URL  
    return tryRawFetch(certificate.fileUrl, certificate, res);

  } catch (error) {
    console.error('Certificate serving error:', error);
    res.status(500).json({ error: 'Failed to serve certificate' });
  }
});

// Helper: send file with proper headers
function sendFile(res, fileBuffer, certificate, ext) {
  const fileName = certificate.fileName || `certificate.${ext}`;
  const isImage = /^(jpg|jpeg|png)$/i.test(ext);
  const contentType = isImage 
    ? (ext === 'png' ? 'image/png' : 'image/jpeg')
    : 'application/pdf';

  res.set({
    'Content-Type': contentType,
    'Content-Disposition': `inline; filename="${fileName}"`,
    'Content-Length': fileBuffer.length,
    'Cache-Control': 'private, max-age=3600'
  });
  return res.send(fileBuffer);
}

// Helper: try raw URL fetch with redirect fallback
async function tryRawFetch(url, certificate, res) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer();
      const fileBuffer = Buffer.from(arrayBuffer);
      console.log(`✅ Raw URL worked, size: ${fileBuffer.length} bytes`);
      const ext = url.match(/\.([^.?]+)(?:\?|$)/)?.[1] || 'pdf';
      return sendFile(res, fileBuffer, certificate, ext);
    }
    console.log(`Raw URL returned ${response.status}, redirecting as last resort...`);
  } catch (err) {
    console.error('Raw URL fetch failed:', err.message);
  }
  // Absolute last resort: redirect
  return res.redirect(url);
}

// GET /api/certificates - Get all certificates for authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const certificates = await Certificate.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    
    console.log(`Retrieved ${certificates.length} certificates for user ${req.user._id}`);
    res.json({ certificates });
  } catch (error) {
    console.error('Get certificates error:', error);
    res.status(500).json({ error: 'Failed to fetch certificates' });
  }
});

// POST /api/certificates/upload - Upload new certificate
router.post('/upload', authenticateToken, upload.single('certificate'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const {
      title,
      provider,
      completionDate,
      ceHours,
      category = 'General',
      nbccApproved = false,
      approvingBody,
      approvalNumber,
      applicability,
      notes,
      credentials
    } = req.body;

    // Validate required fields
    if (!title || !provider || !completionDate || !ceHours) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields: title, provider, completionDate, ceHours' 
      });
    }

    console.log(`Uploading certificate: ${title} for user: ${req.user._id}`);

    // Generate certificate number
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    const certificateNumber = `CR-${randomStr}-${timestamp.toString().slice(-4)}`;

    // Upload to Cloudinary
    const isPDF = req.file.mimetype === 'application/pdf';
    const fileExt = isPDF ? 'pdf' : (req.file.mimetype === 'image/png' ? 'png' : 'jpg');
    
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: `certificates/${req.user._id}`,
          public_id: `cert_${timestamp}`,
          resource_type: 'image',
          format: fileExt
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    console.log(`File uploaded to Cloudinary: ${uploadResult.secure_url}`);

    // Create certificate record
    const certificate = new Certificate({
      userId: req.user._id,
      title,
      provider,
      completionDate: new Date(completionDate),
      ceHours: parseFloat(ceHours),
      category,
      nbccApproved: nbccApproved === 'true' || nbccApproved === true,
      approvingBody,
      approvalNumber,
      applicability: applicability || null,
      notes,
      certificateNumber,
      fileUrl: uploadResult.secure_url,
      fileKey: uploadResult.public_id,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      source: 'upload',
      credentials: credentials ? JSON.parse(credentials) : []
    });

    await certificate.save();
    console.log(`Certificate saved with ID: ${certificate._id}`);

    res.status(201).json({
      success: true,
      message: 'Certificate uploaded successfully',
      certificate
    });

  } catch (error) {
    console.error('Certificate upload error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to upload certificate: ' + error.message 
    });
  }
});

// POST /api/certificates/generate/:courseId - Generate certificate for completed course
router.post('/generate/:courseId', authenticateToken, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    console.log(`Certificate generation request for course ${courseId} by user ${userId}`);

    // Check if certificate already exists
    const existingCert = await Certificate.findOne({
      userId,
      courseId,
      source: 'platform'
    });

    if (existingCert) {
      return res.status(400).json({
        success: false,
        error: 'Certificate already exists for this course'
      });
    }

    // Placeholder for certificate generation
    res.status(400).json({
      success: false,
      error: 'Certificate generation temporarily disabled - feature under development'
    });

  } catch (error) {
    console.error('Certificate generation error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to generate certificate' 
    });
  }
});

// DELETE /api/certificates/:id - Delete certificate
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const certificate = await Certificate.findOneAndDelete({
      _id: id,
      userId: userId
    });

    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    console.log(`Deleted certificate: ${certificate.certificateNumber || id}`);

    // Optionally delete from Cloudinary
    if (certificate.fileKey) {
      try {
        await cloudinary.uploader.destroy(certificate.fileKey, { resource_type: 'image' });
        console.log(`Deleted file from Cloudinary: ${certificate.fileKey}`);
      } catch (cloudinaryError) {
        console.error('Failed to delete from Cloudinary:', cloudinaryError);
      }
    }

    res.json({ message: 'Certificate deleted successfully' });
  } catch (error) {
    console.error('Delete certificate error:', error);
    res.status(500).json({ error: 'Failed to delete certificate' });
  }
});

// GET /api/certificates/transcript - Generate CE transcript
router.get('/transcript', authenticateToken, async (req, res) => {
  try {
    res.status(501).json({ error: 'Transcript generation not yet implemented' });
  } catch (error) {
    console.error('Transcript error:', error);
    res.status(500).json({ error: 'Failed to generate transcript' });
  }
});

// Export the router
export default router;
