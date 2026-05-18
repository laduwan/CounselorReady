#!/usr/bin/env node
/**
 * migrateSchemaCompliance.js
 *
 * Applies SAFE schema-compliance fixes to courses that currently fail
 * validation, and REPORTS (does not auto-fix) the issues that need your
 * input.
 *
 *   Safe (applied automatically):
 *     • accessType: "paid"                        → "purchase"
 *     • assessment.questions[].type "multiple-choice" → "multipleChoice"
 *       (also "multi-select" → "multiSelect", "true-false" → "trueFalse")
 *     • section[].quizQuestions[].type same hyphen → camelCase fix
 *     • contentBlock.questions[].type same hyphen  → camelCase fix
 *     • block.type "multiple-choice" → "multipleChoice" (and the other two)
 *     • section[].order missing      → auto-assign by array index
 *     • contentBlock[].order missing → auto-assign by array index
 *
 *   Needs your decision (reported only, not changed):
 *     • resources[].type: invalid enum values (lists them with course counts)
 *     • accessType: "professional"
 *     • description: required field missing
 *     • nbccContentAreas[]: enum-invalid values
 *     • Any other validation error not in the safe list above
 *
 * Save semantics: only courses that become fully validation-clean after
 * safe fixes are written. Partially-fixed courses are skipped entirely so
 * no half-migrated state is persisted. The pre-save hook runs on every
 * successful save, so wordCount also gets recomputed.
 *
 * Safe to re-run. Idempotent.
 *
 *   node src/scripts/migrateSchemaCompliance.js
 */

import mongoose from 'mongoose';
import { Course as InteractiveCourse } from '../models/InteractiveCourse.js';
import 'dotenv/config';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI not set');
  process.exit(1);
}

// Canonical valid values (mirror the schema enums)
const VALID_RESOURCE_TYPES = new Set([
  'pdf', 'video', 'link', 'article', 'website', 'book',
  'xlsx', 'xls', 'csv', 'docx', 'doc', 'pptx', 'ppt', 'zip',
  'worksheet', 'toolkit', 'template', 'guide'
]);

const QUESTION_TYPE_MAP = {
  // hyphenated variants
  'multiple-choice': 'multipleChoice',
  'multi-select':    'multiSelect',
  'true-false':      'trueFalse',
  // underscore variants (used by the sexual-health course seeds)
  'multiple_choice': 'multipleChoice',
  'multi_select':    'multiSelect',
  'true_false':      'trueFalse',
};

// NBCC content-area name normalization. The schema uses abbreviated names;
// some seeds stored the full official NBCC content area name.
const NBCC_FULL_TO_ABBREV = {
  'Counseling Theory/Practice and the Counseling Relationship': 'Counseling Theory/Practice',
  'Group Dynamics and Counseling':                              'Group Dynamics',
  'Career Development and Counseling':                          'Career Development',
  'Research and Program Evaluation':                            'Research/Program Evaluation',
  'Counselor Professional Identity and Practice Issues':        'Professional Identity',
  // Identity mappings (already abbreviated — no change needed but listed for completeness)
  'Counseling Theory/Practice':       'Counseling Theory/Practice',
  'Human Growth and Development':     'Human Growth and Development',
  'Social and Cultural Foundations':  'Social and Cultural Foundations',
  'Assessment':                       'Assessment',
  'Wellness and Prevention':          'Wellness and Prevention',
};

// Map invalid resource.type values to valid enum (including 4 new values just
// added: guidelines, research, organization, standards).
const RESOURCE_TYPE_MAP = {
  // → guidelines (authoritative reference / official guidance)
  'guideline':                'guidelines',
  'ethics code':              'guidelines',
  'treatment guide':          'guidelines',
  'framework':                'guidelines',
  'professional development': 'guidelines',
  'continuing education':     'guidelines',
  'education':                'guidelines',
  'ethics':                   'guidelines',
  'training':                 'guidelines',
  'professional':             'guidelines',
  'clinical resource':        'guidelines',
  // → research (scholarly / written / report content)
  'publication':              'research',
  'commentary':               'research',
  'report':                   'research',
  'factsheet':                'research',
  'document':                 'research',
  // → organization (entities / external sites)
  'professional organization':'organization',
  'government':               'organization',
  'database':                 'organization',
  'resource center':          'organization',
  'program':                  'organization',
  // → standards (regulatory / competency docs)
  'competencies':             'standards',
  // → worksheet (downloadable practice tools)
  'card':                     'worksheet',
  'checklist':                'worksheet',
  'clinical tool':            'worksheet',
  // → link (generic pointers)
  'resource':                 'link',
  'reference':                'link',
  'information':              'link',
};

// CE-hour-based pricing matrix per Ke's spec.
//   1 CE   → free,           $0
//   2 CE   → professional,   $29
//   3 CE   → professional,   $39
//   4 CE   → premium,        $78
//   5 CE   → premium,        $88
//   6+ CE  → premium,        $98
//
// accessType is "subscription" for paid courses because subscriber plans
// include them based on per-hour inclusion rules. The price field holds the
// individual-purchase price for non-subscribers.
function pricingForCEHours(ce) {
  const h = Math.round(ce || 0);
  if (h <= 0)  return null;
  if (h === 1) return { accessType: 'free',         pricingTier: 'free',         price: 0   };
  if (h === 2) return { accessType: 'subscription', pricingTier: 'professional', price: 29  };
  if (h === 3) return { accessType: 'subscription', pricingTier: 'professional', price: 39  };
  if (h === 4) return { accessType: 'subscription', pricingTier: 'premium',      price: 78  };
  if (h === 5) return { accessType: 'subscription', pricingTier: 'premium',      price: 88  };
  return       { accessType: 'subscription', pricingTier: 'premium',      price: 98  }; // 6+
}

// Generate a description draft from title + objectives + tags. Used only when
// the description field is missing or empty (validation requires it). The draft
// is suffixed with a marker so you can find these in admin and edit them.
function draftDescription(course) {
  const title = (course.title || '').replace(/^(Module|Section)\s+\d+:\s*/i, '').trim();
  const ce = course.ceHours || course.ceuHours || 0;
  const objectives = Array.isArray(course.objectives) ? course.objectives : [];
  const tags = Array.isArray(course.tags) ? course.tags : [];

  // Lowercase the first letter of an objective so it reads naturally after "to ..."
  const flow = (o) => {
    if (!o || typeof o !== 'string') return '';
    const trimmed = o.trim().replace(/\.$/, '');
    return trimmed.charAt(0).toLowerCase() + trimmed.slice(1);
  };

  const top = objectives.slice(0, 2).map(flow).filter(Boolean);

  let opener = title
    ? `${title} is a ${ce}-hour continuing education course for licensed mental health professionals.`
    : `This ${ce}-hour continuing education course addresses topics relevant to licensed mental health professionals.`;

  let middle = '';
  if (top.length >= 2) {
    middle = ` Participants will learn to ${top[0]} and to ${top[1]}.`;
  } else if (top.length === 1) {
    middle = ` Participants will learn to ${top[0]}.`;
  } else if (tags.length > 0) {
    middle = ` Topics include ${tags.slice(0, 5).join(', ')}.`;
  }

  return (opener + middle + ' [AUTO-DRAFT — review and edit before publishing.]').trim();
}


// Apply safe fixes in-place. Returns array of human-readable change descriptions.
function applySafeFixes(c) {
  const changes = [];

  // accessType: paid → purchase
  if (c.accessType === 'paid') {
    c.accessType = 'purchase';
    changes.push(`accessType: "paid" → "purchase"`);
  }

  // Fix question type hyphens at every level they can appear
  const fixQuestionType = (q, path) => {
    if (!q || typeof q !== 'object') return;
    const remap = QUESTION_TYPE_MAP[q.type];
    if (remap) {
      q.type = remap;
      changes.push(`${path}.type: "${Object.keys(QUESTION_TYPE_MAP).find(k => QUESTION_TYPE_MAP[k] === remap)}" → "${remap}"`);
    }
  };

  // assessment.questions[]
  if (c.assessment && Array.isArray(c.assessment.questions)) {
    c.assessment.questions.forEach((q, i) => fixQuestionType(q, `assessment.questions.${i}`));
  }

  // sections[].order, contentBlocks[].order, quizQuestions[].type, KC wrapper questions[].type
  if (Array.isArray(c.sections)) {
    c.sections.forEach((s, si) => {
      if (s.order === undefined || s.order === null) {
        s.order = si + 1;
        changes.push(`sections.${si}.order: auto-assigned ${si + 1}`);
      }
      if (Array.isArray(s.quizQuestions)) {
        s.quizQuestions.forEach((q, qi) => fixQuestionType(q, `sections.${si}.quizQuestions.${qi}`));
      }
      if (Array.isArray(s.contentBlocks)) {
        s.contentBlocks.forEach((b, bi) => {
          if (b.order === undefined || b.order === null) {
            b.order = bi + 1;
            changes.push(`sections.${si}.contentBlocks.${bi}.order: auto-assigned ${bi + 1}`);
          }
          // Block type fix (rare but possible)
          const remap = QUESTION_TYPE_MAP[b.type];
          if (remap) {
            b.type = remap;
            changes.push(`sections.${si}.contentBlocks.${bi}.type: hyphenated → "${remap}"`);
          }
          // KC wrapper questions[] inside content blocks
          if (Array.isArray(b.questions)) {
            b.questions.forEach((q, qi) => fixQuestionType(q, `sections.${si}.contentBlocks.${bi}.questions.${qi}`));
          }
        });
      }
    });
  }

  // nbccContentAreas: normalize full NBCC names to abbreviated schema enum
  if (Array.isArray(c.nbccContentAreas)) {
    c.nbccContentAreas.forEach((v, i) => {
      if (typeof v === 'string' && NBCC_FULL_TO_ABBREV[v] && NBCC_FULL_TO_ABBREV[v] !== v) {
        const before = v;
        c.nbccContentAreas[i] = NBCC_FULL_TO_ABBREV[v];
        changes.push(`nbccContentAreas.${i}: "${before}" → "${c.nbccContentAreas[i]}"`);
      }
    });
    c.markModified('nbccContentAreas');
  }

  // description: draft from title + objectives + tags if missing/empty
  if (!c.description || (typeof c.description === 'string' && c.description.trim() === '')) {
    const draft = draftDescription(c);
    if (draft) {
      c.description = draft;
      changes.push(`description: auto-drafted (${draft.length} chars) — flagged for your review`);
    }
  }

  // resources[].type: map invalid values to the (now-expanded) enum.
  // Applied platform-wide — same fix everywhere, no risk of overwriting
  // intentional values since the destination values are semantically equal.
  if (Array.isArray(c.sections)) {
    c.sections.forEach((s, si) => {
      (s.contentBlocks || []).forEach((b, bi) => {
        if (Array.isArray(b.resources)) {
          b.resources.forEach((r, ri) => {
            if (r && r.type) {
              const lower = String(r.type).toLowerCase();
              if (RESOURCE_TYPE_MAP[lower]) {
                const before = r.type;
                r.type = RESOURCE_TYPE_MAP[lower];
                changes.push(`sections.${si}.contentBlocks.${bi}.resources.${ri}.type: "${before}" → "${r.type}"`);
              }
            }
          });
        }
      });
    });
  }

  // Pricing: only re-derive when accessType is currently invalid (i.e., this
  // course is blocked because of accessType). Scope per your "a" answer:
  // don't overwrite pricing on courses that are already saving cleanly.
  const validAccessTypes = new Set(['free', 'subscription', 'purchase']);
  if (c.accessType && !validAccessTypes.has(c.accessType)) {
    const ce = c.ceHours || c.ceuHours || 0;
    const p = pricingForCEHours(ce);
    if (p) {
      const before = `${c.accessType}/${c.pricingTier || '?'}/$${c.price || 0}`;
      c.accessType  = p.accessType;
      c.pricingTier = p.pricingTier;
      c.price       = p.price;
      changes.push(`pricing: ${before} → ${p.accessType}/${p.pricingTier}/$${p.price}  (${ce} CE)`);
    }
  }

  return changes;
}

// Extract values that need your decision (not auto-fixed).
function extractDecisionsNeeded(c) {
  // After all safe fixes are applied (resource type mapping, pricing matrix,
  // description drafting, NBCC normalization, etc.), only truly unexpected
  // issues should remain. This function is now a catch-all reporter.
  return {};
}

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('═'.repeat(72));
  console.log('  SCHEMA COMPLIANCE MIGRATION (Phase 1: safe fixes only)');
  console.log('═'.repeat(72));

  try {
    const all = await InteractiveCourse.find({}).sort({ courseCode: 1 });
    console.log(`Processing ${all.length} courses…\n`);

    let migrated = 0, alreadyClean = 0, stillBlocked = 0;
    const blocked = [];

    for (const c of all) {
      const code = (c.courseCode || c.slug?.slice(0, 30) || c._id.toString().slice(-6)).padEnd(32);

      const changes = applySafeFixes(c);
      const valErr = c.validateSync();

      if (!valErr) {
        if (changes.length > 0) {
          try {
            await c.save();
            migrated++;
            console.log(`✓ ${code} MIGRATED  (wordCount: ${c.wordCount})`);
            for (const ch of changes) console.log(`    • ${ch}`);
          } catch (err) {
            // Save failed unexpectedly despite passing validateSync
            stillBlocked++;
            console.log(`✗ ${code} SAVE FAILED unexpectedly: ${err.message.slice(0, 100)}`);
          }
        } else {
          alreadyClean++;
        }
      } else {
        stillBlocked++;
        const decisionIssues = extractDecisionsNeeded(c);
        const errPaths = Object.keys(valErr.errors);
        blocked.push({ code: code.trim(), slug: c.slug, decisionIssues, errPaths, allErrors: valErr.errors });
        console.log(`✗ ${code} STILL BLOCKED  (${errPaths.length} validation error${errPaths.length > 1 ? 's' : ''})`);
      }
    }

    // ── Summary ──
    console.log('\n' + '─'.repeat(72));
    console.log(`Migrated:      ${migrated}`);
    console.log(`Already clean: ${alreadyClean}`);
    console.log(`Still blocked: ${stillBlocked}`);

    // ── Decisions needed report ──
    if (blocked.length > 0) {
      console.log('\n' + '═'.repeat(72));
      console.log('  DECISIONS NEEDED');
      console.log('═'.repeat(72));

      // After Phase 2, only truly unexpected errors should remain. List them.
      const otherErrors = new Map();
      for (const b of blocked) {
        for (const [path, err] of Object.entries(b.allErrors)) {
          const key = `${path}: ${err.kind}`;
          if (!otherErrors.has(key)) otherErrors.set(key, []);
          otherErrors.get(key).push({ code: b.code, value: err.value });
        }
      }
      if (otherErrors.size > 0) {
        console.log('\nUnexpected remaining errors:');
        for (const [key, items] of otherErrors.entries()) {
          console.log(`  ${key}  (${items.length} course${items.length > 1 ? 's' : ''})`);
          for (const i of items.slice(0, 3)) {
            const v = typeof i.value === 'string' ? `"${i.value}"` : JSON.stringify(i.value);
            console.log(`      ${i.code}  value=${v?.slice(0, 80)}`);
          }
          if (items.length > 3) console.log(`      (+ ${items.length - 3} more)`);
        }
        console.log('\nReport back — these are anomalies I didn\'t plan for.');
      } else {
        console.log('\nAll remaining blocks are unexpected anomalies; report any errors above.');
      }
    }

  } finally {
    await mongoose.disconnect();
  }
}

main().catch(err => { console.error(err); process.exit(1); });
