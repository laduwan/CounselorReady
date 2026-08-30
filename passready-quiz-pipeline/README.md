# PassReady Quiz Pipeline

Local video-generation pipeline that turns NCMHCE practice questions (JSON) into
rendered quiz videos for the **PassReady Prep** YouTube channel.

Everything runs on your machine. No cloud services, no API keys, no accounts.

Two output formats:

| Composition | Size | Contents | Output |
| --- | --- | --- | --- |
| `QuizShort` | 1080×1920 vertical | one question | `out/shorts/<id>.mp4` |
| `QuizCompilation` | 1920×1080 horizontal | N questions back to back | `out/comp/<name>.mp4` |

---

## Requirements

- macOS (for the built-in `say` voice) — the render itself runs anywhere
- Node 18+
- Nothing else. Remotion downloads its own Chrome Headless Shell on first render,
  and ships its own `ffmpeg`/`ffprobe`.

## First run

```bash
npm install
npm run fonts:vendor        # once — downloads Outfit + Work Sans into public/fonts/
npm run tts -- all          # narration audio + timing.json for every question
npm run render:all-shorts   # one MP4 per question
```

Then, for a long-form video:

```bash
npm run render:comp -- PRP-Q-0001,PRP-Q-0002,PRP-Q-0003 --name=week-01
```

To preview and scrub interactively:

```bash
npm run studio
```

---

## Adding questions

Drop a JSON file in `questions/`. **The filename must match the `id` field.**

```json
{
  "id": "PRP-Q-0004",
  "family": "Anxiety Disorders",
  "vignette": "A 41-year-old client reports six months of...",
  "question": "What do you do FIRST?",
  "options": [
    { "text": "Rule out a medical contributor", "isCorrect": true },
    { "text": "Begin exposure hierarchy work", "isCorrect": false },
    { "text": "Teach diaphragmatic breathing", "isCorrect": false },
    { "text": "Refer for a medication evaluation", "isCorrect": false }
  ],
  "rationale": "Why the keyed answer is first, in two or three sentences.",
  "rung": 2,
  "difficulty": "core"
}
```

| Field | Required | Notes |
| --- | --- | --- |
| `id` | yes | must equal the filename |
| `family` | yes | shown as the chip on the hook and vignette scenes |
| `vignette` | yes | read verbatim; revealed sentence by sentence |
| `question` | yes | the stem, e.g. "What do you do FIRST?" |
| `options` | yes | 2–6 entries, **exactly one** with `"isCorrect": true`; labelled A–F in order |
| `rationale` | yes | read aloud over the rationale card |
| `rung` | no | positive integer; renders a "Priority Ladder — Rung N" chip. Omit it and no chip appears. |
| `difficulty` | no | metadata only, not rendered |

Then regenerate audio and render:

```bash
npm run tts -- PRP-Q-0004
npm run render:short -- PRP-Q-0004
```

`npm run tts` validates every question before writing anything, so a malformed
file fails loudly instead of producing a broken video.

---

## Regenerating TTS

```bash
npm run tts -- all                    # every question in questions/
npm run tts -- PRP-Q-0001             # one
npm run tts -- PRP-Q-0001,PRP-Q-0002  # several
```

Flags:

| Flag | Default | Meaning |
| --- | --- | --- |
| `--engine=<name>` | auto | `say` (macOS), `espeak-ng`, `estimate`, `manual` |
| `--voice="Name"` | best installed | `say` only |
| `--rate=<wpm>` | engine default | speaking rate |

Environment equivalents: `PRP_TTS_ENGINE`, `PRP_TTS_VOICE`, `PRP_TTS_RATE`.

### Voice selection

On macOS the script reads `say -v '?'` and picks the best voice actually
installed, in this order:

```
Samantha (Premium) → Samantha (Enhanced) → Ava (Premium) → Ava (Enhanced)
→ Allison (Premium) → Allison (Enhanced) → Samantha
```

To install a higher-quality voice: **System Settings → Accessibility → Spoken
Content → System Voice → Manage Voices**, then download the Enhanced or Premium
variant. Re-run `npm run tts -- all` and it will be picked up automatically.
Override the choice with `--voice="Ava (Premium)"`.

Audio is written as 48 kHz 16-bit WAV — `say` renders AIFF, then `afconvert`
converts it (falling back to `ffmpeg` if `afconvert` is unavailable). WAV is
what the renderer wants; there is no reason to also produce m4a.

### What gets written

```
public/audio/<id>/
  vignette.wav     the vignette, verbatim
  question.wav     the stem, then "A. …", "B. …", "C. …", "D. …"
  reveal.wav       "The answer is <letter>: <text>." then the rationale
  timing.json      measured durations + on-screen cue frames
```

`timing.json` is the contract between audio and video. Every `<Sequence>`
duration and every text reveal comes from it, so **scene timing always tracks
the real narration length** — a longer vignette simply produces a longer scene.
Durations are measured with `ffprobe` (Remotion's bundled copy if you have no
system ffmpeg), with a built-in WAVE-header reader as a last resort.

Within a scene, cue points are placed by character share of the narration:
option B appears when the voice is roughly at option B, the rationale card
slides up when the voice reaches the rationale.

---

## Using your own recorded voiceover

The pipeline never assumes the audio came from TTS. To use your own voice:

1. Record three files per question and save them at exactly these paths:

   ```
   public/audio/<id>/vignette.wav
   public/audio/<id>/question.wav
   public/audio/<id>/reveal.wav
   ```

   Any sample rate works. Read the same content as above — vignette verbatim,
   then the stem plus each option, then the answer line plus the rationale.

2. Re-measure and rebuild the timing, without synthesizing anything:

   ```bash
   npm run tts -- <id> --engine=manual
   ```

3. Render as usual. Scene lengths and every reveal now follow your recording.

`--engine=manual` fails with a clear error if a file is missing, so it will
never silently fall back to a robot voice. You can mix approaches freely —
hand-recorded audio for some questions, `say` for others.

### Optional countdown tick

Drop a 5-second loop at `public/audio/_shared/tick.wav` and it will play under
the countdown ring at 35% volume. If the file is absent the countdown is silent
(the ring still pulses once per second). Re-run `npm run tts` after adding it.

---

## Render commands

```bash
npm run render:short -- PRP-Q-0001              # out/shorts/PRP-Q-0001.mp4
npm run render:all-shorts                       # every question in questions/
npm run render:comp -- PRP-Q-0001,PRP-Q-0002    # out/comp/PRP-Q-0001_PRP-Q-0002.mp4
npm run render:comp -- all --name=week-01       # out/comp/week-01.mp4
```

Environment knobs:

| Variable | Meaning |
| --- | --- |
| `PRP_CONCURRENCY` | Remotion render concurrency. On an M4 Pro, `8` is a reasonable start. |
| `PRP_BROWSER_EXECUTABLE` | Path to a Chrome/Chromium binary, if you do not want Remotion to download its own. |
| `PRP_FFPROBE` | Path to an ffprobe binary, if you want a specific one. |

---

## Scene flow

### Short (1080×1920)

| # | Scene | Length | Contents |
| --- | --- | --- | --- |
| 1 | Hook | 3s fixed | "NCMHCE / What do you do FIRST?" + family chip |
| 2 | Vignette | narration | sentences reveal as they are read |
| 3 | Question + options | narration | stem, then A–D staggered to the voice |
| 4 | Countdown | 5s fixed | emerald ring drains, options stay visible, "Pause if you need more time" |
| 5 | Reveal | narration | correct option goes emerald, distractors flash muted red then dim, rationale card slides up, "Priority Ladder — Rung N" chip when `rung` is set |
| 6 | End card | 5s fixed | PRP monogram, "Full practice exams + 429 scored questions", study-guide line, app + `PASSREADY10` |

All copy sits at least **120px from the top** and **220px from the bottom** so
nothing collides with the Shorts UI (`SAFE` in `src/brand.ts`). The countdown
ring has a reserved slot that the option list never occupies, in either layout.

A typical question runs 70–85 seconds, not 40 — a full NCMHCE vignette, four
options and a rationale simply take that long to read aloud. Shorts allows up to
3 minutes, so this is fine. If you want ~40s, shorten the vignette to roughly 45
words or raise the speaking rate (`--rate=200`); the pipeline is duration-driven
and adapts either way.

### Compilation (1920×1080)

Same scene components at wide proportions. Each question omits its end card, a
1-second brand sting separates questions, and a single end card closes the
video.

---

## Brand tokens

Defined once in `src/brand.ts` and derived from there — no color is hardcoded
anywhere else.

| Token | Value | Use |
| --- | --- | --- |
| Mint gradient | `#EAF7F1` → `#DBF0E7` | background |
| Emerald | `#159E6E` | accents, correct answer, progress ring, network motif |
| Navy | `#1A364E` | primary text |
| Muted red | `#C0554D` | wrong-answer flash, used sparingly |

Fonts: **Outfit** (display) and **Work Sans** (body), both loaded from
`public/fonts/` after `npm run fonts:vendor`. The files come from
`@remotion/google-fonts`, but vendoring them means renders need no network. If
they have not been vendored, `src/fonts.ts` falls back to fetching them from
Google at render time.

The emerald network-polygon motif is pinned to the four corners at 17% opacity,
outside the text safe area — it never sits behind copy.

---

## Layout

```
questions/            authoring source, one JSON per question
public/data/          questions copied here so the compositions can fetch them
public/audio/<id>/    narration WAVs + timing.json
public/fonts/         vendored Outfit + Work Sans
out/shorts/           rendered Shorts
out/comp/             rendered compilations

src/
  brand.ts            colors, fps, frame sizes, safe margins
  types.ts            Question / QuestionTiming shapes
  fonts.ts            local-first font loading
  load.ts             fetch question + timing inside the composition
  Root.tsx            composition registry; calculateMetadata sets duration from timing.json
  QuestionBlock.tsx   maps timing.json scenes to <Sequence>s
  QuizShort.tsx       1080x1920
  QuizCompilation.tsx 1920x1080
  scenes/             Hook, Vignette, QuestionOptions, Countdown, Reveal, EndCard, BrandSting
  components/         Background, NetworkMotif, Chip, OptionList, CountdownRing, Monogram, ...

scripts/
  tts.mjs             narration + timing.json
  sync.mjs            copy questions to public/data
  vendor-fonts.mjs    download font files
  render-short.mjs / render-all-shorts.mjs / render-comp.mjs
  lib/                paths, question validation, audio engines, narration, timing constants
```

`out/`, `node_modules/` and generated audio are gitignored.

---

## Troubleshooting

**"Could not read audio/<id>/timing.json"** — run `npm run tts -- <id>` first.

**Fonts look wrong** — run `npm run fonts:vendor`. Without it the render needs
network access to `fonts.gstatic.com`.

**Narration and text drift apart** — `timing.json` is stale. Regenerate it after
editing a question's text: `npm run tts -- <id>`.

**Rendering is slow** — raise `PRP_CONCURRENCY`.

**No voice on the audio track** — `npm run tts` prints its engine on every run.
If it says `estimate`, no TTS binary was found and it wrote silent placeholders
of estimated length. On macOS that means `say` is missing from `PATH`.
