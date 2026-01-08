import express from 'express';
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
    for (const cred of credentials) {
      cred.updateStatus();
    }
    
    res.json({ credentials });
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
    
    // Check credential limit for free users
    if (!req.user.hasActiveSubscription()) {
      const existingCount = await UserCredential.countDocuments({ userId: req.user._id });
      if (existingCount >= 1) {
        return res.status(403).json({
          error: 'Free accounts limited to 1 credential. Upgrade to Pro for unlimited.',
          code: 'CREDENTIAL_LIMIT'
        });
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
      'remindersEnabled', 'customReminders'
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

export default router;
