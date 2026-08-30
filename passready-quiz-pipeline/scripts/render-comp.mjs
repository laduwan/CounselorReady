#!/usr/bin/env node
/**
 * npm run render:comp -- PRP-Q-0001,PRP-Q-0002,PRP-Q-0003
 * npm run render:comp -- all --name=week-01
 *   -> out/comp/<name>.mp4
 */
import path from 'node:path';
import {AUDIO_DIR, OUT_DIR} from './lib/paths.mjs';
import {readQuestion, resolveIds, syncToPublic} from './lib/questions.mjs';
import {assertTimingExists, renderComposition} from './lib/render.mjs';

const argv = process.argv.slice(2);
const positional = argv.filter((a) => !a.startsWith('--'));
const nameFlag = argv.find((a) => a.startsWith('--name='));

const ids = resolveIds(positional[0]);
if (ids.length === 0) {
  console.error('Usage: npm run render:comp -- <id1,id2,...>|all [--name=slug]');
  process.exit(1);
}

for (const id of ids) {
  readQuestion(id);
  assertTimingExists(id, AUDIO_DIR);
}
syncToPublic();

const name =
  (nameFlag ? nameFlag.slice('--name='.length) : null) ??
  (ids.length <= 3 ? ids.join('_') : `compilation-${ids.length}q`);

const out = path.join(OUT_DIR, 'comp', `${name}.mp4`);
renderComposition({
  compositionId: 'QuizCompilation',
  outFile: out,
  props: {questionIds: ids},
});
console.log(`\nWrote ${out} (${ids.length} questions)`);
