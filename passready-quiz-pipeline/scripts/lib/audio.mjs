import {execFileSync, spawnSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const has = (bin) => spawnSync('which', [bin], {encoding: 'utf8'}).status === 0;

/* ------------------------------------------------------------------ *
 * Duration measurement
 * ------------------------------------------------------------------ */

/**
 * Locate an ffprobe. In order: PRP_FFPROBE, an ffprobe on PATH, then the one
 * bundled with Remotion (so no separate ffmpeg install is required).
 * Returns {bin, prefix} or null.
 */
export const findFfprobe = () => {
  const explicit = process.env.PRP_FFPROBE;
  if (explicit && fs.existsSync(explicit)) return {bin: explicit, prefix: []};
  if (has('ffprobe')) return {bin: 'ffprobe', prefix: []};
  if (has('npx')) return {bin: 'npx', prefix: ['remotion', 'ffprobe']};
  return null;
};

export const describeFfprobe = (probe) =>
  probe ? [probe.bin, ...probe.prefix].join(' ') : 'built-in WAVE reader';

const probeWithFfprobe = (probe, file) => {
  const out = execFileSync(
    probe.bin,
    [
      ...probe.prefix,
      '-v',
      'error',
      '-show_entries',
      'format=duration',
      '-of',
      'default=noprint_wrappers=1:nokey=1',
      file,
    ],
    {encoding: 'utf8'},
  );
  const n = Number.parseFloat(out.trim());
  if (!Number.isFinite(n) || n <= 0) {
    throw new Error(`ffprobe returned no usable duration for ${file}`);
  }
  return n;
};

/**
 * Pure-JS RIFF/WAVE duration, used when ffprobe is not installed.
 * Walks the chunk list rather than assuming a 44-byte canonical header.
 */
const probeWav = (file) => {
  const buf = fs.readFileSync(file);
  if (buf.length < 12 || buf.toString('ascii', 0, 4) !== 'RIFF') {
    throw new Error(
      `${file} is not a RIFF/WAVE file. Install ffmpeg (for ffprobe) to measure other formats.`,
    );
  }
  let offset = 12;
  let byteRate = 0;
  let dataSize = 0;
  while (offset + 8 <= buf.length) {
    const id = buf.toString('ascii', offset, offset + 4);
    const size = buf.readUInt32LE(offset + 4);
    if (id === 'fmt ') byteRate = buf.readUInt32LE(offset + 16);
    if (id === 'data') {
      dataSize = Math.min(size, buf.length - (offset + 8));
      break;
    }
    offset += 8 + size + (size % 2);
  }
  if (!byteRate || !dataSize) {
    throw new Error(`Could not read WAVE chunks from ${file}`);
  }
  return dataSize / byteRate;
};

export const probeDuration = (file, probe) => {
  if (probe) {
    try {
      return probeWithFfprobe(probe, file);
    } catch {
      /* fall through to the WAVE reader */
    }
  }
  return probeWav(file);
};

/* ------------------------------------------------------------------ *
 * TTS engines
 * ------------------------------------------------------------------ */

/** Voices preferred in order; the first one actually installed wins. */
const VOICE_PREFERENCE = [
  'Samantha (Premium)',
  'Samantha (Enhanced)',
  'Ava (Premium)',
  'Ava (Enhanced)',
  'Allison (Premium)',
  'Allison (Enhanced)',
  'Samantha',
];

export const listSayVoices = () => {
  const res = spawnSync('say', ['-v', '?'], {encoding: 'utf8'});
  if (res.status !== 0 || !res.stdout) return [];
  return res.stdout
    .split('\n')
    .map((line) => line.split(/\s{2,}/)[0]?.trim())
    .filter(Boolean);
};

export const pickSayVoice = () => {
  if (process.env.PRP_TTS_VOICE) return process.env.PRP_TTS_VOICE;
  const installed = new Set(listSayVoices());
  for (const v of VOICE_PREFERENCE) {
    if (installed.has(v)) return v;
  }
  return 'Samantha';
};

/** macOS: `say` to AIFF, then afconvert (or ffmpeg) to 48 kHz 16-bit WAV. */
const synthSay = (text, outWav, {voice, rate}) => {
  const tmpTxt = path.join(os.tmpdir(), `prp-${Date.now()}-${Math.random().toString(36).slice(2)}.txt`);
  const tmpAiff = `${tmpTxt}.aiff`;
  fs.writeFileSync(tmpTxt, text, 'utf8');
  try {
    const args = ['-v', voice, '-f', tmpTxt, '-o', tmpAiff];
    if (rate) args.push('-r', String(rate));
    execFileSync('say', args, {stdio: 'pipe'});

    if (has('afconvert')) {
      execFileSync(
        'afconvert',
        ['-f', 'WAVE', '-d', 'LEI16@48000', tmpAiff, outWav],
        {stdio: 'pipe'},
      );
    } else if (has('ffmpeg')) {
      execFileSync(
        'ffmpeg',
        ['-y', '-i', tmpAiff, '-ar', '48000', '-ac', '1', '-c:a', 'pcm_s16le', outWav],
        {stdio: 'pipe'},
      );
    } else {
      throw new Error('Neither afconvert nor ffmpeg is available to convert AIFF to WAV.');
    }
  } finally {
    fs.rmSync(tmpTxt, {force: true});
    fs.rmSync(tmpAiff, {force: true});
  }
};

/** Linux/dev fallback so the pipeline is testable off a Mac. */
const synthEspeak = (text, outWav, {rate}) => {
  const tmpTxt = path.join(os.tmpdir(), `prp-${Date.now()}.txt`);
  fs.writeFileSync(tmpTxt, text, 'utf8');
  try {
    execFileSync(
      'espeak-ng',
      ['-v', 'en-us', '-s', String(rate || 165), '-f', tmpTxt, '-w', outWav],
      {stdio: 'pipe'},
    );
  } finally {
    fs.rmSync(tmpTxt, {force: true});
  }
};

/**
 * No TTS binary available: write a silent WAV whose length matches an estimate
 * of how long the line takes to read. Layout and timing can still be validated;
 * the video simply has no voice track.
 */
const synthEstimate = (text, outWav, {rate}) => {
  const wpm = rate || 175;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const seconds = Math.max(1.2, (words / wpm) * 60 + 0.45);
  writeSilentWav(outWav, seconds);
};

export const writeSilentWav = (outWav, seconds, sampleRate = 48000) => {
  const frames = Math.round(seconds * sampleRate);
  const dataSize = frames * 2;
  const buf = Buffer.alloc(44 + dataSize);
  buf.write('RIFF', 0, 'ascii');
  buf.writeUInt32LE(36 + dataSize, 4);
  buf.write('WAVE', 8, 'ascii');
  buf.write('fmt ', 12, 'ascii');
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20); // PCM
  buf.writeUInt16LE(1, 22); // mono
  buf.writeUInt32LE(sampleRate, 24);
  buf.writeUInt32LE(sampleRate * 2, 28); // byte rate
  buf.writeUInt16LE(2, 32); // block align
  buf.writeUInt16LE(16, 34); // bits
  buf.write('data', 36, 'ascii');
  buf.writeUInt32LE(dataSize, 40);
  fs.writeFileSync(outWav, buf);
};

export const ENGINES = {
  say: {available: () => process.platform === 'darwin' && has('say'), synth: synthSay},
  'espeak-ng': {available: () => has('espeak-ng'), synth: synthEspeak},
  estimate: {available: () => true, synth: synthEstimate},
  // "manual" never synthesizes — it measures WAVs you dropped in yourself.
  manual: {available: () => true, synth: null},
};

export const pickEngine = (requested) => {
  const name = requested || process.env.PRP_TTS_ENGINE;
  if (name) {
    if (!ENGINES[name]) {
      throw new Error(
        `Unknown TTS engine "${name}". Choose one of: ${Object.keys(ENGINES).join(', ')}`,
      );
    }
    return name;
  }
  for (const candidate of ['say', 'espeak-ng', 'estimate']) {
    if (ENGINES[candidate].available()) return candidate;
  }
  return 'estimate';
};
