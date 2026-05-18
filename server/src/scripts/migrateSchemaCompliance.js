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
  'multiple-choice': 'multipleChoice',
  'multi-select':    'multiSelect',
  'true-false':      'trueFalse',
};

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

  return changes;
}

// Extract values that need your decision (not auto-fixed).
function extractDecisionsNeeded(c) {
  const issues = {};

  // Invalid resource type values
  const badResTypes = new Map(); // type → list of paths
  if (Array.isArray(c.sections)) {
    c.sections.forEach((s, si) => {
      (s.contentBlocks || []).forEach((b, bi) => {
        if (Array.isArray(b.resources)) {
          b.resources.forEach((r, ri) => {
            if (r && r.type && !VALID_RESOURCE_TYPES.has(r.type)) {
              if (!badResTypes.has(r.type)) badResTypes.set(r.type, []);
              badResTypes.get(r.type).push(`s${si}.b${bi}.r${ri}`);
            }
          });
        }
      });
    });
  }
  if (badResTypes.size > 0) issues.invalidResourceTypes = badResTypes;

  // accessType: "professional"
  if (c.accessType === 'professional') issues.accessTypeProfessional = true;

  // Missing description
  if (!c.description || (typeof c.description === 'string' && c.description.trim() === '')) {
    issues.missingDescription = true;
  }

  return issues;
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

      // Aggregate
      const resTypeMap = new Map();          // bad type → list of course codes
      const profAccessCourses = [];
      const missingDescCourses = [];
      const otherErrors = new Map();          // error type → list of {code, path, message}

      for (const b of blocked) {
        if (b.decisionIssues.invalidResourceTypes) {
          for (const t of b.decisionIssues.invalidResourceTypes.keys()) {
            if (!resTypeMap.has(t)) resTypeMap.set(t, []);
            resTypeMap.get(t).push(b.code);
          }
        }
        if (b.decisionIssues.accessTypeProfessional) profAccessCourses.push(b.code);
        if (b.decisionIssues.missingDescription) missingDescCourses.push(b.code);

        // Catch-all: any error path not covered by extractDecisionsNeeded
        for (const [path, err] of Object.entries(b.allErrors)) {
          const isResource = path.includes('.resources.') && path.endsWith('.type');
          const isAccessType = path === 'accessType';
          const isDescription = path === 'description';
          if (isResource || isAccessType || isDescription) continue;
          const key = `${path}: ${err.kind}`;
          if (!otherErrors.has(key)) otherErrors.set(key, []);
          otherErrors.get(key).push({ code: b.code, value: err.value, msg: err.message });
        }
      }

      // (A) Resource types
      if (resTypeMap.size > 0) {
        console.log('\n[A]  resources[].type: invalid enum values');
        console.log('     Valid enum: pdf, video, link, article, website, book,');
        console.log('                 xlsx, xls, csv, docx, doc, pptx, ppt, zip,');
        console.log('                 worksheet, toolkit, template, guide');
        const sortedTypes = [...resTypeMap.entries()].sort((a, b) => b[1].length - a[1].length);
        for (const [type, codes] of sortedTypes) {
          console.log(`     "${type}"`.padEnd(36) + ` used by ${codes.length} course${codes.length > 1 ? 's' : ''}:`);
          for (const c of codes.slice(0, 4)) console.log(`         ${c}`);
          if (codes.length > 4) console.log(`         (+ ${codes.length - 4} more)`);
        }
      }

      // (B) accessType professional
      if (profAccessCourses.length > 0) {
        console.log(`\n[B]  accessType: "professional" — ${profAccessCourses.length} course(s)`);
        console.log('     Valid options: "free", "subscription", "purchase"');
        for (const c of profAccessCourses) console.log(`     ${c}`);
      }

      // (C) Missing descriptions
      if (missingDescCourses.length > 0) {
        console.log(`\n[C]  description: missing — ${missingDescCourses.length} course(s)`);
        for (const c of missingDescCourses) console.log(`     ${c}`);
      }

      // (D) Other errors (nbccContentAreas, anything unexpected)
      if (otherErrors.size > 0) {
        console.log(`\n[D]  Other validation errors:`);
        for (const [key, items] of otherErrors.entries()) {
          console.log(`     ${key}  (${items.length} course${items.length > 1 ? 's' : ''})`);
          for (const i of items.slice(0, 3)) {
            const v = typeof i.value === 'string' ? `"${i.value}"` : JSON.stringify(i.value);
            console.log(`         ${i.code}  value=${v?.slice(0, 60)}`);
          }
          if (items.length > 3) console.log(`         (+ ${items.length - 3} more)`);
        }
      }

      console.log('\nReport these back. After I know what you want each becomes, Phase 2 finishes the cleanup.');
    }

  } finally {
    await mongoose.disconnect();
  }
}

main().catch(err => { console.error(err); process.exit(1); });
