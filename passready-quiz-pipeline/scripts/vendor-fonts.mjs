#!/usr/bin/env node
/**
 * Download the brand font files once into public/fonts/ so renders are fully
 * local — no network call at render time.
 *
 *   npm run fonts:vendor
 *
 * URLs come from @remotion/google-fonts, so the files are exactly the ones
 * Google Fonts serves for Outfit and Work Sans.
 */
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {PUBLIC_DIR} from './lib/paths.mjs';

const require = createRequire(import.meta.url);

const FAMILIES = [
  {module: 'Outfit', family: 'Outfit', weights: ['400', '600', '700', '800']},
  {module: 'WorkSans', family: 'Work Sans', weights: ['400', '500', '600', '700']},
];
const SUBSET = 'latin';

const outDir = path.join(PUBLIC_DIR, 'fonts');
fs.mkdirSync(outDir, {recursive: true});

const faces = [];
const downloaded = new Map();

for (const spec of FAMILIES) {
  const info = require(`@remotion/google-fonts/${spec.module}`).getInfo();

  for (const weight of spec.weights) {
    const url = info.fonts.normal?.[weight]?.[SUBSET];
    if (!url) {
      throw new Error(
        `${spec.family}: no ${SUBSET} URL for weight ${weight} in @remotion/google-fonts`,
      );
    }

    let file = downloaded.get(url);
    if (!file) {
      file = `${spec.module}-${path.basename(new URL(url).pathname)}`;
      const dest = path.join(outDir, file);
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Failed to download ${url} (HTTP ${res.status})`);
      }
      fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
      downloaded.set(url, file);
      console.log(`  downloaded ${file} (${fs.statSync(dest).size} bytes)`);
    }

    faces.push({
      family: spec.family,
      weight,
      style: 'normal',
      file: `fonts/${file}`,
      unicodeRange: info.unicodeRanges?.[SUBSET],
    });
  }
}

fs.writeFileSync(
  path.join(outDir, 'manifest.json'),
  JSON.stringify({subset: SUBSET, faces}, null, 2),
);
console.log(
  `Vendored ${downloaded.size} font file(s), ${faces.length} face(s) -> public/fonts/manifest.json`,
);
