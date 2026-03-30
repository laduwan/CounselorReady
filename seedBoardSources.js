// seedBoardSources.js — Run in Render shell: node seedBoardSources.js
// Seeds BoardSource entries so the board monitor has URLs to watch
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('No MONGODB_URI'); process.exit(1); }

const boardSourceSchema = new mongoose.Schema({
  state: { type: String, required: true, uppercase: true },
  boardName: { type: String, required: true },
  credentialTypes: [String],
  url: { type: String, required: true },
  feedType: { type: String, enum: ['rss', 'webpage', 'email'], required: true },
  contentSelector: String,
  isActive: { type: Boolean, default: true },
  lastCheckedAt: Date,
  lastContentHash: String,
  lastContent: String,
  checkFrequencyHours: { type: Number, default: 24 },
  consecutiveFailures: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: String
}, { timestamps: true });

const BoardSource = mongoose.models.BoardSource || mongoose.model('BoardSource', boardSourceSchema);

const SOURCES = [
  // Georgia
  {
    state: 'GA',
    boardName: 'Georgia Composite Board of Professional Counselors, Social Workers, and Marriage & Family Therapists',
    credentialTypes: ['LPC', 'LCSW', 'LMFT'],
    url: 'https://sos.ga.gov/PLB/acrobat/Forms/38%20Reference%20-%20Laws%20-%20Official%20Code%20of%20GA.pdf',
    feedType: 'webpage',
    notes: 'GA Composite Board - laws and rules page. Monitor for CE requirement changes.',
    checkFrequencyHours: 168 // weekly
  },
  {
    state: 'GA',
    boardName: 'Georgia Secretary of State - PLB Announcements',
    credentialTypes: ['LPC', 'LCSW', 'LMFT'],
    url: 'https://sos.ga.gov/index.php/licensing/plb/45',
    feedType: 'webpage',
    notes: 'GA SOS Professional Licensing Board page for counselors',
    checkFrequencyHours: 72
  },
  // Idaho
  {
    state: 'ID',
    boardName: 'Idaho Bureau of Occupational Licenses - Counselors & Therapists',
    credentialTypes: ['LPC'],
    url: 'https://ibol.idaho.gov/IBOL/BoardPage.aspx?Bureau=COU',
    feedType: 'webpage',
    notes: 'Idaho counselor licensing board page',
    checkFrequencyHours: 168
  },
  // Texas
  {
    state: 'TX',
    boardName: 'Texas Behavioral Health Executive Council',
    credentialTypes: ['LPC'],
    url: 'https://www.bhec.texas.gov/texas-state-board-of-examiners-of-professional-counselors/index.html',
    feedType: 'webpage',
    notes: 'TX BHEC - Professional Counselors board page',
    checkFrequencyHours: 168
  },
  // NBCC (national)
  {
    state: 'US',
    boardName: 'National Board for Certified Counselors',
    credentialTypes: ['NCC', 'BC-TMH', 'CCMHC'],
    url: 'https://www.nbcc.org/news',
    feedType: 'webpage',
    notes: 'NBCC news page - monitor for certification requirement changes',
    checkFrequencyHours: 72
  },
  {
    state: 'US',
    boardName: 'NBCC Continuing Education Requirements',
    credentialTypes: ['NCC'],
    url: 'https://www.nbcc.org/certification/ncc/renewal',
    feedType: 'webpage',
    notes: 'NCC renewal requirements page',
    checkFrequencyHours: 168
  },
  // ACA
  {
    state: 'US',
    boardName: 'American Counseling Association',
    credentialTypes: ['LPC', 'NCC'],
    url: 'https://www.counseling.org/news',
    feedType: 'webpage',
    notes: 'ACA news - legislative and regulatory updates',
    checkFrequencyHours: 72
  }
];

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB\n');

  let created = 0, skipped = 0;

  for (const source of SOURCES) {
    const existing = await BoardSource.findOne({ url: source.url });
    if (existing) {
      console.log(`  SKIP: ${source.state} - ${source.boardName} (already exists)`);
      skipped++;
      continue;
    }

    await BoardSource.create(source);
    console.log(`  ADD:  ${source.state} - ${source.boardName}`);
    created++;
  }

  console.log(`\nDone: ${created} created, ${skipped} skipped`);
  console.log('Board monitor will scan these on its next 6-hour cycle.');
  console.log('To force an immediate scan, restart the Render service.\n');

  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
