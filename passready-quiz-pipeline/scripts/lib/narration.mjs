const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

/** Split prose into sentences, then break over-long ones at a clause boundary. */
export const splitLines = (text, maxChars = 180) => {
  const sentences = text
    .replace(/\s+/g, ' ')
    .trim()
    .split(/(?<=[.!?]["')\]]?)\s+(?=[A-Z"'(])/)
    .filter(Boolean);

  const out = [];
  for (const sentence of sentences) {
    if (sentence.length <= maxChars) {
      out.push(sentence);
      continue;
    }
    // Break at the comma / semicolon closest to the middle.
    let remaining = sentence;
    while (remaining.length > maxChars) {
      const window = remaining.slice(0, maxChars);
      const cut = Math.max(
        window.lastIndexOf(', '),
        window.lastIndexOf('; '),
        window.lastIndexOf(' — '),
      );
      const at = cut > maxChars * 0.4 ? cut + 1 : window.lastIndexOf(' ');
      if (at <= 0) break;
      out.push(remaining.slice(0, at).trim());
      remaining = remaining.slice(at).trim();
    }
    if (remaining) out.push(remaining);
  }
  return out;
};

export const optionLetter = (i) => LETTERS[i] ?? String(i + 1);

/**
 * Narration for each narrated scene, as ordered segments.
 * The segment list is what drives on-screen cue timing: each segment gets a
 * share of the measured audio duration proportional to its character count.
 */
export const buildNarration = (question) => {
  const lines = splitLines(question.vignette);

  const questionSegments = [
    {key: 'question', text: question.question},
    ...question.options.map((o, i) => ({
      key: `option-${i}`,
      text: `${optionLetter(i)}. ${o.text}.`,
    })),
  ];

  const correctIndex = question.options.findIndex((o) => o.isCorrect);
  const correct = question.options[correctIndex];
  const revealSegments = [
    {
      key: 'answer',
      text: `The answer is ${optionLetter(correctIndex)}: ${correct.text}.`,
    },
    {key: 'rationale', text: question.rationale},
  ];

  return {
    vignette: {
      segments: lines.map((text, i) => ({key: `line-${i}`, text})),
    },
    question: {segments: questionSegments},
    reveal: {segments: revealSegments},
  };
};

export const joinSegments = (segments) =>
  segments.map((s) => s.text.trim()).join(' ');

/**
 * Start offset (in seconds) of each segment inside a recording, by character
 * share. An approximation, but it tracks real narration closely enough that
 * reveals land on the right words.
 */
export const segmentOffsets = (segments, totalSeconds) => {
  const weights = segments.map((s) => Math.max(1, s.text.trim().length));
  const total = weights.reduce((a, b) => a + b, 0);
  const offsets = [];
  let acc = 0;
  for (const w of weights) {
    offsets.push((acc / total) * totalSeconds);
    acc += w;
  }
  return offsets;
};
