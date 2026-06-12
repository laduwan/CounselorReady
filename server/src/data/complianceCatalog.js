/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */

/**
 * Practice Compliance catalog metadata — CR-PC### series.
 *
 * DATA ONLY. This is the source-of-truth definition consumed by the idempotent
 * seed script (scripts/seedComplianceCatalog.js). It does NOT author course
 * CONTENT and it does NOT write to the database on import.
 *
 * `ceEligible` stays FALSE here for every entry — it only flips true in
 * production after the owner's CE sign-off (Catalog spec §3). Course CONTENT
 * (the InteractiveCourse documents) is authored separately and linked via
 * ComplianceCourseMeta.courseRef.
 *
 * `complianceHours` for GA agency provider-based modules (PC401–PC409) are
 * placeholders pending authoring; PC410 reflects the manual's stated bundle
 * (Documentation 2h + Explanation of Services 1h + Service Coordination 1h +
 * Safety 6h). Adjust at authoring time.
 */

// ── Layer 1: Private-practice board-CE compliance (Catalog spec §2) ──
export const PRIVATE_PRACTICE_CATALOG = [
  // Tier 1 — Annual Compliance Core
  { code: 'CR-PC101',    title: 'HIPAA Privacy & Security: Annual Clinical Refresher', ceHours: 1.5, complianceHours: 1.5, recurrence: 'annual',   roleTargets: ['clinician', 'associate', 'supervisor'], tier: 1, segment: 'private_practice' },
  { code: 'CR-PC101A',   title: 'HIPAA Essentials for Admin & Front Desk',            ceHours: 0,   complianceHours: 1.0, recurrence: 'annual',   roleTargets: ['admin', 'staff'], tier: 1, segment: 'private_practice' },
  { code: 'CR-PC102-GA', title: 'Mandated Reporter: Georgia',  ceHours: 1.0, complianceHours: 1.0, recurrence: 'annual', roleTargets: ['all'], tier: 1, segment: 'private_practice', stateVariantOf: 'CR-PC102', state: 'GA' },
  { code: 'CR-PC102-TX', title: 'Mandated Reporter: Texas',    ceHours: 1.0, complianceHours: 1.0, recurrence: 'annual', roleTargets: ['all'], tier: 1, segment: 'private_practice', stateVariantOf: 'CR-PC102', state: 'TX' },
  { code: 'CR-PC102-FL', title: 'Mandated Reporter: Florida',  ceHours: 1.0, complianceHours: 1.0, recurrence: 'annual', roleTargets: ['all'], tier: 1, segment: 'private_practice', stateVariantOf: 'CR-PC102', state: 'FL' },
  { code: 'CR-PC102-ID', title: 'Mandated Reporter: Idaho',    ceHours: 1.0, complianceHours: 1.0, recurrence: 'annual', roleTargets: ['all'], tier: 1, segment: 'private_practice', stateVariantOf: 'CR-PC102', state: 'ID' },
  { code: 'CR-PC103',    title: 'Suicide Risk Assessment & Safety Planning',          ceHours: 2.0, complianceHours: 2.0, recurrence: 'annual',   roleTargets: ['clinician', 'associate', 'supervisor'], tier: 1, segment: 'private_practice' },
  { code: 'CR-PC104',    title: 'Telehealth Annual Competency Refresher',             ceHours: 1.5, complianceHours: 1.5, recurrence: 'annual',   roleTargets: ['clinician', 'associate', 'supervisor'], tier: 1, segment: 'private_practice' },
  { code: 'CR-PC105',    title: 'Breach Response & Incident Reporting: The First 24 Hours', ceHours: 0, complianceHours: 0.75, recurrence: 'annual', roleTargets: ['all'], tier: 1, segment: 'private_practice' },
  { code: 'CR-PC106',    title: 'Cybersecurity Hygiene for Behavioral Health Practices',    ceHours: 0, complianceHours: 0.75, recurrence: 'annual', roleTargets: ['all'], tier: 1, segment: 'private_practice' },

  // Tier 2 — Clinical Risk Management
  { code: 'CR-PC201',    title: 'Documentation for Medical Necessity: Annual Refresher', ceHours: 1.5, complianceHours: 1.5, recurrence: 'annual',  roleTargets: ['clinician', 'associate', 'supervisor'], tier: 2, segment: 'private_practice' },
  { code: 'CR-PC202-GA', title: 'Duty to Warn & Duty to Protect: Georgia',  ceHours: 1.0, complianceHours: 1.0, recurrence: 'biennial', roleTargets: ['clinician', 'associate', 'supervisor'], tier: 2, segment: 'private_practice', stateVariantOf: 'CR-PC202', state: 'GA' },
  { code: 'CR-PC202-TX', title: 'Duty to Warn & Duty to Protect: Texas',    ceHours: 1.0, complianceHours: 1.0, recurrence: 'biennial', roleTargets: ['clinician', 'associate', 'supervisor'], tier: 2, segment: 'private_practice', stateVariantOf: 'CR-PC202', state: 'TX' },
  { code: 'CR-PC202-FL', title: 'Duty to Warn & Duty to Protect: Florida',  ceHours: 1.0, complianceHours: 1.0, recurrence: 'biennial', roleTargets: ['clinician', 'associate', 'supervisor'], tier: 2, segment: 'private_practice', stateVariantOf: 'CR-PC202', state: 'FL' },
  { code: 'CR-PC202-ID', title: 'Duty to Warn & Duty to Protect: Idaho',    ceHours: 1.0, complianceHours: 1.0, recurrence: 'biennial', roleTargets: ['clinician', 'associate', 'supervisor'], tier: 2, segment: 'private_practice', stateVariantOf: 'CR-PC202', state: 'ID' },
  { code: 'CR-PC203',    title: 'Boundaries, Ethics & Dual Relationships: Annual Refresher', ceHours: 2.0, complianceHours: 2.0, recurrence: 'annual',  roleTargets: ['clinician', 'associate', 'supervisor'], tier: 2, segment: 'private_practice' },
  { code: 'CR-PC204',    title: 'Minor Clients: Consent, Custody & Records',  ceHours: 1.5, complianceHours: 1.5, recurrence: 'biennial', roleTargets: ['clinician', 'associate', 'admin'], tier: 2, segment: 'private_practice' },
  { code: 'CR-PC205',    title: 'Records, Releases & Subpoenas',              ceHours: 1.0, complianceHours: 1.0, recurrence: 'biennial', roleTargets: ['all'], tier: 2, segment: 'private_practice' },
  { code: 'CR-PC206',    title: 'Crisis De-escalation & Workplace Violence Prevention', ceHours: 1.5, complianceHours: 1.5, recurrence: 'annual', roleTargets: ['all'], tier: 2, segment: 'private_practice' },

  // Tier 3 — Role-Specific
  { code: 'CR-PC301',    title: 'Supervisor Essentials: Org-Based Supervision Practice', ceHours: 3.0, complianceHours: 3.0, recurrence: 'once',   roleTargets: ['supervisor'], tier: 3, segment: 'private_practice' },
  { code: 'CR-PC302',    title: 'Front Desk Onboarding Bundle',               ceHours: 0,   complianceHours: 1.5, recurrence: 'once',   roleTargets: ['admin', 'staff'], tier: 3, segment: 'private_practice' },
  { code: 'CR-PC303',    title: '42 CFR Part 2: SUD Confidentiality',         ceHours: 1.0, complianceHours: 1.0, recurrence: 'annual', roleTargets: ['clinician', 'associate'], tier: 3, segment: 'private_practice' }
];

// ── Layer 2: GA DBHDD/DCH agency provider-based modules (GA doc §5) ──
// All compliance-only (ceEligible stays false), CR-delivered provider-based hours.
const FY27Q1 = 'FY27-Q1';
export const GA_AGENCY_CATALOG = [
  { code: 'CR-PC401', title: 'Person-Centered Values & Holistic Treatment',                          complianceHours: 1.0, recurrence: 'once',   roleTargets: ['all'], tier: 1, segment: 'dbhdd_agency', deliveryMode: 'provider_based', manualVersion: FY27Q1 },
  { code: 'CR-PC402', title: 'Human Rights & Responsibilities of Individuals Served',                complianceHours: 1.0, recurrence: 'annual', roleTargets: ['all'], tier: 1, segment: 'dbhdd_agency', deliveryMode: 'provider_based', manualVersion: FY27Q1 },
  { code: 'CR-PC403', title: 'Communication Skills for BH Staff',                                    complianceHours: 1.0, recurrence: 'annual', roleTargets: ['all'], tier: 1, segment: 'dbhdd_agency', deliveryMode: 'provider_based', manualVersion: FY27Q1 },
  { code: 'CR-PC404', title: 'Crisis De-escalation Techniques',                                      complianceHours: 1.0, recurrence: 'annual', roleTargets: ['all'], tier: 1, segment: 'dbhdd_agency', deliveryMode: 'provider_based', manualVersion: FY27Q1 },
  { code: 'CR-PC405', title: 'Fire Safety + Emergency & Disaster Procedures',                        complianceHours: 1.0, recurrence: 'annual', roleTargets: ['all'], tier: 1, segment: 'dbhdd_agency', deliveryMode: 'provider_based', manualVersion: FY27Q1 },
  { code: 'CR-PC406', title: 'Standard Precautions & Infection Control',                             complianceHours: 1.0, recurrence: 'once',   roleTargets: ['all'], tier: 1, segment: 'dbhdd_agency', deliveryMode: 'provider_based', manualVersion: FY27Q1 },
  { code: 'CR-PC407', title: 'Medications & Side Effects Awareness (non-prescriber)',               complianceHours: 1.0, recurrence: 'annual', roleTargets: ['all'], tier: 1, segment: 'dbhdd_agency', deliveryMode: 'provider_based', manualVersion: FY27Q1 },
  { code: 'CR-PC408', title: 'Recovery, Resiliency & Relapse Prevention Foundations',               complianceHours: 1.0, recurrence: 'once',   roleTargets: ['all'], tier: 1, segment: 'dbhdd_agency', deliveryMode: 'provider_based', manualVersion: FY27Q1 },
  { code: 'CR-PC409', title: 'Recognizing & Reporting Abuse, Neglect, Exploitation (GA/DBHDD reporting chain)', complianceHours: 1.0, recurrence: 'annual', roleTargets: ['all'], tier: 1, segment: 'dbhdd_agency', deliveryMode: 'provider_based', manualVersion: FY27Q1 },
  { code: 'CR-PC410', title: 'STR Provider-Based Bundle (Documentation · Explanation of Services · Service Coordination · Safety)', complianceHours: 10.0, recurrence: 'once', roleTargets: ['associate', 'staff'], tier: 1, segment: 'dbhdd_agency', deliveryMode: 'provider_based', subjectArea: 'STR Provider-Based', manualVersion: FY27Q1 }
];

// Full catalog with defaults applied. ceEligible ALWAYS false here (owner gate).
export const COMPLIANCE_CATALOG = [...PRIVATE_PRACTICE_CATALOG, ...GA_AGENCY_CATALOG].map(c => ({
  isComplianceCourse: true,
  ceEligible: false,
  ceHours: 0,
  complianceHours: 0,
  recurrence: 'annual',
  roleTargets: [],
  stateVariantOf: null,
  state: null,
  tier: 1,
  segment: 'all',
  subjectArea: null,
  deliveryMode: 'cr_delivered',
  crDelivered: true,
  manualVersion: null,
  active: true,
  ...c
}));

export default COMPLIANCE_CATALOG;
