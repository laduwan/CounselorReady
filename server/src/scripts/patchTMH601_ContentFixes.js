/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * All rights reserved. Proprietary and confidential.
 * Unauthorized copying or distribution is strictly prohibited.
 */

/**
 * patchTMH601_ContentFixes.js
 * ───────────────────────────
 * Stage 1 of the Mastering TeleMental Health (CR-TMH601) cleanup.
 * CONTENT FIXES ONLY — no aesthetic changes, no new blocks, no rewrites.
 *
 * Fixes applied (idempotent — safe to re-run):
 *  1. Section 2: rebuild the corrupted GA-vs-other-states comparison table
 *  2. Remove redundant <p>**Section N: ...**</p> openers (sectionDivider already shows this)
 *  3. Convert remaining markdown **bold** to proper <strong> / <h3>
 *  4. Strip stray docx page-break stubs (<p>Health Services*</p>, etc.)
 *  5. Unescape \\"  \\'  \\[  \\]  \\$  in content + option text
 *  6. Final assessment: type "multiple_choice" → "multipleChoice" (schema enum compliance)
 *  7. Final assessment: flat string options → canonical [{text, isCorrect}] format
 *  8. Q22 (domestic violence): restore two truncated option strings
 *  9. Q23 (Rule 135-11 consequences): strip leaked instructor note from option D
 * 10. §13 resources block: rename `name` → `title`, fold `description` into title,
 *     add valid `type` values so each resource renders correctly
 *
 * Run:
 *   cd ~/project/src/server
 *   node src/scripts/patchTMH601_ContentFixes.js              # dry run (default — shows diff only)
 *   APPLY=1 node src/scripts/patchTMH601_ContentFixes.js      # write to MongoDB
 *
 * Targets BOTH known TMH slugs (mkkycoyo + clean) since they hold the same
 * content per Ke's confirmation. Whichever exists gets patched.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in env');
  process.exit(1);
}

const APPLY = process.env.APPLY === '1';

const TARGET_SLUGS = [
  'mastering-telemental-health-an-essential-guide-to-a-compliant-virtual-healthcare-practice-in-georgia-mkkycoyo',
  'mastering-telemental-health',
];

// ════════════════════════════════════════════════════════════════════
// FIX 1: Rebuild the corrupted GA-vs-other-states comparison table
// (Section 2, inside the text block that ends with this broken table)
// ════════════════════════════════════════════════════════════════════
const BROKEN_TABLE_MARKER = '<h2>Comparison: Georgia vs. Other States</h2>';
const REBUILT_TABLE_HTML = `<h2>Comparison: Georgia vs. Other States</h2>
<p style="margin-bottom:8px"><em>How Georgia Rule 135-11 stacks up against the typical state framework for telemental health practice.</em></p>
<table style="width:100%;border-collapse:collapse;margin:12px 0;font-size:0.92em">
  <thead>
    <tr style="background:#6B1D34;color:#ffffff">
      <th style="padding:10px 12px;text-align:left;border:1px solid #6B1D34">Requirement</th>
      <th style="padding:10px 12px;text-align:left;border:1px solid #6B1D34">Georgia (Rule 135-11)</th>
      <th style="padding:10px 12px;text-align:left;border:1px solid #6B1D34">Most States</th>
      <th style="padding:10px 12px;text-align:left;border:1px solid #6B1D34">Significance</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding:8px 12px;border:1px solid #e5e5e5;font-weight:600">Telehealth-specific training</td>
      <td style="padding:8px 12px;border:1px solid #e5e5e5">6 hours required before providing services</td>
      <td style="padding:8px 12px;border:1px solid #e5e5e5">No telehealth-specific CE requirement</td>
      <td style="padding:8px 12px;border:1px solid #e5e5e5">Among the strictest in the nation</td>
    </tr>
    <tr style="background:#faf8f3">
      <td style="padding:8px 12px;border:1px solid #e5e5e5;font-weight:600">Training currency</td>
      <td style="padding:8px 12px;border:1px solid #e5e5e5">Must be completed within 5 years preceding practice</td>
      <td style="padding:8px 12px;border:1px solid #e5e5e5">Generic CE hours; no recency rule</td>
      <td style="padding:8px 12px;border:1px solid #e5e5e5">Forces current, applicable knowledge</td>
    </tr>
    <tr>
      <td style="padding:8px 12px;border:1px solid #e5e5e5;font-weight:600">Informed consent format</td>
      <td style="padding:8px 12px;border:1px solid #e5e5e5">Verbal AND written — both documented</td>
      <td style="padding:8px 12px;border:1px solid #e5e5e5">Verbal OR written; some require neither</td>
      <td style="padding:8px 12px;border:1px solid #e5e5e5">Dual-channel evidence of consent</td>
    </tr>
    <tr style="background:#faf8f3">
      <td style="padding:8px 12px;border:1px solid #e5e5e5;font-weight:600">Third-party vendor disclosure</td>
      <td style="padding:8px 12px;border:1px solid #e5e5e5">Required in consent (billing, records, legal)</td>
      <td style="padding:8px 12px;border:1px solid #e5e5e5">Generally not required</td>
      <td style="padding:8px 12px;border:1px solid #e5e5e5">Transparency about data handlers</td>
    </tr>
    <tr>
      <td style="padding:8px 12px;border:1px solid #e5e5e5;font-weight:600">Suitability assessment</td>
      <td style="padding:8px 12px;border:1px solid #e5e5e5">Required per Rule 135-7-.05 instruments</td>
      <td style="padding:8px 12px;border:1px solid #e5e5e5">Clinician discretion</td>
      <td style="padding:8px 12px;border:1px solid #e5e5e5">Standardized screening before TMH starts</td>
    </tr>
    <tr style="background:#faf8f3">
      <td style="padding:8px 12px;border:1px solid #e5e5e5;font-weight:600">Permissible format</td>
      <td style="padding:8px 12px;border:1px solid #e5e5e5">Real-time only — no asynchronous pre-recorded</td>
      <td style="padding:8px 12px;border:1px solid #e5e5e5">Wider range of formats accepted</td>
      <td style="padding:8px 12px;border:1px solid #e5e5e5">Live, interactive sessions only</td>
    </tr>
    <tr>
      <td style="padding:8px 12px;border:1px solid #e5e5e5;font-weight:600">Non-compliance consequence</td>
      <td style="padding:8px 12px;border:1px solid #e5e5e5">Unprofessional conduct under Board Rule 135-7</td>
      <td style="padding:8px 12px;border:1px solid #e5e5e5">Often advisory; varies widely</td>
      <td style="padding:8px 12px;border:1px solid #e5e5e5">Real disciplinary / licensure risk</td>
    </tr>
  </tbody>
</table>`;

// Pattern matching the corrupted block:
//   <h2>Comparison...</h2>
//   <h3>Requirement   Georgia   Most States   Significance</h3>
//   <p>training**  ...</p>  (×7, each containing stray ** word fragments)
const BROKEN_TABLE_PATTERN =
  /<h2>Comparison: Georgia vs\. Other States<\/h2>\s*<h3>Requirement[^<]*<\/h3>(?:\s*<p>[^<]*\*\*[^<]*<\/p>)+/i;

// ════════════════════════════════════════════════════════════════════
// FIX 2-5: Content cleanup helpers
// ════════════════════════════════════════════════════════════════════
function cleanHtmlContent(html) {
  if (typeof html !== 'string') return html;
  let out = html;

  // Remove redundant section-title openers (the sectionDivider already shows these)
  out = out.replace(/<p>\s*\*\*Section\s+\d+:[^*]*\*\*\s*<\/p>\s*/gi, '');

  // Strip the 7 known docx page-break header stubs
  const stubs = [
    'Health Services',
    'Documentation Standards',
    'Environment',
    'Practice',
    'Services',
    'Implementation',
    'Compliance Mandates',
  ];
  stubs.forEach(stub => {
    const re = new RegExp(`<p>\\s*${stub}\\*\\s*<\\/p>\\s*`, 'gi');
    out = out.replace(re, '');
  });

  // <p>**Some Header**</p> → <h3>Some Header</h3>  (paragraph-level bold = heading intent)
  out = out.replace(/<p>\s*\*\*([^*\n<]+?)\*\*\s*<\/p>/g, '<h3>$1</h3>');

  // Inline **bold** → <strong>bold</strong>  (anywhere remaining)
  out = out.replace(/\*\*([^*\n<]+?)\*\*/g, '<strong>$1</strong>');

  // Unescape characters that leaked from a previous quote-escape pass
  out = out.replace(/\\"/g, '"');
  out = out.replace(/\\'/g, "'");
  out = out.replace(/\\\[/g, '[');
  out = out.replace(/\\\]/g, ']');
  out = out.replace(/\\\$/g, '$');

  return out;
}

// Apply the broken-table rebuild (Fix 1) to a single content string if present
function rebuildComparisonTable(html) {
  if (typeof html !== 'string') return html;
  if (!html.includes(BROKEN_TABLE_MARKER)) return html;
  // Already rebuilt? Skip
  if (html.includes('<table style="width:100%;border-collapse:collapse;margin:12px 0;font-size:0.92em">')) {
    return html;
  }
  return html.replace(BROKEN_TABLE_PATTERN, REBUILT_TABLE_HTML);
}

// ════════════════════════════════════════════════════════════════════
// FIX 6-9: Assessment normalization
// ════════════════════════════════════════════════════════════════════

// Known truncated-option / instructor-leak repairs.
// Keyed by a unique substring of the question stem so this is idempotent
// and resilient to question reordering.
const ASSESSMENT_QUESTION_FIXES = [
  {
    matchStem: 'legal principle governing which state',
    optionRepairs: {
      // Correct answer was truncated — students currently see an incomplete sentence on the right answer
      "The state where the client is physically located at the time of the":
        "The state where the client is physically located at the time of the session",
    },
  },
  {
    matchStem: 'client experiencing domestic violence',
    // Replace the two truncated options. Other options pass through unchanged.
    optionRepairs: {
      "Assessing whether the abusive partner monitors the client's":
        "Assessing whether the abusive partner monitors the client's communications, devices, or location",
      "Assessing whether the abusive partner monitors the client":
        "Assessing whether the abusive partner monitors the client's communications, devices, or location",
      "Providing the client with a list of recommended telehealth":
        "Providing the client with a list of recommended telehealth platforms",
    },
  },
  {
    matchStem: 'Failure to comply with Georgia Rule 135-11',
    optionRepairs: {
      // Correct answer was truncated mid-sentence
      "Unprofessional conduct under the Code of Ethics as described in":
        "Unprofessional conduct under Board Rule 135-7, subject to disciplinary action",
      // Strip the leaked instructor-only note that ran into option D
      "A HIPAA violation subject to federal enforcement For clinician/administrator use only. Do not distribute to participants before assessment completion.":
        "A HIPAA violation subject to federal enforcement",
    },
  },
];

const QUESTION_TYPE_MAP = {
  multiple_choice: 'multipleChoice',
  multi_select: 'multiSelect',
  true_false: 'trueFalse',
};

function normalizeAssessmentQuestion(q) {
  if (!q || typeof q !== 'object') return q;
  let out = { ...q };

  // Fix 6: normalize type field
  if (out.type && QUESTION_TYPE_MAP[out.type]) {
    out.type = QUESTION_TYPE_MAP[out.type];
  } else if (!out.type) {
    out.type = 'multipleChoice';
  }

  // Fix 8/9: targeted option repairs (apply BEFORE format conversion so the
  // strings get unescaped/replaced cleanly)
  ASSESSMENT_QUESTION_FIXES.forEach(({ matchStem, optionRepairs }) => {
    if (typeof out.question === 'string' && out.question.includes(matchStem)) {
      out.options = (out.options || []).map(opt => {
        const text = typeof opt === 'string' ? opt : opt.text;
        if (text && optionRepairs[text]) return optionRepairs[text];
        // Try unescaped variant
        const unescaped = typeof text === 'string'
          ? text.replace(/\\'/g, "'").replace(/\\"/g, '"')
          : text;
        if (unescaped && optionRepairs[unescaped]) return optionRepairs[unescaped];
        return opt;
      });
    }
  });

  // Unescape characters in option strings before format conversion
  out.options = (out.options || []).map(opt => {
    if (typeof opt === 'string') {
      return opt.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    }
    if (opt && typeof opt === 'object' && typeof opt.text === 'string') {
      return {
        ...opt,
        text: opt.text.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, '\\'),
      };
    }
    return opt;
  });

  // Unescape explanation too
  if (typeof out.explanation === 'string') {
    out.explanation = out.explanation
      .replace(/\\'/g, "'")
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\');
  }

  // Fix 7: convert flat string options → canonical [{text, isCorrect}]
  if (Array.isArray(out.options) && out.options.length > 0) {
    const allStrings = out.options.every(o => typeof o === 'string');
    if (allStrings) {
      const correctIdx = typeof out.correctAnswer === 'number' ? out.correctAnswer : -1;
      out.options = out.options.map((text, i) => ({
        text,
        isCorrect: i === correctIdx,
      }));
    } else {
      // Already objects — make sure isCorrect is set per correctAnswer index
      const correctIdx = typeof out.correctAnswer === 'number' ? out.correctAnswer : -1;
      out.options = out.options.map((o, i) => {
        if (o && typeof o === 'object' && 'text' in o) {
          if (typeof o.isCorrect !== 'boolean') {
            return { ...o, isCorrect: i === correctIdx };
          }
          return o;
        }
        // Mixed types — fall back to canonical
        return { text: String(o), isCorrect: i === correctIdx };
      });
    }
  }

  return out;
}

// ════════════════════════════════════════════════════════════════════
// FIX 10: §13 resources block field mapping
// ════════════════════════════════════════════════════════════════════
// Existing block uses {name, description, url} but the viewer reads
// {title, url, type}. Fold description into title, set valid type.
const RESOURCE_TYPE_HINTS = {
  'cce': 'organization',
  'ata': 'organization',
  'tci': 'organization',
  'ctibs': 'organization',
  'samhsa': 'organization',
  'georgia composite': 'organization',
  'galpca': 'organization',
  'center for connected': 'organization',
};

function repairResourceItem(r) {
  if (!r || typeof r !== 'object') return r;
  // Already in canonical shape — leave it
  if (typeof r.title === 'string' && r.title.trim().length > 0) {
    return r;
  }

  const name = (r.name || '').trim();
  const desc = (r.description || '').trim();
  let title = name;
  if (name && desc) title = `${name} — ${desc}`;
  else if (desc && !name) title = desc;

  const hintKey = Object.keys(RESOURCE_TYPE_HINTS).find(k =>
    (name + ' ' + desc).toLowerCase().includes(k)
  );
  const type = r.type || (hintKey ? RESOURCE_TYPE_HINTS[hintKey] : 'website');

  return { title, url: r.url || '#', type };
}

// ════════════════════════════════════════════════════════════════════
// MAIN — walk sections, apply fixes, write back
// ════════════════════════════════════════════════════════════════════

function applyFixesToCourse(course) {
  const changes = [];
  const sections = Array.isArray(course.sections) ? course.sections : [];

  sections.forEach((section, si) => {
    const blocks = Array.isArray(section.contentBlocks) ? section.contentBlocks : [];
    blocks.forEach((block, bi) => {
      const path = `sections[${si}].contentBlocks[${bi}] (${block.type})`;

      // text / imageText / accordion content cleanup
      if (block.type === 'text' || block.type === 'imageText') {
        const before = block.content || block.textContent || '';
        let after = before;
        after = rebuildComparisonTable(after);
        after = cleanHtmlContent(after);
        if (after !== before) {
          if (block.content !== undefined) block.content = after;
          if (block.textContent !== undefined) block.textContent = after;
          if (block.content === undefined && block.textContent === undefined) {
            block.content = after;
          }
          changes.push({
            path,
            kind: 'content cleanup',
            beforeLen: before.length,
            afterLen: after.length,
            preview: diffPreview(before, after),
          });
        }
      }

      // accordion items content cleanup
      if (block.type === 'accordion' && Array.isArray(block.accordionItems)) {
        block.accordionItems.forEach((item, ii) => {
          const before = item.content || '';
          const after = cleanHtmlContent(before);
          if (after !== before) {
            item.content = after;
            changes.push({
              path: `${path}.accordionItems[${ii}]`,
              kind: 'accordion content cleanup',
              beforeLen: before.length,
              afterLen: after.length,
            });
          }
        });
      }

      // in-section multipleChoice / multiSelect explanation cleanup
      if (
        (block.type === 'multipleChoice' || block.type === 'multiSelect') &&
        typeof block.explanation === 'string'
      ) {
        const before = block.explanation;
        const after = cleanHtmlContent(before);
        if (after !== before) {
          block.explanation = after;
          changes.push({ path: `${path}.explanation`, kind: 'explanation unescape' });
        }
      }

      // §13 resources block repair
      if (
        (block.type === 'resources' || block.type === 'deliverables') &&
        Array.isArray(block.resources)
      ) {
        let touched = false;
        block.resources = block.resources.map(r => {
          const repaired = repairResourceItem(r);
          if (
            r.title !== repaired.title ||
            r.type !== repaired.type ||
            r.name ||
            r.description
          ) {
            touched = true;
            // Strip the deprecated fields to keep the doc clean
            const { name, description, ...rest } = repaired;
            return rest;
          }
          return r;
        });
        if (touched) {
          changes.push({
            path,
            kind: 'resources field rename (name+description → title)',
            count: block.resources.length,
          });
        }
      }
    });
  });

  // Assessment normalization
  if (course.assessment && Array.isArray(course.assessment.questions)) {
    const before = JSON.stringify(course.assessment.questions);
    course.assessment.questions = course.assessment.questions.map(
      normalizeAssessmentQuestion
    );
    const after = JSON.stringify(course.assessment.questions);
    if (after !== before) {
      changes.push({
        path: 'assessment.questions',
        kind: 'normalize (type → camelCase + options → canonical + repair truncations)',
        count: course.assessment.questions.length,
      });
    }
  }

  return { course, changes };
}

function diffPreview(before, after) {
  // Show first divergence point (helps audit)
  if (before === after) return null;
  let i = 0;
  while (i < before.length && i < after.length && before[i] === after[i]) i++;
  const start = Math.max(0, i - 40);
  return {
    before: before.slice(start, i + 80).replace(/\s+/g, ' '),
    after: after.slice(start, i + 80).replace(/\s+/g, ' '),
  };
}

// ════════════════════════════════════════════════════════════════════
async function main() {
  console.log('═'.repeat(64));
  console.log('  CR-TMH601 Stage 1 — CONTENT FIXES');
  console.log('  Mode:', APPLY ? 'APPLY (will write to MongoDB)' : 'DRY RUN (no writes)');
  console.log('═'.repeat(64));

  await mongoose.connect(MONGODB_URI);
  console.log('✓ Connected to MongoDB');
  const db = mongoose.connection.db;
  const collection = db.collection('interactivecourses');

  for (const slug of TARGET_SLUGS) {
    console.log(`\n── slug: ${slug}`);
    const course = await collection.findOne({ slug });
    if (!course) {
      console.log('  (not found — skipping)');
      continue;
    }
    console.log(`  Found: "${course.title}" (${course.sections?.length || 0} sections, ${course.assessment?.questions?.length || 0} assessment Qs)`);

    const { course: patched, changes } = applyFixesToCourse(course);

    if (changes.length === 0) {
      console.log('  ✓ Nothing to fix — already clean.');
      continue;
    }

    console.log(`  ${changes.length} change(s):`);
    changes.forEach((c, i) => {
      const tag = `    ${String(i + 1).padStart(2, ' ')}.`;
      if (c.kind.includes('content') && c.preview) {
        console.log(`${tag} ${c.path}: ${c.kind}  [${c.beforeLen}→${c.afterLen} chars]`);
        if (c.preview && c.preview.before !== c.preview.after) {
          console.log(`        before: ${c.preview.before}`);
          console.log(`        after : ${c.preview.after}`);
        }
      } else {
        console.log(`${tag} ${c.path}: ${c.kind}${c.count ? ` (${c.count} item${c.count === 1 ? '' : 's'})` : ''}`);
      }
    });

    if (!APPLY) {
      console.log('  (dry run — no write performed)');
      continue;
    }

    const result = await collection.updateOne(
      { slug },
      {
        $set: {
          sections: patched.sections,
          assessment: patched.assessment,
          updatedAt: new Date(),
        },
      }
    );
    console.log(`  ✓ Written. matched=${result.matchedCount} modified=${result.modifiedCount}`);

    // Verify by re-reading
    const verify = await collection.findOne({ slug }, { projection: { 'sections': 1, 'assessment.questions': 1 } });
    const stillBroken = JSON.stringify(verify).includes('multiple_choice');
    console.log(`  Verification: assessment type field is${stillBroken ? ' STILL BROKEN' : ' clean'}`);
  }

  await mongoose.disconnect();
  console.log('\n✓ Done.');
}

main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
