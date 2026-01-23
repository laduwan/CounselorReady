import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import UserCredential from '../models/UserCredential.js';
import CredentialTemplate from '../models/CredentialTemplate.js';
import { protect, requireSubscription } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/credentials
// @desc    Get user's credentials
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const credentials = await UserCredential.find({ userId: req.user._id })
      .sort({ expirationDate: 1 });
    
    // Update status for each credential
    const credentialsWithMeta = credentials.map(cred => {
      cred.updateStatus();
      return cred.toJSON();
    });
    
    // Get consultation status
    const consultStatus = req.user.canBookConsultation();
    
    res.json({ 
      credentials: credentialsWithMeta,
      meta: {
        primaryState: req.user.primaryState,
        maxStates: req.user.getMaxStates(),
        canAddMoreStates: req.user.getMaxStates() > 1,
        consultation: {
          canBook: consultStatus.allowed,
          reason: consultStatus.reason,
          nextQuarter: consultStatus.nextQuarter,
          currentQuarter: req.user.getCurrentQuarter(),
          usedThisQuarter: req.user.hasUsedQuarterlyConsult()
        }
      }
    });
  } catch (error) {
    console.error('Get credentials error:', error);
    res.status(500).json({ error: 'Failed to get credentials' });
  }
});

// @route   POST /api/credentials
// @desc    Add a credential
// @access  Private (Pro required for more than 1)
router.post('/', protect, async (req, res) => {
  try {
    const {
      templateId,
      credentialType,
      name,
      code,
      issuingBody,
      licenseNumber,
      state,
      issueDate,
      expirationDate,
      renewalCycle,
      totalCEUsRequired,
      requirements
    } = req.body;
    
    // Check state tracking limits based on subscription
    if (state) {
      const canTrack = req.user.canTrackState(state);
      if (!canTrack) {
        return res.status(403).json({
          error: `Your plan only allows tracking credentials in ${req.user.primaryState}. Upgrade to VIP for unlimited states.`,
          code: 'STATE_LIMIT',
          currentState: req.user.primaryState,
          maxStates: req.user.getMaxStates()
        });
      }
      
      // Set primary state if not set yet (for Free/Professional users)
      if (!req.user.primaryState && !['vip', 'annual_vip', 'lifetime'].includes(req.user.subscription.plan)) {
        req.user.primaryState = state.toUpperCase();
        await req.user.save();
      }
    }
    
    let credentialData = {
      userId: req.user._id,
      credentialType: credentialType || 'custom',
      name,
      code,
      issuingBody,
      licenseNumber,
      state,
      issueDate,
      expirationDate,
      renewalCycle,
      totalCEUsRequired,
      requirements: requirements || []
    };
    
    // If using a template, merge template data
    if (templateId) {
      const template = await CredentialTemplate.findById(templateId);
      if (template) {
        credentialData = {
          ...credentialData,
          templateId,
          credentialType: template.type,
          name: name || `${template.state || ''} ${template.code}`.trim(),
          code: code || template.code,
          issuingBody: issuingBody || template.issuingBody,
          state: state || template.state,
          renewalCycle: renewalCycle || template.renewalCycle,
          totalCEUsRequired: totalCEUsRequired || template.totalCEUsRequired,
          requirements: requirements || template.requirements.map(r => ({
            category: r.category,
            hoursRequired: r.hoursRequired,
            hoursCompleted: 0
          }))
        };
      }
    }
    
    const credential = await UserCredential.create(credentialData);
    credential.updateStatus();
    
    res.status(201).json({
      message: 'Credential added',
      credential
    });
  } catch (error) {
    console.error('Add credential error:', error);
    res.status(500).json({ error: 'Failed to add credential' });
  }
});

// @route   GET /api/credentials/consult-status
// @desc    Get consultation status for current user
// @access  Private
router.get('/consult-status', protect, async (req, res) => {
  try {
    const canBook = req.user.canBookConsultation();
    const history = req.user.consultations || [];
    
    res.json({
      canBook: canBook.allowed,
      reason: canBook.reason,
      currentQuarter: req.user.getCurrentQuarter(),
      nextQuarter: req.user.getNextQuarter(),
      usedThisQuarter: req.user.hasUsedQuarterlyConsult(),
      history: history.map(c => ({
        quarter: c.quarter,
        requestedAt: c.requestedAt,
        completedAt: c.completedAt,
        topic: c.topic
      }))
    });
  } catch (error) {
    console.error('Consult status error:', error);
    res.status(500).json({ error: 'Failed to get consultation status' });
  }
});

// @route   GET /api/credentials/:id
// @desc    Get single credential
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const credential = await UserCredential.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!credential) {
      return res.status(404).json({ error: 'Credential not found' });
    }
    
    credential.updateStatus();
    
    res.json({ credential });
  } catch (error) {
    console.error('Get credential error:', error);
    res.status(500).json({ error: 'Failed to get credential' });
  }
});

// @route   PUT /api/credentials/:id
// @desc    Update credential
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const credential = await UserCredential.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!credential) {
      return res.status(404).json({ error: 'Credential not found' });
    }
    
    const allowedUpdates = [
      'name', 'licenseNumber', 'issueDate', 'expirationDate',
      'remindersEnabled', 'customReminders', 'state', 'issuingBody'
    ];
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        credential[field] = req.body[field];
      }
    });
    
    credential.updateStatus();
    await credential.save();
    
    res.json({
      message: 'Credential updated',
      credential
    });
  } catch (error) {
    console.error('Update credential error:', error);
    res.status(500).json({ error: 'Failed to update credential' });
  }
});

// @route   DELETE /api/credentials/:id
// @desc    Delete credential
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const credential = await UserCredential.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!credential) {
      return res.status(404).json({ error: 'Credential not found' });
    }
    
    res.json({ message: 'Credential deleted' });
  } catch (error) {
    console.error('Delete credential error:', error);
    res.status(500).json({ error: 'Failed to delete credential' });
  }
});

// @route   POST /api/credentials/:id/log-ceu
// @desc    Log CEU hours to a credential
// @access  Private
router.post('/:id/log-ceu', protect, async (req, res) => {
  try {
    const { hours, category, description, provider, date, certificateId, courseId } = req.body;
    
    if (!hours || !category || !description) {
      return res.status(400).json({ error: 'Hours, category, and description are required' });
    }
    
    const credential = await UserCredential.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!credential) {
      return res.status(404).json({ error: 'Credential not found' });
    }
    
    await credential.addCEU({
      hours,
      category,
      description,
      provider,
      date,
      certificateId,
      courseId,
      source: courseId ? 'internal' : 'external'
    });
    
    res.json({
      message: 'CEU logged',
      credential
    });
  } catch (error) {
    console.error('Log CEU error:', error);
    res.status(500).json({ error: 'Failed to log CEU' });
  }
});

// @route   GET /api/credentials/templates
// @desc    Get all credential templates
// @access  Public
router.get('/templates/all', async (req, res) => {
  try {
    const templates = await CredentialTemplate.find({ isActive: true })
      .sort({ type: 1, state: 1, code: 1 });
    
    // Group by type
    const grouped = {
      state_license: templates.filter(t => t.type === 'state_license'),
      national_cert: templates.filter(t => t.type === 'national_cert'),
      specialty_cert: templates.filter(t => t.type === 'specialty_cert')
    };
    
    res.json({ templates: grouped });
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({ error: 'Failed to get templates' });
  }
});

// @route   GET /api/credentials/templates/:state
// @desc    Get templates for a specific state
// @access  Public
router.get('/templates/state/:state', async (req, res) => {
  try {
    const templates = await CredentialTemplate.find({
      isActive: true,
      state: req.params.state.toUpperCase()
    }).sort({ code: 1 });
    
    res.json({ templates });
  } catch (error) {
    console.error('Get state templates error:', error);
    res.status(500).json({ error: 'Failed to get templates' });
  }
});

// @route   GET /api/credentials/dashboard
// @desc    Get credential dashboard summary
// @access  Private
router.get('/user/dashboard', protect, async (req, res) => {
  try {
    const credentials = await UserCredential.find({ userId: req.user._id })
      .sort({ expirationDate: 1 });
    
    // Calculate summary
    const summary = {
      totalCredentials: credentials.length,
      expiringSoon: 0,
      expired: 0,
      upcomingDeadlines: [],
      overallProgress: {
        totalRequired: 0,
        totalCompleted: 0,
        percentComplete: 0
      }
    };
    
    credentials.forEach(cred => {
      cred.updateStatus();
      
      if (cred.status === 'expired') {
        summary.expired++;
      } else if (cred.status === 'expiring_soon') {
        summary.expiringSoon++;
      }
      
      // Add to upcoming deadlines
      if (cred.daysUntilExpiration > 0 && cred.daysUntilExpiration <= 180) {
        summary.upcomingDeadlines.push({
          credentialId: cred._id,
          name: cred.name,
          expirationDate: cred.expirationDate,
          daysRemaining: cred.daysUntilExpiration,
          ceusRemaining: cred.totalCEUsRequired - cred.totalCEUsCompleted
        });
      }
      
      // Overall progress
      summary.overallProgress.totalRequired += cred.totalCEUsRequired;
      summary.overallProgress.totalCompleted += cred.totalCEUsCompleted;
    });
    
    if (summary.overallProgress.totalRequired > 0) {
      summary.overallProgress.percentComplete = Math.round(
        (summary.overallProgress.totalCompleted / summary.overallProgress.totalRequired) * 100
      );
    }
    
    res.json({
      summary,
      credentials
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ error: 'Failed to get dashboard' });
  }
});

// @route   POST /api/credentials/book-consult
// @desc    Book a VIP consultation (1 per quarter)
// @access  Private (VIP only)
router.post('/book-consult', protect, async (req, res) => {
  try {
    const { topic } = req.body;
    
    // Check if can book
    const canBook = req.user.canBookConsultation();
    if (!canBook.allowed) {
      return res.status(403).json({
        error: canBook.reason,
        nextQuarter: canBook.nextQuarter,
        code: 'CONSULT_LIMIT'
      });
    }
    
    // Book the consultation
    await req.user.bookConsultation(topic || 'General consultation');
    
    res.json({
      message: 'Consultation requested successfully',
      quarter: req.user.getCurrentQuarter(),
      // You'll receive an email to schedule your session
      nextSteps: 'Check your email for scheduling instructions'
    });
  } catch (error) {
    console.error('Book consult error:', error);
    res.status(500).json({ error: error.message || 'Failed to book consultation' });
  }
});

// Configure multer for credential document uploads
const uploadDir = './uploads/credentials';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `cred-${req.user._id}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, JPG, and PNG files allowed'));
    }
  }
});

// @route   POST /api/credentials/:id/upload
// @desc    Upload document for a credential
// @access  Private
router.post('/:id/upload', protect, upload.single('document'), async (req, res) => {
  try {
    const credential = await UserCredential.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!credential) {
      return res.status(404).json({ error: 'Credential not found' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Update credential with document info
    credential.documentUrl = `/uploads/credentials/${req.file.filename}`;
    credential.documentName = req.file.originalname;
    await credential.save();

    res.json({
      message: 'Document uploaded successfully',
      documentUrl: credential.documentUrl,
      documentName: credential.documentName
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload document' });
  }
});

// @route   DELETE /api/credentials/:id/document
// @desc    Delete document from credential
// @access  Private
router.delete('/:id/document', protect, async (req, res) => {
  try {
    const credential = await UserCredential.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!credential) {
      return res.status(404).json({ error: 'Credential not found' });
    }

    // Delete file if exists
    if (credential.documentUrl) {
      const filePath = '.' + credential.documentUrl;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    credential.documentUrl = null;
    credential.documentName = null;
    await credential.save();

    res.json({ message: 'Document deleted' });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

export default router;
