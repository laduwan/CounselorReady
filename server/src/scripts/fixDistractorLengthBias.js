/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
if (!MONGODB_URI) { console.error('No MONGODB_URI'); process.exit(1); }
if (!ANTHROPIC_API_KEY) { console.error('No ANTHROPIC_API_KEY'); process.exit(1); }

// ═══════════════════════════════════════════════════════════════════
// FIX DISTRACTOR LENGTH BIAS — ALL COURSES
//
// Problem: Correct answer is the longest option in 60-100% of
// questions across the platform. Test-savvy learners can guess
// correctly by picking the longest option without reading.
//
// Fix: For each MC question where the correct answer is longest,
// expand ONE incorrect option using Claude API to add clinically
// plausible qualifying text, making it as long or longer than
// the correct answer. The expanded text remains clearly wrong
// but removes the length cue.
//
// Usage:
//   DRY RUN + REPORT:  node src/scripts/fixDistractorLengthBias.js
//   APPLY FIXES:       node src/scripts/fixDistractorLengthBias.js --apply
//   SINGLE COURSE:     node src/scripts/fixDistractorLengthBias.js --slug=existential-theory-in-clinical-practice --apply
//   RESUME FROM:       node src/scripts/fixDistractorLengthBias.js --apply --resume-from=CR-416
//
// Safety:
//   - Uses updateOne/$set with surgical paths — no full-document rewrites
//   - Logs every change with before/after text
//   - Skips True/False and multiSelect questions
//   - Rate-limits Claude API calls (2s between batches)
//   - Read-back verifies each course after update
// ═══════════════════════════════════════════════════════════════════

const DRY_RUN = !process.argv.includes('--apply');
const SLUG_FILTER = process.argv.find(a => a.startsWith('--slug='))?.split('=')[1];
const RESUME_FROM = process.argv.find(a => a.startsWith('--resume-from='))?.split('=')[1];
const BATCH_SIZE = 15; // questions per Claude API call
const API_DELAY_MS = 2000;

async function callClaude(questions) {
  const prompt = `You are editing CE course quiz questions for licensed mental health professionals. For each question below, the correct answer (marked ✓) is currently the longest option — a test design flaw.

For each question, expand exactly ONE incorrect option so it becomes at least as long as the correct answer. Rules:
- Keep the expanded option clinically plausible-sounding but clearly WRONG
- Add qualifying detail that sounds professional (e.g., "particularly in acute care settings" or "as documented in longitudinal outcome research") but doesn't change the option's incorrectness
- Don't make the expanded option look MORE correct — just longer
- Pick the incorrect option that's easiest to expand naturally (usually the second-longest one)
- The new text should read as a single natural phrase, not an obvious append

Respond ONLY with valid JSON array — no markdown fences, no preamble, no explanation.
Format: [{"qIdx": 0, "optIdx": 2, "newText": "full expanded option text"}]

Questions:
${JSON.stringify(questions.map((q, i) => ({
  qIdx: i,
  question: q.question?.substring(0, 120),
  options: q.options.map((o, j) => ({
    idx: j,
    text: o.text,
    correct: o.isCorrect ? '✓' : '',
    chars: (o.text || '').length
  }))
})), null, 2)}`;

  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!resp.ok) {
    const errText = await resp.text();
    console.error(`  API error ${resp.status}: ${errText.substring(0, 200)}`);
    return [];
  }

  const data = await resp.json();
  if (!data.content?.[0]?.text) {
    console.error('  Empty API response');
    return [];
  }

  const text = data.content[0].text.replace(/```json|```/g, '').trim();
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error('  JSON parse error:', e.message, '\n  Raw:', text.substring(0, 300));
    return [];
  }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;
  const col = db.collection('interactivecourses');

  // Get all courses sorted by bias severity
  const filter = SLUG_FILTER ? { slug: SLUG_FILTER } : {};
  const courses = await col.find(filter, {
    projection: {
      title: 1, slug: 1, courseCode: 1, status: 1,
      'sections.title': 1, 'sections.contentBlocks.type': 1,
      'sections.contentBlocks.question': 1,
      'sections.contentBlocks.options': 1,
      'assessment.questions.question': 1,
      'assessment.questions.options': 1,
      'assessment.questions.type': 1
    }
  }).sort({ title: 1 }).toArray();

  console.log(`\n${DRY_RUN ? '🔍 DRY RUN' : '⚡ APPLYING'} — Distractor Length Bias Fix`);
  console.log(`Courses: ${courses.length}\n`);

  let totalCourses = 0;
  let totalFixed = 0;
  let totalSkipped = 0;
  let resuming = !!RESUME_FROM;

  for (const course of courses) {
    if (resuming) {
      if (course.courseCode === RESUME_FROM || course.slug === RESUME_FROM) {
        resuming = false;
      } else {
        continue;
      }
    }

    const code = course.courseCode || course.slug;

    // Collect all MC questions with their DB paths
    const allQs = [];

    // Section KCs
    (course.sections || []).forEach((sec, si) => {
      (sec.contentBlocks || []).forEach((block, bi) => {
        if (block.type !== 'multipleChoice') return;
        if (!block.options || block.options.length < 3) return;
        // Skip if options look like True/False
        if (block.options.length === 2) return;

        const lens = block.options.map(o => (typeof o === 'object' ? o.text || '' : String(o)).length);
        const correctIdx = block.options.findIndex(o => typeof o === 'object' && o.isCorrect);
        if (correctIdx < 0) return;
        const maxLen = Math.max(...lens);
        if (lens[correctIdx] !== maxLen) return; // correct is NOT longest — skip

        allQs.push({
          pathPrefix: `sections.${si}.contentBlocks.${bi}`,
          question: block.question,
          options: block.options.map(o => ({ text: typeof o === 'object' ? o.text : String(o), isCorrect: typeof o === 'object' ? !!o.isCorrect : false })),
          location: `S${si} B${bi}`
        });
      });
    });

    // Assessment questions
    (course.assessment?.questions || []).forEach((q, qi) => {
      if (!q.options || q.options.length < 3) return;
      // Skip multiSelect (multiple isCorrect)
      const correctCount = q.options.filter(o => o.isCorrect).length;
      if (correctCount !== 1) return;

      const lens = q.options.map(o => (o.text || '').length);
      const correctIdx = q.options.findIndex(o => o.isCorrect);
      if (correctIdx < 0) return;
      const maxLen = Math.max(...lens);
      if (lens[correctIdx] !== maxLen) return;

      allQs.push({
        pathPrefix: `assessment.questions.${qi}`,
        question: q.question,
        options: q.options.map(o => ({ text: o.text || '', isCorrect: !!o.isCorrect })),
        location: `Assess Q${qi + 1}`
      });
    });

    if (allQs.length === 0) {
      totalSkipped++;
      continue;
    }

    totalCourses++;
    console.log(`\n${'═'.repeat(70)}`);
    console.log(`${code} — ${course.title}`);
    console.log(`Status: ${course.status} | Questions needing fix: ${allQs.length}`);
    console.log(`${'═'.repeat(70)}`);

    // Process in batches
    const allFixes = [];
    for (let i = 0; i < allQs.length; i += BATCH_SIZE) {
      const batch = allQs.slice(i, i + BATCH_SIZE);
      console.log(`  Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batch.length} questions...`);

      if (!DRY_RUN) {
        const fixes = await callClaude(batch);

        for (const fix of fixes) {
          const q = batch[fix.qIdx];
          if (!q) continue;
          if (fix.optIdx === undefined || !fix.newText) continue;
          // Safety: never modify the correct answer
          if (q.options[fix.optIdx]?.isCorrect) {
            console.log(`  ⚠️  Skipping fix that targets correct answer (${q.location})`);
            continue;
          }
          allFixes.push({
            path: `${q.pathPrefix}.options.${fix.optIdx}.text`,
            oldText: q.options[fix.optIdx].text,
            newText: fix.newText,
            location: q.location
          });
        }

        if (i + BATCH_SIZE < allQs.length) {
          await sleep(API_DELAY_MS);
        }
      } else {
        // Dry run: just log what would be fixed
        batch.forEach(q => {
          const lens = q.options.map(o => o.text.length);
          const correctIdx = q.options.findIndex(o => o.isCorrect);
          const correctLen = lens[correctIdx];
          const longestIncorrect = Math.max(...lens.filter((_, i) => i !== correctIdx));
          console.log(`    ${q.location}: correct=${String.fromCharCode(65 + correctIdx)} (${correctLen}ch) vs longest-wrong (${longestIncorrect}ch) gap=${correctLen - longestIncorrect}ch`);
        });
      }
    }

    // Apply all fixes for this course in one update
    if (!DRY_RUN && allFixes.length > 0) {
      const $set = {};
      for (const fix of allFixes) {
        $set[fix.path] = fix.newText;
        console.log(`  ✏️  ${fix.location}: "${fix.oldText.substring(0, 40)}..." → "${fix.newText.substring(0, 50)}..."`);
      }

      await col.updateOne({ _id: course._id }, { $set });
      totalFixed += allFixes.length;
      console.log(`  ✅ Applied ${allFixes.length} distractor expansions`);

      // Read-back verify: re-check bias percentage
      const verify = await col.findOne({ _id: course._id }, {
        projection: {
          'sections.contentBlocks.type': 1, 'sections.contentBlocks.options': 1,
          'assessment.questions.options': 1
        }
      });
      let vTotal = 0, vBiased = 0;
      (verify.sections || []).forEach(sec => {
        (sec.contentBlocks || []).forEach(b => {
          if (b.type !== 'multipleChoice' || !b.options || b.options.length < 3) return;
          const ci = b.options.findIndex(o => o.isCorrect);
          if (ci < 0) return;
          vTotal++;
          const lens = b.options.map(o => (o.text || '').length);
          if (lens[ci] === Math.max(...lens)) vBiased++;
        });
      });
      (verify.assessment?.questions || []).forEach(q => {
        if (!q.options || q.options.length < 3) return;
        const cc = q.options.filter(o => o.isCorrect).length;
        if (cc !== 1) return;
        const ci = q.options.findIndex(o => o.isCorrect);
        vTotal++;
        const lens = q.options.map(o => (o.text || '').length);
        if (lens[ci] === Math.max(...lens)) vBiased++;
      });
      const newPct = vTotal > 0 ? Math.round(vBiased / vTotal * 100) : 0;
      console.log(`  📊 Bias after fix: ${vBiased}/${vTotal} (${newPct}%)`);
    }
  }

  // Summary
  console.log(`\n${'═'.repeat(70)}`);
  console.log('SUMMARY');
  console.log(`${'═'.repeat(70)}`);
  console.log(`Courses processed: ${totalCourses}`);
  console.log(`Courses skipped (no bias): ${totalSkipped}`);
  console.log(`Total distractors expanded: ${totalFixed}`);
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN — run with --apply to fix' : 'APPLIED'}`);

  if (DRY_RUN) {
    console.log(`\n👉 Apply: node src/scripts/fixDistractorLengthBias.js --apply`);
    console.log(`👉 Test one: node src/scripts/fixDistractorLengthBias.js --slug=existential-theory-in-clinical-practice --apply`);
  }

  await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
