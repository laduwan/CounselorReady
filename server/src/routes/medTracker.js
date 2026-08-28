/**
 * medTracker.js — Psychotropic Medication Tracker API
 * All clients are referenced by anonymous clientCode only — no PII stored.
 */
import express from 'express';
import MedTrackerRecord, { KNOWN_INTERACTIONS } from '../models/MedTracker.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Checks a list of medication names/genericNames against KNOWN_INTERACTIONS.
 * Returns array of triggered alerts (deduplicated).
 */
function checkInteractions(medications) {
  const alerts = [];
  const names = medications
    .filter(m => m.isActive !== false)
    .flatMap(m => [m.name, m.genericName].filter(Boolean).map(n => n.toLowerCase().trim()));

  for (const interaction of KNOWN_INTERACTIONS) {
    const [drugA, drugB] = interaction.drugs;
    const aMatch = names.some(n => n.includes(drugA));
    const bMatch = names.some(n => n.includes(drugB));
    if (aMatch && bMatch) {
      const alreadyAdded = alerts.some(
        a => a.med1 === drugA && a.med2 === drugB
      );
      if (!alreadyAdded) {
        alerts.push({
          med1: drugA,
          med2: drugB,
          severity: interaction.severity,
          reason: interaction.reason,
        });
      }
    }
  }

  return alerts;
}

// ── GET /api/med-tracker — list all records for authenticated clinician ────────
router.get('/', async (req, res) => {
  try {
    const records = await MedTrackerRecord.find({
      clinicianId: req.user._id,
      isArchived: false,
    })
      .select('-medications.observations') // omit observation history from list view
      .sort({ updatedAt: -1 });
    res.json({ success: true, data: records });
  } catch (err) {
    console.error('[MedTracker] GET /', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── GET /api/med-tracker/:id — single full record ─────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const record = await MedTrackerRecord.findOne({
      _id: req.params.id,
      clinicianId: req.user._id,
    });
    if (!record) return res.status(404).json({ success: false, error: 'Record not found' });
    res.json({ success: true, data: record });
  } catch (err) {
    console.error('[MedTracker] GET /:id', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── POST /api/med-tracker — create new client record ─────────────────────────
router.post('/', async (req, res) => {
  try {
    const { clientCode, weightKg, heightCm, diagnosisCategory, notes } = req.body;

    if (!clientCode) {
      return res.status(400).json({ success: false, error: 'clientCode is required' });
    }

    const existing = await MedTrackerRecord.findOne({
      clinicianId: req.user._id,
      clientCode: clientCode.toUpperCase().trim(),
    });
    if (existing) {
      return res.status(409).json({ success: false, error: 'Client code already exists for this clinician', id: existing._id });
    }

    const record = new MedTrackerRecord({
      clientCode,
      clinicianId: req.user._id,
      weightKg,
      heightCm,
      diagnosisCategory,
      notes,
    });
    await record.save();
    res.status(201).json({ success: true, data: record });
  } catch (err) {
    console.error('[MedTracker] POST /', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── PATCH /api/med-tracker/:id — update biometrics or notes ──────────────────
router.patch('/:id', async (req, res) => {
  try {
    const record = await MedTrackerRecord.findOne({
      _id: req.params.id,
      clinicianId: req.user._id,
    });
    if (!record) return res.status(404).json({ success: false, error: 'Record not found' });

    const allowed = ['weightKg', 'heightCm', 'diagnosisCategory', 'notes', 'isArchived'];
    for (const field of allowed) {
      if (req.body[field] !== undefined) record[field] = req.body[field];
    }
    await record.save();
    res.json({ success: true, data: record });
  } catch (err) {
    console.error('[MedTracker] PATCH /:id', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── POST /api/med-tracker/:id/medications — add a medication ─────────────────
router.post('/:id/medications', async (req, res) => {
  try {
    const record = await MedTrackerRecord.findOne({
      _id: req.params.id,
      clinicianId: req.user._id,
    });
    if (!record) return res.status(404).json({ success: false, error: 'Record not found' });

    const med = req.body;
    if (!med.name || !med.medicationClass || !med.doseAmountMg || !med.frequency) {
      return res.status(400).json({ success: false, error: 'name, medicationClass, doseAmountMg, and frequency are required' });
    }

    record.medications.push(med);

    // Re-check interactions with the new medication included
    const newAlerts = checkInteractions(record.medications);
    // Merge new alerts (avoid duplicates by med1+med2 pair)
    for (const alert of newAlerts) {
      const alreadyExists = record.contraindicationAlerts.some(
        a => a.med1 === alert.med1 && a.med2 === alert.med2
      );
      if (!alreadyExists) record.contraindicationAlerts.push(alert);
    }

    await record.save();
    res.status(201).json({ success: true, data: record });
  } catch (err) {
    console.error('[MedTracker] POST /:id/medications', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── PATCH /api/med-tracker/:id/medications/:medId — update a medication ──────
router.patch('/:id/medications/:medId', async (req, res) => {
  try {
    const record = await MedTrackerRecord.findOne({
      _id: req.params.id,
      clinicianId: req.user._id,
    });
    if (!record) return res.status(404).json({ success: false, error: 'Record not found' });

    const med = record.medications.id(req.params.medId);
    if (!med) return res.status(404).json({ success: false, error: 'Medication not found' });

    const updatable = [
      'name', 'genericName', 'medicationClass', 'doseAmountMg', 'frequency',
      'route', 'prescriberType', 'startDate', 'endDate', 'isActive', 'targetSymptoms'
    ];
    for (const field of updatable) {
      if (req.body[field] !== undefined) med[field] = req.body[field];
    }

    // Re-check interactions after update
    const newAlerts = checkInteractions(record.medications);
    record.contraindicationAlerts = [];
    for (const alert of newAlerts) {
      record.contraindicationAlerts.push(alert);
    }

    await record.save();
    res.json({ success: true, data: record });
  } catch (err) {
    console.error('[MedTracker] PATCH /:id/medications/:medId', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── POST /api/med-tracker/:id/medications/:medId/observations — add observation
router.post('/:id/medications/:medId/observations', async (req, res) => {
  try {
    const record = await MedTrackerRecord.findOne({
      _id: req.params.id,
      clinicianId: req.user._id,
    });
    if (!record) return res.status(404).json({ success: false, error: 'Record not found' });

    const med = record.medications.id(req.params.medId);
    if (!med) return res.status(404).json({ success: false, error: 'Medication not found' });

    med.observations.push({
      ...req.body,
      clinicianId: req.user._id,
    });

    await record.save();
    res.status(201).json({ success: true, data: record });
  } catch (err) {
    console.error('[MedTracker] POST observations', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── PATCH /api/med-tracker/:id/alerts/:alertIndex/acknowledge ────────────────
router.patch('/:id/alerts/:alertIndex/acknowledge', async (req, res) => {
  try {
    const record = await MedTrackerRecord.findOne({
      _id: req.params.id,
      clinicianId: req.user._id,
    });
    if (!record) return res.status(404).json({ success: false, error: 'Record not found' });

    const idx = parseInt(req.params.alertIndex, 10);
    if (isNaN(idx) || idx < 0 || idx >= record.contraindicationAlerts.length) {
      return res.status(400).json({ success: false, error: 'Invalid alert index' });
    }

    record.contraindicationAlerts[idx].acknowledged = true;
    record.contraindicationAlerts[idx].acknowledgedBy = req.user._id;
    record.contraindicationAlerts[idx].acknowledgedAt = new Date();

    await record.save();
    res.json({ success: true, data: record });
  } catch (err) {
    console.error('[MedTracker] PATCH acknowledge', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── GET /api/med-tracker/:id/summary — computed load summary ─────────────────
router.get('/:id/summary', async (req, res) => {
  try {
    const record = await MedTrackerRecord.findOne({
      _id: req.params.id,
      clinicianId: req.user._id,
    });
    if (!record) return res.status(404).json({ success: false, error: 'Record not found' });

    const activeMeds = record.medications.filter(m => m.isActive);
    const unacknowledgedAlerts = record.contraindicationAlerts.filter(a => !a.acknowledged);

    const latestObservations = activeMeds.map(med => {
      const obs = med.observations.sort((a, b) => new Date(b.date) - new Date(a.date));
      return {
        medId: med._id,
        medName: med.name,
        dosageStatus: med.dosageStatus,
        mgPerKg: med.mgPerKg,
        dailyDoseMg: med.dailyDoseMg,
        latestEfficacy: obs[0]?.efficacyScore ?? null,
        latestSedation: obs[0]?.sedationScore ?? null,
        latestTrend: obs[0]?.symptomTrend ?? 'unknown',
        negativeSymptomCount: obs[0] ? Object.values(obs[0].negativeSymptoms).filter(Boolean).length : 0,
        observationCount: obs.length,
      };
    });

    res.json({
      success: true,
      data: {
        clientCode: record.clientCode,
        bmi: record.bmi,
        weightKg: record.weightKg,
        heightCm: record.heightCm,
        medicationLoadFlag: record.medicationLoadFlag,
        unacknowledgedAlertCount: unacknowledgedAlerts.length,
        alerts: unacknowledgedAlerts,
        medications: latestObservations,
      }
    });
  } catch (err) {
    console.error('[MedTracker] GET summary', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
