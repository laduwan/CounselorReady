// Run this in browser console while logged in as admin on CounselorReady
// This adds all common mental health professional credentials

const templates = [
  // ===============================
  // GEORGIA STATE LICENSES
  // ===============================
  {
    type: "state_license",
    code: "LPC",
    name: "Licensed Professional Counselor",
    state: "GA",
    issuingBody: "Georgia Composite Board of Professional Counselors, Social Workers, and Marriage and Family Therapists",
    renewalCycle: 24,
    totalCEUsRequired: 35,
    requirements: [
      { category: "Ethics", hoursRequired: 5, description: "Ethics required" }
    ]
  },
  {
    type: "state_license",
    code: "LAPC",
    name: "Licensed Associate Professional Counselor",
    state: "GA",
    issuingBody: "Georgia Composite Board",
    renewalCycle: 24,
    totalCEUsRequired: 35,
    requirements: [
      { category: "Ethics", hoursRequired: 5, description: "Ethics required" }
    ]
  },
  {
    type: "state_license",
    code: "LCSW",
    name: "Licensed Clinical Social Worker",
    state: "GA",
    issuingBody: "Georgia Composite Board",
    renewalCycle: 24,
    totalCEUsRequired: 35,
    requirements: [
      { category: "Ethics", hoursRequired: 5, description: "Ethics required" }
    ]
  },
  {
    type: "state_license",
    code: "LMSW",
    name: "Licensed Master Social Worker",
    state: "GA",
    issuingBody: "Georgia Composite Board",
    renewalCycle: 24,
    totalCEUsRequired: 35,
    requirements: [
      { category: "Ethics", hoursRequired: 5, description: "Ethics required" }
    ]
  },
  {
    type: "state_license",
    code: "LMFT",
    name: "Licensed Marriage and Family Therapist",
    state: "GA",
    issuingBody: "Georgia Composite Board",
    renewalCycle: 24,
    totalCEUsRequired: 35,
    requirements: [
      { category: "Ethics", hoursRequired: 5, description: "Ethics required" }
    ]
  },
  {
    type: "state_license",
    code: "LAMFT",
    name: "Licensed Associate Marriage and Family Therapist",
    state: "GA",
    issuingBody: "Georgia Composite Board",
    renewalCycle: 24,
    totalCEUsRequired: 35,
    requirements: [
      { category: "Ethics", hoursRequired: 5, description: "Ethics required" }
    ]
  },

  // ===============================
  // TEXAS STATE LICENSES
  // ===============================
  {
    type: "state_license",
    code: "LPC",
    name: "Licensed Professional Counselor",
    state: "TX",
    issuingBody: "Texas Behavioral Health Executive Council",
    renewalCycle: 24,
    totalCEUsRequired: 24,
    requirements: [
      { category: "Ethics", hoursRequired: 6, description: "Ethics required" },
      { category: "Suicide Prevention", hoursRequired: 3, description: "Suicide prevention required" }
    ]
  },
  {
    type: "state_license",
    code: "LPC-A",
    name: "Licensed Professional Counselor Associate",
    state: "TX",
    issuingBody: "Texas Behavioral Health Executive Council",
    renewalCycle: 24,
    totalCEUsRequired: 24,
    requirements: [
      { category: "Ethics", hoursRequired: 6, description: "Ethics required" },
      { category: "Suicide Prevention", hoursRequired: 3, description: "Suicide prevention required" }
    ]
  },
  {
    type: "state_license",
    code: "LCSW",
    name: "Licensed Clinical Social Worker",
    state: "TX",
    issuingBody: "Texas Behavioral Health Executive Council",
    renewalCycle: 24,
    totalCEUsRequired: 30,
    requirements: [
      { category: "Ethics", hoursRequired: 4, description: "Ethics required" }
    ]
  },
  {
    type: "state_license",
    code: "LMFT",
    name: "Licensed Marriage and Family Therapist",
    state: "TX",
    issuingBody: "Texas Behavioral Health Executive Council",
    renewalCycle: 24,
    totalCEUsRequired: 24,
    requirements: [
      { category: "Ethics", hoursRequired: 6, description: "Ethics required" }
    ]
  },

  // ===============================
  // IDAHO STATE LICENSES
  // ===============================
  {
    type: "state_license",
    code: "LPC",
    name: "Licensed Professional Counselor",
    state: "ID",
    issuingBody: "Idaho Division of Occupational and Professional Licenses",
    renewalCycle: 12,
    totalCEUsRequired: 20,
    requirements: [
      { category: "Ethics", hoursRequired: 3, description: "Ethics required" }
    ]
  },
  {
    type: "state_license",
    code: "LCPC",
    name: "Licensed Clinical Professional Counselor",
    state: "ID",
    issuingBody: "Idaho Division of Occupational and Professional Licenses",
    renewalCycle: 12,
    totalCEUsRequired: 20,
    requirements: [
      { category: "Ethics", hoursRequired: 3, description: "Ethics required" }
    ]
  },
  {
    type: "state_license",
    code: "LCSW",
    name: "Licensed Clinical Social Worker",
    state: "ID",
    issuingBody: "Idaho Division of Occupational and Professional Licenses",
    renewalCycle: 12,
    totalCEUsRequired: 20,
    requirements: [
      { category: "Ethics", hoursRequired: 2, description: "Ethics required" }
    ]
  },
  {
    type: "state_license",
    code: "LMFT",
    name: "Licensed Marriage and Family Therapist",
    state: "ID",
    issuingBody: "Idaho Division of Occupational and Professional Licenses",
    renewalCycle: 12,
    totalCEUsRequired: 20,
    requirements: [
      { category: "Ethics", hoursRequired: 2, description: "Ethics required" }
    ]
  },

  // ===============================
  // NATIONAL CERTIFICATIONS (NBCC)
  // ===============================
  {
    type: "national_cert",
    code: "NCC",
    name: "National Certified Counselor",
    state: null,
    issuingBody: "National Board for Certified Counselors (NBCC)",
    renewalCycle: 60,
    totalCEUsRequired: 100,
    requirements: [
      { category: "Ethics", hoursRequired: 10, description: "NBCC-approved ethics" }
    ]
  },
  {
    type: "national_cert",
    code: "CCMHC",
    name: "Certified Clinical Mental Health Counselor",
    state: null,
    issuingBody: "National Board for Certified Counselors (NBCC)",
    renewalCycle: 60,
    totalCEUsRequired: 50,
    requirements: [
      { category: "Clinical", hoursRequired: 25, description: "Clinical mental health topics" }
    ],
    notes: "Requires active NCC certification"
  },
  {
    type: "national_cert",
    code: "MAC",
    name: "Master Addictions Counselor",
    state: null,
    issuingBody: "National Board for Certified Counselors (NBCC)",
    renewalCycle: 60,
    totalCEUsRequired: 40,
    requirements: [
      { category: "Addictions", hoursRequired: 20, description: "Addiction-specific content" }
    ],
    notes: "Requires active NCC certification"
  },
  {
    type: "national_cert",
    code: "ACS",
    name: "Approved Clinical Supervisor",
    state: null,
    issuingBody: "Center for Credentialing & Education (CCE)",
    renewalCycle: 60,
    totalCEUsRequired: 30,
    requirements: [
      { category: "Supervision", hoursRequired: 15, description: "Clinical supervision topics" }
    ]
  },
  {
    type: "national_cert",
    code: "CRC",
    name: "Certified Rehabilitation Counselor",
    state: null,
    issuingBody: "Commission on Rehabilitation Counselor Certification (CRCC)",
    renewalCycle: 60,
    totalCEUsRequired: 100,
    requirements: [
      { category: "Ethics", hoursRequired: 10, description: "Ethics required" }
    ]
  },

  // ===============================
  // SPECIALTY CERTIFICATIONS
  // ===============================
  {
    type: "specialty_cert",
    code: "BC-TMH",
    name: "Board Certified-TeleMental Health Provider",
    state: null,
    issuingBody: "Center for Credentialing & Education (CCE)",
    renewalCycle: 60,
    totalCEUsRequired: 30,
    requirements: [
      { category: "Telehealth", hoursRequired: 15, description: "Telemental health specific" }
    ]
  },
  {
    type: "specialty_cert",
    code: "CPCS",
    name: "Certified Professional Counselor Supervisor",
    state: "GA",
    issuingBody: "Georgia Composite Board / CCALP",
    renewalCycle: 36,
    totalCEUsRequired: 12,
    requirements: [
      { category: "Ethics", hoursRequired: 3, description: "Ethics in supervision" }
    ]
  },
  {
    type: "specialty_cert",
    code: "EMDR",
    name: "EMDRIA Certified Therapist",
    state: null,
    issuingBody: "EMDR International Association (EMDRIA)",
    renewalCycle: 24,
    totalCEUsRequired: 12,
    requirements: [
      { category: "EMDR", hoursRequired: 12, description: "EMDR-specific training" }
    ]
  },
  {
    type: "specialty_cert",
    code: "DBT-C",
    name: "DBT Certified Clinician",
    state: null,
    issuingBody: "Dialectical Behavior Therapy - Linehan Board of Certification",
    renewalCycle: 60,
    totalCEUsRequired: 30,
    requirements: [
      { category: "DBT", hoursRequired: 30, description: "DBT-specific training" }
    ]
  },
  {
    type: "specialty_cert",
    code: "CCTP",
    name: "Certified Clinical Trauma Professional",
    state: null,
    issuingBody: "International Association of Trauma Professionals (IATP)",
    renewalCycle: 36,
    totalCEUsRequired: 36,
    requirements: [
      { category: "Trauma", hoursRequired: 36, description: "Trauma-focused content" }
    ]
  },
  {
    type: "specialty_cert",
    code: "CFMHE",
    name: "Certified Forensic Mental Health Evaluator",
    state: null,
    issuingBody: "Center for Credentialing & Education (CCE)",
    renewalCycle: 60,
    totalCEUsRequired: 30,
    requirements: [
      { category: "Forensic", hoursRequired: 15, description: "Forensic mental health topics" }
    ]
  },

  // ===============================
  // ADDICTION CREDENTIALS
  // ===============================
  {
    type: "specialty_cert",
    code: "CAC",
    name: "Certified Addiction Counselor",
    state: "GA",
    issuingBody: "Georgia Addiction Counselors Association",
    renewalCycle: 24,
    totalCEUsRequired: 40,
    requirements: [
      { category: "Addictions", hoursRequired: 20, description: "Addiction-specific" },
      { category: "Ethics", hoursRequired: 6, description: "Ethics required" }
    ]
  },
  {
    type: "national_cert",
    code: "CASAC",
    name: "Credentialed Alcoholism and Substance Abuse Counselor",
    state: null,
    issuingBody: "OASAS (varies by state)",
    renewalCycle: 24,
    totalCEUsRequired: 40,
    requirements: [
      { category: "Addictions", hoursRequired: 20, description: "CASAC approved" }
    ]
  }
];

// Function to add templates one at a time
async function addTemplates() {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Not logged in!');
    return;
  }

  let added = 0;
  let skipped = 0;
  let failed = 0;

  for (const template of templates) {
    try {
      const response = await fetch('https://api.counselorready.com/api/admin/credential-templates', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(template)
      });

      const data = await response.json();

      if (response.status === 201) {
        console.log(`✅ Added: ${template.code}${template.state ? ' (' + template.state + ')' : ''}`);
        added++;
      } else if (response.status === 400 && data.error?.includes('already exists')) {
        console.log(`⏭️ Skipped (exists): ${template.code}${template.state ? ' (' + template.state + ')' : ''}`);
        skipped++;
      } else {
        console.error(`❌ Failed: ${template.code} - ${data.error}`);
        failed++;
      }
    } catch (error) {
      console.error(`❌ Error: ${template.code} - ${error.message}`);
      failed++;
    }

    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 100));
  }

  console.log('\n========== SUMMARY ==========');
  console.log(`✅ Added: ${added}`);
  console.log(`⏭️ Skipped: ${skipped}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total: ${templates.length}`);
}

// Run it
addTemplates();
