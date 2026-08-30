#!/usr/bin/env node
/** npm run render:all-shorts  ->  one MP4 per question in questions/ */
import path from 'node:path';
import {AUDIO_DIR, OUT_DIR} from './lib/paths.mjs';
import {listQuestionIds, syncToPublic} from './lib/questions.mjs';
import {assertTimingExists, renderComposition} from './lib/render.mjs';

const ids = listQuestionIds();
if (ids.length === 0) {
  console.error('No questions found in questions/.');
  process.exit(1);
}

syncToPublic();
for (const id of ids) assertTimingExists(id, AUDIO_DIR);

const written = [];
for (const [i, id] of ids.entries()) {
  console.log(`\n[${i + 1}/${ids.length}] ${id}`);
  written.push(
    renderComposition({
      compositionId: 'QuizShort',
      outFile: path.join(OUT_DIR, 'shorts', `${id}.mp4`),
      props: {questionId: id},
    }),
  );
}
console.log(`\nWrote ${written.length} short(s):`);
for (const f of written) console.log(`  ${f}`);
