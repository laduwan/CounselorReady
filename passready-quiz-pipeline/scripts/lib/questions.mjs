import fs from 'node:fs';
import path from 'node:path';
import {DATA_DIR, QUESTIONS_DIR} from './paths.mjs';

const REQUIRED = ['id', 'family', 'vignette', 'question', 'options', 'rationale'];

export const validateQuestion = (q, file) => {
  for (const key of REQUIRED) {
    if (q[key] === undefined || q[key] === null || q[key] === '') {
      throw new Error(`${file}: missing required field "${key}"`);
    }
  }
  if (!Array.isArray(q.options) || q.options.length < 2) {
    throw new Error(`${file}: "options" must have at least 2 entries`);
  }
  if (q.options.length > 6) {
    throw new Error(`${file}: at most 6 options are supported (A-F)`);
  }
  const correct = q.options.filter((o) => o.isCorrect);
  if (correct.length !== 1) {
    throw new Error(
      `${file}: exactly one option must have isCorrect: true (found ${correct.length})`,
    );
  }
  for (const [i, o] of q.options.entries()) {
    if (typeof o.text !== 'string' || !o.text.trim()) {
      throw new Error(`${file}: option ${i} has no text`);
    }
  }
  if (q.rung !== undefined && !(Number.isInteger(q.rung) && q.rung > 0)) {
    throw new Error(`${file}: "rung" must be a positive integer when present`);
  }
  return q;
};

export const listQuestionIds = () => {
  if (!fs.existsSync(QUESTIONS_DIR)) return [];
  return fs
    .readdirSync(QUESTIONS_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''))
    .sort();
};

export const readQuestion = (id) => {
  const file = path.join(QUESTIONS_DIR, `${id}.json`);
  if (!fs.existsSync(file)) {
    throw new Error(`No such question: questions/${id}.json`);
  }
  const q = JSON.parse(fs.readFileSync(file, 'utf8'));
  validateQuestion(q, `questions/${id}.json`);
  if (q.id !== id) {
    throw new Error(
      `questions/${id}.json: "id" is "${q.id}" but the filename says "${id}". They must match.`,
    );
  }
  return q;
};

/** Copy validated questions into public/data so the compositions can fetch them. */
export const syncToPublic = (ids = listQuestionIds()) => {
  fs.mkdirSync(DATA_DIR, {recursive: true});
  const synced = [];
  for (const id of ids) {
    const q = readQuestion(id);
    fs.writeFileSync(
      path.join(DATA_DIR, `${id}.json`),
      JSON.stringify(q, null, 2),
    );
    synced.push(id);
  }
  fs.writeFileSync(
    path.join(DATA_DIR, 'index.json'),
    JSON.stringify({ids: listQuestionIds()}, null, 2),
  );
  return synced;
};

export const resolveIds = (arg) => {
  if (!arg || arg === 'all') return listQuestionIds();
  return arg
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
};
