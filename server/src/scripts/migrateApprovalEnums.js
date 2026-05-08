import mongoose from 'mongoose';

const DRY = process.argv.includes('--dry') || process.argv.includes('--dry-run');

const BODY_MAP = {
  'GCSCW':         'GSCSW',
  'GA-LPC':        'LPCAGA',
  'GA-LPC-Board':  'LPCAGA',
  'LCSW':          'GSCSW',
  'GA-LCSW-Board': 'GSCSW',
  'LMFT-Board':    'Other',
};

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) { console.error('MONGODB_URI not set'); process.exit(1); }
  await mongoose.connect(uri);
  const C = mongoose.connection.collection('interactivecourses');

  const courses = await C.find({}).toArray();
  console.log(`Scanned ${courses.length} courses\n`);

  let fixed = 0, manualReview = [];

  for (const c of courses) {
    if (!Array.isArray(c.approvals) || c.approvals.length === 0) continue;

    let touched = false;
    const next = c.approvals.map((a) => {
      const out = { ...a };

      if (out.body && BODY_MAP[out.body]) {
        console.log(`  ${c.title}: body "${out.body}" -> "${BODY_MAP[out.body]}"`);
        if (out.body === 'LMFT-Board') manualReview.push(c.title);
        out.body = BODY_MAP[out.body];
        touched = true;
      }

      const hasLegacyHours = ('coreHours' in out) || ('ethicHours' in out);
      const hasNewHours = Array.isArray(out.hourBreakdown) && out.hourBreakdown.length > 0;
      if (hasLegacyHours && !hasNewHours) {
        const hb = [];
        if (Number(out.coreHours)  > 0) hb.push({ label: 'core',   hours: Number(out.coreHours) });
        if (Number(out.ethicHours) > 0) hb.push({ label: 'ethics', hours: Number(out.ethicHours) });
        if (hb.length > 0) {
          out.hourBreakdown = hb;
          console.log(`  ${c.title}: built hourBreakdown ${JSON.stringify(hb)}`);
          touched = true;
        }
      }

      if ('coreHours'  in out) { delete out.coreHours;  touched = true; }
      if ('ethicHours' in out) { delete out.ethicHours; touched = true; }

      return out;
    });

    if (touched) {
      if (!DRY) {
        await C.updateOne({ _id: c._id }, { $set: { approvals: next } });
      }
      fixed++;
    }
  }

  console.log('\n===============================');
  console.log(`Fixed:         ${fixed} courses`);
  console.log(`Manual review: ${manualReview.length} (LMFT-Board -> Other)`);
  if (manualReview.length) manualReview.forEach(t => console.log(`   - ${t}`));
  if (DRY) console.log('\n(DRY RUN - nothing was written)');
  console.log('===============================\n');

  await mongoose.disconnect();
}

main().catch(err => { console.error('FAIL:', err); process.exit(1); });
