import {loadFont as loadLocalFont} from '@remotion/fonts';
import {loadFont as loadOutfit} from '@remotion/google-fonts/Outfit';
import {loadFont as loadWorkSans} from '@remotion/google-fonts/WorkSans';
import {staticFile} from 'remotion';

/**
 * Bold geometric sans, per the PassReady Prep brand tokens.
 *
 * Fonts are loaded from public/fonts/ (run `npm run fonts:vendor` once) so a
 * render needs no network at all. If they have not been vendored, we fall back
 * to @remotion/google-fonts, which fetches the same files from Google.
 */
type Manifest = {
  faces: {
    family: string;
    weight: string;
    style: string;
    file: string;
    unicodeRange?: string;
  }[];
};

const loadVendored = async () => {
  const res = await fetch(staticFile('fonts/manifest.json'));
  if (!res.ok) {
    throw new Error('fonts not vendored');
  }
  const manifest = (await res.json()) as Manifest;
  await Promise.all(
    manifest.faces.map((face) =>
      loadLocalFont({
        family: face.family,
        url: staticFile(face.file),
        weight: face.weight,
        style: face.style,
        unicodeRange: face.unicodeRange,
        format: 'woff2',
      }),
    ),
  );
};

const loadFromGoogle = async () => {
  await Promise.all([
    loadOutfit('normal', {weights: ['400', '600', '700', '800']}).waitUntilDone(),
    loadWorkSans('normal', {
      weights: ['400', '500', '600', '700'],
    }).waitUntilDone(),
  ]);
};

let pending: Promise<void> | null = null;

export const waitForFonts = (): Promise<void> => {
  if (!pending) {
    pending = loadVendored().catch(() => loadFromGoogle());
  }
  return pending;
};

/** Display / headline face. */
export const DISPLAY_FONT = '"Outfit", system-ui, sans-serif';
/** Body / running-text face. */
export const BODY_FONT = '"Work Sans", system-ui, sans-serif';
