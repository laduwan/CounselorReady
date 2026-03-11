/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CredentialTemplate from '../models/CredentialTemplate.js';

dotenv.config();

// ===========================================
// STATE LICENSE REQUIREMENTS
// ===========================================

const stateLicenses = [
  // Georgia
  {
    type: 'state_license',
    name: 'LPC',
    fullName: 'Licensed Professional Counselor',
    state: 'GA',
    issuingBody: 'Georgia Composite Board of Professional Counselors, Social Workers, and Marriage & Family Therapists',
    renewalCycle: 24,
    totalCEUsRequired: 35,
    requirements: [
      { category: 'Ethics', hoursRequired: 5, description: 'Professional ethics' },
      { category: 'Supervision', hoursRequired: 3, description: 'Required only if providing supervision', notes: 'Optional if not supervising' },
      { category: 'General', hoursRequired: 27, description: 'Any relevant clinical topic' }
    ],
    renewalFee: 100,
    renewalUrl: 'https://sos.ga.gov/PLB',
    notes: 'Renewal is based on birthdate',
    firstTimeNotes: 'First renewal requires 45 total CEUs (10 additional hours)',
    lastVerified: new Date('2024-12-01'),
    isActive: true
  },
  {
    type: 'state_license',
    name: 'LAPC',
    fullName: 'Licensed Associate Professional Counselor',
    state: 'GA',
    issuingBody: 'Georgia Composite Board',
    renewalCycle: 24,
    totalCEUsRequired: 35,
    requirements: [
      { category: 'Ethics', hoursRequired: 5 },
      { category: 'General', hoursRequired: 30 }
    ],
    renewalFee: 75,
    renewalUrl: 'https://sos.ga.gov/PLB',
    lastVerified: new Date('2024-12-01'),
    isActive: true
  },
  
  // California
  {
    type: 'state_license',
    name: 'LPCC',
    fullName: 'Licensed Professional Clinical Counselor',
    state: 'CA',
    issuingBody: 'California Board of Behavioral Sciences',
    renewalCycle: 24,
    totalCEUsRequired: 36,
    requirements: [
      { category: 'Law and Ethics', hoursRequired: 6, description: 'CA law and professional ethics' },
      { category: 'Suicide Prevention', hoursRequired: 6, description: 'Suicide risk assessment and intervention' },
      { category: 'General', hoursRequired: 24 }
    ],
    renewalFee: 200,
    renewalUrl: 'https://www.bbs.ca.gov/',
    notes: 'Must include human trafficking and aging/long-term care training',
    lastVerified: new Date('2024-12-01'),
    isActive: true
  },
  
  // Texas
  {
    type: 'state_license',
    name: 'LPC',
    fullName: 'Licensed Professional Counselor',
    state: 'TX',
    issuingBody: 'Texas State Board of Examiners of Professional Counselors',
    renewalCycle: 24,
    totalCEUsRequired: 24,
    requirements: [
      { category: 'Ethics', hoursRequired: 3, description: 'Professional ethics' },
      { category: 'General', hoursRequired: 21 }
    ],
    renewalFee: 107,
    renewalUrl: 'https://www.dshs.texas.gov/counselor/',
    lastVerified: new Date('2024-12-01'),
    isActive: true
  },
  {
    type: 'state_license',
    name: 'LPC-Associate',
    fullName: 'Licensed Professional Counselor Associate',
    state: 'TX',
    issuingBody: 'Texas State Board of Examiners of Professional Counselors',
    renewalCycle: 24,
    totalCEUsRequired: 24,
    requirements: [
      { category: 'Ethics', hoursRequired: 3 },
      { category: 'General', hoursRequired: 21 }
    ],
    renewalFee: 80,
    renewalUrl: 'https://www.dshs.texas.gov/counselor/',
    lastVerified: new Date('2024-12-01'),
    isActive: true
  },
  
  // Florida
  {
    type: 'state_license',
    name: 'LMHC',
    fullName: 'Licensed Mental Health Counselor',
    state: 'FL',
    issuingBody: 'Florida Board of Clinical Social Work, Marriage & Family Therapy, and Mental Health Counseling',
    renewalCycle: 24,
    totalCEUsRequired: 30,
    requirements: [
      { category: 'Ethics', hoursRequired: 3, description: 'Professional ethics' },
      { category: 'Domestic Violence', hoursRequired: 2 },
      { category: 'Prevention of Medical Errors', hoursRequired: 2 },
      { category: 'Human Trafficking', hoursRequired: 1, notes: 'One-time requirement' },
      { category: 'General', hoursRequired: 22 }
    ],
    renewalFee: 105,
    renewalUrl: 'https://floridasmentalhealthprofessions.gov/',
    lastVerified: new Date('2024-12-01'),
    isActive: true
  },
  
  // New York
  {
    type: 'state_license',
    name: 'LMHC',
    fullName: 'Licensed Mental Health Counselor',
    state: 'NY',
    issuingBody: 'New York State Education Department',
    renewalCycle: 36,
    totalCEUsRequired: 36,
    requirements: [
      { category: 'General', hoursRequired: 36, notes: 'No specific category requirements' }
    ],
    renewalFee: 100,
    renewalUrl: 'http://www.op.nysed.gov/prof/mhp/',
    notes: 'Must include 3 hours in identification and reporting of child abuse (one-time)',
    lastVerified: new Date('2024-12-01'),
    isActive: true
  },
  
  // Ohio
  {
    type: 'state_license',
    name: 'LPCC',
    fullName: 'Licensed Professional Clinical Counselor',
    state: 'OH',
    issuingBody: 'Ohio Counselor, Social Worker, and Marriage and Family Therapist Board',
    renewalCycle: 24,
    totalCEUsRequired: 30,
    requirements: [
      { category: 'Ethics', hoursRequired: 3 },
      { category: 'Supervision', hoursRequired: 3, notes: 'If supervising' },
      { category: 'General', hoursRequired: 24 }
    ],
    renewalFee: 85,
    renewalUrl: 'https://cswmft.ohio.gov/',
    lastVerified: new Date('2024-12-01'),
    isActive: true
  },
  
  // North Carolina
  {
    type: 'state_license',
    name: 'LCMHC',
    fullName: 'Licensed Clinical Mental Health Counselor',
    state: 'NC',
    issuingBody: 'North Carolina Board of Licensed Clinical Mental Health Counselors',
    renewalCycle: 24,
    totalCEUsRequired: 40,
    requirements: [
      { category: 'Ethics', hoursRequired: 3 },
      { category: 'General', hoursRequired: 37 }
    ],
    renewalFee: 150,
    renewalUrl: 'https://www.ncblcmhc.org/',
    lastVerified: new Date('2024-12-01'),
    isActive: true
  },
  
  // Virginia
  {
    type: 'state_license',
    name: 'LPC',
    fullName: 'Licensed Professional Counselor',
    state: 'VA',
    issuingBody: 'Virginia Board of Counseling',
    renewalCycle: 24,
    totalCEUsRequired: 20,
    requirements: [
      { category: 'Ethics', hoursRequired: 2 },
      { category: 'General', hoursRequired: 18 }
    ],
    renewalFee: 130,
    renewalUrl: 'https://www.dhp.virginia.gov/counseling/',
    lastVerified: new Date('2024-12-01'),
    isActive: true
  },
  
  // Illinois
  {
    type: 'state_license',
    name: 'LCPC',
    fullName: 'Licensed Clinical Professional Counselor',
    state: 'IL',
    issuingBody: 'Illinois Department of Financial and Professional Regulation',
    renewalCycle: 24,
    totalCEUsRequired: 30,
    requirements: [
      { category: 'Ethics', hoursRequired: 3 },
      { category: 'General', hoursRequired: 27 }
    ],
    renewalFee: 75,
    renewalUrl: 'https://www.idfpr.com/',
    lastVerified: new Date('2024-12-01'),
    isActive: true
  }
];

// ===========================================
// NATIONAL CERTIFICATIONS
// ===========================================

const nationalCerts = [
  {
    type: 'national_cert',
    name: 'NCC',
    fullName: 'National Certified Counselor',
    issuingBody: 'National Board for Certified Counselors (NBCC)',
    renewalCycle: 60,
    totalCEUsRequired: 100,
    requirements: [
      { category: 'General', hoursRequired: 100, description: 'No specific category requirements' }
    ],
    renewalFee: 150,
    renewalUrl: 'https://www.nbcc.org/',
    notes: 'Must hold NCC before applying for other NBCC certifications',
    lastVerified: new Date('2024-12-01'),
    isActive: true
  },
  {
    type: 'national_cert',
    name: 'ACS',
    fullName: 'Approved Clinical Supervisor',
    issuingBody: 'National Board for Certified Counselors (NBCC)',
    renewalCycle: 60,
    totalCEUsRequired: 75,
    requirements: [
      { category: 'Supervision', hoursRequired: 25, description: 'Clinical supervision topics' },
      { category: 'General', hoursRequired: 50 }
    ],
    renewalFee: 100,
    renewalUrl: 'https://www.nbcc.org/',
    notes: 'Requires active NCC certification',
    lastVerified: new Date('2024-12-01'),
    isActive: true
  },
  {
    type: 'national_cert',
    name: 'CCMHC',
    fullName: 'Certified Clinical Mental Health Counselor',
    issuingBody: 'National Board for Certified Counselors (NBCC)',
    renewalCycle: 60,
    totalCEUsRequired: 100,
    requirements: [
      { category: 'Clinical', hoursRequired: 50, description: 'Clinical mental health topics' },
      { category: 'General', hoursRequired: 50 }
    ],
    renewalFee: 150,
    renewalUrl: 'https://www.nbcc.org/',
    notes: 'Requires active NCC certification',
    lastVerified: new Date('2024-12-01'),
    isActive: true
  },
  {
    type: 'national_cert',
    name: 'MAC',
    fullName: 'Master Addictions Counselor',
    issuingBody: 'National Board for Certified Counselors (NBCC)',
    renewalCycle: 60,
    totalCEUsRequired: 100,
    requirements: [
      { category: 'Addictions', hoursRequired: 40, description: 'Addiction counseling topics' },
      { category: 'General', hoursRequired: 60 }
    ],
    renewalFee: 150,
    renewalUrl: 'https://www.nbcc.org/',
    notes: 'Requires active NCC certification',
    lastVerified: new Date('2024-12-01'),
    isActive: true
  }
];

// ===========================================
// SPECIALTY CERTIFICATIONS
// ===========================================

const specialtyCerts = [
  {
    type: 'specialty_cert',
    name: 'BC-TMH',
    fullName: 'Board Certified-TeleMental Health Provider',
    issuingBody: 'Center for Credentialing & Education (CCE)',
    renewalCycle: 24,
    totalCEUsRequired: 20,
    requirements: [
      { category: 'Telehealth', hoursRequired: 20, description: 'Telemental health topics' }
    ],
    renewalFee: 75,
    renewalUrl: 'https://www.cce-global.org/',
    lastVerified: new Date('2024-12-01'),
    isActive: true
  },
  {
    type: 'specialty_cert',
    name: 'CCTP',
    fullName: 'Certified Clinical Trauma Professional',
    issuingBody: 'International Association of Trauma Professionals (IATP)',
    renewalCycle: 24,
    totalCEUsRequired: 20,
    requirements: [
      { category: 'Trauma', hoursRequired: 20, description: 'Trauma-focused topics' }
    ],
    renewalFee: 50,
    renewalUrl: 'https://www.traumaprofessional.org/',
    lastVerified: new Date('2024-12-01'),
    isActive: true
  },
  {
    type: 'specialty_cert',
    name: 'RPT',
    fullName: 'Registered Play Therapist',
    issuingBody: 'Association for Play Therapy (APT)',
    renewalCycle: 36,
    totalCEUsRequired: 18,
    requirements: [
      { category: 'Play Therapy', hoursRequired: 18, description: 'Play therapy topics' }
    ],
    renewalFee: 100,
    renewalUrl: 'https://www.a4pt.org/',
    lastVerified: new Date('2024-12-01'),
    isActive: true
  }
];

// ===========================================
// SEED FUNCTION
// ===========================================

const seedCredentialTemplates = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing templates
    await CredentialTemplate.deleteMany({});
    console.log('Cleared existing templates');
    
    // Insert all templates
    const allTemplates = [...stateLicenses, ...nationalCerts, ...specialtyCerts];
    await CredentialTemplate.insertMany(allTemplates);
    
    console.log(`Seeded ${allTemplates.length} credential templates:`);
    console.log(`  - ${stateLicenses.length} state licenses`);
    console.log(`  - ${nationalCerts.length} national certifications`);
    console.log(`  - ${specialtyCerts.length} specialty certifications`);
    
    // Show states covered
    const states = [...new Set(stateLicenses.map(l => l.state))].sort();
    console.log(`States covered: ${states.join(', ')}`);
    
    await mongoose.connection.close();
    console.log('Done!');
    
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

// Run if called directly
if (process.argv[1].includes('seed.js')) {
  seedCredentialTemplates();
}

export default seedCredentialTemplates;
