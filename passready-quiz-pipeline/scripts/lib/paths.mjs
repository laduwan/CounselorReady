import {fileURLToPath} from 'node:url';
import path from 'node:path';

export const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
);
export const QUESTIONS_DIR = path.join(ROOT, 'questions');
export const PUBLIC_DIR = path.join(ROOT, 'public');
export const DATA_DIR = path.join(PUBLIC_DIR, 'data');
export const AUDIO_DIR = path.join(PUBLIC_DIR, 'audio');
export const OUT_DIR = path.join(ROOT, 'out');
export const ENTRY = path.join(ROOT, 'src', 'index.ts');
