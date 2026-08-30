export type QuestionOption = {
  text: string;
  isCorrect: boolean;
};

export type Question = {
  id: string;
  family: string;
  vignette: string;
  question: string;
  options: QuestionOption[];
  rationale: string;
  /** Priority Ladder rung, 1-based. Optional. */
  rung?: number;
  difficulty?: string;
};

export type SceneName =
  | 'hook'
  | 'vignette'
  | 'question'
  | 'countdown'
  | 'reveal'
  | 'endcard';

export type VignetteLineCue = {
  text: string;
  startInFrames: number;
};

export type SceneCues = {
  /** vignette: one cue per revealed line */
  lines?: VignetteLineCue[];
  /** question: frame at which each option row appears */
  options?: number[];
  /** reveal: frame at which the rationale card slides up */
  rationaleStartInFrames?: number;
};

export type SceneTiming = {
  name: SceneName;
  durationInFrames: number;
  /** staticFile-relative path, e.g. "audio/PRP-Q-0001/vignette.wav". Null for silent scenes. */
  audio: string | null;
  audioDurationInSeconds: number | null;
  /** Frame within the scene at which the narration starts. */
  audioStartInFrames: number;
  cues: SceneCues;
};

export type QuestionTiming = {
  id: string;
  fps: number;
  engine: string;
  voice: string | null;
  generatedAt: string;
  /** staticFile-relative path to an optional countdown tick loop, if present. */
  tickAudio: string | null;
  scenes: SceneTiming[];
  durationInFrames: number;
};

export type ShortProps = {
  questionId: string;
  question: Question | null;
  timing: QuestionTiming | null;
};

export type CompilationProps = {
  questionIds: string[];
  items: {question: Question; timing: QuestionTiming}[] | null;
};
