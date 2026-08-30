/**
 * PassReady Prep brand tokens.
 * These values are fixed — do not substitute colors or font families.
 */
export const BRAND = {
  /** Mint background gradient */
  mintTop: '#EAF7F1',
  mintBottom: '#DBF0E7',
  /** Emerald — accents, correct answer, progress ring, network-node motif */
  emerald: '#159E6E',
  /** Navy — primary text */
  navy: '#1A364E',
  /** Muted red — wrong-answer flash, used sparingly */
  wrong: '#C0554D',
} as const;

/** Translucent form of a brand token. The hex values above stay the only source. */
export const alpha = (hex: string, a: number): string => {
  const n = Number.parseInt(hex.replace('#', ''), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

/** Derived tints, all built from the tokens above. */
export const TINT = {
  emeraldSoft: alpha(BRAND.emerald, 0.12),
  emeraldLine: alpha(BRAND.emerald, 0.55),
  navySoft: alpha(BRAND.navy, 0.1),
  navyMuted: alpha(BRAND.navy, 0.45),
  wrongSoft: alpha(BRAND.wrong, 0.12),
  cardShadow: `0 18px 48px ${alpha(BRAND.navy, 0.14)}`,
} as const;

export const FPS = 30;

/** Vertical Shorts frame. */
export const SHORT = {width: 1080, height: 1920} as const;
/** Horizontal compilation frame. */
export const WIDE = {width: 1920, height: 1080} as const;

/**
 * Safe margins.
 * Shorts: >=120px from the top and >=220px from the bottom so nothing collides
 * with the YouTube Shorts UI overlays.
 */
export const SAFE = {
  short: {top: 120, bottom: 220, side: 72},
  wide: {top: 64, bottom: 72, side: 120},
} as const;

export type Layout = 'short' | 'wide';

export const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'] as const;
