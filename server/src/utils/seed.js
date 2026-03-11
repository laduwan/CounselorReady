/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CredentialTemplate from '../models/CredentialTemplate.js';
import Course from '../models/Course.js';

dotenv.config();

// State License Templates
const stateLicenses = [
  // Georgia
  {
    type: 'state_license',
    code: 'LPC',
    name: 'Licensed Professional Counselor',
    state: 'GA',
    issuingBody: 'Georgia Composite Board of Professional Counselors',
    renewalCycle: 24,
    totalCEUsRequired: 35,
    requirements: [
      { category: 'Ethics', hoursRequired: 5 },
      { category: 'Supervision', hoursRequired: 3, notes: 'Only if providing supervision' },
      { category: 'General', hoursRequired: 27 }
    ],
    renewalFee: 100,
    renewalUrl: 'https://sos.ga.gov/PLB',
    firstRenewalNotes: 'First renewal requires 45 CEUs total'
  },
  {
    type: 'state_license',
    code: 'LAPC',
    name: 'Licensed Associate Professional Counselor',
    state: 'GA',
    issuingBody: 'Georgia Composite Board of Professional Counselors',
    renewalCycle: 24,
    totalCEUsRequired: 35,
    requirements: [
      { category: 'Ethics', hoursRequired: 5 },
      { category: 'General', hoursRequired: 30 }
    ],
    renewalFee: 75,
    renewalUrl: 'https://sos.ga.gov/PLB'
  },
  // California
  {
    type: 'state_license',
    code: 'LPCC',
    name: 'Licensed Professional Clinical Counselor',
    state: 'CA',
    issuingBody: 'Board of Behavioral Sciences',
    renewalCycle: 24,
    totalCEUsRequired: 36,
    requirements: [
      { category: 'Ethics', hoursRequired: 6, notes: 'Law and Ethics' },
      { category: 'Suicide Prevention', hoursRequired: 6 },
      { category: 'General', hoursRequired: 24 }
    ],
    renewalFee: 200,
    renewalUrl: 'https://www.bbs.ca.gov/'
  },
  // Texas
  {
    type: 'state_license',
    code: 'LPC',
    name: 'Licensed Professional Counselor',
    state: 'TX',
    issuingBody: 'Texas Behavioral Health Executive Council',
    renewalCycle: 24,
    totalCEUsRequired: 24,
    requirements: [
      { category: 'Ethics', hoursRequired: 3 },
      { category: 'General', hoursRequired: 21 }
    ],
    renewalFee: 107,
    renewalUrl: 'https://www.bhec.texas.gov/'
  },
  // Florida
  {
    type: 'state_license',
    code: 'LMHC',
    name: 'Licensed Mental Health Counselor',
    state: 'FL',
    issuingBody: 'Florida Board of Clinical Social Work, Marriage and Family Therapy, and Mental Health Counseling',
    renewalCycle: 24,
    totalCEUsRequired: 30,
    requirements: [
      { category: 'Ethics', hoursRequired: 3 },
      { category: 'Domestic Violence', hoursRequired: 2 },
      { category: 'Medical Errors', hoursRequired: 2 },
      { category: 'Human Trafficking', hoursRequired: 1, notes: 'One-time requirement' },
      { category: 'General', hoursRequired: 22 }
    ],
    renewalFee: 105,
    renewalUrl: 'https://floridasmentalhealthprofessions.gov/'
  },
  // New York
  {
    type: 'state_license',
    code: 'LMHC',
    name: 'Licensed Mental Health Counselor',
    state: 'NY',
    issuingBody: 'New York State Education Department',
    renewalCycle: 36,
    totalCEUsRequired: 36,
    requirements: [
      { category: 'General', hoursRequired: 36 }
    ],
    renewalFee: 100,
    renewalUrl: 'http://www.op.nysed.gov/prof/mhp/'
  },
  // Ohio
  {
    type: 'state_license',
    code: 'LPCC',
    name: 'Licensed Professional Clinical Counselor',
    state: 'OH',
    issuingBody: 'Ohio Counselor, Social Worker, and Marriage and Family Therapist Board',
    renewalCycle: 24,
    totalCEUsRequired: 30,
    requirements: [
      { category: 'Ethics', hoursRequired: 3 },
      { category: 'Supervision', hoursRequired: 3, notes: 'If supervising' },
      { category: 'General', hoursRequired: 24 }
    ],
    renewalFee: 90,
    renewalUrl: 'https://cswmft.ohio.gov/'
  },
  // North Carolina
  {
    type: 'state_license',
    code: 'LCMHC',
    name: 'Licensed Clinical Mental Health Counselor',
    state: 'NC',
    issuingBody: 'North Carolina Board of Licensed Clinical Mental Health Counselors',
    renewalCycle: 24,
    totalCEUsRequired: 40,
    requirements: [
      { category: 'Ethics', hoursRequired: 3 },
      { category: 'General', hoursRequired: 37 }
    ],
    renewalFee: 100,
    renewalUrl: 'https://www.ncblcmhc.org/'
  },
  // Virginia
  {
    type: 'state_license',
    code: 'LPC',
    name: 'Licensed Professional Counselor',
    state: 'VA',
    issuingBody: 'Virginia Board of Counseling',
    renewalCycle: 24,
    totalCEUsRequired: 20,
    requirements: [
      { category: 'Ethics', hoursRequired: 2 },
      { category: 'General', hoursRequired: 18 }
    ],
    renewalFee: 130,
    renewalUrl: 'https://www.dhp.virginia.gov/counseling/'
  },
  // Pennsylvania
  {
    type: 'state_license',
    code: 'LPC',
    name: 'Licensed Professional Counselor',
    state: 'PA',
    issuingBody: 'Pennsylvania State Board of Social Workers, Marriage and Family Therapists and Professional Counselors',
    renewalCycle: 24,
    totalCEUsRequired: 30,
    requirements: [
      { category: 'Ethics', hoursRequired: 3 },
      { category: 'General', hoursRequired: 27 }
    ],
    renewalFee: 100,
    renewalUrl: 'https://www.dos.pa.gov/'
  }
];

// National Certifications
const nationalCerts = [
  {
    type: 'national_cert',
    code: 'NCC',
    name: 'National Certified Counselor',
    issuingBody: 'NBCC',
    renewalCycle: 60,
    totalCEUsRequired: 100,
    requirements: [
      { category: 'General', hoursRequired: 100 }
    ],
    renewalFee: 150,
    renewalUrl: 'https://www.nbcc.org/'
  },
  {
    type: 'national_cert',
    code: 'ACS',
    name: 'Approved Clinical Supervisor',
    issuingBody: 'NBCC',
    renewalCycle: 60,
    totalCEUsRequired: 75,
    requirements: [
      { category: 'Supervision', hoursRequired: 25 },
      { category: 'General', hoursRequired: 50 }
    ],
    renewalFee: 100,
    renewalUrl: 'https://www.nbcc.org/'
  },
  {
    type: 'national_cert',
    code: 'CCMHC',
    name: 'Certified Clinical Mental Health Counselor',
    issuingBody: 'NBCC',
    renewalCycle: 60,
    totalCEUsRequired: 100,
    requirements: [
      { category: 'Clinical', hoursRequired: 50 },
      { category: 'General', hoursRequired: 50 }
    ],
    renewalFee: 150,
    renewalUrl: 'https://www.nbcc.org/'
  },
  {
    type: 'national_cert',
    code: 'MAC',
    name: 'Master Addictions Counselor',
    issuingBody: 'NBCC',
    renewalCycle: 60,
    totalCEUsRequired: 100,
    requirements: [
      { category: 'Addictions', hoursRequired: 40 },
      { category: 'General', hoursRequired: 60 }
    ],
    renewalFee: 150,
    renewalUrl: 'https://www.nbcc.org/'
  }
];

// Specialty Certifications
const specialtyCerts = [
  {
    type: 'specialty_cert',
    code: 'BC-TMH',
    name: 'Board Certified-TeleMental Health Provider',
    issuingBody: 'CCE',
    renewalCycle: 24,
    totalCEUsRequired: 20,
    requirements: [
      { category: 'Telehealth', hoursRequired: 20 }
    ],
    renewalFee: 75,
    renewalUrl: 'https://www.cce-global.org/'
  },
  {
    type: 'specialty_cert',
    code: 'CCTP',
    name: 'Certified Clinical Trauma Professional',
    issuingBody: 'IATP',
    renewalCycle: 24,
    totalCEUsRequired: 20,
    requirements: [
      { category: 'Trauma', hoursRequired: 20 }
    ],
    renewalFee: 75,
    renewalUrl: 'https://www.evergreencertifications.com/'
  },
  {
    type: 'specialty_cert',
    code: 'RPT',
    name: 'Registered Play Therapist',
    issuingBody: 'APT',
    renewalCycle: 36,
    totalCEUsRequired: 18,
    requirements: [
      { category: 'Play Therapy', hoursRequired: 18 }
    ],
    renewalFee: 100,
    renewalUrl: 'https://www.a4pt.org/'
  }
];

// Sample courses matching user's 5 lessons
const sampleCourses = [
  {
    slug: 'ncmhce-study-starter',
    title: 'NCMHCE Study Starter',
    subtitle: 'Free course to get you started',
    description: 'Get oriented to the NCMHCE exam and learn proven study strategies.',
    accessType: 'free',
    ceuEligible: false,
    status: 'published',
    instructor: 'CounselorReady',
    modules: [{
      title: 'Getting Started', order: 1,
      lessons: [
        { title: 'Welcome', type: 'text', content: '<p>Welcome to NCMHCE prep!</p>', order: 1, isFree: true, duration: 5 },
        { title: 'Exam Overview', type: 'text', content: '<p>Understanding the NCMHCE format...</p>', order: 2, isFree: true, duration: 15 },
        { title: 'Study Strategies', type: 'text', content: '<p>Effective study approaches...</p>', order: 3, isFree: true, duration: 10 }
      ]
    }]
  },
  {
    slug: 'telehealth-best-practices',
    title: 'Telehealth Best Practices',
    subtitle: 'Navigate virtual sessions with confidence',
    description: 'Everything you need to provide effective telehealth services.',
    accessType: 'subscription',
    ceuEligible: true,
    ceuHours: 2,
    ceuCategories: [{ category: 'Telehealth', hours: 2 }],
    status: 'published',
    instructor: 'CounselorReady',
    modules: [{
      title: 'Telehealth Fundamentals', order: 1,
      lessons: [
        { title: 'Telehealth Overview', type: 'text', content: '<p>The rise of telehealth...</p>', order: 1, isFree: true, duration: 10 }
      ]
    }]
  },
  {
    slug: 'ethics-essentials',
    title: 'Ethics Essentials',
    subtitle: 'Ethical foundations for counseling practice',
    description: 'Master the ethical principles that guide professional counseling.',
    accessType: 'subscription',
    ceuEligible: true,
    ceuHours: 3,
    ceuCategories: [{ category: 'Ethics', hours: 3 }],
    status: 'published',
    instructor: 'CounselorReady',
    modules: [{
      title: 'Foundations of Ethics', order: 1,
      lessons: [
        { title: 'Why Ethics Matter', type: 'text', content: '<p>Ethics form the foundation...</p>', order: 1, isFree: true, duration: 10 }
      ]
    }]
  },
  {
    slug: 'cultural-competency',
    title: 'Cultural Competency in Counseling',
    subtitle: 'Move from awareness to action',
    description: 'Develop practical skills for working with diverse populations.',
    accessType: 'subscription',
    ceuEligible: true,
    ceuHours: 2,
    ceuCategories: [{ category: 'Cultural Competency', hours: 2 }],
    status: 'published',
    instructor: 'CounselorReady',
    modules: [{
      title: 'Cultural Foundations', order: 1,
      lessons: [
        { title: 'Beyond Awareness', type: 'text', content: '<p>From awareness to action...</p>', order: 1, isFree: true, duration: 15 }
      ]
    }]
  },
  {
    slug: 'clinical-documentation',
    title: 'Clinical Documentation That Protects You',
    subtitle: 'Write notes that work',
    description: 'Master the art of clinical documentation.',
    accessType: 'subscription',
    ceuEligible: true,
    ceuHours: 2,
    ceuCategories: [{ category: 'General', hours: 2 }],
    status: 'published',
    instructor: 'CounselorReady',
    modules: [{
      title: 'Documentation Basics', order: 1,
      lessons: [
        { title: 'Purpose of Documentation', type: 'text', content: '<p>Why documentation matters...</p>', order: 1, isFree: true, duration: 10 }
      ]
    }]
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    await CredentialTemplate.deleteMany({});
    await Course.deleteMany({});
    console.log('Cleared existing data');
    
    const allTemplates = [...stateLicenses, ...nationalCerts, ...specialtyCerts];
    await CredentialTemplate.insertMany(allTemplates);
    console.log('Inserted ' + allTemplates.length + ' credential templates');
    
    await Course.insertMany(sampleCourses);
    console.log('Inserted ' + sampleCourses.length + ' courses');
    
    console.log('Seed complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
