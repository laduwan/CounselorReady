// seedInitialAlerts.js — Run in Render shell: node seedInitialAlerts.js
// Creates a few manual board alerts so the page isn't empty
import mongoose from 'mongoose';
// Run validator first: node src/scripts/validateSeed.js src/scripts/seedInitialAlerts.js

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('No MONGODB_URI'); process.exit(1); }

const boardAlertSchema = new mongoose.Schema({
  state: String, boardName: String, credentialTypes: [String],
  title: String, summary: String, details: String,
  category: String, severity: String,
  effectiveDate: Date, sourceUrl: String,
  isPublished: { type: Boolean, default: false },
  acknowledgedBy: [{ type: mongoose.Schema.Types.ObjectId }],
  changeHistory: [mongoose.Schema.Types.Mixed],
  createdBy: { type: mongoose.Schema.Types.ObjectId }
}, { timestamps: true });

const BoardAlert = mongoose.models.BoardAlert || mongoose.model('BoardAlert', boardAlertSchema);

const ALERTS = [
  {
    state: 'GA',
    boardName: 'Georgia Composite Board',
    credentialTypes: ['LPC', 'LCSW', 'LMFT'],
    title: 'Georgia 2026 CE Renewal Reminder',
    summary: 'Georgia LPC renewal cycle requires 35 CE hours including 5 hours of ethics (synchronous). Ensure all ethics hours are from live/synchronous sources.',
    details: 'The Georgia Composite Board requires 35 total CE hours per 2-year renewal cycle. Of these, 5 hours must be in ethics and must be obtained through synchronous (live) instruction. The remaining 30 hours may be asynchronous. All CE must be from NBCC ACEP-approved providers or providers approved by the Georgia board.',
    category: 'ce_requirement_change',
    severity: 'info',
    effectiveDate: new Date('2026-01-01'),
    sourceUrl: 'https://sos.ga.gov/index.php/licensing/plb/45',
    isPublished: true
  },
  {
    state: 'GA',
    boardName: 'Georgia Composite Board',
    credentialTypes: ['LPC'],
    title: 'CPCS Supervision CE Requirements',
    summary: 'Certified Professional Counselor Supervisors (CPCS) must complete 12 CE hours in supervision-specific topics per renewal cycle, in addition to standard LPC CE requirements.',
    details: 'CPCS holders renew on a separate cycle from LPC. The 12 supervision CE hours are in addition to the 35 LPC hours. Supervision CE must specifically address clinical supervision methodology, ethical supervision practices, or supervisory relationship dynamics.',
    category: 'ce_requirement_change',
    severity: 'important',
    sourceUrl: 'https://sos.ga.gov/index.php/licensing/plb/45',
    isPublished: true
  },
  {
    state: 'US',
    boardName: 'National Board for Certified Counselors',
    credentialTypes: ['NCC'],
    title: 'NCC 100 CE Hours Per 5-Year Cycle',
    summary: 'NCC certification requires 100 CE hours over a 5-year cycle. At least 3 hours must address ethics. Hours must be from NBCC-approved providers.',
    details: 'The NCC recertification cycle is 5 years. Certificants must earn 100 CE hours from NBCC ACEP-approved providers. At least 3 hours must be in ethics. CounselorReady courses (ACEP #7760) satisfy this requirement. Hours can also count toward state license renewal if categories align.',
    category: 'ce_requirement_change',
    severity: 'info',
    sourceUrl: 'https://www.nbcc.org/certification/ncc/renewal',
    isPublished: true
  },
  {
    state: 'US',
    boardName: 'NBCC',
    credentialTypes: ['BC-TMH'],
    title: 'BC-TMH Specialty CE Requirements',
    summary: 'Board Certified-TeleMental Health providers must complete 20 CE hours in telehealth-specific topics per renewal. These are in addition to NCC base requirements.',
    details: 'BC-TMH renewal requires 20 specialty CE hours focused on technology-assisted counseling, telehealth ethics, distance service delivery, and digital security. These hours must come from NBCC ACEP providers and be specifically categorized as telehealth content.',
    category: 'ce_requirement_change',
    severity: 'info',
    sourceUrl: 'https://www.nbcc.org/certification/bctmh',
    isPublished: true
  },
  {
    state: 'TX',
    boardName: 'Texas Behavioral Health Executive Council',
    credentialTypes: ['LPC'],
    title: 'Texas LPC 24 CE Hours Per 2-Year Cycle',
    summary: 'Texas LPCs must complete 24 CE hours per 2-year renewal. At least 3 hours must be in ethics and 2 hours in cultural diversity.',
    details: 'Texas BHEC requires LPCs to complete 24 total CE hours biennially. Required categories: 3 hours ethics, 2 hours cultural diversity/social justice. Remaining hours are open. Texas accepts NBCC ACEP-approved CE.',
    category: 'ce_requirement_change',
    severity: 'info',
    sourceUrl: 'https://www.bhec.texas.gov/texas-state-board-of-examiners-of-professional-counselors/index.html',
    isPublished: true
  }
];

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB\n');

  let created = 0, skipped = 0;

  for (const alert of ALERTS) {
    const existing = await BoardAlert.findOne({ title: alert.title, state: alert.state });
    if (existing) {
      console.log(`  SKIP: ${alert.title}`);
      skipped++;
      continue;
    }

    await BoardAlert.create(alert);
    console.log(`  ADD:  [${alert.state}] ${alert.title}`);
    created++;
  }

  console.log(`\nDone: ${created} created, ${skipped} skipped\n`);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
