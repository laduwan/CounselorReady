// reconcileDuplicates.js
// Reconciles duplicate interactivecourses documents in four parts.
// DRY RUN by default — pass --execute to write changes.
// Run: node reconcileDuplicates.js [--execute]
// Requires: MONGODB_URI environment variable

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const EXECUTE = process.argv.includes('--execute');

// ── Part 1: Transfer code from draft to published keeper, delete draft ──────
const transfers = [
  { keepSlug: '28-days-later-understanding-addiction-and-recovery',                                     deleteSlug: '28-days-later-addiction-recovery',                               code: 'CR-301' },
  { keepSlug: 'ethics-and-professional-boundaries-in-counseling-practice',                              deleteSlug: 'ethics-professional-boundaries-counseling-practice',             code: 'CR-201' },
  { keepSlug: 'it-takes-a-village-collaborative-care',                                                  deleteSlug: 'it-takes-a-village-consultation-referral',                      code: 'CR-404' },
  { keepSlug: 'when-it-rains-it-pours-treating-clients-with-multiple-stressors-and-comorbidities',     deleteSlug: 'when-it-rains-it-pours-multiple-stressors',                     code: 'CR-403' },
  { keepSlug: 'motivational-interviewing-from-ambivalence-to-action',                                   deleteSlug: 'motivational-interviewing-ambivalence-to-action',               code: 'CR-302' },
  { keepSlug: 'lost-in-translation-bridging-cultural-divides',                                          deleteSlug: 'lost-in-translation-cultural-divides',                          code: 'CR-303' },
  { keepSlug: 'the-pursuit-of-happyness-treating-anxiety-and-depression',                               deleteSlug: 'pursuit-of-happyness-anxiety-depression',                       code: 'CR-PHY' },
  { keepSlug: 'cultural-competence-ethics-risk-reduction-cr601',                                        deleteSlug: 'foundations-cultural-competence-ethics-risk-reduction',         code: 'CR-601' },
];

// ── Part 2: Delete codeless draft (keeper already has courseCode) ────────────
const codelessDraftContains = 'final-chapter-end-of-life';

// ── Part 3: Swap code to better version, delete worse ───────────────────────
const swaps = [
  { betterSlug: 'long-goodbye-dementia-grief-family-systems',              worseSlug: 'the-long-goodbye-dementia-grief',                             code: 'CR-611' },
  { betterSlug: 'seasoned-struggling-substance-use-disorders-older-adults', worseSlug: 'seasoned-and-struggling-substance-use-disorders-older-adults', code: 'CR-613' },
];

function label(doc) {
  return `"${(doc.title || '').slice(0, 60)}" (wordCount: ${doc.wordCount ?? 'n/a'})`;
}

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.collection('interactivecourses');

  console.log(`\nMode: ${EXECUTE ? 'EXECUTE' : 'DRY RUN (pass --execute to write)'}\n`);

  let codesTransferred = 0;
  let docsDeleted = 0;
  let errors = 0;

  // ── PART 1 ────────────────────────────────────────────────────────────────
  console.log('── PART 1: Transfer code + delete draft ──────────────────────────────────\n');

  for (const { keepSlug, deleteSlug, code } of transfers) {
    const keeper = await col.findOne({ slug: keepSlug });
    const draft  = await col.findOne({ slug: deleteSlug });

    if (!keeper) {
      console.log(`  ERROR  keeper not found: ${keepSlug}`);
      errors++;
    } else {
      const action = EXECUTE ? 'SET    ' : 'WOULD SET';
      console.log(`  ${action} courseCode ${code} on keeper: ${label(keeper)}`);
      if (EXECUTE) await col.updateOne({ _id: keeper._id }, { $set: { courseCode: code } });
      codesTransferred++;
    }

    if (!draft) {
      console.log(`  ERROR  draft not found:  ${deleteSlug}`);
      errors++;
    } else {
      console.log(`  Verify draft to delete:  ${label(draft)}`);
      const action = EXECUTE ? 'DELETED' : 'WOULD DELETE';
      console.log(`  ${action} draft: ${deleteSlug}`);
      if (EXECUTE) await col.deleteOne({ _id: draft._id });
      docsDeleted++;
    }

    console.log('');
  }

  // ── PART 2 ────────────────────────────────────────────────────────────────
  console.log('── PART 2: Delete codeless draft (final-chapter-end-of-life) ───────────\n');

  const codelessDraft = await col.findOne({
    slug: { $regex: codelessDraftContains, $options: 'i' },
    courseCode: { $in: [null, undefined, ''] },
  });

  if (!codelessDraft) {
    console.log('  ERROR  codeless draft not found (slug containing: ' + codelessDraftContains + ')');
    errors++;
  } else {
    console.log(`  Verify doc to delete: ${label(codelessDraft)} slug: ${codelessDraft.slug}`);
    const action = EXECUTE ? 'DELETED' : 'WOULD DELETE';
    console.log(`  ${action} codeless draft`);
    if (EXECUTE) await col.deleteOne({ _id: codelessDraft._id });
    docsDeleted++;
  }

  console.log('');

  // ── PART 3 ────────────────────────────────────────────────────────────────
  console.log('── PART 3: Swap code to better version, delete worse ─────────────────────\n');

  for (const { betterSlug, worseSlug, code } of swaps) {
    const better = await col.findOne({ slug: betterSlug });
    const worse  = await col.findOne({ slug: worseSlug });

    if (!better) {
      console.log(`  ERROR  better not found: ${betterSlug}`);
      errors++;
    } else {
      const action = EXECUTE ? 'SET    ' : 'WOULD SET';
      console.log(`  ${action} courseCode ${code} on better: ${label(better)}`);
      if (EXECUTE) await col.updateOne({ _id: better._id }, { $set: { courseCode: code } });
      codesTransferred++;
    }

    if (!worse) {
      console.log(`  ERROR  worse not found:  ${worseSlug}`);
      errors++;
    } else {
      console.log(`  Verify worse to delete: ${label(worse)}`);
      const action = EXECUTE ? 'UNSET code + DELETED' : 'WOULD UNSET code + DELETE';
      console.log(`  ${action}: ${worseSlug}`);
      if (EXECUTE) {
        await col.updateOne({ _id: worse._id }, { $unset: { courseCode: '' } });
        await col.deleteOne({ _id: worse._id });
      }
      docsDeleted++;
    }

    console.log('');
  }

  // ── PART 4: Assign new codes to collision losers ──────────────────────────
  console.log('── PART 4: Assigning new codes ────────────────────────────────────────────\n');
  const reassignments = [
    { slug: 'beyond-the-uniform-first-responder-families', code: 'CR-307' },
    { slug: 'small-warriors-big-battles-parental-incarceration', code: 'CR-308' },
    { slug: 'racial-trauma-affirming-practice', code: 'CR-309' },
    { slug: 'cultural-humility-in-counseling-practice', code: 'CR-310' },
  ];
  for (const r of reassignments) {
    const taken = await col.findOne({ courseCode: r.code });
    if (taken != null && taken.slug !== r.slug) {
      console.log(`  ERROR  code ${r.code} already taken by a different doc`);
      errors++;
      continue;
    }
    const doc = await col.findOne({ slug: r.slug });
    if (!doc) {
      console.log(`  ERROR  doc not found: ${r.slug}`);
      errors++;
      continue;
    }
    const action = EXECUTE ? 'SET    ' : 'WOULD SET';
    console.log(`  ${action} courseCode ${r.code} on: ${label(doc)}`);
    if (EXECUTE) await col.updateOne({ _id: doc._id }, { $set: { courseCode: r.code } });
    codesTransferred++;
    console.log('');
  }

  const chCopy = await col.findOne({ slug: 'cultural-humility-in-counseling-practice-copy' });
  if (!chCopy) {
    console.log('  NOTE   cultural-humility copy not found (nothing to delete)');
  } else {
    console.log(`  Verify doc to delete: ${label(chCopy)} slug: ${chCopy.slug}`);
    const action = EXECUTE ? 'DELETED' : 'WOULD DELETE';
    console.log(`  ${action} cultural-humility copy`);
    if (EXECUTE) await col.deleteOne({ _id: chCopy._id });
    docsDeleted++;
  }

  console.log('');

  // ── SUMMARY ───────────────────────────────────────────────────────────────
  console.log('── Summary ───────────────────────────────────────────────────────────────');
  console.log(`  Codes ${EXECUTE ? 'transferred' : 'to transfer'} : ${codesTransferred}`);
  console.log(`  Docs ${EXECUTE ? 'deleted' : 'to delete'}     : ${docsDeleted}`);
  console.log(`  Errors              : ${errors}`);

  await mongoose.disconnect();
}

run().catch(e => { console.error(e); process.exit(1); });
