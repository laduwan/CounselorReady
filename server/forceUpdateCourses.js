/**
 * forceUpdateCourses.js
 * 
 * Runs the update scripts as child processes with process.exit patched out,
 * then verifies the writes actually persisted.
 * 
 * Usage: node forceUpdateCourses.js
 */
import { execSync } from 'child_process';
import { readFileSync, writeFileSync, unlinkSync } from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const scripts = [
  { file: 'src/scripts/updateNeurobiologyCourse.js', slug: 'neurobiology-of-trauma', name: 'Neurobiology' },
  { file: 'src/scripts/updateTraumaInformedCareCourse.js', slug: 'trauma-informed-care', name: 'Trauma-Informed Care' },
];

for (const s of scripts) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`  ${s.name}`);
  console.log(`${'='.repeat(60)}`);

  // Read script, patch ALL process.exit calls
  let code = readFileSync(s.file, 'utf-8');
  code = code.replace(/process\.exit\(\d+\)/g, 'await mongoose.disconnect()');
  
  // Write patched version
  const tmp = `/tmp/patched_${s.slug}.mjs`;
  writeFileSync(tmp, code);

  // Get before state
  await mongoose.connect(process.env.MONGODB_URI);
  const c = mongoose.connection.db.collection('interactivecourses');
  const before = await c.findOne({ slug: s.slug });
  const beforeWords = before?.wordCount || 0;
  const beforeSections = before?.sections?.length || 0;
  console.log(`  Before: ${beforeSections} sections, ${beforeWords} cached words`);
  await mongoose.disconnect();

  // Run patched script
  try {
    console.log(`  Running patched script...`);
    const output = execSync(`node ${tmp}`, {
      cwd: process.cwd(),
      timeout: 120000,
      encoding: 'utf-8',
      env: process.env
    });
    output.split('\n').forEach(line => {
      if (line.trim()) console.log(`  | ${line}`);
    });
  } catch (err) {
    console.log(`  Script error: ${err.message}`);
    if (err.stdout) err.stdout.split('\n').forEach(l => l.trim() && console.log(`  | ${l}`));
  }

  // Verify
  await mongoose.connect(process.env.MONGODB_URI);
  const c2 = mongoose.connection.db.collection('interactivecourses');
  const after = await c2.findOne({ slug: s.slug });
  
  let words = 0;
  (after?.sections || []).forEach(sec => {
    (sec.contentBlocks || []).forEach(b => {
      const txt = b.textContent || b.content || b.html || b.body || '';
      words += txt.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().split(/\s+/).filter(x => x).length;
    });
  });

  let blocks = 0;
  (after?.sections || []).forEach(sec => { blocks += (sec.contentBlocks || []).length; });
  
  console.log(`  After: ${after?.sections?.length || 0} sections, ${blocks} blocks, ${words} words`);
  
  if (words > beforeWords + 1000) {
    console.log(`  ✅ SUCCESS — ${beforeWords} → ${words} words`);
    await c2.updateOne({ slug: s.slug }, { $set: { wordCount: words } });
  } else {
    console.log(`  ❌ STILL FAILED — words didn't increase (${beforeWords} → ${words})`);
  }
  
  await mongoose.disconnect();
  
  // Cleanup
  try { unlinkSync(tmp); } catch {}
}

console.log('\nDone.');
