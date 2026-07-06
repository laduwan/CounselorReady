/**
 * Copyright (c) 2026 CounselorReady, a subsidiary of Ga Integrated Therapeutic Perspectives, LLC.
 * generateLocal.mjs — generate a course draft on YOUR machine, using YOUR model,
 * grounded in YOUR sources. Additive: imports the existing generator unchanged.
 *
 * Run on the Mac (Ollama running) e.g.:
 *
 *   AI_BACKEND=local \
 *   OLLAMA_MODEL=qwen3.6:27b \
 *   CORPUS_DIR=/Volumes/Backups/ce-corpus \
 *   node server/src/scripts/generateLocal.mjs \
 *     --topic "Ethical Telehealth for Georgia LPCs" --hours 3 --level Intermediate \
 *     --category "Ethics" --out ./telehealth-draft.json
 *
 * Produces the SAME course object your Course Builder / seed pipeline already
 * consumes — you review it, then seed/publish through your normal flow.
 */
import fs from 'node:fs';
import { generateCourseDraft } from '../services/courseDraftGenerator.js';

function arg(name, def) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : def;
}

const params = {
  topic: arg('topic', ''),
  ceHours: arg('hours', '3'),
  level: arg('level', 'Intermediate'),
  category: arg('category', 'General'),
  uploadedContent: arg('file') ? fs.readFileSync(arg('file'), 'utf8') : undefined,
};
const outPath = arg('out', './course-draft.json');

if (!params.topic && !params.uploadedContent) {
  console.error('Provide --topic "..." (or --file path.md to convert existing content).');
  process.exit(1);
}
if (process.env.AI_BACKEND !== 'local') {
  console.error('Set AI_BACKEND=local so this runs on your on-prem model, not the cloud.');
  process.exit(1);
}

console.log(`\nGenerating locally with ${process.env.OLLAMA_MODEL || 'qwen3.6:27b'} `
  + `(corpus: ${process.env.CORPUS_DIR || 'none'})...\n`);

const t0 = Date.now();
try {
  const { course, usageTotals } = await generateCourseDraft(params);
  fs.writeFileSync(outPath, JSON.stringify(course, null, 2));
  console.log(`Done in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  console.log(`Course: "${course.title}"  |  modules: ${course.modules.length}  |  `
    + `assessment Qs: ${course.assessment.questions.length}`);
  console.log(`Local tokens (no cost): in ${usageTotals.input_tokens} / out ${usageTotals.output_tokens}`);
  console.log(`Saved -> ${outPath}\n`);
  console.log('Review it, then seed/publish through your normal pipeline. Nothing was sent to any cloud API.');
} catch (err) {
  console.error('\nGeneration failed:', err.message);
  console.error('Check: is Ollama running on the Mac? Is OLLAMA_URL reachable? Is the model pulled?');
  process.exit(1);
}
