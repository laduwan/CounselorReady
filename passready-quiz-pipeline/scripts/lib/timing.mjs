export const FPS = 30;

/** Fixed beats, in frames. */
export const HOOK_FRAMES = FPS * 3; // ~3s hook
export const COUNTDOWN_FRAMES = FPS * 5; // 5s countdown, fixed
export const ENDCARD_FRAMES = FPS * 5; // ~5s end card

/** Breathing room around each narrated scene. */
export const LEAD_IN_FRAMES = 8; // text lands just before the voice starts
export const TAIL_FRAMES = 22; // hold after the voice stops

export const secondsToFrames = (s) => Math.round(s * FPS);

export const narratedSceneFrames = (audioSeconds) =>
  LEAD_IN_FRAMES + Math.ceil(audioSeconds * FPS) + TAIL_FRAMES;
