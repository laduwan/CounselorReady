#!/usr/bin/env node
/** npm run render:short -- PRP-Q-0001  ->  out/shorts/PRP-Q-0001.mp4 */
import path from 'node:path';
import {AUDIO_DIR, OUT_DIR} from './lib/paths.mjs';
import {readQuestion, syncToPublic} from './lib/questions.mjs';
import {assertTimingExists, renderComposition} from './lib/render.mjs';

const id = process.argv.slice(2).find((a) => !a.startsWith('--'));
if (!id) {
  console.error('Usage: npm run render:short -- <questionId>');
  process.exit(1);
}

readQuestion(id);
syncToPublic();
assertTimingExists(id, AUDIO_DIR);

const out = path.join(OUT_DIR, 'shorts', `${id}.mp4`);
renderComposition({
  compositionId: 'QuizShort',
  outFile: out,
  props: {questionId: id},
});
console.log(`\nWrote ${out}`);
