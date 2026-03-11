/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { Router } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { VaultDocument, SuccessionContact, SuccessionPlan, VaultCheckIn, RecoveryToken } from '../models/LegacyVault.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Multer config — PDF, images up to 10MB
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, JPG, PNG, and WebP files are allowed'), false);
    }
  }
});

// Cloudinary config (reuses env vars)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ════════════════════════════════════════════════
//  VAULT DOCUMENTS
// ════════════════════════════════════════════════

// GET /api/legacy-vault/documents — list user's vault documents
router.get('/documents', protect, async (req, res) => {
  try {
    const { category } = req.query;
    const query = { userId: req.user._id };
    if (category) query.category = category;

    const documents = await VaultDocument.find(query).sort({ updatedAt: -1 });

    // Flag documents expiring within their reminder window
    const now = new Date();
    const enriched = documents.map(doc => {
      const d = doc.toObject();
      if (d.expirationDate) {
        const daysUntil = Math.ceil((new Date(d.expirationDate) - now) / (1000 * 60 * 60 * 24));
        d.daysUntilExpiration = daysUntil;
        d.isExpiringSoon = daysUntil <= (d.reminderDays || 30) && daysUntil > 0;
        d.isExpired = daysUntil <= 0;
      }
      return d;
    });

    res.json({ documents: enriched });
  } catch (error) {
    console.error('Legacy vault documents error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/legacy-vault/documents — create document (with optional file)
router.post('/documents', protect, upload.single('file'), async (req, res) => {
  try {
    const data = {
      userId: req.user._id,
      title: req.body.title,
      category: req.body.category || 'other',
      description: req.body.description,
      expirationDate: req.body.expirationDate || null,
      reminderDays: req.body.reminderDays || 30,
      tags: req.body.tags ? JSON.parse(req.body.tags) : [],
      isConfidential: req.body.isConfidential === 'true',
      notes: req.body.notes
    };

    // Upload file to Cloudinary if provided
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: `counselorready/vault/${req.user._id}`,
            resource_type: 'auto',
            access_mode: 'authenticated',
            type: 'authenticated'
          },
          (err, result) => err ? reject(err) : resolve(result)
        );
        stream.end(req.file.buffer);
      });

      data.fileUrl = result.secure_url;
      data.fileKey = result.public_id;
      data.fileName = req.file.originalname;
      data.fileType = req.file.mimetype;
      data.fileSize = req.file.size;
    }

    const document = await VaultDocument.create(data);
    res.status(201).json({ document });
  } catch (error) {
    console.error('Create vault document error:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/legacy-vault/documents/:id — update document metadata
router.put('/documents/:id', protect, async (req, res) => {
  try {
    const document = await VaultDocument.findOne({ _id: req.params.id, userId: req.user._id });
    if (!document) return res.status(404).json({ error: 'Document not found' });

    const updates = {};
    const allowed = ['title', 'category', 'description', 'expirationDate', 'reminderDays', 'tags', 'isConfidential', 'notes'];
    for (const field of allowed) {
      if (req.body[field] !== undefined) {
        updates[field] = field === 'tags' && typeof req.body[field] === 'string'
          ? JSON.parse(req.body[field])
          : req.body[field];
      }
    }

    Object.assign(document, updates);
    await document.save();
    res.json({ document });
  } catch (error) {
    console.error('Update vault document error:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/legacy-vault/documents/:id
router.delete('/documents/:id', protect, async (req, res) => {
  try {
    const document = await VaultDocument.findOne({ _id: req.params.id, userId: req.user._id });
    if (!document) return res.status(404).json({ error: 'Document not found' });

    // Delete from Cloudinary if file exists
    if (document.fileKey) {
      try {
        await cloudinary.uploader.destroy(document.fileKey, { resource_type: 'raw', type: 'authenticated' });
      } catch (e) {
        console.warn('Cloudinary delete failed (non-blocking):', e.message);
      }
    }

    await document.deleteOne();
    res.json({ message: 'Document deleted' });
  } catch (error) {
    console.error('Delete vault document error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/legacy-vault/documents/:id/serve — serve file via signed URL
router.get('/documents/:id/serve', protect, async (req, res) => {
  try {
    const document = await VaultDocument.findOne({ _id: req.params.id, userId: req.user._id });
    if (!document) return res.status(404).json({ error: 'Document not found' });
    if (!document.fileKey) return res.status(404).json({ error: 'No file attached' });

    const url = cloudinary.utils.private_download_url(document.fileKey, '', {
      resource_type: 'auto',
      type: 'authenticated',
      expires_at: Math.floor(Date.now() / 1000) + 300 // 5 min expiry
    });

    res.json({ url, fileName: document.fileName });
  } catch (error) {
    console.error('Serve vault document error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ════════════════════════════════════════════════
//  SUCCESSION CONTACTS
// ════════════════════════════════════════════════

// GET /api/legacy-vault/contacts
router.get('/contacts', protect, async (req, res) => {
  try {
    const contacts = await SuccessionContact.find({ userId: req.user._id, isActive: true }).sort({ isPrimary: -1, name: 1 });
    res.json({ contacts });
  } catch (error) {
    console.error('Succession contacts error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/legacy-vault/contacts
router.post('/contacts', protect, async (req, res) => {
  try {
    const contact = await SuccessionContact.create({
      userId: req.user._id,
      name: req.body.name,
      role: req.body.role || 'colleague',
      email: req.body.email,
      phone: req.body.phone,
      organization: req.body.organization,
      licenseNumber: req.body.licenseNumber,
      relationship: req.body.relationship,
      accessLevel: req.body.accessLevel || 'notify-only',
      responsibilities: req.body.responsibilities,
      isPrimary: req.body.isPrimary || false,
      notes: req.body.notes
    });
    res.status(201).json({ contact });
  } catch (error) {
    console.error('Create succession contact error:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/legacy-vault/contacts/:id
router.put('/contacts/:id', protect, async (req, res) => {
  try {
    const contact = await SuccessionContact.findOne({ _id: req.params.id, userId: req.user._id });
    if (!contact) return res.status(404).json({ error: 'Contact not found' });

    const allowed = ['name', 'role', 'email', 'phone', 'organization', 'licenseNumber', 'relationship', 'accessLevel', 'responsibilities', 'isPrimary', 'hasAgreed', 'agreedDate', 'notes'];
    for (const field of allowed) {
      if (req.body[field] !== undefined) contact[field] = req.body[field];
    }

    await contact.save();
    res.json({ contact });
  } catch (error) {
    console.error('Update succession contact error:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/legacy-vault/contacts/:id
router.delete('/contacts/:id', protect, async (req, res) => {
  try {
    const contact = await SuccessionContact.findOne({ _id: req.params.id, userId: req.user._id });
    if (!contact) return res.status(404).json({ error: 'Contact not found' });

    contact.isActive = false;
    await contact.save();
    res.json({ message: 'Contact removed' });
  } catch (error) {
    console.error('Delete succession contact error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ════════════════════════════════════════════════
//  SUCCESSION PLAN
// ════════════════════════════════════════════════

// GET /api/legacy-vault/plan
router.get('/plan', protect, async (req, res) => {
  try {
    let plan = await SuccessionPlan.findOne({ userId: req.user._id });
    if (!plan) {
      plan = await SuccessionPlan.create({ userId: req.user._id });
    }
    res.json({ plan });
  } catch (error) {
    console.error('Succession plan error:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/legacy-vault/plan
router.put('/plan', protect, async (req, res) => {
  try {
    const allowed = [
      'status', 'practiceName', 'practiceType', 'estimatedActiveClients',
      'ehrSystem', 'clientNotificationPlan', 'recordsTransferPlan',
      'financialInstructions', 'additionalInstructions', 'reviewReminderMonths'
    ];

    const updates = {};
    for (const field of allowed) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }
    updates.lastReviewedAt = new Date();

    const plan = await SuccessionPlan.findOneAndUpdate(
      { userId: req.user._id },
      { $set: updates },
      { new: true, upsert: true }
    );

    res.json({ plan });
  } catch (error) {
    console.error('Update succession plan error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ════════════════════════════════════════════════
//  CHECK-IN (DEAD MAN'S SWITCH)
// ════════════════════════════════════════════════

// GET /api/legacy-vault/checkin/status
router.get('/checkin/status', protect, async (req, res) => {
  try {
    let checkin = await VaultCheckIn.findOne({ userId: req.user._id });
    if (!checkin) {
      checkin = await VaultCheckIn.create({ userId: req.user._id });
    }

    const now = new Date();
    const isOverdue = checkin.isActive && checkin.nextCheckInDue && now > checkin.nextCheckInDue;
    const daysUntilDue = checkin.nextCheckInDue
      ? Math.ceil((new Date(checkin.nextCheckInDue) - now) / (1000 * 60 * 60 * 24))
      : null;

    res.json({
      isActive: checkin.isActive,
      lastCheckIn: checkin.lastCheckIn,
      nextCheckInDue: checkin.nextCheckInDue,
      checkInIntervalDays: checkin.checkInIntervalDays,
      missedCheckIns: checkin.missedCheckIns,
      isOverdue,
      daysUntilDue
    });
  } catch (error) {
    console.error('Check-in status error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/legacy-vault/checkin — record a check-in
router.post('/checkin', protect, async (req, res) => {
  try {
    let checkin = await VaultCheckIn.findOne({ userId: req.user._id });
    if (!checkin) {
      checkin = new VaultCheckIn({ userId: req.user._id });
    }

    // Update settings if provided
    if (req.body.isActive !== undefined) checkin.isActive = req.body.isActive;
    if (req.body.checkInIntervalDays) checkin.checkInIntervalDays = req.body.checkInIntervalDays;

    // Record the check-in
    checkin.lastCheckIn = new Date();
    checkin.missedCheckIns = 0;
    await checkin.save();

    res.json({
      message: 'Check-in recorded',
      lastCheckIn: checkin.lastCheckIn,
      nextCheckInDue: checkin.nextCheckInDue,
      isActive: checkin.isActive
    });
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ════════════════════════════════════════════════
//  RECOVERY TOKEN
// ════════════════════════════════════════════════

// POST /api/legacy-vault/recovery/create — store encrypted recovery token
router.post('/recovery/create', protect, async (req, res) => {
  try {
    const { encryptedToken, tokenHash } = req.body;
    if (!encryptedToken || !tokenHash) {
      return res.status(400).json({ error: 'encryptedToken and tokenHash are required' });
    }

    // Deactivate any existing tokens
    await RecoveryToken.updateMany(
      { userId: req.user._id, isActive: true },
      { $set: { isActive: false } }
    );

    const token = await RecoveryToken.create({
      userId: req.user._id,
      encryptedToken,
      tokenHash
    });

    res.status(201).json({
      message: 'Recovery token created',
      tokenId: token._id,
      createdAt: token.createdAt
    });
  } catch (error) {
    console.error('Recovery token create error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/legacy-vault/recovery/token — retrieve active recovery token
router.get('/recovery/token', protect, async (req, res) => {
  try {
    const token = await RecoveryToken.findOne({ userId: req.user._id, isActive: true })
      .sort({ createdAt: -1 });

    if (!token) {
      return res.json({ hasToken: false });
    }

    res.json({
      hasToken: true,
      encryptedToken: token.encryptedToken,
      tokenHash: token.tokenHash,
      createdAt: token.createdAt
    });
  } catch (error) {
    console.error('Recovery token fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/legacy-vault/summary — dashboard summary
router.get('/summary', protect, async (req, res) => {
  try {
    const [docCount, contacts, plan, checkin] = await Promise.all([
      VaultDocument.countDocuments({ userId: req.user._id }),
      SuccessionContact.countDocuments({ userId: req.user._id, isActive: true }),
      SuccessionPlan.findOne({ userId: req.user._id }),
      VaultCheckIn.findOne({ userId: req.user._id })
    ]);

    // Count expiring docs
    const now = new Date();
    const thirtyDaysOut = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const expiringCount = await VaultDocument.countDocuments({
      userId: req.user._id,
      expirationDate: { $lte: thirtyDaysOut, $gt: now }
    });

    res.json({
      documents: docCount,
      contacts,
      expiringDocuments: expiringCount,
      planStatus: plan?.status || 'not-started',
      lastReviewed: plan?.lastReviewedAt || null,
      checkIn: checkin ? {
        isActive: checkin.isActive,
        lastCheckIn: checkin.lastCheckIn,
        nextCheckInDue: checkin.nextCheckInDue
      } : null
    });
  } catch (error) {
    console.error('Legacy vault summary error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
