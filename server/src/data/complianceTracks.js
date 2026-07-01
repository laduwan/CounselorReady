/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */

/**
 * Global TrainingTrack seed templates (orgId: null).
 *
 * DATA ONLY — consumed by the idempotent seed script. The `{STATE}` placeholder
 * in a courseCode resolves at assignment time from the org's primary state
 * (organization.settings.statesOfOperation[0]); see complianceService.resolveCourseCode.
 */

// ── Layer 1: Private-practice templates (Catalog spec §4) ──
export const PRIVATE_PRACTICE_TRACKS = [
  {
    name: 'Annual Compliance Core — Clinical',
    segment: 'private_practice',
    appliesToRoles: ['clinician', 'associate', 'supervisor'],
    items: [
      { courseCode: 'CR-PC101',        required: true, dueDays: 30, recurrence: 'annual' },
      { courseCode: 'CR-PC102-{STATE}', required: true, dueDays: 30, recurrence: 'annual' },
      { courseCode: 'CR-PC103',        required: true, dueDays: 45, recurrence: 'annual' },
      { courseCode: 'CR-PC104',        required: true, dueDays: 45, recurrence: 'annual' },
      { courseCode: 'CR-PC105',        required: true, dueDays: 60, recurrence: 'annual' },
      { courseCode: 'CR-PC106',        required: true, dueDays: 60, recurrence: 'annual' }
    ]
  },
  {
    name: 'Annual Compliance Core — Admin/Staff',
    segment: 'private_practice',
    appliesToRoles: ['admin', 'staff'],
    items: [
      { courseCode: 'CR-PC101A',       required: true, dueDays: 30, recurrence: 'annual' },
      { courseCode: 'CR-PC102-{STATE}', required: true, dueDays: 30, recurrence: 'annual' },
      { courseCode: 'CR-PC105',        required: true, dueDays: 60, recurrence: 'annual' },
      { courseCode: 'CR-PC106',        required: true, dueDays: 60, recurrence: 'annual' }
    ]
  },
  {
    name: 'New Clinician Onboarding',
    segment: 'private_practice',
    appliesToRoles: ['clinician', 'associate'],
    items: [
      { courseCode: 'CR-PC101',        required: true, dueDays: 14, recurrence: 'annual' },
      { courseCode: 'CR-PC102-{STATE}', required: true, dueDays: 14, recurrence: 'annual' },
      { courseCode: 'CR-PC103',        required: true, dueDays: 30, recurrence: 'annual' },
      { courseCode: 'CR-PC104',        required: true, dueDays: 30, recurrence: 'annual' },
      { courseCode: 'CR-PC201',        required: true, dueDays: 30, recurrence: 'annual' },
      { courseCode: 'CR-PC204',        required: true, dueDays: 60, recurrence: 'biennial' },
      { courseCode: 'CR-PC205',        required: true, dueDays: 60, recurrence: 'biennial' }
    ]
  },
  {
    name: 'Front Desk Onboarding',
    segment: 'private_practice',
    appliesToRoles: ['admin', 'staff'],
    items: [
      { courseCode: 'CR-PC302',        required: true, dueDays: 14, recurrence: 'none' },
      { courseCode: 'CR-PC101A',       required: true, dueDays: 14, recurrence: 'annual' },
      { courseCode: 'CR-PC205',        required: true, dueDays: 30, recurrence: 'biennial' }
    ]
  },
  {
    name: 'Supervisor Track',
    segment: 'private_practice',
    appliesToRoles: ['supervisor'],
    items: [
      { courseCode: 'CR-PC301',        required: true, dueDays: 60, recurrence: 'none' },
      { courseCode: 'CR-PC203',        required: true, dueDays: 60, recurrence: 'annual' }
    ]
  }
];

// ── Layer 2: GA DBHDD/DCH agency seed tracks (GA doc §5) ──
const FY27Q1 = 'FY27-Q1';
export const GA_AGENCY_TRACKS = [
  {
    name: 'GA Agency — Orientation (pre-contact)',
    segment: 'dbhdd_agency',
    manualVersion: FY27Q1,
    appliesToRoles: ['all'],
    items: [
      // dueDays: 0 — blocks direct-contact clearance until complete.
      { courseCode: 'CR-PC409',  required: true, dueDays: 0, recurrence: 'annual', deliveryMode: 'provider_based' },
      { courseCode: 'CR-PC101A', required: true, dueDays: 0, recurrence: 'annual', deliveryMode: 'provider_based' }
      // + org policy attestation handled via the PolicyDoc / Attestation feature.
    ]
  },
  {
    name: 'GA Agency — First 60 Days',
    segment: 'dbhdd_agency',
    manualVersion: FY27Q1,
    appliesToRoles: ['all'],
    items: [
      { courseCode: 'CR-PC401', required: true, dueDays: 60, recurrence: 'none',   deliveryMode: 'provider_based', hours: 1 },
      { courseCode: 'CR-PC402', required: true, dueDays: 60, recurrence: 'annual', deliveryMode: 'provider_based', hours: 1 },
      { courseCode: 'CR-PC403', required: true, dueDays: 60, recurrence: 'annual', deliveryMode: 'provider_based', hours: 1 },
      { courseCode: 'CR-PC404', required: true, dueDays: 60, recurrence: 'annual', deliveryMode: 'provider_based', hours: 1 },
      { courseCode: 'CR-PC405', required: true, dueDays: 60, recurrence: 'annual', deliveryMode: 'provider_based', hours: 1 },
      { courseCode: 'CR-PC406', required: true, dueDays: 60, recurrence: 'none',   deliveryMode: 'provider_based', hours: 1 },
      { courseCode: 'CR-PC407', required: true, dueDays: 60, recurrence: 'annual', deliveryMode: 'provider_based', hours: 1 },
      { courseCode: 'CR-PC408', required: true, dueDays: 60, recurrence: 'none',   deliveryMode: 'provider_based', hours: 1 },
      // CPR / First Aid credential due — tracked, never delivered.
      { courseCode: 'EXT-CPR-FA', label: 'CPR/First Aid (AHA/HSI/Red Cross)', required: true, dueDays: 60, recurrence: 'none', deliveryMode: 'external', external: true }
    ]
  },
  {
    name: 'GA Agency — Annual 16-Hour',
    segment: 'dbhdd_agency',
    manualVersion: FY27Q1,
    annualHoursTarget: 16,
    appliesToRoles: ['all'],
    items: [
      // The (*) annual topics; dashboard shows an hour counter x/16 per member.
      { courseCode: 'CR-PC402', required: true, dueDays: 365, recurrence: 'annual', deliveryMode: 'provider_based', hours: 1 },
      { courseCode: 'CR-PC403', required: true, dueDays: 365, recurrence: 'annual', deliveryMode: 'provider_based', hours: 1 },
      { courseCode: 'CR-PC404', required: true, dueDays: 365, recurrence: 'annual', deliveryMode: 'provider_based', hours: 1 },
      { courseCode: 'CR-PC405', required: true, dueDays: 365, recurrence: 'annual', deliveryMode: 'provider_based', hours: 1 },
      { courseCode: 'CR-PC407', required: true, dueDays: 365, recurrence: 'annual', deliveryMode: 'provider_based', hours: 1 }
      // + makeup hours to reach 16 — surfaced by the annual hour counter.
    ]
  },
  {
    name: 'GA Paraprofessional STR (90-day)',
    segment: 'dbhdd_agency',
    manualVersion: FY27Q1,
    strHoursTarget: 46,
    appliesToRoles: ['associate', 'staff'],
    items: [
      // Provider-based bundle CR delivers (17 provider-based hours envelope).
      { courseCode: 'CR-PC410', required: true, dueDays: 90, recurrence: 'none', deliveryMode: 'provider_based', subjectArea: 'STR Provider-Based', hours: 10 },
      // External Relias online subject-area tracking (29 hrs) — tracked, never delivered.
      { courseCode: 'EXT-RELIAS-STR', label: 'DBHDD Relias STR online (29 hrs)', required: true, dueDays: 90, recurrence: 'none', deliveryMode: 'relias_online', external: true, subjectArea: 'STR Online (Relias)', hours: 29 },
      // CPR/First Aid credential due — external.
      { courseCode: 'EXT-CPR-FA', label: 'CPR/First Aid (AHA/HSI/Red Cross)', required: true, dueDays: 90, recurrence: 'none', deliveryMode: 'external', external: true, subjectArea: 'First Aid and CPR', hours: 6 }
    ]
  },
  {
    name: 'GA Residential/24-hr add-on',
    segment: 'dbhdd_agency',
    manualVersion: FY27Q1,
    appliesToRoles: ['all'],
    items: [
      // BLS-level CPR enforcement for all direct care + clinical staff (§2.D).
      { courseCode: 'EXT-CPR-BLS', label: 'BLS-level CPR + First Aid (written + hands-on)', required: true, dueDays: 60, recurrence: 'none', deliveryMode: 'external', external: true }
    ]
  }
];

export const GLOBAL_TRACKS = [...PRIVATE_PRACTICE_TRACKS, ...GA_AGENCY_TRACKS];
export default GLOBAL_TRACKS;
