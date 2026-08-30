#!/usr/bin/env node
/**
 * Generate narration audio + timing.json for one question, several, or all.
 *
 *   npm run tts -- all
 *   npm run tts -- PRP-Q-0001
 *   npm run tts -- PRP-Q-0001,PRP-Q-0002 --engine=say --voice="Samantha (Enhanced)"
 *   npm run tts -- all --engine=manual        # measure your own WAVs, don't synthesize
 */
import fs from 'node:fs';
import path from 'node:path';
import {AUDIO_DIR} from './lib/paths.mjs';
import {readQuestion, resolveIds, syncToPublic} from './lib/questions.mjs';
import {
  describeFfprobe,
  ENGINES,
  findFfprobe,
  pickEngine,
  pickSayVoice,
  probeDuration,
} from './lib/audio.mjs';
import {
  buildNarration,
  joinSegments,
  segmentOffsets,
} from './lib/narration.mjs';
import {
  COUNTDOWN_FRAMES,
  ENDCARD_FRAMES,
  FPS,
  HOOK_FRAMES,
  LEAD_IN_FRAMES,
  narratedSceneFrames,
} from './lib/timing.mjs';

const argv = process.argv.slice(2);
const flag = (name) => {
  const hit = argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : undefined;
};
const positional = argv.filter((a) => !a.startsWith('--'));

const engineName = pickEngine(flag('engine'));
const engine = ENGINES[engineName];
const rateRaw = flag('rate') ?? process.env.PRP_TTS_RATE;
const rate = rateRaw ? Number(rateRaw) : undefined;
const voice =
  engineName === 'say' ? (flag('voice') ?? pickSayVoice()) : null;
const ffprobe = findFfprobe();

const NARRATED = ['vignette', 'question', 'reveal'];

const synthesize = (text, outFile) => {
  if (engineName === 'manual') {
    if (!fs.existsSync(outFile)) {
      throw new Error(
        `--engine=manual expects ${path.relative(process.cwd(), outFile)} to exist already.`,
      );
    }
    return;
  }
  engine.synth(text, outFile, {voice, rate});
};

const buildOne = (id) => {
  const question = readQuestion(id);
  const narration = buildNarration(question);
  const dir = path.join(AUDIO_DIR, id);
  fs.mkdirSync(dir, {recursive: true});

  const measured = {};
  for (const scene of NARRATED) {
    const outFile = path.join(dir, `${scene}.wav`);
    synthesize(joinSegments(narration[scene].segments), outFile);
    measured[scene] = probeDuration(outFile, ffprobe);
  }

  const rel = (scene) => `audio/${id}/${scene}.wav`;

  // Optional shared countdown tick, if you drop one in.
  const tickFile = path.join(AUDIO_DIR, '_shared', 'tick.wav');
  const tickAudio = fs.existsSync(tickFile) ? 'audio/_shared/tick.wav' : null;

  const vignetteOffsets = segmentOffsets(
    narration.vignette.segments,
    measured.vignette,
  );
  const questionOffsets = segmentOffsets(
    narration.question.segments,
    measured.question,
  );
  const revealOffsets = segmentOffsets(
    narration.reveal.segments,
    measured.reveal,
  );

  const cueFrame = (seconds) => LEAD_IN_FRAMES + Math.round(seconds * FPS);

  const scenes = [
    {
      name: 'hook',
      durationInFrames: HOOK_FRAMES,
      audio: null,
      audioDurationInSeconds: null,
      audioStartInFrames: 0,
      cues: {},
    },
    {
      name: 'vignette',
      durationInFrames: narratedSceneFrames(measured.vignette),
      audio: rel('vignette'),
      audioDurationInSeconds: measured.vignette,
      audioStartInFrames: LEAD_IN_FRAMES,
      cues: {
        lines: narration.vignette.segments.map((s, i) => ({
          text: s.text,
          startInFrames: cueFrame(vignetteOffsets[i]),
        })),
      },
    },
    {
      name: 'question',
      durationInFrames: narratedSceneFrames(measured.question),
      audio: rel('question'),
      audioDurationInSeconds: measured.question,
      audioStartInFrames: LEAD_IN_FRAMES,
      cues: {
        // segment 0 is the question stem; options follow.
        options: question.options.map((_, i) => cueFrame(questionOffsets[i + 1])),
      },
    },
    {
      name: 'countdown',
      durationInFrames: COUNTDOWN_FRAMES,
      audio: null,
      audioDurationInSeconds: null,
      audioStartInFrames: 0,
      cues: {},
    },
    {
      name: 'reveal',
      durationInFrames: narratedSceneFrames(measured.reveal),
      audio: rel('reveal'),
      audioDurationInSeconds: measured.reveal,
      audioStartInFrames: LEAD_IN_FRAMES,
      cues: {rationaleStartInFrames: cueFrame(revealOffsets[1])},
    },
    {
      name: 'endcard',
      durationInFrames: ENDCARD_FRAMES,
      audio: null,
      audioDurationInSeconds: null,
      audioStartInFrames: 0,
      cues: {},
    },
  ];

  const timing = {
    id,
    fps: FPS,
    engine: engineName,
    voice,
    generatedAt: new Date().toISOString(),
    tickAudio,
    scenes,
    durationInFrames: scenes.reduce((a, s) => a + s.durationInFrames, 0),
  };

  fs.writeFileSync(
    path.join(dir, 'timing.json'),
    JSON.stringify(timing, null, 2),
  );
  return timing;
};

const main = () => {
  const ids = resolveIds(positional[0] ?? 'all');
  if (ids.length === 0) {
    console.error('No questions found in questions/.');
    process.exit(1);
  }

  syncToPublic();

  console.log(
    `TTS engine: ${engineName}${voice ? ` (voice: ${voice})` : ''}  |  duration probe: ${describeFfprobe(ffprobe)}`,
  );
  if (engineName === 'estimate') {
    console.warn(
      'WARNING: no TTS binary found — writing silent placeholder audio of estimated length.\n' +
        '         On macOS this script uses `say`; install ffmpeg/espeak-ng elsewhere,\n' +
        '         or record your own WAVs and re-run with --engine=manual.',
    );
  }

  for (const id of ids) {
    const t = buildOne(id);
    const secs = (t.durationInFrames / t.fps).toFixed(1);
    console.log(
      `  ${id}  ${t.durationInFrames} frames (${secs}s)  ` +
        t.scenes
          .map((s) => `${s.name}:${s.durationInFrames}`)
          .join(' '),
    );
  }
  console.log(`Done. ${ids.length} question(s).`);
};

main();
