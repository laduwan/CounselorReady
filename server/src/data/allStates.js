/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
export const stateLicenses = [
  // ALABAMA
  { type: 'state_license', code: 'LPC', name: 'Licensed Professional Counselor', state: 'AL', issuingBody: 'Alabama Board of Examiners in Counseling', renewalCycle: 24, totalCEUsRequired: 40, requirements: [{ category: 'Ethics', hoursRequired: 6 }, { category: 'General', hoursRequired: 34 }] },
  { type: 'state_license', code: 'ALC', name: 'Associate Licensed Counselor', state: 'AL', issuingBody: 'Alabama Board of Examiners in Counseling', renewalCycle: 24, totalCEUsRequired: 40, requirements: [{ category: 'Ethics', hoursRequired: 6 }, { category: 'General', hoursRequired: 34 }] },
  
  // ALASKA
  { type: 'state_license', code: 'LPC', name: 'Licensed Professional Counselor', state: 'AK', issuingBody: 'Alaska Board of Professional Counselors', renewalCycle: 24, totalCEUsRequired: 40, requirements: [{ category: 'Ethics', hoursRequired: 4 }, { category: 'General', hoursRequired: 36 }] },
  
  // ARIZONA
  { type: 'state_license', code: 'LPC', name: 'Licensed Professional Counselor', state: 'AZ', issuingBody: 'Arizona Board of Behavioral Health Examiners', renewalCycle: 24, totalCEUsRequired: 40, requirements: [{ category: 'Ethics', hoursRequired: 6 }, { category: 'General', hoursRequired: 34 }] },
  { type: 'state_license', code: 'LAC', name: 'Licensed Associate Counselor', state: 'AZ', issuingBody: 'Arizona Board of Behavioral Health Examiners', renewalCycle: 24, totalCEUsRequired: 40, requirements: [{ category: 'Ethics', hoursRequired: 6 }, { category: 'General', hoursRequired: 34 }] },
  
  // ARKANSAS
  { type: 'state_license', code: 'LPC', name: 'Licensed Professional Counselor', state: 'AR', issuingBody: 'Arkansas Board of Examiners in Counseling', renewalCycle: 24, totalCEUsRequired: 24, requirements: [{ category: 'Ethics', hoursRequired: 3 }, { category: 'General', hoursRequired: 21 }] },
  { type: 'state_license', code: 'LAC', name: 'Licensed Associate Counselor', state: 'AR', issuingBody: 'Arkansas Board of Examiners in Counseling', renewalCycle: 24, totalCEUsRequired: 24, requirements: [{ category: 'Ethics', hoursRequired: 3 }, { category: 'General', hoursRequired: 21 }] },
  
  // CALIFORNIA
  { type: 'state_license', code: 'LPCC', name: 'Licensed Professional Clinical Counselor', state: 'CA', issuingBody: 'Board of Behavioral Sciences', renewalCycle: 24, totalCEUsRequired: 36, requirements: [{ category: 'Ethics', hoursRequired: 6 }, { category: 'Suicide Prevention', hoursRequired: 6 }, { category: 'General', hoursRequired: 24 }] },
  { type: 'state_license', code: 'APCC', name: 'Associate Professional Clinical Counselor', state: 'CA', issuingBody: 'Board of Behavioral Sciences', renewalCycle: 12, totalCEUsRequired: 0, requirements: [], notes: 'No CE required during associate period.' },
  
  // COLORADO
  { type: 'state_license', code: 'LPC', name: 'Licensed Professional Counselor', state: 'CO', issuingBody: 'Colorado State Board', renewalCycle: 24, totalCEUsRequired: 40, requirements: [{ category: 'Ethics', hoursRequired: 4 }, { category: 'General', hoursRequired: 36 }] },
  { type: 'state_license', code: 'LPCC', name: 'Licensed Professional Counselor Candidate', state: 'CO', issuingBody: 'Colorado State Board', renewalCycle: 24, totalCEUsRequired: 40, requirements: [{ category: 'Ethics', hoursRequired: 4 }, { category: 'General', hoursRequired: 36 }] },
  
  // CONNECTICUT
  { type: 'state_license', code: 'LPC', name: 'Licensed Professional Counselor', state: 'CT', issuingBody: 'Connecticut DPH', renewalCycle: 12, totalCEUsRequired: 15, requirements: [{ category: 'Ethics', hoursRequired: 3 }, { category: 'General', hoursRequired: 12 }] },
  
  // DELAWARE
  { type: 'state_license', code: 'LPCMH', name: 'Licensed Professional Counselor of Mental Health', state: 'DE', issuingBody: 'Delaware Board', renewalCycle: 24, totalCEUsRequired: 40, requirements: [{ category: 'Ethics', hoursRequired: 6 }, { category: 'General', hoursRequired: 34 }] },
  { type: 'state_license', code: 'LPCMH-S', name: 'LPCMH Supervisor', state: 'DE', issuingBody: 'Delaware Board', renewalCycle: 24, totalCEUsRequired: 40, requirements: [{ category: 'Ethics', hoursRequired: 6 }, { category: 'General', hoursRequired: 34 }] },
  
  // FLORIDA
  { type: 'state_license', code: 'LMHC', name: 'Licensed Mental Health Counselor', state: 'FL', issuingBody: 'Florida Board of Clinical Social Work, MFT, and MHC', renewalCycle: 24, totalCEUsRequired: 30, requirements: [{ category: 'Ethics', hoursRequired: 3 }, { category: 'Medical Errors', hoursRequired: 2 }, { category: 'General', hoursRequired: 25 }], notes: 'Ethics and Telehealth alternate each renewal. 2 hrs Domestic Violence every 6 years. 3 hrs Laws & Rules every 3rd renewal.' },
  { type: 'state_license', code: 'RMHCI', name: 'Registered Mental Health Counselor Intern', state: 'FL', issuingBody: 'Florida Board of Clinical Social Work, MFT, and MHC', renewalCycle: 24, totalCEUsRequired: 0, requirements: [], notes: 'No CE required during intern period.' },
  { type: 'state_license', code: 'LMHC-QS', name: 'LMHC Qualified Supervisor', state: 'FL', issuingBody: 'Florida Board of Clinical Social Work, MFT, and MHC', renewalCycle: 24, totalCEUsRequired: 30, requirements: [{ category: 'Ethics', hoursRequired: 3 }, { category: 'Medical Errors', hoursRequired: 2 }, { category: 'General', hoursRequired: 25 }], notes: '4 hrs Supervisor training every 3rd renewal.' },
  
  // GEORGIA
  { type: 'state_license', code: 'LPC', name: 'Licensed Professional Counselor', state: 'GA', issuingBody: 'Georgia Composite Board', renewalCycle: 24, totalCEUsRequired: 35, requirements: [{ category: 'Ethics', hoursRequired: 5 }, { category: 'Core', hoursRequired: 15 }, { category: 'Related', hoursRequired: 15 }], notes: 'Ethics must be synchronous. Max 10 hours asynchronous.' },
  { type: 'state_license', code: 'LAPC', name: 'Licensed Associate Professional Counselor', state: 'GA', issuingBody: 'Georgia Composite Board', renewalCycle: 24, totalCEUsRequired: 35, requirements: [{ category: 'Ethics', hoursRequired: 5 }, { category: 'Core', hoursRequired: 15 }, { category: 'Related', hoursRequired: 15 }], notes: 'Same CE requirements as LPC.' },
  { type: 'state_license', code: 'CPCS', name: 'Certified Professional Counselors Supervisor', state: 'GA', issuingBody: 'Georgia Composite Board', renewalCycle: 24, totalCEUsRequired: 35, requirements: [{ category: 'Ethics', hoursRequired: 5 }, { category: 'Core', hoursRequired: 15 }, { category: 'Related', hoursRequired: 15 }], notes: 'Supervision credential added to LPC.' },
  
  // HAWAII
  { type: 'state_license', code: 'LMHC', name: 'Licensed Mental Health Counselor', state: 'HI', issuingBody: 'Hawaii DCCA', renewalCycle: 24, totalCEUsRequired: 40, requirements: [{ category: 'Ethics', hoursRequired: 4 }, { category: 'General', hoursRequired: 36 }] },
  
  // IDAHO
  { type: 'state_license', code: 'LPC', name: 'Licensed Professional Counselor', state: 'ID', issuingBody: 'Idaho Division of Occupational and Professional Licenses', renewalCycle: 24, totalCEUsRequired: 20, requirements: [{ category: 'Ethics', hoursRequired: 3 }, { category: 'General', hoursRequired: 17 }], notes: 'As of October 2025, Idaho transitioned to biennial (2-year) licensing.' },
  { type: 'state_license', code: 'LCPC', name: 'Licensed Clinical Professional Counselor', state: 'ID', issuingBody: 'Idaho Division of Occupational and Professional Licenses', renewalCycle: 24, totalCEUsRequired: 20, requirements: [{ category: 'Ethics', hoursRequired: 3 }, { category: 'General', hoursRequired: 17 }], notes: 'As of October 2025, Idaho transitioned to biennial (2-year) licensing.' },
  { type: 'state_license', code: 'MBTC', name: 'Mental or Behavioral Telehealth - Counselor', state: 'ID', issuingBody: 'Idaho Division of Occupational and Professional Licenses', renewalCycle: 24, totalCEUsRequired: 35, requirements: [{ category: 'Ethics', hoursRequired: 5 }, { category: 'General', hoursRequired: 30 }], notes: 'Interstate Telehealth Registration for out-of-state counselors practicing into Idaho. Non-renewable; apply for new registration when current one expires. CE requirements are met through your home state license.' },
  
  // ILLINOIS
  { type: 'state_license', code: 'LPC', name: 'Licensed Professional Counselor', state: 'IL', issuingBody: 'Illinois DFPR', renewalCycle: 24, totalCEUsRequired: 30, requirements: [{ category: 'Ethics', hoursRequired: 3 }, { category: 'General', hoursRequired: 27 }] },
  { type: 'state_license', code: 'LCPC', name: 'Licensed Clinical Professional Counselor', state: 'IL', issuingBody: 'Illinois DFPR', renewalCycle: 24, totalCEUsRequired: 30, requirements: [{ category: 'Ethics', hoursRequired: 3 }, { category: 'General', hoursRequired: 27 }] },
  
  // INDIANA
  { type: 'state_license', code: 'LMHC', name: 'Licensed Mental Health Counselor', state: 'IN', issuingBody: 'Indiana BHHSLB', renewalCycle: 24, totalCEUsRequired: 40, requirements: [{ category: 'Ethics', hoursRequired: 3 }, { category: 'General', hoursRequired: 37 }] },
  { type: 'state_license', code: 'LMHCA', name: 'Licensed Mental Health Counselor Associate', state: 'IN', issuingBody: 'Indiana BHHSLB', renewalCycle: 24, totalCEUsRequired: 40, requirements: [{ category: 'Ethics', hoursRequired: 3 }, { category: 'General', hoursRequired: 37 }] },
  
  // IOWA
  { type: 'state_license', code: 'LMHC', name: 'Licensed Mental Health Counselor', state: 'IA', issuingBody: 'Iowa Board of Behavioral Science', renewalCycle: 24, totalCEUsRequired: 40, requirements: [{ category: 'Ethics', hoursRequired: 4 }, { category: 'General', hoursRequired: 36 }] },
  
  // KANSAS
  { type: 'state_license', code: 'LPC', name: 'Licensed Professional Counselor', state: 'KS', issuingBody: 'Kansas BSRB', renewalCycle: 24, totalCEUsRequired: 50, requirements: [{ category: 'Ethics', hoursRequired: 6 }, { category: 'General', hoursRequired: 44 }] },
  { type: 'state_license', code: 'LCPC', name: 'Licensed Clinical Professional Counselor', state: 'KS', issuingBody: 'Kansas BSRB', renewalCycle: 24, totalCEUsRequired: 50, requirements: [{ category: 'Ethics', hoursRequired: 6 }, { category: 'General', hoursRequired: 44 }] },
  
  // KENTUCKY
  { type: 'state_license', code: 'LPCC', name: 'Licensed Professional Clinical Counselor', state: 'KY', issuingBody: 'Kentucky Board', renewalCycle: 24, totalCEUsRequired: 30, requirements: [{ category: 'Ethics', hoursRequired: 6 }, { category: 'General', hoursRequired: 24 }] },
  { type: 'state_license', code: 'LPCA', name: 'Licensed Professional Counselor Associate', state: 'KY', issuingBody: 'Kentucky Board', renewalCycle: 24, totalCEUsRequired: 30, requirements: [{ category: 'Ethics', hoursRequired: 6 }, { category: 'General', hoursRequired: 24 }] },
  
  // LOUISIANA
  { type: 'state_license', code: 'LPC', name: 'Licensed Professional Counselor', state: 'LA', issuingBody: 'Louisiana LPC Board', renewalCycle: 24, totalCEUsRequired: 40, requirements: [{ category: 'Ethics', hoursRequired: 6 }, { category: 'General', hoursRequired: 34 }] },
  { type: 'state_license', code: 'PLPC', name: 'Provisional Licensed Professional Counselor', state: 'LA', issuingBody: 'Louisiana LPC Board', renewalCycle: 24, totalCEUsRequired: 40, requirements: [{ category: 'Ethics', hoursRequired: 6 }, { category: 'General', hoursRequired: 34 }] },
  { type: 'state_license', code: 'LPC-S', name: 'LPC Board Approved Supervisor', state: 'LA', issuingBody: 'Louisiana LPC Board', renewalCycle: 24, totalCEUsRequired: 40, requirements: [{ category: 'Ethics', hoursRequired: 6 }, { category: 'General', hoursRequired: 34 }] },
  
  // MAINE
  { type: 'state_license', code: 'LCPC', name: 'Licensed Clinical Professional Counselor', state: 'ME', issuingBody: 'Maine Board', renewalCycle: 24, totalCEUsRequired: 55, requirements: [{ category: 'Ethics', hoursRequired: 6 }, { category: 'General', hoursRequired: 49 }] },
  { type: 'state_license', code: 'LCPC-C', name: 'LCPC Conditional', state: 'ME', issuingBody: 'Maine Board', renewalCycle: 24, totalCEUsRequired: 55, requirements: [{ category: 'Ethics', hoursRequired: 6 }, { category: 'General', hoursRequired: 49 }] },
  
  // MARYLAND
  { type: 'state_license', code: 'LCPC', name: 'Licensed Clinical Professional Counselor', state: 'MD', issuingBody: 'Maryland Board', renewalCycle: 24, totalCEUsRequired: 40, requirements: [{ category: 'Ethics', hoursRequired: 3 }, { category: 'General', hoursRequired: 37 }] },
  { type: 'state_license', code: 'LGPC', name: 'Licensed Graduate Professional Counselor', state: 'MD', issuingBody: 'Maryland Board', renewalCycle: 24, totalCEUsRequired: 40, requirements: [{ category: 'Ethics', hoursRequired: 3 }, { category: 'General', hoursRequired: 37 }] },
  
  // MASSACHUSETTS
  { type: 'state_license', code: 'LMHC', name: 'Licensed Mental Health Counselor', state: 'MA', issuingBody: 'Massachusetts Board', renewalCycle: 24, totalCEUsRequired: 30, requirements: [{ category: 'Ethics', hoursRequired: 3 }, { category: 'General', hoursRequired: 27 }] },
  
  // MICHIGAN
  { type: 'state_license', code: 'LPC', name: 'Licensed Professional Counselor', state: 'MI', issuingBody: 'Michigan Board of Counseling', renewalCycle: 24, totalCEUsRequired: 25, requirements: [{ category: 'Ethics', hoursRequired: 2 }, { category: 'General', hoursRequired: 23 }] },
  { type: 'state_license', code: 'LLPC', name: 'Limited Licensed Professional Counselor', state: 'MI', issuingBody: 'Michigan Board of Counseling', renewalCycle: 24, totalCEUsRequired: 25, requirements: [{ category: 'Ethics', hoursRequired: 2 }, { category: 'General', hoursRequired: 23 }] },
  
  // MINNESOTA
  { type: 'state_license', code: 'LPCC', name: 'Licensed Professional Clinical Counselor', state: 'MN', issuingBody: 'Minnesota Board', renewalCycle: 24, totalCEUsRequired: 40, requirements: [{ category: 'Ethics', hoursRequired: 4 }, { category: 'General', hoursRequired: 36 }] },
  { type: 'state_license', code: 'LPC', name: 'Licensed Professional Counselor', state: 'MN', issuingBody: 'Minnesota Board', renewalCycle: 24, totalCEUsRequired: 40, requirements: [{ category: 'Ethics', hoursRequired: 4 }, { category: 'General', hoursRequired: 36 }] },
  
  // MISSISSIPPI
  { type: 'state_license', code: 'LPC', name: 'Licensed Professional Counselor', state: 'MS', issuingBody: 'Mississippi Board', renewalCycle: 24, totalCEUsRequired: 24, requirements: [{ category: 'Ethics', hoursRequired: 3 }, { category: 'General', hoursRequired: 21 }] },
  { type: 'state_license', code: 'LPC-S', name: 'Licensed Professional Counselor - Supervisor', state: 'MS', issuingBody: 'Mississippi Board', renewalCycle: 24, totalCEUsRequired: 24, requirements: [{ category: 'Ethics', hoursRequired: 3 }, { category: 'General', hoursRequired: 21 }] },
  
  // MISSOURI
  { type: 'state_license', code: 'LPC', name: 'Licensed Professional Counselor', state: 'MO', issuingBody: 'Missouri Committee', renewalCycle: 24, totalCEUsRequired: 40, requirements: [{ category: 'Ethics', hoursRequired: 6 }, { category: 'General', hoursRequired: 34 }] },
  { type: 'state_license', code: 'PLPC', name: 'Provisional Licensed Professional Counselor', state: 'MO', issuingBody: 'Missouri Committee', renewalCycle: 24, totalCEUsRequired: 40, requirements: [{ category: 'Ethics', hoursRequired: 6 }, { category: 'General', hoursRequired: 34 }] },
  
  // MONTANA
  { type: 'state_license', code: 'LCPC', name: 'Licensed Clinical Professional Counselor', state: 'MT', issuingBody: 'Montana Board', renewalCycle: 24, totalCEUsRequired: 40, requirements: [{ category: 'Ethics', hoursRequired: 6 }, { category: 'General', hoursRequired: 34 }] },
  
  // NEBRASKA
  { type: 'state_license', code: 'LMHP', name: 'Licensed Mental Health Practitioner', state: 'NE', issuingBody: 'Nebraska DHHS', renewalCycle: 24, totalCEUsRequired: 32, requirements: [{ category: 'Ethics', hoursRequired: 3 }, { category: 'General', hoursRequired: 29 }] },
  { type: 'state_license', code: 'PLMHP', name: 'Provisional Licensed Mental Health Practitioner', state: 'NE', issuingBody: 'Nebraska DHHS', renewalCycle: 24, totalCEUsRequired: 32, requirements: [{ category: 'Ethics', hoursRequired: 3 }, { category: 'General', hoursRequired: 29 }] },
  
  // NEVADA
  { type: 'state_license', code: 'LCPC', name: 'Licensed Clinical Professional Counselor', state: 'NV', issuingBody: 'Nevada Board', renewalCycle: 24, totalCEUsRequired: 40, requirements: [{ category: 'Ethics', hoursRequired: 6 }, { category: 'Suicide Prevention', hoursRequired: 2 }, { category: 'General', hoursRequired: 32 }] },
  { type: 'state_license', code: 'CPC-I', name: 'Clinical Professional Counselor Intern', state: 'NV', issuingBody: 'Nevada Board', renewalCycle: 24, totalCEUsRequired: 40, requirements: [{ category: 'Ethics', hoursRequired: 6 }, { category: 'Suicide Prevention', hoursRequired: 2 }, { category: 'General', hoursRequired: 32 }] },
  
  // NEW HAMPSHIRE
  { type: 'state_license', code: 'LCMHC', name: 'Licensed Clinical Mental Health Counselor', state: 'NH', issuingBody: 'New Hampshire Board', renewalCycle: 24, totalCEUsRequired: 40, requirements: [{ category: 'Ethics', hoursRequired: 4 }, { category: 'General', hoursRequired: 36 }] },
  
  // NEW JERSEY
  { type: 'state_license', code: 'LPC', name: 'Licensed Professional Counselor', state: 'NJ', issuingBody: 'New Jersey Board', renewalCycle: 24, totalCEUsRequired: 40, requirements: [{ category: 'Ethics', hoursRequired: 3 }, { category: 'General', hoursRequired: 37 }] },
  { type: 'state_license', code: 'LAC', name: 'Licensed Associate Counselor', state: 'NJ', issuingBody: 'New Jersey Board', renewalCycle: 24, totalCEUsRequired: 40, requirements: [{ category: 'Ethics', hoursRequired: 3 }, { category: 'General', hoursRequired: 37 }] },
  
  // NEW MEXICO
  { type: 'state_license', code: 'LPCC', name: 'Licensed Professional Clinical Counselor', state: 'NM', issuingBody: 'New Mexico Board', renewalCycle: 24, totalCEUsRequired: 40, requirements: [{ category: 'Ethics', hoursRequired: 6 }, { category: 'General', hoursRequired: 34 }] },
  { type: 'state_license', code: 'LMHC', name: 'Licensed Mental Health Counselor', state: 'NM', issuingBody: 'New Mexico Board', renewalCycle: 24, totalCEUsRequired: 40, requirements: [{ category: 'Ethics', hoursRequired: 6 }, { category: 'General', hoursRequired: 34 }] },
  
  // NEW YORK
  { type: 'state_license', code: 'LMHC', name: 'Licensed Mental Health Counselor', state: 'NY', issuingBody: 'New York State Education Department', renewalCycle: 36, totalCEUsRequired: 36, requirements: [{ category: 'General', hoursRequired: 36 }] },
  { type: 'state_license', code: 'LMHC-P', name: 'LMHC Limited Permit', state: 'NY', issuingBody: 'New York State Education Department', renewalCycle: 12, totalCEUsRequired: 0, requirements: [], notes: 'No CE during permit period.' },
  
  // NORTH CAROLINA
  { type: 'state_license', code: 'LCMHC', name: 'Licensed Clinical Mental Health Counselor', state: 'NC', issuingBody: 'North Carolina Board', renewalCycle: 24, totalCEUsRequired: 40, requirements: [{ category: 'Ethics', hoursRequired: 3 }, { category: 'General', hoursRequired: 37 }] },
  { type: 'state_license', code: 'LCMHCA', name: 'Licensed Clinical Mental Health Counselor Associate', state: 'NC', issuingBody: 'North Carolina Board', renewalCycle: 24, totalCEUsRequired: 40, requirements: [{ category: 'Ethics', hoursRequired: 3 }, { category: 'General', hoursRequired: 37 }] },
  { type: 'state_license', code: 'LCMHCS', name: 'LCMHC Supervisor', state: 'NC', issuingBody: 'North Carolina Board', renewalCycle: 24, totalCEUsRequired: 40, requirements: [{ category: 'Ethics', hoursRequired: 3 }, { category: 'General', hoursRequired: 37 }] },
  
  // NORTH DAKOTA
  { type: 'state_license', code: 'LPCC', name: 'Licensed Professional Clinical Counselor', state: 'ND', issuingBody: 'North Dakota Board', renewalCycle: 24, totalCEUsRequired: 40, requirements: [{ category: 'Ethics', hoursRequired: 4 }, { category: 'General', hoursRequired: 36 }] },
  { type: 'state_license', code: 'LPC', name: 'Licensed Professional Counselor', state: 'ND', issuingBody: 'North Dakota Board', renewalCycle: 24, totalCEUsRequired: 40, requirements: [{ category: 'Ethics', hoursRequired: 4 }, { category: 'General', hoursRequired: 36 }] },
  
  // OHIO
  { type: 'state_license', code: 'LPCC', name: 'Licensed Professional Clinical Counselor', state: 'OH', issuingBody: 'Ohio CSWMFT Board', renewalCycle: 24, totalCEUsRequired: 30, requirements: [{ category: 'Ethics', hoursRequired: 3 }, { category: 'General', hoursRequired: 27 }] },
  { type: 'state_license', code: 'LPC', name: 'Licensed Professional Counselor', state: 'OH', issuingBody: 'Ohio CSWMFT Board', renewalCycle: 24, totalCEUsRequired: 30, requirements: [{ category: 'Ethics', hoursRequired: 3 }, { category: 'General', hoursRequired: 27 }] },
  { type: 'state_license', code: 'LPCC-S', name: 'LPCC Supervisor', state: 'OH', issuingBody: 'Ohio CSWMFT Board', renewalCycle: 24, totalCEUsRequired: 30, requirements: [{ category: 'Ethics', hoursRequired: 3 }, { category: 'Supervision', hoursRequired: 3 }, { category: 'General', hoursRequired: 24 }] },
  
  // OKLAHOMA
  { type: 'state_license', code: 'LPC', name: 'Licensed Professional Counselor', state: 'OK', issuingBody: 'Oklahoma Board', renewalCycle: 24, totalCEUsRequired: 40, requirements: [{ category: 'Ethics', hoursRequired: 3 }, { category: 'General', hoursRequired: 37 }] },
  
  // OREGON
  { type: 'state_license', code: 'LPC', name: 'Licensed Professional Counselor', state: 'OR', issuingBody: 'Oregon Board', renewalCycle: 24, totalCEUsRequired: 40, requirements: [{ category: 'Ethics', hoursRequired: 6 }, { category: 'General', hoursRequired: 34 }] },
  { type: 'state_license', code: 'LPC-I', name: 'Licensed Professional Counselor Intern', state: 'OR', issuingBody: 'Oregon Board', renewalCycle: 24, totalCEUsRequired: 40, requirements: [{ category: 'Ethics', hoursRequired: 6 }, { category: 'General', hoursRequired: 34 }] },
  
  // PENNSYLVANIA
  { type: 'state_license', code: 'LPC', name: 'Licensed Professional Counselor', state: 'PA', issuingBody: 'Pennsylvania State Board', renewalCycle: 24, totalCEUsRequired: 30, requirements: [{ category: 'Ethics', hoursRequired: 3 }, { category: 'General', hoursRequired: 27 }] },
  
  // RHODE ISLAND
  { type: 'state_license', code: 'LMHC', name: 'Licensed Mental Health Counselor', state: 'RI', issuingBody: 'Rhode Island DOH', renewalCycle: 24, totalCEUsRequired: 40, requirements: [{ category: 'Ethics', hoursRequired: 4 }, { category: 'General', hoursRequired: 36 }] },
  
  // SOUTH CAROLINA
  { type: 'state_license', code: 'LPC', name: 'Licensed Professional Counselor', state: 'SC', issuingBody: 'South Carolina Board', renewalCycle: 24, totalCEUsRequired: 40, requirements: [{ category: 'Ethics', hoursRequired: 6 }, { category: 'General', hoursRequired: 34 }] },
  { type: 'state_license', code: 'LPC-I', name: 'Licensed Professional Counselor Intern', state: 'SC', issuingBody: 'South Carolina Board', renewalCycle: 24, totalCEUsRequired: 40, requirements: [{ category: 'Ethics', hoursRequired: 6 }, { category: 'General', hoursRequired: 34 }] },
  { type: 'state_license', code: 'LPC-S', name: 'LPC Supervisor', state: 'SC', issuingBody: 'South Carolina Board', renewalCycle: 24, totalCEUsRequired: 40, requirements: [{ category: 'Ethics', hoursRequired: 6 }, { category: 'General', hoursRequired: 34 }] },
  
  // SOUTH DAKOTA
  { type: 'state_license', code: 'LPC-MH', name: 'Licensed Professional Counselor-Mental Health', state: 'SD', issuingBody: 'South Dakota Board', renewalCycle: 24, totalCEUsRequired: 40, requirements: [{ category: 'Ethics', hoursRequired: 4 }, { category: 'General', hoursRequired: 36 }] },
  { type: 'state_license', code: 'LPC', name: 'Licensed Professional Counselor', state: 'SD', issuingBody: 'South Dakota Board', renewalCycle: 24, totalCEUsRequired: 40, requirements: [{ category: 'Ethics', hoursRequired: 4 }, { category: 'General', hoursRequired: 36 }] },
  
  // TENNESSEE
  { type: 'state_license', code: 'LPC-MHSP', name: 'Licensed Professional Counselor with MHSP', state: 'TN', issuingBody: 'Tennessee Board', renewalCycle: 24, totalCEUsRequired: 40, requirements: [{ category: 'Ethics', hoursRequired: 6 }, { category: 'General', hoursRequired: 34 }] },
  { type: 'state_license', code: 'LPC', name: 'Licensed Professional Counselor', state: 'TN', issuingBody: 'Tennessee Board', renewalCycle: 24, totalCEUsRequired: 40, requirements: [{ category: 'Ethics', hoursRequired: 6 }, { category: 'General', hoursRequired: 34 }] },
  
  // TEXAS
  { type: 'state_license', code: 'LPC', name: 'Licensed Professional Counselor', state: 'TX', issuingBody: 'Texas BHEC', renewalCycle: 24, totalCEUsRequired: 24, requirements: [{ category: 'Ethics', hoursRequired: 6 }, { category: 'Cultural Diversity', hoursRequired: 3 }, { category: 'General', hoursRequired: 15 }] },
  { type: 'state_license', code: 'LPC-A', name: 'Licensed Professional Counselor Associate', state: 'TX', issuingBody: 'Texas BHEC', renewalCycle: 60, totalCEUsRequired: 0, requirements: [], notes: '60-month intern period. No CE required.' },
  { type: 'state_license', code: 'LPC-S', name: 'LPC Supervisor', state: 'TX', issuingBody: 'Texas BHEC', renewalCycle: 24, totalCEUsRequired: 24, requirements: [{ category: 'Ethics', hoursRequired: 6 }, { category: 'Cultural Diversity', hoursRequired: 3 }, { category: 'Supervision', hoursRequired: 6 }, { category: 'General', hoursRequired: 9 }] },
  
  // UTAH
  { type: 'state_license', code: 'LCMHC', name: 'Licensed Clinical Mental Health Counselor', state: 'UT', issuingBody: 'Utah DOPL', renewalCycle: 24, totalCEUsRequired: 40, requirements: [{ category: 'Ethics', hoursRequired: 3 }, { category: 'Suicide Prevention', hoursRequired: 2 }, { category: 'General', hoursRequired: 35 }] },
  { type: 'state_license', code: 'ACMHC', name: 'Associate Clinical Mental Health Counselor', state: 'UT', issuingBody: 'Utah DOPL', renewalCycle: 24, totalCEUsRequired: 40, requirements: [{ category: 'Ethics', hoursRequired: 3 }, { category: 'Suicide Prevention', hoursRequired: 2 }, { category: 'General', hoursRequired: 35 }] },
  
  // VERMONT
  { type: 'state_license', code: 'LCMHC', name: 'Licensed Clinical Mental Health Counselor', state: 'VT', issuingBody: 'Vermont OPR', renewalCycle: 24, totalCEUsRequired: 40, requirements: [{ category: 'Ethics', hoursRequired: 4 }, { category: 'General', hoursRequired: 36 }] },
  
  // VIRGINIA
  { type: 'state_license', code: 'LPC', name: 'Licensed Professional Counselor', state: 'VA', issuingBody: 'Virginia Board of Counseling', renewalCycle: 24, totalCEUsRequired: 20, requirements: [{ category: 'Ethics', hoursRequired: 2 }, { category: 'General', hoursRequired: 18 }] },
  { type: 'state_license', code: 'Resident', name: 'Resident in Counseling', state: 'VA', issuingBody: 'Virginia Board of Counseling', renewalCycle: 24, totalCEUsRequired: 20, requirements: [{ category: 'Ethics', hoursRequired: 2 }, { category: 'General', hoursRequired: 18 }] },
  
  // WASHINGTON
  { type: 'state_license', code: 'LMHC', name: 'Licensed Mental Health Counselor', state: 'WA', issuingBody: 'Washington DOH', renewalCycle: 24, totalCEUsRequired: 36, requirements: [{ category: 'Ethics', hoursRequired: 6 }, { category: 'Suicide Prevention', hoursRequired: 6 }, { category: 'General', hoursRequired: 24 }] },
  { type: 'state_license', code: 'LMHCA', name: 'Licensed Mental Health Counselor Associate', state: 'WA', issuingBody: 'Washington DOH', renewalCycle: 12, totalCEUsRequired: 0, requirements: [], notes: 'No CE during associate period.' },
  
  // WEST VIRGINIA
  { type: 'state_license', code: 'LPC', name: 'Licensed Professional Counselor', state: 'WV', issuingBody: 'West Virginia Board', renewalCycle: 24, totalCEUsRequired: 40, requirements: [{ category: 'Ethics', hoursRequired: 3 }, { category: 'General', hoursRequired: 37 }] },
  
  // WISCONSIN
  { type: 'state_license', code: 'LPC', name: 'Licensed Professional Counselor', state: 'WI', issuingBody: 'Wisconsin DSPS', renewalCycle: 24, totalCEUsRequired: 40, requirements: [{ category: 'Ethics', hoursRequired: 4 }, { category: 'General', hoursRequired: 36 }] },
  { type: 'state_license', code: 'LPC-IT', name: 'LPC in Training', state: 'WI', issuingBody: 'Wisconsin DSPS', renewalCycle: 24, totalCEUsRequired: 0, requirements: [], notes: 'No CE during training period.' },
  
  // WYOMING
  { type: 'state_license', code: 'LPC', name: 'Licensed Professional Counselor', state: 'WY', issuingBody: 'Wyoming Board', renewalCycle: 24, totalCEUsRequired: 45, requirements: [{ category: 'Ethics', hoursRequired: 3 }, { category: 'General', hoursRequired: 42 }] },
  
  // DC
  { type: 'state_license', code: 'LPC', name: 'Licensed Professional Counselor', state: 'DC', issuingBody: 'DC Board', renewalCycle: 24, totalCEUsRequired: 40, requirements: [{ category: 'Ethics', hoursRequired: 4 }, { category: 'General', hoursRequired: 36 }] }
];

export const nationalCerts = [
  { type: 'national_cert', code: 'NCC', name: 'National Certified Counselor', issuingBody: 'NBCC', renewalCycle: 60, totalCEUsRequired: 100, requirements: [{ category: 'General', hoursRequired: 100 }] },
  { type: 'national_cert', code: 'ACS', name: 'Approved Clinical Supervisor', issuingBody: 'NBCC', renewalCycle: 60, totalCEUsRequired: 75, requirements: [{ category: 'Supervision', hoursRequired: 25 }, { category: 'General', hoursRequired: 50 }] },
  { type: 'national_cert', code: 'CCMHC', name: 'Certified Clinical Mental Health Counselor', issuingBody: 'NBCC', renewalCycle: 60, totalCEUsRequired: 100, requirements: [{ category: 'Clinical', hoursRequired: 50 }, { category: 'General', hoursRequired: 50 }] },
  { type: 'national_cert', code: 'MAC', name: 'Master Addictions Counselor', issuingBody: 'NBCC', renewalCycle: 60, totalCEUsRequired: 100, requirements: [{ category: 'Addictions', hoursRequired: 40 }, { category: 'General', hoursRequired: 60 }] }
];

export const specialtyCerts = [
  { type: 'specialty_cert', code: 'BC-TMH', name: 'Board Certified-TeleMental Health Provider', issuingBody: 'CCE', renewalCycle: 60, totalCEUsRequired: 20, requirements: [{ category: 'Telehealth', hoursRequired: 20 }], notes: 'Must complete 4 CE hours annually. 20 telehealth-specific CEs required over 5-year renewal period.' },
  { type: 'specialty_cert', code: 'CCTP', name: 'Certified Clinical Trauma Professional', issuingBody: 'IATP', renewalCycle: 24, totalCEUsRequired: 20, requirements: [{ category: 'Trauma', hoursRequired: 20 }] },
  { type: 'specialty_cert', code: 'CCTP-II', name: 'Certified Clinical Trauma Professional - Level II', issuingBody: 'IATP', renewalCycle: 24, totalCEUsRequired: 20, requirements: [{ category: 'Trauma', hoursRequired: 20 }] },
  { type: 'specialty_cert', code: 'RPT', name: 'Registered Play Therapist', issuingBody: 'APT', renewalCycle: 36, totalCEUsRequired: 18, requirements: [{ category: 'Play Therapy', hoursRequired: 18 }] },
  { type: 'specialty_cert', code: 'RPT-S', name: 'Registered Play Therapist-Supervisor', issuingBody: 'APT', renewalCycle: 36, totalCEUsRequired: 18, requirements: [{ category: 'Play Therapy', hoursRequired: 18 }] },
  { type: 'specialty_cert', code: 'EMDR-CT', name: 'EMDRIA Certified Therapist', issuingBody: 'EMDRIA', renewalCycle: 24, totalCEUsRequired: 12, requirements: [{ category: 'EMDR', hoursRequired: 12 }], notes: '12 EMDRIA credits in EMDR-specific continuing education required.' },
  { type: 'specialty_cert', code: 'EMDR-C', name: 'Certified EMDR Clinician', issuingBody: 'Evergreen', renewalCycle: 24, totalCEUsRequired: 12, requirements: [{ category: 'EMDR', hoursRequired: 12 }] },
  { type: 'specialty_cert', code: 'CDWF', name: 'Certified Daring Way Facilitator', issuingBody: 'Brené Brown Education', renewalCycle: 24, totalCEUsRequired: 12, requirements: [{ category: 'General', hoursRequired: 12 }] },
  { type: 'specialty_cert', code: 'CGP', name: 'Certified Group Psychotherapist', issuingBody: 'AGPA', renewalCycle: 36, totalCEUsRequired: 36, requirements: [{ category: 'Group Therapy', hoursRequired: 18 }, { category: 'General', hoursRequired: 18 }] },
  { type: 'specialty_cert', code: 'CSAT', name: 'Certified Sex Addiction Therapist', issuingBody: 'IITAP', renewalCycle: 24, totalCEUsRequired: 30, requirements: [{ category: 'Sexual Addiction', hoursRequired: 15 }, { category: 'General', hoursRequired: 15 }] },
  { type: 'specialty_cert', code: 'C-DBT', name: 'Certified DBT Clinician', issuingBody: 'DBT-LBC', renewalCycle: 24, totalCEUsRequired: 16, requirements: [{ category: 'DBT', hoursRequired: 16 }] }
];

export const sampleCourses = [
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
        { title: 'Welcome & Course Overview', type: 'text', content: '<h2>Welcome to NCMHCE Study Starter</h2><p>This free course will help you understand the exam and build your study plan.</p>', order: 1, isFree: true, duration: 10 },
        { title: 'Understanding the NCMHCE Format', type: 'text', content: '<h2>NCMHCE Exam Format</h2><p>The NCMHCE consists of 10 clinical simulations that test your decision-making abilities.</p>', order: 2, isFree: true, duration: 15 },
        { title: 'Building Your Study Plan', type: 'text', content: '<h2>Creating an Effective Study Plan</h2><p>A structured approach to NCMHCE prep makes all the difference.</p>', order: 3, isFree: true, duration: 12 }
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
        { title: 'Introduction to Telehealth', type: 'text', content: '<h2>The Rise of Telehealth</h2><p>Telehealth has become essential in modern counseling practice.</p>', order: 1, isFree: true, duration: 10 },
        { title: 'HIPAA Compliance', type: 'text', content: '<h2>Ensuring HIPAA Compliance</h2><p>Protecting client privacy is essential.</p>', order: 2, isFree: false, duration: 20 }
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
        { title: 'Why Ethics Matter', type: 'text', content: '<h2>The Foundation of Professional Practice</h2><p>Ethics form the foundation of professional counseling.</p>', order: 1, isFree: true, duration: 10 },
        { title: 'ACA Code Overview', type: 'text', content: '<h2>Understanding the ACA Code</h2><p>The ACA Code of Ethics provides guidance for professional counselors.</p>', order: 2, isFree: false, duration: 25 }
      ]
    }]
  }
];
