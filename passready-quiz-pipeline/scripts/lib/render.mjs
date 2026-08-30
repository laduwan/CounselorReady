import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {ENTRY, ROOT} from './paths.mjs';

/**
 * Shell out to the Remotion CLI. Props go through a temp file so nothing has
 * to survive shell quoting.
 */
export const renderComposition = ({compositionId, outFile, props, extraArgs = []}) => {
  fs.mkdirSync(path.dirname(outFile), {recursive: true});
  const propsFile = path.join(
    os.tmpdir(),
    `prp-props-${Date.now()}-${Math.random().toString(36).slice(2)}.json`,
  );
  fs.writeFileSync(propsFile, JSON.stringify(props));

  const args = [
    'remotion',
    'render',
    ENTRY,
    compositionId,
    outFile,
    `--props=${propsFile}`,
    '--log=info',
    ...extraArgs,
  ];
  if (process.env.PRP_CONCURRENCY) {
    args.push(`--concurrency=${process.env.PRP_CONCURRENCY}`);
  }
  if (process.env.PRP_BROWSER_EXECUTABLE) {
    args.push(`--browser-executable=${process.env.PRP_BROWSER_EXECUTABLE}`);
  }

  try {
    const res = spawnSync('npx', args, {cwd: ROOT, stdio: 'inherit'});
    if (res.status !== 0) {
      throw new Error(`Render failed for ${compositionId} -> ${outFile}`);
    }
  } finally {
    fs.rmSync(propsFile, {force: true});
  }
  return outFile;
};

export const assertTimingExists = (id, audioDir) => {
  const timing = path.join(audioDir, id, 'timing.json');
  if (!fs.existsSync(timing)) {
    throw new Error(
      `Missing ${path.relative(ROOT, timing)}. Run: npm run tts -- ${id}`,
    );
  }
};
