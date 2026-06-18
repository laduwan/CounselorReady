/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */

/**
 * complianceRoutes — Practice Compliance: credentials, policies/attestations,
 * supervision, audit binder, and the member self-view.
 *
 * NEW additive route file, mounted at /api (so paths are /api/orgs/:orgId/...
 * and /api/me/compliance, matching the spec API surface). Layers requireOrgRole
 * on top of the existing `protect` auth middleware. Touches no locked files.
 */
import express from 'express';
import multer from 'multer';
import Organization from '../models/Organization.js';
import OrgCredential from '../models/OrgCredential.js';
import PolicyDoc from '../models/PolicyDoc.js';
import Attestation from '../models/Attestation.js';
import OrgSupervisionLog from '../models/OrgSupervisionLog.js';
import Assignment from '../models/Assignment.js';
import { protect } from '../middleware/auth.js';
import { requireAddon } from '../middleware/partnerFeatureGate.js';
import { requireOrgRole, ORG_ADMIN_ROLES } from '../middleware/requireOrgRole.js';
import { uploadFile } from '../utils/r2Storage.js';
import { generateAuditBinder } from '../services/auditBinderService.js';

const router = express.Router();

// NOTE: this router is mounted at the bare '/api' prefix (so paths read
// /api/orgs/:orgId/... and /api/me/compliance per the spec). We therefore apply
// `protect` PER-ROUTE rather than router.use(protect) — a router-level guard at
// '/api' would run on unmatched /api/* paths and turn the existing 404 contract
// into a 401. Per-route auth lets unmatched paths fall straight through to the
// existing 404 handler unchanged.
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

function seatForUser(org, userId) {
  return org.seats.find(s => s.userId && s.userId.equals(userId) && s.status === 'active');
}

// ════════════════════════ CREDENTIAL VAULT ════════════════════════
router.get('/orgs/:orgId/credentials', protect, requireAddon('complianceTracking'), requireOrgRole(), async (req, res) => {
  try {
    const filter = { orgId: req.org._id };
    if (!ORG_ADMIN_ROLES.includes(req.orgRole) && req.user.role !== 'admin') {
      filter.userId = req.user._id; // members see only their own
    } else if (req.query.seatId) {
      filter.seatId = req.query.seatId;
    }
    const creds = await OrgCredential.find(filter).sort({ expiresAt: 1 }).lean();
    res.json(creds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/orgs/:orgId/credentials', protect, requireAddon('complianceTracking'), requireOrgRole(...ORG_ADMIN_ROLES), upload.single('file'), async (req, res) => {
  try {
    const b = req.body || {};
    let fileUrl = b.fileUrl;
    let fileKey, fileName;
    if (req.file) {
      const key = `org-credentials/${req.org._id}/${Date.now()}-${req.file.originalname.replace(/[^a-z0-9.\-_]/gi, '_')}`;
      const result = await uploadFile(req.file.buffer, key, req.file.mimetype, { orgId: String(req.org._id) });
      fileUrl = result.url; fileKey = result.key; fileName = req.file.originalname;
    }
    // Resolve seat → userId when a seatId is provided.
    let userId = b.userId || null;
    if (b.seatId && !userId) {
      const seat = req.org.seats.id(b.seatId);
      userId = seat?.userId || null;
    }
    const cred = await OrgCredential.create({
      orgId: req.org._id,
      seatId: b.seatId || null,
      userId,
      type: b.type || 'other',
      label: b.label,
      state: b.state || null,
      identifier: b.identifier,
      level: b.level || null,
      issuingBody: b.issuingBody || null,
      subjectArea: b.subjectArea || null,
      hours: b.hours || 0,
      manualVersion: b.manualVersion || null,
      issuedAt: b.issuedAt ? new Date(b.issuedAt) : undefined,
      expiresAt: b.expiresAt ? new Date(b.expiresAt) : null,
      fileUrl, fileKey, fileName
    });
    res.status(201).json(cred);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/orgs/:orgId/credentials/:credId', protect, requireAddon('complianceTracking'), requireOrgRole(...ORG_ADMIN_ROLES), async (req, res) => {
  try {
    const cred = await OrgCredential.findOne({ _id: req.params.credId, orgId: req.org._id });
    if (!cred) return res.status(404).json({ error: 'Credential not found' });
    const allowed = ['type', 'label', 'state', 'identifier', 'level', 'issuingBody', 'subjectArea', 'hours', 'manualVersion'];
    for (const k of allowed) if (req.body[k] !== undefined) cred[k] = req.body[k];
    if (req.body.issuedAt) cred.issuedAt = new Date(req.body.issuedAt);
    if (req.body.expiresAt !== undefined) cred.expiresAt = req.body.expiresAt ? new Date(req.body.expiresAt) : null;
    if (req.body.verify === true) { cred.verifiedBy = req.user._id; cred.verifiedAt = new Date(); }
    if (req.body.expiresAt !== undefined) cred.alertsSent = []; // reset alert ledger on renewal
    await cred.save();
    res.json(cred);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/orgs/:orgId/credentials/:credId', protect, requireAddon('complianceTracking'), requireOrgRole(...ORG_ADMIN_ROLES), async (req, res) => {
  try {
    const out = await OrgCredential.deleteOne({ _id: req.params.credId, orgId: req.org._id });
    if (!out.deletedCount) return res.status(404).json({ error: 'Credential not found' });
    res.json({ message: 'Credential deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ════════════════════════ POLICY DOCS + ATTESTATION ════════════════════════
router.get('/orgs/:orgId/policies', protect, requireAddon('complianceTracking'), requireOrgRole(), async (req, res) => {
  try {
    const policies = await PolicyDoc.find({ orgId: req.org._id, active: true }).sort({ createdAt: -1 }).lean();
    // Annotate whether the requesting member has attested to the current version.
    const mine = await Attestation.find({ orgId: req.org._id, userId: req.user._id }).lean();
    const signed = new Set(mine.map(a => `${a.policyDocId}:${a.policyVersion}`));
    res.json(policies.map(p => ({ ...p, attestedByMe: signed.has(`${p._id}:${p.version}`) })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/orgs/:orgId/policies', protect, requireAddon('complianceTracking'), requireOrgRole(...ORG_ADMIN_ROLES), upload.single('file'), async (req, res) => {
  try {
    const b = req.body || {};
    if (!b.title) return res.status(400).json({ error: 'Policy title is required' });
    let fileUrl = b.fileUrl, fileKey, fileName;
    if (req.file) {
      const key = `org-policies/${req.org._id}/${Date.now()}-${req.file.originalname.replace(/[^a-z0-9.\-_]/gi, '_')}`;
      const result = await uploadFile(req.file.buffer, key, req.file.mimetype, { orgId: String(req.org._id) });
      fileUrl = result.url; fileKey = result.key; fileName = req.file.originalname;
    }
    // New version of an existing policy (by title) bumps version, re-opening attestation.
    const prev = await PolicyDoc.findOne({ orgId: req.org._id, title: b.title }).sort({ version: -1 }).lean();
    const version = b.newVersion && prev ? (prev.version + 1) : (b.version || 1);
    const policy = await PolicyDoc.create({
      orgId: req.org._id,
      title: b.title,
      version,
      fileUrl, fileKey, fileName,
      requiresSignature: b.requiresSignature !== false,
      appliesToRoles: b.appliesToRoles || []
    });
    res.status(201).json(policy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/orgs/:orgId/policies/:policyId/attest', protect, requireAddon('complianceTracking'), requireOrgRole(), async (req, res) => {
  try {
    const policy = await PolicyDoc.findOne({ _id: req.params.policyId, orgId: req.org._id });
    if (!policy) return res.status(404).json({ error: 'Policy not found' });
    const seat = seatForUser(req.org, req.user._id);
    const attestation = await Attestation.findOneAndUpdate(
      { userId: req.user._id, policyDocId: policy._id, policyVersion: policy.version },
      {
        $setOnInsert: {
          orgId: req.org._id,
          seatId: seat?._id || null,
          userId: req.user._id,
          policyDocId: policy._id,
          policyVersion: policy.version,
          signedAt: new Date(),
          signatureName: req.body.signatureName || req.user.email,
          ip: req.ip,
          userAgent: req.headers['user-agent'] || ''
        }
      },
      { upsert: true, new: true }
    );
    res.status(201).json(attestation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ════════════════════════ SUPERVISION (dual sign-off) ════════════════════════
router.get('/orgs/:orgId/supervision', protect, requireAddon('complianceTracking'), requireOrgRole(), async (req, res) => {
  try {
    const filter = { orgId: req.org._id };
    if (!ORG_ADMIN_ROLES.includes(req.orgRole) && req.user.role !== 'admin') {
      filter.$or = [{ superviseeUserId: req.user._id }, { supervisorUserId: req.user._id }];
    } else if (req.query.superviseeUserId) {
      filter.superviseeUserId = req.query.superviseeUserId;
    }
    const logs = await OrgSupervisionLog.find(filter).sort({ date: -1 }).lean();
    const totalHours = logs.reduce((s, l) => s + (l.hours || 0), 0);
    res.json({ logs, totals: { sessions: logs.length, hours: totalHours } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/orgs/:orgId/supervision', protect, requireAddon('complianceTracking'), requireOrgRole(), async (req, res) => {
  try {
    const b = req.body || {};
    const superviseeSeat = b.superviseeSeatId ? req.org.seats.id(b.superviseeSeatId) : seatForUser(req.org, req.user._id);
    const supervisorSeat = b.supervisorSeatId ? req.org.seats.id(b.supervisorSeatId) : null;
    const log = await OrgSupervisionLog.create({
      orgId: req.org._id,
      superviseeSeatId: superviseeSeat?._id || null,
      superviseeUserId: superviseeSeat?.userId || null,
      supervisorSeatId: supervisorSeat?._id || null,
      supervisorUserId: supervisorSeat?.userId || null,
      supervisorName: b.supervisorName || '',
      date: b.date ? new Date(b.date) : new Date(),
      hours: b.hours || 0,
      format: b.format || 'individual',
      modality: b.modality || 'in_person',
      formType: b.formType === 'CADC-T' ? 'CADC-T' : 'standard',
      notes: b.notes || ''
    });
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/orgs/:orgId/supervision/:id/sign', protect, requireAddon('complianceTracking'), requireOrgRole(), async (req, res) => {
  try {
    const log = await OrgSupervisionLog.findOne({ _id: req.params.id, orgId: req.org._id });
    if (!log) return res.status(404).json({ error: 'Supervision log not found' });
    const isSupervisee = log.superviseeUserId && log.superviseeUserId.equals(req.user._id);
    const isSupervisor = log.supervisorUserId && log.supervisorUserId.equals(req.user._id);
    if (req.body.as === 'supervisee' && isSupervisee) log.superviseeSignedAt = new Date();
    else if (req.body.as === 'supervisor' && (isSupervisor || ORG_ADMIN_ROLES.includes(req.orgRole))) log.supervisorSignedAt = new Date();
    else return res.status(403).json({ error: 'Not authorized to sign in that role' });
    await log.save();
    res.json(log);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ════════════════════════ AUDIT BINDER (ZIP) ════════════════════════
router.get('/orgs/:orgId/audit-binder', protect, requireAddon('complianceTracking'), requireOrgRole(...ORG_ADMIN_ROLES), async (req, res) => {
  try {
    const { buffer, filename } = await generateAuditBinder(req.org);
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (error) {
    console.error('Audit binder error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ════════════════════════ MEMBER SELF-VIEW (across orgs) ════════════════════════
router.get('/me/compliance', protect, requireAddon('complianceTracking'), async (req, res) => {
  try {
    const orgs = await Organization.find({ 'seats.userId': req.user._id, 'seats.status': 'active' })
      .select('name settings seats').lean();
    const orgIds = orgs.map(o => o._id);
    const [assignments, credentials] = await Promise.all([
      Assignment.find({ userId: req.user._id, orgId: { $in: orgIds } }).sort({ dueDate: 1 }).lean(),
      OrgCredential.find({ userId: req.user._id, orgId: { $in: orgIds } }).lean()
    ]);
    const byOrg = orgs.map(o => {
      const aRows = assignments.filter(a => String(a.orgId) === String(o._id));
      const annualHours = aRows.filter(a => a.status === 'completed').reduce((s, a) => s + (a.creditedHours || a.hours || 0), 0);
      return {
        orgId: o._id,
        name: o.name,
        segment: o.settings?.segment,
        assignments: aRows,
        credentials: credentials.filter(c => String(c.orgId) === String(o._id)),
        annualHours,
        overdue: aRows.filter(a => a.status === 'overdue').length,
        recoupmentRisk: aRows.some(a => a.recoupmentRisk)
      };
    });
    res.json({ orgs: byOrg });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
