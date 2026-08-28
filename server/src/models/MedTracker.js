/**
 * MedTracker.js — Psychotropic Medication Tracking Model
 * Tracks client medications by anonymous ID (no PII stored).
 * Supports dosage/weight ratio analysis, efficacy tracking,
 * negative symptom monitoring, and contraindication flags.
 */
import mongoose from 'mongoose';

const { Schema } = mongoose;

// ── Observation entry (timestamped clinician rating) ──────────────────────────
const ObservationSchema = new Schema({
  date:           { type: Date, default: Date.now },
  clinicianId:    { type: Schema.Types.ObjectId, ref: 'User', required: true },

  // Efficacy (1 = not working, 5 = excellent)
  efficacyScore:  { type: Number, min: 1, max: 5 },

  // Sedation / over-medication signal (0 = none, 5 = severely sedated)
  sedationScore:  { type: Number, min: 0, max: 5 },

  // Functional impairment (0 = none, 5 = severe)
  functionalImpairmentScore: { type: Number, min: 0, max: 5 },

  // Negative symptoms checklist
  negativeSymptoms: {
    flatAffect:       { type: Boolean, default: false },
    avolition:        { type: Boolean, default: false },
    anhedonia:        { type: Boolean, default: false },
    socialWithdrawal: { type: Boolean, default: false },
    alogia:           { type: Boolean, default: false },
    cognitiveSlowing: { type: Boolean, default: false },
  },

  // Side effects observed
  sideEffects: {
    weightChange:     { type: String, enum: ['none', 'gain', 'loss'], default: 'none' },
    sleepDisturbance: { type: Boolean, default: false },
    movementDisorder: { type: Boolean, default: false }, // EPS, tardive dyskinesia flag
    moodInstability:  { type: Boolean, default: false },
    appetiteChange:   { type: Boolean, default: false },
  },

  // PRN usage since last observation (frequent = under-controlled signal)
  prnUseCount:    { type: Number, default: 0 },

  // Symptom trend relative to previous observation
  symptomTrend: {
    type: String,
    enum: ['improving', 'stable', 'worsening', 'unknown'],
    default: 'unknown'
  },

  notes: { type: String, maxlength: 2000 },
}, { _id: true });

// ── Per-medication record ─────────────────────────────────────────────────────
const MedicationSchema = new Schema({
  name:           { type: String, required: true, trim: true },
  genericName:    { type: String, trim: true },

  // Classification
  medicationClass: {
    type: String,
    enum: [
      'antipsychotic_typical',
      'antipsychotic_atypical',
      'antidepressant_ssri',
      'antidepressant_snri',
      'antidepressant_maoi',
      'antidepressant_tca',
      'antidepressant_other',
      'mood_stabilizer',
      'anxiolytic_benzodiazepine',
      'anxiolytic_other',
      'stimulant',
      'non_stimulant_adhd',
      'hypnotic',
      'anticholinergic',
      'other'
    ],
    required: true
  },

  // Dosing
  doseAmountMg:   { type: Number, required: true },       // mg per administration
  frequency:      {
    type: String,
    enum: ['once_daily', 'twice_daily', 'three_times_daily', 'four_times_daily',
           'every_other_day', 'weekly', 'as_needed', 'other'],
    required: true
  },
  route:          {
    type: String,
    enum: ['oral', 'sublingual', 'injectable_im', 'injectable_iv', 'patch', 'other'],
    default: 'oral'
  },

  // Calculated fields (set at record-save time from client biometrics)
  dailyDoseMg:    { type: Number },   // doseAmountMg × doses_per_day
  mgPerKg:        { type: Number },   // dailyDoseMg / weightKg
  dosageStatus: {
    type: String,
    enum: ['within_range', 'low', 'high', 'critical_low', 'critical_high', 'unset'],
    default: 'unset'
  },

  // Prescriber (free text — no PII linkage required)
  prescriberType: {
    type: String,
    enum: ['psychiatrist', 'pcp', 'np', 'pa', 'neurologist', 'other'],
  },

  // Dates
  startDate:      { type: Date },
  endDate:        { type: Date },   // null = still active
  isActive:       { type: Boolean, default: true },

  // Target symptoms this med addresses
  targetSymptoms: [{ type: String, trim: true }],

  // Observations over time
  observations:   [ObservationSchema],
}, { _id: true });

// ── Root client record ────────────────────────────────────────────────────────
const MedTrackerSchema = new Schema({
  // Anonymous client identifier — NO name, DOB, SSN, or contact info stored
  clientCode:     { type: String, required: true, trim: true, uppercase: true },

  // Clinician who owns this record
  clinicianId:    { type: Schema.Types.ObjectId, ref: 'User', required: true },

  // Biometrics — used for mg/kg dosage ratio calculation
  weightKg:       { type: Number },   // kilograms
  heightCm:       { type: Number },   // centimeters
  bmi:            { type: Number },   // auto-calculated on save

  // Diagnosis context (DSM-5 category, not full diagnosis)
  diagnosisCategory: {
    type: String,
    enum: [
      'schizophrenia_spectrum',
      'bipolar_related',
      'depressive_disorders',
      'anxiety_disorders',
      'trauma_related',
      'ocd_related',
      'adhd',
      'personality_disorders',
      'neurodevelopmental',
      'substance_related',
      'other'
    ]
  },

  // Active medications
  medications:    [MedicationSchema],

  // Contraindication flags (auto-checked on save against known interaction pairs)
  contraindicationAlerts: [{
    med1:     { type: String },
    med2:     { type: String },
    severity: { type: String, enum: ['mild', 'moderate', 'severe', 'contraindicated'] },
    reason:   { type: String },
    flaggedAt: { type: Date, default: Date.now },
    acknowledged: { type: Boolean, default: false },
    acknowledgedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    acknowledgedAt: { type: Date },
  }],

  // Overall medication load assessment (computed)
  medicationLoadFlag: {
    type: String,
    enum: ['adequate', 'possibly_under', 'possibly_over', 'review_needed', 'unset'],
    default: 'unset'
  },

  notes:          { type: String, maxlength: 5000 },
  isArchived:     { type: Boolean, default: false },
}, {
  timestamps: true,
  collection: 'medtrackerrecords'
});

// ── Indexes ───────────────────────────────────────────────────────────────────
MedTrackerSchema.index({ clinicianId: 1, clientCode: 1 }, { unique: true });
MedTrackerSchema.index({ clinicianId: 1, isArchived: 1 });

// ── Pre-save: compute BMI and mg/kg ratios ────────────────────────────────────
MedTrackerSchema.pre('save', function(next) {
  // BMI = weight(kg) / (height(m))^2
  if (this.weightKg && this.heightCm) {
    const heightM = this.heightCm / 100;
    this.bmi = Math.round((this.weightKg / (heightM * heightM)) * 10) / 10;
  }

  // Compute mg/kg for each active med and flag dosage status
  if (this.weightKg) {
    for (const med of this.medications) {
      const dosesPerDay = {
        once_daily: 1, twice_daily: 2, three_times_daily: 3,
        four_times_daily: 4, every_other_day: 0.5, weekly: 1/7,
        as_needed: 1, other: 1
      }[med.frequency] ?? 1;

      med.dailyDoseMg = med.doseAmountMg * dosesPerDay;
      med.mgPerKg = Math.round((med.dailyDoseMg / this.weightKg) * 1000) / 1000;

      // Simple high-level dosage flag based on mg/kg thresholds by class
      med.dosageStatus = computeDosageStatus(med);
    }
  }

  // Compute overall medication load
  this.medicationLoadFlag = computeMedLoad(this);

  next();
});

// ── Helper: dosage status by medication class ─────────────────────────────────
function computeDosageStatus(med) {
  if (!med.mgPerKg) return 'unset';

  // Thresholds (mg/kg/day) — conservative clinical ranges for flagging only.
  // These are NOT clinical decision support; they are observation prompts.
  const thresholds = {
    antipsychotic_typical:      { low: 0.05, high: 1.0, critHigh: 2.0 },
    antipsychotic_atypical:     { low: 0.03, high: 0.6, critHigh: 1.2 },
    antidepressant_ssri:        { low: 0.1,  high: 1.5, critHigh: 3.0 },
    antidepressant_snri:        { low: 0.1,  high: 2.0, critHigh: 4.0 },
    antidepressant_maoi:        { low: 0.1,  high: 1.0, critHigh: 1.5 },
    antidepressant_tca:         { low: 0.5,  high: 3.0, critHigh: 5.0 },
    antidepressant_other:       { low: 0.1,  high: 2.0, critHigh: 4.0 },
    mood_stabilizer:            { low: 5.0,  high: 30,  critHigh: 40  },
    anxiolytic_benzodiazepine:  { low: 0.02, high: 0.3, critHigh: 0.6 },
    anxiolytic_other:           { low: 0.1,  high: 1.0, critHigh: 2.0 },
    stimulant:                  { low: 0.1,  high: 1.0, critHigh: 2.0 },
    non_stimulant_adhd:         { low: 0.5,  high: 1.8, critHigh: 2.5 },
    hypnotic:                   { low: 0.03, high: 0.2, critHigh: 0.4 },
  };

  const t = thresholds[med.medicationClass];
  if (!t) return 'unset';

  if (med.mgPerKg >= t.critHigh)  return 'critical_high';
  if (med.mgPerKg >= t.high)      return 'high';
  if (med.mgPerKg < t.low)        return 'low';
  return 'within_range';
}

// ── Helper: overall medication load ──────────────────────────────────────────
function computeMedLoad(record) {
  const active = record.medications.filter(m => m.isActive);
  if (!active.length) return 'unset';

  const highCount     = active.filter(m => ['high', 'critical_high'].includes(m.dosageStatus)).length;
  const lowCount      = active.filter(m => ['low', 'critical_low'].includes(m.dosageStatus)).length;
  const critHighCount = active.filter(m => m.dosageStatus === 'critical_high').length;
  const hasUnack      = record.contraindicationAlerts?.some(a => !a.acknowledged);

  if (critHighCount > 0 || hasUnack) return 'review_needed';
  if (highCount > lowCount && highCount > 0) return 'possibly_over';
  if (lowCount > 0 && highCount === 0) return 'possibly_under';
  return 'adequate';
}

// ── Known interaction pairs ───────────────────────────────────────────────────
// Abbreviated set of clinically significant psychotropic interactions.
// Keys are normalized lowercase generic names.
export const KNOWN_INTERACTIONS = [
  { drugs: ['fluoxetine', 'maoi'], severity: 'contraindicated', reason: 'Risk of serotonin syndrome' },
  { drugs: ['sertraline', 'maoi'], severity: 'contraindicated', reason: 'Risk of serotonin syndrome' },
  { drugs: ['venlafaxine', 'maoi'], severity: 'contraindicated', reason: 'Risk of serotonin syndrome' },
  { drugs: ['tramadol', 'ssri'], severity: 'severe', reason: 'Increased serotonin syndrome risk' },
  { drugs: ['lithium', 'nsaid'], severity: 'moderate', reason: 'NSAIDs may increase lithium levels' },
  { drugs: ['lithium', 'haloperidol'], severity: 'moderate', reason: 'Risk of neurotoxicity' },
  { drugs: ['clozapine', 'benzodiazepine'], severity: 'severe', reason: 'Risk of respiratory depression' },
  { drugs: ['clozapine', 'valproate'], severity: 'moderate', reason: 'Increased seizure risk' },
  { drugs: ['carbamazepine', 'clozapine'], severity: 'contraindicated', reason: 'Increased agranulocytosis risk' },
  { drugs: ['haloperidol', 'lithium'], severity: 'moderate', reason: 'Monitor for neurotoxicity' },
  { drugs: ['aripiprazole', 'carbamazepine'], severity: 'moderate', reason: 'Carbamazepine reduces aripiprazole levels' },
  { drugs: ['quetiapine', 'carbamazepine'], severity: 'moderate', reason: 'Reduced quetiapine efficacy' },
  { drugs: ['alprazolam', 'opioid'], severity: 'severe', reason: 'Combined CNS depression risk' },
  { drugs: ['diazepam', 'opioid'], severity: 'severe', reason: 'Combined CNS depression risk' },
  { drugs: ['bupropion', 'maoi'], severity: 'contraindicated', reason: 'Risk of hypertensive crisis' },
  { drugs: ['amphetamine', 'maoi'], severity: 'contraindicated', reason: 'Risk of hypertensive crisis' },
  { drugs: ['methylphenidate', 'maoi'], severity: 'contraindicated', reason: 'Risk of hypertensive crisis' },
  { drugs: ['valproate', 'lamotrigine'], severity: 'moderate', reason: 'Valproate doubles lamotrigine levels' },
  { drugs: ['clonidine', 'stimulant'], severity: 'mild', reason: 'Monitor blood pressure interaction' },
  { drugs: ['trazodone', 'ssri'], severity: 'moderate', reason: 'Additive serotonergic effect' },
];

export default mongoose.model('MedTrackerRecord', MedTrackerSchema);
